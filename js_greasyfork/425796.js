// ==UserScript==
// @name         DelugeRPG Auto-Mover
// @match        https://www.delugerpg.com/map/*
// @version      1.0
// @description  to use: inspect element, open console, and type: findPoke("CaseSensitivePokeName");
// @author       redbrain
// @icon         https://www.google.com/s2/favicons?domain=delugerpg.com
// @grant        none
// @namespace https://greasyfork.org/users/767360
// @downloadURL https://update.greasyfork.org/scripts/425796/DelugeRPG%20Auto-Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/425796/DelugeRPG%20Auto-Mover.meta.js
// ==/UserScript==

window.findPoke=async a=>{for(let b=["north","east","south","west"],c=["n","e","s","w"],i=0;;){if(Move(b[i%4],c[i%4]),await new Promise(a=>setTimeout(a,1500)),document.querySelector("#dexy")&&-1!==document.querySelector("#dexy")?.innerText.indexOf(a)){alert(a+" found!");break}i++}};