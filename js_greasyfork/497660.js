// ==UserScript==
// @name Farm RPG Farmhand
// @description Your helper around the RPG Farm
// @version 1.0.31
// @author Ansel Santosa <568242+anstosa@users.noreply.github.com>
// @match https://farmrpg.com/*
// @match https://alpha.farmrpg.com/*
// @connect greasyfork.org
// @connect github.com
// @grant GM.deleteValue
// @grant GM.getValue
// @grant GM.listValues
// @grant GM.setClipboard
// @grant GM.setValue
// @grant GM.xmlHttpRequest
// @icon https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @license MIT
// @namespace https://github.com/anstosa/farmrpg-farmhand
// @downloadURL https://update.greasyfork.org/scripts/497660/Farm%20RPG%20Farmhand.user.js
// @updateURL https://update.greasyfork.org/scripts/497660/Farm%20RPG%20Farmhand.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3413:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pageDataState = exports.isItem = exports.getBasicItems = exports.getAbridgedItem = exports.itemDataState = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(6747);
exports.itemDataState = new state_1.CachedState(state_1.StorageKey.ITEM_DATA, (state, itemName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!itemName) {
        return;
    }
    const previous = state.state[itemName];
    if (previous) {
        return previous;
    }
    if (!itemName) {
        return;
    }
    const response = yield fetch(`https://buddy.farm/page-data/i/${(0, requests_1.nameToSlug)(itemName)}/page-data.json`);
    const data = (yield response.json());
    const item = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.farmrpg) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d[0];
    if (!item) {
        console.error(`Item ${itemName} not found`);
        return previous;
    }
    return item;
}), {
    timeout: 60 * 24 * 7, // 1 week
});
const getAbridgedItem = (itemName) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield exports.itemDataState.get({ query: itemName, lazy: true });
    return item
        ? {
            __typename: item.__typename,
            id: item.id,
            image: item.image,
            name: item.name,
        }
        : {
            __typename: "FarmRPG_Item",
            id: 0,
            image: "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTIwIDEyMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+PGRlZnM+PGxpbmUgaWQ9J2wnIHgxPSc2MCcgeDI9JzYwJyB5MT0nNycgeTI9JzI3JyBzdHJva2U9JyM2YzZjNmMnIHN0cm9rZS13aWR0aD0nMTEnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjwvZGVmcz48Zz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDYwLDYwKScvPjx1c2UgeGxpbms6aHJlZj0nI2wnIG9wYWNpdHk9Jy4yNycgdHJhbnNmb3JtPSdyb3RhdGUoNjAgNjAsNjApJy8+PHVzZSB4bGluazpocmVmPScjbCcgb3BhY2l0eT0nLjI3JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDE1MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMzcnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNDYnIHRyYW5zZm9ybT0ncm90YXRlKDIxMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNTYnIHRyYW5zZm9ybT0ncm90YXRlKDI0MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNjYnIHRyYW5zZm9ybT0ncm90YXRlKDI3MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuODUnIHRyYW5zZm9ybT0ncm90YXRlKDMzMCA2MCw2MCknLz48L2c+PC9zdmc+",
            name: itemName,
        };
});
exports.getAbridgedItem = getAbridgedItem;
const getBasicItems = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { items } = (_a = (yield exports.pageDataState.get())) !== null && _a !== void 0 ? _a : {};
    return (_b = items === null || items === void 0 ? void 0 : items.map(({ name, image }) => ({ name, image }))) !== null && _b !== void 0 ? _b : [];
});
exports.getBasicItems = getBasicItems;
const isItem = (name) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const items = yield (0, exports.getBasicItems)();
    const searchName = (_a = requests_1.NAME_OVERRIDES[name]) !== null && _a !== void 0 ? _a : name;
    return items.some((item) => item.name === searchName);
});
exports.isItem = isItem;
exports.pageDataState = new state_1.CachedState(state_1.StorageKey.PAGE_DATA, () => __awaiter(void 0, void 0, void 0, function* () {
    const pages = {
        townsfolk: [],
        questlines: [],
        quizzes: [],
        quests: [],
        items: [],
        pages: [],
    };
    const response = yield fetch("https://buddy.farm/search.json");
    const data = (yield response.json());
    for (const page of data) {
        // eslint-disable-next-line unicorn/prefer-switch
        if (page.type === "Townsfolk") {
            pages.townsfolk.push(page);
        }
        else if (page.type === "Questline") {
            pages.questlines.push(page);
        }
        else if (page.type === "Schoolhouse Quiz") {
            pages.quizzes.push(page);
        }
        else if (page.href.startsWith("/q/")) {
            pages.quests.push(page);
        }
        else if (page.href.startsWith("/i/")) {
            pages.items.push(page);
        }
        else {
            pages.pages.push(page);
        }
    }
    return pages;
}), {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: {
        townsfolk: [],
        questlines: [],
        quizzes: [],
        quests: [],
        items: [],
        pages: [],
    },
});


/***/ }),

/***/ 6747:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nameToSlug = exports.NAME_OVERRIDES = void 0;
exports.NAME_OVERRIDES = {
    "Gold Pea": "Gold Peas",
    "Gold Pepper": "Gold Peppers",
    "Mega Beet": "Mega Beet Seeds",
    "Mega Sunflower": "Mega Sunflower Seeds",
    "Mega Cotton": "Mega Cotton Seeds",
    Pea: "Peas",
    Pepper: "Peppers",
    Pine: "Pine Tree",
};
const nameToSlug = (name) => {
    var _a;
    let slug = (_a = exports.NAME_OVERRIDES[name]) !== null && _a !== void 0 ? _a : name;
    // delete item markings
    slug = slug.replaceAll("*", "");
    // trim whitespace
    slug = slug.trim();
    // lowercase
    slug = slug.toLowerCase();
    // replace punctuation and whitespace with hyphens
    slug = slug.replaceAll(/[^\da-z]/g, "-");
    return slug;
};
exports.nameToSlug = nameToSlug;


/***/ }),

/***/ 4938:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.withdrawSilver = exports.depositSilver = exports.statsState = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
const processStats = (root) => {
    var _a;
    const matches = (_a = root.body.textContent) === null || _a === void 0 ? void 0 : _a.match(/[^\d,]+([\d,]+)[^\d,]+([\d,]+)[^\d,]+([\d,]+)/);
    if (!matches || matches.length < 4) {
        return { silver: 0, gold: 0, ancientCoins: 0 };
    }
    const [_, silverMatch, goldMatch, ancientCoinsMatch] = matches;
    const silver = Number(silverMatch.replaceAll(",", ""));
    const gold = Number(goldMatch.replaceAll(",", ""));
    const ancientCoins = Number(ancientCoinsMatch.replaceAll(",", ""));
    return { silver, gold, ancientCoins };
};
exports.statsState = new state_1.CachedState(state_1.StorageKey.STATS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.GET_STATS }));
    return processStats(response);
}), {
    interceptors: [
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.GET_STATS })],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                state.set(processStats(yield (0, requests_1.getDocument)(response)));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.DEPOSIT_SILVER }),
            ],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const [_, query] = (0, requests_2.parseUrl)(response.url);
                if (!previous) {
                    return;
                }
                yield state.set(Object.assign(Object.assign({}, previous), { silver: previous.silver - Number(query.get("amt")) }));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.WITHDRAW_SILVER }),
            ],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const [_, query] = (0, requests_2.parseUrl)(response.url);
                if (!previous) {
                    return;
                }
                yield state.set(Object.assign(Object.assign({}, previous), { silver: previous.silver + Number(query.get("amt")) }));
            }),
        },
    ],
    defaultState: {
        silver: 0,
        gold: 0,
        ancientCoins: 0,
    },
});
const depositSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.DEPOSIT_SILVER, amt: amount.toString() }));
});
exports.depositSilver = depositSilver;
const withdrawSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({
        go: page_1.WorkerGo.WITHDRAW_SILVER,
        amt: amount.toString(),
    }));
});
exports.withdrawSilver = withdrawSilver;


/***/ }),

/***/ 6228:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.harvestAll = exports.farmIdState = exports.farmStatusState = exports.CropStatus = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const popup_1 = __webpack_require__(469);
var CropStatus;
(function (CropStatus) {
    CropStatus["EMPTY"] = "empty";
    CropStatus["GROWING"] = "growing";
    CropStatus["READY"] = "ready";
})(CropStatus || (exports.CropStatus = CropStatus = {}));
const processFarmStatus = (root) => {
    const statusText = root.textContent;
    if (!statusText) {
        return {
            status: CropStatus.EMPTY,
            count: 0,
            readyAt: Number.POSITIVE_INFINITY,
        };
    }
    // 36 READY!
    const count = Number(statusText.split(" ")[0]);
    let status = CropStatus.EMPTY;
    let readyAt = Number.POSITIVE_INFINITY;
    if (statusText.toLowerCase().includes("growing")) {
        status = CropStatus.GROWING;
        // new sure when ready, check again in a minute
        readyAt = Date.now() + 60 * 1000;
    }
    else if (statusText.toLowerCase().includes("ready")) {
        status = CropStatus.READY;
        readyAt = Date.now();
    }
    return { status, count, readyAt };
};
const processFarmPage = (root) => {
    var _a;
    const plots = root.querySelectorAll("#croparea #crops .col-25");
    const count = plots.length;
    let status = CropStatus.EMPTY;
    let readyAt = Number.POSITIVE_INFINITY;
    for (const plot of plots) {
        const image = plot.querySelector("img");
        if ((image === null || image === void 0 ? void 0 : image.style.opacity) === "1") {
            status = CropStatus.READY;
            readyAt = Date.now();
        }
        else if (status === CropStatus.EMPTY) {
            status = CropStatus.GROWING;
            readyAt = Math.min(readyAt, Date.now() + Number((_a = image === null || image === void 0 ? void 0 : image.dataset.seconds) !== null && _a !== void 0 ? _a : "60") * 1000);
        }
    }
    return { status, count, readyAt };
};
const scheduledUpdates = {};
exports.farmStatusState = new state_1.CachedState(state_1.StorageKey.FARM_STATUS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.FARM, new URLSearchParams());
    return processFarmPage(response.body);
}), {
    timeout: 5,
    defaultState: {
        status: CropStatus.EMPTY,
        count: 4,
        readyAt: Number.POSITIVE_INFINITY,
    },
    interceptors: [
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.READY_COUNT })],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                state.set(processFarmStatus(root.body));
            }),
        },
        {
            match: [page_1.Page.FARM, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                yield state.set(processFarmPage(root.body));
            }),
        },
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                const linkStatus = root.body.querySelector("a[href^='xfarm.php'] .item-after");
                if (!linkStatus) {
                    return;
                }
                yield state.set(processFarmStatus(linkStatus));
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.FARM_STATUS })],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const raw = yield response.text();
                const rawPlots = raw.split(";");
                if (rawPlots.length < ((_a = previous === null || previous === void 0 ? void 0 : previous.count) !== null && _a !== void 0 ? _a : 4)) {
                    yield state.set(Object.assign(Object.assign({}, previous), { status: CropStatus.EMPTY }));
                    return;
                }
                let status = CropStatus.EMPTY;
                for (const plot of rawPlots) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [plotId, percent, secondsLeft, secondsSince] = plot.split("-");
                    const percentReady = Number(percent);
                    if (percentReady === 100) {
                        status = CropStatus.READY;
                        break;
                    }
                    else if (percentReady > 0) {
                        status = CropStatus.GROWING;
                    }
                }
                yield state.set(Object.assign(Object.assign({}, previous), { status }));
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.HARVEST_ALL })],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(Object.assign(Object.assign({}, previous), { status: CropStatus.EMPTY }));
                const { drops } = (yield response.json());
                const [page] = (0, page_1.getPage)();
                const settings = yield (0, settings_1.getSettingValues)();
                if (page !== page_1.Page.FARM || settings[settings_1.SettingId.HARVEST_NOTIFICATIONS]) {
                    (0, popup_1.showPopup)({
                        title: "Harvested Crops",
                        contentHTML: `
              ${Object.values(drops)
                            .map((drop) => `
                    <img
                      src="${drop.img}"
                      style="
                        vertical-align: middle;
                        width: 18px;
                      "
                    >
                    (x${drop.qty})
                  `)
                            .join("&nbsp;")}
            `,
                        actions: [
                            {
                                name: "Replant",
                                buttonClass: "btnblue",
                                callback: () => __awaiter(void 0, void 0, void 0, function* () {
                                    var _a;
                                    const farmId = yield exports.farmIdState.get();
                                    if (!farmId) {
                                        console.error("No farm id found");
                                        return;
                                    }
                                    if (page === page_1.Page.FARM) {
                                        (_a = document
                                            .querySelector(".plantallbtn")) === null || _a === void 0 ? void 0 : _a.click();
                                    }
                                    else {
                                        yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({
                                            go: page_1.WorkerGo.PLANT_ALL,
                                            id: String(farmId),
                                        }));
                                    }
                                }),
                            },
                        ],
                    });
                }
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.PLANT_ALL })],
            callback: (state, previous) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(Object.assign(Object.assign({}, previous), { status: CropStatus.GROWING }));
            }),
        },
    ],
});
const updateStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = exports.farmStatusState.read();
    if (!state) {
        return;
    }
    if (state.readyAt < Date.now()) {
        yield exports.farmStatusState.set(Object.assign(Object.assign({}, state), { status: CropStatus.READY }));
    }
});
// automatically update crops when finished
exports.farmStatusState.onUpdate((state) => {
    if (!state) {
        return;
    }
    if (scheduledUpdates[state.readyAt]) {
        return;
    }
    scheduledUpdates[state.readyAt] = setTimeout(updateStatus, state.readyAt - Date.now());
});
const processFarmId = (root) => {
    var _a;
    const farmIdRaw = (_a = root.querySelector("#farm")) === null || _a === void 0 ? void 0 : _a.textContent;
    return farmIdRaw ? Number(farmIdRaw) : undefined;
};
exports.farmIdState = new state_1.CachedState(state_1.StorageKey.FARM_ID, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.FARM, new URLSearchParams());
    return processFarmId(response.body);
}), {
    timeout: Number.POSITIVE_INFINITY,
    defaultState: -1,
    interceptors: [
        {
            match: [page_1.Page.FARM, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                yield state.set(processFarmId(root.body));
            }),
        },
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                const status = root.body.querySelector("a[href^='xfarm.php'] .item-after span");
                if (!status) {
                    return;
                }
                yield state.set(Number(status.dataset.id));
            }),
        },
    ],
});
const harvestAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const farmId = yield exports.farmIdState.get();
    yield (0, requests_2.getJSON)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.HARVEST_ALL, id: String(farmId) }));
});
exports.harvestAll = harvestAll;


/***/ }),

/***/ 7046:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.chatState = exports.musicState = exports.darkModeState = exports.betaState = exports.userIdState = exports.usernameState = void 0;
const state_1 = __webpack_require__(4782);
exports.usernameState = new state_1.CachedState(state_1.StorageKey.USERNAME, () => {
    var _a;
    return Promise.resolve(((_a = document.querySelector("#logged_in_username")) === null || _a === void 0 ? void 0 : _a.textContent) || undefined);
}, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: "",
});
exports.userIdState = new state_1.CachedState(state_1.StorageKey.USERNAME, () => {
    var _a;
    const userIdRaw = (_a = document.querySelector("#logged_in_userid")) === null || _a === void 0 ? void 0 : _a.textContent;
    return Promise.resolve(userIdRaw ? Number(userIdRaw) : undefined);
}, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: -1,
});
exports.betaState = new state_1.CachedState(state_1.StorageKey.IS_BETA, () => { var _a; return Promise.resolve(((_a = document.querySelector("#is_beta")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
});
exports.darkModeState = new state_1.CachedState(state_1.StorageKey.IS_DARK_MODE, () => { var _a; return Promise.resolve(((_a = document.querySelector("#dark_mode")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
});
exports.musicState = new state_1.CachedState(state_1.StorageKey.IS_MUSIC_ENABLED, () => { var _a; return Promise.resolve(((_a = document.querySelector("#dark_mode")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
});
exports.chatState = new state_1.CachedState(state_1.StorageKey.IS_CHAT_ENABLED, () => { var _a; return Promise.resolve(((_a = document.querySelector("#chat")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
});


/***/ }),

/***/ 202:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.collectAll = exports.kitchenStatusState = exports.OvenStatus = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
const popup_1 = __webpack_require__(469);
const time_1 = __webpack_require__(4435);
var OvenStatus;
(function (OvenStatus) {
    OvenStatus["EMPTY"] = "empty";
    OvenStatus["COOKING"] = "cooking";
    OvenStatus["ATTENTION"] = "attention";
    OvenStatus["READY"] = "complete";
})(OvenStatus || (exports.OvenStatus = OvenStatus = {}));
const processKitchenStatus = (root) => {
    const statusText = root === null || root === void 0 ? void 0 : root.textContent;
    if (!statusText) {
        return {
            status: OvenStatus.EMPTY,
            count: 0,
            allReady: false,
            checkAt: Number.POSITIVE_INFINITY,
        };
    }
    // 36 READY!
    const count = Number(statusText.split(" ")[0]);
    let status = OvenStatus.EMPTY;
    let checkAt = Number.POSITIVE_INFINITY;
    let allReady = false;
    if (statusText.toLowerCase().includes("cooking")) {
        status = OvenStatus.COOKING;
        checkAt = Date.now() + 60 * 1000;
    }
    else if (statusText.toLowerCase().includes("attention")) {
        status = OvenStatus.ATTENTION;
        checkAt = Date.now() + 60 * 1000;
        // something needs attention, figure out what
        exports.kitchenStatusState.get();
    }
    else if (statusText.toLowerCase().includes("ready")) {
        status = OvenStatus.READY;
        checkAt = Number.POSITIVE_INFINITY;
        allReady = true;
    }
    return { status, count, checkAt, allReady };
};
const processKitchenPage = (root) => {
    const ovens = root.querySelectorAll("a[href^='oven.php']");
    const count = ovens.length;
    let status = OvenStatus.EMPTY;
    let checkAt = Number.POSITIVE_INFINITY;
    let allReady = true;
    for (const oven of ovens) {
        const statusText = oven.querySelector(".item-after span");
        if (!(statusText === null || statusText === void 0 ? void 0 : statusText.dataset.countdownTo)) {
            continue;
        }
        const doneDate = (0, time_1.timestampToDate)(statusText.dataset.countdownTo);
        const now = new Date();
        if (doneDate < now) {
            status = OvenStatus.READY;
            checkAt = Math.min(checkAt, Number.POSITIVE_INFINITY);
            break;
        }
        const tasks = oven.querySelectorAll("img:not(.itemimg)");
        if (tasks.length > 0 &&
            [OvenStatus.EMPTY, OvenStatus.COOKING].includes(status)) {
            status = OvenStatus.ATTENTION;
            if (allReady && tasks.length !== 3) {
                allReady = false;
            }
        }
        else if (status === OvenStatus.EMPTY) {
            status = OvenStatus.COOKING;
        }
        checkAt = Math.min(checkAt, Date.now() + 60 * 1000);
    }
    return {
        allReady,
        checkAt,
        count,
        status,
    };
};
const scheduledUpdates = {};
exports.kitchenStatusState = new state_1.CachedState(state_1.StorageKey.KITHCEN_STATUS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.KITCHEN, new URLSearchParams());
    return processKitchenPage(response.body);
}), {
    timeout: 5,
    defaultState: {
        status: OvenStatus.EMPTY,
        count: 0,
        allReady: false,
        checkAt: Number.POSITIVE_INFINITY,
    },
    interceptors: [
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                const kitchenStatus = root === null || root === void 0 ? void 0 : root.querySelector("a[href='kitchen.php'] .item-after span");
                yield state.set(processKitchenStatus(kitchenStatus || undefined));
            }),
        },
        {
            match: [page_1.Page.KITCHEN, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                yield state.set(processKitchenPage(root.body));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_MEALS }),
            ],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c;
                const root = yield (0, requests_1.getDocument)(response);
                const successCount = (_c = (_b = (_a = root.body.textContent) === null || _a === void 0 ? void 0 : _a.match(/success/g)) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                if (successCount) {
                    (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: `${successCount} meal${successCount === 1 ? "" : "s"} collected`,
                    });
                }
                yield state.set(Object.assign(Object.assign({}, previous), { status: OvenStatus.EMPTY, checkAt: Number.POSITIVE_INFINITY }));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.SEASON_MEALS }),
            ],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c;
                const root = yield (0, requests_1.getDocument)(response);
                const successCount = (_c = (_b = (_a = root.body.textContent) === null || _a === void 0 ? void 0 : _a.match(/success/g)) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                if (successCount) {
                    (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: `${successCount} meal${successCount === 1 ? "" : "s"} collected`,
                    });
                }
                yield state.set(Object.assign(Object.assign({}, previous), { status: OvenStatus.EMPTY, checkAt: Number.POSITIVE_INFINITY }));
                yield state.get();
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.COOK_ALL })],
            callback: (state, previous) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(Object.assign(Object.assign({}, previous), { status: OvenStatus.COOKING, checkAt: Date.now() + 60 * 1000 }));
            }),
        },
    ],
});
const updateStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.kitchenStatusState.get({ doNotFetch: true });
    if (!state) {
        return;
    }
    if (state.checkAt < Date.now()) {
        yield exports.kitchenStatusState.get();
    }
});
// automatically update crops when finished
exports.kitchenStatusState.onUpdate((state) => {
    if (!state) {
        return;
    }
    if (scheduledUpdates[state.checkAt]) {
        return;
    }
    scheduledUpdates[state.checkAt] = setTimeout(updateStatus, state.checkAt - Date.now());
});
const collectAll = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_MEALS }));
});
exports.collectAll = collectAll;


/***/ }),

/***/ 8955:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.collectMailbox = exports.mailboxState = exports.mergeContents = void 0;
const state_1 = __webpack_require__(4782);
const page_1 = __webpack_require__(7952);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const api_1 = __webpack_require__(3413);
const notifications_1 = __webpack_require__(6783);
const popup_1 = __webpack_require__(469);
const mergeContents = (contents) => {
    const results = [];
    for (const { item, count } of contents) {
        const existing = results.find((result) => result.item === item);
        if (existing) {
            existing.count += count;
        }
        else {
            results.push({ item, count });
        }
    }
    return results;
};
exports.mergeContents = mergeContents;
const processPostoffice = (root) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // get contents
    const contents = [];
    const mailboxList = (0, page_1.getListByTitle)(/Your Mailbox/, root.body);
    const itemWrappers = (_a = mailboxList === null || mailboxList === void 0 ? void 0 : mailboxList.querySelectorAll(".collectbtnnc")) !== null && _a !== void 0 ? _a : [];
    for (const itemWrapper of itemWrappers) {
        const from = ((_c = (_b = itemWrapper.querySelector("span")) === null || _b === void 0 ? void 0 : _b.textContent) !== null && _c !== void 0 ? _c : "").replace("From ", "");
        const item = (_e = (_d = itemWrapper.querySelector("strong")) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : "";
        const count = Number((_h = (_g = (_f = itemWrapper
            .querySelector(".item-after")) === null || _f === void 0 ? void 0 : _f.textContent) === null || _g === void 0 ? void 0 : _g.replaceAll(/,|x/g, "")) !== null && _h !== void 0 ? _h : "0");
        contents.push({ from, item, count });
    }
    // get size
    const increaseCard = (0, page_1.getCardByTitle)("Increase Mailbox Size", root.body);
    const size = Number((_k = (_j = increaseCard === null || increaseCard === void 0 ? void 0 : increaseCard.querySelector("strong")) === null || _j === void 0 ? void 0 : _j.textContent) !== null && _k !== void 0 ? _k : "5");
    return { contents, size };
};
exports.mailboxState = new state_1.CachedState(state_1.StorageKey.MAILBOX, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.POST_OFFICE);
    return processPostoffice(response);
}), {
    persist: false,
    defaultState: {
        contents: [],
        size: 5,
    },
    interceptors: [
        {
            match: [page_1.Page.POST_OFFICE, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(processPostoffice(yield (0, requests_1.getDocument)(response)));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_MAIL_ITEMS }),
            ],
            callback: (state, previous) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(Object.assign(Object.assign({}, previous), { contents: [] }));
            }),
        },
    ],
});
const collectMailbox = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.mailboxState.get();
    if (!state) {
        return;
    }
    const mergedItems = (0, exports.mergeContents)(state.contents);
    const items = yield Promise.all(mergedItems.map((mail) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            item: yield api_1.itemDataState.get({ query: mail.item }),
            count: mail.count,
        });
    })));
    (0, notifications_1.removeNotification)(notifications_1.NotificationId.MAILBOX);
    (0, popup_1.showPopup)({
        title: "Collected Mail",
        contentHTML: `
      ${items
            .map((mail) => mail.item
            ? `
              <img
                src="${mail.item.image}"
                style="
                  vertical-align: middle;
                  width: 18px;
                "
              >
              (x${mail.count})
            `
            : ``)
            .join("&nbsp;")}
    `,
    });
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_MAIL_ITEMS }));
});
exports.collectMailbox = collectMailbox;


/***/ }),

/***/ 2022:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mealsStatusState = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
const time_1 = __webpack_require__(4435);
const scheduledUpdates = {};
const processMealStatus = (root) => {
    var _a;
    const mealList = (0, page_1.getListByTitle)(/Time-based Effects/, root);
    if (!mealList) {
        return { meals: [] };
    }
    const meals = [];
    for (const mealWrapper of mealList.children) {
        const mealName = (_a = mealWrapper.querySelector("strong")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!mealName) {
            continue;
        }
        const meal = mealName;
        const countdown = mealWrapper.querySelector("[data-countdown-to]");
        const finishedAt = (countdown === null || countdown === void 0 ? void 0 : countdown.dataset.countdownTo)
            ? (0, time_1.timestampToDate)(countdown.dataset.countdownTo).getTime()
            : Date.now();
        meals.push({ meal, finishedAt });
    }
    return { meals };
};
exports.mealsStatusState = new state_1.CachedState(state_1.StorageKey.MEALS_STATUS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.HOME_PATH);
    return processMealStatus(response.body);
}), {
    defaultState: {
        meals: [],
    },
    interceptors: [
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, requests_1.getDocument)(response);
                yield state.set(processMealStatus(root.body));
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.USE_ITEM })],
            callback: () => __awaiter(void 0, void 0, void 0, function* () {
                // request homepage to trigger meals state update
                yield (0, requests_2.getHTML)(page_1.Page.HOME_PATH);
            }),
        },
    ],
});
const removeFinishedMeals = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const state = yield exports.mealsStatusState.get({ doNotFetch: true });
    yield exports.mealsStatusState.set({
        meals: (_a = state === null || state === void 0 ? void 0 : state.meals.filter((meal) => meal.finishedAt < Date.now())) !== null && _a !== void 0 ? _a : [],
    });
});
// automatically remove meals when finished
exports.mealsStatusState.onUpdate((state) => {
    var _a;
    for (const meal of (_a = state === null || state === void 0 ? void 0 : state.meals) !== null && _a !== void 0 ? _a : []) {
        const { finishedAt } = meal;
        if (scheduledUpdates[finishedAt]) {
            continue;
        }
        scheduledUpdates[finishedAt] = setTimeout(removeFinishedMeals, finishedAt - Date.now());
    }
});


/***/ }),

