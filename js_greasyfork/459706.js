// ==UserScript==
// @name         SPH Nachrichten HTML copy to c
// @namespace    http://none.not/
// @version      0.3
// @description  copy source
// @author       NanoStrike
// @match        https://start.schulportal.hessen.de/nachrichten.php*
// @icon         https://start.schulportal.hessen.de/img/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459706/SPH%20Nachrichten%20HTML%20copy%20to%20c.user.js
// @updateURL https://update.greasyfork.org/scripts/459706/SPH%20Nachrichten%20HTML%20copy%20to%20c.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    function add() {
        navigator.clipboard.writeText(document.getElementsByTagName('html')[0].outerHTML).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        alert("Copied to clipboard");
    });
    }
    setInterval(add, 1000);
})();