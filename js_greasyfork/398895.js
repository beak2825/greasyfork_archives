// ==UserScript==
// @name         BtnCpy
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       andres
// @match        *render.figure-eight.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398895/BtnCpy.user.js
// @updateURL https://update.greasyfork.org/scripts/398895/BtnCpy.meta.js
// ==/UserScript==

(function() {
    for(var i=0; i<5; i++ ){
        var a=document.getElementsByClassName('html-element-wrapper')
        var b=a[i].innerText.search('search:')
        var c=a[i].innerText.substr(b+8)
        //document.write(c);

        var element=document.createElement("p");
        var contenido = document.createTextNode(c);
        element.appendChild(contenido);
        element.setAttribute("align","center");


         var prin_no = document.getElementsByClassName('html-element-wrapper')
                [i].getElementsByTagName("a")[0].parentNode,
                first = document.getElementsByClassName("html-element-wrapper")
                [i].getElementsByTagName("a")[0];
                prin_no.insertBefore(element,first);
    }
})();