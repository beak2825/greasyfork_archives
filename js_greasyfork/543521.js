// ==UserScript==
// @name         Google AI Studio - 强制开启“自动保存”
// @name:en      Google AI Studio - Always Enable Autosave
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ensures the "Autosave" toggle on Google AI Studio's prompt page is always enabled. Uses a reliable selector to avoid race conditions.
// @description:zh-CN 确保 Google AI Studio 提示页面上的“自动保存”开关始终处于开启状态。使用可靠的选择器，避免因动态ID导致的执行失败问题。
// @author       Fine
// @match        https://aistudio.google.com/prompts/*
// @icon         https://www.google.com/s2/favicons?domain=aistudio.google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543521/Google%20AI%20Studio%20-%20%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%E2%80%9C%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/543521/Google%20AI%20Studio%20-%20%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%E2%80%9C%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    const consolePrefix = '[AI Studio Autosave Enabler v2.0]';
    // 使用更可靠的 aria-label 来定位按钮
    // Use the more reliable aria-label to select the button
    const buttonSelector = 'button[aria-label="Autosave toggle"]';
    let lastCheckedState = null; // 用于避免在控制台重复输出日志

    /**
     * 检查并开启指定的开关按钮
     * Checks and enables the specified toggle button.
     */
    function checkAndEnableToggle() {
        const toggleButton = document.querySelector(buttonSelector);

        // 如果按钮不存在，则不做任何事，等待下一次 DOM 变化
        // If the button doesn't exist, do nothing and wait for the next DOM change.
        if (!toggleButton) {
            // 如果之前检测到过按钮，现在又不见了，重置状态
            if (lastCheckedState !== null) {
                console.log(`${consolePrefix} "Autosave" button disappeared, waiting for it to reappear.`);
                lastCheckedState = null;
            }
            return;
        }

        const isChecked = toggleButton.getAttribute('aria-checked') === 'true';

        // 如果状态是关闭的，则点击它
        // If the state is OFF, click it.
        if (!isChecked) {
            console.log(`${consolePrefix} "Autosave" is OFF. Clicking to enable it.`);
            toggleButton.click();
            lastCheckedState = true; // 假定点击后会变成 true
        } else {
            // 只有当状态从未被记录或从关闭变为开启时，才打印日志，避免刷屏
            // Only log when the state is first recorded or changes to ON, to avoid console spam.
            if (lastCheckedState !== true) {
                console.log(`${consolePrefix} "Autosave" is already ON.`);
                lastCheckedState = true;
            }
        }
    }

    // MutationObserver 可以高效地监视 DOM 变化。
    // 我们让它持续运行，以应对单页应用(SPA)的组件重新渲染。
    // The MutationObserver efficiently watches for DOM changes.
    // We let it run continuously to handle component re-rendering in Single Page Applications (SPAs).
    const observer = new MutationObserver(() => {
        // 每次DOM有变动，都重新检查一次开关状态
        // Every time the DOM changes, re-check the toggle's status.
        checkAndEnableToggle();
    });

    // 开始观察整个文档的 body 部分，包括其所有子孙节点的变化。
    // Start observing the entire document body and its descendants for changes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 脚本启动时也立即运行一次，以处理页面加载时按钮已存在的情况。
    // Also run it once immediately on script start, to handle cases where the button already exists on page load.
    console.log(`${consolePrefix} Script loaded. Waiting for "Autosave" button...`);
    checkAndEnableToggle();

})();