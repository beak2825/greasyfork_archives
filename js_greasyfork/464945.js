// ==UserScript==
// @name         bilibili去掉首页左上角推荐
// @namespace    bilibili_js
// @version      1.1
// @description  去掉首页左上角推荐
// @author       孙宏俊
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @github
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464945/bilibili%E5%8E%BB%E6%8E%89%E9%A6%96%E9%A1%B5%E5%B7%A6%E4%B8%8A%E8%A7%92%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/464945/bilibili%E5%8E%BB%E6%8E%89%E9%A6%96%E9%A1%B5%E5%B7%A6%E4%B8%8A%E8%A7%92%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.recommended-swipe.grid-anchor').style.display = 'none'
})();