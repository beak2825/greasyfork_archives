// ==UserScript==
// @name         Hololive Shop Price Comparison Tool
// @namespace    https://github.com/moontai0724
// @version      1.2.3
// @description  This tool helps you compare prices in different currencies on the Hololive Shop and convert them to Japanese Yen.
// @author       moontai0724
// @match        https://shop.hololivepro.com/products/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.google.com
// @supportURL   https://github.com/moontai0724/hololive-shop-price-diff-script/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464223/Hololive%20Shop%20Price%20Comparison%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/464223/Hololive%20Shop%20Price%20Comparison%20Tool.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 522:
/***/ ((module) => {

var currencyMatcher = /^(?:([-+]{1}) ?)?(?:([A-Z]{3}) ?)?(?:([^\d ]+?) ?)?(((?:\d{1,3}([,. ’'\u00A0\u202F]))*?\d{1,})(([,.])\d{1,2})?)(?: ?([^\d]+?))??(?: ?([A-Z]{3}))?$/;
var gr = /^\d{1,3}([,. ’'\u00A0\u202F]\d{3})*$/; // validate groups
var ind = /^\d{1,2}(,\d{2})*(,\d{3})?$/; // exception for Indian number format

module.exports = function parseCurrency(priceStr) {
  if (!priceStr || !priceStr.match) return null;
  priceStr = priceStr.trim();
  var match = priceStr.match(currencyMatcher);
  if (!match) return null;
  var groupSeparator = match[6] || '';
  var decimalSeparator = match[8] || '';
  if (groupSeparator === decimalSeparator && decimalSeparator) {
    return null;
  }
  var integer = match[1] === '-' ? '-' + match[5] : match[5];
  if (groupSeparator && !match[5].match(gr) && !match[5].match(ind)) {
    return null;
  }
  var value = match[4];
  if (!value) return null;
  if (groupSeparator) {
    value = value.replace(RegExp('\\' + groupSeparator, 'g'), '');
  }
  if (decimalSeparator) {
    value = value.replace(decimalSeparator, '.');
  }
  var numericVal = match[1] === '-' ? value * -1 : +value;
  if (typeof numericVal !== 'number' || isNaN(numericVal)) {
    return null;
  }
  return {
    raw: priceStr,
    value: numericVal,
    integer: integer || '',
    decimals: match[7] || '',
    currency: match[2] || match[10] || '',
    symbol: match[3] || match[9] || '',
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator,
    sign: match[1] || ''
  };
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./src/currency.ts
/**
 * Get currencies and countries use same currencies from selectable options
 * @returns Array of currencies and countries use same currencies
 */
function getCurrencies() {
    var countries = getCountries();
    var currencies = [];
    var _loop_1 = function (country) {
        var existing = currencies.find(function (currency) { return currency.currencyLabel === country.currencyLabel; });
        if (existing)
            existing.countries.push(country);
        else
            currencies.push({
                currencyLabel: country.currencyLabel,
                countries: [country],
            });
    };
    for (var _i = 0, countries_1 = countries; _i < countries_1.length; _i++) {
        var country = countries_1[_i];
        _loop_1(country);
    }
    return currencies;
}
/**
 * Get countries and its currency from selectable options
 * @returns Array of countries and its currency
 * @throws Error if countries could not be found
 */
function getCountries() {
    var rawCountries = document.querySelectorAll("#country_code option");
    if (!rawCountries || !rawCountries.length) {
        throw new Error("Could not find countries");
    }
    var countries = Array.from(rawCountries)
        .map(function (element) {
        var _a;
        var text = (_a = element.textContent) !== null && _a !== void 0 ? _a : "";
        var result = text.match(/(.+)\((.+)\)/);
        if (!result || result.length < 3)
            return;
        var label = result[1];
        var currency = result[2];
        var country = {
            countryCode: element.value,
            countryLabel: label,
            currencyLabel: currency.substring(0, 3),
        };
        return country;
    })
        .filter(Boolean);
    return countries;
}

// EXTERNAL MODULE: ./node_modules/parsecurrency/index.js
var parsecurrency = __webpack_require__(522);
var parsecurrency_default = /*#__PURE__*/__webpack_require__.n(parsecurrency);
;// CONCATENATED MODULE: ./src/selector.env.ts
var ITEMS_SELECTOR = ".ProductOption__container--variants .ProductOption__item--select";
var NAME_SELECTOR = ".ProductOption__label--product";
var PRICE_CONTAINER_SELECTOR = ".ProductOption__label--price";

;// CONCATENATED MODULE: ./src/exchange-rate.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Get the exchange rate from one currency to another
 * @param from From what currency to convert
 * @param to Convert to what currency
 * @returns The exchange rate
 */
function getExchangeRate(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, url, html, result, rate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (from === to)
                        return [2 /*return*/, 1];
                    cached = getCachedExchangeRate(from, to);
                    if (cached)
                        return [2 /*return*/, cached];
                    url = "https://www.google.com/finance/quote/".concat(from, "-").concat(to);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: url,
                                anonymous: true,
                                onload: function (response) {
                                    resolve(response.responseText);
                                },
                                onerror: function (error) {
                                    reject(error);
                                },
                            });
                        })];
                case 1:
                    html = _a.sent();
                    result = html.match(/data-last-price="(.+?)"/);
                    if (!result || result.length < 2) {
                        console.error("Could not find exchange rate", from, to, html);
                        return [2 /*return*/, 0];
                    }
                    rate = parseFloat(result[1]);
                    setCachedExchangeRate(from, to, rate);
                    return [2 /*return*/, rate];
            }
        });
    });
}
function getCachedExchangeRate(from, to) {
    var cache = GM_getValue("exchangeRate", {});
    var key = "".concat(from, "-").concat(to);
    var cached = cache[key];
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60) {
        return cached.rate;
    }
    return 0;
}
function setCachedExchangeRate(from, to, rate) {
    var cache = GM_getValue("exchangeRate", {});
    var key = "".concat(from, "-").concat(to);
    cache[key] = {
        from: from,
        to: to,
        rate: rate,
        timestamp: Date.now(),
    };
    GM_setValue("exchangeRate", cache);
}

