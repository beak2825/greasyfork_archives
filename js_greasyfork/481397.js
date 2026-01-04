// ==UserScript==
// @name         RR: Net Profit Tool
// @namespace    -
// @version      1.0
// @description  -
// @author       LianSheng
// @match        https://rivalregions.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481397/RR%3A%20Net%20Profit%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/481397/RR%3A%20Net%20Profit%20Tool.meta.js
// ==/UserScript==

(() => {
    const ID = {
        ToolArea: "rrnpt-tool-area"
    };

    const StorageProduce = {
        Selector: "#storage_market .storage_produce",
        /** @type {CallableFunction} */
        Handler: null,
        /** @type {HTMLSpanElement} */
        ThisElement: null
    };

    /**
     * @param {HTMLSpanElement} target "produce new item" element
     */
    function saveStorageProduceHandler(target) {
        StorageProduce.Handler = jQuery._data(target, "events")?.click[0].handler;
        StorageProduce.ThisElement = target;
    }

    /**
     * 顯示計算結果
     * @param {HTMLDivElement} elContainer 
     * @param {HTMLSpanElement} elNetCost 
     * @param {HTMLSpanElement} elMarketPrice 
     */
    function showResult(elContainer, elNetCost, elMarketPrice) {
        /**
         * @param {Number} x 
         * @returns {string}
         */
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        /** @type {HTMLSpanElement} */
        const elDiscount = elContainer.querySelector(".tip:not(.small)");
        const discount = elDiscount.innerText.match(/[0-9\.]+/g).map(Number).reduce((a, e) => a + e, 0);
        const netCost = elNetCost.innerText.split(" ")[0].replace(/\./g, "") - 0;
        const marketPrice = elMarketPrice.innerText.split(" ")[0].replace(/\./g, "") - 0;

        const workshop22 = netCost / (1 - discount / 100) * 0.39;
        const workshop25 = netCost / (1 - discount / 100) * 0.375

        // [W] (max main (50%) + workshop)'s cost / [S] style color / [P] profit percent
        const w22 = workshop22 > 1e5 ? workshop22.toFixed(0) : workshop22.toFixed(1);
        const s22 = (marketPrice - workshop22) > 0 ? "chartreuse" : "red";
        const p22 = (marketPrice - workshop22) > 0 ? `+${((marketPrice / workshop22 - 1) * 100).toFixed(2)}` : `${((marketPrice / workshop22 - 1) * 100).toFixed(2)}`;
        const w25 = workshop25 > 1e5 ? workshop25.toFixed(0) : workshop25.toFixed(1);
        const s25 = (marketPrice - workshop25) > 0 ? "chartreuse" : "red";
        const p25 = (marketPrice - workshop25) > 0 ? `+${((marketPrice / workshop25 - 1) * 100).toFixed(2)}` : `${((marketPrice / workshop25 - 1) * 100).toFixed(2)}`;

        const elToolArea = document.createElement("div");
        elToolArea.id = ID.ToolArea;
        elToolArea.innerHTML = `
            <span style="color: gold; font-weight: bold"">
                &lt;RR Net Profit Tool&gt;
            </span>
            <span> || </span>
            <span>25% = </span>
            <span style="color: ${s25}; font-weight: bold">${numberWithCommas(w25)} (${p25}%)</span>
            <span> || </span>
            <span>22% = </span>
            <span style="color: ${s22}; font-weight: bold">${numberWithCommas(w22)} (${p22}%)</span>
            <span> || </span>
        `;

        const elRefreshButton = document.createElement("button");
        elRefreshButton.innerText = "Refresh";
        elRefreshButton.style.cursor = "pointer";
        elRefreshButton.style.backgroundColor = "gold";
        elRefreshButton.style.borderRadius = "20px";
        elRefreshButton.onclick = () => {
            elRefreshButton.disabled = true;
            StorageProduce.Handler.apply(StorageProduce.ThisElement);
        }
        elToolArea.append(elRefreshButton);

        elContainer.style.height = "100px";
        elMarketPrice.parentElement.insertAdjacentElement("beforeend", elToolArea);
    }

    function loop() {
        /** @type {HTMLSpanElement[]} */
        const checkElements = document.querySelectorAll("div.small .imp:not(.tip)");
        const checkToolArea = document.querySelector(`#${ID.ToolArea}`);

        if (checkElements.length === 2 && !checkToolArea) {
            const elCost = checkElements[0];
            const elPrice = checkElements[1];
            /** @type {HTMLDivElement} */
            const elContainer = document.querySelector("#storage_market");

            return showResult(elContainer, elCost, elPrice);
        }

        const checkProduceElement = document.querySelector(StorageProduce.Selector);
        
        if (checkProduceElement) {
            saveStorageProduceHandler(checkProduceElement);
        }
    }

    setInterval(loop, 100);
})();