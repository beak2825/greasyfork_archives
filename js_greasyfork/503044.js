// ==UserScript==
// @name         GPT识别入参 prompt 然后输入发送
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @license      MIT
// @description  GPT识别入参 prompt 发送
// @author       Torin
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503044/GPT%E8%AF%86%E5%88%AB%E5%85%A5%E5%8F%82%20prompt%20%E7%84%B6%E5%90%8E%E8%BE%93%E5%85%A5%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/503044/GPT%E8%AF%86%E5%88%AB%E5%85%A5%E5%8F%82%20prompt%20%E7%84%B6%E5%90%8E%E8%BE%93%E5%85%A5%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 获取URL中的查询参数
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // 将文本插入到GPT的输入框
    function fillGPTInputAndSend(text) {
        // 查找输入框
        const inputBox = document.querySelector('textarea');

        if (inputBox) {
            // 设置输入框的值
            inputBox.value = text;

            // 触发事件使GPT识别输入
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));

            // 查找并点击发送按钮
            const intervalId = setInterval(() => {
                const sendButton = document.querySelector('button[data-testid="send-button"]');
                if (sendButton) {
                    sendButton.click();
                    // 点击发送按钮
                    clearInterval(intervalId);
                    // 找到发送按钮后停止查找
                }
            }, 1000);
        } else {
            console.log("未找到输入框");
        }
    }

    // 获取prompt参数的值
    const promptValue = getQueryParam('prompt');

    // 如果URL中有prompt参数，则自动填入并发送
    if (promptValue) {
        // 在页面完全加载后执行
        window.addEventListener('load', function() {
            // 等待输入框加载
            setTimeout(() => {
                fillGPTInputAndSend(promptValue);
            }, 1000);
            // 这里设置延迟，确保页面元素加载完成
        });
    }
})();