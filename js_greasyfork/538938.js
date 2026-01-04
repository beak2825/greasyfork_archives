// ==UserScript==
// @name         Hide YouTube Shorts Overlay
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Toggle the overlay in YouTube Shorts videos.
// @author       LussyPicker
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538938/Hide%20YouTube%20Shorts%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/538938/Hide%20YouTube%20Shorts%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let overlayEl = null;
    let toggleButton = null;
    let overlayHidden = true;
    const toggleButtonId = 'shorts-overlay-toggle-button';

    function updateOverlayVisibility() {
        if (overlayEl) {
            overlayEl.style.display = overlayHidden ? 'none' : '';
        }
        if (toggleButton) {
            toggleButton.textContent = overlayHidden ? 'Show Overlay' : 'Hide Overlay';
        }
    }

    function toggleOverlay() {
        overlayHidden = !overlayHidden;
        updateOverlayVisibility();
    }

    function addToggleButton() {
        if (document.getElementById(toggleButtonId)) return;

        const container = document.querySelector('ytd-reel-video-renderer');
        if (!container) return;

        toggleButton = document.createElement('button');
        toggleButton.id = toggleButtonId;
        toggleButton.textContent = 'Show Overlay';

        Object.assign(toggleButton.style, {
            position: 'absolute',
            top: '500px',
            left: '-150px',
            zIndex: '9999',
            padding: '10px 14px',
            backgroundColor: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
        });

        toggleButton.addEventListener('click', toggleOverlay);
        container.appendChild(toggleButton);
    }

    function waitForShortsElements(callback, maxRetries = 30) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            const overlay = document.querySelector('ytd-reel-player-overlay-renderer');
            const container = document.querySelector('ytd-reel-video-renderer');

            if (overlay && container) {
                clearInterval(checkInterval);
                callback(overlay, container);
            } else if (++attempts >= maxRetries) {
                clearInterval(checkInterval);
            }
        }, 500);
    }

    function init() {
        waitForShortsElements((overlay, container) => {
            overlayEl = overlay;
            updateOverlayVisibility();
            addToggleButton();
        });
    }

    // Initial run
    init();

    // Trigger again when YouTube navigates internally
    window.addEventListener('yt-navigate-finish', () => {
        if (window.location.href.includes('/shorts/')) {
            init();
        }
    });

})();