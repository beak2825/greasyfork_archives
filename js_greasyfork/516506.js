// ==UserScript==
// @name         面试鸭浏览助手
// @namespace
// @include      *://www.mianshiya.com/bank/*/question/*
// @match        *://www.mianshiya.com/bank/*/question/*
// @version      0.1.2
// @description  面试鸭浏览助手，功能包含：解除刷题页的禁止选择，隐藏刷题页内与刷题无关的内容
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/516506/%E9%9D%A2%E8%AF%95%E9%B8%AD%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/516506/%E9%9D%A2%E8%AF%95%E9%B8%AD%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
GM_addStyle(`
    /* 解除刷题页的禁止选择 */
    body {
        user-select: initial !important;
    }
    /* 隐藏header */
    .ant-pro-layout .ant-layout-header.ant-pro-layout-header,
    /* 隐藏header广栏告 */
    body>.ant-float-btn-group+div:not(#basicLayout),
    /* footer */
    .footer-container,
    /* 隐藏右侧边栏除目录外的所有内容 .content-space>.ant-row>.ant-col:not(:has(.question-main)) .ant-card:not(.toc-card) */
    .hot-rank-card, .recommend-course-card, .user-group-qrcode-card,
    /* 隐藏固定在右侧的按钮组 */
    :where(.css-m4timi).ant-float-btn-group-square-shadow,
    /* footer */
    .question-main>footer,
    /* 尾部：作者 & 分享 */
    .question-main .best-answer-author,
    .question-main .shareFooter,
    /* 右侧 新人专属礼 */
    .float-red-packet-container
    {display:none !important;}

    .site-layout-background>.content-space>.immersion-float-btn {bottom:30px !important}
`);