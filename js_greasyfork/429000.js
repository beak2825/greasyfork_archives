// ==UserScript==
// @name         哔哩哔哩专注助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  哔哩哔哩专注助手。看公开课专注神器。
// @author       Bowen
// @match        *.bilibili.com/video/*
// @match        *.bilibili.com/s/video/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429000/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%B3%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429000/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%B3%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//modified from imldy's script bilibili.com精简 v0.21

(function() {
    function css_hide(condition) {
        GM_addStyle(condition + ' { display: none !important; }');
    }
    // ——设为不可见——
    // 顶部菜单栏
    css_hide('#internationalHeader')
    // 标题旁的“活动作品”等标签
    css_hide('#viewbox_report > h1 > a')
    // 右侧"弹幕列表"下放的广告
    css_hide('#app > div.v-wrap > div.r-con > a.ad-report')
    // 右侧"弹幕列表"下放的广告
    css_hide('#app > div.v-wrap > div.r-con > div.pop-live')
    // 视频下方分享按钮
    css_hide('#arc_toolbar_report > div.ops > span.share')
    // 视频下方不明横幅
    css_hide('#activity_vote > div')
    // 推荐列表
    css_hide('#app > div.v-wrap > div.r-con > div.recommend-list')
    // 视频下方标签
    css_hide('#v_tag')
    // 更多按钮
    css_hide('#arc_toolbar_report > div.more')
    // 投诉稿件
    css_hide('#arc_toolbar_report > div.rigth-btn >  div.appeal-text')
    // 评论区上方广告通知
    css_hide('#reply-notice')

})();
