// ==UserScript==
// @name         Custom Cursor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       ANukeA
// @match        https://bloxd.io/
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482353/Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/482353/Custom%20Cursor.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://cdn.discordapp.com/attachments/1160403329646600202/1184715014918127697/Untitled_design-removebg-preview.png?ex=658cfad6&is=657a85d6&hm=205ecba9325e1b3436fedbf0e4a41a3346c9ac01e2caef8e20ce48e9f0128f3e&)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
    }
}, 1000);