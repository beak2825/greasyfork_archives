// ==UserScript==
// @name         夜间模式修复
// @namespace    http://tampermonkey.net/
// @version      1.2.14
// @description  修复Bilibili Evolved (Offline)-V1的夜间模式
// @author       aotmd
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/watchlater/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/opus/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445626/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445626/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
(function () {
    let flag;
    let setting = {
        /*可用的值:[true|false]*/
        自动切换: true,
        开始时间: '18:00',
        结束时间: '6:00',
        搜索样式更改:true
    };
    if (GM_getValue('flag') !== undefined) {
        flag = GM_getValue('flag')
    } else {
        GM_setValue('flag', true);
        flag = true;
    }
    let styleElement = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(`
            /*------------------------------------------------视频页------------------------------------------------*/
            /*视频播放页规则*/
            .v-wrap {
                background-color: #222 !important;
            }

            .video-sections-content-list {
                background: black;
            }

            .video-episode-card__info.video-episode-card__info-playing {
                background-color: #6e6d6d !important;
            }

            .s_tag .tag-area .tag-item {
                background: #444 !important;
            }

            /*播放器底部染黑,去除发光阴影*/
            .bpx-player-sending-area {
                background: #222222;
            }

            div#bilibili-player-placeholder-bottom {
                background: #333;
            }
            /*播放器阴影*/
            div#bilibili-player-placeholder {
                box-shadow: 0 0 2px var(--bg3) !IMPORTANT;
            }

            /*播放器下分享窗口*/
            .van-popover.van-popper.video-share-popover {
                --bg1: #222;
                --bg2: #333;
                color: snow !important;
            }

            /*主题色更改*/
            body.harmony-font.win.round-corner.dark {
                --text1: #eee;
                --graph_bg_regular: #444;
            }
            /*浮动评论回复窗口*/
            .reply-box.fixed-box {
                --bg1: #333;
            }

            /*投币窗口*/
            .coin-operated-m-exp {
                --bg1_float: #222;
            }

            /*视频标签染色*/
            .tag-panel,
            .comment-container {
                background-color: #222 !important;
            }
            /*标签窗口染色*/
            .detail-channel-popup {
                --bg1_float: #222;
            }


            /*1.1.9 充电按钮颜色变得不那么明显*/
            .default-btn.old-charge-btn.following-charge-btn {
                --bg1: #444;
                background: #444;
                border: 0px;
            }

            .default-btn.new-charge-btn.charge-btn-loaded {
                background-color: #444 !important;
                color: var(--text1);
                border: 1px solid #444 !important;
            }

            .default-btn.old-charge-btn.not-follow-charge-btn {
                --bg1: #444;
                --brand_blue: snow;
                border: 0px;
            }

            /*播放列表*/
            .action-list-container {
                background: #444 !important;
            }

            /*播放列表视频播放页收藏夹颜色补充*/
            .collection-m-exp {
                --bg1_float: #444 !important;
            }
            /*番剧页*/
            div#eplist_module {
                --Ga1_s: #333;
            }
            .numberListItem_number_list_item__T2VKO {
                background-color: #444;
            }
            .eplist_ep_list_wrapper__Sy5N8 {
                --graph_bg_regular: #444;
            }

            /*稍后播放页头部*/
            .watch-later-list>header {
                background: unset;
            }

            /*1.1.8 人人平等,将楼中楼会员颜色与非会员统一*/
            .sub-reply-item {
                --0a74c5b9: #b8bcc3 !important;
            }
            /*1.2.7 AI总结染色*/
            .ai-summary-popup-body {
                background: black;
            }
            .ai-summary-popup-body-abstracts{
                color:snow;
            }
            ._InteractWrapper_tepst_1 {
                --app_bg: #333;
                --app_graph_bg: #333;
                --bg1_float: #333;
            }
            ._VideoAssistant_196qs_1._Light_196qs_12 {
                --app_bg: #333;
            }
            /*1.2.8 番剧页面*/
            body.round-corner.dark {
                --text1: snow;
                --Ga1: #333;
            }
            .main-container {
                background: #222;
            }
            span#ogv_weslie_up_info {
            background: #333;
            }
            .SectionSelector_selectorDropdown__dl7U0 {
                background: #444!important;
            }
            /* 1.2.9 biliscope AI总结染色*/
            div#biliscope-ai-summary-outline {
                background-color: #444;
                color: snow;
            }
            .biliscope-ai-summary-popup-body-outline .ai-summary-section:hover {
                background: #333;
            }
            ._VideoAssistant_196qs_1 {
                --app_bg: #333;
            }

            /*------------------------------------------------动态页------------------------------------------------*/
            /*1.2.6 动态字体颜色修正*/
            body.round-corner.dark {
                --text1: snow;
                --Ga9: snow;
            }
            /*动态页规则*/
            #app .bili-dyn-item div {
                color: #e5e5e5;
                box-sizing: border-box;
            }
            #app .bili-dyn-item {
                background-color: #444!important;
                color: #e5e5e5;
                box-sizing: border-box;
            }
            /*转发栏*/
            #app .bili-dyn-content__orig.reference {
                background-color: #222!important;
                border: 2px solid;
            }

            #app .bili-dyn-title__text {
                color: white;
            }
            /*up主名称*/
            #app span.bili-dyn-title__text.bili-dyn-title__text {
                color: snow!important;
            }


            /*动态页UP主浮窗*/
            #app .bili-user-profile {
                background: #444;
                color: #e5e5e5;
            }

            #app .bili-user-profile-view__info__stat span {
                color: #a3a3a3;
            }

            /*动态外显精彩评论*/
            #app span.bili-rich-text-module.at {
                color: #e5e5e5;
            }

            /*动态页视频详情背景*/
            #app .bili-dyn-card-video__body {
                background: #444!important;
            }

            /*动态页专栏预览*/
            #app a.bili-dyn-card-article {
                background: #444;
            }

            /*动态页,转载视频着色*/
            #app .dyn-ugc__wrap {
                background-color: #444 !important;
            }

            /*动态页,直播预览着色*/
            #app .dyn-reserve .dyn-reserve__card {
                background-color: #444;
            }

            /*动态页,相关装扮着色*/
            #app .dyn-additional-common__wrap {
                background: #444;
            }
            /*1.2.3动态页,商品栏着色*/
            #app .dyn-goods__wrap {
                background: #333;
            }

            /*动态页图片控制栏*/
            #app .bili-album__watch__control {
                background: #444;
            }

            /*动态页中上部分*/
            #app .bili-dyn-publishing {
                background: #444;
            }

            /*1.1.2 动态页投票*/
            #app .dyn-vote__body {
                background: #444;
            }

            /*1.1.2 动态页直播*/
            #app .bili-dyn-card-live__body {
                background: #444;
            }

            #app .bili-dyn-up-list {
                background: #444;
            }

            #app .bili-dyn-list-tabs__list {
                background: #444;
            }

            #app .bili-dyn-up-list__item__name.bili-ellipsis {
                color: #e5e5e5;
            }

            #app .bili-dyn-list-tabs__item {
                color: #e5e5e5;
            }

            /*动态左侧栏着色*/
            #app .bili-dyn-live-users {
                background: #444;
            }

            #app .bili-dyn-live-users__item__uname.bili-ellipsis {
                color: #e5e5e5;
            }

            #app .bili-dyn-live-users__item__title.bili-ellipsis {
                color: #e5e5e5;
            }

            #app .bili-dyn-live-users__title {
                color: white;
            }

            /*动态页自身名片*/
            #app .bili-dyn-my-info {
                background: #444;
            }

            /*动态页公告*/
            #app .bili-dyn-banner {
                background: #444;
            }

            /*动态页右侧栏*/
            #app .topic-panel {
                background: #444;
            }

            #app span.topic-panel__nav-title {
                color: #e5e5e5;
            }

            #app .relevant-topic__title {
                color: #e5e5e5;
            }
            /*1.2.4 修正字体白色*/
            body.win.round-corner.dark {
                --text1: snow!important;
            }

            /*------------------------------------------------直播页------------------------------------------------*/
            /*直播顶部修复*/
            div#head-info-vm {
                background-color: #444 !important;
            }
            /*顶栏*/
            nav.link-navbar.p-relative.supportWebp {
            --bg1: #333;
            }
            /*礼物详情窗口*/
            .content {
                --bg1: #333;
            }

            /*------------------------------------------------搜索页------------------------------------------------*/
            /*1.1.5搜索页修复,改了下辣眼睛的搜索页面*/
            a.text1 {
                color: snow !important;
            }
            /*1.2.5 修正搜索框颜色*/
            .search-input-wrap.flex_between {
                background: #444!important;
            }
            div#bili-header-container {
                background: #222!important;
            }
            .search-fixed-header.search-sticky-header {
                background: #333!important;
            }
            /*1.2.12 稍后再看*/
            section.watchlater-list-container.watchlater-list-container--list {
                background: #444;
            }
            body.round-corner.dark {
                --bg1: #333;
                --v_bg1: #333;
            }
            `));
    if (flag) {
        styleElement.setAttribute("type",'text/css');
    } else {
        styleElement.setAttribute("type",'text');
    }
    if(setting.自动切换){
        window.setInterval(() => {
            if (new Date().getHours() >= new Date('1900/1/1 '+setting.开始时间).getHours()) {
                if(flag)return;
                flag = true;
                styleElement.setAttribute("type",'text/css');
            }
            if (new Date().getHours() < new Date('1900/1/1 '+setting.开始时间).getHours() &&
                new Date().getHours() >= new Date('1900/1/1 '+setting.结束时间).getHours()) {
                if(!flag)return;
                flag = false;
                styleElement.setAttribute("type",'text');
            }
            GM_setValue('flag', flag);
        }, 1000);
    }
    let a1 = document.createElement('button');
    a1.className = "gt1 button2";
    document.body.appendChild(a1);
    a1.innerText = "黑暗模式";
    a1.onclick = function () {
        flag = !flag;
        if (flag) {
            styleElement.setAttribute("type",'text/css');
        } else {
            styleElement.setAttribute("type",'text');
        }
        GM_setValue('flag', flag);
    };

    addStyle(`
    .gt1 {
        padding: 5px 5px;
        font-size: 14px;
        color: snow;
        position: fixed;
        border-radius: 4px;
        right: 5px;
        top: 10%;
        z-index: 999999;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 4px 2px;
        -webkit-transition-duration: 0.4s;/* Safari */
        transition-duration: 0.4s;
        cursor: pointer;
        background-color: #4CAF50;
        border: 2px solid #4CAF50;
    }
    .gt1:hover {
        background-color: white;
        color: black;
    }
    .button2:hover {
        font-size: 14px;
        padding: 5px 10px;
        -webkit-transition: 0.5s;
        opacity: 1;
        margin: -3px 2px;
        right: 5px;
    }
    .button2 {
        padding: 0px;
        font-size: 12px;
        opacity: 0.2;
        right: -40px;
    }
    `);
    if(setting.搜索样式更改){
        addStyle(`
            /*1.1.5搜索页修复,改了下辣眼睛的搜索页面*/
            /*改成每行显示4个*/
            .col_md_2 {
                flex: 5 0 20.666667%;
                max-width: 30.666667%;
            }
            /*专栏改成每行显示一个*/
            .col_6.mb_x40 {
                flex: 0 0 100%;
                max-width: 100%;
                /* left: 281px; */
            }
            /*宽度限制从100%改为80%*/
            .i_wrapper {
                width: 80%;
                max-width: 2200px;
                margin: 0 auto;
                padding: 0 56px;
            }
        `);
    }

    /**
     * 添加浏览器执行事件
     * @param func 无参匿名函数
     */
    function addLoadEvent(func) {
        let oldOnload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                try {
                    oldOnload();
                } catch (e) {
                    console.log(e);
                } finally {
                    func();
                }
            }
        }
    }

    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
})();