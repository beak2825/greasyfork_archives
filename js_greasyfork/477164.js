// ==UserScript==
// @name         下载天猫主图
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Adds a floating download button to download images from div.desc-root on tmall.com
// @author       Your Name
// @match        https://detail.tmall.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/477164/%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E4%B8%BB%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477164/%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E4%B8%BB%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerText = '下载主图';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '90px';
        button.style.zIndex = '9999';

        button.addEventListener('click', () => {
            downloadThumbnails();
        });

        document.body.appendChild(button);
    }
    function getMainTitle() {
        const mainTitleElement = document.querySelector('h1[class^="ItemHeader--mainTitle"]');
        if (mainTitleElement) {
            return mainTitleElement.innerText;
        }
        return '';
    }

    function downloadThumbnails() {
        const mainTitle = getMainTitle();
        const thumbnailsContainer = document.querySelector('ul[class^="PicGallery--thumbnails"]'); // Select the thumbnails container
        if (!thumbnailsContainer) {
            console.log('Thumbnails container not found.');
            return;
        }

        const thumbnails = thumbnailsContainer.querySelectorAll('img'); // Select thumbnail images

        let imageCount = 0;

        thumbnails.forEach((thumbnail, index) => {
            const imageUrl = thumbnail.getAttribute('src');

            // Filter out "_110x10000Q75.jpg_.webp" from the image URL
            const filteredImageUrl = imageUrl.replace(/_110x\d+Q\d+\.jpg_\.webp/g, '');

            // Only download images that start with '//gw.alicdn.com'
            if (filteredImageUrl && filteredImageUrl.startsWith('//gw.alicdn.com')) {
                imageCount++;
                const fileExtension = filteredImageUrl.split('.').pop();
                const paddedIndex = String(imageCount).padStart(2, '0');
                const fileName = `${mainTitle}_主图_${paddedIndex}.${fileExtension}`;

                // Download the image using GM_download
                GM_download({
                    url: 'https:' + filteredImageUrl,
                    name: fileName,
                    saveAs: true
                });
            }
        });

        if (imageCount === 0) {
            console.log('No images found for download.');
        }
    }

    // Call the function to create the download button
    createDownloadButton();
})();