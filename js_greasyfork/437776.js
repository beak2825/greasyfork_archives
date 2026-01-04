// ==UserScript==
// @name         百度页面带hk谷歌搜索（基于makey修改版）
// @namespace    https://github.com/kana112233/Tampermonkey-user-js
// @version      1.0
// @description  百度搜索加上hk谷歌按钮
// @author       Levan
// @grant        GM_openInTab
// @include      https://www.baidu.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437776/%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E5%B8%A6hk%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%EF%BC%88%E5%9F%BA%E4%BA%8Emakey%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/437776/%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E5%B8%A6hk%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%EF%BC%88%E5%9F%BA%E4%BA%8Emakey%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
   'use strict';




   function getGoogleUrl(searchText) {
       return 'https://www.google.com.hk/search?q=' + searchText;
   }
   function googleIt() {
       var searchText = document.querySelector('#kw').value;
       GM_openInTab( getGoogleUrl(searchText), false);
   }
   //$('.s_btn_wr').after('<input type="button" id="google" value="Google一下" class="btn self-btn bg s_btn" style="background-color: #4e6ef2; " />');

   $('.s_btn_wr').after('<span class="bg s_btn_wr"><input type="button" id="google" value="Google一下" class="btn self-btn bg s_btn" style="border-radius: .1rem;margin-left: .05rem;" /></span>');



   $("#google").click(function() {
       googleIt();
   });

   setInterval(function(){
       if($("#google").val() !== "Google一下"){
           $("#google").val("Google一下");
       }
   }, 30);

})();