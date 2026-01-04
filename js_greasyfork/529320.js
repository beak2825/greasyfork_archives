// ==UserScript==
// @name         Image Resolution Display (Firefox Debug)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Display the actual resolution of images on top of images, excluding images smaller than a specified size. Works on regular pages and direct image links in Firefox.
// @author       LF2005
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529320/Image%20Resolution%20Display%20%28Firefox%20Debug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529320/Image%20Resolution%20Display%20%28Firefox%20Debug%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the minimum width and height for images to be processed
    const MIN_WIDTH = 300;  // Minimum width in pixels
    const MIN_HEIGHT = 300; // Minimum height in pixels

    // Function to add resolution text to an image
    function addResolutionToImage(img) {
        console.log('Processing image:', img.src);

        // Check if the image is already processed
        if (img.dataset.resolutionAdded) return;
        img.dataset.resolutionAdded = true;

        // Use naturalWidth and naturalHeight for actual resolution
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        console.log('Image dimensions:', naturalWidth, 'x', naturalHeight);

        if (naturalWidth >= MIN_WIDTH && naturalHeight >= MIN_HEIGHT) {
            const resolutionText = `${naturalWidth}x${naturalHeight}`;

            // Create a div to display the resolution
            const resolutionDiv = document.createElement('div');
            resolutionDiv.textContent = resolutionText;
            resolutionDiv.style.position = 'absolute';
            resolutionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            resolutionDiv.style.color = 'white';
            resolutionDiv.style.padding = '2px 5px';
            resolutionDiv.style.fontSize = '12px';
            resolutionDiv.style.borderRadius = '3px';
            resolutionDiv.style.zIndex = '1000';

            // Position the div on top of the image
            const imgRect = img.getBoundingClientRect();
            resolutionDiv.style.top = `${imgRect.top + window.scrollY}px`;
            resolutionDiv.style.left = `${imgRect.left + window.scrollX}px`;

            console.log('Adding resolution text at:', resolutionDiv.style.top, resolutionDiv.style.left);

            // Append the div to the body
            document.body.appendChild(resolutionDiv);
        } else {
            console.log('Image is too small:', naturalWidth, 'x', naturalHeight);
        }
    }

    // Function to check if the page is a direct image link
    function isDirectImagePage() {
        const img = document.querySelector('img');
        return img && img === document.body.firstElementChild;
    }

    // Process all images on the page
    function processImages() {
        console.log('Processing images...');

        if (isDirectImagePage()) {
            console.log('Direct image link detected.');
            const img = document.querySelector('img');
            if (img.complete) {
                console.log('Image is already loaded.');
                addResolutionToImage(img);
            } else {
                console.log('Waiting for image to load...');
                img.addEventListener('load', () => {
                    console.log('Image loaded.');
                    addResolutionToImage(img);
                });
            }
        } else {
            console.log('Regular page detected.');
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete) {
                    console.log('Image is already loaded:', img.src);
                    addResolutionToImage(img);
                } else {
                    console.log('Waiting for image to load:', img.src);
                    img.addEventListener('load', () => {
                        console.log('Image loaded:', img.src);
                        addResolutionToImage(img);
                    });
                }
            });
        }
    }

    // Run the script after the page has loaded
    if (document.readyState === 'complete') {
        console.log('Page is already loaded.');
        processImages();
    } else {
        console.log('Waiting for page to load...');
        window.addEventListener('load', processImages);
    }

    // Optionally, handle dynamically loaded images (e.g., in infinite scroll pages)
    const observer = new MutationObserver((mutations) => {
        console.log('DOM mutation detected.');
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IMG') {
                    console.log('New image detected:', node.src);
                    if (node.complete) {
                        console.log('Image is already loaded.');
                        addResolutionToImage(node);
                    } else {
                        console.log('Waiting for image to load...');
                        node.addEventListener('load', () => {
                            console.log('Image loaded.');
                            addResolutionToImage(node);
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();