// ==UserScript==
// @name         Fuck Pinterest
// @namespace    https://www.google.com
// @version      0.1
// @description  Filter that shit out of my searches!
// @author       martixy
// @match        https://www.google.com/*
// @grant        none
// @copyright    2016+, martixy
// @downloadURL https://update.greasyfork.org/scripts/388463/Fuck%20Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/388463/Fuck%20Pinterest.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

//Note: The URL filter can't match just country-specific domains (https://developer.chrome.com/extensions/match_patterns)
//so if you use google on a TLD other than .com, change the match to your preferred TLD
//(e.g. https://www.google.com/* -> https://www.google.co.uk/*)

//Blocking the site itself can be done with any adblocker out there.

var urlParams = new URLSearchParams(window.location.search);
if ((q = urlParams.get('q')) !== null && q.indexOf('pinterest') === -1) {
    urlParams.set('q', q + ' -site:pinterest.*');
    window.location.search = urlParams.toString();
}