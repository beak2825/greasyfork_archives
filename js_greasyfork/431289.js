// ==UserScript==
// @name                                    斗鱼虎牙B站直播极简
// @version                                  2022.10.24
// @description                          极限精简，宽屏播放，没有弹幕聊天框。适合只看直播不爱发弹幕的观众，如需发弹幕请使用全屏模式。
// @match                                *://www.douyu.com/*
// @match                                *://www.huya.com/*
// @match                                *://*.bilibili.com/*
// @namespace https://greasyfork.org/users/669525
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/431289/%E6%96%97%E9%B1%BC%E8%99%8E%E7%89%99B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%9E%81%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/431289/%E6%96%97%E9%B1%BC%E8%99%8E%E7%89%99B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%9E%81%E7%AE%80.meta.js
// ==/UserScript==


(function() {
    var css = '{display:none !important;height:0 !important}';

//斗鱼全局
    //css += '.layout-Aside{display:none !important;}';//左侧导航栏
    css += '#js-room-activity{display:none !important;}';//右侧悬浮广告
    css += '.Download-iconAdd{display:none !important;}';//顶部导航栏“红色闪电”
    css += '.HeaderNav{display:none !important;}';//顶部导航栏中间活动广告
    css += '.HeaderGif-left,.HeaderGif-right{display:none !important;}';//顶部导航栏两边文字动画
    css += '.multiBitRate-da4b60{display:none !important;}';//未登录弹框
    css += '.layout-Customize{display:none !important;}';//直播分区推荐
//斗鱼直播间
    //css += '.layout-Container:nth-child(10){height: 955px !important;background: #363636 !important;}';//直播间背景
    css += '.layout-Player-title{display:none !important;}';//标题栏
    css += '.layout-Player-aside{display:none !important;}';//弹幕框
    css += '.PlayerToolbar,.ACTannual202109Tips{display:none !important;}';//礼物栏“礼物广告”
    css += '.layout-Player-toolbar{visibility:hidden !important;height: 0px !important;}';//“礼物栏”高度
    css += '.FullPageFollowGuide{display:none !important;}';//视频内主播头像
    css += '.layout-Bottom{display:none !important;}';//底部动态
    css += '.layout-Player-main{width: 100% !important;}';//视频大小调整
    css += '.layout-Player-video{bottom:0px !important;}';//网页全屏时视频高度修正
    css += '.layout-Player-asideToggle{display:none !important;}';//网页全屏时右侧控制条
    css += '.watermark-442a18{display:none !important;}';//视频区左下角“房间号水印”
    css += '.recommendApp-0e23eb{display:none !important;}';//未开播直播间下载APP
    css += '.btnDiv2-e4408a{display:none !important;}';//未开播直播间“开播广告”
    css += '.PkView,.MorePk{display:none !important;}';//颜值直播间“PK横条”
    css += '.maiMaitView-68e80c{display:none !important;}';//颜值直播间“主场广告”
    css += '.index-common-1-rrh{display:none !important;}';//视频中“推塔结算”
    css += '.yanzhi-b079f5, .mouse-disable-3cc40a{display:none !important;}';//颜值直播间“连麦广告”
    css += '.layout-Player-videoProxy{display:none !important;}';//视频右下方“点赞、播单”
    css += '.layout-Player-videoAbove{display:none !important;}';//视频左侧“亲密互动”
    css += '.layout-Player-guessgame{display:none !important;}';//视频下方“鱼丸竞猜”
    css += '.shark-webp .PubgInfo-icon{display:none !important;}';//弹幕区右下“战绩统计”
    css += '.InteractPlayWithPendant,.is-type0,.is-hidden,.react-draggable{display:none !important;}';//视频左下方“滴滴，上车”
//斗鱼关注页
    css += '.Prompt-container{display:none !important;}';//关注列表页左上方“领取火箭”
//斗鱼专题活动直播间
   //css += '.layout-Main{padding-top:5px !important;width:1600px !important;max-width:1600px !important;}'; //统一视频窗口大小和顶部空隙
   css += '.wm_footer,#bc17,.wm-view{display:none !important;}';//隐藏底部网站信息
   css += '.bc-wrapper{height:100% !important; padding-top:0px !important;padding-bottom:0px !important;}'; //自动调整 .bc-wrapper 高度 (隐藏 .wm_footer 的容器 #bc259)


//虎牙全局
    css += '.list-adx{display:none !important;}';//直播分区“头图广告”
    css += '.duya-header-ad{display:none !important;}';//顶部导航栏中间广告
    css += '.dot--g92BzaqFUtbPTJytM_job::after{display:none !important;}';//顶部导航栏“小红点”
    //css += '.mod-sidebar{display:none !important;}';//左侧导航栏
    css += '.helperbar-root--12hgWk_4zOxrdJ73vtf1YI{display:none !important;}';//右侧工具栏
    css += '.liveList-header-r{display:none !important;}';//分区右上方“领取银豆广告”
    css += '#player-login-guide-tip,.LoginBd--1CdcbB8Yn5UQkgoU4sCunn{display:none !important;}';//登陆提示
//虎牙直播间
    //css += '.main-wrap,.player-gift-wrap{background: #363636 !important;}';//直播间背景
    css += '.room-hd{display:none !important;}';//标题栏
    css += '.room-core-r{display:none !important;}';//弹幕框
    css += '.player-gift-left,.week-star-0,.player-face,.player-gift-right,#diy-pet-icon{display:none !important;}';//礼物栏“礼物广告”
    css += '.room-footer{display:none !important;}';//主播动态，猜你喜欢
    css += '.room-core-l{width: 100% !important;}';//视频大小调整
    css += '.room-player-wrap{height: 106% !important;}';//视频播放器高度修正★★★请调整适合自己显示分辨率的百分比★★★
    //css += '.player-fullpage-right-close{display:none !important;}';//网页全屏右侧控制条
    css += '.gift-show-btn{display:none !important;}';//视频全屏后底部控制条“礼物种豆”
    css += '.player-subscribe{display:none !important;}';//视频内主播头像
    css += '.player-app-qrcode{display:none !important;}';//暂停上方二维码
    css += '#hy-watermark{display:none !important;}';//视频区内“房间号水印”
    css += '.gift-info-btn{display:none !important;}';//视频全屏后右侧“展开礼物”
    css += '.room-backToTop, .j_room-backToTop{display:none !important;}';//右侧返回顶部按钮
    css += '.player-subscribe-banner.subscribe{display:none !important;}';//视频区“点我订阅”弹幕
    css += '#player-download-guide-tip{display:none !important;}';//视频底部下载app提示
    css += '.popup-444af481{display:none !important;}';//视频底部“进入领地”
//虎牙专题活动直播间
    //css += '.main-room{background: #363636 !important;}';//专题背景
    css += '.match_body_wrap,.diy-comp,.J_comp_2,.special-bg{display:none !important;}';//专题板块


//哔哩哔哩全局
    css += '.nav-link-item:last-child,.download-entry{display:none !important;}';//顶部导航栏“下载APP”
    css += '.loc-moveclip{display:none !important;}';//顶部导航栏中间活动“广告”
    css += '.nav-user-center:last-child > div:last-child,.header-upload-entry{display:none !important;}';//顶部导航栏“投稿”
    css += '.red-point,.bp-red-point,.msg-hinter,.hinter{display:none !important;}';//顶部导航栏“大会员”、“签到”、“动态”红点
    css += '.unlogin-popover,.unlogin-popover-avatar,.login-tip,.van-popper[x-placement^=bottom],.bili-header .login-panel-popover{display:none !important;}';//未登录弹框
    css += '.all__special-area-recommend-list-ctnr{display:none !important;}';//全部直播专区推荐
    css += '.banner-ctn,.index_3iBR2QjH{display:none !important;}';//大分区头图“广告”
    css += '.index_30nM37F4,.index_87nLYour{height:80px !important;}';//小分区头图高度
//哔哩哔哩投稿视频
    css += '#activity_vote{display:none !important;}';//评论上方“广告”
    css += '.pay-bar{display:none !important;}';//右侧“开通大会员”
    css += '#right-bottom-banner{display:none !important;}';//右侧推荐视频底部广告
    css += '.bilibili-player-video-popup{display:none !important;}';//视频播放中“点赞”
    css += '.bilibili-player-dm-tip-wrap{display:none !important;}';//视频播放中“投票”
    css += '.bilibili-player-link-wrap{display:none !important;}';//视频播放中“视频链接”
    css += '.bilibili-player-video-inner{display:none !important;}';//视频播放中“打心”
    css += '.bilibili-player-electric-panel{display:none !important;}';//视频结束后的“充电鸣谢”
//哔哩哔哩直播间
    css += '.room-bg,.webp{top: -16px !important;}';//直播间背景
    css += '.avatar-btn{display:none !important;}';//右侧“直播姬”
    css += '.live-sidebar-ctnr,.side-bar-cntr,.side-bar-popup-cntr{display:none !important;}';//右侧工具栏
    css += '#head-info-vm{display:none !important;}';//标题栏
    css += '#aside-area-vm{display:none !important;}';//弹幕框
    css += '#gift-control-vm{display:none !important;}';//礼物栏
    css += '.player-ctnr{width: 100% !important;}';//视频大小调整
    css += '.pk-container{display:none !important;}';//视频区“大乱斗”
    css += '.content.border-box{display:none !important;}';//视频区“恭喜主播获得超人气推荐奖励”
    css += '#anchor-guest-box-id > iframe{display:none !important;}';//视频区“天选时刻”
    css += '#player-effect-vm > div > div.rhythm-storm{display:none !important;}';//视频区“节奏风暴”
    css += '.web-player-icon-roomStatus{display:none !important;}';//视频区右上角直播水印
    css += '#sections-vm{display:none !important;}';//主播简介公告及动态
    css += '#link-footer-vm{display:none !important;}';//底部网站信息
    css += '.login-guide{display:none !important;}';//登录体验高画质提示框
    css += '.lead-up{display:none !important;}';//视频左上角“观看xx的更多视频”
    css += '.startlive-icon{display:none !important;}';//顶部导航栏“我要开播”
    css += '#game-id{display:none !important;}';//视频右下角“粉丝占领玩法”
    css += '.shop-popover{display:none !important;}';//视频左上角“购物小橙车”提示
//哔哩哔哩专题活动直播间
    css += '.activity-navigator-list{display:none !important;}';//右侧活动导航
    css += '.handle-bar,.handle-center,.sc-dlfnuX,.bPQznN,.light-tab{display:none !important;}';//标题栏上方相关直播间
    //css += '.t-background-image,.container-wrapper:nth-child(2){height: 895px !important;}';//专题活动背景
    css += '.plat-section-outter-box,.container-wrapper,.t-space-container,.plat-section-space{height: 0px !important;}';//专题活动板块
    css += '#webShare{display:none !important;}';//底部分享
    css += '.bili-footer,.international-footer{display:none !important;}';//底部网站信息


   loadStyle(css)
   function loadStyle(css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.appendChild(document.createTextNode(css));
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(style);

   }
})();

//投稿视频自动宽屏
    var 投稿宽屏=document.getElementsByClassName('bpx-player-ctrl-wide-enter');
        window.onload =(function() {
        'use strict';
    var 投稿宽屏_t=setInterval(function () {
        投稿宽屏[0].click();
        clearInterval(投稿宽屏_t );
            },100);

  }
)();

//番剧视频自动宽屏
    var 番剧宽屏=document.getElementsByClassName('squirtle-widescreen-inactive');
        window.onload =(function() {
        'use strict';
    var 番剧宽屏_t=setInterval(function () {
        番剧宽屏[0].click();
        clearInterval(番剧宽屏_t );
            },100);

  }
)();