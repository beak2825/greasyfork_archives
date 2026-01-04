// ==UserScript==
// @name         Shorts Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      2025-07-10
// @description  Auto-scroll to next YouTube Short.
// @author       vincent bruneau
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497991/Shorts%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/497991/Shorts%20Auto%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentVideo = null;
    let currentSrc = null;

    function log(...args) {
        console.log('[Shorts Auto Scroll]', ...args);
    }

    function isShortsPage() {
        return location.pathname.startsWith("/shorts");
    }

    function getVideo() {
        return document.querySelector("video.video-stream.html5-main-video");
    }

    function getNextButton() {
        return document.querySelector('#navigation-button-down button');
    }

    function scrollToNext() {
        const btn = getNextButton();
        if (btn && btn.getAttribute("aria-disabled") !== "true") {
            log("Scrolling to next Short");
            btn.click();
        } else {
            log("Next button not found or disabled");
        }
    }

    function bindToVideo(video) {
        if (!video || video.dataset.autoScrollBound === "true") return;

        video.dataset.autoScrollBound = "true";
        video.dataset.autoScrollTriggered = "false";

        log("Bound to video element:", video.src);

        video.addEventListener("timeupdate", function () {
            const duration = video.duration;
            const current = video.currentTime;
            if (
                duration &&
                current / duration > 0.98 &&
                video.dataset.autoScrollTriggered !== "true"
            ) {
                video.dataset.autoScrollTriggered = "true";
                scrollToNext();
            }
        });

        video.addEventListener("play", function () {
            if (video.dataset.autoScrollTriggered === "true") {
                log("Video played again — resetting scroll trigger");
                video.dataset.autoScrollTriggered = "false";
            }
        });
    }

    function detectAndBindVideo() {
        if (!isShortsPage()) return;

        const video = getVideo();
        if (!video) return;

        const srcChanged = video.src !== currentSrc;
        if (video !== currentVideo || srcChanged) {
            currentVideo = video;
            currentSrc = video.src;
            bindToVideo(video);
        }
    }

    function init() {
        log("Shorts Auto Scroll initialized");

        setInterval(detectAndBindVideo, 1000);

        window.addEventListener("yt-navigate-finish", function () {
            currentVideo = null;
            currentSrc = null;
        });
    }

    init();
})();
