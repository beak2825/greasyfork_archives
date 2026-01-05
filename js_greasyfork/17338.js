// ==UserScript==
// @name     Remove all BO1 games on CSGL
// @description Removes all BO1 games on CSGOlounge
// @author Sick Pillow, LLC
// @namespace http://www.sickpillow.com
// @include http://csgolounge.com/*
// @match http://csgolounge.com/*
// @run-at document-end
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/17338/Remove%20all%20BO1%20games%20on%20CSGL.user.js
// @updateURL https://update.greasyfork.org/scripts/17338/Remove%20all%20BO1%20games%20on%20CSGL.meta.js
// ==/UserScript==

var gameFormat = document.getElementsByClassName('format');

function removeBO1s() {
	for (var i=gameFormat.length; --i>=0;) {
		var contents = gameFormat[i];
		var formatTxt = contents.textContent;
	
		if (formatTxt == "BO1") {
			for(count=0;count<5;count++){
				contents = contents.parentNode;
			}
			contents.parentNode.removeChild(contents);
		}
	}
}

removeBO1s();