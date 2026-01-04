// ==UserScript==
// @name         Fix Instagram Videos
// @namespace    andreiv
// @version      1.1
// @description  Adds controls, prevents auto-mute, disables looping, and stops pause on tab switch
// @match        https://www.instagram.com/
// @match        https://www.instagram.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542210/Fix%20Instagram%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/542210/Fix%20Instagram%20Videos.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Override muted property globally
    const originalMuted = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted');
    Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
        get: function() {
            return false;
        },
        set: function(value) {
            // Always force unmuted
            if (originalMuted && originalMuted.set) {
                originalMuted.set.call(this, false);
            }
        },
        configurable: true
    });
    // Process video elements
    function processVideo(video) {
        // Remove Instagram's overlay
        if (video.nextElementSibling) {
            video.nextElementSibling.remove();
        }
        // Add controls and unmute
        video.controls = true;
        video.muted = false;
        video.volume = 1;

        // Prevent pause on tab switch
        const originalPause = video.pause;
        video.pause = function() {
            if (document.hidden) return;
            return originalPause.call(this);
        };

        // Block autoplay on tab return
        let blockPlay = false;
        const originalPlay = video.play;
        video.play = function() {
            // Only block if blockPlay is true (for tab switching)
            if (blockPlay) return Promise.resolve();

            // CRITICAL FIX: Check if we're at the end and reset
            // Firefox doesn't auto-reset currentTime when playing from ended state
            if (this.currentTime >= this.duration - 0.1 || this.ended) {
                this.currentTime = 0;
            }

            return originalPlay.call(this);
        };

        // Also intercept the play event to double-check
        video.addEventListener('play', function(e) {
            // If we're playing but still at the end, force reset
            if (video.currentTime >= video.duration - 0.1) {
                video.currentTime = 0;
            }
        }, true);

        // When tab becomes visible, block play for 500ms
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                blockPlay = true;
                setTimeout(() => {
                    blockPlay = false;
                }, 500);
            }
        });

        // Prevent looping by intercepting ended event
        video.addEventListener('ended', (e) => {
            e.stopImmediatePropagation();
            video.pause();
            // Don't manipulate currentTime here, let it stay at the end naturally
        }, true);
    }
    // Watch for new videos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'VIDEO') {
                    processVideo(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(processVideo);
                }
            });
        });
    });
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // Initial run for existing videos
    document.querySelectorAll('video').forEach(processVideo);
})();