// ==UserScript==
// @name         Instagram Gallery Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Scans for images and downloads them from cache
// @match        https://*.instagram.com/*
// @match        https://instagram.com/*
// @grant        GM_download
// @connect      instagram.com
// @connect      cdninstagram.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523039/Instagram%20Gallery%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523039/Instagram%20Gallery%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetUl = null;
    let foundImages = new Set();
    let scanInterval = null;
    let scanButton = null;
    let isScanning = false;
    let downloadInProgress = false;

    // Create and add floating button
    function createFloatingButton() {
        scanButton = document.createElement('button');
        updateButtonState();
        scanButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 15px 20px;
            background-color: white;
            color: black;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            min-width: 100px;
            transition: background-color 0.3s;
        `;

        scanButton.addEventListener('click', handleButtonClick);
        document.body.appendChild(scanButton);
    }

    // Handle button click based on current state
    function handleButtonClick() {
        if (isScanning) {
            stopScanning();
        } else if (downloadInProgress) {
            // Do nothing while downloading
            return;
        } else if (foundImages.size > 0) {
            startDownloading();
        } else {
            findLargestImageParentUl();
        }
    }

    // Update button appearance based on state
    function updateButtonState() {
        if (!scanButton) return;

        if (downloadInProgress) {
            scanButton.textContent = 'Downloading...';
        } else if (isScanning) {
            scanButton.textContent = 'Stop Scan';
        } else {
            scanButton.textContent = foundImages.size > 0 ? `Download ${foundImages.size} images` : 'Start scan';
        }
    }

    // Start downloading process
    async function startDownloading() {
        downloadInProgress = true;
        updateButtonState();

        const totalImages = foundImages.size;
        let currentImage = 0;

        for (const imageUrl of foundImages) {
            currentImage++;
            scanButton.textContent = `Downloading ${currentImage}/${totalImages}`;

            try {
                await downloadImageFromCache(imageUrl);
                await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
            } catch (error) {
                console.error('Error downloading image:', imageUrl, error);
            }
        }

        downloadInProgress = false;
        foundImages.clear();
        updateButtonState();
    }

    // Download single image from cache
    async function downloadImageFromCache(imageUrl) {
        return new Promise((resolve, reject) => {
            // First, try to fetch from cache
            fetch(imageUrl, { cache: 'force-cache' })
                .then(response => response.blob())
                .then(blob => {
                    // Create a download link
                    const filename = imageUrl.split('/').pop().split('?')[0] || 'image.jpg';
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    resolve();
                })
                .catch(reject);
        });
    }

    // Find largest image and its parent UL
    function findLargestImageParentUl() {
        let maxArea = 0;
        let largestImg = null;

        const images = document.getElementsByTagName('img');

        for (const img of images) {
            const area = img.offsetWidth * img.offsetHeight;
            if (area > maxArea) {
                maxArea = area;
                largestImg = img;
            }
        }

        if (largestImg) {
            let element = largestImg;
            while (element && element.tagName !== 'UL') {
                element = element.parentElement;
            }

            if (element && element.tagName === 'UL') {
                targetUl = element;
                startScanning();
            } else {
                alert('No parent UL found for the largest image');
            }
        }
    }

    // Start periodic scanning
    function startScanning() {
        if (scanInterval) {
            clearInterval(scanInterval);
        }

        isScanning = true;
        updateButtonState();
        scanInterval = setInterval(scanForNewImages, 150);
    }

    // Stop scanning
    function stopScanning() {
        if (scanInterval) {
            clearInterval(scanInterval);
            scanInterval = null;
        }
        isScanning = false;
        updateButtonState();
        console.log('Scanning stopped. Total unique images found:', foundImages.size);
    }

    // Scan for new images in the target UL
    function scanForNewImages() {
        if (!targetUl) return;

        const images = targetUl.getElementsByTagName('img');
        for (const img of images) {
            const src = img.src;
            if (src && !foundImages.has(src)) {
                foundImages.add(src);
                console.log('New image found:', src);
            }
        }
    }

    // Initialize
    createFloatingButton();
})();