;// CONCATENATED MODULE: ./src/price.ts
var price_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var price_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



/**
 * Get the price of the product items in the currency
 * @param currency Get the price of the product in this currency
 * @param localCurrency Convert the price to this currency
 * @returns The price of the product items in the currency
 */
function getPrice(currency, localCurrency) {
    if (localCurrency === void 0) { localCurrency = "JPY"; }
    return price_awaiter(this, void 0, void 0, function () {
        var items, prices, _i, items_1, item, price;
        return price_generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getItems(currency)];
                case 1:
                    items = _a.sent();
                    prices = [];
                    _i = 0, items_1 = items;
                    _a.label = 2;
                case 2:
                    if (!(_i < items_1.length)) return [3 /*break*/, 5];
                    item = items_1[_i];
                    return [4 /*yield*/, getPriceOfItem(item, currency, localCurrency)];
                case 3:
                    price = _a.sent();
                    prices.push(price);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    cachePrices(currency, prices);
                    return [2 /*return*/, prices];
            }
        });
    });
}
function getItems(currency) {
    var _a;
    return price_awaiter(this, void 0, void 0, function () {
        var cached, document, itemElements, items, index, _i, itemElements_1, item, name_1, priceContainer, priceLabel;
        return price_generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cached = getCachedPrice(currency);
                    if (cached)
                        return [2 /*return*/, cached.items];
                    return [4 /*yield*/, getProductPageInCountry(currency.countries[0].countryCode)];
                case 1:
                    document = _b.sent();
                    itemElements = Array.from(document.querySelectorAll(ITEMS_SELECTOR));
                    items = [];
                    index = 0;
                    for (_i = 0, itemElements_1 = itemElements; _i < itemElements_1.length; _i++) {
                        item = itemElements_1[_i];
                        name_1 = item.querySelector(NAME_SELECTOR);
                        priceContainer = item.querySelector(PRICE_CONTAINER_SELECTOR);
                        if (!name_1 || !priceContainer) {
                            console.error("Could not find name or price container", index++, item);
                            throw new Error("Could not find name or price container");
                        }
                        priceLabel = priceContainer.textContent;
                        if (!priceLabel) {
                            console.error("Could not find price", index++);
                            throw new Error("Could not find price");
                        }
                        items.push({
                            index: index++,
                            name: (_a = name_1.textContent) !== null && _a !== void 0 ? _a : "",
                            priceLabel: priceLabel,
                        });
                    }
                    return [2 /*return*/, items];
            }
        });
    });
}
function getPriceOfItem(item, currency, localCurrency) {
    var _a;
    if (localCurrency === void 0) { localCurrency = "JPY"; }
    return price_awaiter(this, void 0, void 0, function () {
        var parser, price, exchangeRate, localPrice;
        return price_generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parser = parsecurrency_default()("".concat(currency.currencyLabel, " ").concat(item.priceLabel));
                    price = (_a = parser === null || parser === void 0 ? void 0 : parser.value) !== null && _a !== void 0 ? _a : 0;
                    return [4 /*yield*/, getExchangeRate(currency.currencyLabel, localCurrency)];
                case 1:
                    exchangeRate = _b.sent();
                    localPrice = price * exchangeRate;
                    return [2 /*return*/, {
                            index: item.index,
                            name: item.name,
                            priceLabel: item.priceLabel,
                            price: price,
                            localPrice: localPrice,
                            currency: currency,
                        }];
            }
        });
    });
}
function getCacheKey(currency) {
    return "price-cache-".concat(location.pathname, "-").concat(currency.currencyLabel);
}
function getCachedPrice(currency) {
    clearExpiredCache();
    var key = getCacheKey(currency);
    var cached = GM_getValue("price-cache", {});
    var cachedPrice = cached[key];
    return cachedPrice !== null && cachedPrice !== void 0 ? cachedPrice : null;
}
function cachePrices(currency, prices) {
    var key = getCacheKey(currency);
    var cached = GM_getValue("price-cache", {});
    cached[key] = {
        timestamp: Date.now(),
        location: location.pathname,
        currencyLabel: currency.currencyLabel,
        items: prices.map(function (price) { return ({
            index: price.index,
            name: price.name,
            priceLabel: price.priceLabel,
        }); }),
    };
    GM_setValue("price-cache", cached);
}
function clearExpiredCache() {
    var cached = GM_getValue("price-cache", {});
    var keys = Object.keys(cached);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var cachedPrice = cached[key];
        if (cachedPrice.timestamp < Date.now() - 30 * 24 * 60 * 60 * 1000) {
            GM_deleteValue(key);
        }
    }
}
/**
 * Get product page html in target currency by country code
 * @param countryCode Country code of target currency
 * @returns HTML document of product page in target currency
 */
