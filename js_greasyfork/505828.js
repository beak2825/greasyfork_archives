// ==UserScript==
// @name         Copy Transcript Text Button for Coursera
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to copy transcript text to clipboard on Coursera course video pages
// @author       Your Name
// @match        https://*.coursera.org/learn/*/lecture/*
// @grant        none
// @run-at       document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/505828/Copy%20Transcript%20Text%20Button%20for%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/505828/Copy%20Transcript%20Text%20Button%20for%20Coursera.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyToClipboard(text) {
       text = text.slice(203);
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    // Function to add the copy button
    function addButton() {
        // Ensure the transcript lighter element exists


        // Create button element
        const button = document.createElement('button');
        button.textContent = 'Copy Transcript Text';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '150px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        // Add button to the page
        document.body.appendChild(button);

        var transcriptLighter
        // Add click event listener to the button
        button.addEventListener('click', () => {
        if (!transcriptLighter) {
            transcriptLighter = document.querySelector('div[id$="-panel-TRANSCRIPT"]');
        }
            const text = transcriptLighter.textContent.trim();
            if (text) {
                copyToClipboard(text);
            } 
        });
    }

    // Wait until the page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(addButton,2000); // Delay to ensure the transcript is loaded
    });

})();