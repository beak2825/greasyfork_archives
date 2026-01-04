// ==UserScript==
// @id              LezPopMerda
// @name            LezPop AdBlock Block
// @namespace       https://lezpopkek.com
// @version         0.1
// @author          Stocazzo <stoc@azzo.com>
// @description     LezPop AdBlock Block Script
// @domain          lezpop.it
// @match           https://www.cozumpark.com/*
// @grant           GM.getValue
// @grant           GM.setValue
// @updateVersion   1
// @priority        9001
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432336/LezPop%20AdBlock%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/432336/LezPop%20AdBlock%20Block.meta.js
// ==/UserScript==

window.lezpopMerda = function (ttl) {
    jQuery("#tie-popup-adblock").remove();
    jQuery("#tie-wrapper").css({"filter": "initial"});
    jQuery("html").css({"overflow": "initial"});

    if (ttl > 0) {
        setTimeout(function() {lezpopMerda(ttl-1);}, 200);
    }
};


(function () {
    $(document).ready(function () {
        setTimeout(function() {lezpopMerda(20);}, 200);
    });
})();