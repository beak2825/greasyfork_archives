// ==UserScript==
// @name        CyberCoders Blocker
// @version     1.0
// @description Removes CyberCoders ads.
// @match       https://www.dice.com/*
// @match       http://www.dice.com/*
// @require     http://code.jquery.com/jquery-2.1.1.js
// @copyright   Josh Hubbard
// @namespace 	https://greasyfork.org/users/5596
// @downloadURL https://update.greasyfork.org/scripts/14700/CyberCoders%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/14700/CyberCoders%20Blocker.meta.js
// ==/UserScript==

$(function () {
    $(".serp-result-content:contains('CyberCoders')").remove();
});