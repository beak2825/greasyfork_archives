// ==UserScript==
// @name        Melvor Auto Farming
// @namespace   github.com/gmiclotte
// @version     1.9
// @description Automatically plants your seeds, prioritizes highest level tree seed, and equal allotment and herb produce. Comment seeds you don't want to plant and equipment you don't want to use.
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
// @downloadURL https://update.greasyfork.org/scripts/419699/Melvor%20Auto%20Farming.user.js
// @updateURL https://update.greasyfork.org/scripts/419699/Melvor%20Auto%20Farming.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    function startAutoFarming() {
        window.maf = {}
        maf.log = (...x) => {
            console.log('Melvor Auto Farming:', ...x);
        }
        maf.allotmentPriority = 'amount';
        maf.herbPriority = 'amount';
        maf.treePriority = 'level';
        maf.amountLimit = 1e5; // after reaching this amount of crops, aim for highest level seeds again
        maf.allotmentSeedOrder = [
            Items.Potato_Seed,
            Items.Onion_Seed,
            Items.Cabbage_Seed,
            Items.Tomato_Seed,
            Items.Sweetcorn_Seed,
            Items.Strawberry_Seed,
            Items.Cherry_Seeds,
            Items.Watermelon_Seed,
            Items.Snape_Grass_Seed,
            Items.Carrot_Seeds,
        ];
        maf.herbSeedOrder = [
            Items.Garum_Seed,
            Items.Sourweed_Seed,
            Items.Mantalyme_Seed,
            Items.Lemontyle_Seed,
            Items.Oxilyme_Seed,
            Items.Poraxx_Seed,
            Items.Pigtayle_Seed,
            Items.Barrentoe_Seed,
        ];
        maf.treeSeedOrder = [
            Items.Oak_Tree_Seed,
            Items.Willow_Tree_Seed,
            Items.Maple_Tree_Seed,
            Items.Yew_Tree_Seed,
            Items.Apple_Tree_Seeds,
            Items.Magic_Tree_Seed,
        ];

        // gear
        maf.farmGear = {
            Cape: [],
            Weapon: [
                Items.Bobs_Rake,
            ],
            Ring: [
                Items.Aorpheats_Signet_Ring,
                Items.Ancient_Ring_Of_Mastery,
                Items.Ancient_Ring_Of_Skills,
            ],
        };
        if (completionStats >= 100) {
            maf.farmGear.Cape.push(Items.Cape_of_Completion);
        }
        if (checkRequirements(items[Items.Max_Skillcape].equipRequirements, false, '')) {
            maf.farmGear.Cape.push(Items.Max_Skillcape);
        }
        maf.farmGear.Cape.push(Items.Farming_Skillcape);

        maf.checkGrown = function () {
            for (let j = 0; j < newFarmingAreas.length; j++) {
                for (let i = 0; i < newFarmingAreas[j].patches.length; i++) {
                    let patch = newFarmingAreas[j].patches[i]
                    if (!patch.unlocked) {
                        continue;
                    }
                    if (patch.hasGrown) {
                        return true;
                    }
                }
            }
            return false
        }

        maf.checkEmpty = function () {
            for (let j = 0; j < newFarmingAreas.length; j++) {
                for (let i = 0; i < newFarmingAreas[j].patches.length; i++) {
                    let patch = newFarmingAreas[j].patches[i]
                    if (!patch.unlocked) {
                        continue;
                    }
                    if (patch.seedID === 0) {
                        return true;
                    }
                }
            }
            return false
        }

        maf.harvest = function () {
            for (let j = 0; j < newFarmingAreas.length; j++) {
                for (let i = 0; i < newFarmingAreas[j].patches.length; i++) {
                    if (newFarmingAreas[j].patches[i].hasGrown) {
                        harvestSeed(j, i);
                    }
                }
            }
        }

        // helper methods
        maf.checkEquipped = (valid, slot) => {
            for (let i = 0; i < valid.length; i++) {
                if (combatManager.player.equipment.slots[slot].item.id === valid[i]) {
                    return true;
                }
            }
            return false;
        };

        maf.swapEquipped = (valid, slot) => {
            if (!maf.checkEquipped(valid, slot)) {
                for (let i = 0; i < valid.length; i++) {
                    if (checkBankForItem(valid[i])) {
                        combatManager.player.equipItem(valid[i], 0, slot, 1);
                        return true;
                    }
                }
            }
            return false;
        };

        maf.harvestWithGear = function () {
            if (combatManager.isInCombat) {
                maf.harvest();
                return;
            }
            // swap harvest gear
            // variables
            let swapped = {};
            let current = {};

            // save Shield since it might be unequipped when equipping weapon
            current.Shield = combatManager.player.equipment.slots.Shield.occupiedBy === 'None' ? combatManager.player.equipment.slots.Shield.item.id : -1;

            // swap gear
            Object.getOwnPropertyNames(maf.farmGear).forEach(slot => {
                if (swapped[slot]) {
                    // already swapped higher priority item
                    return;
                }
                current[slot] = combatManager.player.equipment.slots[slot].item.id;
                swapped[slot] = maf.swapEquipped(maf.farmGear[slot], slot);
            });

            // harvest
            maf.harvest()

            // swap back gear
            Object.getOwnPropertyNames(maf.farmGear).forEach(slot => {
                if (swapped[slot] && current[slot] !== -1) {
                    combatManager.player.equipItem(current[slot], 0, slot, 1);
                }
            });
            if (swapped.Weapon && current.Shield !== -1) {
                combatManager.player.equipItem(current.Shield, 0, 'Shield', 1);
            }
        }

        maf.farm = function (idx, seedCount, seedOrder, priority = "level") {
            // count patches
            let totalPatches = newFarmingAreas[idx].patches.filter(x => x.unlocked);
            let emptyPatches = totalPatches.filter(x => x.seedID === 0).length;
            // find seed with sufficient seeds
            let chosenSeed = 0;
            let required = emptyPatches * seedCount;
            let minAmt = Infinity;
            for (let h = 0; h < seedOrder.length; h++) {
                let seed = seedOrder[h];
                if (skillLevel[Skills.Farming] < items[seed].farmingLevel) {
                    continue;
                }
                if (!checkBankForItem(seed)) {
                    continue;
                }
                if (bank[getBankId(seed)].qty < required) {
                    continue;
                }
                let choose = false;
                if (priority === "level") {
                    choose = true
                } else if (priority === "amount") {
                    let grownAmt = 0;
                    if (checkBankForItem(items[seed].grownItemID)) {
                        grownAmt = bank[getBankId(items[seed].grownItemID)].qty;
                    }
                    if (grownAmt < minAmt) {
                        choose = true;
                        minAmt = grownAmt;
                    }
                    if (minAmt > maf.amountLimit) {
                        // fallback to highest level priority
                        choose = true;
                    }
                }
                if (choose) {
                    chosenSeed = seed;
                }
            }
            // insufficient seeds
            if (chosenSeed === 0) {
                return;
            }
            // plant seeds
            totalPatches.forEach((patch, i) => {
                if (patch.seedID === 0) {
                    if (!patch.gloop && checkBankForItem(679) !== false && bank[getBankId(679)].qty > 0) {
                        addGloop(idx, i);
                    }
                    selectedPatch = [idx, i];
                    selectSeed(chosenSeed);
                    plantSeed();
                }
            });
        }

        maf.autoFarming = setInterval(() => {
            try {
                if (maf.checkGrown()) {
                    maf.harvestWithGear();
                }
                if (!maf.checkEmpty()) {
                    return;
                }
                maf.farm(0, 3, maf.allotmentSeedOrder, maf.allotmentPriority);
                maf.farm(1, 2, maf.herbSeedOrder, maf.herbPriority);
                maf.farm(2, 1, maf.treeSeedOrder, maf.treePriority);
            } catch (e) {
                // catch and ignore newFarmingAreas is not defined
                // everything seems to work fine, but it still throws this error...
                if (e.message !== "newFarmingAreas is not defined") {
                    maf.log(e);
                }
            }
        }, 5000);

        ///////
        //log//
        ///////
        maf.log('Loaded');
    }

    function loadScript() {
        if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            startAutoFarming();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});