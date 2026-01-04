// ==UserScript==
// @name        Gmail Pane Resize
// @namespace   https://github.com/cubedj/GM-Scripts
// @author        cubedj <djcube21@gmail.com>
// @description Makes the left pane wider
// @include     https://mail.google.com/mail/u/0/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37450/Gmail%20Pane%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/37450/Gmail%20Pane%20Resize.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var RightPaneTargets = document.evaluate("//*[@width='1942']", 
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = RightPaneTargets.snapshotLength - 1; i >= 0; i--) {
		var elm1 = RightPaneTargets.snapshotItem(i);
		elm1.style.width = '1922';
	}
	var LeftPaneTargets = document.evaluate("//*[@width='202'] [@height='537']", 
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = LeftPaneTargets.snapshotLength - 1; i >= 0; i--) {
		var elm2 = LeftPaneTargets.snapshotItem(i);
		elm2.style.width = '222';
	}
})();