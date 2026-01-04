// ==UserScript==
// @name         XXXClub Thumbnails Expander and Higher Resolution Loader
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Make thumbnails always visible, larger, and replace with high-res images
// @author       Anon1337Elite
// @match        *://xxxclub.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xxxclub.to
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498254/XXXClub%20Thumbnails%20Expander%20and%20Higher%20Resolution%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/498254/XXXClub%20Thumbnails%20Expander%20and%20Higher%20Resolution%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to make thumbnails always visible and larger
    const style = document.createElement('style');
    style.textContent = `
        .floaterimg, .thumbnail-image, .detailsimg img {
            display: inline !important;
            visibility: visible !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 1000px !important; /* Adjust the width as needed */
            height: auto !important; /* Maintain aspect ratio */
            margin: 10px !important; /* Add some margin if needed */
        }
    `;
    document.head.append(style);

    // Replace thumbnail URLs with higher resolution URLs
    function replaceThumbnails() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('/ps/')) {
                img.src = img.src.replace('/ps/', '/p/');
            }
        });
    }

    // Run the replacement function after the page has fully loaded
    window.addEventListener('load', () => {
        replaceThumbnails();
        setTimeout(replaceThumbnails, 500); // Additional initial check after 500ms
    });

    // Use MutationObserver to replace URLs in dynamically loaded content
    const observer = new MutationObserver(replaceThumbnails);
    observer.observe(document.body, { childList: true, subtree: true });

    // Periodic check to ensure all images are high-res, every 1 second
    setInterval(replaceThumbnails, 1000);
})();
