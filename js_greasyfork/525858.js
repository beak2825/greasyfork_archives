// ==UserScript==
// @name        bilibili播放视频时隐藏顶部栏/Blibli Hide Top-bar when Video Playing
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      -
// @description 2/4/2025, 6:44:39 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525858/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E6%97%B6%E9%9A%90%E8%97%8F%E9%A1%B6%E9%83%A8%E6%A0%8FBlibli%20Hide%20Top-bar%20when%20Video%20Playing.user.js
// @updateURL https://update.greasyfork.org/scripts/525858/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E6%97%B6%E9%9A%90%E8%97%8F%E9%A1%B6%E9%83%A8%E6%A0%8FBlibli%20Hide%20Top-bar%20when%20Video%20Playing.meta.js
// ==/UserScript==
//(Made By Alright Peaches Studio, Baidu or Google this studio)
(function() {
    'use strict';

    // 定义顶部栏的选择器
    const TOP_BAR_SELECTOR = '.bili-header__bar';

    // 隐藏顶部栏的函数
    function hideTopBar() {
        const topBar = document.querySelector(TOP_BAR_SELECTOR);
        if (topBar) {
            topBar.style.transition = 'opacity 0.3s';
            topBar.style.opacity = '0';
            topBar.style.pointerEvents = 'none'; // 防止顶部栏拦截鼠标事件
        }
    }

    // 显示顶部栏的函数
    function showTopBar() {
        const topBar = document.querySelector(TOP_BAR_SELECTOR);
        if (topBar) {
            topBar.style.opacity = '1';
            topBar.style.pointerEvents = 'auto'; // 恢复鼠标事件
        }
    }

    // 初始隐藏顶部栏
    hideTopBar();

    // 监听鼠标移动事件
    document.addEventListener('mousemove', function(event) {
        if (event.clientY < 50) { // 鼠标接近页面顶端
            showTopBar();
        } else {
            hideTopBar();
        }
    });

    // 监听页面变化（防止动态加载导致脚本失效）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 如果顶部栏被重新加载，重新隐藏
                hideTopBar();
            }
        });
    });

    // 开始观察页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();