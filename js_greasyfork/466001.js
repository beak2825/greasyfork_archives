// ==UserScript==
// @name         b站播放器样式优化-新版普通播放页面
// @namespace    http://tampermonkey.net/
// @version      1.3.13
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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466001/b%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96-%E6%96%B0%E7%89%88%E6%99%AE%E9%80%9A%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466001/b%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96-%E6%96%B0%E7%89%88%E6%99%AE%E9%80%9A%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
let setting={
    将响应式布局清除:true
}
var now = new Date();
var time = now.getTime();
time += 365 * 24 * 60 * 60 * 1000; // 一年的毫秒数
now.setTime(time);
/*视频播放页新样式:*/
document.cookie = "go_old_video=0; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*番剧页小窗口有bug*/
/*番剧页新样式*/
document.cookie = "go-old-ogv-video=0; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*我也不知道这个cookie是什么意思*/
document.cookie = "rpdid=|(k|mllmRJJR0J'uY)lkRJRlY; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    if(setting.将响应式布局清除){
        addStyle(`
			@media (min-width: 1681px) {
                /*侧栏*/
                #app .video-container-v1 .right-container,
			    #app .playlist-container .playlist-container--right {
			        width: 350px;
			    }
                #app .video-sections-v1 .video-sections-item.small-mode{
                    width: auto;
                }

                /*推荐视频列表*/
                #app .video-page-card-small .card-box .pic-box,
                #app .video-page-card-small .card-box .pic-box .framepreview-box .rcmd-cover-img,
			    .recommend-video-card .card-box .pic-box,
			    .recommend-video-card .card-box .pic-box .framepreview-box .rcmd-cover-img {
			        width: 141px;
			        height: 80px;
			    }

			    #app .rec-list .video-page-card-small ,
			    #app .recommend-list-container .video-card {
			        margin-bottom: 12px;
			    }
                #app .video-toolbar-container .video-toolbar-left .toolbar-left-item-wrap {
                    margin-right: 8px;
                }

                /*弹幕栏*/
                .bpx-player-container[data-revision="1"] .bpx-player-sending-bar, .bpx-player-container[data-revision="2"] .bpx-player-sending-bar {
                    height: 46px;
                    font-size: 14px;
                }
                .bpx-player-container[data-revision="1"] .bpx-player-sending-bar .bpx-player-video-inputbar, .bpx-player-container[data-revision="2"] .bpx-player-sending-bar .bpx-player-video-inputbar {
                    width: calc(100% - 72px)!important;
                    min-width: 300px!important;
                    height: 32px!important;
                    border-radius: 8px!important;
                }

                /*三连栏*/
                .video-toolbar-left-item .video-toolbar-item-icon {
                    width: 28px;
                    height: 28px;
                }
                #app .video-toolbar-container {
                    padding-top: 16px;
                }
                /*分P列表模式的间距*/
                #app .multi-page-v1.small-mode .cur-list .module-box li {
                    margin-right: 7px;
                }
			}

            @media screen and (max-width: 1681px){
                /*评论最热最新栏*/
                .reply-header .reply-navigation .nav-bar .nav-title {
                    font-size: 24px!important;
                }
                .reply-header .reply-navigation .nav-bar .nav-sort {
                    font-size: 16px!important;
                }
            }
            /*修正弹幕栏变矮的高度*/
            #playerWrap div#bilibili-player {
                width: 1280px !important;
                height: 776px !important;
                position: relative !important;
            }
            .playlist-container--left #playerWrap {
                height: 766px!important;
            }
            div#bilibili-player-placeholder {
                height: 766px;
            }
            /*评论区字体大小*/
            div#comment {
                --bili-rich-text-font-size: 14px;
                --bili-comments-font-size-content: 14px;
            }
        `);
    }
    addStyle(`
/*固定宽度*/
.playlist-container {
    width: 1760px;
    margin: 0 auto;
    padding: 0 68px;
}
.left-container {
    width: 1280px!important;
}
/*-------------------------------------------播放器-------------------------------------------*/
/*迷你播放器定位*/
.bpx-player-container[data-screen=mini]{
    left: calc(100% - 1280px) !important;
    top: calc(100% - 720px)!important;
}

/*调节迷你播放器大小*/
.bpx-player-container[data-screen=mini]{
    width: 1280px !important;
    height: 720px !important;
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
    height: 776px !important;/*新版*/
    position: relative !important;
}
#playerWrap {
    height: 776px!important;
}

.playlist-container--left {
    width: 1280px!important;
}

/*-------------------------------------------播放器内组件-------------------------------------------*/
/*透明化选项框样式*/
.bilibili-player-video-popup-vote-an-bg {
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    background: initial!important;
}
.bilibili-player-video-popup-vote {
    background: rgba(149, 117, 205, 0.2)!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
}
.bilibili-player-video-popup-vote-an {
    color: snow!important;
}
/*1.3.0 透明化选项框样式*/
.bili-vote.bili-show {
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
    --scale: 1!important;
    opacity: 0.8;
    --top: 75%!important;
    --left: 20%!important;
}
/*三连框*/
.bili-guide-all.bili-guide.bili-show {
    --scale: 1!important;
    opacity: 0.8;
    --top: 75%!important;
    --left: 20%!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
}
/*其他视频点击*/
.bili-link.bili-show {
    --scale: 1!important;
    opacity: 0.8;
    --top: 75%!important;
    --left: 20%!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
}

/*调整显示其他视频点击样式*/
.bilibili-player-link.bilibili-player-show {
    font-size: 18px!important;
    left: 50%!important;
    top: 80%!important;
    opacity: 0.8;
}
/*打分*/
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
/*关注*/
.bili-guide-followed.bili-show {
    --scale: 1!important;
    opacity: 0.8;
    --top: 80%!important;
    --left: 15%!important;
    box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.0), 0 0 0 1px rgba(0,0,0,0.3);
    /* background: initial!important; */
}
/*日志栏/统计信息*/
.bpx-player-info-container {
    opacity: 0.9;
    background-color: rgba(33,33,33,.05);
    width: 375px;
    line-height: 1;
}
#app .bpx-player-info-container .info-line > * {
    color: snow;
    background-color: rgba(33,33,33,.3);
}
#app .bpx-player-info-panel {
    padding: 0;
}





/*-------------------------------------------评论区调节-------------------------------------------*/
.comment,#commentapp {
    margin-right: calc(780px + 1920px - 100vw);
    margin-left: -110px;
    min-width: 250px;
}
/*评论本身*/
span.reply-content,.root-reply,span.reply-content-container.sub-reply-content {
    font-size: 14px!important;
    line-height: 20px!important;
}
/*评论时间戳等信息*/
.reply-info, .sub-reply-info {
    font-size: 12px!important;
    line-height: 12px!important;
}
/*评论区时间戳等信息允许多行*/
.sub-reply-item .sub-reply-info{
    flex-wrap: wrap!important;
}
/*评论区楼中楼行高*/
.sub-reply-item {
    line-height: 1!important;
}
/*--------------------------------字体大小调整-----------------------------*/
/*标题*/
.video-info-v1,
.video-info-container {
    height: auto!important;
}
.video-info-v1-ab .video-title,
h1.video-title.rm-space {
    font-size: 18px!important;
    line-height: 26px!important;
}
/*视频信息*/
.video-data,
.video-info-detail {
    height: 20px!important;
    line-height: 20px!important;
    font-size: 12px!important;
}
/*发弹幕的地方*/
.bpx-player-sending-bar {
    font-size: 12px!important;
}
/*简介*/
.desc-info-text,
.basic-desc-info{
    font-size: 12px!important;
    line-height: 18px!important;
}
/*tag标签*/
a.tag-link {
    height: 22px!important;
    line-height: 22px!important;
    font-size: 12px!important;
}
/*UP主名字*/
a.up-name {
    font-size: 14px!important;
}
/*UP主介绍*/
.up-description.up-detail-bottom {
    font-size: 12px!important;
}

/*右侧推荐以及播放列表字体大小*/

/*播放列表内的视频标题字体大小*/
.actionlist-item-inner .main .info .title {
    font-size: 14px!important;
}
/*播放列表内的视频的播放量字体大小*/
.actionlist-item-inner .main .info .views {
    font-size: 12px!important;
    line-height: 14px!important;
    height: 14px!important;
}
/*稍后再看播放列表删除键*/
svg.del-btn-icon {
    vertical-align: sub;
}
/*推荐视频的标题字体大小*/
.video-page-card-small .card-box .info .title,
.recommend-video-card .card-box .info .title {
    font-size: 14px!important;
}
/*推荐视频的up主,播放信息字体大小*/
.video-page-card-small .card-box .info .upname, .video-page-card-small .card-box .info .playinfo
.recommend-video-card .card-box .info .upname, .recommend-video-card .card-box .info .playinfo {
    font-size: 12px!important;
}

/*-------------------------------------------其他-------------------------------------------*/
/*1.2.0 修复番剧页高度*/
div#player_module {
    height: auto!important;
}

/*1.2.3 调整视频右边合集的高度,将合集显示全*/
.base-video-sections .video-sections-content-list[style*='height:152px'] {
    max-height: min(65.7vh, 622px)!important;
    height: 100%!important;
}
/*1.3.2 调整右边的播放列表高度*/
div#playlist-video-action-list-body {
    max-height: 100%;
}
.action-list-body-bottom {
    height: 580px;
}
#playlist-video-action-list {
    max-height: 570px;
}
/*1.3.4 调整创作团队与弹幕列表之间的间隙*/
.members-info-container {
    margin-bottom: 10px;
}
/*1.3.4 调整弹幕列表与播放列表之间的间隙*/
div#danmukuBox {
    margin-bottom: 10px;
}

/*收藏栏下移*/
div#video-player {
    width: 1280px !important;
    height: 766px !important;
}
div#player_module {
    height: 100%!important;
}
/*分P列表间距缩小*/
.multi-page .cur-list .list-box li {
    line-height: initial!important;
}

.multi-page .cur-list .module-box li{
    padding: 2px;
    margin: 2px;
    min-width: 20px;
    min-height: 20px;
    width: auto;
    height: auto;
    line-height: inherit;
}
/*分P列表间距缩小*/
.multi-page-v1 .cur-list .list-box li {
    height: 100%;
    font-size: 12px;
    /* transition: all 0.3s; */
    margin: 5px 0;
}
/*1.3.13 分P列表间距缩小*/
.multi-page-v1 .cur-list .list-box li {
    height: auto!important;
    line-height: 1!important;
}

/*完全显示播放列表*/
.player-auxiliary-area .player-auxiliary-filter-playlist .player-auxiliary-playlist-top .player-auxiliary-filter-title {
    overflow: visible!important;
}

/*调整番剧页宽度*/
div#app {
    min-width: 1610px!important;
}
/*调整番剧页边距为0*/
.bpx-player-video-wrap {
    border: 0px!important;
}
/*在往下拉的过程中,回复窗口会出现在左下部分,然后会一直出现一个椭圆曲线的阴影,意义不明,因此隐藏*/
.fixed-reply-box i.reply-box-shadow {
    display: none;
}

/*1.3.1 分P设置最大高度*/
#app .multi-page-v1 .cur-list {
    overflow-y: auto;
    max-height: min(68.7vh, 650px)!important;
}
/*1.3.6 分P设置宽度与行高以及文字自动换行*/
.multi-page-v1 .cur-list .list-box li {
    width: 338px!important;
    line-height: initial;
}
.multi-page-v1 .cur-list .list-box li .part {
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    max-height: max-content;
}

/*1.2.3 调整视频右边合集的高度,将合集显示全*/
.base-video-sections-v1 .video-sections-content-list[style*='152px'] {
    max-height: min(65.5vh, 620px)!important;
    height: 100% !important;
}
#app .video-sections-v1 .video-sections-content-list{
    max-height: min(65.5vh, 620px)!important;
    height: 100% !important;
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
.video-episode-card__info-title {
    font-size: inherit!important;
    line-height: inherit!important;
}
/*1.3.6 合集文字自动换行*/
#app .video-episode-card__info-title {
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    white-space: inherit;
    max-height: max-content;
}
/*1.3.12 合集也分类100%高度控制*/
.video-section-list {
    height: 100%!important;
}
/*-------------------------------------------番剧页支持-------------------------------------------*/
#__next .main-container {
    width: 1700px;
    margin: 0 auto;
}
#__next .main-container div#bilibili-player-wrap {
    height: 100%;
}
.plp-r.sticky {
    left: calc(100vw)!important;
}
div#comment-module ,
#__next .bb-comment {
    margin-right: calc(750px + 1920px - 100vw);
    margin-left: -100px;
    min-width: 250px;
}

/*-------------------------------------------ad拦截-------------------------------------------*/
.v-wrap #slide_ad {
    margin-bottom: 0px !important;
    width: 0px !important;
    height: 0px !important;
}

.slide-gg {
    width: 0px !important;
    height: 0px !important;
}
.video-page-operator-card{
display: none;
}
#activity_vote,
#home_popularize .adpos, #home_popularize .l-con, #slide_ad, .activity-m, .bili-header-m .nav-menu .nav-con .nav-item .text-red, .bilibili-player-promote-wrap, .gg-floor-module, .home-app-download, .mobile-link-l, .video-page-game-card {
    display: none!important;
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

