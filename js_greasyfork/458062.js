// ==UserScript==
// @name         Blur Webpages
// @namespace    https://www.artemive.tk/ashore
// @version      1.0
// @description  Blurs every webpage you visit
// @author       Nightshade
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458062/Blur%20Webpages.user.js
// @updateURL https://update.greasyfork.org/scripts/458062/Blur%20Webpages.meta.js
// ==/UserScript==

(function() {
    let blur = document.createElement("div");
    blur.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 2147483647;
    `;
    document.body.appendChild(blur);
})();