// ==UserScript==
// @name					木金 网课助手
// @version					3.17.16
// @description				木金 网课助手，支持各平台网课学习，支持超星学习通，知道智慧树，智慧职教（职教云），等网课的学习，作业，考试功能。
// @author					enncy
// @license					MIT
// @namespace				https://enncy.cn
// @homepage				https://docs.ocsjs.com
// @source					https://github.com/ocsjs/ocsjs
// @icon					https://cdn.ocsjs.com/logo.ico
// @connect					enncy.cn
// @connect					icodef.com
// @connect					ocsjs.com
// @connect					localhost
// @match					*://*.chaoxing.com/*
// @match					*://*.edu.cn/*
// @match					*://*.org.cn/*
// @match					*://*.zhihuishu.com/*
// @match					*://*.icve.com.cn/*
// @grant					unsafeWindow
// @grant					GM_xmlhttpRequest
// @grant					GM_setValue
// @grant					GM_getValue
// @grant					GM_addValueChangeListener
// @grant					GM_removeValueChangeListener
// @run-at					document-start
// @downloadURL https://update.greasyfork.org/scripts/468350/%E6%9C%A8%E9%87%91%20%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/468350/%E6%9C%A8%E9%87%91%20%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


/*!
 * ocsjs ( https://github.com/ocsjs/ocsjs#readme )
 * ocs - online course script 在线网络课程辅助工具
 * copyright enncy
 * license MIT
 */

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.OCS = {}));
})(this, function(exports2) {
  "use strict";
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function commonjsRequire(path) {
    throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  function apply$2(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  var _apply = apply$2;
  function identity$2(value) {
    return value;
  }
  var identity_1 = identity$2;
  var apply$1 = _apply;
  var nativeMax$1 = Math.max;
  function overRest$1(func, start2, transform) {
    start2 = nativeMax$1(start2 === void 0 ? func.length - 1 : start2, 0);
    return function() {
      var args = arguments, index2 = -1, length = nativeMax$1(args.length - start2, 0), array = Array(length);
      while (++index2 < length) {
        array[index2] = args[start2 + index2];
      }
      index2 = -1;
      var otherArgs = Array(start2 + 1);
      while (++index2 < start2) {
        otherArgs[index2] = args[index2];
      }
      otherArgs[start2] = transform(array);
      return apply$1(func, this, otherArgs);
    };
  }
  var _overRest = overRest$1;
  function constant$1(value) {
    return function() {
      return value;
    };
  }
  var constant_1 = constant$1;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$9 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$9;
  var root$8 = _root;
  var Symbol$4 = root$8.Symbol;
  var _Symbol = Symbol$4;
  var Symbol$3 = _Symbol;
  var objectProto$d = Object.prototype;
  var hasOwnProperty$b = objectProto$d.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$d.toString;
  var symToStringTag$1 = Symbol$3 ? Symbol$3.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty$b.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$1;
  var objectProto$c = Object.prototype;
  var nativeObjectToString = objectProto$c.toString;
  function objectToString$2(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$2;
  var Symbol$2 = _Symbol, getRawTag = _getRawTag, objectToString$1 = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function baseGetTag$6(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString$1(value);
  }
  var _baseGetTag = baseGetTag$6;
  function isObject$c(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$c;
  var baseGetTag$5 = _baseGetTag, isObject$b = isObject_1;
  var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction$4(value) {
    if (!isObject$b(value)) {
      return false;
    }
    var tag = baseGetTag$5(value);
    return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
  }
  var isFunction_1 = isFunction$4;
  var root$7 = _root;
  var coreJsData$1 = root$7["__core-js_shared__"];
  var _coreJsData = coreJsData$1;
  var coreJsData = _coreJsData;
  var maskSrcKey = function() {
    var uid2 = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid2 ? "Symbol(src)_1." + uid2 : "";
  }();
  function isMasked$1(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var _isMasked = isMasked$1;
  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource$2(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var _toSource = toSource$2;
  var isFunction$3 = isFunction_1, isMasked = _isMasked, isObject$a = isObject_1, toSource$1 = _toSource;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype, objectProto$b = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$a = objectProto$b.hasOwnProperty;
  var reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$a).replace(reRegExpChar, "\\{{SCRIPT_SLOT}}").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  function baseIsNative$1(value) {
    if (!isObject$a(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction$3(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource$1(value));
  }
  var _baseIsNative = baseIsNative$1;
  function getValue$1(object, key) {
    return object == null ? void 0 : object[key];
  }
  var _getValue = getValue$1;
  var baseIsNative = _baseIsNative, getValue = _getValue;
  function getNative$7(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var _getNative = getNative$7;
  var getNative$6 = _getNative;
  var defineProperty$2 = function() {
    try {
      var func = getNative$6(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();
  var _defineProperty = defineProperty$2;
  var constant = constant_1, defineProperty$1 = _defineProperty, identity$1 = identity_1;
  var baseSetToString$1 = !defineProperty$1 ? identity$1 : function(func, string) {
    return defineProperty$1(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };
  var _baseSetToString = baseSetToString$1;
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut$1(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  var _shortOut = shortOut$1;
  var baseSetToString = _baseSetToString, shortOut = _shortOut;
  var setToString$1 = shortOut(baseSetToString);
  var _setToString = setToString$1;
  var identity = identity_1, overRest = _overRest, setToString = _setToString;
  function baseRest$2(func, start2) {
    return setToString(overRest(func, start2, identity), func + "");
  }
  var _baseRest = baseRest$2;
  function listCacheClear$1() {
    this.__data__ = [];
    this.size = 0;
  }
  var _listCacheClear = listCacheClear$1;
  function eq$4(value, other) {
    return value === other || value !== value && other !== other;
  }
  var eq_1 = eq$4;
  var eq$3 = eq_1;
  function assocIndexOf$4(array, key) {
    var length = array.length;
    while (length--) {
      if (eq$3(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var _assocIndexOf = assocIndexOf$4;
  var assocIndexOf$3 = _assocIndexOf;
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete$1(key) {
    var data = this.__data__, index2 = assocIndexOf$3(data, key);
    if (index2 < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index2 == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index2, 1);
    }
    --this.size;
    return true;
  }
  var _listCacheDelete = listCacheDelete$1;
  var assocIndexOf$2 = _assocIndexOf;
  function listCacheGet$1(key) {
    var data = this.__data__, index2 = assocIndexOf$2(data, key);
    return index2 < 0 ? void 0 : data[index2][1];
  }
  var _listCacheGet = listCacheGet$1;
  var assocIndexOf$1 = _assocIndexOf;
  function listCacheHas$1(key) {
    return assocIndexOf$1(this.__data__, key) > -1;
  }
  var _listCacheHas = listCacheHas$1;
  var assocIndexOf = _assocIndexOf;
  function listCacheSet$1(key, value) {
    var data = this.__data__, index2 = assocIndexOf(data, key);
    if (index2 < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index2][1] = value;
    }
    return this;
  }
  var _listCacheSet = listCacheSet$1;
  var listCacheClear = _listCacheClear, listCacheDelete = _listCacheDelete, listCacheGet = _listCacheGet, listCacheHas = _listCacheHas, listCacheSet = _listCacheSet;
  function ListCache$4(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache$4.prototype.clear = listCacheClear;
  ListCache$4.prototype["delete"] = listCacheDelete;
  ListCache$4.prototype.get = listCacheGet;
  ListCache$4.prototype.has = listCacheHas;
  ListCache$4.prototype.set = listCacheSet;
  var _ListCache = ListCache$4;
  var ListCache$3 = _ListCache;
  function stackClear$1() {
    this.__data__ = new ListCache$3();
    this.size = 0;
  }
  var _stackClear = stackClear$1;
  function stackDelete$1(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  var _stackDelete = stackDelete$1;
  function stackGet$1(key) {
    return this.__data__.get(key);
  }
  var _stackGet = stackGet$1;
  function stackHas$1(key) {
    return this.__data__.has(key);
  }
  var _stackHas = stackHas$1;
  var getNative$5 = _getNative, root$6 = _root;
  var Map$4 = getNative$5(root$6, "Map");
  var _Map = Map$4;
  var getNative$4 = _getNative;
  var nativeCreate$4 = getNative$4(Object, "create");
  var _nativeCreate = nativeCreate$4;
  var nativeCreate$3 = _nativeCreate;
  function hashClear$1() {
    this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
    this.size = 0;
  }
  var _hashClear = hashClear$1;
  function hashDelete$1(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var _hashDelete = hashDelete$1;
  var nativeCreate$2 = _nativeCreate;
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  var objectProto$a = Object.prototype;
  var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
  function hashGet$1(key) {
    var data = this.__data__;
    if (nativeCreate$2) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? void 0 : result;
    }
    return hasOwnProperty$9.call(data, key) ? data[key] : void 0;
  }
  var _hashGet = hashGet$1;
  var nativeCreate$1 = _nativeCreate;
  var objectProto$9 = Object.prototype;
  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  function hashHas$1(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$8.call(data, key);
  }
  var _hashHas = hashHas$1;
  var nativeCreate = _nativeCreate;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet$1(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  var _hashSet = hashSet$1;
  var hashClear = _hashClear, hashDelete = _hashDelete, hashGet = _hashGet, hashHas = _hashHas, hashSet = _hashSet;
  function Hash$1(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  Hash$1.prototype.clear = hashClear;
  Hash$1.prototype["delete"] = hashDelete;
  Hash$1.prototype.get = hashGet;
  Hash$1.prototype.has = hashHas;
  Hash$1.prototype.set = hashSet;
  var _Hash = Hash$1;
  var Hash = _Hash, ListCache$2 = _ListCache, Map$3 = _Map;
  function mapCacheClear$1() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$3 || ListCache$2)(),
      "string": new Hash()
    };
  }
  var _mapCacheClear = mapCacheClear$1;
  function isKeyable$1(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  var _isKeyable = isKeyable$1;
  var isKeyable = _isKeyable;
  function getMapData$4(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  var _getMapData = getMapData$4;
  var getMapData$3 = _getMapData;
  function mapCacheDelete$1(key) {
    var result = getMapData$3(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  var _mapCacheDelete = mapCacheDelete$1;
  var getMapData$2 = _getMapData;
  function mapCacheGet$1(key) {
    return getMapData$2(this, key).get(key);
  }
  var _mapCacheGet = mapCacheGet$1;
  var getMapData$1 = _getMapData;
  function mapCacheHas$1(key) {
    return getMapData$1(this, key).has(key);
  }
  var _mapCacheHas = mapCacheHas$1;
  var getMapData = _getMapData;
  function mapCacheSet$1(key, value) {
    var data = getMapData(this, key), size2 = data.size;
    data.set(key, value);
    this.size += data.size == size2 ? 0 : 1;
    return this;
  }
  var _mapCacheSet = mapCacheSet$1;
  var mapCacheClear = _mapCacheClear, mapCacheDelete = _mapCacheDelete, mapCacheGet = _mapCacheGet, mapCacheHas = _mapCacheHas, mapCacheSet = _mapCacheSet;
  function MapCache$1(entries) {
    var index2 = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index2 < length) {
      var entry = entries[index2];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache$1.prototype.clear = mapCacheClear;
  MapCache$1.prototype["delete"] = mapCacheDelete;
  MapCache$1.prototype.get = mapCacheGet;
  MapCache$1.prototype.has = mapCacheHas;
  MapCache$1.prototype.set = mapCacheSet;
  var _MapCache = MapCache$1;
  var ListCache$1 = _ListCache, Map$2 = _Map, MapCache = _MapCache;
  var LARGE_ARRAY_SIZE = 200;
  function stackSet$1(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache$1) {
      var pairs = data.__data__;
      if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  var _stackSet = stackSet$1;
  var ListCache = _ListCache, stackClear = _stackClear, stackDelete = _stackDelete, stackGet = _stackGet, stackHas = _stackHas, stackSet = _stackSet;
  function Stack$2(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack$2.prototype.clear = stackClear;
  Stack$2.prototype["delete"] = stackDelete;
  Stack$2.prototype.get = stackGet;
  Stack$2.prototype.has = stackHas;
  Stack$2.prototype.set = stackSet;
  var _Stack = Stack$2;
  var defineProperty = _defineProperty;
  function baseAssignValue$3(object, key, value) {
    if (key == "__proto__" && defineProperty) {
      defineProperty(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  var _baseAssignValue = baseAssignValue$3;
  var baseAssignValue$2 = _baseAssignValue, eq$2 = eq_1;
  function assignMergeValue$2(object, key, value) {
    if (value !== void 0 && !eq$2(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue$2(object, key, value);
    }
  }
  var _assignMergeValue = assignMergeValue$2;
  function createBaseFor$1(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index2 = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index2];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var _createBaseFor = createBaseFor$1;
  var createBaseFor = _createBaseFor;
  var baseFor$1 = createBaseFor();
  var _baseFor = baseFor$1;
  var _cloneBuffer = { exports: {} };
  (function(module2, exports3) {
    var root2 = _root;
    var freeExports = exports3 && !exports3.nodeType && exports3;
    var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root2.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
    function cloneBuffer2(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    module2.exports = cloneBuffer2;
  })(_cloneBuffer, _cloneBuffer.exports);
  var root$5 = _root;
  var Uint8Array$2 = root$5.Uint8Array;
  var _Uint8Array = Uint8Array$2;
  var Uint8Array$1 = _Uint8Array;
  function cloneArrayBuffer$3(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }
  var _cloneArrayBuffer = cloneArrayBuffer$3;
  var cloneArrayBuffer$2 = _cloneArrayBuffer;
  function cloneTypedArray$2(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer$2(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  var _cloneTypedArray = cloneTypedArray$2;
  function copyArray$2(source, array) {
    var index2 = -1, length = source.length;
    array || (array = Array(length));
    while (++index2 < length) {
      array[index2] = source[index2];
    }
    return array;
  }
  var _copyArray = copyArray$2;
  var isObject$9 = isObject_1;
  var objectCreate = Object.create;
  var baseCreate$1 = function() {
    function object() {
    }
    return function(proto) {
      if (!isObject$9(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  var _baseCreate = baseCreate$1;
  function overArg$2(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var _overArg = overArg$2;
  var overArg$1 = _overArg;
  var getPrototype$3 = overArg$1(Object.getPrototypeOf, Object);
  var _getPrototype = getPrototype$3;
  var objectProto$8 = Object.prototype;
  function isPrototype$3(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$8;
    return value === proto;
  }
  var _isPrototype = isPrototype$3;
  var baseCreate = _baseCreate, getPrototype$2 = _getPrototype, isPrototype$2 = _isPrototype;
  function initCloneObject$2(object) {
    return typeof object.constructor == "function" && !isPrototype$2(object) ? baseCreate(getPrototype$2(object)) : {};
  }
  var _initCloneObject = initCloneObject$2;
  function isObjectLike$8(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$8;
  var baseGetTag$4 = _baseGetTag, isObjectLike$7 = isObjectLike_1;
  var argsTag$2 = "[object Arguments]";
  function baseIsArguments$1(value) {
    return isObjectLike$7(value) && baseGetTag$4(value) == argsTag$2;
  }
  var _baseIsArguments = baseIsArguments$1;
  var baseIsArguments = _baseIsArguments, isObjectLike$6 = isObjectLike_1;
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$7 = objectProto$7.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;
  var isArguments$2 = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike$6(value) && hasOwnProperty$7.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  var isArguments_1 = isArguments$2;
  var isArray$5 = Array.isArray;
  var isArray_1 = isArray$5;
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  function isLength$2(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }
  var isLength_1 = isLength$2;
  var isFunction$2 = isFunction_1, isLength$1 = isLength_1;
  function isArrayLike$4(value) {
    return value != null && isLength$1(value.length) && !isFunction$2(value);
  }
  var isArrayLike_1 = isArrayLike$4;
  var isArrayLike$3 = isArrayLike_1, isObjectLike$5 = isObjectLike_1;
  function isArrayLikeObject$1(value) {
    return isObjectLike$5(value) && isArrayLike$3(value);
  }
  var isArrayLikeObject_1 = isArrayLikeObject$1;
  var isBuffer$4 = { exports: {} };
  function stubFalse() {
    return false;
  }
  var stubFalse_1 = stubFalse;
  (function(module2, exports3) {
    var root2 = _root, stubFalse2 = stubFalse_1;
    var freeExports = exports3 && !exports3.nodeType && exports3;
    var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root2.Buffer : void 0;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var isBuffer2 = nativeIsBuffer || stubFalse2;
    module2.exports = isBuffer2;
  })(isBuffer$4, isBuffer$4.exports);
  var baseGetTag$3 = _baseGetTag, getPrototype$1 = _getPrototype, isObjectLike$4 = isObjectLike_1;
  var objectTag$3 = "[object Object]";
  var funcProto = Function.prototype, objectProto$6 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject$2(value) {
    if (!isObjectLike$4(value) || baseGetTag$3(value) != objectTag$3) {
      return false;
    }
    var proto = getPrototype$1(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$6.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  var isPlainObject_1 = isPlainObject$2;
  var baseGetTag$2 = _baseGetTag, isLength = isLength_1, isObjectLike$3 = isObjectLike_1;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag$1 = "[object Function]", mapTag$4 = "[object Map]", numberTag$2 = "[object Number]", objectTag$2 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$2 = "[object String]", weakMapTag$2 = "[object WeakMap]";
  var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$3 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] = typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] = typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] = typedArrayTags[weakMapTag$2] = false;
  function baseIsTypedArray$1(value) {
    return isObjectLike$3(value) && isLength(value.length) && !!typedArrayTags[baseGetTag$2(value)];
  }
  var _baseIsTypedArray = baseIsTypedArray$1;
  function baseUnary$3(func) {
    return function(value) {
      return func(value);
    };
  }
  var _baseUnary = baseUnary$3;
  var _nodeUtil = { exports: {} };
  (function(module2, exports3) {
    var freeGlobal2 = _freeGlobal;
    var freeExports = exports3 && !exports3.nodeType && exports3;
    var freeModule = freeExports && true && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal2.process;
    var nodeUtil2 = function() {
      try {
        var types2 = freeModule && freeModule.require && freeModule.require("util").types;
        if (types2) {
          return types2;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    module2.exports = nodeUtil2;
  })(_nodeUtil, _nodeUtil.exports);
  var baseIsTypedArray = _baseIsTypedArray, baseUnary$2 = _baseUnary, nodeUtil$2 = _nodeUtil.exports;
  var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;
  var isTypedArray$2 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;
  var isTypedArray_1 = isTypedArray$2;
  function safeGet$2(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }
  var _safeGet = safeGet$2;
  var baseAssignValue$1 = _baseAssignValue, eq$1 = eq_1;
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
  function assignValue$2(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$5.call(object, key) && eq$1(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue$1(object, key, value);
    }
  }
  var _assignValue = assignValue$2;
  var assignValue$1 = _assignValue, baseAssignValue = _baseAssignValue;
  function copyObject$5(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index2 = -1, length = props.length;
    while (++index2 < length) {
      var key = props[index2];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue$1(object, key, newValue);
      }
    }
    return object;
  }
  var _copyObject = copyObject$5;
  function baseTimes$1(n, iteratee) {
    var index2 = -1, result = Array(n);
    while (++index2 < n) {
      result[index2] = iteratee(index2);
    }
    return result;
  }
  var _baseTimes = baseTimes$1;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex$2(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  var _isIndex = isIndex$2;
  var baseTimes = _baseTimes, isArguments$1 = isArguments_1, isArray$4 = isArray_1, isBuffer$3 = isBuffer$4.exports, isIndex$1 = _isIndex, isTypedArray$1 = isTypedArray_1;
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  function arrayLikeKeys$2(value, inherited) {
    var isArr = isArray$4(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$3(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$4.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex$1(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  var _arrayLikeKeys = arrayLikeKeys$2;
  function nativeKeysIn$1(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  var _nativeKeysIn = nativeKeysIn$1;
  var isObject$8 = isObject_1, isPrototype$1 = _isPrototype, nativeKeysIn = _nativeKeysIn;
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  function baseKeysIn$1(object) {
    if (!isObject$8(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype$1(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$3.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  var _baseKeysIn = baseKeysIn$1;
  var arrayLikeKeys$1 = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike$2 = isArrayLike_1;
  function keysIn$5(object) {
    return isArrayLike$2(object) ? arrayLikeKeys$1(object, true) : baseKeysIn(object);
  }
  var keysIn_1 = keysIn$5;
  var copyObject$4 = _copyObject, keysIn$4 = keysIn_1;
  function toPlainObject$1(value) {
    return copyObject$4(value, keysIn$4(value));
  }
  var toPlainObject_1 = toPlainObject$1;
  var assignMergeValue$1 = _assignMergeValue, cloneBuffer$1 = _cloneBuffer.exports, cloneTypedArray$1 = _cloneTypedArray, copyArray$1 = _copyArray, initCloneObject$1 = _initCloneObject, isArguments = isArguments_1, isArray$3 = isArray_1, isArrayLikeObject = isArrayLikeObject_1, isBuffer$2 = isBuffer$4.exports, isFunction$1 = isFunction_1, isObject$7 = isObject_1, isPlainObject$1 = isPlainObject_1, isTypedArray = isTypedArray_1, safeGet$1 = _safeGet, toPlainObject = toPlainObject_1;
  function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet$1(object, key), srcValue = safeGet$1(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue$1(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray$3(srcValue), isBuff = !isArr && isBuffer$2(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray$3(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray$1(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer$1(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray$1(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject$1(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject$7(objValue) || isFunction$1(objValue)) {
          newValue = initCloneObject$1(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue$1(object, key, newValue);
  }
  var _baseMergeDeep = baseMergeDeep$1;
  var Stack$1 = _Stack, assignMergeValue = _assignMergeValue, baseFor = _baseFor, baseMergeDeep = _baseMergeDeep, isObject$6 = isObject_1, keysIn$3 = keysIn_1, safeGet = _safeGet;
  function baseMerge$2(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack$1());
      if (isObject$6(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge$2, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn$3);
  }
  var _baseMerge = baseMerge$2;
  var baseMerge$1 = _baseMerge, isObject$5 = isObject_1;
  function customDefaultsMerge$1(objValue, srcValue, key, object, source, stack) {
    if (isObject$5(objValue) && isObject$5(srcValue)) {
      stack.set(srcValue, objValue);
      baseMerge$1(objValue, srcValue, void 0, customDefaultsMerge$1, stack);
      stack["delete"](srcValue);
    }
    return objValue;
  }
  var _customDefaultsMerge = customDefaultsMerge$1;
  var eq = eq_1, isArrayLike$1 = isArrayLike_1, isIndex = _isIndex, isObject$4 = isObject_1;
  function isIterateeCall$1(value, index2, object) {
    if (!isObject$4(object)) {
      return false;
    }
    var type = typeof index2;
    if (type == "number" ? isArrayLike$1(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
      return eq(object[index2], value);
    }
    return false;
  }
  var _isIterateeCall = isIterateeCall$1;
  var baseRest$1 = _baseRest, isIterateeCall = _isIterateeCall;
  function createAssigner$1(assigner) {
    return baseRest$1(function(object, sources) {
      var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index2 < length) {
        var source = sources[index2];
        if (source) {
          assigner(object, source, index2, customizer);
        }
      }
      return object;
    });
  }
  var _createAssigner = createAssigner$1;
  var baseMerge = _baseMerge, createAssigner = _createAssigner;
  var mergeWith$1 = createAssigner(function(object, source, srcIndex, customizer) {
    baseMerge(object, source, srcIndex, customizer);
  });
  var mergeWith_1 = mergeWith$1;
  var apply = _apply, baseRest = _baseRest, customDefaultsMerge = _customDefaultsMerge, mergeWith = mergeWith_1;
  var defaultsDeep = baseRest(function(args) {
    args.push(void 0, customDefaultsMerge);
    return apply(mergeWith, void 0, args);
  });
  var defaultsDeep_1 = defaultsDeep;
  function makeMap(str, expectsLowerCase) {
    const map = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function normalizeStyle(value) {
    if (isArray$2(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value)) {
      return value;
    } else if (isObject$3(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:(.+)/;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray$2(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject$3(value)) {
      for (const name2 in value) {
        if (value[name2]) {
          res += name2 + " ";
        }
      }
    }
    return res.trim();
  }
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray$2(val) || isObject$3(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (val && val.__v_isRef) {
      return replacer(_key, val.value);
    } else if (isMap$2(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
          entries[`${key} =>`] = val2;
          return entries;
        }, {})
      };
    } else if (isSet$2(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()]
      };
    } else if (isObject$3(val) && !isArray$2(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const onRE = /^on[^a-z]/;
  const isOn = (key) => onRE.test(key);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
  const isArray$2 = Array.isArray;
  const isMap$2 = (val) => toTypeString(val) === "[object Map]";
  const isSet$2 = (val) => toTypeString(val) === "[object Set]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol$2 = (val) => typeof val === "symbol";
  const isObject$3 = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject$3(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
  const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
  const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };
  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };
  const toNumber$2 = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.active = true;
      this.effects = [];
      this.cleanups = [];
      if (!detached && activeEffectScope) {
        this.parent = activeEffectScope;
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
      }
    }
    run(fn) {
      if (this.active) {
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = this.parent;
        }
      }
    }
    on() {
      activeEffectScope = this;
    }
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this.active) {
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
        }
        if (this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.active = false;
      }
    }
  }
  function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }
  const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };
  const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
  const newTracked = (dep) => (dep.n & trackOpBit) > 0;
  const initDepMarkers = ({ deps }) => {
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit;
      }
    }
  };
  const finalizeDepMarkers = (effect) => {
    const { deps } = effect;
    if (deps.length) {
      let ptr = 0;
      for (let i = 0; i < deps.length; i++) {
        const dep = deps[i];
        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        }
        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }
      deps.length = ptr;
    }
  };
  const targetMap = /* @__PURE__ */ new WeakMap();
  let effectTrackDepth = 0;
  let trackOpBit = 1;
  const maxMarkerBits = 30;
  let activeEffect;
  const ITERATE_KEY = Symbol("");
  const MAP_KEY_ITERATE_KEY = Symbol("");
  class ReactiveEffect {
    constructor(fn, scheduler = null, scope) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
      recordEffectScope(this, scope);
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      let parent = activeEffect;
      let lastShouldTrack = shouldTrack;
      while (parent) {
        if (parent === this) {
          return;
        }
        parent = parent.parent;
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        shouldTrack = true;
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        activeEffect = this.parent;
        shouldTrack = lastShouldTrack;
        this.parent = void 0;
      }
    }
    stop() {
      if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  }
  function cleanupEffect(effect) {
    const { deps } = effect;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect);
      }
      deps.length = 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = createDep());
      }
      trackEffects(dep);
    }
  }
  function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack2 = false;
    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit;
        shouldTrack2 = !wasTracked(dep);
      }
    } else {
      shouldTrack2 = !dep.has(activeEffect);
    }
    if (shouldTrack2) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = [];
    if (type === "clear") {
      deps = [...depsMap.values()];
    } else if (key === "length" && isArray$2(target)) {
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newValue) {
          deps.push(dep);
        }
      });
    } else {
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray$2(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap$2(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray$2(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap$2(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap$2(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    if (deps.length === 1) {
      if (deps[0]) {
        {
          triggerEffects(deps[0]);
        }
      }
    } else {
      const effects = [];
      for (const dep of deps) {
        if (dep) {
          effects.push(...dep);
        }
      }
      {
        triggerEffects(createDep(effects));
      }
    }
  }
  function triggerEffects(dep, debuggerEventExtraInfo) {
    for (const effect of isArray$2(dep) ? dep : [...dep]) {
      if (effect !== activeEffect || effect.allowRecurse) {
        if (effect.scheduler) {
          effect.scheduler();
        } else {
          effect.run();
        }
      }
    }
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol$2));
  const get = /* @__PURE__ */ createGetter();
  const shallowGet = /* @__PURE__ */ createGetter(false, true);
  const readonlyGet = /* @__PURE__ */ createGetter(true);
  const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
          track(arr, "get", i + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        const res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function createGetter(isReadonly2 = false, shallow = false) {
    return function get2(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return shallow;
      } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray$2(target);
      if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol$2(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }
      if (isObject$3(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    };
  }
  const set = /* @__PURE__ */ createSetter();
  const shallowSet = /* @__PURE__ */ createSetter(true);
  function createSetter(shallow = false) {
    return function set2(target, key, value, receiver) {
      let oldValue = target[key];
      if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
        return false;
      }
      if (!shallow && !isReadonly(value)) {
        if (!isShallow(value)) {
          value = toRaw(value);
          oldValue = toRaw(oldValue);
        }
        if (!isArray$2(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray$2(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol$2(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray$2(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
  };
  const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      return true;
    },
    deleteProperty(target, key) {
      return true;
    }
  };
  const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
  });
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
    target = target["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly2 && track(rawTarget, "get", key);
    }
    !isReadonly2 && track(rawTarget, "get", rawKey);
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has$1(key, isReadonly2 = false) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly2 && track(rawTarget, "has", key);
    }
    !isReadonly2 && track(rawTarget, "has", rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly2 = false) {
    target = target["__v_raw"];
    !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    }
    const oldValue = get2.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    }
    get2 ? get2.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0);
    }
    return result;
  }
  function createForEach(isReadonly2, isShallow2) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap$2(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get$1(this, key);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get$1(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
      shallowInstrumentations2[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$3(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    def(value, "__v_skip", true);
    return value;
  }
  const toReactive = (value) => isObject$3(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject$3(value) ? readonly(value) : value;
  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      {
        trackEffects(ref2.dep || (ref2.dep = createDep()));
      }
    }
  }
  function triggerRefValue(ref2, newVal) {
    ref2 = toRaw(ref2);
    if (ref2.dep) {
      {
        triggerEffects(ref2.dep);
      }
    }
  }
  function isRef(r) {
    return !!(r && r.__v_isRef === true);
  }
  function ref(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow;
      this.dep = void 0;
      this.__v_isRef = true;
      this._rawValue = __v_isShallow ? value : toRaw(value);
      this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      trackRefValue(this);
      return this._value;
    }
    set value(newVal) {
      newVal = this.__v_isShallow ? newVal : toRaw(newVal);
      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = this.__v_isShallow ? newVal : toReactive(newVal);
        triggerRefValue(this);
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  function toRefs(object) {
    const ret = isArray$2(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = toRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this.__v_isRef = true;
    }
    get value() {
      const val = this._object[this._key];
      return val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      this._object[this._key] = newVal;
    }
  }
  function toRef(object, key, defaultValue) {
    const val = object[key];
    return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
  }
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      trackRefValue(self2);
      if (self2._dirty || !self2._cacheable) {
        self2._dirty = false;
        self2._value = self2.effect.run();
      }
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    return cRef;
  }
  Promise.resolve();
  function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = type;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  function logError(err, type, contextVNode, throwInDev = true) {
    {
      console.error(err);
    }
  }
  let isFlushing = false;
  let isFlushPending = false;
  const queue = [];
  let flushIndex = 0;
  const pendingPreFlushCbs = [];
  let activePreFlushCbs = null;
  let preFlushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = Promise.resolve();
  let currentFlushPromise = null;
  let currentPreFlushParentJob = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start2 = flushIndex + 1;
    let end = queue.length;
    while (start2 < end) {
      const middle = start2 + end >>> 1;
      const middleJobId = getId$4(queue[middle]);
      middleJobId < id ? start2 = middle + 1 : end = middle;
    }
    return start2;
  }
  function queueJob(job) {
    if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }
      queueFlush();
    }
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function invalidateJob(job) {
    const i = queue.indexOf(job);
    if (i > flushIndex) {
      queue.splice(i, 1);
    }
  }
  function queueCb(cb, activeQueue, pendingQueue, index2) {
    if (!isArray$2(cb)) {
      if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
        pendingQueue.push(cb);
      }
    } else {
      pendingQueue.push(...cb);
    }
    queueFlush();
  }
  function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
  }
  function queuePostFlushCb(cb) {
    queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
  }
  function flushPreFlushCbs(seen, parentJob = null) {
    if (pendingPreFlushCbs.length) {
      currentPreFlushParentJob = parentJob;
      activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
      pendingPreFlushCbs.length = 0;
      for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
        activePreFlushCbs[preFlushIndex]();
      }
      activePreFlushCbs = null;
      preFlushIndex = 0;
      currentPreFlushParentJob = null;
      flushPreFlushCbs(seen, parentJob);
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)];
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      activePostFlushCbs.sort((a, b) => getId$4(a) - getId$4(b));
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        activePostFlushCbs[postFlushIndex]();
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId$4 = (job) => job.id == null ? Infinity : job.id;
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    flushPreFlushCbs(seen);
    queue.sort((a, b) => getId$4(a) - getId$4(b));
    const check = NOOP;
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && job.active !== false) {
          if (false)
            ;
          callWithErrorHandling(job, null, 14);
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs();
      isFlushing = false;
      currentFlushPromise = null;
      if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function emit$1(instance, event, ...rawArgs) {
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modelArg = isModelListener2 && event.slice(7);
    if (modelArg && modelArg in props) {
      const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
      const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
      if (trim) {
        args = rawArgs.map((a) => a.trim());
      } else if (number) {
        args = rawArgs.map(toNumber$2);
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(handler, instance, 6, args);
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(onceHandler, instance, 6, args);
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      cache.set(comp, null);
      return null;
    }
    if (isArray$2(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    cache.set(comp, normalized);
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx)
      return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      const res = fn(...args);
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
    let result;
    let fallthroughAttrs;
    const prev = setCurrentRenderingInstance(instance);
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (false)
          ;
        result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
          get attrs() {
            markAttrsAccessed();
            return attrs;
          },
          slots,
          emit
        } : { attrs, slots, emit }) : render2(props, null));
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root2 = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys2 = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root2;
      if (keys2.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys2.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
          }
          root2 = cloneVNode(root2, fallthroughAttrs);
        }
      }
    }
    if (vnode.dirs) {
      root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      root2.transition = vnode.transition;
    }
    {
      result = root2;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent && parent.subTree === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray$2(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function provide(key, value) {
    if (!currentInstance)
      ;
    else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance) {
      const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
      } else
        ;
    }
  }
  const INITIAL_WATCHER_VALUE = {};
  function watch$1(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
    const instance = currentInstance;
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => source;
      deep = true;
    } else if (isArray$2(source)) {
      isMultiSource = true;
      forceTrigger = source.some(isReactive);
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return traverse(s);
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, 2);
        } else
          ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, instance, 2);
      } else {
        getter = () => {
          if (instance && instance.isUnmounted) {
            return;
          }
          if (cleanup) {
            cleanup();
          }
          return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
      cleanup = effect.onStop = () => {
        callWithErrorHandling(fn, instance, 4);
      };
    };
    if (isInSSRComponentSetup) {
      onCleanup = NOOP;
      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3, [
          getter(),
          isMultiSource ? [] : void 0,
          onCleanup
        ]);
      }
      return NOOP;
    }
    let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect.active) {
        return;
      }
      if (cb) {
        const newValue = effect.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
          if (cleanup) {
            cleanup();
          }
          callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else if (flush === "post") {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      scheduler = () => {
        if (!instance || instance.isMounted) {
          queuePreFlushCb(job);
        } else {
          job();
        }
      };
    }
    const effect = new ReactiveEffect(getter, scheduler);
    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect.run();
      }
    } else if (flush === "post") {
      queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
    } else {
      effect.run();
    }
    return () => {
      effect.stop();
      if (instance && instance.scope) {
        remove(instance.scope.effects, effect);
      }
    };
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const cur = currentInstance;
    setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    if (cur) {
      setCurrentInstance(cur);
    } else {
      unsetCurrentInstance();
    }
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  function traverse(value, seen) {
    if (!isObject$3(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray$2(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (isSet$2(value) || isMap$2(value)) {
      value.forEach((v) => {
        traverse(v, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }
  function defineComponent(options) {
    return isFunction(options) ? { setup: options, name: options.name } : options;
  }
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(type, hook, keepAliveRoot, true);
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        unsetCurrentInstance();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook("bu");
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook("bum");
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook("sp");
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc");
    }
    const {
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      expose,
      inheritAttrs,
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject$3(data))
        ;
      else {
        instance.data = reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c = computed({
          get: get2,
          set: set2
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher$1(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray$2(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray$2(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components)
      instance.components = components;
    if (directives)
      instance.directives = directives;
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
    if (isArray$2(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject$3(opt)) {
        if ("default" in opt) {
          injected = inject(opt.from || key, opt.default, true);
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        if (unwrapRef) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => injected.value,
            set: (v) => injected.value = v
          });
        } else {
          ctx[key] = injected;
        }
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(isArray$2(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
  }
  function createWatcher$1(raw, ctx, publicThis, key) {
    const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        watch$1(getter, handler);
      }
    } else if (isFunction(raw)) {
      watch$1(getter, raw.bind(publicThis));
    } else if (isObject$3(raw)) {
      if (isArray$2(raw)) {
        raw.forEach((r) => createWatcher$1(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch$1(getter, handler, raw);
        }
      }
    } else
      ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    cache.set(base, resolved);
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach((m) => mergeOptions(to, m, strats, true));
    }
    for (const key in from) {
      if (asMixin && key === "expose")
        ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeObjectOptions,
    emits: mergeObjectOptions,
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    watch: mergeWatchOptions,
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray$2(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
  }
  function mergeWatchOptions(to, from) {
    if (!to)
      return from;
    if (!from)
      return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = {};
    def(attrs, InternalObjectKey, 1);
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const { props, attrs, vnode: { patchFlag } } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance, "set", "$attrs");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(null, props);
            unsetCurrentInstance();
          }
        } else {
          value = defaultValue;
        }
      }
      if (opt[0]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[1] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys2] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys2)
          needCastKeys.push(...keys2);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      cache.set(comp, EMPTY_ARR);
      return EMPTY_ARR;
    }
    if (isArray$2(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray$2(opt) || isFunction(opt) ? { type: opt } : opt;
          if (prop) {
            const booleanIndex = getTypeIndex(Boolean, prop.type);
            const stringIndex = getTypeIndex(String, prop.type);
            prop[0] = booleanIndex > -1;
            prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
            if (booleanIndex > -1 || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    cache.set(comp, res);
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$") {
      return true;
    }
    return false;
  }
  function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ctor === null ? "null" : "";
  }
  function isSameType(a, b) {
    return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
    if (isArray$2(expectedTypes)) {
      return expectedTypes.findIndex((t) => isSameType(t, type));
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray$2(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    const normalized = withCtx((...args) => {
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key))
        continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        instance.slots = toRaw(children);
        def(children, "_", type);
      } else {
        normalizeObjectSlots(children, instance.slots = {});
      }
    } else {
      instance.slots = {};
      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }
    def(instance.slots, InternalObjectKey, 1);
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          extend(slots, children);
          if (!optimized && type === 1) {
            delete slots._;
          }
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
          delete slots[key];
        }
      }
    }
  };
  function withDirectives(vnode, directives) {
    const internalInstance = currentRenderingInstance;
    if (internalInstance === null) {
      return vnode;
    }
    const instance = internalInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name2) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name2];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (rootProps != null && !isObject$3(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new Set();
      let isMounted = false;
      const app = context.app = {
        _uid: uid++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version: version$2,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin))
            ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else
            ;
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app;
        },
        component(name2, component) {
          if (!component) {
            return context.components[name2];
          }
          context.components[name2] = component;
          return app;
        },
        directive(name2, directive) {
          if (!directive) {
            return context.directives[name2];
          }
          context.directives[name2] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, isSVG) {
          if (!isMounted) {
            const vnode = createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, isSVG);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            return getExposeProxy(vnode.component) || vnode.component.proxy;
          }
        },
        unmount() {
          if (isMounted) {
            render(null, app._container);
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app;
        }
      };
      return app;
    };
  }
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray$2(rawRef)) {
      rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$2(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref2 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref2) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref2)) {
      callWithErrorHandling(ref2, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref2);
      const _isRef = isRef(ref2);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? refs[ref2] : ref2.value;
            if (isUnmount) {
              isArray$2(existing) && remove(existing, refValue);
            } else {
              if (!isArray$2(existing)) {
                if (_isString) {
                  refs[ref2] = [refValue];
                } else {
                  ref2.value = [refValue];
                  if (rawRef.k)
                    refs[rawRef.k] = ref2.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref2] = value;
            if (hasOwn(setupState, ref2)) {
              setupState[ref2] = value;
            }
          } else if (isRef(ref2)) {
            ref2.value = value;
            if (rawRef.k)
              refs[rawRef.k] = value;
          } else
            ;
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      }
    }
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref2, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, isSVG);
          }
          break;
        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          break;
        default:
          if (shapeFlag & 1) {
            processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (shapeFlag & 6) {
            processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (shapeFlag & 64) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
          } else if (shapeFlag & 128) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
          } else
            ;
      }
      if (ref2 != null && parentComponent) {
        setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, isSVG) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      isSVG = isSVG || n2.type === "svg";
      if (n1 == null) {
        mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
      if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
        el = vnode.el = hostCloneNode(vnode.el);
      } else {
        el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
        if (shapeFlag & 8) {
          hostSetElementText(el, vnode.children);
        } else if (shapeFlag & 16) {
          mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        if (props) {
          for (const key in props) {
            if (key !== "value" && !isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
          if ("value" in props) {
            hostPatchProp(el, "value", null, props.value);
          }
          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        }
        setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree) {
          const parentVNode = parentComponent.vnode;
          setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start2 = 0) => {
      for (let i = start2; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      const areChildrenSVG = isSVG && n2.type !== "foreignObject";
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
      } else if (!optimized) {
        patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, isSVG);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
        patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
      }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
      if (oldProps !== newProps) {
        for (const key in newProps) {
          if (isReservedProp(key))
            continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
          if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
            traverseStaticChildren(n1, n2, true);
          }
        } else {
          patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
        } else {
          mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
        return;
      }
      setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          invalidateJob(instance.update);
          instance.update();
        }
      } else {
        n2.component = n1.component;
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              instance.subTree = renderComponentRoot(instance);
              hydrateNode(el, instance.subTree, instance, parentSuspense, null);
            };
            if (isAsyncWrapperVNode) {
              initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
            } else {
              hydrateSubTree();
            }
          } else {
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
          }
          if (initialVNode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
          }
        }
      };
      const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope);
      const update = instance.update = effect.run.bind(effect);
      update.id = instance.uid;
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(void 0, instance.update);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
      if (oldLength > newLength) {
        unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
      } else {
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
          newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove3 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove3();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove3, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
      if (ref2 != null) {
        setRef(ref2, null, parentSuspense, vnode, true);
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
        } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        removeFragment(el, anchor);
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const { bum, scope, update, subTree, um } = instance;
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (update) {
        update.active = false;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
      for (let i = start2; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      return hostNextSibling(vnode.anchor || vnode.el);
    };
    const render = (vnode, container, isSVG) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container, null, null, null, isSVG);
      }
      flushPostFlushCbs();
      container._vnode = vnode;
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate, hydrateNode] = createHydrationFns(internals);
    }
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  function toggleRecurse({ effect, update }, allowed) {
    effect.allowRecurse = update.allowRecurse = allowed;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray$2(ch1) && isArray$2(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow)
            traverseStaticChildren(c1, c2);
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  const isTeleport = (type) => type.__isTeleport;
  const COMPONENTS = "components";
  function resolveComponent(name2, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name2, true, maybeSelfReference) || name2;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol();
  function resolveDynamicComponent(component) {
    if (isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  function resolveAsset(type, name2, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      if (type === COMPONENTS) {
        const selfName = getComponentName(Component);
        if (selfName && (selfName === name2 || selfName === camelize(name2) || selfName === capitalize(camelize(name2)))) {
          return Component;
        }
      }
      const res = resolve(instance[type] || Component[type], name2) || resolve(instance.appContext[type], name2);
      if (!res && maybeSelfReference) {
        return Component;
      }
      return res;
    }
  }
  function resolve(registry, name2) {
    return registry && (registry[name2] || registry[camelize(name2)] || registry[capitalize(camelize(name2))]);
  }
  const Fragment = Symbol(void 0);
  const Text = Symbol(void 0);
  const Comment = Symbol(void 0);
  const Static = Symbol(void 0);
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value) {
    isBlockTreeEnabled += value;
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
    return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(type, props, true);
      if (children) {
        normalizeChildren(cloned, children);
      }
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject$3(style)) {
        if (isProxy(style) && !isArray$2(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$3(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
  }
  function guardReactiveProps(props) {
    if (!props)
      return null;
    return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false) {
    const { props, ref: ref2, patchFlag, children } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray$2(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition: vnode.transition,
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor
    };
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray$2(child)) {
      return createVNode(Fragment, null, child.slice());
    } else if (typeof child === "object") {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray$2(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray$2(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  function renderList(source, renderItem, cache, index2) {
    let ret;
    const cached = cache && cache[index2];
    if (isArray$2(source) || isString(source)) {
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
      }
    } else if (isObject$3(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
      } else {
        const keys2 = Object.keys(source);
        ret = new Array(keys2.length);
        for (let i = 0, l = keys2.length; i < l; i++) {
          const key = keys2[i];
          ret[i] = renderItem(source[key], key, i, cached && cached[i]);
        }
      }
    } else {
      ret = [];
    }
    if (cache) {
      cache[index2] = ret;
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i)
      return null;
    if (isStatefulComponent(i))
      return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => () => queueJob(i.update),
    $nextTick: (i) => nextTick.bind(i.proxy),
    $watch: (i) => instanceWatch.bind(i)
  });
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
        {
          return globalProperties[key];
        }
      } else
        ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        this.set(target, key, descriptor.get(), null);
      } else if (descriptor.value != null) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  const emptyAppContext = createAppContext();
  let uid$1 = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid$1++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new EffectScope(true),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      emit: null,
      emitted: null,
      propsDefaults: EMPTY_OBJ,
      inheritAttrs: type.inheritAttrs,
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit$1.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const setCurrentInstance = (instance) => {
    currentInstance = instance;
    instance.scope.on();
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    currentInstance = null;
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
    isInSSRComponentSetup = isSSR;
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isInSSRComponentSetup = false;
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
    const { setup } = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      setCurrentInstance(instance);
      pauseTracking();
      const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
      resetTracking();
      unsetCurrentInstance();
      if (isPromise(setupResult)) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject$3(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    } else
      ;
    finishComponentSetup(instance, isSSR);
  }
  let compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile && !Component.render) {
        const template = Component.template;
        if (template) {
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(extend({
            isCustomElement,
            delimiters
          }, compilerOptions), componentCompilerOptions);
          Component.render = compile(template, finalCompilerOptions);
        }
      }
      instance.render = Component.render || NOOP;
    }
    {
      setCurrentInstance(instance);
      pauseTracking();
      applyOptions(instance);
      resetTracking();
      unsetCurrentInstance();
    }
  }
  function createAttrsProxy(instance) {
    return new Proxy(instance.attrs, {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    });
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    let attrs;
    {
      return {
        get attrs() {
          return attrs || (attrs = createAttrsProxy(instance));
        },
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        }
      }));
    }
  }
  function getComponentName(Component) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  };
  const version$2 = "3.2.31";
  const svgNS = "http://www.w3.org/2000/svg";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, isSVG, is, props) => {
      const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    cloneNode(el) {
      const cloned = el.cloneNode(true);
      if (`_value` in el) {
        cloned._value = el._value;
      }
      return cloned;
    },
    insertStaticContent(content, parent, anchor, isSVG, start2, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start2 && (start2 === end || start2.nextSibling)) {
        while (true) {
          parent.insertBefore(start2.cloneNode(true), anchor);
          if (start2 === end || !(start2 = start2.nextSibling))
            break;
        }
      } else {
        templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
        const template = templateContainer.content;
        if (isSVG) {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        before ? before.nextSibling : parent.firstChild,
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  function patchClass(el, value, isSVG) {
    const transitionClasses = el._vtc;
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    if (next && !isCssString) {
      for (const key in next) {
        setStyle(style, key, next[key]);
      }
      if (prev && !isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    } else {
      const currentDisplay = style.display;
      if (isCssString) {
        if (prev !== next) {
          style.cssText = next;
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
      if ("_vod" in el) {
        style.display = currentDisplay;
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name2, val) {
    if (isArray$2(val)) {
      val.forEach((v) => setStyle(style, name2, v));
    } else {
      if (name2.startsWith("--")) {
        style.setProperty(name2, val);
      } else {
        const prefixed = autoPrefix(style, name2);
        if (importantRE.test(val)) {
          style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name2 = camelize(rawName);
    if (name2 !== "filter" && name2 in style) {
      return prefixCache[rawName] = name2;
    }
    name2 = capitalize(name2);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name2;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      const isBoolean = isSpecialBooleanAttr(key);
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean ? "" : value);
      }
    }
  }
  function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === "innerHTML" || key === "textContent") {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }
      el[key] = value == null ? "" : value;
      return;
    }
    if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
      el._value = value;
      const newValue = value == null ? "" : value;
      if (el.value !== newValue || el.tagName === "OPTION") {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      return;
    }
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        el[key] = includeBooleanAttr(value);
        return;
      } else if (value == null && type === "string") {
        el[key] = "";
        el.removeAttribute(key);
        return;
      } else if (type === "number") {
        try {
          el[key] = 0;
        } catch (_a) {
        }
        el.removeAttribute(key);
        return;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
  }
  let _getNow = Date.now;
  let skipTimestampCheck = false;
  if (typeof window !== "undefined") {
    if (_getNow() > document.createEvent("Event").timeStamp) {
      _getNow = () => performance.now();
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  let cachedNow = 0;
  const p = Promise.resolve();
  const reset = () => {
    cachedNow = 0;
  };
  const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name2, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(nextValue, instance);
        addEventListener(el, name2, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name2, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name2) {
    let options;
    if (optionsModifierRE.test(name2)) {
      options = {};
      let m;
      while (m = name2.match(optionsModifierRE)) {
        name2 = name2.slice(0, name2.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    return [hyphenate(name2.slice(2)), options];
  }
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      const timeStamp = e.timeStamp || _getNow();
      if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
        callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
      }
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray$2(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
    } else {
      return value;
    }
  }
  const nativeOnRE = /^on[a-z]/;
  const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && nativeOnRE.test(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (nativeOnRE.test(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const vShow = {
    beforeMount(el, { value }, { transition }) {
      el._vod = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue)
        return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el._vod : "none";
  }
  const rendererOptions = extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container, false, container instanceof SVGElement);
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  };
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  var root$4 = _root;
  var now$1 = function() {
    return root$4.Date.now();
  };
  var now_1 = now$1;
  var reWhitespace = /\s/;
  function trimmedEndIndex$1(string) {
    var index2 = string.length;
    while (index2-- && reWhitespace.test(string.charAt(index2))) {
    }
    return index2;
  }
  var _trimmedEndIndex = trimmedEndIndex$1;
  var trimmedEndIndex = _trimmedEndIndex;
  var reTrimStart = /^\s+/;
  function baseTrim$1(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  var _baseTrim = baseTrim$1;
  var baseGetTag$1 = _baseGetTag, isObjectLike$2 = isObjectLike_1;
  var symbolTag$2 = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike$2(value) && baseGetTag$1(value) == symbolTag$2;
  }
  var isSymbol_1 = isSymbol$1;
  var baseTrim = _baseTrim, isObject$2 = isObject_1, isSymbol = isSymbol_1;
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber$1(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject$2(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$2(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_1 = toNumber$1;
  var isObject$1 = isObject_1, now = now_1, toNumber = toNumber_1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject$1(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_1 = debounce;
  function arrayEach$1(array, iteratee) {
    var index2 = -1, length = array == null ? 0 : array.length;
    while (++index2 < length) {
      if (iteratee(array[index2], index2, array) === false) {
        break;
      }
    }
    return array;
  }
  var _arrayEach = arrayEach$1;
  var overArg = _overArg;
  var nativeKeys$1 = overArg(Object.keys, Object);
  var _nativeKeys = nativeKeys$1;
  var isPrototype = _isPrototype, nativeKeys = _nativeKeys;
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  function baseKeys$1(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$1.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  var _baseKeys = baseKeys$1;
  var arrayLikeKeys = _arrayLikeKeys, baseKeys = _baseKeys, isArrayLike = isArrayLike_1;
  function keys$3(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  var keys_1 = keys$3;
  var copyObject$3 = _copyObject, keys$2 = keys_1;
  function baseAssign$1(object, source) {
    return object && copyObject$3(source, keys$2(source), object);
  }
  var _baseAssign = baseAssign$1;
  var copyObject$2 = _copyObject, keysIn$2 = keysIn_1;
  function baseAssignIn$1(object, source) {
    return object && copyObject$2(source, keysIn$2(source), object);
  }
  var _baseAssignIn = baseAssignIn$1;
  function arrayFilter$1(array, predicate) {
    var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index2 < length) {
      var value = array[index2];
      if (predicate(value, index2, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  var _arrayFilter = arrayFilter$1;
  function stubArray$2() {
    return [];
  }
  var stubArray_1 = stubArray$2;
  var arrayFilter = _arrayFilter, stubArray$1 = stubArray_1;
  var objectProto$1 = Object.prototype;
  var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
  var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var _getSymbols = getSymbols$3;
  var copyObject$1 = _copyObject, getSymbols$2 = _getSymbols;
  function copySymbols$1(source, object) {
    return copyObject$1(source, getSymbols$2(source), object);
  }
  var _copySymbols = copySymbols$1;
  function arrayPush$2(array, values) {
    var index2 = -1, length = values.length, offset = array.length;
    while (++index2 < length) {
      array[offset + index2] = values[index2];
    }
    return array;
  }
  var _arrayPush = arrayPush$2;
  var arrayPush$1 = _arrayPush, getPrototype = _getPrototype, getSymbols$1 = _getSymbols, stubArray = stubArray_1;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object) {
    var result = [];
    while (object) {
      arrayPush$1(result, getSymbols$1(object));
      object = getPrototype(object);
    }
    return result;
  };
  var _getSymbolsIn = getSymbolsIn$2;
  var copyObject = _copyObject, getSymbolsIn$1 = _getSymbolsIn;
  function copySymbolsIn$1(source, object) {
    return copyObject(source, getSymbolsIn$1(source), object);
  }
  var _copySymbolsIn = copySymbolsIn$1;
  var arrayPush = _arrayPush, isArray$1 = isArray_1;
  function baseGetAllKeys$2(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  var _baseGetAllKeys = baseGetAllKeys$2;
  var baseGetAllKeys$1 = _baseGetAllKeys, getSymbols = _getSymbols, keys$1 = keys_1;
  function getAllKeys$1(object) {
    return baseGetAllKeys$1(object, keys$1, getSymbols);
  }
  var _getAllKeys = getAllKeys$1;
  var baseGetAllKeys = _baseGetAllKeys, getSymbolsIn = _getSymbolsIn, keysIn$1 = keysIn_1;
  function getAllKeysIn$1(object) {
    return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
  }
  var _getAllKeysIn = getAllKeysIn$1;
  var getNative$3 = _getNative, root$3 = _root;
  var DataView$2 = getNative$3(root$3, "DataView");
  var _DataView = DataView$2;
  var getNative$2 = _getNative, root$2 = _root;
  var Promise$2 = getNative$2(root$2, "Promise");
  var _Promise = Promise$2;
  var getNative$1 = _getNative, root$1 = _root;
  var Set$2 = getNative$1(root$1, "Set");
  var _Set = Set$2;
  var getNative = _getNative, root = _root;
  var WeakMap$2 = getNative(root, "WeakMap");
  var _WeakMap = WeakMap$2;
  var DataView$1 = _DataView, Map$1 = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap$1 = _WeakMap, baseGetTag = _baseGetTag, toSource = _toSource;
  var mapTag$3 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$3 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
  var dataViewTag$2 = "[object DataView]";
  var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
  var getTag$3 = baseGetTag;
  if (DataView$1 && getTag$3(new DataView$1(new ArrayBuffer(1))) != dataViewTag$2 || Map$1 && getTag$3(new Map$1()) != mapTag$3 || Promise$1 && getTag$3(Promise$1.resolve()) != promiseTag || Set$1 && getTag$3(new Set$1()) != setTag$3 || WeakMap$1 && getTag$3(new WeakMap$1()) != weakMapTag$1) {
    getTag$3 = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$2;
          case mapCtorString:
            return mapTag$3;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$3;
          case weakMapCtorString:
            return weakMapTag$1;
        }
      }
      return result;
    };
  }
  var _getTag = getTag$3;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function initCloneArray$1(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  var _initCloneArray = initCloneArray$1;
  var cloneArrayBuffer$1 = _cloneArrayBuffer;
  function cloneDataView$1(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer$1(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  var _cloneDataView = cloneDataView$1;
  var reFlags = /\w*$/;
  function cloneRegExp$1(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  var _cloneRegExp = cloneRegExp$1;
  var Symbol$1 = _Symbol;
  var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function cloneSymbol$1(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  var _cloneSymbol = cloneSymbol$1;
  var cloneArrayBuffer = _cloneArrayBuffer, cloneDataView = _cloneDataView, cloneRegExp = _cloneRegExp, cloneSymbol = _cloneSymbol, cloneTypedArray = _cloneTypedArray;
  var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
  function initCloneByTag$1(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag$1:
        return cloneArrayBuffer(object);
      case boolTag$1:
      case dateTag$1:
        return new Ctor(+object);
      case dataViewTag$1:
        return cloneDataView(object, isDeep);
      case float32Tag$1:
      case float64Tag$1:
      case int8Tag$1:
      case int16Tag$1:
      case int32Tag$1:
      case uint8Tag$1:
      case uint8ClampedTag$1:
      case uint16Tag$1:
      case uint32Tag$1:
        return cloneTypedArray(object, isDeep);
      case mapTag$2:
        return new Ctor();
      case numberTag$1:
      case stringTag$1:
        return new Ctor(object);
      case regexpTag$1:
        return cloneRegExp(object);
      case setTag$2:
        return new Ctor();
      case symbolTag$1:
        return cloneSymbol(object);
    }
  }
  var _initCloneByTag = initCloneByTag$1;
  var getTag$2 = _getTag, isObjectLike$1 = isObjectLike_1;
  var mapTag$1 = "[object Map]";
  function baseIsMap$1(value) {
    return isObjectLike$1(value) && getTag$2(value) == mapTag$1;
  }
  var _baseIsMap = baseIsMap$1;
  var baseIsMap = _baseIsMap, baseUnary$1 = _baseUnary, nodeUtil$1 = _nodeUtil.exports;
  var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;
  var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;
  var isMap_1 = isMap$1;
  var getTag$1 = _getTag, isObjectLike = isObjectLike_1;
  var setTag$1 = "[object Set]";
  function baseIsSet$1(value) {
    return isObjectLike(value) && getTag$1(value) == setTag$1;
  }
  var _baseIsSet = baseIsSet$1;
  var baseIsSet = _baseIsSet, baseUnary = _baseUnary, nodeUtil = _nodeUtil.exports;
  var nodeIsSet = nodeUtil && nodeUtil.isSet;
  var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
  var isSet_1 = isSet$1;
  var Stack = _Stack, arrayEach = _arrayEach, assignValue = _assignValue, baseAssign = _baseAssign, baseAssignIn = _baseAssignIn, cloneBuffer = _cloneBuffer.exports, copyArray = _copyArray, copySymbols = _copySymbols, copySymbolsIn = _copySymbolsIn, getAllKeys = _getAllKeys, getAllKeysIn = _getAllKeysIn, getTag = _getTag, initCloneArray = _initCloneArray, initCloneByTag = _initCloneByTag, initCloneObject = _initCloneObject, isArray = isArray_1, isBuffer$1 = isBuffer$4.exports, isMap = isMap_1, isObject = isObject_1, isSet = isSet_1, keys = keys_1, keysIn = keysIn_1;
  var CLONE_DEEP_FLAG$1 = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG$1 = 4;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  function baseClone$1(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG$1, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer$1(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone$1(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone$1(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone$1(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }
  var _baseClone = baseClone$1;
  var baseClone = _baseClone;
  var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
  function cloneDeep(value) {
    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
  }
  var cloneDeep_1 = cloneDeep;
  function createReactive(key, target, updateListener) {
    if (typeof GM_setValue === "function" && typeof GM_getValue === "function" && typeof GM_addValueChangeListener === "function" && typeof GM_removeValueChangeListener === "function") {
      let watcher = createWatcher(key, target);
      GM_addValueChangeListener(key, (name2, oldValue, newValue, remote) => {
        if (remote === true) {
          watcher == null ? void 0 : watcher();
          deepChange(target, newValue);
          updateListener == null ? void 0 : updateListener(oldValue, target);
          watcher = createWatcher(key, target);
        }
      });
    } else {
      throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u6CB9\u7334\u8DE8\u57DF\u901A\u4FE1");
    }
  }
  function createWatcher(key, target) {
    const cache = [];
    return watch$1(() => cloneDeep_1(target), debounce_1((_new) => {
      GM_setValue(key, JSON.parse(JSON.stringify(_new, function(key2, value) {
        if (typeof value === "object" && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      })));
    }, 100), { deep: true });
  }
  function deepChange(origin, target) {
    if (target) {
      for (const key in origin) {
        if (Object.prototype.hasOwnProperty.call(origin, key)) {
          if (typeof origin[key] === "object" && !Array.isArray(origin[key])) {
            deepChange(origin[key], target[key]);
          } else {
            origin[key] = target[key];
          }
        }
      }
    }
  }
  function domSearch(wrapper, root2 = window.document) {
    const obj = /* @__PURE__ */ Object.create({});
    Reflect.ownKeys(wrapper).forEach((key) => {
      Reflect.set(obj, key, root2.querySelector(wrapper[key.toString()]));
    });
    return obj;
  }
  function domSearchAll(wrapper, root2 = window.document) {
    const obj = /* @__PURE__ */ Object.create({});
    Reflect.ownKeys(wrapper).forEach((key) => {
      Reflect.set(obj, key, Array.from(root2.querySelectorAll(wrapper[key.toString()])));
    });
    return obj;
  }
  function dragElement(draggable, container, onMove) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    const draggableEl = draggable;
    const containerEl = container;
    if (draggableEl) {
      draggableEl.onmousedown = dragMouseDown;
    } else {
      containerEl.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      containerEl.style.top = containerEl.offsetTop - pos2 + "px";
      containerEl.style.left = containerEl.offsetLeft - pos1 + "px";
      onMove(containerEl.offsetLeft - pos1, containerEl.offsetTop - pos2);
      containerEl.style.bottom = "unset";
    }
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  function searchIFrame(root2) {
    var _a, _b;
    let list = Array.from(root2.querySelectorAll("iframe"));
    const result = [];
    while (list.length) {
      const frame = list.shift();
      try {
        if (frame && ((_a = frame == null ? void 0 : frame.contentWindow) == null ? void 0 : _a.document)) {
          result.push(frame);
          const frames = (_b = frame == null ? void 0 : frame.contentWindow) == null ? void 0 : _b.document.querySelectorAll("iframe");
          list = list.concat(Array.from(frames || []));
        }
      } catch (e) {
        console.log(e.message);
        console.log({ frame });
      }
    }
    return result;
  }
  function onComplete(callback, root2 = document) {
    function checkReady() {
      if (root2.readyState === "complete") {
        callback();
        root2.removeEventListener("readystatechange", checkReady);
      }
    }
    checkReady();
    root2.addEventListener("readystatechange", checkReady);
  }
  function onInteractive(callback, root2 = document) {
    function checkLoaded() {
      if (root2.readyState === "interactive") {
        root2.removeEventListener("readystatechange", checkLoaded);
        callback();
      }
    }
    checkLoaded();
    root2.addEventListener("readystatechange", checkLoaded);
  }
  var src$1 = {
    compareTwoStrings,
    findBestMatch
  };
  function compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, "");
    second = second.replace(/\s+/g, "");
    if (first === second)
      return 1;
    if (first.length < 2 || second.length < 2)
      return 0;
    let firstBigrams = /* @__PURE__ */ new Map();
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
      firstBigrams.set(bigram, count);
    }
    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
      if (count > 0) {
        firstBigrams.set(bigram, count - 1);
        intersectionSize++;
      }
    }
    return 2 * intersectionSize / (first.length + second.length - 2);
  }
  function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings))
      throw new Error("Bad arguments: First argument should be a string, second should be an array of strings");
    const ratings = [];
    let bestMatchIndex = 0;
    for (let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = compareTwoStrings(mainString, currentTargetString);
      ratings.push({ target: currentTargetString, rating: currentRating });
      if (currentRating > ratings[bestMatchIndex].rating) {
        bestMatchIndex = i;
      }
    }
    const bestMatch = ratings[bestMatchIndex];
    return { ratings, bestMatch, bestMatchIndex };
  }
  function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== "string")
      return false;
    if (!Array.isArray(targetStrings))
      return false;
    if (!targetStrings.length)
      return false;
    if (targetStrings.find(function(s) {
      return typeof s !== "string";
    }))
      return false;
    return true;
  }
  function clearString(str, ...exclude) {
    return str.trim().toLocaleLowerCase().replace(RegExp(`[^\\u4e00-\\u9fa5A-Za-z0-9${exclude.join("")}]*`, "g"), "");
  }
  function answerSimilar(answers, options) {
    answers = answers.map(removeRedundant);
    options = options.map(removeRedundant);
    const similar = answers.length !== 0 ? options.map((option) => src$1.findBestMatch(option, answers).bestMatch) : options.map((opt) => ({ rating: 0, target: "" }));
    return similar;
  }
  function removeRedundant(str) {
    return (str == null ? void 0 : str.trim().replace(/[A-Z]{1}[^A-Za-z0-9\u4e00-\u9fa5]+([A-Za-z0-9\u4e00-\u9fa5]+)/, "$1")) || "";
  }
  function request(url, opts) {
    return new Promise((resolve2, reject) => {
      try {
        const { contentType = "json", method = "get", type = "fetch", data = {}, headers = {} } = opts || {};
        const env = isInBrowser() ? "browser" : "node";
        if (type === "GM_xmlhttpRequest" && env === "browser") {
          if (typeof GM_xmlhttpRequest !== "undefined") {
            GM_xmlhttpRequest({
              url,
              method: method === "get" ? "GET" : "POST",
              data: new URLSearchParams(data).toString(),
              headers,
              responseType: "json",
              onload: (response) => {
                if (response.status === 200) {
                  if (contentType === "json") {
                    try {
                      resolve2(JSON.parse(response.responseText));
                    } catch (error) {
                      reject(error);
                    }
                  } else {
                    resolve2(response.responseText);
                  }
                } else {
                  reject(response.responseText);
                }
              },
              onerror: reject
            });
          } else {
            reject(new Error("GM_xmlhttpRequest is not defined"));
          }
        } else {
          const fet = env === "node" ? require("node-fetch").default : fetch;
          fet(url, { contentType, body: method === "post" ? data : void 0, method, headers }).then((response) => {
            if (contentType === "json") {
              response.json().then(resolve2).catch(reject);
            } else {
              response.text().then(resolve2).catch(reject);
            }
          }).catch((error) => {
            reject(new Error(error));
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  async function sleep(period) {
    return new Promise((resolve2) => {
      setTimeout(resolve2, period);
    });
  }
  function urlGlob(pattern, input = window.location.href) {
    const re = new RegExp(pattern.replace(/([.?+^$[\]\\(){}|/-])/g, "\\$1").replace(/\*/g, ".*"));
    return re.test(input);
  }
  function urlMatch(target, input = window.location.href) {
    const targetURL = Array.isArray(target) ? target : [target];
    return targetURL.some((target2) => typeof target2 === "string" ? urlGlob(target2) : target2.test(input));
  }
  function getCurrentRoutes(scripts2) {
    const routes = [];
    for (const script of scripts2) {
      for (const route of script.routes || []) {
        if (urlMatch(route.url)) {
          routes.push(route);
        }
      }
    }
    return routes;
  }
  function getCurrentPanels(scripts2) {
    let panels = [];
    for (const script of scripts2) {
      for (const panel of script.panels || []) {
        if (urlMatch(panel.url)) {
          panels.push(panel);
          if (panel.children) {
            panels = panels.concat(panel.children);
          }
        }
      }
    }
    return panels;
  }
  function addFunctionEventListener(obj, type) {
    const origin = obj[type];
    return function(...args) {
      const res = origin.apply(this, args);
      const e = new Event(type.toString());
      e.arguments = args;
      window.dispatchEvent(e);
      return res;
    };
  }
  function getNumber(...nums) {
    return nums.map((num) => typeof num === "number" ? num : void 0).find((num) => num !== void 0);
  }
  function isInBrowser() {
    return typeof window !== "undefined" && typeof window.document !== "undefined";
  }
  function waitForRecognize(type) {
    return new Promise((resolve2) => {
      const timer = setInterval(() => {
        const isRecognizing = type === "cx" ? useContext().cx.isRecognizing : useContext().zhs.isRecognizing;
        if (isRecognizing === false) {
          clearInterval(timer);
          resolve2();
        }
      }, 100);
    });
  }
  function useUnsafeWindow() {
    return typeof unsafeWindow !== "undefined" ? unsafeWindow : void 0;
  }
  async function getRemoteSetting(port) {
    for (let count = 3; count > 0; count--) {
      try {
        return await request(`http://localhost:${port}/setting`, {
          type: "GM_xmlhttpRequest",
          method: "get",
          contentType: "json"
        });
      } catch (err) {
        console.log("\u83B7\u53D6\u672C\u5730\u9898\u5E93\u914D\u7F6E\u5931\u8D25\uFF0C\u7B49\u5F85\u4E0B\u4E00\u6B21\u91CD\u8BD5\u3002", err);
      }
      await sleep(60 * 1e3);
    }
  }
  function elementToRawObject(el) {
    return {
      innerText: el.innerText,
      innerHTML: el.innerHTML,
      textContent: el.textContent
    };
  }
  var index = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    domSearch,
    domSearchAll,
    dragElement,
    searchIFrame,
    onComplete,
    onInteractive,
    clearString,
    answerSimilar,
    removeRedundant,
    sleep,
    urlGlob,
    urlMatch,
    getCurrentRoutes,
    getCurrentPanels,
    addFunctionEventListener,
    getNumber,
    isInBrowser,
    waitForRecognize,
    useUnsafeWindow,
    getRemoteSetting,
    elementToRawObject,
    request
  });
  const defaultWorkSetting = {
    period: 3,
    timeout: 30,
    retry: 1,
    stopWhenError: false,
    upload: "save",
    waitForCheck: 5
  };
  const defaultOCSSetting = {
    zhs: {
      video: {
        watchTime: 0,
        interval: void 0,
        closeDate: new Date(0),
        playbackRate: 1,
        showProgress: true,
        restudy: false,
        volume: 0,
        creditStudy: false
      },
      work: defaultWorkSetting,
      exam: defaultWorkSetting
    },
    cx: {
      common: {
        recognize: "map"
      },
      study: {
        playbackRate: 1,
        showProgress: true,
        restudy: false,
        volume: 0,
        upload: "close",
        playlines: ["\u9ED8\u8BA4\u8DEF\u7EBF", "\u516C\u7F511", "\u516C\u7F512"],
        line: "\u9ED8\u8BA4\u8DEF\u7EBF",
        forceWork: false,
        randomWork: {
          enable: false,
          choice: false,
          complete: false,
          completeTexts: ["\u4E0D\u4F1A", "\u4E0D\u77E5\u9053", "\u4E0D\u6E05\u695A", "\u4E0D\u61C2", "\u4E0D\u4F1A\u5199"]
        }
      },
      video: void 0,
      live: {
        playbackRate: 1,
        showProgress: true,
        volume: 1
      },
      work: defaultWorkSetting,
      exam: defaultWorkSetting
    },
    icve: {
      common: {
        type: void 0
      },
      study: {
        playbackRate: 1,
        volume: 0,
        showProgress: true,
        pptRate: 1,
        isReading: false,
        currentTask: void 0,
        cells: []
      }
    },
    common: {
      answererWrappers: []
    },
    answererWrappers: []
  };
  let store;
  if (isInBrowser() && useUnsafeWindow()) {
    store = reactive(createStore());
    if (top === self) {
      GM_setValue("store", JSON.parse(JSON.stringify(store.localStorage)));
    }
    createReactive("store", store.localStorage, (oldValue, newValue) => {
    });
  } else {
    store = {};
  }
  function getStore() {
    return store;
  }
  function createStore() {
    const localStore = defaultsDeep_1(GM_getValue("store", {}), {
      setting: defaultOCSSetting,
      logs: [],
      alerts: [],
      workResults: [],
      hide: false,
      position: {
        x: 0,
        y: 0
      }
    });
    return {
      localStorage: localStore,
      VERSION: "3.17.16",
      setting: localStore.setting,
      context: {
        common: {
          startOptions: {},
          currentMedia: null
        },
        cx: {
          videojs: null,
          isRecognizing: false,
          fontMap: {}
        },
        zhs: {
          isRecognizing: false
        }
      }
    };
  }
  function useStore(name2) {
    return store[name2];
  }
  function useContext() {
    return store.context;
  }
  function useSettings() {
    if (store.setting.answererWrappers.length && store.setting.common.answererWrappers.length === 0) {
      store.setting.common.answererWrappers = store.setting.answererWrappers;
      store.setting.answererWrappers = [];
    }
    if (store.setting.cx.video && store.setting.cx.study === void 0) {
      store.setting.cx.study = store.setting.cx.video;
      store.setting.cx.video = void 0;
    }
    return store.setting;
  }
  function message(type, text) {
    const local = useStore("localStorage");
    if (local.alerts.length > 3) {
      local.alerts.shift();
    }
    local.alerts.push({ type, text, key: local.alerts.length });
  }
  const Tooltip = defineComponent({
    props: {
      title: {
        default: "",
        type: String
      },
      type: {
        default: "dark",
        type: String
      },
      tooltipStyle: {
        default: () => {
        },
        type: Object
      },
      containerStyle: {
        default: () => {
        },
        type: Object
      }
    },
    setup(props, {
      slots
    }) {
      const {
        title,
        type,
        tooltipStyle,
        containerStyle
      } = toRefs(props);
      const show = ref(false);
      return () => {
        var _a, _b;
        return createVNode("div", {
          "style": __spreadValues({
            width: "100%"
          }, containerStyle.value)
        }, [createVNode("div", {
          "style": __spreadValues({
            display: show.value ? "block" : "none"
          }, tooltipStyle.value),
          "class": "tooltip " + type.value
        }, [slots.title ? slots.title() : createVNode("span", {
          "innerHTML": (_a = title.value) == null ? void 0 : _a.replace(/\n/g, "<br/>")
        }, null)]), createVNode("div", {
          "onMouseenter": () => show.value = true,
          "onMouseleave": () => show.value = false
        }, [(_b = slots.default) == null ? void 0 : _b.call(slots)])]);
      };
    }
  });
  class StringUtils {
    constructor(_text) {
      this._text = _text;
    }
    static nowrap(str) {
      return (str == null ? void 0 : str.replace(/\n/g, "")) || "";
    }
    nowrap() {
      this._text = StringUtils.nowrap(this._text);
      return this;
    }
    static noSpecialChar(str) {
      return (str == null ? void 0 : str.replace(/[^\w\s]/gi, "")) || "";
    }
    noSpecialChar() {
      this._text = StringUtils.noSpecialChar(this._text);
      return this;
    }
    static max(str, len) {
      return str.length > len ? str.substring(0, len) + "..." : str;
    }
    max(len) {
      this._text = StringUtils.max(this._text, len);
      return this;
    }
    static hide(str, start2, end, replacer2 = "*") {
      return str.substring(0, start2) + str.substring(start2, end).replace(/./g, replacer2) + str.substring(end);
    }
    hide(start2, end, replacer2 = "*") {
      this._text = StringUtils.hide(this._text, start2, end, replacer2);
      return this;
    }
    static of(text) {
      return new StringUtils(text);
    }
    toString() {
      return this._text;
    }
  }
  const SearchResults = defineComponent({
    setup() {
      const local = useStore("localStorage");
      const hasResult = computed(() => local.workResults.length > 0);
      const currentResult = ref(void 0);
      const currentSearchResults = computed(() => {
        var _a, _b;
        return (_b = (_a = currentResult.value) == null ? void 0 : _a.ctx) == null ? void 0 : _b.searchResults;
      });
      const currentTitle = computed(() => {
        var _a, _b, _c;
        return StringUtils.of(((_c = (_b = (_a = currentResult.value) == null ? void 0 : _a.ctx) == null ? void 0 : _b.elements.title) == null ? void 0 : _c[0].textContent) || "").nowrap().toString();
      });
      onMounted(() => {
        document.addEventListener("click", () => {
          currentResult.value = void 0;
        });
      });
      return () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return createVNode("div", {
          "id": "search-results"
        }, [hasResult.value ? createVNode("div", null, [currentResult.value ? createVNode("div", {
          "class": "search-result-modal",
          "onClick": (e) => e.stopPropagation()
        }, [createVNode("div", {
          "class": "search-result-header"
        }, [createVNode("span", {
          "style": {
            float: "right",
            cursor: "pointer"
          },
          "onClick": () => currentResult.value = void 0
        }, [createTextVNode("\u274C")]), createVNode("span", {
          "innerHTML": currentTitle.value.replace(/https?:\/\/.*?\.(png|jpg|jpeg|gif)/g, (match) => `<img src="${match}" />`)
        }, null)]), createVNode("hr", null, null), createVNode("div", {
          "class": "search-results-error",
          "style": {
            color: "red",
            padding: "0px 0px 0px 8px"
          }
        }, [createVNode("span", null, [((_a = currentResult.value) == null ? void 0 : _a.error) ? (_b = currentResult.value) == null ? void 0 : _b.error.message : ((_d = (_c = currentResult.value) == null ? void 0 : _c.result) == null ? void 0 : _d.finish) === false ? "\u672A\u5B8C\u6210, \u53EF\u80FD\u662F\u6CA1\u6709\u5339\u914D\u7684\u9009\u9879" : ((_g = (_f = (_e = currentResult.value) == null ? void 0 : _e.ctx) == null ? void 0 : _f.searchResults) == null ? void 0 : _g.length) === 0 ? "\u672A\u641C\u7D22\u5230\u7B54\u6848" : ""])]), createVNode("div", {
          "class": "search-results-containers"
        }, [(_h = currentSearchResults.value) == null ? void 0 : _h.map((res) => createVNode("div", {
          "class": "search-results-container"
        }, [createVNode("span", {
          "class": "search-results-title"
        }, [createVNode("span", null, [createTextVNode("\u9898\u5E93:")]), createVNode("a", {
          "href": res.homepage ? res.homepage : "#",
          "target": "_blank"
        }, [res.name]), createVNode("span", null, [" ", res.error ? "\u6B64\u9898\u5E93\u8BF7\u6C42\u9519\u8BEF: " + res.error.message : `\u4E00\u5171\u6709 ${res.answers.length} \u4E2A\u7ED3\u679C`, " "])]), res.error ? createVNode("div", null, null) : createVNode("div", {
          "style": {
            paddingLeft: "12px"
          }
        }, [res.answers.map((answer) => {
          var _a2, _b2;
          return createVNode("div", {
            "class": "search-results-item"
          }, [createVNode("div", {
            "title": answer.question
          }, [createVNode("span", null, [createVNode("span", {
            "style": "color: #a7a7a7"
          }, [createTextVNode("\u9898\u76EE: ")]), createVNode("div", {
            "innerHTML": (_a2 = answer.question) == null ? void 0 : _a2.replace(/https?:\/\/.*?\.(png|jpg|jpeg|gif)/g, (match) => `<img src="${match}" />`)
          }, null)])]), createVNode("div", {
            "title": answer.answer
          }, [createVNode("span", null, [createVNode("span", {
            "style": "color: #a7a7a7"
          }, [createTextVNode("\u56DE\u7B54: ")]), createVNode("div", {
            "innerHTML": (_b2 = answer.answer) == null ? void 0 : _b2.replace(/https?:\/\/.*?\.(png|jpg|jpeg|gif)/g, (match) => `<img src="${match}" />`)
          }, null)])])]);
        })])]))])]) : createVNode("div", null, null), createVNode("div", {
          "style": "text-align:center; padding-bottom: 4px"
        }, [createVNode("span", null, [createTextVNode("\u{1F4E2} \u9F20\u6807\u79FB\u5230\u4EFB\u610F\u9898\u76EE\uFF0C\u53EF\u4EE5\u67E5\u770B\u641C\u7D22\u8BE6\u60C5 \u{1F4E2}")]), createVNode("br", null, null), createVNode("span", null, [createTextVNode("\u2757\u5982\u679C\u9898\u76EE\u6587\u5B57\u53D8\u5927\uFF0C\u5219\u662F\u6B63\u5728\u5BF9\u6587\u672C\u8FDB\u884C\u6587\u5B57\u8BC6\u522B\uFF0C\u5C5E\u4E8E\u6B63\u5E38\u60C5\u51B5\u2757")])]), createVNode("hr", null, null), createVNode("div", null, [local.workResults.map((res, i) => {
          var _a2, _b2, _c2, _d2, _e2;
          const title = (_b2 = (_a2 = res.ctx) == null ? void 0 : _a2.elements.title) == null ? void 0 : _b2[0];
          const isCopy = ref(false);
          return createVNode("div", {
            "class": "search-results-title",
            "onMouseenter": () => currentResult.value = res,
            "style": {
              color: ((_c2 = res.result) == null ? void 0 : _c2.finish) ? "" : "red"
            },
            "title": ((_e2 = (_d2 = res.ctx) == null ? void 0 : _d2.elements.title) == null ? void 0 : _e2[0].textContent) || "",
            "onClick": (e) => {
              e.stopPropagation();
            }
          }, [createVNode("span", {
            "style": {
              borderRight: "1px solid #cbcbcb",
              marginRight: "2px",
              textShadow: "black 0px 0px",
              fontSize: "14px",
              display: "inline-block",
              cursor: "pointer"
            },
            "onClick": () => {
              var _a3;
              if (isCopy.value === false) {
                isCopy.value = true;
                navigator.clipboard.writeText(((_a3 = title == null ? void 0 : title.textContent) == null ? void 0 : _a3.trim()) || "");
                setTimeout(() => {
                  isCopy.value = false;
                }, 500);
              }
            }
          }, [createVNode(Tooltip, {
            "title": "\u590D\u5236\u9898\u76EE"
          }, {
            default: () => [isCopy.value ? "\u2705" : "\u{1F4C4}"]
          })]), createVNode("span", {
            "style": {
              borderRight: "1px solid #cbcbcb",
              marginRight: "2px",
              paddingRight: "2px",
              color: "darkgrey",
              userSelect: "none"
            }
          }, [i + 1]), createVNode("span", null, [StringUtils.of((title == null ? void 0 : title.textContent) || "").nowrap().max(40).toString()])]);
        })])]) : createVNode("div", {
          "class": "search-results-empty",
          "style": {
            textAlign: "center"
          }
        }, [createTextVNode("\u6682\u65E0\u641C\u7D22\u7ED3\u679C"), createVNode("br", null, null), createTextVNode("\u5982\u679C\u5F53\u524D\u4E3A\u5B66\u4E60\u9875\u9762\uFF0C\u8BF7\u7B49\u5F85\u89C6\u9891\uFF0Cppt\u7B49\u5B8C\u6210\u540E\u624D\u4F1A\u5F00\u59CB\u81EA\u52A8\u7B54\u9898")])]);
      };
    }
  });
  const Alert = defineComponent({
    props: {
      type: {
        default: "info",
        type: String
      },
      text: {
        default: "",
        type: String
      },
      index: {
        default: 0,
        type: Number
      }
    },
    setup(props) {
      const {
        type,
        text,
        index: index2
      } = toRefs(props);
      const local = useStore("localStorage");
      return () => createVNode("div", {
        "class": ["alert", type.value].join(" ")
      }, [createVNode("span", {
        "style": "text-shadow: 0 0 BLACK;"
      }, [type.value === "info" ? "\u2139\uFE0F" : type.value === "error" ? "\u2757" : type.value === "success" ? "\u2705" : type.value === "warn" ? "\u26A0\uFE0F" : "\u2755"]), createVNode("div", {
        "style": "display: inline"
      }, [createVNode("span", {
        "class": "alert-closer",
        "onClick": () => local.alerts.splice(index2.value, 1)
      }, [createTextVNode("\xD7")]), createVNode("span", {
        "class": "alert-text"
      }, [text.value])])]);
    }
  });
  var App_vue_vue_type_style_index_0_lang = "";
  const _hoisted_1 = { class: "alert-container" };
  const _hoisted_2 = ["panel-title", "onClick"];
  const _hoisted_3 = ["panel"];
  const _sfc_main = /* @__PURE__ */ defineComponent({
    setup(__props) {
      var _a, _b;
      const ctx = useContext();
      const local = useStore("localStorage");
      const panels = ref(getCurrentPanels(definedScripts));
      const hide = ref(local.hide);
      const currentPanels = computed$1(() => {
        return (panels.value.every((panel2) => panel2.default === true) ? panels.value : panels.value.filter((panel2) => !panel2.default)).sort((a, b) => (b.priority || 0) - (a.priority || 0));
      });
      const activeKey = ref(((_a = currentPanels.value.find((p2) => p2.name === local.activeKey)) == null ? void 0 : _a.name) || ((_b = currentPanels.value[0]) == null ? void 0 : _b.name));
      const panel = ref(void 0);
      const panelHeader = ref(void 0);
      const panelContainer = ref(void 0);
      const panelFooter = ref(void 0);
      const logo = ref(void 0);
      watch$1(currentPanels, () => {
        const key = currentPanels.value.find((p2) => p2.name === activeKey.value);
        if (!key) {
          activeKey.value = currentPanels.value[0].name;
        }
      });
      watch$1(activeKey, () => {
        local.activeKey = activeKey.value;
      });
      watch$1(hide, () => {
        local.hide = hide.value;
        nextTick(() => {
          enablePanelDrag();
        });
      });
      onMounted(() => {
        local.alerts = [];
        nextTick(() => {
          listenResetEvent();
          enablePanelDrag();
          listenHistoryChange();
          let { x, y } = local.position;
          if (panel.value && x && y) {
            const { width, height } = panel.value.getBoundingClientRect();
            const { innerWidth, innerHeight } = window;
            if (x < 0) {
              x = width - 50;
            }
            if (y < 0) {
              y = height;
            }
            if (x + width > innerWidth) {
              x = innerWidth - width - 50;
            }
            if (y < 0 || y + height > innerHeight) {
              y = innerHeight - height - 50;
            }
            panel.value.style.left = `${x}px`;
            panel.value.style.top = `${y}px`;
          }
        });
      });
      const onMove = debounce_1(function(x, y) {
        local.position.x = x;
        local.position.y = y;
      }, 100);
      function enablePanelDrag() {
        var _a2;
        if (panel.value && ((_a2 = ctx.common.startOptions) == null ? void 0 : _a2.draggable)) {
          if (logo.value) {
            dragElement(logo.value, panel.value, onMove);
          }
          if (panelHeader.value && panelFooter.value) {
            dragElement(panelHeader.value, panel.value, onMove);
            dragElement(panelFooter.value, panel.value, onMove);
          }
        }
      }
      function listenResetEvent() {
        const target = ["o", "c", "s"];
        let stack = [];
        onkeydown = (e) => {
          if (target.includes(e.key)) {
            stack.push(e.key);
            console.log(stack.join(""));
            const contains = stack.join("").includes(target.join(""));
            if (contains) {
              if (panel.value) {
                panel.value.style.top = "20%";
                panel.value.style.bottom = "unset";
                panel.value.style.left = "50%";
              }
              stack = [];
            }
          } else {
            stack = [];
          }
        };
      }
      function listenHistoryChange() {
        history.pushState = addFunctionEventListener(history, "pushState");
        history.replaceState = addFunctionEventListener(history, "replaceState");
        window.addEventListener("pushState", () => panels.value = getCurrentPanels(definedScripts));
        window.addEventListener("replaceState", () => panels.value = getCurrentPanels(definedScripts));
      }
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          id: "ocs-panel",
          ref_key: "panel",
          ref: panel,
          class: normalizeClass(hide.value ? "hide" : "")
        }, [
          createBaseVNode("div", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(local).alerts, (item, index2) => {
              return openBlock(), createBlock(unref(Alert), {
                key: index2,
                style: normalizeStyle({ opacity: 1 - (unref(local).alerts.length - 1 - index2) * (1 / unref(local).alerts.length) }),
                type: item.type,
                text: item.text,
                index: index2
              }, null, 8, ["style", "type", "text", "index"]);
            }), 128))
          ]),
          hide.value ? (openBlock(), createBlock(unref(Tooltip), {
            key: 0,
            "tooltip-style": { transform: "translate(-36%, -110%)", textAlign: "center", fontSize: "12px" },
            title: `OCS \u7F51\u8BFE\u52A9\u624B ${unref(useStore)("VERSION")}<br>\u5355\u51FB\u62D6\u52A8<br>\u53CC\u51FB\u5C55\u5F00<br>\u8FDE\u7EED\u6309\u4E0Bocs\u4E09\u4E2A\u952E\u53EF\u590D\u539F\u4F4D\u7F6E<br>\u60F3\u8981\u5B8C\u5168\u9690\u85CF\u53EF\u79FB\u51FA\u5C4F\u5E55`
          }, {
            default: withCtx(() => [
              createBaseVNode("img", {
                ref_key: "logo",
                ref: logo,
                class: "ocs-icon",
                src: "https://cdn.ocsjs.com/logo.png",
                onDblclick: _cache[0] || (_cache[0] = ($event) => hide.value = false),
                onClick: _cache[1] || (_cache[1] = (e) => e.stopPropagation())
              }, null, 544)
            ]),
            _: 1
          }, 8, ["tooltip-style", "title"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createBaseVNode("div", {
              ref_key: "panelHeader",
              ref: panelHeader,
              class: "ocs-panel-header draggable"
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(currentPanels).filter((p2) => {
                var _a2;
                return ((_a2 = p2.hide) == null ? void 0 : _a2.call(p2)) !== true;
              }), (item, index2) => {
                return openBlock(), createElementBlock("div", {
                  key: index2,
                  "panel-title": item.name,
                  class: normalizeClass(["title", item.name === activeKey.value ? "active" : ""]),
                  onClick: ($event) => activeKey.value = item.name
                }, [
                  createBaseVNode("span", null, toDisplayString(item.name), 1)
                ], 10, _hoisted_2);
              }), 128))
            ], 512),
            createBaseVNode("div", {
              ref_key: "panelContainer",
              ref: panelContainer,
              class: "ocs-panel-container"
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(currentPanels).filter((p2) => {
                var _a2;
                return ((_a2 = p2.hide) == null ? void 0 : _a2.call(p2)) !== true;
              }), (item, index2) => {
                return withDirectives((openBlock(), createElementBlock("div", {
                  key: index2,
                  panel: item.name
                }, [
                  (openBlock(), createBlock(resolveDynamicComponent(item.el())))
                ], 8, _hoisted_3)), [
                  [vShow, item.name === activeKey.value]
                ]);
              }), 128))
            ], 512),
            createBaseVNode("div", {
              ref_key: "panelFooter",
              ref: panelFooter,
              class: "ocs-panel-footer draggable"
            }, [
              createBaseVNode("span", {
                class: "hide-btn",
                onClick: _cache[2] || (_cache[2] = ($event) => hide.value = true)
              }, " \u70B9\u51FB\u7F29\u5C0F "),
              createBaseVNode("span", null, " OCS \u7F51\u8BFE\u52A9\u624B " + toDisplayString(unref(useStore)("VERSION")), 1)
            ], 512)
          ], 64))
        ], 2);
      };
    }
  });
  function loggerPrefix(level) {
    const extra = level === "error" ? "[\u9519\u8BEF]" : level === "warn" ? "[\u8B66\u544A]" : void 0;
    if (typeof window === "undefined") {
      return [`[OCS][${new Date().toLocaleTimeString()}]${extra || ""}`];
    } else {
      const bgColor = level === "info" ? "#2196f3a3" : level === "debug" ? "#9e9e9ec4" : level === "warn" ? "#ffc107db" : "#f36c71cc";
      return [
        `%c[OCS][${new Date().toLocaleTimeString()}]${extra || ""}`,
        `background:${bgColor};color:white;padding:2px;border-radius:2px`
      ];
    }
  }
  function createLog(level, ...msg) {
    return loggerPrefix(level).concat(...msg);
  }
  function logger(level, ...msg) {
    if (level === "error") {
      console.error(...createLog(level, msg));
    }
    if (isInBrowser()) {
      const extra = level === "info" ? "\u4FE1\u606F" : level === "error" ? "\u9519\u8BEF" : level === "warn" ? "\u8B66\u544A" : level === "debug" ? "\u8C03\u8BD5" : "";
      const text = msg.map((s) => {
        const type = typeof s;
        return type === "function" ? "[Function]" : type === "object" ? "[Object]" : type === "undefined" ? "\u65E0" : s;
      });
      const local = useStore("localStorage");
      if (local.logs.length > 50) {
        local.logs.shift();
      }
      local.logs.push({
        time: Date.now(),
        level,
        extra,
        text: text.join(" ")
      });
    }
  }
  exports2.panel = void 0;
  exports2.app = void 0;
  exports2.loaded = false;
  function start(options) {
    const div = document.createElement("div");
    const shadowRoot = div.attachShadow({ mode: "closed" });
    executeScripts((options == null ? void 0 : options.scripts) || definedScripts);
    if (top === window) {
      let showPanels = function() {
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(exports2.panel);
        document.body.appendChild(div);
        exports2.app.mount(exports2.panel);
        logger("info", `OCS ${useStore("VERSION")} \u52A0\u8F7D\u6210\u529F`);
      };
      const ctx = useContext();
      ctx.common.startOptions = options;
      exports2.app = createApp(_sfc_main);
      const style = document.createElement("style");
      exports2.panel = document.createElement("div");
      style.innerHTML = (options == null ? void 0 : options.style) || "";
      onComplete(() => {
        if (!exports2.loaded) {
          exports2.loaded = true;
          showPanels();
        }
      });
      onInteractive(() => {
        if (!exports2.loaded) {
          exports2.loaded = true;
          showPanels();
        }
      });
    }
  }
  function executeScripts(scripts2) {
    var _a;
    window.addEventListener("unhandledrejection", (event) => {
      logger("error", event.reason.toString());
      console.error(event.reason);
    });
    try {
      let load = function() {
        var _a2;
        for (const route of routes.filter((route2) => route2.onload)) {
          (_a2 = route.onload) == null ? void 0 : _a2.call(route);
        }
      };
      const routes = getCurrentRoutes(scripts2);
      if (window.document.readyState === "complete") {
        load();
      } else {
        window.addEventListener("load", load);
      }
      for (const route of routes.filter((route2) => route2.onstart)) {
        (_a = route.onstart) == null ? void 0 : _a.call(route);
      }
    } catch (e) {
      logger("error", e);
      console.error(e);
    }
  }
  const Terminal = defineComponent({
    setup() {
      const local = useStore("localStorage");
      onMounted(() => {
        watch$1(local.logs, () => nextTick(() => scroll()));
        function scroll() {
          if (exports2.panel) {
            const {
              terminal
            } = domSearch({
              terminal: ".terminal"
            }, exports2.panel);
            if (terminal == null ? void 0 : terminal.scrollHeight) {
              terminal == null ? void 0 : terminal.scrollTo({
                behavior: "auto",
                top: terminal.scrollHeight
              });
            }
          }
        }
      });
      return () => createVNode("div", {
        "class": "terminal"
      }, [local.logs.map((log2) => createVNode("div", null, [createVNode("span", {
        "style": {
          color: "gray"
        }
      }, [new Date(log2.time).toLocaleTimeString("zh-CN")]), createVNode("span", null, [createTextVNode(" ")]), createVNode(resolveComponent("level"), {
        "class": log2.level
      }, {
        default: () => [log2.extra]
      }), createVNode("span", null, [createTextVNode(" ")]), createVNode("span", {
        "innerHTML": log2.text
      }, null)]))]);
    }
  });
  function createNote(...notes) {
    return defineComponent({
      render() {
        return createVNode("div", null, [createVNode("ul", null, [notes.map((note) => createVNode("li", {
          "style": {
            padding: "4px 2px",
            fontWeight: "bold"
          }
        }, [note]))])]);
      }
    });
  }
  function createTerminalPanel() {
    return {
      name: "\u65E5\u5FD7",
      priority: -999,
      el: () => Terminal
    };
  }
  function createSearchResultPanel() {
    return {
      name: "\u641C\u9898\u7ED3\u679C",
      el: () => SearchResults
    };
  }
  function defineScript(options) {
    return options;
  }
  const supports = ["*"];
  const CommonScript = defineScript({
    name: "\u9ED8\u8BA4\u811A\u672C",
    routes: [
      {
        name: "\u7981\u6B62\u5F39\u7A97\u811A\u672C",
        url: supports,
        onstart() {
          try {
            if (typeof useUnsafeWindow() !== "undefined") {
              useUnsafeWindow().alert = console.log;
            }
            window.alert = self.alert = console.log;
          } catch (e) {
            console.error("\u7981\u6B62\u5F39\u7A97\u811A\u672C\u9519\u8BEF", e.message);
          }
        }
      },
      {
        name: "\u5F00\u542F\u9875\u9762\u590D\u5236\u7C98\u8D34\u529F\u80FD",
        url: supports,
        onstart() {
          function enableCopy() {
            try {
              const d = document;
              const b = document.body;
              d.onselectstart = d.oncopy = d.onpaste = d.onkeydown = d.oncontextmenu = () => true;
              b.onselectstart = b.oncopy = b.onpaste = b.onkeydown = b.oncontextmenu = () => true;
            } catch (err) {
              console.error("\u9875\u9762\u590D\u5236\u7C98\u8D34\u529F\u80FD\u5F00\u542F\u5931\u8D25", err);
            }
            const style = document.createElement("style");
            style.innerHTML = `
                        html * {
                          -webkit-user-select: text !important;
                          -khtml-user-select: text !important;
                          -moz-user-select: text !important;
                          -ms-user-select: text !important;
                          user-select: text !important;
                        }`;
            document.body.appendChild(style);
          }
          onInteractive(() => enableCopy());
          onComplete(() => {
            enableCopy();
            setTimeout(() => enableCopy(), 3e3);
          });
        }
      },
      {
        name: "\u83B7\u53D6\u8F6F\u4EF6\u9898\u5E93\u914D\u7F6E\u811A\u672C",
        url: supports,
        async onload() {
          if (top === self) {
            const settings = useSettings();
            if (settings.common.answererWrappers.length === 0) {
              const setting = await getRemoteSetting(15319);
              if (setting == null ? void 0 : setting.answererWrappers) {
                logger("debug", "\u6210\u529F\u8BFB\u53D6\u672C\u5730\u9898\u5E93\u914D\u7F6E");
                const settings2 = useSettings();
                settings2.common.answererWrappers = setting.answererWrappers;
              }
            }
          }
        }
      }
    ],
    panels: [
      {
        name: "OCS\u52A9\u624B",
        priority: 100,
        default: true,
        url: supports,
        el: () => createNote("\u2B50 \u811A\u672C\u5217\u8868\uFF1A" + definedScripts.map((s) => s.name).join(", "), "\u{1F4E2} \u624B\u52A8\u70B9\u51FB\u8FDB\u5165\u89C6\u9891\uFF0C\u4F5C\u4E1A\uFF0C\u8003\u8BD5\u9875\u9762\uFF0C\u5373\u53EF\u81EA\u52A8\u8FD0\u884C", "\u{1F4E2} \u5982\u679C\u8FDB\u5165\u540E\u672A\u663E\u793A\u4EFB\u4F55\u8BBE\u7F6E\u6216\u8005\u672A\u8FD0\u884C\uFF0C\u5219\u60A8\u5F53\u524D\u7684\u9875\u9762\u6216\u8005\u7F51\u8BFE\u6CA1\u6709\u811A\u672C\u54E6\u3002", "\u26A0\uFE0F \u8BF7\u5C06\u6D4F\u89C8\u5668\u9875\u9762\u4FDD\u6301\u6700\u5927\u5316\uFF0C\u6216\u8005\u7F29\u5C0F\u7A97\u53E3\uFF0C\u4E0D\u80FD\u6700\u5C0F\u5316\uFF0C\u53EF\u80FD\u5BFC\u81F4\u89C6\u9891\uFF0Cppt\u7B49\u4EFB\u52A1\u4E0D\u80FD\u8FD0\u884C\uFF01", "\u{1F4A1} \u62D6\u52A8\u4E0A\u65B9\u6807\u9898\u680F\u53EF\u4EE5\u8FDB\u884C\u62D6\u62FD\u54E6!")
      }
    ]
  });
  const WorkerSetting = defineComponent({
    props: {
      label: {
        default: "",
        type: String
      },
      config: {
        default: () => ({}),
        type: Object
      },
      changeHandler: {
        default: () => () => {
        },
        type: Function
      }
    },
    setup(props, ctx) {
      var _a;
      let options = ((_a = props.config) == null ? void 0 : _a.options) ? props.config.options : [{
        label: "\u5173\u95ED\u81EA\u52A8\u7B54\u9898",
        value: "close",
        title: "\u5173\u95ED\u81EA\u52A8\u7B54\u9898\u540E, \u811A\u672C\u5C06\u5FFD\u7565\u7B54\u9898, \u81EA\u52A8\u8FDB\u5165\u4E0B\u4E00\u8282\u3002"
      }, {
        label: "\u5B8C\u6210\u540E\u81EA\u52A8\u4FDD\u5B58",
        value: "save",
        title: "\u5B8C\u6210\u540E\u81EA\u52A8\u4FDD\u5B58\u7B54\u6848, \u6CE8\u610F\u5982\u679C\u4F60\u5F00\u542F\u4E86\u968F\u673A\u4F5C\u7B54, \u6709\u53EF\u80FD\u5206\u8FA8\u4E0D\u51FA\u7B54\u6848\u662F\u5426\u6B63\u786E\u3002"
      }, {
        label: "\u5B8C\u6210\u540E\u4E0D\u505A\u4EFB\u4F55\u52A8\u4F5C",
        value: "nomove",
        title: "\u5B8C\u6210\u540E\u65E2\u4E0D\u4FDD\u5B58\u4E5F\u4E0D\u63D0\u4EA4, \u7B49\u5F85\u65F6\u95F4\u8FC7\u540E\u5C06\u4F1A\u81EA\u52A8\u4E0B\u4E00\u8282, \u9002\u5408\u5728\u6D4B\u8BD5\u811A\u672C\u65F6\u4F7F\u7528\u3002"
      }, {
        label: "\u5F3A\u5236\u81EA\u52A8\u63D0\u4EA4",
        value: "force",
        title: "\u4E0D\u7BA1\u7B54\u6848\u662F\u5426\u6B63\u786E\u76F4\u63A5\u5F3A\u5236\u81EA\u52A8\u63D0\u4EA4\uFF0C\u5982\u9700\u5F00\u542F\uFF0C\u8BF7\u914D\u5408\u968F\u673A\u4F5C\u7B54\u8C28\u614E\u4F7F\u7528\u3002"
      }, ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map((rate) => ({
        label: `\u67E5\u5230\u5927\u4E8E${rate}%\u7684\u9898\u76EE\u5219\u81EA\u52A8\u63D0\u4EA4`,
        value: rate,
        title: `\u4F8B\u5982: 100\u9898, \u641C\u7D22\u5230\u5927\u4E8E ${rate} \u7684\u9898, \u5219\u4F1A\u81EA\u52A8\u63D0\u4EA4\u7B54\u6848\u3002`
      })), {
        label: "\u6BCF\u4E2A\u9898\u76EE\u90FD\u67E5\u5230\u7B54\u6848\u624D\u81EA\u52A8\u63D0\u4EA4",
        value: 100
      }];
      options = options.map((option) => {
        var _a2;
        props.config.selected = ((_a2 = props.config) == null ? void 0 : _a2.selected) || "close";
        if (option.value === props.config.selected || String(option.value) === props.config.selected) {
          option.selected = true;
        }
        return option;
      });
      const {
        common
      } = useSettings();
      return () => createVNode(Fragment, null, [createVNode("label", null, [props.label]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u7B54\u9898\u8BBE\u7F6E, \u9F20\u6807\u60AC\u6D6E\u5728\u9009\u9879\u4E0A\u53EF\u4EE5\u67E5\u770B\u6BCF\u4E2A\u9009\u9879\u7684\u5177\u4F53\u89E3\u91CA\u3002"
      }, {
        default: () => [createVNode("select", {
          "onChange": (e) => {
            props.changeHandler(e);
          }
        }, [options.map((option) => createVNode("option", {
          "title": option.title,
          "value": option.value,
          "selected": option.selected
        }, [option.label]))])]
      })]), createVNode("label", null, [createTextVNode("\u9898\u5E93\u914D\u7F6E")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u8BF7\u590D\u5236\u7C98\u8D34\u9898\u5E93\u914D\u7F6E, \u70B9\u51FB\u53F3\u4FA7\u95EE\u53F7\u67E5\u770B\u6559\u7A0B\n(\u5982\u9700\u8986\u76D6\u76F4\u63A5\u590D\u5236\u7C98\u8D34\u65B0\u7684\u5373\u53EF) "
      }, {
        default: () => [createVNode("input", {
          "type": "text",
          "placeholder": "\u70B9\u51FB\u53F3\u4FA7\u95EE\u53F7\u67E5\u770B\u6559\u7A0B => ",
          "value": common.answererWrappers.length === 0 ? "" : JSON.stringify(common.answererWrappers),
          "onPaste": async (e) => {
            var _a2;
            const text = ((_a2 = e.clipboardData) == null ? void 0 : _a2.getData("text")) || await navigator.clipboard.readText() || "";
            common.answererWrappers = parseAnswererWrappers(text);
            console.log("common", {
              common
            });
          }
        }, null)]
      }), createVNode("span", {
        "style": {
          color: common.answererWrappers.length ? "green" : "red"
        }
      }, [common.answererWrappers.length ? createVNode(Tooltip, null, {
        default: () => [createVNode("span", {
          "class": "pointer"
        }, [createTextVNode("\u2705")])],
        title: () => createVNode(Fragment, null, [createVNode("span", null, [createTextVNode("\u89E3\u6790\u6210\u529F, \u4E00\u5171\u6709 "), common.answererWrappers.length, createTextVNode(" \u4E2A\u9898\u5E93")]), createVNode("ol", null, [common.answererWrappers.map((aw) => createVNode("li", null, [aw.name]))])])
      }) : createVNode(Tooltip, {
        "title": "\u9898\u5E93\u6CA1\u6709\u914D\u7F6E, \u81EA\u52A8\u7B54\u9898\u529F\u80FD\u5C06\u4E0D\u80FD\u4F7F\u7528 !"
      }, {
        default: () => [createVNode("span", {
          "class": "pointer"
        }, [createTextVNode("\u274C")])]
      })]), createVNode("span", null, [createVNode(Tooltip, {
        "title": "\u70B9\u51FB\u67E5\u770B\u9898\u5E93\u914D\u7F6E\u6559\u7A0B"
      }, {
        default: () => [createVNode("span", {
          "class": "pointer",
          "onClick": () => {
            window.open("http://www.mujincs.cn");
          }
        }, [createTextVNode("\u2753")])]
      })])])]);
    }
  });
  function parseAnswererWrappers(value) {
    try {
      const aw = JSON.parse(value);
      if (aw && Array.isArray(aw)) {
        if (aw.length) {
          if (aw.every((item) => item.url && item.handler)) {
            message("success", "\u9898\u5E93\u914D\u7F6E\u6210\u529F\uFF01");
            return aw;
          } else {
            message("error", "\u9898\u5E93\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570: `url` \u6216 `handler` ");
          }
        } else {
          message("error", "\u9898\u5E93\u4E3A\u7A7A\uFF01");
        }
        return aw;
      } else {
        message("error", "\u9898\u5E93\u914D\u7F6E\u683C\u5F0F\u9519\u8BEF\uFF01");
      }
    } catch (e) {
      console.log(e);
      message("error", "\u9898\u5E93\u914D\u7F6E\u683C\u5F0F\u9519\u8BEF\uFF01");
    }
    return [];
  }
  const CommonWorkSettingPanel$1 = defineComponent({
    props: {
      settings: {
        default: () => {
        },
        type: Object
      }
    },
    setup(props, {
      slots
    }) {
      const {
        settings
      } = toRefs(props);
      const commonSettings = useSettings().cx.common;
      return () => {
        var _a, _b;
        return createVNode(Fragment, null, [(_a = slots.upload) == null ? void 0 : _a.call(slots), createVNode("label", null, [createTextVNode("\u7E41\u4F53\u5B57\u8BC6\u522B\u6A21\u5F0F")]), createVNode("div", null, [createVNode(Tooltip, {
          "title": "\u7E41\u4F53/\u52A0\u5BC6/\u4E71\u7801\u5B57\u8BC6\u522B\u529F\u80FD\uFF0C\u9ED8\u8BA4\u63A8\u8350-\u5B57\u5178\u5339\u914D\u8BC6\u522B\n\u5982\u679C\u5B57\u4F53\u5339\u914D\u8BC6\u522B\u7528\u4E0D\u4E86\uFF0C\u53EF\u4EE5\u5207\u6362\u5230OCR\u6587\u5B57\u8BC6\u522B\u3002"
        }, {
          default: () => [createVNode("select", {
            "onChange": (e) => commonSettings.recognize = e.target.value
          }, [[["map", "\u5B57\u5178\u5339\u914D\u8BC6\u522B-\u63A8\u8350"], ["ocr", "OCR\u6587\u5B57\u8BC6\u522B"], ["close", "\u5173\u95ED\u7E41\u4F53\u5B57\u8BC6\u522B"]].map((item) => createVNode("option", {
            "value": item[0],
            "selected": commonSettings.recognize === item[0]
          }, [item[1]]))])]
        })]), createVNode("label", null, [createTextVNode("\u7B54\u9898\u95F4\u9694(\u79D2)")]), createVNode("div", null, [createVNode("input", {
          "type": "number",
          "value": settings.value.period,
          "min": "3",
          "step": "1",
          "onChange": (e) => settings.value.period = e.target.valueAsNumber,
          "onInput": (e) => settings.value.period = e.target.valueAsNumber
        }, null)]), createVNode("label", null, [createTextVNode("\u641C\u9898\u8BF7\u6C42\u8D85\u65F6\u65F6\u95F4(\u79D2)")]), createVNode("div", null, [createVNode(Tooltip, {
          "title": "\u6BCF\u9053\u9898\u6700\u591A\u505An\u79D2, \u8D85\u8FC7\u5219\u8DF3\u8FC7\u6B64\u9898\u3002"
        }, {
          default: () => [createVNode("input", {
            "type": "number",
            "value": settings.value.timeout,
            "min": "10",
            "step": "1",
            "onChange": (e) => settings.value.timeout = e.target.valueAsNumber,
            "onInput": (e) => settings.value.timeout = e.target.valueAsNumber
          }, null)]
        })]), createVNode("label", null, [createTextVNode("\u641C\u9898\u8D85\u65F6\u91CD\u8BD5\u6B21\u6570")]), createVNode("div", null, [createVNode("input", {
          "type": "number",
          "value": settings.value.retry,
          "min": "0",
          "max": "2",
          "step": "1",
          "onChange": (e) => settings.value.retry = e.target.valueAsNumber,
          "onInput": (e) => settings.value.retry = e.target.valueAsNumber
        }, null)]), (_b = slots.extra) == null ? void 0 : _b.call(slots), createVNode("label", null, [createTextVNode("\u7B54\u9898\u5B8C\u6210\u540E\u7B49\u5F85(\u79D2)")]), createVNode("div", null, [createVNode(Tooltip, {
          "title": "\u81EA\u52A8\u7B54\u9898\u5B8C\u6210\u540E\u7684\u7B49\u5F85\u65F6\u95F4, \u53EF\u9002\u5F53\u5EF6\u957F\u65B9\u4FBF\u5BF9\u9898\u76EE\u68C0\u67E5\u6216\u8005\u4F7F\u7528\u7B2C\u4E09\u65B9\u5DE5\u5177\u7B54\u9898\u3002"
        }, {
          default: () => [createVNode("input", {
            "type": "number",
            "value": settings.value.waitForCheck,
            "min": "5",
            "step": "1",
            "onChange": (e) => settings.value.waitForCheck = e.target.valueAsNumber,
            "onInput": (e) => settings.value.waitForCheck = e.target.valueAsNumber
          }, null)]
        })])]);
      };
    }
  });
  const ExamSettingPanel = defineComponent({
    setup() {
      const settings = useSettings().cx.exam;
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode(CommonWorkSettingPanel$1, {
        "settings": settings
      }, {
        upload: createVNode(WorkerSetting, {
          "label": "\u81EA\u52A8\u7B54\u9898",
          "config": {
            selected: "close",
            options: [{
              label: "\u8BF7\u81EA\u884C\u68C0\u67E5\u540E\u81EA\u884C\u70B9\u51FB\u63D0\u4EA4",
              value: "close"
            }]
          },
          "changeHandler": (e) => settings.upload = e.target.value
        }, null)
      })])]);
    }
  });
  function defaultWorkTypeResolver(ctx) {
    function count(selector) {
      let c = 0;
      for (const option of ctx.elements.options || []) {
        if (option.querySelector(selector) !== null) {
          c++;
        }
      }
      return c;
    }
    return count('[type="radio"]') === 2 ? "judgement" : count('[type="radio"]') > 2 ? "single" : count('[type="checkbox"]') > 2 ? "multiple" : count("textarea") >= 1 ? "completion" : void 0;
  }
  function isPlainAnswer(answer) {
    if (answer.length > 8 || !/[A-Z]/.test(answer)) {
      return false;
    }
    const counter = {};
    let min = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer.charCodeAt(i) < min) {
        return false;
      }
      min = answer.charCodeAt(i);
      counter[min] = (counter[min] || 0) + 1;
    }
    for (const key in counter) {
      if (counter[key] !== 1) {
        return false;
      }
    }
    return true;
  }
  function splitAnswer(answer) {
    try {
      const json = JSON.parse(answer);
      if (Array.isArray(json)) {
        return json.map(String).filter((el) => el.trim().length > 0);
      }
    } catch {
      const seprators = ["===", "#", "---", "###", "|", ";"];
      for (const sep of seprators) {
        if (answer.split(sep).length > 1) {
          return answer.split(sep).filter((el) => el.trim().length > 0);
        }
      }
    }
    return [answer];
  }
  function defaultQuestionResolve(ctx) {
    return {
      single(results, options, handler) {
        for (const result of results) {
          for (const answer of result.answers) {
            const ans = StringUtils.nowrap(answer.answer).trim();
            if (ans.length === 1 && isPlainAnswer(ans)) {
              const index22 = ans.charCodeAt(0) - 65;
              handler("single", options[index22].textContent || options[index22].innerText, options[index22], ctx);
              return { finish: true, option: options[index22] };
            }
          }
        }
        const ratings = answerSimilar(results.map((res) => res.answers.map((ans) => ans.answer)).flat(), options.map((el) => el.textContent || el.innerText));
        let index2 = -1;
        let max = 0;
        ratings.forEach((rating, i) => {
          if (rating.rating > max) {
            max = rating.rating;
            index2 = i;
          }
        });
        if (index2 !== -1 && max > 0.6) {
          handler("single", options[index2].textContent || options[index2].innerText, options[index2], ctx);
          return {
            finish: true,
            ratings: ratings.map((r) => r.rating)
          };
        }
        return { finish: false };
      },
      multiple(results, options, handler) {
        const targetAnswers = [];
        const targetOptions = [];
        let count = 0;
        for (const answers of results.map((res) => res.answers.map((ans) => ans.answer))) {
          targetAnswers[count] = [];
          targetOptions[count] = [];
          options.forEach((el, i) => {
            if (answers.some((answer) => answer.includes(removeRedundant(el.textContent || el.innerText)))) {
              targetAnswers[count][i] = el.textContent || el.innerText;
              targetOptions[count][i] = el;
            }
          });
          for (const answer of answers) {
            const ans = StringUtils.nowrap(answer).trim();
            if (isPlainAnswer(ans)) {
              for (let i = 0; i < ans.length; i++) {
                const index22 = ans.charCodeAt(i) - 65;
                targetAnswers[count][i] = options[index22].textContent || options[index22].innerText;
                targetOptions[count][i] = options[index22];
              }
            }
          }
          if (targetAnswers[count].length === 0) {
            const ratings = answerSimilar(answers, options.map((el) => el.textContent || el.innerText)).sort((a, b) => b.rating - a.rating);
            if (ratings.some((rating) => rating.rating > 0.6)) {
              options.forEach((el, i) => {
                if (ratings[i].rating > 0.6) {
                  targetAnswers[count][i] = el.textContent || el.innerText;
                  targetOptions[count][i] = el;
                }
              });
            }
          }
          count++;
        }
        let max = 0;
        let index2 = -1;
        for (let i = 0; i < targetOptions.length; i++) {
          const len = targetAnswers[i].filter((ans) => ans !== void 0).length;
          if (len > max) {
            max = len;
            index2 = i;
          }
        }
        if (index2 === -1) {
          return { finish: false };
        } else {
          targetAnswers[index2] = targetAnswers[index2].filter((ans) => ans !== void 0);
          targetOptions[index2] = targetOptions[index2].filter((ans) => ans !== void 0);
          targetOptions[index2].forEach((_, i) => {
            setTimeout(() => {
              handler("multiple", targetAnswers[index2][i], targetOptions[index2][i], ctx);
            }, 500 * i);
          });
          return { finish: true, targetOptions, targetAnswers };
        }
      },
      judgement(results, options, handler) {
        for (const answers of results.map((res) => res.answers.map((ans) => ans.answer))) {
          let matches = function(target, options2) {
            return options2.some((option) => RegExp(clearString(option, "\u221A", "\xD7")).test(clearString(target, "\u221A", "\xD7")));
          };
          const correctWords = ["\u662F", "\u5BF9", "\u6B63\u786E", "\u221A", "\u5BF9\u7684", "\u662F\u7684", "\u6B63\u786E\u7684", "true", "yes", "1"];
          const incorrectWords = [
            "\u975E",
            "\u5426",
            "\u9519",
            "\u9519\u8BEF",
            "\xD7",
            "X",
            "\u9519\u7684",
            "\u4E0D\u5BF9",
            "\u4E0D\u6B63\u786E\u7684",
            "\u4E0D\u6B63\u786E",
            "\u4E0D\u662F",
            "\u4E0D\u662F\u7684",
            "false",
            "no",
            "0"
          ];
          const answerShowCorrect = answers.find((answer) => matches(answer, correctWords));
          const answerShowIncorrect = answers.find((answer) => matches(answer, incorrectWords));
          if (answerShowCorrect || answerShowIncorrect) {
            let option;
            for (const el of options) {
              const textShowCorrect = matches(el.textContent || el.innerText, correctWords);
              const textShowIncorrect = matches(el.textContent || el.innerText, incorrectWords);
              if (answerShowCorrect && textShowCorrect) {
                option = el;
                handler("judgement", answerShowCorrect, el, ctx);
                break;
              }
              if (answerShowIncorrect && textShowIncorrect) {
                option = el;
                handler("judgement", answerShowIncorrect, el, ctx);
                break;
              }
            }
            return { finish: true, option };
          }
        }
        return { finish: false };
      },
      completion: function(results, options, handler) {
        for (const answers of results.map((res) => res.answers.map((ans) => ans.answer))) {
          let ans = answers;
          if (ans.length === 1) {
            ans = splitAnswer(ans[0]);
          }
          if (ans.length !== 0 && ans.length === options.length) {
            options.forEach((el, i) => {
              setTimeout(() => {
                handler("completion", ans[i], el, ctx);
              }, 500 * i);
            });
            return { finish: true };
          }
        }
        return { finish: false };
      }
    };
  }
  class OCSWorker {
    constructor(opts) {
      this.opts = opts;
    }
    async doWork() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const results = [];
      let result;
      let type;
      let error;
      const root2 = typeof this.opts.root === "string" ? Array.from(document.querySelectorAll(this.opts.root)) : this.opts.root;
      for (const el of root2) {
        const time = Date.now();
        result = { finish: false };
        error = void 0;
        type = void 0;
        try {
          const elements = domSearchAll(this.opts.elements, el);
          (_b = (_a = this.opts).onElementSearched) == null ? void 0 : _b.call(_a, elements);
          this.currentContext = { searchResults: [], root: el, elements };
          if (typeof this.opts.work === "object") {
            type = this.opts.work.type === void 0 ? defaultWorkTypeResolver(this.currentContext) : typeof this.opts.work.type === "string" ? this.opts.work.type : this.opts.work.type(this.currentContext);
          }
          if (this.opts.interceptor === void 0 || await ((_d = (_c = this.opts).interceptor) == null ? void 0 : _d.call(_c, this.currentContext))) {
            const searchResults = await this.doAnswer(elements, type, this.currentContext);
            if (!searchResults) {
              throw new Error("\u7B54\u6848\u83B7\u53D6\u5931\u8D25, \u8BF7\u91CD\u65B0\u8FD0\u884C, \u6216\u8005\u5FFD\u7565\u6B64\u9898\u3002");
            } else {
              const validResults = searchResults.map((res2) => res2.answers.map((ans) => ans.answer)).flat().filter((ans) => ans);
              searchResults.forEach((res2) => {
                res2.answers = res2.answers.map((ans) => {
                  ans.answer = ans.answer ? ans.answer : "";
                  return ans;
                });
              });
              this.currentContext = { searchResults, root: el, elements };
              if (searchResults.length === 0 || validResults.length === 0) {
                throw new Error("\u641C\u7D22\u4E0D\u5230\u7B54\u6848, \u8BF7\u91CD\u65B0\u8FD0\u884C, \u6216\u8005\u5FFD\u7565\u6B64\u9898\u3002");
              }
            }
            if (typeof this.opts.work === "object") {
              if (elements.options) {
                if (type) {
                  const resolver = defaultQuestionResolve(this.currentContext)[type];
                  result = resolver(searchResults, elements.options, this.opts.work.handler);
                } else {
                  throw new Error("\u9898\u76EE\u7C7B\u578B\u89E3\u6790\u5931\u8D25, \u8BF7\u81EA\u884C\u63D0\u4F9B\u89E3\u6790\u5668, \u6216\u8005\u5FFD\u7565\u6B64\u9898\u3002");
                }
              } else {
                throw new Error("elements.options \u4E3A\u7A7A ! \u4F7F\u7528\u9ED8\u8BA4\u5904\u7406\u5668, \u5FC5\u987B\u63D0\u4F9B\u9898\u76EE\u9009\u9879\u7684\u9009\u62E9\u5668\u3002");
              }
            } else {
              result = this.opts.work(this.currentContext);
            }
          }
        } catch (e) {
          error = e;
          console.error(e);
          (_f = (_e = this.opts).onError) == null ? void 0 : _f.call(_e, e, this.currentContext);
          if (this.opts.stopWhenError) {
            return results;
          }
        }
        const res = {
          time,
          ctx: this.currentContext,
          result,
          consume: Date.now() - time,
          error,
          type
        };
        (_h = (_g = this.opts).onResult) == null ? void 0 : _h.call(_g, res);
        results.push(res);
        const { period = 3 * 1e3 } = this.opts;
        await sleep(period);
      }
      return results;
    }
    async doAnswer(elements, type, ctx) {
      let { timeout = 60 * 1e3, retry = 2 } = this.opts;
      const answer = async () => {
        return await Promise.race([
          this.opts.answerer(elements, type, ctx),
          sleep(timeout)
        ]);
      };
      let answers = await answer();
      if (!answers) {
        while (retry) {
          answers = await answer();
          retry--;
        }
      }
      return answers;
    }
    async uploadHandler(options) {
      var _a;
      const { results, uploadRate, callback } = options;
      let finished = 0;
      for (const result of results) {
        if ((_a = result.result) == null ? void 0 : _a.finish) {
          finished++;
        }
      }
      const rate = results.length === 0 ? 0 : finished / results.length * 100;
      if (uploadRate !== "nomove") {
        if (uploadRate === "force") {
          await callback(rate, true);
        } else {
          await callback(rate, uploadRate === "save" ? false : rate >= parseFloat(uploadRate));
        }
      }
    }
  }
  async function defaultAnswerWrapperHandler(answererWrappers, env) {
    const searchResults = [];
    const temp = JSON.parse(JSON.stringify(answererWrappers));
    for (const wrapper of temp) {
      const {
        name: name2 = "\u672A\u77E5\u9898\u5E93",
        homepage: homepage2 = "#",
        method = "get",
        type = "fetch",
        contentType = "json",
        headers = {},
        data: wrapperData = {},
        handler = "return (res)=> [JSON.stringify(res), undefined]"
      } = wrapper;
      try {
        let answers = [];
        const data = /* @__PURE__ */ Object.create({});
        Reflect.ownKeys(wrapperData).forEach((key) => {
          Reflect.set(data, key, resolvePlaceHolder(wrapperData[key.toString()]));
        });
        let url = resolvePlaceHolder(wrapper.url);
        url = method === "post" ? url : url + "?" + new URLSearchParams(data).toString();
        const requestData = {
          method,
          contentType,
          data,
          type,
          headers: JSON.parse(JSON.stringify(headers || {}))
        };
        const responseData = await request(url, requestData);
        const info = Function(handler)()(responseData);
        if (info && Array.isArray(info)) {
          if (info.every((item) => Array.isArray(item))) {
            answers = answers.concat(info.map((item) => ({
              question: item[0],
              answer: item[1]
            })));
          } else {
            answers.push({
              question: info[0],
              answer: info[1]
            });
          }
        }
        searchResults.push({
          url: wrapper.url,
          name: name2,
          homepage: homepage2,
          answers,
          response: responseData,
          data: requestData
        });
      } catch (error) {
        console.error("\u8BF7\u6C42\u5931\u8D25: ", { error });
        searchResults.push({
          url: wrapper.url,
          name: name2,
          homepage: homepage2,
          answers: [],
          response: void 0,
          data: void 0,
          error
        });
      }
    }
    function resolvePlaceHolder(str) {
      if (typeof str === "string") {
        const matches = str.match(/\${(.*?)}/g) || [];
        matches.forEach((placeHolder) => {
          const value = env[placeHolder.replace(/\${(.*)}/, "$1")];
          str = str.replace(placeHolder, value);
        });
      }
      return str;
    }
    return searchResults;
  }
  const CXAnalyses = {
    isInBreakingMode() {
      return Array.from((top == null ? void 0 : top.document.querySelectorAll(".catalog_points_sa")) || []).length !== 0;
    },
    isStuckInBreakingMode() {
      if (this.isInBreakingMode()) {
        const chapter = top == null ? void 0 : top.document.querySelector(".posCatalog_active");
        if (chapter) {
          chapter.finish_count = chapter.finish_count ? chapter.finish_count + 1 : 1;
          if (chapter.finish_count >= 2) {
            chapter.finish_count = 1;
            return true;
          }
        }
      }
      return false;
    },
    isInFinalTab() {
      const tabs = Array.from((top == null ? void 0 : top.document.querySelectorAll(".prev_ul li")) || []);
      return tabs.length && tabs[tabs.length - 1].classList.contains("active");
    },
    isInFinalChapter() {
      var _a;
      return (_a = Array.from((top == null ? void 0 : top.document.querySelectorAll(".posCatalog_select")) || []).pop()) == null ? void 0 : _a.classList.contains("posCatalog_active");
    },
    isFinishedAllChapters() {
      return this.getChapterInfos().every((chapter) => chapter.unFinishCount === 0);
    },
    getChapterInfos() {
      return Array.from((top == null ? void 0 : top.document.querySelectorAll('[onclick^="getTeacherAjax"]')) || []).map((el) => {
        var _a, _b, _c;
        return {
          chapterId: (_b = (_a = el.getAttribute("onclick")) == null ? void 0 : _a.match(/\('(.*)','(.*)','(.*)'\)/)) == null ? void 0 : _b[3],
          unFinishCount: parseInt(((_c = el.parentElement.querySelector(".jobUnfinishCount")) == null ? void 0 : _c.value) || "0")
        };
      });
    },
    getSecretFont(doc2 = document) {
      return Array.from(doc2.querySelectorAll(".font-cxsecret")).map((font) => {
        const after = font.querySelector(".after");
        return after === null ? font : after;
      });
    }
  };
  async function study$2() {
    var _a;
    logger("debug", "\u5373\u5C06\u5F00\u59CB");
    const { cx: setting } = useSettings();
    const tasks = searchTask(setting.study);
    for (const task of tasks) {
      try {
        await sleep(3e3);
        await task();
      } catch (e) {
        logger("error", "\u672A\u77E5\u9519\u8BEF:", e);
      }
    }
    const { next } = domSearch({ next: '.next[onclick^="PCount.next"]' }, top == null ? void 0 : top.document);
    if (next !== null && next.style.display === "block") {
      if (CXAnalyses.isInFinalTab()) {
        if (CXAnalyses.isStuckInBreakingMode()) {
          message("warn", "\u68C0\u6D4B\u5230\u6B64\u7AE0\u8282\u91CD\u590D\u8FDB\u5165, \u4E3A\u4E86\u907F\u514D\u65E0\u9650\u91CD\u590D, \u8BF7\u81EA\u884C\u624B\u52A8\u5B8C\u6210\u540E\u624B\u52A8\u70B9\u51FB\u4E0B\u4E00\u7AE0, \u6216\u8005\u5237\u65B0\u91CD\u8BD5\u3002");
          return;
        }
      }
      logger("debug", "\u5B8C\u6210, \u5373\u5C06\u8DF3\u8F6C, \u5982\u5361\u6B7B\u8BF7\u81EA\u884C\u70B9\u51FB\u4E0B\u4E00\u7AE0\u3002");
      await sleep(3e3);
      next.click();
      await sleep(3e3);
      (_a = domSearch({ confirm: ".jobFinishTip .nextChapter" }, top == null ? void 0 : top.document).confirm) == null ? void 0 : _a.click();
    } else {
      if (CXAnalyses.isInFinalChapter()) {
        if (CXAnalyses.isFinishedAllChapters()) {
          message("success", "\u5168\u90E8\u4EFB\u52A1\u70B9\u5DF2\u5B8C\u6210\uFF01");
        } else {
          message("warn", "\u5DF2\u7ECF\u62B5\u8FBE\u6700\u540E\u4E00\u4E2A\u7AE0\u8282\uFF01\u4F46\u4ECD\u7136\u6709\u4EFB\u52A1\u70B9\u672A\u5B8C\u6210\uFF0C\u8BF7\u624B\u52A8\u5207\u6362\u81F3\u672A\u5B8C\u6210\u7684\u7AE0\u8282\u3002");
        }
      } else {
        message("error", "\u4E0B\u4E00\u7AE0\u6309\u94AE\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5C1D\u8BD5\u5237\u65B0\u6216\u8005\u624B\u52A8\u5207\u6362\u4E0B\u4E00\u7AE0\u3002");
      }
    }
  }
  function searchTask(setting) {
    return searchIFrame(document).map((frame) => {
      const { media, read, chapterTest } = domSearch({
        media: "video,audio",
        chapterTest: ".TiMu",
        read: "#img.imglook"
      }, frame.contentDocument || document);
      function getJob() {
        return media ? mediaTask(setting, media, frame) : read ? readTask(frame) : chapterTest ? chapterTestTask(frame) : void 0;
      }
      if (media || read || chapterTest) {
        return () => {
          var _a, _b, _c, _d, _e;
          let _parent = frame.contentWindow;
          let jobIndex = getNumber((_a = frame.contentWindow) == null ? void 0 : _a._jobindex, _parent._jobindex);
          while (_parent) {
            jobIndex = getNumber(jobIndex, (_b = frame.contentWindow) == null ? void 0 : _b._jobindex, _parent._jobindex);
            const attachments = ((_c = _parent == null ? void 0 : _parent.JC) == null ? void 0 : _c.attachments) || _parent.attachments;
            if (attachments && typeof jobIndex === "number") {
              const { name: name2, title, bookname, author: author2 } = ((_d = attachments[jobIndex]) == null ? void 0 : _d.property) || {};
              const jobName = name2 || title || (bookname ? bookname + author2 : void 0) || "\u672A\u77E5\u4EFB\u52A1";
              if (setting.restudy && !chapterTest) {
                logger("debug", jobName, "\u5373\u5C06\u91CD\u65B0\u5B66\u4E60\u3002");
                return getJob();
              } else if (((_e = attachments[jobIndex]) == null ? void 0 : _e.job) === true) {
                logger("debug", jobName, "\u5373\u5C06\u5F00\u59CB\u3002");
                return getJob();
              } else if (chapterTest && setting.forceWork) {
                logger("debug", jobName, "\u5F00\u542F\u5F3A\u5236\u7B54\u9898\u3002");
                return getJob();
              } else {
                logger("debug", jobName, "\u5DF2\u7ECF\u5B8C\u6210\uFF0C\u5373\u5C06\u8DF3\u8FC7\u3002");
                break;
              }
            }
            if (_parent.parent === _parent) {
              break;
            }
            _parent = _parent.parent;
          }
        };
      } else {
        return void 0;
      }
    }).filter((f) => f);
  }
  function fixedVideoProgress$2(fixed) {
    const videojs2 = useContext().cx.videojs;
    if (videojs2) {
      const { bar } = domSearch({ bar: ".vjs-control-bar" }, videojs2);
      if (bar) {
        bar.style.opacity = fixed ? "1" : "0";
      }
    }
  }
  function switchPlayLine(setting, videojs2, media, line) {
    if (setting.line === "\u9ED8\u8BA4\u8DEF\u7EBF") {
      logger("debug", "\u5F53\u524D\u64AD\u653E\u8DEF\u7EBF\u4E3A: \u9ED8\u8BA4\u8DEF\u7EBF\uFF0C\u5982\u89C9\u5F97\u89C6\u9891\u5361\u987F\uFF0C\u8BF7\u5C1D\u8BD5\u5207\u6362\u5176\u4ED6\u8DEF\u7EBF\u3002");
    } else {
      const { playbackRate = 1 } = setting;
      if (videojs2 == null ? void 0 : videojs2.player) {
        let selectLine = function(line2) {
          var _a;
          for (const menu of menus) {
            if ((_a = menu.textContent) == null ? void 0 : _a.includes(line2)) {
              menu.click();
              setting.line = line2;
              setTimeout(() => media.playbackRate = playbackRate, 3e3);
              break;
            }
          }
        };
        const playlines = Array.from(videojs2.player.controlBar.options_.playerOptions.playlines);
        const menus = Array.from(videojs2.player.controlBar.videoJsPlayLine.querySelectorAll("ul li"));
        setting.playlines = ["\u9ED8\u8BA4\u8DEF\u7EBF"].concat(playlines.map((line2) => line2.label));
        logger("debug", "\u5207\u6362\u8DEF\u7EBF\u4E2D\uFF1A " + line);
        selectLine(line);
      }
    }
  }
  function mediaTask(setting, media, frame) {
    const { playbackRate = 1, volume = 0 } = setting;
    const { videojs: videojs2 } = domSearch({ videojs: "#video,#audio" }, frame.contentDocument || document);
    if (!videojs2) {
      message("error", "\u89C6\u9891\u68C0\u6D4B\u4E0D\u5230\uFF0C\u8BF7\u5C1D\u8BD5\u5237\u65B0\u6216\u8005\u624B\u52A8\u5207\u6362\u4E0B\u4E00\u7AE0\u3002");
      return;
    }
    const ctx = useContext();
    ctx.cx.videojs = videojs2;
    ctx.common.currentMedia = media;
    if (videojs2 && setting.line) {
      setTimeout(() => switchPlayLine(setting, videojs2, media, setting.line), 3e3);
    }
    fixedVideoProgress$2(setting.showProgress);
    return new Promise((resolve2) => {
      if (media) {
        media.volume = volume;
        media.play();
        media.playbackRate = playbackRate;
        async function playFunction() {
          if (!media.ended && !media.__played__) {
            await sleep(1e3);
            media.play();
          } else {
            media.__played__ = true;
            logger("info", "\u89C6\u9891\u64AD\u653E\u5B8C\u6BD5");
            media.removeEventListener("pause", playFunction);
          }
        }
        media.addEventListener("pause", playFunction);
        media.addEventListener("ended", () => resolve2());
      }
    });
  }
  async function readTask(frame) {
    var _a;
    const finishJob = (_a = frame == null ? void 0 : frame.contentWindow) == null ? void 0 : _a.finishJob;
    if (finishJob)
      finishJob();
    await sleep(3e3);
  }
  async function chapterTestTask(frame) {
    const { period, timeout, retry, waitForCheck } = useSettings().cx.work;
    const { answererWrappers } = useSettings().common;
    const { study: study2 } = useSettings().cx;
    const local = useStore("localStorage");
    if (study2.upload === "close") {
      logger("warn", "\u81EA\u52A8\u7B54\u9898\u5DF2\u88AB\u5173\u95ED\uFF01");
    } else if (answererWrappers.length === 0) {
      logger("warn", "\u9898\u5E93\u914D\u7F6E\u4E3A\u7A7A\uFF0C\u8BF7\u8BBE\u7F6E\u3002");
    } else if (!frame.contentWindow) {
      logger("warn", "\u5143\u7D20\u4E0D\u53EF\u8BBF\u95EE");
    } else {
      logger("info", "\u5F00\u59CB\u81EA\u52A8\u7B54\u9898");
      await waitForRecognize("cx");
      const { window: frameWindow } = frame.contentWindow;
      const { TiMu } = domSearchAll({ TiMu: ".TiMu" }, frameWindow.document);
      local.workResults = [];
      const worker = new OCSWorker({
        root: TiMu,
        elements: {
          title: ".Zy_TItle .clearfix",
          options: "ul li .after,ul li textarea,ul textarea,ul li label:not(.before)",
          type: 'input[id^="answertype"]'
        },
        answerer: (elements, type, ctx) => {
          const title = StringUtils.nowrap(elements.title[0].textContent || elements.title[0].innerText).trim().replace(/\(..题, .+?分\)/, "").replace(/[[|(|【|（]..题[\]|)|】|）]/, "").replace(/^\d+\.?/, "").trim();
          if (title) {
            return defaultAnswerWrapperHandler(answererWrappers, { type, title, root: ctx.root });
          } else {
            throw new Error("\u9898\u76EE\u4E3A\u7A7A\uFF0C\u8BF7\u67E5\u770B\u9898\u76EE\u662F\u5426\u4E3A\u7A7A\uFF0C\u6216\u8005\u5FFD\u7565\u6B64\u9898");
          }
        },
        work: {
          type({ elements }) {
            var _a;
            const typeInput = elements.type[0];
            const type = parseInt(typeInput.value);
            return type === 0 ? "single" : type === 1 ? "multiple" : type === 2 ? "completion" : type === 3 ? "judgement" : elements.options[0].tagName === "TEXTAREA" || elements.options[0].querySelector("textarea") || ((_a = elements.options[0].parentElement) == null ? void 0 : _a.querySelector("textarea")) ? "completion" : void 0;
          },
          handler(type, answer, option) {
            var _a, _b, _c, _d, _e, _f;
            if (type === "judgement" || type === "single" || type === "multiple") {
              if (!((_b = (_a = option.parentElement) == null ? void 0 : _a.querySelector("input")) == null ? void 0 : _b.checked)) {
                (_d = (_c = option.parentElement) == null ? void 0 : _c.querySelector("a,label")) == null ? void 0 : _d.click();
              }
            } else if (type === "completion" && answer.trim()) {
              const textarea = (_e = option.parentElement) == null ? void 0 : _e.querySelector("textarea");
              const textareaFrame = (_f = option.parentElement) == null ? void 0 : _f.querySelector("iframe");
              if (textarea) {
                textarea.value = answer;
              }
              if (textareaFrame == null ? void 0 : textareaFrame.contentDocument) {
                textareaFrame.contentDocument.body.innerHTML = answer;
              }
            }
          }
        },
        onElementSearched(elements) {
          elements.title = elements.title.map(elementToRawObject);
          const typeInput = elements.type[0];
          const type = parseInt(typeInput.value);
          if (type === 3) {
            elements.options.forEach((option) => {
              const ri = option.querySelector(".ri");
              const span = document.createElement("span");
              span.innerText = ri ? "\u221A" : "\xD7";
              option.appendChild(span);
            });
          }
        },
        onResult: async (res) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (res.ctx) {
            local.workResults.push(res);
          }
          const randomWork = study2.randomWork;
          if (!((_a = res.result) == null ? void 0 : _a.finish) && randomWork.enable) {
            const options = ((_c = (_b = res.ctx) == null ? void 0 : _b.elements) == null ? void 0 : _c.options) || [];
            const type = res.type;
            if (randomWork.choice && (type === "judgement" || type === "single" || type === "multiple")) {
              const option = options[Math.floor(Math.random() * options.length)];
              (_e = (_d = option.parentElement) == null ? void 0 : _d.querySelector("a,label")) == null ? void 0 : _e.click();
            } else if (randomWork.complete && type === "completion") {
              for (const option of options) {
                const textarea = (_f = option.parentElement) == null ? void 0 : _f.querySelector("textarea");
                const completeTexts = randomWork.completeTexts.filter(Boolean);
                const text = completeTexts[Math.floor(Math.random() * completeTexts.length)];
                const textareaFrame = (_g = option.parentElement) == null ? void 0 : _g.querySelector("iframe");
                if (textarea) {
                  textarea.value = text;
                }
                if (textareaFrame == null ? void 0 : textareaFrame.contentDocument) {
                  textareaFrame.contentDocument.body.innerHTML = text;
                }
                await sleep(500);
              }
            }
            logger("info", "\u6B63\u5728\u968F\u673A\u4F5C\u7B54");
          } else {
            logger("info", "\u7B54\u9898", ((_h = res.result) == null ? void 0 : _h.finish) ? "\u5B8C\u6210" : "\u672A\u5B8C\u6210");
          }
        },
        period: (period || 3) * 1e3,
        timeout: (timeout || 30) * 1e3,
        retry,
        stopWhenError: false
      });
      const results = await worker.doWork();
      logger("info", "\u505A\u9898\u5B8C\u6BD5", results);
      await worker.uploadHandler({
        uploadRate: study2.upload,
        results,
        async callback(finishedRate, uploadable) {
          const name2 = study2.upload === "force" ? "\u5F3A\u5236\u63D0\u4EA4" : "\u81EA\u52A8\u63D0\u4EA4";
          logger("info", "\u5B8C\u6210\u7387 : ", finishedRate, " , ", uploadable ? "5\u79D2\u540E\u5C06" + name2 : " 5\u79D2\u540E\u5C06\u81EA\u52A8\u4FDD\u5B58");
          await sleep(5e3);
          if (uploadable) {
            frameWindow.btnBlueSubmit();
            await sleep(3e3);
            frameWindow.submitCheckTimes();
          } else {
            frameWindow.alert = () => {
            };
            frameWindow.noSubmit();
          }
        }
      });
    }
    if (waitForCheck) {
      logger("debug", `\u6B63\u5728\u7B49\u5F85\u7B54\u9898\u68C0\u67E5: \u4E00\u5171 ${waitForCheck} \u79D2`);
      await sleep(waitForCheck * 1e3);
    }
  }
  const StudySettingPanel$2 = defineComponent({
    setup() {
      const settings = useSettings().cx.study;
      const workSettings = useSettings().cx.work;
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode("label", null, [createTextVNode("\u89C6\u9891\u500D\u901F ")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u9AD8\u500D\u901F(\u5927\u4E8E1\u500D)\u53EF\u80FD\u5BFC\u81F4: \n- \u8BB0\u5F55\u6E05\u7A7A\n- \u9891\u7E41\u9A8C\u8BC1\u7801\n\u8D85\u661F\u540E\u53F0\u53EF\u4EE5\u770B\u5230\u5B66\u4E60\u65F6\u957F\n\u8BF7\u8C28\u614E\u8BBE\u7F6E\u2757\n\u5982\u679C\u8BBE\u7F6E\u540E\u65E0\u6548\u5219\u662F\u8D85\u661F\u4E0D\u5141\u8BB8\u4F7F\u7528\u500D\u901F\u3002"
      }, {
        default: () => [createVNode("input", {
          "type": "range",
          "value": settings.playbackRate,
          "min": "1",
          "max": "16",
          "step": "0.25",
          "onInput": (e) => {
            settings.playbackRate = e.target.valueAsNumber;
          }
        }, null)]
      }), createVNode("span", {
        "style": {
          color: settings.playbackRate > 2 ? "red" : ""
        }
      }, [settings.playbackRate.toFixed(2), createTextVNode("x")])]), createVNode("label", null, [createTextVNode("\u97F3\u91CF\u8C03\u8282")]), createVNode("div", null, [createVNode("input", {
        "type": "range",
        "min": "0",
        "max": "1",
        "step": "0.05",
        "value": settings.volume,
        "onInput": (e) => {
          settings.volume = e.target.valueAsNumber;
        }
      }, null), createVNode("span", null, [createTextVNode(" "), Math.round(settings.volume * 100), createTextVNode("% ")])]), createVNode("label", null, [createTextVNode("\u64AD\u653E\u8DEF\u7EBF")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u5982\u679C\u5F53\u524D\u89C6\u9891\u5361\u987F\u4E25\u91CD\uFF0C\u53EF\u4EE5\u5C1D\u8BD5\u5207\u6362\u8DEF\u7EBF\u3002"
      }, {
        default: () => [createVNode("select", {
          "id": "video-line",
          "value": settings.line || "\u9ED8\u8BA4\u8DEF\u7EBF",
          "onChange": (e) => {
            settings.line = e.target.value;
          }
        }, [settings.playlines.map((line) => createVNode("option", {
          "value": line
        }, [line]))])]
      })]), createVNode("label", null, [createTextVNode("\u663E\u793A\u89C6\u9891\u8FDB\u5EA6")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u56FA\u5B9A\u8FDB\u5EA6\u6761\uFF0C\u9632\u6B62\u8FDB\u5EA6\u6761\u6D88\u5931\u3002"
      }, {
        default: () => [createVNode("input", {
          "class": "input-switch",
          "type": "checkbox",
          "checked": settings.showProgress,
          "onChange": (e) => {
            settings.showProgress = e.target.checked;
            fixedVideoProgress$2(e.target.checked);
          }
        }, null)]
      })]), createVNode("label", null, [createTextVNode("\u590D\u4E60\u6A21\u5F0F")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u9047\u5230\u770B\u8FC7\u7684\u89C6\u9891,\u97F3\u9891,ppt\u4F1A\u91CD\u65B0\u64AD\u653E\uFF0C\u5E76\u4E14\u4ECE\u7B2C\u4E00\u4E2A\u7AE0\u8282\u5F00\u59CB\u3002"
      }, {
        default: () => [createVNode("input", {
          "class": "input-switch",
          "type": "checkbox",
          "checked": settings.restudy,
          "onChange": (e) => settings.restudy = e.target.checked
        }, null)]
      })]), createVNode("hr", null, null), createVNode("hr", null, null), createVNode(CommonWorkSettingPanel$1, {
        "settings": workSettings
      }, {
        upload: createVNode(WorkerSetting, {
          "label": "\u81EA\u52A8\u7B54\u9898",
          "config": {
            selected: settings.upload
          },
          "changeHandler": (e) => settings.upload = e.target.value
        }, null),
        extra: createVNode(Fragment, null, [createVNode("label", null, [createTextVNode("\u5F3A\u5236\u7B54\u9898")]), createVNode("div", null, [createVNode(Tooltip, {
          "title": "\u5F53\u7AE0\u8282\u6D4B\u8BD5\u4E0D\u662F\u4EFB\u52A1\u70B9\u65F6\uFF0C\u5F3A\u5236\u81EA\u52A8\u7B54\u9898\u3002\n(\u5DE6\u4E0A\u89D2\u6709\u9EC4\u70B9\u7684\u4EE3\u8868\u6B64\u5C0F\u8282\u662F\u4EFB\u52A1\u70B9)\n(\u4E00\u822C\u6765\u8BF4\u4E0D\u662F\u4EFB\u52A1\u70B9\u7684\u7AE0\u8282\u6D4B\u8BD5\u662F\u4E0D\u8BA1\u5206\u7684)"
        }, {
          default: () => [createVNode("input", {
            "class": "input-switch",
            "type": "checkbox",
            "checked": settings.forceWork,
            "onChange": (e) => settings.forceWork = e.target.checked
          }, null)]
        })]), createVNode("label", null, [createTextVNode("\u968F\u673A\u4F5C\u7B54")]), createVNode(Tooltip, {
          "title": "\u968F\u673A\u4F5C\u7B54 \u672A\u5B8C\u6210/\u672A\u5339\u914D \u7684\u9898\u76EE\uFF0C\u5F00\u542F\u540E\u53EF\u81EA\u5B9A\u4E49\u9009\u9879"
        }, {
          default: () => [createVNode("input", {
            "class": "input-switch",
            "type": "checkbox",
            "checked": settings.randomWork.enable,
            "onChange": (e) => settings.randomWork.enable = e.target.checked
          }, null)]
        }), settings.randomWork.enable && createVNode(Fragment, null, [createVNode("label", null, [createTextVNode("\u9009\u62E9\u968F\u673A")]), createVNode(Tooltip, {
          "title": "\u968F\u673A\u4F5C\u7B54 \u5355\u9009/\u591A\u9009/\u5224\u65AD \u9898"
        }, {
          default: () => [createVNode("input", {
            "class": "input-switch",
            "type": "checkbox",
            "checked": settings.randomWork.choice,
            "onChange": (e) => settings.randomWork.choice = e.target.checked
          }, null)]
        }), createVNode("label", null, [createTextVNode("\u586B\u7A7A\u968F\u673A")]), createVNode(Tooltip, {
          "title": "\u968F\u673A\u4F5C\u7B54\u586B\u7A7A\u9898"
        }, {
          default: () => [createVNode("input", {
            "class": "input-switch",
            "type": "checkbox",
            "checked": settings.randomWork.complete,
            "onChange": (e) => settings.randomWork.complete = e.target.checked
          }, null)]
        }), settings.randomWork.complete && createVNode(Fragment, null, [createVNode("label", null, [createTextVNode("\u586B\u7A7A\u968F\u673A\u6587\u6848")]), createVNode(Tooltip, {
          "title": "\u6BCF\u884C\u4E00\u4E2A\uFF0C\u968F\u673A\u586B\u5165"
        }, {
          default: () => [createVNode("textarea", {
            "value": settings.randomWork.completeTexts.map(String).filter((s) => s.trim().length > 0).join("\n"),
            "onInput": (e) => settings.randomWork.completeTexts = e.target.value.map(String).filter((s) => s.trim().length > 0).split("\n")
          }, null)]
        })])])])
      })])]);
    }
  });
  const WorkSettingPanel$1 = defineComponent({
    setup() {
      const settings = useSettings().cx.work;
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode(CommonWorkSettingPanel$1, {
        "settings": settings
      }, {
        upload: createVNode(WorkerSetting, {
          "label": "\u81EA\u52A8\u7B54\u9898",
          "config": {
            selected: settings.upload
          },
          "changeHandler": (e) => settings.upload = e.target.value
        }, null)
      })])]);
    }
  });
  const LiveSettingPanel = defineComponent({
    setup() {
      const settings = useSettings().cx.live;
      const ctx = useContext();
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode("label", null, [createTextVNode("\u89C6\u9891\u500D\u901F ")]), createVNode("div", null, [createVNode("input", {
        "type": "range",
        "value": settings.playbackRate,
        "min": "1",
        "max": "16",
        "step": "0.25",
        "onInput": (e) => {
          settings.playbackRate = e.target.valueAsNumber;
          if (ctx.common.currentMedia) {
            ctx.common.currentMedia.playbackRate = e.target.valueAsNumber;
          }
        }
      }, null), createVNode("span", {
        "style": {
          color: settings.playbackRate > 2 ? "red" : ""
        }
      }, [settings.playbackRate.toFixed(2), createTextVNode("x")])]), createVNode("label", null, [createTextVNode("\u97F3\u91CF\u8C03\u8282")]), createVNode("div", null, [createVNode("input", {
        "type": "range",
        "min": "0",
        "max": "1",
        "step": "0.05",
        "value": settings.volume,
        "onInput": (e) => {
          settings.volume = e.target.valueAsNumber;
          if (ctx.common.currentMedia)
            ctx.common.currentMedia.volume = e.target.valueAsNumber;
        }
      }, null), createVNode("span", null, [createTextVNode(" "), Math.round(settings.volume * 100), createTextVNode("% ")])]), createVNode("label", null, [createTextVNode("\u663E\u793A\u56DE\u653E\u8FDB\u5EA6")]), createVNode("div", null, [createVNode("input", {
        "class": "input-switch",
        "type": "checkbox",
        "checked": settings.showProgress,
        "onChange": (e) => {
          settings.showProgress = e.target.checked;
        }
      }, null)])])]);
    }
  });
  function rateHack() {
    try {
      hack();
      window.document.addEventListener("readystatechange", hack);
      window.addEventListener("load", hack);
    } catch (e) {
      console.error(e.message);
    }
  }
  function hack() {
    if (typeof videojs !== "undefined" && typeof Ext !== "undefined") {
      logger("debug", "\u500D\u901F\u7834\u89E3\u542F\u52A8");
      Ext.define("ans.VideoJs", {
        override: "ans.VideoJs",
        constructor: function(b) {
          b = b || {};
          const e = this;
          e.addEvents(["seekstart"]);
          e.mixins.observable.constructor.call(e, b);
          const c = videojs(b.videojs, e.params2VideoOpt(b.params), function() {
          });
          Ext.fly(b.videojs).on("contextmenu", function(f) {
            f.preventDefault();
          });
          Ext.fly(b.videojs).on("keydown", function(f) {
            if (f.keyCode === 32 || f.keyCode === 37 || f.keyCode === 39 || f.keyCode === 107) {
              f.preventDefault();
            }
          });
          if (c.videoJsResolutionSwitcher) {
            c.on("resolutionchange", function() {
              const g = c.currentResolution();
              const f = g.sources ? g.sources[0].res : false;
              Ext.setCookie("resolution", f);
            });
          }
        }
      });
    }
  }
  var md5$1 = { exports: {} };
  var crypt = { exports: {} };
  (function() {
    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
      rotl: function(n, b) {
        return n << b | n >>> 32 - b;
      },
      rotr: function(n, b) {
        return n << 32 - b | n >>> b;
      },
      endian: function(n) {
        if (n.constructor == Number) {
          return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
        }
        for (var i = 0; i < n.length; i++)
          n[i] = crypt$1.endian(n[i]);
        return n;
      },
      randomBytes: function(n) {
        for (var bytes = []; n > 0; n--)
          bytes.push(Math.floor(Math.random() * 256));
        return bytes;
      },
      bytesToWords: function(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
          words[b >>> 5] |= bytes[i] << 24 - b % 32;
        return words;
      },
      wordsToBytes: function(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
        return bytes;
      },
      bytesToHex: function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 15).toString(16));
        }
        return hex.join("");
      },
      hexToBytes: function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
      },
      bytesToBase64: function(bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          for (var j = 0; j < 4; j++)
            if (i * 8 + j * 6 <= bytes.length * 8)
              base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
            else
              base64.push("=");
        }
        return base64.join("");
      },
      base64ToBytes: function(base64) {
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
          if (imod4 == 0)
            continue;
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }
        return bytes;
      }
    };
    crypt.exports = crypt$1;
  })();
  var charenc = {
    utf8: {
      stringToBytes: function(str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },
    bin: {
      stringToBytes: function(str) {
        for (var bytes = [], i = 0; i < str.length; i++)
          bytes.push(str.charCodeAt(i) & 255);
        return bytes;
      },
      bytesToString: function(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
          str.push(String.fromCharCode(bytes[i]));
        return str.join("");
      }
    }
  };
  var charenc_1 = charenc;
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var isBuffer_1 = function(obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
  };
  function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  }
  function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
  }
  (function() {
    var crypt$1 = crypt.exports, utf8 = charenc_1.utf8, isBuffer2 = isBuffer_1, bin = charenc_1.bin, md52 = function(message2, options) {
      if (message2.constructor == String)
        if (options && options.encoding === "binary")
          message2 = bin.stringToBytes(message2);
        else
          message2 = utf8.stringToBytes(message2);
      else if (isBuffer2(message2))
        message2 = Array.prototype.slice.call(message2, 0);
      else if (!Array.isArray(message2) && message2.constructor !== Uint8Array)
        message2 = message2.toString();
      var m = crypt$1.bytesToWords(message2), l = message2.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
      for (var i = 0; i < m.length; i++) {
        m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
      }
      m[l >>> 5] |= 128 << l % 32;
      m[(l + 64 >>> 9 << 4) + 14] = l;
      var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
      for (var i = 0; i < m.length; i += 16) {
        var aa = a, bb = b, cc = c, dd = d;
        a = FF(a, b, c, d, m[i + 0], 7, -680876936);
        d = FF(d, a, b, c, m[i + 1], 12, -389564586);
        c = FF(c, d, a, b, m[i + 2], 17, 606105819);
        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i + 4], 7, -176418897);
        d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
        c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i + 7], 22, -45705983);
        a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
        d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i + 10], 17, -42063);
        b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
        a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
        d = FF(d, a, b, c, m[i + 13], 12, -40341101);
        c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
        b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
        a = GG(a, b, c, d, m[i + 1], 5, -165796510);
        d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
        c = GG(c, d, a, b, m[i + 11], 14, 643717713);
        b = GG(b, c, d, a, m[i + 0], 20, -373897302);
        a = GG(a, b, c, d, m[i + 5], 5, -701558691);
        d = GG(d, a, b, c, m[i + 10], 9, 38016083);
        c = GG(c, d, a, b, m[i + 15], 14, -660478335);
        b = GG(b, c, d, a, m[i + 4], 20, -405537848);
        a = GG(a, b, c, d, m[i + 9], 5, 568446438);
        d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
        c = GG(c, d, a, b, m[i + 3], 14, -187363961);
        b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
        a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
        d = GG(d, a, b, c, m[i + 2], 9, -51403784);
        c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
        b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
        a = HH(a, b, c, d, m[i + 5], 4, -378558);
        d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
        b = HH(b, c, d, a, m[i + 14], 23, -35309556);
        a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
        d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
        c = HH(c, d, a, b, m[i + 7], 16, -155497632);
        b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
        a = HH(a, b, c, d, m[i + 13], 4, 681279174);
        d = HH(d, a, b, c, m[i + 0], 11, -358537222);
        c = HH(c, d, a, b, m[i + 3], 16, -722521979);
        b = HH(b, c, d, a, m[i + 6], 23, 76029189);
        a = HH(a, b, c, d, m[i + 9], 4, -640364487);
        d = HH(d, a, b, c, m[i + 12], 11, -421815835);
        c = HH(c, d, a, b, m[i + 15], 16, 530742520);
        b = HH(b, c, d, a, m[i + 2], 23, -995338651);
        a = II(a, b, c, d, m[i + 0], 6, -198630844);
        d = II(d, a, b, c, m[i + 7], 10, 1126891415);
        c = II(c, d, a, b, m[i + 14], 15, -1416354905);
        b = II(b, c, d, a, m[i + 5], 21, -57434055);
        a = II(a, b, c, d, m[i + 12], 6, 1700485571);
        d = II(d, a, b, c, m[i + 3], 10, -1894986606);
        c = II(c, d, a, b, m[i + 10], 15, -1051523);
        b = II(b, c, d, a, m[i + 1], 21, -2054922799);
        a = II(a, b, c, d, m[i + 8], 6, 1873313359);
        d = II(d, a, b, c, m[i + 15], 10, -30611744);
        c = II(c, d, a, b, m[i + 6], 15, -1560198380);
        b = II(b, c, d, a, m[i + 13], 21, 1309151649);
        a = II(a, b, c, d, m[i + 4], 6, -145523070);
        d = II(d, a, b, c, m[i + 11], 10, -1120210379);
        c = II(c, d, a, b, m[i + 2], 15, 718787259);
        b = II(b, c, d, a, m[i + 9], 21, -343485551);
        a = a + aa >>> 0;
        b = b + bb >>> 0;
        c = c + cc >>> 0;
        d = d + dd >>> 0;
      }
      return crypt$1.endian([a, b, c, d]);
    };
    md52._ff = function(a, b, c, d, x, s, t) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._gg = function(a, b, c, d, x, s, t) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._hh = function(a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._ii = function(a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._blocksize = 16;
    md52._digestsize = 16;
    md5$1.exports = function(message2, options) {
      if (message2 === void 0 || message2 === null)
        throw new Error("Illegal argument " + message2);
      var digestbytes = crypt$1.wordsToBytes(md52(message2, options));
      return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt$1.bytesToHex(digestbytes);
    };
  })();
  var md5 = md5$1.exports;
  var Typr = {};
  Typr.parse = function(buff) {
    var bin = Typr._bin;
    var data = new Uint8Array(buff);
    var offset = 0;
    bin.readFixed(data, offset);
    offset += 4;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var tags = ["cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG "];
    var obj = { _data: data };
    var tabs = {};
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      var length = bin.readUint(data, offset);
      offset += 4;
      tabs[tag] = { offset: toffset, length };
    }
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (tabs[t])
        obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
    }
    return obj;
  };
  Typr._tabOffset = function(data, tab) {
    var bin = Typr._bin;
    var numTables = bin.readUshort(data, 4);
    var offset = 12;
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      if (tag == tab)
        return toffset;
    }
    return 0;
  };
  Typr._bin = { readFixed: function(data, o) {
    return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
  }, readF2dot14: function(data, o) {
    var num = Typr._bin.readShort(data, o);
    return num / 16384;
  }, readInt: function(buff, p2) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p2 + 3];
    a[1] = buff[p2 + 2];
    a[2] = buff[p2 + 1];
    a[3] = buff[p2];
    return Typr._bin.t.int32[0];
  }, readInt8: function(buff, p2) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p2];
    return Typr._bin.t.int8[0];
  }, readShort: function(buff, p2) {
    var a = Typr._bin.t.uint8;
    a[1] = buff[p2];
    a[0] = buff[p2 + 1];
    return Typr._bin.t.int16[0];
  }, readUshort: function(buff, p2) {
    return buff[p2] << 8 | buff[p2 + 1];
  }, readUshorts: function(buff, p2, len) {
    var arr = [];
    for (var i = 0; i < len; i++)
      arr.push(Typr._bin.readUshort(buff, p2 + i * 2));
    return arr;
  }, readUint: function(buff, p2) {
    var a = Typr._bin.t.uint8;
    a[3] = buff[p2];
    a[2] = buff[p2 + 1];
    a[1] = buff[p2 + 2];
    a[0] = buff[p2 + 3];
    return Typr._bin.t.uint32[0];
  }, readUint64: function(buff, p2) {
    return Typr._bin.readUint(buff, p2) * (4294967295 + 1) + Typr._bin.readUint(buff, p2 + 4);
  }, readASCII: function(buff, p2, l) {
    var s = "";
    for (var i = 0; i < l; i++)
      s += String.fromCharCode(buff[p2 + i]);
    return s;
  }, readUnicode: function(buff, p2, l) {
    var s = "";
    for (var i = 0; i < l; i++) {
      var c = buff[p2++] << 8 | buff[p2++];
      s += String.fromCharCode(c);
    }
    return s;
  }, _tdec: window["TextDecoder"] ? new window["TextDecoder"]() : null, readUTF8: function(buff, p2, l) {
    var tdec = Typr._bin._tdec;
    if (tdec && p2 == 0 && l == buff.length)
      return tdec["decode"](buff);
    return Typr._bin.readASCII(buff, p2, l);
  }, readBytes: function(buff, p2, l) {
    var arr = [];
    for (var i = 0; i < l; i++)
      arr.push(buff[p2 + i]);
    return arr;
  }, readASCIIArray: function(buff, p2, l) {
    var s = [];
    for (var i = 0; i < l; i++)
      s.push(String.fromCharCode(buff[p2 + i]));
    return s;
  } };
  Typr._bin.t = { buff: new ArrayBuffer(8) };
  Typr._bin.t.int8 = new Int8Array(Typr._bin.t.buff);
  Typr._bin.t.uint8 = new Uint8Array(Typr._bin.t.buff);
  Typr._bin.t.int16 = new Int16Array(Typr._bin.t.buff);
  Typr._bin.t.uint16 = new Uint16Array(Typr._bin.t.buff);
  Typr._bin.t.int32 = new Int32Array(Typr._bin.t.buff);
  Typr._bin.t.uint32 = new Uint32Array(Typr._bin.t.buff);
  Typr._lctf = {};
  Typr._lctf.parse = function(data, offset, length, font, subt) {
    var bin = Typr._bin;
    var obj = {};
    var offset0 = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    offset += 2;
    obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
    obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
    obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
    return obj;
  };
  Typr._lctf.readLookupList = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  };
  Typr._lctf.readLookupTable = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = { tabs: [] };
    obj.ltype = bin.readUshort(data, offset);
    offset += 2;
    obj.flag = bin.readUshort(data, offset);
    offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, obj.ltype, offset0 + noff);
      obj.tabs.push(tab);
    }
    return obj;
  };
  Typr._lctf.numOfOnes = function(n) {
    var num = 0;
    for (var i = 0; i < 32; i++)
      if ((n >>> i & 1) != 0)
        num++;
    return num;
  };
  Typr._lctf.readClassDef = function(data, offset) {
    var bin = Typr._bin;
    var obj = [];
    var format = bin.readUshort(data, offset);
    offset += 2;
    if (format == 1) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++) {
        obj.push(startGlyph + i);
        obj.push(startGlyph + i);
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    if (format == 2) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    return obj;
  };
  Typr._lctf.getInterval = function(tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start2 = tab[i], end = tab[i + 1];
      tab[i + 2];
      if (start2 <= val && val <= end)
        return i;
    }
    return -1;
  };
  Typr._lctf.readValueRecord = function(data, offset, valFmt) {
    var bin = Typr._bin;
    var arr = [];
    arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 1 ? 2 : 0;
    arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 2 ? 2 : 0;
    arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 4 ? 2 : 0;
    arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 8 ? 2 : 0;
    return arr;
  };
  Typr._lctf.readCoverage = function(data, offset) {
    var bin = Typr._bin;
    var cvg = {};
    cvg.fmt = bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1)
      cvg.tab = bin.readUshorts(data, offset, count);
    if (cvg.fmt == 2)
      cvg.tab = bin.readUshorts(data, offset, count * 3);
    return cvg;
  };
  Typr._lctf.coverageIndex = function(cvg, val) {
    var tab = cvg.tab;
    if (cvg.fmt == 1)
      return tab.indexOf(val);
    if (cvg.fmt == 2) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (ind != -1)
        return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  };
  Typr._lctf.readFeatureList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj.push({ tag: tag.trim(), tab: Typr._lctf.readFeatureTable(data, offset0 + noff) });
    }
    return obj;
  };
  Typr._lctf.readFeatureTable = function(data, offset) {
    var bin = Typr._bin;
    bin.readUshort(data, offset);
    offset += 2;
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    var indices = [];
    for (var i = 0; i < lookupCount; i++)
      indices.push(bin.readUshort(data, offset + 2 * i));
    return indices;
  };
  Typr._lctf.readScriptList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  };
  Typr._lctf.readScriptTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = bin.readUshort(data, offset);
    offset += 2;
    obj.default = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  };
  Typr._lctf.readLangSysTable = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    obj.reqFeature = bin.readUshort(data, offset);
    offset += 2;
    var featureCount = bin.readUshort(data, offset);
    offset += 2;
    obj.features = bin.readUshorts(data, offset, featureCount);
    return obj;
  };
  Typr.CFF = {};
  Typr.CFF.parse = function(data, offset, length) {
    var bin = Typr._bin;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    var names = [];
    for (var i = 0; i < ninds.length - 1; i++)
      names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (var i = 0; i < tdinds.length - 1; i++)
      topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0];
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (var i = 0; i < sinds.length - 1; i++)
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    offset += sinds[sinds.length - 1];
    Typr.CFF.readSubrs(data, offset, topdict);
    if (topdict.CharStrings) {
      offset = topdict.CharStrings;
      var sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (var i = 0; i < sinds.length - 1; i++)
        cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    if (topdict.Encoding)
      topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
    if (topdict.charset)
      topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
    if (topdict.Private) {
      offset = topdict.Private[1];
      topdict.Private = Typr.CFF.readDict(data, offset, offset + topdict.Private[0]);
      if (topdict.Private.Subrs)
        Typr.CFF.readSubrs(data, offset + topdict.Private.Subrs, topdict.Private);
    }
    var obj = {};
    for (var p2 in topdict) {
      if (["FamilyName", "FullName", "Notice", "version", "Copyright"].indexOf(p2) != -1)
        obj[p2] = strings[topdict[p2] - 426 + 35];
      else
        obj[p2] = topdict[p2];
    }
    return obj;
  };
  Typr.CFF.readSubrs = function(data, offset, obj) {
    var bin = Typr._bin;
    var gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    if (nSubrs < 1240)
      bias = 107;
    else if (nSubrs < 33900)
      bias = 1131;
    else
      bias = 32768;
    obj.Bias = bias;
    obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++)
      obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  };
  Typr.CFF.tableSE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0];
  Typr.CFF.glyphByUnicode = function(cff, code) {
    for (var i = 0; i < cff.charset.length; i++)
      if (cff.charset[i] == code)
        return i;
    return -1;
  };
  Typr.CFF.glyphBySE = function(cff, charcode) {
    if (charcode < 0 || charcode > 255)
      return -1;
    return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  };
  Typr.CFF.readEncoding = function(data, offset, num) {
    Typr._bin;
    var array = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      var nCodes = data[offset];
      offset++;
      for (var i = 0; i < nCodes; i++)
        array.push(data[offset + i]);
    } else
      throw "error: unknown encoding format: " + format;
    return array;
  };
  Typr.CFF.readCharset = function(data, offset, num) {
    var bin = Typr._bin;
    var charset = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format == 1 || format == 2) {
      while (charset.length < num) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        if (format == 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (var i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else
      throw "error: format: " + format;
    return charset;
  };
  Typr.CFF.readIndex = function(data, offset, inds) {
    var bin = Typr._bin;
    var count = bin.readUshort(data, offset);
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1)
      for (var i = 0; i < count + 1; i++)
        inds.push(data[offset + i]);
    else if (offsize == 2)
      for (var i = 0; i < count + 1; i++)
        inds.push(bin.readUshort(data, offset + i * 2));
    else if (offsize == 3)
      for (var i = 0; i < count + 1; i++)
        inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
    else if (count != 0)
      throw "unsupported offset size: " + offsize + ", count: " + count;
    offset += (count + 1) * offsize;
    return offset - 1;
  };
  Typr.CFF.getCharString = function(data, offset, o) {
    var bin = Typr._bin;
    var b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2];
    data[offset + 3];
    data[offset + 4];
    var vs = 1;
    var op = null, val = null;
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }
    o.val = val != null ? val : "o" + op;
    o.size = vs;
  };
  Typr.CFF.readCharString = function(data, offset, length) {
    var end = offset + length;
    var bin = Typr._bin;
    var arr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var op = null, val = null;
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 == 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 == 19 || b0 == 20) {
        op = b0;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
      }
      arr.push(val != null ? val : "o" + op);
      offset += vs;
    }
    return arr;
  };
  Typr.CFF.readDict = function(data, offset, end) {
    var bin = Typr._bin;
    var dict = {};
    var carr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var key = null, val = null;
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 == 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
        throw "unknown number";
      }
      if (b0 == 30) {
        var nibs = [];
        vs = 1;
        while (true) {
          var b = data[offset + vs];
          vs++;
          var nib0 = b >> 4, nib1 = b & 15;
          if (nib0 != 15)
            nibs.push(nib0);
          if (nib1 != 15)
            nibs.push(nib1);
          if (nib1 == 15)
            break;
        }
        var s = "";
        var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
        for (var i = 0; i < nibs.length; i++)
          s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        var keys2 = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"];
        key = keys2[b0];
        vs = 1;
        if (b0 == 12) {
          var keys2 = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"];
          key = keys2[b1];
          vs = 2;
        }
      }
      if (key != null) {
        dict[key] = carr.length == 1 ? carr[0] : carr;
        carr = [];
      } else
        carr.push(val);
      offset += vs;
    }
    return dict;
  };
  Typr.cmap = {};
  Typr.cmap.parse = function(data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID;
      var tind = offs.indexOf(noffset);
      if (tind == -1) {
        tind = obj.tables.length;
        var subt;
        offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        if (format == 0)
          subt = Typr.cmap.parse0(data, noffset);
        else if (format == 4)
          subt = Typr.cmap.parse4(data, noffset);
        else if (format == 6)
          subt = Typr.cmap.parse6(data, noffset);
        else if (format == 12)
          subt = Typr.cmap.parse12(data, noffset);
        else
          console.log("unknown format: " + format, platformID, encodingID, noffset);
        obj.tables.push(subt);
      }
      if (obj[id] != null)
        throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  };
  Typr.cmap.parse0 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++)
      obj.map.push(data[offset + i]);
    return obj;
  };
  Typr.cmap.parse4 = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset);
    offset += 2;
    obj.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    obj.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    obj.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
      obj.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse6 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.firstCode = bin.readUshort(data, offset);
    offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse12 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    offset += 2;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + i * 12;
      var startCharCode = bin.readUint(data, off + 0);
      var endCharCode = bin.readUint(data, off + 4);
      var startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
  };
  Typr.glyf = {};
  Typr.glyf.parse = function(data, offset, length, font) {
    var obj = [];
    for (var g = 0; g < font.maxp.numGlyphs; g++)
      obj.push(null);
    return obj;
  };
  Typr.glyf._parseGlyf = function(font, g) {
    var bin = Typr._bin;
    var data = font._data;
    var offset = Typr._tabOffset(data, "glyf") + font.loca[g];
    if (font.loca[g] == font.loca[g + 1])
      return null;
    var gl = {};
    gl.noc = bin.readShort(data, offset);
    offset += 2;
    gl.xMin = bin.readShort(data, offset);
    offset += 2;
    gl.yMin = bin.readShort(data, offset);
    offset += 2;
    gl.xMax = bin.readShort(data, offset);
    offset += 2;
    gl.yMax = bin.readShort(data, offset);
    offset += 2;
    if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
      return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++) {
        gl.endPts.push(bin.readUshort(data, offset));
        offset += 2;
      }
      var instructionLength = bin.readUshort(data, offset);
      offset += 2;
      if (data.length - offset < instructionLength)
        return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength);
      offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (var i = 0; i < crdnum; i++) {
        var flag = data[offset];
        offset++;
        gl.flags.push(flag);
        if ((flag & 8) != 0) {
          var rep = data[offset];
          offset++;
          for (var j = 0; j < rep; j++) {
            gl.flags.push(flag);
            i++;
          }
        }
      }
      gl.xs = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
        if (i8) {
          gl.xs.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.xs.push(0);
          else {
            gl.xs.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      gl.ys = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
        if (i8) {
          gl.ys.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.ys.push(0);
          else {
            gl.ys.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      var x = 0, y = 0;
      for (var i = 0; i < crdnum; i++) {
        x += gl.xs[i];
        y += gl.ys[i];
        gl.xs[i] = x;
        gl.ys[i] = y;
      }
    } else {
      var ARG_1_AND_2_ARE_WORDS = 1 << 0;
      var ARGS_ARE_XY_VALUES = 1 << 1;
      var WE_HAVE_A_SCALE = 1 << 3;
      var MORE_COMPONENTS = 1 << 5;
      var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
      var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
      var WE_HAVE_INSTRUCTIONS = 1 << 8;
      gl.parts = [];
      var flags;
      do {
        flags = bin.readUshort(data, offset);
        offset += 2;
        var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
        gl.parts.push(part);
        part.glyphIndex = bin.readUshort(data, offset);
        offset += 2;
        if (flags & ARG_1_AND_2_ARE_WORDS) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          var arg1 = bin.readInt8(data, offset);
          offset++;
          var arg2 = bin.readInt8(data, offset);
          offset++;
        }
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1;
          part.m.ty = arg2;
        } else {
          part.p1 = arg1;
          part.p2 = arg2;
        }
        if (flags & WE_HAVE_A_SCALE) {
          part.m.a = part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.b = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.c = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        }
      } while (flags & MORE_COMPONENTS);
      if (flags & WE_HAVE_INSTRUCTIONS) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2;
        gl.instr = [];
        for (var i = 0; i < numInstr; i++) {
          gl.instr.push(data[offset]);
          offset++;
        }
      }
    }
    return gl;
  };
  Typr.GPOS = {};
  Typr.GPOS.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  };
  Typr.GPOS.subt = function(data, ltype, offset) {
    if (ltype != 2)
      return null;
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.format = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    tab.valFmt1 = bin.readUshort(data, offset);
    offset += 2;
    tab.valFmt2 = bin.readUshort(data, offset);
    offset += 2;
    var ones1 = Typr._lctf.numOfOnes(tab.valFmt1);
    var ones2 = Typr._lctf.numOfOnes(tab.valFmt2);
    if (tab.format == 1) {
      tab.pairsets = [];
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        var psoff = bin.readUshort(data, offset);
        offset += 2;
        psoff += offset0;
        var pvcount = bin.readUshort(data, psoff);
        psoff += 2;
        var arr = [];
        for (var j = 0; j < pvcount; j++) {
          var gid2 = bin.readUshort(data, psoff);
          psoff += 2;
          var value1, value2;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt1);
            psoff += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt2);
            psoff += ones2 * 2;
          }
          arr.push({ gid2, val1: value1, val2: value2 });
        }
        tab.pairsets.push(arr);
      }
    }
    if (tab.format == 2) {
      var classDef1 = bin.readUshort(data, offset);
      offset += 2;
      var classDef2 = bin.readUshort(data, offset);
      offset += 2;
      var class1Count = bin.readUshort(data, offset);
      offset += 2;
      var class2Count = bin.readUshort(data, offset);
      offset += 2;
      tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
      tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
      tab.matrix = [];
      for (var i = 0; i < class1Count; i++) {
        var row = [];
        for (var j = 0; j < class2Count; j++) {
          var value1 = null, value2 = null;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, offset, tab.valFmt1);
            offset += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, offset, tab.valFmt2);
            offset += ones2 * 2;
          }
          row.push({ val1: value1, val2: value2 });
        }
        tab.matrix.push(row);
      }
    }
    return tab;
  };
  Typr.GSUB = {};
  Typr.GSUB.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  };
  Typr.GSUB.subt = function(data, ltype, offset) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    if (ltype != 1 && ltype != 4 && ltype != 5)
      return null;
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    if (ltype == 1) {
      if (tab.fmt == 1) {
        tab.delta = bin.readShort(data, offset);
        offset += 2;
      } else if (tab.fmt == 2) {
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.newg = bin.readUshorts(data, offset, cnt);
        offset += tab.newg.length * 2;
      }
    } else if (ltype == 4) {
      tab.vals = [];
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2;
        tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (ltype == 5) {
      if (tab.fmt == 2) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2;
        tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2;
          tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      } else
        console.log("unknown table format", tab.fmt);
    }
    return tab;
  };
  Typr.GSUB.readSubClassSet = function(data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [];
    var cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readSubClassRule = function(data, offset) {
    var rUs = Typr._bin.readUshort, rule = {};
    var gcount = rUs(data, offset);
    offset += 2;
    var scount = rUs(data, offset);
    offset += 2;
    rule.input = [];
    for (var i = 0; i < gcount - 1; i++) {
      rule.input.push(rUs(data, offset));
      offset += 2;
    }
    rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
    return rule;
  };
  Typr.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
    var rUs = Typr._bin.readUshort;
    var out = [];
    for (var i = 0; i < cnt; i++) {
      out.push(rUs(data, offset), rUs(data, offset + 2));
      offset += 4;
    }
    return out;
  };
  Typr.GSUB.readChainSubClassSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readChainSubClassRule = function(data, offset) {
    var bin = Typr._bin, rule = {};
    var pps = ["backtrack", "input", "lookahead"];
    for (var pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      if (pi == 1)
        cnt--;
      rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
      offset += rule[pps[pi]].length * 2;
    }
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    rule.subst = bin.readUshorts(data, offset, cnt * 2);
    offset += rule.subst.length * 2;
    return rule;
  };
  Typr.GSUB.readLigatureSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readLigature = function(data, offset) {
    var bin = Typr._bin, lig = { chain: [] };
    lig.nglyph = bin.readUshort(data, offset);
    offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
      lig.chain.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return lig;
  };
  Typr.head = {};
  Typr.head.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    obj.flags = bin.readUshort(data, offset);
    offset += 2;
    obj.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    obj.created = bin.readUint64(data, offset);
    offset += 8;
    obj.modified = bin.readUint64(data, offset);
    offset += 8;
    obj.xMin = bin.readShort(data, offset);
    offset += 2;
    obj.yMin = bin.readShort(data, offset);
    offset += 2;
    obj.xMax = bin.readShort(data, offset);
    offset += 2;
    obj.yMax = bin.readShort(data, offset);
    offset += 2;
    obj.macStyle = bin.readUshort(data, offset);
    offset += 2;
    obj.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    obj.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    obj.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    obj.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hhea = {};
  Typr.hhea.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.ascender = bin.readShort(data, offset);
    offset += 2;
    obj.descender = bin.readShort(data, offset);
    offset += 2;
    obj.lineGap = bin.readShort(data, offset);
    offset += 2;
    obj.advanceWidthMax = bin.readUshort(data, offset);
    offset += 2;
    obj.minLeftSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.minRightSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.xMaxExtent = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRise = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRun = bin.readShort(data, offset);
    offset += 2;
    obj.caretOffset = bin.readShort(data, offset);
    offset += 2;
    offset += 4 * 2;
    obj.metricDataFormat = bin.readShort(data, offset);
    offset += 2;
    obj.numberOfHMetrics = bin.readUshort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hmtx = {};
  Typr.hmtx.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = bin.readUshort(data, offset);
        offset += 2;
        lsb = bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  };
  Typr.kern = {};
  Typr.kern.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var version2 = bin.readUshort(data, offset);
    offset += 2;
    if (version2 == 1)
      return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.parseV1 = function(data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset);
    offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      bin.readUint(data, offset);
      offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.readFormat0 = function(data, offset, map) {
    var bin = Typr._bin;
    var pleft = -1;
    var nPairs = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < nPairs; j++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2;
      if (left != pleft) {
        map.glyph1.push(left);
        map.rval.push({ glyph2: [], vals: [] });
      }
      var rval = map.rval[map.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  };
  Typr.loca = {};
  Typr.loca.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (ver == 1)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  };
  Typr.maxp = {};
  Typr.maxp.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    var ver = bin.readUint(data, offset);
    offset += 4;
    obj.numGlyphs = bin.readUshort(data, offset);
    offset += 2;
    if (ver == 65536) {
      obj.maxPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositePoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositeContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxZones = bin.readUshort(data, offset);
      offset += 2;
      obj.maxTwilightPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStorage = bin.readUshort(data, offset);
      offset += 2;
      obj.maxFunctionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxInstructionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStackElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxSizeOfInstructions = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentDepth = bin.readUshort(data, offset);
      offset += 2;
    }
    return obj;
  };
  Typr.name = {};
  Typr.name.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var plat = "p" + platformID;
      if (obj[plat] == null)
        obj[plat] = {};
      var names = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"];
      var cname = names[nameID];
      var soff = offset0 + count * 12 + noffset;
      var str;
      if (platformID == 0)
        str = bin.readUnicode(data, soff, length / 2);
      else if (platformID == 3 && encodingID == 0)
        str = bin.readUnicode(data, soff, length / 2);
      else if (encodingID == 0)
        str = bin.readASCII(data, soff, length);
      else if (encodingID == 1)
        str = bin.readUnicode(data, soff, length / 2);
      else if (encodingID == 3)
        str = bin.readUnicode(data, soff, length / 2);
      else if (platformID == 1) {
        str = bin.readASCII(data, soff, length);
        console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
      } else
        throw "unknown encoding " + encodingID + ", platformID: " + platformID;
      obj[plat][cname] = str;
      obj[plat]._lang = languageID;
    }
    for (var p2 in obj)
      if (obj[p2].postScriptName != null && obj[p2]._lang == 1033)
        return obj[p2];
    for (var p2 in obj)
      if (obj[p2].postScriptName != null && obj[p2]._lang == 3084)
        return obj[p2];
    for (var p2 in obj)
      if (obj[p2].postScriptName != null)
        return obj[p2];
    var tname;
    for (var p2 in obj) {
      tname = p2;
      break;
    }
    console.log("returning name table with languageID " + obj[tname]._lang);
    return obj[tname];
  };
  Typr["OS/2"] = {};
  Typr["OS/2"].parse = function(data, offset, length) {
    var bin = Typr._bin;
    var ver = bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0)
      Typr["OS/2"].version0(data, offset, obj);
    else if (ver == 1)
      Typr["OS/2"].version1(data, offset, obj);
    else if (ver == 2 || ver == 3 || ver == 4)
      Typr["OS/2"].version2(data, offset, obj);
    else if (ver == 5)
      Typr["OS/2"].version5(data, offset, obj);
    else
      throw "unknown OS/2 table version: " + ver;
    return obj;
  };
  Typr["OS/2"].version0 = function(data, offset, obj) {
    var bin = Typr._bin;
    obj.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    obj.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    obj.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    obj.fsType = bin.readUshort(data, offset);
    offset += 2;
    obj.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    obj.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    obj.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
    offset += 4;
    obj.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    obj.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    obj.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    obj.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version1 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version0(data, offset, obj);
    obj.ulCodePageRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = bin.readUint(data, offset);
    offset += 4;
    return offset;
  };
  Typr["OS/2"].version2 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version1(data, offset, obj);
    obj.sxHeight = bin.readShort(data, offset);
    offset += 2;
    obj.sCapHeight = bin.readShort(data, offset);
    offset += 2;
    obj.usDefault = bin.readUshort(data, offset);
    offset += 2;
    obj.usBreak = bin.readUshort(data, offset);
    offset += 2;
    obj.usMaxContext = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version5 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version2(data, offset, obj);
    obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr.post = {};
  Typr.post.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    obj.version = bin.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = bin.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = bin.readShort(data, offset);
    offset += 2;
    obj.underlineThickness = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.SVG = {};
  Typr.SVG.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = { entries: [] };
    var offset0 = offset;
    bin.readUshort(data, offset);
    offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      var svg = bin.readUTF8(sbuf, 0, sbuf.length);
      for (var f = startGlyphID; f <= endGlyphID; f++) {
        obj.entries[f] = svg;
      }
    }
    return obj;
  };
  Typr.SVG.toPath = function(str) {
    var pth = { cmds: [], crds: [] };
    if (str == null)
      return pth;
    var prsr = new DOMParser();
    var doc2 = prsr["parseFromString"](str, "image/svg+xml");
    var svg = doc2.firstChild;
    while (svg.tagName != "svg")
      svg = svg.nextSibling;
    var vb = svg.getAttribute("viewBox");
    if (vb)
      vb = vb.trim().split(" ").map(parseFloat);
    else
      vb = [0, 0, 1e3, 1e3];
    Typr.SVG._toPath(svg.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y = pth.crds[i + 1];
      x -= vb[0];
      y -= vb[1];
      y = -y;
      pth.crds[i] = x;
      pth.crds[i + 1] = y;
    }
    return pth;
  };
  Typr.SVG._toPath = function(nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName;
      var cfl = nd.getAttribute("fill");
      if (cfl == null)
        cfl = fill;
      if (tn == "g")
        Typr.SVG._toPath(nd.children, pth, cfl);
      else if (tn == "path") {
        pth.cmds.push(cfl ? cfl : "#000000");
        var d = nd.getAttribute("d");
        var toks = Typr.SVG._tokens(d);
        Typr.SVG._toksToPath(toks, pth);
        pth.cmds.push("X");
      } else if (tn == "defs")
        ;
      else
        console.log(tn, nd);
    }
  };
  Typr.SVG._tokens = function(d) {
    var ts = [], off = 0, rn = false, cn = "";
    while (off < d.length) {
      var cc = d.charCodeAt(off), ch = d.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
      if (rn) {
        if (ch == "-") {
          ts.push(parseFloat(cn));
          cn = ch;
        } else if (isNum)
          cn += ch;
        else {
          ts.push(parseFloat(cn));
          if (ch != "," && ch != " ")
            ts.push(ch);
          rn = false;
        }
      } else {
        if (isNum) {
          cn = ch;
          rn = true;
        } else if (ch != "," && ch != " ")
          ts.push(ch);
      }
    }
    if (rn)
      ts.push(parseFloat(cn));
    return ts;
  };
  Typr.SVG._toksToPath = function(ts, pth) {
    var i = 0, x = 0, y = 0, ox = 0, oy = 0;
    var pc = { M: 2, L: 2, H: 1, V: 1, S: 4, C: 6 };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
      var cmd = ts[i];
      i++;
      if (cmd == "z") {
        cmds.push("Z");
        x = ox;
        y = oy;
      } else {
        var cmu = cmd.toUpperCase();
        var ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps);
        for (var j = 0; j < reps; j++) {
          var xi = 0, yi = 0;
          if (cmd != cmu) {
            xi = x;
            yi = y;
          }
          if (cmu == "M") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("M");
            crds.push(x, y);
            ox = x;
            oy = y;
          } else if (cmu == "L") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "H") {
            x = xi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "V") {
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "C") {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else if (cmu == "S") {
            var co = Math.max(crds.length - 4, 0);
            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
            var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else
            console.log("Unknown SVG command " + cmd);
        }
      }
    }
  };
  Typr.SVG._reps = function(ts, off, ps) {
    var i = off;
    while (i < ts.length) {
      if (typeof ts[i] == "string")
        break;
      i += ps;
    }
    return (i - off) / ps;
  };
  if (Typr == null)
    Typr = {};
  if (Typr.U == null)
    Typr.U = {};
  Typr.U.codeToGlyph = function(font, code) {
    var cmap = font.cmap;
    var tind = -1;
    if (cmap.p0e4 != null)
      tind = cmap.p0e4;
    else if (cmap.p3e1 != null)
      tind = cmap.p3e1;
    else if (cmap.p1e0 != null)
      tind = cmap.p1e0;
    if (tind == -1)
      throw "no familiar platform and encoding!";
    var tab = cmap.tables[tind];
    if (tab.format == 0) {
      if (code >= tab.map.length)
        return 0;
      return tab.map[code];
    } else if (tab.format == 4) {
      var sind = -1;
      for (var i = 0; i < tab.endCount.length; i++)
        if (code <= tab.endCount[i]) {
          sind = i;
          break;
        }
      if (sind == -1)
        return 0;
      if (tab.startCount[sind] > code)
        return 0;
      var gli = 0;
      if (tab.idRangeOffset[sind] != 0)
        gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
      else
        gli = code + tab.idDelta[sind];
      return gli & 65535;
    } else if (tab.format == 12) {
      if (code > tab.groups[tab.groups.length - 1][1])
        return 0;
      for (var i = 0; i < tab.groups.length; i++) {
        var grp = tab.groups[i];
        if (grp[0] <= code && code <= grp[1])
          return grp[2] + (code - grp[0]);
      }
      return 0;
    } else
      throw "unknown cmap table format " + tab.format;
  };
  Typr.U.glyphToPath = function(font, gid) {
    var path = { cmds: [], crds: [] };
    if (font.SVG && font.SVG.entries[gid]) {
      var p2 = font.SVG.entries[gid];
      if (p2 == null)
        return path;
      if (typeof p2 == "string") {
        p2 = Typr.SVG.toPath(p2);
        font.SVG.entries[gid] = p2;
      }
      return p2;
    } else if (font.CFF) {
      var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state, font.CFF, path);
    } else if (font.glyf) {
      Typr.U._drawGlyf(gid, font, path);
    }
    return path;
  };
  Typr.U._drawGlyf = function(gid, font, path) {
    var gl = font.glyf[gid];
    if (gl == null)
      gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1)
        Typr.U._simpleGlyph(gl, path);
      else
        Typr.U._compoGlyph(gl, font, path);
    }
  };
  Typr.U._simpleGlyph = function(gl, p2) {
    for (var c = 0; c < gl.noc; c++) {
      var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
      var il = gl.endPts[c];
      for (var i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1;
        var nx = i == il ? i0 : i + 1;
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;
        var x = gl.xs[i], y = gl.ys[i];
        if (i == i0) {
          if (onCurve) {
            if (prOnCurve)
              Typr.U.P.moveTo(p2, gl.xs[pr], gl.ys[pr]);
            else {
              Typr.U.P.moveTo(p2, x, y);
              continue;
            }
          } else {
            if (prOnCurve)
              Typr.U.P.moveTo(p2, gl.xs[pr], gl.ys[pr]);
            else
              Typr.U.P.moveTo(p2, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
          }
        }
        if (onCurve) {
          if (prOnCurve)
            Typr.U.P.lineTo(p2, x, y);
        } else {
          if (nxOnCurve)
            Typr.U.P.qcurveTo(p2, x, y, gl.xs[nx], gl.ys[nx]);
          else
            Typr.U.P.qcurveTo(p2, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
        }
      }
      Typr.U.P.closePath(p2);
    }
  };
  Typr.U._compoGlyph = function(gl, font, p2) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = { cmds: [], crds: [] };
      var prt = gl.parts[j];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      var m = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p2.crds.push(x * m.a + y * m.b + m.tx);
        p2.crds.push(x * m.c + y * m.d + m.ty);
      }
      for (var i = 0; i < path.cmds.length; i++)
        p2.cmds.push(path.cmds[i]);
    }
  };
  Typr.U._getGlyphClass = function(g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return intr == -1 ? 0 : cd[intr + 2];
  };
  Typr.U.getPairAdjustment = function(font, g1, g2) {
    if (font.GPOS) {
      var ltab = null;
      for (var i = 0; i < font.GPOS.featureList.length; i++) {
        var fl = font.GPOS.featureList[i];
        if (fl.tag == "kern") {
          for (var j = 0; j < fl.tab.length; j++)
            if (font.GPOS.lookupList[fl.tab[j]].ltype == 2)
              ltab = font.GPOS.lookupList[fl.tab[j]];
        }
      }
      if (ltab) {
        for (var i = 0; i < ltab.tabs.length; i++) {
          var tab = ltab.tabs[i];
          var ind = Typr._lctf.coverageIndex(tab.coverage, g1);
          if (ind == -1)
            continue;
          var adj;
          if (tab.format == 1) {
            var right = tab.pairsets[ind];
            for (var j = 0; j < right.length; j++)
              if (right[j].gid2 == g2)
                adj = right[j];
            if (adj == null)
              continue;
          } else if (tab.format == 2) {
            var c1 = Typr.U._getGlyphClass(g1, tab.classDef1);
            var c2 = Typr.U._getGlyphClass(g2, tab.classDef2);
            var adj = tab.matrix[c1][c2];
          }
          return adj.val1[2];
        }
      }
    }
    if (font.kern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (ind1 != -1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (ind2 != -1)
          return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  };
  Typr.U.stringToGlyphs = function(font, str) {
    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc > 65535)
        i++;
      gls.push(Typr.U.codeToGlyph(font, cc));
    }
    var gsub = font["GSUB"];
    if (gsub == null)
      return gls;
    var llist = gsub.lookupList, flist = gsub.featureList;
    var wsep = '\n	" ,.:;!?()  \u060C';
    var R = "\u0622\u0623\u0624\u0625\u0627\u0629\u062F\u0630\u0631\u0632\u0648\u0671\u0672\u0673\u0675\u0676\u0677\u0688\u0689\u068A\u068B\u068C\u068D\u068E\u068F\u0690\u0691\u0692\u0693\u0694\u0695\u0696\u0697\u0698\u0699\u06C0\u06C3\u06C4\u06C5\u06C6\u06C7\u06C8\u06C9\u06CA\u06CB\u06CD\u06CF\u06D2\u06D3\u06D5\u06EE\u06EF\u0710\u0715\u0716\u0717\u0718\u0719\u071E\u0728\u072A\u072C\u072F\u074D\u0759\u075A\u075B\u076B\u076C\u0771\u0773\u0774\u0778\u0779\u0840\u0846\u0847\u0849\u0854\u0867\u0869\u086A\u08AA\u08AB\u08AC\u08AE\u08B1\u08B2\u08B9\u0AC5\u0AC7\u0AC9\u0ACA\u0ACE\u0ACF\u0AD0\u0AD1\u0AD2\u0ADD\u0AE1\u0AE4\u0AEF\u0B81\u0B83\u0B84\u0B85\u0B89\u0B8C\u0B8E\u0B8F\u0B91\u0BA9\u0BAA\u0BAB\u0BAC";
    var L = "\uA872\u0ACD\u0AD7";
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
      var srgt = ci == gls.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
      if (!slft && R.indexOf(str[ci - 1]) != -1)
        slft = true;
      if (!srgt && R.indexOf(str[ci]) != -1)
        srgt = true;
      if (!srgt && L.indexOf(str[ci + 1]) != -1)
        srgt = true;
      if (!slft && L.indexOf(str[ci]) != -1)
        slft = true;
      var feat = null;
      if (slft)
        feat = srgt ? "isol" : "init";
      else
        feat = srgt ? "fina" : "medi";
      for (var fi = 0; fi < flist.length; fi++) {
        if (flist[fi].tag != feat)
          continue;
        for (var ti = 0; ti < flist[fi].tab.length; ti++) {
          var tab = llist[flist[fi].tab[ti]];
          if (tab.ltype != 1)
            continue;
          Typr.U._applyType1(gls, ci, tab);
        }
      }
    }
    var cligs = ["rlig", "liga", "mset"];
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var rlim = Math.min(3, gls.length - ci - 1);
      for (var fi = 0; fi < flist.length; fi++) {
        var fl = flist[fi];
        if (cligs.indexOf(fl.tag) == -1)
          continue;
        for (var ti = 0; ti < fl.tab.length; ti++) {
          var tab = llist[fl.tab[ti]];
          for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null)
              continue;
            var ind = Typr._lctf.coverageIndex(tab.tabs[j].coverage, gl);
            if (ind == -1)
              continue;
            if (tab.ltype == 4) {
              var vals = tab.tabs[j].vals[ind];
              for (var k = 0; k < vals.length; k++) {
                var lig = vals[k], rl = lig.chain.length;
                if (rl > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < rl; l++)
                  if (lig.chain[l] != gls[ci + (1 + l)])
                    good = false;
                if (!good)
                  continue;
                gls[ci] = lig.nglyph;
                for (var l = 0; l < rl; l++)
                  gls[ci + l + 1] = -1;
              }
            } else if (tab.ltype == 5) {
              var ltab = tab.tabs[j];
              if (ltab.fmt != 2)
                continue;
              var cind = Typr._lctf.getInterval(ltab.cDef, gl);
              var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
              for (var i = 0; i < scs.length; i++) {
                var sc = scs[i], inp = sc.input;
                if (inp.length > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < inp.length; l++) {
                  var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                  if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                    good = false;
                    break;
                  }
                }
                if (!good)
                  continue;
                var lrs = sc.substLookupRecords;
                for (var k = 0; k < lrs.length; k += 2) {
                  lrs[k];
                  lrs[k + 1];
                }
              }
            }
          }
        }
      }
    }
    return gls;
  };
  Typr.U._applyType1 = function(gls, ci, tab) {
    var gl = gls[ci];
    for (var j = 0; j < tab.tabs.length; j++) {
      var ttab = tab.tabs[j];
      var ind = Typr._lctf.coverageIndex(ttab.coverage, gl);
      if (ind == -1)
        continue;
      if (ttab.fmt == 1)
        gls[ci] = gls[ci] + ttab.delta;
      else
        gls[ci] = ttab.newg[ind];
    }
  };
  Typr.U.glyphsToPath = function(font, gls, clr) {
    var tpath = { cmds: [], crds: [] };
    var x = 0;
    for (var i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (gid == -1)
        continue;
      var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
      var path = Typr.U.glyphToPath(font, gid);
      for (var j = 0; j < path.crds.length; j += 2) {
        tpath.crds.push(path.crds[j] + x);
        tpath.crds.push(path.crds[j + 1]);
      }
      if (clr)
        tpath.cmds.push(clr);
      for (var j = 0; j < path.cmds.length; j++)
        tpath.cmds.push(path.cmds[j]);
      if (clr)
        tpath.cmds.push("X");
      x += font.hmtx.aWidth[gid];
      if (i < gls.length - 1)
        x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
    return tpath;
  };
  Typr.U.pathToSVG = function(path, prec) {
    if (prec == null)
      prec = 5;
    var out = [], co = 0, lmap = { M: 2, L: 2, Q: 4, C: 6 };
    for (var i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      out.push(cmd);
      while (co < cn) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  };
  Typr.U.pathToContext = function(path, ctx) {
    var c = 0, crds = path.crds;
    for (var j = 0; j < path.cmds.length; j++) {
      var cmd = path.cmds[j];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      } else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      } else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      } else if (cmd == "Z") {
        ctx.closePath();
      } else if (cmd == "X") {
        ctx.fill();
      }
    }
  };
  Typr.U.P = {};
  Typr.U.P.moveTo = function(p2, x, y) {
    p2.cmds.push("M");
    p2.crds.push(x, y);
  };
  Typr.U.P.lineTo = function(p2, x, y) {
    p2.cmds.push("L");
    p2.crds.push(x, y);
  };
  Typr.U.P.curveTo = function(p2, a, b, c, d, e, f) {
    p2.cmds.push("C");
    p2.crds.push(a, b, c, d, e, f);
  };
  Typr.U.P.qcurveTo = function(p2, a, b, c, d) {
    p2.cmds.push("Q");
    p2.crds.push(a, b, c, d);
  };
  Typr.U.P.closePath = function(p2) {
    p2.cmds.push("Z");
  };
  Typr.U._drawCFF = function(cmds, state, font, p2) {
    var stack = state.stack;
    var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
    var i = 0;
    var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var o = { val: 0, size: 0 };
    while (i < cmds.length) {
      Typr.CFF.getCharString(cmds, i, o);
      var v = o.val;
      i += o.size;
      if (v == "o1" || v == "o18") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o3" || v == "o23") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        if (open)
          Typr.U.P.closePath(p2);
        y += stack.pop();
        Typr.U.P.moveTo(p2, x, y);
        open = true;
      } else if (v == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p2, x, y);
        }
      } else if (v == "o6" || v == "o7") {
        var count = stack.length;
        var isX = v == "o6";
        for (var j = 0; j < count; j++) {
          var sval = stack.shift();
          if (isX)
            x += sval;
          else
            y += sval;
          isX = !isX;
          Typr.U.P.lineTo(p2, x, y);
        }
      } else if (v == "o8" || v == "o24") {
        var count = stack.length;
        var index2 = 0;
        while (index2 + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, x, y);
          index2 += 6;
        }
        if (v == "o24") {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p2, x, y);
        }
      } else if (v == "o11")
        break;
      else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
        if (v == "o1234") {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = y;
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p2, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1235") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          y = c4y + stack.shift();
          stack.shift();
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p2, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1236") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p2, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1237") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
            x = c4x + stack.shift();
          } else {
            y = c4y + stack.shift();
          }
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p2, c3x, c3y, c4x, c4y, x, y);
        }
      } else if (v == "o14") {
        if (stack.length > 0 && !haveWidth) {
          width = stack.shift() + font.nominalWidthX;
          haveWidth = true;
        }
        if (stack.length == 4) {
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();
          var bind = Typr.CFF.glyphBySE(font, bchar);
          var aind = Typr.CFF.glyphBySE(font, achar);
          Typr.U._drawCFF(font.CharStrings[bind], state, font, p2);
          state.x = adx;
          state.y = ady;
          Typr.U._drawCFF(font.CharStrings[aind], state, font, p2);
        }
        if (open) {
          Typr.U.P.closePath(p2);
          open = false;
        }
      } else if (v == "o19" || v == "o20") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
        i += nStems + 7 >> 3;
      } else if (v == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        y += stack.pop();
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p2);
        Typr.U.P.moveTo(p2, x, y);
        open = true;
      } else if (v == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p2);
        Typr.U.P.moveTo(p2, x, y);
        open = true;
      } else if (v == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p2, x, y);
        }
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, x, y);
      } else if (v == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o27") {
        if (stack.length % 2) {
          y += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y;
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o10" || v == "o29") {
        var obj = v == "o10" ? font.Private : font;
        if (stack.length == 0) {
          console.log("error: empty stack");
        } else {
          var ind = stack.pop();
          var subr = obj.Subrs[ind + obj.Bias];
          state.x = x;
          state.y = y;
          state.nStems = nStems;
          state.haveWidth = haveWidth;
          state.width = width;
          state.open = open;
          Typr.U._drawCFF(subr, state, font, p2);
          x = state.x;
          y = state.y;
          nStems = state.nStems;
          haveWidth = state.haveWidth;
          width = state.width;
          open = state.open;
        }
      } else if (v == "o30" || v == "o31") {
        var count, count1 = stack.length;
        var index2 = 0;
        var alternate = v == "o31";
        count = count1 & ~2;
        index2 += count1 - count;
        while (index2 < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count - index2 == 5) {
              x = c2x + stack.shift();
              index2++;
            } else
              x = c2x;
            alternate = false;
          } else {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index2 == 5) {
              y = c2y + stack.shift();
              index2++;
            } else
              y = c2y;
            alternate = true;
          }
          Typr.U.P.curveTo(p2, c1x, c1y, c2x, c2y, x, y);
          index2 += 4;
        }
      } else if ((v + "").charAt(0) == "o") {
        console.log("Unknown operation: " + v, cmds);
        throw v;
      } else
        stack.push(v);
    }
    state.x = x;
    state.y = y;
    state.nStems = nStems;
    state.haveWidth = haveWidth;
    state.width = width;
    state.open = open;
  };
  var typr_js = Typr;
  async function mapRecognize() {
    var _a, _b;
    const { cx } = useContext();
    cx.isRecognizing = false;
    logger("debug", "\u6B63\u5728\u52A0\u8F7D\u5B57\u5178\u5E93...");
    const res = await request("https://cdn.ocsjs.com/resources/font/table.json", {
      type: "GM_xmlhttpRequest",
      method: "get",
      contentType: "json"
    });
    cx.fontMap = res;
    logger("info", "\u5B57\u5178\u5E93\u52A0\u8F7D\u6210\u529F");
    const fontFaceEl = Array.from(document.head.querySelectorAll("style")).find((style) => {
      var _a2;
      return (_a2 = style.textContent) == null ? void 0 : _a2.includes("font-cxsecret");
    });
    const fontMap = cx.fontMap;
    if (fontFaceEl) {
      const font = (_b = (_a = fontFaceEl.textContent) == null ? void 0 : _a.match(/base64,([\w\W]+?)'/)) == null ? void 0 : _b[1];
      if (font) {
        const code = typr_js.parse(base64ToUint8Array(font));
        const match = {};
        for (let i = 19968; i < 40870; i++) {
          const Glyph = typr_js.U.codeToGlyph(code, i);
          if (!Glyph)
            continue;
          const path = typr_js.U.glyphToPath(code, Glyph);
          const hex = md5(JSON.stringify(path)).slice(24);
          match[i.toString()] = fontMap[hex];
        }
        const fonts = CXAnalyses.getSecretFont();
        fonts.forEach((el, index2) => {
          let html = el.innerHTML;
          for (const key in match) {
            const word = String.fromCharCode(parseInt(key));
            const value = String.fromCharCode(match[key]);
            while (html.indexOf(word) !== -1) {
              html = html.replace(word, value);
            }
          }
          el.innerHTML = html;
          el.classList.remove("font-cxsecret");
        });
      }
    }
  }
  async function ocrRecognize() {
    const ocr = new OCR({
      langPath: "https://cdn.ocsjs.com/resources/tessdata",
      corePath: "https://cdn.ocsjs.com/resources/tesseract/tesseract-core.wasm.js",
      workerPath: "https://cdn.ocsjs.com/resources/tesseract/worker.min.js"
    });
    const { cx } = useContext();
    if (window === top) {
      cx.isRecognizing = false;
      logger("debug", "\u52A0\u8F7D\u6587\u5B57\u8BC6\u522B\u529F\u80FD, \u5982\u679C\u662F\u521D\u59CB\u5316\u8BF7\u8010\u5FC3\u7B49\u5F85..., \u5927\u7EA6\u9700\u8981\u4E0B\u8F7D20mb\u7684\u6570\u636E\u6587\u4EF6");
      await ocr.load();
      logger("info", "\u6587\u5B57\u8BC6\u522B\u529F\u80FD\u52A0\u8F7D\u6210\u529F");
    }
    const fonts = CXAnalyses.getSecretFont();
    if (fonts.length) {
      logger("info", "\u6587\u5B57\u8BC6\u522B\u529F\u80FD\u542F\u52A8");
      cx.isRecognizing = true;
      await ocr.load();
      for (let i = 0; i < fonts.length; i++) {
        try {
          const text = await ocr.recognize(OCR.suit(fonts[i]));
          fonts[i].innerText = text;
          OCR.unsuit(fonts[i]);
        } catch (e) {
          logger("error", "\u6587\u5B57\u8BC6\u522B\u529F\u80FD\u51FA\u9519,\u53EF\u80FD\u5B58\u5728\u56FE\u7247\u65E0\u6CD5\u8BC6\u522B\u3002", e);
          console.log("\u6587\u5B57\u8BC6\u522B\u9519\u8BEF", e);
        }
      }
      cx.isRecognizing = false;
      logger("info", "\u6587\u5B57\u8BC6\u522B\u5B8C\u6210");
    }
  }
  function base64ToUint8Array(base64) {
    const data = window.atob(base64);
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
      buffer[i] = data.charCodeAt(i);
    }
    return buffer;
  }
  async function workOrExam$1(type = "work") {
    const { period, timeout, retry, upload, waitForCheck } = useSettings().cx.work;
    const { answererWrappers } = useSettings().common;
    if (upload === "close" && type === "work") {
      logger("warn", "\u81EA\u52A8\u7B54\u9898\u5DF2\u88AB\u5173\u95ED\uFF01");
      message("warn", "\u81EA\u52A8\u7B54\u9898\u5DF2\u88AB\u5173\u95ED\uFF01\u8BF7\u5728\u8BBE\u7F6E\u5F00\u542F\u81EA\u52A8\u7B54\u9898\uFF01\u6216\u8005\u5FFD\u7565\u6B64\u8B66\u544A");
    } else if (answererWrappers.length === 0) {
      logger("warn", "\u9898\u5E93\u914D\u7F6E\u4E3A\u7A7A\uFF0C\u8BF7\u8BBE\u7F6E\u3002");
    } else {
      const local = useStore("localStorage");
      local.workResults = [];
      await waitForRecognize("cx");
      const worker = new OCSWorker({
        root: ".questionLi",
        elements: {
          title: "h3",
          options: ".answerBg .answer_p, .textDIV, .eidtDiv",
          type: type === "exam" ? 'input[name^="type"]' : 'input[id^="answertype"]'
        },
        answerer: (elements, type2, ctx) => {
          const title = StringUtils.nowrap(elements.title[0].textContent || elements.title[0].innerText).trim().replace(/\(..题, .+?分\)/, "").replace(/[[|(|【|（]..题[\]|)|】|）]/, "").replace(/^\d+\.?/, "").trim();
          if (title) {
            return defaultAnswerWrapperHandler(answererWrappers, { type: type2, title, root: ctx.root });
          } else {
            throw new Error("\u9898\u76EE\u4E3A\u7A7A\uFF0C\u8BF7\u67E5\u770B\u9898\u76EE\u662F\u5426\u4E3A\u7A7A\uFF0C\u6216\u8005\u5FFD\u7565\u6B64\u9898");
          }
        },
        work: {
          type({ elements }) {
            const typeInput = elements.type[0];
            const type2 = parseInt(typeInput.value);
            return type2 === 0 ? "single" : type2 === 1 ? "multiple" : type2 === 2 ? "completion" : type2 === 3 ? "judgement" : type2 === 4 ? "completion" : void 0;
          },
          handler(type2, answer, option) {
            var _a;
            if (type2 === "judgement" || type2 === "single" || type2 === "multiple") {
              if (((_a = option.parentElement) == null ? void 0 : _a.querySelector(".check_answer,.check_answer_dx")) === null) {
                option.click();
              }
            } else if (type2 === "completion" && answer.trim()) {
              const text = option.querySelector("textarea");
              const textareaFrame = option.querySelector("iframe");
              if (text) {
                text.value = answer;
              }
              if (textareaFrame == null ? void 0 : textareaFrame.contentDocument) {
                textareaFrame.contentDocument.body.innerHTML = answer;
              }
            }
          }
        },
        onElementSearched(elements) {
          elements.title = elements.title.map(elementToRawObject);
        },
        onResult: (res) => {
          var _a;
          if (res.ctx) {
            local.workResults.push(res);
          }
          console.log(res);
          logger("info", "\u9898\u76EE\u5B8C\u6210\u7ED3\u679C : ", ((_a = res.result) == null ? void 0 : _a.finish) ? "\u5B8C\u6210" : "\u672A\u5B8C\u6210");
        },
        period: (period || 3) * 1e3,
        timeout: (timeout || 30) * 1e3,
        retry,
        stopWhenError: false
      });
      const results = await worker.doWork();
      logger("info", "\u505A\u9898\u5B8C\u6BD5", results);
      if (type === "exam") {
        logger("info", "\u4E3A\u4E86\u5B89\u5168\u8003\u8651\uFF0C\u8BF7\u81EA\u884C\u68C0\u67E5\u540E\u81EA\u884C\u70B9\u51FB\u63D0\u4EA4\uFF01");
      } else {
        await worker.uploadHandler({
          uploadRate: upload,
          results,
          async callback(finishedRate, uploadable) {
            var _a;
            logger("info", "\u5B8C\u6210\u7387 : ", finishedRate, " , ", uploadable ? "5\u79D2\u540E\u5C06\u81EA\u52A8\u63D0\u4EA4" : "5\u79D2\u540E\u5C06\u81EA\u52A8\u4FDD\u5B58");
            await sleep(5e3);
            if (uploadable) {
              (_a = domSearch({ submit: ".completeBtn" }).submit) == null ? void 0 : _a.click();
              await sleep(2e3);
              submitWork();
            } else {
              saveWork();
            }
          }
        });
      }
    }
    if (waitForCheck) {
      logger("debug", `\u6B63\u5728\u7B49\u5F85\u7B54\u9898\u68C0\u67E5: \u4E00\u5171 ${waitForCheck} \u79D2`);
      await sleep(waitForCheck * 1e3);
    }
  }
  const updateURLs = [
    "**mooc2=0**",
    "**/mycourse/studentcourse**",
    "**/work/getAllWork**",
    "**/work/doHomeWorkNew**",
    "**/exam/test?**",
    "**exam/test/reVersionTestStartNew**examsystem**"
  ];
  const CXScript = defineScript({
    name: "\u8D85\u661F\u5B66\u4E60\u901A",
    routes: [
      {
        name: "\u7248\u672C\u5207\u6362\u811A\u672C",
        url: updateURLs,
        async onload() {
          if (top === window) {
            message("warn", "OCS\u7F51\u8BFE\u52A9\u624B\u4E0D\u652F\u6301\u65E7\u7248\u8D85\u661F, \u5373\u5C06\u5207\u6362\u5230\u8D85\u661F\u65B0\u7248, \u5982\u6709\u5176\u4ED6\u7B2C\u4E09\u65B9\u63D2\u4EF6\u8BF7\u5173\u95ED, \u53EF\u80FD\u6709\u517C\u5BB9\u95EE\u9898\u9891\u7E41\u9891\u7E41\u5207\u6362\u3002");
            await sleep(1e3);
            const experience = document.querySelector(".experience");
            if (experience) {
              experience.click();
            } else {
              const params = new URLSearchParams(window.location.href);
              params.set("mooc2", "1");
              params.set("newMooc", "true");
              params.delete("examsystem");
              window.location.replace(decodeURIComponent(params.toString()));
            }
          }
        }
      },
      {
        name: "\u5C4F\u853D\u500D\u901F\u9650\u5236",
        url: "**/ananas/modules/video/**",
        onstart() {
          console.log("\u5C4F\u853D\u500D\u901F\u9650\u5236\u542F\u52A8");
          rateHack();
        }
      },
      {
        name: "\u4EFB\u52A1\u5207\u6362\u811A\u672C",
        url: "**/mycourse/studentstudy**",
        onload() {
          const { restudy } = useSettings().cx.study;
          if (restudy) {
            logger("debug", "\u5F53\u524D\u4E3A\u590D\u4E60\u6A21\u5F0F\uFF0C\u5C06\u4F1A\u4ECE\u5F53\u524D\u7AE0\u8282\u5F80\u4E0B\u5B66\u4E60!");
          } else {
            const params = new URLSearchParams(window.location.href);
            const mooc = params.get("mooc2");
            if (mooc === null) {
              params.set("mooc2", "1");
              window.location.replace(decodeURIComponent(params.toString()));
              return;
            }
            let chapters = CXAnalyses.getChapterInfos();
            chapters = chapters.filter((chapter) => chapter.unFinishCount !== 0);
            if (chapters.length === 0) {
              logger("warn", "\u9875\u9762\u4EFB\u52A1\u70B9\u6570\u91CF\u4E3A\u7A7A! \u8BF7\u5237\u65B0\u91CD\u8BD5!");
            } else {
              const params2 = new URLSearchParams(window.location.href);
              const courseId = params2.get("courseId");
              const classId = params2.get("clazzid");
              setTimeout(() => {
                getTeacherAjax(courseId, classId, chapters[0].chapterId);
              }, 1e3);
            }
          }
        }
      },
      {
        name: "\u5B66\u4E60\u811A\u672C",
        url: "**/knowledge/cards**",
        async onload() {
          logger("info", "\u5F00\u59CB\u5B66\u4E60");
          await sleep(5e3);
          const settings = useSettings().cx.study;
          watch$1([() => settings.playbackRate, () => settings.volume], () => {
            const ctx = useContext();
            if (ctx.common.currentMedia) {
              ctx.common.currentMedia.playbackRate = settings.playbackRate;
              ctx.common.currentMedia.volume = settings.volume;
              if (ctx.cx.videojs && settings.line) {
                switchPlayLine(settings, ctx.cx.videojs, ctx.common.currentMedia, settings.line);
              }
            }
          });
          watch$1([() => settings.line], () => {
            const ctx = useContext();
            if (ctx.common.currentMedia && ctx.cx.videojs && settings.line) {
              switchPlayLine(settings, ctx.cx.videojs, ctx.common.currentMedia, settings.line);
            }
          });
          await study$2();
        }
      },
      {
        name: "\u9605\u8BFB\u811A\u672C",
        url: "**/readsvr/book/mooc**",
        onload() {
          console.log("\u9605\u8BFB\u811A\u672C\u542F\u52A8");
          setTimeout(() => {
            readweb.goto(epage);
          }, 5e3);
        }
      },
      {
        name: "\u4F5C\u4E1A\u811A\u672C",
        url: "**/mooc2/work/dowork**",
        async onload() {
          await sleep(5e3);
          const { common } = useSettings();
          if (common.answererWrappers.length === 0) {
            logger("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01");
            message("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01\u8BF7\u5728\u8BBE\u7F6E\u9762\u677F\u8BBE\u7F6E\u540E\u5237\u65B0\u91CD\u8BD5\uFF01");
          } else {
            await workOrExam$1("work");
          }
        }
      },
      {
        name: "\u6574\u5377\u9884\u89C8\u811A\u672C",
        url: "**/exam/test/reVersionTestStartNew**",
        async onload() {
          message("warn", "\u5373\u5C06\u81EA\u52A8\u5207\u6362\u5230\u6574\u5377\u9884\u89C8\u3002\u3002\u3002");
          await sleep(3e3);
          topreview();
        }
      },
      {
        name: "\u8003\u8BD5\u811A\u672C",
        url: "**/mooc2/exam/preview**",
        async onload() {
          await sleep(5e3);
          const { common } = useSettings();
          if (common.answererWrappers.length === 0) {
            logger("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01");
            message("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01\u8BF7\u5728\u8BBE\u7F6E\u9762\u677F\u8BBE\u7F6E\u540E\u5237\u65B0\u91CD\u8BD5\uFF01");
          } else {
            await workOrExam$1("exam");
          }
        }
      },
      {
        name: "\u5C4F\u853D\u4F5C\u4E1A\u8003\u8BD5\u586B\u7A7A\u7B80\u7B54\u9898\u7C98\u8D34\u9650\u5236",
        url: ["**/mooc2/exam/preview**", "**/mooc2/work/dowork**", "**/work/doHomeWorkNew/**"],
        onload() {
          try {
            const EDITORUI = $EDITORUI;
            for (const key in EDITORUI) {
              const ui = EDITORUI[key];
              if (ui.__proto__.uiName === "editor") {
                ui.editor.removeListener("beforepaste", editorPaste);
              }
            }
          } catch (e) {
            console.log("\u5C4F\u853D\u4F5C\u4E1A\u8003\u8BD5\u7C98\u8D34\u9650\u5236\u9519\u8BEF", e);
          }
        }
      },
      {
        name: "\u7E41\u4F53\u5B57\u8BC6\u522B\u811A\u672C",
        url: ["**/work/doHomeWorkNew**", "**/mooc2/exam/preview**", "**/mooc2/work/dowork**"],
        async onload() {
          const { recognize: recognize2 } = useSettings().cx.common;
          if (recognize2 === "map") {
            mapRecognize();
          } else if (recognize2 === "ocr") {
            ocrRecognize();
          } else {
            logger("debug", "\u7E41\u4F53\u5B57\u8BC6\u522B\u5DF2\u88AB\u5173\u95ED\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u7E41\u4F53\u5B57\u51FA\u73B0\u3002");
          }
        }
      },
      {
        name: "\u56FE\u7247\u8BC6\u522B\u811A\u672C",
        url: ["**/work/doHomeWorkNew**", "**/mooc2/exam/preview**", "**/mooc2/work/dowork**"],
        onload() {
          document.body.querySelectorAll("img").forEach((img) => {
            const div = document.createElement("div");
            div.style.display = "none";
            div.textContent = img.src;
            img.after(div);
          });
        }
      },
      {
        name: "\u76F4\u64AD\u56DE\u653E\u811A\u672C",
        url: "**zhibo.chaoxing.com**",
        async onload() {
          useUnsafeWindow().console.info = () => {
          };
          useUnsafeWindow().console.log = () => {
          };
          await sleep(5e3);
          const video = document.querySelector("video");
          const settings = useSettings().cx.live;
          if (video) {
            video.play();
            setLive(video, settings);
            watch$1(settings, () => {
              setLive(video, settings);
            });
          }
          function setLive(video2, settings2) {
            video2.volume = settings2.volume;
            video2.playbackRate = settings2.playbackRate;
            const { bar } = domSearch({ bar: ".vjs-control-bar" });
            if (bar) {
              bar.style.opacity = settings2.showProgress ? "1" : "0";
            }
          }
        }
      }
    ],
    panels: [
      {
        name: "\u7248\u672C\u5207\u6362\u52A9\u624B",
        url: updateURLs,
        el: () => createNote("\u5FC5\u987B\u5207\u6362\u5230\u6700\u65B0\u7248\u672C\u624D\u80FD\u4F7F\u7528\u6B64\u811A\u672C", "\u8BF7\u5BFB\u627E `\u4F53\u9A8C\u65B0\u7248` \u7684\u6309\u94AE, \u5E76\u70B9\u51FB\u3002")
      },
      {
        name: "\u8D85\u661F\u52A9\u624B",
        url: "**/space/index**",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u8BFE\u7A0B\u8FDB\u5165\u3002")
      },
      {
        name: "\u76F4\u64AD\u56DE\u653E\u5C0F\u52A9\u624B",
        url: "**zhibo.chaoxing.com**",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u8FDB\u5165\u76F4\u64AD\u8BBE\u7F6E\u8C03\u6574\u500D\u901F\u53CA\u97F3\u91CF"),
        children: [
          {
            name: "\u76F4\u64AD\u8BBE\u7F6E",
            el: () => LiveSettingPanel
          },
          createTerminalPanel()
        ]
      },
      {
        name: "\u5B66\u4E60\u52A9\u624B",
        url: "**/mycourse/**pageHeader=1**",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u7AE0\u8282\u8FDB\u5165\u5B66\u4E60\u3002")
      },
      {
        name: "\u4F5C\u4E1A\u52A9\u624B",
        url: "**/mycourse/**pageHeader=8**",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u4F5C\u4E1A\u8FDB\u5165\u3002")
      },
      {
        name: "\u8003\u8BD5\u52A9\u624B",
        url: "**/mycourse/**pageHeader=9**",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u8003\u8BD5\u8FDB\u5165\u3002")
      },
      {
        name: "\u5B66\u4E60\u52A9\u624B",
        url: "**/mycourse/studentstudy**",
        el: () => createNote("\u{1F4E2} \u8FDB\u5165\u8BBE\u7F6E\u9762\u677F\u53EF\u4EE5\u8C03\u6574\u5B66\u4E60\u8BBE\u7F6E", "\u7AE0\u8282\u680F\u4F60\u968F\u4FBF\u70B9, \u811A\u672C\u5361\u4E86\u7B97\u6211\u8F93\u3002", "5\u79D2\u540E\u5C06\u81EA\u52A8\u5F00\u59CB..."),
        children: [
          {
            name: "\u5B66\u4E60\u8BBE\u7F6E",
            el: () => StudySettingPanel$2
          },
          createTerminalPanel(),
          createSearchResultPanel()
        ]
      },
      {
        name: "\u4F5C\u4E1A\u52A9\u624B",
        url: "**/mooc2/work/dowork**",
        el: () => createNote("\u8FDB\u5165\u8BBE\u7F6E\u9762\u677F\u53EF\u4EE5\u8C03\u6574\u4F5C\u4E1A\u8BBE\u7F6E", "5\u79D2\u540E\u5C06\u81EA\u52A8\u5F00\u59CB..."),
        children: [
          {
            name: "\u4F5C\u4E1A\u8BBE\u7F6E",
            el: () => WorkSettingPanel$1
          },
          createTerminalPanel(),
          createSearchResultPanel()
        ]
      },
      {
        name: "\u8003\u8BD5\u52A9\u624B",
        url: "**/mooc2/exam/preview**",
        el: () => createNote("\u8FDB\u5165\u8BBE\u7F6E\u9762\u677F\u53EF\u4EE5\u8C03\u6574\u8003\u8BD5\u8BBE\u7F6E", "5\u79D2\u540E\u5C06\u81EA\u52A8\u5F00\u59CB..."),
        children: [
          {
            name: "\u8003\u8BD5\u8BBE\u7F6E",
            el: () => ExamSettingPanel
          },
          createTerminalPanel(),
          createSearchResultPanel()
        ]
      },
      {
        name: "\u8003\u8BD5\u52A9\u624B",
        url: "**/exam/test/reVersionTestStartNew**",
        el: () => createNote("\u6CE8\u610F\uFF01 \u5373\u5C06\u5207\u6362\u5230\u6574\u5377\u9884\u89C8\u9875\u9762\uFF0C \u7136\u540E\u624D\u53EF\u4EE5\u81EA\u52A8\u8003\u8BD5\uFF01")
      }
    ]
  });
  function nextTask() {
    var _a;
    const { icve } = useSettings();
    if (icve.common.type === "MOOC") {
      const { sections } = domSearchAll({ sections: ".cellClick .np-section-type:not(.np-section-type.active)" });
      if (sections.length) {
        const cell = sections[0].parentElement;
        logger("info", "\u5373\u5C06\u5207\u6362\u5230\u4E0B\u4E00\u4E2A\u4EFB\u52A1 " + ((_a = cell == null ? void 0 : cell.dataset.cellname) == null ? void 0 : _a.trim()) || "\u672A\u77E5");
        cell == null ? void 0 : cell.click();
        study$1();
      } else {
        message("warn", "\u6CA1\u6709\u53EF\u5B66\u4E60\u7684\u4EFB\u52A1\uFF0C\u5B66\u4E60\u7ED3\u675F\u3002");
      }
    } else {
      const task = icve.study.cells.find((cell) => cell.isTask);
      if (task) {
        logger("info", "\u5373\u5C06\u5207\u6362\u5230\u4E0B\u4E00\u4E2A\u4EFB\u52A1 " + task.cellName);
        task.isTask = false;
        icve.study.currentTask = task;
        setTimeout(() => {
          window.location.href = task.href;
        }, 1e3);
      } else {
        message("warn", "\u6CA1\u6709\u53EF\u5B66\u4E60\u7684\u4EFB\u52A1\uFF0C\u5B66\u4E60\u7ED3\u675F\u3002");
      }
    }
  }
  async function study$1() {
    var _a;
    await sleep(5e3);
    const { icve: settings } = useSettings();
    const { common } = useContext();
    const fixTime = ((_a = useUnsafeWindow()) == null ? void 0 : _a._fixTime) || 10;
    const { ppt, video, iframe, link, nocaptcha } = domSearch({
      ppt: ".page-bar",
      iframe: "iframe",
      video: "video",
      link: "#externalLinkDiv",
      nocaptcha: "#waf_nc_block,#nocaptcha"
    });
    console.log({ ppt, video, iframe, link, nocaptcha });
    if (nocaptcha && nocaptcha.style.display !== "none") {
      message("warn", "\u8BF7\u624B\u52A8\u6ED1\u52A8\u9A8C\u8BC1\u7801\u3002");
    } else if (video) {
      logger("info", "\u5F00\u59CB\u64AD\u653E\u89C6\u9891");
      const v = video;
      common.currentMedia = v;
      video.onended = async () => {
        logger("info", "\u89C6\u9891\u7ED3\u675F");
        await sleep(3e3);
        nextTask();
      };
      fixedVideoProgress$1(settings.study.showProgress);
      v.volume = settings.study.volume;
      if (v.paused) {
        v.play();
      }
    } else if (iframe && iframe.src.startsWith("https://file.icve.com.cn")) {
      const interval = setInterval(() => {
        if (settings.study.isReading === false) {
          clearInterval(interval);
          nextTask();
        }
      }, settings.study.pptRate * 1e3);
    } else if (ppt) {
      logger("info", "\u5F00\u59CB\u64AD\u653EPPT");
      const { pageCount, pageCurrentCount, pageNext } = domSearch({
        pageCount: ".MPreview-pageCount",
        pageNext: ".MPreview-pageNext",
        pageCurrentCount: ".MPreview-pageInput"
      });
      if (pageCurrentCount && pageCount && pageNext) {
        let count = parseInt(pageCurrentCount.value);
        const total = parseInt(pageCount.innerText.replace("/", "").trim() || "0");
        while (count <= total) {
          pageNext.click();
          await sleep(1e3 * settings.study.pptRate);
          count++;
        }
        logger("info", `PPT\u64AD\u653E\u5B8C\u6210 ${fixTime * 2} \u79D2\u540E\u5C06\u81EA\u52A8\u5207\u6362\u4E0B\u4E00\u4E2A\u4EFB\u52A1\u3002`);
        await sleep(1e3 * fixTime * 2);
        nextTask();
      } else {
        message("error", "\u672A\u627E\u5230PPT\u8FDB\u5EA6\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\u6216\u8005\u8DF3\u8FC7\u6B64\u4EFB\u52A1\u3002");
      }
    } else if (link && link.style.display !== "none") {
      logger("info", `\u94FE\u63A5\u67E5\u770B\u5B8C\u6210\uFF0C${fixTime}\u79D2\u540E\u4E0B\u4E00\u4E2A\u4EFB\u52A1`);
      await sleep(1e3 * fixTime);
      nextTask();
    } else {
      logger("error", "\u672A\u77E5\u7684\u8BFE\u4EF6\u7C7B\u578B\uFF0C\u8BF7\u53CD\u9988\u7ED9\u4F5C\u8005\u3002");
    }
  }
  function fixedVideoProgress$1(fixed) {
    const { common } = useContext();
    const { bar } = domSearch({ bar: ".jw-controlbar" });
    if (common.currentMedia && bar) {
      bar.style.display = fixed ? "block" : "none";
      bar.style.visibility = fixed ? "visible" : "hidden";
      bar.style.opacity = fixed ? "1" : "0";
    }
  }
  async function loadTasks() {
    const { icve } = useSettings();
    let loading = false;
    icve.study.cells = [];
    const _template = useUnsafeWindow().template;
    useUnsafeWindow().template = function(type, data) {
      loading = false;
      if (type === "cell_html" && data.code) {
        icve.study.cells = icve.study.cells.concat(data.cellList.map((cl) => cl.childNodeList || cl).flat());
        icve.study.cells = icve.study.cells.map((cell) => {
          const percent = cell.stuCellPercent || cell.stuCellFourPercent;
          cell.isTask = percent !== 100;
          return cell;
        });
      }
      return _template(type, data);
    };
    const fixTime = useUnsafeWindow()._fixTime;
    const { moduleTriggers } = domSearchAll({ moduleTriggers: ".moduleList .openOrCloseModule" });
    await open(moduleTriggers.filter((trigger2) => {
      var _a;
      return ((_a = trigger2.parentElement) == null ? void 0 : _a.querySelector(".topicList")) === null;
    }));
    const { topicsTriggers } = domSearchAll({ topicsTriggers: ".topicList .openOrCloseTopic" });
    await open(topicsTriggers);
    icve.study.cells = icve.study.cells.map((cell) => {
      const { hrefList } = domSearchAll({ hrefList: "[data-href]" });
      cell.href = hrefList.map((el) => el.dataset.href).find((href) => href == null ? void 0 : href.includes(cell.Id)) || "";
      return cell;
    });
    async function open(targets) {
      console.log("targets", targets);
      for (const target of targets) {
        target.click();
        await waitForLoading();
        await sleep(1e3 * (fixTime + 1));
      }
    }
    function waitForLoading() {
      loading = true;
      return Promise.race([
        sleep(1e3 * 60),
        new Promise((resolve2, reject) => {
          setInterval(() => loading === false ? resolve2() : void 0, 1e3);
        })
      ]);
    }
  }
  const TaskList = defineComponent({
    props: {
      selectable: {
        default: true,
        type: Boolean
      }
    },
    setup(props, ctx) {
      const settings = useSettings().icve.study;
      return () => createVNode(Fragment, null, [createVNode("table", null, [createVNode("thead", null, [createVNode("tr", null, [createVNode("th", null, [createVNode("span", null, [createTextVNode("\u4EFB\u52A1\u70B9")])]), createVNode("th", null, [createVNode("span", null, [createTextVNode("\u7C7B\u578B")])]), createVNode("th", null, [createVNode("span", null, [createTextVNode("\u8FDB\u5EA6")])]), createVNode("th", null, [createVNode("span", null, [createTextVNode("\u540D\u79F0")])]), createVNode("th", null, [createVNode("span", null, [createTextVNode("\u64CD\u4F5C")])])])]), createVNode("tbody", null, [settings.cells.map((item, index2) => {
        var _a;
        return createVNode("tr", null, [createVNode("td", null, [createVNode("input", {
          "id": "task_" + index2.toString(),
          "style": {
            marginRight: "2px"
          },
          "type": "checkbox",
          "checked": item.isTask,
          "disabled": !props.selectable,
          "onChange": (e) => {
            settings.cells[index2].isTask = e.target.checked;
          }
        }, null)]), createVNode("td", null, [item.categoryName.toLocaleUpperCase()]), createVNode("td", null, [item.stuCellPercent || item.stuCellFourPercent, createTextVNode("%")]), createVNode("td", {
          "title": item.href
        }, [createVNode("label", {
          "for": "task_" + index2.toString(),
          "style": {
            cursor: "pointer"
          }
        }, [item.cellName, createVNode("span", {
          "style": {
            fontWeight: "bold"
          }
        }, [((_a = settings.cells.find((cell) => cell.isTask)) == null ? void 0 : _a.Id) === item.Id ? " (\u4E0B\u4E2A\u4EFB\u52A1)" : ""])])]), createVNode("td", {
          "title": item.href
        }, [createVNode("a", {
          "href": item.href
        }, [createTextVNode("\u8FDB\u5165")])])]);
      })])])]);
    }
  });
  const StudyTaskSettingPanel = defineComponent({
    setup() {
      const settings = useSettings().icve.study;
      const loading = ref(false);
      const count = ref(0);
      setInterval(() => count.value = count.value > 2 ? 0 : count.value + 1, 1e3 / 3);
      const hasCell = computed(() => settings.cells.length > 0);
      const hasTask = computed(() => settings.cells.some((cell) => cell.isTask));
      return () => createVNode(Fragment, null, [createVNode("div", {
        "style": {
          display: "flex"
        }
      }, [createVNode(Tooltip, {
        "title": "\u70B9\u51FB\u8BFB\u53D6\u4EFB\u52A1\u5217\u8868\uFF0C\u8BFB\u53D6\u540E\u52FE\u9009\u4EFB\u52A1\uFF0C\u5373\u53EF\u70B9\u51FB\u5F00\u59CB\u5B66\u4E60\u3002",
        "containerStyle": {
          width: "fit-content"
        }
      }, {
        default: () => [createVNode("button", {
          "class": "ocs-btn-primary",
          "disabled": loading.value,
          "onClick": async () => {
            message("info", "\u8BF7\u7B49\u5F85\u5168\u90E8\u4EFB\u52A1\u8BFB\u53D6\u5B8C\u6BD5\uFF08\u4E3A\u4E86\u907F\u514D\u9A8C\u8BC1\u7801\uFF0C\u6B64\u8FC7\u7A0B\u53EF\u80FD\u8F83\u4E45\uFF09");
            loading.value = true;
            await loadTasks();
            loading.value = false;
            message("success", "\u8BFB\u53D6\u5B8C\u6BD5!");
          }
        }, [loading.value ? "\u8BFB\u53D6\u4EFB\u52A1\u4E2D" + ".".repeat(count.value) : hasCell.value ? "\u91CD\u65B0\u8BFB\u53D6\u4EFB\u52A1" : "\u8BFB\u53D6\u4EFB\u52A1"])]
      }), createVNode(Tooltip, {
        "title": hasCell.value ? hasTask.value ? "\u5F00\u59CB\u5B66\u4E60\u9009\u4E2D\u7684\u4EFB\u52A1" : "\u8BF7\u9009\u4E2D\u9700\u8981\u5B66\u4E60\u7684\u4EFB\u52A1" : "\u4EFB\u52A1\u5217\u8868\u4E3A\u7A7A\uFF0C\u8BF7\u5148\u83B7\u53D6\u4EFB\u52A1\u3002",
        "containerStyle": {
          width: "fit-content"
        }
      }, {
        default: () => [createVNode("button", {
          "class": "ocs-btn-primary",
          "disabled": loading.value || hasTask.value === false || hasCell.value === false,
          "onClick": () => {
            message("info", "\u5F00\u59CB\u5B66\u4E60\uFF0C\u5982\u679C\u9875\u9762\u4E0D\u8DF3\u8F6C\u8BF7\u81EA\u884C\u8FDB\u5165\u7B2C\u4E00\u4E2A\u4EFB\u52A1\u3002");
            nextTask();
          }
        }, [createTextVNode("\u5F00\u59CB\u5B66\u4E60")])]
      })]), createVNode("hr", null, null), createVNode("div", null, [settings.cells.length === 0 ? createVNode("span", null, [createTextVNode("\u6682\u65E0\u4EFB\u52A1\uFF0C\u8BF7\u70B9\u51FB\u83B7\u53D6")]) : createVNode(Tooltip, {
        "title": "\u52FE\u9009\u6216\u8005\u53D6\u6D88\u4EFB\u52A1\uFF0C\u9009\u4E2D\u7684\u4EFB\u52A1\u5C06\u4F1A\u81EA\u52A8\u5207\u6362\u5E76\u8FD0\u884C\u3002"
      }, {
        default: () => [createVNode(TaskList, null, null)]
      })])]);
    }
  });
  const StudySettingPanel$1 = defineComponent({
    setup() {
      const settings = useSettings().icve.study;
      const ctx = useContext();
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode("label", null, [createTextVNode("\u89C6\u9891\u500D\u901F")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u4E0D\u5141\u8BB8\u500D\u901F\uFF01"
      }, {
        default: () => [createVNode("input", {
          "type": "range",
          "value": "1",
          "disabled": true
        }, null)]
      }), createVNode("span", null, [createTextVNode("1x")])]), createVNode("label", null, [createTextVNode("\u97F3\u91CF\u8C03\u8282")]), createVNode("div", null, [createVNode("input", {
        "type": "range",
        "min": "0",
        "max": "1",
        "step": "0.05",
        "value": settings.volume,
        "onInput": (e) => {
          settings.volume = e.target.valueAsNumber;
          if (ctx.common.currentMedia)
            ctx.common.currentMedia.volume = e.target.valueAsNumber;
        }
      }, null), createVNode("span", null, [createTextVNode(" "), Math.round(settings.volume * 100), createTextVNode("% ")])]), createVNode("label", null, [createTextVNode("\u663E\u793A\u89C6\u9891\u8FDB\u5EA6")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u56FA\u5B9A\u8FDB\u5EA6\u6761\uFF0C\u9632\u6B62\u8FDB\u5EA6\u6761\u6D88\u5931\u3002"
      }, {
        default: () => [createVNode("input", {
          "class": "input-switch",
          "type": "checkbox",
          "checked": settings.showProgress,
          "onChange": (e) => {
            settings.showProgress = e.target.checked;
            fixedVideoProgress$1(settings.showProgress);
          }
        }, null)]
      })]), createVNode("hr", null, null), createVNode("hr", null, null), createVNode("label", null, [createTextVNode("PPT\u7FFB\u9605\u901F\u5EA6/\u79D2")]), createVNode("div", null, [createVNode("input", {
        "type": "number",
        "value": settings.pptRate,
        "min": "1",
        "max": "60",
        "step": "1",
        "onChange": (e) => settings.pptRate = e.target.valueAsNumber,
        "onInput": (e) => settings.pptRate = e.target.valueAsNumber
      }, null)])])]);
    }
  });
  const ICVEScript = defineScript({
    name: "\u804C\u6559\u4E91",
    routes: [{
      name: "\u5206\u7C7B\u811A\u672C",
      url: "**icve.com.cn**",
      onload() {
        const settings = useSettings().icve.common;
        if (urlMatch("mooc.icve.com.cn")) {
          settings.type = "MOOC";
        } else if (urlMatch("zjy2.icve.com.cn")) {
          settings.type = "ZJY";
        } else {
          settings.type = void 0;
        }
      }
    }, {
      name: "\u5B66\u4E60\u811A\u672C",
      url: ["**icve.com.cn/common/directory/directory.html**", "**mooc.icve.com.cn/study/courseLearn/resourcesStudy.html**"],
      onload: study$1
    }, {
      name: "\u9605\u8BFB\u811A\u672C",
      url: ["**file.icve.com.cn**"],
      async onload() {
        var _a;
        const settings = useSettings().icve.study;
        const fixTime = ((_a = useUnsafeWindow()) == null ? void 0 : _a._fixTime) || 10;
        logger("info", "\u5373\u5C06\u5F00\u59CB\u64AD\u653EPPT");
        settings.isReading = true;
        await sleep(3e3);
        while (true) {
          const {
            gc,
            Presentation
          } = useUnsafeWindow();
          const {
            TotalSlides
          } = Presentation.GetContentDetails();
          if (gc < TotalSlides) {
            console.log(gc, TotalSlides);
            await sleep(useSettings().icve.study.pptRate * 1e3);
            Presentation.Next();
          } else {
            break;
          }
        }
        logger("info", `PPT\u64AD\u653E\u5B8C\u6210 ${fixTime * 2} \u79D2\u540E\u5C06\u81EA\u52A8\u5207\u6362\u4E0B\u4E00\u4E2A\u4EFB\u52A1\u3002`);
        await sleep(1e3 * fixTime * 2);
        settings.isReading = false;
      }
    }],
    panels: [{
      name: "MOOC\u52A9\u624B",
      url: ["**mooc.icve.com.cn/study/courseLearn/process.html**", "**mooc.icve.com.cn/profile.html**"],
      el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u8BFE\u7A0B\u6216\u8BFE\u4EF6\u8FDB\u5165\u3002")
    }, {
      name: "\u804C\u6559\u4E91\u52A9\u624B",
      url: "**zjy2.icve.com.cn/student/studio/studio.html**",
      el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u8BFE\u7A0B\u8FDB\u5165\u3002")
    }, {
      name: "\u8BFE\u4EF6\u52A9\u624B",
      url: "**zjy2.icve.com.cn/study/process/process.html**",
      el: () => createNote("\u8BF7\u8FDB\u5165 \u4EFB\u52A1\u9009\u62E9 \u9009\u62E9\u60A8\u7684\u4EFB\u52A1\uFF0C\u5E76\u5F00\u59CB\u5B66\u4E60\u3002"),
      children: [{
        name: "\u4EFB\u52A1\u9009\u62E9",
        el: () => StudyTaskSettingPanel
      }]
    }, {
      name: "\u5B66\u4E60\u52A9\u624B",
      url: ["**zjy2.icve.com.cn/common/directory/directory.html**", "**mooc.icve.com.cn/study/courseLearn/resourcesStudy.html**"],
      el: () => createNote("\u8FDB\u5165 \u5B66\u4E60\u8BBE\u7F6E\u9762\u677F \u53EF\u4EE5\u8C03\u6574\u5B66\u4E60\u8BBE\u7F6E", "5\u79D2\u540E\u81EA\u52A8\u5F00\u59CB..."),
      children: [{
        name: "\u5B66\u4E60\u8BBE\u7F6E",
        el: () => StudySettingPanel$1
      }, {
        name: "\u4EFB\u52A1\u5217\u8868",
        hide: () => useSettings().icve.common.type === "MOOC",
        el: () => createVNode(TaskList, {
          "selectable": false
        }, null)
      }, createTerminalPanel()]
    }]
  });
  const CommonWorkSettingPanel = defineComponent({
    props: {
      settings: {
        default: () => {
        },
        type: Object
      }
    },
    emits: ["updateUpload"],
    setup(props, {
      slots,
      emit
    }) {
      const {
        settings
      } = toRefs(props);
      return () => {
        var _a;
        return createVNode(Fragment, null, [(_a = slots.upload) == null ? void 0 : _a.call(slots), createVNode("label", null, [createTextVNode("\u7B54\u9898\u95F4\u9694(\u79D2)")]), createVNode("div", null, [createVNode("input", {
          "type": "number",
          "value": settings.value.period,
          "min": "3",
          "step": "1",
          "onChange": (e) => settings.value.period = e.target.valueAsNumber,
          "onInput": (e) => settings.value.period = e.target.valueAsNumber
        }, null)]), createVNode("label", null, [createTextVNode("\u641C\u9898\u8BF7\u6C42\u8D85\u65F6\u65F6\u95F4(\u79D2)")]), createVNode("div", null, [createVNode(Tooltip, {
          "title": "\u6BCF\u9053\u9898\u6700\u591A\u505An\u79D2, \u8D85\u8FC7\u5219\u8DF3\u8FC7\u6B64\u9898\u3002"
        }, {
          default: () => [createVNode("input", {
            "type": "number",
            "value": settings.value.timeout,
            "min": "10",
            "step": "1",
            "onChange": (e) => settings.value.timeout = e.target.valueAsNumber,
            "onInput": (e) => settings.value.timeout = e.target.valueAsNumber
          }, null)]
        })]), createVNode("label", null, [createTextVNode("\u641C\u9898\u8D85\u65F6\u91CD\u8BD5\u6B21\u6570")]), createVNode("div", null, [createVNode("input", {
          "type": "number",
          "value": settings.value.retry,
          "min": "0",
          "max": "2",
          "step": "1",
          "onChange": (e) => settings.value.retry = e.target.valueAsNumber,
          "onInput": (e) => settings.value.retry = e.target.valueAsNumber
        }, null)])]);
      };
    }
  });
  const CreditWorkSettingPanel = defineComponent({
    setup() {
      const settings = useSettings().zhs.work;
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode(CommonWorkSettingPanel, {
        "settings": settings
      }, {
        upload: createVNode(WorkerSetting, {
          "label": "\u81EA\u52A8\u7B54\u9898",
          "config": {
            selected: settings.upload
          },
          "changeHandler": (e) => settings.upload = e.target.value
        }, null)
      })])]);
    }
  });
  function waitForCaptcha() {
    const popup = document.querySelector(".yidun_popup");
    if (popup) {
      message("warn", "\u5F53\u524D\u68C0\u6D4B\u5230\u9A8C\u8BC1\u7801\uFF0C\u8BF7\u8F93\u5165\u540E\u65B9\u53EF\u7EE7\u7EED\u8FD0\u884C\u3002");
      return new Promise((resolve2, reject) => {
        const interval = setInterval(() => {
          const popup2 = document.querySelector(".yidun_popup");
          if (popup2 === null) {
            clearInterval(interval);
            resolve2();
          }
        }, 1e3);
      });
    }
  }
  let stop = false;
  async function study() {
    var _a, _b;
    const { watchTime, restudy } = useSettings().zhs.video;
    logger("info", "zhs \u5B66\u4E60\u4EFB\u52A1\u5F00\u59CB");
    let list = Array.from(document.querySelectorAll("li.clearfix.video"));
    if (!restudy) {
      list = list.filter((el) => el.querySelector(".time_icofinish") === null);
    }
    if (list.length === 0) {
      logger("warn", "\u89C6\u9891\u4EFB\u52A1\u6570\u91CF\u4E3A 0 !");
    } else {
      console.log(list);
      logger("info", "\u89C6\u9891\u4EFB\u52A1\u6570\u91CF", list.length);
      setInterval(() => {
        const { showProgress } = useSettings().zhs.video;
        closeTestDialog();
        fixedVideoProgress(showProgress);
      }, 3e3);
      autoClose(watchTime);

      for (const item of list) {
        try {
          if (stop) {
            break;
          } else {
            logger("debug", `\u5373\u5C06\u64AD\u653E -- ${(_a = item.querySelector('[class="catalogue_title"]')) == null ? void 0 : _a.getAttribute("title")} : ${(_b = item.querySelector(".time")) == null ? void 0 : _b.textContent}`);
            await sleep(5e3);
            item.click();
            await sleep(5e3);
            await watch();
          }
        } catch (e) {
          logger("error", e);
        }
      }
    }
    logger("info", "zhs \u5B66\u4E60\u4EFB\u52A1\u7ED3\u675F");
  }
  async function watch() {
    const { volume, playbackRate, creditStudy: creditStudy2 } = useSettings().zhs.video;
    return new Promise((resolve2, reject) => {
      try {
        const video = document.querySelector("video");
        const { common } = useContext();
        common.currentMedia = video;
        common.currentMedia = video;
        video.currentTime = 0;
        video.volume = volume;
        Promise.resolve(async () => {
          await sleep(1e3);
          video.play();
          await switchPlaybackRate(creditStudy2 ? 1 : playbackRate);
          video.onpause = async function() {
            if (!video.ended) {
              if (stop) {
                resolve2();
              } else {
                await waitForCaptcha();
                await sleep(1e3);
                video.play();
              }
            }
          };
          video.onended = function() {
            resolve2();
          };
        }).then((func) => {
          func();
        }).catch((err) => {
          logger("error", err);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  async function switchPlaybackRate(playbackRate) {
    await sleep(500);
    const { btn } = domSearch({ btn: ".speedBox" });
    btn == null ? void 0 : btn.click();
    await sleep(500);
    const { rate } = domSearch({ rate: `[rate="${playbackRate === 1 ? "1.0" : playbackRate}"]` });
    rate == null ? void 0 : rate.click();
  }
  async function closeTestDialog() {
    const { items } = domSearchAll({ items: ".topic-item" });
    if (items.length !== 0) {
      const { item, study: study2 } = domSearch({ item: ".topic-item", study: ".video-study" });
      item == null ? void 0 : item.click();
      await sleep(1e3);
      study2.__vue__.testDialog = false;
      await sleep(1e3);
    }
  }
  async function creditStudy() {
    const { restudy } = useSettings().zhs.video;
    let list = Array.from(document.querySelectorAll(".file-item"));
    if (!restudy) {
      list = list.filter((el) => el.querySelector(".icon-finish") === null);
    }
    console.log(list);
    const item = list[0];
    if (item) {
      if (item.classList.contains("active")) {
        await watch();
        if (list[1])
          list[1].click();
      } else {
        item.click();
      }
    }
  }
  function autoClose(watchTime) {
    const settings = useSettings().zhs.video;
    if (watchTime !== 0) {
      let time = 0;
      clearInterval(settings.interval);
      settings.interval = setInterval(() => {
        if (time >= watchTime * 60 * 60 * 1e3) {
          clearInterval(settings.interval);
          const video = document.querySelector("video");
          video.pause();
          stop = true;
          message("warn", "\u811A\u672C\u5DF2\u81EA\u52A8\u6682\u505C\uFF0C\u5DF2\u83B7\u5F97\u4ECA\u65E5\u5E73\u65F6\u5206\uFF0C\u5982\u9700\u7EE7\u7EED\u5B66\u4E60\u8BF7\u5237\u65B0\u9875\u9762\u5E76\u8C03\u6574\u5B66\u4E60\u65F6\u95F4\u3002");
        } else {
          time += 1e3;
        }
      }, 1e3);
    } else {
      clearInterval(settings.interval);
    }
  }
  function fixedVideoProgress(fixed) {
    const { common } = useContext();
    const { bar } = domSearch({ bar: ".controlsBar" });
    if (common.currentMedia && bar) {
      if (bar) {
        bar.style.display = fixed ? "block" : "none";
      }
    }
  }
  const StudySettingPanel = defineComponent({
    setup() {
      const settings = useSettings().zhs.video;
      const ctx = useContext();
      showCloseDate();
      function showCloseDate() {
        const closeDate = new Date();
        closeDate.setMinutes(closeDate.getMinutes() + settings.watchTime * 60);
        settings.closeDate = closeDate;
      }
      const switching = ref(false);
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [settings.creditStudy === false ? [createVNode("label", null, [createTextVNode("\u81EA\u52A8\u6682\u505C")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u64AD\u653E\u65F6\u95F4\u5230\u540E, \u5C06\u4F1A\u81EA\u52A8\u6682\u505C\u3002\n\u5982\u8BBE\u7F6E\u4E3A0, \u5219\u4E0D\u4F1A\u81EA\u52A8\u6682\u505C\n\u81EA\u52A8\u6682\u505C\u53EF\u4EE5\u5E2E\u52A9\u4F60\u83B7\u53D6\u667A\u6167\u6811\u7684\u5E73\u65F6\u5206\uFF0C\u6BCF\u5929\u5B66\u4E60\u8D85\u8FC7\u534A\u5C0F\u65F6\u5C31\u7B97\u4E00\u6B21\u5E73\u65F6\u5206\u3002"
      }, {
        default: () => [createVNode("input", {
          "type": "number",
          "value": settings.watchTime,
          "min": "0",
          "max": "24",
          "step": "0.5",
          "onChange": (e) => {
            settings.watchTime = e.target.valueAsNumber;
            showCloseDate();
            autoClose(e.target.valueAsNumber);
          }
        }, null)]
      }), createVNode("span", null, [createTextVNode("\u5C0F\u65F6")])]), createVNode("label", null, [createTextVNode("\u6682\u505C\u65F6\u95F4")]), createVNode("div", null, [settings.watchTime === 0 ? createVNode("span", null, [createTextVNode("\u8BBE\u7F6E\u4E3A0\u5C06\u4E0D\u4F1A\u81EA\u52A8\u6682\u505C")]) : createVNode("span", null, [createTextVNode("\u5C06\u5728 "), settings.closeDate.toLocaleString(), createTextVNode(" \u6682\u505C")])])] : [], settings.creditStudy === true ? createVNode(Fragment, null, [createVNode("label", null, [createTextVNode("\u89C6\u9891\u500D\u901F ")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u5B66\u5206\u8BFE\u4E0D\u5141\u8BB8\u500D\u901F\uFF01"
      }, {
        default: () => [createVNode("input", {
          "type": "range",
          "value": "1",
          "disabled": true
        }, null)]
      }), createVNode("span", null, [createTextVNode("1x")])])]) : createVNode(Fragment, null, [createVNode("label", null, [createTextVNode("\u89C6\u9891\u500D\u901F ")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u667A\u6167\u6811\u6700\u9AD81.5\u500D\u901F, \u8D85\u8FC71.5\u5BB9\u6613\u5C01\u53F7\uFF01"
      }, {
        default: () => [createVNode("input", {
          "type": "range",
          "step": "0.25",
          "max": "1.5",
          "min": "1",
          "value": settings.playbackRate,
          "disabled": switching.value,
          "onChange": async (e) => {
            switching.value = true;
            settings.playbackRate = e.target.valueAsNumber;
            await switchPlaybackRate(settings.playbackRate);
            switching.value = false;
          }
        }, null)]
      }), createVNode("span", null, [settings.playbackRate, createTextVNode("x")])])]), createVNode("label", null, [createTextVNode("\u97F3\u91CF\u8C03\u8282")]), createVNode("div", null, [createVNode("input", {
        "type": "range",
        "min": "0",
        "max": "1",
        "step": "0.05",
        "value": settings.volume,
        "onInput": (e) => {
          settings.volume = e.target.valueAsNumber;
          if (ctx.common.currentMedia)
            ctx.common.currentMedia.volume = e.target.valueAsNumber;
        }
      }, null), createVNode("span", null, [createTextVNode(" "), Math.round(settings.volume * 100), createTextVNode("% ")])]), createVNode("label", null, [createTextVNode("\u663E\u793A\u89C6\u9891\u8FDB\u5EA6")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u56FA\u5B9A\u8FDB\u5EA6\u6761\uFF0C\u9632\u6B62\u8FDB\u5EA6\u6761\u6D88\u5931\u3002"
      }, {
        default: () => [createVNode("input", {
          "class": "input-switch",
          "type": "checkbox",
          "checked": settings.showProgress,
          "onChange": (e) => {
            settings.showProgress = e.target.checked;
            fixedVideoProgress(e.target.checked);
          }
        }, null)]
      })]), createVNode("label", null, [createTextVNode("\u590D\u4E60\u6A21\u5F0F")]), createVNode("div", null, [createVNode(Tooltip, {
        "title": "\u5C06\u64AD\u653E\u8FC7\u7684\u89C6\u9891\u518D\u64AD\u653E\u4E00\u904D\u3002"
      }, {
        default: () => [createVNode("input", {
          "class": "input-switch",
          "type": "checkbox",
          "checked": settings.restudy,
          "onChange": (e) => settings.restudy = e.target.checked
        }, null)]
      })])])]);
    }
  });
  const WorkSettingPanel = defineComponent({
    setup() {
      const settings = useSettings().zhs.work;
      return () => createVNode("div", {
        "class": "ocs-setting-panel"
      }, [createVNode("div", {
        "class": "ocs-setting-items"
      }, [createVNode(CommonWorkSettingPanel, {
        "settings": settings
      }, {
        upload: createVNode(WorkerSetting, {
          "label": "\u81EA\u52A8\u7B54\u9898",
          "config": {
            selected: settings.upload
          },
          "changeHandler": (e) => settings.upload = e.target.value
        }, null)
      })])]);
    }
  });
  async function workOrExam(type = "work") {
    const { period, timeout, retry, upload } = useSettings().zhs.work;
    const { answererWrappers } = useSettings().common;
    if (upload === "close" && type === "work") {
      logger("warn", "\u81EA\u52A8\u7B54\u9898\u5DF2\u88AB\u5173\u95ED\uFF01");
      message("warn", "\u81EA\u52A8\u7B54\u9898\u5DF2\u88AB\u5173\u95ED\uFF01\u8BF7\u5728\u8BBE\u7F6E\u5F00\u542F\u81EA\u52A8\u7B54\u9898\uFF01\u6216\u8005\u5FFD\u7565\u6B64\u8B66\u544A");
    } else if (answererWrappers.length === 0) {
      logger("warn", "\u9898\u5E93\u914D\u7F6E\u4E3A\u7A7A\uFF0C\u8BF7\u8BBE\u7F6E\u3002");
    } else {
      waitForRecognize("zhs");
      const local = useStore("localStorage");
      local.workResults = [];
      const worker = new OCSWorker({
        root: ".examPaper_subject",
        elements: {
          title: ".subject_describe,.smallStem_describe",
          options: ".subject_node .nodeLab"
        },
        answerer: (elements, type2, ctx) => defaultAnswerWrapperHandler(answererWrappers, {
          type: type2,
          title: elements.title[0].innerText,
          root: ctx.root
        }),
        work: {
          handler(type2, answer, option) {
            var _a;
            if (type2 === "judgement" || type2 === "single" || type2 === "multiple") {
              if (!((_a = option.querySelector("input")) == null ? void 0 : _a.checked)) {
                option.click();
              }
            } else if (type2 === "completion" && answer.trim()) {
              const text = option.querySelector("textarea");
              if (text) {
                text.value = answer;
              }
            }
          }
        },
        async interceptor() {
          await waitForCaptcha();
          return true;
        },
        onElementSearched(elements) {
          elements.title = elements.title.map(elementToRawObject);
        },
        onResult: (res) => {
          var _a;
          if (res.ctx) {
            local.workResults.push(res);
          }
          console.log(res);
          logger("info", "\u9898\u76EE\u5B8C\u6210\u7ED3\u679C : ", ((_a = res.result) == null ? void 0 : _a.finish) ? "\u5B8C\u6210" : "\u672A\u5B8C\u6210");
          const { btn } = domSearch({ btn: "div.examPaper_box > div.switch-btn-box > button:nth-child(2)" });
          btn == null ? void 0 : btn.click();
        },
        period: (period || 3) * 1e3,
        timeout: (timeout || 30) * 1e3,
        retry,
        stopWhenError: false
      });
      const results = await worker.doWork();
      logger("info", "\u505A\u9898\u5B8C\u6BD5", results);
      if (type === "exam") {
        logger("info", "\u4E3A\u4E86\u5B89\u5168\u8003\u8651\uFF0C\u8BF7\u81EA\u884C\u68C0\u67E5\u540E\u81EA\u884C\u70B9\u51FB\u63D0\u4EA4\uFF01");
      } else {
        await worker.uploadHandler({
          uploadRate: upload,
          results,
          async callback(finishedRate, uploadable) {
            logger("info", "\u5B8C\u6210\u7387 : ", finishedRate, " , ", uploadable ? "5\u79D2\u540E\u5C06\u81EA\u52A8\u63D0\u4EA4" : "5\u79D2\u540E\u5C06\u81EA\u52A8\u4FDD\u5B58");
            await sleep(5e3);
            const { saveBtn, uploadBtn } = domSearch({
              saveBtn: ".btnStyleX:not(.btnStyleXSumit)",
              uploadBtn: ".btnStyleXSumit"
            });
            if (uploadable) {
              uploadBtn == null ? void 0 : uploadBtn.click();
            } else {
              saveBtn == null ? void 0 : saveBtn.click();
            }
            await sleep(2e3);
            const { confirmBtn } = domSearch({
              confirmBtn: "[role='dialog'] .el-button--primary"
            });
            confirmBtn == null ? void 0 : confirmBtn.click();
          }
        });
      }
    }
  }
  async function creditWork() {
    const { period, timeout, retry, upload } = useSettings().zhs.work;
    const { answererWrappers } = useSettings().common;
    if (upload === "close") {
      logger("warn", "\u81EA\u52A8\u7B54\u9898\u5DF2\u88AB\u5173\u95ED\uFF01");
    } else if (answererWrappers.length === 0) {
      logger("warn", "\u9898\u5E93\u914D\u7F6E\u4E3A\u7A7A\uFF0C\u8BF7\u8BBE\u7F6E\u3002");
    } else {
      logger("info", "\u5373\u5C06\u5F00\u59CB\u505A\u9898...");
      const local = useStore("localStorage");
      local.workResults = [];
      const worker = new OCSWorker({
        root: ".questionBox",
        elements: {
          title: ".questionContent",
          options: ".optionUl label",
          questionTit: ".questionTit"
        },
        answerer: (elements, type, ctx) => {
          const title = StringUtils.nowrap(elements.title[0].innerText).trim();
          if (title) {
            return defaultAnswerWrapperHandler(answererWrappers, { type, title, root: ctx.root });
          } else {
            throw new Error("\u9898\u76EE\u4E3A\u7A7A\uFF0C\u8BF7\u67E5\u770B\u9898\u76EE\u662F\u5426\u4E3A\u7A7A\uFF0C\u6216\u8005\u5FFD\u7565\u6B64\u9898");
          }
        },
        work: {
          handler(type, answer, option, ctx) {
            var _a;
            if (type === "judgement" || type === "single" || type === "multiple") {
              if (((_a = option.querySelector("input")) == null ? void 0 : _a.checked) === false) {
                option.click();
              }
            } else if (type === "completion" && answer.trim()) {
              const text = option.querySelector("textarea");
              if (text) {
                text.value = answer;
              }
            }
          }
        },
        onElementSearched(elements) {
          elements.title = elements.title.map(elementToRawObject);
        },
        onResult: (res) => {
          var _a, _b, _c;
          if (res.ctx) {
            if (res.ctx.elements.title[0]) {
              res.ctx.elements.title[0] = {
                innerText: ((_a = res.ctx.elements.questionTit[0]) == null ? void 0 : _a.innerText) + ((_b = res.ctx.elements.title[0]) == null ? void 0 : _b.innerText)
              };
            }
            local.workResults.push(res);
          }
          console.log(res);
          logger("info", "\u9898\u76EE\u5B8C\u6210\u7ED3\u679C : ", ((_c = res.result) == null ? void 0 : _c.finish) ? "\u5B8C\u6210" : "\u672A\u5B8C\u6210");
        },
        period: (period || 3) * 1e3,
        timeout: (timeout || 30) * 1e3,
        retry,
        stopWhenError: false
      });
      const getBtn = () => document.querySelector("span.Topicswitchingbtn:nth-child(2)");
      let next = getBtn();
      while (next) {
        await worker.doWork();
        await sleep((period || 3) * 1e3);
        next = getBtn();
        next == null ? void 0 : next.click();
        await sleep((period || 3) * 1e3);
      }
    }
  }
  const ZHSScript = defineScript({
    name: "\u77E5\u9053\u667A\u6167\u6811",
    routes: [
      {
        name: "\u5171\u4EAB\u8BFE\u89C6\u9891\u811A\u672C",
        url: "**zhihuishu.com/stuStudy**",
        async onload() {
          const settings = useSettings().zhs.video;
          await sleep(5e3);
          settings.creditStudy = false;
          logger("info", "\u5F00\u59CB\u667A\u6167\u6811\u5171\u4EAB\u8BFE\u89C6\u9891\u5B66\u4E60");
          await study();
        }
      },
      {
        name: "\u5171\u4EAB\u8BFE\u4F5C\u4E1A\u811A\u672C",
        url: "**zhihuishu.com/stuExamWeb.html#/webExamList/dohomework**",
        async onload() {
          await sleep(5e3);
          const { common } = useSettings();
          if (common.answererWrappers.length === 0) {
            logger("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01");
            message("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01\u8BF7\u5728\u8BBE\u7F6E\u9762\u677F\u8BBE\u7F6E\u540E\u5237\u65B0\u91CD\u8BD5\uFF01");
          } else {
            await workOrExam("work");
          }
        }
      },
      {
        name: "\u5171\u4EAB\u8BFE\u4F5C\u4E1A\u8003\u8BD5\u63D0\u9192\u811A\u672C",
        url: ["**zhihuishu.com/stuExamWeb.html#/webExamList?**"],
        onload: () => message("warn", "\u8003\u8BD5\u529F\u80FD\u5C5E\u4E8E\u6D4B\u8BD5\u9636\u6BB5\uFF0C\u53EF\u80FD\u65E0\u6CD5\u4F7F\u7528\uFF0C\u5927\u5BB6\u9884\u7559\u597D\u5176\u4ED6\u641C\u9898\u65B9\u5F0F\u3002")
      },
      {
        name: "\u5171\u4EAB\u8BFE\u8003\u8BD5\u811A\u672C",
        url: "**zhihuishu.com/stuExamWeb.html#/webExamList/doexamination*",
        async onload() {
          const { common } = useSettings();
          await sleep(5e3);
          if (common.answererWrappers.length === 0) {
            logger("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01");
            message("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01\u8BF7\u5728\u8BBE\u7F6E\u9762\u677F\u8BBE\u7F6E\u540E\u5237\u65B0\u91CD\u8BD5\uFF01");
          } else {
            await workOrExam("exam");
          }
        }
      },
      {
        name: "\u5B66\u5206\u8BFE\u89C6\u9891\u811A\u672C",
        url: "**zhihuishu.com/aidedteaching/sourceLearning/**",
        async onload() {
          const settings = useSettings().zhs.video;
          await sleep(5e3);
          settings.creditStudy = true;
          logger("info", "\u5F00\u59CB\u667A\u6167\u6811\u5B66\u5206\u8BFE\u89C6\u9891\u5B66\u4E60");
          await creditStudy();
        }
      },
      {
        name: "\u5B66\u5206\u8BFE\u4F5C\u4E1A\u811A\u672C",
        url: "**zhihuishu.com/atHomeworkExam/stu/homeworkQ/exerciseList**",
        async onload() {
          const { common } = useSettings();
          await sleep(5e3);
          if (common.answererWrappers.length === 0) {
            logger("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01");
            message("error", "\u672A\u8BBE\u7F6E\u9898\u5E93\u914D\u7F6E\uFF01\u8BF7\u5728\u8BBE\u7F6E\u9762\u677F\u8BBE\u7F6E\u540E\u5237\u65B0\u91CD\u8BD5\uFF01");
          } else {
            await creditWork();
          }
        }
      },
      {
        name: "\u6587\u5B57\u8BC6\u522B\u811A\u672C",
        url: [
          "**zhihuishu.com/stuExamWeb.html#/webExamList/dohomework**",
          "**zhihuishu.com/stuExamWeb.html#/webExamList/doexamination*"
        ],
        async onload() {
          setTimeout(() => {
            for (const div of Array.from(document.querySelectorAll(".subject_describe > div"))) {
              div.__vue__.$el.innerHTML = div.__vue__._data.shadowDom.textContent;
            }
          }, 3e3);
        }
      },
      {
        name: "\u89C6\u9891\u5B88\u62A4\u811A\u672C",
        url: ["**zhihuishu.com/stuStudy**"],
        onload() {
          const study2 = document.querySelector(".video-study").__vue__;
          const empty = () => {
          };
          study2.checkout = empty;
          study2.notTrustScript = empty;
          study2.checkoutNotTrustScript = empty;
          const _videoClick = study2.videoClick;
          study2.videoClick = function(...args) {
            const po = new PointerEvent('click')
            const event = {isTrusted:true}
            event.__proto__ = po
            args[args.length - 1] =event;
            return _videoClick.apply(study2, args);
          };
        }
      }
    ],
    panels: [
      {
        name: "\u667A\u6167\u6811\u52A9\u624B",
        url: "https://www.zhihuishu.com/",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u70B9\u51FB\u767B\u5F55\u540E, \u8FDB\u5165\u4E2A\u4EBA\u9875\u9762\u624D\u80FD\u4F7F\u7528\u5176\u4ED6\u7684\u529F\u80FD\u54E6\u3002")
      },
      {
        name: "\u667A\u6167\u6811\u52A9\u624B",
        url: "https://onlineweb.zhihuishu.com/onlinestuh5",
        el: () => createNote("\u63D0\u793A\u60A8:", "\u8BF7\u70B9\u51FB\u4EFB\u610F\u7684\u8BFE\u7A0B\u8FDB\u5165\u3002")
      },
      {
        name: "\u5171\u4EAB\u8BFE\u89C6\u9891\u52A9\u624B",
        url: "**zhihuishu.com/stuStudy**",
        el: () => createNote("\u8FDB\u5165 \u89C6\u9891\u8BBE\u7F6E\u9762\u677F \u53EF\u4EE5\u8C03\u6574\u89C6\u9891\u8BBE\u7F6E", "\u70B9\u51FB\u53F3\u4FA7 \u4F5C\u4E1A\u8003\u8BD5 \u53EF\u4EE5\u4F7F\u7528\u4F5C\u4E1A\u529F\u80FD", "5\u79D2\u540E\u81EA\u52A8\u5F00\u59CB\u64AD\u653E\u89C6\u9891..."),
        children: [
          {
            name: "\u5B66\u4E60\u8BBE\u7F6E",
            el: () => StudySettingPanel
          },
          createTerminalPanel()
        ]
      },
      {
        name: "\u5171\u4EAB\u8BFE\u4F5C\u4E1A\u52A9\u624B",
        url: "**zhihuishu.com/stuExamWeb.html#/webExamList/dohomework**",
        el: () => createNote("\u8FDB\u5165 \u4F5C\u4E1A\u8BBE\u7F6E\u9762\u677F \u53EF\u4EE5\u8C03\u6574\u4F5C\u4E1A\u8BBE\u7F6E", "5\u79D2\u540E\u81EA\u52A8\u5F00\u59CB\u4F5C\u4E1A..."),
        children: [
          {
            name: "\u4F5C\u4E1A\u8BBE\u7F6E",
            el: () => WorkSettingPanel
          },
          createTerminalPanel(),
          createSearchResultPanel()
        ]
      },
      {
        name: "\u5171\u4EAB\u8BFE\u8003\u8BD5\u52A9\u624B",
        url: "**zhihuishu.com/stuExamWeb.html#/webExamList/doexamination*",
        el: () => createNote("\u8FDB\u5165 \u8003\u8BD5\u8BBE\u7F6E\u9762\u677F \u53EF\u4EE5\u8C03\u6574\u8003\u8BD5\u8BBE\u7F6E", "5\u79D2\u540E\u81EA\u52A8\u5F00\u59CB\u4F5C\u4E1A..."),
        children: [
          {
            name: "\u8003\u8BD5\u8BBE\u7F6E",
            el: () => ExamSettingPanel
          },
          createTerminalPanel(),
          createSearchResultPanel()
        ]
      },
      {
        name: "\u5B66\u5206\u8BFE\u89C6\u9891\u52A9\u624B",
        url: "**zhihuishu.com/aidedteaching/sourceLearning/**",
        el: () => createNote("\u8FDB\u5165 \u89C6\u9891\u8BBE\u7F6E\u9762\u677F \u53EF\u4EE5\u8C03\u6574\u89C6\u9891\u8BBE\u7F6E", "\u5B66\u5206\u8BFE\u9ED8\u8BA41\u500D\u901F, \u4E0D\u53EF\u4FEE\u6539", "5\u79D2\u540E\u81EA\u52A8\u5F00\u59CB\u64AD\u653E\u89C6\u9891..."),
        children: [
          {
            name: "\u5B66\u4E60\u8BBE\u7F6E",
            el: () => StudySettingPanel
          },
          createTerminalPanel()
        ]
      },
      {
        name: "\u5B66\u5206\u8BFE\u4F5C\u4E1A\u52A9\u624B",
        url: "**zhihuishu.com/atHomeworkExam/stu/homeworkQ/exerciseList**",
        el: () => createNote("\u8FDB\u5165 \u4F5C\u4E1A\u8BBE\u7F6E\u9762\u677F \u53EF\u4EE5\u8C03\u6574\u4F5C\u4E1A\u8BBE\u7F6E", "5\u79D2\u540E\u81EA\u52A8\u5F00\u59CB\u4F5C\u4E1A..."),
        children: [
          {
            name: "\u4F5C\u4E1A\u8BBE\u7F6E",
            el: () => CreditWorkSettingPanel
          },
          createTerminalPanel(),
          createSearchResultPanel()
        ]
      },
      {
        name: "\u4F5C\u4E1A\u8003\u8BD5\u52A9\u624B",
        url: "**zhihuishu.com/stuExamWeb.html#/webExamList?**",
        el: () => createNote("\u70B9\u51FB\u4EFB\u610F\u4F5C\u4E1A\u53EF\u4EE5\u4F7F\u7528\u4F5C\u4E1A\u529F\u80FD", "\u8003\u8BD5\u53EF\u80FD\u4E0D\u7A33\u5B9A\uFF0C\u8BF7\u5927\u5BB6\u9884\u7559\u5176\u4ED6\u641C\u9898\u65B9\u5F0F", "\u8003\u8BD5\u65F6\u5982\u679C\u6CA1\u6709\u663E\u793A\u8003\u8BD5\u8BBE\u7F6E\u9762\u677F\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u3002")
      }
    ]
  });
  var domToImage = { exports: {} };
  (function(module2) {
    (function(global2) {
      var util = newUtil();
      var inliner = newInliner();
      var fontFaces = newFontFaces();
      var images = newImages();
      var defaultOptions2 = {
        imagePlaceholder: void 0,
        cacheBust: false
      };
      var domtoimage2 = {
        toSvg,
        toPng,
        toJpeg,
        toBlob,
        toPixelData,
        impl: {
          fontFaces,
          images,
          util,
          inliner,
          options: {}
        }
      };
      module2.exports = domtoimage2;
      function toSvg(node, options) {
        options = options || {};
        copyOptions(options);
        return Promise.resolve(node).then(function(node2) {
          return cloneNode(node2, options.filter, true);
        }).then(embedFonts).then(inlineImages).then(applyOptions2).then(function(clone) {
          return makeSvgDataUri(clone, options.width || util.width(node), options.height || util.height(node));
        });
        function applyOptions2(clone) {
          if (options.bgcolor)
            clone.style.backgroundColor = options.bgcolor;
          if (options.width)
            clone.style.width = options.width + "px";
          if (options.height)
            clone.style.height = options.height + "px";
          if (options.style)
            Object.keys(options.style).forEach(function(property) {
              clone.style[property] = options.style[property];
            });
          return clone;
        }
      }
      function toPixelData(node, options) {
        return draw(node, options || {}).then(function(canvas) {
          return canvas.getContext("2d").getImageData(0, 0, util.width(node), util.height(node)).data;
        });
      }
      function toPng(node, options) {
        return draw(node, options || {}).then(function(canvas) {
          return canvas.toDataURL();
        });
      }
      function toJpeg(node, options) {
        options = options || {};
        return draw(node, options).then(function(canvas) {
          return canvas.toDataURL("image/jpeg", options.quality || 1);
        });
      }
      function toBlob(node, options) {
        return draw(node, options || {}).then(util.canvasToBlob);
      }
      function copyOptions(options) {
        if (typeof options.imagePlaceholder === "undefined") {
          domtoimage2.impl.options.imagePlaceholder = defaultOptions2.imagePlaceholder;
        } else {
          domtoimage2.impl.options.imagePlaceholder = options.imagePlaceholder;
        }
        if (typeof options.cacheBust === "undefined") {
          domtoimage2.impl.options.cacheBust = defaultOptions2.cacheBust;
        } else {
          domtoimage2.impl.options.cacheBust = options.cacheBust;
        }
      }
      function draw(domNode, options) {
        return toSvg(domNode, options).then(util.makeImage).then(util.delay(100)).then(function(image) {
          var canvas = newCanvas(domNode);
          canvas.getContext("2d").drawImage(image, 0, 0);
          return canvas;
        });
        function newCanvas(domNode2) {
          var canvas = document.createElement("canvas");
          canvas.width = options.width || util.width(domNode2);
          canvas.height = options.height || util.height(domNode2);
          if (options.bgcolor) {
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = options.bgcolor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          return canvas;
        }
      }
      function cloneNode(node, filter, root2) {
        if (!root2 && filter && !filter(node))
          return Promise.resolve();
        return Promise.resolve(node).then(makeNodeCopy).then(function(clone) {
          return cloneChildren(node, clone, filter);
        }).then(function(clone) {
          return processClone(node, clone);
        });
        function makeNodeCopy(node2) {
          if (node2 instanceof HTMLCanvasElement)
            return util.makeImage(node2.toDataURL());
          return node2.cloneNode(false);
        }
        function cloneChildren(original, clone, filter2) {
          var children = original.childNodes;
          if (children.length === 0)
            return Promise.resolve(clone);
          return cloneChildrenInOrder(clone, util.asArray(children), filter2).then(function() {
            return clone;
          });
          function cloneChildrenInOrder(parent, children2, filter3) {
            var done = Promise.resolve();
            children2.forEach(function(child) {
              done = done.then(function() {
                return cloneNode(child, filter3);
              }).then(function(childClone) {
                if (childClone)
                  parent.appendChild(childClone);
              });
            });
            return done;
          }
        }
        function processClone(original, clone) {
          if (!(clone instanceof Element))
            return clone;
          return Promise.resolve().then(cloneStyle).then(clonePseudoElements).then(copyUserInput).then(fixSvg).then(function() {
            return clone;
          });
          function cloneStyle() {
            copyStyle(window.getComputedStyle(original), clone.style);
            function copyStyle(source, target) {
              if (source.cssText)
                target.cssText = source.cssText;
              else
                copyProperties(source, target);
              function copyProperties(source2, target2) {
                util.asArray(source2).forEach(function(name2) {
                  target2.setProperty(name2, source2.getPropertyValue(name2), source2.getPropertyPriority(name2));
                });
              }
            }
          }
          function clonePseudoElements() {
            [":before", ":after"].forEach(function(element) {
              clonePseudoElement(element);
            });
            function clonePseudoElement(element) {
              var style = window.getComputedStyle(original, element);
              var content = style.getPropertyValue("content");
              if (content === "" || content === "none")
                return;
              var className = util.uid();
              clone.className = clone.className + " " + className;
              var styleElement = document.createElement("style");
              styleElement.appendChild(formatPseudoElementStyle(className, element, style));
              clone.appendChild(styleElement);
              function formatPseudoElementStyle(className2, element2, style2) {
                var selector = "." + className2 + ":" + element2;
                var cssText = style2.cssText ? formatCssText(style2) : formatCssProperties(style2);
                return document.createTextNode(selector + "{" + cssText + "}");
                function formatCssText(style3) {
                  var content2 = style3.getPropertyValue("content");
                  return style3.cssText + " content: " + content2 + ";";
                }
                function formatCssProperties(style3) {
                  return util.asArray(style3).map(formatProperty).join("; ") + ";";
                  function formatProperty(name2) {
                    return name2 + ": " + style3.getPropertyValue(name2) + (style3.getPropertyPriority(name2) ? " !important" : "");
                  }
                }
              }
            }
          }
          function copyUserInput() {
            if (original instanceof HTMLTextAreaElement)
              clone.innerHTML = original.value;
            if (original instanceof HTMLInputElement)
              clone.setAttribute("value", original.value);
          }
          function fixSvg() {
            if (!(clone instanceof SVGElement))
              return;
            clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            if (!(clone instanceof SVGRectElement))
              return;
            ["width", "height"].forEach(function(attribute) {
              var value = clone.getAttribute(attribute);
              if (!value)
                return;
              clone.style.setProperty(attribute, value);
            });
          }
        }
      }
      function embedFonts(node) {
        return fontFaces.resolveAll().then(function(cssText) {
          var styleNode = document.createElement("style");
          node.appendChild(styleNode);
          styleNode.appendChild(document.createTextNode(cssText));
          return node;
        });
      }
      function inlineImages(node) {
        return images.inlineAll(node).then(function() {
          return node;
        });
      }
      function makeSvgDataUri(node, width, height) {
        return Promise.resolve(node).then(function(node2) {
          node2.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
          return new XMLSerializer().serializeToString(node2);
        }).then(util.escapeXhtml).then(function(xhtml) {
          return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + "</foreignObject>";
        }).then(function(foreignObject) {
          return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' + foreignObject + "</svg>";
        }).then(function(svg) {
          return "data:image/svg+xml;charset=utf-8," + svg;
        });
      }
      function newUtil() {
        return {
          escape: escape2,
          parseExtension,
          mimeType,
          dataAsUrl,
          isDataUrl,
          canvasToBlob,
          resolveUrl: resolveUrl2,
          getAndEncode,
          uid: uid2(),
          delay,
          asArray,
          escapeXhtml,
          makeImage,
          width,
          height
        };
        function mimes() {
          var WOFF = "application/font-woff";
          var JPEG = "image/jpeg";
          return {
            "woff": WOFF,
            "woff2": WOFF,
            "ttf": "application/font-truetype",
            "eot": "application/vnd.ms-fontobject",
            "png": "image/png",
            "jpg": JPEG,
            "jpeg": JPEG,
            "gif": "image/gif",
            "tiff": "image/tiff",
            "svg": "image/svg+xml"
          };
        }
        function parseExtension(url) {
          var match = /\.([^\.\/]*?)$/g.exec(url);
          if (match)
            return match[1];
          else
            return "";
        }
        function mimeType(url) {
          var extension = parseExtension(url).toLowerCase();
          return mimes()[extension] || "";
        }
        function isDataUrl(url) {
          return url.search(/^(data:)/) !== -1;
        }
        function toBlob2(canvas) {
          return new Promise(function(resolve2) {
            var binaryString = window.atob(canvas.toDataURL().split(",")[1]);
            var length = binaryString.length;
            var binaryArray = new Uint8Array(length);
            for (var i = 0; i < length; i++)
              binaryArray[i] = binaryString.charCodeAt(i);
            resolve2(new Blob([binaryArray], {
              type: "image/png"
            }));
          });
        }
        function canvasToBlob(canvas) {
          if (canvas.toBlob)
            return new Promise(function(resolve2) {
              canvas.toBlob(resolve2);
            });
          return toBlob2(canvas);
        }
        function resolveUrl2(url, baseUrl) {
          var doc2 = document.implementation.createHTMLDocument();
          var base = doc2.createElement("base");
          doc2.head.appendChild(base);
          var a = doc2.createElement("a");
          doc2.body.appendChild(a);
          base.href = baseUrl;
          a.href = url;
          return a.href;
        }
        function uid2() {
          var index2 = 0;
          return function() {
            return "u" + fourRandomChars() + index2++;
            function fourRandomChars() {
              return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
            }
          };
        }
        function makeImage(uri) {
          return new Promise(function(resolve2, reject) {
            var image = new Image();
            image.onload = function() {
              resolve2(image);
            };
            image.onerror = reject;
            image.src = uri;
          });
        }
        function getAndEncode(url) {
          var TIMEOUT = 3e4;
          if (domtoimage2.impl.options.cacheBust) {
            url += (/\?/.test(url) ? "&" : "?") + new Date().getTime();
          }
          return new Promise(function(resolve2) {
            var request2 = new XMLHttpRequest();
            request2.onreadystatechange = done;
            request2.ontimeout = timeout;
            request2.responseType = "blob";
            request2.timeout = TIMEOUT;
            request2.open("GET", url, true);
            request2.send();
            var placeholder;
            if (domtoimage2.impl.options.imagePlaceholder) {
              var split = domtoimage2.impl.options.imagePlaceholder.split(/,/);
              if (split && split[1]) {
                placeholder = split[1];
              }
            }
            function done() {
              if (request2.readyState !== 4)
                return;
              if (request2.status !== 200) {
                if (placeholder) {
                  resolve2(placeholder);
                } else {
                  fail("cannot fetch resource: " + url + ", status: " + request2.status);
                }
                return;
              }
              var encoder = new FileReader();
              encoder.onloadend = function() {
                var content = encoder.result.split(/,/)[1];
                resolve2(content);
              };
              encoder.readAsDataURL(request2.response);
            }
            function timeout() {
              if (placeholder) {
                resolve2(placeholder);
              } else {
                fail("timeout of " + TIMEOUT + "ms occured while fetching resource: " + url);
              }
            }
            function fail(message2) {
              console.error(message2);
              resolve2("");
            }
          });
        }
        function dataAsUrl(content, type) {
          return "data:" + type + ";base64," + content;
        }
        function escape2(string) {
          return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
        }
        function delay(ms) {
          return function(arg) {
            return new Promise(function(resolve2) {
              setTimeout(function() {
                resolve2(arg);
              }, ms);
            });
          };
        }
        function asArray(arrayLike) {
          var array = [];
          var length = arrayLike.length;
          for (var i = 0; i < length; i++)
            array.push(arrayLike[i]);
          return array;
        }
        function escapeXhtml(string) {
          return string.replace(/#/g, "%23").replace(/\n/g, "%0A");
        }
        function width(node) {
          var leftBorder = px(node, "border-left-width");
          var rightBorder = px(node, "border-right-width");
          return node.scrollWidth + leftBorder + rightBorder;
        }
        function height(node) {
          var topBorder = px(node, "border-top-width");
          var bottomBorder = px(node, "border-bottom-width");
          return node.scrollHeight + topBorder + bottomBorder;
        }
        function px(node, styleProperty) {
          var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
          return parseFloat(value.replace("px", ""));
        }
      }
      function newInliner() {
        var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;
        return {
          inlineAll,
          shouldProcess,
          impl: {
            readUrls,
            inline
          }
        };
        function shouldProcess(string) {
          return string.search(URL_REGEX) !== -1;
        }
        function readUrls(string) {
          var result = [];
          var match;
          while ((match = URL_REGEX.exec(string)) !== null) {
            result.push(match[1]);
          }
          return result.filter(function(url) {
            return !util.isDataUrl(url);
          });
        }
        function inline(string, url, baseUrl, get2) {
          return Promise.resolve(url).then(function(url2) {
            return baseUrl ? util.resolveUrl(url2, baseUrl) : url2;
          }).then(get2 || util.getAndEncode).then(function(data) {
            return util.dataAsUrl(data, util.mimeType(url));
          }).then(function(dataUrl) {
            return string.replace(urlAsRegex(url), "$1" + dataUrl + "$3");
          });
          function urlAsRegex(url2) {
            return new RegExp(`(url\\(['"]?)(` + util.escape(url2) + `)(['"]?\\))`, "g");
          }
        }
        function inlineAll(string, baseUrl, get2) {
          if (nothingToInline())
            return Promise.resolve(string);
          return Promise.resolve(string).then(readUrls).then(function(urls) {
            var done = Promise.resolve(string);
            urls.forEach(function(url) {
              done = done.then(function(string2) {
                return inline(string2, url, baseUrl, get2);
              });
            });
            return done;
          });
          function nothingToInline() {
            return !shouldProcess(string);
          }
        }
      }
      function newFontFaces() {
        return {
          resolveAll,
          impl: {
            readAll
          }
        };
        function resolveAll() {
          return readAll().then(function(webFonts) {
            return Promise.all(webFonts.map(function(webFont) {
              return webFont.resolve();
            }));
          }).then(function(cssStrings) {
            return cssStrings.join("\n");
          });
        }
        function readAll() {
          return Promise.resolve(util.asArray(document.styleSheets)).then(getCssRules).then(selectWebFontRules).then(function(rules) {
            return rules.map(newWebFont);
          });
          function selectWebFontRules(cssRules) {
            return cssRules.filter(function(rule) {
              return rule.type === CSSRule.FONT_FACE_RULE;
            }).filter(function(rule) {
              return inliner.shouldProcess(rule.style.getPropertyValue("src"));
            });
          }
          function getCssRules(styleSheets) {
            var cssRules = [];
            styleSheets.forEach(function(sheet) {
              try {
                util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
              } catch (e) {
                console.log("Error while reading CSS rules from " + sheet.href, e.toString());
              }
            });
            return cssRules;
          }
          function newWebFont(webFontRule) {
            return {
              resolve: function resolve2() {
                var baseUrl = (webFontRule.parentStyleSheet || {}).href;
                return inliner.inlineAll(webFontRule.cssText, baseUrl);
              },
              src: function() {
                return webFontRule.style.getPropertyValue("src");
              }
            };
          }
        }
      }
      function newImages() {
        return {
          inlineAll,
          impl: {
            newImage
          }
        };
        function newImage(element) {
          return {
            inline
          };
          function inline(get2) {
            if (util.isDataUrl(element.src))
              return Promise.resolve();
            return Promise.resolve(element.src).then(get2 || util.getAndEncode).then(function(data) {
              return util.dataAsUrl(data, util.mimeType(element.src));
            }).then(function(dataUrl) {
              return new Promise(function(resolve2, reject) {
                element.onload = resolve2;
                element.onerror = reject;
                element.src = dataUrl;
              });
            });
          }
        }
        function inlineAll(node) {
          if (!(node instanceof Element))
            return Promise.resolve(node);
          return inlineBackground(node).then(function() {
            if (node instanceof HTMLImageElement)
              return newImage(node).inline();
            else
              return Promise.all(util.asArray(node.childNodes).map(function(child) {
                return inlineAll(child);
              }));
          });
          function inlineBackground(node2) {
            var background = node2.style.getPropertyValue("background");
            if (!background)
              return Promise.resolve(node2);
            return inliner.inlineAll(background).then(function(inlined) {
              node2.style.setProperty("background", inlined, node2.style.getPropertyPriority("background"));
            }).then(function() {
              return node2;
            });
          }
        }
      }
    })();
  })(domToImage);
  var domtoimage = domToImage.exports;
  var runtime = { exports: {} };
  (function(module2) {
    var runtime2 = function(exports3) {
      var Op = Object.prototype;
      var hasOwn2 = Op.hasOwnProperty;
      var undefined$1;
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
      function define2(obj, key, value) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }
      try {
        define2({}, "");
      } catch (err) {
        define2 = function(obj, key, value) {
          return obj[key] = value;
        };
      }
      function wrap(innerFn, outerFn, self2, tryLocsList) {
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);
        generator._invoke = makeInvokeMethod(innerFn, self2, context);
        return generator;
      }
      exports3.wrap = wrap;
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }
      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";
      var ContinueSentinel = {};
      function Generator() {
      }
      function GeneratorFunction() {
      }
      function GeneratorFunctionPrototype() {
      }
      var IteratorPrototype = {};
      define2(IteratorPrototype, iteratorSymbol, function() {
        return this;
      });
      var getProto2 = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto2 && getProto2(getProto2(values([])));
      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn2.call(NativeIteratorPrototype, iteratorSymbol)) {
        IteratorPrototype = NativeIteratorPrototype;
      }
      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      define2(Gp, "constructor", GeneratorFunctionPrototype);
      define2(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
      GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          define2(prototype, method, function(arg) {
            return this._invoke(method, arg);
          });
        });
      }
      exports3.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };
      exports3.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define2(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };
      exports3.awrap = function(arg) {
        return { __await: arg };
      };
      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve2, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value && typeof value === "object" && hasOwn2.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function(value2) {
                invoke("next", value2, resolve2, reject);
              }, function(err) {
                invoke("throw", err, resolve2, reject);
              });
            }
            return PromiseImpl.resolve(value).then(function(unwrapped) {
              result.value = unwrapped;
              resolve2(result);
            }, function(error) {
              return invoke("throw", error, resolve2, reject);
            });
          }
        }
        var previousPromise;
        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve2, reject) {
              invoke(method, arg, resolve2, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
        this._invoke = enqueue;
      }
      defineIteratorMethods(AsyncIterator.prototype);
      define2(AsyncIterator.prototype, asyncIteratorSymbol, function() {
        return this;
      });
      exports3.AsyncIterator = AsyncIterator;
      exports3.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0)
          PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList), PromiseImpl);
        return exports3.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
      };
      function makeInvokeMethod(innerFn, self2, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }
          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }
            return doneResult();
          }
          context.method = method;
          context.arg = arg;
          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel)
                  continue;
                return delegateResult;
              }
            }
            if (context.method === "next") {
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }
              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }
            state = GenStateExecuting;
            var record = tryCatch(innerFn, self2, context);
            if (record.type === "normal") {
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;
              if (record.arg === ContinueSentinel) {
                continue;
              }
              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted;
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }
      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined$1) {
          context.delegate = null;
          if (context.method === "throw") {
            if (delegate.iterator["return"]) {
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);
              if (context.method === "throw") {
                return ContinueSentinel;
              }
            }
            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }
          return ContinueSentinel;
        }
        var record = tryCatch(method, delegate.iterator, context.arg);
        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }
        var info = record.arg;
        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }
        if (info.done) {
          context[delegate.resultName] = info.value;
          context.next = delegate.nextLoc;
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          return info;
        }
        context.delegate = null;
        return ContinueSentinel;
      }
      defineIteratorMethods(Gp);
      define2(Gp, toStringTagSymbol, "Generator");
      define2(Gp, iteratorSymbol, function() {
        return this;
      });
      define2(Gp, "toString", function() {
        return "[object Generator]";
      });
      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };
        if (1 in locs) {
          entry.catchLoc = locs[1];
        }
        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }
        this.tryEntries.push(entry);
      }
      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }
      function Context(tryLocsList) {
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }
      exports3.keys = function(object) {
        var keys2 = [];
        for (var key in object) {
          keys2.push(key);
        }
        keys2.reverse();
        return function next() {
          while (keys2.length) {
            var key2 = keys2.pop();
            if (key2 in object) {
              next.value = key2;
              next.done = false;
              return next;
            }
          }
          next.done = true;
          return next;
        };
      };
      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }
          if (typeof iterable.next === "function") {
            return iterable;
          }
          if (!isNaN(iterable.length)) {
            var i = -1, next = function next2() {
              while (++i < iterable.length) {
                if (hasOwn2.call(iterable, i)) {
                  next2.value = iterable[i];
                  next2.done = false;
                  return next2;
                }
              }
              next2.value = undefined$1;
              next2.done = true;
              return next2;
            };
            return next.next = next;
          }
        }
        return { next: doneResult };
      }
      exports3.values = values;
      function doneResult() {
        return { value: undefined$1, done: true };
      }
      Context.prototype = {
        constructor: Context,
        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);
          if (!skipTempReset) {
            for (var name2 in this) {
              if (name2.charAt(0) === "t" && hasOwn2.call(this, name2) && !isNaN(+name2.slice(1))) {
                this[name2] = undefined$1;
              }
            }
          }
        },
        stop: function() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }
          return this.rval;
        },
        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }
          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;
            if (caught) {
              context.method = "next";
              context.arg = undefined$1;
            }
            return !!caught;
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;
            if (entry.tryLoc === "root") {
              return handle("end");
            }
            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn2.call(entry, "catchLoc");
              var hasFinally = hasOwn2.call(entry, "finallyLoc");
              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev && hasOwn2.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }
          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            finallyEntry = null;
          }
          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;
          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }
          return this.complete(record);
        },
        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }
          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }
          return ContinueSentinel;
        },
        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName,
            nextLoc
          };
          if (this.method === "next") {
            this.arg = undefined$1;
          }
          return ContinueSentinel;
        }
      };
      return exports3;
    }(module2.exports);
    try {
      regeneratorRuntime = runtime2;
    } catch (accidentalStrictMode) {
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime2;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime2);
      }
    }
  })(runtime);
  var getId$3 = (prefix, cnt) => `${prefix}-${cnt}-${Math.random().toString(16).slice(3, 8)}`;
  const getId$2 = getId$3;
  let jobCounter = 0;
  var createJob$2 = ({
    id: _id,
    action,
    payload = {}
  }) => {
    let id = _id;
    if (typeof id === "undefined") {
      id = getId$2("Job", jobCounter);
      jobCounter += 1;
    }
    return {
      id,
      action,
      payload
    };
  };
  var log$2 = {};
  let logging = false;
  log$2.logging = logging;
  log$2.setLogging = (_logging) => {
    logging = _logging;
  };
  log$2.log = (...args) => logging ? console.log.apply(globalThis, args) : null;
  const createJob$1 = createJob$2;
  const { log: log$1 } = log$2;
  const getId$1 = getId$3;
  let schedulerCounter = 0;
  var createScheduler$1 = () => {
    const id = getId$1("Scheduler", schedulerCounter);
    const workers = {};
    const runningWorkers = {};
    let jobQueue = [];
    schedulerCounter += 1;
    const getQueueLen = () => jobQueue.length;
    const getNumWorkers = () => Object.keys(workers).length;
    const dequeue = () => {
      if (jobQueue.length !== 0) {
        const wIds = Object.keys(workers);
        for (let i = 0; i < wIds.length; i += 1) {
          if (typeof runningWorkers[wIds[i]] === "undefined") {
            jobQueue[0](workers[wIds[i]]);
            break;
          }
        }
      }
    };
    const queue2 = (action, payload) => new Promise((resolve2, reject) => {
      const job = createJob$1({ action, payload });
      jobQueue.push(async (w) => {
        jobQueue.shift();
        runningWorkers[w.id] = job;
        try {
          resolve2(await w[action].apply(globalThis, [...payload, job.id]));
        } catch (err) {
          reject(err);
        } finally {
          delete runningWorkers[w.id];
          dequeue();
        }
      });
      log$1(`[${id}]: Add ${job.id} to JobQueue`);
      log$1(`[${id}]: JobQueue length=${jobQueue.length}`);
      dequeue();
    });
    const addWorker = (w) => {
      workers[w.id] = w;
      log$1(`[${id}]: Add ${w.id}`);
      log$1(`[${id}]: Number of workers=${getNumWorkers()}`);
      dequeue();
      return w.id;
    };
    const addJob = async (action, ...payload) => {
      if (getNumWorkers() === 0) {
        throw Error(`[${id}]: You need to have at least one worker before adding jobs`);
      }
      return queue2(action, payload);
    };
    const terminate = async () => {
      Object.keys(workers).forEach(async (wid) => {
        await workers[wid].terminate();
      });
      jobQueue = [];
    };
    return {
      addWorker,
      addJob,
      terminate,
      getQueueLen,
      getNumWorkers
    };
  };
  function isElectron$1() {
    if (typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer") {
      return true;
    }
    if (typeof process !== "undefined" && typeof process.versions === "object" && !!process.versions.electron) {
      return true;
    }
    if (typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0) {
      return true;
    }
    return false;
  }
  var isElectron_1 = isElectron$1;
  const isElectron = isElectron_1;
  var getEnvironment = (key) => {
    const env = {};
    if (typeof WorkerGlobalScope !== "undefined") {
      env.type = "webworker";
    } else if (isElectron()) {
      env.type = "electron";
    } else if (typeof window === "object") {
      env.type = "browser";
    } else if (typeof process === "object" && typeof commonjsRequire === "function") {
      env.type = "node";
    }
    if (typeof key === "undefined") {
      return env;
    }
    return env[key];
  };
  var resolveUrl = { exports: {} };
  (function(module2, exports3) {
    void function(root2, factory) {
      {
        module2.exports = factory();
      }
    }(commonjsGlobal, function() {
      function resolveUrl2() {
        var numUrls = arguments.length;
        if (numUrls === 0) {
          throw new Error("resolveUrl requires at least one argument; got none.");
        }
        var base = document.createElement("base");
        base.href = arguments[0];
        if (numUrls === 1) {
          return base.href;
        }
        var head = document.getElementsByTagName("head")[0];
        head.insertBefore(base, head.firstChild);
        var a = document.createElement("a");
        var resolved;
        for (var index2 = 1; index2 < numUrls; index2++) {
          a.href = arguments[index2];
          resolved = a.href;
          base.href = resolved;
        }
        head.removeChild(base);
        return resolved;
      }
      return resolveUrl2;
    });
  })(resolveUrl);
  const isBrowser = getEnvironment("type") === "browser";
  const resolveURL$2 = isBrowser ? resolveUrl.exports : (s) => s;
  var resolvePaths$1 = (options) => {
    const opts = __spreadValues({}, options);
    ["corePath", "workerPath", "langPath"].forEach((key) => {
      if (typeof options[key] !== "undefined") {
        opts[key] = resolveURL$2(opts[key]);
      }
    });
    return opts;
  };
  var circularize$1 = (page) => {
    const blocks = [];
    const paragraphs = [];
    const lines = [];
    const words = [];
    const symbols = [];
    page.blocks.forEach((block) => {
      block.paragraphs.forEach((paragraph) => {
        paragraph.lines.forEach((line) => {
          line.words.forEach((word) => {
            word.symbols.forEach((sym) => {
              symbols.push(__spreadProps(__spreadValues({}, sym), {
                page,
                block,
                paragraph,
                line,
                word
              }));
            });
            words.push(__spreadProps(__spreadValues({}, word), {
              page,
              block,
              paragraph,
              line
            }));
          });
          lines.push(__spreadProps(__spreadValues({}, line), {
            page,
            block,
            paragraph
          }));
        });
        paragraphs.push(__spreadProps(__spreadValues({}, paragraph), {
          page,
          block
        }));
      });
      blocks.push(__spreadProps(__spreadValues({}, block), {
        page
      }));
    });
    return __spreadProps(__spreadValues({}, page), {
      blocks,
      paragraphs,
      lines,
      words,
      symbols
    });
  };
  var OEM$2 = {
    TESSERACT_ONLY: 0,
    LSTM_ONLY: 1,
    TESSERACT_LSTM_COMBINED: 2,
    DEFAULT: 3
  };
  const OEM$1 = OEM$2;
  var config = {
    defaultOEM: OEM$1.DEFAULT
  };
  const name = "tesseract.js";
  const version$1 = "2.1.5";
  const description = "Pure Javascript Multilingual OCR";
  const main = "src/index.js";
  const types = "src/index.d.ts";
  const unpkg = "dist/tesseract.min.js";
  const jsdelivr = "dist/tesseract.min.js";
  const scripts = {
    start: "node scripts/server.js",
    build: "rimraf dist && webpack --config scripts/webpack.config.prod.js",
    "profile:tesseract": "webpack-bundle-analyzer dist/tesseract-stats.json",
    "profile:worker": "webpack-bundle-analyzer dist/worker-stats.json",
    prepublishOnly: "npm run build",
    wait: "rimraf dist && wait-on http://localhost:3000/dist/tesseract.dev.js",
    test: "npm-run-all -p -r start test:all",
    "test:all": "npm-run-all wait test:browser:* test:node:all",
    "test:node": "nyc mocha --exit --bail --require ./scripts/test-helper.js",
    "test:node:all": "npm run test:node -- ./tests/*.test.js",
    "test:browser-tpl": "mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000",
    "test:browser:detect": "npm run test:browser-tpl -- -f ./tests/detect.test.html",
    "test:browser:recognize": "npm run test:browser-tpl -- -f ./tests/recognize.test.html",
    "test:browser:scheduler": "npm run test:browser-tpl -- -f ./tests/scheduler.test.html",
    "test:browser:FS": "npm run test:browser-tpl -- -f ./tests/FS.test.html",
    lint: "eslint src",
    "lint:fix": "eslint --fix src",
    postinstall: "opencollective-postinstall || true"
  };
  const browser$1 = {
    "./src/worker/node/index.js": "./src/worker/browser/index.js"
  };
  const author = "";
  const contributors = [
    "jeromewu"
  ];
  const license = "Apache-2.0";
  const devDependencies = {
    "@babel/core": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    acorn: "^6.4.0",
    "babel-loader": "^8.1.0",
    cors: "^2.8.5",
    eslint: "^7.2.0",
    "eslint-config-airbnb-base": "^14.2.0",
    "eslint-plugin-import": "^2.22.1",
    "expect.js": "^0.3.1",
    express: "^4.17.1",
    mocha: "^8.1.3",
    "mocha-headless-chrome": "^2.0.3",
    "npm-run-all": "^4.1.5",
    nyc: "^15.1.0",
    rimraf: "^2.7.1",
    "wait-on": "^3.3.0",
    webpack: "^4.44.2",
    "webpack-bundle-analyzer": "^3.6.0",
    "webpack-cli": "^3.3.12",
    "webpack-dev-middleware": "^3.7.2"
  };
  const dependencies$1 = {
    "blueimp-load-image": "^3.0.0",
    "bmp-js": "^0.1.0",
    "file-type": "^12.4.1",
    "idb-keyval": "^3.2.0",
    "is-electron": "^2.2.0",
    "is-url": "^1.2.4",
    "jpeg-autorotate": "^7.1.1",
    "node-fetch": "^2.6.0",
    "opencollective-postinstall": "^2.0.2",
    "regenerator-runtime": "^0.13.3",
    "resolve-url": "^0.2.1",
    "tesseract.js-core": "^2.2.0",
    zlibjs: "^0.3.1"
  };
  const repository = {
    type: "git",
    url: "https://github.com/naptha/tesseract.js.git"
  };
  const bugs = {
    url: "https://github.com/naptha/tesseract.js/issues"
  };
  const homepage = "https://github.com/naptha/tesseract.js";
  const collective = {
    type: "opencollective",
    url: "https://opencollective.com/tesseractjs"
  };
  var require$1 = {
    name,
    version: version$1,
    description,
    main,
    types,
    unpkg,
    jsdelivr,
    scripts,
    browser: browser$1,
    author,
    contributors,
    license,
    devDependencies,
    dependencies: dependencies$1,
    repository,
    bugs,
    homepage,
    collective
  };
  var defaultOptions$3 = {
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    workerBlobURL: true,
    logger: () => {
    }
  };
  const resolveURL$1 = resolveUrl.exports;
  const { version, dependencies } = require$1;
  const defaultOptions$2 = defaultOptions$3;
  var defaultOptions_1 = __spreadProps(__spreadValues({}, defaultOptions$2), {
    workerPath: typeof process !== "undefined" && {}.TESS_ENV === "development" ? resolveURL$1(`/dist/worker.dev.js?nocache=${Math.random().toString(36).slice(3)}`) : `https://unpkg.com/tesseract.js@v${version}/dist/worker.min.js`,
    corePath: `https://unpkg.com/tesseract.js-core@v${dependencies["tesseract.js-core"].substring(1)}/tesseract-core.${typeof WebAssembly === "object" ? "wasm" : "asm"}.js`
  });
  var spawnWorker$2 = ({ workerPath, workerBlobURL }) => {
    let worker;
    if (Blob && URL && workerBlobURL) {
      const blob = new Blob([`importScripts("${workerPath}");`], {
        type: "application/javascript"
      });
      worker = new Worker(URL.createObjectURL(blob));
    } else {
      worker = new Worker(workerPath);
    }
    return worker;
  };
  var terminateWorker$2 = (worker) => {
    worker.terminate();
  };
  var onMessage$2 = (worker, handler) => {
    worker.onmessage = ({ data }) => {
      handler(data);
    };
  };
  var send$2 = async (worker, packet) => {
    worker.postMessage(packet);
  };
  var loadImage$3 = { exports: {} };
  (function(module2) {
    (function($) {
      function loadImage2(file, callback, options) {
        var img = document.createElement("img");
        var url;
        function fetchBlobCallback(blob, err) {
          if (err)
            console.log(err);
          if (blob && loadImage2.isInstanceOf("Blob", blob)) {
            file = blob;
            url = loadImage2.createObjectURL(file);
          } else {
            url = file;
            if (options && options.crossOrigin) {
              img.crossOrigin = options.crossOrigin;
            }
          }
          img.src = url;
        }
        img.onerror = function(event) {
          return loadImage2.onerror(img, event, file, url, callback, options);
        };
        img.onload = function(event) {
          return loadImage2.onload(img, event, file, url, callback, options);
        };
        if (typeof file === "string") {
          if (loadImage2.hasMetaOption(options)) {
            loadImage2.fetchBlob(file, fetchBlobCallback, options);
          } else {
            fetchBlobCallback();
          }
          return img;
        } else if (loadImage2.isInstanceOf("Blob", file) || loadImage2.isInstanceOf("File", file)) {
          url = loadImage2.createObjectURL(file);
          if (url) {
            img.src = url;
            return img;
          }
          return loadImage2.readFile(file, function(e) {
            var target = e.target;
            if (target && target.result) {
              img.src = target.result;
            } else if (callback) {
              callback(e);
            }
          });
        }
      }
      var urlAPI = $.createObjectURL && $ || $.URL && URL.revokeObjectURL && URL || $.webkitURL && webkitURL;
      function revokeHelper(url, options) {
        if (url && url.slice(0, 5) === "blob:" && !(options && options.noRevoke)) {
          loadImage2.revokeObjectURL(url);
        }
      }
      loadImage2.hasMetaOption = function(options) {
        return options && options.meta;
      };
      loadImage2.fetchBlob = function(url, callback) {
        callback();
      };
      loadImage2.isInstanceOf = function(type, obj) {
        return Object.prototype.toString.call(obj) === "[object " + type + "]";
      };
      loadImage2.transform = function(img, options, callback, file, data) {
        callback(img, data);
      };
      loadImage2.onerror = function(img, event, file, url, callback, options) {
        revokeHelper(url, options);
        if (callback) {
          callback.call(img, event);
        }
      };
      loadImage2.onload = function(img, event, file, url, callback, options) {
        revokeHelper(url, options);
        if (callback) {
          loadImage2.transform(img, options, callback, file, {
            originalWidth: img.naturalWidth || img.width,
            originalHeight: img.naturalHeight || img.height
          });
        }
      };
      loadImage2.createObjectURL = function(file) {
        return urlAPI ? urlAPI.createObjectURL(file) : false;
      };
      loadImage2.revokeObjectURL = function(url) {
        return urlAPI ? urlAPI.revokeObjectURL(url) : false;
      };
      loadImage2.readFile = function(file, callback, method) {
        if ($.FileReader) {
          var fileReader = new FileReader();
          fileReader.onload = fileReader.onerror = callback;
          method = method || "readAsDataURL";
          if (fileReader[method]) {
            fileReader[method](file);
            return fileReader;
          }
        }
        return false;
      };
      if (module2.exports) {
        module2.exports = loadImage2;
      } else {
        $.loadImage = loadImage2;
      }
    })(typeof window !== "undefined" && window || commonjsGlobal);
  })(loadImage$3);
  var loadImageScale = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      var originalTransform = loadImage2.transform;
      loadImage2.transform = function(img, options, callback, file, data) {
        originalTransform.call(loadImage2, loadImage2.scale(img, options, data), options, callback, file, data);
      };
      loadImage2.transformCoordinates = function() {
      };
      loadImage2.getTransformedOptions = function(img, options) {
        var aspectRatio = options.aspectRatio;
        var newOptions;
        var i;
        var width;
        var height;
        if (!aspectRatio) {
          return options;
        }
        newOptions = {};
        for (i in options) {
          if (Object.prototype.hasOwnProperty.call(options, i)) {
            newOptions[i] = options[i];
          }
        }
        newOptions.crop = true;
        width = img.naturalWidth || img.width;
        height = img.naturalHeight || img.height;
        if (width / height > aspectRatio) {
          newOptions.maxWidth = height * aspectRatio;
          newOptions.maxHeight = height;
        } else {
          newOptions.maxWidth = width;
          newOptions.maxHeight = width / aspectRatio;
        }
        return newOptions;
      };
      loadImage2.renderImageToCanvas = function(canvas, img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, options) {
        var ctx = canvas.getContext("2d");
        if (options.imageSmoothingEnabled === false) {
          ctx.imageSmoothingEnabled = false;
        } else if (options.imageSmoothingQuality) {
          ctx.imageSmoothingQuality = options.imageSmoothingQuality;
        }
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        return canvas;
      };
      loadImage2.hasCanvasOption = function(options) {
        return options.canvas || options.crop || !!options.aspectRatio;
      };
      loadImage2.scale = function(img, options, data) {
        options = options || {};
        var canvas = document.createElement("canvas");
        var useCanvas = img.getContext || loadImage2.hasCanvasOption(options) && canvas.getContext;
        var width = img.naturalWidth || img.width;
        var height = img.naturalHeight || img.height;
        var destWidth = width;
        var destHeight = height;
        var maxWidth;
        var maxHeight;
        var minWidth;
        var minHeight;
        var sourceWidth;
        var sourceHeight;
        var sourceX;
        var sourceY;
        var pixelRatio;
        var downsamplingRatio;
        var tmp;
        function scaleUp() {
          var scale = Math.max((minWidth || destWidth) / destWidth, (minHeight || destHeight) / destHeight);
          if (scale > 1) {
            destWidth *= scale;
            destHeight *= scale;
          }
        }
        function scaleDown() {
          var scale = Math.min((maxWidth || destWidth) / destWidth, (maxHeight || destHeight) / destHeight);
          if (scale < 1) {
            destWidth *= scale;
            destHeight *= scale;
          }
        }
        if (useCanvas) {
          options = loadImage2.getTransformedOptions(img, options, data);
          sourceX = options.left || 0;
          sourceY = options.top || 0;
          if (options.sourceWidth) {
            sourceWidth = options.sourceWidth;
            if (options.right !== void 0 && options.left === void 0) {
              sourceX = width - sourceWidth - options.right;
            }
          } else {
            sourceWidth = width - sourceX - (options.right || 0);
          }
          if (options.sourceHeight) {
            sourceHeight = options.sourceHeight;
            if (options.bottom !== void 0 && options.top === void 0) {
              sourceY = height - sourceHeight - options.bottom;
            }
          } else {
            sourceHeight = height - sourceY - (options.bottom || 0);
          }
          destWidth = sourceWidth;
          destHeight = sourceHeight;
        }
        maxWidth = options.maxWidth;
        maxHeight = options.maxHeight;
        minWidth = options.minWidth;
        minHeight = options.minHeight;
        if (useCanvas && maxWidth && maxHeight && options.crop) {
          destWidth = maxWidth;
          destHeight = maxHeight;
          tmp = sourceWidth / sourceHeight - maxWidth / maxHeight;
          if (tmp < 0) {
            sourceHeight = maxHeight * sourceWidth / maxWidth;
            if (options.top === void 0 && options.bottom === void 0) {
              sourceY = (height - sourceHeight) / 2;
            }
          } else if (tmp > 0) {
            sourceWidth = maxWidth * sourceHeight / maxHeight;
            if (options.left === void 0 && options.right === void 0) {
              sourceX = (width - sourceWidth) / 2;
            }
          }
        } else {
          if (options.contain || options.cover) {
            minWidth = maxWidth = maxWidth || minWidth;
            minHeight = maxHeight = maxHeight || minHeight;
          }
          if (options.cover) {
            scaleDown();
            scaleUp();
          } else {
            scaleUp();
            scaleDown();
          }
        }
        if (useCanvas) {
          pixelRatio = options.pixelRatio;
          if (pixelRatio > 1) {
            canvas.style.width = destWidth + "px";
            canvas.style.height = destHeight + "px";
            destWidth *= pixelRatio;
            destHeight *= pixelRatio;
            canvas.getContext("2d").scale(pixelRatio, pixelRatio);
          }
          downsamplingRatio = options.downsamplingRatio;
          if (downsamplingRatio > 0 && downsamplingRatio < 1 && destWidth < sourceWidth && destHeight < sourceHeight) {
            while (sourceWidth * downsamplingRatio > destWidth) {
              canvas.width = sourceWidth * downsamplingRatio;
              canvas.height = sourceHeight * downsamplingRatio;
              loadImage2.renderImageToCanvas(canvas, img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height, options);
              sourceX = 0;
              sourceY = 0;
              sourceWidth = canvas.width;
              sourceHeight = canvas.height;
              img = document.createElement("canvas");
              img.width = sourceWidth;
              img.height = sourceHeight;
              loadImage2.renderImageToCanvas(img, canvas, 0, 0, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight, options);
            }
          }
          canvas.width = destWidth;
          canvas.height = destHeight;
          loadImage2.transformCoordinates(canvas, options);
          return loadImage2.renderImageToCanvas(canvas, img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, destWidth, destHeight, options);
        }
        img.width = destWidth;
        img.height = destHeight;
        return img;
      };
    });
  })(loadImageScale);
  var loadImageMeta = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      var hasblobSlice = typeof Blob !== "undefined" && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice);
      loadImage2.blobSlice = hasblobSlice && function() {
        var slice = this.slice || this.webkitSlice || this.mozSlice;
        return slice.apply(this, arguments);
      };
      loadImage2.metaDataParsers = {
        jpeg: {
          65505: [],
          65517: []
        }
      };
      loadImage2.parseMetaData = function(file, callback, options, data) {
        options = options || {};
        data = data || {};
        var that = this;
        var maxMetaDataSize = options.maxMetaDataSize || 262144;
        var noMetaData = !(typeof DataView !== "undefined" && file && file.size >= 12 && file.type === "image/jpeg" && loadImage2.blobSlice);
        if (noMetaData || !loadImage2.readFile(loadImage2.blobSlice.call(file, 0, maxMetaDataSize), function(e) {
          if (e.target.error) {
            console.log(e.target.error);
            callback(data);
            return;
          }
          var buffer = e.target.result;
          var dataView = new DataView(buffer);
          var offset = 2;
          var maxOffset = dataView.byteLength - 4;
          var headLength = offset;
          var markerBytes;
          var markerLength;
          var parsers;
          var i;
          if (dataView.getUint16(0) === 65496) {
            while (offset < maxOffset) {
              markerBytes = dataView.getUint16(offset);
              if (markerBytes >= 65504 && markerBytes <= 65519 || markerBytes === 65534) {
                markerLength = dataView.getUint16(offset + 2) + 2;
                if (offset + markerLength > dataView.byteLength) {
                  console.log("Invalid meta data: Invalid segment size.");
                  break;
                }
                parsers = loadImage2.metaDataParsers.jpeg[markerBytes];
                if (parsers && !options.disableMetaDataParsers) {
                  for (i = 0; i < parsers.length; i += 1) {
                    parsers[i].call(that, dataView, offset, markerLength, data, options);
                  }
                }
                offset += markerLength;
                headLength = offset;
              } else {
                break;
              }
            }
            if (!options.disableImageHead && headLength > 6) {
              if (buffer.slice) {
                data.imageHead = buffer.slice(0, headLength);
              } else {
                data.imageHead = new Uint8Array(buffer).subarray(0, headLength);
              }
            }
          } else {
            console.log("Invalid JPEG file: Missing JPEG marker.");
          }
          callback(data);
        }, "readAsArrayBuffer")) {
          callback(data);
        }
      };
      loadImage2.replaceHead = function(blob, head, callback) {
        loadImage2.parseMetaData(blob, function(data) {
          callback(new Blob([head, loadImage2.blobSlice.call(blob, data.imageHead.byteLength)], { type: "image/jpeg" }));
        }, { maxMetaDataSize: 256, disableMetaDataParsers: true });
      };
      var originalTransform = loadImage2.transform;
      loadImage2.transform = function(img, options, callback, file, data) {
        if (loadImage2.hasMetaOption(options)) {
          loadImage2.parseMetaData(file, function(data2) {
            originalTransform.call(loadImage2, img, options, callback, file, data2);
          }, options, data);
        } else {
          originalTransform.apply(loadImage2, arguments);
        }
      };
    });
  })(loadImageMeta);
  var loadImageFetch = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      if (typeof fetch !== "undefined" && typeof Request !== "undefined") {
        loadImage2.fetchBlob = function(url, callback, options) {
          fetch(new Request(url, options)).then(function(response) {
            return response.blob();
          }).then(callback).catch(function(err) {
            callback(null, err);
          });
        };
      } else if (typeof XMLHttpRequest !== "undefined" && typeof ProgressEvent !== "undefined") {
        loadImage2.fetchBlob = function(url, callback, options) {
          options = options || {};
          var req = new XMLHttpRequest();
          req.open(options.method || "GET", url);
          if (options.headers) {
            Object.keys(options.headers).forEach(function(key) {
              req.setRequestHeader(key, options.headers[key]);
            });
          }
          req.withCredentials = options.credentials === "include";
          req.responseType = "blob";
          req.onload = function() {
            callback(req.response);
          };
          req.onerror = req.onabort = req.ontimeout = function(err) {
            callback(null, err);
          };
          req.send(options.body);
        };
      }
    });
  })(loadImageFetch);
  var loadImageExif = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports, loadImageMeta.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      function ExifMap(tagCode) {
        if (tagCode) {
          Object.defineProperty(this, "map", {
            value: this.privateIFDs[tagCode].map
          });
          Object.defineProperty(this, "tags", {
            value: this.tags && this.tags[tagCode] || {}
          });
        }
      }
      ExifMap.prototype.map = {
        Orientation: 274,
        Thumbnail: 513,
        Exif: 34665,
        GPSInfo: 34853,
        Interoperability: 40965
      };
      ExifMap.prototype.privateIFDs = {
        34665: { name: "Exif", map: {} },
        34853: { name: "GPSInfo", map: {} },
        40965: { name: "Interoperability", map: {} }
      };
      ExifMap.prototype.get = function(id) {
        return this[id] || this[this.map[id]];
      };
      function getExifThumbnail(dataView, offset, length) {
        if (!length || offset + length > dataView.byteLength) {
          console.log("Invalid Exif data: Invalid thumbnail data.");
          return;
        }
        return new Blob([dataView.buffer.slice(offset, offset + length)], {
          type: "image/jpeg"
        });
      }
      var ExifTagTypes = {
        1: {
          getValue: function(dataView, dataOffset) {
            return dataView.getUint8(dataOffset);
          },
          size: 1
        },
        2: {
          getValue: function(dataView, dataOffset) {
            return String.fromCharCode(dataView.getUint8(dataOffset));
          },
          size: 1,
          ascii: true
        },
        3: {
          getValue: function(dataView, dataOffset, littleEndian) {
            return dataView.getUint16(dataOffset, littleEndian);
          },
          size: 2
        },
        4: {
          getValue: function(dataView, dataOffset, littleEndian) {
            return dataView.getUint32(dataOffset, littleEndian);
          },
          size: 4
        },
        5: {
          getValue: function(dataView, dataOffset, littleEndian) {
            return dataView.getUint32(dataOffset, littleEndian) / dataView.getUint32(dataOffset + 4, littleEndian);
          },
          size: 8
        },
        9: {
          getValue: function(dataView, dataOffset, littleEndian) {
            return dataView.getInt32(dataOffset, littleEndian);
          },
          size: 4
        },
        10: {
          getValue: function(dataView, dataOffset, littleEndian) {
            return dataView.getInt32(dataOffset, littleEndian) / dataView.getInt32(dataOffset + 4, littleEndian);
          },
          size: 8
        }
      };
      ExifTagTypes[7] = ExifTagTypes[1];
      function getExifValue(dataView, tiffOffset, offset, type, length, littleEndian) {
        var tagType = ExifTagTypes[type];
        var tagSize;
        var dataOffset;
        var values;
        var i;
        var str;
        var c;
        if (!tagType) {
          console.log("Invalid Exif data: Invalid tag type.");
          return;
        }
        tagSize = tagType.size * length;
        dataOffset = tagSize > 4 ? tiffOffset + dataView.getUint32(offset + 8, littleEndian) : offset + 8;
        if (dataOffset + tagSize > dataView.byteLength) {
          console.log("Invalid Exif data: Invalid data offset.");
          return;
        }
        if (length === 1) {
          return tagType.getValue(dataView, dataOffset, littleEndian);
        }
        values = [];
        for (i = 0; i < length; i += 1) {
          values[i] = tagType.getValue(dataView, dataOffset + i * tagType.size, littleEndian);
        }
        if (tagType.ascii) {
          str = "";
          for (i = 0; i < values.length; i += 1) {
            c = values[i];
            if (c === "\0") {
              break;
            }
            str += c;
          }
          return str;
        }
        return values;
      }
      function parseExifTags(dataView, tiffOffset, dirOffset, littleEndian, tags, tagOffsets, includeTags, excludeTags) {
        var tagsNumber, dirEndOffset, i, tagOffset, tagNumber, tagValue;
        if (dirOffset + 6 > dataView.byteLength) {
          console.log("Invalid Exif data: Invalid directory offset.");
          return;
        }
        tagsNumber = dataView.getUint16(dirOffset, littleEndian);
        dirEndOffset = dirOffset + 2 + 12 * tagsNumber;
        if (dirEndOffset + 4 > dataView.byteLength) {
          console.log("Invalid Exif data: Invalid directory size.");
          return;
        }
        for (i = 0; i < tagsNumber; i += 1) {
          tagOffset = dirOffset + 2 + 12 * i;
          tagNumber = dataView.getUint16(tagOffset, littleEndian);
          if (includeTags && !includeTags[tagNumber])
            continue;
          if (excludeTags && excludeTags[tagNumber] === true)
            continue;
          tagValue = getExifValue(dataView, tiffOffset, tagOffset, dataView.getUint16(tagOffset + 2, littleEndian), dataView.getUint32(tagOffset + 4, littleEndian), littleEndian);
          tags[tagNumber] = tagValue;
          if (tagOffsets) {
            tagOffsets[tagNumber] = tagOffset;
          }
        }
        return dataView.getUint32(dirEndOffset, littleEndian);
      }
      function parseExifPrivateIFD(data, tagCode, dataView, tiffOffset, littleEndian, includeTags, excludeTags) {
        var dirOffset = data.exif[tagCode];
        if (dirOffset) {
          data.exif[tagCode] = new ExifMap(tagCode);
          if (data.exifOffsets) {
            data.exifOffsets[tagCode] = new ExifMap(tagCode);
          }
          parseExifTags(dataView, tiffOffset, tiffOffset + dirOffset, littleEndian, data.exif[tagCode], data.exifOffsets && data.exifOffsets[tagCode], includeTags && includeTags[tagCode], excludeTags && excludeTags[tagCode]);
        }
      }
      loadImage2.parseExifData = function(dataView, offset, length, data, options) {
        if (options.disableExif) {
          return;
        }
        var includeTags = options.includeExifTags;
        var excludeTags = options.excludeExifTags || {
          34665: {
            37500: true
          }
        };
        var tiffOffset = offset + 10;
        var littleEndian;
        var dirOffset;
        var privateIFDs;
        if (dataView.getUint32(offset + 4) !== 1165519206) {
          return;
        }
        if (tiffOffset + 8 > dataView.byteLength) {
          console.log("Invalid Exif data: Invalid segment size.");
          return;
        }
        if (dataView.getUint16(offset + 8) !== 0) {
          console.log("Invalid Exif data: Missing byte alignment offset.");
          return;
        }
        switch (dataView.getUint16(tiffOffset)) {
          case 18761:
            littleEndian = true;
            break;
          case 19789:
            littleEndian = false;
            break;
          default:
            console.log("Invalid Exif data: Invalid byte alignment marker.");
            return;
        }
        if (dataView.getUint16(tiffOffset + 2, littleEndian) !== 42) {
          console.log("Invalid Exif data: Missing TIFF marker.");
          return;
        }
        dirOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
        data.exif = new ExifMap();
        if (!options.disableExifOffsets) {
          data.exifOffsets = new ExifMap();
          data.exifTiffOffset = tiffOffset;
          data.exifLittleEndian = littleEndian;
        }
        dirOffset = parseExifTags(dataView, tiffOffset, tiffOffset + dirOffset, littleEndian, data.exif, data.exifOffsets, includeTags, excludeTags);
        if (dirOffset && !options.disableExifThumbnail) {
          dirOffset = parseExifTags(dataView, tiffOffset, tiffOffset + dirOffset, littleEndian, data.exif, data.exifOffsets, includeTags, excludeTags);
          if (data.exif[513] && data.exif[514]) {
            data.exif[513] = getExifThumbnail(dataView, tiffOffset + data.exif[513], data.exif[514]);
          }
        }
        privateIFDs = Object.keys(data.exif.privateIFDs);
        privateIFDs.forEach(function(tagCode) {
          parseExifPrivateIFD(data, tagCode, dataView, tiffOffset, littleEndian, includeTags, excludeTags);
        });
      };
      loadImage2.metaDataParsers.jpeg[65505].push(loadImage2.parseExifData);
      loadImage2.exifWriters = {
        274: function(buffer, data, value) {
          var view = new DataView(buffer, data.exifOffsets[274] + 8, 2);
          view.setUint16(0, value, data.exifLittleEndian);
          return buffer;
        }
      };
      loadImage2.writeExifData = function(buffer, data, id, value) {
        loadImage2.exifWriters[data.exif.map[id]](buffer, data, value);
      };
      loadImage2.ExifMap = ExifMap;
    });
  })(loadImageExif);
  var loadImageExifMap = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports, loadImageExif.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      var ExifMapProto = loadImage2.ExifMap.prototype;
      ExifMapProto.tags = {
        256: "ImageWidth",
        257: "ImageHeight",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright",
        34665: {
          36864: "ExifVersion",
          40960: "FlashpixVersion",
          40961: "ColorSpace",
          40962: "PixelXDimension",
          40963: "PixelYDimension",
          42240: "Gamma",
          37121: "ComponentsConfiguration",
          37122: "CompressedBitsPerPixel",
          37500: "MakerNote",
          37510: "UserComment",
          40964: "RelatedSoundFile",
          36867: "DateTimeOriginal",
          36868: "DateTimeDigitized",
          37520: "SubSecTime",
          37521: "SubSecTimeOriginal",
          37522: "SubSecTimeDigitized",
          33434: "ExposureTime",
          33437: "FNumber",
          34850: "ExposureProgram",
          34852: "SpectralSensitivity",
          34855: "PhotographicSensitivity",
          34856: "OECF",
          34864: "SensitivityType",
          34865: "StandardOutputSensitivity",
          34866: "RecommendedExposureIndex",
          34867: "ISOSpeed",
          34868: "ISOSpeedLatitudeyyy",
          34869: "ISOSpeedLatitudezzz",
          37377: "ShutterSpeedValue",
          37378: "ApertureValue",
          37379: "BrightnessValue",
          37380: "ExposureBias",
          37381: "MaxApertureValue",
          37382: "SubjectDistance",
          37383: "MeteringMode",
          37384: "LightSource",
          37385: "Flash",
          37396: "SubjectArea",
          37386: "FocalLength",
          41483: "FlashEnergy",
          41484: "SpatialFrequencyResponse",
          41486: "FocalPlaneXResolution",
          41487: "FocalPlaneYResolution",
          41488: "FocalPlaneResolutionUnit",
          41492: "SubjectLocation",
          41493: "ExposureIndex",
          41495: "SensingMethod",
          41728: "FileSource",
          41729: "SceneType",
          41730: "CFAPattern",
          41985: "CustomRendered",
          41986: "ExposureMode",
          41987: "WhiteBalance",
          41988: "DigitalZoomRatio",
          41989: "FocalLengthIn35mmFilm",
          41990: "SceneCaptureType",
          41991: "GainControl",
          41992: "Contrast",
          41993: "Saturation",
          41994: "Sharpness",
          41995: "DeviceSettingDescription",
          41996: "SubjectDistanceRange",
          42016: "ImageUniqueID",
          42032: "CameraOwnerName",
          42033: "BodySerialNumber",
          42034: "LensSpecification",
          42035: "LensMake",
          42036: "LensModel",
          42037: "LensSerialNumber"
        },
        34853: {
          0: "GPSVersionID",
          1: "GPSLatitudeRef",
          2: "GPSLatitude",
          3: "GPSLongitudeRef",
          4: "GPSLongitude",
          5: "GPSAltitudeRef",
          6: "GPSAltitude",
          7: "GPSTimeStamp",
          8: "GPSSatellites",
          9: "GPSStatus",
          10: "GPSMeasureMode",
          11: "GPSDOP",
          12: "GPSSpeedRef",
          13: "GPSSpeed",
          14: "GPSTrackRef",
          15: "GPSTrack",
          16: "GPSImgDirectionRef",
          17: "GPSImgDirection",
          18: "GPSMapDatum",
          19: "GPSDestLatitudeRef",
          20: "GPSDestLatitude",
          21: "GPSDestLongitudeRef",
          22: "GPSDestLongitude",
          23: "GPSDestBearingRef",
          24: "GPSDestBearing",
          25: "GPSDestDistanceRef",
          26: "GPSDestDistance",
          27: "GPSProcessingMethod",
          28: "GPSAreaInformation",
          29: "GPSDateStamp",
          30: "GPSDifferential",
          31: "GPSHPositioningError"
        },
        40965: {
          1: "InteroperabilityIndex"
        }
      };
      ExifMapProto.stringValues = {
        ExposureProgram: {
          0: "Undefined",
          1: "Manual",
          2: "Normal program",
          3: "Aperture priority",
          4: "Shutter priority",
          5: "Creative program",
          6: "Action program",
          7: "Portrait mode",
          8: "Landscape mode"
        },
        MeteringMode: {
          0: "Unknown",
          1: "Average",
          2: "CenterWeightedAverage",
          3: "Spot",
          4: "MultiSpot",
          5: "Pattern",
          6: "Partial",
          255: "Other"
        },
        LightSource: {
          0: "Unknown",
          1: "Daylight",
          2: "Fluorescent",
          3: "Tungsten (incandescent light)",
          4: "Flash",
          9: "Fine weather",
          10: "Cloudy weather",
          11: "Shade",
          12: "Daylight fluorescent (D 5700 - 7100K)",
          13: "Day white fluorescent (N 4600 - 5400K)",
          14: "Cool white fluorescent (W 3900 - 4500K)",
          15: "White fluorescent (WW 3200 - 3700K)",
          17: "Standard light A",
          18: "Standard light B",
          19: "Standard light C",
          20: "D55",
          21: "D65",
          22: "D75",
          23: "D50",
          24: "ISO studio tungsten",
          255: "Other"
        },
        Flash: {
          0: "Flash did not fire",
          1: "Flash fired",
          5: "Strobe return light not detected",
          7: "Strobe return light detected",
          9: "Flash fired, compulsory flash mode",
          13: "Flash fired, compulsory flash mode, return light not detected",
          15: "Flash fired, compulsory flash mode, return light detected",
          16: "Flash did not fire, compulsory flash mode",
          24: "Flash did not fire, auto mode",
          25: "Flash fired, auto mode",
          29: "Flash fired, auto mode, return light not detected",
          31: "Flash fired, auto mode, return light detected",
          32: "No flash function",
          65: "Flash fired, red-eye reduction mode",
          69: "Flash fired, red-eye reduction mode, return light not detected",
          71: "Flash fired, red-eye reduction mode, return light detected",
          73: "Flash fired, compulsory flash mode, red-eye reduction mode",
          77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
          79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
          89: "Flash fired, auto mode, red-eye reduction mode",
          93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
          95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
          1: "Undefined",
          2: "One-chip color area sensor",
          3: "Two-chip color area sensor",
          4: "Three-chip color area sensor",
          5: "Color sequential area sensor",
          7: "Trilinear sensor",
          8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
          0: "Standard",
          1: "Landscape",
          2: "Portrait",
          3: "Night scene"
        },
        SceneType: {
          1: "Directly photographed"
        },
        CustomRendered: {
          0: "Normal process",
          1: "Custom process"
        },
        WhiteBalance: {
          0: "Auto white balance",
          1: "Manual white balance"
        },
        GainControl: {
          0: "None",
          1: "Low gain up",
          2: "High gain up",
          3: "Low gain down",
          4: "High gain down"
        },
        Contrast: {
          0: "Normal",
          1: "Soft",
          2: "Hard"
        },
        Saturation: {
          0: "Normal",
          1: "Low saturation",
          2: "High saturation"
        },
        Sharpness: {
          0: "Normal",
          1: "Soft",
          2: "Hard"
        },
        SubjectDistanceRange: {
          0: "Unknown",
          1: "Macro",
          2: "Close view",
          3: "Distant view"
        },
        FileSource: {
          3: "DSC"
        },
        ComponentsConfiguration: {
          0: "",
          1: "Y",
          2: "Cb",
          3: "Cr",
          4: "R",
          5: "G",
          6: "B"
        },
        Orientation: {
          1: "top-left",
          2: "top-right",
          3: "bottom-right",
          4: "bottom-left",
          5: "left-top",
          6: "right-top",
          7: "right-bottom",
          8: "left-bottom"
        }
      };
      ExifMapProto.getText = function(name2) {
        var value = this.get(name2);
        switch (name2) {
          case "LightSource":
          case "Flash":
          case "MeteringMode":
          case "ExposureProgram":
          case "SensingMethod":
          case "SceneCaptureType":
          case "SceneType":
          case "CustomRendered":
          case "WhiteBalance":
          case "GainControl":
          case "Contrast":
          case "Saturation":
          case "Sharpness":
          case "SubjectDistanceRange":
          case "FileSource":
          case "Orientation":
            return this.stringValues[name2][value];
          case "ExifVersion":
          case "FlashpixVersion":
            if (!value)
              return;
            return String.fromCharCode(value[0], value[1], value[2], value[3]);
          case "ComponentsConfiguration":
            if (!value)
              return;
            return this.stringValues[name2][value[0]] + this.stringValues[name2][value[1]] + this.stringValues[name2][value[2]] + this.stringValues[name2][value[3]];
          case "GPSVersionID":
            if (!value)
              return;
            return value[0] + "." + value[1] + "." + value[2] + "." + value[3];
        }
        return String(value);
      };
      ExifMapProto.getAll = function() {
        var map = {};
        var prop;
        var obj;
        var name2;
        for (prop in this) {
          if (Object.prototype.hasOwnProperty.call(this, prop)) {
            obj = this[prop];
            if (obj && obj.getAll) {
              map[this.privateIFDs[prop].name] = obj.getAll();
            } else {
              name2 = this.tags[prop];
              if (name2)
                map[name2] = this.getText(name2);
            }
          }
        }
        return map;
      };
      ExifMapProto.getName = function(tagCode) {
        var name2 = this.tags[tagCode];
        if (typeof name2 === "object")
          return this.privateIFDs[tagCode].name;
        return name2;
      };
      (function() {
        var tags = ExifMapProto.tags;
        var prop;
        var privateIFD;
        var subTags;
        for (prop in tags) {
          if (Object.prototype.hasOwnProperty.call(tags, prop)) {
            privateIFD = ExifMapProto.privateIFDs[prop];
            if (privateIFD) {
              subTags = tags[prop];
              for (prop in subTags) {
                if (Object.prototype.hasOwnProperty.call(subTags, prop)) {
                  privateIFD.map[subTags[prop]] = Number(prop);
                }
              }
            } else {
              ExifMapProto.map[tags[prop]] = Number(prop);
            }
          }
        }
      })();
    });
  })(loadImageExifMap);
  var loadImageIptc = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports, loadImageMeta.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      function IptcMap() {
      }
      IptcMap.prototype.map = {
        ObjectName: 5
      };
      IptcMap.prototype.types = {
        0: "Uint16",
        200: "Uint16",
        201: "Uint16",
        202: "binary"
      };
      IptcMap.prototype.get = function(id) {
        return this[id] || this[this.map[id]];
      };
      function getStringValue(dataView, offset, length) {
        var outstr = "";
        var end = offset + length;
        for (var n = offset; n < end; n += 1) {
          outstr += String.fromCharCode(dataView.getUint8(n));
        }
        return outstr;
      }
      function getTagValue(tagCode, map, dataView, offset, length) {
        if (map.types[tagCode] === "binary") {
          return new Blob([dataView.buffer.slice(offset, offset + length)]);
        }
        if (map.types[tagCode] === "Uint16") {
          return dataView.getUint16(offset);
        }
        return getStringValue(dataView, offset, length);
      }
      function combineTagValues(value, newValue) {
        if (value === void 0)
          return newValue;
        if (value instanceof Array) {
          value.push(newValue);
          return value;
        }
        return [value, newValue];
      }
      function parseIptcTags(dataView, segmentOffset, segmentLength, data, includeTags, excludeTags) {
        var value, tagSize, tagCode;
        var segmentEnd = segmentOffset + segmentLength;
        var offset = segmentOffset;
        while (offset < segmentEnd) {
          if (dataView.getUint8(offset) === 28 && dataView.getUint8(offset + 1) === 2) {
            tagCode = dataView.getUint8(offset + 2);
            if ((!includeTags || includeTags[tagCode]) && (!excludeTags || !excludeTags[tagCode])) {
              tagSize = dataView.getInt16(offset + 3);
              value = getTagValue(tagCode, data.iptc, dataView, offset + 5, tagSize);
              data.iptc[tagCode] = combineTagValues(data.iptc[tagCode], value);
              if (data.iptcOffsets) {
                data.iptcOffsets[tagCode] = offset;
              }
            }
          }
          offset += 1;
        }
      }
      function isSegmentStart(dataView, offset) {
        return dataView.getUint32(offset) === 943868237 && dataView.getUint16(offset + 4) === 1028;
      }
      function getHeaderLength(dataView, offset) {
        var length = dataView.getUint8(offset + 7);
        if (length % 2 !== 0)
          length += 1;
        if (length === 0) {
          length = 4;
        }
        return length;
      }
      loadImage2.parseIptcData = function(dataView, offset, length, data, options) {
        if (options.disableIptc) {
          return;
        }
        var markerLength = offset + length;
        while (offset + 8 < markerLength) {
          if (isSegmentStart(dataView, offset)) {
            var headerLength = getHeaderLength(dataView, offset);
            var segmentOffset = offset + 8 + headerLength;
            if (segmentOffset > markerLength) {
              console.log("Invalid IPTC data: Invalid segment offset.");
              break;
            }
            var segmentLength = dataView.getUint16(offset + 6 + headerLength);
            if (offset + segmentLength > markerLength) {
              console.log("Invalid IPTC data: Invalid segment size.");
              break;
            }
            data.iptc = new IptcMap();
            if (!options.disableIptcOffsets) {
              data.iptcOffsets = new IptcMap();
            }
            parseIptcTags(dataView, segmentOffset, segmentLength, data, options.includeIptcTags, options.excludeIptcTags || { 202: true });
            return;
          }
          offset += 1;
        }
      };
      loadImage2.metaDataParsers.jpeg[65517].push(loadImage2.parseIptcData);
      loadImage2.IptcMap = IptcMap;
    });
  })(loadImageIptc);
  var loadImageIptcMap = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports, loadImageIptc.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      var IptcMapProto = loadImage2.IptcMap.prototype;
      IptcMapProto.tags = {
        0: "ApplicationRecordVersion",
        3: "ObjectTypeReference",
        4: "ObjectAttributeReference",
        5: "ObjectName",
        7: "EditStatus",
        8: "EditorialUpdate",
        10: "Urgency",
        12: "SubjectReference",
        15: "Category",
        20: "SupplementalCategories",
        22: "FixtureIdentifier",
        25: "Keywords",
        26: "ContentLocationCode",
        27: "ContentLocationName",
        30: "ReleaseDate",
        35: "ReleaseTime",
        37: "ExpirationDate",
        38: "ExpirationTime",
        40: "SpecialInstructions",
        42: "ActionAdvised",
        45: "ReferenceService",
        47: "ReferenceDate",
        50: "ReferenceNumber",
        55: "DateCreated",
        60: "TimeCreated",
        62: "DigitalCreationDate",
        63: "DigitalCreationTime",
        65: "OriginatingProgram",
        70: "ProgramVersion",
        75: "ObjectCycle",
        80: "Byline",
        85: "BylineTitle",
        90: "City",
        92: "Sublocation",
        95: "State",
        100: "CountryCode",
        101: "Country",
        103: "OriginalTransmissionReference",
        105: "Headline",
        110: "Credit",
        115: "Source",
        116: "CopyrightNotice",
        118: "Contact",
        120: "Caption",
        121: "LocalCaption",
        122: "Writer",
        125: "RasterizedCaption",
        130: "ImageType",
        131: "ImageOrientation",
        135: "LanguageIdentifier",
        150: "AudioType",
        151: "AudioSamplingRate",
        152: "AudioSamplingResolution",
        153: "AudioDuration",
        154: "AudioOutcue",
        184: "JobID",
        185: "MasterDocumentID",
        186: "ShortDocumentID",
        187: "UniqueDocumentID",
        188: "OwnerID",
        200: "ObjectPreviewFileFormat",
        201: "ObjectPreviewFileVersion",
        202: "ObjectPreviewData",
        221: "Prefs",
        225: "ClassifyState",
        228: "SimilarityIndex",
        230: "DocumentNotes",
        231: "DocumentHistory",
        232: "ExifCameraInfo",
        255: "CatalogSets"
      };
      IptcMapProto.stringValues = {
        10: {
          0: "0 (reserved)",
          1: "1 (most urgent)",
          2: "2",
          3: "3",
          4: "4",
          5: "5 (normal urgency)",
          6: "6",
          7: "7",
          8: "8 (least urgent)",
          9: "9 (user-defined priority)"
        },
        75: {
          a: "Morning",
          b: "Both Morning and Evening",
          p: "Evening"
        },
        131: {
          L: "Landscape",
          P: "Portrait",
          S: "Square"
        }
      };
      IptcMapProto.getText = function(id) {
        var value = this.get(id);
        var tagCode = this.map[id];
        var stringValue = this.stringValues[tagCode];
        if (stringValue)
          return stringValue[value];
        return String(value);
      };
      IptcMapProto.getAll = function() {
        var map = {};
        var prop;
        var name2;
        for (prop in this) {
          if (Object.prototype.hasOwnProperty.call(this, prop)) {
            name2 = this.tags[prop];
            if (name2)
              map[name2] = this.getText(name2);
          }
        }
        return map;
      };
      IptcMapProto.getName = function(tagCode) {
        return this.tags[tagCode];
      };
      (function() {
        var tags = IptcMapProto.tags;
        var map = IptcMapProto.map || {};
        var prop;
        for (prop in tags) {
          if (Object.prototype.hasOwnProperty.call(tags, prop)) {
            map[tags[prop]] = Number(prop);
          }
        }
      })();
    });
  })(loadImageIptcMap);
  var loadImageOrientation = { exports: {} };
  (function(module2) {
    (function(factory) {
      if (module2.exports) {
        factory(loadImage$3.exports, loadImageScale.exports, loadImageMeta.exports);
      } else {
        factory(window.loadImage);
      }
    })(function(loadImage2) {
      var originalHasCanvasOption = loadImage2.hasCanvasOption;
      var originalHasMetaOption = loadImage2.hasMetaOption;
      var originalTransformCoordinates = loadImage2.transformCoordinates;
      var originalGetTransformedOptions = loadImage2.getTransformedOptions;
      (function() {
        var testImageURL = "data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==";
        var img = document.createElement("img");
        img.onload = function() {
          loadImage2.orientation = img.width === 1 && img.height === 2;
        };
        img.src = testImageURL;
      })();
      loadImage2.hasCanvasOption = function(options) {
        return !!options.orientation === true && !loadImage2.orientation || options.orientation > 1 && options.orientation < 9 || originalHasCanvasOption.call(loadImage2, options);
      };
      loadImage2.hasMetaOption = function(options) {
        return options && options.orientation === true && !loadImage2.orientation || originalHasMetaOption.call(loadImage2, options);
      };
      loadImage2.transformCoordinates = function(canvas, options) {
        originalTransformCoordinates.call(loadImage2, canvas, options);
        var ctx = canvas.getContext("2d");
        var width = canvas.width;
        var height = canvas.height;
        var styleWidth = canvas.style.width;
        var styleHeight = canvas.style.height;
        var orientation = options.orientation;
        if (!(orientation > 1 && orientation < 9)) {
          return;
        }
        if (orientation > 4) {
          canvas.width = height;
          canvas.height = width;
          canvas.style.width = styleHeight;
          canvas.style.height = styleWidth;
        }
        switch (orientation) {
          case 2:
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;
          case 3:
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;
          case 4:
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;
          case 5:
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 6:
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            break;
          case 7:
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            break;
          case 8:
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            break;
        }
      };
      loadImage2.getTransformedOptions = function(img, opts, data) {
        var options = originalGetTransformedOptions.call(loadImage2, img, opts);
        var orientation = options.orientation;
        var newOptions;
        var i;
        if (orientation === true) {
          if (loadImage2.orientation) {
            return options;
          }
          orientation = data && data.exif && data.exif.get("Orientation");
        }
        if (!(orientation > 1 && orientation < 9)) {
          return options;
        }
        newOptions = {};
        for (i in options) {
          if (Object.prototype.hasOwnProperty.call(options, i)) {
            newOptions[i] = options[i];
          }
        }
        newOptions.orientation = orientation;
        switch (orientation) {
          case 2:
            newOptions.left = options.right;
            newOptions.right = options.left;
            break;
          case 3:
            newOptions.left = options.right;
            newOptions.top = options.bottom;
            newOptions.right = options.left;
            newOptions.bottom = options.top;
            break;
          case 4:
            newOptions.top = options.bottom;
            newOptions.bottom = options.top;
            break;
          case 5:
            newOptions.left = options.top;
            newOptions.top = options.left;
            newOptions.right = options.bottom;
            newOptions.bottom = options.right;
            break;
          case 6:
            newOptions.left = options.top;
            newOptions.top = options.right;
            newOptions.right = options.bottom;
            newOptions.bottom = options.left;
            break;
          case 7:
            newOptions.left = options.bottom;
            newOptions.top = options.right;
            newOptions.right = options.top;
            newOptions.bottom = options.left;
            break;
          case 8:
            newOptions.left = options.bottom;
            newOptions.top = options.left;
            newOptions.right = options.top;
            newOptions.bottom = options.right;
            break;
        }
        if (newOptions.orientation > 4) {
          newOptions.maxWidth = options.maxHeight;
          newOptions.maxHeight = options.maxWidth;
          newOptions.minWidth = options.minHeight;
          newOptions.minHeight = options.minWidth;
          newOptions.sourceWidth = options.sourceHeight;
          newOptions.sourceHeight = options.sourceWidth;
        }
        return newOptions;
      };
    });
  })(loadImageOrientation);
  var js = loadImage$3.exports;
  const resolveURL = resolveUrl.exports;
  const blueimpLoadImage = js;
  const readFromBlobOrFile = (blob) => new Promise((resolve2, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve2(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  });
  const fixOrientationFromUrlOrBlobOrFile = (blob) => new Promise((resolve2) => {
    blueimpLoadImage(blob, (img) => img.toBlob(resolve2), {
      orientation: true,
      canvas: true
    });
  });
  const loadImage$2 = async (image) => {
    let data = image;
    if (typeof image === "undefined") {
      return "undefined";
    }
    if (typeof image === "string") {
      if (image.endsWith(".pbm")) {
        const resp = await fetch(resolveURL(image));
        data = await resp.arrayBuffer();
      } else {
        let img = image;
        if (!/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
          img = resolveURL(image);
        }
        data = await readFromBlobOrFile(await fixOrientationFromUrlOrBlobOrFile(img));
      }
    } else if (image instanceof HTMLElement) {
      if (image.tagName === "IMG") {
        data = await loadImage$2(image.src);
      }
      if (image.tagName === "VIDEO") {
        data = await loadImage$2(image.poster);
      }
      if (image.tagName === "CANVAS") {
        await new Promise((resolve2) => {
          image.toBlob(async (blob) => {
            data = await readFromBlobOrFile(blob);
            resolve2();
          });
        });
      }
    } else if (image instanceof File || image instanceof Blob) {
      let img = image;
      if (!image.name.endsWith(".pbm")) {
        img = await fixOrientationFromUrlOrBlobOrFile(img);
      }
      data = await readFromBlobOrFile(img);
    }
    return new Uint8Array(data);
  };
  var loadImage_1 = loadImage$2;
  const defaultOptions$1 = defaultOptions_1;
  const spawnWorker$1 = spawnWorker$2;
  const terminateWorker$1 = terminateWorker$2;
  const onMessage$1 = onMessage$2;
  const send$1 = send$2;
  const loadImage$1 = loadImage_1;
  var browser = {
    defaultOptions: defaultOptions$1,
    spawnWorker: spawnWorker$1,
    terminateWorker: terminateWorker$1,
    onMessage: onMessage$1,
    send: send$1,
    loadImage: loadImage$1
  };
  const resolvePaths = resolvePaths$1;
  const circularize = circularize$1;
  const createJob = createJob$2;
  const { log } = log$2;
  const getId = getId$3;
  const { defaultOEM } = config;
  const {
    defaultOptions,
    spawnWorker,
    terminateWorker,
    onMessage,
    loadImage,
    send
  } = browser;
  let workerCounter = 0;
  var createWorker$2 = (_options = {}) => {
    const id = getId("Worker", workerCounter);
    const _a = resolvePaths(__spreadValues(__spreadValues({}, defaultOptions), _options)), {
      logger: logger2,
      errorHandler
    } = _a, options = __objRest(_a, [
      "logger",
      "errorHandler"
    ]);
    const resolves = {};
    const rejects = {};
    let worker = spawnWorker(options);
    workerCounter += 1;
    const setResolve = (action, res) => {
      resolves[action] = res;
    };
    const setReject = (action, rej) => {
      rejects[action] = rej;
    };
    const startJob = ({ id: jobId, action, payload }) => new Promise((resolve2, reject) => {
      log(`[${id}]: Start ${jobId}, action=${action}`);
      setResolve(action, resolve2);
      setReject(action, reject);
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload
      });
    });
    const load = (jobId) => startJob(createJob({
      id: jobId,
      action: "load",
      payload: { options }
    }));
    const writeText = (path, text, jobId) => startJob(createJob({
      id: jobId,
      action: "FS",
      payload: { method: "writeFile", args: [path, text] }
    }));
    const readText = (path, jobId) => startJob(createJob({
      id: jobId,
      action: "FS",
      payload: { method: "readFile", args: [path, { encoding: "utf8" }] }
    }));
    const removeFile = (path, jobId) => startJob(createJob({
      id: jobId,
      action: "FS",
      payload: { method: "unlink", args: [path] }
    }));
    const FS = (method, args, jobId) => startJob(createJob({
      id: jobId,
      action: "FS",
      payload: { method, args }
    }));
    const loadLanguage = (langs = "eng", jobId) => startJob(createJob({
      id: jobId,
      action: "loadLanguage",
      payload: { langs, options }
    }));
    const initialize = (langs = "eng", oem = defaultOEM, jobId) => startJob(createJob({
      id: jobId,
      action: "initialize",
      payload: { langs, oem }
    }));
    const setParameters = (params = {}, jobId) => startJob(createJob({
      id: jobId,
      action: "setParameters",
      payload: { params }
    }));
    const recognize2 = async (image, opts = {}, jobId) => startJob(createJob({
      id: jobId,
      action: "recognize",
      payload: { image: await loadImage(image), options: opts }
    }));
    const getPDF = (title = "Tesseract OCR Result", textonly = false, jobId) => startJob(createJob({
      id: jobId,
      action: "getPDF",
      payload: { title, textonly }
    }));
    const detect2 = async (image, jobId) => startJob(createJob({
      id: jobId,
      action: "detect",
      payload: { image: await loadImage(image) }
    }));
    const terminate = async () => {
      if (worker !== null) {
        terminateWorker(worker);
        worker = null;
      }
      return Promise.resolve();
    };
    onMessage(worker, ({
      workerId,
      jobId,
      status,
      action,
      data
    }) => {
      if (status === "resolve") {
        log(`[${workerId}]: Complete ${jobId}`);
        let d = data;
        if (action === "recognize") {
          d = circularize(data);
        } else if (action === "getPDF") {
          d = Array.from(__spreadProps(__spreadValues({}, data), { length: Object.keys(data).length }));
        }
        resolves[action]({ jobId, data: d });
      } else if (status === "reject") {
        rejects[action](data);
        if (errorHandler) {
          errorHandler(data);
        } else {
          throw Error(data);
        }
      } else if (status === "progress") {
        logger2(__spreadProps(__spreadValues({}, data), { userJobId: jobId }));
      }
    });
    return {
      id,
      worker,
      setResolve,
      setReject,
      load,
      writeText,
      readText,
      removeFile,
      FS,
      loadLanguage,
      initialize,
      setParameters,
      recognize: recognize2,
      getPDF,
      detect: detect2,
      terminate
    };
  };
  const createWorker$1 = createWorker$2;
  const recognize = async (image, langs, options) => {
    const worker = createWorker$1(options);
    await worker.load();
    await worker.loadLanguage(langs);
    await worker.initialize(langs);
    return worker.recognize(image).finally(async () => {
      await worker.terminate();
    });
  };
  const detect = async (image, options) => {
    const worker = createWorker$1(options);
    await worker.load();
    await worker.loadLanguage("osd");
    await worker.initialize("osd");
    return worker.detect(image).finally(async () => {
      await worker.terminate();
    });
  };
  var Tesseract$1 = {
    recognize,
    detect
  };
  var languages$1 = {
    AFR: "afr",
    AMH: "amh",
    ARA: "ara",
    ASM: "asm",
    AZE: "aze",
    AZE_CYRL: "aze_cyrl",
    BEL: "bel",
    BEN: "ben",
    BOD: "bod",
    BOS: "bos",
    BUL: "bul",
    CAT: "cat",
    CEB: "ceb",
    CES: "ces",
    CHI_SIM: "chi_sim",
    CHI_TRA: "chi_tra",
    CHR: "chr",
    CYM: "cym",
    DAN: "dan",
    DEU: "deu",
    DZO: "dzo",
    ELL: "ell",
    ENG: "eng",
    ENM: "enm",
    EPO: "epo",
    EST: "est",
    EUS: "eus",
    FAS: "fas",
    FIN: "fin",
    FRA: "fra",
    FRK: "frk",
    FRM: "frm",
    GLE: "gle",
    GLG: "glg",
    GRC: "grc",
    GUJ: "guj",
    HAT: "hat",
    HEB: "heb",
    HIN: "hin",
    HRV: "hrv",
    HUN: "hun",
    IKU: "iku",
    IND: "ind",
    ISL: "isl",
    ITA: "ita",
    ITA_OLD: "ita_old",
    JAV: "jav",
    JPN: "jpn",
    KAN: "kan",
    KAT: "kat",
    KAT_OLD: "kat_old",
    KAZ: "kaz",
    KHM: "khm",
    KIR: "kir",
    KOR: "kor",
    KUR: "kur",
    LAO: "lao",
    LAT: "lat",
    LAV: "lav",
    LIT: "lit",
    MAL: "mal",
    MAR: "mar",
    MKD: "mkd",
    MLT: "mlt",
    MSA: "msa",
    MYA: "mya",
    NEP: "nep",
    NLD: "nld",
    NOR: "nor",
    ORI: "ori",
    PAN: "pan",
    POL: "pol",
    POR: "por",
    PUS: "pus",
    RON: "ron",
    RUS: "rus",
    SAN: "san",
    SIN: "sin",
    SLK: "slk",
    SLV: "slv",
    SPA: "spa",
    SPA_OLD: "spa_old",
    SQI: "sqi",
    SRP: "srp",
    SRP_LATN: "srp_latn",
    SWA: "swa",
    SWE: "swe",
    SYR: "syr",
    TAM: "tam",
    TEL: "tel",
    TGK: "tgk",
    TGL: "tgl",
    THA: "tha",
    TIR: "tir",
    TUR: "tur",
    UIG: "uig",
    UKR: "ukr",
    URD: "urd",
    UZB: "uzb",
    UZB_CYRL: "uzb_cyrl",
    VIE: "vie",
    YID: "yid"
  };
  var PSM$1 = {
    OSD_ONLY: "0",
    AUTO_OSD: "1",
    AUTO_ONLY: "2",
    AUTO: "3",
    SINGLE_COLUMN: "4",
    SINGLE_BLOCK_VERT_TEXT: "5",
    SINGLE_BLOCK: "6",
    SINGLE_LINE: "7",
    SINGLE_WORD: "8",
    CIRCLE_WORD: "9",
    SINGLE_CHAR: "10",
    SPARSE_TEXT: "11",
    SPARSE_TEXT_OSD: "12"
  };
  const createScheduler = createScheduler$1;
  const createWorker = createWorker$2;
  const Tesseract = Tesseract$1;
  const languages = languages$1;
  const OEM = OEM$2;
  const PSM = PSM$1;
  const { setLogging } = log$2;
  var src = __spreadValues({
    languages,
    OEM,
    PSM,
    createScheduler,
    createWorker,
    setLogging
  }, Tesseract);
  const _OCR = class {
    constructor(options = {}) {
      this.worker = src.createWorker(options);
    }
    async load(lang) {
      await this.worker.load();
      await this.worker.loadLanguage(lang || _OCR.DEFAULT_LANG);
      await this.worker.initialize(lang || _OCR.DEFAULT_LANG);
    }
    static suit(el, style) {
      this.changeStyle(el, style);
      let nodes = Array.from(el.childNodes);
      while (nodes.length) {
        const node = nodes.shift();
        if (node && node.style) {
          this.changeStyle(node, style);
          nodes = nodes.concat(Array.from(node.childNodes));
        }
      }
      return el;
    }
    static unsuit(el) {
      this.restoreStyle(el);
      let nodes = Array.from(el.childNodes);
      while (nodes.length) {
        const node = nodes.shift();
        if (node && node.style) {
          this.restoreStyle(node);
          nodes = nodes.concat(Array.from(node.childNodes));
        }
      }
      return el;
    }
    static changeStyle(el, style) {
      const { fontSize, letterSpacing, lineHeight, fontWeight } = style || _OCR.DEFAULT_STYLE;
      el.__fontSize__ = el.style.fontSize || "inherit";
      el.__letterSpacing__ = el.style.letterSpacing || "inherit";
      el.__lineHeight__ = el.style.lineHeight || "inherit";
      el.__fontWeight__ = el.style.fontWeight || "inherit";
      el.style.fontWeight = fontWeight;
      el.style.fontSize = fontSize;
      el.style.letterSpacing = letterSpacing;
      el.style.lineHeight = lineHeight;
    }
    static restoreStyle(el) {
      if (el.__fontSize__)
        el.style.fontSize = el.__fontSize__;
      if (el.__letterSpacing__)
        el.style.letterSpacing = el.__letterSpacing__;
      if (el.__lineHeight__)
        el.style.lineHeight = el.__lineHeight__;
      if (el.__fontWeight__)
        el.style.fontWeight = el.__fontWeight__;
      delete el.__fontSize__;
      delete el.__letterSpacing__;
      delete el.__lineHeight__;
      delete el.__fontWeight__;
    }
    async recognize(el) {
      const base64 = await domtoimage.toPng(el);
      const {
        data: { text }
      } = await this.worker.recognize(base64);
      return text.replace(/\n/g, "").replace(/([^ ]) /g, "$1");
    }
    async terminate() {
      await this.worker.terminate();
    }
  };
  let OCR = _OCR;
  OCR.DEFAULT_LANG = "eng+chi_sim";
  OCR.DEFAULT_WRAPPER = "div";
  OCR.DEFAULT_STYLE = {
    padding: "12px",
    fontSize: "36px",
    lineHeight: "48px",
    letterSpacing: "8px",
    fontWeight: "bold"
  };
  const VERSION = "3.17.16";
  const definedScripts = [CommonScript, CXScript, ZHSScript, ICVEScript];
  exports2.OCR = OCR;
  exports2.OCSWorker = OCSWorker;
  exports2.VERSION = VERSION;
  exports2.defaultAnswerWrapperHandler = defaultAnswerWrapperHandler;
  exports2.defineScript = defineScript;
  exports2.definedScripts = definedScripts;
  exports2.getStore = getStore;
  exports2.logger = logger;
  exports2.message = message;
  exports2.start = start;
  exports2.utils = index;
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2[Symbol.toStringTag] = "Module";
});


const OCS_STYLE = `
/*!
 * ocsjs ( https://github.com/ocsjs/ocsjs#readme )
 * ocs - online course script 在线网络课程辅助工具
 * copyright enncy
 * license MIT
 */

/**
panel style
*/
#ocs-panel {
  position: fixed;
  top: 40%;
  left: 50%;
  min-width: 300px;
  background: white;
  z-index: 99999999;
  text-align: left;
  box-shadow: 0 0 24px -10px #000000;
  border-radius: 6px;
  border: 1px solid #a3a3a3;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #636363;
  /** 搜索结果  */
  /** 文字提示 */
}
#ocs-panel .ocs-panel-header {
  display: flex;
  padding: 2px 12px;
  background: #f7f7f7;
  border-radius: 6px;
  border-bottom-left-radius: unset;
  border-bottom-right-radius: unset;
  box-shadow: 0px 0px 4px #c7c7c7;
}
#ocs-panel .ocs-panel-header .title {
  cursor: pointer !important;
  font-size: 14px;
  padding: 2px 8px;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.509);
}
#ocs-panel .ocs-panel-header .title.active {
  background: white;
  color: black;
}
#ocs-panel .ocs-panel-header .title.active span::after {
  content: '';
  border-bottom: 2px solid #0099ff;
  display: block;
  width: 24px;
  justify-content: center;
  margin: 0 auto;
}
#ocs-panel .ocs-panel-header .title:hover {
  background: white;
}
#ocs-panel .ocs-panel-header.hide {
  display: none;
}
#ocs-panel .ocs-panel-container {
  font-size: 12px;
  padding: 4px;
  overflow: auto;
  max-height: 500px;
  max-width: 800px;
}
#ocs-panel .ocs-panel-container ul li {
  list-style: inside;
}
#ocs-panel .ocs-panel-container.hide {
  display: none;
}
#ocs-panel .draggable {
  cursor: move;
}
#ocs-panel.hide {
  width: 48px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0);
  box-shadow: 0px 0px 16px grey;
  border-radius: 10px;
  min-width: unset;
  bottom: 10%;
  left: 5%;
  top: unset;
}
#ocs-panel ul {
  padding: 0;
  margin: 0;
}
#ocs-panel hr {
  margin: 4px 0px;
}
#ocs-panel .ocs-panel-footer {
  font-size: 12px;
  color: #c5c5c5;
  margin-top: 8px;
  text-align: right;
  padding: 0px 4px;
  box-shadow: 0px 0px 4px #c7c7c7;
  border-radius: 6px;
  border-top-left-radius: unset;
  border-top-right-radius: unset;
}
#ocs-panel .ocs-panel-footer.hide {
  border-top: none;
}
#ocs-panel .ocs-panel-footer .hide-btn {
  float: left;
  cursor: pointer;
}
#ocs-panel .ocs-setting-items {
  display: grid;
  grid-template-columns: min-content auto;
  grid-row-gap: 8px;
  white-space: nowrap;
  font-size: 12px;
  /** check box 的样式 */
}
#ocs-panel .ocs-setting-items label {
  padding-right: 4px;
}
#ocs-panel .ocs-setting-items label + div {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
#ocs-panel .ocs-setting-items label::after {
  content: ': ';
}
#ocs-panel .ocs-setting-items select {
  font-size: 12px;
  outline: none;
  border: none;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  width: 100%;
}
#ocs-panel .ocs-setting-items input {
  outline: none;
  border: none;
  border-bottom: 1px solid #e4e4e4;
  background: #fbfbfb;
  padding-left: 2px;
  text-align: center;
  padding: 0px;
  margin: 0px;
}
#ocs-panel .ocs-setting-items .input-switch {
  appearance: none;
  width: fit-content;
  min-width: 32px;
  height: 16px;
  background: #c5c5c5;
  border-radius: 100px;
  display: flex;
  align-items: center;
  padding: 2px 4px;
  transition: all 0.2s ease-in-out;
}
#ocs-panel .ocs-setting-items .input-switch:checked {
  background: #1890ff !important;
}
#ocs-panel .ocs-setting-items .input-switch:checked::before {
  transform: translate(100%, 0px);
}
#ocs-panel .ocs-setting-items .input-switch::before {
  background-color: #fff;
  border-radius: 9px;
  box-shadow: 0 2px 4px #00230b33;
  width: 12px;
  height: 12px;
  content: '';
}
#ocs-panel .ocs-setting-items input:not([type='checkbox'], [type='radio']) {
  width: 100%;
}
#ocs-panel .ocs-setting-items input[type='checkbox'],
#ocs-panel .ocs-setting-items input[type='radio'],
#ocs-panel .ocs-setting-items input[type='range'] {
  accent-color: #0e8ee2;
}
#ocs-panel .ocs-btn-primary {
  outline: none;
  border: none;
  cursor: pointer;
  background: #1890ff;
  color: white;
  border: 1px solid #1890ff;
  font-size: 12px;
  border-radius: 4px;
  margin: 2px;
}
#ocs-panel .ocs-btn {
  outline: none;
  border: none;
  cursor: pointer;
  background: white;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  font-size: 12px;
  margin: 2px;
}
#ocs-panel button[disabled] {
  background: #e4e4e4;
  color: #a5a5a5;
  border: 1px solid #e4e4e4;
  cursor: not-allowed;
}
#ocs-panel .terminal {
  width: 300px;
  height: 300px;
  max-width: 300px;
  max-height: 300px;
  overflow: auto;
  background-color: black;
  padding: 12px 6px;
  color: white;
}
#ocs-panel .terminal level {
  padding: 0px 2px;
  border-radius: 2px;
}
#ocs-panel .terminal level.info {
  background-color: #2196f3a3;
}
#ocs-panel .terminal level.warn {
  background-color: #ffc107db;
}
#ocs-panel .terminal level.error {
  background-color: #f36c71cc;
}
#ocs-panel .terminal level.debug {
  background-color: #9e9e9ec4;
}
#ocs-panel .terminal *::selection {
  background-color: #ffffff6b;
}
#ocs-panel #search-results a {
  text-decoration: underline;
}
#ocs-panel #search-results .search-result-modal {
  max-height: 600px;
  max-width: 800px;
  overflow: auto;
  background-color: white;
  padding: 4px;
  transform: translate(-105%, 0px);
  position: absolute;
  box-shadow: 0px 0px 8px #c7c7c7;
}
#ocs-panel #search-results .search-results-title {
  padding: 2px 0px;
}
#ocs-panel #search-results .search-results-container {
  padding-left: 12px;
}
#ocs-panel #search-results .search-results-item {
  margin-bottom: 8px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  padding: 0px 2px;
}
#ocs-panel .tooltip {
  position: absolute;
  transform: translate(0%, -100%);
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0px 0px 4px black;
  white-space: nowrap;
  z-index: 9999999;
}
#ocs-panel .tooltip a {
  color: #1890ff;
}
#ocs-panel .tooltip.dark {
  background: black;
  color: white;
  opacity: 0.8;
}
#ocs-panel .tooltip.light {
  background: white;
  color: inherit;
}
#ocs-panel .alert-container {
  margin-bottom: 4px;
  position: absolute;
  z-index: 999999;
  bottom: 100%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, 0px);
}
#ocs-panel .alert-container .alert-closer {
  float: right;
  border-radius: 50%;
  border: 1px solid;
  text-align: center;
  cursor: pointer;
  font: icon;
  line-height: 14px;
  width: 14px;
}
#ocs-panel .alert-container .hide .alert {
  width: 200px;
  transform: translate(-82px, 0px);
}
#ocs-panel .alert-container .alert {
  border-radius: 4px;
  margin-bottom: 4px;
  padding: 4px;
  font-size: 12px;
}
#ocs-panel .alert-container .alert .alert-text {
  letter-spacing: 1px;
  font-weight: bold;
}
#ocs-panel .alert-container .alert.error {
  background-color: #ff000699;
  color: #fff;
  border: 1px solid #f36c70;
}
#ocs-panel .alert-container .alert.info {
  background-color: #2196f3a3;
  color: white;
  border: 1px solid #1890ff;
}
#ocs-panel .alert-container .alert.success {
  background-color: #84d346d1;
  color: #fff;
  border: 1px solid #6fd91d;
}
#ocs-panel .alert-container .alert.warn {
  background-color: #fbbf30e6;
  color: #725206;
  border: 1px solid #ffc107;
}
#ocs-panel .hide-tip {
  position: fixed;
  color: white;
  white-space: nowrap;
  transform: translate(-30%, 0px);
  text-align: center;
  text-shadow: 0px 0px 8px black;
}
.ocs-icon {
  width: 64px;
  height: 64px;
  position: relative;
  top: -8px;
  left: -8px;
}
.pointer {
  cursor: pointer;
}
`;

/* eslint no-undef: 0 */

(function () {
    "use strict";

    // 运行脚本
    OCS.start({
        // 加载样式
        style: OCS_STYLE,
        // 支持拖动
        draggable: true,
        // 加载默认脚本列表，默认 OCS.definedScripts
        scripts: OCS.definedScripts,
    });
})();

