// ==UserScript==
// @name         FastReader for Hindi and English
// @version      1.8
// @description  Enhance fast reading by highlighting specific syllables in Hindi script and letters in English script for Hindi and English web pages respectively. Works on all websites. Press Alt + R to toggle FastReader.
// @license      MIT
// @match        *://*/*
// @grant        none
// @author       iamnobody
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/489029/FastReader%20for%20Hindi%20and%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/489029/FastReader%20for%20Hindi%20and%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the toggle button
    var toggleButton = document.createElement('button');
    toggleButton.id = 'fast-reader-toggle-button';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px'; // Reduced from 20px
    toggleButton.style.left = '10px'; // Reduced from 20px
    toggleButton.style.width = '30px'; // Reduced from 50px
    toggleButton.style.height = '30px'; // Reduced from 50px
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = 'red';
    toggleButton.style.color = 'white';
    toggleButton.style.fontSize = '16px'; // Reduced from 24px
    toggleButton.style.border = 'none';
    toggleButton.innerText = 'R';
    toggleButton.setAttribute('aria-label', 'Toggle Fast Reading (Alt + R)');
    document.body.appendChild(toggleButton);

    // Set default state of fast reading feature
    var isFastReadingOn = false;

    // Add event listener to toggle button
    toggleButton.addEventListener('click', toggleFastReading);

    // Add event listener for Alt + R keyboard shortcut
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'r') {
            toggleFastReading();
        }
    });

    // Function to toggle fast reading feature
    function toggleFastReading() {
        // Toggle fast reading feature and button color
        isFastReadingOn = !isFastReadingOn;
        toggleButton.style.backgroundColor = isFastReadingOn ? 'green' : 'red';

        // Activate/deactivate fast reading feature based on button state
        if (isFastReadingOn) {
            activateFastReading();
        } else {
            deactivateFastReading();
        }
    }

    // Function to activate fast reading feature
    function activateFastReading() {
        // Apply bold styling to text content in the document
        applyBoldStyling(document.body);
    }

    // Function to deactivate fast reading feature
    function deactivateFastReading() {
        // Remove bold styling from all elements
        var boldElements = document.querySelectorAll('b.fast-reader-bold');
        boldElements.forEach(function(element) {
            element.classList.remove('fast-reader-bold');
        });
    }

    // Function to apply bold styling to specified number of syllables in each word in the text content
    function applyBoldStyling(element) {
        // Check if the element is a text node
        if (element.nodeType === Node.TEXT_NODE) {
            var text = element.textContent.trim();
            var words = text.split(/\s+/); // Split text into words

            var newNode = document.createElement('span');
            words.forEach(function(word) {
                var highlightedWord = highlightWord(word);
                newNode.innerHTML += highlightedWord + ' ';
            });

            // Replace text content with styled HTML
            element.parentNode.replaceChild(newNode, element);
        } else {
            // Traverse child nodes recursively
            var children = element.childNodes;
            children.forEach(function(child) {
                applyBoldStyling(child);
            });
        }
    }

    // Function to highlight the specific syllables in Hindi script and letters in English script
    function highlightWord(word) {
        if (isHindiWord(word)) {
            // Highlight the specific syllables in Hindi words
            var highlightedWord = '';
            var i = 0;
            while (i < word.length) {
                var currentChar = word.charAt(i);
                var nextChar = word.charAt(i + 1);
                var combinedChar = currentChar + nextChar;
                if (isSpecialHindiCharacter(combinedChar)) {
                    highlightedWord += '<b class="fast-reader-bold">' + combinedChar + '</b>';
                    i += 2; // Skip the combined character
                } else {
                    highlightedWord += '<b class="fast-reader-bold">' + currentChar + '</b>';
                    i++;
                }
            }
            return highlightedWord;
        } else {
            // Highlight the first 4-5 letters in English words
            return '<b class="fast-reader-bold">' + word.substring(0, 5) + '</b>' + word.substring(5);
        }
    }

    // Function to detect if a word is in Hindi script
    function isHindiWord(word) {
        // Check if any character in the word falls within the Hindi Unicode range
        for (var i = 0; i < word.length; i++) {
            var charCode = word.charCodeAt(i);
            if (charCode >= 0x0900 && charCode <= 0x097F) {
                return true;
            }
        }
        return false;
    }

    // Function to check if a character is a special Hindi character
    function isSpecialHindiCharacter(character) {
        var charCode = character.charCodeAt(0);
        // Check if the character falls within the specified Unicode range
        if ((charCode >= 0x0901 && charCode <= 0x0903) || (charCode >= 0x093A && charCode <= 0x0957)) {
            return true;
        }
        return false;
    }
})();