/***/ 4735:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exportToNotes = exports.setNotes = exports.notesState = exports.encodeData = exports.eraseData = exports.FARMHAND_SUFFIX = exports.FARMHAND_PREFIX = void 0;
const state_1 = __webpack_require__(4782);
const settings_1 = __webpack_require__(126);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
const popup_1 = __webpack_require__(469);
exports.FARMHAND_PREFIX = "\n==== START FARMHAND SETTINGS ====\n";
exports.FARMHAND_SUFFIX = "\n==== END FARMHAND SETTINGS ====";
const eraseData = (notes) => {
    const start = notes.indexOf(exports.FARMHAND_PREFIX);
    const end = notes.indexOf(exports.FARMHAND_SUFFIX);
    if (start === -1 || end === -1) {
        return notes;
    }
    return notes.slice(0, start) + notes.slice(end + exports.FARMHAND_SUFFIX.length);
};
exports.eraseData = eraseData;
const encodeData = () => __awaiter(void 0, void 0, void 0, function* () {
    const exportedSettings = Object.values((0, settings_1.getSettings)());
    for (const setting of exportedSettings) {
        setting.data = yield (0, settings_1.getData)(setting, "");
    }
    return `${exports.FARMHAND_PREFIX}${JSON.stringify(exportedSettings)}${exports.FARMHAND_SUFFIX}`;
});
exports.encodeData = encodeData;
const processHome = (root) => {
    const notesField = root.querySelector(".player_notes");
    if (!notesField) {
        return { notes: "", hasNotes: false };
    }
    const rawNotes = notesField.value;
    const start = rawNotes.indexOf(exports.FARMHAND_PREFIX);
    const end = rawNotes.indexOf(exports.FARMHAND_SUFFIX);
    if (start === -1 || end === -1) {
        console.debug(`[SYNC] No settings found in notes`);
        return { notes: rawNotes, hasNotes: false };
    }
    const settingsString = rawNotes.slice(start + exports.FARMHAND_PREFIX.length, end);
    const settings = JSON.parse(settingsString);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        let hasChanged = false;
        for (const setting of settings) {
            const settingChanged = yield (0, settings_1.setSetting)(setting);
            const dataChanged = yield (0, settings_1.setData)(setting, setting.data);
            if (!hasChanged && (settingChanged || dataChanged)) {
                hasChanged = true;
            }
        }
        console.debug(`[SYNC] Imported settings from notes`, settings);
        if (hasChanged) {
            yield (0, popup_1.showPopup)({
                title: "Farmhand Settings Synced!",
                contentHTML: "Page will reload to apply",
            });
            location.reload();
        }
    }))();
    return { notes: (0, exports.eraseData)(rawNotes), hasNotes: true };
};
exports.notesState = new state_1.CachedState(state_1.StorageKey.NOTES, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.HOME_PATH);
    return processHome(response);
}), {
    interceptors: [
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                state.set(processHome(yield (0, requests_1.getDocument)(response)));
            }),
        },
    ],
    defaultState: {
        notes: "",
        hasNotes: false,
    },
});
const setNotes = (notes) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, requests_2.postData)(page_1.Page.WORKER, {
        content: `${(0, exports.eraseData)(notes)}${yield (0, exports.encodeData)()}`,
    }, new URLSearchParams({ go: page_1.WorkerGo.NOTES }));
});
exports.setNotes = setNotes;
const exportToNotes = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.notesState.get();
    if (!state) {
        console.error("Sync failed");
        return;
    }
    if (!state.hasNotes) {
        console.warn(`[SYNC] Notes disabled or not available, skipping sync`);
        return;
    }
    yield (0, exports.setNotes)(state.notes);
    console.debug(`[SYNC] Exported settings to notes`);
});
exports.exportToNotes = exportToNotes;
(0, settings_1.registerExportToNotes)(exports.exportToNotes);


/***/ }),

/***/ 5543:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activatePerkSet = exports.resetPerks = exports.isActivePerkSet = exports.getCurrentPerkSet = exports.getActivityPerksSet = exports.perksState = exports.PerkActivity = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
var PerkActivity;
(function (PerkActivity) {
    PerkActivity["DEFAULT"] = "Default";
    PerkActivity["CRAFTING"] = "Crafting";
    PerkActivity["FISHING"] = "Fishing";
    PerkActivity["EXPLORING"] = "Exploring";
    PerkActivity["SELLING"] = "Selling";
    PerkActivity["FRIENDSHIP"] = "Friendship";
    PerkActivity["TEMPLE"] = "Temple";
    PerkActivity["LOCKSMITH"] = "Locksmith";
    PerkActivity["WHEEL"] = "Wheel";
    PerkActivity["UNKNOWN"] = "Unknown";
})(PerkActivity || (exports.PerkActivity = PerkActivity = {}));
const processPerks = (root) => {
    var _a, _b;
    const perkSets = [];
    const setList = (0, page_1.getListByTitle)("My Perk Sets", root.body);
    const setWrappers = (_a = setList === null || setList === void 0 ? void 0 : setList.querySelectorAll(".item-title")) !== null && _a !== void 0 ? _a : [];
    let currentPerkSetId;
    for (const setWrapper of setWrappers) {
        const link = setWrapper.querySelector("a");
        const name = (_b = link === null || link === void 0 ? void 0 : link.textContent) !== null && _b !== void 0 ? _b : "";
        const id = Number(link === null || link === void 0 ? void 0 : link.dataset.id);
        const isActive = setWrapper.querySelector(".fa-check");
        if (isActive) {
            currentPerkSetId = id;
        }
        perkSets.push({ name, id });
    }
    return { perkSets, currentPerkSetId };
};
exports.perksState = new state_1.CachedState(state_1.StorageKey.PERKS_SETS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.PERKS);
    return processPerks(response);
}), {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: {
        perkSets: [],
        currentPerkSetId: undefined,
    },
    interceptors: [
        {
            match: [page_1.Page.PERKS, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(processPerks(yield (0, requests_1.getDocument)(response)));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.ACTIVATE_PERK_SET }),
            ],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const [_, query] = (0, requests_2.parseUrl)(response.url);
                yield state.set(Object.assign(Object.assign({}, previous), { currentPerkSetId: Number(query.get("id")) }));
            }),
        },
    ],
});
const getActivityPerksSet = (activity, options) => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.perksState.get(options);
    return state === null || state === void 0 ? void 0 : state.perkSets.find(({ name }) => name === activity);
});
exports.getActivityPerksSet = getActivityPerksSet;
const getCurrentPerkSet = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.perksState.get(options);
    return state === null || state === void 0 ? void 0 : state.perkSets.find(({ id }) => id === (state === null || state === void 0 ? void 0 : state.currentPerkSetId));
});
exports.getCurrentPerkSet = getCurrentPerkSet;
const isActivePerkSet = (set, options) => __awaiter(void 0, void 0, void 0, function* () {
    const current = yield (0, exports.getCurrentPerkSet)(options);
    return Boolean(current && current.id === set.id);
});
exports.isActivePerkSet = isActivePerkSet;
const resetPerks = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const state = yield exports.perksState.get();
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.RESET_PERKS }));
    exports.perksState.set({
        perkSets: (_a = state === null || state === void 0 ? void 0 : state.perkSets) !== null && _a !== void 0 ? _a : [],
        currentPerkSetId: undefined,
    });
});
exports.resetPerks = resetPerks;
const activatePerkSet = (set, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, exports.isActivePerkSet)(set, options)) {
        return;
    }
    console.debug(`Activating ${set.name} Perks`);
    yield (0, exports.resetPerks)();
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({
        go: page_1.WorkerGo.ACTIVATE_PERK_SET,
        id: set.id.toString(),
    }));
});
exports.activatePerkSet = activatePerkSet;


/***/ }),

/***/ 2850:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.collectPets = exports.petState = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(3413);
const mail_1 = __webpack_require__(8955);
const notifications_1 = __webpack_require__(6783);
const popup_1 = __webpack_require__(469);
const processPets = (root) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // get contents
    const contents = [];
    const listTitle = (0, page_1.getTitle)("All Items Found", root.body);
    const list = (_b = (_a = listTitle === null || listTitle === void 0 ? void 0 : listTitle.nextElementSibling) === null || _a === void 0 ? void 0 : _a.nextElementSibling) === null || _b === void 0 ? void 0 : _b.firstElementChild;
    const itemWrappers = (_c = list === null || list === void 0 ? void 0 : list.querySelectorAll("li")) !== null && _c !== void 0 ? _c : [];
    for (const itemWrapper of itemWrappers) {
        const from = ((_e = (_d = itemWrapper.querySelector("span")) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : "").replace("From ", "");
        const item = (_g = (_f = itemWrapper.querySelector("strong")) === null || _f === void 0 ? void 0 : _f.textContent) !== null && _g !== void 0 ? _g : "";
        const count = Number((_k = (_j = (_h = itemWrapper
            .querySelector(".item-after")) === null || _h === void 0 ? void 0 : _h.textContent) === null || _j === void 0 ? void 0 : _j.replaceAll(",", "")) !== null && _k !== void 0 ? _k : "0");
        contents.push({ from, item, count });
    }
    return contents;
};
exports.petState = new state_1.CachedState(state_1.StorageKey.PETS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, requests_2.getHTML)(page_1.Page.PETS);
    return processPets(response);
}), {
    persist: false,
    defaultState: [],
    interceptors: [
        {
            match: [page_1.Page.PETS, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(processPets(yield (0, requests_1.getDocument)(response)));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_PET_ITEMS }),
            ],
            callback: (state) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set([]);
            }),
        },
    ],
});
const collectPets = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.petState.get();
    if (!state) {
        return;
    }
    const mergedItems = (0, mail_1.mergeContents)(state);
    const items = yield Promise.all(mergedItems.map((mail) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            item: yield api_1.itemDataState.get({ query: mail.item }),
            count: mail.count,
        });
    })));
    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PETS);
    (0, popup_1.showPopup)({
        title: "Collected Pet Items",
        contentHTML: `
      ${items
            .map((mail) => mail.item
            ? `
              <img
                src="${mail.item.image}"
                style="
                  vertical-align: middle;
                  width: 18px;
                "
              >
              (x${mail.count})
            `
            : ``)
            .join("&nbsp;")}
    `,
    });
    yield (0, requests_2.getHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_PET_ITEMS }));
});
exports.collectPets = collectPets;


/***/ }),

/***/ 4203:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.playerMailboxState = void 0;
const state_1 = __webpack_require__(4782);
const page_1 = __webpack_require__(7952);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const users_1 = __webpack_require__(5254);
const processMailbox = (root) => {
    var _a, _b, _c;
    const idField = root.querySelector("#mb_to_id");
    const id = idField === null || idField === void 0 ? void 0 : idField.value;
    if (!id) {
        return;
    }
    const profileLink = root.querySelector("a[href^='profile']");
    if (!profileLink) {
        return;
    }
    const [, queryString] = profileLink.href.split("?");
    const linkQuery = new URLSearchParams(queryString);
    const username = linkQuery.get("user_name");
    if (!username) {
        return;
    }
    const cards = root.querySelectorAll(".card");
    let capacity = 5;
    for (const card of cards) {
        // This mailbox has 36 / 1,800 items in it currently.
        const match = (_a = card.textContent) === null || _a === void 0 ? void 0 : _a.match(/This mailbox has [\d,]+ \/ ([\d,]+) items in it currently/);
        if (!match) {
            continue;
        }
        const [_, max] = match;
        capacity = Number(max.replaceAll(",", ""));
        break;
    }
    const lookingFor = (_c = (_b = (0, page_1.getCardByTitle)("Looking For", root.body)) === null || _b === void 0 ? void 0 : _b.textContent) !== null && _c !== void 0 ? _c : "";
    const timestamp = Date.now();
    return {
        id,
        username,
        capacity,
        lookingFor,
        timestamp,
    };
};
exports.playerMailboxState = new state_1.CachedState(state_1.StorageKey.PLAYER_MAILBOXES, (state, userName) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = state.read(userName);
    if (previous) {
        return previous;
    }
    if (!userName) {
        return;
    }
    const user = yield users_1.userState.get({ query: userName });
    if (!user) {
        return;
    }
    const response = yield (0, requests_2.getHTML)(page_1.Page.MAILBOX, new URLSearchParams({ id: user.id }));
    return processMailbox(response);
}), {
    persist: true,
    timeout: 60 * 24 * 7, // 1 week
    interceptors: [
        {
            match: [page_1.Page.MAILBOX, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const mailbox = processMailbox(yield (0, requests_1.getDocument)(response));
                if (!mailbox) {
                    return;
                }
                yield state.set(mailbox, mailbox.username);
            }),
        },
    ],
});


/***/ }),

/***/ 5254:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.userState = void 0;
const state_1 = __webpack_require__(4782);
const page_1 = __webpack_require__(7952);
const requests_1 = __webpack_require__(3813);
const requests_2 = __webpack_require__(3300);
const processProfile = (root) => {
    var _a, _b, _c, _d, _e, _f;
    const id = (_a = root.querySelector(".addfriendbtn")) === null || _a === void 0 ? void 0 : _a.dataset.id;
    if (!id) {
        return;
    }
    const nameLink = root.querySelector(".sharelink");
    if (!nameLink) {
        return;
    }
    const username = nameLink.textContent;
    if (!username) {
        return;
    }
    const colorClass = (_c = (_b = nameLink.parentElement) === null || _b === void 0 ? void 0 : _b.className) !== null && _c !== void 0 ? _c : "";
    const bioCard = (0, page_1.getCardByTitle)("Public Bio", root.body);
    const bio = (_d = bioCard === null || bioCard === void 0 ? void 0 : bioCard.textContent) !== null && _d !== void 0 ? _d : "";
    const image = root.querySelector("#img");
    const emblem = (_f = (_e = image === null || image === void 0 ? void 0 : image.querySelector("img")) === null || _e === void 0 ? void 0 : _e.src) !== null && _f !== void 0 ? _f : "";
    const timestamp = Date.now();
    return {
        id,
        bio,
        username,
        colorClass,
        emblem,
        timestamp,
    };
};
exports.userState = new state_1.CachedState(state_1.StorageKey.PLAYERS, (state, userName) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = state.read(userName);
    if (previous) {
        return previous;
    }
    if (!userName) {
        return;
    }
    const response = yield (0, requests_2.getHTML)(page_1.Page.PROFILE, new URLSearchParams({ user_name: userName.replaceAll(" ", "+") }));
    return yield processProfile(response);
}), {
    persist: true,
    timeout: 60 * 24 * 7, // 1 week
    interceptors: [
        {
            match: [page_1.Page.PROFILE, new URLSearchParams()],
            callback: (state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const user = processProfile(yield (0, requests_1.getDocument)(response));
                if (!user) {
                    return;
                }
                yield state.set(user, user.username);
            }),
        },
    ],
});


/***/ }),

/***/ 3300:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.watchQueries = exports.onFetchResponse = exports.registerQueryInterceptor = exports.queryInterceptors = exports.toUrl = exports.urlMatches = exports.parseUrl = exports.getJSON = exports.postData = exports.getHTML = void 0;
const requests_1 = __webpack_require__(3813);
const getHTML = (page, query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch((0, exports.toUrl)(page, query), {
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    return (0, requests_1.getDocument)(response);
});
exports.getHTML = getHTML;
const postData = (page, data, query) => __awaiter(void 0, void 0, void 0, function* () {
    const body = new URLSearchParams(data).toString();
    const response = yield fetch((0, exports.toUrl)(page, query), {
        method: "POST",
        mode: "cors",
        credentials: "include",
        body,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
    });
    return (0, requests_1.getDocument)(response);
});
exports.postData = postData;
const getJSON = (page, query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch((0, exports.toUrl)(page, query), {
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    (0, exports.onFetchResponse)(response);
    return yield response.json();
});
exports.getJSON = getJSON;
const parseUrl = (url) => {
    // https://farmrpg.com/worker.php?cachebuster=271544&go=getchat&room=giveaways
    const truncatedUrl = url.replace("https://farmrpg.com/", "");
    // worker.php?cachebuster=271544&go=getchat&room=giveaways
    const [pageRaw, queryRaw] = truncatedUrl.split("?");
    const page = pageRaw.replace(".php", "");
    // worker
    const query = new URLSearchParams(queryRaw);
    // cachebuster=271544&go=getchat&room=giveaways
    return [page, query];
};
exports.parseUrl = parseUrl;
const urlMatches = (url, targetPage, targetQuery) => {
    const [page, query] = (0, exports.parseUrl)(url);
    if (page !== targetPage) {
        return false;
    }
    for (const key of targetQuery.keys()) {
        if (query.get(key) !== targetQuery.get(key)) {
            return false;
        }
    }
    return true;
};
exports.urlMatches = urlMatches;
const toUrl = (page, query) => {
    query = query !== null && query !== void 0 ? query : new URLSearchParams();
    query.set("cachebuster", Date.now().toString());
    // don't actually use URLSearchParams.toString() because FarmRPG expects non-encoded "+" chars
    const queryStringSegments = [];
    for (const [key, value] of query.entries()) {
        queryStringSegments.push(`${key}=${value}`);
    }
    return `https://farmrpg.com/${page}.php?${queryStringSegments.join("&")}`;
};
exports.toUrl = toUrl;
exports.queryInterceptors = [];
const registerQueryInterceptor = (interceptor) => {
    exports.queryInterceptors.push(interceptor);
};
exports.registerQueryInterceptor = registerQueryInterceptor;
const onFetchResponse = (response) => __awaiter(void 0, void 0, void 0, function* () {
    // only check farmrpg URLs
    if (!response.url.startsWith("https://farmrpg.com")) {
        return;
    }
    for (const [state, interceptor] of exports.queryInterceptors) {
        if ((0, exports.urlMatches)(response.url, ...interceptor.match)) {
            console.debug(`[STATE] fetch intercepted ${response.url}`, interceptor);
            const previous = yield state.get({ doNotFetch: true });
            interceptor.callback(state, previous, response);
        }
    }
});
exports.onFetchResponse = onFetchResponse;
const watchQueries = () => {
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.readyState !== 4) {
                        return;
                    }
                    // only check farmrpg URLs
                    if (!this.responseURL.startsWith("https://farmrpg.com")) {
                        return;
                    }
                    for (const [state, interceptor] of exports.queryInterceptors) {
                        if ((0, exports.urlMatches)(this.responseURL, ...interceptor.match)) {
                            console.debug(`[STATE] XMLHttpRequest intercepted ${this.responseURL}`, interceptor);
                            const previous = yield state.get({ doNotFetch: true });
                            interceptor.callback(state, previous, {
                                headers: new Headers(),
                                ok: this.status >= 200 && this.status < 300,
                                redirected: false,
                                status: this.status,
                                statusText: this.statusText,
                                type: "default",
                                url: this.responseURL,
                                text: () => Promise.resolve(this.responseText),
                                json: () => Promise.resolve(JSON.parse(this.responseText)),
                                formData: () => Promise.resolve(new FormData()),
                                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                                blob: () => Promise.resolve(new Blob([this.responseText])),
                            });
                        }
                    }
                });
            }, false);
            // eslint-disable-next-line prefer-rest-params
            Reflect.apply(open, this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
    const originalFetch = window.fetch;
    window.fetch = (input, init) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield originalFetch(input, init);
        if (!response.hasBeenIntercepted) {
            response.hasBeenIntercepted = true;
            (0, exports.onFetchResponse)(response.clone());
        }
        return response;
    });
    const originalFetchWorker = fetchWorker;
    fetchWorker = (action, parameters) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield originalFetchWorker(action, parameters);
        if (!response.hasBeenIntercepted) {
            response.hasBeenIntercepted = true;
            (0, exports.onFetchResponse)(response.clone());
        }
        return response;
    });
};
exports.watchQueries = watchQueries;


/***/ }),

/***/ 4435:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.timestampToDate = void 0;
const timestampToDate = (timestamp) => new Date(`${timestamp}-05:00`);
exports.timestampToDate = timestampToDate;


/***/ }),

/***/ 1604:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.latestVersionState = exports.SCRIPT_URL = void 0;
const state_1 = __webpack_require__(4782);
const requests_1 = __webpack_require__(3813);
exports.SCRIPT_URL = "https://greasyfork.org/en/scripts/497660-farm-rpg-farmhand";
exports.latestVersionState = new state_1.CachedState(state_1.StorageKey.LATEST_VERSION, () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield (0, requests_1.corsFetch)(exports.SCRIPT_URL);
    const htmlString = yield response.text();
    const document = new DOMParser().parseFromString(htmlString, "text/html");
    return (((_a = document.querySelector("dd.script-show-version")) === null || _a === void 0 ? void 0 : _a.textContent) || "1.0.0");
}), {
    timeout: 60 * 60 * 6, // 6 hours
    defaultState: "1.0.0",
});


/***/ }),

/***/ 8477:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autocompleteItems = void 0;
const api_1 = __webpack_require__(3413);
const autocomplete_1 = __webpack_require__(4067);
const settings_1 = __webpack_require__(126);
const SETTING_AUTOCOMPLETE_ITEMS = {
    id: settings_1.SettingId.AUTOCOMPLETE_ITEMS,
    title: "Chat: Autocomplete ((items))",
    description: "Auto-complete item names in chat",
    type: "boolean",
    defaultValue: true,
};
exports.autocompleteItems = {
    settings: [SETTING_AUTOCOMPLETE_ITEMS],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.AUTOCOMPLETE_ITEMS]) {
            return;
        }
        (0, autocomplete_1.registerAutocomplete)({
            trigger: /\(\(([^]+)/,
            getItems: api_1.getBasicItems,
            prefix: "((",
            suffix: "))",
            bail: (text) => { var _a, _b; return ((_b = (_a = text.match(/(\(\(|\)\))/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) % 2 === 0; },
        });
    },
};


/***/ }),

/***/ 5881:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autocompleteUsers = void 0;
const autocomplete_1 = __webpack_require__(4067);
const settings_1 = __webpack_require__(126);
const SETTING_AUTOCOMPLETE_USERS = {
    id: settings_1.SettingId.AUTOCOMPLETE_USERS,
    title: "Chat: Autocomplete @Users:",
    description: "Auto-complete usernames in chat",
    type: "boolean",
    defaultValue: true,
};
const getUsers = () => {
    var _a, _b, _c;
    const users = {};
    const messages = document.querySelectorAll(".chat-txt");
    for (const message of messages) {
        const image = (_b = (_a = message.querySelector(".chip-media img")) === null || _a === void 0 ? void 0 : _a.src) !== null && _b !== void 0 ? _b : "";
        const username = (_c = message.querySelector(".chip-label a")) === null || _c === void 0 ? void 0 : _c.textContent;
        if (username && !users[username]) {
            users[username] = { name: username, image };
        }
    }
    return Object.values(users);
};
exports.autocompleteUsers = {
    settings: [SETTING_AUTOCOMPLETE_USERS],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.AUTOCOMPLETE_USERS]) {
            return;
        }
        (0, autocomplete_1.registerAutocomplete)({
            trigger: /@([^]+)/,
            getItems: () => __awaiter(void 0, void 0, void 0, function* () { return yield getUsers(); }),
            prefix: "@",
            suffix: ":",
            bail: (text) => { var _a, _b; return ((_b = (_a = text.match(/(@|:)/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) % 2 === 0; },
        });
    },
};


/***/ }),

/***/ 8092:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.banker = void 0;
const bank_1 = __webpack_require__(4938);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const confirmation_1 = __webpack_require__(3906);
const popup_1 = __webpack_require__(469);
const theme_1 = __webpack_require__(1178);
const SETTING_BANKER = {
    id: settings_1.SettingId.BANKER,
    title: "Bank: Banker",
    description: `
    * Automatically calculates your target balance (minimum balance required to maximize your daily interest)<br>
    * Adds an option *Deposit Target Balance* which deposits up to your target balance<br>
    * Adds an option to *Withdraw Interest* which withdraws any earnings on top of your target balance
  `,
    type: "boolean",
    defaultValue: true,
};
exports.banker = {
    settings: [SETTING_BANKER],
    onPageLoad: (settings, page) => {
        var _a, _b, _c, _d;
        // make sure the banker is enabled
        if (!settings[settings_1.SettingId.BANKER]) {
            return;
        }
        // make sure we are on the bank page
        if (page !== page_1.Page.BANK) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // get parameters
        const aboutCard = (0, page_1.getCardByTitle)("About the bank");
        if (!aboutCard) {
            console.error("About card not found");
            return;
        }
        const parameters = aboutCard.querySelectorAll("strong");
        const interestRate = Number((_a = parameters[0].textContent) === null || _a === void 0 ? void 0 : _a.replaceAll("%", "")) / 100;
        const maxInterest = Number((_b = parameters[1].textContent) === null || _b === void 0 ? void 0 : _b.replaceAll(",", ""));
        const balanceCard = aboutCard.nextElementSibling;
        if (!balanceCard) {
            console.error("balance card not found");
            return;
        }
        const balanceParameters = balanceCard.querySelectorAll("strong");
        const balance = Number((_c = balanceParameters[0].textContent) === null || _c === void 0 ? void 0 : _c.replaceAll(",", "").replaceAll(" Silver", ""));
        const formatter = new Intl.NumberFormat();
        // calculate target balance
        const targetBalance = Math.ceil(maxInterest / interestRate);
        let targetBalanceDiv = document.querySelector(".fh-banker-target-balance");
        if (!targetBalanceDiv) {
            targetBalanceDiv = document.createElement("div");
            targetBalanceDiv.classList.add("card-content-inner");
            targetBalanceDiv.classList.add("fh-banker-target-balance");
            targetBalanceDiv.innerHTML = `
      Target Balance: <strong style="color: ${targetBalance === balance ? theme_1.TEXT_SUCCESS : theme_1.TEXT_WARNING}">${formatter.format(targetBalance)} Silver</strong>
    `;
            (_d = balanceCard.firstElementChild) === null || _d === void 0 ? void 0 : _d.append(targetBalanceDiv);
        }
        const availableInterest = Math.max(0, balance - targetBalance);
        // use title to find the bulk options section
        const bulkOptionsList = (0, page_1.getListByTitle)("Bulk Options");
        if (!bulkOptionsList) {
            console.error("Bulk Options list not found");
            return;
        }
        // deposit target balance button
        let depositTargetLi = document.querySelector(".fh-banker-deposit-target");
        if (!depositTargetLi) {
            const missingFromTarget = Math.max(0, targetBalance - balance);
            depositTargetLi = document.createElement("li");
            depositTargetLi.innerHTML = `
      <a
        href="#"
        data-view=".view-main"
        class="item-link close-panel fh-banker-deposit-target"
      >
        <div class="item-content">
          <div class="item-inner">
            <div class="item-title">
              <i class="fa fa-fw fa-arrow-right"></i>
              Deposit Target Balance
            </div>
            <div class="item-after">${formatter.format(missingFromTarget)} Silver</div>
          </div>
        </div>
      </a>
    `;
            depositTargetLi.addEventListener("click", (event) => {
                event.preventDefault();
                if (missingFromTarget === 0) {
                    return;
                }
                (0, confirmation_1.showConfirmation)(`Deposit ${formatter.format(missingFromTarget)} Silver?`, () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, bank_1.depositSilver)(missingFromTarget);
                    yield (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: "You deposited Silver!",
                    });
                    window.location.reload();
                }));
            });
            bulkOptionsList.insertBefore(depositTargetLi, 
            // eslint-disable-next-line unicorn/prefer-at
            bulkOptionsList.children[bulkOptionsList.children.length - 1]);
        }
        // withdraw interest button
        let withdrawInterestLi = document.querySelector(".fh-banker-withdraw-interest");
        if (!withdrawInterestLi) {
            withdrawInterestLi = document.createElement("li");
            withdrawInterestLi.innerHTML = `
      <a
        href="#"
        data-view=".view-main"
        class="item-link close-panel fh-banker-withdraw-interest"
      >
        <div class="item-content">
          <div class="item-inner">
            <div class="item-title">
              <i class="fa fa-fw fa-arrow-left"></i>
              Withdraw Interest
            </div>
            <div class="item-after">${formatter.format(availableInterest)} Silver</div>
          </div>
        </div>
      </a>
    `;
            withdrawInterestLi.addEventListener("click", (event) => {
                event.preventDefault();
                if (availableInterest === 0) {
                    return;
                }
                (0, confirmation_1.showConfirmation)(`Withdraw ${formatter.format(availableInterest)} Silver?`, () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, bank_1.withdrawSilver)(availableInterest);
                    yield (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: "You withdrew Silver!",
                    });
                    window.location.reload();
                }));
            });
            bulkOptionsList.insertBefore(withdrawInterestLi, 
            // eslint-disable-next-line unicorn/prefer-at
            bulkOptionsList.children[bulkOptionsList.children.length - 1]);
        }
    },
};


/***/ }),

