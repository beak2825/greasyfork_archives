// ==UserScript==
// @name         Torn Blackjack - Bet Control Buttons (v1.3)
// @version      1.3
// @author       BAMB00ZLE
// @description  Adds x2.5, x5, MAX, and HALF buttons to the Blackjack bet input
// @namespace    http://tampermonkey.net/
// @license      CC BY-NC-SA 4.0
// @copyright    Copyright (c) 2025 BAMB00ZLE
// @homepageURL  https://creativecommons.org/licenses/by-nc-sa/4.0/
// @match        https://www.torn.com/page.php?sid=blackjack*
// @grant        none
/*
This script is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/
You may modify and share this script, but you must credit the original author and cannot sell it.
All derivative scripts must also remain open and under the same license.
*/
// @downloadURL https://update.greasyfork.org/scripts/539093/Torn%20Blackjack%20-%20Bet%20Control%20Buttons%20%28v13%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539093/Torn%20Blackjack%20-%20Bet%20Control%20Buttons%20%28v13%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const interval = setInterval(() => {
        const betInput = document.querySelector('input[name="bet"]');
        const balanceElem = document.querySelector('#cash'); // On-hand money display

        if (betInput && !document.getElementById("bet-buttons")) {
            clearInterval(interval);

            const container = document.createElement("div");
            container.id = "bet-buttons";
            container.style.marginTop = "8px";
            container.style.display = "flex";
            container.style.gap = "6px";
            container.style.flexWrap = "wrap";

            function createButton(label, multiplierFunc) {
                const btn = document.createElement("button");
                btn.textContent = label;
                btn.style.padding = "4px 8px";
                btn.style.backgroundColor = "#444";
                btn.style.color = "white";
                btn.style.border = "none";
                btn.style.borderRadius = "4px";
                btn.style.cursor = "pointer";
                btn.onclick = () => {
                    let bet = parseFloat(betInput.value.replace(/,/g, '')) || 0;
                    let newBet = multiplierFunc(bet);
                    if (!isNaN(newBet)) {
                        betInput.value = Math.floor(newBet).toLocaleString();
                        betInput.dispatchEvent(new Event('input', { bubbles: true }));
                        betInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                };
                return btn;
            }

            container.appendChild(createButton("x2.5", bet => bet * 2.5));
            container.appendChild(createButton("x5", bet => bet * 5));
            container.appendChild(createButton("HALF", bet => bet / 2));
            container.appendChild(createButton("MAX", () => {
                const balanceText = balanceElem?.textContent?.replace(/[\$,]/g, '') || "0";
                return parseFloat(balanceText) || 0;
            }));

            betInput.parentNode.appendChild(container);
        }
    }, 500);
})();
