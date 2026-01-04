// ==UserScript==
// @name         RedditP RedGifs Auto Unmute
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically unmutes RedGifs embeds on redditp.com by preventing muting and forcing audio playback
// @author       nxtcarson
// @match        https://redditp.com/r/*
// @match        https://*.redgifs.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526720/RedditP%20RedGifs%20Auto%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/526720/RedditP%20RedGifs%20Auto%20Unmute.meta.js
// ==/UserScript==

/* 
This script automatically unmutes RedGifs videos on redditp.com by:
1. Overriding the video element's muted property
2. Preventing volume changes
3. Continuously checking for and unmuting new videos
4. Removing muted attributes from video elements
*/

(function() {
    'use strict';

    const DEBUG = false; // Set to true to enable console logging

    function log(...args) {
        if (DEBUG) {
            console.log('[RedGifs Unmuter]', ...args);
        }
    }

    function error(...args) {
        if (DEBUG) {
            console.error('[RedGifs Unmuter]', ...args);
        }
    }

    // Override the video element's muted property
    function overrideVideoElement() {
        try {
            // Override the HTMLVideoElement prototype to prevent muting
            const descriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'muted');
            if (descriptor && descriptor.configurable) {
                Object.defineProperty(HTMLVideoElement.prototype, 'muted', {
                    get: function() {
                        return false;
                    },
                    set: function() {
                        // Ignore attempts to mute
                        log('Prevented muting attempt');
                        return false;
                    },
                    configurable: true
                });
                log('Overrode video muted property');
            }

            // Also override the volume property to ensure it stays audible
            const volumeDescriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'volume');
            if (volumeDescriptor && volumeDescriptor.configurable) {
                Object.defineProperty(HTMLVideoElement.prototype, 'volume', {
                    get: function() {
                        return 1;
                    },
                    set: function() {
                        // Keep volume at maximum
                        log('Prevented volume change');
                        return 1;
                    },
                    configurable: true
                });
                log('Overrode video volume property');
            }
        } catch (e) {
            error('Failed to override video element:', e);
        }
    }

    function forceUnmute() {
        try {
            // Find all video elements and force unmute them
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                // Remove muted attribute
                video.removeAttribute('muted');
                // Force unmute through the video API
                video.defaultMuted = false;
                video.muted = false;
                video.volume = 1;
                
                // Also try to remove any muted attributes from parent elements
                let parent = video.parentElement;
                while (parent) {
                    parent.removeAttribute('muted');
                    parent = parent.parentElement;
                }
                
                log('Unmuted video element');
            });
        } catch (e) {
            error('Error in forceUnmute:', e);
        }
    }

    // Run as early as possible
    overrideVideoElement();

    // Run when DOM starts loading
    document.addEventListener('DOMContentLoaded', forceUnmute);

    // Run when window loads
    window.addEventListener('load', forceUnmute);

    // Keep checking for new videos
    setInterval(forceUnmute, 500);

    // Watch for new content
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                forceUnmute();
            }
        }
    });

    // Start observing as soon as body is available
    function startObserving() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        } else {
            setTimeout(startObserving, 100);
        }
    }
    startObserving();

    log('Script initialized');
})();