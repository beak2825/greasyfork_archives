// ==UserScript==
// @name         百度文库免费下载
// @namespace    http://bdwk.gg999.top/
// @version      1.0.6
// @description  百度文库原格式下载，永久免费，安装后，点击百度文库文档页面的蓝色按钮，即可跳转至下载页面免费下载
// @author       小风同学
// @match        *://wenku.baidu.com/view/*
// @match        *://wenku.baidu.com/tfview/*
// @match        *://wenku.baidu.com/link?url*"
// @match        *://wenku.baidu.com/share/*
// @license      End-User License Agreement
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522176/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522176/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = '免费下载此文档';
        button.style.fontSize = '18px';
        button.style.padding = '15px 30px';
        button.style.background = 'linear-gradient(45deg, #007bff, #00c6ff)';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '25px';
        button.style.cursor = 'pointer';
        button.style.position = 'fixed';
        button.style.left = '30px';  // 调整为屏幕左侧
        button.style.top = '50%';    // 垂直居中
        button.style.transform = 'translateY(-50%)'; // 垂直居中
        button.style.zIndex = '9999';
        button.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
        button.style.transition = 'all 0.3s ease';

        // 鼠标悬停时的效果
        button.onmouseenter = function() {
            button.style.transform = 'translateY(-50%) scale(1.05)';
            button.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.5)';
        };

        button.onmouseleave = function() {
            button.style.transform = 'translateY(-50%) scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
        };

        button.onclick = function() {
            // 在这里添加下载逻辑
            window.open("http://wen.gg999.top/?url=" + document.URL);
        };
        return button;
    }

    // 将下载按钮添加到页面
    const downloadButton = createDownloadButton();
    // 立即添加到页面中
    document.body.appendChild(downloadButton);
})();
