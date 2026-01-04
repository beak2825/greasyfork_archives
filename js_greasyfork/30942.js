// ==UserScript==
// @name         Subeta Autoquest
// @namespace    http://artees.pw/
// @description  This script automatically completes NPC quests.
// @version      1.10
// @author       Artees
// @match        *://subeta.net/quests.php/*
// @match        *://subeta.net/user_shops.php/search/shops/*
// @match        *://subeta.net/shop.php?shopid=*
// @require      https://greasyfork.org/scripts/30529-subeta-searching/code/Subeta%20Searching.js?version=203734
// @require      https://greasyfork.org/scripts/30965-subeta-autobuy/code/Subeta%20Autobuy.js?version=203424
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       http://img.subeta.net/items/bobblehead_sarah.gif
// @downloadURL https://update.greasyfork.org/scripts/30942/Subeta%20Autoquest.user.js
// @updateURL https://update.greasyfork.org/scripts/30942/Subeta%20Autoquest.meta.js
// ==/UserScript==

const MAX_PRICE = Infinity;

const FINISH = "/finish",
    START = "Start Quest!",
    QUEST_GIVERS = ["carl", "cinthia", "cursed", "library", "maleria", "pete", "quentin",
        "saggitarius", "sarah", "wizard"];

var curItem = parseItemsForAutoquest(),
    total = 0,
    isAllowedToBuy = true,
    warningText = null;

function parseItemsForAutoquest() {
    if (document.body.textContent.indexOf("bring me") === -1) {
        return null;
    }
    var itemDivs = document.getElementsByClassName("wl_item");
    function getPriceField(itemDiv) {
        if (itemDiv.nextSibling.nodeName !== "P") return null;
        return new PriceField(itemDiv);
    }
    if (itemDivs.length === 0) {
        return null;
    }
    var firstItem = parseItems(itemDivs, getPriceField);
    if (firstItem === undefined) return null;
    firstItem.onSelect = buy;
    return firstItem;
}

function buy() {
    if (!isAllowedToBuy || curItem === undefined) return false;
    sessionStorage[KEY_AUTOBUY_SOURCE] = location.href;
    setTimeout(openSearch, 1000);
    function openSearch() {
        open("https://subeta.net/user_shops.php/search/shops/" + curItem.name, "_self");
    }
    return false;
}

autobuy();

function Item(itemDiv, priceField) {
    this.name = itemDiv.getElementsByTagName("img")[0].id;
    this.next = null;
    this.priceField = priceField;
    this.resetPrice = function () {
        var end = this.priceField.value.indexOf(CY) + CY.length;
        return this.priceField.value.substring(0, end);
    };
    this.priceField.value = this.resetPrice();
    this.onSelect = function() {
        return true;
    };
}

function PriceField(itemDiv) {
    var label = itemDiv.nextSibling,
        name = label.innerText + "\n",
        v = "";
    return {
        get value() {
            return v;
        },
        set value(value) {
            v = value;
            label.innerText = name + v;
        },
        get style() {
            return label.style;
        },
        set style(value) {
            label.style = value;
        }
    };
}

start();

function start() {
    var buttons = document.getElementsByClassName("ui button teal"),
        startButton = null;
    for (var i = 0; i < buttons.length; i++) {
        startButton = buttons[i];
        if (startButton.value !== START) continue;
        startButton.click();
        break;
    }
}

setTimeout(checkInventory, 500);

function checkInventory() {
    if (curItem === null) return;
    var xhr = new XMLHttpRequest();
    send();
    function send() {
        xhr.open("GET", "https://subeta.net/inventory.php", true);
        xhr.send();
    }
    var inventoryTimeoutId = setTimeout(resend, 2000);
    function resend() {
        xhr.abort();
        send();
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status !== 200) return;
        clearTimeout(inventoryTimeoutId);
        var inventoryText = xhr.responseText,
            itemsCount = removeAvailableItems(inventoryText);
        if (itemsCount === 0) {
            curItem = null;
            open(location.href + FINISH, "_self");
            return;
        }
        checkAvailableSpace(inventoryText, itemsCount);
    };
    function removeAvailableItems(inventoryText) {
        var itemsCount = 0,
            toRemove = [];
        forEachItem(checkItems);
        function checkItems(i) {
            var next = i.next,
                from = inventoryText.indexOf("User Price");
            if (inventoryText.indexOf("'" + next.name + "'", from) === -1) {
                itemsCount++;
                return true;
            }
            next.priceField.value = "You have this item";
            next.priceField.style.color = "green";
            toRemove.push(i);
            return true;
        }
        for (var i = 0; i < toRemove.length; i++) {
            var item = toRemove[i],
                next = item.next,
                nextNext = next.next;
            item.next = nextNext;
            if (curItem === next) {
                curItem = nextNext;
                curItem.onSelect = buy;
            }
        }
        return itemsCount;
    }
    function checkAvailableSpace(inventoryText, itemsCount) {
        var startText = "You have <b>",
            start = inventoryText.indexOf(startText),
            endText = "</b> items on hand.",
            end = inventoryText.indexOf(endText, start),
            itemsText = inventoryText.substring(start + startText.length, end),
            items = parseInt(itemsText);
        if (items <= 100 - itemsCount) {
            search();
            return;
        }
        showWarning(startText + itemsText + endText, "red");
    }
}

