// ==UserScript==
// @name         千图纯享版-Evelynal
// @namespace    http://www.evelynal.top/Navigation/
// @version      0.2.1
// @description  删除多余功能按钮,送你一个干净的千图
// @author       Evelynal
// @match        https://www.58pic.com/
// @match       https://www.58pic.com/tupian/*
// @icon            https://icon.qiantucdn.com/images/user/user-default.png
// @grant         none
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      AGPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/475009/%E5%8D%83%E5%9B%BE%E7%BA%AF%E4%BA%AB%E7%89%88-Evelynal.user.js
// @updateURL https://update.greasyfork.org/scripts/475009/%E5%8D%83%E5%9B%BE%E7%BA%AF%E4%BA%AB%E7%89%88-Evelynal.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    //删除顶栏
 //   $(".head-box").remove();
    $(".banner-container").remove();
    //    $(".banner-pagination").remove();
    //    $(".banner-tip").remove();
    $(".floor-item").remove();
    $(".new-copyright-container").remove();
    $(".designer-entry-container").remove();
    $(".seo-link-container").remove();
    $(".hot-keyword-container").remove();
    //$(".qtd-search-containerB").remove();
    $(".search-polymerization-list-wrap").remove();
    $(".overlay").remove();
    $(".login-tip-header").remove();
    $(".is-personal").remove();
    $(".is-qiye").remove();
    $(".icon-moren-weizhankai").remove();
    $(".login-model").remove();
    $(".tally").remove();

    //修改视频格子的margin-top
    const feedCards = $('.search-category-container');
    feedCards.css('margin-top', '0');
    feedCards.css('margin-bottom', '600px');

    // 创建img
    var img = $('<img>');
    img.attr('src', 'https://icon.qiantucdn.com/static/images/logo/p-logo-web1.png');

    // 设置img的css
    img.css({
        width: '100px',
        height: 'auto',
        'margin-top': '20vh',
        'margin-left':'45%'
    });

    // 选择id为qt-app的div
    var $div = $('.qt-app-box');

    // 在div之前插入img
    $div.before(img);

})();
