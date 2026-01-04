// ==UserScript==
// @name         煎蛋网深色模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为煎蛋网添加深色模式
// @author       Yupeg.LV
// @match        *://*.jandan.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523173/%E7%85%8E%E8%9B%8B%E7%BD%91%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523173/%E7%85%8E%E8%9B%8B%E7%BD%91%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const darkStyles = `
        /* 基础样式 */
        body, html {
            background: none repeat scroll 0 0 #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* 链接样式 */
        a, a:link, a:visited {
            color: #888 !important;
        }

        a:hover {
            color: #aaa !important;
        }

        /* 标题栏 */
        #content .title {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        /* 引用块 */
        #content .post blockquote {
            background-color: #1a1a1a !important;
            border-left: 5px solid #2d2d2d !important;
            color: #e0e0e0 !important;
        }

        /* 确保所有文字颜色 */
        h1, h2, h3, h4, h5, h6, p, .indexs, .time_s {
            color: #e0e0e0 !important;
        }

        /* 文章列表 */
        .post {
            border-color: #2d2d2d !important;
        }

        .list-post {
            background-color: #1a1a1a !important;
        }

        /* 评论数 */
        .comment-link {
            color: #888 !important;
        }

        /* 评论列表 */
        .commentlist li {
            background: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .comment-content, .text p, article p {
            color: #e0e0e0 !important;
        }

        .comment-author cite, .comment-author span {
            color: #b0b0b0 !important;
        }

        /* 头部导航 */
        #header {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        #header .nav {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        #header .nav-items .nav-item a.nav-link {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        #header .nav-items .nav-item a.nav-link:hover {
            background-color: #2d2d2d !important;
            color: #ffffff !important;
        }

        #header .logo h1 a {
            filter: invert(1) !important;
        }

        .nav-previous, .nav-next {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .current-comment-page {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
        }

        /* 侧边栏 */
        #sidebar {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        #sidebar h3, #sidebar li, #sidebar form {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        #sidebar form input {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        /* 文章和表单 */
        .post {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .title {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        #commentform textarea {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        #commentform input {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        #submit {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        /* 开关按钮 */
        .switch {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .switch-current {
            background-color: #2d2d2d !important;
        }

        /* 页脚 */
        #footer {
            background-color: #1a1a1a !important;
            color: #888 !important;
            border-color: #2d2d2d !important;
        }

        /* 吐槽区域 */
        .jandan-tucao {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .tucao-hot {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .tucao-hot-title {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .tucao-row {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .tucao-author {
            color: #e0e0e0 !important;
        }

        .tucao-author span {
            color: #b0b0b0 !important;
        }

        .tucao-location {
            color: #888 !important;
        }

        .tucao-content {
            color: #e0e0e0 !important;
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .tucao-vote {
            color: #888 !important;
        }

        .tucao-vote a {
            color: #888 !important;
        }

        .tucao-vote .tucao-like:hover {
            color: #ff4444 !important;
        }

        .tucao-vote .tucao-unlike:hover {
            color: #4444ff !important;
        }

        .tucao-id {
            color: #666 !important;
        }

        .tucao-form {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .tucao-form textarea {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .tucao-form button {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .tucao-form button:hover {
            background-color: #2d2d2d !important;
        }

        .jandan-tucao-close {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .jandan-tucao-close a {
            color: #888 !important;
        }

        .review-notice {
            color: #ff6b6b !important;
        }

        .tucao-report {
            color: #888 !important;
        }

        .tucao-at {
            color: #888 !important;
        }

        .tucao-floor {
            color: #888 !important;
        }

        /* 返回顶部按钮 */
        #nav_top {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        /* 广告区域样式 */
        #box, #float, .box {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        #box ul, #float ul {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        #box h3, #float h3 {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .adsbygoogle {
            background-color: #1a1a1a !important;
            border: 1px solid #2d2d2d !important;
        }

        /* 修复可能的其他广告相关元素 */
        ins.adsbygoogle {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .dot {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        /* 确保广告容器的深色背景 */
        [id^="google_ads_iframe_"] {
            background-color: #1a1a1a !important;
        }

        /* 广告区块的间隔 */
        #box ul, #float ul {
            margin-bottom: 20px !important;
            padding: 10px !important;
        }

        /* 修改所有浅色边框线 */
        #body {
            border-color: #2d2d2d !important;
            background: url("/wp-content/themes/egg/images/body3.gif") repeat-y scroll 639px 0 #1a1a1a !important;
        }

        /* 修改所有 #e5e5e5 颜色的元素 */
        [style*="#e5e5e5"],
        [style*="rgb(229, 229, 229)"],
        [border-color="#e5e5e5"] {
            border-color: #2d2d2d !important;
        }

        /* 确保所有边框和线条颜色 */
        hr, .hr,
        #commentform input,
        #commentform textarea,
        #commentform #submit,
        .commentlist .row,
        .cp-pagenavi .current-comment-page,
        #sidebar form,
        #sidebar ol,
        #sidebar ul,
        #footer {
            border-color: #2d2d2d !important;
        }

        /* 所有边框和分割线 */
        * {
            border-color: #2d2d2d !important;
        }

        /* Block this User 按钮样式 */
        button:contains("Block this User") {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #444 !important;
        }

        /* 热门评论区域 */
        .hotcomment, .hotcomment .in {
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .acv_author {
            color: #e0e0e0 !important;
            background-color: #1a1a1a !important;
            border-color: #2d2d2d !important;
        }

        .acv_comment {
            background: none repeat scroll 0 0 #1a1a1a !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .show_more {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-color: #2d2d2d !important;
        }

        .show_more:hover {
            background-color: #3d3d3d !important;
        }

        .jandan-vote a {
            color: #888 !important;
        }

        .jandan-vote a:hover {
            color: #aaa !important;
        }

        .jandan-vote span {
            color: #888 !important;
        }

        /* 查看原图链接 */
        .view_img_link {
            color: #888 !important;
        }

        .view_img_link:hover {
            color: #aaa !important;
        }
    `;

    // 确保样式只添加一次
    if (!document.getElementById("jandan-dark-mode")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "jandan-dark-mode";
        styleSheet.textContent = darkStyles;
        document.head.appendChild(styleSheet);
    }
})();
