/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/Core.ts
const debugMode = true;
function debug(message) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (debugMode)
        console.log(message);
}
/** Inherit from this class if you want to ensure your type won't be assignable to other types with identical structure (and vice-versa). */
class Distinct {
}
function warnAlert(message) {
    message = `Better otservlist error:\n${message}`;
    console.warn(message);
    alert(message);
}
function as(obj, type) {
    return obj instanceof type
        ? obj
        : undefined;
}
function cast(obj, type) {
    if (obj instanceof type)
        return obj;
    else
        throw new Error(`Could not cast an object of type ${typeof (obj)} to ${type.constructor.name}.`);
}
function assertNotNull(obj, errorMessage = "Object is null!") {
    if (obj === null)
        throw new Error(errorMessage);
    else
        return obj;
}
function assertDefined(obj, errorMessage = "Object is undefined!") {
    if (obj === undefined)
        throw new Error(errorMessage);
    else
        return obj;
}
function ofType(items, type) {
    const filteredItems = [];
    for (const item of items) {
        if (item instanceof type)
            filteredItems.push(item);
    }
    return filteredItems;
}
function withoutUndefined(items) {
    const filteredItems = [];
    for (const item of items) {
        if (item !== undefined)
            filteredItems.push(item);
    }
    return filteredItems;
}
function withoutNulls(items) {
    const filteredItems = [];
    for (const item of items) {
        if (item !== null)
            filteredItems.push(item);
    }
    return filteredItems;
}
function safeQuerySelector(node, selector) {
    const foundElement = node.querySelector(selector);
    if (foundElement === null)
        throw new Error(`${selector} not found!`);
    else
        return foundElement;
}
function tryParseInt(str) {
    const num = parseInt(str);
    return isNaN(num)
        ? undefined
        : num;
}
function tryParseFloat(str) {
    const num = parseFloat(str);
    return isNaN(num)
        ? undefined
        : num;
}
function tryParseNullableFloat(str) {
    return str === ""
        ? null
        : tryParseFloat(str);
}
function asString(number) {
    return number?.toString() ?? "";
}
function edit(obj, action) {
    action(obj);
    return obj;
}
function last(array) {
    return array[array.length - 1];
}
function lazy(getter) {
    let value;
    let isValueCreated = false;
    return () => {
        if (!isValueCreated) {
            value = getter();
            isValueCreated = true;
        }
        return value;
    };
}
/** min/max == null: any non-null value is fine | value == null: value never fulfills condition, unless both min and max are null */
function withinRange(valueFunc, minFunc, maxFunc) {
    let value, min, max;
    return ((min = minFunc()) === null || ((value = valueFunc()) !== null && min <= value))
        && ((max = maxFunc()) === null || ((value = valueFunc()) !== null && value <= max));
}

;// ./src/UI.ts

function withClass(element, className) {
    element.className = className;
    return element;
}
function addStyle(cssCode) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `${cssCode}`;
    assertDefined(document.getElementsByTagName("head")[0]).appendChild(style);
    return style;
}
function div(...nodes) {
    const div = document.createElement("div");
    div.append(...withoutUndefined(nodes));
    return div;
}
function label(text, content) {
    const label = document.createElement("label");
    label.textContent = text;
    if (content !== undefined)
        label.insertBefore(content, label.firstChild);
    return label;
}
function UI_checkbox(boolProperty, settingApplier) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = boolProperty.get();
    checkbox.addEventListener("change", () => {
        boolProperty.set(checkbox.checked);
        settingApplier.apply();
    });
    return checkbox;
}
function numberInput(numberProperty, settingApplier) {
    const numberInput = document.createElement("input");
    numberInput.type = "number";
    numberInput.min = "0";
    numberInput.size = 8;
    numberInput.value = asString(numberProperty.get());
    numberInput.addEventListener("change", () => {
        const number = assertDefined(tryParseNullableFloat(numberInput.value));
        numberProperty.set(number);
        settingApplier.apply();
    });
    return numberInput;
}
function enumSingleSelect(enum_, enumProperty, settingApplier) {
    const singleSelect = document.createElement("select");
    const chosenValue = enumProperty.get();
    for (const enumValue of enum_.all()) {
        const option = new Option(
        /* text: */ enumValue.description, 
        /* value: */ enumValue.id, 
        /* defaultSelected: */ undefined, 
        /* selected: */ enumValue == chosenValue);
        singleSelect.add(option);
    }
    singleSelect.addEventListener("change", () => {
        const enumValue = assertDefined(enum_.byId(singleSelect.value));
        enumProperty.set(enumValue);
        settingApplier.apply();
    });
    return singleSelect;
}

