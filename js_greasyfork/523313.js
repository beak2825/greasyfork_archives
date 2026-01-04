// ==UserScript==
// @name         Instagram Background Playback
// @author       UniverseDev
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GPL-3.0-or-later
// @description  Keeps Instagram videos playing in the background.
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523313/Instagram%20Background%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/523313/Instagram%20Background%20Playback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isOverrideActive = false;
    let isVideoPlaying = false;
    let currentVideoElement = null;

    const overrideVisibility = () => {
        if (!isOverrideActive) {
            Object.defineProperties(document, {
                hidden: {
                    configurable: true,
                    get: () => false
                },
                visibilityState: {
                    configurable: true,
                    get: () => 'visible'
                }
            });
            document.dispatchEvent(new Event('visibilitychange'));
            isOverrideActive = true;
            console.log("IG Background Playback: Activated");
        }
    };

    const restoreVisibility = () => {
        if (isOverrideActive) {
            delete document.hidden;
            delete document.visibilityState;
            isOverrideActive = false;
            console.log("IG Background Playback: Deactivated");
        }
    };

    document.addEventListener('play', function(event) {
        if (event.target.tagName === 'VIDEO') {
            isVideoPlaying = true;
            currentVideoElement = event.target;
            console.log("IG Background Playback: Video started.");
            if (document.hidden) {
                overrideVisibility();
            }
        }
    }, true);

    document.addEventListener('pause', function(event) {
        if (event.target.tagName === 'VIDEO' && event.target === currentVideoElement) {
            isVideoPlaying = false;
            currentVideoElement = null;
            if (!document.hidden) {
                restoreVisibility();
            }
            console.log("IG Background Playback: Video paused.");
        }
    }, true);

    document.addEventListener('ended', function(event) {
        if (event.target.tagName === 'VIDEO' && event.target === currentVideoElement) {
            isVideoPlaying = false;
            currentVideoElement = null;
            if (!document.hidden) {
                restoreVisibility();
            }
            console.log("IG Background Playback: Video ended.");
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isVideoPlaying) {
            overrideVisibility();
        } else if (!document.hidden && isOverrideActive) {
            restoreVisibility();
        }
    });

})();