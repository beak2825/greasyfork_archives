// ==UserScript==
// @name         NetFunnel Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lol
// @author       fienestar
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netfunnel.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460684/NetFunnel%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/460684/NetFunnel%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(typeof NetFunnel !== undefined){
        setInterval(() => {
            NetFunnel.TS_BYPASS = true;
        }, 100);
    }
})();