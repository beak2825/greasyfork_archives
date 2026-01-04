// ==UserScript==
// @name         国科大社区 风格修改
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  优化显示
// @author       ZRui-C
// @match        https://gkder.ucas.ac.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545024/%E5%9B%BD%E7%A7%91%E5%A4%A7%E7%A4%BE%E5%8C%BA%20%E9%A3%8E%E6%A0%BC%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/545024/%E5%9B%BD%E7%A7%91%E5%A4%A7%E7%A4%BE%E5%8C%BA%20%E9%A3%8E%E6%A0%BC%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* 主题颜色 */
        :root {
            --primary-bg: #f5f5f7;       /* 主背景色 */
            --secondary-bg: #ffffff;     /* 次背景色 */
            --accent-color: #007aff;     /* 强调颜色 */
            --accent-hover: #0051b5;     /* 强调颜色悬停 */
            --text-color: #1d1d1f;       /* 正文颜色 */
            --secondary-text-color: #6e6e73; /* 次要文本颜色 */
            --border-radius: 8px;        /* 圆角半径 */
            --shadow: 0 1px 3px rgba(0,0,0,0.08); /* 阴影效果 */
        }

        /* 基本页面样式 */
        body, html {
            background-color: var(--primary-bg) !important;
            color: var(--text-color) !important;
        }

        /* 背景和圆角 */
        .backgrwb {
            background-color: var(--secondary-bg) !important;
            border-radius: var(--border-radius) !important;
        }

        /* 顶部导航栏样式 */
        .AppBar, .App-Bar, .NavBar, .navbar, .Header, header {
            background-color: var(--primary-bg) !important;
        }

        .DiscussionListItem {
            background-color: var(--secondary-bg) !important;
            border-radius: var(--border-radius) !important;
            box-shadow: var(--shadow) !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
        }
        .Card,
        .Panel,
        .DiscussionPage-discussion {
            background-color: var(--primary-bg) !important;
            border-radius: var(--border-radius) !important;
            box-shadow: var(--shadow) !important;
            margin-bottom: 16px !important;
        }
        .DiscussionPage-discussion {
            padding-left: 105px !important;
        }

        /* 链接样式 */
        a {
            color: var(--accent-color) !important;
            text-decoration: none !important;
        }
        a:hover {
            color: var(--accent-hover) !important;
            text-decoration: underline !important;
        }

        .Post {
            padding-left: 105px !important;
        }

        /* 首贴和回复的样式区分 */
        .Post:first-of-type {
            background-color: var(--secondary-bg) !important;
            border-radius: var(--border-radius) !important;
            box-shadow: var(--shadow) !important;
            margin-bottom: 16px !important;
        }
        .Post:not(:first-of-type) {
            background-color: var(--secondary-bg) !important;
            border: 1px solid #e5e5e7 !important;
            border-radius: var(--border-radius) !important;
            box-shadow: none !important;
            margin-bottom: 12px !important;
        }
        /* 文章段落样式 */
        .Post-body p {
            line-height: 1.6 !important;
        }

        /* 讨论页面标题颜色 */
        .DiscussionHero-title {
            color: black !important;
        }

        /* 文章头部背景去除 */
        .Post-header {
            background: none !important;
        }

        /* 讨论区布局调整 */
        .DiscussionHero{
            background-color: var(--primary-bg) !important;
        }
        .DiscussionHero-items,
        .DiscussionList-item,
        ul.DiscussionHero-items {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
        }

        /* 分隔线样式 */
        hr {
            border: none !important;
            margin: 3px !important;
            border-top: 1px solid #e5e5e7 !important;
        }
    `);
})();
