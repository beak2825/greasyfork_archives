// ==UserScript==
// @name         精简快科技(驱动之家)新闻站
// @description  精简快科技新闻站
// @icon         http://www.drivergenius.com//favicon.ico
// @namespace https://greasyfork.org/users/204104
// @version      1.5
// @author       佚名
// @include      http*://*.mydrivers.com/*
// @downloadURL https://update.greasyfork.org/scripts/416375/%E7%B2%BE%E7%AE%80%E5%BF%AB%E7%A7%91%E6%8A%80%28%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%29%E6%96%B0%E9%97%BB%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/416375/%E7%B2%BE%E7%AE%80%E5%BF%AB%E7%A7%91%E6%8A%80%28%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%29%E6%96%B0%E9%97%BB%E7%AB%99.meta.js
// ==/UserScript==

(function () {

    //文章页精简
    var isContentPage = /.*htm$/.test(location.href) && /^http(s)?:\/\/news\.mydrivers\.com\/.*$/.test(location.href)
    if (isContentPage) {
        $(".xianguan").remove();
        $(".main_right").remove();
        $("body").html($(".main_box").html().replace('<div class="main_left" style="width:1000px;">', '<div class="main_left" style="margin:0 auto;float:none;">'))
    }

    // 首页精简
    var checkIndex = window.location.href.match(/mydrivers\.com\/$/);//检查首页
    var newsList = null;
    if (checkIndex) {
        // 设置字体颜色
        $("style").append(" .newslist li a{color:#222} .newslist li a.itred{color:#d22222} ");

        $(".main_right").remove();
        newsList = $(".main").first().html();
    }
    if (newsList) {
        newsList = newsList.replace('class="main_left"','class="main_left" style="margin:0 auto;float:none;"');
        newsList = newsList.replace(/redb/g, "itred");
        $("body").html(newsList);
        $(".main_2").remove();
        $("h4").remove();
    }

    // 按关键字屏蔽内容条目
    var BanText = ["年卡"]; //屏蔽的字符
    //Ban掉相关字符
    if (checkIndex) {
        BanText.map(function (v) {
            $('li:contains(' + v + ')').hide();
        })
    }
})()