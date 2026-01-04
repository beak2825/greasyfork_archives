// ==UserScript==
// @name         YouTube Force Link Open in New Tab (Updated)
// @name:zh-CN   YouTube强制新标签页打开链接（更新版）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Opens YouTube links in new tabs without simulating Ctrl+Click, keeping the original page unchanged. Also pauses video on opening.
// @description:zh-CN  让YouTube链接在新标签页中打开，不使用模拟Ctrl+点击，同时保持原页面不变。同时，打开视频时保持视频暂停。
// @author       YourName
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @icon         https://img.icons8.com/?size=64&id=121211&format=png
// @downloadURL https://update.greasyfork.org/scripts/503353/YouTube%20Force%20Link%20Open%20in%20New%20Tab%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503353/YouTube%20Force%20Link%20Open%20in%20New%20Tab%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const YOUTUBE_PATTERNS = ['/watch', '/channel', '/user', '/playlist', '/shorts'];

    function isYouTubeLink(url) {
        return url.includes('youtube.com') || url.startsWith('/') || url.startsWith('https://youtu.be/');
    }

    function shouldOpenInNewTab(url) {
        return YOUTUBE_PATTERNS.some(pattern => url.includes(pattern));
    }

    function handleClick(event) {
        if (event.ctrlKey || event.metaKey) return;

        const anchor = event.target.closest('a');
        if (!anchor || !anchor.href) return;

        if (isYouTubeLink(anchor.href) && shouldOpenInNewTab(anchor.href)) {
            event.preventDefault();
            event.stopPropagation();
            // Open the link in a new tab
            const newTab = window.open(anchor.href, '_blank');
            // Pause the video in the new tab
            newTab.addEventListener('load', function() {
                let video = newTab.document.querySelector('video');
                if (video) {
                    video.pause();
                }
            }, false);
        }
    }

    // Pause video on current page load
    function pauseVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.pause();
        } else {
            // If video is not immediately found, try again after a short delay
            setTimeout(pauseVideo, 100);
        }
    }

    // Execute pause function when document is loaded
    document.addEventListener('DOMContentLoaded', pauseVideo);

    document.addEventListener('click', handleClick, true);
})();