;// ./src/Enum.ts

class EnumValue extends Distinct {
    constructor(id, description) {
        super();
        this.id = id;
        this.description = description;
    }
}
class Enum {
    constructor(type) {
        this._dictionary = null;
        this._type = type;
    }
    /** Key is the enum value's id, not property's name! */
    _getDictionary() {
        if (this._dictionary === null) {
            this._dictionary = {};
            const values = ofType(Object.values(this), this._type);
            for (const value of values)
                this._dictionary[value.id] = value;
        }
        return this._dictionary;
    }
    all() {
        return Object.values(this._getDictionary());
    }
    byId(id) {
        return this._getDictionary()[id];
    }
}

;// ./src/ServerSorts.ts

class ServerPropertyForSorting {
    constructor(getter, highestFirst) {
        this._getter = getter;
        this._highestFirst = highestFirst;
    }
    /** -1: show s1 first, 1: show s2 first */
    compareFn() {
        return (s1, s2) => {
            const s1Value = this._getter(s1);
            const s2Value = this._getter(s2);
            let result;
            if (s1Value > s2Value)
                result = this._highestFirst ? -1 : 1;
            else if (s1Value < s2Value)
                result = this._highestFirst ? 1 : -1;
            else
                result = 0;
            return result;
        };
    }
}
class ServerSort extends EnumValue {
    constructor(id, description, propertyForSorting) {
        super(id, description);
        this.propertyForSorting = propertyForSorting;
    }
}
class _ServerSorts extends Enum {
    constructor() {
        super(...arguments);
        this.Default = new ServerSort("Default", "(default)", null);
        this.DateAddedNewestFirst = new ServerSort("DateAddedNewestFirst", "Date added (newest first)", new ServerPropertyForSorting(s => s.id(), true));
        this.DateAddedOldestFirst = new ServerSort("DateAddedOldestFirst", "Date added (oldest first)", new ServerPropertyForSorting(s => s.id(), false));
        this.ExpRateHighestFirst = new ServerSort("ExpRateHighestFirst", "Exp rate (highest first)", new ServerPropertyForSorting(s => s.expRate(), true));
        this.ExpRateLowestFirst = new ServerSort("ExpRateLowestFirst", "Exp rate (lowest first)", new ServerPropertyForSorting(s => s.expRate(), false));
        this.PlayerCountNowHighestFirst = new ServerSort("PlayerCountNowHighestFirst", "Players now (highest first)", new ServerPropertyForSorting(s => s.playerCount().now ?? -1, true));
        this.PlayerCountNowLowestFirst = new ServerSort("PlayerCountNowLowestFirst", "Players now (lowest first)", new ServerPropertyForSorting(s => s.playerCount().now ?? -1, false));
        this.UptimeHighestFirst = new ServerSort("UptimeHighestFirst", "Uptime (highest first)", new ServerPropertyForSorting(s => s.uptimePercent(), true));
        this.UptimeLowestFirst = new ServerSort("UptimeLowestFirst", "Uptime (lowest first)", new ServerPropertyForSorting(s => s.uptimePercent(), false));
        this.PointsHighestFirst = new ServerSort("PointsHighestFirst", "Points (highest first)", new ServerPropertyForSorting(s => s.points() ?? -1, true));
        this.PointsLowestFirst = new ServerSort("PointsLowestFirst", "Points (lowest first)", new ServerPropertyForSorting(s => s.points() ?? 1, false));
        this.VersionNewestFirst = new ServerSort("VersionNewestFirst", "Version (newest first)", new ServerPropertyForSorting(s => s.clientVersion() ?? -1, true));
        this.VersionOldestFirst = new ServerSort("VersionOldestFirst", "Version (oldest first)", new ServerPropertyForSorting(s => s.clientVersion() ?? -1, false));
    }
}
const ServerSorts = new _ServerSorts(ServerSort);
/* harmony default export */ const src_ServerSorts = (ServerSorts);

;// ./src/Settings.ts


