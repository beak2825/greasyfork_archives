// ==UserScript==
// @name         BruhProx SL (2nd Server)
// @name:es      Inyección silenciosa BruhProx (Servicio 2)
// @description:es ¡Silent Injector que inserta bruhprox (versión glitch) en una página falsa de Google 404!
// @namespace    https://z1g-project.johnglynn2.repl.co/
// @version      3.1.1
// @description  Silent Injector that inserts bruhprox beta [also known as server 2] (glitch version) onto a fake google 404 page!
// @author       z1g Project
// @match        https://www.google.com/sl-beta
// @match        https://google.com/sl-beta
// @icon         https://z1g-project.johnglynn2.repl.co/assets/img/logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463838/BruhProx%20SL%20%282nd%20Server%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463838/BruhProx%20SL%20%282nd%20Server%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    alert('Injected Sucessfully!')
    javascript:(function(){var a=document.getElementById("rusic-modal")||document.createElement("iframe");a.setAttribute("allow","fullscreen");a.src="https://bruhprox-beta.glitch.me/";a.id="rusic-modal";a.style="position:fixed;width:100vw;height:100vh;top:0px;left:0px;right:0px;bottom:0px;z-index:2147483647;background-color:black;border:none;";document.body.appendChild(a);}());
})();