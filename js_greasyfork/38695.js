// ==UserScript==
// @name        BlueCat Address Manager Expand EventLog Lines
// @namespace   *
// @description Expand all messages in event log to prevent popups in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     3
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/38695/BlueCat%20Address%20Manager%20Expand%20EventLog%20Lines.user.js
// @updateURL https://update.greasyfork.org/scripts/38695/BlueCat%20Address%20Manager%20Expand%20EventLog%20Lines.meta.js
// ==/UserScript==

function expandLog() {
	var rowseven = document.getElementsByClassName("value-table list-row-even");
	var rowsodd = document.getElementsByClassName("value-table list-row-odd");
	var rowscombined = [].concat(Array.prototype.slice.call(rowsodd), Array.prototype.slice.call(rowseven));

	for (i = 0; i < rowscombined.length; i++) {
		var cols = rowscombined[i].getElementsByTagName("td");
		for (j = 0; j < cols.length; j++) {
			var els = cols[j].getElementsByTagName("span");
			for (k = 0; k < els.length; k++) {
				if (typeof(els[k]) != "undefined") {
					els[k].style.whiteSpace = "normal";
					els[k].style.padding = "5px 1px 5px 5px";
				}
			}
		}
	}
}
if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: EventLog /.test(page)) {
    	var topBar = document.getElementsByClassName('value-table-topToolBar')[0];
    	var tBody = topBar.getElementsByTagName('tbody')[2];
    	var tR = tBody.getElementsByTagName('tr')[0];
    	var w = tR.insertCell(-1);
    	w.innerHTML='<div class="separator">&nbsp;</div>';
    	var x = tR.insertCell(-1);
    	x.innerHTML='<span id="expandButton"><b>Expand</b></span>';
    	var lable = document.getElementById('expandButton');
    	lable.addEventListener("click",() => { expandLog(); },false);
    }
}