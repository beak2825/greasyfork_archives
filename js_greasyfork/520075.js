// ==UserScript==
// @name         Hakusensha Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Downloader for Hakusensha.
// @author       Baconana-chan
// @match        https://hakusensha.tameshiyo.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520075/Hakusensha%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/520075/Hakusensha%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set to store already downloaded images
    const downloadedImages = new Set();

    // Flag to control whether the script is active
    let scriptActive = false;

    // Timeout for pausing between block scrolls (to avoid auto-refresh)
    const scrollPauseTime = 3000; // Increased pause time to 3 seconds between scrolling blocks

    // Create a button to activate/deactivate the script for downloading images
    const buttonDownload = document.createElement('button');
    buttonDownload.textContent = 'Start Downloading Images';
    buttonDownload.style.position = 'fixed';
    buttonDownload.style.top = '20px';
    buttonDownload.style.right = '20px';
    buttonDownload.style.zIndex = '9999';  // Ensure it's above other page elements
    buttonDownload.style.padding = '10px';
    buttonDownload.style.backgroundColor = '#4CAF50';
    buttonDownload.style.color = 'white';
    buttonDownload.style.border = 'none';
    buttonDownload.style.borderRadius = '5px';
    buttonDownload.style.cursor = 'pointer';
    document.body.appendChild(buttonDownload);

    // Create the retry button (shown when all images are downloaded)
    const buttonRetry = document.createElement('button');
    buttonRetry.textContent = 'Retry Download';
    buttonRetry.style.position = 'fixed';
    buttonRetry.style.top = '20px';
    buttonRetry.style.right = '220px';
    buttonRetry.style.zIndex = '9999';
    buttonRetry.style.padding = '10px';
    buttonRetry.style.backgroundColor = '#f44336'; // Red color for retry button
    buttonRetry.style.color = 'white';
    buttonRetry.style.border = 'none';
    buttonRetry.style.borderRadius = '5px';
    buttonRetry.style.cursor = 'pointer';
    buttonRetry.style.display = 'none'; // Initially hidden
    document.body.appendChild(buttonRetry);

    // Add click event listener to toggle the script on/off
    buttonDownload.addEventListener('click', () => {
        if (scriptActive) {
            scriptActive = false;
            buttonDownload.textContent = 'Start Downloading Images';
            buttonDownload.style.backgroundColor = '#4CAF50';
        } else {
            scriptActive = true;
            buttonDownload.textContent = 'Stop Downloading Images';
            buttonDownload.style.backgroundColor = '#f44336';
            startDownloading();
        }
    });

    // Add click event listener for the retry button
    buttonRetry.addEventListener('click', () => {
        // Do not clear the downloaded images set, just reset the process for the next block
        scriptActive = true; // Restart the image download process
        buttonRetry.style.display = 'none'; // Hide the retry button
        startDownloading(); // Start the process again
    });

    // Function to extract Base64 images from the page
    function extractBase64Images() {
        if (!scriptActive) return; // If the script is inactive, stop execution

        const images = document.querySelectorAll('img');
        let newImagesFound = false;

        images.forEach(img => {
            if (img.src && img.src.startsWith('data:image/') && !downloadedImages.has(img.src)) {
                const base64String = img.src;
                const extension = base64String.split(';')[0].split('/')[1];
                const fileName = `image_${Date.now()}.${extension}`;
                downloadBase64Image(base64String, fileName);
                downloadedImages.add(base64String);
                newImagesFound = true;
            }
        });

        // If no new images were found, show retry button
        if (!newImagesFound) {
            buttonRetry.style.display = 'inline-block'; // Show the retry button
        }
    }

    // Function to download the Base64 image
    function downloadBase64Image(base64String, fileName) {
        const link = document.createElement('a');
        link.href = base64String;
        link.download = fileName;
        link.click();
    }

    // Function to handle the scrolling logic and image extraction
    function startDownloading() {
        let currentPage = 0;
        let totalPages = getTotalPages(); // Get the total number of blocks/pages

        // Start an interval to download images and scroll blocks periodically
        const downloadInterval = setInterval(() => {
            if (!scriptActive || currentPage >= totalPages) {
                return; // Stop the interval if script is inactive or all pages are processed
            }

            // Extract images from the current block
            extractBase64Images();

            // Scroll to the next block after a pause
            currentPage++;
            scrollToNextBlock(currentPage);

        }, scrollPauseTime); // Pause between block scrolls to avoid quick refreshes
    }

    // Function to scroll to the next block (simulating user scroll)
    function scrollToNextBlock(page) {
        const blocks = document.querySelectorAll('div#book_frame.csr_default');
        if (blocks && blocks[page]) {
            blocks[page].scrollIntoView({ behavior: 'smooth' });

            // After scrolling, try to extract images again from the new block
            setTimeout(() => {
                extractBase64Images(); // Extract images from the newly loaded block
            }, 1000); // Wait 1 second to ensure the new block has loaded
        }
    }

    // Function to get the total number of pages (blocks) from the page indicator
    function getTotalPages() {
        const pageIndicator = document.querySelector('#page_indicator');
        if (pageIndicator) {
            const [current, total] = pageIndicator.textContent.split('/').map(x => parseInt(x.trim()));
            return total || 0;
        }
        return 0;
    }

    // Block the page refresh by preventing the `beforeunload` event
    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = '';  // Standard for modern browsers to show a confirmation dialog
    });

    // --- Suppression of unexpected reloads (from provided script) ---
    (function() {
        const patch_func = () => {
            const setTimeoutOrig = window.setTimeout;

            window.setTimeout = function(func, delay) {
                if ((delay < 1000) && (0 <= func.toString().indexOf('"pjax:timeout"'))) {
                    // function(){l("pjax:timeout",[t,e])&&t.abort("timeout")}
                    delay = 30000; // Set delay to 30 seconds to avoid reload timeout
                }
                setTimeoutOrig.call(this, func, delay);
            }
        };

        const script = document.createElement('script');
        script.async = false;
        script.textContent = '(' + patch_func.toString() + ')();';
        document.documentElement.appendChild(script);
    })();

})();