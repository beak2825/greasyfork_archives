// ==UserScript==
// @name            air-douyu-lite
// @author          air
// @description     douyu lite
// @version         0.0.2
// @match           http*://www.douyu.com/*
// @icon            https://www.douyu.com/favicon.ico
// @run-at document-end


// @namespace https://greasyfork.org/users/676911
// @downloadURL https://update.greasyfork.org/scripts/408900/air-douyu-lite.user.js
// @updateURL https://update.greasyfork.org/scripts/408900/air-douyu-lite.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        loadStyle(css);//精简界面
    };
})();

var css = '{display:none !important;height:0 !important}';
// css += '.layout-Player-rank{display:none !important}';
// css += '.layout-Player-barrage{top:0px !important;}';
// css += '.layout-Player-video{bottom:0px !important}';
// css += '.layout-Player-toolbar{visibility:hidden !important;}';
css += '.layout-Bottom{display:none !important;}';
// css += '.guessGameContainer.is-normalRoom{display:none !important;}';
css += '.DropPane-ad{display:none !important}';
css += '.SignBaseComponent-sign-ad{display:none !important}';
//css += '.AnchorAnnounce{display:none !important;}';  //斗鱼真实人数显示
//css += '.FansMedalPanel-enter{display:none !important;}'; //牌子
css += '.layout-Aside{display:none !important;}';
css += '.Header-download-wrap{display:none !important;}';
css += '.Header-broadcast-wrap{display:none !important;}';
css += '#js-header > div > div > div.Header-left > div > ul > li:nth-child(5){display:none !important;}';
css += '.ChatNobleBarrage{display:none !important;}';
// css += '.ChatFansBarrage{display:none !important;}';
css += '.Horn4Category{display:none !important;}';
css += '.FirePower{display:none !important;}';
css += '.TreasureDetail{display:none !important;}';
css += '.SignChatAd-chat-ad-cls{display:none !important;}';
css += '.Promotion-nobleRights{display:none !important;}';
css += '.Task{display:none !important;}';
css += '.UPlayerLotteryEnter.is-active{display:none !important;}';
css += '.LotteryContainer{display:none !important;}';
css += '.layout-Module-head.FollowList-head.is-fixed{display:none !important;}';
css += '.layout-Banner-item{display:none !important;}';
css += '.layout-Module-extra{display:none !important;}';
css += '.Title-anchorPic{display:none !important;}';
css += '.Title-roomOtherBottom{display:none !important;}';
css += '.Act129684Bar-view1{display:none !important;}';
css += '.Act129684Bar-content{display:none !important;}';
css += '.Act129684-logo{display:none !important;}';
css += '.ActBase-switch{display:none !important;}';
css += '.HeaderNav{display:none !important;}';
css += '.HeaderGif-left{display:none !important;}';
css += '.HeaderGif-right{display:none !important;}';
css += '.Prompt-container{display:none !important;}';
css += '.SysSign-Ad{display:none !important;}';
css += '.ActDayPay-toast{display:none !important;}';
css += '.code_box-5cdf5a{display:none !important;}';
css += '.normalDiv-8b686d{display:none !important;}';
css += '.closeBg-998534{display:none !important;}';
css += '.bg-d4758b{display:none !important;}';
css += '.fireOpenRanking react-draggable react-draggable-dragged{display:none !important;}';
css += '.vsFestival1908{display:none !important;}';
css += '.ActSuperFansGroup-component.ActSuperFansGroupBar-normalBody{display:none !important;}';
css += '.ActSuperFansGroup-component.ActSuperFansGroupBar-miniBody{display:none !important;}';
css += '.ActSuperFansGroup-component.ActSuperFansGroupBar-plusBody{display:none !important;}';
css += '.ActSuperFansGroup-logo{display:none !important;}';
css += '.ActSuperFansGroup-switch{display:none !important;}';
css += '.TitleSuperFansIcon{display:none !important;}';
css += '.Act156581Bar{display:none !important;}';
css += '.Act159742Bar-main--pre{display:none !important;}';
css += '.Act159742-logo{display:none !important;}';
css += '.Act159742Bar-wrap{display:none !important;}';
css += '.Title-columnTag{display:none !important;}';
css += '.Title-impress.clearFix{display:none !important;}';
css += '#js-room-activity{display:none !important;}'; //活动 年度决赛 巅峰排行

function loadStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}