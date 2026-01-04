// ==UserScript==
// @name         Twitter/X High Quality Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically load the highest quality images on Twitter/X
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520859/TwitterX%20High%20Quality%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/520859/TwitterX%20High%20Quality%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace image URL with highest quality version
    function replaceWithHighQuality(url) {
        return url.replace(/&name=\w+/, '&name=orig');
    }

    // Function to process all images on the page
    function processImages() {
        const images = document.querySelectorAll('img[src*="pbs.twimg.com/media"]');
        images.forEach(img => {
            if (!img.src.includes('&name=orig')) {
                img.src = replaceWithHighQuality(img.src);
            }
        });
    }

    // Create a MutationObserver to watch for new images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                processImages();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial processing of images
    processImages();
})();