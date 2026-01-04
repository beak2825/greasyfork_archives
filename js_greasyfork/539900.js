// ==UserScript==
// @name         YouTube 快速多倍速按鈕
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  在YouTube播放器右下角控制列新增四個倍速（X1、X1.5、X2、X3）按鈕，並即時顯示當前影片播放速度
// @author       Tunafin
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539900/YouTube%20%E5%BF%AB%E9%80%9F%E5%A4%9A%E5%80%8D%E9%80%9F%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539900/YouTube%20%E5%BF%AB%E9%80%9F%E5%A4%9A%E5%80%8D%E9%80%9F%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 動態插入自訂CSS
    function appendStyle() {
    if (document.getElementById('tm-ytp-speed-btn-style')) return;
    const style = document.createElement('style');
    style.id = 'tm-ytp-speed-btn-style';
    style.textContent = `
.tm-ytp-speed-btn {
    text-align: center;
    width: 40px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    border: 1px solid #fff;
    border-radius: 4px;
    background: transparent;
    color: #fff;
    padding: 0;
    margin-left: 4px;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
}
.tm-ytp-speed-btn:hover {
    background: rgba(255,255,255,0.1);
}
#tm-ytp-current-rate {
    display: inline-block;
    color: #ffc107 !important;
    font-weight: bold;
    font-size: 22px !important;
    text-shadow: 0 0 8px #000, 0 0 2px #fff;
    letter-spacing: 1px;
    border-radius: 4px;
    user-select: none;
}

/* 對部分使用者的新版播放器 UI 的臨時版優化 */
.ytp-right-controls-left,
.ytp-right-controls-right {
    align-items: center;
}
.ytp-right-controls-left > button,
.ytp-right-controls-right > button {
    min-height: 40px;
    line-height: normal;
}
`;
        document.head.appendChild(style);
    }

    // 取得影片當前播放速度
    function getCurrentRate() {
        const video = document.querySelector('video');
        return video ? video.playbackRate : 1;
    }

    // 顯示當前倍數（會自動刷新）
    function createCurrentRateDisplay() {
        let display = document.getElementById('tm-ytp-current-rate');
        if (!display) {
            display = document.createElement('span');
            display.id = 'tm-ytp-current-rate';
        }
        return display;
    }

    let rateInterval = null;
    function updateCurrentRateDisplay() {
        const display = createCurrentRateDisplay();
        const rate = getCurrentRate();
        display.textContent = `×${rate}`;
    }

    // 設定影片播放速度
    function setVideoRate(rate) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = rate;
        }
    }

    // 產生一個倍速按鈕，只加 tm-ytp-speed-btn class（已移除 ytp-button）
    function createSpeedButton(rate, label) {
        const btn = document.createElement('button');
        btn.id = `tm-ytp-speed-btn-${label.replace('.', '-')}`;
        btn.className = 'tm-ytp-speed-btn';
        btn.title = `影片${label}倍速`;

        btn.textContent = `×${label}`;

        btn.onclick = () => {
            setVideoRate(rate);
            setTimeout(updateCurrentRateDisplay, 100);
        };

        return btn;
    }

    // 將4個按鈕和當前倍數插到控制列
    function addSpeedButtons() {
        const controls = document.querySelector('.ytp-right-controls');
        if (!controls) return;

        // 設定為 flex 排版 (未使用flex時新添加的按鈕會跑版，原因未知)
        controls.style.display = "flex";
        controls.style.alignItems = "center";

        // 先移除前一次插入的
        ['tm-ytp-speed-btn-1', 'tm-ytp-speed-btn-1-5', 'tm-ytp-speed-btn-2', 'tm-ytp-speed-btn-3', 'tm-ytp-current-rate'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.remove();
        });

        // 加入 X3、X2、X1.5、X1（順序為右到左）
        controls.insertBefore(createSpeedButton(3, '3'), controls.firstChild);
        controls.insertBefore(createSpeedButton(2, '2'), controls.firstChild);
        controls.insertBefore(createSpeedButton(1.5, '1.5'), controls.firstChild);
        controls.insertBefore(createSpeedButton(1, '1'), controls.firstChild);

        // 插入顯示當前倍數的區塊（插在最左邊）
        const display = createCurrentRateDisplay();
        controls.insertBefore(display, controls.firstChild);

        // 啟動定時刷新
        if (rateInterval) clearInterval(rateInterval);
        rateInterval = setInterval(updateCurrentRateDisplay, 1000);
        updateCurrentRateDisplay();
    }

    function setup() {
        appendStyle();
        addSpeedButtons();
        window.addEventListener('yt-navigate-finish', addSpeedButtons);
    }

    let tried = 0;
    function waitForControls() {
        if (document.querySelector('.ytp-right-controls')) {
            setup();
        } else if (tried < 20) {
            setTimeout(waitForControls, 500);
            tried++;
        }
    }
    waitForControls();
})();