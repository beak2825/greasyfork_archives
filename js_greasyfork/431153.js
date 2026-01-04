// ==UserScript==
// @name                                                                    哔哩哔哩精简
// @namespace                                                                  G-uang
// @author                                                                     Guang
// @version                                                                  2022.09.07
// @description                                                    提供简洁的界面，只为安心看直播。
// @match                                                              *://*.bilibili.com/*
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/431153/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/431153/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
//---------------------------------------------------------------------部分用户可能遇到的问题-----------------------------------------------------------------------------------------------------------------------------
//1.登录帐号：所有的参数调节都是在已经登录帐号的前提下，登录帐号后在使用本脚本会更完美，且不登录帐号网站本身也会有功能限制。
//2.网页抖动：如果左侧黑色导航栏是展开状态请手动将其缩小，刷新网页后脚本会自动将其隐藏，可解决部分人的网页抖动问题。
//                    如果已隐藏左侧导航栏网页依旧抖动，请轻微调节浏览器的缩放比例即可解决。
//3.视频黑边：可能部分用户在默认的网页全屏时视频区会有上下或者左右黑边，脚本默认参数是完美显示，没有任何黑边，如果在你的浏览器上部分直播画面有黑边可能是主播推送的画面比例问题。
//                    如果所有直播画面都有黑边，是因为每个人的显示器大小和像素不同，系统和浏览器的设置也不同，这些因素会导致你那里的显示效果与我这里不同而显得不那么完美。
//                    如果你是追求完美的用户，请花点时间微调一下相应代码的参数即可，都使用中文逐条详细标注了，非常容易看懂，无论什么电脑都可以微调到完美显示。
//4.特效屏蔽：在右下角弹幕输入框上方官方提供了屏蔽礼物特效的功能，如想更简洁，请手动勾选，勾选一次即可永久记住选择，因官方已提供此功能所以本脚本并未添加此部分屏蔽代码。
//                    打开直播间偶尔会看到视频顶部显示一两条礼物特效信息是因为官方提供的屏蔽存在一定延迟。
//5.适用人群：本脚本的理念是极度简洁，尽量只显示直播与弹幕，只适合安心看直播的用户，并不适合喜欢做任务，抽奖，领礼物，刷礼物等用户，如果你感觉精简过度了，证明你的使用习惯不适合此脚本。
//                    使用此脚本后不存在任何特权用户，各种徽章，标牌，彩色弹幕，彩色背景等等展示特权的任何行为都被屏蔽，如果你本身就是特权用户，自然就不太适合此脚本。
//6.问题反馈：如遇问题，及时反馈，我尽快解决，但不要轻易否定脚本，此脚本上线两年，几万用户，足以说明在大多数用户那里完美稳定运行，且每次更新会测试到在我这里完美显示才上线。
//                    但我几乎只在英雄联盟板块进行测试，如果其他板块发现问题请反馈。大部分用户遇到的问题都是个别问题，并非整体问题，无论是什么原因导致的什么问题都可以反馈寻求帮助。
//                    脚本免费服务于大家的同时也希望大家共同参与一起完善脚本的每个细节，如果你觉得很好用，并没有任何问题需要反馈，或者你的问题已经得到解决，请收藏或好评。
//                    这可让更多用户发现它使用它，这也是我可以持续更新与优化它的唯一动力。
//7.自动更新：如果你更改过此脚本任何内容，设置里的自动更新可能失效，请重新开启，或定期手动检查更新。
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

