// ==UserScript==
// @name        FUT Enhancer (modifié FIFA 21)
// @version     1.6.4
// @description Enhances the FIFA Ultimate Team 21 Web app. Includes Futbin integration and other useful tools
// @license     MIT
// @author      Tim Klingeleers
// @match       https://www.ea.com/fifa/ultimate-team/web-app/*
// @match       https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @namespace   https://github.com/Mardaneus86
// @supportURL  https://github.com/Mardaneus86/futwebapp-tampermonkey/issues
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       window.focus
// @connect     ea.com
// @connect     futbin.com
// @connect     google-analytics.com
// @downloadURL https://update.greasyfork.org/scripts/412485/FUT%20Enhancer%20%28modifi%C3%A9%20FIFA%2021%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412485/FUT%20Enhancer%20%28modifi%C3%A9%20FIFA%2021%29.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/    // The module cache
/******/    var installedModules = {};
/******/
/******/    // The require function
/******/    function __webpack_require__(moduleId) {
/******/
/******/        // Check if module is in cache
/******/        if(installedModules[moduleId]) {
/******/            return installedModules[moduleId].exports;
/******/        }
/******/        // Create a new module (and put it into the cache)
/******/        var module = installedModules[moduleId] = {
/******/            i: moduleId,
/******/            l: false,
/******/            exports: {}
/******/        };
/******/
/******/        // Execute the module function
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/        // Flag the module as loaded
/******/        module.l = true;
/******/
/******/        // Return the exports of the module
/******/        return module.exports;
/******/    }
/******/
/******/
/******/    // expose the modules object (__webpack_modules__)
/******/    __webpack_require__.m = modules;
/******/
/******/    // expose the module cache
/******/    __webpack_require__.c = installedModules;
/******/
/******/    // define getter function for harmony exports
/******/    __webpack_require__.d = function(exports, name, getter) {
/******/        if(!__webpack_require__.o(exports, name)) {
/******/            Object.defineProperty(exports, name, {
/******/                configurable: false,
/******/                enumerable: true,
/******/                get: getter
/******/            });
/******/        }
/******/    };
/******/
/******/    // getDefaultExport function for compatibility with non-harmony modules
/******/    __webpack_require__.n = function(module) {
/******/        var getter = module && module.__esModule ?
/******/            function getDefault() { return module['default']; } :
/******/            function getModuleExports() { return module; };
/******/        __webpack_require__.d(getter, 'a', getter);
/******/        return getter;
/******/    };
/******/
/******/    // Object.prototype.hasOwnProperty.call
/******/    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/    // __webpack_public_path__
/******/    __webpack_require__.p = "";
/******/
/******/    // Load entry module and return exports
/******/    return __webpack_require__(__webpack_require__.s = 137);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(22);
var hide = __webpack_require__(12);
var redefine = __webpack_require__(13);
var ctx = __webpack_require__(19);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(52)('wks');
var uid = __webpack_require__(33);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1);
var IE8_DOM_DEFINE = __webpack_require__(96);
var toPrimitive = __webpack_require__(23);
var dP = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(25);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var createDesc = __webpack_require__(32);
module.exports = __webpack_require__(6) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(12);
var has = __webpack_require__(11);
var SRC = __webpack_require__(33)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(22).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var fails = __webpack_require__(3);
var defined = __webpack_require__(24);
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(49);
var defined = __webpack_require__(24);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(50);
var createDesc = __webpack_require__(32);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(23);
var has = __webpack_require__(11);
var IE8_DOM_DEFINE = __webpack_require__(96);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(11);
var toObject = __webpack_require__(9);
var IE_PROTO = __webpack_require__(70)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analytics = exports.browser = exports.SettingsEntry = exports.Settings = exports.Queue = exports.Database = exports.BaseScript = undefined;

var _settings = __webpack_require__(130);

var _settingsEntry = __webpack_require__(352);

var _baseScript = __webpack_require__(353);

var _db = __webpack_require__(66);

var _queue = __webpack_require__(354);

var _browser = __webpack_require__(360);

var _browser2 = _interopRequireDefault(_browser);

var _analytics = __webpack_require__(131);

var _analytics2 = _interopRequireDefault(_analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BaseScript = _baseScript.BaseScript;
exports.Database = _db.Database;
exports.Queue = _queue.Queue;
exports.Settings = _settings.Settings;
exports.SettingsEntry = _settingsEntry.SettingsEntry;
exports.browser = _browser2.default;
exports.analytics = _analytics2.default;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(10);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(3);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(22);
var fails = __webpack_require__(3);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(19);
var IObject = __webpack_require__(49);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(8);
var asc = __webpack_require__(87);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if (__webpack_require__(6)) {
  var LIBRARY = __webpack_require__(34);
  var global = __webpack_require__(2);
  var fails = __webpack_require__(3);
  var $export = __webpack_require__(0);
  var $typed = __webpack_require__(62);
  var $buffer = __webpack_require__(93);
  var ctx = __webpack_require__(19);
  var anInstance = __webpack_require__(40);
  var propertyDesc = __webpack_require__(32);
  var hide = __webpack_require__(12);
  var redefineAll = __webpack_require__(42);
  var toInteger = __webpack_require__(25);
  var toLength = __webpack_require__(8);
  var toIndex = __webpack_require__(122);
  var toAbsoluteIndex = __webpack_require__(36);
  var toPrimitive = __webpack_require__(23);
  var has = __webpack_require__(11);
  var classof = __webpack_require__(51);
  var isObject = __webpack_require__(4);
  var toObject = __webpack_require__(9);
  var isArrayIter = __webpack_require__(84);
  var create = __webpack_require__(37);
  var getPrototypeOf = __webpack_require__(17);
  var gOPN = __webpack_require__(38).f;
  var getIterFn = __webpack_require__(86);
  var uid = __webpack_require__(33);
  var wks = __webpack_require__(5);
  var createArrayMethod = __webpack_require__(27);
  var createArrayIncludes = __webpack_require__(53);
  var speciesConstructor = __webpack_require__(60);
  var ArrayIterators = __webpack_require__(89);
  var Iterators = __webpack_require__(45);
  var $iterDetect = __webpack_require__(57);
  var setSpecies = __webpack_require__(39);
  var arrayFill = __webpack_require__(88);
  var arrayCopyWithin = __webpack_require__(112);
  var $DP = __webpack_require__(7);
  var $GOPD = __webpack_require__(16);
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var Map = __webpack_require__(117);
var $export = __webpack_require__(0);
var shared = __webpack_require__(52)('metadata');
var store = shared.store || (shared.store = new (__webpack_require__(120))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(33)('meta');
var isObject = __webpack_require__(4);
var has = __webpack_require__(11);
var setDesc = __webpack_require__(7).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(3)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(12)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(98);
var enumBugKeys = __webpack_require__(71);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(25);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(1);
var dPs = __webpack_require__(99);
var enumBugKeys = __webpack_require__(71);
var IE_PROTO = __webpack_require__(70)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(68)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(72).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(98);
var hiddenKeys = __webpack_require__(71).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var dP = __webpack_require__(7);
var DESCRIPTORS = __webpack_require__(6);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(19);
var call = __webpack_require__(110);
var isArrayIter = __webpack_require__(84);
var anObject = __webpack_require__(1);
var toLength = __webpack_require__(8);
var getIterFn = __webpack_require__(86);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(13);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f;
var has = __webpack_require__(11);
var TAG = __webpack_require__(5)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var defined = __webpack_require__(24);
var fails = __webpack_require__(3);
var spaces = __webpack_require__(74);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
    var list = [];

    // return the list of modules as css string
    list.toString = function toString() {
        return this.map(function (item) {
            var content = cssWithMappingToString(item, useSourceMap);
            if(item[2]) {
                return "@media " + item[2] + "{" + content + "}";
            } else {
                return content;
            }
        }).join("");
    };

    // import a list of modules into the list
    list.i = function(modules, mediaQuery) {
        if(typeof modules === "string")
            modules = [[null, modules, ""]];
        var alreadyImportedModules = {};
        for(var i = 0; i < this.length; i++) {
            var id = this[i][0];
            if(typeof id === "number")
                alreadyImportedModules[id] = true;
        }
        for(i = 0; i < modules.length; i++) {
            var item = modules[i];
            // skip already imported module
            // this implementation is not 100% perfect for weird media query combinations
            //  when a module is imported multiple times with different media queries.
            //  I hope this will never occur (Hey this way we have smaller bundles)
            if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                if(mediaQuery && !item[2]) {
                    item[2] = mediaQuery;
                } else if(mediaQuery) {
                    item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                }
                list.push(item);
            }
        }
    };
    return list;
};

function cssWithMappingToString(item, useSourceMap) {
    var content = item[1] || '';
    var cssMapping = item[3];
    if (!cssMapping) {
        return content;
    }

    if (useSourceMap && typeof btoa === 'function') {
        var sourceMapping = toComment(cssMapping);
        var sourceURLs = cssMapping.sources.map(function (source) {
            return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
        });

        return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
    }

    return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
    var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

    return '/*# ' + data + ' */';
}


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var memoize = function (fn) {
    var memo;

    return function () {
        if (typeof memo === "undefined") memo = fn.apply(this, arguments);
        return memo;
    };
};

var isOldIE = memoize(function () {
    // Test for IE <= 9 as proposed by Browserhacks
    // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
    // Tests for existence of standard globals is to allow style-loader
    // to operate correctly into non-standard environments
    // @see https://github.com/webpack-contrib/style-loader/issues/177
    return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
    var memo = {};

    return function(selector) {
        if (typeof memo[selector] === "undefined") {
            var styleTarget = fn.call(this, selector);
            // Special case to return head of iframe instead of iframe itself
            if (styleTarget instanceof window.HTMLIFrameElement) {
                try {
                    // This will throw an exception if access to iframe is blocked
                    // due to cross-origin restrictions
                    styleTarget = styleTarget.contentDocument.head;
                } catch(e) {
                    styleTarget = null;
                }
            }
            memo[selector] = styleTarget;
        }
        return memo[selector]
    };
})(function (target) {
    return document.querySelector(target)
});

var singleton = null;
var singletonCounter = 0;
var stylesInsertedAtTop = [];

var fixUrls = __webpack_require__(342);

module.exports = function(list, options) {
    if (typeof DEBUG !== "undefined" && DEBUG) {
        if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
    }

    options = options || {};

    options.attrs = typeof options.attrs === "object" ? options.attrs : {};

    // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
    // tags it will allow on a page
    if (!options.singleton) options.singleton = isOldIE();

    // By default, add <style> tags to the <head> element
    if (!options.insertInto) options.insertInto = "head";

    // By default, add <style> tags to the bottom of the target
    if (!options.insertAt) options.insertAt = "bottom";

    var styles = listToStyles(list, options);

    addStylesToDom(styles, options);

    return function update (newList) {
        var mayRemove = [];

        for (var i = 0; i < styles.length; i++) {
            var item = styles[i];
            var domStyle = stylesInDom[item.id];

            domStyle.refs--;
            mayRemove.push(domStyle);
        }

        if(newList) {
            var newStyles = listToStyles(newList, options);
            addStylesToDom(newStyles, options);
        }

        for (var i = 0; i < mayRemove.length; i++) {
            var domStyle = mayRemove[i];

            if(domStyle.refs === 0) {
                for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

                delete stylesInDom[domStyle.id];
            }
        }
    };
};

function addStylesToDom (styles, options) {
    for (var i = 0; i < styles.length; i++) {
        var item = styles[i];
        var domStyle = stylesInDom[item.id];

        if(domStyle) {
            domStyle.refs++;

            for(var j = 0; j < domStyle.parts.length; j++) {
                domStyle.parts[j](item.parts[j]);
            }

            for(; j < item.parts.length; j++) {
                domStyle.parts.push(addStyle(item.parts[j], options));
            }
        } else {
            var parts = [];

            for(var j = 0; j < item.parts.length; j++) {
                parts.push(addStyle(item.parts[j], options));
            }

            stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
        }
    }
}

function listToStyles (list, options) {
    var styles = [];
    var newStyles = {};

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var id = options.base ? item[0] + options.base : item[0];
        var css = item[1];
        var media = item[2];
        var sourceMap = item[3];
        var part = {css: css, media: media, sourceMap: sourceMap};

        if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
        else newStyles[id].parts.push(part);
    }

    return styles;
}

function insertStyleElement (options, style) {
    var target = getElement(options.insertInto)

    if (!target) {
        throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
    }

    var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

    if (options.insertAt === "top") {
        if (!lastStyleElementInsertedAtTop) {
            target.insertBefore(style, target.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            target.appendChild(style);
        }
        stylesInsertedAtTop.push(style);
    } else if (options.insertAt === "bottom") {
        target.appendChild(style);
    } else if (typeof options.insertAt === "object" && options.insertAt.before) {
        var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
        target.insertBefore(style, nextSibling);
    } else {
        throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
    }
}

function removeStyleElement (style) {
    if (style.parentNode === null) return false;
    style.parentNode.removeChild(style);

    var idx = stylesInsertedAtTop.indexOf(style);
    if(idx >= 0) {
        stylesInsertedAtTop.splice(idx, 1);
    }
}

function createStyleElement (options) {
    var style = document.createElement("style");

    options.attrs.type = "text/css";

    addAttrs(style, options.attrs);
    insertStyleElement(options, style);

    return style;
}

function createLinkElement (options) {
    var link = document.createElement("link");

    options.attrs.type = "text/css";
    options.attrs.rel = "stylesheet";

    addAttrs(link, options.attrs);
    insertStyleElement(options, link);

    return link;
}

function addAttrs (el, attrs) {
    Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
    });
}

function addStyle (obj, options) {
    var style, update, remove, result;

    // If a transform function was defined, run it on the css
    if (options.transform && obj.css) {
        result = options.transform(obj.css);

        if (result) {
            // If transform returns a value, use that instead of the original css.
            // This allows running runtime transformations on the css.
            obj.css = result;
        } else {
            // If the transform function returns a falsy value, don't add this css.
            // This allows conditional loading of css
            return function() {
                // noop
            };
        }
    }

    if (options.singleton) {
        var styleIndex = singletonCounter++;

        style = singleton || (singleton = createStyleElement(options));

        update = applyToSingletonTag.bind(null, style, styleIndex, false);
        remove = applyToSingletonTag.bind(null, style, styleIndex, true);

    } else if (
        obj.sourceMap &&
        typeof URL === "function" &&
        typeof URL.createObjectURL === "function" &&
        typeof URL.revokeObjectURL === "function" &&
        typeof Blob === "function" &&
        typeof btoa === "function"
    ) {
        style = createLinkElement(options);
        update = updateLink.bind(null, style, options);
        remove = function () {
            removeStyleElement(style);

            if(style.href) URL.revokeObjectURL(style.href);
        };
    } else {
        style = createStyleElement(options);
        update = applyToTag.bind(null, style);
        remove = function () {
            removeStyleElement(style);
        };
    }

    update(obj);

    return function updateStyle (newObj) {
        if (newObj) {
            if (
                newObj.css === obj.css &&
                newObj.media === obj.media &&
                newObj.sourceMap === obj.sourceMap
            ) {
                return;
            }

            update(obj = newObj);
        } else {
            remove();
        }
    };
}

var replaceText = (function () {
    var textStore = [];

    return function (index, replacement) {
        textStore[index] = replacement;

        return textStore.filter(Boolean).join('\n');
    };
})();

function applyToSingletonTag (style, index, remove, obj) {
    var css = remove ? "" : obj.css;

    if (style.styleSheet) {
        style.styleSheet.cssText = replaceText(index, css);
    } else {
        var cssNode = document.createTextNode(css);
        var childNodes = style.childNodes;

        if (childNodes[index]) style.removeChild(childNodes[index]);

        if (childNodes.length) {
            style.insertBefore(cssNode, childNodes[index]);
        } else {
            style.appendChild(cssNode);
        }
    }
}

function applyToTag (style, obj) {
    var css = obj.css;
    var media = obj.media;

    if(media) {
        style.setAttribute("media", media)
    }

    if(style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        while(style.firstChild) {
            style.removeChild(style.firstChild);
        }

        style.appendChild(document.createTextNode(css));
    }
}

function updateLink (link, options, obj) {
    var css = obj.css;
    var sourceMap = obj.sourceMap;

    /*
        If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
        and there is no publicPath defined then lets turn convertToAbsoluteUrls
        on by default.  Otherwise default to the convertToAbsoluteUrls option
        directly
    */
    var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

    if (options.convertToAbsoluteUrls || autoFixUrls) {
        css = fixUrls(css);
    }

    if (sourceMap) {
        // http://stackoverflow.com/a/26603875
        css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
    }

    var blob = new Blob([css], { type: "text/css" });

    var oldSrc = link.href;

    link.href = URL.createObjectURL(blob);

    if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(20);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(20);
var TAG = __webpack_require__(5)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(8);
var toAbsoluteIndex = __webpack_require__(36);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(20);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4);
var cof = __webpack_require__(20);
var MATCH = __webpack_require__(5)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(5)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(1);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__(12);
var redefine = __webpack_require__(13);
var fails = __webpack_require__(3);
var defined = __webpack_require__(24);
var wks = __webpack_require__(5);

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var SPECIES = __webpack_require__(5)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(13);
var redefineAll = __webpack_require__(42);
var meta = __webpack_require__(30);
var forOf = __webpack_require__(41);
var anInstance = __webpack_require__(40);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var $iterDetect = __webpack_require__(57);
var setToStringTag = __webpack_require__(43);
var inheritIfRequired = __webpack_require__(75);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(12);
var uid = __webpack_require__(33);
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(34) || !__webpack_require__(3)(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete __webpack_require__(2)[K];
});


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(0);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var ctx = __webpack_require__(19);
var forOf = __webpack_require__(41);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint valid-typeof: "error" */

var Database = exports.Database = function () {
  function Database() {
    _classCallCheck(this, Database);

    this.set('database-version', '1');
  }

  _createClass(Database, null, [{
    key: 'set',
    value: function set(key, value) {
      GM_setValue(key, value);
    }
  }, {
    key: 'setJson',
    value: function setJson(key, value) {
      this.set(key, JSON.stringify(value));
    }
  }, {
    key: 'get',
    value: function get(key, defaultValue) {
      var value = defaultValue;
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        value = JSON.stringify(value);
      }
      return GM_getValue(key, value);
    }
  }, {
    key: 'getJson',
    value: function getJson(key, defaultValue) {
      return JSON.parse(this.get(key, defaultValue));
    }
  }]);

  return Database;
}();

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.priceTiers = exports.utils = exports.TransferMarket = exports.Store = exports.PinEvent = exports.Logger = exports.Club = undefined;

var _logger = __webpack_require__(132);

var _pinEvent = __webpack_require__(133);

var _store = __webpack_require__(355);

var _transferMarket = __webpack_require__(356);

var _club = __webpack_require__(359);

var _utils = __webpack_require__(134);

var _utils2 = _interopRequireDefault(_utils);

var _priceTiers = __webpack_require__(135);

