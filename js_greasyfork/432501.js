// ==UserScript==
// @name         Melvor Auto Equip
// @namespace    http://tampermonkey.net/
// @version      0.21.0.0
// @description  Automatically switch equipment sets based on the enemy's attack style
// @author		Chrono
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/432501/Melvor%20Auto%20Equip.user.js
// @updateURL https://update.greasyfork.org/scripts/432501/Melvor%20Auto%20Equip.meta.js
// ==/UserScript==

function AutoEquip() {

    const MELEE = 0; // 0 is the 1st set
    const RANGED = 1; //1 is the second set
    const MAGIC = 2; //2 is the third (last) set

    console.log("Auto-Equip Running");

    // Store a reference to the game's createNewEnemy function
    combatManager._createNewEnemy = combatManager.createNewEnemy;
    // Overwrite the game's createNewEnemy function to inject the changeEquipmentSet function in it
    combatManager.createNewEnemy = () => {

        combatManager._createNewEnemy();
        try {
            var style = combatManager.enemy.attackType;

            if (style == 'melee') // && player.selectedEquipmentSet!=MAGIC)
            {
                //console.log("Equipping Magic Set");
                player.changeEquipmentSet(MAGIC);
            }
            else if (style == 'ranged') // && player.selectedEquipmentSet!=MELEE)
            {
                //console.log("Equipping Melee Set");
                player.changeEquipmentSet(MELEE);
            }
            else if (style == 'magic') // && player.selectedEquipmentSet!=RANGED)
            {
                //console.log("Equipping Ranged Set");
                player.changeEquipmentSet(RANGED);
            }

        } catch (e) {
            console.error(e);
        }
    };

};

(function () {
    function injectScript(main) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp)
            || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(AutoEquip);
        }
    }
    const scriptLoader = setInterval(loadScript, 200);
})();