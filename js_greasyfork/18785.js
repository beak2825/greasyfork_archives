// ==UserScript==
// @name         /r/counting Autovote
// @namespace    https://reddit.com/r/counting
// @version      0.1
// @description  Automatically vote fellow counters
// @author       You
// @match        https://*.reddit.com/r/counting/comments/*/*_counting_thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18785/rcounting%20Autovote.user.js
// @updateURL https://update.greasyfork.org/scripts/18785/rcounting%20Autovote.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var comments = $("div.comment");
    var upvotable = $("[aria-label='upvote']:not(.upmod)", comments);
    upvotable.click();
})();