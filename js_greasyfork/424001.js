// ==UserScript==
// @name Moe背景/自定义图片+网页优化去广告（已优化：哔哩哔哩bilibili/谷歌搜索google/百度搜索页baidu/...~yui）
// @namespace helloworld.lol
// @version 1.1.9.29
// @description 使用Chrome以及stylus插件获得完整体验
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.baidu.com/*
// @match *://*.google.com/*
// @match *://*.moehui.com/*
// @match *://*.bilibili.com/*
// @match *://*.send2boox.com/*
// @match *://*.bing.com/*
// @match https://www.baidu.com/
// @include /^(?:.*)$/
// @downloadURL https://update.greasyfork.org/scripts/424001/Moe%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87%2B%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E5%B7%B2%E4%BC%98%E5%8C%96%EF%BC%9A%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2google%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5baidu~yui%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/424001/Moe%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87%2B%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E5%B7%B2%E4%BC%98%E5%8C%96%EF%BC%9A%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2google%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5baidu~yui%EF%BC%89.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:.*)\$").test(location.href)) {
  css += `
  body:before
    {
      content: "";
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -100;
      background-image: url(https://i0.hdslb.com/bfs/new_dyn/9ff3594f29dd7af7d0d55dfb51efaf3d582241924.jpg);
      background-position: center;
      background-size: cover;
      background-attachment: fixed;
      background-repeat: no-repeat;
      opacity: .36 /*暗图.2*/
      }

  `;
}
if ((location.hostname === "baidu.com" || location.hostname.endsWith(".baidu.com"))) {
  css += `
      
      #content_right,.se-ft-promlink, .c-line-clamp1,#searchTag{display: none!important}
      #head{background: rgba(0,0,0,0);}
      #form{background: rgba(255, 255, 255, .2);}
      #rs,#page-relative{opacity: .4}
      .bdsug{background: rgba(255, 255, 255, .8);}
      .wrapper_new .sam_newgrid~#page {background-color: rgba(0,0,0,0);}
      .wrapper_new #foot {background-color: rgba(0,0,0,0);}
      .wrapper_new #foot #help {background-color: rgba(0,0,0,0);}
      body .se-page-hd {background: rgba(0,0,0,0);}
      #page-bd, .se-head-tablink,.c-container, .se-page-controller .new-pagenav, .se-page-copyright, .se-page-ft {background: rgba(0,0,0,0);}
      .banner{opacity:0!important}
      .se-form,.s_ipt_wr{background: rgba(0,0,0,0)}
      div[tpl="recommend_list"],.c-recomm-wrap,.ppresult-op{display: none!important}
  `;
}
if (location.href === "https://www.baidu.com/") {
  css += `
      /*百度首页优化*/
      #s_wrap,#bottom_layer,.s-top-nav{display: none!important}
      #s_top_wrap{background: rgba(0,0,0,0);}
      #form{opacity:.5}
      #lg{opacity:0}`;
}
if ((location.hostname === "google.com" || location.hostname.endsWith(".google.com"))) {
  css += `
      .sfbg,.yg51vc,.appbar,.kp-blk,.f6F9Be,.minidiv,.s8GCU,.Lj9fsd,.jZWadf,.qcTKEe,.ECgenc,.sbib_a,.c93Gbe{background: rgba(255,255,255,0)!important}
      .I6TXqe,.RNNXgb,.sbibod{background: rgba(255,255,255,0.5)!important}
  `;
}
if ((location.hostname === "moehui.com" || location.hostname.endsWith(".moehui.com"))) {
  css += `
      body{background: rgba(0,0,0,0);}
      .sec-panel{background: rgba(0,0,0,0)!important}
      header{opacity:0.6}
      .post-loop-default .item:hover{background:transparent}
      `;
}
if ((location.hostname === "bilibili.com" || location.hostname.endsWith(".bilibili.com"))) {
  css += `
      body, #app,#app::before,.bb-comment,.mini-type,.v-wrap,.main-container{background: rgba(0,0,0,0)!important;}
      .textarea-container textarea,.bili-comment,.bili-dyn-item{background-color: rgba(255,255,255,0.6)!important;}
      .main-container .ep-list-wrapper,#danmukuBox{opacity:0.6}
      /*视频内弹窗*/.bilibili-player-video-popup,.bilibili-player-video-top-follow{display: none!important}
      .timeline-header,.timeline-wrapper,.tl-head .tl-day{background:transparent}
      .timeline-header .tl-weeks:after{display: none}
      #activity_vote,#right-bottom-banner,.ad-report,#reportFirst2,#live_recommand_report{display: none!important;}
      .bili-avatar-pendent-dom,.bili-avatar-pendent,.b-danmaku-high-icon,.bilibili-player-dm-tip-wrap,.h .space-theme-trigger{display: none!important;}
      /*主页动图*/
      .top{background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 100%)!important}
      .bottom{background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.26) 100%)!important}
      .formal-toutu,.h-inner{
      background-image: url(https://i0.hdslb.com/bfs/album/77d0a7be17f0d08bbd12719ad011c4ade4095e0a.jpg)!important;
      .bili-cover-card__stats{background:none!important}
      background-position: 60% 77%!important;
      /*background-repeat: repeat-x;
      background-size: contain!important;*/
      }
      #page-index .col-1,.col-full{background:transparent}
      .card[data-v-2dbadba2],.feed-title[data-v-87ed4514],#page-dynamic .col-2 .section{background-color: rgba(255,255,255,0.6)}
      #page-index .col-2{opacity:0.6}
      .n .n-inner{background-color: rgba(255,255,255,0.7)}
      /*个人动态页*/
      .fixed-bg,.bg,.bgc{background:none!important}
      .left-panel,.right-panel{opacity:0.8}
      .center-panel{opacity:0.9}
      .page-container,.history-list .r-info{background:transparent}
      /*2021-03-30 update*/
      .forw-area,.pager,.input-wrap{background:transparent!important}
      .comment-send-lite{background:rgba(255,255,255,0.6)!important}
      .nav-search-box{opacity:0.8}
      div.bb-comment > div.reply-notice,div.proxy-box > div > a,.bilibili-player-video-toast-bottom,.bilibili-player-link.bilibili-player-show,.unlogin-popover,.login-tip{display: none!important;}
      .bpx-player-toast-wrap,.bpx-player-dialog-wrap,img[alt^="[神楽Mea"], img[alt^="神楽Mea"]{display:none}
      .input-suggest{opacity:0.8}
      .video-container,.post-content,.shop-list,.card{background:rgba(255,255,255,.4)!important}
      /*220615*/
      .bili-layout>:nth-child(3),.bili-layout>:nth-child(6),.recommended-swipe{display: none!important;}
      .recommend-container__2-line>*:nth-of-type(1n + 8){display:block!important}
      /*220619屏蔽b站系统通知*/
      .red-num--message,.message-inner-list> a:nth-child(4)>.message-inner-list__item--num{display: none!important;}
      .nav-item-message>.t>.num{display: none!important;}
      a[href="//message.bilibili.com/#/system"]>span{display: none!important;}
      .video-page-special-card,.video-page-special-card-small,.side-bar>.list>li:nth-child(4)>a>.notify-number{display: none!important;}
      /*屏蔽b站新闻话题（和百度差不多了）*/
      .topic-panel,.floor-single-card,.adblock-tips{display: none!important;}
      /*直播，视频内推荐三连*/ .pop-live-small-mode,.bpx-player-cmd-dm-wrap,.announcement-wrapper{display: none!important;}
      .reply-view-image{--34114ac9: 280px!important}
      /*240212屏蔽b站最新烂活*/
      .bili-dyn-item__interaction,.slide-ad-exp,.bpx-player-ending-related-item,.bili-dyn-ads,.red-point--message,.notify-dot,.reply-notice,.activity-m-v1,#bar,#notice{display: none!important;}
      .preview-list{opacity:0.1}
      `;
}
if ((location.hostname === "send2boox.com" || location.hostname.endsWith(".send2boox.com"))) {
  css += `
      /*.AppHeader{background:transparent}
      .list-container, .page-container{background:transparent}
      body{overflow-y:auto;height:200%}
      .el-table__body-wrapper{height:auto!important}
      #adpp{height:auto!important}
      240%*/
      html{overflow-y:visible;height:1444px}
      .push-container .push-menu{width:150px!important}
      .list-container, .page-container{background:transparent}
      .push-file-header{opacity:0.7}
      .gb-table,.el-table{opacity:0.9}
  `;
}
if ((location.hostname === "bing.com" || location.hostname.endsWith(".bing.com"))) {
  css += `
      #b_header,#b_results>li,#b_context .b_ans, #b_context #wpc_ag,.b_footer,#b_pole .b_wpTabsWrapper{background:transparent!important}
      .b_searchboxForm, .sa_as .sa_drw{background: rgba(255,255,255,0.6)}
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
