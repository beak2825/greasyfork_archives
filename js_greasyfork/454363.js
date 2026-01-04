// ==UserScript==
// @name         HLTV 阅读优化-改
// @namespace    https://greasyfork.org/zh-CN/scripts/454363
// @version      1.0.5
// @description  HLTV 阅读优化，关闭广告
// @author       Yong_Hu_Ming
// @license      Apache License 2.0
// @match        *://*.hltv.org/*
// @grant        none
// @icon         https://www.hltv.org/img/static/favicon/favicon-16x16.png
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454363/HLTV%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/454363/HLTV%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96-%E6%94%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var $ = window.jQuery;

    // hltv
    $('.middle-container').remove();
    $('.yabo-firstcol-box').remove();
    $('.kgN8P9bvyb2EqDJR').remove();
    $('.csgofastbetting').remove();
    $('.ranking-by-img').remove();
    $('.dongying').remove();
    $('.thunderfire').remove();

    $('#betting').remove();

    $("div[class^='regional-']").remove();
    $("div[class^='world-']").remove();
    $("div[class^='matchpage-']").remove();
    //$("div[class^='player-']").remove();
    $("aside[class^='column-']").remove();

    $('.bgPadding').css('max-width', '100%');
    //$('.widthControl').css('max-width', '80%');
    $('.matchInfo').css('flex', '0 0 75px');

    //$("div.upcomingMatch").css('height', '64');
    //$("div.liveMatch").css('height', '72');
    $("div.upcomingMatch,.liveMatch").css('height', 'auto');
    $("a.match").css('padding', '5px 0');


    $('div.star > div.middleExtra,.star2 > div.middleExtra,.star3 > div.middleExtra,.star4 > div.middleExtra,.star5 > div.middleExtra').css('padding-top', 14);

    $('div.expand-match-btn').css(
        {
            'background-color': 'rgba(38,52,67,.6)',
            'color': '#fff',
            'padding': '5px 0',
        }
    );

    $('aside.newSidebar > div.v-wrapper').remove();

    $('div.tabs-left').css({'justify-content': 'space-evenly', 'align-items': 'center', 'height': '72px'});
    $('div.stats-sub-navigation-title > span.tab-title').css('width', '100px');
    $('div.stats-sub-navigation-title > form').css('margin-top', '10px');
    $('div.stats-sub-navigation-title > div.stats-sub-navigation-simple-filter-map').css('margin-top', '22px');
})();
