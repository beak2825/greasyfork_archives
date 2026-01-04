// ==UserScript==
// @name         remove nendroid
// @namespace    http://tampermonkey.net/
// @version      2025-03-29
// @description  removes all nendroids on HLJ
// @author       You
// @match        https://www.hlj.com/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540970/remove%20nendroid.user.js
// @updateURL https://update.greasyfork.org/scripts/540970/remove%20nendroid.meta.js
// ==/UserScript==

(function() {
    let names = document.getElementsByClassName("product-item-name");
    let blocks = document.getElementsByClassName("search-widget-block");
    for (let i = names.length - 1; i >= 0; i--) { // Loop backwards to avoid live collection issues
        let name = names[i].textContent.trim().toLowerCase(); // Trim spaces and normalize case
        let block = blocks[i];
        if (name.includes("nendoroid")) {
            block.style.display = "none"; // Hide the block
        }
    }
})();