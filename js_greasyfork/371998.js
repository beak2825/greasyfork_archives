// ==UserScript==
// @namespace    https://openuserjs.org/users/noritz
// @name 		 Wanikani LipSurf: Speak Your Reviews
// @description  Do reviews while you eat, or do chores. Also practice speaking your review items for better memorization.
// @homepageURL  https://community.wanikani.com/t/lipsurf-wanikani-voice-dictation-review-while-you-eat-do-chores-etc/32058
// @icon 		 https://www.lipsurf.com/favicon-32x32.png
// @copyright  	 2018, noritz (https://openuserjs.org/users/nortiz)
// @license   	 MIT
// @version 	 0.0.3
// @require  	 https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant  		 GM.openInTab
// @grant  		 GM_openInTab
// @grant  		 GM.getValue
// @grant  		 GM_getValue
// @grant  		 GM.setValue
// @grant  		 GM_setValue
// @run-at 		 document-end
// @include      https://www.wanikani.com/*
// @downloadURL https://update.greasyfork.org/scripts/371998/Wanikani%20LipSurf%3A%20Speak%20Your%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/371998/Wanikani%20LipSurf%3A%20Speak%20Your%20Reviews.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author noritz
// ==/OpenUserJS==

(async function() {
	let k = 'openedWKLipsurf';
	let hasOpened = await GM.getValue(k, false);
	if (!hasOpened) {
		GM.openInTab('http://hashify.me/IyBTcGVhayBXYW5pa2FuaSBSZXZpZXdzCiMjIFZvaWNlIGNvbnRyb2wgZm9yIFdhbmlrYW5pCgoqKioKCgoKMSkgSW5zdGFsbCB0aGUgW0xpcFN1cmYgY2hyb21lIGV4dGVuc2lvbl0oaHR0cHM6Ly9jaHJvbWUuZ29vZ2xlLmNvbS93ZWJzdG9yZS9kZXRhaWwvbGlwc3VyZi9sbm5tam1hbGFrYWhhZ2Jsa2tjbmprb2FpaGxmZ2xvbikKCgoKMikgVGhpcyB0YWIgd2lsbCBubyBsb25nZXIgb3BlbiBhbmQgeW91IGNhbiB1bmluc3RhbGwgdGhlIFVzZXJTY3JpcHQuCgotLS0KCl9JIG1hZGUgdGhpcyBmb3IgcGVvcGxlIGxpa2UgbWUgd2hvIHVzdWFsbHkgc2VhcmNoIGZvciBXSyBhZGRvbnMgb25seSB0aHJvdWdoIGdyZWFzZW1vbmtleSBzY3JpcHRzLiBCdXQgdGhpcyBXYW5pa2FuaSBleHRlbnNpb24gaXMgaGFyZCB0byBmaW5kIHVubGVzcyB5b3UncmUgYSByZWd1bGFyIG9uIHRoZSBXYW5pa2FuaSBmb3J1bXMuXw==?mode:presentation', {
			active: true,
			setParent: true,
		});

		GM.setValue(k, true);
	}
})();
