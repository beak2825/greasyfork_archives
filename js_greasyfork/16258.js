// ==UserScript==
// @name         EchoTV - Ablak kitöltő
// @version      0.6
// @description  Ablak kitöltő, az EchoTV video tárához
// @author       vacsati
// @match        http://www.echotv.hu/video*
// @run-at        document-start
// @grant         none
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/16258/EchoTV%20-%20Ablak%20kit%C3%B6lt%C5%91.user.js
// @updateURL https://update.greasyfork.org/scripts/16258/EchoTV%20-%20Ablak%20kit%C3%B6lt%C5%91.meta.js
// ==/UserScript==
//console.log("Vigyáz!");
document.addEventListener ("DOMContentLoaded", indulasra_kesz);
window.addEventListener ("load", indulas);

function indulasra_kesz () {
    //console.log ("Kész!");
    //console.log("i: "+document.getElementsByClassName ("projekktor")[0].currentSrc);
    var cel = document.getElementsByClassName ("videocontainer"); cel=cel[0];
    var jolink=cel.childNodes; jolink=jolink[0].src;
    if(jolink=== undefined){ //nem YouTube-os video
        jolink = document.getElementsByClassName ("projekktor")[0].currentSrc;
    }
    var cucc = document.createElement("div");
    cucc.style.cssText = 'padding: 1ex;';
    cucc.innerHTML = "<p><a href='"+jolink+"'>Ablak kitöltése</a></p>"; //hivatkozás
    cel.insertBefore (cucc, cel.firstChild);
}

function indulas () {
    //console.log ("Rajt!");
}