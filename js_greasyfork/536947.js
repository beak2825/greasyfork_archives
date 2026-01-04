// ==UserScript==
// @name         F2 自动按键开关（点击按钮或按 H 键开启/关闭）
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  在网页右上角添加一个按钮，点击按钮或按 H 键开启或关闭 F2 自动按键功能。
// @author       Kimi
// @match        https://cg.163.com/*
// @match        https://cloudgame.ds.163.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536947/F2%20%E8%87%AA%E5%8A%A8%E6%8C%89%E9%94%AE%E5%BC%80%E5%85%B3%EF%BC%88%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE%E6%88%96%E6%8C%89%20H%20%E9%94%AE%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536947/F2%20%E8%87%AA%E5%8A%A8%E6%8C%89%E9%94%AE%E5%BC%80%E5%85%B3%EF%BC%88%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE%E6%88%96%E6%8C%89%20H%20%E9%94%AE%E5%BC%80%E5%90%AF%E5%85%B3%E9%97%AD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化变量
    let isF2Enabled = false; // 控制 F2 自动按键功能是否开启
    let intervalId; // 定时器 ID

    // 创建开关按钮
    const toggleButton = document.createElement('button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.fontSize = '14px';
    toggleButton.style.backgroundColor = '#4CAF50'; // 绿色
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.textContent = '开启 F2 连招';

    // 创建自定义工具提示
    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.top = '50px'; // 距离按钮下方一定距离
    tooltip.style.right = '10px';
    tooltip.style.padding = '5px 10px';
    tooltip.style.fontSize = '12px';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '5px';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s';
    tooltip.style.pointerEvents = 'none'; // 防止鼠标悬停在提示上时触发其他事件
    tooltip.textContent = '点击或按 H 键开启/关闭';

    // 确保按钮和工具提示在页面加载完成后添加
    window.addEventListener('load', () => {
        document.body.appendChild(toggleButton);
        document.body.appendChild(tooltip);
    });

    // 显示工具提示
    function showTooltip() {
        tooltip.style.opacity = '1';
    }

    // 隐藏工具提示
    function hideTooltip() {
        tooltip.style.opacity = '0';
    }

    // 模拟 F2 按键事件
    function simulateF2() {
        if (!isF2Enabled) return; // 如果功能已关闭，则不触发 F2
        const keydownEvent = new KeyboardEvent('keydown', {
            key: 'F2',
            keyCode: 113,
            which: 113,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keydownEvent);
    }

    // 模拟 F2 键盘松开事件
    function releaseF2() {
        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'F2',
            keyCode: 113,
            which: 113,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyupEvent);
    }

    // 开启 F2 自动按键功能
    function startF2Interval() {
        isF2Enabled = true;
        clearInterval(intervalId); // 确保清除之前的定时器
        intervalId = setInterval(simulateF2, 1000); // 每秒自动按下 F2 键
        toggleButton.textContent = '开启中...';
        toggleButton.style.backgroundColor = '#f44336'; // 红色
    }

    // 关闭 F2 自动按键功能
    function stopF2Interval() {
        isF2Enabled = false;
        clearInterval(intervalId); // 停止定时器
        intervalId = null; // 确保定时器 ID 被重置
        releaseF2(); // 派发 F2 的 keyup 事件，确保彻底“松开”按键
        toggleButton.textContent = '开启 F2 连招';
        toggleButton.style.backgroundColor = '#4CAF50'; // 绿色
    }

    // 点击按钮切换 F2 自动按键功能
    toggleButton.addEventListener('click', () => {
        if (isF2Enabled) {
            stopF2Interval(); // 关闭功能
        } else {
            startF2Interval(); // 开启功能
        }
    });

    // 按 H 键切换 F2 自动按键功能
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'h') {
            if (isF2Enabled) {
                stopF2Interval(); // 关闭功能
            } else {
                startF2Interval(); // 开启功能
            }
        }
    });

    // 鼠标悬停事件
    toggleButton.addEventListener('mouseenter', showTooltip);
    toggleButton.addEventListener('mouseleave', hideTooltip);
})();