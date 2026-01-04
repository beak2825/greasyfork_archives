// ==UserScript==
// @name                                                                 斗鱼直播精简自用(兼容DouyuEx)
// @namespace                                                                  https://axutongxue.com/
// @author            	                                                       阿虚同学
// @version           	                                                       1.0
// @description                                                   提供简洁的界面，再兼容DouyuEx获得更强大的功能
// @match            	                                                *://www.douyu.com/*
// @run-at document-body
// @license                                                        MPL License
// @downloadURL https://update.greasyfork.org/scripts/461735/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E8%87%AA%E7%94%A8%28%E5%85%BC%E5%AE%B9DouyuEx%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461735/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E8%87%AA%E7%94%A8%28%E5%85%BC%E5%AE%B9DouyuEx%29.meta.js
// ==/UserScript==
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
    css += '#bc4{display:none !important;}';
//视频区
    css += '.ToolbarActivityArea{display:none !important;}';//视频底部“礼物元素”一
    css += '.PlayerToolbar-GiftWrap{display:none !important;}';//视频底部“礼物元素”二
    css += '.PlayerToolbar-couponInfo{display:none !important;}';//福利券
    css += '.layout-Player-toolbar{height: 0px !important;}';//视频底部“礼物栏”高度
    css += '.layout-Player-video{bottom:0px !important}';//网页全屏时视频高度修正
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
    css += '.afterDiv-4a4e04,.afterpic-8a2e13,.aftertext-0862a5,.afterpic-f864c2{display:none !important;}';//视频区弹幕“火”后缀图标
    css += '.headpic-dda332,.vipIcon-6d2668{display:none !important;}';//视频区弹幕“盛典”前缀图标
    css += '.ActPayDialog{display:none !important;}';//视频区中间充值广告
    css += '.BlindBoxTaskProp{display:none !important;}';//视频区中间“潮玩券”
    css += '.SingleRecommandEntry{display:none !important;}';//视频区坐下主播带货广告
    css += '.FullPageFollowGuide{display:none !important;}';//视频内主播头像
    css += '.adPic_4kxGCX .adPicRoot_4kxGCX,.closeBtn_4kxGCX{display:none !important;}';//视频区左侧广告
    css += '.GuessGameMiniPanelB-wrapper.is-show{display:none !important;}';//视频区下方横幅“鱼丸预测”
    css += '.shark-webp .LiveRoomDianzan-thumb{display:none !important;}';//视频区右下角“点赞”
    css += '.RedEnvelopAd-content{display:none !important;}';//视频区右下角弹出读秒广告
    css += '.adPicRoot_4kxGCX{display:none !important;}';//视频区左侧“火锅电竞”
    css += '.PcDiversion{display:none !important;}';//视频区画面卡顿提示弹窗
    css += '.FirstRechargePayPanel{display:none !important;}';//视频区弹出“首充礼包”
    css += '.ACTannual202109Tips{display:none !important;}';//视频底部“全员冲刺”
//视频区未开播界面
    css += '.btnDiv2-e4408a{display:none !important;}';//视频下方“开播广告”
    css += '.recommendApp-0e23eb{display:none !important;}';//视频右下角客户端推广二维码
//右侧弹幕显示区
    css += '.layout-Player-rank{display:none !important}';//弹幕区顶部“周榜”
    css += '.layout-Player-announce{display:none !important;}';//弹幕区顶部“主播投稿”，“直播回看”
    css += '.layout-Player-barrage{top:0px !important;}';//弹幕区高度修正
    css += '.layout-Player-asideMain{top:-50px !important;}';//弹幕区位置调整
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
    css += '.Horn4Category{display:none !important;}';//弹幕输入框上方“分区喇叭”
    css += '.MatchSystemMedalPanel-enter{display:none !important;}';//<英雄联盟赛事直播间>弹幕输入框左侧“粉丝徽章”
    css += '.MatchSystemMedalPanel-container{display:none !important;}';//<英雄联盟赛事直播间>弹幕输入框左侧“粉丝徽章框体”
    css += '.MatchSystem-FirstReceivePanel{display:none !important}';//弹幕输入框上方广告
    css += '.layout-Player-effect,.FollowGuide-FadeIn{display:none !important;}';//倒计时宝箱，“关注主播，转粉不迷路”
    css += '.ShieldTool-checkText{color: #888 !important;}';//弹幕输入框“屏蔽特效”文字颜色
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
//专题活动直播间
    css += '.wm-general:nth-child(2){height: 0px !important;}';//专题头图
    css += '.wm-general:nth-child(3){height: 0px !important;}';//专题背景
    css += '.wm-view{display:none !important;}';//专题版块图片
    css += '.wm-general{top: -108px !important;height: 0px !important;}';//专题板块高度
    css += '.CustomFocusOfficialRoom-careMeWrap{display:none !important;}';//右侧关注我图标
    css += '.ToTopBtn{display:none !important;}';//右侧返回顶部
    css += '.wm-general-bgblur{display:none !important;}';//标题栏防遮挡
    css += '.wm_footer,#bc17{display:none !important;}';//底部网站信息

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