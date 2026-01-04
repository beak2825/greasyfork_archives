// ==UserScript==
// @name         Hordes Readability Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make chat a bit easier to read for some people
// @author       Cullen
// @match        https://hordes.io/play
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/394901/Hordes%20Readability%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/394901/Hordes%20Readability%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    #chat {
        background: rgba(0, 0, 0, 0.8);
        font-size: 16px;
    }
    `);
})();