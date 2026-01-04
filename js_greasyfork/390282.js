// ==UserScript==
// @name         show-urlimg
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Eduardogudigno
// @include      https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390282/show-urlimg.user.js
// @updateURL https://update.greasyfork.org/scripts/390282/show-urlimg.meta.js
// ==/UserScript==

(function() {
    'use strict';

var a = document.getElementsByClassName('cml jsawesome');
var size_a = a.length;

for (var i = 0 ; i < size_a; i++) {
  //b[i].src
    var elemento = document.createElement("p");
    var urlAct = a[i].getElementsByTagName('img')[0].src;
    var contenido = document.createTextNode(urlAct);

    elemento.appendChild(contenido);

    elemento.setAttribute("align","center");

    var prin_no = document.getElementsByClassName("cml jsawesome")[i].getElementsByTagName("img")[0].parentNode,
        first = document.getElementsByClassName("cml jsawesome")[i].getElementsByTagName("img")[0];

    prin_no.insertBefore(elemento,first);
}
    // Your code here...


})();