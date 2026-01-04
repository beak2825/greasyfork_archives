// ==UserScript==
// @name         Storypark Medias (Images and Videos) Downloader
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Download media files including images and videos from a Storypark story
// @author       Desmond Chen
// @match        https://app.storypark.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496738/Storypark%20Medias%20%28Images%20and%20Videos%29%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/496738/Storypark%20Medias%20%28Images%20and%20Videos%29%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndModifyImageUrls() {

        const images = document.querySelectorAll('img');
        const imageUrls = [];

        images.forEach((img) => {
            const url = img.src;
            const regex = /https:\/\/app\.storypark\.com\/media_items\/.+\/.+\/\d+_wide/;
            const match = url.match(regex);
            if (match) {
                const modifiedUrl = url.replace(/\/\d+_wide/, '/original');
                imageUrls.push(modifiedUrl);
            }
        });

        return imageUrls;
    }


    function findVideoUrls() {

        const videos = document.querySelectorAll('video');
        const videoUrls = [];

        videos.forEach((video) => {
            const url = video.src;
            const regex = /https:\/\/app\.storypark\.com\/media_items\/.+\/.+\/\d+_high/;
            const match = url.match(regex);
            if (match) {
                videoUrls.push(url);
            }
        });

        return videoUrls;
    }


    function createDownloadButton(urls) {
        const now = new Date()
        const nowISO = now.toISOString()

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'v-btn v-btn--text theme--light v-size--default teal2--text text-body-2 mr-2';
        button.setAttribute('aria-describedby', 'button-desc');

        const span = document.createElement('span');
        span.className = 'v-btn__content';
        span.innerText = 'Download Medias';

        button.appendChild(span);

        button.addEventListener('click', () => {
            urls.forEach((url, index) => {
                fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = `media_${nowISO}_${index + 1}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                })
                    .catch(console.error);
            });
        });

        return button;
    }


    function insertDownloadButton(button) {
        const toolbarContent = document.querySelector('.v-toolbar__content>div>div:nth-of-type(2)');
        const buttons = toolbarContent.querySelectorAll('.v-btn');
        toolbarContent.insertBefore(button, buttons[0]);
    }


    function initialize() {
        const imageUrls = findAndModifyImageUrls();
        const videoUrls = findVideoUrls();
        const allUrls = imageUrls.concat(videoUrls)
        if (allUrls.length > 0) {
            console.log(`Got ${allUrls.length} allUrls`)
            const downloadButton = createDownloadButton(allUrls);
            insertDownloadButton(downloadButton);
        }

    }

    // Run the script after a short delay to ensure elements are loaded
    setTimeout(initialize, 3000);
})();
