// ==UserScript==
// @name         Subeta Sorting
// @namespace    http://artees.pw/
// @description  This script sorts NPC shops prices by profit.
// @version      1.8
// @author       Artees
// @match        *://subeta.net/shop.php?shop*
// @require      https://greasyfork.org/scripts/30529-subeta-searching/code/Subeta%20Searching.js?version=203734
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/bottle_apothecary_06.gif
// @downloadURL https://update.greasyfork.org/scripts/30530/Subeta%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/30530/Subeta%20Sorting.meta.js
// ==/UserScript==

const KEY_MIN_PROFIT = "minProfit",
    KEY_MAX_ITEMS = "maxItems",
    KEY_BUYING = "buying",
    KEY_SHOP_URL = "shopUrl";

var curItem = parseItemsForSorting(),
    sortedItems = [],
    minProfit = getFromStorage(localStorage, KEY_MIN_PROFIT, 0),
    maxItems = getFromStorage(localStorage, KEY_MAX_ITEMS, 10),
    buyCountdown = null,
    isBuying = getFromStorage(localStorage, KEY_BUYING, false),
    buyingIntervalId = 0,
    buyingTimeoutId = 0,
    isSortingComplete = false,
    pricedCount = 0;

function parseItemsForSorting() {
    var itemDivs = document.getElementsByClassName("two wide column");
    if (itemDivs.length === 0 || itemDivs[0].getElementsByTagName("form").length === 0) return null;
    function getPriceField(itemDiv) {
        return new PriceField(itemDiv);
    }
    return parseItems(itemDivs, getPriceField);
}

function Item(itemDiv, priceField) {
    var start = itemDiv.innerHTML.indexOf("<br>"),
        end = itemDiv.innerHTML.indexOf("<br>", start + 4);
    this.itemDiv = itemDiv;
    this.name = replaceAll(itemDiv.innerHTML.substring(start + 4, end), "	", "");
    this.name = replaceAll(this.name, "\n", "");
    this.cacheKey = "c " + this.name;
    this.next = null;
    this.isPriced = false;
    this.priceField = priceField;
    this.resetPrice = function () {
        var end = this.priceField.value.indexOf(CY) + CY.length;
        return this.priceField.value.substring(0, end);
    };
    this.priceField.value = this.resetPrice();
    this.getPrice = function () {
        var priceString = replaceAll(this.resetPrice(), ",", "");
        return parseInt(priceString);
    };
    this.actualPrice = this.getPrice();
    var isComplete = true;
    this.onSelect = function() {
        isComplete = true;
        forEachItem(getNext);
        if (isComplete) {
            isSortingComplete = true;
            switchBuying();
        }
        return !isComplete;
    };
    function getNext(i) {
        if (i === null || !i.isPriced) {
            curItem = i;
            isComplete = false;
            return false;
        }
        return true;
    }
}

function PriceField(itemDiv) {
    var label = itemDiv.getElementsByTagName("b")[0];
    return {
        get value() {
            return label.innerText;
        },
        set value(value) {
            label.innerText = value;
        },
        get style() {
            return label.style;
        },
        set style(value) {
            label.style = value;
        }
    };
}

createUI();

function createUI() {
    var s = document.getElementsByClassName("shop_item_container")[0];
    if (s === undefined) {
        goBackAfterBuying();
        return;
    }
    var ui = s.insertBefore(document.createElement("div"), s.firstChild);
    ui.appendChild(document.createTextNode("Delay: "));
    var itemDelayInput = document.createElement("INPUT");
    itemDelayInput.value = itemDelay + " sec.";
    itemDelayInput.onchange = function () {
        itemDelay = parseInt(this.value);
        localStorage[KEY_ITEM_DELAY] = itemDelay;
    };
    ui.appendChild(itemDelayInput);
    ui.appendChild(createSpace());
    var button = document.createElement("a");
    button.className = "ui button tiny";
    button.innerText = "Purge Cache";
    button.onclick = function () {
        forEachItem(function (i) {
            localStorage.removeItem(i.cacheKey);
            location.reload();
            return true;
        });
    };
    ui.appendChild(button);
    ui.appendChild(document.createElement("br"));
    var autobuy = document.createElement("input");
    autobuy.type = "checkbox";
    autobuy.checked = isBuying;
    autobuy.onchange = function () {
        isBuying = this.checked;
        localStorage[KEY_BUYING] = isBuying;
        switchBuying();
    };
    ui.appendChild(autobuy);
    ui.appendChild(document.createTextNode(" Autobuy"));
    ui.appendChild(createSpace());
    ui.appendChild(document.createTextNode("Min profit: "));
    var minProfitInput = document.createElement("INPUT");
    minProfitInput.value = minProfit + CY;
    minProfitInput.onchange = function () {
        minProfit = parseInt(this.value);
        localStorage[KEY_MIN_PROFIT] = minProfit;
        switchBuying();
    };
    ui.appendChild(minProfitInput);
    ui.appendChild(createSpace());
    ui.appendChild(document.createTextNode("Number of items: "));
    var maxItemsInput = document.createElement("INPUT");
    maxItemsInput.value = maxItems;
    maxItemsInput.onchange = function () {
        maxItems = parseInt(this.value);
        localStorage[KEY_MAX_ITEMS] = maxItems;
        switchBuying();
    };
    ui.appendChild(maxItemsInput);
    ui.appendChild(createSpace());
    buyCountdown = document.createTextNode("Disabled");
    ui.appendChild(buyCountdown);
}

