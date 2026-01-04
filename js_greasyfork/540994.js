// ==UserScript==
// @name         Odysee Volume Control with Mouse Scroll Wheel (Scroll + Overlay + Memory + Mute)
// @namespace    violentmonkey-userscripts
// @version      1.3
// @description  Scroll to adjust volume, middle-click to mute, with overlay + per-site memory on Odysee
// @match        https://odysee.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540994/Odysee%20Volume%20Control%20with%20Mouse%20Scroll%20Wheel%20%28Scroll%20%2B%20Overlay%20%2B%20Memory%20%2B%20Mute%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540994/Odysee%20Volume%20Control%20with%20Mouse%20Scroll%20Wheel%20%28Scroll%20%2B%20Overlay%20%2B%20Memory%20%2B%20Mute%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        VOLUME_STEP: 0.05,
        REVERSE_SCROLL: true,    // true for macOS natural or inverted scrolling, set it to false for Windows behavior
        DEFAULT_VOLUME: 0.5,
        OVERLAY_TIMEOUT: 1500,
        OVERLAY_POSITIONS: {
            'odysee.com': { top: '110px', left: '110px' },
            // 'odysee.com': { bottom: '10px', right: '10px' },
        }
    };

    const hostname = location.hostname;
    const volumeKey = `volumeMemory_${hostname}`;
    let overlay = null;
    let overlayTimeoutId = null;

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function createOverlay() {
        if (overlay) return;

        overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            padding: '5px 10px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '4px',
            zIndex: '9999',
            transition: 'opacity 0.4s ease',
            opacity: '0',
            pointerEvents: 'none',
        });

        // Apply per-site overlay position or default to top-left
        const pos = CONFIG.OVERLAY_POSITIONS[hostname] || { top: '10px', left: '10px' };
        Object.assign(overlay.style, pos);

        document.body.appendChild(overlay);
    }

    function showOverlay(text) {
        createOverlay();
        overlay.textContent = text;
        overlay.style.opacity = '1';
        if (overlayTimeoutId) clearTimeout(overlayTimeoutId);
        overlayTimeoutId = setTimeout(() => overlay.style.opacity = '0', CONFIG.OVERLAY_TIMEOUT);
    }

    function saveVolume(volume) {
        localStorage.setItem(volumeKey, volume.toString());
    }

    function loadVolume() {
        const v = parseFloat(localStorage.getItem(volumeKey));
        return isNaN(v) ? CONFIG.DEFAULT_VOLUME : clamp(v, 0, 1);
    }

    function handleWheel(e) {
        const video = e.currentTarget;
        const delta = e.deltaY * (CONFIG.REVERSE_SCROLL ? -1 : 1);

        e.preventDefault();

        let newVolume = video.volume;
        if (delta > 0) newVolume -= CONFIG.VOLUME_STEP;
        else if (delta < 0) newVolume += CONFIG.VOLUME_STEP;

        newVolume = clamp(newVolume, 0, 1);

        if (newVolume > 0 && video.muted) video.muted = false;

        video.volume = newVolume;
        saveVolume(newVolume);
        showOverlay(`Volume: ${Math.round(newVolume * 100)}%`);
    }

    function handleMiddleClick(e) {
        if (e.button !== 1) return;

        const video = e.currentTarget;
        e.preventDefault();

        video.muted = !video.muted;
        showOverlay(video.muted ? 'Muted' : `Unmuted (${Math.round(video.volume * 100)}%)`);
    }

    function initVideo(video) {
        if (!video || video.dataset.volumeEnhancerAttached) return;

        video.addEventListener('wheel', handleWheel, { passive: false });
        video.addEventListener('mousedown', handleMiddleClick, true);

        const savedVolume = loadVolume();
        video.volume = savedVolume;
        if (savedVolume === 0) video.muted = true;

        video.dataset.volumeEnhancerAttached = 'true';
    }

    function tryAttachToExistingVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(initVideo);
    }

    function observeForNewVideos() {
        const observer = new MutationObserver(() => {
            tryAttachToExistingVideos();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function waitForVideos() {
        // For sites that dynamically load video
        const interval = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                clearInterval(interval);
                tryAttachToExistingVideos();
                observeForNewVideos();
            }
        }, 300);
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForVideos);
    } else {
        waitForVideos();
    }
})();
