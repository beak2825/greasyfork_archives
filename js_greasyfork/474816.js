// ==UserScript==
// @name         ChatGPT 字体更换
// @namespace    GPT_font
// @version      1.0
// @description  ChatGPT 字体更换，建议在win平台使用（mac端字体不丑）
// @author       peisp
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/474816/ChatGPT%20%E5%AD%97%E4%BD%93%E6%9B%B4%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/474816/ChatGPT%20%E5%AD%97%E4%BD%93%E6%9B%B4%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        .antialiased {
            font-family: 苹方-简;
        }
    `);
})();