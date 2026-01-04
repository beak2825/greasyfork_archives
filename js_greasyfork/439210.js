// ==UserScript==
// @name         [SNOLAB] Google Calendar keyboard enhance
// @name:en      [SNOLAB] Google Calendar keyboard enhance
// @name:zh      [SNOLAB] Google 日历键盘操作增强
// @name:zh-CN   [SNOLAB] Google 日历键盘操作增强
// @name:zh-TW   [SNOLAB] Google 日曆鍵盤操作增強
// @name:ja      [SNOLAB] Google カレンダー キーボード操作強化
// @name:ko      [SNOLAB] Google 캘린더 키보드 향상
// @name:es      [SNOLAB] Google Calendar mejorado con teclado
// @name:fr      [SNOLAB] Google Calendar amélioration clavier
// @name:de      [SNOLAB] Google Kalender Tastaturverbesserung
// @name:ru      [SNOLAB] Google Календарь улучшение клавиатуры
// @namespace    https://userscript.snomiao.com/
// @version      0.1.0
// @description  Google Calendar keyboard enhancement. Features: Double-click to copy text from event view, Alt+hjkl to move events, Alt+Shift+hjkl to expand/shrink events
// @description:en Google Calendar keyboard enhancement. Features: Double-click to copy text from event view, Alt+hjkl to move events, Alt+Shift+hjkl to expand/shrink events
// @description:zh Google日历键盘增强，功能：双击复制日程视图里的文本内容, Alt+hjkl 移动日程事件, Alt+Shift+hjkl 扩展收缩日程事件
// @description:zh-CN Google日历键盘增强，功能：双击复制日程视图里的文本内容, Alt+hjkl 移动日程事件, Alt+Shift+hjkl 扩展收缩日程事件
// @description:zh-TW Google日曆鍵盤增強，功能：雙擊複製日程視圖裡的文本內容, Alt+hjkl 移動日程事件, Alt+Shift+hjkl 擴展收縮日程事件
// @description:ja Googleカレンダーのキーボード操作強化。機能：イベントビューのテキストをダブルクリックでコピー、Alt+hjklでイベント移動、Alt+Shift+hjklでイベントの拡大縮小
// @description:ko Google 캘린더 키보드 향상. 기능: 이벤트 보기에서 텍스트 더블 클릭 복사, Alt+hjkl로 이벤트 이동, Alt+Shift+hjkl로 이벤트 확장/축소
// @description:es Mejora del teclado de Google Calendar. Funciones: Doble clic para copiar texto de la vista de eventos, Alt+hjkl para mover eventos, Alt+Shift+hjkl para expandir/contraer eventos
// @description:fr Amélioration du clavier Google Calendar. Fonctionnalités: Double-clic pour copier le texte de la vue d'événement, Alt+hjkl pour déplacer les événements, Alt+Shift+hjkl pour étendre/réduire les événements
// @description:de Google Kalender Tastaturverbesserung. Funktionen: Doppelklick zum Kopieren von Text aus der Ereignisansicht, Alt+hjkl zum Verschieben von Ereignissen, Alt+Shift+hjkl zum Erweitern/Verkleinern von Ereignissen
// @description:ru Улучшение клавиатуры Google Календаря. Функции: Двойной клик для копирования текста из просмотра событий, Alt+hjkl для перемещения событий, Alt+Shift+hjkl для расширения/сжатия событий
// @author       snomiao@gmail.com
// @match        *://calendar.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.meta.js
// ==/UserScript==
//
// 2025-09-05: migrated from https://github.com/snomiao/userscript.js/tree/main
// 
//  1. event move enhance
//      - date time input change
//      - event drag
//  2. journal view text copy for the day-summary
//

/* eslint-disable */

// clipboardy/browser
var clipboard = {};
clipboard.write = async (text) => {
    await navigator.clipboard.writeText(text);
};
clipboard.read = async () => navigator.clipboard.readText();
clipboard.readSync = () => {
    throw new Error("`.readSync()` is not supported in browsers!");
};
clipboard.writeSync = () => {
    throw new Error("`.writeSync()` is not supported in browsers!");
};
var browser_default = clipboard;