var _priceTiers2 = _interopRequireDefault(_priceTiers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Club = _club.Club;
exports.Logger = _logger.Logger;
exports.PinEvent = _pinEvent.PinEvent;
exports.Store = _store.Store;
exports.TransferMarket = _transferMarket.TransferMarket;
exports.utils = _utils2.default;
exports.priceTiers = _priceTiers2.default;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(22);
var LIBRARY = __webpack_require__(34);
var wksExt = __webpack_require__(97);
var defineProperty = __webpack_require__(7).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(52)('keys');
var uid = __webpack_require__(33);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(19)(Function.call, __webpack_require__(16).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var setPrototypeOf = __webpack_require__(73).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(25);
var defined = __webpack_require__(24);

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};


/***/ }),
/* 78 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(25);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(34);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(13);
var hide = __webpack_require__(12);
var has = __webpack_require__(11);
var Iterators = __webpack_require__(45);
var $iterCreate = __webpack_require__(81);
var setToStringTag = __webpack_require__(43);
var getPrototypeOf = __webpack_require__(17);
var ITERATOR = __webpack_require__(5)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(37);
var descriptor = __webpack_require__(32);
var setToStringTag = __webpack_require__(43);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(12)(IteratorPrototype, __webpack_require__(5)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(56);
var defined = __webpack_require__(24);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(45);
var ITERATOR = __webpack_require__(5)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(7);
var createDesc = __webpack_require__(32);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(51);
var ITERATOR = __webpack_require__(5)('iterator');
var Iterators = __webpack_require__(45);
module.exports = __webpack_require__(22).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(230);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(8);
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(31);
var step = __webpack_require__(113);
var Iterators = __webpack_require__(45);
var toIObject = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(80)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(19);
var invoke = __webpack_require__(103);
var html = __webpack_require__(72);
var cel = __webpack_require__(68);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(20)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(90).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(20)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(10);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(6);
var LIBRARY = __webpack_require__(34);
var $typed = __webpack_require__(62);
var hide = __webpack_require__(12);
var redefineAll = __webpack_require__(42);
var fails = __webpack_require__(3);
var anInstance = __webpack_require__(40);
var toInteger = __webpack_require__(25);
var toLength = __webpack_require__(8);
var toIndex = __webpack_require__(122);
var gOPN = __webpack_require__(38).f;
var dP = __webpack_require__(7).f;
var arrayFill = __webpack_require__(88);
var setToStringTag = __webpack_require__(43);
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FutbinSettings = undefined;

var _core = __webpack_require__(18);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FutbinSettings = exports.FutbinSettings = function (_SettingsEntry) {
  _inherits(FutbinSettings, _SettingsEntry);

  function FutbinSettings() {
    _classCallCheck(this, FutbinSettings);

    var _this = _possibleConstructorReturn(this, (FutbinSettings.__proto__ || Object.getPrototypeOf(FutbinSettings)).call(this, 'futbin', 'FutBIN integration'));

    _this.addSetting('Show link to player page', 'show-link-to-player', false, 'checkbox');
    _this.addSetting('Show prices on SBC and Squad', 'show-sbc-squad', false, 'checkbox');
    _this.addSetting('Mark bargains', 'show-bargains', false, 'checkbox');
    return _this;
  }

  return FutbinSettings;
}(_core.SettingsEntry);

FutbinSettings.id = 'futbin';

/***/ }),
/* 95 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
    return this;
})();

try {
    // This works if eval is allowed (see CSP)
    g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
    // This works if the window reference is available
    if(typeof window === "object")
        g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(3)(function () {
  return Object.defineProperty(__webpack_require__(68)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(11);
var toIObject = __webpack_require__(15);
var arrayIndexOf = __webpack_require__(53)(false);
var IE_PROTO = __webpack_require__(70)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7);
var anObject = __webpack_require__(1);
var getKeys = __webpack_require__(35);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(15);
var gOPN = __webpack_require__(38).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(35);
var gOPS = __webpack_require__(54);
var pIE = __webpack_require__(50);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(49);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(10);
var isObject = __webpack_require__(4);
var invoke = __webpack_require__(103);
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};


/***/ }),
/* 103 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt;
var $trim = __webpack_require__(44).trim;
var ws = __webpack_require__(74);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat;
var $trim = __webpack_require__(44).trim;

module.exports = 1 / $parseFloat(__webpack_require__(74) + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(20);
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),
/* 108 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var sign = __webpack_require__(77);
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(10);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(49);
var toLength = __webpack_require__(8);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(8);

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(6) && /./g.flags != 'g') __webpack_require__(7).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(58)
});


/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var newPromiseCapability = __webpack_require__(92);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(118);
var validate = __webpack_require__(46);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(61)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(7).f;
var create = __webpack_require__(37);
var redefineAll = __webpack_require__(42);
var ctx = __webpack_require__(19);
var anInstance = __webpack_require__(40);
var forOf = __webpack_require__(41);
var $iterDefine = __webpack_require__(80);
var step = __webpack_require__(113);
var setSpecies = __webpack_require__(39);
var DESCRIPTORS = __webpack_require__(6);
var fastKey = __webpack_require__(30).fastKey;
var validate = __webpack_require__(46);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(118);
var validate = __webpack_require__(46);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(61)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var each = __webpack_require__(27)(0);
var redefine = __webpack_require__(13);
var meta = __webpack_require__(30);
var assign = __webpack_require__(101);
var weak = __webpack_require__(121);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var validate = __webpack_require__(46);
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(61)(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll = __webpack_require__(42);
var getWeak = __webpack_require__(30).getWeak;
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var anInstance = __webpack_require__(40);
var forOf = __webpack_require__(41);
var createArrayMethod = __webpack_require__(27);
var $has = __webpack_require__(11);
var validate = __webpack_require__(46);
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = __webpack_require__(25);
var toLength = __webpack_require__(8);
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(38);
var gOPS = __webpack_require__(54);
var anObject = __webpack_require__(1);
var Reflect = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = __webpack_require__(55);
var isObject = __webpack_require__(4);
var toLength = __webpack_require__(8);
var ctx = __webpack_require__(19);
var IS_CONCAT_SPREADABLE = __webpack_require__(5)('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(8);
var repeat = __webpack_require__(76);
var defined = __webpack_require__(24);

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(35);
var toIObject = __webpack_require__(15);
var isEnum = __webpack_require__(50).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(51);
var from = __webpack_require__(128);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(41);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 129 */
/***/ (function(module, exports) {

// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Settings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitterEs = __webpack_require__(346);

var _eventEmitterEs2 = _interopRequireDefault(_eventEmitterEs);

var _analytics = __webpack_require__(131);

var _analytics2 = _interopRequireDefault(_analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = exports.Settings = function (_EventEmitter) {
  _inherits(Settings, _EventEmitter);

  function Settings() {
    _classCallCheck(this, Settings);

    var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this));

    _this._entries = [];
    return _this;
  }

  _createClass(Settings, [{
    key: 'registerEntry',


    /**
     *
     * @param {SettingsEntry} entry The entry for the settings
     */
    value: function registerEntry(entry) {
      this._entries.push(entry);

      if (entry.isActive) {
        this._emitEvent(entry);
      }
    }
  }, {
    key: 'getEntries',
    value: function getEntries() {
      return this._entries;
    }
  }, {
    key: 'toggleEntry',
    value: function toggleEntry(id) {
      var entries = this._entries.filter(function (e) {
        return e.id === id;
      });
      if (!entries || entries.length === 0) {
        return;
      }

      entries[0].toggle();

      _analytics2.default.trackEvent('Settings', 'Toggle setting ' + id, entries[0].isActive);
      this._emitEvent(entries[0]);
    }
  }, {
    key: '_emitEvent',
    value: function _emitEvent(entry) {
      if (entry.isActive) {
        this.emit('entry-enabled', entry);
      } else {
        this.emit('entry-disabled', entry);
      }
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (this._instance == null) {
        this._instance = new Settings();
      }

      return this._instance;
    }
  }]);

  return Settings;
}(_eventEmitterEs2.default);

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _analytics = __webpack_require__(347);

var _analytics2 = _interopRequireDefault(_analytics);

var _db = __webpack_require__(66);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Analytics = function () {
  function Analytics() {
    _classCallCheck(this, Analytics);

    if (this.ua === undefined) {
      var id = _db.Database.get('uuid', '');
      if (id === '') {
        id = this._uuidv4();
        _db.Database.set('uuid', id);
      }

      this.ua = (0, _analytics2.default)(null, null, {
        tid: "UA-126264296-2",
        cid: id,
        uid: id
      });
    }
  }

  /* eslint-disable */


  _createClass(Analytics, [{
    key: '_uuidv4',
    value: function _uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
    /* eslint-enable */

  }, {
    key: 'trackPage',
    value: function trackPage(pageId) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.ua.pageview(pageId, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'trackEvent',
    value: function trackEvent(category, action) {
      var _this2 = this;

      var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      return new Promise(function (resolve, reject) {
        _this2.ua.event(category, action, label, value, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }]);

  return Analytics;
}();

exports.default = new Analytics();

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = exports.Logger = function () {
  function Logger() {
    _classCallCheck(this, Logger);

    this._storeName = 'logger';
  }

  _createClass(Logger, [{
    key: 'log',
    value: function log(message) {
      var category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'FUT';

      /* eslint-disable no-console */
      console.log(category + ': ' + message);
      /* eslint-enable no-console */
      var log = JSON.parse(GM_getValue(this._storeName, '[]'));
      log.push(category + ': ' + message);
      GM_setValue(this._storeName, JSON.stringify(log));
    }
  }, {
    key: 'reset',
    value: function reset() {
      GM_setValue(this._storeName, '[]');
    }
  }]);

  return Logger;
}();

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* globals PIN_PAGEVIEW_EVT_TYPE services enums */

var PinEvent = exports.PinEvent = function () {
  function PinEvent() {
    _classCallCheck(this, PinEvent);
  }

  _createClass(PinEvent, null, [{
    key: "sendPageView",
    value: function sendPageView(pageId) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

      return new Promise(function (resolve) {
        return setTimeout(function () {
          services.PIN.sendData(enums.PIN.EVENT.PAGE_VIEW, {
            type: PIN_PAGEVIEW_EVT_TYPE,
            pgid: pageId
          });
          resolve();
        }, delay);
      });
    }
  }]);

  return PinEvent;
}();

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* globals
services
*/

exports.default = {
  /**
   * Sleep for a while
   *
   * @param {number} min minimum sleep time in ms
   * @param {number} variance maximum variation to add to the minimum in ms
   */
  sleep: function sleep(min) {
    var variance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

    var delay = min + Math.floor(Math.random() * variance);
    // new Logger().log(`Delay for ${delay} (requested: ${min}+${variance})`, 'Core');
    return new Promise(function (resolve) {
      return setTimeout(resolve, delay);
    });
  },
  getPlatform: function getPlatform() {
    if (services.User.getUser().getSelectedPersona().isPlaystation) {
      return 'ps';
    }
    if (services.User.getUser().getSelectedPersona().isPC) {
      return 'pc';
    }
    if (services.User.getUser().getSelectedPersona().isXbox) {
      return 'xbox';
    }

    throw new Error('unknown platform');
  }
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global utils UTCurrencyInputControl */
exports.default = {
  roundValueToNearestPriceTiers: function roundValueToNearestPriceTiers(value) {
    var tier = utils.JS.find(UTCurrencyInputControl.PRICE_TIERS, function (i) {
      return value > i.min;
    });

    var diff = value % tier.inc;

    if (diff === 0) {
      return value;
    } else if (diff < tier.inc / 2) {
      return value - diff;
    }
    return value + (tier.inc - diff);
  },
  roundDownToNearestPriceTiers: function roundDownToNearestPriceTiers(value) {
    var tier = utils.JS.find(UTCurrencyInputControl.PRICE_TIERS, function (i) {
      return value > i.min;
    });

    var diff = value % tier.inc;

    if (diff === 0) {
      return value - tier.inc;
    }
    return value - diff;
  },
  determineListPrice: function determineListPrice(start, buyNow) {
    var tier = utils.JS.find(UTCurrencyInputControl.PRICE_TIERS, function (i) {
      return buyNow > i.min;
    });

    var startPrice = this.roundValueToNearestPriceTiers(start);
    var buyNowPrice = this.roundValueToNearestPriceTiers(buyNow);

    if (startPrice === buyNowPrice) {
      buyNowPrice += tier.inc;
    }

    return {
      start: startPrice,
      buyNow: buyNowPrice
    };
  }
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstantBinConfirmSettings = undefined;

var _core = __webpack_require__(18);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InstantBinConfirmSettings = exports.InstantBinConfirmSettings = function (_SettingsEntry) {
  _inherits(InstantBinConfirmSettings, _SettingsEntry);

  function InstantBinConfirmSettings() {
    _classCallCheck(this, InstantBinConfirmSettings);

    return _possibleConstructorReturn(this, (InstantBinConfirmSettings.__proto__ || Object.getPrototypeOf(InstantBinConfirmSettings)).call(this, 'instant-bin-confirm', 'Instantly confirm Buy It Now dialog'));
  }

  return InstantBinConfirmSettings;
}(_core.SettingsEntry);

InstantBinConfirmSettings.id = 'instant-bin-confirm';

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(138);

__webpack_require__(340);

var _settings = __webpack_require__(343);

var _settings2 = _interopRequireDefault(_settings);

var _core = __webpack_require__(18);

var _fut = __webpack_require__(67);

var _transferlist = __webpack_require__(362);

var _futbin = __webpack_require__(374);

var _instantBinConfirm = __webpack_require__(379);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import {
  ClubInfoSettings,
} from './club';
*/

/* globals onVisibilityChanged services UTGameFlowNavigationController
UTViewController EAObservable  window document $ */
window.onPageNavigation = new EAObservable ();
/*
  RemoveSoldAuctionsSettings,
  RelistAuctionsSettings,
*/


window.currentPage = '';

// prevent debugger trap
setInterval(function () {
  _0x1a026c = function _0x1a026c() {}; // eslint-disable-line no-global-assign, no-undef
}, 500);

UTGameFlowNavigationController.prototype.didPush = function (t) {
  if (t) {
    _core.analytics.trackPage(t.className);
    window.onPageNavigation.notify(t.className);
    window.currentPage = t.className;
  }
};

UTViewController.prototype.didPresent = function (t) {
  if (t) {
    _core.analytics.trackPage(t.className);
    window.onPageNavigation.notify(t.className);
    window.currentPage = t.className;
  }
};

services.Authentication._oAuthentication.observe(undefined, function () {
  // reset the logs at startup
  new _fut.Logger().reset();

  // force full web app layout in any case
  $('body').removeClass('phone').addClass('landscape');

  _core.Queue.getInstance().start();

  // get rid of pinEvents when switching tabs
  document.removeEventListener('visibilitychange', onVisibilityChanged);

  var settings = _core.Settings.getInstance();
  settings.registerEntry(new _transferlist.RefreshListSettings());
  settings.registerEntry(new _transferlist.MinBinSettings());
  settings.registerEntry(new _transferlist.CardInfoSettings());
  settings.registerEntry(new _transferlist.ListSizeSettings());
  settings.registerEntry(new _transferlist.TransferTotalsSettings());

  settings.registerEntry(new _futbin.FutbinSettings());
  settings.registerEntry(new _instantBinConfirm.InstantBinConfirmSettings());

  (0, _settings2.default)(settings);
});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(139);

__webpack_require__(336);

__webpack_require__(337);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(95)))

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(140);
__webpack_require__(142);
__webpack_require__(143);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(146);
__webpack_require__(147);
__webpack_require__(148);
__webpack_require__(149);
__webpack_require__(150);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(153);
__webpack_require__(154);
__webpack_require__(155);
__webpack_require__(156);
__webpack_require__(158);
__webpack_require__(159);
__webpack_require__(160);
__webpack_require__(161);
__webpack_require__(162);
__webpack_require__(163);
__webpack_require__(164);
__webpack_require__(165);
__webpack_require__(166);
__webpack_require__(167);
__webpack_require__(168);
__webpack_require__(169);
__webpack_require__(170);
__webpack_require__(171);
__webpack_require__(172);
__webpack_require__(173);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(182);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(201);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(205);
__webpack_require__(206);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(209);
__webpack_require__(210);
__webpack_require__(211);
__webpack_require__(212);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(215);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(220);
__webpack_require__(221);
__webpack_require__(223);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(228);
__webpack_require__(229);
__webpack_require__(231);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(237);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(243);
__webpack_require__(89);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(114);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(117);
__webpack_require__(119);
__webpack_require__(120);
__webpack_require__(251);
__webpack_require__(252);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(261);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(265);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(268);
__webpack_require__(269);
__webpack_require__(270);
__webpack_require__(271);
__webpack_require__(272);
__webpack_require__(273);
__webpack_require__(274);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(277);
__webpack_require__(278);
__webpack_require__(279);
__webpack_require__(280);
__webpack_require__(281);
__webpack_require__(282);
__webpack_require__(283);
__webpack_require__(284);
__webpack_require__(285);
__webpack_require__(286);
__webpack_require__(287);
__webpack_require__(288);
__webpack_require__(289);
__webpack_require__(290);
__webpack_require__(291);
__webpack_require__(292);
__webpack_require__(293);
__webpack_require__(294);
__webpack_require__(295);
__webpack_require__(296);
__webpack_require__(297);
__webpack_require__(298);
__webpack_require__(299);
__webpack_require__(300);
__webpack_require__(301);
__webpack_require__(302);
__webpack_require__(303);
__webpack_require__(304);
__webpack_require__(305);
__webpack_require__(306);
__webpack_require__(307);
__webpack_require__(308);
__webpack_require__(309);
__webpack_require__(310);
__webpack_require__(311);
__webpack_require__(312);
__webpack_require__(313);
__webpack_require__(314);
__webpack_require__(315);
__webpack_require__(316);
__webpack_require__(317);
__webpack_require__(318);
__webpack_require__(319);
__webpack_require__(320);
__webpack_require__(321);
__webpack_require__(322);
__webpack_require__(323);
__webpack_require__(324);
__webpack_require__(325);
__webpack_require__(326);
__webpack_require__(327);
__webpack_require__(328);
__webpack_require__(329);
__webpack_require__(330);
__webpack_require__(331);
__webpack_require__(332);
__webpack_require__(333);
__webpack_require__(334);
__webpack_require__(335);
module.exports = __webpack_require__(22);


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(2);
var has = __webpack_require__(11);
var DESCRIPTORS = __webpack_require__(6);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(13);
var META = __webpack_require__(30).KEY;
var $fails = __webpack_require__(3);
var shared = __webpack_require__(52);
var setToStringTag = __webpack_require__(43);
var uid = __webpack_require__(33);
var wks = __webpack_require__(5);
var wksExt = __webpack_require__(97);
var wksDefine = __webpack_require__(69);
var enumKeys = __webpack_require__(141);
var isArray = __webpack_require__(55);
var anObject = __webpack_require__(1);
var toIObject = __webpack_require__(15);
var toPrimitive = __webpack_require__(23);
var createDesc = __webpack_require__(32);
var _create = __webpack_require__(37);
var gOPNExt = __webpack_require__(100);
var $GOPD = __webpack_require__(16);
var $DP = __webpack_require__(7);
var $keys = __webpack_require__(35);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(38).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(50).f = $propertyIsEnumerable;
  __webpack_require__(54).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(34)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(12)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(35);
var gOPS = __webpack_require__(54);
var pIE = __webpack_require__(50);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(37) });


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperty: __webpack_require__(7).f });


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperties: __webpack_require__(99) });


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(15);
var $getOwnPropertyDescriptor = __webpack_require__(16).f;

__webpack_require__(26)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(9);
var $getPrototypeOf = __webpack_require__(17);

__webpack_require__(26)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(9);
var $keys = __webpack_require__(35);

__webpack_require__(26)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(26)('getOwnPropertyNames', function () {
  return __webpack_require__(100).f;
});


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(30).onFreeze;

__webpack_require__(26)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(30).onFreeze;

__webpack_require__(26)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4);
var meta = __webpack_require__(30).onFreeze;

__webpack_require__(26)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(26)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(26)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(26)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(101) });


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { is: __webpack_require__(157) });


