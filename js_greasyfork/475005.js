// ==UserScript==
// @name         BiliBili纯享版-Evelynal
// @namespace    http://www.evelynal.top/Navigation/
// @version      0.1.2
// @description  删除多余功能按钮(包括但不限于大会员、会员购、游戏中心等)-删除banner等元素
// @author       Evelynal
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      AGPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/475005/BiliBili%E7%BA%AF%E4%BA%AB%E7%89%88-Evelynal.user.js
// @updateURL https://update.greasyfork.org/scripts/475005/BiliBili%E7%BA%AF%E4%BA%AB%E7%89%88-Evelynal.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    //删除大banner
    $(".recommended-swipe").remove();


    //修改视频格子的margin-top
    const feedCards = $('.feed-card');
    feedCards.css('margin-top', '40px');

    //继续修改
    const videoCards = $('.bili-video-card');
    videoCards.css('margin-top', '40px !important');

    // 选择包含 "番剧" 文本的元素
    const animeItem1 = $(":contains('番剧')");
    //const animeItem2 = $(":contains('直播')");
    const animeItem3 = $(":contains('游戏中心')");
    const animeItem4 = $(":contains('会员购')");
    const animeItem5 = $(":contains('漫画')");
    const animeItem6 = $(":contains('赛事')");
    const animeItem7 = $(":contains('下载客户端')");
    const animeItem8 = $(":contains('大会员')");
    const animeItem9 = $(":contains('哔哩哔哩会员购')");


    // 获取父元素 li 并删除
    animeItem1.parent('li').remove();
    //animeItem2.parent('li').remove();
    animeItem3.parent('li').remove();
    animeItem4.parent('li').remove();
    animeItem5.parent('li').remove();
    animeItem6.parent('li').remove();
    animeItem7.parent('li').remove();
    animeItem8.parent('li').remove();
    animeItem9.closest('.bili-dyn-list__item').remove();


    //设置搜索框长度
    const centerSearch = $('.center-search__bar');
    centerSearch.css('max-width', '800px');

    // 等待文档加载完成
    $(document).ready(function () {

        // Your code here...
        //删除大banner
        $(".recommended-swipe").remove();
        //修改视频格子的margin-top
        const feedCards = $('.feed-card');
        feedCards.css('margin-top', '20px');
        //继续修改
        const videoCards = $('.bili-video-card');
        videoCards.css('margin-top', '20px');

        $(".vip-wrap").remove();

        // 选择包含 "番剧" 文本的元素
        const animeItem1 = $(":contains('番剧')");
        //const animeItem2 = $(":contains('直播')");
        const animeItem3 = $(":contains('游戏中心')");
        const animeItem4 = $(":contains('会员购')");
        const animeItem5 = $(":contains('漫画')");
        const animeItem6 = $(":contains('赛事')");
        const animeItem7 = $(":contains('下载客户端')");
        const animeItem8 = $(":contains('大会员')");
        const animeItem9 = $(":contains('哔哩哔哩会员购')");

        // 获取父元素 li 并删除
        animeItem1.parent('li').remove();
        //animeItem2.parent('li').remove();
        animeItem3.parent('li').remove();
        animeItem4.parent('li').remove();
        animeItem5.parent('li').remove();
        animeItem6.parent('li').remove();
        animeItem7.parent('li').remove();
        animeItem8.parent('li').remove();
        animeItem9.closest('.bili-dyn-list__item').remove();

        $(".right").remove();

    });

    //监听网页变化
    $(document).on('DOMNodeInserted', function(e) {
        const animeItem9 = $(":contains('哔哩哔哩会员购')");
        const animeItem10 = $(":contains('哔哩哔哩直播')");
        animeItem9.closest('.bili-dyn-list__item').remove();
        animeItem10.closest('.bili-dyn-list__item').remove();
    });



})();
