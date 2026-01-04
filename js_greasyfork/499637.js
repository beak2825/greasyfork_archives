// ==UserScript==
// @name         自动填充barcode
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  提取 URL 中的 position 和 barCodeNo 参数并输出到控制台
// @author       Your Name
// @match        *://*.ywx.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499637/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85barcode.user.js
// @updateURL https://update.greasyfork.org/scripts/499637/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85barcode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("加载脚本");

    // 定义处理 URL 的方法
    function processUrl(url) {
        // 创建一个 URL 对象
        const urlObj = new URL(url);

        // 获取 URL 参数
        const params = new URLSearchParams(urlObj.search);
        // 提取 position 和 barCodeNo 参数
        const position = params.get('position');
        const barCodeNo = params.get('barCodeNo');

        if (position !== null) {
            if (typeof barcode === 'function') {
                barcode(position);
                console.log("barcode(" + position + ")");
            } else {
                console.error("barcode function is not defined");
            }
        }

        if (barCodeNo !== null) {
            if (typeof barcode === 'function') {
                barcode(barCodeNo);
                console.log("barcode(" + barCodeNo + ")");
            } else {
                console.error("barcode function is not defined");
            }
        }
    }

    // 创建悬浮按钮
    const button = document.createElement('button');
    button.textContent = '自动扫码填入';
    button.style.position = 'fixed';
    button.style.bottom = '100px'; // 设置为页面右下角
    button.style.right = '-100px';  // 设置为页面右侧边缘
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.opacity = '0.5'; // 设置部分透明度
    button.style.transition = 'right 0.3s ease, opacity 0.3s ease'; // 添加过渡效果

    // 鼠标悬停事件
    button.addEventListener('mouseover', () => {
        button.style.right = '10px'; // 完全显示按钮
        button.style.opacity = '1'; // 取消透明度
    });

    // 鼠标移出事件
    button.addEventListener('mouseout', () => {
        button.style.right = '-100px'; // 隐藏按钮
        button.style.opacity = '0.5'; // 恢复透明度
    });

    // 按钮点击事件
    button.addEventListener('click', () => {
        console.log("执行脚本");
        // 获取当前页面的 URL
        const currentUrl = window.location.href;
        // 调用方法处理当前页面的 URL
        processUrl(currentUrl);
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);
})();
