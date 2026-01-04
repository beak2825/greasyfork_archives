// ==UserScript==
// @name 斗鱼 虎牙 免登陆看蓝光
// @description 免登陆看蓝光 弹幕微调 屏蔽广告
// @contributionURL
// @author allenmim
// @version 2022.2.10
// @match *://www.douyu.com/*
// @match *://www.huya.com/*
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/434964/%E6%96%97%E9%B1%BC%20%E8%99%8E%E7%89%99%20%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E8%93%9D%E5%85%89.user.js
// @updateURL https://update.greasyfork.org/scripts/434964/%E6%96%97%E9%B1%BC%20%E8%99%8E%E7%89%99%20%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E8%93%9D%E5%85%89.meta.js
// ==/UserScript==





//斗鱼虎牙免登陆看原画
(function() {
    'use strict';
    // Your code here...
    if(top.window.location.href.indexOf("douyu.com") > -1){
            var storage=window.localStorage;
            var recordTime = storage.getItem('rateRecordTime_h5p_room');
            var recordObj = JSON.parse(recordTime);
            console.log(recordObj);
            recordObj.v = -888888;
            recordTime = JSON.stringify(recordObj);
            storage.setItem('rateRecordTime_h5p_room',recordTime);
    }
    if(top.window.location.href.indexOf("huya.com") > -1){
            localStorage.setItem("loginTipsCount","v");
    }

})();





