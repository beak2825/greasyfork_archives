
// ==UserScript==
// @name        🐭️ MouseHunt - Mapper
// @version     0.9.1
// @description maps r fun
// @license     MIT
// @author      brap
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mouse.png
// @run-at      document-end
// @require     https://greasyfork.org/scripts/464008-mousehunt-utils-beta/code/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20Utils%20Beta.js?version=1205556
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/459448/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/459448/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Mapper.meta.js
// ==/UserScript==

(function () {
'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$n =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var objectGetOwnPropertyDescriptor = {};

var fails$n = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$m = fails$n;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails$m(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var fails$l = fails$n;

var functionBindNative = !fails$l(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var NATIVE_BIND$3 = functionBindNative;

var call$g = Function.prototype.call;

var functionCall = NATIVE_BIND$3 ? call$g.bind(call$g) : function () {
  return call$g.apply(call$g, arguments);
};

var objectPropertyIsEnumerable = {};

var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$3 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$3(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable$1;

var createPropertyDescriptor$3 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var NATIVE_BIND$2 = functionBindNative;

var FunctionPrototype$3 = Function.prototype;
var call$f = FunctionPrototype$3.call;
var uncurryThisWithBind = NATIVE_BIND$2 && FunctionPrototype$3.bind.bind(call$f, call$f);

var functionUncurryThis = NATIVE_BIND$2 ? uncurryThisWithBind : function (fn) {
  return function () {
    return call$f.apply(fn, arguments);
  };
};

var uncurryThis$t = functionUncurryThis;

var toString$c = uncurryThis$t({}.toString);
var stringSlice$4 = uncurryThis$t(''.slice);

var classofRaw$2 = function (it) {
  return stringSlice$4(toString$c(it), 8, -1);
};

var uncurryThis$s = functionUncurryThis;
var fails$k = fails$n;
var classof$9 = classofRaw$2;

var $Object$3 = Object;
var split = uncurryThis$s(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails$k(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object$3('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof$9(it) == 'String' ? split(it, '') : $Object$3(it);
} : $Object$3;

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
var isNullOrUndefined$5 = function (it) {
  return it === null || it === undefined;
};

var isNullOrUndefined$4 = isNullOrUndefined$5;

var $TypeError$i = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$8 = function (it) {
  if (isNullOrUndefined$4(it)) throw $TypeError$i("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings
var IndexedObject$3 = indexedObject;
var requireObjectCoercible$7 = requireObjectCoercible$8;

var toIndexedObject$7 = function (it) {
  return IndexedObject$3(requireObjectCoercible$7(it));
};

var documentAll$2 = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

var documentAll_1 = {
  all: documentAll$2,
  IS_HTMLDDA: IS_HTMLDDA
};

var $documentAll$1 = documentAll_1;

var documentAll$1 = $documentAll$1.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable$j = $documentAll$1.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll$1;
} : function (argument) {
  return typeof argument == 'function';
};

var isCallable$i = isCallable$j;
var $documentAll = documentAll_1;

var documentAll = $documentAll.all;

var isObject$b = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable$i(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable$i(it);
};

var global$m = global$n;
var isCallable$h = isCallable$j;

var aFunction = function (argument) {
  return isCallable$h(argument) ? argument : undefined;
};

var getBuiltIn$7 = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$m[namespace]) : global$m[namespace] && global$m[namespace][method];
};

var uncurryThis$r = functionUncurryThis;

var objectIsPrototypeOf = uncurryThis$r({}.isPrototypeOf);

var engineUserAgent = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

var global$l = global$n;
var userAgent$5 = engineUserAgent;

var process$4 = global$l.process;
var Deno$1 = global$l.Deno;
var versions = process$4 && process$4.versions || Deno$1 && Deno$1.version;
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
if (!version && userAgent$5) {
  match = userAgent$5.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent$5.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

var engineV8Version = version;

/* eslint-disable es/no-symbol -- required for testing */

var V8_VERSION$3 = engineV8Version;
var fails$j = fails$n;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$j(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION$3 && V8_VERSION$3 < 41;
});

/* eslint-disable es/no-symbol -- required for testing */

var NATIVE_SYMBOL$1 = symbolConstructorDetection;

var useSymbolAsUid = NATIVE_SYMBOL$1
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var getBuiltIn$6 = getBuiltIn$7;
var isCallable$g = isCallable$j;
var isPrototypeOf$3 = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

var $Object$2 = Object;

var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn$6('Symbol');
  return isCallable$g($Symbol) && isPrototypeOf$3($Symbol.prototype, $Object$2(it));
};

var $String$5 = String;

var tryToString$5 = function (argument) {
  try {
    return $String$5(argument);
  } catch (error) {
    return 'Object';
  }
};

var isCallable$f = isCallable$j;
var tryToString$4 = tryToString$5;

var $TypeError$h = TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable$a = function (argument) {
  if (isCallable$f(argument)) return argument;
  throw $TypeError$h(tryToString$4(argument) + ' is not a function');
};

var aCallable$9 = aCallable$a;
var isNullOrUndefined$3 = isNullOrUndefined$5;

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod$4 = function (V, P) {
  var func = V[P];
  return isNullOrUndefined$3(func) ? undefined : aCallable$9(func);
};

var call$e = functionCall;
var isCallable$e = isCallable$j;
var isObject$a = isObject$b;

var $TypeError$g = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive$1 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable$e(fn = input.toString) && !isObject$a(val = call$e(fn, input))) return val;
  if (isCallable$e(fn = input.valueOf) && !isObject$a(val = call$e(fn, input))) return val;
  if (pref !== 'string' && isCallable$e(fn = input.toString) && !isObject$a(val = call$e(fn, input))) return val;
  throw $TypeError$g("Can't convert object to primitive value");
};

var shared$4 = {exports: {}};

var global$k = global$n;

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$4 = Object.defineProperty;

var defineGlobalProperty$3 = function (key, value) {
  try {
    defineProperty$4(global$k, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$k[key] = value;
  } return value;
};

var global$j = global$n;
var defineGlobalProperty$2 = defineGlobalProperty$3;

var SHARED = '__core-js_shared__';
var store$3 = global$j[SHARED] || defineGlobalProperty$2(SHARED, {});

var sharedStore = store$3;

var store$2 = sharedStore;

(shared$4.exports = function (key, value) {
  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.30.0',
  mode: 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.30.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

var requireObjectCoercible$6 = requireObjectCoercible$8;

var $Object$1 = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject$6 = function (argument) {
  return $Object$1(requireObjectCoercible$6(argument));
};

var uncurryThis$q = functionUncurryThis;
var toObject$5 = toObject$6;

var hasOwnProperty = uncurryThis$q({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject$5(it), key);
};

var uncurryThis$p = functionUncurryThis;

var id = 0;
var postfix = Math.random();
var toString$b = uncurryThis$p(1.0.toString);

var uid$2 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$b(++id + postfix, 36);
};

var global$i = global$n;
var shared$3 = shared$4.exports;
var hasOwn$9 = hasOwnProperty_1;
var uid$1 = uid$2;
var NATIVE_SYMBOL = symbolConstructorDetection;
var USE_SYMBOL_AS_UID = useSymbolAsUid;

var Symbol$2 = global$i.Symbol;
var WellKnownSymbolsStore = shared$3('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$2['for'] || Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid$1;

var wellKnownSymbol$i = function (name) {
  if (!hasOwn$9(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn$9(Symbol$2, name)
      ? Symbol$2[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var call$d = functionCall;
var isObject$9 = isObject$b;
var isSymbol$1 = isSymbol$2;
var getMethod$3 = getMethod$4;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol$h = wellKnownSymbol$i;

var $TypeError$f = TypeError;
var TO_PRIMITIVE = wellKnownSymbol$h('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive$1 = function (input, pref) {
  if (!isObject$9(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod$3(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call$d(exoticToPrim, input, pref);
    if (!isObject$9(result) || isSymbol$1(result)) return result;
    throw $TypeError$f("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPrimitive = toPrimitive$1;
var isSymbol = isSymbol$2;

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey$3 = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var global$h = global$n;
var isObject$8 = isObject$b;

var document$3 = global$h.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$8(document$3) && isObject$8(document$3.createElement);

var documentCreateElement$2 = function (it) {
  return EXISTS$1 ? document$3.createElement(it) : {};
};

var DESCRIPTORS$b = descriptors;
var fails$i = fails$n;
var createElement$1 = documentCreateElement$2;

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !DESCRIPTORS$b && !fails$i(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement$1('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var DESCRIPTORS$a = descriptors;
var call$c = functionCall;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var createPropertyDescriptor$2 = createPropertyDescriptor$3;
var toIndexedObject$6 = toIndexedObject$7;
var toPropertyKey$2 = toPropertyKey$3;
var hasOwn$8 = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$a ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$6(O);
  P = toPropertyKey$2(P);
  if (IE8_DOM_DEFINE$1) try {
    return $getOwnPropertyDescriptor$1(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn$8(O, P)) return createPropertyDescriptor$2(!call$c(propertyIsEnumerableModule.f, O, P), O[P]);
};

var objectDefineProperty = {};

var DESCRIPTORS$9 = descriptors;
var fails$h = fails$n;

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = DESCRIPTORS$9 && fails$h(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

var isObject$7 = isObject$b;

var $String$4 = String;
var $TypeError$e = TypeError;

// `Assert: Type(argument) is Object`
var anObject$e = function (argument) {
  if (isObject$7(argument)) return argument;
  throw $TypeError$e($String$4(argument) + ' is not an object');
};

var DESCRIPTORS$8 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
var anObject$d = anObject$e;
var toPropertyKey$1 = toPropertyKey$3;

var $TypeError$d = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
objectDefineProperty.f = DESCRIPTORS$8 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
  anObject$d(O);
  P = toPropertyKey$1(P);
  anObject$d(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject$d(O);
  P = toPropertyKey$1(P);
  anObject$d(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError$d('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS$7 = descriptors;
var definePropertyModule$4 = objectDefineProperty;
var createPropertyDescriptor$1 = createPropertyDescriptor$3;

var createNonEnumerableProperty$4 = DESCRIPTORS$7 ? function (object, key, value) {
  return definePropertyModule$4.f(object, key, createPropertyDescriptor$1(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var makeBuiltIn$3 = {exports: {}};

var DESCRIPTORS$6 = descriptors;
var hasOwn$7 = hasOwnProperty_1;

var FunctionPrototype$2 = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS$6 && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn$7(FunctionPrototype$2, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$6 || (DESCRIPTORS$6 && getDescriptor(FunctionPrototype$2, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var uncurryThis$o = functionUncurryThis;
var isCallable$d = isCallable$j;
var store$1 = sharedStore;

var functionToString$1 = uncurryThis$o(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable$d(store$1.inspectSource)) {
  store$1.inspectSource = function (it) {
    return functionToString$1(it);
  };
}

var inspectSource$3 = store$1.inspectSource;

var global$g = global$n;
var isCallable$c = isCallable$j;

var WeakMap$1 = global$g.WeakMap;

var weakMapBasicDetection = isCallable$c(WeakMap$1) && /native code/.test(String(WeakMap$1));

var shared$2 = shared$4.exports;
var uid = uid$2;

var keys = shared$2('keys');

var sharedKey$2 = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys$4 = {};

var NATIVE_WEAK_MAP = weakMapBasicDetection;
var global$f = global$n;
var isObject$6 = isObject$b;
var createNonEnumerableProperty$3 = createNonEnumerableProperty$4;
var hasOwn$6 = hasOwnProperty_1;
var shared$1 = sharedStore;
var sharedKey$1 = sharedKey$2;
var hiddenKeys$3 = hiddenKeys$4;

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$2 = global$f.TypeError;
var WeakMap = global$f.WeakMap;
var set$1, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set$1(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$6(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$2('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared$1.state) {
  var store = shared$1.state || (shared$1.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set$1 = function (it, metadata) {
    if (store.has(it)) throw TypeError$2(OBJECT_ALREADY_INITIALIZED);
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
  var STATE = sharedKey$1('state');
  hiddenKeys$3[STATE] = true;
  set$1 = function (it, metadata) {
    if (hasOwn$6(it, STATE)) throw TypeError$2(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$3(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn$6(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn$6(it, STATE);
  };
}

var internalState = {
  set: set$1,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var uncurryThis$n = functionUncurryThis;
var fails$g = fails$n;
var isCallable$b = isCallable$j;
var hasOwn$5 = hasOwnProperty_1;
var DESCRIPTORS$5 = descriptors;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var inspectSource$2 = inspectSource$3;
var InternalStateModule$1 = internalState;

var enforceInternalState = InternalStateModule$1.enforce;
var getInternalState$1 = InternalStateModule$1.get;
var $String$3 = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty$3 = Object.defineProperty;
var stringSlice$3 = uncurryThis$n(''.slice);
var replace$3 = uncurryThis$n(''.replace);
var join = uncurryThis$n([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS$5 && !fails$g(function () {
  return defineProperty$3(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn$2 = makeBuiltIn$3.exports = function (value, name, options) {
  if (stringSlice$3($String$3(name), 0, 7) === 'Symbol(') {
    name = '[' + replace$3($String$3(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn$5(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS$5) defineProperty$3(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$5(options, 'arity') && value.length !== options.arity) {
    defineProperty$3(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn$5(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS$5) defineProperty$3(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn$5(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn$2(function toString() {
  return isCallable$b(this) && getInternalState$1(this).source || inspectSource$2(this);
}, 'toString');

var isCallable$a = isCallable$j;
var definePropertyModule$3 = objectDefineProperty;
var makeBuiltIn$1 = makeBuiltIn$3.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;

var defineBuiltIn$7 = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable$a(value)) makeBuiltIn$1(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule$3.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

var objectGetOwnPropertyNames = {};

var ceil = Math.ceil;
var floor$2 = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor$2 : ceil)(n);
};

var trunc = mathTrunc;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity$6 = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

var toIntegerOrInfinity$5 = toIntegerOrInfinity$6;

var max$3 = Math.max;
var min$2 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$4 = function (index, length) {
  var integer = toIntegerOrInfinity$5(index);
  return integer < 0 ? max$3(integer + length, 0) : min$2(integer, length);
};

var toIntegerOrInfinity$4 = toIntegerOrInfinity$6;

var min$1 = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength$2 = function (argument) {
  return argument > 0 ? min$1(toIntegerOrInfinity$4(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var toLength$1 = toLength$2;

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike$9 = function (obj) {
  return toLength$1(obj.length);
};

var toIndexedObject$5 = toIndexedObject$7;
var toAbsoluteIndex$3 = toAbsoluteIndex$4;
var lengthOfArrayLike$8 = lengthOfArrayLike$9;

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$5 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject$5($this);
    var length = lengthOfArrayLike$8(O);
    var index = toAbsoluteIndex$3(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$5(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$5(false)
};

var uncurryThis$m = functionUncurryThis;
var hasOwn$4 = hasOwnProperty_1;
var toIndexedObject$4 = toIndexedObject$7;
var indexOf$1 = arrayIncludes.indexOf;
var hiddenKeys$2 = hiddenKeys$4;

var push$3 = uncurryThis$m([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject$4(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn$4(hiddenKeys$2, key) && hasOwn$4(O, key) && push$3(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn$4(O, key = names[i++])) {
    ~indexOf$1(result, key) || push$3(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys$3 = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$2 = enumBugKeys$3;

var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys$1(O, hiddenKeys$1);
};

var objectGetOwnPropertySymbols = {};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

var getBuiltIn$5 = getBuiltIn$7;
var uncurryThis$l = functionUncurryThis;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var anObject$c = anObject$e;

var concat = uncurryThis$l([].concat);

// all object keys, includes non-enumerable and symbols
var ownKeys$1 = getBuiltIn$5('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject$c(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

var hasOwn$3 = hasOwnProperty_1;
var ownKeys = ownKeys$1;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule$2 = objectDefineProperty;

var copyConstructorProperties$1 = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule$2.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn$3(target, key) && !(exceptions && hasOwn$3(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var fails$f = fails$n;
var isCallable$9 = isCallable$j;

var replacement = /#|\.prototype\./;

var isForced$2 = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable$9(detection) ? fails$f(detection)
    : !!detection;
};

var normalize = isForced$2.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced$2.data = {};
var NATIVE = isForced$2.NATIVE = 'N';
var POLYFILL = isForced$2.POLYFILL = 'P';

var isForced_1 = isForced$2;

var global$e = global$n;
var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty$2 = createNonEnumerableProperty$4;
var defineBuiltIn$6 = defineBuiltIn$7;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties = copyConstructorProperties$1;
var isForced$1 = isForced_1;

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
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$e;
  } else if (STATIC) {
    target = global$e[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global$e[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor$2(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty$2(sourceProperty, 'sham', true);
    }
    defineBuiltIn$6(target, key, sourceProperty, options);
  }
};

var wellKnownSymbol$g = wellKnownSymbol$i;

var TO_STRING_TAG$2 = wellKnownSymbol$g('toStringTag');
var test$1 = {};

test$1[TO_STRING_TAG$2] = 'z';

var toStringTagSupport = String(test$1) === '[object z]';

var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
var isCallable$8 = isCallable$j;
var classofRaw$1 = classofRaw$2;
var wellKnownSymbol$f = wellKnownSymbol$i;

var TO_STRING_TAG$1 = wellKnownSymbol$f('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw$1(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof$8 = TO_STRING_TAG_SUPPORT$2 ? classofRaw$1 : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw$1(O)
    // ES3 arguments fallback
    : (result = classofRaw$1(O)) == 'Object' && isCallable$8(O.callee) ? 'Arguments' : result;
};

var classof$7 = classof$8;

var $String$2 = String;

var toString$a = function (argument) {
  if (classof$7(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String$2(argument);
};

var anObject$b = anObject$e;

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags$1 = function () {
  var that = anObject$b(this);
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

var fails$e = fails$n;
var global$d = global$n;

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp$2 = global$d.RegExp;

var UNSUPPORTED_Y$1 = fails$e(function () {
  var re = $RegExp$2('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y$1 || fails$e(function () {
  return !$RegExp$2('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y$1 || fails$e(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp$2('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y$1
};

var objectDefineProperties = {};

var internalObjectKeys = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$3;

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys$2 = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys$1);
};

var DESCRIPTORS$4 = descriptors;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var definePropertyModule$1 = objectDefineProperty;
var anObject$a = anObject$e;
var toIndexedObject$3 = toIndexedObject$7;
var objectKeys$1 = objectKeys$2;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
objectDefineProperties.f = DESCRIPTORS$4 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject$a(O);
  var props = toIndexedObject$3(Properties);
  var keys = objectKeys$1(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule$1.f(O, key = keys[index++], props[key]);
  return O;
};

var getBuiltIn$4 = getBuiltIn$7;

var html$2 = getBuiltIn$4('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */

var anObject$9 = anObject$e;
var definePropertiesModule = objectDefineProperties;
var enumBugKeys = enumBugKeys$3;
var hiddenKeys = hiddenKeys$4;
var html$1 = html$2;
var documentCreateElement$1 = documentCreateElement$2;
var sharedKey = sharedKey$2;

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
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement$1('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html$1.appendChild(iframe);
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
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject$9(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

var fails$d = fails$n;
var global$c = global$n;

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp$1 = global$c.RegExp;

var regexpUnsupportedDotAll = fails$d(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

var fails$c = fails$n;
var global$b = global$n;

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global$b.RegExp;

var regexpUnsupportedNcg = fails$c(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call$b = functionCall;
var uncurryThis$k = functionUncurryThis;
var toString$9 = toString$a;
var regexpFlags = regexpFlags$1;
var stickyHelpers = regexpStickyHelpers;
var shared = shared$4.exports;
var create$1 = objectCreate;
var getInternalState = internalState.get;
var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
var UNSUPPORTED_NCG = regexpUnsupportedNcg;

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt$2 = uncurryThis$k(''.charAt);
var indexOf = uncurryThis$k(''.indexOf);
var replace$2 = uncurryThis$k(''.replace);
var stringSlice$2 = uncurryThis$k(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call$b(nativeExec, re1, 'a');
  call$b(nativeExec, re2, 'a');
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
    var str = toString$9(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call$b(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call$b(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace$2(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice$2(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$2(str, re.lastIndex - 1) !== '\n')) {
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

    match = call$b(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice$2(match.input, charsAdded);
        match[0] = stringSlice$2(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call$b(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create$1(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

var regexpExec$2 = patchedExec;

var $$p = _export;
var exec$2 = regexpExec$2;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$$p({ target: 'RegExp', proto: true, forced: /./.exec !== exec$2 }, {
  exec: exec$2
});

var classofRaw = classofRaw$2;
var uncurryThis$j = functionUncurryThis;

var functionUncurryThisClause = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis$j(fn);
};

// TODO: Remove from `core-js@4` since it's moved to entry points

var uncurryThis$i = functionUncurryThisClause;
var defineBuiltIn$5 = defineBuiltIn$7;
var regexpExec$1 = regexpExec$2;
var fails$b = fails$n;
var wellKnownSymbol$e = wellKnownSymbol$i;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$4;

var SPECIES$6 = wellKnownSymbol$e('species');
var RegExpPrototype$2 = RegExp.prototype;

var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol$e(KEY);

  var DELEGATES_TO_SYMBOL = !fails$b(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$b(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$6] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis$i(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis$i(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec$1 || $exec === RegExpPrototype$2.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn$5(String.prototype, KEY, methods[0]);
    defineBuiltIn$5(RegExpPrototype$2, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty$1(RegExpPrototype$2[SYMBOL], 'sham', true);
};

var uncurryThis$h = functionUncurryThis;
var toIntegerOrInfinity$3 = toIntegerOrInfinity$6;
var toString$8 = toString$a;
var requireObjectCoercible$5 = requireObjectCoercible$8;

var charAt$1 = uncurryThis$h(''.charAt);
var charCodeAt = uncurryThis$h(''.charCodeAt);
var stringSlice$1 = uncurryThis$h(''.slice);

var createMethod$4 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString$8(requireObjectCoercible$5($this));
    var position = toIntegerOrInfinity$3(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt$1(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice$1(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$4(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$4(true)
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex$1 = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

var call$a = functionCall;
var anObject$8 = anObject$e;
var isCallable$7 = isCallable$j;
var classof$6 = classofRaw$2;
var regexpExec = regexpExec$2;

var $TypeError$c = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (isCallable$7(exec)) {
    var result = call$a(exec, R, S);
    if (result !== null) anObject$8(result);
    return result;
  }
  if (classof$6(R) === 'RegExp') return call$a(regexpExec, R, S);
  throw $TypeError$c('RegExp#exec called on incompatible receiver');
};

var call$9 = functionCall;
var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
var anObject$7 = anObject$e;
var isNullOrUndefined$2 = isNullOrUndefined$5;
var toLength = toLength$2;
var toString$7 = toString$a;
var requireObjectCoercible$4 = requireObjectCoercible$8;
var getMethod$2 = getMethod$4;
var advanceStringIndex = advanceStringIndex$1;
var regExpExec$1 = regexpExecAbstract;

// @@match logic
fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible$4(this);
      var matcher = isNullOrUndefined$2(regexp) ? undefined : getMethod$2(regexp, MATCH);
      return matcher ? call$9(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$7(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject$7(this);
      var S = toString$7(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regExpExec$1(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec$1(rx, S)) !== null) {
        var matchStr = toString$7(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

var NATIVE_BIND$1 = functionBindNative;

var FunctionPrototype$1 = Function.prototype;
var apply$2 = FunctionPrototype$1.apply;
var call$8 = FunctionPrototype$1.call;

// eslint-disable-next-line es/no-reflect -- safe
var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$1 ? call$8.bind(apply$2) : function () {
  return call$8.apply(apply$2, arguments);
});

/* global Bun -- Deno case */

var engineIsBun = typeof Bun == 'function' && Bun && typeof Bun.version == 'string';

var uncurryThis$g = functionUncurryThis;

var arraySlice$3 = uncurryThis$g([].slice);

var $TypeError$b = TypeError;

var validateArgumentsLength$2 = function (passed, required) {
  if (passed < required) throw $TypeError$b('Not enough arguments');
  return passed;
};

var global$a = global$n;
var apply$1 = functionApply;
var isCallable$6 = isCallable$j;
var ENGINE_IS_BUN = engineIsBun;
var USER_AGENT = engineUserAgent;
var arraySlice$2 = arraySlice$3;
var validateArgumentsLength$1 = validateArgumentsLength$2;

var Function$2 = global$a.Function;
// dirty IE9- and Bun 0.3.0- checks
var WRAP = /MSIE .\./.test(USER_AGENT) || ENGINE_IS_BUN && (function () {
  var version = global$a.Bun.version.split('.');
  return version.length < 3 || version[0] == 0 && (version[1] < 3 || version[1] == 3 && version[2] == 0);
})();

// IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
// https://github.com/oven-sh/bun/issues/1633
var schedulersFix$2 = function (scheduler, hasTimeArg) {
  var firstParamIndex = hasTimeArg ? 2 : 1;
  return WRAP ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength$1(arguments.length, 1) > firstParamIndex;
    var fn = isCallable$6(handler) ? handler : Function$2(handler);
    var params = boundArgs ? arraySlice$2(arguments, firstParamIndex) : [];
    var callback = boundArgs ? function () {
      apply$1(fn, this, params);
    } : fn;
    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
  } : scheduler;
};

var $$o = _export;
var global$9 = global$n;
var schedulersFix$1 = schedulersFix$2;

var setInterval$1 = schedulersFix$1(global$9.setInterval, true);

// Bun / IE9- setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
$$o({ global: true, bind: true, forced: global$9.setInterval !== setInterval$1 }, {
  setInterval: setInterval$1
});

var $$n = _export;
var global$8 = global$n;
var schedulersFix = schedulersFix$2;

var setTimeout$1 = schedulersFix(global$8.setTimeout, true);

// Bun / IE9- setTimeout additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
$$n({ global: true, bind: true, forced: global$8.setTimeout !== setTimeout$1 }, {
  setTimeout: setTimeout$1
});

var sky_palace = {
	categories: [
		{
			name: "Arcane",
			id: "esp-arcane",
			icon: "/powertypes/arcane.png",
			color: "#b4ffff",
			mice: [
				"sky_dancer",
				"sky_glass_glazier",
				"sky_glass_sorcerer",
				{
					mouse: "arcane_paragon",
					subcategory: "hai"
				},
				{
					mouse: "sky_highborne",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_arcane_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Draconic",
			id: "esp-draconic",
			icon: "/powertypes/draconic.png",
			color: "#cf9e64",
			mice: [
				"dragon_breather",
				"dragon_lancer",
				"tiny_dragonfly",
				{
					mouse: "draconic_paragon",
					subcategory: "hai"
				},
				{
					mouse: "regal_spearman",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_draconic_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Forgotten",
			id: "esp-forgotten",
			icon: "/powertypes/forgotten.png",
			color: "#c37aa1",
			mice: [
				"cumulost",
				"spry_sky_explorer",
				"spry_sky_seer",
				{
					mouse: "forgotten_paragon",
					subcategory: "hai"
				},
				{
					mouse: "spheric_diviner",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_forgotten_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Hydro",
			id: "esp-hydro",
			icon: "/powertypes/hydro.png",
			color: "#a0dcff",
			mice: [
				"cute_cloud_conjurer",
				"nimbomancer",
				"sky_surfer",
				{
					mouse: "hydro_paragon",
					subcategory: "hai"
				},
				{
					mouse: "mist_maker",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_hydro_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Law",
			id: "esp-law",
			icon: "/powertypes/law.png",
			color: "#efcf86",
			mice: [
				"devious_gentleman",
				"lawbender",
				"stack_of_thieves",
				{
					mouse: "law_paragon",
					subcategory: "hai"
				},
				{
					mouse: "agent_m",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_law_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Physical",
			id: "esp-physical",
			icon: "/powertypes/physical.png",
			color: "#d98181",
			mice: [
				"ground_gavaleer",
				"heracles",
				"sky_swordsman",
				{
					mouse: "physical_paragon",
					subcategory: "hai"
				},
				{
					mouse: "sky_squire",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_physical_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Shadow",
			id: "esp-shadow",
			icon: "/powertypes/shadow.png",
			color: "#a4c0c1",
			mice: [
				"astrological_astronomer",
				"overcaster",
				"stratocaster",
				{
					mouse: "shadow_paragon",
					subcategory: "hai"
				},
				{
					mouse: "shadow_sage",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_shadow_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Tactical",
			id: "esp-tactical",
			icon: "/powertypes/tactical.png",
			color: "#cc8282",
			mice: [
				"gyrologer",
				"seasoned_islandographer",
				"worried_wayfinder",
				{
					mouse: "tactical_paragon",
					subcategory: "hai"
				},
				{
					mouse: "captain_cloudkicker",
					subcategory: "hai"
				},
				{
					mouse: "empyrean_tactical_mouse",
					subcategory: "sp"
				}
			]
		},
		{
			name: "Sky Palace",
			id: "esp-sky_palace",
			icon: "/items/stats/large/dd362c178b67d5e45fda7b2da273e7d6.png",
			color: "#a3fec4",
			mice: [
				"empyrean_charm_hoarder",
				"empyrean_oreglass_miner",
				"empyrean_cloudstone_miner",
				"empyrean_treasure_guardian"
			]
		},
		{
			name: "Pirates",
			id: "esp-pirates",
			icon: "/items/bait/large/1e7bf5043a13043d8f1d05a752d55469.png",
			color: "#f173bf",
			mice: [
				"admiral_cloudbeard",
				"cutthroat_cannoneer",
				"cutthroat_pirate",
				"mairitime_pirate",
				"empyrean_pirate",
				"scarlet_revenger",
				"suave_pirate"
			]
		},
		{
			name: "Other",
			icon: "/items/stats/large/66b6a6a48a0c83cec5a15a286bd17749.png",
			color: "#",
			mice: [
				"daydreamer",
				"kite_flyer",
				"richard_rich",
				"empyrean_loot_cache_guardian"
			]
		},
		{
			name: "Wardens",
			id: "esp-wardens",
			icon: "/items/convertibles/large/017121852a8cc100b40bdaeae01485db.png",
			color: "#d3bdd3",
			mice: [
				"fog_warden",
				"frost_warden",
				"rain_warden",
				"wind_warden"
			]
		},
		{
			name: "Launchpad",
			id: "esp-launchpad",
			icon: "/items/stats/large/66b6a6a48a0c83cec5a15a286bd17749.png",
			color: "#c2c2c2",
			mice: [
				"cloud_miner",
				"launchpad_labourer",
				"sky_greaser",
				"skydiver"
			]
		}
	],
	subcategories: [
		{
			id: "hai",
			name: "High Altitude Island"
		},
		{
			id: "sp",
			name: "Sky Palace"
		}
	]
};
var folklore_forest_prelude = {
	categories: [
		{
			name: "Farm",
			id: "fofo-farm",
			icon: "/folklore_forest_upgrades/farm_plot_2_thumb.png",
			color: "#d7b18b",
			mice: [
				"angry_aphid",
				"grit_grifter",
				"crazed_cultivator",
				"mighty_mite",
				"wily_weevil",
				{
					mouse: "crazed_cultivator",
					subcategory: "sb"
				},
				{
					mouse: "land_loafer",
					subcategory: "zero-plants"
				},
				{
					mouse: "loathsome_locust",
					subcategory: "three-papyrus"
				}
			]
		},
		{
			name: "Prologue Pond",
			id: "fofo-pond",
			icon: "/folklore_forest_upgrades/tackle_box_thumb.png",
			color: "#c3def5",
			mice: [
				"beachcomber",
				"sand_sifter",
				"tackle_tracker",
				{
					mouse: "covetous_coastguard",
					subcategory: "sb"
				}
			]
		},
		{
			name: "Prologue Pond",
			subtitle: "Grubben",
			icon: "/items/bait/large/90d54a45bde5a369b22d53ee5362e701.png",
			color: "#fbc3fa",
			mice: [
				"pompous_perch",
				"careless_catfish",
				"melodramatic_minnow"
			]
		},
		{
			name: "Prologue Pond",
			subtitle: "Clamebert",
			icon: "/items/bait/large/bdef6fb2ed84af400a941e2fd1b0ec03.png",
			color: "#f3e0ff",
			mice: [
				"nefarious_nautilus",
				"vicious_vampire_squid",
				"sinister_squid"
			]
		},
		{
			name: "Table of Contents",
			subtitle: "Not Writing",
			id: "fofo-toc-not-writing",
			icon: "/folklore_forest_upgrades/silver_quill_thumb.png",
			mice: [
				"brothers_grimmaus",
				"hans_cheesetian_squeakersen",
				"madame_dormouse",
				{
					mouse: "matriarch_gander",
					subcategory: "sb"
				}
			]
		},
		{
			name: "Table of Contents",
			subtitle: "Writing",
			id: "fofo-toc-writing",
			icon: "/folklore_forest_upgrades/golden_quill_thumb.png",
			color: "#e9c390",
			mice: [
				"humphrey_dumphrey",
				"little_bo_squeak",
				"little_miss_fluffet"
			]
		},
		{
			name: "Table of Contents",
			subtitle: "Writing - First Draft",
			id: "fofo-toc-first-draft",
			icon: "/items/bait/large/9782ba50ed4c64f8f8412563cf2ce709.png",
			mice: [
				"fibbocchio",
				"pinkielina",
				"princess_and_the_olive"
			]
		},
		{
			name: "Table of Contents",
			subtitle: "Writing - Second Draft",
			id: "fofo-toc-second-draft",
			icon: "/items/bait/large/e0cb22771eba37bf047a801edbf7f91e.png",
			mice: [
				"flamboyant_flautist",
				"greenbeard",
				"ice_regent"
			]
		},
		{
			name: "Bosses",
			id: "fofo-bosses",
			icon: "/items/stats/large/262ee00dd81b7fbdf7a5a88b347e7847.png",
			color: "#fde671",
			mice: [
				"bitter_grammarian",
				"mythweaver",
				"monstrous_midge",
				"architeuthulhu_of_the_abyss"
			]
		}
	],
	subcategories: [
		{
			id: "sb",
			name: "SUPER|brie+"
		},
		{
			id: "zero-plants",
			name: "Zero Plants"
		},
		{
			id: "three-papyrus",
			name: "Three Papyrus Plants"
		}
	]
};
var valour_rift = {
	categories: [
		{
			name: "Puppetry",
			subtitle: "Floors 1, 9, 17, 25",
			id: "vrift-1",
			color: "#EAF2D3",
			mice: [
				"rift_gaunt_puppet",
				"rift_gaunt_puppet_champ"
			]
		},
		{
			name: "Thievery",
			subtitle: "Floors 2, 10, 18, 26",
			id: "vrift-2",
			color: "#acf28d",
			mice: [
				"rift_gaunt_thief",
				"rift_gaunt_thief_champ"
			]
		},
		{
			name: "Melee",
			subtitle: "Floors 3, 11, 19, 27",
			id: "vrift-3",
			color: "#FCE5CD",
			mice: [
				"rift_gaunt_melee",
				"rift_gaunt_melee_champ"
			]
		},
		{
			name: "Bard",
			subtitle: "Floors 4, 12, 20, 28",
			id: "vrift-4",
			color: "#F6B26B",
			mice: [
				"rift_gaunt_bard",
				"rift_gaunt_bard_champ"
			]
		},
		{
			name: "Magic",
			subtitle: "Floors 5, 13, 21, 29",
			id: "vrift-5",
			color: "#F9CB9C",
			mice: [
				"rift_gaunt_magic",
				"rift_gaunt_magic_champ"
			]
		},
		{
			name: "Noble",
			subtitle: "Floors 6, 14, 22, 30",
			id: "vrift-6",
			color: "#F4CCCC",
			mice: [
				"rift_gaunt_noble",
				"rift_gaunt_noble_champ"
			]
		},
		{
			name: "Dusty",
			subtitle: "Floors 7, 15, 23, 31",
			id: "vrift-7",
			color: "#E06666",
			mice: [
				"rift_gaunt_dust",
				"rift_gaunt_dust_champ"
			]
		},
		{
			name: "Non-UU",
			id: "vrift-eclipse",
			color: "#EA9999",
			mice: [
				"rift_gaunt_eclipse"
			]
		},
		{
			name: "Ultimate Umbra",
			id: "vrift-eclipse-uu",
			color: "#ff8181",
			mice: [
				"rift_gaunt_monster",
				"rift_gaunt_final_eclipse"
			]
		},
		{
			name: "Other",
			id: "vrift-other",
			color: "#B6D7A8",
			mice: [
				"rift_gaunt_generic_one",
				"rift_gaunt_generic_three",
				"rift_gaunt_generic_two",
				"rift_gaunt_prestige_low",
				"rift_gaunt_prestige_med",
				"rift_gaunt_prestige_high",
				"rift_gaunt_rare"
			]
		},
		{
			name: "Outside",
			id: "vrift-outside",
			icon: "",
			color: "#d0def7",
			mice: [
				"rift_gaunt_elixir_one",
				"rift_gaunt_elixir_two"
			]
		}
	],
	subcategories: [
	]
};
var rift_stalkers = {
	categories: [
		{
			name: "Gnawnia Rift",
			color: "#f7e8f9",
			mice: [
				"rift_white",
				"rift_dwarf",
				"rift_diamond",
				"rift_gold"
			]
		},
		{
			name: "Furoma Rift",
			subtitle: "Training Grounds",
			color: "#e5a571",
			mice: [
				"rift_samurai",
				"rift_kung_fu",
				"rift_worker",
				"rift_ninja",
				"rift_dumpling_chef",
				"rift_archer"
			]
		},
		{
			name: "Furoma Rift",
			subtitle: "Pagoda",
			color: "#cb7136",
			mice: [
				"rift_assassin",
				"rift_monk",
				"rift_fang_student",
				"rift_belt_student",
				"rift_claw_student",
				"rift_dojo_sensei",
				"rift_fang_master",
				"rift_claw_master",
				"rift_belt_master",
				"rift_dojo_master"
			]
		},
		{
			name: "Bristle Woods Rift",
			mice: [
				"rift_acolyte",
				"rift_chrono",
				"rift_gargoyle",
				"rift_golem",
				"rift_gorgon",
				"rift_keeper",
				"rift_keepers_assistant",
				"rift_lich",
				"rift_ooze",
				"rift_reaper",
				"rift_scavenger",
				"rift_skeleton",
				"rift_sorcerer",
				"rift_spectre",
				"rift_spider",
				"rift_terror_knight",
				"rift_wight"
			]
		}
	]
};
var rift_walkers = {
	categories: [
		{
			name: "Gnawnia Rift",
			color: "#f7e8f9",
			mice: [
				"rift_field",
				"rift_bionic",
				"rift_granite",
				"rift_steel",
				"rift_white",
				"rift_grey",
				"rift_brown",
				"rift_lightning",
				"rift_dwarf",
				"rift_tiny",
				"rift_cowardly",
				"rift_spotted",
				"rift_flying",
				"rift_mole",
				"rift_diamond",
				"rift_gold"
			]
		}
	]
};
var queso_canyon_grand_tour = {
};
var fort_rox = {
	categories: [
		{
			name: "Night",
			id: "night",
			color: "#d0d0d0",
			icon: "",
			mice: [
				"were_alpha",
				"moonstone_slinger",
				"mischievous_wereminer",
				"wealthy_werewarrior"
			]
		},
		{
			name: "First Light / Utter Darkness",
			id: "first-light-utter-darkness",
			color: "#dc8ec7",
			icon: "/powertypes/arcane.png",
			mice: [
				"arcane_summoner",
				"cursed_taskmaster",
				"moonstone_golem",
				"moonstone_mystic",
				"night_watcher",
				"nightfire_wallbreak"
			]
		},
		{
			name: "Twilight, Midnight, Pitch",
			id: "twilight-midnight-pitch",
			color: "#84c3ff",
			icon: "/powertypes/shadow.png",
			mice: [
				"good_supply_night",
				"nightmancer",
				"reveling_lycanthrope",
				"werehauler",
				"wereminer"
			]
		},
		{
			name: "Dawn",
			id: "dawn",
			color: "#f9d65a",
			icon: "/powertypes/arcane.png",
			mice: [
				"dawn_guardian",
				"monster_of_the_meteor"
			]
		},
		{
			name: "Day",
			id: "day",
			color: "#ffdb9c",
			icon: "/powertypes/law.png",
			mice: [
				"hardworking_hauler",
				"moonstone_snacker",
				"moonstone_miner",
				"good_supply_day",
				"mischievous_moonstone_miner"
			]
		}
	]
};
var warpath = {
	categories: [
		{
			name: "Wave 1",
			color: "#f1d16f",
			mice: [
				"desert_scout_weak",
				"desert_warrior_weak",
				"desert_archer_weak"
			]
		},
		{
			name: "Wave 2",
			color: "#ea947b",
			mice: [
				"desert_mage",
				"desert_archer",
				"desert_warrior",
				"desert_scout",
				"desert_cavalry"
			]
		},
		{
			name: "Wave 3",
			color: "#ff7249",
			mice: [
				"desert_artillery",
				"desert_mage_strong",
				"desert_scout_epic",
				"desert_archer_epic",
				"desert_cavalry_strong",
				"desert_warrior_epic"
			]
		},
		{
			name: "Wave 4",
			color: "#ffad49",
			mice: [
				"desert_elite_gaurd",
				"desert_boss"
			]
		},
		{
			name: "Any wave",
			color: "#fffcb2",
			mice: [
				"desert_beast",
				"desert_supply",
				"desert_general"
			]
		}
	]
};
var mouseGroups = {
	sky_palace: sky_palace,
	folklore_forest_prelude: folklore_forest_prelude,
	valour_rift: valour_rift,
	rift_stalkers: rift_stalkers,
	rift_walkers: rift_walkers,
	queso_canyon_grand_tour: queso_canyon_grand_tour,
	fort_rox: fort_rox,
	warpath: warpath
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

var regeneratorRuntime$1 = {exports: {}};

var _typeof = {exports: {}};

(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
}(_typeof));

(function (module) {
var _typeof$1 = _typeof.exports["default"];
function _regeneratorRuntime() {
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof$1(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
}(regeneratorRuntime$1));

// TODO(Babel 8): Remove this file.

var runtime = regeneratorRuntime$1.exports();
var regenerator = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
var classof$5 = classof$8;

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
  return '[object ' + classof$5(this) + ']';
};

var TO_STRING_TAG_SUPPORT = toStringTagSupport;
var defineBuiltIn$4 = defineBuiltIn$7;
var toString$6 = objectToString;

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn$4(Object.prototype, 'toString', toString$6, { unsafe: true });
}

var classof$4 = classofRaw$2;

var engineIsNode = typeof process != 'undefined' && classof$4(process) == 'process';

var uncurryThis$f = functionUncurryThis;
var aCallable$8 = aCallable$a;

var functionUncurryThisAccessor = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis$f(aCallable$8(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};

var isCallable$5 = isCallable$j;

var $String$1 = String;
var $TypeError$a = TypeError;

var aPossiblePrototype$1 = function (argument) {
  if (typeof argument == 'object' || isCallable$5(argument)) return argument;
  throw $TypeError$a("Can't set " + $String$1(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */

var uncurryThisAccessor = functionUncurryThisAccessor;
var anObject$6 = anObject$e;
var aPossiblePrototype = aPossiblePrototype$1;

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject$6(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var defineProperty$2 = objectDefineProperty.f;
var hasOwn$2 = hasOwnProperty_1;
var wellKnownSymbol$d = wellKnownSymbol$i;

var TO_STRING_TAG = wellKnownSymbol$d('toStringTag');

var setToStringTag$1 = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn$2(target, TO_STRING_TAG)) {
    defineProperty$2(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var makeBuiltIn = makeBuiltIn$3.exports;
var defineProperty$1 = objectDefineProperty;

var defineBuiltInAccessor$2 = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty$1.f(target, name, descriptor);
};

var getBuiltIn$3 = getBuiltIn$7;
var defineBuiltInAccessor$1 = defineBuiltInAccessor$2;
var wellKnownSymbol$c = wellKnownSymbol$i;
var DESCRIPTORS$3 = descriptors;

var SPECIES$5 = wellKnownSymbol$c('species');

var setSpecies$1 = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn$3(CONSTRUCTOR_NAME);

  if (DESCRIPTORS$3 && Constructor && !Constructor[SPECIES$5]) {
    defineBuiltInAccessor$1(Constructor, SPECIES$5, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var isPrototypeOf$2 = objectIsPrototypeOf;

var $TypeError$9 = TypeError;

var anInstance$1 = function (it, Prototype) {
  if (isPrototypeOf$2(Prototype, it)) return it;
  throw $TypeError$9('Incorrect invocation');
};

var uncurryThis$e = functionUncurryThis;
var fails$a = fails$n;
var isCallable$4 = isCallable$j;
var classof$3 = classof$8;
var getBuiltIn$2 = getBuiltIn$7;
var inspectSource$1 = inspectSource$3;

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn$2('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec$1 = uncurryThis$e(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable$4(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable$4(argument)) return false;
  switch (classof$3(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec$1(constructorRegExp, inspectSource$1(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
var isConstructor$3 = !construct || fails$a(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

var isConstructor$2 = isConstructor$3;
var tryToString$3 = tryToString$5;

var $TypeError$8 = TypeError;

// `Assert: IsConstructor(argument) is true`
var aConstructor$1 = function (argument) {
  if (isConstructor$2(argument)) return argument;
  throw $TypeError$8(tryToString$3(argument) + ' is not a constructor');
};

var anObject$5 = anObject$e;
var aConstructor = aConstructor$1;
var isNullOrUndefined$1 = isNullOrUndefined$5;
var wellKnownSymbol$b = wellKnownSymbol$i;

var SPECIES$4 = wellKnownSymbol$b('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor$1 = function (O, defaultConstructor) {
  var C = anObject$5(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined$1(S = anObject$5(C)[SPECIES$4]) ? defaultConstructor : aConstructor(S);
};

var uncurryThis$d = functionUncurryThisClause;
var aCallable$7 = aCallable$a;
var NATIVE_BIND = functionBindNative;

var bind$5 = uncurryThis$d(uncurryThis$d.bind);

// optional / simple context binding
var functionBindContext = function (fn, that) {
  aCallable$7(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind$5(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var userAgent$4 = engineUserAgent;

// eslint-disable-next-line redos/no-vulnerable -- safe
var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$4);

var global$7 = global$n;
var apply = functionApply;
var bind$4 = functionBindContext;
var isCallable$3 = isCallable$j;
var hasOwn$1 = hasOwnProperty_1;
var fails$9 = fails$n;
var html = html$2;
var arraySlice$1 = arraySlice$3;
var createElement = documentCreateElement$2;
var validateArgumentsLength = validateArgumentsLength$2;
var IS_IOS$1 = engineIsIos;
var IS_NODE$4 = engineIsNode;

var set = global$7.setImmediate;
var clear = global$7.clearImmediate;
var process$3 = global$7.process;
var Dispatch = global$7.Dispatch;
var Function$1 = global$7.Function;
var MessageChannel = global$7.MessageChannel;
var String$1 = global$7.String;
var counter = 0;
var queue$2 = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;

fails$9(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = global$7.location;
});

var run = function (id) {
  if (hasOwn$1(queue$2, id)) {
    var fn = queue$2[id];
    delete queue$2[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var eventListener = function (event) {
  run(event.data);
};

var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  global$7.postMessage(String$1(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable$3(handler) ? handler : Function$1(handler);
    var args = arraySlice$1(arguments, 1);
    queue$2[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue$2[id];
  };
  // Node.js 0.8-
  if (IS_NODE$4) {
    defer = function (id) {
      process$3.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS$1) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind$4(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global$7.addEventListener &&
    isCallable$3(global$7.postMessage) &&
    !global$7.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails$9(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    global$7.addEventListener('message', eventListener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task$1 = {
  set: set,
  clear: clear
};

var Queue$2 = function () {
  this.head = null;
  this.tail = null;
};

Queue$2.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    var tail = this.tail;
    if (tail) tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};

var queue$1 = Queue$2;

var userAgent$3 = engineUserAgent;

var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$3) && typeof Pebble != 'undefined';

var userAgent$2 = engineUserAgent;

var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent$2);

var global$6 = global$n;
var bind$3 = functionBindContext;
var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var macrotask = task$1.set;
var Queue$1 = queue$1;
var IS_IOS = engineIsIos;
var IS_IOS_PEBBLE = engineIsIosPebble;
var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
var IS_NODE$3 = engineIsNode;

var MutationObserver = global$6.MutationObserver || global$6.WebKitMutationObserver;
var document$2 = global$6.document;
var process$2 = global$6.process;
var Promise$1 = global$6.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$6, 'queueMicrotask');
var microtask$1 = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
var notify$1, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!microtask$1) {
  var queue = new Queue$1();

  var flush = function () {
    var parent, fn;
    if (IS_NODE$3 && (parent = process$2.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify$1();
      throw error;
    }
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE$3 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify$1 = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$1.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise$1;
    then = bind$3(promise.then, promise);
    notify$1 = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE$3) {
    notify$1 = function () {
      process$2.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // `webpack` dev server bug on IE global methods - use bind(fn, global)
    macrotask = bind$3(macrotask, global$6);
    notify$1 = function () {
      macrotask(flush);
    };
  }

  microtask$1 = function (fn) {
    if (!queue.head) notify$1();
    queue.add(fn);
  };
}

var microtask_1 = microtask$1;

var hostReportErrors$1 = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  } catch (error) { /* empty */ }
};

var perform$3 = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var global$5 = global$n;

var promiseNativeConstructor = global$5.Promise;

/* global Deno -- Deno case */

var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

var IS_DENO$1 = engineIsDeno;
var IS_NODE$2 = engineIsNode;

var engineIsBrowser = !IS_DENO$1 && !IS_NODE$2
  && typeof window == 'object'
  && typeof document == 'object';

var global$4 = global$n;
var NativePromiseConstructor$3 = promiseNativeConstructor;
var isCallable$2 = isCallable$j;
var isForced = isForced_1;
var inspectSource = inspectSource$3;
var wellKnownSymbol$a = wellKnownSymbol$i;
var IS_BROWSER = engineIsBrowser;
var IS_DENO = engineIsDeno;
var V8_VERSION$2 = engineV8Version;

NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
var SPECIES$3 = wellKnownSymbol$a('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$2(global$4.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR$5 = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$3);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$3);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION$2 === 66) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION$2 || V8_VERSION$2 < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor$3(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES$3] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT$1;
});

var promiseConstructorDetection = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
  SUBCLASSING: SUBCLASSING
};

var newPromiseCapability$2 = {};

var aCallable$6 = aCallable$a;

var $TypeError$7 = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw $TypeError$7('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable$6(resolve);
  this.reject = aCallable$6(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
newPromiseCapability$2.f = function (C) {
  return new PromiseCapability(C);
};

var $$m = _export;
var IS_NODE$1 = engineIsNode;
var global$3 = global$n;
var call$7 = functionCall;
var defineBuiltIn$3 = defineBuiltIn$7;
var setPrototypeOf = objectSetPrototypeOf;
var setToStringTag = setToStringTag$1;
var setSpecies = setSpecies$1;
var aCallable$5 = aCallable$a;
var isCallable$1 = isCallable$j;
var isObject$5 = isObject$b;
var anInstance = anInstance$1;
var speciesConstructor = speciesConstructor$1;
var task = task$1.set;
var microtask = microtask_1;
var hostReportErrors = hostReportErrors$1;
var perform$2 = perform$3;
var Queue = queue$1;
var InternalStateModule = internalState;
var NativePromiseConstructor$2 = promiseNativeConstructor;
var PromiseConstructorDetection = promiseConstructorDetection;
var newPromiseCapabilityModule$3 = newPromiseCapability$2;

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype$1 = NativePromiseConstructor$2 && NativePromiseConstructor$2.prototype;
var PromiseConstructor = NativePromiseConstructor$2;
var PromisePrototype = NativePromisePrototype$1;
var TypeError$1 = global$3.TypeError;
var document$1 = global$3.document;
var process$1 = global$3.process;
var newPromiseCapability$1 = newPromiseCapabilityModule$3.f;
var newGenericPromiseCapability = newPromiseCapability$1;

var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$3.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject$5(it) && isCallable$1(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError$1('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call$7(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$1.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global$3.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global$3['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call$7(task, global$3, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform$2(function () {
        if (IS_NODE$1) {
          process$1.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call$7(task, global$3, function () {
    var promise = state.facade;
    if (IS_NODE$1) {
      process$1.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind$2 = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call$7(then, value,
            bind$2(internalResolve, wrapper, state),
            bind$2(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR$4) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable$5(executor);
    call$7(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind$2(internalResolve, state), bind$2(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn$3(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable$1(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable$1(onRejected) && onRejected;
    reaction.domain = IS_NODE$1 ? process$1.domain : undefined;
    if (state.state == PENDING) state.reactions.add(reaction);
    else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind$2(internalResolve, state);
    this.reject = bind$2(internalReject, state);
  };

  newPromiseCapabilityModule$3.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (isCallable$1(NativePromiseConstructor$2) && NativePromisePrototype$1 !== Object.prototype) {
    nativeThen = NativePromisePrototype$1.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn$3(NativePromisePrototype$1, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call$7(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype$1.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype$1, PromisePrototype);
    }
  }
}

$$m({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

var iterators = {};

var wellKnownSymbol$9 = wellKnownSymbol$i;
var Iterators$1 = iterators;

var ITERATOR$3 = wellKnownSymbol$9('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod$1 = function (it) {
  return it !== undefined && (Iterators$1.Array === it || ArrayPrototype$1[ITERATOR$3] === it);
};

var classof$2 = classof$8;
var getMethod$1 = getMethod$4;
var isNullOrUndefined = isNullOrUndefined$5;
var Iterators = iterators;
var wellKnownSymbol$8 = wellKnownSymbol$i;

var ITERATOR$2 = wellKnownSymbol$8('iterator');

var getIteratorMethod$2 = function (it) {
  if (!isNullOrUndefined(it)) return getMethod$1(it, ITERATOR$2)
    || getMethod$1(it, '@@iterator')
    || Iterators[classof$2(it)];
};

var call$6 = functionCall;
var aCallable$4 = aCallable$a;
var anObject$4 = anObject$e;
var tryToString$2 = tryToString$5;
var getIteratorMethod$1 = getIteratorMethod$2;

var $TypeError$6 = TypeError;

var getIterator$1 = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
  if (aCallable$4(iteratorMethod)) return anObject$4(call$6(iteratorMethod, argument));
  throw $TypeError$6(tryToString$2(argument) + ' is not iterable');
};

var call$5 = functionCall;
var anObject$3 = anObject$e;
var getMethod = getMethod$4;

var iteratorClose$1 = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject$3(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call$5(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject$3(innerResult);
  return value;
};

var bind$1 = functionBindContext;
var call$4 = functionCall;
var anObject$2 = anObject$e;
var tryToString$1 = tryToString$5;
var isArrayIteratorMethod = isArrayIteratorMethod$1;
var lengthOfArrayLike$7 = lengthOfArrayLike$9;
var isPrototypeOf$1 = objectIsPrototypeOf;
var getIterator = getIterator$1;
var getIteratorMethod = getIteratorMethod$2;
var iteratorClose = iteratorClose$1;

var $TypeError$5 = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

var iterate$2 = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind$1(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject$2(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError$5(tryToString$1(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike$7(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf$1(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call$4(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf$1(ResultPrototype, result)) return result;
  } return new Result(false);
};

var wellKnownSymbol$7 = wellKnownSymbol$i;

var ITERATOR$1 = wellKnownSymbol$7('iterator');
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
  iteratorWithReturn[ITERATOR$1] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$1] = function () {
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

var NativePromiseConstructor$1 = promiseNativeConstructor;
var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;
var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor$1.all(iterable).then(undefined, function () { /* empty */ });
});

var $$l = _export;
var call$3 = functionCall;
var aCallable$3 = aCallable$a;
var newPromiseCapabilityModule$2 = newPromiseCapability$2;
var perform$1 = perform$3;
var iterate$1 = iterate$2;
var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$$l({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$1 }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule$2.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform$1(function () {
      var $promiseResolve = aCallable$3(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate$1(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call$3($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var $$k = _export;
var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
var NativePromiseConstructor = promiseNativeConstructor;
var getBuiltIn$1 = getBuiltIn$7;
var isCallable = isCallable$j;
var defineBuiltIn$2 = defineBuiltIn$7;

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$$k({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn$1('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn$2(NativePromisePrototype, 'catch', method, { unsafe: true });
  }
}

var $$j = _export;
var call$2 = functionCall;
var aCallable$2 = aCallable$a;
var newPromiseCapabilityModule$1 = newPromiseCapability$2;
var perform = perform$3;
var iterate = iterate$2;
var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$$j({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule$1.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable$2(C.resolve);
      iterate(iterable, function (promise) {
        call$2($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var $$i = _export;
var call$1 = functionCall;
var newPromiseCapabilityModule = newPromiseCapability$2;
var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$$i({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    call$1(capability.reject, undefined, r);
    return capability.promise;
  }
});

var anObject$1 = anObject$e;
var isObject$4 = isObject$b;
var newPromiseCapability = newPromiseCapability$2;

var promiseResolve$1 = function (C, x) {
  anObject$1(C);
  if (isObject$4(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var $$h = _export;
var getBuiltIn = getBuiltIn$7;
var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
var promiseResolve = promiseResolve$1;

getBuiltIn('Promise');

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$$h({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(this, x);
  }
});

var classof$1 = classofRaw$2;

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray$4 = Array.isArray || function isArray(argument) {
  return classof$1(argument) == 'Array';
};

var isArray$3 = isArray$4;
var isConstructor$1 = isConstructor$3;
var isObject$3 = isObject$b;
var wellKnownSymbol$6 = wellKnownSymbol$i;

var SPECIES$2 = wellKnownSymbol$6('species');
var $Array$2 = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor$1 = function (originalArray) {
  var C;
  if (isArray$3(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor$1(C) && (C === $Array$2 || isArray$3(C.prototype))) C = undefined;
    else if (isObject$3(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array$2 : C;
};

var arraySpeciesConstructor = arraySpeciesConstructor$1;

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate$3 = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var bind = functionBindContext;
var uncurryThis$c = functionUncurryThis;
var IndexedObject$2 = indexedObject;
var toObject$4 = toObject$6;
var lengthOfArrayLike$6 = lengthOfArrayLike$9;
var arraySpeciesCreate$2 = arraySpeciesCreate$3;

var push$2 = uncurryThis$c([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$3 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject$4($this);
    var self = IndexedObject$2(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike$6(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate$2;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push$2(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push$2(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$3(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$3(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$3(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$3(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$3(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$3(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$3(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$3(7)
};

var wellKnownSymbol$5 = wellKnownSymbol$i;
var create = objectCreate;
var defineProperty = objectDefineProperty.f;

var UNSCOPABLES = wellKnownSymbol$5('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables$3 = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var $$g = _export;
var $find = arrayIteration.find;
var addToUnscopables$2 = addToUnscopables$3;

var FIND = 'find';
var SKIPS_HOLES$1 = true;

// Shouldn't skip holes
// eslint-disable-next-line es/no-array-prototype-find -- testing
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES$1 = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$$g({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$2(FIND);

var uncurryThis$b = functionUncurryThis;

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
var thisNumberValue$1 = uncurryThis$b(1.0.valueOf);

var toIntegerOrInfinity$2 = toIntegerOrInfinity$6;
var toString$5 = toString$a;
var requireObjectCoercible$3 = requireObjectCoercible$8;

var $RangeError$1 = RangeError;

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
var stringRepeat = function repeat(count) {
  var str = toString$5(requireObjectCoercible$3(this));
  var result = '';
  var n = toIntegerOrInfinity$2(count);
  if (n < 0 || n == Infinity) throw $RangeError$1('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

var $$f = _export;
var uncurryThis$a = functionUncurryThis;
var toIntegerOrInfinity$1 = toIntegerOrInfinity$6;
var thisNumberValue = thisNumberValue$1;
var $repeat = stringRepeat;
var fails$8 = fails$n;

var $RangeError = RangeError;
var $String = String;
var floor$1 = Math.floor;
var repeat = uncurryThis$a($repeat);
var stringSlice = uncurryThis$a(''.slice);
var nativeToFixed = uncurryThis$a(1.0.toFixed);

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

var multiply = function (data, n, c) {
  var index = -1;
  var c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor$1(c2 / 1e7);
  }
};

var divide = function (data, n) {
  var index = 6;
  var c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor$1(c / n);
    c = (c % n) * 1e7;
  }
};

var dataToString = function (data) {
  var index = 6;
  var s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      var t = $String(data[index]);
      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
    }
  } return s;
};

var FORCED$6 = fails$8(function () {
  return nativeToFixed(0.00008, 3) !== '0.000' ||
    nativeToFixed(0.9, 0) !== '1' ||
    nativeToFixed(1.255, 2) !== '1.25' ||
    nativeToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
}) || !fails$8(function () {
  // V8 ~ Android 4.3-
  nativeToFixed({});
});

// `Number.prototype.toFixed` method
// https://tc39.es/ecma262/#sec-number.prototype.tofixed
$$f({ target: 'Number', proto: true, forced: FORCED$6 }, {
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toIntegerOrInfinity$1(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
    if (fractDigits < 0 || fractDigits > 20) throw $RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return $String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow(2, 69, 1)) - 69;
      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(data, 1 << 23);
          j -= 23;
        }
        divide(data, 1 << j);
        multiply(data, 1, 1);
        divide(data, 2);
        result = dataToString(data);
      } else {
        multiply(data, 0, z);
        multiply(data, 1 << -e, 0);
        result = dataToString(data) + repeat('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + repeat('0', fractDigits - k) + result
        : stringSlice(result, 0, k - fractDigits) + '.' + stringSlice(result, k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

var tryToString = tryToString$5;

var $TypeError$4 = TypeError;

var deletePropertyOrThrow$2 = function (O, P) {
  if (!delete O[P]) throw $TypeError$4('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};

var toPropertyKey = toPropertyKey$3;
var definePropertyModule = objectDefineProperty;
var createPropertyDescriptor = createPropertyDescriptor$3;

var createProperty$4 = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var toAbsoluteIndex$2 = toAbsoluteIndex$4;
var lengthOfArrayLike$5 = lengthOfArrayLike$9;
var createProperty$3 = createProperty$4;

var $Array$1 = Array;
var max$2 = Math.max;

var arraySliceSimple = function (O, start, end) {
  var length = lengthOfArrayLike$5(O);
  var k = toAbsoluteIndex$2(start, length);
  var fin = toAbsoluteIndex$2(end === undefined ? length : end, length);
  var result = $Array$1(max$2(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty$3(result, n, O[k]);
  result.length = n;
  return result;
};

var arraySlice = arraySliceSimple;

var floor = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    array,
    mergeSort(arraySlice(array, 0, middle), comparefn),
    mergeSort(arraySlice(array, middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;

  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = (lindex < llength && rindex < rlength)
      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
      : lindex < llength ? left[lindex++] : right[rindex++];
  } return array;
};

var arraySort = mergeSort;

var fails$7 = fails$n;

var arrayMethodIsStrict$5 = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails$7(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

var userAgent$1 = engineUserAgent;

var firefox = userAgent$1.match(/firefox\/(\d+)/i);

var engineFfVersion = !!firefox && +firefox[1];

var UA = engineUserAgent;

var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

var userAgent = engineUserAgent;

var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);

var engineWebkitVersion = !!webkit && +webkit[1];

var $$e = _export;
var uncurryThis$9 = functionUncurryThis;
var aCallable$1 = aCallable$a;
var toObject$3 = toObject$6;
var lengthOfArrayLike$4 = lengthOfArrayLike$9;
var deletePropertyOrThrow$1 = deletePropertyOrThrow$2;
var toString$4 = toString$a;
var fails$6 = fails$n;
var internalSort = arraySort;
var arrayMethodIsStrict$4 = arrayMethodIsStrict$5;
var FF = engineFfVersion;
var IE_OR_EDGE = engineIsIeOrEdge;
var V8 = engineV8Version;
var WEBKIT = engineWebkitVersion;

var test = [];
var nativeSort = uncurryThis$9(test.sort);
var push$1 = uncurryThis$9(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails$6(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails$6(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD$1 = arrayMethodIsStrict$4('sort');

var STABLE_SORT = !fails$6(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 70;
  if (FF && FF > 3) return;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }

  test.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED$5 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1 || !STABLE_SORT;

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString$4(x) > toString$4(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$$e({ target: 'Array', proto: true, forced: FORCED$5 }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable$1(comparefn);

    var array = toObject$3(this);

    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike$4(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push$1(items, array[index]);
    }

    internalSort(items, getSortCompare(comparefn));

    itemsLength = lengthOfArrayLike$4(items);
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow$1(array, index++);

    return array;
  }
});

var addMapperStyles = function addMapperStyles(styles) {
  var identifier = 'mh-mapper-styles';
  var existingStyles = document.getElementById(identifier);
  if (existingStyles) {
    existingStyles.innerHTML += styles;
    return;
  }
  var style = document.createElement('style');
  style.id = identifier;
  style.innerHTML = styles;
  document.head.appendChild(style);
};
var getMapData = function getMapData(mapId) {
  if (mapId === void 0) {
    mapId = false;
  }
  if (mapId !== false) {
    var sessionMap = JSON.parse(sessionStorage.getItem("mapper-map-" + mapId));
    if (sessionMap) {
      return sessionMap;
    }
  }
  var localStorageMap = JSON.parse(sessionStorage.getItem('mapper-latest'));
  if (localStorageMap) {
    return localStorageMap;
  }
  return false;
};
var setMapData = function setMapData(mapId, mapData) {
  sessionStorage.setItem("mapper-map-" + mapId, JSON.stringify(mapData));
  sessionStorage.setItem('mapper-latest', JSON.stringify(mapData));
};

var $forEach = arrayIteration.forEach;
var arrayMethodIsStrict$3 = arrayMethodIsStrict$5;

var STRICT_METHOD = arrayMethodIsStrict$3('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

var $$d = _export;
var forEach$1 = arrayForEach;

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$$d({ target: 'Array', proto: true, forced: [].forEach != forEach$1 }, {
  forEach: forEach$1
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = documentCreateElement$2;

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;

var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

var global$2 = global$n;
var DOMIterables = domIterables;
var DOMTokenListPrototype = domTokenListPrototype;
var forEach = arrayForEach;
var createNonEnumerableProperty = createNonEnumerableProperty$4;

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global$2[COLLECTION_NAME] && global$2[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);

var $TypeError$3 = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

var doesNotExceedSafeInteger$2 = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError$3('Maximum allowed index exceeded');
  return it;
};

var fails$5 = fails$n;
var wellKnownSymbol$4 = wellKnownSymbol$i;
var V8_VERSION$1 = engineV8Version;

var SPECIES$1 = wellKnownSymbol$4('species');

var arrayMethodHasSpeciesSupport$4 = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION$1 >= 51 || !fails$5(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var $$c = _export;
var fails$4 = fails$n;
var isArray$2 = isArray$4;
var isObject$2 = isObject$b;
var toObject$2 = toObject$6;
var lengthOfArrayLike$3 = lengthOfArrayLike$9;
var doesNotExceedSafeInteger$1 = doesNotExceedSafeInteger$2;
var createProperty$2 = createProperty$4;
var arraySpeciesCreate$1 = arraySpeciesCreate$3;
var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$4;
var wellKnownSymbol$3 = wellKnownSymbol$i;
var V8_VERSION = engineV8Version;

var IS_CONCAT_SPREADABLE = wellKnownSymbol$3('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$4(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var isConcatSpreadable = function (O) {
  if (!isObject$2(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray$2(O);
};

var FORCED$4 = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport$3('concat');

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$$c({ target: 'Array', proto: true, arity: 1, forced: FORCED$4 }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject$2(this);
    var A = arraySpeciesCreate$1(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike$3(E);
        doesNotExceedSafeInteger$1(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty$2(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger$1(n + 1);
        createProperty$2(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var $$b = _export;
var $filter = arrayIteration.filter;
var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$4;

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$$b({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $$a = _export;
var uncurryThis$8 = functionUncurryThisClause;
var $indexOf = arrayIncludes.indexOf;
var arrayMethodIsStrict$2 = arrayMethodIsStrict$5;

var nativeIndexOf = uncurryThis$8([].indexOf);

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
var FORCED$3 = NEGATIVE_ZERO || !arrayMethodIsStrict$2('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$$a({ target: 'Array', proto: true, forced: FORCED$3 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf(this, searchElement, fromIndex) || 0
      : $indexOf(this, searchElement, fromIndex);
  }
});

var $$9 = _export;
var isArray$1 = isArray$4;
var isConstructor = isConstructor$3;
var isObject$1 = isObject$b;
var toAbsoluteIndex$1 = toAbsoluteIndex$4;
var lengthOfArrayLike$2 = lengthOfArrayLike$9;
var toIndexedObject$2 = toIndexedObject$7;
var createProperty$1 = createProperty$4;
var wellKnownSymbol$2 = wellKnownSymbol$i;
var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$4;
var nativeSlice = arraySlice$3;

var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('slice');

var SPECIES = wellKnownSymbol$2('species');
var $Array = Array;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$$9({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  slice: function slice(start, end) {
    var O = toIndexedObject$2(this);
    var length = lengthOfArrayLike$2(O);
    var k = toAbsoluteIndex$1(start, length);
    var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray$1(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray$1(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject$1(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return nativeSlice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$1(result, n, O[k]);
    result.length = n;
    return result;
  }
});

// TODO: Remove from `core-js@4`
var uncurryThis$7 = functionUncurryThis;
var defineBuiltIn$1 = defineBuiltIn$7;

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING$1 = 'toString';
var nativeDateToString = uncurryThis$7(DatePrototype[TO_STRING$1]);
var thisTimeValue = uncurryThis$7(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn$1(DatePrototype, TO_STRING$1, function toString() {
    var value = thisTimeValue(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? nativeDateToString(this) : INVALID_DATE;
  });
}

var call = functionCall;
var hasOwn = hasOwnProperty_1;
var isPrototypeOf = objectIsPrototypeOf;
var regExpFlags = regexpFlags$1;

var RegExpPrototype$1 = RegExp.prototype;

var regexpGetFlags = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype$1) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype$1, R)
    ? call(regExpFlags, R) : flags;
};

var PROPER_FUNCTION_NAME = functionName.PROPER;
var defineBuiltIn = defineBuiltIn$7;
var anObject = anObject$e;
var $toString = toString$a;
var fails$3 = fails$n;
var getRegExpFlags = regexpGetFlags;

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails$3(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}

// a string of all valid unicode whitespaces
var whitespaces$2 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var uncurryThis$6 = functionUncurryThis;
var requireObjectCoercible$2 = requireObjectCoercible$8;
var toString$3 = toString$a;
var whitespaces$1 = whitespaces$2;

var replace$1 = uncurryThis$6(''.replace);
var ltrim = RegExp('^[' + whitespaces$1 + ']+');
var rtrim = RegExp('(^|[^' + whitespaces$1 + '])[' + whitespaces$1 + ']+$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$2 = function (TYPE) {
  return function ($this) {
    var string = toString$3(requireObjectCoercible$2($this));
    if (TYPE & 1) string = replace$1(string, ltrim, '');
    if (TYPE & 2) string = replace$1(string, rtrim, '$1');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod$2(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod$2(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod$2(3)
};

var global$1 = global$n;
var fails$2 = fails$n;
var uncurryThis$5 = functionUncurryThis;
var toString$2 = toString$a;
var trim = stringTrim.trim;
var whitespaces = whitespaces$2;

var $parseInt$1 = global$1.parseInt;
var Symbol$1 = global$1.Symbol;
var ITERATOR = Symbol$1 && Symbol$1.iterator;
var hex = /^[+-]?0x/i;
var exec = uncurryThis$5(hex.exec);
var FORCED$2 = $parseInt$1(whitespaces + '08') !== 8 || $parseInt$1(whitespaces + '0x16') !== 22
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails$2(function () { $parseInt$1(Object(ITERATOR)); }));

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
var numberParseInt = FORCED$2 ? function parseInt(string, radix) {
  var S = trim(toString$2(string));
  return $parseInt$1(S, (radix >>> 0) || (exec(hex, S) ? 16 : 10));
} : $parseInt$1;

var $$8 = _export;
var $parseInt = numberParseInt;

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$$8({ global: true, forced: parseInt != $parseInt }, {
  parseInt: $parseInt
});

var DESCRIPTORS$2 = descriptors;
var FUNCTION_NAME_EXISTS = functionName.EXISTS;
var uncurryThis$4 = functionUncurryThis;
var defineBuiltInAccessor = defineBuiltInAccessor$2;

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis$4(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis$4(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS$2 && !FUNCTION_NAME_EXISTS) {
  defineBuiltInAccessor(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var uncurryThis$3 = functionUncurryThis;
var requireObjectCoercible$1 = requireObjectCoercible$8;
var toString$1 = toString$a;

var quot = /"/g;
var replace = uncurryThis$3(''.replace);

// `CreateHTML` abstract operation
// https://tc39.es/ecma262/#sec-createhtml
var createHtml = function (string, tag, attribute, value) {
  var S = toString$1(requireObjectCoercible$1(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + replace(toString$1(value), quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

var fails$1 = fails$n;

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
var stringHtmlForced = function (METHOD_NAME) {
  return fails$1(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

var $$7 = _export;
var createHTML = createHtml;
var forcedStringHTMLMethod = stringHtmlForced;

// `String.prototype.small` method
// https://tc39.es/ecma262/#sec-string.prototype.small
$$7({ target: 'String', proto: true, forced: forcedStringHTMLMethod('small') }, {
  small: function small() {
    return createHTML(this, 'small', '', '');
  }
});

var $$6 = _export;
var $findIndex = arrayIteration.findIndex;
var addToUnscopables$1 = addToUnscopables$3;

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
// eslint-disable-next-line es/no-array-prototype-findindex -- testing
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$$6({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$1(FIND_INDEX);

var DESCRIPTORS$1 = descriptors;
var isArray = isArray$4;

var $TypeError$2 = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS$1 && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError$2('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};

var $$5 = _export;
var toObject$1 = toObject$6;
var toAbsoluteIndex = toAbsoluteIndex$4;
var toIntegerOrInfinity = toIntegerOrInfinity$6;
var lengthOfArrayLike$1 = lengthOfArrayLike$9;
var setArrayLength = arraySetLength;
var doesNotExceedSafeInteger = doesNotExceedSafeInteger$2;
var arraySpeciesCreate = arraySpeciesCreate$3;
var createProperty = createProperty$4;
var deletePropertyOrThrow = deletePropertyOrThrow$2;
var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$4;

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$$5({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject$1(this);
    var len = lengthOfArrayLike$1(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    setArrayLength(O, len - actualDeleteCount + insertCount);
    return A;
  }
});

var $$4 = _export;
var $includes = arrayIncludes.includes;
var fails = fails$n;
var addToUnscopables = addToUnscopables$3;

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$$4({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

var isObject = isObject$b;
var classof = classofRaw$2;
var wellKnownSymbol$1 = wellKnownSymbol$i;

var MATCH$1 = wellKnownSymbol$1('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

var isRegExp = isRegexp;

var $TypeError$1 = TypeError;

var notARegexp = function (it) {
  if (isRegExp(it)) {
    throw $TypeError$1("The method doesn't accept regular expressions");
  } return it;
};

var wellKnownSymbol = wellKnownSymbol$i;

var MATCH = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

var $$3 = _export;
var uncurryThis$2 = functionUncurryThis;
var notARegExp = notARegexp;
var requireObjectCoercible = requireObjectCoercible$8;
var toString = toString$a;
var correctIsRegExpLogic = correctIsRegexpLogic;

var stringIndexOf = uncurryThis$2(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$$3({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(
      toString(requireObjectCoercible(this)),
      toString(notARegExp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});

var areaHighlightingVrift = function areaHighlightingVrift() {
  if ('rift_valour' !== getCurrentLocation()) {
    return false;
  }
  var currentFloorState = (user.quests.QuestRiftValour.floor || 0) % 8;
  if (user.quests.QuestRiftValour.is_at_eclipse) {
    currentFloorState = 'eclipse';
    if (user.enviroment_atts.active_augmentations.tu) {
      currentFloorState = 'eclipse-uu';
    }
  } else if ('farming' === user.quests.QuestRiftValour.state) {
    currentFloorState = 'outside';
  }
  var floorCategory = document.querySelector(".mouse-category-wrapper.mouse-category-vrift-" + currentFloorState);
  if (!floorCategory) {
    return false;
  }
  floorCategory.classList.add('mouse-category-current-floor');
  return true;
};
var areaHighlightingFrox = function areaHighlightingFrox() {
  if ('fort_rox' !== getCurrentLocation()) {
    return false;
  }
  var mapArea = 'day';
  if (user.quests.QuestFortRox) {
    var phase = user.quests.QuestFortRox.current_phase || 'day';
    if ('day' === phase) {
      mapArea = 'day';
    } else if ('dawn' === phase) {
      mapArea = 'dawn';
    } else if ('night' === phase) {
      var stage = user.quests.QuestFortRox.current_stage || '';
      console.log(stage); // eslint-disable-line no-console
      // this is where we return
      // first-light-utter-darkness, twilight-midnight-pitch, or night
      mapArea = 'night';
    }
  }
  var floorCategory = document.querySelector(".mouse-category-wrapper.mouse-category-" + mapArea);
  if (!floorCategory) {
    return false;
  }
  floorCategory.classList.add('mouse-category-current-floor');
  return true;
};
var addProfilePicToCurrentFloor = function addProfilePicToCurrentFloor() {
  var existing = document.getElementById('mh-mapper-current-floor-profile-pic');
  if (existing) {
    return;
  }
  var styleElement = document.createElement('style');
  styleElement.id = 'mh-mapper-current-floor-profile-pic';
  styleElement.innerHTML = ".mouse-category-wrapper.mouse-category-current-floor .mouse-category-header:after {\n    background-image: url(" + user.enviroment_atts.profile_pic + ");\n    box-shadow: 0 0 1px 1px #999;";
  document.body.appendChild(styleElement);
};
var addAreaHighlighting = function addAreaHighlighting() {
  var mapType = window.mhmapper.mapData.map_type;
  var existing = document.querySelector('.mouse-category-current-floor');
  if (existing) {
    existing.classList.remove('mouse-category-current-floor');
  }
  var added = false;
  if ('valour_rift' === mapType) {
    added = areaHighlightingVrift();
  }
  if ('fort_rox' === mapType) {
    added = areaHighlightingFrox();
  }
  if (added) {
    addProfilePicToCurrentFloor();
  }
};

var getMouseDataForMap = function getMouseDataForMap(currentMapData, type) {
  if (type === void 0) {
    type = 'mouse';
  }
  // Get the unsorted mice.
  var unsortedMice = [];
  if (currentMapData.goals[type]) {
    unsortedMice = currentMapData.goals[type];
  }

  // Get the mice that have been caught from each hunter.
  var caughtMice = [];
  // get the ids from currentMapData.hunters.completed_goal_ids.mouse
  currentMapData.hunters.forEach(function (hunter) {
    caughtMice = caughtMice.concat(hunter.completed_goal_ids[type]);
  });

  // Remove the caught mice from the unsorted mice.
  if (getSetting('mh-mapper-debug', false)) {
    console.log('keeping caught mice', caughtMice); // eslint-disable-line no-console
  } else {
    unsortedMice = unsortedMice.filter(function (mouse) {
      return caughtMice.indexOf(mouse.unique_id) === -1;
    });
  }
  var categories = [];
  if (mouseGroups[currentMapData.map_type] && mouseGroups[currentMapData.map_type].categories) {
    categories = mouseGroups[currentMapData.map_type].categories;
  }
  var subcategories = [];
  if (mouseGroups[currentMapData.map_type] && mouseGroups[currentMapData.map_type].subcategories) {
    subcategories = mouseGroups[currentMapData.map_type].subcategories;
  }
  return {
    unsortedMice: unsortedMice,
    categories: categories,
    subcategories: subcategories,
    getMouseDataForMap: getMouseDataForMap
  };
};
var addMHCTData = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(mouse, mouseExtraInfo, type) {
    var existingMhct, mhctPath, mhctdata, mhctjson, mhctDiv, mhctTitle;
    return regenerator.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (type === void 0) {
            type = 'mouse';
          }
          existingMhct = mouseExtraInfo.querySelector("#mhct-" + mouse.unique_id);
          if (!existingMhct) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return");
        case 4:
          mhctPath = 'mhct';
          if ('item' === type) {
            mhctPath = 'mhct-item';
          }
          _context3.next = 8;
          return fetch("https://api.mouse.rip/" + mhctPath + "/" + mouse.unique_id);
        case 8:
          mhctdata = _context3.sent;
          _context3.next = 11;
          return mhctdata.json();
        case 11:
          mhctjson = _context3.sent;
          mhctDiv = document.createElement('div');
          mhctDiv.classList.add('mhct-data');
          mhctDiv.id = "mhct-" + mouse.unique_id;
          mhctTitle = document.createElement('div');
          mhctTitle.classList.add('mhct-title');
          if ('item' === type) {
            mhctTitle.innerText = 'Drop Rates';
          } else {
            mhctTitle.innerText = 'Attraction Rates';
          }
          mhctDiv.appendChild(mhctTitle);
          mhctjson.slice(0, 5).forEach(function (mhct) {
            var mhctRow = document.createElement('div');
            mhctRow.classList.add('mhct-row');
            var location = document.createElement('div');
            location.classList.add('mhct-location');
            var locationTextSpan = document.createElement('span');
            locationTextSpan.classList.add('mhct-location-text');
            locationTextSpan.innerText = mhct.location;
            location.appendChild(locationTextSpan);
            if (mhct.stage) {
              var stageText = document.createElement('span');
              stageText.classList.add('mhct-stage');
              stageText.innerText = " " + mhct.stage;
              location.appendChild(stageText);
            }
            mhctRow.appendChild(location);
            var bait = document.createElement('div');
            bait.classList.add('mhct-bait');
            bait.innerText = mhct.cheese;
            mhctRow.appendChild(bait);
            var rate = document.createElement('div');
            rate.classList.add('mhct-rate');
            var mhctRate = 'item' === type ? mhct.drop_pct : mhct.rate / 100;
            rate.innerText = parseInt(mhctRate, 10).toFixed(1) + "%";
            mhctRow.appendChild(rate);
            mhctDiv.appendChild(mhctRow);
          });
          mouseExtraInfo.appendChild(mhctDiv);
        case 21:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function addMHCTData(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var showTravelConfirmation = function showTravelConfirmation(environment, mapModel) {
  var environmentData = mapModel.getEnvironmentById(environment.id);
  var environmentGoals = mapModel.getGoalsByEnvironment(environment.id);
  var templateData = {
    environment: environmentData,
    goals: environmentGoals
  };
  var noun = environmentData.num_missing_goals === 1 ? 'mouse' : 'mice';
  var dialog = new hg.views.TreasureMapDialogView();
  dialog.setTitle('Travel to ' + environmentData.name + '?');
  dialog.setDescription('This area has ' + environmentData.num_missing_goals + ' missing ' + noun + '.');
  dialog.setContent(hg.utils.TemplateUtil.renderFromFile('TreasureMapDialogView', 'travel', templateData));
  dialog.setCssClass('confirm');
  dialog.setContinueAction('Travel', function () {
    app.pages.TravelPage.travel(environment.type);
  });
  hg.controllers.TreasureMapController.showDialog(dialog);
};
var makeMouseDiv = function makeMouseDiv(mouse) {
  // Wrapper.
  var mouseDiv = makeElement('div', 'mouse-container');

  // Wrapper IDs.
  mouseDiv.setAttribute('data-mouse-id', mouse.unique_id);
  mouseDiv.setAttribute('data-mouse-type', mouse.type);

  // Mouse header.
  var mouseData = makeElement('div', 'mouse-data');
  var mouseImage = makeElement('img', 'mouse-image');
  mouseImage.src = mouse.small;
  mouseImage.alt = mouse.name;
  mouseData.appendChild(mouseImage);
  makeElement('div', 'mouse-name', mouse.name, mouseData);

  // Mouse header close.
  mouseDiv.appendChild(mouseData);

  // Mouse extra info.
  var mouseExtraInfo = makeElement('div', 'mouse-extra-info');

  // Mouse locations.
  var locations = makeElement('div', 'mouse-locations-wrapper');
  makeElement('div', 'location-text', 'Found in:', locations);
  var locationLocations = makeElement('div', 'mouse-locations');
  mouse.environment_ids.forEach(function (environmentID) {
    var environment = window.mhmapper.mapData.environments.find(function (env) {
      return env.id === environmentID;
    });
    if (environment) {
      var location = makeElement('a', 'mouse-location', environment.name, locationLocations);
      location.title = "Travel to " + environment.name;
      location.setAttribute('data-environment-id', environment.id);
      location.addEventListener('click', function () {
        showTravelConfirmation(environment, window.mhmapper.mapModel);
      });
    }
  });

  // Mouse locations close.
  locations.appendChild(locationLocations);
  mouseExtraInfo.appendChild(locations);

  // Mouse weakness.
  if (mouse.weaknesses) {
    var weakness = makeElement('div', 'mouse-weakness');
    mouse.weaknesses.forEach(function (weaknessType) {
      if (weaknessType.power_types.length === 0) {
        return;
      }

      // Weakness wrapper.
      var weaknessTypeDiv = makeElement('div', 'weakness-type');
      makeElement('div', 'weakness-name', weaknessType.name, weaknessTypeDiv);
      var powerTypes = makeElement('div', 'power-types');
      weaknessType.power_types.forEach(function (type) {
        var powerType = document.createElement('img');
        powerType.src = "https://www.mousehuntgame.com/images/powertypes/" + type.name + ".png";
        powerTypes.appendChild(powerType);
      });

      // Weakness wrapper close.
      weaknessTypeDiv.appendChild(powerTypes);
      weakness.appendChild(weaknessTypeDiv);
    });

    // Mouse weakness close.
    mouseExtraInfo.appendChild(weakness);
  }

  // Mouse extra info close.
  mouseDiv.appendChild(mouseExtraInfo);

  // Click handler.
  mouseDiv.addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
    var isSelected, addClass, allSelected;
    return regenerator.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          isSelected = mouseDiv.classList.contains('mouse-container-selected');
          if (!isSelected) {
            _context4.next = 4;
            break;
          }
          mouseDiv.classList.remove('mouse-container-selected');
          return _context4.abrupt("return");
        case 4:
          // On click, show the mouse extra info.
          console.log(mouse); // eslint-disable-line no-console

          // Append MHCT data.
          addMHCTData(mouse, mouseExtraInfo);

          // Only allow one mouse to be selected at a time.
          addClass = !mouseDiv.classList.contains('mouse-container-selected'); // Clear all selected.
          allSelected = document.querySelectorAll('.mouse-container-selected');
          if (allSelected) {
            allSelected.forEach(function (selected) {
              selected.classList.remove('mouse-container-selected');
            });
          }

          // Except this one if it's not selected.
          if (addClass) {
            mouseDiv.classList.add('mouse-container-selected');
          }
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  return mouseDiv;
};
var makeItemDiv = function makeItemDiv(item) {
  // Wrapper.
  var itemDiv = makeElement('div', 'mouse-container');

  // Wrapper IDs.
  itemDiv.setAttribute('data-mouse-id', item.unique_id);
  itemDiv.setAttribute('data-mouse-type', item.type);

  // item header.
  var itemData = makeElement('div', 'mouse-data');
  var itemImage = makeElement('img', 'mouse-image');
  itemImage.src = item.thumb;
  itemImage.alt = item.name;
  itemData.appendChild(itemImage);
  makeElement('div', 'mouse-name', item.name, itemData);

  // item header close.
  itemDiv.appendChild(itemData);

  // item extra info.
  var itemExtraInfo = makeElement('div', 'mouse-extra-info');
  itemDiv.appendChild(itemExtraInfo);
  itemDiv.addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
    var isSelected, addClass, allSelected;
    return regenerator.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          isSelected = itemDiv.classList.contains('mouse-container-selected');
          if (!isSelected) {
            _context5.next = 4;
            break;
          }
          itemDiv.classList.remove('mouse-container-selected');
          return _context5.abrupt("return");
        case 4:
          // On click, show the mouse extra info.
          console.log(item); // eslint-disable-line no-console

          // Append MHCT data.
          addMHCTData(item, itemExtraInfo, 'item');

          // Only allow one mouse to be selected at a time.
          addClass = !itemDiv.classList.contains('mouse-container-selected'); // Clear all selected.
          allSelected = document.querySelectorAll('.mouse-container-selected');
          if (allSelected) {
            allSelected.forEach(function (selected) {
              selected.classList.remove('mouse-container-selected');
            });
          }

          // Except this one if it's not selected.
          if (addClass) {
            itemDiv.classList.add('mouse-container-selected');
          }
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  return itemDiv;
};
var makeSortedMiceList = function makeSortedMiceList() {
  // Get the current map data.
  var currentMapData = getMapData(window.mhmapper.mapData.map_id);
  var _getMouseDataForMap = getMouseDataForMap(currentMapData),
    unsortedMice = _getMouseDataForMap.unsortedMice,
    categories = _getMouseDataForMap.categories,
    subcategories = _getMouseDataForMap.subcategories;
  var sortedPage = document.createElement('div');
  sortedPage.className = 'sorted-page';
  var categoriesWrapper = document.createElement('div');
  categoriesWrapper.className = 'mouse-category-container';

  // Foreach category, create a category wrapper
  categories.forEach(function (category) {
    var categoryID = category.id;

    // Create the category wrapper.
    var categoryWrapper = makeElement('div', 'mouse-category-wrapper');
    categoryWrapper.classList.add("mouse-category-" + categoryID, 'mouse-category-wrapper-hidden');

    // Category header.
    var categoryHeader = makeElement('div', 'mouse-category-header');
    if (category.color) {
      categoryWrapper.style.backgroundColor = category.color;
    }

    // Icon, title, and subtitle wrapper.
    var iconTitleWrapper = makeElement('div', 'mouse-category-icon-title-wrapper');
    if (category.icon) {
      var categoryIcon = makeElement('img', 'mouse-category-icon');

      // if the string starts with a /, then it's a relative path, otherwise it's a full path
      categoryIcon.src = category.icon.indexOf('/') === 0 ? "https://www.mousehuntgame.com/images" + category.icon : category.icon;
      iconTitleWrapper.appendChild(categoryIcon);
    }

    // Title, icon, and subtitle wrapper.
    var iconTitleTitleWrapper = makeElement('div', 'mouse-category-icon-title-title-wrapper');
    makeElement('div', 'mouse-category-title', category.name, iconTitleTitleWrapper);
    makeElement('div', 'mouse-category-subtitle', category.subtitle, iconTitleTitleWrapper);

    // Title, icon, and subtitle wrapper close.
    iconTitleWrapper.appendChild(iconTitleTitleWrapper);

    // Category header close.
    categoryHeader.appendChild(iconTitleWrapper);

    // Category wrapper close.
    categoryWrapper.appendChild(categoryHeader);

    // Mice in category.
    var categoryMice = makeElement('div', 'mouse-category-mice');
    var addToSubCat = [];

    // loop through the mice properties and add them to the category
    category.mice.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      return 1;
    });
    category.mice.forEach(function (mouse) {
      // if the mouse is a string, then it's just a name, otherwise it's an object with a name and a subcategory
      var hasSubCat = false;
      var mouseType = mouse;
      if (typeof mouse === 'object' && mouse.subcategory) {
        hasSubCat = mouse.subcategory;
        mouseType = mouse.mouse;
      }

      // Check if the mouse is in the unsorted list
      var mouseIndex = unsortedMice.findIndex(function (unsortedMouse) {
        return unsortedMouse.type === mouseType;
      });
      if (mouseIndex === -1) {
        return;
      }
      console.log(unsortedMice[mouseIndex]); // eslint-disable-line no-console
      var mouseDiv = makeMouseDiv(unsortedMice[mouseIndex]);
      if (hasSubCat) {
        if (!addToSubCat[hasSubCat]) {
          addToSubCat[hasSubCat] = [];
        }
        addToSubCat[hasSubCat].push(mouseDiv);
      } else {
        categoryMice.appendChild(mouseDiv);
      }
      categoryWrapper.appendChild(categoryMice);

      // remove the mouse from the unsorted list
      unsortedMice.splice(mouseIndex, 1);
      categoryWrapper.classList.remove('mouse-category-wrapper-hidden');
    });

    // loop through the subcategories and add them to the category
    // foreach key
    subcategories.forEach(function (subcategory) {
      // if there are items in addToSubCat for this subcategory, then add them
      if (addToSubCat[subcategory.id] && addToSubCat[subcategory.id].length > 0) {
        // make a subcategory wrapper
        var subcategoryWrapper = document.createElement('div');
        subcategoryWrapper.classList.add('mouse-subcategory-wrapper', "mouse-subcategory-" + subcategory.id);
        if (subcategory.color) {
          subcategoryWrapper.style.backgroundColor = subcategory.color;
        }

        // find the subcategory name
        var currentSubCat = mouseGroups[currentMapData.map_type].subcategories.find(function (subcat) {
          return subcat.id === subcategory.id;
        });

        // Subcategory header.
        var subcategoryHeader = makeElement('div', 'mouse-subcategory-header');
        makeElement('div', 'mouse-subcategory-title', currentSubCat.name, subcategoryHeader);
        subcategoryWrapper.appendChild(subcategoryHeader);

        // Mice in subcategory.
        var subcategoryMice = makeElement('div', 'mouse-subcategory-mice');
        addToSubCat[subcategory.id].forEach(function (mouseDiv) {
          subcategoryMice.appendChild(mouseDiv);
        });
        subcategoryWrapper.appendChild(subcategoryMice);
        categoryWrapper.appendChild(subcategoryWrapper);
      }
    });
    categoriesWrapper.appendChild(categoryWrapper);
  });

  // make a category for the unsorted mice
  if (unsortedMice.length > 0) {
    // Wrapper
    var unsortedWrapper = makeElement('div', 'mouse-category-wrapper');
    unsortedWrapper.classList.add('mouse-category-unsorted');

    // Header
    var unsortedHeader = makeElement('div', 'mouse-category-header');

    // Title
    var unsortedTitle = makeElement('div', 'mouse-category-title', 'Unsorted');
    unsortedHeader.appendChild(unsortedTitle);

    // Header close
    unsortedWrapper.appendChild(unsortedHeader);

    // Mice
    var unsortedMiceDiv = makeElement('div', 'mouse-category-mice');
    unsortedMice.forEach(function (mouse) {
      unsortedMiceDiv.appendChild(makeMouseDiv(mouse));
    });

    // Mice close
    unsortedWrapper.appendChild(unsortedMiceDiv);

    // Wrapper close
    categoriesWrapper.appendChild(unsortedWrapper);
  }
  sortedPage.appendChild(categoriesWrapper);
  var miceDiv = makeElement('div', 'mice-container');
  miceDiv.appendChild(sortedPage);
  return miceDiv;
};
var makeGenericSortedPage = function makeGenericSortedPage() {
  var sortedPage = makeElement('div', 'sorted-page');
  makeElement('div', 'generic-sorted-page-content');
  var currentMapData = getMapData(window.mhmapper.mapData.map_id);
  var type = 'mouse';
  if (currentMapData.map_type.includes('scavenger')) {
    type = 'item';
  }
  var _getMouseDataForMap2 = getMouseDataForMap(currentMapData, type),
    unsortedMice = _getMouseDataForMap2.unsortedMice;
  var miceDiv = makeElement('div', 'mice-container');
  unsortedMice.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  unsortedMice.forEach(function (mouse) {
    var mousediv = null;
    if ('mouse' === type) {
      mousediv = makeMouseDiv(mouse);
    } else {
      mousediv = makeItemDiv(mouse);
    }
    miceDiv.appendChild(mousediv);
  });
  miceDiv.appendChild(sortedPage);
  return miceDiv;
};
var addGoalsTabListener = function addGoalsTabListener() {
  var tabs = document.querySelector('.treasureMapRootView-subTab[data-type="show_goals"]');
  if (tabs) {
    tabs.addEventListener('click', processGoalsTabClick);
  }
};
var processGoalsTabClick = function processGoalsTabClick() {
  var _user, _user$quests, _user$quests$QuestRel;
  var mapId = (_user = user) == null ? void 0 : (_user$quests = _user.quests) == null ? void 0 : (_user$quests$QuestRel = _user$quests.QuestRelicHunter) == null ? void 0 : _user$quests$QuestRel.default_map_id; // eslint-disable-line no-undef
  console.log('processGoalsTabClick', mapId); // eslint-disable-line no-console
  if (mapId) {
    eventRegistry.doEvent('map_goals_tab_click', mapId);
  }
};
var moveTabToBody = function moveTabToBody() {
  var sortedMiceContainer = document.querySelector('#sorted-mice-container');
  if (!sortedMiceContainer) {
    return;
  }
  var body = document.querySelector('body');
  if (!body) {
    return;
  }
  body.appendChild(sortedMiceContainer);
};
var showSortedTab = function showSortedTab() {
  var currentlyActive = document.querySelector('.treasureMapRootView-subTab.sorted-map-tab.active');
  if (currentlyActive) {
    return;
  }
  var otherTabs = document.querySelectorAll('.treasureMapRootView-subTab:not(.sorted-map-tab)');
  if (otherTabs) {
    otherTabs.forEach(function (tab) {
      // remove the event listener, then add it back.
      tab.removeEventListener('click', moveTabToBody);
      tab.addEventListener('click', moveTabToBody);
    });
  }
  addGoalsTabListener();

  // Get the current map data.
  var currentMapData = window.mhmapper.mapData;
  if (!currentMapData || !currentMapData.goals) {
    return;
  }

  // First, remove the active class from the other tab, and add it to this one.
  var activeTab = document.querySelector('.treasureMapRootView-subTab.active');
  if (activeTab) {
    activeTab.classList.remove('active');
  }
  var sortedTab = document.querySelector('.treasureMapRootView-subTab.sorted-map-tab');
  if (sortedTab) {
    sortedTab.classList.add('active');
  }
  var mapContainer = document.querySelector('.treasureMapView-blockWrapper');
  if (!mapContainer) {
    return;
  }

  // Now, hide the regular mice list, and show the sorted one.
  var leftBlock = mapContainer.querySelector('.treasureMapView-leftBlock');
  if (leftBlock) {
    leftBlock.style.display = 'none';
  }
  var rightBlock = mapContainer.querySelector('.treasureMapView-rightBlock');
  if (rightBlock) {
    rightBlock.style.display = 'none';
  }
  var existing = document.querySelector('#sorted-mice-container');
  if (existing) {
    existing.remove();
  }
  var sortedMiceContainer = document.createElement('div');
  sortedMiceContainer.id = 'sorted-mice-container';
  var sortedMiceList = null;
  if (mouseGroups[currentMapData.map_type]) {
    sortedMiceList = makeSortedMiceList();
  } else {
    sortedMiceList = makeGenericSortedPage();
  }
  sortedMiceContainer.appendChild(sortedMiceList);
  mapContainer.appendChild(sortedMiceContainer);
  addAreaHighlighting();
};
var addSortedMapTab = function addSortedMapTab() {
  var mapTabs = document.querySelector('.treasureMapRootView-subTabContainer');
  if (!mapTabs || mapTabs.length <= 0) {
    return false;
  }
  if (mapTabs.querySelector('.sorted-map-tab')) {
    return false;
  }
  var sortedTab = document.createElement('a');
  sortedTab.className = 'treasureMapRootView-subTab sorted-map-tab';
  sortedTab.setAttribute('data-type', 'sorted');
  sortedTab.innerText = 'Sorted';
  sortedTab.addEventListener('click', showSortedTab);
  var divider = document.createElement('div');
  divider.className = 'treasureMapRootView-subTab-spacer';

  // Add as the first tab.
  mapTabs.insertBefore(divider, mapTabs.children[0]);
  mapTabs.insertBefore(sortedTab, mapTabs.children[0]);
  return true;
};
var main$4 = function main() {
  return addSortedMapTab();
};

var makeUserTableLoading = function makeUserTableLoading(id, title, appendTo) {
  var wrapper = makeElement('div', 'treasureMapView-block-title', title);
  wrapper.id = "hunters-loading-" + id + "-title";
  appendTo.appendChild(wrapper);
  var loading = makeElement('div', 'treasureMapView-block');
  loading.id = "hunters-loading-" + id + "-block";
  var loadingWwrapper = makeElement('div', 'treasureMapView-allyTable', '');
  var row = makeElement('div', 'treasureMapView-allyRow', '');
  makeElement('div', ['mousehuntPage-loading', 'active'], '', row);
  loadingWwrapper.appendChild(row);
  loading.appendChild(loadingWwrapper);
  appendTo.appendChild(loading);
};
var makeUserTable = function makeUserTable(hunters, id, title, appendTo) {
  var loadingTitle = document.getElementById("hunters-loading-" + id + "-title");
  var loadingBlock = document.getElementById("hunters-loading-" + id + "-block");
  if (loadingTitle) {
    loadingTitle.remove();
  }
  if (loadingBlock) {
    loadingBlock.remove();
  }
  var wrapper = makeElement('div', 'treasureMapView-block-title', title);
  wrapper.id = "hunters-" + id;
  appendTo.appendChild(wrapper);
  var block = makeElement('div', 'treasureMapView-block');
  block.id = "hunters-" + id + "-block";
  var blockContent = makeElement('div', 'treasureMapView-block-content');
  var table = makeElement('div', 'treasureMapView-allyTable');
  hunters.forEach(function (hunter) {
    var actions = "<a href=\"supplytransfer.php?fid=" + hunter.sn_user_id + "\"class=\"mousehuntActionButton tiny lightBlue\"><span>Send<br>Supplies</span></a>";
    if ('requests' === id) {
      var declineAction = "<a class=\"treasureMapDialogView-deleteInviteRequest reject-invite-request mh-mapper-invite-request-action\" data-snuid=\"" + hunter.sn_user_id + "\" data-snuid=\"100000830940163\">X</a>";
      var acceptAction = "<a href=\"#\" class=\"treasureMapDialogView-continueButton mousehuntActionButton accept-invite-request mh-mapper-invite-request-action\" data-snuid=\"" + hunter.sn_user_id + "\"><span>Accept</span></a>";
      actions = "" + declineAction + acceptAction;
    }
    var markup = "<div class=\"treasureMapView-allyCell favourite\"></div>\n      <div class=\"treasureMapView-allyCell image\">\n        <div class=\"treasureMapView-hunter\">\n          <div class=\"treasureMapView-hunter-image-wrapper\">\n            <img src=\"" + hunter.profile_pic + "\" class=\"treasureMapView-hunter-image\">\n          </div>\n        </div>\n      </div>\n      <div class=\"treasureMapView-allyCell name\">\n        <div class=\"treasureMapView-ally-name\">\n        <a href=\"https://www.mousehuntgame.com/profile.php?snuid=" + hunter.sn_user_id + "\">" + hunter.name + "</a>\n        </div>\n        <a href=\"#\" class=\"treasureMapView-ally-environment treasureMapView-travelButton\" data-environment-id=\"" + hunter.environment_id + "\">\n        " + hunter.environment_name + "\n        </a>\n      </div>\n      <div class=\"treasureMapView-allyCell lastActive\">\n        <div class=\"treasureMapView-ally-lastActive online\">\n          " + hunter.last_active_formatted + "\n        </div>\n      </div>\n      <div class=\"treasureMapView-allyCell trap\">\n        <div class=\"treasureMapView-componentContainer\">\n          <div class=\"treasureMapView-componentThumb\" style=\"background-image: url(" + hunter.base_thumb + ");\" title=\"" + hunter.base_name + "\"></div>\n          <div class=\"treasureMapView-componentThumb\" style=\"background-image: url(" + hunter.weapon_thumb + ");\" title=\"" + hunter.weapon_name + "\"></div>\n          <div class=\"treasureMapView-componentThumb\" style=\"background-image: url(" + hunter.bait_thumb + ");\" title=\"" + hunter.bait_name + "\"></div>\n          <div class=\"treasureMapView-componentThumb\" style=\"background-image: url(" + hunter.trinket_thumb + ");\" title=\"" + hunter.trinket_name + "\"></div>\n        </div>\n      </div>\n      <div class=\"treasureMapView-allyCell actions\">" + actions + "</div>";
    makeElement('div', 'treasureMapView-allyRow', markup, table);
  });
  block.appendChild(table);
  blockContent.appendChild(block);
  appendTo.appendChild(block);
  if ('requests' === id) {
    var actionButtons = document.querySelectorAll('.mh-mapper-invite-request-action');
    actionButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var snuid = parseInt(button.dataset.snuid, 10);
        if (button.classList.contains('accept-invite-request')) {
          hg.utils.TreasureMapUtil.acceptInviteRequests(window.mhmapper.mapData.map_id, [snuid], function () {}, function () {});
        } else {
          hg.utils.TreasureMapUtil.declineInviteRequests(window.mhmapper.mapData.map_id, [snuid], function () {}, function () {});
        }
      });
    });
  }
};
var getInvitedHunterData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(invited) {
    var _hunters, batches, i, hunters, _i, batch;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(invited.length === 0)) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", []);
        case 2:
          if (!(invited.length <= 12)) {
            _context.next = 7;
            break;
          }
          _context.next = 5;
          return getUserData(invited);
        case 5:
          _hunters = _context.sent;
          return _context.abrupt("return", _hunters);
        case 7:
          // otherwise we need to do them in batches of 12
          batches = [];
          for (i = 0; i < invited.length; i += 12) {
            batches.push(invited.slice(i, i + 12));
          }
          hunters = [];
          _i = 0;
        case 11:
          if (!(_i < batches.length)) {
            _context.next = 19;
            break;
          }
          _context.next = 14;
          return getUserData(batches[_i]);
        case 14:
          batch = _context.sent;
          hunters.push.apply(hunters, batch);
        case 16:
          _i += 1;
          _context.next = 11;
          break;
        case 19:
          return _context.abrupt("return", hunters);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getInvitedHunterData(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getUserData = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(userId) {
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve) {
            hg.utils.User.getUserData(userId, ['bait_name', 'bait_thumb', 'base_name', 'base_thumb', 'environment_id', 'environment_name', 'is_online', 'last_active_formatted', 'trinket_name', 'trinket_thumb', 'weapon_name', 'weapon_thumb'], function (resp) {
              resolve(resp);
            });
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getUserData(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var showHuntersTab = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
    var emptySlots, shouldRemove, leftBlock, huntersLeft, invitedHunters, _invitedHunters;
    return regenerator.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          emptySlots = document.querySelectorAll('.treasureMapView-allyCell.name');
          if (emptySlots.length) {
            shouldRemove = false;
            emptySlots.forEach(function (slot) {
              if (slot.textContent === 'The map owner can invite more hunters.' || slot.textContent === 'Click to invite a friend.') {
                if (shouldRemove) {
                  shouldRemove.parentNode.remove();
                }
                slot.parentNode.classList.add('hunters-last-slot');
                shouldRemove = slot;
              }
            });
          }
          leftBlock = document.querySelector('.treasureMapView-leftBlock');
          if (leftBlock) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return");
        case 5:
          huntersLeft = [];
          mhmapper.mapData.hunters.forEach(function (hunter) {
            if (!hunter.is_active) {
              huntersLeft.push(hunter);
            }
          });
          if (huntersLeft.length) {
            makeUserTable(huntersLeft, 'left', "Hunters that have left map (" + huntersLeft.length + ")", leftBlock);
          }
          if (!mhmapper.mapData.invited_hunters.length) {
            _context3.next = 14;
            break;
          }
          makeUserTableLoading('invited', "Invited hunters (" + mhmapper.mapData.invited_hunters.length + ")", leftBlock);
          _context3.next = 12;
          return getInvitedHunterData(mhmapper.mapData.invited_hunters, leftBlock);
        case 12:
          invitedHunters = _context3.sent;
          makeUserTable(invitedHunters, 'invited', "Invited hunters (" + invitedHunters.length + ")", leftBlock);
        case 14:
          if (!mhmapper.mapData.invite_requests.length) {
            _context3.next = 20;
            break;
          }
          makeUserTableLoading('requests', "Hunters requesting invite (" + mhmapper.mapData.invite_requests.length + ")", leftBlock);
          _context3.next = 18;
          return getInvitedHunterData(mhmapper.mapData.invite_requests, leftBlock);
        case 18:
          _invitedHunters = _context3.sent;
          makeUserTable(_invitedHunters, 'requests', "Hunters requesting invite (" + _invitedHunters.length + ")", leftBlock);
        case 20:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function showHuntersTab() {
    return _ref3.apply(this, arguments);
  };
}();
var maybeProcessHuntersTab = function maybeProcessHuntersTab() {
  // Only do the hunters tab changes if its an active map.
  // const isActiveMap = window.user.quests.QuestRelicHunter.maps.find((m) => m.map_id === map.map_id);
  // if (! isActiveMap) {
  //   return;
  // }

  var huntersTab = document.querySelector('.treasureMapRootView-subTab[data-type="manage_allies"]');
  if (!huntersTab) {
    return;
  }
  huntersTab.addEventListener('click', showHuntersTab);
};
var main$3 = function main() {
  maybeProcessHuntersTab();
  eventRegistry.addEventListener('map_data_loaded', function (mapData) {
    maybeProcessHuntersTab();
  });
};

var aCallable = aCallable$a;
var toObject = toObject$6;
var IndexedObject$1 = indexedObject;
var lengthOfArrayLike = lengthOfArrayLike$9;

var $TypeError = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$1 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable(callbackfn);
    var O = toObject(that);
    var self = IndexedObject$1(O);
    var length = lengthOfArrayLike(O);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw $TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod$1(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod$1(true)
};

var $$2 = _export;
var $reduce = arrayReduce.left;
var arrayMethodIsStrict$1 = arrayMethodIsStrict$5;
var CHROME_VERSION = engineV8Version;
var IS_NODE = engineIsNode;

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED$1 = CHROME_BUG || !arrayMethodIsStrict$1('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$$2({ target: 'Array', proto: true, forced: FORCED$1 }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});

var getRemaining = function getRemaining(goals, hunters) {
  // get the completed_goal_ids.item from all the hunters
  var completed = hunters.reduce(function (acc, val) {
    var _val$completed_goal_i;
    if ((_val$completed_goal_i = val.completed_goal_ids) != null && _val$completed_goal_i.item) {
      return acc.concat(val.completed_goal_ids.item);
    }
    return acc;
  }, []);

  // get the remaining goals
  var remaining = goals.filter(function (goal) {
    return !completed.includes(goal.unique_id);
  });
  return remaining;
};
var makeItemBlock = function makeItemBlock(mice) {
  var miceWrapper = makeElement('div', ['pageSidebarView-block', 'mh-mapper-sidebar-mice']);

  // alphabetize the mice
  mice.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  mice.forEach(function (mouse) {
    var mouseWrapper = makeElement('div', 'mh-mapper-sidebar-mouse');
    mouseWrapper.addEventListener('click', function (e) {
      e.preventDefault();
      hg.views.ItemView.show(mouse.type);
    });
    var mouseImage = makeElement('img', 'mouse-image');
    mouseImage.src = mouse.thumb;
    mouseImage.alt = mouse.name;
    mouseWrapper.appendChild(mouseImage);
    var mouseName = makeElement('a', 'mouse-name', mouse.name);
    mouseName.href = '#';
    mouseName.addEventListener('click', function (e) {
      e.preventDefault();
      hg.views.MouseView.show(mouse.type);
    });
    mouseWrapper.appendChild(mouseName);
    miceWrapper.appendChild(mouseWrapper);
  });
  return miceWrapper;
};
var addItemsToSidebar = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(remainingItems) {
    var sidebar, existingSidebar, block, nameWrapper, nameA, miceBlock;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          sidebar = document.querySelector('.pageSidebarView');
          if (!(!sidebar || sidebar.children.length < 3)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", false);
        case 3:
          existingSidebar = document.querySelector('#mh-items-sidebar');
          if (existingSidebar) {
            existingSidebar.remove();
          }
          block = makeElement('div', ['pageSidebarView-block', 'mh-mapper-sidebar']);
          block.id = 'mh-items-sidebar';
          nameWrapper = makeElement('div', 'mh-mapper-sidebar-name');
          nameA = makeElement('a', ['mousehuntHud-userStat', 'treasureMap']);
          nameA.href = '#';
          nameA.addEventListener('click', function (e) {
            e.preventDefault();
            hg.controllers.TreasureMapController.show();
          });
          makeElement('span', 'label', 'Remaining Items', nameA);
          nameWrapper.appendChild(nameA);
          block.appendChild(nameWrapper);
          miceBlock = makeItemBlock(remainingItems);
          if (miceBlock) {
            _context.next = 17;
            break;
          }
          return _context.abrupt("return", false);
        case 17:
          block.appendChild(miceBlock);
          sidebar.insertBefore(block, sidebar.children[2]);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function addItemsToSidebar(_x) {
    return _ref.apply(this, arguments);
  };
}();
function initScavenger(map) {
  if (map === void 0) {
    map = null;
  }
  if (!map) {
    map = getMapData();
    if (!map.is_scavenger_hunt) {
      return;
    }
  }
  var remainingItems = getRemaining(map.goals.item, map.hunters);
  addItemsToSidebar(remainingItems);
}

var DESCRIPTORS = descriptors;
var uncurryThis$1 = functionUncurryThis;
var objectKeys = objectKeys$2;
var toIndexedObject$1 = toIndexedObject$7;
var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

var propertyIsEnumerable = uncurryThis$1($propertyIsEnumerable);
var push = uncurryThis$1([].push);

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject$1(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable(O, key)) {
        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

var objectToArray = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};

var $$1 = _export;
var $values = objectToArray.values;

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$$1({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

var css_248z$5 = ".mh-mapper-sidebar{border:1px solid #ddedff;margin:10px 0 20px;padding:0}.mh-mapper-sidebar .mh-mapper-sidebar-name{background-color:#ddedff;padding:5px;width:auto}.mh-mapper-sidebar-mouse:hover{filter:none}.mh-mice-sidebar{background-color:#ddedff}.mh-mapper-sidebar .mousehuntHud-userStat.treasureMap{align-items:center;display:flex;justify-content:center;text-shadow:none;width:100%}.mh-mapper-sidebar .mousehuntHud-userStat.treasureMap .label{color:#181818;padding:0;text-shadow:none;width:auto}.mh-mapper-sidebar .mousehuntHud-userStat.treasureMap .icon{margin-right:10px}.mh-mapper-sidebar-mouse{align-items:center;display:flex;gap:5px;justify-content:flex-start;padding:1px 5px}.mh-mapper-sidebar .mouse-image{height:25px;width:25px}";

var makeMiceBlock = function makeMiceBlock(mice, type) {
  if (type === void 0) {
    type = 'map';
  }
  var miceWrapper = makeElement('div', ['pageSidebarView-block', 'mh-mapper-sidebar-mice']);
  mice.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  mice.forEach(function (mouse) {
    var mouseWrapper = makeElement('div', 'mh-mapper-sidebar-mouse');
    mouseWrapper.addEventListener('click', function (e) {
      e.preventDefault();
      hg.views.MouseView.show(mouse.type);
    });
    var mouseImage = makeElement('img', 'mouse-image');
    mouseImage.src = type === 'map' ? mouse.small : mouse.thumb;
    mouseImage.alt = mouse.name;
    mouseWrapper.appendChild(mouseImage);
    var mouseName = makeElement('a', 'mouse-name', mouse.name);
    mouseName.href = '#';
    mouseName.addEventListener('click', function (e) {
      e.preventDefault();
      hg.views.MouseView.show(mouse.type);
    });
    mouseWrapper.appendChild(mouseName);
    miceWrapper.appendChild(mouseWrapper);
  });
  return miceWrapper;
};
var addToSidebar = function addToSidebar(mapData) {
  var _user, _user$quests, _user$quests$QuestRel, _user2, _user2$quests, _user2$quests$QuestRe, _mapData$goals, _mapData$goals2;
  var sidebar = document.querySelector('.pageSidebarView');
  if (!sidebar || sidebar.children.length < 3) {
    return false;
  }
  var existingSidebar = document.querySelector('#mh-mapper-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }
  var block = makeElement('div', ['pageSidebarView-block', 'mh-mapper-sidebar']);
  block.id = 'mh-mapper-sidebar';
  var nameWrapper = makeElement('div', 'mh-mapper-sidebar-name');
  var nameA = makeElement('a', ['mousehuntHud-userStat', 'treasureMap']);
  nameA.href = '#';
  nameA.addEventListener('click', function (e) {
    e.preventDefault();
    hg.controllers.TreasureMapController.show(mapData.map_id);
  });
  var icon = makeElement('div', 'icon');
  icon.style.backgroundImage = "url(" + mapData.thumb + ")";

  // const model = new hg.models.TreasureMapModel(mapData);

  // check model.hasMessage() here probably.
  var notification = makeElement('div', 'notification', '0');
  icon.appendChild(notification);

  // check for corkboard update here.
  var corkboardUpdate = makeElement('div', 'corkboardUpdate');
  if ((_user = user) != null && (_user$quests = _user.quests) != null && (_user$quests$QuestRel = _user$quests.QuestRelicHunter) != null && _user$quests$QuestRel.new_chat) {
    corkboardUpdate.classList.add('active');
  }
  icon.appendChild(corkboardUpdate);
  var miceWarning = makeElement('div', 'miceWarning');
  if ((_user2 = user) != null && (_user2$quests = _user2.quests) != null && (_user2$quests$QuestRe = _user2$quests.QuestRelicHunter) != null && _user2$quests$QuestRe.mice_warning) {
    miceWarning.classList.add('active');
  }
  icon.appendChild(miceWarning);
  nameA.appendChild(icon);
  makeElement('span', 'label', mapData.name, nameA);
  nameWrapper.appendChild(nameA);
  block.appendChild(nameWrapper);
  var mice = mapData == null ? void 0 : (_mapData$goals = mapData.goals) == null ? void 0 : _mapData$goals.mouse;
  if (!mice || !mice.length) {
    return false;
  }
  var unsortedMice = [];
  if (mapData != null && (_mapData$goals2 = mapData.goals) != null && _mapData$goals2.mouse) {
    unsortedMice = mapData.goals.mouse;
  }
  var caughtMice = [];
  // get the ids from currentMapData.hunters.completed_goal_ids.mouse
  mapData.hunters.forEach(function (hunter) {
    caughtMice = caughtMice.concat(hunter.completed_goal_ids.mouse);
  });

  // Remove the caught mice from the unsorted mice.
  unsortedMice = unsortedMice.filter(function (mouse) {
    return caughtMice.indexOf(mouse.unique_id) === -1;
  });
  var miceBlock = makeMiceBlock(unsortedMice);
  if (!miceBlock) {
    return false;
  }
  block.appendChild(miceBlock);
  sidebar.insertBefore(block, sidebar.children[2]);
};
var main$2 = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    var _user$quests2, _user$quests2$QuestRe;
    var mapId;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          addMapperStyles(css_248z$5);
          mapId = (_user$quests2 = user.quests) == null ? void 0 : (_user$quests2$QuestRe = _user$quests2.QuestRelicHunter) == null ? void 0 : _user$quests2$QuestRe.default_map_id;
          if (mapId) {
            addToSidebar(getMapData(mapId));
          }
          addMiceToSidebar();
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function main() {
    return _ref.apply(this, arguments);
  };
}();

// playing with sidebar
var getMiceEffectivness = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
    var data, mice;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return doRequest('managers/ajax/users/getmiceeffectiveness.php');
        case 2:
          data = _context2.sent;
          if (data.effectiveness) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return");
        case 5:
          // get all the mice arrays that are in the different jeys in the effectiveness object
          mice = Object.values(data.effectiveness).reduce(function (acc, val) {
            if (val.difficulty !== 'impossible') {
              return acc.concat(val.mice);
            }
            return acc;
          }, []);
          return _context2.abrupt("return", mice);
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getMiceEffectivness() {
    return _ref2.apply(this, arguments);
  };
}();
var addMiceToSidebar = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
    var mice, sidebar, existingSidebar, block, nameWrapper, nameA, miceBlock;
    return regenerator.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return getMiceEffectivness();
        case 2:
          mice = _context3.sent;
          if (mice) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return");
        case 5:
          sidebar = document.querySelector('.pageSidebarView');
          if (!(!sidebar || sidebar.children.length < 3)) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", false);
        case 8:
          existingSidebar = document.querySelector('#mh-mice-sidebar');
          if (existingSidebar) {
            existingSidebar.remove();
          }
          block = makeElement('div', ['pageSidebarView-block', 'mh-mapper-sidebar']);
          block.id = 'mh-mice-sidebar';
          nameWrapper = makeElement('div', 'mh-mapper-sidebar-name');
          nameA = makeElement('a', ['mousehuntHud-userStat', 'treasureMap']);
          nameA.href = '#';
          nameA.addEventListener('click', function (e) {
            e.preventDefault();
            app.pages.CampPage.toggleTrapEffectiveness(true);
          });
          makeElement('span', 'label', 'Available Mice', nameA);
          nameWrapper.appendChild(nameA);
          block.appendChild(nameWrapper);
          miceBlock = makeMiceBlock(mice, 'available-mice');
          if (miceBlock) {
            _context3.next = 22;
            break;
          }
          return _context3.abrupt("return", false);
        case 22:
          block.appendChild(miceBlock);
          sidebar.insertBefore(block, sidebar.children[2]);
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function addMiceToSidebar() {
    return _ref3.apply(this, arguments);
  };
}();

var $ = _export;
var uncurryThis = functionUncurryThis;
var IndexedObject = indexedObject;
var toIndexedObject = toIndexedObject$7;
var arrayMethodIsStrict = arrayMethodIsStrict$5;

var nativeJoin = uncurryThis([].join);

var ES3_STRINGS = IndexedObject != Object;
var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: FORCED }, {
  join: function join(separator) {
    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

var css_248z$4 = ".treasureMapView-singleEnvironment-label{padding-bottom:8px}.treasureMapView-block.treasureMapView-singleEnvironment{border-radius:2px}.treasureMapView-block-content.halfHeight{border-radius:0;padding:0}.treasureMapView-environment{border:none;border-radius:3px}.treasureMapView-block{border-radius:3px}.treasureMapView-ally-ownerLabel,.treasureMapView-mapMenu-group.rewards .treasureMapView-mapMenu-group-title{display:none}input.treasureMapView-shareLinkInput{display:inline-block;margin-right:2px;padding:3px;width:87px}.treasureMapView-ownerRequestActions{display:block;margin:0 auto;width:61px}.treasureMapView-mapMenu-group.rewards{display:flex;flex-direction:row-reverse;margin-right:-5px;margin-top:-10px}.rewards .treasureMapView-mapMenu-rewardName{font-size:12px;margin-right:3px;max-width:unset}.rewards .treasureMapView-mapMenu-subgroup.chest.mousehuntTooltipParent{align-items:center;display:flex;flex-direction:row-reverse;gap:5px;margin-bottom:10px}.rewards .treasureMapView-mapMenu-group-content{display:flex;flex-wrap:wrap;justify-content:flex-end;max-width:450px}.rewards .treasureMapView-mapMenu-auraIcon{height:33px;margin-top:-10px;width:33px}.rewards .treasureMapView-mapMenu-auraIconContainer{margin:0}.rewards .treasureMapView-mapMenu-group-actions{display:flex;flex-direction:row;justify-content:flex-end;width:100%}.rewards .treasureMapView-mapMenu-group-actions .mousehuntActionButton{margin-bottom:0!important;margin-right:4px}.treasureMapView-allyCell.name{padding-left:10px}.treasureMapView-ally-name{padding-bottom:5px}.treasureMapView-mapMenu-mapIcon{width:40px}img.treasureMapView-reward-chestIcon{width:120px}.treasureMapInvitesView .treasureMapView-leftBlock:first-child .treasureMapView-block-title:first-child,.treasureMapShopsView .treasureMapView-leftBlock:first-child .treasureMapView-block-title:first-child,.treasureMapView-block-content.noMinHeight.noPadding.treasureMapInvitesView-scoreboards .treasureMapView-block-title:nth-child(3),.treasureMapView-block-content.noMinHeight.noPadding.treasureMapInvitesView-scoreboards .treasureMapView-scoreboard:nth-child(4){display:none}.treasureMapInventoryView-scrollCase-aura{font-size:9px;line-height:15px;overflow:hidden}.treasureMapInventoryView-scrollCase-aura br:after{content:\" \"}.treasureMapInventoryView-scrollCase-aura br{content:\"\"}.treasureMapInventoryView-scrollCase-aura b:first-of-type{display:block;font-size:10px}.treasureMapShopsView .treasureMapView-leftBlock{width:99%}.treasureMapShopsView .treasureMapView-rightBlock{display:none}.treasureMapPopup-shop{background-color:#fbfbfb;border:1px solid #ccc;border-radius:4px;margin-bottom:10px;padding:10px}.treasureMapPopup-shop-environment.active .treasureMapView-block-content-heading{background-color:#ccf;margin:-10px -10px 10px;padding:5px}.treasureMapPopup-shop-environment.active:before{box-shadow:none}.treasureMapView-block-content-heading{border:none}.treasureMapInventoryView-scrollCase{background-color:#fbfbfb;border:1px solid #ccc;border-radius:4px;margin-bottom:10px;margin-top:8px;padding:10px}span.treasureMapView-block-content-heading-count{display:none}.treasureMapView-block-content-heading-image{margin-right:10px}.treasureMapPopup-shop[data-environment-type=rift_valour]{background-color:#e5daed}.treasureMapPopup-shop[data-environment-type=rift_bristle_woods]{background-color:#bda39e}.treasureMapPopup-shop[data-environment-type=rift_furoma]{background-color:#ffdca4}.treasureMapPopup-shop[data-environment-type=rift_whisker_woods]{background-color:#cfe07e}.treasureMapPopup-shop[data-environment-type=rift_burroughs]{background-color:#c8c8c8}.treasureMapPopup-shop[data-environment-type=rift_gnawnia]{background-color:#ffdaf4}.treasureMapPopup-shop[data-environment-type=table_of_contents]{background-color:#dfffd4}.treasureMapPopup-shop[data-environment-type=prologue_pond]{background-color:#d3ffff}.treasureMapPopup-shop[data-environment-type=foreword_farm]{background-color:#faedcd}.treasureMapPopup-shop[data-environment-type=floating_islands]{background-color:#fce0d7}.treasureMapPopup-shop[data-environment-type=moussu_picchu]{background-color:#fed3ff}.treasureMapPopup-shop[data-environment-type=ancient_city]{background-color:#cbcbcb}.treasureMapPopup-shop[data-environment-type=fungal_cavern]{background-color:#c3f3de}.treasureMapPopup-shop[data-environment-type=sunken_city]{background-color:#c8f9ff}.treasureMapPopup-shop[data-environment-type=queso_geyser],.treasureMapPopup-shop[data-environment-type=queso_plains],.treasureMapPopup-shop[data-environment-type=queso_quarry],.treasureMapPopup-shop[data-environment-type=queso_river]{background-color:#f8f3ae}.treasureMapPopup-shop[data-environment-type=fort_rox]{background-color:#f2d5c9}.treasureMapPopup-shop[data-environment-type=desert_oasis]{background-color:#d1e7bf}.treasureMapPopup-shop[data-environment-type=desert_city]{background-color:#e48f89}.treasureMapPopup-shop[data-environment-type=desert_warpath]{background-color:#ffb280}.treasureMapPopup-shop[data-environment-type=slushy_shoreline]{background-color:#a0d3ee}.treasureMapPopup-shop[data-environment-type=seasonal_garden]{background-color:#e8e8e9}.treasureMapPopup-shop[data-environment-type=pollution_outbreak]{background-color:#cde691}.treasureMapPopup-shop[data-environment-type=kings_gauntlet]{background-color:#cfcfcf}.treasureMapPopup-shop[data-environment-type=cape_clawed]{background-color:#b8d3dc}.treasureMapPopup-shop[data-environment-type=catacombs]{background-color:#a88ca4}.treasureMapPopup-shop[data-environment-type=great_gnarled_tree]{background-color:#abd59b}.treasureMapPopup-shop[data-environment-type=town_of_digby]{background-color:#e5e6d8}.treasureMapPopup-shop[data-environment-type=mousoleum]{background-color:#d6c7a5}.treasureMapPopup-shop[data-environment-type=harbour]{background-color:#fffcb6}.treasureMapPopup-shop-item-description-costContainer{align-items:center;border-top:1px solid #ccc;display:flex;flex-direction:row;justify-content:flex-start;margin-top:10px;padding-top:5px}.treasureMapInventoryView-scrollCase{align-items:center}.treasureMapInventoryView-scrollCase-name{padding-bottom:5px}";

var css_248z$3 = ".treasureMapView-componentContainer{width:130px}.treasureMapView-block.treasureMapView-invitedHuntersList{margin:20px 0}.treasureMapView-block.treasureMapView-invitedHuntersList .userSelectorView-user-image{height:20px;width:20px}.treasureMapView-block.treasureMapView-invitedHuntersList .treasureMapView-invitedHuntersList-row-link{font-size:10px}.treasureMapView-invitedHuntersList-row{margin-top:3px}.treasureMapDialogView-deleteInviteRequest.reject-invite-request{background-color:#dcd5d5;border-radius:50%;color:#242424;display:inline-block;margin-right:6px;padding:3px;text-align:center;width:12px}.treasureMapDialogView-deleteInviteRequest.reject-invite-request:hover{background-color:#a3a3a3;text-decoration:none}.treasureMapView-allyRow:last-child .treasureMapView-allyCell.hunters-last-slot{display:inline-block;font-style:italic;margin-left:10px;margin-top:16px;vertical-align:middle;white-space:nowrap;width:90px}";

var css_248z$2 = ".treasureMapView-goals-group-goal[data-mh-ui-ar=true] .treasureMapView-goals-group-goal-name{align-items:flex-start;display:flex;flex-direction:column;justify-content:space-evenly;position:relative}.mh-ui-ar{background-color:#fff;border-radius:4px;font-size:9px;padding:2px 3px}.mh-ui-ar-guaranteed{background-color:#8ffaab}.mh-ui-ar-hard{background-color:#ffb9ba}.mh-ui-ar-medium{background-color:#ffc440}.mh-ui-ar-easy{background-color:#b9fff8}.complete .mh-ui-ar{background-color:#e5e5e5}";

var css_248z$1 = "#sorted-mice-container .mhct-data{background-color:#eaeaea;border:1px solid #000;border-top-color:#dedede;box-shadow:0 1px 2px -1px #000;display:none;left:-1px;position:absolute;right:-1px}#sorted-mice-container .mouse-container-selected .mhct-data{display:block}#sorted-mice-container .mhct-title{border-bottom:1px solid #dedede;display:none;font-size:12px;margin-bottom:10px;padding:10px}#sorted-mice-container .mhct-row{align-items:center;display:grid;font-size:11px;grid-template-columns:2fr 2fr 1fr;justify-items:stretch;padding:8px 5px 8px 10px}#sorted-mice-container .mhct-row:hover,#sorted-mice-container .mhct-row:nth-child(2n):focus,#sorted-mice-container .mhct-row:nth-child(odd):hover{background-color:#d2d2d2}#sorted-mice-container .mhct-row:nth-child(odd){background-color:#e2e2e2}#sorted-mice-container .mhct-location{display:flex;flex-direction:column}#sorted-mice-container .mhct-stage{color:#676767}#sorted-mice-container .mhct-rate{font-family:monospace;font-size:15px;text-align:right}";

var css_248z = "#sorted-mice-container{margin:20px 5px}#sorted-mice-container .mouse-category-container{grid-gap:10px;align-items:stretch;display:grid;grid-template-columns:1fr 1fr 1fr;justify-items:stretch;margin-bottom:25px}#sorted-mice-container .mouse-category-wrapper{background-color:#e6e6e6;border:1px solid rgba(5,5,5,.5);border-radius:0;box-shadow:0 2px 1px -1px #909090;color:#000;position:relative}#sorted-mice-container .mouse-category-header{align-items:center;background-color:hsla(0,0%,100%,.65);border-bottom:1px solid #050505;color:#000;display:flex;flex-direction:row;justify-content:flex-start;margin-bottom:3px;padding:6px 10px}#sorted-mice-container .mouse-category-icon{height:30px;margin-right:10px;width:30px}#sorted-mice-container .mouse-category-icon-title-wrapper{align-items:center;display:flex}#sorted-mice-container .mouse-category-title{font-size:14px}#sorted-mice-container .mouse-category-subtitle{font-size:11px;font-style:italic;margin-top:2px}#sorted-mice-container .mouse-category-mice{padding-left:5px}#sorted-mice-container .mouse-container{cursor:pointer;margin-bottom:5px;margin-right:5px}#sorted-mice-container .mouse-data{align-items:center;display:flex;justify-content:flex-start;position:relative}#sorted-mice-container .mouse-extra-info{display:none}#sorted-mice-container .mouse-container-selected,#sorted-mice-container .mouse-container:focus,#sorted-mice-container .mouse-container:hover{background:#eaeaea;outline:1px solid #000;position:relative}#sorted-mice-container .mouse-container-selected .mouse-extra-info{background-color:#eaeaea;border:1px solid #000;border-top-color:#dedede;box-shadow:0 1px 2px -1px #000;display:block;left:-1px;padding:10px;position:absolute;right:-1px;z-index:10}#sorted-mice-container .mouse-image{border:1px solid rgba(0,0,0,.25);height:30px;margin:2px 5px 2px 2px;width:auto}#sorted-mice-container .mouse-subcategory-mice .mouse-image{margin:2px 4px 2px 2px}#sorted-mice-container .mouse-category-wrapper-hidden{display:none}#sorted-mice-container .mouse-subcategory-wrapper{background-color:hsla(0,0%,100%,.6);border:1px solid rgba(0,0,0,.6);box-shadow:inset 1px 1px 2px -1px rgba(0,0,0,.6);margin:0 5px 10px}#sorted-mice-container .mouse-subcategory-header{font-size:12px;padding:10px}#sorted-mice-container .mouse-subcategory-mice{padding:0 5px}#sorted-mice-container .mouse-locations{display:flex;flex-direction:column}#sorted-mice-container .mouse-location{display:inline-block;margin-bottom:5px}#sorted-mice-container .mhct{margin-top:15px}#sorted-mice-container .weakness-type{align-items:center;display:flex;justify-content:flex-start;margin-top:10px}#sorted-mice-container .power-types img{height:15px;margin:1px;width:15px}#sorted-mice-container .weakness-name{margin-bottom:2px;margin-right:2px}#sorted-mice-container .mouse-locations-wrapper{display:flex}#sorted-mice-container .location-text{margin-right:3px}.mouse-category-wrapper.mouse-category-current-floor .mouse-category-header:after{background-size:cover;border-radius:50%;box-shadow:0 0 4px -1px #000;content:\"\";height:25px;margin:4px;position:absolute;right:0;width:25px;z-index:1}";

var main$1 = function main() {
  addMapperStyles([css_248z$4, css_248z$3, css_248z$2, css_248z$1, css_248z].join('\n'));
};

var addStatBarListener = function addStatBarListener() {
  var statMapBar = document.querySelector('.mousehuntHud-userStat.treasureMap');
  if (statMapBar) {
    statMapBar.removeEventListener('click', processStatsBarClick);
    statMapBar.addEventListener('click', processStatsBarClick);
  }
};
var processStatsBarClick = function processStatsBarClick() {
  var _user, _user$quests, _user$quests$QuestRel;
  var mapId = (_user = user) == null ? void 0 : (_user$quests = _user.quests) == null ? void 0 : (_user$quests$QuestRel = _user$quests.QuestRelicHunter) == null ? void 0 : _user$quests$QuestRel.default_map_id; // eslint-disable-line no-undef
  if (mapId) {
    interceptMapRequest(mapId);
  }
};
var addProfileListener = function addProfileListener() {
  if ('HunterProfile' === getCurrentPage()) {
    // eslint-disable-line
    var profileLink = document.querySelector('.hunterInfoView-treasureMaps-left-currentMap-image');
    if (profileLink) {
      profileLink.removeEventListener('click', processProfileClick);
      profileLink.addEventListener('click', processProfileClick);
    }
  }
};
var processProfileClick = function processProfileClick(e) {
  var parseOnclickTarget = e.target.getAttribute('onclick');
  if (parseOnclickTarget) {
    // Parse the map ID out of the onclick attribute.
    var parsedId = parseOnclickTarget.match(/show\((\d+)\)/);
    if (parsedId && parsedId.length > 1) {
      interceptMapRequest(parsedId[1]);
    }
  }
};
var addActiveTabListener = function addActiveTabListener() {
  var activeTab = document.querySelector('.treasureMapRootView-header-navigation-item.tasks');
  if (activeTab) {
    activeTab.addEventListener('click', processActiveTabClick);
  }
};
var processActiveTabClick = function processActiveTabClick() {
  var _user2, _user2$quests, _user2$quests$QuestRe;
  interceptMapRequest((_user2 = user) == null ? void 0 : (_user2$quests = _user2.quests) == null ? void 0 : (_user2$quests$QuestRe = _user2$quests.QuestRelicHunter) == null ? void 0 : _user2$quests$QuestRe.default_map_id);
};
var initMapper = function initMapper(map) {
  if (!(map && map.map_id && map.map_type)) {
    return;
  }

  // Depending on if it's the active map or not, process the hunters tab events.
  main$3();

  // if the map type is not in the groups, we're done.
  if (!mouseGroups[map.map_type]) {
    // do generic stuff here.
    if (map.is_scavenger_hunt) {
      initScavenger(map);
    }
  }
  var addedSorted = main$4();
  // If the tab wasn't added, retry until it is with a 1 second delay and a max of 10 tries.
  if (!addedSorted) {
    var tries = 0;
    var interval = setInterval(function () {
      addedSorted = main$4();
      if (addedSorted || tries >= 10) {
        clearInterval(interval);
      }
      tries++;
    }, 500);
  }
};
var interceptMapRequest = function interceptMapRequest(data) {
  // If we don't have data, we're done.
  if (!data) {
    return;
  }
  var mapData = false;
  // If we get an object, we're processing the ajax request.
  if (typeof data === 'object' && data !== null) {
    // We have the ajax data, so we want to store the data in local storage
    // and actually call the mapper.
    if (!data.treasure_map || !data.treasure_map.map_id) {
      return;
    }
    mapData = data.treasure_map;

    // Store the map data in local storage.
    setMapData(mapData.map_id, mapData);
  } else {
    // We're processing a click event, so we get the map ID, pull the data
    // from local storage, and call the mapper.
    if (!data) {
      return;
    }
    mapData = getMapData(data); // Actually map-id.
  }

  window.mhmapper = {
    mapData: mapData,
    mapModel: new hg.models.TreasureMapModel(mapData)
  };

  // Finally, call the mapper.
  initMapper(mapData);
  eventRegistry.doEvent('map_data_loaded', mapData);
};
var addListeners = function addListeners() {
  // Watch for the profile map click.
  addProfileListener();
  onPageChange(addProfileListener); // eslint-disable-line no-undef

  // Watch for the stat bar click.
  addStatBarListener();

  // Watch for the active tab click.
  addActiveTabListener();

  // Watch for map data.
  onAjaxRequest(interceptMapRequest, 'managers/ajax/users/treasuremap.php', true); // eslint-disable-line no-undef
};

var main = function main() {
  main$1();
  eventRegistry.doEvent('mapper_start');
  addListeners();
  main$2();
  initScavenger();
  eventRegistry.doEvent('mapper_loaded');
  addSetting('MH Mapper Debug', 'mh-mapper-debug', false);
};
main();

})();
