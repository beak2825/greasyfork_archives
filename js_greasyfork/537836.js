// ==UserScript==
// @name         B站自动镜像翻转视频
// @namespace    http://tampermonkey.net/
// @version      2025-05-31-03
// @description  部分视频为了解决版权问题，发布时会进行水平翻转，该脚本可自动翻转回去。
// @author       Curtion
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537836/B%E7%AB%99%E8%87%AA%E5%8A%A8%E9%95%9C%E5%83%8F%E7%BF%BB%E8%BD%AC%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/537836/B%E7%AB%99%E8%87%AA%E5%8A%A8%E9%95%9C%E5%83%8F%E7%BF%BB%E8%BD%AC%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFlipped = false; // 默认不镜像
    let button = null;
    let observer = null;
    let debounceTimer = null; // 添加防抖定时器
    let isToggling = false; // 添加切换状态标记

    // 初始翻转所有视频
    function flipAllVideos() {
        const videos = document.querySelectorAll("video");
        console.log(`找到 ${videos.length} 个视频元素`);
        videos.forEach(it => it.style.transform = 'scaleX(-1)');
    }

    // 恢复所有视频
    function restoreAllVideos() {
        const videos = document.querySelectorAll("video");
        console.log(`恢复 ${videos.length} 个视频元素`);
        videos.forEach(video => {
            // 使用多种方式确保重置成功
            video.style.transform = '';
            video.style.webkitTransform = '';
            // 强制重绘
            video.offsetHeight;
        });
    }

    // 创建浮动按钮
    function createFloatingButton() {
        // 如果按钮已存在，先移除
        if (button) {
            button.remove();
        }

        button = document.createElement('button');
        button.id = 'videoFlipButton';
        button.innerHTML = isFlipped ? '已翻转' : '未翻转';

        // 设置按钮样式
        button.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            padding: 10px 15px !important;
            background: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
            transition: background 0.3s !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;

        // 增强的事件监听器
        function handleClick(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleFlip();
        }

        function handleMouseEnter() {
            button.style.background = '#0056b3 !important';
        }

        function handleMouseLeave() {
            button.style.background = '#007bff !important';
        }

        // 移除旧的事件监听器（如果存在）
        button.removeEventListener('click', handleClick);
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);

        // 添加事件监听器
        button.addEventListener('click', handleClick, { passive: false });
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        document.body.appendChild(button);
        console.log('浮动按钮已创建，当前状态:', isFlipped ? '已翻转' : '未翻转');
    }

    // 切换翻转状态
    function toggleFlip() {
        isToggling = true; // 标记正在切换
        isFlipped = !isFlipped;
        if (isFlipped) {
            flipAllVideos();
            button.innerHTML = '已翻转';
        } else {
            restoreAllVideos();
            button.innerHTML = '未翻转';
        }
        console.log('切换到:', isFlipped ? '已翻转' : '未翻转');

        // 延迟重置切换标记，避免observer立即触发
        setTimeout(() => {
            isToggling = false;
        }, 1000);
    }

    // 检查按钮是否失效并重建
    function checkButtonHealth() {
        if (!button || !document.body.contains(button)) {
            console.log('检测到按钮丢失，重新创建');
            createFloatingButton();
        }
    }

    // 监听页面变化
    function observePageChanges() {
        observer = new MutationObserver(() => {
            // 如果正在切换状态，跳过处理
            if (isToggling) {
                return;
            }

            // 使用防抖机制
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                // 检查是否有新的视频元素，并且当前状态为翻转
                if (document.querySelectorAll("video").length > 0 && isFlipped) {
                    flipAllVideos();
                }

                // 检查按钮健康状态
                checkButtonHealth();
            }, 300); // 增加防抖延迟
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待页面完全加载
    function waitForPageLoad() {
        let retryCount = 0;
        const maxRetries = 20;

        function checkAndInit() {
            retryCount++;
            console.log(`检查页面加载状态，尝试第 ${retryCount} 次`);

            if (document.body && document.readyState === 'complete') {
                console.log('页面加载完成，开始初始化');
                init();
            } else if (retryCount < maxRetries) {
                setTimeout(checkAndInit, 500);
            } else {
                console.log('等待超时，强制初始化');
                init();
            }
        }

        checkAndInit();
    }

    // 初始化函数
    function init() {
        try {
            // 默认不翻转，所以不调用 flipAllVideos()
            createFloatingButton();
            observePageChanges();

            // 定期检查按钮健康状态
            setInterval(checkButtonHealth, 5000);

            console.log('脚本初始化完成，默认状态: 未翻转');
        } catch (error) {
            console.error('脚本初始化失败:', error);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForPageLoad);
    } else {
        waitForPageLoad();
    }
})();