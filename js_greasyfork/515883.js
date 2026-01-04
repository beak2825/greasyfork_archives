// ==UserScript==
// @name         屏蔽B站首页广告推荐
// @namespace    https://greasyfork.org/zh-CN/users/810690-twinsdestiny
// @version      1.0
// @description  屏蔽B站首页广告推荐（有广告和火箭标志的）
// @author       TwinsDestiny
// @match        *://*.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515883/%E5%B1%8F%E8%94%BDB%E7%AB%99%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/515883/%E5%B1%8F%E8%94%BDB%E7%AB%99%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 隐藏
    await document.arrive('body', { fireOnAttributesModification: false, onceOnly: false, existing: true }, async function () {

        setInterval(function () {
            // 弹出游戏广告
            $(".adcard").each(function () {
                var ad = $(this).find(".palette-button-adcard");
                if (ad.length > 0) {
                   $(this).hide();
                }
            });

            //首页广告
            $(".bili-video-card").each(function () {
                //广告标记
                var authorSpan = $(this).find(".bili-video-card__info--ad");
                if (authorSpan.length > 0) {
                   $(this).hide();
                }
                //火箭推送
                var rocket = $(this).find(".bili-video-card__info--creative-ad");
                if (rocket.length > 0) {
                   $(this).hide();
                }
                //新广告
                var statusSpan = $(this).find(".bili-video-card__stats--text");
                if (statusSpan.length > 0) {
                    var statusName = statusSpan.text().trim();
                    if(statusName == '广告'){
                        $(this).hide();
                    }
                }
                //新火箭
                var svg = $(this).find(".vui_icon");
                if (svg.length > 0) {
                    $(this).hide();
                }
            });

            //视频播放页广告
            $(".slide-gg").each(function () {
                $(this).hide();
            });

            //视频播放页手游小广告
            $(".video-card-ad-small").each(function () {
                $(this).hide();
            });

            //视频播放页手游
            $(".video-page-game-card-small").each(function () {
                var game = $(this).find(".card-box");
                if (game.length > 0) {
                    game[0].remove();
                }
            });

            //视频播放页底部广告
            $(".ad-floor-cover").each(function () {
                $(this).parent().hide();
            });

            //视频播放页视频下方长条
            $(".strip-ad").each(function () {
                $(this).hide();
            });

            //分区页面长条广告
            $(".eva-banner").each(function () {
                $(this).hide();
            });

            //直播
            //小橙车提示
            $(".shop-popover").each(function () {
                $(this).hide();
            });

            //动态页
            $(".bili-dyn-ads").each(function () {
                $(this).hide();
            });

        }, 500);

    });

})();