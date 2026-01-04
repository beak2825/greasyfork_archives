// ==UserScript==
// @name         Bonk Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Allows you to put bonk.io into fullscreen mode!
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426606/Bonk%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/426606/Bonk%20Fullscreen.meta.js
// ==/UserScript==


let expandbutton = document.createElement("button");
expandbutton.innerHTML = "Fullscreen";
document.body.appendChild(expandbutton);
expandbutton.id = 'expandbutton';
expandbutton.style.position = "fixed";
expandbutton.style.top = 370;
expandbutton.style.left = 10;


expandbutton.onclick = function() {

let EXPAND = document.getElementById("bonkiocontainer");


EXPAND.style.height = "100%";
EXPAND.style.width = ((EXPAND.clientHeight) * 1.46);


};


let ad3 = document.getElementById("bonk_d_1");
ad3.remove();

let ad4 = document.getElementById("bonk_d_2");
ad4.remove();

document.getElementById("adboxverticalleftCurse").onclick = function() {
let ad1 = document.getElementById("adboxverticalleftCurse");
ad1.remove();
}

