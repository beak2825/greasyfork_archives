// ==UserScript==
// @name         Oracle Timecard Day Counter
// @namespace    https://github.com/lucascudo/otdc
// @version      0.3
// @description  Shows the sum of selected timecards in days
// @author       lucascudo <lucas.teixeira.rocha@oracle.com>
// @match        https://global-ebusiness.oraclecorp.com/OA_HTML/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oraclecorp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460191/Oracle%20Timecard%20Day%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/460191/Oracle%20Timecard%20Day%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Hxctcarecentlist = document.getElementById("Hxctcarecentlist");
    if (!Hxctcarecentlist) return;

    const td = document.createElement('tr');
    const tr = document.createElement('tr');
    tr.appendChild(td);
    Hxctcarecentlist.children[0].appendChild(tr);
    Array.from(document.querySelectorAll("input[title='Select']")).forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const hours = Array.from(document.querySelectorAll("input[title='Select']")).reduce((hours, checkbox) => {
                if (!checkbox.checked) {
                    return hours;
                }
                return parseInt(checkbox.parentNode.parentNode.children[5].children[0].innerHTML) + hours;
            }, 0);
            const days = hours / 8;
            td.innerHTML = (days < 1) ? "" : `${days} day${days > 1 ? "s" : ""} selected`;
        });
    });
})();
