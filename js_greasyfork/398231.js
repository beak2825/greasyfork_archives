// ==UserScript==
// @name         Youtube 載入完自動重新整理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto Refresh
// @include      https://www.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398231/Youtube%20%E8%BC%89%E5%85%A5%E5%AE%8C%E8%87%AA%E5%8B%95%E9%87%8D%E6%96%B0%E6%95%B4%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/398231/Youtube%20%E8%BC%89%E5%85%A5%E5%AE%8C%E8%87%AA%E5%8B%95%E9%87%8D%E6%96%B0%E6%95%B4%E7%90%86.meta.js
// ==/UserScript==

window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}