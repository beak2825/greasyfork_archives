// ==UserScript==
// @name         DelugeRPG Movement Controller for Mobile UI
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds keyboard and numpad controls for movement in DelugeRPG's mobile version.
// @license      MIT
// @author       Your Name
// @match        https://m.delugerpg.com/map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531283/DelugeRPG%20Movement%20Controller%20for%20Mobile%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/531283/DelugeRPG%20Movement%20Controller%20for%20Mobile%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mapping keys to movement buttons
    const movementKeys = {
        // Letter keys
        'q': '#dr-nw',
        'w': '#dr-n',
        'e': '#dr-ne',
        'a': '#dr-w',
        's': '#dr-s',
        'd': '#dr-e',
        'z': '#dr-sw',
        'x': '#dr-s',
        'c': '#dr-se',

        // Arrow keys
        'ArrowUp': '#dr-n',
        'ArrowDown': '#dr-s',
        'ArrowLeft': '#dr-w',
        'ArrowRight': '#dr-e',

        // Numpad keys
        '7': '#dr-nw', // Numpad 7
        '8': '#dr-n',  // Numpad 8
        '9': '#dr-ne', // Numpad 9
        '4': '#dr-w',  // Numpad 4
        '5': '',       // Numpad 5 (no movement assigned)
        '6': '#dr-e',  // Numpad 6
        '1': '#dr-sw', // Numpad 1
        '2': '#dr-s',  // Numpad 2
        '3': '#dr-se'  // Numpad 3
    };

    document.addEventListener('keydown', function(e) {
        const selector = movementKeys[e.key];
        if (selector) {
            const button = document.querySelector(selector);
            if (button) {
                button.click();
                e.preventDefault();
            }
        }
    });
})();
