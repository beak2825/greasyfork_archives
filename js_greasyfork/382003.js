// ==UserScript==
// @name         poe trade汉化版搜索时新窗口打开原版页面
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  poe trade汉化版搜索时新窗口打开原版页面同时把搜索按钮做成悬浮按钮
// @author       wishayne
// @match        http://poe.dr3gg.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382003/poe%20trade%E6%B1%89%E5%8C%96%E7%89%88%E6%90%9C%E7%B4%A2%E6%97%B6%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E5%8E%9F%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/382003/poe%20trade%E6%B1%89%E5%8C%96%E7%89%88%E6%90%9C%E7%B4%A2%E6%97%B6%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%E5%8E%9F%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //设置在新页面打开搜索结果
    $('#search').attr('target', '_blank');

    //把搜索按钮做成悬浮按钮
    var search_div = $("div.large-2.large-offset-8.columns");
    search_div.css('position', 'fixed');
    search_div.css('top', '10px');
    search_div.css('width', '7%');
})();