// ==UserScript==
// @name         JWPlayer Video Downloader with Title
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Extract video URLs from JWPlayer using page title as filename
// @author       sharmanhall
// @match        *://bigwarp.io/*
// @match        *://bigwarp.cc/*
// @match        *://bigwarp.pro/*
// @match        *://lulustream.com/*
// @match        *://jshtdpi85it3.tnmr.org/*
// @match        *://https://lulustream.com/*

// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536654/JWPlayer%20Video%20Downloader%20with%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/536654/JWPlayer%20Video%20Downloader%20with%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for JWPlayer to be initialized
    function checkForPlayer() {
        if (typeof jwplayer !== 'undefined' && jwplayer().getPlaylist) {
            createDownloadButton();
        } else {
            setTimeout(checkForPlayer, 1000);
        }
    }

    function createDownloadButton() {
        // Create a download button
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download Video';
        downloadBtn.style.position = 'fixed';
        downloadBtn.style.top = '10px';
        downloadBtn.style.right = '10px';
        downloadBtn.style.zIndex = '9999';
        downloadBtn.style.padding = '10px';
        downloadBtn.style.backgroundColor = '#3586FF';
        downloadBtn.style.color = 'white';
        downloadBtn.style.border = 'none';
        downloadBtn.style.borderRadius = '4px';
        downloadBtn.style.cursor = 'pointer';

        // Add click event
        downloadBtn.addEventListener('click', extractVideoUrls);

        document.body.appendChild(downloadBtn);
    }

    function getVideoTitle() {
        // Try to get the title from the h2 element
        const titleElement = document.querySelector('h2.mb-0.pb-0');
        if (titleElement) {
            // Clean the title to make it suitable for a filename
            let title = titleElement.textContent.trim();
            // Remove the flag button text if it exists
            if (title.includes('flag')) {
                title = title.split('flag')[0].trim();
            }
            // Replace invalid filename characters
            title = title.replace(/[\\/:*?"<>|]/g, '_');
            // Limit length to avoid extremely long filenames
            return title.length > 100 ? title.substring(0, 100) + '...' : title;
        }

        // Fallback to the page title if h2 not found
        if (document.title) {
            let title = document.title.trim();
            title = title.replace(/[\\/:*?"<>|]/g, '_');
            return title.length > 100 ? title.substring(0, 100) + '...' : title;
        }

        // Default if no title is found
        return 'video_download';
    }

    function extractVideoUrls() {
        try {
            // Get player instance
            const player = jwplayer();

            if (!player) {
                alert('JWPlayer not found on this page');
                return;
            }

            // Get available sources
            const sources = player.getPlaylist()[0].sources;

            if (!sources || sources.length === 0) {
                alert('No video sources found');
                return;
            }

            // Get video title for filename
            const videoTitle = getVideoTitle();

            // Create a dialog to show available qualities
            const dialog = document.createElement('div');
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.backgroundColor = 'white';
            dialog.style.padding = '20px';
            dialog.style.borderRadius = '5px';
            dialog.style.zIndex = '10000';
            dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            dialog.style.maxWidth = '80%';
            dialog.style.maxHeight = '80vh';
            dialog.style.overflow = 'auto';

            const title = document.createElement('h3');
            title.textContent = 'Available Video Qualities';
            title.style.marginBottom = '15px';
            dialog.appendChild(title);

            const filenameDisplay = document.createElement('p');
            filenameDisplay.textContent = `Filename: ${videoTitle}.mp4`;
            filenameDisplay.style.marginBottom = '15px';
            filenameDisplay.style.fontStyle = 'italic';
            filenameDisplay.style.wordBreak = 'break-word';
            dialog.appendChild(filenameDisplay);

            sources.forEach((source, index) => {
                const link = document.createElement('a');
                link.href = source.file;
                link.textContent = `Quality: ${source.label || 'Unknown'}`;
                link.target = '_blank';
                link.style.display = 'block';
                link.style.margin = '10px 0';
                link.style.color = '#3586FF';
                link.style.textDecoration = 'none';
                link.download = `${videoTitle}_${source.label || 'quality' + index}.mp4`;
                dialog.appendChild(link);
            });

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.marginTop = '15px';
            closeBtn.style.padding = '5px 10px';
            closeBtn.style.backgroundColor = '#3586FF';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '4px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
            });
            dialog.appendChild(closeBtn);

            document.body.appendChild(dialog);
        } catch (error) {
            alert('Error extracting video URLs: ' + error.message);
        }
    }

    // Start checking for player
    setTimeout(checkForPlayer, 2000);
})();