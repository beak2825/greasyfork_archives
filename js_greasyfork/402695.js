// ==UserScript==
// @name         Steam Auto-Like
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Steam Auto-Like everything on page load
// @author       andwan0
// @match        https://steamcommunity.com/id/*/home/
// @match        https://steamcommunity.com/id/*/myactivity
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @copyright 2020, andwan0 (https://openuserjs.org/users/andwan0)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402695/Steam%20Auto-Like.user.js
// @updateURL https://update.greasyfork.org/scripts/402695/Steam%20Auto-Like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Pictures
    document.querySelectorAll("a[id^=vote_up]:not(.active)").forEach(
        function(item) {item.click()}
    );

    // News announcements
    document.querySelectorAll("span[id^=VoteUpBtn_]:not(.btn_active)").forEach(
        function(item) {item.click()}
    );

    // Friends Reviews
    document.querySelectorAll("a[id^=RecommendationVoteUpBtn]:not(.btn_active)").forEach(
        function(item) {item.click()}
    );

})();