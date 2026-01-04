// ==UserScript==
// @name         Coursera Screenshot Downloader
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @version      0.3
// @description  Add screenshot functionality to all videos with toggle options
// @author       shiquda
// @match        https://www.coursera.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528107/Coursera%20Screenshot%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/528107/Coursera%20Screenshot%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Camera icon SVG
    const cameraSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
</svg>`;

    // Check mark SVG
    const checkSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="M20.285 6.709a1 1 0 0 0-1.414-1.414L9 15.162 5.129 11.291a1 1 0 1 0-1.414 1.414l4.243 4.242a1 1 0 0 0 1.414 0l10.607-10.607z"/>
</svg>`;

    // Screenshot settings
    let settings = {
        download: true,
        copyToClipboard: false
    };

    // Load settings from storage
    function loadSettings() {
        const savedSettings = GM_getValue('screenshotSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            console.log('Loaded settings:', settings);
        } else {
            console.log('No saved settings found, using defaults.');
        }
    }

    // Save settings to storage
    function saveSettings() {
        GM_setValue('screenshotSettings', JSON.stringify(settings));
        console.log('Settings saved:', settings);
    }

    // Register menu commands for toggling settings
    function registerMenuCommands() {
        GM_registerMenuCommand(`Download ${settings.download ? '✅' : '❌'}`, () => {
            settings.download = !settings.download;
            saveSettings();
            console.log(`Download setting toggled to ${settings.download}`);
            location.reload();
        });

        GM_registerMenuCommand(`Copy to Clipboard ${settings.copyToClipboard ? '✅' : '❌'}`, () => {
            settings.copyToClipboard = !settings.copyToClipboard;
            saveSettings();
            console.log(`Copy to Clipboard setting toggled to ${settings.copyToClipboard}`);
            location.reload();
        });
    }

    // Function to replace invalid filename characters with underscores
    function sanitizeFilename(filename) {
        return filename.replace(/[<>:"/\\|?*]+/g, '_');
    }

    // Initialize video elements
    function initVideos() {
        // Get all video elements
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            // Avoid adding button multiple times
            if (video.dataset.screenshotAdded) return;
            video.dataset.screenshotAdded = "true";

            // Create screenshot button
            const btn = document.createElement('button');
            btn.innerHTML = cameraSVG;
            btn.style.cssText = `
                bottom: 40px;
                right: 10px;
                background: rgba(0,0,0,0.5);
                border: none;
                border-radius: 4px;
                padding: 5px;
                cursor: pointer;
                color: white;
                z-index: 9999;
                transition: background 0.3s;
            `;

            // Add hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(0,0,0,0.7)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0,0,0,0.5)';
            });

            // Add button to video container
            const container = video.parentNode.querySelector('.icon-container') || video.parentNode;
            container.style.position = 'relative';
            container.appendChild(btn);

            // Add click event
            btn.addEventListener('click', async () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);

                    const currentTime = Math.floor(video.currentTime);
                    const pageTitle = document.title;
                    const sanitizedTitle = sanitizeFilename(pageTitle);

                    // Download image if enabled
                    if (settings.download) {
                        const link = document.createElement('a');
                        link.download = `${sanitizedTitle}_${currentTime}s.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                        console.log('Screenshot downloaded.');
                    }

                    // Copy to clipboard if enabled
                    if (settings.copyToClipboard) {
                        canvas.toBlob(async (blob) => {
                            try {
                                await navigator.clipboard.write([
                                    new ClipboardItem({ 'image/png': blob })
                                ]);
                                console.log('Screenshot copied to clipboard.');

                                // Change button to check mark
                                const originalHTML = btn.innerHTML;
                                btn.innerHTML = checkSVG;

                                // Disable button to prevent multiple clicks
                                btn.disabled = true;

                                // Revert back after 2 seconds
                                setTimeout(() => {
                                    btn.innerHTML = originalHTML;
                                    btn.disabled = false;
                                }, 1000);
                            } catch (err) {
                                console.error('Failed to copy to clipboard:', err);
                            }
                        }, 'image/png');
                    }
                } catch (error) {
                    console.error('Screenshot failed:', error);
                }
            });
        });
    }

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(mutations => {
        if (document.querySelector('video')) initVideos();
    });

    // Start observing the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Load settings, register menu commands, and initialize
    loadSettings();
    registerMenuCommands();
    initVideos();
})();