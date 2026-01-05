// ==UserScript==
// @name         Agario Styler & Removes Ads
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds Style To Agario
// @author       Tom Burris
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20146/Agario%20Styler%20%20Removes%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/20146/Agario%20Styler%20%20Removes%20Ads.meta.js
// ==/UserScript==
document.getElementById("nick").styler = true;
setTimeout(function() {
	'use strict';
	var music = document.getElementById("nick").music;
	console.log("music is: "+music);

	var panels = document.getElementsByClassName("agario-panel");

	for (var n = 0;n<panels.length;n++) {
		panels[n].style.backgroundColor = "black";
		panels[n].style.color = "white";
		panels[n].style.outline = "1px solid black";
		panels[n].style.borderRadius = "5px";
	}

	remove();

	$("#settings").show();
	$("#instructions").show();

	document.getElementsByClassName("btn btn-info btn-settings")[0].addEventListener('click', function() {$("#instructions").show();});

	var inputs = document.getElementsByTagName("input");

	for (var n = 0; n < inputs.length; n++) {
		if (inputs[n].type == "text" || (inputs[n].type != "radio" && inputs[n].type != "checkbox")) {
			inputs[n].style.backgroundColor = "black";
			inputs[n].style.color = "white";
			if (inputs[n].id===null || inputs[n].id === "") {
				inputs[n].id = "uniqueID"+n;
			}
			document.styleSheets[document.styleSheets.length-1].addRule('#'+inputs[n].id+'::selection','background: green');
		}
	}

	//document.styleSheets[document.styleSheets.length-1].insertRule('#nick::focus {outline:0px none transparent;}', 0);

	document.getElementById("gamemode").style.backgroundColor = "black";
	document.getElementById("gamemode").style.color = "white";
	//document.styleSheets[document.styleSheets.length-1].addRule('option::hover','background: green');

	document.getElementById("region").style.backgroundColor = "black";
	document.getElementById("region").style.color = "white";

	document.getElementById("quality").style.backgroundColor = "black";
	document.getElementById("quality").style.color = "white";

	document.getElementById("statsGraph").style.bottom = "";
	document.getElementById("statsGraph").style.top = "40px";

	document.getElementById("stats").getElementsByTagName("hr")[0].style.top = "270px";

	document.getElementById("socialStats").style.bottom = "";
	document.getElementById("socialStats").style.top = "290px";

	document.getElementById("statsContinue").style.bottom = "20px";
	document.getElementById("statsContinue").style.top = "344px";

	document.getElementById("stats").getElementsByTagName("hr")[1].style.top = "40px";

	document.getElementById("stats").style.height = "398px";
	document.getElementById("stats").style.padding = "0 0 0";

	document.getElementsByClassName("agario-exp-bar progress")[0].style.backgroundColor = "black";

	var subs = document.getElementById("stats").getElementsByTagName("span");
	for (var n = 0; n < subs.length; n++) {
		if (subs[n].id == "statsSubtext" || subs[n].id == "statsText") {
			subs[n].style.color = "white";
			subs[n].style.opacity = 0.5;
		}
	}

	function remove() {
		var clone = document.getElementById("adsBottom").cloneNode(true);
		clone.style.left = "-9999px";
		document.getElementsByTagName("body")[0].appendChild(clone);
		document.getElementById("overlays").removeChild(document.getElementById("adsBottom"));

		var clone = document.getElementById("s300x250").cloneNode(true);
		clone.style.left = "-9999px";
		document.getElementsByTagName("body")[0].appendChild(clone);
		document.getElementById("stats").removeChild(document.getElementById("s300x250"));

		if (!music) {
			var clone = document.getElementById("adbg").cloneNode(true);
			clone.style.left = "-9999px";
			document.getElementsByTagName("body")[0].appendChild(clone);
			document.getElementById("mainPanel").removeChild(document.getElementById("mainPanel").getElementsByTagName("center")[1]);
		}

		document.getElementsByClassName("agario-panel agario-side-panel agario-shop-panel")[0].removeChild(document.getElementById("blocker"));
		document.getElementsByClassName("agario-panel agario-side-panel agario-panel-freecoins")[0].removeChild(document.getElementById("coins-blocker"));

		document.getElementsByClassName("side-container right-container")[0].removeChild(document.getElementById("agario-web-incentive"));
		document.getElementsByClassName("side-container right-container")[0].removeChild(document.getElementsByClassName("agario-promo")[0]);

		if (!music) {
			document.getElementById("mainPanel").removeChild(document.getElementsByTagName("hr")[1]);
		}

		//document.getElementsByClassName("row")[0].removeChild(document.getElementsByClassName("btn btn-info btn-settings")[0]);
	}
}, 100);