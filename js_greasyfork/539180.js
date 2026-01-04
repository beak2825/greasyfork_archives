// ==UserScript==
// @name         FFXIV NA to JP Redirect (Simple Replace)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace 'na' with 'jp' in finalfantasyxiv.com URLs
// @match        *://na.finalfantasyxiv.com/*
// @grant        none
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/539180/FFXIV%20NA%20to%20JP%20Redirect%20%28Simple%20Replace%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539180/FFXIV%20NA%20to%20JP%20Redirect%20%28Simple%20Replace%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = location.href.replace('//na.', '//jp.');
    if (location.href !== newUrl) {
        location.replace(newUrl);
    }
})();