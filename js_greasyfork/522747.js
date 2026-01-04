// ==UserScript==
// @name         GoComics Direct Image Redirect
// @namespace    https://github.com/YourUsername/gocomics-direct
// @version      1.1.0
// @description  Automatically redirects GoComics pages to direct comic image URLs for faster viewing
// @match        https://www.gocomics.com/*/20*
// @match        https://www.gocomics.com/*/19*
// @license      MIT
// @grant        none
// @run-at       document-start
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/522747/GoComics%20Direct%20Image%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/522747/GoComics%20Direct%20Image%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const IMAGE_HOST = 'assets.amuniversal.com';
    const VALID_URL_PATTERN = /^https:\/\/www\.gocomics\.com\/[^\/]+\/(?:19|20)\d{2}\/\d{1,2}\/\d{1,2}\/?$/;

    // Only run on comic pages (not homepage, about pages, etc)
    if (!VALID_URL_PATTERN.test(window.location.href)) {
        return;
    }

    // Main redirect function
    function redirectToImage() {
        try {
            const ogImage = document.querySelector('meta[property="og:image"]');

            if (!ogImage) {
                console.warn('GoComics Direct: Could not find og:image meta tag');
                return;
            }

            const imageUrl = ogImage.getAttribute('content');

            if (!imageUrl) {
                console.warn('GoComics Direct: og:image meta tag has no content');
                return;
            }

            // Verify it's a valid GoComics CDN URL
            if (!imageUrl.includes(IMAGE_HOST)) {
                console.warn('GoComics Direct: Image URL is not from expected CDN');
                return;
            }

            // Prevent redirect loops
            if (window.location.href === imageUrl) {
                return;
            }

            window.location.replace(imageUrl);

        } catch (error) {
            console.error('GoComics Direct: Error during redirect:', error);
        }
    }

    // Run as soon as DOM starts loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToImage);
    } else {
        redirectToImage();
    }

})();