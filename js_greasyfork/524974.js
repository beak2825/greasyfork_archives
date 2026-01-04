// ==UserScript==
// @name         Instagram Reels Auto Scroll
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @version      1.0
// @description  Auto-plays next reel when your on the reels page on someone's profile!
// @author       icycoldveins
// @match        *://*.instagram.com/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524974/Instagram%20Reels%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/524974/Instagram%20Reels%20Auto%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentVideo = null;
    let observer = null;
    let isTabActive = document.visibilityState === 'visible';

    // Check if we're on a reels page
    function isReelsPage() {
        const path = window.location.pathname;
        return path.includes('/reel/') || path.includes('/reels/');
    }

    function findVideoElement() {
        return document.querySelector('video.x1lliihq.x5yr21d.xh8yej3');
    }

    function simulateArrowKey() {
        if (!isTabActive || !isReelsPage()) return;
        const rightArrowEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            which: 39,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(rightArrowEvent);
    }

    function setupVideoListener() {
        if (!isReelsPage()) return;

        const video = findVideoElement();
        if (video && video !== currentVideo) {
            currentVideo = video;

            video.addEventListener('pause', function (event) {
                if (!isTabActive || !isReelsPage()) return;
                if (event.isTrusted) return;
                if (!video.ended) video.play();
            });

            video.addEventListener('ended', simulateArrowKey);
        }
    }

    function initObserver() {
        if (!isReelsPage()) return;

        observer = new MutationObserver(() => {
            if (!findVideoElement()) return;
            setupVideoListener();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function cleanup() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        currentVideo = null;
    }

    // Handle navigation and URL changes
    function handleNavigation() {
        cleanup();
        if (isReelsPage() && isTabActive) {
            initObserver();
            setupVideoListener();
        }
    }

    // Enhance navigation detection by overriding pushState and replaceState
    function patchHistoryMethods() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('pushstate'));
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('replacestate'));
        };
    }

    // Add event listeners
    function addEventListeners() {
        document.addEventListener('visibilitychange', () => {
            isTabActive = document.visibilityState === 'visible';
            handleNavigation();
        });

        window.addEventListener('popstate', handleNavigation);
        window.addEventListener('pushstate', handleNavigation);
        window.addEventListener('replacestate', handleNavigation);
    }

    // Initial setup
    function initialize() {
        patchHistoryMethods();
        addEventListeners();
        handleNavigation();
    }

    initialize();
})();