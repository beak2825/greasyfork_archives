// ==UserScript==
// @name         Reddit Place - Mousewheel zoom
// @namespace    http://kmcgurty.com
// @version      1.2
// @description  Use mousewheel to zoom in and out
// @author       Kmc - admin@kmcdeals.com
// @match        https://www.reddit.com/place*
// @downloadURL https://update.greasyfork.org/scripts/28632/Reddit%20Place%20-%20Mousewheel%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/28632/Reddit%20Place%20-%20Mousewheel%20zoom.meta.js
// ==/UserScript==

var element = document.querySelector("#place-viewer");
var size;

document.addEventListener("wheel", function(event){
	size = +(element.style.cssText.match(/\(([^\(]+)\,/)[1]);

	if(event.wheelDelta > 0){
		size += 0.5;
    } else {
		if(size > 0.5) { size -= 0.5; }
    }

	element.style = "flex: 0 0 1000px; transform: scale("+ size +"," + size +");";
});