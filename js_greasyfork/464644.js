// ==UserScript==
// @name         YouTube to Social Blade Linker
// @version      1.3
// @description  Adds a plain-text link to YouTube profile pages that links to the corresponding Social Blade page for that channel, with a hover effect to match the YouTube font and color design.
// @author       Webmaster
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://your-namespace-here/
// @downloadURL https://update.greasyfork.org/scripts/464644/YouTube%20to%20Social%20Blade%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/464644/YouTube%20to%20Social%20Blade%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the Social Blade link
    function addSocialBladeLink() {
        // Remove any existing link to avoid duplicates
        const existingLink = document.getElementById('social-blade-link');
        if (existingLink) {
            existingLink.remove();
        }

        // Get the username or channel ID from the YouTube profile page URL
        const match = window.location.href.match(/youtube\.com\/@(.+)/i) || window.location.href.match(/youtube\.com\/channel\/(.+)/i);
        if (!match) return; // Exit if no match found

        const identifier = match[1]; // This can be either username or channel ID

        // Create a link element and append it to the body of the page
        const link = document.createElement('a');
        link.id = 'social-blade-link'; // Set an id for easy reference
        link.innerText = 'Social Blade';
        link.href = `https://socialblade.com/youtube/channel/${identifier}`;
        link.target = '_blank'; // Open link in a new tab
        link.style.position = 'fixed';
        link.style.top = '10px';
        link.style.border = '1px solid #3F3F3F'; // Set border width, style, and color
        link.style.borderRadius = '25px';
        link.style.left = '195px';
        link.style.backgroundColor = 'transparent';
        link.style.color = '#3EA6FF';
        link.style.fontFamily = 'Roboto, Arial, sans-serif';
        link.style.fontSize = '16px';
        link.style.fontWeight = 'bold';
        link.style.textDecoration = 'none';
        link.style.zIndex = '9999';
        link.style.padding = '8px 16px';
        link.addEventListener('mouseover', () => {
            link.style.backgroundColor = '#263850';
            link.style.color = '#ffffff';
        });
        link.addEventListener('mouseout', () => {
            link.style.backgroundColor = 'transparent';
            link.style.color = '#3EA6FF';
        });
        document.body.appendChild(link);
    }

    // Retry function with exponential backoff
    function tryAddLinkWithRetry(retries = 5, delay = 1000) {
        setTimeout(() => {
            try {
                addSocialBladeLink();
            } catch (err) {
                if (retries > 0) {
                    tryAddLinkWithRetry(retries - 1, delay * 2); // Exponential backoff
                }
            }
        }, delay);
    }

    // Initial call to add the link with a retry mechanism
    tryAddLinkWithRetry();

    // Observe DOM changes (YouTube is a SPA)
    const observer = new MutationObserver(() => {
        tryAddLinkWithRetry();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle SPA navigation events (pushState and popstate)
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        originalPushState.apply(history, arguments);
        tryAddLinkWithRetry(); // Trigger the function after navigation
    };

    window.addEventListener('popstate', () => {
        tryAddLinkWithRetry(); // Trigger the function when navigating back
    });

    // Listen for ALT+1 keyboard shortcut
    document.addEventListener('keydown', function(event) {
        // Check if ALT + 1 keys are pressed
        if (event.altKey && event.key === '1') {
            event.preventDefault(); // Prevent default browser behavior (optional)
            const socialBladeLink = document.getElementById('social-blade-link');
            if (socialBladeLink) {
                socialBladeLink.click(); // Click the link when ALT+1 is pressed
            }
        }
    });

})();
