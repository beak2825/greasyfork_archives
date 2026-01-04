// ==UserScript==
// @name         YouTube Quick Speed Interface
// @name:en      YouTube Quick Speed Interface
// @namespace    https://twitter.com/CobleeH
// @version      1.14
// @description  Add a quick speed interface to YouTube's middle-bottom area without interfering with existing controls.
// @description:en  Add a quick speed interface to YouTube's middle-bottom area without interfering with existing controls.
// @author       CobleeH
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466690/YouTube%20Quick%20Speed%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/466690/YouTube%20Quick%20Speed%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const speeds = [0.5, 1, 1.5, 2, 3];

    // 創建速度控件
    function createSpeedOptions() {
        const speedContainer = document.createElement('div');
        speedContainer.classList.add('ytp-speed-options');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        speedContainer.style.position = 'absolute';
        speedContainer.style.right = '15px'; // 放在中間偏右的位置
        speedContainer.style.bottom = '55px'; // 略高於進度條
        speedContainer.style.zIndex = '9999';
        speedContainer.style.background = 'rgba(0, 0, 0, 0.7)';
        speedContainer.style.borderRadius = '5px';
        speedContainer.style.padding = '5px 10px';
        speedContainer.style.color = '#fff';
        speedContainer.style.fontSize = '14px';

        // 添加標籤
        const label = document.createElement('span');
        label.innerText = 'Speed:';
        label.style.marginRight = '8px';
        speedContainer.appendChild(label);

        // 添加速度選項
        speeds.forEach(speed => {
            const option = document.createElement('div');
            option.innerText = speed + 'x';
            option.style.cursor = 'pointer';
            option.style.margin = '0 5px';

            option.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = speed;
                    highlightOption(option);
                }
            });

            speedContainer.appendChild(option);
        });

        return speedContainer;
    }

    // 高亮選擇的速度選項
    function highlightOption(selectedOption) {
        const options = document.querySelectorAll('.ytp-speed-options div');
        options.forEach(option => {
            option.style.color = '#fff';
            option.style.fontWeight = 'normal';
        });
        selectedOption.style.color = '#ff0';
        selectedOption.style.fontWeight = 'bold';
    }

    // 插入速度選項到播放器
    function insertSpeedOptions() {
        const chromeBottom = document.querySelector('.ytp-chrome-bottom');
        if (!chromeBottom || document.querySelector('.ytp-speed-options')) return;

        const speedOptions = createSpeedOptions();
        chromeBottom.appendChild(speedOptions);

        // 設置初始高亮
        setInitialSpeedHighlight();
    }

    // 初始化高亮速度選項
    function setInitialSpeedHighlight() {
        const currentSpeed = document.querySelector('video')?.playbackRate || 1;
        const options = document.querySelectorAll('.ytp-speed-options div');
        options.forEach(option => {
            if (option.innerText === currentSpeed + 'x') {
                highlightOption(option);
            }
        });
    }

    // 使用 MutationObserver 監聽播放器變動
    const observer = new MutationObserver(() => {
        insertSpeedOptions();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 頁面加載完成後執行
    window.addEventListener('load', insertSpeedOptions);
})();
