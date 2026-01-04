// ==UserScript==
// @name         skip weibo guide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳过微博向导
// @author       zedlz
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404982/skip%20weibo%20guide.user.js
// @updateURL https://update.greasyfork.org/scripts/404982/skip%20weibo%20guide.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const url = window.location.href

    console.log(url)

    if (url === 'https://weibo.com/nguide/interests') {
        window.location.href = 'https://weibo.com/u/7089034220/home?is_new=1&leftnav=1';
    }
})();
