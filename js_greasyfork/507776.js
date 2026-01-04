// ==UserScript==
// @name         Add Download Button to Video Player
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Adds a "DOWNLOAD" button to video players when a video tag is detected or its src changes
// @author       Your Name
// @match        https://www.cambro.tv/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cambro.tv
// @license      MIT
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/507776/Add%20Download%20Button%20to%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/507776/Add%20Download%20Button%20to%20Video%20Player.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Function to add download button to video elements
    function addDownloadButton(video) {
        // Check if the button is already added
        if (video.dataset.hasDownloadButton) return;

        const src = video.currentSrc || video.src;
        if (!src) return;

        console.log('Video src detected:', src);

        video.dataset.hasDownloadButton = true;

        // Get filename from h1 tag
        const h1 = document.querySelector('h1');
        const filename = h1 ? h1.textContent.trim() + '.mp4' : 'video.mp4';

        // Create the download button
        const button = document.createElement('button');
        button.textContent = 'Download';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.zIndex = 9999;

        // Ensure the video container is positioned relatively
        const container = video.parentElement;
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        // Append button to the container
        container.appendChild(button);

        // Add click event to download video using GM_download
        button.addEventListener('click', () => {
            GM_download({
                url: src,
                name: filename,
                saveAs : true,
                onerror: function(error) {
                    console.error('Download failed:', error);
                },
                onprogress: function(progress) {
                    console.log(`Downloaded ${progress.done} of ${progress.total} bytes`);
                },
                onload: function() {
                    console.log('Download completed');
                }
            });
        });
    }

    // Observe the DOM for video elements
    const observer = new MutationObserver(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(addDownloadButton);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also check existing videos on page load
    const videos = document.querySelectorAll('video');
    videos.forEach(addDownloadButton);
})();