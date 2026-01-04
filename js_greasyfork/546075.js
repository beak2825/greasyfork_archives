// ==UserScript==
// @name         B站自动打开字幕
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动检测B站视频字幕状态，在字幕关闭时自动打开，支持标题变化检测（适用于剧集/番剧切换）
// @author       Jackfeng
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546075/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/546075/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：字幕打开状态的路径特征（可根据实际情况调整）
    const OPEN_PATH_FRAGMENT = 'M40,-30';
    // 检测间隔（毫秒）
    const CHECK_INTERVAL = 1500;

    // 存储上一次的标题
    let lastTitle = '';
    // 定时器ID
    let titleCheckTimer = null;
    let subtitleCheckTimer = null;

    /**
     * 初始化脚本
     */
    function init() {
        // 初始加载时执行一次
        setTimeout(checkAndOpenSubtitle, 2000);

        // 启动定时器
        startTimers();

        // 页面卸载时清理资源
        window.addEventListener('unload', cleanup);
    }

    /**
     * 启动所有定时器
     */
    function startTimers() {
        // 标题变化检测定时器
        titleCheckTimer = setInterval(checkTitleChange, CHECK_INTERVAL);

        // 字幕状态检测定时器（双重保障）
        subtitleCheckTimer = setInterval(checkAndOpenSubtitle, CHECK_INTERVAL);
    }

    /**
     * 检查标题变化
     */
    function checkTitleChange() {
        try {
            // 获取当前标题（优先读取Vue渲染的标题）
            const titleElement = document.querySelector('title[data-vue-meta="true"]');
            const currentTitle = titleElement ? titleElement.textContent.trim() : document.title.trim();

            if (currentTitle && currentTitle !== lastTitle) {
                console.log(`[B站自动字幕] 标题变化: ${lastTitle || '空'} → ${currentTitle}`);
                lastTitle = currentTitle;
                checkAndOpenSubtitle();
            }
        } catch (error) {
            console.error('[B站自动字幕] 标题检测出错:', error);
        }
    }

    /**
     * 检查并打开字幕（仅在关闭时）
     */
    function checkAndOpenSubtitle() {
        try {
            // 定位字幕按钮图标
            const subtitleButton = document.querySelector(
                '.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon'
            );

            if (!subtitleButton) {
                console.log('[B站自动字幕] 未找到字幕按钮（可能尚未加载）');
                return;
            }

            // 检查字幕打开状态的路径特征
            const isSubtitleOpen = document.querySelector(
                `.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon path[d*="${OPEN_PATH_FRAGMENT}"]`
            ) !== null;

            if (!isSubtitleOpen) {
                subtitleButton.click();
                console.log('[B站自动字幕] 已自动打开字幕');
            } else {
                // 调试信息，可根据需要注释
                // console.log('[B站自动字幕] 字幕已打开，无需操作');
            }
        } catch (error) {
            console.error('[B站自动字幕] 字幕检测/操作出错:', error);
        }
    }

    /**
     * 清理资源
     */
    function cleanup() {
        if (titleCheckTimer) clearInterval(titleCheckTimer);
        if (subtitleCheckTimer) clearInterval(subtitleCheckTimer);
        console.log('[B站自动字幕] 脚本已停止');
    }

    // 启动脚本
    init();
})();
