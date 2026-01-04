// ==UserScript==
// @name         Christmas Town
// @namespace    TC.CT
// @version      1.0.5
// @author       DeKleineKobini - AlienZombie
// @description  Christmas Town utilities
// @match        https://www.torn.com/christmas_town.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=759441
// @run-at       document-start
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/394030/Christmas%20Town.user.js
// @updateURL https://update.greasyfork.org/scripts/394030/Christmas%20Town.meta.js
// ==/UserScript==

"use strict";

initScript({
    name: "Christmas Town",
    abbr: "XMASS",
    logging: "all"
});

class WordFixer {

    constructor() {
        this.started = false;
    }

    get started() {
        return this._started;
    }

    set started(started) {
        this._started = started;
    }

    openGame() {
        dkklog.trace("WordFixer::openGame", $("#minigame-panel"));
        this.started = true;
        $("#minigame-information").html("WordFixer solution: <span id='ct-minigame'><span>");
        $("#minigame-panel").show();
    }

    updateGame(message) {
        $("#ct-minigame").html(message);
    }

    closeGame() {
        this.started = false;
        $('#minigame-panel').hide();
    }

    gameLogic(text) {
        let ordered = LIBRARY_WORDFIXER.map(e => {return { orig: e, sort: e.replace(/[^ a-zA-Z]/g, "").split('').sort().join('') }});
        let results = ordered.filter(e => e.sort == text.toLowerCase().split('').sort().join('')).map(e => e.orig);
        //if (results.length == 0)
        //     return `Good luck with figuring this out :(. Contact me <a href="${contact}">here</a> to update this 2018 script <input value="${text}" readonly/>` + ping(`report=${payload.result.word}&user=${getID()}`);
        return results;
    }

}

const STORAGE = new Storage("christmastown", "localStorage");

const dataVersion = getCTVersion();
dkklog.info(`Running version '${dataVersion}' for Christmas Town!`);
const christmas = STORAGE.get({ settings: {} });
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

/*
 * Provided by Helcostr [1934501]
 */
const LIBRARY_WORDFIXER = ["elf","eve","fir","ham","icy","ivy","joy","pie","toy","gift","gold","list","love","nice","sled","star","wish","wrap","xmas","yule","angel","bells","cider","elves","goose","holly","jesus","merry","myrrh","party","skate","visit","candle","creche","cookie","eggnog","family","frosty","icicle","joyful","manger","season","spirit","tinsel","turkey","unwrap","wonder","winter","wreath","charity","chimney","festive","holiday","krampus","mittens","naughty","package","pageant","rejoice","rudolph","scrooge","snowman","sweater","tidings","firewood","nativity","reindeer","shopping","snowball","stocking","toboggan","trimming","vacation","wise men","workshop","yuletide","chestnuts","christmas","fruitcake","greetings","mince pie","mistletoe","ornaments","snowflake","tradition","candy cane","decoration","ice skates","jack frost","north pole","nutcracker","saint nick","yule log","card","jolly","hope","scarf","candy","sleigh","parade","snowy","wassail","blizzard","noel","partridge","give","carols","tree","fireplace","socks","lights","kings","goodwill","sugarplum","bonus","coal","snow","happy","presents","pinecone"];

var fixer = new WordFixer();

/*
 * CSS provided by Jox [1714547] and added on request.
 */
if (getData("settings", {}).hideCompass) addCSS("ct", ".d #ct-wrap .user-map-container .user-map:before {z-index: 0 !important}");

