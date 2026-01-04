// ==UserScript==
// @name         Video Autoplay Blocker
// @namespace    VmlkZW8gQXV0b3BsYXkgQmxvY2tlcg
// @version      1.0
// @description  Blocks all video autoplay and allowed playback only after user interaction.
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/stop-v10.png
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560197/Video%20Autoplay%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/560197/Video%20Autoplay%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Flag to track user interaction
    let userInteracted = false;

    // Mark videos as user-initiated after interaction
    const markUserInitiated = () => {
        userInteracted = true;
        document.querySelectorAll('video').forEach(v => {
            v.dataset.userInitiated = 'true';
        });
    };

    // Listen for user interaction events
    ['click', 'keydown', 'touchstart'].forEach(evt =>
        window.addEventListener(evt, markUserInitiated, true)
    );

    // Override play() to block autoplay unless user-initiated
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
        if (this.tagName === 'VIDEO') {
            const isUserInitiated = userInteracted || this.dataset.userInitiated === 'true';
            if (isUserInitiated) {
                return originalPlay.apply(this, arguments);
            } else {
                console.warn('[Autoplay Blocked]: play() intercepted');
                const p = Promise.resolve();
                p.catch(() => {});
                return p;
            }
        }
        return originalPlay.apply(this, arguments);
    };

    // Check for nearby custom controls
    const hasCustomControlsNearby = (video) => {
        const container = video.closest('div, section, article, body');
        if (!container) return false;

        const keywords = ['play', 'pause', 'btn', 'control', 'icon', 'player'];
        const controlsLike = container.querySelectorAll('button, [role="button"], [class], [id]');

        for (let el of controlsLike) {
            const cls = (el.className || '') + ' ' + (el.id || '');
            const clsLower = cls.toLowerCase();
            if (keywords.some(k => clsLower.includes(k))) {
                return true;
            }
        }

        return false;
    };

    // Block autoplay and ensure controls
    const blockAutoplay = (video) => {
        video.autoplay = false;
        video.muted = false;
        video.removeAttribute('autoplay');
        video.removeAttribute('muted');
        video.preload = 'metadata';
        video.pause();

        const hasNativeControls = video.hasAttribute('controls');
        const hasCustomControls = hasCustomControlsNearby(video);

        if (!hasNativeControls && !hasCustomControls) {
            video.setAttribute('controls', 'true');
        }
    };

    // Process all videos on the page
    const processVideos = () => {
        document.querySelectorAll('video').forEach(blockAutoplay);
    };

    // Run on DOM ready and window load
    document.addEventListener('DOMContentLoaded', processVideos);
    window.addEventListener('load', processVideos);

    // Observe DOM for dynamically added videos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.tagName === 'VIDEO') {
                    blockAutoplay(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(blockAutoplay);
                }
            });
        });
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

})();
