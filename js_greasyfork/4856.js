// ==UserScript==
// @name        Yahoo! new mail alert
// @namespace   https://github.com/mjremijan
// @include     https://*.mail.yahoo.com/*
// @version     1
// @grant       none
// @description This script will play the classic "Yahoo! Mail" voice wav file when it detects you have new unread mail in your mailbox
// @downloadURL https://update.greasyfork.org/scripts/4856/Yahoo%21%20new%20mail%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/4856/Yahoo%21%20new%20mail%20alert.meta.js
// ==/UserScript==
 
var unread = -1;

function checkForUnread() {
	// (xx unread) ....
	var t = document.title;
	var p = -1;
	if (t.charAt(0) == "(") {
		p = parseInt(t.substring(1, t.indexOf(" ")));
		//alert("p = ["+p+"]");
	}
	
	var play = false;
	if (unread == -1) {
		unread = p;
		play = (unread > 0);
	} else {
		if (p > unread) {
			play = true;
		}
		unread = p;
	}
	
	if (play) 
	{
		var wavFile = "https://www.dropbox.com/s/bsmsmccug65vdtd/yahoomail.wav?dl=1";
	
		var src1 = document.createElement('SOURCE');
		src1.type= 'audio/wav';
		src1.src= wavFile;

		var e = document.createElement('AUDIO');
		e.appendChild(src1);
		e.play();
	}
}

setInterval(checkForUnread, 60 * 1000); // 60 * 1000 ms