function showWarning(text, color) {
    if (warningText === null) {
        createWarning();
    }
    function createWarning() {
        var message = document.getElementsByClassName("ui message");
        warningText = document.createElement("P");
        if (message.length > 0) {
            message[0].appendChild(warningText);
            return;
        }
        message = document.getElementsByClassName("ten wide column");
        if (message.length > 0) {
            message[0].getElementsByTagName("p")[1].appendChild(warningText);
        }
    }
    warningText.innerHTML = "<br>" + text;
    warningText.style.color = color;
    if (color !== "red") return;
    var ex = true;
    setInterval(blink, 500);
    function blink() {
        var exStr = ex ? "!" : " ";
        ex = !ex;
        document.title = "(" + exStr + ") " + warningText.innerText;
    }
}

function filterPrices(prices) {
    if (prices.length > 0) {
        var lowest = prices[0].valueOf();
        curItem.priceField.value = lowest + CY;
        checkIfTooExpensive(lowest);
        checkIfEnoughSp(lowest);
    } else {
        curItem.priceField.value = "?";
        curItem.priceField.style.color = "red";
        showWarning("Failed to load prices.", "red");
        isAllowedToBuy = false;
    }
    function checkIfTooExpensive(lowest) {
        if (lowest > MAX_PRICE) {
            curItem.priceField.style.color = "red";
            isAllowedToBuy = false;
            open(location.href + "/quit", "_self");
        }
    }
    function checkIfEnoughSp(lowest) {
        total += lowest;
        var spText = document.getElementsByClassName("widget-login-sp")[0].innerText,
            sp = parseInt(replaceAll(spText, ",", ""));
        if (total > sp) {
            showWarning("Not enough sP!", "red");
            isAllowedToBuy = false;
        }
    }
}

if (!returnToShinwa()) {
    backToQuests();
    goToNextQuestGiver();
}

function returnToShinwa() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].innerText.indexOf("Return this") === -1) continue;
        links[i].click();
        return true;
    }
    return false;
}

function backToQuests() {
    var href = location.href;
    if (href.indexOf(FINISH) !== -1) {
        open(href.replace(FINISH, ""), "_self");
    }
    if (document.body.textContent.indexOf("Out of Time!") !== -1) {
        open(href, "_self");
    }
}

function goToNextQuestGiver() {
    if (!isComplete(document.body.innerHTML)) return;
    var xhr = new XMLHttpRequest(),
        i = 0;
    checkIfComplete();
    function checkIfComplete() {
        xhr.open("GET", "https://subeta.net/quests.php/" + QUEST_GIVERS[i], true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status !== 200) return;
            if (isComplete(xhr.responseText)) {
                i++;
                if (i >= QUEST_GIVERS.length) {
                    completeAll();
                    return;
                }
                checkIfComplete();
                return;
            }
            open(QUEST_GIVERS[i], "_self");
        };
    }
    function completeAll() {
        setTimeout(goToShinwa, 3600000);
        function goToShinwa() {
            open("https://subeta.net/explore/goddess.php", "_self");
        }
        var d = new Date(),
            h = d.getHours() + 1,
            m = d.getMinutes(),
            warning = "All quests are completed! Next try: " + h.toString() + ":" + m.toString();
        showWarning(warning, "green");
    }
}

function isComplete(docText) {
    if (docText.indexOf(START) !== -1) return false;
    return !(docText.indexOf("See Other Quests") === -1 &&
    docText.indexOf("Back to Last Page") === -1);
}