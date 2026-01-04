// ==UserScript==
// @name         Torn Market Filler
// @namespace    https://github.com/SOLiNARY
// @version      0.6.2
// @description  On "Fill" click autofills market item price with lowest market price minus $1 (customizable), fills max quantity, marks checkboxes for guns.
// @author       Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://*.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/513920/Torn%20Market%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/513920/Torn%20Market%20Filler.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const itemUrl = "https://api.torn.com/torn/{itemId}?selections=items&key={apiKey}&comment=MarketFiller";
    const marketUrl = "https://api.torn.com/v2/market/{itemId}?selections=itemMarket&key={apiKey}&comment=MarketFiller";
    const marketUrlV2 = "https://api.torn.com/v2/market?id={itemId}&selections=itemMarket&key={apiKey}&comment=MarketFiller";
    let showPricesPopup = localStorage.getItem("silmaril-torn-market-filler-show-prices-popup") ?? '1';
    showPricesPopup = Boolean(parseInt(showPricesPopup));
    let priceDeltaRaw = localStorage.getItem("silmaril-torn-market-filler-price-delta") ?? localStorage.getItem("silmaril-torn-bazaar-filler-price-delta") ?? '-1[0]';
    let apiKey = localStorage.getItem("silmaril-torn-bazaar-filler-apikey") ?? '###PDA-APIKEY###';
    let togglePricesPopupMenuId, setPriceDeltaMenuId, setApiKeyMenuId;

    try {
        togglePricesPopupMenuId = GM_registerMenuCommand(`Toggle Prices Popup (${showPricesPopup ? 'ON' : 'OFF'})`, togglePricesPopupVisibility);
        setPriceDeltaMenuId = GM_registerMenuCommand(`Set Price Delta: ${priceDeltaRaw}`, setPriceDelta);
        setApiKeyMenuId = GM_registerMenuCommand(`Set Api Key: ${apiKey}`, function() { checkApiKey(false); });
    } catch (error) {
        console.warn('[TornMarketFiller] Tampermonkey not detected!');
    }

    let GM_addStyle = function (s) {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = s;
        document.head.appendChild(style);
    };
    GM_addStyle(`#item-market-root [class^=addListingWrapper___] [class^=panels___] [class^=priceInputWrapper___]>.input-money-group>.input-money,#item-market-root [class^=viewListingWrapper___] [class^=priceInputWrapper___]>.input-money-group>.input-money{font-size:smaller!important;border-bottom-left-radius:0!important;border-top-left-radius:0!important}.silmaril-market-filler-popup{background:var(--tooltip-bg-color);padding:12px 18px;border-radius:8px;border:1px solid #888;box-shadow:0 4px 18px 0 #0009;color:var(--info-msg-font-color);z-index:99999;position:absolute;font-size:1em!important;line-height:1.5;pointer-events:auto}.silmaril-market-filler-popup-close{position:absolute;top:4px;right:7px;font-size:1em;color:#aaa;cursor:pointer}.silmaril-market-filler-popup-draggable{user-select:none;cursor:move}.silmaril-torn-market-filler-popup-price{cursor:pointer}`);

    const pages = { "AddItems": 10, "ViewItems": 20, "Other": 0};
    let recentFilledInput = null;
    let popupOffsetX = localStorage.getItem("silmaril-torn-market-filler-popup-offset-x") ?? 0, popupOffsetY = 0, isDragging = false;
    const marketTaxFactor = 1 - getCurrentMarketTax();
    let currentPage = pages.Other;
    let holdTimer;
    const LOADING_THE_PRICES = 'Loading the prices...';
    const isMobileView = window.innerWidth <= 784;
    const observerTarget = document.querySelector("#item-market-root");
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutationRaw => {
            let mutation = mutationRaw.target;
            currentPage = getCurrentPage();
            if (currentPage == pages.AddItems){
                if (mutation.id && mutation.id.startsWith('headlessui-tabs-panel-')) {
                    mutation.querySelectorAll('[class*=itemRowWrapper___]:not(.silmaril-market-filler-processed) > [class*=itemRow___]:not([class*=grayedOut___]) [class^=priceInputWrapper___]').forEach(x => AddFillButton(x));
                }
                if (String(mutation.className).indexOf('priceInputWrapper___') > -1){
                    AddFillButton(mutation);
                }
            } else if (currentPage == pages.ViewItems){
                if (mutation.className && mutation.className.startsWith('viewListingWrapper___')) {
                    mutation.querySelectorAll('[class*=itemRowWrapper___]:not(.silmaril-market-filler-processed) > [class*=itemRow___]:not([class*=grayedOut___]) [class^=priceInputWrapper___]').forEach(x => AddFillButton(x));
                }
            }
        });
    });
    observer.observe(observerTarget, observerConfig);
    addCustomFillPopup();

    function AddFillButton(itemPriceElement){
        if (itemPriceElement.querySelector('.silmaril-market-filler-button') != null){
            return;
        }
        const wrapperParent = findParentByCondition(itemPriceElement, (el) => String(el.className).indexOf('itemRowWrapper___') > -1);
        wrapperParent.classList.add('silmaril-market-filler-processed');
        let itemIdString = wrapperParent.querySelector('[class^=itemRow___] [type=button][class^=viewInfoButton___]').getAttribute('aria-controls');
        let itemImage = wrapperParent.querySelector('[class*=viewInfoButton] img');
        let itemId = currentPage == pages.AddItems ? getItemIdFromString(itemIdString) : getItemIdFromImage(itemImage);
        const span = document.createElement('span');
        span.className = 'silmaril-market-filler-button input-money-symbol';
        span.style.position = "relative";
        span.setAttribute('data-action-flag', 'fill');
        span.addEventListener('click', async function(e) { await handleFillClick(e, itemId) });
        span.addEventListener('mousedown', startHold);
        span.addEventListener('touchstart', startHold);
        span.addEventListener('mouseup', cancelHold);
        span.addEventListener('mouseleave', cancelHold);
        span.addEventListener('touchend', cancelHold);
        span.addEventListener('touchcancel', cancelHold);
        const input = document.createElement('input');
        input.type = 'button';
        input.className = 'wai-btn';
        span.appendChild(input);
        itemPriceElement.querySelector('.input-money-group').prepend(span);
    }

    async function GetPrices(itemId){
        let requestUrl = priceDeltaRaw.indexOf('[market]') != -1 ? itemUrl : marketUrlV2;
        requestUrl = requestUrl
            .replace("{itemId}", itemId)
            .replace("{apiKey}", apiKey);
        return fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null){
                switch (data.error.code){
                    case 2:
                        apiKey = null;
                        localStorage.setItem("silmaril-torn-bazaar-filler-apikey", null);
                        console.error("[TornMarketFiller] Incorrect Api Key:", data);
                        return {"price": 'Wrong API key!', "amount": 0};
                    case 9:
                        console.warn("[TornMarketFiller] The API is temporarily disabled, please try again later");
                        return {"price": 'API is OFF!', "amount": 0};
                    default:
                        console.error("[TornMarketFiller] Error:", data.error.error);
                        return {"price": data.error.error, "amount": 0};
                }
            }
            if (priceDeltaRaw.indexOf('[market]') != -1){
                return {"price": data.items[itemId].market_value, "amount": 1};
            } else {
                if (data.itemmarket.listings[0].price == null){
                    console.warn("[TornMarketFiller] The API is temporarily disabled, please try again later");
                    return {"price": 'API is OFF!', "amount": 0};
                }
                // temporary hotfix to avoid wrong prices
                if (data.itemmarket.item.id != itemId){
                    return {"price": 'API is BROKEN!', "amount": 0};
                }
                return data.itemmarket.listings;
            }
        })
            .catch(error => {
            console.error("[TornMarketFiller] Error fetching data:", error);
            return 'Failed!';
        });
    }

    function GetPrice(prices){
        if (prices == null){
            return 'No prices loaded';
        }
        if (prices.amount == 0){
            return prices.price;
        }
        if (priceDeltaRaw.indexOf('[market]') != -1) {
            prices = Array(prices);
            let priceDelta = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
            return Math.round(performOperation(prices[0].price, priceDelta));
        } else if (priceDeltaRaw.indexOf('[median]') != -1) {
            let priceDelta = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
            return Math.round(performOperation(getMedianPrice(prices), priceDelta));
        } else {
            let marketSlotOffset = priceDeltaRaw.indexOf('[') == -1 ? 0 : parseInt(priceDeltaRaw.substring(priceDeltaRaw.indexOf('[') + 1, priceDeltaRaw.indexOf(']')));
            let priceDeltaWithoutMarketOffset = priceDeltaRaw.indexOf('[') == -1 ? priceDeltaRaw : priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
            return Math.round(performOperation(prices[Math.min(marketSlotOffset, prices.length - 1)].price, priceDeltaWithoutMarketOffset));
        }
    }

    async function handleFillClick(event, itemId){
        let target = event.currentTarget || event.target;
        let priceInputs = target.parentNode.querySelectorAll('input.input-money');
        recentFilledInput = priceInputs;
        const popup = document.querySelector('.silmaril-market-filler-popup');
        if (popup) {
            const rect = target.getBoundingClientRect();
            if (popupOffsetX == 0){
                popupOffsetX = window.scrollX + rect.left - 300;
                localStorage.setItem("silmaril-torn-market-filler-popup-offset-x", popupOffsetX);
            }
            popupOffsetY = window.scrollY + rect.top + 4;

            let left = popupOffsetX;
            let top = popupOffsetY;

            popup.style.display = showPricesPopup ? 'block' : 'none';
            popup.style.visibility = 'hidden';
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
            popup.querySelector('.silmaril-market-filler-popup-body').innerHTML = LOADING_THE_PRICES;

            const popupRect = popup.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            if (popupRect.right > viewportWidth) {
                left = Math.max(0, viewportWidth - popupRect.width - 10 + scrollX);
            }
            if (popupRect.left < 0) {
                left = 10 + scrollX;
            }
            if (popupRect.bottom > viewportHeight) {
                top = Math.max(0, viewportHeight - popupRect.height - 10 + scrollY);
            }
            if (popupRect.top < 0) {
                top = 10 + scrollY;
            }

            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
            popup.style.visibility = 'visible';
        }

        let action = target.getAttribute('data-action-flag');
        let prices = await GetPrices(itemId);
        const breakdown = GetPricesBreakdown(prices);

        // Thanks to Rosti [2840742] for the help with the prices popup component
        showCustomFillPopup(target, breakdown);

        let price = action == 'fill' ? GetPrice(prices) : '';
        switchActionFlag(target);
        let parentRow = findParentByCondition(target, (el) => String(el.className).indexOf('info___') > -1);
        let quantityInputs = parentRow.querySelectorAll('[class^=amountInputWrapper___] .input-money-group > .input-money');
        if (quantityInputs.length > 0){
            if (quantityInputs[0].value.length === 0 || parseInt(quantityInputs[0].value) < 1){
                quantityInputs[0].value = action == 'fill' ? Number.MAX_SAFE_INTEGER : 0;
                quantityInputs[1].value = action == 'fill' ? Number.MAX_SAFE_INTEGER : 0;
            } else {
                quantityInputs[0].value = action == 'clear' ? '' : quantityInputs[0].value;
                quantityInputs[1].value = action == 'clear' ? '' : quantityInputs[1].value;
            }
            quantityInputs[0].dispatchEvent(new Event("input", {bubbles: true}));
        } else {
            let checkbox = parentRow.querySelector('[class^=checkboxWrapper___] > [class^=checkboxContainer___] [type=checkbox]');
            if (checkbox && ((action == 'fill' && !checkbox.checked) || (action == 'clear' && checkbox.checked))){
                checkbox.click();
            }
        }
        priceInputs.forEach(x => {x.value = price});
        priceInputs[0].dispatchEvent(new Event("input", {bubbles: true}));
    }

    function hideAllFillPopups() {
        document.querySelector('.silmaril-market-filler-popup').style.display = 'none';
    }

    function showCustomFillPopup(targetElem, contentHTML) {
        const popup = document.querySelector('.silmaril-market-filler-popup');
        popup.querySelector('.silmaril-market-filler-popup-body').innerHTML = contentHTML;
        popup.querySelectorAll('.silmaril-torn-market-filler-popup-price').forEach(row => {
            row.addEventListener('click', (e) => {
                recentFilledInput.forEach(x => {x.value = parseInt(e.target.getAttribute('data-price')) - 1});
                recentFilledInput[0].dispatchEvent(new Event("input", {bubbles: true}));
            });
        });
    }

    function addCustomFillPopup() {
        const popup = document.createElement('div');
        popup.className = 'silmaril-market-filler-popup';
        popup.style.display = 'none';
        popup.style.left = popupOffsetX + 'px';
        popup.style.top = '0px';
        popup.innerHTML = '<div class="silmaril-market-filler-popup-close" title="Close">&times;</div><b class="silmaril-market-filler-popup-draggable">Drag from here</b><br><div class="silmaril-market-filler-popup-body"></div>';
        popup.querySelector('.silmaril-market-filler-popup-close').onclick = function(){ popup.style.display = 'none'; };
        document.body.appendChild(popup);

        const dragHandle = popup.querySelector('.silmaril-market-filler-popup-draggable');
        dragHandle.addEventListener("mousedown", (e) => {
            isDragging = true;
            popupOffsetX = e.clientX - popup.offsetLeft;
            popupOffsetY = e.clientY - popup.offsetTop;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                popup.style.left = (e.clientX - popupOffsetX) + "px";
                popup.style.top = (e.clientY - popupOffsetY) + "px";
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (isDragging) {
                popupOffsetX = e.clientX - popupOffsetX;
                popupOffsetY = e.clientY - popupOffsetY;
                localStorage.setItem("silmaril-torn-market-filler-popup-offset-x", popupOffsetX);
            }
            isDragging = false;
        });

        // Touch events (mobile)
        dragHandle.addEventListener("touchstart", (e) => {
            isDragging = true;
            const touch = e.touches[0];
            popupOffsetX = touch.clientX - popup.offsetLeft;
            popupOffsetY = touch.clientY - popup.offsetTop;
            e.preventDefault();
        }, { passive: false });

        document.addEventListener("touchmove", (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                popup.style.left = (touch.clientX - popupOffsetX) + "px";
                popup.style.top = (touch.clientY - popupOffsetY) + "px";
            }
        }, { passive: false });

        document.addEventListener("touchend", () => {
            if (isDragging) {
                popupOffsetX = popup.offsetLeft;
                popupOffsetY = popup.offsetTop;
                localStorage.setItem("silmaril-torn-market-filler-popup-offset-x", popupOffsetX);
            }
            isDragging = false;
        });
    }

    function getItemIdFromString(string){
        const match = string.match(/-(\d+)-/);
        if (match) {
            const number = match[1];
            return number;
        } else {
            console.error("[TornMarketFiller] ItemId not found!");
            return -1;
        }
    }

    function getItemIdFromImage(image){
        let numberPattern = /\/(\d+)\//;
        let match = image.src.match(numberPattern);
        if (match) {
            return parseInt(match[1], 10);
        } else {
            console.error("[TornMarketFiller] ItemId not found!");
            return -1;
        }
    }

    function switchActionFlag(target){
        switch (target.getAttribute('data-action-flag')){
            case 'fill':
                target.setAttribute('data-action-flag', 'clear');
                break;
            case 'clear':
            default:
                target.setAttribute('data-action-flag', 'fill');
                break;
        }
    }

    function findParentByCondition(element, conditionFn){
        let currentElement = element;
        while (currentElement !== null) {
            if (conditionFn(currentElement)) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }

    function setPriceDelta() {
        let userInput = prompt('Enter price delta formula (default: -1[0]):', priceDeltaRaw);
        if (userInput !== null) {
            priceDeltaRaw = userInput;
            localStorage.setItem("silmaril-torn-market-filler-price-delta", userInput);
        } else {
            console.error("[TornMarketFiller] User cancelled the Price Delta input.");
        }
    }

    function GetPricesBreakdown(prices){
        if (prices == null) return "No prices loaded";
        if (prices[0] === undefined){
            prices = Array(prices);
        }
        const sb = new StringBuilder();
        for (let i = 0; i < Math.min(prices.length, 5); i++){
            if(typeof prices[i] !== "object" || prices[i].amount === undefined || prices[i].price === undefined) continue;
            sb.append(`<span class="silmaril-torn-market-filler-popup-price" data-price=${prices[i].price}>${prices[i].amount} x ${formatNumberWithCommas(prices[i].price)} (${formatNumberWithCommas(Math.round(prices[i].price * marketTaxFactor))})</span>`);
            if (i < Math.min(prices.length, 5)-1){
                sb.append('<br>');
            }
        }
        return sb.toString();
    }

    function performOperation(number, operation) {
        const match = operation.match(/^([-+]?)(\d+(?:\.\d+)?)(%)?$/);
        if (!match) {
            throw new Error('Invalid operation string');
        }
        const [, operator, operand, isPercentage] = match;
        const operandValue = parseFloat(operand);
        const adjustedOperand = isPercentage ? (number * operandValue) / 100 : operandValue;
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

    function formatNumberWithCommas(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    function checkApiKey(checkExisting = true) {
        if (!checkExisting || apiKey === null || apiKey.indexOf('PDA-APIKEY') > -1 || apiKey.length != 16){
            let userInput = prompt("Please enter a PUBLIC Api Key, it will be used to get current bazaar prices:", apiKey ?? '');
            if (userInput !== null && userInput.length == 16) {
                apiKey = userInput;
                localStorage.setItem("silmaril-torn-bazaar-filler-apikey", userInput);
            } else {
                console.error("[TornMarketFiller] User cancelled the Api Key input.");
            }
        }
    }

    function askForPricesPopupFlag() {
        let dsf = null;
        let userInput = prompt("Please choose to show or hide the lowest 5 prices popup, enter 1 to SHOW or 0 to HIDE:", showPricesPopup ? '1' : '0');
        if (userInput !== null && userInput.length == 1) {
            if (userInput != '1' && userInput != '0'){
                console.error("[TornMarketFiller] User entered invalid value for the Prices Popup input.");
                return;
            }
            showPricesPopup = Boolean(parseInt(userInput));
            localStorage.setItem('silmaril-torn-market-filler-show-prices-popup', showPricesPopup ? '1' : '0');
        } else {
            console.error("[TornMarketFiller] User cancelled the Prices Popup input.");
        }
    }

    function togglePricesPopupVisibility() {
        showPricesPopup = !showPricesPopup;
        localStorage.setItem('silmaril-torn-market-filler-show-prices-popup', showPricesPopup ? '1' : '0');
    }

    function getMedianPrice(items) {
        const prices = items.flatMap(item => Array(item.amount).fill(item.price));
        prices.sort((a, b) => a - b);
        const mid = Math.floor(prices.length / 2);
        if (prices.length % 2 === 0) {
            return (prices[mid - 1] + prices[mid]) / 2;
        } else {
            return prices[mid];
        }
    }

    function getCurrentPage(){
        if (window.location.href.indexOf('#/addListing') > -1){
            return pages.AddItems;
        } else if (window.location.href.indexOf('#/viewListing') > -1){
            return pages.ViewItems;
        } else {
            return pages.Other;
        }
    }

    function getCurrentMarketTax() {
        const taxFivePercentDate = new Date(2025, 5, 22);
        const taxFourPercentDate = new Date(2025, 4, 22);
        const taxThreePercentDate = new Date(2025, 3, 22);
        const taxTwoPercentDate = new Date(2025, 2, 22);
        const taxOnePercentDate = new Date(2025, 1, 22);
        const today = parseDate(getTornToday());
        switch (true) {
            case today >= taxFivePercentDate: return 0.05;
            case today >= taxFourPercentDate: return 0.04;
            case today >= taxThreePercentDate: return 0.03;
            case today >= taxTwoPercentDate: return 0.02;
            case today >= taxOnePercentDate: return 0.01;
            default: return 0.00;
        }
    }

    function getTornToday() {
        const now = document.querySelector('span.server-date-time').textContent.split(' ');
        return now[now.length - 1];
    }

    function parseDate(str) {
        const [dd, mm, yy] = str.split('/').map(Number);
        const fullYear = yy < 50 ? 2000 + yy : 1900 + yy;
        return new Date(fullYear, mm - 1, dd);
    }

    const startHold = () => {
        holdTimer = setTimeout(() => {
            askForPricesPopupFlag();
            setPriceDelta();
            checkApiKey(false);
        }, 2000);
    };

    const cancelHold = () => {
        clearTimeout(holdTimer);
    };

    class StringBuilder {
        constructor() {
            this.parts = [];
        }
        append(str) {
            this.parts.push(str);
            return this;
        }
        toString() {
            return this.parts.join('');
        }
    }
})();