// ==UserScript==
// @name         TORN: CT2019
// @namespace    wildhare.christmastown
// @version      BETA 2019.2
// @author       DeKleineKobini/WildHare
// @description  Christmas Town utilities
// @match        https://www.torn.com/christmas_town.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require      https://greasyfork.org/scripts/392880-wildhare-torn-utilities/code/WildHare%20Torn%20Utilities.user.js?version=752676
// @run-at       document-start
// @connect      api.torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/392881/TORN%3A%20CT2019.user.js
// @updateURL https://update.greasyfork.org/scripts/392881/TORN%3A%20CT2019.meta.js
// ==/UserScript==

"use strict";

initScript({
    name: "Christmas Town",
    abbr: "XMASS",
    api: true,
    logging: "ALL"
});

const dataVersion = getCTVersion();
dkklog.info(`Running version '${dataVersion}' for Christmas Town!`);
const christmas = JSON.parse(localStorage.getItem("christmas") || "{}");
const data = { lastMap: {}};

const API = new TornAPI(api => {
    dkklog.trace("API object created.");
    getCache("tornapi_items", false).then(cache => {
        dkklog.trace("Possible caching found.");
        if (cache) {
            dkklog.debug("Loaded items from the cache!");
            for (let id in cache) {
                let store = cache[id];
                itemValues[store.name] = {
                    id: id,
                    value: store.market_value,
                    image: store.image
                }
            }
        } else {
            dkklog.debug("Attempting to load from the api.");
            api.sendRequest("torn", null, "items").then(json => {
                dkklog.debug("Loaded items from the api!");

                for (let id in json.items) {
                    let store = json.items[id];
                    itemValues[store.name] = {
                        id: id,
                        value: store.market_value,
                        image: store.image
                    }
                }

                setCache("tornapi_items", json.items, getMillisUntilNewDay());
            }, reject => {
                dkklog.warn("Rejected api response! " + reject);
            });
        }
    }, reject => {
        dkklog.warn("Rejected cache response!");
    });
});



