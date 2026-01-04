// ==UserScript==
// @name         linuxdo鼠标预览
// @namespace    http://tampermonkey.net/
// @version      2024-06-06
// @description  鼠标触发预览
// @author       Alex
// @match        https://linux.do/latest*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497201/linuxdo%E9%BC%A0%E6%A0%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/497201/linuxdo%E9%BC%A0%E6%A0%87%E9%A2%84%E8%A7%88.meta.js
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
            right: 0;
            width: 83%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
           display: none;
        }
        iframe {
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);

    // 创建模态窗口和iframe容器
    const modal = document.createElement('div');
    modal.className = 'modal';

    const iframe = document.createElement('iframe');

    document.body.appendChild(modal);
    modal.appendChild(iframe);

    // 打开模态窗口的函数
    function openModal(url) {
        iframe.src = url;
        modal.style.display = 'flex';
    }

    // 点击模态窗口以外的区域关闭模态窗口
    modal.addEventListener('mouseleave', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            iframe.src = ''; // 清除iframe内容
        }
    });

    // 监听点击事件
    document.addEventListener('mouseenter', function(e) {
        if (e.target.matches('.raw-link')) {
            e.preventDefault(); // 阻止链接默认行为
            openModal(e.target.href); // 打开模态窗口并加载链接
        }
    }, true);
})();