// ==UserScript==
// @name         Execute Proc Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Calculates how much enemy's health has to be for execute to proc
// @author       CastyLoz17
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541028/Execute%20Proc%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/541028/Execute%20Proc%20Calculator.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function getNthParentDiv(element, n) {
        let current = element;
        let count = 0;

        while (current && count < n) {
            current = current.parentElement;
            if (current) {
                count++;
            }
        }

        return count === n ? current : null;
    }

    function run() {
        // get enemy health
        const opponent_health_elem = document.querySelectorAll(
            '[id^="player-health-value_"]'
        )[1];

        if (!opponent_health_elem) {
            console.log("no opponent health found yet, retrying...");
            setTimeout(run, 100); // retry after half a sec
            return;
        }

        const opponent_max_health = parseInt(
            opponent_health_elem.innerText.split(" / ")[1].replaceAll(",", "")
        );

        const coreWrap = document.querySelector(".coreWrap___LtSEy");
        if (!coreWrap) {
            console.log("no coreWrap yet, retrying...");
            setTimeout(run, 500);
            return;
        }

        [...document.getElementsByClassName("bonus-attachment-execute")].forEach(
            (bonus_element) => {
                let bonus = bonus_element.dataset.bonusAttachmentDescription;
                let execute_percentage = parseInt(
                    bonus.split(" ")[7].replaceAll("%", "")
                );

                let weapon_element = getNthParentDiv(bonus_element, 4);
                let weapon_name = weapon_element.ariaLabel.replaceAll(
                    "Attack with ",
                    ""
                );

                let health_calculation =
                    opponent_max_health * (execute_percentage / 100);

                // add to interface
                let message = `Execute will proc for ${weapon_name} at ${Math.floor(health_calculation)} life`;

                const p = document.createElement("h2");
                p.textContent = message;
                coreWrap.insertBefore(p, coreWrap.children[1]);
            }
        );
    }

    window.addEventListener("load", run);
})();