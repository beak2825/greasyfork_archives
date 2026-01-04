// ==UserScript==
// @name         CSDN去广告
// @namespace    http://tampermonkey.net/
// @version      12.06.1705
// @description  CSDN去广告（博客、论坛、搜索、首页）
// @author       lidonghui
// @match        *://blog.csdn.net
// @match        *://blog.csdn.net/*
// @match        *://bbs.csdn.net/*
// @match        *://so.csdn.net/*
// @match        *://www.csdn.net
// @match        *://www.csdn.net/*
// @match        *://download.csdn.net
// @match        *://download.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/42466/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/42466/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取当前地址url
    var url = location.href;
    // 正则匹配博客部分
    var blogcsdn = /blog.csdn.net/i;
    if (blogcsdn.test(url)) {
        // 页面主体部分轮播广告
        $(".right_extension")[0].remove();
        $(".right_extension")[0].remove();
        $(".box-box-large").hide();
        $(".fourth_column").hide();
        $("#dmp_ad_58").hide();
        $("#asideProfile").next().hide();
        $($("#asideFooter").find("div").first()).hide();
        // 隐藏下面登录注册
        $(".pulllog-box").hide();
        // 首页头部广告
        $(".banner-ad-box").hide();
        //砸金蛋
        $("#_360_interactive").parent().hide()
        $("#commentBox").prev().prev("div").hide();
        // 去除列表自动加载的广告
        $(".recommend-box").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".recommend-ad-box").length; i++) {
                // 去除文章列表中间广告
                $(".recommend-ad-box").hide();
            }
        });
        $($("aside div").first()).hide();
        // 去掉显示更多
        $(".hide-article-box").hide();
        // 显示隐藏的内容
        $("#article_content").css("height","");
        $("#article_content").css("overflow","");
    }
    // 正则匹配搜索页面
    var socsdn = /so.csdn.net/i;
    if (socsdn.test(url)) {
        $(".rightadv").hide();
    }
    // 正则匹配首页广告
    var wwwcsdn = /www.csdn.net/i;
    if (wwwcsdn.test(url)) {
        console.log("有广告");
        // 首页头部广告
        $(".banner-ad-box").hide();
        if ($(".right_top").attr("class") == "slide-outer right_top") {
            $(".right_top").hide();
        }
        if ($(".right_extension").attr("class") == "right_extension slide-outer") {
            $(".right_extension").hide();
        }
    }
    // 正则匹配下载页面
    var downloadcsdn = /download.csdn.net/i;
    if (downloadcsdn.test(url)) {
        $(".mod_personal").next().hide();
        $(".top_ad_box").hide();
        $(".ad").hide();
        $("#kp_box_218").hide();
        $(".J_adv").parent('#kp_box_218').hide();
        $(".right_plate_con").next().hide();
        $($(".download_r").find(".dl_mar_b").first()).hide();
        $($(".download_r").find(".dl_mar_b").last()).hide();
        // 去除列表自动加载的广告
        $(".album_detail_wrap").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".yd_a_d_dl").length; i++) {
                // 去除文章列表中间广告
                if ($(".yd_a_d_dl").attr("class") == "album_detail_list yd_a_d_dl") {
                    $(".yd_a_d_dl").hide();
                }
            }
        });
    }
    // 正则匹配论坛
    var bbscsdn = /bbs.csdn.net/i;
    if (bbscsdn.test(url)) {
        $(".ad_top").hide();
        $(".ad_1").hide();
        $("#kp_box_87").parent().parent().hide()
        for (var i = 0; i < $(".bbs_feed_ad_box").length; i++) {
            // 去除文章列表中间广告
            $(".bbs_feed_ad_box").hide();
        }
        $(".post_feed_wrap").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".bbs_feed_ad_box").length; i++) {
                // 去除文章列表中间广告
                $(".bbs_feed_ad_box").hide();
            }
        });
    }
    // 右下角弹窗
    $("#layerd").hide();
})();