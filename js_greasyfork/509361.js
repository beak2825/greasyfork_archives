// ==UserScript==
// @name         GitHub Sky-UK to NBCUDTC redirect
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  Redirect from sky-uk to nbcudtc org on 404 pages
// @author       Dinis Madeira
// @match        https://github.com/sky-uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509361/GitHub%20Sky-UK%20to%20NBCUDTC%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/509361/GitHub%20Sky-UK%20to%20NBCUDTC%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/page not found/i.test(document.title)) {
        location.pathname = location.pathname.replace(/^\/sky-uk\//, "/nbcudtc/")
    }
})();