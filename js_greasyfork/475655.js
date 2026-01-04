// ==UserScript==
// @name           斗鱼直播间精简
// @namespace      ListeningLTG
// @version        2023.09.26
// @description    提供简洁的界面，只为安心看直播。
// @author         ListeningLTG
// @match          *://*.douyu.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475655/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/475655/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

var pageUrl = window.location.href
var match="https?://(www\\.)?(douyu)\.com/[0-9]{1,}"
if (match && (new RegExp(match, 'i')).test(pageUrl)) {
    console.log('zhibojian')

}

(function() {
    var css = '{display:none !important;height:0 !important}';
    css += '.layout-Player-rank{display:none !important}';
    css += '.wm-view{display:none !important}';
    css += '.RechangeJulyPopups{display:none !important}';
    css += '.layout-Slide{display:none !important}';
    css += '#bc2{display:none !important}';
    css += '.wm_footer{display:none !important}';
    css += '.layout-Player-aside{display:none !important}';
    css += '#bc3{background-image:none !important;padding-top: 10px;}';
    css += '#bc3-bgblur{background-image:none !important}';
    css += '#bc2-bgblur{display:none !important}';
    css += '#bc4-bgblur{display:none !important}';
    css += '.wm-general{height:auto !important}';
    css += '.layout-Player-barrage{top:0px !important;}';
    css += '.layout-Player-video{bottom:0px !important}';
    css += '.layout-Player-toolbar{visibility:hidden !important;}';
    css += '.layout-Bottom{display:none !important;}';
    css += '.guessGameContainer.is-normalRoom{display:none !important;}';
    css += '.DropPane-ad{display:none !important}';
    css += '.SignBaseComponent-sign-ad{display:none !important}';
    css += '.DropMenuList-ad{display:none !important;}';
    css += '.AnchorAnnounce{display:none !important;}';
    css += '.FansMedalPanel-enter{display:none !important;}';
    css += '.layout-Aside{display:none !important;}';
    css += '.Header-download-wrap{display:none !important;}';
    css += '.Header-broadcast-wrap{display:none !important;}';
    css += '#js-header > div > div > div.Header-left > div > ul > li:nth-child(5){display:none !important;}';
    css += '.ChatNobleBarrage{display:none !important;}';
    css += '.ChatFansBarrage{display:none !important;}';
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
    css += '.Act156581Bar{display:none !important;}';
    css += '.Act159742Bar-main--pre{display:none !important;}';
    css += '.Act159742-logo{display:none !important;}';
    css += '.Act159742Bar-wrap{display:none !important;}';
    css += '.double11{display:none !important;}';
    css += '.Act163201Bar-wrap{display:none !important;}';
    css += '.Act163201-logo{display:none !important;}';
    css += '.ActBase-switchWrap{display:none !important;}';
    css += '.content-0fa509{display:none !important;}';
    css += '.Frawdroom{display:none !important;}';
    css += '#js-room-activity{display:none !important;}';
    css += '#bc1915{display:none !important;}';
    css += '#bc1215{display:none !important;}';
    css += '#__h5player > div.recommendApp-0e23eb:nth-child(3){display:none !important;}';
    css += '#__h5player > div.recommendView-3e8b62:first-child > div:last-child > div.recommendView-1c2131{display:none !important;}';
    css += '#__h5player > div.recommendAD-54569e:nth-child(9){display:none !important;}';
    css += '#__h5player > div.recommendView-3e8b62:first-child > div:first-child > div{display:none !important;}';
    css += '#js-player-title > div.Title > div.Title-roomInfo:last-child > div.Title-row:last-child{display:none !important;}';
    css += '#js-player-title > div.Title > div.Title-anchorPic:first-child > div.Title-anchorPicBack > a:first-child{display:none !important;}';
    css += '#js-player-video-case > div:last-child > div.css-widgetWrapper-EdVVC{display:none !important;}';
    css += '#js-player-asideMain';

   loadStyle(css)
   function loadStyle(css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.appendChild(document.createTextNode(css));
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(style);

   }
    setTimeout(function(){document.querySelector("div[class^='pause-']").click();},1000);
    setTimeout(function(){document.querySelector("div[class^='showdanmu-']").click();},6000);

})();

