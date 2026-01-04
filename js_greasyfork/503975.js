// ==UserScript==
// @name         清除 Wolai 的中英文自动间距
// @namespace    http://tampermonkey.net/
// @version      2024-08-17-1
// @description  清除 Wolai 的中英文自动间距。。。
// @author       You
// @match        https://www.wolai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wolai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503975/%E6%B8%85%E9%99%A4%20Wolai%20%E7%9A%84%E4%B8%AD%E8%8B%B1%E6%96%87%E8%87%AA%E5%8A%A8%E9%97%B4%E8%B7%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/503975/%E6%B8%85%E9%99%A4%20Wolai%20%E7%9A%84%E4%B8%AD%E8%8B%B1%E6%96%87%E8%87%AA%E5%8A%A8%E9%97%B4%E8%B7%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const element = document.createElement('style')
    element.textContent = `
    [data-section-index] span, [data-section-index] span+i {
        padding: 0 !important;
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    [data-section-index] {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    #wolai-sidebar,
    #wolai-header-bar,
    .content-editable:not(._2TL9K) {
        font-family: '仓耳渔阳体'
    }
    `
    document.head.appendChild(element)
    console.log('已经清除中英文自动间距')
})();