// ==UserScript==
// @name         bilibili.com精简
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  精简bilibili.com，对标YouTube。
// @author       imldy
// @match        *.bilibili.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425789/bilibilicom%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/425789/bilibilicom%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    function css_hide(condition) {
        GM_addStyle(condition + ' { display: none !important; }');
    }
    // ————页面头部————
    // ——设为不可见——
    // "下载APP"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(8)')
    // "赛事"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(7)')
    // "漫画"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(6)')
    // "会员购"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(5)')
    // "直播"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(4)')
    // "游戏中心"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(3)')
    // "番剧"按钮
    css_hide('#internationalHeader > div > div > div.nav-link > ul > li:nth-child(2)')
    // "大会员"按钮
    css_hide('#internationalHeader > div > div > div.nav-user-center > div.user-con.signin > div:nth-child(2)')
    // "投稿"按钮
    css_hide('#internationalHeader > div > div > div.nav-user-center > div:nth-child(3)')
    // --修改元素内容--
    // 搜索框营销提示修改为"搜索"
    // var serach_input = document.querySelector("#nav_searchform > input");
    // serach_input.placeholder = "搜索";
    
    // ————页面中部————
    // ——设为不可见——
    // 标题旁的“活动作品”等标签
    css_hide('#viewbox_report > h1 > a')
    // "记笔记"按钮
    css_hide('#arc_toolbar_report > div.rigth-btn > div:nth-child(2)')
    // 右侧"弹幕列表"下放的广告
    css_hide('#app > div.v-wrap > div.r-con > a.ad-report')
    // 视频下方分享按钮
    css_hide('#arc_toolbar_report > div.ops > span.share')
    // 视频下方不明横幅
    css_hide('#activity_vote > div')
    

})();
