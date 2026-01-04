// ==UserScript==
// @name         表单自动填写插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填写表单，并提供可视化UI
// @author       Your Name
// @match        https://oa-uat.coli688.com/main/*
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/521752/%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521752/%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建UI容器
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '10px';
    uiContainer.style.right = '10px';
    uiContainer.style.backgroundColor = '#f9f9f9';
    uiContainer.style.border = '1px solid #ccc';
    uiContainer.style.padding = '10px';
    uiContainer.style.zIndex = '10000';
    uiContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    uiContainer.style.borderRadius = '10px'; // 圆角效果
    uiContainer.style.width = '300px'; // 设置宽度
    uiContainer.style.cursor = 'move'; // 鼠标样式为可拖动

    // 添加UI内容
    uiContainer.innerHTML = `
        <div id="uiHeader" style="margin-bottom: 10px; cursor: move; font-weight: bold;">
            自动填写表单
            <button id="hideBtn" style="float: right; padding: 5px; background-color: #ff4d4f; color: white; border: none; cursor: pointer; border-radius: 5px;">隐藏</button>
        </div>
        <label for="textInput">文本框:</label>
        <input type="text" id="textInput" placeholder="输入文本" style="width: 100%; margin-bottom: 10px;"><br>

        <label for="textareaInput">多行文本:</label>
        <textarea id="textareaInput" rows="3" placeholder="输入多行文本" style="width: 100%; margin-bottom: 10px;"></textarea><br>

        <label for="amountInput">金额:</label>
        <input type="number" id="amountInput" placeholder="输入金额" style="width: 100%; margin-bottom: 10px;"><br>

        <label for="dateInput">时间选择器:</label>
        <input type="date" id="dateInput" style="width: 100%; margin-bottom: 10px;"><br>

        <button id="submitBtn" style="width: 100%; padding: 5px; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px;">提交</button>
    `;

    // 将UI添加到页面
    document.body.appendChild(uiContainer);

    // 获取UI元素
    const textInput = document.getElementById('textInput');
    const textareaInput = document.getElementById('textareaInput');
    const amountInput = document.getElementById('amountInput');
    const dateInput = document.getElementById('dateInput');
    const submitBtn = document.getElementById('submitBtn');
    const hideBtn = document.getElementById('hideBtn');

    // 实现拖动功能
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    uiContainer.addEventListener('mousedown', (e) => {
        if (e.target.id === 'uiHeader') {
            isDragging = true;
            offsetX = e.clientX - uiContainer.offsetLeft;
            offsetY = e.clientY - uiContainer.offsetTop;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            uiContainer.style.left = (e.clientX - offsetX) + 'px';
            uiContainer.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 实现隐藏功能
    hideBtn.addEventListener('click', () => {
        uiContainer.style.display = 'none';
    });

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        const form = document.querySelector('form'); // 根据实际表单的标签或id修改
        if (form) {
            console.log('表单已加载');
            observer.disconnect(); // 停止监听

            // 监听提交按钮点击事件
            submitBtn.addEventListener('click', () => {
                // 获取UI中的值
                const textValue = textInput.value;
                const textareaValue = textareaInput.value;
                const amountValue = amountInput.value;
                const dateValue = dateInput.value;

                // 自动填充表单
                const fields = form.querySelectorAll('.ant-input'); // 查找所有class为ant-input的输入框和文本框
                fields.forEach((field) => {
                    if (field.tagName === 'INPUT' && field.type === 'text') {
                        field.setAttribute('title', textValue); // 修改title属性
                    } else if (field.tagName === 'TEXTAREA') {
                        field.setAttribute('title', textareaValue); // 修改title属性
                    } else if (field.tagName === 'INPUT' && field.type === 'number') {
                        field.setAttribute('title', amountValue); // 修改title属性
                    } else if (field.tagName === 'INPUT' && field.type === 'date') {
                        field.setAttribute('title', dateValue); // 修改title属性
                    }
                });

                console.log('表单已自动填写');
            });
        }
    });

    // 开始监听
    observer.observe(document.body, { childList: true, subtree: true });
})();