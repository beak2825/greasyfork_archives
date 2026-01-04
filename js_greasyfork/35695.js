// ==UserScript==
// @name        TuManga todas las imagenes
// @version     1
// @namespace   zack0zack
// @description TuMangaOnline.com muestra todas las imagenes del capitulo en cascada
// @icon	
// @include     http://www.tumangaonline.com/visor/*/*/*
// @include     http://www.tumangaonline.com/*/lector/*/*/*
// @include     http://www.tumangaonline.com/lector/*/*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35695/TuManga%20todas%20las%20imagenes.user.js
// @updateURL https://update.greasyfork.org/scripts/35695/TuManga%20todas%20las%20imagenes.meta.js
// ==/UserScript==



var i, v = document.getElementsByTagName('I');
for(i=0; i < v.length ; i++ ) {
  if (v[i].className == 'fa fa-fw icon-paper-stack'){
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v[i].dispatchEvent(evt);
  }
}


window.addEventListener("load",function() {


var i, v = document.getElementsByTagName('I');
for(i=0; i < v.length ; i++ ) {
  if (v[i].className == 'fa fa-fw icon-paper-stack'){
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v[i].dispatchEvent(evt);
  }
}

window.setTimeout(function(){
 var i, v = document.getElementsByTagName('I');
 for(i=0; i < v.length ; i++ ) {
   if (v[i].className == 'fa fa-fw icon-paper-stack'){
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v[i].dispatchEvent(evt);
   }
 }
}, 2500);

window.setTimeout(function(){
 var i, v = document.getElementsByTagName('I');
 for(i=0; i < v.length ; i++ ) {
   if (v[i].className == 'fa fa-fw icon-paper-stack'){
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v[i].dispatchEvent(evt);
   }
 }
}, 5000);


//  var v = document.getElementById('cascada2');
//  if (v) {
//	var evt = document.createEvent("MouseEvents");
//	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
//	v.dispatchEvent(evt);
//  }

},true)
