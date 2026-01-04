// ==UserScript==
// @name         斗鱼（ClearAds）【去广告&&内容精简】
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  1、去除广告  2、内容精简  3、主题色=>默认夜晚黑/少女粉/天空蓝/极致黑 4、防刷屏（屏蔽刷屏消息） 5、自动网页全屏 6、自动关闭弹幕 7、自动选择最高画质 8、自动佩戴粉丝牌
// @author       Ginyang
// @match        *://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470752/%E6%96%97%E9%B1%BC%EF%BC%88ClearAds%EF%BC%89%E3%80%90%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%86%85%E5%AE%B9%E7%B2%BE%E7%AE%80%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470752/%E6%96%97%E9%B1%BC%EF%BC%88ClearAds%EF%BC%89%E3%80%90%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%86%85%E5%AE%B9%E7%B2%BE%E7%AE%80%E3%80%91.meta.js
// ==/UserScript==

/************************* v1.2.6 更新内容*************************
 *
1、【优化】优化了主题色的各个细节（包含页面主滚动条）
2、【新增】主题色新增边框阴影选项，点击主题色右侧箭头查看选项
3、【优化】自动网页全屏 合并了 快速响应 与 增强
4、【新增】新增-直播间-自动关闭弹幕
5、【新增】新增-直播间-自动选择最高画质
6、【新增】键盘功能增强
        按键   	作用
        Enter	聚焦直播间聊天输入框
        Esc	    取消聊天输入框聚焦、退出网页全屏、退出全屏
        W	    开/关 网页全屏
        F	    开/关 全屏
        R	    重新加载直播
        D	    开/关 弹幕
        M	    静音/取消静音
        S	    打开插件设置（主要是在网页全屏时快速打开设置
7、【修复】修复了在其他页面设置内容与直播间设置内容不同步的问题（ps.之前的版本在除了直播间的页面显示有问题，但仍以直播间的设置为准）

*************************************************************** */

