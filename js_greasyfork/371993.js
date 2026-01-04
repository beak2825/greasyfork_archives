// ==UserScript==
// @name         Steam, Card sets viewer
// @name:ja      Steam, Card sets viewer
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Happy trading 1:1 card sets
// @description:ja  Happy trading 1:1 card sets
// @author       You
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://steamcommunity.com/tradeoffer/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @nowrap
// @downloadURL https://update.greasyfork.org/scripts/371993/Steam%2C%20Card%20sets%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/371993/Steam%2C%20Card%20sets%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = jQuery.noConflict();
    var GetBadgeInformationUrl = "https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Member";
    var GetInventoryUrl = `https://www.steamcardexchange.net/api/request.php?GetInventory&_=${new Date().getTime()}`;
    var StorageKey = "SCE_Badges";
    var ButtonClass = "btn_darkblue_white_innerfade btn_small new_trade_offer_btn";
    var MaxBadgeLevel = 5;

    function escapeHtml (string) {
        if(typeof string !== 'string') {
            return string;
        }
        return string.replace(/[&'`"<>]/g, function(match) {
            return {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
            }[match]
        });
    }

    function createSetsObjectFromInventory (user) {
        var sets = {};
        var rgInventory = user.rgContexts[753][6].inventory.rgInventory;
        for (var instanceid in rgInventory) {
            var item = rgInventory[instanceid];

            // Check whether item type is card
            var isCard = false;
            var isNormal = false;
            for (var i = 0; i < item.tags.length; i++) {
                // item_class_2 is type of trading card
                if (item.tags[i].category == "item_class" &&
                    item.tags[i].internal_name == "item_class_2") {
                    isCard = true;
                }
                // cardborder_0 is type of normal card
                if (item.tags[i].category == "cardborder" &&
                    item.tags[i].internal_name == "cardborder_0") {
                    isNormal = true;
                }
            }

            if (!isCard) continue;
            if (!isNormal) continue;

            if (!sets[item.market_fee_app]) {
                sets[item.market_fee_app] = {
                    appId: item.market_fee_app,
                    cardsInSet: -1,
                    items: {}
                };
            }
            if (!sets[item.market_fee_app].items[item.market_hash_name]) {
                sets[item.market_fee_app].items[item.market_hash_name] = {
                    hash: item.market_hash_name,
                    quantity: 1,
                    instances: [instanceid],
                };
            } else {
                sets[item.market_fee_app].items[item.market_hash_name].quantity++;
                sets[item.market_fee_app].items[item.market_hash_name].instances.push(instanceid);
            }
        }

        return sets;
    }

    function isValidSteamInventory() {
        var errorUser;
        function checkIsLoaded(user) {
            if (!user) throw "Error: Not found {0} user object".replace("{0}", errorUser);
            var inv = user.rgContexts[753][6].inventory;
            if (!inv) throw "Error: {0} Inventory is not found".replace("{0}", errorUser);
            if (!inv.initialized) throw "Error: {0} Inventory is unloaded".replace("{0}", errorUser);
            if (inv.appid != "753") throw "Error: {0} Inventory isn't Steam Inventory".replace("{0}", errorUser);
            if (!inv.rgInventory) throw "Error: {0} rgInventory is unloaded".replace("{0}", errorUser);
        }

        errorUser = "Your";
        checkIsLoaded(UserYou);
        errorUser = "Partners";
        checkIsLoaded(UserThem);

        console.log("SCE: Both Inventory are loaded");
        return true;
    }

    function loadBadgeInformation() {
        return new Promise(function (resolve, reject) {
            GM.xmlHttpRequest({
                url: GetBadgeInformationUrl,
                method: "GET",
                onerror: function () {
                    reject("Couldn't get badge information. You need to log in to steamcardexchange.net.");
                },
                onload: function (xhr) {
                    var badges = {}, data;
                    try {
                        var parsedJSON = JSON.parse(xhr.responseText);
                        for (var i = 0; i < parsedJSON.data.length; i++) {
                            data = parsedJSON.data[i];
                            badges[data[0][0]] = {
                                title: data[0][1].trim(),
                                cardsInSet: data[1],
                                badgeValue: data[2],
                                yourLevel: parseInt(data[3]),
                            };
                        }
                    } catch (error) {
                        console.log(error, xhr, data);
                        reject(error);
                        return;
                    }
                    resolve(badges);
                }
            });
        });
    }

    function loadSCEInventory() {
        return new Promise(function(resolve, reject) {
            GM.xmlHttpRequest({
                url: GetInventoryUrl,
                method: "GET",
                onerror: function() {
                    reject("Couldn't get SCE inventory. You need to log in to steamcardexchange.net.");
                },
                onload: function (xhr) {
                    var inventory = {}, data;
                    try {
                        var parsedJSON = JSON.parse(xhr.responseText);
                        for (var i = 0; i < parsedJSON.data.length; i++) {
                            data = parsedJSON.data[i];
                            inventory[data[0][0]] = {
                                title: data[0][1].trim(),
                                cardsInSet: data[3][0],
                            };
                        }
                    } catch (error) {
                        console.log("SCE:", error, xhr);
                        reject(error);
                    }

                    resolve(inventory);
                }
            });
        });
    }

    function applyBadgeInformationToSetsObject(badges, sets, isSelfInventory, isExtraOnly) {
        var fee, set;

        // Add badge information to sets variable
        for (fee in badges) {
            set = sets[fee];
            if (!set) continue;

            sets[fee] = $.extend(true, {
                yourLevel: 0,
                fullSetQuantity: 0,
                hasFullSet: false,
            }, set, badges[fee]);
        }

        // Count complete card sets
        for (fee in sets) {
            set = sets[fee];

            var totalCards = 0;
            var cardsCount = 0;
            var minQty = Number.MAX_VALUE;

            for (var hash in set.items) {
                var item = set.items[hash];
                minQty = Math.min(minQty, item.quantity);
                cardsCount++;
                totalCards += item.quantity;
            }
            set.totalCards = totalCards;
            if (set.cardsInSet > 0 && set.cardsInSet == cardsCount) {
                set.hasFullSet = true;
                set.fullSetQuantity = minQty;
                if (isSelfInventory) {
                    var extraQuantity = set.fullSetQuantity - (MaxBadgeLevel - set.yourLevel);
                    set.extraQuantity = extraQuantity > 0 ? extraQuantity : 0;
                    set.necessaryQuantity = 0;
                } else {
                    set.extraQuantity = 0;
                    set.necessaryQuantity = Math.min(MaxBadgeLevel - set.yourLevel, set.fullSetQuantity);
                }
            } else {
                set.hasFullSet = false;
                set.fullSetQuantity = 0;
                set.extraQuantity = 0;
                set.necessaryQuantity = 0;
            }
        }

        var displayList = [];
        for (fee in sets) {
            set = sets[fee];
            if (!set.hasFullSet) continue;
            if (isExtraOnly) {
                if (isSelfInventory && set.extraQuantity <= 0) continue;
                if (!isSelfInventory && set.necessaryQuantity <= 0) continue;
            }

            displayList.push(set);
        }

        // sort by title
        displayList.sort(function (a, b) {
            return a.title > b.title ? 1 : -1;
        });

        return displayList;
    }

    function buildList(displayList, isYourInventory, isExtraOnly) {
        var set, fee;

        var textBuilder = "";
        var markdownBuilder = "";
        var htmlBuilder = "";
        var steamBuilder = "";

        for (var k = 0; k < displayList.length; k++) {
            set = displayList[k];
            var quantity = set.fullSetQuantity;
            if (isExtraOnly) {
                quantity = isYourInventory ? set.extraQuantity : set.necessaryQuantity;
            }

            var yourBadgeUrl = `${UserYou.strProfileURL}/gamecards/${set.appId}/`;
            var theirBadgeUrl = `${UserThem.strProfileURL}/gamecards/${set.appId}/`;
            var perValue = set.badgeValue ? "$" + Math.round(parseFloat(set.badgeValue.replace("$", "")) / set.cardsInSet * 1000) / 1000 : null;
            var replacedTitle = set.title.replace("[", "&#91;").replace("]", "&#93;");
            var classList = "set";
            if (set.extraQuantity > 0) {
                classList += " extra";
            }
            if (set.necessaryQuantity > 0) {
                classList += " necessary";
            }
            classList += set.badgeValue ? " marketable" : " non-marketable";

            // Add content as text to pre tag so don't need to html-escape
            textBuilder += `<span class="${classList}">${quantity}x ${replacedTitle}</span>`;
            // Add content as text to pre tag so don't need to html-escape
            // but need to escape charactors that is used by markdown
            markdownBuilder += `<span class="${classList}">${quantity}x [${replacedTitle}](${yourBadgeUrl}) (${set.cardsInSet})</span>`;
            // Add content as text to pre tag so don't need to html-escape
            // but need to escape charactors that is used by steam code
            steamBuilder += `<span class="${classList}">${quantity}x [url=${yourBadgeUrl}]${replacedTitle}[/url]</span>`;
            // Append content as html to body so need to html-escape variables

            var htmlPart = `<div>
                <button data-fee='${set.appId}' data-count=1 class='AddSetToTradeButton'>Add</button>
                <span class="${classList}">${quantity}x <a href='${yourBadgeUrl}' target='_blank'>${escapeHtml(set.title)}</a> (<a href='${theirBadgeUrl}' target='_blank'>partners</a>)
                ${set.cardsInSet} ${set.badgeValue ? `(${perValue} / ${set.badgeValue})` : ""}</span>
                </div>`;

            htmlBuilder += htmlPart;
        }

        return $("<div />")
            .append($("<div />").addClass("SetListText").append(textBuilder))
            .append($("<div />").addClass("SetListMarkdown").append(markdownBuilder))
            .append($("<div />").addClass("SetListSteamCode").append(steamBuilder))
            .append($("<div />").addClass("SetListHtml").append(htmlBuilder));
    }

    async function main() {
        console.log("main()");
        var isExtraOnly = $("#DisplayExtraOnlyCheckbox")[0].checked;

        var yours = createSetsObjectFromInventory(UserYou);
        var theirs = createSetsObjectFromInventory(UserThem);

        // console.log("Users:", yours, theirs);

        var badges, inventory;
        try {
            badges = JSON.parse(localStorage[StorageKey]);
        } catch (error) {
            badges = null;
        }

        if (!badges) {
            try {
                badges = await loadBadgeInformation();
                inventory = await loadSCEInventory();
                console.log(badges, inventory);

                badges = $.extend(true, badges, inventory);
                localStorage[StorageKey] = JSON.stringify(badges);
            } catch (error) {
                alert(error);
                return;
            }
        }

        // console.log("Badges:", badges);

        if (!badges) return;

        var yourList = applyBadgeInformationToSetsObject(badges, yours, true, isExtraOnly);
        var theirList = applyBadgeInformationToSetsObject(badges, theirs, false, isExtraOnly);

        console.log("Your list:", yourList, yours);
        console.log("Their list:", theirList, theirs);

        var $yourList = buildList(yourList, true, isExtraOnly);
        var $theirList = buildList(theirList, false, isExtraOnly);

        // console.log("$DisplayList:", $yourList, $theirList);

        $("#SetListContainer, .CardsInSet").remove();
        $(`<div id="SetListContainer" display-type="Html" />`)
            .append("<div><a class='SwitchSetList'>Html</a><a class='SwitchSetList'>Text</a><a class='SwitchSetList'>Markdown</a><a class='SwitchSetList'>SteamCode</a><a class='CloseSetList'>Close</a></div>")
            .append($yourList.attr({ id: "YoursDisplayList" }))
            .append($theirList.attr({ id: "TheirsDisplayList" }))
            .appendTo("body");

        $(".CloseSetList").click(function (ev){
            ev.preventDefault();
            ev.stopPropagation();

            $("#SetListContainer").remove();

            $("#trade_area .item").each(function () {
                $(`<div class="CardsInSet" />`)
                    .text(badges[this.rgItem.market_fee_app].cardsInSet)
                    .appendTo(this.rgItem.element);
            });
        });

        $(".SwitchSetList").click(function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            $("#SetListContainer").attr("display-type", $(this).text());
        });

        $(".AddSetToTradeButton").click(function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var isSelfInventory = $(this).parents("#YoursDisplayList").length == 1;
            var fee = $(this).attr("data-fee");
            var count = $(this).attr("data-count");
            var targetSet = isSelfInventory ? yours[fee] : theirs[fee];
            var targets = [];
            for (var hash in targetSet.items) {
                var instances = targetSet.items[hash].instances;
                var addables = [];
                for (var i = 0; i < instances.length; i++) {
                    var $c = $((isSelfInventory ? "#your_slots" : "#their_slots") + " #item753_6_" + instances[i]);
                    if ($c.length == 0) {
                        addables.push(instances[i]);
                        if (addables.length == count) {
                            break;
                        }
                    }
                }
                if (addables.length != count) {
                    alert("Cards aren't enough to add complete set");
                    return;
                }
                for (var j = 0; j < addables.length; j++) {
                    targets.push(addables[j]);
                }
            }
            for (var n = 0; n < targets.length; n++) {
                MoveItemToTrade($("#item753_6_" + targets[n])[0]);
            }
        });
    }

    var $controllerContainer = $(`<div id="csv-area"><div class="header">Steam, Card sets viewer</div></div>`).appendTo("#inventory_box");

    $("<button />")
        .append("<span>List card sets</span>")
        .addClass(ButtonClass)
        .click(function () {
        try {
            if (isValidSteamInventory()){
                main();
            }
        } catch (error) {
            alert(error);
        }
    })
        .appendTo($controllerContainer);

    $("<button />")
        .append("<span>Clear cache</span>")
        .addClass(ButtonClass)
        .click(() => delete localStorage[StorageKey])
        .appendTo($controllerContainer);

    $(`<input type="checkbox" id="DisplayExtraOnlyCheckbox" />`).appendTo($controllerContainer);
    $(`<label for="DisplayExtraOnlyCheckbox" />`).text("Extra/Necessary only").appendTo($controllerContainer);

    $("<style />").text(`
    #SetListContainer .SetListText,
    #SetListContainer .SetListMarkdown,
    #SetListContainer .SetListSteamCode,
    #SetListContainer .SetListHtml {
        display: none;
    }

    #SetListContainer[display-type=Text] .SetListText,
    #SetListContainer[display-type=Markdown] .SetListMarkdown,
    #SetListContainer[display-type=SteamCode] .SetListSteamCode,
    #SetListContainer[display-type=Html] .SetListHtml {
        display: block;
    }

    #SetListContainer {
        position: fixed;
        z-index: 10000;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #000000dd;
        overflow-y: scroll;
        padding: 24px 40px;
    }
    #SetListContainer pre {
        white-space: pre-wrap;
        word-break: break-all;
    }
    #SetListContainer > div {
        margin-bottom: 24px;
        padding-top: 12px;
    }
    #YoursDisplayList, #TheirsDisplayList {
       position: relative;
       width: 48%;
       float: left;
    }
    #YoursDisplayList::before, #TheirsDisplayList::before {
       display:block;
       position: absolute;
       top: -20px;
       font-size: 51px;
       color: #ff74;
       z-index: -1;
    }
    #YoursDisplayList::before {
       content: "Your's";
    }
    #TheirsDisplayList::before {
       content: "Partner's";
    }
    #TheirsDisplayList::before {
       display: block;
       break: all;
       content: "",
    }
    .AddSetToTradeButton {
        padding: 0 3px;
    }
    .AddSetToTradeButton:disabled {
        opacity: 0.1;
    }
    .SwitchSetList {
        margin-right: 8px;
    }
    .CardsInSet {
        position: absolute;
        font-size: 24px;
        color: #ff7a;
        z-index: 100;
        pointer-events: none;
        top: 0;
        left: 0;
        text-shadow: 1px 1px #000;
    }
    #SetListContainer .SetListText .set,
    #SetListContainer .SetListMarkdown .set,
    #SetListContainer .SetListSteamCode .set {
        display: block;
        white-space: pre;
    }
    #SetListContainer .set.necessary {
        color: yellow;
    }
    #SetListContainer .set.extra {
        color: lime;
    }
    #SetListContainer .set.non-marketable {
        font-weight: bold;
    }
    #csv-area {
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 8px 0;
        margin-bottom: 16px;
    }
    #csv-area .header {
        text-align: center;
        font-size: 18px;
    }
    #csv-area button {
        margin: 8px;
    }
    `).appendTo("head");

    // Your code here...
    // .toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
})();