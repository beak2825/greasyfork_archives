// ==UserScript==
// @name         Showing-links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       gudigno
// @include      https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390986/Showing-links.user.js
// @updateURL https://update.greasyfork.org/scripts/390986/Showing-links.meta.js
// ==/UserScript==

(function() {
    'use strict';

var a = document.getElementsByClassName('cml jsawesome');
var size_a = a.length;

for (var i = 0 ; i < size_a; i++) {
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