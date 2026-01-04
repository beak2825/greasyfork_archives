// ==UserScript==
// @name         Guessthe.game bragging rights filter
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  Filters the guessthe.game previous games list to show only games you've finished in one guess.  Use again to show all.
// @author       You
// @match        https://guessthe.game/previous-games
// @grant        none
// @run-at       context-menu
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/501004/Guessthegame%20bragging%20rights%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/501004/Guessthegame%20bragging%20rights%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (let element of document.getElementsByClassName('prev-game-result-row')) {
        if (element.style.display == 'none') element.style.display = 'flex';
        else
            if (!element.children[1].children[0].classList.contains('success')) element.style.display = 'none';
    }
    // Your code here...
})();