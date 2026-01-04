// ==UserScript==
// @name        5ch_hnuki_link
// @namespace   https://catherine.v0cyc1pp.com/5ch_hnuki_link.user.js
// @match       http://*.5ch.net/*
// @match       https://*.5ch.net/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     1.3
// @grant       none
// @description ５ちゃんねるのh抜きリンクをリンクにする
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/377175/5ch_hnuki_link.user.js
// @updateURL https://update.greasyfork.org/scripts/377175/5ch_hnuki_link.meta.js
// ==/UserScript==

console.log("5ch_hnuki_link start");

//https://mevius.5ch.net/test/read.cgi/kitchen/1548549321/l50
//ttps://upload.wikimedia.org/wikipedia/commons/6/6f/Earth_Eastern_Hemisphere.jpg

// 置換
function makelink() {
	document.querySelectorAll("span.escaped").forEach(function(obj) {
		var html = obj.innerHTML;
		console.log("html="+html);
		if ( html.match(/ttp/) ) {
			if ( ! html.match(/http/) ) {
				console.log("h-nuki");
				//var newhtml = html.replace(/ttp:[^ ]+/,"<a href=\"$&\">$&</a>");
				var newhtml = html.replace(/ttp[^ ]+/g,"<a href=\"h$&\">$&</a>");
				console.log("newhtml="+newhtml);
				obj.innerHTML = newhtml;
			}
		}
		
	});
}

function main() {
	makelink();
}


main();