//douyuu
(function() {
    var css = '{display:none !important;height:0 !important}';

//全局
    //css += '.layout-Container:nth-child(7){height: 895px !important;background: #363636 !important;}';//直播间背景
 //  css += '.layout-Bottom{display:none !important;}';//视频底部“鱼吧/友邻”
 //   css += '.layout-Aside{display:none !important;}';//左侧导航栏
    css += '#js-room-activity{display:none !important;}';//右侧悬浮广告
    css += '.layout-Customize{display:none !important;}';//直播分区推荐
    css += '.multiBitRate-da4b60{display:none !important;}';//未登录弹框
//顶部导航栏
    css += '.Download-iconAdd{display:none !important;}';//顶部导航栏“小红点”
    css += '.DropPane-ad,.DropMenuList-ad{display:none !important}';//顶部导航栏“分类”“历史”“关注”菜单内底部广告
    css += '.Promotion-nobleRights{display:none !important;}';//顶部导航栏账户头像弹出菜单“开通贵族条幅”
    css += '.HeaderTask{display:none !important;}';//顶部导航栏账户头像弹出菜单“我的任务”
    css += '.HeaderNav{display:none !important;}';//顶部导航栏中间广告
 //   css += '.HeaderGif-left,.HeaderGif-right{display:none !important;}';//顶部导航栏两侧动画
    css += '.Search-ad{display:none !important;}';//顶部导航栏搜索框弹出菜单“底部广告”
    css += '.Search-default{display:none !important;}';//顶部导航栏搜索框弹出菜单“顶部推荐搜索”
    css += '.CloudGameLink-text{display:none !important;}';//顶部导航栏右侧用户头像弹出菜单“顶部广告”
//视频上方标题栏
 //   css += '.Title-anchorPic-bottom{display:none !important;}';//主播头像处“鱼吧”，“公告”
 //   css += '.Title-roomInfo{top: 17px !important;}';//标题栏文字位置
 //   css += '.Title-anchorHot{display:none !important;}';//标题栏第二排“福星得分”
 //   css += '.Title-official-wrap{display:none !important;}';//标题栏第二排“腾讯认证”
 //   css += '.Title-txAuthentication{display:none !important;}';//标题栏第二排“官方认证”
 //   css += '.Title-anchorLocation{display:none !important;}';//标题栏第二排“商品橱窗”
 //   css += '.Title-row:last-child{display:none !important;}';//标题栏第三排
//视频区
    css += '.FullPageFollowGuide{display:none !important;}';//视频内主播头像
 //   css += '.layout-Player-video{bottom:0px !important}';//网页全屏时视频高度修正
    css += '.adPic_4kxGCX .adPicRoot_4kxGCX,.closeBtn_4kxGCX{display:none !important;}';//视频区左侧广告
    css += '.GuessGameMiniPanelB-wrapper.is-show{display:none !important;}';//视频区下方横幅“鱼丸预测”
    css += '.shark-webp .LiveRoomDianzan-thumb{display:none !important;}';//视频区右下角“点赞”
    css += '.RedEnvelopAd-content{display:none !important;}';//视频区右下角弹出读秒广告
    css += '.adPicRoot_4kxGCX{display:none !important;}';//视频区左侧“火锅电竞”
    css += '.PcDiversion{display:none !important;}';//视频区画面卡顿提示弹窗
    css += '.FirstRechargePayPanel{display:none !important;}';//视频区弹出“首充礼包”
//    css += '.PlayerToolbar{display:none !important;}';//视频底部“礼物元素”
    css += '.ACTannual202109Tips{display:none !important;}';//视频底部“全员冲刺”
 //   css += '.layout-Player-toolbar{visibility:hidden !important;height: 0px !important;}';//视频底部“礼物栏”高度
 //   css += '.ChargeTask-normalDiv{display:none !important;}';//视频区左侧“亲密互动”样式一
 //   css += '.ChargeTask-closeBg{display:none !important;}';//视频区左侧“亲密互动”样式二
    css += '.InteractPlayWithPendant{display:none !important;}';//视频区左下角广告“滴滴上车”
    css += '.XinghaiAd-card{display:none !important;}';////视频区左下角游戏广告“影与剑”
    css += '.watermark-442a18{display:none !important;}';//视频区左下角“房间号水印”
 //   css += '.LiveRoomLoopVideo-thumb{display:none !important;}';//视频区右下角“播单”
    css += '.DiamondsFansPromptPop{display:none !important;}';//视频区中间“钻石会员”弹窗
//    css += '.PkView,.MorePk{display:none !important;}';//视频下方“PK横条”
//    css += '.index-common-1-rrh{display:none !important;}';//视频中“推塔结算”
 //   css += '#RandomPKBar-container > div.RandomPKBar-panel{display:none !important;}';//一起看板块视频下方“PK横条”
 //   css += '.wm-universal-pendant{display:none !important;}';//王者荣耀直播间视频区左上角“峡谷FUN肆玩”
    css += '#js-player-video > div.XinghaiAd:last-child > div.PicCard{display:none !important;}';//视频区左下角定时弹出的三秒展示“广告”
  //  css += '.afterDiv-4a4e04,.afterpic-8a2e13,.aftertext-0862a5{display:none !important;}';//视频区弹幕“火”后缀图标
 //   css += '.headpic-dda332,.vipIcon-6d2668{display:none !important;}';//视频区弹幕“盛典”前缀图标
    css += '.ActPayDialog{display:none !important;}';//视频区中间充值广告
//视频区未开播界面
    css += '.btnDiv2-e4408a{display:none !important;}';//视频下方“开播广告”
    css += '.recommendApp-0e23eb{display:none !important;}';//视频右下角客户端推广二维码
//右侧弹幕显示区
 //   css += '.layout-Player-rank{display:none !important}';//弹幕区顶部“周榜”
//    css += '.layout-Player-announce{display:none !important;}';//弹幕区顶部“主播投稿”，“直播回看”
//    css += '.layout-Player-barrage{top:0px !important;}';//弹幕区高度修正
 //   css += '.layout-Player-asideMain{top:-2px !important;}';//弹幕区位置调整
  //  css += '.YBCommunity-iconBox{display:none !important}';//弹幕区右侧停靠广告
  //  css += '.SignBaseComponent-sign-ad,.BarrageSuspendedBallAd-chat-ad-cls{display:none !important}';//弹幕区悬浮广告
  //  css += '.TreasureDetail{display:none !important;}';//弹幕区右下角掉落倒计时宝箱
    css += '.SysSign-Ad{display:none !important;}';//弹幕区右下角弹出广告
//    css += '.FirePowerChatModal-Notice{display:none !important;}';//弹幕区火力全开弹窗
    css += '.YBCommunity-iconBox{display:none !important;}';//弹幕区“斗嘴”
    css += '.shark-webp .PubgInfo-icon{display:none !important;}';//弹幕区右下“战绩统计”
 //   css += '.Baby{display:none !important;}';//弹幕区“英雄掌门”动画
    css += '.Barrage-userEnter,.Barrage-userEnter--default{display:none !important;}';//弹幕区自己进入直播间欢迎消息
//右侧弹幕输入区
 //   css += '.ChatNobleBarrage{display:none !important;}';//弹幕输入框上方“贵族弹幕”
 //   css += '.ChatFansBarrage{display:none !important;}';//弹幕输入框上方“粉丝弹幕”
//    css += '.Horn4Category{display:none !important;}';//弹幕输入框上方“分区喇叭”
 //   css += '.FansMedalPanel-enter{display:none !important;}';//弹幕输入框左侧“粉丝徽章”
 //   css += '.FansMedalPanel-container{display:none !important;}';//弹幕输入框左侧“粉丝徽章框体”
 //   css += '.MatchSystemMedalPanel-enter{display:none !important;}';//<英雄联盟赛事直播间>弹幕输入框左侧“粉丝徽章”
//    css += '.MatchSystemMedalPanel-container{display:none !important;}';//<英雄联盟赛事直播间>弹幕输入框左侧“粉丝徽章框体”
//    css += '.ChatSend-txt{padding: 5px 13px !important;}';//弹幕输入框位置调整
//    css += '.ChatSend-txt{width: 245px !important;}';//弹幕输入框宽度调整
//    css += '.MuteStatus,.is-noLogin{width: 270px !important;}';//登录提示框宽度调整
 //   css += '.ShieldTool-checkText{color: #888 !important;}';//弹幕输入框“屏蔽特效”文字颜色
    css += '.ChatSend-txt{font-size: 15px !important;}';//弹幕输入框内字体大小
    css += '.MatchSystem-FirstReceivePanel{display:none !important}';//弹幕输入框上方广告
    css += '.layout-Player-effect,.FollowGuide-FadeIn{display:none !important;}';//倒计时宝箱，“关注主播，转粉不迷路”
    css += '.FishShopTip{display:none !important;}';//XX正在去购买
//收藏的弹幕
//    css += '.ChatBarrageCollect-tip{background: #00000000 !important;}';//弹幕输入框“收藏的弹幕”背景色
 //   css += '.ChatBarrageCollect-tip{color: #888 !important;}';//弹幕输入框“收藏的弹幕”文字颜色
 //   css += '.ChatBarrageCollect-tip{right: 50px !important;}';//弹幕输入框“收藏的弹幕”左右移动
 //   css += '.ChatBarrageCollect-tip{bottom: 5px !important;}';//弹幕输入框“收藏的弹幕”上下移动
//右侧弹幕区内弹幕内容元素
 //   css += '.js-user-level{display:none !important;}';//等级徽章
//    css += '.FansMedalBox{display:none !important;}';//粉丝徽章
//    css += '.Motor{display:none !important;}';//单个字徽章
 //   css += '.Barrage-honor{display:none !important;}';//“日榜”徽章
 //   css += '.Barrage-noble{display:none !important;}';//“贵族”徽章
 //   css += '.ChatAchievement{display:none !important;}';//活动徽章
 //   css += '.MatchSystemTeamMedal{display:none !important;}';//ID前“比赛队伍”徽章
 //   css += '.FirePowerIcon{display:none !important;}';//火力全开弹幕后缀“火”徽章
 //   css += '.Barrage-roomVipIcon{display:none !important;}';//弹幕后缀“黄色心型”徽章
 //   css += '.Barrage-icon,.Barrage-icon--roomAdmin{display:none !important;}';//房管徽章
 //   css += '.is-admin{color: #2B94FF !important;}';//房管ID颜色
    css += '.Barrage-nickName{font-size: 12px !important;}';//ID大小
    css += '.Barrage-content{display: block !important;}';//ID与弹幕分两行显示
    css += '.Barrage-listItem{font-size: 20px !important;}';//弹幕大小
    css += '.Barrage-notice,.Barrage-icon--sys{display:none !important;}';//弹幕内容“主播开播提示”（可能会屏蔽所有系统消息，比如禁言消息）
    css += '.Barrage-topFloaterList{display:none !important;}';//弹幕区特权弹幕顶部悬停
    css += '.Barrage-roomVip--super,.Barrage-notice--noble{background-color: #262626 !important;}';//特权弹幕背景色
 //   css += '.Barrage-roomVip--super,.Barrage-notice--noble{border-top: 0px !important;border-bottom: 0px !important;}';//特权弹幕边框
 //   css += '.Barrage--paddedBarrage,.Barrage-roomVip--super,.Barrage-notice--noble{padding: 0px 10px !important;}';//特权弹幕底衬高度
    css += '.Barrage-content{color: #FF8C00 !important;}';//普通弹幕变黑色
    css += 'body .Barrage-content--color0, body .Barrage-content--color1, body .Barrage-content--color2, body .Barrage-content--color3, body .Barrage-content--color4, body .Barrage-content--color5 {color: #FF8C00 !important;}';//;彩色弹幕显示为黑色
    css += '.layout-Player-barrage{background: #283132 !important;}';//弹幕区背景颜色
    css += '.ChatSend-txt,.Chat{background: #255255255 !important;}';//弹幕输入框背景颜色
//关注页
    css += '.layout-Banner-item{display:none !important;}';//关注列表页上方两条横幅广告
    css += '.Prompt-container{display:none !important;}';//关注列表页左上方“领取火箭”
    css += '.layout-Module-extra{display:none !important;}';//关注列表页右上“主播视频/免费领取”
    css += '.ScrollTabFrame-title.active-tab{display:none !important;}';//关注列表页左上“我的关注”
  //  css += '.is-fixed{display:none !important;}';//关注页下拉后“顶部弹出工具栏”
//专题活动直播间
//    css += '.wm-general:nth-child(2){height: 918px !important;}';//专题头图
 //   css += '.wm-general:nth-child(3){height: 918px !important;}';//专题背景
 //   css += '.wm-view{display:none !important;}';//专题版块图片
  //  css += '.wm-general{top: 0px !important;height: 0px !important;}';//专题板块高度
 //   css += '.CustomFocusOfficialRoom-careMeWrap{display:none !important;}';//右侧关注我图标
    //css += '.wm_footer,#bc17{display:none !important;}';//底部网站信息

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

//自动切换最高画质，自动网页全屏
(function() {
    'use strict';
    let intID1 = setInterval(() => {
                if (document.getElementsByClassName("wfs-2a8e83").length > 0) {
                    clearInterval(intID1);
                    document.querySelector('div.wfs-2a8e83').click();//自动网页全屏
	                document.querySelectorAll(".tip-e3420a > ul > li")[0].click();//自动切换最高画质
                    document.querySelectorAll('.panelFill-8b4614')[0].click();//视频内屏蔽弹幕
                }
            }, 1000);

})();





//huyaa
(function () {
   var css = '{display:none !important;height:0 !important}'

//全局
    //css += '.main-wrap,.player-gift-wrap{background: #363636 !important;}';//直播间背景
    css += '#J_roomGgTop{display:none !important;}';//顶部横条广告
    css += '.box-crumb{display:none !important;}';//顶部工具栏下方导航
  //  css += '.room-footer{display:none !important;}';//视频底部“主播动态”
  //  css += '.sidebar-hide{display:none !important;}';//左侧导航栏
  //  css += '.helperbar--cpOuG7OGer2wWrNst9OwG{display:none !important;}';//右侧工具栏
  //  css += '#main_col > div.room-backToTop.j_room-backToTop:last-child{display:none !important;}';//右下角返回顶部按钮
    css += '#chatRoom > div.room-gg-chat:last-child{display:none !important;}';//右侧悬浮广告
    css += '#player-resource-wrap{display:none !important;}';//视频全屏后右侧悬浮广告
    css += '.gameBaby--1TqB-2bKlvKiPqShbulxqk{display:none !important;}';//分区页右上角“赚取银豆”
    css += '.game--2LXZJ66LKQaXtXkfAn5l6_{display:none !important;}';//分区页右上角“赢取百万银豆”
//主页
    css += '.ad-banner{display:none !important;}';//中间横幅广告
 //   css += '.list-adx{display:none !important;}';//分区头图
 //   css += '.liveList-header-r{display:none !important;}';//分区预告
 //   css += '.mod-index-recommend{background-image: none !important;}';//热门分类背景图
 //   css += '.mod-index-recommend{background: url() !important;}';//热门分类半透明背景
//顶部导航栏
    css += '.duya-header-ad{display:none !important;}';//顶部导航栏广告
    css += '.dot--g92BzaqFUtbPTJytM_job::after{display:none !important;}';//顶部导航栏“小红点”
    css += '#J_tt_hd_category_ad{display:none !important;}';//顶部导航栏分类下拉栏内底部广告
//视频上方标题栏
 //   css += '.open-souhu{display:none !important;}';//标题栏左侧“守护TA”
  //  css += '.tencent-identification{display:none !important;}';//标题栏左侧“腾讯认证”
    css += '.game--3vukE-yU-mjmYLSnLDfHYm img,.game--3vukE-yU-mjmYLSnLDfHYm span{display:none !important;}';//标题栏右侧广告
    css += '.jump-to-phone{display:none !important;}';//标题栏右侧“客户端看”
//视频区
    css += '.player-subscribe{display:none !important;}';//视频内主播头像
    css += '.gift-info-btn{display:none !important;}';//视频全屏后右侧“展开礼物”
    css += '.banner-ab-warp{display:none !important;}';//视频区左下角广告“火锅电竞”
    css += '.player-app-qrcode{display:none !important;}';//暂停上方二维码
    css += '#player-pc-watch-btn{display:none !important;height:0px !important}';//视频全屏后小窗播放按钮
   // css += '.player-gift-left{display:none !important;}';//视频底部礼物左
  //  css += '.week-star-0{display:none !important;}';//视频底部礼物栏周星榜
  //  css += '.player-face{display:none !important;}';//视频底部礼物栏中
  //  css += '.player-gift-right{display:none !important;}';//视频底部礼物栏右
    css += '#huya-ab > div.video-ab-warp{display:none !important;}';//主播手动播放的视频区左下角广告(声音未能屏蔽)
  //  css += '.gift-show-btn{display:none !important;}';//视频全屏后底部控制条“礼物种豆”
  //  css += '.room-player{height: 106% !important;}';//视频播放器高度修正（窗口模式有黑边但能对齐弹幕框）★★★需根据自己显示分辨率调整百分比大小来让视频界面与弹幕框对齐★★★
    //css += '.room-player-wrap{height: 106% !important;}';//视频播放器高度修正（窗口模式无黑边但不对齐弹幕框）★★★需根据自己显示分辨率调整百分比大小来让视频界面与弹幕框对齐★★★
    css += '#hy-watermark{display:none !important;}';//视频区左下角“房间号水印”
    css += '#player-mouse-event-wrap{display:none !important;}';//视频区活动广告
    css += '.player-subscribe-banner.subscribe{display:none !important;}';//视频区“点我订阅”弹幕
//右侧弹幕显示区
    css += '.room-profileNotice{display:none !important;}';//弹幕区顶部“公告”
    css += '#chat-room__list > div:first-child{display:none !important;}';//弹幕区顶部绿色系统提示消息
    css += '.chat-wrap-panel,.wrap-guide{display:none !important;}';//弹幕区顶部广告
 //   css += '.room-weeklyRankList,.msgOfKing_box{display:none !important;}';//弹幕区顶部“周榜”
 //   css += '#J_communityContainer{display:none !important;}';//弹幕区右下角“虎扯”
 //   css += '.diy-comp{display:none !important;}';//右侧弹幕区“扫码广告”
 //   css += '.msg-noble{display:none !important;}';//续费消息
    css += '.inner{display:none !important;}';//弹幕区顶部悬停特权弹幕
  //  css += '.msg-sys{display:none !important;}';//弹幕区带盐团进场消息
    css += '.msg-onTVLottery{display:none !important;}';//弹幕区“上电视”等特殊弹幕
 //   css += '.RoomMotorcadeActivity--3miihrli7CPyMyBfPZ25xx{display:none !important;}';//弹幕区顶部“发车时刻”
 //   css += '.GuardNotice--pvZ5AR_WlyAG54ynedwV8{display:none !important;}';//弹幕区守护升级消息
//右侧弹幕输入区
 //   css += '#J-room-chat-color{display:none !important;}';//弹幕输入框上方“彩色弹幕”
//    css += '.entry--k4pVN0eWZG2KcjYy1__ug{display:none !important;}';//弹幕输入框上方“梗”
 //   css += '.treasureChestContainer{display:none !important;}';//弹幕输入框上方“响应”
//    css += '.Ornament--3xeJpjFUFezcC_6FEhrq8W{display:none !important;}';//弹幕输入框上方“挂件”
 //   css += '#chatHostPic{display:none !important;}';//弹幕输入框左侧“粉丝徽章”
 //   css += '.chat-room__input{margin-left: 0px !important;}';//弹幕输入框位置调整
  //  css += '.ChatSpeaker--2lgjsxdm6dK5MZ-6kVGLtx textarea{font-size: 15px !important;}';//弹幕输入框内字体大小
//右侧弹幕区内弹幕内容元素
    css += '.chat-room__wrap{background: #283132 !important;}';//弹幕显示区背景颜色
    css += '.ChatSpeaker--2lgjsxdm6dK5MZ-6kVGLtx textarea{background: #255255255 !important;}';//弹幕输入框背景颜色
    css += '.chat-room__ft{background: #255255255 !important;}';//弹幕输入框外围背景颜色
 //   css += '.msg-normal-decorationPrefix,.msg-bubble-decorationPrefix,.support-webp-1{display:none !important;}';//ID前“粉丝”徽章
 //   css += '.msg-watchTogetherVip-decorationSuffix,.msg-bubble-decorationSuffix{display:none !important;}';//ID后“老友”徽章
 //   css += '.msg-normal-decorationSuffix img{display:none !important;}';//ID前“初体验”徽章
 //   css += '.msg-nobleSpeak-decorationSuffix img{display:none !important;}';//ID前“粉钻”徽章
 //   css += '.msg-nobleSpeak-decorationPrefix img{display:none !important;}';//ID前“爷+管”徽章
//    css += '.msg-nobleSpeak-decorationPrefix,.msg-watchTogetherVip-decorationPrefix{display:none !important;}';//ID前“徽章主播”
//    css += '.box-noble-level-1,.box-noble-level-2,.box-noble-level-3,.box-noble-level-4,.box-noble-level-5{position: unset !important;}';//贵族弹幕后缀“爵位”徽章
    css += '.box-noble-level-1,.box-noble-level-2,.box-noble-level-3,.box-noble-level-4,.box-noble-level-5{background-color: #262626 !important;}';//贵族弹幕“彩色背景”
 //   css += '.box-noble-level-1:after,.box-noble-level-2:after,.box-noble-level-3:after,.box-noble-level-4:after,.box-noble-level-5:after{display:none !important;}';//贵族弹幕背景图标
    css += '.msg-normal,.msg-nobleSpeak{font-size: 20px !important;}';//弹幕字体大小
    css += '.msg-watchTogetherVip,.msg-bubble{font-size: 20px !important;}';//特权弹幕字体大小
    css += '.msg{color: #FF8C00 !important;}';//彩色弹幕变黑色
    css += '.msg-watchTogetherVip,.msg-bubble{background: #262626 !important;}';//特权弹幕背景色
//    css += '.msg-watchTogetherVip:after,.msg-bubble-icon{display:none !important;}';//特权弹幕背景图标
    css += '.name{font-size: 12px !important;}';//ID大小
    css += '.msg{display: block !important;}';//ID与弹幕分两行显示
  //  css += '.name, .J_userMenu{color: #3C9CFE !important;}';//特权ID颜色
//专题活动直播间
    //css += '.main-room{background: #363636 !important;}';//专题背景
  //  css += '.match_body_wrap,.diy-comp,.J_comp_2,.special-bg{display:none !important;}';//专题板块

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




"use strict";

const SELECTOR = {
//  "www.douyu.com": {
//    on: "div[class^='showdanmu-']:not([class*='removed-'])",
//    off: "div[class^='hidedanmu-']:not([class*='removed-'])",
//  },
  "www.huya.com": {
    on: "div[id='player-danmu-btn'][title='关闭弹幕']",
    off: "div[id='player-danmu-btn'][title='开启弹幕']",
  },
//  "www.yy.com": {
//    on: "div[class~='yc__bullet-comments-btn'][title='关闭弹幕']",
//    off: "div[class~='yc__bullet-comments-btn'][title='打开弹幕']",
//  },
};
 
// Delay danmaku disabler for some sites (Default 10s)
const DELAY_TIME = 10000;
const DELAY_SITE = ["www.yy.com"];
 
const LIVE_SITE = document.location.hostname;
 
// Danmaku disabler
function disableDanmaku() {
  let button = document.querySelector(SELECTOR[LIVE_SITE].on);
 
  if (button) {
    button.click();
  }
  setTimeout(() => {
    if (document.querySelector(SELECTOR[LIVE_SITE].off) === null) {
      disableDanmaku();
    }
  }, 500);
}
 
// To fix the button is showing as OFF, but danmaku still appear
DELAY_SITE.includes(LIVE_SITE)
  ? setTimeout(disableDanmaku, DELAY_TIME)
  : disableDanmaku();




