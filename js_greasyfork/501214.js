// ==UserScript==
// @name         Disable Right-Click Blocker Everywhere
// @version      0.2
// @description  Simple Script to Disable right-click blockers on Most websites With Simple Protection
// @author       Elfhuo, ChatGPT
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1293519
// @downloadURL https://update.greasyfork.org/scripts/501214/Disable%20Right-Click%20Blocker%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/501214/Disable%20Right-Click%20Blocker%20Everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkRightClickBlocker() {
        if (window.oncontextmenu !== null) {
            window.oncontextmenu = null;
        }
    }

    checkRightClickBlocker();

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            checkRightClickBlocker();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
