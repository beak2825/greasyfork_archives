// ==UserScript==
// @name         Melvor Auto Replant
// @version      1.8.2
// @description  Automatically replants the seed after harvesting (equips food if stack already equipped)
// @author       Arcanus
// @match        https://*.melvoridle.com/*
// @grant        none
// @noframes
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/394855/Melvor%20Auto%20Replant.user.js
// @updateURL https://update.greasyfork.org/scripts/394855/Melvor%20Auto%20Replant.meta.js
// ==/UserScript==

this.autoReplant = setInterval(()=>{
    for (let i = 0; i < newFarmingAreas.length; i++) {
        for (let j = 0; j < newFarmingAreas[i].patches.length; j++) {
            if(newFarmingAreas[i].patches[j].hasGrown) {
                let lastSeed = newFarmingAreas[i].patches[j].seedID
                let grownID = items[newFarmingAreas[i].patches[j].seedID].grownItemID
                if(checkBankForItem(grownID) || bankMax+baseBankMax > bank.length) {
                    harvestSeed(i,j)
                    if(checkBankForItem(lastSeed)) {
                        if(checkBankForItem(CONSTANTS.item.Weird_Gloop)) {
                            addGloop(i,j)
                        } else if(farmingMastery[items[lastSeed].masteryID].mastery < 50) {
                            if(equippedItems[CONSTANTS.equipmentSlot.Cape] !== CONSTANTS.item.Farming_Skillcape) {
                                if(checkBankForItem(CONSTANTS.item.Compost)) {
                                    if(bank[getBankId(CONSTANTS.item.Compost)].qty < 5) {
                                        buyQty = 5 - bank[getBankId(CONSTANTS.item.Compost)].qty
                                        buyCompost(true)
                                    }
                                } else {
                                    buyQty = 5
                                    buyCompost(true)
                                }
                            }
                            addCompost(i,j,5)
                        }
                        selectedPatch = [i,j]
                        selectedSeed = lastSeed
                        plantSeed()
                    }
                    if (equippedFood.find(food => food.itemID === grownID) && checkBankForItem(grownID))
                        equipFood(getBankId(grownID),grownID,bank[getBankId(grownID)].qty)
                }
            }
        }
    }

},5000)