// ==UserScript==
// @name         Higher or Lower Game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play Higher or Lower game with card counting recommendations!
// @author       You
// @match        *://*/*  // This makes the script run on any page. You can narrow it down if needed.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546215/Higher%20or%20Lower%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/546215/Higher%20or%20Lower%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize the deck and game state
    let deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];  // Values of cards (2-10, J=11, Q=12, K=13)
    let deckCount = [...deck, ...deck, ...deck, ...deck];  // 4 suits, total 52 cards
    let currentCard;
    let remainingCards = {}; // Track how many cards of each value are left
    let score = 0;

    // Shuffle the deck
    function shuffleDeck() {
        deckCount = deckCount.sort(() => Math.random() - 0.5); // Shuffle the deck randomly
        remainingCards = deckCount.reduce((acc, card) => {
            acc[card] = (acc[card] || 0) + 1;
            return acc;
        }, {});
    }

    // Draw a card from the deck
    function drawCard() {
        let card = deckCount.pop();
        remainingCards[card] -= 1;
        if (remainingCards[card] === 0) {
            delete remainingCards[card];
        }
        return card;
    }

    // Calculate recommendation based on the remaining deck
    function getRecommendation(currentCard) {
        let higherCards = 0;
        let lowerCards = 0;

        for (let value in remainingCards) {
            if (parseInt(value) > currentCard) {
                higherCards += remainingCards[value];
            } else if (parseInt(value) < currentCard) {
                lowerCards += remainingCards[value];
            }
        }

        return higherCards > lowerCards ? 'Higher' : 'Lower';
    }

    // Display current card and recommendation
    function displayGameState() {
        let recommendation = getRecommendation(currentCard);
        alert(`Current card: ${currentCard}\nRecommendation: ${recommendation}`);
    }

    // Start a new game
    function startGame() {
        shuffleDeck();
        currentCard = drawCard();  // Draw the first card
        displayGameState();  // Show current card and recommendation
    }

    // User interaction: Guess if the next card is higher or lower
    function guessHigherOrLower(guess) {
        let nextCard = drawCard();  // Draw the next card
        let correct = (guess === 'h' && nextCard > currentCard) || (guess === 'l' && nextCard < currentCard);

        if (correct) {
            score++;
            alert(`You guessed correctly! The next card was: ${nextCard}`);
        } else {
            score = 0;
            alert(`Wrong guess. The next card was: ${nextCard}. Your score is: ${score}`);
        }

        currentCard = nextCard;  // Update current card
        displayGameState();  // Show new card and recommendation
    }

    // Starting the game with a button
    let button = document.createElement('button');
    button.innerHTML = 'Start Higher or Lower Game';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.fontSize = '16px';
    button.addEventListener('click', function() {
        startGame();  // Start the game when clicked
    });
    document.body.appendChild(button);

    // User guess inputs: Higher or Lower
    let guessButtonH = document.createElement('button');
    guessButtonH.innerHTML = 'Guess Higher';
    guessButtonH.style.position = 'fixed';
    guessButtonH.style.top = '80px';
    guessButtonH.style.left = '20px';
    guessButtonH.style.padding = '10px';
    guessButtonH.style.backgroundColor = '#ff5722';
    guessButtonH.style.color = 'white';
    guessButtonH.style.fontSize = '16px';
    guessButtonH.addEventListener('click', function() {
        guessHigherOrLower('h');  // Guess higher
    });
    document.body.appendChild(guessButtonH);

    let guessButtonL = document.createElement('button');
    guessButtonL.innerHTML = 'Guess Lower';
    guessButtonL.style.position = 'fixed';
    guessButtonL.style.top = '140px';
    guessButtonL.style.left = '20px';
    guessButtonL.style.padding = '10px';
    guessButtonL.style.backgroundColor = '#2196F3';
    guessButtonL.style.color = 'white';
    guessButtonL.style.fontSize = '16px';
    guessButtonL.addEventListener('click', function() {
        guessHigherOrLower('l');  // Guess lower
    });
    document.body.appendChild(guessButtonL);

})();
