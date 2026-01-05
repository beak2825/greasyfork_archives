// ==UserScript==
// @name         Agario Electronic Music + No Ads - Works after update - ☑
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds EDM Music to Agar.io, and removes ads!
// @author       Ajax Playz + Tom Burris
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19777/Agario%20Electronic%20Music%20%2B%20No%20Ads%20-%20Works%20after%20update%20-%20%E2%98%91.user.js
// @updateURL https://update.greasyfork.org/scripts/19777/Agario%20Electronic%20Music%20%2B%20No%20Ads%20-%20Works%20after%20update%20-%20%E2%98%91.meta.js
// ==/UserScript==
document.getElementById("nick").music = true;
setTimeout(function() {
	"use strict";
	var styler = document.getElementById("nick").styler;
	console.log("styler is: "+styler);
	if (styler) {
		document.getElementById("mainPanel").removeChild(document.getElementById("instructions"));
	}
	var scr = document.getElementsByClassName("side-container right-container")[0];
	scr.id = "side-container-right";
	scr.class = "";
	if (!styler) {
		scr.removeChild(document.getElementById("agario-web-incentive"));
		scr.removeChild(document.getElementsByClassName("agario-promo")[0]);

		var clone = document.getElementById("adsBottom").cloneNode(true);
		clone.style.left = "-9999px";
		document.getElementsByTagName("body")[0].appendChild(clone);
		document.getElementById("overlays").removeChild(document.getElementById("adsBottom"));
		var clone2 = document.getElementById("s300x250").cloneNode(true);
		clone2.style.left = "-9999px";
		document.getElementsByTagName("body")[0].appendChild(clone2);
		document.getElementById("stats").removeChild(document.getElementById("s300x250"));
		document.getElementById("stats").removeChild(document.getElementById("stats").getElementsByTagName("hr")[1]);
	}
	var child = document.createElement("div");
	child.id = "child";
	child.innerHTML = '<iframe id="YTVideo" width="300" height="300" src="" style="display:none;"></iframe>';
	scr.appendChild(child);
	document.getElementById("YTVideo").style.border = "1px solid white";
	var checked = false;
	var src = "https://www.youtube.com/embed/17fuFLCEKyY?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";

	var child2 = document.createElement("div");
	child2.id = "child2";
	child2.innerHTML = '<input style="float:left; width:20px; height:20px;" type="checkbox" id="mbox"><center><h2>Music</h2></center>'+
		'<form id="moptions" style="margin-bottom:20px; display:none;"><br>'+
		'<label><input type="radio" name="music" id="op1" style="margin-left:10px; margin-right:5px;" checked><span style="margin-right:40px;">Dubstep</span></label>'+
		'<label><input type="radio" name="music" id="op2" style="margin-right:5px;"><span style="margin-right:40px;">Trap</span></label>'+
		'<label><input type="radio" name="music" id="op3" style="margin-right:5px;"><span>Electro</span></label>'+
		'</form>';
	var clone = document.getElementById("adbg").cloneNode(true);
	clone.style.left = "-9999px";
	document.getElementsByTagName("body")[0].appendChild(clone);
	document.getElementById("mainPanel").replaceChild(child2, document.getElementById("mainPanel").getElementsByTagName("center")[document.getElementById("mainPanel").getElementsByTagName("center").length-1]);
	document.getElementById("mbox").addEventListener("click", changed);
	document.getElementById("op1").addEventListener("click", function() {change(1);});
	document.getElementById("op2").addEventListener("click", function() {change(2);});
	document.getElementById("op3").addEventListener("click", function() {change(3);});

	function changed(event) {
		if(this.checked) {
			document.getElementById("YTVideo").src = src;
			$("#YTVideo").show();
			$("#moptions").show();
		} else if(!this.checked) {
			document.getElementById("YTVideo").src = "";
			$("#YTVideo").hide();
			$("#moptions").hide();
		}
	}

	function change(which) {
		switch(which) {
			case 1:
				src = "https://www.youtube.com/embed/17fuFLCEKyY?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";
				document.getElementById("YTVideo").src = src;
				break;
			case 2:
				src = "https://www.youtube.com/embed/j5tUmWzEAO4?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";
				document.getElementById("YTVideo").src = src;
				break;
			case 3:
				src = "https://www.youtube.com/embed/XOyjT-yOfOk?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";
				document.getElementById("YTVideo").src = src;
				break;
		}
	}
}, 100);