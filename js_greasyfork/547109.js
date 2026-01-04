// ==UserScript==
// @name           lepaiyun-script
// @namespace      my-userscript
// @version        1.0.1
// @author         glk
// @description    乐派云数据采集
// @icon           data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGFzcz0ibGF5ZXIiPjx0ZXh0IGZpbGw9IiNlZWIyMTEiIGZvbnQtZmFtaWx5PSJTZXJpZiIgZm9udC1zaXplPSI2MDAuMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMjM0IiB5PSI0NTYuMzEiPkc8L3RleHQ+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDUwZjI1IiBzdHJva2Utd2lkdGg9IjQwIiBkPSJNMTg4LjUgMTM3djIyNC4wNyIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwOTkyNSIgc3Ryb2tlLXdpZHRoPSIzMCIgZD0iTTIwOC41IDI1M2g2Ni42Ii8+PHBhdGggZD0iTTMwOC4xNCAxNjAuMDlMMjgyIDI1MS4zOGwyNyA3MS41MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2OWU4IiBzdHJva2Utd2lkdGg9IjMyIi8+PC9nPjwvc3ZnPg==
// @include        *
// @grant          none
// @license        Copyright (c) 2025 glk. All rights reserved.
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @require        https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require        https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
// @downloadURL https://update.greasyfork.org/scripts/547109/lepaiyun-script.user.js
// @updateURL https://update.greasyfork.org/scripts/547109/lepaiyun-script.meta.js
// ==/UserScript==
(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var main = {};

	/** 导出一次文件的总数据条目 */
	const Fetch_Total = 100;

	/** 订单列表每页请求数量 */
	const PageSize = 100;

	/** 是否是目标页面 */
	const IsTargetPage$1 = !!location.href.includes("/device/list");

	var config = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Fetch_Total: Fetch_Total,
		PageSize: PageSize,
		IsTargetPage: IsTargetPage$1
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(config);

	const jsonToExcel = (json, filename, sheetname) => {
	  var filename = `${filename}-${Date.now()}.xls`;
	  var wb = XLSX.utils.book_new();
	  var ws = XLSX.utils.json_to_sheet(json);
	  XLSX.utils.book_append_sheet(wb, ws, sheetname);
	  XLSX.writeFile(wb, filename);
	};
	const sleep$1 = s => new Promise(resolve => setTimeout(resolve, s * 1000));
	const showTip$1 = (message, duration = 0.8, pos) => {
	  return new Promise(resolve => {
	    let show_tip = document.getElementById("show_tip");
	    if (show_tip) {
	      document.body.removeChild(show_tip);
	    }
	    if (window.show_tip_timer) {
	      clearTimeout(window.show_tip_timer);
	    }
	    let tipDom = document.createElement("div");
	    document.body.appendChild(tipDom);
	    tipDom.id = "show_tip";
	    Object.assign(tipDom.style, {
	      position: "fixed",
	      maxWidth: "80vw",
	      top: "50%",
	      left: "50%",
	      transform: "translate(-50%, -50%)",
	      lineHeight: "20px",
	      zIndex: 9999,
	      color: "#fff",
	      backgroundColor: "#303133",
	      borderRadius: " 4px",
	      padding: "10px",
	      textAlign: "center",
	      opacity: 0.9,
	      fontSize: "1em"
	    });
	    if (pos) {
	      const {
	        left,
	        top,
	        offsetX = 0,
	        offsetY = 0
	      } = pos;
	      Object.assign(tipDom.style, {
	        top: top + offsetY + "px",
	        left: left + offsetX + "px",
	        transform: "none"
	      });
	    }
	    tipDom.innerText = message;
	    window.show_tip_timer = setTimeout(() => {
	      let show_tip = document.getElementById("show_tip");
	      if (show_tip) {
	        document.body.removeChild(show_tip);
	        resolve();
	      }
	    }, duration * 1000 - 100);
	  });
	};
	const asyncGetDom = className => {
	  return new Promise((resolve, reject) => {
	    let dom = $(className);
	    if (formFooter) {
	      resolve(dom);
	    } else {
	      setTimeout(() => {
	        resolve(asyncGetDom(className));
	      }, 1000);
	    }
	  });
	};
	const addStyle = (urls = []) => {
	  for (let i of urls) {
	    let linkDom = document.createElement("link");
	    linkDom.setAttribute("rel", "stylesheet");
	    linkDom.setAttribute("type", "text/css");
	    linkDom.href = i;
	    document.documentElement.appendChild(linkDom);
	  }
	};
	const addStyleStr$1 = (styStr = "") => {
	  let _style = document.createElement("style");
	  _style.innerHTML = styStr;
	  document.getElementsByTagName("head")[0].appendChild(_style);
	  return _style;
	};
	const createAsyncTask$1 = (checkFun = () => {}, initFun = () => {}, duration = 1) => {
	  return new Promise((resolve, reject) => {
	    const timer = setInterval(async () => {
	      const res = checkFun();
	      if (res) {
	        clearInterval(timer);
	        const res2 = await initFun(res);
	        resolve(res2);
	      }
	    }, duration * 1000);
	  });
	};
	const base64FillColor = (cvs, base64, color) => {
	  const ctx = cvs.getContext("2d");
	  let newImage = new Image();
	  newImage.src = base64;
	  newImage.onload = function (e) {
	    ctx.fillStyle = color;
	    ctx.fill();
	    ctx.fillRect(0, 0, cvs.width, cvs.height);
	    ctx.drawImage(e.currentTarget, 0, 0, width.value, height.value);
	    $("#newCanvas")[0].toDataURL("image/png");
	  };
	};
	const globalLoading$1 = (msg = "加载中...", style) => {
	  const Container_Id = "glk-global-loading-container";
	  const prevLoading = document.getElementById(Container_Id);
	  !!prevLoading && document.body.removeChild(prevLoading);
	  const ele = document.createElement("div");
	  ele.id = Container_Id;
	  ele.innerHTML = `
    <div class="mask"></div>
    <div class="message">${msg}</div>
  `;
	  const styleEle = document.createElement("style");
	  styleEle.innerHTML = `
    #${Container_Id} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      transition: opacity 0.3s;
    }
    #${Container_Id} .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
    }
    #${Container_Id} .message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }

    ${style}
  `;
	  document.head.appendChild(styleEle);
	  document.body.append(ele);
	  return {
	    close: () => {
	      document.body.removeChild(ele);
	    },
	    updateMsg: msg => {
	      ele.querySelector(".message").innerHTML = msg;
	    }
	  };
	};

	var utils = /*#__PURE__*/Object.freeze({
		__proto__: null,
		jsonToExcel: jsonToExcel,
		sleep: sleep$1,
		showTip: showTip$1,
		asyncGetDom: asyncGetDom,
		addStyle: addStyle,
		addStyleStr: addStyleStr$1,
		createAsyncTask: createAsyncTask$1,
		base64FillColor: base64FillColor,
		globalLoading: globalLoading$1
	});

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(utils);

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
	var aCallable$7 = function (argument) {
	  if (isCallable$9(argument)) return argument;
	  throw TypeError(tryToString(argument) + ' is not a function');
	};

	var aCallable$6 = aCallable$7;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$4 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$6(func);
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
	var anObject$d = function (argument) {
	  if (isObject$1(argument)) return argument;
	  throw TypeError(String(argument) + ' is not an object');
	};

	var DESCRIPTORS$3 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$c = anObject$d;
	var toPropertyKey = toPropertyKey$2;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$c(O);
	  P = toPropertyKey(P);
	  anObject$c(Attributes);
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
	var anObject$b = anObject$d;

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$b(it));
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
	var anObject$a = anObject$d;
	var objectKeys = objectKeys$1;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$a(O);
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

	var anObject$9 = anObject$d;
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
	    EmptyConstructor[PROTOTYPE] = anObject$9(O);
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
	var $$5 = _export;
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

	$$5({ global: true, forced: FORCED }, {
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

	var aCallable$5 = aCallable$7;

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aCallable$5(fn);
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

	var aCallable$4 = aCallable$7;
	var anObject$8 = anObject$d;
	var getIteratorMethod$1 = getIteratorMethod$2;

	var getIterator$1 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
	  if (aCallable$4(iteratorMethod)) return anObject$8(iteratorMethod.call(argument));
	  throw TypeError(String(argument) + ' is not iterable');
	};

	var anObject$7 = anObject$d;
	var getMethod$1 = getMethod$4;

	var iteratorClose$2 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$7(iterator);
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
	  anObject$7(innerResult);
	  return value;
	};

	var anObject$6 = anObject$d;
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

	var iterate$3 = function (iterable, unboundFunction, options) {
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
	      anObject$6(value);
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
	var $$4 = _export;
	var iterate$2 = iterate$3;
	var aCallable$3 = aCallable$7;
	var anObject$5 = anObject$d;

	$$4({ target: 'Iterator', proto: true, real: true }, {
	  find: function find(fn) {
	    anObject$5(this);
	    aCallable$3(fn);
	    return iterate$2(this, function (value, stop) {
	      if (fn(value)) return stop(value);
	    }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers
	var $$3 = _export;
	var iterate$1 = iterate$3;
	var anObject$4 = anObject$d;

	$$3({ target: 'Iterator', proto: true, real: true }, {
	  forEach: function forEach(fn) {
	    iterate$1(anObject$4(this), fn, { IS_ITERATOR: true });
	  }
	});

	var redefine = redefine$3.exports;

	var redefineAll$1 = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var aCallable$2 = aCallable$7;
	var anObject$3 = anObject$d;
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
	    state.next = aCallable$2(state.iterator.next);
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
	      return { done: true, value: $$return ? anObject$3($$return.call(iterator, value)).value : value };
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

	var anObject$2 = anObject$d;
	var iteratorClose = iteratorClose$2;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$2(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	// https://github.com/tc39/proposal-iterator-helpers
	var $$2 = _export;
	var aCallable$1 = aCallable$7;
	var anObject$1 = anObject$d;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$1;

	var IteratorProxy = createIteratorProxy(function (args) {
	  var iterator = this.iterator;
	  var result = anObject$1(this.next.apply(iterator, args));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
	});

	$$2({ target: 'Iterator', proto: true, real: true }, {
	  map: function map(mapper) {
	    return new IteratorProxy({
	      iterator: anObject$1(this),
	      mapper: aCallable$1(mapper)
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers
	var $$1 = _export;
	var iterate = iterate$3;
	var aCallable = aCallable$7;
	var anObject = anObject$d;

	$$1({ target: 'Iterator', proto: true, real: true }, {
	  reduce: function reduce(reducer /* , initialValue */) {
	    anObject(this);
	    aCallable(reducer);
	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    iterate(this, function (value) {
	      if (noInitial) {
	        noInitial = false;
	        accumulator = value;
	      } else {
	        accumulator = reducer(accumulator, value);
	      }
	    }, { IS_ITERATOR: true });
	    if (noInitial) throw TypeError('Reduce of empty iterator with no initial value');
	    return accumulator;
	  }
	});

	function formatDate(format) {
	  const now = new Date();
	  const year = now.getFullYear();
	  const month = now.getMonth() + 1;
	  const day = now.getDate();
	  const hours = now.getHours();
	  const minutes = now.getMinutes();
	  const seconds = now.getSeconds();

	  // 格式化单个数字
	  const pad = num => num.toString().padStart(2, "0");

	  // 替换格式字符串中的年月日时分秒
	  return format.replace(/YYYY/g, year).replace(/MM/g, pad(month)).replace(/DD/g, pad(day)).replace(/HH/g, pad(hours)).replace(/mm/g, pad(minutes)).replace(/ss/g, pad(seconds));
	}
	function getTodayYesterdayTomorrow() {
	  const today = new Date();
	  const yesterday = new Date(today);
	  const tomorrow = new Date(today);
	  const prePreDay = new Date(today);
	  yesterday.setDate(today.getDate() - 1);
	  tomorrow.setDate(today.getDate() + 1);
	  prePreDay.setDate(today.getDate() - 2); // 设置前天的日期

	  const formatDate = date => {
	    const year = date.getFullYear();
	    const month = (date.getMonth() + 1).toString().padStart(2, '0');
	    const day = date.getDate().toString().padStart(2, '0');
	    return `${year}-${month}-${day}`;
	  };
	  return {
	    curDate: formatDate(today),
	    preDate: formatDate(yesterday),
	    nextDate: formatDate(tomorrow),
	    prePreDate: formatDate(prePreDay)
	  };
	}

	function createARow({
	  ws,
	  value,
	  rowIdx,
	  center,
	  height
	} = {}) {
	  const curRow = ws.insertRow(rowIdx, value);
	  curRow.height = height || 35;
	  curRow.font = {
	    name: "黑体",
	    bold: false,
	    size: 11,
	    color: {
	      argb: "000000"
	    }
	  };
	  curRow.alignment = {
	    vertical: "middle",
	    horizontal: center ? "center" : "left"
	  };
	}
	function createAImageRangeChar({
	  wb,
	  ws,
	  base64,
	  range
	} = {}) {
	  const imageId = wb.addImage({
	    base64: base64,
	    extension: 'png'
	  });
	  ws.addImage(imageId, range || "A0:A0");
	}
	function numberToCol(num) {
	  let str = '',
	    q,
	    r;
	  while (num > 0) {
	    q = (num - 1) / 26;
	    r = (num - 1) % 26;
	    num = Math.floor(q);
	    str = String.fromCharCode(65 + r) + str;
	  }
	  return str;
	}

	/**
	 * 错误提示
	 */
	const Error_Code = {
	  "3001": "token 获取失败"
	};

	/**
	 * 抛出一个错误
	 * @param {*} errCode 
	 */
	const alertError = errCode => {
	  alert(`操作异常，请联系管理员 ${errCode}`);
	  console.warn("error", Error_Code[errCode]);
	};

	const getToken = () => {
	  return localStorage.getItem("token") || "";
	};

	/** 跟路径 */
	const BaseUrl = "https://lepaiyun.work/api/node/";
	/** 设备信息 */
	const deviceHistoryUrl = "billing/v1/income/device/history";
	const requestGet = url => {
	  const token = getToken();
	  if (!token) {
	    alertError("3001");
	    return;
	  }
	  return new Promise((resolve, reject) => {
	    fetch(`${BaseUrl}${url}`, {
	      headers: {
	        authorization: `Bearer ${token}`
	      }
	    }).then(res => res.json()).then(res => resolve(res)).catch(err => {
	      reject(err);
	      console.warn("glk-userscript requestGet error", err);
	    });
	  });
	};

	/**
	 * 获取计费带宽
	 * @param {*} param0 
	 */
	const getBandwidth = async ({
	  start,
	  end,
	  uuid
	}) => {
	  return requestGet(`${deviceHistoryUrl}?start=${start}&end=${end}&uuid=${uuid}&getMiner=true&order=desc`);
	};

	/**
	 * 获取基础目标按钮
	 * @returns
	 */
	const getBaseTargetBtn$1 = () => $('button:contains("批量部署"):last');

	/**
	 * 获取所有页码
	 * @returns
	 */
	const getAllPageBtn$1 = () => Array.from($(".ant-pagination li.ant-pagination-item"));

	/**
	 * 添加脚本DOM
	 * @returns
	 */
	const addScriptEle$1 = () => {
	  window.hasBandwidth = false;
	  const baseTargetBtn = getBaseTargetBtn$1();
	  const checkboxEl = $(`
    <label><input type="checkbox" name="has_bandwidth" />是否导出带宽图</label>
  `);
	  const localHasBandwidth = localStorage.getItem("hasBandwidth");
	  if (localHasBandwidth) {
	    const hasBandwidth = localHasBandwidth === "true";
	    hasBandwidth && checkboxEl.find("input").prop("checked", true);
	    window.hasBandwidth = hasBandwidth;
	  }
	  checkboxEl.on("change", e => {
	    localStorage.setItem("hasBandwidth", e.target.checked);
	    window.hasBandwidth = e.target.checked;
	  });
	  const container = $('<div id="glk-userscript-main"></div>').css({
	    display: "flex",
	    "align-items": "center",
	    gap: "10px"
	  });
	  const cloneBtn = baseTargetBtn.clone();
	  cloneBtn.text("导出数据").css({
	    "margin-left": "20px"
	  });
	  container.append(cloneBtn).append(checkboxEl);
	  baseTargetBtn.parent().append(container);
	  return cloneBtn;
	};
	const fetchIsLoading$1 = () => !!$('.ant-btn.ant-btn-primary.ant-btn-loading:contains("查 询")').length;

	/**
	 * 获取一页的所有数据
	 */
	const runTask$1 = async (pageIdx, totalPage, updateMsg = nll) => {
	  const tableTrs = $("tbody tr[data-row-key]");
	  const columnNameIdx = Array.from($(".ant-table-header table thead th")).map((i, idx) => ({
	    name: i.textContent,
	    idx
	  })).reduce((acc, item) => {
	    if (item.name.trim()) {
	      acc[item.name.trim()] = item.idx;
	    }
	    return acc;
	  }, {});
	  if (tableTrs.length) {
	    const Default_Date = formatDate("YYYY/MM/DD HH:mm");
	    const {
	      curDate,
	      prePreDate,
	      preDate
	    } = getTodayYesterdayTomorrow();
	    let baseData = Array.from(tableTrs)
	    // .filter((j, jdx) => jdx <= 0)
	    .map(tr => {
	      return {
	        // 当天采集日期到小时
	        collectionTime: Default_Date,
	        // 节点ID
	        uuid: tr.getAttribute("data-row-key"),
	        // 备注
	        remark: tr.children[columnNameIdx["备注"]]?.textContent || "-",
	        // 跨网运营商
	        crossNetOperator: tr.children[columnNameIdx["跨网运营商"]]?.textContent || "-",
	        // 业务名
	        businessName: tr.children[columnNameIdx["业务名"]]?.textContent || "-",
	        // 调度类型
	        schedulingType: tr.children[columnNameIdx["调度类型"]]?.textContent || "-",
	        // 网络配置结果
	        netCfgRes: tr.children[columnNameIdx["网络配置结果"]]?.textContent || "-"
	      };
	    });
	    // .filter((j) => j.uuid.includes("aca18383ba700257efaeeab6980d414e"));

	    for (let i = 0; i < baseData.length; i++) {
	      const {
	        uuid
	      } = baseData[i];
	      const promiseArr = [getBandwidth({
	        start: prePreDate,
	        end: preDate,
	        uuid
	      }).then(res => {
	        if (res.code === 0) {
	          let {
	            income,
	            bandwidth
	          } = res.data;
	          income = [income?.[0] || 0, income?.[1] || 0];
	          bandwidth = [bandwidth?.[0] || 0, bandwidth?.[1] || 0];
	          Object.assign(baseData[i], {
	            // 昨日带宽
	            preDateBandwidth: bandwidth[0].toFixed(2),
	            // 前日带宽
	            prePreDateBandwidth: bandwidth[1].toFixed(2),
	            // 昨日收益
	            preDateIncome: (income[0] / 100).toFixed(2),
	            // 前日收益
	            prePreDateIncome: (income[1] / 100).toFixed(2),
	            // 收益差额
	            difference: ((income[0] - income[1]) / 100).toFixed(1)
	          });
	        }
	      }), new Promise(async (resolve, reject) => {
	        // 打开详情
	        const curDetailBtn = $(tableTrs[i]).find('button:contains("详情 >")');
	        curDetailBtn[0].click();
	        createAsyncTask$1(() => {
	          return $('.ant-tabs-nav-list div[data-node-key="bandwidth"]')[0];
	        }, async ele => {
	          // 点击带宽Tab
	          ele.click();
	          createAsyncTask$1(() => {
	            return !$(".ant-spin-container.ant-spin-blur").length;
	          }, async () => {
	            await sleep$1(0.1);
	            // 获取今日（默认）带宽图表数据
	            const base64 = $("canvas")[0].toDataURL("jpg");
	            Object.assign(baseData[i], {
	              curDateBandwidthChart: base64
	            });

	            // 点击昨日按钮
	            const preDateBtn = $('.ant-tabs-tabpane.ant-tabs-tabpane-active .ant-spin-container span:contains("昨日")')[0];
	            preDateBtn.click();
	            createAsyncTask$1(() => {
	              return !$(".ant-spin-container.ant-spin-blur").length;
	            }, async () => {
	              await sleep$1(0.1);
	              const base64 = $("canvas")[0].toDataURL("jpg");
	              Object.assign(baseData[i], {
	                preDateBandwidthChart: base64
	              });
	              const closeBtn = $(".ant-drawer-close")[0];
	              if (closeBtn) {
	                closeBtn.click();
	                updateMsg(`<div style="text-align: center;">
                            <p>正在采集数据第${pageIdx + 1}页， ${i + 1}/${baseData.length}，共${totalPage}页请稍等...</p>
                            <p style="color: red">注：被隐藏的列数据不会被导出。</p>
                          </div>`);
	                resolve();
	              }
	            }, 0.1);
	          }, 0.1);
	        }, 0.1);
	      })];
	      await Promise.all(promiseArr);
	      await sleep$1(0.3);
	    }
	    // saveExcel(baseData);
	    console.log(`第${pageIdx + 1}页数据采集完成`);
	    return baseData;
	  }
	};
	const saveExcel$1 = (data = []) => {
	  const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	  let workbook = new ExcelJS.Workbook();
	  workbook.creator = "glk";
	  workbook.lastModifiedBy = "glk";
	  workbook.created = new Date(1985, 8, 30);
	  workbook.modified = new Date();
	  workbook.lastPrinted = new Date();
	  workbook.views = [{
	    x: 0,
	    y: 0,
	    width: 1000,
	    height: 2000,
	    firstSheet: 0,
	    activeTab: 1,
	    visibility: "visible"
	  }];
	  let worksheet = workbook.addWorksheet("sheet1");
	  worksheet.properties.defaultColWidth = 15;
	  let lastIdx = 0;
	  const {
	    curDate,
	    prePreDate,
	    preDate
	  } = getTodayYesterdayTomorrow();

	  // 根据 hasBandwidth 动态生成表头
	  const baseExcelHeadValue = ["当天采集日期到小时", "节点ID", "备注", "跨网运营商", "业务名", "调度类型", `${preDate}计费带宽`, `${preDate}收益`, `${prePreDate}计费带宽`, `${prePreDate}收益`, "差额"];
	  const bandwidthColumns = ["当前上下行带宽图", "昨日上下行带宽图"];
	  const excelHeadValue = window.hasBandwidth ? [...baseExcelHeadValue, ...bandwidthColumns, "网路配置结果"] : [...baseExcelHeadValue, "网路配置结果"];

	  // 动态计算列位置
	  const curDateBandwidthChartColumnNum = window.hasBandwidth ? excelHeadValue.indexOf("当前上下行带宽图") + 1 : -1;
	  const preDateBandwidthChartColumnNum = window.hasBandwidth ? excelHeadValue.indexOf("昨日上下行带宽图") + 1 : -1;
	  const uuidColumnNum = excelHeadValue.indexOf("节点ID") + 1;
	  const netCfgResColumnNum = excelHeadValue.indexOf("网路配置结果") + 1;
	  createARow({
	    ws: worksheet,
	    value: excelHeadValue,
	    rowIdx: ++lastIdx,
	    center: true
	  });

	  // 设置列宽
	  for (let i = 0; i < excelHeadValue.length; i++) {
	    const curCol = worksheet.getColumn(i + 1);
	    curCol.width = 20;

	    // 只有在包含带宽图时才设置带宽图列的宽度
	    if (window.hasBandwidth && [curDateBandwidthChartColumnNum, preDateBandwidthChartColumnNum].includes(i + 1)) {
	      curCol.width = 120;
	    }
	    if ([uuidColumnNum, netCfgResColumnNum].includes(i + 1)) {
	      curCol.width = 40;
	    }
	  }
	  data.forEach(({
	    collectionTime,
	    uuid,
	    remark,
	    netCfgRes,
	    preDateBandwidth,
	    prePreDateBandwidth,
	    preDateIncome,
	    prePreDateIncome,
	    difference,
	    curDateBandwidthChart,
	    preDateBandwidthChart,
	    crossNetOperator,
	    businessName,
	    schedulingType
	  }) => {
	    lastIdx++;

	    // 根据 hasBandwidth 动态生成行数据
	    const baseRowData = [collectionTime, uuid, remark, crossNetOperator, businessName, schedulingType, preDateBandwidth, preDateIncome, prePreDateBandwidth, prePreDateIncome, difference];
	    const rowData = window.hasBandwidth ? [...baseRowData, undefined, undefined, netCfgRes] // 为带宽图预留位置
	    : [...baseRowData, netCfgRes];
	    createARow({
	      ws: worksheet,
	      value: rowData,
	      rowIdx: lastIdx,
	      center: true,
	      height: window.hasBandwidth ? 300 : undefined // 只有包含图表时才设置较大行高
	    });

	    // 只有在 hasBandwidth 为 true 时才添加图表
	    if (window.hasBandwidth) {
	      createAImageRangeChar({
	        wb: workbook,
	        ws: worksheet,
	        base64: curDateBandwidthChart,
	        range: `${numberToCol(curDateBandwidthChartColumnNum)}${lastIdx}:${numberToCol(curDateBandwidthChartColumnNum)}${lastIdx}`
	      });
	      createAImageRangeChar({
	        wb: workbook,
	        ws: worksheet,
	        base64: preDateBandwidthChart,
	        range: `${numberToCol(preDateBandwidthChartColumnNum)}${lastIdx}:${numberToCol(preDateBandwidthChartColumnNum)}${lastIdx}`
	      });
	    }
	  });

	  //导出表格数据
	  workbook.xlsx.writeBuffer().then(data => {
	    const blob = new Blob([data], {
	      type: EXCEL_TYPE
	    });
	    const link = document.createElement("a");
	    link.href = window.URL.createObjectURL(blob);
	    link.download = `边缘计算节点数据采集${curDate}.xlsx`;
	    link.click();
	  });
	};

	var script = /*#__PURE__*/Object.freeze({
		__proto__: null,
		addScriptEle: addScriptEle$1,
		fetchIsLoading: fetchIsLoading$1,
		getAllPageBtn: getAllPageBtn$1,
		getBaseTargetBtn: getBaseTargetBtn$1,
		runTask: runTask$1,
		saveExcel: saveExcel$1
	});

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(script);

	const {
	  IsTargetPage
	} = require$$0;
	const {
	  createAsyncTask,
	  sleep,
	  globalLoading,
	  addStyleStr,
	  showTip
	} = require$$1;
	const {
	  getBaseTargetBtn,
	  addScriptEle,
	  fetchIsLoading,
	  getAllPageBtn,
	  runTask,
	  saveExcel
	} = require$$2;
	createAsyncTask(() => IsTargetPage && getBaseTargetBtn().length, () => {
	  const scriptEle = addScriptEle();
	  scriptEle.on("click", async () => {
	    createAsyncTask(() => !fetchIsLoading(), async () => {
	      const startTime = Date.now();
	      const {
	        close: closeLoading,
	        updateMsg
	      } = globalLoading(`<div style="text-align: center;"><p>正在采集数据，请稍等...</p><p style="color: red">注：被隐藏的列数据不会被导出。</p></div>`);
	      const styleEl = addStyleStr(`
            .ant-drawer {
              opacity: 0 !important;
            }  
          `);
	      let allData = [];
	      // 拿到所有 page
	      const totalPageEle = getAllPageBtn();
	      const totalPageLength = totalPageEle.length;
	      console.log(`共${totalPageLength}页`);
	      for (let i = 0; i < totalPageLength; i++) {
	        totalPageEle[i].click();
	        await sleep(0.5);
	        const res = await createAsyncTask(() => !fetchIsLoading(), async () => runTask(i, totalPageLength, updateMsg), 0.1);
	        allData = allData.concat(res);
	      }
	      console.log(`%c 最终数据`, `color: hotpink; font-size: 20px; font-weight: bold;`, allData);
	      saveExcel(allData);
	      closeLoading();
	      const endTime = Date.now();
	      const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(1);
	      showTip(`采集完成，总耗时${elapsedSeconds}秒，文件正在保存，请留意！`, 3);
	      styleEl.parentNode.removeChild(styleEl);
	    }, 0.2);
	  });
	});

	return main;

})();
