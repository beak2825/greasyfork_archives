// ==UserScript==
// @name         Twatter Feed Doctor
// @namespace    http://tampermonkey.net/
// @version      2025.09.19.4
// @description  Enhance your X (Twitter) experience with Twat Doc: a powerful userscript featuring customizable content filters to hide spam, foreign languages, they/them lib content (🏳️‍⚧️, 🏳‍🌈, 🍉, 💉, etc), and low-quality posts; automuting based on user scores; visual tweaks like relative timestamps, larger buttons, and direct video links to view videos with your brower's native player
// @author       https://x.com/topkektweeter
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536637/Twatter%20Feed%20Doctor.user.js
// @updateURL https://update.greasyfork.org/scripts/536637/Twatter%20Feed%20Doctor.meta.js
// ==/UserScript==
(function() {let logEl;

//logEl = true

window.navigation.addEventListener("navigate", (event) => {
    //clogdebug(event);
    nextUrl = new URL(event.destination.url);
    checkUrlChange();
})

let prevUrl;
let nextUrl = window.location;
let globalDebugMode = false;

checkUrlChange();

function checkUrlChange() {
    let decoded = decodeURI(nextUrl.href);
    if (decoded !== prevUrl) {
        setGlobals();
    }
    prevUrl = decoded;
}

function setGlobals() {
    if (nextUrl == null) nextUrl = window.location;
    let usp = new URLSearchParams(nextUrl.search);
    let debugFlag = usp.get("debug");
    if (debugFlag) globalDebugMode = debugFlag === "1";
}

const MutationCrudType = {
    Add: "add",
    Remove: "remove"
};

function observe(targetNode, onObserve, options) {
    let state = { abort: false };
    options ??= {};
    options.nodeTypes ??= [Node.ELEMENT_NODE];

    if (typeof targetNode === "string") {
        targetNode = document.querySelector(targetNode);
    }

    const callback = function (mutationsList, observer) {
        let _targetNode = targetNode;
        for (const mutation of mutationsList) {
            //let nodeUpdates = [
            //    { nodes: mutation.addedNodes, crud: MutationCrudType.Add },
            //    { nodes: mutation.removedNodes, crud: MutationCrudType.Remove },
            //];

            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    clogdebug(node);

                    if (!options.nodeTypes.includes(node.nodeType)) {
                        continue;
                    }

                    onObserve(mutation, node, MutationCrudType.Add, state);                    

                    if (state.abort) {
                        observer.disconnect();
                        return;
                    }
                }
                for (const node of mutation.removedNodes) {
                    clogdebug(node);

                    if (!options.nodeTypes.includes(node.nodeType)) {
                        continue;
                    }

                    onObserve(mutation, node, MutationCrudType.Remove, state);

                    if (state.abort) {
                        observer.disconnect();
                        return;
                    }
                }
            }
        }
    }

    const config = { attributes: false, childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

function observe1(targetNode, onObserve, options) {
    let state = { abort: false };
    options ??= {};
    options.nodeTypes ??= [Node.ELEMENT_NODE];

    if (typeof targetNode === "string") {
        targetNode = document.querySelector(targetNode);
    }

    const callback = function (mutationsList, observer) {
        let _targetNode = targetNode;
        for (const mutation of mutationsList) {
            for (const element of mutation.addedNodes) {
                if (globalDebugMode) console.log(element);
                if (!options.nodeTypes.includes(element.nodeType)) {
                    continue;
                }
                onObserve(mutation, element, state);

                if (state.abort) {
                    observer.disconnect();
                    return;
                }
            }
        }
    }

    const config = { attributes: false, childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

function waitUntilScrolled(el, options) {
    return new Promise(res => {
        let observer = new IntersectionObserver(entries => {
            let sects = entries.filter(x => x.isIntersecting);
            if (sects.length > 0) {
                if (sects.length === 1) {
                    res(sects[0].target);
                } else {
                    res(sects.map(x => x.target));
                }

                observer.disconnect();
            }
        }, options ?? { root: null, threshold: 0.5 });
        observer.observe(el);
    });
}

function waitUntilScrolled1(element, options = {}) {
    if (!(element instanceof Element)) {
        return Promise.reject(new Error('First argument must be a DOM element'));
    }

    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observerOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        resolve(entry.target);
                        observer.disconnect(); // Clean up immediately
                    }
                });
            }, observerOptions);

            observer.observe(element);

            const timeout = setTimeout(() => {
                observer.disconnect();
                reject(new Error('Intersection observation timed out'));
            }, 30000);

            resolve.then(() => clearTimeout(timeout));
        } catch (error) {
            reject(new Error(`Observer creation failed: ${error.message}`));
        }
    });
}

function clogdebug(m) {
    if (globalDebugMode) clog(m);
}

function clog(m) {
    if (typeof m === "object") {
        logClean(m);
        //console.log(m);
    } else {
        logClean(`${makeid(5)} ${m}`);
        //console.log(`${makeid(5)} ${m}`);
    }
}

function logClean(...params) {
    setTimeout(console.log.bind(console, ...params), 0);
    //queueMicrotask(console.log.bind(console, msg));
}

function waitUntil(conditionFn, interval = 500, maxTries = 10) {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        function checkCondition() {
            attempts++;
            let result;

            try {
                result = conditionFn();
            } catch (error) {
                console.warn(`Condition check threw an error: ${error.message}`);
            }

            if (result) {
                clogdebug(`Condition met after ${attempts} attempts`);
                resolve(result);
                return true;
            }

            if (attempts >= maxTries) {
                clogdebug(`Max tries (${maxTries}) exceeded`);
                reject(new Error(`Condition not met after ${maxTries} attempts`));
                return true;
            }

            clogdebug(`Attempt ${attempts}/${maxTries}: not true yet`);
            return false;
        }

        if (checkCondition()) return;

        const intervalId = setInterval(() => {
            if (checkCondition()) {
                clearInterval(intervalId);
            }
        }, interval);
    });
}

function _waitUntil(isTrue, interval, tries) {
    const id = makeid(5);

    function TryIt() {
        let ret;
        try {
            ret = isTrue();
            tries++;
        } catch { }

        if (!ret) console.log(`${id}: not true yet`);
        return ret;
    }

    var p = new Promise((resolve, reject) => {
        let ret = TryIt();
        if (ret) {
            resolve(ret);
        } else {
            var isTrueHandle = window.setInterval(function () {
                ret = TryIt();
                if (ret) {
                    window.clearInterval(isTrueHandle);
                    console.log(`${id}: cleared interval`);
                    resolve(ret);
                }
            }, interval || 500);
        }
    });

    return p;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function doEl(node, sel, onFound) {
    var els = node.querySelectorAll(sel);
    if (els) {
        els.forEach(el => {
            onFound(el);
        });
    }
}

function waitForElement(targetNode, sel, elementFound) {
    var els = targetNode.querySelectorAll(sel);
    if (els) {
        els.forEach(el => {
            elementFound(el);
        });
    }
    observe(targetNode, function (m, el, s) {
        var e;
        if (
            el.nodeName[0] !== "#" &&
            (el.matches(sel) || (e = el.querySelector(sel)))
        ) {
            elementFound(e ? e : el);
            return;
        }
    });
}

function displayNone(el) {
    if (!el) return;
    el.style.display = 'none';
}

function hideEl(el) {
    if (!el) return;
    el.style.visibility = 'hidden';
}

function dimEl(el, opacity) {
    el.style.opacity = opacity ?? "10%";
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

Array.prototype.sum = function (selector) {
    if (this.length === 0) return 0;
    let sum = 0;
    this.forEach(x => sum += selector ? selector(x) : x);
    return sum;
};

Array.prototype.concatArrays = function () {
    let carrs = this.filter(x => x).reduce((a, b) => a.concat(b));
    return carrs;
}

function isElementInViewport(element) {
    if (!element || !document.contains(element) || getComputedStyle(element).display === 'none') {
        return false; // Detached, missing, or hidden
    }
    const rect = element.getBoundingClientRect();
    // Also check for non-zero size to exclude collapsed/hidden cases
    if (rect.width <= 0 || rect.height <= 0) {
        return false;
    }
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isElementInViewport1(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function forEachObjectEntry(obj, kvSelector) {
    let results = [];
    for (const [key, value] of Object.entries(obj)) {
        results.push(kvSelector(key, value));
    }
    return results;
}

function wiff(obj, wiffer) {
    return wiffer(obj);
}

function isNullish(value) {
    return value === null || value === undefined;
}

function customStringify(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return JSON.stringify(obj);
    }
    const entries = Object.entries(obj).map(([key, value]) => {
        return `${key}:${customStringify(value)}`;
    });
    return `{${entries.join(',')}}`;
}

function getAllIndices(str, substr, caseInsensitive = false) {
    const regex = new RegExp(
        substr.replace(/[.*+?^${}()|[\]\\]/g, '\\$'),
        caseInsensitive ? 'gi' : 'g'
    );
    return [...str.matchAll(regex)].map(match => match.index);
}


function trimChars(str, chars) {
    // Escape special regex characters in chars
    const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$');
    const regex = new RegExp(`^[${escapedChars}]+|[${escapedChars}]+$`, 'g');
    return str.replace(regex, '');
}

const tabulatorDirection = {
    topToBottom: 1,
    leftToRight: 2
};

function tabulate(data, columnCount, keySelector, valueSelector, options = {}) {
    const {
        keyValueDelimiter = " : ",
        rowDelimiter = "\r\n",
        showNumbers = false,
        direction = tabulatorDirection.topToBottom,
        perColumnKeyPadding = false
    } = options;

    // Find max lengths for keys and values
    const keyLengths = data.map(item => String(keySelector(item)).length);
    const valueLengths = data.map(item => String(valueSelector(item)).length);
    const maxValueLength = Math.max(...valueLengths);
    const numberLength = showNumbers ? String(data.length).length + 2 : 0;

    // Calculate max key length(s) per column
    let maxKeyLengths = Array(columnCount).fill(0);
    if (perColumnKeyPadding) {
        if (direction === tabulatorDirection.leftToRight) {
            for (let i = 0; i < data.length; i++) {
                const colIndex = i % columnCount;
                maxKeyLengths[colIndex] = Math.max(maxKeyLengths[colIndex], keyLengths[i]);
            }
        } else {
            const rowCount = Math.ceil(data.length / columnCount);
            for (let i = 0; i < data.length; i++) {
                const colIndex = Math.floor(i / rowCount);
                maxKeyLengths[colIndex] = Math.max(maxKeyLengths[colIndex], keyLengths[i]);
            }
        }
    } else {
        maxKeyLengths = Array(columnCount).fill(Math.max(...keyLengths));
    }

    // Calculate max total item length per column for alignment
    const maxColumnLengths = Array(columnCount).fill(0);
    const formattedItems = data.map((item, index) => {
        let colIndex;
        if (direction === tabulatorDirection.leftToRight) {
            colIndex = index % columnCount;
        } else {
            colIndex = Math.floor(index / Math.ceil(data.length / columnCount));
        }
        const key = String(keySelector(item)).padEnd(maxKeyLengths[colIndex]);
        const value = String(valueSelector(item)).padEnd(maxValueLength);
        const number = showNumbers
            ? `${String(index + 1).padStart(String(data.length).length, " ")}. `
            : "";
        const text = `${number}${key}${keyValueDelimiter}${value}`;
        maxColumnLengths[colIndex] = Math.max(maxColumnLengths[colIndex], text.length);
        return { text, colIndex };
    });

    let result = [];
    if (direction === tabulatorDirection.leftToRight) {
        // Left-to-right: wrap like a table
        for (let i = 0; i < formattedItems.length; i += columnCount) {
            const chunk = formattedItems
                .slice(i, i + columnCount)
                .map((item, idx) => item.text.padEnd(maxColumnLengths[idx]))
                .join(" ");
            result.push(chunk);
        }
    } else if (direction === tabulatorDirection.topToBottom) {
        // Top-to-bottom: newspaper column style
        const rowCount = Math.ceil(data.length / columnCount);
        for (let row = 0; row < rowCount; row++) {
            const rowItems = [];
            for (let col = 0; col < columnCount; col++) {
                const index = col * rowCount + row;
                if (index < formattedItems.length) {
                    rowItems.push(formattedItems[index].text.padEnd(maxColumnLengths[col]));
                } else {
                    // Pad empty cells for alignment
                    const emptyKey = " ".repeat(maxKeyLengths[col]);
                    const emptyValue = " ".repeat(maxValueLength);
                    const number = showNumbers ? " ".repeat(numberLength) : "";
                    const emptyText = `${number}${emptyKey}${keyValueDelimiter}${emptyValue}`;
                    rowItems.push(emptyText.padEnd(maxColumnLengths[col]));
                }
            }
            result.push(rowItems.join(" "));
        }
    }

    // Join with single row delimiter
    return result.join(rowDelimiter);
}

const TimeUnits = {
    millisecond: 1,
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    year: 1000 * 60 * 60 * 24 * 365
};

function getTimeSpan(milliseconds) {
    // Handle negative values
    const isNegative = milliseconds < 0;
    const absMs = Math.abs(milliseconds);

    // Calculate fractional components using TimeUnits
    const years = absMs / TimeUnits.year;
    const days = absMs / TimeUnits.day; // Total days (fractional)
    const hours = absMs / TimeUnits.hour; // Hours in day (fractional)
    const minutes = absMs / TimeUnits.minute; // Minutes in hour (fractional)
    const seconds = absMs / TimeUnits.second; // Seconds in minute (fractional)
    const ms = absMs; // Milliseconds in second (fractional)

    // Return TimeSpan-like object
    return {
        // Fractional component properties
        years: isNegative ? -years : years,
        days: isNegative ? -days : days,
        hours: isNegative ? -hours : hours,
        minutes: isNegative ? -minutes : minutes,
        seconds: isNegative ? -seconds : seconds,
        milliseconds: isNegative ? -ms : ms,

        // Methods
        add: function (ms) {
            return TimeSpan(milliseconds + ms);
        },
        subtract: function (ms) {
            return TimeSpan(milliseconds - ms);
        },
        toString: function () {
            const sign = isNegative ? "-" : "";
            // Extract integer parts for formatting
            const d = Math.trunc(Math.abs(days));
            const h = Math.trunc(Math.abs(hours)).toString().padStart(2, '0');
            const m = Math.trunc(Math.abs(minutes)).toString().padStart(2, '0');
            const s = Math.trunc(Math.abs(seconds)).toString().padStart(2, '0');
            // Format milliseconds to three decimal places
            const ms = Math.abs(this.milliseconds).toFixed(3).padStart(7, '0');

            let result = `${sign}${h}:${m}:${s}.${ms}`;
            if (d > 0) {
                result = `${sign}${d}.${result}`;
            }
            return result;
        }
    };
}

function clogStorage(msg, key) {
    clog(msg);
    localStorage[key] = msg;
}

function editLocalStorageObject(key, editor, defaultValueGetter = () => { }) {
    let obj = localStorage[key];
    obj = obj ? JSON.parse(obj) : defaultValueGetter();
    editor(obj);
    localStorage[key] = JSON.stringify(obj);
}

function cleanLocalStorage(keyPattern, lastMaintTimestampKey, maintIntervalHours, itemTrackingHours, itemParser, itemTimestampGetter) {
    let curTs = new Date();
    let lastCheck = localStorage[lastMaintTimestampKey];

    lastCheck = lastCheck ? new Date(JSON.parse(lastCheck)) : new Date(0)

    let elapsed = curTs - lastCheck;
    let trackingMs = TimeUnits.hour * itemTrackingHours;

    if (elapsed < maintIntervalHours * TimeUnits.hour) return;

    let removedItems = 0;
    let totalItems = 0;

    for (const key in localStorage) {
        if (!key.match(keyPattern)) continue;
        totalItems++;
        let info = localStorage[key];
        info = itemParser(info);
        let itemTs = itemTimestampGetter(info);
        let elapsedMs = curTs - itemTs;
        if (elapsedMs >= trackingMs) {
            removedItems++;
            localStorage.removeItem(key);
        }
    }

    localStorage[lastMaintTimestampKey] = JSON.stringify(curTs);

    clogStorage(`Removed ${removedItems}/${totalItems} items`, `${lastMaintTimestampKey}Count`);
}

function backUpLocalStorageKey(sourceKey, interval, backupCount) {
    if (localStorage.getItem(sourceKey) === null) return;

    const countLength = backupCount.toString().length;

    function getBackupName(index) {
        const padded = index.toString().padStart(countLength, '0');
        return `${sourceKey}backup${padded}`;
    }

    const backup0 = getBackupName(0);
    const existingBackup0 = localStorage.getItem(backup0);

    if (existingBackup0) {
        const meta = JSON.parse(existingBackup0);
        if (Date.now() - meta.date <= interval) return;
    }

    const backups = [];

    for (let i = 0; i < backupCount; i++) {
        backups.push(getBackupName(i));
    }

    const oldest = backups[backups.length - 1];
    if (localStorage.getItem(oldest) !== null) {
        localStorage.removeItem(oldest);
    }

    for (let i = backups.length - 2; i >= 0; i--) {
        const current = backups[i];
        const next = backups[i + 1];
        const currentValue = localStorage.getItem(current);
        if (currentValue !== null) {
            localStorage.setItem(next, currentValue);
            localStorage.removeItem(current);
        }
    }

    const sourceValue = localStorage.getItem(sourceKey);
    const newBackup = { value: sourceValue, date: Date.now() };
    localStorage.setItem(backup0, JSON.stringify(newBackup));
}

function deepMerge(target, source, options) {
    for (const key in source) {
        let targetHasProperty = target.hasOwnProperty(key);

        if (options?.deleteNonexistentTargetFromSource && !targetHasProperty) {
            delete source[key];
            continue;
        }

        let srcValue = source[key];

        if (!options?.mergeUndefined && srcValue === undefined) continue;
        if (options?.ignoreDefinedTarget && target[key] !== undefined) continue;
        if (options?.mergeOnlyExisting && !targetHasProperty) continue;

        if (typeof srcValue === "object" && !Array.isArray(srcValue)) {
            target[key] = deepMerge(target[key] || {}, srcValue, options);
        } else {
            target[key] = srcValue;
        }
    }
    return target;
}

function sortMultiple(arr, comparers) {
    arr.sort((a, b) => {
        var i;
        for (const c of comparers) {
            i = c(a, b);
            if (i !== 0) return i;
        }
    });
}

const SortDirection = {
    Ascending: 'asc',
    Descending: 'desc'
};

class Sorter {
    constructor(array) {
        this.array = [...array];
        this.sortPredicates = [];
    }

    orderBy(selector, direction = SortDirection.Ascending) {
        this.sortPredicates.push({ selector, direction });
        return this;
    }

    orderByAscending(selector) {
        this.sortPredicates.push({ selector, direction: SortDirection.Ascending });
        return this;
    }

    orderByDescending(selector) {
        this.sortPredicates.push({ selector, direction: SortDirection.Descending });
        return this;
    }

    //thenBy(selector, direction = SortDirection.Ascending) {
    //    this.sortPredicates.push({ selector, direction });
    //    return this;
    //}

    //thenByAscending(selector) {
    //    this.sortPredicates.push({ selector, direction: SortDirection.Ascending });
    //    return this;
    //}

    //thenByDescending(selector) {
    //    this.sortPredicates.push({ selector, direction: SortDirection.Descending });
    //    return this;
    //}

    execute() {
        return this.array.sort((a, b) => {
            for (const { selector, direction } of this.sortPredicates) {
                const valueA = selector(a);
                const valueB = selector(b);

                if (valueA === null || valueA === undefined) return direction === SortDirection.Ascending ? -1 : 1;
                if (valueB === null || valueB === undefined) return direction === SortDirection.Ascending ? 1 : -1;

                let comparison;
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    comparison = valueA.localeCompare(valueB);
                } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                    comparison = valueA - valueB;
                } else {
                    comparison = String(valueA).localeCompare(String(valueB));
                }

                if (comparison !== 0) {
                    return direction === SortDirection.Ascending ? comparison : -comparison;
                }
            }
            return 0;
        });
    }
}

function sortArray(array) {
    return new Sorter(array);
}

function filterEntryValues(obj, pred) {
    let items = [];
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            let item = obj[key];
            if (pred(item)) {
                items.push(obj[key]);
            }
        }
    }
    return items;
}

function selectEntryValues(obj, selector) {
    let items = [];
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            let item = obj[key];
            items.push(selector(item));
        }
    }
    return items;
}

function countEntryValues(obj, pred) {
    let n = 0;
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            let item = obj[key];
            if (pred(item)) n++;
        }
    }
    return n;
}

function groupBy(array, keyOrSelector) {
    // First, group into an object as before
    //todo move condition outside
    let keyIsFunction = typeof keyOrSelector === 'function';
    const groupedObj = array.reduce((acc, item) => {
        const key = keyIsFunction
            ? keyOrSelector(item)
            : item[keyOrSelector];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});

    return groupedObj;
}

function debounce(fn, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        const currentArgs = args;
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, currentArgs), wait);
    };
}

function isNullOrEmptyObject(obj) {
    if (!obj) return true;

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }

    return true;
}

function changeType(value, type) {
    if (value === undefined || value === null) return value;
    let vt = typeof value;
    if (vt === type) return value;

    let nv;
    switch (type) {
        case "string":
            nv = value.toString();
            break;
        case "boolean":
            nv =
                (vt === "number" && value === 1) ||
                value.toLowerCase() === "true" || value === "1";
            break;
        case "number":
            nv = parseFloat(value);
            break;
        default:
            nv = value;
    }
    return nv;
}

function createEffectiveProxy(target, parentEnabled = true) {
    return new Proxy(target, {
        get(t, prop, receiver) {
            const value = Reflect.get(t, prop, receiver);

            if (prop === 'enabled') {
                // Compute effective enabled: current && all parents
                return (t.enabled ?? true) && parentEnabled;
            }

            if (typeof value === 'object' && value !== null) {
                // For nested objects, propagate the chained enabled
                const currentEnabled = t.enabled ?? true;
                return createEffectiveProxy(value, parentEnabled && currentEnabled);
            }

            // For other properties, return as-is
            return value;
        }
    });
}

function ignoreError(action) {
    try {
        return { success: true, value: action() };
    } catch (e) {
        return { success: false, error: e };
    }
}

class AsyncLock {
    constructor() {
        this.locked = false;
        this.queue = [];
    }

    async acquire() {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        await new Promise((resolve) => {
            this.queue.push(resolve);
        });
        this.locked = true;
    }

    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next();
        } else {
            this.locked = false;
        }
    }

    async executeLocked(callback) {
        await this.acquire();
        try {
            return await callback();
        } finally {
            this.release();
        }
    }
}

// Common helper function for URL change monitoring
const urlMonitor = (function () {
    let lastUrl = null;
    let lastProtocol = null;
    let lastDomain = null;
    let lastPath = null;
    let lastParameters = null;

    // Default no-op functions (overridden in userscript)
    let handlers = {
        onProtocolChange: () => { },
        onDomainChange: () => { },
        onPathChange: () => { },
        onParametersChange: () => { },
    };

    // Parse URL into components
    function parseUrl(url) {
        const urlObj = new URL(url);
        return {
            protocol: urlObj.protocol,
            domain: urlObj.hostname,
            path: urlObj.pathname,
            parameters: urlObj.search,
        };
    }

    // Check for URL component changes
    function checkUrlChanges(newUrl) {
        if (!newUrl || newUrl === lastUrl) return;

        const { protocol, domain, path, parameters } = parseUrl(newUrl);

        if (lastProtocol !== null && protocol !== lastProtocol) {
            handlers.onProtocolChange({ old: lastProtocol, new: protocol });
        }
        if (lastDomain !== null && domain !== lastDomain) {
            handlers.onDomainChange({ old: lastDomain, new: domain });
        }
        if (lastPath !== null && path !== lastPath) {
            handlers.onPathChange({ old: lastPath, new: path });
        }
        if (lastParameters !== null && parameters !== lastParameters) {
            handlers.onParametersChange({ old: lastParameters, new: parameters });
        }

        lastUrl = newUrl;
        lastProtocol = protocol;
        lastDomain = domain;
        lastPath = path;
        lastParameters = parameters;
    }

    // Initial check
    checkUrlChanges(window.location.href);

    // Listen for navigation events (SPAs)
    if (window.navigation && typeof window.navigation.addEventListener === 'function') {
        window.navigation.addEventListener('navigate', (event) => {
            checkUrlChanges(event.destination.url);
        });
    } else {
        // Fallback polling
        setInterval(() => checkUrlChanges(window.location.href), 500);
    }

    // Handle traditional navigation
    window.addEventListener('popstate', () => checkUrlChanges(window.location.href));
    window.addEventListener('hashchange', () => checkUrlChanges(window.location.href));

    // Return public API to set handlers
    return {
        setHandlers: (newHandlers) => {
            handlers = { ...handlers, ...newHandlers };
        },
        // Expose handlers for direct override if needed
        onProtocolChange: (fn) => { handlers.onProtocolChange = fn; },
        onDomainChange: (fn) => { handlers.onDomainChange = fn; },
        onPathChange: (fn) => { handlers.onPathChange = fn; },
        onParametersChange: (fn) => { handlers.onParametersChange = fn; },
    };
})();

// Track deprecated function warnings to log only once
const deprecatedWarnings = new Set();
function deprecate(oldFunction, newFunction) {
    if (!deprecatedWarnings.has(oldFunction)) {
        console.log(`${oldFunction} deprecated. Use ${newFunction} instead`);
        deprecatedWarnings.add(oldFunction);
    }
}

function normalizeHostname(host) {
    // Convert to lowercase (hostnames are case-insensitive per DNS spec)
    host = host.toLowerCase();

    // Remove 'www.' if it starts with it
    if (host.startsWith('www.')) {
        host = host.slice(4);
    }

    return host;
}

class TaskQueue {
    constructor() {
        this.queue = []; // Array to hold tasks with desc and timeout
        this.isProcessing = false; // Flag to prevent concurrent processing
    }

    // Add a task to the queue with optional desc and timeout (in ms)
    addTask(task, desc = 'Unnamed task', timeout = null) {
        if (typeof task !== 'function') {
            console.error('Task must be a function.');
            return;
        }
        if (timeout !== null && (typeof timeout !== 'number' || timeout <= 0)) {
            console.error('Timeout must be a positive number or null.');
            return;
        }
        this.queue.push({ task, desc, timeout });
        this.processQueue(); // Attempt to start processing if not already
    }

