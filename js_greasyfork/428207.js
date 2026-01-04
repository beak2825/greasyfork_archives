// ==UserScript==
// @name        Melvor Idle - AutoSlayer
// @description Automatically reroll and extend slayer tasks for specific monsters
// @version     1.0
// @namespace   Visua
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428207/Melvor%20Idle%20-%20AutoSlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/428207/Melvor%20Idle%20-%20AutoSlayer.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    const id = 'AutoSlayer';

    function loadAutoSlayer() {
        // Load settings
        let settings = {
            monsters: MONSTERS.map((m, i) => i).filter(id => MONSTERS[id].canSlayer),
            monstersToExtend: [],
        };
        const savedSettings = JSON.parse(localStorage.getItem(`${id}-${currentCharacter}`));
        if (savedSettings) {
            settings = savedSettings;
        }

        // Validate and save settings on change
        const settingsHandler = {
            set: function (obj, prop, value) {
                if (prop === 'monsters') {
                    if (!Array.isArray(value) || value.some(e => !Number.isInteger(e))) {
                        throw new TypeError('monsters should be an array of integers');
                    }
                } else if (prop === 'monstersToExtend') {
                    if (!Array.isArray(value) || value.some(e => !Number.isInteger(e))) {
                        throw new TypeError('monstersToExtend should be an array of integers');
                    }
                }

                obj[prop] = value;
                localStorage.setItem(`${id}-${currentCharacter}`, JSON.stringify(AUTOSLAYER.settings));
                console.log('Settings saved');
                return true;
            },
        };

        window.AUTOSLAYER = {
            settings: new Proxy(settings, settingsHandler),
        };

        const _autoSlayer = autoSlayer;
        const _getSlayerTask = getSlayerTask;

        function getAutoSlayerTask(monster, tier = 0) {
            _getSlayerTask(monster, tier);

            try {
                if (AUTOSLAYER.settings.monsters.includes(slayerTask[0].monsterID)) {
                    console.log(`AutoSlayer: Fighting ${MONSTERS[slayerTask[0].monsterID].name} x${slayerTask[0].count}`);
                    if (isInCombat && enemyInCombat !== slayerTask[0].monsterID) {
                        jumpToEnemy(slayerTask[0].monsterID);
                    }
                    if (AUTOSLAYER.settings.monstersToExtend.includes(slayerTask[0].monsterID)) {
                        extendSlayerTask();
                        console.log(`AutoSlayer: Extended to ${slayerTask[0].count}`);
                    }
                } else {
                    console.log(`AutoSlayer: Rerolling ${MONSTERS[slayerTask[0].monsterID].name}`);
                    // Temporarily set autoSlayer to true so we don't roll for monsters we can't fight
                    autoSlayer = true;
                    selectNewSlayerTask(tier);
                    // Set it to false again so we don't automatically jump to the new monster
                    autoSlayer = false;
                }
            } catch (e) {
                console.error(e);
            }
        };

        AUTOSLAYER.start = function () {
            console.log('AutoSlayer: Starting');
            getSlayerTask = getAutoSlayerTask;
            // This is just to indicate that we're making use of this setting to only roll for monsters we can fight
            autoSlayer = true;
            $('#setting-autoslayermonster').prop('checked', true);
        };

        AUTOSLAYER.stop = function () {
            console.log('AutoSlayer: Stopping');
            getSlayerTask = _getSlayerTask;
            // Restore the original setting
            autoSlayer = _autoSlayer;
            $('#setting-autoslayermonster').prop('checked', autoSlayer);
        };

        AUTOSLAYER.start();
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded && !currentlyCatchingUp) {
            clearInterval(interval);
            console.log(`Loading ${id}`);
            loadAutoSlayer();
        }
    }

    const interval = setInterval(loadScript, 500);
});
