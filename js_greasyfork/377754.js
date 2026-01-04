// ==UserScript==
// @name         CSDN自动阅读全文
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description   CSDN自动阅读全文删除一些广告
// @author       EdgarLi
// @match        *://blog.csdn.net
// @match        *://blog.csdn.net/*
// @match        *://bbs.csdn.net/*
// @match        *://so.csdn.net/*
// @match        *://www.csdn.net
// @match        *://www.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377754/CSDN%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/377754/CSDN%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    $('#btn-readmore').click();
    var url = location.href;
    var blogcsdn = /blog.csdn.net/i;
    if (blogcsdn.test(url)) {
        $(".box-box-large").remove();
        $("#asideProfile").next().remove();
        $($("#asideFooter").find("div").first()).remove();
        $(".banner-ad-box").remove();
        $($("aside div").first()).remove();
        $("#asideFooter").remove();
        $("#layerd").remove();
        $("#reportContent").remove();
        $("main").css("margin-bottom", "0px");
        $("main").css("float", "none");
        $("main").css("margin", "auto");
        $(".advert-bg").remove();
        $(".advert-cur").remove();
        $('newsfeed').remove();
        $('aside').remove();
    }
})();