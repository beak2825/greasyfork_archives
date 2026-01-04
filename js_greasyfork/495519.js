// ==UserScript==
// @name         Unmute Frigate Live View
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unmute video by default
// @match        https://frigate.domain.com/*
// @match        http://192.168.0.225/*
// @match        http://192.168.0.226/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495519/Unmute%20Frigate%20Live%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/495519/Unmute%20Frigate%20Live%20View.meta.js
// ==/UserScript==

// Script created by ChatGPT, OpenAI

(function() {
    'use strict';

    function unmuteWithDelays(videoElement, attempts) {
        if (attempts > 0) {
            setTimeout(() => {
                videoElement.muted = false;
                videoElement.volume = 1.0;
                unmuteWithDelays(videoElement, attempts - 1);
            }, 2000); // Delay of 2 seconds between attempts
        }
    }

    function unmuteVideo() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            unmuteWithDelays(videoElement, 1); // Unmute 1 time with delays
        }
    }

    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'VIDEO') {
                            unmuteVideo();
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', function() {
        unmuteVideo();
        setupObserver(); // Setup observer to detect new video elements
    });
})();
