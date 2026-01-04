// ==UserScript==
// @name         B站屏蔽UP主
// @namespace    Block_Bilibili_Author
// @version      0.12
// @description  Block some up author as reqauired
// @description: zh-CN  屏蔽不想要的up主
// @description: zh-TW  屏蔽不想要的up主
// @author       Shana
// @include      https://www.bilibili.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/403874/B%E7%AB%99%E5%B1%8F%E8%94%BDUP%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/403874/B%E7%AB%99%E5%B1%8F%E8%94%BDUP%E4%B8%BB.meta.js
// ==/UserScript==

'use strict';
//不知道有什么用

//==========输入需要屏蔽的UP主==========//
var $ = window.jQuery;
//解除$错误提示
var blockAuthor = ["AAA","BBB","CCC"]
//添加屏蔽UP主名字，空格分割,UP主名字加双引号
//需要注意，所有包含关键字的UP主名称都将被屏蔽，有可能造成误杀
var blockOne = 0
//初始化变量

//==========网页准备==========//
setTimeout(function(){
//等待网页加载完成，默认500

    //将左侧联系客服替换为屏蔽状态
    $("a[class|=contact-help]").text('开启屏蔽');
    $("a[class|=contact-help]").css("color", "red");

    setInterval(function(){
    //因为B站动态加载，所以需要每隔1000ms检查一次

//==========循环执行==========//
var i;
    for (i = 0; i < blockAuthor.length; i++){
        blockOne = blockAuthor[i];

        $("a[title|=" + blockOne + "]").parent().parent().parent().replaceWith("Block Sucess");
        //屏蔽分区 - 投稿时间排序/视频热度排序

        $("a:contains('" + blockOne + "')").parent().remove();
        //屏蔽主页分区推荐

        $("span:contains('" + blockOne + "')").parent().parent().parent().parent().parent().replaceWith("Block Sucess");
        //屏蔽主页分区排行榜

    }
    },1000);
    }, 500);