// ==UserScript==
// @name         AWBW Tournament Bracket Cleaner Display
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  Remove seed numbers and stretches tables to fit content
// @author       Vincent ～ VIH
// @match        https://awbw.amarriner.com/viewtournament.php?tournaments_id=*
// @icon         https://awbw.amarriner.com/terrain/trophy_1.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495988/AWBW%20Tournament%20Bracket%20Cleaner%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/495988/AWBW%20Tournament%20Bracket%20Cleaner%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.getElementById("outer").style.width = "fit-content";
document.getElementById("bracket").style.width = "100%";
document.getElementById("bracket").style.overflowX = "auto";

// Removes player seed numbers
[].forEach.call(document.getElementsByClassName("norm"), function(element) { element.previousSibling.remove()})


})();