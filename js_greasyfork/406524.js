// ==UserScript==
// @name        Sniper pixelcanvas !
// @namespace   ?
// @description Mets un viseur de snipeur sur le pointeur et fais le bruit d'un sniper lorsque l'on clique.
// @include     https://pixelplanet.fun/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/406524/Sniper%20pixelcanvas%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/406524/Sniper%20pixelcanvas%20%21.meta.js
// ==/UserScript==


var canvas = document.getElementsByClassName("viewport")[0];
canvas.style.cursor = "crosshair";

var audio = document.createElement("audio");
audio.src = "http://www.universal-soundbank.com/sounds/12019.mp3";
audio.id = "tirAudio";
document.getElementsByClassName("viewport")[0].appendChild(audio);

canvas.addEventListener('click', event => {
  document.getElementById('tirAudio').play();
  canvas.style.cursor = "crosshair";
});