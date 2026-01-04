// ==UserScript==
// @name         YouTube Music URL Link Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to copy the current song URL, works even on YouTube Music homepage
// @author       YourName
// @match        https://music.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534769/YouTube%20Music%20URL%20Link%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534769/YouTube%20Music%20URL%20Link%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        .yt-direct-copy-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            cursor: pointer;
            color: #909090;
            background: none;
            border: none;
            margin: 0 4px;
            position: relative;
            padding: 0;
        }

        .yt-direct-copy-btn:hover {
            color: #FFFFFF;
        }

        .yt-direct-copy-btn svg {
            width: 20px;
            height: 20px;
        }

        .yt-copy-tooltip {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(28, 28, 28, 0.9);
            color: white;
            padding: 5px 8px;
            border-radius: 2px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            z-index: 9999;
        }

        .yt-direct-copy-btn:hover .yt-copy-tooltip {
            opacity: 1;
        }

        .yt-copy-tooltip.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Function to create the copy button
    function createCopyButton() {
        const button = document.createElement('button');
        button.className = 'yt-direct-copy-btn';
        button.type = 'button';
        button.setAttribute('aria-label', 'Copy song link');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
            </svg>
            <div class="yt-copy-tooltip">Copy song link</div>
        `;

        // Add click handler
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            e.preventDefault();

            // Get the current song information
            const songData = await getCurrentSongData();

            if (songData && songData.videoId) {
                // Construct a proper YouTube Music song URL
                const songUrl = `https://music.youtube.com/watch?v=${songData.videoId}`;

                // Copy to clipboard
                try {
                    await navigator.clipboard.writeText(songUrl);
                    showCopiedTooltip(button);
                } catch (err) {
                    // Fallback for browsers without clipboard API
                    const textArea = document.createElement('textarea');
                    textArea.value = songUrl;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showCopiedTooltip(button);
                }
            } else {
                // If we couldn't get the song data, try clicking the share button as fallback
                tryUsingShareButton();
            }

            return false;
        });

        return button;
    }

    // Function to get current song data
    async function getCurrentSongData() {
        // Try several methods to find the current song's video ID

        // Method 1: Check URL if we're on a watch page
        if (window.location.pathname === '/watch') {
            const urlParams = new URLSearchParams(window.location.search);
            const videoId = urlParams.get('v');
            if (videoId) {
                return { videoId: videoId };
            }
        }

        // Method 2: Look for the player info directly
        try {
            // Try to find the video ID in player data
            const playerBar = document.querySelector('ytmusic-player-bar');
            if (playerBar) {
                // Try to get the data from the player state
                const playerApi = document.querySelector('#movie_player');
                if (playerApi && playerApi.getVideoData) {
                    const videoData = playerApi.getVideoData();
                    if (videoData && videoData.video_id) {
                        return { videoId: videoData.video_id };
                    }
                }

                // Try to get from the thumbnail
                const thumbnail = playerBar.querySelector('img.ytmusic-player-bar');
                if (thumbnail && thumbnail.src) {
                    // YouTube Music thumbnail URLs contain the video ID
                    const match = thumbnail.src.match(/\/vi\/([a-zA-Z0-9_-]{11})\/|\/hqdefault\.([a-zA-Z0-9_-]{11})_/);
                    if (match && (match[1] || match[2])) {
                        return { videoId: match[1] || match[2] };
                    }
                }
            }
        } catch (error) {
            console.error('Error getting song data from player:', error);
        }

        // Method 3: Look for video ID in player attributes
        try {
            const ytMusicPlayer = document.querySelector('ytmusic-player');
            if (ytMusicPlayer) {
                const videoIdAttribute = ytMusicPlayer.getAttribute('video-id');
                if (videoIdAttribute) {
                    return { videoId: videoIdAttribute };
                }
            }
        } catch (error) {
            console.error('Error getting video ID from player attributes:', error);
        }

        // Method 4: Try to find it in the player bar queue button data
        try {
            const queueButton = document.querySelector('.ytmusic-player-bar .left-controls .middle-controls tp-yt-paper-icon-button');
            if (queueButton) {
                const dataAttr = queueButton.getAttribute('data-video-id') ||
                                 queueButton.getAttribute('aria-label-of') ||
                                 queueButton.getAttribute('data-song-id');
                if (dataAttr && dataAttr.length === 11) {
                    return { videoId: dataAttr };
                }
            }
        } catch (error) {
            console.error('Error getting data from queue button:', error);
        }

        // Method 5: Last resort - try to use the share button
        const shareButton = await findShareButton();
        if (shareButton) {
            try {
                // Click the share button to open the share dialog
                shareButton.click();

                // Wait for the share dialog to open
                await new Promise(resolve => setTimeout(resolve, 300));

                // Try to get the URL from the share dialog
                const shareInput = document.querySelector('#share-url');
                if (shareInput && shareInput.value) {
                    const url = shareInput.value;
                    const urlObj = new URL(url);
                    const videoId = urlObj.searchParams.get('v');

                    // Close the dialog
                    const closeButton = document.querySelector('[aria-label="Close"]');
                    if (closeButton) closeButton.click();

                    if (videoId) {
                        return { videoId: videoId };
                    }
                }

                // Close the dialog if we're still here
                const closeButton = document.querySelector('[aria-label="Close"]');
                if (closeButton) closeButton.click();
            } catch (error) {
                console.error('Error using share button:', error);
                // Close any open dialog
                const closeButton = document.querySelector('[aria-label="Close"]');
                if (closeButton) closeButton.click();
            }
        }

        return null;
    }

    // Function to find share button
    async function findShareButton() {
        // Wait for menu button
        const menuButton = await waitForElement('ytmusic-player-bar .right-controls-buttons tp-yt-paper-icon-button[aria-label="More actions"], ytmusic-player-bar .menu-button');

        if (menuButton) {
            // Click menu button to open menu
            menuButton.click();

            // Wait for menu to open
            await new Promise(resolve => setTimeout(resolve, 200));

            // Find share option
            const shareOption = Array.from(document.querySelectorAll('ytmusic-menu-renderer tp-yt-paper-listbox yt-formatted-string')).find(el => el.textContent.trim() === 'Share');

            // Close menu if we didn't find share option
            if (!shareOption) {
                document.body.click(); // Click away to close menu
                return null;
            }

            return shareOption;
        }

        return null;
    }

    // Function to try using the share button as fallback
    async function tryUsingShareButton() {
        try {
            // Find and click more actions button
            const menuButton = document.querySelector('ytmusic-player-bar .right-controls-buttons tp-yt-paper-icon-button[aria-label="More actions"], ytmusic-player-bar .menu-button');
            if (!menuButton) return;

            menuButton.click();
            await new Promise(resolve => setTimeout(resolve, 200));

            // Find and click share option
            const shareOption = Array.from(document.querySelectorAll('ytmusic-menu-renderer tp-yt-paper-listbox yt-formatted-string')).find(el => el.textContent.trim() === 'Share');
            if (!shareOption) {
                document.body.click(); // Close menu
                return;
            }

            shareOption.click();
            await new Promise(resolve => setTimeout(resolve, 200));

            // Find and click copy button
            const copyButton = document.querySelector('#copy-button button');
            if (copyButton) {
                copyButton.click();
            }

            // Close dialog after short delay
            setTimeout(() => {
                const closeButton = document.querySelector('[aria-label="Close"]');
                if (closeButton) closeButton.click();
            }, 500);

        } catch (error) {
            console.error('Error using share fallback:', error);
        }
    }

    // Function to wait for an element to appear
    function waitForElement(selector, timeout = 3000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }, timeout);
        });
    }

    // Function to show "Copied!" tooltip
    function showCopiedTooltip(button) {
        const tooltip = button.querySelector('.yt-copy-tooltip');
        const originalText = tooltip.textContent;

        tooltip.textContent = 'Copied!';
        tooltip.classList.add('show');

        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                tooltip.textContent = originalText;
            }, 300);
        }, 2000);
    }

    // Function to inject the button
    function injectCopyButton() {
        // Try to find the right-controls-buttons that contains volume, etc.
        const rightControls = document.querySelector('.right-controls-buttons');

        // Skip if button already exists or controls not found
        if (!rightControls || document.querySelector('.yt-direct-copy-btn')) {
            return;
        }

        // Create and insert the button
        const copyButton = createCopyButton();

        // Find a good insertion point - typically before the More button
        const moreButton = rightControls.querySelector('tp-yt-paper-icon-button[aria-label="More actions"]');

        if (moreButton) {
            // Insert before more button
            rightControls.insertBefore(copyButton, moreButton);
        } else {
            // Fallback - insert at beginning of controls
            rightControls.insertBefore(copyButton, rightControls.firstChild);
        }
    }

    // Initial injection attempts
    setTimeout(injectCopyButton, 3000);
    setTimeout(injectCopyButton, 6000);

    // Set up observer to watch for player changes
    function setupObserver() {
        const observer = new MutationObserver(() => {
            if (!document.querySelector('.yt-direct-copy-btn')) {
                injectCopyButton();
            }
        });

        const playerBar = document.querySelector('ytmusic-player-bar');
        if (playerBar) {
            observer.observe(playerBar, {
                childList: true,
                subtree: true
            });
        }
    }

    // Setup observer after a delay
    setTimeout(setupObserver, 4000);

    // Listen for navigation events
    document.addEventListener('yt-navigate-finish', () => {
        setTimeout(injectCopyButton, 1500);
    });

    // Continuous injection attempts at intervals
    const intervalId = setInterval(() => {
        if (document.querySelector('.yt-direct-copy-btn')) {
            // Once button is found, reduce frequency of checks
            clearInterval(intervalId);
            // Keep a less frequent check running
            setInterval(injectCopyButton, 10000);
        } else {
            injectCopyButton();
        }
    }, 3000);
})();