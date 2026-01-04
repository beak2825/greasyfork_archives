// ==UserScript==
// @name         B站仿旧版+隐藏动态页新版按钮【纯CSS改动】
// @namespace    qtqz
// @version      0.6
// @description  拒绝老年版页面！缩小视频页部分UI，还原用户动态页转发等UI，隐藏动态首页前往新版按钮（此脚本并非100%还原旧版）
// @author       qtqz
// @license      MIT
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484878/B%E7%AB%99%E4%BB%BF%E6%97%A7%E7%89%88%2B%E9%9A%90%E8%97%8F%E5%8A%A8%E6%80%81%E9%A1%B5%E6%96%B0%E7%89%88%E6%8C%89%E9%92%AE%E3%80%90%E7%BA%AFCSS%E6%94%B9%E5%8A%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/484878/B%E7%AB%99%E4%BB%BF%E6%97%A7%E7%89%88%2B%E9%9A%90%E8%97%8F%E5%8A%A8%E6%80%81%E9%A1%B5%E6%96%B0%E7%89%88%E6%8C%89%E9%92%AE%E3%80%90%E7%BA%AFCSS%E6%94%B9%E5%8A%A8%E3%80%91.meta.js
// ==/UserScript==

//created 2023.11
//2024.12 修复视频溢出
//2025.1 修复太长

(function () {
    'use strict';
   
        var node = document.createElement("style");
        node.appendChild(document.createTextNode(`
        .bili-dyn-version-control {
            display: none!important;
        }
        @media (min-width: 1681px){
            #mirror-vdcon > div.right-container.is-in-large-ab div.base-video-sections-v1 > div.video-sections-content-list{
                max-height: 100vh !important;
            }
            .video-container-v1 .right-container .video-pod {
                max-height: 100vh !important;
                overflow: scroll !important;
            }
            .video-container-v1 .right-container {
                width: 350px!important;
            }
            .is-in-large-ab .video-page-card-small .card-box .info .title {
                font-size: 15px!important;
            }
            .video-info-container .video-title {
                font-size: 20px!important;
            }
            .video-info-container {
                height: 96px!important;
            }
            .video-desc-container .basic-desc-info {
                font-size: 14px!important;
                line-height: 22px!important;
            }
            .video-toolbar-left-item .video-toolbar-item-icon {
                width: 30px!important;
                height: 30px!important;
            }
            .base-video-sections-v1 .video-section-list .video-episode-card__info-title {
                font-size: 14px!important;
            }
        }

        .bili-dyn-item__header {
            height: 69px!important;
            padding-top: 23px!important;
        }
        .bili-dyn-content__orig.reference {
            background-color: #f4f5f7!important;
            margin: 12px 0 0 -12px!important;
            padding: 12px 14px!important;
        }
    `));
        var head = document.querySelector("head");
        head.appendChild(node);
/*
        .left-container {
            width: 1090px!important;
        }
font-size: 16px;
line-height: 1.7em;
font-weight: 400;
*/
})();