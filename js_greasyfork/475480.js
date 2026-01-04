// ==UserScript==
// @name         Make Opponent's Cards Visible
// @namespace    tampermonkey.org
// @version      1.0
// @description  Make opponent's cards visible in the card game
// @author       Your Name
// @match       https://trucoxp.com/games
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475480/Make%20Opponent%27s%20Cards%20Visible.user.js
// @updateURL https://update.greasyfork.org/scripts/475480/Make%20Opponent%27s%20Cards%20Visible.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load before running the script
    window.addEventListener('load', function() {
        // Get the opponent's cards by selecting the appropriate elements
        const opponentCards = document.querySelectorAll('.hand.oponent .hand__card--flipped.hidden');

        // Loop through the opponent's cards and remove the 'hidden' class
        opponentCards.forEach(function(card) {
            card.classList.remove('hidden');
        });
    });
})();
