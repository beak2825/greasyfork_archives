// ==UserScript==
// @name         remove 秒懂百科 videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Baidu Baike second-wrapper remove
// @author       fvydjt
// @match        https://baike.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460594/remove%20%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/460594/remove%20%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ele = document.querySelector('#J-second-wrapper');
    ele.outerHTML = '';
})();