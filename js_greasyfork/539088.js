// ==UserScript==
// @name         Torn Weapon Hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quickly switch weapons using number keys 1-4
// @match        https://www.torn.com/attack.php*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539088/Torn%20Weapon%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/539088/Torn%20Weapon%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Map of number keys to weapon button selectors
    const weaponMap = {
        '1': '#weapon_main',    // Primary weapon
        '2': '#weapon_second',  // Secondary weapon
        '3': '#weapon_melee',   // Melee weapon
        '4': '#weapon_temp'     // Temporary weapon
    };

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        // Ignore keypresses inside input fields or dropdowns
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            return;
        }

        const key = event.key;
        const selector = weaponMap[key];

        if (selector) {
            const weaponBtn = document.querySelector(selector);
            if (weaponBtn) {
                event.preventDefault();  // Prevent default action (if any)
                weaponBtn.click();       // Simulate button click
                console.log(`🔫 Weapon key ${key} triggered: ${selector}`);
            }
        }
    });

    // Optional: Add hover effects for visual feedback
    const style = document.createElement('style');
    style.innerHTML = `
        #weapon_main, #weapon_second, #weapon_melee, #weapon_temp {
            transition: transform 0.2s ease-in-out;
        }
        #weapon_main:hover, #weapon_second:hover, #weapon_melee:hover, #weapon_temp:hover {
            transform: scale(1.05);
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
})();