// ==UserScript==
// @name         低端影视去广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  清理广告脚本
// @author       啦A多梦
// @license      MIT
// @match        https://ddys.art/*
// @match        https://ddys.pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ddys.art
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/460882/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460882/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle("#afc_sidebar_2842, #iaujwnefhw, #sajdhfbjwhe {width: 0px !important; height: 0px !important;}");
})();