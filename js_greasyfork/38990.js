// ==UserScript==
// @name         CSDN自动阅读全文
// @namespace    https://greasyfork.org/zh-CN/users/141921
// @version      0.0.2
// @description  阅读CSDN文章时，无需点击按钮，自动阅读全文。
// @author       Vinx
// @match        http://blog.csdn.net/*/article/details/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/38990/CSDN%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/38990/CSDN%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t = $(window).height(),
        n = $(".article_content").height();
    $(".readall_box").hide().addClass("readall_box_nobg");
    if (n > 2 * t) {
        $(".article_content").height(2 * t - 285).css({
            overflow: "hidden"
        });
    }
    $(".article_content").height("").css({
        overflow: "hidden"
    });
    $(".article_content").removeClass("article_Hide");
    $(".readall_box").hide().addClass("readall_box_nobg");
    $("pre").css("white-space","pre-wrap");
    // Your code here...
})();