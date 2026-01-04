// ==UserScript==
// @name         F2 自动按键开关（Todesk云电脑版）
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  一键开启F2连招功能，Todesk云电脑专用
// @author       Kimi
// @match        https://daas.todesk.com/*
// @icon         https://daas.todesk.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537533/F2%20%E8%87%AA%E5%8A%A8%E6%8C%89%E9%94%AE%E5%BC%80%E5%85%B3%EF%BC%88Todesk%E4%BA%91%E7%94%B5%E8%84%91%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537533/F2%20%E8%87%AA%E5%8A%A8%E6%8C%89%E9%94%AE%E5%BC%80%E5%85%B3%EF%BC%88Todesk%E4%BA%91%E7%94%B5%E8%84%91%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== 常量定义 ======
    const REMOTE_VIDEO_SELECTOR = "#remoteP2PVideo";
    const HOTKEY = 'h';
    const F2_KEY = 'F2';
    const F2_KEYCODE = 113;

    // ====== 状态变量 ======
    let isF2Enabled = false;
    let rafId = null;
    let targetElement = null;

    // ====== DOM 创建 ======
    const style = document.createElement('style');
    style.textContent = `
    .kimi-f2-panel {
        position: fixed;
        top: 18px;
        right: 24px;
        z-index: 999999;
        display: flex;
        align-items: center;
        font-family: 'Segoe UI', 'Arial', sans-serif;
    }
    .kimi-f2-btn {
        background: linear-gradient(90deg, #b2f7ef 0%, #5fd3bc 100%);
        color: #234;
        border: none;
        border-radius: 24px;
        padding: 10px 28px;
        font-size: 17px;
        font-weight: bold;
        box-shadow: 0 4px 16px rgba(95,211,188,0.10);
        cursor: pointer;
        transition: background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.1s;
        outline: none;
        position: relative;
    }
    .kimi-f2-btn.running {
        background: linear-gradient(90deg, #a8edea 0%, #fed6e3 100%);
        color: #234;
        box-shadow: 0 4px 24px rgba(168,237,234,0.18);
    }
    .kimi-f2-btn:hover, .kimi-f2-btn:focus {
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 8px 32px rgba(95,211,188,0.18);
    }
    .kimi-f2-tooltip {
        visibility: hidden;
        opacity: 0;
        max-width: 240px;
        word-break: break-all;
        background: rgba(220,245,235,0.98);
        color: #234;
        text-align: left;
        border-radius: 8px;
        padding: 8px 16px;
        position: fixed;
        z-index: 1000000;
        font-size: 15px;
        pointer-events: none;
        transition: opacity 0.2s;
        box-shadow: 0 2px 12px rgba(95,211,188,0.10);
        right: 36px;
        top: 60px;
    }
    .kimi-f2-btn:hover + .kimi-f2-tooltip,
    .kimi-f2-btn:focus + .kimi-f2-tooltip,
    .kimi-f2-btn:active + .kimi-f2-tooltip {
        visibility: visible;
        opacity: 1;
    }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.className = 'kimi-f2-panel';

    const statusButton = document.createElement('button');
    statusButton.className = 'kimi-f2-btn';
    statusButton.textContent = '未开启';
    statusButton.setAttribute('tabindex', '0');
    statusButton.setAttribute('aria-label', 'F2自动连招开关');

    const tooltip = document.createElement('div');
    tooltip.className = 'kimi-f2-tooltip';
    tooltip.textContent = '点击或按下 H 键开启一键连招';

    panel.appendChild(statusButton);
    panel.appendChild(tooltip);
    document.body.appendChild(panel);

    // ====== 功能函数 ======

    // 动态调整 tooltip 位置，防止溢出
    function adjustTooltipPosition() {
        const rect = statusButton.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        let right = window.innerWidth - rect.right + 12;
        let top = rect.bottom + 8;
        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top - tooltipRect.height - 8;
        }
        if (rect.right + tooltipRect.width > window.innerWidth) {
            right = 12;
        }
        tooltip.style.right = right + 'px';
        tooltip.style.top = top + 'px';
    }

    // 模拟 F2 按键
    function simulateF2() {
        if (!isF2Enabled || !targetElement) return;
        const keydownEvent = new KeyboardEvent('keydown', {
            key: F2_KEY,
            keyCode: F2_KEYCODE,
            which: F2_KEYCODE,
            bubbles: true,
            cancelable: true
        });
        targetElement.dispatchEvent(keydownEvent);
        // 每秒触发一次
        if (isF2Enabled) {
            rafId = setTimeout(() => requestAnimationFrame(simulateF2), 1000);
        }
    }
    function simulateF2Keyup() {
        if (!targetElement) return;
        const keyupEvent = new KeyboardEvent('keyup', {
            key: F2_KEY,
            keyCode: F2_KEYCODE,
            which: F2_KEYCODE,
            bubbles: true,
            cancelable: true
        });
        targetElement.dispatchEvent(keyupEvent);
    }

    // 状态切换
    function startF2() {
        if (isF2Enabled) return;
        isF2Enabled = true;
        statusButton.textContent = '运行中';
        statusButton.classList.add('running');
        simulateF2();
    }
    function stopF2() {
        if (!isF2Enabled) return;
        isF2Enabled = false;
        clearTimeout(rafId);
        simulateF2Keyup();
        statusButton.textContent = '未开启';
        statusButton.classList.remove('running');
    }
    function toggleF2() {
        if (isF2Enabled) {
            stopF2();
        } else {
            startF2();
        }
    }

    // ====== 事件绑定 ======
    function bindEvents() {
        // 鼠标悬停/聚焦时调整 tooltip
        statusButton.addEventListener('mouseenter', adjustTooltipPosition);
        statusButton.addEventListener('focus', adjustTooltipPosition);
        statusButton.addEventListener('touchstart', adjustTooltipPosition);

        // 按钮点击切换
        statusButton.addEventListener('click', toggleF2);

        // 键盘快捷键切换
        document.addEventListener('keydown', (event) => {
            if (event.repeat) return; // 防止长按多次触发
            if (event.key.toLowerCase() === HOTKEY) {
                toggleF2();
            }
        });

        // 键盘回车/空格激活按钮
        statusButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleF2();
            }
        });
    }

    // ====== 初始化 ======
    function init() {
        targetElement = document.querySelector(REMOTE_VIDEO_SELECTOR);
        if (targetElement) {
            bindEvents();
        } else {
            tooltip.textContent = '未找到目标元素，请刷新页面或稍后重试';
            statusButton.disabled = true;
            statusButton.style.opacity = '0.6';
            statusButton.style.cursor = 'not-allowed';
        }
    }

    window.addEventListener('load', init);
})();
