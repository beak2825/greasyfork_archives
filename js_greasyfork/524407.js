// ==UserScript==
// @name         Facebook Reels Enhancer
// @namespace    UserScript
// @match        https://www.facebook.com/*
// @version      2.3
// @license      MIT
// @author       Pyrvox
// @description  Enable controls on Facebook Reels videos, auto-unmute, and prevent pausing when switching tabs.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524407/Facebook%20Reels%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/524407/Facebook%20Reels%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for document to be ready before adding styles
    function addStyles() {
        if (!document.head) {
            setTimeout(addStyles, 10);
            return;
        }

        // Add CSS for better controls handling
        const style = document.createElement('style');
        style.textContent = `
            /* Disable overlay that blocks controls */
            .x1ey2m1c.x78zum5.xdt5ytf.xozqiw3.x17qophe.x13a6bvl.x10l6tqk.x1hkcv85,
            .x1ey2m1c.x78zum5.xdt5ytf.xozqiw3.x17qophe.x13a6bvl.x10l6tqk {
                pointer-events: none !important;
                opacity: 0.01 !important;
            }

            /* Make video controls always visible and clickable */
            video::-webkit-media-controls {
                opacity: 1 !important;
                visibility: visible !important;
                z-index: 99999 !important;
            }

            /* Make video container clickable */
            .x1ey2m1c.x78zum5.xdt5ytf.xozqiw3.x17qophe.x13a6bvl.x10l6tqk video {
                pointer-events: auto !important;
                position: relative;
                z-index: 9999 !important;
            }

            /* Disable other potential overlay elements */
            [role="presentation"],
            [data-pagelet],
            [data-visualcompletion] {
                pointer-events: none !important;
            }

            /* Make sure clickable elements remain clickable */
            [role="button"],
            [tabindex],
            button,
            a {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Enhanced unmute function
    function attemptUnmute(video) {
        if (!(video instanceof HTMLVideoElement)) return;

        if (video.muted || video.volume === 0) {
            video.muted = false;
            video.volume = 1.0;

            if (video.audioTracks && video.audioTracks.length > 0) {
                for (let track of video.audioTracks) {
                    track.enabled = true;
                }
            }
            video.dispatchEvent(new Event('volumechange', { bubbles: true }));
        }
    }

    // Enable controls for Reels videos
    function enableReelControls(video) {
        if (!video || video.hasAttribute('controls') || !location.href.includes('reel')) return;

        // Add controls to the video
        video.setAttribute('controls', '');
        video.setAttribute('playsinline', '');

        // Style the video and handle overlays
        setTimeout(() => {
            try {
                // Style the video
                Object.assign(video.style, {
                    'position': 'relative',
                    'zIndex': '99999',
                    'pointerEvents': 'auto',
                    'width': '100%',
                    'height': 'auto',
                    'maxHeight': '100vh'
                });

                // Find and disable overlays
                const overlays = document.querySelectorAll(`
                    .x1ey2m1c.x78zum5.xdt5ytf.xozqiw3.x17qophe.x13a6bvl.x10l6tqk,
                    [role="presentation"],
                    [data-pagelet],
                    [data-visualcompletion]
                `);

                overlays.forEach(overlay => {
                    if (!overlay.contains(video)) {
                        overlay.style.pointerEvents = 'none';
                        overlay.style.opacity = '0.01';
                    }
                });

                // Ensure video is in view
                video.scrollIntoViewIfNeeded();
            } catch (e) {
                console.error('Error in enableReelControls:', e);
            }
        }, 100);
    }

    // Handle play events
    function handlePlayEvent(event) {
        try {
            const target = event.target;
            if (!(target instanceof HTMLVideoElement)) return;

            enableReelControls(target);
            attemptUnmute(target);

            // Additional check for muted state after a short delay
            setTimeout(() => attemptUnmute(target), 500);
        } catch (e) {
            console.error('Error in handlePlayEvent:', e);
        }
    }

    // Handle click events for mute/unmute buttons
    function handleClickEvent(event) {
        try {
            const target = event.target;
            const isMuteButton = target.closest(`
                [aria-label*="mute"],
                [aria-label*="sound"],
                [role="button"][aria-pressed],
                [aria-label*="sonido"],
                [aria-label*="silenciar"]
            `);

            if (isMuteButton) {
                setTimeout(() => {
                    document.querySelectorAll('video').forEach(attemptUnmute);
                }, 100);
            }
        } catch (e) {
            console.error('Error in handleClickEvent:', e);
        }
    }

    // Prevent pausing when switching tabs
    function handleVisibilityChange() {
        try {
            // Force visible state
            Object.defineProperty(document, 'visibilityState', {
                get: () => 'visible',
                configurable: true
            });

            Object.defineProperty(document, 'hidden', {
                get: () => false,
                configurable: true
            });

            // Resume any paused videos
            document.querySelectorAll('video').forEach(video => {
                if (video.paused && video.readyState >= 2) {
                    video.play().catch(e => console.log('Auto-play failed:', e));
                }
            });
        } catch (e) {
            console.error('Error in handleVisibilityChange:', e);
        }
    }

    // Override pause method
    function initPauseHandler() {
        const originalPause = HTMLMediaElement.prototype.pause;
        HTMLMediaElement.prototype.pause = function() {
            try {
                if (this.closest('[href*="reel"], [data-pagelet*="reel"], [class*="reel"]')) {
                    return; // Prevent reels from pausing
                }
                return originalPause.apply(this, arguments);
            } catch (e) {
                console.error('Error in pause handler:', e);
                return originalPause.apply(this, arguments);
            }
        };
        return originalPause;
    }

    // Initialize
    function init() {
        try {
            console.log('Facebook Reels Enhancer initialized');

            // Add styles first
            addStyles();

            // Set up pause handler
            const originalPause = initPauseHandler();

            // Set up event listeners
            document.addEventListener('play', handlePlayEvent, true);
            document.addEventListener('click', handleClickEvent, true);
            document.addEventListener('visibilitychange', handleVisibilityChange, true);

            // Set up MutationObserver for dynamically loaded content
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach(node => {
                            // Check if node is a video
                            if (node.nodeName === 'VIDEO') {
                                enableReelControls(node);
                                attemptUnmute(node);
                            }
                            // Check for video elements within added nodes
                            else if (node.querySelectorAll) {
                                const videos = node.querySelectorAll('video');
                                videos.forEach(video => {
                                    enableReelControls(video);
                                    attemptUnmute(video);
                                });
                            }
                        });
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Initial check for videos
            document.querySelectorAll('video').forEach(video => {
                enableReelControls(video);
                attemptUnmute(video);
            });

            // Clean up on page unload
            window.addEventListener('beforeunload', () => {
                document.removeEventListener('play', handlePlayEvent, true);
                document.removeEventListener('click', handleClickEvent, true);
                document.removeEventListener('visibilitychange', handleVisibilityChange, true);
                observer.disconnect();
                HTMLMediaElement.prototype.pause = originalPause;
            });
        } catch (e) {
            console.error('Error initializing Facebook Reels Enhancer:', e);
        }
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // If document is already loaded, wait a bit to ensure everything is ready
        setTimeout(init, 500);
    }
})();