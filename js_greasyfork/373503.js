// ==UserScript==
// @name         Fuck BetterJsPop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuck BetterJsPop!
// @author       metafox12345
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373503/Fuck%20BetterJsPop.user.js
// @updateURL https://update.greasyfork.org/scripts/373503/Fuck%20BetterJsPop.meta.js
// ==/UserScript==

window.onload = function () {
    if (window.BetterJsPop) {
        window.BetterJsPop._stack = [];
        window.BetterJsPop.add = function () { console.log('[Fuck BetterJSPop] fucked BetterJSPop'); };
        delete window.BetterJsPop;
    }
};