// ==UserScript==
// @name            Chat Fix
// @namespace       http://tampermonkey.net/
// @version         1
// @description     Chat Fix for update 2.240
// @author          Nigdo
// @include         https://*.the-west.*/game.php*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/528794/Chat%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/528794/Chat%20Fix.meta.js
// ==/UserScript==

(async function() {
    while (window.GameMap === undefined) {
        await new Promise(res => setTimeout(res, 5));
    }
    GameMap.Object = {};
    GameMap.Object.keys = Object.keys;
    Object.keys = function (scope) {
        if (scope === window) return GameMap.Object.keys(scope).slice(0, GameMap.Object.keys(window).indexOf('Fingerprint2')+1);
        return GameMap.Object.keys(scope);
    }
})();