// ==UserScript==
// @name         Automatic Me Response Catcher for wplace.live
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically captures and saves every JSON response from https://backend.wplace.live/me, with a manual button to fetch a fresh response. Intended specifically for the use of the WE LOVE MYUKKE. alliance.
// @author       altheathesia (edited by Gemini)
// @match        https://*.wplace.live/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545863/Automatic%20Me%20Response%20Catcher%20for%20wplacelive.user.js
// @updateURL https://update.greasyfork.org/scripts/545863/Automatic%20Me%20Response%20Catcher%20for%20wplacelive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL = 'https://backend.wplace.live/me';
    let lastMeResponseData = null; // Variable to store the last captured response for reference/debugging

    // --- Utility Functions ---

    /**
     * Generates a unique, filesystem-safe filename using a timestamp.
     * Example: 2024-10-27T15-30-05-123_me_response.json
     * @returns {string} A unique filename.
     */
    function generateUniqueFilename() {
        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/:/g, '-') // Replace colons which are invalid in some filesystems
            .replace(/\./, '-'); // Replace the dot before milliseconds
        return `wplaceautocapt_${timestamp}_me_response.json`;
    }

    /**
     * Triggers a browser download for the given JSON data.
     * @param {object} jsonData - The JavaScript object to be saved.
     * @param {string} filename - The name of the file to save.
     */
    function saveJsonToFile(jsonData, filename) {
        try {
            const prettyJson = JSON.stringify(jsonData, null, 2);
            const blob = new Blob([prettyJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // Append to body for Firefox compatibility
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url); // Clean up the object URL
            console.log(`Successfully saved response to ${filename}`);
        } catch (error) {
            console.error('Failed to save JSON file:', error);
        }
    }

    // --- Interception Logic ---

    /**
     * Processes a response object to check if it matches the target and saves it.
     * @param {string} url - The URL of the request.
     * @param {function} getJson - A function that returns a promise resolving to the JSON data.
     */
    async function processResponse(url, getJson) {
        if (url.includes(TARGET_URL)) {
            try {
                const data = await getJson();
                // Store the latest data for reference, but button won't use it
                lastMeResponseData = data;
                console.log('Automatically captured a /me response.');

                // --- Keep the original auto-download functionality ---
                const filename = generateUniqueFilename();
                saveJsonToFile(data, filename);
            } catch (error) {
                console.error(`Error processing response from ${url}:`, error);
            }
        }
    }

    // 1. Intercept `fetch`
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url] = args;
        return originalFetch.apply(this, args).then(response => {
            if (response.url.includes(TARGET_URL)) {
                const clonedResponse = response.clone();
                processResponse(clonedResponse.url, () => clonedResponse.json());
            }
            return response;
        });
    };

    // 2. Intercept `XMLHttpRequest`
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        const [method, url] = args;
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4 && this.responseURL.includes(TARGET_URL)) {
                processResponse(this.responseURL, () => {
                    try {
                        // Response can be text or a different type, ensure it's parsed as JSON
                        return JSON.parse(this.responseText);
                    } catch (e) {
                        return this.response; // Fallback if it's already an object
                    }
                });
            }
        }, false);
        originalOpen.apply(this, args);
    };

    // --- Manual Download Button ---

    /**
     * Creates and adds a manual download button to the page.
     */
    function createDownloadButton() {
        const button = document.createElement('button');
        // MODIFIED: Changed button text to be more descriptive
        button.textContent = 'Fetch & Download /me';
        // Style the button
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px', // Position from the top
            left: '50%', // Move the left edge to the center
            transform: 'translateX(-50%)', // Shift left by half its width to center it
            zIndex: '9999',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        });

        // MODIFIED: The entire click listener has been replaced.
        // It now actively fetches new data from the API.
        button.addEventListener('click', () => {
            button.textContent = 'Fetching...';
            button.disabled = true;

            // Perform a new fetch request to the /me endpoint
            fetch(TARGET_URL, { credentials: 'include' }) // 'include' sends cookies for authentication
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Use the existing functions to save the new data
                    const filename = generateUniqueFilename();
                    saveJsonToFile(data, filename);
                    alert('Successfully fetched and downloaded a new /me response.');
                })
                .catch(error => {
                    console.error('Manual fetch failed:', error);
                    alert(`Failed to fetch a new /me response. Error: ${error.message}`);
                })
                .finally(() => {
                    // Reset the button's state regardless of success or failure
                    button.textContent = 'Fetch & Download /me';
                    button.disabled = false;
                });
        });

        document.body.appendChild(button);
        console.log('Manual download button added.');
    }

    // Wait for the page to fully load before adding the button
    window.addEventListener('load', createDownloadButton);

    console.log('API Catcher script initialized. Monitoring for responses from:', TARGET_URL);
})();