// hotkey-mapper
var { keys } = Object;
function mapObject(fn, obj) {
    if (arguments.length === 1) {
        return (_obj) => mapObject(fn, _obj);
    }
    let index = 0;
    const objKeys = keys(obj);
    const len = objKeys.length;
    const willReturn = {};
    while (index < len) {
        const key = objKeys[index];
        willReturn[key] = fn(
            obj[key],
            key,
            obj
        );
        index++;
    }
    return willReturn;
}
var mapObjIndexed = mapObject;
function hotkeyMapper(mapping, on = "keydown", options) {
    const handler = (event) => {
        const mainKey = `${event.code.replace(/^Key/, "").toLowerCase()}Key`;
        event[mainKey] = true;
        const mods = "meta+alt+shift+ctrl";
        mapObjIndexed((fn, hotkey) => {
            const conds = `${mods}+${hotkey.toLowerCase()}`.replace(/win|command|search/, "meta").replace(/control/, "ctrl").split("+").map((k, i) => [k, Boolean(i >= 4) === Boolean(event[`${k}Key`])]);
            if (!Object.entries(Object.fromEntries(conds)).every(([, ok]) => ok))
                return;
            event.stopPropagation(), event.preventDefault();
            return fn(event);
        }, mapping);
    };
    window.addEventListener(on, handler, options);
    return function unload() {
        window.removeEventListener(on, handler, options);
    };
}

