// ==UserScript==
// @name         SG去背景图
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  基德基德
// @author       You
// @match        https://bbs.sgamer.com/*
// @grant        GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/386519/SG%E5%8E%BB%E8%83%8C%E6%99%AF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/386519/SG%E5%8E%BB%E8%83%8C%E6%99%AF%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    GM_addStyle("body{background:#eee none!important;}")
    GM_addStyle("html,body{-webkit-filter:grayscale(0)!important;}")
})();
