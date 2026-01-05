// ==UserScript==
// @name         Slither.io skin rotator
// @version      1.0
// @description  Skin rotator for slither.io
// @author       UnicornAssassin
// @match        http://slither.io/
// @grant        none
// @namespace https://greasyfork.org/users/40364
// @downloadURL https://update.greasyfork.org/scripts/19107/Slitherio%20skin%20rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/19107/Slitherio%20skin%20rotator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loopTheLoop = true; var nextSkin = 0; var theLoop = setInterval(function() { if (loopTheLoop) { if (nextSkin > 25) nextSkin = 0; if (snake !== null) setSkin(snake, nextSkin); nextSkin++; } else { clearInterval(theLoop); } }, 400);
})();