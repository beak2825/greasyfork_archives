// ==UserScript==
// @name         Left-sighted Script
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Switches positions of hold and queue
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395912/Left-sighted%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/395912/Left-sighted%20Script.meta.js
// ==/UserScript==

/**************************
   Left-sighted Script
**************************/

(function() {
    window.addEventListener('load', function(){

queueCanvas.style.marginLeft = "0px"
queueCanvas.style.marginRight = "10px"
queueCanvas.style.float = "left"
holdCanvas.style.float = "none"
holdCanvas.style.marginLeft = "10px"
holdCanvas.style.marginRight = "0px"
$("#queueCanvas").prependTo("#main");
rInfoBox.style.marginTop = "277px"

    });
})();
