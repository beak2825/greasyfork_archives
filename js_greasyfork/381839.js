// ==UserScript==
// @name        DragonCave - Anti Anti Adblock
// @author      warireku
// @description Hide 'anti-adblock' images on several pages on dragcave.net.
// @include     https://dragcave.net/*
// @license     CC0 1.0 Universal (No Rights Reserved)
// @version     0.2
// @grant       none
// @namespace https://greasyfork.org/users/237709
// @downloadURL https://update.greasyfork.org/scripts/381839/DragonCave%20-%20Anti%20Anti%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/381839/DragonCave%20-%20Anti%20Anti%20Adblock.meta.js
// ==/UserScript==

var divs = document.getElementsByTagName("div");
var found_ads = false;
var i = 0;

while(i<divs.length && !found_ads){
  var children = divs[i].childNodes;
	for(var j=0;j<children.length;j++){
  	if(children[j].className == "adsbygoogle"){
    	found_ads = true;
    }
  }
  if(found_ads){
    console.log(divs[i].className);
    divs[i].style.display = "none";
  }
  i++;
}