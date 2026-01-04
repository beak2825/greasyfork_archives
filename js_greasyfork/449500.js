// ==UserScript==
// @name         Melvor Idle - Remainging XP
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds a counter below the XP count to show how much remaining XP you are away from a selectable target level.
// @author       Jessy#3869
// @match		 https://*.melvoridle.com/*
// @exclude		 https://wiki.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @noframes
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449500/Melvor%20Idle%20-%20Remainging%20XP.user.js
// @updateURL https://update.greasyfork.org/scripts/449500/Melvor%20Idle%20-%20Remainging%20XP.meta.js
// ==/UserScript==

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function remainingXP() {
        Object.entries(SKILLS).forEach(([skillID, data]) => {
            if (data.hasMastery) {
                $(`#skill-progress-xp-${skillID}`).parent().append(`<div id="remaining-xp-${skillID}">Remaining XP <span class="p-1 bg-info rounded" id="skill-remaining-xp-${skillID}">0</span> to <input id="remaining-xp-target-${skillID}" style="max-width: 50px; max-height: 25px; background: #2d3542 !important; color: #f5f5f5; border: none; border-radius: .25rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;" type="number" name="remaining-xp-target-${skillID}" value=99 /> </div>`)
            };
        });

        setInterval(() => {
            // This will be the update function
            var skillID = PAGES[currentPage].skillID;
            $(`#skill-remaining-xp-${skillID}`).text(numberWithCommas(Math.max(0, exp.level_to_xp($(`#remaining-xp-target-${skillID}`).val()) - Math.floor(skillXP[skillID]))));
        }, 500);
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('[JessyMods] Loading "Remaining XP" Script.');
            remainingXP();
        }
    }

    const interval = setInterval(loadScript, 500);
});