/***/ }),
/* 157 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(73).set });


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(51);
var test = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(13)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', { bind: __webpack_require__(102) });


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(7).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(6) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(4);
var getPrototypeOf = __webpack_require__(17);
var HAS_INSTANCE = __webpack_require__(5)('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(7).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(104);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(105);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var has = __webpack_require__(11);
var cof = __webpack_require__(20);
var inheritIfRequired = __webpack_require__(75);
var toPrimitive = __webpack_require__(23);
var fails = __webpack_require__(3);
var gOPN = __webpack_require__(38).f;
var gOPD = __webpack_require__(16).f;
var dP = __webpack_require__(7).f;
var $trim = __webpack_require__(44).trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(37)(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(6) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(13)(global, NUMBER, $Number);
}


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toInteger = __webpack_require__(25);
var aNumberValue = __webpack_require__(106);
var repeat = __webpack_require__(76);
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(3)(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $fails = __webpack_require__(3);
var aNumberValue = __webpack_require__(106);
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(0);
var _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', { isInteger: __webpack_require__(107) });


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(0);
var isInteger = __webpack_require__(107);
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseFloat = __webpack_require__(105);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $parseInt = __webpack_require__(104);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0);
var log1p = __webpack_require__(108);
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0);
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0);
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0);
var sign = __webpack_require__(77);

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0);
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0);
var $expm1 = __webpack_require__(78);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { fround: __webpack_require__(109) });


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0);
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0);
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { log1p: __webpack_require__(108) });


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', { sign: __webpack_require__(77) });


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(78);
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0);
var expm1 = __webpack_require__(78);
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toAbsoluteIndex = __webpack_require__(36);
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toLength = __webpack_require__(8);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(44)('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(79)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(80)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $at = __webpack_require__(79)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(8);
var context = __webpack_require__(82);
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(83)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__(0);
var context = __webpack_require__(82);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(83)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(76)
});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(8);
var context = __webpack_require__(82);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(83)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(14)('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(14)('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(14)('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(14)('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(14)('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(14)('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(14)('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(14)('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(14)('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(14)('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(14)('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(14)('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(14)('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(23);

$export($export.P + $export.F * __webpack_require__(3)(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0);
var toISOString = __webpack_require__(219);

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = __webpack_require__(3);
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  __webpack_require__(13)(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) __webpack_require__(12)(proto, TO_PRIMITIVE, __webpack_require__(222));


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(23);
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(55) });


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(19);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var call = __webpack_require__(110);
var isArrayIter = __webpack_require__(84);
var toLength = __webpack_require__(8);
var createProperty = __webpack_require__(85);
var getIterFn = __webpack_require__(86);

$export($export.S + $export.F * !__webpack_require__(57)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var createProperty = __webpack_require__(85);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(49) != Object || !__webpack_require__(21)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var html = __webpack_require__(72);
var cof = __webpack_require__(20);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(8);
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var toObject = __webpack_require__(9);
var fails = __webpack_require__(3);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(21)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $forEach = __webpack_require__(27)(0);
var STRICT = __webpack_require__(21)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var isArray = __webpack_require__(55);
var SPECIES = __webpack_require__(5)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $map = __webpack_require__(27)(1);

$export($export.P + $export.F * !__webpack_require__(21)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $filter = __webpack_require__(27)(2);

$export($export.P + $export.F * !__webpack_require__(21)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $some = __webpack_require__(27)(3);

$export($export.P + $export.F * !__webpack_require__(21)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $every = __webpack_require__(27)(4);

$export($export.P + $export.F * !__webpack_require__(21)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(111);

$export($export.P + $export.F * !__webpack_require__(21)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(111);

$export($export.P + $export.F * !__webpack_require__(21)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(53)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(21)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(15);
var toInteger = __webpack_require__(25);
var toLength = __webpack_require__(8);
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(21)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { copyWithin: __webpack_require__(112) });

__webpack_require__(31)('copyWithin');


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { fill: __webpack_require__(88) });

__webpack_require__(31)('fill');


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(27)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(31)(KEY);


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(27)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(31)(KEY);


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39)('Array');


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var inheritIfRequired = __webpack_require__(75);
var dP = __webpack_require__(7).f;
var gOPN = __webpack_require__(38).f;
var isRegExp = __webpack_require__(56);
var $flags = __webpack_require__(58);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(6) && (!CORRECT_NEW || __webpack_require__(3)(function () {
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(13)(global, 'RegExp', $RegExp);
}

__webpack_require__(39)('RegExp');


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(114);
var anObject = __webpack_require__(1);
var $flags = __webpack_require__(58);
var DESCRIPTORS = __webpack_require__(6);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(13)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(3)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(59)('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(59)('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(59)('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(59)('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__(56);
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(34);
var global = __webpack_require__(2);
var ctx = __webpack_require__(19);
var classof = __webpack_require__(51);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var aFunction = __webpack_require__(10);
var anInstance = __webpack_require__(40);
var forOf = __webpack_require__(41);
var speciesConstructor = __webpack_require__(60);
var task = __webpack_require__(90).set;
var microtask = __webpack_require__(91)();
var newPromiseCapabilityModule = __webpack_require__(92);
var perform = __webpack_require__(115);
var promiseResolve = __webpack_require__(116);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(42)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(43)($Promise, PROMISE);
__webpack_require__(39)(PROMISE);
Wrapper = __webpack_require__(22)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(57)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(121);
var validate = __webpack_require__(46);
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
__webpack_require__(61)(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $typed = __webpack_require__(62);
var buffer = __webpack_require__(93);
var anObject = __webpack_require__(1);
var toAbsoluteIndex = __webpack_require__(36);
var toLength = __webpack_require__(8);
var isObject = __webpack_require__(4);
var ArrayBuffer = __webpack_require__(2).ArrayBuffer;
var speciesConstructor = __webpack_require__(60);
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(39)(ARRAY_BUFFER);


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(62).ABV, {
  DataView: __webpack_require__(93).DataView
});


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = __webpack_require__(0);
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var rApply = (__webpack_require__(2).Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = __webpack_require__(0);
var create = __webpack_require__(37);
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);
var fails = __webpack_require__(3);
var bind = __webpack_require__(102);
var rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = __webpack_require__(7);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var toPrimitive = __webpack_require__(23);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = __webpack_require__(0);
var gOPD = __webpack_require__(16).f;
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
__webpack_require__(81)(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = __webpack_require__(16);
var getPrototypeOf = __webpack_require__(17);
var has = __webpack_require__(11);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(4);
var anObject = __webpack_require__(1);

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = __webpack_require__(16);
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export = __webpack_require__(0);
var getProto = __webpack_require__(17);
var anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', { ownKeys: __webpack_require__(123) });


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export = __webpack_require__(0);
var anObject = __webpack_require__(1);
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = __webpack_require__(7);
var gOPD = __webpack_require__(16);
var getPrototypeOf = __webpack_require__(17);
var has = __webpack_require__(11);
var $export = __webpack_require__(0);
var createDesc = __webpack_require__(32);
var anObject = __webpack_require__(1);
var isObject = __webpack_require__(4);

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = __webpack_require__(0);
var setProto = __webpack_require__(73);

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__(0);
var $includes = __webpack_require__(53)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(31)('includes');


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(124);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(8);
var aFunction = __webpack_require__(10);
var arraySpeciesCreate = __webpack_require__(87);

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

__webpack_require__(31)('flatMap');


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = __webpack_require__(0);
var flattenIntoArray = __webpack_require__(124);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(8);
var toInteger = __webpack_require__(25);
var arraySpeciesCreate = __webpack_require__(87);

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

__webpack_require__(31)('flatten');


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(0);
var $at = __webpack_require__(79)(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(125);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0);
var $pad = __webpack_require__(125);

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(44)('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(44)('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/
var $export = __webpack_require__(0);
var defined = __webpack_require__(24);
var toLength = __webpack_require__(8);
var isRegExp = __webpack_require__(56);
var getFlags = __webpack_require__(58);
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

__webpack_require__(81)($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(69)('asyncIterator');


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(69)('observable');


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);
var ownKeys = __webpack_require__(123);
var toIObject = __webpack_require__(15);
var gOPD = __webpack_require__(16);
var createProperty = __webpack_require__(85);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(126)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $entries = __webpack_require__(126)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var aFunction = __webpack_require__(10);
var $defineProperty = __webpack_require__(7);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(6) && $export($export.P + __webpack_require__(63), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var aFunction = __webpack_require__(10);
var $defineProperty = __webpack_require__(7);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(6) && $export($export.P + __webpack_require__(63), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(23);
var getPrototypeOf = __webpack_require__(17);
var getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(63), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(23);
var getPrototypeOf = __webpack_require__(17);
var getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(63), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(127)('Map') });


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(0);

$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(127)('Set') });


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(64)('Map');


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
__webpack_require__(64)('Set');


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
__webpack_require__(64)('WeakMap');


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
__webpack_require__(64)('WeakSet');


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(65)('Map');


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
__webpack_require__(65)('Set');


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
__webpack_require__(65)('WeakMap');


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
__webpack_require__(65)('WeakSet');


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.G, { global: __webpack_require__(2) });


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', { global: __webpack_require__(2) });


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0);
var cof = __webpack_require__(20);

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var scale = __webpack_require__(129);
var fround = __webpack_require__(109);

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

// https://rwaldron.github.io/proposal-math-extensions/
var $export = __webpack_require__(0);

$export($export.S, 'Math', { scale: __webpack_require__(129) });


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

// http://jfbastien.github.io/papers/Math.signbit.html
var $export = __webpack_require__(0);

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(0);
var core = __webpack_require__(22);
var global = __webpack_require__(2);
var speciesConstructor = __webpack_require__(60);
var promiseResolve = __webpack_require__(116);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(0);
var newPromiseCapability = __webpack_require__(92);
var perform = __webpack_require__(115);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(17);
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(119);
var from = __webpack_require__(128);
var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(17);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var getPrototypeOf = __webpack_require__(17);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

var metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

var $metadata = __webpack_require__(29);
var anObject = __webpack_require__(1);
var aFunction = __webpack_require__(10);
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = __webpack_require__(0);
var microtask = __webpack_require__(91)();
var process = __webpack_require__(2).process;
var isNode = __webpack_require__(20)(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable
var $export = __webpack_require__(0);
var global = __webpack_require__(2);
var core = __webpack_require__(22);
var microtask = __webpack_require__(91)();
var OBSERVABLE = __webpack_require__(5)('observable');
var aFunction = __webpack_require__(10);
var anObject = __webpack_require__(1);
var anInstance = __webpack_require__(40);
var redefineAll = __webpack_require__(42);
var hide = __webpack_require__(12);
var forOf = __webpack_require__(41);
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

__webpack_require__(39)('Observable');


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global = __webpack_require__(2);
var $export = __webpack_require__(0);
var navigator = global.navigator;
var slice = [].slice;
var MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var $task = __webpack_require__(90);
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(89);
var getKeys = __webpack_require__(35);
var redefine = __webpack_require__(13);
var global = __webpack_require__(2);
var hide = __webpack_require__(12);
var Iterators = __webpack_require__(45);
var wks = __webpack_require__(5);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
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

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
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

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
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

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

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
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
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
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
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
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

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
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
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

      if (record.type === "break" ||
          record.type === "continue") {
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

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(95)))

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(338);
module.exports = __webpack_require__(22).RegExp.escape;


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0);
var $re = __webpack_require__(339)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });


/***/ }),
/* 339 */
/***/ (function(module, exports) {

module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(341);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(48)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
        module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
            var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./index.scss");
            if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
            update(newContent);
        });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
}

/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(undefined);
// imports


// module
exports.push([module.i, ".ut-content-container {\n  padding: 0; }\n  .ut-content-container .ut-content {\n    border: 0; }\n    .ut-content-container .ut-content.ut-content--split-view-extend {\n      max-height: 100%; }\n\n.listFUTItem .entityContainer .name.untradeable {\n  display: block; }\n  .listFUTItem .entityContainer .name.untradeable::before {\n    position: relative;\n    padding-right: 10px; }\n\n.ut-transfer-list-view .listFUTItem .entityContainer,\n.ut-club-search-results-view.ui-layout-left .listFUTItem .entityContainer,\n.ut-unassigned-view.ui-layout-left .listFUTItem .entityContainer {\n  width: 45%; }\n\n@media (min-width: 1281px) {\n  .ut-content-container .ut-content {\n    max-width: 100%;\n    max-height: 100%; }\n  .ut-split-view .ut-content {\n    max-width: 100%;\n    max-height: 100%; } }\n", ""]);

// exports


/***/ }),
/* 342 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

    // blank or null?
    if (!css || typeof css !== "string") {
      return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

    // convert each url(...)
    /*
    This regular expression is just a way to recursively match brackets within
    a string.

     /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
       (  = Start a capturing group
         (?:  = Start a non-capturing group
             [^)(]  = Match anything that isn't a parentheses
             |  = OR
             \(  = Match a start parentheses
                 (?:  = Start another non-capturing groups
                     [^)(]+  = Match anything that isn't a parentheses
                     |  = OR
                     \(  = Match a start parentheses
                         [^)(]*  = Match anything that isn't a parentheses
                     \)  = Match a end parentheses
                 )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
     \)  = Match a close parens

     /gi  = Get all matches, not the first.  Be case insensitive.
     */
    var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
        // strip quotes (if they exist)
        var unquotedOrigUrl = origUrl
            .trim()
            .replace(/^"(.*)"$/, function(o, $1){ return $1; })
            .replace(/^'(.*)'$/, function(o, $1){ return $1; });

        // already a full url? no change
        if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
          return fullMatch;
        }

        // convert the url to a full url
        var newUrl;

        if (unquotedOrigUrl.indexOf("//") === 0) {
            //TODO: should we add protocol?
            newUrl = unquotedOrigUrl;
        } else if (unquotedOrigUrl.indexOf("/") === 0) {
            // path should be relative to the base url
            newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
        } else {
            // path should be relative to current directory
            newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
        }

        // send back the fixed url(...)
        return "url(" + JSON.stringify(newUrl) + ")";
    });

    // send back the fixed css
    return fixedCss;
};


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(344);

var _core = __webpack_require__(18);

var _settings = __webpack_require__(361);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleFieldChange = function handleFieldChange(entry, setting, e) {
  if (setting.subsettings && setting.subsettings.length > 0) {
    entry.changeValue(setting.key, e.target.checked);
  } else if (setting.type === 'checkbox') {
    entry.changeValue(setting.key, e.target.checked);
  } else {
    entry.changeValue(setting.key, e.target.value);
  }

  if (setting.callback) {
    setting.callback(e.target.value);
  }
  if (setting.subsettings && setting.subsettings.length > 0) {
    $('[data-parent-feature-setting-id=\'' + entry.id + ':' + setting.key + '\']').toggle();
  }
}; /* globals $ */
/* eslint-disable no-restricted-syntax */

var renderSettingsEntry = function renderSettingsEntry(setting, entry) {
  var inputId = entry.id + ':' + setting.key;
  return '<div class="setting">\n    ' + (setting.type !== 'checkbox' ? '<label for="' + inputId + '">' + setting.label + '</label>' : '') + '\n    <input\n      type="' + setting.type + '"\n      id="' + inputId + '"\n      data-feature-setting-id="' + entry.id + ':' + setting.key + '"\n      value="' + setting.value + '"\n      ' + (setting.type === 'checkbox' && setting.value.toString() === 'true' ? 'checked' : '') + '\n    />\n    ' + (setting.type === 'checkbox' ? '<label for="' + inputId + '">' + setting.label + '</label>' : '') + '\n  </div>';
};