interceptFetch('christmas_town.php', (response) => {
    dkklog.trace("Got a FETCH response.", response)

    if (response.settings) data.lastMap.id = response.settings.userActiveMapID;
    if (response.myMaps) $("#ctwidget").hide();

    if (response.prizes) {
        response.prizes.forEach(element => receiveItem(response.board ? "minigame" : "chest", element.name, element.quantity));
    }

    if (response.mapData) {
        $("#ctwidget").show();

        // has just loaded the map
        if (response.mapData.map) data.lastMap.name = response.mapData.map.name;

        // current tile is minigames or chest
        if (response.mapData.cellEvent) {
            let event = response.mapData.cellEvent.type;

            let area = $(".status-area-container").get(0)

            switch (event) {
                case "gameChristmasWreath":
                    observeMutations(area, ".status-area-container > div[class*='christmas-wreath']", true, (mutations, observer) => {
                        $(".status-area-container > div[class*='christmas-wreath'] > div:eq(1) > img:eq(0)").remove();
                    }, { childList: true, attributes: true, subtree: true});
                    break;
                case "gameWordFixer": // crowdsourcing ?
                case "gameItemMatch":
                case "gameSnowballShooter": // maybe only show grinch ?
                case "gameGetTheGrinch":
                case "gamePickStocking":
                case "gamePYPresent":
                case "gameHangman":
                case "gameSantaClaws":
                case "":
                    break;
                    //  Gift Wrap
                    //  Three Hats
                    //  Lucky Figurine
                    //  Item Match
                    //  Eternity
            }
        }

        // view has items
        if (response.mapData.items) {
            let items = response.mapData.items;

            let ctspawn = "";
            let spawnChests = "";
            data.position = response.mapData.position;

            let countItems = 0;
            let countChests = 0;
            $.each(items, (index, item) => {
                let image = item.image.url;
                let name, type;

                if (image.includes("/keys/")) {
                    type = "key";
                    if (image.includes("/bronze/")){
                        name = "Bronze key";
                        image = "https://www.torn.com/images/items/christmas_town/keys/keys-91.png"
                    } else if (image.includes("/silver/")) { // TODO - confirm
                        name = "Silver key";
                        image = "https://www.torn.com/images/items/christmas_town/keys/keys-92.png"
                    } else if (image.includes("/gold/")) {
                        name = "Golden key";
                        image = "https://www.torn.com/images/items/christmas_town/keys/keys-93.png"
                    }
                } if (image.includes("/chests/")) {
                    type = "chest";
                    // TODO - possibly improve images
                    if (image.includes("/3.gif")){
                        name = "Bronze chest";
                    } else if (image.includes("/2.gif")){
                        name = "Silver chest";
                    } else if (image.includes("/1.gif")){
                        name = "Golden chest";
                    }
                } else if (image.includes("/combinationChest/")) {
                    type = "combinationChest";
                    name = "Combination chest";
                } else {
                    type = "item";
                    name = "Mysterious gift";
                    image = "http://iconshow.me/media/images/xmas/merry-christmas-icon/7/gift-16.png"
                }

                switch (type) {
                    case "item":
                        countItems++;
                        break;
                    case "chest":
                        countChests++;
                        break;
                }

                let paddingL = "0px";
                let paddingR = "6px";

                let html = `<li><img src="${image}" style="padding-left: ${paddingL}; padding-right: ${paddingR};">[${item.position.x}, ${item.position.y}] ${name}</li>`;

                if (type == "chest") spawnChests += html;
                else ctspawn += html;
            });
            $("#ct19-items").html(ctspawn || "No items nearby.");
            $("#ct19-itemshead").html(`Nearby Items (${countItems})`);
            $("#ct19-chests").html(spawnChests || "No chests nearby.");
            $("#ct19-chestshead").html(`Nearby Chests (${countChests})`);
        }

        // current tile has trigger
        if (response.mapData.trigger) {
            let triggerMessage = response.mapData.trigger.message;

            // current tile had an item
            if (triggerMessage.includes(" find ")) {
                // TODO - fix item with 'an' instead of 'a'
                let indexA = triggerMessage.indexOf(" a ");
                if (indexA < 0) indexA = triggerMessage.indexOf(" an ") + 4;
                else indexA += 3;

                let item = triggerMessage.substring(indexA).trim();

                switch (item) {
                    case "pair of Festive Socks":
                        item = "Festive Socks";
                }

                receiveItem("map", item, 1, response.mapData.position);
            }
        }
    }
});

$(document).ready(() => {
    loadPanel()
});

runOnEvent(() => {
    let hash = location.hash;
    if (hash.includes("/mapeditor")) {
        $("#ctwidget").hide();
    } else if (hash.includes("/parametereditor")) {
        $("#ctwidget").hide();
    } else if (hash === undefined || hash == "#/" || hash == "#" || hash == ""){
        $("#ctwidget").show();
    }
}, "hashchange")

function runOnEvent(funct, event, runBefore) {
    if (runBefore) funct();

    $(window).bind(event, function() {
        funct();
    });
}

function inRadius(item) {
    let difference = {
        x: (data.position.x - parseInt(item.x)),
        y: (data.position.y - parseInt(item.y))
    };
    return (difference.x > 8 && difference.x < 8) && (difference.y > 8 && difference.y < 8);
}

function getData(key, def) {
    if (!christmas[dataVersion]) christmas[dataVersion] = {};

    return christmas[dataVersion][key] || def;
}

function setData(key, value) {
    if (!christmas[dataVersion]) christmas[dataVersion] = {};

    christmas[dataVersion][key] = value;
}

function saveData() {
    localStorage.setItem("christmas", JSON.stringify(christmas));
}

var itemValues = {};

