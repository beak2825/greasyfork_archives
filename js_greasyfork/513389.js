// ==UserScript==
// @name         IronWebTube ++
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Youtube AddBlocker, Youtube Free Video Downloader, Youtube Dislikes Enabler
// @author       iron web10
// @match        https://www.youtube.com/watch*
// @match        https://youtube.com/watch*
// @match        https://youtube.com*
// @grant        GM_xmlhttpRequest
// @icon         https://bestforandroid.com/apk/wp-content/uploads/2021/01/YouTube-Vanced-featured-image.png
// @license      iron web10
// @downloadURL https://update.greasyfork.org/scripts/513389/IronWebTube%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/513389/IronWebTube%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a control button with the same style as the original YouTube button
    function createControlButton(text, callback) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'yt-spec-button-shape-next'; // Original button classes
        button.style.padding = '10px';
        button.style.fontSize = '16px';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.backgroundColor = '#f9f9f9'; // Background color of the original button
        button.style.color = '#333'; // Text color of the original button
        button.style.cursor = 'pointer';
        button.addEventListener('click', callback);

        // Additional styles to match the original button
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.2)'; // Shadow of the original button

        return button;
    }

    // Function to replace the video
    function replaceVideo() {
        const url = window.location.href;
        const idMatch = url.match(/v=([^&]+)/);
        const id = idMatch ? idMatch[1] : null;

        if (id) {
            const newUrl = 'https://www.youtube-nocookie.com/embed/' + id + '?enablejsapi=1';
            const newIframe = document.createElement('iframe');
            newIframe.src = newUrl;
            newIframe.style.width = '100%';
            newIframe.style.height = '100%';
            newIframe.style.position = 'absolute';
            newIframe.style.top = '0';
            newIframe.style.left = '0';
            newIframe.style.border = 'none';
            newIframe.style.zIndex = '1';
            newIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            newIframe.allowFullscreen = true;

            const oldVideoContainer = document.querySelector('#container .html5-video-player');
            const errorBlock = document.querySelector('#container.style-scope.yt-playability-error-supported-renderers');

            if (errorBlock) {
                while (errorBlock.firstChild) {
                    errorBlock.removeChild(errorBlock.firstChild);
                }
                errorBlock.appendChild(newIframe);
                console.log('Video replaced in error block successfully.');
                return true;
            } else if (oldVideoContainer) {
                while (oldVideoContainer.firstChild) {
                    oldVideoContainer.removeChild(oldVideoContainer.firstChild);
                }
                oldVideoContainer.appendChild(newIframe);
                console.log('Video replaced in the main container successfully.');
                return true;
            }
        }
        return false;
    }

    // Fetch and display dislikes
    function fetchDislikes(videoId) {
        fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response:', data); // Log the entire response for debugging
                const dislikes = data.rawDislikes || 0; // Use 'data.rawDislikes' to get the correct value
                displayDislikes(dislikes);
            })
            .catch(error => {
                console.error('Error fetching dislikes:', error);
            });
    }

    // Function to display dislikes in the dislike button
    function displayDislikes(dislikes) {
        const dislikeButton = document.querySelector('dislike-button-view-model');
        if (dislikeButton) {
            const buttonModel = dislikeButton.querySelector('button-view-model');
            if (buttonModel) {
                // Check if the dislike text element exists; if not, create it
                let dislikeTextElement = buttonModel.querySelector('.yt-spec-button-shape-next__button-text-content');
                if (!dislikeTextElement) {
                    dislikeTextElement = document.createElement('div');
                    dislikeTextElement.className = 'yt-spec-button-shape-next__button-text-content';
                    dislikeTextElement.style.marginLeft = '8px'; // Add margin for better visibility
                    dislikeTextElement.style.fontSize = '14px'; // Font size for better visibility
                    buttonModel.appendChild(dislikeTextElement);
                }

                // Update the dislike text content to include "Dislikes: "
                dislikeTextElement.textContent = `Video Dislikes: ${dislikes}`;

                // Update aria-label and title
                const dislikeCountElement = buttonModel.querySelector('.yt-spec-button-shape-next__icon');
                dislikeCountElement.setAttribute('aria-label', `Dislikes: ${dislikes}`);
                dislikeCountElement.setAttribute('title', `Dislikes: ${dislikes}`);

                // Log for debugging
                console.log('Dislikes displayed in the dislike button successfully.');
            } else {
                console.error('Button model not found.');
            }
        } else {
            console.error('Dislike button not found.');
        }
    }

    // Add controls to the player
    function addControls() {
        // Create the new download button
        const downloadButton = createControlButton('Download', () => {
            const videoId = window.location.href.match(/v=([^&]+)/)[1];
            const downloadUrl = `https://y2meta.tube/convert/?videoId=${videoId}`;
            window.open(downloadUrl, '_blank');
        });

        // Replace the official YouTube download button if it exists
        const replaceOfficialDownloadButton = () => {
            const officialDownloadButton = document.querySelector('ytd-menu-service-item-download-renderer');
            if (officialDownloadButton) {
                const buttonContainer = document.createElement('div');
                buttonContainer.appendChild(downloadButton);
                officialDownloadButton.replaceWith(buttonContainer);
                console.log('Official download button replaced successfully.');
            } else {
                setTimeout(replaceOfficialDownloadButton, 1000); // Retry after 1 second
            }
        };

        replaceOfficialDownloadButton();
    }

    function init() {
        addControls();
        const checkInterval = setInterval(() => {
            if (replaceVideo()) {
                clearInterval(checkInterval);
            }
        }, 1000);

        const videoId = window.location.href.match(/v=([^&]+)/)[1];
        if (videoId) {
            fetchDislikes(videoId);
        }
    }

    init();
})();
