// ==UserScript==
// @name         IdlePixel Market Overhaul
// @namespace    com.anwinity.idlepixel
// @version      1.0.17
// @description  Overhaul of market UI and functionality.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/451130/IdlePixel%20Market%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/451130/IdlePixel%20Market%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const XP_PER = {
        stone: 0.1,
        copper: 1,
        iron: 5,
        silver: 10,
        gold: 20,
        promethium: 100,
        titanium: 300,

        bronze_bar: 5,
        iron_bar: 25,
        silver_bar: 50,
        gold_bar: 100,
        promethium_bar: 500,
        titanium_bar: 2000
    };

    const BONEMEAL_PER = {
        bones: 1,
        big_bones: 2,
        ice_bones: 3,
        ashes: 2
    };

    class MarketPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("market", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "condensed",
                        label: "Condensed UI",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "sortMethod",
                        label: "Sort Method",
                        type: "select",
                        default: "default",
                        options: [
                            {value: "default", label: "Default"},
                            {value: "timeDESC", label: "Time (Newest First)"},
                            {value: "timeASC", label: "Time (Newest Last)"},
                            {value: "priceASC", label: "Price (Cheapest First)"},
                            {value: "priceDESC", label: "Price (Cheapest Last)"},
                        ]
                    },
                    {
                        id: "highlightBest",
                        label: "Highlight Best",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "autoMax",
                        label: "Autofill Max Buy",
                        type: "boolean",
                        default: false
                    },
                ]
            });
            this.lastBrowsedItem = "all";
            this.lastCategoryFilter = "all";
        }

        onConfigsChanged() {
            this.applyCondensed(this.getConfig("condensed"));
        }

        applyCondensed(condensed) {
            if(condensed) {
                $("#panel-player-market").addClass("condensed");
                $("#modal-market-select-item").addClass("condensed");
            }
            else {
                $("#panel-player-market").removeClass("condensed");
                $("#modal-market-select-item").removeClass("condensed");
            }
        }

        onLogin() {
            const self = this;

            $("head").append(`
            <style id="styles-market">

              #market-table {
                  margin-top: 0.5em !important;
              }
              #market-table tr.cheaper {
                  background-color: rgb(50, 205, 50, 0.25);
              }
              #market-table tr.cheaper > td {
                  background-color: rgb(50, 205, 50, 0.25);
              }
              #panel-player-market.condensed > center {
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
              }
              #panel-player-market.condensed div.player-market-slot-base {
              	  height: 400px;
              }
              #panel-player-market.condensed div.player-market-slot-base hr {
                  margin-top: 2px;
                  margin-bottom: 4px;
              }
              #panel-player-market.condensed div.player-market-slot-base br + #panel-player-market.condensed div.player-market-slot-base br {
                  display: none;
              }
              #panel-player-market.condensed div.player-market-slot-base[id^="player-market-slot-occupied"] button {
                  padding: 2px;
              }

              #panel-player-market.condensed #market-table th {
              	padding: 2px 4px;
              }

              #panel-player-market.condensed #market-table td {
              	padding: 2px 4px;
              }

              #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory {
                margin: 6px 6px;
                padding: 6px 6px;
              }

              #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory hr {
                margin-top: 2px;
                margin-bottom: 2px;
              }
              #market-category-filters {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: start;
                flex-wrap: wrap;
                margin: 0.25em;
              }
              #market-category-filters > button {
                display: inline-block;
                margin: 0.25em;
              }
              #market-category-filters > button.active {
                background-color: #74DBDB;
              }

            </style>
            `);
            // modal-market-configure-item-to-sell-amount
            const sellModal = $("#modal-market-configure-item-to-sell");
            const sellAmountInput = sellModal.find("#modal-market-configure-item-to-sell-amount");
            sellAmountInput.after(`
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountSell()">1</button>
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountSell()">max</button>
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountSell(true)">max-1</button>
            `);
            const sellPriceInput = sellModal.find("#modal-market-configure-item-to-sell-price-each").after(`
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyMinPriceSell()">min</button>
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyMidPriceSell()">mid</button>
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxPriceSell()">max</button>
              <br /><br />
              Total: <span id="modal-market-configure-item-to-sell-total"></span>
            `);

            sellAmountInput.on("input change", () => this.applyTotalSell());
            sellPriceInput.on("input change", () => this.applyTotalSell());

            const buyModal = $("#modal-market-purchase-item");
            const buyAmountInput = buyModal.find("#modal-market-purchase-item-amount-input");
            buyAmountInput.after(`
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountBuy()">1</button>
              <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountBuy()">max</button>
              <br /><br />
              Total: <span id="modal-market-purchase-item-total"></span>
              <br />
              Owned: <item-display data-format="number" data-key="coins"></item-display>
            `);
            buyAmountInput.on("input change", () => this.applyTotalBuy());

            // wrap Market.browse_get_table to capture last selected
            const original_market_browse = Market.browse_get_table;
            Market.browse_get_table = function(item) {
                return self.browseGetTable(item)
                    .always(() => {
                        self.filterTable();
                    });
            }

            $("#market-table").css("margin-top", "24px");
            $("#market-table").parent().before(`<div id="market-category-filters"><div>`);

            // wrap Market.load_tradables to populate category filters
            const original_load_tradables = Market.load_tradables;
            Market.load_tradables = function(data) {
                original_load_tradables.apply(this, arguments);
                self.createFilterButtons();
            }
            self.createFilterButtons();

            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`)
                .first()
                .after(`<button id="refresh-market-table-button" type="button" style="margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.refreshMarket(true);">Refresh</button>`);

            //$("button.market-remove-button").after('<br><br><br><button onclick="" class="market-rebrowse-button">Browse</button>');

            this.onConfigsChanged();
        }

        browseGetTable(item) {
            //console.log(`browseGetTable("${item}")`);
            const self = this;
            this.lastBrowsedItem = item;
            if(item != "all") {
                self.lastCategoryFilter = "all";
            }
            if(item == "all") {
                $("#market-category-filters").show();
            }
            else {
                $("#market-category-filters").hide();
            }

            // A good chunk of this is taking directly from Market.browse_get_table
            hide_element("market-table");
            show_element("market-loading");
            let best = {};
            let bestList = {};
            return $.get(`../../market/browse/${item}/`).done(function(data) {
                const xpMultiplier = DonorShop.has_donor_active(IdlePixelPlus.getVar("donor_bonus_xp_timestamp")) ? 1.1 : 1;
                //console.log(data);
                data.forEach(datum => {
                    const priceAfterTax = datum.market_item_price_each * 1.01;
                    switch(datum.market_item_category) {
                        case "bars":
                        case "ores": {
                            let perCoin = (priceAfterTax / (xpMultiplier*XP_PER[datum.market_item_name]));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/xp`;
                            if(!best[datum.market_item_category]) {
                                best[datum.market_item_category] = perCoin;
                                bestList[datum.market_item_category] = [datum];
                            }
                            else {
                                if(perCoin == best[datum.market_item_category]) {
                                    bestList[datum.market_item_category].push(datum);
                                }
                                else if(perCoin < best[datum.market_item_category]) {
                                    bestList[datum.market_item_category] = [datum];
                                    best[datum.market_item_category] = perCoin;
                                }
                            }
                            break;
                        }
                        case "logs": {
                            let perCoin = (priceAfterTax / Cooking.getHeatPerLog(datum.market_item_name));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat`;
                            if(!best[datum.market_item_category]) {
                                best[datum.market_item_category] = perCoin;
                                bestList[datum.market_item_category] = [datum];
                            }
                            else {
                                if(perCoin == best[datum.market_item_category]) {
                                    bestList[datum.market_item_category].push(datum);
                                }
                                else if(perCoin < best[datum.market_item_category]) {
                                    bestList[datum.market_item_category] = [datum];
                                    best[datum.market_item_category] = perCoin;
                                }
                            }
                            break;
                        }
                        case "raw_fish":
                        case "cooked_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy`;
                            if(!best[datum.market_item_category]) {
                                best[datum.market_item_category] = perCoin;
                                bestList[datum.market_item_category] = [datum];
                            }
                            else {
                                if(perCoin == best[datum.market_item_category]) {
                                    bestList[datum.market_item_category].push(datum);
                                }
                                else if(perCoin < best[datum.market_item_category]) {
                                    bestList[datum.market_item_category] = [datum];
                                    best[datum.market_item_category] = perCoin;
                                }
                            }
                            break;
                        }
                        case "bones": {
                            let perCoin = (priceAfterTax / BONEMEAL_PER[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/bonemeal`;
                            if(!best[datum.market_item_category]) {
                                best[datum.market_item_category] = perCoin;
                                bestList[datum.market_item_category] = [datum];
                            }
                            else {
                                if(perCoin == best[datum.market_item_category]) {
                                    bestList[datum.market_item_category].push(datum);
                                }
                                else if(perCoin < best[datum.market_item_category]) {
                                    bestList[datum.market_item_category] = [datum];
                                    best[datum.market_item_category] = perCoin;
                                }
                            }
                            break;
                        }
                        default: {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            break;
                        }
                    }
                });
                Object.values(bestList).forEach(bestCatList => bestCatList.forEach(datum => datum.best=true));
                const sortMethod = self.getConfig("sortMethod");
                switch(sortMethod) {
                    case "timeDESC": {
                        data = data.sort((a, b) => b.market_item_post_timestamp - a.market_item_post_timestamp);
                        break;
                    }
                    case "timeASC": {
                        data = data.sort((a, b) => a.market_item_post_timestamp - b.market_item_post_timestamp);
                        break;
                    }
                    case "priceASC": {
                        data = data.sort((a, b) => {
                            if(a.perCoin != b.perCoin && typeof a.perCoin==="number" && typeof b.perCoin==="number") {
                                return a.perCoin - b.perCoin;
                            }
                            return a.market_item_price_each - b.market_item_price_each;
                        });

                        // DEBUG
                        //data.filter(x => x.market_item_category == "cooked_fish").forEach(d => {
                        //    console.log(`${d.market_item_name} ${d.perCoin} ${d.market_item_price_each}`);
                        //});
                        //

                        break;
                    }
                    case "priceDESC": {
                        data = data.sort((a, b) => {
                            if(a.perCoin != b.perCoin && typeof a.perCoin==="number" && typeof b.perCoin==="number") {
                                return b.perCoin - a.perCoin;
                            }
                            return b.market_item_price_each - a.market_item_price_each;
                        });
                        break;
                    }
                }
                // console.log(data);
                let html = "<tr><th>ITEM</th><th></th><th>AMOUNT</th><th>PRICE EACH</th><th>CATEGORY</th><th>EXPIRES IN</th></tr>";
                // in case you want to add any extra data to the table but still use this script
                if(typeof window.ModifyMarketDataHeader === "function") {
                    html = window.ModifyMarketDataHeader(html);
                }
                data.forEach(datum => {
                    let market_id = datum.market_id;
                    let player_id = datum.player_id;
                    let item_name = datum.market_item_name;
                    let amount = datum.market_item_amount;
                    let price_each = datum.market_item_price_each;
                    let category = datum.market_item_category;
                    let timestamp = datum.market_item_post_timestamp;
                    let perCoinLabel = datum.perCoinLabel;
                    let best = datum.best && self.getConfig("highlightBest");

                    let your_entry = "";
                    if(Items.getItem("player_id") == player_id) {
                        your_entry = "<span class='color-grey font-small'><br /><br />(Your Item)</span>";
                    }

                    let rowHtml = "";
                    rowHtml += `<tr onclick="Modals.market_purchase_item('${market_id}', '${item_name}', '${amount}', '${price_each}'); IdlePixelPlus.plugins.market.applyMaxAmountBuyIfConfigured();" class="hover${ best ? ' cheaper' : '' }">`;
                    rowHtml += `<td>${Items.get_pretty_item_name(item_name)}${your_entry}</td>`;
                    rowHtml += `<td><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${item_name}.png" /></td>`;
                    rowHtml += `<td>${amount}</td>`;
                    rowHtml += `<td><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/coins.png" /> ${Market.get_price_after_tax(price_each)}`;
                    if(perCoinLabel) {
                        rowHtml += `<br /><span style="font-size: 80%; opacity: 0.8">${perCoinLabel}</span>`;
                    }
                    rowHtml += `</td>`;
                    rowHtml += `<td>${category}</td>`;
                    rowHtml += `<td>${Market._get_expire_time(timestamp)}</td>`;
                    rowHtml += `</tr>`;

                    // in case you want to add any extra data to the table but still use this script
                    if(typeof window.ModifyMarketDataRow === "function") {
                        rowHtml = window.ModifyMarketDataRow(datum, rowHtml);
                    }
                    html += rowHtml;
                });

                document.getElementById("market-table").innerHTML = html;
                hide_element("market-loading");
                show_element("market-table");
            });

        }

        createFilterButtons() {
            const filters = $("#market-category-filters");
            filters.empty();
            if(Market.tradables) {
                const categories = [];
                Market.tradables.forEach(tradable => {
                    if(!categories.includes(tradable.category)) {
                        categories.push(tradable.category);
                    }
                });
                filters.append(`<button data-category="all" onclick="IdlePixelPlus.plugins.market.filterTable('all')">All</button>`);
                categories.forEach(cat => {
                    filters.append(`<button data-category="${cat}" onclick="IdlePixelPlus.plugins.market.filterTable('${cat}')">${cat.replace(/_/g, " ").replace(/(^|\s)\w/g, s => s.toUpperCase())}</button>`);
                });
            }
        }

        filterTable(category) {

            if(category) {
                this.lastCategoryFilter = category;
            }
            else {
                category = this.lastCategoryFilter || "all";
            }

            $("#market-category-filters button.active").removeClass("active");
            $(`#market-category-filters button[data-category="${category}"]`).addClass("active");

            const rows = $("#market-table tbody tr.hover");
            if(category=="all") {
                rows.show();
            }
            else {
                rows.each(function() {
                    const row = $(this);
                    const rowCategory = row.find("td:nth-child(5)").text();
                    if(category == rowCategory) {
                        row.show();
                    }
                    else {
                        row.hide();
                    }
                });

            }
        }

        refreshMarket(disableButtonForABit) {
            if(this.lastBrowsedItem) {
                Market.browse_get_table(this.lastBrowsedItem);
                if(disableButtonForABit) { // prevent spam clicking it
                    $("#refresh-market-table-button").prop("disabled", true);
                    setTimeout(() => {
                        $("#refresh-market-table-button").prop("disabled", false);
                    }, 700);
                }
            }
        }

        applyOneAmountBuy() {
            $("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val(1);
            this.applyTotalBuy();
        }

        applyMaxAmountBuyIfConfigured() {
            if(this.getConfig("autoMax")) {
                this.applyMaxAmountBuy();
            }
        }

        applyMaxAmountBuy(minus1=false) {
            const coinsOwned = IdlePixelPlus.getVarOrDefault("coins", 0, "int");
            const price = parseInt($("#modal-market-purchase-item #modal-market-purchase-item-price-each").val().replace(/[^\d]+/g, ""));
            const maxAffordable = Math.floor(coinsOwned / price);
            const maxAvailable = parseInt($("#modal-market-purchase-item #modal-market-purchase-item-amount-left").val().replace(/[^\d]+/g, ""));
            let max = Math.min(maxAffordable, maxAvailable);
            if(minus1) {
                max--;
            }
            if(max < 0) {
                max = 0;
            }
            $("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val(max);
            this.applyTotalBuy();
        }

        parseIntKMBT(s) {
            if(typeof s === "number") {
                return Math.floor(s);
            }
            s = s.toUpperCase().replace(/[^\dKMBT]+/, "");
            if(s.endsWith("K")) {
                s = s.replace(/K$/, "000");
            }
            else if(s.endsWith("M")) {
                s = s.replace(/M$/, "000000");
            }
            else if(s.endsWith("B")) {
                s = s.replace(/B$/, "000000000");
            }
            else if(s.endsWith("T")) {
                s = s.replace(/T$/, "000000000000");
            }
            return parseInt(s);
        }

        applyTotalBuy() {
            const amount = this.parseIntKMBT($("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val());
            const price = this.parseIntKMBT($("#modal-market-purchase-item #modal-market-purchase-item-price-each").val().replace("Price each: ", ""));
            const total = amount*price;
            const totalElement = $("#modal-market-purchase-item-total");
            if(isNaN(total)) {
                totalElement.text("");
            }
            else {
                totalElement.text(total.toLocaleString());
                const coinsOwned = IdlePixelPlus.getVarOrDefault("coins", 0, "int");
                if(total > coinsOwned) {
                    totalElement.css("color", "red");
                }
                else {
                    totalElement.css("color", "");
                }
            }
        }

        currentItemSell() {
            return $("#modal-market-configure-item-to-sell").val();
        }

        applyOneAmountSell() {
            const item = this.currentItemSell();
            const owned = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            $("#modal-market-configure-item-to-sell-amount").val(Math.min(owned, 1));
            this.applyTotalSell();
        }

        applyMaxAmountSell(minus1=false) {
            const item = this.currentItemSell();
            let max = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            if(minus1) {
                max--;
            }
            if(max < 0) {
                max = 0;
            }
            $("#modal-market-configure-item-to-sell-amount").val(max);
            this.applyTotalSell();
        }

        applyMinPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            $("#modal-market-configure-item-to-sell-price-each").val(min);
            this.applyTotalSell();
        }

        applyMidPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            const mid = Math.floor((min+max)/2);
            $("#modal-market-configure-item-to-sell-price-each").val(mid);
            this.applyTotalSell();
        }

        applyMaxPriceSell() {
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            $("#modal-market-configure-item-to-sell-price-each").val(max);
            this.applyTotalSell();
        }

        applyTotalSell() {
            const amount = this.parseIntKMBT($("#modal-market-configure-item-to-sell-amount").val());
            const price = this.parseIntKMBT($("#modal-market-configure-item-to-sell-price-each").val());
            const total = amount*price;
            if(isNaN(total)) {
                $("#modal-market-configure-item-to-sell-total").text("");
            }
            else {
                $("#modal-market-configure-item-to-sell-total").text(total.toLocaleString());
            }
            // TODO total w/ tax
        }

        onVariableSet(key, valueBefore, valueAfter) {

        }

    }

    const plugin = new MarketPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();