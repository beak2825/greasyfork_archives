// ==UserScript==
// @name         HailuoAI Auto Generate and Download
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Automatically clicks generate button and downloads new videos
// @author       vaalerian
// @match        https://hailuoai.video/create
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524302/HailuoAI%20Auto%20Generate%20and%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/524302/HailuoAI%20Auto%20Generate%20and%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize download tracking set from storage
    let downloadedVideos = new Set(GM_getValue("downloadedVideos", []));

    // Create UI elements
    const uiContainer = document.createElement('div');
    const statsDiv = document.createElement('div');
    const generateButton = document.createElement('button');
    const downloadButton = document.createElement('button');
    const clearButton = document.createElement('button');

    // Style the main container
    uiContainer.style.cssText = `
        position: fixed;
        bottom: 0px;
        right: 33px;
        z-index: 10000;
        display: flex;
        gap: 10px;
        padding: 0;
        height: 20px;
        align-items: center;
    `;

    // Common button styles
    const commonButtonStyle = `
        height: 20px;
        padding: 0 10px;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
    `;

    // Style the stats display
    statsDiv.style.cssText = `
        ${commonButtonStyle}
        background: rgba(0,0,0,0.8);
        cursor: default;
    `;

    // Style the generate button
    generateButton.innerHTML = '🔄 Generate: OFF';
    generateButton.style.cssText = `
        ${commonButtonStyle}
        background: #ff69b4;
    `;

    // Style the download button
    downloadButton.innerHTML = '⬇️ Download: OFF';
    downloadButton.style.cssText = `
        ${commonButtonStyle}
        background: #4CAF50;
    `;

    // Style the clear button
    clearButton.innerHTML = '🗑️ Clear';
    clearButton.style.cssText = `
        ${commonButtonStyle}
        background: #ff4444;
    `;

    // Add elements to container
    uiContainer.appendChild(statsDiv);
    uiContainer.appendChild(generateButton);
    uiContainer.appendChild(downloadButton);
    uiContainer.appendChild(clearButton);
    document.body.appendChild(uiContainer);

    let generateActive = false;
    let downloadActive = false;
    let generateIntervalId = null;
    let downloadIntervalId = null;

    // Function to get unique identifier for a video
    function getVideoIdentifier(videoCard) {
        const video = videoCard.querySelector('video');
        if (video && video.src) {
            return video.src;
        }
        const poster = video?.poster || videoCard.querySelector('img')?.src;
        return poster || null;
    }

    // Function to track downloads
    function trackDownload(identifier) {
        if (identifier) {
            downloadedVideos.add(identifier);
            GM_setValue("downloadedVideos", Array.from(downloadedVideos));
            updateStats();
        }
    }

    // Update stats display
    function updateStats() {
        statsDiv.innerHTML = `📊 Tracked: ${downloadedVideos.size}`;
    }

    // Function to click generate button
    function clickGenerateButton() {
        const button = document.querySelector('.pink-gradient-btn');
        if (button && !button.parentElement.classList.contains('opacity-60')) {
            button.click();
            console.log('Generate button clicked');
        }
    }

    // Function to check videos and click download buttons
    function checkAndDownloadVideos() {
        const videoCards = document.querySelectorAll('.grid-video-card');
        videoCards.forEach(card => {
            const identifier = getVideoIdentifier(card);
            if (identifier && !downloadedVideos.has(identifier)) {
                const downloadButton = card.querySelector('button svg path[d*="5.24473"]')?.closest('button');
                if (downloadButton) {
                    console.log('Clicking download button for:', identifier);
                    downloadButton.click();
                    trackDownload(identifier);
                }
            }
        });
    }

    // Toggle generate function
    function toggleGenerate() {
        generateActive = !generateActive;
        generateButton.innerHTML = `🔄 Generate: ${generateActive ? 'ON' : 'OFF'}`;
        generateButton.style.background = generateActive ? '#32CD32' : '#ff69b4';

        if (generateActive) {
            generateIntervalId = setInterval(clickGenerateButton, 2000);
        } else if (generateIntervalId) {
            clearInterval(generateIntervalId);
            generateIntervalId = null;
        }
    }

    // Toggle download function
    function toggleDownload() {
        downloadActive = !downloadActive;
        downloadButton.innerHTML = `⬇️ Download: ${downloadActive ? 'ON' : 'OFF'}`;
        downloadButton.style.background = downloadActive ? '#32CD32' : '#4CAF50';

        if (downloadActive) {
            downloadIntervalId = setInterval(checkAndDownloadVideos, 1000);
        } else if (downloadIntervalId) {
            clearInterval(downloadIntervalId);
            downloadIntervalId = null;
        }
    }

    // Clear tracked downloads function
    function clearTracked() {
        downloadedVideos.clear();
        GM_setValue("downloadedVideos", []);
        updateStats();
    }

    // Add click event listeners
    generateButton.addEventListener('click', toggleGenerate);
    downloadButton.addEventListener('click', toggleDownload);
    clearButton.addEventListener('click', clearTracked);

    // Initialize stats display
    updateStats();
})();