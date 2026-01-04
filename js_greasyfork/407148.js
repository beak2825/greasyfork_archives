// ==UserScript==
// @name         YT ad skip
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       聖冰如焰
// @match        https://www.youtube.com/*
// @description  自動點擊跳過廣告
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407148/YT%20ad%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/407148/YT%20ad%20skip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(e => {
        let ad = document.getElementsByClassName('ytp-ad-skip-button');
        if (ad.length != 0) ad[0].click();
    },100)
    // Your code here...
})();

