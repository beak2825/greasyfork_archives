// ==UserScript==
// @name         huxiu网排版
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  huxiu网重排版
// @author       foolmos
// @match        https://www.huxiu.com/article/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464522/huxiu%E7%BD%91%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464522/huxiu%E7%BD%91%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".article__content[data-v-009474f2] p { font-size: 19px !important;line-height:2 !important;}");
GM_addStyle(".article-detail-content p { font-size: 19px !important;line-height:2 !important;}");
 
(function() {
    'use strict';
 
    // Your code here...
})();