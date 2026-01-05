// ==UserScript==
// @name         Auto Drop Confirmer
// @namespace    http://vulcun.com
// @version      0.3
// @description  Will be confirm the Vulcun Drop
// @author       SimpleGek
// @match        https://vulcun.com/user/lobby#page-live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13682/Auto%20Drop%20Confirmer.user.js
// @updateURL https://update.greasyfork.org/scripts/13682/Auto%20Drop%20Confirmer.meta.js
// ==/UserScript==

function enterContest() {
    $('#enter-lootdrop').each(function() {
        if($(this).attr('disabled') == 'disabled') {
           console.log("button disabled: skipped");
           return;
        }

        console.log(this);
        this.click();
        console.log("Button clicked");
    });
}

setInterval(enterContest, 30000);