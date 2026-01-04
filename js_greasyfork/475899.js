// ==UserScript==
// @name            Amazon Historical Prices
// @version         1.1.0
// @description     Add a price history chart to Amazon product pages, powered by Keepa.
// @author          Ming-Hao Xu
// @namespace       https://github.com/ming-hao-xu
// @homepage        https://github.com/ming-hao-xu/amazon-historical-prices
// @include         https://www.amazon.*/*
// @grant           none
// @inject-into     content
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/475899/Amazon%20Historical%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/475899/Amazon%20Historical%20Prices.meta.js
// ==/UserScript==

// User Settings: Modify these variables to customize the Amazon Historical Prices chart
const userSettings = {
    showAmazonPrice: 1, // Amazon price graph: 1 (draw), 0 (do not draw)
    showNewPrice: 1, // New price graph: 1 (draw), 0 (do not draw)
    showUsedPrice: 0, // Used price graph: 1 (draw), 0 (do not draw)
    chartRange: 90, // The range of the chart in days: Suggested values are 1, 2, 7, 31, 90, 365
};

(() => {
    "use strict";

    // Apply CSS styles to the chart container
    const style = document.createElement("style");
    style.textContent = `
        .historicalPriceContainer {
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center;
            width: 100%;
        }
        .historicalPriceChart {
            width: 100%;
            height: auto;
            object-fit: contain;
            border-radius: 0 !important;
        }
    `;
    document.head.appendChild(style);

    const getASIN = () => {
        const selectors = [
            "#ASIN",
            "[data-asin]",
            'input[name="ASIN"]',
            'input[name="parentASIN"]',
        ];
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.value || element.getAttribute("data-asin");
            }
        }
        console.error("Unable to find ASIN!");
        return null;
    };

    const generateHistoricalPriceChart = (asin, tld) => {
        const keepaCountryCodes = {
            com: "1",
            uk: "2",
            de: "3",
            fr: "4",
            jp: "5",
            ca: "6",
            it: "8",
            es: "9",
            in: "10",
            mx: "11",
            br: "12",
        };

        const countryCode = keepaCountryCodes[tld];
        if (!countryCode) {
            console.error("This country is not supported by Keepa.");
            return;
        }

        const historicalPriceContainer = document.createElement("div");
        historicalPriceContainer.className = "historicalPriceContainer";

        const historicalPriceLink = document.createElement("a");
        historicalPriceLink.target = "_blank";
        historicalPriceLink.href = `https://keepa.com/#!product/${countryCode}-${asin}`;

        const historicalPriceChart = new Image();
        historicalPriceChart.className = "historicalPriceChart";
        historicalPriceChart.src = `https://graph.keepa.com/pricehistory.png?used=${userSettings.showUsedPrice}&asin=${asin}&domain=${tld}&amazon=${userSettings.showAmazonPrice}&new=${userSettings.showNewPrice}&range=${userSettings.chartRange}`;

        historicalPriceLink.appendChild(historicalPriceChart);
        historicalPriceContainer.appendChild(historicalPriceLink);

        // Insert the chart into the main content area above the price
        const parentElement =
            document.getElementById("unifiedPrice_feature_div") ||
            document.getElementById("MediaMatrix") ||
            document.getElementById("ppd") ||
            document.getElementById("centerCol");

        if (parentElement) {
            parentElement.insertBefore(
                historicalPriceContainer,
                parentElement.firstChild
            );
        } else {
            console.error("Unable to find parent element to insert chart!");
        }
    };

    const init = () => {
        const tld = location.hostname.split(".").pop();
        const asin = getASIN();

        if (asin) {
            generateHistoricalPriceChart(asin, tld);
        } else {
            const observer = new MutationObserver(() => {
                const asin = getASIN();
                if (asin) {
                    generateHistoricalPriceChart(asin, tld);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    if (document.readyState !== "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
