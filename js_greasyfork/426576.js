// ==UserScript==
// @name          Youtube Always Dark Theme
// @description   Enables Dark Theme Forever.
// @author        nullgemm
// @version       0.1.0
// @grant         none
// @match         *://*.youtube.com/*
// @run-at        document-start
// @icon          https://www.youtube.com/s/desktop/264d4061/img/favicon.ico
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @downloadURL https://update.greasyfork.org/scripts/426576/Youtube%20Always%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/426576/Youtube%20Always%20Dark%20Theme.meta.js
// ==/UserScript==

var date = new Date();
date.setTime(date.getTime()+(100*24*60*60*1000));
var expires = "; expires="+date.toGMTString();
document.cookie = "PREF=f6=400"+expires+"; domain=.youtube.com; path=/";