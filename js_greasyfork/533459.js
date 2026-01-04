// ==UserScript==
// @name         Medium to Freedium Redirect Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button ONLY to Medium article pages to redirect to Freedium.cfd
// @author       Your Name / AI Assistant
// @match        https://medium.com/*
// @match        https://*.medium.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533459/Medium%20to%20Freedium%20Redirect%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533459/Medium%20to%20Freedium%20Redirect%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const freediumBaseUrl = 'https://freedium.cfd/';
    const buttonText = 'View on Freedium';
    const buttonId = 'freedium-redirect-button'; // Unique ID for the button
    // --- End Configuration ---

    /**
     * Checks if the current page appears to be a Medium article.
     * Primarily relies on the presence of <meta property="og:type" content="article">.
     * @returns {boolean} True if it seems to be an article page, false otherwise.
     */
    function isArticlePage() {
        // Method 1: Check for the Open Graph meta tag (most reliable)
        const ogTypeMeta = document.querySelector('meta[property="og:type"]');
        if (ogTypeMeta && ogTypeMeta.content && ogTypeMeta.content.toLowerCase() === 'article') {
            console.log("Medium Redirect: Detected article via og:type meta tag.");
            return true;
        }

        // Method 2: Fallback URL pattern check (less reliable, but can catch edge cases)
        // Articles usually have a path like /@user/slug-id or /publication/slug-id
        // Look for a path with at least two segments and often ending in a hyphenated ID.
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(Boolean); // Get non-empty path parts

        if (pathSegments.length >= 2 && /-[-_a-zA-Z0-9]+$/.test(pathSegments[pathSegments.length - 1])) {
             console.log("Medium Redirect: Detected article via URL pattern fallback.");
             return true;
        }

        // If neither check passes, assume it's not an article page
        // console.log("Medium Redirect: Not detected as an article page:", path);
        return false;
    }

    /**
     * Removes the Freedium button if it exists.
     */
    function removeFreediumButton() {
        const existingButton = document.getElementById(buttonId);
        if (existingButton) {
            existingButton.remove();
            // console.log("Medium Redirect: Removed button.");
        }
    }

    /**
     * Creates and adds the Freedium redirect button to the page.
     */
    function addFreediumButton() {
        // Don't add if it already exists
        if (document.getElementById(buttonId)) {
            return;
        }

        const currentUrl = window.location.href;
        const targetUrl = freediumBaseUrl + currentUrl;

        const button = document.createElement('button');
        button.id = buttonId;
        button.textContent = buttonText;

        // Style the button (same as before)
        button.style.position = 'fixed';
        button.style.bottom = '15px';
        button.style.right = '15px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 15px';
        button.style.backgroundColor = '#1a8917';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '20px';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.style.transition = 'background-color 0.2s ease';
        button.onmouseover = () => { button.style.backgroundColor = '#136310'; };
        button.onmouseout = () => { button.style.backgroundColor = '#1a8917'; };

        button.addEventListener('click', function(event) {
            event.preventDefault();
            console.log(`Medium Redirect: Redirecting to: ${targetUrl}`);
            window.location.href = targetUrl;
        });

        document.body.appendChild(button);
        // console.log("Medium Redirect: Added button.");
    }

    /**
     * Main logic: Check if it's an article page and add/remove button accordingly.
     */
    function checkAndPlaceButton() {
        if (isArticlePage()) {
            addFreediumButton();
        } else {
            removeFreediumButton(); // Ensure button is removed if not an article page
        }
    }

    // --- Execution ---

    // Initial check when the script runs
     if (document.readyState === 'interactive' || document.readyState === 'complete') {
        checkAndPlaceButton();
    } else {
        window.addEventListener('DOMContentLoaded', checkAndPlaceButton);
    }

    // --- Handle Dynamic Page Navigation (Single Page App behavior) ---
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            // URL changed, likely due to SPA navigation
            lastUrl = currentUrl;
            // console.log("Medium Redirect: URL changed, re-evaluating...");
            // Wait a brief moment for the page content (like meta tags) to potentially update
            setTimeout(checkAndPlaceButton, 300);
        }
    });

    // Observe the body for changes that might indicate navigation
    // Also observe <head> specifically for meta tag changes if needed,
    // but observing body often catches navigation triggers.
    // Observing document directly might be better for catching head changes too.
    observer.observe(document.documentElement, { // Observe the root element
      childList: true,
      subtree: true
    });

})();
