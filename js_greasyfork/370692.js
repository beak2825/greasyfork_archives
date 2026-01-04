// ==UserScript==
// @name         【极致去广告|自动全文|自动加载】去掉csdn广告，去掉iteye广告
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  去掉csdn所有广告，去掉iteye所有广告，给你官方纯净体验，自动打开阅读更多，推荐文章自动加载更多
// @author       dengJ
// @icon         http://pic.58pic.com/58pic/16/48/85/27P58PIC4Qh_1024.jpg
// @match        *://*.csdn.net/*
// @match        *://*.iteye.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370692/%E3%80%90%E6%9E%81%E8%87%B4%E5%8E%BB%E5%B9%BF%E5%91%8A%7C%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%7C%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E3%80%91%E5%8E%BB%E6%8E%89csdn%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%8E%BB%E6%8E%89iteye%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/370692/%E3%80%90%E6%9E%81%E8%87%B4%E5%8E%BB%E5%B9%BF%E5%91%8A%7C%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%7C%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E3%80%91%E5%8E%BB%E6%8E%89csdn%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%8E%BB%E6%8E%89iteye%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href;

    // 匹配iteye部分
    var iteye = /iteye/i;
    if (iteye.test(url)) {
        var icoAd = document.getElementById("gg");//去掉首页图标旁广告
        if (icoAd) {
            icoAd.style.cssText="display:none;"
            var mediavAd = document.getElementsByClassName("mediav_ad")[0];//去掉问答文章内容后的广告
            mediavAd.style.cssText="display:none;"
        }
        var leftAd = document.getElementById("nav_show_top_stop");//去掉左侧广告
        leftAd.style.cssText="display:none;"
        var rightAd = document.getElementById("layerd");//去掉右下角广告
        rightAd.style.cssText="display:none;"
        var topAd = document.getElementById("branding");//去掉顶部广告
        topAd.style.cssText="display:none;"
        var contNext = document.getElementById("blog_content").nextElementSibling;//去掉博客文章内容后的广告
        contNext.style.cssText="display:none;"
    }

    //匹配登陆部分
    var loginCsdn = /passport.csdn.net/i;
    if (loginCsdn.test(url)) {
        $(".login-banner").remove();//去掉登陆界面广告
        $(".login-user").css("width","100%");//还原干净的登陆窗口
    }

    // 匹配首页/博客部分
    var indexCsdn = /csdn.net/i;
    if (indexCsdn.test(url)) {
        $("#kp_box_416").remove();//去掉右侧浮动广告
        // 去掉首页/博客列表自动加载的广告
        $(".feedlist_mod").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".J_adv").length; i++) {
                // 去掉列表中间广告
                if ($(".J_adv").attr("class") == "J_adv") {
                    $(".J_adv").hide();
                }
            }
        });
    }

    // 匹配博客部分
    var blogCsdn = /blog.csdn.net/i;
    if (blogCsdn.test(url)) {
        $(".pulllog-box").remove();//去掉下面弹出的登陆注册广告
        $("#asideProfile").next().remove();//去掉个人资料与最新文章之间的广告
        $("#asideFooter").children("div:first-child").remove();//去掉最新评论与联系我们之间的广告
        if($("div").hasClass("p4course_target")){//去掉正文下方广告
            var conAd = document.getElementsByClassName("p4course_target")[0];//去掉文章内容后的广告
            conAd.style.cssText="display:none;"
        }
        $(".mediav_ad").remove();//去掉正文下方广告
        $("#dmp_ad_58").remove();//去掉正文下方广告

        if($("div").hasClass("p4courset3_target")){//去掉正文下方广告
            var conAd2 = document.getElementsByClassName("p4courset3_target")[0];//去掉文章内容后的广告
            conAd2.style.cssText="display:none;"
        }
        //$(".meau-list li:last-child").prev("li").remove();//去掉右侧浮动转盘广告
        if($("li").hasClass("_360_interactive")){
            $("#_360_interactive").remove();
        }
        if($("#btnMoreComment").length>0){//自动展开评论
            $("#btnMoreComment").click();
        }
        // 去掉文章下方列表自动加载的广告
        $(".recommend-box").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".recommend-ad-box").length; i++) {
                // 去掉列表中间广告
                $(".recommend-ad-box").hide();
            }
        });

    }
    // 匹配下载部分
    var downCsdn = /download.csdn.net/i;
    if (downCsdn.test(url)) {
        $(".quake-slider").remove();//去掉右侧广告
        $(".gitchat_news").next().remove();//去掉右侧广告

        //动态加载列表数据
        var totalHeight = 0; //定义一个总高度变量
        $(window).scroll(function(){
            totalHeight =  parseFloat( $(window).height() ) +  parseFloat( $(window).scrollTop() ); //浏览器的高度加上滚动条的高度
            if ( $(document).height() <= totalHeight+100 ) { //当文档的高度小于或者等于总的高度时，开始动态加载数据
                $("#get_more_code").click();//自动加载更多
            }
        })
    }
    // 匹配bbs部分
    var bbsCsdn = /bbs.csdn.net/i;
    if (bbsCsdn.test(url)) {
        $(".ad_top").remove();//去掉顶部广告
        $(".ad_1").remove();//去掉中部及右侧广告
        $(".owner_top").next().remove();//去掉文章顶部广告
        $("#bd_ad_2").parent().remove();//去掉文章中部广告
        $(".post_body").children().remove();//去掉评论区广告
        // 去掉列表自动加载的广告
        $(".post_feed_wrap").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".bbs_feed_ad_box").length; i++) {
                // 去掉列表中间广告
                if ($(".bbs_feed_ad_box").attr("class") == "bbs_feed bbs_feed_ad_box") {
                    $(".bbs_feed_ad_box").remove();
                }
            }
        });
    }

    // 匹配搜索部分
    var soCsdn = /so.csdn.net/i;
    if (soCsdn.test(url)) {
        $(".rightadv").remove();
        // 去掉列表自动加载的广告
        $(".search-list-con").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".search-list-con").length; i++) {
                // 去掉列表中间广告
                $(".yd_a_d_so").hide();
            }
        });
    }

    // 匹配搜索部分
    var askCsdn = /ask.csdn.net/i;
    if (askCsdn.test(url)) {
        $(".main").bind("DOMNodeInserted", function (e) {
            for (var i = 0; i < $(".main").length; i++) {
                // 去掉列表中间广告
                $(".J_adv").parent().hide();
            }
        });
    }

    $("#btn-readmore").click();//自动打开阅读更多
    //自动打开展开
    var btn = $("aside").find(".flexible-btn");
    for (var i = 0; i < btn.length; i++) {
        btn[i].click();
    }

    $(".banner-ad-box").remove();//去掉顶部广告
    $(".slide-outer").remove();//去掉右侧广告
    $(".box-box-large").remove();//去掉右下角广告
    $(".box-box-aways").remove();//去掉左下角广告
    $("#adContent").remove();//去掉右侧浮动广告


})();