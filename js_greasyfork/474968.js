// ==UserScript==
// @name         取消爱奇艺暂停广告
// @namespace    http://bmmmd.com/
// @version      0.5
// @description  fuck爱奇艺暂停广告
// @match        https://www.iqiyi.com/*
// @run-at       document-idle
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/474968/%E5%8F%96%E6%B6%88%E7%88%B1%E5%A5%87%E8%89%BA%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/474968/%E5%8F%96%E6%B6%88%E7%88%B1%E5%A5%87%E8%89%BA%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        const btnplaypause = document.querySelectorAll('[data-player-hook="btnplaypause"]');
        if (btnplaypause.length == 0) { return; }
        observer.disconnect();
        const video = document.querySelector("video");
        // 点击视频
        video.addEventListener("click", (event) => {
            video.paused ? video.play() : video.pause();
            event.stopPropagation();
        }, true);
        // 暂停按钮
        btnplaypause.forEach((items) => {
            items.addEventListener("click", (event) => {
                video.paused ? video.play() : video.pause();
                event.stopPropagation();
            }, true);
        });
        // 空格
        document.addEventListener("keydown", (event) => {
            if (event.code == "Space" && event.target.tagName != "INPUT") {
                video.paused ? video.play() : video.pause();
                event.stopPropagation();
            }
        }, true);
    });
    const target = document.querySelector('#flashbox');
    target && observer.observe(target, { childList: true, subtree: true });
})();