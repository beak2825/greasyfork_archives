// ==UserScript==
// @name         斗鱼极简
// @namespace    https://www.douyu.com/
// @version      1.0.0
// @description  仅保留顶部导航栏, 视频播放窗口和聊天窗口, 去除广告弹窗，去除聊天窗口除用户名和评论外的其它信息
// @author       MakeHui
// @match        https://www.douyu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/394614/%E6%96%97%E9%B1%BC%E6%9E%81%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/394614/%E6%96%97%E9%B1%BC%E6%9E%81%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
#js-room-activity,.ActLoveDay-medal,.AnchorLevel,.Barrage-hiIcon,.Barrage-icon,
.Barrage-userEnter,.ChatRank,.FansMedal,.Header-broadcast-wrap,.Header-download-wrap,
.LotteryContainer,.Medal-image,.Motor,.UPlayerLotteryEnter,.UserLevel,.layout-Player-announce,
.layout-Player-effect,.layout-Player-rank,.layout-Player-rankAll {
    display: none!important
}

#guess-main-panel,#js-aside,#js-bottom,#js-player-guessgame,#js-player-title,.ChatToolBar,.HeaderNav {
    display: none!important;
    height: 0!important
}

#js-player-toolbar {
    overflow: hidden!important;
    height: 0!important
}

#js-player-barrage {
    top: 0!important
}

.Barrage-listItem>div {
    display: none!important
}

.Barrage-listItem>div.Barrage-notice--normalBarrage {
    display: block!important
}

.layout-Main {
    margin: 0!important;
    padding: 0!important
}

.layout-Player-aside {
    top: -1px!important;
    width: 240px!important;
    background: #2c3e50!important
}

.layout-Player-asideMain {
    position: static!important
}

.Barrage {
    border-color: #rgba(255,255,255,.3)!important
}

.layout-Player-asideMainTop {
    bottom: 57px!important
}

.Barrage-content {
    color: #16a085!important
}

.Header-menu-link>a,.public-DropMenu-link {
    color: #fff!important
}

.DropMenuList h4,DropMenuList a {
    color: #000!important
}

.GiftEffect-box,.Header-wrap,.layout-Player-asideMainTop div {
    background: #2c3e50!important
}

div[class*=" host-"] {
    display: none!important
}

div[class^=closeBg],div[class^=watermark] {
    display: none
}

.layout-Player-main {
    margin-right: 0!important;
    width: calc(100% - 240px)!important;
    height: 100%!important
}

section[class=layout-Container] {
    height: calc(100% - 68px)!important
}

div[class=layout-Player-video] {
    position: initial!important;
    height: 100%!important
}

div[class=layout-Player],main[class=layout-Main] {
    height: 100%!important
}

body {
    min-width: 0!important;
    height: 100%!important
}

div[class=layout-Player] {
    overflow: hidden!important
}

div[class=Barrage] {
    border: 0!important
}

.layout-Player-chat .ChatSend-txt {
    width: 172px!important;
    padding: 5px 5px 5px 5px!important
}

.layout-Player-chat .Chat {
    height: 49px
}

.layout-Player-chat .FansMedalPanel-container {
    visibility: hidden!important
}
    `);
})();