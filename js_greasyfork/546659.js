// ==UserScript==
// @name         Diep.io Test Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test if Tampermonkey runs on diep.io
// @match        *://diep.io/*
// @grant        none
// @license      Mine
// @downloadURL https://update.greasyfork.org/scripts/546659/Diepio%20Test%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/546659/Diepio%20Test%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "40px";
    overlay.style.left = "10px";
    overlay.style.padding = "6px 12px";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.color = "white";
    overlay.style.fontFamily = "monospace";
    overlay.style.fontSize = "16px";
    overlay.style.zIndex = 9999;
    overlay.textContent = "✅ Script loaded via GreasyFork!";
    document.body.appendChild(overlay);
})();
