// ==UserScript==
// @name         Custom Average Time
// @namespace    NonoL3Robot
// @version      1.0
// @description  Add an input to have a custom average time on n last times
// @author       NonoL3Robot
// @match        http://www.cubetimer.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cubetimer.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503533/Custom%20Average%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/503533/Custom%20Average%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calcCustomAvg(custom) {
    if (time_list.length < custom) return;
    let total_custom = time_list.slice(-custom).map(a => parseInt(a)).reduce((a, b) => a + b);
    return format_time(total_custom / custom);
    }

    let customRow = document.querySelector("#stats > table").insertRow(-1);
    let customSelector = customRow.insertCell(0);
    let customAvg = customRow.insertCell(1);
    customSelector.innerHTML = `<input id="customNumber" type="number" value="6" min="1"/>`;
    customAvg.innerHTML = '--:--.--';

    customSelector.addEventListener("input", event => {
        customAvg.innerHTML = calcCustomAvg(parseInt(document.getElementById('customNumber').value));
        event.preventDefault();
    });
})();