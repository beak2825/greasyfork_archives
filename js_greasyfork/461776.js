// ==UserScript==
// @name         Bilibili 隐藏Header和Footer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隱藏B站的Header和Footer，只保留主体內容
// @author       You
// @match        *://*.bilibili.com/*
// @exclude      *://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461776/Bilibili%20%E9%9A%90%E8%97%8FHeader%E5%92%8CFooter.user.js
// @updateURL https://update.greasyfork.org/scripts/461776/Bilibili%20%E9%9A%90%E8%97%8FHeader%E5%92%8CFooter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addonStyleSheet = `
        #biliMainHeader, .bili-footer, #bili-header-container, .bili-header {
            display: none;
        }
    `
    const styleSheetEle = document.createElement("style");
    styleSheetEle.innerHTML = addonStyleSheet;
    document.head.appendChild(styleSheetEle);
   
})();