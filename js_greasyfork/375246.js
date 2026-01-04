// ==UserScript==
// @name         去除CSDN强制登陆，自动展开全文
// @namespace    https://www.charlesw.cn/
// @version      0.11
// @description  现在CSDN不登陆都没法用了，这个可以解除3秒跳转
// @author       Chao WANG
// @match        https://blog.csdn.net/*
// @match        http://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375246/%E5%8E%BB%E9%99%A4CSDN%E5%BC%BA%E5%88%B6%E7%99%BB%E9%99%86%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/375246/%E5%8E%BB%E9%99%A4CSDN%E5%BC%BA%E5%88%B6%E7%99%BB%E9%99%86%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i);
    }
    $("script[src$='//g.csdnimg.cn/check-adblock/1.1.1/check-adblock.js']").remove();
    $(".adblock").remove();
    $(".check-adblock-bg").remove();
    $("#article_content").css("overflow", "overlay");
    $("#article_content").css("height", "auto");
    $("article.baidu_pl > div.hide-article-box").remove();
    $("div.pulllog-box").remove();
    $("div.container > aside > div:eq(1)").remove();
    $("#asideFooter > .aside-box:eq(0)").remove();
    $("li.bdsharebuttonbox").remove();
    $("#dmp_ad_58").remove();
    $("div.recommend-box > div.recommend-ad-box").remove();
})();