// ==UserScript==
// @name         AlternativeTo Download Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to AlternativeTo.net listings
// @author       You
// @match        https://alternativeto.net/software/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533449/AlternativeTo%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533449/AlternativeTo%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the "Official Website" link
        const officialLink = document.querySelector('a[href*="://"]'); // Adjust selector if needed
        if (officialLink) {
            // Create a download button
            const downloadBtn = document.createElement('a');
            downloadBtn.href = officialLink.href; // Link to the official site
            downloadBtn.textContent = 'Download';
            downloadBtn.style.backgroundColor = '#4CAF50';
            downloadBtn.style.color = 'white';
            downloadBtn.style.padding = '8px 16px';
            downloadBtn.style.borderRadius = '4px';
            downloadBtn.style.marginLeft = '10px';
            downloadBtn.style.textDecoration = 'none';

            // Insert the button next to the official link
            officialLink.parentNode.insertBefore(downloadBtn, officialLink.nextSibling);
        }
    });
})();