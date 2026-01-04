// ==UserScript==
// @name         圖片懸停圖片放大預覽(超級大預覽版) 自用連結版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Preview images on hover across websites, excluding YouTube and Bilibili
// @description:en  Preview images on hover across websites, excluding YouTube and Bilibili
// @author       Hitenlxy
// @license      MIT
// @match        https://kemono.party/*
// @match        https://kemono.su/*
// @match        https://coomer.party/*
// @match        https://coomer.su/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://www.patreon.com/*
// @match        https://*.fanbox.cc/*
// @match        https://north-plus.net/*
// @match        https://nhentai.net/
// @match        https://hanime1.me/*
// @match        https://*.fantia.jp/*
// @match        https://*.simpcity.su/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498804/%E5%9C%96%E7%89%87%E6%87%B8%E5%81%9C%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7%E9%A0%90%E8%A6%BD%28%E8%B6%85%E7%B4%9A%E5%A4%A7%E9%A0%90%E8%A6%BD%E7%89%88%29%20%E8%87%AA%E7%94%A8%E9%80%A3%E7%B5%90%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/498804/%E5%9C%96%E7%89%87%E6%87%B8%E5%81%9C%E5%9C%96%E7%89%87%E6%94%BE%E5%A4%A7%E9%A0%90%E8%A6%BD%28%E8%B6%85%E7%B4%9A%E5%A4%A7%E9%A0%90%E8%A6%BD%E7%89%88%29%20%E8%87%AA%E7%94%A8%E9%80%A3%E7%B5%90%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define max width and max height for the preview image
    const MAX_WIDTH = 800; // Maximum width of the preview image
    const MAX_HEIGHT = 600; // Maximum height of the preview image
    const OFFSET_X = 20; // Offset from mouse pointer on X-axis
    const OFFSET_Y = 20; // Offset from mouse pointer on Y-axis

    // Create a CSS style for the preview window
    GM_addStyle(`
        .image-preview {
            position: fixed;
            display: none;
            z-index: 9999;
            background: none;
            box-shadow: none;
        }
        .image-preview img {
            max-width: ${MAX_WIDTH}px;
            max-height: ${MAX_HEIGHT}px;
            border: none;
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
            let previewY = event.clientY - img.height - OFFSET_Y;

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
