// ==UserScript==
// @name         AGSV 发种辅助助手
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  Agsv 发种辅助助手
// @author       7ommy
// @match        https://*.agsvpt.com/upload.php
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agsvpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484739/AGSV%20%E5%8F%91%E7%A7%8D%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/484739/AGSV%20%E5%8F%91%E7%A7%8D%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var textarea = $("#descr");

    textarea.on('input', function() {
        var content = $(this).val();
        console.log(content);

        // 使用正则表达式匹配IMDb和豆瓣链接
        //var imdbLink = content.match(/https?:\/\/.*?imdb\.com\/[^\s]+/g);
        //var doubanLink = content.match(/https?:\/\/.*?douban\.com\/[^\s]+/g);

        var imdbLink = content.match(/https?:\/\/[^\s\[\]{}()<>]+imdb\.com\/[^\s\[\]{}()<>]+/g);
        var doubanLink = content.match(/https?:\/\/[^\s\[\]{}()<>]+douban\.com\/[^\s\[\]{}()<>]+/g);

        var element_imdb, element_douban;

        if (window.location.href.includes("www.agsvpt.com/upload.php") || window.location.href.includes("aborad.agsvpt.com/upload.php")){
            element_imdb = $('#compose > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > div > input[type="text"]');
            element_douban = $('#compose > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div > input[type="text"]');
        }

        if (window.location.href.includes("new.agsvpt.com/upload.php")){
            element_imdb = $('#compose > table > tbody > tr:nth-child(7) > td:nth-child(2) > div > div > input[type="text"]');
            element_douban = $('#compose > table > tbody > tr:nth-child(8) > td:nth-child(2) > div > div > input[type="text"]');
        }

        if (imdbLink) {
            console.log('IMDb link found:', imdbLink[0]);
            element_imdb.val(imdbLink[0]);
        }

        if (doubanLink) {
            console.log('Douban link found:', doubanLink[0]);
            element_douban.val(doubanLink[0]);
        }
    });


    window.onload = function() {
        $("#descr").val($("#descr").val().replace("[quote][b][color=Blue]Agsv官组作品，感谢原制作者发布。[/color][/b][/quote]\n", ""));
    };

    // $("#descr").val($("#descr").val().replace("[quote][b][color=Blue]Agsv官组作品，感谢原制作者发布。[/color][/b][/quote]\n", ""));
})();