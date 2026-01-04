// ==UserScript==
// @name         监控按钮状态并自动点击
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监控按钮状态并自动点击22
// @license MIT
// @author       You
// @match        https://loud.hololaunch.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537884/%E7%9B%91%E6%8E%A7%E6%8C%89%E9%92%AE%E7%8A%B6%E6%80%81%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/537884/%E7%9B%91%E6%8E%A7%E6%8C%89%E9%92%AE%E7%8A%B6%E6%80%81%E5%B9%B6%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const POLL_INTERVAL = 2000; // 轮询间隔（毫秒）
    const REFRESH_INTERVAL = 10000; // 页面刷新间隔（毫秒），可根据需要调整

    let pollCount = 0;
    let lastRefreshTime = Date.now();

    // 日志函数
    function log(message) {
        console.log(`[自动点击脚本] ${new Date().toLocaleTimeString()}: ${message}`);
    }

    // 查找目标按钮的函数
    function findTargetButton() {
        // 常见的按钮选择器，你可能需要根据实际情况调整
        const selectors = [
            'button:not([disabled])',
            '.btn:not([disabled])',
            '[role="button"]:not([disabled])',
            'input[type="button"]:not([disabled])',
            'input[type="submit"]:not([disabled])',
            // 可以添加更多选择器
        ];

        for (let selector of selectors) {
            const buttons = document.querySelectorAll(selector);
            for (let button of buttons) {
                // 检查按钮文本或其他属性来确定是否是目标按钮
                const text = button.textContent || button.value || '';

                // 这里添加你想要点击的按钮的特征
                // 例如包含特定文字、特定类名等
                if (text.toLowerCase().includes('join') ||
                    text.toLowerCase().includes('buy') ||
                    text.toLowerCase().includes('purchase') ||
                    text.toLowerCase().includes('presale') ||
                    button.classList.contains('presale-btn') ||
                    button.id.includes('presale')) {

                    // 确保按钮可见且可点击
                    const style = window.getComputedStyle(button);
                    if (style.display !== 'none' &&
                        style.visibility !== 'hidden' &&
                        !button.disabled &&
                        !button.classList.contains('disabled')) {
                        return button;
                    }
                }
            }
        }
        return null;
    }

    // 点击按钮函数
    function clickButton(button) {
        try {
            log(`找到可点击按钮: ${button.textContent || button.value || '未知按钮'}`);

            // 滚动到按钮位置
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 等待一小段时间后点击
            setTimeout(() => {
                // 触发多种点击事件以确保兼容性
                button.focus();

                // 创建鼠标事件
                const mouseEvents = ['mousedown', 'mouseup', 'click'];
                mouseEvents.forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    button.dispatchEvent(event);
                });

                log('按钮点击完成！');

                // 点击后等待一段时间，避免重复点击
                setTimeout(startPolling, 5000);

            }, 500);

        } catch (error) {
            log(`点击按钮时出错: ${error.message}`);
            setTimeout(startPolling, POLL_INTERVAL);
        }
    }

    // 刷新页面函数
    function refreshPage() {
        log('刷新页面...');
        location.reload();
    }

    // 轮询函数
    function poll() {
        pollCount++;
        log(`第 ${pollCount} 次检测按钮状态...`);

        const button = findTargetButton();

        if (button) {
            log('发现可点击按钮！');
            clickButton(button);
            return; // 找到按钮后停止轮询
        } else {
            log('按钮暂不可用，继续等待...');

            // 检查是否需要刷新页面
            const currentTime = Date.now();
            if (currentTime - lastRefreshTime > REFRESH_INTERVAL) {
                lastRefreshTime = currentTime;
                refreshPage();
                return;
            }

            // 继续轮询
            setTimeout(poll, POLL_INTERVAL);
        }
    }

    // 开始轮询
    function startPolling() {
        log('开始监控按钮状态...');
        // 等待页面加载完成后开始
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(poll, 1000);
            });
        } else {
            setTimeout(poll, 1000);
        }
    }

    // 页面加载完成后启动脚本
    if (window.location.href.includes('loud.hololaunch.ai')) {
        log('脚本已启动，正在监控目标网站...');
        startPolling();
    }

    // 监听页面变化（适用于SPA应用）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 页面内容发生变化，重新检查按钮
                const button = findTargetButton();
                if (button) {
                    log('页面更新后发现可点击按钮！');
                    clickButton(button);
                }
            }
        });
    });

    // 开始观察页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();