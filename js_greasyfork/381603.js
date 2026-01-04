// ==UserScript==
// @name         菜鸟教程-阅读模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  菜鸟教程，将页面次要内容移除，这样ctrl-p打印成pdf的时候就不会有多余的内容了
// @author       yankj12
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @match        *://www.runoob.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381603/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/381603/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

// 将右侧教程列表隐藏，这样ctrl-p打印成pdf的时候就不会有多余的内容了
(function() {
    'use strict';

    // 移除右侧教程列表
    //sidebar-box cate-list
    $("div.right-column").remove();
    console.log('移除右侧教程列表');

    // left-column
    //$("div.left-column").remove();
    //console.log('移除左侧教程导航栏');

    // 移除右侧回到顶部等功能按钮
    // div.fixed-btn
    $("div.fixed-btn").remove();
    console.log('移除右侧回到顶部等功能按钮');

    // 顶部导航栏
    // class="container navigation"
    $("div.navigation").remove();
    console.log('移除顶部导航栏');

    // 顶部logo及搜索框
    // class="container logo-search"
    $("div.logo-search").remove();
    console.log('移除顶部logo及搜索框');

    // 底部分享
    // id="respond" class='no_webshot'
    $("#respond").remove();
    console.log('移除底部分享');

    // 底部广告
    // article-heading-ad
    $("div.article-heading-ad").remove();
    console.log('移除底部广告');

    // 移除反馈按钮（两个反馈按钮）
    // feedback-btn
    $(".feedback-btn").remove();

    // 底部备案号等信息
    // id="footer"
    $("#footer").remove();
    console.log('移除底部备案号等信息');

    // 移除底部广告
    //google_ads_frame1
    $("div.ad-box").remove();
    $("iframe[name^=google]").remove();
    // 改变样式
    // class="col middle-column big-middle-column"
    var middleColumn = document.querySelector('div.big-middle-column');
    if(middleColumn !== null){
        middleColumn.className='col big-middle-column';
    }

    console.log('更改中间列为更宽的样式，以便于阅读');
})();