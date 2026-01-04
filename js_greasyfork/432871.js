// ==UserScript==
// @name         小鹅通专栏优化
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  设置 title
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @author       techqu
// @match        https://apppukyptrl1086.pc.xiaoe-tech.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432871/%E5%B0%8F%E9%B9%85%E9%80%9A%E4%B8%93%E6%A0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432871/%E5%B0%8F%E9%B9%85%E9%80%9A%E4%B8%93%E6%A0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function () {

     var timer = setInterval(function(){hide_cover(timer)},2000);

     function hide_cover(timer) {
     
           var title =  $('.detail-header-right-title-main').text();
	       $("title").html(title);
             
       }

     });


})();
