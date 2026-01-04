// ==UserScript==
// @name         Redirect Medium URLs to scribe.rip
// @namespace    https://davidblue.wtf
// @version      0.1
// @description  Redirect all URLs hosted on medium.com to scribe.rip
// @author       David Blue
// @match        *://medium.com/*
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/462045/Redirect%20Medium%20URLs%20to%20scriberip.user.js
// @updateURL https://update.greasyfork.org/scripts/462045/Redirect%20Medium%20URLs%20to%20scriberip.meta.js
// ==/UserScript==
(function() {
    "use strict";
    window.location.replace(window.location.href.replace("medium.com", "scribe.rip"));
})();