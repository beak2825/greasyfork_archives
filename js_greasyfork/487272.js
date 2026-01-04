// ==UserScript==
// @name         Spent Game Money Hack
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  A script for spent game
// @author       Web
// @match        https://playspent.org/html/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487272/Spent%20Game%20Money%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/487272/Spent%20Game%20Money%20Hack.meta.js
// ==/UserScript==

(function() {
    Money.balance = 1000000000000000000000000000000;
})();