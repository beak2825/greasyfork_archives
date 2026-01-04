// ==UserScript==
// @name         Disquss Decentizer
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Make dicsuss comments decent
// @author       myklosbotond
// @license      MIT
// @match        https://disqus.com/*
// @icon         https://c.disquscdn.com/next/current/marketing/assets/img/brand/favicon-32x32.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511780/Disquss%20Decentizer.user.js
// @updateURL https://update.greasyfork.org/scripts/511780/Disquss%20Decentizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
a[data-action=profile] {
    display: none !important;
}
    `);
})();