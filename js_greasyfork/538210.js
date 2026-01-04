// ==UserScript==
// @name         FMP Show Player ID and Notes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display player ID beside name, outside of the clickable link for easier copy-paste in FMP team page.
// @author       Simsem
// @match        https://footballmanagerproject.com/Team/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538210/FMP%20Show%20Player%20ID%20and%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/538210/FMP%20Show%20Player%20ID%20and%20Notes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectPlayerIDs() {
        document.querySelectorAll("tr[id^='trow']").forEach(row => {
            if (row.dataset.modified) return;

            const infoIcon = row.querySelector('.player-info.note');
            const nameLink = row.querySelector('a.name');
            const nameTd = nameLink?.closest('td');

            if (infoIcon && nameLink && nameTd) {
                const playerID = infoIcon.getAttribute("pid");

                // Create span outside the link for easier copy
                const idSpan = document.createElement("span");
                idSpan.textContent = `[ID: ${playerID}] `;
                idSpan.style.color = "#6cf";
                idSpan.style.fontSize = "11px";
                idSpan.style.fontWeight = "bold";
                idSpan.style.marginRight = "6px";

                // ضع الـ span قبل رابط الاسم داخل نفس الخلية
                nameTd.insertBefore(idSpan, nameLink);

                row.dataset.modified = "true";
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(injectPlayerIDs, 1000);
    });
})();
