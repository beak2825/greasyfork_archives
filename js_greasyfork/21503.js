// ==UserScript==
// @name         Ogame Retro - Link do Forum 
// @namespace    Dodaje link do forum w menu gry Ogame Retro
// @include      http://ogame1304.de/game/index.php?page=*
// @description  joks@linux.pl
// @author       joks
// @version      1.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21503/Ogame%20Retro%20-%20Link%20do%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/21503/Ogame%20Retro%20-%20Link%20do%20Forum.meta.js
// ==/UserScript==


(function ()
{

	var div = document.getElementById ("menu");
	if ((div == null) || (div.length < 5))
		return;
	var tr = div.getElementsByTagName ("tr") [12];
	var td = document.createElement ("td");
	var link = document.createElement ("a");
	link.setAttribute ("href", "http://board.ogame.pl/index.php?page=Index");
	link.setAttribute ("target", "_blank", "align", "center");
    td.setAttribute ("align", "center");
	link.appendChild (document.createTextNode ("Forum"));
	td.appendChild (link);
	tr.parentNode.insertBefore (td, tr);
  
}) ();