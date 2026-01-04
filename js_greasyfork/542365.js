// ==UserScript==
// @name         移动设备全屏浏览
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  长按右下角
// @author       Gemini
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542365/%E7%A7%BB%E5%8A%A8%E8%AE%BE%E5%A4%87%E5%85%A8%E5%B1%8F%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542365/%E7%A7%BB%E5%8A%A8%E8%AE%BE%E5%A4%87%E5%85%A8%E5%B1%8F%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全屏切换
    function isFullscreen() {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;
    }
    function toggleFullscreen() {
        if (!isFullscreen()) {
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
            else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
            else if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
            else if (document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        }
    }

    // 长按屏幕右下角切换全屏
    let timer = null;
    const PRESS_MS = 500; // 长按时间，毫秒
    const AREA_SIZE = 60; // 右下角热区的大小（像素）

    function inRightBottomCorner(x, y) {
        return (
            x > window.innerWidth - AREA_SIZE &&
            y > window.innerHeight - AREA_SIZE
        );
    }

    document.addEventListener('touchstart', function(e) {
        const t = e.touches[0];
        if (inRightBottomCorner(t.clientX, t.clientY)) {
            timer = setTimeout(() => {
                toggleFullscreen();
                timer = null;
            }, PRESS_MS);
        }
    }, {passive:true});

    document.addEventListener('touchend', function() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    });
    document.addEventListener('touchmove', function(e) {
        if (!timer) return;
        const t = e.touches[0];
        if (!inRightBottomCorner(t.clientX, t.clientY)) {
            clearTimeout(timer);
            timer = null;
        }
    });
})();