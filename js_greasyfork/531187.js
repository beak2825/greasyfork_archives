// ==UserScript==
// @name        Twitter/X Redirect
// @namespace   Twitter/X Redirect
// @include     *://x.com/*
// @include     *://www.x.com/*
// @icon        https://nitter.net/logo.png
// @grant       none
// @version     1
// @author      LiamGo
// @description Userscript that redirects Twitter/X to Nitter
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/531187/TwitterX%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/531187/TwitterX%20Redirect.meta.js
// ==/UserScript==

// Enable/disable sites redirecting
var redirect_twitter = true;

// Change instances
var nitter_instance = "https://farside.link/nitter";

var site = window.location.hostname
var path = window.location.pathname

if (redirect_twitter && (site == "x.com" || site == "www.x.com")) {
  window.location.replace(nitter_instance + path)
}