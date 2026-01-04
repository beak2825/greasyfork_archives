// ==UserScript==
// @name         哔哩哔哩暗黑模式（试行）
// @namespace    https://github.com/uurin
// @version      0.0.2
// @description  为B站添加暗黑模式的样式，目前包含用户空间、文章
// @author       courin
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425489/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%EF%BC%88%E8%AF%95%E8%A1%8C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/425489/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%EF%BC%88%E8%AF%95%E8%A1%8C%EF%BC%89.meta.js
// ==/UserScript==

(function() {
        'use strict';
        var style = '<style>'+
            ':root { --bg: #323336; --panel: #222222; --textAccent: #fb7299; --text: #dfdfdf; --textPale: #bbbbbb;}'+ // 变量
            '::-webkit-scrollbar { width: 10px; height: 10px;} '+ // 滚动条整体
            '::-webkit-scrollbar-thumb { border-radius: 4px; box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); background: var(--textAccent);} '+ //滚动条里面小方块
            '::-webkit-scrollbar-track-piece  { box-shadow: inset 0 0 5px rgba(0,0,0,0.2); background: #333;} '+ //滚动条里面轨道
            'html, body, #app { background: var(--bg); color: var(--text); } '+ // 网页根背景
            /*****************************************“用户个人空间/space”的样式**********************************************************/
            '.international-header .mini-type, .van-popover .mini-type { background: var(--panel); color: var(--text); }'+ // 标题栏
            '.international-header .mini-type .nav-link .nav-link-ul .nav-link-item .link, .van-popover .mini-type .nav-link .nav-link-ul .nav-link-item .link { color: var(--text); }'+ // 标题栏左侧链接按钮
            '.international-header .mini-type .nav-link .nav-link-ul .nav-link-item .link:hover, .van-popover .mini-type .nav-link .nav-link-ul .nav-link-item .link:hover { color: var(--textAccent); }'+ // hover
            '.mini-type .nav-user-center .user-con .item .name {  color: var(--text);  }'+ // 标题栏右侧链接按钮
            '#navigator-fixed, .n .n-inner { background: var(--panel); color: var(--text); box-shadow: none; }'+ // fixed悬浮的标题栏
            '.n .n-data .n-data-v { color: var(--text);}'+ // 悬浮标题栏内右侧文字
            '.h-inner { opacity: 0.75; }'+ // 空间封面图
            '.space_input { background: var(--bg); color: var(--text)!important; border: 1px solid #000!important;}'+ // 页面中间的搜索框
            /* 用户空间的子页面——关注数、粉丝数子面板*/
            '#page-follows .follow-sidenav .follow-list-container .follow-item { color: var(--text); }'+ // 左侧关注的up的分类列表
            '#page-follows .follow-sidenav .follow-list-container .follow-item:hover { background: var(--bg);}'+ // 的聚焦高亮
            '#page-follows .follow-sidenav .follow-list-container .follow-item.cur:hover { background: #00a1d6; }'+ // 的当前高亮（修）
            '#page-follows .follow-sidenav .nav-container.follow-container { border-bottom: 1px solid #567; }'+ // 左侧底部分隔符1
            '#page-follows .follow-sidenav { border-right: 0; border-bottom: 1px solid #567;}'+ // 左侧底部分隔符2
            '#page-follows .follow-main { border-left: 1px solid var(--bg); }'+ // 主体的左边框
            '.col-full { background: var(--panel); color: var(--text); box-shadow: 0 0 0 1px #333; }'+ // 主体内容
            '.breadcrumb .item.cur { color: var(--text); }'+ // 面包屑的选项
            '.follow-tabs { color: var(--text)!important; }'+ // 小选项卡——最常访问最近关注
            '.relation-list .list-item, .follow-header { border-bottom: 1px solid #345!important; }'+ // 分隔符
            /* 用户空间的子页面——主页*/
            '#page-index .col-1 { background: var(--panel); border: none; }'+ // 左侧背景
            '#page-index .col-2 .section, #page-index .col-2 .section:last-child { background: var(--panel); border: none; }'+ // 右侧卡片背景
            /* 用户空间的子页面——动态*/
            '.card, .loading-content, .feed-card .empty-content { background: var(--panel)!important; border: none!important; }'+ // 卡片背景和边框
            '.card-content .repost, .card-content .not-support, .card-content .deleted { background: var(--bg)!important; }'+ // 动态内的转发
            '#page-dynamic .col-2 .section, .user .info .meta { background: var(--panel); border: none; color: var(--text);  }'+ // 右侧卡片
            '.card-content .video-container {  background: var(--panel); border: 1px solid #345; color: var(--text)!important; }'+ // 子动态的视频卡片
            '.card-content .video-container .text-area .title { color: unset; }'+ // 子动态的视频卡片内标题
            /*  用户空间的子页面——投稿 */
            '.contribution-sidenav { color: var(--text); border-right: 1px solid var(--bg); }'+ //
            '.contribution-sidenav~.main-content { border-left: 1px solid var(--bg); }'+ //
            /*  用户空间的子页面——收藏 */
            '#page-fav .fav-sidenav { color: var(--text); }'+ // 左侧分类的列表
            '#page-fav .fav-main .small-item { border: 1px solid var(--panel); }'+ // 右侧视频的列表
            /*  用户空间的子页面——追番 */
            '.pgc-space-follow-item .pgc-item-info .pgc-item-title, .pgc-space-follow-item .pgc-item-info .pgc-item-desc { color: unset; }'+ // 番的标题和简介
            /*  用户空间的子页面——设置 */
            '.section-title { color: unset; }'+ //
            /*****************************************“动态详情”的样式**********************************************************/
            '.bb-comment, .comment-bilibili-fold { background: var(--panel); }'+ // 评论区背景
            '.bb-comment .comment-send-lite.comment-send-lite { background: var(--panel); }'+ // 评论区底部悬浮区
            '.paging-box .next, .paging-box .prev, .paging-box .tcd-number, .paging-box .dian { color: unset; }'+ // 评论区的其他页码
            ''+ //
            /*****************************************“消息中心”的样式**********************************************************/
            '#link-message-container .space-left { background: var(--panel); }'+ // 左侧
            '#link-message-container .space-right { background: var(--bg); }'+ // 右侧
            '#link-message-container .space-right .card { box-shadow: none; background: var(--panel)!important; }'+ // 右侧
            '#link-message-container .space-right .card .link-progress-tv { background-color: var(--panel)!important; }'+ // 右侧loadding
            '#link-message-container .divider { border-color: #444; }'+ // 分隔线
            '#link-message-container .space-right .card div::after { border-color: #444; }'+ // 分隔线
            '#link-message-container .line-1 { color: var(--textPale); }'+ // 右侧内的”等总计几人“
            '#link-message-container .line-1 .name-field { color: var(--text); }'+ // 右侧内的用户名
            '#link-message-container .side-bar .title { color: var(--text); }'+ // 左上”消息中心“
            '#link-message-container .space-right .space-right-top .title { background: var(--panel); color: var(--text); box-shadow: none; }'+ // 右侧顶部标题
            '#link-message-container .space-right .card.system-item .title { color: var(--textPale); }'+ // 系统通知标题
            '#link-message-container .bili-im, #link-message-container .message-list, #link-message-container .send-box { background: var(--panel); color: var(--text); }'+ // 私信
            '#link-message-container .dialog .title { color: var(--text); border-color: #444; }'+ // 右侧b标题私信的用户名
            '#link-message-container .message .message-content { background: var(--bg); color: var(--text);}'+ // 私信气泡
            '#link-message-container .msg-notify { background: var(--bg); color: var(--text); }'+ // 私信的通知卡片
            '#link-message-container .msg-notify .title { color: var(--text); }'+ // 私信的通知卡片标题
            '#link-message-container .msg-notify .content, #link-message-container .msg-notify .link { color: var(--textPale); }'+ // 私信的通知卡片内容
            '#link-message-container .list-item .name { color: var(--text); }'+ // 私信的用户名
            '#link-message-container .list-item:hover { background: var(--bg); }'+ // 鼠标悬停私信用户的高亮
            '#link-message-container .list-container .active { background: var(--bg); }'+ // 当前私信用户高亮
            '#link-message-container .bili-im .left .title, #link-message-container .bili-im .left, #link-message-container .send-box { border-color: #444; }'+ // 处理私信的边框
            '#link-message-container .config { background: var(--panel); color: var(--text); }'+ // 消息设置
            '.radio-selector { color: var(--text); }'+ // 选项
            /*****************************************“专栏/文章”的样式**********************************************************/
            /* 专栏——文章详情*/
            '.page-container { background: var(--bg); color: var(--text); }'+ //
            '.nav-tab-bar .tab-item { color: var(--text); }'+ // 左侧专栏分类
            '.title-container .title { color: unset; }'+ // 文章标题
            '.article-holder {  color: var(--text); }'+ // 文章正文
            '.page-container .comment-holder .bb-comment { background: var(--bg);}'+ // 文章评论（与上面的评论有冲突所以特制了）
            '.up-info-holder .fixed-box .up-article-list-block .block-title { color: unset; }'+ // 右侧标题：“推荐文章“
            '.up-info-holder .fixed-box .up-article-list-block .article-list .article-item .article-title { color: var(--text); }'+ // 右侧推荐文章
            '.up-info-holder .fixed-box .more .top-bar { color: unset; }'+ // 右侧“更多”
            '.up-info-holder .fixed-box .more .help .title, .up-info-holder .fixed-box .more .link .title {  color: var(--text); }'+ // 右侧更多的底部
            /* 专栏——首页*/
            '.page-content .left-side .partitio-name { color: unset; }'+ // 标题
            '.page-content .left-side .article-list .article-list-holder .article-item { background: unset;}'+ // 文章卡片
            '.page-content .left-side .article-list .article-list-holder .article-item .item-holder .article-title-holder { color: var(--text); }'+ // 文章卡片内的标题
            '.page-content .right-side .rank-module .rank-tabs-bar label { color: unset; }'+ // 右侧文字”排行榜“
            '.page-content .right-side .rank-module .rank-list .item { background: unset; }'+ // 右侧排行榜
            '.page-content .right-side .rank-module .rank-list .item a { color: var(--text); }'+ // 右侧排行榜的内容
            '.page-content .right-side .up-list { background: unset; }'+ // 右侧下面最新投稿的up主
            '.page-content .right-side .up-list .up-item .info-holder .head .nick-name, .page-content .right-side .up-list .title { color: var(--text); }'+ // 右侧下面的用户名
            '.page-content .right-side .more .top-bar, .page-content .right-side .more .help .title, .page-content .right-side .more .link .title { color: var(--text); }'+ // 右侧下面更多
            '</style>';
        var element=document.createElement('div');
        element.innerHTML=style;
        document.documentElement.appendChild(element.firstElementChild);
})();
