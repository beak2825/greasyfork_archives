// ==UserScript==
// @name         Get Linkedin Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410005/Get%20Linkedin%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/410005/Get%20Linkedin%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = document.getElementsByClassName("org-top-card-primary-actions__inner")[0].getElementsByTagName("a")[0].href;
    var elemento = document.createElement("p");
    var contenido = document.createTextNode(link);
    elemento.appendChild(contenido);
    alert(link);
    //var ref = document.getElementsByTagName("body")[0].parentNode;
    var ref = document.getElementsByClassName("org-top-card-primary-actions__inner")[0].getElementsByTagName("a")[0].parentNode;
    ref.appendChild(elemento);
    console.log("Hello");
    console.log(link);
    // Your code here...
})();