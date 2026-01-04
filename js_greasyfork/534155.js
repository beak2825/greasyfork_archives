// ==UserScript==
// @name         Torn: Weapons Color Coder
// @namespace    N/A
// @version      0.1.01
// @description  Color code of weapons by effectiveness on player profiles and attack screens
// @author       AngelofDev [3689828]
// @match        https://www.torn.com/item.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/534155/Torn%3A%20Weapons%20Color%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/534155/Torn%3A%20Weapons%20Color%20Coder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const weaponStats = {
        "Flash Grenade": { damage: 40, accuracy: 90 },
        "Tear Gas Grenade": { damage: 30, accuracy: 85 },
        "Incendiary Grenade": { damage: 60, accuracy: 75 },
        "Smoke Grenade": { damage: 10, accuracy: 95 },
        "Concussion Grenade": { damage: 50, accuracy: 70 },
        "Stun Grenade": { damage: 45, accuracy: 80 },
        "Brick": { damage: 20, accuracy: 50 },
        "Snowball": { damage: 5, accuracy: 99 },
        "Molotov Cocktail": { damage: 55, accuracy: 65 },
        "Fart Bomb": { damage: 5, accuracy: 40 },
        "Pepper Spray": { damage: 15, accuracy: 90 },
        "Syringe of Adrenaline": { damage: 0, accuracy: 100 },
    };

    const COLOR_BEST = "#8BC34A";   // Light Green
    const COLOR_MID = "#FFEB3B";    // Yellow
    const COLOR_WORST = "#F44336";  // Red

    function scanAndColorTemps() {
        const tempItemList = document.querySelectorAll('[class*="temp"], [class*="Temp"]');

        if (!tempItemList.length) {
            return;
        }

        let itemsWithScores = [];

        tempItemList.forEach(item => {
            const nameElem = item.querySelector('.name, .item-title, .temp-item-name');
            if (!nameElem) return;

            const weaponName = nameElem.textContent.trim();
            const stats = weaponStats[weaponName];

            if (stats) {
                const score = stats.damage + stats.accuracy;
                itemsWithScores.push({ element: item, score: score });
            }
        });

        if (itemsWithScores.length === 0) return;

        itemsWithScores.sort((a, b) => b.score - a.score);

        itemsWithScores.forEach((itemObj, index) => {
            if (index === 0) {
                itemObj.element.style.backgroundColor = COLOR_BEST;
            } else if (index === itemsWithScores.length - 1) {
                itemObj.element.style.backgroundColor = COLOR_WORST;
            } else {
                itemObj.element.style.backgroundColor = COLOR_MID;
            }
        });

        console.log("Temp weapons colored!");
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    scanAndColorTemps();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start watching
    observeDOMChanges();
})();