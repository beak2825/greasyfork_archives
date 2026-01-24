// ==UserScript==
// @name         Video Volume/Playback Speed Controller
// @name:zh-TW   影片音量/撥放速度控制器
// @namespace    https://github.com/jmsch23280866
// @version      1.1
// @description  Adjust video playback speed and volume with HUD showing real-time values inside the video frame. Conditional scroll blocking applied. (Script assisted by AI)
// @description:zh-TW 使用滑鼠滾輪和按鍵組合調整影片播放速度和音量，並在影片框架內顯示即時值提示框。僅在條件下阻止滾動。（此腳本由AI協助撰寫）
// @author       特務E04
// @supportURL   https://github.com/jmsch23280866/Video-Control-Enhancer/issues
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522978/%E5%BD%B1%E7%89%87%E9%9F%B3%E9%87%8F%E6%92%A5%E6%94%BE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/522978/%E5%BD%B1%E7%89%87%E9%9F%B3%E9%87%8F%E6%92%A5%E6%94%BE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hudTimeout; // 用於控制提示框消失的計時器
    let hud; // HUD 提示框元素

    function createHUD() {
        hud = document.createElement('div');
        hud.style.position = 'absolute';
        hud.style.padding = '10px 20px';
        hud.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        hud.style.color = 'white';
        hud.style.fontSize = '16px';
        hud.style.fontWeight = 'bold';
        hud.style.borderRadius = '5px';
        hud.style.pointerEvents = 'none'; // 防止干擾滑鼠事件
        hud.style.zIndex = '9999';
        hud.style.display = 'none';
        return hud;
    }

    function showHUD(video, message) {
        if (!hud) hud = createHUD();

        // 將 HUD 添加到影片框架中
        if (!video.parentElement.contains(hud)) {
            video.parentElement.appendChild(hud);
        }

        // 設置 HUD 位置與內容
        hud.textContent = message;
        hud.style.left = `${(video.clientWidth - hud.offsetWidth) / 2}px`;
        hud.style.top = `${(video.clientHeight - hud.offsetHeight) / 2}px`;
        hud.style.display = 'block';

        // 自動隱藏
        clearTimeout(hudTimeout);
        hudTimeout = setTimeout(() => {
            hud.style.display = 'none';
        }, 1000); // 1 秒後自動隱藏
    }

    document.addEventListener('wheel', (event) => {
        // 嘗試獲取滑鼠下的 video 或 audio 元素，若沒有則獲取頁面上第一個 video 或 audio 元素
        const media = event.target.closest('video, audio') || document.querySelector('video, audio');
        if (!media) return;

        // 僅當按下 Ctrl 或 Shift 時阻止滾動
        if (!event.ctrlKey && !event.shiftKey) {
            return;
        }

        // 阻止網頁滾動與縮放
        event.preventDefault();

        // 滾動方向反轉
        const deltaY = -event.deltaY;

        // Ctrl + 滾輪：調整播放速度
        if (event.ctrlKey) {
            const delta = Math.sign(deltaY) * 0.1; // 每次增減 0.1 倍速
            const newPlaybackRate = Math.max(0.1, Math.min(media.playbackRate + delta, 16)); // 限制範圍 0.1 到 16
            media.playbackRate = newPlaybackRate;
            showHUD(media, `播放速度：${newPlaybackRate.toFixed(1)}x`);
        }

        // Shift + 滾輪：調整音量
        if (event.shiftKey) {
            const delta = Math.sign(deltaY) * 0.05; // 每次增減 0.05 音量
            const newVolume = Math.max(0, Math.min(media.volume + delta, 1)); // 限制範圍 0 到 1
            media.volume = newVolume;
            showHUD(media, `音量：${Math.round(newVolume * 100)}%`);
        }
    }, { passive: false }); // 設定 { passive: false } 以確保可以攔截預設行為
})();
