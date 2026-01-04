// ==UserScript==
// @name            新闻类网站去除广告
// @name:en         News website ad removal
// @namespace       https://banmiya.com/userscirpt/applenewsadremove
// @version         1.2.3
// @description     新闻类网站去除广告, V2EX, 9to5mac, MacRumors, finviz, coinglass, coingecko, 简书, speedtest, seekingalpha, apnews, cnn
// @description:en  News website to remove ads, V2EX, 9to5mac, MacRumors, finviz, coinglass, coingecko, jianshu, speedtest, seekingalpha, apnews, cnn
// @author          zmlu
// @match           https://9to5mac.com/*
// @match           https://www.macrumors.com/*
// @match           https://v2ex.com/*
// @match           https://finviz.com/*
// @match           https://www.coinglass.com/*
// @match           https://www.coingecko.com/*
// @match           https://www.jianshu.com/*
// @match           https://www.speedtest.net/*
// @match           https://seekingalpha.com/*
// @match           https://apnews.com/*
// @match           https://edition.cnn.com/*
// @icon            none
// @grant           none
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459036/%E6%96%B0%E9%97%BB%E7%B1%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459036/%E6%96%B0%E9%97%BB%E7%B1%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href
    var targetNode
    // 9to5mac
    if(url.includes("9to5mac.com")){
        targetNode = document.getElementById('content');
        window.removeAdByZmlu = function() {
            $(".ad-container").hide();
            $(".adsense").hide();
            $(".adsbygoogle").hide();
            $(".google-news-link").hide();
            $(".ad-disclaimer-container").hide();
            $(".google-auto-placed").hide();
            $("div[data-spotim-module='pitc']").hide();
        };
    }
    // macrumors
    if(url.includes("macrumors.com")){
        targetNode = document.getElementById('root');
        window.removeAdByZmlu = function() {
            $("div[id^='AdThrive_Header']").each(function( index ) {
                $(this).parent().hide();
            });
            $("div[class^='sidebarblock']").hide();
            $("div[id^='AdThrive_Sidebar']").hide();
            $("div[class^='subscribe-']").hide();
            $("div[id^='AdThrive_Content']").hide();
            $("div[id^='AdThrive_Below_Post']").hide();
            $("div[id^='AdThrive_Footer']").hide();
            $(".adthrive-footer-message").hide();
        };
    }
    // v2ex
    if(url.includes("v2ex.com")){
        targetNode = document.getElementById('Wrapper');
        window.removeAdByZmlu = function() {
            $(".adsbygoogle").hide();
            $("div[class^='wwads-']").hide();
        };
    }
    // finviz
    if(url.includes("finviz.com")){
        targetNode = document.getElementsByClassName('m-0');
        window.removeAdByZmlu = function() {
            $("#banner_position").hide();
            $("#rectangle_position").hide()
            $("div[data-google-query-id]").hide();
            document.querySelectorAll("[id^='IC_D_']").forEach(div => {
                let preId = $(div).prev().attr('id');
                if(div.parentNode.localName!='body' && preId!='map' && preId != 'screener-views-table'){
                    $(div.parentNode).hide();
                }else{
                    $(div).hide();
                }
            });
        };
    }
    // coinglass
    if(url.includes("coinglass.com")){
        targetNode = document.getElementById('__next');
        window.removeAdByZmlu = function() {
            $(".pb20").hide();
            $(".FloatAd").hide();
        };
    }
    // coingecko
    if(url.includes("coingecko.com")){
        targetNode = document.getElementsByClassName('container');
        window.removeAdByZmlu = function() {
            $(".ad-spacer").hide();
        };
    }
    // jianshu
    if(url.includes("jianshu.com/p")){
        targetNode = document.body;
        window.removeAdByZmlu = function() {
            $("body > div:not(#__next)").css("opacity",0);
        };
    }
    // speedtest
    if(url.includes("speedtest.net")){
        targetNode = document.body;
        window.removeAdByZmlu = function() {
            $("div[data-google-query-id]").hide();
            $("div[data-ad-placeholder]").hide();
        };
    }
    // seekingalpha
    if(url.includes("seekingalpha.com")){
        targetNode = document.body;
        delCookie('session_id');
        delCookie('machine_cookie');
        delCookie('LAST_VISITED_PAGE');
        delCookie('sailthru_pageviews');
        delCookie('sailthru_content');
        delCookie('sailthru_visitor');
        delCookie('_sasource');

        window.removeAdByZmlu = function() {
            $("div[data-test-id='after-layout-content-slot']").hide();
        };
    }
    // apnews
    if(url.includes("apnews.com")){
        targetNode = document.body;
        window.removeAdByZmlu = function() {
            $(".Page-header-leaderboardAd").remove();
            $(".SovrnAd").remove();
            $(".Advertisement").remove();
            $(".TaboolaRecommendationModule").remove();
        };
    }
    // edition.cnn.com
    if(url.includes("edition.cnn.com")){
        targetNode = document.body;
        window.removeAdByZmlu = function() {
            $(".ad-slot-rail").remove();
            $("div[class^='ad-slot-header']").remove();
            $("div[id^='ad_']").remove();
        };
    }
    window.removeAdByZmlu();

    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList) {
        window.removeAdByZmlu();
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    function SetCookie(name,value){
        var Days = 30; //此 cookie 将被保存 30 天
        var exp  = new Date();//new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    //取cookies函数
    function getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); return null;
    }

    //删除cookie
    function delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
})();