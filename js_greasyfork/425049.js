// ==UserScript==
// @name         Teleportation (kinda)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Teleport in bonk.io
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425049/Teleportation%20%28kinda%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425049/Teleportation%20%28kinda%29.meta.js
// ==/UserScript==

var teleportation = document.createElement("button");
teleportation.innerHTML = "Teleport";
teleportation.id = 'teleportation';
document.body.appendChild(teleportation);
teleportation.style.position = "fixed";
teleportation.style.top = 290;
teleportation.style.left = 10;

teleportation.onclick = function(){
document.getElementById('newbonklobby_editorbutton').click();
document.getElementById('mapeditor_close').click();
document.getElementById('mapeditor_midbox_testbutton').click();
};