/***/ 2273:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buddyFarm = void 0;
const page_1 = __webpack_require__(7952);
const requests_1 = __webpack_require__(6747);
const settings_1 = __webpack_require__(126);
const SETTING_BUDDY_FARM = {
    id: settings_1.SettingId.BUDDY_FARM,
    title: "Item: Buddy's Almanac",
    description: "Add shortcut to look up items and quests on buddy.farm",
    type: "boolean",
    defaultValue: true,
};
exports.buddyFarm = {
    settings: [SETTING_BUDDY_FARM],
    onPageLoad: (settings, page) => {
        var _a, _b, _c, _d, _e;
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.BUDDY_FARM]) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // handle item pages
        if (page === page_1.Page.ITEM) {
            // find header to get item data
            const itemHeader = document.querySelector(".sharelink");
            if (!itemHeader) {
                console.error("Item header not found");
                return;
            }
            // get name and link for item
            const itemName = (_a = itemHeader.textContent) !== null && _a !== void 0 ? _a : "";
            const itemLink = `https://buddy.farm/i/${(0, requests_1.nameToSlug)(itemName)}`;
            // use title to find item details section
            const titles = currentPage.querySelectorAll(".content-block-title");
            const itemDetailsTitle = [...titles].find((title) => title.textContent === "Item Details");
            const itemDetailsCard = itemDetailsTitle === null || itemDetailsTitle === void 0 ? void 0 : itemDetailsTitle.nextElementSibling;
            const itemDetailsList = itemDetailsCard === null || itemDetailsCard === void 0 ? void 0 : itemDetailsCard.querySelector("ul");
            if (!itemDetailsList) {
                console.error("Item Details list not found");
                return;
            }
            // remove existing link
            (_b = document.querySelector(".fh-buddyshortcut")) === null || _b === void 0 ? void 0 : _b.remove();
            // create a new item detail for buddy.farm link
            const buddyFarmLinkLi = document.createElement("li");
            buddyFarmLinkLi.classList.add("close-panel");
            buddyFarmLinkLi.classList.add("fh-buddyshortcut");
            buddyFarmLinkLi.innerHTML = `
      <div class="item-content">
        <div class="item-media">
          <a
            href="https://buddy.farm"
            onclick="window.open('https://buddy.farm', '_blank');return false;"
          >
            <img src="https://buddy.farm/icons/icon-256x256.png" class="itemimg">
          </a>
        </div>
        <div class="item-inner">
          <div class="item-title">
            Buddy's Almanac
            <br><span style="font-size: 11px">Lookup item on buddy.farm</span>
          </div>
          <div class="item-after">
            <a
              href="${itemLink}"
              onclick="window.open('${itemLink}', '_blank');return false;"
              class="button btngreen"
              style="height:28px"
            >OPEN</a>
          </div>
        </div>
      </div>
    `;
            // insert at top
            itemDetailsList.insertBefore(buddyFarmLinkLi, itemDetailsList.firstChild);
        }
        // handle quest pages
        if (page === page_1.Page.QUEST) {
            // find header to get item data
            const questHeader = currentPage.querySelector(".item-title");
            if (!questHeader) {
                console.error("Quest header not found");
                return;
            }
            // get name and link for item
            const questName = (_c = questHeader.textContent) !== null && _c !== void 0 ? _c : "";
            const questLink = `https://buddy.farm/q/${(0, requests_1.nameToSlug)(questName)}`;
            // find last card to insert
            const card = (_d = (0, page_1.getCardByTitle)("This Help Request is Visible")) !== null && _d !== void 0 ? _d : (0, page_1.getCardByTitle)("This Help Request is Hidden");
            if (!card) {
                console.error("last card not found");
                return;
            }
            // remove existing link
            (_e = document.querySelector(".fh-buddyshortcut")) === null || _e === void 0 ? void 0 : _e.remove();
            // create a new item detail for buddy.farm link
            const buddyFarmLink = document.createElement("div");
            buddyFarmLink.classList.add("list-block");
            buddyFarmLink.classList.add("fh-buddyshortcut");
            buddyFarmLink.innerHTML = `
        <ul>
          <li>
            <div class="item-content">
              <div class="item-media">
                <a
                  href="https://buddy.farm"
                  onclick="window.open('https://buddy.farm', '_blank');return false;"
                >
                  <img src="https://buddy.farm/icons/icon-256x256.png" class="itemimg">
                </a>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  Buddy's Almanac
                  <br><span style="font-size: 11px">Lookup item on buddy.farm</span>
                </div>
                <div class="item-after">
                  <a
                    href="${questLink}"
                    onclick="window.open('${questLink}', '_blank');return false;"
                    class="button btngreen"
                    style="height:28px"
                  >OPEN</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      `;
            // insert at top
            card.insertBefore(buddyFarmLink, card.firstChild);
        }
    },
};


/***/ }),

/***/ 6922:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.chatNav = void 0;
const theme_1 = __webpack_require__(1178);
const openAutocomplete = (dropdown) => {
    const currentLink = document.querySelector(".cclinkselected");
    const links = [
        ...document.querySelectorAll("#desktopchatpanel .cclink"),
    ];
    if (!links || !currentLink) {
        return;
    }
    links.sort((a, b) => { var _a, _b, _c; return (_c = (_a = a.textContent) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b.textContent) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : 0; });
    const menu = document.createElement("div");
    menu.classList.add("fh-chatdropdown-menu");
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.position = "absolute";
    menu.style.top = "100%";
    menu.style.left = "0";
    menu.style.width = "100%";
    menu.style.background = theme_1.BACKGROUND_DARK;
    menu.style.zIndex = "9999";
    for (const link of links) {
        if (link.dataset.channel === currentLink.dataset.channel) {
            continue;
        }
        const option = document.createElement("div");
        option.textContent = link.textContent;
        option.style.cursor = "pointer";
        option.style.padding = "10px";
        option.addEventListener("click", () => {
            link.click();
            closeAutocomplete();
        });
        menu.append(option);
    }
    dropdown.append(menu);
};
const closeAutocomplete = () => {
    var _a;
    (_a = document.querySelector(".fh-chatdropdown-menu")) === null || _a === void 0 ? void 0 : _a.remove();
};
exports.chatNav = {
    onInitialize: () => {
        document.head.insertAdjacentHTML(`beforeend`, `
      <style>
        /* Hide original chat nav */
        .cclink {
          display: none !important;
        }
      <style>
    `);
    },
    onChatLoad: () => {
        const currentLink = document.querySelector(".cclinkselected");
        if (!currentLink) {
            return;
        }
        const dropdowns = [
            ...document.querySelectorAll(".fh-chatdropdown"),
        ];
        // create dropdowns if we haven't
        if (dropdowns.length === 0) {
            for (const title of document.querySelectorAll(".content-block-title.item-input")) {
                title.style.margin = "0";
                title.style.marginTop = "-5px";
                title.style.overflow = "visible";
                title.style.display = "flex";
                const dropdown = document.createElement("div");
                dropdown.classList.add("fh-chatdropdown");
                dropdown.style.cursor = "pointer";
                dropdown.style.textTransform = "titlecase";
                dropdown.style.width = "calc(100% - 44px)";
                dropdown.style.height = "44px";
                dropdown.style.display = "flex";
                dropdown.style.alignContent = "center";
                dropdown.style.justifyContent = "center";
                dropdown.style.flexWrap = "wrap";
                dropdowns.push(dropdown);
                dropdown.addEventListener("click", () => {
                    const menu = document.querySelector(".fh-chatdropdown-menu");
                    if (menu) {
                        closeAutocomplete();
                    }
                    else {
                        openAutocomplete(title);
                    }
                });
                title.append(dropdown);
                const refresh = document.createElement("i");
                refresh.classList.add("fa");
                refresh.classList.add("fw");
                refresh.classList.add("fa-refresh");
                refresh.style.cursor = "pointer";
                refresh.style.width = "44px";
                refresh.style.height = "44px";
                refresh.style.display = "flex";
                refresh.style.alignItems = "center";
                refresh.style.justifyContent = "center";
                refresh.addEventListener("click", () => {
                    var _a;
                    (_a = document.querySelector(".cclinkselected")) === null || _a === void 0 ? void 0 : _a.click();
                });
                title.append(refresh);
            }
        }
        // update dropdown content
        for (const dropdown of dropdowns) {
            if (dropdown.dataset.channel !== currentLink.dataset.channel) {
                dropdown.innerHTML = `
          ${currentLink.textContent}
          <i class="fa fw fa-caret-down" style="margin-left: 5px;"></i>
        `;
                dropdown.dataset.channel = currentLink.dataset.channel;
            }
        }
    },
};


/***/ }),

/***/ 2742:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanupExplore = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_EXPLORE_IMPROVED = {
    id: settings_1.SettingId.EXPLORE_IMPROVED,
    title: "Explore: Improved Layout",
    description: "Larger icons and stable sort",
    type: "boolean",
    defaultValue: true,
};
let maxHeight = 0;
exports.cleanupExplore = {
    settings: [SETTING_EXPLORE_IMPROVED],
    onPageLoad: (settings, page) => {
        if (!page || ![page_1.Page.AREA, page_1.Page.FISHING].includes(page)) {
            return;
        }
        if (!settings[settings_1.SettingId.EXPLORE_IMPROVED]) {
            return;
        }
        // get console
        const console = document.querySelector("#consoletxt");
        if (!console || !console.parentElement) {
            return;
        }
        console.parentElement.style.height = "200px";
        const observer = new MutationObserver(() => {
            const results = console.querySelector("span[style='font-size:11px']");
            if (!results) {
                return;
            }
            const icons = results.querySelectorAll("img");
            if (!icons) {
                return;
            }
            const sortedIcons = [...icons].sort((a, b) => a.src.localeCompare(b.src));
            const improvedLayout = document.createElement("div");
            improvedLayout.style.display = "flex";
            improvedLayout.style.flexWrap = "wrap";
            improvedLayout.style.justifyContent = "center";
            improvedLayout.style.alignItems = "center";
            improvedLayout.style.gap = "10px";
            improvedLayout.style.width = "100%";
            improvedLayout.style.marginTop = "10px";
            improvedLayout.innerHTML = `
      ${sortedIcons
                .map((icon) => {
                var _a, _b;
                return `
            <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
              <img src="${icon.src}" style="${icon.getAttribute("style")};width:36px!important">
              <span style="text-size:13px;">${(_b = (_a = icon.nextSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()}</span>
            </div>
          `;
            })
                .join("")}
    `;
            results.style.display = "none";
            setTimeout(() => {
                maxHeight = Math.max(console.offsetHeight, maxHeight);
                console.style.minHeight = `${maxHeight}px`;
                console.style.display = "block";
            });
            results.after(improvedLayout);
        });
        observer.observe(console, { childList: true });
    },
};


/***/ }),

/***/ 5870:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanupHome = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_HIDE_PLAYERS = {
    id: settings_1.SettingId.HOME_HIDE_PLAYERS,
    title: "Home: Hide players",
    description: "Hide Online, new, find players options",
    type: "boolean",
    defaultValue: false,
};
const SETTING_HIDE_THEME = {
    id: settings_1.SettingId.HOME_HIDE_THEME,
    title: "Home: Hide theme switcher",
    description: "Hide theme switcher on homepage",
    type: "boolean",
    defaultValue: false,
};
const SETTING_HIDE_FOOTER = {
    id: settings_1.SettingId.HOME_HIDE_FOOTER,
    title: "Home: Hide footer",
    description: "Hide footer (Privacy, CoC, T&C, Support) ",
    type: "boolean",
    defaultValue: false,
};
const SETTING_COMPRESS_SKILLS = {
    id: settings_1.SettingId.HOME_COMPRESS_SKILLS,
    title: "Home: Compress Skills",
    description: "Hide Level 99 skills",
    type: "boolean",
    defaultValue: true,
};
exports.cleanupHome = {
    settings: [
        SETTING_HIDE_PLAYERS,
        SETTING_HIDE_THEME,
        SETTING_HIDE_FOOTER,
        SETTING_COMPRESS_SKILLS,
    ],
    onInitialize: (settings) => {
        if (settings[settings_1.SettingId.HOME_HIDE_PLAYERS]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide players card */
            [data-page="${page_1.Page.HOME_PAGE}"] .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title,
            [data-page="${page_1.Page.HOME_PAGE}"] .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title + .card {
              display: none !important;
            }
          <style>
        `);
        }
        if (settings[settings_1.SettingId.HOME_HIDE_THEME]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide theme switcher */
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > p:nth-of-type(1),
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > p:nth-of-type(2) {
              display: none !important;
            }
          <style>
        `);
        }
        if (settings[settings_1.SettingId.HOME_HIDE_FOOTER]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > p:last-of-type,
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > div:last-of-type {
              display: none !important;
            }
          <style>
        `);
        }
    },
    onPageLoad: (settings, page) => {
        var _a, _b;
        if (page !== page_1.Page.HOME_PAGE) {
            return;
        }
        if (!settings[settings_1.SettingId.HOME_COMPRESS_SKILLS]) {
            return;
        }
        // get wrappers
        const skillsCard = (0, page_1.getCardByTitle)(/my skills/i);
        const skillsTitle = skillsCard === null || skillsCard === void 0 ? void 0 : skillsCard.previousElementSibling;
        const skillsCardInner = skillsCard === null || skillsCard === void 0 ? void 0 : skillsCard.querySelector(".card-content-inner");
        if (skillsCard && skillsTitle && skillsCardInner) {
            // new row
            const newRow = document.createElement("div");
            newRow.classList.add("row");
            newRow.style.marginBottom = "0";
            newRow.style.display = "flex";
            newRow.style.justifyContent = "space-around";
            // get all skills
            const skills = skillsCard === null || skillsCard === void 0 ? void 0 : skillsCard.querySelectorAll(".col-33");
            let x99 = 0;
            for (const skill of skills) {
                const progress = skill.querySelector("div");
                if (!progress) {
                    continue;
                }
                if (progress.classList.contains("progressbar-infinite")) {
                    x99++;
                }
                else {
                    newRow.append(skill);
                }
            }
            skillsCardInner.prepend(newRow);
            (_a = newRow.nextElementSibling) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = newRow.nextElementSibling) === null || _b === void 0 ? void 0 : _b.remove();
            skillsTitle.style.textTransform = "none";
            skillsTitle.textContent = `MY SKILLS (${x99}x99)`;
            const shinyBar = document.createElement("div");
            shinyBar.classList.add("progressbar-infinite");
            shinyBar.classList.add("color-multi");
            shinyBar.style.width = "100%";
            skillsTitle.after(shinyBar);
        }
    },
};


/***/ }),

/***/ 4056:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.collapseItemImage = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_COLLAPSE_ITEM = {
    id: settings_1.SettingId.COLLAPSE_ITEM,
    title: "Item: Collapse Item Image",
    description: "Move item image in header to save space",
    type: "boolean",
    defaultValue: false,
};
exports.collapseItemImage = {
    settings: [SETTING_COLLAPSE_ITEM],
    onInitialize: (settings) => {
        if (settings[settings_1.SettingId.COLLAPSE_ITEM]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide item image and description */
            [data-page="item"] #img {
              display: none !important;
            }
            
            /* Hide first section title */
            [data-page="item"] #img + .content-block-title {
              display: none !important;
            }
          </style>
        `);
        }
    },
    onPageLoad: (settings, page) => {
        // make sure we're on the item page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        const itemImage = document.querySelector("#img img");
        if (!itemImage) {
            console.error("Item image not found");
            return;
        }
        // wait for animations
        const sharelink = document.querySelector(".view-main .center .sharelink");
        if (!sharelink) {
            return;
        }
        let smallImage = sharelink.querySelector("img");
        if (!smallImage) {
            smallImage = document.createElement("img");
        }
        sharelink.style.display = "flex";
        sharelink.style.alignItems = "center";
        sharelink.style.gap = "10px";
        smallImage.src = itemImage.src;
        smallImage.style.width = "30px";
        sharelink.prepend(smallImage);
    },
};


/***/ }),

/***/ 8181:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compactSilver = void 0;
const settings_1 = __webpack_require__(126);
const SETTING_COMPACT_SILVER = {
    id: settings_1.SettingId.COMPACT_SILVER,
    title: "Wallet: Compact silver",
    description: "Display compact numbers for silver over 1M",
    type: "boolean",
    defaultValue: true,
};
exports.compactSilver = {
    settings: [SETTING_COMPACT_SILVER],
    onQuestLoad: () => {
        var _a, _b, _c;
        for (const silver of document.querySelectorAll("#statszone span:first-child")) {
            if (!silver || silver.dataset.compactSilver) {
                continue;
            }
            const icon = silver.querySelector("img");
            const amount = Number((_b = (_a = icon === null || icon === void 0 ? void 0 : icon.nextSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().replaceAll(",", ""));
            if (Number.isNaN(amount)) {
                continue;
            }
            if (amount < 1000000) {
                continue;
            }
            (_c = icon === null || icon === void 0 ? void 0 : icon.nextSibling) === null || _c === void 0 ? void 0 : _c.replaceWith(amount > 1000000000
                ? // eslint-disable-next-line no-irregular-whitespace
                    ` ${(amount / 1000000000).toFixed(1)}B  `
                : // eslint-disable-next-line no-irregular-whitespace
                    ` ${(amount / 1000000).toFixed(1)}M  `);
            silver.dataset.compactSilver = "true";
        }
    },
};


/***/ }),

