// ==UserScript==
// @name         GPT窄屏回车恢复发送内容
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  修复 ChatGPT 窄屏下因历史记录疑似被检测为移动端导致回车变成换行的问题
// @author       wzj042
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516257/GPT%E7%AA%84%E5%B1%8F%E5%9B%9E%E8%BD%A6%E6%81%A2%E5%A4%8D%E5%8F%91%E9%80%81%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/516257/GPT%E7%AA%84%E5%B1%8F%E5%9B%9E%E8%BD%A6%E6%81%A2%E5%A4%8D%E5%8F%91%E9%80%81%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const textareaSelector = '.text-token-text-primary div[contenteditable]';
    const buttonSelector = "button[data-testid='send-button']";

    // 为 document 添加全局的 keydown 事件监听器
    document.addEventListener("keydown", function(event) {
        // 检查是否按下了 Enter 键，且没有按下Shift 键
        if (event.key === "Enter" &&  !event.shiftKey ) {
            // 获取 textarea 和按钮元素
            const textarea = document.querySelector(textareaSelector);
            const button = document.querySelector(buttonSelector);

            // 检查 textarea 和按钮是否存在，并且 textarea 中是否有内容
            if (textarea && button && textarea.innerText.trim() !== "") {
                event.preventDefault();  // 阻止默认的 Enter 行为，如换行
                button.click();          // 点击按钮
                console.log("已点击发送按钮");
            }
        }
    });
})();
