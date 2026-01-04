// ==UserScript==
// @name         Wykop Image Original Filename Downloader
// @namespace    http://tampermonkey.net/
// @icon         https://i.imgur.com/OtAgc3A.png
// @version      1.3
// @description  Downloads images from wykop.pl with their original filenames
// @author       stopbreathing
// @match        https://wykop.pl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527932/Wykop%20Image%20Original%20Filename%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527932/Wykop%20Image%20Original%20Filename%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set to store already processed links
    const processedLinks = new Set();

    // Function to handle image links
    function processImageLinks() {
        // Select all links that match the CDN pattern
        const imageLinks = document.querySelectorAll('a[href*="wykop.pl/cdn"]');

        imageLinks.forEach(link => {
            // Skip if we've already processed this link
            if (processedLinks.has(link)) return;

            // Add to processed set
            processedLinks.add(link);

            // Get the original URL
            const originalUrl = link.href;

            // Check if this is a "Pobierz" button
            const isPobierzButton = link.textContent.trim() === 'Pobierz';

            // If it's a Pobierz button, get the filename from the source link
            let originalFilename;
            if (isPobierzButton) {
                // Find the source link in the same figcaption
                const figcaption = link.closest('figcaption');
                if (figcaption) {
                    const sourceLink = figcaption.querySelector('p a');
                    if (sourceLink) {
                        originalFilename = sourceLink.textContent.trim();
                    }
                }
            } else {
                originalFilename = link.textContent.trim();
            }

            // Get the file extension from the URL
            // Remove query parameters before getting extension
            const extension = originalUrl.split('?')[0].split('.').pop();

            // Only process if we have both filename and extension
            if (originalFilename && extension) {
                // Create a click event handler
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // Stop event bubbling

                    // Create a temporary anchor element
                    const tempLink = document.createElement('a');
                    // Use the URL without query parameters
                    tempLink.href = originalUrl;
                    // Ensure the filename is clean (remove any possible query parameters)
                    const cleanFilename = originalFilename.split('?')[0];
                    tempLink.download = `${cleanFilename}.${extension}`;

                    // Append to body, click, and remove
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    tempLink.remove();
                }, { once: true }); // This ensures the event listener only fires once
            }
        });
    }

    // Initial processing
    processImageLinks();

    // Create a debounced version of processImageLinks
    let debounceTimer;
    const debouncedProcess = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processImageLinks, 500);
    };

    // Create a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(debouncedProcess);

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();