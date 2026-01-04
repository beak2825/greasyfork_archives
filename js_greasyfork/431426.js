// ==UserScript==
// @name                                                                    斗鱼直播精简
// @namespace                                                                  G-uang
// @author            	                                                       Guang
// @version           	                                                    2022.10.24
// @description                                                   提供简洁的界面，只为安心看直播。
// @match            	                                                *://www.douyu.com/*
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/431426/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/431426/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
//---------------------------------------------------------------------部分用户可能遇到的问题-----------------------------------------------------------------------------------------------------------------------------
//1.登录帐号：所有的参数调节都是在已经登录帐号的前提下，虽有免登录功能，但登录帐号后在使用本脚本会更完美，且不登录帐号网站本身也会有功能限制。
//2.网页抖动：如果左侧黑色导航栏是展开状态请手动将其缩小，刷新网页后脚本会自动将其隐藏，可解决部分人的网页抖动问题。
//                    如果已隐藏左侧导航栏网页依旧抖动，请轻微调节浏览器的缩放比例即可解决。
//3.卡顿问题：打开直播间你可能会感觉加载比较慢，要过3-10秒后才会自动切换网页全屏并流畅播放，这是斗鱼本身的问题，关掉所有扩展也会如此，总显得不如虎牙流畅丝滑。
//                    在最新版本内核的浏览器上情况似乎有所好转。
//4.特效屏蔽：在右下角弹幕输入框上方官方提供了屏蔽礼物特效的功能，如想更简洁，请手动勾选，勾选一次即可永久记住选择，因官方已提供此功能所以本脚本并未添加此部分屏蔽代码。
//5.适用人群：本脚本的理念是极度简洁，尽量只显示直播与弹幕，只适合安心看直播的用户，并不适合喜欢做任务，抽奖，领礼物，刷礼物等用户，如果你感觉精简过度了，证明你的使用习惯不适合此脚本。
//                    使用此脚本后不存在任何特权用户，各种徽章，标牌，彩色弹幕，彩色背景等等展示特权的任何行为都被屏蔽，如果你本身就是特权用户，自然就不太适合此脚本。
//6.问题反馈：如遇问题，及时反馈，我尽快解决，但不要轻易否定脚本，此脚本上线两年，几万用户，足以说明在大多数用户那里完美稳定运行，且每次更新会测试到在我这里完美显示才上线。
//                    但我几乎只在英雄联盟板块进行测试，如果其他板块发现问题请反馈。大部分用户遇到的问题都是个别问题，并非整体问题，无论是什么原因导致的什么问题都可以反馈寻求帮助。
//                    脚本免费服务于大家的同时也希望大家共同参与一起完善脚本的每个细节，如果你觉得很好用，并没有任何问题需要反馈，或者你的问题已经得到解决，请收藏或好评。
//                    这可让更多用户发现它使用它，这也是我可以持续更新与优化它的唯一动力。
//7.自动更新：如果你更改过此脚本任何内容，设置里的自动更新可能失效，请重新开启，或定期手动检查更新。
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

