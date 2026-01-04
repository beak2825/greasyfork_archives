// ==UserScript==
// @name         Google Video Playback Optimizer
// @namespace    http://tampermonkey.net/
// @version      2024-10-09
// @description  Keep Google video playback active even when the tab is not in focus
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?domain=google.com&sz=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524300/Google%20Video%20Playback%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/524300/Google%20Video%20Playback%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function keepPageVisible() {
        let hidden;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
        } else {
            console.warn('Google Video Playback Optimizer: Visibility API not supported');
            return;
        }

        try {
            Object.defineProperty(document, hidden, {
                get: () => false,
                configurable: true
            });

            Object.defineProperty(document, 'visibilityState', {
                get: () => 'visible',
                configurable: true
            });

            console.log('Google Video Playback Optimizer: Page visibility override applied');
        } catch (error) {
            console.error('Google Video Playback Optimizer: Failed to override visibility properties', error);
        }
    }

    function checkAndActivateForVideo() {
        const videoElements = document.querySelectorAll('video');
        if (videoElements.length > 0) {
            keepPageVisible();
        }
    }

    function checkAndActivateVisibilityOverride() {
        const url = window.location.href;
        const fragment = window.location.hash;

        if (fragment.includes('vid:')) {
            keepPageVisible();
        } else {
            console.log('Google Video Playback Optimizer: Not a video page based on URL fragment.');
        }
    }

    setInterval(checkAndActivateForVideo, 2000);

    window.addEventListener('load', () => {
        checkAndActivateForVideo();
        checkAndActivateVisibilityOverride();
    });

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        checkAndActivateForVideo();
        checkAndActivateVisibilityOverride();
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        checkAndActivateForVideo();
        checkAndActivateVisibilityOverride();
    };

    checkAndActivateForVideo();
    checkAndActivateVisibilityOverride();

})();