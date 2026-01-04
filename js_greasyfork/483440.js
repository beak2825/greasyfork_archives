// ==UserScript==
// @name         修复 Bilibili 横向滚动条问题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复 Bilibili 搜索栏宽度溢出导致页面出现横向滚动条的问题
// @author       Ganlv
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://link.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://account.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://bangumi.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483440/%E4%BF%AE%E5%A4%8D%20Bilibili%20%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E6%9D%A1%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/483440/%E4%BF%AE%E5%A4%8D%20Bilibili%20%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E6%9D%A1%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // input 元素默认有 20 字符宽度，且这个宽度不能被 flex-shrink，必须显式指定一个宽度，然后靠 flex-grow 来撑起宽度
    GM_addStyle(`input.nav-search-input, input.nav-search-content, input.search-input-el, input.nav-search-keyword { width: 1em; }`);
})();