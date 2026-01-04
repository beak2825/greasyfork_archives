// ==UserScript==
// @name         Giphy Force GIF Display
// @namespace    lander_scripts
// @version      0.3
// @description  Forces Giphy to display GIF instead of WebP by modifying picture/source tags.
// @icon         https://giphy.com/static/img/favicon.png
// @author       Lander
// @match        https://giphy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539164/Giphy%20Force%20GIF%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/539164/Giphy%20Force%20GIF%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process a single picture element
    function processPictureElement(pictureElement) {
        // Find the img tag within the current picture element
        const imgElement = pictureElement.querySelector('img.giphy-gif-img');

        // Find the source tag with type="image/webp"
        const webpSource = pictureElement.querySelector('source[type="image/webp"]');

        if (imgElement && webpSource) {
            // Get the GIF URL from the img src (which is usually the fallback GIF)
            const gifUrl = imgElement.src;

            // Remove the WebP source tag to prevent the browser from selecting it
            webpSource.remove();

            // Ensure the img src is the GIF URL (it should already be, but good to be explicit)
            imgElement.src = gifUrl;
        }
    }

    // Use a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node is a picture element or contains picture elements
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'PICTURE') {
                            processPictureElement(node);
                        } else {
                            // Search for picture elements within the added node
                            node.querySelectorAll('picture').forEach(processPictureElement);
                        }
                    }
                });
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Also process any picture elements already present on initial page load
    document.querySelectorAll('picture').forEach(processPictureElement);
})();