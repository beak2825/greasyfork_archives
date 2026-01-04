// ==UserScript==
// @name         SurferSEO Copy Words Limit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy text automatically from the specified div on SurferSEO drafts page
// @author       mhshan
// @match        https://app.surferseo.com/drafts/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517836/SurferSEO%20Copy%20Words%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/517836/SurferSEO%20Copy%20Words%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the page is fully loaded
    window.addEventListener('load', function() {

        // Create a button to copy the text
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Words Limit';
        copyButton.style.position = 'absolute'; // Position the button where you want
        copyButton.style.top = '10px'; // You can adjust the position as needed
        copyButton.style.right = '650px';
        copyButton.style.padding = '10px';
        copyButton.style.backgroundColor = '#3ccf4e';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '14px';
        copyButton.style.borderRadius = '5px';
        copyButton.style.zIndex = '1000';


        // Append the button to the body
        document.body.appendChild(copyButton);

        // Add click event listener to the button
        copyButton.addEventListener('click', function() {
            // Get the text content from the div
            const textToCopy = document.querySelector('.StructuralGuidelinesstyled__StructuralGuidelineRange-sc-1mxtki-1.eGzjqM').textContent;

            // Copy the text to the clipboard
            GM_setClipboard(textToCopy);
           
        });
    });
})();
