// ==UserScript==
// @name         Torn Bazaar Randomizer
// @namespace    http://tampermonkey.net/
// @version      1.9.99915
// @description  Randomizes bazaar items by simulating touch-based drag-and-drop on Torn PDA/mobile manage page
// @author       Sanwise [3401293]
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545614/Torn%20Bazaar%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/545614/Torn%20Bazaar%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findRows() {
        const rows = document.querySelectorAll("[data-testid='sortable-item']");
        console.log("[Bazaar Randomizer] findRows: matched", rows.length, "visible rows");
        return Array.from(rows);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function randomize() {
        console.log("[Bazaar Randomizer] Button clicked → randomizing…");
        const rows = findRows();
        if (rows.length < 2) {
            console.warn("[Bazaar Randomizer] Not enough visible rows to reorder");
            return;
        }

        const container = rows[0].parentNode;
        const shuffled = shuffle(rows.slice());

        shuffled.forEach(row => container.appendChild(row));
        console.log("[Bazaar Randomizer] Rows randomized (visible only)");
    }

    function addButton() {
        if (document.querySelector("#bazaar-randomizer-btn")) return;

        const header = document.querySelector(".title-black") || document.body;
        const btn = document.createElement("button");
        btn.id = "bazaar-randomizer-btn";
        btn.textContent = "Randomize Visible";
        btn.style.marginLeft = "10px";
        btn.style.padding = "4px 8px";
        btn.style.cursor = "pointer";

        btn.addEventListener("click", randomize);
        header.appendChild(btn);

        console.log("[Bazaar Randomizer] Button added");
    }

    // Watch for bazaar rows to appear
    const observer = new MutationObserver(() => {
        if (document.querySelector("[data-testid='sortable-item']")) {
            addButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();