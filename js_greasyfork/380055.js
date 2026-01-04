// ==UserScript==
// @name 删除傲游哈哈广告 hahamx.cn
// @description 删除哈哈广告
// @include     https://www.haha.mx/*
// @include     https://www.hahamx.cn/*
// @require     http://cdn.bootcss.com/jquery/1.11.3/jquery.js
// @grant       all
// @version 1.03
// @namespace https://greasyfork.org/zh-CN/users/270812-lakshyayi
// @downloadURL https://update.greasyfork.org/scripts/380055/%E5%88%A0%E9%99%A4%E5%82%B2%E6%B8%B8%E5%93%88%E5%93%88%E5%B9%BF%E5%91%8A%20hahamxcn.user.js
// @updateURL https://update.greasyfork.org/scripts/380055/%E5%88%A0%E9%99%A4%E5%82%B2%E6%B8%B8%E5%93%88%E5%93%88%E5%B9%BF%E5%91%8A%20hahamxcn.meta.js
// ==/UserScript==

console.clear();
(function() {
  'use strict';
  
  function clearAD() {
    $(".joke-list-item-ad").remove();
    $(".anecdote-slider").remove();
    $(".float-left-ad").remove();
    $(".joke-list-anecdote").remove();


  }
  setInterval(function() {
    clearAD();
  }, 1000);
   
})();

console.log('完成');