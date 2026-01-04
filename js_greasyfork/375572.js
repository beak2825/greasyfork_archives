// ==UserScript==
// @name         阮一峰不需要广告费
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  浏览 ruanyifeng.com 不必关闭广告拦截器
// @author       Bob Green
// @match        *://*.ruanyifeng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375572/%E9%98%AE%E4%B8%80%E5%B3%B0%E4%B8%8D%E9%9C%80%E8%A6%81%E5%B9%BF%E5%91%8A%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/375572/%E9%98%AE%E4%B8%80%E5%B3%B0%E4%B8%8D%E9%9C%80%E8%A6%81%E5%B9%BF%E5%91%8A%E8%B4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sourceNode = document.getElementById('main-content');
    var clonedNode = sourceNode.cloneNode(true);
    clonedNode.id = 'null';
    sourceNode.parentNode.insertBefore(clonedNode, sourceNode);
    // Your code here...
})();