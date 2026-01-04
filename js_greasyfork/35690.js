// ==UserScript==
// @name        Traslate Google
// @version     1
// @namespace   zack0zack
// @description Achica la barra de Traduccion de Google
// @include     https://translate.google.com/translate?depth=*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35690/Traslate%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/35690/Traslate%20Google.meta.js
// ==/UserScript==


//click elemento
  var v = document.getElementById('clp-btn');
  if (v) {
v.focus();
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v.dispatchEvent(evt);
  }
v.focus();


window.addEventListener("load",function() {
//click elemento
  var v = document.getElementById('clp-btn');
  if (v) {
v.focus();
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	v.dispatchEvent(evt);
  }
},true)
