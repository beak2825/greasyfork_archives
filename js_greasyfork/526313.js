// ==UserScript==
// @name         Instagram Video Shortcuts
// @namespace    https://github.com/appel/userscripts
// @version      0.1.1
// @description  Adds youtube-like keyboard shortcuts for controlling video and audio on Instagram
// @author       Ap
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526313/Instagram%20Video%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/526313/Instagram%20Video%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to initialize media element with delay
    const initMediaElement = (media) => {
        media.controls = true;

        // Initial pause with delay to handle sites that force autoplay
        setTimeout(() => {
            media.pause();
        }, 100);

        document.addEventListener('visibilitychange', () => {
          setTimeout(() => {
            media.pause();
          }, 50);
        });
    };

    // Function to find the currently focused or playing media element
    const getFocusedMedia = () => {
        const mediaElements = document.querySelectorAll('video, audio');
        let focused = Array.from(mediaElements).find(el => el === document.activeElement);
        if (!focused) {
            focused = Array.from(mediaElements).find(el => !el.paused);
        }
        if (!focused && mediaElements.length > 0) {
            focused = mediaElements[0];
        }
        return focused;
    };

    // Calculate frame duration for video elements (assuming 30fps)
    const getFrameDuration = (video) => {
        return 1 / (video.webkitVideoDecodedByteCount ? 30 : 30); // Fallback to 30fps if not available
    };

    // Set up mutation observer to watch for new media elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                    initMediaElement(node);
                }
                // Also check for media elements within added nodes
                if (node.querySelectorAll) {
                    node.querySelectorAll('video, audio').forEach(initMediaElement);
                }
            });
        });
    });

    // Start observing immediately
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Handle keyboard events
    const handleKeydown = (e) => {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const media = getFocusedMedia();
        if (!media) return;

        switch (e.key.toLowerCase()) {
            case 'f':
                if (media.tagName === 'VIDEO') {
                    e.preventDefault();
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        media.requestFullscreen();
                    }
                }
                break;

            case 'm':
                e.preventDefault();
                media.muted = !media.muted;
                break;

            case 'k':
                e.preventDefault();
                if (media.paused) {
                    media.play();
                    // Unmute after a short delay when playing
                    setTimeout(() => { media.muted = false; }, 100);
                } else {
                    media.pause();
                }
                break;

            case 'j':
                e.preventDefault();
                media.currentTime = Math.max(0, media.currentTime - 10);
                break;

            case 'l':
                e.preventDefault();
                media.currentTime = Math.min(media.duration, media.currentTime + 10);
                break;

            case 'arrowleft':
                e.preventDefault();
                media.currentTime = Math.max(0, media.currentTime - 5);
                break;

            case 'arrowright':
                e.preventDefault();
                media.currentTime = Math.min(media.duration, media.currentTime + 5);
                break;

            case ',':
                if (media.tagName === 'VIDEO') {
                    e.preventDefault();
                    if (!media.paused) media.pause();
                    media.currentTime = Math.max(0, media.currentTime - getFrameDuration(media));
                }
                break;

            case '.':
                if (media.tagName === 'VIDEO') {
                    e.preventDefault();
                    if (!media.paused) media.pause();
                    media.currentTime = Math.min(media.duration, media.currentTime + getFrameDuration(media));
                }
                break;
        }
    };

    // Initialize when DOM is ready
    const init = () => {
        // Initialize any existing media elements
        document.querySelectorAll('video, audio').forEach(initMediaElement);

        // Add keyboard event listener
        document.addEventListener('keydown', handleKeydown);
    };

    // If DOM is already loaded, initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();