// ==UserScript==
// @name        Melvor Idle Can I Idle Helper
// @description Adds a button to the combat page to copy the CII url
// @version     1.0
// @namespace   Silber
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439183/Melvor%20Idle%20Can%20I%20Idle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439183/Melvor%20Idle%20Can%20I%20Idle%20Helper.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function ciiHelper() {
        // function for button to use
        window.openCanIIdle = function () {
            var baseUrl = "https://silberdrachi.github.io/CanIIdle/"
            var totalHealth = player.stats.maxHitpoints;
            var currentDR = player.stats.damageReduction;
            var wastefulRing = player.equipment.checkForItemID(Items.Wasteful_Ring);
            var guardianAmulet = player.equipment.checkForItemID(Items.Guardian_Amulet);
            var yak = player.equipment.checkForItemID(Items.Summoning_Familiar_Yak);
            var minotaur = player.equipment.checkForItemID(Items.Summoning_Familiar_Minotaur);
            var centaur = player.equipment.checkForItemID(Items.Summoning_Familiar_Centaur);
            var witch = player.equipment.checkForItemID(Items.Summoning_Familiar_Witch);
            var cyclops = player.equipment.checkForItemID(Items.Summoning_Familiar_Cyclops);

            var autoEatLevel = null;
            if (shopItemsPurchased.get("General:1")){
                autoEatLevel = 3;
            } else if (shopItemsPurchased.get("General:1")) {
                autoEatLevel = 2;
            } else if (shopItemsPurchased.get("General:1")) {
                autoEatLevel = 1;
            } else {
                autoEatLevel = 0;
            }
            
            var combatStyle = null;
            switch(player.attackType){
                case "melee":
                    combatStyle = "Melee";
                    break;
                case "magic":
                    combatStyle = "Magic";
                    break;
                case "ranged":
                    combatStyle = "Ranged";
                    break;
            }

            var gameMode = null;
            switch(currentGamemode){
                case 0:
                    gameMode = "Normal";
                    break;
                case 1:
                    gameMode = "Hardcore";
                    break;
                case 2:
                    gameMode = "Adventure";
                    break;
            }

            var yakSynergy = "None";
            if (yak) {
                if (minotaur) {
                    yakSynergy = "Minotaur";
                } else if (centaur) {
                    yakSynergy = "Centaur";
                } else if (witch) {
                    yakSynergy = "Witch";
                } else if (cyclops) {
                    yakSynergy = "Cyclops";
                }
            }

            navigator.clipboard.writeText(baseUrl + "?totalHealth=" + totalHealth + "&currentDR=" + currentDR + "&autoEatLevel=" + autoEatLevel + "&combatStyle=" + 
                combatStyle + "&gameMode=" + gameMode + "&wastefulRing=" + wastefulRing + "&guardianAmulet=" + guardianAmulet + "&yakSynergy=" + yakSynergy)
            .catch(err => {
              alert('Error in copying text: ', err);
            });
        }

        // injecting button into the combat UI
        if ($("#combat-container")){
            $("#combat-container").find('lang-string[lang-id="105"][lang-cat="COMBAT_MISC"]')
                .append($(document.createElement('button'))
                    .html('Copy CII link')
                    .prop({
                        id: 'ciiButton',
                        name: 'ciiButton'
                        })
                    );
            $("#combat-container").click(function (){
                openCanIIdle();
            });
        }
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Melvor Idle CII Helper Script');
            ciiHelper();
        }
    }

    const interval = setInterval(loadScript, 500);
});
