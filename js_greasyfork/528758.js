// ==UserScript==
// @name         Check/Uncheck
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Check or uncheck checkboxes
// @author       Bisse
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528758/CheckUncheck.user.js
// @updateURL https://update.greasyfork.org/scripts/528758/CheckUncheck.meta.js
// ==/UserScript==

GM_registerMenuCommand("Check", function() {
    for(let c of document.querySelectorAll(".btfill")) {
        if(!c.checked) {
            c.click();
        }
    }
});

GM_registerMenuCommand("Uncheck", function() {
    for(let c of document.querySelectorAll(".btfill")) {
        if(c.checked) {
            c.click();
        }
    }
});