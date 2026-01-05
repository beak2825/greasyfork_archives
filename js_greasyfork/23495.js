// ==UserScript==
// @name         Miniature gif et transparent
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Affiche les gif et png transparent en miniature
// @author       Nektos
// @include       http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23495/Miniature%20gif%20et%20transparent.user.js
// @updateURL https://update.greasyfork.org/scripts/23495/Miniature%20gif%20et%20transparent.meta.js
// ==/UserScript==

    imagashack = document.getElementsByClassName('img-shack');
    for (var i = 0; i < imagashack.length; i++) {
        img = document.getElementsByClassName('img-shack')[i];
        srcc = img.src;
        alt = img.alt;
        if (img.alt.endsWith("gif")) {
            console.log("il y a un gif ici !");
            srcc = srcc.replace("minis", "fichiers").replace("png", "gif");
            document.getElementsByClassName('img-shack')[i].src = srcc;
        }
        else if (img.alt.endsWith("png")) {
            srcc = srcc.replace("minis", "fichiers");
            document.getElementsByClassName('img-shack')[i].src = srcc;
        }
}

