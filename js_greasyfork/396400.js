// ==UserScript==
// @name         Melvor Auto Slayer
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Kill them all!
// @author       Bubbalova
// @match        https://*.melvoridle.com/*
// @downloadURL https://update.greasyfork.org/scripts/396400/Melvor%20Auto%20Slayer.user.js
// @updateURL https://update.greasyfork.org/scripts/396400/Melvor%20Auto%20Slayer.meta.js
// ==/UserScript==

/*
I'd like to give credit to nysos3 for supplying the base code for this. Without their original code, this wouldn't exist.
*/

var autoSlayerEnabled = false;
var autoSlayerCheck = 0;

//Holds values for unequipped equipment
var originalRing;
var originalShield;
var originalCape;

var updateAutoSlayerButtonText = function () {
    $('#auto-slayer-button-status').text((autoSlayerEnabled) ? 'Enabled' : 'Disabled');
}

var toggleAutoSlayer = function () {
    autoSlayerEnabled = !autoSlayerEnabled;
    updateAutoSlayerButtonText();
    setTimeout(function() {
        if (!autoSlayerEnabled) {
            stopCombat(false, true, true);
        } else {
            changePage(13);
        }
    }, 100);
}

var setupAutoSlayer = function() {
    if ($("#auto-slayer-button").length) return;
    var containerRef = $(".content-side ul.nav-main li.nav-main-heading:last");
    var li = $('<li class="nav-main-item"></li>');
    containerRef.before(li);
    var button = $([
        '<a id="auto-slayer-button" class="nav-main-link" href="javascript:void(0);">',
        '<img class="nav-img" src="assets/media/main/slayer_coins.svg">',
        '<span class="nav-main-link-name">AutoSlayer</span>',
        '<small id="auto-slayer-button-status"></small>',
        '</a>'
    ].join(""));
    li.append(button);
    button.on("click", toggleAutoSlayer);
    updateAutoSlayerButtonText();
}

//Main function
var autoSlayer = function() {

    if (!autoSlayerEnabled) {
        autoSlayerCheck = 0;
        return;
    }

    //Slayer areas that require items
    var strangeCave = 10;
    var highLands = 11;

    //If there is no slayer task, get one
    if (!slayerTask.length) {
        getSlayerTask();
    }

    if(autoSlayerCheck == 0){
        autoSlayerCheck = 1;
        originalCape = equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Cape];
        originalShield = equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Shield];
        originalRing = equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Ring];
    }

    //If you are fighting an enemy that isn't your current task, stop combat and switch to the task monster
    if (forcedEnemy !== slayerTask[0].monsterID || !isInCombat) {
        if (isInCombat) {
            stopCombat(false, true, true);
        }
        for(let i=0; i<combatAreas.length; i++){
            if (combatAreas[i].areaName == findEnemyArea(slayerTask[0].monsterID)) {
                selectedCombatArea = i;
                break;
            }
        }
        //Equips Slayer Skillcape if owned
        if(skillLevel[CONSTANTS.skill.Slayer] >= 99 && checkBankForItem(CONSTANTS.item.Slayer_Skillcape) || equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Cape] == CONSTANTS.item.Slayer_Skillcape){
            if(equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Cape] != CONSTANTS.item.Slayer_Skillcape){
                for (let i = 0; i < bank.length; i++) {
                    if(items[bank[i].id].name == "Slayer Skillcape") {
                        equipItem(i, CONSTANTS.item.Slayer_Skillcape, 1, selectedEquipmentSet)
                        found = true
                        break;
                    }
                }
            }
        }
        //Equips Mirror Shield for area
        else if(selectedCombatArea == strangeCave) {
            if(equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Shield] != CONSTANTS.item.Mirror_Shield) {
                if(equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Shield] == 0) {
                    newSlayerTask();
                    notifyPlayer(CONSTANTS.skill.Slayer, "Skipping task due to 2-handed weapon!");
                } else {
                    for (let i = 0; i < bank.length; i++) {
                        if(items[bank[i].id].name == "Mirror Shield") {
                            equipItem(i, CONSTANTS.item.Mirror_Shield, 1, selectedEquipmentSet)
                            found = true
                            break;
                        }
                    }
                }
            }

        }
        //Equips Magical Ring for area
        else if(selectedCombatArea == highLands) {
            if(equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Ring] != CONSTANTS.item.Magical_Ring) {
                for (let i = 0; i < bank.length; i++) {
                    if(items[bank[i].id].name == "Magical Ring") {
                        equipItem(i, CONSTANTS.item.Magical_Ring, 1, selectedEquipmentSet)
                        found = true
                        break;
                    }
                }
            }
        }
        else if(selectedCombatArea != strangeCave || selectedCombatArea != highLands){

            slayerLockedItem = null;

            //Equips original shield when not in Area
            if (equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Shield] == CONSTANTS.item.Mirror_Shield && originalShield != CONSTANTS.item.Mirror_Shield && originalShield != undefined){
                for (let i = 0; i < bank.length; i++) {
                    if(items[bank[i].id].name == items[originalShield].name) {
                        equipItem(i, originalShield, 1, selectedEquipmentSet)
                        found = true
                        break
                    }
                }
            }

            //Equips original ring when not in Area
            if (equipmentSets[selectedEquipmentSet].equipment[CONSTANTS.equipmentSlot.Ring] == CONSTANTS.item.Magical_Ring && originalRing != CONSTANTS.item.Magical_Ring && originalRing != undefined){
                for (let i = 0; i < bank.length; i++) {
                    if(items[bank[i].id].name == items[originalRing].name) {
                        equipItem(i, originalRing, 1, selectedEquipmentSet)
                        found = true
                        break
                    }
                }
            }
        }
        selectMonster(slayerTask[0].monsterID);
    }
}


var autoSlayerTimer = setInterval(function(){autoSlayer();}, 2000);

setTimeout(function() {
    setupAutoSlayer();
}, 1000);