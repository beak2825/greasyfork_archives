// ==UserScript==
// @name         中国证券网
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  调整网页布局，方便手动复制。
// @author       陈庚
// @match        http://news.cnstock.com/bwsd/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/379344/%E4%B8%AD%E5%9B%BD%E8%AF%81%E5%88%B8%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/379344/%E4%B8%AD%E5%9B%BD%E8%AF%81%E5%88%B8%E7%BD%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    $("div.left-side").find("ul.nf-list").find("p.des").each(function(){
        //alert($(this).find("a").attr("href"));
        $(this).prepend("<div>中国证券网</div>");
        $(this).append("<div></div><div>"+$(this).find("a").attr("href")+"</div>");
    });
    
})();