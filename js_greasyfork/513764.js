// ==UserScript==
// @name         HF Group Image "OG"
// @version      1.2
// @description  Reduces group images
// @author       gloom
// @match        https://hackforums.net/*
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/513764/HF%20Group%20Image%20%22OG%22.user.js
// @updateURL https://update.greasyfork.org/scripts/513764/HF%20Group%20Image%20%22OG%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to resize group images
    function resizeGroupImages() {
        // Find all images that have a src containing 'images/groupimages'
        const groupImages = document.querySelectorAll('img[src*="images/groupimages"]');

        groupImages.forEach(img => {
            // Get current dimensions from width/height attributes
            let currentWidth = parseInt(img.getAttribute('width'));
            let currentHeight = parseInt(img.getAttribute('height'));

            // Sets the new dimensions
            if (!isNaN(currentWidth) && !isNaN(currentHeight)) {
                const newWidth = currentWidth - 40;
                const newHeight = currentHeight - 15;

                img.setAttribute('width', newWidth);
                img.setAttribute('height', newHeight);
                // Also set style to ensure it takes effect
                img.style.width = newWidth + 'px';
                img.style.height = newHeight + 'px';
            }
        });
    }

    // Runs when page loads
    window.addEventListener('load', resizeGroupImages);

    // Run for dynamically loaded images
    const observer = new MutationObserver(resizeGroupImages);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
