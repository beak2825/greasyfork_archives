// ==UserScript==
// @name         Yeatease Translator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a custom "Yeatease" translation to Google Translate using Yeat-inspired lyrics.
// @match        https://translate.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511426/Yeatease%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/511426/Yeatease%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define Yeatease phrases to replace translations
    const yeateasePhrases = [
        "I’m with the gang, yeah, we roll deep!",
        "Pop out the whip, I’m feeling like Yeat!",
        "Got that money, stacking racks, racks!",
        "I’m sipping that Wock, yeah, it’s too sweet!",
        "Yeah, I got bands on bands, it’s a feast!",
        "Yeat season, let's go crazy!"
    ];

    // Function to randomly select a Yeatease phrase
    function getRandomYeateasePhrase() {
        return yeateasePhrases[Math.floor(Math.random() * yeateasePhrases.length)];
    }

    // Observe changes in the translation output box
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.target.innerText) {
                // Replace the translation output text with a random Yeatease phrase
                mutation.target.innerText = getRandomYeateasePhrase();
            }
        });
    });

    // Function to initiate observing the translation output box
    function observeTranslationBox() {
        const translationBox = document.querySelector('.J0lOec'); // Target translation output box
        if (translationBox) {
            observer.observe(translationBox, { childList: true, subtree: true });
        }
    }

    // Run observer once the page fully loads
    window.addEventListener('load', observeTranslationBox);
})();
