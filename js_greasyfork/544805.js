// ==UserScript==
// @name         希速云api JSON Formatter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  希速云api JSON格式化
// @author       jiemo
// @match        https://api.sdbj.top/api/*
// @noframes
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544805/%E5%B8%8C%E9%80%9F%E4%BA%91api%20JSON%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/544805/%E5%B8%8C%E9%80%9F%E4%BA%91api%20JSON%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 唯一的触发条件：URL中是否包含 "apiKey" 这个词
    if (!window.location.href.includes('apiKey')) {
        return; // 如果不包含，脚本立即停止，不执行任何操作
    }

    // =========================================================================
    // 如果脚本执行到这里，说明URL匹配成功，下面的日志一定会显示在F12控制台
    console.log('[JSON Formatter] URL matched. Script is running.');
    // =========================================================================

    function formatJsonContent(text) {
        try {
            const jsonObj = JSON.parse(text.trim());
            console.log('[JSON Formatter] Successfully parsed JSON.');

            // 清空页面，准备注入格式化后的内容
            document.body.innerHTML = '';
            document.head.innerHTML = '';

            GM_addStyle(`
                body {
                    margin: 0; padding: 0; background-color: #282c34;
                    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                }
                pre {
                    padding: 20px; margin: 0; font-size: 14px;
                    white-space: pre-wrap; word-break: break-all; color: #abb2bf;
                }
            `);

            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(jsonObj, null, 4); // 4个空格缩进
            document.body.appendChild(pre);
            return true;
        } catch (e) {
            console.error('[JSON Formatter] Failed to parse content as JSON.', e);
            return false;
        }
    }

    // 检查页面是否已经有内容
    const initialText = document.body.textContent;
    if (initialText && initialText.trim().length > 2) {
        console.log('[JSON Formatter] Content already exists on page load. Attempting to format.');
        formatJsonContent(initialText);
        return;
    }

    // 如果页面加载时是空的，则使用 MutationObserver 等待内容出现
    console.log('[JSON Formatter] Page is empty. Setting up MutationObserver to wait for content.');
    const observer = new MutationObserver((mutations, obs) => {
        const bodyText = document.body.textContent;
        if (bodyText && bodyText.trim().length > 2) {
            console.log('[JSON Formatter] Detected content added to the page.');
            if (formatJsonContent(bodyText)) {
                obs.disconnect(); // 任务完成，停止观察
                console.log('[JSON Formatter] Observer disconnected.');
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();