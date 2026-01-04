// ==UserScript==
// @name         葬花阁图库修复
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  葬花阁图片有的不显示，所以搞了这个
// @author       You
// @match        http://zhg123.xyz/*
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443311/%E8%91%AC%E8%8A%B1%E9%98%81%E5%9B%BE%E5%BA%93%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/443311/%E8%91%AC%E8%8A%B1%E9%98%81%E5%9B%BE%E5%BA%93%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {

    if ($("img.zoom").length>0) {
        $("img.zoom").each(function(){
            var href = $(this).attr("src");
            href=href.replace('http://bt.1zhgtuv04-11.xyz/','http://bt.3zhgtu04-11.xyz/');
            $(this).attr('src',href);
        });
    }
    if ($(".xlmmlazy").length>0) {
        $(".xlmmlazy").each(function(){
            var href = $(this).attr("xlmmlazy");
            href=href.replace('http://bt.1zhgtuv04-11.xyz/','http://bt.3zhgtu04-11.xyz/');
            $(this).attr('xlmmlazy',href);
        });
    }

})();