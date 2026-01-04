// ==UserScript==
// @name         Reload shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a binding to reset without using the mouse
// @author       LeReverandNox
// @match        https://typings.gg/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389190/Reload%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/389190/Reload%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // keys
    const resetKey = 'r';

    document.addEventListener("keydown", (e) => {
        const reset = document.getElementById("redo-button");

       if (e.ctrlKey && e.key == resetKey) {
           e.preventDefault();
           reset.click();
       }
    });
})();