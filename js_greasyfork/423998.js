// ==UserScript==
// @name B站网页优化去广告-Moe背景/自定义图片
// @namespace ？？？
// @version 1.0.1
// @description 萌绘moehui也有优化。建议使用stylus插件加载css，虽然油猴也行。
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @match *://*.moehui.com/*
// @downloadURL https://update.greasyfork.org/scripts/423998/B%E7%AB%99%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A-Moe%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/423998/B%E7%AB%99%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A-Moe%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
let css = `
 
body:before
  {
    content: "";
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -100;
    background-image: url(https://i0.hdslb.com/bfs/album/a284e6269702e91c0e8c8302a96f961bcbaeb2b7.jpg);
    background-position: center ;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    opacity: .2
    }

@-moz-document domain("bilibili.com"){
    body, #app,.bb-comment,.mini-type{background: rgba(0,0,0,0)!important;}
    .textarea-container textarea{background-color: rgba(255,255,255,0.6)!important;}
    .main-container .ep-list-wrapper,#danmukuBox{opacity:0.6}
    #right-bottom-banner,.ad-report,#reportFirst2,#live_recommand_report{display: none!important;}
    .bili-avatar-pendent,.b-danmaku-high-icon,.bilibili-player-dm-tip-wrap{display: none!important;}
    #page-index .col-1,.col-full{background:transparent}
    .card[data-v-2dbadba2],.feed-title[data-v-87ed4514],#page-dynamic .col-2 .section{background-color: rgba(255,255,255,0.6)}
    #page-index .col-2{opacity:0.6}
    .n .n-inner{background-color: rgba(255,255,255,0.7)}
    /*个人动态页*/
    .fixed-bg{background-image:none!important}
    .left-panel,.right-panel{opacity:0.8}
    .center-panel{opacity:0.9}
    /*.bilibili-player-video-bottom-area,.bilibili-player-video-sendbar{opacity:0.8;background:rgba(155, 77, 228, 01)}*/
    }
@-moz-document domain("moehui.com"){
    body{background: rgba(0,0,0,0);}
    .sec-panel{background: rgba(0,0,0,0)!important}
    header{opacity:0.6}
    .post-loop-default .item:hover{background:transparent}
    `;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
