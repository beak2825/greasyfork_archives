// ==UserScript==
// @name		Melvor Summoning Simulator
// @namespace	http://tampermonkey.net/
// @version		0.0.4
// @description	Melvor Summoning Simulator, see examples to run it.
// @grant		none
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
// @downloadURL https://update.greasyfork.org/scripts/440993/Melvor%20Summoning%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/440993/Melvor%20Summoning%20Simulator.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    class SumSim {
        constructor(debug = false) {
            this.debugFlag = debug;
            this.current = undefined;
        }

        debug(...args) {
            if (this.debugFlag) {
                console.log(...args);
            }
        }

        log(...args) {
            console.log(...args);
        }

        getInitial() {
            return {
                startXP: 0,
                startMasteryXP: 0,
                startMasteryLevels: MILESTONES.Summoning.length - 1,
                startPoolXP: 0,
                // accumulator for costs of different iterations
                endCosts: new Costs(),
            };
        }

        getUnlockedItems(level) {
            let count = 0;
            const milestones = MILESTONES.Summoning;
            for (let i = 0; i < milestones.length; i++) {
                if (level >= milestones[i].level) count++;
                else break;
            }
            return count;
        }

        baseMasteryXpToAdd(unlockedItems, masteryLevel, currentTotalMastery) {
            //XP per Action = ((Total unlocked items for skill * current total Mastery level for skill / total Mastery level of skill) + (Mastery level of action * (total items in skill / 10))) * time per action (seconds) / 2
            this.debug('term1', unlockedItems, currentTotalMastery, getTotalMasteryLevelForSkill(Skills.Summoning));
            const term1 = unlockedItems * currentTotalMastery / getTotalMasteryLevelForSkill(Skills.Summoning);
            this.debug('term2', masteryLevel, getTotalItemsInSkill(Skills.Summoning));
            const term2 = masteryLevel * getTotalItemsInSkill(Skills.Summoning) / 10;
            const timeFactor = game.summoning.masteryModifiedInterval / 1000 / 2;
            this.debug('base mastery xp', term1, term2, timeFactor);
            return (term1 + term2) * timeFactor;
        }

        masteryXpModifier(pool) {
            let xpModifier = 0;
            if (pool >= masteryCheckpoints[0]) {
                xpModifier += 5;
            }
            if (getMasteryPoolProgress(CONSTANTS.skill.Firemaking) >= masteryCheckpoints[3]) {
                xpModifier += 5;
            }
            for (let i = 0; i < MASTERY[CONSTANTS.skill.Firemaking].xp.length; i++) {
                if (getMasteryLevel(CONSTANTS.skill.Firemaking, i) >= 99) xpModifier += 0.25;
            }
            xpModifier += playerModifiers.increasedGlobalMasteryXP - playerModifiers.decreasedGlobalMasteryXP;
            xpModifier += getTotalFromModifierArray("increasedMasteryXP", Skills.Summoning) - getTotalFromModifierArray("decreasedMasteryXP", Skills.Summoning);
            return xpModifier;
        }

        masteryXpFinal(base, xpModifier) {
            return Math.max(applyModifier(base, xpModifier), 1);
        }

        addNonShardCosts(recipe, altID, costs) {
            const itemID = recipe.nonShardItemCosts[altID];
            const item = items[itemID];
            const salePrice = Math.max(20, item.sellsFor);
            const itemValueRequired = Summoning.recipeGPCost * (1 - this.getNonShardCostReductionModifier(recipe) / 100);
            const qtyToAdd = Math.max(1, Math.floor(itemValueRequired / salePrice));
            costs.addItem(itemID, qtyToAdd);
        }

        isPoolTierActive(tier) {
            return this.current.currentPool >= masteryCheckpoints[tier];
        }

        modifyItemCost(itemID, quantity, recipe) {
            const masteryLevel = this.current.currentMastery;
            const item = items[itemID];
            if (item.type === 'Shard') {
                // Level 50 Mastery: +1 Shard Cost Reduction
                if (masteryLevel >= 50)
                    quantity--;
                // Level 99 Mastery: +1 Shard Cost Reduction
                if (masteryLevel >= 99)
                    quantity--;
                // Generic Shard Cost Decrease modifier
                quantity += player.modifiers.increasedSummoningShardCost - player.modifiers.decreasedSummoningShardCost;
                // Tier 2 Mastery Pool: +1 Shard Cost Reduction for Tier 1 and Tier 2 Tablets
                if ((recipe.tier === 1 || recipe.tier === 2) && this.isPoolTierActive(1))
                    quantity--;
                // Tier 4 Mastery Pool: +1 Shard Cost Reduction for Tier 3 Tablets
                if (recipe.tier === 3 && this.isPoolTierActive(2))
                    quantity--;
            }
            return Math.max(1, quantity);
        }

        modifyGPCost(recipe) {
            let gpCost = recipe.gpCost;
            gpCost *= 1 - this.getNonShardCostReductionModifier(recipe) / 100;
            return Math.max(1, Math.floor(gpCost));
        }

        modifySCCost(recipe) {
            let scCost = recipe.scCost;
            scCost *= 1 - this.getNonShardCostReductionModifier(recipe) / 100;
            return Math.max(1, Math.floor(scCost));
        }

        getNonShardCostReductionModifier(recipe) {
            const masteryLevel = this.current.currentMastery;
            let modifier = 0;
            // Non-Shard Cost reduction that scales with mastery level
            modifier += Math.floor(masteryLevel / 10) * 5;
            // Level 99 Mastery: +5% Non Shard Cost Reduction
            if (masteryLevel >= 99)
                modifier += 5;
            return modifier;
        }

        superGetRecipeCosts(recipe) {
            const costs = new Costs();
            recipe.itemCosts.forEach(({id, qty}) => {
                qty = this.modifyItemCost(id, qty, recipe);
                if (qty > 0)
                    costs.addItem(id, qty);
            });
            if (recipe.gpCost > 0)
                costs.addGP(this.modifyGPCost(recipe));
            if (recipe.scCost > 0)
                costs.addSlayerCoins(this.modifySCCost(recipe));
            return costs;
        }

        getAltRecipeCosts(recipe, altID) {
            const costs = this.superGetRecipeCosts(recipe);
            if (recipe.nonShardItemCosts.length > 0)
                this.addNonShardCosts(recipe, altID, costs);
            return costs;
        }

        getPreservationChance(chance = 0) {
            // Tier 3 Mastery Pool: +10% Resource Preservation chance
            if (this.isPoolTierActive(2))
                chance += 10;
            return this.superGetPreservationChance(chance);
        }

        superGetPreservationChance(chance) {
            chance += player.modifiers.increasedGlobalPreservationChance - player.modifiers.decreasedGlobalPreservationChance;
            chance += player.modifiers.getSkillModifierValue('increasedSkillPreservationChance', Skills.Summoning);
            chance -= player.modifiers.getSkillModifierValue('decreasedSkillPreservationChance', Skills.Summoning);
            return Math.min(chance, 80);
        }

        addCosts(source, target, amount = 1) {
            target.addGP(source._gp * amount);
            target.addSlayerCoins(source._sc * amount);
            source._items.forEach((amt, id) => {
                target.addItem(id, amt * amount);
            });
            return target;
        }

        plan(current, targetLevel, summonID, actionInterval, altID = 0, quiet = false) {
            // these values are used and updated in each iteration
            current.currentCosts = new Costs();
            current.currentMastery = Math.min(99, exp.xp_to_level(current.startMasteryXP) - 1);
            current.currentPool = current.endPool ?? 0;
            // set this.current
            this.current = current;
            const targetXP = exp.level_to_xp(targetLevel) + 1e-5;
            this.debug('target xp', targetXP);
            const mark = Summoning.marks[summonID];
            const consumptionXP = Summoning.getTabletConsumptionXP(summonID, actionInterval);
            const otherMasteryLevels = current.startMasteryLevels - (exp.xp_to_level(current.startMasteryXP) - 1);
            let xp = current.startXP;
            let masteryXP = current.startMasteryXP;
            let poolXP = current.startPoolXP;
            const maxPool = getMasteryPoolTotalXP(Skills.Summoning);
            let totalActions = 0;
            let totalTablets = 0;
            while (xp < targetXP) {
                const level = Math.min(99, exp.xp_to_level(xp) - 1);
                this.debug('level', level);
                // determine actions to mastery change
                const masteryLevel = Math.min(99, exp.xp_to_level(masteryXP) - 1);
                const masteryPerAction = this.masteryXpFinal(
                    this.baseMasteryXpToAdd(this.getUnlockedItems(level), masteryLevel, masteryLevel + otherMasteryLevels),
                    this.masteryXpModifier(poolXP / maxPool * 100),
                )
                const actionsToMasteryLevel = masteryLevel >= 99 ? Infinity : (exp.level_to_xp(masteryLevel + 1) + 1e-5 - masteryXP) / masteryPerAction;
                // determine actions to pool change
                const poolPerAction = masteryPerAction / (level >= 99 ? 2 : 4);
                const actionsToPoolCheckpoint = ([.10, .25, .50, .95, Infinity].find(x => x > poolXP / maxPool) * maxPool - poolXP) / poolPerAction;
                // compute tablets per action
                let tabletsPerAction = mark.baseQuantity;
                if (masteryLevel >= 99) {
                    tabletsPerAction += 10;
                }
                if (poolXP / maxPool > .95) {
                    tabletsPerAction += 10;
                }
                tabletsPerAction += player.modifiers.increasedSummoningCreationCharges - player.modifiers.decreasedSummoningCreationCharges;
                // compute xp per action
                let xpMultiplier = 1;
                xpMultiplier += getTotalFromModifierArray("increasedSkillXP", Skills.Summoning) / 100;
                xpMultiplier -= getTotalFromModifierArray("decreasedSkillXP", Skills.Summoning) / 100;
                xpMultiplier += (playerModifiers.increasedGlobalSkillXP - playerModifiers.decreasedGlobalSkillXP) / 100;
                const xpPerAction = xpMultiplier * (mark.baseXP + tabletsPerAction * consumptionXP);
                // compute actions to target
                const actionsToTarget = (targetXP - xp) / xpPerAction;
                // compute total actions
                this.debug('actions', actionsToTarget, actionsToMasteryLevel, actionsToPoolCheckpoint)
                const actions = Math.ceil(Math.min(actionsToTarget, actionsToMasteryLevel, actionsToPoolCheckpoint));
                totalActions += actions;
                totalTablets += actions * tabletsPerAction;
                // compute rewards for this iteration
                this.debug('rewards', xpPerAction, masteryPerAction, poolPerAction);
                const rewardXP = actions * xpPerAction;
                const rewardMastery = actions * masteryPerAction;
                const rewardPool = actions * poolPerAction;
                // add rewards to running totals
                xp += rewardXP;
                masteryXP += rewardMastery;
                poolXP += rewardPool;
                this.debug(`${xp} (+${rewardXP})xp; ${masteryXP} (+${rewardMastery}) mxp; ${poolXP} (+${rewardPool}) pool`);
                this.debug(`${exp.xp_to_level(xp) - 1} level; ${exp.xp_to_level(masteryXP) - 1} mastery; ${100.0 * poolXP / maxPool}% pool`);
                // compute costs for this iteration
                const costs = this.getAltRecipeCosts(mark, altID);
                // add costs to running totals
                this.addCosts(costs, current.currentCosts, Math.ceil(actions * (1 - this.getPreservationChance() / 100)));
                // these values should be updated, they are used in this iteration
                current.currentMastery = Math.min(99, exp.xp_to_level(masteryXP) - 1);
                current.currentPool = 100.0 * poolXP / maxPool;
            }
            if (!quiet) {
                this.log(`${totalActions} actions; ${totalTablets} tablets; ${xp} xp; ${masteryXP} mxp; ${poolXP} pool`);
                this.log(`costs:`)
                current.currentCosts._items.forEach((amt, id) => this.log(`${amt} ${Items[id]}`))
                if (current.currentCosts._gp > 0) {
                    this.log(`${current.currentCosts._gp} gp`)
                }
                if (current.currentCosts._sc > 0) {
                    this.log(`${current.currentCosts._sc} sc`);
                }
                this.log(`${exp.xp_to_level(xp) - 1} level; ${Math.min(99, exp.xp_to_level(masteryXP) - 1)} mastery; ${100.0 * poolXP / maxPool}% pool`);
            }
            // check if we used a new type of tablet
            const tabletTypesUsed = current.tabletTypesUsed ?? {};
            if (consumptionXP > 0) {
                tabletTypesUsed[mark.itemID] = true;
            }
            // clear this.current and return current
            current = {
                // these values are used by next iteration
                startXP: xp,
                startMasteryXP: 0, // this is set to 0 since typically we continue with a different action
                startMasteryLevels: otherMasteryLevels + Math.min(99, exp.xp_to_level(masteryXP) - 1),
                startPoolXP: poolXP,
                currentCosts: new Costs(),
                // additional values in case we want to log something
                endCosts: this.addCosts(current.currentCosts, current.endCosts),
                endLevel: exp.xp_to_level(xp) - 1,
                endMasteryXP: masteryXP,
                endMastery: Math.min(99, exp.xp_to_level(masteryXP) - 1),
                endPool: 100.0 * poolXP / maxPool,
                endActions: totalActions,
                endTablets: totalTablets,
                tabletTypesUsed: tabletTypesUsed,
            }
            this.current = undefined;
            this.log(' ');
            return current;
        }

        processPlanOutcome(current) {
            this.log(' ');
            this.log(`total raw costs:`);
            current.endCosts._items.forEach((amt, id) => this.log(`${amt} ${Items[id]}`))
            if (current.endCosts._gp > 0) {
                this.log(`${current.endCosts._gp} gp`)
            }
            if (current.endCosts._sc > 0) {
                this.log(`${current.endCosts._sc} sc`);
            }
            this.log(' ');

            let gpCost = current.endCosts._gp;
            current.endCosts._items.forEach((qty, x) => {
                if (items[x].category === 'Summoning' && items[x].type === 'Shard') {
                    gpCost += items[x].buysFor * qty;
                }
            });
            this.log(`actual gp cost: ${gpCost}`);

            let newItems = 0;
            Object.getOwnPropertyNames(current.tabletTypesUsed).forEach(x => {
                x = Number(x);
                if (game.stats.Items.get(x, ItemStats.TimesFound) === 0) {
                    newItems++;
                }
            });
            current.endCosts._items.forEach((_, x) => {
                x = Number(x);
                if (game.stats.Items.get(x, ItemStats.TimesFound) === 0) {
                    newItems++;
                }
            });
            this.log(`new items required: ${newItems}`);

            const masteryLevelsGained = current.startMasteryLevels - (MILESTONES.Summoning.length - 1);
            this.log(`mastery level gain: ${masteryLevelsGained}`);
        }
    }

    window.sumSim = new SumSim(false);

    // note: SumSim assumes you use all tablets immediately upon creation

    // scenario 1
    // Ent to 5, 1300ms wc actions (dragon axe, normal tree, mastery = 99, no other speed modifiers)
    // Mole to 99, 2200ms mining actions (mithril pickaxe, >50% pool)
    sumSim.example1 = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 5, Summons.Ent, 1300, 0);
        current.startMasteryXP = 0; // different action, so reset mastery xp
        current = sumSim.plan(current, 99, Summons.Mole, 2200, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

    // scenario 2
    // Ent to 5, don't use tablets ( == 0ms wc actions)
    // Mole to 99, 2200ms mining actions (mithril pickaxe, >50% pool)
    sumSim.example2 = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 5, Summons.Ent, 0, 0);
        current.startMasteryXP = 0; // different action, so reset mastery xp
        current = sumSim.plan(current, 99, Summons.Mole, 2200, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

    // scenario 3
    // Ent to 45, 1300ms wc actions (dragon axe, normal tree, mastery = 99, no other speed modifiers)
    // Leprechaun to 99, 2600ms thieving actions
    sumSim.example3 = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 45, Summons.Ent, 1300, 0);
        current.startMasteryXP = 0; // different action, so reset mastery xp
        current = sumSim.plan(current, 99, Summons.Leprechaun, 2600, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

    // scenario 4
    // Ent to 15, 1300ms wc actions (dragon axe, normal tree, mastery = 99, no other speed modifiers)
    // Octopus to 99, 6000ms fishing actions (bronze fishing rod)
    sumSim.example4 = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 45, Summons.Ent, 1300, 0);
        current.startMasteryXP = 0; // different action, so reset mastery xp
        current = sumSim.plan(current, 99, Summons.Octopus, 6000, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

    // scenario 5
    // Ent to 99, 1300ms wc actions (dragon axe, normal tree, mastery = 99, no other speed modifiers)
    sumSim.example5 = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 99, Summons.Ent, 1300, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

    // scenario 6
    // Golbin to 99, 3000ms combat actions (fixed)
    sumSim.example6 = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 99, Summons.GolbinThief, 3000, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

    // scenario 7
    // Ent to 99, no tablets
    sumSim.fuckit = () => {
        let current = sumSim.getInitial();
        current = sumSim.plan(current, 99, Summons.Ent, 0, 0);
        sumSim.processPlanOutcome(current);
        return current;
    }

});