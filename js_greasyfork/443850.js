// ==UserScript==
// @name        Discord Auto-Focus Text Box
// @namespace   http://ewan.horse/
// @license     MIT
// @version     0.1
// @description Automatically focus text box when entering the tab
// @author      Ewan Green
// @match       https://discord.com/channels/*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/443850/Discord%20Auto-Focus%20Text%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/443850/Discord%20Auto-Focus%20Text%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState == "visible") {
            const box = document.getElementsByTagName("textarea")[0];
            box.focus();
        }
    })
})();