// ==UserScript==
// @name        Expand All Images
// @namespace   zombiearmy.expandimage
// @description Expand all images in a 4chan thread
// @include     https://boards.4chan.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21795/Expand%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/21795/Expand%20All%20Images.meta.js
// ==/UserScript==

var expanded = false;

//add expand buttons for desktop
var navlink = document.getElementsByClassName("navLinks desktop");
for(var i = 0; i < navlink.length; i++) {
	navlink[i].innerHTML += " [<a href='javascript:toggleImages()'>Toggle Images</a>] ";
}

//add expand buttons for mobile
navlink = document.getElementsByClassName("navLinks mobile");
for(var i = 0; i < navlink.length; i++) {
	navlink[i].innerHTML += '<span class="mobileib button"><a href="javascript:toggleImages()">Expand Images</a></span>';
}

window.toggleImages = function() {
	var thumbs = document.getElementsByClassName("fileThumb");
	if(!expanded) {
		for(var i = 0; i < thumbs.length; i++) {
			ImageExpansion.expand(thumbs[i].getElementsByTagName('img')[0]);
		}
		expanded = true;
	}else{
		for(var i = 0; i < thumbs.length; i++) {
			ImageExpansion.contract(thumbs[i].getElementsByTagName('img')[1]);
		}
		expanded = false;
	}
}