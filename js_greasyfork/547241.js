// ==UserScript==
// @name         Pixeldrain Bypass Downloader Helper
// @namespace    https://pixeldrainbypass.org/
// @version      1.2
// @description  Adds a "Bypass Download" button to Pixeldrain file pages. Uses pixeldrainbypass.org to get a direct, unlimited download link and bypass daily limits.
// @author       Pixeldrain Bypass Team
// @match        https://pixeldrain.com/u/*
// @icon         https://dl01.aifasthub.com/img/pixeldrainbypass.png
// @connect      pixeldrainbypass.org
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547241/Pixeldrain%20Bypass%20Downloader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/547241/Pixeldrain%20Bypass%20Downloader%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // The API endpoint of your live service
    const API_ENDPOINT = 'https://pixeldrainbypass.org/api/generate/';

    // --- Styles ---
    const buttonStyles = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 12px 20px;
        background-color: #2563eb;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        text-align: center;
    `;

    // --- Main Logic ---
    window.addEventListener('load', function() {
        // Extract file ID from the current URL
        const fileId = getFileIdFromUrl();
        if (!fileId) {
            console.log('Pixeldrain Bypass Helper: No file ID found on this page.');
            return;
        }

        // Create and add the bypass button to the page
        const bypassButton = createBypassButton(fileId);
        document.body.appendChild(bypassButton);
    });

    /**
     * Gets the Pixeldrain file ID from the current browser URL.
     * @returns {string|null} The file ID or null.
     */
    function getFileIdFromUrl() {
        const match = window.location.pathname.match(/\/u\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    }

    /**
     * Creates the "Bypass Download" button.
     * @param {string} fileId - The file's ID.
     * @returns {HTMLButtonElement} The created button element.
     */
    function createBypassButton(fileId) {
        const button = document.createElement('button');
        button.textContent = '🚀 Bypass Download Limit';
        button.setAttribute('style', buttonStyles);

        button.onmouseover = () => { if (!button.disabled) { button.style.backgroundColor = '#1d4ed8'; button.style.transform = 'translateY(-2px)'; } };
        button.onmouseout = () => { if (!button.disabled) { button.style.backgroundColor = '#2563eb'; button.style.transform = 'translateY(0)'; } };

        button.addEventListener('click', () => handleButtonClick(button, fileId));

        return button;
    }

    /**
     * Handles the button click event.
     * @param {HTMLButtonElement} button - The button that was clicked.
     * @param {string} fileId - The file's ID.
     */
    function handleButtonClick(button, fileId) {
        // Set loading state
        button.textContent = 'Generating...';
        button.disabled = true;

        // Make a cross-origin API request using GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: "GET",
            url: `${API_ENDPOINT}${fileId}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data.success && data.downloadUrls && data.downloadUrls.length > 0) {
                        // On success, turn the button into a clickable download link
                        button.textContent = `✅ Download: ${data.fileName}`;
                        // For reliability, we trigger the download directly in a new tab
                        window.open(data.downloadUrls[0], '_blank');
                    } else {
                        // Handle API-returned errors
                        handleError(button, data.error || 'Failed to get link.');
                    }
                } catch (e) {
                    handleError(button, 'Invalid response from server.');
                }
            },
            onerror: function(response) {
                // Handle network request errors
                handleError(button, 'Network error. Could not connect to the bypass server.');
            },
            ontimeout: function(response) {
                handleError(button, 'Request timed out. Please try again.');
            }
        });
    }

    /**
     * Handles error states.
     * @param {HTMLButtonElement} button - The button element.
     * @param {string} errorMessage - The error message to display.
     */
    function handleError(button, errorMessage) {
        button.textContent = `❌ Error: ${errorMessage}`;
        button.style.backgroundColor = '#dc2626'; // Red color
        // Reset the button after 5 seconds
        setTimeout(() => {
            button.textContent = '🚀 Bypass Download Limit';
            button.style.backgroundColor = '#2563eb';
            button.disabled = false;
        }, 5000);
    }

})();