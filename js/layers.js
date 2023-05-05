addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "test points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    effect() {
        mult = new ExpantaNum(player[this.layer].points).add(1)
        if (hasUpgrade(this.layer, "11")) mult = mult.pow(upgradeEffect(this.layer, "11"))
        if (hasUpgrade(this.layer, "16")) mult = mult.pow(upgradeEffect(this.layer, "16"))
        return mult
    },
    effectDescription() {
        return `which boost points gain by <h2 style="color: ${this.color}; text-shadow: 0px 0px 10px ${this.color}">${formatWhole(this.effect())}</h2>`
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade(this.layer, "12")) mult = mult.times(upgradeEffect(this.layer, "12"))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new ExpantaNum(1)
        if (hasUpgrade(this.layer, "13")) exp = exp.add(upgradeEffect(this.layer, "13"))
        exp = exp.add(tmp[this.layer].buyables["11"].effect)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for test points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration() {
        if (hasUpgrade(this.layer, "14")) return getResetGain(this.layer, "static")
        else return ExpantaNum(0)
    },
    automate() {
        if (hasUpgrade(this.layer, "16") && canBuyBuyable(this.layer, "11")) buyMaxBuyable(this.layer, "11")
        else if (hasUpgrade(this.layer, "15") && canBuyBuyable(this.layer, "11")) buyBuyable(this.layer, "11")
        //console.log(ExpantaNum(100).tetr(2).ssqrt().toString())
    },
    upgrades: {
        11: {
            title: "Test",
            description: "Squaer the test points effect.",
            cost: new ExpantaNum(10),
            effect() {
                return new ExpantaNum(2);
            },
        },
        12: {
            title: "Test2",
            description() { 
                return `Points multiply base test points gain.
                
                Currently: ${format(upgradeEffect(this.layer, "12"))}x`
            },
            cost: new ExpantaNum(1e10),
            effect() {
                return new ExpantaNum(player.points).add(10).logBase(10);
            },
        },
        13: {
            title: "Test3",
            description: "Increase test points gain exponent by 0.500.",
            cost: new ExpantaNum("1.798e308"),
            effect() {
                return new ExpantaNum(0.5);
            },
        },
        14: {
            title: "Test4",
            description: "Gain 100% of test points gain per second and unlock a buyable.",
            cost: new ExpantaNum("1e20000000"),
            effect() {
                return new ExpantaNum(0.5);
            },
        },
        15: {
            title: "Test5",
            description: "Automate buying testing test buyable.",
            cost: new ExpantaNum("e1.798e308"),
            effect() {
                return new ExpantaNum(0.5);
            },
        },
        16: {
            title: "Test6",
            description() {
                return "Points rise the test points effect.\n\
                \n\
                Currently: ^" + format(upgradeEffect(this.layer, "16"))
            },
            cost: new ExpantaNum("e1.111e1111"),
            effect() {
                return new ExpantaNum(player.points).add(10).logBase(10).pow(0.2);
            },
        },
    },
    buyables: {
        11: {
            title: "Testing test",
            cost(x) { 
                let cost = ExpantaNum.pow("1e20000025", x.tetr(2).times(0.0000001).add(1))
                return cost.floor()
            },
            effect(x) {
                let eff = ExpantaNum(0).add(x).times(0.1)
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " test points\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Adds +" + format(data.effect) + " to test points gain exponent"
            },
            unlocked() { return hasUpgrade(this.layer, "14") }, 
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buyMax() {
                let amt = ExpantaNum(player[this.layer].points).logBase("1e20000025").ssqrt().times(10000000).sub(1).floor()
                setBuyableAmount(this.layer, this.id, amt)
            },
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
})
