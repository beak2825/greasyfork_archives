// ==UserScript==
// @name         Hacking with Swift Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove sections that clutter the website
// @author       iczman
// @match        https://*.hackingwithswift.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/19895/Hacking%20with%20Swift%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/19895/Hacking%20with%20Swift%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#latestTutorial").remove();
})();