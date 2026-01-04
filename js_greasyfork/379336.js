// ==UserScript==
// @name         WideTerminal
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Microblink
// @include      /^http://.*:.*/terminals/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379336/WideTerminal.user.js
// @updateURL https://update.greasyfork.org/scripts/379336/WideTerminal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("terminado-container").classList.remove("container");
    document.getElementById("terminado-container").classList.add("container-fluid");

})();