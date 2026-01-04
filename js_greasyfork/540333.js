// ==UserScript==
// @name         YouTube: 5 Videos Per Row
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license MIT
// @description  Changes the YouTube homepage to show you 5 videos per row and removing the weird left padding.
// @author       Lemustache
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540333/YouTube%3A%205%20Videos%20Per%20Row.user.js
// @updateURL https://update.greasyfork.org/scripts/540333/YouTube%3A%205%20Videos%20Per%20Row.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Desired number of videos per row
    const videosPerRow = 5;

    // Style ID
    const styleId = `youtube-${videosPerRow}-videos-per-row-updated`;

    // Debugging function
    function debugLog(message) {
        console.log(`[YouTube Layout Fix]: ${message}`);
    }

    // Error reporting
    function reportError(message, error) {
        console.error(`[YouTube Layout Fix - ERROR]: ${message}`);
        if (error) {
            console.error(error);
        }
    }

    // Apply the layout fix
    function applyLayoutFix(videosPerRow) {
        try {
            debugLog(`Applying layout fix for ${videosPerRow} videos per row...`);

            // Remove existing style
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
                debugLog('Removed existing style.');
            }

            const videoWidthPercentage = (100 / videosPerRow);
            const gap = 12;
            const adjustedWidth = `calc(${videoWidthPercentage}% - ${gap}px)`;

            const style = document.createElement('style');
            style.id = styleId;

            // More Specific and Robust CSS - Focus on Core Layout First
            style.textContent = `
                /* 1. Target the Rich Grid Renderer Directly */
                #contents.ytd-rich-grid-renderer {
                    display: flex !important; /* Essential for flexbox layout */
                    flex-wrap: wrap !important; /* Allow items to wrap to the next line */
                    gap: ${gap}px !important;   /* Space between videos */
                    width: 100% !important;   /* Ensure it takes full width */
                    margin: 0 !important;     /* Reset any default margins */
                    padding: 0 !important;    /* Reset any default padding */
                }

                /* 2. Target the Individual Video Items */
                ytd-rich-item-renderer {
                    flex: 0 0 ${adjustedWidth} !important; /* Flex basis: important for width */
                    max-width: ${adjustedWidth} !important; /* Maximum width */
                    margin-bottom: ${gap}px !important;  /* Consistent bottom margin */
                    padding: 0 !important;              /* Reset padding */
                    box-sizing: border-box !important;  /* Include padding/border in width */
                }

                 /*3. Address the is-in-first-column issue*/
                 ytd-rich-item-renderer[is-in-first-column] {
                        margin-left: 0 !important; /* Reset margin for first column items */
                 }

                 /*4. Thumbnail Styling: Ensure the thumbnail fills its container*/
                 ytd-rich-item-renderer #thumbnail {
                        width: 100% !important;
                        height: auto !important; /* Maintain aspect ratio */
                        display: block !important; /* Remove any inline spacing */
                 }

                 ytd-rich-item-renderer #thumbnail img {
                        width: 100% !important;
                        height: auto !important;
                        object-fit: cover !important; /* Prevent distortion */
                 }


                /* 5.  Important! Reset default styles that YouTube might be applying */
                ytd-rich-item-renderer {
                    margin: 0 !important;
                    padding: 0 !important;
                    border: 0 !important;
                    outline: 0 !important;
                }


                 /* 6. VERY SPECIFIC OVERRIDE */
                 #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer[is-in-first-column] {
                    margin-left: 0 !important;
                 }
            `;

            document.head.appendChild(style);
            debugLog(`Applied style for ${videosPerRow} videos per row.`);

        } catch (error) {
            reportError("Error applying layout fix:", error);
        }
    }

    // Initialize the script
    function initialize() {
        try {
            applyLayoutFix(videosPerRow);
            debugLog('Initial layout fix applied.');

            // Apply layout fix on navigation
            window.addEventListener('yt-navigate-finish', () => {
                try {
                    applyLayoutFix(videosPerRow);
                    debugLog('Layout fix applied on navigation.');
                } catch (error) {
                    reportError("Error applying layout fix on navigation:", error);
                }
            });

            // Apply layout fix on window resize (handle responsive changes)
            window.addEventListener('resize', () => {
                try {
                    applyLayoutFix(videosPerRow);
                    debugLog('Layout fix applied on window resize.');
                } catch (error) {
                    reportError("Error applying layout fix on window resize:", error);
                }
            });
        } catch (error) {
            reportError("Error during initialization:", error);
        }
    }

    // Set up MutationObserver
    const observer = new MutationObserver(() => {
        try {
            applyLayoutFix(videosPerRow);
            debugLog('Layout fix applied due to mutation.');
        } catch (error) {
            reportError("Error applying layout fix during mutation:", error);
        }
    });

    // Start observing
    try {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        debugLog('MutationObserver started.');
    } catch (error) {
        reportError("Error setting up MutationObserver:", error);
    }

    // Initialize on load
    window.addEventListener('load', () => {
        try {
            initialize();
            debugLog('Page loaded, initialization complete.');
        } catch (error) {
            reportError("Error during window load:", error);
        }
    });

    // Attempt immediate initialization
    if (document.readyState === "complete" || document.readyState === "interactive") {
        try {
            initialize();
            debugLog('Page already loaded, immediate initialization.');
        } catch (error) {
            reportError("Error during immediate initialization:", error);
        }
    }
})();