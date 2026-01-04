// ==UserScript==
// @name         再漫画显示滑动块
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  强制显示页面右侧滑动块
// @match https://manhua.zaimanhua.com/*

// @match https://www.mangacopy.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541839/%E5%86%8D%E6%BC%AB%E7%94%BB%E6%98%BE%E7%A4%BA%E6%BB%91%E5%8A%A8%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/541839/%E5%86%8D%E6%BC%AB%E7%94%BB%E6%98%BE%E7%A4%BA%E6%BB%91%E5%8A%A8%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 style 元素
    var style = document.createElement('style');
    style.type = 'text/css';

    // 设置 CSS 规则，更精确地针对 html 和 body
    style.innerHTML = `
        html {
            overflow-y: scroll !important; /* 强制 html 元素显示垂直滚动条 */
        }
        body {
            overflow: visible !important; /* 允许 body 内容溢出，由 html 的滚动条控制 */
        }

        /* 覆盖 Webkit 浏览器（Chrome, Edge, Safari, Opera）的滚动条隐藏规则 */
        ::-webkit-scrollbar {
            display: block !important;
            width: 17px !important;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
            border-radius: 8px !important;
        }

        /* 自定义滚动条滑块的样式 */
        ::-webkit-scrollbar-thumb {
            background: #888 !important; /* 滑块颜色 */
            border-radius: 8px !important;
            border: 3px solid #f1f1f1 !important; /* 滑块边框，与轨道颜色相同，营造宽度感 */
            /* 关键修改：设置滑块的最小高度 */
            min-height: 50px !important; /* 你可以根据需要调整这个值，例如 30px, 60px 等 */
        }

        /* 滑块在 hover 时的样式 */
        ::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
        }
    `;

    // 将 style 元素添加到文档的 head 中
    document.head.appendChild(style);

    console.log('Tampermonkey script: Scrollbar min-height applied on Zaimanhua.');
})();