// ==UserScript==
// @name         Bilibili 默认开启弹幕（自用）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Bilibili视频播放页强制默认开启弹幕
// @author       Jinyou
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501338/Bilibili%20%E9%BB%98%E8%AE%A4%E5%BC%80%E5%90%AF%E5%BC%B9%E5%B9%95%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501338/Bilibili%20%E9%BB%98%E8%AE%A4%E5%BC%80%E5%90%AF%E5%BC%B9%E5%B9%95%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableDanmu() {
        const danmuButton = document.querySelector('#bilibili-player > div.bpx-docker.bpx-docker-major > div.bpx-player-container.bpx-state-paused > div.bpx-player-primary-area:first-child > div.bpx-player-sending-area:last-child > div.bpx-player-sending-bar > div.bpx-player-dm-root:last-child > div.bpx-player-dm-switch.bui.bui-danmaku-switch:first-child > div.bui-area > input.bui-danmaku-switch-input:first-child');
        if (danmuButton && !danmuButton.checked) {
            danmuButton.click();
        }
    }

    function checkDanmu() {
        // 确保视频播放器已经加载
        const videoPlayer = document.querySelector('.bpx-player-container');
        if (videoPlayer) {
            enableDanmu();
        } else {
            // 如果播放器未加载，则稍后再试
            setTimeout(checkDanmu, 1000);
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', checkDanmu);

    // 处理页面动态加载
    const observer = new MutationObserver(function() {
        checkDanmu();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
