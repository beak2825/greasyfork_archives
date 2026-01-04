// ==UserScript==
// @name         Fullscreen Button for fishtank.live
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a fullscreen button to the fishtank.live video player.
// @author       Flowscript
// @match        https://www.fishtank.live/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499612/Fullscreen%20Button%20for%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/499612/Fullscreen%20Button%20for%20fishtanklive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoSelectors = [
        '.livepeer-video-player_livepeer-video-player__NRXYi',
        '.livepeer-video-player_livepeer-video-player__NRXYi'
    ];

    const videoSelector = '#livepeer-video-player video';
    const controlsContainerSelector = '.livepeer-video-player_controls__y36El';

    function toggleFullscreen(videoContainer, video) {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().then(() => {
                video.play();  // Ensure the video continues playing when entering fullscreen
            }).catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen().then(() => {
                video.play();  // Ensure the video continues playing when exiting fullscreen
            });
        }
    }

    function addFullscreenButton(videoContainer, video, controlsContainer) {
        // Check if fullscreen button already exists to avoid duplicates
        if (controlsContainer.querySelector('.custom-fullscreen-button')) {
            return;
        }

        // Create fullscreen button
        const fullscreenButton = document.createElement('button');
        fullscreenButton.className = 'custom-fullscreen-button';
        fullscreenButton.innerHTML = `<div class="icon_icon__bDzMA"><svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M8 4v2H4v4H2V4a2 2 0 012-2h6v2H8zm8 0V2h6a2 2 0 012 2v6h-2V6h-4V4h-2zm0 16h2v-2h4v-4h2v6a2 2 0 01-2 2h-6v-2zM4 14H2v6a2 2 0 002 2h6v-2H4v-4H2v-2z" fill="currentColor"></path></svg></div>`;
        fullscreenButton.style.all = 'unset';
        fullscreenButton.style.cursor = 'pointer';
        fullscreenButton.style.display = 'flex';
        fullscreenButton.style.alignItems = 'center';
        fullscreenButton.style.justifyContent = 'center';
        fullscreenButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        fullscreenButton.style.padding = '4px';
        fullscreenButton.style.height = '25px';
        fullscreenButton.style.width = '25px';
        fullscreenButton.style.color = '#fff';
        fullscreenButton.style.pointerEvents = 'auto';
        fullscreenButton.style.position = 'absolute';
        fullscreenButton.style.bottom = '5px';
        fullscreenButton.style.right = '15px';
        fullscreenButton.style.zIndex = '1000';
        fullscreenButton.title = 'Fullscreen';

        // Add hover effect
        fullscreenButton.addEventListener('mouseenter', () => {
            fullscreenButton.style.color = '#f8ec94';
        });

        fullscreenButton.addEventListener('mouseleave', () => {
            fullscreenButton.style.color = '#fff';
        });

        fullscreenButton.addEventListener('click', () => {
            toggleFullscreen(videoContainer, video);
        });

        // Add the button to the controls container
        controlsContainer.appendChild(fullscreenButton);
    }

    function addCustomCSS() {
        // Check if the custom style already exists
        if (!document.querySelector('#custom-livepeer-style')) {
            const style = document.createElement('style');
            style.id = 'custom-livepeer-style';
            style.innerHTML = `
                div[class*="live-stream-clipping_live-stream-clipping__"] {
                    margin-bottom: 25px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function applyChanges() {
        videoSelectors.forEach(selector => {
            const videoContainer = document.querySelector(selector);
            const video = document.querySelector(videoSelector);
            const controlsContainer = document.querySelector(controlsContainerSelector);

            if (videoContainer && controlsContainer) {
                addFullscreenButton(videoContainer, video, controlsContainer);
                addCustomCSS();
            }
        });
    }

    function handleKeydown(event) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement.tagName === 'INPUT' ||
                               activeElement.tagName === 'TEXTAREA' ||
                               activeElement.isContentEditable;

        if (!isInputFocused && (event.key === 'f' || event.key === 'F')) {
            videoSelectors.forEach(selector => {
                const videoContainer = document.querySelector(selector);
                const video = document.querySelector(videoSelector);

                if (videoContainer && video) {
                    toggleFullscreen(videoContainer, video);
                }
            });
        }
    }

    document.addEventListener('keydown', handleKeydown);

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(applyChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial application
    applyChanges();

})();