class StoredVariable {
    constructor(key, defaultValue) {
        //if (this._allKeys.has(key))
        //    throw new Error(`There is already a StoredVariable with key "${key}"!`);
        //this._allKeys.add(key);
        /** @readonly */
        this.key = key;
        /** @readonly */
        this.defaultValue = defaultValue;
    }
    //private readonly _allKeys: Set<string> = new Set<string>();
    get() {
        const storedString = localStorage.getItem(this.key);
        if (storedString === null) // No stored value
            return this.defaultValue;
        const deserializedValue = this.deserialize(storedString);
        if (deserializedValue === undefined) // Stored string couldn't be deserialized.
         {
            console.warn(`Found value "${storedString}" for ${this.key}, but it couldn't be deserialized. Returning default value.`);
            return this.defaultValue;
        }
        else
            return deserializedValue;
    }
    set(value) {
        localStorage.setItem(this.key, this.serialize(value));
    }
}
class StoredBool extends StoredVariable {
    serialize(value) {
        return value ? "1" : "0";
    }
    deserialize(storedString) {
        return (storedString === "1"
            ? true
            : storedString === "0"
                ? false
                // Else
                : undefined);
    }
}
class StoredNumber extends StoredVariable {
    serialize(value) {
        return asString(value);
    }
    deserialize(storedString) {
        return tryParseNullableFloat(storedString);
    }
}
class StoredEnum extends StoredVariable {
    constructor(enum_, key, defaultValue) {
        super(key, defaultValue);
        this._enum = enum_;
    }
    serialize(value) {
        return value.id;
    }
    deserialize(storedString) {
        return this._enum.byId(storedString);
    }
}
class Settings {
}
Settings.hideAds = new StoredBool("hideAds", false);
Settings.unpromoteServers = new StoredBool("unpromoteServer", false); // Hides "Starting soon", "Show promoted servers" and removes the yellow highlight from promoted servers.
Settings.showOfflineServers = new StoredBool("showOfflineServers", true);
Settings.minExpRate = new StoredNumber("minExpRate", null);
Settings.maxExpRate = new StoredNumber("maxExpRate", null);
Settings.minVersion = new StoredNumber("minVersion", null);
Settings.maxVersion = new StoredNumber("maxVersion", null);
Settings.minPlayerCountNow = new StoredNumber("minPlayerCountNow", null);
Settings.maxPlayerCountNow = new StoredNumber("maxPlayerCountNow", null);
Settings.sortBy = new StoredEnum(src_ServerSorts, "sortBy", src_ServerSorts.Default);

;// ./src/SettingAppliers.ts


