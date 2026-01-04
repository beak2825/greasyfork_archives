// ==UserScript==
// @name         自动时间倒序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习通讨论自动时间倒序
// @author       themanforfree
// @match        *://groupyd.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403824/%E8%87%AA%E5%8A%A8%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403824/%E8%87%AA%E5%8A%A8%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
    var sjdx = document.getElementsByClassName("icon-gou")[1];
        sjdx.click();
        setTimeout(() => {
            sjdx.click();
        }, 100);
        setTimeout(() => {
            sjdx.click();
        }, 500);
        setTimeout(() => {
            sjdx.click();
        }, 1000);
    }
})();