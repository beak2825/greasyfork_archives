// ==UserScript==
// @name         网大复制
// @namespace    http://tampermonkey.net/
// @version      2024-09-29
// @description  网大复制1
// @author       You
// @match        https://internal-edu.ctyun.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ctyun.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515563/%E7%BD%91%E5%A4%A7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/515563/%E7%BD%91%E5%A4%A7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 监听所有元素的点击事件
    document.addEventListener('click', function(event) {
        // 获取被点击的元素
        let target = event.target;

        const text = target.textContent.replace(/\s/g,'')
        // 检查元素是否包含文本内容
        if (text) {
            // 复制文本内容到剪贴板
            copyToClipboard(text);
            console.log('内容已复制到剪贴板: ' + target.textContent);
        }
    });

    document.addEventListener('contextmenu', function(event) {
        // 获取被点击的元素
        let target = event.target;

        // 找到最近的父元素，其 class 包含 testpaper-question-body
        let parentElement = findParentWithClass(target, 'testpaper-question-body');

        // 如果找到父元素
        if (parentElement) {
            // 复制父元素内的所有文本内容到剪贴板
            copyToClipboard(parentElement.textContent.trim());
            console.log('内容已复制到剪贴板: ' + parentElement.textContent.trim());
        }
    });

    // 找到最近的父元素，其 class 包含指定类名的函数
    function findParentWithClass(element, className) {
        let count = 0

        while (element && !element.classList.contains(className) && count < 10) {
            element = element.parentElement;
            count++
        }
        return element;
    }


    // 复制文本到剪贴板的函数
    function copyToClipboard(text) {
        // 创建一个临时的 textarea 元素
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);

        // 选择并复制文本
        textarea.select();
        document.execCommand('copy');

        // 移除临时元素
        document.body.removeChild(textarea);
    }
    // Your code here...
})();