/***/ 223:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compressChat = void 0;
const theme_1 = __webpack_require__(1178);
const settings_1 = __webpack_require__(126);
const SETTING_CHAT_COMPRESS = {
    id: settings_1.SettingId.CHAT_COMPRESS,
    title: "Chat: Compress messages",
    description: "Compress chat messages to make more visible at once",
    type: "boolean",
    defaultValue: true,
};
exports.compressChat = {
    settings: [SETTING_CHAT_COMPRESS],
    onInitialize: (settings) => {
        // move spacing from panel margin to message padding regardless of setting
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .page-content {
            padding-right: 0 !important; 
            margin-right: -2px !important;
          }
          #desktopchatpanel {
            border-color: ${theme_1.BORDER_GRAY};
            border-top: 0 !important;
          }
          #mobilechatpanel .content-block,
          #desktopchatpanel .content-block {
            padding: 0 !important;
          }
          #mobilechatpanel .card,
          #desktopchatpanel .card {
            margin: 0 !important;
          }
          .chat-txt {
            margin: 0 !important;
            padding: 8px !important
          }
        <style>
      `);
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.CHAT_COMPRESS]) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* Reduce chat spacing */
          .chat-txt {
            margin: 0 !important;
            padding: 4px !important
          }

          /* Hide timestamp */
          .chat-txt span:first-of-type,
          .chat-txt br:first-of-type {
            display: none !important;
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 2827:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.navigationStyle = void 0;
const settings_1 = __webpack_require__(126);
const SETTING_NAVIGATION_COMPRESS = {
    id: settings_1.SettingId.NAV_COMPRESS,
    title: "Menu: Reduce Whitespace",
    description: `Reduces whitespace in navigation to make space for more items`,
    type: "boolean",
    defaultValue: false,
};
const SETTING_NAVIGATION_HIDE_LOGO = {
    id: settings_1.SettingId.NAV_HIDE_LOGO,
    title: "Menu: Hide Logo",
    description: `Hides Farm RPG logo in Navigation`,
    type: "boolean",
    defaultValue: true,
};
const SETTING_NAVIGATION_ALIGN_BOTTOM = {
    id: settings_1.SettingId.NAV_ALIGN_BOTTOM,
    title: "Menu: Align to Bottom",
    description: `Aligns Navigation menu to bottom of screen for easier reach on mobile`,
    type: "boolean",
    defaultValue: false,
};
const SETTINGS_NAVIGATION_ADD_MENU = {
    id: settings_1.SettingId.NAV_ADD_MENU,
    title: "Menu: Add Shortcut to Bottom",
    description: `Adds navigation menu shortcut to bottom bar for easier reach on mobile`,
    type: "boolean",
    defaultValue: true,
};
exports.navigationStyle = {
    settings: [
        SETTING_NAVIGATION_COMPRESS,
        SETTING_NAVIGATION_HIDE_LOGO,
        SETTINGS_NAVIGATION_ADD_MENU,
        SETTING_NAVIGATION_ALIGN_BOTTOM,
    ],
    onInitialize: (settings) => {
        var _a;
        // hide buttons until we can replace them
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .icon.icon-bars,
          .refreshbtn .f7-icons {
            display: none !important;
          }
        <style>
      `);
        // align toolbar more consistently
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .toolbar-inner {
            display: flex !important;
            justify-content: end !important;
            padding: 0 !important;
          }

          .toolbar-inner .link {
            display: none !important;
          }

          @media (min-width: 768px) {
            .fh-menu {
              display: none !important;
            }
          }

          .toolbar-inner a {
            height: 100%;
            border: 0;
            background: transparent;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 15px !important;
            border-radius: 0 !important;
          }
        <style>
      `);
        if (settings[settings_1.SettingId.NAV_COMPRESS]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Reduce nav item spacing */
            .panel-left .item-inner {
              padding-top: 4px !important;
              padding-bottom: 4px !important;
            }
            .panel-left .item-content,
            .panel-left .item-inner {
              min-height: 0 !important;
            }
          <style>
        `);
        }
        if (settings[settings_1.SettingId.NAV_HIDE_LOGO]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide nav logo */
            .panel-left .page-content div[align="center"] {
              display: none !important;
            }
            
            /* Hide extra padding */
            .panel-left .page,
            .panel-left .page-content {
              padding-bottom: 0 !important;
            }
          <style>
        `);
        }
        if (settings[settings_1.SettingId.NAV_ALIGN_BOTTOM]) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Align nav down */
            .panel-left .page-content .list-block {
              margin-top: 24px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: end !important;
              height: 100% !important;
            }
          <style>
        `);
        }
        // responsive bottom links
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* responsive bottom links */
          @media (max-width: 420px) {
          .toolbar-inner > .button i {
            margin-right: 50px !important;
          }
          .toolbar-inner > .button {
            display: block !important;
            width: 28px !important;
          }
        <style>
      `);
        if (settings[SETTINGS_NAVIGATION_ADD_MENU.id]) {
            const homeButton = document.querySelector("#homebtn");
            if (!homeButton) {
                console.error("Home button not found");
                return;
            }
            const menuButton = document.createElement("a");
            menuButton.dataset.panel = "left";
            menuButton.classList.add("fh-menu");
            menuButton.classList.add("button");
            menuButton.classList.add("open-panel");
            menuButton.style.fontSize = "12px";
            menuButton.style.paddingLeft = "5px";
            menuButton.style.paddingRight = "8px";
            menuButton.style.display = "flex";
            menuButton.style.alignItems = "center";
            menuButton.style.gap = "2px";
            menuButton.innerHTML = `
        <i class="fa fa-fw fa-bars"></i>
        Menu
      `;
            (_a = homeButton.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(menuButton, homeButton);
        }
    },
    onPageLoad: () => {
        for (const icon of document.querySelectorAll(".icon.icon-bars")) {
            icon.style.color = "white";
            icon.classList.remove("icon");
            icon.classList.remove("icon-bars");
            icon.classList.add("fa");
            icon.classList.add("fw");
            icon.classList.add("fa-bars");
        }
        for (const refresh of document.querySelectorAll(".refreshbtn")) {
            refresh.style.color = "white";
            refresh.classList.remove("fv-icons");
            refresh.textContent = "";
            refresh.classList.add("fa");
            refresh.classList.add("fw");
            refresh.classList.add("fa-refresh");
        }
    },
};


/***/ }),

/***/ 2224:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.customNavigation = void 0;
const theme_1 = __webpack_require__(1178);
const settings_1 = __webpack_require__(126);
const confirmation_1 = __webpack_require__(3906);
const SETTING_CUSTOM_NAVIGATION = {
    id: settings_1.SettingId.NAV_CUSTOM,
    title: "Customize Navigation",
    description: `
    Enables customization of the Navigation menu<br>
    (click the gear in the navigation menu to configure)
  `,
    type: "boolean",
    defaultValue: true,
};
const state = {
    isEditing: false,
};
const DEFAULT_NAVIGATION = [
    { icon: "home", text: "Home", path: "index.php" },
    { icon: "user", text: "My Profile", path: "profile.php" },
    { icon: "list", text: "My Inventory", path: "inventory.php" },
    { icon: "wrench", text: "My Workshop", path: "workshop.php" },
    { icon: "spoon", text: "My Kitchen", path: "kitchen.php" },
    { icon: "inbox", text: "My Mailbox", path: "postoffice.php" },
    { icon: "envelope", text: "My Messages", path: "messages.php" },
    { icon: "users", text: "My Friends", path: "friends.php" },
    { icon: "gear", text: "My Settings", path: "settings.php" },
    { icon: "building", text: "Town", path: "town.php" },
    { icon: "book", text: "Library", path: "wiki.php" },
    { icon: "info-circle", text: "About / Updates", path: "about.php" },
    { icon: "close", text: "Logout", path: "logout.php" },
];
const icons = (() => {
    const stylesheet = [...document.styleSheets].find(({ href }) => href === null || href === void 0 ? void 0 : href.includes("fontawesome"));
    const icons = [];
    if (!stylesheet) {
        console.error("Could not find fontawesome stylesheet");
        return icons;
    }
    for (const rule of stylesheet.cssRules) {
        if (!(rule instanceof CSSStyleRule)) {
            continue;
        }
        if (rule.style.length !== 1) {
            continue;
        }
        if (!rule.style.content) {
            continue;
        }
        const selector = rule.selectorText;
        const aliases = selector.split(", ");
        icons.push(aliases[0].slice(4, -8));
    }
    return icons.sort();
})();
const renderNavigation = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (force = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { items } = yield (0, settings_1.getData)(SETTING_CUSTOM_NAVIGATION, { items: DEFAULT_NAVIGATION });
    const navigationList = document.querySelector(".panel-left ul");
    if (!navigationList) {
        console.error("Could not find navigation list");
        return;
    }
    if (!force && navigationList.dataset.isCustomized) {
        // already rendered
        return;
    }
    const navigationTitleLeft = document.querySelector(".panel-left .navbar .left");
    if (!navigationTitleLeft) {
        console.error("Could not find navigation title");
        return;
    }
    navigationTitleLeft.innerHTML = "";
    if (state.isEditing) {
        const resetButton = document.createElement("i");
        resetButton.style.cursor = "pointer";
        resetButton.classList.add("fa");
        resetButton.classList.add("fa-fw");
        resetButton.classList.add("fa-arrow-left-rotate");
        resetButton.addEventListener("click", () => {
            (0, confirmation_1.showConfirmation)("Reset Navigation?", () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items: DEFAULT_NAVIGATION });
                state.isEditing = false;
                renderNavigation(true);
            }));
        });
        navigationTitleLeft.append(resetButton);
    }
    navigationList.innerHTML = "";
    navigationList.dataset.isCustomized = "true";
    navigationList.dataset.isEditing = String(state.isEditing);
    for (const item of items) {
        const currentIndex = items.indexOf(item);
        const navigationItem = document.createElement("li");
        navigationItem.innerHTML = `
      <a
        href="${item.path}"
        data-view=".view-main"
        class="item-link close-panel"
      >
        <div
          class="item-content"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <div
            class="item-inner"
            style="
              background-image: none;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              width: 100%;
            "
          >
            <div class="item-title">
              <i class="fa fa-fw fa-${item.icon}"></i>
              <span class="fh-item">${item.text}</span>
            </div>
            ${state.isEditing
            ? `
                  <div>
                    <i class="fa fa-fw ${state.editingIndex === currentIndex
                ? "fa-check"
                : "fa-pencil"} fh-edit"></i>
                    <i class="fa fa-fw fa-trash fh-delete"></i>
                  </div>
                `
            : '<i class="fa fa-fw fa-chevron-right"></i>'}
          </div>
          ${state.isEditing && state.editingIndex === currentIndex
            ? `
                <div
                  style="
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-right: 15px;
                  "
                >
                  <input
                    type="text"
                    class="fh-text"
                    value="${item.text}"
                    style="
                      flex: 1;
                      border: 1px solid ${theme_1.BORDER_GRAY};
                      margin-left: 20px;
                      margin-right: 10px;
                      height: 30px;
                      padding: 10px;
                    "
                  >
                  <i class="fa fa-fw fa-arrow-down fh-down"></i>
                  <i class="fa fa-fw fa-arrow-up fh-up"></i>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-right: 15px;
                  "
                >
                  <input
                    type="text"
                    class="fh-path"
                    value="${item.path}"
                    style="
                      flex: 1;
                      border: 1px solid ${theme_1.BORDER_GRAY};
                      margin-left: 20px;
                      height: 30px;
                      padding: 10px;
                      font-family: monospace;
                    "
                  >
                </div>
                <div
                  style="
                    display: flex;
                    gap: 4px;
                    margin-top: 10px;
                    height: 200px;
                    width: 100%;
                    overflow-y: scroll;
                    flex-wrap: wrap;
                  "
                  class="fh-icons"
                >
                  ${icons
                .map((icon) => `
                        <i
                          class="fa fa-fw fa-${icon}"
                          data-icon="${icon}"
                        ></i>
                      `)
                .join("")}
                </div>
              `
            : ""}
        </div>
      </a>
    `;
        (_a = navigationItem
            .querySelector(".fh-icons")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            event.preventDefault();
            event.stopPropagation();
            if (!event.target) {
                return;
            }
            item.icon = (_a = event.target.dataset.icon) !== null && _a !== void 0 ? _a : "";
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            renderNavigation(true);
        }));
        (_b = navigationItem
            .querySelector(".fh-text")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        (_c = navigationItem
            .querySelector(".fh-text")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            item.text = event.target.value;
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            renderNavigation(true);
        }));
        (_d = navigationItem
            .querySelector(".fh-text")) === null || _d === void 0 ? void 0 : _d.addEventListener("keyup", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const itemText = navigationItem.querySelector(".fh-item");
            if (!itemText) {
                return;
            }
            itemText.textContent = event.target.value;
        });
        (_e = navigationItem
            .querySelector(".fh-path")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        (_f = navigationItem
            .querySelector(".fh-path")) === null || _f === void 0 ? void 0 : _f.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            item.path = event.target.value;
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            renderNavigation(true);
        }));
        (_g = navigationItem
            .querySelector(".fh-up")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            if (currentIndex === 0) {
                return;
            }
            items.splice(currentIndex, 1);
            items.splice(currentIndex - 1, 0, item);
            state.editingIndex = currentIndex - 1;
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            renderNavigation(true);
        }));
        (_h = navigationItem
            .querySelector(".fh-down")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            if (currentIndex === items.length - 1) {
                return;
            }
            items.splice(currentIndex, 1);
            items.splice(currentIndex + 1, 0, item);
            state.editingIndex = currentIndex + 1;
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            renderNavigation(true);
        }));
        (_j = navigationItem
            .querySelector(".fh-edit")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (state.editingIndex === currentIndex) {
                delete state.editingIndex;
            }
            else {
                state.editingIndex = currentIndex;
            }
            renderNavigation(true);
        });
        (_k = navigationItem
            .querySelector(".fh-delete")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            items.splice(currentIndex, 1);
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            renderNavigation(true);
        }));
        navigationList.append(navigationItem);
    }
    if (state.isEditing) {
        const addNavigationItem = document.createElement("li");
        addNavigationItem.innerHTML = `
      <a
        href="#"
        class="item-link close-panel"
      >
        <div
          class="item-content"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <div
            class="item-inner"
            style="
              background-image: none;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              width: 100%;
            "
          >
            <div class="item-title">
              <i class="fa fa-fw fa-plus"></i>
              <span class="fh-item">Add Navigation Item</span>
            </div>
          </div>
        </div>
      </a>
    `;
        addNavigationItem.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            items.push({
                icon: "sack-dollar",
                text: "Tip anstosa",
                path: "profile.php?user_name=anstosa",
            });
            yield (0, settings_1.setData)(SETTING_CUSTOM_NAVIGATION, { items });
            state.editingIndex = items.length - 1;
            renderNavigation(true);
        }));
        navigationList.append(addNavigationItem);
    }
});
exports.customNavigation = {
    settings: [SETTING_CUSTOM_NAVIGATION],
    onMenuLoad: (settings) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.NAV_CUSTOM]) {
            return;
        }
        // add configuration icon
        const navigationTitleRight = document.querySelector(".panel-left .navbar .right");
        if (!navigationTitleRight) {
            console.error("Could not find navigation title");
            return;
        }
        if (navigationTitleRight.children.length === 0) {
            const configurationButton = document.createElement("i");
            configurationButton.style.cursor = "pointer";
            configurationButton.classList.add("fa");
            configurationButton.classList.add("fa-fw");
            configurationButton.classList.add("fa-cog");
            configurationButton.addEventListener("click", () => {
                state.isEditing = !state.isEditing;
                if (state.isEditing) {
                    configurationButton.classList.remove("fa-cog");
                    configurationButton.classList.add("fa-check");
                }
                else {
                    configurationButton.classList.remove("fa-check");
                    configurationButton.classList.add("fa-cog");
                }
                renderNavigation(true);
            });
            navigationTitleRight.append(configurationButton);
        }
        renderNavigation();
    },
};


/***/ }),

/***/ 5164:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dismissableChatBanners = void 0;
const settings_1 = __webpack_require__(126);
const popup_1 = __webpack_require__(469);
const state_1 = __webpack_require__(4782);
const SETTING_CHAT_DISMISSABLE_BANNERS = {
    id: settings_1.SettingId.CHAT_DISMISSABLE_BANNERS,
    title: "Chat: Dismissable Banners",
    description: `
    Adds × in chat banners to dismiss them<br>
    Disable this to show dismissed banners again
  `,
    buttonText: "Reset",
    buttonAction: () => __awaiter(void 0, void 0, void 0, function* () {
        const keys = yield GM.listValues();
        for (const key of keys) {
            if (key.startsWith(state_1.StorageKey.CHAT_BANNERS)) {
                yield GM.deleteValue(key);
            }
        }
        yield (0, popup_1.showPopup)({
            title: "Chat banners reset",
            contentHTML: "Previously dismissed chat banners will be shown again",
        });
    }),
    type: "boolean",
    defaultValue: true,
};
// https://stackoverflow.com/a/7616484/714282
const hashBanner = (banner) => {
    var _a, _b;
    const string = (_a = banner.textContent) !== null && _a !== void 0 ? _a : "";
    let hash = 0;
    if (string.length === 0) {
        return hash;
    }
    for (let index = 0; index < string.length; index++) {
        const code = (_b = string.codePointAt(index)) !== null && _b !== void 0 ? _b : 0;
        hash = (hash << 5) - hash + code;
        hash = Math.trunc(hash);
    }
    return hash;
};
exports.dismissableChatBanners = {
    settings: [SETTING_CHAT_DISMISSABLE_BANNERS],
    onChatLoad: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.CHAT_DISMISSABLE_BANNERS]) {
            return;
        }
        const bannerElements = document.querySelectorAll("#desktopchatpanel .card, #mobilechatpanel .card");
        const { hiddenBanners } = yield (0, settings_1.getData)(settings_1.SettingId.CHAT_DISMISSABLE_BANNERS, {
            hiddenBanners: [],
        });
        for (const banner of bannerElements) {
            const bannerKey = hashBanner(banner).toString();
            // hide banner if dismissed
            const isDismissed = (hiddenBanners === null || hiddenBanners === void 0 ? void 0 : hiddenBanners.includes(bannerKey)) || false;
            if (isDismissed) {
                banner.remove();
                continue;
            }
            // skip adding close button if it already exists
            if (banner.querySelector(".fh-close")) {
                continue;
            }
            // add close button
            const closeButton = document.createElement("div");
            closeButton.classList.add("fh-close");
            closeButton.textContent = "×";
            closeButton.style.position = "absolute";
            closeButton.style.top = "2px";
            closeButton.style.right = "2px";
            closeButton.style.cursor = "pointer";
            closeButton.addEventListener("click", () => {
                banner.remove();
                (0, settings_1.setData)(settings_1.SettingId.CHAT_DISMISSABLE_BANNERS, {
                    hiddenBanners: [...hiddenBanners, bannerKey],
                });
            });
            banner.append(closeButton);
        }
    }),
};


/***/ }),

/***/ 6030:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exploreFirst = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_EXPLORE_FIRST = {
    id: settings_1.SettingId.EXPLORE_FIRST,
    title: "Item: Prioritize Explore",
    description: "Move Exploring, Fishing, and Mining above Crafting and Cooking",
    type: "boolean",
    defaultValue: true,
};
const moveSectionUp = (title) => {
    const itemDetailsCard = (0, page_1.getCardByTitle)("Item Details");
    if (!itemDetailsCard) {
        return;
    }
    const titleElement = (0, page_1.getTitle)(title);
    const cardElement = titleElement === null || titleElement === void 0 ? void 0 : titleElement.nextElementSibling;
    const listElement = cardElement === null || cardElement === void 0 ? void 0 : cardElement.nextElementSibling;
    if (listElement) {
        itemDetailsCard.after(listElement);
    }
    if (cardElement) {
        itemDetailsCard.after(cardElement);
    }
    if (titleElement) {
        itemDetailsCard.after(titleElement);
    }
};
exports.exploreFirst = {
    settings: [SETTING_EXPLORE_FIRST],
    onPageLoad: (settings, page) => {
        // make sure we're on the item page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        // make sure we're enabled
        if (!settings[settings_1.SettingId.EXPLORE_FIRST]) {
            return;
        }
        moveSectionUp("Exploring");
        moveSectionUp("Fishing");
        moveSectionUp("Mining");
    },
};


/***/ }),

/***/ 8973:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.farmhandSettings = void 0;
const notes_1 = __webpack_require__(4735);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const popup_1 = __webpack_require__(469);
const getWrapper = ({ id, type, value }, children) => {
    switch (type) {
        case "boolean": {
            return `
        <div
          class="item-inner"
          role="checkbox"
          id="${id}-aria"
          aria-labelledby="${id}"
          aria-checked="${value ? "true" : "false"}"
        >
          ${children}
        </div>
      `;
        }
        case "number": {
            return `
        <div
          class="item-inner"
          role="spinbutton"
          id="${id}-aria"
          aria-labelledby="${id}"
          aria-valuenow="${value}"
        >
          ${children}
        </div>
      `;
        }
        case "string": {
            return `
        <div
          class="item-inner"
          role="textbox"
          id="${id}-aria"
          aria-labelledby="${id}"
        >
          ${children}
        </div>
      `;
        }
        default: {
            return `
        <div
          class="item-inner"
          id="${id}-aria"
          aria-labelledby="${id}"
        >
          ${children}
        </div>
      `;
        }
    }
};
const getField = (setting, children) => {
    var _a;
    switch (setting.type) {
        case "boolean": {
            return `
        <label class="label-switch">
          <input
            type="checkbox"
            class="settings_checkbox"
            id="${setting.id}"
            name="${setting.id}"
            value="${setting.value ? 1 : 0}"
            ${setting.value ? 'checked=""' : ""}"
          >
          <div class="checkbox"></div>
          ${children}
        </label>
      `;
        }
        case "string":
        case "number": {
            return `
        <div class="item-after">
          <input
            type="text"
            name="${setting.id}"
            placeholder="${(_a = setting.placeholder) !== null && _a !== void 0 ? _a : ""}"
            value="${setting.value}"
            class="inlineinputsm fh-input"
            style="
              width: 100px !important;
            "
          >
          ${children}
        </div>
      `;
        }
        default: {
            return "";
        }
    }
};
const getValue = ({ id, type }, currentPage) => {
    const input = currentPage.querySelector(`[name=${id}]`);
    switch (type) {
        case "boolean": {
            const wrapper = currentPage.querySelector(`[id=${id}-aria]`);
            return wrapper.getAttribute("aria-checked") === "true";
        }
        case "number": {
            return Number(input.value);
        }
        case "string": {
            return input.value;
        }
        default: {
            return input.value;
        }
    }
};
const SETTING_EXPORT = {
    id: settings_1.SettingId.EXPORT,
    title: "Settings: Export",
    description: "Exports Farmhand Settings to sync to other device",
    type: "string",
    defaultValue: "",
    buttonText: "Export",
    buttonAction: (settings, settingWrapper) => __awaiter(void 0, void 0, void 0, function* () {
        const exportedSettings = Object.values((0, settings_1.getSettings)());
        for (const setting of exportedSettings) {
            setting.data = yield (0, settings_1.getData)(setting, "");
        }
        const exportString = JSON.stringify(exportedSettings);
        GM.setClipboard(exportString);
        (0, popup_1.showPopup)({
            title: "Settings Exported to clipboard",
            contentHTML: "Open Farm RPG on another device with Farmhand installed to import",
        });
        const input = settingWrapper.querySelector(".fh-input");
        if (input) {
            input.value = exportString;
        }
    }),
};
const SETTING_IMPORT = {
    id: settings_1.SettingId.IMPORT,
    title: "Settings: Import",
    description: "Paste export into box and click Import",
    type: "string",
    defaultValue: "",
    placeholder: "Paste Here",
    buttonText: "Import",
    buttonAction: (settings, settingWrapper) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const input = (_a = settingWrapper.querySelector(".fh-input")) === null || _a === void 0 ? void 0 : _a.value;
        const importedSettings = JSON.parse((_c = (_b = input === null || input === void 0 ? void 0 : input.replace(notes_1.FARMHAND_PREFIX, "")) === null || _b === void 0 ? void 0 : _b.replace(notes_1.FARMHAND_SUFFIX, "")) !== null && _c !== void 0 ? _c : "[]");
        for (const setting of importedSettings) {
            yield (0, settings_1.setSetting)(setting);
            if (setting.data) {
                yield (0, settings_1.setData)(setting, setting.data);
            }
        }
        yield (0, popup_1.showPopup)({
            title: "Farmhand Settings Imported!",
            contentHTML: "Page will reload to apply",
        });
        window.location.reload();
    }),
};
exports.farmhandSettings = {
    settings: [SETTING_EXPORT, SETTING_IMPORT],
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* Allow action buttons next to switches */
        .label-switch {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          width: auto !important; 
        }
      <style>
    `);
    },
    onPageLoad: (settingValues, page) => {
        var _a;
        // make sure we are on the settings page
        if (page !== page_1.Page.SETTINGS_OPTIONS) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // insert at end of first card
        const settingsList = currentPage.querySelector("#settingsform_options ul");
        if (!settingsList) {
            console.error("Settings list not found");
            return;
        }
        // add section
        let farmhandSettingsLi = settingsList.querySelector(".fh-settings-title");
        if (farmhandSettingsLi) {
            // already rendered
            return;
        }
        farmhandSettingsLi = document.createElement("li");
        farmhandSettingsLi.classList.add("list-group-title");
        farmhandSettingsLi.classList.add("item-divider");
        farmhandSettingsLi.classList.add("fh-settings-title");
        farmhandSettingsLi.textContent = "Farmhand Settings";
        settingsList.append(farmhandSettingsLi);
        // add settings
        for (const setting of (0, settings_1.getSettings)()) {
            setting.value = settingValues[setting.id];
            const hasButton = setting.buttonText && setting.buttonAction;
            const settingLi = document.createElement("li");
            settingLi.innerHTML = `
        <div
          class="item-content"
          style="
            display: flex;
            gap: 15px;
            justify-content: space-between;
          "
        >
          ${getWrapper(setting, `
            <div
              class="item-title label"
              style="
                flex: 1;
                white-space: normal;
              "
            >
              <label
                id="${setting.id}"
                for="${setting.id}">
                  ${setting.title}
              </label>
              <br>
              <div style="font-size: 11px">${setting.description}</div>
            </div>
            ${getField(setting, hasButton
                ? `
                  <button
                    class="button btngreen fh-action"
                    style="margin-left: 8px"
                  >${setting.buttonText}</button>
                `
                : "")}
            `)}
      </div>
      `;
            (_a = settingLi
                .querySelector(".fh-action")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
                var _a;
                event.preventDefault();
                event.stopPropagation();
                (_a = setting.buttonAction) === null || _a === void 0 ? void 0 : _a.call(setting, settingValues, settingLi);
            });
            settingsList.append(settingLi);
        }
        // hook into save button
        const saveButton = currentPage.querySelector("#settings_options");
        if (!saveButton) {
            console.error("Save button not found");
            return;
        }
        saveButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            saveButton.textContent = "Saving...";
            yield Promise.all(Object.values((0, settings_1.getSettings)()).map((setting) => {
                setting.value = getValue(setting, currentPage);
                return (0, settings_1.setSetting)(setting);
            }));
            setTimeout(() => window.location.reload(), 1000);
        }));
    },
};


/***/ }),

/***/ 2100:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fishinInBarrel = void 0;
const settings_1 = __webpack_require__(126);
const SETTING_FISH_IN_BARREL = {
    id: settings_1.SettingId.FISH_IN_BARREL,
    title: "Fishing: Barrel Mode",
    description: "Fish always appear in middle of pond",
    type: "boolean",
    defaultValue: true,
};
exports.fishinInBarrel = {
    settings: [SETTING_FISH_IN_BARREL],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.FISH_IN_BARREL]) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* Move fish to middle */
          .fish {
            position: absolute;
            top: calc(50% - 30px);
            left: calc(50% - 30px);
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 9361:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fleaMarket = void 0;
const settings_1 = __webpack_require__(126);
const SETTING_FLEA_MARKET = {
    id: settings_1.SettingId.FLEA_MARKET,
    title: "Flea Market: Disable",
    description: "Flea Market is disabled because it's a waste of gold",
    type: "boolean",
    defaultValue: true,
};
exports.fleaMarket = {
    settings: [SETTING_FLEA_MARKET],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.FLEA_MARKET]) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* Hide Flea Market in Town */
          a[href="flea.php"] {
            display: none;
          }

          /* Hide Flea Market Page */
          .page[page="flea"] {
            display: none;
          }

          /* Hide Flea Market in Inventory */
          .close-panel:has(a[href="flea.php"]) {
            display: none;
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 4894:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fieldNotifications = void 0;
const farm_1 = __webpack_require__(6228);
const notifications_1 = __webpack_require__(6783);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const requests_1 = __webpack_require__(3300);
const SETTING_HARVEST_NOTIFICATIONS = {
    id: settings_1.SettingId.HARVEST_NOTIFICATIONS,
    title: "Farm: Harvest Notifications",
    description: `
    Show notification when crops are ready to harvest
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_HARVEST_POPUP = {
    id: settings_1.SettingId.HARVEST_POPUP,
    title: "Farm: Harvest Popup",
    description: `
    Show popup on Farm page when crops are harvested with the harvest results including bonuses</br>
    (popup is always shown if havesting from other pages via the notification)
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_EMPTY_NOTIFICATIONS = {
    id: settings_1.SettingId.FIELD_EMPTY_NOTIFICATIONS,
    title: "Farm: Empty Notifications",
    description: `
    Show notification when fields are empty
  `,
    type: "boolean",
    defaultValue: true,
};
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.HARVEST, farm_1.harvestAll);
const renderFields = (settings, state) => __awaiter(void 0, void 0, void 0, function* () {
    const farmId = yield farm_1.farmIdState.get();
    if (!state) {
        return;
    }
    if (state.status === farm_1.CropStatus.EMPTY &&
        settings[settings_1.SettingId.FIELD_EMPTY_NOTIFICATIONS]) {
        (0, notifications_1.sendNotification)({
            class: "btnorange",
            id: notifications_1.NotificationId.FIELD,
            text: "Fields are empty!",
            href: (0, requests_1.toUrl)(page_1.Page.FARM, new URLSearchParams({ id: String(farmId) })),
            excludePages: [page_1.Page.FARM],
        });
    }
    else if (state.status === farm_1.CropStatus.READY &&
        settings[settings_1.SettingId.HARVEST_NOTIFICATIONS]) {
        const farmUrl = (0, requests_1.toUrl)(page_1.Page.FARM, new URLSearchParams({ id: String(farmId) }));
        (0, notifications_1.sendNotification)({
            class: "btngreen",
            id: notifications_1.NotificationId.FIELD,
            text: "Crops are ready!",
            href: farmUrl,
            actions: [
                { text: "View", href: farmUrl },
                {
                    text: "Harvest",
                    handler: notifications_1.Handler.HARVEST,
                },
            ],
            excludePages: [page_1.Page.FARM],
        });
    }
    else {
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.FIELD);
    }
});
exports.fieldNotifications = {
    settings: [
        SETTING_HARVEST_NOTIFICATIONS,
        SETTING_HARVEST_POPUP,
        SETTING_EMPTY_NOTIFICATIONS,
    ],
    onInitialize: (settings) => {
        farm_1.farmStatusState.onUpdate((state) => renderFields(settings, state));
    },
};


/***/ }),

/***/ 5454:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.highlightSelfInChat = void 0;
const theme_1 = __webpack_require__(1178);
const settings_1 = __webpack_require__(126);
const apis_1 = __webpack_require__(7046);
const SETTING_CHAT_HIGHLIGHT_SELF = {
    id: settings_1.SettingId.CHAT_HIGHLIGHT_SELF,
    title: "Chat: Highlight self",
    description: "Highlight messages in chat where you are @mentioned",
    type: "boolean",
    defaultValue: true,
};
exports.highlightSelfInChat = {
    settings: [SETTING_CHAT_HIGHLIGHT_SELF],
    onChatLoad: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.CHAT_HIGHLIGHT_SELF]) {
            return;
        }
        const username = yield apis_1.usernameState.get();
        if (!username) {
            console.error("Could not find username");
            return;
        }
        const tags = document.querySelectorAll(`span a[href='profile.php?user_name=${username}']`);
        for (const tag of tags) {
            tag.style.color = theme_1.TEXT_WARNING;
            const message = (_a = tag.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
            if (!message) {
                console.error("Could not find message");
                continue;
            }
            message.style.backgroundColor = theme_1.ALERT_YELLOW_BACKGROUND;
            message.style.border = `1px solid ${theme_1.ALERT_YELLOW_BORDER}`;
        }
    }),
};


/***/ }),

