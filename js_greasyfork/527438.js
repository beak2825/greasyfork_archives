// ==UserScript==
// @name         nexus click - prod
// @namespace    nexus.xyz
// @version      2025-06-27 01
// @description  app.nexus.xyz click
// @author       Skye
// @match        https://app.nexus.xyz
// @icon         https://www.google.com/s2/favicons?sz=64&domain=app.nexus.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527438/nexus%20click%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/527438/nexus%20click%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 时间配置 =====
    const FIRST_DELAY = 30000;         // 首次检测延迟（毫秒）
    const CHECK_INTERVAL = 60000;      // 检查点击间隔（毫秒）
    const REFRESH_INTERVAL = 1800000;  // 自动刷新间隔（毫秒，30分钟）
    const REFRESH_CHECK = 60000;       // 自动刷新检查频率（毫秒，1分钟）
    // ====================

    // 日志封装，带时间戳和前缀
    function log(msg) {
        console.log(`[AutoClick][${new Date().toLocaleTimeString()}] ${msg}`);
    }

    // 时间格式化辅助函数（毫秒转"X分钟Y秒"）
    function formatMs(ms) {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        if (min && sec) return `${min}分钟${sec}秒`;
        if (min) return `${min}分钟`;
        if (sec) return `${sec}秒`;
        return `${ms}毫秒`;
    }

    // 检查并点击按钮
    function checkAndClick() {
        try {
            // 1. 找到id为connect-toggle-button的div
            const btn = document.getElementById('connect-toggle-button');
            if (!btn) {
                log('未找到connect-toggle-button');
                return;
            }
            // 2. 查找其同级div元素（排除自己）
            const parent = btn.parentElement;
            if (!parent) {
                log('connect-toggle-button没有父元素');
                return;
            }
            let hasSiblingDiv = false;
            for (let node of parent.children) {
                if (node.tagName === 'DIV' && node !== btn) {
                    hasSiblingDiv = true;
                    break;
                }
            }
            // 3. 如果有同级div，则点击connect-toggle-button
            if (hasSiblingDiv) {
                log('未启动，执行点击');
                btn.click();
                log('已启动');
            } else {
                log(`已启动，${formatMs(CHECK_INTERVAL)}后再次检测`);
            }
            // 4. 检测btn是否有click事件，如果没有则刷新页面
            const clickEvents = getEventListeners ? getEventListeners(btn) : null;
            if (!clickEvents || !clickEvents.click || clickEvents.click.length === 0) {
                log('按钮没有click事件，刷新页面');
                location.reload();
                return;
            }
        } finally {
            setTimeout(checkAndClick, CHECK_INTERVAL);
        }
    }

    // 定时自动刷新页面
    function setupAutoRefresh() {
        log(`页面运行${formatMs(REFRESH_INTERVAL)}后，自动刷新`);
        let startTime = Date.now();
        setInterval(function() {
            const elapsed = Date.now() - startTime;
            log(`页面已运行：${formatMs(elapsed)}`);
            if (elapsed > REFRESH_INTERVAL) { // 30分钟
                log(`页面已运行${formatMs(REFRESH_INTERVAL)}，自动刷新`);
                location.reload();
            }
        }, REFRESH_CHECK); // 每分钟检查一次
    }

    // 启动首次检测
    function setupFirstCheck() {
        window.addEventListener('load', function() {
            log(`${formatMs(FIRST_DELAY)}后开始执行`);
            setTimeout(checkAndClick, FIRST_DELAY);
        });
    }

    // 主入口
    function main() {
        log('脚本启动...');
        setupAutoRefresh();
        setupFirstCheck();
    }

    main();
})();