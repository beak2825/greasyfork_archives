// ==UserScript==
// @name        YouTube Default to My Subscriptions
// @namespace   https://greasyfork.org/users/5097-aemony
// @description Makes YouTube automatically redirect you to your Subscription page if signed in.
// @include	*://*.youtube.com/
// @exclude	/^https?:\/\/\w+\.youtube\.com\/\w+$/
// @run-at	document-start
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/4895/YouTube%20Default%20to%20My%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/4895/YouTube%20Default%20to%20My%20Subscriptions.meta.js
// ==/UserScript==

var regex = new RegExp("/feed/subscriptions[/u]*");

// Check if cookie SID can be found (seems to be used when signed in)
if (document.cookie.indexOf("SID") !== -1 && !document.referrer.match(regex)) {
	document.location = document.URL + "feed/subscriptions";
}