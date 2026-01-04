// ==UserScript==
// @name         Bazaar Filler BETA
// @namespace    http://tampermonkey.net/
// @version      1.55
// @description  On click, auto-fills bazaar item quantities and prices based on your preferences
// @match        https://www.torn.com/bazaar.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      tornpal.com
// @downloadURL https://update.greasyfork.org/scripts/528186/Bazaar%20Filler%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/528186/Bazaar%20Filler%20BETA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleBlock = `
.item-toggle {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
}
.item-toggle::after {
    content: '\\2713';
    position: absolute;
    font-size: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
}
.item-toggle:checked::after {
    display: block;
}

body:not(.dark-mode) .item-toggle {
    border: 1px solid #ccc;
    background: #fff;
}
body:not(.dark-mode) .item-toggle:checked {
    background: #007bff;
}
body:not(.dark-mode) .item-toggle:checked::after {
    color: #fff;
}

body.dark-mode .item-toggle {
    border: 1px solid #4e535a;
    background: #2f3237;
}
body.dark-mode .item-toggle:checked {
    background: #4e535a;
}
body.dark-mode .item-toggle:checked::after {
    color: #fff;
}

.checkbox-wrapper {
    position: absolute;
    top: 50%;
    right: 8px;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
    cursor: pointer;
}
.checkbox-wrapper input.item-toggle {
    position: absolute;
    top: 6px;
    left: 6px;
}

.settings-modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
.settings-modal {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    color: #000;
}
.settings-modal h2 {
    margin-top: 0;
}
.settings-modal label {
    display: block;
    margin: 10px 0 5px;
}
.settings-modal input, .settings-modal select {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
}
.settings-modal button {
    margin-top: 15px;
    padding: 5px 10px;
}
.settings-modal div[style*="text-align:right"] {
    text-align: right;
}
body.dark-mode .settings-modal {
    background: #2f3237;
    color: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.7);
}
body.dark-mode .settings-modal input,
body.dark-mode .settings-modal select {
    background: #3c3f41;
    color: #fff;
    border: 1px solid #555;
}
body.dark-mode .settings-modal button {
    background: #555;
    color: #fff;
    border: none;
}

