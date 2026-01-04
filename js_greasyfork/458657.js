// ==UserScript==
// @name         Florr.io Map
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press ESC to display map for easier navigation.
// @author       You
// @match        https://florr.io
// @icon         https://static.wikia.nocookie.net/official-florrio/images/a/a1/Yggdrasil_%28Mythic%29.png/revision/latest?cb=20221107121812
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458657/Florrio%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/458657/Florrio%20Map.meta.js
// ==/UserScript==

const styleSheet = `
#florrMap {
    display:none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
   	border:7px solid #ffe52c;
    border-radius:40px;
    opacity:1;
    pointer-events: none;
}`

const img = document.createElement("img");
img.src = "https://media.discordapp.net/attachments/668939882416308274/1068574154913230888/Map_6_-_Jan_24.png";
img.id = "florrMap";
img.style.width = "890px";
img.style.height = "890px";

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
    if (evt.keyCode == 27 && mapOpen === false) {
   	mapOpen = true;
    document.getElementById("florrMap").style.display = "inline";
    } else if (evt.keyCode == 27 && mapOpen === true) {
    mapOpen = false;
    document.getElementById("florrMap").style.display = "none";
    }

    if (evt.keyCode == 189 && opacity > 0.2) {
    opacity -= 0.1;
    document.getElementById("florrMap").style.opacity = `${opacity}`;
    }
    if (evt.keyCode == 187 && opacity < 1) {
    opacity += 0.1;
    document.getElementById("florrMap").style.opacity = `${opacity}`;
    }
  };
});
