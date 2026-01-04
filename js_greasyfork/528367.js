// ==UserScript==
// @name         LimeStart No Search Bar
// @namespace    http://tampermonkey.net/
// @version      2025-02-28
// @description  用于去除青柠起始页的搜索框。这与青柠起始页的设计理念相悖。
// @author       MFn
// @match        https://www.limestart.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=limestart.cn
// @grant        GM_addStyle
// @run-at       window-load
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/528367/LimeStart%20No%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/528367/LimeStart%20No%20Search%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.classList.remove('search');
    document.getElementById('bgBox').classList.remove('focus');
    document.getElementById('bgBox').setAttribute('style','transform: scale(1);display: block;opacity: 1;');
    //GM_addStyle("#timeContainer {top:calc(var(--body-top) + 80px)}")
    //GM_addStyle("#timeText {font-weight: bold;font-size: 72px;}");
    GM_addStyle("#searchBar{display:none;}");
})();