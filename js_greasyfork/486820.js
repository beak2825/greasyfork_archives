// ==UserScript==
// @name         暗黑2T站调整
// @namespace    http://tampermonkey.net/
// @version      1.0.0.2
// @description  调整页面一些样式,方便更好的使用
// @author       You
// @match        https://traderie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szccinfo.com
// @grant        none
// @license      调整页面一些样式,方便更好的使用
// @downloadURL https://update.greasyfork.org/scripts/486820/%E6%9A%97%E9%BB%912T%E7%AB%99%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/486820/%E6%9A%97%E9%BB%912T%E7%AB%99%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var customCSS = `
        .tag-filters {
          max-height: 800px !important;
        }
    `;
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(customCSS));
    document.head.appendChild(styleElement);
})();
