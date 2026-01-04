// ==UserScript==
// @name         CodeCV简历保存打印脚本
// @namespace    http://tampermonkey.net/
// @version      9999.9.1
// @description  在CodeCV网页及其子页面右上角添加按钮，点击按钮，保存内容并打印
// @author       abining
// @match        https://*codecv.top/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535912/CodeCV%E7%AE%80%E5%8E%86%E4%BF%9D%E5%AD%98%E6%89%93%E5%8D%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535912/CodeCV%E7%AE%80%E5%8E%86%E4%BF%9D%E5%AD%98%E6%89%93%E5%8D%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var savePrintButton = document.createElement('button');
    savePrintButton.style.position = 'fixed';
    savePrintButton.style.top = '10px';
    savePrintButton.style.right = '10px';
    savePrintButton.style.width = '15px';
    savePrintButton.style.height = '15px';
    savePrintButton.style.backgroundColor = 'blue'; // 设置按钮颜色，可根据喜好修改
    savePrintButton.style.color = 'white';
    savePrintButton.style.border = 'none';
    savePrintButton.style.borderRadius = '50%'; // 设置为圆形按钮
    savePrintButton.style.cursor = 'pointer';
    savePrintButton.title = '保存并打印'; // 设置鼠标悬停时的提示文字

    // 添加按钮到页面
    document.body.appendChild(savePrintButton);

    // 为按钮添加点击事件
    savePrintButton.addEventListener('click', function() {
        // 获取需要保存的内容
        var contentToSave = document.querySelectorAll('.markdown-transform-html')[1];
        let inn = contentToSave.outerHTML;
        if (contentToSave) {
            // 保存内容到 document.body
            document.body.innerHTML = inn;

            // 模拟按下 Ctrl+P 进行打印
            window.print();
        } else {
            alert('未找到需要保存的内容！');
        }
    });
})();