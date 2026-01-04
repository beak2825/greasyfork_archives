// ==UserScript==
// @name         芒果TV自动关闭弹幕
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  芒果TV网页端，自动关闭弹幕。
// @author       malagebidi
// @icon         https://www.mgtv.com/favicon.ico
// @match        *://*.mgtv.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519526/%E8%8A%92%E6%9E%9CTV%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/519526/%E8%8A%92%E6%9E%9CTV%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const config = {
        checkInterval: 1000,  // 检查间隔(毫秒)
        selectors: {
            danmuSwitch: '._danmuSwitcher_1qow5_208',
            activeClass: '_on_1qow5_238',
            videoPlayer: '#mgtv-player-wrap'  // 视频播放器容器
        }
    };

    function closeDanmaku() {
        const danmuSwitch = document.querySelector(config.selectors.danmuSwitch);
        
        if (danmuSwitch && danmuSwitch.classList.contains(config.selectors.activeClass)) {
            danmuSwitch.click();
            console.log('已自动关闭弹幕');
            return true;
        }
        return false;
    }

    function watchVideoChange() {
        // 监听视频播放器区域的变化
        const videoObserver = new MutationObserver((mutations) => {
            closeDanmaku();
        });

        // 监听URL变化
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(closeDanmaku, 1500); // 页面切换后延迟执行
            }
        });

        // 开始监听视频播放器区域
        const playerContainer = document.querySelector(config.selectors.videoPlayer);
        if (playerContainer) {
            videoObserver.observe(playerContainer, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }

        // 监听整个文档的URL变化
        urlObserver.observe(document, {
            subtree: true,
            childList: true
        });
    }

    function init() {
        // 初始关闭弹幕
        const initialObserver = new MutationObserver((mutations, obs) => {
            if (closeDanmaku()) {
                obs.disconnect();
                watchVideoChange(); // 开始监听视频变化
            }
        });

        initialObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();