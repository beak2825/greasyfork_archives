// ==UserScript==
// @name         Quickplay Server Mass Join
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Funny way to farm xp
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430077/Quickplay%20Server%20Mass%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/430077/Quickplay%20Server%20Mass%20Join.meta.js
// ==/UserScript==

var qpbutton = document.createElement("button");
qpbutton.innerHTML = "Start Quickplay";
document.body.appendChild(qpbutton);
qpbutton.id = 'qpbutton';
qpbutton.style.position = "fixed";
qpbutton.style.top = 330;
qpbutton.style.left = 10;


qpbutton.onclick = function(){
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
document.getElementById('quickPlayWindow_ClassicButton').click();
};