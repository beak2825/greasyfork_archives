// ==UserScript==
// @name         SurferSEO Title Case Transformer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert selected text to title case, remove numbers and numbered lists, and replace it in place with animated button and real-time selection processing
// @match        https://app.surferseo.com/drafts/*
// @grant        none
// @author       mhshan
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517825/SurferSEO%20Title%20Case%20Transformer.user.js
// @updateURL https://update.greasyfork.org/scripts/517825/SurferSEO%20Title%20Case%20Transformer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert text to title case and remove numbers and numbered lists
    function toTitleCaseAndRemoveNumbers(text) {
        return text
            .replace(/\b\d+\.\s*|\b\d+\b/g, '') // Remove standalone numbers and numbers with a trailing dot
            .replace(/\w\S*/g, function(word) { // Convert to title case
                // If the word is already uppercase, do not change it
                if (word === word.toUpperCase()) {
                    return word;
                }
                // Otherwise, convert to title case
                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            })
            .trim(); // Remove any extra spaces from the removed numbers
    }

    // Add a button to transform selected text in title case and remove numbers
    const transformButton = document.createElement('button');
    transformButton.innerText = 'Transform to Title Case';
    transformButton.style.position = 'fixed';
    transformButton.style.top = '350px';
    transformButton.style.left = '60px';
    transformButton.style.padding = '10px 15px';
    transformButton.style.fontSize = '14px';
    transformButton.style.backgroundColor = '#000000';
    transformButton.style.color = 'white';
    transformButton.style.border = 'none';
    transformButton.style.borderRadius = '5px';
    transformButton.style.cursor = 'pointer';
    transformButton.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    transformButton.style.zIndex = '1000';
    document.body.appendChild(transformButton);

    // Hover animation for the button
    transformButton.addEventListener('mouseover', () => {
        transformButton.style.transform = 'scale(1.1)';
        transformButton.style.backgroundColor = '#3ccf4e';
    });

    transformButton.addEventListener('mouseout', () => {
        transformButton.style.transform = 'scale(1)';
        transformButton.style.backgroundColor = '#000000';
    });

    // Display "Transformed!" confirmation message with animation
    const transformedMessage = document.createElement('div');
    transformedMessage.innerText = 'Transformed!';
    transformedMessage.style.position = 'fixed';
    transformedMessage.style.top = '300px';
    transformedMessage.style.left = '60px';
    transformedMessage.style.padding = '5px 10px';
    transformedMessage.style.backgroundColor = '#4CAF50';
    transformedMessage.style.color = 'white';
    transformedMessage.style.fontSize = '14px';
    transformedMessage.style.borderRadius = '5px';
    transformedMessage.style.zIndex = '1000';
    transformedMessage.style.opacity = '0'; // Initially hidden
    transformedMessage.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(transformedMessage);

    // Event listener for the button
    transformButton.addEventListener('click', () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const transformedText = toTitleCaseAndRemoveNumbers(selectedText);

            // Replace selected text with transformed text in place
            document.execCommand("insertText", false, transformedText);

            // Show "Transformed!" message with fade-in/out animation
            transformedMessage.style.opacity = '1'; // Fade in
            setTimeout(() => {
                transformedMessage.style.opacity = '0'; // Fade out after 1 second
            }, 1000);
        } else {
            // If no text is selected, show message
            transformedMessage.innerText = 'Please select text to transform!';
            transformedMessage.style.opacity = '1';
            setTimeout(() => {
                transformedMessage.style.opacity = '0';
                transformedMessage.innerText = 'Transformed!';
            }, 1000);
        }
    });
})();
