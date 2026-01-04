// ==UserScript==
// @name         Melvor Auto Mining Mastery
// @version      1.0
// @description  Automatically mines to get all masteries to 69
// @author       JHawk55
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/408499/Melvor%20Auto%20Mining%20Mastery.user.js
// @updateURL https://update.greasyfork.org/scripts/408499/Melvor%20Auto%20Mining%20Mastery.meta.js
// ==/UserScript==
//
// WARNING: Before using this script (or any other), download a copy of your save.
// Read ALL of the notes up here before using this script.
//
// This function was designed for 0.16.1 on Google Chrome. If any bugs are found,
// dm JHawk55 on the Melvor discord.
//
// IMPORTANT: If you have the money for mining or gem gloves, this function will
// auto-equip them and maintain their charges IF AND ONLY IF YOU OWN THEM. YOU
// MUST MAKE THE FIRST PURCHASE YOURSELF.
//
// If you own Aorpheat's Signet, the Mining Skillcape, or Clue Chaser's, this
// function will auto-equip them.

this.autoMiningMastery = setInterval(()=> {
    if (isMining) {
        if (equippedItems[10] != CONSTANTS.item.Mining_Skillcape && checkBankForItem(CONSTANTS.item.Mining_Skillcape)) { // mining skillcape
            equipItem(getBankId(CONSTANTS.item.Mining_Skillcape), CONSTANTS.item.Mining_Skillcape, 1, 0)
        }
        if (equippedItems[7] != CONSTANTS.item.Aorpheats_Signet_Ring && checkBankForItem(CONSTANTS.item.Aorpheats_Signet_Ring)) {
            equipItem(getBankId(CONSTANTS.item.Aorpheats_Signet_Ring), CONSTANTS.item.Aorpheats_Signet_Ring, 1, 0)
        }
        if (equippedItems[6] != CONSTANTS.item.Clue_Chasers_Insignia && checkBankForItem(CONSTANTS.item.Clue_Chasers_Insignia)) { // clue chaser's
            equipItem(getBankId(CONSTANTS.item.Clue_Chasers_Insignia), CONSTANTS.item.Clue_Chasers_Insignia, 1, 0)
        }
        if (currentRock <= 9) {
            if (equippedItems[CONSTANTS.equipmentSlot.Gloves] != CONSTANTS.item.Gem_Gloves && checkBankForItem(CONSTANTS.item.Gem_Gloves)) {
                equipItem(getBankId(CONSTANTS.item.Gem_Gloves), CONSTANTS.item.Gem_Gloves, 1, 0)
            }
            maxOre = canMineDragonite() ? 9 : 8 // start with dragonite if mineable to avoid mining rune essence
            while (miningData[maxOre].level > skillLevel[CONSTANTS.skill.Mining]) {
                maxOre-- // decrement till we find the actual max ore mineable
            }
            miningAgain = false
            while (!miningAgain) {
                if (rockData[maxOre].depleted || miningOreMastery[maxOre].mastery >= 69) {
                    maxOre--
                } else {
                    if (currentRock != maxOre) {
                        mineRock(maxOre)
                    }
                    miningAgain = true
                }
            }
        } else {
            if (equippedItems[CONSTANTS.equipmentSlot.Gloves] != CONSTANTS.item.Mining_Gloves && checkBankForItem(CONSTANTS.item.Mining_Gloves)) {
                equipItem(getBankId(CONSTANTS.item.Mining_Gloves), CONSTANTS.item.Mining_Gloves, 1, 0)
            }
        }
        if (glovesTracker[CONSTANTS.shop.gloves.Gems].isActive && glovesTracker[CONSTANTS.shop.gloves.Gems].remainingActions <= 1 && equippedItems[CONSTANTS.equipmentSlot.Gloves] === CONSTANTS.item.Gem_Gloves && gp >= 500000) {
            buyGloves(4)
        }
        if (glovesTracker[CONSTANTS.shop.gloves.Mining].isActive && glovesTracker[CONSTANTS.shop.gloves.Mining].remainingActions <= 1 && equippedItems[CONSTANTS.equipmentSlot.Gloves] === CONSTANTS.item.Mining_Gloves && gp >= 75000) {
            buyGloves(1)
        }
    }
}, 1000);






