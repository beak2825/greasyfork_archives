// ==UserScript==
// @name         Unsplash图集下载器
// @namespace    Tampermonkey Scripts
// @version      1.21
// @description  Automatically scroll to load all images and then download original size images from Unsplash pages
// @author       宇泽同学、FOK
// @match        https://unsplash.dogedoge.com/collections/*
// @match        https://unsplash.com/collections/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484783/Unsplash%E5%9B%BE%E9%9B%86%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/484783/Unsplash%E5%9B%BE%E9%9B%86%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables to keep track of download progress
    let downloadedCount = 0;
    let totalImages = 0;
    let progressText;

    // Function to update the on-screen progress indicator
    function updateProgressText() {
        if (progressText) {
            progressText.textContent = `已下载：${downloadedCount}/${totalImages}`;
        }
    }

    // Function to download an image with a given URL and name
    function downloadImage(url, name) {
        GM_download({
            url: url,
            name: name,
            onerror: function(error) {
                console.error(`Download failed:`, error);
                downloadedCount++;
                updateProgressText();
            },
            ontimeout: function() {
                console.error(`Download timed out:`, url);
                downloadedCount++;
                updateProgressText();
            },
            onload: function() {
                downloadedCount++;
                updateProgressText();
            }
        });
    }

    // Function to get URLs of all downloadable images on the page
    function getImageUrls() {
        const downloadLinks = document.querySelectorAll('a[data-test="non-sponsored-photo-download-button"]');
        return Array.from(downloadLinks).map(link => link.href.replace(/&amp;/g, '&'));
    }

    // Function to scroll to the bottom of the page, click the 'Load More' button, and download all images
    function startDownloadProcess() {
        autoScroll(() => {
            const imageUrls = getImageUrls();
            totalImages = imageUrls.length; // Update the total images count
            downloadedCount = 0; // Reset the downloaded count
            updateProgressText(); // Update the progress text
            imageUrls.forEach((url, index) => {
                const nameMatch = /\/photos\/([^/?#]+)\//.exec(url);
                const name = nameMatch ? `unsplash-${nameMatch[1]}-original.jpg` : `unsplash-original-${index + 1}.jpg`;
                // Delay added to prevent rate limiting or server side blocking
                setTimeout(() => downloadImage(url, name), index * 1000);
            });
        });
    }

    // Function to automatically scroll down and load more images
function autoScroll(callback) {
    let currentPosition = 0;
    const distanceToScroll = 1000;
    const intervalDelay = 750;
    const scrollInterval = setInterval(() => {
        window.scrollTo(0, currentPosition);
        currentPosition += distanceToScroll;

        // 检查是否存在加载更多的按钮，并尝试点击
        let loadMoreButton = document.querySelector('.CwMIr.DQBsa.p1cWU.jpBZ0.AYOsT.Olora.I0aPD.dEcXu.WMIal.KHq0c');
        if (loadMoreButton) {
            loadMoreButton.click();
        }

        if (currentPosition >= document.documentElement.scrollHeight) {
            clearInterval(scrollInterval);
            window.scrollTo(0, 0); // Scroll back to the top of the page
            if (typeof callback === "function") {
                setTimeout(callback, 3500); // Wait 3 seconds before callback to ensure all images are loaded
            }
        }
    }, intervalDelay);
}

    // Function to add the download button to the page, next to the collection name
    function addDownloadButton() {
        const collectionNameElement = document.querySelector('.BkvN1');
        if (collectionNameElement) {
            const downloadBtnContainer = document.createElement('div');
            downloadBtnContainer.style.display = 'inline-flex';
            downloadBtnContainer.style.alignItems = 'center';
            downloadBtnContainer.style.marginLeft = '-10px';

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下载合集';
            downloadBtn.id = 'downloadBtn';
            Object.assign(downloadBtn.style, {
                fontSize: '16px',
                color: 'white',
                background: 'Tan',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                padding: '8px 15px',
                margin: '0 10px'
            });


            progressText = document.createElement('span');
            progressText.id = 'downloadProgressText';
            progressText.textContent = '下载进度：0%';
            progressText.style.fontSize = '14px';

            downloadBtnContainer.appendChild(downloadBtn);
            downloadBtnContainer.appendChild(progressText);

            downloadBtn.addEventListener('click', startDownloadProcess);

            collectionNameElement.parentNode.insertBefore(downloadBtnContainer, collectionNameElement.nextSibling);
        } else {
            console.error('Collection name element not found.');
        }
    }

    // Try to add the download button, or set an interval if the collection name element is not immediately available
    setInterval(() => {
        if (document.querySelector('.BkvN1') && !document.getElementById('downloadBtn')) {
            addDownloadButton();
        }
    }, 1000); // Check every second

})();
