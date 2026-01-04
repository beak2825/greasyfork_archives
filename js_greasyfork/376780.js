// ==UserScript==
// @name         Twitch video save
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wAs
// @match        https://gist.github.com/danharper/8364399
// @include      https://clips.twitch.tv/*
// @include      https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376780/Twitch%20video%20save.user.js
// @updateURL https://update.greasyfork.org/scripts/376780/Twitch%20video%20save.meta.js
// ==/UserScript==

window.onload = swapClass;

function swapClass()
{
var x = document.getElementsByClassName("player-overlay");
console.log(x);

var g;
for (g = 0; g < x.length; g++) {
    x[g].className = "asdasd";
}
x[0].className = "asdasd";

};