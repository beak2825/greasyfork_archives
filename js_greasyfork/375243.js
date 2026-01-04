// ==UserScript==
// @name         CSDN网页优化，自动展开，去广告，免登陆，剪切板净化 2018-12-13可用
// @namespace    http://www.wandhi.com/
// @version      1.2
// @description  CSDN网页优化，自动展开，去广告，免登陆，剪切板净化
// @author       Wandhi
// @icon         https://www.wandhi.com/favicon.ico
// @match        *://blog.csdn.net/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375243/CSDN%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%EF%BC%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%85%8D%E7%99%BB%E9%99%86%EF%BC%8C%E5%89%AA%E5%88%87%E6%9D%BF%E5%87%80%E5%8C%96%202018-12-13%E5%8F%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/375243/CSDN%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%EF%BC%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%85%8D%E7%99%BB%E9%99%86%EF%BC%8C%E5%89%AA%E5%88%87%E6%9D%BF%E5%87%80%E5%8C%96%202018-12-13%E5%8F%AF%E7%94%A8.meta.js
// ==/UserScript==
(function () {
    $("#article_content").css("overflow", "overlay");
    $("#article_content").css("height", "auto");
    $("article.baidu_pl > div.hide-article-box").remove();
    $("div.pulllog-box").remove();
    $("div.container > aside > div:eq(1)").remove();
    $("#asideFooter > .aside-box:eq(0)").remove();
    $(".adblock").remove();
    $("li.bdsharebuttonbox").remove();
    $("#dmp_ad_58").remove();
    $("div.recommend-box > div.recommend-ad-box").remove();
    $(".type_hot_word").remove();    
    $(".hide-article-box.hide-article-pos.text-center").remove();
    if (typeof (csdn) != "undefined") {
        csdn.copyright.init("", "", "");
    }
    var hookedInterval = window.setInterval;    
    window.setInterval = function (callback, seconds) {        
        if (seconds == 1e3) {
            document.querySelector('#check-adblock-time').remove();
            return;
        }
        hookedInterval(callback, seconds);
    };
    window.csdn.anonymousUserLimit.judgment = function () {
        return true;
    };
    window.csdn.anonymousUserLimit.Jumplogin = function () {
        console.log("Fuck CSDN :)");
    };
})();