// ==UserScript==
// @name        gi hun jumpscare
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      static
// @description 10/19/2021, 12:57:01 AM
// @downloadURL https://update.greasyfork.org/scripts/434151/gi%20hun%20jumpscare.user.js
// @updateURL https://update.greasyfork.org/scripts/434151/gi%20hun%20jumpscare.meta.js
// ==/UserScript==
let newStyle = document.createElement("style");
newStyle.innerHTML = `@keyframes scare { 0% { width: 100px; height: 100px } 50% { width: 800px; height: 800px } 100% {width:100px; height:100px} } #neco { animation: scare 4s }`
document.head.appendChild(newStyle);
let neco = document.createElement("img");
neco.src = "https://cdn.discordapp.com/attachments/791424837285052430/899883205551861821/unknown.png";
neco.id = "neco";
neco.style.position = "absolute";
document.body.appendChild(neco);