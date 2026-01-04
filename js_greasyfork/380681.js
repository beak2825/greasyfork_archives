// ==UserScript==
// @name 傲游哈哈广告AD haha.mx
// @description 取消哈哈广告
// @include     https://haha.mx/*
// @include     https://www.haha.mx/*
// @include     https://www.hahamx.cn/*
// @require     http://cdn.bootcss.com/jquery/1.11.3/jquery.js
// @grant       all
// @version 1.01
// @namespace https://greasyfork.org/users/51281
// @downloadURL https://update.greasyfork.org/scripts/380681/%E5%82%B2%E6%B8%B8%E5%93%88%E5%93%88%E5%B9%BF%E5%91%8AAD%20hahamx.user.js
// @updateURL https://update.greasyfork.org/scripts/380681/%E5%82%B2%E6%B8%B8%E5%93%88%E5%93%88%E5%B9%BF%E5%91%8AAD%20hahamx.meta.js
// ==/UserScript==

console.clear();
(function() {
  'use strict';
  
  function clearADS() {
    $(".sidebar-inner").remove();
    $(".footer").remove();
    $(".joke-list-anecdote").remove();
  }
  setInterval(function() {
    clearADS();
  }, 1000);
   
})();

console.log('遨游哈哈广告完成取消~~~~ by xh');