// ==UserScript==
// @name         Android Double Tap to Seek Video
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds double-tap seeking to Firefox android or any other browser efficiently
// @author       Faisal Bhuiyan
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518800/Android%20Double%20Tap%20to%20Seek%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/518800/Android%20Double%20Tap%20to%20Seek%20Video.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastTap = 0;
    const DOUBLE_TAP_DELAY = 300;
    let overlayContainer = null;
    let isInFullscreen = false;
    let isPlaying = false;
    const CONTROLS_SAFE_ZONE = 80; // Height in pixels for controls area
    const SIDE_ZONE_WIDTH = 25; // Width percentage for side touch areas
    let toastTimeout = null;
    let lastTouchTime = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;

    // Get current domain
    function getCurrentDomain() {
        return window.location.hostname;
    }

    // Check if current site is blacklisted
    function isBlacklisted() {
        const blacklist = GM_getValue('blacklistedSites', []);
        return blacklist.includes(getCurrentDomain());
    }

    // Toggle blacklist for current site
    function toggleBlacklist() {
        const domain = getCurrentDomain();
        const blacklist = GM_getValue('blacklistedSites', []);
        const isCurrentlyBlacklisted = blacklist.includes(domain);

        if (isCurrentlyBlacklisted) {
            const newBlacklist = blacklist.filter(site => site !== domain);
            GM_setValue('blacklistedSites', newBlacklist);
            showToast('Site removed from blacklist');
        } else {
            blacklist.push(domain);
            GM_setValue('blacklistedSites', blacklist);
            showToast('Site added to blacklist');
            removeExistingOverlays();
        }
    }

    // Register menu command
    GM_registerMenuCommand('Toggle Blacklist for Current Site', toggleBlacklist);

    function showToast(message) {
        let toast = document.getElementById('video-seeker-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'video-seeker-toast';
            toast.style.cssText = `
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                background: rgba(0, 0, 0, 0.7) !important;
                color: white !important;
                padding: 10px 20px !important;
                border-radius: 5px !important;
                z-index: 2147483647 !important;
                pointer-events: none !important;
                transition: opacity 0.3s !important;
                font-family: Arial, sans-serif !important;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }

    function removeExistingOverlays() {
        const existingOverlays = document.querySelectorAll('#video-overlay-container');
        existingOverlays.forEach(overlay => overlay.remove());
        overlayContainer = null;
    }

    function createOverlayContainer() {
        removeExistingOverlays();

        const container = document.createElement('div');
        container.id = 'video-overlay-container';

        container.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: ${CONTROLS_SAFE_ZONE}px !important;
            width: 100% !important;
            height: calc(100% - ${CONTROLS_SAFE_ZONE}px) !important;
            pointer-events: auto !important;
            z-index: 2147483647 !important;
            background: transparent !important;
            touch-action: manipulation !important;
            display: ${isPlaying ? 'block' : 'none'} !important;
        `;

        const touchAreas = ['left', 'right'].map((position) => {
            const area = document.createElement('div');
            area.id = `touch-area-${position}`;

            area.style.cssText = `
                position: absolute !important;
                ${position}: 0 !important;
                top: 0 !important;
                width: ${SIDE_ZONE_WIDTH}% !important;
                height: 100% !important;
                pointer-events: auto !important;
                background: rgba(255, 255, 255, 0.01) !important;
                z-index: 2147483647 !important;
                touch-action: manipulation !important;
            `;

            function handleTouch(e) {
                try {
                    if (!isPlaying || !isInFullscreen || isBlacklisted()) return;

                    const currentTime = new Date().getTime();
                    const touch = e.touches && e.touches[0];

                    if (!touch && e.type === 'touchstart') return;

                    if (e.type === 'touchstart') {
                        const tapLength = currentTime - lastTap;
                        const touchX = touch.clientX;
                        const touchY = touch.clientY;

                        // Check if this is a double tap (time and position)
                        const isDoubleTap = tapLength < DOUBLE_TAP_DELAY &&
                            Math.abs(touchX - lastTouchX) < 30 &&
                            Math.abs(touchY - lastTouchY) < 30;

                        if (isDoubleTap) {
                            const video = document.querySelector('video');
                            if (video) {
                                const seekAmount = position === 'right' ? 10 : -10;

                                if (video.player && typeof video.player.currentTime === 'function') {
                                    video.player.currentTime(video.player.currentTime() + seekAmount);
                                } else {
                                    video.currentTime += seekAmount;
                                }

                                showToast(`${seekAmount > 0 ? '+' : ''}${seekAmount} seconds`);
                            }
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        // Update last touch info
                        lastTap = currentTime;
                        lastTouchX = touchX;
                        lastTouchY = touchY;
                    }
                } catch (err) {
                    console.log('Touch handler error:', err);
                }
            }

            ['touchstart', 'touchend'].forEach(eventType => {
                area.addEventListener(eventType, handleTouch, {
                    passive: false,
                    capture: true
                });
            });

            return area;
        });

        touchAreas.forEach(area => container.appendChild(area));
        return container;
    }

    function updateOverlayVisibility() {
        if (overlayContainer) {
            overlayContainer.style.display = (isInFullscreen && isPlaying) ? 'block' : 'none';
        }
    }

    function attachOverlay() {
        const fullscreenElement =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.querySelector('.video-js.vjs-fullscreen') ||
            document.querySelector('video');

        if (fullscreenElement && isInFullscreen) {
            overlayContainer = createOverlayContainer();

            const container =
                fullscreenElement.querySelector('.vjs-tech-container') ||
                fullscreenElement.querySelector('.video-js') ||
                fullscreenElement;

            if (container) {
                container.appendChild(overlayContainer);
                updateOverlayVisibility();
            }
        }
    }

    function handleFullscreenChange() {
        const isNowFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.querySelector('.video-js.vjs-fullscreen')
        );

        if (isNowFullscreen && !isInFullscreen) {
            isInFullscreen = true;
            setTimeout(attachOverlay, 100);
            showToast('Double-tap controls enabled');
        } else if (!isNowFullscreen && isInFullscreen) {
            isInFullscreen = false;
            removeExistingOverlays();
            showToast('Double-tap controls disabled');
        }
    }

    function handlePlayPause(video) {
        isPlaying = !(video.paused || video.ended || video.seeking || video.readyState < 3);
        updateOverlayVisibility();
    }

    // Cleanup function for removing events
    function cleanup() {
        removeExistingOverlays();
        isInFullscreen = false;
        isPlaying = false;
    }

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange, true);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange, true);

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanup();
        }
    });

    // Watch for video elements
    const observer = new MutationObserver((mutations, obs) => {
        const video = document.querySelector('video');
        if (video) {
            // Listen for all playback state changes
            ['play', 'pause', 'seeking', 'seeked', 'waiting', 'playing'].forEach(eventType => {
                video.addEventListener(eventType, () => handlePlayPause(video));
            });

            video.addEventListener('webkitbeginfullscreen', () => {
                isInFullscreen = true;
                setTimeout(attachOverlay, 100);
            });

            video.addEventListener('webkitendfullscreen', () => {
                cleanup();
            });

            // Monitor video.js fullscreen class changes
            const videoJs = document.querySelector('.video-js');
            if (videoJs) {
                const classObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const isNowFullscreen = videoJs.classList.contains('vjs-fullscreen');
                            if (isNowFullscreen !== isInFullscreen) {
                                handleFullscreenChange();
                            }
                        }
                    });
                });

                classObserver.observe(videoJs, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }

            // Initial state check
            handlePlayPause(video);

            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
