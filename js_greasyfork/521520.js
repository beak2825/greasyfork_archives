// ==UserScript==
// @name         扬州大学新教评
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  对于扬州大学新教评系统的一键教评工具，点开评估后自动选择非常满意评价很好并提交
// @author       洛荒
// @match        https://jxpg.yzu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yzu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521520/%E6%89%AC%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%96%B0%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/521520/%E6%89%AC%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%96%B0%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

   const labels = document.querySelectorAll('label[for^="Q"][for$="A"]');

    // 遍历每个 <label> 元素
    labels.forEach(label => {
        // 获取与 <label> 的 for 属性值对应的 <input> 元素
        const input = document.getElementById(label.getAttribute('for'));

        // 如果找到了对应的 <input> 元素，就进行点击
        if (input) {
            input.click();
        }
    });
    // 获取所有 <textarea> 元素
    const textareas = document.querySelectorAll('textarea');

    // 遍历每个 <textarea> 元素并输入文本 "很好"
    textareas.forEach(textarea => {
        textarea.value = '很好';  // 设置输入框的值为 "很好"
    });
    document.querySelecrtor('button').click()
})();