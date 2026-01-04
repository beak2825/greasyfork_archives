// ==UserScript==
// @name         Customize qBittorrent Web UI Font Size
// @name:zh-cn   修改qBittorrent Web UI字体大小
// @namespace    lanhaha
// @version      0.1
// @description  *Customize qBittorrent Web UI Font Size*
// @description:zh-cn  *修改qBittorrent Web UI字体大小*
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517657/Customize%20qBittorrent%20Web%20UI%20Font%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/517657/Customize%20qBittorrent%20Web%20UI%20Font%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取网页的标题
    const pageTitle = document.title;

    // 使用正则表达式匹配包含 "qBittorrent" 和 "Web UI" 的标题
    const titlePattern = /^qBittorrent.*Web UI$/i;

    // 检查页面标题是否匹配正则表达式
    if (titlePattern.test(pageTitle)) {
        console.log("这是 qBittorrent Web UI 页面");

        // 设置默认字体大小
        const fontSize = "14px";  // 可以修改为你希望的字体大小
        const rowHeight = "25px"; // 设置表格行的高度

        // 创建一个新的样式元素
        const style = document.createElement('style');
        style.innerHTML = `
            body {
            font-family: 'FangSong', '仿宋', serif !important;
                font-size: ${fontSize} !important;
            }

            /* 可选：修改其他元素的字体大小 */
            table, th, td , tr{
                font-size: ${fontSize} !important;
            }

                        /* 修改 td 或 th 中的内容的行高，以确保行内内容垂直居中 */
            td, th, tr {
                line-height: ${rowHeight} !important;
            }
        `;

        // 将样式元素添加到页面头部
        document.head.appendChild(style);
    } else {
        console.log("这不是 qBittorrent  Web UI 页面");
    }
})();
