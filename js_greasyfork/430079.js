// ==UserScript==
// @name         Earthquake
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Earthquake simulator for bonk.io
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @icon         https://static.dw.com/image/52148088_101.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430079/Earthquake.user.js
// @updateURL https://update.greasyfork.org/scripts/430079/Earthquake.meta.js
// ==/UserScript==

let quakebutton = document.createElement("button");
quakebutton.innerHTML = "Earthquake";
document.body.appendChild(quakebutton);
quakebutton.id = 'quakebutton';
quakebutton.style.position = "fixed";
quakebutton.style.top = 390;
quakebutton.style.left = 10;


quakebutton.onclick = function() {
var shakethis = document.getElementsByTagName("html")[0];
shakethis.setAttribute("class", "shake");
};