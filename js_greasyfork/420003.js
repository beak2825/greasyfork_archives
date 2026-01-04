// ==UserScript==
// @name         Enfocar scribd
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Enfocar scribd, quitar difuminado y cartel de promo.
// @author       ArtEze
// @match        *://*.scribd.com/doc*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420003/Enfocar%20scribd.user.js
// @updateURL https://update.greasyfork.org/scripts/420003/Enfocar%20scribd.meta.js
// ==/UserScript==

window.enfocar_scribd = window.setInterval(function(){
    try{
        var i = 0
        Array.from(document.querySelectorAll(".promo")).map(function(x){x.remove();++i;})
        Array.from(document.querySelectorAll(".text_layer")).map(function(x){x.style["text-shadow"]="0px 0px 0px black";++i})
        if(i>0){
            console.log("Removido")
        }
    }catch(e){
        console.log("No se pudo desenfocar",e)
    }
},10000)
