// ==UserScript==
// @name         迷途小书童（去除阅读更多）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除阅读更多
// @author       DoooReyn
// @match        https://xugaoxiang.com/*
// @match        https://xugaoxiang.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xugaoxiang.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468587/%E8%BF%B7%E9%80%94%E5%B0%8F%E4%B9%A6%E7%AB%A5%EF%BC%88%E5%8E%BB%E9%99%A4%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/468587/%E8%BF%B7%E9%80%94%E5%B0%8F%E4%B9%A6%E7%AB%A5%EF%BC%88%E5%8E%BB%E9%99%A4%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var ele = document.querySelector('#container');
    if (ele) {
        ele.style = "";
    }

    var more = document.querySelector('#read-more-wrap');
    if (more) {
        more.style.display = "none";
    }

})();