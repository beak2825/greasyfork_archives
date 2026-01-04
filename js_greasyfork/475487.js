
// ==UserScript==
// @name         Make Opponent's Cards Visible
// @namespace    tampermonkey.org
// @version      2.0
// @description  Make opponent's cards visible in the card game
// @author       Your Name
// @match     https://trucoxp.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475487/Make%20Opponent%27s%20Cards%20Visible.user.js
// @updateURL https://update.greasyfork.org/scripts/475487/Make%20Opponent%27s%20Cards%20Visible.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load before running the script
    window.addEventListener('load', function() {
        // Get the opponent's cards by selecting the appropriate elements
        const opponentCards = document.querySelectorAll('.hand.oponent .hand__card--flipped.hidden');

        // Define the values and suits for the opponent's cards
        const cardValues = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
        const cardSuits = ['♠', '♥', '♦', '♣'];

        // Loop through the opponent's cards and set their content to the actual values
        opponentCards.forEach(function(card, index) {
            // Get the card's value and suit
            const value = cardValues[index % cardValues.length];
            const suit = cardSuits[index % cardSuits.length];

            // Set the card's content to the actual values
            card.querySelector('.card__value').textContent = value;
            card.querySelector('.card__suit').textContent = suit;

            // Remove the 'hidden' class
            card.classList.remove('hidden');
        });
    });
})();