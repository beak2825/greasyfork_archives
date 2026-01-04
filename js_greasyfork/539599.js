// ==UserScript==
// @name         Demagog procent
// @namespace    http://tampermonkey.net/
// @version      2025-06-16
// @description  Wyświetla procent koło liczby wypowiedzi
// @author       MZKNEK
// @match        https://demagog.org.pl/osoba/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=org.pl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539599/Demagog%20procent.user.js
// @updateURL https://update.greasyfork.org/scripts/539599/Demagog%20procent.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractAndDisplay() {
        let trueCount = 0;
        let falseCount = 0;

        const items = document.querySelectorAll("li[data-number]");
        if (items.length === 0) return;

        items.forEach(item => {
            const span = item.querySelector("span");
            if (!span) return;

            const match = span.textContent.match(/(Prawda|Częściowa prawda|Fałsz|Manipulacja)\s*-\s*(\d+)/i);
            if (match) {
                const type = match[1].toLowerCase();
                const value = parseInt(match[2], 10);

                if (type === "prawda" || type === "częściowa prawda") {
                    trueCount += value;
                } else if (type === "fałsz" || type === "manipulacja") {
                    falseCount += value;
                }
            }
        });

        const total = trueCount + falseCount;
        const percent = total > 0 ? (trueCount / total * 100).toFixed(1) : "0.0";

        let color = "#F9CA51";
        if (percent > 75) color = "#089B16";
        else if (percent < 35) color = "#B90000";

        const counterSpan = document.querySelector('.dg-post-checked-statements__checked-counter');
        if (!counterSpan) return;

        let existingPercentSpan = document.querySelector('.dg-truth-percent');
        if (!existingPercentSpan) {
            existingPercentSpan = document.createElement("span");
            existingPercentSpan.className = "dg-truth-percent";
            existingPercentSpan.style.marginLeft = "8px";
            existingPercentSpan.style.fontWeight = "bold";
            counterSpan.insertAdjacentElement("afterend", existingPercentSpan);
        }

        existingPercentSpan.textContent = `(${percent}%)`;
        existingPercentSpan.style.color = color;
    }

    setInterval(extractAndDisplay, 1000);
})();