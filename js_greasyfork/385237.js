// ==UserScript==
// @name         vercanalestv1.com - cargar reproductor
// @namespace    Violentmonkey Scripts
// @description  entra la contraseña y procede al reproductor (funciona solo con canales que provienen de vergol.com)
// @author       Alejandro Minder
// @match        https://vergol.com/*
// @grant        none
// @version 0.0.1.20190610094336
// @downloadURL https://update.greasyfork.org/scripts/385237/vercanalestv1com%20-%20cargar%20reproductor.user.js
// @updateURL https://update.greasyfork.org/scripts/385237/vercanalestv1com%20-%20cargar%20reproductor.meta.js
// ==/UserScript==

var oldOnload = window.onload;

window.onload = function () {

    if (typeof oldOnload == "function") {

       oldOnload();

    }
    
    document.querySelector("[type*='password']").value = "12345";
    document.querySelector("[type*='submit']").click();
  
}