// ==UserScript==
// @name		Melvor Astrology Reroller
// @namespace	http://tampermonkey.net/
// @version		0.0.1
// @description	Automates constellation modifier rerolling based on desired targets. Console only, no user interface. See the `astrologyRerollerExample` function for a usage example.
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/441426/Melvor%20Astrology%20Reroller.user.js
// @updateURL https://update.greasyfork.org/scripts/441426/Melvor%20Astrology%20Reroller.meta.js
// ==/UserScript==


((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    window.AstrologyReroller = class {
        constructor() {
            this.index = undefined;
            this.constellation = undefined;
            this.limit = Infinity;
        }

        setConstellation(index) {
            this.index = index;
            this.constellation = Astrology.constellations[this.index];
            this.constellation = Astrology.constellations[this.index];
        }

        template(index) {
            const constellation = Astrology.constellations[index];
            const t = {
                standardMin: 0,
                standardMods: [],
                uniqueMin: 0,
                uniqueMods: [],
            };
            for (let i = 0; i < 2; i++) {
                const skill = constellation.skills[i];
                constellation.standardModifiers[i].forEach(m => t.standardMods.push([m, Skills[skill]]));
                constellation.uniqueModifiers[i].forEach(m => t.standardMods.push([m, Skills[skill]]));
            }
            return t;
        }

        isValidTarget(targets) {
            if (this.constellation === undefined) {
                return false;
            }
            if (targets.standardMin > 5) {
                console.error(`Invalid standard modifier target% ${targets.standardMin}`);
                return false
            }
            for (const mod of targets.standardMods) {
                let skillIndex = this.constellation.skills.indexOf(mod[1]);
                if (skillIndex === -1) {
                    skillIndex = this.constellation.skills.indexOf(Skills[mod[1]]);
                }
                if (skillIndex === -1) {
                    console.error(`Invalid skill id in standard modifier ${mod} of constellation ${this.constellation.name}`);
                    return false
                }
                if (!this.constellation.standardModifiers[skillIndex].includes(mod[0])) {
                    console.error(`Invalid standard modifier ${mod} of constellation ${this.constellation.name}`);
                    return false;
                }
            }
            if (targets.uniqueMin > 5) {
                console.error(`Invalid unique modifier target% ${targets.uniqueMin}`);
                return false
            }
            for (const mod of targets.uniqueMods) {
                let skillIndex = this.constellation.skills.indexOf(mod[1]);
                if (skillIndex === -1) {
                    skillIndex = this.constellation.skills.indexOf(Skills[mod[1]]);
                }
                if (skillIndex === -1) {
                    console.error(`Invalid skill id in unique modifier ${mod} of constellation ${this.constellation.name}`);
                    return false
                }
                if (!this.constellation.uniqueModifiers[skillIndex].includes(mod[0])) {
                    console.error(`Invalid unique modifier ${mod} of constellation ${this.constellation.name}`);
                    return false;
                }
            }
            return true;
        }

        reroll(targets) {
            if (targets === undefined) {
                targets = this.targets[this.index];
            }
            const rerolls = {
                oneStandard: 0,
                oneUnique: 0,
                // reroll all until at least one hit
                ...this.rerollAll(targets),
            }
            if (!this.isValidTarget(targets)) {
                return rerolls;
            }
            // reroll single standard until hit
            let notMet = this.checkStandard(targets);
            while (notMet.length > 0) {
                // check dust
                const dust = Items.Stardust;
                const costs = new Costs();
                const qty = game.astrology.rerollIndividualQuantity * notMet.length;
                costs.addItem(dust, qty);
                if (!costs.checkIfOwned()) {
                    console.warn(`Insufficient ${items[dust].name} for ${notMet.length} individual rerolls, need ${qty}`);
                    break;
                }
                // reroll
                notMet.forEach(modID => game.astrology.rerollSpecificStandardModifier(this.constellation, modID));
                rerolls.oneStandard += notMet.length;
                notMet = this.checkStandard(targets);
                if (rerolls.oneStandard > this.limit) {
                    break;
                }
            }
            // reroll single unique until hit
            notMet = this.checkUnique(targets);
            while (notMet.length > 0) {
                // check dust
                const dust = Items.Golden_Stardust;
                const costs = new Costs();
                const qty = game.astrology.rerollIndividualQuantity * notMet.length;
                costs.addItem(dust, qty);
                if (!costs.checkIfOwned()) {
                    console.warn(`Insufficient ${items[dust].name} for ${notMet.length} individual rerolls, need ${qty}`);
                    break;
                }
                // reroll
                notMet.forEach(modID => game.astrology.rerollSpecificUniqueModifier(this.constellation, modID));
                rerolls.oneUnique += notMet.length;
                notMet = this.checkUnique(targets);
                if (rerolls.oneUnique > this.limit) {
                    break;
                }
            }
            // compute star dust used
            rerolls.Stardust = rerolls.oneStandard * game.astrology.rerollIndividualQuantity + rerolls.allStandard * Astrology.rerollAllQuantity;
            rerolls.Golden_Stardust = rerolls.oneUnique * game.astrology.rerollIndividualQuantity + rerolls.allUnique * Astrology.rerollAllQuantity;
            // return number of rerolls
            return rerolls;
        }

        rerollAll(targets) {
            if (targets === undefined) {
                targets = this.targets[this.index];
            }
            const rerolls = {
                allStandard: 0,
                allUnique: 0,
            }
            if (!this.isValidTarget(targets)) {
                return rerolls;
            }
            // reroll all standard until at least one hit
            let notMet = this.checkStandard(targets);
            while (notMet.length === game.astrology.constellationModifiers.get(this.constellation).standard.length) {
                // check dust
                const dust = Items.Stardust;
                const costs = new Costs();
                costs.addItem(dust, Astrology.rerollAllQuantity);
                if (!costs.checkIfOwned()) {
                    console.warn(`Insufficient ${items[dust].name} to reroll all, need ${Astrology.rerollAllQuantity}`);
                    break;
                }
                // reroll
                game.astrology.rerollAllStandardModifiers(this.constellation);
                rerolls.allStandard++;
                notMet = this.checkStandard(targets);
                if (rerolls.allStandard > this.limit) {
                    break;
                }
            }
            // reroll all unique until at least one hit.
            notMet = this.checkUnique(targets);
            while (notMet.length === game.astrology.constellationModifiers.get(this.constellation).unique.length) {
                // check dust
                const dust = Items.Golden_Stardust;
                const costs = new Costs();
                costs.addItem(dust, Astrology.rerollAllQuantity);
                if (!costs.checkIfOwned()) {
                    console.warn(`Insufficient ${items[dust].name} to reroll all, need ${Astrology.rerollAllQuantity}`);
                    break;
                }
                // reroll
                game.astrology.rerollAllUniqueModifiers(this.constellation);
                rerolls.allUnique++;
                notMet = this.checkUnique(targets);
                if (rerolls.allUnique > this.limit) {
                    break;
                }
            }
            // return number of rerolls
            return rerolls;
        }

        checkStandard(targets) {
            const cmods = game.astrology.constellationModifiers.get(this.constellation).standard;
            return this.checkAllTarget(cmods, targets.standardMin, targets.standardMods);
        }

        checkUnique(targets) {
            const cmods = game.astrology.constellationModifiers.get(this.constellation).unique;
            return this.checkAllTarget(cmods, targets.uniqueMin, targets.uniqueMods);
        }

        checkAllTarget(cmods, min, mods) {
            let notMet = [];
            for (let i = 0; i < cmods.length; i++) {
                if (!this.checkTarget(cmods[i], min, mods)) {
                    notMet.push(i);
                }
            }
            return notMet;
        }

        checkTarget(cmod, min, mods) {
            if (mods.length === 0) {
                return true;
            }
            for (const t of mods) {
                if (cmod.key === t[0]) {
                    if (cmod.value !== undefined) {
                        return cmod.value >= min;
                    }
                    if (cmod.values[0][0] === Skills[t[1]] || cmod.values[0][0] === t[1]) { //skill id and skill name are both checked
                        return cmod.values[0][1] >= min;
                    }
                }
            }
            return false;
        }
    }


    // example illustrating how to use this
    window.astrologyRerollerExample = function () {
        // create object
        const reroller = new AstrologyReroller();

        // set the constellation to reroll
        reroller.setConstellation(5);

        // return targets template
        reroller.template(reroller.index);

        // set targets
        reroller.targets = {};
        reroller.targets[reroller.index] = {
            // minimal target to stop rolling
            standardMin: 5,
            // list of standard mods you want to roll, format is [modifier name, skill name]
            standardMods: [
                ["increasedHiddenSkillLevel", "Ranged"], // you can pass the skill name
                ["increasedGlobalAccuracy", Skills.Ranged], // you can pass the skill ID
            ],
            // minimal target % to stop rolling
            uniqueMin: 5,
            // list of unique mods you want to roll, format is [modifier name, skill name]
            uniqueMods: [
                ["increasedRangedStrengthBonus", "Ranged"],
            ]
        }

        // reroll until targets met
        return reroller.reroll();
    }

    function loadScript() {
        if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});