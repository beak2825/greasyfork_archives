// ==UserScript==
// @name         Camvault Mosaic Preview IMG Fix
// @namespace    https://github.com/cubedj/GM-Scripts
// @license      MIT
// @version      1.0.1
// @description  Switches the preview (mosaic) image for the correct one on the page for video download..
// @author       cubedj <djcube21@gmail.com>
// @match        https://www.camvault.xyz/download/*
// @match        https://camvault.to/download/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447495/Camvault%20Mosaic%20Preview%20IMG%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/447495/Camvault%20Mosaic%20Preview%20IMG%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var string1 = document.getElementById("streamVideo").innerHTML;
	var regExToFind = /poster=\".+\"\ autoplay=/;
	var searchresult = regExToFind.exec(string1);
	var link = searchresult.toString().replace('poster="', '').replace('st.jpg" autoplay=', 'm.jpg');
 	// console.log(link);
	var unlinked = document.querySelectorAll("body > div.container > div.content-container > div.content-body.container-fluid > div:nth-child(5) > div > div > a");
		for (var myListIndex = 0; myListIndex < unlinked.length; myListIndex++) {
			var myListItem = unlinked[myListIndex];
		}
 	// console.log(myListItem);
	myListItem.href=link;
 	// console.log('final', myListItem);
	var unlinked2 = document.querySelectorAll("body > div.container > div.content-container > div.content-body.container-fluid > div:nth-child(5) > div > div > a > img");
		for (var myListIndex2 = 0; myListIndex2 < unlinked2.length; myListIndex2++) {
			var myListItem2 = unlinked2[myListIndex2];
		}
 	// console.log(myListItem2);
	myListItem2.src=link;
 	// console.log('final', myListItem2);
 	// console.log('final', link);
})();