// ==UserScript==
// @name     Repubblica beautifier
// @namespace   http://www.webmonkey.com
// @description beautify repubblica.it
// @include     https://www.repubblica.it/*
// @include     https://*.repubblica.it
// @version     1
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/371051/Repubblica%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/371051/Repubblica%20beautifier.meta.js
// ==/UserScript==


function cleanup() {

  var to_remove = [];
	to_remove = to_remove.concat(Array.from(document.getElementsByClassName("first-page-right")));
  to_remove = to_remove.concat(Array.from(document.getElementsByClassName("first-page-right-bottom")));

	for(let el in to_remove)
    if (to_remove[el].style)
	  	to_remove[el].style.display = "none";

  
  var classes_to_remove = ["column-8", "block-8", "block-8-1", "inner-column-8"];
  for (let i in classes_to_remove) {
    let els = document.getElementsByClassName(classes_to_remove[i]);
  	for (let j in els)
      if (els[j] && els[j].classList)
      	els[j].classList.remove(classes_to_remove[i]);
  }
  
  var entries = document.getElementsByClassName("entry");
  for (let i in entries)
    if (entries[i] && entries[i].classList) {
      entries[i].classList.remove("sequence-8");
      entries[i].classList.remove("media-4");
      entries[i].classList.add("sequence-12");
      entries[i].classList.add("media-12");
      entries[i].classList.remove("entry");
    }
}

console.log("Beautifier started");
cleanup();

setInterval(cleanup, 1000);
