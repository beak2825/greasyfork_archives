// ==UserScript==
// @name         快手直播禁用鼠标滚轮切换直播间
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁用快手直播页面的鼠标滚轮上下滚动切换直播间功能
// @author       You
// @match        https://live.kuaishou.com/*
// @match        https://*.kuaishou.com/live/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544707/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD%E7%A6%81%E7%94%A8%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E5%88%87%E6%8D%A2%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/544707/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD%E7%A6%81%E7%94%A8%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E5%88%87%E6%8D%A2%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止滚轮事件的函数
    function preventWheelSwitch(event) {
        // 检查是否在直播播放区域
        const target = event.target;
        const videoContainer = target.closest('.player-container, .live-player, .video-container, [class*="player"], [class*="video"]');

        if (videoContainer) {
            console.log('快手直播滚轮切换已被禁用');
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
        }
    }

    // 等待页面加载完成后执行
    function init() {
        // 移除可能存在的滚轮事件监听器
        document.addEventListener('wheel', preventWheelSwitch, {
            passive: false,
            capture: true
        });

        // 也处理 mousewheel 事件（兼容性）
        document.addEventListener('mousewheel', preventWheelSwitch, {
            passive: false,
            capture: true
        });

        // 处理 DOMMouseScroll 事件（Firefox兼容性）
        document.addEventListener('DOMMouseScroll', preventWheelSwitch, {
            passive: false,
            capture: true
        });

        console.log('快手直播滚轮切换禁用脚本已启动');
    }

    // 如果页面已经加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面变化（SPA应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000); // 延迟重新初始化
        }
    }).observe(document, { subtree: true, childList: true });

})();