/***/ 1108:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.improvedInputs = void 0;
const theme_1 = __webpack_require__(1178);
const dropdown_1 = __webpack_require__(9946);
const api_1 = __webpack_require__(3413);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_IMPROVED_INPUTS = {
    id: settings_1.SettingId.IMPROVED_INPUTS,
    title: "UI: Improved Inputs",
    description: "Consistent button and field styling and improved item selector UI",
    type: "boolean",
    defaultValue: true,
};
exports.improvedInputs = {
    settings: [SETTING_IMPROVED_INPUTS],
    onInitialize: (settings) => {
        if (!settings[settings_1.SettingId.IMPROVED_INPUTS]) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .newinput,
          .searchbar input[type="search"],
          input[type="number"]:not(#vaultcode),
          input[type="text"]:not(#chat_txt_desktop, #chat_txt_mobile) {
            ${(0, theme_1.toCSS)(theme_1.INPUT_STYLES)}
          }

          .searchbar .searchbar-input {
            height: auto;
          }

          .modal {
            border-radius: 0;
            border: 2px solid #c5c5c5;
            border-bottom: 0;
            overflow: visible;
          }

          .list-block .item-after {
            max-height: initial;
          }

          .pages .button:not([class*=".btn"]),
          .modal-button,
          .button.btngreen,
          .tosswellbtn,
          .cookallbtn {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_GREEN_STYLES)}
          }

          .modal-button {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 -2px;
            height: 44px !important;
            width: calc(100% + 4px) !important;
          }
          
          .modal-button:last-child {
            margin-bottom: -2px;
          }

          select, .inlineinputlg {
            ${(0, theme_1.toCSS)(theme_1.INPUT_STYLES)}
          }
          
          .button.btnred[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_RED_STYLES)} 
          }

          .button.btnorange[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_ORANGE_STYLES)}
          }
          
          .button.btnblue[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_BLUE_STYLES)}
          }

          button[class*="qty"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_GRAY_DARK_STYLES)}
          }
          
          .button.btnpurple[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_PURPLE_STYLES)}
          }

          .button.btngray[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_GRAY_STYLES)}
          }

          .buttons-row .button[class*="btn"] {
            height: inherit !important;
            width: inherit !important;
            flex: 1 !important;
          }
        </style>
      `);
    },
    onPageLoad: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!settings[settings_1.SettingId.IMPROVED_INPUTS]) {
            return;
        }
        (0, dropdown_1.clearDropdown)();
        const selectors = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelectorAll("select");
        for (const selector of selectors !== null && selectors !== void 0 ? selectors : []) {
            const options = yield Promise.all([...selector.options].map((option) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                if (option.dataset.name === "Shovel") {
                    const shovel = yield (0, api_1.getAbridgedItem)("Shovel");
                    return {
                        name: "Dig Up",
                        quantity: Number(option.dataset.amt),
                        icon: (_a = shovel === null || shovel === void 0 ? void 0 : shovel.image) !== null && _a !== void 0 ? _a : "",
                        value: option.value,
                        proxyOption: option,
                    };
                }
                const match = (_b = option.textContent) === null || _b === void 0 ? void 0 : _b.match(/^(.*) \(([\d,]+)\)$/);
                if (!match) {
                    if (option.textContent === "--- select ---" ||
                        option.textContent === "Nothing Selected") {
                        return;
                    }
                    console.error("Failed to parse option", option);
                    return {
                        name: (_c = option.textContent) !== null && _c !== void 0 ? _c : "",
                        value: option.value,
                        proxyOption: option,
                    };
                }
                const [, name, quantity] = match;
                if (!(yield (0, api_1.isItem)(name))) {
                    console.error("Not an item", name);
                    return {
                        name: (_d = option.textContent) !== null && _d !== void 0 ? _d : "",
                        value: option.value,
                        proxyOption: option,
                    };
                }
                const item = yield (0, api_1.getAbridgedItem)(name);
                return {
                    name,
                    quantity: Number(quantity.replaceAll(",", "")),
                    icon: item.image,
                    value: option.value,
                    proxyOption: option,
                };
            })));
            (0, dropdown_1.replaceSelect)(selector, options.filter((option) => option !== undefined));
        }
    }),
};


/***/ }),

/***/ 9737:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kitchenNotifications = void 0;
const kitchen_1 = __webpack_require__(202);
const notifications_1 = __webpack_require__(6783);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const requests_1 = __webpack_require__(3300);
const SETTING_COMPLETE_NOTIFICATIONS = {
    id: settings_1.SettingId.KITCHEN_COMPLETE_NOTIFICATIONS,
    title: "Kitchen: Meals ready notification",
    description: `
    Show notification when meals are ready to collect
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_ATTENTION_NOTIFICATIONS = {
    id: settings_1.SettingId.ATTENTION_NOTIFICATIONS,
    title: "Kitchen: Ovens attention notification",
    description: `
    Show notification when ovens need attention
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_ATTENTION_VERBOSE = {
    id: settings_1.SettingId.ATTENTION_NOTIFICATIONS_VERBOSE,
    title: "Kitchen: Ovens attention notification (all actions)",
    description: `
    Show notifications when any oven needs attention for any action
    (normally only shows when all three actions are available for all ovens)
  `,
    type: "boolean",
    defaultValue: false,
};
const SETTING_EMPTY_NOTIFICATIONS = {
    id: settings_1.SettingId.KITCHEN_EMPTY_NOTIFICATIONS,
    title: "Kitchen: Ovens empty notification",
    description: `
    Show notification when ovens are empty
  `,
    type: "boolean",
    defaultValue: true,
};
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.COLLECT_MEALS, kitchen_1.collectAll);
const renderOvens = (settings, state) => __awaiter(void 0, void 0, void 0, function* () {
    if (!state) {
        return;
    }
    if (state.status === kitchen_1.OvenStatus.EMPTY &&
        settings[settings_1.SettingId.KITCHEN_EMPTY_NOTIFICATIONS]) {
        (0, notifications_1.sendNotification)({
            class: "btnorange",
            id: notifications_1.NotificationId.OVEN,
            text: "Ovens are empty!",
            href: (0, requests_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()),
            excludePages: [page_1.Page.KITCHEN],
        });
    }
    else if (state.status === kitchen_1.OvenStatus.ATTENTION &&
        settings[settings_1.SettingId.ATTENTION_NOTIFICATIONS]) {
        const state = yield kitchen_1.kitchenStatusState.get();
        if (settings[settings_1.SettingId.ATTENTION_NOTIFICATIONS] || (state === null || state === void 0 ? void 0 : state.allReady)) {
            (0, notifications_1.sendNotification)({
                class: "btnorange",
                id: notifications_1.NotificationId.OVEN,
                text: "Ovens need attention",
                href: (0, requests_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()),
                excludePages: [page_1.Page.KITCHEN],
            });
        }
        else {
            (0, notifications_1.removeNotification)(notifications_1.NotificationId.OVEN);
        }
    }
    else if (state.status === kitchen_1.OvenStatus.READY &&
        settings[settings_1.SettingId.KITCHEN_COMPLETE_NOTIFICATIONS]) {
        (0, notifications_1.sendNotification)({
            class: "btngreen",
            id: notifications_1.NotificationId.OVEN,
            text: "Meals are ready!",
            href: (0, requests_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()),
            actions: [
                { text: "View", href: (0, requests_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()) },
                {
                    text: "Collect",
                    handler: notifications_1.Handler.COLLECT_MEALS,
                },
            ],
            excludePages: [page_1.Page.KITCHEN],
        });
    }
    else {
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.OVEN);
    }
});
exports.kitchenNotifications = {
    settings: [
        SETTING_COMPLETE_NOTIFICATIONS,
        SETTING_ATTENTION_NOTIFICATIONS,
        SETTING_ATTENTION_VERBOSE,
        SETTING_EMPTY_NOTIFICATIONS,
    ],
    onInitialize: (settings) => {
        kitchen_1.kitchenStatusState.onUpdate((state) => renderOvens(settings, state));
    },
};


/***/ }),

/***/ 7092:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.linkifyQuickCraft = void 0;
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(3413);
exports.linkifyQuickCraft = {
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure we're on the item page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const missingIngredientsWrapper = currentPage.querySelector("span[style='color:red']");
        if (!missingIngredientsWrapper) {
            return;
        }
        const missingIngredients = (_a = missingIngredientsWrapper.textContent) === null || _a === void 0 ? void 0 : _a.split(", ");
        missingIngredientsWrapper.textContent = "";
        for (const ingredient of missingIngredients !== null && missingIngredients !== void 0 ? missingIngredients : []) {
            const data = yield api_1.itemDataState.get({ query: ingredient });
            if (!data) {
                console.error(`No data for ${ingredient}`);
                continue;
            }
            const link = document.createElement("a");
            link.dataset.view = ".view-main";
            link.href = `item.php?id=${data.id}`;
            link.textContent = ingredient;
            link.style.color = "red";
            link.style.marginRight = "5px";
            link.style.display = "block";
            missingIngredientsWrapper.append(link);
        }
    }),
};


/***/ }),

/***/ 8124:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.chatMailboxStats = void 0;
const theme_1 = __webpack_require__(1178);
const userMailboxes_1 = __webpack_require__(4203);
const settings_1 = __webpack_require__(126);
const users_1 = __webpack_require__(5254);
const SETTING_CHAT_MAILBOX_STATS = {
    id: settings_1.SettingId.CHAT_MAILBOX_STATS,
    title: "Chat: Mailbox Size",
    description: "Show mailbox Size next to usernames in chat",
    type: "boolean",
    defaultValue: true,
};
const openInfoPopup = (userElement) => __awaiter(void 0, void 0, void 0, function* () {
    const formatter = new Intl.NumberFormat();
    closeInfoPopups();
    const username = userElement.textContent;
    if (!username) {
        return;
    }
    userElement.classList.add("fh-mailbox-info-loading");
    const user = yield users_1.userState.get({ query: username });
    const mailbox = yield userMailboxes_1.playerMailboxState.get({ query: username });
    if (userElement.dataset.popup !== "open") {
        userElement.classList.remove("fh-mailbox-info-loading");
        return;
    }
    if (!user || !mailbox) {
        userElement.classList.remove("fh-mailbox-info-loading");
        return;
    }
    const wrapper = userElement.parentElement;
    if (!wrapper) {
        userElement.classList.remove("fh-mailbox-info-loading");
        return;
    }
    wrapper.style.position = "relative";
    const infoPopup = document.createElement("div");
    infoPopup.classList.add("fh-mailbox-info");
    infoPopup.style.display = "flex";
    infoPopup.style.flexDirection = "column";
    infoPopup.style.alignItems = "start";
    infoPopup.style.gap = "5px";
    infoPopup.style.padding = "5px";
    infoPopup.style.position = "absolute";
    infoPopup.style.backgroundColor = theme_1.BACKGROUND_DARK;
    infoPopup.style.borderWidth = "1px";
    infoPopup.style.borderStyle = "solid";
    infoPopup.style.borderColor = theme_1.BORDER_GRAY;
    infoPopup.style.top = "15px";
    infoPopup.style.left = "0px";
    infoPopup.style.zIndex = "9999";
    infoPopup.style.width = "200px";
    infoPopup.style.fontWeight = "normal";
    infoPopup.style.whiteSpace = "normal";
    infoPopup.style.pointerEvents = "none";
    infoPopup.innerHTML = `
    <div><strong>Mailbox:</strong> ${formatter.format(mailbox.capacity)}</div>
    <div><strong>Looking For:</strong> ${mailbox.lookingFor}</div>
    <div><strong>Bio:</strong> ${user.bio}</div>
  `;
    // eslint-disable-next-line require-atomic-updates
    userElement.classList.remove("fh-mailbox-info-loading");
    userElement.after(infoPopup);
});
const closeInfoPopups = () => {
    for (const popup of document.querySelectorAll(".fh-mailbox-info")) {
        popup.remove();
    }
};
exports.chatMailboxStats = {
    settings: [SETTING_CHAT_MAILBOX_STATS],
    onInitialize: (settings) => {
        if (!settings[settings_1.SettingId.CHAT_MAILBOX_STATS]) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .chip-label {
            overflow: visible !important;
          }
          .fh-mailbox-info-loading::before {
            content: "(loading...) ";
            font-size: 10px;
            color: white;
          }
        </style>
      `);
    },
    onChatLoad: (settings) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.CHAT_MAILBOX_STATS]) {
            return;
        }
        const users = document.querySelectorAll(`.chip a[href^='profile.php']`);
        for (const userElement of users) {
            if (userElement === null || userElement === void 0 ? void 0 : userElement.dataset.initialized) {
                continue;
            }
            userElement.addEventListener("mouseover", () => {
                userElement.dataset.popup = "open";
                openInfoPopup(userElement);
            });
            let timer;
            userElement.addEventListener("touchstart", () => {
                userElement.dataset.popup = "open";
                timer = setTimeout(() => {
                    openInfoPopup(userElement);
                    userElement.dataset.ignoreClick = "true";
                }, 500);
            });
            userElement.addEventListener("touchend", () => {
                clearTimeout(timer);
            });
            userElement.addEventListener("mouseout", () => {
                userElement.dataset.popup = "closed";
                closeInfoPopups();
            });
            userElement.addEventListener("click", (event) => {
                if (userElement.dataset.ignoreClick) {
                    event.preventDefault();
                    delete userElement.dataset.ignoreClick;
                }
            });
            userElement.addEventListener("contextmenu", (event) => {
                if (userElement.dataset.ignoreClick) {
                    event.preventDefault();
                    delete userElement.dataset.ignoreClick;
                }
            });
        }
    },
};


/***/ }),

/***/ 6297:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mailboxNotifications = void 0;
const mail_1 = __webpack_require__(8955);
const notifications_1 = __webpack_require__(6783);
const page_1 = __webpack_require__(7952);
const requests_1 = __webpack_require__(3300);
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.COLLECT_MAIL, mail_1.collectMailbox);
const renderNotification = (state) => __awaiter(void 0, void 0, void 0, function* () {
    state = state !== null && state !== void 0 ? state : (yield mail_1.mailboxState.get());
    if (!state) {
        return;
    }
    let mailboxCount = 0;
    for (const mail of state.contents) {
        mailboxCount += mail.count;
    }
    if (!state || state.contents.length === 0) {
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.MAILBOX);
        return;
    }
    (0, notifications_1.sendNotification)({
        class: "btnpurple",
        id: notifications_1.NotificationId.MAILBOX,
        text: `Mailbox is ready! (${mailboxCount} / ${state.size})`,
        href: (0, requests_1.toUrl)(page_1.Page.POST_OFFICE),
        replacesHref: `${page_1.Page.POST_OFFICE}.php`,
        actions: [
            {
                text: "View",
                href: (0, requests_1.toUrl)(page_1.Page.POST_OFFICE),
            },
            {
                text: "Collect",
                handler: notifications_1.Handler.COLLECT_MAIL,
            },
        ],
        excludePages: [page_1.Page.POST_OFFICE],
    });
});
exports.mailboxNotifications = {
    onInitialize: () => {
        mail_1.mailboxState.onUpdate((state) => renderNotification(state));
    },
    onNotificationLoad: () => {
        const mailboxNotification = document.querySelector(`a[href="${page_1.Page.POST_OFFICE}.php"].button.btnpurple`);
        if (mailboxNotification) {
            renderNotification();
        }
    },
};


/***/ }),

/***/ 9735:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxContainers = void 0;
const debounce_1 = __webpack_require__(4276);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_MAX_CONTAINERS = {
    id: settings_1.SettingId.MAX_CONTAINERS,
    title: "Locksmith: Max containers",
    description: "Open max containers by default (instead of 1)",
    type: "boolean",
    defaultValue: true,
};
exports.maxContainers = {
    settings: [SETTING_MAX_CONTAINERS],
    onPageLoad: (settings, page) => {
        if (!settings[settings_1.SettingId.MAX_CONTAINERS]) {
            return;
        }
        if (page !== page_1.Page.LOCKSMITH) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const observer = new MutationObserver((0, debounce_1.debounce)(() => {
            // get inputs
            const inputs = document.querySelectorAll("input.qty[type='number']");
            // if we only have 1 input, we can't be sure whether the user or the app changed it
            if (inputs.length <= 1) {
                return;
            }
            // if any of them are not 1, the app didn't do it
            if ([...inputs].some((input) => ["0", "1"].includes(input.value))) {
                return;
            }
            // get buttons
            const buttons = document.querySelectorAll("button.lsmaxqty");
            for (const button of buttons) {
                button.click();
            }
        }));
        observer.observe(currentPage, { childList: true, subtree: true });
    },
};


/***/ }),

/***/ 1103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxCows = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
exports.maxCows = {
    onPageLoad: (settings, page) => {
        if (page !== page_1.Page.PASTURE) {
            return;
        }
        if (!settings[settings_1.SettingId.MAX_ANIMALS]) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        // max buy cows
        (() => {
            var _a;
            const pigTitle = (0, page_1.getTitle)(/Cows/);
            const match = (_a = pigTitle === null || pigTitle === void 0 ? void 0 : pigTitle.textContent) === null || _a === void 0 ? void 0 : _a.match(/(\d+) \/ (\d+)/);
            if (!match) {
                return;
            }
            const [_, current, max] = match;
            if (!current || !max) {
                return;
            }
            const maxBuy = Number(max) - Number(current);
            const buyField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".addamt");
            if (!buyField) {
                return;
            }
            buyField.value = maxBuy.toString();
        })();
        // max slaughter
        (() => {
            var _a;
            const slaughterSelector = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelid");
            if (!slaughterSelector) {
                return;
            }
            if (slaughterSelector.options.length > 1) {
                slaughterSelector.selectedIndex = 1;
            }
            const match = (_a = slaughterSelector.options[1].textContent) === null || _a === void 0 ? void 0 : _a.match(/\((\d+)\)/);
            if (!match) {
                return;
            }
            const maxSlaughter = Number(match[1]);
            const amountField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelamt");
            if (!amountField) {
                return;
            }
            amountField.value = maxSlaughter.toString();
        })();
    },
};


/***/ }),

/***/ 2934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxPigs = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_MAX_ANIMALS = {
    id: settings_1.SettingId.MAX_ANIMALS,
    title: "Farm: Buy Max Animals",
    description: "Buy max animals by default (instead of 1)",
    type: "boolean",
    defaultValue: true,
};
exports.maxPigs = {
    settings: [SETTING_MAX_ANIMALS],
    onPageLoad: (settings, page) => {
        if (page !== page_1.Page.PIG_PEN) {
            return;
        }
        if (!settings[settings_1.SettingId.MAX_ANIMALS]) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        // max buy pigs
        (() => {
            var _a;
            const pigTitle = (0, page_1.getTitle)(/Pigs/);
            const match = (_a = pigTitle === null || pigTitle === void 0 ? void 0 : pigTitle.textContent) === null || _a === void 0 ? void 0 : _a.match(/(\d+) \/ (\d+)/);
            if (!match) {
                return;
            }
            const [_, current, max] = match;
            if (!current || !max) {
                return;
            }
            const maxBuy = Number(max) - Number(current);
            const buyField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".addamt");
            if (!buyField) {
                return;
            }
            buyField.value = maxBuy.toString();
        })();
        // max slaughter
        (() => {
            var _a;
            const slaughterSelector = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelid");
            if (!slaughterSelector) {
                return;
            }
            if (slaughterSelector.options.length > 1) {
                slaughterSelector.selectedIndex = 1;
            }
            const match = (_a = slaughterSelector.options[1].textContent) === null || _a === void 0 ? void 0 : _a.match(/\((\d+)\)/);
            if (!match) {
                return;
            }
            const maxSlaughter = Number(match[1]);
            const amountField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelamt");
            if (!amountField) {
                return;
            }
            amountField.value = maxSlaughter.toString();
        })();
    },
};


/***/ }),

/***/ 5792:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mealNotifications = void 0;
const meals_1 = __webpack_require__(2022);
const notifications_1 = __webpack_require__(6783);
const settings_1 = __webpack_require__(126);
const SETTING_MEAL_NOTIFICATIONS = {
    id: settings_1.SettingId.MEAL_NOTIFICATIONS,
    title: "Meal Notifications",
    description: `
    Show notification when meals are active with their countdowns
  `,
    type: "boolean",
    defaultValue: true,
};
let mealInterval;
const renderMeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const mealStatus = yield meals_1.mealsStatusState.get();
    if (!mealStatus || mealStatus.meals.length === 0) {
        clearInterval(mealInterval);
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.MEAL);
        return;
    }
    (0, notifications_1.sendNotification)({
        class: "btnorange",
        id: notifications_1.NotificationId.MEAL,
        text: `${mealStatus.meals.length} meal${mealStatus.meals.length === 1 ? "" : "s"} active: ${mealStatus.meals
            .map((active) => {
            const now = new Date();
            const diffSeconds = active.finishedAt / 1000 - now.getTime() / 1000;
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = Math.floor(diffSeconds % 60);
            if (minutes < 0 && seconds < 0) {
                meals_1.mealsStatusState.set({
                    meals: mealStatus.meals.filter((meal) => meal.meal !== active.meal),
                });
                return `${active.meal} (EXPIRED!)`;
            }
            const timeRemaining = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
            return `${active.meal} (${timeRemaining})`;
        })
            .join(", ")}`,
    });
    if (!mealInterval) {
        mealInterval = setInterval(renderMeals, 1 * 1000);
    }
});
exports.mealNotifications = {
    settings: [SETTING_MEAL_NOTIFICATIONS],
    onInitialize: (settings) => {
        if (!settings[settings_1.SettingId.MEAL_NOTIFICATIONS]) {
            return;
        }
        meals_1.mealsStatusState.onUpdate(renderMeals);
    },
};


/***/ }),

/***/ 4414:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.miner = void 0;
const theme_1 = __webpack_require__(1178);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_MINER = {
    id: settings_1.SettingId.MINER,
    title: "Mining: Auto Miner",
    description: "Adds button to take the next suggested action",
    type: "boolean",
    defaultValue: true,
};
const SETTING_MINER_EXPLOSIVES = {
    id: settings_1.SettingId.MINER_EXPLOSIVES,
    title: "Mining: Use Explosives",
    description: "Use explosives as suggested action",
    type: "boolean",
    defaultValue: true,
};
const SETTING_MINER_BOMBS = {
    id: settings_1.SettingId.MINER_BOMBS,
    title: "Mining: Use Bombs",
    description: "Use bombs as suggested action",
    type: "boolean",
    defaultValue: false,
};
const getStatus = (cell) => {
    var _a, _b, _c;
    if (!cell.classList.contains("marked")) {
        return "unexplored";
    }
    const icon = cell.firstElementChild;
    if (!icon) {
        return "unknown";
    }
    if (icon.tagName === "IMG") {
        return "discovered";
    }
    if ((_a = icon.getAttribute("style")) === null || _a === void 0 ? void 0 : _a.includes("color:yellow")) {
        return "miss";
    }
    if ((_b = cell.getAttribute("style")) === null || _b === void 0 ? void 0 : _b.includes("background-color:#cc0000;")) {
        return "trap";
    }
    if ((_c = icon.getAttribute("style")) === null || _c === void 0 ? void 0 : _c.includes("color:black")) {
        return "hit";
    }
    if (icon.classList.contains("fa-pickaxe")) {
        return "extra";
    }
    if (icon.classList.contains("fa-sparkles")) {
        return "xp";
    }
    return "unknown";
};
const getCellAt = (board, x, y) => {
    const rowIndex = y - 1;
    if (rowIndex < 0 || rowIndex >= board.length) {
        return undefined;
    }
    const columnIndex = x - 1;
    if (columnIndex < 0 || columnIndex >= board[rowIndex].length) {
        return undefined;
    }
    return board[rowIndex][columnIndex];
};
const fillHints = (board) => {
    const cells = board.flat();
    // mark candidates
    for (const cell of cells) {
        if (cell.status !== "unexplored") {
            cell.isCandidate = false;
            continue;
        }
        let hasDirection = false;
        const left = getCellAt(board, cell.x - 1, cell.y);
        if (left && ["unexplored", "hit"].includes(left.status)) {
            hasDirection = true;
        }
        const right = getCellAt(board, cell.x + 1, cell.y);
        if (right && ["unexplored", "hit"].includes(right.status)) {
            hasDirection = true;
        }
        const up = getCellAt(board, cell.x, cell.y - 1);
        if (up && ["unexplored", "hit"].includes(up.status)) {
            hasDirection = true;
        }
        const down = getCellAt(board, cell.x, cell.y + 1);
        if (down && ["unexplored", "hit"].includes(down.status)) {
            hasDirection = true;
        }
        cell.isCandidate = hasDirection;
    }
    // count candidate directions
    for (const cell of cells) {
        if (!cell.isCandidate) {
            continue;
        }
        let candidateDirectionCount = 0;
        const left = getCellAt(board, cell.x - 1, cell.y);
        if (left === null || left === void 0 ? void 0 : left.isCandidate) {
            candidateDirectionCount++;
        }
        const right = getCellAt(board, cell.x + 1, cell.y);
        if (right === null || right === void 0 ? void 0 : right.isCandidate) {
            candidateDirectionCount++;
        }
        const up = getCellAt(board, cell.x, cell.y - 1);
        if (up === null || up === void 0 ? void 0 : up.isCandidate) {
            candidateDirectionCount++;
        }
        const down = getCellAt(board, cell.x, cell.y + 1);
        if (down === null || down === void 0 ? void 0 : down.isCandidate) {
            candidateDirectionCount++;
        }
        cell.candidateDirectionCount = candidateDirectionCount;
    }
    // mark next to hits
    for (const cell of cells) {
        if (cell.status !== "hit") {
            continue;
        }
        const left = getCellAt(board, cell.x - 1, cell.y);
        const isLeftCandidate = left && left.isCandidate;
        const isLeftHit = left && left.status === "hit";
        const right = getCellAt(board, cell.x + 1, cell.y);
        const isRightCandidate = right && right.isCandidate;
        const isRightHit = right && right.status === "hit";
        const top = getCellAt(board, cell.x, cell.y - 1);
        const isTopCandidate = top && top.isCandidate;
        const isTopHit = top && top.status === "hit";
        const bottom = getCellAt(board, cell.x, cell.y + 1);
        const isBottomCandidate = bottom && bottom.isCandidate;
        const isBottomHit = bottom && bottom.status === "hit";
        if (left && isLeftCandidate) {
            left.isNextToHit = true;
            if (isRightHit) {
                left.isInlineWithHit = true;
            }
        }
        if (right && isRightCandidate) {
            right.isNextToHit = true;
            if (isLeftHit) {
                right.isInlineWithHit = true;
            }
        }
        if (top && isTopCandidate) {
            top.isNextToHit = true;
            if (isBottomHit) {
                top.isInlineWithHit = true;
            }
        }
        if (bottom && isBottomCandidate) {
            bottom.isNextToHit = true;
            if (isTopHit) {
                bottom.isInlineWithHit = true;
            }
        }
    }
};
const tryCell = (cell) => {
    cell.element.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
};
exports.miner = {
    settings: [SETTING_MINER, SETTING_MINER_EXPLOSIVES, SETTING_MINER_BOMBS],
    onPageLoad: (settings, page) => {
        if (page !== page_1.Page.MINING) {
            return;
        }
        if (!settings[settings_1.SettingId.MINER]) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const magicButton = document.createElement("div");
        magicButton.style.position = "absolute";
        magicButton.style.right = "20px";
        magicButton.style.bottom = "80px";
        magicButton.style.cursor = "pointer";
        magicButton.style.zIndex = "999999";
        magicButton.style.height = "60px";
        magicButton.style.width = "60px";
        magicButton.style.borderRadius = "100%";
        magicButton.style.backgroundColor = theme_1.BUTTON_GREEN_BACKGROUND;
        magicButton.style.borderWidth = "2px";
        magicButton.style.borderColor = theme_1.BUTTON_GREEN_BORDER;
        magicButton.style.borderStyle = "solid";
        magicButton.style.color = theme_1.TEXT_WHITE;
        magicButton.style.display = "flex";
        magicButton.style.justifyContent = "center";
        magicButton.style.alignItems = "center";
        magicButton.innerHTML = `<i class="fa fa-wand-sparkles fa-2x fa-fw" />`;
        magicButton.addEventListener("click", () => {
            var _a, _b, _c;
            // try again if no attempts left
            const tryAgainButton = currentPage.querySelector(".resetlevelbtn");
            const attemptsLeft = Number((_b = (_a = currentPage.querySelector("#attempts")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "1");
            if (attemptsLeft === 0 && tryAgainButton) {
                tryAgainButton.click();
                return;
            }
            // go to next level if available
            const nextLevelButton = currentPage.querySelector(".nextlevelbtn");
            if (nextLevelButton && nextLevelButton.style.display !== "none") {
                nextLevelButton.click();
                return;
            }
            // use explosives if available
            const explosivesButton = currentPage.querySelector(".useexplosivebtn:not(.disabled)");
            if (explosivesButton) {
                explosivesButton.click();
                return;
            }
            // otherwise use pickaxe
            const picks = currentPage.querySelector("#pickaxes");
            if (!picks) {
                return;
            }
            const pickCount = Number(((_c = picks.textContent) === null || _c === void 0 ? void 0 : _c.trim().replaceAll(",", "")) || "0");
            // no picks, make more
            if (!pickCount) {
                picks.click();
            }
            // get boared state
            const board = [];
            const cells = currentPage.querySelectorAll(".checkCell");
            const size = Math.sqrt(cells.length);
            for (let rowIndex = 0; rowIndex < size; rowIndex++) {
                board.push([]);
                for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                    const cell = cells[rowIndex * size + columnIndex];
                    board[rowIndex].push({
                        element: cell,
                        isMarked: cell.classList.contains("marked"),
                        x: Number(cell.dataset.x),
                        y: Number(cell.dataset.y),
                        status: getStatus(cell),
                    });
                }
            }
            // fill in deductions
            fillHints(board);
            // get candidates
            const candidates = board.flat().filter((cell) => cell.isCandidate);
            // get inline with hits first
            const inlineWithHits = candidates.filter((cell) => cell.isInlineWithHit);
            // if there are any, click the first one
            if (inlineWithHits.length > 0) {
                tryCell(inlineWithHits[0]);
                return;
            }
            // get candidates next to hits
            const nextToHits = candidates.filter((cell) => cell.isNextToHit);
            // if there are any, click the first one
            if (nextToHits.length > 0) {
                tryCell(nextToHits[0]);
                return;
            }
            // click the most promising candidate
            const first4DirectionCandidate = candidates.find((cell) => cell.candidateDirectionCount === 4);
            if (first4DirectionCandidate) {
                tryCell(first4DirectionCandidate);
                return;
            }
            const first3DirectionCandidate = candidates.find((cell) => cell.candidateDirectionCount === 3);
            if (first3DirectionCandidate) {
                tryCell(first3DirectionCandidate);
                return;
            }
            const first2DirectionCandidate = candidates.find((cell) => cell.candidateDirectionCount === 2);
            if (first2DirectionCandidate) {
                tryCell(first2DirectionCandidate);
                return;
            }
            // pick a random 1 direction candidate
            tryCell(candidates[Math.floor(Math.random() * candidates.length) || 0]);
        });
        currentPage.append(magicButton);
    },
};


/***/ }),

/***/ 4417:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.moveUpdateToTop = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_UPDATE_AT_TOP = {
    id: settings_1.SettingId.UPDATE_AT_TOP,
    title: "Home: Move updates to top",
    description: `
    Move the most recent update to the top of the home page and make it hidable
  `,
    type: "boolean",
    defaultValue: true,
};
exports.moveUpdateToTop = {
    settings: [SETTING_UPDATE_AT_TOP],
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure we're on the home page
        if (page !== page_1.Page.HOME_PAGE) {
            return;
        }
        // get the recent card and title
        const recentUpdatesCard = (0, page_1.getCardByTitle)("Most Recent Update");
        const recentUpdatesTitle = recentUpdatesCard === null || recentUpdatesCard === void 0 ? void 0 : recentUpdatesCard.previousElementSibling;
        if (!recentUpdatesCard || !recentUpdatesTitle) {
            return;
        }
        // get the latest title
        const latestUpdate = (_a = recentUpdatesCard.querySelector("strong")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!latestUpdate) {
            return;
        }
        // check if it's newer
        const { latestRead } = yield (0, settings_1.getData)(settings_1.SettingId.UPDATE_AT_TOP, {
            latestRead: "",
        });
        if (latestUpdate === latestRead) {
            return;
        }
        // move to top
        const home = (0, page_1.getCurrentPage)();
        if (!home) {
            return;
        }
        const firstTitle = (0, page_1.getTitle)("Where do you want to go?");
        if (!firstTitle) {
            return;
        }
        firstTitle.before(recentUpdatesTitle);
        firstTitle.before(recentUpdatesCard);
        // add hide button
        let hideButton = recentUpdatesTitle.querySelector(".fh-hide-update");
        if (!hideButton) {
            hideButton = document.createElement("a");
            hideButton.classList.add("fh-hide-update");
            hideButton.style.marginLeft = "10px";
            hideButton.style.cursor = "pointer";
            hideButton.textContent = "Hide";
            hideButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                // mark current as read
                yield (0, settings_1.setData)(settings_1.SettingId.UPDATE_AT_TOP, { latestRead: latestUpdate });
                window.location.reload();
            }));
            recentUpdatesTitle.append(hideButton);
        }
    }),
};


/***/ }),

