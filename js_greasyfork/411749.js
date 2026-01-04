// ==UserScript==
// @name         Change Reddit Logo to Red-Orange
// @namespace    https://KrazyKirby99999.github.io
// @version      0.1.1
// @description  Change Reddit Logo to original color
// @author       KrazyKirby99999
// @match        *.reddit.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/411749/Change%20Reddit%20Logo%20to%20Red-Orange.user.js
// @updateURL https://update.greasyfork.org/scripts/411749/Change%20Reddit%20Logo%20to%20Red-Orange.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {let div = document.createElement("div");div.innerHTML = "<style>._1O4jTk-dZ-VIxsCuYB6OR8 circle {fill: #FF4500;}</style>";document.body.appendChild(div);}main();

    setTimeout(function() {
      main();
    }, 10);



})();