// ==UserScript==
// @name         屏蔽b站(bilibili)播放页面中右侧相关视频推荐与直播广告
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  屏蔽b站播放页面中右侧推荐 (去掉代码中的第24行与30行注释符可进一步屏蔽up主与弹幕信息）
// @author       simplelife
// @match        *://www.bilibili.com/video/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/439625/%E5%B1%8F%E8%94%BDb%E7%AB%99%28bilibili%29%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%8F%B3%E4%BE%A7%E7%9B%B8%E5%85%B3%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E4%B8%8E%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/439625/%E5%B1%8F%E8%94%BDb%E7%AB%99%28bilibili%29%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%8F%B3%E4%BE%A7%E7%9B%B8%E5%85%B3%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E4%B8%8E%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //已登陆
    $('.recommend-list-v1').hide();

    //未登陆
    $('.next-play').hide();
    $('.rec-list').hide();

    /*——————去掉该行注释符即可屏蔽up主与弹幕信息——————
    //up主信息屏蔽
    $('.u-face').hide();
    $('.up-info_right').hide();
    //弹幕信息屏蔽
    $('.danmaku-box').hide();
    */ //——————去掉该行注释符即可屏蔽up主与弹幕信息——————

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
    }, 5000);

})();