// ==UserScript==
// @name         Mafia Order Safe Cracker
// @namespace    PhantomScripting
// @version      0.1
// @description  Script to extrapolate guesses and generate the possible safe code in Mafia Order.
// @author       Phantom
// @match        https://www.mafiaorder.com/page/crackTheSafe*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480974/Mafia%20Order%20Safe%20Cracker.user.js
// @updateURL https://update.greasyfork.org/scripts/480974/Mafia%20Order%20Safe%20Cracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractGuesses() {
        const guessElements = document.querySelectorAll('.list-group-item.text-left');
        const guesses = [];

        guessElements.forEach((element) => {
            const text = element.innerText.trim();
            const value = parseInt(text.match(/\d+,*\d*/)[0].replace(/,/g, ''), 10);
            const type = text.includes("Lower than") ? "lower" : "higher";

            guesses.push({ value, type });
        });

        return guesses;
    }

    function findClosestGuesses(guesses) {
        let closestLower = 9999;
        let closestHigher = 1000;
        let minDistance = Infinity;

        for (let i = 0; i < guesses.length; i++) {
            for (let j = i + 1; j < guesses.length; j++) {
                const distance = Math.abs(guesses[i].value - guesses[j].value);

                if (distance < minDistance) {
                    minDistance = distance;

                    if (guesses[i].type === "lower") {
                        closestLower = guesses[i].value;
                        closestHigher = guesses[j].value;
                    } else {
                        closestLower = guesses[j].value;
                        closestHigher = guesses[i].value;
                    }
                }
            }
        }

        return { closestLower, closestHigher };
    }

    function getRandomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function main() {
        const guesses = extractGuesses();

        const { closestLower, closestHigher } = findClosestGuesses(guesses);

        console.log("Closest Lower: " + closestLower);
        console.log("Closest Higher: " + closestHigher);

        const randomGuess = getRandomNumberBetween(closestLower, closestHigher);

        alert("Random Number: " + randomGuess);
    }
    window.onload = function() {
        main();
    };
})();
