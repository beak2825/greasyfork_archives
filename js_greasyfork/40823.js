// ==UserScript==
// @name        Gamdom Rain Notifier Mimic
// @author      Boris Britva
// @namespace   https://greasyfork.org/users/173937
// @description Mimic script for Gamdom Rain Notifier
// @version     0.1.0
// ==/UserScript==

function mimic()
{
	if( location.origin.indexOf("gamdom") == -1 )
		return;
	var d = document,
		qs = function(s, e){return (e||d).querySelector(s);},
		start = function(){
			var e = qs("#youdontruntheway");
			e.innerHTML = "The script is running! Just leave this tab open and you'll receive all the rains!";
			e = qs("#versupdv1");
			e.innerHTML = "";
		};
	switch(d.readyState)
	{
		case "loading":
		d.addEventListener("DOMContentLoaded", start);
		break;
		case "interactive":
		case "complete":
		start();
		break;
	}
}