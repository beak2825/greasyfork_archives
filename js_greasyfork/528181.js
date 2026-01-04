// ==UserScript==
// @name         OC - Prevent Joining Low %
// @namespace    Titanic_
// @version      1.3
// @description  Prevents joining OCs if success rate is too low
// @author       Titanic_ [2968477]
// @license      MIT
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528181/OC%20-%20Prevent%20Joining%20Low%20%25.user.js
// @updateURL https://update.greasyfork.org/scripts/528181/OC%20-%20Prevent%20Joining%20Low%20%25.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // minimum oc level (disables join btn if oc level is below this)
    const MIN_LEVEL = 5;

    // minimum % for each level (default is used if % is undefined)
    // default must be set to either Red, Orange or Green
    const LEVEL_REQUIREMENTS = {
        7:  70,
        8:  65,
        9:  0,
        10: 0,
        default: "Green"
    };

    const COLOR_ORDER = ["Red", "Orange", "Green"];

    function observe() {
        if (!window.location.href.includes("tab=crimes")) return;
        clearInterval(window.OCCheckInterval);
        window.OCCheckInterval = setInterval(() => {
            if (document.querySelector("[class*=joinButton_]")) process();
        }, 500);
    }

    function process() {
        document.querySelectorAll("#faction-crimes-root div[class*=contentLayer_]:not([data-checked]").forEach(row => {
            const ocLevel = parseInt(row.querySelector("span[class*=levelValue_]")?.textContent)
            if (!ocLevel) return console.warn("Failed to find OC Level");

            row.querySelectorAll("[class*=joinButton_]").forEach(btn => {
                const wrapper = btn.closest("[class*=wrapper]");
                const minSuccessRate = LEVEL_REQUIREMENTS[ocLevel];
                const successRate = parseInt(wrapper?.querySelector("[class*=successChance]")?.textContent);

                if (!successRate) return console.warn("Failed to find OC Success Rate");
                
                btn.disabled = ocLevel < MIN_LEVEL || (minSuccessRate !== undefined
                    ? successRate < minSuccessRate
                    : !COLOR_ORDER.slice(COLOR_ORDER.indexOf(LEVEL_REQUIREMENTS.default)).some(c => wrapper.className.includes(c)));
            });

            row.dataset.checked = "checked";
        });
    }

    window.addEventListener("hashchange", observe);
    observe();
})();
