// ==UserScript==
// @name         ArXiv to AlphaXiv
// @namespace    https://github.com/pangahn/arxiv-navigator
// @version      0.2
// @description  Add a button to jump from arXiv to AlphaXiv for the same paper
// @author       pangahn
// @match        https://*.arxiv.org/abs/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537270/ArXiv%20to%20AlphaXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/537270/ArXiv%20to%20AlphaXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the paper ID from the URL
    function getPaperIdFromUrl() {
        const url = window.location.href;
        // Match both formats: 2504.04736 and 2504.04736v2
        const match = url.match(/arxiv\.org\/abs\/(\d+\.\d+(?:v\d+)?)/);
        return match ? match[1] : null;
    }

    // Function to create and insert the button
    function createJumpButton() {
        const paperId = getPaperIdFromUrl();
        if (!paperId) return;

        // Extract the base paper ID without version if present
        const baseId = paperId.split('v')[0];

        // Create the button element
        const button = document.createElement('a');
        button.href = `https://www.alphaxiv.org/abs/${baseId}`;
        button.className = 'abs-button download-pdf';
        button.target = '_blank';
        button.textContent = 'View on AlphaXiv';
        button.style.display = 'inline-block';

        // Find the View PDF link
        const pdfLink = document.querySelector('a.download-pdf');
        if (pdfLink) {
            // Find the parent li element
            const parentLi = pdfLink.closest('li');
            if (parentLi) {
                // Create a new li element for our button
                const newLi = document.createElement('li');
                newLi.appendChild(button);

                // Insert after the PDF link's li element
                if (parentLi.nextSibling) {
                    parentLi.parentNode.insertBefore(newLi, parentLi.nextSibling);
                } else {
                    parentLi.parentNode.appendChild(newLi);
                }
            }
        }
    }

    // Run the script after the page has loaded
    window.addEventListener('load', createJumpButton);
})();
