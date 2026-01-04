// ==UserScript==
// @name         廖雪峰 浏览优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  目前做了固定目录树，单独滚动，可以避免文章太长浏览结束切换目录需要回到顶部
// @author       lzcer
// @match        https://www.liaoxuefeng.com/*
// @icon         https://www.liaoxuefeng.com/favicon.ico
// @grant        none
// @license      lzcer
// @downloadURL https://update.greasyfork.org/scripts/440385/%E5%BB%96%E9%9B%AA%E5%B3%B0%20%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440385/%E5%BB%96%E9%9B%AA%E5%B3%B0%20%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.x-sidebar-left').css('position', 'fixed').css('overflow-y', 'scroll').css('height', '100%');
    $('.uk-flex-item-1').css('margin-left', '316px');
    // Your code here...
})();