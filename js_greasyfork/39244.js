// ==UserScript==
// @name         No 驴
// @namespace    http://sunsetware.org/
// @version      0.1
// @description  和驴驴说再见。为过滤低劣的反串黑，屏蔽全体名称相同者。
// @author       TJYSunset
// @match        *://jandan.net/*
// @match        *://*.jandan.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39244/No%20%E9%A9%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/39244/No%20%E9%A9%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("head").append("<style>.donkey {font-family: monospace;}</style>");
    $(".commentlist li").each(function () {
        var author = $(this).find(".author strong").first();
        if (author.text() == "我是一只驴驴" || author.attr("title") == "防伪码：7d4bf8573f165f87273e990ade6a1f25c039af51") {
            $(this).find(".text").html("&nbsp;&nbsp;&nbsp;&nbsp;_\\<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/`b<br>/####J<br>&nbsp;|\\&nbsp;||").addClass("donkey");
        }
    });
})();