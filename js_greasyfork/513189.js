// ==UserScript==
// @name         BSKY Replace Thumbnail with Full Res Image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace downsized thumbnails with full resolution images
// @author       minnie
// @match        *://*.bsky.app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513189/BSKY%20Replace%20Thumbnail%20with%20Full%20Res%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/513189/BSKY%20Replace%20Thumbnail%20with%20Full%20Res%20Image.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //replace thumbnails with full-res images
    function replaceThumbnails() {
        // Select all thumbnail images
        let thumbnails = document.querySelectorAll('img[src*="feed_thumbnail"]');

        // Loop through the thumbnail images
        thumbnails.forEach(function(thumb) {
            // Replace 'feed_thumbnail' with 'feed_fullsize' in the src URL
            let fullResUrl = thumb.src.replace('feed_thumbnail', 'feed_fullsize');

            // Set the new full resolution URL to the src attribute
            thumb.src = fullResUrl;

        });
    }

    replaceThumbnails();

    // Create a MutationObserver to watch for dynamically added thumbnails
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Check each added node
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.querySelectorAll) {
                        let newThumbnails = node.querySelectorAll('img[src*="feed_thumbnail"]');
                        if (newThumbnails.length > 0) {
                            // Replace thumbnails for newly added nodes
                            replaceThumbnails();
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();