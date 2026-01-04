// ==UserScript==
// @name         百度样式修改器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify Baidu search results page style
// @author       皮長蹊
// @match        https://www.baidu.com/s?wd=*
// @match        https://www.baidu.com/s?&&wd=*
// @match        https://www.baidu.com/s?ie=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536797/%E7%99%BE%E5%BA%A6%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/536797/%E7%99%BE%E5%BA%A6%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');

    // 定义样式
    const styleContent = `
        .head-wrapper, #head, .head-container {
            background-color: rgba(255,255,255, 0.1)!important;
            backdrop-filter: blur(10px)!important;
            -webkit-backdrop-filter: blur(10px)!important;
            box-shadow: 0 1px 20px rgba(0, 0, 0, 0.2)!important; /* 添加阴影效果 */
        }
    `;

    // 添加样式到文档头部
    style.textContent = styleContent;
    document.head.appendChild(style);
})();