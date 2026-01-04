// ==UserScript==
// @name         SurferSEO Paragraph to New Line (Abbreviation-Safe)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Splits paragraphs into new lines after each sentence, preserving abbreviations like U.S., U.K., etc.
// @match        https://app.surferseo.com/drafts/*
// @grant        none
// @author       mhshan
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517824/SurferSEO%20Paragraph%20to%20New%20Line%20%28Abbreviation-Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517824/SurferSEO%20Paragraph%20to%20New%20Line%20%28Abbreviation-Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to convert a paragraph into new lines
    function convertParagraphToNewLines(text) {
        // List of common abbreviations to preserve
        const abbreviations = [
            "U.S.", "U.K.", "i.e.", "e.g.", "etc.", "Dr.", "Mr.", "Mrs.", "Jr.", "Sr.", "Prof.", "Inc."
        ];

        // Replace abbreviations with unique placeholders
        const placeholders = [];
        abbreviations.forEach((abbr, index) => {
            const placeholder = `__ABBR${index}__`;
            placeholders.push(placeholder);
            text = text.replace(new RegExp(abbr.replace(/\./g, '\\.'), 'g'), placeholder);
        });

        // Split sentences by periods followed by spaces, ensuring abbreviations are not split
        let sentences = text
            .split(/(?<=\.)\s+/) // Split at periods followed by spaces
            .map(sentence => sentence.trim()) // Trim extra spaces
            .filter(sentence => sentence.length > 0); // Remove empty entries

        // Restore abbreviations from placeholders
        sentences = sentences.map(sentence => {
            placeholders.forEach((placeholder, index) => {
                sentence = sentence.replace(new RegExp(placeholder, 'g'), abbreviations[index]);
            });
            return sentence;
        });

        // Join sentences with new lines
        return sentences.join('\n');
    }

    // Add a button to trigger the transformation
    const transformButton = document.createElement('button');
    transformButton.innerText = 'Paragraph to Lines';
    transformButton.style.position = 'fixed';
    transformButton.style.top = '300px';
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
    transformedMessage.style.top = '100px';
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
            const transformedText = convertParagraphToNewLines(selectedText);

            // Replace selected text with transformed text in place
            document.execCommand('insertText', false, transformedText);

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
