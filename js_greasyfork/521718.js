// ==UserScript==
// @name         自动点击列表选项（可拖动按钮）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  点击按钮后自动点击页面上的复选框，按钮可拖动且大小固定
// @author       BaiLu
// @license      MIT
// @match        https://my.gdip.edu.cn/neikong_neikongModuleManagement/neikong_neikongModuleManagement-neikongTheNewModule_add?moduleId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521718/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%97%E8%A1%A8%E9%80%89%E9%A1%B9%EF%BC%88%E5%8F%AF%E6%8B%96%E5%8A%A8%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521718/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%97%E8%A1%A8%E9%80%89%E9%A1%B9%EF%BC%88%E5%8F%AF%E6%8B%96%E5%8A%A8%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个容器
    var container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        right: 10px;
        top: 200px;
        z-index: 9999;
        width: 120px; /* 容器宽度 */
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        padding: 10px;
        text-align: center;
    `;

    // 创建一个按钮
    var button = document.createElement('button');
    button.textContent = '点击执行';
    button.style.cssText = `
        width: 100%; /* 宽度充满容器 */
        height: 30px; /* 固定高度 */
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        outline: none;
        font-size: 16px;
        margin-bottom: 10px; /* 按钮底部间距 */
    `;

    // 将按钮添加到容器
    container.appendChild(button);
    // 将容器添加到页面
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
        container.style.cursor = 'pointer';
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

    // 按钮点击事件
    button.addEventListener('click', function() {
        // 查找所有目标复选框
        var checkboxes = document.querySelectorAll("div.NewViewDetails > div > div:nth-child(4) div > div.el-checkbox-group label.el-checkbox.el-tooltip");

        // 为每个复选框设置延迟点击
        checkboxes.forEach(function(e, index) {
            setTimeout(function() {
                e.click();
            }, 200 * index); // 每次点击增加200毫秒的延迟
        });
    });
})();
