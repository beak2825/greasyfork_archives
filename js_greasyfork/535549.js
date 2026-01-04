// ==UserScript==
// @name         小红书 & 百度贴吧 视频自动取消静音
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  小红书、百度贴吧网页端：视频自动取消静音
// @match        *://www.xiaohongshu.com/*
// @match        *://tieba.baidu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535549/%E5%B0%8F%E7%BA%A2%E4%B9%A6%20%20%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/535549/%E5%B0%8F%E7%BA%A2%E4%B9%A6%20%20%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    function handleVideo(video) {
        if (video.__xhsAutoUnmute) return;
        video.__xhsAutoUnmute = true;

        video.addEventListener('play', function() {
            if (video.muted) video.muted = false;
            if (video.volume === 0) video.volume = 1;
        });

        if (video.muted) video.muted = false;
        if (video.volume === 0) video.volume = 1;
    }

    function scanAndHandleVideos() {
        document.querySelectorAll('video').forEach(handleVideo);
    }

    function setupVideoObserver() {
        if (window.__xhsVideoUnmuteObserver) return;
        window.__xhsVideoUnmuteObserver = true;

        scanAndHandleVideos();
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        handleVideo(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(handleVideo);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function waitForHeadAndBody(fn) {
        if (document.head && document.body) {
            fn();
        } else {
            const observer = new MutationObserver(() => {
                if (document.head && document.body) {
                    observer.disconnect();
                    fn();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }
    waitForHeadAndBody(setupVideoObserver);

    window.addEventListener('DOMContentLoaded', () => {
        scanAndHandleVideos();
    });
})();
