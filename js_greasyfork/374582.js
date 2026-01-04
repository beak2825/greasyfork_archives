// ==UserScript==
// @name         CSDN NoAd
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to delete the advertisement of CSDN!
// @author       Hwang
// @grant        none
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @downloadURL https://update.greasyfork.org/scripts/374582/CSDN%20NoAd.user.js
// @updateURL https://update.greasyfork.org/scripts/374582/CSDN%20NoAd.meta.js
// ==/UserScript==

var interval = 2000;
var sideInterval = 2000;
var bbsInterval = 2000; // 在ADBlock之后运行
(function () {
    'use strict';
    var currentURL = window.location.href;
    var blog = /article/;
    var bbs = /topics/;
    //若为CSDN论坛,则：
    if(bbs.test(currentURL)){
        setTimeout(function () {
            $(".js_show_topic").click();
            document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            console.log("removed");
        }, bbsInterval);
    }else if (blog.test(currentURL)){
        if (document.getElementById("btn-readmore")){document.getElementById("btn-readmore").click();} //自动展开
        csdn.copyright.init("", "", ""); //去除剪贴板劫持
        setTimeout(function () {
            document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove(); //左上广告
            document.getElementById("asideFooter").remove();
            document.getElementById("adContent").remove();
            document.getElementsByClassName("p4course_target")[0].remove();
            document.getElementsByClassName("bdsharebuttonbox")[0].remove();
            document.getElementsByClassName("vip-caise")[0].remove();
        }, interval);
        setTimeout(function () {
            $("div[id^='dmp_ad']")[0].remove();
            document.getElementsByClassName("fourth_column")[0].remove();
        }, sideInterval);
        setTimeout(function () {
            document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            var recommendObj = document.getElementsByClassName("recommend-fixed-box")[0].getElementsByClassName("right-item");
            for (var h = (recommendObj.length - 1); h>=0; h--) {
                if (recommendObj[h].tagName == "DIV") {
                    recommendObj[h].remove();
                }
            }
            document.getElementsByClassName("p4course_target")[0].remove();
        }, sideInterval);
        setTimeout(function () {
            var hot = document.getElementsByClassName("type_hot_word");
            var recommend = document.getElementsByClassName("recommend-ad-box");
            for (var i = (hot.length - 1); i >= 0; i--) {
                hot[i].remove();
            }
            for (var j = (recommend.length - 1); j >= 0; j--) {
                recommend[j].remove();
            }
        }, sideInterval);
    }
})();