/********************************各类广告*******************************/
if (window.top === window) {

    GM_addStyle(`
    .MatchFocusFullPic, .Prompt-container {
        display: none !important;
    }
    .HeaderGif-left, .HeaderGif-right {
        display: none !important;
    }
    /*"直播"等栏顶部2个横幅广告*/
    section.layout-Banner {
        display: none !important;
    }
    /*嵌入各个直播间尾部分类广告*/
    .AdCover {
        display: none !important;
    }
    /*各种嵌入广告*/
    .DropMenuList-ad, .DropPane-ad, .CloudGameLink, .Search-ad, .FishShopTip, .RedEnvelopAd-adBox, .ChargeTask, [class^="recommendAD-"], [class^="recommendApp-"], .wm-pc-imgLink, [class^="code_box-"], .layout-Slider-link.is-advert {
        display: none !important;
    }
    /*直播页面主要几个广告*/
    .Bottom-ad, #js-room-activity, .ScreenBannerAd, .XinghaiAd, .PlayerToolbar-ContentCell .PlayerToolbar-signCont, .SignBarrage, .IconCardAdCard {
        display: none !important;
    }
    `);

    /***********************************屏蔽****************************/
    GM_addStyle(`

    /*屏蔽网页全屏与直播全屏右上角关注提示框，直播间点赞*/
    .FullPageFollowGuide, .LiveRoomDianzan, .FollowGuide{
        display: none !important;
    }

    /*屏蔽宝箱礼物特效*/
    .layout-Player-effect {
        display: none !important;
    }

    /*屏蔽直播间上方第三行内容*/
    .Title-row:nth-of-type(3) {
        display: none !important;
    }
    /*金铲铲、和平手册*/
    .JinChanChanGame, .PeacehandBarrage{
        display: none !important;
    }

    `);


    /************************setting、overlay、dialog、close、table、toggle、scrollbar...CSS ************************/

    GM_addStyle(`
    /**********************************设置按钮setting*****************************/
    #ca_btn_setting{
        position: fixed;
        top:14px;
        right:14px;
        width: 32px;
        height: 32px;
        display: block;
        transition: transform 0.3s ease-in-out;
        cursor: pointer;
        z-index: 10000;
        opacity: 0.9;
    }
    #ca_btn_setting:hover{
        transform: rotate(60deg);
    }

    /***************************遮罩层overlay、对话框dialog***************************/
    #ca_overlay *{
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE 10+ */
        user-select: none;
    }

    #ca_overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        justify-content: center;
        align-items: center;
    }
    @keyframes show {
        0% {
            transform: rotateX(30deg);
        }
        58% {
            opacity: 1;
            transform: rotateX(-12deg);
        }
        100% {
            opacity: 1;
        }
    }
    #ca_dialog {
        display: block;
        position: absolute;
        width: 320px;
        height: 300px;
        background-color: #fff;
        color: #333;
        font-size: 16px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        padding: 20px;
        transition: all 0.3s ease-in-out;
        /* transform-style: preserve-3d; */
        transform-origin: center center;
        animation: show 0.3s ease-in-out;
    }
    #ca_dialog h2{
        font-size: 24px;
        display: block;
        margin-bottom: 12px;
        font-weight: bold;
    }

    /***************************关闭close***************************/

    #ca_btn_close {
        position: absolute;
        top: 20px;
        right: 20px;
        margin: 3px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        box-sizing: border-box;
    }
    #ca_btn_close:hover::before,
    #ca_btn_close:hover::after {
        background: red;
    }
    #ca_btn_close:before {
        position: absolute;
        content: '';
        width: 1px;
        height: 25px;
        background-color: var(--theme-color2);
        transition: background-color 0.3s;
        transform: rotate(45deg);
        top: -3px;
        left: 11px;
    }
    #ca_btn_close:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 25px;
        background-color: var(--theme-color2);
        transition: background-color 0.3s;
        transform: rotate(-45deg);
        top: -3px;
        left: 11px;
    }

    /***************************** 表格table **************************/

    .ca_table {
        display: block;
        width: 300px;
        height: 220px;
        margin: auto;
        border-collapse: collapse;
        overflow-y: scroll;
        scrollbar-width: thin;
    }
    .ca_table tr {
        border-top: 1px solid #ddd;
    }
    .ca_table tr:first-child {
        border-top: none;
    }
    .ca_table td {
        font-size: 16px;
        padding: 10px;
    }
    .ca_table td:first-child {
        width: 250px;
        text-align: left;
    }
    .ca_table td:last-child {
        width: 50px;
        text-align: right;
    }

    /**************************** checkbox ***************************/

    .ca_toggle {
        position: absolute;
        margin-left: -9999px;
        visibility: hidden;
    }
    .ca_toggle+label {
        display: block;
        position: relative;
        cursor: pointer;
        outline: none;
        user-select: none;
        margin-right: 0px;
        transition: box-shadow 0.3s;
    }
    .ca_toggle+label:hover {
        box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 0.24), 0 8px 12px 0 rgba(0, 0, 0, 0.19);
    }
    input.ca_toggle-round+label {
        padding: 2px;
        width: 40px;
        height: 20px;
        background-color: #dddddd;
        border-radius: 20px;
    }
    input.ca_toggle-round+label:before,
    input.ca_toggle-round+label:after {
        display: block;
        position: absolute;
        top: 1px;
        left: 1px;
        bottom: 1px;
        content: "";
    }
    input.ca_toggle-round+label:before {
        right: 1px;
        background-color: #f1f1f1;
        border-radius: 20px;
        transition: background-color 0.3s;
    }
    input.ca_toggle-round+label:after {
        width: 20px;
        background-color: #fff;
        border-radius: 100%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: background-color 0.3s, margin 0.3s;
    }
    input.ca_toggle-round:checked+label:before {
        background-color: #8ce196;
    }
    input.ca_toggle-round:checked+label:after {
        margin-left: 20px;
    }

    /****************************** 滚动条scrollbar *****************************/

    #ca_dialog ::-webkit-scrollbar {
        width: 5px;
        height: 10px;
    }

    #ca_dialog ::-webkit-scrollbar-track {
        width: 6px;
        background: rgba(#101F1C, 0.1);
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
    }

    #ca_dialog ::-webkit-scrollbar-thumb {
        background-color: rgba(144, 147, 153, .3);
        background-clip: padding-box;
        min-height: 28px;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
        transition: background-color .3s;
        cursor: pointer;
    }

    #ca_dialog ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(144, 147, 153, .5);
    }

    /****************************** radiobutton切换 *****************************/

    #ca_ul {
        position: relative;
        width: 300px;
        margin: -4px 0 0 10px;
        padding: 0;
    }

    #ca_ul li {
        list-style: none;
    }

    #ca_ul li input {
        display: none;
    }

    #ca_ul li .rb-label {
        float: left;
        width: 150px;
        text-align: center;
        line-height: 30px;
        border: 1px solid #000;
        border-right: 0;
        box-sizing: border-box;
        cursor: pointer;
        transition-property: background-color;
        transition-duration: .3s;
    }

    #ca_ul #rb-label1 {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    #ca_ul #rb-label2 {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    #tab1:checked+.rb-label,
    #tab2:checked+.rb-label {
        color: #eee !important;
        background-color: #000 !important;
    }

    #ca_ul li:last-child .rb-label {
        border-right: 1px solid #000;
    }

    .ca_content {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        left: 0;
        top: 40px;
        width: 100%;
        box-sizing: border-box;
        font-size: 24px;
        text-align: center;
        transition-property: opacity;
        transition-duration: .3s;

    }

    #ca_ul li input:checked~.ca_content {
        opacity: 1;
        visibility: visible;
    }

    /******************************* handle_dispop && cancel***********************************/
    #btn_hand_dispop {
        margin-top: 5px;
        width: auto;
        height: 28px;
        border: none;
        border-radius: 5px;
        background-color: rgba(23, 171, 227, 0.8);
        color: white;
        cursor: pointer;
        padding: 0 5px;
    }

    #btn_hand_dispop:hover {
        background-color: rgba(23, 171, 227, 1)
    }

    #btn_hand_dispop:focus {
        outline: none;
    }

    #btn_hand_dispop:disabled {
        background-color: #999;
        color: #eee;
        cursor: auto;
    }

    #btn_cancel_dispop {
        margin-left: 10px;
        margin-top: 5px;
        width: auto;
        height: 28px;
        border: none;
        border-radius: 5px;
        background-color: rgba(142, 158, 191, .8);
        color: #eee;
        cursor: pointer;
        padding: 0 5px;
    }

    #btn_cancel_dispop:hover {
        background-color: rgba(142, 158, 191, 1)
    }

    #btn_cancel_dispop:focus {
        outline: none;
    }

    #btn_cancel_dispop:disabled {
        background-color: #999;
        cursor: auto;
    }
    /*************hand_dispop_box************/
    #hand_dispop_box{
        border: 1px solid #999;
        padding: 10px; border-radius: 10px;
        transition: box-shadow 0.3s ease;
    }
    #hand_dispop_box:hover {
        box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, .1);
    }
    /*************hand_dispo---#dispop_time************/
    #dispop_time{
        border-radius: 5px;
        cursor: pointer;
        transition:background-color 0.3s ease-in-out,color 0.3s ease-in-out;
    }

    /**************************** 主题theme ********************************/
    .theme_color {
        display: inline-block;
        position: relative;
        top: 2px;
        width: 20px;
        height: 20px;
        margin-left: 5px;
        border-radius: 10px;
        transition: transform .25s;
        border: 1px solid;
        border-color: rgba(255, 255, 255, .5);
        background-color: rgb(101, 101, 181);
        box-sizing: border-box;
    }
    .theme_color:not(.selected) {
        cursor: pointer;
    }
    .theme_color:not(.selected):hover {
        transform: scale(1.1);
    }
    .theme_color.selected {
        border: 3px solid rgba(255, 255, 255, .5);
    }
    .rb_theme_color:checked+.theme_color {
        border: 3px solid rgba(255, 255, 255, .5);
        cursor: inherit;
        transform: none;
    }
    #theme_dark{background-color:#333}
    #theme_pink{background-color:#ffc0cb}
    #theme_blue{background-color:#87CEFA}
    #theme_deepdark{background-color:#000}
    /**************箭头arrow***********/
    .ca_arrow_right {
        display: flex;
        cursor: pointer;
        margin-left: 5px;
        /* 水平居中 */
        justify-content: center;
        /* 垂直居中 */
        align-items: center;
    }
    .ca_arrow_right svg{
        -webkit-transition: -webkit-transform .3s;
        transition: -webkit-transform .3s;
        transition: transform .3s;
        -o-transition: transform .3s;
        transition: transform .3s, -webkit-transform .3s;
    }
    #ca_theme_more_option {
        display: flex;
        justify-content: space-between;
        transition: height 0.3s ease, margin 0.3s ease;
        text-align: right;
        margin-top: 0;
        padding-right: 5px;
        height: 0;
        overflow: hidden;
    }
    #ca_theme_row.show_more_option #ca_theme_more_option {
        margin-top: 10px;
        padding-right: 5px;
        height: 24px;
    }

    #ca_theme_row.show_more_option #ca_arrow_theme_more_option>svg {
        transform: rotate(90deg);
    }
    `);

    /**********************************************************************************************/

    /***************************************开关灯按钮css************************************************/
    GM_addStyle(`
    #cb_dark_mode_box{
        right: 54px;
        top: 18px;
        position: fixed;
        z-index: 10000;
    }
    #cb_dark_mode_box input.ca_toggle-round:checked+label:before {
        background-color: var(--theme-background-color1);
    }
    #cb_dark_mode_box input.ca_toggle-round+label:after {
        background-color: var(--theme-background-color1);
    }
    #cb_dark_mode_box input.ca_toggle-round:checked+label:after {
        background-color: var(--theme-color1);
    }
    `);
    /**********************************************************************************************/


    (function () {
        'use strict';
        window.onload = function () {
            // console.clear();
            console.log('【ClearAds】ClearAds loaded. ---By Ginyang.');

            /* 主题色 */
            const color_dark = ['#333', '#111', '#555', '#222', '#ddd', '#aaa'];
            const color_pink = ['#ffc0cb', '#ffa2a9', '#ffb6c1', '#ffb5b5', '#964c64', '#ac627a'];
            const color_blue = ['#87CEFA', '#00BFFF', '#9ae0f7', '#6495ED', '#191970', '#4848bf'];
            const color_deepdark = ['#111', '#000', '#131313', '#222', '#ccc', '#aaa'];

            /* 夜晚模式css ====> v1.2.5 改用作 主题色 */
            const dark_mode_css = ':root{--theme-background-color1:#333;--theme-background-color2:#111;--theme-background-color3:#555;--theme-background-color4:#222;--theme-color1:#ddd;--theme-color2:#aaa}body,.layout-Module-head,.AnchorFriend-content .AnchorFriend-footer a{background-color:var(--theme-background-color1) !important;color:var(--theme-color1)}#js-header .Header-menu-link .Category-item,.cate2TagB .cate2TagB-item,.categoryBoxB-editB .edit,.categoryTab-list .categoryTab-item,.ListRecommend-refresh,.layout-Module-label--hasList,.layout-Module-label,.ListHeader-clearAll,.Header-follow-tab,.Header-history-tab{background-color:var(--theme-background-color3) !important;color:var(--theme-color1) !important}#js-header .Header-menu-link .Category-item:hover,.GroupEditPop-copy:hover,.YubaMessage-link:hover,.Title-anchorName-HC .Title-anchorName-block:hover,.Title-official{background-color:var(--theme-background-color2) !important;color:#ff5d23 !important}.omnibusItemCard,.CustomGroupMenu-wrapper,.AssembleExpressHeader-head,.AthenaBoothPanel-item{background-color:var(--theme-background-color2) !important;color:var(--theme-color1) !important}.layout-Module-label--hasList.is-active,.layout-Module-label--hasList.is-active:hover,.layout-Module-label.is-active,.layout-Module-label.is-active:hover,.ListHeader-clearAll:hover,.Header-follow-tab.is-active,.Header-history-tab.is-active,.DyTab-tabWrap .DyTab-tab.is-cur,.Rank-content a.AnchorRankList-liveRoom:hover{background-color:#ff5d23 !important;color:var(--theme-color1) !important}.DyTab-tabWrap .DyTab-tab,.Rank-content a.AnchorRankList-liveRoom{background-color:var(--theme-background-color1) !important;color:var(--theme-color1) !important}.public-DropMenu-drop,.layout-Player-title,.layout-Player-toolbar,.layout-Player-barrage,.layout-Player-chat,.ChatSend-txt,.ChatTabContainer-titleWraper--tabLi,.newBroadcast-box,#ca_dialog,.layout-Module-head .leftArrow,.dy-ModalRadius-content .dy-ModalRadius-close,.Search-historyList>li:hover,.Search-suggestBoxContent .Search-default-item:hover,.AllFollowPop-cates .AllFollowPop-cates-wrapper,.SortPop-cates .SortPop-cates-wrapper,.Title-anchorName-HC,.YubaGroup-pane .YubaGroupItem:hover,.Backpack .Backpack-prop.is-blank,.Match-oneHead,.ChatEmotion .Emotion,.FansMedalPanel-OwnerInfo,.FansMedalList-box,.ChatFansBarragePop,.FilterKeywords,.BarrageWordPanel-card,.PopularBarragePanel,.PopularBarragePanel-foot,.EmotionList-con,.DiamondsFansEmotToolTips,.Rank .Rank-item .is-even,.VideoAnchorItem:hover,.Search-rank-wrapper:hover .Search-rank,.layout-Tab-container.is-fixed,.u_mainbody,.myprofile_main,.myprofile_main .userinfo,.layout-Section--fullBackground.AwesomeActivities-wrapper,.Aside-nav-drop,.HoverCard-tag,#dispop_time,.Search-topicRecommend .direact{background-color:var(--theme-background-color1) !important}.dy-ModalRadius-content .dy-ModalRadius-close{transition:none}.dy-ModalRadius-footer button{background-color:var(--theme-background-color1)}.Header-wrap,.layout-Player-announce,.VideoEntry-list,.ChatRank-rankWraper,.ChatTabContainer-titleWraper,.ChatRankWeek-headerContent,.ChatTabContainer-titleWraper--tabLi.is-active,.NobleRank,.NobleRankTips,.DiamondsFansRankInfo,.Barrage-roomVip--super,.DyRecCover-content,.DyListCover-content,.DyLiveCover-wrap,.DyLiveCover-wrap.is-hover,a.DyLiveRecord,.DyHistoryCover-content,.Search-hotList li:hover,.Search-suggestBoxContent .Search-recommend:hover,.public-DropMenu.Game .DropMenuList-item:hover,.layout-Classify-card,.HoverCard-wrap,.DropPaneList:hover a,.dy-Modal-content,.AnchorFriendPane-content,.AnchorFriendPane-content .AnchorFriend-footer a,.AnchorLevelTip-content .AnchorLevelTip-levelInfo,.AnchorLevelTip-content .AnchorLevelTip-processInfo,.Title-row-inner,.GiftInfoPanel-cont,.GiftInfoPanel-cont .GiftSkinPanelEnter,.GiftInfoPanel-cont .GiftSkinPanelList,.GiftExpandPanel,.YubaGroup-pane,.YubaGroup-groupTitle,.PublicAnnounce-panel,.wm-pc-room-cover-content,.Backpack,.Backpack .Backpack-propPanel,.BackpackInfoPanel-content,#js-floatingbarrage-container .Barrage-listItem .js-fansfloating-barragecont,.ToTopBtn,.FansMedalList .FansMedalList-item:hover,.ShieldTool-list,.ChatBarrageCollectPop,.BarrageWordPanel,.BarrageWordPanel-header,.js-noblefloating-barragecont.Barrage-notice--noble,.Barrage-notice--replyBarrage,.AthenaBoothPanel-wrapper,.Barrage-EntranceIntroduce,.Barrage-FansHome,#js-search-result .layout-Cover-item,.layout-Card-horizon,.layout-Card-history,.DyCover,.SearchTopic-wrap,.Search-yuba,.layout-Card-rank,.Search-direct,.Search-recommend:hover,.shark-Modal-content,.SearchChannel-item,.VideoRank-listWrap,.News-content,.hotCate-Wrapper .layout-List-item,.footerCate-block,.ActivityItem-card,.AnchorRank .layout-Module-container,.layout-Elevator .Elevator,.Aside-main--expand,.Aside-main--shrink,.Aside-toggle,.Title-followBtnBox.is-followed .Title-followBtn,.Search-topicRecommend:hover{background-color:var(--theme-background-color2) !important}.HoverCard-wrap:after,.GiftExpandPanel-giftTabsWrap:after,.GiftInfoPanel-cont .GiftSkinPanelList-nextMask{display:none !important}.Header-search-wrap .Search,input.search-ipt,.Search-hotList li .Search-direct,.Search-suggestBoxContent .Search-direct,.layout-Module-filter-more,.ListHeader-pop,.layout-Customization,.Match-oneContent,.Rank .Rank-title,.Rank .Rank-item,.layout-Search-input,.Search-input-pane,.Search-input-pane .Search-default-item:hover,.Aside-nav-item:hover,.Aside-menu-item:hover,.Aside-toggle:hover,.Aside-shrink-item:hover,.DyListCover-pic{background-color:var(--theme-background-color3) !important}.UserLevel{background-color:#eee}.layout-Module-title,.Title-roomInfo h2,.Title-roomInfo h3,.Title-roomInfo a,.Title-roomInfo span,.videoTitle,#ca_dialog,.DyRecCover-intro,.DyListCover-intro,.DyLiveCover-intro,.DyLiveRecord-intro,.DyHistoryCover-intro,.Header-search-wrap .Search .Search-text,input.search-ipt,.yubaInfo-itemLeft .title,.AllFollowPop-cates .AllFollowPop-cates-catesTitle,.AllFollowPop-cates .AllFollowPop-cates-followTitleItem,.AllFollowPop-cates-followContainer-item,.AllFollowPop-cates-itemcontainer-item,.SortPop-cates-wrapper div,.HoverCard-title,.layout-Classify-card strong,.Search-suggestBoxContent h3,.ListHeader-extra-cell,.ListHeader-extra-cell .ListHeader-list-icon,.authorSpecial-item .authorName,.game-item .gameInfo .gameName,.game-item .gameInfo .gameTime,.game-item .gameClash span.vs,.indviduation-itemTitle,.indviduation-itemTitle a,.recommend-item .infoBox .title,.rank-container .rank-item .rankInfo .userName,.rank-container .rank-item .rankLevel .name,.rank-container .rank-item .rankLevel .score,.dy-ModalRadius-title,.Title-anchorName-HC .Title-anchorName-block,.AnchorLevelTip-content .AnchorLevelTip-levelTipTxt,.AnchorLevelTip-content .AnchorLevelTip-task,.AnchorLevelTip-content .AnchorLevelTip-dateInfo,.Title-row-inner .Title-row-icon,.Title-row-inner .Title-row-text,.Title-blockInline.Title-more,.GiftInfoPanel-cont .GiftInfoPanel-name,.GiftInfoPanel-cont .GiftInfoPanel-intro,.GiftInfoPanel-cont b,.GiftInfoPanel-cont span,#js-player-barrage .Barrage-content,.zixunRank-item .zixunRank-content,.videoList-item .name,.MedalPanelDiamondsInfo-info p,.MedalPanelDiamondsInfo-info h5,.FansHome-info p,.FansHome-info h5,.MedalOwnerInfo-title p,.MedalOwnerInfo-title a,.FansMedalPanel-info .FansMedalInfo-getTips,.FansMedalList-title .FansMedalInfo-titleL,.FansMedalList-title .FansMedalInfo-titleR,.AthenaBoothPanel-showMoreBtn,.Rank-tabHref,.u_header h1,.u_nav li a,.layout-Result,.layout-Search-feedback,.layout-Tab-item,.SearchAnchorVideo-title,.DyCover-intro,.SearchTopic-title,.Search-yuba .des .name,.Search-rank,.SearchHero-subTitle,.Search-recommend-info h3,.Search-category h3,.layout-Search-input>input,.Search-historyItem,.SearchRightFilter-label,.SearchChannel-item-detail-name,.News-newsTitle,.VideoRank-title,.HomePageClassify-celltitle,.footerCate-cateName,.Elevator-item,.ActivityItem-text h3,a.AnchorRank-link,.Aside-shrink-item,.Aside-nav-item,.Aside-menu-item,.Aside-menu-whole,.Aside-menu-title,.footerCate-cateItem>a,#dispop_time,.PlayerToolbar-wealthNum,.ListHeader-hero-header,.ListHeader-hero-content-tag,.Aside-nav-drop-name,.Aside-nav-drop-btn,.is-followed .Title-followText:nth-child(3)>i,.rank-item .rankInfo .rankValue,div.Barrage-message,.Search-topicRecommend .name{color:var(--theme-color1)}.ChatSend-txt,.Header a,.Header svg,.Header h5,.Header h2,.DropPaneList-title,.omnibusTitle,#js-header a.DropMenuList-linkAll,#js-header .uploadBtn span,.layout-Module-head .tabItem,.cate2TagB .cate2TagB-label,.DropMenuList-wrapper h3.DropMenuList-name,.customizeModal-title h3,.categoryTab-head .categoryTab-tab,.GroupEditPop-copy,.js-timeLine-wrap h3,.AnchorFriendPane-content h3,.AnchorFriendPane-content .AnchorFriend-footer a,.AnchorLike-friendList h3,.dy-ModalRadius-content h3,.YubaGroup-groupTitle span,.BackpackHeader-info--title,.BackpackHeader-info--desc,.BackpackInfoPanel-name,.Match-oneTitle,.indviduation-itemBox .userName,.indviduation-itemBox .name,.Dota2RankLevel-RankScore,.CSGORankLevel-RankScore,.wm-pc-room-cover-intro,.wm-pc-room-cover-hot,.wm-pc-room-cover-user,.wm-pc-room-cover-content>p,.ChatBarrageCollectPop-title,.FilterKeywords h3,.FKNokeywords-title,.BarrageWordPanel h3,.BarrageWordPanel-header h2,.BarrageWordPanel-card .BarrageWordPanel-tips,.VideoBottomTabs-box span,.AthenaBoothPanel-title,.AthenaBoothPanel-followBtn,.Barrage-EntranceIntroduce-Content,.Rank-kidLimitTxt,.Rank-content [class$="Rank-title"],.Rank-content [class$="RankList-name"],.Rank-content [class$="RankList-anickname"],.Rank-content [class$="RankList-weekNum"],.Rank-content [class$="RankList-weekTxt"],.Barrage-notice,.VideoReplayItem-date,.VideoAnchorItem-title,.Barrage-FansHome-content,.Search-anchor-info h3,.Search-create-info h3,.Search-upSmall-info h3,a.theme,.Search-feedback-section,.Search-input-title,.layout-Module-title>a,.layout-Module-title>div,.layout-Module-title>span,.game-countDown,.Search-yuba .des .num{color:var(--theme-color1) !important}.DyCover-user,.DyCover-hot,.Search-hotList-hot,.Search-rank-hot,.secondCateCard-hot,.Search-direct,.DyLiveCover-zone,.DyLiveRecord-zone,.DyLiveCover-user,.DyLiveCover-hot,.DyLiveRecord-user,.DyListCover-zone,.DyListCover-user,.DyListCover-hot,.DyListCover-btn.is-care,.DyRecCover-zone,.DyRecCover-userName,.DyRecCover-btn.is-care,a.FilterTabsV2-container,a.FilterTabsV2-container:hover,.Search-category p,.Search-anchor-info h4,.Search-upSmall-info p,.Search-create-info p,.Search-anchor-info p,.layout-Module-extra,.Match-msgType,.SearchCoverLable-item,.recommend-item .infoBox .recommend-name,.HeaderCell-label-wrap.is-live-empty,.Search-recommend-info>p,.Rank-content [class$="Rank-time"],.Rank-content [class$="Rank-desc"],.Rank-content [class$="RankList-score"],.Rank-content [class$="RankList-center"],.Rank-content [class$="RankList-fansNum"],.Rank-content [class$="RankList-catagory"],.Title-report,.Title-anchorText,.PlayerToolbar-wealthText,.ListHeader-hero-header-count,.Search-label,.Aside-nav-drop-item,.Aside-nav-drop-item:hover,.ChatSend-txt::placeholder{color:var(--theme-color2)}.layout-Module-empty,.Search-up-upCert,.DropPaneList-hot,.DropPaneList-name,.DropPaneList-time,.DropPaneList-videoTime,.DropPaneList-live,.Search-yuba table tr:first-child,.SearchTopic-brief,.SearchTopic-info,.Search-game-info p,.Search-game-info i,.Search-anchor-data,.Search-anchor-cate,.SearchAnchorVideo-time,.SearchChannel-item-detail-isCate,.AnchorFriendCard-description,.AnchorFriendCard-extra,.AnchorFriendCard-relationship.is-friend,.BackpackInfoPanel-exp b,.BackpackInfoPanel-intro,.kingRank-item .kingRankLevel .score,.kingRank-item .kingRankInfo .kingRankValue,.Search-content-title,.Search-default-title,.Search-history-title,.Search-hot-title,.Search-anchor.is-horizon .Search-anchor-info h4,.HoverCard-num,.HoverCard-scoredes,.HoverCard-footer,.AthenaBoothPanel-item p{color:var(--theme-color2) !important}.AnchorFriendPane-content .AnchorFriendCard-hot::before{content:"热度";width:32px}.Header-menu-link:hover a,.Header-menu-link:hover svg,.public-DropMenu-link:hover span,.public-DropMenu-link:hover svg,a.EntryNav-desc:hover span,.active a,.active svg,.Wallet-content-mywallet-wealth span,.DropPaneList:hover .DropPaneList-title,.layout-Module-head .tabItem:hover,.layout-Module-head .tabItem.active,.cate2TagB .cate2TagB-item:hover,.categoryBoxB-editB .edit:hover,.categoryTab-head .categoryTab-tab:hover,.categoryTab-head .categoryTab-tab.is-active,.Search-hotList .Search-direct:hover,.Search-hotList li .Search-hotList-kw:hover,.Search-suggestBoxContent .Search-direct:hover,.omnibusItem:hover .omnibusTitle,.ListRecommend-refresh:hover,.AllFollowPop-cates-followContainer-item:hover,.AllFollowPop-cates-itemcontainer-item:hover,.SortPop-cates-wrapper div:hover,.AllFollowPop-cates-followContainer .is-active,.SortPop-cates-wrapper div.is-active,.layout-Classify-card:hover strong,.categoryTab-list .categoryTab-item:hover,.Search-suggestBoxContent h3 .Search-keyword,.layout-Module-label--hasList:hover,.layout-Module-label:hover,.layout-Customization .game-item:hover .gameName,.layout-Customization .game-item:hover .gameTime,.layout-Customization .indviduation-itemTitle a:hover,.layout-Customization .recommend-item:hover .title,.Title-official .Title-officialName,.AnchorFriendPane-content .AnchorFriend-footer a:hover,.AnchorFriend-content .AnchorFriend-footer a:hover,.zixunRank-item:hover .zixunRank-content,.videoList-item .name:hover,.MedalOwnerInfo-title a:hover,.FansMedalList-title .FansMedalInfo-titleR:hover,.FilKeyTab .tab.active,.VideoBottomTabs-box span.cur,.wb_card-wbInfo-a7-LR a:hover,.AthenaBoothPanel-item:hover,.VideoAnchorItem:hover .VideoAnchorItem-title,.SearchTopic-wrap:hover .SearchTopic-title,a.theme:hover,.layout-Search-feedback:hover,.layout-Module-title>a:hover,a.AnchorRank-link:hover,.Search-history-title>a:hover{color:#ff5d23 !important}.AllFollowPop-cates,.dy-ModalRadius-content,.GroupEditPop-wrapper,.SearchRightFilter-pane{background-color:var(--theme-background-color1) !important;border:1px solid var(--theme-color1)}.FansMedalPanel-Panel{background-color:var(--theme-background-color2) !important;border:1px solid var(--theme-color1)}.FansMedalPanel-headerBg,.FansGiftPackage-headBg{display:none}.FansMedalPanel-enterMenu{margin-top:4px}.MedalPanelDiamondsInfo,.FansHome,#js-EmotionDiamondsPanel{background-image:none !important;background-color:var(--theme-background-color1) !important}div#js-EmotionDiamondsPanel::before{content:"钻粉专属表情";position:absolute;top:4px;left:34%;font-size:20px}.BackpackWrapper .FansGiftPackage{background-color:var(--theme-background-color2);height:160px}.FansGiftPackage-wrap{padding-top:15px;top:0}#ca_ul li .rb-label,#ca_ul li:last-child .rb-label{border-color:var(--theme-color1)}.rb-label{color:#999}.AnchorRankList-tipsContent{background-color:#ab8e8e !important}.Barrage-FansHome-notice,.HomePageClassify-cell,.hotCate-Wrapper{background-image:none !important}.layout-Nav-backTop{background-color:var(--theme-background-color2)}.layout-Nav-backTop:hover{background-color:#ff5d23}.Elevator-item:nth-child(odd),.AnchorRank-more{background-color:var(--theme-background-color4)}.AnchorFriendCard-hot:before{background-image:none;background:none}.Search-historyList>li,.Search-default-item,.Match-status0,.MatchRoom-label.is-empty,.SearchCoverLable-wrap.is-normal{color:var(--theme-color2);border:1px solid var(--theme-color2)}html::-webkit-scrollbar{width:10px;height:20px}html::-webkit-scrollbar-track{width:6px;background:var(--theme-background-color3);-webkit-border-radius:2em;-moz-border-radius:2em;border-radius:2em}html::-webkit-scrollbar-thumb{background-color:var(--theme-color2);background-clip:padding-box;min-height:28px;-webkit-border-radius:2em;-moz-border-radius:2em;border-radius:2em;transition:background-color .3s;cursor:pointer}html::-webkit-scrollbar-thumb:hover{background-color:var(--theme-color2);opacity:0.5}#hand_dispop_box{border:1px solid var(--theme-color2,#999)}#hand_dispop_box:hover{box-shadow:1px 1px 5px 1px var(--theme-color2,#000)}#hand_dispop_box hr,.ca_table tr{border-color:var(--theme-color2,#ddd)}.Header-wrap,.layout-Player-title,.layout-Player-video,.layout-Player-toolbar,.layout-Player-asideMain{border:none !important}.layout-Player-asideMainTop{top:-1px;bottom:87px}';
            /* 创建夜晚模式style */
            let style_dark_mode = document.createElement('style');
            style_dark_mode.innerHTML = dark_mode_css;

            // 导航栏及直播间边框阴影
            const live_boxshaodow_css = '.Header-wrap,.layout-Player-title,.layout-Player-video,.layout-Player-toolbar,.layout-Player-asideMain{box-shadow:1px 1px 5px 1px var(--theme-color2)}';
            let style_live_boxshadow = document.createElement('style');
            style_live_boxshadow.innerHTML = live_boxshaodow_css;

            /* 各个隐藏css */
            const hide_head_css = '.public-DropMenu.Video,.public-DropMenu.Game,.HeaderNav,.Header-download-wrap,.Header-createcenter-wrap,.Header-broadcast-wrap{display:none}';
            const hide_aside_css = '.Aside-shrink-item[title="游戏"],.Aside-shrink-item[title="云游戏"],a.Aside-nav-item[href="https://wan.douyu.com"],a.Aside-nav-item[href="https://cloudgame.douyu.com"]{display:none}';
            const hide_chattop_css = '.layout-Player-rank,.layout-Player-announce{display:none}.layout-Player-barrage{top:0}';
            const hide_bottom_css = '.Bottom{display:none}';
            const hide_guess_css = '.ToolbarActivityArea{display:none}';
            const hide_level_css = '.Barrage-listItem .UserLevel,.Barrage-listItem img[class^="Supreme"],.Barrage-listItem .Barrage-noble,.Barrage-listItem .FansMedalBox,.Barrage-listItem .ChatAchievement,.Barrage-listItem .Barrage-roomVipIcon,.Barrage-listItem a.Baby,.Barrage-listItem .TeamFansMedalJSX,.Barrage-listItem .UserGameDataMedal,.MatchSystemTeamMedal{display:none !important}';
            const hide_chattool_css = '.Horn4Category,.ChatNobleBarrage,.PopularBarrage,.BarrageWord{display:none !important}';

            // 创建隐藏style
            let style_hide_head = document.createElement('style');
            style_hide_head.innerHTML = hide_head_css;

            let style_hide_aside = document.createElement('style');
            style_hide_aside.innerHTML = hide_aside_css;

            let style_hide_chattop = document.createElement('style');
            style_hide_chattop.innerHTML = hide_chattop_css;

            let style_hide_bottom = document.createElement('style');
            style_hide_bottom.innerHTML = hide_bottom_css;

            let style_hide_guess = document.createElement('style');
            style_hide_guess.innerHTML = hide_guess_css;

            let style_hide_level = document.createElement('style');
            style_hide_level.innerHTML = hide_level_css;

            let style_hide_chattool = document.createElement('style');
            style_hide_chattool.innerHTML = hide_chattool_css;


            // 创建一个夜晚模式开关灯按钮
            const cb_dark_mode_html = `
            <input id="cb_dark_mode" class="ca_toggle ca_toggle-round" type="checkbox" checked>
            <label for="cb_dark_mode"></label>
            `;
            let cb_dark_mode_box = document.createElement('div');
            cb_dark_mode_box.id = 'cb_dark_mode_box';
            cb_dark_mode_box.title = '主题色-开/关';
            cb_dark_mode_box.innerHTML = cb_dark_mode_html;
            document.body.appendChild(cb_dark_mode_box);

            // 创建一个“设置”按钮
            const btn_setting_html = `
            <svg t="1689689573324" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2559" width="32" height="32">
                <path d="M919.6 405.6l-57.2-8c-12.7-1.8-23-10.4-28-22.1-11.3-26.7-25.7-51.7-42.9-74.5-7.7-10.2-10-23.5-5.2-35.3l21.7-53.5c6.7-16.4 0.2-35.3-15.2-44.1L669.1 96.6c-15.4-8.9-34.9-5.1-45.8 8.9l-35.4 45.3c-7.9 10.2-20.7 14.9-33.5 13.3-14-1.8-28.3-2.8-42.8-2.8-14.5 0-28.8 1-42.8 2.8-12.8 1.6-25.6-3.1-33.5-13.3l-35.4-45.3c-10.9-14-30.4-17.8-45.8-8.9L230.4 168c-15.4 8.9-21.8 27.7-15.2 44.1l21.7 53.5c4.8 11.9 2.5 25.1-5.2 35.3-17.2 22.8-31.7 47.8-42.9 74.5-5 11.8-15.3 20.4-28 22.1l-57.2 8C86 408 72.9 423 72.9 440.8v142.9c0 17.7 13.1 32.7 30.6 35.2l57.2 8c12.7 1.8 23 10.4 28 22.1 11.3 26.7 25.7 51.7 42.9 74.5 7.7 10.2 10 23.5 5.2 35.3l-21.7 53.5c-6.7 16.4-0.2 35.3 15.2 44.1L354 927.8c15.4 8.9 34.9 5.1 45.8-8.9l35.4-45.3c7.9-10.2 20.7-14.9 33.5-13.3 14 1.8 28.3 2.8 42.8 2.8 14.5 0 28.8-1 42.8-2.8 12.8-1.6 25.6 3.1 33.5 13.3l35.4 45.3c10.9 14 30.4 17.8 45.8 8.9l123.7-71.4c15.4-8.9 21.8-27.7 15.2-44.1l-21.7-53.5c-4.8-11.8-2.5-25.1 5.2-35.3 17.2-22.8 31.7-47.8 42.9-74.5 5-11.8 15.3-20.4 28-22.1l57.2-8c17.6-2.5 30.6-17.5 30.6-35.2V440.8c0.2-17.8-12.9-32.8-30.5-35.2z m-408 245.5c-76.7 0-138.9-62.2-138.9-138.9s62.2-138.9 138.9-138.9 138.9 62.2 138.9 138.9-62.2 138.9-138.9 138.9z" 
                fill="#17abe3" p-id="2560" data-spm-anchor-id="a313x.7781069.0.i13" class="selected"></path>
            </svg>
            `;
            let btn_setting = document.createElement('div');
            btn_setting.id = 'ca_btn_setting';
            btn_setting.title = '设置';
            btn_setting.innerHTML = btn_setting_html;
            document.body.appendChild(btn_setting);

            // 创建一个遮罩层及其内部的对话框
            const overlay_dialog_html = `
            <div id="ca_dialog">
                <h2 style="margin-top: -4px;">设置（ClearAds）<a style="font-size: 12px; color: #17abe3; text-decoration: underline;" target="_blank" title="前往插件详情页面查看更多插件信息" href="https://greasyfork.org/zh-CN/scripts/470752">插件信息</a></h2>
                <ul id="ca_ul">
                    <li><input id="tab1" type="radio" name="tab" checked><label id="rb-label1" class="rb-label" for="tab1">简化</label>
                        <div class="ca_content">
                            <table class="ca_table">
                                <tr title="简化隐藏顶部导航栏的部分内容">
                                    <td>顶部导航栏-部分</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle1" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle1"></label></div>
                                    </td>
                                </tr>
                                <tr title="隐藏侧边栏的游戏以及云游戏">
                                    <td>侧边栏-游戏、云游戏</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle2" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle2"></label></div>
                                    </td>
                                </tr>
                                <tr title="隐藏直播间聊天栏顶部的主播投稿视频、房间用户活跃度、贵宾等">
                                    <td>直播间-聊天栏顶部</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle3" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle3"></label></div>
                                    </td>
                                </tr>
                                <tr title="隐藏直播间底部鱼吧、友邻等内容">
                                    <td>直播间-页面下方鱼吧等</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle4" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle4"></label></div>
                                    </td>
                                </tr>
                                <tr title="隐藏直播间礼物栏旁的各种活动内容，包含预言竞猜">
                                    <td>直播间-预言竞猜等</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle5" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle5"></label></div>
                                    </td>
                                </tr>
                                <tr title="隐藏直播间聊天栏的等级、贵族牌、粉丝牌、成就、房间VIP、消息后缀图片等内容，但保留了房管标识">
                                    <td>直播间-聊天栏等级等内容</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle6" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle6"></label></div>
                                    </td>
                                </tr>
                                <tr title="隐藏直播间聊天发送框上面的部分内容，包括喇叭、贵族、梗、令等，保留了表情、粉丝弹幕与火力全开">
                                    <td>直播间-发送框上方</td>
                                    <td>
                                        <div class="switch"><input id="ca_toggle7" class="ca_toggle ca_toggle-round" type="checkbox" checked><label for="ca_toggle7"></label></div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </li>
                    <li><input id="tab2" type="radio" name="tab"><label id="rb-label2" class="rb-label" for="tab2">功能</label>
                        <div class="ca_content">
                            <table class="ca_table">
                                <tr id="ca_theme_row">
                                    <td colspan="2">
                                        <div style="text-align: left; display: flex; flex-wrap: nowrap;">
                                            <div style="flex-grow: 1; text-align: left;">主题色</div>
                                            <div id="theme_container">
                                                <input type="radio" name="theme" class="rb_theme_color" id="rb_theme_dark"
                                                    checked>
                                                <label class="theme_color" id="theme_dark" for="rb_theme_dark" title="夜晚黑"></label>
                                                <input type="radio" name="theme" class="rb_theme_color" id="rb_theme_pink">
                                                <label class="theme_color" id="theme_pink" for="rb_theme_pink" title="少女粉"></label>
                                                <input type="radio" name="theme" class="rb_theme_color" id="rb_theme_blue">
                                                <label class="theme_color" id="theme_blue" for="rb_theme_blue" title="天空蓝"></label>
                                                <input type="radio" name="theme" class="rb_theme_color"
                                                    id="rb_theme_deepdark">
                                                <label class="theme_color" id="theme_deepdark"
                                                    for="rb_theme_deepdark" title="极致黑"></label>
                                            </div>
                                            <span id="ca_arrow_theme_more_option" class="ca_arrow_right">
                                                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="18" height="18"
                                                    data-pointer="none" viewBox="0 0 16 16">
                                                    <path
                                                        d="m9.188 7.999-3.359 3.359a.75.75 0 1 0 1.061 1.061l3.889-3.889a.75.75 0 0 0 0-1.061L6.89 3.58a.75.75 0 1 0-1.061 1.061l3.359 3.358z">
                                                    </path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div id="ca_theme_more_option">
                                            <div style="display: inline-block">导航栏及直播间边框阴影</div>
                                            <div class="switch" style="display: inline-block">
                                                <input id="cb_shadow" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                                <label for="cb_shadow" style="box-shadow: none"></label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr title="进入直播间自动屏蔽刷屏消息">
                                    <td>自动防刷屏（5分钟）</td>
                                    <td>
                                        <div class="switch">
                                            <input id="cb_dispop" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                            <label for="cb_dispop"></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center;" colspan="2">
                                        <div id="hand_dispop_box">
                                            <span title="手动开启防刷屏，当前防刷屏已开启的话请先点击关闭">手动开/关防刷屏</span><hr>
                                                屏蔽<select name="times" id="dispop_time">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="5" selected>5</option>
                                                    <option value="8">8</option>
                                                    <option value="10">10</option>
                                                </select>分钟之内的刷屏消息<br>
                                                <button id="btn_hand_dispop" style="display: inline;" disabled>开启</button><button id="btn_cancel_dispop" style="display: inline;" disabled>关闭</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr title="进入直播间自动网页全屏">
                                    <td>自动网页全屏</td>
                                    <td>
                                        <div class="switch">
                                            <input id="cb_auto_wfs" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                            <label for="cb_auto_wfs"></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr title="进入直播间自动关闭弹幕">
                                <td>自动关闭弹幕</td>
                                    <td>
                                        <div class="switch">
                                            <input id="cb_auto_cdm" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                            <label for="cb_auto_cdm"></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr title="进入直播间自动选择当前直播间最高画质">
                                    <td>自动选择最高画质</td>
                                    <td>
                                        <div class="switch">
                                            <input id="cb_auto_shr" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                            <label for="cb_auto_shr"></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr title="自动佩戴对应直播间的粉丝牌（如果已拥有）">
                                    <td>自动佩戴粉丝牌</td>
                                    <td>
                                        <div class="switch">
                                            <input id="cb_auto_wfm" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                            <label for="cb_auto_wfm"></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr title="键盘功能增强，本功能开/关后需刷新页面以生效，请前往插件详情查看更多详情内容">
                                    <td>键盘功能增强</td>
                                    <td>
                                        <div class="switch">
                                            <input id="cb_keyboard" class="ca_toggle ca_toggle-round" type="checkbox" checked>
                                            <label for="cb_keyboard"></label>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </li>
                </ul>
                <div id="ca_btn_close"></div>
            </div>
            `;
            let ca_overlay = document.createElement('div');
            ca_overlay.id = 'ca_overlay';
            ca_overlay.innerHTML = overlay_dialog_html;
            document.body.appendChild(ca_overlay);


            // 获取设置对话框等对象
            let ca_dialog = document.getElementById('ca_dialog');
            let ca_btn_close = document.getElementById('ca_btn_close');

            // 给设置按钮添加点击事件
            btn_setting.addEventListener('click', function () {
                showca_dialog();
            });

            // 显示遮罩层和对话框
            function showca_dialog() {
                ca_overlay.style.display = 'flex';
            }

            // 隐藏遮罩层和对话框
            function hideca_dialog() {
                ca_overlay.style.display = 'none';
            }

            // 给遮罩层添加点击事件
            // ca_overlay.addEventListener('click', function () {
            //     hideca_dialog();
            // });

            // 给关闭按钮添加点击事件
            ca_btn_close.addEventListener('click', function () {
                hideca_dialog();
            });

            /************************************获取插件添加的元素对象***************************************/

            // 获取各个checkbox按钮对象
            let cb_1 = document.getElementById('ca_toggle1');
            let cb_2 = document.getElementById('ca_toggle2');
            let cb_3 = document.getElementById('ca_toggle3');
            let cb_4 = document.getElementById('ca_toggle4');
            let cb_5 = document.getElementById('ca_toggle5');
            let cb_6 = document.getElementById('ca_toggle6');
            let cb_7 = document.getElementById('ca_toggle7');

            // 主题色
            let cb_dark_mode = document.getElementById('cb_dark_mode');
            // 导航栏及直播间边框阴影
            let cb_shadow = document.getElementById('cb_shadow');
            // 防刷屏
            let cb_dis_pop = document.getElementById('cb_dispop');
            // 自动网页全屏
            let cb_auto_wfs = document.getElementById('cb_auto_wfs');
            // 自动关闭弹幕
            let cb_auto_cdm = document.getElementById('cb_auto_cdm');
            // 自动选择最高画质
            let cb_auto_shr = document.getElementById('cb_auto_shr');
            // 自动佩戴粉丝牌
            let cb_auto_wfm = document.getElementById('cb_auto_wfm');
            // 键盘功能增强
            let cb_keyboard = document.getElementById('cb_keyboard');

            // 获取两个手动开/关防刷屏的button对象
            let btn_hand_dispop = document.getElementById("btn_hand_dispop");
            let btn_cancel_dispop = document.getElementById("btn_cancel_dispop");

            // 获取 theme 的 arrow more箭头
            let arrow_theme_more_option = document.getElementById('ca_arrow_theme_more_option');

            // 获取 theme 的 所有radiobutton
            const radioContainer = document.getElementById('theme_container');
            const radios = radioContainer.querySelectorAll('input[type="radio"]');

            radios.forEach(radio => {
                radio.addEventListener('change', function () {
                    if (this.checked) {
                        // 当前被选中的radiobutton的值
                        const selectedValue = this.id;
                        // 执行需要的操作
                        switch (selectedValue) {
                            case "rb_theme_dark": {
                                changeThemeColor(color_dark);
                                GM_setValue("theme_color", "dark");
                                break;
                            }
                            case "rb_theme_pink": {
                                changeThemeColor(color_pink);
                                GM_setValue("theme_color", "pink");
                                break;
                            }
                            case "rb_theme_blue": {
                                changeThemeColor(color_blue);
                                GM_setValue("theme_color", "blue");
                                break;
                            }
                            case "rb_theme_deepdark": {
                                changeThemeColor(color_deepdark);
                                GM_setValue("theme_color", "deepdark")
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }
                });
            });

            // 获取单个theme的radiobutton
            let rb_theme_dark = document.getElementById('rb_theme_dark');
            let rb_theme_pink = document.getElementById('rb_theme_pink');
            let rb_theme_blue = document.getElementById('rb_theme_blue');
            let rb_theme_deepdark = document.getElementById('rb_theme_deepdark');

            /******************************************************************************************/
            // 开启自动佩戴粉丝牌后隐藏掉斗鱼自带的佩戴提示框
            let style_hide_wfm = document.createElement('style');
            style_hide_wfm.innerHTML = '.FansMedalDialog{opacity:0;}';


            /* 判断各个Value的值，即用户保存的设置（隐藏内容、开启的功能）*/
            judgeGM_Value();
            function judgeGM_Value() {
                // 键盘功能增强
                if (GM_getValue('is_keyboard')) {
                    cb_keyboard.checked = true;
                } else {
                    cb_keyboard.checked = false;
                }

                // 主题色
                if (GM_getValue('is_darked')) {
                    cb_dark_mode.checked = true;
                    document.head.appendChild(style_dark_mode);
                    // 主题色模式下 阴影
                    if (GM_getValue('is_shadowed')) {
                        document.head.appendChild(style_live_boxshadow);
                    } else {
                        style_live_boxshadow.remove();
                    }
                } else {
                    cb_dark_mode.checked = false;
                    style_dark_mode.remove();
                }

                // 阴影
                if (GM_getValue('is_shadowed')) {
                    cb_shadow.checked = true;
                } else {
                    cb_shadow.checked = false;
                }

                // 切换已选主题色property
                if (GM_getValue("theme_color")) {
                    switch (GM_getValue("theme_color")) {
                        case "dark": {
                            changeThemeColor(color_dark);
                            rb_theme_dark.checked = true;
                            break;
                        }
                        case "pink": {
                            changeThemeColor(color_pink);
                            rb_theme_pink.checked = true;
                            break;
                        }
                        case "blue": {
                            changeThemeColor(color_blue);
                            rb_theme_blue.checked = true;
                            break;
                        }
                        case "deepdark": {
                            changeThemeColor(color_deepdark);
                            rb_theme_deepdark.checked = true;
                            break;
                        }
                    }
                }

                // 直播间功能
                if (document.querySelector('.layout-Player-aside')) {// 如果页面有侧边栏则该页面为直播间
                    console.log("【clearads】is live room");
                    // 键盘功能增强
                    if (GM_getValue('is_keyboard')) {
                        keydownEventHandle();
                    }

                    // 全屏自动隐藏插件按钮
                    // 监听 DOM 变化的方法
                    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                    // 创建一个观察器实例
                    var observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            // 检查是否是 body 元素的类名发生变化
                            if (mutation.target === document.body && mutation.attributeName === 'class') {
                                if (document.body.classList.contains('is-fullScreenPage')) {
                                    document.getElementById('ca_btn_setting').style.display = 'none';
                                    document.getElementById('cb_dark_mode_box').style.display = 'none';
                                } else {
                                    document.getElementById('ca_btn_setting').style.display = 'block';
                                    document.getElementById('cb_dark_mode_box').style.display = 'block';
                                }
                            }
                        });
                    });
                    // 配置观察选项（只针对body元素本身类名，因此childList和subtree为False，尽量节省资源）
                    var config = { attributes: true, childList: false, subtree: false };
                    observer.observe(document.body, config);

                    // 自动网页全屏（fast）
                    if (GM_getValue('is_autowfs')) {
                        let notalive; // nal定时返回对象
                        // 【网页全屏1】先快速网页全屏
                        setTimeout(function () {
                            document.body.classList.add('is-fullScreenPage');
                        }, 3000);

                        // 如果该直播间 未开播
                        let nal_limit_time = 0;
                        notalive = setInterval(function () {
                            let obj_notalive = document.body.querySelector('[class^="labelDes-"]');
                            if (obj_notalive) {
                                if (document.body.classList.contains('is-fullScreenPage')) {
                                    document.body.classList.remove('is-fullScreenPage');
                                }
                                clearInterval(notalive);
                            }
                            if (nal_limit_time > 10) {
                                clearInterval(notalive);
                            }
                        }, 1 * 1000); // 每1秒执行一次
                    }

                    // h5视频功能
                    if (GM_getValue('is_autowfs') || GM_getValue('is_autocdm') || GM_getValue('is_aotoshr')) {
                        let h5function; // 返回定时对象
                        // 【网页全屏2】然后再button网页全屏（修复原本需要两次双击才能退出的bug）
                        let h5function_limit_time = 0;
                        h5function = setInterval(function () {
                            let btn_wfs = document.body.querySelector('[class^="wfs-"]');
                            if (btn_wfs) { // 另外几个选项都是h5工具栏，因此只需要一个存在，其他的都存在
                                if (GM_getValue('is_autowfs')) {
                                    // 自动网页全屏（enhance）
                                    btn_wfs.click();
                                    console.log("【ClearAds】auto webfullscreen success.");
                                }
                                if (GM_getValue('is_autocdm')) {
                                    // 自动关闭弹幕
                                    document.body.querySelector('[class^="showdanmu-"]').click();
                                    console.log("【ClearAds】auto closedanmu success.");
                                }
                                if (GM_getValue('is_autoshr')) {
                                    // 自动选择最高画质
                                    document.body.querySelector('[class^="rate-"][title="清晰度"] ul>li').click();
                                    console.log("【ClearAds】auto select highest rate success.");
                                }
                                // 清除定时
                                clearInterval(h5function);
                            }
                            if (h5function_limit_time > 10) {
                                clearInterval(h5function);
                                console.log("【ClearAds】h5 function open failed.");
                            }
                            h5function_limit_time++;
                        }, 1 * 1000); // 每1秒执行一次
                    }

                    // 自动防刷屏
                    if (GM_getValue('is_dispop')) {
                        setTimeout(function () {
                            disPop();
                        }, 5000);
                    } else {
                        btn_hand_dispop.disabled = false;
                    }

                    // 自动佩戴粉丝牌
                    if (GM_getValue('is_autowfm')) {
                        document.head.appendChild(style_hide_wfm);

                        let wearfansmedal_limit_time = 0;
                        let wfm = setInterval(function () {
                            let btn_wfm = document.body.querySelector('p.FansMedalDialog-wareMedal');
                            if (btn_wfm) {
                                btn_wfm.click();
                                clearInterval(wfm);
                                console.log("【ClearAds】auto wear fansmedal success.");
                            }
                            if (wearfansmedal_limit_time > 10) {
                                clearInterval(wfm);
                                console.log("【ClearAds】auto wear fansmedal failure.");
                            }
                            wearfansmedal_limit_time++;
                        }, 1 * 1000); // 每1秒执行一次
                    }
                }

                // cb 自动防刷屏
                if (GM_getValue('is_dispop')) {
                    cb_dis_pop.checked = true;
                } else {
                    cb_dis_pop.checked = false;
                }
                // cb 自动网页全屏
                if (GM_getValue('is_autowfs')) {
                    cb_auto_wfs.checked = true;
                } else {
                    cb_auto_wfs.checked = false;
                }
                // cb 自动关闭弹幕
                if (GM_getValue('is_autocdm')) {
                    cb_auto_cdm.checked = true;
                } else {
                    cb_auto_cdm.checked = false;
                }
                // cb 自动选择最高画质
                if (GM_getValue('is_autoshr')) {
                    cb_auto_shr.checked = true;
                } else {
                    cb_auto_shr.checked = false;
                }
                // cb 自动佩戴粉丝牌
                if (GM_getValue('is_autowfm')) {
                    cb_auto_wfm.checked = true;
                } else {
                    cb_auto_wfm.checked = false;
                }

                // 其他各个隐藏checkbox
                if (GM_getValue('is_hide1')) {
                    cb_1.checked = true;
                    document.head.appendChild(style_hide_head);
                } else {
                    cb_1.checked = false;
                    style_hide_head.remove();
                }

                if (GM_getValue('is_hide2')) {
                    cb_2.checked = true;
                    document.head.appendChild(style_hide_aside);
                } else {
                    cb_2.checked = false;
                    style_hide_aside.remove();
                }

                if (GM_getValue('is_hide3')) {
                    cb_3.checked = true;
                    document.head.appendChild(style_hide_chattop);
                } else {
                    cb_3.checked = false;
                    style_hide_chattop.remove();
                }

                if (GM_getValue('is_hide4')) {
                    cb_4.checked = true;
                    document.head.appendChild(style_hide_bottom);
                } else {
                    cb_4.checked = false;
                    style_hide_bottom.remove();
                }

                if (GM_getValue('is_hide5')) {
                    cb_5.checked = true;
                    document.head.appendChild(style_hide_guess);
                } else {
                    cb_5.checked = false;
                    style_hide_guess.remove();
                }

                if (GM_getValue('is_hide6')) {
                    cb_6.checked = true;
                    document.head.appendChild(style_hide_level);
                } else {
                    cb_6.checked = false;
                    style_hide_level.remove();
                }

                if (GM_getValue('is_hide7')) {
                    cb_7.checked = true;
                    document.head.appendChild(style_hide_chattool);
                } else {
                    cb_7.checked = false;
                    style_hide_chattool.remove();
                }
            } // function judgeGM_Value()

            /******************* 为各个CheckBox添加点击事件*****************/
            // 键盘功能增强cb
            cb_keyboard.addEventListener("click", function () {
                if (cb_keyboard.checked) {
                    GM_setValue('is_keyboard', true);
                } else {
                    GM_setValue('is_keyboard', false)
                }
            });
            // 主题色cb
            cb_dark_mode.addEventListener("click", function () {
                if (cb_dark_mode.checked) {
                    document.head.appendChild(style_dark_mode);
                    GM_setValue('is_darked', true);
                    if (GM_getValue('is_shadowed')) {
                        document.head.appendChild(style_live_boxshadow);
                    }
                } else {
                    style_dark_mode.remove();
                    GM_setValue('is_darked', false);
                    style_live_boxshadow.remove();
                }
            });

            // 主题色模式下 导航栏及直播间边框阴影 cb
            cb_shadow.addEventListener("click", function () {
                if (cb_shadow.checked) {
                    GM_setValue('is_shadowed', true);
                    if (GM_getValue('is_darked')) {
                        document.head.appendChild(style_live_boxshadow);
                    }
                } else {
                    GM_setValue('is_shadowed', false);
                    if (GM_getValue('is_darked')) {
                        style_live_boxshadow.remove();
                    }
                }
            })

            // 防刷屏cb
            cb_dis_pop.addEventListener("click", function () {
                if (cb_dis_pop.checked) {
                    GM_setValue('is_dispop', true);
                } else {
                    GM_setValue('is_dispop', false);
                }
            });

            // 自动网页全屏cb
            cb_auto_wfs.addEventListener("click", function () {
                if (cb_auto_wfs.checked) {
                    GM_setValue('is_autowfs', true);
                } else {
                    GM_setValue('is_autowfs', false);
                }
            });

            // 自动关闭弹幕
            cb_auto_cdm.addEventListener("click", function () {
                if (cb_auto_cdm.checked) {
                    GM_setValue('is_autocdm', true);
                } else {
                    GM_setValue('is_autocdm', false);
                }
            })

            // 自动选择最高画质
            cb_auto_shr.addEventListener("click", function () {
                if (cb_auto_shr.checked) {
                    GM_setValue('is_autoshr', true);
                } else {
                    GM_setValue('is_autoshr', false);
                }
            })

            // 自动佩戴粉丝牌cb
            cb_auto_wfm.addEventListener("click", function () {
                if (cb_auto_wfm.checked) {
                    GM_setValue('is_autowfm', true);
                    document.head.appendChild(style_hide_wfm);
                } else {
                    GM_setValue('is_autowfm', false);
                    style_hide_wfm.remove();
                }
            });


            // 其他CheckBox的点击事件
            cb_1.addEventListener("click", function () {
                if (cb_1.checked) {
                    document.head.appendChild(style_hide_head);
                    GM_setValue('is_hide1', true);
                } else {
                    style_hide_head.remove();
                    GM_setValue('is_hide1', false);
                }
            });

            cb_2.addEventListener("click", function () {
                if (cb_2.checked) {
                    document.head.appendChild(style_hide_aside);
                    GM_setValue('is_hide2', true);
                } else {
                    style_hide_aside.remove();
                    GM_setValue('is_hide2', false);
                }
            });

            cb_3.addEventListener("click", function () {
                if (cb_3.checked) {
                    document.head.appendChild(style_hide_chattop);
                    GM_setValue('is_hide3', true);
                } else {
                    style_hide_chattop.remove();
                    GM_setValue('is_hide3', false);
                }
            });

            cb_4.addEventListener("click", function () {
                if (cb_4.checked) {
                    document.head.appendChild(style_hide_bottom);
                    GM_setValue('is_hide4', true);
                } else {
                    style_hide_bottom.remove();
                    GM_setValue('is_hide4', false);
                }
            });

            cb_5.addEventListener("click", function () {
                if (cb_5.checked) {
                    document.head.appendChild(style_hide_guess);
                    GM_setValue('is_hide5', true);
                } else {
                    style_hide_guess.remove();
                    GM_setValue('is_hide5', false);
                }
            });

            cb_6.addEventListener("click", function () {
                if (cb_6.checked) {
                    document.head.appendChild(style_hide_level);
                    GM_setValue('is_hide6', true);
                } else {
                    style_hide_level.remove();
                    GM_setValue('is_hide6', false);
                }
            });

            cb_7.addEventListener("click", function () {
                if (cb_7.checked) {
                    document.head.appendChild(style_hide_chattool);
                    GM_setValue('is_hide7', true);
                } else {
                    style_hide_chattool.remove();
                    GM_setValue('is_hide7', false);
                }
            });

            /*********************more arrow 点击事件************ */
            arrow_theme_more_option.addEventListener("click", function () {
                let theme_row = document.getElementById('ca_theme_row');
                theme_row.classList.toggle("show_more_option");
            })

            // 手动开、关防刷屏按钮点击事件

            // 开启按钮点击事件
            btn_hand_dispop.addEventListener("click", function () {
                btn_hand_dispop.disabled = true;
                let dispop_time = document.getElementById('dispop_time');
                let select_index = dispop_time.selectedIndex;
                let dispop_time_value = dispop_time.options[select_index].value
                disPop(dispop_time_value);
            });

            // 关闭按钮点击事件
            btn_cancel_dispop.addEventListener("click", function () {
                btn_cancel_dispop.disabled = true;
                btn_hand_dispop.disabled = false;
                btn_hand_dispop.innerHTML = "开启";
                clearInterval(clear_chatmsg); // 停止 => 循环清空消息屏蔽消息列表的
                dispop_observer.disconnect(); // 停止 => 消息列表的监视
                console.log("【ClearAds】防刷屏已手动关闭");
            });

            var clear_chatmsg;
            var dispop_observer;
            function disPop(time_min = 5) { //默认参数为5分钟
                let chat_list = document.querySelector("#js-barrage-list");
                let chatmsg = new Array();
                if (chat_list) {
                    console.log('【ClearAds】防刷屏已开启.（屏蔽时间范围' + time_min + '分钟）');
                    btn_hand_dispop.innerHTML = "已开启";
                    btn_cancel_dispop.disabled = false;
                    // 创建 MutationObserver 对象
                    dispop_observer = new MutationObserver(function (mutations) {
                        // 遍历每个变化
                        mutations.forEach(function (mutation) {
                            // 遍历每个被添加的元素
                            mutation.addedNodes.forEach(function (node) {
                                // 判断节点元素
                                if (node.nodeType === 1 && node.nodeName === 'LI' && node.classList.contains('Barrage-listItem')) {
                                    // 获取用户昵称对象
                                    let username = node.querySelector(".Barrage-nickName");
                                    // 获取用户消息内容对象
                                    let usercontent = node.querySelector(".Barrage-content");
                                    // 获取第用户昵称 文本内容
                                    let usernameText = username.textContent.trim();
                                    // 获取用户消息 文本内容
                                    let usercontentText = usercontent.textContent.trim();
                                    // 合并两个文本内容为一个字符串
                                    let mergedText = usernameText + "：" + usercontentText;
                                    if (chatmsg.includes(mergedText)) {
                                        node.remove();
                                        console.log('【ClearAds】 ' + mergedText + " --- " + new Date(Date.now()).toLocaleString());
                                        // console.log('【ClearAds】remove chat message ok.');
                                    } else {
                                        chatmsg.push(mergedText);
                                    }
                                }
                            });
                        });
                    });
                    // 配置 MutationObserver 对象
                    let config = { childList: true, subtree: true };
                    // 在聊天信息列表上开始监视变化
                    dispop_observer.observe(chat_list, config);
                    // 每5分钟清空数组
                    clear_chatmsg = setInterval(function () {
                        chatmsg.length = 0;
                        console.log("【ClearAds】chat message array cleared.");
                    }, time_min * 60 * 1000); // 5分钟
                } else {
                    console.log("【ClearAds】因网络原因自动防刷屏未开启成功，请手动开启");
                    btn_hand_dispop.disabled = false;
                }
            } // disPop -- funciton

            function keydownEventHandle() {

                document.addEventListener('keydown', function (event) {
                    var target = event.target || event.srcElement;
                    if (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea') {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            // 聚焦直播间聊天输入框
                            document.querySelector('textarea.ChatSend-txt').focus();
                        }
                        if (event.key === 'Escape') {
                            event.preventDefault();
                            // 退出网页全屏
                            if (document.body.classList.contains('is-fullScreenPage')) {
                                document.querySelector('#room-html5-player [class^="wfs-exit-"]').click();
                            }
                        }
                        if (event.key === 'f') {
                            event.preventDefault();
                            // 全屏/取消全屏
                            document.querySelectorAll('#room-html5-player [class^="fs-"]').forEach(function (elem) {
                                if (!elem.classList.toString().includes('removed')) {
                                    elem.click();
                                }
                            });

                        }
                        if (event.key === 'w') {
                            event.preventDefault();
                            // 网页全屏/取消网页全屏
                            if (document.body.classList.contains('is-fullScreenPage')) {
                                document.querySelector('#room-html5-player [class^="wfs-exit-"]').click();
                            } else {
                                document.querySelector('#room-html5-player [class^="wfs-"]').click();
                            }
                        }
                        if (event.key === 'm') {
                            event.preventDefault();
                            // 静音/取消静音
                            document.querySelector('#room-html5-player [class^="volume-"]').click();
                        }
                        if (event.key === 'r') {
                            event.preventDefault();
                            // 重新加载直播
                            document.querySelector('#room-html5-player [class^="reload-"]').click();
                        }
                        if (event.key === 'd') {
                            event.preventDefault();
                            // 开关弹幕
                            if (document.querySelector('#room-html5-player [class^="hidedanmu-"]').classList.toString().includes('removed')) {
                                document.querySelector('#room-html5-player [class^="showdanmu-"]').click();
                            } else {
                                document.querySelector('#room-html5-player [class^="hidedanmu-"]').click();
                            }
                        }
                        if (event.key === 's') {
                            event.preventDefault();
                            // 打开设置
                            document.querySelector('#ca_overlay').style.display = "flex";
                        }

                    } else {
                        if (event.key === 'Escape') {
                            event.preventDefault();
                            // 取消聚焦聊天输入框
                            target.blur();
                        }
                    }
                });

            } // function keydownEventHandle()键盘事件处理

            function changeThemeColor(theme_color) {
                const root = document.documentElement;
                root.style.setProperty('--theme-background-color1', theme_color[0]);
                root.style.setProperty('--theme-background-color2', theme_color[1]);
                root.style.setProperty('--theme-background-color3', theme_color[2]);
                root.style.setProperty('--theme-background-color4', theme_color[3]);
                root.style.setProperty('--theme-color1', theme_color[4]);
                root.style.setProperty('--theme-color2', theme_color[5]);
            } // function changeThemeColor()更改颜色

        } // onload -- function
    })(); // 主function -- function
}; // 最外层判断当前页面是否是主页面