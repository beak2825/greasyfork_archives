// ==UserScript==
// @name         Display Image Alt Text on Rank V6
// @namespace    http://tampermonkey.net/
// @version      2023-12-16
// @description  Display the alt text of images on the Rank V6 page of Midjourney
// @author       GuiTx - ChatGPT
// @match        https://www.midjourney.com/rank-v6
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midjourney.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482426/Display%20Image%20Alt%20Text%20on%20Rank%20V6.user.js
// @updateURL https://update.greasyfork.org/scripts/482426/Display%20Image%20Alt%20Text%20on%20Rank%20V6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add alt text div to an image
    function addAltTextToImage(image) {
        if (image.parentNode.classList.contains('alt-text-added')) {
            return; // Skip if alt text already added
        }

        // Create a new div element to hold the alt text
        var altTextDiv = document.createElement('div');
        altTextDiv.textContent = image.alt;
        altTextDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            color: white;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            max-width: 100%;
            word-wrap: break-word;
        `;

        // Position the div over the image
        var containerDiv = document.createElement('div');
        containerDiv.style.cssText = 'position: relative; display: inline-block;';
        image.parentNode.insertBefore(containerDiv, image);
        containerDiv.appendChild(image);
        containerDiv.appendChild(altTextDiv);
        containerDiv.classList.add('alt-text-added');
    }

    // Observer to handle dynamically loaded images
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'IMG' && node.alt) {
                    addAltTextToImage(node);
                }
            });
        });
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run for images already on the page
    document.querySelectorAll('img[alt]').forEach(addAltTextToImage);
})();
