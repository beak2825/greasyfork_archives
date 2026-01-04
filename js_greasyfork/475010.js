// ==UserScript==
// @name         包图纯享版-Evelynal
// @namespace    http://www.evelynal.top/Navigation/
// @version      0.1
// @description  删除多余功能按钮,送你一个干净的千图
// @author       Evelynal
// @match        https://ibaotu.com/*
// @match        https://ibaotu.com/tupian/*
// @icon            https://s.ibaotu.com/next/img/new/pwa-1.f50a.png
// @grant         none
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      AGPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/475010/%E5%8C%85%E5%9B%BE%E7%BA%AF%E4%BA%AB%E7%89%88-Evelynal.user.js
// @updateURL https://update.greasyfork.org/scripts/475010/%E5%8C%85%E5%9B%BE%E7%BA%AF%E4%BA%AB%E7%89%88-Evelynal.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    //删除顶栏
    $(".ihead").remove();
    $(".pwa-wrap").remove();
    $(".ep").remove();
 //   $(".container").remove();
    $(".swiper-wrapper").remove();
    $(".swiper-prev").remove();
    $(".swiper-next").remove();
    $(".ibanner-text").remove();
    $(".main").remove();
    $(".sets").remove();
    $(".p-bottom-vip").remove();
    $(".b-header-btn").remove();
    $(".head-vip").remove();

    //修改视频格子的margin-top
    const feedCards = $('.swiper-container');
    feedCards.css('margin-bottom', '600px');

    // 创建img
    var img = $('<img>');
    img.attr('src', 'https://s.ibaotu.com/next/img/new/btlogo2.9f48.png');

    // 设置img的css
    img.css({
        width: '200px',
        height: 'auto',
        'margin-top': '30vh',
        'margin-left':'45%',
        'margin-bottom':'-250px'
    });

    // 选择id为qt-app的div
    var $div = $('.ibanner');

    // 在div之前插入img
    $div.before(img);

})();