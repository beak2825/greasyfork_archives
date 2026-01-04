// ==UserScript==
// @name         屏蔽【新闻快搜】垃圾内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽Google中文搜索结果【新闻快搜】垃圾内容
// @author       gongjunhao@sina.com
// @match        https://www.google.com/search?*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389169/%E5%B1%8F%E8%94%BD%E3%80%90%E6%96%B0%E9%97%BB%E5%BF%AB%E6%90%9C%E3%80%91%E5%9E%83%E5%9C%BE%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/389169/%E5%B1%8F%E8%94%BD%E3%80%90%E6%96%B0%E9%97%BB%E5%BF%AB%E6%90%9C%E3%80%91%E5%9E%83%E5%9C%BE%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $(".g").each(function() {
         var hrefAddress = $(this).find("div div div a").attr("href");
         console.log(hrefAddress);
         if(hrefAddress.indexOf("so.php") > 0) {
             $(this).remove();
         }
     });
    // Your code here...
})();