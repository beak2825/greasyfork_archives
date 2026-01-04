// ==UserScript==
// @name         no灰色
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网页恢复彩色
// @author       current
// @license      End-User License Agreement
// @match        https://www.bilibili.com/*
// @match        https://www.baidu.com/*
// @match        https://tieba.baidu.com/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455829/no%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455829/no%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style");
    style.innerHTML = "html{filter: grayscale(0) !important}";
    document.head.appendChild(style);
    document.body.className = "open-homepage-tts s-manhattan-index"
    document.getElementById('s_lg_img').src = "//www.baidu.com/img/flexible/logo/pc/index.png"
    // Your code here...
})();