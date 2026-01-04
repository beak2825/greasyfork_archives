// ==UserScript==
// @license      MIT
// @name         知乎专栏文章print mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎打印模式 print mode
// @match        *zhihu.com*
// @include      *://zhuanlan.zhihu.com/p/*
// @require      https://code.jquery.com/jquery-1.9.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472457/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0print%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/472457/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0print%20mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

           const printStyle = `
  @media print {
    .Sticky, .css-h7wqi8 {
      display: none;
    }
    .Post-NormalMain>div, .Post-NormalSub>div {
      width: auto;
    }
  }
`;

        // 获取文章内容
       $().ready (function (){

           const styleElement = document.createElement("style");
           styleElement.innerHTML = printStyle;

           document.head.appendChild(styleElement);
        });
    })();