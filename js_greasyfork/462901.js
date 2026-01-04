// ==UserScript==
// @name         Bilibili Auto Expand Description 哔哩哔哩自动展开简介说明
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically expands the description on Bilibili video pages
// @author       Your name
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462901/Bilibili%20Auto%20Expand%20Description%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AE%80%E4%BB%8B%E8%AF%B4%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/462901/Bilibili%20Auto%20Expand%20Description%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AE%80%E4%BB%8B%E8%AF%B4%E6%98%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const expandButton = document.getElementsByClassName('toggle-btn-text');
    if (expandButton) {
        expandButton[0] && expandButton[0].click();
    }
})();