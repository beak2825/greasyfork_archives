// ==UserScript==
// @name         Auto change skins slither.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  slither auto chnage skins
// @author       coopdawg04
// @match        http://slither.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23269/Auto%20change%20skins%20slitherio.user.js
// @updateURL https://update.greasyfork.org/scripts/23269/Auto%20change%20skins%20slitherio.meta.js
// ==/UserScript==

(function(coopdawg04) {
    'use strict';

    // Your code here...
var loopTheLoop = true; var nextSkin = 0; var theLoop = setInterval(function() { if (loopTheLoop) { if (nextSkin > 25) nextSkin = 0; if (snake !== null) setSkin(snake, nextSkin); nextSkin++; } else { clearInterval(theLoop); } }, 400);

})();
(function(fps) {
var gamefps=null;
})();
//Don't copy my code lil' code peekers ;)
var showfps=null;