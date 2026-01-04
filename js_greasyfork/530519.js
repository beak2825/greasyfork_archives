// ==UserScript==
// @name         修复Bing白屏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修复bing有几率白屏
// @author       LWF
// @match        *://cn.bing.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530519/%E4%BF%AE%E5%A4%8DBing%E7%99%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/530519/%E4%BF%AE%E5%A4%8DBing%E7%99%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const newUrl = window.location.href.replace('cn.bing.com', 'www4.bing.com');
    if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
    }
})();