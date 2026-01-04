// ==UserScript==
// @name         斗鱼网页版 - 播放界面纯净模式
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  净化斗鱼主界面，让直播回归纯净模式
// @author       yaochao
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?domain=douyu.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/481939/1293842/jquery-360minjs.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430765/%E6%96%97%E9%B1%BC%E7%BD%91%E9%A1%B5%E7%89%88%20-%20%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/430765/%E6%96%97%E9%B1%BC%E7%BD%91%E9%A1%B5%E7%89%88%20-%20%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$ || $;

    // 屏蔽斗鱼 p2p 上传和下载
    //window.RTCPeerConnection = window.webkitRTCPeerConnection = window.mozRTCPeerConnection = null
    window.RTCDataChannel = window.DataChannel = null

    // 定时3秒后，把多余的元素删除，修改部分组件的样式
    setTimeout(function(){
        $('#js-room-activity,.layout-Player-announce,.TreasureWrap,.PlayerToolbar').remove();
        $('.layout-Player-video').css('bottom', '0');
        $('.layout-Player-rank').css('top', '0');
        $('.layout-Player-barrage').css('top', '217px');
        $('#js-player-toolbar').css('height', '0')
        $('.ChatTabContainer-titleWraper--tabTitle li').eq(0).addClass('is-active');
        $('.ChatTabContainer-titleWraper--tabTitle li').eq(3).removeClass('is-active');
        $('.ChatTabContainer-conWraper div').eq(0).addClass('is-active');
        $('.ChatTabContainer-conWraper div').eq(3).removeClass('is-active');
        // 移除放录像的直播间
        $(".MgetIconContainer").parent().parent().parent().parent().parent().parent().parent().remove();
        // 移除关播的直播间
        $(".DyCareRecordMask-livingMask-message").parent().parent().parent().parent().parent().remove();
        // 移除关注列表中可能感兴趣的推荐卡片
        $(".AthenaBoothPanel-wrapper").parent().parent().remove();
        // 移除我的关注列表中无用的元素
        //$(".layout-Module-head,.ListFooter").remove();
        $(".ListFooter").remove();
        // 移除直播间内弹幕提醒
        $(".Barrage-notice").remove();
        // 选择清晰度最高的画质
        // $("li[class^=selected-]").parent().children()[0].click()
    },3000);

})();
