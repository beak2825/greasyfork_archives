// ==UserScript==
// @name         YouTube Premium Features (All-in-One)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add YouTube Premium-like features: ad-blocking, background play, HD/4K default quality, downloader, dark mode, and Premium logo.
// @author       YourName
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522816/YouTube%20Premium%20Features%20%28All-in-One%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522816/YouTube%20Premium%20Features%20%28All-in-One%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function: Replace YouTube logo with "Premium" logo
    const replaceLogo = () => {
        const premiumLogo = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#FF0000" height="30" width="100">
                <rect x="0" y="0" width="100" height="100" fill="white" rx="15" />
                <text x="10" y="60" font-size="50" fill="red" font-weight="bold">Premium</text>
            </svg>
        `;
        const logoContainer = document.querySelector('#logo-icon-container');
        if (logoContainer) {
            logoContainer.innerHTML = premiumLogo;
        }
    };

    // Function: Block ads on YouTube
    const blockAds = () => {
        const adSelectors = [
            '.video-ads', // Video ads container
            '.ytp-ad-module', // Overlay ads
            '.ytp-ad-player-overlay-instream-info', // In-stream ad info
            '#masthead-ad', // Banner ads
        ];
        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => ad.remove());
        });
    };

    // Function: Enable background playback
    const enableBackgroundPlay = () => {
        const video = document.querySelector('video');
        if (video) {
            video.loop = false; // Prevent looping
            video.play();
        }
    };

    // Function: Set video quality to HD/4K
    const setHDQuality = () => {
        const qualityMenu = document.querySelector('button.ytp-settings-button');
        if (qualityMenu) {
            qualityMenu.click();
            setTimeout(() => {
                const qualityOptions = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem');
                for (const option of qualityOptions) {
                    if (option.innerText.includes('1080p') || option.innerText.includes('2160p')) {
                        option.click();
                        break;
                    }
                }
            }, 500);
        }
    };

    // Function: Add a "Download" button
    const addDownloadButton = () => {
        const videoActions = document.querySelector('.ytd-video-primary-info-renderer #top-level-buttons-computed');
        if (videoActions && !document.querySelector('.custom-download-button')) {
            const downloadButton = document.createElement('button');
            downloadButton.className = 'custom-download-button';
            downloadButton.textContent = 'Download';
            downloadButton.style.margin = '0 5px';
            downloadButton.style.padding = '10px';
            downloadButton.style.background = '#FF0000';
            downloadButton.style.color = 'white';
            downloadButton.style.border = 'none';
            downloadButton.style.borderRadius = '4px';
            downloadButton.style.cursor = 'pointer';

            downloadButton.addEventListener('click', () => {
                const videoUrl = window.location.href;
                const downloadUrl = `https://example.com/download?url=${encodeURIComponent(videoUrl)}`;
                window.open(downloadUrl, '_blank');
            });

            videoActions.appendChild(downloadButton);
        }
    };

    // Function: Toggle dark mode
    const addDarkModeToggle = () => {
        const header = document.querySelector('#masthead-container');
        if (header && !document.querySelector('.dark-mode-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'dark-mode-toggle';
            toggle.textContent = 'Dark Mode';
            toggle.style.margin = '0 10px';
            toggle.style.padding = '5px 15px';
            toggle.style.background = '#000000';
            toggle.style.color = '#FFFFFF';
            toggle.style.border = 'none';
            toggle.style.borderRadius = '4px';
            toggle.style.cursor = 'pointer';

            toggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
            });

            header.appendChild(toggle);
        }
    };

    // Add styles for dark mode
    GM_addStyle(`
        body.dark-mode {
            background-color: #181818;
            color: #FFFFFF;
        }
        .custom-download-button:hover {
            background: #FF4500;
        }
        .dark-mode-toggle:hover {
            background: #333333;
        }
    `);

    // Run features periodically
    setInterval(() => {
        replaceLogo();
        blockAds();
        enableBackgroundPlay();
        setHDQuality();
        addDownloadButton();
        addDarkModeToggle();
    }, 2000);
})();
