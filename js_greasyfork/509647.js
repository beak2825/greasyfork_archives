// ==UserScript==
// @name         B站 C键开关字幕
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  使用C键快速切换B站视频字幕开关
// @author       Your Name
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509647/B%E7%AB%99%20C%E9%94%AE%E5%BC%80%E5%85%B3%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/509647/B%E7%AB%99%20C%E9%94%AE%E5%BC%80%E5%85%B3%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

// 立即执行函数，用于封装整个脚本逻辑
(function() {
    'use strict';

    // 定义变量，用于跟踪字幕是否开启
    let subtitlesEnabled = false;

    // 设置按键监听器
    function setupKeyListeners() {
        // 移除之前的按键监听器，防止重复注册
        document.removeEventListener('keydown', setupKeyListeners);

        // 添加新的按键监听器
        document.addEventListener('keydown', function(event) {
            // 检测是否按下了'C'键
            if (event.key === 'c' || event.key === 'C') {
                // 调用切换字幕函数
                toggleSubtitle();
            }
        });
    }

    // 切换字幕状态
    function toggleSubtitle() {
        // 查找字幕按钮
        const subtitleButton = document.querySelector('div.bpx-player-ctrl-subtitle-major-content > div > div');

        // 检查是否找到了字幕按钮
        if (subtitleButton) {
            // 切换字幕开启状态
            subtitlesEnabled = !subtitlesEnabled;
            // 模拟点击字幕按钮
            subtitleButton.click();
            // 输出当前状态到控制台
            console.log(`字幕现在${subtitlesEnabled ? '已打开' : '已关闭'}`);
        } else {
            // 如果没有找到字幕按钮，输出警告信息
            console.warn("字幕按钮未找到，可能已被移除或尚未加载完成。");
        }
    }

    // 在页面加载完成后执行初始化函数
    window.onload = function() {
        // 设置按键监听器
        setupKeyListeners();
    };
})();