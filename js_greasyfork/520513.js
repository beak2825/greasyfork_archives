// ==UserScript==
// @name         Bilibili自动取消推荐续播
// @name:en      Auto Cancel Up Next (Bilibili)
// @namespace    http://tampermonkey.net/
// @version      1.0.0_2024-12-12
// @description 自动取消 Bilibili 视频播放完成后的推荐视频操作
// @description:en  Automatically cancel recommended video actions after Bilibili videos have finished playing
// @author       屑屑, Ting Yi(fork)
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520513/Bilibili%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E6%8E%A8%E8%8D%90%E7%BB%AD%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/520513/Bilibili%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E6%8E%A8%E8%8D%90%E7%BB%AD%E6%92%AD.meta.js
// ==/UserScript==
(function () {
    'use strict';

    console.log('BilibiliCancelNext: init');

    function setupAutoCancel() {
        if(!location.host.includes('bilibili.com')) {
            console.log('BilibiliCancelNext: 当前网站并不支持跳过');
        }

        const root = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-ending-wrap > div.bpx-player-ending-panel');

        const observer = new MutationObserver(() => {
            const button = document.querySelector('div > div > div.bpx-player-ending-related > a:nth-child(1) > div.bpx-player-ending-related-item-cover > div.bpx-player-ending-related-item-cancel');
            if (button && button.style.display !== 'none') {
                button.click();
                console.log('BilibiliCancelNext: 取消按钮已点击');
            }
        });

        observer.observe(root, { subtree: true, attributes: true, attributeFilter: ['class', 'style']});
    }

    setupAutoCancel();
})();
