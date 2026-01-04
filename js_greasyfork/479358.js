// ==UserScript==
// @name         Kemas Link Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip waiting 15s
// @author       You
// @match        https://kemas.in/redirect?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemas.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479358/Kemas%20Link%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/479358/Kemas%20Link%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const queryString = window.location.search;

    const search = new URLSearchParams(queryString)
    const url = search.get("url")
    if(url) {
       window.location.href = atob(url)
    }
})();