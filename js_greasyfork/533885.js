// ==UserScript==
// @name         Google AI Studio 自动保存提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击 Google AI Studio 中的 'Save Prompt' 按钮（当按钮可用时），并在按钮变灰后等待下次变为可用再点击。
// @author       Gemini 2.5 pro
// @match        *://aistudio.google.com/prompts/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_64x64.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533885/Google%20AI%20Studio%20%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/533885/Google%20AI%20Studio%20%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const checkInterval = 2000; // 每隔多少毫秒检查一次按钮状态 (单位：毫秒)
    const initialDelay = 3000;  // 脚本加载后等待多少毫秒开始运行 (确保页面元素加载)
    const saveButtonSelector = 'button[aria-label="Save prompt"][data-test-manual-save="outside"]'; // 保存按钮的选择器

    // --- 状态变量 ---
    let canClickSave = true; // 标记是否可以点击保存按钮

    // --- 主要逻辑函数 ---
    function checkAndClickSaveButton() {
        // 查找保存按钮
        const saveButton = document.querySelector(saveButtonSelector);

        if (saveButton) {
            // 检查按钮是否启用 (没有 disabled 属性)
            const isEnabled = !saveButton.disabled;

            if (isEnabled && canClickSave) {
                // 如果按钮可用并且我们标记为可以点击
                console.log('[AI Studio AutoSave] 检测到保存按钮可用，正在点击...');
                saveButton.click();
                canClickSave = false; // 点击后，标记为不可点击，直到按钮再次变灰
                console.log('[AI Studio AutoSave] 保存按钮已点击，等待按钮变灰...');
            } else if (!isEnabled) {
                // 如果按钮被禁用（变灰）
                if (!canClickSave) {
                     // 只有当之前是不可点击状态时才重置和打印日志，避免重复打印
                    console.log('[AI Studio AutoSave] 检测到保存按钮已禁用，准备下次点击...');
                    canClickSave = true; // 重置标记，允许在下次按钮启用时点击
                }
            } else {
                 // 按钮可用，但我们已经点击过一次，正在等待它变灰
                 // console.log('[AI Studio AutoSave] 保存按钮可用，但已点击过，等待按钮状态变化...');
            }
        } else {
            // console.log('[AI Studio AutoSave] 未找到保存按钮，继续检查...');
            // 如果找不到按钮，也允许下次尝试点击（可能页面结构变化或未完全加载）
            canClickSave = true;
        }
    }

    // --- 启动脚本 ---
    console.log('[AI Studio AutoSave] 脚本已加载，将在', initialDelay / 1000, '秒后开始运行...');

    // 延迟启动，给页面加载时间
    setTimeout(() => {
        console.log('[AI Studio AutoSave] 开始运行自动保存检查...');
        // 设置定时器，周期性检查按钮状态
        setInterval(checkAndClickSaveButton, checkInterval);
    }, initialDelay);

})();