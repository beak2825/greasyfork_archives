// ==UserScript==
// @name         百度文库净化(手机版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  净化百度文库页面
// @author       WJ
// @match        *://wk.baidu.com/view/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368596/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%87%80%E5%8C%96%28%E6%89%8B%E6%9C%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368596/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%87%80%E5%8C%96%28%E6%89%8B%E6%9C%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload=function (){
        // 加载全部页面
        $(".foldpagewg-text").click();
        $(".pagerwg-button").click();
        //去除广告
        $(".sf-edu-wenku-id-ad1to2").remove();
        //去除app相关
        $(".bottom-bar-global").remove();
        $(".guidetowkappwg-root").remove();
        $(".btn-view-in-app").remove();
        //去除文档获取
        $(".gain-doc-block-root.wk-container").remove();
        //去除推荐
        $(".rec-text-root").remove();
        //去除百度搜索
        $(".b-tuijian-root").remove();
        //去除推荐阅读
        $(".rec-novel-root").remove();
        //去除ppt中相关推荐
        $(".ui-ppt__recommend.c-container").remove();
    };
})();