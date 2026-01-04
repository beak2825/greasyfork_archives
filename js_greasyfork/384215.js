// ==UserScript==
// @description Redirects Youtube URLs to Invidio.us when asked to sign in
// @name Invidious Redirect on sign in
// @namespace mikeri.net
// @include https://www.youtube.com/*
// @include https://m.youtube.com/*
// @version 1.0
// @run-at document-start
// @grant none
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/384215/Invidious%20Redirect%20on%20sign%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/384215/Invidious%20Redirect%20on%20sign%20in.meta.js
// ==/UserScript==
var found = false;
setInterval(function () {
	if ((found == false & $("paper-button[aria-label='Sign in'].style-dark-on-black").length == 1) ||
      (found == false & $(".playability-status-signin-button > c3-material-button:nth-child(1) > button:nth-child(1) > div:nth-child(1) > div:nth-child(1)").length == 1)){
      found = true;
		a = '//invidio.us/watch?' + window.parent.location.href.split('?')[1];
		window.location.replace(a);
	}
}, 100);