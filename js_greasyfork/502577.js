// ==UserScript==
// @name         大医智慧门店端处方单高度调整
// @namespace    https://greasyfork.org/users/1345081
// @version      0.1
// @license      GPL-3.0 License
// @icon         https://store.dyzhkj.cn/favicon.ico
// @description  去除网页处方单空白部分和斜线，附加打印按钮。
// @author       zhangqiang
// @match        https://store.dyzhkj.cn/static/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502577/%E5%A4%A7%E5%8C%BB%E6%99%BA%E6%85%A7%E9%97%A8%E5%BA%97%E7%AB%AF%E5%A4%84%E6%96%B9%E5%8D%95%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/502577/%E5%A4%A7%E5%8C%BB%E6%99%BA%E6%85%A7%E9%97%A8%E5%BA%97%E7%AB%AF%E5%A4%84%E6%96%B9%E5%8D%95%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的 <style> 元素用于自定义样式
    var customStyle = document.createElement('style');

    // 设置自定义样式内容
    customStyle.textContent = `
        .cont-body {
            padding: 15px;
            height: 200px;
        }
        #xiexian {
            max-width: 0px;
            margin-top: -6px; /* 注意：这里不需要 !important */
        }
    `;

    // 将自定义样式添加到文档的 <head> 中
    document.head.appendChild(customStyle);

    // 检查是否已经添加了打印按钮和打印隐藏样式，避免重复添加
    if (document.querySelector('style#printButtonHideStyle') || document.getElementById('printButton')) return;

    // 创建一个新的 <style> 元素用于打印隐藏样式
    var printStyle = document.createElement('style');
    printStyle.id = 'printButtonHideStyle';

    // 设置打印隐藏样式内容
    printStyle.textContent = `
        @media print {
            #printButton {
                display: none !important;
            }
        }
    `;

    // 将打印隐藏样式添加到文档的 <head> 中
    document.head.appendChild(printStyle);

    // 创建一个新的 <button> 元素作为打印按钮
    var printButton = document.createElement('button');
    printButton.id = 'printButton';
    printButton.textContent = '打印';

    // 设置打印按钮的样式
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
    `;

    // 为打印按钮添加点击事件监听器
    printButton.addEventListener('click', function() {
        window.print();
    });

    // 将打印按钮添加到文档的 <body> 中
    document.body.appendChild(printButton);
})();