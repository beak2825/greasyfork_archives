// ==UserScript==
// @name         阿儿法营火星救援
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将火星人带到火星（大雾）
// @author       Silverteal
// @match        https://aerfaying.com/*
// @match        https://www.aerfaying.com/*
// @match        https://mozhua.aerfaying.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429211/%E9%98%BF%E5%84%BF%E6%B3%95%E8%90%A5%E7%81%AB%E6%98%9F%E6%95%91%E6%8F%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/429211/%E9%98%BF%E5%84%BF%E6%B3%95%E8%90%A5%E7%81%AB%E6%98%9F%E6%95%91%E6%8F%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.assign(window.location.href.replace("aerfaying.com","gitblock.cn"));

    // Your code here...
})();