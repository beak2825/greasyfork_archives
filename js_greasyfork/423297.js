// ==UserScript==
// @name         More Modes
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  #justiceforVTOL
// @author       MYTH_doglover and NTOP
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423297/More%20Modes.user.js
// @updateURL https://update.greasyfork.org/scripts/423297/More%20Modes.meta.js
// ==/UserScript==



var newmodes = document.createElement("button");
newmodes.innerHTML = "Add Modes";
document.body.appendChild(newmodes);
newmodes.id = 'newmodes';
newmodes.style.position = "fixed";
newmodes.style.top = 60;
newmodes.style.left = 10;


newmodes.onclick = function() {
  document.getElementById('mapeditor_modeselect').innerHTML += '<option value="v">VTOL</option><option value="bs">Simple</option><option value="f">Football</option>';
alert('You can now save maps for Football, Simple, and VTOL mode!');
}

document.getElementById("adboxverticalleftCurse").onclick = function() {
let ad1 = document.getElementById("adboxverticalleftCurse");
ad1.remove();
}


let ad3 = document.getElementById("bonk_d_1");
ad3.remove();

let ad4 = document.getElementById("bonk_d_2");
ad4.remove();