exports.default = function (settings) {
  var html = _settings2.default;

  $('body').prepend(html);

  var settingsPanel = $('.futsettings #settingspanel');

  var _loop = function _loop(entry) {
    var checked = entry.isActive ? 'checked="checked"' : '';
    settingsPanel.append('<h3 class="main-setting">\n      <input type="checkbox" id="' + entry.id + '" data-feature-id="' + entry.id + '" ' + checked + ' />\n      <label for="' + entry.id + '">' + entry.name + '</label>\n    </h3>');
    var settingsFields = '';
    if (entry.settings && entry.settings.length > 0) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = entry.settings[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var setting = _step2.value;

          if (setting.subsettings.length > 0) {
            settingsFields += renderSettingsEntry(setting, entry);

            var settingActive = setting.value ? 'block' : 'none';
            settingsFields += '<div data-parent-feature-setting-id="' + entry.id + ':' + setting.key + '" style="display: ' + settingActive + '">';
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = setting.subsettings[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var subsetting = _step4.value;

                settingsFields += renderSettingsEntry(subsetting, entry);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            settingsFields += '</div>';
          } else {
            settingsFields += renderSettingsEntry(setting, entry);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var featureActive = entry.isActive ? 'block' : 'none';
      settingsPanel.append('<div class="feature-settings"><div data-feature-settings="' + entry.id + '" style="display: ' + featureActive + ';">' + settingsFields + '</div></div>');

      var _loop2 = function _loop2(_setting) {
        $('[data-feature-setting-id=\'' + entry.id + ':' + _setting.key + '\']').on('change', function (e) {
          handleFieldChange(entry, _setting, e);
        });

        var _loop3 = function _loop3(_subsetting) {
          $('[data-feature-setting-id=\'' + entry.id + ':' + _subsetting.key + '\']').on('change', function (e) {
            handleFieldChange(entry, _subsetting, e);
          });
        };

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = _setting.subsettings[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _subsetting = _step5.value;

            _loop3(_subsetting);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = entry.settings[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _setting = _step3.value;

          _loop2(_setting);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    } else {
      settingsPanel.append('<div class="feature-settings-empty"></div>');
    }

    $('[data-feature-id=\'' + entry.id + '\']').on('click', function () {
      settings.toggleEntry(entry.id);
      $('[data-feature-settings=\'' + entry.id + '\']').toggle();
    });
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = settings.getEntries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var entry = _step.value;

      _loop(entry);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  $('.futsettings-toggle').click(function () {
    _core.analytics.trackEvent('Settings', 'Toggle settings', $('.futsettings').is(':visible'));
    $('.futsettings').toggle();
  });
};

/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(345);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(48)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
        module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
            var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");
            if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
            update(newContent);
        });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
}

/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(undefined);
// imports


// module
exports.push([module.i, ".futsettings-toggle {\n  position: absolute !important;\n  bottom: 20px;\n  right: 20px;\n  z-index: 999; }\n  .futsettings-toggle ::before {\n    font-family: UltimateTeam-Icons,sans-serif;\n    content: \"\\E056\";\n    font-size: 2rem;\n    color: black; }\n\n.futsettings {\n  position: absolute;\n  top: 112px;\n  bottom: 0;\n  left: 105px;\n  right: 0;\n  background-color: #fff;\n  overflow-y: auto;\n  display: none;\n  z-index: 998;\n  padding: 15px; }\n  .futsettings, .futsettings *, .futsettings *:before, .futsettings *:after {\n    box-sizing: border-box; }\n  .futsettings footer {\n    text-align: center;\n    padding: 15px; }\n    .futsettings footer hr {\n      border: none;\n      border-bottom: 1px solid #ddd; }\n    .futsettings footer p, .futsettings footer li {\n      font-size: smaller;\n      margin: 10px; }\n  .futsettings .settings-title {\n    color: #183f94;\n    font-size: 2.5em;\n    font-weight: 400;\n    font-family: UltimateTeamCondensed,sans-serif;\n    line-height: 1em;\n    margin-bottom: 0.5rem;\n    text-transform: uppercase;\n    width: 100%; }\n  .futsettings .main-setting label {\n    display: inline-block;\n    padding-bottom: 15px;\n    padding-top: 15px; }\n  .futsettings .feature-settings-empty {\n    display: none; }\n  .futsettings .feature-settings {\n    background-color: #f5f5f5;\n    margin-bottom: 25px;\n    padding: 10px;\n    position: relative; }\n    .futsettings .feature-settings .setting {\n      padding: 10px; }\n      .futsettings .feature-settings .setting input[type=number],\n      .futsettings .feature-settings .setting input[type=text] {\n        background-color: #fff;\n        border: 1px #33314e solid;\n        clear: both;\n        color: #33314e;\n        display: block;\n        font-size: 14px;\n        height: 3.5em;\n        padding: 10px;\n        text-align: left;\n        width: 100%; }\n  .futsettings input[type=checkbox] {\n    display: none; }\n    .futsettings input[type=checkbox] + label {\n      cursor: pointer;\n      position: relative;\n      padding-left: 50px; }\n      .futsettings input[type=checkbox] + label:before {\n        background-color: #ccc;\n        border: 1px solid #999;\n        border-radius: 8px;\n        content: '';\n        height: 16px;\n        left: 0;\n        position: absolute;\n        transition: background-color 300ms ease, border-color 300ms ease;\n        width: 40px; }\n      .futsettings input[type=checkbox] + label:after {\n        background-color: #999;\n        border: 1px solid #999;\n        border-radius: 50%;\n        content: '';\n        height: 22px;\n        left: 0;\n        margin-top: -3px;\n        position: absolute;\n        transform: translateX(0);\n        transition: background-color 300ms ease, border-color 300ms ease, transform 300ms ease;\n        width: 22px; }\n    .futsettings input[type=checkbox]:checked + label:before {\n      background-color: #fc87ac;\n      border-color: #f93b78; }\n    .futsettings input[type=checkbox]:checked + label:after {\n      background-color: #f93b78;\n      border-color: #f93b78;\n      transform: translateX(20px); }\n", ""]);

// exports


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_VALUES = {
    emitDelay: 10,
    strictMode: false
};

/**
 * @typedef {object} EventEmitterListenerFunc
 * @property {boolean} once
 * @property {function} fn
 */

/**
 * @class EventEmitter
 *
 * @private
 * @property {Object.<string, EventEmitterListenerFunc[]>} _listeners
 * @property {string[]} events
 */

var EventEmitter = function () {

    /**
     * @constructor
     * @param {{}}      [opts]
     * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
     * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
     */

    function EventEmitter() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_VALUES : arguments[0];

        _classCallCheck(this, EventEmitter);

        var emitDelay = void 0,
            strictMode = void 0;

        if (opts.hasOwnProperty('emitDelay')) {
            emitDelay = opts.emitDelay;
        } else {
            emitDelay = DEFAULT_VALUES.emitDelay;
        }
        this._emitDelay = emitDelay;

        if (opts.hasOwnProperty('strictMode')) {
            strictMode = opts.strictMode;
        } else {
            strictMode = DEFAULT_VALUES.strictMode;
        }
        this._strictMode = strictMode;

        this._listeners = {};
        this.events = [];
    }

    /**
     * @protected
     * @param {string} type
     * @param {function} listener
     * @param {boolean} [once = false]
     */


    _createClass(EventEmitter, [{
        key: '_addListenner',
        value: function _addListenner(type, listener, once) {
            if (typeof listener !== 'function') {
                throw TypeError('listener must be a function');
            }

            if (this.events.indexOf(type) === -1) {
                this._listeners[type] = [{
                    once: once,
                    fn: listener
                }];
                this.events.push(type);
            } else {
                this._listeners[type].push({
                    once: once,
                    fn: listener
                });
            }
        }

        /**
         * Subscribes on event type specified function
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'on',
        value: function on(type, listener) {
            this._addListenner(type, listener, false);
        }

        /**
         * Subscribes on event type specified function to fire only once
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'once',
        value: function once(type, listener) {
            this._addListenner(type, listener, true);
        }

        /**
         * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
         * @param {string} eventType
         * @param {function} [listenerFunc]
         */

    }, {
        key: 'off',
        value: function off(eventType, listenerFunc) {
            var _this = this;

            var typeIndex = this.events.indexOf(eventType);
            var hasType = eventType && typeIndex !== -1;

            if (hasType) {
                if (!listenerFunc) {
                    delete this._listeners[eventType];
                    this.events.splice(typeIndex, 1);
                } else {
                    (function () {
                        var removedEvents = [];
                        var typeListeners = _this._listeners[eventType];

                        typeListeners.forEach(
                        /**
                         * @param {EventEmitterListenerFunc} fn
                         * @param {number} idx
                         */
                        function (fn, idx) {
                            if (fn.fn === listenerFunc) {
                                removedEvents.unshift(idx);
                            }
                        });

                        removedEvents.forEach(function (idx) {
                            typeListeners.splice(idx, 1);
                        });

                        if (!typeListeners.length) {
                            _this.events.splice(typeIndex, 1);
                            delete _this._listeners[eventType];
                        }
                    })();
                }
            }
        }

        /**
         * Applies arguments to specified event type
         * @param {string} eventType
         * @param {*[]} eventArguments
         * @protected
         */

    }, {
        key: '_applyEvents',
        value: function _applyEvents(eventType, eventArguments) {
            var typeListeners = this._listeners[eventType];

            if (!typeListeners || !typeListeners.length) {
                if (this._strictMode) {
                    throw 'No listeners specified for event: ' + eventType;
                } else {
                    return;
                }
            }

            var removableListeners = [];
            typeListeners.forEach(function (eeListener, idx) {
                eeListener.fn.apply(null, eventArguments);
                if (eeListener.once) {
                    removableListeners.unshift(idx);
                }
            });

            removableListeners.forEach(function (idx) {
                typeListeners.splice(idx, 1);
            });
        }

        /**
         * Emits event with specified type and params.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emit',
        value: function emit(type) {
            var _this2 = this;

            for (var _len = arguments.length, eventArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                eventArgs[_key - 1] = arguments[_key];
            }

            if (this._emitDelay) {
                setTimeout(function () {
                    _this2._applyEvents.call(_this2, type, eventArgs);
                }, this._emitDelay);
            } else {
                this._applyEvents(type, eventArgs);
            }
        }

        /**
         * Emits event with specified type and params synchronously.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emitSync',
        value: function emitSync(type) {
            for (var _len2 = arguments.length, eventArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                eventArgs[_key2 - 1] = arguments[_key2];
            }

            this._applyEvents(type, eventArgs);
        }

        /**
         * Destroys EventEmitter
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this._listeners = {};
            this.events = [];
        }
    }]);

    return EventEmitter;
}();

module.exports = EventEmitter;


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint-disable */


var _querystring = __webpack_require__(348);

var _querystring2 = _interopRequireDefault(_querystring);

var _config = __webpack_require__(351);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = init;

function init(tid, cid, options) {
  return new Visitor(tid, cid, options);
}

var Visitor = module.exports.Visitor = function (tid, cid, options) {

  this._queue = [];

  this.options = options || {};

  if (this.options.hostname) {
    _config2.default.hostname = this.options.hostname;
  }
  if (this.options.path) {
    _config2.default.path = this.options.path;
  }

  if (this.options.enableBatching !== undefined) {
    _config2.default.batching = options.enableBatching;
  }

  if (this.options.batchSize) {
    _config2.default.batchSize = this.options.batchSize;
  }

  this._context = {};
  this._persistentParams = {};

  this.tid = this.options.tid;
  this.cid = this.options.cid;
  if (this.options.uid) {
    this.uid = this.options.uid;
  }
};

Visitor.prototype = {
  reset: function reset() {
    this._context = null;
    return this;
  },

  set: function set(key, value) {
    this._persistentParams = this._persistentParams || {};
    this._persistentParams[key] = value;
  },

  pageview: function pageview(path, hostname, title, params, fn) {

    if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path != null) {
      params = path;
      if (typeof hostname === 'function') {
        fn = hostname;
      }
      path = hostname = title = null;
    } else if (typeof hostname === 'function') {
      fn = hostname;
      hostname = title = null;
    } else if (typeof title === 'function') {
      fn = title;
      title = null;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.dp = path || params.dp || this._context.dp;
    params.dh = hostname || params.dh || this._context.dh;
    params.dt = title || params.dt || this._context.dt;

    this._tidyParameters(params);

    if (!params.dp && !params.dl) {
      return this._handleError('Please provide either a page path (dp) or a document location (dl)', fn);
    }

    return this._withContext(params)._enqueue('pageview', params, fn);
  },

  screenview: function screenview(screenName, appName, appVersion, appId, appInstallerId, params, fn) {

    if ((typeof screenName === 'undefined' ? 'undefined' : _typeof(screenName)) === 'object' && screenName != null) {
      params = screenName;
      if (typeof appName === 'function') {
        fn = appName;
      }
      screenName = appName = appVersion = appId = appInstallerId = null;
    } else if (typeof appName === 'function') {
      fn = appName;
      appName = appVersion = appId = appInstallerId = null;
    } else if (typeof appVersion === 'function') {
      fn = appVersion;
      appVersion = appId = appInstallerId = null;
    } else if (typeof appId === 'function') {
      fn = appId;
      appId = appInstallerId = null;
    } else if (typeof appInstallerId === 'function') {
      fn = appInstallerId;
      appInstallerId = null;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.cd = screenName || params.cd || this._context.cd;
    params.an = appName || params.an || this._context.an;
    params.av = appVersion || params.av || this._context.av;
    params.aid = appId || params.aid || this._context.aid;
    params.aiid = appInstallerId || params.aiid || this._context.aiid;

    this._tidyParameters(params);

    if (!params.cd || !params.an) {
      return this._handleError('Please provide at least a screen name (cd) and an app name (an)', fn);
    }

    return this._withContext(params)._enqueue('screenview', params, fn);
  },

  event: function event(category, action, label, value, params, fn) {

    if ((typeof category === 'undefined' ? 'undefined' : _typeof(category)) === 'object' && category != null) {
      params = category;
      if (typeof action === 'function') {
        fn = action;
      }
      category = action = label = value = null;
    } else if (typeof label === 'function') {
      fn = label;
      label = value = null;
    } else if (typeof value === 'function') {
      fn = value;
      value = null;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.ec = category || params.ec || this._context.ec;
    params.ea = action || params.ea || this._context.ea;
    params.el = label || params.el || this._context.el;
    params.ev = value || params.ev || this._context.ev;
    params.p = params.p || params.dp || this._context.p || this._context.dp;

    delete params.dp;
    this._tidyParameters(params);

    if (!params.ec || !params.ea) {
      return this._handleError('Please provide at least an event category (ec) and an event action (ea)', fn);
    }

    return this._withContext(params)._enqueue('event', params, fn);
  },

  transaction: function transaction(_transaction, revenue, shipping, tax, affiliation, params, fn) {
    if ((typeof _transaction === 'undefined' ? 'undefined' : _typeof(_transaction)) === 'object') {
      params = _transaction;
      if (typeof revenue === 'function') {
        fn = revenue;
      }
      _transaction = revenue = shipping = tax = affiliation = null;
    } else if (typeof revenue === 'function') {
      fn = revenue;
      revenue = shipping = tax = affiliation = null;
    } else if (typeof shipping === 'function') {
      fn = shipping;
      shipping = tax = affiliation = null;
    } else if (typeof tax === 'function') {
      fn = tax;
      tax = affiliation = null;
    } else if (typeof affiliation === 'function') {
      fn = affiliation;
      affiliation = null;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.ti = _transaction || params.ti || this._context.ti;
    params.tr = revenue || params.tr || this._context.tr;
    params.ts = shipping || params.ts || this._context.ts;
    params.tt = tax || params.tt || this._context.tt;
    params.ta = affiliation || params.ta || this._context.ta;
    params.p = params.p || this._context.p || this._context.dp;

    this._tidyParameters(params);

    if (!params.ti) {
      return this._handleError('Please provide at least a transaction ID (ti)', fn);
    }

    return this._withContext(params)._enqueue('transaction', params, fn);
  },

  item: function item(price, quantity, sku, name, variation, params, fn) {
    if ((typeof price === 'undefined' ? 'undefined' : _typeof(price)) === 'object') {
      params = price;
      if (typeof quantity === 'function') {
        fn = quantity;
      }
      price = quantity = sku = name = variation = null;
    } else if (typeof quantity === 'function') {
      fn = quantity;
      quantity = sku = name = variation = null;
    } else if (typeof sku === 'function') {
      fn = sku;
      sku = name = variation = null;
    } else if (typeof name === 'function') {
      fn = name;
      name = variation = null;
    } else if (typeof variation === 'function') {
      fn = variation;
      variation = null;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.ip = price || params.ip || this._context.ip;
    params.iq = quantity || params.iq || this._context.iq;
    params.ic = sku || params.ic || this._context.ic;
    params.in = name || params.in || this._context.in;
    params.iv = variation || params.iv || this._context.iv;
    params.p = params.p || this._context.p || this._context.dp;
    params.ti = params.ti || this._context.ti;

    this._tidyParameters(params);

    if (!params.ti) {
      return this._handleError('Please provide at least an item transaction ID (ti)', fn);
    }

    return this._withContext(params)._enqueue('item', params, fn);
  },

  exception: function exception(description, fatal, params, fn) {

    if ((typeof description === 'undefined' ? 'undefined' : _typeof(description)) === 'object') {
      params = description;
      if (typeof fatal === 'function') {
        fn = fatal;
      }
      description = fatal = null;
    } else if (typeof fatal === 'function') {
      fn = fatal;
      fatal = 0;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.exd = description || params.exd || this._context.exd;
    params.exf = +!!(fatal || params.exf || this._context.exf);

    if (params.exf === 0) {
      delete params.exf;
    }

    this._tidyParameters(params);

    return this._withContext(params)._enqueue('exception', params, fn);
  },

  timing: function timing(category, variable, time, label, params, fn) {

    if ((typeof category === 'undefined' ? 'undefined' : _typeof(category)) === 'object') {
      params = category;
      if (typeof variable === 'function') {
        fn = variable;
      }
      category = variable = time = label = null;
    } else if (typeof variable === 'function') {
      fn = variable;
      variable = time = label = null;
    } else if (typeof time === 'function') {
      fn = time;
      time = label = null;
    } else if (typeof label === 'function') {
      fn = label;
      label = null;
    } else if (typeof params === 'function') {
      fn = params;
      params = null;
    }

    params = this._translateParams(params);

    params = Object.assign({}, this._persistentParams || {}, params);

    params.utc = category || params.utc || this._context.utc;
    params.utv = variable || params.utv || this._context.utv;
    params.utt = time || params.utt || this._context.utt;
    params.utl = label || params.utl || this._context.utl;

    this._tidyParameters(params);

    return this._withContext(params)._enqueue('timing', params, fn);
  },

  send: function send(fn) {
    var self = this;
    var count = 1;
    var fn = fn || function () {};

    var getBody = function getBody(params) {
      return params.map(function (x) {
        return _querystring2.default.stringify(x);
      }).join('\n');
    };

    var onFinish = function onFinish(err) {
      fn.call(self, err || null, count - 1);
    };

    var iterator = function iterator() {
      if (!self._queue.length) {
        return onFinish(null);
      }
      var params = [];

      if (_config2.default.batching) {
        params = self._queue.splice(0, Math.min(self._queue.length, _config2.default.batchSize));
      } else {
        params.push(self._queue.shift());
      }

      var useBatchPath = params.length > 1;

      var path = _config2.default.hostname + (useBatchPath ? _config2.default.batchPath : _config2.default.path);

      var options = Object.assign({}, self.options.requestOptions, {
        body: getBody(params),
        headers: self.options.headers || {}
      });

      GM_xmlhttpRequest({
        method: 'POST',
        url: path,
        headers: options.headers,
        data: options.body,
        onload: function onload() {
          nextIteration();
        },
        onerror: function onerror(res) {
          nextIteration(res.status);
        }
      });
    };

    function nextIteration(err) {
      if (err) return onFinish(err);
      iterator();
    }

    iterator();
  },

  _enqueue: function _enqueue(type, params, fn) {

    if (typeof params === 'function') {
      fn = params;
      params = {};
    }

    params = this._translateParams(params) || {};

    Object.assign(params, {
      v: _config2.default.protocolVersion,
      tid: this.tid,
      cid: this.cid,
      t: type
    });
    if (this.uid) {
      params.uid = this.uid;
    }

    this._queue.push(params);

    if (fn) {
      this.send(fn);
    }

    return this;
  },

  _handleError: function _handleError(message, fn) {
    fn && fn.call(this, new Error(message));
    return this;
  },

  _translateParams: function _translateParams(params) {
    var translated = {};
    for (var key in params) {
      if (_config2.default.parametersMap.hasOwnProperty(key)) {
        translated[_config2.default.parametersMap[key]] = params[key];
      } else {
        translated[key] = params[key];
      }
    }
    return translated;
  },

  _tidyParameters: function _tidyParameters(params) {
    for (var param in params) {
      if (params[param] === null || params[param] === undefined) {
        delete params[param];
      }
    }
    return params;
  },

  _withContext: function _withContext(context) {
    var visitor = new Visitor(this.tid, this.cid, this.options, context, this._persistentParams);
    visitor._queue = this._queue;
    return visitor;
  }

};

Visitor.prototype.pv = Visitor.prototype.pageview;
Visitor.prototype.e = Visitor.prototype.event;
Visitor.prototype.t = Visitor.prototype.transaction;
Visitor.prototype.i = Visitor.prototype.item;

/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(349);
exports.encode = exports.stringify = __webpack_require__(350);


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */
module.exports = {
    protocolVersion: "1",
    hostname: "https://www.google-analytics.com",
    path: "/collect",
    batchPath: "/batch",
    batching: true,
    batchSize: 10,
    acceptedParameters: [

    // General
    "v", "tid", "aip", "ds", "qt", "z",

    // User
    "cid", "uid",

    // Session
    "sc", "uip", "ua", "geoid",

    // Traffic Sources
    "dr", "cn", "cs", "cm", "ck", "cc", "ci", "gclid", "dclid",

    // System Info
    "sr", "vp", "de", "sd", "ul", "je", "fl",

    // Hit
    "t", "ni",

    // Content Information
    "dl", "dh", "dp", "dt", "cd", "linkid",

    // App Tracking
    "an", "aid", "av", "aiid",

    // Event Tracking
    "ec", "ea", "el", "ev",

    // E-commerce (transaction data: simple and enhanced)
    "ti", "ta", "tr", "ts", "tt",

    // E-commerce (item data: simple)
    "in", "ip", "iq", "ic", "iv",

    // E-commerce (currency: simple and enhanced)
    "cu",

    // Enhanced E-Commerce (see also: regex below)
    "pa", "tcc", "pal", "cos", "col", "promoa",

    // Social Interactions
    "sn", "sa", "st",

    // Timing
    "utc", "utv", "utt", "utl", "plt", "dns", "pdt", "rrt", "tcp", "srt", "dit", "clt",

    // Exceptions
    "exd", "exf",

    // Content Experiments
    "xid", "xvar"],

    acceptedParametersRegex: [/^cm[0-9]+$/, /^cd[0-9]+$/, /^cg(10|[0-9])$/, /pr[0-9]{1,3}id/, /pr[0-9]{1,3}nm/, /pr[0-9]{1,3}br/, /pr[0-9]{1,3}ca/, /pr[0-9]{1,3}va/, /pr[0-9]{1,3}pr/, /pr[0-9]{1,3}qt/, /pr[0-9]{1,3}cc/, /pr[0-9]{1,3}ps/, /pr[0-9]{1,3}cd[0-9]{1,3}/, /pr[0-9]{1,3}cm[0-9]{1,3}/, /il[0-9]{1,3}nm/, /il[0-9]{1,3}pi[0-9]{1,3}id/, /il[0-9]{1,3}pi[0-9]{1,3}nm/, /il[0-9]{1,3}pi[0-9]{1,3}br/, /il[0-9]{1,3}pi[0-9]{1,3}ca/, /il[0-9]{1,3}pi[0-9]{1,3}va/, /il[0-9]{1,3}pi[0-9]{1,3}ps/, /il[0-9]{1,3}pi[0-9]{1,3}pr/, /il[0-9]{1,3}pi[0-9]{1,3}cd[0-9]{1,3}/, /il[0-9]{1,3}pi[0-9]{1,3}cm[0-9]{1,3}/, /promo[0-9]{1,3}id/, /promo[0-9]{1,3}nm/, /promo[0-9]{1,3}cr/, /promo[0-9]{1,3}ps/],
    parametersMap: {
        "protocolVersion": "v",
        "trackingId": "tid",
        "webPropertyId": "tid",
        "anonymizeIp": "aip",
        "dataSource": "ds",
        "queueTime": "qt",
        "cacheBuster": "z",
        "clientId": "cid",
        "userId": "uid",
        "sessionControl": "sc",
        "ipOverride": "uip",
        "userAgentOverride": "ua",
        "documentReferrer": "dr",
        "campaignName": "cn",
        "campaignSource": "cs",
        "campaignMedium": "cm",
        "campaignKeyword": "ck",
        "campaignContent": "cc",
        "campaignId": "ci",
        "googleAdwordsId": "gclid",
        "googleDisplayAdsId": "dclid",
        "screenResolution": "sr",
        "viewportSize": "vp",
        "documentEncoding": "de",
        "screenColors": "sd",
        "userLanguage": "ul",
        "javaEnabled": "je",
        "flashVersion": "fl",
        "hitType": "t",
        "non-interactionHit": "ni",
        "documentLocationUrl": "dl",
        "documentHostName": "dh",
        "documentPath": "dp",
        "documentTitle": "dt",
        "screenName": "cd",
        "linkId": "linkid",
        "applicationName": "an",
        "applicationId": "aid",
        "applicationVersion": "av",
        "applicationInstallerId": "aiid",
        "eventCategory": "ec",
        "eventAction": "ea",
        "eventLabel": "el",
        "eventValue": "ev",
        "transactionId": "ti",
        "transactionAffiliation": "ta",
        "transactionRevenue": "tr",
        "transactionShipping": "ts",
        "transactionTax": "tt",
        "itemName": "in",
        "itemPrice": "ip",
        "itemQuantity": "iq",
        "itemCode": "ic",
        "itemCategory": "iv",
        "currencyCode": "cu",
        "socialNetwork": "sn",
        "socialAction": "sa",
        "socialActionTarget": "st",
        "userTimingCategory": "utc",
        "userTimingVariableName": "utv",
        "userTimingTime": "utt",
        "userTimingLabel": "utl",
        "pageLoadTime": "plt",
        "dnsTime": "dns",
        "pageDownloadTime": "pdt",
        "redirectResponseTime": "rrt",
        "tcpConnectTime": "tcp",
        "serverResponseTime": "srt",
        "domInteractiveTime": "dit",
        "contentLoadTime": "clt",
        "exceptionDescription": "exd",
        "isExceptionFatal": "exf",
        "isExceptionFatal?": "exf",
        "experimentId": "xid",
        "experimentVariant": "xvar"
    }
};

/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SettingsEntry = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = __webpack_require__(66);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SettingsEntry = exports.SettingsEntry = function () {
  function SettingsEntry(id, name) {
    _classCallCheck(this, SettingsEntry);

    var settings = _db.Database.getJson('settings:' + id, {});

    this.id = id;
    this.name = name;
    this.isActive = settings.isActive ? settings.isActive : false;
    this.settings = [];
  }

  _createClass(SettingsEntry, [{
    key: 'toggle',
    value: function toggle() {
      this.isActive = !this.isActive;

      var settings = _db.Database.getJson('settings:' + this.id, {});
      settings.isActive = this.isActive;
      _db.Database.setJson('settings:' + this.id, settings);
    }
  }, {
    key: 'addSetting',
    value: function addSetting(label, key, defaultValue, type, cb) {
      var settings = _db.Database.getJson('settings:' + this.id, {});

      settings[key] = key in settings ? settings[key] : defaultValue;
      _db.Database.setJson('settings:' + this.id, settings);

      this.settings.push({
        label: label,
        key: key,
        type: type,
        value: key in settings ? settings[key] : defaultValue,
        callback: cb,
        subsettings: []
      });
    }
  }, {
    key: 'addSettingUnder',
    value: function addSettingUnder(underKey, label, key, defaultValue, type, cb) {
      var settings = _db.Database.getJson('settings:' + this.id, {});
      settings[key] = key in settings ? settings[key] : defaultValue;
      _db.Database.setJson('settings:' + this.id, settings);

      var setting = this.settings.find(function (s) {
        return s.key === underKey;
      });
      setting.subsettings.push({
        label: label,
        key: key,
        type: type,
        value: key in settings ? settings[key] : defaultValue,
        callback: cb
      });
    }
  }, {
    key: 'changeValue',
    value: function changeValue(key, value) {
      var settings = _db.Database.getJson('settings:' + this.id, {});

      settings[key] = value;

      _db.Database.setJson('settings:' + this.id, settings);
    }
  }]);

  return SettingsEntry;
}();

/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseScript = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window */
/* eslint class-methods-use-this: "off" */


var _settings = __webpack_require__(130);

var _db = __webpack_require__(66);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseScript = exports.BaseScript = function () {
  function BaseScript(id) {
    var _this = this;

    _classCallCheck(this, BaseScript);

    this._id = id;

    _settings.Settings.getInstance().on('entry-enabled', function (entry) {
      if (entry.id === id) {
        _this.screenRequestObserver = window.onPageNavigation.observe(_this, function (obs, event) {
          var _this2 = this;

          setTimeout(function () {
            _this2.onScreenRequest(event);
          }, 1000);
        });

        _this.activate({
          screenId: window.currentPage
        });
      }
    });

    _settings.Settings.getInstance().on('entry-disabled', function (entry) {
      if (entry.id === id) {
        _this.screenRequestObserver.unobserve(_this);

        _this.deactivate({
          screenId: window.currentPage
        });
      }
    });
  }

  _createClass(BaseScript, [{
    key: 'activate',
    value: function activate() {
      // override in subclasses
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      // override in subclasses
    }
  }, {
    key: 'onScreenRequest',
    value: function onScreenRequest() {
      // override in subclasses
    }
  }, {
    key: 'getSettings',
    value: function getSettings() {
      return _db.Database.getJson('settings:' + this._id, {});
    }
  }]);

  return BaseScript;
}();

/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fut = __webpack_require__(67);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = exports.Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this._queue = [];
  }

  _createClass(Queue, [{
    key: 'add',
    value: function add(identifier, cb) {
      this._queue.push({
        identifier: identifier,
        cb: cb
      });
    }
  }, {
    key: 'start',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var scriptToRun;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._running = true;
                /* eslint-disable no-await-in-loop */

              case 1:
                if (!this._running) {
                  _context.next = 13;
                  break;
                }

                if (!(this._queue.length > 0)) {
                  _context.next = 9;
                  break;
                }

                scriptToRun = this._queue.shift();

                if (!scriptToRun) {
                  _context.next = 7;
                  break;
                }

                _context.next = 7;
                return scriptToRun.cb();

              case 7:
                _context.next = 11;
                break;

              case 9:
                _context.next = 11;
                return _fut.utils.sleep(1000);

              case 11:
                _context.next = 1;
                break;

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'stop',
    value: function stop() {
      this._running = false;
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (this._instance == null) {
        this._instance = new Queue();
      }

      return this._instance;
    }
  }]);

  return Queue;
}();

/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global communication repositories enums services */

var Store = exports.Store = function () {
  function Store() {
    _classCallCheck(this, Store);
  }

  _createClass(Store, [{
    key: "getUnassignedItems",
    value: function getUnassignedItems() {
      var _this = this;

      return new Promise(function (resolve) {
        repositories.Item.reset(enums.FUTItemPile.PURCHASED);
        repositories.Item.getUnassignedItems().observe(_this, function (o, list) {
          o.unobserve(this);
          resolve(list.items);
        });
      });
    }
  }, {
    key: "getTradePile",
    value: function getTradePile() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        repositories.Item.getTransferItems().observe(_this2, function (obs, data) {
          obs.unobserve(_this2);

          if (data.error) {
            reject(new Error(data.erorr));
          } else {
            resolve(data.items);
          }
        });
      });
    }
  }, {
    key: "getTradePileUnsold",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var tradepile;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getTradePile();

              case 2:
                tradepile = _context.sent;
                return _context.abrupt("return", tradepile.filter(function (d) {
                  return d.state === enums.ItemState.FREE && d._auction.buyNowPrice > 0;
                }));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTradePileUnsold() {
        return _ref.apply(this, arguments);
      }

      return getTradePileUnsold;
    }()
  }, {
    key: "redeemItem",
    value: function redeemItem(item) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var redeem = new communication.ConsumeUnlockableDelegate(item.id);
        redeem.addListener(communication.BaseDelegate.SUCCESS, _this3, function (sender, response) {
          sender.clearListenersByScope(_this3);
          resolve(response);
        });
        redeem.addListener(communication.BaseDelegate.FAIL, _this3, function (sender, response) {
          sender.clearListenersByScope(_this3);
          reject(response);
        });
        redeem.send();
      });
    }
  }, {
    key: "quickSell",
    value: function quickSell(items) {
      var _this4 = this;

      return new Promise(function (resolve) {
        services.Item.discard(items).observe(_this4, function (obs, res) {
          obs.unobserve(_this4);
          resolve(res);
        });
      });
    }
  }, {
    key: "sendToClub",
    value: function sendToClub(items) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var moveItem = new communication.MoveItemDelegate(items, enums.FUTItemPile.CLUB);
        moveItem.addListener(communication.BaseDelegate.SUCCESS, _this5, function (sender, response) {
          sender.clearListenersByScope(_this5);
          resolve(response);
        });
        moveItem.addListener(communication.BaseDelegate.FAIL, _this5, function (sender, response) {
          sender.clearListenersByScope(_this5);
          reject(response);
        });
        moveItem.send();
      });
    }
  }, {
    key: "removeSoldAuctions",
    value: function removeSoldAuctions() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        services.Item.clearSoldItems().observe(_this6, function (observer, data) {
          observer.unobserve(_this6);

          if (data.error) {
            reject(new Error(data.erorr));
          } else {
            resolve(data.items);
          }
        });
      });
    }
  }]);

  return Store;
}();

