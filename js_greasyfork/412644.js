// ==UserScript==
// @name         百度主页下边栏隐藏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  隐藏百度主页下边栏
// @author       StarDust
// @match        https://www.baidu.com/*
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/412644/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E4%B8%8B%E8%BE%B9%E6%A0%8F%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/412644/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E4%B8%8B%E8%BE%B9%E6%A0%8F%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    new MutationObserver(function (mutations) {
        if (document.getElementById("bottom_layer")) {
            const bannerBottomElement = document.getElementById("bottom_layer");
            if (bannerBottomElement) {
                bannerBottomElement.remove();
                this.disconnect(); // disconnect the observer
            }
        }
    }).observe(document, { childList: true, subtree: true });
    // the above observes added/removed nodes on all descendants recursively
})();