class SettingApplier {
    constructor() {
        this.hiddenElements = [];
    }
    hide(htmlElement) {
        if (htmlElement !== null && htmlElement !== undefined) {
            htmlElement.hidden = true;
            this.hiddenElements.push(htmlElement);
        }
    }
    hideIfHtmlElement(element) {
        if (element instanceof HTMLElement)
            this.hide(element);
    }
    undoHidingElements() {
        for (const element of this.hiddenElements)
            element.hidden = false;
        this.hiddenElements = [];
    }
}
class HideAds extends SettingApplier {
    apply() {
        if (Settings.hideAds.get()) {
            // All pages
            this.hideIfHtmlElement(document.querySelector("#homeboxes"));
            // Servlist pages
            this.hideIfHtmlElement(document.querySelector("#banner_cont"));
            // Specific server pages
            const serverAboutTable = as(document.querySelector("#serverabout"), HTMLTableElement);
            if (serverAboutTable !== undefined) {
                const probablyAdBannerRow = as(serverAboutTable.tBodies[0]?.children[0], HTMLTableRowElement);
                const probablyAdBannerLink = as(probablyAdBannerRow?.querySelector("a"), HTMLAnchorElement);
                if (probablyAdBannerLink?.href.includes("/adv/") === true)
                    this.hide(probablyAdBannerRow);
                document.querySelectorAll("#summary_banner").forEach(banner => { this.hideIfHtmlElement(banner); });
                const serverIpLink = as(document.querySelector("#content")?.querySelector(".servname")?.querySelector("a"), HTMLAnchorElement);
                if (serverIpLink !== undefined) {
                    debug("serverIpLink");
                    debug(serverIpLink.text);
                    const ip = serverIpLink.text.match(/(.*):/)?.[1];
                    if (ip !== undefined)
                        serverIpLink.href = `http://${ip}`;
                }
            }
        }
        else
            this.undoHidingElements();
    }
}
class UnpromoteServers extends SettingApplier {
    constructor(servers) {
        super();
        this._unpromotedServers = [];
        this._servers = servers;
    }
    apply() {
        if (Settings.unpromoteServers.get()) {
            const contentChildren = document.querySelector("#content")?.children;
            if (contentChildren === undefined) {
                console.warn("Unpromoting servers failed because an element with id 'content' wasn't found.");
                return;
            }
            const startingSoonServlist = as(contentChildren[0], HTMLTableElement);
            const firstBr = as(contentChildren[1], HTMLBRElement);
            const secondBr = as(contentChildren[2], HTMLBRElement);
            const showPromotedServersBar = as(contentChildren[3], HTMLDivElement);
            const thirdBr = as(contentChildren[4], HTMLBRElement);
            if (startingSoonServlist !== undefined && startingSoonServlist.id == "servlist") {
                this.hide(startingSoonServlist);
                this.hide(firstBr);
                this.hide(secondBr);
            }
            if (showPromotedServersBar !== undefined && showPromotedServersBar.className == "promoted_bar") {
                this.hide(showPromotedServersBar);
                this.hide(thirdBr);
            }
            for (const promotedServer of this._servers.filter(s => s.element.id == "prom")) {
                promotedServer.element.id = "s";
                this._unpromotedServers.push(promotedServer);
            }
        }
        else {
            this.undoHidingElements();
            for (const unpromotedServer of this._unpromotedServers)
                unpromotedServer.element.id = "prom";
            this._unpromotedServers = [];
        }
    }
}
class FilterAndSortServers extends SettingApplier {
    constructor(servers, mainServlist) {
        super();
        this._servers = servers;
        this._mainServlist = mainServlist;
    }
    apply() {
        const filteredServers = [];
        const minExpRate = lazy(() => Settings.minExpRate.get());
        const maxExpRate = lazy(() => Settings.maxExpRate.get());
        const minVersion = lazy(() => Settings.minVersion.get());
        const maxVersion = lazy(() => Settings.maxVersion.get());
        const minPlayerCountNow = lazy(() => Settings.minPlayerCountNow.get());
        const maxPlayerCountNow = lazy(() => Settings.maxPlayerCountNow.get());
        const showOfflineServers = lazy(() => Settings.showOfflineServers.get());
        for (const server of this._servers) {
            const criteriaFulfilled = withinRange(server.expRate, minExpRate, maxExpRate)
                && withinRange(server.clientVersion, minVersion, maxVersion)
                && withinRange(() => server.playerCount().now, minPlayerCountNow, maxPlayerCountNow)
                && (showOfflineServers() || server.isOnline());
            if (criteriaFulfilled)
                filteredServers.push(server);
        }
        const propertyForSorting = Settings.sortBy.get().propertyForSorting;
        const mainServlistBody = safeQuerySelector(this._mainServlist, "tbody");
        const mainServlistHeader = assertNotNull(mainServlistBody.firstChild);
        let newServers = filteredServers;
        if (propertyForSorting !== null)
            newServers = newServers.sort(propertyForSorting.compareFn());
        mainServlistBody.replaceChildren(...[mainServlistHeader].concat(newServers.map(server => server.element)));
    }
}

;// ./src/Server.ts

