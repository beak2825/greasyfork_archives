// ==UserScript==
// @name           PM Link On Player Page
// @namespace      pmlopp
// @include        http://goallineblitz.com/game/player.pl?player_id=*
// @version        09.08.21
// @copyright      2009, pabst
// @license        (CC) Attribution Share Alike; http://creativecommons.org/licenses/by-sa/3.0/
// @description sdfsdf
// @downloadURL https://update.greasyfork.org/scripts/1452/PM%20Link%20On%20Player%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/1452/PM%20Link%20On%20Player%20Page.meta.js
// ==/UserScript==

window.setTimeout( function() {
    main();
}, 100);

function main() {
	var td= document.getElementsByClassName("vital_data")[5];
	var link = td.firstChild;
	var id = link.href.split("=")[1];
	
	var a = document.createElement("a");
	a.href = "http://goallineblitz.com/game/new_message.pl?to="+id;
	a.innerHTML = "Send PM";

	link.parentNode.innerHTML += "&nbsp;(";

	link = td.firstChild;
	link.parentNode.appendChild(a);

	link = td.firstChild;
	link.parentNode.innerHTML += ")";
}
