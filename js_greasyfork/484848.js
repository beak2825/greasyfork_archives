// ==UserScript==
// @name         DeepL Translator for Archive of Our Own
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a DeepL translation button for Archive of Our Own
// @author       AlmazUvelir
// @match        https://archiveofourown.org/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484848/DeepL%20Translator%20for%20Archive%20of%20Our%20Own.user.js
// @updateURL https://update.greasyfork.org/scripts/484848/DeepL%20Translator%20for%20Archive%20of%20Our%20Own.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createTranslationButton() {
        // Create a button element
        var translationButton = document.createElement('button');
        translationButton.innerHTML = 'Перевод DeepL';

        // Apply styles from 08-actions.css
        translationButton.classList.add('your-button-class'); // Замените 'your-button-class' на класс из 08-actions.css

        // Add a click event listener to the button
        translationButton.addEventListener('click', function() {
            // Get the text from the specified div
            var chaptersDiv = document.getElementById('chapters');
            var textToTranslate = chaptersDiv.innerText;

            // Open DeepL in a new tab and pass the text for translation
            window.open('https://www.deepl.com/translator#en/ru/' + encodeURIComponent(textToTranslate), '_blank');
        });

        // Insert the button before the specified div
        var workskinDiv = document.getElementById('workskin');
        workskinDiv.parentNode.insertBefore(translationButton, workskinDiv);
    }

    // Call the function to create the translation button
    createTranslationButton();
})();
