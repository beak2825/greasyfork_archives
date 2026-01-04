
// ==UserScript==
// @name           MWI-Hit-Tracker-Canvas
// @namespace      MWI-Hit-Tracker-Canvas
// @version        1.2.3
// @author         Artintel, BKN46
// @description    A Tampermonkey script to track MWI hits on Canvas
// @icon           https://www.milkywayidle.com/favicon.svg
// @include        https://*.milkywayidle.com/*
// @match          https://www.milkywayidle.com/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/535422/MWI-Hit-Tracker-Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/535422/MWI-Hit-Tracker-Canvas.meta.js
// ==/UserScript==
(function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$c =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$8 = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$7 = fails$8;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$7(function () {
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

	var toString = {}.toString;

	var classofRaw$1 = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var fails$6 = fails$8;
	var classof$2 = classofRaw$1;

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$6(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$2(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$2 = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = indexedObject;
	var requireObjectCoercible$1 = requireObjectCoercible$2;

	var toIndexedObject$3 = function (it) {
	  return IndexedObject(requireObjectCoercible$1(it));
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable$d = function (argument) {
	  return typeof argument === 'function';
	};

	var isCallable$c = isCallable$d;

	var isObject$5 = function (it) {
	  return typeof it === 'object' ? it !== null : isCallable$c(it);
	};

	var global$b = global$c;
	var isCallable$b = isCallable$d;

	var aFunction = function (argument) {
	  return isCallable$b(argument) ? argument : undefined;
	};

	var getBuiltIn$4 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$b[namespace]) : global$b[namespace] && global$b[namespace][method];
	};

	var getBuiltIn$3 = getBuiltIn$4;

	var engineUserAgent = getBuiltIn$3('navigator', 'userAgent') || '';

	var global$a = global$c;
	var userAgent = engineUserAgent;

	var process = global$a.process;
	var Deno = global$a.Deno;
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
	var fails$5 = fails$8;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$5(function () {
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

	var isCallable$a = isCallable$d;
	var getBuiltIn$2 = getBuiltIn$4;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$2('Symbol');
	  return isCallable$a($Symbol) && Object(it) instanceof $Symbol;
	};

	var tryToString$1 = function (argument) {
	  try {
	    return String(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var isCallable$9 = isCallable$d;
	var tryToString = tryToString$1;

	// `Assert: IsCallable(argument) is true`
	var aCallable$5 = function (argument) {
	  if (isCallable$9(argument)) return argument;
	  throw TypeError(tryToString(argument) + ' is not a function');
	};

	var aCallable$4 = aCallable$5;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$4 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$4(func);
	};

	var isCallable$8 = isCallable$d;
	var isObject$4 = isObject$5;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$8(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
	  if (isCallable$8(fn = input.valueOf) && !isObject$4(val = fn.call(input))) return val;
	  if (pref !== 'string' && isCallable$8(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var shared$3 = {exports: {}};

	var global$9 = global$c;

	var setGlobal$3 = function (key, value) {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty(global$9, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global$9[key] = value;
	  } return value;
	};

	var global$8 = global$c;
	var setGlobal$2 = setGlobal$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$8[SHARED] || setGlobal$2(SHARED, {});

	var sharedStore = store$3;

	var store$2 = sharedStore;

	(shared$3.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.18.3',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var requireObjectCoercible = requireObjectCoercible$2;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$2 = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var toObject$1 = toObject$2;

	var hasOwnProperty = {}.hasOwnProperty;

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty.call(toObject$1(it), key);
	};

	var id = 0;
	var postfix = Math.random();

	var uid$2 = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var global$7 = global$c;
	var shared$2 = shared$3.exports;
	var hasOwn$8 = hasOwnProperty_1;
	var uid$1 = uid$2;
	var NATIVE_SYMBOL = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var WellKnownSymbolsStore = shared$2('wks');
	var Symbol$1 = global$7.Symbol;
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

	var wellKnownSymbol$8 = function (name) {
	  if (!hasOwn$8(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    if (NATIVE_SYMBOL && hasOwn$8(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var isObject$3 = isObject$5;
	var isSymbol$1 = isSymbol$2;
	var getMethod$3 = getMethod$4;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$7 = wellKnownSymbol$8;

	var TO_PRIMITIVE = wellKnownSymbol$7('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$3(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod$3(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = exoticToPrim.call(input, pref);
	    if (!isObject$3(result) || isSymbol$1(result)) return result;
	    throw TypeError("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol = isSymbol$2;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$2 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : String(key);
	};

	var global$6 = global$c;
	var isObject$2 = isObject$5;

	var document$1 = global$6.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);

	var documentCreateElement$1 = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$5 = descriptors;
	var fails$4 = fails$8;
	var createElement = documentCreateElement$1;

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$5 && !fails$4(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var DESCRIPTORS$4 = descriptors;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var createPropertyDescriptor$1 = createPropertyDescriptor$2;
	var toIndexedObject$2 = toIndexedObject$3;
	var toPropertyKey$1 = toPropertyKey$2;
	var hasOwn$7 = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$4 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$2(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn$7(O, P)) return createPropertyDescriptor$1(!propertyIsEnumerableModule.f.call(O, P), O[P]);
	};

	var objectDefineProperty = {};

	var isObject$1 = isObject$5;

	// `Assert: Type(argument) is Object`
	var anObject$b = function (argument) {
	  if (isObject$1(argument)) return argument;
	  throw TypeError(String(argument) + ' is not an object');
	};

	var DESCRIPTORS$3 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$a = anObject$b;
	var toPropertyKey = toPropertyKey$2;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$a(O);
	  P = toPropertyKey(P);
	  anObject$a(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$2 = descriptors;
	var definePropertyModule$2 = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$2;

	var createNonEnumerableProperty$5 = DESCRIPTORS$2 ? function (object, key, value) {
	  return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$3 = {exports: {}};

	var isCallable$7 = isCallable$d;
	var store$1 = sharedStore;

	var functionToString = Function.toString;

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$7(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource$2 = store$1.inspectSource;

	var global$5 = global$c;
	var isCallable$6 = isCallable$d;
	var inspectSource$1 = inspectSource$2;

	var WeakMap$1 = global$5.WeakMap;

	var nativeWeakMap = isCallable$6(WeakMap$1) && /native code/.test(inspectSource$1(WeakMap$1));

	var shared$1 = shared$3.exports;
	var uid = uid$2;

	var keys = shared$1('keys');

	var sharedKey$3 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;
	var global$4 = global$c;
	var isObject = isObject$5;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$5;
	var hasOwn$6 = hasOwnProperty_1;
	var shared = sharedStore;
	var sharedKey$2 = sharedKey$3;
	var hiddenKeys$3 = hiddenKeys$4;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var WeakMap = global$4.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
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
	  has = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$3[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwn$6(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$4(it, STATE, metadata);
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
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$1 = descriptors;
	var hasOwn$5 = hasOwnProperty_1;

	var FunctionPrototype = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$1 && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn$5(FunctionPrototype, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$1 || (DESCRIPTORS$1 && getDescriptor(FunctionPrototype, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$3 = global$c;
	var isCallable$5 = isCallable$d;
	var hasOwn$4 = hasOwnProperty_1;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$5;
	var setGlobal$1 = setGlobal$3;
	var inspectSource = inspectSource$2;
	var InternalStateModule$1 = internalState;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

	var getInternalState$1 = InternalStateModule$1.get;
	var enforceInternalState = InternalStateModule$1.enforce;
	var TEMPLATE = String(String).split('String');

	(redefine$3.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;
	  if (isCallable$5(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }
	    if (!hasOwn$4(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	      createNonEnumerableProperty$3(value, 'name', name);
	    }
	    state = enforceInternalState(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }
	  if (O === global$3) {
	    if (simple) O[key] = value;
	    else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty$3(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$5(this) && getInternalState$1(this).source || inspectSource(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity$2 = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- safe
	  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$1(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var toIntegerOrInfinity = toIntegerOrInfinity$2;

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$1 = function (argument) {
	  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength = toLength$1;

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike$2 = function (obj) {
	  return toLength(obj.length);
	};

	var toIndexedObject$1 = toIndexedObject$3;
	var toAbsoluteIndex = toAbsoluteIndex$1;
	var lengthOfArrayLike$1 = lengthOfArrayLike$2;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$1($this);
	    var length = lengthOfArrayLike$1(O);
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
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var hasOwn$3 = hasOwnProperty_1;
	var toIndexedObject = toIndexedObject$3;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$2 = hiddenKeys$4;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
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
	var anObject$9 = anObject$b;

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$9(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$2 = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$1 = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$1.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var fails$3 = fails$8;
	var isCallable$4 = isCallable$d;

	var replacement = /#|\.prototype\./;

	var isForced$1 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable$4(detection) ? fails$3(detection)
	    : !!detection;
	};

	var normalize = isForced$1.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$1.data = {};
	var NATIVE = isForced$1.NATIVE = 'N';
	var POLYFILL = isForced$1.POLYFILL = 'P';

	var isForced_1 = isForced$1;

	var global$2 = global$c;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$5;
	var redefine$2 = redefine$3.exports;
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
	  options.name        - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$2;
	  } else if (STATIC) {
	    target = global$2[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$2[TARGET] || {}).prototype;
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
	      createNonEnumerableProperty$2(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine$2(target, key, sourceProperty, options);
	  }
	};

	var anInstance$1 = function (it, Constructor, name) {
	  if (it instanceof Constructor) return it;
	  throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	};

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
	var anObject$8 = anObject$b;
	var objectKeys = objectKeys$1;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$8(O);
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

	var anObject$7 = anObject$b;
	var defineProperties = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys = hiddenKeys$4;
	var html = html$1;
	var documentCreateElement = documentCreateElement$1;
	var sharedKey$1 = sharedKey$3;

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$1('IE_PROTO');

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

	hiddenKeys[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$7(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : defineProperties(result, Properties);
	};

	var fails$2 = fails$8;

	var correctPrototypeGetter = !fails$2(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var hasOwn$1 = hasOwnProperty_1;
	var isCallable$3 = isCallable$d;
	var toObject = toObject$2;
	var sharedKey = sharedKey$3;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	var IE_PROTO = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable$3(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof Object ? ObjectPrototype : null;
	};

	var fails$1 = fails$8;
	var isCallable$2 = isCallable$d;
	var getPrototypeOf = objectGetPrototypeOf;
	var redefine$1 = redefine$3.exports;
	var wellKnownSymbol$6 = wellKnownSymbol$8;

	var ITERATOR$2 = wellKnownSymbol$6('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$1(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable$2(IteratorPrototype$2[ITERATOR$2])) {
	  redefine$1(IteratorPrototype$2, ITERATOR$2, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	// https://github.com/tc39/proposal-iterator-helpers
	var $$2 = _export;
	var global$1 = global$c;
	var anInstance = anInstance$1;
	var isCallable$1 = isCallable$d;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$5;
	var fails = fails$8;
	var hasOwn = hasOwnProperty_1;
	var wellKnownSymbol$5 = wellKnownSymbol$8;
	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

	var TO_STRING_TAG$3 = wellKnownSymbol$5('toStringTag');

	var NativeIterator = global$1.Iterator;

	// FF56- have non-standard global helper `Iterator`
	var FORCED = !isCallable$1(NativeIterator)
	  || NativeIterator.prototype !== IteratorPrototype$1
	  // FF44- non-standard `Iterator` passes previous tests
	  || !fails(function () { NativeIterator({}); });

	var IteratorConstructor = function Iterator() {
	  anInstance(this, IteratorConstructor);
	};

	if (!hasOwn(IteratorPrototype$1, TO_STRING_TAG$3)) {
	  createNonEnumerableProperty$1(IteratorPrototype$1, TO_STRING_TAG$3, 'Iterator');
	}

	if (FORCED || !hasOwn(IteratorPrototype$1, 'constructor') || IteratorPrototype$1.constructor === Object) {
	  createNonEnumerableProperty$1(IteratorPrototype$1, 'constructor', IteratorConstructor);
	}

	IteratorConstructor.prototype = IteratorPrototype$1;

	$$2({ global: true, forced: FORCED }, {
	  Iterator: IteratorConstructor
	});

	var iterators = {};

	var wellKnownSymbol$4 = wellKnownSymbol$8;
	var Iterators$1 = iterators;

	var ITERATOR$1 = wellKnownSymbol$4('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$1 = function (it) {
	  return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$1] === it);
	};

	var aCallable$3 = aCallable$5;

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aCallable$3(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
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

	var wellKnownSymbol$3 = wellKnownSymbol$8;

	var TO_STRING_TAG$2 = wellKnownSymbol$3('toStringTag');
	var test = {};

	test[TO_STRING_TAG$2] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var isCallable = isCallable$d;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$2 = wellKnownSymbol$8;

	var TO_STRING_TAG$1 = wellKnownSymbol$2('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var classof = classof$1;
	var getMethod$2 = getMethod$4;
	var Iterators = iterators;
	var wellKnownSymbol$1 = wellKnownSymbol$8;

	var ITERATOR = wellKnownSymbol$1('iterator');

	var getIteratorMethod$2 = function (it) {
	  if (it != undefined) return getMethod$2(it, ITERATOR)
	    || getMethod$2(it, '@@iterator')
	    || Iterators[classof(it)];
	};

	var aCallable$2 = aCallable$5;
	var anObject$6 = anObject$b;
	var getIteratorMethod$1 = getIteratorMethod$2;

	var getIterator$1 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
	  if (aCallable$2(iteratorMethod)) return anObject$6(iteratorMethod.call(argument));
	  throw TypeError(String(argument) + ' is not iterable');
	};

	var anObject$5 = anObject$b;
	var getMethod$1 = getMethod$4;

	var iteratorClose$2 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$5(iterator);
	  try {
	    innerResult = getMethod$1(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = innerResult.call(iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$5(innerResult);
	  return value;
	};

	var anObject$4 = anObject$b;
	var isArrayIteratorMethod = isArrayIteratorMethod$1;
	var lengthOfArrayLike = lengthOfArrayLike$2;
	var bind = functionBindContext;
	var getIterator = getIterator$1;
	var getIteratorMethod = getIteratorMethod$2;
	var iteratorClose$1 = iteratorClose$2;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate$1 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose$1(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$4(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw TypeError(String(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose$1(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	// https://github.com/tc39/proposal-iterator-helpers
	var $$1 = _export;
	var iterate = iterate$1;
	var anObject$3 = anObject$b;

	$$1({ target: 'Iterator', proto: true, real: true }, {
	  forEach: function forEach(fn) {
	    iterate(anObject$3(this), fn, { IS_ITERATOR: true });
	  }
	});

	var redefine = redefine$3.exports;

	var redefineAll$1 = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var aCallable$1 = aCallable$5;
	var anObject$2 = anObject$b;
	var create = objectCreate;
	var createNonEnumerableProperty = createNonEnumerableProperty$5;
	var redefineAll = redefineAll$1;
	var wellKnownSymbol = wellKnownSymbol$8;
	var InternalStateModule = internalState;
	var getMethod = getMethod$4;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;

	var setInternalState = InternalStateModule.set;
	var getInternalState = InternalStateModule.get;

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var IteratorProxy = function Iterator(state) {
	    state.next = aCallable$1(state.iterator.next);
	    state.done = false;
	    state.ignoreArg = !IS_ITERATOR;
	    setInternalState(this, state);
	  };

	  IteratorProxy.prototype = redefineAll(create(IteratorPrototype), {
	    next: function next(arg) {
	      var state = getInternalState(this);
	      var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
	      state.ignoreArg = false;
	      var result = state.done ? undefined : nextHandler.call(state, args);
	      return { done: state.done, value: result };
	    },
	    'return': function (value) {
	      var state = getInternalState(this);
	      var iterator = state.iterator;
	      state.done = true;
	      var $$return = getMethod(iterator, 'return');
	      return { done: true, value: $$return ? anObject$2($$return.call(iterator, value)).value : value };
	    },
	    'throw': function (value) {
	      var state = getInternalState(this);
	      var iterator = state.iterator;
	      state.done = true;
	      var $$throw = getMethod(iterator, 'throw');
	      if ($$throw) return $$throw.call(iterator, value);
	      throw value;
	    }
	  });

	  if (!IS_ITERATOR) {
	    createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG, 'Generator');
	  }

	  return IteratorProxy;
	};

	var anObject$1 = anObject$b;
	var iteratorClose = iteratorClose$2;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$1(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	// https://github.com/tc39/proposal-iterator-helpers
	var $ = _export;
	var aCallable = aCallable$5;
	var anObject = anObject$b;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$1;

	var IteratorProxy = createIteratorProxy(function (args) {
	  var iterator = this.iterator;
	  var result = anObject(this.next.apply(iterator, args));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
	});

	$({ target: 'Iterator', proto: true, real: true }, {
	  map: function map(mapper) {
	    return new IteratorProxy({
	      iterator: anObject(this),
	      mapper: aCallable(mapper)
	    });
	  }
	});

	const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
	let isZH = isZHInGameSetting; // MWITools 本身显示的语言默认由游戏内设置语言决定

	let settingsMap = {
	  projectileLimit: {
	    id: "projectileLimit",
	    desc: isZH ? "投射物数量限制" : "Projectile Limit",
	    value: 30,
	    min: 1,
	    max: 100,
	    step: 1
	  },
	  projectileScale: {
	    id: "projectileScale",
	    desc: isZH ? "投射物缩放" : "Projectile Scale",
	    value: 1.0,
	    min: 0.1,
	    max: 3.0,
	    step: 0.01
	  },
	  onHitScale: {
	    id: "onHitScale",
	    desc: isZH ? "命中效果缩放" : "On-hit Effect Scale",
	    value: 1.0,
	    min: 0.1,
	    max: 3.0,
	    step: 0.01
	  },
	  projectileHeightScale: {
	    id: "projectileHeightScale",
	    desc: isZH ? "弹道高度比例" : "Projectile Height Scale",
	    value: 1.0,
	    min: 0.1,
	    max: 3.0,
	    step: 0.01
	  },
	  projectileSpeedScale: {
	    id: "projectileSpeedScale",
	    desc: isZH ? "弹道速度比例" : "Projectile Speed Scale",
	    value: 1.0,
	    min: 0.1,
	    max: 3.0,
	    step: 0.01
	  },
	  shakeEffectScale: {
	    id: "shakeEffectScale",
	    desc: isZH ? "震动效果" : "Shake Effect Scale",
	    value: 1.0,
	    min: 0.0,
	    max: 3.0,
	    step: 0.01
	  },
	  particleEffectRatio: {
	    id: "particleEffectRatio",
	    desc: isZH ? "粒子效果数量" : "Particle Effect Ratio",
	    value: 1.0,
	    min: 0.0,
	    max: 5.0,
	    step: 0.1
	  },
	  particleLifespanRatio: {
	    id: "particleLifespanRatio",
	    desc: isZH ? "粒子效果持续时长" : "Particle Lifespan Ratio",
	    value: 1.0,
	    min: 0.1,
	    max: 5.0,
	    step: 0.1
	  },
	  particleSpeedRatio: {
	    id: "particleSpeedRatio",
	    desc: isZH ? "粒子效果初速度" : "Particle Effect Speed Ratio",
	    value: 1.0,
	    min: 0.1,
	    max: 5.0,
	    step: 0.1
	  },
	  projectileTrailLength: {
	    id: "projectileTrailLength",
	    desc: isZH ? "弹道尾迹长度" : "Projectile Trail Length",
	    value: 1.0,
	    min: 0.0,
	    max: 5.0,
	    step: 0.01
	  },
	  projectileTrailGap: {
	    id: "projectileTrailGap",
	    desc: isZH ? "弹道尾迹间隔" : "Projectile Trail Gap",
	    value: 1.0,
	    min: 0.05,
	    max: 3.0,
	    step: 0.05
	  },
	  originalDamageDisplay: {
	    id: "originalDamageDisplay",
	    desc: isZH ? "原版伤害显示" : "Original Damage Display",
	    value: false
	  },
	  hitAreaScale: {
	    id: "hitAreaScale",
	    desc: isZH ? "命中范围" : "Hit Area Scale",
	    value: 1,
	    min: 0.1,
	    max: 3.0,
	    step: 0.01
	  },
	  hitPositionMinGap: {
	    id: "hitPositionMinGap",
	    desc: isZH ? "命中最小间距" : "Minimum Gap Of Each Projectile Hit",
	    value: 0,
	    min: 0,
	    max: 10,
	    step: 1
	  },
	  damageTextLifespan: {
	    id: "damageTextLifespan",
	    desc: isZH ? "伤害文本持续时间" : "Damage Text Lifespan",
	    value: 120,
	    min: 30,
	    max: 480,
	    step: 10
	  },
	  damageTextScale: {
	    id: "damageTextScale",
	    desc: isZH ? "伤害文本大小" : "Damage Text Scale",
	    value: 1.0,
	    min: 0.1,
	    max: 3.0,
	    step: 0.1
	  },
	  damageTextAlpha: {
	    id: "damageTextAlpha",
	    desc: isZH ? "伤害文本不透明度" : "Damage Text Alpha",
	    value: 0.8,
	    min: 0.0,
	    max: 1.0,
	    step: 0.01
	  },
	  damageTextSizeMinimal: {
	    id: "damageTextSizeMinimal",
	    desc: isZH ? "伤害文本尺寸最小值" : "Damage Text Size Minimal",
	    value: 14,
	    min: 5,
	    max: 100,
	    step: 1
	  },
	  damageTextSizeLimit: {
	    id: "damageTextSizeLimit",
	    desc: isZH ? "伤害文本尺寸上限" : "Damage Text Size Limit",
	    value: 70,
	    min: 15,
	    max: 200,
	    step: 1
	  },
	  showSelfRegen: {
	    id: "showSelfRegen",
	    desc: isZH ? "显示玩家被动回复效果" : "Show Self Regeneration",
	    value: true
	  },
	  verticalCombatDisplay: {
	    id: "verticalCombatDisplay",
	    desc: isZH ? "战斗排列垂直展示" : "Display Combat Vertically",
	    value: false
	  },
	  monsterDeadAnimation: {
	    id: "monsterDeadAnimation",
	    desc: isZH ? "怪物死亡效果" : "Monster Dead Animation",
	    value: true
	  },
	  monsterDeadAnimationStyle: {
	    id: "monsterDeadAnimationStyle",
	    desc: isZH ? "怪物死亡效果样式" : "Monster Dead Animation Style",
	    value: "default",
	    list: []
	  },
	  damageHpBarDropDelay: {
	    id: "damageHpBarDropDelay",
	    desc: isZH ? "血条掉落延迟" : "Hp Bar Drop Delay",
	    value: 300,
	    min: 50,
	    max: 1000,
	    step: 50
	  },
	  tracker0: {
	    id: "tracker0",
	    desc: isZH ? "玩家1" : "Player 1",
	    isTrue: true,
	    trackStyle: "auto",
	    r: 255,
	    g: 99,
	    b: 132
	  },
	  tracker1: {
	    id: "tracker1",
	    desc: isZH ? "玩家2" : "Player 2",
	    isTrue: true,
	    trackStyle: "auto",
	    r: 54,
	    g: 162,
	    b: 235
	  },
	  tracker2: {
	    id: "tracker2",
	    desc: isZH ? "玩家3" : "Player 3",
	    isTrue: true,
	    trackStyle: "auto",
	    r: 255,
	    g: 206,
	    b: 86
	  },
	  tracker3: {
	    id: "tracker3",
	    desc: isZH ? "玩家4" : "Player 4",
	    isTrue: true,
	    trackStyle: "auto",
	    r: 75,
	    g: 192,
	    b: 192
	  },
	  tracker4: {
	    id: "tracker4",
	    desc: isZH ? "玩家5" : "Player 5",
	    isTrue: true,
	    trackStyle: "auto",
	    r: 153,
	    g: 102,
	    b: 255
	  },
	  tracker6: {
	    id: "tracker6",
	    desc: isZH ? "敌人" : "Enemies",
	    isTrue: true,
	    trackStyle: "auto",
	    r: 255,
	    g: 0,
	    b: 0
	  },
	  renderFpsLimit: {
	    id: "renderFpsLimit",
	    desc: isZH ? "渲染帧数限制(非精确，刷新生效)" : "Render FPS Limit (Not accurate, restart required)",
	    value: 160,
	    min: 5,
	    max: 300,
	    step: 1
	  },
	  showFps: {
	    id: "showFps",
	    desc: isZH ? "显示帧数" : "Show FPS",
	    value: false
	  }
	};
	readSettings();
	function waitForSettings(params) {
	  const targetNode = document.querySelector("div.SettingsPanel_profileTab__214Bj");
	  if (targetNode) {
	    if (!targetNode.querySelector("#tracker_settings")) {
	      targetNode.insertAdjacentHTML("beforeend", `<div id="tracker_settings"></div>`);
	      const insertElem = targetNode.querySelector("div#tracker_settings");
	      insertElem.insertAdjacentHTML("beforeend", `<div style="float: left; color: orange">${isZH ? "MWI-Hit-Tracker 设置 ：" : "MWI-Hit-Tracker Settings: "}</div></br>`);
	      for (const setting of Object.values(settingsMap)) {
	        if (setting.id.startsWith("tracker")) {
	          insertElem.insertAdjacentHTML("beforeend", `<div class="tracker-option"><input type="checkbox" id="${setting.id}" ${setting.isTrue ? "checked" : ""}></input>${setting.desc} ${isZH ? '颜色' : 'Color'}<div class="color-preview" id="colorPreview_${setting.id}"></div>${isZH ? '样式' : 'Projectile Style'}<select id="projectileStyle_${setting.id}"></select></div>`);
	          const checkedBox = insertElem.querySelector("#" + setting.id);
	          checkedBox.addEventListener("change", e => {
	            settingsMap[setting.id].isTrue = e.target.checked;
	            saveSettings();
	          });
	          const colorPreview = document.getElementById('colorPreview_' + setting.id);
	          let currentColor = {
	            r: setting.r,
	            g: setting.g,
	            b: setting.b
	          };

	          // 点击打开颜色选择器
	          colorPreview.addEventListener('click', () => {
	            const settingColor = {
	              r: settingsMap[setting.id].r,
	              g: settingsMap[setting.id].g,
	              b: settingsMap[setting.id].b
	            };
	            const modal = createColorPicker(settingColor, newColor => {
	              currentColor = newColor;
	              settingsMap[setting.id].r = newColor.r;
	              settingsMap[setting.id].g = newColor.g;
	              settingsMap[setting.id].b = newColor.b;
	              localStorage.setItem("tracker_settingsMap", JSON.stringify(settingsMap));
	              updatePreview();
	            });
	            document.body.appendChild(modal);
	          });
	          function updatePreview() {
	            colorPreview.style.backgroundColor = `rgb(${currentColor.r},${currentColor.g},${currentColor.b})`;
	          }
	          updatePreview();
	          function createColorPicker(initialColor, callback) {
	            // 创建弹窗容器
	            const backdrop = document.createElement('div');
	            backdrop.className = 'modal-backdrop';
	            const modal = document.createElement('div');
	            modal.className = 'color-picker-modal';

	            // 创建SVG容器
	            const preview = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	            preview.setAttribute("width", "200");
	            preview.setAttribute("height", "150");
	            preview.style.display = 'block';
	            // 创建抛物线路径
	            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	            Object.assign(path.style, {
	              strokeWidth: '5px',
	              fill: 'none',
	              strokeLinecap: 'round'
	            });
	            path.setAttribute("d", "M 0 130 Q 100 0 200 130");
	            preview.appendChild(path);

	            // 颜色控制组件
	            const controls = document.createElement('div');
	            ['r', 'g', 'b'].forEach(channel => {
	              const container = document.createElement('div');
	              container.className = 'slider-container';

	              // 标签
	              const label = document.createElement('label');
	              label.textContent = channel.toUpperCase() + ':';
	              label.style.color = "white";

	              // 滑块
	              const slider = document.createElement('input');
	              slider.type = 'range';
	              slider.min = 0;
	              slider.max = 255;
	              slider.value = initialColor[channel];

	              // 输入框
	              const input = document.createElement('input');
	              input.type = 'number';
	              input.min = 0;
	              input.max = 255;
	              input.value = initialColor[channel];
	              input.style.width = '60px';

	              // 双向绑定
	              const updateChannel = value => {
	                value = Math.min(255, Math.max(0, parseInt(value) || 0));
	                slider.value = value;
	                input.value = value;
	                currentColor[channel] = value;
	                path.style.stroke = getColorString(currentColor);
	              };
	              slider.addEventListener('input', e => updateChannel(e.target.value));
	              input.addEventListener('change', e => updateChannel(e.target.value));
	              container.append(label, slider, input);
	              controls.append(container);
	            });

	            // 操作按钮
	            const actions = document.createElement('div');
	            actions.className = 'modal-actions';
	            const confirmBtn = document.createElement('button');
	            confirmBtn.textContent = isZH ? '确定' : 'OK';
	            confirmBtn.onclick = () => {
	              callback(currentColor);
	              backdrop.remove();
	            };
	            const cancelBtn = document.createElement('button');
	            cancelBtn.textContent = isZH ? '取消' : 'Cancel';
	            cancelBtn.onclick = () => backdrop.remove();
	            actions.append(cancelBtn, confirmBtn);

	            // 组装弹窗
	            const getColorString = color => `rgb(${color.r},${color.g},${color.b})`;
	            path.style.stroke = getColorString(settingsMap[setting.id]);
	            modal.append(preview, controls, actions);
	            backdrop.append(modal);

	            // 点击背景关闭
	            backdrop.addEventListener('click', e => {
	              if (e.target === backdrop) backdrop.remove();
	            });
	            return backdrop;
	          }
	          const select = document.querySelector("#projectileStyle_" + setting.id);
	          const projectileStyle = ["auto", "null", ...params.allProjectiles];
	          for (const option of projectileStyle) {
	            select.insertAdjacentHTML("beforeend", `<option value="${option}" ${option === setting.trackStyle ? "selected" : ""}>${option}</option>`);
	          }
	          select.addEventListener("change", e => {
	            settingsMap[setting.id].trackStyle = e.target.value;
	            saveSettings();
	          });
	        } else {
	          if (typeof setting.value === "boolean") {
	            insertElem.insertAdjacentHTML("beforeend", `<div class="tracker-option">${setting.desc}<input type="checkbox" id="trackerSetting_${setting.id}"></input></div>`);
	            const checkedBox = insertElem.querySelector("#trackerSetting_" + setting.id);
	            checkedBox.checked = setting.value;
	            checkedBox.addEventListener("change", e => {
	              settingsMap[setting.id].value = e.target.checked;
	              saveSettings();
	            });
	          } else if (typeof setting.value === "number") {
	            insertElem.insertAdjacentHTML("beforeend", `<div class="tracker-option">${setting.desc}<input type="range" id="trackerSetting_${setting.id}_range"></input><input type="number" id="trackerSetting_${setting.id}_value"></input></div>`);
	            const slider = document.querySelector("#trackerSetting_" + setting.id + "_range");
	            slider.min = setting.min;
	            slider.max = setting.max;
	            slider.step = setting.step || 0.05;
	            slider.value = setting.value;
	            const input = document.querySelector("#trackerSetting_" + setting.id + "_value");
	            input.min = setting.min;
	            input.max = setting.max;
	            input.step = setting.step || 0.05;
	            input.value = setting.value;
	            const updateChannel = value => {
	              value = Math.min(setting.max, Math.max(setting.min, parseFloat(value)));
	              slider.value = value;
	              input.value = value;
	              settingsMap[setting.id].value = value;
	            };
	            slider.addEventListener('input', e => updateChannel(e.target.value));
	            input.addEventListener('change', e => updateChannel(e.target.value));
	          } else if (setting.list) {
	            insertElem.insertAdjacentHTML("beforeend", `<div class="tracker-option">${setting.desc}<select id="trackerSetting_${setting.id}"></select></div>`);
	            const select = document.querySelector("#trackerSetting_" + setting.id);
	            for (const option of params[setting.id]) {
	              select.insertAdjacentHTML("beforeend", `<option value="${option}" ${option === setting.value ? "selected" : ""}>${option}</option>`);
	            }
	            select.addEventListener("change", e => {
	              settingsMap[setting.id].value = e.target.value;
	              saveSettings();
	            });
	          }
	        }
	      }
	      insertElem.addEventListener("change", saveSettings);
	    }
	  }
	  setTimeout(() => {
	    waitForSettings(params);
	  }, 500);
	}
	function saveSettings() {
	  localStorage.setItem("tracker_settingsMap", JSON.stringify(settingsMap));
	}
	function readSettings() {
	  const ls = localStorage.getItem("tracker_settingsMap");
	  if (ls) {
	    const lsObj = JSON.parse(ls);
	    for (const option of Object.values(lsObj)) {
	      if (option.id.startsWith("tracker")) {
	        if (settingsMap.hasOwnProperty(option.id)) {
	          settingsMap[option.id].isTrue = option.isTrue;
	          settingsMap[option.id].trackStyle = option.trackStyle || "auto";
	          settingsMap[option.id].r = option.r;
	          settingsMap[option.id].g = option.g;
	          settingsMap[option.id].b = option.b;
	        }
	      } else if (option && option.id && settingsMap[option.id]) {
	        settingsMap[option.id].value = option.value;
	      }
	    }
	  }
	}
	const style = document.createElement('style');
	style.textContent = `
    .tracker-option {
      display: flex;
      align-items: left;
      gap: 10px;
    }

    .color-preview {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin: 3px 3px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .color-picker-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.5);
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        z-index: 1000;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    }

    .modal-actions {
        margin-top: 20px;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
`;
	document.head.appendChild(style);

	function changeColorAlpha(rgba, alpha) {
	  if (rgba.startsWith('rgba')) {
	    return rgba.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
	  } else if (rgba.startsWith('rgb')) {
	    return rgba.replace(/rgb\(([^,]+),([^,]+),([^,]+)\)/, `rgba($1,$2,$3,${alpha})`);
	  } else if (rgba.startsWith('hsl')) {
	    return rgba.replace(/hsl\(([^,]+),([^,]+),([^)]+)\)/, `hsla($1,$2,$3,${alpha})`);
	  } else if (rgba.startsWith('hsla')) {
	    return rgba.replace(/hsla\(([^,]+),([^,]+),([^)]+),[^)]+\)/, `hsla($1,$2,$3,${alpha})`);
	  }
	  return rgba;
	}
	function getElementCenter(element) {
	  const rect = element.getBoundingClientRect();
	  if (element.innerText.trim() === '') {
	    return {
	      x: rect.left + rect.width / 2,
	      y: rect.top
	    };
	  }
	  return {
	    x: rect.left + rect.width / 2,
	    y: rect.top + rect.height / 2
	  };
	}

	const shapes = {
	  "circle": (ctx, p = {}) => {
	    // {x, y, size, color}
	    ctx.beginPath();
	    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	    ctx.fillStyle = p.color;
	    ctx.fill();
	  },
	  "rectangle": (ctx, p = {}) => {
	    // {x, y, size, color}
	    ctx.beginPath();
	    ctx.fillStyle = p.color;
	    ctx.fillRect(p.x, p.y, p.size, p.size);
	    ctx.closePath();
	  },
	  "star": (ctx, p = {}) => {
	    // {x, y, size, color, angle}
	    ctx.save();
	    ctx.translate(p.x, p.y);
	    ctx.rotate(p.angle);
	    const starSize = p.size * 10;
	    ctx.beginPath();
	    const startAngle = -Math.PI / 2;
	    const startX = Math.cos(startAngle) * starSize;
	    const startY = Math.sin(startAngle) * starSize;
	    ctx.moveTo(startX, startY);
	    for (let i = 0; i < 5; i++) {
	      const outerAngle = i * 2 * Math.PI / 5 - Math.PI / 2;
	      const innerAngle = outerAngle + Math.PI / 5;
	      const outerX = Math.cos(outerAngle) * starSize;
	      const outerY = Math.sin(outerAngle) * starSize;
	      ctx.lineTo(outerX, outerY);
	      const innerX = Math.cos(innerAngle) * (starSize / 2);
	      const innerY = Math.sin(innerAngle) * (starSize / 2);
	      ctx.lineTo(innerX, innerY);
	    }
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    ctx.restore();
	  },
	  "arrow": (ctx, p = {}) => {
	    // {x, y, size, color, velocity, arrowLength, arrowWidth, arrowHeadLength, arrowHeadWidth, fletchingLength, fletchingWidth}
	    const length = p.size * (p.arrowLength || 6);
	    const width = p.size * (p.arrowWidth || 0.5);
	    const arrowHeadLength = p.size * (p.arrowHeadLength || 1.33);
	    const arrowHeadWidth = p.size * (p.arrowHeadWidth || 0.80);
	    const fletchingLength = p.size * (p.fletchingLength || 2.13);
	    const fletchingWidth = p.size * (p.fletchingWidth || 1.33);
	    ctx.save();
	    ctx.translate(p.x, p.y);
	    ctx.rotate(Math.atan2(p.velocity.y, p.velocity.x));
	    // Draw arrow shaft
	    ctx.beginPath();
	    ctx.moveTo(-length / 2, -width / 2);
	    ctx.lineTo(length / 2 - arrowHeadLength, -width / 2);
	    ctx.lineTo(length / 2 - arrowHeadLength, width / 2);
	    ctx.lineTo(-length / 2, width / 2);
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    // Draw arrow head
	    ctx.beginPath();
	    ctx.moveTo(length / 3 - arrowHeadLength, -arrowHeadWidth / 2);
	    ctx.lineTo(length / 2, 0);
	    ctx.lineTo(length / 3 - arrowHeadLength, arrowHeadWidth / 2);
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    // Draw fletchings 
	    ctx.beginPath();
	    ctx.moveTo(-length / 2, -width / 2);
	    ctx.lineTo(-length / 2 - fletchingLength, -fletchingWidth / 2);
	    ctx.lineTo(-length / 2 - fletchingLength * 0.5, 0);
	    ctx.lineTo(-length / 2 - fletchingLength, fletchingWidth / 2);
	    ctx.lineTo(-length / 2, width / 2);
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    ctx.restore();
	  },
	  "pentagon": (ctx, p = {}) => {
	    // {x, y, size, color, angle}
	    ctx.save();
	    ctx.translate(p.x, p.y);
	    ctx.rotate(p.angle || 0);
	    ctx.beginPath();
	    for (let i = 0; i < 5; i++) {
	      const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
	      const x = Math.cos(angle) * p.size;
	      const y = Math.sin(angle) * p.size;
	      if (i === 0) {
	        ctx.moveTo(x, y);
	      } else {
	        ctx.lineTo(x, y);
	      }
	    }
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    ctx.restore();
	  },
	  "triangle": (ctx, p = {}) => {
	    // {x, y, size, color, angle}
	    ctx.save();
	    ctx.translate(p.x, p.y);
	    ctx.rotate(p.angle || 0);
	    ctx.beginPath();
	    for (let i = 0; i < 3; i++) {
	      const angle = i * 2 * Math.PI / 3 - Math.PI / 2;
	      const x = Math.cos(angle) * p.size;
	      const y = Math.sin(angle) * p.size;
	      if (i === 0) {
	        ctx.moveTo(x, y);
	      } else {
	        ctx.lineTo(x, y);
	      }
	    }
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    ctx.restore();
	  },
	  "irregular": (ctx, p = {}) => {
	    // {x, y, size, color, angle, points}
	    ctx.save();
	    ctx.translate(p.x, p.y);
	    ctx.rotate(p.angle || 0);
	    const points = p.points || 6; // Default to 6 points if not specified
	    ctx.beginPath();
	    for (let i = 0; i < points; i++) {
	      const angle = i * 2 * Math.PI / points - Math.PI / 2;
	      // Add some randomness to the radius for irregularity
	      const radius = p.size * (0.7 + Math.random() * 0.6);
	      const x = Math.cos(angle) * radius;
	      const y = Math.sin(angle) * radius;
	      if (i === 0) {
	        ctx.moveTo(x, y);
	      } else {
	        ctx.lineTo(x, y);
	      }
	    }
	    ctx.closePath();
	    ctx.fillStyle = p.color;
	    ctx.fill();
	    ctx.restore();
	  },
	  "magnet": (ctx, p = {}) => {
	    // {x, y, size, color, angle}
	    ctx.save();
	    ctx.translate(p.x, p.y);
	    ctx.rotate(p.angle || 0);

	    // Set stroke properties
	    ctx.lineCap = 'butt'; // Makes strokes end exactly at the specified points
	    ctx.lineWidth = p.size * 0.7; // Equivalent to strokeWeight(35)

	    // Draw left L shape (red)
	    ctx.strokeStyle = 'rgb(255, 50, 50)'; // Muted red
	    ctx.beginPath();
	    // Vertical part
	    ctx.moveTo(-p.size, -p.size);
	    ctx.lineTo(-p.size, 0);
	    // Horizontal part with curve
	    ctx.bezierCurveTo(-p.size, p.size,
	    // Control point 1: (150, 300)
	    -p.size / 3, p.size,
	    // Control point 2: (200, 300)
	    0, p.size // End point: (200, 300)
	    );
	    ctx.stroke();

	    // Draw right L shape (blue)
	    ctx.strokeStyle = 'rgb(50, 50, 255)'; // Muted blue
	    ctx.beginPath();
	    // Vertical part
	    ctx.moveTo(p.size, -p.size);
	    ctx.lineTo(p.size, 0);
	    // Horizontal part with curve
	    ctx.bezierCurveTo(p.size, p.size,
	    // Control point 1: (250, 300)
	    p.size / 3, p.size,
	    // Control point 2: (200, 300)
	    0, p.size // End point: (200, 300)
	    );
	    ctx.stroke();

	    // Draw short grey lines
	    ctx.strokeStyle = 'grey';
	    // Left grey line
	    ctx.beginPath();
	    ctx.moveTo(-p.size, -p.size);
	    ctx.lineTo(-p.size, -p.size / 0.6);
	    ctx.stroke();

	    // Right grey line
	    ctx.beginPath();
	    ctx.moveTo(p.size, -p.size);
	    ctx.lineTo(p.size, -p.size / 0.6);
	    ctx.stroke();
	    ctx.restore();
	  }
	};

	/*
	特效编写请查阅
	https://docs.qq.com/doc/DS0JjVHp3S09td2NV
	*/

	const onHitEffectsMap = {
	  "smoke": {
	    angle: p => Math.random() * Math.PI * 2,
	    alpha: p => 0.7,
	    speed: p => (Math.random() * 0.05 + 0.02) * Math.sqrt(p.size),
	    size: p => (Math.random() * 20 + 10) * p.size,
	    life: p => 4000 * Math.sqrt(p.size),
	    gravity: p => -0.04 * Math.sqrt(p.size),
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.y -= 3 * p.size;
	        p.sizeVariation = Math.random() * 0.2 + 0.9;
	        p.rotationSpeed = (Math.random() - 0.5) * 0.005;
	        p.rotation = Math.random() * Math.PI * 2;
	        p.verticalSpeed = 0;
	      }
	      p.speed *= 0.999;
	      p.verticalSpeed += p.gravity;
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.verticalSpeed;
	      p.life -= 1;
	      p.alpha = Math.max(0, p.alpha - 0.0003 / p.fpsFactor);
	      p.rotation += p.rotationSpeed;
	      if (p.life > 0) {
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.rotation);

	        // Draw main smoke puff
	        ctx.beginPath();
	        ctx.ellipse(0, 0, p.size * p.sizeVariation, p.size, 0, 0, Math.PI * 2);
	        ctx.fillStyle = `rgba(80, 80, 80, ${p.alpha * (p.life / 2000)})`;
	        ctx.fill();

	        // Add some variation to the smoke puff
	        ctx.beginPath();
	        ctx.ellipse(p.size * 0.3, -p.size * 0.2, p.size * 0.6, p.size * 0.8, 0, 0, Math.PI * 2);
	        ctx.fillStyle = `rgba(80, 80, 80, ${p.alpha * 0.7 * (p.life / 2000)})`;
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "ember": {
	    angle: p => Math.random() * Math.PI * 2,
	    alpha: p => 1,
	    speed: p => (Math.random() * 2 + 0.5) * Math.sqrt(p.size),
	    size: p => (Math.random() * 6 + 2) * p.size,
	    life: p => 1200 * Math.sqrt(p.size),
	    gravity: p => 0.3,
	    draw: (ctx, p) => {
	      p.speed *= 0.99; // 慢慢减速
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.gravity;
	      p.life -= 3 / p.fpsFactor;
	      if (p.life > 0) {
	        const alpha = p.life / 800;
	        ctx.beginPath();
	        ctx.arc(p.x, p.y, p.size * (p.life / 800), 0, Math.PI * 2);
	        ctx.fillStyle = `${p.color.slice(0, -4)}%, ${alpha})`;
	        ctx.fill();

	        // 余烬偶尔产生的小火花
	        if (Math.random() < 0.03) {
	          ctx.beginPath();
	          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
	          ctx.fillStyle = `hsla(30, 100%, 70%, ${alpha * 0.7})`;
	          ctx.fill();
	        }
	      }
	    }
	  },
	  "shockwave": {
	    size: p => 10 * p.size,
	    life: p => 800 * Math.sqrt(p.size),
	    draw: (ctx, p) => {
	      if (!p.maxSize) {
	        p.maxSize = p.size * (150 + Math.random() * 100) / 10;
	      }
	      p.size += (p.maxSize - p.size) * 0.1;
	      p.life -= 10 / p.fpsFactor;
	      if (p.life > 0) {
	        const alpha = p.life / 400;
	        ctx.beginPath();
	        ctx.strokeStyle = p.color;
	        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	        ctx.lineWidth = 5 * alpha;
	        ctx.stroke();
	      }
	    }
	  },
	  "smallParticle": {
	    angle: p => Math.random() * Math.PI * 2,
	    size: p => (Math.random() * 12 + 8) * p.size,
	    speed: p => (Math.random() * 6 + 2) * Math.sqrt(p.size),
	    gravity: p => 0.3 + Math.random() * 0.1,
	    life: p => 400 * p.size,
	    draw: (ctx, p) => {
	      p.size = p.size * (1 - p.life / 400);
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.gravity;
	      p.life -= 3 / p.fpsFactor;
	      if (p.life > 0) {
	        ctx.beginPath();
	        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	        ctx.fillStyle = p.color;
	        ctx.fill();
	      }
	    }
	  },
	  "holyCross": {
	    x: p => p.x + (Math.random() - 0.5) * 60,
	    y: p => p.y + (Math.random() - 0.5) * 10,
	    size: p => (8 * Math.random() + 12) * p.size,
	    life: p => 1200 * Math.sqrt(p.size),
	    speed: p => 0,
	    gravity: p => -0.008 * Math.random() - 0.008,
	    draw: (ctx, p) => {
	      p.speed += p.gravity * p.fpsFactor;
	      p.y += p.speed * p.fpsFactor;
	      p.life -= 3 / p.fpsFactor;
	      if (p.life > 0) {
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.fillStyle = p.color;
	        ctx.fillRect(-p.size / 2, -p.size * 2, p.size, p.size * 4);
	        ctx.fillRect(-p.size * 2, -p.size / 2, p.size * 4, p.size);
	        ctx.restore();
	      }
	    }
	  },
	  "leaf": {
	    // Made by HwiteCat
	    x: p => p.x + (Math.random() - 0.5) * 60,
	    y: p => p.y + (Math.random() - 0.5) * 10,
	    angle: p => Math.random() * Math.PI * 2,
	    size: p => (12 * Math.random() + 8) * p.size,
	    life: p => 1250 * p.size,
	    speed: p => (Math.random() * 3 + 1) * Math.sqrt(p.size),
	    gravity: p => 0.12,
	    draw: (ctx, p) => {
	      if (!p.rotation) p.rotation = Math.random() * Math.PI * 2;
	      if (!p.rotationSpeed) p.rotationSpeed = (Math.random() - 0.5) * 0.02;
	      if (!p.sway) p.sway = (Math.random() - 0.5) * 0.2;
	      if (!p.swaySpeed) p.swaySpeed = (Math.random() - 0.5) * 0.02;
	      p.speed *= 0.98;
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.gravity;
	      p.life -= 3 / p.fpsFactor;
	      if (p.rotation !== undefined) {
	        p.rotation += p.rotationSpeed;
	      }
	      if (p.scale !== undefined) {
	        p.scale += p.scaleSpeed;
	        p.scale = Math.max(0.1, p.scale);
	      }
	      if (p.sway !== undefined) {
	        p.x += Math.sin(p.y * p.swaySpeed) * p.sway;
	      }
	      if (p.life > 0) {
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.rotation);
	        ctx.scale(p.scale, 1);
	        ctx.beginPath();
	        ctx.moveTo(0, -p.size);
	        ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size / 2, 0, 0, p.size);
	        ctx.bezierCurveTo(-p.size / 2, 0, -p.size / 2, -p.size / 2, 0, -p.size);
	        ctx.fillStyle = p.color;
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "slash": {
	    // Main slash effect
	    x: p => p.x,
	    y: p => p.y,
	    angle: p => Math.random() * Math.PI * 2,
	    size: p => 3 * p.size,
	    life: p => 300 * p.size,
	    draw: (ctx, p) => {
	      if (!p.length) p.length = p.size * (120 + Math.random() * 80); // More consistent length
	      if (!p.maxWidth) p.maxWidth = 1.5 * Math.sqrt(p.size); // Thinner slash
	      p.life -= 2 / p.fpsFactor; // Even slower fade

	      if (p.life > 0) {
	        const alpha = p.life / 300 * p.size;
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.angle);

	        // Draw main slash line with improved tapered shape
	        ctx.beginPath();
	        ctx.moveTo(-p.length / 2, 0);
	        ctx.quadraticCurveTo(-p.length / 4, -p.maxWidth * 0.6, -p.length / 6, -p.maxWidth);
	        ctx.lineTo(p.length / 6, -p.maxWidth);
	        ctx.quadraticCurveTo(p.length / 4, -p.maxWidth * 0.6, p.length / 2, 0);
	        ctx.quadraticCurveTo(p.length / 4, p.maxWidth * 0.6, p.length / 6, p.maxWidth);
	        ctx.lineTo(-p.length / 6, p.maxWidth);
	        ctx.quadraticCurveTo(-p.length / 4, p.maxWidth * 0.6, -p.length / 2, 0);
	        ctx.closePath();
	        ctx.fillStyle = p.color.replace('0.9', alpha.toString());
	        ctx.fill();

	        // Enhanced glow effect
	        ctx.beginPath();
	        ctx.moveTo(-p.length / 2, 0);
	        ctx.quadraticCurveTo(-p.length / 4, -p.maxWidth * 0.8, -p.length / 6, -p.maxWidth * 1.5);
	        ctx.lineTo(p.length / 6, -p.maxWidth * 1.5);
	        ctx.quadraticCurveTo(p.length / 4, -p.maxWidth * 0.8, p.length / 2, 0);
	        ctx.quadraticCurveTo(p.length / 4, p.maxWidth * 0.8, p.length / 6, p.maxWidth * 1.5);
	        ctx.lineTo(-p.length / 6, p.maxWidth * 1.5);
	        ctx.quadraticCurveTo(-p.length / 4, p.maxWidth * 0.8, -p.length / 2, 0);
	        ctx.closePath();
	        ctx.fillStyle = p.color.replace('0.9', (alpha * 0.3).toString());
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "slashParticle": {
	    // Enhanced particle effect for slash
	    x: p => p.x + (Math.random() - 0.5) * 15,
	    // Tighter initial spread
	    y: p => p.y + (Math.random() - 0.5) * 15,
	    angle: p => {
	      const baseAngle = p.parentAngle || Math.random() * Math.PI * 2;
	      return baseAngle + (Math.random() - 0.5) * 0.1; // Very small variation
	    },
	    size: p => (2 * Math.random() + 2) * p.size,
	    // Bigger particles
	    life: p => 600 * p.size,
	    // Adjusted for faster movement
	    speed: p => (Math.random() * 1 + 3) * Math.sqrt(p.size),
	    // Much faster speed
	    gravity: p => 0.02,
	    // Minimal gravity for more directional movement
	    draw: (ctx, p) => {
	      p.speed *= 0.998; // Very smooth deceleration
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.gravity;
	      p.life -= 3 / p.fpsFactor;
	      if (p.life > 0) {
	        const alpha = p.life / 400;
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.angle);

	        // Draw particle with more elongation in movement direction
	        ctx.beginPath();
	        ctx.moveTo(-p.size / 2, 0);
	        ctx.quadraticCurveTo(-p.size / 4, -p.size / 2, 0, -p.size * 1.2);
	        ctx.quadraticCurveTo(p.size / 4, -p.size / 2, p.size / 2, 0);
	        ctx.quadraticCurveTo(p.size / 4, p.size / 2, 0, p.size * 1.2);
	        ctx.quadraticCurveTo(-p.size / 4, p.size / 2, -p.size / 2, 0);
	        ctx.closePath();
	        ctx.fillStyle = p.color.replace('0.9', alpha.toString());
	        ctx.fill();

	        // Add small glow to particles
	        ctx.beginPath();
	        ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
	        ctx.fillStyle = p.color.replace('0.9', (alpha * 0.3).toString());
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "waterRipple": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => 3 * p.size,
	    life: p => 1200 * p.size,
	    draw: (ctx, p) => {
	      if (!p.ripples) {
	        p.ripples = [{
	          radius: 0,
	          opacity: 0.5,
	          width: 3,
	          speed: 0.7
	        },
	        // Fast, bright inner ripple
	        {
	          radius: 0,
	          opacity: 0.5,
	          width: 2,
	          speed: 0.5
	        },
	        // Medium ripple
	        {
	          radius: 0,
	          opacity: 0.5,
	          width: 1.5,
	          speed: 0.3
	        } // Slow, faint outer ripple
	        ];
	      }
	      p.life -= 1;

	      // Update each ripple
	      p.ripples.forEach((ripple, index) => {
	        // Expand the ripple
	        ripple.radius += ripple.speed;

	        // Calculate opacity based on radius
	        const maxRadius = 30 * p.size;
	        const fadeStart = maxRadius * 0.6;
	        if (ripple.radius > fadeStart) {
	          ripple.opacity *= 0.98; // Gradual fade out
	        }

	        // Draw the ripple if it's still visible
	        if (ripple.opacity > 0.05 && ripple.radius < maxRadius) {
	          ctx.beginPath();
	          ctx.strokeStyle = p.color.replace('0.8', ripple.opacity.toString());
	          ctx.lineWidth = ripple.width * (1 - ripple.radius / maxRadius);
	          ctx.arc(p.x, p.y, ripple.radius, 0, Math.PI * 2);
	          ctx.stroke();

	          // Add a second, fainter ring for more water-like effect
	          if (ripple.radius > 5) {
	            ctx.beginPath();
	            ctx.strokeStyle = p.color.replace('0.8', (ripple.opacity * 0.5).toString());
	            ctx.lineWidth = ripple.width * 0.5 * (1 - ripple.radius / maxRadius);
	            ctx.arc(p.x, p.y, ripple.radius - 2, 0, Math.PI * 2);
	            ctx.stroke();
	          }
	        }
	      });
	    }
	  },
	  "waterSplash": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => (2 * Math.random() + 5) * p.size,
	    // Smaller size
	    life: p => 800 * p.size,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.particles = [];
	        // Create particles in a circular pattern
	        const particleCount = 7; // More particles for better coverage
	        for (let i = 0; i < particleCount; i++) {
	          const angle = i / particleCount * Math.PI * 2;
	          // Add some random variation to the angle
	          const angleVariation = (Math.random() - 0.5) * 0.5;
	          const finalAngle = angle + angleVariation;

	          // Create size variation with smaller base size
	          const sizeVariation = Math.random() * 1.5 + 0.5; // Random multiplier between 0.5 and 2
	          const baseSize = (Math.random() * 0.8 + 0.4) * p.size; // Reduced base size

	          p.particles.push({
	            x: p.x,
	            y: p.y,
	            angle: finalAngle,
	            speed: (Math.random() * 1.5 + 1) * Math.sqrt(p.size),
	            size: baseSize * sizeVariation,
	            initialSize: baseSize * sizeVariation,
	            life: 800 * p.size,
	            gravity: 0.9 + (Math.random() * 0.2 - 0.1) // Slight gravity variation
	          });
	        }
	      }
	      p.life -= 2 / p.fpsFactor;

	      // Update and draw particles
	      p.particles.forEach(particle => {
	        particle.speed *= 0.98; // Deceleration
	        particle.x += Math.cos(particle.angle) * particle.speed;
	        particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
	        particle.life -= 2;
	        const lifeRatio = particle.life / (800 * p.size);
	        const opacity = lifeRatio * 0.6; // More transparent
	        // More dramatic shrinking with cubic easing
	        particle.size = particle.initialSize * Math.pow(lifeRatio, 3);
	        if (particle.life > 0) {
	          ctx.beginPath();
	          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
	          ctx.fillStyle = p.color.replace('0.8', opacity.toString());
	          ctx.fill();
	        }
	      });
	    }
	  },
	  "magnet": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => (2 * Math.random() + 20) * p.size,
	    life: p => 800 * p.size,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.particles = [];
	        // Create particles in a circular pattern
	        const particleCount = 5; // Fewer particles for magnets
	        for (let i = 0; i < particleCount; i++) {
	          const angle = i / particleCount * Math.PI * 2;
	          // Add some random variation to the angle
	          const angleVariation = (Math.random() - 0.5) * 0.5;
	          const finalAngle = angle + angleVariation;

	          // Create size variation
	          const sizeVariation = Math.random() * 1.5 + 0.5;
	          const baseSize = (Math.random() * 0.8 + 0.4) * p.size;
	          p.particles.push({
	            x: p.x,
	            y: p.y,
	            angle: finalAngle,
	            speed: (Math.random() * 1.5 + 1) * Math.sqrt(p.size),
	            size: baseSize * sizeVariation,
	            initialSize: baseSize * sizeVariation,
	            life: 800 * p.size,
	            gravity: 0.3 + (Math.random() * 0.2 - 0.1),
	            // Less gravity for magnets
	            rotation: Math.random() * Math.PI * 2,
	            rotationSpeed: (Math.random() - 0.5) * 0.02
	          });
	        }
	      }
	      p.life -= 2 / p.fpsFactor;

	      // Update and draw particles
	      p.particles.forEach(particle => {
	        particle.speed *= 0.96;
	        particle.x += Math.cos(particle.angle) * particle.speed;
	        particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
	        particle.life -= 1;
	        particle.rotation += particle.rotationSpeed;
	        const lifeRatio = particle.life / (800 * p.size);
	        const opacity = lifeRatio * 0.8;
	        particle.size = particle.initialSize * Math.pow(lifeRatio, 2);
	        if (particle.life > 0) {
	          ctx.save();
	          ctx.translate(particle.x, particle.y);
	          ctx.rotate(particle.rotation);

	          // Use the magnet shape from shape.js
	          shapes.magnet(ctx, {
	            x: 0,
	            y: 0,
	            size: particle.size,
	            color: `rgba(128, 128, 128, ${opacity})`
	          });
	          ctx.restore();
	        }
	      });
	    }
	  },
	  "star": {
	    x: p => p.x + (Math.random() - 0.5) * 60,
	    y: p => p.y + (Math.random() - 0.5) * 10,
	    angle: p => Math.random() * Math.PI * 2,
	    size: p => (Math.random() * 6 + 2) * p.size,
	    life: p => 1200 * Math.sqrt(p.size),
	    speed: p => (Math.random() * 6 + 2) * Math.sqrt(p.size),
	    gravity: p => -0.1,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.y -= 5 * p.size;
	      }
	      p.speed *= 0.97; // 慢慢减速
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.gravity;
	      p.life -= 3 / p.fpsFactor;
	      if (p.life > 0) {
	        const alpha = Math.max(0, Math.min(1, p.life / 1200));
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.angle);
	        const starSize = p.size * 10;
	        ctx.beginPath();
	        const startAngle = -Math.PI / 2;
	        const startX = Math.cos(startAngle) * starSize;
	        const startY = Math.sin(startAngle) * starSize;
	        ctx.moveTo(startX, startY);
	        for (let i = 0; i < 5; i++) {
	          const outerAngle = i * 2 * Math.PI / 5 - Math.PI / 2;
	          const innerAngle = outerAngle + Math.PI / 5;
	          const outerX = Math.cos(outerAngle) * starSize;
	          const outerY = Math.sin(outerAngle) * starSize;
	          ctx.lineTo(outerX, outerY);
	          const innerX = Math.cos(innerAngle) * (starSize / 2);
	          const innerY = Math.sin(innerAngle) * (starSize / 2);
	          ctx.lineTo(innerX, innerY);
	        }
	        ctx.closePath();
	        ctx.fillStyle = p.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "pierce": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => 4 * p.size,
	    life: p => 1200 * p.size,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.pierceLength = p.size * 16;
	        p.pierceWidth = p.size / 10;
	        p.time = 0;
	        p.ripples = [];
	        // Create initial ripples
	        for (let i = 0; i < 3; i++) {
	          p.ripples.push({
	            radius: 0,
	            speed: 0.5 + i * 0.2,
	            opacity: 0.6 - i * 0.15,
	            width: 2 - i * 0.5
	          });
	        }
	      }
	      p.life -= 2 / p.fpsFactor;
	      p.time += 0.1;
	      const alpha = p.life / 1200;
	      if (p.life > 0) {
	        ctx.save();
	        ctx.translate(p.x, p.y);

	        // Draw dynamic ripples
	        p.ripples.forEach(ripple => {
	          ripple.radius += ripple.speed;
	          const rippleAlpha = ripple.opacity * alpha * (1 - ripple.radius / (p.size * 8));
	          if (rippleAlpha > 0.01) {
	            ctx.beginPath();
	            ctx.strokeStyle = p.color.replace('0.8', rippleAlpha.toString());
	            ctx.lineWidth = ripple.width;
	            ctx.arc(0, 0, ripple.radius, 0, Math.PI * 2);
	            ctx.stroke();
	          }
	        });

	        // 4角星星
	        const vertices = {
	          top: {
	            x: 0,
	            y: -p.pierceLength / 2.5
	          },
	          // Reduced vertical height
	          right: {
	            x: p.pierceLength,
	            y: 0
	          },
	          // Maintained horizontal stretch
	          bottom: {
	            x: 0,
	            y: p.pierceLength / 2.5
	          },
	          // Reduced vertical height
	          left: {
	            x: -p.pierceLength,
	            y: 0
	          } // Maintained horizontal stretch
	        };

	        // Define inner points for curved connections (closer to center)
	        const innerPoints = {
	          topRight: {
	            x: p.pierceLength / 7,
	            y: -p.pierceLength / 10
	          },
	          // Moved closer to center
	          bottomRight: {
	            x: p.pierceLength / 7,
	            y: p.pierceLength / 10
	          },
	          // Moved closer to center
	          bottomLeft: {
	            x: -p.pierceLength / 7,
	            y: p.pierceLength / 10
	          },
	          // Moved closer to center
	          topLeft: {
	            x: -p.pierceLength / 7,
	            y: -p.pierceLength / 10
	          } // Moved closer to center
	        };

	        // Draw the shape with straight lines
	        ctx.beginPath();
	        ctx.moveTo(vertices.top.x, vertices.top.y);

	        // Draw straight lines between vertices and inner points
	        // Top to right
	        ctx.lineTo(innerPoints.topRight.x, innerPoints.topRight.y);
	        ctx.lineTo(vertices.right.x, vertices.right.y);

	        // Right to bottom
	        ctx.lineTo(innerPoints.bottomRight.x, innerPoints.bottomRight.y);
	        ctx.lineTo(vertices.bottom.x, vertices.bottom.y);

	        // Bottom to left
	        ctx.lineTo(innerPoints.bottomLeft.x, innerPoints.bottomLeft.y);
	        ctx.lineTo(vertices.left.x, vertices.left.y);

	        // Left to top
	        ctx.lineTo(innerPoints.topLeft.x, innerPoints.topLeft.y);
	        ctx.lineTo(vertices.top.x, vertices.top.y);
	        ctx.closePath();

	        // Add main fill with enhanced opacity
	        ctx.fillStyle = p.color.replace('0.8', (alpha * 0.9).toString());
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "poison": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => 5 * p.size,
	    // Increased base size
	    life: p => 800 * p.size,
	    // Longer lifetime
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.bubbles = [];
	        for (let i = 0; i < 6; i++) {
	          // More bubbles
	          p.bubbles.push({
	            x: p.x + (Math.random() - 0.5) * p.size * 4,
	            // Wider spread
	            y: p.y + (Math.random() - 0.5) * p.size * 4,
	            size: p.size * (Math.random() * 1.2 + 1.2),
	            // Bigger bubbles
	            speed: Math.random() * 0.8 + 0.4,
	            // Faster rise
	            wobble: Math.random() * Math.PI * 2,
	            // For side-to-side movement
	            wobbleSpeed: Math.random() * 0.05 + 0.02
	          });
	        }
	      }
	      p.life -= 1;
	      const alpha = Math.pow(p.life / p.maxLife, 0.7);
	      if (p.life > 0) {
	        // Draw main poison cloud
	        ctx.beginPath();
	        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
	        ctx.fillStyle = changeColorAlpha(p.color, alpha * 0.8);
	        ctx.fill();

	        // Draw and update bubbles
	        p.bubbles.forEach(bubble => {
	          bubble.y -= bubble.speed;
	          bubble.wobble += bubble.wobbleSpeed;
	          bubble.x += Math.sin(bubble.wobble) * 0.5;
	          ctx.beginPath();
	          ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
	          ctx.fillStyle = changeColorAlpha(p.color, alpha);
	          ctx.fill();

	          // Add bubble highlight
	          ctx.beginPath();
	          ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2);
	          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
	          ctx.fill();
	        });
	      }
	    }
	  },
	  "ice": {
	    x: p => p.x,
	    y: p => p.y,
	    speed: p => (Math.random() * 3 + 1.5) * Math.sqrt(p.size),
	    size: p => (2 * Math.random() + 3) * p.size,
	    life: p => 1200 * p.size,
	    draw: (ctx, p) => {
	      p.length = p.size * 7;
	      p.speed *= 0.96;
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed;
	      p.life -= 1;
	      const lifeRatio = p.life / p.maxLife;
	      const alpha = Math.pow(lifeRatio, 0.2);
	      if (p.life > 0) {
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.angle + Math.PI / 2);
	        ctx.beginPath();
	        ctx.moveTo(0, -p.length / 2);
	        ctx.lineTo(p.size / 2, 0);
	        ctx.lineTo(0, p.length / 2);
	        ctx.lineTo(-p.size / 2, 0);
	        ctx.closePath();
	        ctx.fillStyle = changeColorAlpha(p.color, alpha);
	        ctx.fill();
	        ctx.strokeStyle = changeColorAlpha(p.color, alpha);
	        ctx.lineWidth = 2;
	        ctx.stroke();

	        // Add white glow
	        ctx.beginPath();
	        ctx.moveTo(0, -p.length / 2);
	        ctx.lineTo(p.size / 2, 0);
	        ctx.lineTo(0, p.length / 2);
	        ctx.lineTo(-p.size / 2, 0);
	        ctx.closePath();

	        // Create gradient for glow
	        const gradient = ctx.createLinearGradient(0, -p.length / 2, 0, p.length / 2);
	        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
	        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.4})`);
	        gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.8})`);
	        ctx.fillStyle = gradient;
	        ctx.fill();

	        // Add shiny highlight
	        ctx.beginPath();
	        ctx.moveTo(-p.size / 4, -p.length / 4);
	        ctx.lineTo(p.size / 4, -p.length / 4);
	        ctx.lineTo(0, 0);
	        ctx.closePath();
	        const highlightGradient = ctx.createLinearGradient(-p.size / 4, -p.length / 4, 0, 0);
	        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
	        highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
	        ctx.fillStyle = highlightGradient;
	        ctx.fill();
	        ctx.restore();
	      }
	    }
	  },
	  "lava": {
	    x: p => p.x + (Math.random() - 0.5) * p.size * 5,
	    y: p => p.y + (Math.random() - 0.5) * p.size * 2,
	    size: p => (14 * Math.random() + 20) * p.size,
	    angle: p => (Math.random() - 0.5) * Math.PI / 5 * 2 - Math.PI / 2,
	    speed: p => (Math.random() * 7 + 5) * Math.sqrt(p.size),
	    gravity: p => 1.2 + (Math.random() * 0.2 - 0.1),
	    life: p => 1200 * p.size,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.particles = [];

	        // Particle configuration
	        const numPoints = 16;
	        p.numPoints = numPoints;
	        p.noiseOffsets = Array.from({
	          length: numPoints
	        }, () => Math.random() * Math.PI * 2);
	        p.noiseAmplitudes = Array.from({
	          length: numPoints
	        }, () => Math.random() * 0.15 + 0.85);
	        p.noiseSpeeds = Array.from({
	          length: numPoints
	        }, () => Math.random() * 0.03 + 0.02);
	        p.time = 0;
	        p.rotation = Math.random() * Math.PI * 2;
	        p.rotationSpeed = (Math.random() - 0.5) * 0.05;
	        p.oringinalSize = p.size;
	      }
	      p.life -= 1;
	      p.speed *= 0.98;
	      p.x += Math.cos(p.angle) * p.speed;
	      p.y += Math.sin(p.angle) * p.speed + p.gravity;
	      p.life -= 1;
	      p.rotation += p.rotationSpeed;
	      p.time += 0.15;
	      const lifeRatio = p.life / p.maxLife;
	      const opacity = lifeRatio * 0.8;
	      const sizeReduction = Math.pow(lifeRatio, 0.1);
	      p.size = Math.min(p.size * sizeReduction, p.oringinalSize);
	      if (p.life > 0) {
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        ctx.rotate(p.rotation);

	        // Enable blending for better transparency
	        ctx.globalCompositeOperation = 'lighter';

	        // Draw base particle shape
	        ctx.beginPath();
	        for (let i = 0; i < p.numPoints; i++) {
	          const angle = i / p.numPoints * Math.PI * 2;
	          const noise = Math.sin(angle + p.noiseOffsets[i] + p.time * p.noiseSpeeds[i]) * p.noiseAmplitudes[i];
	          const surfaceTension = Math.sin(angle * 3 + p.time * 0.5) * 0.15;
	          const radius = p.size * (1 + noise * 0.2 + surfaceTension);
	          const x = Math.cos(angle) * radius;
	          const y = Math.sin(angle) * radius;
	          if (i === 0) {
	            ctx.moveTo(x, y);
	          } else {
	            const prevAngle = (i - 1) / p.numPoints * Math.PI * 2;
	            const prevNoise = Math.sin(prevAngle + p.noiseOffsets[i - 1] + p.time * p.noiseSpeeds[i - 1]) * p.noiseAmplitudes[i - 1];
	            const prevSurfaceTension = Math.sin(prevAngle * 3 + p.time * 0.5) * 0.15;
	            const prevRadius = p.size * (1 + prevNoise * 0.2 + prevSurfaceTension);
	            const prevX = Math.cos(prevAngle) * prevRadius;
	            const prevY = Math.sin(prevAngle) * prevRadius;
	            const cpX = (prevX + x) / 2;
	            const cpY = (prevY + y) / 2;
	            ctx.quadraticCurveTo(cpX, cpY, x, y);
	          }
	        }
	        ctx.closePath();

	        // Draw particle with glow effects
	        // Base layer with reduced opacity
	        ctx.fillStyle = changeColorAlpha(p.color, opacity);
	        ctx.fill();

	        // Glow layers with adjusted opacity
	        const drawGlowLayer = (radius, color, alpha) => {
	          ctx.beginPath();
	          ctx.arc(0, 0, radius, 0, Math.PI * 2);
	          ctx.fillStyle = changeColorAlpha(p.color, opacity);
	          ctx.fill();
	        };

	        // Core and inner glow with reduced opacity
	        drawGlowLayer(p.size * 0.6);
	        drawGlowLayer(p.size * (1.2 + Math.sin(p.time * 0.5) * 0.2));

	        // Middle aura with softer gradient
	        const middleGlow = ctx.createRadialGradient(0, 0, p.size, 0, 0, p.size * 2);
	        middleGlow.addColorStop(0, changeColorAlpha(p.color, opacity * 0.2));
	        middleGlow.addColorStop(0.5, `rgba(255, 50, 0, ${opacity * 0.1})`);
	        middleGlow.addColorStop(1, `rgba(255, 0, 0, 0)`);
	        ctx.beginPath();
	        ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
	        ctx.fillStyle = middleGlow;
	        ctx.fill();

	        // Outer aura with softer gradient
	        const outerGlow = ctx.createRadialGradient(0, 0, p.size * 1.5, 0, 0, p.size * (2.5 + Math.sin(p.time * 0.5) * 0.3));
	        outerGlow.addColorStop(0, changeColorAlpha(p.color, opacity * 0.1));
	        outerGlow.addColorStop(0.5, `rgba(200, 0, 0, ${opacity * 0.03})`);
	        outerGlow.addColorStop(1, `rgba(150, 0, 0, 0)`);
	        ctx.beginPath();
	        ctx.arc(0, 0, p.size * (2.5 + Math.sin(p.time * 0.5) * 0.3), 0, Math.PI * 2);
	        ctx.fillStyle = outerGlow;
	        ctx.fill();

	        // Reset composite operation
	        ctx.globalCompositeOperation = 'source-over';
	        ctx.restore();
	      }
	    }
	  },
	  "tornado": {
	    x: p => p.x,
	    y: p => p.y + 20,
	    size: p => 3 * p.size,
	    life: p => 2000 * p.size,
	    speed: p => (Math.random() * 3 + 1) * Math.sqrt(p.size),
	    gravity: p => 0.12,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.particles = [];
	        p.maxParticles = 6;
	        p.amplitude = 60 * p.size;
	        p.frequency = 7;
	        p.timeSpeed = 0.4;
	        p.maxHeight = 200 * p.size;

	        // Parse the base color once
	        const colorMatch = p.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
	        if (colorMatch) {
	          p.baseColor = {
	            r: parseInt(colorMatch[1]),
	            g: parseInt(colorMatch[2]),
	            b: parseInt(colorMatch[3])
	          };
	        }

	        // Initialize particles with staggered heights
	        for (let i = 0; i < p.maxParticles; i++) {
	          const startAngle = Math.random() * Math.PI * 2;
	          const startRadius = Math.random() * 40 * p.size;
	          p.particles.push({
	            angle: startAngle,
	            radius: Math.random() * 150 + 5,
	            height: i / p.maxParticles * p.maxHeight,
	            speed: Math.random() * 0.04 + 0.01,
	            size: Math.random() * 3 + 2,
	            baseSpeed: Math.random() * 0.04 + 0.01,
	            startX: Math.cos(startAngle) * startRadius,
	            startY: Math.sin(startAngle) * startRadius,
	            initialSize: Math.random() * 3 + 2,
	            rotation: Math.random() * Math.PI * 2,
	            rotationSpeed: (Math.random() - 0.5) * 0.02,
	            sway: (Math.random() - 0.5) * 0.2,
	            swaySpeed: (Math.random() - 0.5) * 0.02
	          });
	        }
	      }
	      p.life -= 1;
	      if (p.life > 0) {
	        const alpha = Math.min(p.life / p.maxLife, 1);
	        for (let particle of p.particles) {
	          const heightRatio = particle.height / p.maxHeight;
	          const currentSpeed = particle.baseSpeed * Math.pow(1 - heightRatio, 3);
	          particle.angle += p.frequency * currentSpeed * p.timeSpeed * p.fpsFactor;
	          particle.radius += (Math.random() - 0.5) * 0.5;
	          particle.height += 1.5 * p.timeSpeed * p.fpsFactor;

	          // Add leaf-like movement
	          particle.rotation += particle.rotationSpeed;
	          if (particle.sway !== undefined) {
	            particle.startX += Math.sin(particle.height * particle.swaySpeed) * particle.sway;
	          }
	          if (particle.height > p.maxHeight) {
	            particle.height = 0;
	            const startAngle = Math.random() * Math.PI * 2;
	            const startRadius = Math.random() * 40 * p.size;
	            particle.startX = Math.cos(startAngle) * startRadius;
	            particle.startY = Math.sin(startAngle) * startRadius;
	            particle.angle = startAngle;
	            particle.initialSize = Math.random() * 3 + 2;
	            particle.rotation = Math.random() * Math.PI * 2;
	            particle.rotationSpeed = (Math.random() - 0.5) * 0.02;
	            particle.sway = (Math.random() - 0.5) * 0.2;
	            particle.swaySpeed = (Math.random() - 0.5) * 0.02;
	          }
	          const spiral = particle.height / p.maxHeight * p.amplitude;
	          const x = p.x + particle.startX + Math.cos(particle.angle) * spiral;
	          const y = p.y - particle.height + particle.startY;

	          // Calculate current size based on height and apply size limit
	          const currentSize = Math.min(particle.initialSize * (1 - heightRatio * 0.7) * p.size, Math.min(Math.ceil(p.size * 6), 10));

	          // Calculate gradient color based on height
	          const gradientFactor = heightRatio * 1; // 100% 上面白
	          const r = Math.min(255, p.baseColor.r + (255 - p.baseColor.r) * gradientFactor);
	          const g = Math.min(255, p.baseColor.g + (255 - p.baseColor.g) * gradientFactor);
	          const b = Math.min(255, p.baseColor.b + (255 - p.baseColor.b) * gradientFactor);

	          // Draw main particle with size reduction
	          ctx.save();
	          ctx.translate(x, y);
	          ctx.rotate(particle.rotation);
	          ctx.beginPath();
	          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
	          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
	          ctx.fill();

	          // Add glow effect with size reduction
	          ctx.beginPath();
	          ctx.arc(0, 0, currentSize * 1.5, 0, Math.PI * 2);
	          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha * 0.5})`;
	          ctx.fill();
	          ctx.restore();
	        }
	      }
	    }
	  },
	  "pixelSmoke": {
	    x: p => p.x + (Math.random() - 0.5) * 80,
	    y: p => p.y + (Math.random() - 0.5) * 80,
	    angle: p => (Math.random() - 0.5) * Math.PI / 5 * 2 - Math.PI / 2,
	    color: p => `hsl(0, 0%, ${Math.round(Math.random() * 65 + 10)}%)`,
	    size: p => (Math.random() * 40 + 10) * p.size,
	    speed: p => Math.random() * 0.5 * Math.sqrt(p.size),
	    gravity: p => -0.3 + Math.random() * 0.2 * p.size,
	    life: p => Math.floor((Math.random() * 700 + 100) * p.size),
	    draw: (ctx, p) => {
	      const alpha = Math.pow(p.life / p.maxLife, 0.2);
	      p.x += Math.cos(p.angle) * p.speed * 0.3;
	      p.speed *= 0.992;
	      p.y += -Math.sin(p.speed) * 0.5;
	      p.color = changeColorAlpha(p.color, alpha);
	      p.life -= 1;
	      if (p.life > 0) {
	        shapes.rectangle(ctx, p);
	      }
	    }
	  },
	  "shatter": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => (1 * Math.random() + 5) * p.size,
	    life: p => 500 * p.size,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.particles = [];
	        // Create particles in a circular pattern
	        const particleCount = Math.max(2, Math.min(0.1, Math.floor(p.size * 1))); // Scale particle count with size

	        // Define the main direction and spread
	        const mainAngle = Math.random() * Math.PI * 2; // Random main direction
	        const spreadAngle = Math.PI / 3; // 60 degree spread

	        for (let i = 0; i < particleCount; i++) {
	          // Calculate angle within the spread range
	          const angleProgress = i / (particleCount - 1);
	          const angleVariation = (Math.random() - 0.5) * 0.3; // Small random variation
	          const finalAngle = mainAngle - spreadAngle / 2 + spreadAngle * angleProgress + angleVariation;

	          // Create size variation
	          const sizeVariation = Math.random() * 0.8 + 0.6; // More consistent size
	          const baseSize = (Math.random() * 0.6 + 5) * p.size;

	          // Generate initial radius variations for each point
	          const points = Math.floor(Math.random() * 3) + 3;
	          const radiusVariations = Array.from({
	            length: points
	          }, () => 0.7 + Math.random() * 0.6);
	          p.particles.push({
	            x: p.x,
	            y: p.y,
	            angle: finalAngle,
	            speed: (Math.random() * 2 + 1) * Math.sqrt(p.size) * p.fpsFactor,
	            // Reduced initial speed
	            size: baseSize * sizeVariation,
	            initialSize: baseSize * sizeVariation,
	            life: 500 * p.size,
	            maxLife: 500 * p.size,
	            gravity: 0.05,
	            points: points,
	            shapeAngle: Math.floor(Math.random() * 6),
	            rotationSpeed: (Math.random() - 0.5) * 0.05,
	            // Add rotation speed
	            radiusVariations: radiusVariations,
	            verticalSpeed: 0 // Add vertical speed for better gravity effect
	          });
	        }
	      }
	      p.life -= 10 / p.fpsFactor;

	      // Update and draw particles
	      p.particles.forEach(particle => {
	        // Update vertical speed with gravity
	        particle.verticalSpeed += particle.gravity;

	        // Update position with both horizontal and vertical movement
	        particle.speed *= 0.98; // Slower deceleration
	        particle.x += Math.cos(particle.angle) * particle.speed;
	        particle.y += Math.sin(particle.angle) * particle.speed + particle.verticalSpeed;

	        // Update rotation
	        particle.shapeAngle += particle.rotationSpeed;
	        particle.life -= 10 / p.fpsFactor;
	        const lifeRatio = particle.life / particle.maxLife;
	        const opacity = Math.pow(lifeRatio, 0.5);
	        particle.size = particle.initialSize * Math.pow(lifeRatio, 0.5);
	        if (particle.life > 0) {
	          ctx.save();
	          ctx.translate(particle.x, particle.y);

	          // Draw irregular shape with stored radius variations
	          ctx.rotate(particle.shapeAngle);
	          ctx.beginPath();
	          for (let i = 0; i < particle.points; i++) {
	            const angle = i * 2 * Math.PI / particle.points - Math.PI / 2;
	            const radius = particle.size * particle.radiusVariations[i];
	            const x = Math.cos(angle) * radius;
	            const y = Math.sin(angle) * radius;
	            if (i === 0) {
	              ctx.moveTo(x, y);
	            } else {
	              ctx.lineTo(x, y);
	            }
	          }
	          ctx.closePath();
	          ctx.fillStyle = p.color.replace('0.2', opacity.toString());
	          ctx.fill();
	          ctx.restore();
	        }
	      });
	    }
	  },
	  "crescentSlash": {
	    x: p => p.x,
	    y: p => p.y,
	    size: p => 10 * p.size,
	    // Reduced base size
	    life: p => 1200 * p.size,
	    speed: p => (Math.random() * 10 + 4) * Math.sqrt(p.size) * 0.01,
	    angle: p => Math.random() * Math.PI * 2,
	    curveAmount: p => 5.3 * p.size * 2,
	    distance: p => 60 * p.size,
	    alpha: p => 1,
	    draw: (ctx, p) => {
	      if (!p.initialized) {
	        p.initialized = true;
	        p.trail = [];
	        p.fadeStartTime = 0;
	        p.isSlashing = true;
	        p.progress = 0;
	        p.speed = (Math.random() * 10 + 4) * Math.sqrt(p.size) * 0.01 * p.fpsFactor;
	        p.angle = Math.random() * Math.PI * 2;
	        p.curveAmount = 5.3 * p.size * 2;
	        p.distance = 60 * p.size;
	        p.totalPoints = Math.max(30, Math.min(100, Math.floor(p.distance / 2)));
	      }
	      p.life -= 3 / p.fpsFactor;
	      const alpha = Math.pow(Math.min(1, p.life / p.maxLife), 0.5);
	      if (p.life > 0) {
	        if (p.isSlashing) {
	          p.progress = Math.min(1, p.progress + p.speed);
	          p.trail = [];
	          const currentPoints = Math.floor(p.totalPoints * p.progress);
	          for (let i = 0; i < currentPoints; i++) {
	            const progress = i / p.totalPoints - 0.5;
	            const distance = progress * p.distance;

	            // Calculate base position
	            let x = Math.cos(p.angle) * distance;
	            let y = Math.sin(p.angle) * distance;

	            // Add crescent curve
	            const curveOffset = Math.sin((progress + 0.5) * Math.PI) * p.curveAmount;
	            x += Math.cos(p.angle + Math.PI / 2) * curveOffset;
	            y += Math.sin(p.angle + Math.PI / 2) * curveOffset;
	            let size = p.size * 1.2; // Reduced multiplier
	            if (progress < -0.2) {
	              size = p.size * (0.3 + (progress + 0.5) * 3); // Reduced size scaling
	            } else if (progress > 0.2) {
	              size = p.size * (1.2 - (progress - 0.2) * 3); // Reduced size scaling
	            }
	            p.trail.push({
	              x: x,
	              y: y,
	              size: size,
	              alpha: 1,
	              age: 0
	            });
	          }
	          if (p.progress >= 1) {
	            p.isSlashing = false;
	            p.fadeStartTime = Date.now();
	          }
	        }
	        ctx.save();
	        ctx.translate(p.x, p.y);
	        for (let i = 0; i < p.trail.length; i++) {
	          const point = p.trail[i];
	          let pointAlpha;
	          if (p.isSlashing) {
	            pointAlpha = Math.exp(-point.age / 150) * alpha;
	            point.age += 0.5;
	          } else {
	            const timeSinceFade = Date.now() - p.fadeStartTime;
	            const fadeProgress = timeSinceFade / 1000;
	            pointAlpha = Math.exp(-fadeProgress * 2) * alpha;
	          }
	          ctx.beginPath();
	          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
	          ctx.fillStyle = changeColorAlpha(p.color, pointAlpha);
	          ctx.fill();
	          if (p.isSlashing && point.age >= 200 || !p.isSlashing && Date.now() - p.fadeStartTime >= 1000) {
	            p.trail.splice(i, 1);
	            i--;
	          }
	        }
	        ctx.restore();
	      }
	    }
	  }
	};

	/*
	特效编写请查阅
	https://docs.qq.com/doc/DS0JjVHp3S09td2NV
	*/

	const projectileEffectsMap = {
	  'fireball': {
	    speedFactor: 1,
	    trailLength: 35,
	    shake: true,
	    onHit: {
	      "smoke": size => Math.min(Math.ceil(size * 4), 8),
	      "ember": size => Math.min(Math.ceil(size * 10), 40),
	      "shockwave": size => Math.min(Math.ceil(size), 4),
	      "smallParticle": size => Math.min(Math.ceil(size * 4), 10)
	    },
	    onCrit: {
	      "star": size => Math.min(Math.ceil(size * 10), 20)
	    },
	    draw: (ctx, p) => {
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();
	    },
	    glow: (ctx, p) => {
	      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
	      gradient.addColorStop(0, `${p.color}`);
	      gradient.addColorStop(1, `${p.color}`);
	      ctx.fillStyle = gradient;
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
	      ctx.fillStyle = changeColorAlpha(p.color, alpha);
	      ctx.fill();
	    }
	  },
	  'nature': {
	    speedFactor: 1,
	    gravity: 0.1,
	    trailLength: 60,
	    shake: true,
	    onHit: {
	      "leaf": size => Math.min(Math.ceil(size * 30), 32)
	    },
	    draw: (ctx, p) => {
	      const size = p.size * 3;
	      p.rotation = Math.atan2(p.velocity.y, p.velocity.x) - Math.PI / 2;
	      ctx.save();
	      ctx.translate(p.x, p.y);
	      ctx.rotate(p.rotation);
	      ctx.scale(p.scale, 1);
	      ctx.beginPath();
	      ctx.moveTo(0, -size);
	      ctx.bezierCurveTo(size / 2, -size / 2, size / 2, 0, 0, size);
	      ctx.bezierCurveTo(-size / 2, 0, -size / 2, -size / 2, 0, -size);
	      ctx.fillStyle = p.color;
	      ctx.fill();
	      ctx.restore();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      p.x = p.x + (Math.random() - 0.5) * 5;
	      p.y = p.y - (Math.random() - 0.5) * 1 + 0.02;
	      ctx.beginPath();
	      const lineWidth = p.size * Math.sqrt(alpha);
	      ctx.strokeStyle = `${changeColorAlpha(p.color, alpha)}`;
	      ctx.lineWidth = lineWidth;
	      ctx.moveTo(p.x, p.y);
	      ctx.lineTo(p.x + (Math.random() - 0.5) * 20, p.y + (Math.random() - 0.5) * 20);
	      ctx.stroke();
	      ctx.fill();
	    }
	  },
	  'slash': {
	    speedFactor: 2,
	    gravity: -0.2,
	    trailLength: 30,
	    shake: true,
	    onHit: {
	      "crescentSlash": size => Math.min(Math.ceil(size * 4), 8),
	      "slashParticle": size => Math.min(Math.ceil(size * 8), 20)
	    }
	    // draw: (ctx, p) => {
	    //     ctx.beginPath();
	    //     ctx.moveTo(p.x, p.y + p.size * 2);
	    //     ctx.lineTo(p.x - p.size * 2, p.y - p.size * 2);
	    //     ctx.lineTo(p.x + p.size * 2, p.y - p.size * 2);
	    //     ctx.closePath();
	    //     ctx.fillStyle = p.color;
	    //     ctx.fill();
	    // }
	  },
	  'water': {
	    speedFactor: 1.2,
	    trailLength: 60,
	    shake: true,
	    onHit: {
	      "waterRipple": size => Math.min(Math.ceil(size * 8), 12),
	      "waterSplash": size => Math.min(Math.ceil(size * 8), 20)
	    },
	    draw: (ctx, p) => {
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      p.x = p.x + (Math.random() - 0.5) * 5;
	      p.y = p.y - (Math.random() - 0.5) * 1;
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
	      ctx.fillStyle = changeColorAlpha(p.color, alpha);
	      ctx.fill();
	    }
	  },
	  'heal': {
	    trailLength: 60,
	    shake: false,
	    color: 'rgba(93, 212, 93, 0.8)',
	    onHit: {
	      "holyCross": size => Math.min(Math.ceil(size * 12), 10)
	    },
	    draw: (ctx, p) => {
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();
	    }
	  },
	  'range': {
	    speedFactor: 1.5,
	    gravity: 0.15,
	    trailLength: 30,
	    shake: true,
	    onHit: {
	      "shockwave": size => Math.min(Math.ceil(size), 4),
	      "slashParticle": size => Math.min(Math.ceil(size * 8), 20)
	    },
	    draw: (ctx, p) => {
	      const length = p.size * 6.65;
	      const width = p.size * 0.47;
	      const arrowHeadLength = p.size * 1.33;
	      const arrowHeadWidth = p.size * 0.80;
	      const fletchingLength = p.size * 2.13;
	      const fletchingWidth = p.size * 1.33;
	      ctx.save();
	      ctx.translate(p.x, p.y);
	      ctx.rotate(Math.atan2(p.velocity.y, p.velocity.x));

	      // Draw arrow shaft
	      ctx.beginPath();
	      ctx.moveTo(-length / 2, -width / 2);
	      ctx.lineTo(length / 2 - arrowHeadLength, -width / 2);
	      ctx.lineTo(length / 2 - arrowHeadLength, width / 2);
	      ctx.lineTo(-length / 2, width / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Draw arrow head
	      ctx.beginPath();
	      ctx.moveTo(length / 3 - arrowHeadLength, -arrowHeadWidth / 2);
	      ctx.lineTo(length / 2, 0);
	      ctx.lineTo(length / 3 - arrowHeadLength, arrowHeadWidth / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Draw fletchings 
	      ctx.beginPath();
	      ctx.moveTo(-length / 2, -width / 2);
	      ctx.lineTo(-length / 2 - fletchingLength, -fletchingWidth / 2);
	      ctx.lineTo(-length / 2 - fletchingLength * 0.5, 0);
	      ctx.lineTo(-length / 2 - fletchingLength, fletchingWidth / 2);
	      ctx.lineTo(-length / 2, width / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();
	      ctx.restore();
	    },
	    trail: (ctx, p, i) => {
	      // Only show trail after the arrow has traveled some distance
	      const startDelay = 5; // Number of frames to wait before showing trail
	      if (i < startDelay) return;
	      const trailLength = p.size * 20;
	      const trailWidth = p.size * 0.27;
	      ctx.save();
	      ctx.translate(p.x, p.y);
	      ctx.rotate(Math.atan2(p.vY, p.vX));

	      // Draw simple line trail behind the arrow
	      ctx.beginPath();
	      ctx.moveTo(-trailLength / 2, -trailWidth / 2);
	      ctx.lineTo(0, -trailWidth / 2); // Only draw up to the arrow's position
	      ctx.lineTo(0, trailWidth / 2);
	      ctx.lineTo(-trailLength / 2, trailWidth / 2);
	      ctx.closePath();
	      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Fixed low opacity white
	      ctx.fill();
	      ctx.restore();
	    }
	  },
	  'selfHeal': {
	    speedFactor: 10,
	    trailLength: 0,
	    gravity: 0,
	    shake: false,
	    color: 'rgba(93, 212, 93, 0.5)',
	    onHit: {
	      "holyCross": size => Math.min(Math.ceil(size * 12), 10)
	    },
	    draw: (ctx, p) => {}
	  },
	  'selfManaRegen': {
	    speedFactor: 10,
	    trailLength: 0,
	    gravity: 0,
	    shake: false,
	    color: 'rgba(68, 120, 241, 0.8)',
	    onHit: {
	      "holyCross": size => Math.min(Math.ceil(size * 12), 10)
	    },
	    draw: (ctx, p) => {}
	  },
	  'debug': {
	    speedFactor: 2,
	    trailLength: 3,
	    shake: true,
	    onHit: {
	      "magnet": size => Math.min(Math.ceil(size * 3), 6)
	    },
	    draw: (ctx, p) => {
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();
	    }
	  },
	  'lavaPlume': {
	    speedFactor: 0.8,
	    trailLength: 40,
	    gravity: 0.1,
	    shake: true,
	    onHit: {
	      "lava": size => Math.min(Math.ceil(size * 20), 20),
	      "smallParticle": size => Math.min(Math.ceil(size * 10), 60)
	    },
	    draw: (ctx, p) => {
	      // Draw main projectile
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Create inner glow gradient
	      const innerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
	      innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
	      innerGlow.addColorStop(0.5, p.color);
	      innerGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
	      ctx.fillStyle = innerGlow;
	      ctx.fill();
	    },
	    glow: (ctx, p) => {
	      // Create outer glow gradient
	      const outerGlow = ctx.createRadialGradient(p.x, p.y, p.size * 1.5, p.x, p.y, p.size * 4);
	      outerGlow.addColorStop(0, p.color);
	      // outerGlow.addColorStop(0.5, 'rgba(250, 178, 24, 0.2)');
	      outerGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
	      ctx.fillStyle = outerGlow;
	      ctx.fill();

	      // Add pulsing effect
	      const pulseSize = p.size * (3 + Math.sin(Date.now() * 0.01) * 0.5);
	      const pulseGlow = ctx.createRadialGradient(p.x, p.y, p.size * 2, p.x, p.y, pulseSize);
	      pulseGlow.addColorStop(0, changeColorAlpha(p.color, 0.1));
	      pulseGlow.addColorStop(1, 'rgba(255, 100, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
	      ctx.fillStyle = pulseGlow;
	      ctx.fill();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      const trailSize = p.size * alpha;

	      // Create glowing trail gradient
	      // const trailGlow = ctx.createRadialGradient(
	      //     p.x, p.y, 0,
	      //     p.x, p.y, trailSize * 2
	      // );
	      // trailGlow.addColorStop(0, changeColorAlpha(p.color, alpha));
	      // trailGlow.addColorStop(1, changeColorAlpha(p.color, 0));

	      ctx.beginPath();
	      ctx.arc(p.x, p.y, trailSize * 2, 0, Math.PI * 2);
	      ctx.fillStyle = changeColorAlpha(p.color, alpha);
	      ctx.fill();
	    }
	  },
	  'iceBlast': {
	    speedFactor: 1.3,
	    trailLength: 35,
	    shake: true,
	    onHit: {
	      "ice": size => Math.min(Math.ceil(size * 30), 40)
	    },
	    draw: (ctx, p) => {
	      const length = p.size * 6.65;
	      const arrowHeadLength = p.size * 3;
	      const arrowHeadWidth = p.size * 2;

	      // Draw main projectile
	      ctx.save();
	      ctx.translate(p.x, p.y);
	      ctx.rotate(Math.atan2(p.velocity.y, p.velocity.x));

	      // Draw arrow head
	      ctx.beginPath();
	      ctx.moveTo(length / 3 - arrowHeadLength, -arrowHeadWidth / 2);
	      ctx.lineTo(length / 2, 0);
	      ctx.lineTo(length / 3 - arrowHeadLength, arrowHeadWidth / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();
	      ctx.restore();
	    },
	    glow: (ctx, p) => {
	      // Create outer glow gradient
	      const outerGlow = ctx.createRadialGradient(p.x, p.y, p.size * 1.5, p.x, p.y, p.size * 4);
	      outerGlow.addColorStop(0, 'rgba(200, 230, 255, 0.3)');
	      outerGlow.addColorStop(0.5, 'rgba(150, 200, 255, 0.2)');
	      outerGlow.addColorStop(1, 'rgba(100, 150, 255, 0)');
	      const length = p.size * 6.65;
	      const arrowHeadLength = p.size * 3;
	      const arrowHeadWidth = p.size * 2;
	      ctx.beginPath();
	      ctx.moveTo(length / 3 - arrowHeadLength, -arrowHeadWidth / 2);
	      ctx.lineTo(length / 2, 0);
	      ctx.lineTo(length / 3 - arrowHeadLength, arrowHeadWidth / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      const trailSize = p.size * (1 + Math.sin(Date.now() * 0.01) * 0.2);

	      // Create glowing trail gradient
	      const trailGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, trailSize * 2);
	      trailGlow.addColorStop(0, changeColorAlpha(p.color, alpha));
	      trailGlow.addColorStop(1, `rgba(150, 200, 255, 0)`);
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, trailSize, 0, Math.PI * 2);
	      ctx.fillStyle = trailGlow;
	      ctx.fill();
	    }
	  },
	  'poisonDust': {
	    speedFactor: 1,
	    trailLength: 35,
	    shake: true,
	    onHit: {
	      "poison": size => Math.min(Math.ceil(size * 8), 12)
	    },
	    draw: (ctx, p) => {
	      // Draw main projectile
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Create inner glow gradient
	      const innerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
	      innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
	      innerGlow.addColorStop(0.5, changeColorAlpha(p.color, 0.5));
	      innerGlow.addColorStop(1, 'rgba(50, 200, 50, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
	      ctx.fillStyle = innerGlow;
	      ctx.fill();
	    },
	    glow: (ctx, p) => {
	      // Create outer glow gradient
	      const outerGlow = ctx.createRadialGradient(p.x, p.y, p.size * 1.5, p.x, p.y, p.size * 4);
	      outerGlow.addColorStop(0, changeColorAlpha(p.color, 0.5));
	      // outerGlow.addColorStop(0.5, 'rgba(50, 200, 50, 0.2)');
	      outerGlow.addColorStop(1, 'rgba(0, 150, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
	      ctx.fillStyle = outerGlow;
	      ctx.fill();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      p.x = p.x + (Math.random() - 0.5) * 5;
	      p.y = p.y - (Math.random() - 0.5) * 1 + 0.02;
	      ctx.beginPath();
	      const lineWidth = p.size * Math.sqrt(alpha);
	      ctx.strokeStyle = `${changeColorAlpha(p.color, alpha)}`;
	      ctx.lineWidth = lineWidth;
	      ctx.moveTo(p.x, p.y);
	      ctx.lineTo(p.x + (Math.random() - 0.5) * 20, p.y + (Math.random() - 0.5) * 20);
	      ctx.stroke();
	      ctx.fill();
	    }
	  },
	  'thrust': {
	    speedFactor: 3,
	    gravity: -0.001,
	    trailLength: 0,
	    shake: true,
	    onHit: {
	      "smallParticle": size => Math.min(Math.ceil(size * 4), 10),
	      "pierce": size => Math.min(Math.ceil(size * 4), 6),
	      "shockwave": size => Math.min(Math.ceil(size * 2), 6)
	    },
	    draw: (ctx, p) => {
	      const shaftLength = p.size * 12; // Longer shaft
	      const shaftWidth = p.size * 0.8; // Thicker shaft
	      const tipLength = p.size * 3; // Length of the pointed tip
	      const tipWidth = p.size * 1.2; // Width at the base of the tip

	      ctx.save();
	      ctx.translate(p.x, p.y);
	      ctx.rotate(Math.atan2(p.velocity.y, p.velocity.x));

	      // Draw shaft
	      ctx.beginPath();
	      ctx.moveTo(-shaftLength / 2, -shaftWidth / 2);
	      ctx.lineTo(shaftLength / 2 - tipLength, -shaftWidth / 2);
	      ctx.lineTo(shaftLength / 2 - tipLength, shaftWidth / 2);
	      ctx.lineTo(-shaftLength / 2, shaftWidth / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Draw tip
	      ctx.beginPath();
	      ctx.moveTo(shaftLength / 2 - tipLength, -tipWidth / 2);
	      ctx.lineTo(shaftLength / 2, 0);
	      ctx.lineTo(shaftLength / 2 - tipLength, tipWidth / 2);
	      ctx.closePath();
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Add highlight to shaft
	      ctx.beginPath();
	      ctx.moveTo(-shaftLength / 2, -shaftWidth / 2);
	      ctx.lineTo(shaftLength / 2 - tipLength, -shaftWidth / 2);
	      ctx.lineTo(shaftLength / 2 - tipLength, 0);
	      ctx.lineTo(-shaftLength / 2, 0);
	      ctx.closePath();
	      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
	      ctx.fill();

	      // Add highlight to tip
	      ctx.beginPath();
	      ctx.moveTo(shaftLength / 2 - tipLength, -tipWidth / 2);
	      ctx.lineTo(shaftLength / 2, 0);
	      ctx.lineTo(shaftLength / 2 - tipLength, 0);
	      ctx.closePath();
	      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	      ctx.fill();
	      ctx.restore();
	    }
	  },
	  'fireTornado': {
	    speedFactor: 1,
	    trailLength: 40,
	    shake: true,
	    onHit: {
	      "smoke": size => Math.min(Math.ceil(size * 10), 10),
	      "tornado": size => Math.min(Math.ceil(size * 5), 8)
	    },
	    draw: (ctx, p) => {
	      // Draw main projectile
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
	      ctx.fillStyle = p.color;
	      ctx.fill();

	      // Create inner glow gradient
	      const innerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.5);
	      innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
	      innerGlow.addColorStop(0.5, p.color);
	      innerGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
	      ctx.fillStyle = innerGlow;
	      ctx.fill();
	    },
	    glow: (ctx, p) => {
	      // Create outer glow gradient
	      const outerGlow = ctx.createRadialGradient(p.x, p.y, p.size * 1.5, p.x, p.y, p.size * 3);
	      outerGlow.addColorStop(0, p.color);
	      // outerGlow.addColorStop(0.5, 'rgba(250, 178, 24, 0.2)');
	      outerGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
	      ctx.fillStyle = outerGlow;
	      ctx.fill();

	      // Add pulsing effect
	      const pulseSize = p.size * (3 + Math.sin(Date.now() * 0.01) * 0.5);
	      const pulseGlow = ctx.createRadialGradient(p.x, p.y, p.size * 2, p.x, p.y, pulseSize);
	      pulseGlow.addColorStop(0, changeColorAlpha(p.color, 0.1));
	      pulseGlow.addColorStop(1, 'rgba(255, 100, 0, 0)');
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
	      ctx.fillStyle = pulseGlow;
	      ctx.fill();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      const trailSize = p.size * alpha;

	      // Create glowing trail gradient
	      // const trailGlow = ctx.createRadialGradient(
	      //     p.x, p.y, 0,
	      //     p.x, p.y, trailSize * 2
	      // );
	      // trailGlow.addColorStop(0, changeColorAlpha(p.color, alpha));
	      // trailGlow.addColorStop(1, changeColorAlpha(p.color, 0));

	      ctx.beginPath();
	      ctx.arc(p.x, p.y, trailSize * 2, 0, Math.PI * 2);
	      ctx.fillStyle = changeColorAlpha(p.color, alpha);
	      ctx.fill();
	    }
	  },
	  'blunt': {
	    speedFactor: 3,
	    gravity: -0.1,
	    trailLength: 20,
	    shake: true,
	    onHit: {
	      "shatter": size => Math.min(Math.ceil(size * 5), 10),
	      "shockwave": size => Math.min(Math.ceil(size * 2), 6)
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      const trailSize = p.size * alpha;

	      // Create glowing trail gradient
	      // const trailGlow = ctx.createRadialGradient(
	      //     p.x, p.y, 0,
	      //     p.x, p.y, trailSize * 2
	      // );
	      // trailGlow.addColorStop(0, changeColorAlpha(p.color, alpha));
	      // trailGlow.addColorStop(1, changeColorAlpha(p.color, 0));

	      ctx.beginPath();
	      ctx.arc(p.x, p.y, trailSize * 2, 0, Math.PI * 2);
	      ctx.fillStyle = changeColorAlpha(p.color, alpha);
	      ctx.fill();
	    }
	  },
	  'magneteer': {
	    speedFactor: 0.8,
	    trailLength: 40,
	    gravity: -0.001,
	    shake: true,
	    onHit: {
	      "magnet": size => Math.min(Math.ceil(size * 2), 6),
	      "shockwave": size => Math.min(Math.ceil(size), 2)
	    },
	    draw: (ctx, p) => {
	      ctx.save();
	      ctx.translate(p.x, p.y);
	      // Combine direction and continuous spin
	      const direction = Math.atan2(p.velocity.y, p.velocity.x);
	      const spin = p.life * 0.05 % (Math.PI * 2); // Slower continuous spin
	      ctx.rotate(direction + spin);

	      // Use the magnet shape from shape.js
	      shapes.magnet(ctx, {
	        x: 0,
	        y: 0,
	        size: p.size * 2,
	        angle: 0
	      });
	      ctx.restore();
	    },
	    trail: (ctx, p, i) => {
	      const alpha = Math.min(i / p.totalLength, 1);
	      p.x = p.x + (Math.random() - 0.5) * 5;
	      p.y = p.y - (Math.random() - 0.5) * 1 + 0.02;
	      ctx.beginPath();
	      const lineWidth = p.size * Math.sqrt(alpha);
	      ctx.strokeStyle = `${changeColorAlpha(p.color, alpha)}`;
	      ctx.lineWidth = lineWidth;
	      ctx.moveTo(p.x, p.y);
	      ctx.lineTo(p.x + (Math.random() - 0.5) * 20, p.y + (Math.random() - 0.5) * 20);
	      ctx.stroke();
	      ctx.fill();
	    }
	  }
	};

	const abilityEffectsMap = {
	  'autoAttack': 'slash',
	  'default': 'fireball',
	  'heal': 'heal',
	  '/abilities/fireball': "fireball",
	  '/abilities/firestorm': "fireTornado",
	  '/abilities/flame_blast': "lavaPlume",
	  '/abilities/smoke_burst': "fireball",
	  '/abilities/aqua_arrow': "water",
	  '/abilities/frost_surge': "iceBlast",
	  '/abilities/ice_spear': "iceBlast",
	  '/abilities/mana_spring': "water",
	  '/abilities/water_strike': "water",
	  '/abilities/entangle': "nature",
	  '/abilities/natures_veil': "nature",
	  '/abilities/toxic_pollen': "poisonDust",
	  '/abilities/penetrating_shot': "range",
	  '/abilities/pestilent_shot': "range",
	  '/abilities/steady_shot': "range",
	  '/abilities/quick_shot': "range",
	  '/abilities/rain_of_arrows': "range",
	  '/abilities/silencing_shot': "range",
	  '/abilities/crippling_slash': "slash",
	  '/abilities/penetrating_strike': "slash",
	  '/abilities/impale': "thrust",
	  '/abilities/maim': "slash",
	  '/abilities/poke': "thrust",
	  '/abilities/puncture': "thrust",
	  '/abilities/scratch': "slash",
	  '/abilities/smack': "blunt",
	  '/abilities/sweep': "blunt",
	  '/abilities/stunning_blow': "blunt",
	  '/abilities/fracturing_impact': "blunt",
	  '/abilities/shield_bash': "blunt"
	};

	let activeEffects = [];
	function addEffect({
	  effects,
	  active = true,
	  lifespan = 120,
	  color = "rgba(255, 255, 255, 0.8)",
	  otherInfo = {},
	  isFpsOptimized = false
	}) {
	  activeEffects.push({
	    effects,
	    active,
	    life: 0,
	    lifespan,
	    color,
	    otherInfo,
	    isFpsOptimized
	  });
	}
	function clearEffects() {
	  activeEffects.splice(0, activeEffects.length);
	}

	function applyShakeEffect(element, intensity = 1, duration = 500) {
	  if (!element) return;

	  // Store the element's original position/transform
	  const originalTransform = element.style.transform || '';
	  const originalTransition = element.style.transition || '';
	  intensity *= settingsMap.shakeEffectScale.value || 1;

	  // Scale intensity based on size/damage
	  const scaledIntensity = Math.min(10, intensity);

	  // Apply CSS animation
	  element.style.transition = 'transform 50ms ease-in-out';
	  let shakeCount = 0;
	  const maxShakes = Math.ceil(intensity);
	  const shakeInterval = 50;
	  const interval = setInterval(() => {
	    if (shakeCount >= maxShakes) {
	      // Ensure element returns to original position
	      clearInterval(interval);
	      element.style.transform = originalTransform;
	      element.style.transition = originalTransition;
	      return;
	    }

	    // Random offset for shaking effect
	    const xOffset = (Math.random() - 0.5) * 2 * scaledIntensity;
	    const yOffset = (Math.random() - 0.5) * 2 * scaledIntensity;
	    element.style.transform = `${originalTransform} translate(${xOffset}px, ${yOffset}px)`;
	    shakeCount++;
	  }, shakeInterval);

	  // Additional safeguard: ensure element returns to original position after max duration
	  setTimeout(() => {
	    clearInterval(interval);
	    element.style.transform = 'translate(0, 0)';
	    element.style.transition = originalTransition;
	  }, shakeInterval * (maxShakes + 1)); // Slightly longer than maxShakes * interval time
	}
	function addDamageHPBar(element, damage) {
	  const hpBarContainer = element.querySelector(".HitpointsBar_hitpointsBar__2vIqC");
	  const hpBarFront = hpBarContainer.querySelector(".HitpointsBar_currentHp__5exLr");
	  // hpBarFront.style.zIndex = "1";
	  const hpBarValue = hpBarContainer.querySelector(".HitpointsBar_hpValue__xNp7m");
	  // hpBarValue.style.zIndex = "2";
	  const hpStat = hpBarValue.innerHTML.split("/");
	  const currentHp = parseInt(hpStat[0]);
	  const maxHp = parseInt(hpStat[1]);

	  // Insert a HpBar behind and set the color to red
	  const hpBarBack = document.createElement("div");
	  hpBarBack.className = "HitpointsBar_currentHp__5exLr HitTracker_hpDrop";
	  hpBarBack.style.background = "var(--color-warning)";
	  hpBarBack.style.position = "absolute";
	  hpBarBack.style.top = "0px";
	  hpBarBack.style.left = "0px";
	  // hpBarBack.style.zIndex = "1"; // Ensure the back bar is below the front bar
	  hpBarBack.style.width = `${hpBarFront.offsetWidth}px`;
	  hpBarBack.style.height = `${hpBarFront.offsetHeight}px`;
	  hpBarBack.style.transformOrigin = "left center";
	  hpBarBack.style.transform = `scaleX(${(currentHp + damage) / maxHp})`;
	  // add animation to drop down
	  hpBarBack.style.transition = "transform 0.5s ease-in-out";
	  hpBarFront.parentNode.insertBefore(hpBarBack, hpBarFront); // Insert the back bar before the front bar

	  const dropDelay = Math.ceil(settingsMap.damageHpBarDropDelay.value || 300);
	  setTimeout(() => {
	    hpBarBack.style.transform = `scaleX(0)`;
	  }, dropDelay);
	  setTimeout(() => {
	    hpBarBack.remove();
	  }, dropDelay + 500);
	}
	function resetAllMonsterSvg() {
	  const monsterArea = document.querySelector(".BattlePanel_monstersArea__2dzrY");
	  if (monsterArea) {
	    const monsterSvgs = monsterArea.querySelectorAll(".Icon_icon__2LtL_");
	    monsterSvgs.forEach(monsterSvg => {
	      monsterSvg.style.transition = "none";
	      monsterSvg.style.transform = "rotate(0deg)";
	      monsterSvg.style.opacity = "1";
	    });
	  }
	}
	const deathEffect = {
	  default: element => {
	    const monsterSvg = element.querySelector(".Icon_icon__2LtL_");
	    monsterSvg.style.transition = "transform 0.1s ease-in-out";
	    monsterSvg.style.transformOrigin = "bottom center";
	    monsterSvg.style.transform = "rotate(15deg)";
	    setTimeout(() => {
	      monsterSvg.style.transition = "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
	      monsterSvg.style.transform = "rotate(-180deg)";
	      monsterSvg.style.opacity = "0";
	    }, 300);
	    // fade out
	    // setTimeout(() => {
	    //     monsterSvg.style.transition = "opacity 0.5s ease-in-out";
	    // }, 800);
	  },
	  minecraftStyle: element => {
	    const monsterSvg = element.querySelector(".Icon_icon__2LtL_");

	    // First get dimensions and viewBox of original SVG
	    const svgRect = monsterSvg.getBoundingClientRect();
	    const viewBox = monsterSvg.getAttribute('viewBox') || '0 0 24 24'; // 默认值，以防未设置

	    // Get SVG content before changing anything else
	    const svgContent = monsterSvg.innerHTML;

	    // Create container that will match exact position of original SVG
	    const overlayContainer = document.createElement('div');
	    overlayContainer.style.position = 'absolute';
	    overlayContainer.style.top = '0';
	    overlayContainer.style.left = '0';
	    overlayContainer.style.width = '100%';
	    overlayContainer.style.height = '100%';
	    overlayContainer.style.pointerEvents = 'none';
	    // overlayContainer.style.zIndex = '5';

	    // Match the exact positioning and sizing of the original SVG
	    const parentBounds = element.getBoundingClientRect();
	    const relativeTop = (svgRect.top - parentBounds.top) / parentBounds.height * 100;
	    const relativeLeft = (svgRect.left - parentBounds.left) / parentBounds.width * 100;
	    const relativeWidth = svgRect.width / parentBounds.width * 100;
	    const relativeHeight = svgRect.height / parentBounds.height * 100;

	    // Create SVG overlay with the same dimensions and position
	    const svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	    svgOverlay.setAttribute('width', '100%');
	    svgOverlay.setAttribute('height', '100%');
	    svgOverlay.setAttribute('viewBox', viewBox);
	    svgOverlay.style.position = 'absolute';
	    svgOverlay.style.top = `${relativeTop}%`;
	    svgOverlay.style.left = `${relativeLeft}%`;
	    svgOverlay.style.width = `${relativeWidth}%`;
	    svgOverlay.style.height = `${relativeHeight}%`;
	    setTimeout(() => {
	      // Apply rotation to original SVG
	      monsterSvg.style.transition = "transform 0.1s ease-in-out";
	      monsterSvg.style.transformOrigin = "center left";
	      monsterSvg.style.transform = "rotate(15deg)";
	      // Apply same transform as original to maintain alignment
	      svgOverlay.style.transition = "transform 0.1s ease-in-out";
	      svgOverlay.style.transform = "rotate(15deg)";
	      svgOverlay.style.transformOrigin = "center left";
	    }, 300);

	    // Create defs for the mask
	    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
	    mask.setAttribute('id', `monster-mask-${Date.now()}`); // Unique ID

	    // Clone the original SVG content for the mask
	    const maskContent = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	    maskContent.innerHTML = svgContent;

	    // Set all elements in mask to white (opaque parts of mask)
	    const maskElements = maskContent.querySelectorAll('*');
	    maskElements.forEach(el => {
	      if (el.tagName === 'path' || el.tagName === 'circle' || el.tagName === 'rect' || el.tagName === 'polygon' || el.tagName === 'polyline') {
	        el.setAttribute('fill', 'white');
	        el.setAttribute('stroke', 'white');
	      }
	    });
	    mask.appendChild(maskContent);
	    defs.appendChild(mask);
	    svgOverlay.appendChild(defs);

	    // Create the red overlay rectangle that will be masked
	    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	    rect.setAttribute('width', '100%');
	    rect.setAttribute('height', '100%');
	    rect.setAttribute('fill', 'rgba(255, 0, 0, 0.6)'); // slightly more opaque
	    rect.setAttribute('mask', `url(#${mask.id})`);
	    svgOverlay.appendChild(rect);
	    overlayContainer.appendChild(svgOverlay);

	    // Add to parent element (usually the monster container)
	    element.style.position = 'relative'; // Ensure positioning context
	    element.appendChild(overlayContainer);
	    const svgCenter = getElementCenter(element);

	    // Make overlay match any subsequent animations of the original SVG
	    const observer = new MutationObserver(mutations => {
	      mutations.forEach(mutation => {
	        if (mutation.attributeName === 'style' || mutation.attributeName === 'transform') {
	          // Copy transform properties to keep in sync
	          svgOverlay.style.transform = monsterSvg.style.transform;
	          svgOverlay.style.opacity = monsterSvg.style.opacity;
	          svgOverlay.style.transition = monsterSvg.style.transition;
	        }
	      });
	    });

	    // Start observing the original SVG for changes
	    observer.observe(monsterSvg, {
	      attributes: true,
	      attributeFilter: ['style', 'transform']
	    });

	    // Fade out after delay
	    setTimeout(() => {
	      // monsterSvg.style.transition = "opacity 0.5s ease-in-out";
	      monsterSvg.style.opacity = "0";

	      // Remove overlay and stop observer after animation
	      observer.disconnect();
	      overlayContainer.remove();
	      let effects = [];
	      const p = {
	        x: svgCenter.x,
	        y: svgCenter.y + 30,
	        color: "rgba(0, 0, 0, 0.6)",
	        size: 0.2
	      };
	      for (let i = 0; i < 25; i++) {
	        p.life = onHitEffectsMap.pixelSmoke.life({
	          size: 0.5
	        });
	        effects.push({
	          x: onHitEffectsMap.pixelSmoke.x(p),
	          y: onHitEffectsMap.pixelSmoke.y(p),
	          angle: onHitEffectsMap.pixelSmoke.angle(p),
	          color: onHitEffectsMap.pixelSmoke.color(p),
	          size: onHitEffectsMap.pixelSmoke.size(p),
	          speed: onHitEffectsMap.pixelSmoke.speed({
	            size: 5
	          }),
	          gravity: onHitEffectsMap.pixelSmoke.gravity(p),
	          life: p.life,
	          maxLife: p.life,
	          draw: onHitEffectsMap.pixelSmoke.draw
	        });
	      }

	      // Add particle effect
	      addEffect({
	        effects: effects,
	        active: true,
	        lifespan: 500
	      });
	    }, 1000);
	  }
	};

	const canvas = initTrackerCanvas();
	const ctx = canvas.getContext('2d');
	function initTrackerCanvas() {
	  const gamePanel = document.querySelector("body");
	  const canvas = document.createElement('canvas');
	  canvas.id = 'hitTrackerCanvas';
	  canvas.style.position = 'fixed';
	  canvas.style.top = '0';
	  canvas.style.left = '0';
	  canvas.style.pointerEvents = 'none';
	  canvas.style.zIndex = '200';
	  canvas.style.width = '100%';
	  canvas.style.height = '100%';
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  canvas.pointerEvents = 'none';
	  gamePanel.appendChild(canvas);
	  window.addEventListener('resize', () => {
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	  });
	  return canvas;
	}

	// Update shake animation effect to ensure element returns to original position
	let fpsStatTime = new Date().getTime();
	let fpsQueue = [];
	let fps = 60;

	// 动画循环
	function animate() {
	  // 计算FPS
	  const now = Date.now();
	  const frameTime = now - fpsStatTime;
	  fpsStatTime = now;
	  const fpsNow = Math.round(1000 / frameTime);
	  fpsQueue.push(fpsNow);
	  if (fpsQueue.length > 120) {
	    fpsQueue.shift();
	  }
	  fps = Math.round(fpsQueue.reduce((a, b) => a + b) / fpsQueue.length);
	  fps = Math.min(Math.max(fps, 10), 300);

	  // 完全清空画布
	  ctx.clearRect(0, 0, canvas.width, canvas.height);

	  // 更新并绘制所有弹丸
	  for (let i = projectiles.length - 1; i >= 0; i--) {
	    const proj = projectiles[i];
	    proj.update();
	    proj.draw(ctx);
	    if (proj.isArrived()) {
	      createOnHitEffect(proj); // 将弹丸大小传递给爆炸效果
	      projectiles.splice(i, 1);
	    } else if (proj.isOutOfBounds()) {
	      // 超出边界则移除弹丸，不产生爆炸效果
	      projectiles.splice(i, 1);
	    }
	  }

	  // 更新和渲染所有爆炸效果
	  updateOnHits();
	}
	function startAnimation() {
	  const fpsLimit = settingsMap.renderFpsLimit.value || 60;
	  const fpsInterval = 1000 / fpsLimit;
	  setInterval(() => {
	    animate();
	  }, fpsInterval);
	}
	function getFpsFactor() {
	  return Math.min(Math.max(160 / fps, 0.125), 8);
	}
	class Projectile {
	  constructor(startX, startY, endX, endY, color, initialSpeed = 1, size = 10, otherInfo = {}) {
	    // 基础属性
	    this.x = startX;
	    this.y = startY;
	    this.start = {
	      x: startX,
	      y: startY
	    };
	    this.target = {
	      x: endX,
	      y: endY
	    };
	    this.otherInfo = otherInfo;
	    this.shakeApplied = false;
	    this.life = 0;
	    this.type = otherInfo.type || 'default';
	    this.effect = projectileEffectsMap[this.type] || projectileEffectsMap['fireball'];
	    this.doShake = this.effect.shake;

	    // 运动参数 - 向斜上方抛物线轨迹
	    this.gravity = this.effect.gravity || 0.2; // 重力加速度
	    this.gravity *= settingsMap.projectileHeightScale.value || 1; // 高度缩放因子

	    this.initialSpeed = initialSpeed * (this.effect.speedFactor || 1); // 初始速度参数
	    this.initialSpeed *= settingsMap.projectileSpeedScale.value || 1; // 速度缩放因子

	    // 计算水平距离和高度差
	    const dx = endX - startX;
	    const dy = endY - startY;

	    // 重新设计飞行时间计算，确保合理
	    // const timeInAir = distance / this.initialSpeed / 10;
	    this.timeInAir = 80 / this.initialSpeed;

	    // FPS因子，确保在不同FPS下效果一致
	    this.fpsFactor = getFpsFactor();
	    this.gravity *= Math.pow(this.fpsFactor, 2);
	    this.timeInAir /= this.fpsFactor;

	    // 计算初始速度，修正公式确保能够到达目标
	    this.velocity = {
	      x: dx / this.timeInAir,
	      y: dy / this.timeInAir - this.gravity * this.timeInAir / 2
	    };
	    this.initialVelocity = {
	      ...this.velocity
	    };
	    this.trajectory = time => {
	      return {
	        x: startX + this.initialVelocity.x * time,
	        y: startY + this.initialVelocity.y * time + this.gravity * time * time / 2
	      };
	    };

	    // 大小参数 (范围1-100)
	    const projectileScale = settingsMap.projectileScale.value || 1;
	    this.sizeScale = Math.max(1, Math.min(100, size)) / 10 * projectileScale; // 转换为比例因子

	    // 外观属性
	    this.size = 10 * this.sizeScale;
	    this.color = this.effect.color || color;

	    // 拖尾效果
	    this.trail = [];
	    this.independentTrail = this.effect.independentTrail || false; // 是否独立拖尾
	    this.maxTrailLength = Math.floor((this.effect.trailLength || 35) * Math.sqrt(this.sizeScale)); // 拖尾长度随大小增加
	    this.maxTrailLength *= settingsMap.projectileTrailLength.value || 1; // 拖尾缩放因子
	    this.trailGap = (settingsMap.projectileTrailGap.value || 1) / this.fpsFactor;
	  }
	  update() {
	    this.life += 1;
	    const pos = this.trajectory(this.life);
	    this.velocity.y += this.gravity;
	    this.x = pos.x;
	    this.y = pos.y;

	    // 更新拖尾
	    if (this.independentTrail) {
	      if (this.effect.trailLength > 0) {
	        this.trail.push({
	          x: this.x,
	          y: this.y,
	          vX: this.velocity.x,
	          vY: this.velocity.y,
	          color: this.color,
	          size: this.size,
	          totalLength: Math.max(this.trail.length, 1)
	        });
	      }
	      if (this.trail.length > this.maxTrailLength) {
	        this.trail.shift();
	      }
	    } else {
	      this.trail = [];
	      for (let i = 0; i < this.maxTrailLength; i++) {
	        const trailTime = this.life - (this.maxTrailLength - i - 1) * this.trailGap;
	        if (trailTime <= 0) continue;
	        const trailPos = this.trajectory(trailTime);
	        this.trail.push({
	          x: trailPos.x,
	          y: trailPos.y,
	          vX: this.velocity.x,
	          vY: this.velocity.y,
	          color: this.color,
	          size: this.size,
	          totalLength: Math.min(this.maxTrailLength, this.life)
	        });
	      }
	    }
	  }
	  draw(canvas) {
	    // 绘制拖尾
	    this.trail.forEach((pos, index) => {
	      if (this.effect.trail) {
	        this.effect.trail(canvas, pos, index);
	      } else {
	        projectileEffectsMap['fireball'].trail(canvas, pos, index);
	      }
	    });

	    // 绘制主体
	    if (this.effect.draw) {
	      this.effect.draw(canvas, this);
	    } else {
	      projectileEffectsMap['fireball'].draw(canvas, this);
	    }

	    // 添加光晕效果
	    if (this.effect.glow) {
	      this.effect.glow(canvas, this);
	    }
	  }
	  isArrived() {
	    if (this.life >= this.timeInAir) {
	      this.x = this.target.x;
	      this.y = this.target.y;
	      return true;
	    }
	    // 判断是否到达目标点 (调整判定距离)
	    const arrivalDistance = 20;
	    const hasArrived = Math.hypot(this.x - this.target.x, this.y - this.target.y) < arrivalDistance;
	    if (hasArrived && this.doShake && !this.shakeApplied && this.otherInfo.endElement) {
	      const shakeIntensity = Math.min(this.sizeScale * 5, 10);
	      applyShakeEffect(this.otherInfo.endElement, shakeIntensity);
	      this.shakeApplied = true;
	    }
	    return hasArrived;
	  }
	  isOutOfBounds() {
	    return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
	  }
	}

	// Projectiles管理
	let projectiles = [];
	function clearProjectiles() {
	  projectiles.splice(0, projectiles.length);
	}

	// 爆炸效果函数
	function createOnHitEffect(projectile) {
	  const x = projectile.x;
	  const y = projectile.y;
	  const color = projectile.color;
	  const otherInfo = projectile.otherInfo;
	  const projectileScale = settingsMap.projectileScale.value || 1;

	  // Resize for onHit effect
	  projectile.size = Math.max(1, Math.min(100, projectile.size)) / 20 / projectileScale;
	  const sizeFactor = settingsMap.onHitScale.value || 1;
	  const particleFactor = settingsMap.particleEffectRatio.value || 1;
	  const particleSpeedFactor = settingsMap.particleSpeedRatio.value || 1;
	  const particleLifespanFactor = settingsMap.particleLifespanRatio.value || 1;
	  const fpsFactor = getFpsFactor();

	  // 存储命中动画的活跃状态，用于跟踪
	  const damageTextLifespan = settingsMap.damageTextLifespan.value || 120;
	  const lifeSpan = Math.ceil(damageTextLifespan / Math.pow(fpsFactor, 0.33));
	  const effects = [];
	  let onHitEffect = projectile.effect.onHit;
	  if (projectile.otherInfo.isCrit) {
	    const onCrit = projectile.effect.onCrit || projectileEffectsMap.fireball.onCrit;
	    onHitEffect = {
	      ...onHitEffect,
	      ...onCrit
	    };
	  }
	  for (const effectName in onHitEffect) {
	    const effect = onHitEffectsMap[effectName];
	    if (!effect) continue;
	    const effectCount = Math.ceil(onHitEffect[effectName](projectile.size) * particleFactor);
	    for (let i = 0; i < effectCount; i++) {
	      const effectSize = (effect.size ? effect.size(projectile) : Math.random() * 10 + 5) * sizeFactor;
	      let effectLife = Math.ceil((effect.life ? effect.life(projectile) : 1000) * particleLifespanFactor / Math.pow(fpsFactor, 0.33));
	      // effectLife = Math.min(effectLife, lifeSpan);
	      const effectSpeed = Math.ceil((effect.speed ? effect.speed(projectile) : Math.random() * 5 + 2) / Math.pow(fpsFactor, 0.33) * particleSpeedFactor);
	      effects.push({
	        x: effect.x ? effect.x(projectile) : x,
	        y: effect.y ? effect.y(projectile) : y,
	        angle: effect.angle ? effect.angle(projectile) : Math.random() * Math.PI * 2,
	        alpha: effect.alpha ? effect.alpha(projectile) : 0.8,
	        size: effectSize,
	        speed: effectSpeed,
	        gravity: effect.gravity ? effect.gravity(projectile) : 0,
	        life: effectLife,
	        maxLife: effectLife,
	        color: effect.color ? effect.color(projectile) : projectile.color,
	        fpsFactor: fpsFactor,
	        draw: effect.draw ? effect.draw : (ctx, p) => {}
	      });
	    }
	  }
	  const onHitEffectData = {
	    effects: [...effects],
	    active: true,
	    lifespan: lifeSpan,
	    color: color,
	    otherInfo: otherInfo,
	    isFpsOptimized: true
	  };
	  addEffect(onHitEffectData);
	}

	// 更新和渲染所有命中效果
	function updateOnHits() {
	  // 遍历所有活跃的命中
	  for (let i = activeEffects.length - 1; i >= 0; i--) {
	    const effect = activeEffects[i];
	    effect.life++;
	    if (effect.life >= effect.lifespan) {
	      activeEffects.splice(i, 1);
	      continue;
	    }
	    if (!effect.isFpsOptimized) {
	      const fpsFactor = getFpsFactor();
	      for (const e of effect.effects) {
	        e.speed *= fpsFactor;
	        e.life /= fpsFactor;
	        e.fpsFactor = fpsFactor;
	      }
	      effect.lifespan /= fpsFactor;
	      effect.isFpsOptimized = true;
	    }
	    ctx.save();

	    // 更新各自效果
	    effect.effects.forEach((e, index) => {
	      e.draw(ctx, e);
	    });

	    // 伤害文本
	    if (effect.otherInfo && effect.otherInfo.damage) {
	      const fontSizeScale = settingsMap.damageTextScale.value || 1;
	      const fontSizeMinimal = settingsMap.damageTextSizeMinimal.value || 14;
	      const fontSizeLimit = settingsMap.damageTextSizeLimit.value || 70;
	      const fontAlpha = settingsMap.damageTextAlpha.value || 0.8;
	      const fontSize = Math.min(Math.max(fontSizeMinimal, Math.pow(effect.otherInfo.damage, 0.65) / 2 * fontSizeScale), fontSizeLimit);
	      const damageText = `${effect.otherInfo.damage}`;
	      ctx.font = `${fontSize}px Arial`;
	      ctx.textAlign = 'center';
	      ctx.textBaseline = 'middle';
	      const textSize = ctx.measureText(damageText);
	      const textPosition = {
	        x: effect.otherInfo.end.x - textSize.width / 2 + 5,
	        y: effect.otherInfo.end.y - 20
	      };

	      // border
	      ctx.strokeStyle = effect.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${fontAlpha})`);
	      ctx.lineWidth = 6;
	      ctx.strokeText(damageText, textPosition.x, textPosition.y);
	      // main
	      const fillColor = effect.otherInfo.isCrit ? 'rgba(255, 213, 89, 1)' : 'white';
	      ctx.fillStyle = fillColor;
	      ctx.fillText(damageText, textPosition.x, textPosition.y);
	    }
	    ctx.restore();
	  }
	}
	function createProjectile(startElement, endElement, color, initialSpeed = 1, damage = 200, projectileType = 'default', isCrit = false, isKill = false) {
	  if (!startElement || !endElement) {
	    return;
	  }
	  const combatUnitContainer = endElement.querySelector(".CombatUnit_splatsContainer__2xcc0");
	  if (!settingsMap.originalDamageDisplay.value) {
	    combatUnitContainer.style.visibility = "hidden";
	  }
	  const padding = 30;
	  const randomRangeRatio = settingsMap.hitAreaScale.value || 1;
	  const randomRange = {
	    x: () => Math.floor((Math.random() - 0.5) * (combatUnitContainer.offsetWidth - 2 * padding)) * randomRangeRatio,
	    y: () => Math.floor((Math.random() - 0.1) * (combatUnitContainer.offsetHeight - padding)) * randomRangeRatio
	  };
	  const projectileLimit = settingsMap.projectileLimit.value || 30;
	  const start = getElementCenter(startElement);
	  const end = getElementCenter(endElement);
	  let endX = Math.floor(end.x + randomRange.x());
	  let endY = Math.floor(end.y + randomRange.y());
	  const minimalGap = (settingsMap.hitPositionMinGap.value || 0) * randomRangeRatio;
	  if (minimalGap > 0) {
	    let attempts = 100;
	    while (attempts > 0 && projectiles.some(p => {
	      const distance = Math.hypot(p.otherInfo.end.x - end.x, p.otherInfo.end.y - end.y);
	      return distance < minimalGap;
	    })) {
	      endX = Math.floor(end.x + randomRange.x());
	      endY = Math.floor(end.y + randomRange.y());
	      attempts -= 1;
	    }
	    if (attempts <= 0) {
	      console.warn("[MWI-Hit-Tracker-Canvas]Hit position is too crowded, hit gap may not work as expected.");
	    }
	  }
	  const size = Math.min(Math.max(Math.pow(damage + 200, 0.7) / 20, 4), 16);
	  projectileType = abilityEffectsMap[projectileType] || projectileType;
	  const otherInfo = {
	    type: projectileType,
	    start: start,
	    end: {
	      x: endX,
	      y: endY
	    },
	    damage: damage,
	    color: color,
	    isCrit: isCrit,
	    isKill: isKill,
	    startElement: startElement,
	    endElement: endElement
	  };
	  if (projectiles.length <= projectileLimit) {
	    if (damage > 0) {
	      addDamageHPBar(endElement, damage);
	    }
	    if (otherInfo.isKill && settingsMap.monsterDeadAnimation.value) {
	      deathEffect[settingsMap.monsterDeadAnimationStyle.value](otherInfo.endElement);
	    }
	    const projectile = new Projectile(start.x, start.y, endX, endY, color, initialSpeed, size, otherInfo);
	    projectiles.push(projectile);
	  } else {
	    projectiles.shift();
	  }
	}

	// 其他低频DOM操作
	setInterval(() => {
	  if (settingsMap.showFps.value) {
	    const fpsElement = document.querySelector('#hitTracker_fpsCounter');
	    if (fpsElement) {
	      fpsElement.innerText = `FPS: ${fps}`;
	    } else {
	      const parenetElement = document.querySelector(".BattlePanel_battleArea__U9hij");
	      if (parenetElement) {
	        const newFpsElement = document.createElement('div');
	        const center = getElementCenter(parenetElement);
	        newFpsElement.id = 'hitTracker_fpsCounter';
	        newFpsElement.style.position = 'fixed';
	        newFpsElement.style.top = `${center.x - parenetElement.innerWidth}px`;
	        newFpsElement.style.left = `${center.y - parenetElement.innerHeight}px`;
	        newFpsElement.style.color = 'rgba(200, 200, 200, 0.8)';
	        newFpsElement.style.zIndex = '9999';
	        newFpsElement.innerText = `FPS: ${fps}`;
	        parenetElement.appendChild(newFpsElement);
	      }
	    }
	  }
	  if (settingsMap.verticalCombatDisplay.value) {
	    const battleGrids = document.querySelectorAll(".BattlePanel_combatUnitGrid__2hTAM");
	    if (battleGrids) {
	      for (let i = 0; i < battleGrids.length; i++) {
	        const grid = battleGrids[i];
	        grid.style['grid-template-columns'] = `repeat(1,120px)`;
	      }
	    }
	  }
	}, 500);

	// #region Setting
	waitForSettings({
	  monsterDeadAnimationStyle: Object.keys(deathEffect),
	  allProjectiles: Object.keys(projectileEffectsMap)
	});
	hookWS();
	let isPageHidden = false;

	// 监听页面可见性变化
	document.addEventListener('visibilitychange', function () {
	  isPageHidden = document.hidden;
	  if (isPageHidden) {
	    clearProjectiles();
	    clearEffects();
	  }
	});

	// #region Hook WS
	function hookWS() {
	  const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
	  const oriGet = dataProperty.get;
	  dataProperty.get = hookedGet;
	  Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
	  function hookedGet() {
	    const socket = this.currentTarget;
	    if (!(socket instanceof WebSocket)) {
	      return oriGet.call(this);
	    }
	    if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
	      return oriGet.call(this);
	    }
	    const message = oriGet.call(this);
	    Object.defineProperty(this, "data", {
	      value: message
	    }); // Anti-loop

	    try {
	      return handleMessage(message);
	    } catch (error) {
	      console.log("Error in hit-tracker handleMessage:", error);
	      return message;
	    }
	  }
	}
	let monstersHP = [];
	let monstersMP = [];
	let playersHP = [];
	let playersMP = [];
	let playersAbility = [];
	function handleMessage(message) {
	  let obj = JSON.parse(message);
	  if (obj && obj.type === "new_battle") {
	    monstersHP = obj.monsters.map(monster => monster.currentHitpoints);
	    monstersMP = obj.monsters.map(monster => monster.currentManapoints);
	    playersHP = obj.players.map(player => player.currentHitpoints);
	    playersMP = obj.players.map(player => player.currentManapoints);
	    resetAllMonsterSvg();
	  } else if (obj && obj.type === "battle_updated" && monstersHP.length) {
	    const mMap = obj.mMap;
	    const pMap = obj.pMap;
	    const monsterIndices = Object.keys(obj.mMap);
	    const playerIndices = Object.keys(obj.pMap);
	    let castMonster = -1;
	    monsterIndices.forEach(monsterIndex => {
	      if (mMap[monsterIndex].cMP < monstersMP[monsterIndex]) {
	        castMonster = monsterIndex;
	      }
	      monstersMP[monsterIndex] = mMap[monsterIndex].cMP;
	    });
	    let castPlayer = -1;
	    playerIndices.forEach(userIndex => {
	      if (pMap[userIndex].cMP < playersMP[userIndex]) {
	        castPlayer = userIndex;
	      }
	      if (pMap[userIndex].cMP > playersMP[userIndex]) {
	        registProjectile({
	          from: userIndex,
	          to: userIndex,
	          hpDiff: pMap[userIndex].cMP - playersMP[userIndex],
	          reversed: false,
	          abilityHrid: 'selfManaRegen',
	          toPlayer: true
	        });
	      }
	      playersMP[userIndex] = pMap[userIndex].cMP;
	      if (pMap[userIndex].abilityHrid) {
	        playersAbility[userIndex] = pMap[userIndex].abilityHrid;
	      }
	    });
	    monstersHP.forEach((mHP, mIndex) => {
	      const monster = mMap[mIndex];
	      if (monster) {
	        const hpDiff = mHP - monster.cHP;
	        monstersHP[mIndex] = monster.cHP;
	        if (hpDiff > 0 && playerIndices.length > 0) {
	          const isCrit = monster.dmgCounter == monster.critCounter;
	          const isKill = monster.cHP <= 0;
	          if (playerIndices.length > 1) {
	            playerIndices.forEach(userIndex => {
	              if (userIndex === castPlayer) {
	                registProjectile({
	                  from: userIndex,
	                  to: mIndex,
	                  hpDiff: hpDiff,
	                  reversed: false,
	                  abilityHrid: playersAbility[userIndex],
	                  toPlayer: false,
	                  isCrit: isCrit,
	                  isKill: isKill
	                });
	              }
	            });
	          } else {
	            registProjectile({
	              from: playerIndices[0],
	              to: mIndex,
	              hpDiff: hpDiff,
	              reversed: false,
	              abilityHrid: playersAbility[playerIndices[0]],
	              toPlayer: false,
	              isCrit: isCrit,
	              isKill: isKill
	            });
	          }
	        }
	      }
	    });
	    playersHP.forEach((pHP, pIndex) => {
	      const player = pMap[pIndex];
	      if (player) {
	        const hpDiff = pHP - player.cHP;
	        playersHP[pIndex] = player.cHP;
	        if (hpDiff > 0 && monsterIndices.length > 0) {
	          const isCrit = player.dmgCounter == player.critCounter;
	          if (monsterIndices.length > 1) {
	            monsterIndices.forEach(monsterIndex => {
	              if (monsterIndex === castMonster) {
	                registProjectile({
	                  from: pIndex,
	                  to: monsterIndex,
	                  hpDiff: hpDiff,
	                  reversed: true,
	                  abilityHrid: 'autoAttack',
	                  toPlayer: false,
	                  isCrit: isCrit
	                });
	              }
	            });
	          } else {
	            registProjectile({
	              from: pIndex,
	              to: monsterIndices[0],
	              hpDiff: hpDiff,
	              reversed: true,
	              abilityHrid: 'autoAttack',
	              toPlayer: false,
	              isCrit: isCrit
	            });
	          }
	        } else if (hpDiff < 0) {
	          if (castPlayer > -1) {
	            registProjectile({
	              from: castPlayer,
	              to: pIndex,
	              hpDiff: -hpDiff,
	              reversed: false,
	              abilityHrid: 'heal',
	              toPlayer: true
	            });
	          } else {
	            registProjectile({
	              from: pIndex,
	              to: pIndex,
	              hpDiff: -hpDiff,
	              reversed: false,
	              abilityHrid: 'selfHeal',
	              toPlayer: true
	            });
	          }
	        }
	      }
	    });
	  } else if (obj && obj.type === "battle_updated") {
	    const pMap = obj.pMap;
	    const playerIndices = Object.keys(obj.pMap);
	    playerIndices.forEach(userIndex => {
	      if (pMap[userIndex].abilityHrid) {
	        playersAbility[userIndex] = pMap[userIndex].abilityHrid;
	      }
	    });
	    playersHP.forEach((pHP, pIndex) => {
	      const player = pMap[pIndex];
	      if (player) {
	        const hpDiff = pHP - player.cHP;
	        playersHP[pIndex] = player.cHP;
	        if (hpDiff < 0) {
	          registProjectile({
	            from: pIndex,
	            to: pIndex,
	            hpDiff: -hpDiff,
	            reversed: false,
	            abilityHrid: 'selfHeal',
	            toPlayer: true
	          });
	        }
	      }
	    });
	    playersMP.forEach((pMP, pIndex) => {
	      const player = pMap[pIndex];
	      if (player) {
	        const mpDiff = pMP - player.pMP;
	        playersMP[pIndex] = player.pMP;
	        if (mpDiff < 0) {
	          registProjectile({
	            from: pIndex,
	            to: pIndex,
	            hpDiff: -mpDiff,
	            reversed: false,
	            abilityHrid: 'selfManaRegen',
	            toPlayer: true
	          });
	        }
	      }
	    });
	  }
	  return message;
	}

	// #region Main Logic

	// 动画效果
	function registProjectile({
	  from,
	  to,
	  hpDiff,
	  reversed = false,
	  abilityHrid = "default",
	  toPlayer = true,
	  isCrit = false,
	  isKill = false
	}) {
	  if (isPageHidden) {
	    return;
	  }
	  if (reversed) {
	    if (settingsMap.tracker6 && !settingsMap.tracker6.isTrue) {
	      return null;
	    }
	  } else {
	    if (settingsMap["tracker" + from] && !settingsMap["tracker" + from].isTrue) {
	      return null;
	    }
	  }
	  if (["selfHeal", "selfManaRegen"].indexOf(abilityHrid) > -1 && !settingsMap.showSelfRegen.value) {
	    return null;
	  }
	  const container = document.querySelector(".BattlePanel_playersArea__vvwlB");
	  if (container && container.children.length > 0) {
	    const playersContainer = container.children[0];
	    const effectFrom = playersContainer.children[from];
	    const monsterContainer = document.querySelector(".BattlePanel_monstersArea__2dzrY").children[0];
	    const effectTo = toPlayer ? playersContainer.children[to] : monsterContainer.children[to];
	    const trackerSetting = reversed ? settingsMap[`tracker6`] : settingsMap["tracker" + from];
	    let lineColor = "rgba(" + trackerSetting.r + ", " + trackerSetting.g + ", " + trackerSetting.b + ", 1)";
	    if (["selfHeal", "selfManaRegen", "heal"].indexOf(abilityHrid) <= -1) {
	      if (trackerSetting.trackStyle === "null") {
	        return null;
	      } else if (trackerSetting.trackStyle != "auto") {
	        abilityHrid = trackerSetting.trackStyle;
	      }
	    }
	    if (!reversed) {
	      createProjectile(effectFrom, effectTo, lineColor, 1, hpDiff, abilityHrid, isCrit, isKill);
	    } else {
	      createProjectile(effectTo, effectFrom, lineColor, 1, hpDiff, abilityHrid, isCrit, isKill);
	    }
	  }
	}

	// 启动动画
	startAnimation();

	exports.registProjectile = registProjectile;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
