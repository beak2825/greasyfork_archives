// ==UserScript==
// @name         换行符替换工具（可拖动）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  将文本中的换行符替换为空格，并允许拖动工具栏
// @author       BaiLu
// @license      MIT
// @match        https://my.gdip.edu.cn/neikong_neikongModuleManagement/neikong_neikongModuleManagement-neikongTheNewModule_add?moduleId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521716/%E6%8D%A2%E8%A1%8C%E7%AC%A6%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7%EF%BC%88%E5%8F%AF%E6%8B%96%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521716/%E6%8D%A2%E8%A1%8C%E7%AC%A6%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7%EF%BC%88%E5%8F%AF%E6%8B%96%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个容器来放置输入框、按钮和展示框
    var container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        right: 10px;
        top: 10px;
        width: 300px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        cursor: move;
    `;

    // 创建输入框
    var inputBox = document.createElement('textarea');
    inputBox.style.cssText = `
        width: 95%;
        height: 100px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 5px;
        resize: none; // 防止用户调整大小
    `;
    inputBox.placeholder = '在这里粘贴文本...';

    // 创建按钮
    var button = document.createElement('button');
    button.textContent = '替换换行符';
    button.style.cssText = `
        width: 95%;
        padding: 5px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    `;

    // 创建展示框
    var displayBox = document.createElement('div');
    displayBox.style.cssText = `
        border: 1px solid #ccc;
        width: 95%;
        height: 100px;
        overflow-y: auto;
        margin-top: 10px;
        padding: 5px;
        background-color: white;
    `;

    // 将元素添加到容器中
    container.appendChild(inputBox);
    container.appendChild(button);
    container.appendChild(displayBox);

    // 将容器添加到页面中
    document.body.appendChild(container);

    // 添加拖动事件监听器
    var isMouseDown = false;
    var offsetX, offsetY;

    function onMouseDown(e) {
        isMouseDown = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';
    }

    function onMouseUp() {
        isMouseDown = false;
        container.style.cursor = 'move';
    }

    function onMouseMove(e) {
        if (isMouseDown) {
            var newX = e.clientX - offsetX;
            var newY = e.clientY - offsetY;
            container.style.left = newX + 'px';
            container.style.top = newY + 'px';
        }
    }

    container.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    // 点击按钮时执行替换操作
    button.addEventListener('click', function() {
        var text = inputBox.value;
        var t = text.replace(/\n/g, ' ');
        displayBox.textContent = t;
    });
})();
