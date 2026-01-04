// ==UserScript==
// @name         直播吧过滤电竞
// @namespace    https://www.zhibo8.cc/
// @version      2.1
// @description  过滤电竞条目，高亮关注球队，过滤无用干扰信息
// @author       robaggio
// @match        https://www.zhibo8.cc
// @match        https://www.zhibo8.cc/*
// @match        https://www.zhibo8.com
// @match        https://www.zhibo8.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440265/%E7%9B%B4%E6%92%AD%E5%90%A7%E8%BF%87%E6%BB%A4%E7%94%B5%E7%AB%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/440265/%E7%9B%B4%E6%92%AD%E5%90%A7%E8%BF%87%E6%BB%A4%E7%94%B5%E7%AB%9E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 定义过滤关键词
    const fitlerKeywords = ["电竞","NBL","斯诺克","WNBA","排球","田径","村BA","中甲","羽毛球","冰球","U21联赛","U17联赛","乒乓球","NHL","围棋","英女足","中超","足协杯","中乙","中甲","举重","CBA","沙特联","公路自行车","美职联"];
    // 过滤掉电竞项目
    for (let keyword of fitlerKeywords) {
        $( "li[label*='" + keyword + "']" ).remove();
    }
    $( "div.game-news" ).remove()

    // 定义主队
    const teams = ["拜仁慕尼黑","AC米兰","火箭","F1","开拓者"];
    // 背景高亮+大字
    for (let team of teams) {
        $( "li[label*='" + team + "']" ).css({backgroundColor: "#74b5f7",fontSize:"160%"})
    }

    // 去掉没用的干扰信息
    $( "a:contains('NBA范特西')" ).remove();
    $( "li>a:contains('文字')").remove();
    $( "li>a:contains('动画')").remove();
    $( "a[href='//www.zhibo8.com/shouji.htm']").remove();
    $( "a[href*='http://www.188bifen.com/']" ).remove();
    // $( "a[href^='https://www.zhibo8.cc/other/']" ).css({color:'#bbb'})
    // 去掉广告
    $('.advert').remove();
    $('iframe').remove();
    setTimeout(function() {
        $('.advert').remove();
        $('iframe').remove();
    }, 1000);
})();