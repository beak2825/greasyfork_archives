// ==UserScript==
// @name         掘矿-让掘金之旅更愉快
// @namespace    https://github.com/jhonleeee
// @version      0.1.2
// @description  给掘金增加暗黑模式以及一些小功能
// @author       JhonLee
// @match        https://juejin.cn/*
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425482/%E6%8E%98%E7%9F%BF-%E8%AE%A9%E6%8E%98%E9%87%91%E4%B9%8B%E6%97%85%E6%9B%B4%E6%84%89%E5%BF%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/425482/%E6%8E%98%E7%9F%BF-%E8%AE%A9%E6%8E%98%E9%87%91%E4%B9%8B%E6%97%85%E6%9B%B4%E6%84%89%E5%BF%AB.meta.js
// ==/UserScript==

async function addCountInUserPage(){
    const windowURL = window?.location.pathname;
    let userInfoAPI = new URL(`https://api.juejin.cn/user_api/v1/user/get`);
    const urlMatch = windowURL.match(/\/user\/(\d+)/);
    if(!windowURL&&!urlMatch){
        return false;
    }
    const uId = urlMatch[1];
    userInfoAPI.searchParams.set('aid',114514);
    userInfoAPI.searchParams.set('user_id',uId);
    function addCountToPage(writeCount,shortMsgCount){
        const writeDOM = document.createElement('div');
        writeDOM.className='item-count';
        writeDOM.innerHTML=writeCount;
        const shortMsgDOM = writeDOM.cloneNode()
        shortMsgDOM.innerHTML = shortMsgCount
        const headerItemArr = document.querySelectorAll('.header-content')[0].querySelectorAll('.item-title')
        headerItemArr[1].after(writeDOM)
        headerItemArr[2].after(shortMsgDOM)
    }
    await fetch(userInfoAPI,{
        credentials: "include"
    }).then(
        res=>res.json()
    ).then(
        resJson=>{
            addCountToPage(resJson.data.post_article_count,resJson.data.post_shortmsg_count)
        }
    ).catch(
        err=>console.log(err)
    )
}
(function() {
    'use strict';
    // Your code here...
    let styleDOM = document.createElement('style');
    styleDOM.id="juekuangStyle"
    styleDOM.innerHTML=`
    #juejin {
        --color-bg-canvas-juejin-juekuang: #22272e;

        --color-header-text-juejin-juekuang: rgba(205, 217, 229, 0.7);
        --color-header-bg-juejin-juekuang: #2d333b;
        --color-header-logo-juejin-juekuang: #cdd9e5;

        --color-text-white-juejin-juekuang: #cdd9e5;
        --color-text-primary-juejin-juekuang: #adbac7;
        --color-text-secondary-juejin-juekuang: #768390;
        --color-text-tertiary-juejin-juekuang: #768390;
        --color-text-placeholder-juejin-juekuang: #545d68;
        --color-text-placeholder-pin-editor-juejin-juekuang: #aaaaaa;
        --color-text-disabled-juejin-juekuang: #545d68;
        --color-text-inverse-juejin-juekuang: #22272e;
        --color-text-link-juejin-juekuang: #539bf5;

        --color-btn-text-juejin-juekuang: #adbac7;
        --color-btn-bg-juejin-juekuang: #373e47;
        --color-btn-border-juejin-juekuang: #444c56;
        --color-btn-hover-bg-juejin-juekuang: #444c56;
        --color-btn-hover-border-juejin-juekuang: #768390;

        --color-bg-primary-juejin-juekuang: #22272e;
        --color-bg-secondary-juejin-juekuang: #22272e;
        --color-bg-overlay-juejin-juekuang: #323941;
        --color-bg-info-inverse-juejin-juekuang: #4184e4;
        --color-bg-tertiary-juejin-juekuang: #2d333b;
        --color-bg-backdrop-juejin-juekuang: rgba(28, 33, 40, 0.8);
        --color-markdown-code-bg-juejin-juekuang:#cdd9e526;

        --color-border-primary-juejin-juekuang: #444c56;
        --color-border-overlay-juejin-juekuang: #444c56;
        --color-btn-border-juejin-juekuang: #444c56;

        --color-state-hover-primary-text-juejin-juekuang: #cdd9e5;
        --color-state-hover-primary-bg-juejin-juekuang: #316dca;

        --color-text-danger: #e5534b;
        --color-text-success: #6bc46d;
        --color-text-warning: #daaa3f;

        --color-bg-primary: #22272e;
        --color-bg-secondary: #22272e;
        --color-bg-tertiary: #2d333b;
        --color-bg-overlay: #323941;



        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    html {
        --color-bg-canvas-juejin-juekuang: #22272e;
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .subscribe-btn:not(.subscribed) {
        color: var(--color-btn-text-juejin-juekuang) !important;
        background-color: var(--color-btn-bg-juejin-juekuang) !important;
        border-color: var(--color-btn-border-juejin-juekuang) !important;
        transition: .2s cubic-bezier(.3, 0, .5, 1) !important;
        transition-property: color, background-color, border-color !important;
    }

    .subscribe-btn:not(.subscribed):hover {
        background-color: var(--color-btn-hover-bg-juejin-juekuang) !important;
        border-color: var(--color-btn-hover-border-juejin-juekuang) !important;
        transition-duration: .1s !important;
    }

    .main-header {
        color: var(--color-header-text-juejin-juekuang) !important;
        background-color: var(--color-header-bg-juejin-juekuang) !important;
        border-bottom: 0px !important;
    }

    .search-form .search-input {
        color: var(--color-text-white-juejin-juekuang) !important;
        background-color: #0000;
    }

    .main-nav .nav-item.search .search-form .search-input {
        color: var(--color-text-white-juejin-juekuang) !important;
        transition-duration: 0.5s;
        transition-property: width;
        transition-timing-function: ease-in-out;
    }

    .main-nav .nav-item.search .search-form.active .search-input {
        width: 15rem !important;
    }

    .search-form.active {
        background-color: var(--color-bg-secondary-juejin-juekuang) !important;
    }

    .typehead {
        background-color: var(--color-bg-primary-juejin-juekuang) !important;
        border: 1px solid var(--color-bg-primary-juejin-juekuang) !important;
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .typehead .list {
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .typehead .list div:hover {
        background: var(--color-bg-info-inverse-juejin-juekuang) !important;
    }

    .add-group .more-list {
        background-color: var(--color-bg-overlay-juejin-juekuang) !important;
        border: 1px solid var(--color-border-overlay-juejin-juekuang) !important;
    }

    .view-nav,
    .view-nav:before {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .sidebar-block,
    .recommend-author-block {
        background-color: var(--color-bg-primary-juejin-juekuang) !important;
        border: 1px solid var(--color-bg-primary-juejin-juekuang) !important;
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .sidebar-block .headline {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .sidebar-block .desc {
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }

    .recommend-author-block .user-list .username {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    /*./subscribe/subscribed*/
    .tag-list .tag {
        border: 1px solid var(--color-border-overlay-juejin-juekuang) !important;
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .tag-list .tag .title {
        color: var(--color-text-link-juejin-juekuang) !important;
    }

    .tag-list .tag .thumb {
        background-color: #0000 !important;
    }

    /* ./index */
    .sidebar-block .link-list .link .title {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .category-popover {
        background-color: var(--color-bg-backdrop-juejin-juekuang) !important;
        backdrop-filter: blur(4vw);
    }

    .entry-list-container {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
        border: 1px solid var(--color-border-primary-juejin-juekuang) !important;
        border-radius: 6px;
    }

    .entry-list {
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }

    .entry-list .entry-box:hover {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }
    .entry-list .entry-title{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .context-box .info-box .info-row .title {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .entry-list .title {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .entry-list .action-list>.item {
        border: 1px solid var(--color-btn-border-juejin-juekuang) !important;
    }

    .xitu-skeleton {
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }

    .xitu-skeleton .xitu-skeleton-content {
        filter: brightness(35%);
    }

    .nav-menu {
        background-color: var(--color-bg-overlay-juejin-juekuang) !important;
        border: 1px solid var(--color-border-overlay-juejin-juekuang) !important;
    }

    .nav-menu .nav-menu-item:hover {
        color: var(--color-state-hover-primary-text-juejin-juekuang) !important;
        background-color: var(--color-state-hover-primary-bg-juejin-juekuang) !important;
    }

    .nav-menu .nav-menu-item>a,
    .fengwei {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    /*./pins/recommended*/
    .pin-editor-dialog {
        background-color: var(--color-header-bg-juejin-juekuang) !important;
    }

    .pin-editor-dialog .editor-body {
        background: #0000 !important;
    }

    .pin-editor-dialog .editor-body .content.active {
        background-color: var(--color-bg-secondary-juejin-juekuang) !important;
    }

    .pin-editor-dialog .editor-body .rich-editor {
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .pin-editor-dialog .editor-body .rich-editor:after {
        color: var(--color-text-placeholder-pin-editor-juejin-juekuang) !important;
    }

    .in-editor-dialog.pin-editor .bottom .topic-picker .topic_panel {
        background: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .view-container .main .dock-nav {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .pin__side.sidebar {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .pin__side.sidebar .profile-box {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .pin__side.sidebar .related-pin-block.pin-block {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .pin__side.sidebar .related-pin-block.pin-block>header {
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .pin__side.sidebar .related-pin-block.pin-block .content {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .pin__side.sidebar .topic-sidebar {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .pin__side.sidebar .topic-sidebar .title span {
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .pin__side.sidebar .topic-sidebar .content span:first-child {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .pin__side.sidebar .guide-link {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .profile-box .profile .user-info .username {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .profile-box .stat-list .item .count {
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }

    .pin-list-view img:not(.slide-img),article img:not(.medium-zoom-image) {
        filter: brightness(70%);
    }

    .pin-list {
        background: #0000 !important;
    }

    .pin:not(a) {
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }

    .pin .content-box {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .pin-header-row .username {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .pin-action-row .action-box {
        border-top: 1px solid var(--color-border-primary-juejin-juekuang) !important;
    }

    .comment-list .item:not(:last-child) .comment-divider-line {
        border-bottom: 0px !important;
    }

    .container .triangle {
        background: var(--color-bg-tertiary-juejin-juekuang) !important;
        border-right: 1px solid var(--color-border-primary-juejin-juekuang) !important;
        border-bottom: 1px solid var(--color-border-primary-juejin-juekuang) !important;
    }

    .comment-list-box {
        border-top: 1px solid var(--color-border-primary-juejin-juekuang) !important;
    }

    .comment-form,
    .sub-comment-list {
        color: var(--color-text-white-juejin-juekuang) !important;
        background-color: #0000 !important;
        border: 1px solid var(--color-border-primary-juejin-juekuang) !important;
    }

    .comment-form .input-box {
        color: var(--color-text-white-juejin-juekuang) !important;
        background-color: #0000;
    }

    .comment .name,
    .comment .author-badge-text,
    .comment .content {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .link-box {
        background-color: var(--color-bg-primary-juejin-juekuang) !important;
        border: 1px solid var(--color-border-primary-juejin-juekuang) !important;
    }

    .link-box .link-info-box .link-title {
        color: var(--color-text-primary) !important;
    }

    .link-box .link-info-box .link-domain {
        color: var(--color-text-secondary) !important;
    }

    /* ./pin/** */


    /* ./user/** */
    .list-header .nav-item .item-count {
        margin-left: .4rem;
        font-size: 1.25rem;
        color: #b2bac2;
        line-height: 1;
    }
    .main-container .block {
        background-color: var(--color-bg-overlay-juejin-juekuang) !important;
    }

    .action-box .link-box {
        background-color: #0000 !important;
        border: 0px !important;
    }

    .user-info-block .top .username,
    .list-body .activity-item .username,
    .list-body .activity-item .post-item-title h3 {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .main-container .block .content {
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }

    .list-body .activity-item {
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }

    .rich-content .post-item-excerpt {
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }

    .post-list-box,.like-list-box,.recommended-entry-list-title {
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .post-list-box .sub-header-title,.like-list-box  .sub-header-title{
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .post-list-box a,.like-list-box a {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .list-header .btn,
    .user-info-block .action-box .btn,
    .source-header {
        color: var(--color-btn-text-juejin-juekuang) !important;
        background-color: var(--color-btn-bg-juejin-juekuang) !important;
        border-color: var(--color-btn-border-juejin-juekuang) !important;
    }

    .list-header .nav-item .item-title {
        color: var(--color-header-text-juejin-juekuang) !important;
    }

    .more-block .more-item {
        border-top: 0px !important;
    }
    .more-block .more-item:last-child{
        border-bottom: 0px !important;
    }
    .more-block .more-item .item-title {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .more-block .more-item .item-count {
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }

    .stat-block .block-title {
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .follow-block .follow-item {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .list-header {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .stat-item svg {
        filter: brightness(70%);
    }

    .list-header .nav-item .more-panel {
        background-color: var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .list-header .nav-item .more-panel::before {
        border-bottom: 7px solid var(--color-bg-canvas-juejin-juekuang) !important;
    }

    .list-header .nav-item .more-panel a {
        color: var(--color-header-text-juejin-juekuang) !important;
    }
    .empty-box{
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }
    /* ./post/** */

    article,.markdown-body{
        color: var(--color-text-primary-juejin-juekuang) !important;
        background-image: none !important;
        background-color: #0000 !important;
    }
    .markdown-body a{
        color: var(--color-text-link-juejin-juekuang) !important;
    }
    .markdown-body blockquote p{
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }
    .article-area{
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }
    .author-info-box .username .name{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .sidebar-block,.related-pin-block{
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }
    .related-entry-sidebar-block .block-title,.related-pin-block header{
        color: var(--color-text-white-juejin-juekuang) !important;
    }
    .related-pin-block .content{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .sidebar-block.author-block .block-title {
        color: var(--color-text-white-juejin-juekuang) !important;
    }

    .sidebar-block.author-block .info-box .username {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    .sidebar-block.author-block .info-box .position {
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }

    .stat-item .content {
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .catalog-block{
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
        padding-top: 15px;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 25px;
    }
    .catalog-title{
        color: var(--color-text-white-juejin-juekuang) !important;
    }
    .catalog-list:before{
        background-color: var(--color-bg-primary) !important;
    }
    .catalog-list .item a{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .catalog-list .item a:hover{
        background-color: var(--color-bg-secondary) !important;
    }
    .catalog-list .item.active>a{
        color: var(--color-text-link-juejin-juekuang) !important;
        background-color: var(--color-bg-primary-juejin-juekuang) !important;
    }
    .catalog-list .item{
        color: var(--color-bg-secondary) !important;
        background-color:#0000 !important;
        transition-duration:0.5s;
        transition-property: background-color;
        transition-timing-function: ease-in-out;
    }
    .tag-list-box .tag-list .tag-list-title{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .footer-author-block{
        background-color: var(--color-bg-overlay-juejin-juekuang) !important;
    }
    .footer-author-block .name{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .article-banner{
        border-left: 6px solid var(--color-text-primary-juejin-juekuang) !important;
    }
    .markdown-body code{
        padding: .2em .4em !important;
        margin: 0 !important;
        font-size: 85% !important;
        background-color: var(--color-markdown-code-bg-juejin-juekuang) !important;
        border-radius: 6px !important;
        color: var(--color-text-primary-juejin-juekuang) !important;
    }

    /* ./search?** */
    .search-view .main-list{
        background-color: var(--color-bg-tertiary-juejin-juekuang) !important;
    }
    .search-view .main-listfirst-child{
        background-color: var(--color-bg-primary-juejin-juekuang) !important;
    }
    .search-view .title{
        color: var(--color-text-primary-juejin-juekuang) !important;
    }
    .search-view .abstract-row .abstract{
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }
    .search-view  .tag .meta-box .stat{
        color: var(--color-text-secondary-juejin-juekuang) !important;
    }
    .search-view .entry:hover {
        background: var(--color-bg-info-inverse-juejin-juekuang) !important;
    }
    @media (max-width: 980px) {
        .main-nav-list {
            background-color: var(--color-header-bg-juejin-juekuang) !important;
        }

        .phone-hide {
            background-color: var(--color-header-bg-juejin-juekuang) !important;
            border: 1px solid var(--color-header-bg-juejin-juekuang) !important;
        }
    }
    `;
    const headDOM = document.getElementsByTagName('head')[0];
    const useTheme= localStorage.getItem("juekuang-theme-enable");
    useTheme!='false'&&headDOM.append(styleDOM);
    function initSettingBtn(){
        let btnTemplate = document.querySelectorAll('.nav-menu-item')[0];
        let settingBtn = btnTemplate.cloneNode(true);
        settingBtn.getElementsByTagName('span')[0].innerText='切换主题';
        settingBtn.onclick=()=>{
            const useTheme= localStorage.getItem("juekuang-theme-enable");
            useTheme!="true"?localStorage.setItem("juekuang-theme-enable","true"):localStorage.setItem("juekuang-theme-enable","false");
        }
        document.querySelectorAll('.nav-menu-item-group')[3].append(settingBtn);
        }
   setTimeout(addCountInUserPage,1000);
    setTimeout(initSettingBtn,2000);
})();