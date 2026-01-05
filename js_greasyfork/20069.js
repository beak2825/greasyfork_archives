// ==UserScript==
// @name         TinyTank Fullscreen
// @namespace    http://dafudgewizzad.ml
// @version      0.1
// @description  kys
// @author       DaFudgeWizzadYT
// @match        http://www.multiplayer.gg/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20069/TinyTank%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/20069/TinyTank%20Fullscreen.meta.js
// ==/UserScript==

function main() {
	var height = window.innerHeight - 30;
	console.log(height);
	var width = window.innerWidth - 30;
	console.log(width);
	var d = document.body;
	d.setAttribute("style", "position: absolute; margin: 0;");
	var a = document.getElementById('templatemo_middle_wrapper');
	a.setAttribute("style", "position: absolute; left: 0; height: "+height+"px; width: "+width+"px;");
	var b = document.getElementById('templatemo_middle');
	b.setAttribute("style", "position: absolute; margin: 0; left: 0; top: 0; height: "+height+"px; width: "+width+"px;");
	var c = document.getElementById('flashbox');
	c.style.position = "absolute";
	c.setAttribute("style", "position: absolute; margin: 0; left: 0; top: 0; height: "+height+"px; width: "+width+"px;");
	var e = document.getElementsByTagName('object')[0];
	e.setAttribute("width", width);
	e.setAttribute("height", height);
	var f = document.getElementsByTagName('object')[1];
	f.setAttribute("width", width);
	f.setAttribute("height", height);
	f.setAttribute("style", "position: absolute; left: 0;");
}
main();
window.onresize = function(event) {
	main();
};