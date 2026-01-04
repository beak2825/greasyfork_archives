// ==UserScript==
// @name         Folha de S.Paulo Livre
// @namespace    https://greasyfork.org/users/715485
// @version      0.1
// @description  Informações devem ser livre!
// @author       luiz-lp
// @match        http*://folha.uol.com.br/*
// @match        http*://*.folha.uol.com.br/*
// @icon         https://f.i.uol.com.br/hunting/folha/1/common/icons/apple-touch-icon.png
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419776/Folha%20de%20SPaulo%20Livre.user.js
// @updateURL https://update.greasyfork.org/scripts/419776/Folha%20de%20SPaulo%20Livre.meta.js
// ==/UserScript==

window.setInterval(function(){
    if(document.querySelector("#paywall-content") != null){
        document.querySelector("#paywall-content").setAttribute("style", "overflow: scroll;");
    }
    if(document.querySelector("#paywall-fill") != null){
        document.querySelector("#paywall-fill").remove();
    }
    if(document.querySelector("#paywall-screen") != null){
        document.querySelector("#paywall-screen").remove();
    }
    if(document.querySelector("div.c-top-signup.c-top-signup--azul.c-top-signup--accordion.c-top-signup--fix.c-accordion") != null){
       document.querySelector("div.c-top-signup.c-top-signup--azul.c-top-signup--accordion.c-top-signup--fix.c-accordion").remove();
    }
}, 50);