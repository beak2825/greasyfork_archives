// ==UserScript==
// @name         Access Skeletrix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows you to access the Skeletrix app url without an iPod
// @author       claiomhor
// @match        http://143.244.202.221/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526403/Access%20Skeletrix.user.js
// @updateURL https://update.greasyfork.org/scripts/526403/Access%20Skeletrix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const newUserAgent = "Mozilla/5.0 (iPod; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1";
    
    Object.defineProperty(navigator, 'userAgent', {
        get: function () {
            return newUserAgent;
        }
    });
    
})();