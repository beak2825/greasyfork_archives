// ==UserScript==
// @name         xcancel hide twitter blue
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  hides blue checks on xcancel
// @author       You
// @match        https://xcancel.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xcancel.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524685/xcancel%20hide%20twitter%20blue.user.js
// @updateURL https://update.greasyfork.org/scripts/524685/xcancel%20hide%20twitter%20blue.meta.js
// ==/UserScript==

// Setting esversion to 11 to use optional chaining.
/* jshint esversion: 11 */

(function() {
    'use strict';
    //remove blue check replies
    document.querySelectorAll('.icon-ok.verified-icon.blue').forEach((e) => {
        e.closest('.reply.thread.thread-line')?.remove();
    })
    //if there are no replies in the current batch, click load more
    if(document.querySelectorAll('.reply.thread.thread-line').length == 0 && window.location.href.includes('status')){
        document.querySelectorAll('.show-more a')[document.querySelectorAll('.show-more a').length - 1].click();
    }
})();