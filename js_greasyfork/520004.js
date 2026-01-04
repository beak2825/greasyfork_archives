// ==UserScript==
// @name         Word and Character Counts for Selected Text.
// @namespace    https://github.com/Iquaridys
// @version      1.0.7
// @description  Display word and character count for all selected text using icons, including and excluding whitespace in character count
// @author       Iquaridys
// @license      GNU GPLv3
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520004/Word%20and%20Character%20Counts%20for%20Selected%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/520004/Word%20and%20Character%20Counts%20for%20Selected%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a floating display element for the count
    const countDiv = document.createElement('div');
    Object.assign(countDiv.style, {
        position: 'fixed',
        bottom: '5px',
        right: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '5px',
        zIndex: '10000',
        display: 'none',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        whiteSpace: 'nowrap',
    });
    document.body.appendChild(countDiv);

    // Count words, characters (with and without whitespace)
    function getTextCount(text) {
        const characterCountWithWhitespace = text.length; // Includes all characters, even spaces
        const characterCountWithoutWhitespace = text.replace(/\s+/g, '').length; // Removes spaces
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        return { characterCountWithWhitespace, characterCountWithoutWhitespace, wordCount };
    }

    // Event listener for text selection
    document.addEventListener('mouseup', () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const { characterCountWithWhitespace, characterCountWithoutWhitespace, wordCount } = getTextCount(selectedText);

            // Use icons for word and character count
            const charIcon = '🅰️';
            const wordIcon = '🔤';

            countDiv.innerHTML = `${wordIcon} ${wordCount} | ${charIcon} ${characterCountWithoutWhitespace} ~ ${characterCountWithWhitespace} `;
            countDiv.style.display = 'block';
        } else {
            countDiv.style.display = 'none';
        }
    });

    // Hide the countDiv if the user clicks outside of selected text
    document.addEventListener('mousedown', () => {
        countDiv.style.display = 'none';
    });
})();
