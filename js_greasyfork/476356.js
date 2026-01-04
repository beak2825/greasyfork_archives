// ==UserScript==
// @name         B站搜索页自动展开“更多筛选”
// @namespace    https://greasyfork.org/users/759046
// @version      0.1
// @description  自动展开搜索详情页的“自动筛选”选项
// @author       233yuzi
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476356/B%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E2%80%9C%E6%9B%B4%E5%A4%9A%E7%AD%9B%E9%80%89%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/476356/B%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E2%80%9C%E6%9B%B4%E5%A4%9A%E7%AD%9B%E9%80%89%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn =document.getElementsByClassName("i_button_more")[0];
    setTimeout(function() {
        btn.click();
    },200);
})();