class PlayerCount {
    constructor(now, highestEver, limit) {
        this.now = now;
        this.highestEver = highestEver;
        this.limit = limit;
    }
}
class Server {
    constructor(serverElement) {
        //let flagUrl = server.children[0].querySelector('img').src;
        //let ip = server.children[1].childNodes[0].text;
        this.id = lazy(() => this.parseServerProperty("otservlistUrl", cast(this.element.children[1]?.firstChild, HTMLAnchorElement).href, // e.g. "https://otservlist.org/ots/1234567"
        // e.g. "https://otservlist.org/ots/1234567"
        str => tryParseInt(last(str.split("ots/")) ?? ""))); // e.g. 1234567
        // childNodes[2] isn't useful
        //let serverName = server.children[3].childNodes[0].data;
        this.playerCount = lazy(() => this.parseServerProperty("playerCountString", this.element.children[4]?.textContent, // e.g. "8 (13) / 100" or "?? (13) / ??"
        // e.g. "8 (13) / 100" or "?? (13) / ??"
        str => {
            const regExpMatchArray = str.match(/(\d+|\?\?) \((\d+)\) \/ (\d+|\?\?)/);
            // We skip result 0 because it contains entire string.
            const nowString = regExpMatchArray?.[1]; // e.g. "8" or "??"
            const highestEverString = regExpMatchArray?.[2]; // e.g. "13" 
            const limitString = regExpMatchArray?.[3]; // e.g. "100" or "??"
            if (nowString === undefined || highestEverString === undefined || limitString === undefined)
                return undefined;
            const now = nowString == "??" ? null : tryParseInt(nowString);
            const highestEver = tryParseInt(highestEverString);
            const limit = limitString == "??" ? null : tryParseInt(limitString);
            if (now === undefined || highestEver === undefined || limit === undefined)
                return undefined;
            return new PlayerCount(now, highestEver, limit);
        }));
        this.uptimePercent = lazy(() => this.parseServerProperty("uptimeString", this.element.children[5]?.textContent, // e.g. "99.80%"
        // e.g. "99.80%"
        str => tryParseFloat(str))); // e.g. 99.80
        this.points = lazy(() => this.parseServerProperty("pointsString", this.element.children[6]?.textContent, // e.g. "120" or "??"
        // e.g. "120" or "??"
        str => tryParseInt(str) ?? (str == "??" ? null : undefined))); // e.g. 120 or null
        this.expRate = lazy(() => this.parseServerProperty("expRateString", this.element.children[7]?.textContent, // e.g. "x1.5"
        // e.g. "x1.5"
        str => tryParseFloat(str.substring(1)))); // e.g. 1.5)
        //let serverType = server.children[8].childNodes[0].data;
        this.clientVersion = lazy(() => this.parseServerProperty("clientVersionString", this.element.children[9]?.textContent, // e.g. "[ 8.54 ]" or "[ n/a ]"
        // e.g. "[ 8.54 ]" or "[ n/a ]"
        str => {
            const innerClientVersionString = str.slice(2, -2); // e.g. "8.54" or "n/a"
            // return: e.g. 8.54 or null
            return innerClientVersionString == "n/a"
                ? null
                : tryParseFloat(innerClientVersionString);
        }));
        this.element = serverElement;
    }
    isOnline() {
        return this.points() !== null;
    }
    parseServerProperty(stringToParseName, stringToParse, tryParseAction) {
        stringToParse = assertNotNull(assertDefined(stringToParse));
        return assertDefined(tryParseAction(stringToParse), `${stringToParseName} = "${stringToParse}": Incorrect format!`);
    }
}
/* harmony default export */ const src_Server = (Server);

;// ./src/_main.ts
// ==UserScript==
// @name         Better otservlist.org
// @namespace    BetterOtservlist
// @version      0.7.6
// @description  Improves the display of servers on otservlist.org. Example features include filtering, sorting, hiding ads, and displaying all servers on one large page.
// @author       Wirox
// @match        https://otservlist.org/*
// @match        https://*.otservlist.org/*
// @match        http://otservlist.org/*
// @match        http://*.otservlist.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482134/Better%20otservlistorg.user.js
// @updateURL https://update.greasyfork.org/scripts/482134/Better%20otservlistorg.meta.js
// ==/UserScript==







// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
    try {
        await main();
    }
    catch (error) {
        const errorMessage = error instanceof Error
            ? `BetterOtservlist error:\n${error.message}`
            : "BetterOtservlist error:\nUnknown error";
        alert(errorMessage);
        throw error;
    }
})();
async function main() {
    const hideAds = new HideAds();
    hideAds.apply();
    const servlistsOnThisPage = Array.from(document.querySelectorAll("#servlist"));
    const mainServlist = last(servlistsOnThisPage); // We get the last servList because if there are two, the first one is only promotional.
    if (mainServlist === undefined)
        return; // If there are no servlists, the plugin isn't supposed to do anything besides possibly hiding ads.
    // If the search includes the 'allServers' parameter, we transform it into a page with all servers.
    const showAllServers = new URLSearchParams(window.location.search).has("allServers");
    if (showAllServers) {
        document.title = "otservlist.org - All servers";
        safeQuerySelector(safeQuerySelector(document, "#content"), "#title").textContent = "All servers";
        const mainServlistBody = safeQuerySelector(mainServlist, "tbody");
        mainServlistBody.replaceChildren(assertNotNull(mainServlistBody.firstChild)); // We show an empty list (first child is the header) while we load all servers.
    }
    let loader;
    if (showAllServers) {
        addStyle(`
            .loader
            {
                position: fixed;
                margin: auto;
                top: -10%;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 2;
                width: 80px;
                padding: 12px;
                aspect-ratio: 1;
                border-radius: 50%;
                background: #2a5872;
                --_m: 
                    conic-gradient(#0000 10%,#000),
                    linear-gradient(#000 0 0) content-box;
                -webkit-mask: var(--_m);
                mask: var(--_m);
                -webkit-mask-composite: source-out;
                mask-composite: subtract;
                animation: l3 1s infinite linear;
            }
            @keyframes l3 {to{transform: rotate(1turn)}}
        `);
        loader = withClass(div(), "loader");
        safeQuerySelector(document, "body").appendChild(loader);
    }
    const servlists = showAllServers
        ? await getAllServlists()
        : [mainServlist];
    const serverElements = [];
    for (const servlist of servlists) {
        serverElements.push(...Array.from(servlist.querySelectorAll("#s"))); // Regular servers
        serverElements.push(...Array.from(servlist.querySelectorAll("#prom"))); // Promoted servers
    }
    const servers = serverElements.filter(e => e.children.length == 10).map(e => new src_Server(e));
    const unpromoteServers = new UnpromoteServers(servers);
    unpromoteServers.apply();
    const filterAndSortServers = new FilterAndSortServers(servers, mainServlist);
    filterAndSortServers.apply();
    addUIBeforeElement(document.querySelector(".pager") ?? mainServlist, showAllServers, hideAds, unpromoteServers, filterAndSortServers);
    loader?.remove();
}
function addUIBeforeElement(element, showAllServers, hideAds, unpromoteServers, filterAndSortServers) {
    const center = document.createElement("center");
    const divs = [];
    const expRateDiv = div(label("Exp rate: "), numberInput(Settings.minExpRate, filterAndSortServers), " – ", numberInput(Settings.maxExpRate, filterAndSortServers));
    divs.push(expRateDiv);
    const versionDiv = div(label("Version: "), numberInput(Settings.minVersion, filterAndSortServers), " – ", numberInput(Settings.maxVersion, filterAndSortServers));
    divs.push(versionDiv);
    const playerCountNowDiv = div(label("Players now: "), numberInput(Settings.minPlayerCountNow, filterAndSortServers), " – ", numberInput(Settings.maxPlayerCountNow, filterAndSortServers));
    divs.push(playerCountNowDiv);
    const sortByDiv = div(label("Sort by: "), enumSingleSelect(src_ServerSorts, Settings.sortBy, filterAndSortServers));
    divs.push(sortByDiv);
    const checkboxesDiv = div(label("Hide ads", UI_checkbox(Settings.hideAds, hideAds)), label("Unpromote servers", UI_checkbox(Settings.unpromoteServers, unpromoteServers)), showAllServers
        ? label("Show offline servers", UI_checkbox(Settings.showOfflineServers, filterAndSortServers))
        : undefined);
    divs.push(checkboxesDiv);
    if (!showAllServers) {
        const allServersLinkDiv = div(edit(document.createElement("a"), a => {
            a.href = "/search/5c7a8d09ac62611ea14b103e54b7a53b?allServers=true"; // Used to be 000[...] but for some reason that stopped working.
            a.textContent = "All servers";
        }));
        divs.push(allServersLinkDiv);
    }
    center.append(...divs);
    element.insertAdjacentElement("beforebegin", center);
}
async function getAllServlists() {
    const domParser = new DOMParser();
    const links = [
        "/search/5c7a8d09ac62611ea14b103e54b7a53b", // PVP
        "/search/bde9f97e98ae103e3ba4317f3567f4f7", // nPVP
        "/search/f495a91e7b674d49a59594ba016d061e", // PVPe
        "/search/58aad7c689271c21017df46ca43f2388", // WAR
        "/search/32f3ac635aa8045e6f6241ea14019e85", // FUN
    ];
    const promises = [];
    for (const link of links) {
        const promise = fetch(link).then(response => response.text()).catch(() => null);
        promises.push(promise);
    }
    return Promise.all(promises)
        .then(responseTexts => {
        const servLists = [];
        for (const responseText of withoutNulls(responseTexts))
            servLists.push(...Array.from(domParser.parseFromString(responseText, "text/html").querySelectorAll("#servlist")));
        if (responseTexts.filter(text => text === null).length > 0)
            warnAlert("Couldn't load some servers. Try refreshing the page.");
        return servLists;
    })
        .catch(() => {
        warnAlert("Couldn't load any servers. Try refreshing the page.");
        return [];
    });
}

/******/ })()
;