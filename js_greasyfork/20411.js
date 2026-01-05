// ==UserScript==
// @name        ProNexus
// @namespace   Minienzoo
// @description Quitá la sección de noticias y usá toda la página para el nexus, tanto en Twinoid como en Muxxu 
// @include     https://twinoid.com/*
// @include     http://twinoid.com/*
// @include     https://muxxu.com/*
// @include     http://muxxu.com/*
// @exclude     https://twinoid.com/user/*
// @exclude     http://twinoid.com/user/*
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20411/ProNexus.user.js
// @updateURL https://update.greasyfork.org/scripts/20411/ProNexus.meta.js
// ==/UserScript==

//Nota del programador: 
//
//Esta update 2.0 del 04/07/2019 se da debido a que MT ha retirado a jQuery de Twinoid. 
//Se pretende solucionar este problema para seguir ofreciendo la mejor experiencia en el nexus.  
//
window.addEventListener("load", function(){
    document.querySelector(".newsColumn").style = "display: none";
    document.querySelector(".leftColumn").style = 'width: 980px; border: 0px; box-shadow: 0px 0px 2px -1px #000';
    document.querySelector(".title").style = "margin: 15px 0px 15px";
    document.querySelector(".sub").style = "display: none";
    document.querySelector("#tid_0").style = "border-top: 0px; margin: 0px 0px 0px; padding-top: 0px";

    // Para Muxxu
    document.querySelector(".right").style = "display: none";
    
});