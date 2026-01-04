// ==UserScript==
// @name         Bilibili 隐藏主页的Header
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隱藏B站主页的Header，只保留主体內容
// @author       You
// @match        *://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474394/Bilibili%20%E9%9A%90%E8%97%8F%E4%B8%BB%E9%A1%B5%E7%9A%84Header.user.js
// @updateURL https://update.greasyfork.org/scripts/474394/Bilibili%20%E9%9A%90%E8%97%8F%E4%B8%BB%E9%A1%B5%E7%9A%84Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addonStyleSheet = `
        div.bili-header__bar.slide-down, div.header-channel {
            display: none;
        }
    `
    const styleSheetEle = document.createElement("style");
    styleSheetEle.innerHTML = addonStyleSheet;
    document.head.appendChild(styleSheetEle);
   
})();