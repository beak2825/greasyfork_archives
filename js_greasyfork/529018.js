// ==UserScript==
// @name         Universal Video Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Enhanced video downloader with console and broader platform support
// @author       usercromix & Grok
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/529018/Universal%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529018/Universal%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Platform detection patterns
    const platformPatterns = {
        youtube: /youtube\.com|youtu\.be/,
        twitter: /twitter\.com|x\.com/,
        facebook: /facebook\.com/,
        instagram: /instagram\.com/,
        tiktok: /tiktok\.com/,
        vimeo: /vimeo\.com/
    };

    // Create UI container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'video-downloader-ui';
    uiContainer.style.cssText = `
        position: fixed;
        z-index: 9999;
        background: linear-gradient(135deg, #2b2d42, #8d99ae);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        cursor: move;
        user-select: none;
        top: 20px;
        right: 20px;
        font-family: Arial, sans-serif;
        transition: all 0.3s ease;
        width: 250px;
    `;

    // Create console
    const consoleDiv = document.createElement('div');
    consoleDiv.style.cssText = `
        background: #1e1e1e;
        color: #00ff00;
        padding: 10px;
        border-radius: 5px;
        max-height: 150px;
        overflow-y: auto;
        font-family: monospace;
        font-size: 12px;
        margin-top: 10px;
    `;

    function logToConsole(message) {
        const entry = document.createElement('div');
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        consoleDiv.appendChild(entry);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    // Create UI elements
    const header = document.createElement('div');
    header.textContent = 'Video Downloader';
    header.style.cssText = `
        color: #edf2f4;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Video';
    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select Video';

    // Button styling
    [downloadButton, selectButton].forEach(button => {
        button.style.cssText = `
            background: linear-gradient(45deg, #ef233c, #d90429);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: transform 0.2s ease;
        `;
        button.addEventListener('mouseover', () => button.style.transform = 'scale(1.05)');
        button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');
    });

    // Append elements
    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(selectButton);
    uiContainer.appendChild(header);
    uiContainer.appendChild(buttonContainer);
    uiContainer.appendChild(consoleDiv);
    document.body.appendChild(uiContainer);

    // Draggable UI
    let isDragging = false;
    let initialX, initialY;
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = uiContainer.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            uiContainer.style.left = (e.clientX - initialX) + 'px';
            uiContainer.style.top = (e.clientY - initialY) + 'px';
            uiContainer.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => isDragging = false);

    // Platform-specific video detection
    function detectPlatform() {
        const url = window.location.href;
        for (const [platform, pattern] of Object.entries(platformPatterns)) {
            if (pattern.test(url)) return platform;
        }
        return 'generic';
    }

    // Enhanced video URL getters
    const videoGetters = {
        youtube: () => {
            const videoId = new URLSearchParams(window.location.search).get('v');
            return videoId ? `https://www.youtube.com/watch?v=${videoId}` : 
                   document.querySelector('meta[property="og:video:url"]')?.content;
        },
        twitter: () => document.querySelector('video[src*="video.twimg.com"]')?.src,
        facebook: () => document.querySelector('video[src*="fbcdn.net"]')?.src || 
                       document.querySelector('meta[property="og:video"]')?.content,
        instagram: () => document.querySelector('video[src*="instagram.com"]')?.src,
        tiktok: () => document.querySelector('video[src*="tiktokcdn.com"]')?.src,
        vimeo: () => document.querySelector('video[src*="vimeocdn.com"]')?.src
    };

    function detectVideo() {
        const platform = detectPlatform();
        const getter = videoGetters[platform] || (() => {
            const videos = document.getElementsByTagName('video');
            return videos.length > 0 ? (videos[0].src || videos[0].currentSrc) : null;
        });
        const url = getter();
        logToConsole(`Detected ${platform} video: ${url || 'none'}`);
        return url;
    }

    // Enhanced download with corruption prevention
    function downloadVideo(videoUrl) {
        if (!videoUrl) {
            logToConsole('Error: No video URL provided');
            alert('No video selected or detected!');
            return;
        }

        logToConsole(`Initiating download: ${videoUrl}`);
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: videoUrl,
            responseType: 'blob',
            headers: {
                'Accept': 'video/*',
                'Referer': window.location.href
            },
            onload: (response) => {
                try {
                    const blob = response.response;
                    if (blob.size === 0) {
                        throw new Error('Empty response');
                    }

                    const platform = detectPlatform();
                    const filename = `${platform}_${Date.now()}.mp4`;
                    const url = window.URL.createObjectURL(blob);
                    
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = filename;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    window.URL.revokeObjectURL(url);
                    
                    logToConsole(`Download completed: ${filename}`);
                } catch (error) {
                    logToConsole(`Download failed: ${error.message}`);
                    alert('Download failed: ' + error.message);
                }
            },
            onerror: (error) => {
                logToConsole(`Network error: ${error.statusText}`);
                alert('Network error occurred');
            }
        });
    }

    // Button handlers
    downloadButton.addEventListener('click', () => {
        const videoUrl = detectVideo();
        downloadVideo(videoUrl);
    });

    let isSelecting = false;
    selectButton.addEventListener('click', () => {
        if (!isSelecting) {
            isSelecting = true;
            selectButton.textContent = 'Click a Video';
            document.body.style.cursor = 'crosshair';
            logToConsole('Selection mode activated');

            const videoClickHandler = (e) => {
                const video = e.target.closest('video') || 
                            e.target.closest('a[href*=".mp4"]') || 
                            e.target.closest('a[href*=".webm"]');
                const videoUrl = video?.src || video?.currentSrc || video?.href || detectVideo();
                
                if (videoUrl) {
                    e.preventDefault();
                    downloadVideo(videoUrl);
                }
                cleanupSelection();
            };

            const cleanupSelection = () => {
                isSelecting = false;
                selectButton.textContent = 'Select Video';
                document.body.style.cursor = 'default';
                document.removeEventListener('click', videoClickHandler);
                logToConsole('Selection mode deactivated');
            };

            document.addEventListener('click', videoClickHandler, { once: true });
            setTimeout(cleanupSelection, 10000);
        }
    });

    // Initial console message
    logToConsole('Video Downloader initialized');

    // Anti-detection
    Object.defineProperty(window, 'videoDownloader', {
        value: undefined,
        writable: false,
        configurable: false
    });
})();