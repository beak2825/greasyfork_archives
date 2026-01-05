// ==UserScript==
// @name        Cold Network Questions
// @namespace   kunaifirestuff
// @description Hides the Hot Network Questions sidebar on Stack Exchange and Stack Overflow; it's just so distracting!
// @include     *
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10540/Cold%20Network%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/10540/Cold%20Network%20Questions.meta.js
// ==/UserScript==

// If the document contains an element with the id "hot-network-questions",
// and this element has a child which has a child which is a link
// the url of which contains "stackoverflow.com", then we are sure this
// is a stackexchange site.
// Is it too redundant? Probably.

var hot = document.getElementById("hot-network-questions");
var isItStackexchange = false;

Loopy:
for(var i = 0; i < hot.children.length; i++){
  if(hot.children[i].children.length > 0 && hot.children[i].children[0].tagName == "A"){
    if(hot.children[i].children[0].href.indexOf("stackexchange.com") > -1){
      isItStackexchange = true;
      break Loopy;
    }
  }
}

if(isItStackexchange){
  hot.outerHTML = "";
}