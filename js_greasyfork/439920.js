// ==UserScript==
// @name            easybytez: autoclick download after countdown
// @name:it         easybytez: click automatico del bottone di download dopo il conto alla rovescia
// @namespace       marcellozaniboni.net
// @version         1.0
// @description     you'll never forget it anymore and no more session expiration: auto-click download at the end of the countdown for easybytez.com
// @description:it  non ti scorderai più di premere il bottone di download alla fine del conto alla rovescia: questo script evita che la pagina scada e clicca automaticamente il bottone
// @author          Marcello Zaniboni
// @match           http://www.easybytez.com/*
// @license         GPL version 2 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439920/easybytez%3A%20autoclick%20download%20after%20countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/439920/easybytez%3A%20autoclick%20download%20after%20countdown.meta.js
// ==/UserScript==

// return a string of two digits
function twonumbers(n) {
	var r;
	r = (n < 10) ? "0" : "";
	return r + n;
}

// log a message to the javascript console
function logmessage(msg) {
	var today = new Date();
	console.log("lepidalogin-clicker - " +
		twonumbers(today.getHours()) + ":" +
		twonumbers(today.getMinutes()) + ":" +
		twonumbers(today.getSeconds()) +
		" - " + msg);
}

// returns a random number from 10 to 15
function get_timer_s() {
	return 10 + Math.round(Math.random() * 5);
}

function try_to_click() {
	var btn_found = false;
	var btn;

	try {
		btn = document.getElementById("btn_download");
		if (!btn.disabled) btn_found = true;
	} catch(e) {
		// nothing to do
	}

	if (btn_found) {
		btn.click();
	} else {
		var timeout = get_timer_s();
		logmessage("button not found or disabled; next try in " + timeout + " seconds...");
		window.setTimeout(try_to_click, timeout * 1000);
	}
}

var timeout = get_timer_s();
logmessage("the script is running, first check scheduled in " + timeout + " seconds...");
window.setTimeout(try_to_click, timeout * 1000);
