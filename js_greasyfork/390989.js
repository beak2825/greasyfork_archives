// ==UserScript==
// @name         Link funcionando
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Nec
// @include      https://render.figure-eight.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390989/Link%20funcionando.user.js
// @updateURL https://update.greasyfork.org/scripts/390989/Link%20funcionando.meta.js
// ==/UserScript==

(function() {
    'use strict';
var a = document.getElementsByClassName('cml jsawesome');
for (var i = 0 ; i < a.length; i++) {
  //b[i].src
var elemento = document.createElement("p");
var urlAct = a[i].getElementsByTagName('a')[0].href;
var contenido = document.createTextNode(urlAct);

elemento.appendChild(contenido);

elemento.setAttribute("align","center");

//var prin_no = document.getElementsByClassName("cml jsawesome")[0].parentNode,
  //first = document.getElementsByClassName("cml jsawesome")[0];

  var prin_no = document.getElementsByClassName("cml jsawesome")[i].getElementsByTagName("a")[0].parentNode,
    first = document.getElementsByClassName("cml jsawesome")[i].getElementsByTagName("a")[0];

  prin_no.insertBefore(elemento,first);
//document.getElementsByClassName("cml jsawesome")[i].appendChild(elemento);
}
    // Your code here...
})();