    // Process the queue sequentially
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) {
            return; // Already processing or nothing to do
        }

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const { task, desc, timeout } = this.queue.shift(); // Get the next task (FIFO)
            try {
                if (timeout !== null) {
                    let timeoutId;
                    const timeoutPromise = new Promise((_, reject) => {
                        timeoutId = setTimeout(() => {
                            reject(new Error(`Task '${desc}' timed out after ${timeout}ms`));
                        }, timeout);
                    });
                    // Wrap task to clear timeout on completion or error
                    const wrappedTask = task().then(result => {
                        clearTimeout(timeoutId);
                        return result;
                    }).catch(err => {
                        clearTimeout(timeoutId);
                        throw err;
                    });
                    await Promise.race([wrappedTask, timeoutPromise]);
                } else {
                    await task(); // No timeout, just await the task
                }
            } catch (error) {
                console.error(error.message || `Error executing task '${desc}':`, error);
            }
            // Optional: Add a delay here if needed, e.g., await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.isProcessing = false;
    }
}
;function createModal({ content, closeOnOutsideClick = true, styles = {}, onClose = () => { } }) {
    const overlay = document.createElement("div");
    overlay.style.cssText = styles.overlay || "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.style.cssText = styles.content || "background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; width: 100%; position: absolute; cursor: grab;";
    modalContent.appendChild(content);
    overlay.appendChild(modalContent);

    let isDragging = false;
    let startX, startY, initialX, initialY;

    const startDragging = (e) => {
        clogdebug("Starting drag");
        // Only start dragging if not over an interactive element (e.g., input)
        if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") {
            return; // Allow focus on inputs and buttons
        }
        isDragging = true;
        modalContent.style.cursor = "grabbing";
        startX = e.clientX;
        startY = e.clientY;
        initialX = modalContent.offsetLeft || 0;
        initialY = modalContent.offsetTop || 0;
        e.preventDefault();
    };

    const drag = (e) => {
        if (isDragging) {
            clogdebug(`Dragging: dx=${e.clientX - startX}, dy=${e.clientY - startY}`);
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            modalContent.style.left = `${initialX + dx}px`;
            modalContent.style.top = `${initialY + dy}px`;
            e.preventDefault();
        }
    };

    //const stopDragging = () => {
    //    clogdebug("Stopping drag");
    //    isDragging = false;
    //    modalContent.style.cursor = "grab";
    //};

    //modalContent.addEventListener("mousedown", startDragging);
    //document.addEventListener("mousemove", drag);
    //document.addEventListener("mouseup", stopDragging);

    const close = () => {
        overlay.remove();
        //document.removeEventListener("mousemove", drag);
        //document.removeEventListener("mouseup", stopDragging);
        onClose();
    };

    if (closeOnOutsideClick) {
        const clickHandler = (e) => {
            if (e.target === overlay) {
                close();
                overlay.removeEventListener("click", clickHandler);
            }
        };
        overlay.addEventListener("click", clickHandler);
    }

    const show = () => {
        document.body.appendChild(overlay);
        modalContent.style.position = "absolute";
        modalContent.style.left = `${(window.innerWidth - modalContent.offsetWidth) / 2}px`;
        modalContent.style.top = `${(window.innerHeight - modalContent.offsetHeight) / 2}px`;
    };

    return { element: overlay, show, close };
}

function createModal1({ content, closeOnOutsideClick = true, styles = {}, onClose = () => { } }) {
    const overlay = document.createElement("div");
    overlay.style.cssText = styles.overlay || "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.style.cssText = styles.content || "background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; width: 100%;";

    modalContent.appendChild(content);
    overlay.appendChild(modalContent);

    const close = () => {
        overlay.remove();
        onClose();
    };

    if (closeOnOutsideClick) {
        const clickHandler = (e) => {
            if (e.target === overlay) {
                close();
                overlay.removeEventListener("click", clickHandler);
            }
        };
        overlay.addEventListener("click", clickHandler);
    }

    const show = () => {
        document.body.appendChild(overlay);
    };

    return { element: overlay, show, close };
}
;class SchemaVisitor {
    visit(value) {
        if (value === null || value === undefined) {
            return this.visitNullish();
        } else if (Array.isArray(value)) {
            return this.visitArray(value);
        } else if (typeof value === "string") {
            return this.visitString();
        } else if (typeof value === "number") {
            return this.visitNumber();
        } else if (typeof value === "boolean") {
            return this.visitBoolean();
        } else if (typeof value === "function") {
            return this.visitFunction();
        } else if (typeof value === "object") {
            return this.visitObject(value);
        }
        return {};
    }

    visitNullish() {
        return {};
    }

    visitString() {
        return { type: "string" };
    }

    visitNumber() {
        return { type: "number" };
    }

    visitBoolean() {
        return { type: "boolean" };
    }

    visitFunction() {
        return { type: "function" };
    }

    visitObject(obj) {
        const schemaEntry = { type: "object", properties: {} };
        for (const [key, value] of Object.entries(obj)) {
            schemaEntry.properties[key] = this.visit(value);
        }
        return schemaEntry;
    }

    visitArray(array) {
        const schemaEntry = { type: "array" };
        if (array.length === 0) {
            return schemaEntry;
        }

        let itemsType = null;
        for (const item of array) {
            const itemSchema = this.visit(item);
            if (itemSchema.type) {
                if (!itemsType) {
                    itemsType = itemSchema.type;
                    schemaEntry.items = { type: itemsType };
                    if (itemSchema.items) {
                        schemaEntry.items.items = itemSchema.items;
                    }
                    if (itemSchema.properties) {
                        schemaEntry.items.properties = itemSchema.properties;
                    }
                } else if (itemsType !== itemSchema.type) {
                    console.warn(`Array contains mixed types: expected ${itemsType}, found ${itemSchema.type}`);
                }
            }
        }
        return schemaEntry;
    }
}

