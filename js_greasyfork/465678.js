// ==UserScript==
// @name         YouTube Spacebar Controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable spacebar scrolling and enable spacebar controls on YouTube
// @author       Temanor
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465678/YouTube%20Spacebar%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/465678/YouTube%20Spacebar%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isIgnoredElement(target) {
        const tagName = target.tagName.toLowerCase();
        return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
    }

    function controlVideo(e) {
        const video = document.querySelector("video");
        if (!video || isIgnoredElement(e.target)) return;

        const player = document.querySelector('.html5-video-player');
        const isPlayerInFocus = player && player.contains(document.activeElement);

        if (isPlayerInFocus) return;

        if (e.code === 'Space') {
            e.preventDefault();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }

    function preventSpaceScroll(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
        }
    }

    window.addEventListener('keydown', controlVideo);
    window.addEventListener('keydown', preventSpaceScroll);
})();
