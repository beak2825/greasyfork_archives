// ==UserScript==
// @name         Hybrid Submit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       pyro
// @description  submits on enter in hybrid
// @match
// @include      *gethybrid.io*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/38346/Hybrid%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/38346/Hybrid%20Submit.meta.js
// ==/UserScript==

(function() {
    document.onkeydown = function (e) {
        if (e.keyCode == 13) $("input[value='Submit']").click();
    };
})();