interceptFetch('christmas_town.php', (response, url) => {
    dkklog.trace("Got a FETCH response.", response, url)

    if (response.settings) data.lastMap.id = response.settings.userActiveMapID;
    if (response.myMaps) $("#ctwidget").hide();

    //
    if (response.prizes) {
        response.prizes.forEach(element => receiveItem(response.board ? "minigame" : "chest", element.name, element.quantity));
    }

    if (!url.includes("q=miniGameAction") && fixer.started) fixer.closeGame();

    if (response.miniGameType) {
        let game = response.miniGameType;
        dkklog.debug("Minigame", game);
        if (game == "WordFixer") {
            fixer.openGame();
            fixer.updateGame(fixer.gameLogic(response.progress.word));
        }
    } else if (fixer.started && !response.settings) {
        if (response.finished) {
            fixer.updateGame('<font color="gray">What was my purpose?... Oh my god.</font>');
        } else if (typeof response.message != "undefined" && response.message != "game")
            fixer.updateGame(`<font color="gray">I hope you enjoy my existance. Thanks to <a href='https://www.torn.com/profiles.php?XID=1934501#/'>Helcostr</a> for the original code and permission.</font>`);
        else if (response.success) fixer.updateGame(fixer.gameLogic(response.progress.word));
        else if (response.finished === false || (response.mapData && !response.mapData.cellEvent)) fixer.closeGame();
    }

    if (response.mapData) {
        $("#ctwidget").show();

        // has just loaded the map
        if (response.mapData.map) data.lastMap.name = response.mapData.map.name;

        // current tile is minigames or chest
        if (response.mapData.cellEvent) {
            let game = response.mapData.cellEvent.miniGameType;
            let event = response.mapData.cellEvent.type;

            let area = $(".status-area-container").get(0)

            switch (game) {
                case "WordFixer":

                    break;
            }

            switch (event) {
                case "gameChristmasWreath":
                    observeMutations(area, ".status-area-container > div[class*='christmas-wreath']", true, (mutations, observer) => {
                        $(".status-area-container > div[class*='christmas-wreath'] > div:eq(1) > img:eq(0)").remove();
                    }, { childList: true, attributes: true, subtree: true});
                    break;
                case "gameItemMatch": // wtf is this?
                case "gameSnowballShooter": // maybe only show grinch ?
                case "gameGetTheGrinch": // not enabled yet
                case "gamePickStocking": // not enabled yet
                case "gamePYPresent":
                case "gameHangman":
                case "":
                    break;
                    // Eternity

                    // Three Hats
                    // Icicle Assassins
                    // Garland Assamble
                    // Sping the Weel
                    // Gift Wrap
                    // Lucky Figurine
            }
        } // 1*2

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
                } else if (image.includes("/chests/")) {
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

                let paddingL = "0px";
                let paddingR = "6px";

                switch (type) {
                    case "item":
                        countItems++;

                        let html = `<li><img src="${image}" style="padding-left: ${paddingL}; padding-right: ${paddingR};">[${item.position.x}, ${item.position.y}] ${name}</li>`;
                        ctspawn += html
                        break;
                    case "chest":
                        countChests++;

                        let chestLevel = 'none';
                        switch (name) {
                            case "Bronze chest":
                                chestLevel = '#d68f53';
                                break;
                            case "Silver chest":
                                chestLevel = 'silver';
                                break;
                            case "Golden chest":
                                chestLevel = 'gold';
                                break;
                        }

                        spawnChests += `<span style="background-color: ${chestLevel};"><img src="${image}" style="float:none !important; padding-left: ${paddingL}; padding-right: ${paddingR};">[${item.position.x}, ${item.position.y}] </span>`;
                        break;
                }
            });
            $("#ct19-items").html(ctspawn || "No items nearby.");
            $("#ct19-itemshead").html(`Nearby Items (${countItems})`);
            $("#ct19-chests").html(`<li>${spawnChests}</li>` || "No chests nearby.");
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

    runOnEvent(() => {
        let hash = window.location.hash;
        if (hash.includes("/mymaps")) {
            $("#ctwidget").hide();
            $("#ctsettings").show();
        } else if (hash.includes("/mapeditor")) {
            $("#ctwidget").hide();
            $("#ctsettings").hide();
        } else if (hash.includes("/parametereditor")) {
            $("#ctwidget").hide();
            $("#ctsettings").hide();
        } else if (hash === undefined || hash == "#/" || hash == "#" || hash == ""){
            $("#ctwidget").show();
            $("#ctsettings").hide();
        }
    }, "hashchange", true)
});

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
    STORAGE.set(christmas);
}

var itemValues = {};

