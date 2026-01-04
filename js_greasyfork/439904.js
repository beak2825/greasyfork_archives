// ==UserScript==
// @name            10minutemail auto-clicker for "Get 10 more minute" button
// @name:it         10minutemail click automatico per avere altri 10 minuti
// @namespace       marcellozaniboni.net
// @version         1.3
// @description     auto-click for getting 10 more minutes with a random timeout
// @description:it  clicca automaticamente il bottone per ottenere 10 minuti aggiuntivi con una scadenza causale
// @author          Marcello Zaniboni
// @match           https://10minutemail.com/
// @license         GPL version 2 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439904/10minutemail%20auto-clicker%20for%20%22Get%2010%20more%20minute%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/439904/10minutemail%20auto-clicker%20for%20%22Get%2010%20more%20minute%22%20button.meta.js
// ==/UserScript==

var progname="10MINUTEMAIL-CLICKER - ";

// returns milliseconds for a time between 5 and 8 minutes
function get_timer_ms() {
	return Math.round(60 * (5000 + Math.random() * 4000));
}

function link_click() {
	var link_found = false;

	try {
		document.getElementById("get_more_time").click();
		link_found = true;
	} catch(e) {
		console.log(progname + "WARN: refresh link NOT found!");
		alert("WARNING: refresh link NOT found!\nPlease click it manually.");
	}

	if (link_found) {
		var timeout = get_timer_ms();
		console.log(progname + "INFO: click planned within " + timeout + " ms; about " + Math.round(timeout/1000/60) + " minutes.");
		window.setTimeout(link_click, timeout);
	}
}

var timeout = get_timer_ms();
console.log(progname + "INFO: click planned within " + timeout + " ms; about " + Math.round(timeout/1000/60) + " minutes.");
window.setTimeout(link_click, timeout);
