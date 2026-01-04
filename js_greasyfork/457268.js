// ==UserScript==
// @name         Best price helper for marketplace
// @namespace    http://tampermonkey.net/
// @description  Считаем стоимость за штуку/за кг/за л
// @author       Apkawa
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=ozon.ru
// @match        https://ozon.ru/*
// @match        https://www.ozon.ru/*
// @match        https://lenta.com/*
// @match        https://okeydostavka.ru/*
// @match        https://www.okeydostavka.ru/*
// @match        https://perekrestok.ru/*
// @match        https://www.perekrestok.ru/*
// @match        https://wildberries.ru/*
// @match        https://www.wildberries.ru/*
// @homepage     https://github.com/Apkawa/best_price_userscript
// @homepageURL  https://github.com/Apkawa/best_price_userscript
// @supportURL   https://github.com/Apkawa/best_price_userscript/issues
// @version      0.5.15
// @downloadURL https://update.greasyfork.org/scripts/457268/Best%20price%20helper%20for%20marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/457268/Best%20price%20helper%20for%20marketplace.meta.js
// ==/UserScript==
(() => {
    "use strict";
    function getElementByXpath(xpath, root = document) {
        const e = document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return e && e;
    }
    function waitElement(match, callback, root = document.body) {
        const observer = new MutationObserver((mutations => {
            let matchFlag = false;
            mutations.forEach((mutation => {
                if (!mutation.addedNodes) return;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    matchFlag = match(node);
                }
            }));
            if (matchFlag) {
                _stop();
                callback();
                _start();
            }
        }));
        let isStarted = false;
        function _start() {
            if (isStarted) return;
            observer.observe(root || document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            isStarted = true;
        }
        function _stop() {
            observer.disconnect();
            isStarted = false;
        }
        _start();
        return () => {
            _stop();
        };
    }
    function waitCompletePage(callback, options = {}) {
        const {root = document.body, runOnce = true, sync = true, delay = 150} = options;
        let t;
        let lock = false;
        const run = () => {
            const stop = waitElement((() => true), (() => {
                if (t) clearTimeout(t);
                t = setTimeout((() => {
                    if (lock) return;
                    lock = true;
                    if (runOnce || sync) stop();
                    callback();
                    if (sync && !runOnce) setTimeout(run, delay);
                    lock = false;
                }), delay);
            }), root);
            return stop;
        };
        return run();
    }
    function E(tag, attributes = {}, ...children) {
        const element = document.createElement(tag);
        for (const [k, v] of Object.entries(attributes)) element.setAttribute(k, v);
        const fragment = document.createDocumentFragment();
        children.forEach((child => {
            if (typeof child === "string") child = document.createTextNode(child);
            fragment.appendChild(child);
        }));
        element.appendChild(fragment);
        return element;
    }
    function ElementGetOrCreate(root, options = {}) {
        var _a;
        const {className = "GM-wrap", pos = "appendChild"} = options;
        if (!root) return null;
        let wrapEl = (_a = root.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector("." + className);
        if (!wrapEl) {
            wrapEl = E("div", {
                class: className
            });
            root[pos](wrapEl);
        }
        return wrapEl;
    }
    function copyElementToNewRoot(el, toRoot, options = {}) {
        var _a;
        const {className = "GM-cloned", pos = "appendChild"} = options;
        if (!el) {
            console.warn(`el is ${typeof el}`);
            return;
        }
        let elList = [];
        if (el instanceof HTMLElement) elList = [ el ]; else elList = el;
        for (const e of ((_a = toRoot.parentElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll("." + className)) || []) e.remove();
        for (const _el of elList) {
            const clonedEl = _el.cloneNode(true);
            clonedEl.classList.add(className);
            toRoot[pos](clonedEl);
        }
    }
    function isFunction(x) {
        return typeof x === "function";
    }
    function matchLocation(...patterns) {
        const s = document.location.href;
        for (const p of patterns) {
            if (isFunction(p) && p(s)) return true;
            if (RegExp(p).test(s)) return true;
        }
        return false;
    }
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || function() {
            const style = document.createElement("style");
            style.type = "text/css";
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        }();
        const sheet = style.sheet;
        sheet === null || sheet === void 0 ? void 0 : sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }
    function isRegexp(value) {
        return toString.call(value) === "[object RegExp]";
    }
    function mRegExp(regExps) {
        return RegExp(regExps.map((function(r) {
            if (isRegexp(r)) return r.source;
            return r;
        })).join(""), "i");
    }
    function round(n, parts = 2) {
        const i = Math.pow(10, parts);
        return Math.round(n * i) / i;
    }
    Object.keys;
    const entries = Object.entries;
    const values = Object.values;
    function byPropertiesOf(sortBy) {
        function compareByProperty(arg) {
            let key;
            let sortOrder = 1;
            if (typeof arg === "string" && arg.startsWith("-")) {
                sortOrder = -1;
                key = arg.substr(1);
            } else key = arg;
            return function(a, b) {
                const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
                return result * sortOrder;
            };
        }
        return function(obj1, obj2) {
            let i = 0;
            let result = 0;
            const numberOfProperties = sortBy === null || sortBy === void 0 ? void 0 : sortBy.length;
            while (result === 0 && i < numberOfProperties) {
                result = compareByProperty(sortBy[i])(obj1, obj2);
                i++;
            }
            return result;
        };
    }
    function sort(arr, ...sortBy) {
        arr.sort(byPropertiesOf(sortBy));
    }
    const BEST_PRICE_CLASS_NAME = "GM-best-price";
    const BEST_PRICE_WRAP_CLASS_NAME = "GM-best-price-wrap";
    const ORDER_NAME_LOCAL_STORAGE = "GM-best-price-default-order";
    const MAX_NUMBER = 99999999999;
    const PREFIX = "bp_";
    function storeParsedTitleToElement(cardEl, parsedTitle) {
        cardEl.classList.add(BEST_PRICE_WRAP_CLASS_NAME);
        if (!parsedTitle) return;
        storeDataToElement(cardEl, parsedTitle);
    }
    function storeDataToElement(el, data) {
        const ds = el.dataset;
        for (const [k, v] of entries(data)) ds[PREFIX + k] = JSON.stringify(v);
    }
    function readDataFromElement(el) {
        const pairs = Object.entries(el.dataset).map((([k, v]) => {
            if (k.startsWith(PREFIX)) return [ k.replace(RegExp("^" + PREFIX), ""), JSON.parse(v || "") ];
            return [ null, null ];
        })).filter((([k]) => k));
        if (pairs.length > 0) return Object.fromEntries(pairs);
        return {};
    }
    function loadParsedTitleFromElement(cardEl) {
        const pairs = Object.entries(cardEl.dataset).map((([k, v]) => {
            if (k.startsWith(PREFIX)) return [ k.replace(RegExp("^" + PREFIX), ""), JSON.parse(v || "") ];
            return [ null, null ];
        })).filter((([k]) => k));
        if (pairs.length > 0) return Object.fromEntries(pairs);
        return null;
    }
    const BEST_ORDER_BUTTON_CLASS_NAME = "GM-best-price-button-wrap";
    function addStyles() {
        GM_addStyle(`button.${BEST_ORDER_BUTTON_CLASS_NAME} {\nborder: 1px solid gray !important; padding: 5px !important; margin: 3px !important; }\n`);
        GM_addStyle(`button.${BEST_ORDER_BUTTON_CLASS_NAME}.active { border: 2px solid red !important; }`);
    }
    addStyles();
    function initReorderCatalog(catalogRoot, buttonRoot) {
        var _a, _b, _c;
        const buttonWrap = buttonRoot;
        if (!buttonWrap) return;
        const catalogRecords = [];
        let i = 0;
        for (const wrapEl of catalogRoot.querySelectorAll(":scope > *")) {
            const el = wrapEl.classList.contains(BEST_PRICE_WRAP_CLASS_NAME) ? wrapEl : wrapEl.querySelector("." + BEST_PRICE_WRAP_CLASS_NAME);
            if (!el) {
                console.warn("!", el);
                continue;
            }
            const ds = Object.assign({
                initial_order: "0"
            }, loadParsedTitleFromElement(el));
            if (!ds) continue;
            i += 1;
            let initial_order = parseInt(ds.initial_order || "0");
            if (!initial_order) {
                initial_order = i;
                ds.initial_order = i.toString();
                storeDataToElement(el, {
                    initial_order: i
                });
            }
            const record = {
                el: wrapEl,
                initial_order,
                weight_price: ((_b = (_a = ds.units) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.price) ? ds.units[0].price : MAX_NUMBER,
                quantity_price: ds.quantity_price ? ds.quantity_price : MAX_NUMBER
            };
            catalogRecords.push(record);
            console.debug("Catalog order record: ", record);
        }
        const buttons = {
            initial_order: E("button", {
                class: BEST_ORDER_BUTTON_CLASS_NAME
            }, "Reset"),
            weight_price: E("button", {
                class: BEST_ORDER_BUTTON_CLASS_NAME
            }, "by Weight"),
            quantity_price: E("button", {
                class: BEST_ORDER_BUTTON_CLASS_NAME
            }, "by Quantity")
        };
        function buttonClickHandler(orderState) {
            console.log(orderState);
            localStorage.setItem(ORDER_NAME_LOCAL_STORAGE, orderState);
            sort(catalogRecords, orderState);
            refreshCatalog();
            setActiveButton(buttons[orderState]);
        }
        for (const [k, b] of entries(buttons)) b.onclick = () => {
            buttonClickHandler(k);
        };
        const defaultOrder = localStorage.getItem(ORDER_NAME_LOCAL_STORAGE);
        if (defaultOrder) if (defaultOrder === "initial_order") setActiveButton(buttons[defaultOrder]); else buttonClickHandler(defaultOrder);
        function refreshCatalog() {
            const wrap = catalogRoot;
            if (!wrap) return;
            const elements = document.createDocumentFragment();
            for (const c of catalogRecords) elements.appendChild(c.el);
            wrap.innerHTML = "";
            wrap.appendChild(elements);
        }
        function setActiveButton(button) {
            for (const b of values(buttons)) b.classList.remove("active");
            button.classList.add("active");
        }
        (_c = buttonWrap.querySelector("." + BEST_ORDER_BUTTON_CLASS_NAME)) === null || _c === void 0 ? void 0 : _c.remove();
        buttonWrap.appendChild(E("div", {
            class: BEST_ORDER_BUTTON_CLASS_NAME
        }, ...values(buttons)));
    }
    var __rest = void 0 && (void 0).__rest || function(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function") {
            var i = 0;
            for (p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
        }
        return t;
    };
    const WORD_BOUNDARY_END = /(?=\s+|[.,);/]|[хx]|[^\u0400-\u04ff]|$)/;
    const WEIGHT_REGEXP = mRegExp([ /(?<value>\d+[,.]\d+|\d+)/, /\s?/, "(?<unit>", "(?<weight_unit>(?<weight_SI>кг|килограмм(?:ов|а|))|г|грамм(?:ов|а|)|гр)", "|(?<volume_unit>(?<volume_SI>л|литр(?:ов|а|))|мл)", "|(?<length_unit>(?<length_SI>м|метр(?:ов|а|)))", ")\\.?", WORD_BOUNDARY_END ]);
    function plural(name, plurals = [ "ок", "ки", "ка" ]) {
        return `${name}(?:${plurals.join("|")})`;
    }
    const QUANTITY_UNITS = [ "шт", "рулон", "пакет", "уп", plural("упаков"), plural("салфет"), "таб", "капсул", plural("флакон", [ "", "a", "ов" ]), plural("пар", [ "", "a", "ы" ]) ];
    const QUANTITY_REGEXP = RegExp(`(?<quantity>\\d+)\\s?(?<quantity_unit>${QUANTITY_UNITS.join("|")})\\.?`);
    const QUANTITY_2_REGEXP = RegExp(`(?<quantity_2>\\d+)\\s?(?<quantity_2_unit>${QUANTITY_UNITS.join("|")})\\.?`);
    const COMBINE_DELIMETER_REGEXP = /\s*?(?:[xх*×/]|по)\s*?/;
    const COMBINE_QUANTITY_LIST = [ mRegExp([ /(?<quantity_2>\d+)/, COMBINE_DELIMETER_REGEXP, QUANTITY_REGEXP ]), mRegExp([ QUANTITY_REGEXP, COMBINE_DELIMETER_REGEXP, /(?<quantity_2>\d+)/ ]), mRegExp([ QUANTITY_2_REGEXP, COMBINE_DELIMETER_REGEXP, QUANTITY_REGEXP ]) ];
    const COMBINE_QANTITY_WEIGHT_REGEXP_LIST = [ mRegExp([ WEIGHT_REGEXP, COMBINE_DELIMETER_REGEXP, QUANTITY_REGEXP ]), mRegExp([ QUANTITY_REGEXP, COMBINE_DELIMETER_REGEXP, WEIGHT_REGEXP ]), mRegExp([ /(?<quantity>\d+)/, COMBINE_DELIMETER_REGEXP, WEIGHT_REGEXP ]), mRegExp([ WEIGHT_REGEXP, COMBINE_DELIMETER_REGEXP, /(?<quantity>\d+)/ ]) ];
    function parseGroups(groups, allowSum = true) {
        const result = {
            quantity: 1,
            units: []
        };
        if (groups.value) {
            const valueStr = groups === null || groups === void 0 ? void 0 : groups.value;
            const unit = groups === null || groups === void 0 ? void 0 : groups.unit;
            if (valueStr && unit) {
                let value = parseFloat(valueStr.replace(",", "."));
                let unit = null;
                if (groups.weight_unit) {
                    if (!groups.weight_SI) value /= 1e3;
                    unit = "кг";
                }
                if (groups.volume_unit) {
                    if (!groups.volume_SI) value /= 1e3;
                    unit = "л";
                }
                if (groups.length_unit) {
                    if (!groups.length_SI) value /= 1e3;
                    unit = "м";
                }
                if (!unit) throw "Unknown unit";
                result.units.push({
                    unit,
                    value,
                    total: value
                });
            }
        }
        if (groups.quantity) {
            const valueStr = groups === null || groups === void 0 ? void 0 : groups.quantity;
            if (valueStr) result.quantity = parseInt(valueStr);
        }
        if (allowSum && result.quantity > 1) for (const u of result.units) u.total = result.quantity * u.value;
        return result;
    }
    function parseTitle(title) {
        var _a;
        for (const r of COMBINE_QANTITY_WEIGHT_REGEXP_LIST) {
            const rMatch = r.exec(title);
            if (rMatch) return parseGroups(rMatch.groups);
        }
        let groups = {};
        const weightMatch = WEIGHT_REGEXP.exec(title);
        if (weightMatch === null || weightMatch === void 0 ? void 0 : weightMatch.groups) groups = weightMatch.groups;
        let quantity = 0;
        for (const r of COMBINE_QUANTITY_LIST) {
            const rMatch = (_a = r.exec(title)) === null || _a === void 0 ? void 0 : _a.groups;
            if ((rMatch === null || rMatch === void 0 ? void 0 : rMatch.quantity) && (rMatch === null || rMatch === void 0 ? void 0 : rMatch.quantity_2)) {
                quantity = parseInt(rMatch.quantity) * parseInt(rMatch.quantity_2);
                break;
            }
        }
        if (quantity) groups.quantity = quantity.toString(); else {
            const quantityMatch = QUANTITY_REGEXP.exec(title);
            if (quantityMatch === null || quantityMatch === void 0 ? void 0 : quantityMatch.groups) groups = Object.assign(Object.assign({}, groups), quantityMatch.groups);
        }
        let allowSum = true;
        if (groups === null || groups === void 0 ? void 0 : groups.value) allowSum = false;
        return parseGroups(groups, allowSum);
    }
    function parseTitleWithPrice(title, price) {
        const _a = parseTitle(title), {units} = _a, titleParsed = __rest(_a, [ "units" ]);
        const res = Object.assign(Object.assign({}, titleParsed), {
            units: [],
            quantity_price: null,
            quantity_price_display: null
        });
        if ((!res.quantity || res.quantity == 1) && !units.length) return null;
        for (const u of units) {
            const p = round(price / u.total);
            res.units.push(Object.assign(Object.assign({}, u), {
                price: p,
                price_display: `${p} ₽/${u.unit || "?"}`
            }));
        }
        if (res.quantity > 1) {
            res.quantity_price = round(price / res.quantity);
            res.quantity_price_display = `${res.quantity_price} ₽/шт`;
        }
        return res;
    }
    function parsePrice(text) {
        var _a, _b;
        text = (_a = text.split("₽")[0]) === null || _a === void 0 ? void 0 : _a.trim();
        if (!text) return null;
        text = text.replace("&thinsp;", "").replace(" ", "").replace(" ", "").replace(/\s/g, "");
        const price = (_b = text.match(/\d+(\s*[,.]\s*\d+)?/)) === null || _b === void 0 ? void 0 : _b[0].trim();
        if (price) return parseFloat(price);
        return null;
    }
    function getPriceFromElement(el) {
        var _a;
        const priceText = (_a = el === null || el === void 0 ? void 0 : el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (priceText) return parsePrice(priceText);
        return null;
    }
    function getPrice(sel, root = document.body) {
        const priceEl = (root || document.body).querySelector(sel);
        return getPriceFromElement(priceEl);
    }
    function renderBestPrice(titleInfo, extraStyle = {}) {
        const wrapEl = document.createElement("div");
        wrapEl.className = BEST_PRICE_CLASS_NAME;
        if (!titleInfo) return wrapEl;
        for (const u of titleInfo.units) {
            const el = document.createElement("p");
            el.innerHTML = u.price_display;
            wrapEl.appendChild(el);
        }
        if (titleInfo.quantity_price_display) {
            const qtyEl = document.createElement("p");
            qtyEl.innerHTML = titleInfo.quantity_price_display;
            wrapEl.appendChild(qtyEl);
        }
        if (wrapEl.childNodes.length) {
            wrapEl.style.border = "1px solid red";
            wrapEl.style.padding = "5px";
            wrapEl.style.margin = "5px";
            wrapEl.style.width = "fit-content";
            for (const [k, v] of entries(extraStyle || {})) if (typeof v == "string") wrapEl.style[k] = v;
        }
        return wrapEl;
    }
    function processProductCard(cardEl, options) {
        var _a, _b, _c;
        const {price_sel, title_sel, to_render, force} = options;
        if (!force && cardEl.classList.contains(BEST_PRICE_WRAP_CLASS_NAME)) return;
        const price = getPrice(price_sel, cardEl);
        const title = (_b = (_a = cardEl.querySelector(title_sel)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
        if (!title || !price) {
            console.warn("Not found price or title", title, price, cardEl);
            storeParsedTitleToElement(cardEl, null);
            return;
        }
        console.debug(title, price);
        const parsedTitle = parseTitleWithPrice(title, price);
        const renderedPrice = renderBestPrice(parsedTitle, options.extra_style);
        let to_render_sel = "";
        let to_render_pos = "after";
        if (typeof to_render === "string") to_render_sel = to_render; else {
            to_render_sel = to_render.sel;
            to_render_pos = to_render.pos || to_render_pos;
        }
        const to_render_els = cardEl.querySelectorAll(to_render_sel);
        for (const to_render_el of to_render_els) for (const e of ((_c = to_render_el === null || to_render_el === void 0 ? void 0 : to_render_el.parentElement) === null || _c === void 0 ? void 0 : _c.querySelectorAll("." + BEST_PRICE_CLASS_NAME)) || []) e.remove();
        let i = 0;
        for (const to_render_el of to_render_els) {
            let r = renderedPrice;
            if (i > 0) r = renderedPrice.cloneNode(true);
            to_render_el === null || to_render_el === void 0 ? void 0 : to_render_el[to_render_pos](r);
            i += 1;
        }
        storeParsedTitleToElement(cardEl, parsedTitle);
    }
    function initProductPage() {
        var _a;
        const productRoot = document.querySelector('[data-widget="container"]');
        if (!productRoot) return;
        const title = (_a = document.querySelector("[data-widget='webProductHeading']")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!title) return;
        processProductCard(productRoot, {
            price_sel: '[data-widget="webOzonAccountPrice"], [data-widget="webPrice"]',
            title_sel: '[data-widget="webProductHeading"]',
            to_render: {
                sel: '[data-widget="webPrice"]',
                pos: "appendChild"
            },
            force: false
        });
    }
    function processProductCardOld(cardEl) {
        const wrapEl = getElementByXpath("(a|div/a)/following-sibling::div[1]", cardEl);
        if (!wrapEl || (wrapEl === null || wrapEl === void 0 ? void 0 : wrapEl.querySelector(".GM-best-price"))) {
            storeParsedTitleToElement(cardEl, null);
            return;
        }
        const price = getPriceFromElement(wrapEl.querySelector("div"));
        const titleEl = wrapEl.querySelector("a span.tsBodyL, " + "a span.tsBodyM:not([style]), " + 'a span.tsBodyM[style="color:;"], ' + "a span.tsBody500Medium ");
        const title = titleEl === null || titleEl === void 0 ? void 0 : titleEl.textContent;
        if (!title || !price) {
            storeParsedTitleToElement(cardEl, null);
            return;
        }
        console.log(title, price);
        const parsedTitle = parseTitleWithPrice(title, price);
        titleEl === null || titleEl === void 0 ? void 0 : titleEl.before(renderBestPrice(parsedTitle));
        storeParsedTitleToElement(cardEl, parsedTitle);
    }
    function initCatalog() {
        var _a;
        const cardList = document.querySelectorAll(".widget-search-result-container > div > div" + ", #contentScrollPaginator div[data-widget='tileGridDesktop'] > div" + ",[data-widget='skuLine'] > div:nth-child(2) > div" + ",[data-widget='skuGridSimple'] > div:nth-child(2) > div" + ",[data-widget='skuGridSimple'] > div:nth-child(1) > div" + ",[data-widget='skuLine'] > div:nth-child(1) > div" + ",[data-widget='skuLineLR'] > div:nth-child(2) > div" + ",[data-widget='skuGrid'][style] > div:nth-child(2) > div" + ",[data-widget='skuGrid'] > div:nth-child(2) > div" + ",[data-widget='skuGrid']:not([style]) > div:nth-child(1) > div" + ",[data-widget='skuShelfGoods'] > div:nth-child(2) > div > div > div > div");
        for (const cardEl of cardList) processProductCardOld(cardEl);
        let catalogEl = document.querySelector("#contentScrollPaginator div[data-widget='tileGridDesktop']");
        if (!catalogEl) return;
        const buttonWrapEl = ElementGetOrCreate(document.querySelector("#paginator"), {
            className: "GM-button-wrap",
            pos: "before"
        });
        const el = catalogEl.querySelector(":scope > div");
        const isDetailCatalog = el && getComputedStyle(el).gridColumnStart === "span 12";
        if (isDetailCatalog) console.warn("is detail catalog, reorder disabled"); else {
            const catalogs = document.querySelectorAll("#contentScrollPaginator div[data-widget='tileGridDesktop']");
            const items = [];
            for (const catEl of catalogs) {
                items.push(...catEl.querySelectorAll(":scope > div"));
                catEl.innerHTML = "";
            }
            if (!((_a = readDataFromElement(catalogEl)) === null || _a === void 0 ? void 0 : _a["cloned"])) {
                const newCatEl = catalogEl.cloneNode(true);
                catalogEl.replaceWith(newCatEl);
                catalogEl = newCatEl;
                storeDataToElement(catalogEl, {
                    cloned: true
                });
            }
            catalogEl.append(...items);
            buttonWrapEl && initReorderCatalog(catalogEl, buttonWrapEl);
        }
        const paginator = document.querySelector('[data-widget="megaPaginator"] > div:nth-child(2)');
        const paginatorWrap = document.querySelector(".widget-search-result-container");
        if (paginator === null || paginator === void 0 ? void 0 : paginator.querySelector("a")) paginatorWrap && copyElementToNewRoot(paginator, paginatorWrap, {
            pos: "before"
        });
    }
    (function() {
        "use strict";
        if (!matchLocation("^https://(www\\.|)ozon\\.ru/.*")) return;
        console.log("OZON.ru");
        waitCompletePage((() => {
            if (matchLocation("^https://(www\\.|)ozon\\.ru/product/.*")) initProductPage();
            if (matchLocation("^https://(www\\.|)ozon\\.ru/")) initCatalog();
            if (matchLocation("^https://(www\\.|)ozon\\.ru/(category|highlight|search|my|product|brand)/.*")) initCatalog();
        }), {
            runOnce: false
        });
    })();
    function lenta_com_initProductPage() {
        const productRoot = document.querySelector(".product-page_info-block");
        if (!productRoot) return;
        processProductCard(productRoot, {
            price_sel: ".product-price .main-price",
            title_sel: "lu-product-page-name h1",
            to_render: {
                sel: ".product-base-info_content",
                pos: "after"
            },
            force: false
        });
    }
    function processProductCardCatalog(cardEl) {
        var _a, _b;
        if (cardEl.classList.contains(BEST_PRICE_WRAP_CLASS_NAME)) return;
        const price = getPriceFromElement(cardEl.querySelector(".product-price .main-price"));
        const title = (_b = (_a = cardEl.querySelector(".lu-product-card-name")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
        if (!title || !price) {
            storeParsedTitleToElement(cardEl, null);
            return;
        }
        console.log(title, price);
        const parsedTitle = parseTitleWithPrice(title, price);
        cardEl === null || cardEl === void 0 ? void 0 : cardEl.appendChild(renderBestPrice(parsedTitle));
        storeParsedTitleToElement(cardEl, parsedTitle);
    }
    function lenta_com_initCatalog() {
        const cardList = document.querySelectorAll("lu-grid .lu-grid__item:has(:not(lu-placeholder))" + ",lu-slider .product-card:has(:not(lu-placeholder))");
        for (const cardEl of cardList) processProductCardCatalog(cardEl);
        const catalogWrapEl = document.querySelector("lu-catalog-list lu-grid > div");
        const buttonWrapEl = ElementGetOrCreate(document.querySelector("lu-catalog-list .catalog-list"), {
            pos: "before"
        });
        if (catalogWrapEl && buttonWrapEl) initReorderCatalog(catalogWrapEl, buttonWrapEl);
        const catalogEl = document.querySelector("lu-catalog-list .catalog-list");
        const paginationRootWrap = ElementGetOrCreate(catalogEl, {
            pos: "before",
            className: "GM-pagination-clone"
        });
        paginationRootWrap && copyElementToNewRoot(catalogEl === null || catalogEl === void 0 ? void 0 : catalogEl.querySelectorAll(".pagination"), paginationRootWrap);
    }
    (function() {
        "use strict";
        if (!matchLocation("^https://lenta\\.com/.*")) return;
        GM_addStyle(`:root {\n    --product-card-height-mobile: 384px !important;\n    --products-slider-height: 400px !important;\n  }`);
        console.log("Lenta.com");
        waitCompletePage((() => {
            if (matchLocation("^https://lenta\\.com/product/.*")) lenta_com_initProductPage();
            if (matchLocation("^https://lenta\\.com/(catalog|search|brand|product)/.*")) lenta_com_initCatalog();
        }), {
            runOnce: false
        });
    })();
    function okeydostavka_ru_initProductPage() {
        const init = () => {
            var _a, _b, _c, _d;
            const productWrapEl = document.querySelector(".product_main_info");
            if (!productWrapEl) return;
            const title = (_b = (_a = productWrapEl === null || productWrapEl === void 0 ? void 0 : productWrapEl.querySelector("h1.main_header")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            const price = parseFloat(((_c = productWrapEl === null || productWrapEl === void 0 ? void 0 : productWrapEl.querySelector('.product-price > meta[itemprop="price"]')) === null || _c === void 0 ? void 0 : _c.content) || "");
            if (!price || !title) return;
            console.log(title, price);
            const parsedTitle = parseTitleWithPrice(title, price);
            (_d = productWrapEl === null || productWrapEl === void 0 ? void 0 : productWrapEl.querySelector(".product-price")) === null || _d === void 0 ? void 0 : _d.after(renderBestPrice(parsedTitle));
        };
        waitCompletePage((() => {
            init();
        }));
    }
    function okeydostavka_ru_processProductCard(cardEl) {
        var _a, _b;
        if (cardEl.classList.contains(BEST_PRICE_WRAP_CLASS_NAME)) return;
        const priceEl = cardEl === null || cardEl === void 0 ? void 0 : cardEl.querySelector(".price_and_cart .product-price");
        const price = getPriceFromElement(priceEl === null || priceEl === void 0 ? void 0 : priceEl.querySelector(":scope > span.price"));
        const title = (_b = (_a = cardEl.querySelector(".product-name a")) === null || _a === void 0 ? void 0 : _a.getAttribute("title")) === null || _b === void 0 ? void 0 : _b.trim();
        if (!title || !price) {
            storeParsedTitleToElement(cardEl, null);
            return;
        }
        console.log(title, price);
        const parsedTitle = parseTitleWithPrice(title, price);
        const productEl = (cardEl === null || cardEl === void 0 ? void 0 : cardEl.querySelector(".product")) || cardEl;
        productEl === null || productEl === void 0 ? void 0 : productEl.appendChild(renderBestPrice(parsedTitle));
        cardEl.querySelectorAll("[onclick^='gtm']").forEach((el => {
            el.removeAttribute("onclick");
        }));
        storeParsedTitleToElement(cardEl, parsedTitle);
    }
    function okeydostavka_ru_initCatalog() {
        const init = () => {
            const cardList = document.querySelectorAll(".product_listing_container li" + ", .also-products  li > div.product" + ", .similar-products  li > div.product" + ", .catalogEntryRecommendationWidget  li > div.product");
            for (const cardEl of cardList) okeydostavka_ru_processProductCard(cardEl);
            const catalogWrapEl = document.querySelector(".product_listing_container > ul");
            const buttonWrapEl = ElementGetOrCreate(catalogWrapEl, {
                pos: "before"
            });
            if (catalogWrapEl && buttonWrapEl) initReorderCatalog(catalogWrapEl, buttonWrapEl);
            waitCompletePage((() => {
                init();
            }));
        };
        waitCompletePage((() => {
            init();
        }));
    }
    (function() {
        "use strict";
        if (!matchLocation("^https://(www\\.|)okeydostavka.ru/.*")) return;
        if (document.querySelector(".product_main_info")) okeydostavka_ru_initProductPage();
        okeydostavka_ru_initCatalog();
    })();
    function auchan_ru_initProductPage() {
        const init = () => {
            var _a, _b, _c;
            if (document.querySelector("main .GM-best-price")) return;
            const title = (_b = (_a = document.querySelector("main h1#productName")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            const price = getPrice("main .fullPricePDP");
            if (!price || !title) return;
            console.log(title, price);
            const parsedTitle = parseTitleWithPrice(title, price);
            (_c = document.querySelector("main .fullPricePDP")) === null || _c === void 0 ? void 0 : _c.after(renderBestPrice(parsedTitle));
        };
        init();
    }
    function auchan_ru_processProductCard(cardEl, priceSel, titleSel, renderPriceSel) {
        var _a, _b, _c;
        if (cardEl.classList.contains(BEST_PRICE_WRAP_CLASS_NAME)) return;
        const price = getPriceFromElement(cardEl.querySelector(priceSel));
        const title = (_b = (_a = cardEl.querySelector(titleSel)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
        if (!title || !price) {
            storeParsedTitleToElement(cardEl, null);
            return;
        }
        console.log(title, price);
        const parsedTitle = parseTitleWithPrice(title, price);
        (_c = cardEl.querySelector(renderPriceSel)) === null || _c === void 0 ? void 0 : _c.after(renderBestPrice(parsedTitle));
        storeParsedTitleToElement(cardEl, parsedTitle);
    }
    function auchan_ru_initCatalog() {
        const init = () => {
            const cardList = document.querySelectorAll("article.productCard");
            for (const cardEl of cardList) auchan_ru_processProductCard(cardEl, ".productCardPriceData > div", ".linkToPDP", ".productCardPriceData ");
            const catalogWrapEl = getElementByXpath('//article[contains(@class,"productCard")]/ancestor::main//article/../..');
            if (!document.querySelector(".GM-wrap")) {
                const buttonWrapEl = ElementGetOrCreate(document.querySelector("#categoriesThirdLvlList"), {
                    pos: "after"
                });
                if (catalogWrapEl && buttonWrapEl) initReorderCatalog(catalogWrapEl, buttonWrapEl);
            }
            const catalogEl = document.querySelector(".catalog-view__main");
            const paginationRootWrap = ElementGetOrCreate(catalogEl, {
                pos: "before",
                className: "GM-pagination-clone"
            });
            paginationRootWrap && copyElementToNewRoot(catalogEl === null || catalogEl === void 0 ? void 0 : catalogEl.querySelectorAll(".pagination"), paginationRootWrap);
        };
        init();
    }
    function initSearchResults() {
        const cardList = document.querySelectorAll(".digi-product");
        for (const cardEl of cardList) auchan_ru_processProductCard(cardEl, ".digi-product-price-variant_actual", ".digi-product__label", ".price-and-cart");
        const catalogWrapEl = document.querySelector(".digi-products-grid");
        if (!document.querySelector(".digi-search .GM-wrap")) {
            const buttonWrapEl = ElementGetOrCreate(document.querySelector(".digi-main-results-actions"), {
                pos: "after"
            });
            if (catalogWrapEl && buttonWrapEl) initReorderCatalog(catalogWrapEl, buttonWrapEl);
        }
    }
    (function() {
        "use strict";
        if (!matchLocation("^https://(www\\.|)auchan\\.ru/.*")) return;
        console.log("Auchan.ru");
        waitCompletePage((() => {
            if (document.querySelector("#productName")) auchan_ru_initProductPage(); else if (document.querySelector(".digi-product")) initSearchResults(); else auchan_ru_initCatalog();
        }), {
            runOnce: false
        });
    })();
    function perekrestok_ru_initProductPage() {
        var _a;
        const productRoot = document.querySelector("main");
        if (!productRoot) return;
        const productId = (_a = productRoot.querySelector('[itemprop="sku"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content");
        if (productId && productRoot.dataset.productId !== productId) {
            productRoot.classList.remove(BEST_PRICE_WRAP_CLASS_NAME);
            productRoot.dataset.productId = productId;
        }
        processProductCard(productRoot, {
            price_sel: "div.price-new",
            title_sel: "h1.product__title",
            to_render: {
                sel: "div.price-new",
                pos: "after"
            }
        });
    }
    function perekrestok_ru_initCatalog() {
        const cardList = document.querySelectorAll(".product-card-wrapper" + ", .swiper-slide");
        for (const cardEl of cardList) processProductCard(cardEl, {
            price_sel: "div.price-new",
            title_sel: "span.product-card__link-text",
            to_render: "div.product-card__control"
        });
        for (const group of document.querySelectorAll(".catalog-content-group__list")) {
            const cards = group.querySelectorAll(":scope > div:not(.GM-fix) > div > div > div");
            const cardsWrap = ElementGetOrCreate(group, {
                className: "GM-fix"
            });
            for (const c of cards) {
                c.style.width = "220px";
                cardsWrap === null || cardsWrap === void 0 ? void 0 : cardsWrap.appendChild(c);
            }
            const buttonWrapEl = ElementGetOrCreate(group, {
                pos: "before"
            });
            if (buttonWrapEl && cardsWrap) {
                cardsWrap.style.display = "flex";
                cardsWrap.style.flexWrap = "wrap";
                initReorderCatalog(cardsWrap, buttonWrapEl);
            }
        }
    }
    (function() {
        "use strict";
        const prefix = "https://(www\\.|)perekrestok\\.ru";
        if (!matchLocation(prefix)) return;
        console.log("Perekrestok.ru");
        waitCompletePage((() => {
            if (matchLocation(prefix + "/cat/\\d+/p/")) perekrestok_ru_initProductPage();
            perekrestok_ru_initCatalog();
        }), {
            runOnce: false,
            delay: 300
        });
    })();
    const extraStyle = {
        fontSize: "1rem",
        color: "black"
    };
    function wildberries_ru_initProductPage() {
        const productRoot = document.querySelector(".product-page");
        if (!productRoot) return;
        processProductCard(productRoot, {
            price_sel: ".price-block__final-price",
            title_sel: ".product-page__header h1",
            to_render: ".price-block",
            extra_style: extraStyle,
            force: true
        });
        const cardList = document.querySelectorAll(".product-card");
        for (const cardEl of cardList) processProductCard(cardEl, {
            price_sel: ".price__lower-price",
            title_sel: ".product-card__name",
            to_render: ".product-card__price",
            extra_style: extraStyle
        });
    }
    function initPopup() {
        const productPopupRoot = document.querySelector(".popup .product");
        if (!productPopupRoot) return;
        processProductCard(productPopupRoot, {
            price_sel: ".price-block__final-price",
            title_sel: ".product__header",
            to_render: ".price-block",
            extra_style: extraStyle
        });
    }
    function wildberries_ru_initCatalog() {
        const cardList = document.querySelectorAll(".product-card");
        for (const cardEl of cardList) processProductCard(cardEl, {
            price_sel: ".price__lower-price",
            title_sel: ".product-card__name",
            to_render: ".product-card__price",
            extra_style: extraStyle
        });
        const catalogWrapEl = document.querySelector(".product-card-list");
        const buttonWrapEl = ElementGetOrCreate(document.querySelector(".catalog-page__main"), {
            pos: "before"
        });
        if (catalogWrapEl && buttonWrapEl) initReorderCatalog(catalogWrapEl, buttonWrapEl);
        const paginationRootWrap = ElementGetOrCreate(catalogWrapEl, {
            pos: "before",
            className: "GM-pagination-clone"
        });
        paginationRootWrap && copyElementToNewRoot(document.querySelectorAll(".pager-bottom:not(.GM-cloned)"), paginationRootWrap);
    }
    (function() {
        "use strict";
        const prefix = "https://(www\\.|)wildberries\\.ru/";
        if (!matchLocation(prefix)) return;
        console.debug("Wildberries.ru");
        waitCompletePage((() => {
            wildberries_ru_initProductPage();
            initPopup();
            wildberries_ru_initCatalog();
        }), {
            runOnce: false,
            delay: 200
        });
    })();
})();