function loadPanel() {
    dkklog.trace("Adding panel to the view.");
    let name = "CT2019 by DeKleineKobini";

    addCSS("ct",
           "@keyframes pulse { 0% { opacity: 1; box-shadow: 0 0 0 0px #ce81dd; bottom: 200%; right: 200%; height: 500%; width: 500%; } 50% { bottom: 250%; right: 250%; height: 600%; width: 600%; } 100% { opacity: 0.5; box-shadow: 0 0 0 100px rgba(0, 0, 0, 0); bottom: 200%; right: 200%; height: 500%; width: 500%; } }"
           + "div.items-layer div.ct-item::after { background-image: radial-gradient(rgba(0, 0, 0, 0), #BD6FCC); border-radius: 100%; content: ''; display: block; position: relative; bottom: 200%; right: 200%; height: 500%; width: 500%; animation: pulse 5s ease-out; animation-iteration-count: infinite; }"
           + ".ct-information-table { width: 100%; height: 100%; border-collapse: separate; text-align: left; }"
           + ".ct-information-table > tbody > tr > th { height: 16px; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; padding: 2px 10px; border-top: 1px solid rgb(255, 255, 255); border-bottom: 1px solid rgb(204, 204, 204); background: linear-gradient(rgb(255, 255, 255), rgb(215, 205, 220)); }"
           + ".ct-information-table, .ct-information-table > tbody > tr > tr, .ct-information-table > tbody > tr > td { border: none !important;; }"
           + ".ct-information-table > tbody > tr > td { padding: 2px 10px; }"
           + "#ct19-items, #ct19-chests { padding: 4px 0px; }"
           + "#ct19-items li, #ct19-chests li { padding: 4px 0px; }"
           + "#ct19-items img, #ct19-chests img { vertical-align: middle; float: left; max-height: 16px; }"
          )
    $("#christmastownroot div:eq(1)").after("<hr class='page-head-delimiter m-top10 m-bottom10'>");
    $("#christmastownroot div:eq(1)").after(
        `<div><article class='dkk-widget' style='display: none;' id='ctsettings'><header class='dkk-widget_green'><span class='dkk-widget_title'>Settings for ${name}</span></header>
<div class='dkk-widget_body dkk-round-bottom'>
<div class='dkk-panel-left'><table class='dkk-data-table'><tr><td>Hide Compass</td><td style='text-align: center;'><input type="checkbox" id='showCompass' name='hideCompass' value='Compass'></td></tr></table></div>
<div class='dkk-panel-middle'></div>
<div class='dkk-panel-right'></div>
</div>
</article></div><div class="clear"></div>`
    );
    $("#hideCompass").change(() => {
        let settings = getData("settings", {});

        settings.hideCompass = $("#hideCompass").is(":checked");;

        setData("settings", settings);
        saveData();

        if (settings.hideCompass) addCSS("ct", ".d #ct-wrap .user-map-container .user-map:before {z-index: 0 !important}");
        else removeCSS("ct");
    });

    if (getData("settings", {}).hideCompass) $("#hideCompass").prop("checked", true);

    $("#christmastownroot div:eq(1)").after(
        `<div><article class='dkk-widget' style='display: none;' id='ctwidget'><header class='dkk-widget_green'><span class='dkk-widget_title'>${name}</span></header>
<div class='dkk-widget_body'>
<div class='dkk-panel-left'><table class='dkk-data-table'><tr><th>Item Information</th></tr><tr><td><table class='ct-information-table'><tr><td>Items Found</td><td id='ct19-itemcount'>loading...</td></tr><tr><td>Total Value</td><td id='ct19-itemvalue'>loading...</td></tr><tr><td >Average Value</td><td id='ct19-itemvalueavg'>loading...</td></tr></table></td></tr></table></div>
<div class='dkk-panel-middle'></div>
<div class='dkk-panel-right'><table class='dkk-data-table' style='display: none;' id='minigame-panel'><tr><th>Minigame Helper</th></tr><tr><td id='minigame-information'></td></tr></table></div>
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

    if (month != 12 || day < 17) prefix = "BETA ";

    return `${prefix}${year}`;
}
