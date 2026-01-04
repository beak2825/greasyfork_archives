// ==UserScript==
// @name         Chiphell 灰度模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将 www.chiphell.com 的所有页面呈现为灰色调
// @author       wosell
// @match        *://www.chiphell.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531688/Chiphell%20%E7%81%B0%E5%BA%A6%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/531688/Chiphell%20%E7%81%B0%E5%BA%A6%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');
    style.type = 'text/css';

    // 添加灰度效果样式
    style.innerHTML = `
        html {
            filter: grayscale(100%);
            -webkit-filter: grayscale(100%);
            -moz-filter: grayscale(100%);
            -ms-filter: grayscale(100%);
            -o-filter: grayscale(100%);
            filter: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='grayscale'><feColorMatrix type='matrix' values='0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'/></filter></svg>#grayscale");
            filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        }
    `;

    // 将样式添加到文档头部
    document.head.appendChild(style);
})();
