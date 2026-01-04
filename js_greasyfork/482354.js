// ==UserScript==
// @name         Custom Cursor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       ANukeA
// @match        Bloxd.io
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482354/Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/482354/Custom%20Cursor.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://cdn.discordapp.com/attachments/1167450903050199122/1172119346521309214/Untitled_design__9_-removebg-preview.png?ex=655f2835&is=654cb335&hm=2e57dec8e7288a5a497a2f5e917d3213ba84ba8774c5965504c3590089cddbc8&)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
    }
}, 1000);