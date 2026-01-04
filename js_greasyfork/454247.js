// ==UserScript==
// @name         Arbol ABC
// @namespace    ArbolABCFullScreen
// @version      0.1
// @description  Clean 💩 over the world!
// @author       Toni
// @match        https://arbolabc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arbolabc.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454247/Arbol%20ABC.user.js
// @updateURL https://update.greasyfork.org/scripts/454247/Arbol%20ABC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function limpiaCaca(){
        var gameDiv = document.querySelector('div#new-game-wrapper')
        gameDiv.style.position= "fixed";
        gameDiv.style.inset= "0";
        gameDiv.style.zIndex= 99999;

    }

    var intv = setInterval(function() {
             var gameDiv = document.querySelector('div#new-game-wrapper')

             if(gameDiv){

                 if(!document.querySelector('div#limpiacaca')){
                     console.log("Hay Juego");
                     var b = document.createElement('div');
                     b.id="limpiacaca";
                     b.innerHTML = "¡Limpia 💩!"
                     b.onclick = limpiaCaca

                     document.body.appendChild(b);
                     b.style.position= "fixed";
                     b.style.top= "24px";
                     b.style.textAlign= "center";
                     b.style.right= "24px";
                     b.style.width= "240px";
                     b.style.boxShadow= "0px 10px 14px -7px #3e7327";
                     b.style.background= "linear-gradient(to bottom, #77b55a 5%, #72b352 100%)";
                     b.style.backgroundColor= "#77b55a";
                     b.style.borderRadius= "9px";
                     b.style.border= "1px solid #4b8f29";
                     b.style.display= "inline-block";
                     b.style.cursor= "pointer";
                     b.style.color= "#ffffff";
                     b.style.fontFamily= "Verdana";
                     b.style.fontSize= "20px";
                     b.style.fontWeight= "bold";
                     b.style.padding= "11px 23px";
                     b.style.textDecoration= "none";
                     b.style.textShadow= "0px 1px 5px #5b8a3c";
                     b.style.zIndex= 500;
                 }


             }

        }, 500);


})();