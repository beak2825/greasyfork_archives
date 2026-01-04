// ==UserScript==
// @name         publink-gemini-beautify
// @namespace    http://tampermonkey.net/
// @version      0.38
// @description  gemini 样式美化
// @author       huangbc
// @include      https://gemini.google.com/*
// @match        https://gemini.google.com/*
// @match        https://gemini.google.com/gem/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533800/publink-gemini-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/533800/publink-gemini-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('gemini-beautify')
     // 使用 GM_addStyle 添加样式
    GM_addStyle(`
        .cdk-overlay-pane .mat-mdc-menu-panel,
        mat-action-list,
        bard-sidenav-content,
        infinite-scroller,
        input-container,
        input-area-v2,
        toolbar,
        .toolbar,
        chat-window,
        .container,
        .response-container,
        .blur-bg.blur-shown,
        .sidenav-with-history-container {
            background: #f8f8f7 !important;
            background-color: #f8f8f7 !important;
        }
        input-container::before {
           background: linear-gradient(180deg, rgba(248,248,247, 0), rgba(248,248,247, 100) 60%) !important;
        }
        context-sidebar {
          margin-line: 0 !important;
        }
        .bottom-gradient-container,
        .text-token-text-tertiary.whitespace-nowrap,
        referral-button,
        .featured-projects-container,
        ng-star-inserted,
        .featured-projects-container,
        .referral ng-star-inserted {
           display: none !important;
        }
        /* 添加更多自定义样式 */
    `);
    
    // 监听 DOM 变化，确保样式应用到动态加载的元素
    const observer = new MutationObserver(function() {
        // 可以在这里重新应用样式或处理动态元素
    });
    
    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });

    // Your code here...
})();