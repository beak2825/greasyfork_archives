// ==UserScript==
// @name     GirlGenius nav
// @description Allows navigation by keyboard through GirlGenius comics.
// @version  1
// @grant    none
// @include		http://www.girlgeniusonline.com/comic.php*
// @namespace https://greasyfork.org/users/542724
// @downloadURL https://update.greasyfork.org/scripts/402120/GirlGenius%20nav.user.js
// @updateURL https://update.greasyfork.org/scripts/402120/GirlGenius%20nav.meta.js
// ==/UserScript==

/*
 EDGE CASES:
 http://www.girlgeniusonline.com/comic.php?date=20030106
 http://www.girlgeniusonline.com/comic.php?date=20040209
 */

window.addEventListener('keypress', keypressHandler, true);
window.addEventListener('load', loadHandler, true);

function loadHandler() {
	console.log("Hello GirlGenius!");
  var comicbody  = document.getElementById("comicbody");
  var comicimg = null;
  var children = comicbody.children;
  
  for(i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.nodeName == 'A') {
     	comicimg=child.lastChild;
      break;
    }
  }
  if (comicimg) {
  	comicimg.scrollIntoView();
  }
}

function keypressHandler(event) {
	if (event.key == 'h') {
    document.getElementById("topprev").click();
  } else if (event.key == 'l') {
    document.getElementById("topnext").click();
  } else if (event.key == 'j') {
   	window.scrollBy(0,50);
  } else if (event.key == 'k') {
   	window.scrollBy(0,-50);
  }
}