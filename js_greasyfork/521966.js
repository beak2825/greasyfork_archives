// ==UserScript==
// @name        闪击PPT下载
// @namespace   Violentmonkey Scripts
// @match       https://ppt.sankki.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/11/7 22:07:34
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521966/%E9%97%AA%E5%87%BBPPT%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521966/%E9%97%AA%E5%87%BBPPT%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取页面宽度（100vw）
    var pageWidth = window.innerWidth;

    // 计算所需的页面宽度和高度（例如，100vw * 1.1）
    var pageWidthInPx = pageWidth;
    var pageHeightInPx = pageWidthInPx * 9 / 16; // 可以根据需要调整

    // 创建一个 <style> 元素并将其添加到 <head> 中
    var style = document.createElement('style');
    style.innerHTML = `
            html{
              overflow: scroll;
            }
            .at-m-cinema, .page-cinema, #app, body {
                height: auto;
            }
            .at-m-cinema.is-heng .at-m-cinema__item {
                width: 100vw;
                margin-bottom: 0px;
            }
            .at-m-cinema__item {
                margin-bottom: 0px;
            }
            .at-m-cinema__header {
                display: none;
            }
            @page {
                size: ${pageWidthInPx}px ${pageHeightInPx}px; /* 动态设置页面大小 */
                margin: 0; /* 设置边距为0 */
            }

    `;
    document.head.appendChild(style);
})();
