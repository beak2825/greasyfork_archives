// ==UserScript==
// @name         YouTube Shorts 1秒轮询检测版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  每1秒检测播放状态并自动翻页
// @author       You
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542717/YouTube%20Shorts%201%E7%A7%92%E8%BD%AE%E8%AF%A2%E6%A3%80%E6%B5%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542717/YouTube%20Shorts%201%E7%A7%92%E8%BD%AE%E8%AF%A2%E6%A3%80%E6%B5%8B%E7%89%88.meta.js
// ==/UserScript==
window.setInterval(main,1000);
function main(){
    const containers = document.querySelectorAll('div.html5-video-container');
    const video = containers[0].querySelector('video');
    video.removeAttribute('loop');
    video.autoplay = true;
    video.dataset.initialized = 'true';
    if (video.ended || video.paused) {
        const selector = '.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-xl.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        const buttons = document.querySelectorAll(selector);
        // 根据数量执行点击
        if (buttons.length === 1) {
            // 只有一个元素时，点击第一个（索引0）
            buttons[0].click();
        } else if (buttons.length > 1) {
            // 有多个元素时，点击第二个（索引1）
            buttons[1].click();
        }
    }

}