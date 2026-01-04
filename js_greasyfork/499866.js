// ==UserScript==
// @name         GPT互动脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  GPT互动脚本,避免gpt断开连接，导致需要反复刷新验证
// @author       zhanjunxiang
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        zhanjunxiang
// @license      All Rights Reserved

// @downloadURL https://update.greasyfork.org/scripts/499866/GPT%E4%BA%92%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499866/GPT%E4%BA%92%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function simulateInput() {
    const sendButton = document.querySelector('[data-testid*="stop"]');  // 查找包含 "stop" 的 data-testid 属性的按钮
    if (sendButton) {
        return;
    }

    const inputBox = document.getElementById('prompt-textarea');  // 替换为实际的输入框ID
    if (inputBox && inputBox.value.trim() === '') {
        inputBox.value = '你好，ChatGPT！';  // 输入内容
        inputBox.dispatchEvent(new Event('input', { bubbles: true }));  // 模拟输入事件
    } 
}

// 每隔一段时间执行一次 simulateInput
setInterval(simulateInput, 1 * 60 * 1000);  // 每分钟执行一次

function simulateSubmit() {
    const sendButton = document.querySelector('[data-testid*="stop"]');  // 查找包含 "stop" 的 data-testid 属性的按钮
    if (sendButton) {
        return;
    }

    // 延迟一秒钟后执行
    setTimeout(() => {
        const inputBox = document.getElementById('prompt-textarea');
        const inputValue = inputBox ? inputBox.value.trim() : '';
        const expectedValue = '你好，ChatGPT！';

        // 判断输入框内容是否为预期值，执行后续逻辑
        if (inputValue === expectedValue) {
            // 找到发送按钮，并触发点击事件
            const sendButton = document.getElementById('prompt-textarea').parentElement.nextElementSibling;
            if (sendButton) {
                sendButton.click();  // 触发点击事件
            } 
        }
    }, 1000);  // 延迟一秒钟
}


// 每隔一段时间执行一次 simulateSubmit
setInterval(simulateSubmit, 1 * 60 * 1000);  // 每分钟执行一次