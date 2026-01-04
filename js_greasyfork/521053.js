// ==UserScript==
// @name         YouTube Quick Speed & Volume Interface
// @name:zh-TW   YouTube 快速倍速與音量控制介面
// @name:zh-CN   YouTube 快速倍速与音量控制界面
// @namespace    https://twitter.com/CobleeH
// @version      1.17
// @description  Add a quick speed and volume interface to YouTube's middle-bottom area without interfering with existing controls.
// @description:zh-TW  在YouTube的中下部區域添加一個快速速度和音量界面，而不干擾現有控件。
// @description:zh-CN  在YouTube的中下部区域添加一个快速速度和音量界面，而不干扰现有控件。
// @author       CobleeH
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521053/YouTube%20Quick%20Speed%20%20Volume%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/521053/YouTube%20Quick%20Speed%20%20Volume%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const speeds = [0.5, 1, 1.5, 2, 3];
    const volumes = [0, 0.15, 0.35, 0.65, 1];

    // 創建整體容器
    function createControlContainer() {
        const container = document.createElement('div');
        container.classList.add('ytp-control-container');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.position = 'absolute';
        container.style.right = '15px';
        container.style.bottom = '62px';
        container.style.zIndex = '9999';
        container.style.background = 'rgba(0, 0, 0, 0.7)';
        container.style.borderRadius = '5px';
        container.style.padding = '3px 6px'; // 縮小內邊距
        container.style.color = '#fff';
        container.style.fontSize = '12px'; // 字體縮小
        container.style.lineHeight = '1.2';

        const volumeOptions = createVolumeOptions();
        const speedOptions = createSpeedOptions();

        container.appendChild(volumeOptions);
        container.appendChild(speedOptions);
        return container;
    }

    // 創建音量控件
    function createVolumeOptions() {
        const volumeContainer = document.createElement('div');
        volumeContainer.classList.add('ytp-volume-options');
        volumeContainer.style.display = 'flex';
        volumeContainer.style.alignItems = 'center';
        volumeContainer.style.marginBottom = '4px'; // 縮小上下間距

        const label = document.createElement('span');
        label.innerText = 'Vol';
        label.style.marginRight = '6px';
        volumeContainer.appendChild(label);

        volumes.forEach(volume => {
            const option = document.createElement('div');
            option.innerText = (volume * 100) + '%';
            option.style.cursor = 'pointer';
            option.style.margin = '0 3px'; // 縮小選項間距
            option.style.padding = '2px 4px'; // 縮小內邊距

            option.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.volume = volume;
                    highlightOption(option, '.ytp-volume-options div');
                }
            });

            volumeContainer.appendChild(option);
        });

        return volumeContainer;
    }

    // 創建速度控件
    function createSpeedOptions() {
        const speedContainer = document.createElement('div');
        speedContainer.classList.add('ytp-speed-options');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';

        const label = document.createElement('span');
        label.innerText = 'Spd';
        label.style.marginRight = '6px';
        speedContainer.appendChild(label);

        speeds.forEach(speed => {
            const option = document.createElement('div');
            option.innerText = speed + 'x';
            option.style.cursor = 'pointer';
            option.style.margin = '0 3px'; // 縮小選項間距
            option.style.padding = '2px 4px'; // 縮小內邊距

            option.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = speed;
                    highlightOption(option, '.ytp-speed-options div');
                }
            });

            speedContainer.appendChild(option);
        });

        return speedContainer;
    }

    // 高亮所選選項
    function highlightOption(selectedOption, selector) {
        const options = document.querySelectorAll(selector);
        options.forEach(option => {
            option.style.color = '#fff';
            option.style.fontWeight = 'normal';
        });
        selectedOption.style.color = '#ff0';
        selectedOption.style.fontWeight = 'bold';
    }

    // 插入控件到播放器
    function insertControls() {
        const chromeBottom = document.querySelector('.ytp-chrome-bottom');
        if (!chromeBottom || document.querySelector('.ytp-control-container')) return;

        const controlContainer = createControlContainer();
        chromeBottom.appendChild(controlContainer);

        setInitialHighlight();
    }

    // 初始化高亮選項
    function setInitialHighlight() {
        const video = document.querySelector('video');
        if (!video) return;

        const currentSpeed = video.playbackRate || 1;
        const speedOptions = document.querySelectorAll('.ytp-speed-options div');
        speedOptions.forEach(option => {
            if (option.innerText === currentSpeed + 'x') {
                highlightOption(option, '.ytp-speed-options div');
            }
        });

        const currentVolume = video.volume || 1;
        const volumeOptions = document.querySelectorAll('.ytp-volume-options div');
        volumeOptions.forEach(option => {
            if (option.innerText === (currentVolume * 100) + '%') {
                highlightOption(option, '.ytp-volume-options div');
            }
        });
    }

    const observer = new MutationObserver(() => {
        insertControls();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', insertControls);
})();
