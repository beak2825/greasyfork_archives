// ==UserScript==
// @name         Tixcraft Detail to Game URL
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Open modified Tixcraft URLs in a new background tab by replacing 'detail' with 'game'
// @match        https://tixcraft.com/activity/detail/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515277/Tixcraft%20Detail%20to%20Game%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/515277/Tixcraft%20Detail%20to%20Game%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 獲取當前 URL
    const currentUrl = window.location.href;

    // 替換 'detail' 為 'game'
    const modifiedUrl = currentUrl.replace('/detail/', '/game/');

    // 如果修改後的網址和當前網址不同，則跳轉到新的網址
    if (currentUrl !== modifiedUrl) {
        window.location.replace(modifiedUrl);  // 重新導向到修改後的網址
    }
})();