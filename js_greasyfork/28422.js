// ==UserScript==
// @name         Ted's market UI
// @namespace    Ted's market UI
// @version      1.360
// @description  Ted's Diamond Hunt 2 custom market user interface
// @author       ted120
// @match        http://*.diamondhunt.co/game.php
// @match        https://*.diamondhunt.co/game.php
// @require      https://cdn.rawgit.com/goldfire/pokersolver/7611b7b89b0ee7f4fb7b07e64b65f727f428de37/pokersolver.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28422/Ted%27s%20market%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/28422/Ted%27s%20market%20UI.meta.js
// ==/UserScript==
var updateNews = "Fixed market table. Sorry for delayed update, was away for 3 days.<br><br>";
$(document).ready(function() {
    // nothing needs to be changed in code
    /* TODO

	improve minigames

	MANY THANKS:

	dersat

	florb

	John

	flipskiz

    */
    //thanks florb
    var currentVersion = String(GM_info.script.version),
        versionHistoryString = "";
    $.get("https://greasyfork.org/en/scripts/28422-ted-s-market-ui/versions", function(data) {
        try {
            const FIRST_SEARCH_STRING = 'input type="submit" value="Diff selected versions" data-disable-with="Diff selected versions';
            const UL_START_STRING = '<ul>';
            const UL_END_STRING = '</ul>';
            let html = data;
            // cut away up to first search string
            html = html.substring(html.indexOf(FIRST_SEARCH_STRING) + FIRST_SEARCH_STRING.length);
            // find UL start and end
            html = html.substring(html.indexOf(UL_START_STRING), html.indexOf(UL_END_STRING) + UL_END_STRING.length);
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let lis = doc.getElementsByTagName("li");
            if (lis.length === 0) return;
            var expectedVersion = null;
            for (let i = 0; i < lis.length; i++) {
                let li = lis[i];
                let version = li.getElementsByTagName("a")[0].innerHTML.replace(/v/g, "");
                let versionText = li.lastChild.textContent.trim();
                if (i === 0) {
                    expectedVersion = version;
                }
                if (version == currentVersion) {
                    break;
                }
                versionHistoryString += version + " " + versionText + "\n";
            }
            if (expectedVersion === null) {
                console.log("Could not read expected version, skipping update check");
            } else if (parseInt(currentVersion.replace(/\./g, '')) < parseInt(expectedVersion.replace(/\./g, ''))) {
                if (window.confirm("Ted's Market Script\n\nOutdated Version:\n" + currentVersion + " current\n" + expectedVersion + " expected\n\nOK: Open the script page to manually update\nCancel: Proceed with outdated version\n\nWhat's new?\n\n" + versionHistoryString)) {
                    window.location.href = "https://greasyfork.org/en/scripts/28422-ted-s-market-ui";
                }
            }
        } catch (err) {
            console.log("Error checking for new updates:\n\n" + err);
        }
    });
    let thisTick = playtime;

    function waitForFirstTick() {
        if (thisTick == playtime) {
            setTimeout(function() {
                waitForFirstTick();
            }, 100);
        } else {
            tedsMarketScript();
        }
    }
    waitForFirstTick();

    function tedsMarketScript() {
        var debugToConsole = false;
        if (typeof(jsTradableItems) == "undefined") {
            jsTradableItems = jsTradalbeItems;
        }
        let itemList = {};
        for (let key in (jsTradableItems)) {
            itemList[key] = {
                keepAmount: 0,
                showAtPrice: null,
                alwaysShowLowest: true,
                showAtMin: false
            };
        }
        const defaultSettings = { // thanks WhoIsYou
            notEnoughCoinsOpacity: {
                text: "Display unaffordable market items as transparent?",
                value: true
            },
            showMaxCanBuy: {
                text: "Display maximum quantity purchasable when cannot afford to buy all?",
                value: true
            },
            showTotalPrice: {
                text: "Display total price if buying maximum?",
                value: true
            },
            smallMarketImages: {
                text: "Resize market images smaller?",
                value: true
            },
            itemTooltips: {
                text: "Display item tooltips? (shows after searching market for all items)",
                value: true
            },
            autoUndercut: {
                text: "Smart autofill price to undercut when posting an item?",
                value: true
            },
            marketSlotsCustomUi: {
                text: "[FORCED ON] Display custom market box? (refresh all, price history graph, stargem calc, etc)",
                value: true
            },
            colorMinPrice: {
                text: "Background color of min priced items",
                bgcolor: "#90ee90", //lightgreen
            },
            colorNextLowestToMinPrice: {
                text: "Background color of next lowest offer to min priced items",
                bgcolor: "#ffcc66", //lightorange
            },
            showSingleItems: {
                text: "Show single items on the market?",
                value: false,
            },
            colorSingleItems: {
                text: "Background color of single items",
                bgcolor: "#ffff66", //lightyellow
            },
            colorMyListedLowest: {
                text: "Background color of your listed item at lowest price",
                bgcolor: "#bffffd", //lightblue
            },
            colorMyListedLowestCanRaisePrice: {
                text: "Background color of next lowest offer to your lowest listed item",
                bgcolor: "#6ffffd", //blue
            },
            colorMyListedNotLowest: {
                text: "Background color of your listed item not at lowest price",
                bgcolor: "#ffcccc", //lighterred
            },
            colorLowestForMyListed: {
                text: "Background color of lowest offer for an item you have listed",
                bgcolor: "#ff7878", //lightred
            },
            colorMyItemList: {
                text: "Background color of items that match myItemList",
                bgcolor: "#ff99ff", //lightpink
            },
            colorMyItemListNextLowest: {
                text: "Background color of next lowest offer when an item matches myItemList",
                bgcolor: "#f2f2f2", //lightgrey
            },
            colorAlwaysShowLowest: {
                text: "Background color of alwaysShowLowest items",
                bgcolor: "#d2d2d2", //grey
            },
            tedTradableItems: {
                itemList,
            },
            tradeHistory: [],
            sendMarketData: {
                text: "Allow market data to be sent to the script developer? (When you click infinity symbol the following data is sent at a max of once every 3 mins: All items listed on market when you searched ALL, your username)",
                value: true,
                alert: true,
            },
            useKeepAmount: {
                text: "Remember amount not to sell when posting an item?",
                value: true
            },
            useUndercutBox: {
                text: "Display undercut box when posting an item?",
                value: true
            },
            showCheapestHeat: {
                text: "Display cheapest heat item on market table?",
                value: true,
                showAt: 999999
            },
            showCheapestEnergy: {
                text: "Display cheapest energy item on market table?",
                value: true,
                showAt: 999999
            },
            showCheapestBonemeal: {
                text: "Display cheapest bonemeal item on market table?",
                value: true,
                showAt: 999999
            },
            stardustProfitGreenBox: {
                text: "Show green box when Stardust Potion is profitable?",
                value: false
            },
            superStardustProfitGreenBox: {
                text: "Show green box when Super Stardust Potion is profitable?",
                value: true
            },
            stargemProfitGreenBox: {
                text: "Show green box when Stargem Potion is profitable?",
                value: true
            },
            essenceProfitGreenBox: {
                text: "Show green box when Essence Potion is profitable?",
                value: true
            },
            superEssenceProfitGreenBox: {
                text: "Show green box when Super Essence Potion is profitable?",
                value: true
            },
            brewingPlaceholder: {
                text: "Show max potions brewable as placeholder text?",
                value: true
            },
            craftingVialPlaceholder: {
                text: "Show max vials craftable as placeholder text?",
                value: true
            },
            displayNotificationTreasureMap: {
                text: "Show notification when a treasure map is found?",
                value: true
            },
            poker: {
                availableBalance: 0,
                promotions: {
                    jackpotPool: 0,
                    bbj: {
                        previousWinner: null,
                        previousAmount: 123456789,
                        previousTime: 0,
                    },
                    hhj: {
                        highHand: [],
                    },
                },
            },
        };

        function itemNameFix(string) { // market style name to var style name; Bat Skin > batSkin
            var a = string.replace(/\s/g, "");
            return a.charAt(0).toLowerCase() + a.slice(1);
        }
        if (typeof(localStorage.tedSettings) == "undefined") {
            localStorage.tedSettings = JSON.stringify(defaultSettings);
            console.log("localstorage.tedSettings not found, creating based on defaultSettings");
            console.log(localStorage.tedSettings);
        }
        var tedStoredSettings = JSON.parse(localStorage.getItem("tedSettings"));
        for (var key in defaultSettings) {
            if (!defaultSettings.hasOwnProperty(key)) continue;
            if (tedStoredSettings[key] === undefined) {
                //add from default
                console.log("undefined " + key);
                tedStoredSettings[key] = defaultSettings[key];
                localStorage.tedSettings = JSON.stringify(tedStoredSettings);
                console.log("Key not found, added from default: tedStoredSettings." + key);
                if (key == "tedTradableItems") {
                    console.log("importing old data to tedTradableItems");
                    if (tedStoredSettings.tradableItemsKeepAmount) {
                        for (let i = 0; i < Object.keys(tedStoredSettings.tradableItemsKeepAmount.itemList).length; i++) {
                            tedStoredSettings.tedTradableItems.itemList[Object.keys(tedStoredSettings.tradableItemsKeepAmount.itemList)[i]].keepAmount = tedStoredSettings.tradableItemsKeepAmount.itemList[Object.keys(tedStoredSettings.tradableItemsKeepAmount.itemList)[i]];
                        }
                        delete tedStoredSettings.tradableItemsKeepAmount;
                        console.log("imported and deleted tedStoredSettings.tradableItemsKeepAmount");
                    }
                    if (tedStoredSettings.myItemList) {
                        for (let i = 0; i < tedStoredSettings.myItemList.length; i++) {
                            let itemName = itemNameFix(tedStoredSettings.myItemList[i][0]);
                            let myPrice = tedStoredSettings.myItemList[i][1];
                            tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice = myPrice;
                        }
                        delete tedStoredSettings.myItemList;
                        console.log("imported and deleted tedStoredSettings.myItemList");
                    }
                    if (tedStoredSettings.hideItemList) {
                        /*for (let i = 0; i < tedStoredSettings.hideItemList.length; i++) {
            	let itemName = itemNameFix(tedStoredSettings.hideItemList[i]);
            	tedStoredSettings.tedTradableItems.itemList[itemName].hideItem = true;
            }*/
                        delete tedStoredSettings.hideItemList;
                        console.log("deleted tedStoredSettings.hideItemList");
                    }
                }
            } else if (debugToConsole) {
                console.log("matched " + key);
            }
            for (var prop in defaultSettings[key]) {
                if (tedStoredSettings[key].hasOwnProperty(prop)) continue;
                console.log("tedStoredSettings." + key + "." + prop + " not found; adding from defaultSettings." + key + "." + prop);
                tedStoredSettings[key][prop] = defaultSettings[key][prop];
            }
            if (tedStoredSettings[key].text && tedStoredSettings[key].text != defaultSettings[key].text) {
                tedStoredSettings[key].text = defaultSettings[key].text;
                localStorage.tedSettings = JSON.stringify(tedStoredSettings);
            }
            if (key == "tedTradableItems") { // check that tradableItems contains all tradable items
                for (let i = 0; i < Object.keys(jsTradableItems).length; i++) {
                    if (typeof(tedStoredSettings.tedTradableItems.itemList[Object.keys(jsTradableItems)[i]]) === "undefined") {
                        tedStoredSettings.tedTradableItems.itemList[Object.keys(jsTradableItems)[i]] = {
                            keepAmount: 0,
                            showAtPrice: null,
                            alwaysShowLowest: true,
                            showAtMin: false
                        };
                    } else if (tedStoredSettings.tedTradableItems.itemList[Object.keys(jsTradableItems)[i]].tradeHistory) {
                        delete tedStoredSettings.tedTradableItems.itemList[Object.keys(jsTradableItems)[i]].tradeHistory;
                    }
                }
            }
            if (key == "tradeHistory") {
                // check that tradeHistory objects have "total" property
                if (tedStoredSettings.tradeHistory && tedStoredSettings.tradeHistory[0]) {
                    if (!tedStoredSettings.tradeHistory[0].total) {
                        for (let i = 0; i < tedStoredSettings.tradeHistory.length; i++) {
                            if (typeof(tedStoredSettings.tradeHistory[i].total) == "undefined") {
                                tedStoredSettings.tradeHistory[i].total = (tedStoredSettings.tradeHistory[i].price * tedStoredSettings.tradeHistory[i].amount);
                            }
                        }
                    }
                }
            }
        }
        var notEnoughCoinsOpacity, showMaxCanBuy, showTotalPrice;
        var smallMarketImages, marketImageSize = 30; //pixels, default:50, suggested: 30-40
        var itemTooltips;
        var autoUndercut, undercutBy = 2,
            matchLowestPriceAt = 20;
        var marketSlotsCustomUi;
        var colorMinPrice, colorNextLowestToMinPrice, showSingleItems, colorSingleItems, colorMyListedLowest, colorMyListedLowestCanRaisePrice, colorMyListedNotLowest, colorLowestForMyListed, colorMyItemList, colorMyItemListNextLowest, colorAlwaysShowLowest;
        var refreshMarketAfterBuyingItem_itemName;
        var sendMarketData, sendMarketDataWaitTimeMins = 3 * 60 * 1000;
        var useKeepAmount, useUndercutBox;
        var showCheapestHeat, showCheapestEnergy, showCheapestBonemeal;
        var stardustProfitGreenBox, superStardustProfitGreenBox, stargemProfitGreenBox, essenceProfitGreenBox, superEssenceProfitGreenBox;
        var brewingPlaceholder, craftingVialPlaceholder;
        var displayNotificationTreasureMap;
        var minigamesPokerAvailableBalance;

        function updateVariables() {
            localStorage.tedSettings = JSON.stringify(tedStoredSettings);
            notEnoughCoinsOpacity = tedStoredSettings.notEnoughCoinsOpacity.value;
            showMaxCanBuy = tedStoredSettings.showMaxCanBuy.value;
            showTotalPrice = tedStoredSettings.showTotalPrice.value;
            smallMarketImages = tedStoredSettings.smallMarketImages.value;
            marketImageSize = 30; //pixels, default:50, suggested: 30-40
            itemTooltips = tedStoredSettings.itemTooltips.value;
            autoUndercut = tedStoredSettings.autoUndercut.value;
            marketSlotsCustomUi = true; //tedStoredSettings.marketSlotsCustomUi.value;
            undercutBy = 2;
            matchLowestPriceAt = 20;
            colorMinPrice = tedStoredSettings.colorMinPrice.bgcolor;
            colorNextLowestToMinPrice = tedStoredSettings.colorNextLowestToMinPrice.bgcolor;
            showSingleItems = tedStoredSettings.showSingleItems.value;
            colorSingleItems = tedStoredSettings.colorSingleItems.bgcolor;
            colorMyListedLowest = tedStoredSettings.colorMyListedLowest.bgcolor;
            colorMyListedLowestCanRaisePrice = tedStoredSettings.colorMyListedLowestCanRaisePrice.bgcolor;
            colorMyListedNotLowest = tedStoredSettings.colorMyListedNotLowest.bgcolor;
            colorLowestForMyListed = tedStoredSettings.colorLowestForMyListed.bgcolor;
            colorMyItemList = tedStoredSettings.colorMyItemList.bgcolor;
            colorMyItemListNextLowest = tedStoredSettings.colorMyItemListNextLowest.bgcolor;
            colorAlwaysShowLowest = tedStoredSettings.colorAlwaysShowLowest.bgcolor;
            sendMarketData = tedStoredSettings.sendMarketData.value;
            useKeepAmount = tedStoredSettings.useKeepAmount.value;
            useUndercutBox = tedStoredSettings.useUndercutBox.value;
            showCheapestHeat = tedStoredSettings.showCheapestHeat.value;
            showCheapestEnergy = tedStoredSettings.showCheapestEnergy.value;
            showCheapestBonemeal = tedStoredSettings.showCheapestBonemeal.value;
            stardustProfitGreenBox = tedStoredSettings.stardustProfitGreenBox.value;
            superStardustProfitGreenBox = tedStoredSettings.superStardustProfitGreenBox.value;
            stargemProfitGreenBox = tedStoredSettings.stargemProfitGreenBox.value;
            essenceProfitGreenBox = tedStoredSettings.essenceProfitGreenBox.value;
            superEssenceProfitGreenBox = tedStoredSettings.superEssenceProfitGreenBox.value;
            brewingPlaceholder = tedStoredSettings.brewingPlaceholder.value;
            if (!brewingPlaceholder) document.getElementById("dialogue-brewing-input").removeAttribute("placeholder");
            craftingVialPlaceholder = tedStoredSettings.craftingVialPlaceholder.value;
            if (!craftingVialPlaceholder) document.getElementById("dialogue-multicraft-input").removeAttribute("placeholder");
            displayNotificationTreasureMap = tedStoredSettings.displayNotificationTreasureMap.value;
            minigamesPokerAvailableBalance = tedStoredSettings.poker.availableBalance;
        }
        updateVariables();
        if (tedStoredSettings.sendMarketData.alert === true) {
            //alert("Ted's Market Script: One time alert: " + tedStoredSettings.sendMarketData.text + " currently set to: " + tedStoredSettings.sendMarketData.value + ". This data will be used to create price history graphs and other cool things. If you don't want to be involved you can disable this in Profile & Settings. If you have any questions /pm ted120");
            tedStoredSettings.sendMarketData.alert = false;
            updateVariables();
        }
        var arrMarketItems = {};

        function marketTableLength() {
            return document.getElementById("market-table").rows.length;
        }
        var arrMarketSlots = []; //updateMarketSlots
        for (let msi = 1; 1 == 1; msi++) {
            if (document.getElementById("market-slot-" + msi)) {
                arrMarketSlots.push([0, 0]);
            } else break;
        }
        var marketInterval;
        var marketOn = true;
        var cpi_itemName = "";
        var tickStart = new Date().getTime();
        var tickEnd = new Date().getTime();
        var tickTime = tickEnd - tickStart;
        var tickCheck = 0;
        var sendToSpreadsheet_timeoutStart = new Date().getTime(),
            sendToSpreadsheet_timeout = 0;
        var myItemListAddName, myItemListAddPrice;
        var undercutBoxText = document.createElement("span");
        var keepAmountText = document.createElement("span");
        var ms_collect_repeat = [true, true, true],
            ph_brewing_repeat = true,
            ph_brewing_cur_potion = "",
            ph_vial_repeat = true,
            ph_vial_cur_vial = "";
        var quickCalcStargemBoxShadow, quickCalcSuperStardustBoxShadow, quickCalcStardustBoxShadow, quickCalcEssenceBoxShadow, quickCalcSuperEssenceBoxShadow, quickCalcTooltip = document.createElement("div");
        var quickCalcStargemString = "",
            quickCalcSuperStardustString = "",
            quickCalcStardustString = "",
            quickCalcEssenceString = "",
            quickCalcSuperEssenceString = "";
        var searchAllDelay = 2500;
        var lastBrowsedItem = "Stardust";
        var oreAverageOn = false,
            minigamesOn = false,
            minigameMyTurn = false,
            minigameMyStatus = "free",
            minigameMyPlayer,
            minigameOppPlayer,
            minigameOpp,
            minigameGame,
            minigameVersion,
            minigameSeed,
            minigameQuitReason,
            pokerServerUsername = "tmg",
            minigameCurrentSelectedGame = "Grid Control",
            minigameConnectedToPokerServer = false,
            minigameTryingToConnectToPokerServer = false,
            minigameLastMessageFromPokerServer = -1,
            minigamePokerServerStatus = "unknown",
            minigamePokerMyTable,
            minigamePokerMySeat,
            minigamePokerMyBuyin,
            gc_lastClicked,
            lastHover,
            browserMouseX = 0,
            browserMouseY = 0,
            pingTimeStart = 0,
            pingTime = 0,
            pingSent = false,
            tmg_pokerServerPingSent = false,
            tmg_pokerServerTimeoutVar,
            windLastCheck = -1,
            notifyWindChange = true,
            allowedBrowserNotifications = false,
            minigameManager = {
                challenges: [],
            },
            oreAverageElement = document.createElement("div"),
            minigamesElement = document.createElement("div"),
            currentOreReset = true;
        var oreAverageStartTicks = playtime;
        var oreAverageElapsedTicks;
        var allOres = [
            ["stone", 1],
            ["copper", 2],
            ["tin", 2],
            ["iron", 5],
            ["silver", 10],
            ["gold", 20],
            ["quartz", 30],
            ["marble", 100],
            ["promethium", 1000],
            ["runite", 5000]
        ];
        var minedOres = {};
        for (let i = 0; i < allOres.length; i++) {
            minedOres[allOres[i][0]] = {
                currentAmount: 0,
                price: allOres[i][1],
                startAmount: window[allOres[i][0]],
                oreTick: 0,
                coinTick: 0,
                oreDay: 0,
                coinDay: 0,
            };
        }
        var marketSlotSpareElement = document.createElement("div");
        marketSlotSpareElement.setAttribute("style","margin-left:3px;margin-right:3px");
        var oldDialogueConfirmYesOnclick = document.getElementById('dialogue-confirm-yes').getAttribute("onclick");
        var th_object, th_status = "free",
            thString = "";
        var keepAmountChosenItem = "";
        var cheapestHeat, cheapestEnergy, cheapestBonemeal;
        var totalFlipProfit = 0;
        var cpi_totalPrice;
        var exactMatch = true,
            searchString, exactSearch, searchVal = "";
        var sortedTradeHistory = tedStoredSettings.tradeHistory,
            sortByTH = "date",
            thSortToggle = true;
        var arrSortItemsList = [
            "Stardust",
            "Blood Diamond", "Diamond", "Ruby", "Emerald", "Sapphire",
            "Empty Chisel",
            "Green Rocket Orb", "Green Oil Factory Orb", "Green Oil Storage Orb", "Green Combat Orb", "Green Bow Orb", "Green Bonemeal Bin Orb", "Green Brewing Kit Orb", 
            "Blue Axe Orb", "Blue Chisel Orb", "Blue Fishing Rod Orb", "Blue Hammer Orb", "Blue Oil Pipe Orb", "Blue Pickaxe Orb", "Blue Rake Orb", "Blue Shovel Orb", "Blue Trowel Orb",
            "Essence",
            "Scythe", "Ghost Amulet",
            "Bow", "Ice Arrows", "Fire Arrows", "Arrows",
            "Skeleton Sword", "Skeleton Shield", "Bone Amulet",
            "Iron Dagger", "Stinger",
            "Promethium Helmet Mould", "Promethium Body Mould", "Promethium Legs Mould", "Promethium Gloves Mould", "Promethium Boots Mould", 
            "Essence Logs","Stardust Logs", "Maple Logs", "Willow Logs", "Oak Logs", "Logs",
            "Moon Bones", "Ice Bones", "Bones", "Ashes",
            "Essence Tree Seeds","Stardust Tree Seeds", "Maple Tree Seeds", "Willow Tree Seeds", "Oak Tree Seeds", "Tree Seeds",
            "Striped Crystal Leaf Seeds", "Crystal Leaf Seeds", "Striped Gold Leaf Seeds", "Gold Leaf Seeds", "Blewit Mushroom Seeds", "Red Mushroom Seeds", "Lime Leaf Seeds", "Green Leaf Seeds", "Dotted Green Leaf Seeds", "Snapegrass Seeds",
            "Striped Crystal Leaf", "Crystal Leaf", "Striped Gold Leaf", "Gold Leaf", "Blewit Mushroom", "Red Mushroom", "Stranger Leaf", "Strange Leaf", "Lime Leaf", "Green Leaf", "Dotted Green Leaf", "Snapegrass",
            "Rainbowfish", "Whale", "Shark", "Eel", "Swordfish", "Lobster", "Tuna", "Salmon", "Sardine", "Shrimp",
            "Fishing Bait","Raw Rainbowfish", "Raw Whale", "Raw Shark", "Raw Eel", "Raw Swordfish", "Raw Lobster", "Raw Tuna", "Raw Salmon", "Raw Sardine", "Raw Shrimp", "Wheat",
            "Runite Bar", "Promethium Bar", "Gold Bar", "Silver Bar", "Iron Bar", "Bronze Bar",
            "Runite", "Promethium", "Marble", "Quartz", "Glass", "Sand", "Stone",
            "Bear Fur", "Bat Skin", "Snake Skin"
        ];
        window.pokerServerPlayersConnected = {};
        window.minigamesObject = {
            /*"Poker": {
                tables: {
                    1: {
                        gameInfo: {
                            sb: 1,
                            bb: 2,
                            minBuyin: 100,
                            maxBuyin: 200,
                            minPlayers: 2,
                            maxPlayers: 6,
                            gameType: "Ten Plus",
                        },
                        seats: {
                            "testplayer1": {
                                name: "testplayer1",
                                seat: 3,
                                chips: 206,
                                chipsInPotThisStreet: 0,
                                status: "live",
                            },
                            "testaccount1": {
                                name: "testaccount1",
                                seat: 6,
                                chips: 194,
                                chipsInPotThisStreet: 3,
                                status: "folded",
                            },
                        },
                        currentHand: {
                            currentTurn: "ted120",
                            dealerButton: "ted120",
                            smallBlind: "testaccount1",
                            bigBlind: "test123",
                            flop: ["Ac","9d","7h"],
                            turn: ["8s"],
                            river: ["Ts"],
                            potPreviousStreets: 24,
                            totalPot: 36,
                            lastBetOrRaise: 2,
                        },
                        log: [], // hand history
                        handNumber: 1,
                        globalHandNumber: 1505,
                    },
                    2: {
                        gameInfo: {
                            sb: 2,
                            bb: 4,
                            minBuyin: 200,
                            maxBuyin: 400,
                            minPlayers: 2,
                            maxPlayers: 2,
                            gameType: "Holdem",
                        },
                        seats: {
                            "testplayer2": {
                                name: "testplayer2",
                                seat: 1,
                                chips: 432,
                                chipsInPotThisStreet: 0,
                                status: "live",
                            },
                            "testaccount2": {
                                name: "testaccount2",
                                seat: 2,
                                chips: 345,
                                chipsInPotThisStreet: 3,
                                status: "folded",
                            },
                        },
                        currentHand: {
                            currentTurn: "ted120",
                            dealerButton: "ted120",
                            smallBlind: "testaccount1",
                            bigBlind: "test123",
                            flop: ["Ac","9d","7h"],
                            turn: ["8s"],
                            river: ["Ts"],
                            potPreviousStreets: 24,
                            totalPot: 36,
                            lastBet: 2,
                            lastLastBet: 0,
                        },
                        log: [], // hand history
                        handNumber: 1,
                        globalHandNumber: 1505,
                    },
                },
            },
            */"Grid Control": {
                maps: {
                    "FlipskiZ map gen": {
                        mapGen: true,
                        mapData: [],
                    },
                    "Ted map gen": {
                        mapGen: true,
                        mapData: [],
                    },
                    "Standard map": {
                        mapGen: false,
                        mapData: [{
                            "gc_owner": "player1",
                            "id": 76,
                            "gc_str": 3,
                        }, {
                            "gc_owner": "player2",
                            "id": 4,
                            "gc_str": 3,
                        }, {
                            "gc_owner": "neutral",
                            "id": 60,
                            "gc_str": 2,
                            "gc_bonus": 2,
                        }, {
                            "gc_owner": "neutral",
                            "id": 24,
                            "gc_str": 2,
                            "gc_bonus": 2,
                        }, {
                            "gc_owner": "neutral",
                            "id": 48,
                            "gc_str": 1,
                            "gc_bonus": 1,
                        }, {
                            "gc_owner": "neutral",
                            "id": 30,
                            "gc_str": 1,
                            "gc_bonus": 1,
                        }, {
                            "gc_owner": "neutral",
                            "id": 72,
                            "gc_str": 6,
                            "gc_bonus": 5,
                        }, {
                            "gc_owner": "neutral",
                            "id": 0,
                            "gc_str": 6,
                            "gc_bonus": 5,
                        }, ],
                    },
                },
                players: {
                    "player1": {
                        color: "lightgreen",
                        wins: 0,
                        unitcount: 0,
                    },
                    "player2": {
                        color: "red",
                        wins: 0,
                        unitcount: 0,
                    },
                },
            },
        };
        var coinImg = document.createElement("img");
        coinImg.setAttribute("src", "images/coins.png");
        coinImg.setAttribute("class", "image-icon-20");

        window.sendp2p = function(usernameTo) { //args order; name, main, subs
            if (arguments.length <= 1) return false;
            var sendArray = ["TMG", minigameCurrentSelectedGame];
            if (window.username == pokerServerUsername) {
                sendArray = ["TMG", "Poker"];
            }
            for (let i = 1; i < arguments.length; i++) {
                sendArray.push(arguments[i]);
            }
            p2p(usernameTo, sendArray.join("#"));
            console.log("sent: p2p(\"" + usernameTo + "\",\"" + sendArray.join("#")+"\")");
        };

        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        function drawButtons() {
            var zMarket = document.createElement("div");
            var marketUiButton = document.createElement("button");
            marketUiButton.setAttribute("id", "marketButton");
            marketUiButton.setAttribute("type", "button");
            var oreAverageButton = document.createElement("button");
            oreAverageButton.setAttribute("id", "oreAverageButton");
            oreAverageButton.setAttribute("type", "button");
            var minigamesButton = document.createElement("button");
            minigamesButton.setAttribute("id", "minigamesButton");
            minigamesButton.setAttribute("type", "button");
            var zMap = document.createElement("span");
            zMap.setAttribute("id", "mapSpan");
            zMap.setAttribute("style", "color:gold");
            zMap.innerHTML = "&nbsp;You have an incomplete map!";
            var zVer = document.createElement("span");
            zVer.setAttribute("style", "color:silver");
            zVer.innerHTML = "&nbsp;version: " + GM_info.script.version + "&nbsp;";
            zMarket.setAttribute("id", "zMarketId");
            zMarket.append(marketUiButton);
            zMarket.append(zVer);
            zMarket.append(oreAverageButton);
            zMarket.append(minigamesButton);
            zMarket.append(zMap);
            document.getElementById("game-div").appendChild(zMarket);
            document.getElementById("marketButton").addEventListener("click", marketButtonClickAction, false);
            document.getElementById("oreAverageButton").addEventListener("click", oreAverageButtonClickAction, false);
            document.getElementById("minigamesButton").addEventListener("click", minigamesButtonClickAction, false);
            if (marketOn) {
                document.getElementById("marketButton").innerHTML = "Ted's Market: ON";
            } else document.getElementById("marketButton").innerHTML = "Ted's Market: OFF";
            if (oreAverageOn) {
                document.getElementById("oreAverageButton").innerHTML = "oreAverageText: ON";
            } else document.getElementById("oreAverageButton").innerHTML = "oreAverageText: OFF";
            if (minigamesOn) {
                document.getElementById("minigamesButton").innerHTML = "Minigames: Open";
            } else document.getElementById("minigamesButton").innerHTML = "Minigames: Minimised";
        }

        function nextTick() {
            if (playtime > tickCheck) {
                tickCheck = playtime;
                tickEnd = new Date().getTime();
                tickTime = tickEnd - tickStart;
                if (debugToConsole) {
                    console.log("Tick time: " + tickTime);
                }
                tickStart = new Date().getTime();
                return true;
            } else return false;
        }

        function isInArray(array, search) {
            return array.indexOf(search) >= 0;
        }

        function getNumberValueImproved(number) {
            let orig = number;
            number = (number + "").toLowerCase().replace(/,/g, "");
            if (number.includes("k")) {
                number = number.substr(0, number.length - 1);
                return parseInt(number * 1000);
            } else if (number.includes("m")) {
                number = number.substr(0, number.length - 1);
                return parseInt(number * 1000000);
            } else if (number.includes("b")) {
                number = number.substr(0, number.length - 1);
                return parseInt(number * 1000000000);
            }
            return orig;
        }

        window.numberWithCommas = function(x) { //string
            if (x === null) return null;
            if (typeof(x) == "undefined") return undefined;
            x = getNumberValueImproved(x);
            x = x.toString().replace(/,/g, "");
            return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        window.numberWithoutCommas = function(x) { //int
            x = getNumberValueImproved(x);
            return parseInt(x.toString().replace(/,/g, ""));
        };

        function abbreviate_number(num, fixed) {
            if (num === null) {
                return null;
            } // terminate early
            if (num === 0) {
                return '0';
            } // terminate early
            fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
            var b = (num).toPrecision(2).split("e"), // get power
                k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                c = k < 1 ? num.toFixed(0 + fixed) : k === 1 ? (num / Math.pow(10, k * 3)).toFixed(0) : (num / Math.pow(10, k * 3)).toFixed(0 + fixed), // divide by power
                d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
                e = d + ['', 'k', 'M', 'B', 'T'][k]; // append power
            return e;
        }
        window.openTradeHistory = function() {
            if (tradeHistoryModalBody.style.display != "inline-block") {
                sortTradeHistory("date");
            }
            tradeHistoryModalBody.style.display = "inline-block";
            tradeHistoryModalBodyTable.innerHTML = thString;
            document.getElementById("thSearch").focus();
        };

        function tedMarketUiSettings() {
            var i, j;
            var arrSettingsTH = ["tedMarket Configuration (may require refresh)", "Active"];
            var zSettingsTable = document.createElement("table");
            zSettingsTable.setAttribute("id", "marketSettingsTable");
            zSettingsTable.setAttribute("style", "width:40%;margin-top:3%;margin-bottom:3%;");
            zSettingsTable.setAttribute("class", "table-style1");
            zSettingsTable.setAttribute("align", "center");
            var zSettingsTBody = document.createElement("tbody");
            zSettingsTBody.setAttribute("style", "border-color:black");
            for (i = 0; i < 1; i++) {
                var zSettingsTHRow = document.createElement("tr");
                zSettingsTHRow.setAttribute("style", "background-color:grey;color:black;border-color:grey");
                for (j = 0; j < 2; j++) {
                    var zSettingsTH = document.createElement("th");
                    var cellText = document.createTextNode(arrSettingsTH[j]);
                    zSettingsTH.appendChild(cellText);
                    zSettingsTHRow.appendChild(zSettingsTH);
                }
                zSettingsTBody.appendChild(zSettingsTHRow);
            }
            window.toggleAlwaysShowLowest = function() {
                let isChecked = document.getElementsByClassName("ted-alwaysShowLowest-checkbox")[0].checked;
                for (let i = 0; i < document.getElementsByClassName("ted-alwaysShowLowest-checkbox").length; i++) {
                    document.getElementsByClassName("ted-alwaysShowLowest-checkbox")[i].checked = !isChecked;
                }
            };
            window.toggleShowAtMin = function() {
                let isChecked = document.getElementsByClassName("ted-showAtMin-checkbox")[0].checked;
                for (let i = 0; i < document.getElementsByClassName("ted-showAtMin-checkbox").length; i++) {
                    document.getElementsByClassName("ted-showAtMin-checkbox")[i].checked = !isChecked;
                }
            };
            window.saveItemSettings = function() {
                let showAtPrice = document.getElementsByClassName("ted-showAtPrice-input");
                let alwaysShowLowest = document.getElementsByClassName("ted-alwaysShowLowest-checkbox");
                let showAtMin = document.getElementsByClassName("ted-showAtMin-checkbox");
                for (let i = 0; i < document.getElementsByClassName("ted-showAtPrice-input").length; i++) {
                    let itemName = showAtPrice[i].name;
                    let val = numberWithoutCommas(showAtPrice[i].value);
                    if (isNaN(val)) val = null;
                    if (tedStoredSettings.tedTradableItems.itemList[itemName]) {
                        tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice = val;
                    }
                }
                for (let i = 0; i < alwaysShowLowest.length; i++) {
                    let itemName = alwaysShowLowest[i].name;
                    let val = alwaysShowLowest[i].checked;
                    if (tedStoredSettings.tedTradableItems.itemList[itemName]) {
                        tedStoredSettings.tedTradableItems.itemList[itemName].alwaysShowLowest = val;
                    }
                }
                for (let i = 0; i < showAtMin.length; i++) {
                    let itemName = showAtMin[i].name;
                    let val = showAtMin[i].checked;
                    if (tedStoredSettings.tedTradableItems.itemList[itemName]) {
                        tedStoredSettings.tedTradableItems.itemList[itemName].showAtMin = val;
                    }
                }
                for (let i = 0; i < document.getElementsByClassName("ted-cheapest-stuff").length; i++) {
                    let val = numberWithoutCommas(document.getElementsByClassName("ted-cheapest-stuff")[i].value);
                    if (isNaN(val)) val = 999999;
                    //forgive me
                    if (document.getElementsByClassName("ted-cheapest-stuff")[i].id == "cheapest-Heat-showAtPrice") tedStoredSettings.showCheapestHeat.showAt = val;
                    if (document.getElementsByClassName("ted-cheapest-stuff")[i].id == "cheapest-Energy-showAtPrice") tedStoredSettings.showCheapestEnergy.showAt = val;
                    if (document.getElementsByClassName("ted-cheapest-stuff")[i].id == "cheapest-Bonemeal-showAtPrice") tedStoredSettings.showCheapestBonemeal.showAt = val;
                }
                updateVariables();
                scrollText("none", "lime", "Saved");
            };
            window.changeSetting = function(prop) {
                if (tedStoredSettings && tedStoredSettings[prop]) {
                    if (tedStoredSettings[prop].value === true) {
                        tedStoredSettings[prop].value = false;
                        document.getElementById("celltick-" + prop).setAttribute("src", "images/icons/x.png");
                        updateVariables();
                    } else if (tedStoredSettings[prop].value === false) {
                        tedStoredSettings[prop].value = true;
                        document.getElementById("celltick-" + prop).setAttribute("src", "images/icons/check.png");
                        updateVariables();
                    } else if (tedStoredSettings[prop].bgcolor) {
                        document.getElementById("celltick-" + prop).style.backgroundColor = tedStoredSettings[prop].bgcolor;
                        colorModal.setAttribute("style", "display:block;position:fixed;z-index:1;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.4);");
                        while (colorModalBody.firstChild) {
                            colorModalBody.removeChild(colorModalBody.firstChild);
                        }
                        var colorModalBodyContent = document.createElement("div");
                        colorModalBody.appendChild(colorModalBodyContent);
                        colorModalBodyContent.innerHTML = "";
                        KEYS.forEach((key) => {
                            if (tedStoredSettings[key].bgcolor) {
                                var colorModalInput = document.createElement("input");
                                colorModalInput.setAttribute("id", key);
                                colorModalInput.setAttribute("value", tedStoredSettings[key].bgcolor);
                                colorModalInput.setAttribute("style", "background-color:" + tedStoredSettings[key].bgcolor);
                                colorModalBodyContent.appendChild(colorModalInput);
                                var colorModalAddBtn = document.createElement("button");
                                colorModalAddBtn.setAttribute("onclick", "changeColor('" + key + "',document.getElementById('" + key + "').value);changeSetting('" + key + "')");
                                colorModalAddBtn.append("Change");
                                colorModalBodyContent.append(colorModalInput);
                                colorModalBodyContent.append(colorModalAddBtn);
                                colorModalBodyContent.append(tedStoredSettings[key].text);
                                // tedStoredSettings[key].text+" = "+colorModalInput+" = "+colorModalBtn
                                colorModalBodyContent.innerHTML += '<br><br>';
                            }
                        });
                        var colorResetBtn = document.createElement("button");
                        colorResetBtn.append("RESET COLORS");
                        colorResetBtn.setAttribute("onclick", "resetColors();changeSetting('colorMinPrice');");
                        colorModalBodyContent.append(colorResetBtn);
                    } else if (tedStoredSettings[prop].itemList) {
                        myItemListModal.setAttribute("style", "position:fixed;z-index:1;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.4);display:flex;flex-direction:row;justify-content:center;");
                        while (myItemListModalBody.firstChild) {
                            myItemListModalBody.removeChild(myItemListModalBody.firstChild);
                        }
                        var myItemListModalBodyNameInput = document.createElement("input");
                        myItemListModalBodyNameInput.setAttribute("id", "myItemListModalBodyNameInput");
                        if (typeof(myItemListAddName) == "undefined") myItemListAddName = "";
                        myItemListModalBodyNameInput.setAttribute("value", myItemListAddName);
                        myItemListModalBodyNameInput.setAttribute("placeholder", "Item Name");
                        myItemListModalBody.append(myItemListModalBodyNameInput);
                        var myItemListModalBodyPriceInput = document.createElement("input");
                        myItemListModalBodyPriceInput.setAttribute("id", "myItemListModalBodyPriceInput");
                        myItemListModalBodyPriceInput.setAttribute("onkeydown", "if (event.keyCode == 13) { document.getElementById('myItemListAddBtn').click(); }");
                        if (typeof(myItemListAddPrice) == "undefined") myItemListAddPrice = "";
                        myItemListModalBodyPriceInput.setAttribute("value", myItemListAddPrice);
                        myItemListModalBodyPriceInput.setAttribute("placeholder", "Show At Price");
                        myItemListModalBody.append(myItemListModalBodyPriceInput);
                        var myItemListAddBtn = document.createElement("button");
                        myItemListAddBtn.setAttribute("id", "myItemListAddBtn");
                        myItemListAddBtn.setAttribute("style", "cursor:pointer");
                        myItemListAddBtn.setAttribute("onclick", "myItemListAdd(myItemListModalBodyNameInput.value,myItemListModalBodyPriceInput.value);changeSetting('myItemList')");
                        myItemListAddBtn.append("Add");
                        myItemListModalBody.append(myItemListAddBtn);
                        myItemListModalBody.append(document.createElement("br"));
                        myItemListModalBody.append(document.createElement("br"));
                        var saveItemSettingsBtn = document.createElement("button");
                        saveItemSettingsBtn.setAttribute("id", "saveItemSettingsBtn");
                        saveItemSettingsBtn.setAttribute("style", "cursor:pointer;background-color:lightgreen");
                        saveItemSettingsBtn.setAttribute("onclick", "saveItemSettings();changeSetting('tedTradableItems')");
                        saveItemSettingsBtn.append("Save Item Settings (MUST PUSH AFTER CHANGING BELOW)");
                        myItemListModalBody.append(saveItemSettingsBtn);
                        myItemListModalBody.append(document.createElement("br"));
                        myItemListModalBody.append(document.createElement("br"));
                        var itemListModalBodyString = "";
                        var objCheapest = {
                            heat: {
                                name: "Heat",
                                showAt: tedStoredSettings.showCheapestHeat.showAt,
                                currentLow: cheapestHeat,
                                image: "images/icons/fire.png"
                            },
                            energy: {
                                name: "Energy",
                                showAt: tedStoredSettings.showCheapestEnergy.showAt,
                                currentLow: cheapestEnergy,
                                image: "images/steak.png"
                            },
                            bonemeal: {
                                name: "Bonemeal",
                                showAt: tedStoredSettings.showCheapestBonemeal.showAt,
                                currentLow: cheapestBonemeal,
                                image: "images/filledBonemealBin.png"
                            }
                        };
                        itemListModalBodyString += "<table style='border-spacing:20px 2px'><tbody><tr><th>Cheapest</th><th>Show At Price</th><th>Current Price</th></tr>";
                        Object.keys(objCheapest).forEach((key) => {
                            itemListModalBodyString += "<tr>";
                            itemListModalBodyString += "<td style='text-align:right'>" + objCheapest[key].name + "</td>";
                            var showAt = objCheapest[key].showAt;
                            if (showAt === null) showAt = "";
                            itemListModalBodyString += "<td><input type='text' class='ted-cheapest-stuff' id='cheapest-" + objCheapest[key].name + "-showAtPrice' style='text-align:right;width:90px;padding:2px 5px;' value='" + numberWithCommas(showAt) + "'/></td>";
                            itemListModalBodyString += "<td style='text-align:right'>" + numberWithCommas(objCheapest[key].currentLow) + "</td>";
                            itemListModalBodyString += "</tr>";
                        });
                        itemListModalBodyString += "</tbody></table><br>";
                        itemListModalBodyString += "Left to right priority. Show At Price > Show At Min > Always Show One. To never show an item (red background in table below): Show At Price = empty, Show At Min = unticked, Always Show One = unticked.<br><br>";
                        itemListModalBodyString += "<table style='border-spacing:20px 2px'><tbody><tr><th>Item</th><th>Show At Price</th><th><input type='button' value='Show At Min' onclick='toggleShowAtMin();'></th><th><input type='button' value='Always Show One' onclick='toggleAlwaysShowLowest();'></th></tr>";
                        var showAtPrice;
                        for (var itemName in tedStoredSettings.tedTradableItems.itemList) {
                            if (!isInArray(arrSortItemsList, getItemName(itemName))) {
                                showAtPrice = tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice;
                                if (showAtPrice === null) {
                                    showAtPrice = "";
                                }
                                itemListModalBodyString += "<tr>";
                                itemListModalBodyString += "<td style='text-align:right'>" + getItemName(itemName) + "</td>";
                                itemListModalBodyString += "<td><input type='text' name='" + itemName + "' class='ted-showAtPrice-input' id='" + itemName + "-showAtPrice' style='text-align:right;width:90px;padding:2px 5px;' value='" + numberWithCommas(showAtPrice) + "'/></td>";
                                itemListModalBodyString += "<td style='text-align:center'><input type='checkbox' name='" + itemName + "' class='ted-showAtMin-checkbox' style='width:16px;height:16px;cursor:pointer' /></td>";
                                itemListModalBodyString += "<td style='text-align:center'><input type='checkbox' name='" + itemName + "' class='ted-alwaysShowLowest-checkbox' style='width:16px;height:16px;cursor:pointer' checked='true' /></td>";
                                itemListModalBodyString += "</tr>";
                            }
                        }
                        for (let i = 0; i < arrSortItemsList.length; i++) {
                            itemName = itemNameFix(arrSortItemsList[i]);
                            if (tedStoredSettings.tedTradableItems.itemList[itemName]) {
                                showAtPrice = tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice;
                                if (showAtPrice === null) {
                                    showAtPrice = "";
                                }
                                itemListModalBodyString += "<tr>";
                                itemListModalBodyString += "<td style='text-align:right'>" + getItemName(itemName) + "</td><td>";
                                itemListModalBodyString += "<input type='text' name='" + itemName + "' class='ted-showAtPrice-input' id='" + itemName + "-showAtPrice' style='text-align:right;width:90px;padding:2px 5px;' value='" + numberWithCommas(showAtPrice) + "'/></td>";
                                itemListModalBodyString += "<td style='text-align:center'><input type='checkbox' name='" + itemName + "' class='ted-showAtMin-checkbox' style='width:16px;height:16px;cursor:pointer' /></td>";
                                itemListModalBodyString += "<td style='text-align:center'><input type='checkbox' name='" + itemName + "' class='ted-alwaysShowLowest-checkbox' style='width:16px;height:16px;cursor:pointer' /></td>";
                                itemListModalBodyString += "</tr>";
                            }
                        }
                        itemListModalBodyString += "</tbody></table>";
                        myItemListModalBody.innerHTML += itemListModalBodyString;
                        for (let i = 0; i < document.getElementsByClassName("ted-alwaysShowLowest-checkbox").length; i++) {
                            let itemName = document.getElementsByClassName("ted-alwaysShowLowest-checkbox")[i].name;
                            document.getElementsByClassName("ted-alwaysShowLowest-checkbox")[i].checked = tedStoredSettings.tedTradableItems.itemList[itemName].alwaysShowLowest;
                        }
                        for (let i = 0; i < document.getElementsByClassName("ted-showAtMin-checkbox").length; i++) {
                            let itemName = document.getElementsByClassName("ted-showAtMin-checkbox")[i].name;
                            document.getElementsByClassName("ted-showAtMin-checkbox")[i].checked = tedStoredSettings.tedTradableItems.itemList[itemName].showAtMin;
                        }
                        for (let i = 0; i < document.getElementsByClassName("ted-showAtPrice-input").length; i++) {
                            let itemName = document.getElementsByClassName("ted-showAtPrice-input")[i].name;
                            if (document.getElementsByName(itemName)[0].value === "" && document.getElementsByName(itemName)[1].checked === false && document.getElementsByName(itemName)[2].checked === false) {
                                upToParentByTag(document.getElementById(itemName + "-showAtPrice"), "tr").style.backgroundColor = "#ff7878";
                            }
                        }
                        document.getElementById("myItemListModalBodyPriceInput").focus();
                        setTimeout(function() {
                            document.getElementById("myItemListModalBodyPriceInput").selectionStart = document.getElementById("myItemListModalBodyPriceInput").selectionEnd = 10000;
                        }, 0);
                    }
                }
            };
            const KEYS = Object.keys(defaultSettings);
            KEYS.forEach((key) => {
                if (!tedStoredSettings[key].hideFromSettings && key !== "tradeHistory") {
                    var zSettingsRow = document.createElement("tr");
                    var zSettingsCell = document.createElement("td");
                    zSettingsCell.setAttribute("style", "text-align:left;padding:0px 5px;");
                    var cellText = document.createTextNode(tedStoredSettings[key].text);
                    if (key == "tedTradableItems") {
                        cellText = document.createTextNode("Click to open item settings menu");
                    }
                    var cellTick = document.createElement("div");
                    if (tedStoredSettings[key].value === true) {
                        cellTick = document.createElement("img");
                        cellTick.setAttribute("src", "images/icons/check.png");
                        cellTick.setAttribute("style", "width:20px;height:20px;vertical-align:bottom");
                    } else if (tedStoredSettings[key].value === false) {
                        cellTick = document.createElement("img");
                        cellTick.setAttribute("src", "images/icons/x.png");
                        cellTick.setAttribute("style", "width:20px;height:20px;vertical-align:bottom");
                    } else if (tedStoredSettings[key].bgcolor) {
                        cellTick.setAttribute("style", "display:block;background-color:" + tedStoredSettings[key].bgcolor);
                        cellTick.innerHTML = "+";
                    }
                    zSettingsRow.setAttribute("id", "checkbox-" + key);
                    zSettingsRow.setAttribute("onclick", "changeSetting('" + key + "')");
                    cellTick.setAttribute("id", "celltick-" + key);
                    zSettingsCell.appendChild(cellText);
                    zSettingsRow.appendChild(zSettingsCell);
                    zSettingsCell = document.createElement("td");
                    zSettingsCell.appendChild(cellTick);
                    zSettingsRow.appendChild(zSettingsCell);
                    zSettingsRow.setAttribute("align", "center");
                    zSettingsTBody.appendChild(zSettingsRow);
                }
            });
            zSettingsTable.appendChild(zSettingsTBody);
            document.getElementById("tab-container-profile").appendChild(zSettingsTable);
            var hideItemListModal = document.createElement("div");
            hideItemListModal.setAttribute("id", "hideItemListModal");
            hideItemListModal.setAttribute("style", "display:none");
            var hideItemListModalBody = document.createElement("div");
            hideItemListModalBody.setAttribute("id", "hideItemListModalBody");
            hideItemListModalBody.setAttribute("style", "background-color:#ffcc44;padding:1%;margin:2%;");
            document.getElementById("game-div").append(hideItemListModal);
            document.getElementById("hideItemListModal").append(hideItemListModalBody);
            window.myItemListRemove = function(itemName) {
                tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice = null;
                updateVariables();
            };
            window.myItemListAdd = function(itemName, price) {
                itemName = itemNameFix(itemName);
                price = numberWithoutCommas(price);
                if (!isNaN(price)) {
                    if (tedStoredSettings.tedTradableItems.itemList[itemName]) {
                        tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice = price;
                        document.getElementById(itemName + "-showAtPrice").value = numberWithCommas(price);
                        document.getElementById("myItemListModalBodyNameInput").value = "";
                        document.getElementById("myItemListModalBodyPriceInput").value = "";
                        updateVariables();
                        scrollText("none", "lime", "Added " + getItemName(itemName) + " @ " + price);
                        return;
                    }
                }
                scrollText("none", "red", "Failed to add " + getItemName(itemName) + " @ " + price);
            };
            var myItemListModal = document.createElement("div");
            myItemListModal.setAttribute("id", "myItemListModal");
            myItemListModal.setAttribute("style", "display:none");
            var myItemListModalBody = document.createElement("div");
            myItemListModalBody.setAttribute("id", "myItemListModalBody");
            myItemListModalBody.setAttribute("style", "background-color:#ffcc44;padding:1%;margin:10%;overflow-y:scroll;min-height:200px;");
            document.getElementById("game-div").append(myItemListModal);
            document.getElementById("myItemListModal").append(myItemListModalBody);
            window.changeColor = function(key, color) {
                tedStoredSettings[key].bgcolor = color;
                updateVariables();
            };
            window.resetColors = function() {
                KEYS.forEach((key) => {
                    if (tedStoredSettings[key].bgcolor) {
                        tedStoredSettings[key].bgcolor = defaultSettings[key].bgcolor;
                        document.getElementById("celltick-" + key).style.backgroundColor = tedStoredSettings[key].bgcolor;
                    }
                });
                updateVariables();
            };
            var colorModal = document.createElement("div");
            colorModal.setAttribute("id", "colorModal");
            colorModal.setAttribute("style", "display:none");
            var colorModalBody = document.createElement("div");
            colorModalBody.setAttribute("id", "colorModalBody");
            colorModalBody.setAttribute("style", "position:fixed;bottom:0;background-color:#fefefe;width:100%;padding:5%");
            document.getElementById("game-div").append(colorModal);
            document.getElementById("colorModal").append(colorModalBody);
            window.onclick = function(event) {
                if (event.target == hideItemListModal) {
                    hideItemListModal.style.display = "none";
                }
                if (event.target == myItemListModal) {
                    myItemListModal.style.display = "none";
                }
                if (event.target == colorModal) {
                    colorModal.style.display = "none";
                }
            };
        }

        function quickCalcMain() {
            var i, a, b;
            var arrQuickCalcHeat = ["Error, search for all (infinity symbol)", 999999, 0, 999999, 0, 0]; // name, heatprice, amount, logprice, heat, row
            var arrLogs = [
                ["Logs", 1],
                ["Oak Logs", 2],
                ["Willow Logs", 5],
                ["Maple Logs", 10],
                ["Stardust Logs", 20],
                ["Essence Logs", 30]
            ];
            var arrQuickCalcEnergy = ["Error, search for all (infinity symbol)", 999999, 0, 999999, 0, 0]; // name, energyprice, amount, fishprice, energy, row
            var arrEnergy = [
                ["Shrimp", 50],
                ["Sardine", 400],
                ["Tuna", 1000],
                ["Swordfish", 7500],
                ["Shark", 20000]
            ];
            var arrQuickCalcBonemeal = ["Error, search for all (infinity symbol)", 999999, 0, 999999, 0, 0]; // name, bonemealprice, amount, boneprice, bonemeal, row
            var arrBonemeal = [
                ["Bones", 1],
                ["Ashes", 2],
                ["Ice Bones", 3]
            ];
            var hasBrewingKit;
            var arrStargemInput = [
                ["Blewit Mushroom", 100, 0, 0],
                ["Gold Leaf", 1, 0, 0],
                ["Sapphire", 1, 0, 0],
                ["Emerald", 1, 0, 0],
                ["Ruby", 1, 0, 0],
                ["Diamond", 1, 0, 0],
                ["Sand", 25, 0, 0],
                ["Glass", 25, 0, 0]
            ]; //name,amt need, amt have, ttl price
            var arrStargemOutput = [
                ["Stardust", 0]
            ]; // name, price
            var arrEssenceInput = [
                ["Dotted Green Leaf", 5, 0, 0],
                ["Blewit Mushroom", 30, 0, 0]
            ]; //name,amt need, amt have, ttl price
            var arrEssenceOutput = [
                ["Essence", 0]
            ];
            var arrSuperEssenceInput = [
                ["Dotted Green Leaf", 25, 0, 0],
                ["Blewit Mushroom", 100, 0, 0]
            ];
            var arrSuperEssenceOutput = [
                ["Essence", 0]
            ];
            var arrSmallVialInput = [
                ["Glass", 5, 0, 0],
                ["Sand", 5, 0, 0]
            ]; //or
            var arrSuperStardustInput = [
                ["Lime Leaf", 5, 0, 0],
                ["Snapegrass", 50, 0, 0]
            ];
            var arrSuperStardustOutput = [
                ["Stardust", 0]
            ];
            var potionDurationModifier = 1 + (achBrewingEasyCompleted * 0.05);
            var perkEssenceChanceModifier = (achBrewingHardCompleted * 0.75 || achBrewingMediumCompleted * 0.9 || 1),
                essencePotionEssenceChance =     (16000 - (getLevel(miningXp) * 150)) * perkEssenceChanceModifier,
                superEssencePotionEssenceChance = (8000 - (getLevel(miningXp) * 75)) * perkEssenceChanceModifier;
            var avgSdGainStardustPotion =        Math.floor( ((0 + 40) * (1 + (achBrewingEasyCompleted * 0.05))) / 2),//per tick
                avgSdGainSuperStardustPotion =  Math.floor( ((0 + 220) * (1 + (achBrewingEasyCompleted * 0.05))) / 2),// per tick
                essencePotionAvgEssence =      (1 / essencePotionEssenceChance),
                superEssencePotionAvgEssence = (1 / superEssencePotionEssenceChance);
            var stardustPotionDuration = 		 Math.floor(300 * (1 + ((getLevel(brewingXp) / 100 * 0.2) * potionDurationModifier) )),
                superStardustPotionDuration = 	 Math.floor(300 * (1 + ((getLevel(brewingXp) / 100 * 0.2) * potionDurationModifier) )),
                essencePotionDuration = 		Math.floor(3600 * (1 + ((getLevel(brewingXp) / 100 * 0.2) * potionDurationModifier) )),
                superEssencePotionDuration = 	Math.floor(3600 * (1 + ((getLevel(brewingXp) / 100 * 0.2) * potionDurationModifier) ));
            avgSdGainStardustPotion = avgSdGainStardustPotion * stardustPotionDuration;
            avgSdGainSuperStardustPotion = avgSdGainSuperStardustPotion * superStardustPotionDuration;
            essencePotionAvgEssence = essencePotionAvgEssence * essencePotionDuration;
            superEssencePotionAvgEssence = superEssencePotionAvgEssence * superEssencePotionDuration;

            var arrStardustInput = [
                ["Dotted Green Leaf", 1, 0, 0],
                ["Red Mushroom", 25, 0, 0]
            ];
            var arrStardustOutput = [
                ["Stardust", 0]
            ];
            var lowestVial, lowestVialSource, lowestSmallVial, lowestSmallVialSource;
            var stargemNetMinusOne, stargemNet, stargemNetPlusOne, totalPrice;

            function calculateAndModifyHeatEnergy(array, array2) {
                var pricePerHeat;
                for (a = 0; a < array.length; a++) {
                    let itemName = itemNameFix(array[a][0]);
                    if (arrMarketItems[itemName]) {
                        let itemPrice = arrMarketItems[itemName][0].price;
                        let itemAmount = arrMarketItems[itemName][0].amount;
                        let itemRow = arrMarketItems[itemName][0].row;
                        if (typeof(pricePerHeat) == "undefined" || itemPrice / array[a][1] < pricePerHeat) {
                            pricePerHeat = itemPrice / array[a][1];
                            //if (pricePerHeat < array2[1]) {
                            array2[0] = array[a][0];
                            array2[1] = Math.ceil(itemPrice / array[a][1]);
                            array2[2] = itemAmount;
                            array2[3] = itemPrice;
                            array2[4] = array[a][1];
                            array2[5] = itemRow;
                        }
                        if (itemName == "stardustLogs") {
                            if (arrMarketItems.stardust[0]) {
                                let avgSdValue = ((2500 + 10000) / 2) * (arrMarketItems.stardust[0].price - 1);
                                let sdLogHeatCost = Math.ceil((itemPrice - avgSdValue) / array[a][1]);
                                if (sdLogHeatCost < array2[1]) {
                                    array2[0] = array[a][0];
                                    array2[1] = sdLogHeatCost;
                                    array2[2] = itemAmount;
                                    array2[3] = itemPrice;
                                    array2[4] = array[a][1];
                                    array2[5] = itemRow;
                                }
                            }
                        } else if (itemName == "essenceLogs") {
                            if (arrMarketItems.essence) {
                                let avgFragValue = ((1 + 14) / 200) * (arrMarketItems.essence[0].price * 0.95);
                                let essLogHeatCost = Math.ceil((itemPrice - avgFragValue) / array[a][1]);
                                if (essLogHeatCost < array2[1]) {
                                    array2[0] = array[a][0];
                                    array2[1] = essLogHeatCost;
                                    array2[2] = itemAmount;
                                    array2[3] = itemPrice;
                                    array2[4] = array[a][1];
                                    array2[5] = itemRow;
                                }
                            }
                        }
                        if (debugToConsole) {
                            console.item(itemName, itemPrice / array[a][1], itemAmount);
                        }
                        if (debugToConsole) {
                            console.item(array2[0], array2[1], array2[2]);
                        }
                    }
                }
            }

            function calculateAndModifyInput(array) {
                for (a = 0; a < array.length; a++) {
                    let itemName = itemNameFix(array[a][0]);
                    if (arrMarketItems[itemName]) {
                        for (b = 0; b < arrMarketItems[itemName].length; b++) {
                            if (array[a][2] < array[a][1]) {
                                if (arrMarketItems[itemName][b].amount < array[a][1] - array[a][2]) {
                                    array[a][2] += arrMarketItems[itemName][b].amount;
                                    array[a][3] += arrMarketItems[itemName][b].price * arrMarketItems[itemName][b].amount;
                                } else if (arrMarketItems[itemName][b].amount >= array[a][1] - array[a][2]) {
                                    array[a][3] += (array[a][1] - array[a][2]) * arrMarketItems[itemName][b].price;
                                    array[a][2] = array[a][1];
                                }
                                if (debugToConsole) {
                                    console.log(array[a][0], array[a][1], array[a][2], array[a][3]);
                                }
                            }
                        }
                    }
                }
            }

            function calculateAndModifyOutput(array) {
                for (a = 0; a < array.length; a++) {
                    let output = itemNameFix(array[a][0]);
                    if (arrMarketItems[output]) {
                        array[a][1] = arrMarketItems[output][0].price;
                        break;
                    }
                }
            }
            if (typeof(document.getElementById("market-table").rows[1]) == "undefined" || document.getElementById("market-table").rows[1] === null) {} else if (typeof(document.getElementById("market-table").rows[1]) != "undefined" && document.getElementById("market-table").rows[1] !== null) {
                //heat
                calculateAndModifyHeatEnergy(arrLogs, arrQuickCalcHeat);
                //energy
                calculateAndModifyHeatEnergy(arrEnergy, arrQuickCalcEnergy);
                //bonemeal
                calculateAndModifyHeatEnergy(arrBonemeal, arrQuickCalcBonemeal);
                //small vial
                calculateAndModifyInput(arrSmallVialInput);
                //stardust
                calculateAndModifyInput(arrStardustInput);
                calculateAndModifyOutput(arrStardustOutput);
                //super stardust
                calculateAndModifyInput(arrSuperStardustInput);
                calculateAndModifyOutput(arrSuperStardustOutput);
                //stargem
                calculateAndModifyInput(arrStargemInput);
                calculateAndModifyOutput(arrStargemOutput);
                //stargem
                calculateAndModifyInput(arrEssenceInput);
                calculateAndModifyOutput(arrEssenceOutput);
                //stargem
                calculateAndModifyInput(arrSuperEssenceInput);
                calculateAndModifyOutput(arrSuperEssenceOutput);
                //small vial stuff
                if (arrSmallVialInput[0][2] == arrSmallVialInput[0][1] && arrSmallVialInput[1][2] == arrSmallVialInput[1][1]) { // enough both
                    if (arrSmallVialInput[1][3] <= arrSmallVialInput[0][3]) {
                        lowestSmallVial = arrSmallVialInput[1][3];
                        lowestSmallVialSource = arrSmallVialInput[1][0];
                    } else if (arrSmallVialInput[0][3] < arrSmallVialInput[1][3]) {
                        lowestSmallVial = arrSmallVialInput[0][3];
                        lowestSmallVialSource = arrSmallVialInput[0][0];
                    }
                } else if (arrSmallVialInput[0][2] == arrSmallVialInput[0][1] && arrSmallVialInput[1][2] != arrSmallVialInput[1][1]) { // glass only
                    lowestSmallVial = arrSmallVialInput[0][3];
                    lowestSmallVialSource = arrSmallVialInput[0][0];
                } else if (arrSmallVialInput[0][2] != arrSmallVialInput[0][1] && arrSmallVialInput[1][2] == arrSmallVialInput[1][1]) { // sand only
                    lowestSmallVial = arrSmallVialInput[1][3];
                    lowestSmallVialSource = arrSmallVialInput[1][0];
                } else if (arrSmallVialInput[0][2] != arrSmallVialInput[0][1] && arrSmallVialInput[1][2] != arrSmallVialInput[1][1]) { // not enough both
                    lowestSmallVial = 0;
                    lowestSmallVialSource = "<span style='color:red;background-color:black;'>ERR: Sand & Glass < 5</span>";
                }

                //stardust tooltip hover
                var dottedGreenLeafPrice = arrStardustInput[0][3];
                var redMushroomPrice = arrStardustInput[1][3];
                var lowestSmallVialPrice = lowestSmallVial;
                if (boundBrewingKit == 1) {
                    hasBrewingKit = true;
                    for (i = 0; i < 2; i++) {
                        arrStardustInput[i][3] = Math.ceil(arrStardustInput[i][3] / 1.1); // brewing kit 10% free ingredients
                    }
                    lowestSmallVialPrice = Math.ceil(lowestSmallVialPrice / 1.1); // brewing kit 10% free vial
                } else hasBrewingKit = false;
                quickCalcStardustString = "";
                quickCalcStardustBoxShadow = false;
                if (arrStardustInput[0][1] == arrStardustInput[0][2] && arrStardustInput[1][1] == arrStardustInput[1][2]) {
                    quickCalcStardustString += "<span style='float:left;padding:5px;'>Stardust Profit</span>";
                    if (hasBrewingKit) {
                        quickCalcStardustString += "<span style='float:right;padding:5px;color:green;'>+Brewing Kit</span>";
                    } else quickCalcStardustString += "<span style='float:right;padding:5px;color:black;'><s style='color:red'>Brewing Kit</s></span>";
                    quickCalcStardustString += "<br>";
                    quickCalcStardustString += "<table style='text-align:center;padding:0 2px;' class='top-bar'><tbody><tr style='text-align:center'><th></th><th>Cost</th><th style='color:silver'>" + (arrStargemOutput[0][1] - 1) + "</th><th>" + (arrStargemOutput[0][1]) + "</th><th style='color:silver'>" + (arrStargemOutput[0][1] + 1) + "</th></tr>";
                    stargemNetMinusOne = abbreviate_number(((arrStargemOutput[0][1] - 1) * avgSdGainStardustPotion) - (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice), 1);
                    stargemNet = abbreviate_number(((arrStargemOutput[0][1]) * avgSdGainStardustPotion) - (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice), 1);
                    stargemNetPlusOne = abbreviate_number(((arrStargemOutput[0][1] + 1) * avgSdGainStardustPotion) - (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice), 1);
                    quickCalcStardustString += "<tr>";
                    quickCalcStardustString += "<td style='text-align:center'><img class='image-icon-20' src='images/stardustPotion.png'></td>";
                    totalPrice = (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice);
                    quickCalcStardustString += "<td>" + abbreviate_number(totalPrice, 2) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcStardustString += "<td></td>";
                    } else if (stargemNetMinusOne.indexOf("-") >= 0) {
                        quickCalcStardustString += "<td style='color:red'>" + stargemNetMinusOne + "</td>";
                    } else {
                        quickCalcStardustString += "<td style='color:lightgreen'>" + stargemNetMinusOne + "</td>";
                        quickCalcStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcStardustString += "<td></td>";
                    } else if (stargemNet.indexOf("-") >= 0) {
                        quickCalcStardustString += "<td style='color:red'>" + stargemNet + "</td>";
                    } else {
                        quickCalcStardustString += "<td style='color:lightgreen'>" + stargemNet + "</td>";
                        quickCalcStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcStardustString += "<td></td>";
                    } else if (stargemNetPlusOne.indexOf("-") >= 0) {
                        quickCalcStardustString += "<td style='color:red'>" + stargemNetPlusOne + "</td>";
                    } else {
                        quickCalcStardustString += "<td style='color:lightgreen'>" + stargemNetPlusOne + "</td>";
                    }
                    quickCalcStardustString += "</tr>";
                    stargemNetMinusOne = abbreviate_number(24 * 12 * (((arrStargemOutput[0][1] - 1) * avgSdGainStardustPotion) - (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice)), 1);
                    stargemNet = abbreviate_number(24 * 12 * (((arrStargemOutput[0][1]) * avgSdGainStardustPotion) - (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice)), 1);
                    stargemNetPlusOne = abbreviate_number(24 * 12 * (((arrStargemOutput[0][1] + 1) * avgSdGainStardustPotion) - (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice)), 1);
                    quickCalcStardustString += "<tr>";
                    quickCalcStardustString += "<td style='text-align:center;color:gold;'>24h</td>";
                    totalPrice = 24 * 12 * (arrStardustInput[0][3] + arrStardustInput[1][3] + lowestSmallVialPrice);
                    quickCalcStardustString += "<td>" + abbreviate_number(totalPrice, 1) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcStardustString += "<td></td>";
                    } else if (stargemNetMinusOne.indexOf("-") >= 0) {
                        quickCalcStardustString += "<td style='color:red'>" + stargemNetMinusOne + "</td>";
                    } else {
                        quickCalcStardustString += "<td style='color:lightgreen'>" + stargemNetMinusOne + "</td>";
                        quickCalcStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcStardustString += "<td></td>";
                    } else if (stargemNet.indexOf("-") >= 0) {
                        quickCalcStardustString += "<td style='color:red'>" + stargemNet + "</td>";
                    } else {
                        quickCalcStardustString += "<td style='color:lightgreen'>" + stargemNet + "</td>";
                        quickCalcStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcStardustString += "<td></td>";
                    } else if (stargemNetPlusOne.indexOf("-") >= 0) {
                        quickCalcStardustString += "<td style='color:red'>" + stargemNetPlusOne + "</td>";
                    } else {
                        quickCalcStardustString += "<td style='color:lightgreen'>" + stargemNetPlusOne + "</td>";
                    }
                    quickCalcStardustString += "</tr>";
                    quickCalcStardustString += "</tbody></table>";
                    quickCalcStardustString += arrStardustInput[0][0] + ": " + abbreviate_number(dottedGreenLeafPrice, 0) + "<br>";
                    quickCalcStardustString += arrStardustInput[1][0] + ": " + abbreviate_number(redMushroomPrice, 0) + "<br>";
                    quickCalcStardustString += lowestSmallVialSource + ": " + abbreviate_number(lowestSmallVial, 0) + "<br><br>";
                    quickCalcStardustString += "Avg SD: " + numberWithCommas(avgSdGainStardustPotion) + "<br>";
                    var stardustPotionDurationDate = new Date(null);
                    stardustPotionDurationDate.setSeconds(stardustPotionDuration);
                    var stardustPotionDurationDateFormatted = stardustPotionDurationDate.toISOString().substr(14, 5);
                    quickCalcStardustString += "Potion Duration: " + stardustPotionDurationDateFormatted;
                }
                if (arrStardustInput[0][1] != arrStardustInput[0][2]) quickCalcStardustString += "Not enough " + arrStardustInput[0][0] + " " + arrStardustInput[0][2] + "/" + arrStardustInput[0][1] + "<br>";
                if (arrStardustInput[1][1] != arrStardustInput[1][2]) quickCalcStardustString += "Not enough " + arrStardustInput[1][0] + " " + arrStardustInput[1][2] + "/" + arrStardustInput[1][1] + "<br>";
                //super stardust tooltip hover
                var limeLeafPrice = arrSuperStardustInput[0][3];
                var snapegrassPrice = arrSuperStardustInput[1][3];
                lowestSmallVialPrice = lowestSmallVial;
                if (boundBrewingKit == 1) {
                    hasBrewingKit = true;
                    for (i = 0; i < 2; i++) {
                        arrSuperStardustInput[i][3] = Math.ceil(arrSuperStardustInput[i][3] / 1.1); // brewing kit 10% free ingredients
                    }
                    lowestSmallVialPrice = Math.ceil(lowestSmallVialPrice / 1.1); // brewing kit 10% free vial
                } else hasBrewingKit = false;
                quickCalcSuperStardustString = "";
                quickCalcSuperStardustBoxShadow = false;
                if (arrSuperStardustInput[0][1] == arrSuperStardustInput[0][2] && arrSuperStardustInput[1][1] == arrSuperStardustInput[1][2]) {
                    quickCalcSuperStardustString += "<span style='float:left;padding:5px;'>S Stardust Profit</span>";
                    if (hasBrewingKit) {
                        quickCalcSuperStardustString += "<span style='float:right;padding:5px;color:green;'>+Brewing Kit</span>";
                    } else quickCalcSuperStardustString += "<span style='float:right;padding:5px;color:black;'><s style='color:red'>Brewing Kit</s></span>";
                    quickCalcSuperStardustString += "<br>";
                    quickCalcSuperStardustString += "<table style='text-align:center;padding:0 2px;' class='top-bar'><tbody><tr style='text-align:center'><th></th><th>Cost</th><th style='color:silver'>" + (arrStargemOutput[0][1] - 1) + "</th><th>" + (arrStargemOutput[0][1]) + "</th><th style='color:silver'>" + (arrStargemOutput[0][1] + 1) + "</th></tr>";
                    stargemNetMinusOne = abbreviate_number(((arrStargemOutput[0][1] - 1) * avgSdGainSuperStardustPotion) - (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice), 1);
                    stargemNet = abbreviate_number(((arrStargemOutput[0][1]) * avgSdGainSuperStardustPotion) - (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice), 1);
                    stargemNetPlusOne = abbreviate_number(((arrStargemOutput[0][1] + 1) * avgSdGainSuperStardustPotion) - (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice), 1);
                    quickCalcSuperStardustString += "<tr>";
                    quickCalcSuperStardustString += "<td style='text-align:center'><img class='image-icon-20' src='images/superStardustPotion.png'></td>";
                    totalPrice = (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice);
                    quickCalcSuperStardustString += "<td>" + abbreviate_number(totalPrice, 2) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperStardustString += "<td></td>";
                    } else if (stargemNetMinusOne.indexOf("-") >= 0) {
                        quickCalcSuperStardustString += "<td style='color:red'>" + stargemNetMinusOne + "</td>";
                    } else {
                        quickCalcSuperStardustString += "<td style='color:lightgreen'>" + stargemNetMinusOne + "</td>";
                        quickCalcSuperStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperStardustString += "<td></td>";
                    } else if (stargemNet.indexOf("-") >= 0) {
                        quickCalcSuperStardustString += "<td style='color:red'>" + stargemNet + "</td>";
                    } else {
                        quickCalcSuperStardustString += "<td style='color:lightgreen'>" + stargemNet + "</td>";
                        quickCalcSuperStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperStardustString += "<td></td>";
                    } else if (stargemNetPlusOne.indexOf("-") >= 0) {
                        quickCalcSuperStardustString += "<td style='color:red'>" + stargemNetPlusOne + "</td>";
                    } else {
                        quickCalcSuperStardustString += "<td style='color:lightgreen'>" + stargemNetPlusOne + "</td>";
                    }
                    quickCalcSuperStardustString += "</tr>";
                    stargemNetMinusOne = abbreviate_number(24 * 12 * (((arrStargemOutput[0][1] - 1) * avgSdGainSuperStardustPotion) - (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice)), 0);
                    stargemNet = abbreviate_number(24 * 12 * (((arrStargemOutput[0][1]) * avgSdGainSuperStardustPotion) - (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice)), 0);
                    stargemNetPlusOne = abbreviate_number(24 * 12 * (((arrStargemOutput[0][1] + 1) * avgSdGainSuperStardustPotion) - (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice)), 0);
                    quickCalcSuperStardustString += "<tr>";
                    quickCalcSuperStardustString += "<td style='text-align:center;color:gold;'>24h</td>";
                    totalPrice = 24 * 12 * (arrSuperStardustInput[0][3] + arrSuperStardustInput[1][3] + lowestSmallVialPrice);
                    quickCalcSuperStardustString += "<td>" + abbreviate_number(totalPrice, 0) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperStardustString += "<td></td>";
                    } else if (stargemNetMinusOne.indexOf("-") >= 0) {
                        quickCalcSuperStardustString += "<td style='color:red'>" + stargemNetMinusOne + "</td>";
                    } else {
                        quickCalcSuperStardustString += "<td style='color:lightgreen'>" + stargemNetMinusOne + "</td>";
                        quickCalcSuperStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperStardustString += "<td></td>";
                    } else if (stargemNet.indexOf("-") >= 0) {
                        quickCalcSuperStardustString += "<td style='color:red'>" + stargemNet + "</td>";
                    } else {
                        quickCalcSuperStardustString += "<td style='color:lightgreen'>" + stargemNet + "</td>";
                        quickCalcSuperStardustBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperStardustString += "<td></td>";
                    } else if (stargemNetPlusOne.indexOf("-") >= 0) {
                        quickCalcSuperStardustString += "<td style='color:red'>" + stargemNetPlusOne + "</td>";
                    } else {
                        quickCalcSuperStardustString += "<td style='color:lightgreen'>" + stargemNetPlusOne + "</td>";
                    }
                    quickCalcSuperStardustString += "</tr>";
                    quickCalcSuperStardustString += "</tbody></table>";
                    quickCalcSuperStardustString += arrSuperStardustInput[0][0] + ": " + abbreviate_number(limeLeafPrice, 0) + "<br>";
                    quickCalcSuperStardustString += arrSuperStardustInput[1][0] + ": " + abbreviate_number(snapegrassPrice, 0) + "<br>";
                    quickCalcSuperStardustString += lowestSmallVialSource + ": " + abbreviate_number(lowestSmallVial, 0) + "<br><br>";
                    quickCalcSuperStardustString += "Avg SD: " + numberWithCommas(avgSdGainSuperStardustPotion) + "<br>";
                    var superStardustPotionDurationDate = new Date(null);
                    superStardustPotionDurationDate.setSeconds(superStardustPotionDuration);
                    var superStardustPotionDurationDateFormatted = superStardustPotionDurationDate.toISOString().substr(14, 5);
                    quickCalcSuperStardustString += "Potion Duration: " + superStardustPotionDurationDateFormatted;
                }
                if (arrSuperStardustInput[0][1] != arrSuperStardustInput[0][2]) quickCalcSuperStardustString += "Not enough " + arrSuperStardustInput[0][0] + " " + arrSuperStardustInput[0][2] + "/" + arrSuperStardustInput[0][1] + "<br>";
                if (arrSuperStardustInput[1][1] != arrSuperStardustInput[1][2]) quickCalcSuperStardustString += "Not enough " + arrSuperStardustInput[1][0] + " " + arrSuperStardustInput[1][2] + "/" + arrSuperStardustInput[1][1] + "<br>";
                //stargem tooltip hover
                if (arrStargemInput[6][2] == arrStargemInput[6][1] && arrStargemInput[7][2] == arrStargemInput[7][1]) { // enough both
                    if (arrStargemInput[7][3] <= arrStargemInput[6][3]) {
                        lowestVial = arrStargemInput[7][3];
                        lowestVialSource = arrStargemInput[7][0];
                    } else if (arrStargemInput[6][3] < arrStargemInput[7][3]) {
                        lowestVial = arrStargemInput[6][3];
                        lowestVialSource = arrStargemInput[6][0];
                    }
                } else if (arrStargemInput[6][2] == arrStargemInput[6][1] && arrStargemInput[7][2] != arrStargemInput[7][1]) { // sand only
                    lowestVial = arrStargemInput[6][3];
                    lowestVialSource = arrStargemInput[6][0];
                } else if (arrStargemInput[6][2] != arrStargemInput[6][1] && arrStargemInput[7][2] == arrStargemInput[7][1]) { // glass only
                    lowestVial = arrStargemInput[7][3];
                    lowestVialSource = arrStargemInput[7][0];
                } else if (arrStargemInput[6][2] != arrStargemInput[6][1] && arrStargemInput[7][2] != arrStargemInput[7][1]) { // not enough both
                    lowestVial = 0;
                    lowestVialSource = "<span style='color:red;background-color:black;'>ERR: Sand & Glass < 25</span>";
                }
                var blewitMushroomPrice = arrStargemInput[0][3];
                var goldLeafPrice = arrStargemInput[1][3];
                var lowestVialPrice = lowestVial;
                if (boundBrewingKit == 1) {
                    hasBrewingKit = true;
                    for (i = 0; i < 2; i++) {
                        arrStargemInput[i][3] = Math.ceil(arrStargemInput[i][3] / 1.1); // brewing kit 10% free ingredients
                    }
                    lowestVialPrice = Math.ceil(lowestVialPrice / 1.1); // brewing kit 10% free vial
                } else hasBrewingKit = false;
                quickCalcStargemString = "";
                quickCalcStargemBoxShadow = false;
                if (arrStargemInput[0][1] == arrStargemInput[0][2] && arrStargemInput[1][1] == arrStargemInput[1][2]) {
                    quickCalcStargemString += "<span style='float:left;padding:5px;'>Stargem Profit</span>";
                    if (hasBrewingKit) {
                        quickCalcStargemString += "<span style='float:right;padding:5px;color:green;'>+Brewing Kit</span>";
                    } else quickCalcStargemString += "<span style='float:right;padding:5px;color:black;'><s style='color:red'>Brewing Kit</s></span>";
                    quickCalcStargemString += "<br>";
                    quickCalcStargemString += "<table style='text-align:center;padding:0 2px;' class='top-bar'><tbody><tr style='text-align:center'><th>Gem</th><th>Cost</th><th style='color:silver'>" + (arrStargemOutput[0][1] - 1) + "</th><th>" + (arrStargemOutput[0][1]) + "</th><th style='color:silver'>" + (arrStargemOutput[0][1] + 1) + "</th></tr>";
                    for (a = 2; a < arrStargemInput.length - 2; a++) {
                        if (a == 5) {
                            stargemNetMinusOne = abbreviate_number(((arrStargemOutput[0][1] - 1) * (a * 120000)) - (arrStargemInput[a][3] + arrStargemInput[0][3] + arrStargemInput[1][3] + lowestVialPrice), 1);
                            stargemNet = abbreviate_number(((arrStargemOutput[0][1]) * (a * 120000)) - (arrStargemInput[a][3] + arrStargemInput[0][3] + arrStargemInput[1][3] + lowestVialPrice), 1);
                            stargemNetPlusOne = abbreviate_number(((arrStargemOutput[0][1] + 1) * (a * 120000)) - (arrStargemInput[a][3] + arrStargemInput[0][3] + arrStargemInput[1][3] + lowestVialPrice), 1);
                        } else {
                            stargemNetMinusOne = abbreviate_number(((arrStargemOutput[0][1] - 1) * ((a - 1) * 100000)) - (arrStargemInput[a][3] + arrStargemInput[0][3] + arrStargemInput[1][3] + lowestVialPrice), 1);
                            stargemNet = abbreviate_number((arrStargemOutput[0][1] * ((a - 1) * 100000)) - (arrStargemInput[a][3] + arrStargemInput[0][3] + arrStargemInput[1][3] + lowestVialPrice), 1);
                            stargemNetPlusOne = abbreviate_number(((arrStargemOutput[0][1] + 1) * ((a - 1) * 100000)) - (arrStargemInput[a][3] + arrStargemInput[0][3] + arrStargemInput[1][3] + lowestVialPrice), 1);
                        }
                        quickCalcStargemString += "<tr>";
                        quickCalcStargemString += "<td style='text-align:center'><img class='image-icon-20' src='images/" + itemNameFix(arrStargemInput[a][0]) + ".png'></td>";
                        if (arrStargemInput[a][2] === 0) {
                            quickCalcStargemString += "<td></td><td></td><td></td><td></td>";
                        } else {
                            quickCalcStargemString += "<td>" + abbreviate_number(arrStargemInput[a][3], 2) + "</td>";
                            if (abbreviate_number(arrStargemInput[a][3], 1) === 0) {
                                quickCalcStargemString += "<td></td>";
                            } else if (stargemNetMinusOne.indexOf("-") >= 0) {
                                quickCalcStargemString += "<td style='color:red'>" + stargemNetMinusOne + "</td>";
                            } else {
                                quickCalcStargemString += "<td style='color:lightgreen'>" + stargemNetMinusOne + "</td>";
                                quickCalcStargemBoxShadow = true;
                            }
                            if (abbreviate_number(arrStargemInput[a][3], 1) === 0) {
                                quickCalcStargemString += "<td></td>";
                            } else if (stargemNet.indexOf("-") >= 0) {
                                quickCalcStargemString += "<td style='color:red'>" + stargemNet + "</td>";
                            } else {
                                quickCalcStargemString += "<td style='color:lightgreen'>" + stargemNet + "</td>";
                                quickCalcStargemBoxShadow = true;
                            }
                            if (abbreviate_number(arrStargemInput[a][3], 1) === 0) {
                                quickCalcStargemString += "<td></td>";
                            } else if (stargemNetPlusOne.indexOf("-") >= 0) {
                                quickCalcStargemString += "<td style='color:red'>" + stargemNetPlusOne + "</td>";
                            } else {
                                quickCalcStargemString += "<td style='color:lightgreen'>" + stargemNetPlusOne + "</td>";
                            }
                        }
                        quickCalcStargemString += "</tr>";
                    }
                    quickCalcStargemString += "</tbody></table>";
                    quickCalcStargemString += arrStargemInput[0][0] + ": " + abbreviate_number(blewitMushroomPrice, 0) + "<br>";
                    quickCalcStargemString += arrStargemInput[1][0] + ": " + abbreviate_number(goldLeafPrice, 0) + "<br>";
                    quickCalcStargemString += lowestVialSource + ": " + abbreviate_number(lowestVial, 0) + "<br>";
                }
                if (arrStargemInput[0][1] != arrStargemInput[0][2]) quickCalcStargemString += "Not enough " + arrStargemInput[0][0] + " " + arrStargemInput[0][2] + "/" + arrStargemInput[0][1] + "<br>";
                if (arrStargemInput[1][1] != arrStargemInput[1][2]) quickCalcStargemString += "Not enough " + arrStargemInput[1][0] + " " + arrStargemInput[1][2] + "/" + arrStargemInput[1][1] + "<br>";
                //essence tooltip hover
                if (boundBrewingKit == 1) {
                    hasBrewingKit = true;
                    for (i = 0; i < 2; i++) {
                        arrEssenceInput[i][3] = Math.ceil(arrEssenceInput[i][3] / 1.1); // brewing kit 10% free ingredients
                    }
                    lowestSmallVialPrice = Math.ceil(lowestSmallVialPrice / 1.1); // brewing kit 10% free vial
                } else hasBrewingKit = false;
                quickCalcEssenceString = "";
                quickCalcEssenceBoxShadow = false;
                if (arrEssenceInput[0][1] == arrEssenceInput[0][2] && arrEssenceInput[1][1] == arrEssenceInput[1][2]) {
                    quickCalcEssenceString += "<span style='float:left;padding:5px;'>Essence Profit</span>";
                    if (hasBrewingKit) {
                        quickCalcEssenceString += "<span style='float:right;padding:5px;color:green;'>+Brewing Kit</span>";
                    } else quickCalcEssenceString += "<span style='float:right;padding:5px;color:black;'><s style='color:red'>Brewing Kit</s></span>";
                    quickCalcEssenceString += "<br>";
                    quickCalcEssenceString += "<table style='text-align:center;padding:0 2px;' class='top-bar'><tbody><tr style='text-align:center'><th></th><th>Cost</th><th>Avg Ess</th><th>Avg Profit</th></tr>";
                    quickCalcEssenceString += "<tr>";
                    quickCalcEssenceString += "<td style='text-align:center'><img class='image-icon-20' src='images/essencePotion.png'></td>";
                    totalPrice = (arrEssenceInput[0][3] + arrEssenceInput[1][3] + lowestSmallVialPrice);
                    var essenceProfit = essencePotionAvgEssence * arrMarketItems.essence[0].price - totalPrice;
                    quickCalcEssenceString += "<td>" + abbreviate_number(totalPrice, 2) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcEssenceString += "<td></td>";
                    } else if (abbreviate_number(essenceProfit).indexOf("-") >= 0) {
                        quickCalcEssenceString += "<td style='color:red'>" + Number(essencePotionAvgEssence.toFixed(2)) + "</td>";
                    } else {
                        quickCalcEssenceString += "<td style='color:lightgreen'>" + Number(essencePotionAvgEssence.toFixed(2)) + "</td>";
                        quickCalcEssenceBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcEssenceString += "<td></td>";
                    } else if (abbreviate_number(essenceProfit).indexOf("-") >= 0) {
                        quickCalcEssenceString += "<td style='color:red'>" + abbreviate_number(Number(essenceProfit.toFixed(2)), 2) + "</td>";
                    } else {
                        quickCalcEssenceString += "<td style='color:lightgreen'>" + abbreviate_number(Number(essenceProfit.toFixed(2)), 2) + "</td>";
                        quickCalcEssenceBoxShadow = true;
                    }
                    quickCalcEssenceString += "<tr>";
                    quickCalcEssenceString += "<td style='text-align:center;color:gold;'>24h</td>";
                    totalPrice = (24 * 60 * 60 / essencePotionDuration) * (arrEssenceInput[0][3] + arrEssenceInput[1][3] + lowestSmallVialPrice);
                    var essenceProfit24 = (24 * 60 * 60 / essencePotionDuration) * essencePotionAvgEssence * arrMarketItems.essence[0].price - totalPrice;
                    quickCalcEssenceString += "<td>" + abbreviate_number(totalPrice, 2) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcEssenceString += "<td></td>";
                    } else if (abbreviate_number(essenceProfit).indexOf("-") >= 0) {
                        quickCalcEssenceString += "<td style='color:red'>" + Number(((24 * 60 * 60 / essencePotionDuration) * essencePotionAvgEssence).toFixed(2)) + "</td>";
                    } else {
                        quickCalcEssenceString += "<td style='color:lightgreen'>" + Number(((24 * 60 * 60 / essencePotionDuration) * essencePotionAvgEssence).toFixed(2)) + "</td>";
                        quickCalcEssenceBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcEssenceString += "<td></td>";
                    } else if (abbreviate_number(essenceProfit).indexOf("-") >= 0) {
                        quickCalcEssenceString += "<td style='color:red'>" + abbreviate_number(Number(essenceProfit24.toFixed(0)), 1) + "</td>"; //avg proft
                    } else {
                        quickCalcEssenceString += "<td style='color:lightgreen'>" + abbreviate_number(Number(essenceProfit24.toFixed(0)), 1) + "</td>";
                        quickCalcEssenceBoxShadow = true;
                    }
                    quickCalcEssenceString += "</tr>";
                    quickCalcEssenceString += "</tbody></table>";
                    dottedGreenLeafPrice = arrEssenceInput[0][3];
                    blewitMushroomPrice = arrEssenceInput[1][3];
                    quickCalcEssenceString += arrEssenceInput[0][0] + ": " + abbreviate_number(dottedGreenLeafPrice, 0) + "<br>";
                    quickCalcEssenceString += arrEssenceInput[1][0] + ": " + abbreviate_number(blewitMushroomPrice, 0) + "<br>";
                    quickCalcEssenceString += lowestSmallVialSource + ": " + abbreviate_number(lowestSmallVial, 0) + "<br>";
                    quickCalcEssenceString += "<br>";
                    quickCalcEssenceString += "Ess Chance: 1/" + numberWithCommas(essencePotionEssenceChance) + "/tick<br>";
                    var essencePotionDurationDate = new Date(null);
                    essencePotionDurationDate.setSeconds(essencePotionDuration);
                    var essencePotionDurationFormatted = essencePotionDurationDate.toISOString().substr(11, 8);
                    quickCalcEssenceString += "Potion Duration: " + essencePotionDurationFormatted;
                }
                if (arrEssenceInput[0][1] != arrEssenceInput[0][2]) quickCalcEssenceString += "Not enough " + arrEssenceInput[0][0] + " " + arrEssenceInput[0][2] + "/" + arrEssenceInput[0][1] + "<br>";
                if (arrEssenceInput[1][1] != arrEssenceInput[1][2]) quickCalcEssenceString += "Not enough " + arrEssenceInput[1][0] + " " + arrEssenceInput[1][2] + "/" + arrEssenceInput[1][1] + "<br>";
                //Super Essence tooltip hover
                if (boundBrewingKit == 1) {
                    hasBrewingKit = true;
                    for (i = 0; i < 2; i++) {
                        arrSuperEssenceInput[i][3] = Math.ceil(arrSuperEssenceInput[i][3] / 1.1); // brewing kit 10% free ingredients
                    }
                    lowestVialPrice = Math.ceil(lowestVialPrice / 1.1); // brewing kit 10% free vial
                } else hasBrewingKit = false;
                quickCalcSuperEssenceString = "";
                quickCalcSuperEssenceBoxShadow = false;
                if (arrSuperEssenceInput[0][1] == arrSuperEssenceInput[0][2] && arrSuperEssenceInput[1][1] == arrSuperEssenceInput[1][2]) {
                    quickCalcSuperEssenceString += "<span style='float:left;padding:5px;'>S Ess Profit</span>";
                    if (hasBrewingKit) {
                        quickCalcSuperEssenceString += "<span style='float:right;padding:5px;color:green;'>+Brewing Kit</span>";
                    } else quickCalcSuperEssenceString += "<span style='float:right;padding:5px;color:black;'><s style='color:red'>Brewing Kit</s></span>";
                    quickCalcSuperEssenceString += "<br>";
                    quickCalcSuperEssenceString += "<table style='text-align:center;padding:0 2px;' class='top-bar'><tbody><tr style='text-align:center'><th></th><th>Cost</th><th>Avg Ess</th><th>Avg Profit</th></tr>";
                    quickCalcSuperEssenceString += "<tr>";
                    quickCalcSuperEssenceString += "<td style='text-align:center'><img class='image-icon-20' src='images/superEssencePotion.png'></td>";
                    totalPrice = (arrSuperEssenceInput[0][3] + arrSuperEssenceInput[1][3] + lowestVialPrice);
                    var superEssenceProfit = superEssencePotionAvgEssence * arrMarketItems.essence[0].price - totalPrice;
                    quickCalcSuperEssenceString += "<td>" + abbreviate_number(totalPrice, 2) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperEssenceString += "<td></td>";
                    } else if (abbreviate_number(superEssenceProfit).indexOf("-") >= 0) {
                        quickCalcSuperEssenceString += "<td style='color:red'>" + Number(superEssencePotionAvgEssence.toFixed(2)) + "</td>";
                    } else {
                        quickCalcSuperEssenceString += "<td style='color:lightgreen'>" + Number(superEssencePotionAvgEssence.toFixed(2)) + "</td>";
                        quickCalcSuperEssenceBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperEssenceString += "<td></td>";
                    } else if (abbreviate_number(superEssenceProfit).indexOf("-") >= 0) {
                        quickCalcSuperEssenceString += "<td style='color:red'>" + abbreviate_number(Number(superEssenceProfit.toFixed(2)), 2) + "</td>";
                    } else {
                        quickCalcSuperEssenceString += "<td style='color:lightgreen'>" + abbreviate_number(Number(superEssenceProfit.toFixed(2)), 2) + "</td>";
                        quickCalcSuperEssenceBoxShadow = true;
                    }
                    quickCalcSuperEssenceString += "<tr>";
                    quickCalcSuperEssenceString += "<td style='text-align:center;color:gold;'>24h</td>";
                    totalPrice = (24 * 60 * 60 / superEssencePotionDuration) * (arrSuperEssenceInput[0][3] + arrSuperEssenceInput[1][3] + lowestSmallVialPrice);
                    var superEssenceProfit24 = (24 * 60 * 60 / superEssencePotionDuration) * superEssencePotionAvgEssence * arrMarketItems.essence[0].price - totalPrice;
                    quickCalcSuperEssenceString += "<td>" + abbreviate_number(totalPrice, 2) + "</td>";
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperEssenceString += "<td></td>";
                    } else if (abbreviate_number(superEssenceProfit).indexOf("-") >= 0) {
                        quickCalcSuperEssenceString += "<td style='color:red'>" + Number(((24 * 60 * 60 / superEssencePotionDuration) * superEssencePotionAvgEssence).toFixed(2)) + "</td>";
                    } else {
                        quickCalcSuperEssenceString += "<td style='color:lightgreen'>" + Number(((24 * 60 * 60 / superEssencePotionDuration) * superEssencePotionAvgEssence).toFixed(2)) + "</td>";
                        quickCalcSuperEssenceBoxShadow = true;
                    }
                    if (abbreviate_number(totalPrice, 1) === 0) {
                        quickCalcSuperEssenceString += "<td></td>";
                    } else if (abbreviate_number(superEssenceProfit).indexOf("-") >= 0) {
                        quickCalcSuperEssenceString += "<td style='color:red'>" + abbreviate_number(Number(superEssenceProfit24.toFixed(0)), 1) + "</td>"; //avg proft
                    } else {
                        quickCalcSuperEssenceString += "<td style='color:lightgreen'>" + abbreviate_number(Number(superEssenceProfit24.toFixed(0)), 1) + "</td>";
                        quickCalcSuperEssenceBoxShadow = true;
                    }
                    quickCalcSuperEssenceString += "</tr>";
                    quickCalcSuperEssenceString += "</tbody></table>";
                    dottedGreenLeafPrice = arrSuperEssenceInput[0][3];
                    blewitMushroomPrice = arrSuperEssenceInput[1][3];
                    quickCalcSuperEssenceString += arrSuperEssenceInput[0][0] + ": " + abbreviate_number(dottedGreenLeafPrice, 0) + "<br>";
                    quickCalcSuperEssenceString += arrSuperEssenceInput[1][0] + ": " + abbreviate_number(blewitMushroomPrice, 0) + "<br>";
                    quickCalcSuperEssenceString += lowestVialSource + ": " + abbreviate_number(lowestVial, 0) + "<br>";
                    quickCalcSuperEssenceString += "<br>";
                    quickCalcSuperEssenceString += "Ess Chance: 1/" + numberWithCommas(superEssencePotionEssenceChance) + "/tick<br>";
                    var superEssencePotionDurationDate = new Date(null);
                    superEssencePotionDurationDate.setSeconds(superEssencePotionDuration); // specify value for SECONDS here
                    var superEssencePotionDurationFormatted = superEssencePotionDurationDate.toISOString().substr(11, 8);
                    quickCalcSuperEssenceString += "Potion Duration: " + superEssencePotionDurationFormatted;
                }
                if (arrSuperEssenceInput[0][1] != arrSuperEssenceInput[0][2]) quickCalcSuperEssenceString += "Not enough " + arrSuperEssenceInput[0][0] + " " + arrSuperEssenceInput[0][2] + "/" + arrSuperEssenceInput[0][1] + "<br>";
                if (arrSuperEssenceInput[1][1] != arrSuperEssenceInput[1][2]) quickCalcSuperEssenceString += "Not enough " + arrSuperEssenceInput[1][0] + " " + arrSuperEssenceInput[1][2] + "/" + arrSuperEssenceInput[1][1] + "<br>";
                if (quickCalcStardustBoxShadow && stardustProfitGreenBox) {
                    document.getElementById("quickCalcStardust").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcStardust").style.boxShadow = "";
                if (quickCalcSuperStardustBoxShadow && superStardustProfitGreenBox) {
                    document.getElementById("quickCalcSuperStardust").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcSuperStardust").style.boxShadow = "";
                if (quickCalcStargemBoxShadow && stargemProfitGreenBox) {
                    document.getElementById("quickCalcStargem").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcStargem").style.boxShadow = "";
                if (quickCalcEssenceBoxShadow && essenceProfitGreenBox) {
                    document.getElementById("quickCalcEssence").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcEssence").style.boxShadow = "";
                if (quickCalcSuperEssenceBoxShadow && superEssenceProfitGreenBox) {
                    document.getElementById("quickCalcSuperEssence").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcSuperEssence").style.boxShadow = "";
                //heat on market table
                cheapestHeat = arrQuickCalcHeat[1];
                if (showCheapestHeat && arrQuickCalcHeat[1] <= tedStoredSettings.showCheapestHeat.showAt) {
                    var quickCalcBestHeat = document.createElement("img");
                    quickCalcBestHeat.setAttribute("style", "float:left;padding-left:15px;");
                    quickCalcBestHeat.setAttribute("src", "images/icons/fire.png");
                    quickCalcBestHeat.setAttribute("class", "image-icon-20");
                    quickCalcBestHeat.setAttribute("title", "Cheapest heat @ " + numberWithCommas(arrQuickCalcHeat[1]));
                    document.getElementById("market-table").rows[arrQuickCalcHeat[5]].style.display = "table-row";
                    if (document.getElementById("market-table").rows[arrQuickCalcHeat[5]].style.background === "") {
                        document.getElementById("market-table").rows[arrQuickCalcHeat[5]].style.background = "linear-gradient(#f2f2f2," + colorLuminance("#f2f2f2", -0.1) + ")";
                    }
                    document.getElementById("market-table").rows[arrQuickCalcHeat[5]].cells[0].insertBefore(quickCalcBestHeat, document.getElementById("market-table").rows[arrQuickCalcHeat[5]].cells[0].childNodes[1]);
                }
                //energy on market table
                cheapestEnergy = arrQuickCalcEnergy[1];
                if (showCheapestEnergy && arrQuickCalcEnergy[1] <= tedStoredSettings.showCheapestEnergy.showAt) {
                    var quickCalcBestEnergy = document.createElement("img");
                    quickCalcBestEnergy.setAttribute("style", "float:left;padding-left:15px;");
                    quickCalcBestEnergy.setAttribute("src", "images/steak.png");
                    quickCalcBestEnergy.setAttribute("class", "image-icon-20");
                    quickCalcBestEnergy.setAttribute("title", "Cheapest energy @ " + numberWithCommas(arrQuickCalcEnergy[1]));
                    document.getElementById("market-table").rows[arrQuickCalcEnergy[5]].style.display = "table-row";
                    if (document.getElementById("market-table").rows[arrQuickCalcEnergy[5]].style.background === "") {
                        document.getElementById("market-table").rows[arrQuickCalcEnergy[5]].style.background = "linear-gradient(#f2f2f2," + colorLuminance("#f2f2f2", -0.1) + ")";
                    }
                    document.getElementById("market-table").rows[arrQuickCalcEnergy[5]].cells[0].insertBefore(quickCalcBestEnergy, document.getElementById("market-table").rows[arrQuickCalcEnergy[5]].cells[0].childNodes[1]);
                }
                //bonemeal on market table
                cheapestBonemeal = arrQuickCalcBonemeal[1];
                if (showCheapestBonemeal && arrQuickCalcBonemeal[1] <= tedStoredSettings.showCheapestBonemeal.showAt) {
                    var quickCalcBestBonemeal = document.createElement("img");
                    quickCalcBestBonemeal.setAttribute("style", "float:left;padding-left:15px;");
                    quickCalcBestBonemeal.setAttribute("src", "images/filledBonemealBin.png");
                    quickCalcBestBonemeal.setAttribute("class", "image-icon-20");
                    quickCalcBestBonemeal.setAttribute("title", "Cheapest bonemeal @ " + numberWithCommas(arrQuickCalcBonemeal[1]));
                    document.getElementById("market-table").rows[arrQuickCalcBonemeal[5]].style.display = "table-row";
                    if (document.getElementById("market-table").rows[arrQuickCalcBonemeal[5]].style.background === "") {
                        document.getElementById("market-table").rows[arrQuickCalcBonemeal[5]].style.background = "linear-gradient(#f2f2f2," + colorLuminance("#f2f2f2", -0.1) + ")";
                    }
                    document.getElementById("market-table").rows[arrQuickCalcBonemeal[5]].cells[0].insertBefore(quickCalcBestBonemeal, document.getElementById("market-table").rows[arrQuickCalcBonemeal[5]].cells[0].childNodes[1]);
                }
            }
        }

        function oreAverageButtonClickAction() {
            if (oreAverageOn === true) {
                oreAverageOn = false;
                oreAverageElement.style.display = "none";
                document.getElementById("oreAverageButton").innerHTML = "oreAverageText: OFF";
            } else if (oreAverageOn === false) {
                oreAverageOn = true;
                oreAverageMain();
                document.getElementById("oreAverageButton").innerHTML = "oreAverageText: ON";
            }
        }

        window.timeSince = function(date) {
            if (typeof date !== 'object') {
                date = new Date(date);
            }
            var seconds = Math.floor((new Date() - date) / 1000);
            var intervalType;

            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                intervalType = 'year';
            } else {
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    intervalType = 'month';
                } else {
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        intervalType = 'day';
                    } else {
                        interval = Math.floor(seconds / 3600);
                        if (interval >= 1) {
                            intervalType = "hour";
                        } else {
                            interval = Math.floor(seconds / 60);
                            if (interval >= 1) {
                                intervalType = "minute";
                            } else {
                                interval = seconds;
                                intervalType = "second";
                            }
                        }
                    }
                }
            }
            if (interval > 1 || interval === 0) {
                intervalType += 's';
            }
            return interval + ' ' + intervalType;
        };

        // START OF MINIGAMES

        window.poker_shuffle = function(array) {
            //Fisher-Yates shuffle
            var m = array.length, t, i;
            while (m) {
                // pick a remaining element…
                i = Math.floor(Math.random() * m--); // then decrease m
                // and swap it with the current element
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        };

        window.poker_newDeck = function(gameType) {
            var ranks = ["A","K","Q","J","T",
                         "9","8","7","6","5","4","3","2"];
            var suits = ["s", "h", "c", "d"];
            if (gameType == "tenplus") {
                ranks = ["A","K","Q","J","T"];
            }
            var deckArray = [];
            for (let s = 0; s < suits.length; s++) {
                for (let r = 0; r < ranks.length; r++) {
                    let card = String(ranks[r]) + String(suits[s]);
                    deckArray.push(card);
                }
            }
            return deckArray;
        };

        window.countMatches = function(str, search) {
            str = String(str);
            var regExp = new RegExp(search, "gi");
            return (str.match(regExp) || []).length;
        };

        window.loadCard = function(card, idToAppend) {
            let rank = card[0];
            let suit = card[1];
            let suits = {
                "s": {
                    icon: "♠",
                    solidColor: "black",
                    weakColor: "rgb(230, 230, 230)",
                },
                "h": {
                    icon: "♥",
                    solidColor: "red",
                    weakColor: "rgb(255, 230, 230)",
                },
                "c": {
                    icon: "♣",
                    solidColor: "green",
                    weakColor: "rgb(230, 255, 230)",
                },
                "d": {
                    icon: "♦",
                    solidColor: "blue",
                    weakColor: "rgb(230, 230, 255)",
                },
                "?": {
                    icon: "",
                    solidColor: "gold",
                    weakColor: "black",
                },
                "*": {
                    icon: "*",
                    solidColor: "gold",
                    weakColor: "black",
                },
            };
            let icon = suits[suit].icon;
            let solidColor = suits[suit].solidColor;
            let weakColor = suits[suit].weakColor;
            var svg_container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg_container.setAttribute("width", "80");
            svg_container.setAttribute("height", "112");
            svg_container.setAttribute("id", "tmg_pokerCard_"+card);
            let cardBackground = '<rect x="0" y="0" rx="8" ry="8"style="width:80;height:112;stroke:black;stroke-width:1px;fill:'+weakColor+'"></rect>';
            if (suit == "?") {
                /*cardBackground = '<rect x="0" y="0" rx="8" ry="8"style="width:80;height:112;stroke:black;stroke-width:1px;fill:'+weakColor+'"></rect>' +
					'<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8"><path d="M-1 1l2-2M0 4l4-4M3 5l2-2" style="stroke:yellow; stroke-width:1"></path></pattern>' +
					'<rect x="10" y="10" fill="url(#diagonalHatch)" style="width:60;height:92"></rect>'; */
            }
            let outerLine = '<polyline points="10,20 10,102 70,102 70,10 32,10" style="fill:none;stroke-width:1;stroke:#d2d2d2"></polyline>';
            let upperLeftText = '<text x="5" y="15" font-family="Monaco" font-size="15" text-anchor="left" style="fill:'+solidColor+';stroke-width:1;cursor:default;user-select:none">'+rank+' '+icon+'</text>';
            let middleText = '<text x="40" y="76" font-family="Monaco" font-size="60" text-anchor="middle" style="fill:'+solidColor+';stroke-width:1;cursor:default;user-select:none">'+rank+'</text>';
            svg_container.innerHTML = "" + cardBackground + outerLine + upperLeftText + middleText;
            document.getElementById(idToAppend).appendChild(svg_container);
        };

        function minigamesButtonClickAction() {
            if (minigamesOn === true) {
                minigamesOn = false;
                document.getElementById("gameWrapper").style.display = "none";
                document.getElementById("minigamesButton").innerHTML = "Minigames: Minimised";
            } else if (minigamesOn === false) {
                minigamesOn = true;
                document.getElementById("gameWrapper").style.display = "flex";
                document.getElementById("minigamesButton").innerHTML = "Minigames: Open";
                if (minigameMyStatus != "ingame") {
                    if (document.getElementById("inputOpp")) {
                        document.getElementById("inputOpp").focus();
                    }
                }
            }
        }
        window.minigameClose = function() {
            minigamesButtonClickAction();
        };
        window.declineChallenge = function(opponent, game) {
            if (opponent != window.username) {
                sendp2p(opponent, "CHALLENGE", "DECSTART");
                minigameManager.challenges[opponent].status = "We declined";
                loadChallenges();
            }
        };
        window.acceptChallenge = function(opponent, game, version, seed = "!NOSEED!") {
            if (opponent != window.username) {
                minigameManager.challenges[opponent].status = "Accepted";
                minigameMyStatus = "confirming start";
                setTimeout(function() {
                    if (minigameMyStatus == "confirming start") {
                        minigameMyStatus = "free";
                    }
                }, 3000);
                sendp2p(opponent, "CHALLENGE", "ACCSTART", version, seed);
            }
        };
        window.sendChallenge = function() {
            let opponent = document.getElementById("inputOpp").value;
            if (opponent != window.username && opponent !== "") {
                let game = document.getElementById("inputGame").value;
                let version = document.getElementById("inputVersion").value;
                if (document.getElementById("inputSeed").value.replace(/[^a-z0-9]/gi, "") !== "") {
                    minigameSeed = document.getElementById("inputSeed").value;
                } else minigameSeed = Math.floor(Math.random() * 1000000 + 1);
                if (minigameSeed.length > 12) {
                    minigameSeed = minigameSeed.substring(0, 12);
                }
                minigameManager.challenges[opponent] = {
                    from: opponent,
                    game: game,
                    version: version,
                    seed: minigameSeed,
                    status: "No response",
                };
                sendp2p(opponent, "CHALLENGE#REQSTART", version, minigameSeed);
                loadChallenges();
            }
        };
        window.tmgReset = function() {
            minigameMyStatus = "free";
            loadMinigame("Minigames");
            document.getElementById("challengeContainer").style.display = "flex";
            document.getElementById("versusContainer").style.display = "none";
            sendp2p(minigameOpp, "QUIT", "OPPONENT_RESET");
            minigameOpp = "";
            pingSent = false;
            document.getElementById("inputOpp").focus();
        };
        var challengeContainer = document.createElement("div");
        challengeContainer.setAttribute("style", "display:flex;flex-direction:column;align-items:center;justify-content:center");
        challengeContainer.setAttribute("id", "challengeContainer");
        function loadChallenges() {
            while (challengeContainer.firstChild) {
                challengeContainer.removeChild(challengeContainer.firstChild);
            }
            if (minigameMyStatus != "free") return;
            challengeContainer.style.display = "flex";
            let challengesText = document.createElement("span");
            challengesText.style.fontSize = "30px";
            challengesText.append("Challenges");
            challengeContainer.append(challengesText);
            challengeContainer.append(document.createElement("br"));

            var challengeTable = document.createElement("table");
            challengeTable.setAttribute("style", "border-spacing:1px;");
            var objTableDetails = {
                headers: ["Opponent","Game","Version","Seed"],
            };
            var tr = challengeTable.appendChild(document.createElement("tr"));
            for (let c = 0; c < objTableDetails.headers.length; ++c) {
                let cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style", "padding:15px;border:6px solid #ccc;text-align:center");
                cell.append(objTableDetails.headers[c]);
            }
            for (let r = 0; r < Object.keys(minigameManager.challenges).length; ++r) {
                let from = Object.keys(minigameManager.challenges)[r];
                let status = minigameManager.challenges[from].status;
                if (status == "We declined") continue;
                let game = minigameManager.challenges[from].game;
                let version = minigameManager.challenges[from].version;
                let seed = minigameManager.challenges[from].seed;
                let tr = challengeTable.appendChild(document.createElement("tr"));
                let cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style","border-left:3px solid #ccc;border-bottom:1px solid #ccc;text-align:center;padding:10px");
                cell.append(from);
                cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style","border-bottom:1px solid #ccc;text-align:center;padding:10px");
                cell.append(game);
                cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style","border-bottom:1px solid #ccc;text-align:center;padding:10px");
                cell.append(version);
                cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style","border-right:3px solid #ccc;border-bottom:1px solid #ccc;text-align:center;padding:10px");
                cell.append(seed);
                cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style","text-align:center;padding:10px");
                let button1 = document.createElement("input");
                button1.setAttribute("type", "button");
                button1.setAttribute("value", status);
                if (status == "Accept") {
                    button1.setAttribute("onclick", "acceptChallenge('" + from + "','" + game + "','" + version + "','" + seed + "')");
                } else { //if (status == "No response" || status == "Challenge received" || status == "Challenge declined" || status == "Challenge cancelled") {
                    button1.setAttribute("disabled", "disabled");
                }
                cell.append(button1);
                cell = tr.appendChild(document.createElement("td"));
                cell.setAttribute("style","text-align:center;padding:10px");
                let button2 = document.createElement("input");
                button2.setAttribute("type", "button");
                button2.setAttribute("onclick", "declineChallenge('" + from + "','" + game + "','" + version + "','" + seed + "')");
                if (status == "Accept") {
                    button2.setAttribute("value", "Decline");
                } else if (status == "Challenge cancelled") {
                    button2.setAttribute("value", "Ok");
                } else { //if (status == "No Response" || status == "Challenge received" || status == "Challenge declined") {
                    button2.setAttribute("value", "Cancel");
                }
                cell.append(button2);
            }
            challengeContainer.append(challengeTable);
        }

        window.tmg_pokerSitAtTable = function(table, seat, buyin) {
            //minigameMyStatus = "ingame";
            buyin = 200;
            if (table && seat) {
                sendp2p(pokerServerUsername, "LOBBY", "JOINTABLE", table, seat, buyin);
            }
        };
        window.tmg_pokerRequestObserveTable = function(table) {
            sendp2p(pokerServerUsername, "LOBBY", "OBSERVE", table);
        };
        window.tmg_pokerObserveTable = function(table) {
            loadMinigame(minigameCurrentSelectedGame);
        };
        var pokerLobbyContainer = document.createElement("div");
        pokerLobbyContainer.setAttribute("style", "display:none;flex-direction:column;align-items:center;justify-content:center");
        pokerLobbyContainer.setAttribute("id", "pokerLobbyContainer");
        window.loadPokerLobby = function() {
            while (pokerLobbyContainer.firstChild) {
                pokerLobbyContainer.removeChild(pokerLobbyContainer.firstChild);
            }
            if (minigameMyStatus != "free") return;
            pokerLobbyContainer.style.display = "flex";

            let pokerLobbyInfo = pokerLobbyContainer.appendChild(document.createElement("div"));
            pokerLobbyInfo.setAttribute("style","color:#f0f0f0;border:grey ridge;padding:1em;margin:0 1em;display:flex;flex-direction:row;align-items:flex-start;justify-content:space-around;min-width:500px;border-radius:10px;background:linear-gradient(#202020,#606060)");

            let promotionInfo = pokerLobbyInfo.appendChild(document.createElement("div"));
            promotionInfo.setAttribute("style","width:50%;display:flex;flex-direction:column;align-items:center;justify-content:space-around");
            let jackpotText = promotionInfo.appendChild(document.createElement("div"));
            jackpotText.append("Jackpot Pool");
            let jackpotPool = promotionInfo.appendChild(document.createElement("div"));
            jackpotPool.setAttribute("style","color:gold");
            jackpotPool.append(coinImg.cloneNode());
            jackpotPool.append(" " + tedStoredSettings.poker.promotions.jackpotPool);
            promotionInfo.appendChild(document.createElement("br"));
            let badBeatText = promotionInfo.appendChild(document.createElement("div"));
            badBeatText.append("Bad Beat");
            badBeatText.setAttribute("style","border-bottom:1px dotted #f0f0f0");
            badBeatText.setAttribute("title","Lose with quads or better using both hole cards\n75% of jackpot goes to loser\n20% of jackpot is split to other players dealt into the hand\n  5% rolls over to next jackpot");

            if (tedStoredSettings.poker.promotions.bbj.previousWinner !== null) {
                let badBeatPreviousWinnerText = promotionInfo.appendChild(document.createElement("div"));
                badBeatPreviousWinnerText.append("BBJ Previous Winner");
                let badBeatPreviousWinner = promotionInfo.appendChild(document.createElement("div"));
                badBeatPreviousWinner.append(tedStoredSettings.poker.promotions.bbj.previousWinner + " " + timeSince(tedStoredSettings.poker.promotions.bbj.previousTime) + " ago");
                let badBeatPreviousAmount = promotionInfo.appendChild(document.createElement("div"));
                badBeatPreviousAmount.setAttribute("style","color:gold");
                badBeatPreviousAmount.append(coinImg.cloneNode());
                badBeatPreviousAmount.append(numberWithCommas(tedStoredSettings.poker.promotions.bbj.previousAmount));
            }

            promotionInfo.appendChild(document.createElement("br"));
            let highHandText = promotionInfo.appendChild(document.createElement("div"));
            highHandText.append("High Hand");
            highHandText.setAttribute("style","border-bottom:1px dotted #f0f0f0");
            highHandText.setAttribute("title","The highest hand when the timer runs out");


            // if previous winner, show info

            let myInfo = pokerLobbyInfo.appendChild(document.createElement("div"));
            myInfo.setAttribute("style","width:50%;display:flex;flex-direction:column;align-items:center;justify-content:space-around");
            let availableBalance = myInfo.appendChild(document.createElement("div"));
            availableBalance.append("Available balance");
            let myPokerBalance = myInfo.appendChild(document.createElement("div"));
            myPokerBalance.setAttribute("style","border:grey ridge;border-radius:5px;margin:0.25em 0;text-align:center;width:160px;background:linear-gradient(#202020,#606060);color:#dfd4a1;white-space:nowrap");
            myPokerBalance.append(coinImg.cloneNode());
            myPokerBalance.append(" " + tedStoredSettings.poker.availableBalance);
            let depositWithdrawFlex = myInfo.appendChild(document.createElement("div"));
            depositWithdrawFlex.setAttribute("style","margin-bottom:0.25em;text-align:center;width:160px;white-space:nowrap");
            let depositButton = depositWithdrawFlex.appendChild(document.createElement("input"));
            depositButton.setAttribute("type", "button");
            depositButton.setAttribute("value", "Deposit");
            depositButton.setAttribute("style","font-weight:bold;border-radius:10px;user-select:none;cursor:pointer;background:linear-gradient(white,gold);border:1px solid gold");
            //depositButton.setAttribute("disabled","true");
            //depositButton.style.opacity = "0.8";
            depositWithdrawFlex.append(document.createTextNode("\u00a0")); //nbsp
            let withdrawButton = depositWithdrawFlex.appendChild(document.createElement("input"));
            withdrawButton.setAttribute("type", "button");
            withdrawButton.setAttribute("value", "Withdraw");
            withdrawButton.setAttribute("style","font-weight:bold;border-radius:10px;user-select:none;cursor:pointer;background:linear-gradient(white,gold);border:1px solid gold");
            //withdrawButton.setAttribute("disabled","true");
            //withdrawButton.style.opacity = "0.8";

            let pokerTablesContainer = pokerLobbyContainer.appendChild(document.createElement("div"));
            pokerTablesContainer.setAttribute("style","border:grey ridge;margin:1em;min-width:500px;border-radius:10px;background:linear-gradient(#202020,#606060);cursor:default;user-select:none;color:#F0F0F0");
            pokerTablesContainer.setAttribute("id","pokerTablesContainer");
            let tablesHeader = document.createElement("div");
            tablesHeader.setAttribute("style","min-width:600px;margin:0.5em 0;display:flex;flex-direction:row;align-items:center;justify-content:space-around;text-align:center");
            let tablesHeaders = ["Table","Stakes","Game","Players", ""];
            tablesHeaders.forEach(header => {
                let headerDiv = document.createElement("div");
                headerDiv.setAttribute("style","width:" + 100 / tablesHeaders.length + "%");
                headerDiv.append(header);
                tablesHeader.append(headerDiv);
            });
            pokerTablesContainer.append(tablesHeader);

            for (let table in minigamesObject[minigameCurrentSelectedGame].tables) {
                let tableBlock = pokerTablesContainer.appendChild(document.createElement("div"));
                tableBlock.setAttribute("style","padding:0.25em;border-top:grey ridge;display:flex;flex-direction:column;align-items:center;justify-content:space-around;text-align:center");

                let tableGameInfo = tableBlock.appendChild(document.createElement("div"));
                tableGameInfo.setAttribute("style","width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-around;text-align:center");

                let stakes = "" + minigamesObject[minigameCurrentSelectedGame].tables[table].gameInfo.sb + "/" + minigamesObject[minigameCurrentSelectedGame].tables[table].gameInfo.bb;
                let playerCount = Object.keys(minigamesObject[minigameCurrentSelectedGame].tables[table].seats).length;
                let players = "" + playerCount + "/" + minigamesObject[minigameCurrentSelectedGame].tables[table].gameInfo.maxPlayers;
                let gameType = minigamesObject[minigameCurrentSelectedGame].tables[table].gameInfo.gameType;
                let arrTableGameInfo = [table, stakes, gameType, players, "observeButton"];

                arrTableGameInfo.forEach(thing => {
                    if (thing == "observeButton") {
                        let div = tableGameInfo.appendChild(document.createElement("div"));
                        div.style.width = "" + 100 / arrTableGameInfo.length + "%";
                        let btn = div.appendChild(document.createElement("input"));
                        btn.setAttribute("type","button");
                        btn.setAttribute("value","Observe");
                        btn.setAttribute("style","cursor:pointer;color:#f0f0f0;background:linear-gradient(#3d85c6,#073763);font-weight:bold;border:silver ridge;padding:0.25em;border-radius:5px");
                        btn.setAttribute("onclick","tmg_pokerRequestObserveTable('"+table+"')");
                    } else {
                        let div = tableGameInfo.appendChild(document.createElement("div"));
                        div.style.width = "" + 100 / arrTableGameInfo.length + "%";
                        div.append(thing);
                    }
                });

                tableGameInfo = tableBlock.appendChild(document.createElement("div"));
                tableGameInfo.setAttribute("style","width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-around;text-align:center");

                for (let i = 1; i <= minigamesObject[minigameCurrentSelectedGame].tables[table].gameInfo.maxPlayers; i++) {
                    let div = tableGameInfo.appendChild(document.createElement("div"));
                    div.setAttribute("style","margin:0.25em");
                    let player = "";
                    for (let p in minigamesObject[minigameCurrentSelectedGame].tables[table].seats) {
                        if (minigamesObject[minigameCurrentSelectedGame].tables[table].seats[p].seat == i) {
                            player = p;
                        }
                    }
                    if (player) {
                        //if someone in this seat
                        div.append(minigamesObject[minigameCurrentSelectedGame].tables[table].seats[player].name);
                        div.append(document.createElement("br"));
                        div.append(coinImg.cloneNode());
                        div.append(minigamesObject[minigameCurrentSelectedGame].tables[table].seats[player].chips);
                    } else {
                        let seatMeBtn = document.createElement("input");
                        seatMeBtn.setAttribute("type","button");
                        seatMeBtn.setAttribute("value","Sit here");
                        seatMeBtn.setAttribute("style","cursor:pointer;color:#f0f0f0;background:linear-gradient(#6aa84f,#274e13);font-weight:bold;border:silver ridge;padding:0.5em;border-radius:5px");
                        seatMeBtn.setAttribute("onclick","tmg_pokerSitAtTable('"+table+"','"+i+"')");
                        div.append(seatMeBtn);
                    }
                }
            }

        };

        var versusContainer = document.createElement("div");
        //versusContainer.setAttribute("style", "display:flex;flex-direction:row;align-items:center;justify-content:center");
        versusContainer.setAttribute("id", "versusContainer");
        function loadVersus() {
            while (versusContainer.firstChild) {
                versusContainer.removeChild(versusContainer.firstChild);
            }
            if (minigameMyStatus != "ingame") return;
            versusContainer.style.display = "flex";
            let newFlex = document.createElement("div");
            newFlex.setAttribute("style", "display:flex;flex-direction:row;align-items:center;justify-content:space-around");
            let myColor = minigamesObject[minigameGame].players[minigameMyPlayer].color;
            if (myColor == "lightgreen") myColor = "green";
            let oppColor = minigamesObject[minigameGame].players[minigameOppPlayer].color;
            if (oppColor == "lightgreen") oppColor = "green";

            let myVersusInfo = document.createElement("div");
            myVersusInfo.setAttribute("style", "width:45%;display:flex;flex-direction:row;align-items:center;justify-content:flex-end;font-size:20px;color:" + myColor); //text-align:right;font-size:30px;color:" + myColor
            let myUnits = document.createElement("div");
            myUnits.setAttribute("style", "display:flex;flex-direction:column;text-align:center");
            myUnits.setAttribute("id","gc_" + minigameMyPlayer + "_unitsdiv");
            myUnits.append("Units");
            let myUnitsNumber = document.createElement("div");
            myUnitsNumber.setAttribute("id","gc_" + minigameMyPlayer + "_unitcount");
            myUnitsNumber.append("0");
            myUnits.append(myUnitsNumber);
            myVersusInfo.append(myUnits);
            myVersusInfo.append(document.createTextNode("\u00a0")); //nbsp
            let myName = document.createElement("div");
            myName.setAttribute("style","font-size:40px;border-radius:200px");
            myName.setAttribute("id","gc_versus_"+minigameMyPlayer);
            myName.append(window.username);
            myVersusInfo.append(myName);
            myVersusInfo.append(document.createTextNode("\u00a0")); //nbsp
            let myWins = document.createElement("div");
            myWins.setAttribute("style", "display:flex;flex-direction:column");
            myWins.append("Wins");
            let myWinsNumber = document.createElement("div");
            myWinsNumber.setAttribute("id","gc_" + minigameMyPlayer + "_wins");
            myWinsNumber.setAttribute("style","text-align:center");
            myWinsNumber.append(minigamesObject[minigameGame].players[minigameMyPlayer].wins);
            myWins.append(myWinsNumber);
            myVersusInfo.append(myWins);
            newFlex.append(myVersusInfo);
            newFlex.append(document.createTextNode("\u00a0")); //nbsp
            newFlex.append(document.createTextNode('vs'));
            newFlex.append(document.createTextNode("\u00a0")); //nbsp

            let oppVersusInfo = document.createElement("div");
            oppVersusInfo.setAttribute("style", "width:45%;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;font-size:20px;color:" + oppColor); //text-align:right;font-size:30px;color:" + oppColor
            let oppWins = document.createElement("div");
            oppWins.setAttribute("style", "display:flex;flex-direction:column");
            oppWins.append("Wins");
            let oppWinsNumber = document.createElement("div");
            oppWinsNumber.setAttribute("id","gc_" + minigameOppPlayer + "_wins");
            oppWinsNumber.setAttribute("style","text-align:center");
            oppWinsNumber.append(minigamesObject[minigameGame].players[minigameOppPlayer].wins);
            oppWins.append(oppWinsNumber);
            oppVersusInfo.append(oppWins);
            oppVersusInfo.append(document.createTextNode("\u00a0")); //nbsp
            let oppName = document.createElement("div");
            oppName.setAttribute("style","font-size:40px;border-radius:200px");
            oppName.setAttribute("id","gc_versus_"+minigameOppPlayer);
            oppName.append(minigameOpp);
            oppVersusInfo.append(oppName);
            oppVersusInfo.append(document.createTextNode("\u00a0")); //nbsp
            let oppUnits = document.createElement("div");
            oppUnits.setAttribute("style", "display:flex;flex-direction:column;text-align:center");
            oppUnits.append("Units");
            let oppUnitsNumber = document.createElement("div");
            oppUnitsNumber.setAttribute("id","gc_" + minigameOppPlayer + "_unitcount");
            oppUnitsNumber.append("0");
            oppUnits.append(oppUnitsNumber);
            oppVersusInfo.append(oppUnits);
            newFlex.append(oppVersusInfo);
            versusContainer.append(newFlex);
        }
        function clickableGrid(rows, cols, map, callback) {
            var i = 0;
            var grid = document.createElement('table');
            grid.className = "grid";
            grid.setAttribute("style", "border-spacing:1px;border-style:ridge");
            for (var r = 0; r < rows; ++r) {
                var tr = grid.appendChild(document.createElement('tr'));
                for (var c = 0; c < cols; ++c) {
                    var cell = tr.appendChild(document.createElement('td'));
                    cell.setAttribute("style", "cursor:default;width:70px;height:70px;border:1px solid #ccc;text-align:center");
                    cell.setAttribute("gc_row", r);
                    cell.setAttribute("gc_col", c);
                    cell.setAttribute("id", "gc_" + i);
                    cell.setAttribute("gc_owner", "none");
                    cell.setAttribute("gc_str", 0);
                    cell.setAttribute("gc_bonus", "");
                    cell.addEventListener('click', (function(el) {
                        return function() {
                            callback(el);
                        };
                    })(cell), false);
                    i++;
                }
            }
            return grid;
        }
        window.endGameRematch = function(winner) {
            var color;
            if (minigamesObject[minigameGame].players[winner]) {
                color = minigamesObject[minigameGame].players[winner].color;
            } else color = "gold";
            if (minigamesObject[minigameGame].players[winner]) {
                document.getElementById("gc_" + winner + "_wins").innerHTML = parseInt(document.getElementById("gc_" + winner + "_wins").innerHTML) + 1;
            }
            document.getElementById("gc_container").style.boxShadow = "0 0 300px 400px " + color + " inset";
            document.getElementById("gc_container").style.transition = "box-shadow 2.5s";
            setTimeout(function() {
                if (minigameOpp !== "") {
                    loadMinigame("Grid Control");
                }
            }, 2500);
        };
        window.gc_checkVictory = function(surrenderingPlayer) {
            if (minigameMyStatus != "ingame") {
                return;
            }
            if (surrenderingPlayer && minigamesObject[minigameGame].players[surrenderingPlayer]) {
                if (minigameMyPlayer == surrenderingPlayer) {
                    sendp2p(minigameOpp, "SURRENDER", minigameMyPlayer);
                }
            }
            var playersAlive = [];
            for (let player in minigamesObject[minigameGame].players) {
                let playerTerritoriesOwned = $("[gc_owner]").filter(function() {
                    return $(this).attr("gc_owner") == player;
                });
                if (playerTerritoriesOwned.length > 0) {
                    playersAlive.push(player);
                }
            }
            if (playersAlive.indexOf(surrenderingPlayer) >= 0) {
                playersAlive.splice(playersAlive.indexOf(surrenderingPlayer), 1);
            }
            if (playersAlive.length === 0) {
                //draw
                endGameRematch();
            } else if (playersAlive.length === 1) {
                //somebody won
                endGameRematch(playersAlive[0]);
            }
        };
        window.gc_calculateBonuses = function(player) {
            let x = $("[gc_bonus]").filter(function() {
                return (parseInt($(this).attr("gc_bonus")) > 0 || parseInt($(this).attr("gc_bonus")) < 0);
            });
            for (let i = 0; i < x.length; i++) {
                if (x[i].getAttribute("gc_owner") == player) {
                    let bonus = parseInt(x[i].getAttribute("gc_bonus"));
                    let total = parseInt(x[i].getAttribute("gc_str")) + bonus;
                    if (total <= 0) {
                        total = 0;
                        x[i].setAttribute("gc_owner", "none");
                    }
                    x[i].setAttribute("gc_str", total);
                }
            }
        };
        window.gc_interpretMove = function(from, to, percent, opp) {
            from = document.getElementById("gc_" + from);
            to = document.getElementById("gc_" + to);
            window.gc_moveUnits(from, to, percent, opp);
        };
        window.gc_moveUnits = function(from, to, percent, opp) {
            if (minigameMyTurn || opp) {
                if (minigameMyPlayer == from.getAttribute("gc_owner") || opp) {
                    let newpercent;
                    if (percent == "33") {
                        newpercent = 1/3;
                    } else newpercent = parseInt(percent) / 100;
                    let fromStr = parseInt(from.getAttribute("gc_str"));
                    let toStr = parseInt(to.getAttribute("gc_str"));
                    let amtToMove = Math.floor(fromStr * newpercent);
                    let fromOwned = from.getAttribute("gc_owner");
                    let toOwned = to.getAttribute("gc_owner");
                    if (amtToMove > 0) {
                        if (fromOwned == toOwned || toOwned == "none") {
                            fromStr = fromStr - amtToMove;
                            toStr = toStr + amtToMove;
                            from.setAttribute("gc_str", fromStr);
                            to.setAttribute("gc_str", toStr);
                            to.setAttribute("gc_owner", from.getAttribute("gc_owner"));
                        } else if (fromOwned != toOwned) {
                            fromStr = fromStr - amtToMove;
                            from.setAttribute("gc_str", fromStr);
                            if (amtToMove > toStr) {
                                toStr = amtToMove - toStr;
                                to.setAttribute("gc_owner", from.getAttribute("gc_owner"));
                                to.setAttribute("gc_str", toStr);
                            } else if (amtToMove < toStr) {
                                toStr = toStr - amtToMove;
                                to.setAttribute("gc_str", toStr);
                            } else if (amtToMove == toStr) {
                                to.setAttribute("gc_str", 0);
                                toStr = 0;
                                to.setAttribute("gc_owner", "none");
                            }
                        }
                        if (from.getAttribute("gc_bonus")) {
                            from.innerHTML = fromStr + " +" + from.getAttribute("gc_bonus");
                        } else if (fromStr === 0) {
                            from.innerHTML = "";
                            from.setAttribute("gc_owner", "none");
                        } else from.innerHTML = fromStr;
                        if (to.getAttribute("gc_bonus")) {
                            to.innerHTML = toStr + " +" + to.getAttribute("gc_bonus");
                            if (to.getAttribute("gc_owner") == "none") {
                            }
                        } else if (toStr === 0) {
                            to.innerHTML = "";
                            to.setAttribute("gc_owner", "none");
                        } else to.innerHTML = toStr;
                        if (!opp) {
                            gc_lastClicked.style.boxShadow = "";
                            gc_lastClicked = to;
                            to.style.boxShadow = "0px 0px 20px 5px gold inset";
                            minigameMyTurn = false;
                            sendp2p(minigameOpp, "MOVE", from.getAttribute("id").replace(/\D+/g, ""), to.getAttribute("id").replace(/\D+/g, ""), percent);
                            gc_calculateBonuses(minigameOppPlayer);
                        } else {
                            minigameMyTurn = true;
                            gc_calculateBonuses(minigameMyPlayer);
                            if (allowedBrowserNotifications) {
                                var minigameTurnNotification = new Notification("Your turn", {
                                    body: "It's your turn in Grid Control"
                                });
                                setTimeout(function() {
                                    minigameTurnNotification.close();
                                }, 2000);
                            }
                        }
                        gc_redrawGrid();
                        window.gc_countUnits();
                        gc_checkVictory();
                        window.gc_highlightCurrentPlayer();
                    }
                }
            }
        };
        window.gc_countUnits = function() {
            for (let player in minigamesObject[minigameGame].players) {
                let territoriesOwned = $("[gc_owner]").filter(function() {
                    return $(this).attr("gc_owner") == player;
                });
                var unitCount = 0;
                Array.from(territoriesOwned).forEach(territory => {
                    unitCount += parseInt(territory.getAttribute("gc_str"));
                });
                minigamesObject[minigameGame].players[player].unitcount = unitCount;
                document.getElementById("gc_" + player + "_unitcount").innerHTML = unitCount;
            }
        };
        window.gc_highlightCurrentPlayer = function() {
            var playerToHighlight;
            if (minigameMyTurn) {
                playerToHighlight = minigameMyPlayer;
            } else playerToHighlight = minigameOppPlayer;
            for (let player in minigamesObject[minigameGame].players) {
                if (player == playerToHighlight) {
                    document.getElementById("gc_versus_" + player).style.boxShadow = "0px 5px 20px -5px black";
                } else document.getElementById("gc_versus_" + player).style.boxShadow = "";
            }
        };
        window.gc_redrawGrid = function() {
            for (let i = 0; i < 81; i++) {
                if (document.getElementById("gc_" + i)) {
                    let td = document.getElementById("gc_" + i);
                    if (td.getAttribute("gc_str") == "0") {
                        if (td.getAttribute("gc_bonus") == "0") {
                            td.setAttribute("gc_bonus","");
                            td.innerHTML = "";
                        } else if (td.getAttribute("gc_bonus")) {
                            td.innerHTML = "0";
                        } else td.innerHTML = "";
                    } else td.innerHTML = td.getAttribute("gc_str");
                    if (parseInt(td.getAttribute("gc_bonus")) > 0) {
                        td.append(" +" + parseInt(td.getAttribute("gc_bonus")));
                        td.style.color = "#d2d2d2";
                    } else if (parseInt(td.getAttribute("gc_bonus")) < 0) {
                        td.append(" " + parseInt(td.getAttribute("gc_bonus")));
                        td.style.color = "grey";
                    } else if (parseInt(td.getAttribute("gc_bonus")) === 0) {
                        td.append(" -" + parseInt(td.getAttribute("gc_bonus")));
                        td.style.color = "grey";
                    }
                    let owner = td.getAttribute("gc_owner");
                    if (minigamesObject[minigameGame].players[owner] && minigamesObject[minigameGame].players[owner].color) {
                        td.style.color = minigamesObject[minigameGame].players[owner].color;
                    }
                }
            }
        };
        window.minigamePing = function(pingTo, game) {
            sendp2p(pingTo, "PING");
            pingTimeStart = new Date().getTime();
        };
        window.prngGen = function(seed) {
            //pseudo-random seeded number gen
            seed = String(seed).replace(/[^a-z0-9]/gi, "");
            if (seed.length > 10) {
                seed = seed.substring(0, 10);
            }
            seed = seed.split("");
            for (let i = 0; i < seed.length; i++) {
                if (isNaN(seed[i])) {
                    seed[i] = String(seed[i].toLowerCase().charCodeAt(0) - 96);
                }
            }
            seed = parseInt(seed.join(""));
            this._seed = seed % 2147483647;
            if (this._seed <= 0) this._seed += 2147483646;
        };
        //Returns a pseudo-random value between 1 and 2^32 - 2.
        prngGen.prototype.next = function() {
            this._seed = this._seed * 16831 % 2147483647;
            return this._seed;
        };
        // Returns a pseudo-random floating point number from 0 to 1, non-inclusive.
        prngGen.prototype.nextFloat = function (min = 0, max = 1) {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
            return ((this.next() - 1) / 2147483646)*(max-min)+min;
        };
        //Returns an integer in the range [min, max]
        prngGen.prototype.nextInt = function (min = 0, max = 1) {
            return this.next()%(max-min+1)+min;
        };
        window.initialHighlightLastClicked = function() {
            let myUnits = $("[gc_owner]").filter(function() {
                return $(this).attr("gc_owner") == minigameMyPlayer;
            });
            myUnits.sort(function(a, b) {
                return a.getAttribute("gc_str") == b.getAttribute("gc_str") ? 0 : +(a.getAttribute("gc_str") > b.getAttribute("gc_str")) || -1;
            });
            if (myUnits.length >= 1) {
                myUnits[0].style.boxShadow = "0px 0px 20px 5px gold inset";
                gc_lastClicked = myUnits[0];
            }
        };
        window.seedPRNG = function(seed) { // chosen by fair dice roll
            var arrGen = [],
                cnt = 0;
            for (let a = 0; a < 12; a++) {
                seed = String(seed).replace(/[^a-z0-9]/gi, "");
                if (seed.length > 12) {
                    seed = seed.substring(0, 12);
                }
                if (seed == "0" || seed.length === 0) {
                    seed = "1337";
                }
                seed = seed.split("");
                for (let i = 0; i < seed.length; i++) {
                    if (isNaN(seed[i])) {
                        cnt++;
                        seed[i] = String(seed[i].toLowerCase().charCodeAt(0) - 96);
                    }
                }
                while (seed.join("").length > 10) {
                    cnt++;
                    let x = parseInt(seed[0]) + parseInt(seed[seed.length - 1]);
                    seed[seed.length - 1] = String(x);
                    seed.splice(1, 1);
                }
                seed = parseInt(seed.join(""));
                while (String(seed).length < 10) {
                    let x = String(seed).split("");
                    for (let i = 0; i < x.length; i++) {
                        cnt++;
                        seed += parseInt(x[i] + i + a);
                    }
                    if (String(seed).length < 10) {
                        x = String(seed).split("");
                        for (let j = 0; j < 2; j++) {
                            for (let i = 0; i < x.length; i++) {
                                cnt++;
                                if (parseInt(x[i] + 1) !== 0) {
                                    seed *= parseInt(x[i] + 1);
                                    seed += parseInt(x[i] + 1);
                                }
                                if (String(seed).length >= 10) break;
                            }
                        }
                    }
                    if (seed == "0") {
                        break;
                    }
                }
                let thisSeed = seed;
                seed = parseInt(String(thisSeed).substring(String(thisSeed).length - 9, String(thisSeed).length));
                if (String(seed).length != 9) {
                    seed = parseInt(String(thisSeed).substring(String(thisSeed).length - 10, String(thisSeed).length - 1));
                    if (String(seed).length != 9) {
                        seed = parseInt(String(thisSeed).substring(0, 9));
                    }
                }
                if (seed === 0) {
                    seed = parseInt(thisSeed);
                }
                arrGen.push(seed);
            }
            if (debugToConsole) console.log(cnt);
            let randomString = String(arrGen).replace(/,/g, "");
            return randomString;
        };
        window.gc_mapFromSeed = function(seed) {
            if (seed.length < 108) return;
            let arrIds = [],
                seedCount = -1;

            function nextRand() {
                seedCount++;
                if (!seed[seedCount]) return 0;
                return seed[seedCount];
            }
            for (let i = 0; i < 36; i++) { // for each grid on player2 side
                arrIds.push({
                    location: document.getElementById("gc_" + i),
                    seedValue: parseInt(nextRand()),
                });
            }
            arrIds.sort(function(a, b) {
                return a.seedValue == b.seedValue ? 0 : +(a.seedValue > b.seedValue) || -1;
            });
            for (let i = 0; i < 15; i++) {
                if (i === 0) { // player spawn
                    arrIds[i].location.setAttribute("gc_owner", "player2");
                    arrIds[i].location.setAttribute("gc_str", "3");
                } else if (i == 1) { // 1 + 1 bonus area
                    arrIds[i].location.setAttribute("gc_str", "1");
                    arrIds[i].location.setAttribute("gc_bonus", "1");
                    arrIds[i].location.setAttribute("gc_owner", "neutral");
                } else if (i <= 5) { // 4 positive bonus
                    arrIds[i].location.setAttribute("gc_str", nextRand());
                    arrIds[i].location.setAttribute("gc_bonus", nextRand());
                    arrIds[i].location.setAttribute("gc_owner", "neutral");
                } else { // negative bonus
                    arrIds[i].location.setAttribute("gc_str", 0);
                    arrIds[i].location.setAttribute("gc_bonus", parseInt(nextRand() * -1));
                    arrIds[i].location.setAttribute("gc_owner", "neutral");
                }
            }
            for (let i = 0; i < 36; i++) {
                document.getElementById("gc_" + (80 - i)).setAttribute("gc_str", document.getElementById("gc_" + i).getAttribute("gc_str"));
                document.getElementById("gc_" + (80 - i)).setAttribute("gc_bonus", document.getElementById("gc_" + i).getAttribute("gc_bonus"));
                document.getElementById("gc_" + (80 - i)).setAttribute("gc_owner", document.getElementById("gc_" + i).getAttribute("gc_owner"));
                if (document.getElementById("gc_" + (80 - i)).getAttribute("gc_owner") == "player2") {
                    document.getElementById("gc_" + (80 - i)).setAttribute("gc_owner", "player1");
                }
            }
        };
        window.gc_flipskiMapFromSeed = function(seed, mapDim = [9,9]) { //
            let seedRNG = new prngGen(seed); //turns the seed into a random number generator object
            mapArea = mapDim[0] * mapDim[1] - 1;
            let mapArr = [];
            let playerSpawnType = 0;
            let mapGenType = 0;
            let randomNumber = seedRNG.nextFloat();
            if (randomNumber < 0.8) { //80% chance for normal spawn
                playerSpawnType = 0;
            } else { //20% chance for multiple starting spawns
                playerSpawnType = 1;
            }
            randomNumber = seedRNG.nextFloat();
            if (randomNumber < 0.35) { //35% chance for a normal map
                mapGenType = 0;
            } else if (randomNumber < 0.50) { //15% chance for blob map
                mapGenType = 1;
            } else if (randomNumber < 0.60) { //10% chance for wall map
                mapGenType = 2;
            } else if (randomNumber < 0.70) { //10% chance for house map
                mapGenType = 3;
            } else if (randomNumber < 0.80) { //10% chance for rush map (lots of tiles with negative strength)
                mapGenType = 4;
            } else if (randomNumber < 0.90) { //10% chance for bigger bonus&strength the further away from spawn map
                mapGenType = 5;
            } else if (randomNumber < 0.99) { //9% chance for unbalanced map
                mapGenType = 6;
            } else { //1% chance for rare crazy map
                mapGenType = 7;
            }
            if (mapGenType === 0) { //Normal map
                for (let i = 0; i < mapDim[0] * Math.floor(mapDim[1] / 2); i++) { //loop through all the tiles on one map end.
                    if (seedRNG.nextFloat() < 1 / 3) { //1/3 of the tiles will be generated
                        let randomStrength = seedRNG.nextInt(0, 12); //0 to 12 inclusive.
                        let randomBonus = seedRNG.nextInt(-3, 6);
                        if (randomBonus === 0) {
                            randomBonus = null;
                        }
                        let tile = {
                            location: i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                        tile = {
                            location: mapArea - i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                    }
                }
            } else if (mapGenType == 1) { //Blobs
                //We don't generate the blob core in the top or bottom row and in the side columns so that there is more space for the blob itself to generate.
                for (let x_t = 1; x_t < mapDim[0] - 1; x_t++) { //x-coordinate
                    for (let y_t = 1; y_t < Math.floor(mapDim[1] / 2) - 1; y_t++) { //y-coordinate
                        let tileLocation = x_t + (y_t * mapDim[0]);
                        if (seedRNG.nextFloat() < 1 / 5) { //1 in 5 chance to generate a blob
                            let randomStrength = seedRNG.nextInt(12, 36);
                            let randomBonus = seedRNG.nextInt(4, 12);
                            if (randomBonus === 0) {
                                randomBonus = null;
                            }
                            let tile = {
                                location: tileLocation,
                                strength: randomStrength,
                                bonus: randomBonus,
                                owner: "neutral",
                            };
                            mapArr.push(tile);
                            tile = {
                                location: mapArea - tileLocation,
                                strength: randomStrength,
                                bonus: randomBonus,
                                owner: "neutral",
                            };
                            mapArr.push(tile);
                            for (let x_b = -1; x_b <= 1; x_b++) {
                                for (let y_b = -1; y_b <= 1; y_b++) { //loop through the tiles surrounding the core
                                    if ((x_b !== 0 || y_b !== 0) && seedRNG.nextFloat() < 2 / 3) { //66.66..% chance to generate a tile if it's not on the core
                                        tileLocation = (x_t + x_b) + ((y_t + y_b) * mapDim[0]); //Update the location variable to account for the actual tile that surrounds the blob core.
                                        randomStrength = seedRNG.nextInt(3, 12);
                                        randomBonus = seedRNG.nextInt(0, 4);
                                        if (randomBonus === 0) {
                                            randomBonus = null;
                                        }
                                        let tile = {
                                            location: tileLocation,
                                            strength: randomStrength,
                                            bonus: randomBonus,
                                            owner: "neutral",
                                        };
                                        mapArr.push(tile);
                                        tile = {
                                            location: mapArea - tileLocation,
                                            strength: randomStrength,
                                            bonus: randomBonus,
                                            owner: "neutral",
                                        };
                                        mapArr.push(tile);
                                    }
                                }
                            }
                        }
                    }
                }
            } else if (mapGenType == 2) { //Wall
                let loops = mapDim[1];
                if (loops % 2 === 0) {
                    loops--;
                }
                for (let i = 0; i < mapDim[0] * Math.floor(loops / 2); i++) { //loop through all the tiles on one map end. Except if it's an even number, then it leaves 2 rows for the wall.
                    if (seedRNG.nextFloat() < 1 / 3) { //1/3 of the tiles will be generated
                        let randomStrength = seedRNG.nextInt(0, 15); //0 to 12 inclusive.
                        let randomBonus = seedRNG.nextInt(1, 6);
                        if (randomBonus === 0) {
                            randomBonus = null;
                        }
                        let tile = {
                            location: i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                        tile = {
                            location: mapArea - i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                    }
                }
                for (let i = mapDim[0] * Math.floor((mapDim[1]) / 2); i < mapDim[0] * (Math.floor(mapDim[1] / 2) + 1); i++) { //loop through the middle in order to generate the wall.
                    let randomStrength = seedRNG.nextInt(0, 24);
                    let randomBonus = seedRNG.nextInt(-8, 0);
                    if (randomBonus === 0) {
                        randomBonus = null;
                    }
                    let tile = {
                        location: i,
                        strength: randomStrength,
                        bonus: randomBonus,
                        owner: "neutral",
                    };
                    mapArr.push(tile);
                    if (mapDim[1] % 2 === 0) { //If it's an even number
                        tile = {
                            location: mapArea - i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                    }
                }
            } else if (mapGenType == 3) { //House - Similar to blobs in generation
                for (let x_t = 1; x_t < mapDim[0] - 1; x_t++) { //x-coordinate
                    for (let y_t = 1; y_t < Math.floor(mapDim[1] / 2) - 1; y_t++) { //y-coordinate
                        let tileLocation = x_t + (y_t * mapDim[0]);
                        if (seedRNG.nextFloat() < 1 / 5) { //1 in 5 chance to generate a house
                            let randomStrength = seedRNG.nextInt(6, 12);
                            let randomBonus = seedRNG.nextInt(4, 24);
                            if (randomBonus === 0) {
                                randomBonus = null;
                            }
                            let tile = {
                                location: tileLocation,
                                strength: randomStrength,
                                bonus: randomBonus,
                                owner: "neutral",
                            };
                            mapArr.push(tile);
                            tile = {
                                location: mapArea - tileLocation,
                                strength: randomStrength,
                                bonus: randomBonus,
                                owner: "neutral",
                            };
                            mapArr.push(tile);
                            let doorwayX = seedRNG.nextInt(-1, 1);
                            let doorwayY = seedRNG.nextInt(-1, 1);
                            while (Math.abs(doorwayX) == Math.abs(doorwayY)) { //Check if the doorway is on the core, or if it's in a diagonal space. Basically an XOR gate
                                doorwayX = seedRNG.nextInt(-1, 1);
                                doorwayY = seedRNG.nextInt(-1, 1);
                            }
                            for (let x_b = -1; x_b <= 1; x_b++) {
                                for (let y_b = -1; y_b <= 1; y_b++) { //loop through the tiles surrounding the core
                                    if (!(x_b === 0 && y_b === 0) && !(x_b == doorwayX && y_b == doorwayY)) { //if it's not on the core and is not where the doorway is meant to be
                                        tileLocation = (x_t + x_b) + ((y_t + y_b) * mapDim[0]); //Update the location variable to account for the actual tile that surrounds the blob core.
                                        randomStrength = seedRNG.nextInt(6, 18);
                                        randomBonus = seedRNG.nextInt(-3, 0);
                                        if (randomBonus === 0) {
                                            randomBonus = null;
                                        }
                                        let tile = {
                                            location: tileLocation,
                                            strength: randomStrength,
                                            bonus: randomBonus,
                                            owner: "neutral",
                                        };
                                        mapArr.push(tile);
                                        tile = {
                                            location: mapArea - tileLocation,
                                            strength: randomStrength,
                                            bonus: randomBonus,
                                            owner: "neutral",
                                        };
                                        mapArr.push(tile);
                                    }
                                }
                            }
                        }
                    }
                }
            } else if (mapGenType == 4) { //Rush
                for (let i = 0; i < mapDim[0] * Math.floor(mapDim[1] / 2); i++) { //loop through all the tiles on one map end.
                    if (seedRNG.nextFloat() < 1 / 2) {
                        let randomStrength = seedRNG.nextInt(-16, -4); //0 to 12 inclusive.
                        let randomBonus = seedRNG.nextInt(2, 6);
                        if (randomBonus === 0) {
                            randomBonus = null;
                        }
                        let tile = {
                            location: i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                        tile = {
                            location: mapArea - i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                    }
                }
            } else if (mapGenType == 5) { //Distance scaling bonus&strength from center
                let centerTileX = Math.floor(mapDim[0] / 2); //It won't be quite the center tile in an even dimensioned map, but it's close enough for my idea.
                let centerTileY = Math.floor(mapDim[1] / 2);
                for (let x_t = 0; x_t < mapDim[0]; x_t++) { //x-coordinate
                    for (let y_t = 0; y_t < Math.floor(mapDim[1] / 2); y_t++) { //y-coordinate
                        if (seedRNG.nextFloat() < 2 / 5) {
                            let tileLocation = x_t + (y_t * mapDim[0]);
                            let distanceFromCenter = Math.round(Math.sqrt(Math.pow(centerTileX - x_t, 2) + Math.pow(centerTileY - y_t, 2))); //distance from center rounded to nearest int. See: distance between two points.
                            let distanceMulti = distanceFromCenter;
                            let randomStrength = seedRNG.nextInt(3 * distanceMulti, 6 * distanceMulti); //0 to 12 inclusive.
                            let randomBonus = seedRNG.nextInt(-2 * distanceMulti, 4 * distanceMulti);
                            if (randomBonus === 0) {
                                randomBonus = null;
                            }
                            let tile = {
                                location: tileLocation,
                                strength: randomStrength,
                                bonus: randomBonus,
                                owner: "neutral",
                            };
                            mapArr.push(tile);
                            tile = {
                                location: mapArea - tileLocation,
                                strength: randomStrength,
                                bonus: randomBonus,
                                owner: "neutral",
                            };
                            mapArr.push(tile);
                        }
                    }
                }
            } else if (mapGenType == 6) { //Unbalanced
                for (let i = 0; i < mapDim[0] * mapDim[1]; i++) { //loop through all the tiles on one map end.
                    if (seedRNG.nextFloat() < 2 / 5) {
                        let randomStrength = seedRNG.nextInt(4, 12); //0 to 12 inclusive.
                        let randomBonus = seedRNG.nextInt(1, 8);
                        if (randomBonus === 0) {
                            randomBonus = null;
                        }
                        let tile = {
                            location: i,
                            strength: randomStrength,
                            bonus: randomBonus,
                            owner: "neutral",
                        };
                        mapArr.push(tile);
                    }
                }
            } else if (mapGenType == 7) { //Crazy
                for (let i = 0; i < mapDim[0] * Math.floor(mapDim[1] / 2); i++) { //loop through all the tiles on one map end.
                    let randomStrength = seedRNG.nextInt(-20, 100); //0 to 12 inclusive.
                    let randomBonus = seedRNG.nextInt(-40, 150);
                    if (randomBonus === 0) {
                        randomBonus = null;
                    }
                    let tile = {
                        location: i,
                        strength: randomStrength,
                        bonus: randomBonus,
                        owner: "neutral",
                    };
                    mapArr.push(tile);
                    tile = {
                        location: mapArea - i,
                        strength: randomStrength,
                        bonus: randomBonus,
                        owner: "neutral",
                    };
                    mapArr.push(tile);
                }
            }
            if (playerSpawnType === 0) { //Player spawn gen is last so that it overwrites the map gen
                let playerLocation = seedRNG.nextInt(0, mapDim[0] * Math.floor(mapDim[1] / 2) - 1); //spawn in the upper half part of the map, excluding the middle row if there is any.
                let playerStrength = 1;
                let playerBonus = 1;
                let tile = { //player 2
                    location: playerLocation,
                    strength: playerStrength,
                    bonus: playerBonus,
                    owner: "player2",
                };
                mapArr.push(tile);
                tile = { //player 1
                    location: mapArea - playerLocation,
                    strength: playerStrength,
                    bonus: playerBonus,
                    owner: "player1",
                };
                mapArr.push(tile);
            } else if (playerSpawnType == 1) {
                let amountLoops = seedRNG.nextInt(2, 5); //2 to 5 player spawns
                for (let i = 0; i < amountLoops; i++) {
                    let playerLocation = seedRNG.nextInt(0, mapDim[0] * Math.floor(mapDim[1] / 2) - 1); //spawn in the upper half part of the map, excluding the middle row if there is any.
                    let playerStrength = seedRNG.nextInt(1, 5);
                    let playerBonus = seedRNG.nextInt(0, 2);
                    let tile = { //player 2
                        location: playerLocation,
                        strength: playerStrength,
                        bonus: playerBonus,
                        owner: "player2",
                    };
                    mapArr.push(tile);
                    tile = { //player 1
                        location: mapArea - playerLocation,
                        strength: playerStrength,
                        bonus: playerBonus,
                        owner: "player1",
                    };
                    mapArr.push(tile);
                }
            }
            for (let i = 0; i < mapArr.length; i++) { //Generate the map
                let tile = document.getElementById("gc_" + mapArr[i].location);
                if (mapArr[i].owner != "neutral") {
                    tile.setAttribute("gc_bonus", "");
                }
                //Tile can have strength, bonus, and owner.
                tile.setAttribute("gc_str", mapArr[i].strength);
                if (mapArr[i].bonus) {
                    tile.setAttribute("gc_bonus", mapArr[i].bonus);
                }
                tile.setAttribute("gc_owner", mapArr[i].owner);
            }
        };

        window.changeLobbyView = function() {
            minigameCurrentSelectedGame = document.getElementById("inputGame").value;
            loadMinigame(minigameGame);
            //document.getElementById("inputGame").value = minigameCurrentSelectedGame;
        };
        window.tmg_pokerServerConnectChangeButton = function() {
            if (document.getElementById("tmg_pokerServerConnect").getAttribute("value") == "Disconnected") {
                minigameTryingToConnectToPokerServer = true;
                tmg_pokerConnectionHandler();
                document.getElementById("tmg_pokerServerConnect").setAttribute("value","Connecting...");
                document.getElementById("tmg_pokerServerConnect").style.border = "#bf9000 ridge";
                document.getElementById("tmg_pokerServerConnect").style.background = "radial-gradient(white, #fff2cc, #ffe599)";
            } else if (document.getElementById("tmg_pokerServerConnect").getAttribute("value") == "Connected" || document.getElementById("tmg_pokerServerConnect").getAttribute("value") == "Retrying..." || document.getElementById("tmg_pokerServerConnect").getAttribute("value") == "Connecting...") {
                minigameTryingToConnectToPokerServer = false;
                tmg_pokerServerPingSent = false;
                clearTimeout(tmg_pokerServerTimeoutVar);
                tmg_pokerConnectionHandler();
                document.getElementById("tmg_pokerServerConnect").setAttribute("value","Disconnected");
                document.getElementById("tmg_pokerServerConnect").style.border = "#990000 ridge";
                document.getElementById("tmg_pokerServerConnect").style.background = "radial-gradient(white, #f4cccc, #ea9999)";
            }
        };
        window.tmg_pokerServerConnect = function() {
            if (minigameTryingToConnectToPokerServer) {
                sendp2p(pokerServerUsername,"CONNECT");
                if (minigameConnectedToPokerServer && minigameMyStatus != "ingame") {
                    console.log(minigameConnectedToPokerServer + "yes");
                    //tmg_pokerRequestGamesLobby();
                }
            }
        };
        window.tmg_pokerRequestGamesLobby = function() {
            sendp2p(pokerServerUsername,"LOBBY", "LOAD_LOBBY");
        };
        function tmg_pokerConnectionHandler() {
            let minigameTimeSinceLastContactFromPokerServer = new Date().getTime() - minigameLastMessageFromPokerServer;
            if (minigameConnectedToPokerServer && minigameTimeSinceLastContactFromPokerServer >= 15000) {
                minigameTryingToConnectToPokerServer = true;
                tmg_pokerServerPingSent = true;
                tmg_pokerServerConnect();
                tmg_pokerServerTimeoutVar = setTimeout(function() {
                    if (tmg_pokerServerPingSent) {
                        tmg_pokerConnectionLost();
                    }
                }, 5000);
            }
            if (minigameTryingToConnectToPokerServer) {
                if ((minigameLastMessageFromPokerServer == -1 || minigameTimeSinceLastContactFromPokerServer >= 15000) && !tmg_pokerServerPingSent) {
                    tmg_pokerServerPingSent = true;
                    tmg_pokerServerConnect();
                    tmg_pokerServerTimeoutVar = setTimeout(function() {
                        if (tmg_pokerServerPingSent) {
                            tmg_pokerConnectionLost();
                        }
                    }, 5000);
                }
            }
        }
        window.tmg_pokerInterpretMove = function(table, seat, action, amount) {
            if (table == minigamePokerMyTable) {
                if (minigamesObject[minigameCurrentSelectedGame].tables[table] && minigamesObject[minigameCurrentSelectedGame].tables[table].seats[seat]) {
                    if (action == "BET" || action == "RAISE") {
                        let coinString = '<img src="images/coins.png" class="image-icon-20">';
                        document.getElementById("poker_betBox_"+seat).style.display = "";
                        document.getElementById("poker_betBox_"+seat).innerHTML = coinString + numberWithCommas(amount);
                    } else if (action == "FOLD") {
                        if (minigamePokerMySeat && seat == minigamePokerMySeat) {
                            document.getElementById("poker_"+seat+"_card1").style.opacity = "0.6";
                            document.getElementById("poker_"+seat+"_card2").style.opacity = "0.6";
                        } else {
                            document.getElementById("poker_"+seat+"_card1").style.opacity = "0";
                            document.getElementById("poker_"+seat+"_card2").style.opacity = "0";
                        }
                    }
                }
            }
        };
        window.loadMinigame = function(game) {
            while (minigamesElement.firstChild) {
                minigamesElement.removeChild(minigamesElement.firstChild);
            }
            minigameGame = game;
            console.log(minigameGame);
            let topDiv = document.createElement("div");
            topDiv.setAttribute("style","display:flex;align-items:center;width:100%;text-align:center;border-bottom: grey ridge;background: radial-gradient(gold, #f0f0f0)");
            let gameTitle = document.createElement("span");
            gameTitle.setAttribute("style","font-size:30px;user-select:none;cursor:default;flex-grow:1");
            gameTitle.setAttribute("id","tmg_gameTitle");
            gameTitle.append(game);
            topDiv.append(gameTitle);

            var tmgClose = document.createElement("button");
            tmgClose.setAttribute("style", "cursor:pointer;float:right;height:18px;width:18px;border-radius:18px;cursor:pointer;background-color:#ff7878;margin:2px 9px 2px 2px");
            tmgClose.setAttribute("onclick", "minigamesButton.click()");
            tmgClose.setAttribute("id", "tmgClose");
            tmgClose.setAttribute("title", "Minimise");
            topDiv.append(tmgClose);
            minigamesElement.append(topDiv);

            var offX, offY;
            function addListeners() {
                document.getElementById('tmg_gameTitle').addEventListener('mousedown', mouseDown, false);
                window.addEventListener('mouseup', mouseUp, false);

            }
            function mouseUp() {
                window.removeEventListener('mousemove', divMove, true);
            }
            function mouseDown(e) {
                var div = document.getElementById('gameWrapper');
                offY= e.clientY-parseInt(div.offsetTop);
                offX= e.clientX-parseInt(div.offsetLeft);
                window.addEventListener('mousemove', divMove, true);
            }
            function divMove(e) {
                var div = document.getElementById("gameWrapper");
                div.style.position = "absolute";
                div.style.top = (e.clientY-offY) + 'px';
                div.style.left = (e.clientX-offX) + 'px';
                if (div.offsetLeft < 1) {
                    div.style.left = "1px";
                }
                if (div.offsetTop < 50) {
                    div.style.top = "50px";
                }
                /*if (div.offsetLeft > $(window).width() - 50 - div.offsetWidth) {
					div.style.left = $(window).width() - 50 - div.offsetWidth + "px";
				}
				if (div.offsetTop > $(window).height() - 50 - div.offsetHeight) {
					div.style.top = $(window).height() - 50 - div.offsetHeight + "px";
				}*/
            }
            addListeners();

            minigamesElement.append(document.createElement("br"));
            let reset = document.createElement("input");
            reset.setAttribute("type", "button");
            reset.setAttribute("id", "tmg_reset");
            reset.setAttribute("value", "Temporary Reset Button");
            reset.setAttribute("onclick", "tmgReset()");
            reset.setAttribute("style", "float:right;padding-right:10px;");
            minigamesElement.append(reset);
            minigamesElement.append(document.createElement("br"));

            let inputGame = document.createElement("select");
            inputGame.setAttribute("id", "inputGame");
            inputGame.setAttribute("style", "cursor:pointer;user-select:none;");
            inputGame.setAttribute("onchange", "changeLobbyView()");
            Object.keys(minigamesObject).forEach((game) => {
                let opt = document.createElement("option");
                opt.setAttribute("value", game);
                opt.append(game);
                inputGame.append(opt);
            });
            inputGame.setAttribute("value", minigameGame);
            minigamesElement.append(inputGame);
            minigamesElement.append(document.createElement("br"));

            if (minigameCurrentSelectedGame.toLowerCase().includes("poker")) {
                let tmg_pokerServerConnect = document.createElement("input");
                tmg_pokerServerConnect.setAttribute("id","tmg_pokerServerConnect");
                tmg_pokerServerConnect.setAttribute("type","button");
                tmg_pokerServerConnect.setAttribute("value","Disconnected");
                tmg_pokerServerConnect.setAttribute("style","cursor:pointer;user-select:none;outline:0;font-weight:bold;border-radius:10px;border:#990000 ridge;background:radial-gradient(white, #f4cccc, #ea9999)");
                tmg_pokerServerConnect.setAttribute("onclick","tmg_pokerServerConnectChangeButton()");
                minigamesElement.append(tmg_pokerServerConnect);
                minigamesElement.append(document.createElement("br"));
                minigamesElement.append(pokerLobbyContainer);
            } else if (minigameCurrentSelectedGame == "Grid Control") {
                let tempHelp = document.createElement("span");
                tempHelp.style.fontSize = "20px";
                tempHelp.append("Super early version, click your coloured number, use the cursor to point at target square, use keys: 1/2/3/4 to move to adjacent square, capture territory bonuses to gain more units. 1= send 100%, 2=50%, 3=33%, 4=25%. If something bugs out use the Reset button to quit the current game. If the game unexpectedly closes, your opponent just hit Reset.");
                minigamesElement.append(tempHelp);
                minigamesElement.append(document.createElement("br"));
                let challengeFlex = document.createElement("div");
                challengeFlex.setAttribute("style", "display:flex;flex-direction:row;align-items:center;justify-content:center");
                minigamesElement.append(challengeFlex);
                minigamesElement.append(document.createElement("br"));
                let inputOpp = document.createElement("input");
                inputOpp.setAttribute("type", "text");
                inputOpp.setAttribute("id", "inputOpp");
                inputOpp.setAttribute("maxlength", "12");
                inputOpp.setAttribute("placeholder", "Opponent name...");
                inputOpp.setAttribute("style", "width:125px");
                window.enterSendChallenge = function() {
                    if (typeof(inputOppChallengeSent) != "undefined" && event.keyCode == 13 && !inputOppChallengeSent) {
                        document.getElementById('submitOpp').click();
                        inputOppChallengeSent=true;
                    }
                };
                inputOpp.setAttribute("onkeydown", "enterSendChallenge();");
                inputOpp.setAttribute("onkeyup", "inputOppChallengeSent=false");
                challengeFlex.append(inputOpp);
                challengeFlex.append(document.createTextNode("\u00a0")); //nbsp
                let inputVersion = document.createElement("select");
                inputVersion.setAttribute("id", "inputVersion");
                inputVersion.setAttribute("onchange", "showOrHideSeedInput()");
                Object.keys(minigamesObject[minigameCurrentSelectedGame].maps).forEach((map) => {
                    let opt = document.createElement("option");
                    opt.setAttribute("value", map);
                    opt.append(map);
                    inputVersion.append(opt);
                });
                challengeFlex.append(inputVersion);
                challengeFlex.append(document.createTextNode("\u00a0")); //nbsp
                let currentSelectedMap = document.getElementById("inputVersion").value;
                window.showOrHideSeedInput = function() {
                    if (minigamesObject[document.getElementById("inputGame").value].maps[document.getElementById("inputVersion").value].mapGen) {
                        document.getElementById("inputSeed").disabled = false;
                        document.getElementById("inputSeed").focus();
                    } else document.getElementById("inputSeed").disabled = true;
                };
                let inputSeed = document.createElement("input");
                inputSeed.setAttribute("type", "text");
                inputSeed.setAttribute("id", "inputSeed");
                inputSeed.setAttribute("placeholder", "Input seed...");
                inputSeed.setAttribute("style", "width: 125px");
                inputSeed.setAttribute("maxlength", "12");
                if (minigamesObject[minigameCurrentSelectedGame].maps[currentSelectedMap].mapGen) {
                    inputSeed.disabled = false;
                } else inputSeed.disabled = true;
                if (minigameSeed && minigameSeed != "!NOSEED!") {
                    inputSeed.setAttribute("value", minigameSeed);
                }
                challengeFlex.append(inputSeed);
                challengeFlex.append(document.createTextNode("\u00a0")); //nbsp
                let submitOpp = document.createElement("input");
                submitOpp.setAttribute("type", "button");
                submitOpp.setAttribute("id", "submitOpp");
                submitOpp.setAttribute("value", "Challenge");
                submitOpp.setAttribute("onclick", "sendChallenge()");
                challengeFlex.append(submitOpp);
                challengeFlex.append(document.createTextNode("\u00a0")); //nbsp
                if (minigameMyStatus == "ingame") {
                    let surrender = document.createElement("input");
                    surrender.setAttribute("type", "button");
                    surrender.setAttribute("id", "tmg_surrender");
                    surrender.setAttribute("value", "Surrender");
                    surrender.setAttribute("onclick", "gc_checkVictory('"+minigameMyPlayer+"')");
                    challengeFlex.append(surrender);
                }
                minigamesElement.append(challengeContainer);
                minigamesElement.append(versusContainer);
                minigamesElement.append(document.createElement("br"));
            }

            if (game == "Minigames") {
            } else if (game == "Poker") {
                //gamecode
                window.arrangeSeats = function() {
                    let maxPlayers = minigamesObject.Poker.tables["1"].gameInfo.maxPlayers;
                    var seatLocations = {
                        1: {
                            top: "10%",
                            bottom: "",
                            left: "12%",
                            button: {
                                top: "25%",
                                bottom: "",
                                left: "18%",
                            },
                            betBox: {
                                top: "32%",
                                bottom: "",
                                left: "25%",
                            },
                        },
                        2: {
                            top: "0%",
                            bottom: "",
                            left: "50%",
                            button: {
                                top: "15%",
                                bottom: "",
                                left: "56%",
                            },
                            betBox: {
                                top: "25%",
                                bottom: "",
                                left: "50%",
                            },
                        },
                        3: {
                            top: "10%",
                            bottom: "",
                            left: "88%",
                            button: {
                                top: "20%",
                                bottom: "",
                                left: "75%",
                            },
                            betBox: {
                                top: "32%",
                                bottom: "",
                                left: "75%",
                            },
                        },
                        4: {
                            top: "",
                            bottom: "10%",
                            left: "88%",
                            button: {
                                top: "",
                                bottom: "20%",
                                left: "75%",
                            },
                            betBox: {
                                top: "",
                                bottom: "32%",
                                left: "75%",
                            },
                        },
                        5: {
                            top: "",
                            bottom: "0%",
                            left: "50%",
                            button: {
                                top: "",
                                bottom: "15%",
                                left: "56%",
                            },
                            betBox: {
                                top: "",
                                bottom: "25%",
                                left: "50%",
                            },
                        },
                        6: {
                            top: "",
                            bottom: "10%",
                            left: "12%",
                            button: {
                                top: "",
                                bottom: "25%",
                                left: "18%",
                            },
                            betBox: {
                                top: "",
                                bottom: "32%",
                                left: "25%",
                            },
                        },
                    }; // 6max
                    var seatAdjust = 5 - minigamePokerMySeat; // rotate all seats so player is in seat 5 (bottom middle)
                    for (let i = 1; i <= 6; i++) {
                        let a = i + seatAdjust;
                        if (a < 1) a = 6 - a;
                        if (a > 6) a = a - 6;
                        let pokerSeat = document.createElement("div");
                        pokerSeat.setAttribute("style","display:none;position:absolute;top:"+seatLocations[a].top+";bottom:"+seatLocations[a].bottom+";left:"+seatLocations[a].left+";transform:translate(-50%, 0)");
                        pokerSeat.setAttribute("id","poker_seat_"+i);
                        let newFlex = document.createElement("div");
                        newFlex.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:center");
                        pokerSeat.append(newFlex);
                        let cardSlot1 = document.createElement("div");
                        cardSlot1.setAttribute("style","display:none;width:80px;height:112px");
                        cardSlot1.setAttribute("id","poker_"+i+"_card1");
                        newFlex.append(cardSlot1);
                        let cardSlot2 = document.createElement("div");
                        cardSlot2.setAttribute("style","display:none;width:80px;height:112px");
                        cardSlot2.setAttribute("id","poker_"+i+"_card2");
                        newFlex.append(cardSlot2);
                        let playerInfo = document.createElement("div");
                        playerInfo.setAttribute("style","display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-width:80px;border-style:ridge;border-color:grey;background:black;color:white");
                        playerInfo.setAttribute("id","poker_"+i+"_playerinfo");
                        playerInfo.append(document.createElement("br"));
                        let chips = document.createElement("div");
                        chips.append(coinImg.cloneNode());
                        playerInfo.append(chips);
                        newFlex.append(playerInfo);
                        poker_table_container.append(pokerSeat);

                        let betBox = document.createElement("div");
                        betBox.setAttribute("style","display:none;position:absolute;top:"+seatLocations[a].betBox.top+";bottom:"+seatLocations[a].betBox.bottom+";left:"+seatLocations[a].betBox.left+";transform:translate(-50%, 0);border-style:ridge;border-color:grey;background:black;color:white");
                        betBox.setAttribute("id","poker_betBox_"+i);
                        betBox.append(coinImg.cloneNode());
                        poker_table_container.append(betBox);

                        let pokerButton = document.createElement("img");
                        pokerButton.setAttribute("style","display:none;width:50px;height:50px;position:absolute;top:"+seatLocations[a].button.top+";bottom:"+seatLocations[a].button.bottom+";left:"+seatLocations[a].button.left+";transform:translate(-50%, 0)");
                        pokerButton.setAttribute("id","poker_button_"+i);
                        pokerButton.setAttribute("src","images/donorCoins.png");
                        poker_table_container.append(pokerButton);

                        loadCard("??","poker_"+i+"_card1");
                        loadCard("??","poker_"+i+"_card2");
                    }

                    let communityCards = document.createElement("div");
                    communityCards.setAttribute("style","display:flex;flex-direction:row;justify-content:flex-start;width:400px;height:112px;position:absolute;top:45%;left:50%;transform:translate(-50%, 0)");
                    poker_table_container.append(communityCards);
                    for (let i = 1; i <= 5; i++) {
                        let community = document.createElement("div");
                        community.setAttribute("style","display:none");
                        community.setAttribute("id","poker_community_" + i);
                        communityCards.append(community);

                        loadCard("3h","poker_community_"+i);
                    }
                    let potsContainer = poker_table_container.appendChild(document.createElement("div"));
                    potsContainer.setAttribute("style","display:flex;justify-content:center;text-align:center;position:absolute;top:34%;left:50%;transform:translate(-50%, 0)");
                    potsContainer.setAttribute("id","tmg_pokerPotsContainer");
                    let mainPotContainer = potsContainer.appendChild(document.createElement("div"));
                    mainPotContainer.setAttribute("style","text-align:center;background:black;color:white;border-style:ridge;border-color:grey;display:flex;flex-direction:column;justify-content:center;width:90px;height:35px");
                    let mainPotText = mainPotContainer.appendChild(document.createTextNode("Main Pot"));
                    mainPotContainer.append(document.createElement("br"));
                    let mainPot = mainPotContainer.appendChild(document.createElement("div"));
                    mainPot.setAttribute("id","tmg_pokerMainPot");
                    mainPot.append("0");
                };
                var poker_table_container = document.createElement("div");
                poker_table_container.setAttribute("style", "position:relative");
                poker_table_container.setAttribute("id", "poker_table_container");
                minigamesElement.append(poker_table_container);
                let tableBackground = document.createElement("img");
                tableBackground.src = "http://i.imgur.com/CAVjRPT.png";
                tableBackground.setAttribute("style","width:1200px"); //width:90vw;max-width:1200px
                tableBackground.setAttribute("id","pokerTableBackground");
                poker_table_container.append(tableBackground);
                arrangeSeats();
            } else if (game == "Grid Control") {
                // Grid Control Game
                let gc_container = document.createElement("div");
                gc_container.setAttribute("style", "background:black;color:white");
                gc_container.setAttribute("id", "gc_container");
                minigamesElement.append(gc_container);
                gc_lastClicked = false;
                var grid = clickableGrid(9, 9, "Standard map", function(el) {
                    if (minigameMyPlayer == el.getAttribute("gc_owner")) {
                        el.style.boxShadow = "0px 0px 20px 5px gold inset";
                        if (gc_lastClicked && el != gc_lastClicked) {
                            gc_lastClicked.style.boxShadow = "";
                        }
                        gc_lastClicked = el;
                    }
                });
                gc_container.appendChild(grid);

                if (minigamesObject[game].maps[minigameVersion]) {
                    if (!minigamesObject[game].maps[minigameVersion].mapGen && minigamesObject[game].maps[minigameVersion].mapData) {
                        //not mapGen, but has mapData (default maps same every time)
                        let mapData = minigamesObject[game].maps[minigameVersion].mapData;
                        mapData.forEach(obj => {
                            let gridObj = document.getElementById("gc_"+obj.id);
                            for (let key in obj) {
                                if (key == "id") continue;
                                gridObj.setAttribute(key, obj[key]);
                            }
                        });
                    } else if (minigamesObject[game].maps[minigameVersion].mapGen) {
                        //mapGen using seed
                        if (minigameVersion == "Ted map gen") {
                            gc_mapFromSeed(seedPRNG(minigameSeed));
                        } else if (minigameVersion == "FlipskiZ map gen"){
                            gc_flipskiMapFromSeed(minigameSeed);
                        }
                    } else console.log("No map data or map gen for this version: "+minigameVersion);
                    gc_redrawGrid();
                    initialHighlightLastClicked();
                } else console.log(game+ " map not found: "+minigameVersion);

                setTimeout(function() {
                    window.gc_highlightCurrentPlayer();
                    window.gc_countUnits();
                }, 1);
                window.onmousemove = function(mouseMove) {
                    browserMouseX = mouseMove.clientX;
                    browserMouseY = mouseMove.clientY;
                    var overElements = document.elementsFromPoint(browserMouseX, browserMouseY);
                    if (lastHover && lastHover != overElements[0] && (lastHover != gc_lastClicked || !gc_lastClicked)) {
                        lastHover.style.boxShadow = "";
                    }
                    if (overElements.includes(gc_container) && overElements[0].getAttribute("gc_row")) {
                        if (!gc_lastClicked || gc_lastClicked != overElements[0]) {
                            overElements[0].style.boxShadow = "0px 0px 10px 5px green inset";
                        }
                        lastHover = overElements[0];
                    }
                };
                window.onkeypress = function(event) {
                    event = event || window.event;
                    var charCode = event.keyCode || event.which;
                    var overElements = document.elementsFromPoint(browserMouseX, browserMouseY);
                    if (overElements.includes(gc_container) && gc_lastClicked && overElements[0].getAttribute("id").replace(/\D+/g, "")) {
                        let endPoint = overElements[0];
                        if (endPoint.getAttribute("id").replace(/\D+/g, "") !== gc_lastClicked.getAttribute("id").replace(/\D+/g, "") && endPoint.getAttribute("gc_row") - gc_lastClicked.getAttribute("gc_row") <= 1 && endPoint.getAttribute("gc_row") - gc_lastClicked.getAttribute("gc_row") >= -1 && endPoint.getAttribute("gc_col") - gc_lastClicked.getAttribute("gc_col") <= 1 && endPoint.getAttribute("gc_col") - gc_lastClicked.getAttribute("gc_col") >= -1) {
                            if (charCode == 49) {
                                gc_moveUnits(gc_lastClicked, endPoint, "100");
                            } else if (charCode == 50) {
                                gc_moveUnits(gc_lastClicked, endPoint, "50");
                            } else if (charCode == 51) {
                                gc_moveUnits(gc_lastClicked, endPoint, "33");
                            } else if (charCode == 52) {
                                gc_moveUnits(gc_lastClicked, endPoint, "25");
                            }
                        }
                    }
                };
            }
        };

        function minigamesInit() {
            let gameWrapper = document.createElement("div");
            gameWrapper.setAttribute("id", "gameWrapper");
            gameWrapper.setAttribute("style", "position:absolute;left:200px;top:200px;max-width:1200px;display:none;background-color:#dddddd;border-style:ridge;border-color:grey");
            document.body.append(gameWrapper);
            minigamesElement.setAttribute("style", "min-width:200px;background:linear-gradient(#eff1c5,#a2a77f);display:flex;flex-direction:column;align-items:center;justify-content:center");
            minigamesElement.setAttribute("id", "minigamesElement");
            gameWrapper.append(minigamesElement);
            loadMinigame("Minigames");
        }
        // END OF MINIGAMES
        function getMarketItems() {
            var currentItemId;
            arrMarketItems = {};
            for (var i = 1; i < document.getElementById("market-table").rows.length; i++) {
                if (typeof(document.getElementById("market-table").rows[i].childNodes[0]) != "undefined" && document.getElementById("market-table").rows[i].childNodes[0] !== null) {
                    let itemName = itemNameFix(document.getElementById("market-table").rows[i].childNodes[0].innerHTML);
                    let itemId = parseInt(document.getElementById("market-table").rows[i].getAttribute("data-market-itemid"));
                    let itemPrice = parseInt(document.getElementById("market-table").rows[i].getAttribute("data-market-price"));
                    let itemAmount = parseInt(document.getElementById("market-table").rows[i].getAttribute("data-market-amount"));
                    let itemMarketId = parseInt(document.getElementById("market-table").rows[i].getAttribute("data-market-marketid"));
                    let row = parseInt(i);
                    if (itemId != currentItemId) {
                        currentItemId = itemId;
                        if (!arrMarketItems[itemName]) {
                            arrMarketItems[itemName] = [];
                        }
                    }
                    arrMarketItems[itemName].push({
                        id: itemId,
                        price: itemPrice,
                        amount: itemAmount,
                        marketid: itemMarketId,
                        row: row
                    });
                }
            }
        }

        function addItemTooltips() {
            if (itemTooltips) {
                for (var i = 0; i < Object.keys(arrMarketItems).length; i++) {
                    if (document.getElementById("tooltip-" + Object.keys(arrMarketItems)[i]) !== null) {
                        let itemName = Object.keys(arrMarketItems)[i];
                        let minPrice = arrMarketItems[Object.keys(arrMarketItems)[i]][0].price;
                        let marketTotal = window[itemName] * minPrice;
                        var newTooltip = "<b>Market price: </b><img class='image-icon-20' src='images/coins.png'> " + numberWithCommas(minPrice) + "<br><b>Market total: </b><img class='image-icon-20' src='images/coins.png'> " + numberWithCommas(marketTotal);
                        if (document.getElementById("tooltip-" + itemName).lastElementChild.tagName == "DIV") {
                            document.getElementById("tooltip-" + itemName).removeChild(document.getElementById("tooltip-" + itemName).lastChild);
                        }
                        var tooltipElement = document.createElement("div");
                        tooltipElement.innerHTML = newTooltip;
                        document.getElementById("tooltip-" + itemName).appendChild(tooltipElement);
                    }
                }
            }
        }
        window.disableBtn = function(btn, time) {
            if (!btn.disabled) {
                var oldStyle;
                if (btn.parentNode && btn.parentNode.id == "browseAllElementWrapper") {
                    oldStyle = "margin:5px;padding:0px;";
                } else oldStyle = "";
                btn.disabled = true;
                sendToSpreadsheet_timeoutStart = new Date().getTime();
                if (btn.id == "ted-browse-all" && sendMarketData === true && sendToSpreadsheet_timeoutStart - sendToSpreadsheet_timeout > sendMarketDataWaitTimeMins) {
                    btn.setAttribute("style", oldStyle + "box-shadow: 0 0 30px 6px rgba(0, 255, 0, 1) inset;transition: box-shadow 0.3s ease-out;");
                    setTimeout(function() {
                        btn.setAttribute("style", oldStyle + "box-shadow: 0 0 30px 6px rgba(0, 255, 0, 0) inset;transition: box-shadow 0.3s ease-out;");
                        btn.disabled = false;
                    }, time);
                } else {
                    btn.setAttribute("style", oldStyle + "box-shadow: 0 0 30px 6px rgba(255, 0, 0, 1) inset;transition: box-shadow 0.3s ease-out;");
                    setTimeout(function() {
                        btn.setAttribute("style", oldStyle + "box-shadow: 0 0 30px 6px rgba(255, 0, 0, 0) inset;transition: box-shadow 0.3s ease-out;");
                        btn.disabled = false;
                    }, time);
                }
            }
        };

        function sendToSpreadsheet(msg) {
            if (sendMarketData === true) {
                sendToSpreadsheet_timeoutStart = new Date().getTime();
                if (sendToSpreadsheet_timeoutStart - sendToSpreadsheet_timeout > sendMarketDataWaitTimeMins) {
                    sendToSpreadsheet_timeout = sendToSpreadsheet_timeoutStart;
                    $.post("https://script.google.com/macros/s/AKfycbx_izl1yk0PLUNp4te3swi3uSxrEu4L7E0JueJ72cS0r899Wj7z/exec", {
                        marketData: msg,
                        user: username
                    });
                    $.post("https://dhmarket.000webhostapp.com/data_post.php", {
                        marketData: msg,
                        user: username
                    });
                    console.log("Ted's Market: Don't worry about 'XMLHttpRequest cannot load...' error, data was sent successfully.");
                }
            }
        }

        function calculateFlips() {
            totalFlipProfit = 0;
            var arrProfitDone = [];
            for (let i = 0; i < tedStoredSettings.tradeHistory.length; i++) {
                var objArr = [];
                let th = tedStoredSettings.tradeHistory[i];
                if (!isInArray(arrProfitDone, th.name)) {
                    if ((exactMatch && th.name.toLowerCase().match(exactSearch)) || !exactMatch && (searchString === "" || th.name.toLowerCase().includes(searchString) || getItemName(th.name).toLowerCase().includes(searchString))) {
                        for (let a = i; a < tedStoredSettings.tradeHistory.length; a++) {
                            let tha = tedStoredSettings.tradeHistory[a];
                            if (tha.name == th.name) {
                                let tradeType = tha.tradetype;
                                if (tradeType == "buy") {
                                    if (typeof(tha.flipaccountedfor == "undefined")) {
                                        tha.flipaccountedfor = 0;
                                    }
                                    if (tha.flipaccountedfor == tha.amount) {
                                        continue;
                                    } else {
                                        objArr.push(tha);
                                    }
                                } else if (tradeType == "sell") {
                                    if (typeof(tha.flipamount == "undefined")) {
                                        tha.flipamount = 0;
                                    }
                                    if (typeof(tha.flipprofit == "undefined")) {
                                        tha.flipprofit = 0;
                                    }
                                    if (tha.flipamount == tha.amount) {
                                        totalFlipProfit += tha.flipprofit;
                                        continue;
                                    } else if (objArr.length > 0) {
                                        objArr.sort(function(a, b) {
                                            return a.price == b.price ? 0 : +(a.price > b.price) || -1;
                                        });
                                        for (let b = 0; b < objArr.length; b++) {
                                            if (objArr[b].flipaccountedfor == objArr[b].amount) {
                                                continue;
                                            } else {
                                                let price = objArr[b].price;
                                                if (price !== tha.price) {
                                                    let amountUnaccounted = objArr[b].amount - objArr[b].flipaccountedfor;
                                                    let diff = tha.amount - tha.flipamount;
                                                    if (amountUnaccounted < diff) {
                                                        tha.flipamount += amountUnaccounted;
                                                        tha.flipprofit += ((tha.price - price) * amountUnaccounted);
                                                        objArr[b].flipaccountedfor = objArr[b].amount;
                                                    } else if (amountUnaccounted >= diff) {
                                                        tha.flipamount += diff;
                                                        tha.flipprofit += ((tha.price - price) * diff);
                                                        objArr[b].flipaccountedfor += diff;
                                                    }
                                                }
                                            }
                                        }
                                        totalFlipProfit += tha.flipprofit;
                                    }
                                }
                            }
                        }
                    }
                }
                arrProfitDone.push(th.name);
            }
            if (searchVal === "") {
                document.getElementById("thTotalFlipProfit").innerHTML = "Total Flip Profit: " + numberWithCommas(totalFlipProfit);
            } else {
                document.getElementById("thTotalFlipProfit").innerHTML = "\"" + searchVal + "\" Flip Profit: " + numberWithCommas(totalFlipProfit);
            }
            updateVariables();
        }
        window.thSearchLogic = function() {
            searchVal = document.getElementById("thSearch").value;
            let tempSearchVal = document.getElementById("thSearch").value;
            setTimeout(function() {
                if (tempSearchVal == document.getElementById("thSearch").value) {
                    if (document.getElementById("thSearch").value[0] === "=") {
                        exactMatch = true;
                        searchString = document.getElementById("thSearch").value.substring(1, document.getElementById("thSearch").value.length).toLowerCase().replace(/\s/g, "");
                        exactSearch = new RegExp("^" + searchString + "$");
                    } else {
                        exactMatch = false;
                        searchString = document.getElementById("thSearch").value.toLowerCase();
                    }
                    generateTradeHistoryTable();
                    calculateFlips();
                }
            }, 250);
        };
        window.thDelete = function(arrnum, source) {
            if (source.getAttribute("thdeletewarned") == "false") {
                setTimeout(function() {
                    source.setAttribute("thdeletewarned", "true");
                }, 300);
                source.style.boxShadow = "0 0 30px 3px rgba(255, 0, 0, 1) inset";
                source.style.transition = "box-shadow 0.5s ease-in-out";
                setTimeout(function() {
                    if (source) {
                        source.setAttribute("thdeletewarned", "false");
                        source.style.boxShadow = "0 0 30px 3px rgba(255, 0, 0, 0) inset";
                        source.style.transition = "box-shadow 0.5s ease-in-out";
                    }
                }, 1500);
            } else if (source.getAttribute("thdeletewarned") == "true") {
                for (let i = 0; i < tedStoredSettings.tradeHistory.length; i++) {
                    if (JSON.stringify(sortedTradeHistory[arrnum]) == JSON.stringify(tedStoredSettings.tradeHistory[i])) {
                        tedStoredSettings.tradeHistory.splice(i, 1);
                        calculateFlips();
                        sortTradeHistory(sortByTH);
                        updateVariables();
                        break;
                    }
                }
            }
        };
        window.highlightSorted = function() {
            for (let i = 0; i < document.getElementsByClassName("thTH").length; i++) {
                if (document.getElementsByClassName("thTH")[i].getAttribute("prop") == sortByTH) {
                    if ((thSortToggle && sortByTH !== "name") || (!thSortToggle && sortByTH == "name")) {
                        document.getElementsByClassName("thTH")[i].style.boxShadow = "0px -2px 10px -2px, 0px 2px 3px 1px inset";
                        document.getElementsByClassName("thTH")[i].style.borderTopStyle = "hidden";
                    } else {
                        document.getElementsByClassName("thTH")[i].style.boxShadow = "0px 5px 10px -2px, 0px -2px 3px 1px inset";
                        document.getElementsByClassName("thTH")[i].style.borderBottomStyle = "hidden";
                    }
                    document.getElementsByClassName("thTH")[i].style.transition = "box-shadow 0.25s ease";
                    break;
                }
            }
        };
        window.sortTradeHistory = function(sortBy, invertible) {
            if (typeof(invertible) !== "boolean") {
                invertible = false;
            }
            sortedTradeHistory = JSON.parse(JSON.stringify(tedStoredSettings.tradeHistory));
            if (invertible && sortBy == sortByTH) {
                thSortToggle = !thSortToggle;
            } else if (invertible && sortBy == "name") {
                thSortToggle = false;
            } else if (invertible) {
                thSortToggle = true;
            }
            sortedTradeHistory.sort(function(a, b) {
                if (thSortToggle) {
                    if (a[sortBy] > b[sortBy]) return -1;
                }
                if (!thSortToggle) {
                    if (a[sortBy] < b[sortBy]) return -1;
                }
                if (a[sortBy] == b[sortBy]) {
                    if (a.date > b.date) return -1;
                    if (a.date < b.date) return 1;
                    return 0;
                }
                if (typeof(a[sortBy]) == "undefined" || a[sortBy] === null || a[sortBy] === 0) return 1;
                if (typeof(b[sortBy]) == "undefined" || b[sortBy] === null || b[sortBy] === 0) return -1;
                return 1;
            });
            generateTradeHistoryTable();
            sortByTH = sortBy;
        };
        window.generateTradeHistoryTable = function() {
            thString = "";
            thString += "<table class='market-table' cellpadding='5px' style='width:100%;cursor:default'>";
            thString += "<tr style='background-color:lightgrey'>";
            thString += "<th style='width:30px'></th>";
            thString += "<th style='cursor:pointer' class='thTH' prop='name' onclick='sortTradeHistory(&quot;name&quot;, true);sortByTH=&quot;name&quot;'>Name</th>";
            thString += "<th style='width:30px'>Type</th>";
            thString += "<th style='cursor:pointer;width:105px' class='thTH' prop='price' onclick='sortTradeHistory(&quot;price&quot;, true);sortByTH=&quot;price&quot;'>Price</th>";
            thString += "<th style='cursor:pointer;width:105px' class='thTH' prop='amount' onclick='sortTradeHistory(&quot;amount&quot;, true);sortByTH=&quot;amount&quot;'>Amount</th>";
            thString += "<th style='cursor:pointer;width:105px' class='thTH' prop='total' onclick='sortTradeHistory(&quot;total&quot;, true);sortByTH=&quot;total&quot;'>Total</th>";
            thString += "<th style='cursor:pointer;width:105px' class='thTH' prop='flipamount' onclick='sortTradeHistory(&quot;flipamount&quot;, true);sortByTH=&quot;flipamount&quot;'>Flip Amount</th>";
            thString += "<th style='cursor:pointer;width:105px' class='thTH' prop='flipprofit' onclick='sortTradeHistory(&quot;flipprofit&quot;, true);sortByTH=&quot;flipprofit&quot;'>Flip Profit</th>";
            thString += "<th style='cursor:pointer;width:175px' class='thTH' prop='date' onclick='sortTradeHistory(&quot;date&quot;, true);sortByTH=&quot;date&quot;'>Timestamp</th>";
            thString += "<th style='width:60px'>Delete</th>";
            thString += "</tr>";
            var max3 = 0;
            let sellColFade = colorLuminance("#96c896", -0.2);
            let buyColFade = colorLuminance("#c89696", -0.2);
            for (let i = 0; i < sortedTradeHistory.length; i++) {
                if (!sortedTradeHistory[i]) break;
                let tradeType = sortedTradeHistory[i].tradetype;
                if ((tradeType == "buy" && document.getElementById("thBuyCheckbox").checked) || (tradeType == "sell" && document.getElementById("thSellCheckbox").checked)) {
                    if ((exactMatch && (sortedTradeHistory[i].name.toLowerCase().match(exactSearch) || getItemName(sortedTradeHistory[i].name).toLowerCase().match(exactSearch))) || !exactMatch && (getItemName(sortedTradeHistory[i].name).toLowerCase().includes(document.getElementById("thSearch").value.toLowerCase()) || sortedTradeHistory[i].name.toLowerCase().includes(document.getElementById("thSearch").value.toLowerCase()) || document.getElementById("thSearch").value === "" || document.getElementById("thSearch").value == " ")) {
                        if (document.getElementById("thMax3Checkbox").checked) {
                            if (max3 >= 3) {
                                break;
                            }
                            max3++;
                        }
                        let rowColor = "#96c896"; // sell
                        let rowColor2 = sellColFade; // sell
                        if (sortedTradeHistory[i].tradetype == "buy") {
                            rowColor = "#c89696"; // buy
                            rowColor2 = buyColFade; // buy
                        }
                        thString += "<tr onmouseover='highlightRow(this, true);' onmouseout='highlightRow(this, false);' style='background:linear-gradient(" + rowColor + "," + rowColor2 + ")'>";
                        thString += "<td style='text-align:center'><img class='image-icon-30' src='images/" + sortedTradeHistory[i].name + ".png'></td>";
                        thString += "<td style='text-align:center'>" + getItemName(sortedTradeHistory[i].name) + "</td>";
                        thString += "<td style='text-align:center'>" + sortedTradeHistory[i].tradetype + "</td>";
                        thString += "<td style='text-align:right'>" + numberWithCommas(sortedTradeHistory[i].price) + "</td>";
                        thString += "<td style='text-align:right'>" + numberWithCommas(sortedTradeHistory[i].amount) + "</td>";
                        thString += "<td style='text-align:right'>" + numberWithCommas(sortedTradeHistory[i].price * sortedTradeHistory[i].amount) + "</td>";
                        if (sortedTradeHistory[i].flipamount) {
                            thString += "<td style='text-align:right'>" + numberWithCommas(sortedTradeHistory[i].flipamount) + "</td>";
                        } else thString += "<td></td>";
                        if (sortedTradeHistory[i].flipprofit) {
                            thString += "<td style='text-align:right'>" + numberWithCommas(sortedTradeHistory[i].flipprofit) + "</td>";
                        } else thString += "<td></td>";
                        let d = new Date(sortedTradeHistory[i].date);
                        let date = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                        thString += "<td style='text-align:center'>" + date.toISOString().substring(11, 19) + " | " + date.toISOString().substring(0, 10) + "</td>";
                        thString += "<td title='First click: enable delete\nSecond click: permanently delete' arrnum='" + i + "' thdeletewarned='false' style='text-align:center' onclick='thDelete(this.getAttribute(&quot;arrnum&quot;),this)'><img class='image-icon-30' src='http://i.imgur.com/S4WuNVn.png'></td>";
                        thString += "</tr>";
                    }
                }
            }
            thString += "</table>";
            if (document.getElementById("tradeHistoryModalBody").style.display != "none") {
                tradeHistoryModalBodyTable.innerHTML = thString;
            }
            setTimeout(function() {
                highlightSorted();
            }, 0);
        };

        function getArrMarketItemObjectFromMarketId(marketId) {
            marketId = parseInt(marketId);
            for (var i = 0; i < Object.keys(arrMarketItems).length; i++) {
                let itemName = Object.keys(arrMarketItems)[i];
                for (var a = 0; a < arrMarketItems[itemName].length; a++) {
                    if (arrMarketItems[itemName][a].marketid == marketId) {
                        return arrMarketItems[itemName][a];
                    }
                }
            }
            return undefined;
        }

        function tmg_pokerCalculateMove(game, table, msgFrom, action, amount) {
            function nextPlayer(playersSeatArray, seatCurrentTurn) {
                let startSeatIndex = playersSeatArray.indexOf(seatCurrentTurn);
                if (startSeatIndex < 0) return -1;
                startSeatIndex++;
                for (let i = startSeatIndex; i < playersSeatArray.length; i++) {
                    if (playersSeatArray[i] > startSeatIndex) {
                        return playersSeatArray[i];
                    }
                }
                for (let i = 0; i < playersSeatArray.length; i++) {
                    if (playersSeatArray[i] > 0) {
                        return playersSeatArray[i];
                    }
                }
            }
            var livePlayers = [];
            let seat = minigamesObject[game].tables[table].seats[msgFrom].seat;
            for (let player in minigamesObject[game].tables[table].seats) {
                if (minigamesObject[game].tables[table].seats[player].status == "live") {
                    livePlayers.push(seat);
                }
            }
            let nextTurn = nextPlayer(livePlayers, seat);
            if (nextTurn == seat) {
                // if only one person left in the hand
            }
            let bb = minigamesObject[game].tables[table].gameInfo.bb;
            let lastBet = minigamesObject[game].tables[table].currentHand.lastBet;
            let lastLastBet = minigamesObject[game].tables[table].currentHand.lastLastBet;
            let stack = minigamesObject[game].tables[table].seats[msgFrom].chips;
            let handNumber = minigamesObject[game].tables[table].handNumber;
            if (action == "FOLD") {
                minigamesObject[game].tables[table].seats[msgFrom].status = "folded";
                minigamesObject[game].tables[table].currentHand.currentTurn = nextTurn;
                let currentHandJSON = JSON.stringify(minigamesObject[game].tables[table].currentHand);
                for (let player in minigamesObject[game].tables[table].seats) {
                    sendp2p(player, "CURRENT_HAND", table, handNumber, currentHandJSON);
                    tmg_pokerInterpretMove(table, msgFrom, action, amount);
                }
            } else if (action == "BET" && lastBet == bb) {
                if (stack >= amount && (amount >= bb || (stack < bb && amount == stack))) {
                    //valid bet
                    minigamesObject[game].tables[table].currentHand.lastLastBet = minigamesObject[game].tables[table].currentHand.lastBet;
                    minigamesObject[game].tables[table].currentHand.lastBet = amount;
                    minigamesObject[game].tables[table].seats[msgFrom].chips -= amount;
                    minigamesObject[game].tables[table].seats[msgFrom].chipsInPotThisStreet = amount;
                    minigamesObject[game].tables[table].curentHand.totalPot += amount;
                    sendp2p(msgFrom, "VALID_MOVE", action, amount);
                    minigamesObject[game].tables[table].currentHand.currentTurn = nextTurn;
                    let currentHandJSON = JSON.stringify(minigamesObject[game].tables[table].currentHand);
                    for (let player in minigamesObject[game].tables[table].seats) {
                        sendp2p(player, "CURRENT_HAND", table, handNumber, currentHandJSON);
                        tmg_pokerInterpretMove(table, msgFrom, action, amount);
                    }
                    return true;
                } else {
                    sendp2p(msgFrom, "INVALID_MOVE", action, amount);
                }
            } else if (action == "RAISE") {
                if (stack >= amount && ((amount >= ((lastBet * 2) - lastLastBet)) || amount == stack)) {
                    //valid raise
                    minigamesObject[game].tables[table].currentHand.lastLastBet = minigamesObject[game].tables[table].currentHand.lastBet;
                    minigamesObject[game].tables[table].currentHand.lastBet = amount;
                    minigamesObject[game].tables[table].seats[msgFrom].chips -= amount;
                    minigamesObject[game].tables[table].seats[msgFrom].chipsInPotThisStreet += amount;
                    let totalPot = minigamesObject[game].tables[table].currentHand.potPreviousStreets;
                    for (let player in minigamesObject[game].tables[table].seats) {
                        totalPot += minigamesObject[game].tables[table].seats[player].chipsInPotThisStreet;
                    }
                    minigamesObject[game].tables[table].curentHand.totalPot = totalPot;
                    sendp2p(msgFrom, "VALID_MOVE", action, amount);
                    minigamesObject[game].tables[table].currentHand.currentTurn = nextTurn;
                    let currentHandJSON = JSON.stringify(minigamesObject[game].tables[table].currentHand);
                    for (let player in minigamesObject[game].tables[table].seats) {
                        sendp2p(player, "CURRENT_HAND", table, handNumber, currentHandJSON);
                        tmg_pokerInterpretMove(table, msgFrom, action, amount);
                    }
                    return true;
                } else {
                    sendp2p(msgFrom, "INVALID_MOVE", action, amount);
                }
            } else if (action == "CALL") {
                let chipsAlreadyIn = minigamesObject[game].tables[table].seats[msgFrom].chipsInPotThisStreet;
                var callAmount = amount;
                if (stack + chipsAlreadyIn <= amount) {
                    minigamesObject[game].tables[table].seats[msgFrom].status = "all in";
                    callAmount = stack + chipsAlreadyIn;
                }
                //below is unfinished copypaste from raise, need to figure out call amount and side pots :/

                minigamesObject[game].tables[table].seats[msgFrom].chips -= amount;
                minigamesObject[game].tables[table].seats[msgFrom].chipsInPotThisStreet += amount;
                let totalPot = minigamesObject[game].tables[table].currentHand.potPreviousStreets;
                for (let player in minigamesObject[game].tables[table].seats) {
                    totalPot += minigamesObject[game].tables[table].seats[player].chipsInPotThisStreet;
                }
                minigamesObject[game].tables[table].curentHand.totalPot = totalPot;
                sendp2p(msgFrom, "VALID_MOVE", action, amount);
                minigamesObject[game].tables[table].currentHand.currentTurn = nextTurn;
                let currentHandJSON = JSON.stringify(minigamesObject[game].tables[table].currentHand);
                for (let player in minigamesObject[game].tables[table].seats) {
                    sendp2p(player, "CURRENT_HAND", table, handNumber, currentHandJSON);
                    tmg_pokerInterpretMove(table, msgFrom, action, amount);
                }
                return true;
            }
            return false;
        }

        function tmg_pokerAlreadySeated(game, msgFrom) {
            for (let table in minigamesObject[game].tables) {
                if (minigamesObject[game].tables[table].seats[msgFrom]) {
                    return true;
                }
            }
            return false;
        }
        function tmg_pokerSendToAllAtTable(table, msg, excludeUser) {
            let arrSendList = [];
            for (let player in minigamesObject.Poker.tables[table].seats) {
                arrSendList.push(player);
            }
            for (let observer in minigamesObject.Poker.tables[table].observers) {
                arrSendList.push(observer);
            }
            if (excludeUser && arrSendList.indexOf(excludeUser) >= 0) {
                arrSendList.splice(indexOf(excludeUser), 1);
            }
            arrSendList.forEach(user => {
                sendp2p(user, msg);
            });
        }
        function tmg_pokerSitUp(game, msgFrom, table, seat) {
            if (minigamesObject[game].tables[table]) {
                if (minigamesObject[game].tables[table].seats[msgFrom]) {
                    if (window.username == pokerServerUsername) {
                        tmg_pokerSendToAllAtTable(table, ["LEAVE_TABLE", table, seat].join("#"), msgFrom);
                        sendp2p(msgFrom, "SIT_UP", table, seat);
                    } else if (minigamePokerMyTable == table) {
                        //show sat up
                        document.getElementById("poker_seat_" + seat).style.display = "none";
                        document.getElementById("poker_betBox_" + seat).style.display = "none";
                    }
                    delete minigamesObject[game].tables[table].seats[msgFrom];
                    if (msgFrom == window.username) {
                        minigameMyStatus = "free";
                        loadMinigame("Minigames");
                    }
                    return true;
                }
            }
            return false;
        }
        function tmg_pokerLeaveTable(game, msgFrom, table, seat) {
            if (minigamesObject[game].tables[table]) {
                if (minigamesObject[game].tables[table].seats[msgFrom]) {
                    if (window.username == pokerServerUsername) {
                        sendp2p(msgFrom, "LEAVE_TABLE", msgFrom, table);
                        for (let player in minigamesObject[game].tables[table].seats) {
                            sendp2p(player, "LEAVE_TABLE", table, seat);
                        }
                    }
                    if (minigamePokerMyTable == table) {
                        document.getElementById("poker_seat_"+seat).style.display = "none";
                        document.getElementById("poker_betBox_"+seat).style.display = "none";
                    }
                    delete minigamesObject[game].tables[table].seats[msgFrom];
                    if (msgFrom == window.username) {
                        minigameMyStatus = "free";
                        loadMinigame("Minigames");
                    }
                    return true;
                }
            }
            return false;
        }

        window.tmg_pokerSetUpTable = function() {
            let table = minigamesObject.Poker.tables[minigamePokerMyTable];
            for (let player in table.seats) {
                let name = table.seats[player].name;
                let seat = table.seats[player].seat;
                let chips = table.seats[player].chips;
                let chipsInPotThisStreet = table.seats[player].chipsInPotThisStreet;
                let status = table.seats[player].status;

                let pokerSeat = document.getElementById("poker_seat_"+seat);
                pokerSeat.style.display = "";

                if (status.includes("live")) {
                    document.getElementById("poker_"+seat+"_card1").style.display = "";
                    document.getElementById("poker_"+seat+"_card2").style.display = "";
                }

                let playerInfo = document.getElementById("poker_"+seat+"_playerinfo");
                playerInfo.style.display = "flex";
                while (playerInfo.firstChild) {
                    playerInfo.removeChild(playerInfo.firstChild);
                }
                playerInfo.append(name);
                playerInfo.append(document.createElement("br"));
                let stackDiv = playerInfo.appendChild(document.createElement("div"));
                stackDiv.append(coinImg.cloneNode());
                stackDiv.append(chips);

                if (minigamesObject.Poker.tables[minigamePokerMyTable].currentHand.dealerButton == name) {
                    document.getElementById("poker_button_"+seat).style.display = "";
                }
                if (chipsInPotThisStreet >= 1) {
                    let betBox = document.getElementById("poker_betBox_"+seat);
                    betBox.style.display = "";
                    betBox.append(coinImg.cloneNode());
                    betBox.append(chipsInPotThisStreet);
                }
            }
        };

        function tmg_pokerConnectionLost() {
            console.log("start of tmg_pokerConnectionLost");
            if (minigameTryingToConnectToPokerServer) {
                minigameConnectedToPokerServer = false;
                document.getElementById("tmg_pokerServerConnect").value = "Retrying...";
                document.getElementById("tmg_pokerServerConnect").style.border = "#bf9000 ridge";
                document.getElementById("tmg_pokerServerConnect").style.background = "radial-gradient(white, #fff2cc, #ffe599)";
                minigamePokerServerStatus = "offline";
                tmg_pokerServerTimeoutVar = setTimeout(function() {
                    if (tmg_pokerServerPingSent) {
                        tmg_pokerServerPingSent = false;
                        console.log("tmg_pokerConnectionLost");
                    }
                }, 5000);
            }
        }

        function addWebsocketHook() { // thanks florb
            const msgGameArr = ["Poker"],
                  msgMainArr = ["SEND_LOBBY"];
            var origOnMessage = window.webSocket.onmessage;
            window.webSocket.onmessage = function(e) {
                origOnMessage.apply(this, arguments);
                let msg = e.data;
                if (msg.includes("TMG#")) {
                    let msgFrom = msg.substring(0, msg.indexOf("="));
                    msg = msg.replace(msgFrom, "").replace("=", "");
                    // p2p("ted120",msg) = "ted120=TMG#Game Name#msgMain#msgSub1#msgSub2#msgSub3"
                    console.log(msgFrom + "=" + msg);
                    try {
                        let arrMsg = msg.replace("TMG#", "").split("#");
                        let msgGame = arrMsg[0];
                        let msgMain = arrMsg[1];
                        let msgSub1 = arrMsg[2];
                        let msgSub2 = arrMsg[3];
                        let msgSub3 = arrMsg[4];
                        let msgSub4 = arrMsg[5];
                        if (msgMain == "PING") {
                            sendp2p(msgFrom, "PINGRETURN");
                            return;
                        } else if (msgMain == "PINGRETURN") {
                            pingTime = new Date().getTime() - pingTimeStart;
                            pingSent = false;
                            return;
                        }
                        if (msgGame == "Poker") {
                            if (window.username == pokerServerUsername) {
                                // if we are poker server
                                window.tmg_pokerSendLobby = function() {
                                    var sendDataArray = [], lobbyDataArray = [], thisTableString = "";
                                    for (let table in minigamesObject[msgGame].tables) {
                                        let sb = minigamesObject[msgGame].tables[table].gameInfo.sb;
                                        let bb = minigamesObject[msgGame].tables[table].gameInfo.bb;
                                        let gameType = minigamesObject[msgGame].tables[table].gameInfo.gameType;
                                        let minBuyin = minigamesObject[msgGame].tables[table].gameInfo.minBuyin;
                                        let maxBuyin = minigamesObject[msgGame].tables[table].gameInfo.maxBuyin;
                                        let minPlayers = minigamesObject[msgGame].tables[table].gameInfo.minPlayers;
                                        let maxPlayers = minigamesObject[msgGame].tables[table].gameInfo.maxPlayers;
                                        thisTableString = [table, sb, bb, gameType, minBuyin, maxBuyin, minPlayers, maxPlayers].join() + ",";
                                        let arrPlayers = [];
                                        for (let player in minigamesObject[msgGame].tables[table].seats) {
                                            let seatNumber = minigamesObject[msgGame].tables[table].seats[player].seat;
                                            let chips = minigamesObject[msgGame].tables[table].seats[player].chips;
                                            let chipsInPotThisStreet = minigamesObject[msgGame].tables[table].seats[player].chipsInPotThisStreet;
                                            let status = minigamesObject[msgGame].tables[table].seats[player].status;
                                            arrPlayers.push([player, seatNumber, chips, chipsInPotThisStreet, status].join("."));
                                        }
                                        thisTableString += arrPlayers.join(",");
                                        lobbyDataArray.push(thisTableString);
                                    }
                                    let headerString = [window.username + "=TMG", "Poker", "SEND_LOBBY#"].join("#");
                                    while (lobbyDataArray.length > 0) {
                                        let count = 0;
                                        let thisString = headerString + lobbyDataArray[count++];
                                        let nextString = thisString + "@" + lobbyDataArray[count];
                                        while (nextString) {
                                            if (!lobbyDataArray[count] || nextString.length > 255) {
                                                nextString = false;
                                            } else if (nextString.length <= 255) {
                                                thisString = nextString;
                                                nextString += lobbyDataArray[++count];
                                            }
                                        }
                                        if (thisString.length > 255) {
                                            lobbyDataArray.splice(0, 1);
                                            console.log("too long: " + thisString);
                                        } else {
                                            thisString = thisString.replace([window.username + "=TMG", "Poker"].join("#")+"#","");
                                            sendDataArray.push(thisString);
                                            lobbyDataArray.splice(0, count);
                                        }
                                    }
                                    sendDataArray.forEach(data => {
                                        sendp2p(msgFrom, data);
                                    });
                                };
                                if (msgMain == "CONNECT") {
                                    pokerServerPlayersConnected[msgFrom] = {
                                        status: "connected",
                                        lastActivity: new Date().getTime(),
                                    };
                                    sendp2p(msgFrom, "CONNECTED");
                                    tmg_pokerSendLobby();
                                } else if (msgMain == "DISCONNECT") {
                                    if (pokerServerPlayersConnected[msgFrom]) {
                                        delete pokerServerPlayersConnected[msgFrom];
                                    }
                                    sendp2p(msgFrom, "DISCONNECTED");
                                } else if (msgMain == "SEATED") {
                                    let gameId = msgSub1;
                                    let action = msgSub2;
                                    let amount = msgSub3;
                                    if (minigamesObject[msgGame].tables[gameId] && minigamesObject[msgGame].tables[gameId].players.indexOf(msgFrom) >= 0) {
                                        if (minigamesObject[msgGame].tables[gameId].currentTurn == msgFrom) {
                                            if (action == "BET" || action == "RAISE" || action == "FOLD") {
                                                tmg_pokerCalculateMove(msgGame, gameId, msgFrom, action, amount);
                                            } else if (action == "LEAVE_TABLE") {
                                                tmg_pokerLeaveTable(msgGame, msgFrom, gameId);
                                            } else sendp2p(msgFrom, "ERROR", "ACTION_UNKNOWN");
                                        } else sendp2p(msgFrom, "ERROR", "NOT_YOUR_TURN");
                                    } else sendp2p(msgFrom, "ERROR", "NOT_SEATED");
                                } else if (msgMain == "LOBBY") {
                                    if (msgSub1 == "LOAD_LOBBY") {
                                        tmg_pokerSendLobby();
                                    } else if (msgSub1 == "CREATEROOM") {
                                        let nextId = parseInt(Object.keys(minigamesObject[msgGame].tables)[Object.keys(minigamesObject[msgGame].tables).length-1]) + 1; // last id in array +1
                                        minigamesObject[msgGame].tables[nextId] = {
                                            players: [],
                                            seats: {},
                                            currentTurn: null,
                                            maxPlayers: 7,
                                        };
                                    } else if (msgSub1 == "JOINTABLE") {
                                        let desiredTable = msgSub2;
                                        let desiredSeat = msgSub3;
                                        let buyinAmount = msgSub4;
                                        if (!tmg_pokerAlreadySeated(msgGame, msgFrom)) {
                                            if (minigamesObject[msgGame].tables[desiredTable]) {
                                                for (let player in minigamesObject[msgGame].tables[desiredTable].seats) {
                                                    if (minigamesObject[msgGame].tables[desiredTable].seats[player].seat == desiredSeat) {
                                                        sendp2p(msgFrom, "ERROR", "SEAT_TAKEN");
                                                        tmg_pokerSendLobby();
                                                        return;
                                                    }
                                                }
                                                if (!minigamesObject[msgGame].tables[desiredTable].seats[desiredSeat]) {
                                                    minigamesObject[msgGame].tables[desiredTable].seats[msgFrom] = {
                                                        name: msgFrom,
                                                        seat: desiredSeat,
                                                        chips: buyinAmount,
                                                        chipsInPotThisStreet: 0,
                                                        status: "folded",
                                                    };
                                                    tmg_pokerSendLobby();
                                                    sendp2p(msgFrom, "JOIN_GAME", desiredTable, desiredSeat, buyinAmount);
                                                    let currentHandJSON = JSON.stringify(minigamesObject[msgGame].tables[desiredTable].currentHand);
                                                    let handNumber = minigamesObject.Poker.tables[desiredTable].handNumber;
                                                    sendp2p(msgFrom, "CURRENT_HAND", desiredTable, handNumber, currentHandJSON);
                                                    // check if sat at another table, if so prompt remove
                                                    // check if seat available
                                                    // add player to seat
                                                } else sendp2p(msgFrom, "ERROR", "SEAT_TAKEN");
                                            } else sendp2p(msgFrom, "ERROR", "TABLE_NOT_EXIST");
                                        }
                                    } else if (msgSub1 == "LEAVE_TABLE") {
                                        tmg_pokerLeaveTable(msgGame, msgFrom, msgSub1, msgSub2);
                                    }
                                }
                            } else if (msgFrom == pokerServerUsername && window.username !== pokerServerUsername) {
                                minigameLastMessageFromPokerServer = new Date().getTime();
                                minigamePokerServerStatus = "online";
                                // if we receive a message from poker server
                                if (msgMain == "CONNECTED") {
                                    document.getElementById("tmg_pokerServerConnect").value = "Connected";
                                    document.getElementById("tmg_pokerServerConnect").style.border = "#38761d ridge";
                                    document.getElementById("tmg_pokerServerConnect").style.background = "radial-gradient(white, #d9ead3, #b6d7a8)";
                                    tmg_pokerServerPingSent = false;
                                    minigameConnectedToPokerServer = true;
                                } else if (msgMain == "DISCONNECTED") {
                                    document.getElementById("tmg_pokerServerConnect").value = "Disconnected";
                                    document.getElementById("tmg_pokerServerConnect").style.border = "#990000 ridge";
                                    document.getElementById("tmg_pokerServerConnect").style.background = "radial-gradient(white, #f4cccc, #ea9999)";
                                    minigameConnectedToPokerServer = false;
                                } else if (msgMain == "SEND_LOBBY") {
                                    let tableInfo = msgSub1.split("@");
                                    for (let table in tableInfo) {
                                        let arrTable = tableInfo[table].split(",");
                                        let tableNumber = arrTable[0];
                                        let sb = arrTable[1];
                                        let bb = arrTable[2];
                                        let gameType = arrTable[3];
                                        let minBuyin = arrTable[4];
                                        let maxBuyin = arrTable[5];
                                        let minPlayers = arrTable[6];
                                        let maxPlayers = arrTable[7];
                                        minigamesObject[minigameCurrentSelectedGame].tables[tableNumber] = {
                                            gameInfo: {
                                                sb: sb,
                                                bb: bb,
                                                gameType: gameType,
                                                minBuyin: minBuyin,
                                                maxBuyin: maxBuyin,
                                                minPlayers: minPlayers,
                                                maxPlayers: maxPlayers,
                                            },
                                            seats: {
                                            },
                                        };
                                        for (let i = 8; i < arrTable.length; i++) {
                                            let playerInfo = arrTable[i].split(".");
                                            let playerName = playerInfo[0];
                                            let playerSeat = playerInfo[1];
                                            let playerChips = playerInfo[2];
                                            let chipsInPotThisStreet = playerInfo[3];
                                            let status = playerInfo[4];
                                            minigamesObject[minigameCurrentSelectedGame].tables[tableNumber].seats[playerName] = {
                                                name: playerName,
                                                seat: playerSeat,
                                                chips: playerChips,
                                                chipsInPotThisStreet: chipsInPotThisStreet,
                                                status: status,
                                            };
                                        }
                                    }
                                    loadPokerLobby();
                                } else if (msgMain == "SEATS") {
                                    let tableNumber = msgSub1;
                                    let curArray = msgSub2.split("@@");
                                    for (let seatNumber in curArray) {
                                        curArray[seatNumber] = curArray[seatNumber].replaceAll("@","");
                                        let arrSeat = curArray[seatNumber].split(",");
                                        minigamesObject[minigameGame].tables[tableNumber].seats.name = arrSeat[0];
                                        minigamesObject[minigameGame].tables[tableNumber].seats.seat = arrSeat[1];
                                        minigamesObject[minigameGame].tables[tableNumber].seats.chips = arrSeat[2];
                                        minigamesObject[minigameGame].tables[tableNumber].seats.chipsInPotThisStreet = arrSeat[3];
                                        minigamesObject[minigameGame].tables[tableNumber].seats.status = arrSeat[4];
                                    }
                                } else if (msgMain == "CURRENT_HAND") {
                                    //"TMG#ted120#Ten Plus Poker#CURRENT_HAND#table#hand#currentTurn,dealer,sb,bb,flop,turn,river,potpreviousstreets,totalpot"
                                    let tableNumber = msgSub1;
                                    let handNumber = msgSub2;
                                    let currentHandJSON = msgSub3;
                                    minigamesObject[minigameGame].tables[tableNumber].currentHand = JSON.parse(currentHandJSON);
                                } else if (msgMain == "JOIN_GAME") {
                                    //p2p(msgFrom, "TMG#"+window.username+"#Ten Plus Poker#JOIN_GAME#"+desiredTable+"#"+desiredSeat+"#"+buyinAmount);
                                    minigamePokerMyTable = msgSub1;
                                    minigamePokerMySeat = msgSub2;
                                    minigamePokerMyBuyin = msgSub3;
                                    loadMinigame(msgGame);
                                } else if (msgMain == "LEAVE_TABLE") {
                                    //p2p(msgFrom, "TMG#"+window.username+"#"+game+"#LEAVE_TABLE#"+msgFrom+"#"+table);
                                    tmg_pokerLeaveTable(msgGame, msgSub2, msgSub3);
                                } else if (msgMain == "LOG") {
                                    let tableNumber = msgSub1;
                                    let handNumber = msgSub2;
                                    //let curArray = msgSub3.split(",");
                                    minigamesObject[minigameGame].tables[tableNumber].log = [msgSub3];
                                }
                            }
                        } else if (minigameMyStatus == "ingame" && msgFrom == minigameOpp) {
                            if (msgGame == "Grid Control") {
                                if (msgMain == "MOVE") {
                                    gc_interpretMove(msgSub1, msgSub2, msgSub3, true);
                                    minigameMyTurn = true;
                                } else if (msgMain == "SURRENDER") {
                                    gc_checkVictory(msgSub1);
                                }
                            } //end Grid Control
                            if (msgMain == "QUIT") {
                                minigameMyStatus = "free";
                                minigameOpp = "";
                                document.getElementById("versusContainer").style.display = "none";
                                document.getElementById("challengeContainer").style.display = "flex";
                                loadMinigame("Minigames");
                                minigameQuitReason = msgSub1;
                            }
                        } else if (minigameMyStatus == "starting") {
                            if (msgMain == "LOADED") {
                                //we challenged, they accepted, we said ready, they said ready
                                minigameMyStatus = "ingame";
                                minigameManager.challenges[msgFrom].status = "ingame";
                                minigameOpp = msgFrom;
                                minigameOppPlayer = "player2";
                                minigameMyPlayer = "player1";
                                minigameGame = msgGame;
                                minigameVersion = msgSub2;
                                minigameSeed = msgSub3;
                                loadChallenges();
                                loadMinigame(msgGame);
                                minigameMyTurn = true;
                                loadVersus();
                                sendp2p(msgFrom, "LOADED", "MYMOVE", msgSub2, msgSub3);
                            }
                        } else if (minigameMyStatus == "confirming start") {
                            if (msgMain == "LOADGAME" && msgGame == minigameManager.challenges[msgFrom].game && minigameManager.challenges[msgFrom].status == "Accepted") {
                                //they challenged, we accepted, they said ready
                                minigameMyStatus = "ingame";
                                minigameManager.challenges[msgFrom].status = "ingame";
                                minigameOpp = msgFrom;
                                minigameOppPlayer = "player1";
                                minigameMyPlayer = msgSub1;
                                minigameGame = msgGame;
                                minigameVersion = msgSub2;
                                minigameSeed = msgSub3;
                                loadChallenges();
                                loadMinigame(msgGame);
                                minigameMyTurn = false;
                                loadVersus();
                                sendp2p(msgFrom, "LOADED", "NOTMYMOVE", msgSub2, msgSub3);
                            }
                        } else if (minigameMyStatus == "free") {
                            if (msgSub1 == "ACCSTART" && minigameManager.challenges[msgFrom] && minigameManager.challenges[msgFrom].status == "Challenge received" && msgGame == minigameManager.challenges[msgFrom].game) {
                                //we challenged, they accepted
                                minigameMyStatus = "starting";
                                minigameOpp = msgFrom;
                                minigameManager.challenges[msgFrom].status = "Starting";
                                setTimeout(function() {
                                    if (minigameMyStatus == "starting") {
                                        minigameMyStatus = "free";
                                        minigameOpp = "";
                                        minigameManager.challenges[msgFrom].status = "Timed out";
                                    }
                                }, 3000);
                                sendp2p(msgFrom,"LOADGAME", "player2", msgSub2, msgSub3); //from, loadgame, player, version, seed
                            }
                        }
                        if (msgMain == "CHALLENGE") {
                            if (msgSub1 == "REQSTART") {
                                //they challenged
                                sendp2p(msgFrom, "CHALLENGE", "RECEIVED", msgSub2, msgSub3);
                                minigameManager.challenges[msgFrom] = {
                                    from: msgFrom,
                                    game: msgGame,
                                    version: msgSub2,
                                    seed: msgSub3,
                                    status: "Accept",
                                };
                                if (minigameMyStatus == "free" && allowedBrowserNotifications) {
                                    var minigameChallengeNotification = new Notification("Minigame Challenge", {
                                        body: msgGame + " challenge from " + msgFrom
                                    });
                                    setTimeout(function() {
                                        minigameChallengeNotification.close();
                                    }, 5000);
                                }
                            } else if (msgSub1 == "DECSTART" && minigameManager.challenges[msgFrom] && minigameManager.challenges[msgFrom].status != "We declined") {
                                //they declined our challenge
                                if (minigameManager.challenges[msgFrom].status == "Accept") {
                                    minigameManager.challenges[msgFrom].status = "Challenge cancelled";
                                } else {
                                    minigameManager.challenges[msgFrom].status = "Challenge declined";
                                }
                            } else if (msgSub1 == "RECEIVED" && minigameManager.challenges[msgFrom]) {
                                //they received our challenge
                                minigameManager.challenges[msgFrom].status = "Challenge received";
                            }
                            loadChallenges();
                        }
                        if (minigameMyStatus != "free" && msgFrom != minigameOpp && msgMain != "AUTOREPLY") {
                            sendp2p(msgFrom, "AUTOREPLY", minigameMyStatus);
                        } else if (msgMain == "AUTOREPLY") {
                            minigameManager.challenges[msgFrom].status = "Already ingame";
                        }
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
                if (msg.startsWith("MARKET_BROWSE=") && msg.length > 1000) {
                    sendToSpreadsheet(msg);
                }
                if (msg.includes("Item Purchased")) {
                    if (th_status == "sent") {
                        th_status = "purchased";
                        let itemName = itemNameFix(getMarketItemNameFromMarketId(th_object.marketid));
                        let total = th_object.price * th_object.thAmount;
                        tedStoredSettings.tradeHistory.push({
                            marketid: th_object.marketid,
                            tradetype: "buy",
                            date: new Date(),
                            name: itemName,
                            amount: th_object.thAmount,
                            price: th_object.price,
                            total: total
                        });
                        updateVariables();
                        calculateFlips();
                        sortTradeHistory(sortByTH);
                    }
                }
                if (msg.startsWith("MARKET_SLOT=")) { //marketid, name, amountleft, price, coinstocollect, slot, expiresin
                    let arr = msg.substring(msg.lastIndexOf("=") + 1).split("~");
                    let marketid = parseInt(arr[0]);
                    let itemName = arr[1];
                    let price = parseInt(arr[3]);
                    let coinstocollect = parseInt(arr[4]);
                    let amountleft = parseInt(arr[2]);
                    let amountsold = coinstocollect / price;
                    let startamount = amountleft + amountsold;
                    var thUpdated = false;
                    var totalSold = 0,
                        earliestStartAmount = 0;
                    if (coinstocollect > 0) {
                        for (let i = 0; i < tedStoredSettings.tradeHistory.length; i++) {
                            if (tedStoredSettings.tradeHistory[i].hasOwnProperty("marketid") && tedStoredSettings.tradeHistory[i].marketid == marketid) {
                                totalSold += tedStoredSettings.tradeHistory[i].amount;
                                if (earliestStartAmount === 0) {
                                    earliestStartAmount = tedStoredSettings.tradeHistory[i].startamount;
                                    thUpdated = true;
                                }
                            }
                        }
                        if (thUpdated) {
                            amountsold = (earliestStartAmount - totalSold) - amountleft;
                        }
                        if (amountsold > 0) {
                            tedStoredSettings.tradeHistory.push({
                                startamount: startamount,
                                marketid: marketid,
                                tradetype: "sell",
                                date: new Date(),
                                name: itemName,
                                amount: amountsold,
                                price: price,
                                total: coinstocollect
                            });
                            updateVariables();
                            calculateFlips();
                            sortTradeHistory(sortByTH);
                        }
                    }
                }
            };
            var origOnSend = window.webSocket.send;
            window.webSocket.send = function(e) {
                origOnSend.apply(this, arguments);
                let msg = e;
                if (msg.startsWith("MARKET_BUY=")) {
                    let marketId = msg.substring(msg.lastIndexOf("=") + 1, msg.lastIndexOf("~"));
                    th_object = getArrMarketItemObjectFromMarketId(marketId);
                    th_object.thAmount = parseInt(msg.substring(msg.lastIndexOf("~") + 1));
                    if (typeof(th_object) == "undefined") return;
                    th_status = "sent";
                }
            };
        }

        function openInNewTab(url) {
            var win = window.open(url, '_blank');
            win.focus();
        }
        window.openPriceGraph = function() {
            if (!jsTradableItems[itemNameFix(lastBrowsedItem)]) { // if item is not on tradable list
                lastBrowsedItem = "stardust";
            }
            openInNewTab("http://dhmarket.tk/?formItem=" + itemNameFix(lastBrowsedItem));
        };
        window.displayQuickCalcTooltip = function(id, on) {
            if (on) {
                quickCalcTooltip.setAttribute("style", "display:block;position:absolute;top:0;background-color:#f2f2f2;text-align:center;width:100%;");
                if (id == "quickCalcStargem") {
                    quickCalcTooltip.innerHTML = quickCalcStargemString;
                } else if (id == "quickCalcStardust") {
                    quickCalcTooltip.innerHTML = quickCalcStardustString;
                } else if (id == "quickCalcSuperStardust") {
                    quickCalcTooltip.innerHTML = quickCalcSuperStardustString;
                } else if (id == "quickCalcEssence") {
                    quickCalcTooltip.innerHTML = quickCalcEssenceString;
                } else if (id == "quickCalcSuperEssence") {
                    quickCalcTooltip.innerHTML = quickCalcSuperEssenceString;
                }
            } else if (!on) {
                quickCalcTooltip.setAttribute("style", "display:none;");
            }
        };
        window.totalNetWorth = function() {
            var total = 0,
                marketSlots = 0;
            let tnwArr = [];
            if (Object.keys(arrMarketItems).length > 1) {
                for (let key in Object.keys(jsTradableItems)) {
                    if (arrMarketItems[Object.keys(jsTradableItems)[key]]) {
                        if (window[Object.keys(jsTradableItems)[key]] > 0) {
                            total += arrMarketItems[Object.keys(jsTradableItems)[key]][0].price * window[Object.keys(jsTradableItems)[key]];
                            tnwArr.push({
                                name: Object.keys(jsTradableItems)[key],
                                price: arrMarketItems[Object.keys(jsTradableItems)[key]][0].price * window[Object.keys(jsTradableItems)[key]],
                            });
                        }
                    } else console.log("Not on market: " + Object.keys(jsTradableItems)[key]);
                }
                for (let i = 0; i < arrMarketSlots.length; i++) {
                    if (arrMarketItems[arrMarketSlots[i][2]]) {
                        let amount = numberWithoutCommas(document.getElementById("market-slot-" + (i + 1) + "-amount").innerHTML);
                        marketSlots += arrMarketItems[arrMarketSlots[i][2]][0].price * amount;
                        tnwArr.push({
                            name: Object.keys(jsTradableItems)[key]+" (market slot)",
                            price: arrMarketItems[arrMarketSlots[i][2]][0].price * amount,
                        });
                    }
                }
                tnwArr.sort(function(a, b) {
                    return a.price == b.price ? 0 : +(a.price > b.price) || -1;
                });
                tnwArr.forEach(obj => {
                    console.log(obj.name + ": "+ numberWithCommas(obj.price));
                });
                console.log("Total net worth: " + numberWithCommas(coins + total + marketSlots) + "\n\nCoins: " + numberWithCommas(coins) + "\nItems: " + numberWithCommas(total) + "\nSlots: " + numberWithCommas(marketSlots));
            } else console.log("Search all first");
        };

        function alterMarketSlots() {
            if (marketSlotsCustomUi) {
                if (typeof(document.getElementById("market-slot-1").parentNode) != "undefined" && document.getElementById("market-slot-1").parentNode.id != "tedMarketSlotContainer") {
                    var tedMarketUiElement = document.createElement("div");
                    tedMarketUiElement.setAttribute("style", "position:relative;height:325px;width:230px;background:linear-gradient(gold,silver);display:flex;flex-direction:column;justify-content:flex-end");
                    tedMarketUiElement.setAttribute("id", "ted-market-ui");
                    marketSlotSpareElement.innerHTML = updateNews;
                    if (document.getElementById("ted-market-ui") === null) {
                        quickCalcTooltip.setAttribute("style", "display:none");
                        var quickCalcDiv = document.createElement("div");
                        quickCalcDiv.setAttribute("style", "text-align:center;height:52px;line-height:52px;");
                        var quickCalcStargem = document.createElement("img");
                        quickCalcStargem.setAttribute("id", "quickCalcStargem");
                        quickCalcStargem.setAttribute("onmouseover", "displayQuickCalcTooltip(this.id, true);");
                        quickCalcStargem.setAttribute("onmouseout", "displayQuickCalcTooltip(this.id, false);");
                        quickCalcStargem.setAttribute("src", "images/stargemPotion.png");
                        quickCalcStargem.setAttribute("class", "image-icon-30");
                        var quickCalcSuperStardust = document.createElement("img");
                        quickCalcSuperStardust.setAttribute("id", "quickCalcSuperStardust");
                        quickCalcSuperStardust.setAttribute("onmouseover", "displayQuickCalcTooltip(this.id, true);");
                        quickCalcSuperStardust.setAttribute("onmouseout", "displayQuickCalcTooltip(this.id, false);");
                        quickCalcSuperStardust.setAttribute("src", "images/superStardustPotion.png");
                        quickCalcSuperStardust.setAttribute("class", "image-icon-30");
                        var quickCalcStardust = document.createElement("img");
                        quickCalcStardust.setAttribute("id", "quickCalcStardust");
                        quickCalcStardust.setAttribute("onmouseover", "displayQuickCalcTooltip(this.id, true);");
                        quickCalcStardust.setAttribute("onmouseout", "displayQuickCalcTooltip(this.id, false);");
                        quickCalcStardust.setAttribute("src", "images/stardustPotion.png");
                        quickCalcStardust.setAttribute("class", "image-icon-30");
                        var quickCalcEssence = document.createElement("img");
                        quickCalcEssence.setAttribute("id", "quickCalcEssence");
                        quickCalcEssence.setAttribute("onmouseover", "displayQuickCalcTooltip(this.id, true);");
                        quickCalcEssence.setAttribute("onmouseout", "displayQuickCalcTooltip(this.id, false);");
                        quickCalcEssence.setAttribute("src", "images/essencePotion.png");
                        quickCalcEssence.setAttribute("class", "image-icon-30");
                        var quickCalcSuperEssence = document.createElement("img");
                        quickCalcSuperEssence.setAttribute("id", "quickCalcSuperEssence");
                        quickCalcSuperEssence.setAttribute("onmouseover", "displayQuickCalcTooltip(this.id, true);");
                        quickCalcSuperEssence.setAttribute("onmouseout", "displayQuickCalcTooltip(this.id, false);");
                        quickCalcSuperEssence.setAttribute("src", "images/superEssencePotion.png");
                        quickCalcSuperEssence.setAttribute("class", "image-icon-30");
                        var browseAllElementWrapper = document.createElement("div");
                        browseAllElementWrapper.setAttribute("id", "browseAllElementWrapper");
                        browseAllElementWrapper.setAttribute("style", "border-top:1px solid black;");
                        var browseAllElement = document.createElement("div");
                        browseAllElement.setAttribute("style", "margin:5px;padding:0px");
                        browseAllElement.setAttribute("class", "basic-smallbox-grey");
                        browseAllElement.setAttribute("id", "ted-browse-all");
                        browseAllElement.setAttribute("title", "Browse All");
                        browseAllElement.innerHTML = "<input type='image' data-item-name='All Items' style='padding:10px' onclick='disableBtn(this.parentNode," + searchAllDelay + ");document.getElementById(&quot;dialogue-market-postitem-buyorsell&quot;).value = &quot;buy&quot;;postItemDialogue(document.getElementById(&quot;dialogue-market-postitem-buyorsell&quot;), &quot;ALL&quot;, this);' src='images/icons/infinity.png' class='image-icon-30'>";
                        var priceGraphElement = document.createElement("div");
                        priceGraphElement.setAttribute("style", "margin:5px;padding:0px");
                        priceGraphElement.setAttribute("class", "basic-smallbox-grey");
                        priceGraphElement.setAttribute("id", "ted-price-graph");
                        priceGraphElement.setAttribute("title", "Price History Graph");
                        priceGraphElement.innerHTML = "<input type='image' style='padding:10px' onclick='disableBtn(this.parentNode,500);openPriceGraph();' src='http://i.imgur.com/XhYzZRt.png' class='image-icon-30'>";
                        var tradeHistoryElement = document.createElement("div");
                        tradeHistoryElement.setAttribute("style", "margin:5px;padding:0px");
                        tradeHistoryElement.setAttribute("class", "basic-smallbox-grey");
                        tradeHistoryElement.setAttribute("id", "ted-trade-history");
                        tradeHistoryElement.setAttribute("title", "Trade History");
                        tradeHistoryElement.innerHTML = "<input type='image' style='padding:10px' onclick='disableBtn(this.parentNode,500);openTradeHistory();' src='http://i.imgur.com/ch5nOjq.png' class='image-icon-30'>";
                        var tedMarketSlotContainer = document.createElement("div");
                        tedMarketSlotContainer.setAttribute("style", "display:flex;justify-content:space-between;width:80%;max-width:1200px;min-width:800px;");
                        document.getElementById("market-slot-1").parentNode.appendChild(tedMarketSlotContainer);
                        for (var i = 0; i < arrMarketSlots.length; i++) {
                            document.getElementById("market-slot-" + (i + 1)).style.margin = "0px 2px";
                            tedMarketSlotContainer.appendChild(document.getElementById("market-slot-" + (i + 1)));
                        }
                        tedMarketSlotContainer.appendChild(tedMarketUiElement);
                        document.getElementById("ted-market-ui").append(quickCalcTooltip);
                        document.getElementById("ted-market-ui").appendChild(marketSlotSpareElement);
                        document.getElementById("ted-market-ui").appendChild(browseAllElementWrapper);
                        document.getElementById("browseAllElementWrapper").appendChild(browseAllElement);
                        document.getElementById("browseAllElementWrapper").appendChild(priceGraphElement);
                        document.getElementById("browseAllElementWrapper").appendChild(tradeHistoryElement);
                        let browseAndHistory = document.getElementById("ted-market-ui").appendChild(document.createElement("div"));
                        browseAndHistory.appendChild(document.getElementsByClassName("market-browse-button")[0]);
                        browseAndHistory.appendChild(document.getElementsByClassName("market-browse-button")[1]);
                        document.getElementsByClassName("market-browse-button")[0].setAttribute("style","width:50%;padding:10px 0");
                        document.getElementsByClassName("market-browse-button")[1].setAttribute("style","width:50%;padding:10px 0");
                        browseAndHistory.setAttribute("style", "display:flex");
                        document.getElementById("ted-market-ui").appendChild(quickCalcDiv);
                        quickCalcDiv.appendChild(quickCalcStardust);
                        quickCalcDiv.appendChild(quickCalcSuperStardust);
                        quickCalcDiv.appendChild(quickCalcStargem);
                        quickCalcDiv.appendChild(quickCalcEssence);
                        quickCalcDiv.appendChild(quickCalcSuperEssence);
                    }
                    // various player market formatting improvements, dear lord forgive me
                    if (document.getElementById("tab-container-playermarket").children[0].innerHTML == "Player Market") {
                        document.getElementById("tab-container-playermarket").children[0].remove();
                        document.getElementById("tab-container-playermarket").prepend(document.createElement("br"));
                    }
                    if (document.getElementsByClassName("error-msg")[0].parentNode.parentNode.id == "market-listings") {
                        document.getElementsByClassName("error-msg")[0].parentNode.remove();
                    }
                    if (document.getElementById("market-listings").children[1].getAttribute("style") == "clear:both") {
                        document.getElementById("market-listings").children[1].remove();
                    }
                    setTimeout(function() {
                        if (document.getElementById("market-listings").children[1].children[6].tagName == "BR") {
                            document.getElementById("market-listings").children[1].children[6].remove();
                        }
                        if (document.getElementById("market-listings").children[1].children[5].tagName == "BR") {
                            document.getElementById("market-listings").children[1].children[5].remove();
                        }
                        if (document.getElementById("market-listings").children[1].children[3].tagName == "BR") {
                            document.getElementById("market-listings").children[1].children[3].remove();
                        }
                        if (document.getElementById("market-listings").children[1].children[2].tagName == "BR") {
                            document.getElementById("market-listings").children[1].children[2].remove();
                        }
                    }, 1);
                    for (let i = 0; i < arrMarketSlots.length; i++) {
                        document.getElementsByClassName("market-slot-collect")[i].previousElementSibling.style.borderLeft = "0px";
                        document.getElementsByClassName("market-slot-collect")[i].previousElementSibling.style.borderRight = "0px";
                    }
                }
            }
        }
        window.myItemListBtnAction = function(itemName, itemPrice) {
            myItemListAddName = itemName;
            myItemListAddPrice = numberWithCommas(itemPrice);
            changeSetting("tedTradableItems");
        };
        window.upToParentByTag = function(el, tag) {
            // Climbs the DOM until it gets to the given tag.
            tag = tag.toUpperCase();
            el = el.parentNode;
            while (el.nodeName !== tag && el.nodeName !== 'HTML') {
                el = el.parentNode;
            }
            if (el.modeName === 'HTML') {
                el = null;
            }
            return el;
        };

        function colorToRGBA(color) {
            // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
            // color must be a valid canvas fillStyle. This will cover most anything
            // you'd want to use.
            // Examples:
            // colorToRGBA('red')  # [255, 0, 0, 255]
            // colorToRGBA('#f00') # [255, 0, 0, 255]
            var cvs, ctx;
            cvs = document.createElement('canvas');
            cvs.height = 1;
            cvs.width = 1;
            ctx = cvs.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            return ctx.getImageData(0, 0, 1, 1).data;
        }

        function byteToHex(num) {
            // Turns a number (0-255) into a 2-character hex number (00-ff)
            return ('0' + num.toString(16)).slice(-2);
        }

        function colorToHex(color) {
            // Convert any CSS color to a hex representation
            // Examples:
            // colorToHex('red')            # '#ff0000'
            // colorToHex('rgb(255, 0, 0)') # '#ff0000'
            var rgba, hex;
            rgba = colorToRGBA(color);
            hex = [0, 1, 2].map(function(idx) {
                return byteToHex(rgba[idx]);
            }).join('');
            return "#" + hex;
        }

        function colorLuminance(hex, lum) {
            hex = colorToHex(hex);
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;
            // convert to decimal and change luminosity
            var rgb = "#",
                c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }
            return rgb;
        }

        function colorMarketTable() {
            var minPrice, secondPrice, firstRow, secondRow, table, itemName, length;
            for (let i = 0; i < Object.keys(arrMarketItems).length; i++) {
                table = document.getElementById("market-table");
                itemName = Object.keys(arrMarketItems)[i];
                minPrice = arrMarketItems[itemName][0].price;
                length = arrMarketItems[itemName].length;
                if (length >= 2) {
                    secondPrice = arrMarketItems[itemName][1].price;
                } else secondPrice = null;
                firstRow = arrMarketItems[itemName][0].row;
                if (length >= 2) {
                    secondRow = arrMarketItems[itemName][1].row;
                } else secondRow = null;
                if (minPrice <= tedStoredSettings.tedTradableItems.itemList[itemName].showAtPrice) {
                    table.rows[firstRow].style.background = "linear-gradient(" + colorMyItemList + "," + colorLuminance(colorMyItemList, -0.1) + ")";
                    table.rows[firstRow].style.display = "table-row";
                    if (length >= 2) {
                        table.rows[firstRow].setAttribute("tedcolored", "true");
                        table.rows[secondRow].style.background = "linear-gradient(" + colorMyItemListNextLowest + "," + colorLuminance(colorMyItemListNextLowest, -0.1) + ")";
                        table.rows[secondRow].style.display = "table-row";
                    }
                } else if (tedStoredSettings.tedTradableItems.itemList[itemName].showAtMin && secondPrice && (Math.ceil(secondPrice * 0.86) > minPrice)) {
                    table.rows[firstRow].setAttribute("tedcolored", "true");
                    document.getElementById("market-table").rows[firstRow].style.background = "linear-gradient(" + colorMinPrice + "," + colorLuminance(colorMinPrice, -0.1) + ")";
                    document.getElementById("market-table").rows[firstRow].style.display = "table-row";
                    document.getElementById("market-table").rows[secondRow].style.background = "linear-gradient(" + colorNextLowestToMinPrice + "," + colorLuminance(colorNextLowestToMinPrice, -0.1) + ")";
                    document.getElementById("market-table").rows[secondRow].style.display = "table-row";
                } else if (tedStoredSettings.tedTradableItems.itemList[itemName].alwaysShowLowest) {
                    table.rows[firstRow].style.background = "linear-gradient(" + colorAlwaysShowLowest + "," + colorLuminance(colorAlwaysShowLowest, -0.1) + ")";
                    table.rows[firstRow].style.display = "table-row";
                } else if (showSingleItems && length == 1) {
                    document.getElementById("market-table").rows[firstRow].style.background = "linear-gradient(" + colorSingleItems + "," + colorLuminance(colorSingleItems, -0.1) + ")";
                    document.getElementById("market-table").rows[firstRow].style.display = "table-row";
                }
            }
            for (s = 0; s < arrMarketSlots.length; s++) {
                if (arrMarketSlots[s][1] === true) {
                    var myItemName, myMarketId, myRow, myListPosition, foundItem = false;
                    for (var i = 0; i < Object.keys(arrMarketItems).length; i++) {
                        myItemName = Object.keys(arrMarketItems)[i];
                        firstRow = arrMarketItems[myItemName][0].row;
                        length = arrMarketItems[myItemName].length;
                        for (var a = 0; a < arrMarketItems[myItemName].length; a++) {
                            let itemString = document.getElementById("market-slot-" + (s + 1) + "-taken").children[0].src;
                            arrMarketSlots[s].push(itemString.substring(itemString.indexOf("/images/") + 8, itemString.indexOf(".png")));
                            if (arrMarketItems[myItemName][a].marketid == arrMarketSlots[s][0]) {
                                myMarketId = arrMarketItems[myItemName][a].marketid;
                                myRow = arrMarketItems[myItemName][a].row;
                                myListPosition = a;
                                foundItem = true;
                                break;
                            }
                        }
                        if (foundItem) break;
                    }
                    if (!foundItem) continue;
                    if (myListPosition === 0) {
                        document.getElementById("market-table").rows[myRow].style.display = "table-row";
                        document.getElementById("market-table").rows[myRow].style.background = "linear-gradient(" + colorMyListedLowest + "," + colorLuminance(colorMyListedLowest, -0.1) + ")";
                        if (length >= 2) {
                            document.getElementById("market-table").rows[(myRow + 1)].style.display = "table-row";
                            document.getElementById("market-table").rows[(myRow + 1)].style.background = "linear-gradient(" + colorMyListedLowestCanRaisePrice + "," + colorLuminance(colorMyListedLowestCanRaisePrice, -0.1) + ")";
                        }
                    } else if (myListPosition > 0) {
                        document.getElementById("market-table").rows[myRow].style.background = "linear-gradient(" + colorMyListedNotLowest + "," + colorLuminance(colorMyListedNotLowest, -0.1) + ")";
                        document.getElementById("market-table").rows[myRow].style.display = "table-row";
                        if (table.rows[firstRow].getAttribute("tedcolored") === null) {
                            document.getElementById("market-table").rows[firstRow].style.background = "linear-gradient(" + colorLowestForMyListed + "," + colorLuminance(colorLowestForMyListed, -0.1) + ")";
                            document.getElementById("market-table").rows[firstRow].style.display = "table-row";
                        }
                    } else console.log("error 12751");
                }
            }
        }
        window.highlightRow = function(row, display) {
            if (display) {
                row.style.boxShadow = "0 3px 5px -2px inset, 0 -3px 5px -3px inset";
            } else if (!display) {
                row.style.boxShadow = "";
            }
        };

        function tradeHistory() {
            var tradeHistoryModal = document.createElement("div");
            tradeHistoryModal.setAttribute("id", "tradeHistoryModal");
            tradeHistoryModal.setAttribute("style", "display:none");
            var tradeHistoryModalBody = document.createElement("div");
            tradeHistoryModalBody.setAttribute("id", "tradeHistoryModalBody");
            tradeHistoryModalBody.setAttribute("style", "display:none;background-color:silver;width:80%;min-width:800px;max-width:1200px;margin-bottom:5px;");
            var thBuyCheckbox = document.createElement("input");
            thBuyCheckbox.setAttribute("type", "checkbox");
            thBuyCheckbox.setAttribute("id", "thBuyCheckbox");
            thBuyCheckbox.setAttribute("onclick", "generateTradeHistoryTable();document.getElementById('thSearch').focus();");
            thBuyCheckbox.setAttribute("checked", "true");
            var thBuyCheckboxLabel = document.createElement("label");
            thBuyCheckboxLabel.htmlFor = "thBuyCheckbox";
            thBuyCheckboxLabel.appendChild(document.createTextNode('Buy'));
            var thSellCheckbox = document.createElement("input");
            thSellCheckbox.setAttribute("type", "checkbox");
            thSellCheckbox.setAttribute("id", "thSellCheckbox");
            thSellCheckbox.setAttribute("onclick", "generateTradeHistoryTable();document.getElementById('thSearch').focus();");
            thSellCheckbox.setAttribute("checked", "true");
            var thSellCheckboxLabel = document.createElement("label");
            thSellCheckboxLabel.htmlFor = "thSellCheckbox";
            thSellCheckboxLabel.appendChild(document.createTextNode('Sell'));
            var thMax3Checkbox = document.createElement("input");
            thMax3Checkbox.setAttribute("type", "checkbox");
            thMax3Checkbox.setAttribute("id", "thMax3Checkbox");
            thMax3Checkbox.setAttribute("onclick", "generateTradeHistoryTable();document.getElementById('thSearch').focus();");
            thMax3Checkbox.setAttribute("checked", "true");
            var thMax3CheckboxLabel = document.createElement("label");
            thMax3CheckboxLabel.htmlFor = "thMax3Checkbox";
            thMax3CheckboxLabel.appendChild(document.createTextNode('Last 3'));
            var thSearch = document.createElement("input");
            thSearch.setAttribute("type", "text");
            thSearch.setAttribute("id", "thSearch");
            thSearch.setAttribute("title", "To match full search string use = before item name\n\n=gold leaf\nshows only Gold Leaf\n\ngold leaf\nshows Gold Leaf and Gold Leaf Seeds");
            thSearch.setAttribute("onchange", "thSearchLogic();");
            thSearch.setAttribute("onkeypress", "this.onchange();");
            thSearch.setAttribute("onpaste", "this.onchange();");
            thSearch.setAttribute("oninput", "this.onchange();");
            thSearch.setAttribute("placeholder", "search by name...");
            var thClose = document.createElement("button");
            thClose.setAttribute("style", "float:right;height:18px;width:18px;border-radius:18px;cursor:pointer;background-color:#ff7878;margin:2px");
            thClose.setAttribute("onclick", "this.parentNode.style.display='none'");
            thClose.setAttribute("id", "thClose");
            var thTotalFlipProfit = document.createElement("span");
            thTotalFlipProfit.setAttribute("style", "float:left;margin:2px");
            thTotalFlipProfit.setAttribute("id", "thTotalFlipProfit");
            var tradeHistoryModalBodyTable = document.createElement("div");
            tradeHistoryModalBodyTable.setAttribute("id", "tradeHistoryModalBodyTable");
            tradeHistoryModalBodyTable.setAttribute("style", "background-color:silver;margin:auto;");
            document.getElementById("market-table").parentNode.prepend(tradeHistoryModalBody);
            document.getElementById("market-table").parentNode.prepend(document.createElement("br"));
            document.getElementById("tradeHistoryModalBody").append(thTotalFlipProfit);
            document.getElementById("tradeHistoryModalBody").append(thSearch);
            document.getElementById("tradeHistoryModalBody").append(thBuyCheckbox);
            document.getElementById("tradeHistoryModalBody").append(thBuyCheckboxLabel);
            document.getElementById("tradeHistoryModalBody").append(thSellCheckbox);
            document.getElementById("tradeHistoryModalBody").append(thSellCheckboxLabel);
            document.getElementById("tradeHistoryModalBody").append(thMax3Checkbox);
            document.getElementById("tradeHistoryModalBody").append(thMax3CheckboxLabel);
            document.getElementById("tradeHistoryModalBody").append(thClose);
            document.getElementById("tradeHistoryModalBody").append(tradeHistoryModalBodyTable);
        }

        function alterMarketTable() {
            var i, a, b, s, maxCanBuy, totalPrice, arrToAppend;
            document.getElementById("market-table").rows[0].style.backgroundColor = "gold";
            if (document.getElementById("market-table").rows[1]) {
                for (i = 2; i < 4; i++) {
                    while (document.getElementById("market-table").rows[0].childNodes[i].firstChild) {
                        document.getElementById("market-table").rows[0].childNodes[i].removeChild(document.getElementById("market-table").rows[0].childNodes[i].firstChild);
                    }
                }
                if (showMaxCanBuy) {
                    var headerMaxCanBuy = document.createElement("div");
                    headerMaxCanBuy.setAttribute("style", "float:left;padding-left:10px;");
                    headerMaxCanBuy.append("maxCanBuy");
                    document.getElementById("market-table").rows[0].childNodes[2].append(headerMaxCanBuy);
                }
                var headerAmount = document.createElement("div");
                headerAmount.setAttribute("style", "text-align:right;padding-right:10px;");
                headerAmount.append("Amount");
                document.getElementById("market-table").rows[0].childNodes[2].append(headerAmount);
                if (showTotalPrice) {
                    var headerTotalPrice = document.createElement("div");
                    headerTotalPrice.setAttribute("style", "float:right;padding-right:10px;");
                    headerTotalPrice.append("Total maxCanBuy Price");
                    document.getElementById("market-table").rows[0].childNodes[3].append(headerTotalPrice);
                }
                var headerPrice = document.createElement("div");
                headerPrice.setAttribute("style", "text-align:left;padding-left:10px;");
                headerPrice.append("Price each");
                document.getElementById("market-table").rows[0].childNodes[3].append(headerPrice);
            }
            if (document.getElementById("market-table").nextSibling.id != "tedMarketTable") {
                var tedMarketTable = document.createElement("table");
                tedMarketTable.setAttribute("id", "tedMarketTable");
                tedMarketTable.setAttribute("class", "market-table");
                tedMarketTable.setAttribute("style", "max-width:1200px;min-width:800px;");
                document.getElementById("market-table").style.display = "none";
                if (document.getElementById("market-table").nextSibling) {
                    document.getElementById("market-table").parentNode.insertBefore(tedMarketTable, document.getElementById("market-table").nextSibling);
                } else {
                    document.getElementById("market-table").parentNode.appendChild(document.getElementById("tedmarketTable"));
                }
            }
            if (document.getElementById("market-table").rows[0].childNodes[0]) document.getElementById("market-table").rows[0].childNodes[0].style.width = "25%";
            if (document.getElementById("market-table").rows[0].childNodes[1]) document.getElementById("market-table").rows[0].childNodes[1].style.width = "50px";
            //document.getElementById("tedMarketTable").rows[0].childNodes[2].style.width = "25%";
            //document.getElementById("tedMarketTable").rows[0].childNodes[3].style.width = "25%";
            if (document.getElementById("market-table").rows[0].childNodes[4]) document.getElementById("market-table").rows[0].childNodes[4].style.width = "10%";
            if (debugToConsole) {
                console.log(arrMarketItems);
            }
            for (i = 0; i < Object.keys(arrMarketItems).length; i++) {
                var itemName = Object.keys(arrMarketItems)[i];
                var marketItemName = getItemName(itemName);
                var length = arrMarketItems[itemName].length;
                var firstRow = arrMarketItems[itemName][0].row;
                var minPrice = arrMarketItems[itemName][0].price;
                if (length >= 2) {
                    var secondRow = arrMarketItems[itemName][1].row;
                    var secondPrice = arrMarketItems[itemName][1].price;
                }
                //fixes Name column for first market entry to add buttons without onclick to buy item
                document.getElementById("market-table").rows[firstRow].removeAttribute("onclick");
                for (b = 1; b < document.getElementById("market-table").rows[firstRow].childNodes.length; b++) {
                    document.getElementById("market-table").rows[firstRow].childNodes[b].setAttribute("onclick", "openBuyFromPlayerMarketDialogue(this.parentNode);");
                }
                var btnMyItemListDiv = document.createElement("div");
                btnMyItemListDiv.setAttribute("style", "float:left;padding-left:15px");
                var btnMyItemList = document.createElement("BUTTON");
                btnMyItemList.setAttribute("onclick", "myItemListBtnAction(upToParentByTag(this,'tr').getAttribute('teditemname'),upToParentByTag(this,'tr').getAttribute('data-market-price'));");
                btnMyItemList.setAttribute("style", "background-color:#ffccff");
                btnMyItemList.setAttribute("title", "Add to Item List");
                var btnMyItemListText = document.createTextNode("+");
                btnMyItemList.appendChild(btnMyItemListText);
                btnMyItemListDiv.appendChild(btnMyItemList);
                var itemNameTextDiv = document.createElement("div");
                itemNameTextDiv.setAttribute("onclick", "openBuyFromPlayerMarketDialogue(upToParentByTag(this,'tr'));");
                var itemNameText = document.createElement("span");
                itemNameText.setAttribute("style", "vertical-align:middle;padding: 0 10px");
                itemNameText.append(marketItemName);
                itemNameTextDiv.append(itemNameText);
                while (document.getElementById("market-table").rows[firstRow].childNodes[0].firstChild) {
                    document.getElementById("market-table").rows[firstRow].childNodes[0].removeChild(document.getElementById("market-table").rows[firstRow].childNodes[0].firstChild);
                }
                document.getElementById("market-table").rows[firstRow].childNodes[0].append(btnMyItemListDiv);
                document.getElementById("market-table").rows[firstRow].childNodes[0].append(itemNameTextDiv);
                for (a = 0; a < arrMarketItems[itemName].length; a++) {
                    var row = arrMarketItems[itemName][a].row;
                    var price = arrMarketItems[itemName][a].price;
                    var amount = arrMarketItems[itemName][a].amount;
                    var marketid = arrMarketItems[itemName][a].marketid;
                    document.getElementById("market-table").rows[row].setAttribute("teditemname", itemName);
                    document.getElementById("market-table").rows[row].setAttribute("teditemprice", price);
                    document.getElementById("market-table").rows[row].setAttribute("teditemamount", amount);
                    document.getElementById("market-table").rows[row].setAttribute("class", "tedMarketRow");
                    document.getElementById("market-table").rows[row].setAttribute("onmouseover", "highlightRow(this, true);");
                    document.getElementById("market-table").rows[row].setAttribute("onmouseout", "highlightRow(this, false);");
                    for (b = 0; b < 4; b++) {
                        if (b == 1) continue;
                        if (a === 0 && b === 0) {
                            document.getElementById("market-table").rows[row].childNodes[b].setAttribute("style", "text-align:right;");
                        } else document.getElementById("market-table").rows[row].childNodes[b].setAttribute("style", "text-align:right;padding: 0 10px;");
                    }
                    if (smallMarketImages) {
                        document.getElementById("market-table").childNodes[0].childNodes[row].childNodes[1].childNodes[0].style = "height: " + marketImageSize + "px;width: " + marketImageSize + "px;";
                    }
                    //Amount column
                    maxCanBuy = Math.floor(coins / price);
                    if (maxCanBuy >= amount) {
                        maxCanBuy = amount;
                    }
                    if (showMaxCanBuy) {
                        if (maxCanBuy < amount) {
                            var maxCanBuyDiv = document.createElement("div");
                            maxCanBuyDiv.setAttribute("style", "float:left;");
                            maxCanBuyDiv.setAttribute("class", "maxCanBuyClass");
                            maxCanBuyDiv.append(" (x" + numberWithCommas(maxCanBuy) + ") ");
                            document.getElementById("market-table").rows[row].cells[2].prepend(maxCanBuyDiv);
                        }
                    }
                    //price
                    while (document.getElementById("market-table").rows[row].childNodes[3].firstChild) {
                        document.getElementById("market-table").rows[row].childNodes[3].removeChild(document.getElementById("market-table").rows[row].childNodes[3].firstChild);
                    }
                    var itemPriceDiv = document.createElement("div");
                    itemPriceDiv.setAttribute("style", "white-space:nowrap;float:left;");
                    itemPriceDiv.setAttribute("class", "itemPriceClass");
                    document.getElementById("market-table").rows[row].childNodes[3].append(itemPriceDiv);
                    itemPriceDiv.append(numberWithCommas(upToParentByTag(itemPriceDiv, 'tr').getAttribute('teditemprice')));
                    itemPriceDiv.append(coinImg.cloneNode());
                    if (showTotalPrice) {
                        if (amount > 1) {
                            totalPrice = maxCanBuy * price;
                            var totalPriceDiv = document.createElement("div");
                            totalPriceDiv.setAttribute("style", "white-space:nowrap;float:right");
                            totalPriceDiv.append(numberWithCommas(totalPrice));
                            totalPriceDiv.append(coinImg.cloneNode());
                            document.getElementById("market-table").rows[row].childNodes[3].append(totalPriceDiv);
                        }
                    }
                    var oldOnclick = document.getElementById('market-table').rows[row].getAttribute('onclick');
                    if (oldOnclick !== null) {
                        document.getElementById("market-table").rows[row].setAttribute("onclick", oldOnclick + ";document.getElementById('buyFromMarket-input').value = " + maxCanBuy + ";");
                    } else document.getElementById("market-table").rows[row].setAttribute("onclick", "document.getElementById('buyFromMarket-input').value = " + maxCanBuy + ";");
                    if (notEnoughCoinsOpacity && maxCanBuy === 0) {
                        document.getElementById("market-table").rows[row].style.opacity = "0.3";
                    }
                    if (document.getElementById("market-table").rows.length > 16) { // if we are searching all
                        if (document.getElementById("market-table").rows[row].style.display === "") {
                            document.getElementById("market-table").rows[row].style.display = "none";
                        }
                        if (i == Object.keys(arrMarketItems).length - 1 && a == length - 1) { //after last item in arrMarketItems
                            quickCalcMain();
                        }
                    }
                } // end of for (a..
            } // end of for i
            colorMarketTable();
            // sort market table
            arrToAppend = [];
            for (s = 0; s < arrSortItemsList.length; s++) {
                if (arrMarketItems[itemNameFix(arrSortItemsList[s])]) {
                    for (i = 0; i < arrMarketItems[itemNameFix(arrSortItemsList[s])].length; i++) {
                        arrToAppend.push(document.getElementById("market-table").rows[arrMarketItems[itemNameFix(arrSortItemsList[s])][i].row]);
                    }
                }
            }
            for (i = 0; i < arrToAppend.length; i++) {
                document.getElementById("market-table").append(arrToAppend[i]);
            }
            // append to tedMarketTable
            arrToAppend = [];
            for (i = 0; i < document.getElementById("market-table").childNodes.length; i++) {
                arrToAppend.push(document.getElementById("market-table").childNodes[i]);
            }
            while (document.getElementById("tedMarketTable").firstChild) {
                document.getElementById("tedMarketTable").removeChild(document.getElementById("tedMarketTable").firstChild);
            }
            for (i = 0; i < arrToAppend.length; i++) {
                document.getElementById("tedMarketTable").append(arrToAppend[i]);
            }
            // modify text widths perfectly, thanks florb you fucking god
            let widestMaxCanBuy = Array.prototype.slice.call(document.querySelectorAll(".maxCanBuyClass")).reduce((acc, val) => {
                return (acc > val.offsetWidth ? acc : val.offsetWidth);
            }, 0);
            Array.prototype.slice.call(document.querySelectorAll(".maxCanBuyClass")).forEach(e => {
                e.style.width = (widestMaxCanBuy) + "px";
            });
            let widestItemPrice = Array.prototype.slice.call(document.querySelectorAll(".itemPriceClass")).reduce((acc, val) => {
                return (acc > val.offsetWidth ? acc : val.offsetWidth);
            }, 0);
            Array.prototype.slice.call(document.querySelectorAll(".itemPriceClass")).forEach(e => {
                e.style.width = (widestItemPrice) + "px";
            });
        }

        function updateMarketSlots() {
            for (let i = 0; i < arrMarketSlots.length; i++) { //arrMarketSlots format: [marketid, in use?]
                arrMarketSlots[i][0] = window["marketSlot" + (i + 1)];
                if (document.getElementById("market-slot-" + (i + 1) + "-free").style.display === "") {
                    arrMarketSlots[i][1] = false;
                } else arrMarketSlots[i][1] = true;
                if (debugToConsole) {
                    console.log("Market slot: " + (i + 1), arrMarketSlots[i][0], arrMarketSlots[i][1]);
                }
            }
        }

        function marketReloaded() {
            if (typeof(document.getElementById("market-table").rows[0]) != "undefined" && document.getElementById("market-table").rows[0] !== null) {
                // exists
                if (document.getElementById("market-table").rows[0].style.backgroundColor != "gold") {
                    updateMarketSlots();
                    getMarketItems();
                    addItemTooltips();
                    alterMarketTable();
                }
            }
        }

        function marketMain() {
            if (marketOn === true) {
                marketInterval = setInterval(marketReloaded, 0);
            }
        }

        function marketButtonClickAction() {
            if (marketOn === true) {
                marketOn = false;
                clearInterval(marketInterval);
                document.getElementById("market-table").style.display = "";
                if (document.getElementById("tedMarketTable")) {
                    document.getElementById("tedMarketTable").style.display = "none";
                }
                document.getElementById("marketButton").innerHTML = "Ted's Market: OFF";
            } else if (marketOn === false) {
                marketOn = true;
                document.getElementById("market-table").style.display = "none";
                if (document.getElementById("tedMarketTable")) {
                    document.getElementById("tedMarketTable").style.display = "";
                }
                marketMain();
                document.getElementById("marketButton").innerHTML = "Ted's Market: ON";
            }
        }

        function getRowFromMarketId(marketId) {
            for (var i = 0; i < Object.keys(arrMarketItems).length; i++) {
                let itemName = Object.keys(arrMarketItems)[i];
                for (var a = 0; a < arrMarketItems[itemName].length; a++) {
                    if (arrMarketItems[itemName][a].marketid == marketId) {
                        return arrMarketItems[itemName][a].marketid;
                    }
                }
            }
            return undefined;
        }

        function getMarketItemNameFromMarketId(marketId) {
            for (var i = 0; i < Object.keys(arrMarketItems).length; i++) {
                let itemName = Object.keys(arrMarketItems)[i];
                for (var a = 0; a < arrMarketItems[itemName].length; a++) {
                    if (arrMarketItems[itemName][a].marketid == marketId) {
                        return getItemName(itemName);
                    }
                }
            }
            return undefined;
        }

        function refreshMarketAfterBuyingItem() {
            //refresh market after final confirmation when buying item
            if (document.getElementById("dialogue-confirm-cmd").value.substring(0, 10) != "MARKET_BUY" && document.getElementById("dialogue-confirm-yes").getAttribute("onclick") != oldDialogueConfirmYesOnclick) {
                document.getElementById("dialogue-confirm-yes").setAttribute("onclick", oldDialogueConfirmYesOnclick);
            }
            if (typeof(document.getElementById("tedMarketTable")) != "undefined" && document.getElementById("tedMarketTable") !== null && document.getElementById("dialogue-confirm-cmd").value.substring(0, 10) == "MARKET_BUY" && document.getElementById("dialogue-confirm-yes").value == "Confirm Purchase") {
                document.getElementById("dialogue-confirm-yes").value = "Confirm Purchase "; //break infinite loop
                if (document.getElementById("tedMarketTable").rows.length > 16) { // if we searched all
                    if (document.getElementById('dialogue-confirm-yes').getAttribute("onclick") != "confirmedDialogue(this, document.getElementById('dialogue-confirm-cmd').value);document.getElementById('dialogue-market-postitem-buyorsell').value = 'buy';postItemDialogue(document.getElementById('dialogue-market-postitem-buyorsell'), 'ALL', this);") {
                        document.getElementById("dialogue-confirm-yes").setAttribute("onclick", "confirmedDialogue(this, document.getElementById('dialogue-confirm-cmd').value);document.getElementById('dialogue-market-postitem-buyorsell').value = 'buy';postItemDialogue(document.getElementById('dialogue-market-postitem-buyorsell'), 'ALL', this);");
                    }
                } else if (document.getElementById("tedMarketTable").rows.length <= 16) { // if we searched for a single item
                    var marketBuyString = document.getElementById('dialogue-confirm-cmd').value;
                    var marketId = marketBuyString.substring(marketBuyString.lastIndexOf("=") + 1, marketBuyString.lastIndexOf("~"));
                    var itemName = getMarketItemNameFromMarketId(marketId);
                    if (typeof(itemName) != "undefined") {
                        refreshMarketAfterBuyingItem_itemName = itemNameFix(itemName);
                        if (document.getElementById('dialogue-confirm-yes').getAttribute("onclick") != "confirmedDialogue(this, document.getElementById('dialogue-confirm-cmd').value);document.getElementById('dialogue-market-postitem-buyorsell').value = 'buy';postItemDialogue(document.getElementById('dialogue-market-postitem-buyorsell'), '" + refreshMarketAfterBuyingItem_itemName + "', this);") {
                            document.getElementById("dialogue-confirm-yes").setAttribute("onclick", "confirmedDialogue(this, document.getElementById('dialogue-confirm-cmd').value);document.getElementById('dialogue-market-postitem-buyorsell').value = 'buy';postItemDialogue(document.getElementById('dialogue-market-postitem-buyorsell'), '" + refreshMarketAfterBuyingItem_itemName + "', this);");
                        }
                    }
                }
            }
        }
        window.modifyKeepList = function(chosenItem) {
            var keepAmount = window[chosenItem] - numberWithoutCommas(document.getElementById("chosenpostitem-amount").value);
            if (keepAmount < 0) keepAmount = 0;
            if (tedStoredSettings.tedTradableItems.itemList[chosenItem].keepAmount != keepAmount) {
                tedStoredSettings.tedTradableItems.itemList[chosenItem].keepAmount = keepAmount;
                updateVariables();
            }
        };
        window.fixCpiNumbers = function() {
            document.getElementById("chosenpostitem-amount").value = numberWithoutCommas(document.getElementById("chosenpostitem-amount").value);
            document.getElementById("chosenpostitem-price").value = numberWithoutCommas(document.getElementById("chosenpostitem-price").value);
        };
        window.keepAmountSetMax = function() {
            document.getElementById("chosenpostitem-amount").value = numberWithCommas(window[document.getElementById("chosenpostitem-itemName").value]);
        };

        function dialogue_market_chosenpostitem() {
            if (document.getElementById("dialogue-market-chosenpostitem").parentNode.style.display == "none") {
                cpi_itemName = "";
            }
            if (document.getElementById("dialogue-market-chosenpostitem").parentNode.style.display != "none") {
                if (document.getElementById("chosenpostitem-price").value === "" && document.getElementById("chosenpostitem-itemName").value != cpi_itemName) {
                    cpi_itemName = document.getElementById("chosenpostitem-itemName").value;
                    var currentPrice = Math.ceil((numberWithoutCommas(document.getElementById("chosenpostitem-upper").innerHTML) + numberWithoutCommas(document.getElementById("chosenpostitem-lower").innerHTML)) / 2);
                    if (autoUndercut) {
                        if (currentPrice > matchLowestPriceAt) {
                            document.getElementById("chosenpostitem-price").value = (currentPrice - undercutBy);
                        } else {
                            let item = itemNameFix(lastBrowsedItem).toLowerCase();
                            if (arrMarketItems[item] && arrMarketItems[item][0]) {
                                let count = 0,
                                    itemPrice = 0;
                                for (let i = 0; i < arrMarketItems[item].length; i++) {
                                    count++;
                                    itemPrice += arrMarketItems[item][i].price;
                                }
                                document.getElementById("chosenpostitem-price").value = Math.ceil(itemPrice / count);
                            } else document.getElementById("chosenpostitem-price").value = currentPrice;
                        }
                    }
                    if (useUndercutBox) {
                        var undercutBoxTextInner = "Undercut " + numberWithCommas(currentPrice) + " by<br><br>";
                        if (undercutBoxText.innerHTML != undercutBoxTextInner) {
                            undercutBoxText.innerHTML = undercutBoxTextInner;
                        }
                    }
                    if (useKeepAmount) {
                        var cpiPostString = document.getElementById("cpi-post").getAttribute("onclick");
                        if (document.getElementById("chosenpostitem-itemName").value !== "") {
                            keepAmountChosenItem = document.getElementById("chosenpostitem-itemName").value;
                            var keepAmount = tedStoredSettings.tedTradableItems.itemList[keepAmountChosenItem].keepAmount;
                            var amountToChangeTo = window[keepAmountChosenItem] - keepAmount;
                            if (amountToChangeTo < 0) amountToChangeTo = 0;
                            document.getElementById("chosenpostitem-amount").value = amountToChangeTo;
                            if (keepAmount !== undefined) {
                                var keepAmountTextInner = "<br>Keep: " + numberWithCommas(keepAmount) + " | Total: " + numberWithCommas(window[keepAmountChosenItem]) + " | <input type='button' value='All' onclick='keepAmountSetMax();'/>";
                                if (keepAmountText.innerHTML != keepAmountTextInner) {
                                    keepAmountText.innerHTML = keepAmountTextInner;
                                }
                            }
                            if (!cpiPostString.includes("modifyKeepList")) {
                                cpiPostString = "modifyKeepList('" + keepAmountChosenItem + "');" + cpiPostString;
                                document.getElementById("cpi-post").setAttribute("onclick", cpiPostString);
                            }
                            let cpiCurrentModify = cpiPostString.substring(cpiPostString.indexOf("modifyKeepList"), cpiPostString.indexOf(";") + 1);
                            let cpiExpectedModify = "modifyKeepList('" + keepAmountChosenItem + "');";
                            if (cpiCurrentModify != cpiExpectedModify) {
                                cpiPostString = cpiPostString.replace(cpiCurrentModify, cpiExpectedModify);
                                document.getElementById("cpi-post").setAttribute("onclick", cpiPostString);
                            }
                        }
                    }
                    cpi_itemName = document.getElementById("chosenpostitem-itemName").value;
                    let itemPrice = numberWithCommas(document.getElementById("chosenpostitem-price").value);
                    if (document.getElementById("chosenpostitem-price").value != itemPrice) {
                        document.getElementById("chosenpostitem-price").value = itemPrice;
                    }
                    let itemAmount = numberWithCommas(document.getElementById("chosenpostitem-amount").value);
                    if (document.getElementById("chosenpostitem-amount").value != itemAmount) {
                        document.getElementById("chosenpostitem-amount").value = itemAmount;
                    }
                }
                let totalPrice = parseInt(numberWithoutCommas(document.getElementById("chosenpostitem-amount").value)) * parseInt(numberWithoutCommas(document.getElementById("chosenpostitem-price").value));
                if (isNaN(totalPrice)) totalPrice = "";
                if (cpi_totalPrice != totalPrice) {
                    chosenpostitem_total();
                }
            } else if (document.getElementById("dialogue-market-chosenpostitem").parentNode.style.display == "none") {
                if (cpi_itemName !== "") {
                    cpi_itemName = "";
                }
                if (document.getElementById("chosenpostitem-price").value !== "") {
                    document.getElementById("chosenpostitem-price").value = "";
                }
                if (document.getElementById("chosenpostitem-itemName").value !== "") {
                    document.getElementById("chosenpostitem-itemName").value = "";
                }
            }
        }

        function market_slots() {
            for (let i = 1; i <= arrMarketSlots.length; i++) {
                if (parseInt(document.getElementById("market-slot-" + i + "-collect").innerHTML) > 0 && ms_collect_repeat[i]) {
                    ms_collect_repeat[i] = false;
                    document.getElementById("market-slot-" + i + "-collect").parentNode.style.boxShadow = "0 0 30px 3px rgba(255, 0, 0, 1) inset";
                    document.getElementById("market-slot-" + i + "-collect").parentNode.style.transition = "box-shadow 0.5s ease-in-out";
                    setTimeout(function() {
                        document.getElementById("market-slot-" + i + "-collect").parentNode.style.boxShadow = "0 0 30px 3px rgba(255, 0, 0, 0) inset";
                        document.getElementById("market-slot-" + i + "-collect").parentNode.style.transition = "box-shadow 0.5s ease-in-out";
                        setTimeout(function() {
                            ms_collect_repeat[i] = true;
                        }, 500);
                    }, 500);
                }
                let marketSlotPrice = document.getElementById("market-slot-" + i + "-price").innerHTML;
                if (marketSlotPrice.includes(" ")) {
                    marketSlotPrice = document.getElementById("market-slot-" + i + "-price").innerHTML.substr(0, document.getElementById("market-slot-" + i + "-price").innerHTML.indexOf(" "));
                }
                if (document.getElementById("market-slot-" + i + "-price").innerHTML != numberWithCommas(marketSlotPrice)) {
                    document.getElementById("market-slot-" + i + "-price").innerHTML = numberWithCommas(marketSlotPrice);
                }
                if (document.getElementById("market-slot-" + i + "-amount").innerHTML != numberWithCommas(document.getElementById("market-slot-" + i + "-amount").innerHTML)) {
                    document.getElementById("market-slot-" + i + "-amount").innerHTML = numberWithCommas(document.getElementById("market-slot-" + i + "-amount").innerHTML);
                }
                if (document.getElementById("market-slot-" + i + "-collect").innerHTML != numberWithCommas(document.getElementById("market-slot-" + i + "-collect").innerHTML)) {
                    document.getElementById("market-slot-" + i + "-collect").innerHTML = numberWithCommas(document.getElementById("market-slot-" + i + "-collect").innerHTML);
                }
            }
        }

        function brewingMaxPlaceholder() {
            if (brewingPlaceholder) {
                if ((ph_brewing_repeat || ph_brewing_cur_potion != document.getElementById('dialogue-potion-chosen').value) && document.getElementById("dialogue-brewing").parentNode.style.display != "none" && document.getElementById('dialogue-potion-chosen').value !== "") {
                    ph_brewing_repeat = false;
                    ph_brewing_cur_potion = document.getElementById('dialogue-potion-chosen').value;
                    document.getElementById('dialogue-brewing-input').value = "";
                    var placeholderBrewing, vialRequired, placeholderBrewingText;
                    for (var i = 0; i < brewingRecipes[ph_brewing_cur_potion].recipe.length; i++) {
                        var maxAmount = Math.floor(window[brewingRecipes[ph_brewing_cur_potion].recipe[i]] / brewingRecipes[ph_brewing_cur_potion].recipeCost[i]);
                        if (i === 0 || maxAmount < placeholderBrewing) {
                            placeholderBrewing = maxAmount;
                        }
                    }
                    let arrVials = ["stardustPotion", "treePotion", "seedPotion", "smeltingPotion", "oilPotion", "barPotion", "superStardustPotion", "essencePotion", "combatCooldownPotion", "farmingSpeedPotion"];
                    let arrLargeVials = ["stargemPotion", "superEssencePotion", "superOilPotion", "stardustCrystalPotion", "superTreePotion", "superCombatCooldownPotion"];
                    let arrHugeVials = ["superCompostPotion"];
                    if (arrVials.indexOf(ph_brewing_cur_potion) >= 0) {
                        vialRequired = "vialOfWater";
                    } else if (arrLargeVials.indexOf(ph_brewing_cur_potion) >= 0) {
                        vialRequired = "largeVialOfWater";
                    } else if (arrHugeVials.indexOf(ph_brewing_cur_potion) >= 0) {
                        vialRequired = "hugeVialOfWater";
                    } else vialRequired = "error";
                    if (vialRequired != "error" && Math.floor(window[vialRequired] / placeholderBrewing) < 1) {
                        let placeholderBrewing2 = window[vialRequired];
                        placeholderBrewingText = "max: " + placeholderBrewing2 + ", need: +" + (placeholderBrewing - placeholderBrewing2) + " vials";
                    } else placeholderBrewingText = "max: " + placeholderBrewing;
                    if (placeholderBrewingText != document.getElementById("dialogue-brewing-input").getAttribute("placeholder")) {
                        document.getElementById("dialogue-brewing-input").setAttribute("placeholder", placeholderBrewingText);
                    }
                } else if (document.getElementById("dialogue-brewing").parentNode.style.display == "none") {
                    ph_brewing_repeat = true;
                }
            }
        }

        function craftingVialMaxPlaceholder() {
            if (craftingVialPlaceholder) {
                if ((ph_vial_repeat || ph_vial_cur_vial != document.getElementById("dialogue-multicraft-chosen").value) && document.getElementById("dialogue-multicraft").parentNode.style.display != "none" && document.getElementById("dialogue-multicraft-chosen").value !== "") {
                    ph_vial_repeat = false;
                    ph_vial_cur_vial = document.getElementById("dialogue-multicraft-chosen").value;
                    document.getElementById('dialogue-multicraft-input').value = "";
                    var glassRequired;
                    if (ph_vial_cur_vial == "vialOfWater") {
                        glassRequired = document.getElementById("recipe-cost-vialOfWater-0").innerHTML;
                    } else if (ph_vial_cur_vial == "largeVialOfWater") {
                        glassRequired = document.getElementById("recipe-cost-largeVialOfWater-0").innerHTML;
                    } else if (ph_vial_cur_vial == "hugeVialOfWater") {
                        glassRequired = document.getElementById("recipe-cost-hugeVialOfWater-0").innerHTML;
                    }
                    var maxAmount = Math.floor(glass / glassRequired);
                    var placeholderVialText = "max: " + maxAmount;
                    if (placeholderVialText != document.getElementById("dialogue-multicraft-input").getAttribute("placeholder")) {
                        document.getElementById("dialogue-multicraft-input").setAttribute("placeholder", placeholderVialText);
                    }
                } else if (document.getElementById("dialogue-multicraft").parentNode.style.display == "none") {
                    ph_vial_repeat = true;
                }
            }
        }

        function getLowestMarketPrice(item) {
            item = itemNameFix(item);
            if (arrMarketItems[item]) { // if we have seen item
                return arrMarketItems[item][0].price;
            }
            return 0;
        }
        window.resetOreAverage = function() {
            currentOreReset = true;
        };

        function oreAverageMain() {
            if (oreAverageOn && oreAverageElement.style.display !== "") {
                oreAverageElement.style.display = "";
            } else if (!oreAverageOn && oreAverageElement.style.display != "none") {
                oreAverageElement.style.display = "none";
            }
            var i, keys = Object.keys(minedOres);
            if (currentOreReset) {
                keys.forEach((key) => {
                    minedOres[key].startAmount = window[key];
                });
                oreAverageStartTicks = playtime;
                currentOreReset = false;
            }
            oreAverageElapsedTicks = playtime - oreAverageStartTicks;
            var oreAverageInnerText = "";
            oreAverageInnerText += "<br><span style='color:red'>Note: Table will be inaccurate if you change the number of ores you have. Avoid: trading ores, turning machinery on/off, opening lootbags, smelting bars. Use reset button after these changes for accurate results.</span><br><br>";
            oreAverageInnerText += "<button onclick='resetOreAverage();'>Reset</button><br><br>";
            oreAverageInnerText += "<span style='color:white'>Elapsed ticks: " + oreAverageElapsedTicks + "<br><br>";
            oreAverageInnerText += "Current config:</span><br><br>";
            oreAverageInnerText += "<table style='text-align:right;color:white;width:16.66%;border-style:solid;border-color:white;border-width:1px;'>";
            oreAverageInnerText += "<tr><td>miners:</td><td>" + miner + "</td></tr>";
            oreAverageInnerText += "<tr><td>drills:</td><td>" + drillsOn + "</td></tr>";
            oreAverageInnerText += "<tr><td>crushers:</td><td>" + crushersOn + "</td></tr>";
            oreAverageInnerText += "<tr><td>giant drills:</td><td>" + giantDrillsOn + "</td></tr>";
            oreAverageInnerText += "<tr><td>excavators:</td><td>" + excavatorsOn + "</td></tr>";
            oreAverageInnerText += "<tr><td>giant excavators:</td><td>" + giantExcavatorsOn + "</td></tr>";
            oreAverageInnerText += "</table><br>";
            oreAverageInnerText += "<table class='top-bar' style='text-align:right'>";
            oreAverageInnerText += "<th>Ore</th><th>Ore price</th><th>Ores mined</th><th>Ores/tick</th><th>Coins/tick</th><th>Ores/day</th><th>Coins/day</th>";
            for (i = 6; i < Object.keys(minedOres).length; i++) {
                if (Object.keys(arrMarketItems).length > 1) {
                    minedOres[Object.keys(minedOres)[i]].price = getLowestMarketPrice(Object.keys(minedOres)[i]); // set high tier ore price
                }
            }
            var oreTickTotal = 0,
                coinTickTotal = 0,
                oreDayTotal = 0,
                coinDayTotal = 0,
                oresMinedTotal = 0;
            keys.forEach((key) => {
                minedOres[key].currentAmount = window[key];
                var oreName = key;
                var orePrice = minedOres[key].price;
                var oresMined = minedOres[key].currentAmount - minedOres[key].startAmount;
                minedOres[key].oreTick = ((minedOres[key].currentAmount - minedOres[key].startAmount) / oreAverageElapsedTicks);
                minedOres[key].coinTick = (minedOres[key].oreTick * minedOres[key].price);
                minedOres[key].oreDay = (((minedOres[key].currentAmount - minedOres[key].startAmount) / oreAverageElapsedTicks) * 86400);
                minedOres[key].coinDay = (minedOres[key].coinTick * 86400);
                oreAverageInnerText += "<tr><td>" + oreName + "</td>";
                oreAverageInnerText += "<td>" + numberWithCommas(orePrice) + "</td>";
                oreAverageInnerText += "<td>" + numberWithCommas(oresMined) + "</td>";
                if (Object.keys(minedOres).indexOf(key) <= 7) { // if ore is marble or lower
                    oreAverageInnerText += "<td>" + minedOres[key].oreTick.toFixed(3) + "</td>";
                } else oreAverageInnerText += "<td>" + Number(minedOres[key].oreTick).toFixed(6) + "</td>";
                oreAverageInnerText += "<td>" + minedOres[key].coinTick.toFixed(2) + "</td>";
                if (Object.keys(minedOres).indexOf(key) <= 7) { // if ore is marble or lower
                    oreAverageInnerText += "<td>" + numberWithCommas(parseInt(minedOres[key].oreDay)) + "</td>";
                } else oreAverageInnerText += "<td>" + numberWithCommas(Number(minedOres[key].oreDay).toFixed(2)) + "</td>";
                oreAverageInnerText += "<td>" + numberWithCommas(parseInt(minedOres[key].coinDay)) + "</td></tr>";
                oresMinedTotal += parseInt(oresMined);
                oreTickTotal += parseFloat(minedOres[key].oreTick.toFixed(2));
                coinTickTotal += parseFloat(minedOres[key].coinTick.toFixed(2));
                oreDayTotal += parseInt(minedOres[key].oreDay);
                coinDayTotal += parseInt(minedOres[key].coinDay);
            });
            oreAverageInnerText += "<tr><td>&nbsp;</td></tr><tr><td>Total:</td><td></td><td>" + numberWithCommas(oresMinedTotal) + "</td><td>" + numberWithCommas(oreTickTotal.toFixed(2)) + "</td><td>" + numberWithCommas(coinTickTotal.toFixed(2)) + "</td><td>" + numberWithCommas(oreDayTotal) + "</td><td>" + numberWithCommas(coinDayTotal) + "</td></tr>";
            oreAverageInnerText += "</table>";
            oreAverageElement.innerHTML = oreAverageInnerText;
        }
        window.bfmCommaFix = function() {
            document.getElementById('buyFromMarket-input').value = numberWithoutCommas(document.getElementById('buyFromMarket-input').value);
            document.getElementById('buyFromMarket-price').innerHTML = numberWithoutCommas(document.getElementById('buyFromMarket-price').innerHTML);
        };

        function dialogue_buyFromMarket() {
            //comma fix for price each
            if (document.getElementById("dialogue-buyFromMarket").parentNode.style.display === "" && document.getElementById("buyFromMarket-price").innerHTML != numberWithCommas(document.getElementById("buyFromMarket-price").innerHTML)) {
                document.getElementById("buyFromMarket-price").innerHTML = numberWithCommas(document.getElementById("buyFromMarket-price").innerHTML);
            }
            //comma fix for enter amount
            if (document.getElementById('buyFromMarket-input').value != numberWithCommas(document.getElementById('buyFromMarket-input').value)) {
                document.getElementById('buyFromMarket-input').value = numberWithCommas(document.getElementById('buyFromMarket-input').value);
            }
            //set price to no commas onclick Buy
            var bfmBuyString = document.getElementById('buyFromMarket-buy').getAttribute("onclick");
            if (!bfmBuyString.includes("bfmCommaFix();")) {
                bfmBuyString = "bfmCommaFix();" + bfmBuyString;
                document.getElementById("buyFromMarket-buy").setAttribute("onclick", bfmBuyString);
            }
            //change Are you sure you want to spend... price to comma format
            if (document.getElementById("dialogue-confirm-cmd").parentNode.parentNode.style.display === "" && document.getElementById("dialogue-confirm-cmd").value.includes("MARKET_BUY=")) {
                let priceString = document.getElementById("dialogue-confirm-text").innerHTML;
                let price = priceString.substring(priceString.indexOf("<img src=\"images/coins.png\" class=\"image-icon-20\">") + 51, priceString.indexOf(" on this purchase"));
                if (document.getElementById("dialogue-confirm-text").innerHTML != priceString.replace(price, numberWithCommas(price))) {
                    document.getElementById("dialogue-confirm-text").innerHTML = priceString.replace(price, numberWithCommas(price));
                }
            }
        }

        function persistentInterval() {
            let minigameLastPingReceived = new Date().getTime() - pingTimeStart;
            if (minigameLastPingReceived >= 10000 && !pingSent && minigameMyStatus == "ingame" && minigameOpp) {
                pingSent = true;
                minigamePing(minigameOpp, minigameGame);
                setTimeout(function() {
                    if (pingSent) {
                        tmgReset();
                    }
                }, 5000);
            }
            if (marketOn) {
                //dh2fixed input box type=number fix
                if (document.getElementById("chosenpostitem-amount").getAttribute("type") != "text") {
                    document.getElementById("chosenpostitem-amount").setAttribute("type","text");
                }
                if (document.getElementById("chosenpostitem-price").getAttribute("type") != "text") {
                    document.getElementById("chosenpostitem-price").setAttribute("type","text");
                }
                if (nextTick()) {
                    oreAverageMain();
                    if (treasureMap > 0 && document.getElementById("mapSpan").style.display !== "") {
                        document.getElementById("mapSpan").style.display = "";
                    } else if (treasureMap === 0 && document.getElementById("mapSpan").style.display != "none") {
                        document.getElementById("mapSpan").style.display = "none";
                    }
                    //marketCancelCooldownSlots overwrite Cancel with countdown
                    let arrMarketCancelCooldownSlots = [marketCancelCooldownSlot1, marketCancelCooldownSlot2, marketCancelCooldownSlot3];
                    for (let i = 0; i < arrMarketCancelCooldownSlots.length; i++) {
                        if (arrMarketCancelCooldownSlots[i] === 0) {
                            if (document.getElementById("market-slot-" + (i + 1) + "-cancel-btn").innerHTML != "Cancel") {
                                document.getElementById("market-slot-" + (i + 1) + "-cancel-btn").innerHTML = "Cancel";
                            }
                        } else if (document.getElementById("market-slot-" + (i + 1) + "-cancel-btn").innerHTML != arrMarketCancelCooldownSlots[i]) {
                            document.getElementById("market-slot-" + (i + 1) + "-cancel-btn").innerHTML = arrMarketCancelCooldownSlots[i];
                        }
                    }
                }
                dialogue_market_chosenpostitem();
                dialogue_buyFromMarket();
                refreshMarketAfterBuyingItem();
                market_slots();
                brewingMaxPlaceholder();
                craftingVialMaxPlaceholder();
            }
            if (displayNotificationTreasureMap && treasureMap > 0 && document.getElementById("tedmarket-notif-map").style.display != "inline-block") {
                document.getElementById("tedmarket-notif-map").style.display = "inline-block";
            } else if (treasureMap === 0 && document.getElementById("tedmarket-notif-map").style.display != "none") {
                document.getElementById("tedmarket-notif-map").style.display = "none";
            }
            if (allowedBrowserNotifications && notifyWindChange) {
                if (windLastCheck == -1) {
                    windLastCheck = sailBoatWindGlobal;
                } else if (windLastCheck != sailBoatWindGlobal) {
                    windLastCheck = sailBoatWindGlobal;
                    let windLevel = "";
                    switch (windLastCheck) {
                        case 0:
                            windLevel = "no wind";
                            break;
                        case 1:
                            windLevel = "low wind";
                            break;
                        case 2:
                            windLevel = "medium wind";
                            break;
                        case 3:
                            windLevel = "high wind";
                            break;
                        case 4:
                            windLevel = "very high wind";
                            break;
                    }
                    new Notification("The wind level has changed!", {
                        body: "The wind level is now: " + windLevel,
                        icon: "images/sailBoat.png"
                    });
                }
            }
        }
        window.setLastBrowsedItem = function(item) {
            lastBrowsedItem = item;
        };

        function addLastBrowsedItemOnclick() {
            for (var i = 0; i < document.getElementById("dialogue-market-items-area").childNodes.length; i++) {
                for (var j = 0; j < document.getElementById("dialogue-market-items-area").childNodes[i].children.length; j++) {
                    var oldOnclick = document.getElementById("dialogue-market-items-area").childNodes[i].children[j].getAttribute("onclick");
                    document.getElementById("dialogue-market-items-area").childNodes[i].children[j].setAttribute("onclick", "setLastBrowsedItem('" + document.getElementById('dialogue-market-items-area').childNodes[i].children[j].getAttribute('data-item-name') + "');" + oldOnclick);
                }
            }
        }
        var objEnergy = {
            shrimp: 50,
            sardine: 400,
            tuna: 1000,
            swordfish: 7500,
            shark: 20000,
        };
        var objHeat = {
            logs: 1,
            oakLogs: 2,
            willowLogs: 5,
            mapleLogs: 10,
            stardustLogs: 20,
            essenceLogs: 30,
        };
        var objBonemeal = {
            bones: 1,
            ashes: 2,
            iceBones: 3,
        };

        function otherSettingsRunOnce() {
            //send market data to developer
            addWebsocketHook();
            //press enter in input box when buying item to progress dialogue and go to confirm
            document.getElementById("buyFromMarket-input").setAttribute("onkeydown", "if (event.keyCode == 13) { document.getElementById('buyFromMarket-buy').click(); }");
            //add undercut buttons to dialogue-market-chosenpostitem
            if (useUndercutBox) {
                var arrUndercut = ["2", "0.25%", "0.5%", "1%", "2%", "5%", "10%", "cheapest", "min", "match", "max"];
                var undercutBox = document.createElement("div");
                undercutBox.setAttribute("class", "basic-smallbox");
                undercutBox.setAttribute("id", "undercutBox");
                undercutBox.setAttribute("style", "text-align:center");
                document.getElementById("dialogue-market-chosenpostitem").insertBefore(undercutBox, document.getElementById("dialogue-market-chosenpostitem").getElementsByTagName("span")[0].nextSibling);
                document.getElementById("dialogue-market-chosenpostitem").insertBefore(document.createElement("br"), document.getElementById("dialogue-market-chosenpostitem").getElementsByTagName("span")[0].nextSibling);
                document.getElementById("dialogue-market-chosenpostitem").insertBefore(document.createElement("br"), document.getElementById("dialogue-market-chosenpostitem").getElementsByTagName("span")[0].nextSibling);
                window.setUndercut = function(undercutAmount, btn) {
                    var undercutValue;
                    var currentPrice = Math.ceil((numberWithoutCommas(document.getElementById("chosenpostitem-upper").innerHTML) + numberWithoutCommas(document.getElementById("chosenpostitem-lower").innerHTML)) / 2);
                    if (undercutAmount == "cheapest") {
                        let itemName = itemNameFix(lastBrowsedItem);
                        var cheapest, price = null;
                        if (objEnergy[itemName]) {
                            for (let key in objEnergy) {
                                if (Object.keys(arrMarketItems).length <= 1) {
                                    document.getElementById("chosenpostitem-price").value = "Search all first";
                                    break;
                                }
                                if (arrMarketItems[key] && arrMarketItems[key][0].price) {
                                    if (arrMarketItems[key][0].price / objEnergy[key] < cheapest || typeof(cheapest) == "undefined") {
                                        cheapest = arrMarketItems[key][0].price / objEnergy[key];
                                        price = Math.ceil(cheapest * objEnergy[itemName]) - 2;
                                    }
                                }
                            }
                        } else if (objHeat[itemName]) {
                            var avgSdValue, avgFragValue;
                            for (let key in objHeat) {
                                if (Object.keys(arrMarketItems).length <= 1) {
                                    document.getElementById("chosenpostitem-price").value = "Search all first";
                                    break;
                                }
                                if (arrMarketItems[key] && arrMarketItems[key][0].price && key == "stardustLogs") {
                                    if (arrMarketItems.stardust[0] && arrMarketItems.stardustLogs[0]) {
                                        var stardustPrice;
                                        if (arrMarketItems.stardust && arrMarketItems.stardust[0]) {
                                            let count = 0,
                                                itemPrice = 0;
                                            for (let i = 0; i < arrMarketItems.stardust.length; i++) {
                                                count++;
                                                itemPrice += arrMarketItems.stardust[i].price;
                                            }
                                            stardustPrice = Math.ceil(itemPrice / count);
                                        } else continue;
                                        avgSdValue = ((2500 + 10000) / 2) * (stardustPrice - 1); //sd value per log at average-1 when selling
                                        let sdLogHeatCost = Math.ceil(((arrMarketItems.stardustLogs[0].price - avgSdValue) / objHeat.stardustLogs));
                                        if (sdLogHeatCost < cheapest) {
                                            cheapest = sdLogHeatCost;
                                        }
                                    }
                                } else if (arrMarketItems[key] && arrMarketItems[key][0].price && key == "essenceLogs") {
                                    if (arrMarketItems.essence[0]) {
                                        avgFragValue = ((1 + 14) / 200) * (arrMarketItems.essence[0].price); //ess at current low price when selling
                                        let essLogHeatCost = Math.ceil((arrMarketItems.essenceLogs[0].price - avgFragValue) / objHeat.essenceLogs);
                                        if (essLogHeatCost < cheapest) {
                                            cheapest = essLogHeatCost;
                                        }
                                    }
                                } else if (arrMarketItems[key] && arrMarketItems[key][0].price) {
                                    if (arrMarketItems[key][0].price / objHeat[key] < cheapest || typeof(cheapest) == "undefined") {
                                        cheapest = arrMarketItems[key][0].price / objHeat[key];
                                    }
                                }
                            }
                            if (typeof(cheapest) !== "undefined") {
                                if (itemName == "stardustLogs") {
                                    if (arrMarketItems.stardustLogs && arrMarketItems.stardustLogs[0].price) {
                                        price = (cheapest - 1) * objHeat[itemName] + avgSdValue;
                                    }
                                } else if (itemName == "essenceLogs") {
                                    if (arrMarketItems.essenceLogs && arrMarketItems.essenceLogs[0].price) {
                                        price = (cheapest - 1) * objHeat[itemName] + avgFragValue;
                                    }
                                } else {
                                    price = Math.ceil(cheapest * objHeat[itemName]) - 2;
                                }
                            }
                        } else if (objBonemeal[itemName]) {
                            for (let key in objBonemeal) {
                                if (Object.keys(arrMarketItems).length <= 1) {
                                    document.getElementById("chosenpostitem-price").value = "Search all first";
                                    break;
                                }
                                if (arrMarketItems[key] && arrMarketItems[key][0].price) {
                                    if (arrMarketItems[key][0].price / objBonemeal[key] < cheapest || typeof(cheapest) == "undefined") {
                                        cheapest = arrMarketItems[key][0].price / objBonemeal[key];
                                        price = Math.ceil(cheapest * objBonemeal[itemName]) - 2;
                                    }
                                }
                            }
                        }
                        if (typeof(cheapest) !== "undefined") {
                            undercutValue = price;
                        } else undercutValue = null;
                    } else if (undercutAmount == "min") {
                        undercutValue = numberWithoutCommas(document.getElementById("chosenpostitem-lower").innerHTML);
                    } else if (undercutAmount == "match") {
                        undercutValue = currentPrice;
                    } else if (undercutAmount == "max") {
                        undercutValue = numberWithoutCommas(document.getElementById("chosenpostitem-upper").innerHTML);
                    } else if (undercutAmount.indexOf("%") > -1) {
                        undercutValue = currentPrice * ((100 - undercutAmount.replace(/%/g, "")) / 100);
                    } else {
                        undercutValue = currentPrice - undercutAmount;
                    }
                    if (undercutValue !== null && typeof(undercutValue) !== "undefined") {
                        if (undercutValue < numberWithoutCommas(document.getElementById("chosenpostitem-lower").innerHTML)) {
                            document.getElementById("chosenpostitem-price").value = numberWithCommas(document.getElementById("chosenpostitem-lower").innerHTML);
                        } else if (undercutValue > numberWithoutCommas(document.getElementById("chosenpostitem-upper").innerHTML)) {
                            document.getElementById("chosenpostitem-price").value = numberWithCommas(document.getElementById("chosenpostitem-upper").innerHTML);
                        } else {
                            document.getElementById("chosenpostitem-price").value = numberWithCommas(Math.ceil(undercutValue));
                        }
                    } else if (undercutValue === null || typeof(undercutValue) == "undefined") {
                        disableBtn(btn, 1000);
                    }
                };
                undercutBoxText.setAttribute("style", "text-align:center");
                undercutBox.append(undercutBoxText);
                for (var i = 0; i < arrUndercut.length; i++) {
                    var undercutBtn = document.createElement("button");
                    undercutBtn.setAttribute("onclick", "setUndercut('" + arrUndercut[i] + "',this);");
                    if (arrUndercut[i] == "cheapest") {
                        undercutBtn.innerHTML = "<img class='image-icon-20' src='images/icons/fire.png'><img class='image-icon-20' src='images/steak.png'><img class='image-icon-20' src='images/filledBonemealBin.png'>";
                        undercutBtn.title = "Undercut cheapest heat/energy/bonemeal";
                    } else undercutBtn.append(arrUndercut[i]);
                    undercutBox.append(undercutBtn);
                    if (arrUndercut[i] == "cheapest") {
                        document.getElementById("undercutBox").insertBefore(document.createElement("br"), document.getElementById("undercutBox").lastChild);
                        document.getElementById("undercutBox").insertBefore(document.createElement("br"), document.getElementById("undercutBox").lastChild);
                    }
                    document.getElementById("undercutBox").append(document.createTextNode("\u00a0")); //nbsp
                }
                // remove unnecessary multiple BR's that smitty left behind in dialogue-market-chosenpostitem
                var el = document.getElementById("undercutBox").nextElementSibling;
                while (el.nextElementSibling && el.tagName !== undefined && el.tagName != "BR") {
                    el = el.nextElementSibling;
                }
                if (el.tagName == "BR" && el.nextElementSibling && el.nextElementSibling.tagName == "BR") {
                    while (el.nextElementSibling.tagName == "BR") {
                        el.nextElementSibling.parentNode.removeChild(el.nextElementSibling);
                    }
                }
            }
            // set global variable lastBrowsedItem to last browsed item via onclick
            addLastBrowsedItemOnclick();
            //add maps to noficiation area
            var mapNotifWrapper = document.createElement("span");
            mapNotifWrapper.setAttribute("class", "notif-box");
            mapNotifWrapper.setAttribute("style", "display:none;background: linear-gradient(black, gold);");
            mapNotifWrapper.setAttribute("id", "tedmarket-notif-map");
            mapNotifWrapper.setAttribute("onclick", "clicksTreasureMap();");
            var mapNotif = document.createElement("img");
            mapNotif.setAttribute("src", "images/treasureMap.png");
            mapNotif.setAttribute("class", "image-icon-50");
            mapNotifWrapper.append(mapNotif);
            document.getElementById("notifaction-area").prepend(mapNotifWrapper);
            //add keepAmount to dialogue-market-chosenpostitem
            if (useKeepAmount) {
                keepAmountText.innerHTML = "Keep: error";
                document.getElementById("chosenpostitem-amount").parentNode.insertBefore(keepAmountText, document.getElementById("chosenpostitem-amount").nextSibling);
                document.getElementById("chosenpostitem-amount").parentNode.insertBefore(document.createElement("br"), document.getElementById("chosenpostitem-amount").nextSibling);
                //document.getElementById("chosenpostitem-amount").parentNode.insertBefore(document.createTextNode('\u00a0'),document.getElementById("chosenpostitem-amount").nextSibling);
            }
            //fix collect button padding to allow 123,456,789 format
            for (let i = 1; i <= arrMarketSlots.length; i++) {
                document.getElementById("market-slot-" + i + "-collect-btn").style.padding = "10px 5px";
            }
            //add tooltips to items that do not have a tooltip
            function tedTooltips() {
                if (!document.getElementById("tooltip-stone")) { // don't add tooltips until default tooltips are loaded
                    setTimeout(function() {
                        tedTooltips();
                    }, 100);
                } else {
                    var tKeys = Object.keys(jsTradableItems);
                    tKeys.forEach((key) => {
                        if (key == "emptyChisel") return;
                        if (!document.getElementById("tooltip-" + key)) {
                            if (document.getElementById("item-box-" + key)) {
                                let newTooltip = document.createElement("div");
                                document.getElementById("tooltip-list").append(newTooltip);
                                newTooltip.outerHTML = "<div id='tooltip-" + key + "' style='display:none;'> <span style='font-size:20pt'>" + getItemName(key) + "</span><br><br></div>";
                                document.getElementById("item-box-" + key).removeAttribute("title");
                                document.getElementById("item-box-" + key).setAttribute("data-tooltip-id", "tooltip-" + key);
                            }
                        }
                    });
                    loadTooltips();
                }
            }
            tedTooltips();
            tradeHistory();
            document.body.append(oreAverageElement);
            calculateFlips();
            sortTradeHistory(sortByTH);
            //add an id to Post button in dialogue-market-chosenpostitem
            for (let i = 0; i < document.getElementById("dialogue-market-chosenpostitem").children.length; i++) {
                if (document.getElementById("dialogue-market-chosenpostitem").children[i].defaultValue == "Post") {
                    document.getElementById("dialogue-market-chosenpostitem").children[i].setAttribute("id", "cpi-post");
                    break;
                }
            }
            //add an id to Buy button in buyFromMarket-dialogue
            for (let i = 0; i < document.getElementById("dialogue-buyFromMarket").children.length; i++) {
                if (document.getElementById("dialogue-buyFromMarket").children[i].defaultValue == "Buy") {
                    document.getElementById("dialogue-buyFromMarket").children[i].setAttribute("id", "buyFromMarket-buy");
                }
            }
            //add fixCpiNumbers to convert commas to without commas on post
            var cpiPostString = document.getElementById("cpi-post").getAttribute("onclick");
            if (!cpiPostString.includes("fixCpiNumbers();")) {
                cpiPostString = "fixCpiNumbers();" + cpiPostString;
                document.getElementById("cpi-post").setAttribute("onclick", cpiPostString);
            }
            // show total price when posting an item
            if (document.getElementById("chosenpostitem-itemName").nextElementSibling && document.getElementById("chosenpostitem-itemName").nextElementSibling.className == "basic-smallbox") {
                let chosenpostitem_totalprice = document.createElement("span");
                chosenpostitem_totalprice.setAttribute("id", "chosenpostitem-totalprice");
                document.getElementById("chosenpostitem-itemName").nextElementSibling.append(chosenpostitem_totalprice);
            }
            window.chosenpostitem_total = function() {
                let totalPrice = parseInt(numberWithoutCommas(document.getElementById("chosenpostitem-amount").value)) * parseInt(numberWithoutCommas(document.getElementById("chosenpostitem-price").value));
                if (isNaN(totalPrice)) totalPrice = "";
                cpi_totalPrice = totalPrice;
                document.getElementById("chosenpostitem-totalprice").innerHTML = "<br><br>Total Price: " + numberWithCommas(totalPrice);
            };
            document.getElementById("chosenpostitem-amount").setAttribute("onchange", "chosenpostitem_total();");
            document.getElementById("chosenpostitem-amount").setAttribute("onkeypress", "this.onchange();");
            document.getElementById("chosenpostitem-amount").setAttribute("onpaste", "this.onchange();");
            document.getElementById("chosenpostitem-amount").setAttribute("oninput", "this.onchange();");
            document.getElementById("chosenpostitem-price").setAttribute("onchange", "chosenpostitem_total();");
            document.getElementById("chosenpostitem-price").setAttribute("onkeypress", "this.onchange();");
            document.getElementById("chosenpostitem-price").setAttribute("onpaste", "this.onchange();");
            document.getElementById("chosenpostitem-price").setAttribute("oninput", "this.onchange();");
            //browser notification permission check
            if (!("Notification" in window)) {
                console.log("This browser does not support system notifications");
            } else if (Notification.permission == "granted") { // Let's check whether notification permissions have already been granted
                allowedBrowserNotifications = true;
            } else if (Notification.permission != 'denied') { // Otherwise, we need to ask the user for permission
                Notification.requestPermission(function(permission) {
                    if (permission == "granted") {
                        allowedBrowserNotifications = true;
                    } else {
                        allowedBrowserNotifications = false;
                    }
                });
            } else {
                allowedBrowserNotifications = false;
            }
            /*// add poker in skill tab
			let pokerTab = document.createElement("td");
			let marketTab = document.getElementById("tab-container-bar-shop");
			pokerTab.setAttribute("id","tab-container-bar-poker");
			pokerTab.setAttribute("onclick","openTab('poker')");
			pokerTab.setAttribute("style", "background: linear-gradient(black, grey);");
			let pokerImg = document.createElement("img");
			pokerImg.setAttribute("class", "image-icon-50");
			pokerImg.setAttribute("src", "http://i.imgur.com/Yyi11pG.gif");
			let pokerSpan = document.createElement("span");
			pokerSpan.setAttribute("id","tab-container-bar-poker-label");
			pokerSpan.append("Poker");
			document.getElementById("tab-container-bar-shop").parentNode.append(pokerTab);
			pokerTab.append(pokerImg);
			pokerTab.append(pokerSpan);
			let pokerTabContainer = document.createElement("div");
			pokerTabContainer.setAttribute("class","tab-container");
			pokerTabContainer.setAttribute("id","tab-container-poker");
			pokerTabContainer.setAttribute("style","display:none");
			$(pokerTabContainer).insertAfter(document.getElementById("tab-container-shop")); */
        }
        tedMarketUiSettings();
        drawButtons();
        marketMain();
        alterMarketSlots();
        otherSettingsRunOnce();
        minigamesInit();
        setInterval(persistentInterval, 10);
        setInterval(tmg_pokerConnectionHandler, 1000);
    }
});