// ==UserScript==
// @name         Block Network Traffic V1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blocks network traffic by intercepting fetch requests
// @author       zuxity
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493361/Block%20Network%20Traffic%20V11.user.js
// @updateURL https://update.greasyfork.org/scripts/493361/Block%20Network%20Traffic%20V11.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.fetch = function() {
        console.log("Network traffic blocked: Fetch request intercepted");
        return Promise.reject("Network traffic blocked");
    };

})();
