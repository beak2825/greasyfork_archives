// ==UserScript==
// @name         百度文库下载|免VIP下载|原格式|免费下载
// @namespace    http://bdwk.gg999.top/
// @version      1.0.4
// @description  百度文库原格式下载，永久免费安装后，点击百度文库文档页面右下方的蓝色按钮，即可跳转至下载页面免费下载，持续更新
// @author       小风同学
// @match        *://wenku.baidu.com/view/*
// @match        *://wenku.baidu.com/tfview/*
// @match        *://wenku.baidu.com/link?url*
// @match        *://wenku.baidu.com/share/*
// @license      End-User License Agreement
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492578/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%7C%E5%85%8DVIP%E4%B8%8B%E8%BD%BD%7C%E5%8E%9F%E6%A0%BC%E5%BC%8F%7C%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/492578/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%7C%E5%85%8DVIP%E4%B8%8B%E8%BD%BD%7C%E5%8E%9F%E6%A0%BC%E5%BC%8F%7C%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = '免费下载此文档';
        button.style.fontSize = '20px';
        button.style.padding = '15px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.right = '20px'; // 调整右侧距离
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '9999'; // 确保按钮位于其他元素之上
        button.onclick = function() {
            // 在这里添加下载逻辑
            window.open("http://wen.gg999.top/?url=" + document.URL);
        };
        return button;
    }

    // 将下载按钮添加到页面
    function addButtonToPage() {
        const downloadButton = createDownloadButton();
        // 添加到页面中
        const targetElement = document.querySelector('body');
        targetElement.appendChild(downloadButton);
    }

    // 在页面加载完成后添加按钮
    window.addEventListener('load', addButtonToPage);
})();