/***/ 682:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.perkManagment = void 0;
const perks_1 = __webpack_require__(5543);
const page_1 = __webpack_require__(7952);
const notifications_1 = __webpack_require__(6783);
const quickSellSafely_1 = __webpack_require__(8760);
const settings_1 = __webpack_require__(126);
const SETTING_PERK_MANAGER = {
    id: settings_1.SettingId.PERK_MANAGER,
    title: "Perks: Auto manage",
    description: `
    1. Save your default perks set as "Default"<br>
    2. Save perks for "Crafting", "Fishing", "Exploring", "Selling", "Friendship", "Temple", "Locksmish", or "Wheel" activities<br>
    3. Activity perk sets will automatically be enabled for those activities and reverted to "Default" after
  `,
    type: "boolean",
    defaultValue: true,
};
const getNotification = (activity) => ({
    class: "btnorange",
    id: notifications_1.NotificationId.PERKS,
    text: `${activity} perks activated`,
});
exports.perkManagment = {
    settings: [SETTING_PERK_MANAGER],
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // make sure the setting is enabled
        if (!settings[settings_1.SettingId.PERK_MANAGER]) {
            return;
        }
        // don't change anything on perks page so you can edit
        if (page === page_1.Page.PERKS) {
            return;
        }
        const defaultPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.DEFAULT);
        // make sure we have a default perk set
        if (!defaultPerks) {
            console.warn("Default perk set not found");
            return;
        }
        const craftingPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.CRAFTING);
        if (craftingPerks && page === page_1.Page.WORKSHOP) {
            yield (0, perks_1.activatePerkSet)(craftingPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.CRAFTING));
            return;
        }
        if (craftingPerks) {
            const quickcraftButton = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".quickcraftbtn");
            if (quickcraftButton && !quickcraftButton.style.display) {
                quickcraftButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "CRAFT";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, perks_1.activatePerkSet)(craftingPerks);
                    (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.CRAFTING));
                    quickcraftButton.click();
                    yield (0, perks_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
                }));
                (_b = quickcraftButton.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(proxyButton, quickcraftButton);
            }
        }
        const fishingPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.FISHING);
        if (fishingPerks && page === page_1.Page.FISHING) {
            yield (0, perks_1.activatePerkSet)(fishingPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.FISHING));
            return;
        }
        const exploringPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.EXPLORING);
        if (exploringPerks && page === page_1.Page.AREA) {
            yield (0, perks_1.activatePerkSet)(exploringPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.EXPLORING));
            return;
        }
        const sellingPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.SELLING);
        if (sellingPerks && page === page_1.Page.FARMERS_MARKET) {
            yield (0, perks_1.activatePerkSet)(sellingPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.SELLING));
            return;
        }
        if (sellingPerks) {
            (0, quickSellSafely_1.onQuicksellClick)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, perks_1.activatePerkSet)(sellingPerks);
                (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.SELLING));
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, perks_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
                }), 1000);
                return true;
            }));
        }
        const friendshipPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.FRIENDSHIP);
        if (friendshipPerks &&
            (page === page_1.Page.FRIENDSHIP || page === page_1.Page.MAILBOX)) {
            yield (0, perks_1.activatePerkSet)(friendshipPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.FRIENDSHIP));
            return;
        }
        if (friendshipPerks) {
            const quickgiveButton = (_c = (0, page_1.getCurrentPage)()) === null || _c === void 0 ? void 0 : _c.querySelector(".quickgivebtn");
            if (quickgiveButton && !quickgiveButton.style.display) {
                quickgiveButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "GIVE";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, perks_1.activatePerkSet)(friendshipPerks);
                    (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.FRIENDSHIP));
                    quickgiveButton.click();
                    yield (0, perks_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
                }));
                (_d = quickgiveButton.parentElement) === null || _d === void 0 ? void 0 : _d.insertBefore(proxyButton, quickgiveButton);
            }
        }
        const templePerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.TEMPLE);
        if (templePerks && page === page_1.Page.TEMPLE) {
            yield (0, perks_1.activatePerkSet)(templePerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.TEMPLE));
            return;
        }
        const locksmithPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.LOCKSMITH);
        if (locksmithPerks && page === page_1.Page.LOCKSMITH) {
            yield (0, perks_1.activatePerkSet)(locksmithPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.LOCKSMITH));
            return;
        }
        const wheelPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.WHEEL);
        if (wheelPerks && page === page_1.Page.WHEEL) {
            yield (0, perks_1.activatePerkSet)(wheelPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.WHEEL));
            return;
        }
        (0, perks_1.activatePerkSet)(defaultPerks);
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
    }),
};


/***/ }),

/***/ 8278:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.petNotifications = void 0;
const pets_1 = __webpack_require__(2850);
const notifications_1 = __webpack_require__(6783);
const page_1 = __webpack_require__(7952);
const requests_1 = __webpack_require__(3300);
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.COLLECT_PETS, pets_1.collectPets);
const renderNotification = (state) => __awaiter(void 0, void 0, void 0, function* () {
    state = state !== null && state !== void 0 ? state : (yield pets_1.petState.get());
    if (!state) {
        return;
    }
    let petCount = 0;
    for (const mail of state) {
        petCount += mail.count;
    }
    if (!state || (state === null || state === void 0 ? void 0 : state.length) === 0) {
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.PETS);
        return;
    }
    (0, notifications_1.sendNotification)({
        class: "btnorange",
        id: notifications_1.NotificationId.PETS,
        text: `Your pets have ${petCount} items ready!`,
        href: (0, requests_1.toUrl)(page_1.Page.PETS),
        replacesHref: `${page_1.Page.PETS}.php?${new URLSearchParams({
            from: "home",
        }).toString()}`,
        actions: [
            {
                text: "View",
                href: (0, requests_1.toUrl)(page_1.Page.PETS),
            },
            {
                text: "Collect",
                handler: notifications_1.Handler.COLLECT_PETS,
            },
        ],
        excludePages: [page_1.Page.PETS],
    });
});
exports.petNotifications = {
    onInitialize: () => {
        pets_1.petState.onUpdate((state) => renderNotification(state));
    },
    onNotificationLoad: () => {
        const petsNotification = document.querySelector(`a[href="${page_1.Page.PETS}.php?from=home"]`);
        if (petsNotification) {
            renderNotification();
        }
    },
};


/***/ }),

/***/ 1768:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.questCollapse = void 0;
const settings_1 = __webpack_require__(126);
const page_1 = __webpack_require__(7952);
const SETTING_QUEST_COLLAPSE = {
    id: settings_1.SettingId.QUEST_COLLAPSE,
    title: "Quest: Global collapse status",
    description: "Remember the quest details collapse status globally instead of per-quest",
    type: "boolean",
    defaultValue: true,
};
exports.questCollapse = {
    settings: [SETTING_QUEST_COLLAPSE],
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.QUEST_COLLAPSE]) {
            return;
        }
        // make sure we're on a quest page
        if (page !== page_1.Page.QUEST) {
            return;
        }
        // find accordion item
        const accordion = document.querySelector(".accordion-helprequest");
        if (!accordion) {
            console.error("Item header not found");
            return;
        }
        const isCollapsed = !accordion.classList.contains("accordion-item-expanded");
        const link = accordion.querySelector("a");
        if (!link) {
            return;
        }
        const questCollapse = yield (0, settings_1.getData)(settings_1.SettingId.QUEST_COLLAPSE, {
            questCollapse: true,
        });
        link.addEventListener("click", () => {
            setTimeout(() => {
                (0, settings_1.setData)(settings_1.SettingId.QUEST_COLLAPSE, {
                    questCollapse: !accordion.classList.contains("accordion-item-expanded"),
                });
            }, 500);
        });
        if (isCollapsed && !questCollapse) {
            accordion.classList.add("accordion-item-expanded");
        }
        if (!isCollapsed && questCollapse) {
            accordion.classList.remove("accordion-item-expanded");
        }
    }),
};


/***/ }),

/***/ 9524:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.questTagging = void 0;
const settings_1 = __webpack_require__(126);
const page_1 = __webpack_require__(7952);
const theme_1 = __webpack_require__(1178);
const SETTING_QUEST_TAGGING = {
    id: settings_1.SettingId.QUEST_TAGGING,
    title: "Quest: Tagging",
    description: `Mark requests as high or low priority`,
    type: "boolean",
    defaultValue: true,
};
const renderQuests = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { starred, low } = yield (0, settings_1.getData)(SETTING_QUEST_TAGGING, { starred: [], low: [] });
    const list = (0, page_1.getListByTitle)(/Active Requests/);
    if (!list) {
        return;
    }
    const quests = [];
    for (const element of list.querySelectorAll("li")) {
        const id = (_b = (_a = element
            .querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) === null || _b === void 0 ? void 0 : _b.split("?id=")[1];
        if (!id) {
            continue;
        }
        const title = ((_c = element.querySelector(".item-title strong")) === null || _c === void 0 ? void 0 : _c.textContent) || "";
        const isLow = low.includes(id);
        const isStarred = starred.includes(id);
        quests.push({ element, id, isLow, isStarred, title });
        const progress = element.querySelector(".progressbar span");
        if (progress) {
            progress.style.backgroundColor = isStarred ? "gold" : "#007aff";
        }
        (_d = element.querySelector(".item-media")) === null || _d === void 0 ? void 0 : _d.setAttribute("style", `
        opacity: ${isLow ? 0.65 : 1};
        filter: grayscale(${isLow ? 100 : 0}%)
      `);
        (_e = element.querySelector(".item-inner")) === null || _e === void 0 ? void 0 : _e.setAttribute("style", `
        opacity: ${isLow ? 0.65 : 1};
        filter: grayscale(${isLow ? 100 : 0}%)
      `);
        element.remove();
        (_f = element.querySelector(".fh-quest-buttons")) === null || _f === void 0 ? void 0 : _f.remove();
        const buttons = document.createElement("div");
        buttons.className = "fh-quest-buttons";
        buttons.style.height = "45px";
        buttons.style.display = "flex";
        buttons.style.flexDirection = "column";
        buttons.style.alignItems = "center";
        buttons.style.justifyContent = "space-between";
        buttons.style.marginRight = "15px";
        const starButton = document.createElement("i");
        starButton.className = "fas fa-fw fa-star";
        starButton.style.color = isStarred ? "gold" : theme_1.TEXT_GRAY;
        starButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            if (starred.includes(id)) {
                starred.splice(starred.indexOf(id), 1);
            }
            else {
                starred.push(id);
            }
            yield (0, settings_1.setData)(SETTING_QUEST_TAGGING, { starred, low });
            renderQuests();
        }));
        const lowButton = document.createElement("i");
        lowButton.className = "fas fa-fw fa-chevron-down";
        lowButton.style.color = isLow ? "#007aff" : theme_1.TEXT_GRAY;
        lowButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            if (low.includes(id)) {
                low.splice(low.indexOf(id), 1);
            }
            else {
                low.push(id);
            }
            yield (0, settings_1.setData)(SETTING_QUEST_TAGGING, { starred, low });
            renderQuests();
        }));
        buttons.append(starButton);
        buttons.append(lowButton);
        (_g = element.querySelector(".item-content")) === null || _g === void 0 ? void 0 : _g.prepend(buttons);
    }
    quests.sort((a, b) => {
        if (a.isStarred && !b.isStarred) {
            return -1;
        }
        if (!a.isStarred && b.isStarred) {
            return 1;
        }
        if (a.isLow && !b.isLow) {
            return 1;
        }
        if (!a.isLow && b.isLow) {
            return -1;
        }
        return a.title.localeCompare(b.title);
    });
    for (const quest of quests) {
        list.append(quest.element);
    }
});
exports.questTagging = {
    settings: [SETTING_QUEST_TAGGING],
    onPageLoad: (settings, page) => {
        // make sure setting is enabled
        if (!settings[settings_1.SettingId.QUEST_TAGGING]) {
            return;
        }
        // make sure we're on the quests page
        if (page !== page_1.Page.QUESTS) {
            return;
        }
        // load quests
        renderQuests();
    },
};


/***/ }),

/***/ 3710:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.quests = void 0;
const theme_1 = __webpack_require__(1178);
exports.quests = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* make room for minimize button */
        #statszone > div {
          padding-right: 15px !important;
        }
        /* make line prettier */
        #statszone hr {
          height: 1px;
          background-color: ${theme_1.BORDER_GRAY};
          border: none;
        }
      <style>
    `);
    },
    onQuestLoad: () => {
        var _a;
        const popup = document.querySelector(".aqp");
        if (!popup) {
            return;
        }
        popup.dataset.isMinimized = (_a = popup.dataset.isMinimized) !== null && _a !== void 0 ? _a : "false";
        // skip adding close button if it already exists
        if (popup.querySelector(".fh-minimize")) {
            return;
        }
        const minimizeButton = document.createElement("i");
        minimizeButton.classList.add("fh-minimize");
        minimizeButton.classList.add("fa");
        minimizeButton.classList.add("fw");
        minimizeButton.classList.add("fa-chevron-down");
        minimizeButton.style.position = "absolute";
        minimizeButton.style.top = "10px";
        minimizeButton.style.right = "10px";
        minimizeButton.style.cursor = "pointer";
        minimizeButton.addEventListener("click", () => {
            if (popup.dataset.isMinimized === "true") {
                minimizeButton.classList.remove("fa-chevron-up");
                minimizeButton.classList.add("fa-chevron-down");
                popup.style.top = "auto";
                popup.dataset.isMinimized = "false";
            }
            else {
                minimizeButton.classList.remove("fa-chevron-down");
                minimizeButton.classList.add("fa-chevron-up");
                popup.style.top = "70px";
                popup.dataset.isMinimized = "true";
            }
        });
        popup.append(minimizeButton);
    },
};


/***/ }),

/***/ 8760:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.quicksellSafely = exports.onQuicksellClick = void 0;
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_QUICKSELL_SAFELY = {
    id: settings_1.SettingId.QUICKSELL_SAFELY,
    title: "Item: Safe Quick Sell",
    description: "If item is locked, also lock the Quick Sell and Quick Give buttons",
    type: "boolean",
    defaultValue: true,
};
const state = {
    onQuicksellClick: [],
};
const onQuicksellClick = (callback) => {
    state.onQuicksellClick.push(callback);
};
exports.onQuicksellClick = onQuicksellClick;
exports.quicksellSafely = {
    settings: [SETTING_QUICKSELL_SAFELY],
    onPageLoad: (settings, page) => {
        var _a, _b, _c, _d, _e, _f;
        // make sure we're on the right page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        const isSafetyOn = settings[settings_1.SettingId.QUICKSELL_SAFELY];
        const lockButton = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".lockbtn");
        const unlockButton = (_b = (0, page_1.getCurrentPage)()) === null || _b === void 0 ? void 0 : _b.querySelector(".unlockbtn");
        const isLocked = unlockButton && !lockButton;
        const quicksellButton = (_c = (0, page_1.getCurrentPage)()) === null || _c === void 0 ? void 0 : _c.querySelector(".quicksellbtn, .quicksellbtnnc");
        if (quicksellButton && !quicksellButton.style.display) {
            quicksellButton.style.display = "none";
            const proxyButton = document.createElement("button");
            proxyButton.classList.add("button");
            proxyButton.classList.add(isSafetyOn && isLocked ? "btnred" : "btngreen");
            proxyButton.style.height = "28px;";
            if (!isSafetyOn || !isLocked) {
                proxyButton.textContent = "SELL";
            }
            if (isSafetyOn && isLocked) {
                const lock = document.createElement("i");
                lock.classList.add("f7-icons");
                lock.style.fontSize = "17px";
                lock.textContent = "unlock_fill";
                proxyButton.append(lock);
            }
            proxyButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                if (isSafetyOn && isLocked) {
                    unlockButton.click();
                    return;
                }
                for (const callback of state.onQuicksellClick) {
                    if (!(yield callback(event))) {
                        return;
                    }
                }
                quicksellButton.click();
            }));
            (_d = quicksellButton.parentElement) === null || _d === void 0 ? void 0 : _d.insertBefore(proxyButton, quicksellButton);
        }
        const quickgiveButton = (_e = (0, page_1.getCurrentPage)()) === null || _e === void 0 ? void 0 : _e.querySelector(".quickgivebtn");
        if (quickgiveButton && !quickgiveButton.style.display) {
            quickgiveButton.style.display = "none";
            const proxyButton = document.createElement("button");
            proxyButton.classList.add("button");
            proxyButton.classList.add(isSafetyOn && isLocked ? "btnred" : "btngreen");
            proxyButton.style.height = "28px;";
            if (!isSafetyOn || !isLocked) {
                proxyButton.textContent = "GIVE";
            }
            if (isSafetyOn && isLocked) {
                const lock = document.createElement("i");
                lock.classList.add("f7-icons");
                lock.style.fontSize = "17px";
                lock.textContent = "unlock_fill";
                proxyButton.append(lock);
            }
            proxyButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                if (isSafetyOn && isLocked) {
                    unlockButton.click();
                    return;
                }
                for (const callback of state.onQuicksellClick) {
                    if (!(yield callback(event))) {
                        return;
                    }
                }
                quickgiveButton.click();
            }));
            (_f = quickgiveButton.parentElement) === null || _f === void 0 ? void 0 : _f.insertBefore(proxyButton, quickgiveButton);
        }
    },
};


/***/ }),

/***/ 3026:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.vaultSolver = void 0;
const vault_1 = __webpack_require__(2279);
const theme_1 = __webpack_require__(1178);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const SETTING_VAULT_SOLVER = {
    id: settings_1.SettingId.VAULT_SOLVER,
    title: "Vault: Auto Solver",
    description: "Auto-fill solution suggestions in the vault input box",
    type: "boolean",
    defaultValue: true,
};
const generateButton = (digit, currentCode, info) => {
    const digitInfo = info.find((d) => d.digit === digit);
    const currentPosition = currentCode.length;
    let buttonStyles = theme_1.BUTTON_VAULT_GRAY_STYLES;
    if (currentPosition > 4) {
        buttonStyles = theme_1.BUTTON_GRAY_STYLES;
    }
    else if (digitInfo === null || digitInfo === void 0 ? void 0 : digitInfo.correctPositions.includes(currentPosition)) {
        buttonStyles = theme_1.BUTTON_VAULT_BLUE_STYLES;
    }
    else if (digitInfo === null || digitInfo === void 0 ? void 0 : digitInfo.possiblePositions.includes(currentPosition)) {
        buttonStyles = theme_1.BUTTON_VAULT_YELLOW_STYLES;
    }
    return `
    <button
      data-input="${digit}"
      style="${(0, theme_1.toCSS)(buttonStyles)};"
    >${digit}</button>
  `;
};
const renderKeyboard = (input, info) => {
    var _a, _b;
    if (!input) {
        return;
    }
    (_a = document.querySelector(".fh-vault-keyboard")) === null || _a === void 0 ? void 0 : _a.remove();
    const submitButton = document.querySelector(".vcbtn");
    if (!submitButton) {
        return;
    }
    const keyboard = document.createElement("div");
    keyboard.classList.add("fh-vault-keyboard");
    keyboard.style.display = "grid";
    keyboard.style.gridTemplateColumns = "repeat(3, 1fr)";
    keyboard.style.gap = "15px";
    keyboard.style.padding = "15px";
    keyboard.innerHTML = `
    ${generateButton(1, input.value, info)}
    ${generateButton(2, input.value, info)}
    ${generateButton(3, input.value, info)}
    ${generateButton(4, input.value, info)}
    ${generateButton(5, input.value, info)}
    ${generateButton(6, input.value, info)}
    ${generateButton(7, input.value, info)}
    ${generateButton(8, input.value, info)}
    ${generateButton(9, input.value, info)}
    <button data-input="backspace" style="${(0, theme_1.toCSS)(input.value.length === 0 ? theme_1.BUTTON_GRAY_STYLES : theme_1.BUTTON_BLUE_STYLES)};"><i class="fa fa-fw fa-delete-left"></i></button>
    ${generateButton(0, input.value, info)}
    <button data-input="submit" style="${(0, theme_1.toCSS)(input.value.length === 4 ? theme_1.BUTTON_GREEN_STYLES : theme_1.BUTTON_GRAY_STYLES)};">Submit</button>
  `;
    keyboard.addEventListener("click", (event) => {
        const target = event.target;
        if (!target.dataset.input) {
            return;
        }
        if (target.dataset.input === "backspace") {
            input.value = input.value.slice(0, -1);
            renderKeyboard(input, info);
            return;
        }
        if (target.dataset.input === "submit") {
            submitButton.click();
            return;
        }
        input.value += target.dataset.input;
        renderKeyboard(input, info);
    });
    (_b = submitButton.parentElement) === null || _b === void 0 ? void 0 : _b.before(keyboard);
    submitButton.style.display = "none";
};
exports.vaultSolver = {
    settings: [SETTING_VAULT_SOLVER],
    onPageLoad: (settings, page) => {
        var _a;
        if (page !== page_1.Page.VAULT) {
            return;
        }
        if (!settings[settings_1.SettingId.VAULT_SOLVER]) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const input = document.querySelector("#vaultcode");
        input === null || input === void 0 ? void 0 : input.setAttribute("inputmode", "none");
        let info = (0, vault_1.generateDigitInfo)();
        const guessElements = document.querySelectorAll("[data-page='crack'] .row");
        const guesses = [];
        for (const [, guessElement] of guessElements.entries()) {
            const digitElements = guessElement.querySelectorAll(".col-25");
            if (digitElements.length > 0) {
                const guess = [0, 0, 0, 0];
                const hints = [vault_1.Hint.NONE, vault_1.Hint.NONE, vault_1.Hint.NONE, vault_1.Hint.NONE];
                for (const [position, digitElement] of digitElements.entries()) {
                    guess[position] = Number((_a = digitElement.textContent) === null || _a === void 0 ? void 0 : _a.slice(-1));
                    hints[position] =
                        // eslint-disable-next-line no-nested-ternary
                        digitElement.dataset.type === "B"
                            ? vault_1.Hint.CORRECT
                            : digitElement.dataset.type === "Y"
                                ? vault_1.Hint.CLOSE
                                : vault_1.Hint.NONE;
                }
                guesses.push(guess);
                info = (0, vault_1.applyGuess)(info, guess, hints);
            }
        }
        renderKeyboard(input, info);
        const guess = (0, vault_1.generateGuess)(info, guesses.length).join("");
        if (input) {
            input.value = guess;
        }
        const magicButton = document.createElement("div");
        magicButton.style.position = "absolute";
        magicButton.style.right = "20px";
        magicButton.style.bottom = "80px";
        magicButton.style.cursor = "pointer";
        magicButton.style.zIndex = "999999";
        magicButton.style.height = "60px";
        magicButton.style.width = "60px";
        magicButton.style.borderRadius = "100%";
        magicButton.style.backgroundColor = theme_1.BUTTON_GREEN_BACKGROUND;
        magicButton.style.borderWidth = "2px";
        magicButton.style.borderColor = theme_1.BUTTON_GREEN_BORDER;
        magicButton.style.borderStyle = "solid";
        magicButton.style.color = theme_1.TEXT_WHITE;
        magicButton.style.display = "flex";
        magicButton.style.justifyContent = "center";
        magicButton.style.alignItems = "center";
        magicButton.innerHTML = `<i class="fa fa-wand-sparkles fa-2x fa-fw" />`;
        magicButton.addEventListener("click", () => {
            var _a;
            // click new vault button if available
            const newVaultButton = currentPage.querySelector(".resetbtn");
            if (newVaultButton) {
                newVaultButton.click();
                return;
            }
            // click more guesses button if available
            const moreTriesButton = currentPage.querySelector(".moretriesbtn");
            if (moreTriesButton) {
                moreTriesButton.click();
            }
            // otherwise, submit the suggested guess
            if (input) {
                input.value = guess;
                (_a = currentPage.querySelector(".vcbtn")) === null || _a === void 0 ? void 0 : _a.click();
            }
        });
        currentPage.append(magicButton);
    },
};


/***/ }),

/***/ 70:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.versionManager = void 0;
const requests_1 = __webpack_require__(3813);
const notifications_1 = __webpack_require__(6783);
const api_1 = __webpack_require__(1604);
const popup_1 = __webpack_require__(469);
const isVersion = (version) => version.split(".").length === 3;
const normalizeVersion = (version) => version.split("-")[0];
const isVersionHigher = (test, current) => {
    const testParts = test.split(".");
    const currentParts = current.split(".");
    for (const [index, testPart] of testParts.entries()) {
        if (Number.parseInt(currentParts[index]) < Number.parseInt(testPart)) {
            return true;
        }
    }
    return false;
};
const currentVersion = normalizeVersion( true && "1.0.31" !== void 0 ? "1.0.31" : "1.0.0");
const README_URL = "https://github.com/anstosa/farmrpg-farmhand/blob/main/README.md";
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.CHANGES, () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const response = yield (0, requests_1.corsFetch)(README_URL);
    const htmlString = yield response.text();
    const document = new DOMParser().parseFromString(htmlString, "text/html");
    const body = document.querySelector(".markdown-body");
    if (!body) {
        console.error("Failed to get README body");
        return;
    }
    let contentHTML = "";
    for (const child of body.children) {
        if (child.classList.contains("markdown-heading")) {
            const version = normalizeVersion((_a = child.textContent) !== null && _a !== void 0 ? _a : "1.0.0");
            if (isVersion(version) && isVersionHigher(version, currentVersion)) {
                contentHTML += `
          <h2>${version}</h2>
          <ul>${(_b = child.nextElementSibling) === null || _b === void 0 ? void 0 : _b.innerHTML}</ul>
        `;
            }
        }
    }
    (0, popup_1.showPopup)({ title: "Farmhand Changelog", contentHTML, align: "left" });
}));
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.UPDATE, () => window.open(api_1.SCRIPT_URL));
exports.versionManager = {
    onInitialize: () => __awaiter(void 0, void 0, void 0, function* () {
        const latestVersion = yield api_1.latestVersionState.get();
        if (!latestVersion) {
            console.error("Failed to get latest version");
            return;
        }
        if (isVersionHigher(latestVersion, currentVersion)) {
            (0, notifications_1.sendNotification)({
                class: "btnblue",
                id: notifications_1.NotificationId.UPDATE,
                text: `Farmhand update available: ${currentVersion} → ${latestVersion}`,
                actions: [
                    {
                        text: "View Changes",
                        handler: notifications_1.Handler.CHANGES,
                    },
                    {
                        text: "Update",
                        handler: notifications_1.Handler.UPDATE,
                    },
                ],
            });
        }
        else {
            (0, notifications_1.removeNotification)(notifications_1.NotificationId.UPDATE);
        }
    }),
};


/***/ }),

/***/ 6217:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const autocomplete_1 = __webpack_require__(4067);
const autocompleteItems_1 = __webpack_require__(8477);
const autocompleteUsers_1 = __webpack_require__(5881);
const banker_1 = __webpack_require__(8092);
const buddyfarm_1 = __webpack_require__(2273);
const mailboxInChat_1 = __webpack_require__(8124);
const chatNav_1 = __webpack_require__(6922);
const cleanupExplore_1 = __webpack_require__(2742);
const cleanupHome_1 = __webpack_require__(5870);
const collapseItemImage_1 = __webpack_require__(4056);
const compactSilver_1 = __webpack_require__(8181);
const compressChat_1 = __webpack_require__(223);
const confirmation_1 = __webpack_require__(3906);
const customNavigation_1 = __webpack_require__(2224);
const dismissableChatBanners_1 = __webpack_require__(5164);
const exploreFirst_1 = __webpack_require__(6030);
const farmhandSettings_1 = __webpack_require__(8973);
const harvestNotifications_1 = __webpack_require__(4894);
const fishInBarrel_1 = __webpack_require__(2100);
const fleaMarket_1 = __webpack_require__(9361);
const page_1 = __webpack_require__(7952);
const settings_1 = __webpack_require__(126);
const highlightSelfInChat_1 = __webpack_require__(5454);
const improvedInputs_1 = __webpack_require__(1108);
const kitchenNotifications_1 = __webpack_require__(9737);
const linkifyQuickCraft_1 = __webpack_require__(7092);
const mailboxNotifications_1 = __webpack_require__(6297);
const maxContainers_1 = __webpack_require__(9735);
const maxCows_1 = __webpack_require__(1103);
const maxPigs_1 = __webpack_require__(2934);
const mealNotifications_1 = __webpack_require__(5792);
const miner_1 = __webpack_require__(4414);
const moveUpdateToTop_1 = __webpack_require__(4417);
const compressNavigation_1 = __webpack_require__(2827);
const notifications_1 = __webpack_require__(6783);
const perkManagement_1 = __webpack_require__(682);
const petNotifications_1 = __webpack_require__(8278);
const popup_1 = __webpack_require__(469);
const requests_1 = __webpack_require__(3300);
const questCollapse_1 = __webpack_require__(1768);
const quests_1 = __webpack_require__(3710);
const questTagging_1 = __webpack_require__(9524);
const quickSellSafely_1 = __webpack_require__(8760);
const vaultSolver_1 = __webpack_require__(3026);
const versionManager_1 = __webpack_require__(70);
const FEATURES = [
    // internal
    notifications_1.notifications,
    confirmation_1.confirmations,
    popup_1.popups,
    autocomplete_1.autocomplete,
    versionManager_1.versionManager,
    // UI
    improvedInputs_1.improvedInputs,
    // home
    cleanupHome_1.cleanupHome,
    moveUpdateToTop_1.moveUpdateToTop,
    // kitchen
    kitchenNotifications_1.kitchenNotifications,
    mealNotifications_1.mealNotifications,
    // farm,
    harvestNotifications_1.fieldNotifications,
    maxPigs_1.maxPigs,
    maxCows_1.maxCows,
    // flea market
    fleaMarket_1.fleaMarket,
    // items
    buddyfarm_1.buddyFarm,
    collapseItemImage_1.collapseItemImage,
    quickSellSafely_1.quicksellSafely,
    linkifyQuickCraft_1.linkifyQuickCraft,
    exploreFirst_1.exploreFirst,
    // quests
    quests_1.quests,
    questCollapse_1.questCollapse,
    questTagging_1.questTagging,
    compactSilver_1.compactSilver,
    // bank
    banker_1.banker,
    // mailbox
    mailboxNotifications_1.mailboxNotifications,
    // pets
    petNotifications_1.petNotifications,
    // vault
    vaultSolver_1.vaultSolver,
    // mining
    miner_1.miner,
    // locksmith
    maxContainers_1.maxContainers,
    // fishing
    fishInBarrel_1.fishinInBarrel,
    // explore
    perkManagement_1.perkManagment,
    cleanupExplore_1.cleanupExplore,
    // chat
    chatNav_1.chatNav,
    compressChat_1.compressChat,
    dismissableChatBanners_1.dismissableChatBanners,
    highlightSelfInChat_1.highlightSelfInChat,
    autocompleteItems_1.autocompleteItems,
    autocompleteUsers_1.autocompleteUsers,
    mailboxInChat_1.chatMailboxStats,
    // nav
    compressNavigation_1.navigationStyle,
    customNavigation_1.customNavigation,
    // settings
    farmhandSettings_1.farmhandSettings,
];
for (const feature of FEATURES) {
    (0, settings_1.registerSettings)(...((_a = feature.settings) !== null && _a !== void 0 ? _a : []));
}
const watchSubtree = (selector, handler, filter) => {
    const target = document.querySelector(selector);
    if (!target) {
        console.error(`${selector} not found`);
        return;
    }
    const handle = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const settings = yield (0, settings_1.getSettingValues)();
        const [page, parameters] = (0, page_1.getPage)();
        // console.debug(`${selector} Load`, page, parameters);
        for (const feature of FEATURES) {
            (_a = feature[handler]) === null || _a === void 0 ? void 0 : _a.call(feature, settings, page, parameters);
        }
    });
    const observer = new MutationObserver((mutations) => {
        var _a, _b;
        for (const mutation of mutations) {
            // only respond to tree changes
            if (mutation.type !== "childList") {
                continue;
            }
            if (mutation.addedNodes.length === 0) {
                continue;
            }
            const anyFirstPartyChanges = [...mutation.addedNodes].some((node) => { var _a; return (_a = node.className) === null || _a === void 0 ? void 0 : _a.includes("fh"); });
            if (anyFirstPartyChanges) {
                continue;
            }
            if (filter) {
                for (const node of mutation.addedNodes) {
                    if ((_b = (_a = node).matches) === null || _b === void 0 ? void 0 : _b.call(_a, filter)) {
                        handle();
                    }
                }
            }
            else {
                handle();
            }
        }
    });
    observer.observe(target, { childList: true, subtree: true });
    handle();
};
// eslint-disable-next-line unicorn/prefer-top-level-await
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line unicorn/prefer-module
        "use strict";
        console.info("STARTING Farmhand by Ansel Santosa");
        console.info("Running migrations...");
        const keys = yield GM.listValues();
        for (const key of keys) {
            const value = yield GM.getValue(key, null);
            if (key.startsWith("chatBanners")) {
                console.info(`Deleting legacy chat banners ${key}`, value);
                yield GM.deleteValue(key);
                continue;
            }
            if (key === "customNav_data" && typeof value === "string") {
                console.info(`Migrating legacy custom nav ${key}`, value);
                const items = JSON.parse(value);
                yield GM.setValue(key, { items });
                continue;
            }
            if (typeof value === "string") {
                console.info(`Deleting setting ${key} with invalid data format`, value);
                yield GM.deleteValue(key);
                continue;
            }
            if (key.startsWith("state_") &&
                (!Array.isArray(value) ||
                    value.length !== 2 ||
                    typeof value[0] !== "object" ||
                    typeof value[1] !== "object")) {
                console.info(`Deleting ${key} with invalid data format`, value);
                yield GM.deleteValue(key);
                continue;
            }
            if (key.endsWith("_data") && typeof value !== "object") {
                console.info(`Deleting setting ${key} with invalid data format`, value);
                yield GM.deleteValue(key);
            }
        }
        console.info("Migrations complete");
        // initialize
        console.info("Running initializers...");
        const settings = yield (0, settings_1.getSettingValues)();
        for (const { onInitialize } of FEATURES) {
            if (onInitialize) {
                onInitialize(settings);
            }
        }
        // run any interceptors for the first page
        const currentPage = (0, page_1.getCurrentPage)();
        if (currentPage) {
            console.info(`Running interceptors for ${currentPage.dataset.page}...`);
            for (const [state, interceptor] of requests_1.queryInterceptors) {
                const url = window.location.href.replace("/index.php#!", "");
                if ((0, requests_1.urlMatches)(url, ...interceptor.match)) {
                    const previous = yield state.get({ doNotFetch: true });
                    interceptor.callback(state, previous, {
                        headers: new Headers(),
                        ok: true,
                        redirected: false,
                        status: 200,
                        statusText: "OK",
                        type: "default",
                        url,
                        text: () => Promise.resolve(currentPage.innerHTML),
                        json: () => Promise.resolve({}),
                        formData: () => Promise.resolve(new FormData()),
                        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                        blob: () => Promise.resolve(new Blob([])),
                    });
                }
            }
        }
        else {
            console.warn("Failed to find first page");
        }
        console.info("Registering query interceptors...");
        yield (0, requests_1.watchQueries)();
        console.info("Registering DOM watchers...");
        // double watches because the page and nav load at different times but
        // separating the handlers makes everything harder
        watchSubtree(".view-main .pages", "onPageLoad", ".page");
        watchSubtree(".view-main .navbar", "onPageLoad", ".navbar-inner");
        watchSubtree(".view-main .pages", "onNotificationLoad", ".page > .button");
        // watch quest popup
        watchSubtree(".view-main .toolbar", "onQuestLoad");
        // watch menu
        watchSubtree(".view-left", "onMenuLoad");
        // watch desktop and mobile versions of chat
        watchSubtree("#mobilechatpanel", "onChatLoad");
        watchSubtree("#desktopchatpanel", "onChatLoad");
        console.info("Farmhand running!");
    });
})();


/***/ }),

/***/ 5818:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandom = void 0;
const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
exports.getRandom = getRandom;


/***/ }),

/***/ 4067:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autocomplete = exports.registerInputListeners = exports.registerAutocomplete = void 0;
const theme_1 = __webpack_require__(1178);
const state = {
    currentIndex: 0,
    autocompletes: [],
};
const processInput = (input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let activeAutocomplete;
    const text = input.value;
    const processedInput = { text };
    for (const autocomplete of state.autocompletes) {
        // "@anstosa: LF ((or"
        if ((_a = autocomplete === null || autocomplete === void 0 ? void 0 : autocomplete.bail) === null || _a === void 0 ? void 0 : _a.call(autocomplete, text)) {
            continue;
        }
        // "@anstosa: LF ((or"
        const match = text.match(autocomplete.trigger);
        // "or"
        if (!match || match.length < 2) {
            continue;
        }
        const search = match[1];
        const items = yield autocomplete.getItems();
        const filteredItems = items.filter(({ name }) => { var _a; return name.toLowerCase().includes((_a = search.toLowerCase()) !== null && _a !== void 0 ? _a : ""); });
        activeAutocomplete = autocomplete;
        processedInput.search = search;
        processedInput.match = match;
        processedInput.items = items;
        processedInput.filteredItems = filteredItems;
    }
    state.activeAutocomplete = activeAutocomplete;
    return processedInput;
});
const applyInput = (input, item) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filteredItems, search, match, text } = yield processInput(input);
    if (!state.activeAutocomplete) {
        return;
    }
    const { prefix, suffix } = state.activeAutocomplete;
    if (!search || !match || !filteredItems) {
        return;
    }
    // eslint-disable-next-line require-atomic-updates
    input.value = [
        text.slice(0, match.index),
        prefix,
        item.name,
        suffix,
        text.slice(((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[0].length),
    ].join("");
    closeAutocomplete();
});
const autocompleteSearchControlHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!event.target) {
        return;
    }
    if (!state.activeAutocomplete) {
        return;
    }
    if (!["Enter", "ArrowDown", "ArrowUp", "Escape"].includes(event.key)) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const input = event.target;
    const { filteredItems, search, match } = yield processInput(input);
    if (!search || !match || !filteredItems) {
        closeAutocomplete();
        return;
    }
    // eslint-disable-next-line unicorn/prefer-switch
    if (event.key === "Enter") {
        closeAutocomplete();
        yield applyInput(input, filteredItems[state.currentIndex]);
    }
    else if (event.key === "ArrowDown") {
        state.currentIndex = Math.min(state.currentIndex + 1, filteredItems.length - 1);
        renderAutocomplete(input, filteredItems);
    }
    else if (event.key === "ArrowUp") {
        state.currentIndex = Math.max(state.currentIndex - 1, 0);
        renderAutocomplete(input, filteredItems);
    }
    else if (event.key === "Escape") {
        closeAutocomplete();
    }
});
const autocompleteSearchItemHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!event.target) {
        return;
    }
    const input = event.target;
    const { filteredItems, match } = yield processInput(input);
    if (!match || !filteredItems) {
        closeAutocomplete();
        return;
    }
    renderAutocomplete(input, filteredItems);
});
const closeAutocomplete = () => {
    var _a;
    (_a = document.querySelector(".fh-autocomplete")) === null || _a === void 0 ? void 0 : _a.remove();
};
const renderAutocomplete = (input, items) => {
    closeAutocomplete();
    const offset = input.getBoundingClientRect();
    const wrapper = document.createElement("div");
    wrapper.classList.add("fh-autocomplete");
    wrapper.style.position = "fixed";
    wrapper.style.top = `${offset.top + offset.height}px`;
    wrapper.style.left = `${offset.left}px`;
    wrapper.style.width = `${offset.width}px`;
    wrapper.style.maxHeight = `${window.innerHeight - offset.top - offset.height}px`;
    wrapper.style.zIndex = "99999";
    wrapper.innerHTML = `
    ${items
        .map(({ name, image }, index) => `
          <div
            class="fh-autocomplete-item"
            data-index="${index}"
            style="
              display: flex;
              align-items: center;
              color: white;
              gap: 5px;
              width: 100%;
              cursor: pointer;
              padding: 8px;
              background-color: ${index === state.currentIndex
        ? theme_1.BUTTON_BLUE_BACKGROUND
        : theme_1.BACKGROUND_DARK};
            "
          >
            <img
              src="${image}"
              style="
                width: 25px;
                height: 25px;
              ">
            ${name}
          </div>
        `)
        .join("")}
  `;
    for (const item of wrapper.querySelectorAll(".fh-autocomplete-item")) {
        wrapper.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            closeAutocomplete();
            yield applyInput(input, items[Number(item.dataset.index)]);
        }));
    }
    document.body.append(wrapper);
};
const registerAutocomplete = (autocomplete) => {
    state.autocompletes.push(autocomplete);
};
exports.registerAutocomplete = registerAutocomplete;
const registerInputListeners = (input) => {
    input.addEventListener("keypress", autocompleteSearchItemHandler);
    input.addEventListener("keydown", autocompleteSearchControlHandler);
};
exports.registerInputListeners = registerInputListeners;
exports.autocomplete = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        .fh-autocomplete-item:hover {
          background-color: ${theme_1.BUTTON_BLUE_BACKGROUND};
        }
      <style>
    `);
    },
    onChatLoad: () => {
        for (const input of document.querySelectorAll(`
      #mobilechatpanel input[type="text"],
      #desktopchatpanel input[type='text']
    `)) {
            (0, exports.registerInputListeners)(input);
        }
    },
};


