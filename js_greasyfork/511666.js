// ==UserScript==
// @name         浙图博看网杂志图片排版优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浙江图书馆，博看网杂志排版优化,图片缩小，划图放大
// @author       none
// @match        *://61.175.198.136:8083/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511666/%E6%B5%99%E5%9B%BE%E5%8D%9A%E7%9C%8B%E7%BD%91%E6%9D%82%E5%BF%97%E5%9B%BE%E7%89%87%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/511666/%E6%B5%99%E5%9B%BE%E5%8D%9A%E7%9C%8B%E7%BD%91%E6%9D%82%E5%BF%97%E5%9B%BE%E7%89%87%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for enlarging images on hover
    const style = document.createElement('style');
    style.innerHTML = `
        img:hover {
            transition: transform 0.3s ease; /* Smooth transition */
            transform: scale(1.3); /* Enlarge image to 1.5 times its original size */
            z-index: 999999999; /* Make sure the image is above other elements */
        }
    `;
    document.head.appendChild(style);

    // Function to shrink a single image
    function shrinkImage(img) {
        if (!img.complete) {
            // If the image is not fully loaded, wait for the load event
            img.addEventListener('load', () => shrinkImage(img));
            return;
        }
        if (!img.dataset.shrunk) {
            img.style.width = (img.naturalWidth * 0.35) + 'px';
            img.style.height = (img.naturalHeight * 0.35) + 'px';
            img.dataset.shrunk = 'true'; // Mark as processed
        }
    }

    // Function to shrink all images on the page
    function shrinkAllImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => shrinkImage(img));
    }

    // MutationObserver to track new images added dynamically
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') {
                    shrinkImage(node);
                } else if (node.querySelectorAll) {
                    // Also handle if an element containing images is added
                    const newImages = node.querySelectorAll('img');
                    newImages.forEach(img => shrinkImage(img));
                }
            });
        });
    });

    // Observe changes in the body for dynamically loaded content
    observer.observe(document.body, { childList: true, subtree: true });

    // Shrink images on initial page load and periodically (if needed)
    window.addEventListener('load', () => {
        shrinkAllImages();

        // Retry shrinking periodically in case images are loaded late
        setTimeout(shrinkAllImages, 1000); // Try again after 1 second
        setTimeout(shrinkAllImages, 3000); // Try again after 3 seconds
        setTimeout(shrinkAllImages, 5000); // Try again after 5 seconds
    });

})();