(function() {
    var css = '{display:none !important;height:0 !important}';

//全局
    //css += '.layout-Container:nth-child(7){height: 895px !important;background: #363636 !important;}';//直播间背景
    css += '.layout-Bottom{display:none !important;}';//视频底部“鱼吧/友邻”
    css += '.layout-Aside{display:none !important;}';//左侧导航栏
    css += '#js-room-activity{display:none !important;}';//右侧悬浮广告
    css += '.layout-Customize{display:none !important;}';//直播分区推荐
    css += '.multiBitRate-da4b60{display:none !important;}';//未登录弹框
//顶部导航栏
    css += '.Download-iconAdd{display:none !important;}';//顶部导航栏“小红点”
    css += '.DropPane-ad,.DropMenuList-ad{display:none !important}';//顶部导航栏“分类”“历史”“关注”菜单内底部广告
    css += '.Promotion-nobleRights{display:none !important;}';//顶部导航栏账户头像弹出菜单“开通贵族条幅”
    css += '.HeaderTask{display:none !important;}';//顶部导航栏账户头像弹出菜单“我的任务”
    css += '.HeaderNav{display:none !important;}';//顶部导航栏中间广告
    css += '.HeaderGif-left,.HeaderGif-right{display:none !important;}';//顶部导航栏两侧动画
    css += '.Search-ad{display:none !important;}';//顶部导航栏搜索框弹出菜单“底部广告”
    css += '.Search-default{display:none !important;}';//顶部导航栏搜索框弹出菜单“顶部推荐搜索”
    css += '.CloudGameLink-text{display:none !important;}';//顶部导航栏右侧用户头像弹出菜单“顶部广告”
//视频上方标题栏
    css += '.Title-anchorPic-bottom{display:none !important;}';//主播头像处“鱼吧”，“公告”
    css += '.Title-roomInfo{top: 17px !important;}';//标题栏文字位置
    css += '.Title-anchorHot{display:none !important;}';//标题栏第二排“福星得分”
    css += '.Title-official-wrap{display:none !important;}';//标题栏第二排“腾讯认证”
    css += '.Title-txAuthentication{display:none !important;}';//标题栏第二排“官方认证”
    css += '.Title-anchorLocation{display:none !important;}';//标题栏第二排“商品橱窗”
    css += '.Title-row:last-child{display:none !important;}';//标题栏第三排
//视频区
    css += '.FullPageFollowGuide{display:none !important;}';//视频内主播头像
    css += '.layout-Player-video{bottom:0px !important}';//网页全屏时视频高度修正
    css += '.adPic_4kxGCX .adPicRoot_4kxGCX,.closeBtn_4kxGCX{display:none !important;}';//视频区左侧广告
    css += '.GuessGameMiniPanelB-wrapper.is-show{display:none !important;}';//视频区下方横幅“鱼丸预测”
    css += '.shark-webp .LiveRoomDianzan-thumb{display:none !important;}';//视频区右下角“点赞”
    css += '.RedEnvelopAd-content{display:none !important;}';//视频区右下角弹出读秒广告
    css += '.adPicRoot_4kxGCX{display:none !important;}';//视频区左侧“火锅电竞”
    css += '.PcDiversion{display:none !important;}';//视频区画面卡顿提示弹窗
    css += '.FirstRechargePayPanel{display:none !important;}';//视频区弹出“首充礼包”
    css += '.PlayerToolbar{display:none !important;}';//视频底部“礼物元素”
    css += '.ACTannual202109Tips{display:none !important;}';//视频底部“全员冲刺”
    css += '.layout-Player-toolbar{visibility:hidden !important;height: 0px !important;}';//视频底部“礼物栏”高度
    css += '.ChargeTask-normalDiv{display:none !important;}';//视频区左侧“亲密互动”样式一
    css += '.ChargeTask-closeBg{display:none !important;}';//视频区左侧“亲密互动”样式二
    css += '.InteractPlayWithPendant{display:none !important;}';//视频区左下角广告“滴滴上车”
    css += '.XinghaiAd-card{display:none !important;}';////视频区左下角游戏广告“影与剑”
    css += '.watermark-442a18{display:none !important;}';//视频区左下角“房间号水印”
    css += '.LiveRoomLoopVideo-thumb{display:none !important;}';//视频区右下角“播单”
    css += '.DiamondsFansPromptPop{display:none !important;}';//视频区中间“钻石会员”弹窗
    css += '.PkView,.MorePk{display:none !important;}';//视频下方“PK横条”
    css += '.index-common-1-rrh{display:none !important;}';//视频中“推塔结算”
    css += '#RandomPKBar-container > div.RandomPKBar-panel{display:none !important;}';//一起看板块视频下方“PK横条”
    css += '.wm-universal-pendant{display:none !important;}';//王者荣耀直播间视频区左上角“峡谷FUN肆玩”
    css += '#js-player-video > div.XinghaiAd:last-child > div.PicCard{display:none !important;}';//视频区左下角定时弹出的三秒展示“广告”
    css += '.afterDiv-4a4e04,.afterpic-8a2e13,.aftertext-0862a5{display:none !important;}';//视频区弹幕“火”后缀图标
    css += '.headpic-dda332,.vipIcon-6d2668{display:none !important;}';//视频区弹幕“盛典”前缀图标
    css += '.ActPayDialog{display:none !important;}';//视频区中间充值广告
    css += '.BlindBoxTaskProp{display:none !important;}';//视频区中间“潮玩券”
    css += '.SingleRecommandEntry{display:none !important;}';//视频区坐下主播带货广告
//视频区未开播界面
    css += '.btnDiv2-e4408a{display:none !important;}';//视频下方“开播广告”
    css += '.recommendApp-0e23eb{display:none !important;}';//视频右下角客户端推广二维码
//右侧弹幕显示区
    css += '.layout-Player-rank{display:none !important}';//弹幕区顶部“周榜”
    css += '.layout-Player-announce{display:none !important;}';//弹幕区顶部“主播投稿”，“直播回看”
    css += '.layout-Player-barrage{top:0px !important;}';//弹幕区高度修正
    css += '.layout-Player-asideMain{top:-2px !important;}';//弹幕区位置调整
    css += '.YBCommunity-iconBox{display:none !important}';//弹幕区右侧停靠广告
    css += '.SignBaseComponent-sign-ad,.BarrageSuspendedBallAd-chat-ad-cls{display:none !important}';//弹幕区悬浮广告
    css += '.TreasureDetail{display:none !important;}';//弹幕区右下角掉落倒计时宝箱
    css += '.SysSign-Ad{display:none !important;}';//弹幕区右下角弹出广告
    css += '.FirePowerChatModal-Notice{display:none !important;}';//弹幕区火力全开弹窗
    css += '.YBCommunity-iconBox{display:none !important;}';//弹幕区“斗嘴”
    css += '.shark-webp .PubgInfo-icon{display:none !important;}';//弹幕区右下“战绩统计”
    css += '.Baby{display:none !important;}';//弹幕区“英雄掌门”动画
    css += '.Barrage-userEnter,.Barrage-userEnter--default{display:none !important;}';//弹幕区自己进入直播间欢迎消息
//右侧弹幕输入区
    css += '.ChatNobleBarrage{display:none !important;}';//弹幕输入框上方“贵族弹幕”
    css += '.ChatFansBarrage{display:none !important;}';//弹幕输入框上方“粉丝弹幕”
    css += '.Horn4Category{display:none !important;}';//弹幕输入框上方“分区喇叭”
    css += '.FansMedalPanel-enter{display:none !important;}';//弹幕输入框左侧“粉丝徽章”
    css += '.FansMedalPanel-container{display:none !important;}';//弹幕输入框左侧“粉丝徽章框体”
    css += '.MatchSystemMedalPanel-enter{display:none !important;}';//<英雄联盟赛事直播间>弹幕输入框左侧“粉丝徽章”
    css += '.MatchSystemMedalPanel-container{display:none !important;}';//<英雄联盟赛事直播间>弹幕输入框左侧“粉丝徽章框体”
    css += '.ChatSend-txt{padding: 5px 13px !important;}';//弹幕输入框位置调整
    css += '.ChatSend-txt{width: 245px !important;}';//弹幕输入框宽度调整
    css += '.MuteStatus,.is-noLogin{width: 270px !important;}';//登录提示框宽度调整
    css += '.ShieldTool-checkText{color: #888 !important;}';//弹幕输入框“屏蔽特效”文字颜色
    css += '.ChatSend-txt{font-size: 15px !important;}';//弹幕输入框内字体大小
    css += '.MatchSystem-FirstReceivePanel{display:none !important}';//弹幕输入框上方广告
    css += '.layout-Player-effect,.FollowGuide-FadeIn{display:none !important;}';//倒计时宝箱，“关注主播，转粉不迷路”
    css += '.FishShopTip{display:none !important;}';//XX正在去购买
//收藏的弹幕
    css += '.ChatBarrageCollect-tip{background: #00000000 !important;}';//弹幕输入框“收藏的弹幕”背景色
    css += '.ChatBarrageCollect-tip{color: #888 !important;}';//弹幕输入框“收藏的弹幕”文字颜色
    css += '.ChatBarrageCollect-tip{right: 50px !important;}';//弹幕输入框“收藏的弹幕”左右移动
    css += '.ChatBarrageCollect-tip{bottom: 5px !important;}';//弹幕输入框“收藏的弹幕”上下移动
//右侧弹幕区内弹幕内容元素
    css += '.js-user-level{display:none !important;}';//等级徽章
    css += '.FansMedalBox{display:none !important;}';//粉丝徽章
    css += '.Motor{display:none !important;}';//单个字徽章
    css += '.Barrage-honor{display:none !important;}';//“日榜”徽章
    css += '.Barrage-noble{display:none !important;}';//“贵族”徽章
    css += '.ChatAchievement{display:none !important;}';//活动徽章
    css += '.UserGameDataMedal{display:none !important;}';//“段位”徽章
    css += '.MatchSystemTeamMedal{display:none !important;}';//ID前“比赛队伍”徽章
    css += '.FirePowerIcon{display:none !important;}';//火力全开弹幕后缀“火”徽章
    css += '.Barrage-roomVipIcon{display:none !important;}';//弹幕后缀“黄色心型”徽章
    css += '.Barrage-icon,.Barrage-icon--roomAdmin{display:none !important;}';//房管徽章
    css += '.is-admin{color: #2B94FF !important;}';//房管ID颜色
    css += '.Barrage-nickName{font-size: 15px !important;}';//ID大小
    css += '.Barrage-content{display: block !important;}';//ID与弹幕分两行显示
    css += '.Barrage-listItem{font-size: 18px !important;}';//弹幕大小
    css += '.Barrage-notice,.Barrage-icon--sys{display:none !important;}';//弹幕内容“主播开播提示”（可能会屏蔽所有系统消息，比如禁言消息）
    css += '.Barrage-topFloaterList{display:none !important;}';//弹幕区特权弹幕顶部悬停
    css += '.Barrage-roomVip--super,.Barrage-notice--noble{background-color: #00000000 !important;}';//特权弹幕背景色
    css += '.Barrage-roomVip--super,.Barrage-notice--noble{border-top: 0px !important;border-bottom: 0px !important;}';//特权弹幕边框
    css += '.Barrage--paddedBarrage,.Barrage-roomVip--super,.Barrage-notice--noble{padding: 0px 10px !important;}';//特权弹幕底衬高度
    css += '.Barrage-content{color: #000000 !important;}';//普通弹幕变黑色
    css += 'body .Barrage-content--color0, body .Barrage-content--color1, body .Barrage-content--color2, body .Barrage-content--color3, body .Barrage-content--color4, body .Barrage-content--color5 {color: #000000 !important;}';//;彩色弹幕显示为黑色
//关注页
    css += '.layout-Banner-item{display:none !important;}';//关注列表页上方两条横幅广告
    css += '.Prompt-container{display:none !important;}';//关注列表页左上方“领取火箭”
    css += '.layout-Module-extra{display:none !important;}';//关注列表页右上“主播视频/免费领取”
    css += '.ScrollTabFrame-title.active-tab{display:none !important;}';//关注列表页左上“我的关注”
    css += '.is-fixed{display:none !important;}';//关注页下拉后“顶部弹出工具栏”
//斗鱼专题活动直播间
   //css += '.layout-Main{padding-top:5px !important;width:1600px !important;max-width:1600px !important;}'; //统一视频窗口大小和顶部空隙
   css += '.wm_footer,#bc17,.wm-view{display:none !important;}';//隐藏底部网站信息
   css += '.bc-wrapper{height:100% !important; padding-top:0px !important;padding-bottom:0px !important;}'; //自动调整 .bc-wrapper 高度 (隐藏 .wm_footer 的容器 #bc259)

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

//自动网页全屏，自动最高画质，自动关闭弹幕
    //document.querySelector('label.layout-Player-asidetoggleButton').click();//无弹幕栏样式的网页全屏
    var 网页全屏=document.getElementsByClassName('wfs-2a8e83');
    //var 关闭弹幕=document.getElementsByClassName('showdanmu-42b0ac');
        window.onload =(function() {
            'use strict';
    var 网页全屏_t=setInterval(function () {
        网页全屏[0].click();
            clearInterval(网页全屏_t );
    var 最高画质=document.querySelector('div.tip-e3420a > ul > li').click();
                },1000);

    var 关闭弹幕_t=setInterval(function () {
        关闭弹幕[0].click();
            clearInterval(关闭弹幕_t );
                },3000);

  }
)();