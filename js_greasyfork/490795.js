// ==UserScript==
// @name         移除cn影院广告
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  移除cn影视首页中的广告
// @author       You
// @match        https://cnys.tv/*
// @match        https://cnysapp.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnys.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490795/%E7%A7%BB%E9%99%A4cn%E5%BD%B1%E9%99%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/490795/%E7%A7%BB%E9%99%A4cn%E5%BD%B1%E9%99%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.ec-ad').forEach((item)=>{item.style.display='none'})
    // Your code here...
})();