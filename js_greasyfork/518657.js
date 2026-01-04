// ==UserScript==
// @name         自动取消下一步（YouTube 和 Bilibili）
// @name:en      Auto Cancel Up Next (YouTube & Bilibili)
// @namespace    http://tampermonkey.net/
// @version      2024-11-24_1.1.5
// @description:zh-CN  自动取消 YouTube 和 Bilibili 视频播放完成后的推荐视频操作
// @description  Automatically cancel recommended video actions after YouTube and Bilibili videos have finished playing
// @author       屑屑
// @match        *://www.youtube.com/watch*
// @match        *://www.bilibili.com/video/*
// @icon         https://s2.loli.net/2024/04/28/WEkjH9iy51z63Of.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518657/%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E4%B8%8B%E4%B8%80%E6%AD%A5%EF%BC%88YouTube%20%E5%92%8C%20Bilibili%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518657/%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E4%B8%8B%E4%B8%80%E6%AD%A5%EF%BC%88YouTube%20%E5%92%8C%20Bilibili%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function setupAutoCancel() {
        const isYouTube = location.host.includes('youtube.com');
        const isBilibili = location.host.includes('bilibili.com');

        if (isYouTube) {
            const video = document.querySelector('video');
            if (video) {
                video.addEventListener('ended', () => {
                    const button = document.querySelector('.ytp-autonav-endscreen-upnext-cancel-button');
                    if (button) {
                        button.click();
                        console.log('YouTube: 取消按钮已点击');
                        document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").click();
                    } else {
                        console.log('YouTube: 未找到取消按钮');
                    }
                });
            }
        } else if (isBilibili) {
            const observer = new MutationObserver(() => {
                const button = document.querySelector(
                    '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-ending-wrap > div.bpx-player-ending-panel > div > div > div.bpx-player-ending-related > a:nth-child(1) > div.bpx-player-ending-related-item-cover > div.bpx-player-ending-related-item-cancel'
                );
                if (button) {
                    button.click();
                    console.log('Bilibili: 取消按钮已点击');
                    document.querySelector("div.bpx-player-ctrl-btn.bpx-player-ctrl-web").click();
                    observer.disconnect(); // 成功点击后停止观察
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            console.log('当前网站不支持自动取消功能');
        }
    }

    // 启动脚本
    setupAutoCancel();
})();