// ==UserScript==
// @name         Grok Delete File Uploads
// @namespace    nisc
// @version      2025.06.08-A
// @description  Add a button to delete all uploaded files on grok.com/files
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/files
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538665/Grok%20Delete%20File%20Uploads.user.js
// @updateURL https://update.greasyfork.org/scripts/538665/Grok%20Delete%20File%20Uploads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object containing all constants used in the script
     * - Button appearance and behavior settings
     * - DOM selectors for finding elements
     * - Timing delays for various operations
     */
    const CONFIG = {
        BUTTON_ID: 'delete-all-btn',
        BUTTON_TEXT: 'Delete all files',
        BUTTON_STYLES: {
            backgroundColor: 'white',
            color: 'black',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '30px'
        },
        CONTAINER_SELECTOR: '.max-w-\\[50rem\\]',
        DELETE_BUTTON_SELECTOR: 'button[aria-label="Delete"]',
        CONFIRM_BUTTON_SELECTOR: 'button[aria-label="Confirm"]',
        DELAYS: {
            DELETE_BUTTON: 200,    // Time to wait after clicking delete button
            CONFIRM_BUTTON: 200,   // Time to wait after clicking confirm button
            MODAL_RENDER: 500      // Time to wait for all modals to render
        }
    };

    /**
     * Utility function to create a promise that resolves after specified milliseconds
     * Used to add necessary delays between operations
     */
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    /**
     * Main deletion function that:
     * 1. Clicks all delete buttons sequentially
     * 2. Waits for confirmation modals to render
     * 3. Clicks all confirm buttons sequentially
     *
     * Delays are added between operations to ensure UI can keep up
     */
    async function deleteAll() {
        // First phase: Click all delete buttons
        const deleteButtons = Array.from(document.querySelectorAll(CONFIG.DELETE_BUTTON_SELECTOR));
        if (deleteButtons.length === 0) {
            return;
        }

        for (const btn of deleteButtons) {
            btn.click();
            await sleep(CONFIG.DELAYS.DELETE_BUTTON);
        }

        // Wait for all confirmation modals to render
        await sleep(CONFIG.DELAYS.MODAL_RENDER);

        // Second phase: Confirm all deletions
        const confirmButtons = Array.from(document.querySelectorAll(CONFIG.CONFIRM_BUTTON_SELECTOR));
        if (confirmButtons.length === 0) {
            return;
        }

        for (const conf of confirmButtons) {
            conf.click();
            await sleep(CONFIG.DELAYS.CONFIRM_BUTTON);
        }
    }

    /**
     * Creates and adds the "Delete all files" button to the page
     * Only adds the button if it doesn't already exist
     */
    function addButton() {
        const container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
        if (container && !document.getElementById(CONFIG.BUTTON_ID)) {
            const btn = document.createElement('button');
            btn.id = CONFIG.BUTTON_ID;
            btn.textContent = CONFIG.BUTTON_TEXT;
            Object.assign(btn.style, CONFIG.BUTTON_STYLES);
            btn.addEventListener('click', deleteAll);
            container.insertBefore(btn, container.firstChild);
        }
    }

    // Watch for DOM changes and try to add button when possible
    // This ensures the button is added even if the container loads dynamically
    new MutationObserver(addButton).observe(document.body, { childList: true, subtree: true });

    // Initial attempt to add the button
    addButton();
})();