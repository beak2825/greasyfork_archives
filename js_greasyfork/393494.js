// ==UserScript==
// @name          Hide Follower Request from Psychopaths on Mastodon
// @namespace     http://userstyles.org
// @description   Hides Follower Request from Psychopaths on Mastodon
// @author        636597
// @include       *://*285936586.masto.host/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/393494/Hide%20Follower%20Request%20from%20Psychopaths%20on%20Mastodon.user.js
// @updateURL https://update.greasyfork.org/scripts/393494/Hide%20Follower%20Request%20from%20Psychopaths%20on%20Mastodon.meta.js
// ==/UserScript==

(function() {
	var sheet = window.document.styleSheets[ 0 ];
	sheet.insertRule( "a[href='/web/follow_requests']{ display: none; !important }" , sheet.cssRules.length );
})();