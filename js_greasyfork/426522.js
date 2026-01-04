// ==UserScript==
// @name         斗鱼网页版夜间模式
// @namespace    JS初学小成果
// @version      1.99
// @description  protect your eyes
// @author       『邪王真眼』
// @include       *://*.douyu.com/*
// @grant        none
// @icon         https://www.douyu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/426522/%E6%96%97%E9%B1%BC%E7%BD%91%E9%A1%B5%E7%89%88%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/426522/%E6%96%97%E9%B1%BC%E7%BD%91%E9%A1%B5%E7%89%88%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        console.log("匹配成功");
    }


    /*
	暗一31,32,35
	底色35,36,39
	亮一47,49,53
    亮二52,53,57
	按钮55,56,60
    按钮二45,46,49
	*/
    //背景
    var color0 = "rgb(15,15,17)";
    //亮1
    var color1 = "rgb(31,32,35)";
    //亮2
    var color2 = "rgb(47,49,53)";
    //亮3
    var color3 = "rgb(63,66,71)";
    //亮4
    var color4 = "rgb(79,83,89)";
    //亮5
    var color5 = "rgb(95,100,107)";
    //亮6
    var color6 = "rgb(111,117,125)";
    //亮7
    var color7 = "rgb(127,134,143)";
    //亮8
    var color8 = "rgb(143,151,161)";
    //按钮1
    var colorBtn1 = "rgb(153,153,153)";
    //文字默认颜色
    var colorWords = "rgb(200,200,200)";

    var colorWords2 = "rgb(175,175,175)";
    //橘红色
    var colorJuHong = "#ff5d23";

    //改css
    var style = document.createElement("style");
    style.type = "text/css";
    //css数组
    var cssArr = new Array();
    //整个页面背景颜色:底色
    cssArr[0] = ".layout-Container{background-color:"+color0+"!important;}";
    //Barrage-content，默认弹幕颜色
    cssArr[1] = ".Barrage-content{color:"+colorWords +"!important;}";
    //Header-wrap，页面顶端导航条
    cssArr[2] = ".Header-wrap{border-bottom:0px!important;background-color:"+color2+"!important;}";
    //Title，直播间画面上部标题
    cssArr[3] = ".Title{background-color:"+color2+"!important;}";
    //.layout-Player-title ,.VideoEntry-tabItem:first-child:after ,.layout-Player-announce , .ChatTabContainer-titleWraper--tabLi 标题的白色边框
    cssArr[4] =".layout-Player-title ,.VideoEntry-tabItem:first-child:after ,.layout-Player-announce ,.ChatTabContainer-titleWraper--tabLi{border:0px!important;}";


    //直播间画面下面礼物栏
    cssArr[5] = ".layout-Player-toolbar{background-color:"+color2+"!important;}";

    //layout-Player-barrage，弹幕栏背景
    cssArr[6] = ".layout-Player-barrage{background-color:"+color1+"!important;}";
    //layout-Player-asideMain,输入框按钮一圈背景
    cssArr[7] = ".layout-Player-asideMain{background-color:"+color2+"!important;}";



    //■■■弹幕栏上两个按钮【锁屏】【清屏】■■■
    cssArr[96] = ".Barrage-toolbarClear, .Barrage-toolbarLock{background-color:"+color3+"!important;border:0px!important;}";
    //文字颜色（未选中）.Barrage-toolbarIcon, .Barrage-toolbarText
    cssArr[97] = ".Barrage-toolbarIcon, .Barrage-toolbarText{color:"+colorWords +"!important;}";
    //（选中）.Barrage-toolbarClear:hover ,.Barrage-toolbarLock:hover
    cssArr[98] = ".Barrage-toolbarClear:hover .Barrage-toolbarText,.Barrage-toolbarLock:hover .Barrage-toolbarText{color:"+colorJuHong+"!important;}";



    //layout-Player-announce ，主播投稿，直播回看
    cssArr[8] = ".layout-Player-announce {background-color:"+color2+"!important;}";


    //■■■【贡献日榜 贡献周榜 贵宾 粉丝团】■■■
    //贡献日榜，贡献周榜，粉丝团 ,贵宾下拉列表
    cssArr[9] = ".ChatTabContainer-conWraper ,.NobleRank ,.NobleRankTips{background:"+color2+"!important;}";
    // ChatTabContainer-titleWraper--tabLi，未选中
    cssArr[10] = ".ChatTabContainer-titleWraper--tabLi{background-color:"+color1+"!important;}";
    //.layout-Menu, .layout-Player-asideMain, .layout-Player-toolbar，超多边框 ,.Barrage弹幕栏下边框 ,.layout-Player-rank排行榜下的一个漏一小点的边框,
    //.ChatRank-rankWraper排行榜下一个大边框 ，.FansRankBottom粉丝团排行底下的大边框
    cssArr[11] = ".layout-Menu, .layout-Player-asideMain, .layout-Player-toolbar ,.Barrage ,.layout-Player-rank ,.ChatRank-rankWraper ,.FansRankBottom{border:0px!important;}";
    //FansRankInfo，“点击右侧查看超级粉丝团特权”背景 及 同位置背景
    cssArr[12] = ".FansRankInfo ,.ChatRankWeek-headerContent.is-active{background:"+color3+"!important;}";
    //.FansRankInfo-txt,“点击右侧查看超级粉丝团特权”文本，普通弹幕色
    cssArr[13] = ".FansRankInfo-txt{color:"+colorWords +"!important;}";
    //.ChatTabContainer-titleWraper--tabLi.is-active，选中的
    cssArr[14] = ".ChatTabContainer-titleWraper--tabLi.is-active{background:"+color2+"!important;}";
    //.ChatSend-txt，弹幕发送框
    cssArr[15] = ".ChatSend-txt{background:"+color2+"!important;border:1px solid "+color4+"!important;}";
    //.FansMedalPanel-container，粉丝牌和弹幕输入框之间的竖线
    cssArr[16] = ".FansMedalPanel-container{border-right:1px solid "+color4+"!important;}";


    //■■■【粉】【高】【滤】【管】四个按钮■■■
    //.ChatHigherBarrage-switcher，【高】，.BarrageFilter-fkbutton【滤】，.FansBarrageSwitcher.is-color00【粉】
    cssArr[17] = ".ChatHigherBarrage-switcher ,.BarrageFilter-fkbutton ,.FansBarrageSwitcher.is-color00{background:"+colorBtn1+"!important;}";
    //.FansBarrageSwitcher:before【粉】按钮里面的字,.ChatHigherBarrage-switcher:before【高】，.BarrageFilter-fkbutton .fkbutton-icon:before【滤】
    cssArr[18] = ".FansBarrageSwitcher:before ,.ChatHigherBarrage-switcher:before ,.BarrageFilter-fkbutton .fkbutton-icon:before{color:"+color2+"!important;font-weight:bold!important;}";
    //.ChatBarrageCollect .ChatBarrageCollect-tip【收藏的弹幕】
    cssArr[19] = ".ChatBarrageCollect .ChatBarrageCollect-tip{background:"+color4+"!important;}";
    //.ChatSend-txt，输入框里文字的颜色
    cssArr[20] = ".ChatSend-txt{color:"+colorWords+"!important;}";


    //■■■【输入框上方的菜单】■■■
    //1、表情
    //.EmotionTab-item,横向标签一格里的外圈
    cssArr[22] = ".EmotionTab-item ,.EmotionTab-arrow.is-right ,.EmotionTab-arrow.is-left ,.EmotionTab{background-color: "+color4+"!important;}";
    //.EmotionTab-img-wrap is-active,横向标签一格里的内圈
    cssArr[23] = ".EmotionTab-img-wrap.is-active, .EmotionTab-img-wrap:hover{background-color:"+color2+"!important;}";
    //.EmotionTab,横向标签取消边框
    cssArr[24] = ".EmotionTab{border:0px!important;}";
    //.EmotionList，大表情列表
    cssArr[25] = ".EmotionList{background-color:"+color4+"!important;}";
    //表情栏的滚动条按钮，搞不了，css选择器有重复的部分
    //cssArr[26] = ".EmotionList>div>div>div{background-color:black!important;}";
    //AssembleExpressHeader-head，标情框标题
    cssArr[26] = ".AssembleExpressHeader-head{background-color:"+color3+"!important;border:0px!important;color:"+colorWords+"!important;}";
    //AssembleExpressHeader  ,大表情栏边框
    cssArr[27] = ".AssembleExpressHeader{background-color:"+color4+"!important;border:0px!important;}";
    cssArr[28] = ".Emotion{background:"+color4+"!important;}";
    cssArr[29] = ".Divider{background:"+color5+"!important;}";
    //大表情被选中 背景
    cssArr[46] = ".EmotionList-item:hover{background:"+color2+"!important;}";
    //表情栏最底下的小箭头
    cssArr[30] = ".Emotion:after ,.Emotion:before{border-top:6px solid "+color4+"!important;}";

    //2、【粉】
    //下半部分 背景
    cssArr[47] = ".ChatFansBarragePop{background:"+color4+"!important;}";
    //"默认"文字，
    cssArr[48] = ".FansBarrageColor-item-txt ,.ChatFansBarragePop-txt{color:"+colorWords2+"!important;}";
    //取消中间的边框
    cssArr[49] = ".ChatFansBarragePop-describe{border:0px!important;}";

    //3、【高】
    //一堆文字
    cssArr[50] = ".HigherBarragePane-level ,.HigherBarrage-name ,.HigherBarrage-level{color:"+colorWords2+"!important;}";

    //4、【滤】
    //大背景
    cssArr[51] = ".FilterKeywords{background:"+color4+"!important;}";
    //大部分文字
    cssArr[52] = ".FilterKeywords h3 ,.FilterKeywords-intelligentText ,.FKContent-title ,.FKLiWrap-text{color:"+colorWords2+"!important;}";
    //“已开启”开关打开颜色
    cssArr[53] = ".FilterSwitchStatus-status.is-checked{color:rgb(251,123,38)!important;}";
    //,.FilterSwitchStatus-status,"未开启"颜色
    cssArr[54] = ".FilterSwitchStatus-status{color:"+colorWords2+";}";
    //屏蔽项.hover
    cssArr[55] = ".FKLiWrap:hover{background-color:"+color3+"!important;}";
    //圆形按钮
    cssArr[56] = ".FilterSwitchStatus-switch:after{width:18px!important;height:18px!important;left:18px!important;top:0px!important;}";
    cssArr[59] = ".FilterSwitchStatus-switch.is-checked:after{left:34px!important;}";
    //按钮槽
    cssArr[57] = ".FilterSwitchStatus-switch{background-color:"+color2+"!important;height:20px!important;}";
    cssArr[58] = ".FilterSwitchStatus-switch.is-checked{background-color:"+colorJuHong+"!important;}";
    //两条边框
    cssArr[60] = ".FilterKeywords-intelligentText ,.LevelFilterLimit{border-bottom:1px solid "+color5+"!important;}";
    //两个输入框
    cssArr[61] = ".FilterKeywords-edit-input, .LevelFilterLimit-input{border:1px solid "+colorWords2+"!important;background-color:"+color4+"!important;color:"+colorWords2+"!important}";
    //等级屏蔽滑动按钮
    cssArr[62] = ".LevelFilKeyTab{background-color:"+color4+"!important;border:1px solid "+colorJuHong+"!important;}";
    cssArr[63] = ".LevelFilKeyTab .tab.active{background-color:"+colorJuHong+"!important;}";
    //屏蔽特效
    cssArr[94] = ".ShieldTool-list{background:"+color3+"!important;border:0px!important;border-radius:10px}";
    //文字
    //未选中.ShieldTool-listItem
    cssArr[95] = ".ShieldTool-listItem{color:"+colorWords2+"!important}";
    //选中.ShieldTool-listItem.is-checked .ShieldTool-checkText




    //■■■.app，站内信■■■
    //背景
    cssArr[73] = ".main-right ,.main-left.main-left-small{background-color:"+color2+"!important;}";
    //文字
    cssArr[74] = ".motorcadeHeader-motorcadeName-3mPkv ,.cl-item-username.cl-item-username-small{color:"+colorWords2+"!important}";
    //边框
    cssArr[75] = ".main-left-header.main-left-header-small{border-bottom:1px solid "+colorWords2+"!important;}";
    cssArr[76] = ".cl-item-line{background-color:"+colorWords2+"!important;}";
    cssArr[77] = ".jumpBox-jumpBox-2BlGl{border-top:1px solid "+colorWords2+"!important;}";
    // PlayerToolbar-signCont，左下上下滚动圆角广告背景
    cssArr[31] = ".PlayerToolbar-signCont{background:"+color4+"!important;}";
    //左下上下滚动圆角广告链接字体,鱼丸，鱼翅
    cssArr[32] = ".PlayerToolbar-signCont a ,.PlayerToolbar-ywInfo span ,.PlayerToolbar-ycInfo span{color:"+colorWords+"!important;}";
    //标题处的一大堆文子（直播间标题，主播ID，友邻，工会，鱼粮，分享，客户端打开）
    cssArr[33] = ".Title-header ,.Title-anchorNameH2 ,.Title-anchorFriendWrapper span ,.SociatyLabel span ,.Title-sharkWeight span ,.TitleShare span ,.PhoneWatch.PhoneWatch-fl span{color:"+colorWords2+"!important;}";
    //Title-anchorText热度
    cssArr[34] = ".Title-anchorText{color:#00AA00}";


    //■■■右上【历史】【关注】【客户端】，svg左上角三个小三角,关注数,■■■//.Header-menu a
    cssArr[35] = ".public-DropMenu-link ,.Header-menu svg ,.Title-followNum ,.Header-menu-link>a{color:"+colorWords2+"!important;}";
    //项目标题，.DropPaneList>a:hover，选中项
    cssArr[67] = ".DropPaneList>a:hover{background-color:"+color4+"!important;}";
    //项目标题，
    cssArr[68] = ".DropPaneList.HistoryList .DropPaneList-title ,.DropPaneList span.DropPaneList-title{color:"+colorWords2+"!important;}";
    //.public-DropMenu-drop，客户端底下的小条
    cssArr[72] = ".public-DropMenu-drop{background-color:"+color2+"!important;}";
    //.Title-followBtnBox.is-followed .Title-followBtn，关注，特别关注按钮
    cssArr[21] = ".Title-followBtnBox.is-followed .Title-followBtn{background:"+color3+"!important;color:"+colorBtn1+"!important;}";


    //■■■【全部关注】【特别关注】■■■
    //加个边框,#cf4b1c橘红色
    cssArr[69] = ".Header-follow-tabs{border:1px solid #cf4b1c}";
    //白色背景颜色去掉
    cssArr[70] = ".Header-follow-tab{background-color:"+color2+"!important;color:"+colorWords2+"!important;}";
    //加个选中的橘红
    cssArr[71] = ".Header-follow-tab.is-active{background-color:#cf4b1c!important;color:white!important;}";
    //■■■【友邻】■■■
    //"主播的友邻"文字
    cssArr[36] = ".AnchorFriendPane-title h3{color:"+colorWords2+"!important;}";
    //AnchorLike-ItemBox 友邻背景和边框
    cssArr[37] = ".AnchorLike-ItemBox{border:1px solid "+color4+";background-color:"+color2+";}";
    cssArr[38] = ".AnchorFriendPane-title{border-bottom:1px solid "+color4+"!important;}";
    //友邻的ID
    cssArr[39] = ".AnchorFriend-list h3{color:"+colorWords2+"!important;}";
     //"查看全部"的背景
    cssArr[88] = ".AnchorFriend-footer a{border-top:1px solid "+color4+";background-color:"+color2+";color:"+colorWords2+";}";
    //"查看全部"的背景 hover
    cssArr[89] = ".AnchorFriend-footer a:hover{background-color:"+color3+";}";
    //"查看全部"上的边框
    cssArr[90] = ".AnchorFriend-footer{border:0px}";
    //■■■【主播投稿】【直播回看】■■■
    cssArr[40] = ".VideoEntry span{color:"+colorWords2+"!important;}";
    //1、主播投稿 背景 顶部边框
    cssArr[41] = ".VideoEntry-list{border:0px!important;background-color:"+color2+"!important;}";
    //项目横边框
    cssArr[42] = ".VideoAnchorItem{border:0px!important;}";
    //选中项的背景
    cssArr[43] = ".VideoAnchorItem:hover{background-color:"+color4+"!important;}";
    //项目标题
    cssArr[44] = ".VideoAnchorItem-title{color:"+colorWords2+"!important;}";
    //直播回看 时间轴
    cssArr[45] = ".VideoEntry-replaylist{border-left:1px solid "+colorWords2+"!important;}";
    //■■■【分类】【视频】【游戏】下拉菜单■■■
    cssArr[64] = ".public-DropMenu-drop-main{background-color:"+color2+"!important;}";
    //文字
    cssArr[65] = ".DropMenuList-name{color:"+colorWords2+";}";
    cssArr[66] = ".DropMenuList-linkAll{color:white!important;}";


    //■■■鱼吧■■■
    //背景
    cssArr[78] = ".index-leftList-2_7bf{background-color:"+color2+";padding:20px;}";
    //背景-帖子
    cssArr[79] = ".wb_card-wbCardWrap-22KrE{background-color:"+color3+";border:0px solid "+colorWords2+";border-radius:10px;padding:10px;margin:10px;}";
    cssArr[80] = ".wb_card-wbCardDetail-1wzCV{background-color:"+color3+";border-radius:10px;padding:0px;}";
    //文字-帖子用户名
    cssArr[83] = ".wb_card-wbInfo-19JiQ span{color:"+colorJuHong+"}";
    //文字-帖子内容
    cssArr[85] = ".wb_card-wbText-2fk2Y{color:"+colorWords2+"}";
    //帖子按钮
    cssArr[86] = ".wb_handle-wbRowLine-3OXI6 li{background:"+color2+";}";
    cssArr[87] = ".wb_handle-line-2DSIn{color:"+colorWords2+"}";
    //背景-投票
    cssArr[81] = ".style-newvoteTopwrapper-3PgJY{background-color:"+color2+";}";
    cssArr[82] = ".style-optionWrapper-2FhfD{background-color:"+color3+";}";
    //边框
    cssArr[84] = ".wb_card-topListItemBox-1ui_g{border:0px;}";


    //■■■斗鱼云游戏■■■
    //边框
    cssArr[91] = ".cloudGameSection{border:1px solid "+color4+"!important;background-color:"+color2+";}";
    cssArr[92] = ".cloudGameSection-title{border-bottom:1px solid "+color4+"!important;}";
    //文字
    cssArr[93] = ".cloudGameSection-title ,.cloudGameSection-gameName{color:"+colorWords2+"!important}";

    //■■■弹幕栏置顶弹幕■■■
    cssArr[99] = ".Barrage-listItem--floatingFansBadgeBg{background:"+color4+"!important;}";

    /*
    弹幕栏置顶弹幕三层
Barrage-topFloaterList
	Barrage-listItem js-floating-barrage js-fansfloating-barrage Barrage-listItem--floatingFansBadgeBg
		js-fansfloating-barragecont Barrage--paddedBarrage

    	从Barrage-listItem可以得到和背景相关的属性，是个图片
        background: url(https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/fans-barrage-floating-bg_48917b3.png) 0 0 repeat;

    */


    //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■=
    //整合所有css文本
    var cssAll = "";
    for(var i=0;i<cssArr.length;i++){
        cssAll = cssAll+cssArr[i];
    }

    var text = document.createTextNode(cssAll);
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    //单独设置body颜色
    document.getElementsByTagName("body")[0].style.backgroundColor = color0;
    /*
    var b = document.getElementsByTagName("body")
    console.log(b.lehgth);
    */
    document.getElementsByTagName("html")[0].style.backgroundColor = color0;
    //表情栏的滚动条按钮
    //document.getElementsByClassName("EmotionList")[0].children[0].children[2].children[0].style.backgroundColor = "gold";






})();