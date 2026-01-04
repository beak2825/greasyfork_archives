// ==UserScript==
// @name         谷歌搜索切换到桌面维基
// @namespace    https://huching.net/
// @version      0.1
// @description  谷歌搜索切换到桌面维基 （通过替换地址）
// @author       hz2
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450887/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2%E5%88%B0%E6%A1%8C%E9%9D%A2%E7%BB%B4%E5%9F%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450887/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2%E5%88%B0%E6%A1%8C%E9%9D%A2%E7%BB%B4%E5%9F%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Google ...
    [...document.querySelectorAll('a[href*="https://zh.m.wikisource.org"]')].forEach(x=> {
        x.href = x.href.replace('zh.m.wikisource.org','zh.wikisource.org')
    });
    [...document.querySelectorAll('a[href*="https://zh.m.wikipedia.org"]')].forEach(x=> {
        x.href = x.href.replace('zh.m.wikipedia.org','zh.wikipedia.org')
    });
})();