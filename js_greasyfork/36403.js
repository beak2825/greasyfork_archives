// ==UserScript==
// @name         恢复闲鱼搜索功能
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用了这个脚本,还能使用电脑版闲鱼的搜索功能.顺便去了广告.
// @author       FC杀手

// @include     https://s.2.taobao.com/*
// @include     https://2.taobao.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/36403/%E6%81%A2%E5%A4%8D%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/36403/%E6%81%A2%E5%A4%8D%E9%97%B2%E9%B1%BC%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    //download-layer






var html_s = '\
 <div class="idle-search">\
    <form method="get" action="//s.2.taobao.com/list/list.htm" name="search" target="_top">\
    <input class="input-search" id="J_HeaderSearchQuery" name="q" type="text" value="" placeholder="搜闲鱼" />\
     <input type="hidden" name="search_type" value="item" autocomplete="off" />\
    <input type="hidden" name="app" value="shopsearch" autocomplete="off" />\
    <button class="btn-search" type="submit"><i class="iconfont">&#xe602;</i><span class="search-img"></span></button>\
     </form>\
    </div>';


document.getElementById("J_IdleHeader").innerHTML= document.getElementById("J_IdleHeader").innerHTML + html_s;

     GM_addStyle(".download-layer{display:none;}.mau-guide{display:none;}");

})();