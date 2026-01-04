// ==UserScript==
// @name pipirka
// @namespace pipirka_suncova
// @version 0.42
// @match http://www.twitch.tv/*
// @include http://*twitch.tv/simolog*
// @exclude 
// @description example script to insert div with h1 on every page twitch.tv
// @downloadURL https://update.greasyfork.org/scripts/37002/pipirka.user.js
// @updateURL https://update.greasyfork.org/scripts/37002/pipirka.meta.js
// ==/UserScript==


var chlens = 0
setInterval( function() {
if(document.querySelectorAll(".chat-line__message")[chlens].innerHTML == document.querySelectorAll(".chat-line__message")[chlens].innerHTML.replace("член", "пипирка")) {
if(document.querySelectorAll(".chat-line__message")[chlens+1] === undefined) {
} else {
chlens = chlens + 1
}
} else {
document.querySelectorAll(".chat-line__message")[chlens].innerHTML = document.querySelectorAll(".chat-line__message")[chlens].innerHTML.replace("член", "пипирка");
}
}, 500)