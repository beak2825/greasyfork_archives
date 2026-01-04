// ==UserScript==
// @name         Subeta Autopricing
// @namespace    http://artees.pw/
// @description  This script automatically sets prices.
// @version      1.4
// @author       Artees
// @match        *://subeta.net/user_shops.php/mine/*
// @exclude      *quick_stock*
// @exclude      *profits*
// @exclude      *history*
// @exclude      *edit_shop*
// @exclude      *delete_shop*
// @require      https://greasyfork.org/scripts/30529-subeta-searching/code/Subeta%20Searching.js?version=203734
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       http://img.subeta.net/shop_norm.gif
// @downloadURL https://update.greasyfork.org/scripts/30449/Subeta%20Autopricing.user.js
// @updateURL https://update.greasyfork.org/scripts/30449/Subeta%20Autopricing.meta.js
// ==/UserScript==

const KEY_LOOP = "loop",
    KEY_SHOP_DELAY = "shopDelay",
    KEY_SUBMIT = "submit",
    KEY_SUBMITTED = "submitted";

var curItem = parseItemsForAutopricing(),
    itemIntervalId,
    shopIntervalId,
    shopDelay = getFromStorage(localStorage, KEY_SHOP_DELAY, 15*60),
    shopCountdown = shopDelay,
    shopCountdownText,
    loop = getFromStorage(sessionStorage, KEY_LOOP, 1),
    submit = getFromStorage(localStorage, KEY_SUBMIT, false),
    priceDefaultStyle;

function parseItemsForAutopricing() {
    var itemDivs = document.getElementsByClassName("wl_item");
    function getPriceField(itemDiv) {
        var itemId = itemDiv.getAttribute("data-itemid");
        return document.getElementById("sp_price_" + itemId);
    }
    var firstItem = parseItems(itemDivs, getPriceField);
    firstItem.onSelect = function() {
        if (submit) {
            sessionStorage[KEY_SUBMITTED] = true;
            document.getElementsByClassName("ui button large")[0].click();
        } else {
            goToNextPage();
        }
        return false;
    };
    priceDefaultStyle = firstItem.priceField.style;
    return firstItem;
}

function Item(itemDiv, priceField) {
    var itemName = itemDiv.getElementsByTagName("img")[0].id;
    this.name = itemName;
    this.next = this;
    this.priceField = priceField;
    this.priceField.autocomplete = "off";
    this.resetPrice = function () {
        var end = this.priceField.value.indexOf(CY) + CY.length;
        return this.priceField.value.substring(0, end);
    };
    this.priceField.value = this.resetPrice();
    this.getPrice = function () {
        var priceString = replaceAll(this.resetPrice(), ",", "");
        return parseInt(priceString);
    };
    var initPrice = createInitPriceField(this);
    this.initPrice = initPrice;
    function createInitPriceField(i) {
        var td = document.createElement("TD");
        td.className = "text-center";
        td.style = "vertical-align: middle;";
        var initPrice = document.createElement("INPUT");
        initPrice.value = getFromStorage(localStorage, itemName, i.resetPrice());
        td.appendChild(initPrice);
        var removeHeader = i.priceField.parentNode.parentNode.lastChild.previousSibling;
        i.priceField.parentNode.parentNode.insertBefore(td, removeHeader);
        return initPrice;
    }
    this.saveInitPriceToLocal = function () {
        localStorage[itemName] = initPrice.value;
    };
    this.initPrice.onchange = this.saveInitPriceToLocal;
    this.saveInitPriceToLocal();
    this.getInitPrice = function () {
        return parseInt(this.initPrice.value);
    };
    this.onSelect = function() {
        return true;
    };
}

createUI();

