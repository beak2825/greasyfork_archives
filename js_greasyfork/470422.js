// ==UserScript==
// @name         Florr.io Better Map Script!
// @namespace    http://tampermonkey.net/
// @version      2.12
// @description  Press the Tabulator button to show!
// @author       Car Boi
// @match        https://florr.io
// @icon         https://cdn.discordapp.com/attachments/1127185090364059712/1127190407550357575/image.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470422/Florrio%20Better%20Map%20Script%21.user.js
// @updateURL https://update.greasyfork.org/scripts/470422/Florrio%20Better%20Map%20Script%21.meta.js
// ==/UserScript==

const styleSheet = `
#florrMap {
    display:none;
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 100vw;
    max-height: 100vh;
    transform: translate(-50%, -50%);
    opacity:1;
    pointer-events: none;
}`

const img = document.createElement("img");
img.src = "https://cdn.discordapp.com/attachments/1127185090364059712/1127190407550357575/image.png";
img.id = "florrMap";
document.body.appendChild(img);
let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

let mapOpen = false;
let opacity = 1;
window.addEventListener('load', function() {
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == '9' && mapOpen === false) {
   	mapOpen = true;
    document.getElementById("florrMap").style.display = "inline";
    } else if (evt.keyCode == '9' && mapOpen === true) {
    mapOpen = false;
    document.getElementById("florrMap").style.display = "none";
    }

    if (evt.keyCode == 189 && opacity > 0.2) {
    opacity -= 0.1;
    document.getElementById("florrMap").style.opacity = `${opacity}`;
    }
    if (evt.keyCode == 187) {
    opacity += 0.1;
    document.getElementById("florrMap").style.opacity = `${opacity}`;
    }
  };
});
