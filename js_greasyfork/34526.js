// ==UserScript==
// @name Btcheat AutoSpin
// @description Spins btcheat slots automatically
// @author HarveyHans
// @version 0.1
// @match http://btcheat.com/home.php
// @run-at document-idle
// @namespace kairusds.bheatauto
// @downloadURL https://update.greasyfork.org/scripts/34526/Btcheat%20AutoSpin.user.js
// @updateURL https://update.greasyfork.org/scripts/34526/Btcheat%20AutoSpin.meta.js
// ==/UserScript==

var spinButton = document.getElementById("playFancy");
var spins = document.getElementById("spins");

setInterval(function(){
	if(!spinButton.disabled && parseInt(spins.innerHTML) > 0){
		spinButton.click();
	}
}, 1000);