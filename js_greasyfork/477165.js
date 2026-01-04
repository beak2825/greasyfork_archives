// ==UserScript==
// @name         下载详情图
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Adds a floating download button to download images from div.desc-root on tmall.com
// @author       Your Name
// @match        https://detail.tmall.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/477165/%E4%B8%8B%E8%BD%BD%E8%AF%A6%E6%83%85%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477165/%E4%B8%8B%E8%BD%BD%E8%AF%A6%E6%83%85%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerText = '下载详情页';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';

        button.addEventListener('click', () => {
            downloadImages();
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

    function downloadImages() {
        const mainTitle = getMainTitle();

        const descRoot = document.querySelector('div.desc-root'); // Select the desc-root element
        if (!descRoot) return;

        const images = descRoot.querySelectorAll('img[data-src], img[src]'); // Select img elements with data-src or src attribute

        images.forEach((image, index) => {
            let imageUrl = image.getAttribute('data-src');
            if (!imageUrl) {
                imageUrl = image.getAttribute('src');
            }

            // Only download images that start with 'https://img.alicdn.com'
            if (imageUrl && imageUrl.startsWith('https://img.alicdn.com')) {
                const fileExtension = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
                const paddedIndex = String(index).padStart(2, '0');
                const fileName = `${mainTitle}_${paddedIndex}.${fileExtension}`;

                // Download the image using GM_download
                GM_download({
                    url: imageUrl,
                    name: fileName,
                    saveAs: true
                });
            }
        });
    }

    // Call the function to create the download button
    createDownloadButton();
})();