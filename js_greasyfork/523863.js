// ==UserScript==
// @name         X - Auto unmute videos
// @version      1.0
// @description  Automatically unmutes autoplayed videos on X
// @author       zfi2
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1423663
// @downloadURL https://update.greasyfork.org/scripts/523863/X%20-%20Auto%20unmute%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/523863/X%20-%20Auto%20unmute%20videos.meta.js
// ==/UserScript==

/*
    Author: zfi2
    GitHub: https://github.com/zfi2
*/
(function() {
    'use strict';

    function unmuteVideos() {
        // Find all video elements
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Remove the 'muted' attribute for each found video
            if (video.hasAttribute('muted')) {
                video.removeAttribute('muted');
            }
            // Set the 'muted' property to false
            if (video.muted) {
                video.muted = false;
            }
        });
    }

    // Create a mutation observer to watch for new videos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                unmuteVideos();
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial unmute for videos that are already on the page
    unmuteVideos();
})();