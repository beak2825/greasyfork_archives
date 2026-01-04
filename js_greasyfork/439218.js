// ==UserScript==
// @name            [SNOLAB] Alt + 123... Searching Results Links List Batch Open
// @name:zh         [雪星实验室] Alt + 123... 一键批量打开谷歌必应搜索的前2的n次方项搜索结果
// @namespace       snomiao@gmail.com
// @version         1.0.5
// @description     To quickly understand a field, press Alt+1 ...2,3,4...Alt+5 on the search page of Google or Bing to open the search results of the first 2 nth power items and copy the opened ones link. Currently supports: Google, Bing, Zhihu.
// @description:zh  快速了解一个领域用，在谷歌或必应的搜索页面 按 Alt+1 ...2,3,4... Alt+5  将会打开前2的n次方项的搜索结果，并复制打开的链接。目前支持：谷歌、必应、知乎。
// @author          snomiao
// @match           *://google.com/*
// @match           *://bing.com/*
// @match           *://youtube.com/*
// @match           *://zhihu.com/*
// @match           *://and-all-searching-results.com/*
// @match           *://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439218/%5BSNOLAB%5D%20Alt%20%2B%20123%20Searching%20Results%20Links%20List%20Batch%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/439218/%5BSNOLAB%5D%20Alt%20%2B%20123%20Searching%20Results%20Links%20List%20Batch%20Open.meta.js
// ==/UserScript==

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
function _arity(n, fn) {
  switch (n) {
    case 0:
      return function() {
        return fn.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}
function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}
function pipe() {
  if (arguments.length === 0) {
    throw new Error("pipe requires at least one argument");
  }
  return _arity(arguments[0].length, reduceFn(_pipe, arguments[0], Array.prototype.slice.call(arguments, 1, Infinity)));
}
var {
  keys: keys$1
} = Object;
function mapArray(fn, list, isIndexed = false) {
  let index = 0;
  const willReturn = Array(list.length);
  while (index < list.length) {
    willReturn[index] = isIndexed ? fn(list[index], index) : fn(list[index]);
    index++;
  }
  return willReturn;
}
function mapObject2(fn, obj) {
  if (arguments.length === 1) {
    return (_obj) => mapObject2(fn, _obj);
  }
  let index = 0;
  const objKeys = keys$1(obj);
  const len = objKeys.length;
  const willReturn = {};
  while (index < len) {
    const key = objKeys[index];
    willReturn[key] = fn(obj[key], key, obj);
    index++;
  }
  return willReturn;
}
function map(fn, iterable) {
  if (arguments.length === 1)
    return (_iterable) => map(fn, _iterable);
  if (!iterable) {
    throw new Error(INCORRECT_ITERABLE_INPUT);
  }
  if (isArray(iterable))
    return mapArray(fn, iterable);
  return mapObject2(fn, iterable);
}
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
function filterObject(predicate, obj) {
  const willReturn = {};
  for (const prop2 in obj) {
    if (predicate(obj[prop2], prop2, obj)) {
      willReturn[prop2] = obj[prop2];
    }
  }
  return willReturn;
}
function filterArray(predicate, list, indexed = false) {
  let index = 0;
  const len = list.length;
  const willReturn = [];
  while (index < len) {
    const predicateResult = indexed ? predicate(list[index], index) : predicate(list[index]);
    if (predicateResult) {
      willReturn.push(list[index]);
    }
    index++;
  }
  return willReturn;
}
function filter(predicate, iterable) {
  if (arguments.length === 1)
    return (_iterable) => filter(predicate, _iterable);
  if (!iterable) {
    throw new Error("Incorrect iterable input");
  }
  if (isArray(iterable))
    return filterArray(predicate, iterable, false);
  return filterObject(predicate, iterable);
}
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
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys2.push.apply(keys2, symbols);
  }
  return keys2;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
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
function sortBy(sortFn, list) {
  if (arguments.length === 1)
    return (_list) => sortBy(sortFn, _list);
  const clone = cloneList(list);
  return clone.sort((a, b) => {
    const aSortResult = sortFn(a);
    const bSortResult = sortFn(b);
    if (aSortResult === bSortResult)
      return 0;
    return aSortResult < bSortResult ? -1 : 1;
  });
}
function take(howMany, listOrString) {
  if (arguments.length === 1)
    return (_listOrString) => take(howMany, _listOrString);
  if (howMany < 0)
    return listOrString.slice();
  if (typeof listOrString === "string")
    return listOrString.slice(0, howMany);
  return baseSlice(listOrString, 0, howMany);
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
function $$(sel, el = document) {
  return [...el.querySelectorAll(sel)];
}

// LinksListBatchOpen
globalThis.llboUnload?.();
globalThis.llboUnload = main();
function main() {
  console.log("[\u8C37\u6B4C\u4E00\u952E\u6253\u5F00\u524DN\u9879\u641C\u7D22\u7ED3\u679C] LOADED");
  const \u5DF2\u6253\u5F00\u8FC7\u7684\u94FE\u63A5 = {};
  return hotkeyMapper(
    {
      "alt+1": () => openLinkByCount(2 ** 1),
      "alt+2": () => openLinkByCount(2 ** 2),
      "alt+3": () => openLinkByCount(2 ** 3),
      "alt+4": () => openLinkByCount(2 ** 4),
      "alt+5": () => openLinkByCount(2 ** 5),
      "alt+6": () => openLinkByCount(2 ** 6),
      "alt+7": () => openLinkByCount(2 ** 7),
      "alt+8": () => openLinkByCount(2 ** 8),
      "alt+9": () => openLinkByCount(2 ** 9),
      "shift+alt+1": () => tryCopyLinkByCount(2 ** 1),
      "shift+alt+2": () => tryCopyLinkByCount(2 ** 2),
      "shift+alt+3": () => tryCopyLinkByCount(2 ** 3),
      "shift+alt+4": () => tryCopyLinkByCount(2 ** 4),
      "shift+alt+5": () => tryCopyLinkByCount(2 ** 5),
      "shift+alt+6": () => tryCopyLinkByCount(2 ** 6),
      "shift+alt+7": () => tryCopyLinkByCount(2 ** 7),
      "shift+alt+8": () => tryCopyLinkByCount(2 ** 8),
      "shift+alt+9": () => tryCopyLinkByCount(2 ** 9)
    },
    void 0,
    true
  );
  function linkOpen(link) {
    if (!\u5DF2\u6253\u5F00\u8FC7\u7684\u94FE\u63A5[link]) {
      window.open(link);
    }
    \u5DF2\u6253\u5F00\u8FC7\u7684\u94FE\u63A5[link] = 1;
  }
  function openLinkByCount(count = 1) {
    console.log("openLinkByCount", count);
    const links = getLinks(count);
    copyLinks(links);
    links.map((e) => e.link).reverse().map(linkOpen);
  }
}
function tryCopyLinkByCount(count = 1) {
  const links = getLinks(count);
  copyLinks(links);
  return links;
}
async function copyLinks(links) {
  const md = links.map(md\u683C\u5F0F\u94FE\u63A5\u751F\u6210).join("\n\n");
  alert("copied links: " + md);
  await browser_default.write(md);
}
function longestCommonSequenceMatrix(m, a, b, x, y) {
  const lcs = longestCommonSequenceMatrix;
  return !x || !y ? "" : a[x - 1] === b[y - 1] ? lcs(m, a, b, x - 1, y - 1) + a[x - 1] : m[y][x - 1] > m[y - 1][x] ? lcs(m, a, b, x - 1, y) : lcs(m, a, b, x, y - 1);
}
function longestCommonSequence(a, b) {
  const w = a.length, h = b.length;
  const m = Array(1 + h).fill(0).map(() => Array(1 + w).fill(0));
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      m[1 + y][1 + x] = a[x] === b[y] ? m[y][x] + 1 : Math.max(m[y][1 + x], m[1 + y][x]);
  return longestCommonSequenceMatrix(m, a, b, w, h);
}
function elementFeatureList(ele) {
  return [...ele.querySelectorAll("*")].map((e) => e?.tagName + e?.className);
}
function featureElementAsk(ele) {
  return !"style script span".toUpperCase().split(" ").includes(ele.tagName);
}
function elementListStrengh(ele) {
  return (ele.textContent || "").length * (ele.children.length - 1) * [...ele.children].filter(featureElementAsk).map(elementFeatureList).map((_, i, a) => longestCommonSequence(a[i], a[i + 1] || [])).reduce((\u524D, \u540E) => \u524D + \u540E.length, 0);
}
function listElementList() {
  return pipe(
    () => $$("div,dl,ul,ol,tbody,table,td"),
    filter((e) => e.children.length > 1),
    map((element) => ({
      element,
      strength: elementListStrengh(element),
      featureList: pipe(
        () => [...element.children],
        filter(featureElementAsk),
        map(elementFeatureList)
      )()
    })),
    sortBy((a) => -a.strength)
  )();
}
function \u6807\u94FE\u5143\u7D20\u63D0\u53D6(e) {
  return e?.querySelector("dd,dt,h1,h2,h3,h4,h5,h6")?.querySelector("a") || [...e?.querySelectorAll("a")]?.filter(
    (e2) => e2.querySelector("dd,dt,h1,h2,h3,h4,h5,h6")
  )?.[0] || e?.querySelector("a");
}
function \u6807\u94FE\u63D0\u53D6(element) {
  return {
    element,
    title: element?.textContent?.replace(/\s+/g, " ").trim(),
    link: element?.href
  };
}
function \u9875\u4E3B\u6807\u94FE\u5217\u63D0\u53D6() {
  return pipe(
    () => listElementList(),
    (list) => list.flatMap(
      (father, i, a) => !a.some((son, j) => i != j && father?.element.contains(son.element)) ? [father] : []
    ),
    (list) => list.flatMap((e, i, a) => e.strength > a[0].strength * 0.1 ? [e] : []),
    sortBy((a) => a.element.offsetTop),
    map(({ element }) => element),
    (e) => e.flatMap((e2) => [...e2?.children]?.map?.(\u6807\u94FE\u5143\u7D20\u63D0\u53D6) || []),
    filter((e) => e),
    map(\u6807\u94FE\u63D0\u53D6),
    filter(({ title, link }) => title),
    filter(({ title, link }) => link?.match?.(/^http/))
  )();
}
function getLinks(\u6570\u91CF = Infinity) {
  return \u9875\u4E3B\u6807\u94FE\u5217\u63D0\u53D6().slice(0, \u6570\u91CF);
}
function md\u683C\u5F0F\u94FE\u63A5\u751F\u6210({ title, link }) {
  return `- [${title}](${link})`;
}
