// ==UserScript==
// @name        Retour au top du Blabla sur jeuxvideo.com
// @namespace   Violentmonkey Scripts
// @match       https://www.jeuxvideo.com/forums.htm
// @grant       none
// @version     1.0
// @author      496852005a
// @description Suite au récent changement sur de DA de JVC il a était décidé que le *Blabla* serait mis en fin de page, se script permet de remonter la zone comme dans le temps.
// @downloadURL https://update.greasyfork.org/scripts/428364/Retour%20au%20top%20du%20Blabla%20sur%20jeuxvideocom.user.js
// @updateURL https://update.greasyfork.org/scripts/428364/Retour%20au%20top%20du%20Blabla%20sur%20jeuxvideocom.meta.js
// ==/UserScript==

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(main);

function main(){
     MoveBlabla();
}

function MoveBlabla()
{
    var divs = document.getElementById("forum-main-col").getElementsByTagName("div");
    var blabladiv = divs[112];
    var maindiv = divs[2];
    maindiv.appendChild(blabladiv);
}