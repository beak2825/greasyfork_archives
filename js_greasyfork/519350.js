// ==UserScript==
// @name         豆瓣全屏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使豆瓣网站页面变宽，适应高分辨率屏幕
// @author       Your Name
// @match        *://*.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519350/%E8%B1%86%E7%93%A3%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/519350/%E8%B1%86%E7%93%A3%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = `
        /* 确保整个页面宽度填满浏览器 */
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden; /* 禁止横向滚动 */
        }

        /* 调整主要内容容器宽度 */
        .container, .wrapper, .main, .article {
            max-width: 100% !important; /* 取消最大宽度限制 */
            width: 100% !important; /* 让容器宽度充满视口 */
            margin: 0 auto; /* 居中对齐 */
            padding: 0;
            box-sizing: border-box;
        }

        /* 隐藏侧边栏和不必要的区域 */
        .side, .aside, .footer, .header {
            display: none !important;
        }

        /* 调整内容区域 */
        .content, .main-content {
            padding: 0 !important; /* 去除内边距 */
            margin: 0 auto; /* 居中对齐 */
            box-sizing: border-box;
        }

        /* 使页面元素全宽显示 */
        .top-nav, .bottom-nav {
            width: 100% !important;
            box-sizing: border-box;
        }
    `;
    document.head.appendChild(style);
})();
