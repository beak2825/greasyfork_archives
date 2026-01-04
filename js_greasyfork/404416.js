// ==UserScript==
// @name         Melvor Auto Farming Mastery
// @version      1.2.4
// @description  Automatically plants your lowest mastery seeds.
// @author       JHawk55
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/404416/Melvor%20Auto%20Farming%20Mastery.user.js
// @updateURL https://update.greasyfork.org/scripts/404416/Melvor%20Auto%20Farming%20Mastery.meta.js
// ==/UserScript==
//
// WARNING: Before using this script (or any other), download a copy of your save.
// Read ALL of the notes up here before using this script.
//
// This function was designed for Melvor 0.17 on Google Chrome. If any bugs are found,
// dm JHawk55 on the Melvor discord.
//
// IMPORTANT: This function assumes that you have enough seeds to plant the crop
// w/ lowest mastery. IT WILL BREAK IF YOU DON'T!
//
// There are 3 custom arrays in the function: allotmentPreferenceOrder,
// herbPreferenceOrder, and treePreferenceOrder. If you want to grow only specific
// herbs/plants, customize these arrays as desired. If you don't want specific seeds,
// remove their numbers from the arrays. They are currently populated with my
// own needs, so alter as necessary. As they are, every crop will be grown.
//
// This function assumes you are exclusively using gloop and maintaining its
// quantity manually. If you have none, it simply won't try to apply it. It also
// only applies gloop when pool < 25% and seed mastery < 50.
//
// If you own Aorpheat's Signet, the Farming Skillcape, or Bob's Rake, this
// function will auto-equip them for harvest and re-equip whatever was worn
// pre-harvest once the harvesting is finished. NOTE: this only works outside of
// combat to avoid catastrophic mistakes.
//
// NEW: In 0.17, the mastery pools were introduced. This function will now automatically
// some of your pool xp when it's above 99 to level up your lowest mastery, ensuring
// no pxp. This will also automatically claim your farming mastery tokens when your
// pool is less than 99% full.

