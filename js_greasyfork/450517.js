// ==UserScript==
// @name         学达云自动学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  开启自动学习
// @author       LarryL
// @match        *://ok99ok99.com/*
// @match        *://*.ok99ok99.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450517/%E5%AD%A6%E8%BE%BE%E4%BA%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/450517/%E5%AD%A6%E8%BE%BE%E4%BA%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        if (typeof currentCourse !== 'undefined') {
            currentCourse.IsAutoStudy = true;
        }
    }, 10000);
})();