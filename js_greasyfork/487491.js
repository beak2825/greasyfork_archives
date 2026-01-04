// ==UserScript==
// @name         t66y cleaner
// @namespace    http://tampermonkey.net/
// @version      2024-02-17
// @description  t66y屏蔽10秒 
// @author       You
// @match        *://t66y.com/*
// @grant        none
// @license      Apache License 2.0
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/487491/t66y%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/487491/t66y%20cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('DOMContentLoaded', (event) => {
        console.log("DOM fully loaded. Attempting to override r9aeadS.");
        if (window.r9aeadS) {
            console.log('r9aeadS exists, overriding it now.');
            window.r9aeadS = function() { console.log('r9aeadS has been successfully overridden.'); };
        } else {
            console.log('r9aeadS does not exist or cannot be overridden at this time.');
        }
    });
})();
