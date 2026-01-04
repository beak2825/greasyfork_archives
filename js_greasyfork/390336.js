// ==UserScript==
// @name         Subbot
// @namespace    youtube.com/watch?*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390336/Subbot.user.js
// @updateURL https://update.greasyfork.org/scripts/390336/Subbot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){document.getElementsByClassName("ytd-subscribe-button-renderer")[0].click()},4000)
})();