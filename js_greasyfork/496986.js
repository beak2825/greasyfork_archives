// ==UserScript==
// @name         Watzatsong Sample Downloader
// @namespace    https://greasyfork.org/en/scripts/496986-watzatsong-sample-downloader
// @version      1.1
// @description  Adds a download button to download the sample mp3 from Watzatsong pages.
// @author       Liam
// @match        https://www.watzatsong.com/en/name-that-tune/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496986/Watzatsong%20Sample%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/496986/Watzatsong%20Sample%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        // Select the play button div
        var playButton = document.querySelector('.play.sample-box-actions-play.play-focus.sample-box-actions-play2.sample-box-actions-big');

        if (playButton) {
            // Get the sample attribute value
            var sampleUrl = playButton.getAttribute('sample');

            if (sampleUrl) {
                // Check if the download button already exists
                if (document.querySelector('.sample-box-actions-checkanswer')) return;

                // Create the download button
                var downloadButton = document.createElement('a');
                downloadButton.className = 'sample-box-actions-checkanswer sample-box-actions-big';
                downloadButton.href = sampleUrl;
                downloadButton.download = 'sample.mp3';
                downloadButton.innerHTML = `
                    <div style="background-image:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAlElEQVQ4jWP8//8/Ay5wkpEJRdL8/z8GBgYGRmxqmXCaQiJgwSf5Z9AZ9HsgDGJEj7VNaDGFC/ihxSCKQWuJNAQGgpEMw3DRCiINi8DnIhhYQsCwGCwJE6tBDAwMDPNxGJaII3XjNIiBgYFhFpphaeRmkbT//xh/M0CSAT5DCLqIFABPkD0kRj0MlEBdCjfoL4UuAgD69kO2Y1noUwAAAABJRU5ErkJggg==') !important;background-position: 0 !important;"></div>Download
                `;

                // Insert the download button before the follow button
                var actionsContainer = document.querySelector('.sample-box-actions');
                var followButton = document.querySelector('.sample-box-actions-follow');
                if (actionsContainer && followButton) {
                    actionsContainer.insertBefore(downloadButton, followButton);
                }
            }
        }
    }

    // Run the function to add the download button
    addDownloadButton();
})();