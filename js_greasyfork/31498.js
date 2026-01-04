// ==UserScript==
// @name         Unblock video | forum-NL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Desbloqueia vídeos do youtube no fórum www.brasil-nl.com.br/forum
// @author       Douglas_Ballack
// @match        https://www.brasil-nl.com.br/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31498/Unblock%20video%20%7C%20forum-NL.user.js
// @updateURL https://update.greasyfork.org/scripts/31498/Unblock%20video%20%7C%20forum-NL.meta.js
// ==/UserScript==

var links = [''], newyt, oldyt, p, i, txt, a, v = document.getElementsByClassName("EmbeddedVideo");
for (i = v.length; i >= 0; i--) {
    a = v[i];
    if(a === undefined) {
        continue;
    } else {
        txt = a.getAttribute("src").replace("http:", "https:");
        links[i] = txt;
    }
}
for (var i = 0; i < links.length; i++) {
    newyt = document.createElement("iframe");
    newyt.setAttribute("src", links[i]);
    newyt.setAttribute("width", "640");
    newyt.setAttribute("height", "390");
    newyt.setAttribute("frameBorder", "0");
    newyt.setAttribute("allowFullscreen", "true");

    oldyt = document.getElementById("ytplayer");
    p = oldyt.parentNode;
    p.appendChild(newyt);
    p.removeChild(oldyt);
}