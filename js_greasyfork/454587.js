// ==UserScript==
// @name         Youtube - Always loop playlists
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Loop youtube playlists
// @author       Jens Nordström
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454587/Youtube%20-%20Always%20loop%20playlists.user.js
// @updateURL https://update.greasyfork.org/scripts/454587/Youtube%20-%20Always%20loop%20playlists.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function init() {

        // Start interval to find elements on navigation
        var runInterval = setInterval(setLoop, 500);

        function setLoop() {
            if (!document.querySelector('[aria-label="Loop video"]') || !document.querySelector('[aria-label="Turn off loop"]')) {
                document.querySelector('[aria-label="Loop playlist"]').click();
            }
        }

        // Stop the interval after init or left mouse click
        setTimeout(() => {
            clearInterval(runInterval);
        }, "5000")
    }

    // Wait for DOM to find elements
    function waitForDOM(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Target element mapping
    waitForDOM('ytd-playlist-loop-button-renderer').then((target) => {
        var isMouseDown = false;

        init();

        // Detect left mouse click to run interval on navigation
        document.addEventListener('mousedown', function(event) {
            if (event.which) isMouseDown = true;
            init();
        }, true);
    });
})();