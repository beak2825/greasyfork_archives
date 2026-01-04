// ==UserScript==
// @name         r-34.xyz
// @namespace    lander_scripts
// @version      2025-05-21
// @description  resizes previews to full imgs
// @author       You
// @match        https://r-34.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=r-34.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536651/r-34xyz.user.js
// @updateURL https://update.greasyfork.org/scripts/536651/r-34xyz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateImageSources() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.endsWith('.small.jpg')) {
                img.src = img.src.replace(/\.small\.jpg$/, '.jpg');
            }
        });
    }

    // Run on page load
    updateImageSources();

    // Watch for dynamically loaded images
    const observer = new MutationObserver(() => {
        updateImageSources();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();