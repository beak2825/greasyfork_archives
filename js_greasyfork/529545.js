// ==UserScript==
// @name         Facebook Auto Unmute
// @namespace    CustomScripts
// @description  Automatically unmutes all Facebook videos and reels when they start playing
// @author       areen-c
// @match        *://*.facebook.com/*
// @version      1.0
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529545/Facebook%20Auto%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/529545/Facebook%20Auto%20Unmute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function attemptUnmute(video) {
        if (video instanceof HTMLVideoElement && video.muted) {
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

    document.addEventListener('play', function(event) {
        attemptUnmute(event.target);
    }, true);

    document.addEventListener('click', function(event) {
        if (event.target.closest('[aria-label*="mute"]') ||
            event.target.closest('[aria-label*="sound"]') ||
            event.target.closest('[role="button"][aria-pressed]')) {

            setTimeout(() => {
                document.querySelectorAll('video').forEach(attemptUnmute);
            }, 100);
        }
    }, true);

    const checkInterval = setInterval(() => {
        document.querySelectorAll('video').forEach(attemptUnmute);
    }, 2000);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'VIDEO') {
                        attemptUnmute(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(attemptUnmute);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
        observer.disconnect();
    });
})();