// ==UserScript==
// @name         YP Video-Link Extractor v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extracts a specific URL from a webpage's source and displays it as a link in a banner at the top of the page, accounting for dynamically added content. Removes all backslashes from the URL. Adds a close button to the banner.
// @author       Me
// @license      GNU GPLv3
// @match        https://www.youporn.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500606/YP%20Video-Link%20Extractor%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/500606/YP%20Video-Link%20Extractor%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // Function to create and insert the banner
    function createBanner(url) {
        // Check if the banner already exists
        if (document.getElementById('url-extractor-banner')) {
            return;
        }

        // Create the banner
        const banner = document.createElement('div');
        banner.id = 'url-extractor-banner';
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = '#ffcc00';
        banner.style.color = '#000';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.zIndex = '9999';
        banner.style.fontSize = '16px';
        banner.style.fontFamily = 'Arial, sans-serif';
        banner.style.display = 'flex';
        banner.style.justifyContent = 'space-between';
        banner.style.alignItems = 'center';

        // Create the link
        const link = document.createElement('a');
        link.href = url;
        link.textContent = 'Found URL: ' + url;
        link.style.color = '#000';
        link.style.textDecoration = 'none';

        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginLeft = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#ff0000';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.style.borderRadius = '5px';

        // Add event listener to the close button
        closeButton.addEventListener('click', () => {
            banner.remove();
        });

        // Add the link and close button to the banner
        const linkContainer = document.createElement('div');
        linkContainer.appendChild(link);

        banner.appendChild(closeButton);
        banner.appendChild(linkContainer);

        // Add the banner to the document
        document.body.appendChild(banner);
    }

    // Function to extract and display the URL
    function extractAndDisplayURL() {
        // Define the regex pattern to find the desired URL
        const regex = /https:\\\/\\\/www\.youporn\.com\\\/media\\\/mp4\\\/\?s=(\w)+/g;

        // Get the entire HTML page as text
        const bodyText = document.body.innerHTML;

        // Apply the regex to extract the URL
        const matches = bodyText.match(regex);

        // Check if a match was found
        if (matches) {
            // Display all found matches
            matches.forEach((match) => {
                // Remove all backslashes
                const cleanedURL = match.replace(/\\/g, '');
                createBanner(cleanedURL);
            });
            return true;
        }
        return false;
    }

    // Set up MutationObserver to respond to changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                if (extractAndDisplayURL()) {
                    observer.disconnect(); // Stop observing if the URL was found
                    break;
                }
            }
        }
    });

    // Configuration options for the MutationObserver
    const config = { childList: true, subtree: true };

    // Start the observer
    observer.observe(document.body, config);

    // Perform an initial call in case the URL is already present
    extractAndDisplayURL();

})();