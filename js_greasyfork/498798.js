// ==UserScript==
// @name         圖片懸停圖片放大預覽
// @name:en      Image Preview on Hover (Excluding YouTube and Bilibili)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Preview images on hover across websites, excluding YouTube and Bilibili
// @description:en  Preview images on hover across websites, excluding YouTube and Bilibili
// @author       Hitenlxy
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498798/%E5%9C%96%E7%89%87%E6%87%B8%E5%81%9C%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7%E9%A0%90%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498798/%E5%9C%96%E7%89%87%E6%87%B8%E5%81%9C%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7%E9%A0%90%E8%A6%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define max width and max height for the preview image
    const MAX_WIDTH = 600; // Maximum width of the preview image
    const MAX_HEIGHT = 400; // Maximum height of the preview image
    const OFFSET_X = 20; // Offset from mouse pointer on X-axis
    const OFFSET_Y = 20; // Offset from mouse pointer on Y-axis

    // Create a CSS style for the preview window
    GM_addStyle(`
        .image-preview {
            position: fixed;
            display: none;
            z-index: 9999;
            padding: 10px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            max-width: ${MAX_WIDTH}px;
        }
        .image-preview img {
            max-width: 100%;
            height: auto;
            max-height: ${MAX_HEIGHT}px;
        }
    `);

    // Function to check if URL is from YouTube or Bilibili
    function isExcludedSite(url) {
        return url.includes('youtube.com') || url.includes('bilibili.com');
    }

    // Function to show preview on hover, excluding YouTube and Bilibili
    function showPreview(event) {
        const target = event.target;
        if (target.tagName === 'IMG' && !isExcludedSite(window.location.href)) {
            const src = target.src;
            const preview = document.querySelector('.image-preview');
            const img = preview.querySelector('img');
            
            // Set image source
            img.src = src;

            // Calculate initial position relative to viewport
            let previewX = event.clientX + OFFSET_X;
            let previewY = event.clientY - preview.offsetHeight - OFFSET_Y;

            // Check if preview goes out of viewport horizontally
            if (previewX + preview.offsetWidth > window.innerWidth) {
                previewX = window.innerWidth - preview.offsetWidth;
            }

            // Check if preview goes out of viewport vertically
            if (previewY < 0) {
                previewY = event.clientY + OFFSET_Y;
            }

            // Set preview position
            preview.style.left = previewX + 'px';
            preview.style.top = previewY + 'px';
            preview.style.display = 'block';
        }
    }

    // Function to update preview position on mouse move
    function updatePreviewPosition(event) {
        const preview = document.querySelector('.image-preview');
        if (preview.style.display === 'block') {
            let previewX = event.clientX + OFFSET_X;
            let previewY = event.clientY - preview.offsetHeight - OFFSET_Y;

            // Check if preview goes out of viewport horizontally
            if (previewX + preview.offsetWidth > window.innerWidth) {
                previewX = window.innerWidth - preview.offsetWidth;
            }

            // Check if preview goes out of viewport vertically
            if (previewY < 0) {
                previewY = event.clientY + OFFSET_Y;
            }

            // Set preview position
            preview.style.left = previewX + 'px';
            preview.style.top = previewY + 'px';
        }
    }

    // Function to hide preview when mouse leaves the image
    function hidePreview() {
        const preview = document.querySelector('.image-preview');
        preview.style.display = 'none';
    }

    // Create preview element and append to body
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    const img = document.createElement('img');
    img.style.maxWidth = MAX_WIDTH + 'px'; // Set max-width for img element
    img.style.maxHeight = MAX_HEIGHT + 'px'; // Set max-height for img element
    preview.appendChild(img);
    document.body.appendChild(preview);

    // Attach event listeners to all images
    document.addEventListener('mouseover', showPreview);
    document.addEventListener('mousemove', updatePreviewPosition);
    document.addEventListener('mouseout', hidePreview);

})();
