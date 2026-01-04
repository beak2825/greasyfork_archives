// ==UserScript==
// @name         IAAI Documentation Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button for vehicle documentation on IAAI website
// @author       TheRockefelleR
// @match        https://ca.iaai.com/Vehicles/VehicleDetails*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522741/IAAI%20Documentation%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/522741/IAAI%20Documentation%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract stock number from the title
    function extractStockNumber(title) {
        const stockMatch = title.match(/Stock #:\s*(\d+)/);
        return stockMatch ? stockMatch[1] : null;
    }

    // Function to create and add the download button
    function addDownloadButton() {
        // Get the title element
        const titleElement = document.querySelector('h1');
        if (!titleElement) {
            console.log('Title element not found');
            return;
        }

        // Extract stock number from the title
        const stockNumber = extractStockNumber(titleElement.textContent);
        if (!stockNumber) {
            console.log('Stock number not found in title');
            return;
        }

        // Create the download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Documentation';
        downloadButton.style.cssText = `
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
            font-weight: bold;
        `;

        // Add hover effect
        downloadButton.onmouseover = () => {
            downloadButton.style.backgroundColor = '#0056b3';
        };
        downloadButton.onmouseout = () => {
            downloadButton.style.backgroundColor = '#007bff';
        };

        // Add click handler
        downloadButton.onclick = () => {
            const documentUrl = `https://ca.iaai.com/DisplayDocument?stockNumber=${stockNumber}`;
            window.open(documentUrl, '_blank');
        };

        // Insert the button after the title
        titleElement.parentNode.insertBefore(downloadButton, titleElement.nextSibling);
    }

    // Wait for the page to load and add the button
    window.addEventListener('load', addDownloadButton);

    // Also run on document ready in case the load event already fired
    if (document.readyState === 'complete') {
        addDownloadButton();
    }
})();