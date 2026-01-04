// ==UserScript==
// @name        Upside down screen remake -bonk.io
// @namespace   LCDAngel99
// @match       https://bonk.io/gameframe-release.html
// @grant       none
// @version     1.0
// @author      LCDAngel99
// @description Upside down screen in bonk.io but chat isn't upside down.
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/464175/Upside%20down%20screen%20remake%20-bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/464175/Upside%20down%20screen%20remake%20-bonkio.meta.js
// ==/UserScript==

setInterval(() => {
    let iframe = document.getElementById("maingameframe");
    let w;
    if (iframe) w = iframe.contentWindow;
    else w = window;

    let mainCanvas = w.document.getElementsByTagName('canvas');
    if (mainCanvas) {
        mainCanvas[2].style.transformOsrigin = "center";
        mainCanvas[2].style.transform = "rotate(180deg)";
    }
}, 1000);