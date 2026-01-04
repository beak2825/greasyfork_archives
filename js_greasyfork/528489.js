// ==UserScript==
// @name         Torn Set Trade Helper
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Ensures "Max Flower" and "Max Plushie" buttons always stay on the trade page, correctly handling both categories separately.
// @license      MIT
// @author       YoYo
// @match        https://www.torn.com/trade.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528489/Torn%20Set%20Trade%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/528489/Torn%20Set%20Trade%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Relevant Flowers & Plushies
    const RELEVANT_FLOWERS = [
        "African Violet", "Banana Orchid", "Ceibo Flower", "Cherry Blossom",
        "Crocus", "Dahlia", "Edelweiss", "Heather", "Orchid", "Peony", "Tribulus Omanense"
    ];

    const RELEVANT_PLUSHIES = [
        "Camel Plushie", "Chamois Plushie", "Jaguar Plushie", "Kitten Plushie",
        "Lion Plushie", "Monkey Plushie", "Nessie Plushie", "Panda Plushie",
        "Red Fox Plushie", "Sheep Plushie", "Stingray Plushie", "Teddy Bear Plushie", "Wolverine Plushie"
    ];

    let userInventory = { flower: [], plushie: [] };
    let lowestItem = { flower: null, plushie: null };

    function checkTradePage() {
        if (window.location.href.includes("trade.php#step=add")) {
            console.log("Trade page detected");
            addTradeButtons();
        }
    }

    function interceptInventoryData() {
        const open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url.includes("inventory.php")) {
                this.addEventListener("load", function () {
                    try {
                        const responseText = this.responseText;
                        const jsonData = JSON.parse(responseText);
                        if (jsonData.list) {
                            processInventory(jsonData.list);
                        }
                    } catch (error) {
                        console.error("Error parsing inventory data:", error);
                    }
                });
            }
            return open.apply(this, arguments);
        };
    }

    function processInventory(items) {
        userInventory = { flower: [], plushie: [] };
        lowestItem = { flower: null, plushie: null };

        for (const item of items) {
            if (item.type2 === "Flower" && RELEVANT_FLOWERS.includes(item.name)) {
                const parsedItem = { name: item.name, quantity: parseInt(item.Qty, 10), id: item.armoryID };
                userInventory.flower.push(parsedItem);

                if (!lowestItem.flower || parsedItem.quantity < lowestItem.flower.quantity) {
                    lowestItem.flower = parsedItem;
                }
            } else if (item.type2 === "Plushie" && RELEVANT_PLUSHIES.includes(item.name)) {
                const parsedItem = { name: item.name, quantity: parseInt(item.Qty, 10), id: item.armoryID };
                userInventory.plushie.push(parsedItem);

                if (!lowestItem.plushie || parsedItem.quantity < lowestItem.plushie.quantity) {
                    lowestItem.plushie = parsedItem;
                }
            }
        }

        console.log("Updated Inventory:", userInventory);
        console.log("Lowest Items:", lowestItem);
    }

    function addTradeButtons() {
        const footerDiv = document.querySelector(".items-footer.clearfix");
        if (!footerDiv) return;

        ["flower", "plushie"].forEach(type => {
            if (!document.getElementById(`max-${type}-btn`)) {
                const button = document.createElement("input");
                button.type = "button";
                button.value = `Max ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                button.classList.add("torn-btn", "left");
                button.id = `max-${type}-btn`;
                button.style.marginLeft = "10px";
                button.addEventListener("click", () => fillMaxItems(type));
                footerDiv.appendChild(button);
            }
        });
    }

    function fillMaxItems(type) {
        if (!lowestItem[type]) {
            alert(`No ${type}s found to add.`);
            console.log(`No ${type}s found.`);
            return;
        }

        const missingItems = (type === "flower" ? RELEVANT_FLOWERS : RELEVANT_PLUSHIES).filter(name =>
            !userInventory[type].some(item => item.name === name)
        );

        if (missingItems.length > 0) {
            alert(`⚠️ Missing: ${missingItems.join(", ")}\nTrade not updated.`);
            console.log(`Missing ${type}s: ${missingItems.join(", ")} - Trade action blocked.`);
            return;
        }

        const lowestQty = lowestItem[type].quantity - 1;
        console.log(`Setting all ${type}s to ${lowestQty}.`);

        document.querySelectorAll("li.clearfix[data-group='child']").forEach(item => {
            const nameElement = item.querySelector(".t-overflow");
            if (!nameElement) return;
            const itemName = nameElement.innerText.trim();

            // Correctly distinguish flowers and plushies
            if ((type === "flower" && !RELEVANT_FLOWERS.includes(itemName)) ||
                (type === "plushie" && !RELEVANT_PLUSHIES.includes(itemName))) {
                console.log(`Skipping non-relevant ${type}: ${itemName}`);
                return;
            }

            const inputField = item.querySelector("input[name='amount']");
            if (inputField) {
                inputField.value = lowestQty;
                inputField.dispatchEvent(new Event("input", { bubbles: true }));
                console.log(`Set ${itemName} to ${lowestQty}`);
            }
        });

        alert(`All ${type}s set to ${lowestQty}.`);
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(() => addTradeButtons());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("load", checkTradePage);
    window.addEventListener("hashchange", checkTradePage);
    interceptInventoryData();
    observeDOMChanges();
})();
