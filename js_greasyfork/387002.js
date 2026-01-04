// ==UserScript==
// @name         千图网免登录、去广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除千图网的强制登录页面、顶部未登录提示、右侧vip窗口、底部广告条
// @author       [空白]
// @include     *://www.58pic.com
// @include     *://www.58pic.com/*
// @grant        none
// @note         19-07-07 1.1 去除更多的广告，修复部分不能去除广告问题。
// @note         19-06-29 1.0 正式版发布
// @note         19-06-29 0.1 初版发布
// @downloadURL https://update.greasyfork.org/scripts/387002/%E5%8D%83%E5%9B%BE%E7%BD%91%E5%85%8D%E7%99%BB%E5%BD%95%E3%80%81%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/387002/%E5%8D%83%E5%9B%BE%E7%BD%91%E5%85%8D%E7%99%BB%E5%BD%95%E3%80%81%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //定位到登录窗口
    var login1 = document.getElementById("social_account-login").parentNode;
    var login2 = login1.parentNode;
    var login3 = login2.parentNode;
    var login = login3.parentNode;
    //定位到未登录提示窗口
    var login_top = document.getElementsByClassName("tcmk0");
    //定位到右侧vip窗口
    var vip = document.getElementsByClassName("tally");
    var a = document.getElementsByClassName("tallyActivity active");
    //定位到底部广告条
    var result = document.getElementsByClassName("result-wrapper w1500");
    var ad = document.getElementsByClassName("qt-ad-box");
    var participle_footer = document.getElementsByClassName("search-participle-footer");
    //定位到右侧广告
    var activityLink = document.getElementsByClassName("activityLink fr clearfix qt-ad-box");
    var activityLink_f = document.getElementsByClassName("main-right fr");
    //定位到作品页面顶部精选推荐
    var main_left = document.getElementById("main-left");
    var mainLeft_title = document.getElementsByClassName("mainLeft-title");
    //如果出现登录页面，调用删除子节点函数
    if(login) {
        //将定位到登录窗口的值传入函数
        remove(login);
        //removead()
    }
    //如果出现未登录提示窗口，调用删除子节点函数
    if(login_top[0]) {
        //将定位到未登录提示窗口的值传入函数
       remove(login_top[0]);
    }
    //删除作品页面顶部精选推荐
    //if(mainLeft_title[0]) {
      //  main_left[0].removeChild(mainLeft_title[0]);
    //}
    //删除作品页面右侧广告
    if(activityLink[0]) {
        activityLink_f[0].removeChild(activityLink[0]);
    }
    //如果出现底部广告，删除子节点函数
    if(ad[0]) {
        result[0].removeChild(ad[0]);
    }
    //如果出现底部建议栏，删除子节点函数
    if(participle_footer[0]) {
        result[0].removeChild(participle_footer[0]);
    }
    //删除右侧vip窗口
    if(a[0]) {
        vip[0].removeChild(a[0]);
    }
    //删除作品页面顶部精选推荐
    if(mainLeft_title[0]) {
        main_left.removeChild(mainLeft_title[0]);
    }
    //删除body子节点函数实现
    function remove(del) {
        document.body.removeChild(del);
    }
})();