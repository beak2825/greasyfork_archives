// ==UserScript==
// @name         Bilibili Auto Crop Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动打开Bilibili播放器的裁切模式
// @author       F_thx
// @match        https://www.bilibili.com/video/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519647/Bilibili%20Auto%20Crop%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/519647/Bilibili%20Auto%20Crop%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const defaultSettings = {
        cropPortrait: false,
        maxCropPercentage: 0.65
    };

    // 加载用户设置
    const userSettings = {
        cropPortrait: GM_getValue('cropPortrait', defaultSettings.cropPortrait),
        maxCropPercentage: GM_getValue('maxCropPercentage', defaultSettings.maxCropPercentage)
    };

    // 保存用户设置
    function saveSettings() {
        GM_setValue('cropPortrait', userSettings.cropPortrait);
        GM_setValue('maxCropPercentage', userSettings.maxCropPercentage);
    }

    // 添加菜单命令
    GM_registerMenuCommand('竖屏视频裁切', () => {
        userSettings.cropPortrait = !userSettings.cropPortrait;
        saveSettings();
        alert(`是否裁切竖屏视频: ${userSettings.cropPortrait}`);
    });

    GM_registerMenuCommand('最大裁切比例', () => {
        const input = prompt('输入最大裁切比例 (0.1 ~ 1 默认0.65):', userSettings.maxCropPercentage);
        const value = parseFloat(input);
        if (value >= 0.1 && value <= 1) {
            userSettings.maxCropPercentage = value;
            saveSettings();
            alert(`最大裁切比例已改为: ${userSettings.maxCropPercentage}`);
        } else {
            alert('错误: 输入的值不在0.1 ~ 1之间');
        }
    });

    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'p') {
            const cropModeButton = document.querySelector('.bpx-player-ctrl-setting-fit-mode .bui-switch-input');
            if (cropModeButton) {
                cropModeButton.click();
                console.log('Crop Mode Toggled');
            }
        }
    });

    // 监听全屏事件
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            enableCropMode();
        }
    });

    function enableCropMode() {
        const cropModeButton = document.querySelector('.bpx-player-ctrl-setting-fit-mode .bui-switch-input');
        
        if (cropModeButton && __playinfo__) {
            //console.warn('00 检查裁切模式');
            const videoInfo = __playinfo__.data.dash.video[0];
            const videoWidth = videoInfo.width;
            const videoHeight = videoInfo.height;
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            //console.warn('00 1 视频宽高:', videoWidth, videoHeight, ' 00 屏幕宽高:', screenWidth, screenHeight);

            // 判断是否需要启用裁切模式
            const isPortraitVideo = videoHeight > videoWidth;
            const isExcessiveCrop = (videoWidth / screenWidth < userSettings.maxCropPercentage) || 
                                    (videoHeight / screenHeight < userSettings.maxCropPercentage);
            //console.warn('00 竖屏视频:', isPortraitVideo);
            //console.warn('00 裁切过度:', isExcessiveCrop);
            //console.warn('00 裁切范围:', userSettings.maxCropPercentage,' 00 竖屏裁切:', userSettings.cropPortrait);

            if ((!isPortraitVideo || userSettings.cropPortrait) && !isExcessiveCrop && !cropModeButton.checked) {
                cropModeButton.click(); // 模拟点击以启用裁切模式
                console.log('00 裁切启用');
            }
        }
    }
})();