function generateSchema(jsonObj) {
    if (typeof jsonObj !== "object" || jsonObj === null) {
        throw new Error("Input must be a non-null JSON object");
    }

    const visitor = new SchemaVisitor();
    const schema = {};
    for (const [key, value] of Object.entries(jsonObj)) {
        schema[key] = visitor.visit(value);
    }
    return schema;
}
;class ObjectEditor {
    constructor(schema, getData, setData, tooltips, options) {
        this.schema = schema;
        this.getData = getData;
        this.setData = setData;
        //this.tooltips = this.initializeTooltips(schema);
        this.tooltips = tooltips || {};
        this.options = options || {};
        this.tooltipCache = new Map();
        this.elementCache = new Map();
        this.eventListeners = [];
        this.mainModal = null;
    }

    markdownToHtml(text) {
        if (!text) return "";
        // Handle headers
        text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        // Handle unordered lists
        text = text.replace(/^(\*|-) (.*$)/gm, '<ul><li>$2</li></ul>');
        // Handle newlines as paragraphs or breaks
        text = text.replace(/\n/g, '<br>');
        // Basic sanitization (allow only specific tags)
        const allowedTags = ['h1', 'h2', 'h3', 'ul', 'li', 'br'];
        const div = document.createElement('div');
        div.innerHTML = text;
        const sanitized = Array.from(div.childNodes).map(node => {
            if (node.nodeType === 1 && allowedTags.includes(node.tagName.toLowerCase())) {
                return node.outerHTML;
            }
            return node.textContent || '';
        }).join('');
        return sanitized;
    }

    init(modalBtn) {
        // Store modalBtn as a class property
        this.modalBtn = modalBtn;

        // Always add a new listener, removing any existing one first
        const existingListener = this.eventListeners.find(
            ({ element }) => element === this.modalBtn
        );
        if (existingListener) {
            this.modalBtn.removeEventListener(existingListener.type, existingListener.handler);
            this.eventListeners = this.eventListeners.filter(
                ({ element }) => element !== this.modalBtn
            );
        }

        const initHandler = (e) => {
            e.preventDefault();
            try {
                clogdebug("Initializing ObjectEditor");
                this.dispose();
                this.showObjectModal();
            } catch (e) {
                clogdebug(`Error initializing modal: ${e.message}`);
                alert(`Error: ${e.message}`);
            }
        };
        this.modalBtn.addEventListener("click", initHandler);
        this.eventListeners.push({ element: this.modalBtn, type: "click", handler: initHandler });
    }

    initializeTooltips(schema) {
        const tooltips = {};
        forEachObjectEntry(schema, (key, spec) => {
            if (spec.type === "object" && spec.properties) {
                tooltips[key] = this.initializeTooltips(spec.properties);
            } else {
                tooltips[key] = this.tooltips[key] || "";
            }
        });
        return tooltips;
    }

    dispose() {
        clogdebug("Disposing ObjectEditor");
        // Remove all listeners except those for modalBtn
        this.eventListeners.forEach(({ element, type, handler }) => {
            if (document.contains(element) && element !== this.modalBtn) {
                element.removeEventListener(type, handler);
            }
        });
        this.eventListeners = this.eventListeners.filter(({ element }) => element !== this.modalBtn);
        this.tooltipCache.clear();
        this.elementCache.clear();
        if (this.mainModal) {
            this.mainModal.remove();
            this.mainModal = null;
        }
    }

    validateSchemaAndData(schema, obj, path = "") {
        const schemaKeys = Object.keys(schema);
        const objKeys = Object.keys(obj);
        const missingInSchema = objKeys.filter(key => !schemaKeys.includes(key));
        if (missingInSchema.length > 0) {
            throw new Error(`Object at '${path || "root"}' contains properties not defined in schema: ${missingInSchema.join(", ")}`);
        }
        forEachObjectEntry(schema, (key, spec) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (!spec.type) {
                throw new Error(`Schema property '${fullPath}' has undefined type. Please manually set the type.`);
            }
            if (spec.type === "object") {
                if (!spec.properties) {
                    throw new Error(`Schema property '${fullPath}' with type 'object' must have a 'properties' field.`);
                }
                const nestedObj = obj[key] || {};
                this.validateSchemaAndData(spec.properties, nestedObj, fullPath);
            }
        });
    }

    getTooltip(path) {
        if (this.tooltipCache.has(path)) {
            return this.tooltipCache.get(path);
        }
        try {
            const parts = path.split(".");
            const result = parts.reduce((current, part) => {
                if (!current) return null;
                return current[part];
            }, this.tooltips);
            const tooltip = (typeof result === "object" && result !== null && "__tooltip" in result)
                ? result.__tooltip
                : (typeof result === "string" ? result : null);
            this.tooltipCache.set(path, tooltip);
            return tooltip;
        } catch (e) {
            clogdebug(`Error in getTooltip for path '${path}': ${e.message}`);
            return null;
        }
    }

    setTooltip(path, value) {
        let current = this.tooltips;
        const parts = path.split(".");
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (typeof current[part] !== "object" || current[part] === null) {
                current[part] = {};
            }
            current = current[part];
        }
        const lastKey = parts[parts.length - 1];
        let schemaNode = this.schema;
        for (let i = 0; i < parts.length - 1; i++) {
            schemaNode = schemaNode[parts[i]]?.properties;
            if (!schemaNode) break;
        }
        if (value || (this.options.devMode && value === null)) {
            if (schemaNode && schemaNode[lastKey]?.type === "object") {
                current[lastKey] = current[lastKey] || {};
                current[lastKey].__tooltip = value;
            } else {
                current[lastKey] = value;
            }
        } else {
            if (current[lastKey]?.__tooltip) {
                delete current[lastKey].__tooltip;
                if (Object.keys(current[lastKey]).length === 0) {
                    delete current[lastKey];
                }
            } else {
                delete current[lastKey];
            }
        }
        this.tooltipCache.clear();
    }

    createTooltipControl(path, labelElement) {
        const container = document.createElement("span");
        container.style.cssText = "margin-left: 5px; display: inline-flex; align-items: center; position: relative;";
        const tooltipText = this.getTooltip(path);
        clogdebug(`Tooltip text for path '${path}': ${tooltipText}`);
        // Only show tooltip icon for non-object properties or in dev mode
        const schemaNode = this.getSchemaNode(path);
        if ((tooltipText || this.options.devMode) && (!schemaNode || schemaNode.type !== "object")) {
            const tooltipIcon = document.createElement("span");
            tooltipIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>';
            tooltipIcon.style.cssText = "cursor: pointer; margin-right: 5px;";
            container.appendChild(tooltipIcon);

            let activePopup = null;

            observe(tooltipIcon, (mutation, node, crud) => {
                if (crud === MutationCrudType.Remove) {
                    clogdebug(`Tooltip icon removed for path '${path}'`);
                    if (activePopup) {
                        activePopup.remove();
                        activePopup = null;
                    }
                }
            });

            const showTooltip = (e) => {
                clogdebug(`mouseenter triggered for path '${path}'`);
                if (!e.currentTarget || !document.contains(e.currentTarget)) {
                    clogdebug(`Error in showTooltip: currentTarget is null or not in DOM for path '${path}'`);
                    return;
                }
                if (activePopup) {
                    activePopup.remove();
                    activePopup = null;
                }
                const currentTooltip = tooltipText ?? "No tooltip available";
                activePopup = document.createElement("div");
                activePopup.innerHTML = this.markdownToHtml(currentTooltip); // Use innerHTML for Markdown
                activePopup.style.cssText = "position: fixed; background: #1c2b3a; color: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #38444d; z-index: 1000000; max-width: 400px; word-wrap: break-word; white-space: pre-wrap; pointer-events: none;";
                clogdebug(`Adding tooltip popup for path '${path}' with text: ${currentTooltip}`);
                document.body.appendChild(activePopup);
                //clogdebug(`mouseenter triggered for path '${path}'`);
                //if (!e.currentTarget || !document.contains(e.currentTarget)) {
                //    clogdebug(`Error in showTooltip: currentTarget is null or not in DOM for path '${path}'`);
                //    return;
                //}
                //if (activePopup) {
                //    activePopup.remove();
                //    activePopup = null;
                //}
                //const currentTooltip = tooltipText ?? "No tooltip available";
                //activePopup = document.createElement("div");
                //activePopup.textContent = currentTooltip;
                //activePopup.style.cssText = "position: fixed; background: #1c2b3a; color: #fff; padding: 5px 10px; border-radius: 4px; border: 1px solid #38444d; z-index: 1000000; max-width: 200px; word-wrap: break-word; white-space: normal; pointer-events: none;";
                //clogdebug(`Adding tooltip popup for path '${path}' with text: ${currentTooltip}`);
                //document.body.appendChild(activePopup);
                try {
                    const labelRect = labelElement.getBoundingClientRect();
                    let left = labelRect.right - activePopup.getBoundingClientRect().width;
                    let top = labelRect.bottom + 5;
                    const popupRect = activePopup.getBoundingClientRect();
                    if (left < 0) {
                        left = 10;
                    }
                    if (top + popupRect.height > window.innerHeight) {
                        top = labelRect.top - popupRect.height - 5;
                    }
                    if (top < 0) top = 10;
                    activePopup.style.left = `${left}px`;
                    activePopup.style.top = `${top}px`;
                    if (!isElementInViewport(activePopup)) {
                        clogdebug(`Tooltip for path '${path}' is not in viewport, adjusting position`);
                        top = labelRect.top - popupRect.height - 5;
                        activePopup.style.top = `${top}px`;
                    }
                } catch (err) {
                    clogdebug(`Error positioning tooltip for path '${path}': ${err.message}`);
                    activePopup.remove();
                    activePopup = null;
                    return;
                }
                const removePopup = () => {
                    clogdebug(`mouseleave or click triggered for path '${path}'`);
                    if (activePopup) {
                        activePopup.remove();
                        activePopup = null;
                    }
                    tooltipIcon.removeEventListener("mouseleave", removePopup);
                    document.removeEventListener("click", removePopup);
                };
                tooltipIcon.addEventListener("mouseleave", removePopup);
                this.eventListeners.push({ element: tooltipIcon, type: "mouseleave", handler: removePopup });
                document.addEventListener("click", removePopup, { once: true });
                this.eventListeners.push({ element: document, type: "click", handler: removePopup });
            };
            tooltipIcon.addEventListener("mouseenter", showTooltip);
            this.eventListeners.push({ element: tooltipIcon, type: "mouseenter", handler: showTooltip });
        }
        if (this.options.devMode) {
            const editIcon = document.createElement("span");
            editIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
            editIcon.style.cssText = "cursor: pointer;";
            container.appendChild(editIcon);
            const openEditModal = () => {
                const editor = document.createElement("div");
                editor.style.cssText = "background: #15202b; padding: 20px; border-radius: 8px; max-width: 300px; width: 100%; color: #fff;";
                const input = document.createElement("input");
                input.type = "text";
                input.value = this.getTooltip(path) || "";
                input.style.cssText = "padding: 5px; background: #1c2b3a; color: #fff; border: 1px solid #38444d; border-radius: 4px; width: 100%; box-sizing: border-box; margin-bottom: 10px;";
                const buttonContainer = document.createElement("div");
                buttonContainer.style.cssText = "display: flex; justify-content: flex-end; gap: 10px;";
                const saveButton = document.createElement("button");
                saveButton.textContent = "Save";
                saveButton.style.cssText = "padding: 5px 10px; background: #1da1f2; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.style.cssText = "padding: 5px 10px; background: #38444d; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
                input.onkeydown = (e) => {
                    if (e.key === "Enter") saveButton.click();
                    if (e.key === "Escape") cancelButton.click();
                };
                editor.appendChild(input);
                buttonContainer.appendChild(cancelButton);
                buttonContainer.appendChild(saveButton);
                editor.appendChild(buttonContainer);
                const modal = createModal({
                    content: editor,
                    closeOnOutsideClick: true,
                    styles: {
                        overlay: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1002; display: flex; justify-content: center; align-items: center;",
                        content: "max-width: 300px; width: 100%;"
                    },
                    onClose: () => {
                        this.eventListeners = this.eventListeners.filter(
                            ({ element }) => element !== cancelButton && element !== saveButton
                        );
                    }
                });
                cancelButton.onclick = () => modal.close();
                saveButton.onclick = () => {
                    this.setTooltip(path, input.value.trim() || null);
                    modal.close();
                };
                modal.show();
                input.focus();
            };
            editIcon.addEventListener("click", openEditModal);
            this.eventListeners.push({ element: editIcon, type: "click", handler: openEditModal });
        }
        return container;
    }

    // Helper function to get schema node by path
    getSchemaNode(path) {
        const parts = path.split(".");
        let schemaNode = this.schema;
        for (let part of parts) {
            if (schemaNode && schemaNode[part]?.properties) {
                schemaNode = schemaNode[part].properties;
            } else if (schemaNode && schemaNode[part]) {
                schemaNode = schemaNode[part];
            } else {
                return null;
            }
        }
        return schemaNode;
    }

    createListControl(key, spec, value, path = "") {
        const fullPath = path ? `${path}.${key}` : key;
        const container = document.createElement("div");
        container.className = `${fullPath}-options`;
        container.setAttribute("data-path", fullPath);
        if (spec.enableAdd) {
            const addInput = document.createElement("input");
            addInput.type = "text";
            addInput.placeholder = "Add new value";
            addInput.style.cssText = "margin-right: 10px; padding: 5px; background: #1c2b3a; color: #fff; border: 1px solid #38444d;";
            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.style.cssText = "padding: 5px 10px; background: #1da1f2; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
            const addHandler = () => {
                const newValue = addInput.value.trim();
                if (newValue && !spec.values.includes(newValue)) {
                    spec.values.push(newValue);
                    const newOption = this.createOption(newValue, spec, value, fullPath, container);
                    container.appendChild(newOption);
                    addInput.value = "";
                    if (spec.type === "string") {
                        newOption.querySelector("input").checked = true;
                        container.querySelectorAll("input").forEach(input => {
                            if (input !== newOption.querySelector("input")) input.checked = false;
                        });
                    }
                }
            };
            addButton.addEventListener("click", addHandler);
            this.eventListeners.push({ element: addButton, type: "click", handler: addHandler });
            container.appendChild(addInput);
            container.appendChild(addButton);
        }
        spec.values.forEach(val => {
            const option = this.createOption(val, spec, value, fullPath, container);
            container.appendChild(option);
        });
        this.elementCache.set(fullPath, container);
        return container;
    }

    createOption(val, spec, value, key, container) {
        const option = document.createElement("div");
        option.style.cssText = "margin: 5px 0;";
        const input = document.createElement("input");
        input.type = spec.type === "array" ? "checkbox" : "radio";
        input.name = key;
        input.value = val;
        input.style.cssText = "margin-right: 5px;";
        if (spec.type === "array" && Array.isArray(value) && value.includes(val)) {
            input.checked = true;
        } else if (spec.type === "string" && value === val) {
            input.checked = true;
        }
        const label = document.createElement("label");
        label.textContent = val;
        label.style.cssText = "color: #fff; margin-right: 10px;";
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.cssText = "padding: 2px 5px; background: #ff4d4f; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
        const deleteHandler = () => {
            const index = spec.values.indexOf(val);
            if (index > -1) {
                spec.values.splice(index, 1);
                option.remove();
            }
        };
        deleteButton.addEventListener("click", deleteHandler);
        this.eventListeners.push({ element: deleteButton, type: "click", handler: deleteHandler });
        option.appendChild(input);
        option.appendChild(label);
        option.appendChild(deleteButton);
        return option;
    }

    createTabControl(tabs, parentPath = "", activeTabIndex = 0) {
        const STYLES = {
            tabControl: "margin-top: 10px; border: 1px solid #38444d; border-radius: 4px;",
            tabHeaders: "background: #1c2b3a; border-bottom: 1px solid #38444d; overflow-x: auto;",
            tabContents: "padding: 10px; background: #15202b; position: relative;",
            tabHeader: (isActive) => `padding: 8px 16px; background: ${isActive ? "#1c2b3a" : "#15202b"}; color: #fff; border: none; border-right: 1px solid #38444d; cursor: pointer; white-space: nowrap; flex-shrink: 0;`,
            tooltipHeader: "width: 100%; background: #1a2a3a; color: #fff; padding: 5px; border-bottom: 1px solid #38444d; font-size: 14px; text-align: left;"
        };

        const tabControl = document.createElement("div");
        tabControl.style.cssText = STYLES.tabControl;

        const tabHeaders = document.createElement("div");
        tabHeaders.style.cssText = STYLES.tabHeaders;

        const tabContents = document.createElement("div");
        tabContents.style.cssText = STYLES.tabContents;

        const fragment = document.createDocumentFragment();
        const tabContentElements = tabs.map((tab, index) => {
            const tabContent = document.createElement("div");
            tabContent.className = "tab-content-pane";
            tabContent.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; opacity: ${index === activeTabIndex ? "1" : "0"}; z-index: ${index === activeTabIndex ? "1" : "0"};`;
            tabContent.dataset.path = tab.path;

            // Add tooltip header only if tooltip is defined
            const tooltipPath = tab.path;
            const tooltipText = this.getTooltip(tooltipPath);

            if (tooltipText) {
                const tooltipHeader = document.createElement("div");
                tooltipHeader.style.cssText = STYLES.tooltipHeader;
                tooltipHeader.innerHTML = this.markdownToHtml(tooltipText); // Use innerHTML for Markdown
                tabContent.appendChild(tooltipHeader);
            }

            //if (tooltipText) {
            //    const tooltipHeader = document.createElement("div");
            //    tooltipHeader.style.cssText = STYLES.tooltipHeader;
            //    tooltipHeader.textContent = tooltipText;
            //    tabContent.appendChild(tooltipHeader);
            //}

            tabContent.appendChild(this.createTabForm(tab.obj, tab.schema, tab.path));
            fragment.appendChild(tabContent);
            return tabContent;
        });

        observe(tabContents, (mutation, node, crud) => {
            if (crud === MutationCrudType.Remove) {
                clogdebug(`Tab content removed for path '${node.dataset.path}'`);
            }
        });

        const tempContainer = document.createElement("div");
        tempContainer.style.cssText = "position: absolute; visibility: hidden;";
        document.body.appendChild(tempContainer);
        tempContainer.appendChild(fragment.cloneNode(true));
        const maxHeight = Math.max(...Array.from(tempContainer.children).map(el => el.getBoundingClientRect().height));
        document.body.removeChild(tempContainer);

        tabContents.style.height = `${maxHeight}px`;
        tabContentElements.forEach(el => tabContents.appendChild(el));

        tabs.forEach((tab, index) => {
            const tabHeader = document.createElement("button");
            tabHeader.textContent = tab.name;
            tabHeader.style.cssText = STYLES.tabHeader(index === activeTabIndex);
            //const tooltipContainer = this.createTooltipControl(tab.path, tabHeader);
            //tabHeader.appendChild(tooltipContainer);
            const tabHandler = (e) => {
                e.preventDefault();
                tabHeaders.querySelectorAll("button").forEach((btn, btnIndex) => {
                    btn.style.cssText = STYLES.tabHeader(btnIndex === index);
                });
                tabContentElements.forEach((content, contentIndex) => {
                    content.style.opacity = contentIndex === index ? "1" : "0";
                    content.style.zIndex = contentIndex === index ? "1" : "0";
                });
            };
            tabHeader.addEventListener("click", tabHandler);
            this.eventListeners.push({ element: tabHeader, type: "click", handler: tabHandler });
            tabHeaders.appendChild(tabHeader);
        });

        tabControl.appendChild(tabHeaders);
        tabControl.appendChild(tabContents);
        return tabControl;
    }

    createTabForm(obj, schema, path = "") {
        const container = document.createElement("div");
        container.className = "tab-content";
        container.style.cssText = "margin-left: 10px; display: flex; flex-direction: column; gap: 10px;";

        const nonObjectEntries = [];
        const objectEntries = [];
        forEachObjectEntry(obj, (key, value) => {
            const spec = schema[key];
            if (spec.type === "object") {
                objectEntries.push([key, value, spec]);
            } else {
                nonObjectEntries.push([key, value, spec]);
            }
        });

        if (nonObjectEntries.length > 0) {
            const table = document.createElement("table");
            table.style.cssText = "width: 100%; border-collapse: collapse; color: #fff;";

            nonObjectEntries.forEach(([key, value, spec]) => {
                const row = document.createElement("tr");

                const labelCell = document.createElement("td");
                labelCell.style.cssText = "padding: 5px 10px; text-align: right; font-weight: bold; vertical-align: middle; white-space: nowrap;";
                const label = document.createElement("label");
                label.textContent = key;
                labelCell.appendChild(label);
                const tooltipContainer = this.createTooltipControl(path ? `${path}.${key}` : key, label);
                labelCell.appendChild(tooltipContainer);
                row.appendChild(labelCell);

                const controlCell = document.createElement("td");
                controlCell.style.cssText = "padding: 5px 10px; width: 100%; vertical-align: middle;";

                const type = spec.type;
                let input;

                if (spec.values && spec.values.length > 0) {
                    input = this.createListControl(key, spec, value, path);
                } else {
                    const fullPath = path ? `${path}.${key}` : key;
                    switch (type) {
                        case "string":
                            input = document.createElement("input");
                            input.type = "text";
                            input.value = value;
                            input.setAttribute("data-path", fullPath);
                            input.style.cssText = "padding: 5px; background: #1c2b3a; color: #fff; border: 1px solid #38444d; border-radius: 4px; width: 100%; box-sizing: border-box;";
                            break;
                        case "number":
                            input = document.createElement("input");
                            input.type = "number";
                            input.value = value;
                            input.step = "any";
                            input.setAttribute("data-path", fullPath);
                            input.style.cssText = "padding: 5px; background: #1c2b3a; color: #fff; border: 1px solid #38444d; border-radius: 4px; width: 100%; box-sizing: border-box;";
                            break;
                        case "boolean":
                            input = document.createElement("input");
                            input.type = "checkbox";
                            input.checked = value;
                            input.setAttribute("data-path", fullPath);
                            break;
                        case "array":
                            input = document.createElement("input");
                            input.type = "text";
                            input.value = Array.isArray(value) ? value.join(", ") : value;
                            input.placeholder = "Comma-separated values (temporary)";
                            input.setAttribute("data-path", fullPath);
                            input.style.cssText = "padding: 5px; background: #1c2b3a; color: #fff; border: 1px solid #38444d; border-radius: 4px; width: 100%; box-sizing: border-box;";
                            break;
                        case "function":
                            input = document.createElement("input");
                            input.type = "button";
                            input.value = "Execute";
                            const executeHandler = () => value();
                            input.addEventListener("click", executeHandler);
                            this.eventListeners.push({ element: input, type: "click", handler: executeHandler });
                            input.setAttribute("data-path", fullPath);
                            input.style.cssText = "padding: 5px; background: #1c2b3a; color: #fff; border: 1px solid #38444d; border-radius: 4px; width: 100%; box-sizing: border-box;";
                            break;
                        default:
                            return;
                    }
                    this.elementCache.set(fullPath, input);
                }

                controlCell.appendChild(input);
                row.appendChild(controlCell);
                table.appendChild(row);
            });

            container.appendChild(table);
        }

        if (objectEntries.length > 0) {
            const tabs = objectEntries.map(([key, value, spec]) => ({
                name: key,
                obj: value || {},
                schema: spec.properties,
                path: path ? `${path}.${key}` : key
            }));
            const tabControl = this.createTabControl(tabs, path);
            container.appendChild(tabControl);
        }

        return container;
    }

    createForm() {
        const obj = this.getData();
        this.validateSchemaAndData(this.schema, obj);

        const editor = document.createElement("div");
        editor.className = "obj-editor";
        editor.style.cssText = "width: 100%; margin: 0; padding: 0; display: flex; flex-direction: column; height: 100%;";

        const scrollableContainer = document.createElement("div");
        scrollableContainer.style.cssText = "flex: 1; overflow-y: auto; max-height: 60vh; padding-right: 5px;";

        const tabForm = this.createTabForm(obj, this.schema);
        scrollableContainer.appendChild(tabForm);
        editor.appendChild(scrollableContainer);
        return editor;
    }

    collectData(editor, schema, path = "") {
        const obj = {};
        forEachObjectEntry(schema, (key, spec) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (spec.type === "object") {
                obj[key] = this.collectData(editor, spec.properties, fullPath);
            } else {
                if (spec.values && spec.values.length > 0) {
                    const container = this.elementCache.get(fullPath) || editor.querySelector(`[data-path="${fullPath}"]`);
                    if (!container) return;
                    const inputs = container.querySelectorAll("input[type='radio'], input[type='checkbox']");
                    if (spec.type === "array") {
                        obj[key] = Array.from(inputs)
                            .filter(input => input.checked)
                            .map(input => input.value);
                    } else {
                        const checked = Array.from(inputs).find(input => input.checked);
                        obj[key] = checked ? checked.value : null;
                    }
                } else {
                    const input = this.elementCache.get(fullPath) || editor.querySelector(`[data-path="${fullPath}"]`);
                    if (!input) return;
                    switch (spec.type) {
                        case "string":
                            obj[key] = input.value.trim();
                            break;
                        case "number":
                            obj[key] = changeType(input.value.trim(), "number");
                            break;
                        case "boolean":
                            obj[key] = input.checked;
                            break;
                        case "array":
                            obj[key] = input.value.split(",").map(item => item.trim());
                            break;
                    }
                }
            }
        });
        return obj;
    }

    saveObject(editor, options) {
        const newObj = this.collectData(editor, this.schema);
        this.validateSchemaAndData(this.schema, newObj);
        this.setData(newObj, options);
    }

    showObjectModal() {
        clogdebug("Showing modal");
        const editor = this.createForm();

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = "display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px; border-top: 1px solid #38444d;";

        const closeButton = document.createElement("button");
        closeButton.textContent = "Cancel";
        closeButton.style.cssText = "padding: 10px 20px; background: #38444d; color: #fff; border: none; border-radius: 4px; cursor: pointer;";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.cssText = "padding: 10px 20px; background: #1da1f2; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
        const saveHandler = () => {
            this.saveObject(editor);
            modal.close();
        };
        saveBtn.addEventListener("click", saveHandler);
        this.eventListeners.push({ element: saveBtn, type: "click", handler: saveHandler });

        const saveBtnTemp = document.createElement("button");
        saveBtnTemp.textContent = "Save Temp";
        saveBtnTemp.style.cssText = "padding: 10px 20px; background: #1da1f2; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
        const saveTempHandler = () => {
            this.saveObject(editor, { temp: true });
            modal.close();
        };
        saveBtnTemp.addEventListener("click", saveTempHandler);
        this.eventListeners.push({ element: saveBtnTemp, type: "click", handler: saveTempHandler });

        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(saveBtnTemp);

        editor.appendChild(buttonContainer);

        const modal = createModal({
            content: editor,
            closeOnOutsideClick: true,
            styles: {
                overlay: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;",
                content: "background: #15202b; padding: 20px; border-radius: 8px; max-width: 70%; width: 700px; display: flex; flex-direction: column; max-height: 80vh;"
            },
            onClose: () => {
                clogdebug("Closing modal");
                this.dispose();
                this.eventListeners = this.eventListeners.filter(
                    ({ element }) => element !== closeButton && element !== saveBtn && element !== saveBtnTemp
                );
            }
        });

        this.mainModal = modal.element;

        closeButton.onclick = () => modal.close();
        modal.show();

        const scrollableContainer = editor.querySelector("div[style*='overflow-y: auto']");
        const modalContent = this.mainModal.querySelector(".modal-content");
        if (scrollableContainer) {
            const wheelHandler = (e) => this.handleWheelEvent(e, modalContent);
            scrollableContainer.addEventListener("wheel", wheelHandler, { passive: false });
            this.eventListeners.push({ element: scrollableContainer, type: "wheel", handler: wheelHandler });
            // Add wheel listener to the entire overlay
            const overlayWheelHandler = (e) => this.handleWheelEvent(e, modalContent);
            this.mainModal.addEventListener("wheel", overlayWheelHandler, { passive: false });
            this.eventListeners.push({ element: this.mainModal, type: "wheel", handler: overlayWheelHandler });
        }
    }

    showObjModal1() {
        clogdebug("Showing modal");
        const editor = this.createForm();

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = "display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px; border-top: 1px solid #38444d;";

        const closeButton = document.createElement("button");
        closeButton.textContent = "Cancel";
        closeButton.style.cssText = "padding: 10px 20px; background: #38444d; color: #fff; border: none; border-radius: 4px; cursor: pointer;";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.cssText = "padding: 10px 20px; background: #1da1f2; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
        const saveHandler = () => {
            this.saveObject(editor);
            modal.close();
        };
        saveBtn.addEventListener("click", saveHandler);
        this.eventListeners.push({ element: saveBtn, type: "click", handler: saveHandler });

        const saveBtnTemp = document.createElement("button");
        saveBtnTemp.textContent = "Save Temp";
        saveBtnTemp.style.cssText = "padding: 10px 20px; background: #1da1f2; color: #fff; border: none; border-radius: 4px; cursor: pointer;";
        const saveTempHandler = () => {
            this.saveObject(editor, { temp: true });
            modal.close();
        };
        saveBtnTemp.addEventListener("click", saveTempHandler);
        this.eventListeners.push({ element: saveBtnTemp, type: "click", handler: saveTempHandler });

        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(saveBtnTemp);

        editor.appendChild(buttonContainer);

        const modal = createModal({
            content: editor,
            closeOnOutsideClick: true,
            styles: {
                overlay: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;",
                content: "background: #15202b; padding: 20px; border-radius: 8px; max-width: 70%; width: 700px; display: flex; flex-direction: column; max-height: 80vh;"
            },
            onClose: () => {
                clogdebug("Closing modal");
                this.dispose();
                this.eventListeners = this.eventListeners.filter(
                    ({ element }) => element !== closeButton && element !== saveBtn && element !== saveBtnTemp
                );
            }
        });

        this.mainModal = modal.element;

        closeButton.onclick = () => modal.close();
        modal.show();

        const scrollableContainer = editor.querySelector("div[style*='overflow-y: auto']");
        if (scrollableContainer) {
            const scrollHandler = (e) => {
                scrollableContainer.style.pointerEvents = "none";
                setTimeout(() => { scrollableContainer.style.pointerEvents = "auto"; }, 100);
                const atTop = scrollableContainer.scrollTop === 0;
                const atBottom = scrollableContainer.scrollTop + scrollableContainer.clientHeight >= scrollableContainer.scrollHeight;
                const scrollingUp = e.deltaY < 0;
                const scrollingDown = e.deltaY > 0;

                if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            scrollableContainer.addEventListener("wheel", scrollHandler, { passive: false });
            this.eventListeners.push({ element: scrollableContainer, type: "wheel", handler: scrollHandler });
        }
    }

    handleWheelEvent(e, modalContent) {
        const target = e.target;
        const scrollableContainer = this.mainModal.querySelector("div[style*='overflow-y: auto']");
        const isOverForm = modalContent && modalContent.contains(target);

        if (isOverForm) {
            if (scrollableContainer && scrollableContainer.contains(target)) {
                const atTop = scrollableContainer.scrollTop === 0;
                const atBottom = scrollableContainer.scrollTop + scrollableContainer.clientHeight >= scrollableContainer.scrollHeight;
                const scrollingUp = e.deltaY < 0;
                const scrollingDown = e.deltaY > 0;

                if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
                    e.preventDefault();
                } else {
                    scrollableContainer.scrollTop += e.deltaY;
                    e.preventDefault();
                }
            } else {
                e.preventDefault(); // Do nothing if over form but not scrollable
            }
        }
        // No preventDefault when outside the form, allowing page scroll
    }
}
;
(function() {
(async function () {
    'use strict';
    let curTs = new Date();

    //function waitUntilDOMContentLoaded() {
    //    return new Promise((resolve) => {
    //        if (document.readyState === 'interactive' || document.readyState === 'complete') {
    //            resolve();
    //        } else {
    //            document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    //        }
    //    });
    //}

    //await waitUntilDOMContentLoaded(); // Wait for DOM

    //function waitUntilVisible() {
    //    return new Promise((resolve) => {
    //        if (document.visibilityState === 'visible') {
    //            resolve();
    //        } else {
    //            document.addEventListener('visibilitychange', () => {
    //                if (document.visibilityState === 'visible') resolve();
    //            }, { once: true });
    //        }
    //    });
    //}

    //await waitUntilVisible();

    // -----------------------------------
    // Backend: Configuration and Settings
    // -----------------------------------

    //let settingsTemp;
    //let settings;



    //let postEntityKeys = {

    //};

    function getDefaultSettings() {
        return {
            general: {
                lang: "en",
                postAge1: .5,
                postAge2: 4,
                postAge3: 8,
                hidePostOverrideScoreThreshold: -20,
                autoMuteScore: -30,
                devMode: false,
                liveAggregateCountingEnabled: false,
                enableDeletes: false,
                enableDeletesMutesOnTypedQueries: false,
                suppressDeletesNotEnabledMessage: false,
                enableMutes: "",
                enableTrendFilters: false,
                dontMuteOnTypedSearch: true,
                dontHideOnTypedSearch: true
            },
            account: {
                username: "",
            },
            performance: {
                clearXhrPostCacheOnUrlChange: true,
            },
            contentHandlers: {
                TagSpam: {
                    hashtagThreshold: 5,
                    menchieThreshold: 5
                },
                SearchSpam: {
                    threshold: 5,
                    scoreMultiplier: -3,
                    enableScoring: false
                },
                SearchQuality: {
                    contentThresholdPercent: .5,
                    includeHashtags: true,
                    includeMenchies: true,
                    includeSearchTerms: true
                },
                BannedText: {
                    enableDeletes: false,
                    enableFlagCheck: false,
                    enabled: true,
                },
                UserAccount: {
                    hideDefaultPfp: true,
                },
                BlackWhite: {
                    minScore: 5
                },
                Lang: {
                    languageConfidenceScore: 100,
                    hideBannedLangs: false,
                    hideGrokTranslatedPosts: false
                },
                UserContent: {
                    allowRepostOfOther: true,
                    allowRepostOfSelf: true,
                    allowQuoteOfOther: true,
                    allowQuoteOfSelf: true,
                    allowRepostOfQuoteOfSelf: true,
                    allowRepostOfReplyToSelf: true,
                    allowQuoteOfReplyToSelf: true,
                    allowUnavailableQuotes: true,
                    excludeFollowing: false
                    //hideRepostOfOther: false,
                    //hideRepostOfSelf: false,
                    //hideQuoteOfOther: false,
                    //hideQuoteOfSelf: false,
                    //hideRepostOfQuoteOfSelf: false,
                    //hideRepostOfReplyToSelf: false,
                    //hideQuoteOfReplyToSelf: false,
                    //hideUnavailableQuotes: true
                },
                ViewLikeRatios: {
                    likeCountThreshold: 5000,
                    showExtendedContentMetrics: false,
                    alwaysShowContentRatios: false
                },
                SeenPosts: {
                    maintenanceIntervalHours: 24,
                    trackingHours: 48,
                    hideSeenPostsAgeHours: 0.5,
                    hideSeenPostsCount: 2,
                    clickNotInterestedIn: false,
                    excludeFollowing: false
                },
                MutedBlocked: {
                    hideMuted: true,
                    hideBlocked: true,
                    hideBlockedBy: true,
                    hideMutedRepost: true,
                    hideBlockedRepost: true,
                    hideBlockedByRepost: true,
                    hideMutedQuote: true,
                    hideBlockedQuote: true,
                    hideBlockedByQuote: true,
                    excludeFollowing: false
                },
                UnavailableRefPost: {
                    excludeFollowing: false
                },
                RemoveNonrepliesOnRepliesFeed: {
                    excludeFollowing: false
                },
                SubLock: {
                    excludeFollowing: false
                },
                ColorCoding: {
                    excludeFollowing: false
                }
                //Naggle: {

                //}
            },
            muteAndHide: {
                whitelist: [""]
            },
            experimental: {
                extendedFeedDoctoring: false,
                removeBannedEntryIds: false,
                removeBannedExplorePageHeaders: false,
                hideHighScoreAboveThresholdEnabled: false,
                hideHighScoreAboveThreshold: -20,
                clickNotInterestedIn: false
            },
            dataMiner: {
                enableCommentSectionRankingAnalysis: false
            },
            //performance: {

            //},
            dev: {
                debugging: {
                    get globalDebugMode() {
                        return globalDebugMode;
                    },
                    set globalDebugMode(value) {
                        globalDebugMode = value;
                    },
                    debugModeUi: false,
                    retainRawXhrData: false,
                    api: {
                        enabled: false,
                        logUrl: false
                    },
                    data: {
                        enabled: false,
                        logEntryType: false,
                    },
                    enabled: false,
                }
            },
            apiIntercept: {
                enabled: false,
                requests: {
                    enabled: false,
                    //searchParams: {
                    //    enabled: false,
                    //    included_x_handles: true,
                    //    included_x_handles_enabled: false
                    //},
                    apiVariablesIntercept: {
                        enabled: false,
                        variables: {
                            count: 20
                        }
                    },
                    apiFeaturesIntercept: {
                        enabled: false,
                        features: {
                            "rweb_video_screen_enabled": false,
                            "payments_enabled": false,
                            "profile_label_improvements_pcf_label_in_post_enabled": true,
                            "rweb_tipjar_consumption_enabled": true,
                            "verified_phone_label_enabled": false,
                            "creator_subscriptions_tweet_preview_api_enabled": true,
                            "responsive_web_graphql_timeline_navigation_enabled": true,
                            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
                            "premium_content_api_read_enabled": false,
                            "communities_web_enable_tweet_community_results_fetch": true,
                            "c9s_tweet_anatomy_moderator_badge_enabled": true,
                            "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
                            "responsive_web_grok_analyze_post_followups_enabled": true,
                            "responsive_web_jetfuel_frame": true,
                            "responsive_web_grok_share_attachment_enabled": true,
                            "articles_preview_enabled": true,
                            "responsive_web_edit_tweet_api_enabled": true,
                            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
                            "view_counts_everywhere_api_enabled": true,
                            "longform_notetweets_consumption_enabled": true,
                            "responsive_web_twitter_article_tweet_consumption_enabled": true,
                            "tweet_awards_web_tipping_enabled": false,
                            "responsive_web_grok_show_grok_translated_post": true,
                            "responsive_web_grok_analysis_button_from_backend": true,
                            "creator_subscriptions_quote_tweet_preview_enabled": false,
                            "freedom_of_speech_not_reach_fetch_enabled": true,
                            "standardized_nudges_misinfo": true,
                            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
                            "longform_notetweets_rich_text_read_enabled": true,
                            "longform_notetweets_inline_media_enabled": true,
                            "responsive_web_grok_image_annotation_enabled": true,
                            "responsive_web_grok_imagine_annotation_enabled": true,
                            "responsive_web_grok_community_note_auto_translation_is_enabled": false,
                            "responsive_web_enhance_cards_enabled": false
                        }
                    },
                },
                responses: {
                    enabled: false,
                }
            },
            search: {
                args: [""]
            },
            visual: {
                disableContentClickEvent: false,
                betterContentTimestamps: false,
                betterContentTimestampThresholdDays: 180,
                largerContentInteractionButtons: false,
                showVideoUrls: true
            },
        };
    }

    let _settings;
    let _settingsTemp;
    //let _settingsProxy;
    const sessionVars = {
        get settings() {
            //if (_tempSettings) {
            //    return _tempSettings;
            //} else {
            //    if (_settings) {
            //        return _settings;
            //    } else {
            //        _settings = getSettings();
            //        _settingsProxy = createEffectiveProxy(_settings);
            //    }
            //}
            return _settingsTemp ?? (_settings ??= getSettings());
        },
        set settings(value) {
            _settings = value;
        }
    };

    const feeds = {
        HomeTimeline: null,
        HomeLatestTimeline: null,
        TweetResultByRestId: null,
        UserTweets: null,
        UserTweetsAndReplies: null,
        SearchTimeline: null,
        SearchTimelineLatest: null, //pseudo feed 
        TweetDetail: null,
        GenericTimelineById: null,
        ExplorePage: null,
        CommunityTweetsTimeline: null,
        ListLatestTweetsTimeline: null,
        BroadcastQuery: null,
        AllFeeds: null
    };
    setKeyNames(feeds);

    const excludedFeeds = [feeds.TweetDetail, feeds.UserTweets, feeds.UserTweetsAndReplies, feeds.CommunityTweetsTimeline];

    class ContentHandler {
        constructor(action, feedsIncl, feedsExcl) {
            this.action = action;
            this.feedsIncl = feedsIncl;
            this.feedsExcl = feedsExcl;
            this.order = ContentHandler.lastOrder++;
        }

        static lastOrder = 0;

        Handle(postContext) {
            if ((this.feedsExcl ?? excludedFeeds)?.some(f => f === feeds.AllFeeds || f === postContext.requestContext.feed) === true &&
                this.feedsIncl?.some(f => f === feeds.AllFeeds || f === postContext.requestContext.feed) !== true) return;

            //if ((this.feedsExcl ?? excludedFeeds)?.includes(postContext.requestContext.feed) === true &&
            //    this.feedsIncl?.includes(postContext.requestContext.feed) !== true) return;

            return this.action(postContext);
        }

        get settings() {
            return this._settings ??= sessionVars.settings.contentHandlers[this.name];
        }
        set settings(value) {
            this._settings = value;
        }
    }

    /* todo note:
    add handler for protected accounts
    data.content.itemContent.tweet_results.result.core.user_results.result.privacy.protected
    ----
    hide content with crypto domains in usernames
    \.(eth|crypto|sol|tez|bnb|near|id|bitcoin|dao|nft)
    ----
    withheld_in_countries	Array of String	
    When present, indicates a list of uppercase two-letter country codes this content is withheld from. Twitter supports the following non-country values for this field:

    “XX” - Content is withheld in all countries “XY” - Content is withheld due to a DMCA request.

    Example:

    "withheld_in_countries": ["GR", "HK", "MY"]
    withheld_scope	String	
    When present, indicates that the content being withheld is a “user.”

    Example:

    "withheld_scope": "user"
    ----
    Black excellence
     */

    const CaretMenuOptions = {
        notInterestedInThisPost: "Not interested in this post",
        mute: "Mute"
    };

    const contentHandlers = {
        UnavailableRefPost: new ContentHandler(function (context) {
            if (!context.post.isRefPost) return;
            if (!context.post.refPost) {
                context.post.delete("Unavailable refpost");
            } else if (context.post.refPost.tombstoned) {
                context.post.delete("Tombstoned");
            }
        }),
        RemoveNonrepliesOnRepliesFeed: new ContentHandler(function (context) {
            //this doesn't delete reposts of other users' comments; can probably check
            //for refPost
            if (!context.post.virtualPost.replyToPostId) {
                context.post.virtualPost.delete("Non-reply in replies feed");
            }
        }, [feeds.UserTweetsAndReplies], [feeds.AllFeeds]),
        SubLock: new ContentHandler(function (context) {
            if (context.post.subLocked) {
                debugger; //these posts are hard to catch, so set up a hard breakpoint
                //context.post.deleted = true;
                //context.post.addInfo("Sublocked");
                context.post.delete("Sublocked");
            }
        }),
        Communities: new ContentHandler(function (context) {
            wiff(context.post.virtualPost.socialContext, x => {
                if (x?.type === "Community") {
                    context.post.virtualPost.delete(`${x.type}: ${x.text}`);
                }
            });
        }),
        UserAccount: new ContentHandler(function (context) {
            let post = context.post.virtualPost;

            if (this.settings.hideDefaultPfp && post.user.isDefaultPfp) {
                post.delete("Default pfp");
            }
        }),
        Business: new ContentHandler(function (context) {
            if (context.post.virtualPost.user.isBusiness) {
                context.post.virtualPost.muted = true;
                context.post.virtualPost.addInfo(context.post.virtualPost.user.verifiedType);
            }
        }),
        Symbols: new ContentHandler(function (context) {
            if (context.post.virtualPost.symbols?.length > 0) {
                context.post.virtualPost.deleted = true;
                context.post.virtualPost.addInfo("Symbols");
            }
        }),
        Parody: new ContentHandler(function (context) {
            if (context.post.user.isParody) {
                context.post.deleted = true;
                context.post.virtualPost.addInfo("Parody");
            }
        }),
        MuskBot: (() => {
            let muskPattern = /elon(\W|_)*musk/i
            return new ContentHandler(function (context) {
                let post = context.post.virtualPost;

                if (post.user.username === "elonmusk") return;

                let muskyMatch = [post.user.username, post.user.displayName].find(x => muskPattern.exec(x));

                if (muskyMatch) post.delete(this.name);
            })
        })(),
        SearchTextInUsername: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            let dnSanitized = fldDisplayName.getter(post).replace(/\W/g, "");
            let un = fldUsername.getter(post);

            if (searchParamSanitized && (dnSanitized.toLowerCase().includes(searchParamSanitized) || un.toLowerCase().includes(searchParamSanitized))) {
                post.deleted = true;
                post.addInfo(`search query in name (${dnSanitized}/${un})`);
            }
        }, [feeds.SearchTimeline, feeds.SearchTimelineLatest]),
        SearchQuality: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            let entitySum = 0;

            for (let key in post.entities) {
                if (key === "media" || key === "urls") continue;
                if (Array.isArray(post.entities[key])) {
                    post.entities[key].forEach(item => {
                        if (item.indices && item.indices[0] >= post.displayTextRange[0]) {
                            entitySum += item.indices[1] - item.indices[0];
                        }
                    });
                }
            }

            let q;
            if (this.settings.includeSearchTerms && (q = context.requestContext.urlInfo.variables?.rawQuerySanitized)) {
                var searchCount = getAllIndices(post.text, q, true);
                let sum = searchCount.length * q.length;
                entitySum += sum;
            }

            if (entitySum === 0) return;

            let info = {
                entitySum,
                fullTextLength: post.text.length,
                displayLength: post.displayTextRange[1] - post.displayTextRange[0]
            };

            info.nonEntityLength = info.displayLength - entitySum;
            info.nonEntityToDisplayFactor = info.nonEntityLength / info.displayLength;

            if (info.nonEntityToDisplayFactor <= this.settings.contentThresholdPercent) {
                post.delete(`nonEntityToDisplayFactor: ${info.nonEntityToDisplayFactor.toFixed(2)}`);
            }
        }, [feeds.SearchTimeline, feeds.SearchTimelineLatest], [feeds.AllFeeds]),
        //GarDetector: (() => {
        //    let gro = ["talm bout", "tryna", "(we|they)\\W+is", "(he|she|they|we)\\W+be", "niggas?"];
        //    return new ContentHandler(function (context) {
        //        let post = context.post.virtualPost;
        //        let match = gro
        //    })
        //})(),
        MutedBlocked: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            let refPost = context.post.refPost;

            if (isLoggedInUser(post.user)) return;

            function isFeedUserContent(user) {
                let _isFeedUserContent = isFeedUser(user);

                if (_isFeedUserContent) {
                    post.user.doNotMute = true;
                    post.doNotDelete = true;
                }

                return _isFeedUserContent;
            }

            let removeReason;

            if (refPost) {
                if (isFeedUserContent(refPost.user)) return;

                if (context.post.isRepost && refPost.user) {
                    if (this.settings.hideBlockedRepost && refPost.user.blocked) {
                        removeReason = "Hide blocked repost";
                    } else if (this.settings.hideBlockedByRepost && refPost.user.blockedBy) {
                        removeReason = "Hide blocked by repost";
                    } else if (this.settings.hideMutedRepost && refPost.user.muted) {
                        removeReason = "Hide muted repost";
                    }
                }

                if (!removeReason) {
                    if (context.post.isQuote && refPost.user) {
                        if (this.settings.hideBlockedQuote && refPost.user.blocked) {
                            removeReason = "Hide blocked quote";
                        } else if (this.settings.hideBlockedByQuote && refPost.user.blockedBy) {
                            removeReason = "Hide blocked by quote";
                        } else if (this.settings.hideMutedQuote && refPost.user.muted) {
                            removeReason = "Hide muted quote";
                        }
                    }
                }
            } else {
                if (isFeedUserContent(post.user)) return;
                if (this.settings.hideMuted && context.post.user.muted) {
                    removeReason = "Hide muted";
                } else if (this.settings.hideBlocked && context.post.user.blocked) {
                    removeReason = "Hide blocked";
                } else if (this.settings.hideBlockedBy && context.post.user.blockedBy) {
                    removeReason = "Hide blocked by";
                }
            }

            if (removeReason) {
                post.delete(removeReason);
                //post.deleted = true;
                //if (!isFeedUser) post.addInfo(removeReason);
            }

        }, [feeds.UserTweets, feeds.UserTweetsAndReplies, feeds.CommunityTweetsTimeline], [feeds.TweetDetail]), //keep TweetDetail excluded until find a way to include in self replies
        //EngagementLock: new ContentHandler(function (context) {

        //    //data.content.itemContent.tweet_results.result.limitedActionResults.limited_actions[0].action
        //}),
        VideoGimmick: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            if (gimmickAccountPatterns.some(x => getRegexObject(x).exec(post.user.username))) {
                post.deleted = true;
                post.addInfo("Video gimmick");
            }
        }),
        //Naggle: new ContentHandler(function (context) {

        //}),
        SelfLink: new ContentHandler(function (context) {
            let post = context.post.virtualPost;

            if (!(post.entities.urls?.length > 0)) return;

            let postUrlHosts = post.entities.urls
                ?.map(x => normalizeHostname(new URL(x.expanded_url).hostname));

            let userHosts = [post.user.links.desc, post.user.links.url]
                .concatArrays()
                .map(x => normalizeHostname(new URL(x).hostname));

            if (!(userHosts?.length > 0)) return;

            let hasMatch = postUrlHosts.some(x => userHosts.some(u => u === x));

            if (hasMatch) post.delete(`Self link: ${postUrlHosts[0]}`);
        }, [feeds.SearchTimeline, feeds.SearchTimelineLatest], [feeds.AllFeeds]),
        ViewLikeRatios: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            if (post.user.following) return;

            function toFixedLocale(value, decimalPlaces) {
                let formatted = value.toLocaleString(undefined, {
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces
                });

                return formatted;
            }

            let _msgRatio;
            let getRatio = () => {
                let msgs = [];
                if (!_msgRatio) {
                    msgs.push(`${toFixedLocale(post.likesToFollowers, 2)} like/follower ratio (${post.likes.toLocaleString()} / ${post.user.followers.toLocaleString()})`);
                    msgs.push(`${toFixedLocale(post.viewsToFollowers, 2)} view/follower ratio (${post.views.toLocaleString()} / ${post.user.followers.toLocaleString()})`);

                    if (this.settings.showExtendedContentMetrics) {
                        msgs.push(`${toFixedLocale(post.likesToViews, 2)} like/view ratio (${post.likes.toLocaleString()} / ${post.views.toLocaleString()})`);
                        msgs.push(`${toFixedLocale(post.likesPerHour, 2)} likes/hour ratio (${post.likes.toLocaleString()} / ${post.createInfo.hours.toLocaleString()}h)`);
                        msgs.push(`${toFixedLocale(post.viewsPerHour, 2)} views/hour ratio (${post.views.toLocaleString()} / ${post.createInfo.hours.toLocaleString()}h)`);
                    }

                    _msgRatio = msgs.join("\r\n");
                }
                return _msgRatio;
            }

            if (post.likes > 5000 && post.likesToFollowers >= 5) {
                let score;
                if (post.user.isBlueVerified || excludedFeeds?.includes(context.requestContext.feed) === true) {
                    post.doNotMute = true;
                }
                if (post.likesToFollowers > 15) score = -15;
                else if (post.likesToFollowers > 10) score = -10;
                if (score) {
                    post.addScore(
                        score,
                        getRatio()
                    );
                }
            } else if (this.settings.alwaysShowContentRatios) {
                post.addInfo(getRatio());
            }
        }, [feeds.TweetDetail, feeds.UserTweets]),
        TagSpam: new ContentHandler(function (context) {
            let post = context.post.virtualPost;

            if (this.settings.hashtagThreshold > 0 && post.hashtags.length >= this.settings.hashtagThreshold) {
                post.delete(`Hashtag spam (${post.hashtags.length})`);
            }
            else if (this.settings.menchieThreshold > 0 && !post.replyToUserId && post.menchies.length >= this.settings.menchieThreshold) {
                post.delete(`Menchie spam (${post.menchies.length})`);
            }
        }),
        SearchSpam: new ContentHandler(function (context) {
            let user = context.post.user;
            let byUser = xhrPostsByUser[user.username];

            if (byUser?.count >= this.settings.threshold) {
                let msg = `Trend spam (${byUser.count} posts)`;
                if (this.settings.enableScoring) {
                    context.post.addScore(this.settings.scoreMultiplier * byUser.count,);
                } else {
                    context.post.addInfo(msg);
                }
            }
        }, [feeds.SearchTimeline, feeds.SearchTimelineLatest], [feeds.AllFeeds]),
        BannedText: (function () {
            let usernames = new Set();
            return new ContentHandler(function (context) {
                //let isFeedUser = isFeedUser(context.post.user);
                //if (isFeedUser && !context.post.isRepost) return;
                let post = context.post.virtualPost;
                if (post.user.following) return;

                if (isFeedUser(post.user)) {
                    post.doNotMute = true;
                }

                let matches = getFieldMatches(post, userTextFieldGetters, bannedAll);
                matches = matches.filter(x => {
                    //if not a pronoun pattern
                    if (filterDirectives.pronounPatterns.includes(x.directive)) {
                        if (x.pattern.name === "theythem") {
                            let bits = [x.matchInfo.match[1].toLowerCase(), x.matchInfo.match[3].toLowerCase()];
                            if (bits[0] === bits[1]) return false;

                            let factor = 1;

                            let sep = x.matchInfo.match[2].trim();

                            if (!sep || /[&\.\",]+/.exec(sep)) factor = factor / 2;

                            if (bits.includes("it")) factor = factor / 2;

                            x.score = x.directive.score * factor;
                        }
                    }

                    return true;
                });

                if (matches.length > 0) {
                    //let score = 0;
                    //post.addScore(matches.sum(x => x.directive.score));
                    matches.forEach(x => {
                        if (sessionVars.settings.general.liveAggregateCountingEnabled && !usernames.has(post.user.username)) {
                            usernames.add(post.user.username);
                            let matchKey;

                            if (filterDirectives.pronounPatterns.includes(x.directive)) {
                                //matchKey = `${x.matchInfo.match[1]}/${x.matchInfo.match[3]}`;
                                matchKey = "pronouns"
                            } else {
                                matchKey = x.matchInfo.matchText;
                            }

                            matchKey = matchKey.toLowerCase();

                            sessionVars.page.foundTexts[matchKey] = (sessionVars.page.foundTexts[matchKey] ?? 0) + 1;
                        }

                        let baseMsg = `${x.matchInfo.matchText} in ${x.field}`;
                        let getter = () => `${baseMsg} (${`${x.parts.before}${x.matchInfo.matchText}${x.parts.after}`.replace(/\r?\n|\r/g, " ")})`;

                        post.addScore(x.score ?? x.directive.score ?? 0, baseMsg, getter);

                        if (this.settings.enableDeletes && x.directive.action === filterActions.hide) {
                            post.delete(baseMsg);
                            //post.deleted = true;
                        }
                        //if (x.directive.score < 0) {
                        //    let baseMsg = `${x.matchInfo.matchText} in ${x.field}`;
                        //    let getter = () => `${baseMsg} (${`${x.parts.before}${x.matchInfo.matchText}${x.parts.after}`.replace(/\r?\n|\r/g, " ")})`;

                        //    post.addScore(x.score ?? x.directive.score, baseMsg, getter);
                        //} else {
                        //    post.addScore(x.score ?? x.directive.score);
                        //}
                    });
                }
            }, [feeds.TweetDetail, feeds.CommunityTweetsTimeline, feeds.UserTweets, feeds.UserTweetsAndReplies])
        })(),
        BlackWhite: new ContentHandler((function () {
            function detectBlackWhite(text) {
                // Array to store matches with their indices
                const matches = [];

                // Regex for "Black" not at sentence start
                // Negative lookbehind for sentence-ending punctuation (.!?) or start of string
                const blackRegex = /(?<![.!?]\s|^)Blacks?/g;

                // Regex for lowercase "white"
                const whiteRegex = /\bwhites?\b/g;

                // Find all "Black" matches
                let blackMatch;
                while ((blackMatch = blackRegex.exec(text)) !== null) {
                    // Reset white regex index to start searching after current "Black" match
                    whiteRegex.lastIndex = blackMatch.index + blackMatch[0].length;

                    let whiteMatch;
                    while ((whiteMatch = whiteRegex.exec(text)) !== null) {
                        matches.push({
                            black: {
                                text: blackMatch[0],
                                index: blackMatch.index
                            },
                            white: {
                                text: whiteMatch[0],
                                index: whiteMatch.index
                            }
                        });
                        // Continue searching for "white" after the last "white" match
                        whiteRegex.lastIndex = whiteMatch.index + whiteMatch[0].length;
                    }
                    // Continue searching for "Black" after the last "Black" match
                    blackRegex.lastIndex = blackMatch.index + blackMatch[0].length;
                }

                return matches;
            }

            return function (context) {
                let post = context.post.virtualPost;

                if (post.score < this.settings.minScore) return;

                var matches = detectBlackWhite(post.text);

                if (matches.length > 0) {
                    context.post.virtualPost.addScore(-5, "Capitalize black, not white");
                }
            };
        })(), [feeds.TweetDetail, feeds.UserTweets, feeds.UserTweetsAndReplies]),
        BannedLinks: new ContentHandler(function (context) {
            let link = wiff(context.post.virtualPost.user.links, links => (links.desc ?? []).concat(links.url ?? []))
                .find(x => bannedLinkPatterns.some(bl => x.match(bl)));

            if (link) {
                context.post.virtualPost.addScore(-20, link);
                //context.post.virtualPost.addInfo(link);
            }
        }, [feeds.TweetDetail, feeds.CommunityTweetsTimeline, feeds.UserTweets, feeds.UserTweetsAndReplies]),
        Lang: new ContentHandler(function (context) {
            let post = context.post.virtualPost;

            if (this.settings.hideGrokTranslatedPosts && post.isTranslatable === true) {
                post.delete("isTranslatable");
                return;
            }
            if (!allowedLangs.includes(post.lang)) {
                let msg = `Lang - ${post.lang}`;
                if (this.settings.hideBannedLangs === true) {
                    post.deleted = true;
                } else {
                    let score = 0;
                    let results = [];
                    let getters = [p => fldDisplayName.getter(p), p => fldBio.getter(p), p => p.text];
                    let langPattern = langPatterns.find(x => x.langs.includes(post.lang));
                    let maxScore = this.settings.languageConfidenceScore;

                    for (const g of getters) {
                        if (score >= maxScore) break;
                        let result = getLangScore(g(post), langPattern, maxScore);
                        if (result) {
                            score += result.totalScore;
                            results.push(result);
                        }
                    }

                    if (score >= maxScore) {
                        post.deleted = true;
                        let matches = results.map(x => x.matches).flat();
                        msg = `${msg} (${matches.map(m => `${m.match} (${m.score})`).join(", ")} - ${score})`;
                    }
                }
                post.addInfo(msg);
            }
        }, [feeds.CommunityTweetsTimeline]),
        SeenPosts: new ContentHandler(function (context) {
            //if (isLiveSearch) return;

            let post = context.post.virtualPost;

            if (!seenPostTrackingEligible(post)) return;

            let deleted = post.deleted; //capture value for potential undelete later
            let seenPost = getSeenPostByFeed(context.requestContext.feed, post);

            if (post.createInfo.hours > sessionVars.settings.general.postAge3) {
                if (seenPost.seenCount > 0) post.deleted = true;
            }
            else if (
                post.seenInfo.seenHours >= this.settings.hideSeenPostsAgeHours &&
                seenPost.seenCount > this.settings.hideSeenPostsCount) {
                post.deleted = true;
            }

            if (!post.seenInfo.isNew) {
                post.addInfo(`Seen ${post.seenInfo.seenHours.toFixed(2)}h ago ${seenPost.seenCount} times; ${getTimeSummary(post.createInfo)} old`);
            }

            if (context.requestContext.feed === feeds.HomeTimeline && post.deleted && this.settings.clickNotInterestedIn) {
                //post.menuItem = "Not interested in this post";
                post.menuItem = CaretMenuOptions.notInterestedInThisPost;
                if (!deleted) post.deleted = false; //undelete if not already deleted
            }
        }, [feeds.HomeTimeline, feeds.SearchTimeline],
            //[feeds.TweetDetail, feeds.UserTweets, feeds.UserTweetsAndReplies, feeds.HomeLatestTimeline, feeds.CommunityTweetsTimeline]
            [feeds.AllFeeds]
        ),
        UserContent: new ContentHandler(function (context) {
            let xhrp = context.post;

            if (isLoggedInUser(xhrp.user)) return;

            if (xhrp.isRepost) {
                if (this.settings.allowRepostOfSelf === false && xhrp.repost.user.username === xhrp.user.username) {
                    xhrp.virtualPost.deleted = true;
                    xhrp.virtualPost.addInfo("Repost of self");
                } else if (this.settings.allowRepostOfQuoteOfSelf === false && xhrp.repost.isQuote && xhrp.repost.quote?.user?.username === xhrp.user.username) {
                    xhrp.virtualPost.deleted = true;
                    xhrp.virtualPost.addInfo(`Repost of quote of self (${xhrp.user.username})`);
                } else if (this.settings.allowRepostOfReplyToSelf === false && xhrp.repost.replyToUsername === xhrp.user.username) {
                    xhrp.virtualPost.deleted = true;
                    xhrp.virtualPost.addInfo("Repost of reply to self");
                } else if (this.settings.allowRepostOfOther === false) {
                    xhrp.virtualPost.deleted = true;
                    xhrp.virtualPost.addInfo("Repost");
                }
            }

            if (xhrp.isQuote) {
                if (!xhrp.quote || xhrp.quote.tombstoned) {
                    //consume the inner IF to prevent failover to ELSE
                    if (!this.settings.allowUnavailableQuotes) {
                        xhrp.deleted = true;
                        //xhrp.menuItem = "Not interested in this post";
                        if (!xhrp.quote) {
                            xhrp.addInfo("Quote unavailable");
                        } else if (xhrp.tombstoned) {
                            xhrp.addInfo("Quote tombstoned");
                        }
                    }
                } else {
                    let isSelf = xhrp.quote.user.username === xhrp.user.username;
                    if (this.settings.allowQuoteOfSelf === false && isSelf) {
                        xhrp.deleted = true;
                        xhrp.addInfo("Quote of self");
                    } else if (this.settings.allowQuoteOfOther === false && !isSelf) {
                        xhrp.deleted = true;
                        xhrp.addInfo("Quote");
                    } else if (this.settings.allowQuoteOfReplyToSelf === false && xhrp.quote.replyToUsername === xhrp.user.username) {
                        xhrp.virtualPost.deleted = true;
                        xhrp.virtualPost.addInfo("Quote of reply to self");
                    }
                }
            }
        }, undefined, [feeds.TweetDetail]),
        ColorCoding: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            if (isLiveSearch) return;
            post.colorCodeAge = true;
        }, null, [feeds.CommunityTweetsTimeline, feeds.HomeLatestTimeline, feeds.UserTweets, feeds.UserTweetsAndReplies, feeds.TweetDetail, feeds.ListLatestTweetsTimeline, feeds.TweetResultByRestId]),
        Misc: new ContentHandler(function (context) {
            let post = context.post.virtualPost;
            if (post.isTranslatable === true) {
                post.delete("isTranslatable")
                //post.addInfo();
            }

            if (post.user.withheldInCountries?.length > 0) {
                post.addInfo(`Withheld in ${post.user.withheldInCountries.join(", ")}${wiff(post.user.withheldScope, x => x ? $` (${x})` : '')}`);
            }
        })
    };

    const twatDocSettingsKey = "twatDocSettings";

    function getSettings() {
        let def = getDefaultSettings();

        if (!def.contentHandlers) def.contentHandlers = {};

        let curSettings = localStorage[twatDocSettingsKey];
        //let isNew = !curSettings;

        if (curSettings) {
            curSettings = JSON.parse(curSettings);
        } else {
            curSettings = def;
        }

        forEachObjectEntry(contentHandlers, (k, v) => {
            let globalHandlerSettingsContainer = def.contentHandlers[k];

            if (!globalHandlerSettingsContainer) globalHandlerSettingsContainer = def.contentHandlers[k] = {};

            if (globalHandlerSettingsContainer.enabled === undefined) globalHandlerSettingsContainer.enabled = false;
            if (globalHandlerSettingsContainer.exitOnDelete === undefined) globalHandlerSettingsContainer.exitOnDelete = true;
            if (globalHandlerSettingsContainer.excludeFollowing === undefined) globalHandlerSettingsContainer.excludeFollowing = true;

            v.name = k;
        });

        curSettings = deepMerge(def, curSettings, { deleteNonexistentTargetFromSource: true });

        modifySettings(curSettings);

        return curSettings;
    }

    function saveSettings() {
        localStorage[twatDocSettingsKey] = JSON.stringify(sessionVars.settings);
    }

    function groupXhrPosts(keyName, grouper) {
        let groups = groupBy(Object.entries(sessionVars.page.xhrPosts), grouper);

        groups = Object.entries(groups)
            .map(x => {
                let item = ({ postCount: x[1].length });
                item[keyName] = x[0];
                return item;
            });

        groups = new Sorter(groups)
            .orderBy(x => x.postCount, SortDirection.Descending)
            .execute();

        return groups;
    }

    function modifySettings(settings) {
        /*
        g = groupXhrPosts("user", x => x[1].replyToUsername);
new Sorter(g).orderBy(x => x.items.length, SortDirection.Descending).execute().map(x => `${x.user} (${x.items.length})`).join("\r\n")
        */

        if (typeof settings.general.enableMutes === "boolean") {
            settings.general.enableMutes = "";
        }

        settings.account.username = settings.account.username.match(/^(@|https:\/\/x\.com\/)?(\w+)/)?.[2] ?? "";

        settings.tools = {
            ui: {
                clearVisiblePostNonTweetText: function () {
                    let tmps = document.body.querySelectorAll("div[data-testid='cellInnerDiv']");
                    let seltweetText = "div[data-testid='tweetText']";

                    tmps.forEach(e => {
                        if (!isElementInViewport(e)) return;
                        let txt = e.querySelector(seltweetText);
                        if (!txt) return;
                        let p = txt.parentElement;
                        let children = Array.from(p.parentElement.children);
                        let firstIndex = children.indexOf(p);

                        if (firstIndex < 0) return;

                        for (let i = firstIndex; i < children.length - 1; i++) {
                            let child = children[i];
                            if (!Array.from(child.children).some(x => x.matches(seltweetText))) child.remove();
                        }
                    });
                },
                clearVisiblePostBottomButtons: function () {
                    document.querySelectorAll("button[data-testid='reply']").forEach(x => {
                        let p = x.parentNode.parentNode;
                        if (!isElementInViewport(p)) return;

                        p.remove();
                    });
                },
            },
            account: {
                uncheckInterests: function () {
                    if (window.location.pathname !== "/settings/your_twitter_data/twitter_interests") return;

                    let section = document.querySelector("section[aria-label='Section details']");
                    let container = section.childNodes[1].childNodes[0].childNodes[0];
                    container.querySelectorAll("input[type='checkbox']").forEach(async x => {
                        let chk = x.parentElement.querySelector("svg");
                        if (!chk) return;
                        taskQueue.addTask(async () => {
                            let label = x.parentElement.parentElement.parentElement.parentElement.innerText;
                            chk.parentElement.parentElement.parentElement.parentElement.click();
                            await waitUntil(() => !x.parentElement.querySelector("svg"))
                            await delay(250);
                            console.log(label);
                        });
                    });
                }
            },
            data: {
                triggerBreakpoint: function () {
                    debugger;
                },
                getUserFeedMetrics: function () {
                    let username = window.location.pathname.slice(1).toLowerCase();
                    let posts = Object.values(sessionVars.page.xhrPosts).filter(x => x.user.username.toLowerCase() == username && !x.refPost);
                    posts = new Sorter(posts).orderByDescending(x => x.views).execute();

                    let report = posts.map(x => `PostId: ${x.postId}; Likes: ${x.likes}; Views: ${x.views}; Like/follower: ${(x.likes / x.user.followers).toFixed(4)}; View/follower: ${(x.views / x.user.followers).toFixed(4)}`)

                    console.log(report);
                },
                getAggregrateFeedUserCount: function () {
                    let items = groupXhrPosts("name", x => x[1].user.username);

                    //items.forEach(x => delete x.items);

                    console.log(items);
                },
                getAggregrateFeedScoreCount: function () {
                    let scores = [-50, -40, -30, -20, -10, -0];

                    groupXhrPosts("score", x => scores.find(s => x[1].score ?? 0 <= s));
                },
                getAggregateFoundTextCount: function () {
                    let items = new Sorter(Object.entries(sessionVars.page.foundTexts))
                        .orderByDescending(x => x[1])
                        .execute();

                    let strung;

                    //let countPadding = (Math.max(...(items .length).toString().length;

                    strung = items
                        .map(x => `${x[0]}: ${x[1]}`)
                        .join("\r\n");

                    //strung = tabulate(items, 1, x => x[0], x => x[1], {
                    //    showNumbers: true,
                    //    perColumnKeyPadding: true
                    //});

                    console.log(
                        `From top ${Object.keys(sessionVars.page.xhrPosts).length} posts:
${strung}`);
                },
                xhrpLookup: function () {
                    let id = prompt("Enter post ID or post URL")?.match("\\d+$");

                    if (!id) return;

                    let p = sessionVars.page.xhrPosts[id];

                    console.log(p);
                }
                //getListUserMenchies: function () {
                //    debugger;
                //    let ats = [];
                //    document.querySelector("div[aria-label='Timeline: List members']").querySelectorAll("div[data-testid^='UserAvatar'").forEach(x => {
                //        let link = x.querySelector("a[role='link']");
                //        ats.push("@" + link.getAttribute("href").substring(1));
                //    });
                //    console.log(ats.join(" "));
                //}
            }
        };
    }

    //modSettings();

    // -----------------------------------
    // Backend: Data Models
    // -----------------------------------
    class RequestContext {
        constructor(request) {
            this.request = request;
            this.ts = new Date();
        }

        GetJson() {
            if (!this._json) {
                this._json = JSON.parse(this.request.responseText);
            }
            return this._json;
        }
    }

    /**
     * XhrPost and XhrUser are DTOs for X's proprietary objects. If their object structure changes, just account for
     * it in these constructors so that no other code changes are required elsewhere
     */
    class XhrPost {
        constructor() {
            this.info = [];
            this.deleteInfo = [];
            this.scores = [];
            //this.score = 0;
            this._muted = false;
        }

        addInfo(msg, getter) {
            this.info.push({ msg, getter: getter ?? (() => this.msg) });
        }

        get muted() {
            return this._muted || (this.score < 0 && this.score <= sessionVars.settings.general.autoMuteScore);
        }

        set muted(value) {
            this._muted = value;
        }

        setPropertiesByEntry(data) {
            if (sessionVars.settings.dev.debugging.retainRawXhrData) this.data = data;
            let content = getXhrPostContent(data);
            let contentResult = content.result ?? content.itemContent.tweet_results.result;

            if (!contentResult) {
                //this.nullContent = true;
                return;
            }

            let contentMeta = this.getContentMeta(contentResult);
            //this.contentMeta = this.getContentMeta(contentResult);

            //if (this.contentMeta.__typename === "TweetUnavailable") return;
            if (contentMeta.__typename === "TweetUnavailable") return;

            this.subLocked = contentResult.cta?.title === "Subscribe to unlock";

            this.socialContextType = wiff(content.itemContent?.socialContext, x => {
                if (x) {
                    this.socialContext = {
                        type: x.contextType,
                        text: x.text
                    };
                }
            });

            if (this.subLocked) {
                debugger;
                //console.log(this.contentMeta);
                this.setPropertiesBySublocked(contentMeta);
            } else {
                this.setPropertiesByContentMeta(contentMeta);
            }
        }

        setPropertiesBySublocked(data) {
            this.virtualPost = this;
            this.text = data.text;
            this.postId = data.rest_id;
            //this.text = this.contentMeta.text;
            //this.postId = this.contentMeta.rest_id;
            this.user = {};
            this.user.username = data.core.user_results.result.legacy.screen_name;
            this.user.displayName = data.core.user_results.result.legacy.name;
        }

        setPropertiesByContentMeta(meta) {
            if (meta.tombstone) {
                this.tombstoned = true;
                return;
            }
            let post = meta.legacy;
            this.postId = post.id_str;
            this.text = post.full_text;
            this.displayTextRange = post.display_text_range;
            this.lang = post.lang?.toLowerCase();
            this.bookmarks = post.bookmark_count;
            this.likes = post.favorite_count;
            this.isTranslatable = meta.is_translatable;
            this.views = meta.views?.count ? parseFloat(meta.views.count) : 0;
            this.replies = post.reply_count;
            this.quotes = post.quote_count;
            this.reposts = post.retweet_count;
            this.replyToUsername = post.in_reply_to_screen_name;
            this.replyToUserId = post.in_reply_to_user_id_str;
            this.replyToPostId = post.in_reply_to_status_id_str;

            let ts = new Date(post.created_at);
            //let diff = Date.now() - createInfo.timestamp;

            //this.createInfo = { timestamp: new Date(post.created_at) };

            this.createInfo = getTimeSpan(curTs - ts);
            this.createInfo.timestamp = ts;

            //this.createInfo = getCreateInfo(post.created_at);

            this.user = new XhrUser(meta);
            this.likesToFollowers = this.likes / this.user.followers;
            this.viewsToFollowers = this.views / this.user.followers;
            this.likesToViews = this.likes / this.views;
            this.likesPerHour = this.likes / this.createInfo.hours;
            this.viewsPerHour = this.views / this.createInfo.hours;
            this.isQuote = post.is_quote_status;
            this.isRepost = !isNullOrEmptyObject(post.retweeted_status_result);

            this.entities = post.entities;

            this.symbols = post.entities.symbols;
            this.hashtags = post.entities.hashtags.map(x => x.text);
            this.menchies = post.entities.user_mentions.map(x => x.screen_name);

            if (this.isRepost) {
                this.repost = new XhrPost();
                this.repost.setPropertiesByContentMeta(this.getContentMeta(post.retweeted_status_result.result));
            }

            let result = meta.quoted_status_result?.result;

            if (this.isQuote && result) {
                this.quote = new XhrPost();
                result = result.tweet ?? result;
                this.quote.setPropertiesByContentMeta(result);
            }

            this.refPost = this.repost ?? this.quote;
            this.isRefPost = this.isRepost || this.isQuote;
            //this.isRefPost = !!this.refPost;

            this.virtualPost = this.repost ?? this;
            //this.virtualPost = this.refPost ?? this;

            //this.replyLocked = meta.limitedActionResults?.limited_actions?.some(x => x.action === "Reply");

            function transformMedia(mediaArray) {
                if (!mediaArray) return;

                const videos = mediaArray.filter(item => item.type === 'video');

                const result = videos.map(video => {
                    const media_key = video.media_key;
                    const variants = video.video_info.variants
                        .filter(v => v.content_type === 'video/mp4')
                        .map(v => {
                            const match = v.url.match(/\/vid\/avc1\/(\d+)x(\d+)\//);
                            const dimensions = match ? `${match[1]}x${match[2]}` : 'unknown';
                            return { dimensions, url: v.url };
                        });
                    return { media_key, variants };
                });

                return result;
            }

            if (sessionVars.settings.visual.showVideoUrls) {
                this.mediaVariants = transformMedia(meta.legacy.extended_entities?.media);
            }
        }

        getContentMeta(result) {
            return result.tweet ?? result;
        }

        addScore(score, msg, getter) {
            this._score = undefined;
            this.scores.push({ score, msg, getter: getter ?? (() => this.msg) });
        }

        getScoreMessages(friendly) {
            if (this.score >= 0) return [];

            return this.scores.map(x => `${((friendly ? x.getter() : x.msg) ?? x.msg)}${(x.score ? ` (${x.score})` : "")}`);
        }

        _score;
        get score() {
            return this._score ??= this.scores.sum(x => x.score);
        }

        delete(msg) {
            this.deleted = true;
            this.deleteInfo.push(msg);
        }

        getInfoMessages(friendly) {
            return this.info.map(x => `${((friendly ? x.getter() : x.msg) ?? x.msg)}`);
        }

        getAllMessages(friendly) {
            return this.getScoreMessages(friendly).concat(this.getInfoMessages(friendly)).concat(this.deleteInfo);
        }
    }

    class XhrUser {
        constructor(content) {
            let userMeta = content.core.user_results.result;
            let user = userMeta.legacy;
            this.restId = userMeta.rest_id;
            this.username = user.screen_name ?? userMeta.core?.screen_name;
            this.displayName = user.name ?? userMeta.core?.name;
            this.bio = user.description;
            this.location = user.location ?? userMeta.location?.location;
            this.isBlueVerified = userMeta.is_blue_verified;
            this.verified = user.verified;
            this.verifiedType = user.verified_type;
            this.isBusiness = this.verifiedType?.toLowerCase() === "business";
            this.followers = user.followers_count;
            this.follows = user.friends_count;
            //this.following = user.following;
            this.following = userMeta.relationship_perspectives?.following;
            this.blocked = userMeta.relationship_perspectives?.blocking;
            this.blockedBy = user.blocked_by ?? userMeta.relationship_perspectives?.blocked_by;
            //this.muted = user.muting;
            this.muted = userMeta.relationship_perspectives?.muting;
            this.isParody = user.parody_commentary_fan_label?.toLowerCase() === "parody";
            this.withheldInCountries = user.withheld_in_countries;
            this.withheldScope = user.withheld_scope;

            this.links = {
                desc: user.entities.description.urls.map(x => x.expanded_url).filter(x => x),
                url: user.entities.url?.urls.map(x => x.expanded_url).filter(x => x)
            };
            //this.links.all = (this.links.desc ?? []).concat(this.links.url ?? []);

            this.isDefaultPfp = user.default_profile_image;
            //this.isDefaultPfp = userMeta.avatar.image_url === "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";
        }
    }

    // -----------------------------------
    // Backend: XHR Interception
    // -----------------------------------
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {

        //console.log(`xhr open: ${method}`);
        //console.log(`xhr open: ${url}`);

        //if (url.startsWith("https://api.x.com/1.1/onboarding/task.json?redirect_after_login")) {
        //    console.log("breaking redirect");

        //    return;
        //}
        if (wiff(sessionVars.settings.apiIntercept, x => x?.enabled && wiff(x.requests, x => x?.enabled))) {
            arguments[1] = modifyQueryString(url);
        }

        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    //console.log(this.status);
                    clogdebug(this.status);
                    if (!this.responseType || this.responseType === "text") clogdebug(this.responseText);
                    return;
                }
                let response = new RequestContext(this);
                handleResponse(response);
            }
        });

        return oldXHROpen.apply(this, arguments);
    };

    //await waitUntilDOMContentLoaded(); // Wait for DOM
    //await waitUntilVisible();

    function modifyQueryString(url) {

        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            let dirty = false;
            let requestSettings = sessionVars.settings.apiIntercept.requests;

            if (requestSettings.apiFeaturesIntercept.enabled) {
                let optionsKey = "features";
                let options = params.has(optionsKey) && JSON.parse(params.get(optionsKey));

                if (options) {
                    deepMerge(options, requestSettings.apiFeaturesIntercept.features, { mergeOnlyExisting: true });
                    params.set(optionsKey, JSON.stringify(options));
                    dirty = true;
                }
            }

            if (requestSettings.apiVariablesIntercept.enabled) {
                let featuresKey = "variables";
                let options = params.has(featuresKey) && JSON.parse(params.get(featuresKey));

                if (options) {
                    if (options.rawQuery) {
                        options.rawQuerySanitized = trimChars(options.rawQuery, "\"");
                        sessionVars.settings.search.args?.forEach(x => {
                            if (options.rawQuery.indexOf(x) < 0) options.rawQuery += ` ${x}`;
                        });
                        //if (options.rawQuery.indexOf("lang:en") < 0) options.rawQuery += " lang:en";
                    }
                    deepMerge(options, requestSettings.apiVariablesIntercept.variables, { mergeOnlyExisting: true });
                    params.set(featuresKey, JSON.stringify(options));
                    dirty = true;
                }
            }

            //if (urlObj.pathname.endsWith(feeds.SearchTimeline) && requestSettings.searchParams?.enabled) {
            //    if (requestSettings.searchParams.included_x_handles_enabled) {
            //        params.set("included_x_handles", requestSettings.searchParams.included_x_handles === true /*? "1" : "0"*/);
            //        dirty = true;
            //    }
            //}

            if (dirty) {
                urlObj.search = params.toString();
                return urlObj.toString();
            } else {
                return url;
            }
        } catch (e) {
            console.error('Error modifying query string:', e);
            return url;
        }
    }

    // -----------------------------------
    // Backend: Data Processing
    // -----------------------------------
    //let xhrPosts = {};
    let xhrPostsByUser = {};
    let lastFeed = null;
    //let feedUser = null;
    const urlJsonParamKeys = ["features", "variables"];

    const feedPattern = `https://(x.com/i/api|api.x.com)/graphql/(\\w|-)+/(${Object.keys(feeds).join("|")})(\\W|$)`;

    function getFeedhash(requestContext) {
        switch (requestContext.feed) {
            case feeds.UserTweets:
                return `${requestContext.feed}${requestContext.urlInfo.variables.userId}`;
            case feeds.SearchTimeline:
                return `${requestContext.feed}${requestContext.urlInfo.variables.rawQuery}`;
            default:
                return requestContext.feed;
        }
    }

    function handleResponse(requestContext) {
        requestContext.urlInfo = {
            url: requestContext.request.responseURL,
            urlParts: new URL(requestContext.request.responseURL)
        }

        requestContext.urlInfo.qs = Array.from(requestContext.urlInfo.urlParts.searchParams.entries());

        urlJsonParamKeys.forEach((e, i) => {
            let p = requestContext.urlInfo.qs.find(x => x[0] === e);
            if (p) {
                requestContext.urlInfo[e] = JSON.parse(p[1]);
            }
        });

        if (sessionVars.settings.dev.debugging.api.logUrl) {

            clog(requestContext.urlInfo);

            //let url = new URL(requestContext.request.responseURL);
            //let qs = Array.from(url.searchParams.entries());
            //clog(url);
            //clog(qs);
        }

        let urlMatch = requestContext.request.responseURL.match(feedPattern);

        if (urlMatch) {
            requestContext.apiFeed = urlMatch[urlMatch.length - 2];
            if (requestContext.apiFeed === feeds.SearchTimeline && requestContext.urlInfo.variables.product === "Latest") {
                requestContext.feed = feeds.SearchTimelineLatest;
            } else {
                requestContext.feed = requestContext.apiFeed;
            }
            //console.log(requestContext.request.responseURL);
            onFeedRequest(requestContext);
        }

        if (requestContext.isDirty === true) {
            Object.defineProperty(requestContext.request, 'response', { writable: true });
            Object.defineProperty(requestContext.request, 'responseText', { writable: true });
            requestContext.request.response = requestContext.request.responseText = JSON.stringify(requestContext.GetJson());
        }
    }

    // -----------------------------------
    // Backend: Feed Definitions
    // -----------------------------------
    const InstructionType = {
        TimelineAddEntries: null,
        TimelineAddToModule: null
    };
    setKeyNames(InstructionType);

    const EntryType = {
        TimelineTimelineItem: null,
        TimelineTimelineModule: null,
        TimelineTimelineCursor: null
    }
    setKeyNames(EntryType);

    const FeedEntryIdType = {
        tweet: null,
        trend: null,
        eventsummary: null,
        stories: null,
        who_to_follow: null,
        home_conversation: null,
        list_conversation: null,
        cursor: null,
        conversationthread: null,
        profile_conversation: null,
        relevanceprompt: null,
        promoted_tweet: null,
        community_to_join: null,
        toptabsrpusermodule: null,
        who_to_subscribe: null,
        recommended_recruiting_organizations: null,
        bookmarked_tweet: null
    };
    forEachObjectEntry(FeedEntryIdType, (k, v) => FeedEntryIdType[k] = k.replaceAll("_", "-"));

    const bannedEntryIdTypes = [
        FeedEntryIdType.relevanceprompt,
        FeedEntryIdType.promoted_tweet,
        FeedEntryIdType.community_to_join,
        FeedEntryIdType.toptabsrpusermodule,
        FeedEntryIdType.who_to_subscribe,
        FeedEntryIdType.who_to_follow,
        FeedEntryIdType.toptabsrpusermodule,
        FeedEntryIdType.recommended_recruiting_organizations,
        FeedEntryIdType.eventsummary,
        FeedEntryIdType.bookmarked_tweet
    ];

    const ContentType = {
        TimelineTweet: null
    };
    setKeyNames(ContentType);

    const EntryComponentType = {
        trending_topic_tweet: null,
        suggest_ranked_organic_tweet: null
    }
    setKeyNames(EntryComponentType);

    class FeedHandler {
        constructor(action, options) {
            this.action = action;
        }

        Handle(instructions) {

            return this.action(instructions);
        }
    }

    const userContentEntryIdTypes = [
        FeedEntryIdType.tweet,
        FeedEntryIdType.home_conversation,
        FeedEntryIdType.list_conversation,
        FeedEntryIdType.profile_conversation,
        FeedEntryIdType.conversationthread,
    ];

    function isTimelineAddition(x) {
        return x.content.entryType === EntryType.TimelineTimelineItem ||
            x.content.entryType === EntryType.TimelineTimelineModule;
    }

    function getFeedData(requestContext) {
        let dataGetter;
        switch (requestContext.apiFeed) {
            case feeds.UserTweets:
            case feeds.UserTweetsAndReplies:
                dataGetter = x => {
                    let res = x.data.user.result;
                    let instr = (res.timeline_v2 ?? res.timeline).timeline.instructions;
                    return instr;
                };
                break;
            case feeds.TweetResultByRestId: dataGetter = x => x.data.tweetResult; break;
            case feeds.SearchTimeline: dataGetter = x => x.data.search_by_raw_query.search_timeline.timeline.instructions; break;
            case feeds.TweetDetail: dataGetter = x => x.data.threaded_conversation_with_injections_v2.instructions; break;
            case feeds.GenericTimelineById: dataGetter = x => x.data.timeline.timeline.instructions; break;
            case feeds.ExplorePage: dataGetter = x => x.data.explore_page.body.initialTimeline.timeline.timeline.instructions; break;
            case feeds.CommunityTweetsTimeline: dataGetter = x => x.data.communityResults.result.ranked_community_timeline.timeline.instructions; break;
            case feeds.ListLatestTweetsTimeline: dataGetter = x => x.data.list.tweets_timeline.timeline.instructions; break;
            default: dataGetter = x => x.data.home?.home_timeline_urt.instructions;
        }

        let instr = dataGetter(requestContext.GetJson());

        if (!instr) {
            clog(`No instructions or unhandled feed "${requestContext.apiFeed}"`);
            return;
        }

        return instr;
    }

    const bannedExplorePageHeaders = ["sports"];

    function onFeedRequest(requestContext) {
        checkFeedChange(requestContext);
        requestContext.lastXhrPostIndex = -1;

        //console.log(requestContext.feed);

        let instr = getFeedData(requestContext);

        if (!instr) {
            return;
        }

        let timelineAddEntries;
        let allEntries;
        let instrType;

        if (Array.isArray(instr)) {
            allEntries = instr.find(x => (instrType = x.type) === InstructionType.TimelineAddEntries)?.entries;
        } else {
            onXhrPost(instr,
                {
                    entryType: EntryType.TimelineTimelineItem,
                    entryIdType: FeedEntryIdType.tweet
                }, null, requestContext
            );
            return;
        }

        //allEntries = instr.find(x => (instrType = x.type) === InstructionType.TimelineAddEntries)?.entries;

        if (!allEntries || allEntries.length === 0) {
            clog("No TimelineAddEntries");
            return;
        }
        //else {
        curTs = new Date();
        let dataPairs = [];
        let sortIndexes = [];

        if (instrType === InstructionType.TimelineAddEntries) {
            requestContext.tlItemCount = allEntries.filter(x => isTimelineAddition(x))?.length ?? 0;
            requestContext.tlItemsProcessed = 0;
        }

        //new Sorter(allEntries)
        //    .orderByDescending(x => x.sortIndex)
        //    .execute()
        //    .forEach(x => x.twatIndex = sessionVars.page.twatIndex++);

        for (let i = allEntries.length - 1; i > -1; i--) {
            let entry = allEntries[i];
            let entryContext = {
                entryId: entry.entryId,
                entryIdType: getFeedEntryIdType(entry),
                entryType: entry.content.entryType,
                itemType: entry.content.itemContent?.itemType,
                entryComponentType: entry.clientEventInfo?.component,
                headerText: entry.header?.text,
                sortIndex: entry.sortIndex,
                twatIndex: entry.twatIndex,
                conversationSection: entry.content.clientEventInfo?.details?.conversationDetails?.conversationSection,
                entry
            };

            entryContext.isTimelineModule = entryContext.entryType === EntryType.TimelineTimelineModule;

            entryContext.singleAuthor =
                entryContext.entryType === EntryType.TimelineTimelineItem ||
                (entryContext.isTimelineModule && entryContext.entryIdType !== FeedEntryIdType.tweet);

            if (
                sessionVars.settings.experimental.removeBannedExplorePageHeaders &&
                entryContext.isTimelineModule &&
                requestContext.apiFeed === feeds.ExplorePage &&
                bannedExplorePageHeaders.includes(entry.content.header.text.toLowerCase())
            ) {
                removeXhrEntry(i, entryContext, allEntries, requestContext);
                continue;
            }

            if (sessionVars.settings.dev.debugging.data.logEntryType) {
                clog(entryContext);
            }

            entry.twatTemp = {
                index: i,
                isTimelineAddition: isTimelineAddition(entry)
            };
            sortIndexes.push(entry.sortIndex);
            requestContext.xhrIndex = i;

            if (i > requestContext.lastXhrPostIndex) requestContext.lastXhrPostIndex = i;

            if (sessionVars.settings.experimental.removeBannedEntryIds) {
                //if (entryContext.entryIdType === entryIdType.stories )
                let bannedEntry = bannedEntryIdTypes.includes(entryContext.entryIdType);

                if (bannedEntry) {
                    removeXhrEntry(i, entryContext, allEntries, requestContext);
                    continue;
                }
            }

            let entries = [];

            if (sessionVars.settings.experimental.extendedFeedDoctoring) {
                let remove = false;

                switch (requestContext.apiFeed) {
                    case feeds.ExplorePage:
                        //let remove = false;
                        switch (entryContext.entryIdType) {
                            case FeedEntryIdType.cursor:
                            case FeedEntryIdType.trend:
                            case FeedEntryIdType.tweet:
                                if (entryContext.entryIdType === FeedEntryIdType.tweet && entryContext.isTimelineModule) {
                                    switch (entry.content.displayType) {
                                        case "Carousel":
                                            //entry.content.displayType = "Vertical";
                                            remove = true;
                                            break;
                                        case "Vertical":
                                            break;
                                    }
                                    //entry.content.itemContent.tweetDisplayType = "Tweet";                                    
                                }
                                break;
                            default:
                                remove = true;
                        }
                        break;
                    case feeds.GenericTimelineById:
                        break;
                    default:
                        if (entryContext.entryIdType === FeedEntryIdType.trend) {
                            remove = true;
                        }
                        break;
                }

                if (remove) {
                    //allEntries.splice(i, 1);
                    removeXhrEntry(i, entryContext, allEntries, requestContext);
                    requestContext.isDirty = true;
                    continue;
                }
            }


            ////items[0].item.itemContent
            //if (entry.content.entryType === entryType.TimelineTimelineItem) {
            //    entries = [entry];
            //} else if (meta.isTimelineModule) {
            //    entries = [entry.content.items[entry.content.items.length - 1].item];
            //}

            //entries?.forEach(e => {
            //    let content = getXhrPostContent(e);
            //    if (content.itemContent.socialContext?.contextType === "Community") {
            //        removeXhrEntry(i, allEntries, requestContext);
            //        return;
            //    }
            //    let postContext = onXhrPost(e, meta, allEntries, requestContext);
            //    dataPairs.push({ e, postContext });
            //});

            switch (entry.content.entryType) {
                case EntryType.TimelineTimelineItem:
                case EntryType.TimelineTimelineModule:
                    //let content = getXhrPostContent(entry);
                    let items;

                    if (entryContext.isTimelineModule && entryContext.entryIdType === FeedEntryIdType.tweet /*&& entry.content.displayType === "Vertical"*/) {
                        entryContext.doNotDelete = true;
                        items = entry.content.items.map(x => x.item);
                    } else {
                        items = [entry];
                    }

                    items.forEach(item => {
                        let postContext = onXhrPost(item, entryContext, allEntries, requestContext);
                        dataPairs.push({ entry, postContext });
                    });
                    break;
            }


            //switch (entry.content.entryType) {
            //    case entryTypes.TimelineTimelineItem:
            //        _entry = entry;
            //        break;
            //    case entryTypes.TimelineTimelineModule:
            //        _entry = entry.content.items[entry.content.items.length - 1].item;
            //        break;
            //}

            //if (_entry) {
            //    result = onXhrPost(_entry, allEntries, requestContext);

            //    dataPairs.push({ entry, result });
            //}
        } //end main entry loop

        //for (let i = allEntries.length - 1; i > -1; i--) {
        //    processXhrPost(postContext);
        //}

        //let i = 0;

        //dataPairs = new Sorter(dataPairs)
        //    .orderBy(x => x.entry.entryId.startsWith(feedEntryIdTypes.cursor))
        //    .thenBy(x => x.result?.post.score)
        //    .execute();

        //dataPairs.forEach((e, i) => {
        //    //if (e.entry.content.itemContent.itemType !== contentTypes.TimelineTweet) return;
        //    //allEntries[i] = e.entry;
        //    e.entry.sortIndex = sortIndexes[i].sortIndex;
        //});

        //dataPairs.forEach((e, i) => {
        //    processXhrPost(e.postContext);
        //});

        //requestContext.isDirty = true;

        //} //end old block
    }

    function onXhrPost(entry, meta, entries, requestContext) {
        let postContext;
        try {
            if (!userContentEntryIdTypes.includes(meta.entryIdType)) return;
            postContext = _onXhrPost(entry, meta, entries, requestContext);
        } catch (ex) {
            clog(ex);
            postContext.post.addInfo(ex);
        } finally {
            if (postContext) {
                processXhrPost(postContext);
            }
        }
        return postContext;
    }

    function _onXhrPost(entry, entryContext, entries, requestContext) {
        //if (getXhrPostContent(entry).itemContent.itemType !== ContentType.TimelineTweet) {
        //    return;
        //}

        let content;
        let xhrp = new XhrPost();

        xhrp.twatIndex = entryContext.twatIndex;

        if (entryContext.entryType === EntryType.TimelineTimelineItem || !entryContext.singleAuthor) {
            content = entry;
            xhrp.setPropertiesByEntry(content);
            if (requestContext.feed === feeds.TweetResultByRestId) {
                xhrp.doNotDelete = true;
            }
        } else if (entryContext.entryType == EntryType.TimelineTimelineModule && entryContext.singleAuthor) {
            let contentItems = entry.content.items.filter(x => x.item.itemContent.itemType === ContentType.TimelineTweet);
            content = contentItems[contentItems.length - 1].item;
            xhrp.setPropertiesByEntry(content);
            if (contentItems.length > 1) {
                xhrp.items = [];
                for (var i = 0; i < contentItems.length - 1; i++) {
                    let xhrpItem = new XhrPost();
                    xhrpItem.setPropertiesByEntry(contentItems[i].item);
                    sessionVars.page.xhrPosts[xhrpItem.postId] = xhrpItem;
                    xhrp.items.push(xhrpItem);
                    sessionVars.page.xhrPosts[xhrpItem.postId] = xhrpItem;
                }
            }
        }

        //switch (entryContext.entryType) {
        //    case EntryType.TimelineTimelineItem:
        //        content = entry;
        //        xhrp.setPropertiesByEntry(content);
        //        break;
        //    case EntryType.TimelineTimelineModule:
        //        content = entry.content.items[entry.content.items.length - 1].item;
        //        xhrp.setPropertiesByEntry(content);
        //        xhrp.items = [];
        //        for (var i = 0; i < entry.content.items.length - 1; i++) {
        //            let xhrpItem = new XhrPost();
        //            xhrpItem.setPropertiesByEntry(entry.content.items[i].item);
        //            sessionVars.page.xhrPosts[xhrpItem.postId] = xhrpItem;
        //            xhrp.items.push(xhrpItem);
        //            sessionVars.page.xhrPosts[xhrpItem.postId] = xhrpItem;
        //        }
        //        break;
        //}

        if (!xhrp.postId) return;

        sessionVars.page.xhrPosts[xhrp.postId] = xhrp;

        if (xhrp.repost) {
            sessionVars.page.xhrPosts[`${xhrp.repost.postId}repost`] = xhrp.repost;
        }

        if (!sessionVars.page.feedUser && requestContext.feed === feeds.UserTweets && requestContext.urlInfo.variables.userId === xhrp.user.restId) {
            sessionVars.page.feedUser = xhrp.user;
        }

        const context = { post: xhrp, entryContext, entry, entries, requestContext };

        let byUser = xhrPostsByUser[xhrp.virtualPost.user.username];

        if (!byUser) {
            byUser = xhrPostsByUser[xhrp.virtualPost.user.username] = { count: 0 };
        }

        byUser.count++;

        let response;
        for (const key in contentHandlers) {
            //get handler settings; not the same as the handler below
            let handlerSettings = sessionVars.settings.contentHandlers[key];

            if (!handlerSettings?.enabled) continue;
            if (
                handlerSettings?.excludeFollowing === true &&
                (xhrp.user.following || isUserWhitelisted(xhrp.user))
            ) continue;

            //not the same as sessionVars.settings.contentHandlers just above!!!
            let handler = contentHandlers[key];

            response = handler.Handle(context);

            if (
                response?.exit ||
                (handlerSettings.exitOnDelete && context.post.virtualPost.deleted)
            ) break;
        }

        if (xhrp.virtualPost.score < 0) {
            xhrp.virtualPost.addInfo(`Quality score: ${xhrp.virtualPost.score}`);
        }

        return context;
    }

    function processXhrPost(postContext) {
        let post = postContext.post.virtualPost;
        //let post = postContext.post;

        if (isTypedSearch && !sessionVars.settings.general.enableDeletesMutesOnTypedQueries) {
            post.deleted = false;
            post.muted = false;
            //post.doNotDelete = true;
            post.doNotMute = true;
            return;
        }

        function clogit(msg) {
            let msgs = post.getAllMessages();

            if (msgs.length === 0) return;

            msg = msg ? `${msg} - ` : '';
            msg = `${msg}${msgs.join("; ")}`;
            clogxhrpost(msg, postContext);
        }

        //function clogit(msg) {
        //    nuked = true;
        //    msg = `${msg} - ${post.getAllMessages().join("; ")}`;
        //    clogxhrpost(msg, postContext);
        //}

        //prioritize mute over delete; keeps post in timeline for manual/auto mute
        if (post.muted) {
            if (post.doNotMute) {
                post.muted = false;
            } else {
                clogit("Muted");
                return;
            }
        }

        if (post.deleted && !sessionVars.settings.general.enableDeletes) {
            post.deleted = false;
            if (!sessionVars.settings.general.suppressDeletesNotEnabledMessage) {
                post.addInfo("Deletes not enabled. Go to Twat Doc Config > general > enableDeletes");
            }
        }

        //if (!post.deleted) return;

        /*
        experimental: don't delete the post from array if the clickNotInterestedIn
        instruction is present
         */
        if (post.deleted && postContext.requestContext.feed === feeds.HomeTimeline &&
            (
                post.menuItem === CaretMenuOptions.notInterestedInThisPost ||
                sessionVars.settings.experimental.clickNotInterestedIn
            )
        ) {
            post.menuItem = CaretMenuOptions.notInterestedInThisPost;
            post.deleted = false;
        }

        if (
            sessionVars.settings.experimental.hideHighScoreAboveThresholdEnabled &&
            post.score >= sessionVars.settings.experimental.hideHighScoreAboveThreshold
        ) {
            post.deleted = true;
        }

        if (post.deleted) {
            //don't delete posts with low score so that they show in the feed for manual/auto-mute
            if (
                post.score > sessionVars.settings.general.hidePostOverrideScoreThreshold &&
                /*!post.doNotDelete && */postContext.entryContext.singleAuthor
            ) {
                if (!post.menuItem) {
                    if (sessionVars.settings.general.enableDeletes) {
                        removeXhrEntry(
                            postContext.requestContext.xhrIndex,
                            postContext.entryContext,
                            postContext.entries,
                            postContext.requestContext
                        );
                        delete sessionVars.page.xhrPosts[postContext.post.postId];
                        //delete sessionVars.page.xhrPosts[post.postId];
                        clogit("Removed");
                    } else {

                    }
                }
            }
        }
    }

    function removeXhrEntry(index, entryContext, entries, requestContext) {
        if (!sessionVars.settings.general.enableDeletes) return;
        //if (entries[index] )
        //if (entries[index].twatTemp?.isTimelineAddition && requestContext.tlItemsProcessed >= requestContext.tlItemCount - 1) return;
        if (
            entryContext.isTimelineAddition &&
            !userContentEntryIdTypes.includes(entryContext.entryIdType)
            && requestContext.tlItemsProcessed >= requestContext.tlItemCount - 1
        ) return;

        requestContext.tlItemsProcessed++;
        entries.splice(index, 1);
        requestContext.isDirty = true;
    }

    function onEntry(entry, entryMeta, requestContext) {

    }

    // -----------------------------------
    // Backend: Filters and Handlers
    // -----------------------------------
    const allowedLangs = [wiff(sessionVars.settings.lang, x => x ? x : null) ?? "en", "qam", "qct", "qht", "qme", "qst", "zxx", "art", "und"];
    //const bannedLangs = ["ar", "bn", "cs", "da", "de", "el", "_es", "fa", "fi", "fil", "fr", "he", "hi", "hu", "id", "it", "ja", "ko", "msa", "nl", "no", "pl", "pt", "ro", "ru", "sv", "th", "tr", "uk", "ur", "vi", "zh"];

    //🤷🤦🤼🤾🤽👶👦👧🧒👨👩🧑👱👴👵🧓👮👷💂🕵️👩‍⚕️👨‍⚕️🧑‍⚕️👩‍🌾👨‍🌾🧑‍🌾👩‍🍳👨‍🍳🧑‍🍳👩‍🎓👨‍🎓🧑‍🎓👩‍🎤👨‍🎤🧑‍🎤👩‍🏫👨‍🏫🧑‍🏫👩‍🏭👨‍🏭🧑‍🏭👩‍💻👨‍💻🧑‍💻👩‍💼👨‍💼🧑‍💼👩‍🔧👨‍🔧🧑‍🔧👩‍🔬👨‍🔬🧑‍🔬👩‍🎨👨‍🎨🧑‍🎨👩‍✈️👨‍✈️🧑‍✈️👩‍🚀👨‍🚀🧑‍🚀👩‍🚒👨‍🚒🧑‍🚒👰🤵👳🧕🙍🙎🙅🙆💁🙋🧏🙇💆💇🚶🧍🧎🏃💃🕺🧗🧘🤰🤱👩‍🍼👨‍🍼🧑‍🍼🧑‍🎄🎅🤶🧙🧝🧛🧜🧞🧟👼👋🤚🖐✋🖖👌🤌🤏✌️🤞🤟🤘🤙👈👉👆🖕👇☝️👍👎✊👊🤛🤜👏👐🙌🤲🤝🙏✍️💅🤳💪🏻

    const antiPattern = "(🖕|👎|fuck|🚫|⛔|❌|no|not|anti|against|opposed to)(the)?\\W*";

    //neganate
    //neganator
    //this regex fails because 🍉 is technically preceded by "no" in the antifier.
    ///(?<!(🖕|👎|fuck|🚫|⛔|❌|no|not|anti|against|opposed to)(the)?\W*)🍉/.exec("🏝Giorno🍉")
    function antify(s) {
        return `(?<!${antiPattern})${s}`;
    }

    function nonHashtagify(s) {
        return `\\b(?<!#)(${s})\\b`;
    }

    const filterActions = {
        hide: "hide",
        mute: "mute"
    };

    //⚧ (U+26A7, transgender symbol)
    //❤️🤍💙 usa colors

    /**
function optimizeForHashtag(pattern) {
  // Step 1: Remove \W* and \W
  let optimized = pattern.replace(/\\W*\*?/g, '');

  // Step 2: Simplify groups (both () and []) containing only one pattern
  // Handle cases like (pattern), [pattern], (||pattern), or [||pattern]
  optimized = optimized.replace(/(\(|\[)(\|*\w+\|*|\|*)(\)|\])/g, (match, open, content, close) => {
    // Remove any leading or trailing | from the content
    const cleanContent = content.replace(/^\|+|\|+$/g, '');
    // If content is empty or just |, return empty string; otherwise return the cleaned content
    return cleanContent === '' ? '' : cleanContent;
  });

  return optimized;
}
const patterns = [
  "Free\\W*Palestine",
  "anti\\W*(racist|fascist|fash)",
  "pan(\\W*|_)"
];

const hashtagPatterns = patterns.map(optimizeForHashtag);
console.log(hashtagPatterns);

     */

    //function flagify(flag) {
    //    let flagified = `(?<![\u{1F1E6}-\u{1F1FF}])${flag}(?![\u{1F1E6}-\u{1F1FF}])`;
    //    return flagified;
    //}

    function flagHandler(value, pattern, getMatch) {
        let flags = value.match(/[🇦-🇿]{2}/gu);
        let match;
        //const match = flags?.reduce((acc, f) => acc || getMatch(f, pattern), null);
        //?.filter(x => x.length % 4 === 0)
        flags?.find(f => f.length % 4 === 0 && (match = getMatch(f, pattern)));
        return match;
    }

    const filterDirectives = {
        emojies: [
            {
                isFlag: true,
                values: [
                    "🇪🇺", "🇮🇳", "🇮🇱",
                    "🇺🇦", "🇵🇸",
                    "(🇦🇴|🇧🇫|🇧🇮|🇧🇯|🇧🇼|🇨🇩|🇨🇫|🇨🇬|🇨🇮|🇨🇲|🇩🇯|🇪🇷|🇪🇹|🇬🇦|🇬🇭|🇬🇲|🇬🇳|🇬🇶|🇬🇼|🇰🇪|🇰🇲|🇱🇷|🇱🇸|🇲🇬|🇲🇱|🇲🇼|🇲🇿|🇳🇪|🇳🇬|🇷🇼|🇸🇨|🇸🇸|🇸🇹|🇸🇳|🇸🇴|🇸🇿|🇹🇩|🇹🇬|🇹🇿|🇺🇬|🇾🇹|🇿🇲|🇿🇼|🇭🇹)" //african countries >= 90% dindu
                ]
                    .map(x => getRegexObject(antify(x), "u")),
                score: sessionVars.settings.general.autoMuteScore * 2,
                handler: flagHandler
            },
            //{
            //    isFlag: true,
            //    values: [
            //        "🇨🇦"
            //    ]
            //        .map(x => getRegexObject(antify(x), "u")),
            //    score: -5,
            //    handler: flagHandler
            //},
            {
                values: [
                    "☪\uFE0F?", "✡\uFE0F?", "🕎", "🏳️‍⚧️|⚧", "🏳️‍🌈", "🍉", "🟦(🟨|🟧)", "💙💛", "🟨⬜️🟪⬛️",
                ]
                    .map(x => getRegexObject(antify(x), "u")),
                score: sessionVars.settings.general.autoMuteScore * 2
            },
            {
                isFlag: true,
                values: [
                    "(🇨🇻|🇳🇦|🇲🇷)" //african countries >= 70% dindu
                ]
                    .map(x => getRegexObject(antify(x), "u")),
                score: sessionVars.settings.general.autoMuteScore,
                handler: flagHandler
            },
            {
                values: [
                    "(🤷|✍|🫵|🏋|🙏|🤲|👇|🖐|💪|🤌|🙌|👍|🖕|👉|✊|👊|🫶|🫰)(🏾|🏿)",
                    "🟥⬛️🟩", "(❤️|❤)🖤💚", "🔴⚫️🟢", //pan-african colors
                    "☭", "(❤️|❤)🧡💛💚💙💜", "🩵🩷🤍", "🦋(\\W*app)?",
                    "💖💜💙", //bisexuality and the LGBTQ+ community
                    "🧡🤍🩷", //lesbian
                    "🖤🩶🤍💜" //asexual
                ].map(x => getRegexObject(x, "u")),
                score: -15
            },
            {
                values: [
                    getRegexObject(antify("💉"), "i"),
                    /😷/u, /🌊/u, /🌻/u, /(?<!🏳️‍)🌈/u,
                    /🕉/u, //Hinduism, Buddhism, and Jainism
                ],
                score: -5
            },
            {
                values: [/🩷💜💙/u],
                score: sessionVars.settings.general.autoMuteScore / 3
            },
            {
                values: [
                    //"✝️",
                    "🇺🇸",
                    "💚🤍💜" //terf/suffragette
                ],
                score: 10
            },
        ],
        hashTags: [
            {
                values: [
                    "LGBTQ", "Pansexual", "transrightsarehumanrights",
                    "blm", "BlackLivesMatter",
                    "acab", "antifa", "Anti\\W*fascist", "StopCopCity", "NoJusticeNoPeace",
                    "panafri(c|k)an(ism|ist)?s?",
                    "vote((dem(ocrat)?)|blue(NoMatterWho)?)(tosaveamerica)?", "bluewave", "BlueCrew", "fbr",
                    "(kamala|Harris)(tim|Walz)\\d*", "(kamalaharris|BidenHarris)\\d*", "ImWithHer", "StillWithHer", "kamala\\d+",
                    "fucktrump", "lovetrumpshate", "NeverTrump(er)?",
                    "NAFO", "Fella", "I?StandWithUkraine", "Slava(Ukrainii?|Ukraine)", "freePalestine",
                    "MyBodyMyChoice", "ClimateChange", "I?StandWithIsrael"
                ].map(x => `#${x}\\b`), score: sessionVars.settings.general.autoMuteScore
            },
            {
                values: ["progressive", "resist((er|or)s?|ance|ing)?"].map(x => `#${x}\\b`), score: -20
            },
            {
                values: ["vote"].map(x => `#${x}\\b`), score: -10
            },
            {
                values: ["(en\\W*)?v\\W*tuber?"].map(x => `#${x}\\b`), action: filterActions.hide
            },
            {
                values: [
                    //"maga",
                    "maha", "prolife", "1a", "2a",
                    /trump\d+/
                ].map(x => `#${x}\\b`), score: 15
            }
        ],
        pronounPatterns: [
            {
                values: [
                    { name: "theythem", pattern: wiff("(she|it|he|they|hers|her|his|him|them|xe|any)", x => `${x}(\\W*)${x}`) }, //(?!'\w)
                    wiff("(ele|dele|dela)", x => `${x}(\\W*)${x}`),
                    "any\\W*all", "any\\W*(prn|pronoun)s?"
                ].map(x => {
                    if (typeof x === 'object') {
                        x.pattern = `\\b${x.pattern}\\b`
                        return x;
                    }
                    return `\\b${x}\\b`;

                }), score: -20
            }
        ],
        text: [
            {
                values: ["(en\\W*)?v\\W*tuber?"].map(x => getRegexObject(x, "i", x => nonHashtagify(x))), action: filterActions.hide
            },
            {
                values: [
                    "never\\W*trump(er)?", "f(uck)?\\W*trump", "maga cult(ist)?",
                    "(former|ex)\\W*(republican|conservative)",
                    "(demi(?!\\s+(moore|lovato))|bi|(homo|pan|a)\\W*sexual)(\\W*sexual)?",
                    "gender\\W*fluid", "(non\\W*binary|nb)", "bi\\W*gender", "agender", "trans(gender)?(\\W*(male|man|boy|female|woman|girl))?", "ftm", "mtf",
                    "furry",
                    "lgb(t?q?i?a?)?(\\W*ally)?", "(?<!fake\\W*and\\W*)gay", "queer", "(lesbian|lesbo)", "fembo(y|i)s?", "gaymers?",
                    "Slava\\W*(Ukrainii?|Ukraine)", "Stand\\W+With\\W+Ukraine",
                    "(bsky|bky)\\.social", "bluesky", "vot(e|ed|ing) blue", "Free\\W*Palestine", "anti\\W*(racist|fascist|fash)", "pan(\\W*|_)afri(c|k)an(ism|ists?)?",
                    "bigot(ed|ted|s|ry)?",
                    "blm|Black\\W*Lives\\W*Matter", "antifa", "acab",
                    "resist(ance|or|er)?",
                    /anti\W*semit(es?|ic|ism)/,
                    "vaccinated|vaxxed|vaxd|vax'd", "boosted", "mask up", "masked", /wear(\W|_)*((a|your)(\W|_)*)?(mask|😷)/
                ].map(x => getRegexObject(x, "i", x => nonHashtagify(antify(x)))), score: -10
            },
            //{
            //    values: [
            //        "talm\\W*bout", "tryna", "(we|they)\\W+is", "(he|she|they|we)\\W+be", "niggas?"
            //    ],
            //    score: -10,
            //    getters: [fldContentBody]
            //},
            {
                values: [
                    "autistic", "neuro\\W*divergent",
                    "democracy", "(!<?(former|ex)\\W*)(democrat|liberal|progressive)",
                    "pro\\W*choice",
                    ["commun(ist|ism)", "social(ist|ism)", "femin(ist|ism)"].map(x => antify(x)),
                    "nafo",
                    "nazis?", "magats?", "trumpism",
                    "fasc(ists?|ism)", "rac(ists?|ism)", "sex(ists?|ism)", "misogyn(y|ism|(ist(ic|s?)))",
                    "homophob(es?|ic|ia)", "transphob(es?|ic|ia)", "islam[ao]phob(es?|ic|ia)",
                    "terfs?",
                    "blk",
                ].flat()
                    .map(x => getRegexObject(x, "i", x => nonHashtagify(x)))
                    .concat([getRegexObject(nonHashtagify("tR(ump|UMP)"))]), score: -5
            },
        ]
    };

    updateFilterDirectives();

    function updateFilterDirectives() {
        let dirs = filterDirectives.emojies.filter(x => x.isFlag);

        if (dirs) {
            dirs.forEach(dir => {
                dir.enabled = !!sessionVars.settings.contentHandlers.BannedText.enableFlagCheck;
            });
        }
    }

    const bannedLinkPatterns = [
        "\\w+\\.bsky\\.social", "bsky\\.app/profile/\\.+"
    ];

    const gimmickAccountPatterns = [
        "fights?", "videos?", "clips?"
    ];

    /*
     fi - elveda cartoon network ağabey
     */
    const languages = {
        "fr": "French",
        "pt": "Portuguese",
        "es": "Spanish",
        "tr": "Turkish",
        "it": "Italian",
        "de": "German",
        "in": "Indonesian",
        "pl": "Polish",
        "da": "Danish",
        "nl": "Dutch",
        "ro": "Romanian",
        "ca": "Catalan",
        "sv": "Swedish",
        "cs": "Czech",
        "vi": "Vietnamese",
        "tl": "Tagalog",
        "hi": "Hindi",
        "mr": "Marathi",
        "sa": "Sanskrit",
        "ne": "Nepali",
        "kok": "Konkani",
        "bho": "Bhojpuri",
        "mai": "Maithili",
        "sd": "Sindhi",
        "pa": "Punjabi",
        "ja": "Japanese",
        "zh": "Chinese",
        "ko": "Korean",
        "ru": "Russian",
        "th": "Thai",
        "fa": "Persian",
        "ta": "Tamil",
        "iw": "Hebrew",
        "el": "Greek",
        "bn": "Bengali",
        "ar": "Arabic",
        "ur": "Urdu",
        "ps": "Pashto",
        "gu": "Gujarati",
        "te": "Telugu",
        "kn": "Kannada",
        "or": "Odia"
    };

    /*
    Because X regularly returns incorrect language codes (English users are oftentimes flagged as "fr", "de", etc),
    need to use the patterns below to test against the language text when language is not "en"
    99% of this is credited to Grok
    */

    /*
    language todo notes here

    Lang - fi
isTranslatable
Jenkeissä suuri massa saa nyt annoksen Obama hallinnon maanpetoksesta. Moni ”salaliittoteoreetikko” taas saa seuraavan mitalin ollessa oikeassa tästäkin. Vassareiden paniikki on aivan karmea tällä hetkellä. Liberalismi on kuollut #treason #russiacollusion #obamagate

    */

    const langPatterns = [
        {
            langs: ["en"],
            patterns: [
                { pattern: /\b(the|what|this|that|these|those)\b/i, score: 100 },
                { pattern: /\b(I’m|you’re|he’s|she’s|it’s|we’re|they’re|I’ll|you’ll|he’ll|she’ll|it’ll|we’ll|they’ll)\b/i, score: 100 },
                { pattern: /\b(I|you|he|she|it|we|they|my|your|his|her|its|our|their|mine|yours|hers|ours|theirs|who|when)\b/i, score: 50 },
                { pattern: /\b(a|an|in|on|at|with|for|of)\b/i, score: 25 }
            ]
        },
        {
            langs: ["fr"], patterns: [
                { pattern: /\b(le|les|l'+\w|un|une|des|du|en|avec|je|tu|il|elle|nous|vous|ils|elles|mes|ta|tes|sa|ses|nos|ce|cet|cette|ces)\b|[éèêàçîô]/i, score: 100 },
                { pattern: /\b(de|la)\b/i, score: 25 } // "de" (French overlap), "la" (English "la")
            ]
        },
        {
            langs: ["pt"], patterns: [
                { pattern: /\b(ele|ela|nós|vós|eles|elas|meu|minha|teu|tua|nosso|nossa|este|esta|esse|essa|aquele|aquela|seu|sua|o que|quem|onde|este|essa|aquele|aquela)\b|[áéíóúâêôãõç]/i, score: 100 },
                { pattern: /\b(de|em)\b/i, score: 25 } // "de" (of), "em" (in) - common, overlap risks
            ]
        },
        {
            langs: ["es"], patterns: [
                { pattern: /\b(tú|él|ella|nosotros|vosotros|ellos|este|esta|qué|quién|dónde|te)\b|[áéíóúñ¿¡]/ig, score: 100 },
                { pattern: /\b(yo|que|de|la|en)\b/ig, score: 25 } // "yo" (pop culture), "que" (French), "de/la/en" (overlaps)
            ]
        },
        {
            langs: ["ro"],
            patterns: [
                { pattern: /\b(eu|cine|cel|cea|acest|această|nu)\b|[ăâîșț]/i, score: 100 },
                { pattern: /\b(tu|el|ea|noi|voi|ei|ele|meu|ta|al meu|al tău|al său)\b/i, score: 50 },
                { pattern: /\b(un|o|în|pe|cu|ce|îl)\b/i, score: 25 }
            ]
        },
        {
            langs: ["tr"], patterns: [
                { pattern: /\b(siz|onlar|ile|için|gibi|bir|nasıl|nerede|bu|şu)\b|[çğıöşü]/i, score: 100 },
                { pattern: /\b(i|ben|sen|de|ki)\b/i, score: 25 } // "i" (removed), "ben" (name), "sen" (Senate), "de" (French), "ki" (key)
            ]
        },
        {
            langs: ["it"], patterns: [
                { pattern: /\b(lui|lei|noi|voi|loro|gli|una|mio|miei|mie|tuo|tua|tuoi|suo|sua|suoi|nostr[oaie]|quest[oa]|quell[oa]|quei|quelle|che)\b|[àèéìòù]/i, score: 100 },
                { pattern: /\b(la|il|un|de)\b/i, score: 25 } // "la" (English), "il" (French), "un" (French), "de" (French)
            ]
        },
        {
            langs: ["de"], patterns: [
                { pattern: /\b(der|die|das|ein|eine|durch|für|um|aus|mit|zu|ich|du|er|sie|es|wir|ihr|mein|dein|sein|ihr|unser|dieser|diese|dieses|jener|jene|jenes)\b|[äöüß]/i, score: 100 },
                { pattern: /\b(in|den)\b/i, score: 25 } // "in" (English), "den" (English "den")
            ]
        },
        {
            langs: ["in"], patterns: [
                { pattern: /\b(saya|aku|kamu|dia|itu|di|ke|dari|apa)\b/i, score: 100 },
                { pattern: /\b(ini)\b/i, score: 50 } // "ini" (removed, Indonesian "this")
            ]
        },
        {
            langs: ["pl"], patterns: [
                { pattern: /\b(ja|ona|ono|wy|oni|ta|na|kto|gd\u017Aie)\b|[ąćęłńóśźż]/i, score: 100 },
                { pattern: /\b(to|ten)\b/i, score: 25 } // "to" (English), "ten" (English "ten")
            ]
        },
        {
            langs: ["da"], patterns: [
                { pattern: /\b(jeg|du|han|hun|vi|på|til|med|hvad|hvem|hvor|denne|dette|disse)\b|[æøå]/i, score: 100 },
                { pattern: /\b(den|det)\b/i, score: 25 } // "den" (English "den"), "det" (Czech "det")
            ]
        },
        {
            langs: ["nl"], patterns: [
                { pattern: /\b(het|een|ik|jij|hij|zij|wij|jullie|mijn|jouw|zijn|haar|ons|onze|dit|deze|wie|wanneer)\b|[éëí]/i, score: 100 },
                { pattern: /\b(de|van|in|op|met|we|hun|dat|die|wat)\b/i, score: 25 } // Removed Dutch terms: "de" (French), "van" (name), "in" (English), etc.
            ]
        },
        {
            langs: ["ca"], patterns: [
                { pattern: /\b(els|una|amb|ell|nosaltres|vosaltres|ells|meu|meva|teu|teva|seu|seva|nostre|nostra|aquest|aquesta|això|aquell|aquella|qui)\b|[àçèéíòóú]/i, score: 100 },
                { pattern: /\b(el|la|les|un|de|per|jo|tu|ella|què)\b/i, score: 25 } // Removed Catalan terms: "el" (Spanish), "la" (English), etc.
            ]
        },
        {
            langs: ["sv"], patterns: [
                { pattern: /\b(det|ett|om|på|för|mina|ditt|hennes|vår|vårt|våra|denna|detta|vad|vem|när)\b|[åäö]/i, score: 100 },
                { pattern: /\b(de|den|en|med|jag|du|han|hon|vi|ni|min|mitt|din|dina|hans)\b/i, score: 25 } // Removed Swedish terms: "de" (French), "en" (English), etc.
            ]
        },
        {
            langs: ["cs"], patterns: [
                { pattern: /\b(já|ona|vy|oni|v|s|z|ta|kdo|kdy)\b|[áčďéěíňóřšťúůýž]/i, score: 100 },
                { pattern: /\b(tady|že|ale|o|to|co|ty|on|na|ten|my)\b/i, score: 50 }
            ]
        },
        {
            langs: ["vi"], patterns: [
                { pattern: /\b(tôi|bạn|anh|chị|chúng|tôi|bạn|ở|với|này|nào|khi)\b|[ăâđêôơưàảãáạèẻẽéẹìỉĩíịòỏõóọùủũúụỳỷỹýỵ]/i, score: 100 },
                { pattern: /\b(ai|cho)\b/i, score: 25 } // "ai" (who), "cho" (for) - removed earlier
            ]
        },
        {
            langs: ["tl"], patterns: [
                { pattern: /\b(ako|ka|siya|kami|tayo|kayo|sila|sa|ng|kay|para|ito|iyan|iyon|ngayon|ano|sino)\b|[áéíóú]/i, score: 100 },
                { pattern: /\b(ang|isang|akin|iyo|kanya|amin|atin|inyo|kanila|kailan)\b/i, score: 50 } // Full table terms, overlap minimal
            ]
        },
        {
            langs: ["hi", "mr", "sa", "ne", "kok", "bho", "mai", "sd"], patterns: [
                { pattern: /[\u0900-\u097F]/u, score: 100 } // Devanagari (Hindi, Marathi, etc.)
            ]
        },
        {
            langs: ["pa"], patterns: [
                { pattern: /[\u0A00-\u0A7F]/u, score: 100 } // Gurmukhi (Punjabi)
            ]
        },
        {
            langs: ["ja", "zh"], patterns: [
                { pattern: /[一-龯ぁ-んァ-ヾー々]/u, score: 100 } // Japanese/Chinese chars
            ]
        },
        {
            langs: ["ko"], patterns: [
                { pattern: /[\uAC00-\uD7A3\u1100-\u11FF\u3131-\u318E\uA960-\uA97C\uD7B0-\uD7FB]/u, score: 100 } // Korean Hangul/Jamo
            ]
        },
        {
            langs: ["ru"], patterns: [
                { pattern: /[А-ЯЁ]/iu, score: 100 } // Cyrillic (Russian)
            ]
        },
        {
            langs: ["th"], patterns: [
                { pattern: /[\u0E00-\u0E7F]/u, score: 100 } // Thai
            ]
        },
        {
            langs: ["bn"],
            patterns: [{ pattern: /[\u0980-\u09FF]/u, score: 100 }]
        },
        {
            langs: ["ar"],
            patterns: [{ pattern: /[\u0621-\u064A\u0660-\u0669]/i, score: 100 }] // Keep narrow
        },
        {
            langs: ["fa", "ur", "ps"],
            patterns: [{ pattern: /[\u0600-\u06FF]/u, score: 100 }] // Broader
        },
        {
            langs: ["ta"], patterns: [
                { pattern: /[\u0B80-\u0BFF]/u, score: 100 } // Tamil
            ]
        },
        {
            langs: ["iw"], patterns: [
                { pattern: /[\u0590-\u05FF]/u, score: 100 } // Hebrew
            ]
        },
        {
            langs: ["el"], patterns: [
                { pattern: /[\u0370-\u03FF]/u, score: 100 } // Greek
            ]
        },
        {
            langs: ["gu"],
            patterns: [
                { pattern: /[\u0A80-\u0AFF]/u, score: 100 } // Gujarati script
            ]
        },
        {
            langs: ["te"],
            patterns: [
                { pattern: /[\u0C00-\u0C7F]/u, score: 100 } // Telugu script
            ]
        },
        {
            langs: ["kn"],
            patterns: [
                { pattern: /[\u0C80-\u0CFF]/u, score: 100 } // Kannada script
            ]
        },
        {
            langs: ["or"],
            patterns: [
                { pattern: /[\u0B00-\u0B7F]/u, score: 100 } // Odia script
            ]
        },
        {
            langs: ["am"],
            patterns: [
                { pattern: /[\u1200-\u137F]/u, score: 100 } // Ethiopic script (Amharic)
            ]
        }
    ];

    for (const lp of langPatterns) {
        for (const p of lp.patterns) {
            p.pattern = getRegexObject(p.pattern, "g");
        }
    }

    /*
    Post handlers are executed against every post in onXhrPost(). Did it this way so that you can
    define what feeds each handler does or does not execute in
     */

    const fldUsername = { field: "username", getter: post => post.user.username };
    const fldDisplayName = { field: "displayName", getter: post => post.user.displayName };
    const fldLocation = { field: "location", getter: post => post.user.location };
    const fldBio = { field: "bio", getter: post => post.user.bio };
    const fldContentBody = { field: "contentBody", getter: post => post.text };
    const usernameGetters = [fldDisplayName, fldUsername];
    const userTextFieldGetters = [fldDisplayName, fldLocation, fldBio];
    const bannedAll = forEachObjectEntry(filterDirectives, (k, v) => v).reduce((acc, v) => acc.concat(v));

    // -----------------------------------
    // Frontend: DOM and UI Logic
    // -----------------------------------

    const ContentSelectors = {
        cellInnerDiv: "div[data-testid='cellInnerDiv']",
        article: "article[role='article']",
        articleTweet: "article[data-testid='tweet']",
        trend: "div[data-testid='trend']",
    };

    const bannedTrendKeywords = [
        "sports",
        "nfl", "football", "super bowl",
        "baseball", "soccer",
        "nba", "WNBA",
        "nhl", "hockey",
        "wwe", "Wrestling", "Motorsport",
        "entertainment", "music",
        "bts",
        "Only on X",
        "Baddie",
        "Love Island usa",
        "Business and finance",
        "polymer labs",
        "Fashion & beauty"
    ];

    const bannedTrendCats = bannedTrendKeywords.map(x => getRegexObject(`trending in ${x}|${x} · trending`, 'i'));
    const bannedTrendTopics = [
        /\$\w+/, "michigan",
        /(world\W*war|ww)\W*(3|iii|three)/,
        "Pride", "Pride Month", "Happy Pride", "Happy Pride Month", "HAPPY GAY MONTH", "#PrideMonth", "#?LGBT?Q?i?a?", "#?LoveIsLove", "Pansexual",
        "monday|tuesday|wednesday|thursday|friday|saturday|sunday",
        "BaddiesAfrica", /delta\s*rune/,
        "HELL NO", "JUST ANNOUNCED",
        "#?loveislands?(usa)?",
        "Give\\W*Rep",

    ].concat(bannedTrendKeywords).map(x => getRegexObject(x, "i"));

    //let debugMode = false;
    let enabled = true;
    //let isSearch;
    let isTypedSearch;
    let isLiveSearch;
    let isPostView;
    let searchParam;
    let searchParamSanitized = false;
    let _isUserProfile = null;
    //const postAges = [];
    //const removedPostAges = [];
    const trendLock = new AsyncLock();

    class PostInfo {
        constructor(el) {
            this.el = el;
            this.elUsername = el.querySelector("div[data-testid='User-Name']");
            this.elHeader = this.elUsername.parentElement.parentElement.parentElement.parentElement;
            this.userDisplayName = this.elHeader.querySelector("a[role='link']").innerText;
            this.elSocialContext = el.querySelector("span[data-testid='socialContext']");

            this.isRepost = this.elSocialContext?.innerText.endsWith("reposted");
            //this.elTimestamp = this.el.querySelector("time");
            //this.elTimestamp = wiff(this.el.querySelectorAll("time"), x => x?.[1] ?? x[0]);
            this.elTimestamp = this.elUsername.querySelector("time") ?? wiff(this.el.querySelectorAll("time"), x => x[x.length - 1]);

            try {
                this.elContentLink = this.elTimestamp.parentElement;
            } catch (ex) {
                clog(ex);
                if (!this.elTimestamp) {
                    let elAd = Array.from(el.querySelectorAll("div[dir='ltr'] > span")).find(x => x.innerText === "Ad");
                    clog(`Ad for '${this.userDisplayName}' causing exception; will handle in future update`);
                }
                console.groupEnd();
            }

            //this.elCaret = el.querySelector("button[data-testid='caret'][aria-label='More']");
            //this.elContentLink = this.elUsername.querySelector("a[href*='/status/']");
        }
    }

    const settingsSchema = generateSchema(sessionVars.settings);
    const settingsTooltipsKey = "settingsTooltips";

    function getHardcodedSettingsTooltips() {
        let tooltips = `
{"general":{"lang":"Your preferred language. Use 'en' for English. Look up 'ISO 639 language codes' for a complete list to find your language code.","postAge1":"Misc field used for color-coding which I recommend keeping disabled","postAge2":"Misc field used for color-coding which I recommend keeping disabled","postAge3":"Misc field used for color-coding which I recommend keeping disabled. Also used to detect very old content for the SeenPosts feature.","oldPostScoreThreshold":"","hidePostOverrideScoreThreshold":"Shows content that would normally be removed from the feed due to a low score if its score is <= this value. Useful for monitoring low-score content for manual muting.","autoMuteScore":"Use at your own risk. If enableMutes is on, authors with a quality score <= this value are automuted. CAUTION: A value too close to zero mutes more accounts; too high causes muting sprees. -30 works for me. Unmute accounts at https://x.com/settings/mute_and_block if you overdo it.\\n\\nIf you want to test automute, set it to a low value like -60 and then search #fursuitfriday or #criticalrolespoilers with the BannedText content handler enabled (enabled by default). Lots of they/thems in those feeds which will easily hit the -60 threshold without automuting the entire feed.","devMode":"Unlocks features for extension development. You don't need this unless you're me.","liveAggregateCountingEnabled":"Enables data/metric-related features. Must be on for those to work.","enableDeletes":"Allows content handlers to remove posts from feeds. Won't happen unless this is checked.\\n\\nNote: All deleted content is logged in your browser's dev console, usually accessible via F12.","enableDeletesMutesOnTypedQueries":"Separate option to allow you to enable/disable deletes/mutes for typed searches (as opposed to clicking a hashtag or trend). Allows you to prevent removal of content that might be relevant to your search.","suppressDeletesNotEnabledMessage":"Suppresses the 'Deletes not enabled' message on posts if you chose to leave deletes disabled.","enableMutes":"Enter 'ENABLED' in this field to enable automuting. It's just a macro that clicks 'Mute' from the content caret menu when a post's score is <= autoMuteScore.\\n\\nWARNING: I recommend keeping disabled as the automute criteria is hardcoded and arbitrary according to my personal preferences until I make it user-configurable. For example, accounts with 🍉 emojis in name or bio are automuted on sight. You may not want to mute those, so keep this disabled. Muting is a nuclear option that should only be automated if you're aware of the risks.","enableTrendFilters":"Removes certain trends from the sidebar. Keep disabled for now as the trends are hardcoded to my preferences (e.g., no sports) until I make this user-configurable."},"account":{"__tooltip":"Account-related information.","username":"Your @username (joeschmoe), not your display name (Joe Schmoe).\\n\\nNot required, but necessary for features that require your username in order to differentiate your content from others. This will prevent features such as [contentHandlers > MutedBlocked] from removing reposts/quotes from accounts you've muted/blocked while you view your own profile."},"performance":{"clearXhrPostCacheOnUrlChange":"Clears post cache on every URL change (switching feeds, opening images, etc). Pros: Simple and effective solution to the memory leak issue as it prevents the cache from growing until the page runs out of memory and crashes. Cons: Breaks things on back navigation, so viewing a lib feed that's displaying pronouns, 🍉 emojis, etc, loading a new feed, and then returning to the lib feed will cause all of that information to be lost, but that's the worst case.\\n\\n2025-9-18: I am still working on ways to optimize memory usage and better account for Twatter's SPA architecture so that this feature is no longer necessary. If you leave this unchecked, the memory leak will only surface on long-running page lifecycles. A full page refresh will always nuke the cache and return everything to normal."},"contentHandlers":{"__tooltip":"Filters that execute against every post, removing them from feeds or modifying their content template if they meet certain criteria. Check/uncheck 'enabled' to enabled/disable a filter at any time. No full page refresh is necessary, though they won't take effect until the feed loads its next batch of content.\\n\\nOn slow machines, enabling too many handlers may cause lag while scrolling feeds. My AMD Ryzen 7 7800X3D with 64GB RAM handles them fine unless DevTools is open on the Network tab.\\n\\nRemoved content is logged in your brower's console which is accessed by pressing F12 on most browsers.","TagSpam":{"__tooltip":"Political trend searches are flooded with hashtag and mention spam. These settings clean up feeds by removing spammy content. Applies to all feeds.","hashtagThreshold":"Hides posts with >= this number of hashtags.","menchieThreshold":"Hides posts with >= this number of mentions."},"SearchSpam":{"threshold":"Shows a notification when a user's post count in a feed hits this threshold. Helps spot accounts spamming trends (searches) so you can mute them.","scoreMultiplier":"If scoring is enabled, multiplies a user's post count by this factor and adds it to their score. Example: If their score is 20, they have 10 posts, and the multiplier is 2, their new score is 20 + (10 * 2) = 40. Keep disabled; this feature triggers too many automutes and needs refinement.","enableScoring":""},"SearchQuality":{"contentThresholdPercent":"Hides posts where hashtags or mentions make up > this % of content. Useful for trends where users spam hashtags/mentions with no meaningful text. Set to 50 to hide posts where half the content is hashtags or mentions.","includeHashtags":"","includeMenchies":"","includeSearchTerms":""},"BannedText":{"__tooltip":"The extension's flagship feature, enabled by default. Flags authors with poor mental health indicators in posts, like pronouns, 🏳️‍⚧️, 🏳️‍🌈, 🍉, 💉, #ACAB, #BLM, etc. More egregious text lowers the score. If automuting is on and the author's score hits the threshold, they're muted.\\n\\nThis filter is processor-intensive with heavy use of regex and may thrash lower-end machines. User-defined filters are planned. Check the source code's 'filterDirectives' for the current list.","enableDeletes":"Enables deletes for certain filter directives. Right now, vtuber content is removed instead of scored. It's a hardcoded personal preference until I make filter directives fully configurable. Just leave disabled for now unless you hate vtubers as much as I do.","enableFlagCheck":"Detects certain country flag emojis like 🇪🇺 (European Union), 🇮🇳 (India), etc. Requires a separate flag check to split adjacent flags into graphemes. Made this feature optional in the event that it causes issues on slow machines, but it should be performant overall."},"UserAccount":{"hideDefaultPfp":"Hides content from accounts with default profile pictures."},"BlackWhite":{"__tooltip":"Alerts when content capitalizes 'black' but not 'white.' Not working yet, so keep disabled.","minScore":""},"Lang":{"__tooltip":"Twatter loves shoving foreign language posts into feeds, especially in trends and searches. Enable this to remove them. Tip: Add 'lang:en' (or your language code) in [search > args] in these settings to filter out foreign languages at the backend for better results.","languageConfidenceScore":"Twatter sometimes mislabels languages (e.g., tagging English as 'es' for Spanish). Set a high confidence score to reduce false positives due to word overlaps across languages.","hideBannedLangs":"Hides non-English content, even if Twatter mislabels it.","hideGrokTranslatedPosts":"Removes all Grok-translated posts."},"UserContent":{"__tooltip":"Fine-tuned control over content sources. Great for hiding vain self-promotion where authors repost their own content or quotes of themselves.","allowRepostOfOther":"Shows reposts of non-self authors (e.g., johndoe can repost others).","allowRepostOfSelf":"Shows self-authored reposts (e.g., johndoe can repost himself).","allowQuoteOfOther":"Shows non-self quotes (e.g., johndoe can quote others).","allowQuoteOfSelf":"Shows self-authored quotes (e.g., johndoe can quote himself).","allowRepostOfQuoteOfSelf":"Shows reposts of self-authored quotes (e.g., johndoe can repost his own quote).","allowRepostOfReplyToSelf":"Shows reposts of self-authored replies (e.g., johndoe can repost his reply to himself).","allowQuoteOfReplyToSelf":"Shows quotes of self-authored replies (e.g., johndoe can quote his reply to himself).","allowUnavailableQuotes":"Shows posts marked as 'Unavailable Quote' (e.g., when you're blocked/muted by the quoted author or the quoted content was deleted).","hideRepostOfOther":"Hides reposts of non-self authors (e.g., johndoe can repost others).","hideRepostOfSelf":"Hides self-authored reposts (e.g., johndoe can repost himself).","hideQuoteOfOther":"Hides non-self quotes (e.g., johndoe can quote others).","hideQuoteOfSelf":"Hides self-authored quotes (e.g., johndoe can quote himself).","hideRepostOfQuoteOfSelf":"Hides reposts of self-authored quotes (e.g., johndoe can repost his own quote).","hideRepostOfReplyToSelf":"Hides reposts of self-authored replies (e.g., johndoe can repost his reply to himself).","hideQuoteOfReplyToSelf":"Hides quotes of self-authored replies (e.g., johndoe can quote his reply to himself).","hideUnavailableQuotes":"Hides posts marked as 'Unavailable Quote' (e.g., when you're blocked/muted by the quoted author or the quoted content was deleted)."},"ViewLikeRatios":{"__tooltip":"Dorsey-era algorithms still push leftist content, especially from small, unverified accounts with few followers. High view-to-follower or like-to-follower ratios often signal leftist content. If you don't see pronouns, 🏳️‍⚧️, 🏳‍🌈, 🍉, 💉, #ACAB, or #BLM, check the post's comments or the author's reposts and quotes for leftist connections in Twatter's woke network.","likeCountThreshold":"Minimum likes required before calculating metrics.","showExtendedContentMetrics":"Displays additional metrics for content.","alwaysShowContentRatios":"Shows metrics for all content, always."},"SeenPosts":{"__tooltip":"Hides posts you've already seen, tracked in browser local storage and cleaned up on a schedule you set here.","maintenanceIntervalHours":"Hours between cleanups of tracked seen posts in local storage.","trackingHours":"Hours to track seen posts before cleanup. 48 hours seems to be Twatter's threshold for showing old content. Increase if you see older posts.","hideSeenPostsAgeHours":"Hides posts after they're seen for the first time once they reach this age.","hideSeenPostsCount":"Hides posts after they've been seen this many times.","clickNotInterestedIn":"Auto-clicks 'Not interested in this post' in the caret menu instead of removing posts outright. Aims to tell Twatter to stop showing the content, but its impact on future content from that author is unclear. Use at your own risk."},"MutedBlocked":{"__tooltip":"Twatter still shows content from muted/blocked accounts or those who've blocked you in some feeds (e.g., user profiles, communities), often as 'This post is unavailable.' These settings forcibly remove such content.","hideMuted":"Hides content from accounts you've muted.","hideBlocked":"Hides content from accounts you've blocked.","hideBlockedBy":"Hides content from accounts that blocked you.","hideMutedRepost":"Hides reposts of accounts you've muted.","hideBlockedRepost":"Hides reposts of accounts you've blocked.","hideBlockedByRepost":"Hides reposts of accounts that blocked you.","hideMutedQuote":"Hides content quoting authors you've muted.","hideBlockedQuote":"Hides content quoting authors you've blocked.","hideBlockedByQuote":"Hides content quoting authors who blocked you."},"UnavailableRefPost":{"enabled":""},"RemoveNonrepliesOnRepliesFeed":{"__tooltip":"Removes non-replies (posts, reposts, quotes) from the Replies tab in user profiles."},"SubLock":{"__tooltip":"Removes sub-locked posts. I don't subscribe to accounts, so I can't test how this affects promoted posts from accounts you're subbed to. I don't have access to that data object, so I can't code for it."},"Communities":{"__tooltip":"Removes community content from all feeds (For You, trends, etc). Future plan: Exclude communities you're in or manage a whitelist."},"Business":{"__tooltip":"Removes content from business accounts (yellow/gold star)."},"Symbols":{"__tooltip":"Removes content with $ symbols (stocks, crypto, etc)."},"Parody":{"__tooltip":"Removes content from accounts flagged as parody."},"MuskBot":{"__tooltip":"Removes content from accounts with 'elon' or 'musk' in the name that aren't @elonmusk."},"SearchTextInUsername":{"__tooltip":"Removes content from accounts with the search query in their username from searches/trends."},"VideoGimmick":{"__tooltip":"Hides content from usernames matching gimmick accounts. Keep disabled; criteria are hardcoded to my preferences and may hide content you want."},"SelfLink":{"__tooltip":"Removes content with links matching domains in the author's bio. Great for ditching mainstream news and small rags, but also removes YouTubers linking their own content if their channel is in their bio."},"BannedLinks":{"__tooltip":"Keep disabled; banned links are hardcoded to my preferences. User-defined links are planned."},"ColorCoding":{"__tooltip":"Color-codes posts by age to show how old they are, useful for avoiding replies to stale content. Keep disabled until I make colors and thresholds configurable."},"Misc":{"__tooltip":"Miscellaneous filters for testing before they get their own handler. Keep disabled."}},"muteAndHide":{"__tooltip":"Settings to manage muting and hiding content.","whitelist":"Comma-separated list of usernames (e.g., johndoe, not John Doe) to exempt from auto-mute/auto-hide, in case accounts you follow have mental health indicators in their username or bio."},"experimental":{"__tooltip":"Don't touch these. I use them to test new features, and they're not ready for public use.","hideHighScoreAboveThresholdEnabled":"","hideHighScoreAboveThreshold":"Hide posts with scores greater than this value. Useful for seeing just how many low-score posts exists in a feed.","clickNotInterestedIn":"Always click 'Not interested in this post' instead of removing content from instruction array."},"dataMiner":{"enableCommentSectionRankingAnalysis":"Shows content rank scores and metrics in comment sections. Useful for checking a thread's visibility metrics with an alt account compared to your main account's post. Buggy due to Twatter's messy data structure."},"dev":{"__tooltip":"Dev and diagnostic tools for debugging.","debugging":{"globalDebugMode":"Enables global debug mode for the extension and its libraries.","debugModeUi":"Shows UI-related debug info where applicable.","api":{"enabled":"","logUrl":"Logs API URL data."},"data":{"enabled":"","logEntryType":"Logs entry metadata to the console."}}},"apiIntercept":{"__tooltip":"Advanced options to tweak HTTP request payloads. Don't enable unless you know what you're doing. I don't even know what some of these do yet, and some might not even do anything at all.","requests":{"enabled":"","searchParams":{"enabled":"","included_x_handles":"","included_x_handles_enabled":""},"apiVariablesIntercept":{"enabled":"","variables":{"count":""}},"apiFeaturesIntercept":{"__tooltip":"I pulled these parameters from the API requests and made them editable. I don't know what all of them do, and some I can't get to work consistently as I haven't debugged them thoroughly enough.","features":{"rweb_video_screen_enabled":"","payments_enabled":"","profile_label_improvements_pcf_label_in_post_enabled":"","rweb_tipjar_consumption_enabled":"","verified_phone_label_enabled":"","creator_subscriptions_tweet_preview_api_enabled":"","responsive_web_graphql_timeline_navigation_enabled":"","responsive_web_graphql_skip_user_profile_image_extensions_enabled":"","premium_content_api_read_enabled":"","communities_web_enable_tweet_community_results_fetch":"","c9s_tweet_anatomy_moderator_badge_enabled":"","responsive_web_grok_analyze_button_fetch_trends_enabled":"","responsive_web_grok_analyze_post_followups_enabled":"","responsive_web_jetfuel_frame":"","responsive_web_grok_share_attachment_enabled":"","articles_preview_enabled":"","responsive_web_edit_tweet_api_enabled":"","graphql_is_translatable_rweb_tweet_is_translatable_enabled":"","view_counts_everywhere_api_enabled":"","longform_notetweets_consumption_enabled":"","responsive_web_twitter_article_tweet_consumption_enabled":"","tweet_awards_web_tipping_enabled":"","responsive_web_grok_show_grok_translated_post":"This appears to include/exclude Grok-translatable foreign language content. Uncheck to exclude all from feeds to conserve data and avoid rate limits.","responsive_web_grok_analysis_button_from_backend":"","creator_subscriptions_quote_tweet_preview_enabled":"","freedom_of_speech_not_reach_fetch_enabled":"Ominous indeed. I haven't figured out what this does, but it's probably one of the muskrat's anti-free-speech features. If you can figure it out, let me know.","standardized_nudges_misinfo":"","tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":"","longform_notetweets_rich_text_read_enabled":"","longform_notetweets_inline_media_enabled":"","responsive_web_grok_image_annotation_enabled":"","responsive_web_grok_imagine_annotation_enabled":"","responsive_web_grok_community_note_auto_translation_is_enabled":"","responsive_web_enhance_cards_enabled":""}}},"responses":{"enabled":""}},"search":{"__tooltip":"Customize search behavior.","args":"Injects custom search parameters into every search. For example, add 'lang:en' (no quotes) to see only English posts. Ask Grok for Twatter's full list of supported search parameters."},"visual":{"disableContentClickEvent":"Disables the annoying click event covering entire content templates. Now, only clicking the timestamp or quoted content opens the post. Prevents accidental opens when aiming for the like button, caret menu, etc.","betterContentTimestamps":"Converts absolute dates (e.g., 'Sep 3') to relative ones (e.g., '1.95d' for years/months/days/hours ago).","betterContentTimestampThresholdDays":"If a post's timestamp is older than this many days, uses Twatter's native format to avoid messy timestamps like '5.6y' that require mental math.","largerContentInteractionButtons":"Increases the size of interaction buttons at the bottom of content templates.","showVideoUrls":"Shows direct MP4 video URLs in content templates with all available resolutions. Open links in a new tab to watch videos in your browser's native player or right-click to save without needing Premium."},"tools":{"__tooltip":"Miscellaneous tools I use. Explanations coming later."}}
        `;
        return tooltips;
    }

    function getSettingsTooltips() {
        let settingsTooltips;

        settingsTooltips = JSON.parse(getHardcodedSettingsTooltips());

        //if (true || sessionVars.settings.general.devMode) {
        //    settingsTooltips = localStorage[settingsTooltipsKey] ?? getHardcodedSettingsTooltips();

        //    settingsTooltips = settingsTooltips ? JSON.parse(settingsTooltips) : {};
        //} else {
        //    settingsTooltips = getHardcodedSettingsTooltips();
        //}

        return settingsTooltips;
    }

    let settingsTooltips = getSettingsTooltips();

    const editor = new ObjectEditor(settingsSchema, () => sessionVars.settings, (s, options) => {

        modifySettings(s);

        //if (sessionVars.settings.general.devMode) {
        //    localStorage[settingsTooltipsKey] = JSON.stringify(settingsTooltips);
        //}
        if (options?.temp) {
            _settingsTemp = s;
        } else {
            sessionVars.settings = s;
            saveSettings();
        }

        afterSaveSettings();
    }, settingsTooltips, { devMode: sessionVars.settings.general.devMode });

    function afterSaveSettings() {
        forEachObjectEntry(contentHandlers, (k, v) => {
            v.settings = null;
        });
        setContentClickEvent();

        updateFilterDirectives();
    }

    function createGenericButton(text = 'Generic Button', iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z') {
        const button = document.createElement('button');

        // Set attributes and inline styles for modern UI
        button.setAttribute('aria-label', text);
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.gap = '12px';
        button.style.width = '100%'; // Fits parent container
        button.style.padding = '12px 16px';
        button.style.backgroundColor = 'gray';
        button.style.border = 'none';
        button.style.borderRadius = '50px'; // Pill-shaped
        button.style.color = '#000000';
        button.style.fontSize = '16px';
        button.style.fontWeight = '500';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.2s ease, transform 0.1s ease';
        button.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

        // Create SVG icon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.width = '24px';
        svg.style.height = '24px';
        svg.style.fill = 'currentColor';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', iconPath); // Default is a simple info icon; replace as needed
        svg.appendChild(path);

        // Create text span
        const span = document.createElement('span');
        span.textContent = text;

        // Append icon and text to button
        button.appendChild(svg);
        button.appendChild(span);

        // Example click handler (add your own functionality)
        //button.addEventListener('click', (e) => {
        //    e.preventDefault(); // Prevent any default behavior
        //    //console.log(`${text} button clicked!`);
        //    // Add your custom action here
        //});

        return button;
    }

    waitUntil(() => document.querySelector("nav[role='navigation']") || document.querySelector("header[role='banner'] h1[role='heading']")).then(nav => {
        let btn = createGenericButton("Twat Doc Config");
        nav.appendChild(btn);
        editor.init(btn);
    });

    function onContent(el) {
        let articleTweet = el.querySelector("article[data-testid='tweet']");
        if (articleTweet) {
            onPost(el);
        } else {
            if (sessionVars.settings.general.enableTrendFilters) {
                let trend = el.querySelector(ContentSelectors.trend);
                if (trend) onTrend(trend);
            }
        }
    }

    async function onTrend(trend) {
        if (trend.closest("div[aria-label='Timeline: Your Home Timeline']")) return;

        let mainNode = trend.firstElementChild; //parent of child components

        //let trendText = wiff(wiff(mainNode.childNodes[0].childNodes, x => x[x.length - 1]).innerText.split("·"), x => x && x.length === 2 ? x[0] : null);
        let trendText = wiff(mainNode.childNodes[0].childNodes, x => x[x.length - 1]).innerText;

        let hide = false;

        //hide = trendText && bannedTrendCats.find(x => x.exec(trendText));

        hide = trendText && bannedTrendCats.find(x => x.exec(trendText));

        if (!hide) {
            trendText = mainNode.childNodes[1].innerText;
            hide = bannedTrendTopics.some(x => trendText.match(x));
        }

        if (hide) {
            async function HideTrend(target) {
                let btn = target.querySelector("button");
                if (!btn) return;
                btn.click();
                let elMenu = await waitUntil(() => document.body.querySelector("div[role='menu']"), 200);
                let x = await waitUntil(() => elMenu.querySelector("div[data-testid='Dropdown']"), 200);
                if (x) {
                    let removalOption;

                    removalOption = "Not interested in this";
                    //removalOption = "The associated content is not relevant";

                    let items = Array.from(x.childNodes);
                    let item = items.find(x => x.innerText === removalOption);

                    clog(`Removed trend ${trendText.replaceAll("\r", '').replaceAll("\n")}`);

                    item.click();
                }
            }

            waitUntilScrolled(trend).then(async trend => await trendLock.executeLocked(async () => HideTrend(trend)));

            //let elCaret = trend.querySelector("button[data-testid='caret'][aria-label='More']");
            //waitUntilScrolled(trend).then(async trend => taskQueue.addTask(async () => clickContextMenuItem(elCaret, "Not interested in this")));
        }
    }

    function onPost(el) {
        let pi = new PostInfo(el);
        _onPost(el, pi);
    }

    function addPostInfo(el, msg) {
        var elInfoItem = document.createElement("div");
        elInfoItem.innerText = msg;
        el.appendChild(elInfoItem);
    }

    window.addDomWatcher = function (selector, action, type = MutationCrudType.Add) {
        let watcher = {};
        if (typeof selector === 'string') {
            watcher.node = selector;
        } else if (typeof selector === 'object' && selector !== null) {
            watcher.target = selector.target;
            watcher.node = selector.node;
        } else {
            console.error('addDomWatcher: Invalid selector. Must be string or object { target?, node? } with at least one.');
            return;
        }
        if (!watcher.target && !watcher.node) {
            console.error('addDomWatcher: At least one of target or node selector must be provided.');
            return;
        }
        if (typeof action !== 'function') {
            console.error('addDomWatcher: Action must be a function(target, node).');
            return;
        }
        if (!['add', 'remove'].includes(type)) {
            console.error('addDomWatcher: Invalid type. Must be "add" or "remove".');
            return;
        }
        watcher.action = action;
        watcher.type = type;
        watchers.push(watcher);
        //console.log(`Added DOM watcher: ${JSON.stringify({ target: watcher.target, node: watcher.node, type })}`);
    };


    function waitForAddition({ target, node }) {
        return waitForDomUpdate({ target, node, type: MutationCrudType.Add });
    }

    function waitForRemoval({ target, node }) {
        return waitForDomUpdate({ target, node, type: MutationCrudType.Remove });
    }

    function waitForDomUpdate({ target, node, type }) {
        return new Promise((resolve, reject) => {
            addDomWatcher({ target, node, type }, (t, n) => {
                resolve({ target: t, node: n });
            }, type);
            // Optional: Add a timeout to reject if needed, e.g., setTimeout(() => reject('Timeout'), 10000);
        });
    }

    const taskQueue = new TaskQueue();

    async function clickContextMenuItem(elCaret, itemText) {

        let promiseMenu = waitForAddition({ target: "div[role='menu']" });

        elCaret.click();

        let target, node;

        ({ target: target, node: node } = await promiseMenu);

        let menuItem = Array.from(target.querySelectorAll("div[role='menuitem']"))
            .find(item => item.innerText.match(itemText));

        if (!menuItem) {
            throw new Error(`Menu item '${itemText}' not found`);
        }

        let promiseMenuClose = waitForRemoval({ target: elCaret });

        menuItem.click();

        ({ target: target, node: node } = await promiseMenuClose);
    }

    function applyFont(el) {
        el.style.fontFamily = "TwitterChirp, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    }

    //let postIndex = 0;
    function _onPost(el, pi) {
        pi.isUserProfile = isUserProfile();

        if (sessionVars.settings.visual.largerContentInteractionButtons) {
            var anchor = el.querySelector("button[data-testid='like']") ?? el.querySelector("button[data-testid='unlike']");
            let els = [...anchor.parentElement.parentElement.children]
                .forEach(child => child.querySelectorAll("*").forEach(x => {
                    let height = "20px";
                    x.style.lineHeight = height;
                    x.style.fontSize = height;
                }));
        }

        if (!sessionVars.page.feedUser && !enabled && !pi.isUserProfile) return;

        let postId = pi.elContentLink?.href.match("/(\\d+)$")[1];

        if (!postId) return;

        if (pi.isRepost) postId = `${postId}repost`;

        let xhrp = sessionVars.page.xhrPosts[postId];
        let info;

        if (xhrp) {
            info = xhrp.getAllMessages(true);
        } else if (sessionVars.settings.dev.debugging.debugModeUi) {
            info = ["No xhr data"];
        }

        let elInfo = document.createElement("div");
        elInfo.classList.add("twatInfo");
        applyFont(elInfo);

        pi.elHeader.after(elInfo);

        if (info?.length > 0) {
            let color;
            switch (true) {
                case xhrp?.score <= -20:
                    color = "red";
                    break;
                case xhrp?.score < 0:
                    color = "#ff7800";
                    break;
                default:
                    color = "yellow";
            }
            elInfo.style.border = `1px solid ${color}`;
            elInfo.style.borderRadius = '5px';
            elInfo.style.padding = '3px';
            info.forEach(i => {
                addPostInfo(elInfo, i);
            });
        }

        if (!xhrp) return;

        if (!xhrp.muted && xhrp.deleted && !xhrp.doNotDelete) {
            removePost(null, pi);
            return;
        }

        xhrp.mediaVariants?.forEach((e, i) => {
            let elMedia = document.createElement("div");
            applyFont(elMedia);
            let elKey = document.createElement("span");
            elMedia.appendChild(elKey);
            //elKey.innerText = e.media_key;
            elKey.innerText = `Video #${i + 1}`;

            e.variants.forEach(v => {
                let elVariant = document.createElement("a");
                elVariant.target = "_blank";
                elVariant.href = v.url;
                elVariant.innerText = v.dimensions;
                elVariant.style.paddingLeft = "5px";
                elKey.appendChild(elVariant);
            });

            pi.elHeader.appendChild(elMedia);
        });

        let scrollActions = [];

        async function getCaret() {
            let caret = await waitUntil(() => el.querySelector("button[data-testid='caret'][aria-label='More']"));
            return caret;
        }

        if (xhrp.menuItem) {
            scrollActions.push(() => {
                taskQueue.addTask(async () => {
                    let promiseConfirmMenu = waitForAddition({ target: x => x === el || x.parentElement?.parentElement === el });

                    let caret = await getCaret();

                    clickContextMenuItem(caret, xhrp.menuItem);

                    const { target: target, node: node } = await promiseConfirmMenu;

                    clogpost(`Removed - ${xhrp.getAllMessages().join("; ")}`, pi);
                    delete sessionVars.page.xhrPosts[xhrp.postId];

                    hideEl(el);

                    //target.remove();
                    //displayNone(target);
                }, `Seen ${xhrp.postId} (${xhrp.user.username})`, 1000);
            });
        } else if (
            !isFeedUser(xhrp.virtualPost.user) &&
            sessionVars.settings.general.enableMutes === "ENABLED" &&
            xhrp.muted &&
            !xhrp.user.following &&
            !xhrp.doNotMute && //not needed; remove in future release
            !isUserWhitelisted(xhrp.user) &&
            1 === 1
        ) {
            //scrollActions.push(() => waitUntil(() => el.querySelector("button[title='Mute']")).then(btn => btn.click()));
            scrollActions.push(() =>
                taskQueue.addTask(async () =>
                    clickContextMenuItem(await getCaret(), "Mute"),
                    `Mute click ${xhrp.postId} (${xhrp.user.username})`,
                    1000
                )
            );
        } else if (xhrp.seenInfo && seenPostTrackingEligible(xhrp)) {
            scrollActions.push(() => {
                xhrp.seenInfo.seenPost.seenCount++;
                updateSeenPost(xhrp);
            });
        }

        if (sessionVars.settings.dataMiner.enableCommentSectionRankingAnalysis) {
            let urlMatch = window.location.pathname.match("/\\w+/status/(\\d+)");
            urlMatch && scrollActions.push(() => {
                addPostInfo(elInfo, `Post rank ${xhrp.twatIndex}`);
                let rankInfo = {};

                if (xhrp.user.isBlueVerified) {
                    let rankedUnverifiedPosts = filterEntryValues(sessionVars.page.xhrPosts, x => x.postId !== urlMatch[1] && x.twatIndex < xhrp.twatIndex && !x.user.isBlueVerified);

                    if (rankedUnverifiedPosts.length > 0) {
                        addPostInfo(elInfo, `Ranked below ${rankedUnverifiedPosts.length} unverified posts`);
                        let rankedUnverifiedPostsByUser = groupBy(rankedUnverifiedPosts, x => x.user.username);
                        let sumViews = rankedUnverifiedPosts.sum(x => x.views);
                        let avgViews = sumViews / rankedUnverifiedPosts.length;
                        let rankedUnverifiedPostsWithMoreViews = rankedUnverifiedPosts.filter(x => x.views > xhrp.views);
                        let sumFollowers = selectEntryValues(rankedUnverifiedPostsByUser, x => x[0].user.followers).sum();
                        let avgFollowers = sumFollowers / Object.keys(rankedUnverifiedPostsByUser).length;
                        let rankedUnverifiedPostsWithFewerFollowers = filterEntryValues(rankedUnverifiedPostsByUser, x => x[0].user.followers < xhrp.user.followers);
                        let rankedUnverifiedPostsWithMoreViewsAndFewerFollowers = rankedUnverifiedPosts.filter(x =>
                            x.views > xhrp.views && x.user.followers < xhrp.user.followers
                        );
                        addPostInfo(elInfo, `Average higher-ranked unverified views: ${avgViews.toFixed(2)}`);
                        addPostInfo(elInfo, `Higher-ranked unverified posts with more views: ${rankedUnverifiedPostsWithMoreViews.length}`);
                        addPostInfo(elInfo, `Average higher-ranked unverified followers: ${avgFollowers.toFixed(2)}`);
                        addPostInfo(elInfo, `Higher-ranked unverified posts with fewer followers: ${rankedUnverifiedPostsWithFewerFollowers.length}`);
                        addPostInfo(elInfo, `Higher-ranked unverified posts with more views and fewer followers: ${rankedUnverifiedPostsWithMoreViewsAndFewerFollowers.length}`);
                        addPostInfo(elInfo, `Author followers: ${xhrp.user.followers}`);
                    }
                }
            });
        }

        scrollActions.forEach(sa => {
            if (isElementInViewport(el)) {
                sa();
            } else {
                waitUntilScrolled(el).then(el => {
                    sa();
                });
            }
        });

        clogdebug(el);

        if (
            sessionVars.settings.visual.betterContentTimestamps &&
            xhrp.createInfo.days <= sessionVars.settings.visual.betterContentTimestampThresholdDays
        ) {
            //let elDate = pi.elContentLink.querySelector("time");

            pi.elTimestamp.innerText = getTimeSummary(xhrp.createInfo);
        }

        if (xhrp.colorCodeAge) {
            if (!isLiveSearch && !sessionVars.page.feedUser) {
                let color;
                if (xhrp.createInfo.hours > sessionVars.settings.general.postAge3) {
                    //color = "#ff00003d";
                    color = "rgb(255 0 0 / 30%)";
                    //el.style.boxShadow = "inset 0px 0px 16px 12px #ff00003d";
                    //el.style.backgroundColor = "#ff00003d";
                } else if (xhrp.createInfo.hours > sessionVars.settings.general.postAge2) {
                    //color = "#ff00002e";
                    color = "rgb(255 255 0 / 30%)";
                    //el.style.boxShadow = "inset 0px 0px 16px 12px #ff00002e";
                    //el.style.backgroundColor = "#ff00002e";
                } else if (xhrp.createInfo.hours < sessionVars.settings.general.postAge1 && xhrp.replies <= 30) {
                    color = "rgb(0 255 35 / 30%)";
                    //el.style.boxShadow = "inset 0px 0px 16px 12px rgb(0 255 35 / 30%)";
                    //el.style.backgroundColor = "rgb(0 255 35 / 12%)";
                }

                if (color) el.style.boxShadow = `inset 20px 0px 20px 0px ${color}`;
                //if (color) addLeftGradientGlow(el, color);
            }
        }
    }

    function isFeedUser(user) {
        return sessionVars.page.feedUser?.restId === user?.restId;
    }

    function isLoggedInUser(user) {
        return user.username === sessionVars.settings.account.username;
    }

    function removePost(msg, pi) {
        if (isTypedSearch) return;
        displayNone(pi.el);
        msg && clogpost(`Removed post - ${msg}`, pi);
    }

    function isUserProfile() {
        if (_isUserProfile === null) {
            _isUserProfile = !!document.body.querySelector("a[href*='/header_photo']");
        }
        return _isUserProfile;
    }

    // -----------------------------------
    // Utilities
    // -----------------------------------
    function setKeyNames(obj, handler) {
        handler = handler ?? ((key, value) => obj[key] = key);
        forEachObjectEntry(obj, handler);
    }

    function getFeedEntryIdType(entry) {
        let type = Object.values(FeedEntryIdType).find(x => entry.entryId.startsWith(x));

        return type;
    }

    function getXhrPostContent(data) {
        return data.content ?? data;
    }

    function checkFeedChange(requestContext) {
        requestContext.feedHash = getFeedhash(requestContext);
        if (lastFeed !== requestContext.feedHash) {
            sessionVars.page.feedUser = null;
            lastFeed = requestContext.feedHash;
        }
    }

    function getFieldMatches(entity, fieldGetters, directives) {
        if (!fieldGetters || fieldGetters.length === 0) fieldGetters = userTextFieldGetters;
        let fieldInfos = fieldGetters.map(x => ({ field: x.field, value: x.getter(entity).replace(/\s+/g, ' ') }));

        let matchInfos = [];
        directives.forEach(dir => {
            if (dir.enabled === false) return;

            let whole = dir.whole ?? false;
            let dirType = dir.type ?? 1;
            let options = dir.options ?? "i";

            function GetTextMatch(value, pattern) {
                let i = value.indexOf(pattern);
                if (i >= 0) return { matchText: pattern, matchIndex: i };
            }

            function GetRegExMatch(value, pattern) {
                let newPattern;
                if (pattern instanceof RegExp) {
                    newPattern = pattern;
                } else {
                    if (typeof pattern === 'object') {
                        pattern = pattern.pattern;
                    }
                    newPattern = dir.whole ? getWholePattern(pattern) : pattern;
                    newPattern = new RegExp(newPattern, options);
                }

                let match = newPattern.exec(value);

                if (match) return {
                    matchText: match[0],
                    match,
                    matchIndex: match.index,
                };
            }

            dir.values.forEach(pattern => {
                let getMatch = typeof pattern === 'string' && dirType === 0 && !whole ? GetTextMatch : GetRegExMatch;
                for (const fieldInfo of fieldInfos) {
                    let matchInfo;
                    if (dir.handler) {
                        matchInfo = dir.handler(fieldInfo.value, pattern, getMatch);
                    } else {
                        matchInfo = getMatch(fieldInfo.value, pattern);
                    }
                    if (matchInfo) {
                        let ret = {
                            field: fieldInfo.field,
                            directive: dir,
                            pattern: pattern,
                            matchInfo
                        };
                        ret.parts = getSurroundingText(fieldInfo.value, matchInfo.matchIndex, matchInfo.matchText.length + matchInfo.matchIndex, 10);
                        matchInfos.push(ret);
                        break;
                    }
                }
            });
        });
        return matchInfos;
    }

    function getLangScore(text, langPattern, maxScore) {
        let matches = [];
        let totalScore = 0;
        let pattern;

        // Local function to process patterns
        function processPatterns(patterns, assignLangPattern = false) {
            for (const p of patterns) {
                if (totalScore >= maxScore) {
                    break;
                }

                p.lastIndex = 0;
                let match;

                while (totalScore < maxScore && (match = p.pattern.exec(text))) {
                    matches.push({ match: match[0], score: p.score });
                    totalScore += p.score;
                    if (assignLangPattern) pattern = p; // Only assign if generic case
                }
            }
        }

        if (langPattern) {
            processPatterns(langPattern.patterns);
        } else {
            langPatterns.filter(x => !x.langs).forEach(x => processPatterns(x.patterns, true));
        }

        if (totalScore > 0) return { langPattern, matches, totalScore };
    }

    function seenPostTrackingEligible(post) {
        //return !post.replyToPostId;
        return true;
    }

    function getSeenPostKey(feed, post) {
        let key = `post${post.postId}`;

        return key;
    }

    function getSeenPostByFeed(feed, post) {
        post.seenInfo = {
            feed,
            key: getSeenPostKey(feed, post),
        };

        let seenPost = getSeenPostByKey(post.seenInfo.key);

        if (!seenPost) {
            post.seenInfo.isNew = true;
            seenPost = { seenCount: 0, firstSeen: curTs };
        }

        post.seenInfo.seenPost = seenPost;

        post.seenInfo.seenTime = curTs - seenPost.firstSeen;
        post.seenInfo.seenHours = post.seenInfo.seenTime / (1000 * 60 * 60);

        return seenPost;
    }

    function getSeenPostByKey(key) {
        let seenPost = localStorage[key];

        seenPost = parseSeenPost(seenPost);

        return seenPost;
    }

    function parseSeenPost(seenPost) {
        if (!seenPost) return;

        seenPost = JSON.parse(seenPost);
        seenPost.firstSeen = new Date(seenPost.firstSeen);

        return seenPost;
    }

    function updateSeenPost(post) {
        if (!post.seenInfo) return;

        localStorage[post.seenInfo.key] = JSON.stringify(post.seenInfo.seenPost);
    }

    //function waitUntil(condition, timeout = 5000) {
    //    return new Promise((resolve, reject) => {
    //        let start = Date.now();
    //        function check() {
    //            let result = condition();
    //            if (result) return resolve(result);
    //            if (Date.now() - start > timeout) return reject(new Error("Timeout"));
    //            setTimeout(check, 100);
    //        }
    //        check();
    //    });
    //}

    function getTimeSummary(createInfo) {
        if (createInfo.hours < 1) return `${createInfo.minutes.toFixed(2)}m`;
        if (createInfo.days < 1) return `${createInfo.hours.toFixed(2)}h`;
        if (createInfo.years < 1) return `${createInfo.days.toFixed(2)}d`;
        return `${createInfo.years.toFixed(2)}y`;
    }

    function getWholePattern(pattern) {
        return `(?<=(^|\\W))(${pattern})(?=($|\\W))`;
    }

    let regexFlagMergeOptions = {
        mergeAll: 1,
        overwrite: 2
    };

    function getRegexObject(reginald, flags, transformer) {
        if (reginald instanceof RegExp) {
            if (!flags && !transformer) return reginald;
            //if (!transformer) return reginald;
            flags = Array.from(new Set(flags + reginald.flags)).join("");
            reginald = reginald.source;
            //flags = reginald.flags;
        } else {
            //if (flags) flags = Array.from(new Set(flags, reginald.flags)).join("");
        }

        if (transformer) reginald = transformer(reginald);

        return new RegExp(reginald, flags ?? "");
    }

    function getRegexObject1(reginald, flags, transformer, mergeOptions = 1) {
        let newFlags;
        if (reginald instanceof RegExp) {
            if (flags) {
                switch (mergeOptions) {
                    case 1:
                        newFlags = Array.from(new Set(flags, reginald.flags)).join("");
                        break;
                    case 2:
                        newFlags = flags;
                        break;
                }
            }

            if (!transformer && !newFlags) return reginald;

            reginald = reginald.source;
            if (!newFlags) newFlags = reginald.flags;
        } else {
            newFlags = flags;
        }

        if (transformer) reginald = transformer(reginald);

        return new RegExp(reginald, newFlags ?? "");
    }

    ///(\W|[_])/ this pattern also breaks on multi-byte unicode, so need to explicitly check for punctuation
    function getSurroundingText(s, start, end, padding, breakPattern = /[-\s.,\/#!$%^&*;:{}=_`~()]/) {
        breakPattern = getRegexObject(breakPattern);

        let parts = {};
        let o = (start - padding) + 1;

        for (; o > 0; o--) {
            if (s[o - 1].match(breakPattern)) {
                //if (o > 0) o++;
                break;
            }
        }

        parts.before = s.substring(o, start);

        let u = (end + padding) - 1;

        for (; u < s.length - 1; u++) {
            if (s[u + 1].match(breakPattern)) {
                //if (u === s.length - 2) u--;
                break;
            }
        }

        parts.after = s.substring(end, u + 1);

        return parts;
    }

    function isUserWhitelisted(user) {
        return sessionVars.settings.muteAndHide.whitelist.includes(user.username);
    }

    function clogxhrpost(m, postContext) {
        clog(`xhr - ${m} (https://x.com/${postContext.post.virtualPost?.user?.username}/status/${postContext.post.virtualPost?.postId})`);
    }

    function clogpost(m, pi) {
        //if (seenPosts.includes(pi.elContentLink.href)) return;
        clog(`${m} (${pi.elContentLink.href})`);
    }

    function cleanSeenPosts() {
        for (const key in localStorage) {
            if (!key.match("post\\d+")) continue;
            localStorage.removeItem(key);
        }
    }

    function manageSeenPosts() {
        cleanLocalStorage("post\\d+", "lastSeenPostsCheck",
            sessionVars.settings.contentHandlers.SeenPosts.maintenanceIntervalHours,
            sessionVars.settings.contentHandlers.SeenPosts.trackingHours,
            parseSeenPost, x => x.firstSeen
        );
    }

    // -----------------------------------
    // Main Execution
    // -----------------------------------
    let nextUrl;
    let prevUrl;

    setSessionPageVars();

    window.navigation.addEventListener("navigate", (event) => {
        clogdebug(event);

        //if (event.destination.url.startsWith("https://x.com/i/flow/login?redirect_after_login")) {
        //    console.log(event.destination.url);
        //    console.log("breaking page nav")
        //    event.preventDefault();
        //    return;
        //}

        nextUrl = new URL(event.destination.url);
        checkUrlChange();
    });

    function checkUrlChange() {
        let decoded = decodeURI(nextUrl.href);
        if (decoded !== prevUrl) {
            clog(`Url nav: ${nextUrl.href}`);
            onUrlChange();
        }
        prevUrl = decoded;
    }

    const enabledPathNames = ["^/home", "^/search", "^/i/communities", "^/hashtag", "^/explore/tabs/for.you", "^/i/trending/\\w+", "/\\w+/status/\\d+"];

    function setSessionPageVars() {
        //if (sessionVars.page) return;

        sessionVars.page ??= {
            feedUser: "",
            foundTexts: {},
            xhrPosts: {},
            //xhrReposts: {},
            //xhrPostInfo: {},
            //xhrPostMeta: {},
            twatIndex: 0
        };
    }

    function onUrlChange() {
        if (nextUrl == null) nextUrl = window.location;

        if (_settingsTemp) _settingsTemp = null;

        //setSessionPageVars();

        if (sessionVars.settings.performance.clearXhrPostCacheOnUrlChange) sessionVars.page.xhrPosts = {};

        //sessionVars.page.twatIndex = 0;

        let usp = new URLSearchParams(nextUrl.search);

        enabled = !!enabledPathNames.find(x => new RegExp(x).test(nextUrl.pathname));
        //isSearch = !!nextUrl.pathname.match("/search") || !!nextUrl.pathname.match("/hashtag");
        isTypedSearch = wiff(usp.get("src"), src => src && ["typeahead_click", "typed_query"].includes(src));
        isLiveSearch = usp.get("f") === "live";
        isPostView = !!nextUrl.href.match("https://x.com/\\w+/status/\\d+$");
        searchParam = usp.get("q");
        searchParamSanitized = searchParam?.toLowerCase().replace(/[^a-zA-Z0-9]/gu, "");
        //debugMode = usp.get("debug") === "1";

        //let qkvs = Array.from(usp.entries().map(kv => [kv[0].toLowerCase(), kv[1]]));
        //forEachObjectEntry(sessionVars.settings, (k, v) => {
        //    let qs = qkvs.find(qkv => qkv[0] === k.toLowerCase());

        //    if (qs) settings[k] = changeType(qs[1], typeof v);
        //});
    }

    onUrlChange();
    manageSeenPosts();

    const watchers = [];
    waitUntil(() => document.body).then(x => {
        doEl(x, ContentSelectors.cellInnerDiv, onContent);
        observe(x, async (m, node, crud) => {
            let tmp;
            //let watcherFound;

            for (let i = watchers.length - 1; i >= 0; i--) {
                let watcher = watchers[i];

                if (
                    watcher.type === crud &&
                    (typeof watcher.target === "object" && m.target === watcher.target) ||
                    (typeof watcher.target === "string" && m.target.matches(watcher.target)) ||
                    (typeof watcher.target === "function" && watcher.target(m.target))
                ) {
                    try {
                        watcher.action(m.target, node);
                        clogdebug(`Handled DOM watcher for selector: "${watcher.target}" on node:`, node);
                    } catch (error) {
                        clogdebug(`Error in action for selector "${watcher.target}":`, error);
                    }
                    // Remove the watcher
                    watchers.splice(i, 1);
                    //watcherFound = true;
                }
            }

            //if (watcherFound) return;

            let isDiv;

            if (node.matches(ContentSelectors.cellInnerDiv)) {
                onContent(node);
            }
            else if (tmp = node.querySelector(`div > ${ContentSelectors.trend}`)) {
                onTrend(tmp);
            }
            else if (
                (
                    (node.matches("div") && (tmp = node.parentElement)?.matches(ContentSelectors.cellInnerDiv)) ||
                    (node.matches(ContentSelectors.article) && node.getAttribute("data-testid") !== "tweet" && (tmp = node.parentElement?.parentElement?.parentElement)?.matches(ContentSelectors.cellInnerDiv))
                ) && node.textContent === "Thanks. X will use this to make your timeline better.") {
                displayNone(tmp);
            }
        });
    });

    const handleContentClickEvent = (e) => {
        //return causes the click to proceed as normal

        //check to see if the click occurred within a content template
        let template = e.target.closest("article[data-testid='tweet']");

        if (!template) return;

        let selRoleLink = "div[role='link'";
        let elQuote = template.querySelector(selRoleLink);

        //if so, check if it occurred within a quote
        if (elQuote && e.target.closest(selRoleLink)) {
            return;
        }

        //if not, check if it occurred on any of these selectors
        const interactiveSelectors = ['a', 'button', '[role="button"]', '[role="menu"]', '[role="menuitem"]', "div[role='radio']", 'svg', 'input', 'textarea'];
        let isInteractive = interactiveSelectors.some(x => e.target.matches(x) || e.target.closest(x));

        if (!isInteractive) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    function setContentClickEvent() {
        waitUntil(() => document.body?.querySelector('div#react-root')).then(x => {
            if (sessionVars.settings.visual.disableContentClickEvent) {
                x.addEventListener('click', handleContentClickEvent, { capture: true });
            } else {
                x.removeEventListener('click', handleContentClickEvent, { capture: true });
            }
        });
    }

    setContentClickEvent();
})();
})();})()
