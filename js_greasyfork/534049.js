// ==UserScript==
// @name         Gateway Auto Login
// @name:zh-CN   网关自动登录
// @namespace    https://github.com/shangxueink
// @version      3.3
// @description  Quickly login to 172.19.0.1 gateway
// @description:zh-CN 快速自动登录 172.19.0.1 网关
// @author       shangxueink
// @license      MIT
// @match        http://172.19.0.1/*
// @match        http://192.168.255.4/*
// @grant        none
// @run-at       document-end
// @homepageURL  https://github.com/koakuuma/tampermonkey-scripts
// @supportURL   https://github.com/koakuuma/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/534049/Gateway%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/534049/Gateway%20Auto%20Login.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 34:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 283:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);
var hasOwn = __webpack_require__(9297);
var DESCRIPTORS = __webpack_require__(3724);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(350).CONFIGURABLE);
var inspectSource = __webpack_require__(3706);
var InternalStateModule = __webpack_require__(1181);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var hasOwn = __webpack_require__(9297);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 421:
/***/ ((module) => {


module.exports = {};


/***/ }),

/***/ 616:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 741:
/***/ ((module) => {


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);
var isCallable = __webpack_require__(4901);
var isPrototypeOf = __webpack_require__(1625);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 1072:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 1181:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_WEAK_MAP = __webpack_require__(8622);
var globalThis = __webpack_require__(4576);
var isObject = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(6699);
var hasOwn = __webpack_require__(9297);
var shared = __webpack_require__(7629);
var sharedKey = __webpack_require__(6119);
var hiddenKeys = __webpack_require__(421);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 1291:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var trunc = __webpack_require__(741);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 1625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 1828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var hasOwn = __webpack_require__(9297);
var toIndexedObject = __webpack_require__(5397);
var indexOf = (__webpack_require__(9617).indexOf);
var hiddenKeys = __webpack_require__(421);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 2195:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 2360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(8551);
var definePropertiesModule = __webpack_require__(6801);
var enumBugKeys = __webpack_require__(8727);
var hiddenKeys = __webpack_require__(421);
var html = __webpack_require__(397);
var documentCreateElement = __webpack_require__(4055);
var sharedKey = __webpack_require__(6119);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 2777:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var isObject = __webpack_require__(34);
var isSymbol = __webpack_require__(757);
var getMethod = __webpack_require__(5966);
var ordinaryToPrimitive = __webpack_require__(4270);
var wellKnownSymbol = __webpack_require__(8227);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 2796:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 2839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ 3392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.1.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var isCallable = __webpack_require__(4901);
var store = __webpack_require__(7629);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 3717:
/***/ ((__unused_webpack_module, exports) => {


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 3724:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 4055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var isObject = __webpack_require__(34);

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 4117:
/***/ ((module) => {


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 4270:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 4423:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var $includes = (__webpack_require__(9617).includes);
var fails = __webpack_require__(9039);
var addToUnscopables = __webpack_require__(6469);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ 4495:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(9519);
var fails = __webpack_require__(9039);
var globalThis = __webpack_require__(4576);

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 4576:
/***/ (function(module) {


var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 4901:
/***/ ((module) => {


// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4913:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var IE8_DOM_DEFINE = __webpack_require__(5917);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var anObject = __webpack_require__(8551);
var toPropertyKey = __webpack_require__(6969);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 5031:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var getBuiltIn = __webpack_require__(7751);
var uncurryThis = __webpack_require__(9504);
var getOwnPropertyNamesModule = __webpack_require__(8480);
var getOwnPropertySymbolsModule = __webpack_require__(3717);
var anObject = __webpack_require__(8551);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 5397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(7055);
var requireObjectCoercible = __webpack_require__(7750);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 5610:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(1291);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5745:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var store = __webpack_require__(7629);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 5917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);
var createElement = __webpack_require__(4055);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 5966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aCallable = __webpack_require__(9306);
var isNullOrUndefined = __webpack_require__(4117);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 6119:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var shared = __webpack_require__(5745);
var uid = __webpack_require__(3392);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 6198:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toLength = __webpack_require__(8014);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6395:
/***/ ((module) => {


module.exports = false;


/***/ }),

/***/ 6469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);
var create = __webpack_require__(2360);
var defineProperty = (__webpack_require__(4913).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 6518:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var getOwnPropertyDescriptor = (__webpack_require__(7347).f);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIn = __webpack_require__(6840);
var defineGlobalProperty = __webpack_require__(9433);
var copyConstructorProperties = __webpack_require__(7740);
var isForced = __webpack_require__(2796);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 6699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var definePropertyModule = __webpack_require__(4913);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 6801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var definePropertyModule = __webpack_require__(4913);
var anObject = __webpack_require__(8551);
var toIndexedObject = __webpack_require__(5397);
var objectKeys = __webpack_require__(1072);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 6823:
/***/ ((module) => {


var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 6840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);
var definePropertyModule = __webpack_require__(4913);
var makeBuiltIn = __webpack_require__(283);
var defineGlobalProperty = __webpack_require__(9433);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 6969:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toPrimitive = __webpack_require__(2777);
var isSymbol = __webpack_require__(757);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 6980:
/***/ ((module) => {


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 7040:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(4495);

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 7055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var classof = __webpack_require__(2195);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 7347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var call = __webpack_require__(9565);
var propertyIsEnumerableModule = __webpack_require__(8773);
var createPropertyDescriptor = __webpack_require__(6980);
var toIndexedObject = __webpack_require__(5397);
var toPropertyKey = __webpack_require__(6969);
var hasOwn = __webpack_require__(9297);
var IE8_DOM_DEFINE = __webpack_require__(5917);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 7629:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var IS_PURE = __webpack_require__(6395);
var globalThis = __webpack_require__(4576);
var defineGlobalProperty = __webpack_require__(9433);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.47.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru), 2025 CoreJS Company (core-js.io)',
  license: 'https://github.com/zloirock/core-js/blob/v3.47.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 7740:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var hasOwn = __webpack_require__(9297);
var ownKeys = __webpack_require__(5031);
var getOwnPropertyDescriptorModule = __webpack_require__(7347);
var definePropertyModule = __webpack_require__(4913);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 7750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isNullOrUndefined = __webpack_require__(4117);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 7751:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var isCallable = __webpack_require__(4901);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ 8014:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIntegerOrInfinity = __webpack_require__(1291);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 8227:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var shared = __webpack_require__(5745);
var hasOwn = __webpack_require__(9297);
var uid = __webpack_require__(3392);
var NATIVE_SYMBOL = __webpack_require__(4495);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 8480:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 8551:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(34);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 8622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var isCallable = __webpack_require__(4901);

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 8686:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 8727:
/***/ ((module) => {


// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 8773:
/***/ ((__unused_webpack_module, exports) => {


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 8981:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var requireObjectCoercible = __webpack_require__(7750);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 9039:
/***/ ((module) => {


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 9297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var toObject = __webpack_require__(8981);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 9306:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isCallable = __webpack_require__(4901);
var tryToString = __webpack_require__(6823);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 9433:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ 9504:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(616);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 9519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var userAgent = __webpack_require__(2839);

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 9565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(616);

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 9617:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toIndexedObject = __webpack_require__(5397);
var toAbsoluteIndex = __webpack_require__(5610);
var lengthOfArrayLike = __webpack_require__(6198);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4423);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);

// Gateway Auto Login - 网关自动登录

(function () {
  'use strict';

  // 从localStorage获取保存的配置
  const savedConfig = JSON.parse(localStorage.getItem('gatewayAutoLoginConfig') || '{}');

  // 配置项 - 合并默认配置和保存的配置
  const CONFIG = {
    autologin: savedConfig.autologin !== undefined ? savedConfig.autologin : true,
    // 是否启用自动登录，默认开启
    loginfo: savedConfig.loginfo !== undefined ? savedConfig.loginfo : false,
    // 是否开启日志调试模式，默认关闭
    username: savedConfig.username || '',
    // 教职工号或学号
    password: savedConfig.password || '',
    // 密码
    operator: savedConfig.operator !== undefined ? savedConfig.operator : 2,
    // 运营商选择: 0=校园网, 1=中国移动, 2=中国联通, 3=中国电信
    typingSpeed: savedConfig.typingSpeed !== undefined ? savedConfig.typingSpeed : 5,
    // 输入速度: 1=超慢, 2=慢, 3=中等, 4=稍快, 5=快, 6=极速
    refreshInterval: savedConfig.refreshInterval !== undefined ? savedConfig.refreshInterval : 60,
    // 刷新间隔，默认60秒
    maxRefreshAttempts: savedConfig.maxRefreshAttempts !== undefined ? savedConfig.maxRefreshAttempts : 30 // 最大刷新次数，默认3次
  };
  const OPERATORS = ['校园网', '中国移动', '中国联通', '中国电信'];

  // 添加刷新计时器变量和计数器
  let refreshTimer = null;
  let refreshAttempts = 0;

  // 启动自动刷新计时器的函数
  function startAutoRefreshTimer() {
    // 清除可能存在的旧计时器
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    // 重置计数器
    refreshAttempts = 0;

    // 设置新计时器
    scheduleNextRefresh();
    log(`自动刷新计时器已启动，间隔 ${CONFIG.refreshInterval} 秒`);
  }

  // 安排下一次刷新的函数
  function scheduleNextRefresh() {
    if (refreshAttempts >= CONFIG.maxRefreshAttempts) {
      log(`已达到最大刷新次数 (${CONFIG.maxRefreshAttempts})，停止自动刷新`);
      return;
    }
    refreshTimer = setTimeout(() => {
      // 检查是否已登录，如果已登录则不刷新
      if (checkLoginStatus()) {
        log('已成功登录，取消自动刷新');
        return;
      }
      refreshAttempts++;
      log(`执行第 ${refreshAttempts} 次自动刷新`);

      // 强制刷新页面
      window.location.reload();
    }, CONFIG.refreshInterval * 1000);
  }

  // 保存配置到localStorage
  function saveConfig() {
    localStorage.setItem('gatewayAutoLoginConfig', JSON.stringify(CONFIG));
    log('配置已保存');
  }
  function getTypingDelay() {
    let min, max;
    switch (CONFIG.typingSpeed) {
      case 1:
        min = 200;
        max = 400;
        break;
      // 超慢
      case 2:
        min = 100;
        max = 300;
        break;
      // 慢
      case 3:
        min = 50;
        max = 150;
        break;
      // 中等
      case 4:
        min = 20;
        max = 80;
        break;
      // 稍快
      case 5:
        min = 5;
        max = 15;
        break;
      // 快
      case 6:
        min = 1;
        max = 5;
        break;
      // 极速
      default:
        min = 20;
        max = 80;
        break;
      // 默认稍快
    }
    return {
      min: min,
      max: max
    };
  }
  function log(message) {
    if (CONFIG.loginfo) {
      console.log(`[Gateway Auto Login]: ${message}`);
    }
  }

  // 创建配置界面
  function createConfigInterface() {
    const configHTML = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; font-size: 18px;">
                <h2 style="text-align: center; color: #333;">网关自动登录 - 配置页</h2>
                <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">教职工号/学号:</label>
                        <input id="config-username" type="text" value="${CONFIG.username}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 16px;">密码:</label>
                        <input id="config-password" type="password" value="${CONFIG.password}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">运营商:</label>
                        <select id="config-operator" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px;">
                            <option value="0" ${CONFIG.operator === 0 ? 'selected' : ''}>校园网</option>
                            <option value="1" ${CONFIG.operator === 1 ? 'selected' : ''}>中国移动</option>
                            <option value="2" ${CONFIG.operator === 2 ? 'selected' : ''}>中国联通</option>
                            <option value="3" ${CONFIG.operator === 3 ? 'selected' : ''}>中国电信</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">输入速度:</label>
                        <select id="config-typing-speed" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px;">
                            <option value="1" ${CONFIG.typingSpeed === 1 ? 'selected' : ''}>超慢</option>
                            <option value="2" ${CONFIG.typingSpeed === 2 ? 'selected' : ''}>慢</option>
                            <option value="3" ${CONFIG.typingSpeed === 3 ? 'selected' : ''}>中等</option>
                            <option value="4" ${CONFIG.typingSpeed === 4 ? 'selected' : ''}>稍快</option>
                            <option value="5" ${CONFIG.typingSpeed === 5 ? 'selected' : ''}>快</option>
                            <option value="6" ${CONFIG.typingSpeed === 6 ? 'selected' : ''}>极速</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input id="config-autologin" type="checkbox" ${CONFIG.autologin ? 'checked' : ''} style="margin-right: 8px;">
                            <span>启用自动登录（请保持开启）</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input id="config-loginfo" type="checkbox" ${CONFIG.loginfo ? 'checked' : ''} style="margin-right: 8px;">
                            <span>启用调试日志（debug模式）</span>
                        </label>
                    </div>
     
                    <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">自动刷新间隔 (秒):</label>
        <input id="config-refresh-interval" type="number" value="${CONFIG.refreshInterval}" min="10" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px;">
    </div>
    <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">最大刷新次数:</label>
        <input id="config-max-refresh" type="number" value="${CONFIG.maxRefreshAttempts}" min="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 16px;">
    </div>
     
                    <button id="save-config" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">保存配置并登录</button>
                    <p style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">配置将保存在浏览器本地，下次访问时自动使用</p>
                </div>
            </div>
            `;
    document.body.innerHTML = configHTML;

    // 添加保存配置的事件监听
    document.getElementById('save-config').addEventListener('click', function () {
      CONFIG.username = document.getElementById('config-username').value;
      CONFIG.password = document.getElementById('config-password').value;
      CONFIG.operator = parseInt(document.getElementById('config-operator').value);
      CONFIG.typingSpeed = parseInt(document.getElementById('config-typing-speed').value);
      CONFIG.autologin = document.getElementById('config-autologin').checked;
      CONFIG.loginfo = document.getElementById('config-loginfo').checked;
      CONFIG.refreshInterval = parseInt(document.getElementById('config-refresh-interval').value) || 60;
      CONFIG.maxRefreshAttempts = parseInt(document.getElementById('config-max-refresh').value) || 3;

      // 确保刷新间隔不小于10秒
      if (CONFIG.refreshInterval < 10) {
        CONFIG.refreshInterval = 10;
      }
      saveConfig();

      // 重新加载页面以应用新配置
      window.location.reload();
    });
  }
  function simulateRealTyping(element, text) {
    return new Promise(resolve => {
      element.value = '';
      element.focus();
      element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      const delay = getTypingDelay();
      if (CONFIG.typingSpeed === 6) {
        // 极速模式
        element.value = text;
        element.dispatchEvent(new Event('input', {
          bubbles: true,
          cancelable: true
        }));
        element.dispatchEvent(new Event('change', {
          bubbles: true,
          cancelable: true
        }));
        setTimeout(resolve, 50);
        return;
      }
      let i = 0;
      function typeNextChar() {
        if (i < text.length) {
          const char = text[i];
          const currentValue = element.value;
          element.value = currentValue + char;
          const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            data: char,
            inputType: 'insertText',
            view: window
          });
          element.dispatchEvent(inputEvent);
          i++;
          setTimeout(typeNextChar, delay.min + Math.random() * (delay.max - delay.min));
        } else {
          const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
          });
          element.dispatchEvent(changeEvent);
          resolve();
        }
      }
      typeNextChar();
    });
  }
  async function autoLogin() {
    log('自动登录脚本开始运行...');

    // 检查是否启用自动登录
    if (!CONFIG.autologin) {
      log('自动登录已关闭，脚本停止运行。');
      return;
    }

    // 检查账号密码是否为空
    if (!CONFIG.username || !CONFIG.password) {
      log('账号或密码未配置，显示配置界面');
      createConfigInterface();
      return; // 停止执行后续登录逻辑
    }
    const successElement = document.querySelector('div[name="PageTips"]');
    if (successElement && successElement.textContent.includes('您已经成功登录')) {
      log('已经登录，无需使用快速登录');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    const usernameInput = document.querySelector('input[name="DDDDD"][type="text"][maxlength="30"]');
    const passwordInput = document.querySelector('input[name="upass"][type="password"][maxlength="30"]');
    const operatorSelect = document.querySelector('select[name="ISP_select"]');
    const loginButton = document.querySelector('input[name="0MKKey"][type="button"][value="登录"]');
    if (!usernameInput || !passwordInput || !operatorSelect || !loginButton) {
      console.error('未找到必要的表单元素，请检查页面结构是否变化');
      return;
    }
    log('已找到所有表单元素，开始填写...');
    log('正在输入用户名...');
    await simulateRealTyping(usernameInput, CONFIG.username);
    await new Promise(resolve => setTimeout(resolve, 100));
    log('正在输入密码...');
    await simulateRealTyping(passwordInput, CONFIG.password);
    await new Promise(resolve => setTimeout(resolve, 100));
    log('正在选择运营商...');
    if (CONFIG.operator >= 0 && CONFIG.operator < OPERATORS.length) {
      const operatorText = OPERATORS[CONFIG.operator];
      let operatorFound = false;
      for (let i = 0; i < operatorSelect.options.length; i++) {
        if (operatorSelect.options[i].text === operatorText) {
          operatorSelect.selectedIndex = i;
          operatorFound = true;
          const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
          });
          operatorSelect.dispatchEvent(changeEvent);
          log(`已选择运营商: ${operatorText}`);
          break;
        }
      }
      if (!operatorFound) {
        log('未找到指定的运营商，将使用默认选项');
      }
    } else {
      log('运营商配置错误，将使用默认选项');
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    log('正在点击登录按钮...');
    loginButton.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    log('登录请求已发送，请等待响应...');
  }

  // 添加一个配置按钮到页面上
  function addConfigButton() {
    let retryCount = 0;
    const maxRetries = 10; // 最大重试次数

    function attemptToAddButton() {
      // 使用更宽松的选择器
      const loginButton = document.querySelector('input[name="0MKKey"][type="button"][value="登录"]');
      const logoutButton = document.querySelector('input[name="logout"][type="button"][value="注  销"]');

      // 确定参考按钮
      const referenceButton = loginButton || logoutButton;
      if (!referenceButton) {
        retryCount++;
        log(`未找到登录或注销按钮，重试中... (第 ${retryCount} 次)`);
        if (retryCount >= maxRetries) {
          console.error('多次尝试后仍未找到登录或注销按钮，停止添加配置按钮');
          return;
        }
        setTimeout(attemptToAddButton, 1000); // 每1秒重试一次
        return;
      }

      // 创建配置按钮，复制参考按钮的样式
      const button = document.createElement('input');
      button.type = 'button';
      button.value = '配置自动登录';

      // 复制参考按钮的所有样式
      const computedStyle = window.getComputedStyle(referenceButton);
      for (let i = 0; i < computedStyle.length; i++) {
        const prop = computedStyle[i];
        button.style[prop] = computedStyle.getPropertyValue(prop);
      }

      // 设置按钮位置 - 在参考按钮上方
      let topOffset = loginButton ? 216 : 50; // 根据按钮类型设置不同的偏移量
      const topPosition = parseInt(referenceButton.style.top, 10) - topOffset; // 在原按钮上方 topOffset px

      button.style.position = 'absolute';
      button.style.top = `${topPosition}px`;
      button.style.left = referenceButton.style.left;
      button.style.width = referenceButton.style.width;
      button.style.height = referenceButton.style.height;

      // 设置不同的背景色以区分
      button.style.backgroundColor = '#2196F3'; // 蓝色背景

      // 确保按钮置顶
      button.style.zIndex = '1000'; // 或者更高的值，确保不会被遮挡

      // 添加点击事件
      button.addEventListener('click', function () {
        createConfigInterface();
      });

      // 添加到参考按钮的父元素中
      referenceButton.parentNode.insertBefore(button, referenceButton);
      log('成功添加配置按钮');
    }

    // 初始延迟后尝试添加按钮
    setTimeout(attemptToAddButton, 500);
  }

  // 检查登录状态并显示通知
  function checkLoginStatus() {
    const successElement = document.querySelector('div[name="PageTips"]');
    if (successElement && successElement.textContent.includes('您已经成功登录')) {
      showNotification('已成功登录', 'success');
      return true;
    }
    return false;
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '60px';
    notification.style.right = '10px';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.fontSize = '14px';
    notification.style.transition = 'opacity 0.5s ease-in-out';
    if (type === 'success') {
      notification.style.backgroundColor = '#4CAF50';
      notification.style.color = 'white';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#f44336';
      notification.style.color = 'white';
    } else {
      notification.style.backgroundColor = '#2196F3';
      notification.style.color = 'white';
    }
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        // 添加检查，确保元素仍然是 document.body 的子元素
        if (notification.parentNode === document.body) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }

  // 初始化函数
  function init() {
    log('脚本初始化...');

    // 启动自动刷新计时器
    startAutoRefreshTimer();
    // 检查当前URL，判断是哪种登录页面
    const currentURL = window.location.href;

    // 检查是否是第二种登录页面 (192.168.255.4)
    if (currentURL.includes('192.168.255.4')) {
      log('检测到第二种登录页面');
      handleSecondLoginPageType();
      return;
    }

    // 第一种登录页面 (172.19.0.1)
    // 先检查是否已经登录
    if (checkLoginStatus()) {
      log('已经登录，添加配置按钮');
      addConfigButton();
      return;
    }

    // 如果未登录且有配置，尝试自动登录
    if (CONFIG.username && CONFIG.password) {
      log('发现有效配置，尝试自动登录');
      autoLogin().catch(error => {
        console.error('自动登录出错:', error);
        showNotification('自动登录失败，请手动登录', 'error');
      });
    } else {
      log('未找到有效配置，显示配置界面');
      createConfigInterface();
    }

    // 无论如何都添加配置按钮
    addConfigButton();
  }

  // 处理第二种登录页面 (192.168.255.4)
  function handleSecondLoginPageType() {
    log('处理第二种登录页面类型');
    // 检查是否已经登录
    if (checkSecondLoginPageStatus()) {
      log('已经登录，添加配置按钮');
      addConfigButtonForSecondPage();
      return;
    }

    // 如果未登录且有配置，尝试自动登录
    if (CONFIG.username && CONFIG.password) {
      log('发现有效配置，尝试自动登录');
      autoLoginForSecondPage().catch(error => {
        console.error('自动登录出错:', error);
        showNotification('自动登录失败，请手动登录', 'error');
      });
    } else {
      log('未找到有效配置，显示配置界面');
      createConfigInterface();
    }

    // 添加配置按钮
    addConfigButtonForSecondPage();
  }

  // 检查第二种登录页面的登录状态
  function checkSecondLoginPageStatus() {
    const successElement = document.querySelector('div[name="PageTips"]');
    if (successElement && successElement.textContent.includes('您已经成功登录')) {
      showNotification('已成功登录', 'success');
      return true;
    }
    return false;
  }

  // 第二种登录页面的自动登录
  async function autoLoginForSecondPage() {
    log('第二种登录页面自动登录脚本开始运行...');

    // 检查是否启用自动登录
    if (!CONFIG.autologin) {
      log('自动登录已关闭，脚本停止运行。');
      return;
    }

    // 检查账号密码是否为空
    if (!CONFIG.username || !CONFIG.password) {
      log('账号或密码未配置，显示配置界面');
      createConfigInterface();
      return; // 停止执行后续登录逻辑
    }
    await new Promise(resolve => setTimeout(resolve, 500));

    // 第二种页面的元素选择器
    const usernameInput = document.querySelector('input[name="DDDDD"][maxlength="30"][placeholder="账号"]');
    const passwordInput = document.querySelector('input[name="upass"][maxlength="30"][placeholder="密码"]');
    const loginButton = document.querySelector('input[name="0MKKey"][value="登录"]');
    if (!usernameInput || !passwordInput || !loginButton) {
      console.error('未找到必要的表单元素，请检查页面结构是否变化');
      return;
    }
    log('已找到所有表单元素，开始填写...');
    log('正在输入用户名...');
    await simulateRealTyping(usernameInput, CONFIG.username);
    await new Promise(resolve => setTimeout(resolve, 100));
    log('正在输入密码...');
    await simulateRealTyping(passwordInput, CONFIG.password);
    await new Promise(resolve => setTimeout(resolve, 200));

    // 第二种页面没有运营商选择，直接点击登录

    log('正在点击登录按钮...');
    loginButton.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    log('登录请求已发送，请等待响应...');
  }

  // 为第二种登录页面添加配置按钮
  function addConfigButtonForSecondPage() {
    let retryCount = 0;
    const maxRetries = 10; // 最大重试次数

    function attemptToAddButton() {
      // 使用更宽松的选择器
      const loginButton = document.querySelector('input[name="0MKKey"][value="登录"]');
      const logoutButton = document.querySelector('input[name="logout"][value="注  销"]');

      // 确定参考按钮
      const referenceButton = loginButton || logoutButton;
      if (!referenceButton) {
        retryCount++;
        log(`未找到登录或注销按钮，重试中... (第 ${retryCount} 次)`);
        if (retryCount >= maxRetries) {
          console.error('多次尝试后仍未找到登录或注销按钮，停止添加配置按钮');
          return;
        }
        setTimeout(attemptToAddButton, 1000); // 每1秒重试一次
        return;
      }

      // 创建配置按钮，复制参考按钮的样式
      const button = document.createElement('input');
      button.type = 'button';
      button.value = '配置自动登录';

      // 复制参考按钮的所有样式
      const computedStyle = window.getComputedStyle(referenceButton);
      for (let i = 0; i < computedStyle.length; i++) {
        const prop = computedStyle[i];
        button.style[prop] = computedStyle.getPropertyValue(prop);
      }

      // 设置按钮位置 - 在参考按钮上方
      const parentElement = referenceButton.parentNode;
      const parentRect = parentElement.getBoundingClientRect();
      const buttonRect = referenceButton.getBoundingClientRect();
      let topOffset = -50; // 默认偏移量

      button.style.position = 'absolute';
      button.style.top = `${buttonRect.top - parentRect.top - topOffset}px`;
      button.style.left = referenceButton.style.left;
      button.style.width = referenceButton.style.width;
      button.style.height = referenceButton.style.height;

      // 设置不同的背景色以区分
      button.style.backgroundColor = '#2196F3'; // 蓝色背景

      // 确保按钮置顶
      button.style.zIndex = '1000'; // 或者更高的值，确保不会被遮挡

      // 添加点击事件
      button.addEventListener('click', function () {
        createConfigInterface();
      });

      // 添加到参考按钮的父元素中
      referenceButton.parentNode.insertBefore(button, referenceButton);
      log('成功添加配置按钮');
    }

    // 初始延迟后尝试添加按钮
    setTimeout(attemptToAddButton, 500);
  }

  // 在页面加载完成后运行初始化函数
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
/******/ })()
;