/***/ }),

/***/ 3906:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.confirmations = exports.showConfirmation = void 0;
const showConfirmation = (message, onYes, onNo) => {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.classList.add("modal-overlay-visible");
    document.body.append(overlay);
    const modal = document.createElement("div");
    modal.classList.add("actions-modal");
    modal.classList.add("modal-in");
    modal.innerHTML = `
      <div class="actions-modal-group">
        <div class="actions-modal-label">${message}</div>
        <div class="actions-modal-button">Yes</div>
        <div class="actions-modal-button color-red">Cancel</div>
      </div>
    `;
    const buttons = modal.querySelectorAll(".actions-modal-button");
    const yesButton = buttons[0];
    yesButton.addEventListener("click", () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        onYes();
    });
    const noButton = buttons[1];
    noButton.addEventListener("click", () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        onNo === null || onNo === void 0 ? void 0 : onNo();
    });
    document.body.append(modal);
};
exports.showConfirmation = showConfirmation;
exports.confirmations = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* fix confirmation position */
          .actions-modal-group {
            margin-bottom: 0 !important;
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 4276:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debounce = void 0;
const debounce = (callback, timeout = 300) => {
    let timer;
    return (...parameters) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            Reflect.apply(callback, this, parameters);
        }, timeout);
    };
};
exports.debounce = debounce;


/***/ }),

/***/ 9946:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearDropdown = exports.replaceSelect = void 0;
const theme_1 = __webpack_require__(1178);
const getOptionName = ({ name, quantity }) => {
    if (quantity === undefined) {
        return name;
    }
    const formatter = new Intl.NumberFormat();
    return `${name} (${formatter.format(quantity)})`;
};
const replaceSelect = (proxySelect, options) => {
    if (proxySelect.dataset.hasProxied === "true") {
        return;
    }
    proxySelect.style.display = "none";
    const selector = document.createElement("div");
    selector.classList.add("fh-item-selector");
    (0, theme_1.applyStyles)(selector, theme_1.INPUT_STYLES);
    selector.style.display = "flex";
    selector.style.alignItems = "center";
    selector.style.justifyContent = "center";
    selector.style.gap = "4px";
    selector.style.cursor = "pointer";
    const menu = document.createElement("div");
    menu.classList.add("fh-item-selector-menu");
    menu.style.padding = "10px 0";
    menu.style.display = "none";
    menu.style.position = "fixed";
    menu.style.zIndex = "9999";
    menu.style.background = theme_1.BACKGROUND_DARK;
    menu.style.border = `2px solid ${theme_1.BORDER_GRAY}`;
    menu.style.overflowY = "auto";
    menu.style.maxHeight = "406px";
    menu.style.fontSize = "17px";
    menu.style.color = theme_1.TEXT_GRAY;
    menu.style.marginTop = "-2px";
    const selectedOption = options.find((option) => option.value === proxySelect.value);
    selector.innerHTML = `
    ${(selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.icon)
        ? `<img src="${selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.icon}" style="width:16px; "/>`
        : ""}
    ${selectedOption ? getOptionName(selectedOption) : "Select an item"}
  `;
    selector.addEventListener("click", () => {
        const offset = selector.getBoundingClientRect();
        menu.style.top = `${offset.y + offset.height}px`;
        menu.style.right = `${window.innerWidth - offset.right}px`;
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    });
    for (const option of options) {
        const optionElement = document.createElement("div");
        optionElement.textContent = `${option.name} (${option.quantity})`;
        optionElement.style.textAlign = "left";
        optionElement.style.padding = "2px 10px";
        optionElement.style.display = "flex";
        optionElement.style.alignItems = "center";
        optionElement.style.gap = "4px";
        optionElement.style.cursor = "pointer";
        optionElement.innerHTML = `
      ${option.icon ? `<img src="${option.icon}" style="width:16px;" />` : ""}
      ${getOptionName(option)}
    `;
        optionElement.addEventListener("click", () => {
            proxySelect.value = option.value;
            proxySelect.dispatchEvent(new Event("change"));
            proxySelect.dataset.hasProxied = "false";
            menu.remove();
            selector.remove();
            (0, exports.replaceSelect)(proxySelect, options);
        });
        menu.append(optionElement);
    }
    proxySelect.after(selector);
    document.body.append(menu);
    proxySelect.dataset.hasProxied = "true";
};
exports.replaceSelect = replaceSelect;
const clearDropdown = () => { var _a; return (_a = document === null || document === void 0 ? void 0 : document.querySelector(".fh-item-selector-menu")) === null || _a === void 0 ? void 0 : _a.remove(); };
exports.clearDropdown = clearDropdown;


/***/ }),

/***/ 6783:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.notifications = exports.removeNotification = exports.sendNotification = exports.registerNotificationHandler = exports.Handler = exports.NotificationId = void 0;
const page_1 = __webpack_require__(7952);
const object_1 = __webpack_require__(7968);
const KEY_NOTIFICATIONS = "notifications";
var NotificationId;
(function (NotificationId) {
    NotificationId["FIELD"] = "field";
    NotificationId["MAILBOX"] = "mailbox";
    NotificationId["MEAL"] = "meal";
    NotificationId["OVEN"] = "oven";
    NotificationId["PERKS"] = "perks";
    NotificationId["PETS"] = "pets";
    NotificationId["UPDATE"] = "update";
})(NotificationId || (exports.NotificationId = NotificationId = {}));
var Handler;
(function (Handler) {
    Handler["CHANGES"] = "updateChanges";
    Handler["COLLECT_MAIL"] = "collectMail";
    Handler["COLLECT_MEALS"] = "collectMeals";
    Handler["COLLECT_PETS"] = "collectPets";
    Handler["HARVEST"] = "harvest";
    Handler["UPDATE"] = "update";
})(Handler || (exports.Handler = Handler = {}));
const isHandlerNotificationAction = (action) => "handler" in action;
const isHandlerNotification = (notification) => "handler" in notification;
const isLinkNotification = (notification) => "href" in notification;
const isTextNotification = (notification) => !isHandlerNotification(notification) && !isLinkNotification(notification);
const state = {
    notifications: [],
};
const notificationHandlers = new Map();
const registerNotificationHandler = (handlerName, handler) => {
    notificationHandlers.set(handlerName, handler);
};
exports.registerNotificationHandler = registerNotificationHandler;
const sendNotification = (notification) => {
    state.notifications = [
        ...state.notifications.filter(({ id }) => id !== notification.id),
        notification,
    ];
    renderNotifications(true);
};
exports.sendNotification = sendNotification;
const removeNotification = (notification) => {
    const notificationId = (0, object_1.isObject)(notification)
        ? notification.id
        : notification;
    state.notifications = state.notifications.filter(({ id }) => id !== notificationId);
    renderNotifications();
};
exports.removeNotification = removeNotification;
const renderNotifications = (force = false) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const pageContent = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".page-content");
    if (!pageContent) {
        console.error("Page content not found");
        return;
    }
    // remove existing notifications
    const notifications = pageContent.querySelectorAll(".fh-notification");
    if (!force && notifications.length === state.notifications.length) {
        return;
    }
    for (const notification of notifications) {
        notification.remove();
    }
    // add new notifications
    for (const notification of state.notifications.toSorted((a, b) => a.id.localeCompare(b.id) || 0)) {
        const currentPage = (0, page_1.getCurrentPage)();
        // skip notifications that are excluded from the current page
        if ((_b = notification.excludePages) === null || _b === void 0 ? void 0 : _b.includes((_c = currentPage === null || currentPage === void 0 ? void 0 : currentPage.dataset.page) !== null && _c !== void 0 ? _c : "")) {
            return;
        }
        // replace native notification if relevant
        if (notification.replacesHref) {
            const link = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(`a[href="${notification.replacesHref}"]`);
            if ((_d = link === null || link === void 0 ? void 0 : link.classList) === null || _d === void 0 ? void 0 : _d.contains("button")) {
                link.remove();
            }
            if ((_f = (_e = link === null || link === void 0 ? void 0 : link.parentElement) === null || _e === void 0 ? void 0 : _e.classList) === null || _f === void 0 ? void 0 : _f.contains("button")) {
                link.parentElement.remove();
            }
        }
        const notificationElement = document.createElement(isTextNotification(notification) ? "span" : "a");
        notificationElement.classList.add("button");
        notificationElement.classList.add("fh-notification");
        notificationElement.style.cursor = isTextNotification(notification)
            ? "default"
            : "pointer";
        if (notification.class) {
            notificationElement.classList.add(notification.class);
        }
        notificationElement.textContent = notification.text;
        if (isHandlerNotification(notification)) {
            notificationElement.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                event.preventDefault();
                event.stopPropagation();
                const handler = notificationHandlers.get(notification.handler);
                if (handler) {
                    yield handler(notification);
                }
                else {
                    console.error(`Handler not found: ${notification.handler}`);
                }
                (0, exports.removeNotification)(notification);
                renderNotifications();
            }));
        }
        else if (isLinkNotification(notification)) {
            notificationElement.setAttribute("href", notification.href);
        }
        for (const action of (_g = notification.actions) !== null && _g !== void 0 ? _g : []) {
            notificationElement.append(document.createTextNode(((_h = notification.actions) === null || _h === void 0 ? void 0 : _h.indexOf(action)) === 0 ? " " : " / "));
            const actionElement = document.createElement("a");
            actionElement.classList.add("fh-notification-action");
            actionElement.style.cursor = "pointer";
            actionElement.textContent = action.text;
            if (isHandlerNotificationAction(action)) {
                actionElement.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                    actionElement.textContent = "Loading...";
                    event.preventDefault();
                    event.stopPropagation();
                    const handler = notificationHandlers.get(action.handler);
                    if (handler) {
                        yield handler(notification);
                    }
                    else {
                        console.error(`Handler not found: ${action.handler}`);
                    }
                    renderNotifications();
                }));
            }
            else {
                actionElement.href = action.href;
            }
            notificationElement.append(actionElement);
        }
        if ((_j = pageContent.firstElementChild) === null || _j === void 0 ? void 0 : _j.classList.contains("pull-to-refresh-layer")) {
            pageContent.insertBefore(notificationElement, pageContent.children[1]);
        }
        else {
            pageContent.prepend(notificationElement);
        }
    }
};
exports.notifications = {
    onPageLoad: () => {
        setTimeout(renderNotifications, 500);
    },
};


/***/ }),

/***/ 7968:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isObject = void 0;
const isObject = (value) => typeof value === "object" && !Array.isArray(value) && value !== null;
exports.isObject = isObject;


/***/ }),

/***/ 7952:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getListByTitle = exports.getCardByTitle = exports.getTitle = exports.setTitle = exports.getCurrentPage = exports.getPreviousPage = exports.getPage = exports.WorkerGo = exports.Page = void 0;
var Page;
(function (Page) {
    Page["AREA"] = "area";
    Page["BANK"] = "bank";
    Page["BIO"] = "settings_bio";
    Page["FARM"] = "xfarm";
    Page["FARMERS_MARKET"] = "market";
    Page["FISHING"] = "fishing";
    Page["FRIENDSHIP"] = "npclevels";
    Page["HOME_PAGE"] = "index-1";
    Page["HOME_PATH"] = "index";
    Page["ITEM"] = "item";
    Page["KITCHEN"] = "kitchen";
    Page["LOCKSMITH"] = "locksmith";
    Page["MAILBOX"] = "mailbox";
    Page["MINING"] = "mining";
    Page["PASTURE"] = "pasture";
    Page["PERKS"] = "perks";
    Page["PETS"] = "allpetitems";
    Page["PIG_PEN"] = "pigpen";
    Page["POST_OFFICE"] = "postoffice";
    Page["PROFILE"] = "profile";
    Page["QUEST"] = "quest";
    Page["QUESTS"] = "quests";
    Page["SETTINGS"] = "settings";
    Page["SETTINGS_OPTIONS"] = "settings_options";
    Page["TEMPLE"] = "mailitems";
    Page["VAULT"] = "crack";
    Page["WELL"] = "well";
    Page["WHEEL"] = "spin";
    Page["WORKER"] = "worker";
    Page["WORKSHOP"] = "workshop";
})(Page || (exports.Page = Page = {}));
var WorkerGo;
(function (WorkerGo) {
    WorkerGo["ACTIVATE_PERK_SET"] = "activateperkset";
    WorkerGo["SET_BIO"] = "settings_bio";
    WorkerGo["COLLECT_ALL_PET_ITEMS"] = "collectallpetitems";
    WorkerGo["COLLECT_ALL_MAIL_ITEMS"] = "collectallmailitems";
    WorkerGo["COLLECT_ALL_MEALS"] = "cookreadyall";
    WorkerGo["COOK_ALL"] = "cookitemall";
    WorkerGo["DEPOSIT_SILVER"] = "depositsilver";
    WorkerGo["FARM_STATUS"] = "farmstatus";
    WorkerGo["GET_STATS"] = "getstats";
    WorkerGo["HARVEST_ALL"] = "harvestall";
    WorkerGo["NOTES"] = "notes";
    WorkerGo["PLANT_ALL"] = "plantall";
    WorkerGo["READY_COUNT"] = "readycount";
    WorkerGo["RESET_PERKS"] = "resetperks";
    WorkerGo["SEASON_MEALS"] = "seasonmealsall";
    WorkerGo["STIR_MEALS"] = "stirmealsall";
    WorkerGo["TASTE_MEALS"] = "tastemealsall";
    WorkerGo["USE_ITEM"] = "useitem";
    WorkerGo["WITHDRAW_SILVER"] = "withdrawalsilver";
})(WorkerGo || (exports.WorkerGo = WorkerGo = {}));
// get page and parameters if any
const getPage = () => {
    const currentPage = (0, exports.getCurrentPage)();
    const page = currentPage === null || currentPage === void 0 ? void 0 : currentPage.dataset.page;
    const parameters = new URLSearchParams(window.location.hash.split("?")[1]);
    return [page, parameters];
};
exports.getPage = getPage;
const getPreviousPage = () => document.querySelector(".page-on-left");
exports.getPreviousPage = getPreviousPage;
const getCurrentPage = () => document.querySelector(".page-on-center, .page-from-right-to-center, .view-main .page:only-child");
exports.getCurrentPage = getCurrentPage;
const setTitle = (title) => {
    const nav = document.querySelector(".navbar-on-center");
    if (!nav) {
        console.error("Navbar not found");
        return;
    }
    const text = nav === null || nav === void 0 ? void 0 : nav.querySelector("center");
    if (!text) {
        console.error("Center text not found");
        return;
    }
    text.textContent = title;
};
exports.setTitle = setTitle;
const getTitle = (searchTitle, root) => {
    var _a;
    const currentPage = root !== null && root !== void 0 ? root : (0, exports.getCurrentPage)();
    if (!currentPage) {
        console.error("Current page not found");
        return null;
    }
    const titles = currentPage.querySelectorAll(".content-block-title");
    const targetTitle = [...titles].find((title) => searchTitle instanceof RegExp
        ? searchTitle.test(title.textContent || "")
        : title.textContent === searchTitle);
    return (_a = targetTitle) !== null && _a !== void 0 ? _a : null;
};
exports.getTitle = getTitle;
const getCardByTitle = (searchTitle, root) => {
    const targetTitle = (0, exports.getTitle)(searchTitle, root);
    if (!targetTitle) {
        console.error(`${searchTitle} title not found`);
        return null;
    }
    return targetTitle.nextElementSibling;
};
exports.getCardByTitle = getCardByTitle;
const getListByTitle = (searchTitle, root) => {
    const targetCard = (0, exports.getCardByTitle)(searchTitle, root);
    if (!targetCard) {
        console.error(`${searchTitle} card not found`);
        return null;
    }
    return targetCard.querySelector("ul");
};
exports.getListByTitle = getListByTitle;


