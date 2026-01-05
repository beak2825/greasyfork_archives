// ==UserScript==
// @name         Gota Script
// @namespace    Pretty Good Gota Script
// @description  T - 16 Split -|- Y - Triple Split -|- U - Double Split
// @version      10.5
// @author       FFEC - Editted By Silf - Edited By Tom
// @match        http://gota.io/web/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23475/Gota%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/23475/Gota%20Script.meta.js
// ==/UserScript==

// Thanks Tom Burris for removing some code that was useless!
function addStyleSheet(style){
	var getHead = document.getElementsByTagName("HEAD")[0];
	var cssNode = window.document.createElement( 'style' );
	var elementStyle= getHead.appendChild(cssNode);
	elementStyle.innerHTML = style;
	return elementStyle;
}

//Custom Font, Logo, Minimap
addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Ubuntu);');
GM_addStyle('* #logo {background-image: url(" ");}'); // Put link between brackets
GM_addStyle('* #minimap-canvas {background-image: url(" ");}'); //Put link between brackets
GM_addStyle('*{font-family: Ubuntu;}');
GM_addStyle('* .coordinates {font-family: Ubuntu;}');
GM_addStyle('* #leaderboard-panel {font-size: 24px;}');

var fillTextz = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function(){
	var argumentz = arguments;
	if(this.canvas.id == 'leaderboard-canvas'){
		this.font = 'bold 15px Ubuntu';
	}
	if(this.canvas.id == 'minimap-canvas'){
		this.font = 'bold 15px Ubuntu';
	}
	if(this.canvas.id == 'party-canvas'){
		this.font = 'bold 15px Ubuntu';
	}
	fillTextz.apply(this, arguments);
};

//Border Removal
document.getElementById("leaderboard-panel").style.borderRadius = "0";
document.getElementById("leaderboard-panel").style.borderWidth = "0px";
document.getElementById("leaderboard-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("score-panel").style.borderRadius = "0";
document.getElementById("score-panel").style.borderWidth = "0px";
document.getElementById("score-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.borderRadius = "0";
document.getElementById("minimap-panel").style.borderWidth = "0px";
document.getElementById("minimap-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.marginBottom = "3px";
document.getElementById("party-panel").style.borderRadius = "0";
document.getElementById("party-panel").style.borderWidth = "0px";
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px black";

//Panel Borders
GM_addStyle('* .main-panel {border: solid 3px rgba(99, 97, 95, 0.5)}');
GM_addStyle('* .main-panel {border-radius: 0px}');
GM_addStyle('* .main-panel {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('* .gota-btn {border-radius: 15px}');
GM_addStyle('* .main-bottom-stats {border-radius: 5px}');
GM_addStyle('* #popup-party {border-radius: 0px}');
GM_addStyle('* #popup-party {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');
GM_addStyle('* #popup-login {border-radius: 0px}');
GM_addStyle('* #popup-login {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.25)}');
GM_addStyle('* .login-input {border-radius: 0px}');
GM_addStyle('* #chat-input {border-radius: 0 0 0px 0px}');
GM_addStyle('* .ui-pane {box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.52)}');
GM_addStyle('* #main-cover {display: none}');

//Chat Size
GM_addStyle('* #chat-panel {width: 300px}');
GM_addStyle('* #chat-panel {height: 195px}');

//Social Media Buttons Removal
$(".main-bottom-links").replaceWith("");

//Instructions
var maincontent = document.getElementById("main-content");
var version = document.createElement("div");
version.innerHTML = 'T - Tricksplit -|- Y - Triplesplit -|- U - Double split';
version.id = 'instructions';
maincontent.appendChild(version);
document.getElementById("instructions").style.textAlign = "center";
document.getElementById("instructions").style.fontSize = "12px";
document.getElementById("instructions").style.color = "white";

//Ad Remove
$("#main-rb").replaceWith("");
GM_addStyle ('* #main {left: 350px;}');

//Custom Cursor
GM_addStyle ('* body {cursor: crosshair;}');

function split() {
	window.onkeydown({keyCode: 32});
	window.onkeyup({keyCode: 32});
}

window.addEventListener('keydown', keydown);
//window.addEventListener('keyup', keyup); //This isn't used
var timeBetweenSplits = 10; //This is the number of milliseconds between splits for the macros

function keydown(event) {
	if (event.keyCode == 85) { //key U
		split();                  //Double Split
		setTimeout(split, timeBetweenSplits*1);
	} else if (event.keyCode == 89) { //key Y
		split();                  //Triple Split
		setTimeout(split, timeBetweenSplits*1);
		setTimeout(split, timeBetweenSplits*2);
	} else if (event.keyCode === 84) { //key T
		split();                  //16 Split Macro
		setTimeout(split, timeBetweenSplits*1);
		setTimeout(split, timeBetweenSplits*2);
		setTimeout(split, timeBetweenSplits*3);
	} else if (event.keyCode == 80) { //key P
		$("canvas").trigger($.Event("mousemove", {clientX: window.innerWidth/2, clientY: window.innerHeight/2})); //Stop Cell
	} else if (event.keyCode == 67) { //key C
		document.getElementById("cHideChat").click(); //Hide Chat (Delete this line if you don't want it)
	} else if (event.keyCode == 70) { //key F
		document.getElementById("cHideFood").click(); //Hide Pellets (Delete this line if you don't want it)
	} else if (event.keyCode == 83) { //key S
		document.getElementById("cHideSkins").click(); //Hide Skins (Delete this line if you don't want it)
	}
}
//Remove some of the code sections if you dislike them