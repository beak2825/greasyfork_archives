// ==UserScript==
// @name         美化字体样式-VisJoker
// @description  网页字体美化
// @include      http://*
// @include      https://*
// @exclude      192.168.1.*/*
// @version      4.3
// @namespace    VisJoker
// @grant        GM_addStyle
// @run-at       document-start
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/434202/%E7%BE%8E%E5%8C%96%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F-VisJoker.user.js
// @updateURL https://update.greasyfork.org/scripts/434202/%E7%BE%8E%E5%8C%96%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F-VisJoker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 CSS 样式字符串
    var cssText = `
        /* 设置链接样式 */
        a:hover {
            color: #39F !important;
            text-shadow: -5px 3px 18px #39F !important;
            transition: all 0.3s ease-out;
        }

        a {
            transition: all 0.3s ease-out;
            text-decoration: none !important;
            font-weight: 500 !important;
            font-family: "Microsoft Yahei", sans-serif !important;
        }

        /* 精准字体规则 */
        *:not(i):not([class*="btn"]):not([class*="material-symbols"]):not([class*="tb_"]):not([class^="remix-"]):not([class*="icon"]):not([data-font="icon"]) {
            font-family: "Segoe UI Symbol", "Microsoft Yahei", Arial, sans-serif !important;
        }

        /* 文本阴影规则 */
        *:not([class*="hermit"]):not([class*="btn"]):not([class*="button"]):not([class*="ico"]) {
            text-shadow: 0.005em 0.005em 0.025em #999999 !important;
        }

        /* 贴吧专用修复 */
        [class*="material-symbols"],
        [class^="remix-"],
        [data-font="icon"],
        [class*="tb_icon"] {
            font-family: "Material Symbols Outlined", "Segoe UI Symbol" !important;
            text-shadow: none !important;
            font-weight: 400 !important;
            font-style: normal !important;
        }

        /* 基础样式 */
        * {
            text-decoration: none !important;
            font-weight: 500 !important;
        }
    `;

    // 创建并添加样式表
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = cssText;
    } else {
        style.appendChild(document.createTextNode(cssText));
    }
    document.head.appendChild(style);
})();