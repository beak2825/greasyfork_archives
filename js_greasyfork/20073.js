// ==UserScript==
// @name ALL NEW FAST SKIN CHANGER!
// @version 1.0
// @description NOW YOU CAN PLAY WITH DIFFERINT CHANGING SKINS 2x [ may not work with blaine.io mod]
// @author Blaineelliott
// @namespace Slither Skin Changer
// @match        http://slither.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20073/ALL%20NEW%20FAST%20SKIN%20CHANGER%21.user.js
// @updateURL https://update.greasyfork.org/scripts/20073/ALL%20NEW%20FAST%20SKIN%20CHANGER%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var loopTheLoop = true; var nextSkin = 0; var theLoop = setInterval(function() { if (loopTheLoop) { if (nextSkin > 25) nextSkin = 0; if (snake !== null) setSkin(snake, nextSkin); nextSkin++; } else { clearInterval(theLoop); } }, 100);
})();