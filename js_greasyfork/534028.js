// ==UserScript==
// @name         Faster Repricing
// @version      1.0
// @license      GNU GPLv3
// @description  Lower shop prices by clicking instead of typing
// @match        https://www.neopets.com/market.phtml*type=your*
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://www.youtube.com/@Neo_PosterBoy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534028/Faster%20Repricing.user.js
// @updateURL https://update.greasyfork.org/scripts/534028/Faster%20Repricing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🔧 Userscript loaded.");

    // Items currently priced at 9,999 or less will be decreased by 100
    // 10,000-99,999 will be lowered (or rounded down to the nearest) 500
    // 100,000 and up will be lowered by 1,000

    function getLoweredPrice(price) {
        if (price < 1000) {
            return Math.max(1, price - 100);
        } else if (price < 10000) {
            return Math.max(1, price - 100);
        } else if (price < 100000) {
            return Math.floor(price / 500) * 500 - 500;
        } else {
            return Math.max(1, price - 1000);
        }
    }

    let checkCount = 0;
    const maxChecks = 20;
    const interval = setInterval(() => {
        checkCount++;
        const inputs = Array.from(document.querySelectorAll("input[name^='cost_']"));
        console.log(`⏳ Check #${checkCount}: Found ${inputs.length} price input(s).`);

        if (inputs.length > 0) {
            clearInterval(interval);
            console.log("Found inputs! Adding buttons...");

            const lowerButtons = [];

            // Append button below the value field
            inputs.forEach(input => {
                const priceRaw = input.value;
                const price = parseInt(priceRaw.replace(/,/g, ''), 10);

                if (isNaN(price)) {
                    console.warn("Skipping input with NaN price:", input);
                    return;
                }

                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = "▼ Lower Price";
                btn.style.marginTop = "4px";
                btn.style.display = "block";
                btn.style.fontSize = "10px";

                btn.addEventListener("click", () => {
                    const current = parseInt(input.value.replace(/,/g, ''), 10);
                    const newPrice = getLoweredPrice(current);
                    console.log(`💸 Lowering from ${current} to ${newPrice}`);
                    input.value = newPrice;
                });

                input.parentNode.appendChild(btn);
                lowerButtons.push(btn);
            });

            // Add "Lower All" button at the top
            const form = document.querySelector("form[action='process_market.phtml']");
            if (form) {
                const wrapper = document.createElement("div");
                wrapper.style.textAlign = "center";
                wrapper.style.marginBottom = "10px";

                const lowerAllBtn = document.createElement("button");
                lowerAllBtn.type = "button";
                lowerAllBtn.textContent = "▼ Lower All Prices";
                lowerAllBtn.style.fontSize = "12px";
                lowerAllBtn.style.padding = "4px 12px";
                lowerAllBtn.style.cursor = "pointer";

                lowerAllBtn.addEventListener("click", () => {
                    console.log("Lower All clicked!");
                    lowerButtons.forEach(btn => btn.click());
                });

                wrapper.appendChild(lowerAllBtn);
                form.insertBefore(wrapper, form.firstChild);
                console.log("Lower All button added (centered).");
            }
        }

        if (checkCount >= maxChecks) {
            clearInterval(interval);
            console.warn("Timed out. Could not find any cost_ inputs.");
        }
    }, 500);
})();