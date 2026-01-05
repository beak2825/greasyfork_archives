// ==UserScript==
// @name         V2EX.js
// @namespace    https://github.com/zhihaofans
// @version      0.6.2
// @description  V2EX助手
// @author       zhihaofans
// @match        https://www.v2ex.com/*
// @match        https://v2ex.com/*
// @grant        none
// @icon         https://www.v2ex.com/static/img/icon_rayps_64.png
// @downloadURL https://update.greasyfork.org/scripts/21377/V2EXjs.user.js
// @updateURL https://update.greasyfork.org/scripts/21377/V2EXjs.meta.js
// ==/UserScript==
$(document).ready(function() {
    //搜索改为百度
    $("#Search form").submit(function() {
        var q = $("#q");
        if (q.val() !== "") {
            var url = "https://www.baidu.com/s?wd=site:v2ex.com%20" + q.val();
            if (navigator.userAgent.indexOf('iPad') > -1 || navigator.userAgent.indexOf('iPod') > -1 || navigator.userAgent.indexOf('iPhone') > -1) {
                location.href = url;
            } else {
                window.open(url, "_blank");
            }
            return false;
        } else {
            return false;
        }
    });
    var nowurl = location.pathname;
    //超链接改为新标签打开
    if (nowurl == "/" || nowurl.substr(0, 6) == "/?tab=" || nowurl.substr(0, 4) == "/go/" || nowurl == "/recent") {
        $("span.item_title a").attr("target", "_blank");
    }
    //楼主标记
    if (nowurl.substr(0, 3) == "/t/") {
        $("a[rel=nofollow]").attr("target", "_blank");
        $(".inner a").attr("target", "_blank");
        $(".inner:first a").removeAttr("target");
        var lzname = $(".header .gray a").text();
        var replynum = $("div.cell[id^=r_] strong a").length;
        for (var aa = 0; aa < replynum; aa++) {
            // console.log($("div.cell[id^=r_]:eq("+aa+") strong a").text());
            if ($("div.cell[id^=r_]:eq(" + aa + ") strong a").text() == lzname) {
                $("div.cell[id^=r_]:eq(" + aa + ") strong").html($("div.cell[id^=r_]:eq(" + aa + ") strong").html() + "&nbsp;[楼主]");
            }
        }
    }
    //屏蔽右侧广告
    $("#Rightbar .box .sidebar_compliance").parent().hide();
    //原搜索删除
    $("#Search form").removeAttr("onsubmit");
});
