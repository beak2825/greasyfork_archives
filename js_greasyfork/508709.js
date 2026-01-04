// ==UserScript==
// @name         zhihu web
// @namespace    http://tampermonkey.net/
// @version      2025-11-16
// @description  为https://zhihulite.github.io/提供跨域支持
// @author       You
// @match        https://zhihulite.github.io/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/508709/zhihu%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/508709/zhihu%20web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let window=unsafeWindow

    window.GM_xmlhttpRequest=GM_xmlhttpRequest

})();