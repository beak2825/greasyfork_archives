// ==UserScript==
// @name         谷歌带百度
// @namespace    https://github.com/kana112233/Tampermonkey-user-js
// @version      1.0.2
// @description google with baidu ok
// @author       makey
// @grant        GM_openInTab
// @include      https://www.google.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/378616/%E8%B0%B7%E6%AD%8C%E5%B8%A6%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/378616/%E8%B0%B7%E6%AD%8C%E5%B8%A6%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==
(function() {
    'use strict';

   function getBaiduOnceUrl(searchText) {
       return 'https://www.baidu.com/s?wd=' + searchText;
   }
   function BaiduOnce() {
       var searchText = document.getElementsByName('q')[0].value;
       GM_openInTab( getBaiduOnceUrl(searchText), false);
   }
   $('#gbqfbb').after('<input type="button" id="baiduId" value="百度一下" class="btn self-btn bg s_btn" style="background-color:#f2f2f2;border:1px solid #f2f2f2;border-radius: 4px;width:142.5px;height:36px" />');
   $('#hdtb-msb').after('<input type="button" id="baiduId" value="百度一下" class="btn self-btn bg s_btn" style="background-color:#f2f2f2;border:1px solid #f2f2f2;border-radius: 4px;width:142.5px;height:36px" />');

   $("#baiduId").click(function() {
        BaiduOnce();
   });

})();