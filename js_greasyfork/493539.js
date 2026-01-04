// ==UserScript==
// @name         YouTube 视频长按二倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 YouTube 鼠标长按视频时启用二倍速播放功能
// @author       Sulley-naer
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493539/YouTube%20%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89%E4%BA%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/493539/YouTube%20%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89%E4%BA%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isLongPress = false;
    let longPressTimer;
    let video;

    function enable2xPlayback() {
        if (video.playbackRate === 1) {
            video.playbackRate = 2;
        } else {
            video.playbackRate = 1;
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowRight') {
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                enable2xPlayback();
            }, 1000); // Adjust the duration for long press as needed (in milliseconds)
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'ArrowRight') {
            clearTimeout(longPressTimer);
            isLongPress = false;
        }
    }

    function init() {
        video = document.querySelector('video');
        if (!video) {
            console.error('Video element not found');
            return;
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        video.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
            }
        });
    }

    window.addEventListener('DOMContentLoaded', init);
})();
