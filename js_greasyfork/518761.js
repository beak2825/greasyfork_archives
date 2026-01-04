// ==UserScript==
// @name         Slackmojis Darkmode
// @namespace    http://jvdl.dev/
// @version      2024-11-25
// @description  Make Slackmojis dark
// @author       John van der Loo <john@jvdl.dev>
// @match        https://slackmojis.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slackmojis.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518761/Slackmojis%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/518761/Slackmojis%20Darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.classList.remove("light");
    document.body.classList.add("dark");
})();