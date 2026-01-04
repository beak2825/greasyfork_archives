// ==UserScript==
// @name         Script Medium
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script ver Posts Medium
// @author       BSH
// @match        *://*.medium.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491543/Script%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/491543/Script%20Medium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    var prefix = 'https://freedium.cfd/';
    var newUrl = prefix + currentUrl;

    // Redirecionar na mesma aba
    if (window.location.href !== newUrl) {
        window.location.replace(newUrl);
    }
})();