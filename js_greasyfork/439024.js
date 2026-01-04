// ==UserScript==
// @name        Melvor Idle HCCO
// @description Enables speciality game mode options for 12b and HCCO, by adding the strings to your character name.
// @version     .2
// @namespace   Silber
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439024/Melvor%20Idle%20HCCO.user.js
// @updateURL https://update.greasyfork.org/scripts/439024/Melvor%20Idle%20HCCO.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function hccoScript() {
        if (username && username.includes("HCCO")) {
            console.log('Detected Combat Only options.');
            hideNonCombat();
            changeImpendingDarknessRequirements();
            removeLemonHPFood();
        }

        if (username.includes("12b")) {
            console.log('Detected 12b options.');
            setBankBuyPrice();
            removeBankTokenCalculation();
            overwriteBankQuantity12b();
            updateBank();
        }

        if (username.includes("1b")) {
            console.log('Detected 1b options.');
            setBankBuyPrice();
            removeBankTokenCalculation();
            overwriteBankQuantity1b();
            updateBank();
        }
    }

    function setBankBuyPrice() {
        getBankUpgradeCost = () => 
        {
            return 69696969696969;
        }
    }

    function removeBankTokenCalculation() {
        player.addMiscModifiers = () => 
        {
            if (player.equipment.checkForItemID(CONSTANTS.item.Knights_Defender) && player.attackType === 'melee') {
                player.modifiers.addModifiers({
                decreasedAttackInterval: 100,
                decreasedDamageReduction: 3,
              });
            }
            if (player.modifiers.increasedNonMagicPoisonChance > 0 && player.attackType !== 'magic') {
                player.modifiers.addModifiers({
                increasedChanceToApplyPoison: this.modifiers.increasedNonMagicPoisonChance,
              });
            }
        }
    }

    function overwriteBankQuantity12b() {
        getMaxBankSpace = () => 
        {
            return 12;
        }
    }

    function overwriteBankQuantity1b() {
        getMaxBankSpace = () => 
        {
            return 1;
        }
    }

    function hideNonCombat() {
        $($('.nav-main-heading') [5]).nextUntil('[id=nav-main-heading]').toggleClass('d-none');
        $($('.nav-main-heading') [5]).toggleClass('d-none');
    }

    // Shamelessly stolen from Xander#8896
    function changeImpendingDarknessRequirements() {
        // Make list of all combat skills (including slayer)
        const combatSkillIDs = []
        for (let i = 0; i < combatSkills.length; i++){
            combatSkillIDs.push(Skills[combatSkills[i]])
        }
        combatSkillIDs.push(Skills["Slayer"])
    
        // Make list of all skills with their corresponding required level, being level 99 for combat skills and level 1 for non combat skills
        const maxCombatLevelRequirement = []
        for (let skillID = 0; skillID < Object.keys(SKILLS).length; skillID++){
            let skillRequirement = {"skill": skillID}
            if (combatSkillIDs.includes(skillID)) {
                skillRequirement["level"] = 99
            } else {
                skillRequirement["level"] = 1
            }
            maxCombatLevelRequirement.push(skillRequirement)
        }
    
        // Check that all non combat skills are level 1
        let allLevelOne = true
        for (let skillID = 0; skillID < Object.keys(SKILLS).length; skillID++){
            if (!combatSkillIDs.includes(skillID)) {
                if (skillLevel[skillID] != 1) {
                    allLevelOne = false
                }
            }
        }
    
        // if all non combat skills are level one, set dungeon requirements to having over level 99 in all combat skills
        if (allLevelOne){
            DUNGEONS[Dungeons["Impending_Darkness"]].entryRequirements[0].levels = maxCombatLevelRequirement
    
            let requirementText = document.getElementById(`combat-Dungeon-${Dungeons["Impending_Darkness"]}-level-req-max`)
            areaMenus.dungeon.updateRequirements()
            requirementText.innerText = " Requires Level 99 in all Combat Skills and Level 1 in all Non-Combat Skills"
        }    
    }

    function removeLemonHPFood() {
        items[CONSTANTS.item.Lemonade].canEat = false;
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Melvor Idle HCCO Script');
            hccoScript();
        }
    }

    const interval = setInterval(loadScript, 500);
});
