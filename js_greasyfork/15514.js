// ==UserScript==
// @name        Salesforce ServiceCloud Console Refresh Cases List
// @namespace   Max Goldfarb
// @description Automatically refreshes case list for Salesforce ServiceCloud Console every minute.
// @include     https://*.salesforce.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     2.2.5
// @grant       none
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/15514/Salesforce%20ServiceCloud%20Console%20Refresh%20Cases%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/15514/Salesforce%20ServiceCloud%20Console%20Refresh%20Cases%20List.meta.js
// ==/UserScript==

setTimeout(autorefresh, 60000);

function autorefresh() {
	document.getElementsByClassName("refreshListButton")[0].click();
	setTimeout(autorefresh, 60000);
}

autorefresh();