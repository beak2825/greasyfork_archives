// ==UserScript==
// @name         igg-games 去除廣告
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  去除igg-games開啟ADBlock的阻擋器
// @author       You
// @match        https://igg-games.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396165/igg-games%20%E5%8E%BB%E9%99%A4%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/396165/igg-games%20%E5%8E%BB%E9%99%A4%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    document.getElementById("idModal").remove();
    document.getElementsByClassName('taxonomy-description')[0].remove()
})();