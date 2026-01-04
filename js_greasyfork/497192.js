// ==UserScript==
// @name         123云盘 优化
// @namespace    http://tampermonkey.net/
// @version      20241230
// @description  自用脚本，效果自测，针对非会员用户
// @author       Xistorg
// @match        *://*.123pan.com/*
// @match        *://*.123pan.cn/*
// @match        *://*.123684.com/*
// @match        *://*.123865.com/*
// @match        *://*.123952.com/*
// @run-at       document-start
// @license      MIT
// @icon         https://statics.123pan.com/static-by-custom/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497192/123%E4%BA%91%E7%9B%98%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497192/123%E4%BA%91%E7%9B%98%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
    .activity-box,
    .notice-box,
    .mfy-main-layout__head,
    .sider-member-btn,
    .space-icon,
    .special-menu-item-container,
    .video-vip-btn,
    .user-reward-btn,
    .btn_reward,
    .banner-container-h5,
    .banner-container-pc,
    .video-new-user-tips,
    .equipmentDescription,
    .equipmentDescriptionLink,
    li[data-menu-id*="-/thirdPartyMount"],
    li[data-menu-id*="-/SynchronousSpace/main"],
    li[data-menu-id*="-/cps"],
    li[data-menu-id*="-/Tools"],
    li[data-menu-id*="-/devTools"],
    li.ant-menu-submenu .ant-menu-submenu-title,
    ul.ant-dropdown-menu.user-menu > li:nth-child(2),
    ul.ant-dropdown-menu.user-menu > li:nth-child(3),
    ul.ant-dropdown-menu.user-menu > li:nth-child(4),
    ul.ant-dropdown-menu.user-menu > li:nth-child(5),
    ul.ant-menu.ant-menu-root.ant-menu-inline.ant-menu-light > li:nth-child(6),
    li.ant-menu-item[data-menu-id*="-earnings"],
    div[style="font-size: 12px; line-height: 36px; margin-left: 20px;"],
    div[style="border-radius: 0px 18px 18px 0px; border-left: 0.5px solid rgb(217, 217, 217); min-width: 192px;"],
    div.ant-dropdown-trigger.OfflineDownloadBtn,
    div.rightInfo > div:nth-child(2),
    #xxl
        {display: none !important;}
    .vip-icon
        {visibility: hidden !important;}
    .appBottomBtn {
        bottom: 0px !important;
    }
    `;
    document.head.appendChild(style);
    document.addEventListener('DOMContentLoaded', function() {
        const pageTitle = document.title;
        const index = pageTitle.indexOf("官方版下载丨");
        if (index !== -1) {
            document.title = pageTitle.substring(0, index);
        }
    });
})();