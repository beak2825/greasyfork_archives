// ==UserScript==
// @name         光速画像拡大
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  光速がぞうちゃんねるの画像を大きく表示します
// @author       TOKUIMEI
// @match        https://kohsoku.info/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368962/%E5%85%89%E9%80%9F%E7%94%BB%E5%83%8F%E6%8B%A1%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/368962/%E5%85%89%E9%80%9F%E7%94%BB%E5%83%8F%E6%8B%A1%E5%A4%A7.meta.js
// ==/UserScript==

$(function(){
    setInterval(function(){
        $(".lazy-loaded").each(function(){
            var address = $(this).attr('src');
            address = address.replace("/s","");

            $(this).attr('src', address);
            $(this).attr('width', 600);
           // $(this).attr('data-src', address);
            $(this).removeClass("lazy-loaded");
        });
    },50);
})(jQuery);