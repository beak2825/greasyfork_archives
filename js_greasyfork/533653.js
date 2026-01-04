// ==UserScript==
// @name         🔊 YouTube Volume Control on Scroll
// @namespace    https://greasyfork.org/users/1461079
// @version      1.3.1
// @description  Control YouTube volume with your mouse wheel - just hover over the video and scroll. Simple, fast, and click-free!
// @author       Michaelsoft
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533653/%F0%9F%94%8A%20YouTube%20Volume%20Control%20on%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/533653/%F0%9F%94%8A%20YouTube%20Volume%20Control%20on%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

      // === USER-ADJUSTABLE SETTINGS ===
    const VOLUME_STEP = 10; // Change this value to adjust how much volume changes per scroll (e.g. 1, 5, 10)
      // === /USER-ADJUSTABLE SETTINGS ===

    let video = null;
    let player = null;

    function isWatchPage() {
        return location.pathname === '/watch' && location.search.includes('v=');
    }

    function getYouTubePlayerAPI() {
        const ytp = document.querySelector('.html5-video-player');
        return ytp && typeof ytp.getVolume === 'function' && typeof ytp.setVolume === 'function' ? ytp : null;
    }

    function showOverlay(volumePercent) {
        let overlay = document.getElementById('volume-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'volume-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '10%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translateX(-50%)';
            overlay.style.padding = '10px 20px';
            overlay.style.background = 'rgba(0,0,0,0.7)';
            overlay.style.color = '#fff';
            overlay.style.fontSize = '18px';
            overlay.style.borderRadius = '5px';
            overlay.style.zIndex = '9999';
            document.body.appendChild(overlay);
        }

        overlay.innerText = `Volume: ${volumePercent}%`;
        overlay.style.display = 'block';

        clearTimeout(window.volTimer);
        window.volTimer = setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);
    }

    function handleScroll(event) {
        if (!isWatchPage()) return;

        event.preventDefault();
        if (!player) return;

        const currentVolume = player.getVolume();
        const newVolume = event.deltaY < 0
            ? Math.min(currentVolume + VOLUME_STEP, 100)
            : Math.max(currentVolume - VOLUME_STEP, 0);

        player.setVolume(newVolume);
        showOverlay(newVolume);
    }

    function setupVolumeControl() {
        if (!isWatchPage()) return;

        const maybeVideo = document.querySelector('video');
        const maybePlayer = getYouTubePlayerAPI();

        if (maybeVideo && maybeVideo !== video && maybePlayer) {
            if (video) video.removeEventListener('wheel', handleScroll);
            video = maybeVideo;
            player = maybePlayer;
            video.addEventListener('wheel', handleScroll, { passive: false });
        }
    }

    // Watch for SPA route changes and DOM mutations
    const observer = new MutationObserver(() => {
        if (isWatchPage()) {
            setupVolumeControl();
        } else {
            if (video) {
                video.removeEventListener('wheel', handleScroll);
                video = null;
                player = null;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run once on load too
    window.addEventListener('yt-navigate-finish', () => setTimeout(setupVolumeControl, 300));
    window.addEventListener('DOMContentLoaded', () => setTimeout(setupVolumeControl, 300));
})();
