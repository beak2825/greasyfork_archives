// ==UserScript==
// @name         移除全网页title
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  删除掉全网页的title, 摸鱼用.
// @author       sumuzhe
// @match        *://*/*
// @exclude      *://localhost:*/*
// @exclude      *://*mail*/*
// @exclude      *://qiye.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392619/%E7%A7%BB%E9%99%A4%E5%85%A8%E7%BD%91%E9%A1%B5title.user.js
// @updateURL https://update.greasyfork.org/scripts/392619/%E7%A7%BB%E9%99%A4%E5%85%A8%E7%BD%91%E9%A1%B5title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    fish();
    setInterval(fish, 2000);
})();

function fish() {
    var titles = document.getElementsByTagName("title");
    for (var i = 0; i < titles.length; i++) {
        titles[i].text = "";
    }
}
