// ==UserScript==
// @name         oj.uz difficulty blinder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hide the information related to the degree of difficulty
// @author       yuto1115
// @license      MIT
// @match        https://oj.uz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448425/ojuz%20difficulty%20blinder.user.js
// @updateURL https://update.greasyfork.org/scripts/448425/ojuz%20difficulty%20blinder.meta.js
// ==/UserScript==

(function() {
    const blindList = ["Solved", "# of submissions", "# of accepted", "Ratio"];

    let tables = document.getElementsByTagName("table");

    for (let table of tables) {
        let ths = table.getElementsByTagName("th");
        let tds = table.getElementsByTagName("td");

        for (let i = 0; i < tds.length; i++) {
            if (blindList.includes(ths[i % ths.length].textContent)) {
                tds[i].textContent = "";
            }
        }
    }
})();
