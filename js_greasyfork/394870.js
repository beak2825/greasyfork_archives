// ==UserScript==
// @name         不看广告:juejin右侧+csdn自动展开+去广告+净化剪贴板+免登陆+woshipm+segment
// @namespace    http://tampermonkey.net/
// @version      1.3.18
// @description  JueJin ITeye CSDN自动展开阅读，可以将剪贴板的推广信息去除，去除大多数广告。
// @author       inyu
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @match        *://*.juejin.cn/*
// @match        *://*.gitee.com/-/ide/*
// @match        *://*.woshipm.com/*
// @match        *://*.segmentfault.com/*
// @grant        none
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/394870/%E4%B8%8D%E7%9C%8B%E5%B9%BF%E5%91%8A%3Ajuejin%E5%8F%B3%E4%BE%A7%2Bcsdn%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%2B%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E5%87%80%E5%8C%96%E5%89%AA%E8%B4%B4%E6%9D%BF%2B%E5%85%8D%E7%99%BB%E9%99%86%2Bwoshipm%2Bsegment.user.js
// @updateURL https://update.greasyfork.org/scripts/394870/%E4%B8%8D%E7%9C%8B%E5%B9%BF%E5%91%8A%3Ajuejin%E5%8F%B3%E4%BE%A7%2Bcsdn%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%2B%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E5%87%80%E5%8C%96%E5%89%AA%E8%B4%B4%E6%9D%BF%2B%E5%85%8D%E7%99%BB%E9%99%86%2Bwoshipm%2Bsegment.meta.js
// ==/UserScript==

// 引用网络上的资源后进行的修改，如有侵权请联系我，会进行下架删除
// 根据网速自己设置脚本延迟
var interval = 2500;
var sideInterval = 4000;
var bbsInterval = 3000; // 在ADBlock之后运行
var iteyeInterval = 500;

(function () {
    'use strict';
    var currentURL = window.location.href;
    var blog = /article/;
    var bbs = /topics/;
    var iteye = /iteye/;
    var juejin = /juejin/;
    var gitee = /gitee/;
    var woshipm = /woshipm/;
    var segmentfault = /segmentfault/;

    // segmentfault
    if(segmentfault.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("card border-0 d-none d-xl-flex mb-4")[0].remove();
            document.getElementsByClassName("card border-0 overflow-hidden d-none d-xl-flex mb-4")[0].remove();
        }, interval);
    }
// 人人都是产品经理
    else if(woshipm.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("article--heroAd")[0].remove();
            document.getElementsByClassName("widget widget-ad fixed-sidebar-id")[0].remove();
            var leng = document.getElementsByClassName("widget u-backgroundColorWhite").length;
            for(var i=0;i<leng;i++){
                document.getElementsByClassName("widget u-backgroundColorWhite")[0].remove();
            }
        }, interval);
    }
    // 码云web-ide页面 去除页头
    else if(gitee.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("ide-page-header")[0].remove();
        }, interval);
    }// 掘金页面
    else if(juejin.test(currentURL)){
        console.log("enter!");
        setTimeout(function () {
            //非主页
             if (!document.getElementsByClassName("index-aside aside")[0]){
                 if(!document.getElementsByClassName("sidebar-bd-entry")[0]){
                     //已登录
                     document.getElementsByClassName("sidebar-block related-entry-sidebar-block shadow")[0].remove();
                     document.getElementsByClassName("sidebar-block app-download-sidebar-block shadow")[0].remove();
                     document.getElementsByClassName("sidebar-block wechat-sidebar-block pure")[0].remove();
                 }else{
                     document.getElementsByClassName("sidebar-bd-entry")[0].remove();
                     document.getElementsByClassName("sidebar-block app-download-sidebar-block shadow")[0].remove();
                     document.getElementsByClassName("sidebar-block related-entry-sidebar-block shadow")[0].remove();
                 }
             }
            //index-aside aside
            if (document.getElementsByClassName("index-aside aside")[0]){
                 //首页
                 document.getElementsByClassName("index-aside aside")[0].remove();
            }
        }, interval);
    }
    //bbs-CSDN
    else if(bbs.test(currentURL)){
        setTimeout(function () {
            $(".js_show_topic").click();
            document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            $(".mediav_ad").remove(); // 帖子尾部广告
            $(".post_recommend").remove(); // 帖子内[CSDN推荐]
            $(".ad_item").remove(); // 右侧广告
        }, bbsInterval);
        // blog-csdn
    }else if (blog.test(currentURL)){
       localStorage.setItem("anonymousUserLimit", "");

        csdn.copyright.init("", "", ""); //去除剪贴板劫持
        localStorage.setItem("anonymousUserLimit", ""); // 免登陆
        if (document.getElementsByClassName("btn-readmore")[0]){
            document.getElementsByClassName("btn-readmore")[0].click();
        } //自动展开
        if (document.getElementsByClassName("comment-list-box")[0]){
            document.getElementsByClassName("comment-list-box")[0].removeAttribute("style");
        } //自动展开
        $("#content_views").unbind("click");//移除url拦截
        setTimeout(function () {
            if (document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0]) {
                document.getElementsByClassName("csdn-tracking-statistics mb8 box-shadow")[0].remove(); //左上广告
            }
            document.getElementById("asideFooter").remove();
            if (document.getElementById("adContent")) {
                document.getElementById("adContent").remove();
            }
            if (document.getElementsByClassName("p4course_target")[0]) {
                document.getElementsByClassName("p4course_target")[0].remove(); //左上广告
            }
            document.getElementsByClassName("bdsharebuttonbox")[0].remove();
            document.getElementsByClassName("vip-caise")[0].remove();
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove(); //左上广告
            }
        }, interval);
        setTimeout(function () {
            if ($("div[id^='dmp_ad']")[0]) {
                $("div[id^='dmp_ad']")[0].remove();
            }
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            if (document.getElementsByClassName("pulllog-box")[0]) {
                document.getElementsByClassName("pulllog-box")[0].remove(); // 底部广告
            }
            var recommendObj = document.getElementsByClassName("recommend-fixed-box")[0].getElementsByClassName("right-item");
            for (var h = (recommendObj.length - 1); h>=0; h--) {
                if (recommendObj[h].tagName == "DIV") {
                    recommendObj[h].remove();
                }
            }
            if (document.getElementsByClassName("p4course_target")[0]) {
                document.getElementsByClassName("p4course_target")[0].remove();
            }
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
            if (document.getElementsByClassName("fourth_column")[0]) {
                document.getElementsByClassName("fourth_column")[0].remove();
            }
        }, sideInterval);
        setTimeout(function () {
            for(var x=470; x<490; x++){
                var kp_box = document.getElementById("kp_box_"+x); //右侧广告
                if(kp_box) {
                    kp_box.remove();
                }
            }
        }, 5000);
        //iteye
    } else if (iteye.test(currentURL)) {
        setInterval(function(){
            document.getElementById('btn-readmore').click();
        }, iteyeInterval);
        setTimeout(function () {
            document.getElementsByClassName("blog-sidebar")[0].remove();
            document.getElementById('main').style.width = '1000px';
        }, sideInterval);
    }
})();