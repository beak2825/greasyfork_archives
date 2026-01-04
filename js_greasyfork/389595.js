// ==UserScript==
// @name         YT-LargerGrid
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes the YT-Feed larger
// @author       SirMorokei
// @match        https://www.youtube.com/feed/subscriptions
// @match        https://www.youtube.com/feed/subscriptions?flow=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389595/YT-LargerGrid.user.js
// @updateURL https://update.greasyfork.org/scripts/389595/YT-LargerGrid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divs =document.getElementsByClassName("grid-6-columns");

    divs=Array.from(divs);

    divs.forEach(function(div){
        div.classList.remove('grid-6-columns');
    });
})();