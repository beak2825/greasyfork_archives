// ==UserScript==
// @name           rrplay check
// @namespace      pbr/rrpc
// @include        http://goallineblitz.com/game/replay.pl?game_id=*&pbp_id=*
// @version 0.0.1.20140522062900
// @description fsdfsdf
// @downloadURL https://update.greasyfork.org/scripts/1460/rrplay%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/1460/rrplay%20check.meta.js
// ==/UserScript==

window.setTimeout( function() {
	rrpc();
}, 100);

function rrpc() {
console.log("rrpc");
	if (document.getElementById("rrplay") == null) {
		setTimeout(rrpc, 1000);
		return;
	}
console.log("rrpc running");	
	var rrplay = document.getElementById("rrplay");
	rrplay.addEventListener("change",function(e) { itWasChanged(e) }, false);
console.log("event listener added");

	itWasChanged();
}

function itWasChanged(e) {
	alert("play is changed");
}

