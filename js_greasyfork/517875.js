// ==UserScript==
// @name         SurferSEO Lines to Paragraph
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines lines separated by newlines into a single paragraph.
// @match        https://app.surferseo.com/drafts/*
// @grant        none
// @author       mhshan
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517875/SurferSEO%20Lines%20to%20Paragraph.user.js
// @updateURL https://update.greasyfork.org/scripts/517875/SurferSEO%20Lines%20to%20Paragraph.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to combine lines into a single paragraph
    function combineLinesToParagraph(text) {
        return text
            .split(/\n+/) // Split text by newlines
            .map(line => line.trim()) // Trim spaces from each line
            .filter(line => line.length > 0) // Remove empty lines
            .join(' '); // Combine lines into one paragraph with spaces
    }

    // Add a button to combine lines into a paragraph
    const combineButton = document.createElement('button');
    combineButton.innerText = 'Lines to Paragraph';
    combineButton.style.position = 'fixed';
    combineButton.style.top = '250px';
    combineButton.style.left = '60px';
    combineButton.style.padding = '10px 15px';
    combineButton.style.fontSize = '14px';
    combineButton.style.backgroundColor = '#000000';
    combineButton.style.color = 'white';
    combineButton.style.border = 'none';
    combineButton.style.borderRadius = '5px';
    combineButton.style.cursor = 'pointer';
    combineButton.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    combineButton.style.zIndex = '1000';
    document.body.appendChild(combineButton);

    // Hover animation for the button
    combineButton.addEventListener('mouseover', () => {
        combineButton.style.transform = 'scale(1.1)';
        combineButton.style.backgroundColor = '#3ccf4e';
    });

    combineButton.addEventListener('mouseout', () => {
        combineButton.style.transform = 'scale(1)';
        combineButton.style.backgroundColor = '#000000';
    });

    // Display "Combined!" confirmation message with animation
    const combinedMessage = document.createElement('div');
    combinedMessage.innerText = 'Combined!';
    combinedMessage.style.position = 'fixed';
    combinedMessage.style.top = '100px';
    combinedMessage.style.left = '60px';
    combinedMessage.style.padding = '5px 10px';
    combinedMessage.style.backgroundColor = '#4CAF50';
    combinedMessage.style.color = 'white';
    combinedMessage.style.fontSize = '14px';
    combinedMessage.style.borderRadius = '5px';
    combinedMessage.style.zIndex = '1000';
    combinedMessage.style.opacity = '0'; // Initially hidden
    combinedMessage.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(combinedMessage);

    // Event listener for the button
    combineButton.addEventListener('click', () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const combinedText = combineLinesToParagraph(selectedText);

            // Replace selected text with combined text in place
            document.execCommand('insertText', false, combinedText);

            // Show "Combined!" message with fade-in/out animation
            combinedMessage.style.opacity = '1'; // Fade in
            setTimeout(() => {
                combinedMessage.style.opacity = '0'; // Fade out after 1 second
            }, 1000);
        } else {
            // If no text is selected, show message
            combinedMessage.innerText = 'Please select text to combine!';
            combinedMessage.style.opacity = '1';
            setTimeout(() => {
                combinedMessage.style.opacity = '0';
                combinedMessage.innerText = 'Combined!';
            }, 1000);
        }
    });
})();
