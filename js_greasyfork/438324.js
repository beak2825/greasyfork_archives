// ==UserScript==
// @name        Arrange MalGraph achievements by level
// @namespace   Violentmonkey Scripts
// @match       https://anime.plus/*/achievements*
// @grant       none
// @version     1.0
// @author      funestia
// @description Arrange achievements on anime.plus by level
// @license GPLv2
// @downloadURL https://update.greasyfork.org/scripts/438324/Arrange%20MalGraph%20achievements%20by%20level.user.js
// @updateURL https://update.greasyfork.org/scripts/438324/Arrange%20MalGraph%20achievements%20by%20level.meta.js
// ==/UserScript==
$(document).ready(function() {
let body = document.getElementsByClassName("section-body")[0];
body.style.display = 'grid';
let entries = body.getElementsByClassName("achi-entry");
for (const entry of entries) {
	let level = entry.getElementsByClassName("level")[0].innerHTML.match(/(\d+)/);
	if (level) {
    if(level[0]<4)
		  entry.style.order = -level[0]*1000;
    
	} else {
    if (entry.getElementsByClassName("level")[0].innerHTML.match(/MAX|MIN|MAKSHIMUM|FULL|WASTED|SUPERSTAR/)) {
      entry.style.order = -4000;
    } else {
		  entry.style.order = 0;
    }
	}
  let widthtext = entry.getElementsByClassName("bar")[0].style.width;
  entry.style.order -= Math.floor(widthtext.substring(0,widthtext.length-1));
}

})