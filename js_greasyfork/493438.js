// ==UserScript==
// @name         linuxdo超链接内容预览脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  点击任意链接预览页面内容，阻止页面跳转，并在模态窗口中显示
// @author       KlNon
// @match        https://linux.do/latest*
// @match        https://linux.do/c/general/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493438/linuxdo%E8%B6%85%E9%93%BE%E6%8E%A5%E5%86%85%E5%AE%B9%E9%A2%84%E8%A7%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/493438/linuxdo%E8%B6%85%E9%93%BE%E6%8E%A5%E5%86%85%E5%AE%B9%E9%A2%84%E8%A7%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本初始化...");

    // 添加样式到页面头部
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .iframe-container {
            width: 90%;
            height: 90%;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 10px;
        }
    `;
    document.head.appendChild(style);

    // 创建模态窗口和iframe容器
    const modal = document.createElement('div');
    modal.className = 'modal';
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframe-container';
    const iframe = document.createElement('iframe');
    iframeContainer.appendChild(iframe);
    modal.appendChild(iframeContainer);
    document.body.appendChild(modal);

    // 打开模态窗口的函数
    function openModal(url) {
        iframe.src = url;
        modal.style.display = 'flex';
    }

    // 点击模态窗口以外的区域关闭模态窗口
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            iframe.src = ''; // 清除iframe内容
        }
    });

    // 监听点击事件
    document.addEventListener('click', function(e) {
        if (e.target.matches('.raw-link')) {
            e.preventDefault(); // 阻止链接默认行为
            openModal(e.target.href); // 打开模态窗口并加载链接
        }
    }, true);
})();
