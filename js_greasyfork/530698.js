// ==UserScript==
// @name         Free Jav Bt 显示完整磁链名称（通过移除 d-block class）
// @namespace    http://tampermonkey.net/
// @version      2025-03-24-18
// @description  移除指定元素中的 d-block class
// @author       纵纬
// @match        https://freejavbt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freejavbt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530698/Free%20Jav%20Bt%20%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E7%A3%81%E9%93%BE%E5%90%8D%E7%A7%B0%EF%BC%88%E9%80%9A%E8%BF%87%E7%A7%BB%E9%99%A4%20d-block%20class%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530698/Free%20Jav%20Bt%20%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E7%A3%81%E9%93%BE%E5%90%8D%E7%A7%B0%EF%BC%88%E9%80%9A%E8%BF%87%E7%A7%BB%E9%99%A4%20d-block%20class%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 移除 d-block class 的函数
    function removeDBlock() {
        const links = document.querySelectorAll('a.magnet-name');
        links.forEach(link => {
            link.classList.remove('d-block');
        });
    }
    // 创建按钮的函数
    function createButton() {
        const button = document.createElement('button');
        button.innerText = '清除 d-block';
        button.style.position = 'fixed';
        button.style.left = '10px';
        button.style.top = '50%';
        button.style.transform = 'translateY(-50%)';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        // 绑定点击事件
        button.addEventListener('click', removeDBlock);
        // 将按钮添加到页面中
        document.body.appendChild(button);
    }
    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 移除 d-block class
        removeDBlock();
        // 创建按钮
        createButton();
    });
})();
