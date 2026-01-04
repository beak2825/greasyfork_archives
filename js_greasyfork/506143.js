// ==UserScript==
// @name         Clipboard with Preset Texts
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  插入剪贴板和预置内容并触发发送
// @author       FutureoO
// @match        *://chatglm.cn/main/*
// @match        *://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506143/Clipboard%20with%20Preset%20Texts.user.js
// @updateURL https://update.greasyfork.org/scripts/506143/Clipboard%20with%20Preset%20Texts.meta.js
// ==/UserScript==

(function () {
    'use strict';

// 创建悬浮窗口的样式
const style = document.createElement('style');
style.innerHTML = `
    #floating-window {
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 300px;
        background-color: #f0f0f0;
        border: 1px solid #333;
        padding: 10px;
        z-index: 9999;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        color: #000;
    }
    #preset-input {
        width: 100%;
        padding: 5px;
        border: 1px solid #ccc;
        margin-bottom: 2px;
        font-size: 14px;
        color: #000;
        background-color: #fff;
    }
    #save-preset {
        width: 100%;
        padding: 2px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 10px;
        margin-bottom: 5px;
    }
    #save-preset:hover {
        background-color: #45a049;
    }
    #preset-list {
        max-height: 150px;
        overflow-y: auto;
    }
    .preset-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        margin-bottom: 5px;
    }
    .preset-item div {
        font-size: 10px; /* 修改此行来调整字体大小 */
    }
    .preset-item button {
        background-color: red;
        color: white;
        border: none;
        cursor: pointer;
    }
`;
document.head.appendChild(style);


 // 创建悬浮窗口
const floatingWindow = document.createElement('div');
floatingWindow.id = 'floating-window';
floatingWindow.innerHTML = `
    <textarea id="preset-input" placeholder="输入预置文本" style="width: 100%; height: 40px;"></textarea>
    <button id="save-preset">保存预置文本</button>
    <div id="preset-list"></div>
`;
document.body.appendChild(floatingWindow);

// 预置文本数组（从 localStorage 加载）
let presetTexts = JSON.parse(localStorage.getItem('presetTexts')) || [];

// 保存预置文本并显示在列表中
document.getElementById('save-preset').addEventListener('click', function () {
    const presetInput = document.getElementById('preset-input').value;
    if (presetInput.trim()) {
        presetTexts.push(presetInput);
        updatePresetList();
        document.getElementById('preset-input').value = '';
        localStorage.setItem('presetTexts', JSON.stringify(presetTexts)); // 保存到 localStorage
    }
});

// 更新预置文本列表
function updatePresetList() {
    const presetList = document.getElementById('preset-list');
    presetList.innerHTML = '';
    presetTexts.forEach((text, index) => {
        const presetItem = document.createElement('div');
        presetItem.className = 'preset-item';

        const presetTextButton = document.createElement('button');
        presetTextButton.textContent = '✖';
        presetTextButton.addEventListener('click', () => deletePresetText(index));

        const presetTextDiv = document.createElement('div');
        presetTextDiv.textContent = text;
        presetTextDiv.style.cursor = 'pointer';
        presetTextDiv.addEventListener('click', () => insertTextAtCursor(text));

        presetItem.appendChild(presetTextDiv);
        presetItem.appendChild(presetTextButton);
        presetList.appendChild(presetItem);
    });
}

// 删除预置文本
function deletePresetText(index) {
    presetTexts.splice(index, 1);
    updatePresetList();
    localStorage.setItem('presetTexts', JSON.stringify(presetTexts)); // 更新 localStorage
}

// 插入文本到光标位置并触发按钮点击
async function insertTextAtCursor(presetText) {
    const clipboardText = await navigator.clipboard.readText();
    const chatInputSelector = 'textarea'; // 或者指定你页面中的输入框选择器

    const inputField = document.querySelector(chatInputSelector);

    if (inputField) {
        inputField.focus(); // 确保输入框获取焦点
        insertAtCursor(inputField, clipboardText + '\n\n' + presetText);

        // 延迟执行以确保文本插入后触发按钮
        setTimeout(() => {
            // 检查不同类型的发送按钮
            const sendButton = document.querySelector('button[data-testid="send-button"]'); // 第一个页面按钮
            const imgSendButton = document.querySelector('.enter img[src*="send-dark"]'); // 第二个页面按钮

            // 触发相应的点击事件
            if (sendButton) {
                sendButton.click(); // 触发第一个页面按钮的点击
            } else if (imgSendButton) {
                imgSendButton.click(); // 触发第二个页面按钮的点击
            }
        }, 300); // 延迟300ms，以确保文本已经插入
    }
}

// 在光标位置插入文本
function insertAtCursor(myField, myValue) {
    // 确保输入框是活动的
    myField.focus();

    // 插入文本并移动光标
    if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }

    // 触发input事件以确保更改被识别
    var event = new Event('input', { bubbles: true });
    myField.dispatchEvent(event);
}

// 初始化时更新预置文本列表
updatePresetList();
})();
