// ==UserScript==
// @name         Skribbl.io Auto Answer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically answers Skribbl.io drawings (Work in progress)
// @author       You (Replace with your name)
// @match        https://skribbl.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527385/Skribblio%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/527385/Skribblio%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentWord = "";
    let answerElement = null;

    function findAnswerElement() {
        answerElement = document.querySelector('.word'); // Example selector - MUST BE VERIFIED
        if (!answerElement) {
            console.log("Could not find the word element. Retrying...");
            setTimeout(findAnswerElement, 1000);
        } else {
            console.log("Found the word element:", answerElement);
        }
    }

    findAnswerElement();

    function getCurrentWord() {
        if (answerElement) {
            currentWord = answerElement.textContent.trim();
            return currentWord;
        }
        return "";
    }

    function submitAnswer(word) {
        let inputField = document.getElementById('input'); // Example ID - MUST BE VERIFIED
        let submitButton = document.querySelector('.btn-success'); // Example selector - MUST BE VERIFIED

        if (inputField && submitButton) {
            inputField.value = word;
            submitButton.click();
        } else {
            console.log("Could not find input field or submit button.");
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'textContent') {
                const newWord = getCurrentWord();
                if (newWord && newWord !== currentWord) {
                    currentWord = newWord;
                    console.log("New word:", currentWord);

                    // Placeholder: Replace this with your actual word-guessing logic
                    // Example (replace with your code):
                    // const guessedWord = getGuessedWord(currentWord); 
                    // if (guessedWord) {
                    //     submitAnswer(guessedWord);
                    // }

                    submitAnswer(currentWord); // Temporary: Submits the displayed word (WRONG - REPLACE THIS)
                }
            }
        });
    });

    if (answerElement) {
        observer.observe(answerElement, { childList: true, subtree: true, characterData: true });
    }

})();