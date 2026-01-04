// ==UserScript==
// @name         iconfont 左侧样式调整
// @namespace    http://tampermonkey.net/
// @version      2024-01-06-1
// @description  调整iconfont左侧项目导航的样式
// @author       You
// @include      *://*.iconfont.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iconfont.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484057/iconfont%20%E5%B7%A6%E4%BE%A7%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/484057/iconfont%20%E5%B7%A6%E4%BE%A7%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.createElement('sytle')
    // 创建一个 style 元素
    var styleElement = document.createElement('style');

    // 设置样式内容
    var cssCode = `
        .page-manage-container .page-manage-left {
            width: auto;
        }
        .page-manage-container .page-manage-left .block-left-nav .nav-container .nav-lists .nav-item{
            width: auto;
        }
    `;

    // 将样式内容添加到 style 元素中
    styleElement.appendChild(document.createTextNode(cssCode));

    // 将 style 元素插入到文档头部
    document.head.appendChild(styleElement);

    // Your code here...
})();