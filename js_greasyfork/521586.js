// ==UserScript==
// @name         Neura
// @namespace    .gg/Neura
// @version      4.0
// @description  https://discord.gg/aeXXdqEKxw
// @author       Kan
// @license      MIT
// @match        https://*.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521586/Neura.user.js
// @updateURL https://update.greasyfork.org/scripts/521586/Neura.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect to Discord server after installation (one-time)
    if (!localStorage.getItem('neura_redirected')) {
        localStorage.setItem('neura_redirected', true);
        window.location.href = 'https://discord.gg/aeXXdqEKxw';
    }

    // Add "Powered by Neura" under the YouTube logo
    function addPoweredByNeura() {
        const logoSelector = '#logo';
        const poweredByText = document.createElement('div');
        poweredByText.textContent = 'Powered by Neura';
        poweredByText.style.fontSize = '12px';
        poweredByText.style.color = '#888';
        poweredByText.style.marginTop = '4px';
        poweredByText.style.textAlign = 'center';

        const logo = document.querySelector(logoSelector);
        if (logo && !document.querySelector('#poweredByNeura')) {
            poweredByText.id = 'poweredByNeura';
            logo.parentNode.appendChild(poweredByText);
        }
    }

    // Add "Download by Neura" button
    function addDownloadButton() {
        const downloadBaseURL = "//yt1s.com/youtube-to-mp3?q=";
        const buttonID = "neuraDownloadButton";
        const buttonContainer = "#owner";

        GM_addStyle(`
            #${buttonID} {
                background-color: #6A0DAD;
                color: white;
                border: none;
                margin-left: 8px;
                padding: 0 16px;
                border-radius: 18px;
                font-size: 14px;
                font-family: Roboto, sans-serif;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                height: 36px;
                cursor: pointer;
            }
            #${buttonID}:hover {
                background-color: #5B0BA0;
            }
        `);

        function observeElement(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                }
                const observer = new MutationObserver(() => {
                    if (document.querySelector(selector)) {
                        resolve(document.querySelector(selector));
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }

        function createButton() {
            observeElement(buttonContainer).then(container => {
                if (!container || document.querySelector(`#${buttonID}`)) return;

                const downloadButton = document.createElement('a');
                downloadButton.id = buttonID;
                downloadButton.href = downloadBaseURL + encodeURIComponent(window.location);
                downloadButton.target = '_blank';
                downloadButton.textContent = 'Download by Neura';

                container.appendChild(downloadButton);
            });
        }

        function updateButtonURL() {
            const button = document.querySelector(`#${buttonID}`);
            if (button) button.href = downloadBaseURL + encodeURIComponent(window.location);
        }

        let buttonAdded = false;
        function checkAndAddButton() {
            if (window.location.pathname === '/watch' && !buttonAdded) {
                createButton();
                buttonAdded = true;
                setTimeout(updateButtonURL, 2000);
            }
        }

        window.addEventListener("yt-navigate-finish", () => {
            buttonAdded = false;
            checkAndAddButton();
        });

        checkAndAddButton();
    }

    // Make YouTube menu purple
    function styleYouTubeMenu() {
        GM_addStyle(`
            #guide {
                background-color: #6A0DAD !important;
            }
        `);
    }

    // Adblocker functionality
    function blockAds() {
        const observer = new MutationObserver(() => {
            const adElements = document.querySelectorAll(
                "ytd-ad-slot-renderer, #player-ads, .ytp-ad-overlay-container, .ytp-ad-module"
            );
            adElements.forEach(el => el.remove());

            const skipButton = document.querySelector(".ytp-ad-skip-button");
            if (skipButton) {
                skipButton.click();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Enable HD premium functionality
    function enableHDPremium() {
        const videoObserver = new MutationObserver(() => {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.setAttribute('playsinline', 'true');
                videoElement.setAttribute('autoplay', 'true');
                videoElement.playbackRate = 1.0;
            }
        });

        videoObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize all features
    function initializeNeura() {
        addPoweredByNeura();
        addDownloadButton();
        styleYouTubeMenu();
        blockAds();
        enableHDPremium();
    }

    // Run script on load
    initializeNeura();
    window.addEventListener('yt-navigate-finish', initializeNeura);
})();