function getProductPageInCountry(countryCode) {
    return price_awaiter(this, void 0, void 0, function () {
        return price_generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: location.href,
                        cookie: "localization=".concat(countryCode),
                        anonymous: true,
                        onload: function (response) {
                            var html = new DOMParser().parseFromString(response.responseText, "text/html");
                            resolve(html);
                        },
                        onerror: function (error) {
                            reject(error);
                        },
                    });
                })];
        });
    });
}

;// CONCATENATED MODULE: ./src/product.ts

function product_getItems() {
    var items = document.querySelectorAll(ITEMS_SELECTOR);
    var itemArray = Array.from(items);
    return itemArray.map(function (item, index) {
        var _a, _b;
        return ({
            index: index,
            name: (_b = (_a = item.querySelector(NAME_SELECTOR)) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "",
            prices: [],
        });
    });
}
function setPrice(price, final) {
    if (final === void 0) { final = false; }
    var items = document.querySelectorAll(ITEMS_SELECTOR);
    var item = items[price.index];
    if (!item) {
        console.error("Could not find item", price.index);
        throw new Error("Could not find item when set price");
    }
    var priceContainer = item.querySelector(PRICE_CONTAINER_SELECTOR);
    if (!priceContainer) {
        console.error("Could not find price container", price.index);
        throw new Error("Could not find price container when set price");
    }
    var priceElement = document.createElement("div");
    priceElement.style.fontSize = "75%";
    priceElement.style.opacity = final ? "0.8" : "0.5";
    priceElement.classList.add("money");
    priceElement.classList.add("reference-price");
    priceElement.setAttribute("currency", price.currency.currencyLabel);
    priceElement.textContent = "".concat(price.currency.currencyLabel, ": (~").concat(price.localPrice.toFixed(2), " JPY) ").concat(price.priceLabel);
    var countries = price.currency.countries
        .map(function (country) { return country.countryLabel; })
        .join("\n");
    priceElement.setAttribute("title", countries);
    priceContainer.appendChild(priceElement);
}

;// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var src_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



entrypoint();
function entrypoint() {
    return src_awaiter(this, void 0, void 0, function () {
        var items, currencies, _i, currencies_1, currency, prices, _a, prices_1, price, item, _b, items_1, item, prices, _c, prices_2, price;
        return src_generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, waitForElement("form[action='/localization']")];
                case 1:
                    _d.sent();
                    items = product_getItems();
                    currencies = getCurrencies();
                    _i = 0, currencies_1 = currencies;
                    _d.label = 2;
                case 2:
                    if (!(_i < currencies_1.length)) return [3 /*break*/, 5];
                    currency = currencies_1[_i];
                    return [4 /*yield*/, getPrice(currency)];
                case 3:
                    prices = _d.sent();
                    for (_a = 0, prices_1 = prices; _a < prices_1.length; _a++) {
                        price = prices_1[_a];
                        setPrice(price);
                        item = items[price.index];
                        if (item.name !== price.name) {
                            console.warn("Item name is different", item, price);
                        }
                        items[price.index].prices.push(price);
                    }
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    document.querySelectorAll(".reference-price").forEach(function (e) { return e.remove(); });
                    for (_b = 0, items_1 = items; _b < items_1.length; _b++) {
                        item = items_1[_b];
                        prices = item.prices.sort(function (a, b) { return a.localPrice - b.localPrice; });
                        for (_c = 0, prices_2 = prices; _c < prices_2.length; _c++) {
                            price = prices_2[_c];
                            setPrice(price, true);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function waitForElement(selector) {
    return new Promise(function (resolve) {
        var element = document.querySelector(selector);
        if (element)
            return resolve(element);
        var observer = new MutationObserver(function () {
            var element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    });
}

})();

/******/ })()
;