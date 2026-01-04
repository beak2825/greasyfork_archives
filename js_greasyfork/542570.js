// ==UserScript==
// @name         OLX Full Resolution Images
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replace OLX images with full resolution versions and add a button to preview full resolution images
// @author       Kordian
// @match        https://www.olx.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542570/OLX%20Full%20Resolution%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/542570/OLX%20Full%20Resolution%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update image URLs
    function updateImageUrls() {
        // Select all image elements on the page
        const images = document.querySelectorAll('img[src*=";s="]');

        images.forEach(img => {
            // Store the original URL in a data attribute
            img.dataset.originalSrc = img.src;
            // Modify the image URL to replace the size parameter with 0x0 for full resolution
            img.src = img.src.replace(/;s=\d+x\d+/, ';s=0x0');
        });
    }

    // Create the preview button
    function createPreviewButton() {
        const button = document.createElement('div');
        button.textContent = 'Pokaż galerię ogłoszenia';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.left = '10px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        button.style.color = '#fff';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.fontSize = '14px';
        button.style.textAlign = 'center';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(button);


        const previewContainer = document.createElement('div');
        previewContainer.style.position = 'fixed';
        previewContainer.style.top = '50%';
        previewContainer.style.left = '50%';
        previewContainer.style.transform = 'translate(-50%, -50%)';
        previewContainer.style.maxHeight = '80vh';
        previewContainer.style.maxWidth = '80vw';
        previewContainer.style.overflow = 'auto';
        previewContainer.style.display = 'none';
        previewContainer.style.zIndex = '1001';
        previewContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        previewContainer.style.padding = '20px';
        previewContainer.style.borderRadius = '10px';
        document.body.appendChild(previewContainer);

        button.addEventListener('click', () => {
            const images = document.querySelectorAll('img[src*=";s=0x0"]');
            previewContainer.innerHTML = '';
            images.forEach(img => {
                const previewImage = document.createElement('img');
                previewImage.src = img.dataset.originalSrc.replace(/;s=\d+x\d+/, ';s=0x0');
                previewImage.style.maxHeight = '80vh';
                previewImage.style.maxWidth = '80vw';
                previewImage.style.margin = '10px';
                previewContainer.appendChild(previewImage);
            });
            previewContainer.style.display = 'block';
        });

        // Hide preview container when clicking outside of it
        document.addEventListener('click', (event) => {
            if (!previewContainer.contains(event.target) && event.target !== button) {
                previewContainer.style.display = 'none';
            }
        });
    }

    // Run the update function initially
    updateImageUrls();

    // Set up a mutation observer to catch dynamically loaded images
    const observer = new MutationObserver(updateImageUrls);
    observer.observe(document.body, { childList: true, subtree: true });

    // Create the preview button
    createPreviewButton();
})();
