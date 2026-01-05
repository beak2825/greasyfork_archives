// ==UserScript==
// @name           Pigskin Empire: Eval Link On Player Page
// @namespace      pbr/elopp
// @copyright      2009, pabst
// @license        (CC) Attribution Share Alike; http://creativecommons.org/licenses/by-sa/3.0/
// @version        09.07.27
// @include        http://beta.pigskinempire.com/player.asp?id=*
// @description sdfsdf
// @downloadURL https://update.greasyfork.org/scripts/1457/Pigskin%20Empire%3A%20Eval%20Link%20On%20Player%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/1457/Pigskin%20Empire%3A%20Eval%20Link%20On%20Player%20Page.meta.js
// ==/UserScript==

window.setTimeout( 
	function() {
		main();
	}, 
	100
);

function main() {
	var list = document.getElementsByTagName("ul")[3];
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.href = window.location.toString().replace("player","evalplayer");
	a.innerHTML = "EVALUATION";
	li.appendChild(a);
	list.appendChild(li);
}
