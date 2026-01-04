// ==UserScript==
// @name         隐藏web端极客时间专栏列表的封面图
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  try to take over the world!
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @author       techqu
// @match        https://time.geekbang.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/378098/%E9%9A%90%E8%97%8Fweb%E7%AB%AF%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E4%B8%93%E6%A0%8F%E5%88%97%E8%A1%A8%E7%9A%84%E5%B0%81%E9%9D%A2%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/378098/%E9%9A%90%E8%97%8Fweb%E7%AB%AF%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E4%B8%93%E6%A0%8F%E5%88%97%E8%A1%A8%E7%9A%84%E5%B0%81%E9%9D%A2%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function () {

     var timer = setInterval(function(){hide_cover(timer)},2000);

     function hide_cover(timer) {
     

             $("link").each(function(index,domEle){
                  if($(domEle).attr('rel')=='icon'){
                         $(domEle).remove();
                     }
             })
       }

     });


})();
