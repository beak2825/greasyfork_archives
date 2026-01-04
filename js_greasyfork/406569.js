// ==UserScript==
// @name         跳过广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://adfoc.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406569/%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406569/%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();    setInterval(function() {
        if (click_url) {
            window.location.href=click_url;
        }
    },3)