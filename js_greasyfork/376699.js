// ==UserScript==
// @name         博客园随笔详情页，随笔标题后显示底部信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  博客园随笔详情，将文章内容底部信息复制显示到文章详情的标题下面,参考了 http://chromecj.com/web-development/2018-07/1468.html
// @author       wakasann
// @grant        none
// @include     https://www.cnblogs.com/*/p/*
// @match https://www.cnblogs.com/*/p/*
// @require https://cdn.bootcss.com/jquery/2.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376699/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E9%9A%8F%E7%AC%94%E8%AF%A6%E6%83%85%E9%A1%B5%EF%BC%8C%E9%9A%8F%E7%AC%94%E6%A0%87%E9%A2%98%E5%90%8E%E6%98%BE%E7%A4%BA%E5%BA%95%E9%83%A8%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/376699/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E9%9A%8F%E7%AC%94%E8%AF%A6%E6%83%85%E9%A1%B5%EF%BC%8C%E9%9A%8F%E7%AC%94%E6%A0%87%E9%A2%98%E5%90%8E%E6%98%BE%E7%A4%BA%E5%BA%95%E9%83%A8%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==


(function() {
    'use strict';
    jQuery(function($){
      setTimeout(function(){
	      // post detail copy the post info after the post title
	      if($("#post_detail").length > 0 && $(".postDesc").length <= 1){
	        $("#post_detail .post .postTitle").eq(0).append("<div class='clear'></div>").after($("#post_detail .post .postDesc").clone());
	      }
      },500);
    });
})();