// rambda
var cloneList = (list) => Array.prototype.slice.call(list);
function curry(fn, args = []) {
    return (..._args) => ((rest) => rest.length >= fn.length ? fn(...rest) : curry(fn, rest))([...args, ..._args]);
}
function adjustFn(index, replaceFn2, list) {
    const actualIndex = index < 0 ? list.length + index : index;
    if (index >= list.length || actualIndex < 0)
        return list;
    const clone = cloneList(list);
    clone[actualIndex] = replaceFn2(clone[actualIndex]);
    return clone;
}
var adjust = curry(adjustFn);
function always(x) {
    return (_) => x;
}
var {
    isArray
} = Array;
function assocFn(prop2, newValue, obj) {
    return Object.assign({}, obj, {
        [prop2]: newValue
    });
}
var assoc = curry(assocFn);
function _isInteger(n) {
    return n << 0 === n;
}
var isInteger = Number.isInteger || _isInteger;
function assocPathFn(path2, newValue, input) {
    const pathArrValue = typeof path2 === "string" ? path2.split(".").map((x) => isInteger(Number(x)) ? Number(x) : x) : path2;
    if (pathArrValue.length === 0) {
        return newValue;
    }
    const index = pathArrValue[0];
    if (pathArrValue.length > 1) {
        const condition = typeof input !== "object" || input === null || !input.hasOwnProperty(index);
        const nextInput = condition ? isInteger(pathArrValue[1]) ? [] : {} : input[index];
        newValue = assocPathFn(Array.prototype.slice.call(pathArrValue, 1), newValue, nextInput);
    }
    if (isInteger(index) && isArray(input)) {
        const arr = cloneList(input);
        arr[index] = newValue;
        return arr;
    }
    return assoc(index, newValue, input);
}
var assocPath = curry(assocPathFn);
function clampFn(min, max, input) {
    if (min > max) {
        throw new Error("min must not be greater than max in clamp(min, max, value)");
    }
    if (input >= min && input <= max)
        return input;
    if (input > max)
        return max;
    if (input < min)
        return min;
}
var clamp = curry(clampFn);
var ReduceStopper = class {
    constructor(value) {
        this.value = value;
    }
};
function reduceFn(reducer, acc, list) {
    if (!isArray(list)) {
        throw new TypeError("reduce: list must be array or iterable");
    }
    let index = 0;
    const len = list.length;
    while (index < len) {
        acc = reducer(acc, list[index], index, list);
        if (acc instanceof ReduceStopper) {
            return acc.value;
        }
        index++;
    }
    return acc;
}
var reduce = curry(reduceFn);
var {
    keys: keys$1
} = Object;
function isFalsy(input) {
    return input === void 0 || input === null || Number.isNaN(input) === true;
}
function defaultTo(defaultArgument, input) {
    if (arguments.length === 1) {
        return (_input) => defaultTo(defaultArgument, _input);
    }
    return isFalsy(input) ? defaultArgument : input;
}
function type(input) {
    if (input === null) {
        return "Null";
    } else if (input === void 0) {
        return "Undefined";
    } else if (Number.isNaN(input)) {
        return "NaN";
    }
    const typeResult = Object.prototype.toString.call(input).slice(8, -1);
    return typeResult === "AsyncFunction" ? "Promise" : typeResult;
}
function _indexOf(valueToFind, list) {
    if (!isArray(list)) {
        throw new Error(`Cannot read property 'indexOf' of ${list}`);
    }
    const typeOfValue = type(valueToFind);
    if (!["Object", "Array", "NaN", "RegExp"].includes(typeOfValue))
        return list.indexOf(valueToFind);
    let index = -1;
    let foundIndex = -1;
    const {
        length
    } = list;
    while (++index < length && foundIndex === -1) {
        if (equals(list[index], valueToFind)) {
            foundIndex = index;
        }
    }
    return foundIndex;
}
function _arrayFromIterator(iter) {
    const list = [];
    let next;
    while (!(next = iter.next()).done) {
        list.push(next.value);
    }
    return list;
}
function _equalsSets(a, b) {
    if (a.size !== b.size) {
        return false;
    }
    const aList = _arrayFromIterator(a.values());
    const bList = _arrayFromIterator(b.values());
    const filtered = aList.filter((aInstance) => _indexOf(aInstance, bList) === -1);
    return filtered.length === 0;
}
function parseError(maybeError) {
    const typeofError = maybeError.__proto__.toString();
    if (!["Error", "TypeError"].includes(typeofError))
        return [];
    return [typeofError, maybeError.message];
}
function parseDate(maybeDate) {
    if (!maybeDate.toDateString)
        return [false];
    return [true, maybeDate.getTime()];
}
function parseRegex(maybeRegex) {
    if (maybeRegex.constructor !== RegExp)
        return [false];
    return [true, maybeRegex.toString()];
}
function equals(a, b) {
    if (arguments.length === 1)
        return (_b) => equals(a, _b);
    const aType = type(a);
    if (aType !== type(b))
        return false;
    if (aType === "Function") {
        return a.name === void 0 ? false : a.name === b.name;
    }
    if (["NaN", "Undefined", "Null"].includes(aType))
        return true;
    if (aType === "Number") {
        if (Object.is(-0, a) !== Object.is(-0, b))
            return false;
        return a.toString() === b.toString();
    }
    if (["String", "Boolean"].includes(aType)) {
        return a.toString() === b.toString();
    }
    if (aType === "Array") {
        const aClone = Array.from(a);
        const bClone = Array.from(b);
        if (aClone.toString() !== bClone.toString()) {
            return false;
        }
        let loopArrayFlag = true;
        aClone.forEach((aCloneInstance, aCloneIndex) => {
            if (loopArrayFlag) {
                if (aCloneInstance !== bClone[aCloneIndex] && !equals(aCloneInstance, bClone[aCloneIndex])) {
                    loopArrayFlag = false;
                }
            }
        });
        return loopArrayFlag;
    }
    const aRegex = parseRegex(a);
    const bRegex = parseRegex(b);
    if (aRegex[0]) {
        return bRegex[0] ? aRegex[1] === bRegex[1] : false;
    } else if (bRegex[0])
        return false;
    const aDate = parseDate(a);
    const bDate = parseDate(b);
    if (aDate[0]) {
        return bDate[0] ? aDate[1] === bDate[1] : false;
    } else if (bDate[0])
        return false;
    const aError = parseError(a);
    const bError = parseError(b);
    if (aError[0]) {
        return bError[0] ? aError[0] === bError[0] && aError[1] === bError[1] : false;
    }
    if (aType === "Set") {
        return _equalsSets(a, b);
    }
    if (aType === "Object") {
        const aKeys = Object.keys(a);
        if (aKeys.length !== Object.keys(b).length) {
            return false;
        }
        let loopObjectFlag = true;
        aKeys.forEach((aKeyInstance) => {
            if (loopObjectFlag) {
                const aValue = a[aKeyInstance];
                const bValue = b[aKeyInstance];
                if (aValue !== bValue && !equals(aValue, bValue)) {
                    loopObjectFlag = false;
                }
            }
        });
        return loopObjectFlag;
    }
    return false;
}
function prop(propToFind, obj) {
    if (arguments.length === 1)
        return (_obj) => prop(propToFind, _obj);
    if (!obj)
        return void 0;
    return obj[propToFind];
}
function eqPropsFn(property, objA, objB) {
    return equals(prop(property, objA), prop(property, objB));
}
var eqProps = curry(eqPropsFn);
function createPath(path2, delimiter = ".") {
    return typeof path2 === "string" ? path2.split(delimiter) : path2;
}
function path(pathInput, obj) {
    if (arguments.length === 1)
        return (_obj) => path(pathInput, _obj);
    if (obj === null || obj === void 0) {
        return void 0;
    }
    let willReturn = obj;
    let counter = 0;
    const pathArrValue = createPath(pathInput);
    while (counter < pathArrValue.length) {
        if (willReturn === null || willReturn === void 0) {
            return void 0;
        }
        if (willReturn[pathArrValue[counter]] === null)
            return void 0;
        willReturn = willReturn[pathArrValue[counter]];
        counter++;
    }
    return willReturn;
}
function ifElseFn(condition, onTrue, onFalse) {
    return (...input) => {
        const conditionResult = typeof condition === "boolean" ? condition : condition(...input);
        if (conditionResult === true) {
            return onTrue(...input);
        }
        return onFalse(...input);
    };
}
var ifElse = curry(ifElseFn);
function baseSlice(array, start, end) {
    let index = -1;
    let {
        length
    } = array;
    end = end > length ? length : end;
    if (end < 0) {
        end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    const result = Array(length);
    while (++index < length) {
        result[index] = array[index + start];
    }
    return result;
}
function is(targetPrototype, x) {
    if (arguments.length === 1)
        return (_x) => is(targetPrototype, _x);
    return x != null && x.constructor === targetPrototype || x instanceof targetPrototype;
}
function updateFn(index, newValue, list) {
    const clone = cloneList(list);
    if (index === -1)
        return clone.fill(newValue, index);
    return clone.fill(newValue, index, index + 1);
}
var update = curry(updateFn);
function maxByFn(compareFn, x, y) {
    return compareFn(y) > compareFn(x) ? y : x;
}
var maxBy = curry(maxByFn);
function mergeWithFn(mergeFn, a, b) {
    const willReturn = {};
    Object.keys(a).forEach((key) => {
        if (b[key] === void 0) {
            willReturn[key] = a[key];
        } else {
            willReturn[key] = mergeFn(a[key], b[key]);
        }
    });
    Object.keys(b).forEach((key) => {
        if (willReturn[key] !== void 0)
            return;
        if (a[key] === void 0) {
            willReturn[key] = b[key];
        } else {
            willReturn[key] = mergeFn(a[key], b[key]);
        }
    });
    return willReturn;
}
var mergeWith = curry(mergeWithFn);
function minByFn(compareFn, x, y) {
    return compareFn(y) < compareFn(x) ? y : x;
}
var minBy = curry(minByFn);
function ownKeys(object, enumerableOnly) {
    var keys2 = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys2.push.apply(keys2, symbols);
    }
    return keys2;
}
function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function isIterable(input) {
    return Array.isArray(input) || type(input) === "Object";
}
function modifyFn(property, fn, iterable) {
    if (!isIterable(iterable))
        return iterable;
    if (iterable[property] === void 0)
        return iterable;
    if (isArray(iterable)) {
        return updateFn(property, fn(iterable[property]), iterable);
    }
    return _objectSpread2(_objectSpread2({}, iterable), {}, {
        [property]: fn(iterable[property])
    });
}
var modify = curry(modifyFn);
function modifyPathFn(pathInput, fn, object) {
    const path$1 = createPath(pathInput);
    if (path$1.length === 1) {
        return _objectSpread2(_objectSpread2({}, object), {}, {
            [path$1[0]]: fn(object[path$1[0]])
        });
    }
    if (path(path$1, object) === void 0)
        return object;
    const val = modifyPath(Array.prototype.slice.call(path$1, 1), fn, object[path$1[0]]);
    if (val === object[path$1[0]]) {
        return object;
    }
    return assoc(path$1[0], val, object);
}
var modifyPath = curry(modifyPathFn);
function moveFn(fromIndex, toIndex, list) {
    if (fromIndex < 0 || toIndex < 0) {
        throw new Error("Rambda.move does not support negative indexes");
    }
    if (fromIndex > list.length - 1 || toIndex > list.length - 1)
        return list;
    const clone = cloneList(list);
    clone[fromIndex] = list[toIndex];
    clone[toIndex] = list[fromIndex];
    return clone;
}
var move = curry(moveFn);
function multiply(x, y) {
    if (arguments.length === 1)
        return (_y) => multiply(x, _y);
    return x * y;
}
var Identity = (x) => ({
    x,
    map: (fn) => Identity(fn(x))
});
function overFn(lens, fn, object) {
    return lens((x) => Identity(fn(x)))(object).x;
}
var over = curry(overFn);
function pathEqFn(pathToSearch, target, input) {
    return equals(path(pathToSearch, input), target);
}
var pathEq = curry(pathEqFn);
function pathOrFn(defaultValue, pathInput, obj) {
    return defaultTo(defaultValue, path(pathInput, obj));
}
var pathOr = curry(pathOrFn);
var product = reduce(multiply, 1);
function propEqFn(propToFind, valueToMatch, obj) {
    if (!obj)
        return false;
    return equals(valueToMatch, prop(propToFind, obj));
}
var propEq = curry(propEqFn);
function propIsFn(targetPrototype, property, obj) {
    return is(targetPrototype, obj[property]);
}
var propIs = curry(propIsFn);
function propOrFn(defaultValue, property, obj) {
    if (!obj)
        return defaultValue;
    return defaultTo(defaultValue, obj[property]);
}
var propOr = curry(propOrFn);
function propSatisfiesFn(predicate, property, obj) {
    return predicate(prop(property, obj));
}
var propSatisfies = curry(propSatisfiesFn);
function replaceFn(pattern, replacer, str) {
    return str.replace(pattern, replacer);
}
var replace = curry(replaceFn);
function setFn(lens, replacer, x) {
    return over(lens, always(replacer), x);
}
var set = curry(setFn);
function sliceFn(from, to, list) {
    return list.slice(from, to);
}
var slice = curry(sliceFn);
function take(howMany, listOrString) {
    if (arguments.length === 1)
        return (_listOrString) => take(howMany, _listOrString);
    if (howMany < 0)
        return listOrString.slice();
    if (typeof listOrString === "string")
        return listOrString.slice(0, howMany);
    return baseSlice(listOrString, 0, howMany);
}
var isFunction = (x) => ["Promise", "Function"].includes(type(x));
function tryCatch(fn, fallback) {
    if (!isFunction(fn)) {
        throw new Error(`R.tryCatch | fn '${fn}'`);
    }
    const passFallback = isFunction(fallback);
    return (...inputs) => {
        try {
            return fn(...inputs);
        } catch (e) {
            return passFallback ? fallback(e, ...inputs) : fallback;
        }
    };
}
function whenFn(predicate, whenTrueFn, input) {
    if (!predicate(input))
        return input;
    return whenTrueFn(input);
}
var when = curry(whenFn);
function zipWithFn(fn, x, y) {
    return take(x.length > y.length ? y.length : x.length, x).map((xInstance, i) => fn(xInstance, y[i]));
}
var zipWith = curry(zipWithFn);

