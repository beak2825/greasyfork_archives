// ==UserScript==
// @name         b站深色模式
// @name:zh-cn   b站深色模式
// @name:en      bilibili darkmode
// @license      MIT
// @version      0.1.3
// @description  给b站添加深色样式
// @description:zh-cn  给b站添加深色样式
// @description:en make bilibili dark!
// @author       kudryavka1013
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_addStyle
// @run-at       document-start
// @homepageURL  https://github.com/kudryavka1013/bilibili-darkmode
// @namespace https://greasyfork.org/users/234510
// @downloadURL https://update.greasyfork.org/scripts/476488/b%E7%AB%99%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/476488/b%E7%AB%99%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const url = window.location.href;
  const urlSet = {
    home: "https://www.bilibili.com",
    search: "https://search.bilibili.com",
    space: "https://space.bilibili.com",
  };
  // 全局色彩样式覆写
  const globalColorStyle = `
    :root {
      --bg1: #121212 !important;
      --bg1_float: #1A1A1A !important;
      --bg2: #121212 !important;
      --bg2_float: #2E2E2E !important;
      --bg3: #2E2E2E !important;
      --text1: #C8CBCF !important;
      --text2: #ABADB0 !important;
      --line_light: #2E2E2E !important;
      --line_regular: #4D4D4D !important;
      --line_bold: #767676 !important;
      --graph_bg_thin: #1F1F1F !important;
      --graph_bg_regular: #262626 !important;
      --graph_bg_thick: #3D3D3D !important;
      --brand_blue: #0096CC !important;
      --v_text_disabled: #4D4D4D !important;
      --brand_blue_thin: #0096CC !important;
      --graph_weak: #2E2E2E !important;
      --Or5: #FF7F24 !important;
    }
  `;
  // 标准背景底色
  const stdBackground = `background-color: var(--bg1_float) !important;`;
  // 背景底色
  const backgroundSelector = [
    "html body", // 全局
  ];
  GM_addStyle(globalColorStyle);
  // 测试底色覆盖
  GM_addStyle(`${backgroundSelector.join(",")} {
    ${stdBackground}
  }`);
  // 视频播放页处理
  GM_addStyle(`
    #bilibili-player-placeholder {
      box-shadow: none !important;
    }
    .vip-login-tip {
      box-shadow: 0 0 30px rgba(150,150,150,.1);
    }
    .van-popover {
      background-color: var(--bg1) !important;
      border-color: var(--line_regular) !important;
     }
  `);
  // 首页
  GM_addStyle(`
    #nav-searchform:hover {
      border: 1px solid var(--bg3) !important;
    }
    #nav-searchform.is-focus {
      border: 1px solid var(--bg3) !important;
      border-bottom: none !important;
      opacity: 1 !important;
    }
    .search-panel {
      border: 1px solid var(--bg3) !important;
      border-top: none !important;
    }
  `);
  // 视频卡片icon
  GM_addStyle(`
    .bili-video-card__info--icon-text {
      background-color: initial !important;
      box-shadow: 0 0 1px 1px var(--Or5);
    }
  `);
  // headerBar收藏夹
  GM_addStyle(`
    .favorite-panel-popover__nav .tab-item--active {
      color: #E6E6E6;
    }
    .favorite-panel-popover__nav .tab-item--active .tab-item__num {
      color: #E6E6E6;
    }
    .header-channel {
      box-shadow: 0 2px 4px rgba(255,255,255,.08) !important;
    }
  `);
  // 搜索页
  GM_addStyle(`
    .vui_button--tab:active, .vui_button--tab.vui_button--active, .vui_button--tab.vui_button--active:hover {
      background-color: var(--graph_bg_thick) !important;
    }
    .vui_button[disabled], .vui_button[disabled]:hover, .vui_button[disabled]:active, .vui_button[disabled].vui_button--active {
      border: 1px solid var(--line_regular) !important;
    }
    .esport-card-options .btn:hover {
      color: #FFF !important;
    }
  `);
  // 评论区
  GM_addStyle(`
    .reply-box .box-normal .reply-box-send .send-text {
      color: var(--text2) !important;
    }
    .reply-box .box-normal .reply-box-send:hover .send-text {
      color: #FFF !important;
    }
    .reply-box.box-active .box-normal .reply-box-send.send-active .send-text {
      color: #FFF !important;
    }
    .reply-box .box-normal .reply-box-send:after {
      opacity: .8 !important;
    }
    .reply-box .box-normal .reply-box-send:hover:after {
      opacity: 1 !important;
    }
    .reply-box.box-active .box-normal .reply-box-send.send-active:after {
      opacity: 1 !important;
    }
    .reply-box .box-normal .reply-box-warp .reply-box-textarea {
      border: 1px solid var(--line_regular) !important;
    }
    .reply-box .box-expand .reply-box-emoji .emoji-btn {
      border: 1px solid var(--line_regular) !important;
    }
    .reply-box .box-expand .at-btn {
      border: 1px solid var(--line_regular) !important;
    }
    .reply-box .box-normal .reply-box-warp .reply-box-textarea.focus,
    .reply-box .box-normal .reply-box-warp .reply-box-textarea:hover {
      border-color: var(--line_bold) !important;
    }
    .user-card {
      border: 1px solid var(--line_regular) !important;
      background-color: var(--bg1) !important;
    }
    .user-card div.info p.user a.name {
      color: var(--text1);
    }
    .user-card .info .social span {
      color: var(--text2);
    }
    .reply-item .root-reply-container .content-warp .root-reply .reply-tag-list .reply-tag-item {
      background-color: initial !important;
      box-shadow: 0 0 1px 1px !important;
    }
    .reply-operation .operation-list {
      box-shadow: 0 0 5px #fff3 !important;
    }
  `);
  // 动态首页
  GM_addStyle(`
    #app .bg {
      background-image: none !important;
      background-color: var(--bg1_float) !important;
    }
    .bili-dyn-my-info,
    .bili-dyn-live-users,
    .bili-dyn-publishing,
    .bili-dyn-up-list,
    .bili-dyn-list-tabs,
    .bili-dyn-item,
    .bili-dyn-topic-box {
      box-shadow: 0 0 1px #FFF;
    }
    .bili-dyn-live-users__item-container:hover,
    .relevant-topic-container__item:hover {
      background-color: var(--graph_bg_regular) !important;
    }
    .bili-dyn-sidebar .bili-dyn-sidebar__btn {
      box-shadow: 0 0 1px #FFF;
    }
    .bili-user-profile {
      box-shadow: 0 0 1px 0px #FFF !important;
      background-color: var(--bg1) !important;
    }
    .bili-user-profile .bili-user-profile-view__info__uname {
      color: var(--text1);
    }
    .bili-user-profile .bili-user-profile-view__info__stat span{
      color: var(--text2) !important;
    }
  `);
  // 个人空间
  GM_addStyle(`
    #app.owner,
    #app.fans,
    #app.visitor {
      background-color: var(--bg1_float) !important;
    }
    .n .n-inner {
      background-color: var(--bg1) !important;
      box-shadow: 0 0 1px #FFF !important;
    }
    .n .n-text {
      color: var(--text1) !important;
    }
    .n .n-btn.active .n-text {
      color: #00A1D6 !important;
    }
    .n .n-data .n-data-v {
      color: var(--text2) !important;
    }
    .n .n-inner .g-search input {
      background-color: var(--bg3) !important;
      border: 1px solid var(--line_regular) !important;
      color: var(--text2) !important;
    }
    #page-index .col-1,
    #page-index .col-2 .section,
    #page-dynamic .col-2 .section {
      background-color: var(--bg1) !important;
      border: 1px solid var(--line_regular) !important;
      color: var(--text1) !important;
    }
    #page-index .section-title,
    #page-index .article-title,
    #page-index .large-item .title,
    #page-index .col-2 .section .user-auth.no-auth .no-auth-title .goto-auth,
    #page-index .col-2 .user-info .user-info-title .info-title,
    #page-index .col-2 .game-card__info-title,
    #page-index .col-2 .section .user-auth .auth-description {
      color: var(--text1) !important;
    }
    #page-index .col-1 .section.i-pin-v .be-tab,
    #page-index .col-1 .section,
    #page-index .col-1 .channel .channel-item,
    #page-index .col-1 .user-info .user-info-title,
    #page-index .col-2 .section-title {
      border-bottom: 1px solid var(--line_bold) !important;
    }
    #page-index .section .count {
      background: none !important;
      color: var(--text1) !important;
      border: 1px solid var(--line_bold) !important;
    }
    #page-index .section .count:before,
    #page-index .list-create {
      background: none !important;
    }
    #page-index .fav-covers,
    #page-index .col-2 .i-m-r2,
    #page-index .col-2 .i-live .i-live-unfo-btn {
      border: 1px solid var(--line_bold) !important;
    }
    #page-index .col-2 .i-live .i-live-fo-count {
      border: 1px solid var(--line_bold) !important;
      border-left-width: 0 !important;
    }
    #page-index #i-ann-content textarea {
      background-color: var(--bg3) !important;
      color: var(--text1) !important;
    }
    #page-index .col-2 .elec .elec-status {
      filter: invert(93%) !important;
    }
    #page-index .col-2 .elec .elec-status-bg-grey {
      background-color: #555555 !important;
    }
    #page-dynamic .col-1 .bili-dyn-item {
      background-color: var(--bg1) !important;
      color: var(--text1) !important;
    }
    #page-dynamic .col-1 .bili-dyn-list-loading {
      background-color: var(--bg1) !important;
      box-shadow: 0 0 1px #FFF;
    }
    #page-dynamic .col-1 .bili-dyn-title__text {
     color: var(--text1);
    }
    #page-dynamic .col-2 .user-info .user-info-title .info-title,
    #page-dynamic .col-1 .bili-rich-text__content,
    #page-dynamic .col-1 .bili-dyn-card-video__title {
      color: var(--text1) !important;
    }
    #page-dynamic .col-1 .bili-popover {
      background-color: var(--bg1) !important;
      border: 1px solid var(--line_bold) !important;
    }
    #page-dynamic .col-1 .bili-popover__arrow {
      background-color: var(--bg1) !important;
      border-left: 1px solid var(--line_bold) !important;
      border-top: 1px solid var(--line_bold) !important;
    }
    #page-dynamic .col-1 .bili-dyn-more__menu__item {
      color: var(--text1) !important;
    }
    #page-dynamic .col-1 .bili-dyn-more__menu__item:hover {
      color: #00A1D6 !important;
    }
    #page-dynamic .col-1 .bili-dyn-card-video,
    .bb-comment .comment-send .comment-emoji {
      border: 1px solid var(--line_bold) !important;
    }
    #page-dynamic .col-1 .bili-dyn-card-video__body {
      background-color: initial !important;
    }
    #page-dynamic .col-1 .dynamic-card-comment .bb-comment,
    #page-dynamic .col-1 .bb-comment .comment-list .list-item .info .btn-hover:hover {
      background-color: initial !important;
    }
    #page-dynamic .col-1 .bb-comment .comment-header {
      border-bottom: 1px solid var(--line_bold) !important;
    }
    #page-dynamic .col-1 .bb-comment .bottom-page.center,
    #page-dynamic .col-1 .bb-comment .comment-list .list-item .con {
     border-top:  1px solid var(--line_bold) !important;
    }
    #page-dynamic .col-1 .bb-comment .comment-header .tabs-order li:not(.on) {
      color: var(--text1) !important;
    }
    #page-dynamic .col-1 .bb-comment .operation .opera-list {
      background-color: #181818 !important;
      color: var(--text1) !important;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.2) !important;
    }
    #page-dynamic .col-1 .bb-comment .operation .opera-list li:hover {
      background-color: var(--bg3) !important;
    }
    #page-dynamic .col-1 .bb-comment .comment-send .textarea-container .ipt-txt {
      background-color: var(--bg3) !important;
      color: var(--text1) !important;
      border: 1px solid var(--line_bold) !important;
    }
    #page-dynamic .col-1 .bb-comment .comment-send .textarea-container:hover .ipt-txt {
      border-color: #00A1D6 !important;
    }
    #page-dynamic .col-1 .bb-comment .comment-list .list-item .info .reply-tags span {
      background: none !important;
      box-shadow: 0 0 1px #FFF !important;
    }
    #page-dynamic .col-1 .bb-comment .comment-list .list-item div.user a.name {
      color: var(--text1);
    }
    .comment-bilibili-con {
      background: var(--bg1) !important;
      border: 1px solid var(--line_bold) !important;
    }
    .comment-bilibili-con .t,
    .comment-bilibili-con .con label {
      color: var(--text2) !important;
    }
    .comment-bilibili-con .other .ta textarea,
    .bili-dyn-report__remark__field {
      background-color: var(--bg3) !important;
      color: var(--text1) !important;
    }
    .bili-dyn-report {
      background: var(--bg1_float) !important;
      border: 1px solid var(--line_bold) !important;
    }
    .bili-dyn-report .bili-radio__label {
      color: var(--text2) !important;
    }
    .bili-dyn-report .bili-dyn-report__remark__content {
      background-color: var(--bg3) !important;
    }
    .m-layer.m-button, .m_layer.m-button {
      background: var(--bg1) !important;
      border: 1px solid var(--line_bold) !important;
      color: var(--text1) !important;
    }
    .be-dropdown-menu {
      background-color: var(--bg1_float) !important;
      border: 1px solid var(--line_bold) !important;
    }
    .be-dropdown-menu .be-dropdown-item {
      color: var(--text1) !important;
    }
    .be-dropdown-menu .be-dropdown-item:hover {
      background-color: var(--graph_bg_regular) !important;
      color: #00A1D6 !important;
    }
    #page-video .col-full,
    #page-audio .col-full,
    #page-article .col-full,
    #page-myalbum .col-full,
    #page-channel .col-full,
    #page-fav .col-full,
    #page-bangumi .col-full,
    #page-pgc .col-full,
    #page-subs .col-full,
    #page-setting .col-full,
    #page-follows .col-full {
      background: var(--bg1) !important; 
      box-shadow: 0 0 1px #FFF !important;
    }
    #page-video .col-full .contribution-sidenav~.main-content,
    #page-audio .col-full .contribution-sidenav~.main-content,
    #page-article .col-full .contribution-sidenav~.main-content,
    #page-myalbum .col-full .contribution-sidenav~.album-content,
    #page-fav .col-full .fav-main {
      border-left: 1px solid var(--line_regular) !important;
    }
    #page-video .col-full .contribution-sidenav,
    #page-audio .col-full .contribution-sidenav,
    #page-article .col-full .contribution-sidenav,
    #page-myalbum .col-full .contribution-sidenav {
      border-right: 1px solid var(--line_regular) !important; 
    }
    .contribution-sidenav .contribution-item:not(.cur) .text {
      color: var(--text1) !important;
    }
    .contribution-sidenav .contribution-item:not(.cur):hover {
      background-color: var(--graph_bg_regular) !important;
    }
    .be-tab-item:not(.is-active),
    #page-video .page-head__left .video-title,
    #page-audio .row .breadcrumb .item,
    #page-article .row .breadcrumb .item,
    #page-myalbum .album-list__title,
    #page-myalbum .album-card__title,
    #page-video .list-item .title,
    #page-article .article-title a,
    #page-video .small-item .title:not(:hover),
    #page-channel .series-item .item-title,
    #page-channel .channel-index .breadcrumb .item.cur,
    #page-channel .card-item .title:not(:hover),
    #page-channel #page-series-detail .channel-detail .content .breadcrumb .item,
    #page-channel .small-item .title:not(:hover) {
      color: var(--text2) !important;
    }
    #page-video #submit-video-type-filter,
    #page-myalbum .album-list__tabs {
      background-color: var(--bg3) !important; 
    }
    #page-video #submit-video-type-filter a:not(.active),
    #page-myalbum .album-list__tab:not(.album-list__tab--active) .album-list__tab-name {
      color: var(--text1) !important;
    }
    #page-video #submit-video-type-filter a:not(.active):hover,
    #page-myalbum .album-list__tab:not(.album-list__tab--active) .album-list__tab-name:hover {
      color: #00A1D6 !important;
    }
    #page-video .list-item,
    #page-article .s-content,
    #page-channel #page-series-detail .filter {
      border-bottom: 1px solid var(--line_regular) !important;
    }
    #page-video .be-pager li:not(.be-pager-item-active):not(.be-pager-item-jump-next),
    #page-channel .be-pager li:not(.be-pager-item-active):not(.be-pager-item-jump-next),
    #page-fav .be-pager li:not(.be-pager-item-active):not(.be-pager-item-jump-next) {
      background: none !important;
      border: 1px solid var(--line_bold) !important;
    }
    #page-video .be-pager .be-pager-options-elevator input,
    #page-channel .be-pager .be-pager-options-elevator input,
    #page-fav .be-pager .be-pager-options-elevator input,
    #page-fav .fav-main .filter-item.search input {
      background: var(--bg3) !important;
      border: 1px solid var(--line_bold) !important;
    }
    #page-channel .channel-add-video {
      background: none !important;
    }
    #page-channel .series-item .split-line {
      background-color: var(--line_bold) !important;
    }
    #page-channel .series-item .item-title .qipapnum {
      background: none !important;
      color: var(--text1) !important;
      border: 1px solid var(--line_bold) !important;
    }
    #page-channel .series-item .item-title .qipapnum:before {
      background: none !important;
    }
    #page-channel .section,
    #page-fav .fav-header {
      border-bottom: none !important;
    }
    #page-fav .fav-sidenav .nav-container {
      border-bottom: 1px solid var(--line_regular) !important;
    }
    #page-fav .fav-main .favList-info,
    #page-fav .be-dropdown-item.be-dropdown-item-delimiter,
    #page-fav .opus-list .opus-item {
      border-bottom: 1px solid var(--line_bold) !important;
    }
    #page-fav .fav-sidenav .watch-later {
      border-top: 1px solid var(--line_bold) !important; 
    }
    #page-fav .fav-main .small-item {
      border: none !important;
    }
    #page-fav .fav-sidenav .fav-item:hover {
      background-color: var(--graph_bg_regular) !important;
    }
    #page-fav .favInfo-box .favInfo-details .fav-name:not(:hover),
    #page-fav .fav-main .filter-item:not(.be-dropdown):not(:hover),
    #page-fav .small-item .title:not(:hover),
    #page-fav .fav-sidenav .fav-item:not(.cur):not(:hover) .text,
    #page-fav .fav-sidenav .nav-title .text,
    #page-fav .fav-main .filter-item.be-dropdown,
    #page-fav .fav-main .filter-item .filter-type .be-dropdown-item:not(:hover) span,
    #page-fav .fav-main .fav-action-top .back-to-info:not(:hover),
    #page-fav .fav-main .fav-action-top .back-to-info:not(:hover),
    #page-fav .opus-list .opus-item-title,
    #page-fav .breadcrumb .item.cur,
    #page-fav .fav-main .fav-content .fav-pugv-list .pugv-item .item-infos p.main-title {
      color: var(--text2) !important;
    }
    #page-fav .fav-main .fav-action-bottom .fav-action-fixtop {
      background-color: var(--bg1) !important;
    }
    
  `);
  // 新版个人空间侧边栏
  GM_addStyle(`
    .side-nav .side-nav__item:hover {
      background-color: var(--graph_bg_thick) !important;
    }
  `);
  // 新版历史记录
  GM_addStyle(`
    .history-record .radio-filter__item.radio-filter__item--active {
      color: #ffffff;
    }
  `);
  // 新版收藏
  GM_addStyle(`
    .vui_sidebar .fav-sidebar-item .vui_sidebar-item:hover {
      background-color: var(--graph_bg_thick) !important;
    }
  `);
})();
