// ==UserScript==
// @name         Ted's market UI FIXED
// @namespace    Ted's market UI FIXED
// @version      1.474
// @description  Ted's Diamond Hunt 2 custom market user interface
// @author       ted120
// @include      *.diamondhunt.co/*
// @match        https://www.diamondhunt.co
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39516/Ted%27s%20market%20UI%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/39516/Ted%27s%20market%20UI%20FIXED.meta.js
// ==/UserScript==
var LOCALE = 'en-US';
var updateNews = "Fixed trade history button that was not aligned properly. Removed the Price history graph button (the website is dead so the button serves no purpose). Use the price history from local data from dh2 fixed instead.<br><br>";
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
            /*             if (expectedVersion === null) {
                console.log("Could not read expected version, skipping update check");
            } else if (parseInt(currentVersion.replace(/\./g, '')) < parseInt(expectedVersion.replace(/\./g, ''))) {
                if (window.confirm("Ted's Market Script\n\nOutdated Version:\n" + currentVersion + " current\n" + expectedVersion + " expected\n\nOK: Open the script page to manually update\nCancel: Proceed with outdated version\n\nWhat's new?\n\n" + versionHistoryString)) {
                    window.location.href = "https://greasyfork.org/en/scripts/28422-ted-s-market-ui";
                }
            } */
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
                value: false
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
                value: false,
                alert: true,
            },
            useKeepAmount: {
                text: "Remember amount not to sell when posting an item?",
                value: false
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
        var stardustProfitGreenBox, superStardustProfitGreenBox, stargemProfitGreenBox;
        var brewingPlaceholder, craftingVialPlaceholder;
        var displayNotificationTreasureMap;


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
            brewingPlaceholder = tedStoredSettings.brewingPlaceholder.value;
            if (!brewingPlaceholder) document.getElementById("dialogue-brewing-input").removeAttribute("placeholder");
            craftingVialPlaceholder = tedStoredSettings.craftingVialPlaceholder.value;
            if (!craftingVialPlaceholder) document.getElementById("dialogue-multicraft-input").removeAttribute("placeholder");
            displayNotificationTreasureMap = tedStoredSettings.displayNotificationTreasureMap.value;
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
        var quickCalcStargemBoxShadow, quickCalcSuperStardustBoxShadow, quickCalcStardustBoxShadow, quickCalcTooltip = document.createElement("div");
        var quickCalcStargemString = "",
            quickCalcSuperStardustString = "",
            quickCalcStardustString = "";
        var searchAllDelay = 2500;
        var lastBrowsedItem = "Stardust";
        var oreAverageOn = false,
            gc_lastClicked,
            lastHover,
            browserMouseX = 0,
            browserMouseY = 0,
            pingTimeStart = 0,
            pingTime = 0,
            pingSent = false,
            windLastCheck = -1,
            notifyWindChange = true,
            allowedBrowserNotifications = false,
            oreAverageElement = document.createElement("div"),
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
            "Donor Coins",
            "Stardust",
            "Blood Diamond", "Diamond", "Ruby", "Emerald", "Sapphire",
            "Empty Chisel",
            "Red Axe Orb", "Red Fishing Bait Orb", "Red Magic Wand Orb", "Red Charcoal Factory Orb", "Red Mana Star Orb", "Red Combat Loot Orb", "Red Rocket Orb",
            "Green Rocket Orb", "Green Oil Factory Orb", "Green Oil Storage Orb", "Green Empowered Rock Orb", "Green Combat Orb", "Green Bow Orb", "Green Bonemeal Bin Orb", "Green Brewing Kit Orb",
            "Blue Axe Orb", "Blue Chisel Orb", "Blue Fishing Rod Orb", "Blue Hammer Orb", "Blue Meditation Orb", "Blue Oil Pipe Orb", "Blue Pickaxe Orb", "Blue Rake Orb", "Blue Shovel Orb", "Blue Trowel Orb",
            "Essence",
            "Cannon", "Cannon Barrel", "Cannon Stand", "Cannon Wheels",
            "Scythe", "Ghost Amulet",
            "Bow", "Ice Arrows", "Fire Arrows", "Arrows",
            "Skeleton Sword", "Skeleton Shield", "Bone Amulet",
            "Iron Dagger", "Stinger",
            "Runite Helmet Mould", "Runite Body Mould", "Runite Legs Mould", "Runite Gloves Mould", "Runite Boots Mould",
            "Promethium Helmet Mould", "Promethium Body Mould", "Promethium Legs Mould", "Promethium Gloves Mould", "Promethium Boots Mould",
            "Ancient Logs", "Strange Logs", "Essence Logs","Stardust Logs", "Maple Logs", "Willow Logs", "Oak Logs", "Logs",
            "Dark Bones", "Moon Bones", "Ice Bones", "Bones", "Ashes",
            "Ancient Tree Seeds", "Strange Leaf Tree Seeds", "Essence Tree Seeds","Stardust Tree Seeds", "Maple Tree Seeds", "Willow Tree Seeds", "Oak Tree Seeds", "Tree Seeds",
            "Striped Crystal Leaf Seeds", "Crystal Leaf Seeds", "Striped Gold Leaf Seeds", "Gold Leaf Seeds", "Lime Leaf Seeds", "Green Leaf Seeds", "Dotted Green Leaf Seeds", "Snapegrass Seeds", "Blewit Mushroom Seeds", "Red Mushroom Seeds",
            "Striped Crystal Leaf", "Crystal Leaf", "Striped Gold Leaf", "Gold Leaf", "Lime Leaf", "Green Leaf", "Dotted Green Leaf", "Snapegrass", "Blewit Mushroom", "Red Mushroom",
            "Stranger Leaf", "Strange Leaf", "Strange Purple Leaf", "Strange Pink Leaf", "Strange Blue Leaf", "Strange Yellow Leaf", "Strange Green Leaf",
            "Enchant Stargem Potion Spell Scroll", "Very High Wind Spell Scroll", "Empty Orb Spell Scroll", "Ghost Scan Spell Scroll", "Change Promethium Mould Scroll", "Change Runite Mould Scroll",
            "Rainbowfish", "Whale", "Shark", "Eel", "Swordfish", "Lobster", "Tuna", "Salmon", "Sardine", "Shrimp",
            "Fishing Bait","Raw Rainbowfish", "Raw Whale", "Raw Shark", "Raw Eel", "Raw Swordfish", "Raw Lobster", "Raw Tuna", "Raw Salmon", "Raw Sardine", "Raw Shrimp", "Wheat",
            "Runite Bar", "Promethium Bar", "Gold Bar", "Silver Bar", "Iron Bar", "Bronze Bar",
            "Runite", "Promethium", "Marble", "Quartz", "Glass", "Sand", "Stone", "Moonstone", "Mars Rock",
            "Bear Fur", "Bat Skin", "Snake Skin", "Thread"
        ];


        var coinImg = document.createElement("img");
        coinImg.setAttribute("src", "images/coins.png");
        coinImg.setAttribute("class", "image-icon-20");


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
            //zMarket.append(zMap);
            document.getElementById("game-div").appendChild(zMarket);
            document.getElementById("marketButton").addEventListener("click", marketButtonClickAction, false);
            document.getElementById("oreAverageButton").addEventListener("click", oreAverageButtonClickAction, false);
            if (marketOn) {
                document.getElementById("marketButton").innerHTML = "Ted's Market: ON";
            } else document.getElementById("marketButton").innerHTML = "Ted's Market: OFF";
            if (oreAverageOn) {
                document.getElementById("oreAverageButton").innerHTML = "oreAverageText: ON";
            } else document.getElementById("oreAverageButton").innerHTML = "oreAverageText: OFF";
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
            if ($("#tradeHistoryModalBody").next().text() == " Browse"){
                $("#tradeHistoryModalBody").after("<br/>");
            }
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
                ["Strange Logs", 30]
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

            var avgSdGainStardustPotion =        Math.floor( ((0 + 40) * (1 + (achBrewingEasyCompleted * 0.05))) / 2);//per tick
            var avgSdGainSuperStardustPotion =  Math.floor( ((0 + 220) * (1 + (achBrewingEasyCompleted * 0.05))) / 2);// per tick

            var stardustPotionDuration = 		 Math.floor(300 * (1 + ((getLevel(brewingXp) / 100 * 0.2) * potionDurationModifier) ));
            var superStardustPotionDuration = 	 Math.floor(300 * (1 + ((getLevel(brewingXp) / 100 * 0.2) * potionDurationModifier) ));

            avgSdGainStardustPotion = avgSdGainStardustPotion * stardustPotionDuration;
            avgSdGainSuperStardustPotion = avgSdGainSuperStardustPotion * superStardustPotionDuration;


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

                //stargem

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

                /*
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
                    var essenceProfit = essencePotionAvgEssence * 1;
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
                    var essenceProfit24 = (24 * 60 * 60 / essencePotionDuration) * essencePotionAvgEssence * 1;
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
                */
                //Super Essence tooltip hover

                /*
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
                    var superEssenceProfit = superEssencePotionAvgEssence * 1;
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
                    var superEssenceProfit24 = (24 * 60 * 60 / superEssencePotionDuration) * superEssencePotionAvgEssence * 1;
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
                */
                if (quickCalcStardustBoxShadow && stardustProfitGreenBox) {
                    document.getElementById("quickCalcStardust").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcStardust").style.boxShadow = "";
                if (quickCalcSuperStardustBoxShadow && superStardustProfitGreenBox) {
                    document.getElementById("quickCalcSuperStardust").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcSuperStardust").style.boxShadow = "";
                if (quickCalcStargemBoxShadow && stargemProfitGreenBox) {
                    document.getElementById("quickCalcStargem").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcStargem").style.boxShadow = "";
                /*
                if (quickCalcEssenceBoxShadow && essenceProfitGreenBox) {
                    document.getElementById("quickCalcEssence").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcEssence").style.boxShadow = "";
                if (quickCalcSuperEssenceBoxShadow && superEssenceProfitGreenBox) {
                    document.getElementById("quickCalcSuperEssence").style.boxShadow = "0 0 40px -10px rgba(0,255,0,1) inset,0 0 5px 0px rgba(0,255,0,1)";
                } else document.getElementById("quickCalcSuperEssence").style.boxShadow = "";
                */
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
                    //$.post("https://script.google.com/macros/s/AKfycbx_izl1yk0PLUNp4te3swi3uSxrEu4L7E0JueJ72cS0r899Wj7z/exec", {
                    //marketData: msg,
                    //user: username
                    // });
                    //$.post("https://dhmarket.000webhostapp.com/data_post.php", {
                    // marketData: msg,
                    //user: username
                    // });
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
                        thString += "<td title='First click: enable delete\nSecond click: permanently delete' arrnum='" + i + "' thdeletewarned='false' style='text-align:center' onclick='thDelete(this.getAttribute(&quot;arrnum&quot;),this)'><img class='image-icon-30' src='https://i.imgur.com/S4WuNVn.png'></td>";
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
        function addWebsocketHook() { // thanks florb
            const msgGameArr = ["Poker"],
                  msgMainArr = ["SEND_LOBBY"];
            var origOnMessage = window.webSocket.onmessage;
            window.webSocket.onmessage = function(e) {
                origOnMessage.apply(this, arguments);
                let msg = e.data;
                /*
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
                */
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
                        priceGraphElement.innerHTML = "<input type='image' style='padding:10px' onclick='disableBtn(this.parentNode,500);openPriceGraph();' src='https://i.imgur.com/XhYzZRt.png' class='image-icon-30'>";
                        var tradeHistoryElement = document.createElement("div");
                        tradeHistoryElement.setAttribute("style", "margin:5px;padding:0px");
                        tradeHistoryElement.setAttribute("class", "basic-smallbox-grey");
                        tradeHistoryElement.setAttribute("id", "ted-trade-history");
                        tradeHistoryElement.setAttribute("title", "Trade History");
                        tradeHistoryElement.innerHTML = "<input type='image' style='padding:10px' onclick='disableBtn(this.parentNode,500);openTradeHistory();' src='https://i.imgur.com/ch5nOjq.png' class='image-icon-30'>";
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
                        //document.getElementById("browseAllElementWrapper").appendChild(priceGraphElement);
                        document.getElementById("browseAllElementWrapper").appendChild(tradeHistoryElement);
                        let browseAndHistory = document.getElementById("ted-market-ui").appendChild(document.createElement("div"));
                        //browseAndHistory.appendChild(document.getElementsByClassName("market-browse-button")[0]);
                        //browseAndHistory.appendChild(document.getElementsByClassName("market-browse-button")[1]);
                        //document.getElementsByClassName("market-browse-button")[0].setAttribute("style","width:50%;padding:10px 0");
                        //document.getElementsByClassName("market-browse-button")[1].setAttribute("style","width:50%;padding:10px 0");
                        browseAndHistory.setAttribute("style", "display:flex");

                        document.getElementById("ted-market-ui").appendChild(quickCalcDiv);

                        quickCalcDiv.appendChild(quickCalcStardust);
                        quickCalcDiv.appendChild(quickCalcSuperStardust);
                        quickCalcDiv.appendChild(quickCalcStargem);
                        //quickCalcDiv.appendChild(quickCalcEssence);
                        //quickCalcDiv.appendChild(quickCalcSuperEssence);

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
                    var currentPrice = Math.ceil((numberWithoutCommas(document.getElementById("chosenpostitem-upper").innerHTML) + numberWithoutCommas(document.getElementById("chosenpostitem-lower").innerHTML)) / 1.9);
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
                    let arrVials = ["stardustPotion", "treePotion", "seedPotion", "smeltingPotion", "oilPotion", "barPotion", "superStardustPotion", "combatCooldownPotion", "farmingSpeedPotion"];
                    let arrLargeVials = ["stargemPotion", "superOilPotion", "stardustCrystalPotion", "superTreePotion", "superCombatCooldownPotion"];
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
                    /*
                    if (treasureMap > 0 && document.getElementById("mapSpan").style.display !== "") {
                        document.getElementById("mapSpan").style.display = "";
                    } else if (treasureMap === 0 && document.getElementById("mapSpan").style.display != "none") {
                        document.getElementById("mapSpan").style.display = "none";
                    }
*/
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
            strangeLogs: 30,
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
                    var currentPrice = Math.ceil((numberWithoutCommas(document.getElementById("chosenpostitem-upper").innerHTML) + numberWithoutCommas(document.getElementById("chosenpostitem-lower").innerHTML)) / 1.9);
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
                                }else if (arrMarketItems[key] && arrMarketItems[key][0].price) {
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
        }

        tedMarketUiSettings();
        drawButtons();
        marketMain();
        alterMarketSlots();
        otherSettingsRunOnce();
        //minigamesInit();
        //setInterval(persistentInterval, 1500);
        //setInterval(tmg_pokerConnectionHandler, 1000);
    }
});