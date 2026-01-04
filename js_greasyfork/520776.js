// ==UserScript==
// @name         清除高亮|禁止划线[同桌英语|四六级题库]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在https://cet.itongzhuo.com/网站中添加一个浮动按钮来移除所有元素的highlighted类，并取消默认的高亮逻辑
// @author       earth_developer@outlook.com
// @match        https://cet.itongzhuo.com/*
// @grant        none
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/520776/%E6%B8%85%E9%99%A4%E9%AB%98%E4%BA%AE%7C%E7%A6%81%E6%AD%A2%E5%88%92%E7%BA%BF%5B%E5%90%8C%E6%A1%8C%E8%8B%B1%E8%AF%AD%7C%E5%9B%9B%E5%85%AD%E7%BA%A7%E9%A2%98%E5%BA%93%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/520776/%E6%B8%85%E9%99%A4%E9%AB%98%E4%BA%AE%7C%E7%A6%81%E6%AD%A2%E5%88%92%E7%BA%BF%5B%E5%90%8C%E6%A1%8C%E8%8B%B1%E8%AF%AD%7C%E5%9B%9B%E5%85%AD%E7%BA%A7%E9%A2%98%E5%BA%93%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isTextHighlightingDisabled = false;

    // 创建浮动按钮
    function createFloatingButton() {
        const button = document.createElement('button');
        const box = document.createElement('div');
        const switchLabel = document.createElement('label');
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchLabel.appendChild(document.createTextNode(' 禁止划线'));
        switchLabel.appendChild(switchInput);
        button.innerText = '清除高亮';
        box.className = 'floating-div'; // 给按钮添加一个特定的 class 名称
        switchLabel.style.cssText = `
            display: flex;
            color: black !important;
            align-items: center;
            margin-top: 10px;
            cursor: pointer;
        `;
        switchInput.style.cssText = `
            width: 20px;
            height: 20px;
            margin-left:10px;
            background-color: #ccc;
            border-radius: 10px;
            position: relative;
            appearance: none;
            outline: none;
            transition: background-color 0.3s;
        `;
        const disableSelectStyle = `
        body, body * {
            -webkit-user-select: none; /* Chrome所有版本, Safari所有版本 */
            -moz-user-select: none;    /* Firefox所有版本 */
            -ms-user-select: none;     /* IE10+ */
            user-select: none;         /* 潜在的标准化属性 */
        }
    `;
        let style = document.createElement('style');
        switchInput.addEventListener('change', function(e) {
            this.style.backgroundColor = this.checked ? '#28a745' : '#ccc';
            isTextHighlightingDisabled = this.checked;

            if (isTextHighlightingDisabled) {
                // 禁止选择文本
                style.innerHTML = disableSelectStyle;
            } else {
                // 允许选择文本
                style.innerHTML = ''; // 清空样式内容，恢复默认行为
            }
        });
        (document.head || document.body).appendChild(style);
        // 使用内联样式以确保优先级，并使用 !important 确保样式不会被覆盖
        box.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 120px !important; /* 固定宽度 */
            height: 100px !important; /* 固定高度 */
            padding: 10px !important; /* 移除默认填充 */
            background-color: #f5f5f5 !important;
            color: white !important;
            border: 1px solid #ddd !important;
            border-radius: 5px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
            cursor: move !important;
            z-index: 2147483647 !important; /* 设置尽可能高的 z-index */
            transition: background-color 0.3s !important;
            pointer-events: auto !important;
            user-select: none !important; /* 防止文本选择 */
            display: flex;
            flex-direction: column;
            align-items: center;
        `;
        button.addEventListener('click', removeHighlightedClass);
        button.style.cssText = `
            width: 100%; /* 按钮宽度占满盒子 */
            height: 40px;
            margin-bottom: 10px;
            padding: 0;
            background-color: #28a745; /* 主色调 */
            color: white; /* 辅助色 */
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
        // 初始化按钮的位置
        let rect = box.getBoundingClientRect();
        box.style.left = `${window.innerWidth - rect.width - 200}px`;
        box.style.top = `${window.innerHeight - rect.height - 200}px`;

        // 拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        box.onmousedown = function(e) {
            isDragging = true;
            e.preventDefault(); // 防止默认行为（如文本选中）

            // 获取鼠标相对于按钮的偏移量
            rect = box.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            box.style.cursor = 'grabbing';
        };

        document.onmousemove = function(e) {
            if (isDragging) {
                // 更新按钮位置
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // 确保按钮不超出窗口边界
                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + rect.width > window.innerWidth) newLeft = window.innerWidth - rect.width;
                if (newTop + rect.height > window.innerHeight) newTop = window.innerHeight - rect.height;

                box.style.left = `${newLeft}px`;
                box.style.top = `${newTop}px`;
            }
        };

        document.onmouseup = function() {
            isDragging = false;
            box.style.cursor = 'move';
        };

        // 将按钮添加到 body 中
        document.body.appendChild(box);
        box.appendChild(button)
        box.appendChild(switchLabel)

        // 调试信息：打印 body 的 class 列表
        console.log('Body classes:', document.body.classList);
    }

    // 移除 highlighted 类
    function removeHighlightedClass() {
        document.querySelectorAll('.highlighted').forEach(element => {
            element.classList.remove('highlighted');
        });
    }

    // 页面加载完成时执行
    window.addEventListener('load', (event) => {
        createFloatingButton();// 创建浮动按钮
    });

})();