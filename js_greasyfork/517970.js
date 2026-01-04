// ==UserScript==
// @name         魔学院_移除鼠标限制,自动关闭弹窗,按c加速
// @namespace    https://t.me/mycutcbot
// @version      0.5
// @description  Auto Close Popups for Learning Site & Block Mouse Leave Popup Improved
// @author       ziqs
// @match        *://*.study.moxueyuan.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/517970/%E9%AD%94%E5%AD%A6%E9%99%A2_%E7%A7%BB%E9%99%A4%E9%BC%A0%E6%A0%87%E9%99%90%E5%88%B6%2C%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97%2C%E6%8C%89c%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/517970/%E9%AD%94%E5%AD%A6%E9%99%A2_%E7%A7%BB%E9%99%A4%E9%BC%A0%E6%A0%87%E9%99%90%E5%88%B6%2C%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97%2C%E6%8C%89c%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 定义一个阻止事件的函数
    function preventEvent(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    // 监听 `mouseleave`, `mouseout`, 和 `blur` 事件
    ['mouseleave', 'mouseout', 'blur'].forEach(eventType => {
        window.addEventListener(eventType, preventEvent, true);
        document.addEventListener(eventType, preventEvent, true);
    });

    // 定时移除动态添加的事件监听器
    const observer = new MutationObserver(() => {
        document.querySelectorAll('*').forEach(element => {
            try {
                element.onmouseleave = null;
                element.onmouseout = null;
                element.onblur = null;
            } catch (error) {
                console.error(`Error clearing event listeners on ${element}`, error);
            }
        });
    });

    // 开始监听 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });

})();


(function() {
    'use strict';

    // 监听 <body> 的类名变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const bodyClass = document.body.className;

                // 检查是否包含 el-popup-parent--hidden 类
                if (bodyClass.includes('el-popup-parent--hidden')) {
                    console.log('Popup detected, attempting to click "I am here" button after delay');

                    // 延迟 5 秒点击按钮
                    setTimeout(() => {
                        // 查找所有符合条件的按钮
                        const buttons = document.querySelectorAll('.dialog-footer-cancel');
                        for (const button of buttons) {
                            if (button.textContent.includes('我在')) {
                                button.click();
                                console.log('"I am here" button clicked after 5 seconds');
                                break;
                            }
                        }
                    }, 2000); // 5秒延迟（5000毫秒）
                }
            }
        }
    });

    // 开始监听 <body> 的属性变化
    observer.observe(document.body, { attributes: true });

})();



//时间加快
(function() {
    'use strict';

    // 时间加速倍率
    const speedMultiplier = 16;

    // 初始状态为关闭
    let isAccelerated = false;

    // 记录原始 Date 和定时器
    const originalDate = Date;
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    const startTime = Date.now();
    const startRealTime = originalDate.now();

    class AcceleratedDate extends originalDate {
        constructor(...args) {
            if (args.length === 0) {
                super(startRealTime + (originalDate.now() - startTime) * speedMultiplier);
            } else {
                super(...args);
            }
        }

        static now() {
            return startRealTime + (originalDate.now() - startTime) * speedMultiplier;
        }
    }

    // 切换加速状态函数
    function toggleAcceleration() {
        isAccelerated = !isAccelerated;
        if (isAccelerated) {
            // 启用加速
            window.Date = AcceleratedDate;
            window.setTimeout = function(callback, delay, ...args) {
                return originalSetTimeout(callback, delay / speedMultiplier, ...args);
            };
            window.setInterval = function(callback, delay, ...args) {
                return originalSetInterval(callback, delay / speedMultiplier, ...args);
            };
            console.log('Time acceleration enabled!');
        } else {
            // 恢复原始状态
            window.Date = originalDate;
            window.setTimeout = originalSetTimeout;
            window.setInterval = originalSetInterval;
            console.log('Time acceleration disabled!');
        }
    }

    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'c') {
            toggleAcceleration();
        }
    });

    console.log('Press "C" to toggle time acceleration. Default is disabled.');
})();



// 新增：自动点击"确定"按钮功能
(function() {
    'use strict';

    // 目标弹窗特征
    const DIALOG_WRAPPER_CLASS = 'el-dialog__wrapper';
    const DIALOG_CLASS = 'el-dialog';
    const CONFIRM_BUTTON_CLASS = 'dialog-footer-confirmed';

    // 检查是否是目标弹窗
    function isTargetDialog(dialog) {
        // 检查弹窗标题是否为"提示"
        const header = dialog.querySelector('.el-dialog__header');
        if (header && header.textContent.includes('提示')) {
            // 检查弹窗内容是否包含特定文本
            const body = dialog.querySelector('.el-dialog__body');
            if (body && body.textContent.includes('已完成本章节，是否继续学习下一章节')) {
                return true;
            }
        }
        return false;
    }

    // 点击确定按钮
    function clickConfirmButton() {
        // 查找所有可能的弹窗包装元素
        const dialogWrappers = document.querySelectorAll(`.${DIALOG_WRAPPER_CLASS}`);

        for (const wrapper of dialogWrappers) {
            // 检查包装元素是否可见 (z-index > 0)
            const zIndex = parseInt(wrapper.style.zIndex || 0);
            if (zIndex <= 0) continue;

            // 查找内部的弹窗
            const dialog = wrapper.querySelector(`.${DIALOG_CLASS}`);
            if (dialog && isTargetDialog(dialog)) {
                // 查找确定按钮
                const confirmButton = dialog.querySelector(`.${CONFIRM_BUTTON_CLASS}`);
                if (confirmButton) {
                    console.log('找到目标弹窗，点击"确定"按钮');
                    confirmButton.click();
                    return true;
                }
            }
        }
        return false;
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        // 检查是否有新弹窗出现
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查新增节点中是否有目标弹窗
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查是否是弹窗包装元素
                        if (node.classList.contains(DIALOG_WRAPPER_CLASS)) {
                            // 延迟1秒后尝试点击确定按钮
                            setTimeout(() => {
                                if (!clickConfirmButton()) {
                                    console.log('检测到弹窗包装元素，但未找到目标弹窗');
                                }
                            }, 1000);
                            return;
                        }

                        // 检查子节点中是否有弹窗包装元素
                        const wrappers = node.querySelectorAll(`.${DIALOG_WRAPPER_CLASS}`);
                        if (wrappers.length > 0) {
                            // 延迟1秒后尝试点击确定按钮
                            setTimeout(() => {
                                if (!clickConfirmButton()) {
                                    console.log('检测到弹窗包装元素，但未找到目标弹窗');
                                }
                            }, 1000);
                            return;
                        }
                    }
                }
            }
        }

        // 同时检查属性变化（弹窗可能已存在，只是显示状态改变）
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                // 检查是否是弹窗包装元素的z-index变化（变为可见）
                if (mutation.target.classList.contains(DIALOG_WRAPPER_CLASS) &&
                    mutation.attributeName === 'style') {
                    const zIndex = parseInt(mutation.target.style.zIndex || 0);
                    if (zIndex > 0) {
                        // 找到显示的目标弹窗，延迟1秒后点击确定按钮
                        setTimeout(() => {
                            if (!clickConfirmButton()) {
                                console.log('弹窗变为可见，但未找到目标弹窗内容');
                            }
                        }, 1000);
                        return;
                    }
                }
            }
        }
    });

    // 启动观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // 初始检查，以防弹窗在脚本加载前已经存在
    setTimeout(() => {
        if (!clickConfirmButton()) {
            console.log('初始检查未发现目标弹窗，继续监听中...');
        }
    }, 2000);

    console.log('已启动自动点击"确定"按钮功能');
})();