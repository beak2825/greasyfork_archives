// ==UserScript==
// @name         YouTube Ad Skipper
// @version      1.6
// @description  Simple ad skip button for YouTube with enhanced SPA support
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @author       anassk
// @namespace https://greasyfork.org/users/1422975
// @downloadURL https://update.greasyfork.org/scripts/524779/YouTube%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/524779/YouTube%20Ad%20Skipper.meta.js
// ==/UserScript==
//



(function() {
    'use strict';

    let currentVideoId = null;
    let storedTime = 0;
    let initAttempts = 0;
    const MAX_ATTEMPTS = 20;

    const createSkipButton = () => {
        const skipButton = document.createElement('button');
        skipButton.innerHTML = '>';
        skipButton.classList.add('skip-button');
        skipButton.style.cssText = `
            position: absolute;
            bottom: 70px;
            right: 5px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        return skipButton;
    };

    const reloadVideo = () => {
        const player = document.querySelector('video');
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (player && videoId) {
            storedTime = player.currentTime;
            const moviePlayer = document.getElementById('movie_player');
            if (moviePlayer) {
                moviePlayer.loadVideoById(videoId);
                const setStoredTime = () => {
                    moviePlayer.seekTo(storedTime, true);
                    player.currentTime = storedTime;
                };

                const checkAndSetTime = setInterval(() => {
                    if (player.readyState >= 3) {
                        setStoredTime();
                        clearInterval(checkAndSetTime);
                    }
                }, 50);
            }
        }
    };

    const waitForElement = (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    };

    const initializeButton = async () => {
        if (initAttempts >= MAX_ATTEMPTS) {
            initAttempts = 0;
            return;
        }

        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId || videoId === currentVideoId) {
            return;
        }

        // Wait for both video and player container
        try {
            const player = await waitForElement('video');
            const playerContainer = await waitForElement('.html5-video-player');

            if (player && playerContainer) {
                // Remove any existing skip buttons
                document.querySelectorAll('.skip-button').forEach(btn => btn.remove());

                const skipButton = createSkipButton();
                skipButton.addEventListener('click', reloadVideo);
                playerContainer.appendChild(skipButton);
                currentVideoId = videoId;
                initAttempts = 0;
            }
        } catch (error) {
            initAttempts++;
            setTimeout(initializeButton, 250);
        }
    };

    // Style for hover effect
    GM_addStyle(`
        .skip-button:hover {
            background: rgba(0, 0, 0, 0.9) !important;
        }
    `);

    // Multiple initialization triggers
    const initializeTriggers = () => {
        initializeButton();

        // Watch for URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                currentVideoId = null;
                setTimeout(initializeButton, 100);
            }
        }).observe(document, { subtree: true, childList: true });

        // YouTube specific events
        window.addEventListener('yt-navigate-finish', () => {
            currentVideoId = null;
            setTimeout(initializeButton, 100);
        });

        // Regular page events
        window.addEventListener('load', initializeButton);
        document.addEventListener('DOMContentLoaded', initializeButton);
    };

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTriggers);
    } else {
        initializeTriggers();
    }
})();
