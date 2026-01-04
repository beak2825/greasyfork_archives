// ==UserScript==
// @name          DuckDuckGo Always Terminal Theme
// @description   Enables Therminal Theme Forever.
// @author        nullgemm
// @version       0.2.1
// @grant         none
// @match         *://duckduckgo.com/*
// @run-at        document-start
// @icon          https://duckduckgo.com/favicon.ico
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @downloadURL https://update.greasyfork.org/scripts/388015/DuckDuckGo%20Always%20Terminal%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/388015/DuckDuckGo%20Always%20Terminal%20Theme.meta.js
// ==/UserScript==

var date = new Date();
date.setTime(date.getTime()+(100*24*60*60*1000));
var expires = "; expires="+date.toGMTString();
document.cookie = "ae=t"+expires+"; path=/";
document.cookie = "m=m"+expires+"; path=/";