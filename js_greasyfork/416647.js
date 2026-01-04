// ==UserScript==
// @name         Gota Script Without Macros.
// @namespace    http://tampermonkey.net/
// @description  Gota script without macros.
// @version      1.2
// @author       Flushy
// @match        https://gota.io/web/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416647/Gota%20Script%20Without%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/416647/Gota%20Script%20Without%20Macros.meta.js
// ==/UserScript==

function addStyleSheet(style){
	var getHead = document.getElementsByTagName("HEAD")[0];
	var cssNode = window.document.createElement( 'style' );
	var elementStyle= getHead.appendChild(cssNode);
	elementStyle.innerHTML = style;
	return elementStyle;
}

addStyleSheet('@import url(https://fonts.googleapis.com/css?family=Ubuntu);');
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

document.getElementById("score-panel").style.display = "flex";
document.getElementById("score-panel").style.maxWidth = "100%";
document.getElementById("score-panel").style.fontSize = "14px";