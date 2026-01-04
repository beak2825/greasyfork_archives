// ==UserScript==
// @name         Auto Poker Win Rate Calculator (Holdem Full)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically calculate your win rate in Torn City Holdem Full.
// @author       Your Name
// @match        https://www.torn.com/page.php?sid=holdemFull
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525749/Auto%20Poker%20Win%20Rate%20Calculator%20%28Holdem%20Full%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525749/Auto%20Poker%20Win%20Rate%20Calculator%20%28Holdem%20Full%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to evaluate the strength of a hand
    function evaluateHand(cards) {
        // Placeholder for actual hand strength calculation
        return Math.random(); // Replace this with real logic
    }

    // Function to calculate win rate
    function calculateWinRate(yourHand, communityCards) {
        const totalSimulations = 1000;
        let winCount = 0;

        for (let i = 0; i < totalSimulations; i++) {
            const allCards = generateDeck();
            const usedCards = [...yourHand, ...communityCards];
            const availableCards = allCards.filter(card => !usedCards.includes(card));
            const opponentHand = [
                availableCards[Math.floor(Math.random() * availableCards.length)],
                availableCards[Math.floor(Math.random() * availableCards.length)]
            ];

            const yourStrength = evaluateHand([...yourHand, ...communityCards]);
            const opponentStrength = evaluateHand([...opponentHand, ...communityCards]);

            if (yourStrength > opponentStrength) {
                winCount++;
            }
        }

        const winRate = (winCount / totalSimulations) * 100;
        return winRate.toFixed(2);
    }

    // Function to generate a deck of cards
    function generateDeck() {
        const suits = ['H', 'D', 'C', 'S'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(rank + suit);
            }
        }
        return deck;
    }

    // Function to extract cards from the page
    function extractCards() {
        // Adjust selectors based on the new page structure
        const yourHand = Array.from(document.querySelectorAll('.player-hand .card')).map(card => {
            const rank = card.querySelector('.rank').innerText;
            const suit = card.querySelector('.suit').innerText;
            return rank + suit;
        });

        const communityCards = Array.from(document.querySelectorAll('.community-cards .card')).map(card => {
            const rank = card.querySelector('.rank').innerText;
            const suit = card.querySelector('.suit').innerText;
            return rank + suit;
        });

        return { yourHand, communityCards };
    }

    // Function to display the win rate
    function displayWinRate(winRate) {
        const existingElement = document.getElementById('win-rate-display');
        if (existingElement) existingElement.remove();

        const winRateElement = document.createElement('div');
        winRateElement.id = 'win-rate-display';
        winRateElement.textContent = `Win Rate: ${winRate}%`;
        winRateElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border: 2px solid #4CAF50;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(winRateElement);
    }

    // Function to check if the table is active
    function checkTableActive() {
        return document.querySelector('.poker-table-container') !== null;
    }

    // Main script runner
    function runScript() {
        if (checkTableActive()) {
            try {
                const { yourHand, communityCards } = extractCards();
                if (yourHand.length === 2 && communityCards.length >= 3) {
                    const winRate = calculateWinRate(yourHand, communityCards);
                    displayWinRate(winRate);
                }
            } catch (error) {
                console.error('Script Error:', error);
            }
        }
    }

    // MutationObserver to detect DOM changes
    const observer = new MutationObserver(runScript);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    runScript();
})();