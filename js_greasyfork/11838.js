// ==UserScript==
// @name pr0 SpacebarMod
// @namespace 
// @author Seglormeister (extracted by Dato)
// @description Uploads haben max. Höhe und weden mit der Leertaste auf orig. Größe gezommt (old pr0 style)
// @include *pr0gramm.com/*
// @version 1.3
// @grant none
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/11838/pr0%20SpacebarMod.user.js
// @updateURL https://update.greasyfork.org/scripts/11838/pr0%20SpacebarMod.meta.js
// ==/UserScript==

(function() {
/****/// CSS
var css = 
'.item-image{max-height:460px;}  ';
if (typeof GM_addStyle != "undefined") {
GM_addStyle(css);
 }  
 else {
var node = document.createElement("style");
node.appendChild(document.createTextNode(css));
var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
heads[0].appendChild(node);
 } 
}


  // Space Vergrößerung
document.addEventListener("keydown", keydown, false);
var spacepressed = false;
function keydown(event) {
if (event.keyCode == '32') {

// falls textarea aktiv
var el = document.activeElement;
if (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' || el.tagName.toLowerCase() == 'textarea')) {
return;
}

  // Bild mit Space vergrößern
if ($('.item-image').length != 0) {
event.preventDefault();
event.stopPropagation();
if (!spacepressed && $("div.item-container").length) {
$(".item-image").css( 'max-height', '100%' );
$(".item-image").css( 'cursor', 'move' );
spacepressed = false;
}else{
$(".item-image").css( 'max-height', '460px' );
$(".item-image").css( 'cursor', 'pointer' );
spacepressed = false;
   }
  }
 }
}

})();

//Danke Seglor !