/***/ }),

/***/ 469:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.popups = exports.showPopup = void 0;
const showPopup = ({ title, contentHTML, align, okText, actions, }) => new Promise((resolve) => {
    var _a;
    let overlay = document.querySelector(".modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("modal-overlay");
        document.body.append(overlay);
    }
    overlay.classList.add("modal-overlay-visible");
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("modal-in");
    modal.style.display = "block";
    modal.style.width = "auto";
    modal.style.maxWidth = "75vw";
    modal.style.maxHeight = "75vh";
    modal.innerHTML = `
      <div
        class="modal-inner"
        style="
          text-align: ${align !== null && align !== void 0 ? align : "center"};
          display: flex;
          flex-direction: column;
          height: 100%;
        "
      >
        <div class="modal-title">${title}</div>
        <div
          class="modal-text"
          style="
            overflow-y: auto;
            flex: 1;
          "
        >${contentHTML}</div>
      </div>
      <div
        class="
          modal-buttons
          modal-buttons-vertical
          modal-buttons-${((_a = actions === null || actions === void 0 ? void 0 : actions.length) !== null && _a !== void 0 ? _a : 0) + 1}
        ">
        ${actions
        ? actions
            .map(({ name, buttonClass }, index) => `
              <span
                class="modal-button modal-button-bold fh-action button ${buttonClass}"
                data-index="${index}"
              >
                ${name}
              </span>`)
            .join("")
        : ""}
        <span class="modal-button fh-ok">${okText !== null && okText !== void 0 ? okText : "OK"}</span>
      </div>
    `;
    if (actions) {
        for (const [index, { callback }] of actions.entries()) {
            const button = modal.querySelector(`.fh-action[data-index='${index}']`);
            button === null || button === void 0 ? void 0 : button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                button.textContent = "Loading...";
                yield callback();
                overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
                modal.remove();
                resolve();
            }));
        }
    }
    const okButton = modal.querySelector(".fh-ok");
    okButton === null || okButton === void 0 ? void 0 : okButton.addEventListener("click", () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        resolve();
    });
    document.body.append(modal);
    const offset = modal.getBoundingClientRect();
    modal.style.marginTop = `-${offset.height / 2}px`;
    modal.style.marginLeft = `-${offset.width / 2}px`;
});
exports.showPopup = showPopup;
exports.popups = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* hide duplicate modal overlays */
          .modal-overlay-visible ~ .modal-overlay-visible {
            opacity: 0;
          }
        <style>
      `);
        // click outside to close
        document.body.addEventListener("click", (event) => {
            var _a, _b;
            if (event.target.classList.contains("modal-overlay")) {
                const buttons = document.querySelectorAll(".modal .modal-button");
                (_b = (_a = [...buttons]) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.click();
            }
        });
    },
};


/***/ }),

/***/ 3813:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDocument = exports.corsFetch = void 0;
const corsFetch = (url, options) => new Promise((resolve, reject) => {
    var _a;
    GM.xmlHttpRequest(Object.assign(Object.assign({}, options), { method: (_a = options === null || options === void 0 ? void 0 : options.method) !== null && _a !== void 0 ? _a : "GET", url, onload: (response) => {
            resolve({
                headers: new Headers(),
                ok: response.status >= 200 && response.status < 300,
                redirected: url !== response.finalUrl,
                status: response.status,
                statusText: response.statusText,
                type: "default",
                url: response.finalUrl,
                text: () => Promise.resolve(response.responseText),
                json: () => Promise.resolve(JSON.parse(response.responseText)),
                formData: () => Promise.resolve(new FormData()),
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                blob: () => Promise.resolve(new Blob([response.responseText])),
            });
        }, onerror: reject, onabort: reject, ontimeout: reject }));
});
exports.corsFetch = corsFetch;
const getDocument = (response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const htmlString = yield response.text();
    return new DOMParser().parseFromString(htmlString, "text/html");
});
exports.getDocument = getDocument;


/***/ }),

/***/ 126:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerExportToNotes = exports.setSetting = exports.getSetting = exports.setData = exports.getData = exports.getSettingValues = exports.getDefaultSettings = exports.getSettings = exports.registerSettings = exports.SettingId = void 0;
var SettingId;
(function (SettingId) {
    SettingId["ATTENTION_NOTIFICATIONS"] = "attentionNotifications";
    SettingId["ATTENTION_NOTIFICATIONS_VERBOSE"] = "attentionNotificationsVerbose";
    SettingId["AUTOCOMPLETE_ITEMS"] = "autocompleteItems";
    SettingId["AUTOCOMPLETE_USERS"] = "autocompleteUsers";
    SettingId["BANKER"] = "banker";
    SettingId["BUDDY_FARM"] = "buddyFarm";
    SettingId["CHAT_COMPRESS"] = "compressChat";
    SettingId["CHAT_DISMISSABLE_BANNERS"] = "dismissableChatBanners";
    SettingId["CHAT_HIGHLIGHT_SELF"] = "highlightSelfInChat";
    SettingId["CHAT_MAILBOX_STATS"] = "chatMailboxStats";
    SettingId["COLLAPSE_ITEM"] = "collapseItem";
    SettingId["COMPACT_SILVER"] = "compactSilver";
    SettingId["EXPLORE_FIRST"] = "exploreFirst";
    SettingId["EXPLORE_IMPROVED"] = "exploreImproved";
    SettingId["EXPORT"] = "export";
    SettingId["FIELD_EMPTY_NOTIFICATIONS"] = "fieldEmptyNotifications";
    SettingId["FISH_IN_BARREL"] = "fishInBarrel";
    SettingId["FLEA_MARKET"] = "fleaMarket";
    SettingId["HARVEST_NOTIFICATIONS"] = "harvestNotifications";
    SettingId["HARVEST_POPUP"] = "harvestPopup";
    SettingId["HOME_COMPRESS_SKILLS"] = "homeCompressSkills";
    SettingId["HOME_HIDE_FOOTER"] = "homeHideFooter";
    SettingId["HOME_HIDE_PLAYERS"] = "homeHidePlayers";
    SettingId["HOME_HIDE_THEME"] = "homeHideTheme";
    SettingId["IMPORT"] = "import";
    SettingId["IMPROVED_INPUTS"] = "improvedInputs";
    SettingId["KITCHEN_COMPLETE_NOTIFICATIONS"] = "readyNotifications";
    SettingId["KITCHEN_EMPTY_NOTIFICATIONS"] = "kitchenEmptyNotifications";
    SettingId["MAX_ANIMALS"] = "maxAnimals";
    SettingId["MAX_CONTAINERS"] = "maxContainers";
    SettingId["MEAL_NOTIFICATIONS"] = "mealNotifications";
    SettingId["MINER"] = "miner";
    SettingId["MINER_BOMBS"] = "minerBombs";
    SettingId["MINER_EXPLOSIVES"] = "minerExplosives";
    SettingId["NAV_ADD_MENU"] = "bottomMenu";
    SettingId["NAV_ALIGN_BOTTOM"] = "alignBottomNav";
    SettingId["NAV_COMPRESS"] = "compressNav";
    SettingId["NAV_CUSTOM"] = "customNav";
    SettingId["NAV_HIDE_LOGO"] = "noLogoNav";
    SettingId["PERK_MANAGER"] = "perkManager";
    SettingId["QUEST_COLLAPSE"] = "questCollapse";
    SettingId["QUEST_TAGGING"] = "questTagging";
    SettingId["QUICKSELL_SAFELY"] = "quicksellSafely";
    SettingId["UPDATE_AT_TOP"] = "updateAtTop";
    SettingId["VAULT_SOLVER"] = "vaultSolver";
})(SettingId || (exports.SettingId = SettingId = {}));
const settings = [];
const registerSettings = (...newSettings) => {
    settings.push(...newSettings);
};
exports.registerSettings = registerSettings;
const getSettings = () => settings;
exports.getSettings = getSettings;
const getDefaultSettings = () => {
    var _a;
    const settings = {};
    for (const setting of (0, exports.getSettings)()) {
        settings[setting.id] = (_a = setting === null || setting === void 0 ? void 0 : setting.value) !== null && _a !== void 0 ? _a : setting.defaultValue;
    }
    return settings;
};
exports.getDefaultSettings = getDefaultSettings;
const getSettingValues = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = {};
    for (const setting of (0, exports.getSettings)()) {
        settings[setting.id] = yield GM.getValue(setting.id, setting.defaultValue);
    }
    return settings;
});
exports.getSettingValues = getSettingValues;
const toDataKey = (setting) => typeof setting === "string" ? `${setting}_data` : `${setting.id}_data`;
const getData = (setting, defaultValue) => __awaiter(void 0, void 0, void 0, function* () {
    const key = toDataKey(setting);
    if (!key) {
        return defaultValue;
    }
    const value = yield GM.getValue(key, defaultValue);
    if (typeof value !== "object") {
        return defaultValue;
    }
    return value;
});
exports.getData = getData;
const setData = (setting, data) => __awaiter(void 0, void 0, void 0, function* () {
    const key = toDataKey(setting);
    if (!key) {
        return false;
    }
    if (typeof data !== "object") {
        return false;
    }
    const previous = yield GM.getValue(key, null);
    yield GM.setValue(key, data);
    const changed = JSON.stringify(previous) !== JSON.stringify(data);
    if (changed) {
        yield exportToNotes();
    }
    return changed;
});
exports.setData = setData;
const getSetting = (setting) => __awaiter(void 0, void 0, void 0, function* () {
    return (Object.assign(Object.assign({}, setting), { value: yield GM.getValue(setting.id, setting.defaultValue) }));
});
exports.getSetting = getSetting;
const setSetting = (setting) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const previous = yield GM.getValue(setting.id, setting.defaultValue);
    const value = (_a = setting.value) !== null && _a !== void 0 ? _a : setting.defaultValue;
    yield GM.setValue(setting.id, value);
    const changed = previous !== value;
    if (changed) {
        yield exportToNotes();
    }
    return changed;
});
exports.setSetting = setSetting;
// hack to avoid circular dependency
let _exportToNotes;
const registerExportToNotes = (exporter) => {
    _exportToNotes = exporter;
};
exports.registerExportToNotes = registerExportToNotes;
const exportToNotes = () => { var _a; return (_a = _exportToNotes === null || _exportToNotes === void 0 ? void 0 : _exportToNotes()) !== null && _a !== void 0 ? _a : Promise.resolve(); };


/***/ }),

/***/ 4782:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CachedState = exports.StorageKey = void 0;
const object_1 = __webpack_require__(7968);
const requests_1 = __webpack_require__(3300);
var StorageKey;
(function (StorageKey) {
    StorageKey["CHAT_BANNERS"] = "chatBanners";
    StorageKey["CURRENT_PERKS_SET_ID"] = "currentPerksSetId";
    StorageKey["FARM_ID"] = "farmId";
    StorageKey["FARM_STATE"] = "farmState";
    StorageKey["FARM_STATUS"] = "farmStatus";
    StorageKey["IS_BETA"] = "isBeta";
    StorageKey["IS_CHAT_ENABLED"] = "isChatEnabled";
    StorageKey["IS_DARK_MODE"] = "isDarkMode";
    StorageKey["IS_MUSIC_ENABLED"] = "isMusicEnabled";
    StorageKey["ITEM_DATA"] = "items";
    StorageKey["KITHCEN_STATUS"] = "kitchenStatus";
    StorageKey["LATEST_VERSION"] = "latestVersion";
    StorageKey["MAILBOX"] = "mailbox";
    StorageKey["MEALS_STATUS"] = "mealsStatus";
    StorageKey["NOTES"] = "notes";
    StorageKey["PAGE_DATA"] = "pageData";
    StorageKey["PERKS_SETS"] = "perkSets";
    StorageKey["PETS"] = "pets";
    StorageKey["PLAYER_MAILBOXES"] = "playerMailboxes";
    StorageKey["PLAYERS"] = "players";
    StorageKey["RECENT_UPDATE"] = "recentUpdate";
    StorageKey["STATS"] = "stats";
    StorageKey["USERNAME"] = "username";
    StorageKey["USER_ID"] = "userId";
})(StorageKey || (exports.StorageKey = StorageKey = {}));
const QUERYLESS_KEY = "__QUERYLESS__";
const toQueryKey = (query) => query !== null && query !== void 0 ? query : QUERYLESS_KEY;
const lazyQueue = [];
let isProcessingQueue = false;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (isProcessingQueue) {
        return;
    }
    isProcessingQueue = true;
    while (lazyQueue.length > 0) {
        const task = lazyQueue.shift();
        if (task) {
            yield task();
        }
    }
    // eslint-disable-next-line require-atomic-updates
    isProcessingQueue = false;
}), 1000);
class CachedState {
    constructor(key, fetch, { defaultState, timeout, interceptors = [], persist = true, }) {
        this.state = {};
        this.defaultState = defaultState;
        this.fetch = fetch;
        this.gettingByQuery = {};
        this.key = `state_${key}`;
        this.persist = persist;
        this.state = {};
        this.timeout = timeout !== null && timeout !== void 0 ? timeout : 60;
        this.updateListeners = [];
        this.updatedAtByQuery = {};
        for (const interceptor of interceptors) {
            (0, requests_1.registerQueryInterceptor)([this, interceptor]);
        }
        this.load();
    }
    onUpdate(callback) {
        this.updateListeners.push(callback);
    }
    read(query) {
        return this.state[toQueryKey(query)];
    }
    get() {
        return __awaiter(this, arguments, void 0, function* ({ ignoreCache, doNotFetch, query, lazy, } = {}) {
            const queryKey = toQueryKey(query);
            const existingPromise = this.gettingByQuery[queryKey];
            if (existingPromise) {
                console.debug(`[STATE] Waiting for ${this.key} fetch`, existingPromise);
                return yield existingPromise;
            }
            const newPromise = new Promise((resolve) => {
                const queryKey = toQueryKey(query);
                const previous = this.read(query);
                const expires = this.updatedAtByQuery[queryKey] + this.timeout * 1000;
                if (!doNotFetch && (!previous || ignoreCache || expires < Date.now())) {
                    if (lazy) {
                        resolve(previous);
                        lazyQueue.push(() => this.fetch(this, query).then((result) => this.set(result, query)));
                        return;
                    }
                    console.debug(`[STATE] Fetching ${this.key} (query: ${queryKey})`, {
                        ignoreCache,
                        updatedAt: this.updatedAtByQuery[queryKey],
                        timeout: this.timeout,
                        previous,
                    });
                    this.fetch(this, query).then((result) => resolve(this.set(result, query)));
                }
                else {
                    console.debug(`[STATE] Returning cached ${this.key} (query: ${queryKey})`, {
                        ignoreCache,
                        updatedAt: this.updatedAtByQuery[queryKey],
                        timeout: this.timeout,
                        previous,
                    });
                    resolve(this.read(query));
                }
            });
            this.gettingByQuery[queryKey] = newPromise;
            const result = yield newPromise;
            delete this.gettingByQuery[queryKey];
            return result;
        });
    }
    set(input, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const queryKey = toQueryKey(query);
            const previous = this.state[queryKey];
            const value = (0, object_1.isObject)(this.defaultState)
                ? Object.assign(Object.assign(Object.assign({}, this.defaultState), previous), input) : (_a = input !== null && input !== void 0 ? input : previous) !== null && _a !== void 0 ? _a : this.defaultState;
            if (!value) {
                delete this.state[queryKey];
                console.debug(`[STATE] Deleting ${this.key}.${queryKey}`, undefined, this.state);
                return;
            }
            console.debug(`[STATE] Setting ${this.key}.${queryKey}`, value, this.state);
            this.state[queryKey] = value;
            this.updatedAtByQuery[queryKey] = value === undefined ? 0 : Date.now();
            for (const listener of this.updateListeners) {
                listener(value);
            }
            yield this.save();
            return value;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.persist) {
                return;
            }
            yield GM.setValue(this.key, [this.updatedAtByQuery, this.state]);
        });
    }
    // reads the persisted tuples out of GM storage
    // [updatedAtByQuery, state]
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.persist) {
                return;
            }
            const [updatedAtByQuery, state] = yield GM.getValue(this.key, [{}, {}]);
            this.updatedAtByQuery = updatedAtByQuery;
            this.state = state;
        });
    }
}
exports.CachedState = CachedState;


/***/ }),

/***/ 1178:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BUTTON_VAULT_BLUE_STYLES = exports.BUTTON_VAULT_YELLOW_STYLES = exports.BUTTON_VAULT_GRAY_STYLES = exports.BUTTON_GRAY_DARK_STYLES = exports.BUTTON_GRAY_STYLES = exports.BUTTON_PURPLE_STYLES = exports.BUTTON_RED_STYLES = exports.BUTTON_GREEN_DARK_STYLES = exports.BUTTON_ORANGE_STYLES = exports.BUTTON_BLUE_STYLES = exports.BUTTON_GREEN_STYLES = exports.generateButton = exports.BUTTON_GRAY_BORDER = exports.BUTTON_GRAY_BACKGROUND = exports.BUTTON_PURPLE_BORDER = exports.BUTTON_PURPLE_BACKGROUND = exports.BUTTON_RED_BORDER = exports.BUTTON_RED_BACKGROUND = exports.BUTTON_BLUE_BORDER = exports.BUTTON_BLUE_BACKGROUND = exports.BUTTON_ORANGE_BORDER = exports.BUTTON_ORANGE_BACKGROUND = exports.BUTTON_GREEN_DARK_BORDER = exports.BUTTON_GREEN_DARK_BACKGROUND = exports.BUTTON_GREEN_BORDER = exports.BUTTON_GREEN_BACKGROUND = exports.INPUT_STYLES = exports.INPUT_BORDER = exports.INPUT_PADDING = exports.BACKGROUND_DARK = exports.BACKGROUND_BLACK = exports.BACKGROUND_WHITE = exports.BORDER_GRAY = exports.TEXT_BLACK = exports.TEXT_SUCCESS = exports.TEXT_WARNING = exports.TEXT_ERROR = exports.TEXT_GRAY = exports.TEXT_WHITE = exports.ALERT_YELLOW_BORDER = exports.ALERT_YELLOW_BACKGROUND = exports.LINK_RED = exports.LINK_GREEN = exports.toCSS = exports.camelToKebab = exports.applyStyles = exports.important = void 0;
const important = (style) => `${style} !important`;
exports.important = important;
const applyStyles = (element, styles) => {
    for (const [key, input] of Object.entries(styles)) {
        const [value, priority] = input.split("!");
        element.style.setProperty(key, value, priority);
    }
};
exports.applyStyles = applyStyles;
const camelToKebab = (input) => input.replaceAll(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
exports.camelToKebab = camelToKebab;
const toCSS = (style) => Object.entries(style)
    .map(([key, value]) => `${(0, exports.camelToKebab)(key)}: ${value}`)
    .join(";\n");
exports.toCSS = toCSS;
// links
exports.LINK_GREEN = "#90EE90";
exports.LINK_RED = "#ED143D";
// alerts
exports.ALERT_YELLOW_BACKGROUND = "#351C04";
exports.ALERT_YELLOW_BORDER = "#41260D";
// text
exports.TEXT_WHITE = "#FFFFFF";
exports.TEXT_GRAY = "#BBBBBB";
exports.TEXT_ERROR = "#FF0000";
exports.TEXT_WARNING = "#FFA500";
exports.TEXT_SUCCESS = "#30D611";
exports.TEXT_BLACK = "#000000";
// borders
exports.BORDER_GRAY = "#393939";
// backgrounds
exports.BACKGROUND_WHITE = "#FFFFFF";
exports.BACKGROUND_BLACK = "#111111";
exports.BACKGROUND_DARK = "#161718";
exports.INPUT_PADDING = "9px 12px";
exports.INPUT_BORDER = `2px solid ${exports.BORDER_GRAY}`;
exports.INPUT_STYLES = {
    background: (0, exports.important)(exports.BACKGROUND_DARK),
    border: (0, exports.important)(exports.INPUT_BORDER),
    borderRadius: (0, exports.important)("0"),
    fontSize: (0, exports.important)("14px"),
    boxShadow: (0, exports.important)("none"),
    color: (0, exports.important)(exports.TEXT_WHITE),
    height: (0, exports.important)("36px"),
    padding: (0, exports.important)(exports.INPUT_PADDING),
    minWidth: (0, exports.important)("100px"),
};
// buttons
exports.BUTTON_GREEN_BACKGROUND = "#003300";
exports.BUTTON_GREEN_BORDER = "#006600";
exports.BUTTON_GREEN_DARK_BACKGROUND = "#001900";
exports.BUTTON_GREEN_DARK_BORDER = "#003300";
exports.BUTTON_ORANGE_BACKGROUND = "#532A02";
exports.BUTTON_ORANGE_BORDER = "#8B4A0D";
exports.BUTTON_BLUE_BACKGROUND = "#101059";
exports.BUTTON_BLUE_BORDER = "#19199B";
exports.BUTTON_RED_BACKGROUND = "#330000";
exports.BUTTON_RED_BORDER = "#660000";
exports.BUTTON_PURPLE_BACKGROUND = "#3A204C";
exports.BUTTON_PURPLE_BORDER = "#4A315C";
exports.BUTTON_GRAY_BACKGROUND = "#444444";
exports.BUTTON_GRAY_BORDER = "#666666";
const generateButton = (background, border, borderStyle = "solid") => ({
    background: (0, exports.important)(background),
    border: (0, exports.important)(`2px ${borderStyle} ${border}`),
    borderRadius: (0, exports.important)("0"),
    boxShadow: (0, exports.important)("none"),
    color: (0, exports.important)(exports.TEXT_WHITE),
    fontSize: (0, exports.important)("14px"),
    cursor: (0, exports.important)("pointer"),
    lineHeight: (0, exports.important)("1"),
    height: (0, exports.important)("36px"),
    padding: (0, exports.important)(exports.INPUT_PADDING),
    width: (0, exports.important)("auto"),
});
exports.generateButton = generateButton;
exports.BUTTON_GREEN_STYLES = (0, exports.generateButton)(exports.BUTTON_GREEN_BACKGROUND, exports.BUTTON_GREEN_BORDER);
exports.BUTTON_BLUE_STYLES = (0, exports.generateButton)(exports.BUTTON_BLUE_BACKGROUND, exports.BUTTON_BLUE_BORDER);
exports.BUTTON_ORANGE_STYLES = (0, exports.generateButton)(exports.BUTTON_ORANGE_BACKGROUND, exports.BUTTON_ORANGE_BORDER);
exports.BUTTON_GREEN_DARK_STYLES = (0, exports.generateButton)(exports.BUTTON_GREEN_DARK_BACKGROUND, exports.BUTTON_GREEN_DARK_BORDER);
exports.BUTTON_RED_STYLES = (0, exports.generateButton)(exports.BUTTON_RED_BACKGROUND, exports.BUTTON_RED_BORDER);
exports.BUTTON_PURPLE_STYLES = (0, exports.generateButton)(exports.BUTTON_PURPLE_BACKGROUND, exports.BUTTON_PURPLE_BORDER);
exports.BUTTON_GRAY_STYLES = (0, exports.generateButton)(exports.BUTTON_GRAY_BACKGROUND, exports.BUTTON_GRAY_BORDER);
exports.BUTTON_GRAY_DARK_STYLES = (0, exports.generateButton)(exports.BORDER_GRAY, exports.BORDER_GRAY);
exports.BUTTON_VAULT_GRAY_STYLES = (0, exports.generateButton)("#666666", "gray");
exports.BUTTON_VAULT_YELLOW_STYLES = (0, exports.generateButton)("#999900", "#CCCC00", "dashed");
exports.BUTTON_VAULT_BLUE_STYLES = (0, exports.generateButton)("#0E7CA6", "#33C7FF");


/***/ }),

/***/ 2279:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateGuess = exports.applyGuess = exports.getPossibleDigits = exports.couldHaveDigit = exports.hasDigit = exports.canSolve = exports.generateDigitInfo = exports.isCorrect = exports.Hint = void 0;
const array_1 = __webpack_require__(5818);
var Hint;
(function (Hint) {
    Hint["NONE"] = "\u274C";
    Hint["CORRECT"] = "\u2705";
    Hint["CLOSE"] = "\uD83D\uDFE7";
})(Hint || (exports.Hint = Hint = {}));
const isCorrect = (hints) => hints.every((h) => h === Hint.CORRECT);
exports.isCorrect = isCorrect;
const generateDigitInfo = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => ({
    correctPositions: [],
    possiblePositions: [0, 1, 2, 3],
    digit,
}));
exports.generateDigitInfo = generateDigitInfo;
const canSolve = (info) => {
    const correctPositions = [];
    for (const digitInfo of info) {
        if (digitInfo.correctPositions.length > 0) {
            correctPositions.push(...digitInfo.correctPositions);
        }
    }
    return correctPositions.length === 4;
};
exports.canSolve = canSolve;
const hasDigit = (info) => info.correctPositions.length > 0 ||
    (info.possiblePositions.length > 0 && info.possiblePositions.length < 4);
exports.hasDigit = hasDigit;
const couldHaveDigit = (info) => info.correctPositions.length > 0 || info.possiblePositions.length > 0;
exports.couldHaveDigit = couldHaveDigit;
const getPossibleDigits = (info, position) => {
    const uncalledDigits = [];
    const calledDigits = [];
    for (const digitInfo of info) {
        if (digitInfo.correctPositions.includes(position)) {
            return [digitInfo.digit];
        }
        if ((0, exports.couldHaveDigit)(digitInfo) &&
            digitInfo.possiblePositions.includes(position)) {
            if (digitInfo.correctPositions.length === 0) {
                uncalledDigits.push(digitInfo.digit);
            }
            else {
                calledDigits.push(digitInfo.digit);
            }
        }
    }
    return [...uncalledDigits, ...calledDigits];
};
exports.getPossibleDigits = getPossibleDigits;
const applyGuess = (info, guess, hints) => {
    for (const [position, digit] of guess.entries()) {
        const digitInfo = info[digit];
        switch (hints[position]) {
            case Hint.CORRECT: {
                digitInfo.correctPositions.push(position);
                digitInfo.possiblePositions = digitInfo.possiblePositions.filter((p) => p !== position);
                break;
            }
            case Hint.CLOSE: {
                digitInfo.possiblePositions = digitInfo.possiblePositions.filter((p) => p !== position);
                break;
            }
            case Hint.NONE: {
                digitInfo.possiblePositions = [];
                break;
            }
        }
    }
    const confirmedDigits = [];
    for (const digitInfo of info) {
        if (confirmedDigits.length === 4) {
            digitInfo.correctPositions = [];
            digitInfo.possiblePositions = [];
        }
        else if ((0, exports.hasDigit)(digitInfo)) {
            confirmedDigits.push(digitInfo.digit);
        }
    }
    return info;
};
exports.applyGuess = applyGuess;
const generateGuess = (info, guessIndex) => {
    if (guessIndex === 0) {
        return [0, 1, 2, 3];
    }
    if (guessIndex === 1) {
        return [4, 5, 6, 7];
    }
    const guess = guessIndex === 2 ? [8, 9] : [];
    while (guess.length < 4) {
        const position = guess.length;
        const possibilities = (0, exports.getPossibleDigits)(info, position);
        guess[position] = (() => {
            for (const digit of possibilities) {
                if (!guess.includes(digit)) {
                    return digit;
                }
            }
            return (0, array_1.getRandom)(possibilities);
        })();
    }
    return guess;
};
exports.generateGuess = generateGuess;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(6217);
/******/ 	
/******/ })()
;
//# sourceMappingURL=farmrpg-farmhand.user.js.map