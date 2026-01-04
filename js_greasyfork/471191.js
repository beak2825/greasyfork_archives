// ==UserScript==
// @name         Market Overhaul
// @namespace    com.anwinity.idlepixel
// @version      1.1
// @description  Overhaul of market UI and functionality.
// @author       Original Author: Anwinity || Modded By: GodofNades || Modded By: Codex234
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/471191/Market%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/471191/Market%20Overhaul.meta.js
// ==/UserScript==
// Modified - CODEX234

(function() {
    'use strict';
    let marketTimer;
    var marketRunning = false;


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
        titanium_bar: 2000,
        ancient_bar: 5000
    };

    const BONEMEAL_PER = {
        bones: 1,
        big_bones: 2,
        ice_bones: 3,
        ashes: 2,
        blood_bones: 4
    };

    const LEVEL_REQ = {
        // net
        raw_shrimp: "Cooking: 1",
        raw_anchovy: "Cooking: 5",
        raw_sardine: "Cooking: 10",
        raw_crab: "Cooking: 35",
        raw_piranha: "Cooking: 50",

        // rod
        raw_salmon: "Cooking: 10",
        raw_trout: "Cooking: 20",
        raw_pike: "Cooking: 35",
        raw_eel: "Cooking: 55",
        raw_rainbow_fish: "Cooking: 70",

        // harpoon
        raw_tuna: "Cooking: 35",
        raw_swordfish: "Cooking: 50",
        raw_manta_ray: "Cooking: 75",
        raw_shark: "Cooking: 82",
        raw_whale: "Cooking: 90",

        // plant seeds
        dotted_green_leaf_seeds: "Farming: 1<br/>Stop Dying: 15",
        red_mushroom_seeds: "Farming: 1<br/>Cant Die",
        stardust_seeds: "Farming: 8<br/>Cant Die",
        green_leaf_seeds: "Farming: 10<br/>Stop Dying: 25",
        lime_leaf_seeds: "Farming: 25<br/>Stop Dying: 40",
        gold_leaf_seeds: "Farming: 50<br/>Stop Dying: 60",
        crystal_leaf_seeds: "Farming: 70<br/>Stop Dying: 80",

        // tree seeds
        tree_seeds: "Farming: 10<br/>Stop Dying: 25",
        oak_tree_seeds: "Farming: 25<br/>Stop Dying: 40",
        willow_tree_seeds: "Farming: 37<br/>Stop Dying: 55",
        maple_tree_seeds: "Farming: 50<br/>Stop Dying: 65",
        stardust_tree_seeds: "Farming: 65<br/>Stop Dying: 80",
        pine_tree_seeds: "Farming: 70<br/>Stop Dying: 85",
        redwood_tree_seeds: "Farming: 80<br/>Stop Dying: 92",

        // bows
        long_bow: "Archery: 25",

        // melee
        stinger: "Melee: 5 <br /> Invent: 10",
        iron_dagger: "Melee: 10 <br /> Invent: 20",
        skeleton_sword: "Melee: 20 <br /> Invent: 30",
        club: "Melee: 30",
        spiked_club: "Melee: 30",
        scythe: "Melee: 40",
        trident: "Melee: 70",
        rapier: "Melee: 90",

        // other equipment
        bone_amulet: "Invent: 40",

        // armour
        skeleton_shield: "Melee: 20",

        // logs conver rate
        logs: "5% <br/> Convert to Charcoal",
        oak_logs: "10% <br/> Convert to Charcoal",
        willow_logs: "15% <br/> Convert to Charcoal",
        maple_logs: "20% <br/> Convert to Charcoal",
        stardust_logs: "25% <br/> Convert to Charcoal",
        pine_logs: "30% <br/> Convert to Charcoal",
        redwood_logs: "35% <br/> Convert to Charcoal"
    };

    const HEAT_PER = {
        raw_chicken: 10,
        raw_meat: 40,

        // net
        raw_shrimp: 10,
        raw_anchovy: 20,
        raw_sardine: 40,
        raw_crab: 75,
        raw_piranha: 120,

        // rod
        raw_salmon: 20,
        raw_trout: 40,
        raw_pike: 110,
        raw_eel: 280,
        raw_rainbow_fish: 840,

        // harpoon
        raw_tuna: 75,
        raw_swordfish: 220,
        raw_manta_ray: 1200,
        raw_shark: 3000,
        raw_whale: 5000,

        // net (shiny)
        raw_shrimp_shiny: 10,
        raw_anchovy_shiny: 20,
        raw_sardine_shiny: 40,
        raw_crab_shiny: 75,
        raw_piranha_shiny: 120,

        // rod (shiny)
        raw_salmon_shiny: 20,
        raw_trout_shiny: 40,
        raw_pike_shiny: 110,
        raw_eel_shiny: 280,
        raw_rainbow_fish_shiny: 840,

        // harpoon (shiny)
        raw_tuna_shiny: 75,
        raw_swordfish_shiny: 220,
        raw_manta_ray_shiny: 1200,
        raw_shark_shiny: 3000,
        raw_whale_shiny: 5000,

        // net (mega shiny)
        raw_shrimp_mega_shiny: 10,
        raw_anchovy_mega_shiny: 20,
        raw_sardine_mega_shiny: 40,
        raw_crab_mega_shiny: 75,
        raw_piranha_mega_shiny: 120,

        // rod (mega shiny)
        raw_salmon_mega_shiny: 20,
        raw_trout_mega_shiny: 40,
        raw_pike_mega_shiny: 110,
        raw_eel_mega_shiny: 280,
        raw_rainbow_fish_mega_shiny: 840,

        // harpoon (mega shiny)
        raw_tuna_mega_shiny: 75,
        raw_swordfish_mega_shiny: 220,
        raw_manta_ray_mega_shiny: 1200,
        raw_shark_mega_shiny: 3000,
        raw_whale_mega_shiny: 5000,

        //stardust fish
        raw_small_stardust_fish: 300,
        raw_medium_stardust_fish: 600,
        raw_large_stardust_fish: 2000
    }
    const CHARCOAL_PERC = {
        logs: 0.05,
        oak_logs: 0.1,
        willow_logs: 0.15,
        maple_logs: 0.2,
        stardust_logs: 0.25,
        pine_logs: 0.3,
        redwood_logs: 0.35
    }

    class MarketPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("market", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
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
                            {value: "sinf", label: "Single Item (Newest First)"},
                            {value: "sinl", label: "Single Item (Newest Last)"},
                            {value: "sicf", label: "Single Item (Cheapest First)"},
                            {value: "sicl", label: "Single Item (Cheapest Last)"},
                            {value: "timeDESC", label: "Time (Newest First)"},
                            {value: "timeASC", label: "Time (Newest Lat)"},
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
                    {
                        id: "marketSoldNotification",
                        label: "Show a notification when you have items to collect in the market.",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "altIDList",
                        label: "List the player ID of alts you dont want to see in the player market.",
                        type: "string",
                        max: 200000,
                        default: "PlaceIDsHere"
                    },
                ]
            });
            this.lastBrowsedItem = "all";
            this.lastCategoryFilter = "all";
        }

        onConfigsChanged() {
            this.applyCondensed(this.getConfig("condensed"));
            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            } else {
                clearInterval(marketTimer);
                marketRunning = false;
                $("#market-sidecar").hide();
            }
        }

        addMarketNotifications() {
            const sideCar = document.createElement('span');
            sideCar.id = `market-sidecar`;
            sideCar.onclick = function () {
                IdlePixelPlus.plugins.market.collectMarketButton();
            }
            sideCar.style='margin-right: 4px; margin-bottom: 4px; display: none';

            var elem = document.createElement("img");
            elem.setAttribute("src", "https://idlepixel.s3.us-east-2.amazonaws.com/images/player_market.png");
            const sideCarIcon = elem;
            sideCarIcon.className = "w20";

            const sideCarDivLabel = document.createElement('span');
            sideCarDivLabel.id = `market-sidecar-coins`;
            sideCarDivLabel.innerText = ' 0';
            sideCarDivLabel.className = 'color-white'

            sideCar.append("  (", sideCarIcon, sideCarDivLabel, ")")
            document.querySelector('#item-display-coins').after(sideCar)
            $("#market-sidecar").hide()
        };

        collectMarketButton() {
            $("#market-sidecar").hide();
            var collect_one = parseInt($("button#player-market-slot-collect-amount-1").text().replaceAll(/\D/g,''));
            var collect_two = parseInt($("button#player-market-slot-collect-amount-2").text().replaceAll(/\D/g,''));
            var collect_three = parseInt($("button#player-market-slot-collect-amount-3").text().replaceAll(/\D/g,''));
            if(collect_one>0) {
                websocket.send('MARKET_COLLECT=1');
            }
            if(collect_two>0) {
                websocket.send('MARKET_COLLECT=2');
            }
            if(collect_three>0) {
                websocket.send('MARKET_COLLECT=3');
            }
        }

        updateMarketNotifications() {
            if(!marketRunning) {
                marketRunning = true;
                marketTimer = setInterval(function() {
                    $("button#player-market-slot-collect-amount-1").text(" Collect: ");
                    $("button#player-market-slot-collect-amount-2").text(" Collect: ");
                    $("button#player-market-slot-collect-amount-3").text(" Collect: ");

                    websocket.send("MARKET_REFRESH_SLOTS");

                    setTimeout(function() {
                        var collect_one = parseInt($("button#player-market-slot-collect-amount-1").text().replaceAll(/\D/g,''));
                        var collect_two = parseInt($("button#player-market-slot-collect-amount-2").text().replaceAll(/\D/g,''));
                        var collect_three = parseInt($("button#player-market-slot-collect-amount-3").text().replaceAll(/\D/g,''));
                        if(collect_one>0) {
                            collect_one = collect_one
                        } else {
                            collect_one = 0
                        }
                        if(collect_two>0) {
                            collect_two = collect_two
                        } else {
                            collect_two = 0
                        }
                        if(collect_three>0) {
                            collect_three = collect_three
                        } else {
                            collect_three = 0
                        }
                        var total = collect_one + collect_two + collect_three;
                        if(total>1) {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").show();
                        } else {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").hide();
                        }
                    }, 50);
                }, 10000);
            }
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
            this.addMarketNotifications();
            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            }
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
            var playerID = var_player_id;
            $(`#search-username-hiscores`).after(`<span id="player_id">(ID: ${playerID})</span>`)
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
            //hide_element("market-table");
            //show_element("market-loading");
            let best = {};
            let bestList = {};
            return $.get(`../../market/browse/${item}/`).done(function(data) {
                const xpMultiplier = DonorShop.has_donor_active(IdlePixelPlus.getVar("donor_bonus_xp_timestamp")) ? 1.1 : 1;
                //console.log(data);

                var altListTransform = IdlePixelPlus.plugins.market.getConfig("altIDList").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase();
                var convertAltsToArray = altListTransform.split(',');
                const listofAlts = convertAltsToArray.map(function (x) {
                    return parseInt(x);
                });

                data.forEach(datum => {
                    let player_id_alt_check = parseInt(datum.player_id);
                    if(listofAlts.indexOf(player_id_alt_check) != -1) {
                        // Removes the alts listing from market and calculations
                    } else {
                        //console.log(datum);
                        const priceAfterTax = datum.market_item_price_each * 1.01;
                        switch(datum.market_item_category) {
                            case "bars":
                            case "ores": {
                                let perCoin = (priceAfterTax / (xpMultiplier*XP_PER[datum.market_item_name]));
                                datum.perCoin = perCoin;
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/xp`;
                                datum.levelReq = "N/A";
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
                                let sDPerCoin = (3500 / priceAfterTax);
                                let charPerCoin = ((priceAfterTax / CHARCOAL_PERC[datum.market_item_name]) / 2);
                                let levelReq = (LEVEL_REQ[datum.market_item_name]);
                                datum.perCoin = perCoin;
                                datum.levelReq = levelReq;
                                datum.sDPerCoin = sDPerCoin;
                                datum.charPerCoin = charPerCoin;
                                if (datum.market_item_name == 'stardust_logs') {
                                    datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br />${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/coin<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} coin/charcoal convert rate`;
                                }
                                else {
                                    datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} coin/charcoal convert rate`;
                                }
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
                            case "raw_fish":{
                                let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                                let energy = (Cooking.get_energy(datum.market_item_name));
                                let heat = (HEAT_PER[datum.market_item_name]);
                                let perHeat = (energy / heat);
                                let comboCoinEnergyHeat = (priceAfterTax / energy / heat);
                                let levelReq = (LEVEL_REQ[datum.market_item_name]);
                                datum.perCoin = comboCoinEnergyHeat;
                                datum.perHeat = perHeat;
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy || ${perHeat.toFixed(perHeat < 10 ? 2 : 1)} energy/heat<br />${comboCoinEnergyHeat.toFixed(comboCoinEnergyHeat < 10 ? 4 : 1)} coins/energy/heat`;
                                datum.levelReq = levelReq;
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
                            case "cooked_fish":{
                                let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                                datum.perCoin = perCoin;
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy`;
                                datum.levelReq = "N/A";
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
                                datum.levelReq = "N/A";
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
                            case "seeds": {
                                datum.perCoin = Number.MAX_SAFE_INTEGER;
                                let levelReq = (LEVEL_REQ[datum.market_item_name]);
                                let sDPerCoin = (14000 / priceAfterTax);
                                datum.levelReq = levelReq;
                                datum.sDPerCoin = sDPerCoin;
                                if (datum.market_item_name == "stardust_seeds") {
                                    datum.perCoinLabel = `${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/Coin`;
                                }
                                else{
                                    datum.perCoinLabel = "";
                                }
                                //console.log(levelReq);
                                break;
                            }
                            case "weapons": {
                                datum.perCoin = Number.MAX_SAFE_INTEGER;
                                datum.perCoinLabel = "";
                                let levelReq = "N/A";
                                if (LEVEL_REQ[datum.market_item_name]) {
                                    levelReq = (LEVEL_REQ[datum.market_item_name]);
                                    datum.levelReq = levelReq;
                                }
                                else {
                                    datum.levelReq = "N/A";
                                }
                                //console.log(levelReq);
                                break;
                            }
                            case "other_equipment": {
                                datum.perCoin = Number.MAX_SAFE_INTEGER;
                                datum.perCoinLabel = "";
                                let levelReq = (LEVEL_REQ[datum.market_item_name]);
                                datum.levelReq = levelReq;
                                //console.log(levelReq);
                                break;
                            }
                            case "armour": {
                                datum.perCoin = Number.MAX_SAFE_INTEGER;
                                datum.perCoinLabel = "";
                                let levelReq = "N/A";
                                if (LEVEL_REQ[datum.market_item_name]) {
                                    levelReq = (LEVEL_REQ[datum.market_item_name]);
                                    datum.levelReq = levelReq;
                                }
                                else {
                                    datum.levelReq = "N/A";
                                }
                                //console.log(levelReq);
                                break;
                            }
                            default: {
                                datum.perCoin = Number.MAX_SAFE_INTEGER;
                                datum.perCoinLabel = "";
                                datum.levelReq = "N/A";
                                break;
                            }

                        }
                    }});
                Object.values(bestList).forEach(bestCatList => bestCatList.forEach(datum => datum.best=true));
                const sortMethod = self.getConfig("sortMethod");
                switch(sortMethod) {

case "sinf": {
    const cheapestItemsMap = {};

    data.forEach(item => {
        const itemName = item.market_item_name;
        const itemPrice = item.market_item_price_each;

        if (!(itemName in cheapestItemsMap) || itemPrice < cheapestItemsMap[itemName].market_item_price_each) {
            cheapestItemsMap[itemName] = item;
        }
    });

    // Extract the values from the map (the cheapest items)
    data = Object.values(cheapestItemsMap);

    // Sort the items by their posting timestamp in descending order
    data.sort((a, b) => b.market_item_post_timestamp - a.market_item_post_timestamp);
    break;
}

case "sinl": {
    const cheapestItemsMap = {};

    data.forEach(item => {
        const itemName = item.market_item_name;
        const itemPrice = item.market_item_price_each;

        if (!(itemName in cheapestItemsMap) || itemPrice < cheapestItemsMap[itemName].market_item_price_each) {
            cheapestItemsMap[itemName] = item;
        }
    });

    // Extract the values from the map (the cheapest items)
    data = Object.values(cheapestItemsMap);

    // Sort the items by their posting timestamp in ascending order
    data.sort((a, b) => a.market_item_post_timestamp - b.market_item_post_timestamp);
    break;
}

case "sicl": {
    const cheapestItemsMap = {};

    data.forEach(item => {
        const itemName = item.market_item_name;
        const itemPrice = item.market_item_price_each;

        if (!(itemName in cheapestItemsMap) || itemPrice < cheapestItemsMap[itemName].market_item_price_each) {
            cheapestItemsMap[itemName] = item;
        }
    });

    // Extract the values from the map (the cheapest items) and sort them by their prices in ascending order
    data = Object.values(cheapestItemsMap).sort((a, b) => b.market_item_price_each - a.market_item_price_each);
    break;
}

case "sicf": {
    const cheapestItemsMap = {};

    data.forEach(item => {
        const itemName = item.market_item_name;
        const itemPrice = item.market_item_price_each;

        if (!(itemName in cheapestItemsMap) || itemPrice < cheapestItemsMap[itemName].market_item_price_each) {
            cheapestItemsMap[itemName] = item;
        }
    });

    // Extract the values from the map (the cheapest items) and sort them by their prices in ascending order
    data = Object.values(cheapestItemsMap).sort((a, b) => a.market_item_price_each - b.market_item_price_each);
    break;
}

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
                let html = "<tr><th>ITEM</th><th></th><th>AMOUNT</th><th>PRICE EACH</th><th>EXTRA INFO</th><th>CATEGORY</th><th>EXPIRES IN</th></tr>";
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
                    let levelReq = datum.levelReq;
                    let your_entry = "";


                    var altListTransform = IdlePixelPlus.plugins.market.getConfig("altIDList").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase();
                    var convertAltsToArray = altListTransform.split(',');
                    const listofAltsCheck = convertAltsToArray.map(function (x) {
                        return parseInt(x);
                    });

                    if(listofAltsCheck.indexOf(player_id) != -1) {
                        // Remove the alts listing from the market
                    } else {
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
                        rowHtml += `<td>${levelReq}</td>`;
                        rowHtml += `<td>${category}</td>`;
                        rowHtml += `<td>${Market._get_expire_time(timestamp)}</td>`;
                        rowHtml += `</tr>`;

                        // in case you want to add any extra data to the table but still use this script
                        if(typeof window.ModifyMarketDataRow === "function") {
                            rowHtml = window.ModifyMarketDataRow(datum, rowHtml);
                        }
                        html += rowHtml;
                    }});

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
                    const rowCategory = row.find("td:nth-child(6)").text();
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