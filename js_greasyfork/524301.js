// ==UserScript==
// @name         TikTok Background Playback
// @author       UniverseDev
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GPL-3.0-or-later
// @description  Keeps TikTok videos playing in the background.
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524301/TikTok%20Background%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/524301/TikTok%20Background%20Playback.meta.js
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
            console.log("TikTok Background Playback: Activated");
        }
    };

    const restoreVisibility = () => {
        if (isOverrideActive) {
            delete document.hidden;
            delete document.visibilityState;
            isOverrideActive = false;
            console.log("TikTok Background Playback: Deactivated");
        }
    };

    document.addEventListener('play', function(event) {
        if (event.target.tagName === 'VIDEO') {
            isVideoPlaying = true;
            currentVideoElement = event.target;
            console.log("TikTok Background Playback: Video started.");
            if (document.hidden) {
                overrideVisibility();
            }
        }
    }, true);

    document.addEventListener('ended', function(event) {
        if (event.target.tagName === 'VIDEO' && event.target === currentVideoElement) {
            isVideoPlaying = false;
            currentVideoElement = null;
            if (!document.hidden) {
                restoreVisibility();
            }
            console.log("TikTok Background Playback: Video ended.");
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