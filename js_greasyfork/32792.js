// ==UserScript==
// @name         mitbbs redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match    https://www.mitbbs.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32792/mitbbs%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/32792/mitbbs%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var site = "http://www.mitbbs.com";
    // similar behavior as an HTTP redirect
    window.location.replace(site);
})();