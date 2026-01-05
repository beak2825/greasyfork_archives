// ==UserScript==
// @name        Powerwatch Download Button
// @namespace   PWDB
// @author      MegaByte
// @description This script adds a download button to the powerwatch.pw page.
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at 		document-end
// @noframes
// @include     http*://*powerwatch.pw/*
// @version     3.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20784/Powerwatch%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/20784/Powerwatch%20Download%20Button.meta.js
// ==/UserScript==


var player = $("#vplayer");

if(player.length != 0) {
	$("body").find("script").each(function() {
		var patt = new RegExp("file:\\s?\"https?:\\/\\/.+?\\.mp4\"");
		var res = patt.exec($(this).html());
		if(res !== null) {
			var url = res[0].substring(6, res[0].length-1);
			addButton(url);
		}
	});
}

function addButton(url) {
	$("h5.h4-fine").html("<span class='head'>"+$("h5.h4-fine").html()+"</span><span class='down'><a href='" + url + "' download target='_blank'>Download</a></span>")
  GM_addStyle("h5.h4-fine { display: flex; } h5.h4-fine .head { flex-grow: 1; } h5.h4-fine .down { flex-grow: 0; }");
}
