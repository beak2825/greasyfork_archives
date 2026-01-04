// ==UserScript==
// @name         CobaltAPI Batch Auto Download All Sources with Cancel
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Automatically downloads all sources on CobaltAPI playlist pages in randomized batches with the ability to cancel the process
// @author       Chris
// @license      MIT
// @match        https://cobaltapis.vercel.app/playlist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524518/CobaltAPI%20Batch%20Auto%20Download%20All%20Sources%20with%20Cancel.user.js
// @updateURL https://update.greasyfork.org/scripts/524518/CobaltAPI%20Batch%20Auto%20Download%20All%20Sources%20with%20Cancel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration Settings
     */
    const CONFIG = {
        DOWNLOAD_BUTTON_SELECTOR: 'button.download-btn',
        BATCH_SIZE_RANGE: [3, 5], // Randomize batch size between 3 to 5
        NORMAL_BATCH_DELAY_RANGE_MS: [4000, 7000], // 4-7 seconds delay between normal batches
        EXTENDED_BATCH_DELAY_RANGE_MS: [15000, 25000], // 15-25 seconds delay after every third batch
        DOWNLOAD_DELAY_RANGE_MS: [2000, 4000], // 2-4 seconds delay between individual downloads within a batch
        RETRY_LIMIT: 3, // Number of retry attempts for failed downloads
    };

    /**
     * State Tracking
     */
    let totalClicked = 0;
    let totalFailed = 0;
    let isCancelled = false;
    let currentTimeout = null;

    /**
     * Utility function to apply styles to an element.
     * @param {HTMLElement} element - The element to style.
     * @param {Object} styles - A key-value pair of CSS properties and values.
     */
    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    /**
     * Detects if the current page is the "Too Many Requests" page.
     * Adjust the detection logic based on the actual content or URL.
     * @returns {boolean} True if on "Too Many Requests" page, else false.
     */
    function isTooManyRequestsPage() {
        // Example detection based on URL
        if (window.location.href.includes('too-many-requests')) {
            return true;
        }

        // Example detection based on page content
        const bodyText = document.body.textContent || '';
        if (bodyText.toLowerCase().includes('too many requests')) {
            return true;
        }

        return false;
    }

    /**
     * Creates and styles a button.
     * @param {string} label - The text to display on the button.
     * @param {string} id - The unique ID for the button.
     * @returns {HTMLElement} The styled button element.
     */
    function createButton(label, id) {
        const button = document.createElement('button');
        button.innerText = label;
        button.id = id;

        // Apply common styles
        applyStyles(button, {
            padding: '10px 20px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
        });

        return button;
    }

    /**
     * Creates and styles the "Download All" and "Cancel" buttons.
     */
    function createControlButtons() {
        // Check if buttons already exist
        if (document.getElementById('download-all-button') || document.getElementById('cancel-button')) {
            return;
        }

        // Create "Download All" button
        const downloadButton = createButton('Download All', 'download-all-button');
        applyStyles(downloadButton, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#28a745',
            color: '#ffffff',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        });

        // Create "Cancel" button (hidden by default)
        const cancelButton = createButton('Cancel', 'cancel-button');
        applyStyles(cancelButton, {
            position: 'fixed',
            bottom: '20px',
            right: '150px', // Adjusted to prevent overlapping
            backgroundColor: '#dc3545',
            color: '#ffffff',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'none',
        });

        // Append buttons to the body
        document.body.appendChild(downloadButton);
        document.body.appendChild(cancelButton);

        return { downloadButton, cancelButton };
    }

    /**
     * Generates a random integer between min and max (inclusive).
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @returns {number} Random integer between min and max.
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a random delay within the specified range.
     * @param {number[]} range - Array with two numbers [min, max].
     * @returns {number} Random delay in milliseconds.
     */
    function getRandomDelay(range) {
        const [min, max] = range;
        return getRandomInt(min, max);
    }

    /**
     * Simulates a click on a download button.
     * @param {HTMLElement} button - The download button to click.
     * @returns {Promise} Resolves when the click is simulated.
     */
    function clickDownloadButton(button) {
        return new Promise((resolve, reject) => {
            try {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                button.click();
                console.log(`Clicked download button (${totalClicked + 1}):`, button);
                resolve();
            } catch (error) {
                console.error(`Failed to click download button:`, button, error);
                reject(error);
            }
        });
    }

    /**
     * Initiates the download process in randomized batches with dynamic delays.
     * @param {Array} downloadButtons - Array of download button elements.
     * @param {HTMLElement} cancelButton - The "Cancel" button element.
     */
    async function initiateBatchDownloads(downloadButtons, cancelButton) {
        // Reset tracking variables
        totalClicked = 0;
        totalFailed = 0;
        isCancelled = false;

        // Disable "Download All" button and show "Cancel" button
        const downloadAllButton = document.getElementById('download-all-button');
        downloadAllButton.disabled = true;
        downloadAllButton.innerText = 'Downloading...';
        cancelButton.style.display = 'block';

        // Split the download buttons into randomized batches (3-5 per batch)
        const batches = [];
        let index = 0;
        while (index < downloadButtons.length) {
            const batchSize = getRandomInt(CONFIG.BATCH_SIZE_RANGE[0], CONFIG.BATCH_SIZE_RANGE[1]);
            const batch = downloadButtons.slice(index, index + batchSize);
            batches.push(batch);
            index += batchSize;
        }

        console.log(`Total Batches: ${batches.length}`);

        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            // Check if cancelled
            if (isCancelled) {
                console.warn('Download process was cancelled by the user.');
                break;
            }

            // Detect if redirected to "Too Many Requests" page
            if (isTooManyRequestsPage()) {
                console.warn('Detected "Too Many Requests" page. Halting script execution.');
                alert('Download process halted: Too many requests detected.');
                break;
            }

            const currentBatch = batches[batchIndex];
            console.log(`Starting batch ${batchIndex + 1} of ${batches.length}`);

            for (let i = 0; i < currentBatch.length; i++) {
                const button = currentBatch[i];
                let attempt = 0;
                let success = false;

                while (attempt < CONFIG.RETRY_LIMIT && !success) {
                    // Check if cancelled before each attempt
                    if (isCancelled) {
                        console.warn('Download process was cancelled by the user.');
                        break;
                    }

                    try {
                        await clickDownloadButton(button);
                        totalClicked++;
                        console.log(`Successfully clicked download button (${totalClicked}/${downloadButtons.length}):`, button);
                        success = true;
                    } catch (error) {
                        attempt++;
                        console.warn(`Retrying download for button ${button} (Attempt ${attempt} of ${CONFIG.RETRY_LIMIT})`);
                        if (attempt < CONFIG.RETRY_LIMIT) {
                            // Exponential backoff delay
                            const backoffDelay = getRandomInt(2000, 4000) * attempt; // e.g., 4s, 8s, 12s
                            console.log(`Waiting for ${backoffDelay / 1000} seconds before retrying...`);
                            await new Promise(res => setTimeout(res, backoffDelay));
                        } else {
                            console.error(`Failed to download after ${CONFIG.RETRY_LIMIT} attempts:`, button);
                            totalFailed++;
                            console.warn(`Download failed for button (${totalFailed}/${downloadButtons.length}):`, button);
                        }
                    }
                }

                // Wait for a random delay between individual downloads within the batch
                if (!isCancelled && success) {
                    const individualDelay = getRandomDelay(CONFIG.DOWNLOAD_DELAY_RANGE_MS);
                    console.log(`Waiting for ${individualDelay / 1000} seconds before next download...`);
                    await new Promise(res => setTimeout(res, individualDelay));
                }
            }

            console.log(`Completed batch ${batchIndex + 1} of ${batches.length}`);

            // Determine delay between batches
            if ((batchIndex + 1) % 3 === 0) {
                // Every third batch: 10-20 seconds delay
                const extendedDelay = getRandomDelay(CONFIG.EXTENDED_BATCH_DELAY_RANGE_MS);
                console.log(`Waiting for ${extendedDelay / 1000} seconds after every third batch...`);
                await new Promise(res => setTimeout(res, extendedDelay));
            } else {
                // Other batches: 4-7 seconds delay
                const normalDelay = getRandomDelay(CONFIG.NORMAL_BATCH_DELAY_RANGE_MS);
                console.log(`Waiting for ${normalDelay / 1000} seconds before starting the next batch...`);
                await new Promise(res => setTimeout(res, normalDelay));
            }
        }

        // Re-enable "Download All" button and hide "Cancel" button
        downloadAllButton.disabled = false;
        downloadAllButton.innerText = 'Download All';
        cancelButton.style.display = 'none';

        // Display the final counts
        alert(`Download process completed.\nSuccessfully downloaded: ${totalClicked}\nFailed: ${totalFailed}`);
    }

    /**
     * Initializes the script by adding the "Download All" and "Cancel" buttons to the page.
     */
    function initialize() {
        // Detect if the current page is the "Too Many Requests" page
        if (isTooManyRequestsPage()) {
            console.warn('Detected "Too Many Requests" page. Halting script execution.');
            return;
        }

        // Create control buttons
        const { downloadButton, cancelButton } = createControlButtons();

        // Add click event listener to "Download All" button
        downloadButton.addEventListener('click', () => {
            const downloadButtonsNodeList = document.querySelectorAll(CONFIG.DOWNLOAD_BUTTON_SELECTOR);
            const downloadButtons = Array.from(downloadButtonsNodeList);
            initiateBatchDownloads(downloadButtons, cancelButton);
        });

        // Add click event listener to "Cancel" button
        cancelButton.addEventListener('click', () => {
            isCancelled = true;
            console.log('Cancellation requested by the user.');
        });
    }

    /**
     * Observes changes in the DOM to handle dynamic content loading.
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations, obs) => {
            // Re-initialize the buttons if new content is loaded
            initialize();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize the script once the DOM is fully loaded
    window.addEventListener('load', () => {
        initialize();
        observeDOMChanges();
    });

})();
