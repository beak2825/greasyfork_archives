// ==UserScript==
// @name         BruhProx SL
// @name:es      Inyección silenciosa BruhProx
// @description:es ¡Silent Injector que inserta bruhprox (versión cloudflare pages) en una página falsa de Google 404!
// @namespace    https://z1g-project.johnglynn2.repl.co/
// @version      3.5.0
// @description  Silent Injector that inserts bruhprox (cloudflare pages version) onto a fake google 404 page!
// @author       z1g Project
// @match        https://www.google.com/sl
// @match        https://google.com/sl
// @icon         https://z1g-project.johnglynn2.repl.co/assets/logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461394/BruhProx%20SL.user.js
// @updateURL https://update.greasyfork.org/scripts/461394/BruhProx%20SL.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    alert('Injected Sucessfully!')
    javascript:(function(){var a=document.getElementById("rusic-modal")||document.createElement("iframe");a.setAttribute("allow","fullscreen");a.src="https://bruhprox.pages.dev/";a.id="rusic-modal";a.style="position:fixed;width:100vw;height:100vh;top:0px;left:0px;right:0px;bottom:0px;z-index:2147483647;background-color:black;border:none;";document.body.appendChild(a);}());
})();