// ==UserScript==
// @name         Perk-Based Weapon Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Highlights Torn weapons based on perk status: Execute (low enemy HP), Assassinate (first turn), Blindside (full enemy HP), Comeback (low user HP). Fully dynamic and perk-aware.
// @author       Null [2042113], IAMAPEX [2523988]
// @match        https://www.torn.com/loader.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543270/Perk-Based%20Weapon%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/543270/Perk-Based%20Weapon%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let executeThreshold = null;
    let hasExecute = false;

    function parseExecutePerk() {
        const secondaryWeapon = document.getElementById('weapon_second');
        if (!secondaryWeapon) return;

        const executePerk = secondaryWeapon.querySelector('.bonus-attachment-execute');
        if (executePerk) {
            const desc = executePerk.getAttribute('data-bonus-attachment-description');
            const match = desc?.match(/below (\d+)%/i);
            if (match) {
                executeThreshold = parseInt(match[1]) / 100;
                hasExecute = true;
                console.log(`[Perk Highlighter] Detected Execute at ${match[1]}%`);
            }
        }
    }

    function getHealthPercent(selector) {
        const el = document.querySelector(selector);
        if (!el) return null;
        const [current, max] = el.innerText.split('/').map(x => parseInt(x.replace(/,/g, '')));
        if (!current || !max) return null;
        return current / max;
    }

    function getEnemyHealthPercent() {
        const enemyHealthElements = document.querySelectorAll('[id^=player-health-value]');
        if (enemyHealthElements.length < 2) return null;
        return getHealthPercent(`#${enemyHealthElements[1].id}`);
    }

    function getUserHealthPercent() {
        const userHealthEl = document.querySelectorAll('[id^=player-health-value]')[0];
        if (!userHealthEl) return null;
        return getHealthPercent(`#${userHealthEl.id}`);
    }

    function checkHealthForExecute() {
        if (!hasExecute || executeThreshold === null) return;

        const healthPercent = getEnemyHealthPercent();
        if (healthPercent === null) return;

        const secondaryWeapon = document.getElementById('weapon_second');
        if (!secondaryWeapon) return;

        secondaryWeapon.style.background = (healthPercent <= executeThreshold) ? 'red' : '';
    }

    function checkFirstTurnForAssassinate() {
        const turnLabel = document.querySelector('.labelTitle___ZtfnD');
        if (!turnLabel) return;

        const turnText = turnLabel.textContent.trim();
        const isFirstTurn = turnText.startsWith('0/');

        ['weapon_main', 'weapon_second', 'weapon_melee'].forEach(id => {
            const weapon = document.getElementById(id);
            if (!weapon) return;

            const hasAssassinate = weapon.querySelector('.bonus-attachment-assassinate');
            if (hasAssassinate) {
                weapon.style.background = isFirstTurn ? 'red' : '';
            }
        });
    }

    function checkFullHealthForBlindside() {
        const healthPercent = getEnemyHealthPercent();
        if (healthPercent === null) return;

        ['weapon_main', 'weapon_second'].forEach(id => {
            const weapon = document.getElementById(id);
            if (!weapon) return;

            const hasBlindside = weapon.querySelector('.bonus-attachment-blindside');
            if (hasBlindside) {
                weapon.style.background = (healthPercent === 1) ? 'red' : '';
            }
        });
    }

    function checkLowHealthForComeback() {
        const userHealthPercent = getUserHealthPercent();
        if (userHealthPercent === null) return;

        const isLow = userHealthPercent <= 0.25;

        ['weapon_main', 'weapon_second'].forEach(id => {
            const weapon = document.getElementById(id);
            if (!weapon) return;

            const hasComeback = weapon.querySelector('.bonus-attachment-comeback');
            if (hasComeback) {
                weapon.style.background = isLow ? 'red' : '';
            }
        });
    }

    setTimeout(() => {
        parseExecutePerk();
    }, 1000);

    setInterval(() => {
        checkHealthForExecute();
        checkFirstTurnForAssassinate();
        checkFullHealthForBlindside();
        checkLowHealthForComeback();
    }, 500);
})();
