// ==UserScript==
// @name         禁用B站的点赞投币收藏快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  禁用B站网页端的点赞、投币和收藏快捷键
// @author       Dorei Hime
// @match        *://www.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498390/%E7%A6%81%E7%94%A8B%E7%AB%99%E7%9A%84%E7%82%B9%E8%B5%9E%E6%8A%95%E5%B8%81%E6%94%B6%E8%97%8F%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/498390/%E7%A6%81%E7%94%A8B%E7%AB%99%E7%9A%84%E7%82%B9%E8%B5%9E%E6%8A%95%E5%B8%81%E6%94%B6%E8%97%8F%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 禁用Q键（点赞）、W键（投币）和E键（收藏）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'q' || e.key === 'w' || e.key === 'e') {
            e.stopPropagation();
        }
    }, true);
})();