/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferMarket = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     enums factories communication gUserModel models repositories services
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _mathStatistics = __webpack_require__(357);

var _utils = __webpack_require__(134);

var _utils2 = _interopRequireDefault(_utils);

var _priceTiers = __webpack_require__(135);

var _priceTiers2 = _interopRequireDefault(_priceTiers);

var _logger = __webpack_require__(132);

var _pinEvent = __webpack_require__(133);

var _errors = __webpack_require__(358);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransferMarket = exports.TransferMarket = function () {
  function TransferMarket() {
    _classCallCheck(this, TransferMarket);

    this._logger = new _logger.Logger();
  }

  _createClass(TransferMarket, [{
    key: 'navigateToTransferHub',


    /* eslint-disable class-methods-use-this */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _pinEvent.PinEvent.sendPageView('Hub - Transfers');

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function navigateToTransferHub() {
        return _ref.apply(this, arguments);
      }

      return navigateToTransferHub;
    }()
  }, {
    key: 'navigateToTransferList',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.navigateToTransferHub();

              case 2:
                _context2.next = 4;
                return _pinEvent.PinEvent.sendPageView('Transfer List - List View');

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function navigateToTransferList() {
        return _ref2.apply(this, arguments);
      }

      return navigateToTransferList;
    }()
    /* eslint-enable class-methods-use-this */

  }, {
    key: 'searchMinBuy',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(item) {
        var itemsForMean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
        var lowUp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var minBuy;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                services.Item.clearTransferMarketCache();

                this._logger.log('Searching min buy for ' + item.type + ' ' + item._staticData.name + ' from low upward first ' + lowUp, 'Core - Transfermarket');
                minBuy = 0;

                if (!lowUp) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 6;
                return this._findLowUp(item, itemsForMean);

              case 6:
                minBuy = _context3.sent;

                this._logger.log('Low up search yielded ' + minBuy + ' as a result', 'Core - Transfermarket');

              case 8:
                if (!(minBuy === 0)) {
                  _context3.next = 13;
                  break;
                }

                this._logger.log('Searching low down...', 'Core - Transfermarket');
                _context3.next = 12;
                return this._findLowDown(item, itemsForMean);

              case 12:
                minBuy = _context3.sent;

              case 13:

                if (minBuy === 0) {
                  this._logger.log('No players found... it might be extinct', 'Core - Transfermarket');
                } else {
                  this._logger.log('Min buy for ' + item.type + ' ' + item._staticData.name + ' is ' + minBuy, 'Core - Transfermarket');
                }
                return _context3.abrupt('return', minBuy);

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function searchMinBuy(_x3) {
        return _ref3.apply(this, arguments);
      }

      return searchMinBuy;
    }()

    /**
     * List item on transfermarket
     *
     * @param {FUTItem} item
     * @param {number} start start price
     * @param {number} buyNow buy now price
     * @param {number} duration time to list in seconds (1, 3, 6, 12, 24 or 72 hours)
     */

  }, {
    key: 'listItem',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(item, start, buyNow) {
        var _this = this;

        var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3600;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', new Promise(function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(resolve, reject) {
                    var prices, listItem;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!(gUserModel.getTradeAccess() !== models.UserModel.TRADE_ACCESS.WHITELIST)) {
                              _context4.next = 3;
                              break;
                            }

                            reject(new Error('You are not authorized for trading'));
                            return _context4.abrupt('return');

                          case 3:
                            prices = _priceTiers2.default.determineListPrice(start, buyNow);
                            _context4.next = 6;
                            return _this.sendToTradePile(item);

                          case 6:
                            _context4.next = 8;
                            return _utils2.default.sleep(1000);

                          case 8:
                            listItem = new communication.ListItemDelegate({
                              itemId: item.id,
                              startingBid: prices.start,
                              buyNowPrice: prices.buyNow,
                              duration: duration
                            });

                            listItem.addListener(communication.BaseDelegate.SUCCESS, _this, function (sender) {
                              sender.clearListenersByScope(_this);
                              resolve({
                                startingBid: prices.start,
                                buyNowPrice: prices.buyNow
                              });
                            });
                            listItem.addListener(communication.BaseDelegate.FAIL, _this, function (sender, response) {
                              sender.clearListenersByScope(_this);
                              reject(new _errors.ListItemError(response));
                            });
                            listItem.send();

                          case 12:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this);
                  }));

                  return function (_x8, _x9) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function listItem(_x5, _x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return listItem;
    }()
  }, {
    key: 'sendToTradePile',
    value: function sendToTradePile(item) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var moveItem = new communication.MoveItemDelegate([item], enums.FUTItemPile.TRANSFER);
        moveItem.addListener(communication.BaseDelegate.SUCCESS, _this2, function (sender) {
          sender.clearListenersByScope(_this2);
          resolve();
        });
        moveItem.addListener(communication.BaseDelegate.FAIL, _this2, function (sender, response) {
          sender.clearListenersByScope(_this2);
          reject(new Error(response));
        });
        moveItem.send();
      });
    }
  }, {
    key: 'relistAllItems',
    value: function relistAllItems() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (gUserModel.getTradeAccess() !== models.UserModel.TRADE_ACCESS.WHITELIST) {
          reject(new Error('You are not authorized for trading'));
          return;
        }

        var relistExpired = new communication.AuctionRelistDelegate();

        relistExpired.addListener(communication.BaseDelegate.SUCCESS, _this3, function (sender) {
          sender.clearListenersByScope(_this3);
          repositories.Item.setDirty(enums.FUTItemPile.TRANSFER);
          resolve();
        });

        relistExpired.addListener(communication.BaseDelegate.FAIL, _this3, function (sender, error) {
          sender.clearListenersByScope(_this3);
          reject(new Error(error));
        });
        relistExpired.execute();
      });
    }
  }, {
    key: '_findLowUp',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(item, itemsForMean) {
        var searchCriteria, items;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                searchCriteria = this._defineSearchCriteria(item, 200);
                _context6.next = 3;
                return _pinEvent.PinEvent.sendPageView('Transfer Market Search');

              case 3:
                _context6.next = 5;
                return _utils2.default.sleep(3000);

              case 5:
                _context6.next = 7;
                return _pinEvent.PinEvent.sendPageView('Transfer Market Results - List View', 0);

              case 7:
                _context6.next = 9;
                return _pinEvent.PinEvent.sendPageView('Item - Detail View', 0);

              case 9:
                _context6.next = 11;
                return this._find(searchCriteria);

              case 11:
                items = _context6.sent;

                if (!(items.length > itemsForMean)) {
                  _context6.next = 14;
                  break;
                }

                return _context6.abrupt('return', 200);

              case 14:
                return _context6.abrupt('return', 0);

              case 15:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function _findLowUp(_x10, _x11) {
        return _ref6.apply(this, arguments);
      }

      return _findLowUp;
    }()
  }, {
    key: '_findLowDown',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(item, itemsForMean) {
        var minBuy, searchCriteria, valuesFound, minBuyFound, items, minBuyOnPage;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                minBuy = 99999999;
                searchCriteria = this._defineSearchCriteria(item);
                valuesFound = [];
                minBuyFound = false;

              case 4:
                if (!(minBuyFound === false)) {
                  _context7.next = 34;
                  break;
                }

                _context7.next = 7;
                return _pinEvent.PinEvent.sendPageView('Transfer Market Search');

              case 7:
                _context7.next = 9;
                return _utils2.default.sleep(800);

              case 9:
                _context7.next = 11;
                return _pinEvent.PinEvent.sendPageView('Transfer Market Results - List View', 0);

              case 11:
                _context7.next = 13;
                return _pinEvent.PinEvent.sendPageView('Item - Detail View', 0);

              case 13:
                _context7.next = 15;
                return this._find(searchCriteria);

              case 15:
                items = _context7.sent;

                if (!(items.length > 0)) {
                  _context7.next = 31;
                  break;
                }

                valuesFound = valuesFound.concat(items.map(function (i) {
                  return i._auction.buyNowPrice;
                }));

                minBuyOnPage = Math.min.apply(Math, _toConsumableArray(items.map(function (i) {
                  return i._auction.buyNowPrice;
                })));

                if (!(minBuyOnPage < minBuy)) {
                  _context7.next = 28;
                  break;
                }

                minBuy = minBuyOnPage;

                if (!(items.length < searchCriteria.count)) {
                  _context7.next = 24;
                  break;
                }

                minBuyFound = true;
                return _context7.abrupt('break', 34);

              case 24:
                searchCriteria.maxBuy = _priceTiers2.default.roundDownToNearestPriceTiers(minBuy);
                if (searchCriteria.maxBuy < 200) {
                  searchCriteria.maxBuy = 200;
                }
                _context7.next = 29;
                break;

              case 28:
                if (items.length === searchCriteria.count) {
                  if (searchCriteria.maxBuy === 0) {
                    searchCriteria.maxBuy = minBuy;
                  } else {
                    searchCriteria.maxBuy = _priceTiers2.default.roundDownToNearestPriceTiers(searchCriteria.maxBuy);
                  }
                  if (searchCriteria.maxBuy < 200) {
                    searchCriteria.maxBuy = 200;
                    minBuy = 200;
                    minBuyFound = true;
                  }
                } else {
                  minBuy = Math.min.apply(Math, _toConsumableArray(items.map(function (i) {
                    return i._auction.buyNowPrice;
                  })));
                  minBuyFound = true;
                }

              case 29:
                _context7.next = 32;
                break;

              case 31:
                minBuyFound = true;

              case 32:
                _context7.next = 4;
                break;

              case 34:

                valuesFound = valuesFound.sort(function (a, b) {
                  return a - b;
                }).slice(0, itemsForMean);

                if (!(valuesFound.length > 0)) {
                  _context7.next = 37;
                  break;
                }

                return _context7.abrupt('return', _priceTiers2.default.roundValueToNearestPriceTiers((0, _mathStatistics.mean)(valuesFound)));

              case 37:
                return _context7.abrupt('return', 0);

              case 38:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function _findLowDown(_x12, _x13) {
        return _ref7.apply(this, arguments);
      }

      return _findLowDown;
    }()

    /* eslint-disable class-methods-use-this */

  }, {
    key: '_defineSearchCriteria',
    value: function _defineSearchCriteria(item) {
      var maxBuy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      // TODO: check if this can handle other items as well
      // eslint-disable-next-line no-undef
      var searchCriteria = new UTSearchCriteriaDTO();

      searchCriteria.count = 30;
      searchCriteria.maskedDefId = item.getMaskedResourceId();
      searchCriteria.type = item.type;

      if (item.rareflag === 47) {
        // 47 = Champions
        // if it is a Champions card, this is seen as a gold card
        // Can only search for "Gold" in this case
        searchCriteria.level = factories.DataProvider.getItemLevelDP(true).filter(function (d) {
          return d.id === 2;
        })[0].value;
      } else if (item.rareflag >= 3) {
        // 3 = TOTW
        // if it is TOTW or other special, set it to TOTW. See enums.ItemRareType.
        // Can only search for "Specials", not more specific on Rare Type
        searchCriteria.level = factories.DataProvider.getItemLevelDP(true).filter(function (d) {
          return d.id === 3;
        })[0].value;
      }

      searchCriteria.category = enums.SearchCategory.ANY;
      searchCriteria.position = enums.SearchType.ANY;
      if (maxBuy !== -1) {
        searchCriteria.maxBuy = maxBuy;
      }

      return searchCriteria;
    }
    /* eslint-enable class-methods-use-this */

  }, {
    key: '_find',
    value: function _find(searchCriteria) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        services.Item.searchTransferMarket(searchCriteria, 1).observe(_this4, function (obs, res) {
          if (!res.success) {
            obs.unobserve(this);
            reject(res.status);
          } else {
            resolve(res.data.items);
          }
        });
      });
    }
  }]);

  return TransferMarket;
}();

/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint bitwise: false */



var mean = function (data) {
    return data.reduce(function (sum, summand) {
        return sum + summand;
    }, 0) / data.length;
};

var median = function (data) {
    data = data.sort(function (a, b) {
        return a - b;
    });

    var middle = (data.length / 2) | 0;

    if (data.length % 2) {
        return data[middle];
    }

    return (data[middle - 1] + data[middle]) / 2;
};

exports.mean   = mean;
exports.median = median;


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListPlayerError = exports.ListPlayerError = function (_Error) {
  _inherits(ListPlayerError, _Error);

  function ListPlayerError() {
    _classCallCheck(this, ListPlayerError);

    return _possibleConstructorReturn(this, (ListPlayerError.__proto__ || Object.getPrototypeOf(ListPlayerError)).apply(this, arguments));
  }

  return ListPlayerError;
}(Error);

/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* globals
transferobjects enums communication factories
*/

var Club = exports.Club = function () {
  function Club() {
    _classCallCheck(this, Club);
  }

  _createClass(Club, [{
    key: "getPlayers",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(start, count) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  var t = new transferobjects.SearchCriteria();
                  t.type = enums.SearchType.PLAYER;

                  var o = new communication.ClubSearchDelegate(t, start, count);
                  o._useClickShield = false;

                  o.addListener(communication.BaseDelegate.SUCCESS, _this, function (sender, response) {
                    sender.clearListenersByScope(_this);

                    var players = Array.isArray(response.itemData) ? factories.Item.generateItemsFromItemData(response.itemData) : [];
                    var isLastPage = players.length <= count - 1;
                    resolve({
                      isLastPage: isLastPage,
                      getNextPage: isLastPage ? null : function () {
                        return _this.getPlayers(start + count, count);
                      },
                      players: players
                    });
                  });

                  o.addListener(communication.BaseDelegate.FAIL, _this, function (sender, response) {
                    sender.clearListenersByScope(_this);
                    reject(response);
                  });

                  o.send();
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getPlayers(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getPlayers;
    }()
  }]);

  return Club;
}();

/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* globals
window document Blob
*/

