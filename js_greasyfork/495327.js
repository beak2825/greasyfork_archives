// ==UserScript==
// @name         禁止自动写入剪贴板并屏蔽弹窗
// @namespace    https://example.com/
// @version      1.1
// @description  阻止网页修改剪贴板内容并禁用alert、confirm、prompt对话框
// @author       kkocdko & Modified
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT; See https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/495327/%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E5%86%99%E5%85%A5%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B9%B6%E5%B1%8F%E8%94%BD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/495327/%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E5%86%99%E5%85%A5%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B9%B6%E5%B1%8F%E8%94%BD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
//v1.1         禁止弹窗禁止123盘生效
(function() {
    'use strict';

    // 原始的剪贴板操作函数备份
    const originalExecCommand = document.execCommand.bind(document);
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    const originalClipboardWrite = navigator.clipboard.write.bind(navigator.clipboard);

    // 替换execCommand以阻止copy/cut命令
    document.execCommand = (cmd, dummy, value) => {
        if (cmd === 'copy' || cmd === 'cut') {
            showMessage('已拦截剪贴板请求');
            return false;
        }
        return originalExecCommand(cmd, dummy, value);
    };

    // 替换navigator.clipboard.writeText以阻止文本写入
    navigator.clipboard.writeText = (text) => {
        showMessage('已拦截剪贴板请求');
        return originalWriteText(text);
    };

    // 替换navigator.clipboard.write以阻止数据写入
    navigator.clipboard.write = (data) => {
        data.forEach(item => {
            if (item.types.includes('text/plain')) {
                showMessage('已拦截剪贴板请求');
            }
        });
        return originalClipboardWrite(data);
    };

    // 显示消息的函数
    function showMessage(message) {
        const minWidth = 200;
        const messageWidth = calculateMessageWidth(message);
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            bottom: 55px;
            left: 50%;
            transform: translateX(-50%);
            width: min(${messageWidth}px, ${minWidth}px);
            padding: 5px 10px;
            white-space: nowrap;
            text-align: center;
            background-color: white;
            border: 1px solid #333;
            color: #333;
            z-index: 9999;
        `;
        document.body.appendChild(messageElement);
        setTimeout(() => document.body.removeChild(messageElement), 3000);
    }

    // 计算消息宽度的辅助函数
    function calculateMessageWidth(message) {
        const tempElement = document.createElement('span');
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        tempElement.textContent = message;
        document.body.appendChild(tempElement);
        const width = tempElement.offsetWidth + 2;
        document.body.removeChild(tempElement);
        return Math.max(width, 150) + 'px';
    }

     // 根据当前页面域名判断是否执行禁用alert、confirm、prompt逻辑
    if (window.location.hostname === 'www.123pan.com') {
        // 禁用alert、confirm、prompt对话框
        window.alert = console.warn.bind(console, 'Blocked alert:');
        window.confirm = () => false;
        window.prompt = (_, defaultValue) => defaultValue || '';
    }
})();