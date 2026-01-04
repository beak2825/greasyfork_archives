// ==UserScript==
// @name         Yes BlockTheAds
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Kiss the annoying youtube ads goodbye!
// @author       elliottophellia
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepageURL  https://github.com/elliottophellia/yesblocktheads
// @supportURL   https://github.com/elliottophellia/yesblocktheads/issues
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @run-at       document-idle
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/503709/Yes%20BlockTheAds.user.js
// @updateURL https://update.greasyfork.org/scripts/503709/Yes%20BlockTheAds.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const tag = '[Yes BlockTheAds]';
    const adSelectors = [
        '#masthead-ad', '.video-ads.ytp-ad-module', 'ytd-ad-slot-renderer',
        'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)',
        'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)', 'yt-mealbar-promo-renderer',
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        '#related #player-ads', '#related ytd-ad-slot-renderer',
        'ytd-popup-container:has(a[href="/premium"])', 'ad-slot-renderer',
        'ytm-companion-ad-renderer',
        'ytd-rich-item-renderer:has(.ytd-display-ad-renderer)',
        '.ytd-banner-promo-renderer',
        'ytd-statement-banner-renderer'
    ];

    const log = (message) => console.log(`${tag}[${getTimestamp()}] ${message}`);
    const debug = (message) => console.debug(`${tag}[${getTimestamp()}] ${message}`);

    const asDoubleDigit = value => value < 10 ? `0${value}` : value;
    
    const getTimestamp = () => {
        const dt = new Date();
        return `${asDoubleDigit(dt.getHours())}:${asDoubleDigit(dt.getMinutes())}:${asDoubleDigit(dt.getSeconds())}`;
    };

    const setFlag = (flagName) => {
        if (!document.getElementById(flagName)) {
            const flag = document.createElement('style');
            flag.id = flagName;
            document.head.appendChild(flag);
            return false;
        }
        return true;
    };

    const injectAdBlockStyles = () => {
        if (setFlag('yesBlockTheAdsStyles')) {
            debug('Ad-blocking styles already present');
            return;
        }

        const style = document.createElement('style');
        style.textContent = adSelectors.map(selector => `${selector}{display:none!important}`).join('');
        document.head.appendChild(style);
        log('Ad-blocking styles successfully injected');
    };

    const simulateInteraction = (element) => {
        const events = ['mousedown', 'mouseup', 'click'];
        events.forEach(eventType => {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        });
    };

    const getVideoPlayer = () => document.querySelector('.ad-showing video, video');

    const ensureVideoPlayback = (video) => {
        if (video.paused && video.currentTime < 0.5) {
            video.play().catch(() => debug('Auto-play prevented'));
            debug('Attempting to auto-play video');
        }
    };

    const clearOverlays = () => {
        const premiumPrompts = document.querySelectorAll('ytd-popup-container');
        premiumPrompts.forEach(prompt => {
            if (prompt.querySelector('a[href="/premium"]')) {
                prompt.remove();
                debug('Removed a YouTube Premium prompt');
            }
        });

        const overlay = document.querySelector('tp-yt-iron-overlay-backdrop[style*="z-index: 2201"]');
        if (overlay) {
            overlay.style.display = 'none';
            debug('Hidden an overlay backdrop');
        }
    };

    const bypassAd = (video) => {
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern');
        const adIndicator = document.querySelector('.video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon');

        if ((skipBtn || adIndicator) && !window.location.href.includes('https://m.youtube.com/')) {
            video.muted = true;
        }

        if (skipBtn) {
            setTimeout(() => {
                if (video.currentTime > 0.5) {
                    video.currentTime = video.duration;
                    debug('Skipped ad for special case');
                    return;
                }
                if ('ontouchstart' in window) {
                    simulateTouchEvent(skipBtn);
                } else {
                    simulateInteraction(skipBtn);
                }
                debug('Bypassed ad using skip button');
            }, 250);
        } else if (adIndicator) {
            video.currentTime = video.duration;
            debug('Forcefully ended the current ad');
        }
    };

    const simulateTouchEvent = (element) => {
        const touch = new Touch({
            identifier: Date.now(),
            target: element,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        const touchStartEvent = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        const touchEndEvent = new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        element.dispatchEvent(touchStartEvent);
        element.dispatchEvent(touchEndEvent);
    };

    const enhanceYouTubeExperience = () => {
        if (setFlag('yesBlockTheAdsEnhanced')) {
            debug('Yes BlockTheAds enhancement already active');
            return;
        }

        new MutationObserver(() => {
            const video = getVideoPlayer();
            if (video) {
                clearOverlays();
                bypassAd(video);
                ensureVideoPlayback(video);
            }
        }).observe(document.body, { childList: true, subtree: true });

        log('Yes BlockTheAds enhancement activated');
    };

    const waitForYouTubeApp = () => {
        return new Promise(resolve => {
            const checkForApp = () => {
                if (document.querySelector('ytd-app')) {
                    resolve();
                } else {
                    setTimeout(checkForApp, 100);
                }
            };
            checkForApp();
        });
    };

    await waitForYouTubeApp();
    injectAdBlockStyles();
    enhanceYouTubeExperience();
    log('Monitoring YouTube for ads...');
})();