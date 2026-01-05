// ==UserScript==
// @name        MTurk Message Receiver
// @namespace   http://idlewords.net
// @description Used in conjuction with other scripts to automatically open windows from links contained in HITs
// @include     https://www.mturk.com/mturk/continue*
// @include     https://www.mturk.com/mturk/previewandaccept*
// @include     https://www.mturk.com/mturk/accept*
// @include     https://www.mturk.com/mturk/return*
// @include     https://www.mturk.com/mturk/submit
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11884/MTurk%20Message%20Receiver.user.js
// @updateURL https://update.greasyfork.org/scripts/11884/MTurk%20Message%20Receiver.meta.js
// ==/UserScript==

function receiveMessage(event) {
	console.log(event);
	if (event.data.search("!!!!!") > -1) {
		var openData = event.data.split('!!!!!');
		window.open(openData[1], openData[0], 'toolbar=1,location=1,menubar=1,scrollbars=1');
	}
}

if ($("td:contains('Let someone else do it')").length) {
	window.addEventListener("message", receiveMessage, false);
}