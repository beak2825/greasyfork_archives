// ==UserScript==
// @license MIT
// @name         Google Bard 中文翻译英文脚本
// @namespace    http://tampermonkey
// @version      1
// @description  在 Google Bard 中将中文翻译成英文并自动输入到输入框中。
// @match        *://bard.google.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/466992/Google%20Bard%20%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E8%8B%B1%E6%96%87%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466992/Google%20Bard%20%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E8%8B%B1%E6%96%87%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建对话框的 HTML 元素
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = `${window.innerHeight / 2}px`;
    dialog.style.left = `${window.innerWidth / 2}px`;
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.padding = '20px';
    dialog.style.backgroundColor = '#fff';
    dialog.style.border = '1px solid #ccc';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    dialog.style.zIndex = '9999';
    dialog.innerHTML = `
        <div style="margin-bottom: 10px;">
            <label for="inputBox">请输入您的问题：</label>
            <input type="text" id="inputBox">
        </div>
        <button id="submitButton">提交</button>
    `;

    // 将对话框添加到页面中
    document.body.appendChild(dialog);

    // 获取对话框中的输入框和提交按钮
    const inputBox = dialog.querySelector('#inputBox');
    const submitButton = dialog.querySelector('#submitButton');

    // 获取指定的 <textarea> 元素
  // 获取指定的 <textarea> 元素
const textarea = document.querySelector('#mat-input-0');



// 记录上一次提交后的文本内容
let lastText = '';

// 监听提交按钮的点击事件
submitButton.addEventListener('click', function() {
    // 获取输入框中的文本
    const text = inputBox.value.trim();

    // 判断输入框中的文本是否为中文
    if (/^[\u4e00-\u9fa5]+$/.test(text)) {
        // 如果是中文，则调用免费的翻译 API 进行翻译
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`,
            onload: function(response) {
                // 解析翻译 API 的响应
                const result = JSON.parse(response.responseText);
                if (result[0] && result[0][0] && result[0][0][0]) {
                    // 如果翻译成功，则将翻译结果自动输入到 Google Bard 的输入框中
                    const textarea = document.querySelector('#mat-input-0');

                    // 获取当前文本内容
                    const currentText = textarea.value;

                    // 获取新增的文本内容
                    const newText = currentText.slice(lastText.length);

                    // 将新增的文本内容翻译成英文
                    const translatedText = result[0][0][0];

                    // 将翻译结果自动输入到 Google Bard 的输入框中
                    textarea.value = currentText.replace(newText, translatedText);

                    // 更新上一次提交后的文本内容
                    lastText = currentText;
                }
            }
        });
    }

    // 清除输入框中的文本
    inputBox.value = '';

    // 阻止默认行为，以便不关闭对话框
    event.preventDefault();
});

    // 获取发送按钮
const sendButton = document.querySelector('#send-button');

// 模拟点击发送按钮
sendButton.click();

    // 使对话框可拖动
    let isDragging = false;
    let startX, startY, dialogX, dialogY;
    dialog.addEventListener('mousedown', function(event) {
        if (event.target === dialog) {
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            dialogX = parseInt(dialog.style.left) || 0;
            dialogY = parseInt(dialog.style.top) || 0;
        }
    });
    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            dialog.style.left = `${dialogX + deltaX}px`;
            dialog.style.top = `${dialogY + deltaY}px`;
        }
    });
    document.addEventListener('mouseup', function(event) {
        isDragging = false;
    });
})();