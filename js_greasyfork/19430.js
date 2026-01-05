// ==UserScript==
// @name        SuMo Top Menu Hover Remover
// @description On the Mozilla Support site, change the top menus to show on click rather than mouseover, subdue the background colors
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2016 Jefferson Scher (5/5/2016)
// @license     BSD 3-clause
// @include     https://support.mozilla.org/*
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19430/SuMo%20Top%20Menu%20Hover%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/19430/SuMo%20Top%20Menu%20Hover%20Remover.meta.js
// ==/UserScript==

// Modify CSS hover menus to open and close with a click
var menupads = document.querySelectorAll('#aux-nav > ul > li');
for (var i=0; i<menupads.length; i++){
  var droplist = menupads[i].querySelector('ul');
  if (droplist) { // remove href and attach toggle function
    var link = menupads[i].querySelector("a");
    link.href = "javascript:void(0);";
    link.addEventListener("click", updateMenus, false);
    link.title = "Open menu";
  }
}

// Style changes
/* Override this hover rule that shows the drop menu
  #aux-nav > ul > li:hover > ul {
      display: block;
  }
*/
var r = "#aux-nav > ul > li:hover > ul {display:none;} ";

/* Make the background colors less jarring
#aux-nav > ul > li:hover {
    background: #fff;
}
#aux-nav > ul > li > a:hover {
	background-color: #fff;

#aux-nav > ul > li > ul {
	background: #fff;
}
*/
r += "#aux-nav > ul > li:hover, #aux-nav > ul > li > a.menuopen, #aux-nav > ul > li > ul {background-color:#d2e9fc !important;} #aux-nav > ul > li > a:hover {background-color:transparent !important;}";

var s = document.createElement("style");
s.type = "text/css";
s.appendChild(document.createTextNode(r));
document.body.appendChild(s);

function updateMenus(evt){
  // Event is on a link element
  var ael = evt.target;
  var opened = toggleSiblingList(ael);
  if (opened){ // close other open lists, if any
    var nowopen = document.getElementsByClassName('menuopen');
    if (nowopen.length > 1) {
      for (var i=0; i<nowopen.length; i++) {
        if (nowopen[i] != ael) toggleSiblingList(nowopen[i]);
      }
    }
  }
  return false;
}

function toggleSiblingList(ael){
  var siblist = ael.nextElementSibling;
  if (siblist){
    if (siblist.style.display != "block"){
      siblist.style.display = "block";
      if (ael.className) ael.className += " menuopen";
      else ael.className = " menuopen";
      ael.title = "Close menu";
      return true;
    } else {
      siblist.style.display = "none";
      if (ael.className) ael.className = ael.className.replace(" menuopen", "");
      ael.title = "Open menu";
      return false;
    }
  } else {
    return false;
  }
}
