// ==UserScript==
// @name         B站搜索框推荐词屏蔽 Bilibili Replace Search Placeholder
// @namespace    https://example.com
// @version      0.5
// @description  只在 www.bilibili.com 域名及其子路径生效
// @match        *://www.bilibili.com/*
// @match        *://www.space.bilibili.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/525235/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E6%8E%A8%E8%8D%90%E8%AF%8D%E5%B1%8F%E8%94%BD%20Bilibili%20Replace%20Search%20Placeholder.user.js
// @updateURL https://update.greasyfork.org/scripts/525235/B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E6%8E%A8%E8%8D%90%E8%AF%8D%E5%B1%8F%E8%94%BD%20Bilibili%20Replace%20Search%20Placeholder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const inputEl = document.querySelector('input.nav-search-input');
        if (inputEl) {
            if (inputEl.placeholder !== " ") {
                inputEl.placeholder = " ";
            }
            if (inputEl.getAttribute('title') !== " ") {
                inputEl.setAttribute('title', " ");
            }
        }
    }, 10);
})();