// ==UserScript==
// @name           Coaching Bar Numbers For Pigskin Empire
// @namespace      pbr/cbn
// @include        http://*.pigskinempire.com/coach.asp?id=*
// @copyright      2009, pabst
// @license        (CC) Attribution Share Alike; http://creativecommons.org/licenses/by-sa/3.0/
// @version        09.07.06
// @description fsdfs
// @downloadURL https://update.greasyfork.org/scripts/1459/Coaching%20Bar%20Numbers%20For%20Pigskin%20Empire.user.js
// @updateURL https://update.greasyfork.org/scripts/1459/Coaching%20Bar%20Numbers%20For%20Pigskin%20Empire.meta.js
// ==/UserScript==

window.setTimeout( function() {
	cbn();
}, 100);

function cbn() {
	var page = document.getElementById("page");
	var td = page.getElementsByTagName("td");
	for (var i=0; i<td.length; i++) {
		if (td[i].bgColor != "") {
			td[i].style.color = "#ffffff";
			td[i].innerHTML = td[i].width;
		}
	}
}
