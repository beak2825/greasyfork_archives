// ==UserScript==
// @name         豆瓣默认不分享
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将豆瓣「电影/音乐/游戏/小说」标记时的“分享到广播”默认【开启】改为【关闭】
// @author       Priate
// @match        https://*.douban.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402317/%E8%B1%86%E7%93%A3%E9%BB%98%E8%AE%A4%E4%B8%8D%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/402317/%E8%B1%86%E7%93%A3%E9%BB%98%E8%AE%A4%E4%B8%8D%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const re = new RegExp("{isShuoChecked}","g");
    var res_str = $('#template-collect-popup').html().replace(re, "");
    $('#template-collect-popup').html(res_str);
})();