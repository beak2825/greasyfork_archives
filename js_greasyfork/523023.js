// ==UserScript==
// @name        Instagram Stories Background Playback
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Allow Instagram Stories to play in the background
// @author      HaiDang
// @match       https://*.instagram.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/523023/Instagram%20Stories%20Background%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/523023/Instagram%20Stories%20Background%20Playback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        debug: false,
        events: ['visibilitychange', 'blur', 'freeze', 'resume', 'pause'],
        checkInterval: 500,
        videoSelectors: [

            'video[class*="Story"]',
            'video[class*="stories"]',
            'video[class*="Reel"]',
            'video[class*="reels"]',
            'video[class*="Video"]',
            'video._aa63'
        ]
    };

    const logger = {
        log: (message) => {
            if (config.debug) {
                console.log(`[IG Stories Background] ${message}`);
            }
        },
        error: (message) => {
            if (config.debug) {
                console.error(`[IG Stories Background] Error: ${message}`);
            }
        }
    };

    const handleEvent = (evt) => {
        logger.log(`${evt.type} event intercepted`);
        evt.stopImmediatePropagation();
    };

    const ensureVideoPlaying = () => {
        const videoElements = config.videoSelectors
            .map(selector => [...document.querySelectorAll(selector)])
            .flat();

        videoElements.forEach((video) => {
            if (video.paused && !video.ended) {
                video.play()
                    .then(() => logger.log('Video resumed successfully'))
                    .catch((err) => logger.error(`Play failed: ${err.message}`));
            }

            video.controls = true;
            video.onpause = null;
            video.onblur = null;
            video.onfocus = null;
        });
    };

    const initEventListeners = () => {
        config.events.forEach((eventName) => {
            document.addEventListener(eventName, handleEvent, {
                capture: true,
                passive: false
            });

            window.addEventListener(eventName, handleEvent, {
                capture: true,
                passive: false
            });
        });
    };

    const initVideoObserver = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    ensureVideoPlaying();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    const init = () => {
        logger.log('Initializing Instagram background playback script');

        initEventListeners();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initVideoObserver);
        } else {
            initVideoObserver();
        }

        setInterval(ensureVideoPlaying, config.checkInterval);
    };

    init();
})();