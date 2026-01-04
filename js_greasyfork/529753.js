// ==UserScript==
// @name         FREEDOM from Anti-Filter (no censorship)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enjoy it without the gartic.io filter. The disadvantage is that the number of letters has been reduced from 100 to 50.
// @author       KokoTheHand
// @match        *://gartic.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529753/FREEDOM%20from%20Anti-Filter%20%28no%20censorship%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529753/FREEDOM%20from%20Anti-Filter%20%28no%20censorship%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keysPressed = [];

    document.addEventListener('keydown', (event) => {
        if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
            keysPressed.push(event.key.toLowerCase());

            if (keysPressed.length > 1) {
                keysPressed.shift();
            }

            const checkKeyCombination = (keys, textToAdd) => {
                if (keysPressed.length === keys.length && keysPressed.every((val, index) => val === keys[index])) {
                    const inputField = document.querySelector('input[type="text"][name="chat"]');
                    if (inputField) {
                        inputField.value += textToAdd;
                        inputField.dispatchEvent(new Event('input'));
                    }
                    keysPressed = [];
                }
            };

            for (let charCode = 97; charCode <= 122; charCode++) { // a-z (ASCII 97-122)
                const letter = String.fromCharCode(charCode);
                checkKeyCombination([letter], '؜'); // an invisible sign between letters
            }
        }
    });
})();