exports.default = {
  downloadFile: function downloadFile(filename, data) {
    var blob = new Blob([data], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }
};

/***/ }),
/* 361 */
/***/ (function(module, exports) {

module.exports = "<button class=\"futsettings-toggle standard mini call-to-action\">\n  <span class=btn-text></span>\n</button>\n\n<div class=futsettings>\n  <h1 class=settings-title>FUT Tampermonkey settings\n\n    <div style=float:right>\n      <a target=_blank href=https://www.paypal.me/timklingeleers rel=nofollow>\n        <img src=\"data:image/gif;base64,R0lGODlhkwAvAPf/AIdoHkQxDXtxv/pCCL29vAWX0f3jzfZ+GABGwnix6eoAG0iD1i8kCv/civacG8fJ2yYwdCwDBlat7KfE7GKo59qnMLuomCd51+u1NMPJzMiBFb7BwvO6NvtaBP/Xef3CONeKF/SBIM8AF5rE7fiKLJqjqLWLKP/KTfqwcdfp+UZGR/zVtKvU9OPk7ZFYmqCgoLbZ9XF3xkab5PmdT3VZGhlkzaOnxTU4OFdaWgCk4zx40amyt05ibZK96+GsMmya3mNqbkdQiWaf4XGl4pVyId2pMQUDAv+qHY4AEP7+/qUhSDKK3HaDif7OXMzQ1bO2z/vKVFpFFH2m4v5hAf7GQwBkisucLdvd453K8bW1tfkAHABZe/Lz9WKT21eL2CQmKOWwM/G5PPT4+/rKn1uW3gCIvZOZugBynnGe35S2552cm42y5v/SaIKx53677ezt8/j5+gCp6mi07Fl7w4q862NLFhIIBMPc9fgxDXyt5v2lHPIBG6XM8FWe5Bps0fd5DkJ91Fpilq/K7gpcy7uijVMACjs/Qenr7E+l6QYjL9PV43Ko5S6C2hwUBY+56WVtnWtRF/7y57O7wPahHDF61YCMko2StvT19w9izR8pcAVVyACh3+4cFN3f6QBOxXG98dPa3kSGzZ276ZOeooWLsRUUFIrD8XuCq7LP8Pm+N//GPW17gWSZ3mMADLu+1AA4T+wAFF2x7fbAQPvAOPv8/fr6/JBcDzyS4RUgafrIS4vC7v/8+Obo6Xeh4AIcJY2YnTI8fP+yH78AFQAWHra2tv7DObOzs/TBSKN9JPrAN/TGWvvHT31fHHF+hGK38FU8DpyJdidv0Jm45/iLE5mevjIyMkKO3bSdias+df738T6R32aAzquwymJADH1QDtsRMtakL/8AHdelMLC3uyBy0725toa36sgjTExOT755FSZ3sNdPDbytoPMAEP0VFhRcyv+hFwBFX2xzoZpoDuLl5gB6qgCu8LyyqqKrry9y0TZ+1ywsLf///wAAAP/EOQAAACH5BAEAAP8ALAAAAACTAC8AQAj/AP8JHEiwoMGDCJucoKKqWDF/D/1JnDjxoUOIEi1apJgRosOPGDlS1BhSoyoqJ5ogXMmypcuXAmWJnDkzSr9+RhhAwkCzp0+JHDBw+ElUpCyYSJO6HFpUpE0A/mbZZFDMB86hyPox8AemXyOJAPrR8MesHzN/JvoFkFh2LNh+z5r25KC0rt2VRYoITfZBrt+/gD/MCpr3ruEXWYgpXsy4ceMsLwjenEy5suXJki8bsbz5MkEZMhBJGC0BESIZ2pYwunDBTw1MmjzJlk1QTRYCuHPr3r07ixqXWfgJbwEB1yN+j4ApUvQAQiB5uIDhCtKCX5bM/ewgCaegu4IBU/44/5jkQM8RW537Ye9XyLuCducExFiSY5P9TfEoE2S0RDWFHixMQEcPi4wwRBprSIPGGhN0IYgUvdxBEAH8HMILP1zwcgg/vNBDSzZJ8AMHLVxccQgcYqzAjmFI5QJFE4DFKOOMEjXRRC4s5vgSBhEB9tREDPRjAlk3BWmEFVzdZEeQ/YDjjxVaMbAZkgA0olUAY3EQZABWQgVYMRjoKCZCPvBE45loNoUBGGO26eabcMYJXBIt2EDNFfy0YIYi3DyQhCukUPMGP67YMKh12NkhAnfdcdLBFFOM54ADR2hgB2YDUYaEFt61g00MAoRSn31xnKHfQHy4AQMLn9xhChYJpP/QRg9D8DEEKmtIkQYgUogCiCcT0rLBOJc44UQGtYyzQSQrGAAKF8eOkwE+eBIAnHDYZqvttsJdl+lkpaCjAjqG3ICOuIbsQ64KKqS33k1fAIHDvECogEO96JRiGUE1+OGvH5gEjMkgmhSMwMEIJ4zAhNxiu4sBY6BAwgEHhGBxCAcQIqdBUFDBhgdsLKRKmiTLddIJH7NBBRQbvynLCSXHLPMJR7XM4jGzyPgjGAHAFTMNZsmczDE234VBXzH+KJGVyKS1lT9W2ZHkV/6E5RYHRNSxpURAe+lPHWpFEYURUgcWZtF2gcHUXzYVWQcYE3EAyWaNICNRV1Rb7Q8GPdv/AYlWEqUyNuD+FBEA3Wf9xQGbaLPoAxg9yiz5X2D40PjlmGeu+eacdx5cw6Bn661AlBmBxB7hpL7HOnoEc0QwDnhzKaakU1aIMOHsoUU4SqhjTxxx2FPGK5V9RkEscnzizCdyxEJBH31YY40+lFCSTw01vFNDbAyHHnoS1rb0eRLyUAcBKU/g8kAgmbginDzAAENKt4mKwGmjkE4xDXmUgmDlTfXbg3dg4QJQzaEAo4pDGXxBu3+MgA9YGAEM+MCCESSADo7oQQYd0YVesOIHP8hVPhY2kA3QYxQ7qAQPSgCEVexADCT4wzQIscJKMKEEicAHP8LHks8JpxaXCNEl/0b0hhbUIglcoIVwuFALRH1rMhFAggimiIQAzAMEWLTF/xpomVYIY4rCKMQr6lGGMuaneANhDWvIkIdFDKENaRDCBBCECml4AQ2C+EEv1tAFKXTPe9jKhgFQgLGMuQQxjklkIiHzrpukZzNGiCRO0qOeJ3LGkTjJ5L4GsoBOenIBgAilDkZJylKWsja30U057sEOQrjSArCMZSyv8ZvLLaQJHvBAA3bJy1768pfADKYwh0nMXeayCSjpnGFc5AGYTe6ZRDmBB6CAI2XCBArLcCY0t1mUEyyDZdZkyTGWwc1yymUZRAvnQZQhk6Rl53+NEMfP+uE1kslCGeo0SBiQ5v8jet5tM04qBhEYYIcAIGlvDGAAAAh6NRpIqREA6AsNLtUIBsRlb1FoRCMSF5gw5LMgPNKZPyXyDHpiIJIVqJpakmSHofwIAyn1BxH6AQmuBU0iM60pB3ISIzB9lCAYSIVIvVSEm1ghLWvZW3Y+0JWy6c0HjTBCAEqa1K5NxCYBqEMdIFFTwKTibD8VCNzc2YjDZeegYGvE4IbU1LeMZaYBIELPkpoVv62FA1ZiAA24GiPGhXUgkJNcMsZaFAzkTCSpWFvgCOuXYvj1rwMpkzknOxMMWA6yB/GBDzgQOcpOrhgc8EERMAuTChShAqhNrWpXy9rWuva1sI0tagtD2tr/2va2uM2tbndrDECGzhjvMkIhCtGKQkQgAgHoRjeeYdZT1Y4yEWgFEpBg3GG8YgtViMcwNikQ0IgmFrEoDWhuoZoLkANgBJMNAmgzEB/6dlujW4l73ys67BihFbnzDh70Jyk96KEb7rJkBOzXHVh8wwXbQCCpCpAI5/6DAiyAwapYgAUYuGEEFjQHKkawoB8IohdpmIAOgDUQAoSIvtrioXz5kYQrBOERtDgFMGwwY0tkIhCPaEEncAGBJ4QovpNR1P0UwIn87W9SR/AfF5VE4AIXUAAHTGAZtgvAgaBCDrrQBRZMcQcsuCEF5uBDHgSxiAn8AJS9sOMCSCyQDRzi/xdMGAUQgLCBUVQCFDM4wAygkcJVlGAHhigBHDZwLeHYAAKngEALLIGLN3QiELgwQyfkF4hAKBHITGYUkR+lv0mQJ8lbtK8wBNiddjx5DvfZhAIDLBBrLEEbMugDHcxBhwQswhyLaEMeWIGGM/+gC174gRe8QJANcGEUzcjAL0rw50pIYgwzQEE2KuGEceBjA82QhLAKLZwgZOIBlwiCPLgRvyDY4MWKoAYE/ITpm0QAd+HYnTs6AI9gmOcI6Yjqkh2JBAXs4d97wIaockDwTVSBkgS5ACMWLoRF5GEEQoA4K8jQhWj0AhALEIUO0NALHaRhQidGcSQIqTHxoRi+jY40wnEjoC87lDWqZGP1Py5TigjYIZJGKMUXEqEv7v6DHEAnhz7y0IY2kIEVbQBEPnrRwV6j4elPXwDIAZkEiM0AYxYzZEt6e/JsAdeSdtjHPm5QjS/c4AZi/4IhvlB2mVumFNUwhLjIFfd9GKLnDhaY3gfB99jM5u+AJ8h8+fGwiM0ghn/4A8UWT7FrGCQgADs=\"/>\n      </a>\n    </div>\n  </h1>\n\n  <!-- settings are injected here automatically -->\n  <div id=settingspanel></div>\n\n  <footer>\n    <h3>Need help?</h3>\n    <p>Talk to us in the Gitter channel or report errors in the Github repository.\n      <ul>\n        <li>Gitter: <a target=_blank href=https://gitter.im/futwebapp-tampermonkey/Lobby>Talk in the Lobby</a></li>\n        <li>Github: <a target=_blank href=https://github.com/Mardaneus86/futwebapp-tampermonkey/issues>Add an issue</a></li>\n      </ul>\n    </p>\n    <hr/>\n    <h3>Enjoying this plugin?</h3>\n    <p>Consider a donation so this plugin can keep being improved.</p>\n    <p>\n      <a target=_blank href=https://www.paypal.me/timklingeleers rel=nofollow>\n        <img src=\"data:image/gif;base64,R0lGODlhkwAvAPf/AIdoHkQxDXtxv/pCCL29vAWX0f3jzfZ+GABGwnix6eoAG0iD1i8kCv/civacG8fJ2yYwdCwDBlat7KfE7GKo59qnMLuomCd51+u1NMPJzMiBFb7BwvO6NvtaBP/Xef3CONeKF/SBIM8AF5rE7fiKLJqjqLWLKP/KTfqwcdfp+UZGR/zVtKvU9OPk7ZFYmqCgoLbZ9XF3xkab5PmdT3VZGhlkzaOnxTU4OFdaWgCk4zx40amyt05ibZK96+GsMmya3mNqbkdQiWaf4XGl4pVyId2pMQUDAv+qHY4AEP7+/qUhSDKK3HaDif7OXMzQ1bO2z/vKVFpFFH2m4v5hAf7GQwBkisucLdvd453K8bW1tfkAHABZe/Lz9WKT21eL2CQmKOWwM/G5PPT4+/rKn1uW3gCIvZOZugBynnGe35S2552cm42y5v/SaIKx53677ezt8/j5+gCp6mi07Fl7w4q862NLFhIIBMPc9fgxDXyt5v2lHPIBG6XM8FWe5Bps0fd5DkJ91Fpilq/K7gpcy7uijVMACjs/Qenr7E+l6QYjL9PV43Ko5S6C2hwUBY+56WVtnWtRF/7y57O7wPahHDF61YCMko2StvT19w9izR8pcAVVyACh3+4cFN3f6QBOxXG98dPa3kSGzZ276ZOeooWLsRUUFIrD8XuCq7LP8Pm+N//GPW17gWSZ3mMADLu+1AA4T+wAFF2x7fbAQPvAOPv8/fr6/JBcDzyS4RUgafrIS4vC7v/8+Obo6Xeh4AIcJY2YnTI8fP+yH78AFQAWHra2tv7DObOzs/TBSKN9JPrAN/TGWvvHT31fHHF+hGK38FU8DpyJdidv0Jm45/iLE5mevjIyMkKO3bSdias+df738T6R32aAzquwymJADH1QDtsRMtakL/8AHdelMLC3uyBy0725toa36sgjTExOT755FSZ3sNdPDbytoPMAEP0VFhRcyv+hFwBFX2xzoZpoDuLl5gB6qgCu8LyyqqKrry9y0TZ+1ywsLf///wAAAP/EOQAAACH5BAEAAP8ALAAAAACTAC8AQAj/AP8JHEiwoMGDCJucoKKqWDF/D/1JnDjxoUOIEi1apJgRosOPGDlS1BhSoyoqJ5ogXMmypcuXAmWJnDkzSr9+RhhAwkCzp0+JHDBw+ElUpCyYSJO6HFpUpE0A/mbZZFDMB86hyPox8AemXyOJAPrR8MesHzN/JvoFkFh2LNh+z5r25KC0rt2VRYoITfZBrt+/gD/MCpr3ruEXWYgpXsy4ceMsLwjenEy5suXJki8bsbz5MkEZMhBJGC0BESIZ2pYwunDBTw1MmjzJlk1QTRYCuHPr3r07ixqXWfgJbwEB1yN+j4ApUvQAQiB5uIDhCtKCX5bM/ewgCaegu4IBU/44/5jkQM8RW537Ye9XyLuCducExFiSY5P9TfEoE2S0RDWFHixMQEcPi4wwRBprSIPGGhN0IYgUvdxBEAH8HMILP1zwcgg/vNBDSzZJ8AMHLVxccQgcYqzAjmFI5QJFE4DFKOOMEjXRRC4s5vgSBhEB9tREDPRjAlk3BWmEFVzdZEeQ/YDjjxVaMbAZkgA0olUAY3EQZABWQgVYMRjoKCZCPvBE45loNoUBGGO26eabcMYJXBIt2EDNFfy0YIYi3DyQhCukUPMGP67YMKh12NkhAnfdcdLBFFOM54ADR2hgB2YDUYaEFt61g00MAoRSn31xnKHfQHy4AQMLn9xhChYJpP/QRg9D8DEEKmtIkQYgUogCiCcT0rLBOJc44UQGtYyzQSQrGAAKF8eOkwE+eBIAnHDYZqvttsJdl+lkpaCjAjqG3ICOuIbsQ64KKqS33k1fAIHDvECogEO96JRiGUE1+OGvH5gEjMkgmhSMwMEIJ4zAhNxiu4sBY6BAwgEHhGBxCAcQIqdBUFDBhgdsLKRKmiTLddIJH7NBBRQbvynLCSXHLPMJR7XM4jGzyPgjGAHAFTMNZsmczDE234VBXzH+KJGVyKS1lT9W2ZHkV/6E5RYHRNSxpURAe+lPHWpFEYURUgcWZtF2gcHUXzYVWQcYE3EAyWaNICNRV1Rb7Q8GPdv/AYlWEqUyNuD+FBEA3Wf9xQGbaLPoAxg9yiz5X2D40PjlmGeu+eacdx5cw6Bn661AlBmBxB7hpL7HOnoEc0QwDnhzKaakU1aIMOHsoUU4SqhjTxxx2FPGK5V9RkEscnzizCdyxEJBH31YY40+lFCSTw01vFNDbAyHHnoS1rb0eRLyUAcBKU/g8kAgmbginDzAAENKt4mKwGmjkE4xDXmUgmDlTfXbg3dg4QJQzaEAo4pDGXxBu3+MgA9YGAEM+MCCESSADo7oQQYd0YVesOIHP8hVPhY2kA3QYxQ7qAQPSgCEVexADCT4wzQIscJKMKEEicAHP8LHks8JpxaXCNEl/0b0hhbUIglcoIVwuFALRH1rMhFAggimiIQAzAMEWLTF/xpomVYIY4rCKMQr6lGGMuaneANhDWvIkIdFDKENaRDCBBCECml4AQ2C+EEv1tAFKXTPe9jKhgFQgLGMuQQxjklkIiHzrpukZzNGiCRO0qOeJ3LGkTjJ5L4GsoBOenIBgAilDkZJylKWsja30U057sEOQrjSArCMZSyv8ZvLLaQJHvBAA3bJy1768pfADKYwh0nMXeayCSjpnGFc5AGYTe6ZRDmBB6CAI2XCBArLcCY0t1mUEyyDZdZkyTGWwc1yymUZRAvnQZQhk6Rl53+NEMfP+uE1kslCGeo0SBiQ5v8jet5tM04qBhEYYIcAIGlvDGAAAAh6NRpIqREA6AsNLtUIBsRlb1FoRCMSF5gw5LMgPNKZPyXyDHpiIJIVqJpakmSHofwIAyn1BxH6AQmuBU0iM60pB3ISIzB9lCAYSIVIvVSEm1ghLWvZW3Y+0JWy6c0HjTBCAEqa1K5NxCYBqEMdIFFTwKTibD8VCNzc2YjDZeegYGvE4IbU1LeMZaYBIELPkpoVv62FA1ZiAA24GiPGhXUgkJNcMsZaFAzkTCSpWFvgCOuXYvj1rwMpkzknOxMMWA6yB/GBDzgQOcpOrhgc8EERMAuTChShAqhNrWpXy9rWuva1sI0tagtD2tr/2va2uM2tbndrDECGzhjvMkIhCtGKQkQgAgHoRjeeYdZT1Y4yEWgFEpBg3GG8YgtViMcwNikQ0IgmFrEoDWhuoZoLkANgBJMNAmgzEB/6dlujW4l73ys67BihFbnzDh70Jyk96KEb7rJkBOzXHVh8wwXbQCCpCpAI5/6DAiyAwapYgAUYuGEEFjQHKkawoB8IohdpmIAOgDUQAoSIvtrioXz5kYQrBOERtDgFMGwwY0tkIhCPaEEncAGBJ4QovpNR1P0UwIn87W9SR/AfF5VE4AIXUAAHTGAZtgvAgaBCDrrQBRZMcQcsuCEF5uBDHgSxiAn8AJS9sOMCSCyQDRzi/xdMGAUQgLCBUVQCFDM4wAygkcJVlGAHhigBHDZwLeHYAAKngEALLIGLN3QiELgwQyfkF4hAKBHITGYUkR+lv0mQJ8lbtK8wBNiddjx5DvfZhAIDLBBrLEEbMugDHcxBhwQswhyLaEMeWIGGM/+gC174gRe8QJANcGEUzcjAL0rw50pIYgwzQEE2KuGEceBjA82QhLAKLZwgZOIBlwiCPLgRvyDY4MWKoAYE/ITpm0QAd+HYnTs6AI9gmOcI6Yjqkh2JBAXs4d97wIaockDwTVSBkgS5ACMWLoRF5GEEQoA4K8jQhWj0AhALEIUO0NALHaRhQidGcSQIqTHxoRi+jY40wnEjoC87lDWqZGP1Py5TigjYIZJGKMUXEqEv7v6DHEAnhz7y0IY2kIEVbQBEPnrRwV6j4elPXwDIAZkEiM0AYxYzZEt6e/JsAdeSdtjHPm5QjS/c4AZi/4IhvlB2mVumFNUwhLjIFfd9GKLnDhaY3gfB99jM5u+AJ8h8+fGwiM0ghn/4A8UWT7FrGCQgADs=\"/>\n      </a>\n    </p>\n  </footer>\n</div>\n";

/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferTotalsSettings = exports.ListSizeSettings = exports.MinBinSettings = exports.RefreshListSettings = exports.CardInfoSettings = undefined;

var _refreshList = __webpack_require__(363);

var _minBin = __webpack_require__(366);

var _cardInfo = __webpack_require__(367);

var _listSize = __webpack_require__(370);

var _transferTotals = __webpack_require__(371);

exports.CardInfoSettings = _cardInfo.CardInfoSettings;
exports.RefreshListSettings = _refreshList.RefreshListSettings;
exports.MinBinSettings = _minBin.MinBinSettings;
exports.ListSizeSettings = _listSize.ListSizeSettings;
exports.TransferTotalsSettings = _transferTotals.TransferTotalsSettings;

/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefreshListSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

__webpack_require__(364);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals $ */

var RefreshListSettings = exports.RefreshListSettings = function (_SettingsEntry) {
  _inherits(RefreshListSettings, _SettingsEntry);

  function RefreshListSettings() {
    _classCallCheck(this, RefreshListSettings);

    return _possibleConstructorReturn(this, (RefreshListSettings.__proto__ || Object.getPrototypeOf(RefreshListSettings)).call(this, 'refresh-transferlist', 'Refresh transferlist', null));
  }

  return RefreshListSettings;
}(_core.SettingsEntry);

RefreshListSettings.id = 'refresh-transferlist';

var RefreshTransferList = function (_BaseScript) {
  _inherits(RefreshTransferList, _BaseScript);

  function RefreshTransferList() {
    _classCallCheck(this, RefreshTransferList);

    return _possibleConstructorReturn(this, (RefreshTransferList.__proto__ || Object.getPrototypeOf(RefreshTransferList)).call(this, RefreshListSettings.id));
  }

  _createClass(RefreshTransferList, [{
    key: 'activate',
    value: function activate(state) {
      _get(RefreshTransferList.prototype.__proto__ || Object.getPrototypeOf(RefreshTransferList.prototype), 'activate', this).call(this, state);
      this._show(state.screenId);
    }
  }, {
    key: 'onScreenRequest',
    value: function onScreenRequest(screenId) {
      _get(RefreshTransferList.prototype.__proto__ || Object.getPrototypeOf(RefreshTransferList.prototype), 'onScreenRequest', this).call(this, screenId);
      this._show(screenId);
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(RefreshTransferList.prototype.__proto__ || Object.getPrototypeOf(RefreshTransferList.prototype), 'deactivate', this).call(this, state);
      $('#header').find('.subTitle').find('.refresh').remove();
    }

    /* eslint-disable class-methods-use-this */

  }, {
    key: '_show',
    value: function _show(event) {
      switch (event) {
        case 'UTMarketSearchResultsSplitViewController':
          // market search
          setTimeout(function () {
            if ($('.pagingContainer').find('.refresh').length === 0) {
              $('.pagingContainer').append('<button class="flat pagination refresh" style="float: right;">Refresh list</button>');
              $('.refresh').click(function () {
                getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController._requestItems();
              });
            }
          }, 1000);
          break;
        default:
        // no need to show anything on other screens
      }
    }
    /* eslint-enable class-methods-use-this */

  }]);

  return RefreshTransferList;
}(_core.BaseScript);

new RefreshTransferList(); // eslint-disable-line no-new

/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(365);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(48)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
        module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./refresh-list.scss", function() {
            var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./refresh-list.scss");
            if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
            update(newContent);
        });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
}

/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(undefined);
// imports


// module
exports.push([module.i, "button.flat.pagination.refresh:before {\n  font-family: UltimateTeam-Icons,sans-serif;\n  content: '\\E051'; }\n", ""]);

// exports


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MinBinSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

var _fut = __webpack_require__(67);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               window $ document
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var MinBinSettings = exports.MinBinSettings = function (_SettingsEntry) {
  _inherits(MinBinSettings, _SettingsEntry);

  function MinBinSettings() {
    _classCallCheck(this, MinBinSettings);

    var _this = _possibleConstructorReturn(this, (MinBinSettings.__proto__ || Object.getPrototypeOf(MinBinSettings)).call(this, 'min-bin', 'Search minimum BIN'));

    _this.addSetting('Amount of lowest BINs to determine minimum on', 'mean-count', 3, 'number');
    _this.addSetting('Adjust quicklist panel price automatically based on minimum BIN', 'adjust-list-price', true, 'checkbox');
    _this.addSettingUnder('adjust-list-price', 'Start price percentage (0 to 100%)', 'start-price-percentage', 90, 'number');
    _this.addSettingUnder('adjust-list-price', 'Buy now price percentage (0 to 100%)', 'buy-now-price-percentage', 110, 'number');
    return _this;
  }

  return MinBinSettings;
}(_core.SettingsEntry);

MinBinSettings.id = 'min-bin';

