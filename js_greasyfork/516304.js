// ==UserScript==
// @name         Fetch Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Use arrow keys to navigate in Fetch on Grundo's Cafe
// @match        https://www.grundos.cafe/games/fetch/
 // @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/516304/Fetch%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/516304/Fetch%20Keyboard%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.target.tagName.toLowerCase() === 'input') return; // Ignore input fields
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                goNorth();
                break;
            case 'ArrowDown':
                event.preventDefault();
                goSouth();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                goWest();
                break;
            case 'ArrowRight':
                event.preventDefault();
                goEast();
                break;
            default:
                break;
        }
    });
})();