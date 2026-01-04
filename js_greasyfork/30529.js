// ==UserScript==
// @name         Subeta Searching
// @namespace    http://artees.pw/
// @description  This script searches for shops.
// @version      1.8
// @author       Artees
// @match        *://subeta.net/user_shops.php/mine/*
// @match        *://subeta.net/shop.php?shop*
// @exclude      *quick_stock*
// @exclude      *profits*
// @exclude      *history*
// @exclude      *edit_shop*
// @exclude      *delete_shop*
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/identifier_04_crystal.gif
// ==/UserScript==

const CY = " sP",
    SPLITTER = "    | ",
    XHR = new XMLHttpRequest(),
    KEY_ITEM_DELAY = "itemDelay";

var itemDelay = getFromStorage(localStorage, KEY_ITEM_DELAY, 5),
    itemCountdown = itemDelay,
    loadIntervalId,
    loadIntervalCount = 0;

function parseItems(itemDivs, getPriceField) {
    var prevItem = null,
        firstItem;
    for (var i = 0; i < itemDivs.length; i++) {
        var priceField = getPriceField(itemDivs[i]);
        if (priceField === null) {
            continue;
        }
        var curItem = new Item(itemDivs[i], priceField);
        if (curItem.priceField === null) {
            continue;
        }
        if (prevItem === null) {
            firstItem = curItem;
        } else {
            prevItem.next = curItem;
        }
        prevItem = curItem;
    }
    if (prevItem !== null) {
        prevItem.next = firstItem;
    }
    return firstItem;
}

function getFromStorage(storage, key, defaultValue) {
    if (storage[key] === undefined) {
        return defaultValue;
    } else {
        return typeof defaultValue === "boolean" ? storage[key] === "true" : storage[key];
    }
}

function forEachItem(action) {
    var f = curItem,
        i = f;
    do {
        if (!action(i)) {
            return;
        }
        i = i.next;
    } while (i !== f);
}

function createSpace() {
    var space = document.createElement("SPAN");
    space.innerText = "|";
    space.style = "display: inline-block; width: 50px;";
    return space;
}

function search() {
    var safeName = replaceAll(curItem.name, "%", "%25");
    XHR.open("GET", "https://subeta.net/user_shops.php/search/shops/" + safeName, true);
    XHR.send();
    curItem.priceField.value = curItem.resetPrice();
    curItem.priceField.value += SPLITTER;
    loadIntervalCount = 0;
    loadIntervalId = setInterval(updateSearchProgress, 100);
}

function updateSearchProgress() {
    loadIntervalCount++;
    if (loadIntervalCount > 20) {
        clearInterval(loadIntervalId);
        XHR.abort();
        search();
        return;
    }
    curItem.priceField.value += ".";
}

XHR.onreadystatechange = function setLowestPrice() {
    if (XHR.readyState !== XMLHttpRequest.DONE || XHR.status !== 200) return;
    clearInterval(loadIntervalId);
    var pricesText = XHR.responseText.split(CY),
        prices = [];
    for (var i = 0; i < pricesText.length; i++) {
        var priceWithCommas = pricesText[i].substring(pricesText[i].lastIndexOf(">") + 1),
            priceText = replaceAll(priceWithCommas, ",", ""),
            price = parseInt(priceText);
        if (isNaN(price)) continue;
        var isNPC = pricesText[i].indexOf("(NPC Shop)") !== -1,
            priceObject = new Price(price, isNPC);
        prices.push(priceObject);
    }
    if (prices.length > 0) {
        prices.sort(compareNumbers);
    }
    filterPrices(prices);
    curItem = curItem.next;
    if (curItem.onSelect()) {
        itemIntervalId = setInterval(updateItemCountdown, 1000);
    }
};

function Price(value, isNPC) {
    this.isNPC = function () {
        return isNPC;
    };
    this.valueOf = function () {
        return value;
    };
    this.toString = function () {
        return value.toString();
    };
}

function replaceAll(target, searchValue, replaceValue) {
    return target.replace(new RegExp(searchValue, 'g'), replaceValue);
}

function compareNumbers(a, b)
{
    return a - b;
}

function updateItemCountdown() {
    curItem.priceField.value = curItem.resetPrice() + SPLITTER + itemCountdown;
    itemCountdown--;
    if (itemCountdown >= 0) return;
    curItem.priceField.value = curItem.resetPrice();
    itemCountdown = itemDelay;
    clearInterval(itemIntervalId);
    search();
}