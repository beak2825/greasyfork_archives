// ==UserScript==
// @name         Douyin Live Clean Mode Toggle Switch Style
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  抖音直播页纯净模式开关，开关滑块样式，带提示和自动隐藏，支持动态加载多个XPath元素隐藏
// @author       Jeff
// @match        https://live.douyin.com/*
// @match        https://www.douyin.com/root/live/*
// @grant        none
// @run-at       document-idle
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/540957/Douyin%20Live%20Clean%20Mode%20Toggle%20Switch%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/540957/Douyin%20Live%20Clean%20Mode%20Toggle%20Switch%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // XPath路径常量
    const XPATH_TARGET_1 = '/html/body/div[2]/div[3]/div/main/div[2]/div/pace-island/div/div/div/div[1]/div[7]';
    const XPATH_TARGET_2 = '/html/body/div[2]/div[3]/div/main/div[2]/div/pace-island/div/div/div/div[1]/div[2]/div/div[1]/div/div/div/pace-island[11]/div/div/div';
    const XPATH_TARGET_3 = '/html/body/div[2]/div[3]/div/main/div[2]/div/pace-island/div/div/div/div[1]/div[1]/div';

    // 通用XPath定位函数
    function getXPathTarget(path) {
        return document.evaluate(
            path,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
    #cleanModeToggleContainer {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        user-select: none;
        z-index: 999999;
        transition: opacity 0.5s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    /* 滑块背景 */
    #cleanModeToggle {
        position: relative;
        width: 50px;
        height: 26px;
        background: #ccc;
        border-radius: 13px;
        cursor: pointer;
        transition: background-color 0.3s;
        box-sizing: border-box;
        flex-shrink: 0;
    }
    /* 滑块圆球 */
    #cleanModeToggle::before {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 22px;
        height: 22px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
        transition: left 0.3s;
    }
    /* 开启状态背景 */
    #cleanModeToggle.active {
        background: #28a745;
        box-shadow: 0 0 8px rgba(40,167,69,0.6);
    }
    /* 开启状态滑块位置 */
    #cleanModeToggle.active::before {
        left: 26px;
    }
    /* 悬停效果 */
    #cleanModeToggle:hover {
        background: #999;
    }
    #cleanModeToggle.active:hover {
        background: #218838;
        box-shadow: 0 0 10px rgba(33,136,56,0.8);
    }
    /* 提示文字 - 修改颜色 */
    #cleanModeToggleTooltip {
        color: rgba(255, 255, 255, 0.85);
        font-size: 14px;
        user-select: none;
        white-space: nowrap;
        user-drag: none;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    }
`;

    document.head.appendChild(style);

    // 创建容器和滑块、提示文本
    const container = document.createElement('div');
    container.id = 'cleanModeToggleContainer';

    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'cleanModeToggle';

    const tooltip = document.createElement('div');
    tooltip.id = 'cleanModeToggleTooltip';
    tooltip.textContent = '纯净模式开关';

    container.appendChild(toggleBtn);
    container.appendChild(tooltip);
    document.body.appendChild(container);

    let cleanMode = false;
    let hideTimeout;

    // 获取固定id目标元素
    function getTargets() {
        const chatroom = document.getElementById('chatroom');
        const rightPanel = document.getElementById('__living_frame_right_panel_id');
        let siblingPanel = null;
        if (rightPanel && rightPanel.parentElement) {
            siblingPanel = rightPanel.nextElementSibling;
        }
        return {chatroom, siblingPanel};
    }

    // 隐藏元素（如果存在且未隐藏）
    function hideElement(el) {
        if (el && el.style.display !== 'none') {
            el.style.display = 'none';
        }
    }

    // 显示元素（恢复默认显示）
    function showElement(el) {
        if (el && el.style.display === 'none') {
            el.style.display = '';
        }
    }

    // 切换纯净模式状态
    function toggleCleanMode(on) {
        const {chatroom, siblingPanel} = getTargets();
        const xpathTarget1 = getXPathTarget(XPATH_TARGET_1);
        const xpathTarget2 = getXPathTarget(XPATH_TARGET_2);
        const xpathTarget3 = getXPathTarget(XPATH_TARGET_3);

        if (on) {
            hideElement(chatroom);
            hideElement(siblingPanel);
            hideElement(xpathTarget1);
            hideElement(xpathTarget2);
            hideElement(xpathTarget3);
        } else {
            showElement(chatroom);
            showElement(siblingPanel);
            showElement(xpathTarget1);
            showElement(xpathTarget2);
            showElement(xpathTarget3);
        }

        toggleBtn.classList.toggle('active', on);
    }

    // 点击滑块切换事件
    toggleBtn.addEventListener('click', () => {
        cleanMode = !cleanMode;
        toggleCleanMode(cleanMode);
    });

    // 监听DOM新增，动态隐藏
    const observer = new MutationObserver(() => {
        if (!cleanMode) return;

        const {chatroom, siblingPanel} = getTargets();
        const xpathTarget1 = getXPathTarget(XPATH_TARGET_1);
        const xpathTarget2 = getXPathTarget(XPATH_TARGET_2);
        const xpathTarget3 = getXPathTarget(XPATH_TARGET_3);

        hideElement(chatroom);
        hideElement(siblingPanel);
        hideElement(xpathTarget1);
        hideElement(xpathTarget2);
        hideElement(xpathTarget3);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 自动隐藏逻辑
    function resetHideTimer() {
        container.style.opacity = '1';
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            container.style.opacity = '0';
        }, 5000); // 5秒无动作后隐藏
    }

    ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(event => {
        window.addEventListener(event, resetHideTimer, {passive: true});
    });

    resetHideTimer();

    // 页面初始化时关闭纯净模式
    toggleCleanMode(cleanMode);

})();
