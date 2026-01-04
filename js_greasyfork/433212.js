// ==UserScript==
// @name         Juejin Activities Enhancer
// @name:zh-CN   掘金活动辅助工具
// @namespace    https://gitee.com/curlly-brackets/UserScripts
// @version      0.1.6.7
// @description  Enhances Juejin activities
// @author       curly brackets
// @match        https://juejin.cn/*
// @license      MIT License
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @supportURL   https://gitee.com/curlly-brackets/UserScripts/issues
// @connect      juejin.cn
// @downloadURL https://update.greasyfork.org/scripts/433212/Juejin%20Activities%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/433212/Juejin%20Activities%20Enhancer.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$e =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$a = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$9 = fails$a;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$9(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$1(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$2 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString$4 = {}.toString;

	var classofRaw = function (it) {
	  return toString$4.call(it).slice(8, -1);
	};

	var fails$8 = fails$a;
	var classof$1 = classofRaw;

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$8(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$1(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$4 = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = indexedObject;
	var requireObjectCoercible$3 = requireObjectCoercible$4;

	var toIndexedObject$3 = function (it) {
	  return IndexedObject(requireObjectCoercible$3(it));
	};

	var isObject$5 = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var global$d = global$e;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn$4 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$d[namespace]) : global$d[namespace] && global$d[namespace][method];
	};

	var getBuiltIn$3 = getBuiltIn$4;

	var engineUserAgent = getBuiltIn$3('navigator', 'userAgent') || '';

	var global$c = global$e;
	var userAgent = engineUserAgent;

	var process = global$c.process;
	var Deno = global$c.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] < 4 ? 1 : match[0] + match[1];
	} else if (userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	/* eslint-disable es/no-symbol -- required for testing */

	var V8_VERSION = engineV8Version;
	var fails$7 = fails$a;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$7(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */

	var NATIVE_SYMBOL$1 = nativeSymbol;

	var useSymbolAsUid = NATIVE_SYMBOL$1
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var getBuiltIn$2 = getBuiltIn$4;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var isSymbol$3 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$2('Symbol');
	  return typeof $Symbol == 'function' && Object(it) instanceof $Symbol;
	};

	var isObject$4 = isObject$5;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && typeof (fn = input.toString) == 'function' && !isObject$4(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject$4(val = fn.call(input))) return val;
	  if (pref !== 'string' && typeof (fn = input.toString) == 'function' && !isObject$4(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var shared$4 = {exports: {}};

	var global$b = global$e;

	var setGlobal$3 = function (key, value) {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty(global$b, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global$b[key] = value;
	  } return value;
	};

	var global$a = global$e;
	var setGlobal$2 = setGlobal$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$a[SHARED] || setGlobal$2(SHARED, {});

	var sharedStore = store$3;

	var store$2 = sharedStore;

	(shared$4.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.17.3',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var requireObjectCoercible$2 = requireObjectCoercible$4;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$2 = function (argument) {
	  return Object(requireObjectCoercible$2(argument));
	};

	var toObject$1 = toObject$2;

	var hasOwnProperty = {}.hasOwnProperty;

	var has$6 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty.call(toObject$1(it), key);
	};

	var id = 0;
	var postfix = Math.random();

	var uid$2 = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var global$9 = global$e;
	var shared$3 = shared$4.exports;
	var has$5 = has$6;
	var uid$1 = uid$2;
	var NATIVE_SYMBOL = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var WellKnownSymbolsStore = shared$3('wks');
	var Symbol$1 = global$9.Symbol;
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

	var wellKnownSymbol$3 = function (name) {
	  if (!has$5(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    if (NATIVE_SYMBOL && has$5(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var isObject$3 = isObject$5;
	var isSymbol$2 = isSymbol$3;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$2 = wellKnownSymbol$3;

	var TO_PRIMITIVE = wellKnownSymbol$2('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$3(input) || isSymbol$2(input)) return input;
	  var exoticToPrim = input[TO_PRIMITIVE];
	  var result;
	  if (exoticToPrim !== undefined) {
	    if (pref === undefined) pref = 'default';
	    result = exoticToPrim.call(input, pref);
	    if (!isObject$3(result) || isSymbol$2(result)) return result;
	    throw TypeError("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol$1 = isSymbol$3;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$2 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol$1(key) ? key : String(key);
	};

	var global$8 = global$e;
	var isObject$2 = isObject$5;

	var document$1 = global$8.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject$2(document$1) && isObject$2(document$1.createElement);

	var documentCreateElement$1 = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$4 = descriptors;
	var fails$6 = fails$a;
	var createElement = documentCreateElement$1;

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$4 && !fails$6(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var DESCRIPTORS$3 = descriptors;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var createPropertyDescriptor$1 = createPropertyDescriptor$2;
	var toIndexedObject$2 = toIndexedObject$3;
	var toPropertyKey$1 = toPropertyKey$2;
	var has$4 = has$6;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$3 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$2(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has$4(O, P)) return createPropertyDescriptor$1(!propertyIsEnumerableModule.f.call(O, P), O[P]);
	};

	var objectDefineProperty = {};

	var isObject$1 = isObject$5;

	var anObject$6 = function (it) {
	  if (!isObject$1(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var DESCRIPTORS$2 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$5 = anObject$6;
	var toPropertyKey = toPropertyKey$2;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$2 ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$5(O);
	  P = toPropertyKey(P);
	  anObject$5(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$1 = descriptors;
	var definePropertyModule$2 = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$2;

	var createNonEnumerableProperty$4 = DESCRIPTORS$1 ? function (object, key, value) {
	  return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$2 = {exports: {}};

	var store$1 = sharedStore;

	var functionToString = Function.toString;

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof store$1.inspectSource != 'function') {
	  store$1.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource$2 = store$1.inspectSource;

	var global$7 = global$e;
	var inspectSource$1 = inspectSource$2;

	var WeakMap$1 = global$7.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource$1(WeakMap$1));

	var shared$2 = shared$4.exports;
	var uid = uid$2;

	var keys = shared$2('keys');

	var sharedKey$2 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;
	var global$6 = global$e;
	var isObject = isObject$5;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$4;
	var objectHas = has$6;
	var shared$1 = sharedStore;
	var sharedKey$1 = sharedKey$2;
	var hiddenKeys$3 = hiddenKeys$4;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var WeakMap = global$6.WeakMap;
	var set, get, has$3;

	var enforce = function (it) {
	  return has$3(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared$1.state) {
	  var store = shared$1.state || (shared$1.state = new WeakMap());
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;
	  set = function (it, metadata) {
	    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset.call(store, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store, it) || {};
	  };
	  has$3 = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey$1('state');
	  hiddenKeys$3[STATE] = true;
	  set = function (it, metadata) {
	    if (objectHas(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$3(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return objectHas(it, STATE) ? it[STATE] : {};
	  };
	  has$3 = function (it) {
	    return objectHas(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$3,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var global$5 = global$e;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$4;
	var has$2 = has$6;
	var setGlobal$1 = setGlobal$3;
	var inspectSource = inspectSource$2;
	var InternalStateModule = internalState;

	var getInternalState$1 = InternalStateModule.get;
	var enforceInternalState = InternalStateModule.enforce;
	var TEMPLATE = String(String).split('String');

	(redefine$2.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var state;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has$2(value, 'name')) {
	      createNonEnumerableProperty$2(value, 'name', key);
	    }
	    state = enforceInternalState(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }
	  }
	  if (O === global$5) {
	    if (simple) O[key] = value;
	    else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty$2(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState$1(this).source || inspectSource(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor$1 = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.es/ecma262/#sec-tointeger
	var toInteger$4 = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$1 : ceil)(argument);
	};

	var toInteger$3 = toInteger$4;

	var min$2 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$2 = function (argument) {
	  return argument > 0 ? min$2(toInteger$3(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toInteger$2 = toInteger$4;

	var max$1 = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toInteger$2(index);
	  return integer < 0 ? max$1(integer + length, 0) : min$1(integer, length);
	};

	var toIndexedObject$1 = toIndexedObject$3;
	var toLength$1 = toLength$2;
	var toAbsoluteIndex = toAbsoluteIndex$1;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$1 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$1($this);
	    var length = toLength$1(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
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
	  includes: createMethod$1(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$1(false)
	};

	var has$1 = has$6;
	var toIndexedObject = toIndexedObject$3;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$2 = hiddenKeys$4;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has$1(hiddenKeys$2, key) && has$1(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has$1(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
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

	var getBuiltIn$1 = getBuiltIn$4;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var anObject$4 = anObject$6;

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$4(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var has = has$6;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$1 = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$1.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var fails$5 = fails$a;

	var replacement = /#|\.prototype\./;

	var isForced$1 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails$5(detection)
	    : !!detection;
	};

	var normalize = isForced$1.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$1.data = {};
	var NATIVE = isForced$1.NATIVE = 'N';
	var POLYFILL = isForced$1.POLYFILL = 'P';

	var isForced_1 = isForced$1;

	var global$4 = global$e;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$4;
	var redefine$1 = redefine$2.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties = copyConstructorProperties$1;
	var isForced = isForced_1;

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$4;
	  } else if (STATIC) {
	    target = global$4[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$4[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty$1(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine$1(target, key, sourceProperty, options);
	  }
	};

	var isSymbol = isSymbol$3;

	var toString$3 = function (argument) {
	  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a string');
	  return String(argument);
	};

	var anObject$3 = anObject$6;

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags$1 = function () {
	  var that = anObject$3(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var regexpStickyHelpers = {};

	var fails$4 = fails$a;
	var global$3 = global$e;

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = global$3.RegExp;

	regexpStickyHelpers.UNSUPPORTED_Y = fails$4(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	regexpStickyHelpers.BROKEN_CARET = fails$4(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3;

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS = descriptors;
	var definePropertyModule = objectDefineProperty;
	var anObject$2 = anObject$6;
	var objectKeys = objectKeys$1;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$2(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var getBuiltIn = getBuiltIn$4;

	var html$1 = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */

	var anObject$1 = anObject$6;
	var defineProperties = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys = hiddenKeys$4;
	var html = html$1;
	var documentCreateElement = documentCreateElement$1;
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
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$1(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : defineProperties(result, Properties);
	};

	var fails$3 = fails$a;
	var global$2 = global$e;

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global$2.RegExp;

	var regexpUnsupportedDotAll = fails$3(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	var fails$2 = fails$a;
	var global$1 = global$e;

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = global$1.RegExp;

	var regexpUnsupportedNcg = fails$2(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */
	var toString$2 = toString$3;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers = regexpStickyHelpers;
	var shared = shared$4.exports;
	var create = objectCreate;
	var getInternalState = internalState.get;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;

	var nativeExec = RegExp.prototype.exec;
	var nativeReplace = shared('native-string-replace', String.prototype.replace);

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

	if (PATCH) {
	  // eslint-disable-next-line max-statements -- TODO
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState(re);
	    var str = toString$2(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = patchedExec.call(raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = str.slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str.charAt(re.lastIndex - 1) !== '\n')) {
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

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
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

	var regexpExec$2 = patchedExec;

	var $ = _export;
	var exec = regexpExec$2;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
	  exec: exec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var redefine = redefine$2.exports;
	var regexpExec$1 = regexpExec$2;
	var fails$1 = fails$a;
	var wellKnownSymbol$1 = wellKnownSymbol$3;
	var createNonEnumerableProperty = createNonEnumerableProperty$4;

	var SPECIES = wellKnownSymbol$1('species');
	var RegExpPrototype = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$1(KEY);

	  var DELEGATES_TO_SYMBOL = !fails$1(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$1(function () {
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
	      re.constructor[SPECIES] = function () { return re; };
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
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var $exec = regexp.exec;
	      if ($exec === regexpExec$1 || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    redefine(String.prototype, KEY, methods[0]);
	    redefine(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var toInteger$1 = toInteger$4;
	var toString$1 = toString$3;
	var requireObjectCoercible$1 = requireObjectCoercible$4;

	// `String.prototype.codePointAt` methods implementation
	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$1(requireObjectCoercible$1($this));
	    var position = toInteger$1(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex$1 = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	var toObject = toObject$2;

	var floor = Math.floor;
	var replace = ''.replace;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace.call(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (ch.charAt(0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return str.slice(0, position);
	      case "'": return str.slice(tailPos);
	      case '<':
	        capture = namedCaptures[ch.slice(1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var classof = classofRaw;
	var regexpExec = regexpExec$2;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classof(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var fails = fails$a;
	var anObject = anObject$6;
	var toInteger = toInteger$4;
	var toLength = toLength$2;
	var toString = toString$3;
	var requireObjectCoercible = requireObjectCoercible$4;
	var advanceStringIndex = advanceStringIndex$1;
	var getSubstitution = getSubstitution$1;
	var regExpExec = regexpExecAbstract;
	var wellKnownSymbol = wellKnownSymbol$3;

	var REPLACE = wellKnownSymbol('replace');
	var max = Math.max;
	var min = Math.min;

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
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(toString(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (string, replaceValue) {
	      var rx = anObject(this);
	      var S = toString(string);

	      if (
	        typeof replaceValue === 'string' &&
	        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
	        replaceValue.indexOf('$<') === -1
	      ) {
	        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	        if (res.done) return res.value;
	      }

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = toString(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regExpExec(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = toString(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = toString(result[0]);
	        var position = max(min(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = toString(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	var blockTopics = [
		"树洞一下",
		"掘金相亲角",
		"反馈 & 建议",
		"沸点福利",
		"掘金官方",
		"上班摸鱼"
	];
	var scriptId$1 = "juejin-activies-enhancer/break-the-circle";
	var startTimeStamp = "1632326400000";
	var endTimeStamp = "1633017600000";

	const states$1 = {
	  userId: ""
	};
	function getUserId() {
	  return states$1.userId;
	}
	function setUserId(userId) {
	  states$1.userId = userId;
	}

	const scriptId = "juejin-activies-enhancer";
	const inPinPage = pathname => {
	  return /^\/pins(?:\/|$)/.test(pathname);
	};
	const inProfilePage = pathname => {
	  return new RegExp(`^\\/user\\/${getUserId()}(?:\\/|$)`).test(pathname);
	};
	function fetchData({
	  url,
	  data = {}
	}) {
	  return new Promise((resolve, reject) => {
	    GM_xmlhttpRequest({
	      method: "POST",
	      url,
	      data: JSON.stringify({
	        user_id: getUserId(),
	        ...data
	      }),
	      headers: {
	        "User-agent": window.navigator.userAgent,
	        "content-type": "application/json"
	      },
	      onload: function ({
	        status,
	        response
	      }) {
	        try {
	          if (status === 200) {
	            const responseData = JSON.parse(response);
	            resolve(responseData);
	          } else {
	            reject(response);
	          }
	        } catch (err) {
	          console.log(err);
	          reject(err);
	        }
	      }
	    });
	  });
	}

	class ProfileStatRender {
	  constructor() {
	    const blockEl = document.createElement("div");
	    blockEl.dataset.tampermonkey = scriptId;
	    blockEl.className = "block shadow";
	    blockEl.style = `margin-bottom: 1rem;background-color: #fff;border-radius: 2px;`;
	    const titleEl = document.createElement("div");
	    titleEl.style = `padding: 1.333rem;
              font-size: 1.333rem;
              font-weight: 600;
              color: #31445b;
              border-bottom: 1px solid rgba(230,230,231,.5);`;
	    titleEl.textContent = "活动状态";
	    blockEl.appendChild(titleEl);
	    const contentEl = document.createElement("div");
	    contentEl.style = `padding: 1.333rem;`;
	    blockEl.appendChild(contentEl);
	    this.blockEl = blockEl;
	    this.contentEl = contentEl;
	    this.data = [];
	  }

	  add(data) {
	    const now = new Date().valueOf();
	    this.data.push(data);
	    this.data.sort((a, b) => {
	      const isFinishA = a.endTime > now;
	      const isFinishB = b.endTime > now;
	      if (isFinishA && !isFinishB) return -1;else if (isFinishB && !isFinishA) return 1;
	      return b.startTime - a.startTime;
	    });
	    this.render();
	  }

	  render() {
	    const container = this.contentEl;
	    const currentDOM = container.children;
	    this.data.forEach(({
	      node
	    }, index) => {
	      const element = currentDOM[index];

	      if (!element) {
	        container.appendChild(node);
	        return;
	      }

	      if (element !== node) {
	        element.replaceWith(node);
	      }
	    });

	    for (let i = this.data.length, len = currentDOM.length; i < len; i++) {
	      container.removeChild(currentDOM[i]);
	    }

	    if (!this.blockEl.isConnected) {
	      const siblingEl = document.querySelector(".user-view .stat-block");
	      const parentEl = document.querySelector(".user-view .sticky-wrap");

	      if (siblingEl) {
	        var _siblingEl$parentElem;

	        (_siblingEl$parentElem = siblingEl.parentElement.querySelector(`[data-tampermonkey='${scriptId}']`)) === null || _siblingEl$parentElem === void 0 ? void 0 : _siblingEl$parentElem.remove();
	        siblingEl.after(this.blockEl);
	        return;
	      }

	      if (parentEl) {
	        var _parentEl$querySelect;

	        (_parentEl$querySelect = parentEl.querySelector(`[data-tampermonkey='${scriptId}']`)) === null || _parentEl$querySelect === void 0 ? void 0 : _parentEl$querySelect.remove();
	        parentEl.firstChild ? parentEl.insertBefore(this.blockEl, parentEl.firstChild) : parentEl.appendChild(this.blockEl);
	      }
	    }
	  }

	}

	const profileStateRender = new ProfileStatRender();

	const states = GM_getValue(scriptId$1, {
	  checkPoint: 0,
	  topics: {
	    todayEfficientTopicTitles: [],
	    efficientDays: 0,
	    efficientTopics: {}
	  }
	});

	function getCheckPoint() {
	  return states.checkPoint;
	}

	function getTopicStates() {
	  return states.topics;
	}
	function setTopicStates(value) {
	  states.checkPoint = new Date().valueOf();
	  states.topics = value;
	  GM_setValue(scriptId$1, states);
	}
	async function fetchStates() {
	  if (getCheckPoint() > endTimeStamp) {
	    return new Promise(resolve => {
	      setTimeout(() => {
	        resolve(getTopicStates());
	      });
	    });
	  }

	  const dailyTopics = await requestShortMsgTopic();
	  updateGlobalStates(dailyTopics);
	}

	function requestShortMsgTopic(cursor = "0", dailyTopics = []) {
	  return fetchData({
	    url: "https://api.juejin.cn/content_api/v1/short_msg/query_list",
	    data: {
	      sort_type: 4,
	      limit: 24,
	      cursor
	    }
	  }).then(responseData => {
	    const {
	      data,
	      cursor,
	      has_more
	    } = responseData;
	    let lastPublishTime = Infinity;

	    if (data) {
	      for (const msg of data) {
	        const {
	          topic,
	          msg_Info
	        } = msg;
	        const publishTime = msg_Info.ctime * 1000;

	        if (publishTime > startTimeStamp && publishTime < endTimeStamp && !blockTopics.includes(topic.title)) {
	          const day = Math.floor((publishTime - startTimeStamp) / 86400000);

	          if (!dailyTopics[day]) {
	            dailyTopics[day] = [];
	          }

	          dailyTopics[day].push({
	            title: topic.title,
	            // wait: 0, pass: 1, fail: 2
	            verified: msg_Info.verify_status === 0 ? 0 : msg_Info.audit_status === 2 && msg_Info.verify_status === 1 ? 1 : 2
	          });
	        }

	        lastPublishTime = publishTime;

	        if (publishTime < startTimeStamp) {
	          break;
	        }
	      }
	    }

	    if (lastPublishTime > startTimeStamp && has_more) {
	      return requestShortMsgTopic(cursor, dailyTopics);
	    } else {
	      return dailyTopics;
	    }
	  });
	}

	function updateGlobalStates(dailyTopics) {
	  const allEfficientTopicTitles = new Set();
	  const topicCountAndVerified = {};
	  const todayIndex = Math.floor((new Date().valueOf() - startTimeStamp) / 86400000);
	  const todayEfficientTopicTitles = [];
	  let efficientDays = 0;
	  dailyTopics.forEach((topics, index) => {
	    // 获取一天破解的圈子
	    const dailyEfficientTopicTitles = new Set(topics.filter(({
	      title,
	      verified
	    }) => {
	      // 破圈：未被破解 + 已通过审核或正在等待审核
	      return !allEfficientTopicTitles.has(title) && verified !== 2;
	    }).map(({
	      title
	    }) => title));
	    const dailyVerifiedTopicTitles = new Set(topics.filter(({
	      title,
	      verified
	    }) => {
	      // 破圈：未被破解 + 已通过审核或正在等待审核
	      return !allEfficientTopicTitles.has(title) && verified === 1;
	    })); // 更新达标天数

	    if (dailyVerifiedTopicTitles.size >= 3) {
	      efficientDays++;
	    } // 记录今日破圈数据


	    if (index === todayIndex) {
	      todayEfficientTopicTitles.push(...dailyEfficientTopicTitles);
	    } // 更新已破圈集合


	    dailyEfficientTopicTitles.forEach(t => allEfficientTopicTitles.add(t)); // 记录已破圈发帖数

	    topics.map(({
	      title,
	      verified
	    }) => {
	      if (!topicCountAndVerified[title]) {
	        topicCountAndVerified[title] = {
	          count: 1,
	          verified
	        };
	      } else {
	        var _topicCountAndVerifie, _verified;

	        topicCountAndVerified[title]["count"]++;
	        (_topicCountAndVerifie = topicCountAndVerified[title])[_verified = "verified"] || (_topicCountAndVerifie[_verified] = verified === 1);
	      }
	    });
	  });
	  setTopicStates({
	    todayEfficientTopicTitles,
	    efficientDays,
	    efficientTopics: Object.fromEntries([...allEfficientTopicTitles].map(title => {
	      return [title, topicCountAndVerified[title]];
	    }))
	  });
	}

	function renderPinPage() {
	  var _containerEl$querySel;

	  const containerEl = document.querySelector(".main .userbox");

	  if (!containerEl) {
	    return;
	  }

	  (_containerEl$querySel = containerEl.querySelector(`[data-tampermonkey='${scriptId$1}']`)) === null || _containerEl$querySel === void 0 ? void 0 : _containerEl$querySel.remove();
	  const wrapperEl = document.createElement("div");
	  wrapperEl.dataset.tampermonkey = scriptId$1;
	  wrapperEl.appendChild(getRewardElement());
	  wrapperEl.style = "padding-top:20px;";
	  containerEl.appendChild(wrapperEl);
	}
	function renderProfilePage() {
	  profileStateRender.add({
	    startTime: new Date(startTimeStamp),
	    endTime: new Date(endTimeStamp),
	    node: getRewardElement()
	  });
	}

	function getRewardElement() {
	  const {
	    efficientTopics,
	    efficientDays
	  } = getTopicStates();
	  const topicCount = Object.values(efficientTopics).filter(({
	    verified
	  }) => !!verified).length;
	  const reward = ["幸运奖", "三等奖", "二等奖", "一等奖", "全勤奖"][efficientDays >= 8 ? 4 : Math.floor((efficientDays - 1) / 2)] ?? (topicCount > 1 ? "幸运奖" : "无");
	  const descriptionHTML = [`🎯 &nbsp;达成 ${efficientDays} 天`, `⭕ &nbsp;${topicCount} 个圈子`, `🏆 &nbsp;${reward}`].map(text => `<span style="color:#939aa3;font-weight:bold">${text}</span>`).join("");
	  const rewardEl = document.createElement("div");
	  rewardEl.innerHTML = `<h3 style="margin:0;"><a style="color:inherit" href="https://juejin.cn/pin/7010556755855802376" target="__blank">破圈行动</a> <span style="float:right">9/23 - 9/30</span></h3>
      <p style="display:flex;flex-direction:row;justify-content: space-between;">
      ${descriptionHTML}
      </p>
      ${endTimeStamp < new Date().valueOf() || efficientDays >= 8 ? getFinishSummary({
    isJoined: topicCount > 0
  }) : getTodayStatus()}
      `;
	  return rewardEl;
	}

	function getTodayStatus() {
	  const {
	    todayEfficientTopicTitles,
	    efficientTopics
	  } = getTopicStates();
	  const todayTopicsHTML = todayEfficientTopicTitles.map(title => {
	    var _efficientTopics$titl;

	    const isVerified = (_efficientTopics$titl = efficientTopics[title]) === null || _efficientTopics$titl === void 0 ? void 0 : _efficientTopics$titl.verified;
	    return renderTag(title, isVerified);
	  }).join("");
	  const todayVerifiedCount = todayEfficientTopicTitles.filter(title => {
	    var _efficientTopics$titl2;

	    return (_efficientTopics$titl2 = efficientTopics[title]) === null || _efficientTopics$titl2 === void 0 ? void 0 : _efficientTopics$titl2.verified;
	  }).length;
	  const todayVerifyCount = todayEfficientTopicTitles.length - todayVerifiedCount;
	  return `<p>📅 &nbsp;今天 ${todayVerifiedCount} / 3 ${todayVerifyCount > 0 ? `&nbsp;🧐 人工审核中&nbsp;${todayVerifyCount} 条` : ""}</p>
      <div>
      ${todayTopicsHTML}
      </div>`;
	}

	function getFinishSummary({
	  isJoined
	}) {
	  const {
	    efficientTopics
	  } = getTopicStates();

	  if (isJoined) {
	    return `<details>
    <summary style="cursor:pointer;margin-bottom:8px">🎉&nbsp;恭喜完成活动！展开查看破解列表</summary>
    ${Object.keys(efficientTopics).map(title => {
      return renderTag(title);
    }).join("")}
    </details>`;
	  } else {
	    return `<p style="color:#939aa3;">⌛️ 活动已结束</p>`;
	  }
	}

	function renderTag(title, isVerified = true) {
	  return `<span style="display: inline-block;
  padding:2px 10px;
  background-color: ${isVerified ? "#eaf2ff" : "#e5e7ea"};
  color:${isVerified ? "#1e80ff" : "#717682"};
  font-size:12px;
  line-height:20px;
  border-radius:50px;
  margin-left:2px;margin-bottom:2px;">${title}</span>`;
	}

	function renderTopicSelectMenu(containerEl) {
	  if (endTimeStamp < new Date().valueOf()) return;
	  const topicPanel = containerEl.querySelector(".topicwrapper .new_topic_picker");

	  if (!topicPanel) {
	    return;
	  }

	  const observer = new MutationObserver(function (mutations) {
	    mutations.forEach(({
	      type,
	      addedNodes
	    }) => {
	      if (type === "childList" && addedNodes.length) {
	        addedNodes.forEach(itemEl => {
	          var _itemEl$classList;

	          if (!itemEl) return;else if (itemEl !== null && itemEl !== void 0 && (_itemEl$classList = itemEl.classList) !== null && _itemEl$classList !== void 0 && _itemEl$classList.contains("contents")) {
	            renderWholeContent(itemEl);
	          } else {
	            renderItem(itemEl);
	          }
	        });
	      }
	    });
	  });
	  observer.observe(topicPanel, {
	    childList: true,
	    subtree: true
	  });
	  renderWholeContent(topicPanel.querySelector(".wrapper .contents"));
	}

	function renderWholeContent(contentEl) {
	  if (!contentEl) {
	    return;
	  }

	  const allItemEls = contentEl.querySelectorAll(".item");
	  allItemEls.forEach(itemEl => {
	    renderItem(itemEl);
	  });
	}

	function renderItem(itemEl) {
	  var _itemEl$parentElement, _itemEl$parentElement2, _itemEl$querySelector, _itemEl$querySelector2, _efficientTopics$titl, _efficientTopics$titl2;

	  const {
	    efficientTopics
	  } = getTopicStates();
	  if (!itemEl || !(itemEl.nodeType === 1 && itemEl.nodeName === "DIV" && itemEl.classList.contains("item")) || !((_itemEl$parentElement = itemEl.parentElement) !== null && _itemEl$parentElement !== void 0 && _itemEl$parentElement.classList.contains("contents")) && !((_itemEl$parentElement2 = itemEl.parentElement) !== null && _itemEl$parentElement2 !== void 0 && _itemEl$parentElement2.classList.contains("searchlist"))) return;
	  (_itemEl$querySelector = itemEl.querySelector(`[data-tampermonkey='${scriptId$1}']`)) === null || _itemEl$querySelector === void 0 ? void 0 : _itemEl$querySelector.remove();
	  const title = (_itemEl$querySelector2 = itemEl.querySelector(".content_main > .title")) === null || _itemEl$querySelector2 === void 0 ? void 0 : _itemEl$querySelector2.textContent;
	  const isBlockedTopic = blockTopics.includes(title);
	  const count = (_efficientTopics$titl = efficientTopics[title]) === null || _efficientTopics$titl === void 0 ? void 0 : _efficientTopics$titl.count;
	  const verified = (_efficientTopics$titl2 = efficientTopics[title]) === null || _efficientTopics$titl2 === void 0 ? void 0 : _efficientTopics$titl2.verified;
	  const iconEl = document.createElement("div");
	  iconEl.dataset.tampermonkey = scriptId$1;

	  if (count) {
	    iconEl.style = `width: 18px;
            height: 18px;
            overflow: hidden;
            border-radius: 50%;
            background-color: ${!verified ? "#939aa3" : "#0fbf60"};
            color: #fff;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            font-weight: bold;
            font-family: monospace;
            margin-left: auto;
            margin-right: 15px;`;
	    iconEl.innerText = count;
	  } else {
	    iconEl.style = `margin-left: auto;margin-right: 15px;color: #c2c6cc`;

	    if (isBlockedTopic) {
	      iconEl.innerHTML = `<svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.46457 14.1213C8.07404 14.5118 8.07404 15.145 8.46457 15.5355C8.85509 15.926 9.48825 15.926 9.87878 15.5355L15.5356 9.87862C15.9262 9.4881 15.9262 8.85493 15.5356 8.46441C15.1451 8.07388 14.5119 8.07388 14.1214 8.46441L8.46457 14.1213Z"
                  fill="currentColor"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                  fill="currentColor"
                />
              </svg>`;
	    } else {
	      iconEl.innerHTML = `<svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2426 16.3137L6 12.071L7.41421 10.6568L10.2426 13.4853L15.8995 7.8284L17.3137 9.24262L10.2426 16.3137Z"
                  fill="currentColor"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                  fill="currentColor"
                />
              </svg>`;
	    }
	  }

	  itemEl.appendChild(iconEl);
	}

	function onRouteChange$1(prevRouterPathname, currentRouterPathname) {
	  if (inPinPage(currentRouterPathname) && !inPinPage(prevRouterPathname)) {
	    fetchStates().then(() => {
	      renderTopicSelectMenu(document);
	      renderPinPage();
	    });
	  } else if (inProfilePage(currentRouterPathname) && !inProfilePage(prevRouterPathname)) {
	    fetchStates().then(() => {
	      setTimeout(() => {
	        renderProfilePage();
	      }, 1000);
	    });
	  }
	}

	function initPopupMutation() {
	  const componentBoxEl = document.querySelector(".global-component-box");

	  if (componentBoxEl) {
	    const observer = new MutationObserver(function (mutations) {
	      const mutation = mutations.find(mutation => {
	        const {
	          type,
	          addedNodes
	        } = mutation;

	        if (type === "childList" && Array.prototype.find.call(addedNodes, node => {
	          var _node$classList;

	          return (_node$classList = node.classList) === null || _node$classList === void 0 ? void 0 : _node$classList.contains("pin-modal");
	        })) {
	          return true;
	        } else {
	          return false;
	        }
	      });

	      if (mutation) {
	        mutation.addedNodes.forEach(node => {
	          var _node$classList2;

	          if ((_node$classList2 = node.classList) !== null && _node$classList2 !== void 0 && _node$classList2.contains("pin-modal")) {
	            fetchStates().then(() => {
	              renderTopicSelectMenu(node);
	            });
	          }
	        });
	      }
	    });
	    observer.observe(componentBoxEl, {
	      childList: true
	    });
	  }
	}

	var BreakTheCycle = {
	  onRouteChange: onRouteChange$1,
	  onLoaded: initPopupMutation
	};

	const activities = [BreakTheCycle];
	let currentRouterPathname = "";

	(function start() {
	  const userProfileEl = document.querySelector(".user-dropdown-list > .nav-menu-item-group:nth-child(2) > .nav-menu-item > a[href]");
	  const userId = userProfileEl === null || userProfileEl === void 0 ? void 0 : userProfileEl.getAttribute("href").replace(/\/user\//, "");

	  if (!userId) {
	    return;
	  }

	  setUserId(userId);
	  initRouter();
	  activities.forEach(({
	    onLoaded
	  }) => onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded());
	})();

	function initRouter() {
	  const _historyPushState = history.pushState;
	  const _historyReplaceState = history.replaceState;

	  history.pushState = function () {
	    _historyPushState.apply(history, arguments);

	    onRouteChange();
	  };

	  history.replaceState = function () {
	    _historyReplaceState.apply(history, arguments);

	    onRouteChange();
	  };

	  window.addEventListener("popstate", function () {
	    onRouteChange();
	  });
	}

	function onRouteChange() {
	  const prevRouterPathname = currentRouterPathname;
	  currentRouterPathname = document.location.pathname;

	  if (prevRouterPathname !== currentRouterPathname) {
	    activities.forEach(({
	      onRouteChange
	    }) => {
	      onRouteChange === null || onRouteChange === void 0 ? void 0 : onRouteChange(prevRouterPathname, currentRouterPathname);
	    });
	  }
	}

})();
