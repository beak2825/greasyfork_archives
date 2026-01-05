// ==UserScript==
// @name         Agario ???? Script:No Ads, Best Macros, CSStyler, AutoDarkTheme, Music - Works after update-☑
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Combines CSStyler, Agario Electronic Music, and Best Tricksplit, Doublesplit, and Feeding Macros scripts.
// @author       Ajax Playz + Tom Burris
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20332/Agario%20%20Script%3ANo%20Ads%2C%20Best%20Macros%2C%20CSStyler%2C%20AutoDarkTheme%2C%20Music%20-%20Works%20after%20update-%E2%98%91.user.js
// @updateURL https://update.greasyfork.org/scripts/20332/Agario%20%20Script%3ANo%20Ads%2C%20Best%20Macros%2C%20CSStyler%2C%20AutoDarkTheme%2C%20Music%20-%20Works%20after%20update-%E2%98%91.meta.js
// ==/UserScript==
document.getElementById("instructions").innerHTML = document.getElementById("instructions").innerHTML.replace("</center>", "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> or <b>4</b> to split 4x</span></span>"+
"<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>3</b> to split 3x</span></span>"+
"<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> or <b>2</b> to split 2x</span></span>"+
"<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>Q</b> for macro feed</span></span></center>");
document.getElementById("nick").music = true;
setTimeout(function() {
	"use strict";
	var styler = document.getElementById("nick").styler;
	console.log("styler is: "+styler);
	var scr = document.getElementsByClassName("side-container right-container")[0];
	scr.id = "side-container-right";
	scr.class = "";
	if (!styler) {
		scr.removeChild(document.getElementById("agario-web-incentive"));
		scr.removeChild(document.getElementsByClassName("agario-promo")[0]);
		var clone = document.getElementById("adbg").cloneNode(true);
		clone.style.left = "-9999px";
		document.getElementsByTagName("body")[0].appendChild(clone);
		document.getElementById("overlays").removeChild(document.getElementById("adbg"));
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
	document.getElementById("mainPanel").replaceChild(child2, document.getElementById("adbg").parentNode);
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
document.getElementById("nick").styler = true;
setTimeout(function() {
	'use strict';
	var music = document.getElementById("nick").music;
	console.log("music is: "+music);
	var panels = document.getElementsByClassName("agario-panel");
	for (var n = 0;n<panels.length;n++) {
		panels[n].style.backgroundColor = "black";
		panels[n].style.color = "white";
		panels[n].style.outline = "1px solid white";
		panels[n].style.borderRadius = "0px";
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
			document.getElementById("mainPanel").removeChild(document.getElementsByTagName("center")[5]);
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
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        // I changed the above because now agario 'remembers' your preferences, but doesn't actually work, so if they're already set to be true, you need to undo it, then re click to true
    } else {
        setTimeout(load, 100);
    }
}
function keydown(event) {
    if (event.keyCode == 81) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 69 || event.keyCode == 52) { //( ͡° ͜ʖ ͡°)
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Triplesplit
    if (event.keyCode == 51 || event.keyCode == 65) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 68 || event.keyCode == 50) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    }
} // When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With Q
function fukherriteindapussie() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(fukherriteindapussie, imlost);
    }
}
function ilikedick() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
//Looking through the code now are we? ( ͡° ͜ʖ ͡°)