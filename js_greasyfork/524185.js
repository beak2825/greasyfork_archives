// ==UserScript==
// @name         Vjudge背景替换
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将Vjudge的背景图片更改为必应的每日一图
// @author       LLDQ
// @match        https://vjudge.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524185/Vjudge%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/524185/Vjudge%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置背景图片的URL
    const backgroundImageUrl = 'https://bing.img.run/uhd.php';

    // 创建一个样式元素
    const style = document.createElement('style');
    style.type = 'text/css';

    // 设置背景图片样式
    style.innerHTML = `
        body {
            background-image: url('${backgroundImageUrl}') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important; /* 固定背景图片 */
        }

        /* 添加半透明遮罩层 */
        body::before {
            content: '';
            position: fixed; /* 固定遮罩层 */
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.4); /* 白色半透明遮罩 */
            z-index: -1; /* 将遮罩层置于背景图片之上，但位于内容之下 */
        }

     `;

    // 将样式元素添加到文档的head中
    document.head.appendChild(style);
})();