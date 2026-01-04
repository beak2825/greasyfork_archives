// ==UserScript==
// @name         Koishi Market Registry Redirector
// @namespace    https://github.com/shangxueink
// @version      4.5
// @description  将 Koishi 市场注册表请求重定向到多个备用镜像源，支持自动重试、单独配置每个镜像源的代理请求解决CORS问题，并修复时间显示问题，镜像地址可点击复制，增加返回顶部按钮。
// @author       shangxueink
// @license      MIT
// @match        https://koishi.chat/zh-CN/market/*
// @match        https://koishi.chat/market/*
// @match        https://koishi.chat/market?keyword=*
// @grant        none
// @run-at       document-start
// @icon         https://koishi.chat/logo.png
// @homepageURL  https://github.com/koakuuma/tampermonkey-scripts
// @supportURL   https://github.com/koakuuma/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/533105/Koishi%20Market%20Registry%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/533105/Koishi%20Market%20Registry%20Redirector.meta.js
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

/***/ 67:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(7145);


/***/ }),

/***/ 81:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var tryToString = __webpack_require__(6823);
var getIteratorMethod = __webpack_require__(851);

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
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

/***/ 537:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NativePromiseConstructor = __webpack_require__(550);
var checkCorrectnessOfIteration = __webpack_require__(4428);
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(916).CONSTRUCTOR);

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ 550:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);

module.exports = globalThis.Promise;


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

/***/ 655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(6955);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


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

/***/ 747:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var createNonEnumerableProperty = __webpack_require__(6699);
var clearErrorStack = __webpack_require__(6193);
var ERROR_STACK_INSTALLABLE = __webpack_require__(4659);

// non-standard V8
// eslint-disable-next-line es/no-nonstandard-error-properties -- safe
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
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

/***/ 851:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classof = __webpack_require__(6955);
var getMethod = __webpack_require__(5966);
var isNullOrUndefined = __webpack_require__(4117);
var Iterators = __webpack_require__(6269);
var wellKnownSymbol = __webpack_require__(8227);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ 916:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var NativePromiseConstructor = __webpack_require__(550);
var isCallable = __webpack_require__(4901);
var isForced = __webpack_require__(2796);
var inspectSource = __webpack_require__(3706);
var wellKnownSymbol = __webpack_require__(8227);
var ENVIRONMENT = __webpack_require__(4215);
var IS_PURE = __webpack_require__(6395);
var V8_VERSION = __webpack_require__(9519);

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(globalThis.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ 1034:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var hasOwn = __webpack_require__(9297);
var isPrototypeOf = __webpack_require__(1625);
var regExpFlagsDetection = __webpack_require__(5213);
var regExpFlagsGetterImplementation = __webpack_require__(7979);

var RegExpPrototype = RegExp.prototype;

module.exports = regExpFlagsDetection.correct ? function (it) {
  return it.flags;
} : function (it) {
  return (!regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, 'flags'))
    ? call(regExpFlagsGetterImplementation, it)
    : it.flags;
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

/***/ 1103:
/***/ ((module) => {


module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
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

/***/ 2140:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
// eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


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

/***/ 2211:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


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

/***/ 2478:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var toObject = __webpack_require__(8981);

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
// eslint-disable-next-line redos/no-vulnerable -- safe
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var toString = __webpack_require__(655);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 2652:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var bind = __webpack_require__(6080);
var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var tryToString = __webpack_require__(6823);
var isArrayIteratorMethod = __webpack_require__(4209);
var lengthOfArrayLike = __webpack_require__(6198);
var isPrototypeOf = __webpack_require__(1625);
var getIterator = __webpack_require__(81);
var getIteratorMethod = __webpack_require__(851);
var iteratorClose = __webpack_require__(9539);

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal');
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
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

/***/ 2787:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var hasOwn = __webpack_require__(9297);
var isCallable = __webpack_require__(4901);
var toObject = __webpack_require__(8981);
var sharedKey = __webpack_require__(6119);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(2211);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
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

/***/ 2967:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(6706);
var isObject = __webpack_require__(34);
var requireObjectCoercible = __webpack_require__(7750);
var aPossiblePrototype = __webpack_require__(3506);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


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

/***/ 3506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isPossiblePrototype = __webpack_require__(3925);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 3518:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var getBuiltIn = __webpack_require__(7751);
var newPromiseCapabilityModule = __webpack_require__(6043);
var perform = __webpack_require__(1103);
var iterate = __webpack_require__(2652);
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(537);

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 3635:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var globalThis = __webpack_require__(4576);

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = globalThis.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.test('\n') && re.flags === 's');
});


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

/***/ 3925:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(34);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


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

/***/ 4209:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);
var Iterators = __webpack_require__(6269);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 4215:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* global Bun, Deno -- detection */
var globalThis = __webpack_require__(4576);
var userAgent = __webpack_require__(2839);
var classof = __webpack_require__(2195);

var userAgentStartsWith = function (string) {
  return userAgent.slice(0, string.length) === string;
};

module.exports = (function () {
  if (userAgentStartsWith('Bun/')) return 'BUN';
  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
  if (userAgentStartsWith('Deno/')) return 'DENO';
  if (userAgentStartsWith('Node.js/')) return 'NODE';
  if (globalThis.Bun && typeof Bun.version == 'string') return 'BUN';
  if (globalThis.Deno && typeof Deno.version == 'object') return 'DENO';
  if (classof(globalThis.process) === 'process') return 'NODE';
  if (globalThis.window && globalThis.document) return 'BROWSER';
  return 'REST';
})();


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

/***/ 4428:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var wellKnownSymbol = __webpack_require__(8227);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


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

/***/ 4659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


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

/***/ 5213:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var globalThis = __webpack_require__(4576);
var fails = __webpack_require__(9039);

// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
var RegExp = globalThis.RegExp;

var FLAGS_GETTER_IS_CORRECT = !fails(function () {
  var INDICES_SUPPORT = true;
  try {
    RegExp('.', 'd');
  } catch (error) {
    INDICES_SUPPORT = false;
  }

  var O = {};
  // modern V8 bug
  var calls = '';
  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

  var addGetter = function (key, chr) {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(O, key, { get: function () {
      calls += chr;
      return true;
    } });
  };

  var pairs = {
    dotAll: 's',
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y'
  };

  if (INDICES_SUPPORT) pairs.hasIndices = 'd';

  for (var key in pairs) addGetter(key, pairs[key]);

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var result = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call(O);

  return result !== expected || calls !== expected;
});

module.exports = { correct: FLAGS_GETTER_IS_CORRECT };


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

/***/ 5440:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var apply = __webpack_require__(8745);
var call = __webpack_require__(9565);
var uncurryThis = __webpack_require__(9504);
var fixRegExpWellKnownSymbolLogic = __webpack_require__(9228);
var fails = __webpack_require__(9039);
var anObject = __webpack_require__(8551);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var toIntegerOrInfinity = __webpack_require__(1291);
var toLength = __webpack_require__(8014);
var toString = __webpack_require__(655);
var requireObjectCoercible = __webpack_require__(7750);
var advanceStringIndex = __webpack_require__(7829);
var getMethod = __webpack_require__(5966);
var getSubstitution = __webpack_require__(2478);
var getRegExpFlags = __webpack_require__(1034);
var regExpExec = __webpack_require__(6682);
var wellKnownSymbol = __webpack_require__(8227);

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = isObject(searchValue) ? getMethod(searchValue, REPLACE) : undefined;
      return replacer
        ? call(replacer, searchValue, O, replaceValue)
        : call(nativeReplace, toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString(replaceValue);

      var flags = toString(getRegExpFlags(rx));
      var global = stringIndexOf(flags, 'g') !== -1;
      var fullUnicode;
      if (global) {
        fullUnicode = stringIndexOf(flags, 'u') !== -1;
        rx.lastIndex = 0;
      }

      var results = [];
      var result;
      while (true) {
        result = regExpExec(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        var replacement;
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          replacement = toString(apply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }

      return accumulatedResult + stringSlice(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);


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

/***/ 6043:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var aCallable = __webpack_require__(9306);

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 6080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(7476);
var aCallable = __webpack_require__(9306);
var NATIVE_BIND = __webpack_require__(616);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
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

/***/ 6193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
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

/***/ 6269:
/***/ ((module) => {


module.exports = {};


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

/***/ 6682:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var isCallable = __webpack_require__(4901);
var classof = __webpack_require__(2195);
var regexpExec = __webpack_require__(7323);

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw new $TypeError('RegExp#exec called on incompatible receiver');
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

/***/ 6706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var aCallable = __webpack_require__(9306);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
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

/***/ 6955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var TO_STRING_TAG_SUPPORT = __webpack_require__(2140);
var isCallable = __webpack_require__(4901);
var classofRaw = __webpack_require__(2195);
var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
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

/***/ 7145:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var isPrototypeOf = __webpack_require__(1625);
var getPrototypeOf = __webpack_require__(2787);
var setPrototypeOf = __webpack_require__(2967);
var copyConstructorProperties = __webpack_require__(7740);
var create = __webpack_require__(2360);
var createNonEnumerableProperty = __webpack_require__(6699);
var createPropertyDescriptor = __webpack_require__(6980);
var installErrorCause = __webpack_require__(7584);
var installErrorStack = __webpack_require__(747);
var iterate = __webpack_require__(2652);
var normalizeStringArgument = __webpack_require__(2603);
var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var push = [].push;

var $AggregateError = function AggregateError(errors, message /* , options */) {
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf(new $Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $AggregateError, that.stack, 1);
  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  var errorsArray = [];
  iterate(errors, push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
else copyConstructorProperties($AggregateError, $Error, { name: true });

var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({ global: true, constructor: true, arity: 2 }, {
  AggregateError: $AggregateError
});


/***/ }),

/***/ 7323:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(9565);
var uncurryThis = __webpack_require__(9504);
var toString = __webpack_require__(655);
var regexpFlags = __webpack_require__(7979);
var stickyHelpers = __webpack_require__(8429);
var shared = __webpack_require__(5745);
var create = __webpack_require__(2360);
var getInternalState = (__webpack_require__(1181).get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(3635);
var UNSUPPORTED_NCG = __webpack_require__(8814);

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


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

/***/ 7476:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var classofRaw = __webpack_require__(2195);
var uncurryThis = __webpack_require__(9504);

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ 7495:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


var $ = __webpack_require__(6518);
var exec = __webpack_require__(7323);

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ 7575:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(3518);


/***/ }),

/***/ 7584:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var isObject = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(6699);

// `InstallErrorCause` abstract operation
// https://tc39.es/ecma262/#sec-installerrorcause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
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

/***/ 7829:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var charAt = (__webpack_require__(8183).charAt);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 7979:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var anObject = __webpack_require__(8551);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
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

/***/ 8183:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var uncurryThis = __webpack_require__(9504);
var toIntegerOrInfinity = __webpack_require__(1291);
var toString = __webpack_require__(655);
var requireObjectCoercible = __webpack_require__(7750);

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
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

/***/ 8429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var globalThis = __webpack_require__(4576);

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = globalThis.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') !== null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') !== null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
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

/***/ 8745:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var NATIVE_BIND = __webpack_require__(616);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


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

/***/ 8814:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var fails = __webpack_require__(9039);
var globalThis = __webpack_require__(4576);

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = globalThis.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


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

/***/ 9228:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(7495);
var call = __webpack_require__(9565);
var defineBuiltIn = __webpack_require__(6840);
var regexpExec = __webpack_require__(7323);
var fails = __webpack_require__(9039);
var wellKnownSymbol = __webpack_require__(8227);
var createNonEnumerableProperty = __webpack_require__(6699);

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegExp methods
    var O = {};
    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) !== 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      var constructor = {};
      // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
      constructor[SPECIES] = function () { return re; };
      re = { constructor: constructor, flags: '' };
      // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () {
      execCalled = true;
      return null;
    };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: call(nativeRegExpMethod, regexp, str, arg2) };
        }
        return { done: true, value: call(nativeMethod, str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
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

/***/ 9539:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var getMethod = __webpack_require__(5966);

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


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


/***/ }),