var MinBin = function (_BaseScript) {
  _inherits(MinBin, _BaseScript);

  function MinBin() {
    _classCallCheck(this, MinBin);

    var _this2 = _possibleConstructorReturn(this, (MinBin.__proto__ || Object.getPrototypeOf(MinBin)).call(this, MinBinSettings.id));

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    _this2._observer = new MutationObserver(_this2._mutationHandler.bind(_this2));

    _this2._playerPrices = [];
    return _this2;
  }

  _createClass(MinBin, [{
    key: 'activate',
    value: function activate(state) {
      var _this3 = this;

      _get(MinBin.prototype.__proto__ || Object.getPrototypeOf(MinBin.prototype), 'activate', this).call(this, state);

      var obsConfig = {
        childList: true,
        characterData: true,
        attributes: false,
        subtree: true
      };

      setTimeout(function () {
        _this3._observer.observe($(document)[0], obsConfig);
      }, 0);
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(MinBin.prototype.__proto__ || Object.getPrototypeOf(MinBin.prototype), 'deactivate', this).call(this, state);

      this._observer.disconnect();
    }
  }, {
    key: '_mutationHandler',
    value: function _mutationHandler(mutationRecords) {
      mutationRecords.forEach(function (mutation) {
        var _this4 = this;

        if ($(mutation.target).hasClass('DetailView') && $(mutation.target).find('.DetailPanel') && mutation.addedNodes.length > 0) {
          var searchMinBin = $(mutation.target).find('#searchMinBin');
          searchMinBin.remove();

          var selectedItem = this._getSelectedItem();

          if (selectedItem == null || selectedItem.resourceId === 0) {
            return;
          }
          var knownPlayerPrice = this._playerPrices.find(function (p) {
            return p.resourceId === selectedItem.resourceId;
          });
          var price = '';
          if (knownPlayerPrice != null) {
            price = '(' + knownPlayerPrice.minimumBin + ')';

            this._updateListPrice(knownPlayerPrice.minimumBin);
          }
          $(mutation.target).find('.DetailPanel > .ut-button-group').prepend('<button id="searchMinBin" data-resource-id="' + selectedItem.resourceId + '" class="list"><span class="btn-text">Search minimum BIN ' + price + '</span><span class="btn-subtext"></span></button>');

          $('#searchMinBin').bind('click', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var btn, settings, minimumBin, playerPrice, notificationText;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    btn = $('#searchMinBin');

                    btn.find('.btn-text').html('Searching minimum BIN...');
                    _core.analytics.trackEvent('Min BIN', 'Search Min BIN', btn.data('resource-id'));
                    settings = _this4.getSettings();
                    _context.next = 6;
                    return new _fut.TransferMarket().searchMinBuy(selectedItem, parseInt(settings['mean-count'], 10));

                  case 6:
                    minimumBin = _context.sent;
                    playerPrice = _this4._playerPrices.find(function (p) {
                      return p.resourceId === btn.data('resource-id');
                    });

                    if (playerPrice != null) {
                      _this4._playerPrices.splice(_this4._playerPrices.indexOf(playerPrice), 1);
                    }
                    _this4._playerPrices.push({
                      resourceId: btn.data('resource-id'),
                      minimumBin: minimumBin
                    });

                    selectedItem = _this4._getSelectedItem();

                    notificationText = 'Minimum BIN found for ' + selectedItem._staticData.name + ' is ' + minimumBin;

                    if (btn.data('resource-id') === selectedItem.resourceId) {
                      if (minimumBin === 0) {
                        btn.find('.btn-text').html('Search minimum BIN (extinct)');
                        notificationText = 'Minimum BIN not found for ' + selectedItem._staticData.name + ', card may be extinct';
                      } else {
                        btn.find('.btn-text').html('Search minimum BIN (' + minimumBin + ')');

                        _this4._updateListPrice(minimumBin);
                      }
                    }

                    GM_notification({
                      text: notificationText,
                      title: 'FUT 20 Web App',
                      timeout: 5000,
                      onclick: function onclick() {
                        return window.focus();
                      }
                    });

                  case 14:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this4);
          })));
        }
      }, this);
    }
  }, {
    key: '_updateListPrice',
    value: function _updateListPrice(minimumBin) {
      var settings = this.getSettings();
      var quicklistPanel = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController._currentController._quickListPanel;

      if (settings['adjust-list-price'] && quicklistPanel) {
        var quicklistpanelView = quicklistPanel._view;

        var listPrice = _fut.priceTiers.determineListPrice(minimumBin * (settings['start-price-percentage'] / 100), minimumBin * (settings['buy-now-price-percentage'] / 100));

        if (quicklistPanel._item) {
          // sets the values when the quicklistpanel hasn't been initialized
          var auction = quicklistPanel._item._auction;
          if (auction.tradeState === 'closed') {
            // item is sold
            return;
          }
          if (auction.tradeState !== 'active') {
            auction.startingBid = listPrice.start;
            auction.buyNowPrice = listPrice.buyNow;
            quicklistPanel._item.setAuctionData(auction);
          }
        }

        var bidSpinner = quicklistpanelView._bidNumericStepper;
        var buySpinner = quicklistpanelView._buyNowNumericStepper;
        bidSpinner.setValue(listPrice.start);
        buySpinner.setValue(listPrice.buyNow);
      }
    }

    /* eslint-disable class-methods-use-this */

  }, {
    key: '_getSelectedItem',
    value: function _getSelectedItem() {
      var listController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController;
      if (listController) {
        return listController.getIterator().current();
      }

      var detailController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController;
      if (detailController && detailController._currentController._viewmodel) {
        var current = detailController._currentController._viewmodel.current();

        return current._item ? current._item : current;
      }

      return null;
    }
    /* eslint-enable class-methods-use-this */

  }]);

  return MinBin;
}(_core.BaseScript);

new MinBin(); // eslint-disable-line no-new

/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardInfoSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

__webpack_require__(368);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               window $ document */

var CardInfoSettings = exports.CardInfoSettings = function (_SettingsEntry) {
  _inherits(CardInfoSettings, _SettingsEntry);

  function CardInfoSettings() {
    _classCallCheck(this, CardInfoSettings);

    var _this = _possibleConstructorReturn(this, (CardInfoSettings.__proto__ || Object.getPrototypeOf(CardInfoSettings)).call(this, 'card-info', 'Extra card information', null));

    _this.addSetting('Show contracts', 'show-contracts', true, 'checkbox');
    _this.addSetting('Show fitness', 'show-fitness', true, 'checkbox');
    return _this;
  }

  return CardInfoSettings;
}(_core.SettingsEntry);

CardInfoSettings.id = 'card-info';

var CardInfo = function (_BaseScript) {
  _inherits(CardInfo, _BaseScript);

  function CardInfo() {
    _classCallCheck(this, CardInfo);

    var _this2 = _possibleConstructorReturn(this, (CardInfo.__proto__ || Object.getPrototypeOf(CardInfo)).call(this, CardInfoSettings.id));

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    _this2._observer = new MutationObserver(_this2._mutationHandler.bind(_this2));
    return _this2;
  }

  _createClass(CardInfo, [{
    key: 'activate',
    value: function activate(state) {
      var _this3 = this;

      _get(CardInfo.prototype.__proto__ || Object.getPrototypeOf(CardInfo.prototype), 'activate', this).call(this, state);

      var obsConfig = {
        childList: true,
        characterData: true,
        attributes: false,
        subtree: true
      };

      setTimeout(function () {
        _this3._observer.observe($(document)[0], obsConfig);
      }, 0);
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(CardInfo.prototype.__proto__ || Object.getPrototypeOf(CardInfo.prototype), 'deactivate', this).call(this, state);
      this._observer.disconnect();
    }
  }, {
    key: '_mutationHandler',
    value: function _mutationHandler(mutationRecords) {
      var settings = this.getSettings();
      mutationRecords.forEach(function (mutation) {
        if ($(mutation.target).find('.listFUTItem').length > 0) {
          var controller = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();
          if (!controller || !controller._listController) {
            return;
          }

          var items = [];
          if (controller._listController._view._list) {
            items = controller._listController._view._list._listRows;
          } else {
            items = controller._listController._viewmodel._collection.map(function (item) {
              return { data: item };
            });
          }
          var rows = $('.listFUTItem');

          rows.each(function (index, row) {
            if ($(row).find('.infoTab-extra').length > 0) {
              return; // already added
            }

            var info = '';
            if (settings['show-fitness'].toString() === 'true') {
              info += '<div class="fitness" style="position: absolute;left: 5px;bottom: -3px;">\n              F:' + items[index].data.fitness + '\n              </div>';
            }

            if (settings['show-contracts'].toString() === 'true') {
              info += '<div class="contracts" style="position: absolute;right: 5px;bottom: -3px;">\n              C:' + items[index].data.contract + '\n              </div>';
            }

            $(row).find('.small.player').prepend('<div class="infoTab-extra">' + info + '</div>');
          });
        }
      });
    }
  }]);

  return CardInfo;
}(_core.BaseScript);

new CardInfo(); // eslint-disable-line no-new

/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(369);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(48)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
        module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./card-info.scss", function() {
            var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./card-info.scss");
            if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
            update(newContent);
        });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
}

/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(undefined);
// imports


// module
exports.push([module.i, ".item.player.small.TOTW .infoTab-extra,\n.item.player.small.OTW .infoTab-extra,\n.item.player.small.TOTS .infoTab-extra,\n.item.player.small.TOTY .infoTab-extra,\n.item.player.small.legend .infoTab-extra {\n  color: white; }\n\n.item.player.small .infoTab-extra {\n  width: 100%;\n  height: 100%;\n  position: absolute; }\n", ""]);

// exports


/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListSizeSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               gConfigurationModel models
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var ListSizeSettings = exports.ListSizeSettings = function (_SettingsEntry) {
  _inherits(ListSizeSettings, _SettingsEntry);

  function ListSizeSettings() {
    _classCallCheck(this, ListSizeSettings);

    var _this = _possibleConstructorReturn(this, (ListSizeSettings.__proto__ || Object.getPrototypeOf(ListSizeSettings)).call(this, 'list-size', 'Increase transfer list size', null));

    _this.addSetting('Items per page on transfer market (max 30)', 'items-per-page-transfermarket', 30, 'number');
    _this.addSetting('Items per page on club (max 90)', 'items-per-page-club', 90, 'number');
    return _this;
  }

  return ListSizeSettings;
}(_core.SettingsEntry);

ListSizeSettings.id = 'list-size';

var ListSize = function (_BaseScript) {
  _inherits(ListSize, _BaseScript);

  function ListSize() {
    _classCallCheck(this, ListSize);

    return _possibleConstructorReturn(this, (ListSize.__proto__ || Object.getPrototypeOf(ListSize)).call(this, ListSizeSettings.id));
  }

  _createClass(ListSize, [{
    key: 'activate',
    value: function activate(state) {
      _get(ListSize.prototype.__proto__ || Object.getPrototypeOf(ListSize.prototype), 'activate', this).call(this, state);

      this._start();
    }
  }, {
    key: 'onScreenRequest',
    value: function onScreenRequest(screenId) {
      _get(ListSize.prototype.__proto__ || Object.getPrototypeOf(ListSize.prototype), 'onScreenRequest', this).call(this, screenId);

      if (this._running) {
        this._start();
      }
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(ListSize.prototype.__proto__ || Object.getPrototypeOf(ListSize.prototype), 'deactivate', this).call(this, state);

      this._stop();
    }
  }, {
    key: '_start',
    value: function _start() {
      this._running = true;

      var itemsOnMarket = parseInt(this.getSettings()['items-per-page-transfermarket'], 10);
      var itemsOnClub = parseInt(this.getSettings()['items-per-page-club'], 10);
      var configObj = gConfigurationModel.getConfigObject(models.ConfigurationModel.KEY_ITEMS_PER_PAGE);
      configObj[models.ConfigurationModel.ITEMS_PER_PAGE.TRANSFER_MARKET] = itemsOnMarket;
      configObj[models.ConfigurationModel.ITEMS_PER_PAGE.CLUB] = itemsOnClub;
    }
  }, {
    key: '_stop',
    value: function _stop() {
      this._running = false;

      var configObj = gConfigurationModel.getConfigObject(models.ConfigurationModel.KEY_ITEMS_PER_PAGE);
      configObj[models.ConfigurationModel.ITEMS_PER_PAGE.TRANSFER_MARKET] = 15;
      configObj[models.ConfigurationModel.ITEMS_PER_PAGE.CLUB] = 45;
    }
  }]);

  return ListSize;
}(_core.BaseScript);

new ListSize(); // eslint-disable-line no-new

/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferTotalsSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

__webpack_require__(372);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               window $ document */

var TransferTotalsSettings = exports.TransferTotalsSettings = function (_SettingsEntry) {
  _inherits(TransferTotalsSettings, _SettingsEntry);

  function TransferTotalsSettings() {
    _classCallCheck(this, TransferTotalsSettings);

    var _this = _possibleConstructorReturn(this, (TransferTotalsSettings.__proto__ || Object.getPrototypeOf(TransferTotalsSettings)).call(this, 'transfer-totals', 'Transfer list totals', null));

    _this.addSetting('Show transfer list totals', 'show-transfer-totals', true, 'checkbox');
    return _this;
  }

  return TransferTotalsSettings;
}(_core.SettingsEntry);

TransferTotalsSettings.id = 'transfer-totals';

var TransferTotals = function (_BaseScript) {
  _inherits(TransferTotals, _BaseScript);

  function TransferTotals() {
    _classCallCheck(this, TransferTotals);

    var _this2 = _possibleConstructorReturn(this, (TransferTotals.__proto__ || Object.getPrototypeOf(TransferTotals)).call(this, TransferTotalsSettings.id));

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    _this2._observer = new MutationObserver(_this2._mutationHandler.bind(_this2));
    return _this2;
  }

  _createClass(TransferTotals, [{
    key: 'activate',
    value: function activate(state) {
      var _this3 = this;

      _get(TransferTotals.prototype.__proto__ || Object.getPrototypeOf(TransferTotals.prototype), 'activate', this).call(this, state);

      var obsConfig = {
        childList: true,
        characterData: true,
        attributes: false,
        subtree: true
      };

      setTimeout(function () {
        _this3._observer.observe($(document)[0], obsConfig);
      }, 0);
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(TransferTotals.prototype.__proto__ || Object.getPrototypeOf(TransferTotals.prototype), 'deactivate', this).call(this, state);
      this._observer.disconnect();
    }
  }, {
    key: '_mutationHandler',
    value: function _mutationHandler(mutationRecords) {
      var settings = this.getSettings();
      mutationRecords.forEach(function (mutation) {
        if ($(mutation.target).find('.listFUTItem').length > 0 || $(mutation.target).find('.futbin').length > 0) {
          var controller = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();
          if (!controller || !controller._listController) {
            return;
          }

          if (window.currentPage !== 'UTTransferListSplitViewController') {
            return;
          }

          if (!settings.isActive || settings['show-transfer-totals'].toString() !== 'true') {
            return;
          }

          var lists = $('.ut-transfer-list-view .itemList');
          var items = controller._listController._viewmodel._collection;
          var listRows = $('.ut-transfer-list-view .listFUTItem');

          lists.each(function (index, list) {
            var totals = {
              futbin: 0,
              bid: 0,
              bin: 0
            };
            var listEl = $(list);

            if (!listEl.find('.listFUTItem').length) {
              return;
            }

            var firstIndex = $(list).find('.listFUTItem:first').index('.ut-transfer-list-view .listFUTItem');
            var lastIndex = $(list).find('.listFUTItem:last').index('.ut-transfer-list-view .listFUTItem');

            totals.futbin = items.slice(firstIndex, lastIndex + 1).reduce(function (sum, item, i) {
              var futbin = parseInt(listRows.eq(i + firstIndex).find('.auctionValue.futbin .coins.value').text().replace(/[,.]/g, ''), 10) || 0;
              return sum + futbin;
            }, 0);
            totals.bid = items.slice(firstIndex, lastIndex + 1).reduce(function (sum, item) {
              var _item$_auction = item._auction,
                  currentBid = _item$_auction.currentBid,
                  startingBid = _item$_auction.startingBid;

              var actualBid = currentBid > 0 ? currentBid : startingBid;
              return sum + actualBid;
            }, 0);
            totals.bin = items.slice(firstIndex, lastIndex + 1).reduce(function (sum, item) {
              return sum + item._auction.buyNowPrice;
            }, 0);

            var totalsItem = listEl.prev('.transfer-totals');

            if (!totalsItem.length) {
              $('<div class="transfer-totals">\n            <div class="auction">\n              <div class="auctionValue futbin">\n                <span class="label">Futbin BIN</span>\n                <span class="coins value total-futbin">0</span>\n              </div>\n              <div class="auctionStartPrice auctionValue">&nbsp;</div>\n              <div class="auctionValue">\n                <span class="label">Bid Total</span>\n                <span class="coins value total-bid">0</span>\n              </div>\n              <div class="auctionValue">\n                <span class="label">BIN Total</span>\n                <span class="coins value total-bin">0</span>\n              </div>\n            </div>\n          </div>').insertBefore(listEl);
            }

            if (totals.futbin > 0) {
              totalsItem.find('.total-futbin').text(totals.futbin);
              totalsItem.find('.futbin').show();
            } else {
              totalsItem.find('.futbin').hide();
            }
            totalsItem.find('.total-bin').text(totals.bin);
            totalsItem.find('.total-bid').text(totals.bid);
          });
        }
      });
    }
  }]);

  return TransferTotals;
}(_core.BaseScript);

new TransferTotals(); // eslint-disable-line no-new

/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(373);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(48)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
        module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./transfer-totals.scss", function() {
            var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./transfer-totals.scss");
            if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
            update(newContent);
        });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
}

/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(undefined);
// imports


// module
exports.push([module.i, ".transfer-totals {\n  background-color: #183f94;\n  color: #fff; }\n  .transfer-totals .auction {\n    float: right;\n    margin: 1em 3em 1em 0;\n    text-align: right;\n    width: 45%; }\n    .transfer-totals .auction .auctionStartPrice {\n      display: none; }\n      @media (min-width: 1281px) {\n        .transfer-totals .auction .auctionStartPrice {\n          display: block; } }\n .listFUTItem .auction { display: none; }\n    .transfer-totals .auction .auctionValue {\n      float: left;\n      padding-right: 1%;\n      width: 24%; }\n    .transfer-totals .auction .label {\n      color: #b5b7bb;\n      display: block;\n      font-size: .75rem;\n      text-transform: uppercase; }\n    .transfer-totals .auction .value {\n      font-size: 1.125em;\n      font-weight: 400;\n      font-family: UltimateTeamCondensed,sans-serif;\n      display: block; }\n    @media (max-width: 1130px) {\n      .transfer-totals .auction {\n        align-items: flex-start;\n        box-sizing: border-box;\n        display: flex;\n        float: none;\n        margin: 0;\n        padding: 0.5em 1.2rem 0.5em 113px;\n        text-align: left;\n        width: 100%; } }\n  .transfer-totals:after {\n    content: '';\n    display: table;\n    width: 100%; }\n", ""]);

// exports


/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FutbinSettings = undefined;

__webpack_require__(375);

var _futbinPrices = __webpack_require__(377);

var _futbinPlayerLinks = __webpack_require__(378);

var _settingsEntry = __webpack_require__(94);

exports.FutbinSettings = _settingsEntry.FutbinSettings;


new _futbinPrices.FutbinPrices(); // eslint-disable-line no-new
new _futbinPlayerLinks.FutbinPlayerLinks(); // eslint-disable-line no-new

/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(376);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(48)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
        module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./futbin-prices.scss", function() {
            var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./futbin-prices.scss");
            if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
            update(newContent);
        });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
}

/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(undefined);
// imports


// module
exports.push([module.i, "#TradePile .player-stats-data-component, #Unassigned .player-stats-data-component {\n  width: 12em; }\n\n#TradePile .listFUTItem .entityContainer, #Unassigned .listFUTItem .entityContainer {\n  width: 45%; }\n\n#Unassigned .listFUTItem .auction .auctionValue, #Unassigned .listFUTItem .auction .auction-state {\n  display: none; }\n\n#Unassigned .listFUTItem .auction .auctionValue.futbin {\n  display: block;\n  float: right; }\n\n.MyClubResults .listFUTItem .auction {\n  display: block;\n  position: absolute;\n  right: 0; }\n\n.MyClubResults .listFUTItem .auction .auctionValue, .MyClubResults .listFUTItem .auction .auction-state {\n  width: 24%;\n  float: right;\n  padding-right: 1%;\n  display: none; }\n\n.MyClubResults .listFUTItem .auction .auctionValue.futbin {\n  display: block; }\n\n.listFUTItem .auction .auction-state {\n  width: 25%;\n  float: right; }\n\n.listFUTItem .auction .auctionValue {\n  width: 24%;\n  float: left;\n  padding-right: 1%; }\n\n.futbinupdate {\n  font-size: 14px;\n  clear: both;\n  display: block; }\n\n.coins.value.futbin {\n  -webkit-filter: hue-rotate(165deg);\n  filter: hue-rotate(165deg); }\n\n.listFUTItem.has-auction-data.futbin-bargain .rowContent {\n  background-color: #7ffe9445; }\n\n.listFUTItem.has-auction-data.selected.futbin-bargain .rowContent, .listFUTItem.has-auction-data.selected.futbin-bargain .rowContent.active {\n  background-color: #7ffe94;\n  color: #434853; }\n\n.player-picks-modal .time {\n  display: block; }\n\n.ut-squad-slot-pedestal-view.futbin {\n  min-width: 58px;\n  flex: none;\n  width: auto;\n  bottom: -2.2em;\n  white-space: nowrap; }\n  .ut-squad-slot-pedestal-view.futbin .coins.value {\n    text-align: center;\n    margin: 0 8px; }\n", ""]);

// exports


/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FutbinPrices = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fut = __webpack_require__(67);

var _core = __webpack_require__(18);

