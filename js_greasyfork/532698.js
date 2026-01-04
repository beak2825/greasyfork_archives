// ==UserScript==
// @name        Automatically Close Google AI Studio Settings Panel
// @name:zh-CN  自动关闭 Google AI Studio 设置面板
// @namespace   Violentmonkey Scripts
// @match       https://aistudio.google.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     1.1.20250413
// @author      plasma-green & Gemini 2.5 Pro Preview 03-25
// @description When the AI Studio page loads, the settings panel is automatically closed to save page space. By the way, this script was written by Gemini in AI Studio.
// @description:zh-CN 当 AI Studio 页面加载时，自动关闭设置面板以节省页面空间。顺带一提，这个脚本是 Gemini 在 AI Studio 中编写的。
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/532698/Automatically%20Close%20Google%20AI%20Studio%20Settings%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/532698/Automatically%20Close%20Google%20AI%20Studio%20Settings%20Panel.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- 配置 ---
    const buttonSelector = 'button[aria-label="Close run settings panel"]'; // 目标按钮的选择器
    const logPrefix = '[AutoClick RunSettings] '; // 日志前缀，方便调试
    const clickDelay = 1200; // 延迟时间 (毫秒)，2000ms = 2秒

    console.log(logPrefix + '脚本启动，开始监控按钮: ' + buttonSelector + '，延迟 ' + (clickDelay / 1000) + ' 秒');

    // 使用 WeakMap 来跟踪哪些按钮已经有待处理的点击计时器
    // WeakMap 的好处是当按钮元素从 DOM 中移除并被垃圾回收时，对应的条目也会自动移除，避免内存泄漏。
    const pendingClickTimeouts = new WeakMap();

    // --- 实际执行点击操作的函数 ---
    function performActualClick(button) {
        try {
            console.log(logPrefix + '执行点击...');
            // 尝试 dispatchEvent (无 view)
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            if (button.dispatchEvent(event)) {
                console.log(logPrefix + 'dispatchEvent(click) 成功。');
                return true;
            } else {
                 console.log(logPrefix + 'dispatchEvent(click) 执行但可能被取消。');
                 return true; // 认为已尝试
            }
        } catch (dispatchError) {
            console.warn(logPrefix + 'dispatchEvent 点击失败:', dispatchError);
            console.log(logPrefix + '尝试回退到 button.click()...');
            try {
                button.click(); // 回退
                console.log(logPrefix + 'button.click() 成功。');
                return true;
            } catch (clickError) {
                console.error(logPrefix + 'button.click() 也失败:', clickError);
                return false;
            }
        }
    }


    // --- 检查按钮状态并计划（或取消）延迟点击 ---
    function scheduleOrCancelClick(button) {
        // 检查按钮当前是否可见且可交互
        const isButtonClickable = button && document.body.contains(button) && button.offsetParent !== null && !button.disabled;

        if (isButtonClickable) {
            // 如果按钮可点击，并且 *没有* 正在等待的计时器
            if (!pendingClickTimeouts.has(button)) {
                console.log(logPrefix + '检测到可点击按钮，将在 ' + (clickDelay / 1000) + ' 秒后点击...');
                const timeoutId = setTimeout(() => {
                    // --- Timeout 回调 ---
                    // 再次检查按钮状态，确保在延迟期间它没有消失或变得不可点击
                    if (button && document.body.contains(button) && button.offsetParent !== null && !button.disabled) {
                        console.log(logPrefix + '延迟时间到，按钮仍然可点击。');
                        performActualClick(button);
                    } else {
                        console.log(logPrefix + '延迟时间到，但按钮已不可点击，取消本次点击。');
                    }
                    // 无论是否点击，都要从 WeakMap 中移除记录，允许下次重新调度
                    pendingClickTimeouts.delete(button);
                    // --- Timeout 回调结束 ---
                }, clickDelay);

                // 将计时器 ID 存入 WeakMap，标记这个按钮正在等待点击
                pendingClickTimeouts.set(button, timeoutId);
            } else {
                // console.log(logPrefix + '按钮已在等待点击计时中，忽略本次检测。'); // 可选调试日志
            }
        } else {
            // 如果按钮变得不可点击 (隐藏、禁用、移除) 并且 *有* 正在等待的计时器
            if (pendingClickTimeouts.has(button)) {
                console.log(logPrefix + '按钮变得不可点击，取消之前计划的延迟点击。');
                clearTimeout(pendingClickTimeouts.get(button)); // 清除计时器
                pendingClickTimeouts.delete(button); // 从 WeakMap 中移除记录
            }
        }
    }

    // --- MutationObserver 回调 ---
    const observerCallback = (mutationsList, observer) => {
        // 简单起见，每次DOM变化都重新查找按钮并评估状态
        // 优化：可以只检查与 buttonSelector 相关的变化，但通常 querySelector 性能足够
        const targetButton = document.querySelector(buttonSelector);

        if (targetButton) {
             // 如果按钮存在，调用调度函数来决定是否启动或什么都不做
             scheduleOrCancelClick(targetButton);
        } else {
            // 如果按钮在 DOM 中找不到了，我们需要检查是否有对应的计时器需要取消
            // （注意：如果按钮实例还在内存中且在WeakMap里，下面的逻辑可能不完美，
            // 但通常按钮不存在于DOM时，scheduleOrCancelClick(null)不会执行，
            // 而如果按钮实例还在但被隐藏/禁用，scheduleOrCancelClick会处理取消）
            // 简单起见，依赖 scheduleOrCancelClick 在按钮不可见时处理取消。
            // console.log(logPrefix + '未找到目标按钮。');
        }

        // --- 更精细的检查（可选）---
        // 如果性能有问题，可以像之前版本那样检查 mutationsList
        // 但需要在找到按钮或按钮消失时都调用 scheduleOrCancelClick
        /*
        for (const mutation of mutationsList) {
             // ... 检查添加、移除、属性变化 ...
             if (/* 按钮出现或变得可点击 * /) {
                 const button = mutation.target or found button;
                 scheduleOrCancelClick(button);
             } else if (/* 按钮消失或变得不可点击 * /) {
                  const button = mutation.target or previously known button;
                  // 需要一种方法获取到旧按钮的引用来取消计时器
                  // 这使得简单地每次重新 querySelector 更方便
             }
        }
        */
    };

    // --- 创建并配置观察器 ---
    const observer = new MutationObserver(observerCallback);
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true, // 监控属性变化也很重要，因为按钮可能通过 disabled 或 style/class 变化
        attributeFilter: ['disabled', 'class', 'style'] // 可以限定关心的属性
    };

    // --- 初始化脚本 ---
    function initialize() {
        if (document.body) {
            console.log(logPrefix + 'DOM 已准备好，执行首次检查并启动 MutationObserver...');
            const initialButton = document.querySelector(buttonSelector);
            if (initialButton) {
                scheduleOrCancelClick(initialButton); // 初始检查也走调度逻辑
            }
            observer.observe(document.body, observerConfig);
            console.log(logPrefix + 'MutationObserver 已启动。');
        } else {
            requestAnimationFrame(initialize);
        }
    }

    // --- 启动逻辑 ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // --- 清理 ---
    window.addEventListener('unload', () => {
        if (observer) {
            observer.disconnect();
            console.log(logPrefix + '页面卸载，MutationObserver 已断开。');
        }
        // 清理所有可能存在的待处理计时器
        // 遍历当前页面上所有匹配的按钮来查找并清除计时器
        document.querySelectorAll(buttonSelector).forEach(button => {
            if (pendingClickTimeouts.has(button)) {
                clearTimeout(pendingClickTimeouts.get(button));
                pendingClickTimeouts.delete(button);
                console.log(logPrefix + '页面卸载，清除了一个待处理的点击计时器。');
            }
        });
    });

    GM_addStyle(`
      /* 隐藏不需要的元素 */
      .header-container, .placeholder-overlay.ng-star-inserted {
          display: none !important;
    }`);
})();