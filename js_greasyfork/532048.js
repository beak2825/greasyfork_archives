// ==UserScript==
// @name         Shredsauce Color Grade (Blue → Gray)
// @namespace    shredsauce
// @version      1.0
// @description  Applies a cool desaturated color grade to shredsauce by Gheat
// @match        *://shredsauce.com/*
// @grant        none
// @run-at       document-start
// @license CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/532048/Shredsauce%20Color%20Grade%20%28Blue%20%E2%86%92%20Gray%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532048/Shredsauce%20Color%20Grade%20%28Blue%20%E2%86%92%20Gray%29.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement("style");
    style.innerText = `
        html {
            /* darken + desaturate + blue shift tweak */
            filter: brightness(0.8) saturate(0.6) hue-rotate(-20deg) contrast(1.05) !important;
        }
    `;
    document.head.appendChild(style);
})();