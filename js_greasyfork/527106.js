// ==UserScript==
// @name         DeepSeek 自动重试脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  当 DeepSeek 显示“服务器繁忙，请稍后再试。”时，自动点击“重新生成”按钮。
// @author       您的名字
// @match        https://chat.deepseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527106/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527106/DeepSeek%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置检查间隔（毫秒），这里设置为10秒
    const checkInterval = 10000;

    // 定义目标提示信息
    const targetMessage = '服务器繁忙，请稍后再试。';

    // 定时检查函数
    setInterval(() => {
        // 查找最新的提示信息
        const markdowns = document.getElementsByClassName('ds-markdown');
        const markdown = markdowns[markdowns.length - 1];  // 获取最新的提示信息

        if (markdown && markdown.textContent.includes(targetMessage)) {
            // 查找“重新生成”按钮
            const btns = document.getElementsByClassName('ds-icon-button');
            if (btns.length >= 3) {
                const retryButton = btns[btns.length - 3];  // 获取倒数第三个按钮
                retryButton.click();
                console.log('检测到服务器繁忙，已自动点击“重新生成”按钮。');
            } else {
                console.log('未找到“重新生成”按钮。');
            }
        }
    }, checkInterval);
})();
