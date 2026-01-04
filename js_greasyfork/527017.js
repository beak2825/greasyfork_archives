// ==UserScript==
// @name         Vitrine vs Stocks
// @version      2.9
// @description  Check stock et vitrine / Check quantité
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @match        https://dreadcast.net/Main*
// @grant        GM.addStyle
// @namespace AAAAAES58
// @downloadURL https://update.greasyfork.org/scripts/527017/Vitrine%20vs%20Stocks.user.js
// @updateURL https://update.greasyfork.org/scripts/527017/Vitrine%20vs%20Stocks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getStockItems() {
        let stockItems = {};
        document.querySelectorAll("#stocks_mise_en_vente .case_objet").forEach(item => {
            let name = item.querySelector(".titreinfo")?.innerText.trim();
            let quantity = parseInt(item.querySelector(".quantite")?.innerText.replace('x', '') || '0', 10);
            if (name) stockItems[name] = quantity;
        });
        return stockItems;
    }

    function getSaleItems() {
        let saleItems = new Set();
        document.querySelectorAll("#interface_achat .case_objet").forEach(item => {
            let name = item.querySelector(".titreinfo")?.innerText.trim();
            if (name) saleItems.add(name);
        });
        return saleItems;
    }

    function compareStockAndSale() {
        let stock = getStockItems();
        let sale = getSaleItems();
        let missingItems = [];

        for (let name in stock) {
            if (!sale.has(name)) {
                missingItems.push(`${name} (x${stock[name]})`);
            }
        }

        if (missingItems.length > 0) {
            alert("Objets en stock mais non en vente :\n" + missingItems.join("\n"));
        } else {
            alert("Tous les objets du stock sont bien en vente.");
        }
    }

    function checkLowStock() {
        let stock = getStockItems();
        let lowStockItems = Object.entries(stock)
            .filter(([name, quantity]) => quantity <= 20)
            .map(([name, quantity]) => `${name} (x${quantity})`);

        if (lowStockItems.length > 0) {
            alert("Objets en stock avec 20 unités ou moins :\n" + lowStockItems.join("\n"));
        } else {
            alert("Tous les objets ont plus de 20 unités en stock.");
        }
    }

    function createButton(container, id, text, color, topOffset, leftOffset, action) {
        let buttonInContainer = container.querySelector("#" + CSS.escape(id));
        if (buttonInContainer) {
            return buttonInContainer;
        }

        let orphanedButton = document.getElementById(id);
        if (orphanedButton && orphanedButton.parentNode !== container) {
            orphanedButton.remove();
        }

        let button = document.createElement("button");
        button.id = id;
        button.innerText = text;
        button.style.position = "absolute";
        button.style.top = `${topOffset}px`;
        button.style.left = `${leftOffset}px`;
        button.style.backgroundColor = color;
        button.style.color = "white";
        button.style.padding = "10px 15px";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
        button.style.pointerEvents = "auto";
        button.addEventListener("click", action);

        container.appendChild(button);
        return button;
    }

    function manageButtons() {
        const triggerElement = document.querySelector('.action_9.link.info2');
        let container = document.getElementById("customButtonContainer");

        if (triggerElement) {
            if (!container) {
                container = document.createElement("div");
                container.id = "customButtonContainer";
                container.style.position = "fixed";
                container.style.top = "90px";
                container.style.left = "10px";
                container.style.zIndex = "999999";
                container.style.pointerEvents = "none";
                document.body.appendChild(container);
            } else {
                if (!container.parentNode || container.parentNode !== document.body) {
                    document.body.appendChild(container);
                }
                if (container.style.display === 'none') {
                    container.style.display = '';
                }
            }

            createButton(container, "checkStockButton", "Vitrine", "green", 0, 0, compareStockAndSale);
            createButton(container, "lowStockButton", "Stock", "blue", 50, 0, checkLowStock);

        } else {
            if (container) {
                container.remove();
            }

            const idsToRemove = ["checkStockButton", "lowStockButton"];
            idsToRemove.forEach(buttonId => {
                let lingeringButton = document.getElementById(buttonId);
                if (lingeringButton) {
                    lingeringButton.remove();
                }
            });
        }
    }

    setInterval(manageButtons, 500);
    manageButtons();
})();