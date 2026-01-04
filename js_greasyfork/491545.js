// ==UserScript==
// @name         通义千问界面小优化
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  优化了通义千问的问题颜色
// @author       https://github.com/amarillys
// @match        https://tongyi.aliyun.com/qianwen/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongyi.aliyun.com
// @grant GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491545/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E7%95%8C%E9%9D%A2%E5%B0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491545/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E7%95%8C%E9%9D%A2%E5%B0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css =`
        div[class^="questionItem--"] {
            background: lightslategrey;
            position: relative;
            border-radius: 8px;
        }

        div[class^="questionItem--"] .tongyi-ui-markdown {
            color: lightcyan;
        }

        div[class^="questionItem--"]::before {
            position: absolute;
            top: 0px;
            left: -60px;
            right: -20px;
            bottom: 0px;
            background-color: lightslategrey;
            content: "";
            border-radius: 8px;
        }`;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
    // Your code here...
})();