// ==UserScript==
// @name         ChatGPT 页面字体改为 LXGW WenKai
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将 chatgpt.com 页面字体强制替换为 LXGW WenKai，适合截图使用
// @author       @阿尼亚是安妮亞
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/534148/ChatGPT%20%E9%A1%B5%E9%9D%A2%E5%AD%97%E4%BD%93%E6%94%B9%E4%B8%BA%20LXGW%20WenKai.user.js
// @updateURL https://update.greasyfork.org/scripts/534148/ChatGPT%20%E9%A1%B5%E9%9D%A2%E5%AD%97%E4%BD%93%E6%94%B9%E4%B8%BA%20LXGW%20WenKai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 引入字体
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://chinese-fonts-cdn.deno.dev/packages/lxgwwenkai/dist/LXGWWenKai-Regular/result.css';
    document.head.appendChild(fontLink);

    // 应用字体到整个页面
    GM_addStyle(`
        * {
            font-family: 'LXGW WenKai', sans-serif !important;
        }
    `);
})();
