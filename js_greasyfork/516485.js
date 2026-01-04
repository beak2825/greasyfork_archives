// ==UserScript==

// @name         哔哩哔哩排版

// @namespace    http://tampermonkey.net/

// @version      0.2

// @description  哔哩哔重排版

// @author       foolmos

// @match        https://www.bilibili.com/video/*
// @match        https://space.bilibili.com/v/note-list

// @grant        GM_addStyle

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/516485/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/516485/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

 

GM_addStyle(".editor-innter, .note-header, .note-editor {background:rgba(54, 54, 54, 100) !important;color:#c7c6c6 !important;border: 1px solid #2a2b2b !important;}");

GM_addStyle(".card-box p {font-size:16px !important;line-height:1.5 !important;}");

GM_addStyle(".second-line_right {width:80px !important;}");

GM_addStyle(".bili-header__bar.mini-header, .mini-header.m-header.mini-type {background-color: #7c8f30 !important ;height:65px !important;position:relative !important;color:#fff !important;}");

GM_addStyle(".bili-comment.browser-pc * a:hover, .bili-comment.browser-pc * a, .multi-page-v1 .cur-list .list-box li.on > a, .sub-reply-item .sub-reply-info .sub-reply-btn[data-v-2c26b1b1]:hover, .video-note-info.video-toolbar-item-text, .fixed-sidenav-storage .fixed-sidenav-storage-item.mini-player-window.on[data-v-3965288e], p.title:hover, span.name:hover, .upname:hover, .van-tabs-tab.van-tabs-my.van-tabs-tab-active {color: #b5cd53 !important;}");

GM_addStyle(".bpx-player-progress-schedule-current {background-color: #b5cd53 !important;}");

GM_addStyle(".view-more-btn {color: #829438 !important;}");

GM_addStyle(".reply-box .box-normal .reply-box-send[data-v-9fc68100]::after, .reply-box-send, .bpx-player-ending-content .bpx-player-ending-functions-follow, .edit-btn.publish-btn, .number.active {background: #7c8f30 !important;color: #fff !important;}");

GM_addStyle(".send-text {color: #fff !important;}");

GM_addStyle(".upinfo-btn-panel .follow-btn.not-follow[data-v-1e89c9b3] {color: #fff !important ;background: #7c8f30 !important ;margin-top:8px !important;}");

GM_addStyle(".bui-button .bui-area.bui-button-blue, .bui-button .bui-area.bui-button-gray3, .multi-page-v1 .head-con .head-right .next-button .switch-button.on, .recommend-list-v1 .rec-title .next-button .switch-button.on {color: #fff !important ;background: #7c8f30 !important ;border: 1px solid #7c8f30 !important;}");

GM_addStyle(".v-popover-wrap svg, .right-entry-item svg, .bili-header__bar.mini-header span, .nav-link a, .user-con.signin span {color:#fff !important;}");

GM_addStyle("[data-darkreader-inline-fill], svg.mini-header__logo, svg.mini-header__logo > path, svg.navbar_logo > path {fill:rgb(255, 255, 255) !important;}");

GM_addStyle(".bili-header .left-entry__title .mini-header__logo {margin-right: 15px !important;margin-left: -5px !important;}");

GM_addStyle("#biliMainHeader {margin-bottom:25px !important;}");

GM_addStyle(".reply-list {width:95% !important;margin-right:15px !important;}");

GM_addStyle(".manage-note--header .tools-btns .edit-btn--ghost, .note-single-item .go-video-btn {border-color: #7c8f30 !important;color: #829438 !important;}");

GM_addStyle(".note-single-item .go-video-btn, .note-single-item .go-video-btn:hover {width:80px !important;border:transparent !important;background:transparent !important;}");

GM_addStyle(".international-header {min-width: 900px !important;}");

GM_addStyle(".van-tabs_active-bar {--darkreader-inline-bgcolor:#798938 !important;}");

GM_addStyle(".pop-live-small-mode.part-1, #reco_list.recommend-list-v1, .danmaku-box, .recommend-list-v1, .rec-list, .bili-comments-bottom-fixed-wrapper, .video-container-v1 .right-container .right-container-inner {display:none !important;}");

GM_addStyle(".right-container-inner.scroll-sticky {position:relative !important;}");

GM_addStyle(".base-video-sections-v1 .video-sections-content-list {height:400px !important;}");

GM_addStyle(".reply-list {width:1080px !important;margin-right:35px !important;}");

GM_addStyle(".reply-content {font-size:17px !important;font-weight:bold !important;}");



GM_addStyle(":root { --bili-comments-font-size-content:18.5px !important;--bili-rich-text-font-size:18.5px !important;--bili-comments-line-height-content:1.6 !important;--bili-comment-box-display:unset !important;--bili-comments-commentbox-height:0 !important;--bili-rich-text-color:#afafaf !important;}");

GM_addStyle("#comment, #commentapp {width:1000px !important; margin-left:-7% !important;margin-right:15% !important;}");

GM_addStyle(".left-container.scroll-sticky {margin-left:-1% !important;}");

 GM_addStyle(" .video-desc-container {width:1000px !important;}");

 GM_addStyle("#commentbox {height:0 !important;}");

 GM_addStyle("#comment-area {width:0px !important;}");

 GM_addStyle(".brt-placeholder {font-size:0px !important;height:0px !important;}");

 GM_addStyle(" .video-sections-content-list, .video-pod,  .video-pod__body {height:650px !important;min-height:450px !important;}");

GM_addStyle(".bpx-player-container[data-screen=mini] {width:500px !important;height:281px !important;}");

GM_addStyle(".fixed-sidenav-storage .fixed-sidenav-storage-item {font-size: 0px !important;}");

GM_addStyle(".fixed-sidenav-storage .fixed-sidenav-storage-item {background:transparent !important;border:transparent !important;}");


(function() {

    'use strict';

 

    // Your code here...

})();
