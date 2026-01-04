// ==UserScript==
// @name         OP.G Update/Match-Detail Button Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When using Adblock to block trackers (Facebook) the Websites breaks and the Update and Match-Details button no longer work, this userscript fixes that issue.
// @author       You
// @match        https://*.op.gg/summoner/userName=*
// @icon         https://www.google.com/s2/favicons?domain=op.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428631/OPG%20UpdateMatch-Detail%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428631/OPG%20UpdateMatch-Detail%20Button%20Fix.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    'use strict';

    while (true){
        if (window.hasOwnProperty('$')
            && $.OP !== undefined
            && $.OP.GG !== undefined
            && $.OP.GG.tracker !== undefined
            && $.OP.GG.tracker.combine !== undefined)
        {
            $.OP.GG.tracker.combine.sendEvent = function(type, location, action, eventParams) {
                //console.log("Fixed :)");
                return true;
            };
            break;
        }
        await sleep(1);
    }
})();