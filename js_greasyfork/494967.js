// ==UserScript==
// @name         HTML5 Video Player Speed Control
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Control the playback speed of HTML5 video players with keyboard shortcuts.
// @author       JJJ
// @match        *://*/*
// @icon         https://logos-download.com/wp-content/uploads/2017/07/HTML5_logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494967/HTML5%20Video%20Player%20Speed%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/494967/HTML5%20Video%20Player%20Speed%20Control.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Active video element
    let video = null;
    // Use localStorage to persist playback rate across reloads and videos
    const STORAGE_KEY = 'tm_html5_video_speed';
    let playbackRate = parseFloat(localStorage.getItem(STORAGE_KEY)) || 1.0; // Current playback rate
    let previousPlaybackRate = playbackRate; // Previous rate for toggling

    // Speed indicator overlay setup
    const speedIndicator = document.createElement('div');
    speedIndicator.style.position = 'absolute';
    speedIndicator.style.top = '10px';
    speedIndicator.style.left = '10px';
    speedIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    speedIndicator.style.color = '#fff';
    speedIndicator.style.padding = '5px';
    speedIndicator.style.fontFamily = 'Arial, sans-serif';
    speedIndicator.style.fontSize = '12px';
    speedIndicator.style.zIndex = '9999';
    speedIndicator.style.pointerEvents = 'none'; // Let clicks pass through
    speedIndicator.style.userSelect = 'none';    // No text selection
    speedIndicator.style.webkitUserSelect = 'none';
    speedIndicator.style.opacity = '0.6';

    // Show current speed and fade out after 2s
    function updateSpeedIndicator() {
        if (!video) return;
        playbackRate = video.playbackRate;
        // Persist the current playback rate
        localStorage.setItem(STORAGE_KEY, playbackRate);
        speedIndicator.textContent = `Speed: ${playbackRate.toFixed(1)}x`;
        speedIndicator.style.opacity = '1';
        clearTimeout(speedIndicator.hideTimeout);
        speedIndicator.hideTimeout = setTimeout(() => {
            speedIndicator.style.opacity = '0.6';
        }, 2000);
    }

    // Place indicator as fixed in fullscreen, absolute otherwise
    function updateSpeedIndicatorPosition() {
        if (!video) return;
        const isFullscreen = document.fullscreenElement === video ||
            document.webkitFullscreenElement === video ||
            video.webkitDisplayingFullscreen === true ||
            (video.offsetWidth === window.innerWidth && video.offsetHeight === window.innerHeight);
        speedIndicator.style.position = isFullscreen ? 'fixed' : 'absolute';
    }

    // Toggle between a fixed speed and previous speed
    function toggleSpeed(fixedSpeed) {
        if (playbackRate !== fixedSpeed) {
            previousPlaybackRate = playbackRate;
            playbackRate = fixedSpeed;
        } else {
            playbackRate = previousPlaybackRate;
        }
        video.playbackRate = playbackRate;
        updateSpeedIndicator();
    }

    // Increase speed by 0.1
    function speedUpVideo() {
        previousPlaybackRate = playbackRate;
        playbackRate = video.playbackRate + 0.1;
        video.playbackRate = playbackRate;
        updateSpeedIndicator();
    }

    // Decrease speed by 0.1
    function slowDownVideo() {
        previousPlaybackRate = playbackRate;
        playbackRate = video.playbackRate - 0.1;
        video.playbackRate = playbackRate;
        updateSpeedIndicator();
    }

    // Toggle 1.5x speed
    function setFastSpeed() { toggleSpeed(1.5); }
    // Toggle 1.8x speed
    function setFasterSpeed() { toggleSpeed(1.8); }
    // Toggle/reset 1.0x speed
    function resetSpeed() { toggleSpeed(1.0); }

    // Show or hide the speed indicator
    function toggleSpeedIndicator() {
        speedIndicator.style.display = speedIndicator.style.display === 'none' ? 'block' : 'none';
    }

    // Attach indicator and listeners to a video element
    function setupVideo(v) {
        if (video === v) return;
        video = v;
        // Always use the persisted playbackRate for new videos
        playbackRate = parseFloat(localStorage.getItem(STORAGE_KEY)) || 1.0;
        previousPlaybackRate = playbackRate;
        const container = video.parentElement;
        if (container && !container.contains(speedIndicator)) {
            container.style.position = 'relative';
            container.appendChild(speedIndicator);
        }
        updateSpeedIndicator();
        updateSpeedIndicatorPosition();
        video.addEventListener('ratechange', updateSpeedIndicator);
        window.addEventListener('resize', updateSpeedIndicatorPosition);

        // Helper to force playback rate and update indicator
        function forcePlaybackRate() {
            video.playbackRate = playbackRate;
            updateSpeedIndicator();
        }

        // Always enforce playback rate on these events
        video.addEventListener('canplay', forcePlaybackRate);
        video.addEventListener('play', forcePlaybackRate);
        video.addEventListener('playing', forcePlaybackRate);
        video.addEventListener('loadedmetadata', forcePlaybackRate);

        // Set initial playback rate
        if (video.readyState < 3) {
            video.addEventListener('canplay', forcePlaybackRate, { once: true });
        } else {
            forcePlaybackRate();
        }
    }

    // Watch for new video elements in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.tagName === 'VIDEO') {
                        setupVideo(node);
                    } else {
                        const vid = node.querySelector && node.querySelector('video');
                        if (vid) setupVideo(vid);
                    }
                }
            });
        });
    });
    // Start observing for video elements in the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Attach to first video on page load
    window.addEventListener('load', () => {
        const vid = document.querySelector('video');
        if (vid) setupVideo(vid);
    });

    // Keyboard shortcuts for speed and indicator
    document.addEventListener('keydown', (event) => {
        // Ignore if typing in input, textarea, or contenteditable
        const tag = event.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return;
        const key = event.key.toLowerCase();
        switch (key) {
            case 'd': speedUpVideo(); break;      // +0.1x
            case 's': slowDownVideo(); break;     // -0.1x
            case 'g': setFastSpeed(); break;      // 1.5x toggle
            case 'h': setFasterSpeed(); break;    // 1.8x toggle
            case 'r': resetSpeed(); break;        // 1.0x toggle/reset
            case 'v': toggleSpeedIndicator(); break; // Show/hide
        }
    });
})();
