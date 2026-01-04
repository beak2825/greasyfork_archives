// ==UserScript==
// @name         六维网购工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://s.taobao.com/search?*
// @match        *://search.jd.com/*
// @grant        GM_registerMenuCommand
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/388606/%E5%85%AD%E7%BB%B4%E7%BD%91%E8%B4%AD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/388606/%E5%85%AD%E7%BB%B4%E7%BD%91%E8%B4%AD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单
    GM_registerMenuCommand("开始屏蔽淘宝低销量商品", TB_Remove);
    function TB_Remove(){
        var str = '';
        var sell = 50;
        var num = 0;
        $("div.deal-cnt").each(function(){
            str = $(this).text();
            if(parseInt(str.split('人')[0])<sell) {$(this).parent().parent().parent().hide();num++}
            str = '';
        })
        $(".info__npaid").each(function(){
            str = $(this).text();
            if(parseInt(str.split('人')[0])<sell) {$(this).parent().parent().parent().hide();num++}
            str = '';
        })
        if(num>0) alert('本页面共有'+num+'个商品低于'+sell+'人购买，已经被屏蔽！');
    }

    //淘宝搜索页小于指定人数付款商品屏蔽
    if (location.hostname === 's.taobao.com') {

    }

    //京东搜索页推广商品屏蔽
    if (location.hostname === 'search.jd.com') {
        $('.p-promo-flag').parent().parent().hide();
        // Your code here...
    }
})();