(function () {
    function injectScript(main) {
        var script = document.createElement('script');
        script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(script).parentNode.removeChild(script);
    }

    function script() {

this.autoFarmingMastery = setInterval(()=> {
    haveAnyGrown = false
    for (let j = 0; j < newFarmingAreas.length; j++) {
        for (let i = 0; i < newFarmingAreas[j].patches.length; i++) {
            if (newFarmingAreas[j].patches[i].hasGrown || newFarmingAreas[j].patches[i].timeout == null) {
                haveAnyGrown = true;
            }
        }
    }
    if (haveAnyGrown) {
        currentSkillcape = equippedItems[10];
        if (items.filter(capes => capes.tier == 'Skillcape').includes(items[currentSkillcape])) {
            isFarmingCurrent = (currentSkillcape == CONSTANTS.item.Farming_Skillcape || currentSkillcape == CONSTANTS.item.Max_Skillcape);
        } else {
            isFarmingCurrent = false;
        }
        if (!isFarmingCurrent && checkBankForItem(CONSTANTS.item.Max_Skillcape)) {
            equipItem(CONSTANTS.item.Max_Skillcape, 1, 0);
        } else if (!isFarmingCurrent && checkBankForItem(CONSTANTS.item.Farming_Skillcape)) {
            equipItem(CONSTANTS.item.Farming_Skillcape, 1, 0);
        }
        if (isInCombat) {
            for (let j = 0; j < newFarmingAreas.length; j++) {
                for (let i = 0; i < newFarmingAreas[j].patches.length; i++) {
                    if (newFarmingAreas[j].patches[i].hasGrown) {
                        harvestSeed(j, i);

                        currentSkill = CONSTANTS.skill.Farming;
                        if (checkBankForItem(CONSTANTS.item.Mastery_Token_Farming) && getMasteryPoolProgress(currentSkill) < 99) {
                            selectBankItem(CONSTANTS.item.Mastery_Token_Farming);
                            claimToken();
                        }
                        for (let k = 0; k < MASTERY[currentSkill].xp.length; k++) {
                            if (MASTERY[currentSkill].xp[k] < 13034431 && (MASTERY[currentSkill].pool == getMasteryPoolTotalXP(currentSkill) || MASTERY[currentSkill].pool - getMasteryXpForNextLevel(currentSkill, k) > 0.95 * getMasteryPoolTotalXP(currentSkill))) {
                                levelUpMasteryWithPool(currentSkill, k)
                            }
                        }
                    }
                }
            }
        }
        else {
            currentWeapon = equippedItems[4];
            currentShield = equippedItems[5];
            currentRing = equippedItems[7];

            isWeaponRake = (currentWeapon == CONSTANTS.item.Bobs_Rake);
            if (!isWeaponRake && checkBankForItem(CONSTANTS.item.Bobs_Rake)) {
                equipItem(CONSTANTS.item.Bobs_Rake, 1, 0);
            }
            isRingSignet = (currentRing == CONSTANTS.item.Aorpheats_Signet_Ring);
            if (!isRingSignet && checkBankForItem(CONSTANTS.item.Aorpheats_Signet_Ring)) {
                equipItem(CONSTANTS.item.Aorpheats_Signet_Ring, 1, 0);
            }
            for (let j = 0; j < newFarmingAreas.length; j++) {
                for (let i = 0; i < newFarmingAreas[j].patches.length; i++) {
                    if (newFarmingAreas[j].patches[i].hasGrown) {
                        harvestSeed(j, i);
                        currentSkill = CONSTANTS.skill.Farming;
                        if (checkBankForItem(CONSTANTS.item.Mastery_Token_Farming) && getMasteryPoolProgress(currentSkill) < 99) {
                            selectBankItem(CONSTANTS.item.Mastery_Token_Farming);
                            claimToken();
                        }
                        for (let k = 0; k < MASTERY[currentSkill].xp.length; k++) {
                            if (MASTERY[currentSkill].xp[k] < 13034431 && (MASTERY[currentSkill].pool == getMasteryPoolTotalXP(currentSkill) || MASTERY[currentSkill].pool - getMasteryXpForNextLevel(currentSkill, k) > 0.95 * getMasteryPoolTotalXP(currentSkill))) {
                                levelUpMasteryWithPool(currentSkill, k)
                            }
                        }
                    }
                }
            }
            if (!isRingSignet) {
                equipItem(currentRing, 1, 0);
            }
            if (!isWeaponRake) {
                equipItem(currentWeapon, 1, 0);
                if (currentShield != 0) {
                    equipItem(currentShield, 1, 0);
                }
            }
        }
        if (!isFarmingCurrent) {
            equipItem(currentSkillcape, 1, 0);
        }

        allotmentPreferenceOrder = [CONSTANTS.item.Potato_Seed, CONSTANTS.item.Carrot_Seeds, CONSTANTS.item.Snape_Grass_Seed, CONSTANTS.item.Strawberry_Seed, CONSTANTS.item.Cabbage_Seed, CONSTANTS.item.Onion_Seed, CONSTANTS.item.Tomato_Seed, CONSTANTS.item.Sweetcorn_Seed, CONSTANTS.item.Watermelon_Seed];
        minMast = 9999999999;
        minSeed = allotmentPreferenceOrder[0];
        for (let i = 0; i < allotmentPreferenceOrder.length; i++) {
            mast = getMasteryLevel(CONSTANTS.skill.Farming, items[allotmentPreferenceOrder[i]].masteryID[1]);
            if (mast < minMast && getBankId(allotmentPreferenceOrder[i])) {
                minMast = mast;
                minSeed = allotmentPreferenceOrder[i];
            }
        }
        for (let i = 0; i < newFarmingAreas[0].patches.length; i++) {
            if (newFarmingAreas[0].patches[i].timePlanted === 0) {
                selectedPatch = [0, i];
                if ((getMasteryPoolProgress(currentSkill) < 25 && getMasteryLevel(CONSTANTS.skill.Farming, items[minSeed].masteryID[1]) < 50) && !newFarmingAreas[0].patches[i].gloop && checkBankForItem(CONSTANTS.item.Weird_Gloop)) {
                    addGloop(0, i);
                }
                selectSeed(minSeed);
                plantSeed();
            }
        }

        herbPreferenceOrder = [CONSTANTS.item.Lemontyle_Seed, CONSTANTS.item.Garum_Seed, CONSTANTS.item.Sourweed_Seed, CONSTANTS.item.Mantalyme_Seed, CONSTANTS.item.Oxilyme_Seed, CONSTANTS.item.Poraxx_Seed, CONSTANTS.item.Pigtayle_Seed, CONSTANTS.item.Barrentoe_Seed];
        minMast = 9999999999;
        minSeed = herbPreferenceOrder[0];
        for (let i = 0; i < herbPreferenceOrder.length; i++) {
            mast = getMasteryLevel(CONSTANTS.skill.Farming, items[herbPreferenceOrder[i]].masteryID[1]);
            if (mast < minMast && getBankId(herbPreferenceOrder[i])) {
                minMast = mast;
                minSeed = herbPreferenceOrder[i];
            }
        }
        for (let i = 0; i < newFarmingAreas[1].patches.length; i++) {
            if (newFarmingAreas[1].patches[i].timePlanted === 0) {
                selectedPatch = [1, i];
                if ((getMasteryPoolProgress(currentSkill) < 25 && getMasteryLevel(CONSTANTS.skill.Farming, items[minSeed].masteryID[1]) < 50) && !newFarmingAreas[1].patches[i].gloop && checkBankForItem(CONSTANTS.item.Weird_Gloop)) {
                    addGloop(1, i);
                }
                selectSeed(minSeed);
                plantSeed();
            }
        }

        treePreferenceOrder = [CONSTANTS.item.Magic_Tree_Seed, CONSTANTS.item.Yew_Tree_Seed, CONSTANTS.item.Maple_Tree_Seed, CONSTANTS.item.Willow_Tree_Seed, CONSTANTS.item.Oak_Tree_Seed];
        minMast = 9999999999;
        minSeed = treePreferenceOrder[0];
        for (let i = 0; i < treePreferenceOrder.length; i++) {
            mast = getMasteryLevel(CONSTANTS.skill.Farming, items[treePreferenceOrder[i]].masteryID[1]);
            if (mast < minMast && getBankId(treePreferenceOrder[i])) {
                minMast = mast;
                minSeed = treePreferenceOrder[i];
            }
        }
        for (let i = 0; i < newFarmingAreas[2].patches.length; i++) {
            if (newFarmingAreas[2].patches[i].timePlanted === 0) {
                selectedPatch = [2, i];
                if ((getMasteryPoolProgress(currentSkill) < 25 && getMasteryLevel(CONSTANTS.skill.Farming, items[minSeed].masteryID[1]) < 50) && !newFarmingAreas[2].patches[i].gloop && checkBankForItem(CONSTANTS.item.Weird_Gloop)) {
                    addGloop(2, i);
                }
                selectSeed(minSeed);
                plantSeed();
            }
        }
    }
}, 5000);

    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded && !currentlyCatchingUp) {
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();

