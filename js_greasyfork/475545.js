// ==UserScript==
// @name         Pixeldrain Viewer & Download - With Bypass
// @namespace    Magof - pixeldrain viewer & download - with bypass
// @description  Enhances PixelDrain by handling file list clicks, displaying media content, and adding download bypass buttons for individual files and lists.
// @version      2.0
// @author       Magof
// @match        https://pixeldrain.com/l/*
// @match        https://pixeldrain.com/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475545/Pixeldrain%20Viewer%20%20Download%20-%20With%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/475545/Pixeldrain%20Viewer%20%20Download%20-%20With%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the download button
    function addDownloadButton(buttonText, isList) {
        const button = document.createElement("button");
        const downloadIcon = document.createElement("a");
        downloadIcon.className = "icon";
        downloadIcon.textContent = "download";
        downloadIcon.style.color = "#d7dde8";
        const downloadButtonText = document.createElement("span");
        downloadButtonText.textContent = buttonText;
        button.appendChild(downloadIcon);
        button.appendChild(downloadButtonText);

        // Add click event listener to the button
        button.addEventListener('click', () => {
            const fileId = getFileIdFromUrl();
            if (fileId) {
                const downloadUrl = isList
                    ? `https://cdn.pd10.workers.dev/api/list/${fileId}/zip`
                    : `https://pd.cybar.xyz/${fileId}?download`;
                window.open(downloadUrl, '_blank'); // Open the URL in a new tab
            } else {
                console.error('File ID could not be determined for download.');
            }
        });

        const labels = document.querySelectorAll('div.label');
        labels.forEach(label => {
            if (label.textContent.trim() === 'Size') {
                const nextElement = label.nextElementSibling;
                if (nextElement) {
                    nextElement.insertAdjacentElement('afterend', button);
                }
            }
        });
    }

    // Function to handle clicks on file links
    function extractIdFromInnerHTML(innerHTML) {
        const idMatch = innerHTML.match(/\/api\/file\/(\w+)\/thumbnail/);
        return idMatch ? idMatch[1] : null;
    }

    function handleClick(event) {
        event.preventDefault(); // Prevent the default action
        const link = event.currentTarget;
        const innerHTML = link.innerHTML;
        const fileId = extractIdFromInnerHTML(innerHTML);

        if (fileId) {
            const fileUrl = `https://pixeldrain.com/u/${fileId}`;
            window.open(fileUrl, '_blank'); // Open the URL in a new tab
        } else {
            console.error('File ID could not be extracted from innerHTML.');
        }
    }

    function setUpClickHandlers() {
        const aTags = document.querySelectorAll('.gallery.svelte-85yow a');
        aTags.forEach(a => {
            a.addEventListener('click', handleClick);
        });
    }

    function clearElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }

    function createMediaDisplay(selector, mediaUrl, isVideo) {
        const element = document.querySelector(selector);
        if (element) {
            const mediaContainer = document.createElement('div');
            mediaContainer.style.display = 'flex';
            mediaContainer.style.justifyContent = 'center';
            mediaContainer.style.alignItems = 'center';
            mediaContainer.style.height = '500px';
            mediaContainer.style.backgroundColor = '#333';
            mediaContainer.style.color = '#fff';
            mediaContainer.style.borderRadius = '10px';
            mediaContainer.style.padding = '20px';
            mediaContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

            if (isVideo) {
                const videoPlayer = document.createElement('video');
                videoPlayer.style.maxWidth = '100%';
                videoPlayer.style.maxHeight = '100%';
                videoPlayer.style.border = '2px solid #fff';
                videoPlayer.style.borderRadius = '5px';
                videoPlayer.controls = true;
                videoPlayer.innerHTML = `<source src="${mediaUrl}" type="video/mp4">Your browser does not support the video tag.`;
                mediaContainer.appendChild(videoPlayer);
            } else {
                const imageElement = document.createElement('img');
                imageElement.style.maxWidth = '100%';
                imageElement.style.maxHeight = '100%';
                imageElement.style.border = '2px solid #fff';
                imageElement.style.borderRadius = '5px';
                imageElement.src = mediaUrl;
                mediaContainer.appendChild(imageElement);
            }

            element.appendChild(mediaContainer);
        }
    }

    function getFileIdFromUrl() {
        const urlParts = window.location.pathname.split('/');
        return urlParts[urlParts.length - 1];
    }

    function fetchFileInfo(fileId) {
        const apiUrl = `https://pixeldrain.com/api/file/${fileId}/info`;
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                console.error('Error fetching file info:', error);
                return null;
            });
    }

    function initialize() {
        if (window.location.pathname.includes('/l/')) {
            setUpClickHandlers();
            addDownloadButton('Download ZIP Bypass', true);
        } else if (window.location.pathname.includes('/u/')) {
            const selector = '.file_preview.svelte-jngqwx.checkers.toolbar_visible';
            clearElement(selector);
            addDownloadButton('Download Bypass', false);

            const fileId = getFileIdFromUrl();
            fetchFileInfo(fileId).then(fileInfo => {
                if (fileInfo) {
                    const mimeType = fileInfo.mime_type;
                    const mediaUrl = `https://pd.cybar.xyz/${fileId}`;

                    if (mimeType.startsWith('video')) {
                        createMediaDisplay(selector, mediaUrl, true);
                    } else if (mimeType.startsWith('image')) {
                        createMediaDisplay(selector, mediaUrl, false);
                    } else {
                        console.warn('Unsupported mime type:', mimeType);
                    }
                }
            });
        }
    }

    window.addEventListener('load', initialize);

})();
