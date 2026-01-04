// ==UserScript==
// @name         Linux do Theme
// @namespace    http://tampermonkey.net/
// @version      2024-06-08
// @description  Linux Do主题插件
// @author       C碳化钨
// @match        https://linux.do/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497800/Linux%20do%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/497800/Linux%20do%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css = `
 .topic-map {
     border-radius: 16px !important;
     padding: 8px !important;
     background: rgba(255, 255, 255, 0.6) !important;
     -webkit-backdrop-filter: blur(10px) !important;
     backdrop-filter: blur(10px) !important;

 }

 .d-header {
     background: rgba(255, 255, 255, 0.8) !important;
     -webkit-backdrop-filter: blur(10px) !important;
     backdrop-filter: blur(10px) !important;
 }

 #main-outlet-wrapper {
     margin-top: 30px !important;
     border-radius: 20px !important;
     background-color: rgba(255, 255, 255, 0.8) !important;
 }

 .sidebar-wrapper {
     border-radius: 20px !important;
     background: rgba(255, 255, 255, 0.7) !important;
     -webkit-backdrop-filter: blur(10px) !important;
     backdrop-filter: blur(10px) !important;
     height: calc(var(--composer-vh, var(--1dvh))*100 - var(--header-offset, 0px) - 30px) !important;
 }

 .chat-channel {
     height: calc(var(--chat-vh, 1vh)*100 - var(--header-offset, 0px) - var(--composer-height, 0px) - 1px - var(--chat-header-offset, 0px) - 70px) !important;
 }

 .timeline-handle {
     background-color: var(--tertiary) !important
 }

 #main-outlet {
     padding: 20px !important;
     border-radius: 20px !important;
     box-shadow: none !important;
 }

 .cooked,
 .about .details,
 .user-content {
     padding: 20px !important;
 }

 .fk-d-menu__inner-content,
 .select-kit-body,
 .chat-drawer-container,
 .search-header,
 .cooked,
 .about .details,
 .user-content,
 #reply-control,
 .chat-channel,
 .badge-card {
     background: rgba(255, 255, 255, 0.6) !important;
     -webkit-backdrop-filter: blur(8px) !important;
     backdrop-filter: blur(8px) !important;
 }

 .fk-d-menu__inner-content,
 .fk-d-menu__inner-content .user-card,
 .no-bg,
 .fk-d-menu__inner-content .card-content,
 .search-header,
 .cooked,
 .about .details,
 .user-content {
     border-radius: 16px !important;
 }

 #reply-control,
.embedded-posts,
.select-kit-body{
     border-radius: 8px !important;
 }

 .no-bg .card-content,
 .no-bg,
 .search-header div {
     background: transparent !important;
     border: none !important;
 }

 .alert.alert-info {
     border-radius: 8px !important;
     background: rgb(200, 225, 235) !important;
 }

 .chat-drawer-container,
 .chat-channel {
     overflow: hidden !important;
     border-radius: 8px !important;
 }

 .menu-panel {
     border-radius: 20px !important;
     background: rgba(255, 255, 255, 0.8) !important;
     -webkit-backdrop-filter: blur(10px) !important;
     backdrop-filter: blur(10px) !important;
 }

 .search-menu-panel{
     backdrop-filter: none !important;
 }

 .discourse-tag.box{
     border-radius: 5px !important;
     color: var(--secondary) !important;
     background: rgba(102, 204, 255, 0.6) !important;
 }


 .notification {
     margin: 2px 0px !important;
     border-radius: 8px !important;
 }

 body{
     background-image: url("https://pixiv.re/119236407.png");
     background-repeat: no-repeat;
     background-size: cover;
     background-attachment: fixed
 }
    `




    function listenerChange(selector, fn) {
        const element = document.querySelector(selector);
        if (element) {
            new MutationObserver(() => fn()).observe(element, { subtree: true, characterData: true, childList: true, attributes: true });
        } else {
            console.warn(`元素 ${selector} 不存在`);
        }
    }

    function addGoTopButton(){

        if (!document.querySelector("#go_top_buton")){
            let btn = $('<button id="go_top_buton" class="btn btn-small" style="background-color:var(--tertiary);color:#FFFFFF">回到顶部</button>');

            btn.on('click', function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            });

            // 添加按钮到页面的某个元素
            $('.timeline-footer-controls').append(btn);
        }
    }

    listenerChange('title', () => addGoTopButton());

    GM_addStyle(css);

})();