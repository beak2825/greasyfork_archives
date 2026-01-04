// ==UserScript==
// @name         StackOverflowCookiePromptHider
// @description  StackOverflow - Cookie Prompt Hider
// @version      0.1
// @author       MrMike
// @namespace    MrMike/StackOverflowCookiePromptHider
// @match        https://stackoverflow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456688/StackOverflowCookiePromptHider.user.js
// @updateURL https://update.greasyfork.org/scripts/456688/StackOverflowCookiePromptHider.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
    .js-consent-banner{
        display: none !important;
    }
    `);
})();