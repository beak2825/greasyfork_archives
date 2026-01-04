// ==UserScript==
// @name         Animated Smileys
// @version      1.0
// @description  Replace jeuxvideo.com smiley images with jvarchive.com equivalents
// @match        https://www.jeuxvideo.com/*
// @license MIT
// @namespace https://greasyfork.org/users/971281
// @downloadURL https://update.greasyfork.org/scripts/520176/Animated%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/520176/Animated%20Smileys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace smiley image sources
    function replaceSmileyImages() {
        // Select all img tags with src matching the jeuxvideo.com smiley pattern
        const smileyImages = document.querySelectorAll('img[src^="https://image.jeuxvideo.com/smileys_img/"]');

        smileyImages.forEach(img => {
            // Extract the original filename (A.gif)
            const originalSrc = img.src;
            const filename = originalSrc.split('/').pop();

            // Extract the alt text (B)
            const altText = img.alt;

            // Create the new source URL
            const newSrc = `https://jvarchive.com/static/smileys/${altText}.gif`;

            // Replace the source
            img.src = newSrc;
        });
    }

    // Run the replacement when the page loads
    window.addEventListener('load', replaceSmileyImages);

    // Optional: Also run the replacement for dynamically added images
    const observer = new MutationObserver(replaceSmileyImages);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();