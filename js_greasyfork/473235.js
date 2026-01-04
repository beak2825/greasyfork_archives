// ==UserScript==
// @name         抖音web版滚动条增强显示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  抖音web版www.douyin.com搜索页滚动条增强显示
// @author       zjf
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473235/%E6%8A%96%E9%9F%B3web%E7%89%88%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%A2%9E%E5%BC%BA%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/473235/%E6%8A%96%E9%9F%B3web%E7%89%88%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%A2%9E%E5%BC%BA%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle("::-webkit-scrollbar-thumb:hover, :hover::-webkit-scrollbar-thumb{background:#fe2c55}");
     GM_addStyle("::-webkit-scrollbar-thumb{background:#fe2c55}");
     GM_addStyle("*{scrollbar-color: red transparent;}");
    // Your code here...
})();