// ==UserScript==
// @name         publink-yunxiao-beautify
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  云效样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465821/publink-yunxiao-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/465821/publink-yunxiao-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .tb-common-sidebar-main-scroll a:nth-of-type(3) .tb-common-sidebar-count-badge,
    .tb-common-sidebar-main-scroll a:nth-of-type(4) .tb-common-sidebar-count-badge,
    #tb-navigation-customOperation
    { display: none !important; }
    .mr-detail-content-changes-file-diffs {
       width: 100% !important;
    }
    .yunxiao-list-actions.yunxiao-list-actions-left{
     visibility: hidden !important;
    }

    `
    document.body.append(styleElement)
    // Your code here...
})();