// ==UserScript==
// @name         b站播放器样式优化
// @namespace    http://tampermonkey.net/
// @version      1.3.9
// @description  浏览器分辨率为1920px极佳
// @author       aotmd
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/video/AV*
// @match        https://www.bilibili.com/av*
// @match        https://www.bilibili.com/AV*
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/video/bv*
// @match        https://www.bilibili.com/BV*
// @match        https://www.bilibili.com/bv*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396302/b%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396302/b%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
var now = new Date();
var time = now.getTime();
time += 365 * 24 * 60 * 60 * 1000; // 一年的毫秒数
now.setTime(time);
/*视频播放页老样式:*/
document.cookie = "go_old_video=1; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*番剧页老样式*/
document.cookie = "go-old-ogv-video=1; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*我也不知道这个cookie是什么意思*/
document.cookie = "rpdid=|(k|mllmRJJR0J'uY)lkRJRlY; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
    addStyle(`
/*-------------------------------------------播放器-------------------------------------------*/
/*番剧页的迷你播放器*/
.bpx-player-container[data-screen=mini] {
    width: 1280px;
    height: 720px;
}
/*番剧页的迷你播放器*/
#__next .bpx-player-container[data-screen=mini] {
    width: 1280px;
    height: 720px;
}

/*迷你播放器定位*/
.mini-player,
.bpx-player-container[data-screen=mini] {
    left: calc(100% - 1280px) !important;
    top: calc(100% - 720px) !important;
}

/*调节迷你播放器大小*/
#video-player #bilibili-player.mini-player .player,
#playerWrap #bilibili-player.mini-player .player {
    width: 1280px !important;
    height: 720px !important;
}

.bilibili-player-video {
    margin: 0 !important;
}

#bilibili-player.mini-player .drag-bar {
    width: 1280px !important;
}

/*1.2.2 迷你播放器添加遮罩,加大播放暂停范围为小窗全屏,关闭按钮置顶,并加点过渡动画*/
.bpx-player-mini-close .bpx-common-svg-icon svg {
    z-index: 9999;
}

.bpx-player-mini-warp:hover {
    background: #00000085;
}

.bpx-player-video-area .bpx-player-mini-warp .bpx-player-mini-state {
    width: 95%;
    height: 100%;
    transform: translate(-50%, -50%);
    margin: 0;
}

.bpx-player-mini-warp {
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
}


/*播放器大小更改:*/
div#bilibili-player {
    width: 1280px !important;
    height: 766px !important;
    position: relative !important;
}

/*老版番剧页面播放器大小更改*/
div#bilibili-player-wrap div#bilibili-player {
    width: 1280px !important;
    height: 776px !important;
    position: relative !important;
}

/*调整播放器宽度*/
.l-con {
    width: 1280px;
}

.v-wrap {
    width: 1760px;
}

/*https://www.bilibili.com/bangumi/play/ep 番剧页面*/
.main-container {
    width: 1760px;
}


/*老版番剧页面高度问题*/
div#bilibili-player-wrap {
    height: 100%;
}

/*-------------------------------------------播放器内组件-------------------------------------------*/
/*调整显示其他视频点击样式*/
.bilibili-player-link.bilibili-player-show {
    font-size: 18px !important;
    left: 50% !important;
    top: 80% !important;
    opacity: 0.8;
}

/*1.2.4 视频内组件调整*/
/*透明化选项框样式*/
.bilibili-player-video-popup-vote-an-bg {
    box-shadow: 0 0 7px 0 rgba(18, 80, 18, 0.0), 0 0 0 1px rgba(0, 0, 0, 0.3);
    background: initial !important;
}

.bilibili-player-video-popup-vote {
    background: rgba(149, 117, 205, 0.2) !important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18, 0.0), 0 0 0 1px rgba(0, 0, 0, 0.3);
}

.bilibili-player-video-popup-vote-an {
    color: snow !important;
}

/*1.3.0 透明化选项框样式*/
.bili-vote.bili-show {
    box-shadow: 0 0 7px 0 rgba(18, 80, 18, 0.0), 0 0 0 1px rgba(0, 0, 0, 0.3);
    /* background: initial!important; */
    --scale: 1 !important;
    opacity: 0.8;
    --top: 75% !important;
    --left: 20% !important;
}

/*三连框*/
.bili-guide-all.bili-guide.bili-show {
    --scale: 1 !important;
    opacity: 0.8;
    --top: 75% !important;
    --left: 20% !important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18, 0.0), 0 0 0 1px rgba(0, 0, 0, 0.3);
    /* background: initial!important; */
}

/*其他视频点击*/
.bili-link.bili-show {
    --scale: 1 !important;
    opacity: 0.8;
    --top: 75% !important;
    --left: 20% !important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18, 0.0), 0 0 0 1px rgba(0, 0, 0, 0.3);
    /* background: initial!important; */
}

/*调整显示其他视频点击样式*/
.bilibili-player-link.bilibili-player-show {
    font-size: 18px !important;
    left: 50% !important;
    top: 80% !important;
    opacity: 0.8;
}

/*选项打分*/
.bili-score.bili-show{
    --scale: 1!important;
    opacity: 0.8;
    --top: 75%!important;
    --left: 20%!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
}
/*视频点评*/
bili-scoreSum bili-show{
    --scale: 1!important;
    opacity: 0.8;
    --top: 75%!important;
    --left: 20%!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
}
/*视频预约*/
.bili-reserve.bili-show{
    --scale: 1!important;
    opacity: 0.8;
    --top: 75%!important;
    --left: 20%!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
}
/*-------------------------------------------评论区调节-------------------------------------------*/
/*评论区调节:*/
.con {
    margin-left: 80px !important;
}

.common {
    margin-right: calc(790px + 1920px - 100vw);
    margin-left: -135px;
    min-width: 250px;
}

/*
.reply-con,
.info {
    width: 520px !important;
}
.reply-item .info {
    width: 486px !important;
}
.con .text {
    width: 555px !important;
}*/


/*-------------------------------------------其他-------------------------------------------*/

/*收藏栏下移*/
div#video-player {
    width: 1280px !important;
    height: 766px !important;
}

/*
div#player_module {
    height: 100%!important;
}*/
/*分P列表间距缩小*/
.multi-page .cur-list .list-box li {
    line-height: initial !important;
    height:100%;
}
/*1.3.5 分P列表间距缩小*/
#app .multi-page .cur-list .list-box li {
    height: auto;
    line-height: initial;
    margin: 0;
}

/*不限制合集高度*/
.multi-page .cur-list ul {
    max-height: none!important;
}

.multi-page .cur-list .module-box li {
    padding: 2px;
    margin: 2px;
    min-width: 20px;
    min-height: 20px;
    width: auto;
    height: auto;
    line-height: inherit;
}

/*完全显示播放列表*/
.player-auxiliary-area .player-auxiliary-filter-playlist .player-auxiliary-playlist-top .player-auxiliary-filter-title {
    overflow: visible !important;
}

/*调整番剧页宽度*/
div#app {
    min-width: 1610px !important;
}

/*调整番剧页边距为0*/
.bpx-player-video-wrap {
    border: 0px !important;
}

/*1.1.7 删除小窗口遮罩*/
.mini-player-drag-mask {
    display: none;
}

/*1.2.0 修复番剧页高度*/
div#player_module {
    height: auto !important;
}

/*1.2.3 调整视频右边合集的高度,将合集显示全*/
.base-video-sections .video-sections-content-list[style*='height:152px'] {
    max-height: min(67.5vh, 640px);
    height: 100% !important;
}
/*1.3.1 合集设置最大高度*/
div#multi_page {
    overflow-y: auto;
    max-height: min(75.5vh, 725px);
}
/*1.3.8 合集设置最大高度*/
#app .base-video-sections .video-sections-content-list {
    height: 100%;
    /* height: 351px; */
    overflow-y: auto;
    max-height: min(65.5vh, 620px);
}
/*1.3.1 合集每项高度与字体大小调整*/
#app .video-episode-card__info {
    height: auto;
    font-size: inherit;
}
#app .video-episode-card {
    height: auto;
}
.video-section-list.section-0 {
    height: 100%!important;
}
/*1.3.6 合集文字自动换行*/
#app .video-episode-card__info-title {
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    white-space: inherit;
}
/*1.3.6 分P设置宽度与行高以及文字自动换行*/
div#multi_page .cur-list .list-box li {
    line-height: initial;
}
div#multi_page .cur-list .list-box li .part {
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
}
/*-------------------------------------------ad拦截-------------------------------------------*/



.video-page-operator-card,
.slide-gg,
a.ad-report,
#home_popularize .adpos,
#home_popularize .l-con,
#slide_ad,
.activity-m,
.bili-header-m .nav-menu .nav-con .nav-item .text-red,
.bilibili-player-promote-wrap,
.gg-floor-module,
.home-app-download,
.mobile-link-l,
.video-page-game-card {
    display: none !important;
}

.video-page-special-card {
    width: 0px;
    height: 0px;
    opacity: 0;
}

/*1.2.1 屏蔽弹幕列表上面的广告*/
.video-ad-creative-card.report-wrap-module.report-scroll-module {
    display: none;
}
	`);

