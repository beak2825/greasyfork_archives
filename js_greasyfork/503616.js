// ==UserScript==
// @name         Yes Continue
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Kiss the annoying "Video paused. Continue watching?" confirmation goodbye!
// @author       elliottophellia
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepageURL  https://github.com/elliottophellia/yescontinue
// @supportURL   https://github.com/elliottophellia/yescontinue/issues
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @run-at       document-idle
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/503616/Yes%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/503616/Yes%20Continue.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const tag = '[Yes Continue]';
    const isYoutubeMusic = window.location.hostname === 'music.youtube.com';
    const popupEventNodename = isYoutubeMusic ? 'YTMUSIC-YOU-THERE-RENDERER' : 'YT-CONFIRM-DIALOG-RENDERER';
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const appName = isYoutubeMusic ? 'ytmusic-app' : 'ytd-app';
    const popupContainer = isYoutubeMusic ? 'ytmusic-popup-container' : 'ytd-popup-container';
    const pauseRequestedTimeoutMillis = 5000;
    const idleTimeoutMillis = 5000;

    let appObserver = null;
    let pauseRequested = false;
    let pauseRequestedTimeout;
    let lastInteractionTime = Date.now();
    let videoElement = null;

    const log = message => console.log(`${tag}[${getTimestamp()}] ${message}`);
    const debug = message => console.debug(`${tag}[${getTimestamp()}] ${message}`);

    const asDoubleDigit = value => value < 10 ? `0${value}` : value;

    const getTimestamp = () => {
        const dt = new Date();
        return `${asDoubleDigit(dt.getHours())}:${asDoubleDigit(dt.getMinutes())}:${asDoubleDigit(dt.getSeconds())}`;
    };

    const isIdle = () => Date.now() - lastInteractionTime >= idleTimeoutMillis;

    const listenForMediaKeys = () => {
        if (!navigator.mediaSession) {
            log("Your browser doesn't seem to support navigator.mediaSession yet :/");
            return;
        }
        navigator.mediaSession.setActionHandler('pause', pauseVideo);
        navigator.mediaSession.yns_setActionHandler = navigator.mediaSession.setActionHandler;
        navigator.mediaSession.setActionHandler = (action, fn) => {
            if (action !== 'pause') {
                navigator.mediaSession.yns_setActionHandler(action, fn);
            }
        };
    };

    const listenForMouse = () => {
        const eventName = window.PointerEvent ? 'pointer' : 'mouse';
        ['down', 'up'].forEach(type =>
            document.addEventListener(`${eventName}${type}`, () => processInteraction(`${eventName}${type}`))
        );
    };

    const listenForKeyboard = () => {
        ['keydown', 'keyup'].forEach(type =>
            document.addEventListener(type, () => processInteraction(type))
        );
    };

    const processInteraction = action => {
        if (pauseRequested) {
            pauseVideo();
            return;
        }
        lastInteractionTime = Date.now();
    };

    const observeApp = () => {
        appObserver = new MutationObserver(overrideVideoPause);
        appObserver.observe(document.querySelector(appName), {
            childList: true,
            subtree: true
        });
    };

    const listenForPopupEvent = () => {
        document.addEventListener('yt-popup-opened', (e) => {
            if (isIdle() && e.detail.nodeName === popupEventNodename) {
                document.querySelector(popupContainer).click();
                pauseVideo();
                videoElement?.play();
            }
        });
    };

    const overrideVideoPause = () => {
        if (videoElement?.yns_pause !== undefined) return;
        videoElement = document.querySelector('video');
        if (!videoElement) return;

        listenForMediaKeys();
        videoElement.yns_pause = videoElement.pause;
        videoElement.pause = () => {
            if (!isIdle()) {
                pauseVideo();
                return;
            }
            pauseRequested = true;
            setPauseRequestedTimeout();
        };
    };

    const setPauseRequestedTimeout = (justClear = false) => {
        clearTimeout(pauseRequestedTimeout);
        if (!justClear) {
            pauseRequestedTimeout = setTimeout(() => {
                pauseRequested = false;
            }, pauseRequestedTimeoutMillis);
        }
    };

    const pauseVideo = () => {
        videoElement?.yns_pause();
        pauseRequested = false;
        setPauseRequestedTimeout(true);
    };

    const waitForApp = () => {
        return new Promise(resolve => {
            const checkApp = () => {
                if (document.querySelector(appName)) {
                    resolve();
                } else {
                    setTimeout(checkApp, 100);
                }
            };
            checkApp();
        });
    };

    await waitForApp();

    listenForMouse();
    listenForKeyboard();
    listenForPopupEvent();
    observeApp();
    log(`Monitoring YouTube ${isYoutubeMusic ? 'Music ' : ''}for 'Video paused. Continue watching?' action...`);
})();