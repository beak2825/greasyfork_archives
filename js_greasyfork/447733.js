// ==UserScript==
// @name         Sort Light Novel releases by publisher on r/LightNovels
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort light novels by publisher on https://www.reddit.com/r/LightNovels/wiki/upcomingreleases by clicking on "Purchase Page"
// @author       Only_Brad
// @match        https://www.reddit.com/r/LightNovels/wiki/upcomingreleases
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447733/Sort%20Light%20Novel%20releases%20by%20publisher%20on%20rLightNovels.user.js
// @updateURL https://update.greasyfork.org/scripts/447733/Sort%20Light%20Novel%20releases%20by%20publisher%20on%20rLightNovels.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';

    document.querySelectorAll("h3 + table th:nth-child(4)").forEach(button => {
        button.style.cursor = "pointer";
        button.addEventListener("click", e => {
            const tbody = e.target.closest("table").tBodies[0];
            const rows = [...tbody.querySelectorAll("tr")];
            rows.sort((row1,row2) => {
                const data1 = row1.querySelector("td:nth-child(4)").textContent;
                const data2 = row2.querySelector("td:nth-child(4)").textContent;

                if(tbody.dataset.sort === "asc") {
                    return data2 > data1 ? 1 : -1;
                }
                return data2 > data1 ? -1 : 1;
            });

            if(tbody.dataset.sort === "asc") {
                tbody.dataset.sort = "desc";
            } else {
                tbody.dataset.sort = "asc";
            }

            rows.forEach(row => tbody.appendChild(row));
        });
    });
})();