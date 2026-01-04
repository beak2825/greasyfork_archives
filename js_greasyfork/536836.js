// ==UserScript==
// @name         Patch loadCompetitionData - zpomalení
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Zpomalení volání loadCompetitionData 1x
// @author       Michal
// @match        https://1xbit2.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536836/Patch%20loadCompetitionData%20-%20zpomalen%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/536836/Patch%20loadCompetitionData%20-%20zpomalen%C3%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
 
    function patchWhenReady() {
        if (window.Module && window.Module.prototype && typeof window.Module.prototype.loadCompetitionData === 'function') {
            const origFn = window.Module.prototype.loadCompetitionData;
            window.Module.prototype.loadCompetitionData = async function (competitionId) {
                await sleep(100);
                return origFn.apply(this, arguments);
            };      
        } else {
            setTimeout(patchWhenReady, 500);
        }
    }
    patchWhenReady();
})();
