// ==UserScript==
// @name         YouTube - 4 Videos Per Row
// @version      1.0
// @license      CC0-1.0
// @description  Changes the YouTube homepage to show you 4 videos per row and fix thumbnail padding.
// @author       Mane
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/541611/YouTube%20-%204%20Videos%20Per%20Row.user.js
// @updateURL https://update.greasyfork.org/scripts/541611/YouTube%20-%204%20Videos%20Per%20Row.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Desired number of videos per row
    const videosPerRow = 4;

    // Style ID
    const styleId = `youtube-${videosPerRow}-videos-per-row-updated`;

    // Debug logging
    function debugLog(message) {
        console.log(`[YouTube Layout Fix]: ${message}`);
    }

    // Error reporting
    function reportError(message, error) {
        console.error(`[YouTube Layout Fix - ERROR]: ${message}`);
        if (error) console.error(error);
    }

    // Apply the layout fix
    function applyLayoutFix(count) {
        try {
            debugLog(`Applying layout fix for ${count} videos per row...`);
            
            // Remove old style if present
            const old = document.getElementById(styleId);
            if (old) { old.remove(); debugLog('Removed existing style.'); }

            // Calculate widths
            const videoWidthPercentage = 100 / count;
            const gap = 12;
            const adjustedWidth = `calc(${videoWidthPercentage}% - ${gap}px)`;

            // Build new style
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                #contents.ytd-rich-grid-renderer {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: ${gap}px !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                ytd-rich-item-renderer {
                    flex: 0 0 ${adjustedWidth} !important;
                    max-width: ${adjustedWidth} !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                ytd-rich-item-renderer[is-in-first-column] {
                    margin-left: 0 !important;
                }
                ytd-rich-item-renderer #thumbnail,
                ytd-rich-item-renderer #thumbnail img {
                    width: 100% !important;
                    height: auto !important;
                    display: block !important;
                    object-fit: cover !important;
                }
                #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer[is-in-first-column] {
                    margin-left: 0 !important;
                }
            `;
            document.head.appendChild(style);
            debugLog(`Applied style for ${count} videos per row.`);
        } catch (err) {
            reportError('Error applying layout fix:', err);
        }
    }

    // Initialize script
    function initialize() {
        applyLayoutFix(videosPerRow);
        debugLog('Initial layout fix applied.');

        // Re-apply on navigation or resize
        window.addEventListener('yt-navigate-finish', () => applyLayoutFix(videosPerRow));
        window.addEventListener('resize', () => applyLayoutFix(videosPerRow));
    }

    // Observe for dynamic changes
    try {
        new MutationObserver(() => applyLayoutFix(videosPerRow))
            .observe(document.body, { childList: true, subtree: true });
        debugLog('MutationObserver started.');
    } catch (err) {
        reportError('Error setting up MutationObserver:', err);
    }

    // Kick things off on load/ready
    window.addEventListener('load', initialize);
    if (['interactive','complete'].includes(document.readyState)) {
        initialize();
    }
})();
