// ==UserScript==
// @name         恒生论坛个性化
// @namespace    http://tampermonkey.net/
// @version      2024-12-26
// @description  去除恒生论坛水印、调整宽度
// @author       xiaohu
// @match        https://home.hundsun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hundsun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533575/%E6%81%92%E7%94%9F%E8%AE%BA%E5%9D%9B%E4%B8%AA%E6%80%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533575/%E6%81%92%E7%94%9F%E8%AE%BA%E5%9D%9B%E4%B8%AA%E6%80%A7%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
    // Your code here..
    // 调整主要显示内容宽度
    $('#tn-content .tn-wrapper').css('width', '70%');
    // 去除水印
    document.querySelector('.__wm').hidden = true;
})();