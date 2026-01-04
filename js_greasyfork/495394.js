// ==UserScript==
// @name         hupu-mobile-web
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  hupu mobile web
// @author       You
// @match        https://bbs.hupu.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hupu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495394/hupu-mobile-web.user.js
// @updateURL https://update.greasyfork.org/scripts/495394/hupu-mobile-web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle(`
        html {
        font-size: 1vh;
    }
    body {
        --hugeFontSize: 4rem;
        --largeFontSize: 3rem;
        --middleFontSize: 2rem;
    }
    /*页面整体*/
    .bbs-sl-web {
        width: 100vw;
        min-width: unset;
    }


    /*左侧导航*/
    .bbs-sl-web-nav {
        display: none;
    }
    /*顶部菜单*/
    .hp-pc-rc-TopMenu-top .hp-quickNav a {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hp-pc-rc-TopMenu-top {
        justify-content: center;
        width: 100%;
    }
    /*红色菜单*/
    .hp-pc-rc-TopMenu-banner {
        width: 100%;
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hp-pc-rc-TopMenu-banner .bannerlogonew {
        display: none;
    }
    .hp-pc-rc-TopMenu-banner .gamecenter {
        flex: auto;
    }
    .hp-pc-rc-TopMenu-banner .banneritem {
        flex: auto;
    }
    /*子菜单*/
    .hp-pc-menu-sub-menu {
        height: auto;
    }
    .hp-pc-menu-sub-menu .rc-menu {
        flex: auto;
    }

    .searchArea_rJa8W {
        width: auto;
    }
    .searchArea_rJa8W .search_3tHgz {
        height: var(--largeFontSize);
        width: calc(8*var(--middleFontSize));
    }
    .searchArea_rJa8W .searchIcon_2vh79 {
        margin-left: calc(-1.5*var(--largeFontSize));
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hp-pc-menu-sub-menu .rc-menu a,
    .searchArea_rJa8W .search_3tHgz {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hp-pc-menu-sub-menu-container {
        width: unset;
    }
    /*内容部分*/
    .bbs-sl-web-topic-wrap {
        margin: 0 16px;
    }
    /*面包屑导航*/
    .hp-pc-breadcrumb a {
        font-size: var(--largeFontSize);
        line-height: var(--largeFontSize);
    }
    /*区域介绍*/
    .bbs-sl-web-intro-detail-desc-title,
    .bbs-sl-web-intro-detail-desc-text,
    .iconfont,
    .bbs-sl-web-intro-detail-title,
    .bbs-sl-web .admin-auth {
        font-size: var(--largeFontSize);
        line-height: var(--largeFontSize);
    }
    .bbs-sl-web-intro-detail-button {
        width: auto;
        height: auto;
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .bbs-sl-web-intro-detail-desc-title {
        flex: none;
    }
    /*内容区*/
    .bbs-sl-web-body {
        width: 100%;
    }
    .bbs-sl-web-post-body {
        border-bottom: 1px solid #000000;
    }
    .bbs-sl-web-post-layout.bbs-sl-web-post-header,
    .bbs-sl-web-post-body .post-title .p-title,
    .bbs-sl-web-type-wrap > .bbs-sl-web-type,
    .bbs-sl-web-post-body .post-title .page-icon {
        font-size: var(--largeFontSize);
        line-height: var(--largeFontSize);
    }
    .bbs-sl-web-post-body .post-time,
    .bbs-sl-web-post-body .post-datum,
    .bbs-sl-web-post-body .post-auth {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    /*列表每条的标题和作者换行显示*/
    .bbs-sl-web-post-body .post-title a {
        white-space: break-spaces;
    }
    .bbs-sl-web-post-body .post-auth a {
        white-space: break-spaces;
    }
    .bbs-sl-web-post-layout {
        max-height: none;
    }
    .bbs-sl-web-post-body .post-title .p-title {
        max-width: none;
    }
    /*帖子标题单独行显示*/
    .bbs-sl-web-post-layout {
        flex-wrap: wrap;
    }
    .bbs-sl-web-post-layout div:first-child {
        flex: 1 1 100%;
    }
    .bbs-sl-web-post-layout div:nth-child(3) {
        flex-basis: auto;
    }
    .bbs-sl-web-post-layout.bbs-sl-web-post-header {
        flex-wrap: nowrap;
    }
    /*翻页*/
    .hupu-rc-pagination .hupu-rc-pagination-item a,
    .hupu-rc-pagination .hupu-rc-pagination-next a,
    .hupu-rc-pagination .hupu-rc-pagination-prev a,
    .iconContainer_2ZI3F .text_MtRno {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hupu-rc-pagination .hupu-rc-pagination-item,
    .hupu-rc-pagination .hupu-rc-pagination-next,
    .hupu-rc-pagination .hupu-rc-pagination-prev {

        width: auto;
        height: auto;
    }
    /*尾部*/
    .hp-pc-footer {
        min-width: unset
    }
    .hp-pc-footer-mod_menu {
        width: auto;
    }

    /*2帖子页面*/
    .index_bbs-post-web__2_mmZ {
        width: 100vw;
        min-width: unset;
    }
    /*右侧推荐帖子板块*/
    .index_bbs-post-web-body-right-wrapper__WvQ4Q {
        display: none;
    }
    /*子菜单*/
    .hp-pc-rc-SuperMenu-sub-menu {
        height: auto;
    }
    .hp-pc-rc-SuperMenu-search {
        width: auto;
    }
    .hp-pc-rc-SuperMenu-search > input {
        height: var(--largeFontSize);
        width: calc(8*var(--middleFontSize));
    }
    .hp-pc-rc-SuperMenu-search .hp-pc-rc-SuperMenu-search-searchIcon {
        margin-left: calc(-1.5*var(--largeFontSize));
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hp-pc-rc-SuperMenu-sub-menu .rc-menu {
        max-width: 70%;
    }
    .rc-menu a,
    .hp-pc-rc-SuperMenu-sub-menu .rc-menu a,
    .hp-pc-rc-SuperMenu-search > input {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .hp-pc-rc-SuperMenu-sub-menu-container {
        width: unset;
    }
    /*帖子内容*/
    .index_bbs-post-web-body-left-wrapper__O14II {
        flex: unset;
        width: unset;
    }
    /*面包屑导航*/
    .index_bbs-post-web__2_mmZ .index_br__hJajv {
        height: auto;
    }
    .index_hp-pc-breadcrumb___Sojb,
    .index_hp-pc-breadcrumb___Sojb a {
        font-size: var(--largeFontSize);
        line-height: var(--largeFontSize);
    }
    /*标题和只看楼主*/
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-title,
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config {
        justify-content: center;
    }
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-title {
        flex: auto;
    }
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-config .fixed-btn {
        width: max-content;
    }
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-content-wrapper,
    .post-fix-title_post-fix-title-wrapper__7VZgk .post-fix-title-content-wrapper .main-c {
        width: auto;
    }
    /*标题*/
    .index_bbs-post-web-main-title__MJTN5 {
        height: auto;
    }
    .index_bbs-post-web-main-title-provider__uHAn9 .index_name__M5qqs {
        font-size: var(--largeFontSize);
        line-height: var(--largeFontSize);
    }
    .index_bbs-post-web-main-title-provider__uHAn9 .index_light__M2WPs,
    .index_bbs-post-web-main-title-provider__uHAn9 .index_read__7h1Dm,
    .index_bbs-post-web-main-title-provider__uHAn9 .index_reply__GP3PX {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
        flex: none;
    }
    /*帖子正文*/
    .post-user_post-user-comp-info__ME_US,
    .post-user_post-user-comp-info-bottom-title__gtj2K,
    .post-user_post-user-comp-info-bottom-from__6aulb,
    .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp,
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list-user-info-user-location,
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-user-info-top-level,
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-user-info-top-time,
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-user-info-top-name,
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-operate .todo-list .todo-list-text,
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-user-info-top .user-operate,
    .post-reply-detail-list_reply-detail-list__otjdd .reply-list-content .reply-detail-list-user-info-top-level,
    .post-reply-detail-list_reply-detail-list__otjdd .reply-list-content .reply-detail-list-user-info-top-time,
    .post-reply-detail-list_reply-detail-list__otjdd .reply-list-content .reply-detail-list-user-info-top-name,
    .post-reply-detail-list_reply-detail-list__otjdd .reply-list-content .reply-detail-list-operate .todo-list .todo-list-text,
    .post-reply-list_post-reply-list-wrapper__o4_81 .reply-detail-wrapper .reply-hide .reply-detail-hide,
    .post-reply-list_post-reply-list-wrapper__o4_81 .reply-detail-wrapper .look-more,
    .post-wrapper_bbs-post-wrapper-title__TLQdd .post-wrapper_toggle-tool__MGO_Q,
    .post-wrapper_bbs-post-wrapper-title__TLQdd,
    .post-wrapper_toggle-tool__MGO_Q,
    .post-wrapper_bbs-post-wrapper-title__TLQdd .post-wrapper_toggle-tool__MGO_Q,
    .index_bbs-thread-comp-container__QkBRG .index_toggle-thread__WDynE,
    .index_bbs-thread-comp-container__QkBRG .index_quote-text__HggrH,
    .index_bbs-thread-comp-container__QkBRG .index_reply-thread__9xoRY .index_simple-detail-content__3FPFA {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    .index_bbs-thread-comp__PC7_r {
        font-size: var(--largeFontSize);
        line-height: var(--largeFontSize);
    }
    .post-operate_post-operate-comp-wrapper___odBI .post-operate-comp {
        flex-wrap: wrap;
    }
    .thread-content-detail > p {
        line-height: var(--largeFontSize);
    }
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-user-info-top {
        flex-wrap: wrap;
        justify-content: center;
    }
    .post-reply-list_post-reply-list-wrapper__o4_81 .post-reply-list .reply-list-content .post-reply-list-user-info-top .user-base-info {
        white-space: normal;
    }
    /*输入评论区*/
    .index_bbs-post-web-quote-title-container__A0rLq {
        width: unset;
    }
    .index_bbs-post-web-quote-title__Iqu7P,
    .index_login___uxbK,
    .index_operatorButtonContainer__6G3JA .index_operatorButton__ijSnG,
    .index_compact__osaGi .index_main__XrCzy .index_actions__uc_5L .index_link__llhwW {
        font-size: var(--middleFontSize);
        line-height: var(--middleFontSize);
    }
    /*翻页*/
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-item a,
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-next a,
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-prev a,
    .index_iconContainer__odKRy .index_text__89JcF,
    .index_jumpToPage__GC8jx .index_text__89JcF,
    .index_jumpToPage__GC8jx .index_input__9ge6K,
    .index_jumpToPage__GC8jx .index_text__89JcF,
    .index_jumpToPage__GC8jx .index_button__KWQvz {
        font-size: var(--middleFontSize);
        line-height: var(--largeFontSize);
    }
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-next,
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-prev,
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-item,
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-next,
    .index_pagination__wvE_f .hupu-rc-pagination .hupu-rc-pagination-prev,
    .index_jumpToPage__GC8jx .index_button__KWQvz {

        width: auto;
        height: auto;
    }
    /*底部*/
    .index_hp-pc-footer__TyFBc {
        min-width: unset;
    }
    .index_hp-pc-footer-mod_menu__aTFud {
        width: auto;
    }
    `);
    
})();