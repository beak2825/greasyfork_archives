// ==UserScript==
// @name         b站(bilibili)播放页面纯净版
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  屏蔽b站播放页面中顶部菜单、右侧推荐、up主信息、弹幕信息、播放器周围信息等，还原一个纯净的播放页面，专注学习~
// @author       simplelife
// @match        *://www.bilibili.com/video/*

// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/439714/b%E7%AB%99%28bilibili%29%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/439714/b%E7%AB%99%28bilibili%29%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //已登陆
    $('.recommend-list-v1').hide();

    //未登陆
    $('.next-play').hide();
    $('.rec-list').hide();

    //up主信息屏蔽
    $('.u-face').hide();
    $('.up-info_right').hide();
    //弹幕信息屏蔽
    $('.danmaku-box').hide();

    //顶部信息屏蔽
    $('.fixed-header').hide();


    //已登陆
    setTimeout(function(){
        $('.lazy-img').hide();
    }, 1000);
    setTimeout(function(){
        $('.lazy-img').hide();
        $('.pl__info').hide();
        $('.pl__head').hide();
        $('.ad-report').hide();
        $('.ad-floor-exp').hide();
        //未登陆
        $('.next-play').hide();
        $('.rec-footer').hide();
        $('.live_recommand_report').hide();
         //右侧分隔线等其它内容屏蔽
        $('.split-line').hide();
        $('.pl__card').hide();
    }, 3000);
    setTimeout(function(){
        $('.lazy-img').hide();
        $('.pl__info').hide();
        $('.pl__head').hide();
        $('.ad-report').hide();
        $('.ad-floor-exp').hide();
        //未登陆
        $('.next-play').hide();
        $('.rec-footer').hide();
        $('.live_recommand_report').hide();
        //右侧分隔线等其它内容屏蔽
        $('.split-line').hide();
        $('.pl__card').hide();

        //顶部信息屏蔽
        $('.fixed-header').hide();
        //活动信息屏蔽
        $('.inside-wrp').hide();
        //评论区未登录提示屏蔽
        $('.comment-send.no-login').hide();

        //弹幕登录信息、一键三连等播放器周围信息屏蔽
        $('.bilibili-player-video-inputbar').hide();
        $('.bilibili-player-video-info').hide();
        $('.video-toolbar.report-wrap-module.report-scroll-module').hide();
        $('.tip-info').hide();
        $('.activity').hide();//活动作品提示屏蔽

        $('.tag-area.clearfix').hide()//标签屏蔽 可注释

    }, 5000);
    setTimeout(function(){
        //顶部信息屏蔽
        $('.fixed-header').hide();
        //活动信息屏蔽
        $('.inside-wrp').hide();
        //评论区未登录提示屏蔽
        $('.comment-send.no-login').hide();

        //弹幕登录信息、一键三连等播放器周围信息屏蔽
        $('.bilibili-player-video-inputbar').hide();
        $('.bilibili-player-video-info').hide();
        $('.video-toolbar.report-wrap-module.report-scroll-module').hide();
        $('.tip-info').hide();
        $('.activity').hide();//活动作品提示屏蔽

        $('.tag-area.clearfix').hide()//标签屏蔽 可注释

    }, 8000);

})();