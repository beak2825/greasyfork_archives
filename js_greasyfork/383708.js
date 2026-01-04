// ==UserScript==
// @name         healthykk bypass
// @namespace    healthykk Bypass
// @version      0.1
// @description  Bypass healthykk
// @author       DarioGabriel
// @match        http://healthykk.com
// @include      *healthykk.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383708/healthykk%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/383708/healthykk%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var RETRASO = 0; //DELAY
    var RECARGAR = 0; //RELOAD WEBPAGE IF FAIL 0=DEACTIVATED

    setTimeout(function() {
        var AutoClick = document.getElementById("makingdifferenttimer");
        if (AutoClick !== null)
        {
            AutoClick.click();
        }
    }, RETRASO * 1000);

    if (RECARGAR > 0) setTimeout(function(){ location.reload(); }, RECARGAR*1000);
})();