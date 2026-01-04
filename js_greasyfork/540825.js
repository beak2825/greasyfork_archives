// ==UserScript==
// @name         wf.xuerian.net Fix
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Fixes localization issues forcing English properly
// @match        https://wf.xuerian.net/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540825/wfxueriannet%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540825/wfxueriannet%20Fix.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    setTimeout(() => {
        if (document._L) {
 
            const L = {
                "en-US": document._L,
                [navigator.language]: document._L
            };
 
            Object.defineProperty(document, 'L', {
                configurable: true,
                get: () => L,
                set: () => {}
            });
 
 
            Object.defineProperty(window, 'L', {
                configurable: true,
                get: () => L,
                set: () => {}
            });
 
            console.log("Localization fixed");
        } else {
            console.warn("document._L not found");
        }
    }, 1000);
})();