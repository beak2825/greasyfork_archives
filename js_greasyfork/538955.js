// ==UserScript==
// @name         Google Search fix Pink links
// @name:ru      Google Search fix Pink links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Visited links are pink, not visited are blue. And nothing else. SRC: https://github.com/lynrayy/TampermonkeyScripts
// @description:ru  Visited links are pink, not visited are blue. And nothing else. SRC: https://github.com/lynrayy/TampermonkeyScripts
// @author       Lynrayy, ChatGPT
// @include      *://www.google.*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538955/Google%20Search%20fix%20Pink%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/538955/Google%20Search%20fix%20Pink%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlPattern = /^https?:\/\/www\.google\.[a-z]{2,3}\/.*/;

    if (urlPattern.test(window.location.href)) {
        GM_addStyle(`
            a:visited {
                color: #681DA8 !important;
            }
            a {
                color: #1A0DAB !important;
            }
        `);
    }
})();