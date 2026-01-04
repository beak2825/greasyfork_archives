// ==UserScript==
// @name         百度页面带谷歌搜索
// @namespace    https://github.com/kana112233/Tampermonkey-user-js
// @version      1.0.2
// @description  百度搜索加上谷歌按钮
// @author       makey
// @grant        GM_openInTab
// @include      https://www.baidu.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378614/%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E5%B8%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/378614/%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E5%B8%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function() {
   'use strict';

   function getGoogleUrl(searchText) {
       return 'https://www.google.com/search?q=' + searchText;
   }
   function googleIt() {
       var searchText = document.querySelector('#kw').value;
       GM_openInTab( getGoogleUrl(searchText), false);
   }
   $('#su').after('<input type="button" id="google" value="Google一下" class="btn self-btn bg s_btn" style="background-color:black;" />');

   $("#google").click(function() {
       googleIt();
   });

   setInterval(function(){
       if($("#google").val() !== "Google一下"){
           $("#google").val("Google一下");
       }
   }, 50);

})();