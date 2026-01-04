// ==UserScript==
// @name        Guess the Weight of the Marrow: Randomizer
// @namespace   KumaLandro - guess-the-weight-of-the-marrow-randomizer
// @match       https://www.neopets.com/medieval/guessmarrow.phtml*
// @grant       none
// @version     1.0
// @author      Kuma
// @description Adds a button to generate a random number between 200 and 800 and fill the input field.
// @downloadURL https://update.greasyfork.org/scripts/501497/Guess%20the%20Weight%20of%20the%20Marrow%3A%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/501497/Guess%20the%20Weight%20of%20the%20Marrow%3A%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var inputField = document.querySelector('input[name="guess"]');

    function setRandomNumber() {
        var randomNumber = getRandomNumber(200, 800);
        inputField.value = randomNumber.toString();
    }

    var button = document.createElement('button');
    button.textContent = 'Randomize';
    button.style.marginRight = '10px';

    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting
        setRandomNumber();
    });

    inputField.parentNode.insertBefore(button, inputField);

    setRandomNumber();
})();
