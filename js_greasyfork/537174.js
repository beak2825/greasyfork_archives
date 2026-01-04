// ==UserScript==
// @name         X.com Auto-Following Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically switch to "Following" instead of "For you" on X.com
// @author       DiCK
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537174/Xcom%20Auto-Following%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/537174/Xcom%20Auto-Following%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and click the Following tab
    function switchToFollowing() {
        // Find all tab elements that contain "Following" or "For you"
        const tabs = document.querySelectorAll('a[role="tab"]');

        for (const tab of tabs) {
            const spanElement = tab.querySelector('span');
            if (spanElement && spanElement.textContent.trim() === 'Following') {
                // Check if Following tab is already active
                const isSelected = tab.getAttribute('aria-selected') === 'true';

                if (!isSelected) {
                    console.log('Switching to Following tab...');
                    tab.click();
                    return true;
                }
                return false; // Already on Following
            }
        }
        return false; // Didn't find Following tab
    }

    // Function to check if we're on the home page
    function isOnHomePage() {
        return window.location.pathname === '/' ||
               window.location.pathname === '/home' ||
               window.location.pathname.startsWith('/home');
    }

    // Main function that runs
    function runScript() {
        if (!isOnHomePage()) {
            return;
        }

        // Try switching immediately
        if (switchToFollowing()) {
            return;
        }

        // If that didn't work, wait and try again
        let attempts = 0;
        const maxAttempts = 20;

        const observer = new MutationObserver(function(mutations) {
            attempts++;

            if (attempts > maxAttempts) {
                observer.disconnect();
                return;
            }

            if (switchToFollowing()) {
                observer.disconnect();
            }
        });

        // Observe changes in DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Stop observer after 10 seconds
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }

    // Run script when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runScript);
    } else {
        // Wait a bit to let X.com finish loading
        setTimeout(runScript, 1000);
    }

    // Listen for URL changes (for SPA navigation)
    let currentUrl = window.location.href;

    const urlObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(runScript, 1500); // Wait a bit longer for navigation
        }
    });

    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Backup: Also run when user clicks on home link
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && (link.href.includes('/home') || link.href.endsWith('/'))) {
            setTimeout(runScript, 2000);
        }
    });

})();