loadCache();

function loadCache() {
    forEachItem(function (i) {
        if (i === null) return false;
        if (localStorage[i.cacheKey] !== undefined) {
            var profit = getFromStorage(localStorage, i.cacheKey, 0) - i.getPrice();
            setProfit(i, profit);
        }
        return true;
    });
    sortPrices();
}

function setProfit(item, profit) {
    item.priceField.value = profit + CY;
    item.priceField.style.color = profit > 0 ? "green" : "red";
    item.isPriced = true;
    pricedCount++;
}

if (curItem !== null && curItem.onSelect()) {
    search();
}

function filterPrices(prices) {
    if (prices.length > 0) {
        for (var i = 0; i < prices.length; i++) {
            var price = prices[i];
            if (price.isNPC()) continue;
            localStorage[curItem.cacheKey] = price.valueOf();
            var profit = price.valueOf() - curItem.getPrice();
            setProfit(curItem, profit);
            break;
        }
    } else {
        curItem.priceField.value = "(!) " + curItem.resetPrice() + CY;
        curItem.priceField.style.color = "orange";
    }
    sortPrices();
}

function sortPrices() {
    sortedItems = [];
    forEachItem(function (i) {
        if (i === null) return false;
        sortedItems.push(i);
        return true;
    });
    sortedItems.sort(comparePrices);
    function comparePrices(a, b) {
        if (!b.isPriced) return -1e100;
        if (!a.isPriced) return 1e100;
        return b.getPrice() - a.getPrice();
    }
    for (var i = 0; i < sortedItems.length; i++) {
        sortedItems[i].itemDiv.parentNode.appendChild(sortedItems[i].itemDiv);
    }
    switchBuying();
}

function switchBuying() {
    if (buyCountdown === null) return;
    highlightItems();
    function highlightItems() {
        for (var i = 0; i < sortedItems.length; i++) {
            var item = sortedItems[i];
            item.priceField.style.fontWeight =
                (item.isPriced && item.getPrice() < minProfit) ? "normal" : "bold";
        }
    }
    var item = getMostProfitableItem();
    function getMostProfitableItem() {
        var spText = document.getElementsByClassName("widget-login-sp")[0].innerText,
            sp = parseInt(replaceAll(spText, ",", ""));
        for (var i = 0; i < sortedItems.length; i++) {
            if (sortedItems[i].actualPrice <= sp) {
                return sortedItems[i];
            }
        }
        return null;
    }
    if (!isBuying || !isSortingComplete || maxItems <= 0 || item === null ||
        item.getPrice() < minProfit) {
        clearInterval(buyingIntervalId);
        clearTimeout(buyingTimeoutId);
        if (isBuying && isSortingComplete && maxItems > 0 && item !== null) {
            buyCountdown.data = "Go to random shop...";
            goToNextShop();
        }
        else {
            buyCountdown.data =
                (isSortingComplete || !isBuying) ? "Disabled" : getProgress();
        }
        if (item === null) {
            buyCountdown.data = "Not enough sP!";
        }
        return;
    }
    function getProgress() {
        var k = 8,
            p = Math.floor(pricedCount/k),
            l = Math.floor(sortedItems.length/k) - p;
        return "Sorting " + new Array(p).join("█") + new Array(l).join("░");
    }
    var count = 5;
    buyCountdown.data = count.toString();
    buyingIntervalId = setInterval(buyItem, 1000);
    function buyItem() {
        count--;
        buyCountdown.data = count.toString();
        if (count > 0) return;
        clearInterval(buyingIntervalId);
        buyCountdown.data = "Buying...";
        sessionStorage[KEY_SHOP_URL] = location.href;
        buyingTimeoutId = setTimeout(click, 1000);
        function click() {
            maxItems--;
            localStorage[KEY_MAX_ITEMS] = maxItems;
            item.itemDiv.getElementsByClassName("ui image")[0].click();
        }
    }
}

function goToNextShop() {
    var shops = [36, 31, 28, 30, 32, 41, 11, 14, 34, 6, 29, 37, 16, 5, 19, 2, 22, 46, 49, 40,
            24, 45, 26, 23, 12, 44, 27, 39, 42, 9, 21, 4, 17, 20, 47, 25],
        url = location.href.split("="),
        iNext = Math.floor(Math.random()*shops.length),//shops.indexOf(parseInt(url[1])) + 1,
        next = url[0] + "=" + shops[(iNext >= shops.length) ? 0 : iNext].toString();
    open(next, "_self");
}

function goBackAfterBuying() {
    var url = sessionStorage[KEY_SHOP_URL];
    if (url === undefined) return;
    sessionStorage.removeItem(KEY_SHOP_URL);
    open(url, "_self");
}

onComplete();

function onComplete() {
    if (document.body.textContent.indexOf("There are no items stocked") > -1) {
        goToNextShop();
    }
}