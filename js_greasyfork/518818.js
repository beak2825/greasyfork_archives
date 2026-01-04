// ==UserScript==
// @name         Preserve Pixelated Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force pixelated rendering for all images
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518818/Preserve%20Pixelated%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/518818/Preserve%20Pixelated%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style to apply to images
    const pixelatedStyle = `
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
    `;

    // Function to apply pixelated rendering to images
    function applyPixelatedRendering() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.cssText += pixelatedStyle;
        });
    }

    // Apply immediately on page load
    applyPixelatedRendering();

    // Also apply to dynamically added images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.querySelectorAll('img');
                        images.forEach(img => {
                            img.style.cssText += pixelatedStyle;
                        });
                    }
                });
            }
        });
    });

    // Start observing the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();