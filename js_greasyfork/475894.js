// ==UserScript==
// @name         Show ko-fi support time.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show ko-fi support time, enjoy.
// @author       You
// @match        https://ko-fi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ko-fi.com
// @grant        GM_addStyle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/475894/Show%20ko-fi%20support%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/475894/Show%20ko-fi%20support%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.feeditem-time-awhile{display: inline-block !important}')
})();