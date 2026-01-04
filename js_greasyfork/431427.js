// ==UserScript==
// @name                                                                    虎牙直播精简
// @namespace                                                                  G-uang
// @author                                                                     Guang
// @version                                                                  2022.12.21
// @description                                                    提供简洁的界面，只为安心看直播。
// @match                                                                *://www.huya.com/*
// @downloadURL https://update.greasyfork.org/scripts/431427/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/431427/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.meta.js
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

(function () {
   var css = '{display:none !important;height:0 !important}'

//全局
    //css += '.main-wrap,.player-gift-wrap{background: #363636 !important;}';//直播间背景
    css += '#J_roomGgTop{display:none !important;}';//顶部横条广告
    css += '.box-crumb{display:none !important;}';//顶部工具栏下方导航
    css += '.room-footer{display:none !important;}';//视频底部“主播动态”
    css += '.sidebar-hide{display:none !important;}';//左侧导航栏
    css += '.helperbar--cpOuG7OGer2wWrNst9OwG{display:none !important;}';//右侧工具栏
    css += '#main_col > div.room-backToTop.j_room-backToTop:last-child{display:none !important;}';//右下角返回顶部按钮
    css += '#chatRoom > div.room-gg-chat:last-child{display:none !important;}';//右侧悬浮广告
    css += '#player-resource-wrap{display:none !important;}';//视频全屏后右侧悬浮广告
    css += '.gameBaby--1TqB-2bKlvKiPqShbulxqk{display:none !important;}';//分区页右上角“赚取银豆”
    css += '.game--2LXZJ66LKQaXtXkfAn5l6_{display:none !important;}';//分区页右上角“赢取百万银豆”
    css += '#player-login-guide-tip,.LoginBd--1CdcbB8Yn5UQkgoU4sCunn{display:none !important;}';//登陆提示
//主页
    css += '.ad-banner{display:none !important;}';//中间横幅广告
    css += '.list-adx{display:none !important;}';//分区头图
    css += '.liveList-header-r{display:none !important;}';//分区预告
    css += '.mod-index-recommend{background-image: none !important;}';//热门分类背景图
    css += '.mod-index-recommend{background: url() !important;}';//热门分类半透明背景
//顶部导航栏
    css += '.duya-header-ad{display:none !important;}';//顶部导航栏广告
    css += '.dot--g92BzaqFUtbPTJytM_job::after{display:none !important;}';//顶部导航栏“小红点”
    css += '#J_tt_hd_category_ad{display:none !important;}';//顶部导航栏分类下拉栏内底部广告
    css += '.hy-nav-item-youliao{display:none !important;}';//顶部导航栏“有料视频”
//视频上方标题栏
    css += '.open-souhu{display:none !important;}';//标题栏左侧“守护TA”
    css += '.tencent-identification{display:none !important;}';//标题栏左侧“腾讯认证”
    css += '.game--3vukE-yU-mjmYLSnLDfHYm img,.game--3vukE-yU-mjmYLSnLDfHYm span{display:none !important;}';//标题栏右侧广告
    css += '.jump-to-phone{display:none !important;}';//标题栏右侧“客户端看”
//视频区
    css += '.player-subscribe{display:none !important;}';//视频内主播头像
    css += '.gift-info-btn{display:none !important;}';//视频全屏后右侧“展开礼物”
    css += '.banner-ab-warp{display:none !important;}';//视频区左下角广告“火锅电竞”
    css += '.player-app-qrcode{display:none !important;}';//暂停上方二维码
    css += '.player-gift-left{display:none !important;}';//视频底部礼物左
    css += '.week-star-0{display:none !important;}';//视频底部礼物栏周星榜
    css += '.player-face{display:none !important;}';//视频底部礼物栏中
    css += '.player-gift-right,#diy-pet-icon{display:none !important;}';//视频底部礼物栏右
    css += '#huya-ab > div.video-ab-warp{display:none !important;}';//主播手动播放的视频区左下角广告(声音未能屏蔽)
    css += '.gift-show-btn{display:none !important;}';//视频全屏后底部控制条“礼物种豆”
    css += '.room-player{height: 106% !important;}';//视频播放器高度修正（窗口模式有黑边但能对齐弹幕框）★★★需根据自己显示分辨率调整百分比大小来让视频界面与弹幕框对齐★★★
    //css += '.room-player-wrap{height: 106% !important;}';//视频播放器高度修正（窗口模式无黑边但不对齐弹幕框）★★★需根据自己显示分辨率调整百分比大小来让视频界面与弹幕框对齐★★★
    css += '#hy-watermark{display:none !important;}';//视频区左下角“房间号水印”
    css += '#player-mouse-event-wrap{display:none !important;}';//视频区活动广告
    css += '.player-subscribe-banner.subscribe{display:none !important;}';//视频区“点我订阅”弹幕
    css += '#player-login-tip{display:none !important;}';//视频区未登录弹出框
    css += '#player-download-guide-tip{display:none !important;}';//视频底部下载app提示
    css += '.popup-444af481{display:none !important;}';//视频底部“进入领地”
//右侧弹幕显示区
    css += '.room-profileNotice{display:none !important;}';//弹幕区顶部“公告”
    css += '#chat-room__list > div:first-child{display:none !important;}';//弹幕区顶部绿色系统提示消息
    css += '.chat-wrap-panel,.wrap-guide{display:none !important;}';//弹幕区顶部广告
    css += '.room-weeklyRankList,.msgOfKing_box{display:none !important;}';//弹幕区顶部“周榜”
    css += '#J_communityContainer{display:none !important;}';//弹幕区右下角“虎扯”
    css += '.diy-comp{display:none !important;}';//右侧弹幕区“扫码广告”
    css += '.msg-noble{display:none !important;}';//续费消息
    css += '.inner{display:none !important;}';//弹幕区顶部悬停特权弹幕
    css += '.msg-sys{display:none !important;}';//弹幕区带盐团进场消息
    css += '.msg-onTVLottery{display:none !important;}';//弹幕区“上电视”等特殊弹幕
    css += '.RoomMotorcadeActivity--3miihrli7CPyMyBfPZ25xx{display:none !important;}';//弹幕区顶部“发车时刻”
    css += '.GuardNotice--pvZ5AR_WlyAG54ynedwV8{display:none !important;}';//弹幕区守护升级消息
//右侧弹幕输入区
    //css += '#J-room-chat-color{display:none !important;}';//弹幕输入框上方“彩色弹幕”
    css += '.room-chat-tool.RoomMemePanel--1-Uraz9-spzxKdxRf7sxyB:last-child{display:none !important;}';//弹幕输入框上方“梗”
    css += '.treasureChestContainer{display:none !important;}';//弹幕输入框上方“响应”
    css += '.room-chat-tool.RoomOrnament--3B5lks_O6EGMcAYqTm-YUu:nth-child(5){display:none !important;}';//弹幕输入框上方“挂件”
    css += '#chatHostPic{display:none !important;}';//弹幕输入框左侧“粉丝徽章”
    css += '.chat-room__input{margin-left: 0px !important;}';//弹幕输入框位置调整
    css += '.ChatSpeaker--2lgjsxdm6dK5MZ-6kVGLtx textarea{font-size: 15px !important;}';//弹幕输入框内字体大小
//右侧弹幕区内弹幕内容元素
    css += '.msg-normal-decorationPrefix,.msg-bubble-decorationPrefix,.support-webp-1{display:none !important;}';//ID前“粉丝”徽章
    css += '.msg-watchTogetherVip-decorationSuffix,.msg-bubble-decorationSuffix{display:none !important;}';//ID后“老友”徽章
    css += '.msg-normal-decorationSuffix img{display:none !important;}';//ID前“初体验”徽章
    css += '.msg-nobleSpeak-decorationSuffix img{display:none !important;}';//ID前“粉钻”徽章
    css += '.msg-nobleSpeak-decorationPrefix img{display:none !important;}';//ID前“爷+管”徽章
    css += '.msg-nobleSpeak-decorationPrefix,.msg-watchTogetherVip-decorationPrefix{display:none !important;}';//ID前“徽章主播”
    css += '.box-noble-level-1,.box-noble-level-2,.box-noble-level-3,.box-noble-level-4,.box-noble-level-5{position: unset !important;}';//贵族弹幕后缀“爵位”徽章
    css += '.box-noble-level-1,.box-noble-level-2,.box-noble-level-3,.box-noble-level-4,.box-noble-level-5{background-color: #00000000 !important;}';//贵族弹幕“彩色背景”
    css += '.box-noble-level-1:after,.box-noble-level-2:after,.box-noble-level-3:after,.box-noble-level-4:after,.box-noble-level-5:after{display:none !important;}';//贵族弹幕背景图标
    css += '.msg-normal,.msg-nobleSpeak{font-size: 18px !important;}';//弹幕字体大小
    css += '.msg-watchTogetherVip,.msg-bubble{font-size: 18px !important;}';//特权弹幕字体大小
    css += '.msg{color: #000000 !important;}';//彩色弹幕变黑色
    css += '.msg-watchTogetherVip,.msg-bubble{background: #00000000 !important;}';//特权弹幕背景色
    css += '.msg-watchTogetherVip:after,.msg-bubble-icon{display:none !important;}';//特权弹幕背景图标
    css += '.name{font-size: 15px !important;}';//ID大小
    css += '.msg{display: block !important;}';//ID与弹幕分两行显示
    css += '.name, .J_userMenu{color: #3C9CFE !important;}';//特权ID颜色
//专题活动直播间
    //css += '.main-room{background: #363636 !important;}';//专题背景
    css += '.match_body_wrap,.diy-comp,.J_comp_2,.special-bg{display:none !important;}';//专题板块

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

//自动网页全屏，自动最高画质
    var 网页全屏=document.getElementsByClassName('player-fullpage-btn');
        window.onload =(function() {
            'use strict';
    var 网页全屏_t=setInterval(function () {
        网页全屏[0].click();
    var 最高画质=document.querySelector('div.player-videoline-videotype > ul > li').click();
            clearInterval(网页全屏_t );
                },3000);

  }
)();