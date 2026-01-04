// ==UserScript==
// @name         Markdown for tivach
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add markdown for tivach
// @author       notsyncing12309
// @match        https://tv.2ch.hk/r/random
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453968/Markdown%20for%20tivach.user.js
// @updateURL https://update.greasyfork.org/scripts/453968/Markdown%20for%20tivach.meta.js
// ==/UserScript==

const pane = document.querySelector('#leftcontrols');

let btnMarq = document.createElement("button");
btnMarq.innerHTML = "marquee";
btnMarq.className = "btn btn-sm btn-default";
btnMarq.addEventListener ("click", function() {
    document.getElementById("chatline").value += '[marquee]  [/marquee]';
});

let btnRoll = document.createElement("button");
btnRoll.innerHTML = "roll";
btnRoll.className = "btn btn-sm btn-default";
btnRoll.addEventListener ("click", function() {
    document.getElementById("chatline").value += '[roll]  [/roll]';
});

let btnGs = document.createElement("button");
btnGs.innerHTML = "mirrored";
btnGs.className = "btn btn-sm btn-default";
btnGs.addEventListener ("click", function() {
    document.getElementById("chatline").value += '[gs]  [/gs]';
});

let btnVs = document.createElement("button");
btnVs.innerHTML = "inverted";
btnVs.className = "btn btn-sm btn-default";
btnVs.addEventListener ("click", function() {
    document.getElementById("chatline").value += '[vs]  [/vs]';
});

let btnMe = document.createElement("button");
btnMe.innerHTML = "/me";
btnMe.className = "btn btn-sm btn-default";
btnMe.addEventListener ("click", function() {
    document.getElementById("chatline").value = '/me ';
});

pane.appendChild(btnMarq)
pane.appendChild(btnRoll)
pane.appendChild(btnGs)
pane.appendChild(btnVs)
pane.appendChild(btnMe)