function createUI() {
    var forms = document.getElementsByTagName("form");
    for (var i = 0; i < forms.length; i++) {
        var f = forms[i];
        if (f.method !== "post" || f.hasAttribute("id")) continue;
        f.insertBefore(document.createTextNode(" Auto Submit to Server"), f.firstChild);
        var submitCheckbox = document.createElement("INPUT");
        submitCheckbox.type = "checkbox";
        submitCheckbox.checked = submit;
        submitCheckbox.onchange = function () {
            submit = this.checked;
            localStorage[KEY_SUBMIT] = submit;
        };
        f.insertBefore(submitCheckbox, f.firstChild);
        f.insertBefore(createSpace(), f.firstChild);
        shopCountdownText = document.createTextNode("");
        f.insertBefore(shopCountdownText, f.firstChild);
        f.insertBefore(document.createTextNode("Next Shop Repricing: "), f.firstChild);
        f.insertBefore(createSpace(), f.firstChild);
        var shopDelayInput = document.createElement("INPUT");
        shopDelayInput.style = priceDefaultStyle;
        shopDelayInput.value = shopDelay/60 + " min.";
        shopDelayInput.onchange = function () {
            shopDelay = parseInt(this.value)*60;
            shopCountdown = Math.min(shopCountdown, shopDelay);
            localStorage[KEY_SHOP_DELAY] = shopDelay;
        };
        f.insertBefore(shopDelayInput, f.firstChild);
        f.insertBefore(document.createTextNode("Delay In-Between Shop Repricings: "), f.firstChild);
        f.insertBefore(createSpace(), f.firstChild);
        var itemDelayInput = document.createElement("INPUT");
        itemDelayInput.style = priceDefaultStyle;
        itemDelayInput.value = itemDelay + " sec.";
        itemDelayInput.onchange = function () {
            itemDelay = parseInt(this.value);
            localStorage[KEY_ITEM_DELAY] = itemDelay;
        };
        f.insertBefore(itemDelayInput, f.firstChild);
        f.insertBefore(document.createTextNode("Delay In-Between Item Repricings: "), f.firstChild);
        f.insertBefore(createSpace(), f.firstChild);
        f.insertBefore(document.createTextNode(loop + " Loop"), f.firstChild);
        break;
    }
    function createSpace() {
        var space = document.createElement("SPAN");
        space.innerText = "|";
        space.style = "display: inline-block; width: 50px;";
        return space;
    }
    var pagination = document.getElementsByClassName("ui menu pagination small")[0];
    if (pagination === undefined) {
        shopCountdownText.data = "░";
        return;
    }
    var pages = pagination.getElementsByTagName("a"),
        curPage = parsePage(location.href) - 1;
    var pagesNum = [];
    for (var iP = 0; iP < pages.length; iP++) {
        pagesNum.push(parsePage(pages[iP].href));
    }
    function parsePage(href) {
        var p = parseInt(href.substring(href.indexOf("=") + 1));
        return isNaN(p) ? 0 : p;
    }
    pagesNum.sort(compareNumbers);
    shopCountdownText.data = new Array(curPage + 1).join("█") +
        new Array(pagesNum[pagesNum.length - 1] - curPage + 1).join("░");
}

createInitPriceHeader();

function createInitPriceHeader() {
    var t = document.getElementsByClassName("text-center col-md-2");
    for (var i = 0; i < t.length; i++) {
        if (t[i].innerText.indexOf("Price") === -1) continue;
        var th = document.createElement("TH");
        th.className = "text-center col-md-2";
        th.innerHTML = "Initial Price <br>";
        t[i].parentNode.insertBefore(th, t[i + 1]);
        var button = document.createElement("a");
        button.className = "ui button tiny";
        button.innerText = "set all to current";
        button.onclick = function () {
            forEachItem(function (i) {
                i.initPrice.value = i.resetPrice();
                i.saveInitPriceToLocal();
                return true;
            });
        };
        th.appendChild(button);
        return;
    }
}

if (sessionStorage[KEY_SUBMITTED] !== undefined) {
    sessionStorage.removeItem(KEY_SUBMITTED);
    goToNextPage();
} else {
    search();
}

function goToNextPage() {
    var nextPage = document.getElementsByClassName("item next-page");
    if (nextPage.length === 0) {
        shopCountdown = shopDelay;
        shopIntervalId = setInterval(updateShopCountdown, 1000);
    } else {
        open(nextPage[0].href, "_self");
    }
}

function updateShopCountdown() {
    shopCountdown--;
    var minutes = Math.floor(shopCountdown/60);
    shopCountdownText.data = minutes + ":" + (shopCountdown - minutes * 60);
    if (shopCountdown > 0) return;
    shopCountdown = shopDelay;
    clearInterval(shopIntervalId);
    loop++;
    sessionStorage[KEY_LOOP] = loop;
    open(location.href.split("?")[0], "_self");
}

function filterPrices(prices) {
    if (prices.length > 0) {
        //var lowestPrice = prices[0];
        var lowestPrice = protectFromLowPrices(prices);
        curItem.priceField.value = (lowestPrice <= 10000 ? 0 : lowestPrice) + CY;
        curItem.priceField.style.color = "green";
    } else {
        curItem.priceField.value = curItem.resetPrice();
        curItem.priceField.style.color = "red";
    }
}

function protectFromLowPrices(prices) {
    for (var i = 0; i < prices.length; i++) {
        if (prices[i].isNPC()) continue;
        if (prices[i].valueOf() < curItem.getInitPrice() * 0.2) continue;
        return prices[i].valueOf();
    }
    return curItem.getPrice();
}