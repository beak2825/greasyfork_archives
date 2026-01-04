// ==UserScript==
// @name         Finsko házená
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Automaticky vyplňuje regexy s unikátním ID do inputů na stránce finské házené
// @author       Michal
// @match        https://finnhandball.torneopal.fi/taso/live.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528877/Finsko%20h%C3%A1zen%C3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528877/Finsko%20h%C3%A1zen%C3%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function generateUniqueID() {
        return "ID_" + Math.floor(Date.now() / 1000) + "_" + Math.floor(Math.random() * 10000);
    }

    function updateRegexInput(inputId, keyName) {
        let input = document.getElementById(inputId);
        if (!input || input.value !== "") return;

        let uniqueID = generateUniqueID();

        let regex = `/[^0-9]*([0-9]{1,2})[^0-9]*/(function(match,p1){let uniqueID="${uniqueID}",key="${keyName}Score_"+uniqueID,timeKey="${keyName}Timestamp_"+uniqueID,lastScore=sessionStorage.getItem(key),lastTimestamp=sessionStorage.getItem(timeKey),currentScore=parseInt(p1,10),now=Date.now();return(lastScore===null||currentScore>=parseInt(lastScore,10)||(lastTimestamp!==null&&now-parseInt(lastTimestamp,10)>=60000))?(sessionStorage.setItem(key,currentScore),sessionStorage.setItem(timeKey,now),currentScore):lastScore;})`;

        input.value = regex;
    }

    function isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    function watchForFormBox() {
        const observer = new MutationObserver(() => {
            const formBox = document.getElementById("kvido-main-form-box");
            if (formBox && isVisible(formBox)) {
                updateRegexInput("picker-name-input-regex0", "lastHome");
                updateRegexInput("picker-name-input-regex1", "lastAway");
                console.log("[✓] Regex úspěšně vložen do inputů.");
                // observer.disconnect(); // volitelně
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    watchForFormBox();
})();
