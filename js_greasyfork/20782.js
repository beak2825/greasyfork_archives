// ==UserScript==
// @name        Streamcloud Download Button
// @namespace   SCDB
// @author      MegaByte
// @description This script adds a download button to the streamcloud.eu page.
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at 	document-end
// @noframes
// @include     http*://*streamcloud.eu/*
// @version     2.0
// @downloadURL https://update.greasyfork.org/scripts/20782/Streamcloud%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/20782/Streamcloud%20Download%20Button.meta.js
// ==/UserScript==


var player = $("#player_code");

if(player.length != 0) {
	player.find("script").each(function() {
		var patt = new RegExp("file:\\s?\"http:\\/\\/.+?\\.mp4\"");
		var res = patt.exec($(this).html());
		if(res !== null)
			addButton(res[0].substring(7, res[0].length-1));
	});
}

function addButton(url) {
	$(".container-fluid ul.nav").prepend("<li><a href='" + url + "' download target='_blank'>Download</a></li>")
}