/***/ 9806:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {


// TODO: Remove from `core-js@4`
__webpack_require__(67);


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
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7495);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5440);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_esnext_aggregate_error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9806);
/* harmony import */ var core_js_modules_esnext_aggregate_error_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_aggregate_error_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_esnext_promise_any_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7575);
/* harmony import */ var core_js_modules_esnext_promise_any_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_promise_any_js__WEBPACK_IMPORTED_MODULE_4__);





// Koishi Market Registry Redirector
// 将 Koishi 市场注册表请求重定向到多个备用镜像源

// 类型定义

(function () {
  'use strict';

  const normalizeUrl = url => {
    return url.replace(/\/+$/, '');
  };
  const DEFAULT_CONFIG = {
    sourceUrl: normalizeUrl('registry.koishi.chat/index.json'),
    mirrorUrls: [{
      url: "https://gitee.com/shangxueink/koishi-registry-aggregator/raw/gh-pages/market.json",
      useProxy: true
    }, {
      url: "https://koishi-shangxue-plugins.github.io/koishi-registry-aggregator/market.json",
      useProxy: false
    }, {
      url: 'https://koishi-registry.yumetsuki.moe/index.json',
      useProxy: false
    }
    // 这两个有时候更新也太慢了
    // { url: "https://cdn.jsdmirror.com/gh/koishi-shangxue-plugins/koishi-registry-aggregator@gh-pages/market.json", useProxy: false },
    // { url: "https://cdn.jsdelivr.net/gh/koishi-shangxue-plugins/koishi-registry-aggregator@gh-pages/market.json", useProxy: false },
    ],
    currentMirrorIndex: 0,
    debug: false,
    requestTimeout: 5000,
    disableCache: true,
    useProxy: true,
    proxyUrl: 'https://web-proxy.apifox.cn/api/v1/request'
  };
  let savedConfig = JSON.parse(localStorage.getItem('koishiMarketConfig') || '{}');
  let CONFIG = {
    ...DEFAULT_CONFIG,
    ...savedConfig
  };
  let registryData = null;
  let configUIOpen = false;
  let configButtonAdded = false;

  // 声明 log 和 error 函数
  const log = function (...args) {
    if (CONFIG.debug) {
      console.log('[Koishi Market Registry Redirector]', ...args);
    }
  };
  const error = function (...args) {
    console.error('[Koishi Market Registry Redirector ERROR]', ...args);
  };

  // Check if the script should be disabled for this session
  if (sessionStorage.getItem('disableMarketRedirectorOnce') === 'true') {
    sessionStorage.removeItem('disableMarketRedirectorOnce');
    log('[Koishi Market Registry Redirector] Script disabled for this session. It will be re-enabled on the next navigation.');
    return; // Stop script execution
  }
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  if (currentPath.startsWith('/market') && !currentPath.startsWith('/zh-CN/market')) {
    const newUrl = window.location.origin + '/zh-CN' + currentPath + currentSearch;
    window.location.replace(newUrl);
    return;
  }
  function createConfigUI() {
    var _document$getElementB, _document$getElementB2, _document$getElementB5, _document$getElementB6;
    if (!configUIOpen) return;

    // 创建配置容器（使用页面主题变量）
    const container = document.createElement('div');
    container.className = 'vp-doc';
    container.style.padding = '2rem';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.width = '90%';
    container.style.maxWidth = '700px';
    container.style.maxHeight = '80%';
    container.style.backgroundColor = 'var(--vp-c-bg)'; // 使用主题背景色
    container.style.color = 'var(--vp-c-text)'; // 使用主题文字颜色
    container.style.zIndex = '1000';
    container.style.overflow = 'auto';
    container.style.boxSizing = 'border-box';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    container.style.border = '1px solid var(--vp-c-divider)'; // 使用主题边框颜色

    // 创建右上角关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<span style="transform: translateY(-1.8px); display: inline-block;">×</span>';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.width = '80px';
    closeButton.style.height = '50px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#ff4757';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '40px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '24px';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.lineHeight = '1';
    closeButton.style.zIndex = '1001';
    closeButton.title = '关闭配置';

    // 添加悬停效果
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#ff3742';
      closeButton.style.transform = 'scale(1.1)';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = '#ff4757';
      closeButton.style.transform = 'scale(1)';
    });
    container.appendChild(closeButton);

    // 遮罩层保持原样
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';

    // 镜像源列表
    const mirrorSection = document.createElement('section');
    mirrorSection.innerHTML = `
            <h2>镜像源列表</h2>
            <p>请确保地址正确，否则会导致插件市场无法正常加载。</p>
            <div id="mirror-list" style="margin-bottom: 1rem;"></div>
            <button id="add-mirror" class="VPLink link button" style="margin-bottom: 2rem;">+ 添加镜像源</button>
    
        `;
    container.appendChild(mirrorSection);

    // 其他配置
    const configSection = document.createElement('section');
    configSection.innerHTML = `
            <h2>高级配置</h2>
            <div class="form-item">
                <label for="timeout">请求超时时间（毫秒）</label>
                <input type="number" id="timeout" value="${CONFIG.requestTimeout}" min="1000" style="border: 1px solid #ccc; padding: 0.5rem; width: 100%; box-sizing: border-box;">
                <p>请求超时时间，单位毫秒，建议不要设置过小。</p>
            </div>
            <div class="form-item">
                <label for="disableCache"><input type="checkbox" id="disableCache" ${CONFIG.disableCache ? 'checked' : ''}> 禁用从磁盘缓存</label>
                <p>启用后，请求镜像源时将禁用浏览器缓存，确保获取最新数据。</p>
            </div>
            <div class="form-item">
                <label for="useProxy"><input type="checkbox" id="useProxy" ${CONFIG.useProxy ? 'checked' : ''}> 启用代理请求</label>
                <p>启用代理请求可以解决CORS跨域问题，提高镜像源的兼容性。</p>
            </div>
            <div class="form-item">
                <label for="proxyUrl">代理服务器地址</label>
                <input type="text" id="proxyUrl" value="${CONFIG.proxyUrl}" style="border: 1px solid #ccc; padding: 0.5rem; width: 100%; box-sizing: border-box;">
                <p>代理服务器的URL地址，用于转发请求以避免CORS问题。非开发人员请勿修改。</p>
            </div>
            <div class="form-item">
                <label for="debug"><input type="checkbox" id="debug" ${CONFIG.debug ? 'checked' : ''}> 启用调试模式</label>
                <p>启用调试模式后，会在控制台输出更多信息，方便排查问题。</p>
                <p>注意更改配置项后，需刷新页面生效。</p>
            </div>
        `;
    container.appendChild(configSection);

    // 重置按钮
    const resetButtonGroup = document.createElement('div');
    resetButtonGroup.style.marginTop = '2rem';
    resetButtonGroup.style.display = 'flex';
    resetButtonGroup.style.width = '100%';
    resetButtonGroup.innerHTML = `
            <button id="reset-btn" class="VPLink link button" style="width: 100%;">重置为默认配置</button>
        `;
    container.appendChild(resetButtonGroup);

    // 操作按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.style.marginTop = '1rem';
    buttonGroup.style.display = 'flex';
    buttonGroup.style.width = '100%';
    buttonGroup.innerHTML = `
            <button id="cancel-btn" class="VPLink link button" style="width: 50%; margin-right: 0.5rem;">关闭配置</button>
            <button id="save-btn" class="VPLink link button" style="width: 50%; margin-left: 0.5rem;">保存配置</button>
        `;
    container.appendChild(buttonGroup);

    // 插入到页面
    document.body.appendChild(overlay);
    document.body.appendChild(container);

    // 初始状态设为透明，准备淡入动画
    container.style.opacity = '0';
    container.style.transform = 'translate(-50%, -50%) scale(0.95)';
    overlay.style.opacity = '0';

    // 禁用背景页面滚动
    document.body.style.overflow = 'hidden';

    // 触发淡入动画
    setTimeout(() => {
      container.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      overlay.style.transition = 'opacity 0.2s ease-out';
      container.style.opacity = '1';
      container.style.transform = 'translate(-50%, -50%) scale(1)';
      overlay.style.opacity = '1';
    }, 10);

    // 点击遮罩层关闭配置UI
    overlay.addEventListener('click', () => {
      closeConfigUI();
    });

    // 阻止点击配置容器时关闭UI
    container.addEventListener('click', e => {
      e.stopPropagation();
    });

    // 阻止滚动穿透到背景页面
    container.addEventListener('wheel', e => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = container;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      // 如果向上滚动且已经到顶部，或向下滚动且已经到底部，阻止事件冒泡
      if (isScrollingUp && scrollTop === 0 || isScrollingDown && scrollTop + clientHeight >= scrollHeight) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, {
      passive: false
    });

    // 初始化镜像源列表
    const mirrorList = document.getElementById('mirror-list');
    if (!mirrorList) return;
    function renderMirrorList() {
      if (!mirrorList) return;
      mirrorList.innerHTML = CONFIG.mirrorUrls.map((mirror, index) => `
                <div class="mirror-item" style="margin-bottom: 1rem; display: flex; flex-direction: column; align-items: stretch; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: bold; color: var(--vp-c-text);"></label>
                        <input type="text" value="${mirror.url}" data-field="url" style="width: 100%; border: 1px solid #ccc; padding: 0.5rem; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        <label style="display: flex; align-items: center; color: var(--vp-c-text);">
                            <input type="checkbox" ${mirror.useProxy ? 'checked' : ''} data-field="useProxy" style="margin-right: 0.5rem;">
                            使用代理请求
                        </label>
                        <p style="margin: 0.25rem 0 0 1.5rem; font-size: 0.8rem; color: var(--vp-c-text-2);">非开发人员，请勿修改代理开关！</p>
                    </div>
                    <div style="display: flex; width: 100%;">
                        <button class="move-up VPLink link button" data-index="${index}" style="width: 33.33%; margin-right: 0.25rem;">↑</button>
                        <button class="move-down VPLink link button" data-index="${index}" style="width: 33.33%; margin: 0 0.125rem;">↓</button>
                        <button class="remove-mirror VPLink link button" data-index="${index}" style="width: 33.33%; margin-left: 0.25rem;">×</button>
                    </div>
                </div>
            `).join('');
    }
    renderMirrorList();

    // 事件监听
    (_document$getElementB = document.getElementById('add-mirror')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', () => {
      CONFIG.mirrorUrls.push({
        url: '',
        useProxy: false
      });
      renderMirrorList();
    });

    // 带动画的移动函数
    function animateMove(fromIndex, toIndex, direction) {
      if (!mirrorList) return;
      const items = mirrorList.querySelectorAll('.mirror-item');
      const fromItem = items[fromIndex];
      const toItem = items[toIndex];
      if (!fromItem || !toItem) return;

      // 获取当前输入框的值，确保不会丢失用户输入
      if (!mirrorList) return;
      const mirrorItems = mirrorList.querySelectorAll('.mirror-item');
      const currentValues = Array.from(mirrorItems).map(item => {
        const urlInput = item.querySelector('input[data-field="url"]');
        const proxyCheckbox = item.querySelector('input[data-field="useProxy"]');
        return {
          url: (urlInput === null || urlInput === void 0 ? void 0 : urlInput.value) || '',
          useProxy: (proxyCheckbox === null || proxyCheckbox === void 0 ? void 0 : proxyCheckbox.checked) || false
        };
      });

      // 禁用所有按钮防止重复点击
      if (!mirrorList) return;
      const buttons = mirrorList.querySelectorAll('button');
      buttons.forEach(btn => btn.disabled = true);

      // 计算精确的移动距离
      const fromRect = fromItem.getBoundingClientRect();
      const toRect = toItem.getBoundingClientRect();
      const distance = Math.abs(fromRect.top - toRect.top);

      // 应用动画变换
      if (direction === 'up') {
        fromItem.style.transform = `translateY(-${distance}px)`;
        toItem.style.transform = `translateY(${distance}px)`;
      } else {
        fromItem.style.transform = `translateY(${distance}px)`;
        toItem.style.transform = `translateY(-${distance}px)`;
      }

      // 动画完成后更新数据和重新渲染
      setTimeout(() => {
        // 使用用户当前输入的值更新CONFIG
        CONFIG.mirrorUrls = currentValues;

        // 交换数据
        const temp = CONFIG.mirrorUrls[fromIndex];
        CONFIG.mirrorUrls[fromIndex] = CONFIG.mirrorUrls[toIndex];
        CONFIG.mirrorUrls[toIndex] = temp;

        // 重新渲染列表
        renderMirrorList();

        // 重新启用按钮
        setTimeout(() => {
          if (!mirrorList) return;
          const newButtons = mirrorList.querySelectorAll('button');
          newButtons.forEach(btn => btn.disabled = false);
        }, 50);
      }, 300);
    }

    // 晃动动画函数
    function shakeAnimation(element) {
      if (!mirrorList) return;
      // 禁用所有按钮防止重复点击
      const buttons = mirrorList.querySelectorAll('button');
      buttons.forEach(btn => btn.disabled = true);
      const htmlElement = element;
      // 添加晃动动画，模拟手机震动反馈
      htmlElement.style.transition = 'transform 0.08s cubic-bezier(0.36, 0.07, 0.19, 0.97)';

      // 更自然的晃动序列，类似手机解锁失败的震动
      const shakeSequence = [{
        transform: 'translateX(-10px)',
        delay: 0
      }, {
        transform: 'translateX(10px)',
        delay: 80
      }, {
        transform: 'translateX(-8px)',
        delay: 160
      }, {
        transform: 'translateX(8px)',
        delay: 240
      }, {
        transform: 'translateX(-4px)',
        delay: 320
      }, {
        transform: 'translateX(4px)',
        delay: 400
      }, {
        transform: 'translateX(0px)',
        delay: 480
      }];
      shakeSequence.forEach(({
        transform,
        delay
      }) => {
        setTimeout(() => {
          htmlElement.style.transform = transform;
        }, delay);
      });

      // 动画完成后清理样式并重新启用按钮
      setTimeout(() => {
        htmlElement.style.transition = '';
        htmlElement.style.transform = '';
        buttons.forEach(btn => btn.disabled = false);
      }, 600);
    }
    mirrorList.addEventListener('click', e => {
      if (!mirrorList) return;
      const target = e.target;
      if (!target) return;
      const index = parseInt(target.dataset.index || '0');
      if (target.classList.contains('remove-mirror')) {
        // 检查是否尝试删除受保护的镜像源
        const mirrorToDelete = CONFIG.mirrorUrls[index];
        if (mirrorToDelete.url === 'https://registry.koishi.chat/index.json') {
          // 对受保护的镜像源执行摇晃动画
          if (!mirrorList) return;
          const items = mirrorList.querySelectorAll('.mirror-item');
          shakeAnimation(items[index]);
        } else {
          CONFIG.mirrorUrls.splice(index, 1);
          renderMirrorList();
        }
      } else if (target.classList.contains('move-up')) {
        if (index > 0) {
          animateMove(index, index - 1, 'up');
        } else {
          // 第一个项目无法上移，执行晃动动画
          if (!mirrorList) return;
          const items = mirrorList.querySelectorAll('.mirror-item');
          shakeAnimation(items[index]);
        }
      } else if (target.classList.contains('move-down')) {
        if (index < CONFIG.mirrorUrls.length - 1) {
          animateMove(index, index + 1, 'down');
        } else {
          // 最后一个项目无法下移，执行晃动动画
          if (!mirrorList) return;
          const items = mirrorList.querySelectorAll('.mirror-item');
          shakeAnimation(items[index]);
        }
      }
    });
    const closeConfigUI = () => {
      configUIOpen = false;

      // 添加淡出动画
      container.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      overlay.style.transition = 'opacity 0.2s ease-out';
      container.style.opacity = '0';
      container.style.transform = 'translate(-50%, -50%) scale(0.95)';
      overlay.style.opacity = '0';

      // 动画完成后移除元素
      setTimeout(() => {
        container.remove();
        overlay.remove();
        document.body.style.overflow = '';
      }, 200);
    };

    // 右上角关闭按钮事件
    closeButton.addEventListener('click', () => {
      closeConfigUI();
    });

    // 重置按钮事件
    (_document$getElementB2 = document.getElementById('reset-btn')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', () => {
      showResetConfirmDialog();
    });

    // 创建重置确认对话框
    function showResetConfirmDialog() {
      var _document$getElementB3, _document$getElementB4;
      // 创建遮罩层
      const resetOverlay = document.createElement('div');
      resetOverlay.style.position = 'fixed';
      resetOverlay.style.top = '0';
      resetOverlay.style.left = '0';
      resetOverlay.style.width = '100%';
      resetOverlay.style.height = '100%';
      resetOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      resetOverlay.style.zIndex = '1002';
      resetOverlay.style.display = 'flex';
      resetOverlay.style.alignItems = 'center';
      resetOverlay.style.justifyContent = 'center';

      // 创建对话框容器
      const resetDialog = document.createElement('div');
      resetDialog.style.backgroundColor = 'var(--vp-c-bg)';
      resetDialog.style.color = 'var(--vp-c-text)';
      resetDialog.style.padding = '2rem';
      resetDialog.style.borderRadius = '8px';
      resetDialog.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      resetDialog.style.border = '1px solid var(--vp-c-divider)';
      resetDialog.style.maxWidth = '400px';
      resetDialog.style.width = '90%';
      resetDialog.style.textAlign = 'center';

      // 对话框内容
      resetDialog.innerHTML = `
                <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--vp-c-text);">确认重置配置</h3>
                <p style="margin-bottom: 2rem; color: var(--vp-c-text-2);">确定要重置所有配置为默认值吗？<br>此操作不可撤销。</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="reset-cancel-btn" class="VPLink link button" style="padding: 0.75rem 1.5rem; background-color: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);">取消</button>
                    <button id="reset-confirm-btn" class="VPLink link button" style="padding: 0.75rem 1.5rem; background-color: #ff4757; color: white; border: 1px solid #ff4757; border-radius: 8px;">确认重置</button>
                </div>
            `;
      resetOverlay.appendChild(resetDialog);
      document.body.appendChild(resetOverlay);

      // 初始动画
      resetOverlay.style.opacity = '0';
      resetDialog.style.transform = 'scale(0.9)';
      resetDialog.style.transition = 'transform 0.2s ease-out';
      resetOverlay.style.transition = 'opacity 0.2s ease-out';
      setTimeout(() => {
        resetOverlay.style.opacity = '1';
        resetDialog.style.transform = 'scale(1)';
      }, 10);

      // 取消按钮事件
      (_document$getElementB3 = document.getElementById('reset-cancel-btn')) === null || _document$getElementB3 === void 0 || _document$getElementB3.addEventListener('click', () => {
        closeResetDialog();
      });

      // 确认按钮事件
      (_document$getElementB4 = document.getElementById('reset-confirm-btn')) === null || _document$getElementB4 === void 0 || _document$getElementB4.addEventListener('click', () => {
        // 重置配置为默认值
        CONFIG.mirrorUrls = [...DEFAULT_CONFIG.mirrorUrls];
        CONFIG.requestTimeout = DEFAULT_CONFIG.requestTimeout;
        CONFIG.debug = DEFAULT_CONFIG.debug;
        CONFIG.disableCache = DEFAULT_CONFIG.disableCache;
        CONFIG.useProxy = DEFAULT_CONFIG.useProxy;
        CONFIG.proxyUrl = DEFAULT_CONFIG.proxyUrl;
        CONFIG.currentMirrorIndex = DEFAULT_CONFIG.currentMirrorIndex;

        // 立即保存到localStorage
        localStorage.setItem('koishiMarketConfig', JSON.stringify(CONFIG));

        // 更新UI显示
        renderMirrorList();
        const timeoutEl = document.getElementById('timeout');
        const disableCacheEl = document.getElementById('disableCache');
        const useProxyEl = document.getElementById('useProxy');
        const proxyUrlEl = document.getElementById('proxyUrl');
        const debugEl = document.getElementById('debug');
        if (timeoutEl) timeoutEl.value = String(CONFIG.requestTimeout);
        if (disableCacheEl) disableCacheEl.checked = CONFIG.disableCache;
        if (useProxyEl) useProxyEl.checked = CONFIG.useProxy;
        if (proxyUrlEl) proxyUrlEl.value = CONFIG.proxyUrl;
        if (debugEl) debugEl.checked = CONFIG.debug;

        // 关闭对话框
        closeResetDialog();

        // 关闭整个配置UI
        closeConfigUI();
      });

      // 点击遮罩层关闭对话框
      resetOverlay.addEventListener('click', e => {
        if (e.target === resetOverlay) {
          closeResetDialog();
        }
      });

      // 关闭对话框函数
      function closeResetDialog() {
        resetOverlay.style.opacity = '0';
        resetDialog.style.transform = 'scale(0.9)';
        setTimeout(() => {
          resetOverlay.remove();
        }, 200);
      }

      // ESC键关闭对话框
      const handleEscKey = e => {
        if (e.key === 'Escape') {
          closeResetDialog();
          document.removeEventListener('keydown', handleEscKey);
        }
      };
      document.addEventListener('keydown', handleEscKey);
    }
    (_document$getElementB5 = document.getElementById('save-btn')) === null || _document$getElementB5 === void 0 || _document$getElementB5.addEventListener('click', () => {
      if (!mirrorList) return;
      const mirrorItems = mirrorList.querySelectorAll('.mirror-item');
      CONFIG.mirrorUrls = Array.from(mirrorItems).map(item => {
        const urlInput = item.querySelector('input[data-field="url"]');
        const proxyCheckbox = item.querySelector('input[data-field="useProxy"]');
        return {
          url: (urlInput === null || urlInput === void 0 ? void 0 : urlInput.value.trim()) || '',
          useProxy: (proxyCheckbox === null || proxyCheckbox === void 0 ? void 0 : proxyCheckbox.checked) || false
        };
      }).filter(mirror => mirror.url);
      const timeoutEl = document.getElementById('timeout');
      const disableCacheEl = document.getElementById('disableCache');
      const useProxyEl = document.getElementById('useProxy');
      const proxyUrlEl = document.getElementById('proxyUrl');
      const debugEl = document.getElementById('debug');
      CONFIG.requestTimeout = parseInt((timeoutEl === null || timeoutEl === void 0 ? void 0 : timeoutEl.value) || '5000') || 5000;
      CONFIG.disableCache = (disableCacheEl === null || disableCacheEl === void 0 ? void 0 : disableCacheEl.checked) || false;
      CONFIG.useProxy = (useProxyEl === null || useProxyEl === void 0 ? void 0 : useProxyEl.checked) || false;
      CONFIG.proxyUrl = (proxyUrlEl === null || proxyUrlEl === void 0 ? void 0 : proxyUrlEl.value.trim()) || DEFAULT_CONFIG.proxyUrl;
      CONFIG.debug = (debugEl === null || debugEl === void 0 ? void 0 : debugEl.checked) || false;
      localStorage.setItem('koishiMarketConfig', JSON.stringify(CONFIG));
      closeConfigUI();
    });
    (_document$getElementB6 = document.getElementById('cancel-btn')) === null || _document$getElementB6 === void 0 || _document$getElementB6.addEventListener('click', () => {
      closeConfigUI();
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
            .vp-doc {
                /* 隐藏滚动条但保持滚动功能 */
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE and Edge */
            }
            .vp-doc::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
            }
            .vp-doc h2 {
                margin-top: 0rem;
                margin-bottom: 1rem;
            }
            .vp-doc section {
                margin-top: 0;
                margin-bottom: 1rem;
            }
            .vp-doc .button {
                border: 1px solid var(--vp-c-divider);
                padding: 0.5rem 1rem;
                cursor: pointer;
                background-color: var(--vp-c-bg-soft);
                color: var(--vp-c-text);
                border-radius: 4px;
                font-size: 0.9rem;
                transition: all 0.2s;
            }
            .vp-doc .button:hover {
                background-color: var(--vp-c-brand);
                color: var(--vp-c-bg);
            }
            .vp-doc .form-item {
                margin-bottom: 1rem;
            }
            .vp-doc .form-item label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: bold;
                color: var(--vp-c-text);
            }
            .vp-doc .form-item input[type="number"],
            .vp-doc .form-item input[type="text"] {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid var(--vp-c-divider);
                background-color: var(--vp-c-bg);
                color: var(--vp-c-text);
                box-sizing: border-box;
                border-radius: 4px;
            }
            .vp-doc .form-item input[type="checkbox"] {
                margin-right: 0.5rem;
            }
            .vp-doc .mirror-item {
                margin-bottom: 0.5rem;
                flex-direction: column;
                align-items: stretch;
                position: relative;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .vp-doc .mirror-item input[type="text"] {
                width: 100%;
                margin-bottom: 0.5rem;
            }
            .vp-doc .mirror-item > div {
                display: flex;
                width: 100%;
            }
            .vp-doc .mirror-item button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            /* 晃动动画相关样式 */
            .vp-doc .mirror-item.shaking {
                transform-origin: center;
            }
            /* 关闭按钮样式 */
            .vp-doc button[title="关闭配置"] {
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
            }
            .vp-doc button[title="关闭配置"]:hover {
                box-shadow: 0 4px 8px rgba(255, 71, 87, 0.4);
            }
            .vp-doc button[title="关闭配置"]:active {
                transform: scale(0.95) !important;
            }
            /* 重置确认对话框样式 */
            #reset-confirm-btn:hover {
                background-color: #ff3742 !important;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
            }
            #reset-cancel-btn:hover {
                background-color: var(--vp-c-bg-alt);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
        `;
    document.head.appendChild(style);
  }
  function showFailureUI() {
    const loadingElement = document.querySelector('.market-loading');
    // 检查加载元素是否存在，以及是否已经添加了按钮
    if (!loadingElement || loadingElement.querySelector('.market-failure-controls')) {
      return;
    }
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'market-failure-controls';
    controlsContainer.style.textAlign = 'center';
    controlsContainer.style.marginTop = '1rem';
    const resetButton = document.createElement('button');
    resetButton.textContent = '恢复默认配置';
    resetButton.className = 'VPLink link button';
    resetButton.style.marginRight = '1rem';
    resetButton.style.border = '1px solid var(--vp-c-divider)';
    resetButton.style.padding = '8px 16px';
    resetButton.style.borderRadius = '8px';
    resetButton.onclick = () => {
      localStorage.setItem('koishiMarketConfig', JSON.stringify(DEFAULT_CONFIG));
      window.location.reload();
    };
    const disableButton = document.createElement('button');
    disableButton.textContent = '单次禁用此脚本';
    disableButton.className = 'VPLink link button';
    disableButton.style.border = '1px solid var(--vp-c-divider)';
    disableButton.style.padding = '8px 16px';
    disableButton.style.borderRadius = '8px';
    disableButton.onclick = () => {
      sessionStorage.setItem('disableMarketRedirectorOnce', 'true');
      window.location.reload();
    };
    controlsContainer.appendChild(resetButton);
    controlsContainer.appendChild(disableButton);

    // 将按钮添加到 .market-loading 元素内部，使其显示在文字下方
    loadingElement.appendChild(controlsContainer);
    log('显示加载失败的UI控件');
  }
  function addConfigButton() {
    // 如果按钮已经添加，则直接返回
    if (configButtonAdded) {
      return;
    }
    const tryAddButton = () => {
      var _marketTitle$parentNo;
      // 如果按钮已经添加，则直接返回 true
      if (configButtonAdded) {
        return true;
      }

      // 尝试查找已添加的配置按钮
      const existingButton = document.querySelector('.market-config-button');
      if (existingButton) {
        configButtonAdded = true;
        return true;
      }

      // 尝试直接查找包含 "插件市场" 文本的 <h1> 元素
      const marketTitle = Array.from(document.querySelectorAll('h1')).find(h1 => h1.textContent.trim() === '插件市场');
      if (!marketTitle) {
        log('[Koishi Market Registry Redirector] 未找到包含 "插件市场" 文本的标题元素，正在重试...');
        return false; // 返回 false 表示未找到元素
      }

      // 创建按钮元素
      const configButton = document.createElement('button');
      configButton.className = 'market-config-button'; // 使用新的类名
      configButton.textContent = '配置镜像源'; // 设置按钮文字

      // 复制原始标题的样式
      const titleStyle = getComputedStyle(marketTitle);
      configButton.style.fontSize = titleStyle.fontSize;
      configButton.style.fontWeight = titleStyle.fontWeight;
      configButton.style.fontFamily = titleStyle.fontFamily;
      configButton.style.color = 'var(--vp-c-text)'; // 使用主题文字颜色变量
      configButton.style.textAlign = titleStyle.textAlign; // 保持文本对齐方式
      configButton.style.lineHeight = titleStyle.lineHeight; // 保持行高
      configButton.style.letterSpacing = titleStyle.letterSpacing; // 保持字符间距

      configButton.style.border = 'none'; // 移除边框
      configButton.style.backgroundColor = 'transparent'; // 透明背景
      configButton.style.cursor = 'pointer'; // 鼠标悬停时显示手型
      configButton.style.padding = '0'; // 移除内边距
      configButton.style.margin = '0'; // 移除外边距
      configButton.style.width = '100%'; // 占据父容器的宽度
      configButton.style.display = 'block'; // 使按钮成为块级元素

      configButton.addEventListener('click', e => {
        e.preventDefault();
        configUIOpen = true;
        createConfigUI();
      });

      // 替换标题为按钮
      (_marketTitle$parentNo = marketTitle.parentNode) === null || _marketTitle$parentNo === void 0 || _marketTitle$parentNo.replaceChild(configButton, marketTitle);
      configButtonAdded = true; // 设置标志，表示按钮已添加

      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
            .market-config-button {
                color: var(--vp-c-text) !important; /* 强制使用主题文字颜色 */
            }
            .market-config-button:hover {
                opacity: 0.8; /* 鼠标悬停时稍微改变透明度 */
                color: var(--vp-c-text) !important; /* 悬停时也保持主题颜色 */
            }
            .market-config-button:focus {
                outline: none; /* 移除焦点时的轮廓线 */
                color: var(--vp-c-text) !important; /* 焦点时也保持主题颜色 */
            }
        `;
      document.head.appendChild(style);
      log('[Koishi Market Registry Redirector] 成功添加配置按钮');
      return true; // 返回 true 表示已成功找到并替换元素
    };

    // 尝试立即添加按钮
    if (tryAddButton()) return;

    // 如果立即添加失败，则使用 MutationObserver 监听元素出现
    const observer = new MutationObserver(mutations => {
      // 如果按钮已经添加，则停止监听
      if (configButtonAdded) {
        observer.disconnect();
        return;
      }
      if (tryAddButton()) {
        observer.disconnect(); // 停止监听
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function initLoadingObserver() {
    const observer = new MutationObserver(() => {
      const loadingElement = document.querySelector('.market-loading');
      if (loadingElement) {
        showFailureUI();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    log('已初始化加载界面观察器');
  }

  // 在 DOMContentLoaded 事件触发后立即尝试添加按钮
  document.addEventListener('DOMContentLoaded', () => {
    addConfigButton();
    initLoadingObserver();
  });

  // 处理URL参数搜索功能 
  function handleUrlSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    if (!keyword) return;
    log('检测到URL搜索参数:', keyword);

    // 将关键词按+或空格分割
    const keywords = keyword.split(/[\+\s]+/).filter(k => k.trim());
    if (keywords.length === 0) return;
    log('解析到的关键词:', keywords);

    // 等待搜索框出现
    const waitForSearchBox = function () {
      const searchBox = document.querySelector('.search-box');
      const searchInput = searchBox ? searchBox.querySelector('input') : null;
      if (searchInput) {
        log('找到搜索框，开始快速模拟搜索操作');

        // 模拟输入和确认每个关键词
        const simulateSearch = function (index) {
          if (index >= keywords.length) {
            log('所有关键词处理完毕');
            return;
          }
          const kw = keywords[index];
          log(`快速处理关键词 ${index + 1}/${keywords.length}: "${kw}"`);

          // 模拟点击搜索框获取焦点
          searchInput.focus();

          // 清空输入框（以防万一）
          searchInput.value = '';

          // 直接设置值并触发输入事件
          searchInput.value = kw;
          searchInput.dispatchEvent(new Event('input', {
            bubbles: true
          }));

          // 立即模拟Enter键序列
          // 模拟按下Enter键 (keydown)
          searchInput.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          }));

          // 模拟按下Enter键 (keypress)
          searchInput.dispatchEvent(new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          }));

          // 模拟释放Enter键 (keyup)
          searchInput.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          }));

          // 缩短等待时间，加快处理下一个关键词
          setTimeout(() => {
            simulateSearch(index + 1);
          }, 300); // 减少到300ms
        };

        // 开始模拟搜索
        simulateSearch(0);
      } else {
        // 如果元素还没出现，继续等待
        setTimeout(waitForSearchBox, 100); // 减少等待时间
      }
    };

    // 开始等待搜索框
    waitForSearchBox();
  }

  // NPM镜像站配置
  const NPM_MIRRORS = [{
    name: 'NPM 官方',
    url: 'https://www.npmjs.com/package/'
  }, {
    name: 'NPM Mirror (淘宝)',
    url: 'https://npmmirror.com/package/'
  }];

  // 创建增强的镜像选择器
  function createEnhancedMirrorSelector(packageName, marketPackage, githubLink) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease-out;
        `;

    // 创建选择器容器
    const selector = document.createElement('div');
    selector.style.cssText = `
            background-color: var(--vp-c-bg);
            color: var(--vp-c-text);
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--vp-c-divider);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.2s ease-out;
        `;

    // 创建标题
    const title = document.createElement('h3');
    title.textContent = '请选择要跳转的地址';
    title.style.cssText = `
            margin: 0 0 1rem 0;
            color: var(--vp-c-text);
            font-size: 1.1rem;
            text-align: center;
        `;

    // 创建包名显示
    const packageInfo = document.createElement('p');
    packageInfo.textContent = packageName;
    packageInfo.style.cssText = `
            margin: 0 0 1.5rem 0;
            color: var(--vp-c-text-2);
            font-size: 0.9rem;
            text-align: center;
            word-break: break-all;
        `;

    // 创建链接列表容器
    const linkList = document.createElement('div');
    linkList.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
        `;

    // 添加NPM镜像选项
    const npmSection = document.createElement('div');
    npmSection.style.marginBottom = '1rem';
    npmSection.style.textAlign = 'center';

    // const npmTitle = document.createElement('h4');
    // npmTitle.textContent = 'NPM 镜像';
    // npmTitle.style.cssText = `
    //     margin: 0 0 0.5rem 0;
    //     color: var(--vp-c-text);
    //     font-size: 1rem;
    //     font-weight: normal;
    // `;

    // npmSection.appendChild(npmTitle);

    NPM_MIRRORS.forEach(mirror => {
      const linkButton = document.createElement('button');
      linkButton.textContent = mirror.name;
      linkButton.style.cssText = `
                padding: 0.75rem 1rem;
                border: 1px solid var(--vp-c-divider);
                background-color: var(--vp-c-bg-soft);
                color: var(--vp-c-text);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                width: 100%;
            `;
      const icon = document.createElement('span');
      icon.innerHTML = '📦';
      icon.style.fontSize = '1.2rem';
      linkButton.appendChild(icon);
      linkButton.addEventListener('mouseenter', () => {
        linkButton.style.backgroundColor = 'var(--vp-c-brand)';
        linkButton.style.color = 'var(--vp-c-bg)';
        linkButton.style.transform = 'translateY(-1px)';
      });
      linkButton.addEventListener('mouseleave', () => {
        linkButton.style.backgroundColor = 'var(--vp-c-bg-soft)';
        linkButton.style.color = 'var(--vp-c-text)';
        linkButton.style.transform = 'translateY(0)';
      });
      linkButton.addEventListener('click', () => {
        const fullUrl = mirror.url + packageName;
        window.open(fullUrl, '_blank');
        closeEnhancedMirrorSelector();
      });
      npmSection.appendChild(linkButton);
    });
    linkList.appendChild(npmSection);

    // 添加Repository和Homepage选项
    const pluginData = findPluginData(packageName);
    let repositoryUrl = null;
    let homepageUrl = null;

    // 尝试从插件数据中获取链接
    if (pluginData && pluginData.package && pluginData.package.links) {
      repositoryUrl = pluginData.package.links.repository;
      homepageUrl = pluginData.package.links.homepage;
    }

    // 如果没有从插件数据获取到，尝试从页面元素获取
    if (!repositoryUrl && githubLink) {
      repositoryUrl = githubLink.href;
    }

    // 添加Repository选项
    if (repositoryUrl) {
      const repoSection = document.createElement('div');
      repoSection.style.marginBottom = '1rem';
      repoSection.style.textAlign = 'center';

      // const repoTitle = document.createElement('h4');
      // repoTitle.textContent = 'Repository (仓库)';
      // repoTitle.style.cssText = `
      //     margin: 0 0 0.5rem 0;
      //     color: var(--vp-c-text);
      //     font-size: 1rem;
      //     font-weight: normal;
      // `;

      // repoSection.appendChild(repoTitle);

      const repoButton = document.createElement('button');
      repoButton.textContent = 'GitHub 仓库';
      repoButton.style.cssText = `
                padding: 0.75rem 1rem;
                border: 1px solid var(--vp-c-divider);
                background-color: var(--vp-c-bg-soft);
                color: var(--vp-c-text);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                width: 100%;
            `;
      const repoIcon = document.createElement('span');
      repoIcon.innerHTML = '📁';
      repoIcon.style.fontSize = '1.2rem';
      repoButton.appendChild(repoIcon);
      repoButton.addEventListener('mouseenter', () => {
        repoButton.style.backgroundColor = 'var(--vp-c-brand)';
        repoButton.style.color = 'var(--vp-c-bg)';
        repoButton.style.transform = 'translateY(-1px)';
      });
      repoButton.addEventListener('mouseleave', () => {
        repoButton.style.backgroundColor = 'var(--vp-c-bg-soft)';
        repoButton.style.color = 'var(--vp-c-text)';
        repoButton.style.transform = 'translateY(0)';
      });
      repoButton.addEventListener('click', () => {
        window.open(repositoryUrl, '_blank');
        closeEnhancedMirrorSelector();
      });
      repoSection.appendChild(repoButton);
      linkList.appendChild(repoSection);
    }

    // 添加Homepage选项
    if (homepageUrl) {
      const homeSection = document.createElement('div');
      homeSection.style.marginBottom = '1rem';
      homeSection.style.textAlign = 'center';

      // const homeTitle = document.createElement('h4');
      // homeTitle.textContent = 'Homepage (主页)';
      // homeTitle.style.cssText = `
      //     margin: 0 0 0.5rem 0;
      //     color: var(--vp-c-text);
      //     font-size: 1rem;
      //     font-weight: normal;
      // `;

      // homeSection.appendChild(homeTitle);

      const homeButton = document.createElement('button');
      homeButton.textContent = '项目主页';
      homeButton.style.cssText = `
                padding: 0.75rem 1rem;
                border: 1px solid var(--vp-c-divider);
                background-color: var(--vp-c-bg-soft);
                color: var(--vp-c-text);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                width: 100%;
            `;
      const homeIcon = document.createElement('span');
      homeIcon.innerHTML = '🏠';
      homeIcon.style.fontSize = '1.2rem';
      homeButton.appendChild(homeIcon);
      homeButton.addEventListener('mouseenter', () => {
        homeButton.style.backgroundColor = 'var(--vp-c-brand)';
        homeButton.style.color = 'var(--vp-c-bg)';
        homeButton.style.transform = 'translateY(-1px)';
      });
      homeButton.addEventListener('mouseleave', () => {
        homeButton.style.backgroundColor = 'var(--vp-c-bg-soft)';
        homeButton.style.color = 'var(--vp-c-text)';
        homeButton.style.transform = 'translateY(0)';
      });
      homeButton.addEventListener('click', () => {
        window.open(homepageUrl, '_blank');
        closeEnhancedMirrorSelector();
      });
      homeSection.appendChild(homeButton);
      linkList.appendChild(homeSection);
    }

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            border: 1px solid var(--vp-c-divider);
            background-color: var(--vp-c-bg);
            color: var(--vp-c-text-2);
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s;
        `;
    cancelButton.addEventListener('mouseenter', () => {
      cancelButton.style.backgroundColor = 'var(--vp-c-bg-soft)';
      cancelButton.style.color = 'var(--vp-c-text)';
      cancelButton.style.transform = 'translateY(-1px)';
    });
    cancelButton.addEventListener('mouseleave', () => {
      cancelButton.style.backgroundColor = 'var(--vp-c-bg)';
      cancelButton.style.color = 'var(--vp-c-text-2)';
      cancelButton.style.transform = 'translateY(0)';
    });
    cancelButton.addEventListener('click', closeEnhancedMirrorSelector);

    // 组装选择器
    selector.appendChild(title);
    selector.appendChild(packageInfo);
    selector.appendChild(linkList);
    selector.appendChild(cancelButton);
    overlay.appendChild(selector);

    // 插入到页面
    document.body.appendChild(overlay);

    // 禁用背景滚动
    document.body.style.overflow = 'hidden';

    // 触发动画
    setTimeout(() => {
      overlay.style.opacity = '1';
      selector.style.transform = 'scale(1)';
    }, 10);

    // 关闭选择器函数
    function closeEnhancedMirrorSelector() {
      overlay.style.opacity = '0';
      selector.style.transform = 'scale(0.9)';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 200);
    }

    // 点击遮罩层关闭
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        closeEnhancedMirrorSelector();
      }
    });

    // ESC键关闭
    const handleEscKey = e => {
      if (e.key === 'Escape') {
        closeEnhancedMirrorSelector();
        document.removeEventListener('keydown', handleEscKey);
      }
    };
    document.addEventListener('keydown', handleEscKey);
  }

  // 检查是否为标准npm包地址
  function isStandardNpmPackageUrl(url) {
    try {
      const urlObj = new URL(url);

      // 检查域名是否为 www.npmjs.com
      if (urlObj.hostname !== 'www.npmjs.com') {
        return false;
      }

      // 1. /package/包名
      // 2. /package/@scope/包名  
      // 3. /@scope/包名 (直接的@scope格式)
      const pathMatch = urlObj.pathname.match(/^(\/package\/(@[^\/]+\/[^\/]+|[^\/]+)|\/(@[^\/]+\/[^\/]+))$/);
      if (!pathMatch) {
        return false;
      }

      // 检查是否有查询参数或hash
      if (urlObj.search || urlObj.hash) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // 拦截版本号链接点击和整个插件卡片点击
  function interceptVersionLinks() {
    // 使用事件委托监听所有点击事件
    document.addEventListener('click', e => {
      const target = e.target;
      if (!target) return;

      // 首先检查点击的目标元素是否在头像区域内
      const avatarContainer = target.closest('.avatars');
      if (avatarContainer) {
        // 如果点击的是头像区域，直接返回，不进行拦截
        return;
      }

      // 检查是否点击了整个插件卡片
      const marketPackage = target.closest('.market-package');
      if (marketPackage) {
        // 查找插件卡片中的所有链接
        const allLinks = marketPackage.querySelectorAll('a');
        let npmLink = null;
        let githubLink = null;

        // 查找npm链接和github链接
        allLinks.forEach(link => {
          const anchorLink = link;
          if (anchorLink.href && isStandardNpmPackageUrl(anchorLink.href)) {
            npmLink = anchorLink;
          } else if (anchorLink.href && anchorLink.href.includes('github.com')) {
            githubLink = anchorLink;
          }
        });

        // 如果找到了npm链接，拦截点击
        if (npmLink) {
          e.preventDefault();
          e.stopPropagation();

          // 提取包名
          let packageName = npmLink.href;
          if (packageName.includes('/package/')) {
            packageName = packageName.replace(/^https?:\/\/www\.npmjs\.com\/package\//, '');
          } else {
            // 处理直接的@scope格式：https://www.npmjs.com/@scope/package
            packageName = packageName.replace(/^https?:\/\/www\.npmjs\.com\//, '');
          }
          log('拦截插件卡片点击:', packageName);

          // 显示增强的镜像选择器
          createEnhancedMirrorSelector(packageName, marketPackage, githubLink);
        }
        return;
      }

      // 检查点击的元素是否是版本号链接或其直接子元素
      let linkTarget = target;

      // 如果点击的是 SVG 或其子元素，向上查找到 <a> 标签
      if (linkTarget.tagName === 'svg' || linkTarget.tagName === 'path' || linkTarget.closest('svg')) {
        linkTarget = linkTarget.closest('a');
      } else if (linkTarget.tagName === 'A') {
        // 如果直接点击的就是 <a> 标签，使用它
        linkTarget = linkTarget;
      } else {
        // 如果点击的是其他元素，检查是否是版本号链接的直接文本内容
        const parentA = linkTarget.closest('a');
        if (parentA && parentA.href && isStandardNpmPackageUrl(parentA.href)) {
          // 检查是否是版本号链接的文本部分（不是图标）
          const hasVersionIcon = parentA.querySelector('svg path[d*="M0 252.118V48C0 21.49"]');
          if (hasVersionIcon && linkTarget.nodeType === Node.TEXT_NODE || linkTarget.tagName && !linkTarget.closest('svg') && parentA.contains(linkTarget)) {
            linkTarget = parentA;
          } else {
            return; // 不是我们要拦截的元素
          }
        } else {
          return; // 不是链接元素
        }
      }

      // 检查是否是标准npm包链接
      const anchorTarget = linkTarget;
      if (anchorTarget && anchorTarget.href && isStandardNpmPackageUrl(anchorTarget.href)) {
        // 检查是否是版本号链接（包含特定的版本图标）
        const hasVersionIcon = anchorTarget.querySelector('svg path[d*="M0 252.118V48C0 21.49"]');
        if (hasVersionIcon) {
          e.preventDefault();
          e.stopPropagation();

          // 提取包名
          let packageName = anchorTarget.href;
          if (packageName.includes('/package/')) {
            packageName = packageName.replace(/^https?:\/\/www\.npmjs\.com\/package\//, '');
          } else {
            // 处理直接的@scope格式：https://www.npmjs.com/@scope/package
            packageName = packageName.replace(/^https?:\/\/www\.npmjs\.com\//, '');
          }
          log('拦截版本号链接点击:', packageName);

          // 查找插件卡片中的github链接
          const marketPackage = anchorTarget.closest('.market-package');
          let githubLink = null;
          if (marketPackage) {
            const githubLinks = marketPackage.querySelectorAll('a[href*="github.com"]');
            if (githubLinks.length > 0) {
              githubLink = githubLinks[0];
            }
          }

          // 显示增强的镜像选择器
          createEnhancedMirrorSelector(packageName, marketPackage, githubLink);
        }
      }
    }, true); // 使用捕获阶段确保优先处理
  }

  // 显示当前使用的镜像源
  function showCurrentMirror() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList && node.querySelector && node.querySelector('.info')) {
              const infoDiv = node.querySelector('.info');
              if (infoDiv && !document.querySelector('.mirror-info')) {
                var _infoDiv$parentNode;
                const mirrorInfo = document.createElement('div');
                mirrorInfo.className = 'mirror-info';
                mirrorInfo.style.cssText = `
                                    margin-top: 8px;
                                    font-family: monospace;
                                    font-size: 0.9em;
                                    color: var(--vp-c-text-2);
                                    text-align: center;
                                    width: 100%;
                                    cursor: pointer;
                                    transition: color 0.2s ease;
                                `;
                const currentMirror = CONFIG.mirrorUrls[CONFIG.currentMirrorIndex];
                const mirrorUrl = currentMirror ? currentMirror.url : '';
                const proxyStatus = currentMirror && currentMirror.useProxy ? ' (代理)' : '';
                const fullText = `${mirrorUrl}${proxyStatus}`;
                const originalHTML = `<code>${fullText}</code>`;
                mirrorInfo.innerHTML = originalHTML;
                let revertTimeout = null;
                mirrorInfo.addEventListener('click', () => {
                  if (revertTimeout) {
                    clearTimeout(revertTimeout);
                    revertTimeout = null;
                    mirrorInfo.innerHTML = originalHTML;
                    mirrorInfo.style.color = 'var(--vp-c-text-2)';
                    return;
                  }
                  navigator.clipboard.writeText(mirrorUrl).then(() => {
                    mirrorInfo.innerHTML = `<code>已复制到剪贴板!</code>`;
                    mirrorInfo.style.color = 'var(--vp-c-brand)';
                    revertTimeout = setTimeout(() => {
                      mirrorInfo.innerHTML = originalHTML;
                      mirrorInfo.style.color = 'var(--vp-c-text-2)';
                      revertTimeout = null;
                    }, 2000);
                  }).catch(err => {
                    error('无法复制到剪贴板:', err);
                    mirrorInfo.innerHTML = `<code>复制失败!</code>`;
                    mirrorInfo.style.color = 'var(--vp-c-danger)';
                    revertTimeout = setTimeout(() => {
                      mirrorInfo.innerHTML = originalHTML;
                      mirrorInfo.style.color = 'var(--vp-c-text-2)';
                      revertTimeout = null;
                    }, 2000);
                  });
                });
                (_infoDiv$parentNode = infoDiv.parentNode) === null || _infoDiv$parentNode === void 0 || _infoDiv$parentNode.insertBefore(mirrorInfo, infoDiv.nextSibling);
                log('已添加镜像源信息并附加点击复制功能');
                observer.disconnect();
              }
            }
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 添加动态返回顶部按钮
  function addBackToTopButton() {
    if (document.querySelector('.dynamic-back-to-top')) {
      return;
    }
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'dynamic-back-to-top';
    backToTopBtn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--vp-c-brand);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.3s ease, transform 0.3s ease;
            user-select: none;
        `;
    const progressText = document.createElement('span');
    progressText.className = 'progress-text';
    const arrowSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
        `;
    backToTopBtn.appendChild(progressText);
    document.body.appendChild(backToTopBtn);
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollableHeight = scrollHeight - clientHeight;
      if (scrollableHeight <= 0) {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'scale(0.8)';
        return;
      }
      if (scrollTop > clientHeight / 2) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.transform = 'scale(1)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'scale(0.8)';
      }
      const percentage = Math.min(100, Math.round(scrollTop / scrollableHeight * 100));
      if (percentage >= 98) {
        if (backToTopBtn.innerHTML !== arrowSvg) {
          backToTopBtn.innerHTML = arrowSvg;
        }
      } else {
        const textNode = backToTopBtn.querySelector('.progress-text');
        if (textNode) {
          textNode.textContent = `${percentage}%`;
        } else {
          backToTopBtn.innerHTML = '';
          backToTopBtn.appendChild(progressText);
          progressText.textContent = `${percentage}%`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    handleScroll(); // Initial check

    log('已添加动态返回顶部按钮');
  }

  // 在页面加载完成后初始化
  window.addEventListener('load', () => {
    log('页面加载完成，准备初始化时间修复功能');
    if (registryData) {
      initTimeFixing();
    } else {
      log('注册表数据尚未加载，将在数据加载后自动初始化时间修复功能');
    }

    // 添加配置按钮
    addConfigButton();

    // 处理URL搜索参数
    handleUrlSearch();

    // 初始化版本号链接拦截
    interceptVersionLinks();
    log('已初始化版本号链接拦截功能');

    // 显示当前使用的镜像源
    showCurrentMirror();

    // 添加返回顶部按钮
    addBackToTopButton();

    // 初始化新的头像布局
    initNewAvatarLayout();

    // 修复时间戳可见性
    fixTimestampVisibility();
  });

  // 新的头像布局功能
  function initNewAvatarLayout() {
    log('初始化新的头像布局');

    // 添加CSS样式
    const newAvatarStyle = document.createElement('style');
    newAvatarStyle.textContent = `
            /* 头像容器新布局 */
            .avatars {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end; /* 在容器内靠右对齐 */
                gap: 4px; /* 头像间距 */
                width: 52px; /* 宽度恰好容纳两个24px的头像和一个4px的间距 */
                margin-left: auto; /* 容器本身在.footer里靠右 */
            }

            /* 覆盖原有的负边距样式 */
            .avatars .avatar {
                margin-left: 0 !important;
            }
            
            /* 确保父元素不会裁剪掉换行的头像 */
            .market-package .footer, .market-package {
                overflow: visible !important;
            }

            /* 当鼠标悬停在卡片上时，提升其层级以显示溢出的头像 */
            .market-package {
                position: relative; /* z-index 生效需要 position */
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .market-package:hover {
                z-index: 10;
                transform: translateY(-2px); /* 轻微上浮效果 */
                box-shadow: var(--k-shadow-3); /* 使用主题的悬浮阴影效果 */
            }

            /* 确保Element UI的tooltip始终显示在最上层 */
            .el-popper[role="tooltip"] {
                z-index: 10000 !important;
            }
        `;
    document.head.appendChild(newAvatarStyle);
    log('新的头像布局样式已添加');
  }

  // 获取当前使用的镜像源URL
  const getCurrentMirrorUrl = function () {
    const currentMirror = CONFIG.mirrorUrls[CONFIG.currentMirrorIndex];
    return currentMirror ? currentMirror.url : 'N/A';
  };

  // 代理请求函数
  const requestWithProxy = async function (targetUrl, options) {
    log('[Concurrent] 使用代理请求:', targetUrl);
    try {
      const response = await originalFetch.call(window, CONFIG.proxyUrl, {
        method: 'POST',
        headers: {
          'api-u': targetUrl,
          'api-o0': `method=GET, timings=true, timeout=${CONFIG.requestTimeout}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        signal: options.signal
      });
      if (!response.ok) {
        throw new Error(`代理请求失败: ${response.status} ${response.statusText}`);
      }
      const proxyData = await response.text();
      const mockResponse = new Response(proxyData, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      log('[Concurrent] 代理请求成功:', targetUrl);
      return mockResponse;
    } catch (e) {
      error('[Concurrent] 代理请求失败:', targetUrl, e);
      throw e;
    }
  };

  // 并发请求最快的镜像源
  const fetchFromFastestMirror = (input, init) => {
    const promises = CONFIG.mirrorUrls.map((mirror, index) => {
      return new Promise(async (resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error(`Request to ${mirror.url} timed out`));
        }, CONFIG.requestTimeout);
        const {
          url,
          useProxy
        } = mirror;
        try {
          const fetchOptions = {
            ...(init || {}),
            cache: CONFIG.disableCache ? 'no-store' : 'default',
            signal: controller.signal
          };
          const response = useProxy ? await requestWithProxy(url, fetchOptions) : await originalFetch.call(window, url, fetchOptions);
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`Request to ${url} failed with status: ${response.status}`);
          }
          log(`[Concurrent] Success from: ${url}`);
          resolve({
            response,
            index
          });
        } catch (err) {
          clearTimeout(timeoutId);
          const errorMessage = err instanceof Error ? err.message : String(err);
          error(`[Concurrent] Failed for ${url}:`, errorMessage);
          reject(err);
        }
      });
    });
    return Promise.any(promises).then(result => {
      const {
        response,
        index
      } = result;
      const winningMirror = CONFIG.mirrorUrls[index];
      log(`Fastest mirror was: ${winningMirror.url}`);
      CONFIG.currentMirrorIndex = index;
      localStorage.setItem('koishiMarketConfig', JSON.stringify(CONFIG));
      const clonedResponse = response.clone();
      clonedResponse.json().then(data => {
        registryData = data;
        log('Cached registry data from fastest mirror.');
        const mirrorInfoEl = document.querySelector('.mirror-info code');
        if (mirrorInfoEl) {
          const proxyStatus = winningMirror.useProxy ? ' (代理)' : '';
          mirrorInfoEl.textContent = `${winningMirror.url}${proxyStatus}`;
        }
        setTimeout(initTimeFixing, 1000);
      }).catch(err => {
        error('Failed to parse registry data from fastest mirror:', err);
      });
      return response;
    }).catch(aggregateError => {
      error('All mirror requests failed.', aggregateError.errors);
      // 返回一个失败的Promise，以便调用者可以处理
      return Promise.reject(new Error('All mirror requests failed.'));
    });
  };

  // 创建一个 XMLHttpRequest 代理
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    // 检查 URL 是否是我们想要重定向的
    const urlString = typeof url === 'string' ? url : url.toString();
    if (urlString.includes(CONFIG.sourceUrl)) {
      log('拦截到 XHR 请求:', urlString);
      // 替换为上次最快的镜像源 URL
      const newUrl = getCurrentMirrorUrl();
      log('重定向到:', newUrl);
      // 使用新的URL调用原始方法
      return originalXHROpen.call(this, method, newUrl, async ?? true, user, password);
    }
    return originalXHROpen.call(this, method, url, async ?? true, user, password);
  };

  // 拦截 fetch 请求
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url && normalizeUrl(url).includes(CONFIG.sourceUrl)) {
      log('拦截到 fetch 请求:', url);
      return fetchFromFastestMirror(input, init);
    }

    // 调用原始 fetch 方法
    return originalFetch.call(this, input, init);
  };

  // 监听 Service Worker 请求
  if (navigator.serviceWorker) {
    log('检测到 Service Worker 支持，添加消息监听器');
    navigator.serviceWorker.addEventListener('message', function (event) {
      if (event.data && event.data.type === 'FETCH' && event.data.url && event.data.url.includes(CONFIG.sourceUrl)) {
        log('拦截到 Service Worker 请求:', event.data.url);
        event.data.url = getCurrentMirrorUrl();
        log('重定向到:', event.data.url);
      }
    });
  }

  // 格式化时间差
  function formatTimeDiff(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = now.getTime() - targetDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) return `${years} 年前`;
    if (months > 0) return `${months} 个月前`;
    if (days > 0) return `${days} 天前`;
    if (hours > 0) return `${hours} 小时前`;
    if (minutes > 0) return `${minutes} 分钟前`;
    return `${seconds} 秒前`;
  }

  // 查找插件数据
  function findPluginData(packageName) {
    if (!registryData || !registryData.objects || !Array.isArray(registryData.objects)) {
      error('注册表数据不可用或格式不正确');
      return null;
    }

    // 从 URL 中提取包名
    let shortPackageName = packageName;
    if (typeof packageName === 'string') {
      shortPackageName = packageName.replace('https://www.npmjs.com/package/', '').replace('https://www.npmjs.com/', '');
    }

    // 在 objects 数组中查找匹配的插件
    for (const item of registryData.objects) {
      if (item && item.package && item.package.name === shortPackageName) {
        return item;
      }
    }

    // 如果没有找到完全匹配的
    for (const item of registryData.objects) {
      if (item && item.package && item.package.name) {
        // 检查是否是 scoped 包，并进行匹配
        if (item.package.name === shortPackageName || item.package.name.endsWith('/' + shortPackageName)) {
          return item;
        }
      }
    }
    error('未找到插件数据:', shortPackageName);
    return null;
  }

  // 修复时间显示功能
  function fixTimeDisplay(tooltipElement, packageName) {
    try {
      // 查找对应的插件数据
      const pluginData = findPluginData(packageName);
      if (pluginData && pluginData.package && pluginData.package.date) {
        const formattedTime = formatTimeDiff(pluginData.package.date);
        tooltipElement.textContent = formattedTime;
      } else {
        error('未找到有效的时间数据');
      }
    } catch (err) {
      error('修复时间显示时发生错误:', err);
    }
  }

  // 监听工具提示的显示
  function initTimeFixing() {
    log('开始初始化时间修复功能');

    // 创建一个 MutationObserver 来监听 DOM 变化
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            // 检查是否是工具提示元素
            if (node.nodeType === 1 && node.classList && node.classList.contains('el-popper')) {
              // 检查是否包含 "{0} 小时前" 这样的文本
              const tooltipContent = node.textContent;
              if (tooltipContent && (tooltipContent.includes('{0}') || tooltipContent.includes('小时前') || tooltipContent.includes('分钟前') || tooltipContent.includes('天前'))) {
                // 查找当前悬停的元素
                const hoveredElements = document.querySelectorAll(':hover');
                for (const element of hoveredElements) {
                  const anchorElement = element;
                  if (anchorElement.tagName === 'A' && anchorElement.href && anchorElement.href.includes('npmjs.com')) {
                    // 修改为更宽泛的匹配
                    const tooltipSpan = node.querySelector('span');
                    if (tooltipSpan) {
                      fixTimeDisplay(tooltipSpan, anchorElement.href);
                    } else {
                      error('未找到工具提示内的span元素');
                    }
                    break;
                  }
                }
              }
            }
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    log('已初始化时间修复功能');
  }

  // 修复并优化时间戳显示
  function fixTimestampVisibility() {
    let intervalId = null; // 用于存储定时器ID，以便在需要时清除

    const observer = new MutationObserver((mutations, obs) => {
      const infoElement = document.querySelector('.info');

      // 确保 infoElement 存在且尚未处理
      if (infoElement && !infoElement.dataset.timestampFixed) {
        const timestampElement = infoElement.querySelector('.timestamp');
        if (timestampElement) {
          // 标记为已处理，防止重复执行
          infoElement.dataset.timestampFixed = 'true';
          const timestampText = timestampElement.textContent.match(/\((.*)\)/);
          if (!timestampText || !timestampText[1]) {
            log('无法从.info元素中解析时间戳');
            return;
          }
          const timeString = timestampText[1];
          // 将 yyyy/MM/dd HH:mm:ss 格式转换为 Date 对象
          const lastUpdateTime = new Date(timeString.replace(/\//g, '-'));
          if (isNaN(lastUpdateTime.getTime())) {
            error('解析时间失败:', timeString);
            return;
          }

          // 隐藏原始时间戳而不是移除，以备后用
          timestampElement.style.display = 'none';

          // 创建新的容器来展示优化后的时间信息
          const timeInfoContainer = document.createElement('div');
          timeInfoContainer.className = 'time-info-container';
          timeInfoContainer.style.cssText = `
                        margin-top: 4px;
                        font-size: 0.9em;
                        color: var(--vp-c-text-2);
                        text-align: center;
                    `;
          const lastUpdateElement = document.createElement('div');
          lastUpdateElement.className = 'last-update';
          lastUpdateElement.textContent = `最后更新时间 ${timeString}`;
          const timeDiffElement = document.createElement('div');
          timeDiffElement.className = 'time-diff';
          timeDiffElement.style.marginTop = '2px';
          timeInfoContainer.appendChild(lastUpdateElement);
          timeInfoContainer.appendChild(timeDiffElement);

          // 将新容器插入到 .info 元素之后
          infoElement.insertAdjacentElement('afterend', timeInfoContainer);

          // 清除之前的定时器（如果有）
          if (intervalId) {
            clearInterval(intervalId);
          }
          const updateTimeDiff = () => {
            const now = new Date();
            const diff = now.getTime() - lastUpdateTime.getTime();

            // 确保时间差为正值
            if (diff < 0) {
              timeDiffElement.textContent = '更新时间在未来';
              return;
            }
            const totalSeconds = Math.floor(diff / 1000);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor(totalSeconds % 3600 / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            timeDiffElement.textContent = `距离上次更新已经过去 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
          };
          updateTimeDiff();
          intervalId = setInterval(updateTimeDiff, 1000);
          log('时间戳显示已优化');

          // 成功处理后，可以断开观察以节省资源
          obs.disconnect();
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    log('已启动时间戳优化观察器');
  }
  log('脚本已启动 —————— 将', CONFIG.sourceUrl, '重定向到多个备用镜像源，当前使用:', getCurrentMirrorUrl());
})();
/******/ })()
;