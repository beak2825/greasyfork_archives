// ==UserScript==
// @name         金投快讯
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  调整网页布局，方便手动复制。
// @author       
// @match        https://kuaixun.cngold.org/
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371403/%E9%87%91%E6%8A%95%E5%BF%AB%E8%AE%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/371403/%E9%87%91%E6%8A%95%E5%BF%AB%E8%AE%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(".dianzan").remove();
    $("#listTable").find("td.item-news").find(".cont").each(function(){
        //alert($(this).find("a").attr("href"));
        $(this).prepend("<div>金投快讯</div>");
        $(this).append("<div></div><div>"+$(this).find("a").attr("href")+"</div>");
    });
    
})();