var _settingsEntry = __webpack_require__(94);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               $
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               window
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var FutbinPrices = exports.FutbinPrices = function (_BaseScript) {
  _inherits(FutbinPrices, _BaseScript);

  function FutbinPrices() {
    _classCallCheck(this, FutbinPrices);

    var _this = _possibleConstructorReturn(this, (FutbinPrices.__proto__ || Object.getPrototypeOf(FutbinPrices)).call(this, _settingsEntry.FutbinSettings.id));

    _this._squadObserver = null;
    return _this;
  }

  _createClass(FutbinPrices, [{
    key: 'activate',
    value: function activate(state) {
      _get(FutbinPrices.prototype.__proto__ || Object.getPrototypeOf(FutbinPrices.prototype), 'activate', this).call(this, state);

      this._show(state.screenId);
    }
  }, {
    key: 'onScreenRequest',
    value: function onScreenRequest(screenId) {
      var _this2 = this;

      _get(FutbinPrices.prototype.__proto__ || Object.getPrototypeOf(FutbinPrices.prototype), 'onScreenRequest', this).call(this, screenId);

      var controllerName = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().className;

      if (screenId === 'SBCSquadSplitViewController' || screenId === 'SquadSplitViewController' || screenId === 'UTSquadSplitViewController' || screenId === 'UTSquadsHubViewController' || screenId === 'UTSBCSquadSplitViewController') {
        if (this.getSettings()['show-sbc-squad'].toString() !== 'true') {
          return;
        }

        this._squadObserver = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._leftController._squad.onDataUpdated.observe(this, function () {
          $('.squadSlotPedestal.futbin').remove(); // forces update
          _this2._show('SBCSquadSplitViewController', true);
        });
        if ($('.ut-squad-summary-info--right.ut-squad-summary-info').find('.futbin').length === 0) {
          $('.ut-squad-summary-info--right.ut-squad-summary-info').append('\n        <div class="futbin total">\n          <span class="ut-squad-summary-label">Total BIN value</span>\n          <div style="text-align: right">\n            <span class="ut-squad-summary-value coins value">---</span>\n          </div>\n        </div>\n      ');
        }
      } else if (this._squadObserver !== null && controllerName !== 'SBCSquadSplitViewController' && controllerName !== 'SquadSplitViewController' && controllerName !== 'UTSquadSplitViewController' && controllerName !== 'UTSquadsHubViewController' && controllerName !== 'UTSBCSquadSplitViewController') {
        this._squadObserver.unobserve(this);
      }

      this._show(screenId);
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(FutbinPrices.prototype.__proto__ || Object.getPrototypeOf(FutbinPrices.prototype), 'deactivate', this).call(this, state);

      $('.futbin').remove();

      if (this._squadObserver !== null) {
        this._squadObserver.unobserve(this);
      }

      if (this._intervalRunning) {
        clearInterval(this._intervalRunning);
      }
    }
  }, {
    key: '_show',
    value: function _show(screen) {
      var _this3 = this;

      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var showFutbinPricePages = ['UTTransferListSplitViewController', // transfer list
      'UTWatchListSplitViewController', // transfer targets
      'UTUnassignedItemsSplitViewController', // pack buy
      'ClubSearchResultsSplitViewController', // club
      'UTMarketSearchResultsSplitViewController', // market search
      'UTPlayerPicksViewController', 'SBCSquadSplitViewController', 'SquadSplitViewController', 'UTSquadSplitViewController', 'UTSquadsHubViewController', 'UTSBCSquadSplitViewController'];

      if (showFutbinPricePages.indexOf(screen) !== -1) {
        if (this._intervalRunning) {
          clearInterval(this._intervalRunning);
        }
        this._intervalRunning = setInterval(function () {
          var lastFutbinFetchFail = _core.Database.get('lastFutbinFetchFail', 0);
          if (lastFutbinFetchFail + 5 * 60000 > Date.now()) {
            console.log('Futbin fetching has been paused for 5 minutes because of failed requests earlier (retrying after ' + new Date(lastFutbinFetchFail + 5 * 60000).toLocaleTimeString() + '). Check on Github for known issues.'); // eslint-disable-line no-console
            if (_this3._intervalRunning) {
              clearInterval(_this3._intervalRunning);
            }
            return;
          }
          if (showFutbinPricePages.indexOf(window.currentPage) === -1 && !force) {
            if (_this3._intervalRunning) {
              clearInterval(_this3._intervalRunning);
            }
            return;
          }
          var controller = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();

          var uiItems = null;
          if (screen === 'SBCSquadSplitViewController' || screen === 'SquadSplitViewController' || screen === 'UTSquadSplitViewController' || screen === 'UTSquadsHubViewController' || screen === 'UTSBCSquadSplitViewController') {
            uiItems = $(controller._view.__root).find('.squadSlot');

            if (_this3.getSettings()['show-sbc-squad'].toString() !== 'true') {
              return;
            }
          } else {
            uiItems = $(getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController()._view.__root).find('.listFUTItem');

            var targetForButton = uiItems.find('.auction');
            if (targetForButton !== null) {
              targetForButton.show(); // make sure it's always shown (#69)
            }
          }

          if ($(uiItems[0]).find('.futbin').length > 0) {
            return;
          }

          var listController = null;
          if (screen === 'SBCSquadSplitViewController' || screen === 'SquadSplitViewController' || screen === 'UTSquadSplitViewController' || screen === 'UTSquadsHubViewController' || screen === 'UTSBCSquadSplitViewController') {
            // not needed
          } else if (screen === 'UTPlayerPicksViewController') {
            if (!controller.getPresentedViewController()) {
              return;
            }
            if ($(controller.getPresentedViewController()._view.__root).find('.futbin').length > 0) {
              // Futbin prices already shown
              return;
            }
            listController = controller.getPresentedViewController();
          } else if (screen === 'UTUnassignedItemsSplitViewController' || screen === 'UTWatchListSplitViewController') {
            if (!controller || !controller._leftController || !controller._leftController._view) {
              return;
            }
            listController = controller._leftController;
          } else {
            if (!controller || !controller._listController || !controller._listController._view) {
              return; // only run if data is available
            }
            listController = controller._listController;
          }

          var listrows = null;
          if (screen === 'SBCSquadSplitViewController' || screen === 'SquadSplitViewController' || screen === 'UTSquadSplitViewController' || screen === 'UTSquadsHubViewController' || screen === 'UTSBCSquadSplitViewController') {
            listrows = controller._squad._players.slice(0, 11).map(function (p, index) {
              return {
                data: p._item,
                target: controller._view._lView._slotViews[index].__root
              };
            });
          } else if (listController._picks && screen === 'UTPlayerPicksViewController') {
            listrows = listController._picks.map(function (pick, index) {
              return {
                data: pick,
                target: listController._view._playerPickViews[index].__root
              };
            });
          } else if (listController._view._list && listController._view._list._listRows && listController._view._list._listRows.length > 0) {
            listrows = listController._view._list._listRows; // for transfer market and club search
          } else if (listController._view._sections && listController._view._sections.length > 0) {
            // for transfer list & trade pile
            listController._view._sections.forEach(function (row) {
              if (row._listRows.length > 0) {
                if (listrows == null) {
                  listrows = row._listRows;
                } else {
                  listrows = listrows.concat(row._listRows);
                }
              }
            });
          }

          if (listrows === null) {
            return;
          }

          var showBargains = _this3.getSettings()['show-bargains'].toString() === 'true';

          var resourceIdMapping = [];
          listrows.forEach(function (row, index) {
            resourceIdMapping.push({
              target: uiItems[index] || row.target,
              playerId: row.data.resourceId,
              item: row.data
            });
          });

          var fetchedPlayers = 0;
          var fetchAtOnce = 30;
          var futbinlist = [];
          while (resourceIdMapping.length > 0 && fetchedPlayers < resourceIdMapping.length && _core.Database.get('lastFutbinFetchFail', 0) + 5 * 60000 < Date.now()) {
            var futbinUrl = 'https://www.futbin.com/21/playerPrices?player=&rids=' + resourceIdMapping.slice(fetchedPlayers, fetchedPlayers + fetchAtOnce).map(function (i) {
              return i.playerId;
            }).filter(function (current, next) {
              return current !== next && current !== 0;
            }).join(',');
            fetchedPlayers += fetchAtOnce;
            /* eslint-disable no-loop-func */
            GM_xmlhttpRequest({
              method: 'GET',
              url: futbinUrl,
              onload: function onload(res) {
                if (res.status !== 200) {
                  _core.Database.set('lastFutbinFetchFail', Date.now());
                  GM_notification('Could not load Futbin prices (code ' + res.status + '), pausing fetches for 5 minutes. Disable Futbin integration if the problem persists.', 'Futbin fetch failed');
                  return;
                }

                var futbinData = JSON.parse(res.response);
                resourceIdMapping.forEach(function (item) {
                  FutbinPrices._showFutbinPrice(screen, item, futbinData, showBargains);
                  futbinlist.push(futbinData[item.playerId]);
                });
                var platform = _fut.utils.getPlatform();
                if (screen === 'SBCSquadSplitViewController' || screen === 'SquadSplitViewController' || screen === 'UTSquadSplitViewController' || screen === 'UTSquadsHubViewController' || screen === 'UTSBCSquadSplitViewController') {
                  var futbinTotal = futbinlist.reduce(function (sum, item) {
                    return sum + parseInt(item.prices[platform].LCPrice.toString().replace(/[,.]/g, ''), 10) || 0;
                  }, 0);
                  $('.ut-squad-summary-value.coins.value').html('' + futbinTotal.toLocaleString());
                }
              }
            });
          }
        }, 1000);
      } else {
        // no need to search prices on other pages
        // reset page
        if (this._intervalRunning) {
          clearInterval(this._intervalRunning);
        }
        this._intervalRunning = null;
      }
    }
  }], [{
    key: '_showFutbinPrice',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(screen, item, futbinData, showBargain) {
        var target, playerId, platform, targetForButton, futbinText;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (futbinData) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:
                target = $(item.target);
                playerId = item.playerId;

                if (!(target.find('.player').length === 0)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return');

              case 6:
                platform = _fut.utils.getPlatform();

                if (futbinData[playerId]) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return');

              case 9:
                targetForButton = null;

                if (!(target.find('.futbin').length > 0)) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt('return');

              case 12:
                futbinText = 'Futbin BIN';
                _context.t0 = screen;
                _context.next = _context.t0 === 'SBCSquadSplitViewController' ? 16 : _context.t0 === 'SquadSplitViewController' ? 16 : _context.t0 === 'UTSquadSplitViewController' ? 16 : _context.t0 === 'UTSquadsHubViewController' ? 16 : _context.t0 === 'UTSBCSquadSplitViewController' ? 16 : _context.t0 === 'UTPlayerPicksViewController' ? 18 : _context.t0 === 'UTTransferListSplitViewController' ? 20 : _context.t0 === 'UTWatchListSplitViewController' ? 20 : _context.t0 === 'UTUnassignedItemsSplitViewController' ? 20 : _context.t0 === 'ClubSearchResultsSplitViewController' ? 20 : _context.t0 === 'UTMarketSearchResultsSplitViewController' ? 20 : _context.t0 === 'SearchResults' ? 25 : 28;
                break;

              case 16:
                target.prepend('\n        <div class="ut-squad-slot-pedestal-view no-state futbin">\n          <span class="coins value" title="Last update: ' + (futbinData[playerId].prices[platform].updated || 'never') + '">' + (futbinData[playerId].prices[platform].LCPrice || '---') + '</span>\n        </div>');
                return _context.abrupt('break', 28);

              case 18:
                target.append('\n        <div class="auctionValue futbin">\n          <span class="label">' + futbinText + '</span>\n          <span class="coins value">' + (futbinData[playerId].prices[platform].LCPrice || '---') + '</span>\n          <span class="time" style="color: #acacc4;">' + (futbinData[playerId].prices[platform].updated || 'never') + '</span>\n        </div>');
                return _context.abrupt('break', 28);

              case 20:
                $('.secondary.player-stats-data-component').css('float', 'left');
                targetForButton = target.find('.auction');
                targetForButton.show();
                targetForButton.prepend('\n        <div class="auctionValue futbin">\n          <span class="label">' + futbinText + '</span>\n          <span class="coins value">' + (futbinData[playerId].prices[platform].LCPrice || '---') + '</span>\n          <span class="time" style="color: #acacc4;">' + (futbinData[playerId].prices[platform].updated || 'never') + '</span>\n        </div>');
                return _context.abrupt('break', 28);

              case 25:
                targetForButton = target.find('.auctionValue').parent();
                targetForButton.prepend('\n        <div class="auctionValue futbin">\n          <span class="label">' + futbinText + '</span>\n          <span class="coins value">' + (futbinData[playerId].prices[platform].LCPrice || '---') + '</span>\n          <span class="time" style="color: #acacc4;">' + (futbinData[playerId].prices[platform].updated || 'never') + '</span>\n        </div>');
                return _context.abrupt('break', 28);

              case 28:

                if (showBargain) {
                  if (item.item._auction && item.item._auction.buyNowPrice < futbinData[playerId].prices[platform].LCPrice.toString().replace(/[,.]/g, '')) {
                    target.addClass('futbin-bargain');
                  }
                }

              case 29:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _showFutbinPrice(_x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return _showFutbinPrice;
    }()
  }]);

  return FutbinPrices;
}(_core.BaseScript);

/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FutbinPlayerLinks = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

var _settingsEntry = __webpack_require__(94);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               window $ document
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var FutbinPlayerLinks = exports.FutbinPlayerLinks = function (_BaseScript) {
  _inherits(FutbinPlayerLinks, _BaseScript);

  function FutbinPlayerLinks() {
    _classCallCheck(this, FutbinPlayerLinks);

    var _this = _possibleConstructorReturn(this, (FutbinPlayerLinks.__proto__ || Object.getPrototypeOf(FutbinPlayerLinks)).call(this, _settingsEntry.FutbinSettings.id));

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    _this._observer = new MutationObserver(_this._mutationHandler.bind(_this));

    _this._playerPrices = [];
    return _this;
  }

  _createClass(FutbinPlayerLinks, [{
    key: 'activate',
    value: function activate(state) {
      var _this2 = this;

      _get(FutbinPlayerLinks.prototype.__proto__ || Object.getPrototypeOf(FutbinPlayerLinks.prototype), 'activate', this).call(this, state);

      var obsConfig = {
        childList: true,
        characterData: true,
        attributes: false,
        subtree: true
      };

      setTimeout(function () {
        _this2._observer.observe($(document)[0], obsConfig);
      }, 0);
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(FutbinPlayerLinks.prototype.__proto__ || Object.getPrototypeOf(FutbinPlayerLinks.prototype), 'deactivate', this).call(this, state);

      $('#futbinPlayerLink').remove();

      this._observer.disconnect();
    }
  }, {
    key: '_mutationHandler',
    value: function _mutationHandler(mutationRecords) {
      mutationRecords.forEach(function (mutation) {
        var _this3 = this;

        if ($(mutation.target).hasClass('DetailView') && $(mutation.target).find('.DetailPanel') && mutation.addedNodes.length > 0) {
          if (this.getSettings()['show-link-to-player'].toString() !== 'true') {
            return;
          }

          var selectedItem = this._getSelectedItem();
          if (selectedItem == null || selectedItem.resourceId === 0) {
            return;
          }

          var futbinPlayerLink = $(mutation.target).find('#futbinPlayerLink');
          futbinPlayerLink.remove();

          $(mutation.target).find('.DetailPanel > .ut-button-group').prepend('<button id="futbinPlayerLink" data-resource-id="' + selectedItem.resourceId + '" class="list"><span class="btn-text">View on Futbin</span><span class="btn-subtext"></span></button>');

          $('#futbinPlayerLink').bind('click', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var btn, futbinLink;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    btn = $('#futbinPlayerLink');

                    btn.find('.btn-text').html('Searching on Futbin ...');
                    _context.next = 4;
                    return FutbinPlayerLinks._getFutbinPlayerUrl(selectedItem);

                  case 4:
                    futbinLink = _context.sent;


                    selectedItem = _this3._getSelectedItem();
                    btn = $('#futbinPlayerLink');
                    if (btn.data('resource-id') === selectedItem.resourceId) {
                      if (futbinLink) {
                        btn.find('.btn-text').html('View on Futbin');
                        _core.analytics.trackEvent('Futbin', 'Show player on Futbin', btn.data('resource-id'));
                        window.open(futbinLink);
                      } else {
                        btn.find('.btn-text').html('No exact Futbin player found');
                      }
                    }

                  case 8:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this3);
          })));
        }
      }, this);
    }
  }, {
    key: '_getSelectedItem',


    /* eslint-disable class-methods-use-this */
    value: function _getSelectedItem() {
      var listController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._listController;
      if (listController) {
        return listController.getIterator().current();
      }

      var currentController = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController._currentController;
      if (currentController && currentController._viewmodel) {
        var current = currentController._viewmodel.current();

        return current._item ? current._item : current;
      }

      return null;
    }
    /* eslint-enable class-methods-use-this */

  }], [{
    key: '_getFutbinPlayerUrl',
    value: function _getFutbinPlayerUrl(item) {
      return new Promise(function (resolve) {
        if (!item._staticData) {
          return resolve(null);
        }

        var futbinPlayerIds = _core.Database.getJson('futbin-player-ids', []);
        var futbinPlayer = futbinPlayerIds.find(function (i) {
          return i.id === item.resourceId;
        });
        if (futbinPlayer != null) {
          return resolve('https://www.futbin.com/21/player/' + futbinPlayer.futbinId);
        }

        var name = (item._staticData.firstName + ' ' + item._staticData.lastName).replace(' ', '+');
        var url = 'https://www.futbin.com/search?year=21&term=' + name;
        return GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function onload(res) {
            if (res.status !== 200) {
              return resolve(null);
            }
            var players = JSON.parse(res.response);
            var exactPlayers = players.filter(function (p) {
              return parseInt(p.rating, 10) === parseInt(item.rating, 10);
            });
            if (exactPlayers.length > 1) {
              exactPlayers = exactPlayers.filter(function (p) {
                return p.rare_type === item.rareflag.toString() && p.club_image.endsWith('/' + item.teamId + '.png');
              });
            }
            if (exactPlayers.length === 1) {
              futbinPlayerIds = _core.Database.getJson('futbin-player-ids', []);
              if (futbinPlayerIds.find(function (i) {
                return i.id === item.resourceId;
              }) == null) {
                futbinPlayerIds.push({
                  id: item.resourceId,
                  futbinId: exactPlayers[0].id
                });
              }
              _core.Database.setJson('futbin-player-ids', futbinPlayerIds);
              return resolve('https://www.futbin.com/21/player/' + exactPlayers[0].id);
            } else if (exactPlayers.length > 1) {
              // Take first one, several players are returned more than once
              return resolve('https://www.futbin.com/21/player/' + exactPlayers[0].id);
            }

            return resolve(null); // TODO: what should we do if we find more than one?
          }
        });
      });
    }
  }]);

  return FutbinPlayerLinks;
}(_core.BaseScript);

new FutbinPlayerLinks(); // eslint-disable-line no-new

/***/ }),
/* 379 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstantBinConfirmSettings = undefined;

var _settingsEntry = __webpack_require__(136);

var _instantBinConfirm = __webpack_require__(380);

exports.InstantBinConfirmSettings = _settingsEntry.InstantBinConfirmSettings;


new _instantBinConfirm.InstantBinConfirm(); // eslint-disable-line no-new

/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstantBinConfirm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = __webpack_require__(18);

var _settingsEntry = __webpack_require__(136);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               gPopupClickShield
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               enums
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               controllers
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               utils
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var InstantBinConfirm = exports.InstantBinConfirm = function (_BaseScript) {
  _inherits(InstantBinConfirm, _BaseScript);

  function InstantBinConfirm() {
    _classCallCheck(this, InstantBinConfirm);

    var _this = _possibleConstructorReturn(this, (InstantBinConfirm.__proto__ || Object.getPrototypeOf(InstantBinConfirm)).call(this, _settingsEntry.InstantBinConfirmSettings.id));

    _this.unmodifiedConfirmation = utils.PopupManager.ShowConfirmation;
    return _this;
  }

  _createClass(InstantBinConfirm, [{
    key: 'activate',
    value: function activate(state) {
      _get(InstantBinConfirm.prototype.__proto__ || Object.getPrototypeOf(InstantBinConfirm.prototype), 'activate', this).call(this, state);
    }
  }, {
    key: 'onScreenRequest',
    value: function onScreenRequest(screenId) {
      var _this2 = this;

      _get(InstantBinConfirm.prototype.__proto__ || Object.getPrototypeOf(InstantBinConfirm.prototype), 'onScreenRequest', this).call(this, screenId);
      var settings = this.getSettings();

      utils.PopupManager.ShowConfirmation = function (dialog, amount, proceed, s) {
        var cancel = s;
        if (!utils.JS.isFunction(s)) {
          cancel = function cancel() {};
        }

        if (settings.isActive && dialog.title === utils.PopupManager.Confirmations.CONFIRM_BUY_NOW.title) {
          proceed();
          return;
        }
      const n = new EADialogViewController({
        dialogOptions: [dialog.buttonLabels[0],
          dialog.buttonLabels[1]],
        message: services.Localization.localize(dialog.message, amount),
        title: services.Localization.localize(dialog.title),
      });
        n.init();
        gPopupClickShield.setActivePopup(n);
        n.onExit.observe(_this2, function (e, t) {
          if (t !== enums.UIDialogOptions.CANCEL && t !== enums.UIDialogOptions.NO) {
            if (proceed) {
              proceed();
            } else if (cancel) {
              cancel();
            }
          }
        });
      };
    }
  }, {
    key: 'deactivate',
    value: function deactivate(state) {
      _get(InstantBinConfirm.prototype.__proto__ || Object.getPrototypeOf(InstantBinConfirm.prototype), 'deactivate', this).call(this, state);
      utils.PopupManager.ShowConfirmation = this.unmodifiedConfirmation;
    }
  }]);

  return InstantBinConfirm;
}(_core.BaseScript);

/***/ })
/******/ ]);