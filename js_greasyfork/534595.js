// ==UserScript==
// @name         B站自动关闭连播
// @namespace    http://tampermonkey.net/
// @version      2025-05-01
// @description  自动关闭B站视频的自动连播功能
// @author       YuoHira
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534595/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/534595/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测并关闭自动连播功能
    function disableContinuousPlay() {
        // 查找自动连播按钮
        const continuousBtn = document.querySelector('.continuous-btn .switch-btn.on');

        // 如果找到了开启状态的按钮，则点击它以关闭
        if (continuousBtn) {
            console.log('检测到自动连播已开启，正在关闭...');
            continuousBtn.click();
            console.log('自动连播已关闭');
        } else {
            console.log('自动连播已经是关闭状态或未找到相关元素');
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 页面加载完成后立即执行一次
        disableContinuousPlay();

        // 3秒后再执行一次（处理可能的延迟加载情况）
        setTimeout(function() {
            disableContinuousPlay();
        }, 3000);
    });

    // 使用MutationObserver监听DOM变化，以防页面动态加载元素
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // 当有新节点添加时，检查是否需要关闭自动连播
                disableContinuousPlay();
            }
        }
    });

    // 开始观察文档变化
    observer.observe(document.body, { childList: true, subtree: true });
})();
