// ==UserScript==
// @name         YouTube Universal Progress Tracker
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  High-performance progress tracking for YouTube with minimal performance impact
// @author       ikigaiDH
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/525296/YouTube%20Universal%20Progress%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/525296/YouTube%20Universal%20Progress%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add static styles
    GM_addStyle(`
        .yt-progress-indicator {
            position: absolute;
            bottom: 4px;
            left: 4px;
            background-color: #cc0000;
            color: white;
            padding: 2px 6px;
            border-radius: 2px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            font-family: Roboto, Arial, sans-serif;
            text-transform: uppercase;
            pointer-events: none;
        }
    `);

    // Throttle function with ESLint fix
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    };

    // Storage management with throttled saves
    const storage = {
        data: GM_getValue('yt_watch_history', {}),
        saveThrottled: throttle(function() {
            GM_setValue('yt_watch_history', this.data);
        }, 100), // Reduced to 100ms for better responsiveness
        set: function(key, value) {
            this.data[key] = value;
            this.saveThrottled();
        },
        get: function(key) {
            return this.data[key] || 0;
        }
    };

    // Video ID extractor
    const getVideoId = (element) => {
        try {
            const link = element.closest('a') || element.querySelector('a');
            if (!link) return null;
            const url = new URL(link.href);
            return url.searchParams.get('v') ||
                   url.pathname.split('/watch/')[1]?.split('?')[0] ||
                   url.pathname.split('/')[2];
        } catch {
            return null;
        }
    };

    // Check if element is visible
    const isVisible = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 &&
               rect.left >= 0 &&
               rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
               rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    };

    // Create indicator element
    const createIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'yt-progress-indicator';
        return indicator;
    };

    // Cleanup detached indicators
    const cleanupDetachedIndicators = () => {
        document.querySelectorAll('.yt-progress-indicator').forEach(indicator => {
            if (!document.body.contains(indicator.parentElement)) {
                indicator.remove();
            }
        });
    };

    // Update thumbnails with requestAnimationFrame
    const updateThumbnails = () => {
        requestAnimationFrame(() => {
            // Only process visible thumbnails
            document.querySelectorAll('ytd-thumbnail').forEach(thumbnail => {
                if (!isVisible(thumbnail)) return;

                const videoId = getVideoId(thumbnail);
                if (!videoId) return;

                const percentage = storage.get(videoId);
                let indicator = thumbnail.querySelector('.yt-progress-indicator');

                if (percentage > 0) {
                    if (!indicator) {
                        indicator = createIndicator();
                        const overlays = thumbnail.querySelector('#overlays');
                        if (overlays) {
                            overlays.appendChild(indicator);
                        }
                    }
                    indicator.textContent = percentage >= 100 ? '>100%' : `${Math.round(percentage)}%`;
                } else if (indicator) {
                    indicator.remove();
                }
            });
        });
    };

    // Debounced update function
    const debouncedUpdate = throttle(updateThumbnails, 100);

    // Video progress tracking
    let currentVideo = null;
    const trackVideo = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId || videoId === currentVideo?.videoId) return;

        // Cleanup previous video listener
        if (currentVideo) {
            currentVideo.video.removeEventListener('timeupdate', currentVideo.handler);
        }

        const progressHandler = () => {
            if (video.duration > 0) {
                const percentage = (video.currentTime / video.duration) * 100;
                if (percentage > storage.get(videoId)) {
                    storage.set(videoId, percentage);
                    debouncedUpdate();
                }
            }
        };

        currentVideo = {
            videoId,
            video,
            handler: progressHandler
        };

        video.addEventListener('timeupdate', progressHandler);
    };

    // Selective mutation observer
    const observeContent = () => {
        const contentContainers = [
            document.querySelector('ytd-rich-grid-renderer'),
            document.querySelector('ytd-watch-next-secondary-results-renderer')
        ].filter(Boolean);

        const observer = new MutationObserver(() => {
            cleanupDetachedIndicators();
            debouncedUpdate();
            trackVideo();
        });

        contentContainers.forEach(container => {
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: false
            });
        });

        return observer;
    };

    // Initialize
    let observer;
    window.addEventListener('load', () => {
        observer = observeContent();
        debouncedUpdate();
        trackVideo();
    });

    // Handle navigation
    document.addEventListener('yt-navigate-finish', () => {
        if (observer) {
            observer.disconnect();
        }
        observer = observeContent();
        debouncedUpdate();
    });

    // Handle scroll events
    window.addEventListener('scroll', debouncedUpdate, { passive: true });
})();