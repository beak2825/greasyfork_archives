// ==UserScript==
// @name         IdlePixel Market Overhaul - Wynaan Fork
// @namespace    com.anwinity.idlepixel
// @version      1.5.1
// @description  Overhaul of market UI and functionality.
// @author       Original Author: Anwinity || Modded By: GodofNades/Zlef/Wynaan
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/478669/IdlePixel%20Market%20Overhaul%20-%20Wynaan%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/478669/IdlePixel%20Market%20Overhaul%20-%20Wynaan%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let marketTimer;
    let marketWatcherTimer;
    var marketRunning = false;

    const LOCAL_STORAGE_KEY_WATCHERS = "plugin_market_watchers";
    const LOCAL_STORAGE_KEY_LOG = "plugin_market_log";

    const LOCAL_STORAGE_LOG_LIMIT = 100;

    const MARKET_HISTORY_URL = "https://data.idle-pixel.com/market/api/getMarketHistory.php";
    const MARKET_TRADABLES_URL = "https://data.idle-pixel.com/market/api/getTradables.php";
    const MARKET_POSTINGS_URL = "https://idle-pixel.com/market/browse";

    const IMAGE_HOST_URL = "https://d1xsc8x7nc5q8t.cloudfront.net/images";
    const COIN_ICON_URL = `${IMAGE_HOST_URL}/coins.png`;

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
    };

    const CHARCOAL_PERC = {
        logs: 0.05,
        oak_logs: 0.1,
        willow_logs: 0.15,
        maple_logs: 0.2,
        stardust_logs: 0.25,
        pine_logs: 0.3,
        redwood_logs: 0.35
    };

    const CATEGORY_RATIOS = {
        ores: ["Coins/XP"],
        bars: ["Coins/XP"],
        bones: ["Coins/Bonemeal"],
        logs: ["Coins/Heat", "Coins/Charcoal"],
        raw_fish: ["Coins/Energy", "Energy/Heat", "Coins/Heat/Energy"],
        cooked_fish: ["Coins/Energy"]
    };

    const THEME_DEFAULTS = {
        default: {
            colorPanelsOutline: "#ffffff",
            colorPanelsBg:      "#ffffff",
            colorItemSlotsBg:   "#00ffdd",
            colorRowOdd:        "#c3ebe9",
            colorRowEven:       "#c3ebe9",
            colorText:          "#000000",
            colorChartLineMax:      "#b41414",
            colorChartLineAverage:  "#3232d2",
            colorChartLineMin:      "#509125"
        },
        dark: {
            colorPanelsOutline: "#2a2a2a",
            colorPanelsBg:      "#333333",
            colorItemSlotsBg:   "#333333",
            colorRowOdd:        "#333333",
            colorRowEven:       "#444444",
            colorText:          "#cccccc",
            colorChartLineMax:      "#b41414",
            colorChartLineAverage:  "#0984f7",
            colorChartLineMin:      "#509125"
        }
    };

    const configurableStyles = document.createElement("style");
    document.head.appendChild(configurableStyles);

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
                        label: "------------------------------------------------<br/>General<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "autoMax",
                        label: "Autofill Max Buy",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "marketSoldNotification",
                        label: "Notification on item sold",
                        type: "boolean",
                        default: true
                    },
                    //Zlef
                    {
                        id: "clickBrewIng",
                        label: "Click on a brewing ingredient to go to player market page.",
                        type: "boolean",
                        default: true
                    },
                    //End Zlef
                    {
                        id: "marketGraph",
                        label: "Show a 7-days price history when browsing items.",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Table<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "highlightBest",
                        label: "Highlight Best",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "altIDList",
                        label: "Player ID blacklist for alts",
                        type: "string",
                        max: 200000,
                        default: "PlaceIDsHere"
                    },
                    {
                        id: "heatPotion",
                        label: "Account for heat potion use in heat cost",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "extraInfoColumn",
                        label: "Show Extra Info on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "categoryColumn",
                        label: "Show Category on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBuyColumn",
                        label: "Show Quick Buy button on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBuyAmount",
                        label: "Quick Buy button amount (0 = max)",
                        type: "number",
                        default: 1
                    },
                    {
                        id: "quickBuyAllNeedsAltKey",
                        label: "Require Alt-key when right-clicking to quick-buy all",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Theme<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "condensed",
                        label: "Condensed UI",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "theme",
                        label: "Bundled theme",
                        type: "select",
                        options: ["Default", "Dark"],
                        default: "Default"
                    },
                    {
                        id: "colorTextEnabled",
                        label: "Change text color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorText",
                        label: "Text color",
                        type: "color",
                        default: THEME_DEFAULTS.default.text
                    },
                    {
                        id: "colorItemSlotsBgEnabled",
                        label: "Change item slots background color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorItemSlotsBg",
                        label: "Panels background color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgItemSlots
                    },
                    {
                        id: "colorPanelsBgEnabled",
                        label: "Change panels background color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorPanelsBg",
                        label: "Panels background color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgPanels
                    },
                    {
                        id: "colorPanelsOutlineEnabled",
                        label: "Change panels outline color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorPanelsOutline",
                        label: "Panels outline color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgOutline
                    },
                    {
                        id: "colorRowAccentsEnabled",
                        label: "Change table row accent colors",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorRowOdd",
                        label: "Row accent color 1",
                        type: "color",
                        default: THEME_DEFAULTS.default.rowAccent1
                    },
                    {
                        id: "colorRowEven",
                        label: "Row accent color 2",
                        type: "color",
                        default: THEME_DEFAULTS.default.rowAccent2
                    },
                    {
                        id: "colorChartLineEnabled",
                        label: "Change history chart line colors",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorChartLineMax",
                        label: "History chart max price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineMax
                    },
                    {
                        id: "colorChartLineAverage",
                        label: "History chart average price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineAverage
                    },
                    {
                        id: "colorChartLineMin",
                        label: "History chart min price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineMin
                    }
                ]
            });
            this.lastBrowsedItem = "all";
            this.lastCategoryFilter = "all";
            this.historyChart = undefined;
            this.marketAverages = {};
            this.pendingConfirmationPurchaseLog = {};
            this.currentTableData = undefined;
            this.lastSortIndex = 0;
            this.loginDone = false;
        }

        onConfigsChanged() {
            this.applyCondensed(this.getConfig("condensed"));
            this.loadStyles();

            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            } else {
                clearInterval(marketTimer);
                clearInterval(marketWatcherTimer);
                marketRunning = false;
                $("#market-sidecar").hide();
            }

            if(this.getConfig("marketGraph")) {
                $("#history-chart-div").hide();
            }

            if(this.loginDone)
                this.refreshMarket(false);
        }

        addMarketNotifications() {
            const sideCar = document.createElement('span');
            sideCar.id = `market-sidecar`;
            sideCar.onclick = function () {
                IdlePixelPlus.plugins.market.collectMarketButton();
            }
            sideCar.style='margin-right: 4px; margin-bottom: 4px; display: none; cursor: pointer;';

            var elem = document.createElement("img");
            elem.setAttribute("src", "https://idlepixel.s3.us-east-2.amazonaws.com/images/player_market.png");
            const sideCarIcon = elem;
            sideCarIcon.className = "w20";

            const sideCarDivLabel = document.createElement('span');
            sideCarDivLabel.id = `market-sidecar-coins`;
            sideCarDivLabel.innerText = ' 0';
            sideCarDivLabel.className = 'color-white'

            sideCar.append("  (", sideCarIcon, sideCarDivLabel, ")");
            document.querySelector('#item-display-coins').after(sideCar);
            $("#market-sidecar").hide();
        };

        collectMarketButton() {
            $("#market-sidecar").hide();
            document.querySelectorAll(`button[id^=player-market-slot-collect-amount]`).forEach(b => {
                const collect = parseInt(b.textContent.replace(/[^0-9]/g,''));
                if(collect > 0){
                    b.click();
                }
            });
        }

        updateMarketNotifications() {
            if(!marketRunning) {
                marketRunning = true;
                marketTimer = setInterval(function() {
                    websocket.send("MARKET_REFRESH_SLOTS");

                    setTimeout(function() {
                        const total = [1, 2, 3].map(n => {
                            const collect = parseInt($(`button#player-market-slot-collect-amount-${n}`).text().replace(/\D/g,''));
                            return isNaN(collect) ? 0 : collect;
                        }).reduce((a, b) => a + b, 0);
                        if(total > 0) {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").show();
                        } else {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").hide();
                        }
                    }, 50);
                }, 10000);
                marketWatcherTimer = setInterval(function() {
                    IdlePixelPlus.plugins.market.checkWatchers();
                }, 30000);
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

        getStyleFromConfig(enableId, colorId) {
            return this.getConfig(enableId) ? this.getConfig(colorId) : THEME_DEFAULTS[this.getConfig("theme").toLowerCase()][colorId];
        }

        loadStyles() {
            const colorText = this.getStyleFromConfig("colorTextEnabled", "colorText");
            const colorPanelsOutline = this.getStyleFromConfig("colorPanelsOutlineEnabled", "colorPanelsOutline");
            const colorRowOdd = this.getStyleFromConfig("colorRowAccentsEnabled", "colorRowOdd");
            const colorRowEven = this.getStyleFromConfig("colorRowAccentsEnabled", "colorRowEven");
            const colorItemSlotsBg = this.getStyleFromConfig("colorItemSlotsBgEnabled", "colorItemSlotsBg");
            const colorPanelsBg = this.getStyleFromConfig("colorPanelsBgEnabled", "colorPanelsBg");
            const styles = `
            #market-table, #market-log-table {
                margin-top: 0.5em !important;
                border-spacing:0 4px !important;
                border-collapse: separate;
                background: ${colorPanelsOutline} !important;
                border-width: 4px;
                border-radius: 5pt;
                padding: 4px;
                > * tr th {
                    background: ${colorPanelsOutline};
                    color: ${colorText};
                }
                > * tr:nth-child(even) {
                    background: ${colorRowOdd};
                    color: ${colorText};
                }
                > * tr:nth-child(odd) {
                    background: ${colorRowEven};
                    color: ${colorText};
                }
                > * tr.cheaper {
                    background-color: rgb(50, 205, 50, 0.25);
                }
                > * td {
                    background: inherit;
                    color: inherit;
                    &:first-child {
                        border-top-left-radius: 5pt;
                        border-bottom-left-radius: 5pt;
                    }
                    &:last-child {
                        border-top-right-radius: 5pt;
                        border-bottom-right-radius: 5pt;
                    }
                    > button {
                        border-radius: 3pt;
                        border: 2px solid #00000022;
                        padding: 4px;
                        box-shadow: none;
                        background-color: ${colorPanelsOutline};
                        color: ${colorText};
                        &:disabled {
                            color: ${colorText + "55"};
                            pointer-events: none;
                        }
                    }
                }
            }
            div[id^=player-market-slot] {
                border-spacing:0 4px;
                border-collapse: separate;
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorItemSlotsBg};
                color: ${colorText};
                > div, span {
                    color: ${colorText} !important;
                }
                > button {
                    border-radius: 5pt;
                    border: 2px solid #00000022;
                    box-shadow: none;
                }
            }
            div[id^=player-market-slot-empty] {
                &:hover {
                    outline: 1px solid ${colorText + "55"};
                    z-index: 1;
                }
                > #panel-sell-text {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-size: 20pt;
                    color: ${colorText + "55"} !important;
                }
            }
            #market-watcher-div {
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorPanelsBg};
                margin: 0px;
                color: ${colorText};
                > div[id^=watched-item] {
                    color: black;
                }
            }
            #history-chart-div {
                position: relative;
                margin: 0 auto;
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorPanelsBg};
                > #history-chart-timespan {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    font-size: 10pt;
                    border-radius: 3pt;
                    background-color: ${colorPanelsBg};
                    color: ${colorText};
                    &:hover {
                        cursor: pointer;
                    }
                    &:focus-visible {
                        outline: none;
                    }
                }
            }`;
            if(this.historyChart) {
                this.historyChart.options.scales.x.ticks.color = colorText;
                this.historyChart.options.scales.y.ticks.color = colorText;
            }
            else {
                Chart.defaults.color = colorText;
            }

            configurableStyles.innerHTML = styles;
        }

        async onLogin() {
            this.addMarketNotifications();
            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            }
            const self = this;

            $("head").append(`
            <style id="styles-market">
                #panel-player-market {
                    &.condensed {
                        > center {
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                        }
                        & div.player-market-slot-base {
                            height: 400px;
                        }
                        & div.player-market-slot-base hr {
                            margin-top: 2px;
                            margin-bottom: 4px;
                        }
                        & div.player-market-slot-base br + div.player-market-slot-base br {
                            display: none;
                        }
                        & div.player-market-slot-base[id^="player-market-slot-occupied"] {
                            > button {
                                padding: 2px;
                            }
                            > button[id^="player-market-slot-see-market"] {
                                width: 90%; 
                                margin-top: 0.5em; 
                                margin-bottom: 0.5em; 
                                background-color: rgb(46, 137, 221);
                            }
                            > h2[id^="player-market-slot-item-item-label"] {
                                font-size: 1.8rem;
                                margin-bottom: 0;
                            } 
                        }
                        & #market-table th, #market-table td {
                            padding: 2px 4px;
                        }
                    }
                }
                #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory {
                    margin: 6px 6px;
                    padding: 6px 6px;
                }
                #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory hr {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }
                .hide {
                    display: none;
                }
                .bold {
                    font-weight: bold;
                }
                .select-item-tradables-catagory {
                    border-radius: 5pt;
                }
                #market-table th.actions:hover {
                    color: gray;
                    cursor: pointer;
                }
                .context-menu { 
                    position: absolute; 
                } 
                .menu {
                    display: flex;
                    flex-direction: column;
                    background-color: rgb(240, 240, 240);
                    border-radius: 5pt;
                    box-shadow: 4px 4px 8px #0e0e0e;
                    padding: 10px 0;
                    list-style-type: none;
                    > li {
                        font: inherit;
                        border: 0;
                        padding: 4px 36px 4px 16px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        position: relative;
                        text-decoration: unset;
                        color: #000;
                        transition: 0.5s linear;
                        -webkit-transition: 0.5s linear;
                        -moz-transition: 0.5s linear;
                        -ms-transition: 0.5s linear;
                        -o-transition: 0.5s linear;
                        > span:not(:first-child) {
                            position: absolute;
                            right: 12px;
                        }
                        &:hover {
                            background:#afafaf;
                            color: #15156d;
                            cursor: pointer;
                        }
                    }
                }
                .hoverable-div:hover {
                    box-shadow: 4px 4px 8px #0e0e0e;
                    border-color: #252525;
                    cursor: pointer;
                }
                #market-log-table th, #market-log-table td {
                    padding: 2px 4px;
                }
            </style>
            `);

            // Market watcher modal
            $("#modal-item-input").after(`
            <div class="modal modal-dim" id="modal-market-configure-item-watcher" tabindex="-1" style="top: 0px; display: none;" aria-modal="true" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-secondary">ITEM WATCHER</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="center">
                                <div class="modal-market-sell-image p-2 hard-shadow">
                                    <h2 id="modal-market-configure-item-watcher-label"></h2>
                                    <img id="modal-market-configure-item-watcher-image" width="50px" height="50px" original-width="50px" original-height="50px" src="">
                                </div>
                                <br>
                                <input type="hidden" id="modal-market-configure-item-watcher">
                                <div class="modal-market-watcher-inputs font-small color-grey p-2 shadow">
                                    <br>
                                    <br>
                                    Limit:
                                    <span class="color-gold" id="modal-market-configure-item-watcher-low-limit">N/A</span>
                                    -
                                    <span class="color-gold" id="modal-market-configure-item-watcher-high-limit">N/A</span>
                                    <span class="color-gold"> each</span>
                                    <br>
                                    <img src="${COIN_ICON_URL}" title="coins">
                                    <input type="text" id="modal-market-configure-item-watcher-price-each" width="30%" placeholder="Price Each" original-width="30%">
                                    <select id="modal-market-configure-item-watcher-mode">
                                    <option value="1">Less than</option>
                                    <option value="2">At least</option>
                                    </select>
                                    <br>
                                    <br>
                                    <br>
                                    <br>
                                    <div>
                                        <input type="button" id="modal-market-configure-item-watcher-cancel-button" data-bs-dismiss="modal" value="Cancel">
                                        <input type="button" id="modal-market-configure-item-watcher-ok-button" onclick="IdlePixelPlus.plugins.market.createMarketWatcher()" class="background-primary hover" value="Create Watcher">
                                        <u class="hover" onclick="alert(&quot;You will get a notification when the price crosses the specified threshold.&quot;)">?</u>
                                    </div>
                                    <br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
            
            // Market table sort menu
            $("#panel-player-market").append(`
            <div id="market-sort-context-menu" class="context-menu" style="display: none"> 
                <ul class="menu"> 
                    <li id="context-menu-price-each-item" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-price-each-item\");'>
                        <span> Price Each</span>
                    </li> 
                </ul> 
            </div>`);

            const sellSlotWidth = $(".player-market-slot-base").outerWidth();
            document.getElementById("market-table").style.minWidth = sellSlotWidth * 3;
            // History chart
            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`).parent().before(`
                <div id="history-chart-div" style="display:block; margin-bottom: 0.5em; width: ${sellSlotWidth * 3}px; height: 200px;">
                    <select id="history-chart-timespan" align="right" onchange='IdlePixelPlus.plugins.market.fetchMarketHistory();'>
                        <option value="1d">24 Hours</option>
                        <option value="7d" selected="selected">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="60d">60 Days</option>
                        <option value="120d">120 Days</option>
                    </select>
                    <canvas id="history-chart" style="display: block;" align="middle">
                </div>`);
            Object.assign(Chart.defaults.datasets.line, {
                fill: false,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 1
            });

            // Market watcher
            $("#notifications-area").children().last().after(`
                <div id="notification-market-watcher" class="notification hover hide" onclick='switch_panels(\"panel-player-market\");' style="margin-right: 4px; margin-bottom: 4px; background-color: rgb(183, 68, 14);">
                    <img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/player_market.png" class="w20" title="market_alert">
                    <span id="notification-market-item-label" class="color-white"> Market Alert</span>
                </div>`);
            $("#history-chart-div").prev().before(`
                <center>
                <div id="market-watcher-div" class="select-item-tradables-catagory shadow" align="left" style="width: ${sellSlotWidth * 3}px; display: none;">
                    <span class="bold">Active watchers</span>
                    <hr style="margin-top: 2px; margin-bottom: 4px;">
                </div>
                </center>`);

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
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyLowestPriceSell()">lowest</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMidPriceSell()">mid</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxPriceSell()">max</button>
                <br /><br />
                Total: <span id="modal-market-configure-item-to-sell-total"></span>
            `);

            // Extra buttons beside <BROWSE PLAYER MARKET>
            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`)
                .first()
                .after(`<button id="refresh-market-table-button" type="button" style="height: 44px; margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.refreshMarket(true);">
                            Refresh
                        </button>`)
                .after(`<button id="watch-market-item-button" type="button" style="height: 44px; margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.watchItemOnClick()">
                            Watch Item
                        </button>`);

            document.querySelectorAll(`button[id^=player-market-slot-collect-amount]`).forEach(b => {
                // Add See Market button
                const id = b.id.match(/[1-3]/)[0];
                b.nextElementSibling.remove();
                b.insertAdjacentHTML("afterend", `<button type="button" id="player-market-slot-see-market-${id}" onclick="IdlePixelPlus.plugins.market.seeMarketOnClick(${id})">See Market</button>`);
            
                // Add event to reset collection button
                b.addEventListener("click", () => {
                    const item = document.getElementById(`player-market-slot-item-item-label-${id}`).textContent.toLowerCase().replace(/\s/g, "_");
                    const price_each = parseInt(document.getElementById(`player-market-slot-item-price-each-${id}`).textContent.replace(/[^0-9]+/g, ""));
                    const amount = b.textContent.replace(/[^0-9]+/g, "") / price_each;
                    this.saveLogToLocalStorage({
                        item: item,
                        amount: amount,
                        price_each: price_each,
                        transaction_type: "Sale"
                    });
                    b.textContent = b.textContent.replace(/[0-9,]+/, '0');
                    $("#market-sidecar").hide();
                    this.refreshMarket(false);
                });
            });
            document.querySelectorAll(`span[id^=player-market-slot-expires]`).forEach(s => s.previousElementSibling.remove());

            // Refresh market on purchase
            const purchaseButton = document.querySelector(`input[onclick*="Market.purchase_item()"]`);
            if(purchaseButton)
                purchaseButton.addEventListener("click", () => this.refreshMarket(false));

            sellAmountInput.on("input change", () => this.applyTotalSell());
            sellPriceInput.on("input change", () => this.applyTotalSell());

            // Zlef
            // Add buttons to brewing ingredients
            const parentDiv = document.getElementById("panel-brewing");

            // Loop through all itembox elements within the parent div
            parentDiv.querySelectorAll('itembox').forEach((itemBox) => {
                // Check if it contains 'Primary Ingredient' or 'Secondary Ingredient'
                const tooltip = itemBox.getAttribute("data-bs-original-title");
                if (tooltip && (tooltip.includes("Primary Ingredient") || tooltip.includes("Secondary Ingredient"))) {
                    // Add click event to the itembox
                    itemBox.addEventListener("click", () => this.brewingIngClicked(itemBox));
                }
            });
            //End Zlef

            // Observer for brewing modal change 
            const brewingModal = document.getElementById("modal-brew-ingredients");
            const brewingModalObserverOptions = { childList: true, subtree: true};
            const brewingModalObserver = new window.MutationObserver((mutationRecords) => {
                brewingModalObserver.disconnect();
                const record = mutationRecords[0];
                let totalCost = 0;
                const promises = Array.from(record.addedNodes).map((async (node) => {
                        if(node.nodeName === "IMG" && node.nextSibling.nodeName === "#text") {
                            const item = node.src.match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
                            if(Market.tradables.find(t => t.item === item)) {
                                const qty = node.nextSibling.textContent.match(/[0-9]+/)[0];
                                const response = await fetch(`${MARKET_POSTINGS_URL}/${item}/`);
                                const data = await response.json();
                                let currentMarketMinPrice = Math.min(...data.map(datum => datum.market_item_price_each));
                                if(!isFinite(currentMarketMinPrice)) { // If item isn't currently on sale, use market average value instead
                                    currentMarketMinPrice = this.marketAverages[item];
                                }
                                const displayedValue = (qty * currentMarketMinPrice > 1000) ? `${(qty * currentMarketMinPrice / 1000).toFixed(2)}k` : qty * currentMarketMinPrice;
                                totalCost += qty * currentMarketMinPrice;
                                node.nextSibling.textContent += ` (`;
                                node.nextElementSibling.insertAdjacentHTML("beforebegin", `<img src="${COIN_ICON_URL}" title="coins"> ${displayedValue})`);
                            }
                        }
                    })
                );
                Promise.all(promises).then(() => {
                    const totalCostElement = document.getElementById("brewing-total-cost");
                    const totalCostStr = `Estimated total cost: ${totalCost > 1000 ? (totalCost / 1000).toFixed(2) + "k" : totalCost}`;
                    if(totalCostElement)
                        totalCostElement.textContent = totalCostStr;
                    else
                        record.target.parentNode.insertAdjacentHTML("afterend", `<span id="brewing-total-cost" class="colorg-grey">${totalCostStr}</span>`);
                    brewingModalObserver.observe(brewingModal, brewingModalObserverOptions);
                });
            });
            brewingModalObserver.observe(brewingModal, brewingModalObserverOptions);

            if(this.getConfig("condensed")) {
                // Remove <br> from between <Amount left> and <Price each>, and reinsert it above title
                document.querySelectorAll(`span[id^="player-market-slot-item-amount-left"]`).forEach(e => {
                    const br = e.parentNode.removeChild(e.nextElementSibling);
                    e.parentNode.querySelector(`h2[id^="player-market-slot-item-item-label"]`).before(br);
                });
            }

            const buyModal = $("#modal-market-purchase-item");
            const buyAmountInput = buyModal.find("#modal-market-purchase-item-amount-input");
            $(document).on('click', '[onclick*="Modals.market_purchase_item"]', this.handlePurchaseClick.bind(this));
            buyAmountInput.after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountBuy()">1</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountBuy()">max</button>
                <br /><br />
                Total: <span id="modal-market-purchase-item-total"></span>
                <br />
                Owned: <item-display data-format="number" data-key="coins"></item-display>
            `);
            buyAmountInput.on("input change", () => this.applyTotalBuy());

            // Remove sell buttons
            document.querySelectorAll("div[id^=player-market-slot-empty] button").forEach(b => {
                b.parentElement.onclick = b.onclick;
                const div = document.createElement("div");
                div.setAttribute("id", "panel-sell-text");
                div.classList.add("hover");
                div.innerText = "Sell an item";
                b.replaceWith(div);
            });

            // wrap Market.browse_get_table to capture last selected
            Market.browse_get_table = function(item) {
                return self.browseGetTable(item, true);
            }

            // Wrap Market.purchase_item to send to log
            const original_purchase_item = Market.purchase_item;
            Market.purchase_item = function() {
                const item = document.getElementById("modal-market-purchase-item-label").textContent.toLowerCase().replace(/\s/g, "_");
                const amount = get_number_with_letters(document.getElementById("modal-market-purchase-item-amount-input").value);
                const price_each = parseInt(document.getElementById("modal-market-purchase-item-price-each").value.replace(/[^0-9]+/g, ""));
                IdlePixelPlus.plugins.market.storeLogPendingConfirmation(item, amount, price_each, "Purchase");
                original_purchase_item.apply(this);
            }

            // Add event listener to websocket to catch purchase confirmations
            websocket.connected_socket.addEventListener("message", (e) => {
                if(e.data.includes("OPEN_DIALOGUE=")) {
                    const values = e.data.substring(e.data.indexOf('=')+1);
                    if(values.includes("MARKET PURCHASE") && values.includes("Successfully purchased from player market!")) {
                        this.saveLogToLocalStorage(this.pendingConfirmationPurchaseLog);
                        this.pendingConfirmationPurchaseLog = {};
                    }
                }
            })

            // Edit tradables modal category names
            new window.MutationObserver((mutationRecords) => {
                const childList = mutationRecords.filter(record => record.type === "childList")[0];
                if(childList && childList.target && childList.target.id === "modal-market-select-item-section") {
                    const elements = document.getElementById(childList.target.id).querySelectorAll(".select-item-tradables-catagory");
                    elements.forEach(e => {
                        let isSellModal = false;

                        e.classList.add("bold");
                        e.innerHTML = e.innerHTML.replace(/[a-zA-Z_]+<hr>/, e.textContent.split("_").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ") + "<hr>");

                        e.querySelectorAll("div").forEach(d => {
                            isSellModal |= /Modals\.market_configure_item_to_sell/.test(d.onclick.toString());
                            if(d.parentNode.textContent.toLowerCase() != "all") {
                                d.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                });
                                const match = d.onclick.toString().match(/(Modals\.market_configure_item_to_sell|Market\.browse_get_table)\(\"([a-zA-Z0-9_]+)\"/);
                                if(match) {
                                    d.setAttribute("data-bs-toggle", "tooltip");
                                    d.setAttribute("data-bs-placement", "top");
                                    d.setAttribute("data-boundary", "window");
                                    d.setAttribute("title", Items.get_pretty_item_name(match[2]));
                                }
                            }
                        });
                        if(!isSellModal) {
                            e.onclick = () => this.filterButtonOnClick(e.textContent.toLowerCase().replace(" ", "_"));
                            e.classList.add("hoverable-div");
                        }
                    });
                }
            }).observe(document.getElementById("modal-market-select-item"), {
                childList: true,
                subtree: true
            });

            // Player ID display
            var playerID = var_player_id;
            $(`#search-username-hiscores`).after(`<span id="player_id">(ID: ${playerID})</span>`);

            this.onConfigsChanged();
            this.createMarketLogPanel();
            this.loadStyles();
            this.applyLogLocalStorage();
            this.applyWatchersLocalStorage();
            this.checkWatchers();
            this.getGlobalMarketHistoryAverages(7);
            this.preloadMarketTradables();
            this.loginDone = true;
        }

        async fetchBrowseResult(item) {
            const response = await fetch(`${MARKET_POSTINGS_URL}/${item}/`);
            return response.json();
        }

        browseGetTable(item, updateGraph) {
            const self = this;
            if(item != this.lastBrowsedItem) {
                self.lastSortIndex = 0;
            }
            this.lastBrowsedItem = item;
            if(item == "all") {
                $("#watch-market-item-button").hide();
                $("#history-chart-div").hide();
            }
            else {
                $("#watch-market-item-button").show();
                $("#modal-market-configure-item-watcher-image").attr("src", this.getItemIconUrl(item));
                $("#modal-market-configure-item-watcher-label").text(item.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));

                try {
                    if(this.getConfig("marketGraph") && updateGraph) {
                        self.fetchMarketHistory(item);
                    }
                } catch(err) {
                    console.log(err);
                }
            }

            // A good chunk of this is taking directly from Market.browse_get_table
            //hide_element("market-table");
            //show_element("market-loading");
            let best = {};
            let bestList = {};
            return $.get(`${MARKET_POSTINGS_URL}/${item}/`).done(async function(data) {
                const xpMultiplier = DonorShop.has_donor_active(IdlePixelPlus.getVar("donor_bonus_xp_timestamp")) ? 1.1 : 1;
                const listofAlts = IdlePixelPlus.plugins.market.getConfig("altIDList").replace(";",",").replace(/\s?,\s?/g, ",").toLowerCase().split(',').map(altId => parseInt(altId));
                const useHeatPot = self.getConfig("heatPotion");

                if(data.find(datum => ["logs", "raw_fish"].includes(datum.market_item_category)) !== undefined) {
                    var coinsPerHeat = 100000;
                    const logsData = await self.fetchBrowseResult("logs");
                    coinsPerHeat = 1.01 * Math.min(...logsData.map(datum => datum.market_item_price_each / Cooking.getHeatPerLog(datum.market_item_name)));
                }

                // Removes the alts listing from market and calculations
                data = data.filter(datum => listofAlts.indexOf(parseInt(datum.player_id)) == -1);

                data.forEach(datum => {
                    //console.log(datum);
                    const priceAfterTax = datum.market_item_price_each * 1.01;
                    switch(datum.market_item_category) {
                        case "bars":
                        case "ores": {
                            let perCoin = (priceAfterTax / (xpMultiplier*XP_PER[datum.market_item_name]));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = isNaN(perCoin) ? "" : `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/xp`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "logs": {
                            let perCoin = (priceAfterTax / (Cooking.getHeatPerLog(datum.market_item_name) * (useHeatPot ? 2 : 1)));
                            let sDPerCoin = (4000 / priceAfterTax);
                            const charcoalMultiplier = 1 * (window.var_titanium_charcoal_foundry_crafted ? 2 : 1) * (window.var_green_charcoal_orb_absorbed ? 2 : 1);
                            let charPerCoin = ((priceAfterTax / CHARCOAL_PERC[datum.market_item_name]) / charcoalMultiplier);
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.levelReq = levelReq;
                            datum.sDPerCoin = sDPerCoin;
                            datum.charPerCoin = charPerCoin;
                            datum.ratios = [perCoin, charPerCoin];
                            if (datum.market_item_name == 'stardust_logs') {
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br />${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/coin<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} ~coins/charcoal`;
                            }
                            else {
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} ~coins/charcoal`;
                            }
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "raw_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            let energy = (Cooking.get_energy(datum.market_item_name));
                            let heat = (HEAT_PER[datum.market_item_name]);
                            let perHeat = (energy / heat);
                            let comboCoinEnergyHeat = ((priceAfterTax + (heat * coinsPerHeat / (useHeatPot ? 2 : 1))) / energy);
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            datum.perCoin = comboCoinEnergyHeat;
                            datum.perHeat = perHeat;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy || ${perHeat.toFixed(perHeat < 10 ? 2 : 1)} energy/heat<br />${comboCoinEnergyHeat.toFixed(comboCoinEnergyHeat < 10 ? 4 : 1)} coins/heat/energy`;
                            datum.levelReq = levelReq;
                            datum.ratios = [perCoin, perHeat, comboCoinEnergyHeat];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "cooked_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "bones": {
                            let perCoin = (priceAfterTax / BONEMEAL_PER[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/bonemeal`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "seeds": {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            let sDPerCoin = (14000 / priceAfterTax);
                            datum.levelReq = levelReq;
                            datum.sDPerCoin = sDPerCoin;
                            datum.perCoinLabel = (datum.market_item_name == "stardust_seeds") ? `${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/Coin` : "";
                            break;
                        }
                        case "armour":
                        case "other_equipment":
                        case "weapons": {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            datum.levelReq = LEVEL_REQ[datum.market_item_name] ? LEVEL_REQ[datum.market_item_name] : "N/A";
                            break;
                        }
                        default: {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            datum.levelReq = "N/A";
                            break;
                        }
                    }
                });
                Object.values(bestList).forEach(bestCatList => bestCatList.forEach(datum => datum.best=true));

                //console.log(self.lastCategoryFilter);
                //console.log(self.lastSortIndex);
                //console.log(self.lastBrowsedItem);
                if(item !== self.lastBrowsedItem)
                    self.lastSortIndex = 0;
                self.currentTableData = data;
                self.filterTable(item === "all" ? self.lastCategoryFilter : (data.length > 0 ? data[0].market_item_category : "all"));
                
                hide_element("market-loading");
                show_element("market-table");
            });

        }

        setBest(best, bestList, datum, ratio) {
            if(!best[datum.market_item_category]) {
                best[datum.market_item_category] = ratio;
                bestList[datum.market_item_category] = [datum];
            }
            else {
                if(ratio == best[datum.market_item_category]) {
                    bestList[datum.market_item_category].push(datum);
                }
                else if(ratio < best[datum.market_item_category]) {
                    bestList[datum.market_item_category] = [datum];
                    best[datum.market_item_category] = ratio;
                }
            }
        }

        updateTable() {
            let html = `<tr>
                            <th>ITEM</th>
                            <th style="width: 60px;"></th>
                            <th>AMOUNT</th>
                            <th class="actions" onclick="IdlePixelPlus.plugins.market.marketHeaderOnClick(event);">PRICE EACH</th>`;
            if(this.getConfig("extraInfoColumn"))
                html += `<th>EXTRA INFO</th>`;
            if(this.getConfig("categoryColumn"))
                html += `<th>CATEGORY</th>`;
            html += `<th>EXPIRES IN</th>`;
            if(this.getConfig("quickBuyColumn"))
                html += `<th>QUICK BUY 
                        </th>`;
                html += `<th style="width: 0px;"><u class="hover" style="font-size: 80%; font-weight: 400;" onclick="alert(&quot;You can configure visible table columns in the plugin options.&quot;)">?</u></th>`;
            html += `</tr>`;
            // in case you want to add any extra data to the table but still use this script
            if(typeof window.ModifyMarketDataHeader === "function") {
                html = window.ModifyMarketDataHeader(html);
            }

            this.currentTableData.forEach(datum => {
                if(!datum.hidden) {
                    let market_id = datum.market_id;
                    let player_id = datum.player_id;
                    let item_name = datum.market_item_name;
                    let amount = datum.market_item_amount;
                    let price_each = datum.market_item_price_each;
                    let category = datum.market_item_category;
                    let timestamp = datum.market_item_post_timestamp;
                    let perCoinLabel = datum.perCoinLabel;
                    let best = datum.best && this.getConfig("highlightBest");
                    let levelReq = datum.levelReq;
                    let your_entry = "";

                    if(Items.getItem("player_id") == player_id) {
                        your_entry = "<span class='font-small'><br /><br />(Your Item)</span>";
                    }

                    let rowHtml = "";
                    rowHtml += `<tr onclick="Modals.market_purchase_item('${market_id}', '${item_name}', '${amount}', '${price_each}'); IdlePixelPlus.plugins.market.applyMaxAmountBuyIfConfigured();" class="hover${ best ? ' cheaper' : '' }">`;
                    rowHtml += `<td>${Items.get_pretty_item_name(item_name)}${your_entry}</td>`;
                    rowHtml += `<td style="width: 60px;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${item_name}.png" /></td>`;
                    rowHtml += `<td>${amount}</td>`;
                    rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${Market.get_price_after_tax(price_each)}`;
                    if(perCoinLabel) {
                        rowHtml += `<br /><span style="font-size: 80%; opacity: 0.8">${perCoinLabel}</span>`;
                    }
                    rowHtml += `</td>`;
                    if(this.getConfig("extraInfoColumn"))
                        rowHtml += `<td>${levelReq}</td>`;
                    if(this.getConfig("categoryColumn"))
                        rowHtml += `<td>${category}</td>`;
                    rowHtml += `<td>${Market._get_expire_time(timestamp)}</td>`;
                    if(this.getConfig("quickBuyColumn")) {
                        const qbSetting = this.getConfig("quickBuyAmount");
                        const qbMaxAmount = Math.min(amount, Math.floor(IdlePixelPlus.getVarOrDefault("coins", 0, "int") / (price_each * 1.01)));
                        const qbAmount = (qbSetting == 0) ? qbMaxAmount : Math.min(qbSetting, amount, Math.floor(IdlePixelPlus.getVarOrDefault("coins", 0, "int") / (price_each * 1.01)));
                        const qbButtonStr = (qbSetting == 0) ? "Max" : `${qbAmount}`;
                        rowHtml += `<td>
                                        <button onclick='event.stopPropagation();
                                                        IdlePixelPlus.plugins.market.quickBuyOnClick(${market_id}, ${qbAmount});
                                                        IdlePixelPlus.plugins.market.storeLogPendingConfirmation(\"${item_name}\", \"${qbAmount}\", \"${Math.floor(price_each * 1.01)}\", \"Purchase\");' 
                                                oncontextmenu='IdlePixelPlus.plugins.market.quickBuyOnRightClick(${market_id}, ${qbMaxAmount}, event);
                                                                IdlePixelPlus.plugins.market.storeLogPendingConfirmation(\"${item_name}\", \"${qbMaxAmount}\", \"${Math.floor(price_each * 1.01)}\", \"Purchase\");' 
                                                ${qbMaxAmount == 0 ? "disabled": ""}>
                                            Buy ${qbButtonStr}
                                        </button>
                                    </td>`;
                    }
                    rowHtml += `<td style="width:0px;"></td></tr>`;

                    // in case you want to add any extra data to the table but still use this script
                    if(typeof window.ModifyMarketDataRow === "function") {
                        rowHtml = window.ModifyMarketDataRow(datum, rowHtml);
                    }
                    html += rowHtml;
                }
            });
            document.getElementById("market-table").innerHTML = html;
        }

        quickBuyOnClick(marketId, amount) {
            IdlePixelPlus.sendMessage("MARKET_PURCHASE=" + marketId + "~" + amount);
            this.refreshMarket(false);
            this.checkWatchers();
        }

        quickBuyOnRightClick(marketId, amount, event) {
            const qbAllNeedsAltKey = this.getConfig("quickBuyAllNeedsAltKey");
            event.preventDefault(); 
            event.stopPropagation();
            if(!qbAllNeedsAltKey || event.altKey) {
                IdlePixelPlus.sendMessage("MARKET_PURCHASE=" + marketId + "~" + amount);
                this.refreshMarket(false);
                this.checkWatchers();
            }
        }

        filterButtonOnClick(category) {
            this.lastSortIndex = 0;
            this.lastCategoryFilter = category;
            if(category != "all") { // Patch to prevent clicking the "All" button event coming through to the category listener without double-toggling
                Modals.toggle("modal-market-select-item");
            }
            this.browseGetTable("all", true);
        }

        filterTable(category) {
            if(category) {
                this.lastCategoryFilter = category;
            }
            else {
                category = this.lastCategoryFilter || "all";
            }

            this.configureTableContextMenu(category);

            this.currentTableData.forEach(datum => {
                if(category === "all")
                    datum.hidden = false;
                else
                    datum.hidden = !(category === datum.market_item_category);
            });

            this.sortTable(this.lastSortIndex);
            this.updateTable();
        }

        sortTable(sortDataIndex) {
            // Split the table data into a visible and hidden array in order to sort the visible one
            const visible = this.currentTableData.filter(datum => !datum.hidden);
            const hidden = this.currentTableData.filter(datum => datum.hidden);

            visible.sort((a, b) => {
                switch(sortDataIndex) {
                    case 0:     return a.market_item_price_each - b.market_item_price_each;
                    case 100:   {
                        const a_avg = isNaN(this.marketAverages[a.market_item_name]) ? 0.001 : this.marketAverages[a.market_item_name];
                        const b_avg = isNaN(this.marketAverages[b.market_item_name]) ? 0.001 : this.marketAverages[b.market_item_name];
                        return ((a.market_item_price_each / a_avg) - 1) - ((b.market_item_price_each / b_avg) - 1);
                    }
                    default:    return a.ratios[sortDataIndex - 1] - b.ratios[sortDataIndex - 1];
                }
            });
            this.currentTableData = visible.concat(hidden);
            this.lastSortIndex = sortDataIndex;
        }

        refreshMarket(disableButtonForABit) {
            if(this.lastBrowsedItem) {
                this.browseGetTable(this.lastBrowsedItem, false);
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
            s = s.toUpperCase().replace(/[^\dKMBT]+/g, "");
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

        // Added by Zlef ->
        handlePurchaseClick() {
            setTimeout(this.displayOwnedInPurchase.bind(this), 100);
        }

        displayOwnedInPurchase() {
            const itemNameElement = $("#modal-market-purchase-item-label");
            const itemName = itemNameElement.text();

            if (!itemName) {
                return;
            }

            const itemNameForQuery = itemName.toLowerCase().replace(/\s/g, '_');
            let itemVar = IdlePixelPlus.getVarOrDefault(itemNameForQuery, "0");

            const containerElement = $("#modal-market-purchase-item-image").parent();

            // Check if the element already exists before appending
            if (!containerElement.find("#amount-owned").length) {
                containerElement.append(`<p id="amount-owned">You own: ${itemVar}</p>`);
            } else {
                // Update the existing element
                containerElement.find("#amount-owned").text(`You own: ${itemVar}`);
            }
        }

        brewingIngClicked(itemBox) {
            if (this.getConfig("clickBrewIng")) {
                const dataItem = itemBox.getAttribute("data-item").toLowerCase();
                if(Market.tradables.find(t => t.item === dataItem)) {
                    this.openMarketToItem(dataItem);
                }
            }
        }

        // Function for opening the market to a specific item
        openMarketToItem(dataItem) {
            // Simulate clicking the Player Market panel
            const playerMarketPanel = document.getElementById("left-panel-item_panel-market");
            if (playerMarketPanel) {
                playerMarketPanel.click();
            }
            switch_panels('panel-player-market');

            const intervalId = setInterval(() => {
                // Check if the market table element is present
                const marketTable = document.getElementById("market-table");
                if (marketTable) {
                    // If it's present, clear the interval and execute function
                    clearInterval(intervalId);
                    Market.browse_get_table(dataItem);
                }
            }, 100);
        }
        //End Zlef

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

        async applyLowestPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            const item = $("#modal-market-configure-item-to-sell-image").attr("src").match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
            const data = await this.fetchBrowseResult(item);
            const lowest = Math.min(...data.map(datum => datum.market_item_price_each));
            $("#modal-market-configure-item-to-sell-price-each").val(Math.max(Math.min(lowest - 1, max), min));
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

        seeMarketOnClick(sellSlotIndex) {
            try {
                const item = $(`#player-market-slot-item-image-${sellSlotIndex}`).attr("src").match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
                this.browseGetTable(item, true);
            } catch(err) {
                console.error(err);
            }
        }

        async fetchMarketHistory(item) {
            const timespanSelect = document.getElementById("history-chart-timespan");
            const timespan = timespanSelect.options[timespanSelect.selectedIndex].value;
            if(item === undefined)
                item = this.lastBrowsedItem;

            $("#history-chart-div").show();

            const response = await fetch(`${MARKET_HISTORY_URL}?item=${item}&range=${timespan}`);
            const data = await response.json();
            const splitData = this.splitHistoryData(data, timespan == "1d" ? "hours" : "days");

            // Create chart object if uninitialized
            if(this.historyChart === undefined){
                this.historyChart = new Chart($("#history-chart"), {
                    type: 'line',
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                grid: {
                                    color: "#77777744"
                                }
                            },
                            y: {
                                beginAtZero: false,
                                grid: {
                                    color: "#77777744"
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        }
                    }
                });
            }
            this.updateHistoryChart(splitData);
        }

        updateHistoryChart(data) {
            const averagePrices = data.map(datum => Math.round(datum.data.map(d => d.price * d.amount)
                                                                              .reduce((a, b) => a + b, 0) / datum.data.map(d => d.amount)
                                                                                                                      .reduce((a, b) => a + b, 0)));
            this.historyChart.options.plugins.tooltip.callbacks.footer = (tooltipItems) => {
                const amountsSum = data[tooltipItems[0].dataIndex].data.map(datum => datum.amount).reduce((a, b) => a + b, 0);
                return `Transaction Volume: ${amountsSum}`;
            }
            this.historyChart.data = {
                labels: data.map(datum => datum.date),
                datasets: [{
                    label: 'Lowest Price',
                    data: data.map(datum => Math.min(...datum.data.map(d => d.price))),
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineMin")
                },
                {
                    label: 'Average Price',
                    data: averagePrices,
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineAverage")
                },
                {
                    label: 'Highest Price',
                    data: data.map(datum => Math.max(...datum.data.map(d => d.price))),
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineMax")
                }]
            };
            this.historyChart.update();
        }

        splitHistoryData(data, bucketSize) {
            var splitData = [];
            data.history.forEach(datum => {
                let match;
                const date = new Date(datum.datetime);
                if(bucketSize == "days")
                    match = splitData.filter(dd => dd.date.getDate() == date.getDate() && dd.date.getMonth() == date.getMonth());
                else if(bucketSize == "hours")
                    match = splitData.filter(dd => dd.date.getHours() == date.getHours());
                if(match.length == 0) {
                    splitData.push({
                        date: date,
                        data: [{price: datum.price, amount: datum.amount}]
                    });
                } else {
                    match[0].data.push({price: datum.price, amount: datum.amount});
                }
            });
            if(bucketSize == "days")
                splitData.forEach(datum => datum.date = datum.date.toString().match(/^[a-zA-Z]+\s([a-zA-Z]+\s[0-9]{1,2})\s/)[1]);
            else if(bucketSize == "hours")
                splitData.forEach(datum => datum.date = `${datum.date.getHours()}h`);
            return splitData;
        }

        async getGlobalMarketHistoryAverages(timespan) {
            const historyResponse = await fetch(`${MARKET_HISTORY_URL}?item=all&range=${timespan}d`);
            this.marketAverages = await historyResponse.json()
                .then((data) => {
                    const sumDict = {};
                    const avgDict = {};
                    data.history.forEach(datum => {
                        sumDict[datum.item] = {
                            sum: sumDict[datum.item] ? sumDict[datum.item]?.sum + datum.price : datum.price,
                            length: sumDict[datum.item] ? sumDict[datum.item].length + 1 : 1,
                        }
                    });
                    Object.entries(sumDict).forEach(([item, datum]) => { 
                        avgDict[item] = datum.sum / datum.length
                    });
                    return avgDict;
                });
        }

        createMarketWatcher() {
            const item = $("#modal-market-configure-item-watcher-label").text().toLowerCase().replace(/\s/g, "_");
            const value = $("#modal-market-configure-item-watcher-price-each").val();
            const lt_gt = $("#modal-market-configure-item-watcher-mode").val() == "1" ? "<" : ">";

            Modals.toggle("modal-market-configure-item-watcher");
            $("#modal-market-configure-item-watcher-ok-button").val("Create Watcher");

            if($("#market-watcher-div").find(`#watched-item-${item}`).length == 0) {
                this.createWatcherElement(item, value, lt_gt);
                $("#market-watcher-div").show();
            }
            else {
                $(`#watched-item-${item}-label`).text(`${lt_gt} ${value}`);
            }

            this.saveWatcherToLocalStorage(item, value, lt_gt);
            this.checkWatchers();
        }

        createWatcherElement(item, value, lt_gt) {
            $("#market-watcher-div").children().last().after(`
            <div id="watched-item-${item}" class="market-tradable-item p-1 m-1 hover shadow" style="background-color:#ffcccc">
                <div align="left" onclick='IdlePixelPlus.plugins.market.browseGetTable(\"${item}\", true); event.stopPropagation();'>
                    <img class="hover" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/search_white.png" width="15px" height="15px" title="search_white">
                </div>
                <div onclick='IdlePixelPlus.plugins.market.watchedItemOnClick(\"${item}\");' style="margin-top: -15px;">
                <div style="display: block;">
                    <img src="${this.getItemIconUrl(item)}" width="50px" height="50px">
                </div>
                <div style="display: block;">
                    <img src="${COIN_ICON_URL}" title="coins">
                    <span class="market-watched-item" id="watched-item-${item}-label">${lt_gt} ${value}</span>
                </div>
                </div>
            </div>`);
        }

        deleteMarketWatcher(item) {
            $(`#watched-item-${item}`).remove();
            if($("#market-watcher-div").find(".market-watched-item").length == 0) {
                $("#market-watcher-div").hide();
            }
            this.removeWatcherFromLocalStorage(item);
        }

        configureItemWatcherModal(item, create) {
            const tradable = Market.tradables.find(t => t.item == item);
            $("#modal-market-configure-item-watcher-image").attr("src", this.getItemIconUrl(item));
            document.getElementById("modal-market-configure-item-watcher-label").textContent = Items.get_pretty_item_name(item);
            document.getElementById("modal-market-configure-item-watcher-low-limit").textContent = tradable.lower_limit;
            document.getElementById("modal-market-configure-item-watcher-high-limit").textContent = tradable.upper_limit;
            if(create){
                $("#modal-market-configure-item-watcher-price-each").val("");
                $("#modal-market-configure-item-watcher-mode").val("1");
                $("#modal-market-configure-item-watcher-ok-button").prop("value", `Create Watcher`);
                $("#modal-market-configure-item-watcher-cancel-button").prop("value", "Cancel");
                $("#modal-market-configure-item-watcher-cancel-button").attr("onclick", "");
            }
            else {
                $("#modal-market-configure-item-watcher-price-each").val($(`#watched-item-${item}-label`).text().match(/[0-9]+/)[0]);
                $("#modal-market-configure-item-watcher-mode").val($(`#watched-item-${item}-label`).text().match(/[><]/)[0] == "<" ? "1" : "2");
                $("#modal-market-configure-item-watcher-ok-button").prop("value", `Edit Watcher`);
                $("#modal-market-configure-item-watcher-cancel-button").prop("value", "Delete Watcher");
                $("#modal-market-configure-item-watcher-cancel-button").attr("onclick", `IdlePixelPlus.plugins.market.deleteMarketWatcher(\"${item}\")`);
            }
        }

        watchItemOnClick() {
            this.configureItemWatcherModal(this.lastBrowsedItem, true);
            Modals.toggle("modal-market-configure-item-watcher");
        }

        watchedItemOnClick(item) {
            this.configureItemWatcherModal(item, false);
            Modals.toggle("modal-market-configure-item-watcher");
        }

        checkWatchers() {
            const notification = document.getElementById("notification-market-watcher");
            const watchedItems = document.querySelectorAll(".market-watched-item");
            const promises = Array.from(watchedItems).map((async (watchedItem) => {
                const id = watchedItem.id;
                const item = id.match(/watched-item-([a-zA-Z0-9_]+)-label/)[1];
                const price = watchedItem.textContent.match(/[0-9]+/)[0];
                const lt_gt = watchedItem.textContent.match(/[><]/)[0];
                //console.log("Running watcher checks..");
                const response = await fetch(`../../market/browse/${item}/`);
                const data = await response.json();

                const sorted = data.map(datum => Math.floor(datum.market_item_price_each * 1.01)).toSorted((a, b) => a - b);
                if(sorted.length > 0 && (lt_gt === ">" && sorted[0] >= price) || (lt_gt === "<" && sorted[0] <= price)) {
                    document.getElementById(`watched-item-${item}`).style.backgroundColor = "#99ffcc";
                    return Promise.resolve();
                }
                else {
                    document.getElementById(`watched-item-${item}`).style.backgroundColor = "#ffcccc";
                    return Promise.reject();
                }
            }));
            Promise.any(promises).then(() =>
                notification.classList.remove("hide")
            ).catch(() =>
                notification.classList.add("hide")
            );
        }

        saveWatcherToLocalStorage(item, value, lt_gt) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHERS);
            const newWatcher = {
                item: item,
                value: value,
                lt_gt: lt_gt
            };
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.watchers = jsonData.watchers.filter(watcher => watcher.item !== item);
                jsonData.watchers.push(newWatcher);
            }
            else {
                jsonData = {
                    watchers: [newWatcher]
                };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY_WATCHERS, JSON.stringify(jsonData));
        }

        removeWatcherFromLocalStorage(item) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHERS);
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.watchers = jsonData.watchers.filter(watcher => watcher.item !== item);
            }
            localStorage.setItem(LOCAL_STORAGE_KEY_WATCHERS, JSON.stringify(jsonData));
        }

        applyWatchersLocalStorage() {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHERS);
            if(ls) {
                const jsonData = JSON.parse(ls);
                if(jsonData.watchers && jsonData.watchers.length > 0) {
                    jsonData.watchers.forEach(watcher => {
                        this.createWatcherElement(watcher.item, watcher.value, watcher.lt_gt);
                    });
                    $("#market-watcher-div").show();
                }
            }
        }

        configureTableContextMenu(category) {
            const contextMenu = document.getElementById("market-sort-context-menu").getElementsByClassName("menu").item(0);
            for(let child of Array.from(contextMenu.querySelectorAll('li:not([id="context-menu-price-each-item"])'))) {
                child.remove();
            }
            if(category in CATEGORY_RATIOS) {
                for(let i = 0; i < CATEGORY_RATIOS[category].length; i++) {
                    contextMenu.innerHTML +=`<li id="context-menu-ratio-${i}" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-ratio-${i}\");'>
                                                <span> ${CATEGORY_RATIOS[category][i]}</span> 
                                            </li>`;
                }
            }
            else if(this.lastSortIndex != 100) {
                this.lastSortIndex = 0;
                this.contextMenuChangeSelected("context-menu-price-each-item");
            }
            contextMenu.innerHTML +=`<li id="context-menu-negative-diff" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-negative-diff\");'>
                                        <span> Trending Value (7d)</span> 
                                    </li>`;
            if(this.lastSortIndex == 0)
                this.contextMenuChangeSelected("context-menu-price-each-item");
            else if(this.lastSortIndex == 100)
                this.contextMenuChangeSelected("context-menu-negative-diff");
            else
                this.contextMenuChangeSelected(`context-menu-ratio-${this.lastSortIndex - 1}`);
        }

        contextMenuChangeSelected(menuItem) {
            const e = document.getElementById("market-sort-context-menu-selected");
            if(e)
                e.remove();
            document.getElementById(menuItem).innerHTML += `<span id="market-sort-context-menu-selected">&#x2714;</span>`;
        }

        contextMenuSelectOnClick(menuItem) {
            this.contextMenuChangeSelected(menuItem);
            let sortDataIndex = 0;

            if(menuItem == "context-menu-negative-diff")
                sortDataIndex = 100;
            else if(menuItem != "context-menu-price-each-item")
                sortDataIndex = parseInt(menuItem.replace(/[^0-9]/g, "")) + 1;
            this.sortTable(sortDataIndex);
            this.updateTable();
        }

        marketHeaderOnClick(event) { 
            document.addEventListener("click", () => document.getElementById("market-sort-context-menu").style.display = "none", { once: true });

            var menu = document.getElementById("market-sort-context-menu");  
            menu.style.display = 'block'; 
            menu.style.left = event.pageX + "px"; 
            menu.style.top = event.pageY + "px";

            event.stopPropagation();
        }

        async preloadMarketTradables() {
            const response = await fetch(MARKET_TRADABLES_URL);
            const data = await response.json();
            Market.tradables = data.tradables;
        }

        getItemIconUrl(item) {
            return `${IMAGE_HOST_URL}/${item}.png`;
        }

        createMarketLogPanel() {
            IdlePixelPlus.addPanel("market-log", "Market Log", function() {
                let content = `
                <div>
                    <table id="market-log-table" class="market-table mt-5" width="90%" style="min-width: 900px;" original-width="90%">
                    </table>
                </div>`;
                return content;
            });
            document.getElementById("left-panel-achievements-btn").nextElementSibling.insertAdjacentHTML("afterend",
            `<div id="left-panel-item_panel-market-log" onclick="switch_panels('panel-market-log')" class="hover hover-menu-bar-item left-menu-item">
                <table class="game-menu-bar-left-table-btn left-menu-item-quests-ach-loot" style="width:100%">
                    <tbody><tr>
                        <td style="width:30px;">
                            <img id="menu-bar-achievements-icon" class="w30" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/player_market.png">
                        </td>
                        <td>
                            MARKET LOG
                        </td>
                    </tr>
                </tbody></table>    
            </div>`);
        }

        storeLogPendingConfirmation(item, amount, price, type) {
            this.pendingConfirmationPurchaseLog = {
                item: item,
                amount: amount,
                price_each: price,
                transaction_type: type
            };
        }

        saveLogToLocalStorage(log) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_LOG);
            const currentTime = new Date();
            log.timestamp = currentTime.toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', hour12: false, minute: '2-digit'});
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.logs.unshift(log);
                if(jsonData.logs.length > LOCAL_STORAGE_LOG_LIMIT)
                    jsonData.logs = jsonData.logs.slice(0, LOCAL_STORAGE_LOG_LIMIT);
            }
            else {
                jsonData = {
                    logs: [log]
                };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY_LOG, JSON.stringify(jsonData));
            this.applyLogLocalStorage();
        }

        applyLogLocalStorage() {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY_LOG);
            let html = `<tr>
                            <th>ITEM</th>
                            <th style="width: 60px;"></th>
                            <th>AMOUNT</th>
                            <th>PRICE EACH</th>
                            <th>TOTAL</th>
                            <th>TRANSACTION</th>
                            <th>TIME</th>
                        </tr>`;
            if(ls) {
                const jsonData = JSON.parse(ls);
                if(jsonData.logs && jsonData.logs.length > 0) {
                    jsonData.logs.forEach(log => {
                        let rowHtml = `<tr>`;
                        rowHtml += `<td>${Items.get_pretty_item_name(log.item)}</td>`;
                        rowHtml += `<td style="width: 60px;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${log.item}.png" /></td>`;
                        rowHtml += `<td>${log.amount}</td>`;
                        rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${log.price_each}`;
                        rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${log.price_each * log.amount}`;
                        rowHtml += `<td>${log.transaction_type}</td>`;
                        rowHtml += `<td>${log.timestamp}</td>`;
                        rowHtml += `</tr>`;
                        html += rowHtml;
                    });
                }
            }
            document.getElementById("market-log-table").innerHTML = html;
        }

        deleteLogLocalStorage() {
            localStorage.setItem(LOCAL_STORAGE_KEY_LOG, "");
        }
    }

    const plugin = new MarketPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();