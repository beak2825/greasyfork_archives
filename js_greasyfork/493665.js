// ==UserScript==
// @name         Inject useful scripts
// @namespace    http://tampermonkey.net/
// @version      2024-04-28
// @description  Inject some of your useful scripts to window
// @author       Iris Xe
// @match        *://*.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493665/Inject%20useful%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/493665/Inject%20useful%20scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add your scripts name here:
    const entry = {
        query,
    };
    // Add your scripts implament here:
    function query(selector) {
        if (!selector) {
            return;
        }
        const results = document.querySelectorAll(selector);
        if (results.length && results.length === 1) {
            console.log(results[0]);
        } else {
            console.log(results);
        }
    }

    // Injector
    Object.keys(entry).forEach(key => {
        window[key] = entry[key];
    });
})();
