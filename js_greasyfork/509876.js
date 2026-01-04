// ==UserScript==
// @name         Shell Shockers Server Dropdown Restorer
// @namespace    https://github.com/onlypuppy7/ShellShockersServerDropdownRestorer/
// @license      GPL-3.0
// @version      1.0.2
// @author       onlypuppy7
// @description  Puts back the server dropdown which was removed from the game some years ago. Has two modes, works with latest interface.
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/ShellShockersServerDropdownRestorer/blob/main/logo.png?raw=true
// @downloadURL https://update.greasyfork.org/scripts/527873/Shell%20Shockers%20Server%20Dropdown%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/527873/Shell%20Shockers%20Server%20Dropdown%20Restorer.meta.js
// ==/UserScript==

const mode = "puppy"; // classic OR puppy

(async function () {
    while (!window.extern?.isGameReady) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const regionSelect = document.getElementById("regionSelect");
    const playGameSection = document.getElementById("home_screen");

    if (regionSelect && playGameSection) {
        playGameSection.appendChild(regionSelect);
        regionSelect.style.position = "absolute";

        if (mode === "classic") {
            regionSelect.style.left = "20em";
            regionSelect.style.top = "3em";
            regionSelect.style.marginLeft = "0em";
        } else {
            regionSelect.style.top = "45.25em";
            regionSelect.style.left = "50%";
            regionSelect.style.marginLeft = "20em";
        };
    };
})();