// $$
function $$(sel2, el = document) {
    return [...el.querySelectorAll(sel2)];
}

// po2dt
var SPAN_PRECISION = 15 * 6e4;
function po2dt([dday, dtime]) {
    return dday * 864e5 + dtime * SPAN_PRECISION;
}

// google-calendar-keys
var gkcs_unload = globalThis.gkcs_unload;
gkcs_unload?.();
globalThis.gkcs_unload = main();
globalThis.gkcs_verbose = true;
var { draggingGet: dg, draggingSet: ds } = draggingUse();
function main() {
    console.clear();
    const unloaders = [];
    unloaders.push(
        hotkeyMapper(
            {
                "ctrl+b": async () => {
                    const menuBtn = $visiable(sel.Menu);
                    menuBtn?.click();
                },
                "alt+v": async () => await cpr(),
                "alt+k": () => eventMove([0, -1]),
                "alt+j": () => eventMove([0, 1]),
                "alt+h": () => eventMove([-1, 0]),
                "alt+l": () => eventMove([1, 0]),
                "alt+shift+k": () => eventExpand([0, -1]),
                "alt+shift+j": () => eventExpand([0, 1]),
                "alt+shift+h": () => eventExpand([-1, 0]),
                "alt+shift+l": () => eventExpand([1, 0])
            },
            "keydown",
            true
        )
    );
    return () => [...unloaders].reverse().forEach((e) => e?.());
}
async function cpr() {
    const r = $$("input,[role=button]").map((element) => {
        const { ps, deep } = onlyPatternSelectorGenerate(element);
        const label = element.ariaLabel ?? "";
        return {
            e: element,
            label,
            ps,
            deep
        };
    }).filter((e) => Boolean(e.label));
    const cpr2 = r.map(({ e, ...r2 }) => r2);
    console.table(r);
    globalThis.patternSelectorGenerate = patternSelectorGenerate;
    await browser_default.write(JSON.stringify(cpr2, null, 2));
}
function useListener(target = window) {
    return (event, onEvent, options) => {
        target.addEventListener(event, onEvent, options);
        const unload = () => target.removeEventListener(event, onEvent, options);
        return unload;
    };
}
async function eventExpand([dx, dy] = [0, 0]) {
    if (dy && await timeAddTry())
        return;
    return tryCatch(
        () => eventDrag([dx, dy], { expand: true }),
        () => inputDateTimeChange(0, po2dt([dx, dy]))
    )(null);
}
async function eventMove([dx, dy] = [0, 0]) {
    if (dy && await timeAddTry())
        return;
    return tryCatch(
        () => eventDrag([dx, dy]),
        () => inputDateTimeChange(po2dt([dx, dy]), 0)
    )(null);
}
async function inputValueSet(el, value) {
    console.log("inputValueSet", el, value);
    if (!el)
        throw new Error("no element");
    if (void 0 === value)
        throw new Error("no value");
    el.value = value;
    el.dispatchEvent(new InputEvent("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(
        new KeyboardEvent("keydown", {
            bubbles: true,
            keyCode: 13
        })
    );
    el.focus();
    await sleep(0);
    el.blur();
}
async function dateInputParse(dateInput, timeInput) {
    const dataDate = dateInput.getAttribute("data-date");
    const dataIcalElement = parentList(dateInput).find(
        (e) => e.getAttribute("data-ical")
    );
    if (!dataIcalElement)
        throw new Error("dataIcalElement not found");
    const dataIcal = dataIcalElement.getAttribute("data-ical");
    const datestringRaw = dataDate || dataIcal;
    if (!datestringRaw)
        throw new Error("no datestring");
    const dateString = datestringRaw.replace(
        /(\d{4})(\d{2})(\d{2})/,
        (_, a, b, c) => [a, b, c].join("-")
    );
    const timeString = timeInput?.value || "00:00";
    return new Date(`${dateString} ${timeString} Z`);
}
function dateParse(dateObj) {
    const m = dateObj.toISOString().match(/(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d):\d\d\.\d\d\dZ/);
    if (!m)
        throw m;
    const [date, time] = m.slice(1);
    return [date, time];
}
var sel = {
    Menu: '[aria-label="\u30E1\u30A4\u30F3\u30C9\u30ED\u30EF\u30FC"]',
    Summary: [
        '[aria-label="\u30BF\u30A4\u30C8\u30EB\u3068\u65E5\u6642\u3092\u8FFD\u52A0"]',
        '[aria-label="\u30BF\u30A4\u30C8\u30EB\u3092\u8FFD\u52A0"]',
        '[aria-label="\u30BF\u30A4\u30C8\u30EB"]'
    ].join(","),
    StartDate: '[aria-label="\u958B\u59CB\u65E5"]',
    StartTime: '[aria-label="\u958B\u59CB\u6642\u9593"]',
    EndTime: '[aria-label="\u7D42\u4E86\u6642\u9593"]',
    EndDate: '[aria-label="\u7D42\u4E86\u65E5"]',
    AllDay: '[aria-label="\u7D42\u65E5"]',
    TimeZone: '[aria-label="\u30BF\u30A4\u30E0\u30BE\u30FC\u30F3"]',
    Guests: '[aria-label="\u30B2\u30B9\u30C8"]'
};
async function inputDateTimeChange(sdt = 0, edt = 0) {
    const startDateInputPeek = $visiable(sel.StartDate);
    if (!startDateInputPeek) {
        const tz = $visiable(sel.TimeZone);
        if (!tz)
            throw new Error("tz not found");
        const editBtn = parentList(tz)?.find((e) => e.querySelector('[role="button"]'))?.querySelector('[role="button"]');
        if (!editBtn)
            throw new Error("No editable input");
        editBtn.click();
        await sleep(64);
    }
    const startDateInput = $visiable(sel.StartDate);
    const startTimeInput = $visiable(sel.StartTime);
    const endTimeInput = $visiable(sel.EndTime);
    const endDateInput = $visiable(sel.EndDate);
    const endDateInput1 = endDateInput ?? startDateInput;
    if (!startDateInput)
        throw new Error("no startDateInput");
    const startDate = await dateInputParse(startDateInput, startTimeInput);
    const endDate = await dateInputParse(endDateInput1, endTimeInput);
    const startDateObj1 = new Date(+startDate + sdt);
    const endDateObj1 = new Date(+endDate + edt);
    const [startDate0, startTime0] = dateParse(startDate);
    const [endDate0, endTime0] = dateParse(endDate);
    const [startDate1, startTime1] = dateParse(startDateObj1);
    const [endDate1, endTime1] = dateParse(endDateObj1);
    if (globalThis.gkcs_verbose)
        console.table({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            startDateObj1: startDateObj1.toISOString(),
            endDateObj1: endDateObj1.toISOString()
        });
    if (globalThis.gkcs_verbose)
        console.table({
            startDateInput: Boolean(startDateInput),
            startTimeInput: Boolean(startTimeInput),
            endDateInput: Boolean(endDateInput),
            endTimeInput: Boolean(endTimeInput),
            startDate0,
            startDate1,
            startTime0,
            startTime1,
            endDate0,
            endDate1,
            endTime0,
            endTime1
        });
    startDateInput && startDate1 !== startDate0 && await inputValueSet(startDateInput, startDate1);
    endDateInput && endDate1 !== endDate0 && await inputValueSet(endDateInput, endDate1);
    startTimeInput && startTime1 !== startTime0 && await inputValueSet(startTimeInput, startTime1);
    endTimeInput && endTime1 !== endTime0 && await inputValueSet(endTimeInput, endTime1);
    $visiable(sel.Summary)?.focus();
}
async function timeAddTry() {
    const btn = $$("button").find(
        (e) => ["Add time", "\u6642\u9593\u3092\u8FFD\u52A0"].includes(e.textContent ?? "")
    );
    if (!btn)
        return 0;
    btn.click();
    await sleep(64);
    return 1;
}
function eleVisiable(ele) {
    return (ele.getClientRects().length && ele) ?? false;
}
function $visiable(sel2, el = document) {
    return $$(sel2, el).filter(eleVisiable)[0] ?? null;
}
function parentList(el) {
    const parent = el?.parentElement;
    if (!parent)
        return [];
    return [parent, ...parentList(parent)];
}
function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function mouseOpt([x, y]) {
    return {
        isTrusted: true,
        bubbles: true,
        button: 0,
        buttons: 1,
        cancelBubble: false,
        cancelable: true,
        clientX: x,
        clientY: y,
        movementX: 0,
        movementY: 0,
        x,
        y
    };
}
function centerGet(element) {
    const { x, y, width: w, height: h } = element.getBoundingClientRect();
    return [x + w / 2, y + h / 2];
}
function vec2add([x, y], [z, w]) {
    return [x + z, y + w];
}
function $(sel2) {
    return document.querySelector(sel2);
}
function onlyPatternSelectorGenerate(element) {
    let deep = 0;
    let ps = "";
    while (1) {
        ps = patternSelectorGenerate(element, { deep });
        if ($$(ps).length <= 1)
            break;
        deep++;
    }
    return { ps, deep };
}
function patternSelectorGenerate(element, { deep = 0 } = {}) {
    const psg = (e) => patternSelectorGenerate(e, { deep: deep - 1 });
    const tag = element.tagName.toLowerCase();
    const attrs = [
        "aria-label",
        "data-key",
        "role",
        "type"
    ].map((name) => attrSel(element, name)).filter((e) => !e.match("\n")).join("");
    let base = `${tag}${attrs}`;
    if (!deep)
        return base;
    const next = element.nextElementSibling;
    if (next)
        base = `${base}:has(+${psg(next).replace(/:has\(.*?\)/g, "")})`;
    const prev = element.previousElementSibling;
    if (prev)
        return `${psg(prev)}+${base}`;
    const parent = element.parentElement;
    if (!parent)
        return base;
    const children = [...parent.children];
    const nth = children.findIndex((v) => element === v) + 1;
    const nthl = children.length - nth + 1;
    if (!nth)
        return base;
    const parentSelector = psg(parent);
    return `${parentSelector}>${base}:nth-child(${nth}):nth-last-child(${nthl})`;
}
function attrSel(element, name) {
    const attr = element.getAttribute(name);
    const dataKey = attr !== null ? attr ? `[${name}="${attr}"]` : `[${name}]` : "";
    return dataKey;
}
function eventDrag([dx, dy] = [0, 0], { expand = false } = {}) {
    const summaryInput = $visiable(sel.Summary);
    summaryInput?.focus();
    if (!dg()) {
        const floatingBtns = [
            .../* @__PURE__ */ new Set([
                ...$$('div[role="button"]').reverse().filter((e) => getComputedStyle(e).zIndex === "5004"),
                ...$$('div:has([role="button"])').reverse().filter((e) => getComputedStyle(e).zIndex === "5004")
            ])
        ];
        if (floatingBtns.length > 1)
            throw new Error("Multiple floating");
        const floatingBtn = floatingBtns[0];
        if (!floatingBtn)
            throw new Error("no event selected");
        const target = expand ? floatingBtn.querySelector('*[data-dragsource-type="3"]') : floatingBtn;
        if (!target)
            throw new Error("no dragTarget exists");
        console.log(target);
        const pos = centerGet(target);
        console.log("cpos", pos);
        ds({ pos, target });
        posHint(pos);
        target.dispatchEvent(new MouseEvent("mousedown", mouseOpt(pos)));
        document.dispatchEvent(new MouseEvent("mousemove", mouseOpt(pos)));
    }
    if (dg()) {
        const container = $('[role="row"][data-dragsource-type="4"]');
        const gridcells = [...container.querySelectorAll('[role="gridcell"]')];
        const containerSize = container.getBoundingClientRect();
        const w = containerSize.width / gridcells.length;
        const h = containerSize.height / 24 / 4;
        ds({
            pos: vec2add(dg().pos, [dx * w, dy * h]),
            target: dg().target
        });
        const pos = dg().pos;
        posHint(pos);
        document.body.dispatchEvent(new MouseEvent("mousemove", mouseOpt(pos)));
    }
    const unload = useListener()("keyup", (e) => {
        if (!["AltLeft", "AltRight"].includes(e.code))
            return;
        unload();
        ds(null);
        document.dispatchEvent(
            new MouseEvent("mouseup", { bubbles: true, cancelable: true })
        );
    });
    return unload;
}
function posHint(pos) {
    const div = document.createElement("div");
    div.style.background = "red";
    div.style.position = "absolute";
    div.style.left = pos[0] + "px";
    div.style.top = pos[1] + "px";
    div.style.width = "1px";
    div.style.height = "1px";
    div.style.zIndex = "10000";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 200);
}
function draggingUse() {
    const draggingGet = () => globalThis.gcks_dragging;
    const draggingSet = (s) => globalThis.gcks_dragging = s;
    return { draggingGet, draggingSet };
}
