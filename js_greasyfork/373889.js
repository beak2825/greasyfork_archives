// ==UserScript==
// @name         No Ad-Blocker Messages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gets rid of the message that pops up when you attempt to download a file from mediafire and you have a sort of adblock enabled.
// @author       xElite_V
// @match        https://www.mediafire.com/file/*
// @match        www.mediafire.com/file/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373889/No%20Ad-Blocker%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/373889/No%20Ad-Blocker%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("abnotify").remove();
})();