/* Black Friday mode styling */
.black-friday-active {
    color: #28a745 !important;
}
.black-friday-active .black-friday-icon {
    color: #28a745 !important;
    fill: #28a745 !important;
}
.black-friday-icon {
    color: inherit;
    fill: currentColor;
}
    `;
    $('<style>').prop('type', 'text/css').html(styleBlock).appendTo('head');

    let apiKey = GM_getValue("tornApiKey", "");
    let pricingSource = GM_getValue("pricingSource", "Market Value");
    let itemMarketOffset = GM_getValue("itemMarketOffset", -1);
    let itemMarketMarginType = GM_getValue("itemMarketMarginType", "absolute");
    let itemMarketListing = GM_getValue("itemMarketListing", 1);
    let itemMarketClamp = GM_getValue("itemMarketClamp", false);
    let marketMarginOffset = GM_getValue("marketMarginOffset", 0);
    let marketMarginType = GM_getValue("marketMarginType", "absolute");
    let bazaarCalcMethod = GM_getValue("bazaarCalcMethod", "cheapest");
    let bazaarMarginOffset = GM_getValue("bazaarMarginOffset", 0);
    let bazaarMarginType = GM_getValue("bazaarMarginType", "absolute");
    let bazaarClamp = GM_getValue("bazaarClamp", false);
    let blackFridayMode = GM_getValue("blackFridayMode", false);

    let validPages = ["#/add", "#/manage"];
    let currentPage = window.location.hash;

    let itemMarketCache = {};
    let tornPalCache = {};

    function getItemIdByName(itemName) {
        const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
        for (let [id, info] of Object.entries(storedItems)) {
            if (info.name === itemName) return id;
        }
        return null;
    }

    function getPriceColor(listedPrice, marketValue) {
        if (marketValue <= 0) return ""; // Use default text color
        const ratio = listedPrice / marketValue;
        const lowerBound = 0.998;
        const upperBound = 1.002;

        // Check if we're in dark mode
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (ratio >= lowerBound && ratio <= upperBound) {
            return ""; // Use default text color
        }

        if (ratio < lowerBound) {
            // Price is lower than market value (discount) - use red variants
            let diff = lowerBound - ratio;
            let t = Math.min(diff / 0.05, 1.2);

            if (isDarkMode) {
                // Lighter red for dark mode
                const r = Math.round(255 - t * (255 - 190));
                const g = Math.round(255 - t * (255 - 70));
                const b = Math.round(255 - t * (255 - 70));
                return `rgb(${r},${g},${b})`;
            } else {
                // Darker red for light mode
                const r = Math.round(180 - t * 40);
                const g = Math.round(60 - t * 40);
                const b = Math.round(60 - t * 40);
                return `rgb(${r},${g},${b})`;
            }
        } else {
            // Price is higher than market value (premium) - use green variants
            let diff = ratio - upperBound;
            let t = Math.min(diff / 0.05, 1.2);

            if (isDarkMode) {
                // Lighter green for dark mode
                const r = Math.round(255 - t * (255 - 70));
                const g = Math.round(255 - t * (255 - 190));
                const b = Math.round(255 - t * (255 - 70));
                return `rgb(${r},${g},${b})`;
            } else {
                // Darker green for light mode
                const r = Math.round(60 - t * 40);
                const g = Math.round(160 - t * 40);
                const b = Math.round(60 - t * 40);
                return `rgb(${r},${g},${b})`;
            }
        }
    }

    async function fetchItemMarketData(itemId) {
        if (!apiKey) {
            console.error("No API key set for Item Market calls.");
            alert("No API key set. Please set your Torn API key in Bazaar Filler Settings before continuing.");
            return null;
        }
        const now = Date.now();
        if (itemMarketCache[itemId] && (now - itemMarketCache[itemId].time < 30000)) {
            return itemMarketCache[itemId].data;
        }
        const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?comment=wBazaarFiller`;
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': 'ApiKey ' + apiKey }
            });
            const data = await res.json();
            if (data.error) {
                console.error("Item Market API error:", data.error);
                alert("Item Market API error: " + data.error.error);
                return null;
            }
            itemMarketCache[itemId] = { time: now, data };
            return data;
        } catch (err) {
            console.error("Failed fetching Item Market data:", err);
            alert("Failed to fetch Item Market data. Check your API key or try again later.");
            return null;
        }
    }

    async function fetchTornPalData() {
        const now = Date.now();
        if (tornPalCache.data && now - tornPalCache.time < 60000) {
            return tornPalCache.data;
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://tornpal.com/api/v1/markets/allprices?comment=wBazaarFiller",
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        tornPalCache = { time: now, data };
                        resolve(data);
                    } catch (err) {
                        console.error("Parsing error:", err);
                        reject(err);
                    }
                },
                onerror: function(err) {
                    console.error("Failed fetching TornPal data:", err);
                    reject(err);
                }
            });
        });
    }

    function updatePriceFieldColor($priceInput) {
        let $row = $priceInput.closest("li.clearfix");
        let itemName = $row.length ? $row.find(".name-wrap span.t-overflow").text().trim() : "";
        if (!$row.length) {
            $row = $priceInput.closest(".item___jLJcf");
            itemName = $row.length ? $row.find(".desc___VJSNQ b").text().trim() : "";
        }
        if (!itemName) return;
        const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
        const matchedItem = Object.values(storedItems).find(i => i.name === itemName);
        if (!matchedItem || !matchedItem.market_value) return;
        let raw = $priceInput.val().replace(/,/g, "");
        let typedPrice = Number(raw);
        if (isNaN(typedPrice)) {
            $priceInput.css("color", "");
            return;
        }
        $priceInput.css("color", getPriceColor(typedPrice, Number(matchedItem.market_value)));
    }

    function attachPriceFieldObservers() {
        $(".price input").each(function() {
            if ($(this).data("listenerAttached")) return;
            $(this).on("input", function() {
                updatePriceFieldColor($(this));
            });
            $(this).data("listenerAttached", true);
            updatePriceFieldColor($(this));
        });
        $(".price___DoKP7 .input-money-group.success input.input-money").each(function() {
            if ($(this).data("listenerAttached")) return;
            $(this).on("input", function() {
                updatePriceFieldColor($(this));
            });
            $(this).data("listenerAttached", true);
            updatePriceFieldColor($(this));
        });
        $("[class*=bottomMobileMenu___] [class*=priceMobile___] .input-money-group.success input.input-money").each(function() {
            if ($(this).data("listenerAttached")) return;
            $(this).on("input", function() {
                updatePriceFieldColor($(this));
            });
            $(this).data("listenerAttached", true);
            updatePriceFieldColor($(this));
        });
    }

    async function updateAddRow($row, isChecked) {
        const $qtyInput = $row.find(".amount input").first();
        const $priceInput = $row.find(".price input").first();
        const $choiceCheckbox = $row.find("div.amount.choice-container input");
        if (!isChecked) {
            if ($choiceCheckbox.length && $choiceCheckbox.prop("checked")) {
                $choiceCheckbox.click();
            }
            if ($qtyInput.data("orig") !== undefined) {
                $qtyInput.val($qtyInput.data("orig"));
                $qtyInput.removeData("orig");
            } else {
                $qtyInput.val("");
            }
            $qtyInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            if ($priceInput.data("orig") !== undefined) {
                $priceInput.val($priceInput.data("orig"));
                $priceInput.removeData("orig");
                $priceInput.css("color", "");
            } else {
                $priceInput.val("");
            }
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            return;
        }
        if (!$qtyInput.data("orig")) $qtyInput.data("orig", $qtyInput.val());
        if (!$priceInput.data("orig")) $priceInput.data("orig", $priceInput.val());

        if (blackFridayMode) {
            if ($choiceCheckbox.length) {
                if (!$choiceCheckbox.prop("checked")) { $choiceCheckbox.click(); }
            } else {
                let qty = $row.find(".item-amount.qty").text().trim();
                $qtyInput.val(qty);
                $qtyInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            }
            $priceInput.val("1");
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            return;
        }

        const itemName = $row.find(".name-wrap span.t-overflow").text().trim();
        const itemId = getItemIdByName(itemName);
        const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
        const matchedItem = Object.values(storedItems).find(i => i.name === itemName);

        if ($choiceCheckbox.length) {
            if (!$choiceCheckbox.prop("checked")) { $choiceCheckbox.click(); }
        } else {
            let qty = $row.find(".item-amount.qty").text().trim();
            $qtyInput.val(qty);
            $qtyInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
        }

        if (pricingSource === "Market Value" && matchedItem) {
            let mv = Number(matchedItem.market_value);
            let finalPrice = mv;
            if (marketMarginType === "absolute") {
                finalPrice += marketMarginOffset;
            } else if (marketMarginType === "percentage") {
                finalPrice = Math.round(mv * (1 + marketMarginOffset / 100));
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            $priceInput.css("color", getPriceColor(finalPrice, mv));
        }
        else if (pricingSource === "Item Market" && itemId) {
            const data = await fetchItemMarketData(itemId);
            if (!data || !data.itemmarket?.listings?.length) return;
            let listings = data.itemmarket.listings;
            const $checkbox = $row.find(".checkbox-wrapper input.item-toggle").first();
            const listingsText = listings.slice(0, 5)
                .map((x, i) => `${i + 1}) $${x.price.toLocaleString()} x${x.amount}`)
                .join('\n');
            $checkbox.attr("title", listingsText);
            setTimeout(() => { $checkbox.removeAttr("title"); }, 30000);
            let baseIndex = Math.min(itemMarketListing - 1, listings.length - 1);
            let listingPrice = listings[baseIndex].price;
            let finalPrice;
            if (itemMarketMarginType === "absolute") {
                finalPrice = listingPrice + Number(itemMarketOffset);
            } else if (itemMarketMarginType === "percentage") {
                finalPrice = Math.round(listingPrice * (1 + Number(itemMarketOffset) / 100));
            }
            if (itemMarketClamp && matchedItem && matchedItem.market_value) {
                finalPrice = Math.max(finalPrice, Number(matchedItem.market_value));
            }
            if (!$choiceCheckbox.length) {
                let qty = $row.find(".item-amount.qty").text().trim();
                $qtyInput.val(qty);
                $qtyInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            } else {
                if (!$choiceCheckbox.prop("checked")) { $choiceCheckbox.click(); }
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            if (matchedItem && matchedItem.market_value) {
                let marketVal = Number(matchedItem.market_value);
                $priceInput.css("color", getPriceColor(finalPrice, marketVal));
            }
        }
        else if (pricingSource === "Bazaars/TornPal") {
            const data = await fetchTornPalData();
            if (!data || !data.items) return;
            if (!matchedItem) return;
            const tornPalItem = Object.values(data.items).find(item => item.name === itemName);
            if (!tornPalItem) return;
            let basePrice;
            if (bazaarCalcMethod === "cheapest") {
                basePrice = tornPalItem.bazaar_cheapest;
            } else {
                basePrice = tornPalItem.bazaar_weighted_average_5;
            }
            let finalPrice;
            if (bazaarMarginType === "absolute") {
                finalPrice = basePrice + bazaarMarginOffset;
            } else if (bazaarMarginType === "percentage") {
                finalPrice = Math.round(basePrice * (1 + bazaarMarginOffset / 100));
            }
            if (bazaarClamp && matchedItem.market_value) {
                finalPrice = Math.max(finalPrice, Number(matchedItem.market_value));
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            $priceInput.css("color", getPriceColor(finalPrice, Number(matchedItem.market_value)));
        }
    }

    async function updateManageRow($row, isChecked) {
        const $priceInput = $row.find(".price___DoKP7 .input-money-group.success input.input-money").first();
        if (!isChecked) {
            if ($priceInput.data("orig") !== undefined) {
                $priceInput.val($priceInput.data("orig"));
                $priceInput.removeData("orig");
                $priceInput.css("color", "");
            } else {
                $priceInput.val("");
            }
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }
        if (!$priceInput.data("orig")) $priceInput.data("orig", $priceInput.val());

        if (blackFridayMode) {
            $priceInput.val("1");
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }

        const itemName = $row.find(".desc___VJSNQ b").text().trim();
        const itemId = getItemIdByName(itemName);
        const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
        const matchedItem = Object.values(storedItems).find(i => i.name === itemName);

        if (pricingSource === "Market Value" && matchedItem) {
            let mv = Number(matchedItem.market_value);
            let finalPrice = mv;
            if (marketMarginType === "absolute") {
                finalPrice += marketMarginOffset;
            } else if (marketMarginType === "percentage") {
                finalPrice = Math.round(mv * (1 + marketMarginOffset / 100));
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput.css("color", getPriceColor(finalPrice, mv));
        }
        else if (pricingSource === "Item Market" && itemId) {
            const data = await fetchItemMarketData(itemId);
            if (!data || !data.itemmarket?.listings?.length) return;
            let listings = data.itemmarket.listings;
            const $checkbox = $row.find(".checkbox-wrapper input.item-toggle").first();
            const listingsText = listings.slice(0, 5)
                .map((x, i) => `${i + 1}) $${x.price.toLocaleString()} x${x.amount}`)
                .join('\n');
            $checkbox.attr("title", listingsText);
            setTimeout(() => { $checkbox.removeAttr("title"); }, 30000);
            let baseIndex = Math.min(itemMarketListing - 1, listings.length - 1);
            let listingPrice = listings[baseIndex].price;
            let finalPrice;
            if (itemMarketMarginType === "absolute") {
                finalPrice = listingPrice + Number(itemMarketOffset);
            } else if (itemMarketMarginType === "percentage") {
                finalPrice = Math.round(listingPrice * (1 + Number(itemMarketOffset) / 100));
            }
            if (itemMarketClamp && matchedItem && matchedItem.market_value) {
                finalPrice = Math.max(finalPrice, Number(matchedItem.market_value));
            }
            $priceInput.val(finalPrice.toLocaleString("en-US"));
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            if (matchedItem && matchedItem.market_value) {
                let marketVal = Number(matchedItem.market_value);
                $priceInput.css("color", getPriceColor(finalPrice, marketVal));
            }
        }
        else if (pricingSource === "Bazaars/TornPal") {
            const data = await fetchTornPalData();
            if (!data || !data.items) return;
            if (!matchedItem) return;
            const tornPalItem = Object.values(data.items).find(item => item.name === itemName);
            if (!tornPalItem) return;
            let basePrice;
            if (bazaarCalcMethod === "cheapest") {
                basePrice = tornPalItem.bazaar_cheapest;
            } else {
                basePrice = tornPalItem.bazaar_weighted_average_5;
            }
            let finalPrice;
            if (bazaarMarginType === "absolute") {
                finalPrice = basePrice + bazaarMarginOffset;
            } else if (bazaarMarginType === "percentage") {
                finalPrice = Math.round(basePrice * (1 + bazaarMarginOffset / 100));
            }
            if (bazaarClamp && matchedItem.market_value) {
                finalPrice = Math.max(finalPrice, Number(matchedItem.market_value));
            }
            $priceInput.val(finalPrice.toLocaleString("en-US"));
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            if (matchedItem && matchedItem.market_value) {
                let marketVal = Number(matchedItem.market_value);
                $priceInput.css("color", getPriceColor(finalPrice, marketVal));
            }
        }
    }

    async function updateManageRowMobile($row, isChecked) {
        const $priceInput = $row.find("[class*=bottomMobileMenu___] [class*=priceMobile___] .input-money-group.success input.input-money").first();
        if (!$priceInput.length) {
            console.error("Mobile price field not found.");
            return;
        }
        if (!isChecked) {
            if ($priceInput.data("orig") !== undefined) {
                $priceInput.val($priceInput.data("orig"));
                $priceInput.removeData("orig");
                $priceInput.css("color", "");
            } else {
                $priceInput.val("");
            }
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }
        if (!$priceInput.data("orig")) $priceInput.data("orig", $priceInput.val());

        if (blackFridayMode) {
            $priceInput.val("1");
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }

        const itemName = $row.find(".desc___VJSNQ b").text().trim();
        const itemId = getItemIdByName(itemName);
        const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
        const matchedItem = Object.values(storedItems).find(i => i.name === itemName);
        if (pricingSource === "Market Value" && matchedItem) {
            let mv = Number(matchedItem.market_value);
            let finalPrice = mv;
            if (marketMarginType === "absolute") {
                finalPrice += marketMarginOffset;
            } else if (marketMarginType === "percentage") {
                finalPrice = Math.round(mv * (1 + marketMarginOffset / 100));
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            $priceInput.css("color", getPriceColor(finalPrice, mv));
        }
        else if (pricingSource === "Item Market" && itemId) {
            const data = await fetchItemMarketData(itemId);
            if (!data || !data.itemmarket?.listings?.length) return;
            let listings = data.itemmarket.listings;
            let baseIndex = Math.min(itemMarketListing - 1, listings.length - 1);
            let listingPrice = listings[baseIndex].price;
            let finalPrice;
            if (itemMarketMarginType === "absolute") {
                finalPrice = listingPrice + Number(itemMarketOffset);
            } else if (itemMarketMarginType === "percentage") {
                finalPrice = Math.round(listingPrice * (1 + Number(itemMarketOffset) / 100));
            }
            if (itemMarketClamp && matchedItem && matchedItem.market_value) {
                finalPrice = Math.max(finalPrice, Number(matchedItem.market_value));
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            if (matchedItem && matchedItem.market_value) {
                let marketVal = Number(matchedItem.market_value);
                $priceInput.css("color", getPriceColor(finalPrice, marketVal));
            }
        }
        else if (pricingSource === "Bazaars/TornPal") {
            const data = await fetchTornPalData();
            if (!data || !data.items) return;
            if (!matchedItem) return;
            const tornPalItem = Object.values(data.items).find(item => item.name === itemName);
            if (!tornPalItem) return;
            let basePrice;
            if (bazaarCalcMethod === "cheapest") {
                basePrice = tornPalItem.bazaar_cheapest;
            } else {
                basePrice = tornPalItem.bazaar_weighted_average_5;
            }
            let finalPrice;
            if (bazaarMarginType === "absolute") {
                finalPrice = basePrice + bazaarMarginOffset;
            } else if (bazaarMarginType === "percentage") {
                finalPrice = Math.round(basePrice * (1 + bazaarMarginOffset / 100));
            }
            if (bazaarClamp && matchedItem.market_value) {
                finalPrice = Math.max(finalPrice, Number(matchedItem.market_value));
            }
            $priceInput.val(finalPrice.toLocaleString());
            $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
            if (matchedItem && matchedItem.market_value) {
                let marketVal = Number(matchedItem.market_value);
                $priceInput.css("color", getPriceColor(finalPrice, marketVal));
            }
        }
    }

    function openSettingsModal() {
        $('.settings-modal-overlay').remove();
        const $overlay = $('<div class="settings-modal-overlay"></div>');
        const $modal = $(`
            <div class="settings-modal" style="width:400px; max-width:90%; font-family:Arial, sans-serif;">
                <h2 style="margin-bottom:6px;">Bazaar Filler Settings</h2>
                <hr style="border-top:1px solid #ccc; margin:8px 0;">
                <div style="margin-bottom:15px;">
                    <label for="api-key-input" style="font-weight:bold; display:block;">Torn API Key</label>
                    <input id="api-key-input" type="text" placeholder="Enter API key" style="width:100%; padding:6px; box-sizing:border-box;" value="${apiKey || ''}">
                </div>
                <hr style="border-top:1px solid #ccc; margin:8px 0;">
                <div style="margin-bottom:15px;">
                    <label for="pricing-source-select" style="font-weight:bold; display:block;">Pricing Source</label>
                    <select id="pricing-source-select" style="width:100%; padding:6px; box-sizing:border-box;">
                        <option value="Market Value">Market Value</option>
                        <option value="Bazaars/TornPal">Bazaars/TornPal</option>
                        <option value="Item Market">Item Market</option>
                    </select>
                </div>
                <div id="market-value-options" style="display:none; margin-bottom:15px;">
                    <hr style="border-top:1px solid #ccc; margin:8px 0;">
                    <h3 style="margin:0 0 10px 0; font-size:1em; font-weight:bold;">Market Value Options</h3>
                    <div style="margin-bottom:10px;">
                        <label for="market-margin-offset" style="display:block;">Margin (ie: -1 is either $1 less or 1% less depending on margin type)</label>
                        <input id="market-margin-offset" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${marketMarginOffset}">
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="market-margin-type" style="display:block;">Margin Type</label>
                        <select id="market-margin-type" style="width:100%; padding:6px; box-sizing:border-box;">
                            <option value="absolute">Absolute ($)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                </div>
                <div id="item-market-options" style="display:none; margin-bottom:15px;">
                    <hr style="border-top:1px solid #ccc; margin:8px 0;">
                    <h3 style="margin:0 0 10px 0; font-size:1em; font-weight:bold;">Item Market Options</h3>
                    <div style="margin-bottom:10px;">
                        <label for="item-market-listing" style="display:block;">Listing Index (1 = lowest, 2 = 2nd lowest, etc)</label>
                        <input id="item-market-listing" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${itemMarketListing}">
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="item-market-offset" style="display:block;">Margin (ie: -1 is either $1 less or 1% less depending on margin type)</label>
                        <input id="item-market-offset" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${itemMarketOffset}">
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="item-market-margin-type" style="display:block;">Margin Type</label>
                        <select id="item-market-margin-type" style="width:100%; padding:6px; box-sizing:border-box;">
                            <option value="absolute">Absolute ($)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                    <div style="display:inline-flex; align-items:center; margin-bottom:5px;">
                        <input id="item-market-clamp" type="checkbox" style="margin-right:5px;" ${itemMarketClamp ? "checked" : ""}>
                        <label for="item-market-clamp" style="margin:0; cursor:pointer;">Clamp minimum price to Market Value</label>
                    </div>
                </div>
                <div id="tornpal-options" style="display:none; margin-bottom:15px;">
                    <hr style="border-top:1px solid #ccc; margin:8px 0;">
                    <h3 style="margin:0 0 10px 0; font-size:1em; font-weight:bold;">TornPal Options</h3>
                    <div style="margin-bottom:10px;">
                        <label for="tornpal-calc-method" style="display:block;">Calculation Method</label>
                        <select id="tornpal-calc-method" style="width:100%; padding:6px; box-sizing:border-box;">
                            <option value="cheapest">Cheapest</option>
                            <option value="average">Average</option>
                        </select>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="tornpal-margin-offset" style="display:block;">Margin (e.g., -1 for $1 less or 1% less)</label>
                        <input id="tornpal-margin-offset" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${bazaarMarginOffset}">
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="tornpal-margin-type" style="display:block;">Margin Type</label>
                        <select id="tornpal-margin-type" style="width:100%; padding:6px; box-sizing:border-box;">
                            <option value="absolute">Absolute ($)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                    <div style="display:inline-flex; align-items:center; margin-bottom:5px;">
                        <input id="tornpal-clamp" type="checkbox" style="margin-right:5px;" ${bazaarClamp ? "checked" : ""}>
                        <label for="tornpal-clamp" style="margin:0; cursor:pointer;">Clamp minimum price to Market Value</label>
                    </div>
                </div>
                <hr style="border-top:1px solid #ccc; margin:8px 0;">
                <div style="text-align:right;">
                    <button id="settings-save" style="margin-right:8px; padding:6px 10px; cursor:pointer;">Save</button>
                    <button id="settings-cancel" style="padding:6px 10px; cursor:pointer;">Cancel</button>
                </div>
            </div>
        `);
        $overlay.append($modal);
        $('body').append($overlay);
        $('#pricing-source-select').val(pricingSource);
        $('#item-market-margin-type').val(itemMarketMarginType);
        $('#market-margin-type').val(marketMarginType);
        $('#tornpal-calc-method').val(bazaarCalcMethod);
        $('#tornpal-margin-type').val(bazaarMarginType);
        function toggleFields() {
            let src = $('#pricing-source-select').val();
            $('#market-value-options').toggle(src === 'Market Value');
            $('#item-market-options').toggle(src === 'Item Market');
            $('#tornpal-options').toggle(src === 'Bazaars/TornPal');
        }
        $('#pricing-source-select').change(toggleFields);
        toggleFields();
        $('#settings-save').click(function() {
            const oldPricingSource = pricingSource;
            apiKey = $('#api-key-input').val().trim();
            pricingSource = $('#pricing-source-select').val();

            // Clear caches when pricing source changes to prevent stale data issues
            if (oldPricingSource !== pricingSource) {
                itemMarketCache = {};
                tornPalCache = {};
            }

            if (pricingSource === "Bazaars/TornPal") {
                bazaarCalcMethod = $('#tornpal-calc-method').val();
                bazaarMarginOffset = Number($('#tornpal-margin-offset').val() || 0);
                bazaarMarginType = $('#tornpal-margin-type').val();
                bazaarClamp = $('#tornpal-clamp').is(':checked');
                GM_setValue("bazaarCalcMethod", bazaarCalcMethod);
                GM_setValue("bazaarMarginOffset", bazaarMarginOffset);
                GM_setValue("bazaarMarginType", bazaarMarginType);
                GM_setValue("bazaarClamp", bazaarClamp);
            }
            if (pricingSource === "Market Value") {
                marketMarginOffset = Number($('#market-margin-offset').val() || 0);
                marketMarginType = $('#market-margin-type').val();
                GM_setValue("marketMarginOffset", marketMarginOffset);
                GM_setValue("marketMarginType", marketMarginType);
            }
            if (pricingSource === "Item Market") {
                itemMarketListing = Number($('#item-market-listing').val() || 1);
                itemMarketOffset = Number($('#item-market-offset').val() || -1);
                itemMarketMarginType = $('#item-market-margin-type').val();
                itemMarketClamp = $('#item-market-clamp').is(':checked');
                GM_setValue("itemMarketListing", itemMarketListing);
                GM_setValue("itemMarketOffset", itemMarketOffset);
                GM_setValue("itemMarketMarginType", itemMarketMarginType);
                GM_setValue("itemMarketClamp", itemMarketClamp);
            }
            GM_setValue("tornApiKey", apiKey);
            GM_setValue("pricingSource", pricingSource);
            $overlay.remove();
        });
        $('#settings-cancel').click(() => $overlay.remove());
    }

    function addBlackFridayToggle() {
        if (document.getElementById('black-friday-toggle')) return;
        let linksContainer = document.querySelector('.linksContainer___LiOTN');
        if (!linksContainer) return;

        let link = document.createElement('a');
        link.id = 'black-friday-toggle';
        link.href = '#';
        link.className = 'linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9';
        if (blackFridayMode) {
            link.classList.add('black-friday-active');
        }
        link.target = '_self';
        link.rel = 'noreferrer';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV';
        iconSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="black-friday-icon" style="color: ${blackFridayMode ? '#28a745' : 'inherit'}; fill: ${blackFridayMode ? '#28a745' : 'currentColor'};">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
            </svg>
        `;
        link.appendChild(iconSpan);

        const textSpan = document.createElement('span');
        textSpan.className = 'linkTitle____NPyM';
        textSpan.textContent = blackFridayMode ? 'Black Friday: ON' : 'Black Friday: OFF';
        link.appendChild(textSpan);

        link.addEventListener('click', function(e) {
            e.preventDefault();
            blackFridayMode = !blackFridayMode;
            GM_setValue("blackFridayMode", blackFridayMode);
            textSpan.textContent = blackFridayMode ? 'Black Friday: ON' : 'Black Friday: OFF';

            // Update SVG color directly
            const svg = this.querySelector('.black-friday-icon');
            if (svg) {
                svg.style.color = blackFridayMode ? '#28a745' : 'inherit';
                svg.style.fill = blackFridayMode ? '#28a745' : 'currentColor';
            }

            if (blackFridayMode) {
                link.classList.add('black-friday-active');
            } else {
                link.classList.remove('black-friday-active');
            }
        });

        let settingsButton = document.getElementById('pricing-source-button');
        if (settingsButton) {
            linksContainer.insertBefore(link, settingsButton);
        } else {
            linksContainer.insertBefore(link, linksContainer.firstChild);
        }
    }

    function addPricingSourceLink() {
        if (document.getElementById('pricing-source-button')) return;
        let linksContainer = document.querySelector('.linksContainer___LiOTN');
        if (!linksContainer) return;
        let link = document.createElement('a');
        link.id = 'pricing-source-button';
        link.href = '#';
        link.className = 'linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9';
        link.target = '_self';
        link.rel = 'noreferrer';
        const iconSpan = document.createElement('span');
        iconSpan.className = 'iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV';
        iconSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 1 0 6.492 3.246 3.246 0 0 1 0-6.492zM5.754 8a2.246 2.246 0 1 0 4.492 0 2.246 2.246 0 0 0-4.492 0z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.433 2.54 2.54l.292-.16a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.433-.902 2.54-2.541l-.16-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.54-2.54l-.292.16a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.416 1.6.42 1.184 1.185l-.16.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.318.094a1.873 1.873 0 0 0-1.116 2.692l.16.292c.416.764-.42 1.6-1.185 1.184l-.291-.16a1.873 1.873 0 0 0-1.116-2.692l-.318-.094c-.835-.246-.835-1.428 0-1.674l.318-.094a1.873 1.873 0 0 0 1.116-2.692l-.16-.292c-.416-.764.42-1.6 1.185-1.184l.292.16a1.873 1.873 0 0 0 2.693-1.115l.094-.318z"/>
            </svg>
        `;
        link.appendChild(iconSpan);
        const textSpan = document.createElement('span');
        textSpan.className = 'linkTitle____NPyM';
        textSpan.textContent = 'Bazaar Filler Settings';
        link.appendChild(textSpan);
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openSettingsModal();
        });
        linksContainer.insertBefore(link, linksContainer.firstChild);
    }

    function addAddPageCheckboxes() {
        $(".items-cont .title-wrap").each(function () {
            if ($(this).find(".checkbox-wrapper").length) return;
            $(this).css("position", "relative");
            const wrapper = $('<div class="checkbox-wrapper"></div>');
            const checkbox = $('<input>', {
                type: "checkbox",
                class: "item-toggle",
                click: async function (e) {
                    e.stopPropagation();
                    if (!GM_getValue("tornApiKey", "")) {
                        alert("No Torn API key set. Please click the 'Bazaar Filler Settings' button to enter your API key.");
                        $(this).prop("checked", false);
                        openSettingsModal();
                        return;
                    }
                    await updateAddRow($(this).closest("li.clearfix"), this.checked);
                }
            });
            wrapper.append(checkbox);
            $(this).append(wrapper);
        });
        $(document).off("dblclick", ".amount input").on("dblclick", ".amount input", function () {
            const $row = $(this).closest("li.clearfix");
            const qty = $row.find(".item-amount.qty").text().trim();
            if (qty) {
                $(this).val(qty);
                $(this)[0].dispatchEvent(new Event("input", { bubbles: true }));
                $(this)[0].dispatchEvent(new Event("keyup", { bubbles: true }));
            }
        });
    }

    function addManagePageCheckboxes() {
        $(".item___jLJcf").each(function() {
            const $desc = $(this).find(".desc___VJSNQ");
            if (!$desc.length || $desc.find(".checkbox-wrapper").length) return;
            $desc.css("position", "relative");
            const wrapper = $('<div class="checkbox-wrapper"></div>');
            const checkbox = $('<input>', {
                type: "checkbox",
                class: "item-toggle",
                click: async function(e) {
                    e.stopPropagation();
                    if (!GM_getValue("tornApiKey", "")) {
                        alert("No Torn API key set. Please click the 'Bazaar Filler Settings' button to enter your API key.");
                        $(this).prop("checked", false);
                        openSettingsModal();
                        return;
                    }
                    const $row = $(this).closest(".item___jLJcf");
                    if (window.innerWidth <= 784) {
                        const $manageBtn = $row.find('button[aria-label="Manage"]').first();
                        if ($manageBtn.length) {
                            if (!$manageBtn.find('span').hasClass('active___OTFsm')) {
                                $manageBtn.click();
                            }
                            setTimeout(async () => {
                                await updateManageRowMobile($row, this.checked);
                            }, 200);
                            return;
                        }
                    }
                    await updateManageRow($row, this.checked);
                }
            });
            wrapper.append(checkbox);
            $desc.append(wrapper);
        });
    }

    const storedItems = localStorage.getItem("tornItems");
    const lastUpdatedTime = GM_getValue("lastUpdatedTime", 0);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const lastUpdatedDate = new Date(lastUpdatedTime);
    const todayUTC = new Date().toISOString().split('T')[0];
    const lastUpdatedUTC = lastUpdatedDate.toISOString().split('T')[0];

    if (apiKey && (!storedItems || lastUpdatedUTC < todayUTC || (now - lastUpdatedTime) >= oneDayMs)) {
        fetch(`https://api.torn.com/torn/?key=${apiKey}&selections=items&comment=wBazaarFiller`)
            .then(r => r.json())
            .then(data => {
                if (!data.items) {
                    console.error("Failed to fetch Torn items or no items found. Possibly invalid API key or rate limit.");
                    return;
                }
                let filtered = {};
                for (let [id, item] of Object.entries(data.items)) {
                    if (item.tradeable) {
                        filtered[id] = {
                            name: item.name,
                            market_value: item.market_value
                        };
                    }
                }
                localStorage.setItem("tornItems", JSON.stringify(filtered));
                GM_setValue("lastUpdatedTime", now);
            })
            .catch(err => {
                console.error("Error fetching Torn items:", err);
            });
    }

    const domObserver = new MutationObserver(() => {
        if (window.location.hash === "#/add") {
            addAddPageCheckboxes();
        } else if (window.location.hash === "#/manage") {
            addManagePageCheckboxes();
        }
        addPricingSourceLink();
        addBlackFridayToggle();
        attachPriceFieldObservers();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('hashchange', () => {
        currentPage = window.location.hash;
        if (currentPage === "#/add") {
            addAddPageCheckboxes();
        } else if (currentPage === "#/manage") {
            addManagePageCheckboxes();
        }
        addPricingSourceLink();
        addBlackFridayToggle();
        attachPriceFieldObservers();
    });

    if (currentPage === "#/add") {
        addAddPageCheckboxes();
    } else if (currentPage === "#/manage") {
        addManagePageCheckboxes();
    }
    addPricingSourceLink();
    addBlackFridayToggle();
    attachPriceFieldObservers();

    $(document).on("click", "button.undo___FTgvP", function(e) {
        e.preventDefault();
        $(".item___jLJcf .checkbox-wrapper input.item-toggle:checked").each(function() {
            $(this).prop("checked", false);
            const $row = $(this).closest(".item___jLJcf");
            updateManageRow($row, false);
        });
    });

    $(document).on("click", ".clear-action", function(e) {
        e.preventDefault();
        $("li.clearfix .checkbox-wrapper input.item-toggle:checked").each(function() {
            $(this).prop("checked", false);
            const $row = $(this).closest("li.clearfix");
            updateAddRow($row, false);
        });
    });

    // Add this after all the variable initializations at the beginning of the script
    $(document).ready(function() {
        // Clear caches on initial load to prevent stale data
        itemMarketCache = {};
        tornPalCache = {};
    });
})();
