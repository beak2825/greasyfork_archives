// ==UserScript==
// @name         Rule34 Image Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Opens images in a new background tab when middle-clicked on rule34.xxx
// @author       MathaNoshto
// @match        https://rule34.xxx/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/536876/Rule34%20Image%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/536876/Rule34%20Image%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle middle mouse click on images
    function handleImageMiddleClick(event) {
        // Check if it's a middle mouse button click (button 1)
        if (event.button !== 1) return;

        const image = event.target;

        // Check if the clicked element is an image
        if (image.tagName === 'IMG') {
            // Prevent default middle-click behavior
            event.preventDefault();

            // Get the highest resolution image URL
            let imageUrl = '';

            // If it's a thumbnail, try to get the full image URL
            if (image.parentElement && image.parentElement.tagName === 'A') {
                imageUrl = image.parentElement.href;
            } else {
                // If it's already a full image, use its source
                imageUrl = image.src;
            }

            // Open the image in a new background tab using GM_openInTab
            if (imageUrl) {
                GM_openInTab(imageUrl, {
                    active: false,      // This ensures the tab opens in the background
                    insert: true,       // This opens the tab next to the current one
                    setParent: true     // This sets the current tab as the parent
                });
            }
        }
    }

    // Add mousedown event listener to the document
    document.addEventListener('mousedown', handleImageMiddleClick);

    // Log that the script is loaded
    console.log('Rule34 Image Opener script loaded!');
})();