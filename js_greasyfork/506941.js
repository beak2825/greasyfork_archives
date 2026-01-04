// ==UserScript==
// @name         Shazam My Library Audio Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds download buttons next to tracks in Shazam My Library for audio previews. 
// @author       Jeffrey
// @match        https://www.shazam.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506941/Shazam%20My%20Library%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/506941/Shazam%20My%20Library%20Audio%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script is running...');

    // Function to add the download button
    function addDownloadButtons() {
        // Find all track items that have the audio URL
        let trackElements = document.querySelectorAll('article[data-shz-audio-url]');
        console.log(`Found ${trackElements.length} tracks.`);

        trackElements.forEach(track => {
            // Ensure no duplicate button
            if (!track.querySelector('.download-button')) {
                // Create the download button
                let downloadButton = document.createElement('a');
                downloadButton.textContent = '⬇️ Download Preview';
                downloadButton.classList.add('download-button');
                downloadButton.style.display = 'inline-block';  // Ensure the button is displayed
                downloadButton.style.marginLeft = '10px';
                downloadButton.style.cursor = 'pointer';
                downloadButton.style.fontSize = '14px';
                downloadButton.style.color = '#007bff';  // Make the button blue and visible
                downloadButton.style.textDecoration = 'none'; // Remove underline
                downloadButton.style.fontWeight = 'bold'; // Make it more prominent

                // Get the audio preview URL from the element's data attribute
                let previewUrl = track.getAttribute('data-shz-audio-url');
                console.log('Preview URL:', previewUrl);

                // Set the download link attributes
                if (previewUrl) {
                    downloadButton.href = previewUrl;
                    downloadButton.download = 'audio-preview.m4a';  // Name the file accordingly
                }

                // Insert the button into the track details area (append to the last div in details)
                let trackDetails = track.querySelector('.details');
                if (trackDetails) {
                    // Try appending it in a more prominent position
                    trackDetails.appendChild(downloadButton);
                    console.log('Download button added.');
                }
            }
        });
    }

    // Observe changes in the DOM to detect when the tracks are loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        const trackElements = document.querySelectorAll('article[data-shz-audio-url]');
        if (trackElements.length > 0) {
            console.log('Tracks detected, adding download buttons...');
            addDownloadButtons();
            observer.disconnect(); // Stop observing once tracks are found and buttons are added
        }
    });

    // Start observing the page for changes in the child elements of the body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
