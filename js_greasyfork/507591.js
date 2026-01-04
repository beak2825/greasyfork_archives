// ==UserScript==
// @name         Poe页面显示优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将页面所有文本的字体统一替换为 Mac 友好的中文字体配置
// @match        *://poe.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507591/Poe%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/507591/Poe%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mac 优化的中文字体配置
    var newFont = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif";

    // 创建一个新的样式元素
    var style = document.createElement('style');
    style.textContent = `
        * {
            font-family: ${newFont} !important;
        }

        /* 确保 input, textarea 和 button 也使用相同的字体 */
        input, textarea, button {
            font-family: ${newFont} !important;
        }

        /* 覆盖可能使用 @font-face 的元素 */
        [style*="font-family"] {
            font-family: ${newFont} !important;
        }

        .InfiniteScroll_container__PHsd4 {
            width: 60%;
        }


        .Message_leftSideMessageBubble__VPdk6 {
            background-color: #fafafa !important;
            color: #333;
            max-width: 900px;
            padding: 30px 30px;
        }

        .Message_rightSideMessageBubble__ioa_i {
            color: #fff;
        }

        .Markdown_markdownContainer__Tz3HQ {
            font-size: 16px;
            gap: 12px;
        }

        .Markdown_markdownContainer__Tz3HQ li,
        .Markdown_markdownContainer__Tz3HQ p,
        .Markdown_markdownContainer__Tz3HQ h1,
        .Markdown_markdownContainer__Tz3HQ h2,
        .Markdown_markdownContainer__Tz3HQ h3,
        .Markdown_markdownContainer__Tz3HQ h4,
        .Markdown_markdownContainer__Tz3HQ h5{
            line-height: 1.6em;
        }

        .Markdown_markdownContainer__Tz3HQ li {
            margin-bottom: 10px;
        }

        .ChatMessageActionBar_actionBar__gyeEs,
        .ChatMessageFollowupActions_container__0Mrhg {
            display:none;
        }

        .Markdown_markdownContainer__Tz3HQ h1 {
           font-size: 1.5em;
        }

        .Markdown_markdownContainer__Tz3HQ h2 {
           font-size: 1.35em;
        }

        .Markdown_markdownContainer__Tz3HQ h3 {
           font-size: 1.2em;
        }

        .Markdown_markdownContainer__Tz3HQ h4 {
           font-size: 1.1em;
        }

        .Markdown_markdownContainer__Tz3HQ h5 {
           font-size: 1em;
        }

        .MainLeftSidebar_sidebar__C6HpK .SidebarSection_section__uBaAP:last-of-type {
           display: none;
        }
    `;

    // 将样式添加到文档头部
    document.head.appendChild(style);
})();