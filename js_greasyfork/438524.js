// ==UserScript==
// @name         暴雪蓝帖 Wowhead 优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  暴雪蓝帖 Wowhead 去除广告，优化使用体验
// @author       Denis.Ding
// @match        https://www.wowhead.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://ae01.alicdn.com/kf/Hac1a58055c5047cdb91349e91aa208d5k.jpg
// @grant        none
// @note         22-01-14 1.0 暴雪蓝帖 Wowhead 去除广告，优化使用体验
// @downloadURL https://update.greasyfork.org/scripts/438524/%E6%9A%B4%E9%9B%AA%E8%93%9D%E5%B8%96%20Wowhead%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438524/%E6%9A%B4%E9%9B%AA%E8%93%9D%E5%B8%96%20Wowhead%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode("#page-content .sidebar-wrapper{display: none !important;}"));
    style.appendChild(document.createTextNode("#main>.blocks{display: none !important;}"));
    style.appendChild(document.createTextNode("#main-contents>.blocks{display: none !important;}"));
    style.appendChild(document.createTextNode("#page-content{padding-right: 0 !important;}"));
    style.appendChild(document.createTextNode("#video-pos-fixed{display: none !important;}"));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();