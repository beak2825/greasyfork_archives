// ==UserScript==
// @name        Default YouTube to Dark Theme
// @version     0.2
// @description Makes YouTube default to its Dark Theme by initialising the relevant cookie
// @author      uxamend
// @namespace   https://greasyfork.org/en/users/231373-uxamend
// @match       *://*.youtube.com/*
// @grant       none
// @run-at      document-start
// @license     CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/408542/Default%20YouTube%20to%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/408542/Default%20YouTube%20to%20Dark%20Theme.meta.js
// ==/UserScript==

"use strict";

var c = document.cookie

// If there's no PREF cookie, then create one with a value that enables the Dark Theme
if(!c || !c.match("^PREF=|; ?PREF=")) {
  document.cookie = "PREF=f6=400;domain=youtube.com";
}

// We are only interested in setting the cookie if this is the first visit to YouTube since
// cookies were cleared/deleted.
// 
// If the cookie already exists, then we don't need or want to do anything.
//
// Overwriting an existing PREF cookie could risk data loss of other preferences, since we
// don't know how exactly preferences are expressed. All we know is that PREF=f6=400
// gives us YouTube's defaults except with Dark Theme enabled.
