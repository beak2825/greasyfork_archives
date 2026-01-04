// ==UserScript==
// @name         Open Reddit YouTube Player in New Tab
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Opens embedded YouTube videos from Reddit in a new tab
// @author       Henry Suen
// @match        https://*.reddit.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/514587/Open%20Reddit%20YouTube%20Player%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/514587/Open%20Reddit%20YouTube%20Player%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug mode - press 'd' to toggle
    let debugMode = false;

    function debugLog(step, message, data = '') {
        if (debugMode) {
            console.log(`[Debug] Step ${step}: ${message}`, data);
        }
    }

    function extractVideoId(url) {
        const embedMatch = url.match(/\/embed\/([^/?]+)/);
        if (embedMatch) return embedMatch[1];

        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) return watchMatch[1];

        return null;
    }

    function handleClick(event) {
        if (debugMode) {
            console.log('Clicked element:', event.target);
            console.log('Clicked element classes:', event.target.className);
        }

        // Check if we clicked on a shreddit-embed element
        const embedElement = event.target.closest('shreddit-embed');
        debugLog(1, 'Looking for shreddit-embed element', embedElement);

        if (embedElement) {
            // Get the HTML attribute directly from the shreddit-embed element
            const htmlAttr = embedElement.getAttribute('html');
            debugLog(2, 'Found HTML attribute', htmlAttr);

            if (htmlAttr && htmlAttr.includes('youtube.com/embed/')) {
                event.preventDefault();
                event.stopPropagation();

                // Extract the src URL from the HTML attribute
                const srcMatch = htmlAttr.match(/src="([^"]+)"/);
                debugLog(3, 'Extracted src from HTML', srcMatch ? srcMatch[1] : null);

                if (srcMatch) {
                    const videoId = extractVideoId(srcMatch[1]);
                    debugLog(4, 'Extracted video ID', videoId);

                    if (videoId) {
                        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                        debugLog(5, 'Opening YouTube URL', youtubeUrl);
                        window.open(youtubeUrl, '_blank');
                    }
                }
            }
        }
    }

    // Add click event listener to the document
    document.addEventListener('click', handleClick, true);

    // Add debug mode toggle
    document.addEventListener('keypress', (e) => {
        if (e.key === 'd') {
            debugMode = !debugMode;
            console.log(`Debug mode ${debugMode ? 'enabled' : 'disabled'}`);
        }
    });

    // Initial debug status message
    console.log('Reddit YouTube Redirect script loaded. Press "d" to toggle debug mode');
})();
