// ==UserScript==
// @name         Rumble Volume Control with Mouse Scroll Wheel + Overlay
// @namespace    violentmonkey-userscripts
// @version      1.5
// @description  Change volume on Rumble.com by scrolling over the video and show volume overlay
// @match        https://rumble.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540992/Rumble%20Volume%20Control%20with%20Mouse%20Scroll%20Wheel%20%2B%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/540992/Rumble%20Volume%20Control%20with%20Mouse%20Scroll%20Wheel%20%2B%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VOLUME_STEP = 0.05;                // 5% volume change per scroll
    const REVERSE_SCROLL_DIRECTION = true;   // true = normal PC scroll, false = natural/macOS
    const OVERLAY_TIMEOUT = 1500;            // ms before overlay fades out
    const VOLUME_KEY = 'rumble_volume_memory';

    let overlayElement = null;
    let overlayTimeoutId = null;

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function saveVolume(volume) {
        localStorage.setItem(VOLUME_KEY, volume.toString());
    }

    function loadVolume() {
        const v = parseFloat(localStorage.getItem(VOLUME_KEY));
        // Default to 0.5 (50%) if nothing is saved
        return isNaN(v) ? 0.5 : clamp(v, 0, 1);
    }

    function createOverlay() {
        if (overlayElement) return;

        overlayElement = document.createElement('div');
        overlayElement.style.position = 'fixed';
        overlayElement.style.top = '110px';
        overlayElement.style.left = '110px';
        overlayElement.style.padding = '5px 10px';
        overlayElement.style.background = 'rgba(0, 0, 0, 0.7)';
        overlayElement.style.color = '#fff';
        overlayElement.style.fontSize = '14px';
        overlayElement.style.borderRadius = '4px';
        overlayElement.style.zIndex = '9999';
        overlayElement.style.transition = 'opacity 0.4s ease';
        overlayElement.style.opacity = '0';
        overlayElement.style.pointerEvents = 'none';
        document.body.appendChild(overlayElement);
    }

    function showOverlay(text) {
        createOverlay();
        overlayElement.textContent = text;
        overlayElement.style.opacity = '1';

        if (overlayTimeoutId) clearTimeout(overlayTimeoutId);
        overlayTimeoutId = setTimeout(() => {
            overlayElement.style.opacity = '0';
        }, OVERLAY_TIMEOUT);
    }

    function onWheelVolumeAdjust(e) {
        if (!e.target || e.target.tagName !== 'VIDEO') return;
        e.preventDefault();

        const video = e.target;
        const delta = e.deltaY * (REVERSE_SCROLL_DIRECTION ? -1 : 1);

        let newVolume = video.volume;
        if (delta > 0) {
            newVolume -= VOLUME_STEP;
        } else if (delta < 0) {
            newVolume += VOLUME_STEP;
        }

        newVolume = clamp(newVolume, 0, 1);

        // If user scrolls up (volume > 0), ensure we unmute
        if (newVolume > 0 && video.muted) {
            video.muted = false;
        }

        video.volume = newVolume;
        // Some players use defaultVolume to reset state
        video.defaultVolume = newVolume;
        video.dispatchEvent(new Event('volumechange', { bubbles: true }));

        saveVolume(newVolume);
        showOverlay(`Volume: ${Math.round(newVolume * 100)}%`);
    }

    function onMiddleClick(e) {
        if (!e.target || e.target.tagName !== 'VIDEO') return;
        if (e.button !== 1) return; // middle click only
        e.preventDefault();

        const video = e.target;
        video.muted = !video.muted;
        showOverlay(video.muted ? 'Muted' : `Unmuted (${Math.round(video.volume * 100)}%)`);
    }

    /**
     * Applies the saved volume to the video element.
     * Ensures mute state is handled correctly.
     */
    function applySavedVolume(video) {
        const savedVolume = loadVolume();
        video.volume = savedVolume;

        // If saved volume is greater than 0, force unmute
        if (savedVolume > 0) {
            video.muted = false;
        } else {
            video.muted = true;
        }
    }

    function addVolumeControl(video) {
        if (video.dataset.rumbleVolumeAttached) return;

        video.addEventListener('wheel', onWheelVolumeAdjust, { passive: false });
        video.addEventListener('mousedown', onMiddleClick, true);

        // 1. Apply immediately upon detection
        applySavedVolume(video);

        // 2. Apply again when metadata loads (Rumble player often resets volume here)
        video.addEventListener('loadedmetadata', () => {
            applySavedVolume(video);
        });

        // 3. Apply one last time when playback starts to override any autoplay mute policies
        video.addEventListener('play', () => {
            applySavedVolume(video);
        }, { once: true }); // Only need to do this on the very first play

        video.dataset.rumbleVolumeAttached = 'true';
    }

    function observeVideos() {
        // Check existing videos
        document.querySelectorAll('video').forEach(addVolumeControl);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    // Check if node is video or contains video
                    if (node.tagName === 'VIDEO') {
                        addVolumeControl(node);
                    } else if (node.nodeType === 1 && node.querySelectorAll) { // Ensure element node
                        node.querySelectorAll('video').forEach(addVolumeControl);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        observeVideos();
    } else {
        window.addEventListener('DOMContentLoaded', observeVideos);
    }
})();