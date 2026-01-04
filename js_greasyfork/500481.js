// ==UserScript==
// @name         Torn Bazaar Filler (radio)
// @namespace    https://github.com/SOLiNARY
// @version      0.9.1
// @description  On "Fill" click autofills bazaar item price with lowest bazaar price currently minus $1 (can be customised), shows current price coefficient compared to 3rd lowest, fills max quantity for items, marks checkboxes for guns.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/500481/Torn%20Bazaar%20Filler%20%28radio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500481/Torn%20Bazaar%20Filler%20%28radio%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let item_data = {};
    let item_deltas = {};
    let item_checked = {};
    let item_prices = {}
    let items_json = GM_getValue("TBF_Deltas", "");

    if (items_json.length > 0) {
        try {
            item_deltas = JSON.parse(items_json);
        }
        catch (e) {
        }
    }

    const itemDataUrl = "https://api.torn.com/torn/?selections=items&key={apiKey}";
    const bazaarUrl = "https://api.torn.com/market/{itemId}?selections=bazaar&key={apiKey}";
    let priceDeltaRaw = localStorage.getItem("silmaril-torn-bazaar-filler-price-delta") ?? '-1';
    let apiKey = localStorage.getItem("silmaril-torn-bazaar-filler-apikey");

    try {
        GM_registerMenuCommand('Set Price Delta', setPriceDelta);
        GM_registerMenuCommand('Set Api Key', function() { checkApiKey(false); });
    } catch (error) {
        console.log('[TornBazaarFiller] Tampermonkey not detected!');
    }

    // TornPDA support for GM_addStyle
    let GM_addStyle = function (s) {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = s;
        document.head.appendChild(style);
    };

    GM_addStyle(`
.btn-wrap.torn-bazaar-fill-qty-price {
	float: right;
    margin-left: auto;
    z-index: 99999;
}

.ff-btn {
    padding-right: 2px;
    padding-left: 2px;
}

.btn-wrap.torn-bazaar-clear-qty-price {
    z-index: 99999;
}

div.title-wrap div.name-wrap {
	display: flex;
    justify-content: flex-end;
}

.wave-animation {
  position: relative;
  overflow: hidden;
}

.wave {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 33px;
  background-color: transparent;
  opacity: 0;
  transform: translateX(-100%);
  animation: waveAnimation 1s cubic-bezier(0, 0, 0, 1);
}

@keyframes waveAnimation {
  0% {
    opacity: 1;
    transform: translateX(-100%);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

.overlay-percentage {
    position: absolute;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 0px 5px;
    border-radius: 15px;
    font-size: 10px;
}

.overlay-percentage-add {
    right: -30px;
}

.overlay-percentage-manage {
    right: 0px;
}

.TBF_update {
    position: absolute;
	right: 5px;
}

.TBF_infowrap_relative {
    position: relative;
    align-items: center;
}

.TBF_control {
    display: flex;
    flex-direction: row;
     justify-content: space-around;
     align-items: center;
}

.TBF_title {
    font-weight: bold;
}

.hidden {
    display: none;
}
`);

    const pages = { "AddItems": 10, "ManageItems": 20};
    const addItemsLabels = ["Fill", "Clear"];
    const updateItemsLabels = ["Update", "Clear"];

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;

    const observerTarget = $(".content-wrapper")[0];
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };

    const observer = new MutationObserver(function(mutations) {
        let mutation = mutations[0].target;
        if (mutation.classList.contains("items-cont") || mutation.className.indexOf("core-layout___") > -1 || mutation.classList.contains('ReactVirtualized__Grid__innerScrollContainer')) {
            $("ul.ui-tabs-nav").on("click", "li:not(.ui-state-active):not(.ui-state-disabled):not(.m-show)", function() {
                observer.observe(observerTarget, observerConfig);
            });
            $("div[class*=topSection___]").on("click", "div[class*=linksContainer___] a[aria-labelledby=add-items]", function(){
                observer.observe(observerTarget, observerConfig);
            });
            $("div[class*=topSection___]").on("click", "div[class*=listItem___] a[aria-labelledby=add-items]", function(){
                observer.observe(observerTarget, observerConfig);
            });
            $("div[class*=topSection___]").on("click", "div[class*=linksContainer___] a[aria-labelledby=manage-items]", function(){
                observer.observe(observerTarget, observerConfig);
            });
            $("div[class*=topSection___]").on("click", "div[class*=listItem___] a[aria-labelledby=manage-items]", function(){
                observer.observe(observerTarget, observerConfig);
            });

            let pageType = pages.AddItems;

            let containerItems = $("ul.items-cont li.clearfix");
            let containerItemsManage = $("div[class*=row___]");

            if (containerItemsManage.find("div[class*=item___] div[class*=desc___]").length > 0)
            {
                pageType = pages.ManageItems;
            }
            else
            {
                getItemData();
            }

            if (!document.querySelector('.TBF_control')) {
                const itemsFooterDiv = document.querySelector("div.items-wrap.view-2 div div.items-footer.clearfix") || document.querySelector("[class^='confirmation___']");
                const TBF_control = document.createElement('div');
                TBF_control.className = "items-footer";
                TBF_control.classList.add('TBF_control');
                if (itemsFooterDiv) {
                    itemsFooterDiv.after(TBF_control);
                }
                const TBF_update = document.createElement('input');
                TBF_update.type = "button";
                TBF_update.value = "Update Values";
                TBF_update.className = 'torn-btn';
                TBF_control.appendChild(TBF_update);
                const TBF_div = document.createElement('div');
                TBF_div.className = "TBF_title";
                TBF_div.innerHTML = "Torn Bazaar Filler";
                TBF_control.appendChild(TBF_div);
                const TBF_addAll = document.createElement('input');
                TBF_addAll.type = "button";
                TBF_addAll.value = "Select All";
                TBF_addAll.className = 'torn-btn';
                TBF_addAll.classList.add("TBF_add_all_btn");
                TBF_control.appendChild(TBF_addAll);
                const TBF_removeAll = document.createElement('input');
                TBF_removeAll.type = "button";
                TBF_removeAll.value = "Remove All";
                TBF_removeAll.className = 'torn-btn';
                TBF_removeAll.classList.add("TBF_remove_all_btn");
                TBF_control.appendChild(TBF_removeAll);

                $(TBF_update).on("click", function(event) {
                    updateAllValues(TBF_div, pageType);
                });
                $(TBF_addAll).on("click", function(event) {
                    selectAllItems(pageType);
                });

                $(TBF_removeAll).on("click", function(event) {
                    unSelectAllItems(pageType);
                });
            }

            containerItems.find("div.title-wrap div.name-wrap").each(function(){
                let isParentRowDisabled = this.parentElement.parentElement.classList.contains("disabled");
                let alreadyHasFillBtn = this.querySelector(".btn-wrap.torn-bazaar-fill-qty-price") != null;
                if (!alreadyHasFillBtn && !isParentRowDisabled){
                    insertFillAndWaveBtn(this, addItemsLabels, pages.AddItems);
                }
            });

            containerItemsManage.find("div[class*=item___] div[class*=desc___]").each(function(){
                let alreadyHasUpdateBtn = this.querySelector(".btn-wrap.torn-bazaar-fill-qty-price") != null;
                if (!alreadyHasUpdateBtn) {
                    insertFillAndWaveBtn(this, updateItemsLabels, pages.ManageItems);
                }
            });
        }
    });
    observer.observe(observerTarget, observerConfig);

    function selectAllItems(pageType) {
        var selects = document.querySelectorAll('.TBF_select');

        selects.forEach((element) => {
            if (element.dataset.pageType && element.dataset.pageType == pages.AddItems)
            {
                if (window.getComputedStyle(element.parentElement.parentElement.parentElement.parentElement.parentElement, null).display !== "none") {
                    element.checked = true;
                    item_checked[element.dataset.iid] = true;
                    item_prices[element.dataset.iid] = {};
                    fillQuantityOnly(element, item_data.items[element.dataset.iid].market_value || 1, pages.AddItems);
                }
            }
            else
            {
                item_checked[element.dataset.iid] = true;
                item_prices[element.dataset.iid] = {};
                element.checked = true;
            }
        });
        if (pageType == pages.ManageItems) {
            setTimeout(function() {
                if ((window.innerHeight + Math.round(window.scrollY)) < (document.body.offsetHeight * 0.99))
                {
                    window.scrollBy({
                        top: window.innerHeight,
                        left: 0,
                        behavior: "smooth",
                    });
                    selectAllItems(pageType);
                }
            }, 500);
        }
    }

    function unSelectAllItems(pageType) {
        var selects = document.querySelectorAll('.TBF_select');

        selects.forEach((element) => {
            if (element.dataset.pageType && element.dataset.pageType == pages.AddItems)
            {
                if (window.getComputedStyle(element.parentElement.parentElement.parentElement.parentElement.parentElement, null).display !== "none") {
                    element.checked = false;
                    item_checked[element.dataset.iid] = false;
                    delete item_prices[element.dataset.iid];
                    clearQuantityOnly(element);
                }
            }
            else
            {
                item_checked[element.dataset.iid] = false;
                delete item_prices[element.dataset.iid];
                element.checked = false;
            }
        });
        if (pageType == pages.ManageItems) {
            setTimeout(function() {
                if ((window.innerHeight + Math.round(window.scrollY)) < (document.body.offsetHeight * 0.99))
                {
                    window.scrollBy({
                        top: window.innerHeight,
                        left: 0,
                        behavior: "smooth",
                    });
                    unSelectAllItems(pageType);
                }
            }, 500);
        }
    }

    function setValues(TBF_div, pageType) {
        var radios = document.querySelectorAll('.TBF_radio');

        TBF_div.innerHTML = "Setting Values";

        radios.forEach((element) => {
            if (pageType == pages.ManageItems || window.getComputedStyle(element.parentElement.parentElement.parentElement.parentElement.parentElement, null).display !== "none") {
                if (item_prices[element.dataset.iid] !== undefined && item_deltas[element.dataset.iid]) {
                    fillPriceOnly(element, item_deltas[element.dataset.iid]);
                }
            }
        });

        if (pageType == pages.ManageItems)
        {
            setTimeout(function() {
                if ((window.innerHeight + Math.round(window.scrollY)) < (document.body.offsetHeight * 0.99))
                {
                    window.scrollBy(0, window.innerHeight);
                    setValues(TBF_div, pageType);
                }
            }, 500);
        }
        else
        {
            TBF_div.innerHTML = "Prices Updated";
        }
    }

    function updateAllValues(TBF_div, pageType) {
        let ind = 0;
        let total = 0;
        for (const [key, value] of Object.entries(item_prices)) {
            if (item_deltas[key]) {
                total++;
            }
        }
        for (const [key, value] of Object.entries(item_prices)) {
            if (item_deltas[key]) {
                let index = ind;
                setTimeout(function() {
                    TBF_div.innerHTML = `Updating Prices ${index+1} of ${total}`;
                    setPrice(key);
                }, 1000 * ind);
                ind++;
            }
        }
        TBF_div.innerHTML = `Updating Prices 0 of ${total}`;
        setTimeout(function() {
            setValues(TBF_div, pageType);
        }, 1000 * ind);
    }

    function createRandomString(length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function insertFillAndWaveBtn(element, buttonLabels, pageType){
        const waveDiv = document.createElement('div');
        waveDiv.className = 'wave';

        let image = element.parentElement.parentElement.querySelector("div.image-wrap img") || element.parentElement.querySelector("div[class^='imgContainer__'] img");
        let numberPattern = /\/(\d+)\//;
        let match = image.src.match(numberPattern);
        let extractedItemId = 0;
        if (match) {
            extractedItemId = parseInt(match[1], 10);
        } else {
            console.error("[TornBazaarFiller] ItemId not found!");
        }

        let rand_string = createRandomString(6);
        const outerSpanFill = document.createElement('span');
        outerSpanFill.className = 'btn-wrap torn-bazaar-fill-qty-price';

        const inputElementFill1 = document.createElement('input');
        inputElementFill1.id = `TBF_radio_1_${extractedItemId}`;
        inputElementFill1.className = 'TBF_radio';
        inputElementFill1.type = 'radio';
        inputElementFill1.name = `bazaar_filler_${extractedItemId}_${rand_string}`;
        inputElementFill1.dataset.iid = extractedItemId;
        inputElementFill1.value = 'On';
        if (item_deltas[extractedItemId] && item_deltas[extractedItemId] === "-1")
        {
            inputElementFill1.checked = true;
        }
        const inputElementFill2 = document.createElement('input');
        inputElementFill2.id = `TBF_radio_2_${extractedItemId}`;
        inputElementFill2.className = 'TBF_radio';
        inputElementFill2.type = 'radio';
        inputElementFill2.name = `bazaar_filler_${extractedItemId}_${rand_string}`;
        inputElementFill2.value = 'Off';
        inputElementFill2.dataset.iid = extractedItemId;
        if (item_deltas[extractedItemId] && item_deltas[extractedItemId] === "-1[1]")
        {
            inputElementFill2.checked = true;
        }
        const inputElementFill3 = document.createElement('input');
        inputElementFill3.id = `TBF_radio_3_${extractedItemId}`;
        inputElementFill3.className = 'TBF_radio';
        inputElementFill3.type = 'radio';
        inputElementFill3.name = `bazaar_filler_${extractedItemId}_${rand_string}`;
        inputElementFill3.value = 'Off';
        inputElementFill3.dataset.iid = extractedItemId;
        if (item_deltas[extractedItemId] && item_deltas[extractedItemId] === "-1[2]")
        {
            inputElementFill3.checked = true;
        }

        const marketValueElement = element.parentElement.parentElement.querySelector(".info-main-wrap") || element.parentElement.querySelector("div[class^='bonuses__']");
        marketValueElement.classList.add('TBF_infowrap_relative');
        const updateSpan = document.createElement('div');
        updateSpan.classList.add('TBF_update');
        const inputElementUpdate = document.createElement('input');
        inputElementUpdate.id = `TBF_select_${extractedItemId}`;
        inputElementUpdate.className = 'TBF_select';
        inputElementUpdate.type = 'checkbox';
        inputElementUpdate.dataset.iid = extractedItemId;
        inputElementUpdate.checked = item_checked[extractedItemId] || false;
        inputElementUpdate.dataset.pageType = pageType;
        updateSpan.appendChild(inputElementUpdate);

        outerSpanFill.appendChild(inputElementFill1);
        outerSpanFill.appendChild(inputElementFill2);
        outerSpanFill.appendChild(inputElementFill3);

        element.append(outerSpanFill, waveDiv);
        marketValueElement.append(updateSpan);

        $(inputElementUpdate).on("change", function(event) {
            item_checked[this.dataset.iid] = this.checked;
            if (!this.checked) {
                delete item_prices[this.dataset.iid];
            }
            else {
                item_prices[this.dataset.iid] = {};
            }
            if (pageType == pages.AddItems) {
                if (this.checked && item_data && item_data.items) {
                    fillQuantityOnly(this, item_data.items[this.dataset.iid].market_value || 1, pageType);
                } else {
                    clearQuantityOnly(this);
                }
            }
        });

        $(inputElementFill1).on("click", function(event) {
            checkApiKey();
            item_deltas[this.dataset.iid] = "-1";
            GM_setValue("TBF_Deltas", JSON.stringify(item_deltas));
            event.stopPropagation();
        });
        $(inputElementFill2).on("click", function(event) {
            checkApiKey();
            item_deltas[this.dataset.iid] = "-1[1]";
            GM_setValue("TBF_Deltas", JSON.stringify(item_deltas));
            event.stopPropagation();
        });
        $(inputElementFill3).on("click", function(event) {
            checkApiKey();
            item_deltas[this.dataset.iid] = "-1[2]";
            GM_setValue("TBF_Deltas", JSON.stringify(item_deltas));
            event.stopPropagation();
        });
    }

    function insertPercentageSpan(element){
        let moneyGroupDiv = element.querySelector("div.price div.input-money-group") || element.querySelector("div.input-money-group");;

        if (moneyGroupDiv.querySelector("span.overlay-percentage") === null) {
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'overlay-percentage overlay-percentage-add';
            moneyGroupDiv.appendChild(percentageSpan);
        }

        return moneyGroupDiv.querySelector("span.overlay-percentage");
    }

    function insertPercentageManageSpan(element){
        let moneyGroupDiv = element.querySelector("div.input-money-group");

        if (moneyGroupDiv.querySelector("span.overlay-percentage") === null) {
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'overlay-percentage overlay-percentage-manage';
            moneyGroupDiv.appendChild(percentageSpan);
        }

        return moneyGroupDiv.querySelector("span.overlay-percentage");
    }

    function fillQuantityOnly(element, market_value, pageType) {
        let amountDiv = element.parentElement.parentElement.parentElement.parentElement.querySelector("div.amount-main-wrap");
        let priceInputs = {};
        if (amountDiv) {
            priceInputs = amountDiv.querySelectorAll("div.price div input");
        } else {
            amountDiv = element.parentElement.parentElement.parentElement.parentElement.querySelector("div[class^='price__']");
            priceInputs = amountDiv.querySelectorAll("div input[class='input-money']");
        }
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let isQuantityCheckbox = amountDiv.querySelector("div.amount.choice-container") !== null;
        if (isQuantityCheckbox){
            amountDiv.querySelector("div.amount.choice-container input").click();
        } else {
            let quantityInput = amountDiv.querySelector("div.amount input");
            quantityInput.value = getQuantity(element, pageType);
            quantityInput.dispatchEvent(keyupEvent);
        }
        priceInputs[0].value = market_value;
        priceInputs[1].value = market_value;
        priceInputs[0].dispatchEvent(inputEvent);
    }

    function setPrice(iid) {
        let requestUrl = bazaarUrl
        .replace("{itemId}", iid)
        .replace("{apiKey}", apiKey);
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("silmaril-torn-bazaar-filler-apikey", null);
                console.error("[TornBazaarFiller] Incorrect Api Key:", data);
                return;
            }
            item_prices[iid] = data;
        })
            .catch(error => {
            console.error("[TornBazaarFiller] Error fetching data:", error);
        })
            .finally(() => {
        });
    }

    function getItemData() {
        let requestUrl = itemDataUrl
        .replace("{apiKey}", apiKey);
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("silmaril-torn-bazaar-filler-apikey", null);
                console.error("[TornBazaarFiller] Incorrect Api Key:", data);
                return;
            }
            if (data.error != null)
            {
                console.error("[TornBazaarFiller] Item data error:", data);
                return;
            }
            item_data = data;
        })
            .catch(error => {
            console.error("[TornBazaarFiller] Error fetching data:", error);
        })
            .finally(() => {
        });
    }

    function fillPriceOnly(element, priceDeltaOverride = null){
        let priceInputs = {};
        let amountDiv = element.parentElement.parentElement.parentElement.parentElement.querySelector("div.amount-main-wrap");
        if (amountDiv) {
            priceInputs = amountDiv.querySelectorAll("div.price div input");
        } else {
            amountDiv = element.parentElement.parentElement.parentElement.parentElement.querySelector("div[class^='price__']");
            priceInputs = amountDiv.querySelectorAll("div input[class='input-money']");
        }
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let extractedItemId = element.dataset.iid;

        let requestUrl = bazaarUrl
        .replace("{itemId}", extractedItemId)
        .replace("{apiKey}", apiKey);

        let priceDelta = priceDeltaRaw;

        if (priceDeltaOverride) {
            priceDelta = priceDeltaOverride;
        }

        let wave = element.parentElement.parentElement.querySelector("div.wave");

        if (item_prices[extractedItemId]) {
            const data = item_prices[extractedItemId];

            let bazaarSlotOffset = priceDelta.indexOf('[') == -1 ? 0 : parseInt(priceDelta.substring(priceDelta.indexOf('[') + 1, priceDelta.indexOf(']')));
            let priceDeltaWithoutBazaarOffset = priceDelta.indexOf('[') == -1 ? priceDelta : priceDelta.substring(0, priceDelta.indexOf('['))
            let lowBallPrice = Math.round(performOperation(data.bazaar[Math.min(bazaarSlotOffset, data.bazaar.length - 1)].cost, priceDeltaWithoutBazaarOffset));
            let price3rd = data.bazaar[Math.min(2, data.bazaar.length - 1)].cost;
            let priceCoefficient = ((lowBallPrice / price3rd) * 100).toFixed(0);

            let percentageOverlaySpan = insertPercentageSpan(amountDiv);
            if (priceCoefficient <= 95){
                percentageOverlaySpan.style.display = "block";
                if (priceCoefficient <= 50){
                    percentageOverlaySpan.style.color = "red";
                    wave.style.backgroundColor = "red";
                    wave.style.animationDuration = "5s";
                } else if (priceCoefficient <= 75){
                    percentageOverlaySpan.style.color = "yellow";
                    wave.style.backgroundColor = "yellow";
                    wave.style.animationDuration = "3s";
                } else {
                    percentageOverlaySpan.style.color = "green";
                    wave.style.backgroundColor = "green";
                }
                percentageOverlaySpan.innerText = priceCoefficient + "%";
            } else {
                percentageOverlaySpan.style.display = "none";
                wave.style.backgroundColor = "green";
            }

            priceInputs[0].value = lowBallPrice;
            priceInputs[1].value = lowBallPrice;
            priceInputs[0].dispatchEvent(inputEvent);
        }
        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;
        wave.style.backgroundColor = "transparent";
        wave.style.animationDuration = "1s";
    }

    function fillQuantityAndPrice(element, pageType, priceDeltaOverride = null){
        let amountDiv = element.parentElement.parentElement.parentElement.parentElement.querySelector("div.amount-main-wrap");
        let priceInputs = amountDiv.querySelectorAll("div.price div input");
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let image = element.parentElement.parentElement.parentElement.querySelector("div.image-wrap img");
        let numberPattern = /\/(\d+)\//;
        let match = image.src.match(numberPattern);
        let extractedItemId = 0;
        if (match) {
            extractedItemId = parseInt(match[1], 10);
        } else {
            console.error("[TornBazaarFiller] ItemId not found!");
        }

        let requestUrl = bazaarUrl
        .replace("{itemId}", extractedItemId)
        .replace("{apiKey}", apiKey);

        let priceDelta = priceDeltaRaw;

        if (priceDeltaOverride) {
            priceDelta = priceDeltaOverride;
        }

        let wave = element.parentElement.parentElement.querySelector("div.wave");
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("silmaril-torn-bazaar-filler-apikey", null);
                wave.style.backgroundColor = "red";
                wave.style.animationDuration = "5s";
                console.error("[TornBazaarFiller] Incorrect Api Key:", data);
                return;
            }
            let bazaarSlotOffset = priceDelta.indexOf('[') == -1 ? 0 : parseInt(priceDelta.substring(priceDelta.indexOf('[') + 1, priceDelta.indexOf(']')));
            let priceDeltaWithoutBazaarOffset = priceDelta.indexOf('[') == -1 ? priceDelta : priceDelta.substring(0, priceDelta.indexOf('['))
            let lowBallPrice = Math.round(performOperation(data.bazaar[Math.min(bazaarSlotOffset, data.bazaar.length - 1)].cost, priceDeltaWithoutBazaarOffset));
            let price3rd = data.bazaar[Math.min(2, data.bazaar.length - 1)].cost;
            let priceCoefficient = ((lowBallPrice / price3rd) * 100).toFixed(0);

            let percentageOverlaySpan = insertPercentageSpan(amountDiv);
            if (priceCoefficient <= 95){
                percentageOverlaySpan.style.display = "block";
                if (priceCoefficient <= 50){
                    percentageOverlaySpan.style.color = "red";
                    wave.style.backgroundColor = "red";
                    wave.style.animationDuration = "5s";
                } else if (priceCoefficient <= 75){
                    percentageOverlaySpan.style.color = "yellow";
                    wave.style.backgroundColor = "yellow";
                    wave.style.animationDuration = "3s";
                } else {
                    percentageOverlaySpan.style.color = "green";
                    wave.style.backgroundColor = "green";
                }
                percentageOverlaySpan.innerText = priceCoefficient + "%";
            } else {
                percentageOverlaySpan.style.display = "none";
                wave.style.backgroundColor = "green";
            }

            priceInputs[0].value = lowBallPrice;
            priceInputs[1].value = lowBallPrice;
            priceInputs[0].dispatchEvent(inputEvent);
        })
            .catch(error => {
            wave.style.backgroundColor = "red";
            wave.style.animationDuration = "5s";
            console.error("[TornBazaarFiller] Error fetching data:", error);
        })
            .finally(() => {
        });
        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;
        wave.style.backgroundColor = "transparent";
        wave.style.animationDuration = "1s";

        let isQuantityCheckbox = amountDiv.querySelector("div.amount.choice-container") !== null;
        if (isQuantityCheckbox){
            amountDiv.querySelector("div.amount.choice-container input").click();
        } else {
            let quantityInput = amountDiv.querySelector("div.amount input");
            quantityInput.value = getQuantity(element, pageType);
            quantityInput.dispatchEvent(keyupEvent);
        }
    }

    function updatePrice(element, priceDeltaOverride = null){
        let moneyGroupDiv;
        let parentNode4 = element.parentNode.parentNode.parentNode.parentNode;
        if (isMobileView){
            if (parentNode4.querySelector("[class*=menuActivators___] button[class*=iconContainer___][aria-label=Manage] span[class*=active___]") == null) {
                parentNode4.querySelector("[class*=menuActivators___] button[class*=iconContainer___][aria-label=Manage]").click();
            }
            moneyGroupDiv = parentNode4.parentNode.querySelector("[class*=bottomMobileMenu___] [class*=priceMobile___]");
        } else {
            moneyGroupDiv = element.parentNode.parentNode.parentNode.parentNode.querySelector("div[class*=price___]");
        }
        let priceInputs = moneyGroupDiv.querySelectorAll("div.input-money-group input");
        let inputEvent = new Event("input", {bubbles: true});

        let image = element.parentElement.parentElement.parentElement.parentElement.querySelector("div[class*=imgContainer___] img");
        let extractedItemId = getItemIdFromImage(image);

        let requestUrl = bazaarUrl
        .replace("{itemId}", extractedItemId)
        .replace("{apiKey}", apiKey);

        let priceDelta = priceDeltaRaw;

        if (priceDeltaOverride) {
            priceDelta = priceDeltaOverride;
        }

        let wave = element.parentElement.parentElement.parentElement.querySelector("div.wave");
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("silmaril-torn-bazaar-filler-apikey", null);
                wave.style.backgroundColor = "red";
                wave.style.animationDuration = "5s";
                console.error("[TornBazaarFiller] Incorrect Api Key:", data);
                return;
            }
            let bazaarSlotOffset = priceDelta.indexOf('[') == -1 ? 0 : parseInt(priceDelta.substring(priceDelta.indexOf('[') + 1, priceDelta.indexOf(']')));
            let priceDeltaWithoutBazaarOffset = priceDelta.indexOf('[') == -1 ? priceDelta : priceDelta.substring(0, priceDelta.indexOf('['))
            let lowBallPrice = Math.round(performOperation(data.bazaar[Math.min(bazaarSlotOffset, data.bazaar.length - 1)].cost, priceDeltaWithoutBazaarOffset));
            let price3rd = data.bazaar[Math.min(2, data.bazaar.length - 1)].cost;
            let priceCoefficient = ((lowBallPrice / price3rd) * 100).toFixed(0);

            let percentageOverlaySpan = insertPercentageManageSpan(moneyGroupDiv);
            if (priceCoefficient <= 95){
                percentageOverlaySpan.style.display = "block";
                if (priceCoefficient <= 50){
                    percentageOverlaySpan.style.color = "red";
                    wave.style.backgroundColor = "red";
                    wave.style.animationDuration = "5s";
                } else if (priceCoefficient <= 75){
                    percentageOverlaySpan.style.color = "yellow";
                    wave.style.backgroundColor = "yellow";
                    wave.style.animationDuration = "3s";
                } else {
                    percentageOverlaySpan.style.color = "green";
                    wave.style.backgroundColor = "green";
                }
                percentageOverlaySpan.innerText = priceCoefficient + "%";
            } else {
                percentageOverlaySpan.style.display = "none";
                wave.style.backgroundColor = "green";
            }

            priceInputs[0].value = lowBallPrice;
            priceInputs[1].value = lowBallPrice;
            priceInputs[0].dispatchEvent(inputEvent);
        })
            .catch(error => {
            wave.style.backgroundColor = "red";
            wave.style.animationDuration = "5s";
            console.error("[TornBazaarFiller] Error fetching data:", error);
        })
            .finally(() => {
        });
        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;
        wave.style.backgroundColor = "transparent";
        wave.style.animationDuration = "1s";
    }

    function clearQuantityOnly(element) {
        let amountDiv = element.parentElement.parentElement.parentElement.parentElement.querySelector("div.amount-main-wrap");
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let isQuantityCheckbox = amountDiv.querySelector("div.amount.choice-container") !== null;
        if (isQuantityCheckbox){
            amountDiv.querySelector("div.amount.choice-container input").click();
        } else {
            let quantityInput = amountDiv.querySelector("div.amount input");
            quantityInput.value = "";
            quantityInput.dispatchEvent(keyupEvent);
        }
    }

    function clearQuantityAndPrice(element){
        let amountDiv = element.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("div.amount-main-wrap");
        let priceInputs = amountDiv.querySelectorAll("div.price div input");
        let keyupEvent = new Event("keyup", {bubbles: true});
        let inputEvent = new Event("input", {bubbles: true});

        let wave = element.parentElement.parentElement.parentElement.querySelector("div.wave");
        wave.style.backgroundColor = "white";

        let isQuantityCheckbox = amountDiv.querySelector("div.amount.choice-container") !== null;
        if (isQuantityCheckbox){
            amountDiv.querySelector("div.amount.choice-container input").click();
        } else {
            let quantityInput = amountDiv.querySelector("div.amount input");
            quantityInput.value = "";
            quantityInput.dispatchEvent(keyupEvent);
        }

        priceInputs[0].value = "";
        priceInputs[1].value = "";
        priceInputs[0].dispatchEvent(inputEvent);

        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = null;
    }

    function getQuantity(element, pageType){
        let rgx = /x(\d+)$/;
        let rgxMobile = /^x(\d+)/
        let quantityText = 0;
        let elem;
        switch(pageType){
            case pages.AddItems:
                elem = element.parentNode.parentNode.parentNode.parentNode.querySelector('.name-wrap');
                if (elem) {
                    quantityText = elem.innerText;
                }
                break;
            case pages.ManageItems:
                quantityText = element.parentNode.parentNode.parentNode.querySelector("span").innerText;
                break;
        }
        let match = isMobileView ? rgxMobile.exec(quantityText) : rgx.exec(quantityText);
        let quantity = match === null ? 1 : match[1];
        return quantity;
    }

    function getItemIdFromImage(image){
        let numberPattern = /\/(\d+)\//;
        let match = image.src.match(numberPattern);
        if (match) {
            return parseInt(match[1], 10);
        } else {
            console.error("[TornBazaarFiller] ItemId not found!");
        }
    }

    function performOperation(number, operation) {
        // Parse the operation string to extract the operator and value
        const match = operation.match(/^([-+]?)(\d+(?:\.\d+)?)(%)?$/);

        if (!match) {
            throw new Error('Invalid operation string');
        }

        const [, operator, operand, isPercentage] = match;
        const operandValue = parseFloat(operand);

        // Check for percentage and convert if necessary
        const adjustedOperand = isPercentage ? (number * operandValue) / 100 : operandValue;

        // Perform the operation based on the operator
        switch (operator) {
            case '':
            case '+':
                return number + adjustedOperand;
            case '-':
                return number - adjustedOperand;
            default:
                throw new Error('Invalid operator');
        }
    }

    function setPriceDelta() {
        let userInput = prompt('Enter price delta formula (default: -1):', priceDeltaRaw);
        if (userInput !== null) {
            priceDeltaRaw = userInput;
            localStorage.setItem("silmaril-torn-bazaar-filler-price-delta", userInput);
        } else {
            console.error("[TornBazaarFiller] User cancelled the Price Delta input.");
        }
    }

    function checkApiKey(checkExisting = true) {
        if (!checkExisting || apiKey === null || apiKey.length != 16){
            let userInput = prompt("Please enter a PUBLIC Api Key, it will be used to get current bazaar prices:", apiKey ?? '');
            if (userInput !== null && userInput.length == 16) {
                apiKey = userInput;
                localStorage.setItem("silmaril-torn-bazaar-filler-apikey", userInput);
            } else {
                console.error("[TornBazaarFiller] User cancelled the Api Key input.");
            }
        }
    }
})();