function loadPanel() {
    dkklog.trace("Adding panel to the view.");
    let name = "CT2019 by DeKleineKobini";

    GM_addStyle(
        "@keyframes pulse { 0% { opacity: 1; box-shadow: 0 0 0 0px #ce81dd; bottom: 200%; right: 200%; height: 500%; width: 500%; } 50% { bottom: 250%; right: 250%; height: 600%; width: 600%; } 100% { opacity: 0.5; box-shadow: 0 0 0 100px rgba(0, 0, 0, 0); bottom: 200%; right: 200%; height: 500%; width: 500%; } }"
        + "div.items-layer div.ct-item::after { background-image: radial-gradient(rgba(0, 0, 0, 0), #BD6FCC); border-radius: 100%; content: ''; display: block; position: relative; bottom: 200%; right: 200%; height: 500%; width: 500%; animation: pulse 5s ease-out; animation-iteration-count: infinite; }"
        + ".ct-information-table { width: 100%; height: 100%; border-collapse: separate; text-align: left; }"
        + ".ct-information-table > tbody > tr > th { height: 16px; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; padding: 2px 10px; border-top: 1px solid rgb(255, 255, 255); border-bottom: 1px solid rgb(204, 204, 204); background: linear-gradient(rgb(255, 255, 255), rgb(215, 205, 220)); }"
        + ".ct-information-table, .ct-information-table > tbody > tr > tr, .ct-information-table > tbody > tr > td { border: none !important;; }"
        + ".ct-information-table > tbody > tr > td { padding: 2px 10px; }"
        + "#ct19-items, #ct19-chests { padding: 4px 0px; }"
        + "#ct19-items li, #ct19-chests li { padding: 4px 0px; }"
        + "#ct19-items img, #ct19-chests img { vertical-align: middle; float: left; max-height: 16px; }"
    );

    $("#christmastownroot div:eq(1)").after(
        `<div><article class='dkk-widget' style='display: none;' id='ctwidget'><header class='dkk-widget_green'><span class='dkk-widget_title'>${name}</span></header>
<div class='dkk-widget_body'>
<div class='dkk-panel-left'><table class='dkk-data-table'><tr><th>Item Information</th></tr><tr><td><table class='ct-information-table'><tr><td>Items Found</td><td id='ct19-itemcount'>loading...</td></tr><tr><td>Total Value</td><td id='ct19-itemvalue'>loading...</td></tr><tr><td >Average Value</td><td id='ct19-itemvalueavg'>loading...</td></tr></table></td></tr></table></div>
<div class='dkk-panel-middle'></div>
<div class='dkk-panel-right'></div>
</div>
<div class='dkk-widget_body dkk-round-bottom'>
<div class='dkk-panel-left'><table class='dkk-data-table'><tr><th id='ct19-itemshead'>Nearby Items (0)</th></tr><tr><td><ul id='ct19-items'></ul></td></tr></table></div>
<div class='dkk-panel-middle'><table class='dkk-data-table'><tr><th id='ct19-chestshead'>Nearby Chests (0)</th></tr><tr><td><ul id='ct19-chests'></ul></td></tr></table></div>
<div class='dkk-panel-right'></div>
</div>
</article></div><div class="clear"></div>`
    );

    let itemcount = getData("itemcount", 0);
    let itemvalue = getData("itemvalue", 0);

    $("#ct19-itemcount").html(itemcount);
    $("#ct19-itemvalue").html(`$${itemvalue.format()}`);
    $("#ct19-itemvalueavg").html(itemcount > 0 ? "$" + (itemvalue / itemcount).format() : "N/A");
}

function receiveItem(source, item, amount, position) {
    if (!itemValues[item]) {
        dkklog.debug("You received something that is not an item!", {
            source: source,
            item: item,
            amount: amount
        });
        return false;
    }

    if (!amount) amount = 1;

    let itemcount = getData("itemcount", 0) + amount;
    let itemvalue = getData("itemvalue", 0) + (itemValues[item].value * amount);

    setData("itemcount", itemcount);
    setData("itemvalue", itemvalue);
    saveData();

    $("#ct19-itemcount").html(itemcount);
    $("#ct19-itemvalue").html(`$${itemvalue.format()}`);
    $("#ct19-itemvalueavg").html(`$${(itemvalue / itemcount).format()}`);

    dkklog.debug("You received an item!", {
        source: source,
        item: item,
        amount: amount,
        value: {
            single: itemValues[item].value,
            total: itemValues[item].value * amount
        }
    });
    return true;
}

function getCTVersion(date) {
    if (!date) date = new Date();

    let prefix = "";
    let hour = date.getUTCHours();
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();

    if (month <= 6) year--;

    if (month != 12 || ((day == 15 && hour < 12) || day < 15)) prefix = "BETA ";

    return `${prefix}${year}`;
}