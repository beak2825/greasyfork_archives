// ==UserScript==
// @name         TORN: Easy Company Stock
// @namespace    dekleinekobini.private.easy-company-stock
// @version      1.0.2
// @description  Easily stock your company stock. Ported from TornTools' "Auto Stock Fill" feature.
// @author       DeKleineKobini [2114440]
// @license      GNU GPLv3
// @run-at       document-end
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539036/TORN%3A%20Easy%20Company%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/539036/TORN%3A%20Easy%20Company%20Stock.meta.js
// ==/UserScript==

GM_addStyle(`
    .asc-fill-stock-wrapper {
        position: relative;
    }
    
    .asc-fill-stock {
        background-color: mediumpurple;
        color: black;
        border-radius: 6px;
        position: absolute;
        right: 10px;
        bottom: 0;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0;
    }
`);

(function () {
    "use strict";

    void addFillStockButton();
    setInterval(addFillStockButton, 500);

    async function addFillStockButton() {
        if (document.querySelector(".asc-fill-stock-wrapper")) return;
        if (getHashParameters().get("option") !== "stock") return;

        const button = document.createElement("button");
        button.classList.add("asc-fill-stock");
        button.textContent = "FILL STOCK";
        button.addEventListener("click", fillStock);

        const wrapper = document.createElement("div");
        wrapper.classList.add("asc-fill-stock-wrapper");
        wrapper.append(button);

        (await requireElement("form[action*='stock'] .order ~ a")).insertAdjacentElement("afterend", wrapper);
    }

    async function fillStock() {
        const stockForm = await requireElement("form[action*='stock']");
        const storageCapacity = [...stockForm.querySelectorAll(".storage-capacity > *")].map((x) => x.dataset.initial.getNumber());
        const usableCapacity = storageCapacity[1] - storageCapacity[0];
        const totalSoldDaily = stockForm.querySelector(".stock-list > li.total .sold-daily").textContent.getNumber();

        stockForm.querySelectorAll(".stock-list > li:not(.total):not(.quantity)").forEach((stockItem) => {
            const soldDaily = stockItem.querySelector(".sold-daily").lastChild.textContent.getNumber();

            let neededStock = ((soldDaily / totalSoldDaily) * usableCapacity).dropDecimals();
            neededStock = Math.max(0, neededStock);

            const input = stockItem.querySelector("input");
            input.value = neededStock;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });
    }
})();

function getHashParameters() {
    let hash = location.hash;

    if (hash.startsWith("#/")) hash = hash.substring(2);
    else if (hash.startsWith("#") || hash.startsWith("/")) hash = hash.substring(1);

    if (!hash.startsWith("!")) hash = "?" + hash;

    return new URLSearchParams(hash);
}

function requireElement(selector) {
    return requireCondition(() => document.querySelector(selector));
}

function requireCondition(condition, options = {}) {
    options = {
        delay: 50,
        maxCycles: 1000,
        ...options,
    };

    // Preserve stack for throwing later when needed.
    const error = new Error("Maximum cycles reached.");

    return new Promise((resolve, reject) => {
        if (checkCondition()) return;

        let counter = 0;
        const checker = setInterval(() => {
            if (checkCounter(counter++) || checkCondition()) return clearInterval(checker);
        }, options.delay);

        function checkCondition() {
            const response = condition();
            if (!response) return false;

            if (typeof response === "boolean") {
                if (response) resolve();
                else reject();
            } else if (typeof response === "object") {
                if (response.hasOwnProperty("success")) {
                    if (response.success === true) resolve(response.value);
                    else reject(response.value);
                } else {
                    resolve(response);
                }
            }
            return true;
        }

        function checkCounter(count) {
            if (options.maxCycles <= 0) return false;

            if (count > options.maxCycles) {
                reject(error);
                return true;
            }
            return false;
        }
    });
}

const REGEXES = {
    getNumber: /\D/g,
};

String.prototype.getNumber = function () {
    return parseInt(this.replace(REGEXES.getNumber, "")) || 0;
};

Number.prototype.dropDecimals = function () {
    return parseInt(this.toString());
};
