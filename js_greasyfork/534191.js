// ==UserScript==
// @name         Telegram 中文及缅甸文发送阻止器
// @namespace    http://tampermonkey.net/
// @version      1.2 // Version bumped
// @description  在 Telegram Web (web.telegram.org/k/* 和 web.telegram.org/a/*) 中检测输入框内容，如果包含中文字符或缅甸文字符，则阻止消息发送（通过 Enter 或点击发送按钮），并短暂标红输入框。
// @author       AI Assistant & User Request
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_addStyle
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/534191/Telegram%20%E4%B8%AD%E6%96%87%E5%8F%8A%E7%BC%85%E7%94%B8%E6%96%87%E5%8F%91%E9%80%81%E9%98%BB%E6%AD%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534191/Telegram%20%E4%B8%AD%E6%96%87%E5%8F%8A%E7%BC%85%E7%94%B8%E6%96%87%E5%8F%91%E9%80%81%E9%98%BB%E6%AD%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    // Updated Regex: Includes Chinese (U+4E00-U+9FFF) and Burmese (U+1000-U+109F)
    const BLOCKED_SCRIPT_REGEX = /[\u4E00-\u9FFF]|[\u1000-\u109F]/;
    const BLOCK_INDICATOR_CLASS = 'blocked-script-input'; // More generic class name
    const BLOCK_TIMEOUT = 1500; // 红色边框显示时长 (毫秒)
    const SCRIPT_NAME = '发送阻止器'; // Generic name for logging

    // --- 选择器 ---
    const TG_INPUT_SELECTOR = 'div.input-message-input[contenteditable="true"]';
    // 尝试匹配发送按钮的多种可能选择器
    const SEND_BUTTON_SELECTOR = '.chat-input-area button.btn-send, .chat-input button[aria-label*="Send"], .chat-input button.btn-icon.rp[title="Send"]';

    // --- 添加 CSS 样式 ---
    GM_addStyle(`
        .${BLOCK_INDICATOR_CLASS} {
            border: 2px solid red !important;
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.7) !important;
            transition: border 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
        }
    `);

    // --- 核心逻辑 ---

    /**
     * 检查文本是否包含禁止的脚本字符 (中文或缅甸文)
     * @param {string} text - 要检查的文本
     * @returns {boolean} - 如果包含则返回 true, 否则返回 false
     */
    function containsBlockedScript(text) {
        if (!text) {
            return false;
        }
        return BLOCKED_SCRIPT_REGEX.test(text);
    }

    /**
     * 闪烁显示阻止提示 (红色边框)
     * @param {Element} element - 要添加提示效果的元素 (输入框)
     */
    function flashBlockedIndicator(element) {
        if (!element || element.classList.contains(BLOCK_INDICATOR_CLASS)) {
            return; // 如果元素不存在或已在闪烁中，则不执行
        }
        console.warn(`[${SCRIPT_NAME}] 尝试添加标红样式`);
        element.classList.add(BLOCK_INDICATOR_CLASS);
        setTimeout(() => {
            if (element) { // 再次检查元素是否存在
                 console.warn(`[${SCRIPT_NAME}] 尝试移除标红样式`);
                 element.classList.remove(BLOCK_INDICATOR_CLASS);
            }
        }, BLOCK_TIMEOUT);
    }

    /**
     * 处理可能触发发送的事件 (按键或点击)
     * @param {Event} event - 触发的事件对象
     */
    function handleSendAttempt(event) {
        const inputElement = document.querySelector(TG_INPUT_SELECTOR);
        if (!inputElement) {
            // console.log(`[${SCRIPT_NAME}] 未找到输入框，忽略事件`);
            return; // 如果找不到输入框，不执行任何操作
        }

        const text = inputElement.textContent || '';

        if (containsBlockedScript(text)) {
            // 阻止默认行为 (发送消息) 和事件传播
            event.preventDefault();
            event.stopImmediatePropagation(); // 使用 stopImmediatePropagation 更强力阻止
            console.warn(`[${SCRIPT_NAME}] 检测到禁止字符 (中文或缅甸文)，已阻止发送！触发来源: ${event.type === 'keydown' ? 'Enter 键' : '发送按钮点击'}`);
            flashBlockedIndicator(inputElement);
            return true; // 返回 true 表示已阻止
        }
        // console.log(`[${SCRIPT_NAME}] 未检测到禁止字符，允许发送。`);
        return false; // 返回 false 表示未阻止
    }

    // --- 事件监听 ---

    // 1. 监听 Enter 键按下 (使用捕获阶段更早拦截)
    document.addEventListener('keydown', function(event) {
        // 检查是否是目标输入框，是否是 Enter 键，并且没有 Shift/Ctrl/Alt 等修饰键 (通常用于换行)
        const targetIsInput = event.target.matches(TG_INPUT_SELECTOR);
         // 有些情况下焦点可能在输入框但事件目标是父级，也检查活动元素
        const activeIsInput = document.activeElement && document.activeElement.matches(TG_INPUT_SELECTOR);

        if ((targetIsInput || activeIsInput) && event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            // console.log(`[${SCRIPT_NAME}] 检测到 Enter 键按下`);
            handleSendAttempt(event);
        }
    }, true); // 使用捕获阶段

    // 2. 监听发送按钮点击 (使用捕获阶段更早拦截)
    document.addEventListener('click', function(event) {
        // 检查被点击的元素或其父元素是否匹配发送按钮选择器
        const sendButton = event.target.closest(SEND_BUTTON_SELECTOR);
        if (sendButton) {
            // console.log(`[${SCRIPT_NAME}] 检测到发送按钮点击`);
            handleSendAttempt(event);
        }
    }, true); // 使用捕获阶段

    // --- 初始化 ---
    const scriptInfo = typeof GM_info !== 'undefined' ? `v${GM_info.script.version}` : '(未知版本)';
    console.log(`[Telegram 中文及缅甸文发送阻止器 ${scriptInfo}] 脚本已加载并开始监听。`);

})();