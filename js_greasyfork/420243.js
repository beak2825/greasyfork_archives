// ==UserScript==
// @name         Bangumi 去黑幕
// @namespace    mytreee@qq.com
// @version      0.4.2
// @description  Bangumi黑幕透明/去除马赛克文字，添加边线框
// @author       mytreee
// @match        https://bangumi.tv/*
// @match        https://bgm.tv/*
// @match        https://chii.in/* 
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420243/Bangumi%20%E5%8E%BB%E9%BB%91%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/420243/Bangumi%20%E5%8E%BB%E9%BB%91%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    //令所有Span.Style 中BackgroundColor为透明
    document.querySelectorAll('span').forEach(bgm => bgm.style.backgroundColor = '#ffffff00');
})();

(function() {
    //令所有Span.Style 中FontColor为黑色
    document.querySelectorAll('span').forEach(bgm => bgm.style.color = 'black');
})();