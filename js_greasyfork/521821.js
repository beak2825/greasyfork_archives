// ==UserScript==
// @name         云学堂防离开跳过 YunXueTang Stay Active Pro
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  防止云学堂检测离开页面并自动点击继续学习
// @match        https://*.yunxuetang.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521821/%E4%BA%91%E5%AD%A6%E5%A0%82%E9%98%B2%E7%A6%BB%E5%BC%80%E8%B7%B3%E8%BF%87%20YunXueTang%20Stay%20Active%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/521821/%E4%BA%91%E5%AD%A6%E5%A0%82%E9%98%B2%E7%A6%BB%E5%BC%80%E8%B7%B3%E8%BF%87%20YunXueTang%20Stay%20Active%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始WebForm函数
    const originalCanFocus = window.WebForm_CanFocus;
    const originalIsInVisibleContainer = window.WebForm_IsInVisibleContainer;

    // 覆盖WebForm的可见性检查
    window.WebForm_IsInVisibleContainer = function(ctrl) {
        return true; // 强制返回可见
    };

    // 覆盖WebForm的焦点检查
    window.WebForm_CanFocus = function(element) {
        if (!element || !(element.tagName)) return false;
        var tagName = element.tagName.toLowerCase();
        return WebForm_IsFocusableTag(tagName); // 简化焦点检查
    };

    // 处理继续学习按钮
    function handleContinueStudy() {
        try {
            // 1. 查找所有可能的按钮元素
            const possibleButtons = [];
            const selectors = [
                'input[type="button"]',
                'input[type="submit"]',
                'button',
                'a[onclick]',
                'a[href="#"]',
                'div[onclick]',
                'span[onclick]'
            ];

            // 收集所有可能的按钮
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => possibleButtons.push(el));
            });

            // 2. 遍历并检查每个按钮
            for (const button of possibleButtons) {
                const buttonText = (button.value || button.innerText || button.textContent || '').trim();
                const buttonHtml = button.innerHTML || '';

                if (buttonText === '继续学习' || buttonHtml.includes('继续学习')) {
                    // 确保按钮可见和可交互
                    if (isElementVisible(button)) {
                        console.log('找到继续学习按钮:', button);

                        // 尝试多种方式触发点击
                        triggerButtonClick(button);
                        return true;
                    }
                }
            }

            // 3. 查找iframe中的按钮
            const iframes = document.getElementsByTagName('iframe');
            for (const iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeButtons = iframeDoc.querySelectorAll(selectors.join(','));

                    for (const button of iframeButtons) {
                        const buttonText = (button.value || button.innerText || button.textContent || '').trim();
                        if (buttonText === '继续学习') {
                            console.log('在iframe中找到继续学习按钮');
                            triggerButtonClick(button);
                            return true;
                        }
                    }
                } catch (e) {
                    console.log('访问iframe失败:', e);
                }
            }
        } catch (e) {
            console.log('查找按钮时出错:', e);
        }
        return false;
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
    }

    // 触发按钮点击
    function triggerButtonClick(button) {
        try {
            // 1. 确保按钮可以获得焦点
            button.disabled = false;

            // 2. 模拟鼠标移动到按钮上
            const mouseoverEvent = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(mouseoverEvent);

            // 3. 尝试原生点击
            button.click();

            // 4. 使用WebForm的点击方法
            if (typeof WebForm_SimulateClick === 'function') {
                WebForm_SimulateClick(button, new Event('click'));
            }

            // 5. 触发所有可能的事件
            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(event);
            });

            console.log('成功触发按钮点击');
        } catch (e) {
            console.log('触发按钮点击失败:', e);
        }
    }

    // 覆盖页面可见性API
    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        }
    });

    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        }
    });

    // 阻止各种事件
    const events = [
        'visibilitychange',
        'webkitvisibilitychange',
        'blur',
        'focusout',
        'pagehide'
    ];

    events.forEach(event => {
        window.addEventListener(event, function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }, true);

        document.addEventListener(event, function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }, true);
    });

    // 自适应检查间隔
    let checkInterval = 1000; // 初始1秒
    let maxInterval = 5000;  // 最大5秒
    let currentInterval = checkInterval;

    function checkAndHandle() {
        if (handleContinueStudy()) {
            currentInterval = checkInterval;
        } else {
            currentInterval = Math.min(currentInterval * 1.5, maxInterval);
        }
        setTimeout(checkAndHandle, currentInterval);
    }

    // 开始检查
    checkAndHandle();

    // 保持页面活跃
    function keepActive() {
        // 模拟鼠标移动
        const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: Math.random() * window.innerWidth,
            clientY: Math.random() * window.innerHeight
        });
        document.dispatchEvent(event);

        // 模拟滚动
        window.scrollBy(0, 1);
        setTimeout(() => window.scrollBy(0, -1), 500);
    }

    // 更频繁地保持活跃
    setInterval(keepActive, 15000);

    console.log('云学堂防检测脚本已启动 - WebForms专用版 2.3');
})();
