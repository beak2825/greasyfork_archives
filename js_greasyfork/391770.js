// ==UserScript==
// @name         Check/Uncheck all checkboxes on Page
// @namespace    https://greasyfork.org/users/256625
// @version      1
// @description  yeah
// @author       DipshitDickinson
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/391770/CheckUncheck%20all%20checkboxes%20on%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/391770/CheckUncheck%20all%20checkboxes%20on%20Page.meta.js
// ==/UserScript==

GM_registerMenuCommand("Check all checkboxes", function() {
    for(let c of document.querySelectorAll("input[type=checkbox]")) {
        if(!c.checked) {
            c.click();
        }
    }
});

GM_registerMenuCommand("Uncheck all checkboxes", function() {
    for(let c of document.querySelectorAll("input[type=checkbox]")) {
        if(c.checked) {
            c.click();
        }
    }
});