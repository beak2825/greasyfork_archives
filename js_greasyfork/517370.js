// ==UserScript==
// @name        PXI Fusion UserScript Port
// @namespace   Violentmonkey Scripts
// @match       https://math.prodigygame.com/*
// @grant       none
// @version     1.1.DescriptionChanged
// @author      CrashZer0
// @description A port of the Prodigy cheatloader PXI Fusion (Note: This Requires The PXI Fusion Extension)
// @downloadURL https://update.greasyfork.org/scripts/517370/PXI%20Fusion%20UserScript%20Port.user.js
// @updateURL https://update.greasyfork.org/scripts/517370/PXI%20Fusion%20UserScript%20Port.meta.js
// ==/UserScript==
(function() {
    const scriptUrl = "https://raw.githubusercontent.com/DragonProdHax/PXI/main/PXI%20Fusion";
    fetch(scriptUrl)
        .then(response => response.text())
        .then(code => {
            eval(code);
        })
        .catch(error => console.error("Failed to load the script:", error));
})();