(function() {
    var css = '{display:none !important;height:0 !important}'

//主站首页
    css += '.contact-help{display:none !important;}';//左侧联系客服
    css += '.elevator{display:none !important;}';//右侧控制栏
    //css += '#reportFirst2,.bili-grid:nth-child(3){display:none !important;}';//推广
    //css += '#reportFirst3{display:none !important;}';//赛事
    css += '#bili_live,.bili-grid:nth-child(6){display:none !important;}';//正在直播
    css += '#bili_douga,.bili-grid:nth-child(7){display:none !important;}';//动画
    //css += '#bili_anime,.bili-grid:nth-child(9){display:none !important;}';//番剧
    css += '#bili_guochuang,.bili-grid:nth-child(10){display:none !important;}';//国创
    css += '.bili-grid:nth-child(12){display:none !important;}';//综艺
    css += '#bili_manga,.bili-grid:nth-child(13){display:none !important;}';//漫画
    css += '#bili_music,.bili-grid:nth-child(14){display:none !important;}';//音乐
    css += '#bili_dance,.bili-grid:nth-child(15){display:none !important;}';//舞蹈
    css += '#bili_game,.bili-grid:nth-child(16){display:none !important;}';//游戏
    css += '#bili_knowledge,.bili-grid:nth-child(17){display:none !important;}';//知识
    css += '#bili_cheese,.bili-grid:nth-child(18){display:none !important;}';//课堂
    css += '#bili_tech,.bili-grid:nth-child(19){display:none !important;}';//科技
    css += '#bili_sports,.bili-grid:nth-child(20){display:none !important;}';//运动
    css += '#bili_car,.bili-grid:nth-child(21){display:none !important;}';//汽车
    css += '#bili_life,.bili-grid:nth-child(22){display:none !important;}';//生活
    css += '#bili_food,.bili-grid:nth-child(23){display:none !important;}';//美食
    css += '#bili_animal,.bili-grid:nth-child(24){display:none !important;}';//动物圈
    css += '#bili_kichiku,.bili-grid:nth-child(25){display:none !important;}';//鬼畜
    css += '#bili_fashion,.bili-grid:nth-child(26){display:none !important;}';//时尚
    css += '#bili_information,.bili-grid:nth-child(27){display:none !important;}';//资讯
    css += '#bili_ent,.bili-grid:nth-child(28){display:none !important;}';//娱乐
    css += '#bili_read,.bili-grid:nth-child(29){display:none !important;}';//专栏
    css += '#bili_movie,.bili-grid:nth-child(30){display:none !important;}';//电影
    css += '#bili_teleplay,.bili-grid:nth-child(31){display:none !important;}';//电视剧
    css += '#bili_cinephile,.bili-grid:nth-child(32){display:none !important;}';//影视
    css += '#bili_documentary,.bili-grid:nth-child(33){display:none !important;}';//纪录片
    css += '#bili_report_spe_rec{display:none !important;}';//特别推荐
    css += '.international-footer{display:none !important;}';//底部网站信息
//顶部导航栏
    css += '.nav-link-item:last-child,.download-entry{display:none !important;}';//顶部导航栏“下载APP”
    css += '.nav-user-center:last-child > div:last-child,.header-upload-entry{display:none !important;}';//顶部导航栏“投稿”
    css += '.red-point,.bp-red-point{display:none !important;}';//顶部导航栏“大会员”、“动态”红点
    css += '.msg-hinter{display:none !important;}';//顶部导航栏消息红点
    css += '.hinter,.list-item.p-relative:first-child > i.hinter.p-absolute.a-splashing:first-child{background-color: transparent !important;}';//顶部导航栏“签到”呼吸红点
    css += '.unlogin-popover,.unlogin-popover-avatar,.login-tip,.van-popper[x-placement^=bottom],.bili-header .login-panel-popover{display:none !important;}';//未登录弹框
    css += '.loc-moveclip{display:none !important;}';//顶部导航栏活动滚动“广告”
//动态首页
    css += '.most-viewed-panel{display:none !important;}';//关注动态列表
    //css += '.topic-panel{display:none !important;}';//右侧话题
    //css += '.notice-panell{display:none !important;}';//右侧上方公告
    //css += '.section-block{display:none !important;}';//中间上方动态发布
//搜索首页
    css += '.activity-list{display:none !important;}';//综合搜索结果顶部“广告”
    css += '.headline-live.clearfix:first-child,.live-user-wrap.clearfix:nth-child(2){display:none !important;}';//直播搜索结果“主播列表”
//视频播放页
    css += '#activity_vote,.reply-notice{display:none !important;}';//评论上方“广告”
    css += '.pay-bar{display:none !important;}';//右侧“开通大会员”
    css += '#right-bottom-banner{display:none !important;}';//右侧推荐视频底部广告
    css += '.bilibili-player-video-popup{display:none !important;}';//视频播放中“点赞”
    css += '.bilibili-player-dm-tip-wrap{display:none !important;}';//视频播放中“投票”
    css += '.bilibili-player-link-wrap{display:none !important;}';//视频播放中“视频链接”
    css += '.bilibili-player-video-inner{display:none !important;}';//视频播放中“打心”
    css += '.bilibili-player-electric-panel{display:none !important;}';//视频结束后的“充电鸣谢”
//直播首页
    //css += '#app > div:nth-child(6){display:none !important;}';//推荐直播
    css += '#app > div:nth-child(7){display:none !important;}';//颜值领域
    //css += '#app > div:nth-child(8){display:none !important;}';//推荐分区
    css += '#app > div:nth-child(9){display:none !important;}';//电台
    css += '#app > div:nth-child(10){display:none !important;}';//视频唱见
    css += '#app > div:nth-child(11){display:none !important;}';//单机游戏
    css += '#app > div:nth-child(12){display:none !important;}';//王者荣耀
    css += '#app > div:nth-child(13){display:none !important;}';//网游
    css += '#app > div:nth-child(14){display:none !important;}';//手游
    css += '#app > div:nth-child(15){display:none !important;}';//娱乐
    css += '#app > div:nth-child(16){display:none !important;}';//虚拟主播
    css += '.link-footer,.bili-footer:last-child{display:none !important;}';//底部网站信息
//直播分区
    css += '.all__special-area-recommend-list-ctnr{display:none !important;}';//全部直播专区推荐
    css += '.banner-ctn,.index_3iBR2QjH{display:none !important;}';//大分区头图“广告”
    css += '.index_30nM37F4,.index_87nLYour{height:80px !important;}';//小分区头图高度
//直播间
    css += '.room-bg,.webp{top: -16px !important;}';//直播间背景
    css += '.startlive-icon{display:none !important;}';//顶部导航栏“我要开播”
    css += '.avatar-btn{display:none !important;}';//右侧“直播姬”
    css += '.live-sidebar-ctnr,.side-bar-cntr,.side-bar-popup-cntr{display:none !important;}';//右侧工具栏
    css += '#sections-vm{display:none !important;}';//主播简介公告及动态
    css += '#link-footer-vm{display:none !important;}';//底部网站信息
    css += '.login-guide{display:none !important;}';//登录体验高画质提示框
//直播间标题栏
    css += '#head-info-vm{background-color:#E0FFFF !important;}';//标题栏背景
    css += '.hot-rank-wrap{display:none !important;}';//标题栏第一行热门
    css += '.hot-not-rank{display:none !important;}';//标题栏第一行热门榜
    css += '.activity-gather-entry{display:none !important;}';//标题栏第二行“PK榜”
    css += '.subscribe-notification{display:none !important;}';//标题栏第二行“为主播打Call”
//直播间视频区
    css += '.pk-container{display:none !important;}';//视频区“大乱斗”
    css += '.content.border-box{display:none !important;}';//视频区“恭喜主播获得超人气推荐奖励”
    //css += '#anchor-guest-box-id > iframe{display:none !important;}';//视频区“天选时刻”
    css += '#player-effect-vm > div > div.rhythm-storm{display:none !important;}';//视频区“节奏风暴”
    css += '.web-player-icon-roomStatus{display:none !important;}';//视频区右上角直播水印
    css += '.lead-up{display:none !important;}';//视频左上角“观看xx的更多视频”
    css += '#game-id{display:none !important;}';//视频右下角“玩法”
//直播间礼物栏
    css += '#gift-control-vm{display:none !important;}';//礼物道具栏背景
    css += '.gift-control-panel.f-clear.b-box.p-relative{display:none !important;}';//礼物道具栏“礼物”
//直播间弹幕区
    css += '#rank-list-vm{display:none !important;}';//弹幕区礼物榜背景
    css += '#rank-list-ctnr-box{display:none !important;}';//弹幕区顶部“礼物榜”
    css += '.chat-history-panel{height: calc(100% - 0px - 110px) !important;}';//弹幕区高度调整
    css += '#aside-area-vm{border-top-left-radius: 0px!important;border-top-right-radius: 0px !important;}';//弹幕框圆角改直角
    css += '.gift-item{display:none !important;}';//弹幕区投喂礼物信息
    css += '.penury-gift-msg{display:none !important;}';//弹幕区底部投喂礼物信息
    css += '.brush-prompt{display:none !important;}';//弹幕区底部其他人进入直播间信息
    css += '.important-prompt-item{display:none !important;}';//弹幕区底部自己进入直播间信息
    css += '.danmaku-buffer-prompt{bottom:110px !important;}';//弹幕区底部未读弹幕提醒位置调整
    css += '.with-penury-gift,.with-brush-prompt{height: -webkit-fill-available !important;}';//弹幕区弹幕上下位移固定
    css += '.guard-buy{display:none !important;}';//弹幕区续费提示
    css += '.danmaku-item{line-height: 0px !important;}';//弹幕行距
    css += '.top3-notice{display:none !important;}';//弹幕区“恭喜XX成为高能榜”
    css += '.common-danmuku-msg{display:none !important;}';//弹幕区“绝杀时刻”系统提示弹幕
    css += '.hot-rank-msg{display:none !important;}';//弹幕区“榜单”系统提示弹幕
    css += '.chat-history-list{font-size: 18px !important;}';//弹幕区字体大小
    css += '.danmaku-item{color: #000000 !important;}';//弹幕区字体颜色
    css += '.convention-msg{display:none !important;}';//弹幕区“系统提示”
    css += '.admin-icon{display:none !important;}';//弹幕区ID前“房管”徽章
    css += '.vip-icon{display:none !important;}';//弹幕区ID前“爷”徽章
    css += '.rank-icon{display:none !important;}';//弹幕区ID前“榜单”徽章
    css += '.title-label{display:none !important;}';//弹幕区ID前“活动头衔”徽章
    css += '.fans-medal-item-ctnr,.fans-medal-item-target{display:none !important;}';//弹幕区ID前“粉丝”徽章
    css += '.danmaku-item-left{display: block !important;}';//弹幕区ID与弹幕分两行显示
    css += '.user-name{font-size: 15px !important;}';//弹幕区ID大小
    css += '.user-name{color: #23ADE5 !important;}';//弹幕区ID颜色
    css += '.chat-colorful-bubble{margin: 0px 0 !important;}';//弹幕区特权弹幕行距
    css += '.chat-colorful-bubble{background: #00000000 !important;}';//弹幕区特权弹幕背景颜色
    css += '.new-video-pk-item-dm{display:none !important;}';//PK弹幕广告
//直播间弹幕输入区
    css += '#chat-control-panel-vm{background-color:#E0FFFF !important;}';//弹幕输入框背景
    //css += '.icon-right-part{display:none !important;}';//弹幕输入框“表情与醒目留言”
    css += '.super-chat{display:none !important;}';//弹幕输入框“醒目留言”
    css += '.emoticons-panel{left: -170px !important;}';//弹幕输入框“表情”位置
    css += '.emoticon-item.lock{display:none !important;}';//弹幕输入框表情内锁定的表情
    css += '.mask-pane-free{display:none !important;}';//弹幕输入框表情内“获得免费表情”提示
    css += '.emoticons-guide-panel.secondPos{display:none !important;}';//弹幕输入框表情提示
    css += '.medal-section{display:none !important;}';//弹幕输入框“粉丝徽章”
    css += '.chat-input{font-size: 15px !important;}';//弹幕输入框字体大小
    css += '.chat-input{padding: 8px 5px !important;}';//弹幕输入框位置调整
    css += '.chat-input{width: 245px !important;}';//弹幕输入框宽度调整
    css += '.chat-control-panel{height: 110px !important;}';//弹幕输入框高度
    css += '.input-limit-hint{top: 40px !important;right: 50px !important;}';//弹幕输入框字数限制位置
    css += '.bl-button--small{min-width: 48px !important;}';//弹幕输入框“发送”按钮宽度
    css += '.bl-button--small{height: 58px !important;}';//弹幕输入框“发送”按钮高度
    css += '.bl-button--small{top: -66px !important;right: 0px !important;}';//弹幕输入框“发送”按钮位置
    css += '.gift-block-toast{display:none !important;}';//弹幕输入框“关闭礼物特效”提醒
//专题活动直播间
    css += '.handle-bar,.handle-center,.sc-dlfnuX,.bPQznN,.light-tab{display:none !important;}';//标题栏上方相关直播间
    css += '.plat-section-space{padding: 124px 0px !important;}';//播放器位置调整
    css += '.t-background-image,.container-wrapper:nth-child(2){height: 895px !important;}';//专题活动背景
    css += '.plat-section-outter-box,.container-wrapper,.t-space-container,.plat-section-space{height: 0px !important;}';//专题活动板块
    css += '#webShare,.outerbox{display:none !important;}';//底部分享
    css += '.activity-navigator-list{display:none !important;}';//右侧活动导航

   loadStyle(css)
   function loadStyle(css) {
      var style = document.createElement('style')
      style.type = 'text/css'
      style.rel = 'stylesheet'
      style.appendChild(document.createTextNode(css))
      var head = document.getElementsByTagName('head')[0]
      head.appendChild(style);

   }
})();

//投稿视频自动网页全屏
    var 投稿网页全屏=document.getElementsByClassName('bpx-player-ctrl-web');
        window.onload =(function() {
        'use strict';
    var 投稿网页全屏_t=setInterval(function () {
        投稿网页全屏[0].click();
        clearInterval(投稿网页全屏_t );
            },300);

  }
)();

//番剧视频自动网页全屏
    var 番剧网页全屏=document.getElementsByClassName('squirtle-pagefullscreen-inactive');
        window.onload =(function() {
        'use strict';
    var 番剧网页全屏_t=setInterval(function () {
        番剧网页全屏[0].click();
        clearInterval(番剧网页全屏_t );
            },300);

  }
)();

//直播视频自动网页全屏
    (function () {
    'use strict';
    window.onload = () => {
    window.setTimeout(() => {
        const eve = new Event('mousemove');
        const livePlayer = document.querySelector('#live-player');
        livePlayer && livePlayer.dispatchEvent(eve);
        const fullScreenBtn = document.querySelector('.tip-wrap.svelte-1fgqxfc:nth-child(2) .icon');
        fullScreenBtn && fullScreenBtn.click();
            },3000);
   };
})();