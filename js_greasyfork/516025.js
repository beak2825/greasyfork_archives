// ==UserScript==
// @name         Coze调试界面脚本
// @namespace    http://tampermonkey.net/
// @version      2024-10-14
// @description  一个Coze调试界面脚本
// @author       You
// @match        https://bots.bytedance.net/space/*/bot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516025/Coze%E8%B0%83%E8%AF%95%E7%95%8C%E9%9D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/516025/Coze%E8%B0%83%E8%AF%95%E7%95%8C%E9%9D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 创建按钮框 div
    var buttonText = '沉浸式对话';
    var buttonBox = document.createElement('div');
    buttonBox.style.position = 'fixed';
    buttonBox.style.bottom = '5px';
    buttonBox.style.right = '80px';
    buttonBox.style.padding = '10px';
    buttonBox.style.backgroundColor = 'white';
    // buttonBox.style.border = '1px solid #ccc';
    buttonBox.style.borderRadius = '5px';
    buttonBox.style.zIndex = '10000';

    // 创建按钮
    var openButton = document.createElement('button');
    openButton.innerHTML = '沉浸式对话';
    openButton.style.padding = '5px';
    openButton.style.border = 'none';
    openButton.style.borderRadius = '5px';
    openButton.style.cursor = 'pointer';
    openButton.style.backgroundColor = '#007bff';
    openButton.style.color = 'white';

    // 创建“关闭沉浸式对话”按钮
    var closeButton = document.createElement('button');
    closeButton.innerHTML = '关闭沉浸式对话';
    closeButton.style.display = 'none';
    closeButton.style.padding = '5px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';

    // 为按钮添加点击事件
    openButton.addEventListener('click', function() {
        // 查找所有类名以 "wrapper-single--" 开头的元素
        var elements = document.querySelectorAll('[class*="wrapper-single--"]');
        console.log(elements)
        elements.forEach(function(el) {
            // 将找到的元素的 display 属性设置为 flex
            el.style.display = 'flex';

            // 获取并隐藏第一个子元素
            var firstChild = el.firstElementChild;
            if (firstChild) {
                firstChild.style.display = 'none';
            }
        });
        openButton.style.display = 'none'; // 执行完毕后隐藏
        closeButton.style.display = ''; // 显示“关闭沉浸式对话”按钮
    });
    // 为“关闭沉浸式对话”按钮添加点击事件
    closeButton.addEventListener('click', function() {
        var elements = document.querySelectorAll('[class*="wrapper-single"]');
        elements.forEach(function(el) {
            el.style.display = 'grid'; // 移除 display 样式，恢复到默认状态
            var firstChild = el.firstElementChild;
            if (firstChild) {
                firstChild.style.display = ''; // 对第一个子元素也做相同处理
            }
        });
        closeButton.style.display = 'none'; // 执行完毕后隐藏
        openButton.style.display = ''; // 显示“沉浸式对话”按钮
    });

    // 将按钮添加到按钮框中，再将按钮框添加到页面上
    buttonBox.appendChild(openButton);
    buttonBox.appendChild(closeButton);
    document.body.appendChild(buttonBox);
})();