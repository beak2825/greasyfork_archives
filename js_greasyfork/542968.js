
// ==UserScript==
// @name           OmniEdu自动答题助手
// @namespace      http://tampermonkey.net/
// @version        1.2
// @author         AI Assistant
// @description    OmniEdu在线教育平台自动答题助手，支持自动答题、自动提交等功能
// @include        https://www.omniedu.com/*
// @include        http://www.omniedu.com/*
// @match          https://www.omniedu.com/*
// @match          http://www.omniedu.com/*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @run-at         document-end
// @connect        api.moonshot.cn
// @connect        api.deepseek.com
// @connect        api.openai.com
// @connect        *
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/542968/OmniEdu%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542968/OmniEdu%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".auto-answer-module_configBtn__ekKsq {\r\n    position: fixed;\r\n    bottom: 20px;\r\n    right: 20px;\r\n    z-index: 9999;\r\n    width: 40px;\r\n    height: 40px;\r\n    background: #409EFF;\r\n    color: white;\r\n    border: none;\r\n    border-radius: 50%;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 20px;\r\n    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.auto-answer-module_configBtn__ekKsq:hover {\r\n    background: #66b1ff;\r\n}\r\n\r\n.auto-answer-module_configPanel__xYuLC {\r\n    position: fixed;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 800px;\r\n    background: white;\r\n    padding: 20px;\r\n    border-radius: 8px;\r\n    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\r\n    z-index: 10000;\r\n    display: none;\r\n}\r\n\r\n.auto-answer-module_panelHeader__jv2gY {\r\n    position: relative;\r\n    margin: -20px -20px 0;\r\n    padding: 20px;\r\n}\r\n\r\n.auto-answer-module_closeBtn__umDtC {\r\n    position: absolute;\r\n    top: 20px;\r\n    right: 20px;\r\n    width: 24px;\r\n    height: 24px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    cursor: pointer;\r\n    color: #909399;\r\n    font-size: 24px;\r\n    transition: color 0.3s;\r\n    line-height: 1;\r\n}\r\n\r\n.auto-answer-module_closeBtn__umDtC:hover {\r\n    color: #F56C6C;\r\n}\r\n\r\n.auto-answer-module_tabContainer__XV7ti {\r\n    display: flex;\r\n    border-bottom: 1px solid #dcdfe6;\r\n    margin: 0 -20px 20px;\r\n    padding: 0 20px;\r\n}\r\n\r\n.auto-answer-module_tab__uWxgk {\r\n    padding: 10px 20px;\r\n    cursor: pointer;\r\n    color: #606266;\r\n    border-bottom: 2px solid transparent;\r\n}\r\n\r\n.auto-answer-module_tab__uWxgk.auto-answer-module_active__Sxlg2 {\r\n    color: #409EFF;\r\n    border-bottom-color: #409EFF;\r\n}\r\n\r\n.auto-answer-module_tabContent__rWL2T {\r\n    display: none;\r\n}\r\n\r\n.auto-answer-module_tabContent__rWL2T.auto-answer-module_active__Sxlg2 {\r\n    display: block;\r\n}\r\n\r\n.auto-answer-module_questionGrid__40f4P {\r\n    display: grid;\r\n    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));\r\n    gap: 8px;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.auto-answer-module_questionBox__w00xP {\r\n    aspect-ratio: 1;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    background: white;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    font-size: 12px;\r\n    color: #606266;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_questionBox__w00xP:hover {\r\n    transform: scale(1.1);\r\n    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.auto-answer-module_questionBox__w00xP.auto-answer-module_completed__AGqJ0 {\r\n    background: #409EFF;\r\n    color: white;\r\n    border-color: #409EFF;\r\n}\r\n\r\n.auto-answer-module_questionDetail__eozNS {\r\n    margin: 20px 0;\r\n    padding: 15px;\r\n    background: #f5f7fa;\r\n    border-radius: 4px;\r\n    min-height: 200px;\r\n}\r\n\r\n.auto-answer-module_apiConfig__KJaiR {\r\n    padding: 20px;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg {\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg label {\r\n    display: block;\r\n    margin-bottom: 12px;\r\n    color: #333;\r\n    font-weight: bold;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg select,\r\n.auto-answer-module_formItem__rWVmg input {\r\n    width: 100%;\r\n    padding: 8px 12px;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    font-size: 14px;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_formItem__rWVmg select:focus,\r\n.auto-answer-module_formItem__rWVmg input:focus {\r\n    outline: none;\r\n    border-color: #409eff;\r\n    box-shadow: 0 0 0 2px rgba(64, 158, 255, .2);\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 12px;\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg input {\r\n    flex: 1;\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg button {\r\n    padding: 8px 12px;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    background: #fff;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n    white-space: nowrap;\r\n}\r\n\r\n.auto-answer-module_inputGroup__Yu-vg button:hover {\r\n    background: #f5f7fa;\r\n}\r\n\r\n.auto-answer-module_getTokenBtn__ALTr- {\r\n    padding: 8px 16px;\r\n    background: #67c23a;\r\n    color: white;\r\n    border: none;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n    white-space: nowrap;\r\n}\r\n\r\n.auto-answer-module_getTokenBtn__ALTr-:hover {\r\n    background: #85ce61;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ {\r\n    margin-top: 8px;\r\n    padding: 12px;\r\n    background: #f8f9fa;\r\n    border-radius: 4px;\r\n    font-size: 12px;\r\n    color: #606266;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ p {\r\n    margin: 0 0 8px 0;\r\n    font-weight: bold;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ ul {\r\n    margin: 0;\r\n    padding-left: 20px;\r\n}\r\n\r\n.auto-answer-module_apiKeyHelp__rTXiJ li {\r\n    margin: 4px 0;\r\n}\r\n\r\n.auto-answer-module_btnContainer__4wLy8 {\r\n    display: flex;\r\n    gap: 12px;\r\n    margin-top: 20px;\r\n}\r\n\r\n.auto-answer-module_btn__yQl08 {\r\n    padding: 8px 16px;\r\n    border: none;\r\n    border-radius: 4px;\r\n    font-size: 14px;\r\n    cursor: pointer;\r\n    transition: all 0.3s;\r\n}\r\n\r\n.auto-answer-module_btn__yQl08:disabled {\r\n    opacity: 0.6;\r\n    cursor: not-allowed;\r\n}\r\n\r\n.auto-answer-module_btnPrimary__ioplW {\r\n    background: #409eff;\r\n    color: white;\r\n}\r\n\r\n.auto-answer-module_btnPrimary__ioplW:hover:not(:disabled) {\r\n    background: #66b1ff;\r\n}\r\n\r\n.auto-answer-module_btnDefault__b5fLW {\r\n    background: #f4f4f5;\r\n    color: #606266;\r\n}\r\n\r\n.auto-answer-module_btnDefault__b5fLW:hover:not(:disabled) {\r\n    background: #e9e9eb;\r\n}\r\n\r\n.auto-answer-module_btnDanger__umKjg {\r\n    background: #f56c6c;\r\n    color: white;\r\n}\r\n\r\n.auto-answer-module_btnDanger__umKjg:hover:not(:disabled) {\r\n    background: #f78989;\r\n}\r\n\r\n.auto-answer-module_btnWarning__xRokW {\r\n    background-color: #e6a23c;\r\n    border-color: #e6a23c;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_btnWarning__xRokW:hover {\r\n    background-color: #ebb563;\r\n    border-color: #ebb563;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_btnInfo__7JFNj {\r\n    background-color: #409eff;\r\n    border-color: #409eff;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_btnInfo__7JFNj:hover {\r\n    background-color: #66b1ff;\r\n    border-color: #66b1ff;\r\n    color: #fff;\r\n}\r\n\r\n.auto-answer-module_error__mVpGZ {\r\n    border-color: #f44336 !important;\r\n    background-color: #ffebee !important;\r\n}\r\n\r\n.auto-answer-module_error__mVpGZ:focus {\r\n    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;\r\n} ";
  var styles = {"configBtn":"auto-answer-module_configBtn__ekKsq","configPanel":"auto-answer-module_configPanel__xYuLC","panelHeader":"auto-answer-module_panelHeader__jv2gY","closeBtn":"auto-answer-module_closeBtn__umDtC","tabContainer":"auto-answer-module_tabContainer__XV7ti","tab":"auto-answer-module_tab__uWxgk","active":"auto-answer-module_active__Sxlg2","tabContent":"auto-answer-module_tabContent__rWL2T","questionGrid":"auto-answer-module_questionGrid__40f4P","questionBox":"auto-answer-module_questionBox__w00xP","completed":"auto-answer-module_completed__AGqJ0","questionDetail":"auto-answer-module_questionDetail__eozNS","apiConfig":"auto-answer-module_apiConfig__KJaiR","formItem":"auto-answer-module_formItem__rWVmg","inputGroup":"auto-answer-module_inputGroup__Yu-vg","getTokenBtn":"auto-answer-module_getTokenBtn__ALTr-","apiKeyHelp":"auto-answer-module_apiKeyHelp__rTXiJ","btnContainer":"auto-answer-module_btnContainer__4wLy8","btn":"auto-answer-module_btn__yQl08","btnPrimary":"auto-answer-module_btnPrimary__ioplW","btnDefault":"auto-answer-module_btnDefault__b5fLW","btnDanger":"auto-answer-module_btnDanger__umKjg","btnWarning":"auto-answer-module_btnWarning__xRokW","btnInfo":"auto-answer-module_btnInfo__7JFNj","error":"auto-answer-module_error__mVpGZ"};
  styleInject(css_248z);

  const defaultConfig = {
    apiType: 'moonshot',
    apiKeys: {},
    customOpenAIUrl: 'https://new.ljcljc.cn/v1',
    customOpenAIModel: 'gpt-4.1',
    debugMode: true
  };
  function getConfig() {
    const savedConfig = localStorage.getItem('auto-answer-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      // 兼容旧版本配置
      if ('apiKey' in config) {
        const oldApiKey = config.apiKey;
        config.apiKeys = {
          [config.apiType]: oldApiKey
        };
        delete config.apiKey;
        saveConfig(config);
      }
      return config;
    }
    return defaultConfig;
  }
  function saveConfig(config) {
    localStorage.setItem('auto-answer-config', JSON.stringify(config));
  }
  function debug(message) {
    const config = getConfig();
    if (config.debugMode) {
      console.log('[自动答题助手]', message);
    }
  }

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
  var aCallable$9 = function (argument) {
    if (isCallable$9(argument)) return argument;
    throw TypeError(tryToString(argument) + ' is not a function');
  };

  var aCallable$8 = aCallable$9;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$4 = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable$8(func);
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
  var anObject$f = function (argument) {
    if (isObject$1(argument)) return argument;
    throw TypeError(String(argument) + ' is not an object');
  };

  var DESCRIPTORS$3 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var anObject$e = anObject$f;
  var toPropertyKey = toPropertyKey$2;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$e(O);
    P = toPropertyKey(P);
    anObject$e(Attributes);
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
  var anObject$d = anObject$f;

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$d(it));
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
  var anObject$c = anObject$f;
  var objectKeys = objectKeys$1;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$c(O);
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

  var anObject$b = anObject$f;
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
      EmptyConstructor[PROTOTYPE] = anObject$b(O);
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
  var $$6 = _export;
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

  $$6({ global: true, forced: FORCED }, {
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

  var aCallable$7 = aCallable$9;

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aCallable$7(fn);
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

  var aCallable$6 = aCallable$9;
  var anObject$a = anObject$f;
  var getIteratorMethod$1 = getIteratorMethod$2;

  var getIterator$1 = function (argument, usingIterator) {
    var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
    if (aCallable$6(iteratorMethod)) return anObject$a(iteratorMethod.call(argument));
    throw TypeError(String(argument) + ' is not iterable');
  };

  var anObject$9 = anObject$f;
  var getMethod$1 = getMethod$4;

  var iteratorClose$2 = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject$9(iterator);
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
    anObject$9(innerResult);
    return value;
  };

  var anObject$8 = anObject$f;
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

  var iterate$4 = function (iterable, unboundFunction, options) {
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
        anObject$8(value);
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
  var $$5 = _export;
  var iterate$3 = iterate$4;
  var aCallable$5 = aCallable$9;
  var anObject$7 = anObject$f;

  $$5({ target: 'Iterator', proto: true, real: true }, {
    find: function find(fn) {
      anObject$7(this);
      aCallable$5(fn);
      return iterate$3(this, function (value, stop) {
        if (fn(value)) return stop(value);
      }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$4 = _export;
  var iterate$2 = iterate$4;
  var anObject$6 = anObject$f;

  $$4({ target: 'Iterator', proto: true, real: true }, {
    forEach: function forEach(fn) {
      iterate$2(anObject$6(this), fn, { IS_ITERATOR: true });
    }
  });

  var redefine = redefine$3.exports;

  var redefineAll$1 = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var aCallable$4 = aCallable$9;
  var anObject$5 = anObject$f;
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
      state.next = aCallable$4(state.iterator.next);
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
        return { done: true, value: $$return ? anObject$5($$return.call(iterator, value)).value : value };
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

  var anObject$4 = anObject$f;
  var iteratorClose = iteratorClose$2;

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$4(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$3 = _export;
  var aCallable$3 = aCallable$9;
  var anObject$3 = anObject$f;
  var createIteratorProxy$1 = iteratorCreateProxy;
  var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;

  var IteratorProxy$1 = createIteratorProxy$1(function (args) {
    var iterator = this.iterator;
    var result = anObject$3(this.next.apply(iterator, args));
    var done = this.done = !!result.done;
    if (!done) return callWithSafeIterationClosing$1(iterator, this.mapper, result.value);
  });

  $$3({ target: 'Iterator', proto: true, real: true }, {
    map: function map(mapper) {
      return new IteratorProxy$1({
        iterator: anObject$3(this),
        mapper: aCallable$3(mapper)
      });
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$2 = _export;
  var aCallable$2 = aCallable$9;
  var anObject$2 = anObject$f;
  var createIteratorProxy = iteratorCreateProxy;
  var callWithSafeIterationClosing = callWithSafeIterationClosing$2;

  var IteratorProxy = createIteratorProxy(function (args) {
    var iterator = this.iterator;
    var filterer = this.filterer;
    var next = this.next;
    var result, done, value;
    while (true) {
      result = anObject$2(next.apply(iterator, args));
      done = this.done = !!result.done;
      if (done) return;
      value = result.value;
      if (callWithSafeIterationClosing(iterator, filterer, value)) return value;
    }
  });

  $$2({ target: 'Iterator', proto: true, real: true }, {
    filter: function filter(filterer) {
      return new IteratorProxy({
        iterator: anObject$2(this),
        filterer: aCallable$2(filterer)
      });
    }
  });

  // https://github.com/tc39/proposal-iterator-helpers
  var $$1 = _export;
  var iterate$1 = iterate$4;
  var aCallable$1 = aCallable$9;
  var anObject$1 = anObject$f;

  $$1({ target: 'Iterator', proto: true, real: true }, {
    reduce: function reduce(reducer /* , initialValue */) {
      anObject$1(this);
      aCallable$1(reducer);
      var noInitial = arguments.length < 2;
      var accumulator = noInitial ? undefined : arguments[1];
      iterate$1(this, function (value) {
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

  class PromptGenerator {
    static generatePrompt(questions) {
      const questionsByType = questions.reduce((acc, q) => {
        if (!acc[q.type]) {
          acc[q.type] = [];
        }
        acc[q.type].push(q);
        return acc;
      }, {});
      let prompt = '请根据题型回答以下题目。请注意：准确性比速度更重要，如果不确定某题的答案，可以跳过该题。\n\n';

      // 添加题型说明
      prompt += this.getQuestionTypeInstructions() + '\n\n';

      // 按题型分组添加题目
      for (const [type, questionsOfType] of Object.entries(questionsByType)) {
        if (questionsOfType.length > 0) {
          prompt += `${this.getTypeTitle(type)}：\n`;
          prompt += this.formatQuestions(questionsOfType) + '\n\n';
        }
      }
      return prompt;
    }
    static formatQuestions(questions) {
      return questions.map(q => {
        let questionText = `${q.index}. ${q.content}`;
        if (q.options) {
          questionText += '\n' + q.options.map(opt => `   ${opt}`).join('\n');
        }
        // 添加填空题/简答题的标识
        if (q.type === 'text') {
          if (q.blanks && q.blanks.length > 0) {
            questionText += `\n   [填空题，共${q.blanks.length}个空]`;
          } else {
            questionText += '\n   [简答题]';
          }
        }
        return questionText;
      }).join('\n\n');
    }
    static getQuestionTypeInstructions() {
      return `
请仔细阅读每道题目，确保答案的准确性。宁可多花时间思考，也不要为了速度而牺牲正确率。

回答要求：
1. 对于选择题，请仔细分析每个选项，确保选择最准确的答案。
2. 对于判断题，请详细思考后再判断正误，不要轻易下结论。
3. 对于填空题，请注意空的数量，按顺序填写每个空的答案。
4. 对于简答题，请给出完整、准确的答案。
5. 如果对某道题目没有完全把握，可以跳过该题（不提供答案）。
6. 请不要为了全部回答而随意猜测答案。

答案格式说明：
- 单选题：回复格式为 "题号:选项"，如 "1:A"
- 多选题：回复格式为 "题号:选项&选项"，如 "2:A&B"
- 判断题：回复格式为 "题号:选项"，其中A为正确，B为错误
- 填空题：回复格式为 "题号:答案1:::答案2:::答案3"，如 "3:test1:::test2"
- 简答题：回复格式为 "题号:答案"

多个答案之间使用逗号分隔，不同题型之间使用分号分隔。
仅返回JSON格式的答案，不要有任何其他解释或说明。

示例答案格式：
{
    "1": "A",
    "2": "A&B",
    "3": "B",
    "4": "答案1:::答案2",
    "5": "这是简答题的答案"
}
`.trim();
    }
    static getTypeTitle(type) {
      switch (type) {
        case 'single':
          return '单选题（请仔细分析每个选项）';
        case 'multiple':
          return '多选题（注意可能有多个正确答案）';
        case 'judgement':
          return '判断题（请认真思考后再判断）';
        case 'text':
          return '填空/简答题（请确保答案准确完整）';
        default:
          return type;
      }
    }
  }

  // 使用示例：
  /*
  const questions = [
      {
          index: 1,
          content: "以下哪个是JavaScript的基本数据类型？",
          type: "single",
          options: ["A. Object", "B. String", "C. Array", "D. Function"]
      },
      {
          index: 2,
          content: "JavaScript中的真值包括：",
          type: "multiple",
          options: ["A. true", "B. 非空字符串", "C. 0", "D. 非空数组"]
      }
  ];

  const prompt = PromptGenerator.generatePrompt(questions);
  */

  class EventEmitter {
    constructor() {
      this.events = new Map();
    }
    on(event, callback) {
      if (!this.events.has(event)) {
        this.events.set(event, []);
      }
      this.events.get(event).push(callback);
    }
    off(event, callback) {
      if (!this.events.has(event)) return;
      const callbacks = this.events.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.events.delete(event);
      }
    }
    emit(event, ...args) {
      if (!this.events.has(event)) return;
      this.events.get(event).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event ${event} callback:`, error);
        }
      });
    }
  }

  class BaseAPIProvider extends EventEmitter {
    constructor(config) {
      super();
      this.apiKey = config.apiKey;
      this.baseURL = config.baseURL || this.getDefaultBaseURL();
    }
    async chat(messages) {
      try {
        const config = this.getConfig();
        const response = await this.customFetch('/chat/completions', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: config.model.chat,
            messages: [{
              role: 'system',
              content: config.systemPrompt || '你是一位严谨的软件工程师，碰到问题会认真思考，请严格按照指定格式回答题目。'
            }, ...messages],
            temperature: 0.3
          }
        });
        return {
          code: 200,
          message: 'success',
          data: response
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`API Error: ${errorMessage}`);
      }
    }
    async embeddings(input) {
      try {
        const config = this.getConfig();
        if (!config.model.embedding) {
          throw new Error('Embeddings not supported by this provider');
        }
        const response = await this.customFetch('/embeddings', {
          method: 'POST',
          headers: this.getDefaultHeaders(),
          body: {
            model: config.model.embedding,
            input: Array.isArray(input) ? input : [input]
          }
        });
        return {
          code: 200,
          message: 'success',
          data: response
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`API Error: ${errorMessage}`);
      }
    }
    async customFetch(endpoint, options) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: options.method,
          url: `${this.baseURL}${endpoint}`,
          headers: options.headers,
          data: options.body ? JSON.stringify(options.body) : undefined,
          responseType: 'json',
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response.response);
            } else {
              reject(new Error(`HTTP Error: ${response.status} ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(new Error('Network Error: ' + error.error));
          }
        });
      });
    }
  }

  class MoonshotAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      return 'https://api.moonshot.cn/v1';
    }
    getDefaultHeaders() {
      return {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'moonshot-v1-8k',
          embedding: 'text-embedding-v1'
        }
      };
    }
  }

  class DeepSeekAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      return 'https://api.deepseek.com/v1';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'deepseek-chat'
        }
      };
    }
  }

  class ChatGPTAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      return 'https://api.openai.com/v1';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'gpt-3.5-turbo',
          embedding: 'text-embedding-ada-002'
        }
      };
    }
  }

  class CustomOpenAIAPIProvider extends BaseAPIProvider {
    getDefaultBaseURL() {
      const config = getConfig();
      return config.customOpenAIUrl || 'https://new.ljcljc.cn/v1';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };
    }
    getConfig() {
      const config = getConfig();
      return {
        model: {
          chat: config.customOpenAIModel || 'gpt-4.1',
          embedding: 'text-embedding-3-large'
        }
      };
    }
  }

  // https://github.com/tc39/proposal-iterator-helpers
  var $ = _export;
  var iterate = iterate$4;
  var aCallable = aCallable$9;
  var anObject = anObject$f;

  $({ target: 'Iterator', proto: true, real: true }, {
    some: function some(fn) {
      anObject(this);
      aCallable(fn);
      return iterate(this, function (value, stop) {
        if (fn(value)) return stop();
      }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
    }
  });

  class QuestionBankAPI extends BaseAPIProvider {
    constructor(token) {
      super({
        apiKey: token
      });
      this.token = token;
    }

    // 测试题库连接
    async testConnection() {
      try {
        const url = new URL('query', this.getDefaultBaseURL());
        url.searchParams.set('token', this.token);
        url.searchParams.set('title', '下列选项中，用于获取POST请求参数的是');
        const res = await fetch(url.toString(), {
          method: 'GET'
        });
        const response = await res.json();
        debug(`题库测试响应：${JSON.stringify(response)}`);
        return response.code === 1;
      } catch (error) {
        debug(`题库测试失败: ${error.message}`);
        return false;
      }
    }
    async query(title, options) {
      try {
        const url = new URL('query', this.getDefaultBaseURL());
        url.searchParams.set('token', this.token);
        url.searchParams.set('title', title);
        const res = await fetch(url.toString(), {
          method: 'GET'
        });
        const response = await res.json();
        debug(`题库响应：${JSON.stringify(response)}`);
        if (response.code === 1 && response.data) {
          const rawAnswer = response.data.answer;
          debug(`题库返回原始答案: ${rawAnswer}`);
          if (options && options.length > 0) {
            if (this.isJudgementQuestion(options)) {
              const matchedOption = this.processJudgementAnswer(rawAnswer, options);
              if (matchedOption) {
                debug(`题库答案匹配到选项: ${matchedOption}`);
                return {
                  answer: matchedOption
                };
              }
            } else {
              const matchedOption = this.findAnswerOption(rawAnswer, options);
              if (matchedOption) {
                debug(`题库答案匹配到选项: ${matchedOption}`);
                return {
                  answer: matchedOption
                };
              }
            }
            debug(`题库答案未能匹配到选项，原始答案: ${rawAnswer}，可用选项: ${options.join(', ')}`);
            return null;
          }
          const processedAnswer = this.processAnswer(rawAnswer, options);
          debug(`题库答案处理后: ${processedAnswer}`);
          return {
            answer: processedAnswer
          };
        }
        debug(`题库未匹配到答案: ${response.message}`);
        return null;
      } catch (error) {
        debug(`题库查询失败: ${error.message}`);
        return null;
      }
    }
    getDefaultBaseURL() {
      return 'https://tk.enncy.cn';
    }
    getDefaultHeaders() {
      return {
        'Content-Type': 'application/json'
      };
    }
    getConfig() {
      return {
        model: {
          chat: 'question-bank'
        }
      };
    }

    // 判断是否为判断题
    isJudgementQuestion(options) {
      if (options.length !== 2) return false;
      const optionTexts = options.map(opt => opt.replace(/^[A-Z]\.\s*/, '').toLowerCase().trim());
      const hasCorrect = optionTexts.some(text => text === '正确' || text === 'true' || text === '对' || text === '√');
      const hasIncorrect = optionTexts.some(text => text === '错误' || text === 'false' || text === '错' || text === '×');
      return hasCorrect && hasIncorrect;
    }

    // 处理判断题答案
    processJudgementAnswer(answer, options) {
      const cleanAnswer = answer.toLowerCase().trim();
      const isCorrect = cleanAnswer === '正确' || cleanAnswer === 'true' || cleanAnswer === '对' || cleanAnswer === '√' || cleanAnswer === 'a';
      const optionTexts = options.map(opt => opt.replace(/^[A-Z]\.\s*/, '').toLowerCase().trim());
      const correctFirst = optionTexts[0] === '正确' || optionTexts[0] === 'true' || optionTexts[0] === '对' || optionTexts[0] === '√';
      return correctFirst ? isCorrect ? 'A' : 'B' : isCorrect ? 'B' : 'A';
    }

    // 查找答案对应的选项
    findAnswerOption(answer, options) {
      const cleanAnswer = answer.replace(/[.,，。、\s]/g, '').toLowerCase();
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionContent = option.replace(/^[A-Z]\.\s*/, '').replace(/[.,，。、\s]/g, '').toLowerCase();
        if (optionContent.includes(cleanAnswer) || cleanAnswer.includes(optionContent)) {
          return String.fromCharCode(65 + i);
        }
      }
      return null;
    }

    // 处理题库答案格式
    processAnswer(answer, options) {
      const cleanAnswer = answer.trim();
      if (options && options.length > 0) {
        return cleanAnswer;
      }
      if (cleanAnswer.includes(';')) {
        return cleanAnswer.split(';').map(part => part.trim()).filter(part => part).join(':::');
      }
      return cleanAnswer;
    }
  }

  class APIFactory {
    provider = null;
    questionBank = null;
    constructor() {}
    static getInstance() {
      if (!APIFactory.instance) {
        APIFactory.instance = new APIFactory();
      }
      return APIFactory.instance;
    }
    getQuestionBank() {
      const config = getConfig();
      if (config.questionBankToken) {
        if (!this.questionBank) {
          this.questionBank = new QuestionBankAPI(config.questionBankToken);
        }
        return this.questionBank;
      }
      return null;
    }
    getProvider() {
      if (!this.provider) {
        const config = getConfig();
        const apiKey = config.apiKeys[config.apiType];
        if (!apiKey) {
          throw new Error(`未设置 ${config.apiType} 的API密钥`);
        }
        switch (config.apiType) {
          case 'deepseek':
            this.provider = new DeepSeekAPIProvider({
              apiKey
            });
            break;
          case 'chatgpt':
            this.provider = new ChatGPTAPIProvider({
              apiKey
            });
            break;
          case 'custom-openai':
            this.provider = new CustomOpenAIAPIProvider({
              apiKey,
              baseURL: config.customOpenAIUrl || 'https://api.openai.com/v1'
            });
            break;
          case 'moonshot':
          default:
            this.provider = new MoonshotAPIProvider({
              apiKey
            });
            break;
        }
      }
      return this.provider;
    }
    resetProvider() {
      this.provider = null;
      this.questionBank = null;
    }
  }

  class AnswerHandler {
    questions = [];
    isProcessing = false;
    constructor() {}
    static getInstance() {
      if (!AnswerHandler.instance) {
        AnswerHandler.instance = new AnswerHandler();
      }
      return AnswerHandler.instance;
    }
    async scanQuestions() {
      try {
        const questions = [];

        // 用于收集每种题型的题目
        const questionsByType = {
          single: [],
          multiple: [],
          judgement: [],
          text: []
        };

        // 首先找到题目列表容器
        const groupList = document.querySelector('.group-list.scrollbar');
        if (!groupList) {
          debug('未找到题目列表容器');
          return [];
        }

        // 找到所有题型组
        const groups = groupList.querySelectorAll('.group');
        if (groups.length === 0) {
          debug('未找到题型组');
          return [];
        }
        let questionIndex = 1;
        // 遍历每个题型组
        groups.forEach(group => {
          // 获取题型标题
          const titleEl = group.querySelector('.title');
          const groupTitle = titleEl?.textContent?.trim() || '';

          // 解析题型信息
          let questionType = 'single'; // 默认为单选题
          let questionCount = 0;
          let totalScore = 0;

          // 使用正则表达式解析题型标题
          const titleInfo = groupTitle.match(/[一二三四五六七八九十]+、(.+?)（共(\d+)题，共(\d+)分）/);
          if (titleInfo) {
            const [_, typeText, count, score] = titleInfo;
            questionCount = parseInt(count);
            totalScore = parseInt(score);

            // 根据题型文本判断类型
            if (typeText.includes('单选')) {
              questionType = 'single';
            } else if (typeText.includes('多选')) {
              questionType = 'multiple';
            } else if (typeText.includes('判断')) {
              questionType = 'judgement';
            } else if (typeText.includes('填空') || typeText.includes('简答')) {
              questionType = 'text';
            }
          }

          // 找到该组下的所有题目
          const questionElements = group.querySelectorAll('.question');
          questionElements.forEach(questionEl => {
            // 查找题目内容
            const titleContent = questionEl.querySelector('.ck-content.title');
            let titleText = '';
            if (titleContent) {
              // 处理简答题的特殊格式
              if (questionType === 'text') {
                const allParagraphs = titleContent.querySelectorAll('span p');
                titleText = Array.from(allParagraphs).map(p => {
                  // 获取所有带背景色的代码片段
                  const codeSpans = p.querySelectorAll('span[style*="background-color"]');
                  if (codeSpans.length > 0) {
                    // 如果有代码片段，替换原始HTML中的空格实体
                    return Array.from(codeSpans).map(span => span.innerHTML.replace(/&nbsp;/g, ' ').trim()).join(' ');
                  }
                  // 普通文本直接返回
                  return p.textContent?.trim() || '';
                }).filter(text => text).join('\n');
              } else {
                // 其他题型保持原有处理方式
                titleText = titleContent.querySelector('span p')?.textContent || '';
              }
            }
            if (!titleText) {
              debug(`未找到题目内容: 第 ${questionIndex} 题`);
              return;
            }

            // 移除（数字分）格式，保持原始文本不变
            const content = titleText.replace(/[（(]\s*\d+\s*分\s*[）)]/g, '').trim();

            // 解析选项
            const optionList = questionEl.querySelector('.option-list');
            const options = [];
            if (optionList) {
              const optionElements = optionList.querySelectorAll('.option');
              optionElements.forEach(optionEl => {
                const item = optionEl.querySelector('.item')?.textContent?.trim() || '';
                const optContent = optionEl.querySelector('.ck-content.opt-content span p')?.textContent?.trim() || '';
                if (item && optContent) {
                  options.push(`${item}. ${optContent}`);
                }
              });
            }

            // 基本题目信息
            const question = {
              index: questionIndex++,
              content,
              type: questionType,
              element: questionEl,
              options: options.length > 0 ? options : undefined
            };

            // 如果是判断题，检测正确选项是否在前
            if (questionType === 'judgement' && options.length === 2) {
              const firstOptionText = options[0].replace(/^[A-Z]\.\s*/, '').toLowerCase().trim();
              question.answer = firstOptionText === '正确' || firstOptionText === 'true' || firstOptionText === '对' || firstOptionText === '√';
              debug(`判断题 ${question.index} 的正确选项在${question.answer ? '前' : '后'}`);
            }

            // 如果是填空题，识别答题框
            if (questionType === 'text') {
              const textQue = questionEl.querySelector('.que-title')?.nextElementSibling;
              if (textQue?.classList.contains('text-que')) {
                const blanks = [];
                const opts = textQue.querySelectorAll('.opt');
                opts.forEach(opt => {
                  const numberSpan = opt.querySelector('span');
                  const inputWrapper = opt.querySelector('.el-input.el-input--small.el-input--suffix');
                  const input = inputWrapper?.querySelector('.el-input__inner');
                  if (numberSpan && input) {
                    blanks.push({
                      number: parseInt(numberSpan.textContent?.replace(/[^\d]/g, '') || '0'),
                      element: input
                    });
                  }
                });
                if (blanks.length > 0) {
                  question.blanks = blanks;
                }
              }
            }
            questions.push(question);

            // 将题目添加到对应题型的列表中
            questionsByType[questionType].push(`${question.index}. ${content}`);
          });
        });
        this.questions = questions;

        // 按题型打印题目列表
        if (questionsByType.single.length > 0) {
          debug('单选题：');
          questionsByType.single.forEach(q => debug(q));
        }
        if (questionsByType.multiple.length > 0) {
          debug('多选题：');
          questionsByType.multiple.forEach(q => debug(q));
        }
        if (questionsByType.judgement.length > 0) {
          debug('判断题：');
          questionsByType.judgement.forEach(q => debug(q));
        }
        if (questionsByType.text.length > 0) {
          debug('填空/简答题：');
          questionsByType.text.forEach(q => debug(q));
        }
        debug(`共扫描到 ${questions.length} 个题目`);
        return questions;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug('扫描题目失败: ' + errorMessage);
        return [];
      }
    }
    async startAutoAnswer() {
      if (this.isProcessing) {
        debug('已有答题任务正在进行中');
        return;
      }
      try {
        this.isProcessing = true;
        debug('开始自动答题');
        const questions = await this.scanQuestions();
        if (questions.length === 0) {
          throw new Error('未找到任何题目');
        }

        // 获取API工厂实例
        const apiFactory = APIFactory.getInstance();

        // 尝试使用题库
        const questionBank = apiFactory.getQuestionBank();
        const answers = {};
        if (questionBank) {
          debug('检测到题库配置，开始测试题库连接');

          // 测试题库连接
          const isConnected = await questionBank.testConnection();
          if (!isConnected) {
            debug('题库连接测试失败，跳过题库搜题');
          } else {
            debug('题库连接测试成功，开始使用题库查询答案');

            // 先尝试从题库获取答案
            for (const question of questions) {
              try {
                const result = await questionBank.query(question.content, question.options);
                if (result) {
                  debug(`题库匹配成功 - 题目 ${question.index}: ${result.answer}`);
                  answers[question.index.toString()] = result.answer;
                }
              } catch (error) {
                debug(`题库查询失败 - 题目 ${question.index}: ${error.message}`);
              }
            }

            // 统计题库匹配结果
            const matchedCount = Object.keys(answers).length;
            debug(`题库匹配结果：共 ${questions.length} 题，匹配成功 ${matchedCount} 题`);

            // 如果所有题目都匹配到了答案，直接处理
            if (matchedCount === questions.length) {
              debug('所有题目都在题库中找到答案，开始填写');
              await this.processAIResponse(JSON.stringify(answers));
              debug('题库答题完成');
              return;
            }

            // 如果有部分题目匹配到答案
            if (matchedCount > 0) {
              debug('部分题目在题库中找到答案，继续使用AI回答剩余题目');
            }
          }
        }

        // 对于未匹配到答案的题目，使用AI回答
        const remainingQuestions = questions.filter(q => !answers[q.index.toString()]);
        if (remainingQuestions.length > 0) {
          debug(`使用AI回答${remainingQuestions.length}道题目`);

          // 生成提示词
          const prompt = PromptGenerator.generatePrompt(remainingQuestions);
          debug('生成的提示词：\n' + prompt);

          // 获取API提供者
          const provider = apiFactory.getProvider();

          // 发送请求
          const response = await provider.chat([{
            role: 'user',
            content: prompt
          }]);
          if (response.data?.choices?.[0]?.message?.content) {
            const aiAnswer = response.data.choices[0].message.content;
            debug('收到AI回答：\n' + aiAnswer);

            // 解析AI答案
            try {
              const cleanedResponse = aiAnswer.replace(/^```json\n|\n```$/g, '');
              const aiAnswers = JSON.parse(cleanedResponse);

              // 合并题库答案和AI答案
              Object.assign(answers, aiAnswers);
            } catch (error) {
              debug('解析AI回答失败：' + error.message);
              throw error;
            }
          } else {
            throw new Error('API响应格式错误');
          }
        }

        // 处理所有答案
        await this.processAIResponse(JSON.stringify(answers));
        debug('自动答题完成');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug('自动答题失败: ' + errorMessage);
      } finally {
        this.isProcessing = false;
      }
    }
    stopAutoAnswer() {
      this.isProcessing = false;
      debug('停止自动答题');
    }
    getQuestions() {
      return this.questions;
    }
    async processAIResponse(response) {
      try {
        // 尝试解析JSON格式的答案
        let answers;
        try {
          // 首先尝试移除markdown代码块标记
          const cleanedResponse = response.replace(/^```json\n|\n```$/g, '');
          answers = JSON.parse(cleanedResponse);

          // 过滤掉不在当前题目列表中的答案
          const validAnswers = {};
          const currentQuestionIndexes = this.questions.map(q => q.index.toString());
          for (const [index, answer] of Object.entries(answers)) {
            if (currentQuestionIndexes.includes(index)) {
              validAnswers[index] = answer;
            } else {
              debug(`跳过非当前题目的答案：题号 ${index}`);
            }
          }
          answers = validAnswers;
        } catch (e) {
          // 如果不是JSON格式，尝试解析普通文本格式
          answers = {};
          response.split(/[,;]/).forEach(item => {
            const match = item.trim().match(/(\d+):(.+)/);
            if (match) {
              answers[match[1]] = match[2].trim();
            }
          });
        }
        debug('解析后的答案对象：\n' + JSON.stringify(answers, null, 2));

        // 遍历所有答案
        for (const [questionNumber, answer] of Object.entries(answers)) {
          const index = parseInt(questionNumber);
          if (isNaN(index)) {
            debug(`跳过无效题号：${questionNumber}`);
            continue;
          }
          const question = this.questions.find(q => q.index === index);
          if (!question) {
            debug(`未找到题号 ${index} 对应的题目`);
            continue;
          }
          debug(`处理第 ${index} 题答案：\n类型：${question.type}\n答案：${answer}`);

          // 根据题目类型处理答案
          if (question.type === 'judgement') {
            // 判断题处理
            const cleanAnswer = answer.toLowerCase().trim();
            const isCorrect = cleanAnswer === '正确' || cleanAnswer === 'true' || cleanAnswer === '对' || cleanAnswer === '√' || cleanAnswer === 'a';

            // 获取当前题目的选项
            const options = question.element.querySelectorAll('.option');
            if (options.length !== 2) {
              debug(`判断题选项数量异常：${options.length}`);
              continue;
            }

            // 解析每个选项的文本
            const optionTexts = Array.from(options).map(opt => opt.textContent?.trim().toLowerCase() || '');

            // 判断第一个选项是否为"正确"
            const firstOptionCorrect = optionTexts[0].includes('正确') || optionTexts[0].includes('true') || optionTexts[0].includes('对') || optionTexts[0].includes('√');
            debug(`判断题 ${index} 选项顺序：${firstOptionCorrect ? '"正确"在前' : '"错误"在前'}`);
            debug(`判断题 ${index} 答案解析：${isCorrect ? '正确' : '错误'}`);

            // 根据答案和当前题目的选项顺序决定点击哪个选项
            const targetIndex = firstOptionCorrect ? isCorrect ? 1 : 2 :
            // 正确在前：正确选1，错误选2
            isCorrect ? 2 : 1; // 错误在前：正确选2，错误选1

            const targetOption = question.element.querySelector(`.option:nth-child(${targetIndex})`);
            if (targetOption) {
              debug(`点击判断题 ${index} 选项：${isCorrect ? '正确' : '错误'} (第${targetIndex}个选项)`);
              targetOption.click();
            } else {
              debug(`未找到判断题 ${index} 的选项元素`);
            }
          } else if (question.type === 'text') {
            // 填空题或简答题
            if (question.blanks && question.blanks.length > 0) {
              // 处理填空题
              debug(`第 ${index} 题是填空题，填空数量：${question.blanks.length}`);
              const answers = answer.split(':::').map(a => a.trim());
              for (let i = 0; i < question.blanks.length && i < answers.length; i++) {
                const blank = question.blanks[i];
                blank.element.value = answers[i];
                blank.element.dispatchEvent(new Event('input', {
                  bubbles: true
                }));
                blank.element.dispatchEvent(new Event('change', {
                  bubbles: true
                }));
              }
            } else {
              // 处理简答题
              debug(`第 ${index} 题是简答题`);
              const queTitle = question.element.querySelector('.que-title');
              if (queTitle) {
                const textarea = queTitle.nextElementSibling?.querySelector('.el-textarea__inner');
                if (textarea) {
                  debug('找到简答题的textarea元素');
                  textarea.value = answer;
                  textarea.dispatchEvent(new Event('input', {
                    bubbles: true
                  }));
                  textarea.dispatchEvent(new Event('change', {
                    bubbles: true
                  }));
                } else {
                  debug('未找到简答题的textarea元素');
                }
              } else {
                debug('未找到简答题的que-title元素');
              }
            }
          } else {
            // 选择题（单选、多选）
            debug(`第 ${index} 题是选择题，开始处理选项答案`);
            await this.processOptionAnswer(index, answer);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        debug('处理AI响应失败：' + errorMessage);
        throw error;
      }
    }
    async processOptionAnswer(questionIndex, answer) {
      const question = this.questions.find(q => q.index === questionIndex);
      if (!question || !question.options) {
        debug(`处理选项答案失败：未找到题目 ${questionIndex} 或题目没有选项`);
        return;
      }
      debug(`处理第 ${questionIndex} 题选项答案：\n题型：${question.type}\n答案：${answer}\n可用选项：${question.options.join(', ')}`);

      // 处理单选题和多选题
      let answerLetters = [];
      if (answer.includes('&')) {
        // 处理多选题格式 "A&B&C"
        answerLetters = answer.toUpperCase().split('&');
      } else if (answer.includes(',')) {
        // 处理多选题格式 "A,B,C"
        answerLetters = answer.toUpperCase().split(',');
      } else {
        // 处理单选题格式 "A" 或其他格式
        answerLetters = [answer.toUpperCase().charAt(0)];
      }
      debug(`答案字母：${answerLetters.join(', ')}`);
      for (const letter of answerLetters) {
        // 找到对应选项的索引（A=0, B=1, C=2, D=3）
        const optionIndex = letter.trim().charAt(0).charCodeAt(0) - 'A'.charCodeAt(0);
        if (optionIndex >= 0 && optionIndex < question.options.length) {
          const targetOption = question.element.querySelector(`.option:nth-child(${optionIndex + 1})`);
          if (targetOption) {
            debug(`点击选项 ${letter}：${question.options[optionIndex]}`);
            targetOption.click();
          } else {
            debug(`未找到选项 ${letter} 的元素`);
          }
        } else {
          debug(`选项索引超出范围：${letter} -> ${optionIndex}`);
        }
      }
    }
  }

  class ConfigPanel {
    constructor() {
      this.panel = this.createPanel();
      this.answerHandler = AnswerHandler.getInstance();
      this.currentConfig = getConfig();
      this.initEvents();
    }
    async show() {
      this.panel.style.display = 'block';

      // 加载已保存的配置
      const config = getConfig();
      document.getElementById('api-type').value = config.apiType;
      document.getElementById('api-key').value = config.apiKeys[config.apiType] || '';
      document.getElementById('custom-openai-url').value = config.customOpenAIUrl || '';
      document.getElementById('custom-openai-model').value = config.customOpenAIModel || '';

      // 显示/隐藏自定义URL和模型输入框
      this.toggleCustomUrlInput(config.apiType);

      // 只有当API key不为空时才验证
      if (config.apiKeys[config.apiType]) {
        this.validateApiKey(config.apiKeys[config.apiType] || '', config.apiType);
      }

      // 扫描并显示题目
      const questions = await this.answerHandler.scanQuestions();
      this.updateQuestionGrid(questions);

      // 添加选项点击的全局处理函数
      window.selectOption = (questionIndex, optionLetter) => {
        this.answerHandler.selectOption(questionIndex, optionLetter);
      };

      // 添加填空题输入框值更新的全局处理函数
      window.updateBlankValue = (questionIndex, blankNumber, value) => {
        const question = this.answerHandler.getQuestions().find(q => q.index === questionIndex);
        if (question?.blanks) {
          const blank = question.blanks.find(b => b.number === blankNumber);
          if (blank) {
            blank.element.value = value;
            blank.element.dispatchEvent(new Event('input', {
              bubbles: true
            }));
            blank.element.dispatchEvent(new Event('change', {
              bubbles: true
            }));
          }
        }
      };
    }
    hide() {
      this.panel.style.display = 'none';
    }
    createPanel() {
      const panel = document.createElement('div');
      panel.className = styles.configPanel;
      panel.innerHTML = `
            <div class="${styles.panelHeader}">
                <div class="${styles.closeBtn}" title="关闭">×</div>
            </div>
            <div class="${styles.tabContainer}">
                <div class="${styles.tab} ${styles.active}" data-tab="questions">识别题目</div>
                <div class="${styles.tab}" data-tab="api">API配置</div>
                <div class="${styles.tab}" data-tab="question-bank">题库配置</div>
            </div>
            <div class="${styles.tabContent} ${styles.active}" id="questions-tab">
                <div class="${styles.questionGrid}"></div>
                <div class="${styles.questionDetail}">
                    <p>请点击题号查看详细信息</p>
                </div>
                <div class="${styles.btnContainer}">
                    <button class="${styles.btn} ${styles.btnPrimary}" id="toggle-answer">开始答题</button>
                    <button class="${styles.btn} ${styles.btnDefault}" id="scan-questions">重新扫描</button>
                </div>
            </div>
            <div class="${styles.tabContent}" id="api-tab">
                <div class="${styles.apiConfig}">
                    <div class="${styles.formItem}">
                        <label>API类型</label>
                        <select id="api-type">
                            <option value="moonshot">Moonshot</option>
                            <option value="deepseek">Deepseek</option>
                            <option value="chatgpt">ChatGPT</option>
                            <option value="custom-openai">自定义OpenAI接口</option>
                        </select>
                    </div>
                    <div class="${styles.formItem}" id="custom-url-item" style="display: none;">
                        <label>自定义API地址</label>
                        <input type="text" id="custom-openai-url" placeholder="请输入自定义OpenAI API地址，如：https://new.ljcljc.cn/v1" value="">
                        <div class="${styles.apiKeyHelp}">
                            <p>请输入完整的API地址，包括协议和版本号</p>
                            <p>推荐使用 <a href="https://e.ljcsys.top/ai/" target="_blank" style="color: #409EFF; text-decoration: none;">AI API</a> 代理服务，支持 ChatGPT、Gemini、Claude 等主流模型，一键接入。</p>
                            <p><a href="https://new.ljcljc.cn/pricing" target="_blank" style="color: #409EFF; text-decoration: none;">查看模型列表</a></p>
                        </div>
                    </div>
                    <div class="${styles.formItem}" id="custom-model-item" style="display: none;">
                        <label>自定义模型</label>
                        <input type="text" id="custom-openai-model" placeholder="gpt-4.1" value="">
                    </div>
                    <div class="${styles.formItem}">
                        <label>API密钥</label>
                        <div class="${styles.inputGroup}">
                            <input type="password" id="api-key" placeholder="请输入API密钥" value="">
                            <button id="toggle-password" title="显示/隐藏密码">👁️</button>
                        </div>
                        <div class="${styles.apiKeyHelp}">
                            <p>API密钥格式说明：</p>
                            <ul>
                                <li>Moonshot: 以 sk- 开头</li>
                                <li>Deepseek: 以 sk- 开头</li>
                                <li>ChatGPT: 以 sk- 开头</li>
                                <li>自定义OpenAI: 以 sk- 开头</li>
                            </ul>
                        </div>
                    </div>
                    <div class="${styles.btnContainer}">
                        <button class="${styles.btn} ${styles.btnPrimary}" id="test-api">测试连接</button>
                        <button class="${styles.btn} ${styles.btnPrimary}" id="save-api">保存配置</button>
                        <button class="${styles.btn} ${styles.btnDefault}" id="close-panel">关闭</button>
                    </div>
                </div>
            </div>
            <div class="${styles.tabContent}" id="question-bank-tab">
                <div class="${styles.apiConfig}">
                    <div class="${styles.formItem}">
                        <label>题库Token</label>
                        <div class="${styles.inputGroup}">
                            <input type="password" id="question-bank-token" placeholder="请输入题库Token" value="">
                            <button id="toggle-bank-password" title="显示/隐藏密码">👁️</button>
                            <a href="https://tk.enncy.cn" target="_blank" class="${styles.getTokenBtn}">去获取</a>
                        </div>
                    </div>
                    <div class="${styles.btnContainer}">
                        <button class="${styles.btn} ${styles.btnPrimary}" id="test-bank">测试连接</button>
                        <button class="${styles.btn} ${styles.btnPrimary}" id="save-bank">保存配置</button>
                    </div>
                </div>
            </div>
        `;
      document.body.appendChild(panel);
      return panel;
    }
    initEvents() {
      // 初始化当前选中的API类型和对应的密钥
      const apiTypeSelect = document.getElementById('api-type');
      const apiKeyInput = document.getElementById('api-key');
      const customUrlInput = document.getElementById('custom-openai-url');
      apiTypeSelect.value = this.currentConfig.apiType;
      apiKeyInput.value = this.currentConfig.apiKeys[this.currentConfig.apiType] || '';
      customUrlInput.value = this.currentConfig.customOpenAIUrl || '';

      // 初始化自定义URL输入框的显示状态
      this.toggleCustomUrlInput(this.currentConfig.apiType);

      // 关闭按钮事件
      this.panel.querySelector(`.${styles.closeBtn}`)?.addEventListener('click', () => {
        this.hide();
      });

      // 关闭面板按钮事件
      document.getElementById('close-panel')?.addEventListener('click', () => {
        this.hide();
      });

      // 切换密码显示状态
      document.getElementById('toggle-password')?.addEventListener('click', event => {
        const button = event.target;
        const input = document.getElementById('api-key');
        if (input.type === 'password') {
          input.type = 'text';
          button.textContent = '🔒';
        } else {
          input.type = 'password';
          button.textContent = '👁️';
        }
      });

      // 切换标签页
      this.panel.querySelectorAll(`.${styles.tab}`).forEach(tab => {
        tab.addEventListener('click', () => {
          // 移除所有标签页的active类
          this.panel.querySelectorAll(`.${styles.tab}`).forEach(t => t.classList.remove(styles.active));

          // 移除所有内容区的active类
          this.panel.querySelectorAll(`.${styles.tabContent}`).forEach(c => c.classList.remove(styles.active));

          // 添加当前标签页的active类
          tab.classList.add(styles.active);

          // 添加对应内容区的active类
          const tabId = tab.dataset.tab;
          document.getElementById(`${tabId}-tab`)?.classList.add(styles.active);
        });
      });

      // API类型切换时加载对应的API密钥
      document.getElementById('api-type')?.addEventListener('change', event => {
        const apiType = event.target.value;
        const apiKeyInput = document.getElementById('api-key');
        apiKeyInput.value = this.currentConfig.apiKeys[apiType] || '';
        this.validateApiKey(apiKeyInput.value, apiType);
        this.toggleCustomUrlInput(apiType);
      });

      // API密钥输入时实时验证
      document.getElementById('api-key')?.addEventListener('input', event => {
        const apiKey = event.target.value;
        const apiType = document.getElementById('api-type').value;
        this.validateApiKey(apiKey, apiType);
      });

      // 测试API连接
      document.getElementById('test-api')?.addEventListener('click', async () => {
        const button = document.getElementById('test-api');
        if (!button) return;
        const apiKey = document.getElementById('api-key').value;
        const apiType = document.getElementById('api-type').value;
        const customUrl = document.getElementById('custom-openai-url').value;
        if (!this.validateApiKey(apiKey, apiType)) {
          return;
        }
        if (apiType === 'custom-openai' && !customUrl.trim()) {
          alert('请输入自定义API地址');
          return;
        }
        try {
          button.textContent = '测试中...';
          button.disabled = true;
          const customModel = document.getElementById('custom-openai-model').value;

          // 创建临时配置进行测试
          const testConfig = {
            ...this.currentConfig,
            apiType,
            apiKeys: {
              ...this.currentConfig.apiKeys,
              [apiType]: apiKey
            },
            customOpenAIUrl: apiType === 'custom-openai' ? customUrl : this.currentConfig.customOpenAIUrl,
            customOpenAIModel: apiType === 'custom-openai' ? customModel || 'gpt-4.1' : this.currentConfig.customOpenAIModel
          };

          // 临时保存配置用于测试
          saveConfig(testConfig);

          // 重置API提供者以使用新配置
          APIFactory.getInstance().resetProvider();
          const provider = APIFactory.getInstance().getProvider();
          const response = await provider.chat([{
            role: 'user',
            content: '你好，这是一个测试消息。请回复"连接成功"。'
          }]);
          if (response.data?.choices?.[0]?.message?.content.includes('连接成功')) {
            alert('API连接测试成功！');
          } else {
            alert('API连接测试失败：响应格式不正确');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          alert('API连接测试失败：' + errorMessage);
        } finally {
          button.textContent = '测试连接';
          button.disabled = false;

          // 恢复原始配置
          saveConfig(this.currentConfig);
          APIFactory.getInstance().resetProvider();
        }
      });

      // 保存API配置
      document.getElementById('save-api')?.addEventListener('click', () => {
        const apiKey = document.getElementById('api-key').value;
        const apiType = document.getElementById('api-type').value;
        const customUrl = document.getElementById('custom-openai-url').value;
        if (!this.validateApiKey(apiKey, apiType)) {
          return;
        }
        if (apiType === 'custom-openai' && !customUrl.trim()) {
          alert('请输入自定义API地址');
          return;
        }
        const customModel = document.getElementById('custom-openai-model').value;

        // 更新配置
        this.currentConfig = {
          ...this.currentConfig,
          apiType,
          apiKeys: {
            ...this.currentConfig.apiKeys,
            [apiType]: apiKey
          },
          customOpenAIUrl: apiType === 'custom-openai' ? customUrl : this.currentConfig.customOpenAIUrl,
          customOpenAIModel: apiType === 'custom-openai' ? customModel || 'gpt-4.1' : this.currentConfig.customOpenAIModel
        };

        // 保存配置
        saveConfig(this.currentConfig);

        // 重置API提供者，这样下次使用时会使用新的配置
        APIFactory.getInstance().resetProvider();
        alert('配置已保存');
      });

      // 初始化题库token
      const questionBankInput = document.getElementById('question-bank-token');
      questionBankInput.value = this.currentConfig.questionBankToken || '';

      // 切换题库密码显示状态
      document.getElementById('toggle-bank-password')?.addEventListener('click', event => {
        const button = event.target;
        const input = document.getElementById('question-bank-token');
        if (input.type === 'password') {
          input.type = 'text';
          button.textContent = '🔒';
        } else {
          input.type = 'password';
          button.textContent = '👁️';
        }
      });

      // 测试题库连接
      document.getElementById('test-bank')?.addEventListener('click', async () => {
        const button = document.getElementById('test-bank');
        if (!button) return;
        const token = document.getElementById('question-bank-token').value;
        if (!token) {
          alert('请输入题库Token');
          return;
        }
        try {
          button.textContent = '测试中...';
          button.disabled = true;

          // 添加超时控制
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('连接超时')), 5000);
          });
          const questionBank = new QuestionBankAPI(token);
          const testPromise = questionBank.query('下列选项中，用于获取POST请求参数的是');

          // 使用Promise.race实现超时控制
          const result = await Promise.race([testPromise, timeoutPromise]);
          if (result !== null) {
            alert('题库连接测试成功！');
            // 测试成功后自动保存配置
            this.currentConfig = {
              ...this.currentConfig,
              questionBankToken: token
            };
            saveConfig(this.currentConfig);
            debug('题库配置已保存');
          } else {
            alert('题库连接测试失败：请检查Token是否正确');
          }
        } catch (error) {
          alert('题库连接测试失败：' + error.message);
        } finally {
          button.textContent = '测试连接';
          button.disabled = false;
        }
      });

      // 保存题库配置
      document.getElementById('save-bank')?.addEventListener('click', () => {
        const token = document.getElementById('question-bank-token').value;

        // 更新配置
        this.currentConfig = {
          ...this.currentConfig,
          questionBankToken: token
        };

        // 保存配置
        saveConfig(this.currentConfig);

        // 重置API提供者
        APIFactory.getInstance().resetProvider();
        alert('配置已保存');
      });

      // 开始答题按钮事件
      document.getElementById('toggle-answer')?.addEventListener('click', async () => {
        const button = document.getElementById('toggle-answer');
        if (!button) return;
        if (this.answerHandler.isProcessing) {
          this.answerHandler.stopAutoAnswer();
          button.textContent = '开始答题';
          button.classList.remove(styles.btnDanger);
          button.classList.add(styles.btnPrimary);
        } else {
          button.textContent = '停止答题';
          button.classList.remove(styles.btnPrimary);
          button.classList.add(styles.btnDanger);
          await this.answerHandler.startAutoAnswer();
          button.textContent = '开始答题';
          button.classList.remove(styles.btnDanger);
          button.classList.add(styles.btnPrimary);
        }
      });

      // 重新扫描按钮事件
      document.getElementById('scan-questions')?.addEventListener('click', async () => {
        await this.answerHandler.scanQuestions();
        const questions = await this.answerHandler.scanQuestions();
        this.updateQuestionGrid(questions);
      });
    }
    toggleCustomUrlInput(apiType) {
      const customUrlItem = document.getElementById('custom-url-item');
      const customModelItem = document.getElementById('custom-model-item');
      if (customUrlItem && customModelItem) {
        if (apiType === 'custom-openai') {
          customUrlItem.style.display = 'block';
          customModelItem.style.display = 'block';
        } else {
          customUrlItem.style.display = 'none';
          customModelItem.style.display = 'none';
        }
      }
    }
    validateApiKey(apiKey, apiType) {
      const input = document.getElementById('api-key');
      const saveButton = document.getElementById('save-api');
      const testButton = document.getElementById('test-api');

      // 如果为空，允许通过（因为可能是初始状态）
      if (!apiKey) {
        input.classList.remove(styles.error);
        saveButton.disabled = false;
        testButton.disabled = false;
        return true;
      }

      // 不能有空格
      if (apiKey.trim() !== apiKey) {
        input.classList.add(styles.error);
        alert('API密钥不能包含空格');
        return false;
      }
      input.classList.remove(styles.error);
      saveButton.disabled = false;
      testButton.disabled = false;
      return true;
    }
    updateQuestionGrid(questions) {
      const grid = this.panel.querySelector(`.${styles.questionGrid}`);
      if (!grid) return;
      grid.innerHTML = '';
      questions.forEach(question => {
        const box = document.createElement('div');
        box.className = `${styles.questionBox} ${question.answer ? styles.completed : ''}`;
        box.textContent = question.index.toString();
        box.onclick = () => this.showQuestionDetail(question);
        grid.appendChild(box);
      });
    }
    showQuestionDetail(question) {
      const detail = this.panel.querySelector(`.${styles.questionDetail}`);
      if (!detail) return;
      detail.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 12px; color: #303133;">题目内容：</h4>
                <p style="line-height: 1.6; color: #606266;">${question.content.split('\n').join('<br>')}</p>
            </div>
            ${question.options ? `
                <div class="options-section" style="margin: 20px 0;">
                    <h4 style="margin-bottom: 12px; color: #303133;">选项：</h4>
                    <ul style="list-style: none; padding-left: 0;">
                        ${question.options.map(option => {
      // 判断题特殊处理
      if (question.type === 'judgement') {
        const isCorrectOption = option.startsWith('A');
        return `
                                    <li style="margin: 12px 0; padding: 8px 12px; background: #f5f7fa; border-radius: 4px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center;" 
                                        onmouseover="this.style.background='#ecf5ff'" 
                                        onmouseout="this.style.background='#f5f7fa'"
                                        onclick="window.selectOption(${question.index}, '${option.charAt(0)}')"
                                    >
                                        <span style="font-weight: bold; margin-right: 10px;">${option.charAt(0)}.</span>
                                        <span>${isCorrectOption ? '正确' : '错误'}</span>
                                    </li>
                                `;
      }
      // 其他题型正常显示
      return `
                                <li style="margin: 12px 0; padding: 8px 12px; background: #f5f7fa; border-radius: 4px; cursor: pointer; transition: all 0.3s;" 
                                    onmouseover="this.style.background='#ecf5ff'" 
                                    onmouseout="this.style.background='#f5f7fa'"
                                    onclick="window.selectOption(${question.index}, '${option.charAt(0)}')"
                                >${option}</li>
                            `;
    }).join('')}
                    </ul>
                </div>
            ` : ''}
            ${question.answer ? `
                <div class="answer-section" style="margin-top: 20px;">
                    <h4 style="margin-bottom: 12px; color: #303133;">答案：</h4>
                    <p style="line-height: 1.6; color: #409EFF;">${question.answer}</p>
                </div>
            ` : ''}
        `;
    }
  }

  function init() {
    try {
      debug('开始初始化');

      // 创建配置按钮
      const configBtn = document.createElement('button');
      configBtn.className = styles.configBtn;
      configBtn.textContent = '⚙️';

      // 创建配置面板实例
      const configPanel = new ConfigPanel();

      // 点击配置按钮显示面板
      configBtn.onclick = () => {
        configPanel.show();
      };
      document.body.appendChild(configBtn);
      debug('初始化完成');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      debug('初始化失败: ' + errorMessage);
    }
  }

  // 等待页面加载完成后再初始化
  if (document.readyState === 'loading') {
    debug('等待页面加载');
    document.addEventListener('DOMContentLoaded', init);
  } else {
    debug('页面已加载，直接初始化');
    init();
  }

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LnVzZXIuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi9zcmMvdXRpbHMvY29uZmlnLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZXNjcmlwdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jbGFzc29mLXJhdy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbmRleGVkLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtY2FsbGFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1idWlsdC1pbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtc3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXN5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90cnktdG8tc3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtY2FsbGFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LWdsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQtc3RvcmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hpZGRlbi1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLW5hbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLWluc3RhbmNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9odG1sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29ycmVjdC1wcm90b3R5cGUtZ2V0dGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IuY29uc3RydWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3ItY2xvc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXNuZXh0Lml0ZXJhdG9yLmZpbmQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzbmV4dC5pdGVyYXRvci5mb3ItZWFjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWRlZmluZS1hbGwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3ItY3JlYXRlLXByb3h5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IubWFwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IuZmlsdGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IucmVkdWNlLmpzIiwiLi4vc3JjL3V0aWxzL3Byb21wdC1nZW5lcmF0b3IudHMiLCIuLi9zcmMvdXRpbHMvYXBpL2V2ZW50LWVtaXR0ZXIudHMiLCIuLi9zcmMvdXRpbHMvYXBpL2Jhc2UudHMiLCIuLi9zcmMvdXRpbHMvYXBpL21vb25zaG90LnRzIiwiLi4vc3JjL3V0aWxzL2FwaS9kZWVwc2Vlay50cyIsIi4uL3NyYy91dGlscy9hcGkvY2hhdGdwdC50cyIsIi4uL3NyYy91dGlscy9hcGkvY3VzdG9tLW9wZW5haS50cyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXNuZXh0Lml0ZXJhdG9yLnNvbWUuanMiLCIuLi9zcmMvdXRpbHMvYXBpL3F1ZXN0aW9uLWJhbmsudHMiLCIuLi9zcmMvdXRpbHMvYXBpL2ZhY3RvcnkudHMiLCIuLi9zcmMvdXRpbHMvYW5zd2VyLnRzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29uZmlnUGFuZWwudHMiLCIuLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xyXG4gICAgYXBpVHlwZTogJ21vb25zaG90JyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCcgfCAnY3VzdG9tLW9wZW5haSc7XHJcbiAgICBhcGlLZXlzOiB7XHJcbiAgICAgICAgbW9vbnNob3Q/OiBzdHJpbmc7XHJcbiAgICAgICAgZGVlcHNlZWs/OiBzdHJpbmc7XHJcbiAgICAgICAgY2hhdGdwdD86IHN0cmluZztcclxuICAgICAgICAnY3VzdG9tLW9wZW5haSc/OiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgY3VzdG9tT3BlbkFJVXJsPzogc3RyaW5nO1xyXG4gICAgY3VzdG9tT3BlbkFJTW9kZWw/OiBzdHJpbmc7XHJcbiAgICBxdWVzdGlvbkJhbmtUb2tlbj86IHN0cmluZztcclxuICAgIGRlYnVnTW9kZTogYm9vbGVhbjtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdENvbmZpZzogQ29uZmlnID0ge1xyXG4gICAgYXBpVHlwZTogJ21vb25zaG90JyxcclxuICAgIGFwaUtleXM6IHt9LFxyXG4gICAgY3VzdG9tT3BlbkFJVXJsOiAnaHR0cHM6Ly9uZXcubGpjbGpjLmNuL3YxJyxcclxuICAgIGN1c3RvbU9wZW5BSU1vZGVsOiAnZ3B0LTQuMScsXHJcbiAgICBkZWJ1Z01vZGU6IHRydWVcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcclxuICAgIGNvbnN0IHNhdmVkQ29uZmlnID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dG8tYW5zd2VyLWNvbmZpZycpO1xyXG4gICAgaWYgKHNhdmVkQ29uZmlnKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShzYXZlZENvbmZpZyk7XHJcbiAgICAgICAgLy8g5YW85a655pen54mI5pys6YWN572uXHJcbiAgICAgICAgaWYgKCdhcGlLZXknIGluIGNvbmZpZykge1xyXG4gICAgICAgICAgICBjb25zdCBvbGRBcGlLZXkgPSBjb25maWcuYXBpS2V5O1xyXG4gICAgICAgICAgICBjb25maWcuYXBpS2V5cyA9IHtcclxuICAgICAgICAgICAgICAgIFtjb25maWcuYXBpVHlwZV06IG9sZEFwaUtleVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLmFwaUtleTtcclxuICAgICAgICAgICAgc2F2ZUNvbmZpZyhjb25maWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZmF1bHRDb25maWc7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQ29uZmlnKGNvbmZpZzogQ29uZmlnKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXV0by1hbnN3ZXItY29uZmlnJywgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyhtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xyXG4gICAgaWYgKGNvbmZpZy5kZWJ1Z01vZGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnW+iHquWKqOetlOmimOWKqeaJi10nLCBtZXNzYWdlKTtcclxuICAgIH1cclxufSIsInZhciBjaGVjayA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgJiYgaXQuTWF0aCA9PSBNYXRoICYmIGl0O1xufTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbm1vZHVsZS5leHBvcnRzID1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWdsb2JhbC10aGlzIC0tIHNhZmVcbiAgY2hlY2sodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgY2hlY2sodHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmKSB8fFxuICBjaGVjayh0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCkgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jIC0tIGZhbGxiYWNrXG4gIChmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KSgpIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIERldGVjdCBJRTgncyBpbmNvbXBsZXRlIGRlZmluZVByb3BlcnR5IGltcGxlbWVudGF0aW9uXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgMSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSlbMV0gIT0gNztcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICEkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG52YXIgc3BsaXQgPSAnJy5zcGxpdDtcblxuLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3Ncbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyB0aHJvd3MgYW4gZXJyb3IgaW4gcmhpbm8sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9yaGluby9pc3N1ZXMvMzQ2XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgLS0gc2FmZVxuICByZXR1cm4gIU9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApO1xufSkgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoaXQpID09ICdTdHJpbmcnID8gc3BsaXQuY2FsbChpdCwgJycpIDogT2JqZWN0KGl0KTtcbn0gOiBPYmplY3Q7XG4iLCIvLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlcXVpcmVvYmplY3Rjb2VyY2libGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcbiIsIi8vIGBJc0NhbGxhYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXNjYWxsYWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogaXNDYWxsYWJsZShpdCk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzQ2FsbGFibGUoYXJndW1lbnQpID8gYXJndW1lbnQgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pIDogZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCduYXZpZ2F0b3InLCAndXNlckFnZW50JykgfHwgJyc7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudCcpO1xuXG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIERlbm8gPSBnbG9iYWwuRGVubztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucyB8fCBEZW5vICYmIERlbm8udmVyc2lvbjtcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4O1xudmFyIG1hdGNoLCB2ZXJzaW9uO1xuXG5pZiAodjgpIHtcbiAgbWF0Y2ggPSB2OC5zcGxpdCgnLicpO1xuICB2ZXJzaW9uID0gbWF0Y2hbMF0gPCA0ID8gMSA6IG1hdGNoWzBdICsgbWF0Y2hbMV07XG59IGVsc2UgaWYgKHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9IG1hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbiAmJiArdmVyc2lvbjtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9IFN5bWJvbCgpO1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBgZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzYCBwb2x5ZmlsbCBzeW1ib2xzIGNvbnZlcnRlZCB0byBvYmplY3QgYXJlIG5vdCBTeW1ib2wgaW5zdGFuY2VzXG4gIHJldHVybiAhU3RyaW5nKHN5bWJvbCkgfHwgIShPYmplY3Qoc3ltYm9sKSBpbnN0YW5jZW9mIFN5bWJvbCkgfHxcbiAgICAvLyBDaHJvbWUgMzgtNDAgc3ltYm9scyBhcmUgbm90IGluaGVyaXRlZCBmcm9tIERPTSBjb2xsZWN0aW9ucyBwcm90b3R5cGVzIHRvIGluc3RhbmNlc1xuICAgICFTeW1ib2wuc2hhbSAmJiBWOF9WRVJTSU9OICYmIFY4X1ZFUlNJT04gPCA0MTtcbn0pO1xuIiwiLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAmJiAhU3ltYm9sLnNoYW1cbiAgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJztcbiIsInZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVTRV9TWU1CT0xfQVNfVUlEID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHZhciAkU3ltYm9sID0gZ2V0QnVpbHRJbignU3ltYm9sJyk7XG4gIHJldHVybiBpc0NhbGxhYmxlKCRTeW1ib2wpICYmIE9iamVjdChpdCkgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIFN0cmluZyhhcmd1bWVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuICdPYmplY3QnO1xuICB9XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciB0cnlUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90cnktdG8tc3RyaW5nJyk7XG5cbi8vIGBBc3NlcnQ6IElzQ2FsbGFibGUoYXJndW1lbnQpIGlzIHRydWVgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNDYWxsYWJsZShhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgVHlwZUVycm9yKHRyeVRvU3RyaW5nKGFyZ3VtZW50KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbn07XG4iLCJ2YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcblxuLy8gYEdldE1ldGhvZGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldG1ldGhvZFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoViwgUCkge1xuICB2YXIgZnVuYyA9IFZbUF07XG4gIHJldHVybiBmdW5jID09IG51bGwgPyB1bmRlZmluZWQgOiBhQ2FsbGFibGUoZnVuYyk7XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxuLy8gYE9yZGluYXJ5VG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKHByZWYgPT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKGlzQ2FsbGFibGUoZm4gPSBpbnB1dC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICBpZiAocHJlZiAhPT0gJ3N0cmluZycgJiYgaXNDYWxsYWJsZShmbiA9IGlucHV0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsIGtleSwgeyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCBzZXRHbG9iYWwoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCJ2YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiAnMy4xOC4zJyxcbiAgbW9kZTogSVNfUFVSRSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIxIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxuLy8gYFRvT2JqZWN0YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9vYmplY3Rcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudCkpO1xufTtcbiIsInZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcblxudmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5cbi8vIGBIYXNPd25Qcm9wZXJ0eWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWhhc293bnByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5oYXNPd24gfHwgZnVuY3Rpb24gaGFzT3duKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwodG9PYmplY3QoaXQpLCBrZXkpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcG9zdGZpeCA9IE1hdGgucmFuZG9tKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnICsgU3RyaW5nKGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXkpICsgJylfJyArICgrK2lkICsgcG9zdGZpeCkudG9TdHJpbmcoMzYpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VpZCcpO1xudmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xudmFyIFVTRV9TWU1CT0xfQVNfVUlEID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkJyk7XG5cbnZhciBXZWxsS25vd25TeW1ib2xzU3RvcmUgPSBzaGFyZWQoJ3drcycpO1xudmFyIFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgY3JlYXRlV2VsbEtub3duU3ltYm9sID0gVVNFX1NZTUJPTF9BU19VSUQgPyBTeW1ib2wgOiBTeW1ib2wgJiYgU3ltYm9sLndpdGhvdXRTZXR0ZXIgfHwgdWlkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghaGFzT3duKFdlbGxLbm93blN5bWJvbHNTdG9yZSwgbmFtZSkgfHwgIShOQVRJVkVfU1lNQk9MIHx8IHR5cGVvZiBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPT0gJ3N0cmluZycpKSB7XG4gICAgaWYgKE5BVElWRV9TWU1CT0wgJiYgaGFzT3duKFN5bWJvbCwgbmFtZSkpIHtcbiAgICAgIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IFN5bWJvbFtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gY3JlYXRlV2VsbEtub3duU3ltYm9sKCdTeW1ib2wuJyArIG5hbWUpO1xuICAgIH1cbiAgfSByZXR1cm4gV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcbnZhciBnZXRNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LW1ldGhvZCcpO1xudmFyIG9yZGluYXJ5VG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19QUklNSVRJVkUgPSB3ZWxsS25vd25TeW1ib2woJ3RvUHJpbWl0aXZlJyk7XG5cbi8vIGBUb1ByaW1pdGl2ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICBpZiAoIWlzT2JqZWN0KGlucHV0KSB8fCBpc1N5bWJvbChpbnB1dCkpIHJldHVybiBpbnB1dDtcbiAgdmFyIGV4b3RpY1RvUHJpbSA9IGdldE1ldGhvZChpbnB1dCwgVE9fUFJJTUlUSVZFKTtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGV4b3RpY1RvUHJpbSkge1xuICAgIGlmIChwcmVmID09PSB1bmRlZmluZWQpIHByZWYgPSAnZGVmYXVsdCc7XG4gICAgcmVzdWx0ID0gZXhvdGljVG9QcmltLmNhbGwoaW5wdXQsIHByZWYpO1xuICAgIGlmICghaXNPYmplY3QocmVzdWx0KSB8fCBpc1N5bWJvbChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbiAgfVxuICBpZiAocHJlZiA9PT0gdW5kZWZpbmVkKSBwcmVmID0gJ251bWJlcic7XG4gIHJldHVybiBvcmRpbmFyeVRvUHJpbWl0aXZlKGlucHV0LCBwcmVmKTtcbn07XG4iLCJ2YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlJyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG5cbi8vIGBUb1Byb3BlcnR5S2V5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcm9wZXJ0eWtleVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIGtleSA9IHRvUHJpbWl0aXZlKGFyZ3VtZW50LCAnc3RyaW5nJyk7XG4gIHJldHVybiBpc1N5bWJvbChrZXkpID8ga2V5IDogU3RyaW5nKGtleSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcblxuLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhREVTQ1JJUFRPUlMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aWVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRlRWxlbWVudCgnZGl2JyksICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfVxuICB9KS5hICE9IDc7XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlJyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9Qcm9wZXJ0eUtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JbmRleGVkT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXNPd24oTywgUCkpIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoIXByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG4vLyBgQXNzZXJ0OiBUeXBlKGFyZ3VtZW50KSBpcyBPYmplY3RgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNPYmplY3QoYXJndW1lbnQpKSByZXR1cm4gYXJndW1lbnQ7XG4gIHRocm93IFR5cGVFcnJvcihTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKG9iamVjdCwga2V5LCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxudmFyIGZ1bmN0aW9uVG9TdHJpbmcgPSBGdW5jdGlvbi50b1N0cmluZztcblxuLy8gdGhpcyBoZWxwZXIgYnJva2VuIGluIGBjb3JlLWpzQDMuNC4xLTMuNC40YCwgc28gd2UgY2FuJ3QgdXNlIGBzaGFyZWRgIGhlbHBlclxuaWYgKCFpc0NhbGxhYmxlKHN0b3JlLmluc3BlY3RTb3VyY2UpKSB7XG4gIHN0b3JlLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25Ub1N0cmluZy5jYWxsKGl0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZS5pbnNwZWN0U291cmNlO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQ2FsbGFibGUoV2Vha01hcCkgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KGluc3BlY3RTb3VyY2UoV2Vha01hcCkpO1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBOQVRJVkVfV0VBS19NQVAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxudmFyIE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEID0gJ09iamVjdCBhbHJlYWR5IGluaXRpYWxpemVkJztcbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcztcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyhpdCkgPyBnZXQoaXQpIDogc2V0KGl0LCB7fSk7XG59O1xuXG52YXIgZ2V0dGVyRm9yID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBpZiAoIWlzT2JqZWN0KGl0KSB8fCAoc3RhdGUgPSBnZXQoaXQpKS50eXBlICE9PSBUWVBFKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkJyk7XG4gICAgfSByZXR1cm4gc3RhdGU7XG4gIH07XG59O1xuXG5pZiAoTkFUSVZFX1dFQUtfTUFQIHx8IHNoYXJlZC5zdGF0ZSkge1xuICB2YXIgc3RvcmUgPSBzaGFyZWQuc3RhdGUgfHwgKHNoYXJlZC5zdGF0ZSA9IG5ldyBXZWFrTWFwKCkpO1xuICB2YXIgd21nZXQgPSBzdG9yZS5nZXQ7XG4gIHZhciB3bWhhcyA9IHN0b3JlLmhhcztcbiAgdmFyIHdtc2V0ID0gc3RvcmUuc2V0O1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKHdtaGFzLmNhbGwoc3RvcmUsIGl0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcihPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCk7XG4gICAgbWV0YWRhdGEuZmFjYWRlID0gaXQ7XG4gICAgd21zZXQuY2FsbChzdG9yZSwgaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWdldC5jYWxsKHN0b3JlLCBpdCkgfHwge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWhhcy5jYWxsKHN0b3JlLCBpdCk7XG4gIH07XG59IGVsc2Uge1xuICB2YXIgU1RBVEUgPSBzaGFyZWRLZXkoJ3N0YXRlJyk7XG4gIGhpZGRlbktleXNbU1RBVEVdID0gdHJ1ZTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGlmIChoYXNPd24oaXQsIFNUQVRFKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCk7XG4gICAgbWV0YWRhdGEuZmFjYWRlID0gaXQ7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGl0LCBTVEFURSwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhc093bihpdCwgU1RBVEUpID8gaXRbU1RBVEVdIDoge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBoYXNPd24oaXQsIFNUQVRFKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0LFxuICBnZXQ6IGdldCxcbiAgaGFzOiBoYXMsXG4gIGVuZm9yY2U6IGVuZm9yY2UsXG4gIGdldHRlckZvcjogZ2V0dGVyRm9yXG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldERlc2NyaXB0b3IgPSBERVNDUklQVE9SUyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG52YXIgRVhJU1RTID0gaGFzT3duKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpO1xuLy8gYWRkaXRpb25hbCBwcm90ZWN0aW9uIGZyb20gbWluaWZpZWQgLyBtYW5nbGVkIC8gZHJvcHBlZCBmdW5jdGlvbiBuYW1lc1xudmFyIFBST1BFUiA9IEVYSVNUUyAmJiAoZnVuY3Rpb24gc29tZXRoaW5nKCkgeyAvKiBlbXB0eSAqLyB9KS5uYW1lID09PSAnc29tZXRoaW5nJztcbnZhciBDT05GSUdVUkFCTEUgPSBFWElTVFMgJiYgKCFERVNDUklQVE9SUyB8fCAoREVTQ1JJUFRPUlMgJiYgZ2V0RGVzY3JpcHRvcihGdW5jdGlvblByb3RvdHlwZSwgJ25hbWUnKS5jb25maWd1cmFibGUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVYSVNUUzogRVhJU1RTLFxuICBQUk9QRVI6IFBST1BFUixcbiAgQ09ORklHVVJBQkxFOiBDT05GSUdVUkFCTEVcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xudmFyIGluc3BlY3RTb3VyY2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5zcGVjdC1zb3VyY2UnKTtcbnZhciBJbnRlcm5hbFN0YXRlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJyk7XG52YXIgQ09ORklHVVJBQkxFX0ZVTkNUSU9OX05BTUUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tbmFtZScpLkNPTkZJR1VSQUJMRTtcblxudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcbnZhciBlbmZvcmNlSW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZW5mb3JjZTtcbnZhciBURU1QTEFURSA9IFN0cmluZyhTdHJpbmcpLnNwbGl0KCdTdHJpbmcnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHVuc2FmZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMudW5zYWZlIDogZmFsc2U7XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zID8gISFvcHRpb25zLmVudW1lcmFibGUgOiBmYWxzZTtcbiAgdmFyIG5vVGFyZ2V0R2V0ID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5ub1RhcmdldEdldCA6IGZhbHNlO1xuICB2YXIgbmFtZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5uYW1lICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5hbWUgOiBrZXk7XG4gIHZhciBzdGF0ZTtcbiAgaWYgKGlzQ2FsbGFibGUodmFsdWUpKSB7XG4gICAgaWYgKFN0cmluZyhuYW1lKS5zbGljZSgwLCA3KSA9PT0gJ1N5bWJvbCgnKSB7XG4gICAgICBuYW1lID0gJ1snICsgU3RyaW5nKG5hbWUpLnJlcGxhY2UoL15TeW1ib2xcXCgoW14pXSopXFwpLywgJyQxJykgKyAnXSc7XG4gICAgfVxuICAgIGlmICghaGFzT3duKHZhbHVlLCAnbmFtZScpIHx8IChDT05GSUdVUkFCTEVfRlVOQ1RJT05fTkFNRSAmJiB2YWx1ZS5uYW1lICE9PSBuYW1lKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHZhbHVlLCAnbmFtZScsIG5hbWUpO1xuICAgIH1cbiAgICBzdGF0ZSA9IGVuZm9yY2VJbnRlcm5hbFN0YXRlKHZhbHVlKTtcbiAgICBpZiAoIXN0YXRlLnNvdXJjZSkge1xuICAgICAgc3RhdGUuc291cmNlID0gVEVNUExBVEUuam9pbih0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJyA/IG5hbWUgOiAnJyk7XG4gICAgfVxuICB9XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIHNldEdsb2JhbChrZXksIHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoIXVuc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gIH0gZWxzZSBpZiAoIW5vVGFyZ2V0R2V0ICYmIE9ba2V5XSkge1xuICAgIHNpbXBsZSA9IHRydWU7XG4gIH1cbiAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gIGVsc2UgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KE8sIGtleSwgdmFsdWUpO1xuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gaXNDYWxsYWJsZSh0aGlzKSAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSk7XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJPckluZmluaXR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9pbnRlZ2Vyb3JpbmZpbml0eVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIG51bWJlciA9ICthcmd1bWVudDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBzYWZlXG4gIHJldHVybiBudW1iZXIgIT09IG51bWJlciB8fCBudW1iZXIgPT09IDAgPyAwIDogKG51bWJlciA+IDAgPyBmbG9vciA6IGNlaWwpKG51bWJlcik7XG59O1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIEhlbHBlciBmb3IgYSBwb3B1bGFyIHJlcGVhdGluZyBjYXNlIG9mIHRoZSBzcGVjOlxuLy8gTGV0IGludGVnZXIgYmUgPyBUb0ludGVnZXIoaW5kZXgpLlxuLy8gSWYgaW50ZWdlciA8IDAsIGxldCByZXN1bHQgYmUgbWF4KChsZW5ndGggKyBpbnRlZ2VyKSwgMCk7IGVsc2UgbGV0IHJlc3VsdCBiZSBtaW4oaW50ZWdlciwgbGVuZ3RoKS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluKGludGVnZXIsIGxlbmd0aCk7XG59O1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIGBUb0xlbmd0aGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbGVuZ3RoXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gYXJndW1lbnQgPiAwID8gbWluKHRvSW50ZWdlck9ySW5maW5pdHkoYXJndW1lbnQpLCAweDFGRkZGRkZGRkZGRkZGKSA6IDA7IC8vIDIgKiogNTMgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCJ2YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG5cbi8vIGBMZW5ndGhPZkFycmF5TGlrZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvTGVuZ3RoKG9iai5sZW5ndGgpO1xufTtcbiIsInZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciBsZW5ndGhPZkFycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZScpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgaW5kZXhPZiwgaW5jbHVkZXMgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0luZGV4ZWRPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSBsZW5ndGhPZkFycmF5TGlrZShPKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZSAtLSBOYU4gY2hlY2tcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbiAgaW5jbHVkZXM6IGNyZWF0ZU1ldGhvZCh0cnVlKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5pbmRleE9mYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuICBpbmRleE9mOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwidmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzT3duKGhpZGRlbktleXMsIGtleSkgJiYgaGFzT3duKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhc093bihPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5pbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gSUU4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2NvbnN0cnVjdG9yJyxcbiAgJ2hhc093blByb3BlcnR5JyxcbiAgJ2lzUHJvdG90eXBlT2YnLFxuICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAndG9Mb2NhbGVTdHJpbmcnLFxuICAndG9TdHJpbmcnLFxuICAndmFsdWVPZidcbl07XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG52YXIgaGlkZGVuS2V5cyA9IGVudW1CdWdLZXlzLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHluYW1lc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eW5hbWVzIC0tIHNhZmVcbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gaW50ZXJuYWxPYmplY3RLZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlzeW1ib2xzIC0tIHNhZmVcbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcblxuLy8gYWxsIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBub24tZW51bWVyYWJsZSBhbmQgc3ltYm9sc1xubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdSZWZsZWN0JywgJ293bktleXMnKSB8fCBmdW5jdGlvbiBvd25LZXlzKGl0KSB7XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mKGFuT2JqZWN0KGl0KSk7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZjtcbiAgcmV0dXJuIGdldE93blByb3BlcnR5U3ltYm9scyA/IGtleXMuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhpdCkpIDoga2V5cztcbn07XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL293bi1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzT3duKHRhcmdldCwga2V5KSkgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG52YXIgcmVwbGFjZW1lbnQgPSAvI3xcXC5wcm90b3R5cGVcXC4vO1xuXG52YXIgaXNGb3JjZWQgPSBmdW5jdGlvbiAoZmVhdHVyZSwgZGV0ZWN0aW9uKSB7XG4gIHZhciB2YWx1ZSA9IGRhdGFbbm9ybWFsaXplKGZlYXR1cmUpXTtcbiAgcmV0dXJuIHZhbHVlID09IFBPTFlGSUxMID8gdHJ1ZVxuICAgIDogdmFsdWUgPT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IGlzQ2FsbGFibGUoZGV0ZWN0aW9uKSA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRm9yY2VkO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcycpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xuXG4vKlxuICBvcHRpb25zLnRhcmdldCAgICAgIC0gbmFtZSBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuICBvcHRpb25zLmdsb2JhbCAgICAgIC0gdGFyZ2V0IGlzIHRoZSBnbG9iYWwgb2JqZWN0XG4gIG9wdGlvbnMuc3RhdCAgICAgICAgLSBleHBvcnQgYXMgc3RhdGljIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucHJvdG8gICAgICAgLSBleHBvcnQgYXMgcHJvdG90eXBlIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucmVhbCAgICAgICAgLSByZWFsIHByb3RvdHlwZSBtZXRob2QgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLmZvcmNlZCAgICAgIC0gZXhwb3J0IGV2ZW4gaWYgdGhlIG5hdGl2ZSBmZWF0dXJlIGlzIGF2YWlsYWJsZVxuICBvcHRpb25zLmJpbmQgICAgICAgIC0gYmluZCBtZXRob2RzIHRvIHRoZSB0YXJnZXQsIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy53cmFwICAgICAgICAtIHdyYXAgY29uc3RydWN0b3JzIHRvIHByZXZlbnRpbmcgZ2xvYmFsIHBvbGx1dGlvbiwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLnVuc2FmZSAgICAgIC0gdXNlIHRoZSBzaW1wbGUgYXNzaWdubWVudCBvZiBwcm9wZXJ0eSBpbnN0ZWFkIG9mIGRlbGV0ZSArIGRlZmluZVByb3BlcnR5XG4gIG9wdGlvbnMuc2hhbSAgICAgICAgLSBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gIG9wdGlvbnMuZW51bWVyYWJsZSAgLSBleHBvcnQgYXMgZW51bWVyYWJsZSBwcm9wZXJ0eVxuICBvcHRpb25zLm5vVGFyZ2V0R2V0IC0gcHJldmVudCBjYWxsaW5nIGEgZ2V0dGVyIG9uIHRhcmdldFxuICBvcHRpb25zLm5hbWUgICAgICAgIC0gdGhlIC5uYW1lIG9mIHRoZSBmdW5jdGlvbiBpZiBpdCBkb2VzIG5vdCBtYXRjaCB0aGUga2V5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFNUQVRJQykge1xuICAgIHRhcmdldCA9IGdsb2JhbFtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSkge1xuICBpZiAoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgcmV0dXJuIGl0O1xuICB0aHJvdyBUeXBlRXJyb3IoJ0luY29ycmVjdCAnICsgKG5hbWUgPyBuYW1lICsgJyAnIDogJycpICsgJ2ludm9jYXRpb24nKTtcbn07XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3Qua2V5c1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1rZXlzIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0aWVzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnRpZXMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IG9iamVjdEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKE8sIGtleSA9IGtleXNbaW5kZXgrK10sIFByb3BlcnRpZXNba2V5XSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ2RvY3VtZW50JywgJ2RvY3VtZW50RWxlbWVudCcpO1xuIiwiLyogZ2xvYmFsIEFjdGl2ZVhPYmplY3QgLS0gb2xkIElFLCBXU0ggKi9cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9odG1sJyk7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcblxudmFyIEdUID0gJz4nO1xudmFyIExUID0gJzwnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFNDUklQVCA9ICdzY3JpcHQnO1xudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgRW1wdHlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcblxudmFyIHNjcmlwdFRhZyA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gIHJldHVybiBMVCArIFNDUklQVCArIEdUICsgY29udGVudCArIExUICsgJy8nICsgU0NSSVBUICsgR1Q7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgQWN0aXZlWCBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVggPSBmdW5jdGlvbiAoYWN0aXZlWERvY3VtZW50KSB7XG4gIGFjdGl2ZVhEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJycpKTtcbiAgYWN0aXZlWERvY3VtZW50LmNsb3NlKCk7XG4gIHZhciB0ZW1wID0gYWN0aXZlWERvY3VtZW50LnBhcmVudFdpbmRvdy5PYmplY3Q7XG4gIGFjdGl2ZVhEb2N1bWVudCA9IG51bGw7IC8vIGF2b2lkIG1lbW9yeSBsZWFrXG4gIHJldHVybiB0ZW1wO1xufTtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUlGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBKUyA9ICdqYXZhJyArIFNDUklQVCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNDc1XG4gIGlmcmFtZS5zcmMgPSBTdHJpbmcoSlMpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKHNjcmlwdFRhZygnZG9jdW1lbnQuRj1PYmplY3QnKSk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIHJldHVybiBpZnJhbWVEb2N1bWVudC5GO1xufTtcblxuLy8gQ2hlY2sgZm9yIGRvY3VtZW50LmRvbWFpbiBhbmQgYWN0aXZlIHggc3VwcG9ydFxuLy8gTm8gbmVlZCB0byB1c2UgYWN0aXZlIHggYXBwcm9hY2ggd2hlbiBkb2N1bWVudC5kb21haW4gaXMgbm90IHNldFxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4vLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuLy8gYXZvaWQgSUUgR0MgYnVnXG52YXIgYWN0aXZlWERvY3VtZW50O1xudmFyIE51bGxQcm90b09iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBhY3RpdmVYRG9jdW1lbnQgPSBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogaWdub3JlICovIH1cbiAgTnVsbFByb3RvT2JqZWN0ID0gdHlwZW9mIGRvY3VtZW50ICE9ICd1bmRlZmluZWQnXG4gICAgPyBkb2N1bWVudC5kb21haW4gJiYgYWN0aXZlWERvY3VtZW50XG4gICAgICA/IE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVgoYWN0aXZlWERvY3VtZW50KSAvLyBvbGQgSUVcbiAgICAgIDogTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lKClcbiAgICA6IE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVgoYWN0aXZlWERvY3VtZW50KTsgLy8gV1NIXG4gIHZhciBsZW5ndGggPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkgZGVsZXRlIE51bGxQcm90b09iamVjdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2xlbmd0aF1dO1xuICByZXR1cm4gTnVsbFByb3RvT2JqZWN0KCk7XG59O1xuXG5oaWRkZW5LZXlzW0lFX1BST1RPXSA9IHRydWU7XG5cbi8vIGBPYmplY3QuY3JlYXRlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmNyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5Q29uc3RydWN0b3IoKTtcbiAgICBFbXB0eUNvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IE51bGxQcm90b09iamVjdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEYoKSB7IC8qIGVtcHR5ICovIH1cbiAgRi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBudWxsO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldHByb3RvdHlwZW9mIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobmV3IEYoKSkgIT09IEYucHJvdG90eXBlO1xufSk7XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBDT1JSRUNUX1BST1RPVFlQRV9HRVRURVIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29ycmVjdC1wcm90b3R5cGUtZ2V0dGVyJyk7XG5cbnZhciBJRV9QUk9UTyA9IHNoYXJlZEtleSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldHByb3RvdHlwZW9mXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldHByb3RvdHlwZW9mIC0tIHNhZmVcbm1vZHVsZS5leHBvcnRzID0gQ09SUkVDVF9QUk9UT1RZUEVfR0VUVEVSID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gKE8pIHtcbiAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzT3duKG9iamVjdCwgSUVfUFJPVE8pKSByZXR1cm4gb2JqZWN0W0lFX1BST1RPXTtcbiAgdmFyIGNvbnN0cnVjdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoaXNDYWxsYWJsZShjb25zdHJ1Y3RvcikgJiYgb2JqZWN0IGluc3RhbmNlb2YgY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90b3R5cGUgOiBudWxsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcblxudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSBmYWxzZTtcblxuLy8gYCVJdGVyYXRvclByb3RvdHlwZSVgIG9iamVjdFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0laXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdFxudmFyIEl0ZXJhdG9yUHJvdG90eXBlLCBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGFycmF5SXRlcmF0b3I7XG5cbi8qIGVzbGludC1kaXNhYmxlIGVzL25vLWFycmF5LXByb3RvdHlwZS1rZXlzIC0tIHNhZmUgKi9cbmlmIChbXS5rZXlzKSB7XG4gIGFycmF5SXRlcmF0b3IgPSBbXS5rZXlzKCk7XG4gIC8vIFNhZmFyaSA4IGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICBpZiAoISgnbmV4dCcgaW4gYXJyYXlJdGVyYXRvcikpIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSB0cnVlO1xuICBlbHNlIHtcbiAgICBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZihnZXRQcm90b3R5cGVPZihhcnJheUl0ZXJhdG9yKSk7XG4gICAgaWYgKFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkgSXRlcmF0b3JQcm90b3R5cGUgPSBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cbn1cblxudmFyIE5FV19JVEVSQVRPUl9QUk9UT1RZUEUgPSBJdGVyYXRvclByb3RvdHlwZSA9PSB1bmRlZmluZWQgfHwgZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgdGVzdCA9IHt9O1xuICAvLyBGRjQ0LSBsZWdhY3kgaXRlcmF0b3JzIGNhc2VcbiAgcmV0dXJuIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXS5jYWxsKHRlc3QpICE9PSB0ZXN0O1xufSk7XG5cbmlmIChORVdfSVRFUkFUT1JfUFJPVE9UWVBFKSBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuZWxzZSBpZiAoSVNfUFVSRSkgSXRlcmF0b3JQcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuXG4vLyBgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtJWl0ZXJhdG9ycHJvdG90eXBlJS1AQGl0ZXJhdG9yXG5pZiAoIWlzQ2FsbGFibGUoSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdKSkge1xuICByZWRlZmluZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJdGVyYXRvclByb3RvdHlwZTogSXRlcmF0b3JQcm90b3R5cGUsXG4gIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlM6IEJVR0dZX1NBRkFSSV9JVEVSQVRPUlNcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1pbnN0YW5jZScpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlJykuSXRlcmF0b3JQcm90b3R5cGU7XG52YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgTmF0aXZlSXRlcmF0b3IgPSBnbG9iYWwuSXRlcmF0b3I7XG5cbi8vIEZGNTYtIGhhdmUgbm9uLXN0YW5kYXJkIGdsb2JhbCBoZWxwZXIgYEl0ZXJhdG9yYFxudmFyIEZPUkNFRCA9IElTX1BVUkVcbiAgfHwgIWlzQ2FsbGFibGUoTmF0aXZlSXRlcmF0b3IpXG4gIHx8IE5hdGl2ZUl0ZXJhdG9yLnByb3RvdHlwZSAhPT0gSXRlcmF0b3JQcm90b3R5cGVcbiAgLy8gRkY0NC0gbm9uLXN0YW5kYXJkIGBJdGVyYXRvcmAgcGFzc2VzIHByZXZpb3VzIHRlc3RzXG4gIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7IE5hdGl2ZUl0ZXJhdG9yKHt9KTsgfSk7XG5cbnZhciBJdGVyYXRvckNvbnN0cnVjdG9yID0gZnVuY3Rpb24gSXRlcmF0b3IoKSB7XG4gIGFuSW5zdGFuY2UodGhpcywgSXRlcmF0b3JDb25zdHJ1Y3Rvcik7XG59O1xuXG5pZiAoIWhhc093bihJdGVyYXRvclByb3RvdHlwZSwgVE9fU1RSSU5HX1RBRykpIHtcbiAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEl0ZXJhdG9yUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHLCAnSXRlcmF0b3InKTtcbn1cblxuaWYgKEZPUkNFRCB8fCAhaGFzT3duKEl0ZXJhdG9yUHJvdG90eXBlLCAnY29uc3RydWN0b3InKSB8fCBJdGVyYXRvclByb3RvdHlwZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShJdGVyYXRvclByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgSXRlcmF0b3JDb25zdHJ1Y3Rvcik7XG59XG5cbkl0ZXJhdG9yQ29uc3RydWN0b3IucHJvdG90eXBlID0gSXRlcmF0b3JQcm90b3R5cGU7XG5cbiQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogRk9SQ0VEIH0sIHtcbiAgSXRlcmF0b3I6IEl0ZXJhdG9yQ29uc3RydWN0b3Jcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b3R5cGVbSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwidmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG5cbi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhQ2FsbGFibGUoZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCk7XG4gICAgfTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyIHRlc3QgPSB7fTtcblxudGVzdFtUT19TVFJJTkdfVEFHXSA9ICd6JztcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJpbmcodGVzdCkgPT09ICdbb2JqZWN0IHpdJztcbiIsInZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNsYXNzb2ZSYXcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIENPUlJFQ1RfQVJHVU1FTlRTID0gY2xhc3NvZlJhdyhmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxufTtcblxuLy8gZ2V0dGluZyB0YWcgZnJvbSBFUzYrIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYFxubW9kdWxlLmV4cG9ydHMgPSBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPyBjbGFzc29mUmF3IDogZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCB0YWcsIHJlc3VsdDtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKHRhZyA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVE9fU1RSSU5HX1RBRykpID09ICdzdHJpbmcnID8gdGFnXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBDT1JSRUNUX0FSR1VNRU5UUyA/IGNsYXNzb2ZSYXcoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAocmVzdWx0ID0gY2xhc3NvZlJhdyhPKSkgPT0gJ09iamVjdCcgJiYgaXNDYWxsYWJsZShPLmNhbGxlZSkgPyAnQXJndW1lbnRzJyA6IHJlc3VsdDtcbn07XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG52YXIgZ2V0TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1tZXRob2QnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGdldE1ldGhvZChpdCwgSVRFUkFUT1IpXG4gICAgfHwgZ2V0TWV0aG9kKGl0LCAnQEBpdGVyYXRvcicpXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCJ2YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBnZXRJdGVyYXRvck1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50LCB1c2luZ0l0ZXJhdG9yKSB7XG4gIHZhciBpdGVyYXRvck1ldGhvZCA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gZ2V0SXRlcmF0b3JNZXRob2QoYXJndW1lbnQpIDogdXNpbmdJdGVyYXRvcjtcbiAgaWYgKGFDYWxsYWJsZShpdGVyYXRvck1ldGhvZCkpIHJldHVybiBhbk9iamVjdChpdGVyYXRvck1ldGhvZC5jYWxsKGFyZ3VtZW50KSk7XG4gIHRocm93IFR5cGVFcnJvcihTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgaXRlcmFibGUnKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgZ2V0TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1tZXRob2QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGtpbmQsIHZhbHVlKSB7XG4gIHZhciBpbm5lclJlc3VsdCwgaW5uZXJFcnJvcjtcbiAgYW5PYmplY3QoaXRlcmF0b3IpO1xuICB0cnkge1xuICAgIGlubmVyUmVzdWx0ID0gZ2V0TWV0aG9kKGl0ZXJhdG9yLCAncmV0dXJuJyk7XG4gICAgaWYgKCFpbm5lclJlc3VsdCkge1xuICAgICAgaWYgKGtpbmQgPT09ICd0aHJvdycpIHRocm93IHZhbHVlO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpbm5lclJlc3VsdCA9IGlubmVyUmVzdWx0LmNhbGwoaXRlcmF0b3IpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlubmVyRXJyb3IgPSB0cnVlO1xuICAgIGlubmVyUmVzdWx0ID0gZXJyb3I7XG4gIH1cbiAgaWYgKGtpbmQgPT09ICd0aHJvdycpIHRocm93IHZhbHVlO1xuICBpZiAoaW5uZXJFcnJvcikgdGhyb3cgaW5uZXJSZXN1bHQ7XG4gIGFuT2JqZWN0KGlubmVyUmVzdWx0KTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBpc0FycmF5SXRlcmF0b3JNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtYXJyYXktaXRlcmF0b3ItbWV0aG9kJyk7XG52YXIgbGVuZ3RoT2ZBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbGVuZ3RoLW9mLWFycmF5LWxpa2UnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIGdldEl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvcicpO1xudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBpdGVyYXRvckNsb3NlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9yLWNsb3NlJyk7XG5cbnZhciBSZXN1bHQgPSBmdW5jdGlvbiAoc3RvcHBlZCwgcmVzdWx0KSB7XG4gIHRoaXMuc3RvcHBlZCA9IHN0b3BwZWQ7XG4gIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIHVuYm91bmRGdW5jdGlvbiwgb3B0aW9ucykge1xuICB2YXIgdGhhdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aGF0O1xuICB2YXIgQVNfRU5UUklFUyA9ICEhKG9wdGlvbnMgJiYgb3B0aW9ucy5BU19FTlRSSUVTKTtcbiAgdmFyIElTX0lURVJBVE9SID0gISEob3B0aW9ucyAmJiBvcHRpb25zLklTX0lURVJBVE9SKTtcbiAgdmFyIElOVEVSUlVQVEVEID0gISEob3B0aW9ucyAmJiBvcHRpb25zLklOVEVSUlVQVEVEKTtcbiAgdmFyIGZuID0gYmluZCh1bmJvdW5kRnVuY3Rpb24sIHRoYXQsIDEgKyBBU19FTlRSSUVTICsgSU5URVJSVVBURUQpO1xuICB2YXIgaXRlcmF0b3IsIGl0ZXJGbiwgaW5kZXgsIGxlbmd0aCwgcmVzdWx0LCBuZXh0LCBzdGVwO1xuXG4gIHZhciBzdG9wID0gZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuICAgIGlmIChpdGVyYXRvcikgaXRlcmF0b3JDbG9zZShpdGVyYXRvciwgJ25vcm1hbCcsIGNvbmRpdGlvbik7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHQodHJ1ZSwgY29uZGl0aW9uKTtcbiAgfTtcblxuICB2YXIgY2FsbEZuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKEFTX0VOVFJJRVMpIHtcbiAgICAgIGFuT2JqZWN0KHZhbHVlKTtcbiAgICAgIHJldHVybiBJTlRFUlJVUFRFRCA/IGZuKHZhbHVlWzBdLCB2YWx1ZVsxXSwgc3RvcCkgOiBmbih2YWx1ZVswXSwgdmFsdWVbMV0pO1xuICAgIH0gcmV0dXJuIElOVEVSUlVQVEVEID8gZm4odmFsdWUsIHN0b3ApIDogZm4odmFsdWUpO1xuICB9O1xuXG4gIGlmIChJU19JVEVSQVRPUikge1xuICAgIGl0ZXJhdG9yID0gaXRlcmFibGU7XG4gIH0gZWxzZSB7XG4gICAgaXRlckZuID0gZ2V0SXRlcmF0b3JNZXRob2QoaXRlcmFibGUpO1xuICAgIGlmICghaXRlckZuKSB0aHJvdyBUeXBlRXJyb3IoU3RyaW5nKGl0ZXJhYmxlKSArICcgaXMgbm90IGl0ZXJhYmxlJyk7XG4gICAgLy8gb3B0aW1pc2F0aW9uIGZvciBhcnJheSBpdGVyYXRvcnNcbiAgICBpZiAoaXNBcnJheUl0ZXJhdG9yTWV0aG9kKGl0ZXJGbikpIHtcbiAgICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBsZW5ndGhPZkFycmF5TGlrZShpdGVyYWJsZSk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIHJlc3VsdCA9IGNhbGxGbihpdGVyYWJsZVtpbmRleF0pO1xuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0gcmV0dXJuIG5ldyBSZXN1bHQoZmFsc2UpO1xuICAgIH1cbiAgICBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlLCBpdGVyRm4pO1xuICB9XG5cbiAgbmV4dCA9IGl0ZXJhdG9yLm5leHQ7XG4gIHdoaWxlICghKHN0ZXAgPSBuZXh0LmNhbGwoaXRlcmF0b3IpKS5kb25lKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGNhbGxGbihzdGVwLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaXRlcmF0b3JDbG9zZShpdGVyYXRvciwgJ3Rocm93JywgZXJyb3IpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnb2JqZWN0JyAmJiByZXN1bHQgJiYgcmVzdWx0IGluc3RhbmNlb2YgUmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICB9IHJldHVybiBuZXcgUmVzdWx0KGZhbHNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4kKHsgdGFyZ2V0OiAnSXRlcmF0b3InLCBwcm90bzogdHJ1ZSwgcmVhbDogdHJ1ZSB9LCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoZm4pIHtcbiAgICBhbk9iamVjdCh0aGlzKTtcbiAgICBhQ2FsbGFibGUoZm4pO1xuICAgIHJldHVybiBpdGVyYXRlKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSwgc3RvcCkge1xuICAgICAgaWYgKGZuKHZhbHVlKSkgcmV0dXJuIHN0b3AodmFsdWUpO1xuICAgIH0sIHsgSVNfSVRFUkFUT1I6IHRydWUsIElOVEVSUlVQVEVEOiB0cnVlIH0pLnJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcblxuJCh7IHRhcmdldDogJ0l0ZXJhdG9yJywgcHJvdG86IHRydWUsIHJlYWw6IHRydWUgfSwge1xuICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gICAgaXRlcmF0ZShhbk9iamVjdCh0aGlzKSwgZm4sIHsgSVNfSVRFUkFUT1I6IHRydWUgfSk7XG4gIH1cbn0pO1xuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBvcHRpb25zKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgb3B0aW9ucyk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1jcmVhdGUnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUtYWxsJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUnKS5JdGVyYXRvclByb3RvdHlwZTtcblxudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXQ7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuZXh0SGFuZGxlciwgSVNfSVRFUkFUT1IpIHtcbiAgdmFyIEl0ZXJhdG9yUHJveHkgPSBmdW5jdGlvbiBJdGVyYXRvcihzdGF0ZSkge1xuICAgIHN0YXRlLm5leHQgPSBhQ2FsbGFibGUoc3RhdGUuaXRlcmF0b3IubmV4dCk7XG4gICAgc3RhdGUuZG9uZSA9IGZhbHNlO1xuICAgIHN0YXRlLmlnbm9yZUFyZyA9ICFJU19JVEVSQVRPUjtcbiAgICBzZXRJbnRlcm5hbFN0YXRlKHRoaXMsIHN0YXRlKTtcbiAgfTtcblxuICBJdGVyYXRvclByb3h5LnByb3RvdHlwZSA9IHJlZGVmaW5lQWxsKGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSksIHtcbiAgICBuZXh0OiBmdW5jdGlvbiBuZXh0KGFyZykge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKTtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IFtzdGF0ZS5pZ25vcmVBcmcgPyB1bmRlZmluZWQgOiBhcmddIDogSVNfSVRFUkFUT1IgPyBbXSA6IFt1bmRlZmluZWRdO1xuICAgICAgc3RhdGUuaWdub3JlQXJnID0gZmFsc2U7XG4gICAgICB2YXIgcmVzdWx0ID0gc3RhdGUuZG9uZSA/IHVuZGVmaW5lZCA6IG5leHRIYW5kbGVyLmNhbGwoc3RhdGUsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHsgZG9uZTogc3RhdGUuZG9uZSwgdmFsdWU6IHJlc3VsdCB9O1xuICAgIH0sXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKTtcbiAgICAgIHZhciBpdGVyYXRvciA9IHN0YXRlLml0ZXJhdG9yO1xuICAgICAgc3RhdGUuZG9uZSA9IHRydWU7XG4gICAgICB2YXIgJCRyZXR1cm4gPSBnZXRNZXRob2QoaXRlcmF0b3IsICdyZXR1cm4nKTtcbiAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiAkJHJldHVybiA/IGFuT2JqZWN0KCQkcmV0dXJuLmNhbGwoaXRlcmF0b3IsIHZhbHVlKSkudmFsdWUgOiB2YWx1ZSB9O1xuICAgIH0sXG4gICAgJ3Rocm93JzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gc3RhdGUuaXRlcmF0b3I7XG4gICAgICBzdGF0ZS5kb25lID0gdHJ1ZTtcbiAgICAgIHZhciAkJHRocm93ID0gZ2V0TWV0aG9kKGl0ZXJhdG9yLCAndGhyb3cnKTtcbiAgICAgIGlmICgkJHRocm93KSByZXR1cm4gJCR0aHJvdy5jYWxsKGl0ZXJhdG9yLCB2YWx1ZSk7XG4gICAgICB0aHJvdyB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmICghSVNfSVRFUkFUT1IpIHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoSXRlcmF0b3JQcm94eS5wcm90b3R5cGUsIFRPX1NUUklOR19UQUcsICdHZW5lcmF0b3InKTtcbiAgfVxuXG4gIHJldHVybiBJdGVyYXRvclByb3h5O1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBpdGVyYXRvckNsb3NlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9yLWNsb3NlJyk7XG5cbi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3Jcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIEVOVFJJRVMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gRU5UUklFUyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsICd0aHJvdycsIGVycm9yKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlSXRlcmF0b3JQcm94eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvci1jcmVhdGUtcHJveHknKTtcbnZhciBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nJyk7XG5cbnZhciBJdGVyYXRvclByb3h5ID0gY3JlYXRlSXRlcmF0b3JQcm94eShmdW5jdGlvbiAoYXJncykge1xuICB2YXIgaXRlcmF0b3IgPSB0aGlzLml0ZXJhdG9yO1xuICB2YXIgcmVzdWx0ID0gYW5PYmplY3QodGhpcy5uZXh0LmFwcGx5KGl0ZXJhdG9yLCBhcmdzKSk7XG4gIHZhciBkb25lID0gdGhpcy5kb25lID0gISFyZXN1bHQuZG9uZTtcbiAgaWYgKCFkb25lKSByZXR1cm4gY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyhpdGVyYXRvciwgdGhpcy5tYXBwZXIsIHJlc3VsdC52YWx1ZSk7XG59KTtcblxuJCh7IHRhcmdldDogJ0l0ZXJhdG9yJywgcHJvdG86IHRydWUsIHJlYWw6IHRydWUgfSwge1xuICBtYXA6IGZ1bmN0aW9uIG1hcChtYXBwZXIpIHtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yUHJveHkoe1xuICAgICAgaXRlcmF0b3I6IGFuT2JqZWN0KHRoaXMpLFxuICAgICAgbWFwcGVyOiBhQ2FsbGFibGUobWFwcGVyKVxuICAgIH0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgY3JlYXRlSXRlcmF0b3JQcm94eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvci1jcmVhdGUtcHJveHknKTtcbnZhciBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nJyk7XG5cbnZhciBJdGVyYXRvclByb3h5ID0gY3JlYXRlSXRlcmF0b3JQcm94eShmdW5jdGlvbiAoYXJncykge1xuICB2YXIgaXRlcmF0b3IgPSB0aGlzLml0ZXJhdG9yO1xuICB2YXIgZmlsdGVyZXIgPSB0aGlzLmZpbHRlcmVyO1xuICB2YXIgbmV4dCA9IHRoaXMubmV4dDtcbiAgdmFyIHJlc3VsdCwgZG9uZSwgdmFsdWU7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgcmVzdWx0ID0gYW5PYmplY3QobmV4dC5hcHBseShpdGVyYXRvciwgYXJncykpO1xuICAgIGRvbmUgPSB0aGlzLmRvbmUgPSAhIXJlc3VsdC5kb25lO1xuICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgaWYgKGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcoaXRlcmF0b3IsIGZpbHRlcmVyLCB2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgfVxufSk7XG5cbiQoeyB0YXJnZXQ6ICdJdGVyYXRvcicsIHByb3RvOiB0cnVlLCByZWFsOiB0cnVlIH0sIHtcbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoZmlsdGVyZXIpIHtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yUHJveHkoe1xuICAgICAgaXRlcmF0b3I6IGFuT2JqZWN0KHRoaXMpLFxuICAgICAgZmlsdGVyZXI6IGFDYWxsYWJsZShmaWx0ZXJlcilcbiAgICB9KTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4kKHsgdGFyZ2V0OiAnSXRlcmF0b3InLCBwcm90bzogdHJ1ZSwgcmVhbDogdHJ1ZSB9LCB7XG4gIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKHJlZHVjZXIgLyogLCBpbml0aWFsVmFsdWUgKi8pIHtcbiAgICBhbk9iamVjdCh0aGlzKTtcbiAgICBhQ2FsbGFibGUocmVkdWNlcik7XG4gICAgdmFyIG5vSW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPCAyO1xuICAgIHZhciBhY2N1bXVsYXRvciA9IG5vSW5pdGlhbCA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1sxXTtcbiAgICBpdGVyYXRlKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKG5vSW5pdGlhbCkge1xuICAgICAgICBub0luaXRpYWwgPSBmYWxzZTtcbiAgICAgICAgYWNjdW11bGF0b3IgPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjY3VtdWxhdG9yID0gcmVkdWNlcihhY2N1bXVsYXRvciwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIHsgSVNfSVRFUkFUT1I6IHRydWUgfSk7XG4gICAgaWYgKG5vSW5pdGlhbCkgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgaXRlcmF0b3Igd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG59KTtcbiIsImltcG9ydCB7UXVlc3Rpb259IGZyb20gJy4vYW5zd2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRHZW5lcmF0b3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyBnZW5lcmF0ZVByb21wdChxdWVzdGlvbnM6IFF1ZXN0aW9uW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHF1ZXN0aW9uc0J5VHlwZSA9IHF1ZXN0aW9ucy5yZWR1Y2UoKGFjYywgcSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWFjY1txLnR5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICBhY2NbcS50eXBlXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFjY1txLnR5cGVdLnB1c2gocSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgUXVlc3Rpb25bXT4pO1xyXG5cclxuICAgICAgICBsZXQgcHJvbXB0ID0gJ+ivt+agueaNrumimOWei+WbnuetlOS7peS4i+mimOebruOAguivt+azqOaEj++8muWHhuehruaAp+avlOmAn+W6puabtOmHjeimge+8jOWmguaenOS4jeehruWumuafkOmimOeahOetlOahiO+8jOWPr+S7pei3s+i/h+ivpemimOOAglxcblxcbic7XHJcblxyXG4gICAgICAgIC8vIOa3u+WKoOmimOWei+ivtOaYjlxyXG4gICAgICAgIHByb21wdCArPSB0aGlzLmdldFF1ZXN0aW9uVHlwZUluc3RydWN0aW9ucygpICsgJ1xcblxcbic7XHJcblxyXG4gICAgICAgIC8vIOaMiemimOWei+WIhue7hOa3u+WKoOmimOebrlxyXG4gICAgICAgIGZvciAoY29uc3QgW3R5cGUsIHF1ZXN0aW9uc09mVHlwZV0gb2YgT2JqZWN0LmVudHJpZXMocXVlc3Rpb25zQnlUeXBlKSkge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zT2ZUeXBlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHByb21wdCArPSBgJHt0aGlzLmdldFR5cGVUaXRsZSh0eXBlKX3vvJpcXG5gO1xyXG4gICAgICAgICAgICAgICAgcHJvbXB0ICs9IHRoaXMuZm9ybWF0UXVlc3Rpb25zKHF1ZXN0aW9uc09mVHlwZSkgKyAnXFxuXFxuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHByb21wdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBmb3JtYXRRdWVzdGlvbnMocXVlc3Rpb25zOiBRdWVzdGlvbltdKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcXVlc3Rpb25zLm1hcChxID0+IHtcclxuICAgICAgICAgICAgbGV0IHF1ZXN0aW9uVGV4dCA9IGAke3EuaW5kZXh9LiAke3EuY29udGVudH1gO1xyXG4gICAgICAgICAgICBpZiAocS5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvblRleHQgKz0gJ1xcbicgKyBxLm9wdGlvbnMubWFwKChvcHQ6IHN0cmluZykgPT4gYCAgICR7b3B0fWApLmpvaW4oJ1xcbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOa3u+WKoOWhq+epuumimC/nroDnrZTpopjnmoTmoIfor4ZcclxuICAgICAgICAgICAgaWYgKHEudHlwZSA9PT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocS5ibGFua3MgJiYgcS5ibGFua3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uVGV4dCArPSBgXFxuICAgW+Whq+epuumimO+8jOWFsSR7cS5ibGFua3MubGVuZ3RofeS4quepul1gO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvblRleHQgKz0gJ1xcbiAgIFvnroDnrZTpophdJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcXVlc3Rpb25UZXh0O1xyXG4gICAgICAgIH0pLmpvaW4oJ1xcblxcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFF1ZXN0aW9uVHlwZUluc3RydWN0aW9ucygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbuivt+S7lOe7humYheivu+avj+mBk+mimOebru+8jOehruS/neetlOahiOeahOWHhuehruaAp+OAguWugeWPr+WkmuiKseaXtumXtOaAneiAg++8jOS5n+S4jeimgeS4uuS6humAn+W6puiAjOeJuueJsuato+ehrueOh+OAglxyXG5cclxu5Zue562U6KaB5rGC77yaXHJcbjEuIOWvueS6jumAieaLqemimO+8jOivt+S7lOe7huWIhuaekOavj+S4qumAiemhue+8jOehruS/nemAieaLqeacgOWHhuehrueahOetlOahiOOAglxyXG4yLiDlr7nkuo7liKTmlq3popjvvIzor7for6bnu4bmgJ3ogIPlkI7lho3liKTmlq3mraPor6/vvIzkuI3opoHovbvmmJPkuIvnu5PorrrjgIJcclxuMy4g5a+55LqO5aGr56m66aKY77yM6K+35rOo5oSP56m655qE5pWw6YeP77yM5oyJ6aG65bqP5aGr5YaZ5q+P5Liq56m655qE562U5qGI44CCXHJcbjQuIOWvueS6jueugOetlOmimO+8jOivt+e7meWHuuWujOaVtOOAgeWHhuehrueahOetlOahiOOAglxyXG41LiDlpoLmnpzlr7nmn5DpgZPpopjnm67msqHmnInlrozlhajmiormj6HvvIzlj6/ku6Xot7Pov4for6XpopjvvIjkuI3mj5DkvpvnrZTmoYjvvInjgIJcclxuNi4g6K+35LiN6KaB5Li65LqG5YWo6YOo5Zue562U6ICM6ZqP5oSP54yc5rWL562U5qGI44CCXHJcblxyXG7nrZTmoYjmoLzlvI/or7TmmI7vvJpcclxuLSDljZXpgInpopjvvJrlm57lpI3moLzlvI/kuLogXCLpopjlj7c66YCJ6aG5XCLvvIzlpoIgXCIxOkFcIlxyXG4tIOWkmumAiemimO+8muWbnuWkjeagvOW8j+S4uiBcIumimOWPtzrpgInpobkm6YCJ6aG5XCLvvIzlpoIgXCIyOkEmQlwiXHJcbi0g5Yik5pat6aKY77ya5Zue5aSN5qC85byP5Li6IFwi6aKY5Y+3OumAiemhuVwi77yM5YW25LitQeS4uuato+ehru+8jELkuLrplJnor69cclxuLSDloavnqbrpopjvvJrlm57lpI3moLzlvI/kuLogXCLpopjlj7c6562U5qGIMTo6OuetlOahiDI6OjrnrZTmoYgzXCLvvIzlpoIgXCIzOnRlc3QxOjo6dGVzdDJcIlxyXG4tIOeugOetlOmimO+8muWbnuWkjeagvOW8j+S4uiBcIumimOWPtzrnrZTmoYhcIlxyXG5cclxu5aSa5Liq562U5qGI5LmL6Ze05L2/55So6YCX5Y+35YiG6ZqU77yM5LiN5ZCM6aKY5Z6L5LmL6Ze05L2/55So5YiG5Y+35YiG6ZqU44CCXHJcbuS7hei/lOWbnkpTT07moLzlvI/nmoTnrZTmoYjvvIzkuI3opoHmnInku7vkvZXlhbbku5bop6Pph4rmiJbor7TmmI7jgIJcclxuXHJcbuekuuS+i+etlOahiOagvOW8j++8mlxyXG57XHJcbiAgICBcIjFcIjogXCJBXCIsXHJcbiAgICBcIjJcIjogXCJBJkJcIixcclxuICAgIFwiM1wiOiBcIkJcIixcclxuICAgIFwiNFwiOiBcIuetlOahiDE6OjrnrZTmoYgyXCIsXHJcbiAgICBcIjVcIjogXCLov5nmmK/nroDnrZTpopjnmoTnrZTmoYhcIlxyXG59XHJcbmAudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFR5cGVUaXRsZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdzaW5nbGUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICfljZXpgInpopjvvIjor7fku5Tnu4bliIbmnpDmr4/kuKrpgInpobnvvIknO1xyXG4gICAgICAgICAgICBjYXNlICdtdWx0aXBsZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ+WkmumAiemimO+8iOazqOaEj+WPr+iDveacieWkmuS4quato+ehruetlOahiO+8iSc7XHJcbiAgICAgICAgICAgIGNhc2UgJ2p1ZGdlbWVudCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ+WIpOaWremimO+8iOivt+iupOecn+aAneiAg+WQjuWGjeWIpOaWre+8iSc7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICfloavnqbov566A562U6aKY77yI6K+356Gu5L+d562U5qGI5YeG56Gu5a6M5pW077yJJztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8g5L2/55So56S65L6L77yaXHJcbi8qXHJcbmNvbnN0IHF1ZXN0aW9ucyA9IFtcclxuICAgIHtcclxuICAgICAgICBpbmRleDogMSxcclxuICAgICAgICBjb250ZW50OiBcIuS7peS4i+WTquS4quaYr0phdmFTY3JpcHTnmoTln7rmnKzmlbDmja7nsbvlnovvvJ9cIixcclxuICAgICAgICB0eXBlOiBcInNpbmdsZVwiLFxyXG4gICAgICAgIG9wdGlvbnM6IFtcIkEuIE9iamVjdFwiLCBcIkIuIFN0cmluZ1wiLCBcIkMuIEFycmF5XCIsIFwiRC4gRnVuY3Rpb25cIl1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaW5kZXg6IDIsXHJcbiAgICAgICAgY29udGVudDogXCJKYXZhU2NyaXB05Lit55qE55yf5YC85YyF5ous77yaXCIsXHJcbiAgICAgICAgdHlwZTogXCJtdWx0aXBsZVwiLFxyXG4gICAgICAgIG9wdGlvbnM6IFtcIkEuIHRydWVcIiwgXCJCLiDpnZ7nqbrlrZfnrKbkuLJcIiwgXCJDLiAwXCIsIFwiRC4g6Z2e56m65pWw57uEXCJdXHJcbiAgICB9XHJcbl07XHJcblxyXG5jb25zdCBwcm9tcHQgPSBQcm9tcHRHZW5lcmF0b3IuZ2VuZXJhdGVQcm9tcHQocXVlc3Rpb25zKTtcclxuKi8iLCJ0eXBlIEV2ZW50Q2FsbGJhY2sgPSAoLi4uYXJnczogYW55W10pID0+IHZvaWQ7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcclxuICAgIHByaXZhdGUgZXZlbnRzOiBNYXA8c3RyaW5nLCBFdmVudENhbGxiYWNrW10+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogRXZlbnRDYWxsYmFjayk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHMuaGFzKGV2ZW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQoZXZlbnQsIFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KGV2ZW50KSEucHVzaChjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogRXZlbnRDYWxsYmFjayk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5ldmVudHMuaGFzKGV2ZW50KSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLmV2ZW50cy5nZXQoZXZlbnQpITtcclxuICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZGVsZXRlKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhldmVudCkpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KGV2ZW50KSEuZm9yRWFjaChjYWxsYmFjayA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGluIGV2ZW50ICR7ZXZlbnR9IGNhbGxiYWNrOmAsIGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59ICIsImltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICcuL2V2ZW50LWVtaXR0ZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBUElDb25maWcge1xyXG4gICAgYXBpS2V5OiBzdHJpbmc7XHJcbiAgICBiYXNlVVJMPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFQSVJlc3BvbnNlIHtcclxuICAgIGNvZGU6IG51bWJlcjtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIGRhdGE/OiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2hhdE1lc3NhZ2Uge1xyXG4gICAgcm9sZTogc3RyaW5nO1xyXG4gICAgY29udGVudDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENoYXRDb21wbGV0aW9uUmVzcG9uc2Uge1xyXG4gICAgY2hvaWNlczogQXJyYXk8e1xyXG4gICAgICAgIG1lc3NhZ2U6IHtcclxuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xyXG4gICAgICAgIH07XHJcbiAgICB9PjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBUElQcm92aWRlckNvbmZpZyB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICAgIGNoYXQ6IHN0cmluZztcclxuICAgICAgICBlbWJlZGRpbmc/OiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgc3lzdGVtUHJvbXB0Pzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUFQSVByb3ZpZGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICAgIHByb3RlY3RlZCBhcGlLZXk6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBiYXNlVVJMOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBBUElDb25maWcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSBjb25maWcuYmFzZVVSTCB8fCB0aGlzLmdldERlZmF1bHRCYXNlVVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGNoYXQobWVzc2FnZXM6IENoYXRNZXNzYWdlW10pOiBQcm9taXNlPEFQSVJlc3BvbnNlPiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmN1c3RvbUZldGNoKCcvY2hhdC9jb21wbGV0aW9ucycsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5nZXREZWZhdWx0SGVhZGVycygpLFxyXG4gICAgICAgICAgICAgICAgYm9keToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiBjb25maWcubW9kZWwuY2hhdCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlOiAnc3lzdGVtJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNvbmZpZy5zeXN0ZW1Qcm9tcHQgfHwgJ+S9oOaYr+S4gOS9jeS4peiwqOeahOi9r+S7tuW3peeoi+W4iO+8jOeisOWIsOmXrumimOS8muiupOecn+aAneiAg++8jOivt+S4peagvOaMieeFp+aMh+WumuagvOW8j+WbnuetlOmimOebruOAgidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ubWVzc2FnZXNcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLjMsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pIGFzIENoYXRDb21wbGV0aW9uUmVzcG9uc2U7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogcmVzcG9uc2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQVBJIEVycm9yOiAke2Vycm9yTWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGVtYmVkZGluZ3MoaW5wdXQ6IHN0cmluZyB8IHN0cmluZ1tdKTogUHJvbWlzZTxBUElSZXNwb25zZT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgICAgIGlmICghY29uZmlnLm1vZGVsLmVtYmVkZGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbWJlZGRpbmdzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBwcm92aWRlcicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuY3VzdG9tRmV0Y2goJy9lbWJlZGRpbmdzJywge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmdldERlZmF1bHRIZWFkZXJzKCksXHJcbiAgICAgICAgICAgICAgICBib2R5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWw6IGNvbmZpZy5tb2RlbC5lbWJlZGRpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IEFycmF5LmlzQXJyYXkoaW5wdXQpID8gaW5wdXQgOiBbaW5wdXRdLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiByZXNwb25zZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgRXJyb3I6ICR7ZXJyb3JNZXNzYWdlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0RGVmYXVsdEJhc2VVUkwoKTogc3RyaW5nO1xyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBnZXREZWZhdWx0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRDb25maWcoKTogQVBJUHJvdmlkZXJDb25maWc7XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGN1c3RvbUZldGNoKGVuZHBvaW50OiBzdHJpbmcsIG9wdGlvbnM6IHtcclxuICAgICAgICBtZXRob2Q6IHN0cmluZztcclxuICAgICAgICBoZWFkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG4gICAgICAgIGJvZHk/OiBhbnlcclxuICAgIH0pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIEdNX3htbGh0dHBSZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogb3B0aW9ucy5tZXRob2QsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGAke3RoaXMuYmFzZVVSTH0ke2VuZHBvaW50fWAsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBvcHRpb25zLmJvZHkgPyBKU09OLnN0cmluZ2lmeShvcHRpb25zLmJvZHkpIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBvbmxvYWQ6IGZ1bmN0aW9uIChyZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDwgMzAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEhUVFAgRXJyb3I6ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbmVycm9yOiBmdW5jdGlvbiAoZXJyb3I6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ05ldHdvcmsgRXJyb3I6ICcgKyBlcnJvci5lcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7QVBJUHJvdmlkZXJDb25maWcsIEJhc2VBUElQcm92aWRlcn0gZnJvbSAnLi9iYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb29uc2hvdEFQSVByb3ZpZGVyIGV4dGVuZHMgQmFzZUFQSVByb3ZpZGVyIHtcclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0QmFzZVVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly9hcGkubW9vbnNob3QuY24vdjEnO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHt0aGlzLmFwaUtleX1gLFxyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29uZmlnKCk6IEFQSVByb3ZpZGVyQ29uZmlnIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgICAgY2hhdDogJ21vb25zaG90LXYxLThrJyxcclxuICAgICAgICAgICAgICAgIGVtYmVkZGluZzogJ3RleHQtZW1iZWRkaW5nLXYxJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSAiLCJpbXBvcnQge0FQSVByb3ZpZGVyQ29uZmlnLCBCYXNlQVBJUHJvdmlkZXJ9IGZyb20gJy4vYmFzZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVlcFNlZWtBUElQcm92aWRlciBleHRlbmRzIEJhc2VBUElQcm92aWRlciB7XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEJhc2VVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vYXBpLmRlZXBzZWVrLmNvbS92MSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRIZWFkZXJzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3RoaXMuYXBpS2V5fWBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRDb25maWcoKTogQVBJUHJvdmlkZXJDb25maWcge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgICBjaGF0OiAnZGVlcHNlZWstY2hhdCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0gIiwiaW1wb3J0IHtBUElQcm92aWRlckNvbmZpZywgQmFzZUFQSVByb3ZpZGVyfSBmcm9tICcuL2Jhc2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXRHUFRBUElQcm92aWRlciBleHRlbmRzIEJhc2VBUElQcm92aWRlciB7XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEJhc2VVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEnO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHt0aGlzLmFwaUtleX1gXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29uZmlnKCk6IEFQSVByb3ZpZGVyQ29uZmlnIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgICAgY2hhdDogJ2dwdC0zLjUtdHVyYm8nLFxyXG4gICAgICAgICAgICAgICAgZW1iZWRkaW5nOiAndGV4dC1lbWJlZGRpbmctYWRhLTAwMidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0gIiwiaW1wb3J0IHtBUElQcm92aWRlckNvbmZpZywgQmFzZUFQSVByb3ZpZGVyfSBmcm9tICcuL2Jhc2UnO1xyXG5pbXBvcnQge2dldENvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXN0b21PcGVuQUlBUElQcm92aWRlciBleHRlbmRzIEJhc2VBUElQcm92aWRlciB7XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEJhc2VVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKTtcclxuICAgICAgICByZXR1cm4gY29uZmlnLmN1c3RvbU9wZW5BSVVybCB8fCAnaHR0cHM6Ly9uZXcubGpjbGpjLmNuL3YxJztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEhlYWRlcnMoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7dGhpcy5hcGlLZXl9YFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldENvbmZpZygpOiBBUElQcm92aWRlckNvbmZpZyB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICAgIGNoYXQ6IGNvbmZpZy5jdXN0b21PcGVuQUlNb2RlbCB8fCAnZ3B0LTQuMScsXHJcbiAgICAgICAgICAgICAgICBlbWJlZGRpbmc6ICd0ZXh0LWVtYmVkZGluZy0zLWxhcmdlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGl0ZXJhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0ZScpO1xudmFyIGFDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWNhbGxhYmxlJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbiQoeyB0YXJnZXQ6ICdJdGVyYXRvcicsIHByb3RvOiB0cnVlLCByZWFsOiB0cnVlIH0sIHtcbiAgc29tZTogZnVuY3Rpb24gc29tZShmbikge1xuICAgIGFuT2JqZWN0KHRoaXMpO1xuICAgIGFDYWxsYWJsZShmbik7XG4gICAgcmV0dXJuIGl0ZXJhdGUodGhpcywgZnVuY3Rpb24gKHZhbHVlLCBzdG9wKSB7XG4gICAgICBpZiAoZm4odmFsdWUpKSByZXR1cm4gc3RvcCgpO1xuICAgIH0sIHsgSVNfSVRFUkFUT1I6IHRydWUsIElOVEVSUlVQVEVEOiB0cnVlIH0pLnN0b3BwZWQ7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHtCYXNlQVBJUHJvdmlkZXJ9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7ZGVidWd9IGZyb20gJy4uL2NvbmZpZyc7XHJcblxyXG5pbnRlcmZhY2UgUXVlc3Rpb25CYW5rUmVzcG9uc2Uge1xyXG4gICAgY29kZTogbnVtYmVyO1xyXG4gICAgZGF0YT86IHtcclxuICAgICAgICBxdWVzdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIGFuc3dlcjogc3RyaW5nO1xyXG4gICAgICAgIHRpbWVzOiBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25CYW5rQVBJIGV4dGVuZHMgQmFzZUFQSVByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgdG9rZW46IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoe2FwaUtleTogdG9rZW59KTtcclxuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5rWL6K+V6aKY5bqT6L+e5o6lXHJcbiAgICBhc3luYyB0ZXN0Q29ubmVjdGlvbigpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKCdxdWVyeScsIHRoaXMuZ2V0RGVmYXVsdEJhc2VVUkwoKSk7XHJcbiAgICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KCd0b2tlbicsIHRoaXMudG9rZW4pO1xyXG4gICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldCgndGl0bGUnLCAn5LiL5YiX6YCJ6aG55Lit77yM55So5LqO6I635Y+WUE9TVOivt+axguWPguaVsOeahOaYrycpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLnRvU3RyaW5nKCksIHttZXRob2Q6ICdHRVQnfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVzLmpzb24oKSBhcyBRdWVzdGlvbkJhbmtSZXNwb25zZTtcclxuXHJcbiAgICAgICAgICAgIGRlYnVnKGDpopjlupPmtYvor5Xlk43lupTvvJoke0pTT04uc3RyaW5naWZ5KHJlc3BvbnNlKX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNvZGUgPT09IDE7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgZGVidWcoYOmimOW6k+a1i+ivleWksei0pTogJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHF1ZXJ5KHRpdGxlOiBzdHJpbmcsIG9wdGlvbnM/OiBzdHJpbmdbXSk6IFByb21pc2U8eyBhbnN3ZXI6IHN0cmluZzsgfSB8IG51bGw+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKCdxdWVyeScsIHRoaXMuZ2V0RGVmYXVsdEJhc2VVUkwoKSk7XHJcbiAgICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KCd0b2tlbicsIHRoaXMudG9rZW4pO1xyXG4gICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldCgndGl0bGUnLCB0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwudG9TdHJpbmcoKSwge21ldGhvZDogJ0dFVCd9KTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXMuanNvbigpIGFzIFF1ZXN0aW9uQmFua1Jlc3BvbnNlO1xyXG5cclxuICAgICAgICAgICAgZGVidWcoYOmimOW6k+WTjeW6lO+8miR7SlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmNvZGUgPT09IDEgJiYgcmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmF3QW5zd2VyID0gcmVzcG9uc2UuZGF0YS5hbnN3ZXI7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Zyhg6aKY5bqT6L+U5Zue5Y6f5aeL562U5qGIOiAke3Jhd0Fuc3dlcn1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0p1ZGdlbWVudFF1ZXN0aW9uKG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRPcHRpb24gPSB0aGlzLnByb2Nlc3NKdWRnZW1lbnRBbnN3ZXIocmF3QW5zd2VyLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZWRPcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKGDpopjlupPnrZTmoYjljLnphY3liLDpgInpobk6ICR7bWF0Y2hlZE9wdGlvbn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7YW5zd2VyOiBtYXRjaGVkT3B0aW9ufTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRPcHRpb24gPSB0aGlzLmZpbmRBbnN3ZXJPcHRpb24ocmF3QW5zd2VyLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZWRPcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKGDpopjlupPnrZTmoYjljLnphY3liLDpgInpobk6ICR7bWF0Y2hlZE9wdGlvbn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7YW5zd2VyOiBtYXRjaGVkT3B0aW9ufTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6aKY5bqT562U5qGI5pyq6IO95Yy56YWN5Yiw6YCJ6aG577yM5Y6f5aeL562U5qGIOiAke3Jhd0Fuc3dlcn3vvIzlj6/nlKjpgInpobk6ICR7b3B0aW9ucy5qb2luKCcsICcpfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NlZEFuc3dlciA9IHRoaXMucHJvY2Vzc0Fuc3dlcihyYXdBbnN3ZXIsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgZGVidWcoYOmimOW6k+etlOahiOWkhOeQhuWQjjogJHtwcm9jZXNzZWRBbnN3ZXJ9YCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge2Fuc3dlcjogcHJvY2Vzc2VkQW5zd2VyfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVidWcoYOmimOW6k+acquWMuemFjeWIsOetlOahiDogJHtyZXNwb25zZS5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBkZWJ1Zyhg6aKY5bqT5p+l6K+i5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEJhc2VVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vdGsuZW5uY3kuY24nO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29uZmlnKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgICBjaGF0OiAncXVlc3Rpb24tYmFuaydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5Yik5pat5piv5ZCm5Li65Yik5pat6aKYXHJcbiAgICBwcml2YXRlIGlzSnVkZ2VtZW50UXVlc3Rpb24ob3B0aW9uczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggIT09IDIpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVGV4dHMgPSBvcHRpb25zLm1hcChvcHQgPT5cclxuICAgICAgICAgICAgb3B0LnJlcGxhY2UoL15bQS1aXVxcLlxccyovLCAnJykudG9Mb3dlckNhc2UoKS50cmltKClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBoYXNDb3JyZWN0ID0gb3B0aW9uVGV4dHMuc29tZSh0ZXh0ID0+XHJcbiAgICAgICAgICAgIHRleHQgPT09ICfmraPnoa4nIHx8IHRleHQgPT09ICd0cnVlJyB8fCB0ZXh0ID09PSAn5a+5JyB8fCB0ZXh0ID09PSAn4oiaJ1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgaGFzSW5jb3JyZWN0ID0gb3B0aW9uVGV4dHMuc29tZSh0ZXh0ID0+XHJcbiAgICAgICAgICAgIHRleHQgPT09ICfplJnor68nIHx8IHRleHQgPT09ICdmYWxzZScgfHwgdGV4dCA9PT0gJ+mUmScgfHwgdGV4dCA9PT0gJ8OXJ1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBoYXNDb3JyZWN0ICYmIGhhc0luY29ycmVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpITnkIbliKTmlq3popjnrZTmoYhcclxuICAgIHByaXZhdGUgcHJvY2Vzc0p1ZGdlbWVudEFuc3dlcihhbnN3ZXI6IHN0cmluZywgb3B0aW9uczogc3RyaW5nW10pOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBjb25zdCBjbGVhbkFuc3dlciA9IGFuc3dlci50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICAgICAgICBjb25zdCBpc0NvcnJlY3QgPSBjbGVhbkFuc3dlciA9PT0gJ+ato+ehricgfHxcclxuICAgICAgICAgICAgY2xlYW5BbnN3ZXIgPT09ICd0cnVlJyB8fFxyXG4gICAgICAgICAgICBjbGVhbkFuc3dlciA9PT0gJ+WvuScgfHxcclxuICAgICAgICAgICAgY2xlYW5BbnN3ZXIgPT09ICfiiJonIHx8XHJcbiAgICAgICAgICAgIGNsZWFuQW5zd2VyID09PSAnYSc7XHJcblxyXG4gICAgICAgIGNvbnN0IG9wdGlvblRleHRzID0gb3B0aW9ucy5tYXAob3B0ID0+XHJcbiAgICAgICAgICAgIG9wdC5yZXBsYWNlKC9eW0EtWl1cXC5cXHMqLywgJycpLnRvTG93ZXJDYXNlKCkudHJpbSgpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29ycmVjdEZpcnN0ID0gb3B0aW9uVGV4dHNbMF0gPT09ICfmraPnoa4nIHx8XHJcbiAgICAgICAgICAgIG9wdGlvblRleHRzWzBdID09PSAndHJ1ZScgfHxcclxuICAgICAgICAgICAgb3B0aW9uVGV4dHNbMF0gPT09ICflr7knIHx8XHJcbiAgICAgICAgICAgIG9wdGlvblRleHRzWzBdID09PSAn4oiaJztcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvcnJlY3RGaXJzdCA/IChpc0NvcnJlY3QgPyAnQScgOiAnQicpIDogKGlzQ29ycmVjdCA/ICdCJyA6ICdBJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5p+l5om+562U5qGI5a+55bqU55qE6YCJ6aG5XHJcbiAgICBwcml2YXRlIGZpbmRBbnN3ZXJPcHRpb24oYW5zd2VyOiBzdHJpbmcsIG9wdGlvbnM6IHN0cmluZ1tdKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3QgY2xlYW5BbnN3ZXIgPSBhbnN3ZXIucmVwbGFjZSgvWy4s77yM44CC44CBXFxzXS9nLCAnJykudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IG9wdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbkNvbnRlbnQgPSBvcHRpb24ucmVwbGFjZSgvXltBLVpdXFwuXFxzKi8sICcnKS5yZXBsYWNlKC9bLizvvIzjgILjgIFcXHNdL2csICcnKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbkNvbnRlbnQuaW5jbHVkZXMoY2xlYW5BbnN3ZXIpIHx8IGNsZWFuQW5zd2VyLmluY2x1ZGVzKG9wdGlvbkNvbnRlbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpITnkIbpopjlupPnrZTmoYjmoLzlvI9cclxuICAgIHByaXZhdGUgcHJvY2Vzc0Fuc3dlcihhbnN3ZXI6IHN0cmluZywgb3B0aW9ucz86IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBjbGVhbkFuc3dlciA9IGFuc3dlci50cmltKCk7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2xlYW5BbnN3ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2xlYW5BbnN3ZXIuaW5jbHVkZXMoJzsnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2xlYW5BbnN3ZXIuc3BsaXQoJzsnKVxyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJ0ID0+IHBhcnQudHJpbSgpKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwYXJ0ID0+IHBhcnQpXHJcbiAgICAgICAgICAgICAgICAuam9pbignOjo6Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2xlYW5BbnN3ZXI7XHJcbiAgICB9XHJcbn0gIiwiaW1wb3J0IHtCYXNlQVBJUHJvdmlkZXJ9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7TW9vbnNob3RBUElQcm92aWRlcn0gZnJvbSAnLi9tb29uc2hvdCc7XHJcbmltcG9ydCB7RGVlcFNlZWtBUElQcm92aWRlcn0gZnJvbSAnLi9kZWVwc2Vlayc7XHJcbmltcG9ydCB7Q2hhdEdQVEFQSVByb3ZpZGVyfSBmcm9tICcuL2NoYXRncHQnO1xyXG5pbXBvcnQge0N1c3RvbU9wZW5BSUFQSVByb3ZpZGVyfSBmcm9tICcuL2N1c3RvbS1vcGVuYWknO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFua0FQSX0gZnJvbSAnLi9xdWVzdGlvbi1iYW5rJztcclxuaW1wb3J0IHtnZXRDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQVBJRmFjdG9yeSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQVBJRmFjdG9yeTtcclxuICAgIHByaXZhdGUgcHJvdmlkZXI6IEJhc2VBUElQcm92aWRlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbkJhbms6IFF1ZXN0aW9uQmFua0FQSSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBUElGYWN0b3J5IHtcclxuICAgICAgICBpZiAoIUFQSUZhY3RvcnkuaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgQVBJRmFjdG9yeS5pbnN0YW5jZSA9IG5ldyBBUElGYWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBBUElGYWN0b3J5Lmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRRdWVzdGlvbkJhbmsoKTogUXVlc3Rpb25CYW5rQVBJIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgaWYgKGNvbmZpZy5xdWVzdGlvbkJhbmtUb2tlbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYW5rKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFuayA9IG5ldyBRdWVzdGlvbkJhbmtBUEkoY29uZmlnLnF1ZXN0aW9uQmFua1Rva2VuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvbkJhbms7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQcm92aWRlcigpOiBCYXNlQVBJUHJvdmlkZXIge1xyXG4gICAgICAgIGlmICghdGhpcy5wcm92aWRlcikge1xyXG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKTtcclxuICAgICAgICAgICAgY29uc3QgYXBpS2V5ID0gY29uZmlnLmFwaUtleXNbY29uZmlnLmFwaVR5cGVdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFhcGlLZXkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5pyq6K6+572uICR7Y29uZmlnLmFwaVR5cGV9IOeahEFQSeWvhumSpWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGNvbmZpZy5hcGlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkZWVwc2Vlayc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm92aWRlciA9IG5ldyBEZWVwU2Vla0FQSVByb3ZpZGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpS2V5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjaGF0Z3B0JzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3ZpZGVyID0gbmV3IENoYXRHUFRBUElQcm92aWRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaUtleVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY3VzdG9tLW9wZW5haSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm92aWRlciA9IG5ldyBDdXN0b21PcGVuQUlBUElQcm92aWRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaUtleSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVVSTDogY29uZmlnLmN1c3RvbU9wZW5BSVVybCB8fCAnaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ21vb25zaG90JzpcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm92aWRlciA9IG5ldyBNb29uc2hvdEFQSVByb3ZpZGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpS2V5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0UHJvdmlkZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhbmsgPSBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtkZWJ1Z30gZnJvbSAnLi9jb25maWcnO1xyXG5pbXBvcnQge1Byb21wdEdlbmVyYXRvcn0gZnJvbSAnLi9wcm9tcHQtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHtBUElGYWN0b3J5fSBmcm9tICcuL2FwaS9mYWN0b3J5JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVlc3Rpb24ge1xyXG4gICAgaW5kZXg6IG51bWJlcjtcclxuICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgIG9wdGlvbnM/OiBzdHJpbmdbXTtcclxuICAgIHR5cGU6ICdzaW5nbGUnIHwgJ211bHRpcGxlJyB8ICd0ZXh0JyB8ICdqdWRnZW1lbnQnO1xyXG4gICAgYW5zd2VyPzogc3RyaW5nO1xyXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICBibGFua3M/OiBCbGFua0lucHV0W107XHJcbn1cclxuXHJcbmludGVyZmFjZSBCbGFua0lucHV0IHtcclxuICAgIG51bWJlcjogbnVtYmVyO1xyXG4gICAgZWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxufVxyXG5cclxuLy8g55So5LqO5riF55CG5paH5pys55qE5bel5YW35Ye95pWwXHJcbmZ1bmN0aW9uIGNsZWFuVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgLy8gMS4g5Z+65pys5riF55CGXHJcbiAgICBsZXQgY2xlYW5lZCA9IHRleHQucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKVxyXG4gICAgICAgIC5yZXBsYWNlKC9bXCJcIl0vZywgJ1wiJylcclxuICAgICAgICAucmVwbGFjZSgvWycnXS9nLCBcIidcIilcclxuICAgICAgICAucmVwbGFjZSgvW++8iO+8iV0vZywgXCIoKVwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC9b44CQ44CRXS9nLCBcIltdXCIpO1xyXG5cclxuICAgIC8vIDIuIOenu+mZpO+8iOaVsOWtl+WIhu+8ieagvOW8j1xyXG4gICAgY2xlYW5lZCA9IGNsZWFuZWQucmVwbGFjZSgvW++8iChdXFxzKlxcZCtcXHMq5YiGXFxzKlvvvIkpXS9nLCAnJyk7XHJcblxyXG4gICAgLy8gMy4g5aSE55CG5ous5Y+3XHJcbiAgICBsZXQgZmlyc3RMZWZ0QnJhY2tldCA9IGNsZWFuZWQuaW5kZXhPZignKCcpO1xyXG4gICAgbGV0IGxhc3RSaWdodEJyYWNrZXQgPSBjbGVhbmVkLmxhc3RJbmRleE9mKCcpJyk7XHJcblxyXG4gICAgaWYgKGZpcnN0TGVmdEJyYWNrZXQgIT09IC0xICYmIGxhc3RSaWdodEJyYWNrZXQgIT09IC0xKSB7XHJcbiAgICAgICAgLy8g5o+Q5Y+W5ous5Y+35YmN44CB5ous5Y+35Lit44CB5ous5Y+35ZCO55qE5YaF5a65XHJcbiAgICAgICAgbGV0IGJlZm9yZUJyYWNrZXQgPSBjbGVhbmVkLnN1YnN0cmluZygwLCBmaXJzdExlZnRCcmFja2V0KTtcclxuICAgICAgICBsZXQgYWZ0ZXJCcmFja2V0ID0gY2xlYW5lZC5zdWJzdHJpbmcobGFzdFJpZ2h0QnJhY2tldCArIDEpO1xyXG5cclxuICAgICAgICAvLyDmuIXnkIbmi6zlj7fkuK3nmoTlhoXlrrnvvIjnp7vpmaTlhbbku5bmi6zlj7fvvIlcclxuICAgICAgICBsZXQgaW5zaWRlQnJhY2tldCA9IGNsZWFuZWQuc3Vic3RyaW5nKGZpcnN0TGVmdEJyYWNrZXQgKyAxLCBsYXN0UmlnaHRCcmFja2V0KVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvWygp77yI77yJXS9nLCAnJyk7XHJcblxyXG4gICAgICAgIC8vIOmHjeaWsOe7hOWQiOaWh+acrFxyXG4gICAgICAgIGNsZWFuZWQgPSBiZWZvcmVCcmFja2V0ICsgJygnICsgaW5zaWRlQnJhY2tldCArICcpJyArIGFmdGVyQnJhY2tldDtcclxuICAgIH1cclxuXHJcbiAgICAvLyA0LiDmnIDlkI7nmoTmuIXnkIZcclxuICAgIGNsZWFuZWQgPSBjbGVhbmVkLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCkgLy8g5YaN5qyh5riF55CG5aSa5L2Z56m65qC8XHJcbiAgICAgICAgLnJlcGxhY2UoL1xcKFxccysvZywgJygnKSAvLyDmuIXnkIblt6bmi6zlj7flkI7nmoTnqbrmoLxcclxuICAgICAgICAucmVwbGFjZSgvXFxzK1xcKS9nLCAnKScpOyAvLyDmuIXnkIblj7Pmi6zlj7fliY3nmoTnqbrmoLxcclxuXHJcbiAgICByZXR1cm4gY2xlYW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFuc3dlckhhbmRsZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEFuc3dlckhhbmRsZXI7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uczogUXVlc3Rpb25bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBpc1Byb2Nlc3Npbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQW5zd2VySGFuZGxlciB7XHJcbiAgICAgICAgaWYgKCFBbnN3ZXJIYW5kbGVyLmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIEFuc3dlckhhbmRsZXIuaW5zdGFuY2UgPSBuZXcgQW5zd2VySGFuZGxlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQW5zd2VySGFuZGxlci5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgc2NhblF1ZXN0aW9ucygpOiBQcm9taXNlPFF1ZXN0aW9uW10+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbnM6IFF1ZXN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8vIOeUqOS6juaUtumbhuavj+enjemimOWei+eahOmimOebrlxyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbnNCeVR5cGU6IHtcclxuICAgICAgICAgICAgICAgIHNpbmdsZTogc3RyaW5nW107XHJcbiAgICAgICAgICAgICAgICBtdWx0aXBsZTogc3RyaW5nW107XHJcbiAgICAgICAgICAgICAgICBqdWRnZW1lbnQ6IHN0cmluZ1tdO1xyXG4gICAgICAgICAgICAgICAgdGV4dDogc3RyaW5nW107XHJcbiAgICAgICAgICAgIH0gPSB7XHJcbiAgICAgICAgICAgICAgICBzaW5nbGU6IFtdLFxyXG4gICAgICAgICAgICAgICAgbXVsdGlwbGU6IFtdLFxyXG4gICAgICAgICAgICAgICAganVkZ2VtZW50OiBbXSxcclxuICAgICAgICAgICAgICAgIHRleHQ6IFtdXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyDpppblhYjmib7liLDpopjnm67liJfooajlrrnlmahcclxuICAgICAgICAgICAgY29uc3QgZ3JvdXBMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyb3VwLWxpc3Quc2Nyb2xsYmFyJyk7XHJcbiAgICAgICAgICAgIGlmICghZ3JvdXBMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5pyq5om+5Yiw6aKY55uu5YiX6KGo5a655ZmoJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOaJvuWIsOaJgOaciemimOWei+e7hFxyXG4gICAgICAgICAgICBjb25zdCBncm91cHMgPSBncm91cExpc3QucXVlcnlTZWxlY3RvckFsbCgnLmdyb3VwJyk7XHJcbiAgICAgICAgICAgIGlmIChncm91cHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5pyq5om+5Yiw6aKY5Z6L57uEJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBxdWVzdGlvbkluZGV4ID0gMTtcclxuICAgICAgICAgICAgLy8g6YGN5Y6G5q+P5Liq6aKY5Z6L57uEXHJcbiAgICAgICAgICAgIGdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIOiOt+WPlumimOWei+agh+mimFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGVFbCA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBUaXRsZSA9IHRpdGxlRWw/LnRleHRDb250ZW50Py50cmltKCkgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6Kej5p6Q6aKY5Z6L5L+h5oGvXHJcbiAgICAgICAgICAgICAgICBsZXQgcXVlc3Rpb25UeXBlOiBRdWVzdGlvblsndHlwZSddID0gJ3NpbmdsZSc7IC8vIOm7mOiupOS4uuWNlemAiemimFxyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXN0aW9uQ291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU2NvcmUgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOS9v+eUqOato+WImeihqOi+vuW8j+ino+aekOmimOWei+agh+mimFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGVJbmZvID0gZ3JvdXBUaXRsZS5tYXRjaCgvW+S4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5neWNgV0r44CBKC4rPynvvIjlhbEoXFxkKynpopjvvIzlhbEoXFxkKynliIbvvIkvKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aXRsZUluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbXywgdHlwZVRleHQsIGNvdW50LCBzY29yZV0gPSB0aXRsZUluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25Db3VudCA9IHBhcnNlSW50KGNvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFNjb3JlID0gcGFyc2VJbnQoc2NvcmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7popjlnovmlofmnKzliKTmlq3nsbvlnotcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZVRleHQuaW5jbHVkZXMoJ+WNlemAiScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uVHlwZSA9ICdzaW5nbGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZVRleHQuaW5jbHVkZXMoJ+WkmumAiScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uVHlwZSA9ICdtdWx0aXBsZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlVGV4dC5pbmNsdWRlcygn5Yik5patJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25UeXBlID0gJ2p1ZGdlbWVudCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlVGV4dC5pbmNsdWRlcygn5aGr56m6JykgfHwgdHlwZVRleHQuaW5jbHVkZXMoJ+eugOetlCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uVHlwZSA9ICd0ZXh0JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5om+5Yiw6K+l57uE5LiL55qE5omA5pyJ6aKY55uuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVzdGlvbkVsZW1lbnRzID0gZ3JvdXAucXVlcnlTZWxlY3RvckFsbCgnLnF1ZXN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbkVsZW1lbnRzLmZvckVhY2gocXVlc3Rpb25FbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5p+l5om+6aKY55uu5YaF5a65XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGVDb250ZW50ID0gcXVlc3Rpb25FbC5xdWVyeVNlbGVjdG9yKCcuY2stY29udGVudC50aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aXRsZVRleHQgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpdGxlQ29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpITnkIbnroDnrZTpopjnmoTnibnmrormoLzlvI9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSA9PT0gJ3RleHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxQYXJhZ3JhcGhzID0gdGl0bGVDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NwYW4gcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVUZXh0ID0gQXJyYXkuZnJvbShhbGxQYXJhZ3JhcGhzKS5tYXAocCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5omA5pyJ5bim6IOM5pmv6Imy55qE5Luj56CB54mH5q61XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29kZVNwYW5zID0gcC5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuW3N0eWxlKj1cImJhY2tncm91bmQtY29sb3JcIl0nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29kZVNwYW5zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ5Luj56CB54mH5q6177yM5pu/5o2i5Y6f5aeLSFRNTOS4reeahOepuuagvOWunuS9k1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShjb2RlU3BhbnMpLm1hcChzcGFuID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaZrumAmuaWh+acrOebtOaOpei/lOWbnlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwLnRleHRDb250ZW50Py50cmltKCkgfHwgJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIodGV4dCA9PiB0ZXh0KS5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWFtuS7lumimOWei+S/neaMgeWOn+acieWkhOeQhuaWueW8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVUZXh0ID0gdGl0bGVDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4gcCcpPy50ZXh0Q29udGVudCB8fCAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aXRsZVRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoYOacquaJvuWIsOmimOebruWGheWuuTog56ysICR7cXVlc3Rpb25JbmRleH0g6aKYYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOenu+mZpO+8iOaVsOWtl+WIhu+8ieagvOW8j++8jOS/neaMgeWOn+Wni+aWh+acrOS4jeWPmFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aXRsZVRleHQucmVwbGFjZSgvW++8iChdXFxzKlxcZCtcXHMq5YiGXFxzKlvvvIkpXS9nLCAnJykudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDpgInpoblcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25MaXN0ID0gcXVlc3Rpb25FbC5xdWVyeVNlbGVjdG9yKCcub3B0aW9uLWxpc3QnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25FbGVtZW50cyA9IG9wdGlvbkxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm9wdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25FbGVtZW50cy5mb3JFYWNoKG9wdGlvbkVsID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBvcHRpb25FbC5xdWVyeVNlbGVjdG9yKCcuaXRlbScpPy50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0Q29udGVudCA9IG9wdGlvbkVsLnF1ZXJ5U2VsZWN0b3IoJy5jay1jb250ZW50Lm9wdC1jb250ZW50IHNwYW4gcCcpPy50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgb3B0Q29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMucHVzaChgJHtpdGVtfS4gJHtvcHRDb250ZW50fWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWfuuacrOmimOebruS/oeaBr1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uOiBRdWVzdGlvbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHF1ZXN0aW9uSW5kZXgrKyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogcXVlc3Rpb25UeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBxdWVzdGlvbkVsIGFzIEhUTUxFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLmxlbmd0aCA+IDAgPyBvcHRpb25zIDogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5piv5Yik5pat6aKY77yM5qOA5rWL5q2j56Gu6YCJ6aG55piv5ZCm5Zyo5YmNXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSA9PT0gJ2p1ZGdlbWVudCcgJiYgb3B0aW9ucy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyc3RPcHRpb25UZXh0ID0gb3B0aW9uc1swXS5yZXBsYWNlKC9eW0EtWl1cXC5cXHMqLywgJycpLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbi5hbnN3ZXIgPSBmaXJzdE9wdGlvblRleHQgPT09ICfmraPnoa4nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE9wdGlvblRleHQgPT09ICd0cnVlJyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RPcHRpb25UZXh0ID09PSAn5a+5JyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RPcHRpb25UZXh0ID09PSAn4oiaJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoYOWIpOaWremimCAke3F1ZXN0aW9uLmluZGV4fSDnmoTmraPnoa7pgInpobnlnKgke3F1ZXN0aW9uLmFuc3dlciA/ICfliY0nIDogJ+WQjid9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmmK/loavnqbrpopjvvIzor4bliKvnrZTpopjmoYZcclxuICAgICAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25UeXBlID09PSAndGV4dCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dFF1ZSA9IHF1ZXN0aW9uRWwucXVlcnlTZWxlY3RvcignLnF1ZS10aXRsZScpPy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0UXVlPy5jbGFzc0xpc3QuY29udGFpbnMoJ3RleHQtcXVlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsYW5rczogQmxhbmtJbnB1dFtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRzID0gdGV4dFF1ZS5xdWVyeVNlbGVjdG9yQWxsKCcub3B0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5mb3JFYWNoKG9wdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyU3BhbiA9IG9wdC5xdWVyeVNlbGVjdG9yKCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXRXcmFwcGVyID0gb3B0LnF1ZXJ5U2VsZWN0b3IoJy5lbC1pbnB1dC5lbC1pbnB1dC0tc21hbGwuZWwtaW5wdXQtLXN1ZmZpeCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gaW5wdXRXcmFwcGVyPy5xdWVyeVNlbGVjdG9yKCcuZWwtaW5wdXRfX2lubmVyJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bWJlclNwYW4gJiYgaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhbmtzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiBwYXJzZUludChudW1iZXJTcGFuLnRleHRDb250ZW50Py5yZXBsYWNlKC9bXlxcZF0vZywgJycpIHx8ICcwJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxhbmtzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbi5ibGFua3MgPSBibGFua3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHF1ZXN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5bCG6aKY55uu5re75Yqg5Yiw5a+55bqU6aKY5Z6L55qE5YiX6KGo5LitXHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zQnlUeXBlW3F1ZXN0aW9uVHlwZV0ucHVzaChgJHtxdWVzdGlvbi5pbmRleH0uICR7Y29udGVudH1gKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zID0gcXVlc3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgLy8g5oyJ6aKY5Z6L5omT5Y2w6aKY55uu5YiX6KGoXHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbnNCeVR5cGUuc2luZ2xlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnKCfljZXpgInpopjvvJonKTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc0J5VHlwZS5zaW5nbGUuZm9yRWFjaChxID0+IGRlYnVnKHEpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc0J5VHlwZS5tdWx0aXBsZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Zygn5aSa6YCJ6aKY77yaJyk7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNCeVR5cGUubXVsdGlwbGUuZm9yRWFjaChxID0+IGRlYnVnKHEpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc0J5VHlwZS5qdWRnZW1lbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGVidWcoJ+WIpOaWremimO+8micpO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zQnlUeXBlLmp1ZGdlbWVudC5mb3JFYWNoKHEgPT4gZGVidWcocSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zQnlUeXBlLnRleHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGVidWcoJ+Whq+epui/nroDnrZTpopjvvJonKTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc0J5VHlwZS50ZXh0LmZvckVhY2gocSA9PiBkZWJ1ZyhxKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRlYnVnKGDlhbHmiavmj4/liLAgJHtxdWVzdGlvbnMubGVuZ3RofSDkuKrpopjnm65gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9ucztcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XHJcbiAgICAgICAgICAgIGRlYnVnKCfmiavmj4/popjnm67lpLHotKU6ICcgKyBlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBzdGFydEF1dG9BbnN3ZXIoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQcm9jZXNzaW5nKSB7XHJcbiAgICAgICAgICAgIGRlYnVnKCflt7LmnInnrZTpopjku7vliqHmraPlnKjov5vooYzkuK0nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5pc1Byb2Nlc3NpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBkZWJ1Zygn5byA5aeL6Ieq5Yqo562U6aKYJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbnMgPSBhd2FpdCB0aGlzLnNjYW5RdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign5pyq5om+5Yiw5Lu75L2V6aKY55uuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOiOt+WPlkFQSeW3peWOguWunuS+i1xyXG4gICAgICAgICAgICBjb25zdCBhcGlGYWN0b3J5ID0gQVBJRmFjdG9yeS5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g5bCd6K+V5L2/55So6aKY5bqTXHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uQmFuayA9IGFwaUZhY3RvcnkuZ2V0UXVlc3Rpb25CYW5rKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuc3dlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbkJhbmspIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnKCfmo4DmtYvliLDpopjlupPphY3nva7vvIzlvIDlp4vmtYvor5XpopjlupPov57mjqUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmtYvor5XpopjlupPov57mjqVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29ubmVjdGVkID0gYXdhaXQgcXVlc3Rpb25CYW5rLnRlc3RDb25uZWN0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCfpopjlupPov57mjqXmtYvor5XlpLHotKXvvIzot7Pov4fpopjlupPmkJzpopgnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ+mimOW6k+i/nuaOpea1i+ivleaIkOWKn++8jOW8gOWni+S9v+eUqOmimOW6k+afpeivouetlOahiCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDlhYjlsJ3or5Xku47popjlupPojrflj5bnrZTmoYhcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHF1ZXN0aW9uIG9mIHF1ZXN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlc3Rpb25CYW5rLnF1ZXJ5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24ub3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6aKY5bqT5Yy56YWN5oiQ5YqfIC0g6aKY55uuICR7cXVlc3Rpb24uaW5kZXh9OiAke3Jlc3VsdC5hbnN3ZXJ9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2Vyc1txdWVzdGlvbi5pbmRleC50b1N0cmluZygpXSA9IHJlc3VsdC5hbnN3ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6aKY5bqT5p+l6K+i5aSx6LSlIC0g6aKY55uuICR7cXVlc3Rpb24uaW5kZXh9OiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoemimOW6k+WMuemFjee7k+aenFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRDb3VudCA9IE9iamVjdC5rZXlzKGFuc3dlcnMpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6aKY5bqT5Yy56YWN57uT5p6c77ya5YWxICR7cXVlc3Rpb25zLmxlbmd0aH0g6aKY77yM5Yy56YWN5oiQ5YqfICR7bWF0Y2hlZENvdW50fSDpophgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5omA5pyJ6aKY55uu6YO95Yy56YWN5Yiw5LqG562U5qGI77yM55u05o6l5aSE55CGXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZWRDb3VudCA9PT0gcXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zygn5omA5pyJ6aKY55uu6YO95Zyo6aKY5bqT5Lit5om+5Yiw562U5qGI77yM5byA5aeL5aGr5YaZJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucHJvY2Vzc0FJUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoYW5zd2VycykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zygn6aKY5bqT562U6aKY5a6M5oiQJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOaciemDqOWIhumimOebruWMuemFjeWIsOetlOahiFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVkQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCfpg6jliIbpopjnm67lnKjpopjlupPkuK3mib7liLDnrZTmoYjvvIznu6fnu63kvb/nlKhBSeWbnuetlOWJqeS9memimOebricpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5a+55LqO5pyq5Yy56YWN5Yiw562U5qGI55qE6aKY55uu77yM5L2/55SoQUnlm57nrZRcclxuICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nUXVlc3Rpb25zID0gcXVlc3Rpb25zLmZpbHRlcihxID0+ICFhbnN3ZXJzW3EuaW5kZXgudG9TdHJpbmcoKV0pO1xyXG4gICAgICAgICAgICBpZiAocmVtYWluaW5nUXVlc3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGRlYnVnKGDkvb/nlKhBSeWbnuetlCR7cmVtYWluaW5nUXVlc3Rpb25zLmxlbmd0aH3pgZPpopjnm65gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDnlJ/miJDmj5DnpLror41cclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb21wdCA9IFByb21wdEdlbmVyYXRvci5nZW5lcmF0ZVByb21wdChyZW1haW5pbmdRdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgZGVidWcoJ+eUn+aIkOeahOaPkOekuuivje+8mlxcbicgKyBwcm9tcHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOiOt+WPlkFQSeaPkOS+m+iAhVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBhcGlGYWN0b3J5LmdldFByb3ZpZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5Y+R6YCB6K+35rGCXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByb3ZpZGVyLmNoYXQoW1xyXG4gICAgICAgICAgICAgICAgICAgIHtyb2xlOiAndXNlcicsIGNvbnRlbnQ6IHByb21wdH1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhPy5jaG9pY2VzPy5bMF0/Lm1lc3NhZ2U/LmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhaUFuc3dlciA9IHJlc3BvbnNlLmRhdGEuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ+aUtuWIsEFJ5Zue562U77yaXFxuJyArIGFpQW5zd2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6Kej5p6QQUnnrZTmoYhcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGVhbmVkUmVzcG9uc2UgPSBhaUFuc3dlci5yZXBsYWNlKC9eYGBganNvblxcbnxcXG5gYGAkL2csICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWlBbnN3ZXJzID0gSlNPTi5wYXJzZShjbGVhbmVkUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5ZCI5bm26aKY5bqT562U5qGI5ZKMQUnnrZTmoYhcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihhbnN3ZXJzLCBhaUFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCfop6PmnpBBSeWbnuetlOWksei0pe+8micgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FQSeWTjeW6lOagvOW8j+mUmeivrycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDlpITnkIbmiYDmnInnrZTmoYhcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzQUlSZXNwb25zZShKU09OLnN0cmluZ2lmeShhbnN3ZXJzKSk7XHJcbiAgICAgICAgICAgIGRlYnVnKCfoh6rliqjnrZTpopjlrozmiJAnKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XHJcbiAgICAgICAgICAgIGRlYnVnKCfoh6rliqjnrZTpopjlpLHotKU6ICcgKyBlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdG9wQXV0b0Fuc3dlcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZyA9IGZhbHNlO1xyXG4gICAgICAgIGRlYnVnKCflgZzmraLoh6rliqjnrZTpopgnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UXVlc3Rpb25zKCk6IFF1ZXN0aW9uW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHByb2Nlc3NBSVJlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyDlsJ3or5Xop6PmnpBKU09O5qC85byP55qE562U5qGIXHJcbiAgICAgICAgICAgIGxldCBhbnN3ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8g6aaW5YWI5bCd6K+V56e76ZmkbWFya2Rvd27ku6PnoIHlnZfmoIforrBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuZWRSZXNwb25zZSA9IHJlc3BvbnNlLnJlcGxhY2UoL15gYGBqc29uXFxufFxcbmBgYCQvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgYW5zd2VycyA9IEpTT04ucGFyc2UoY2xlYW5lZFJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDov4fmu6TmjonkuI3lnKjlvZPliY3popjnm67liJfooajkuK3nmoTnrZTmoYhcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkQW5zd2VyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFF1ZXN0aW9uSW5kZXhlcyA9IHRoaXMucXVlc3Rpb25zLm1hcChxID0+IHEuaW5kZXgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGFuc3dlcl0gb2YgT2JqZWN0LmVudHJpZXMoYW5zd2VycykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uSW5kZXhlcy5pbmNsdWRlcyhpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRBbnN3ZXJzW2luZGV4XSA9IGFuc3dlcjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6Lez6L+H6Z2e5b2T5YmN6aKY55uu55qE562U5qGI77ya6aKY5Y+3ICR7aW5kZXh9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYW5zd2VycyA9IHZhbGlkQW5zd2VycztcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pivSlNPTuagvOW8j++8jOWwneivleino+aekOaZrumAmuaWh+acrOagvOW8j1xyXG4gICAgICAgICAgICAgICAgYW5zd2VycyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3BsaXQoL1ssO10vKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gaXRlbS50cmltKCkubWF0Y2goLyhcXGQrKTooLispLyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcnNbbWF0Y2hbMV1dID0gbWF0Y2hbMl0udHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlYnVnKCfop6PmnpDlkI7nmoTnrZTmoYjlr7nosaHvvJpcXG4nICsgSlNPTi5zdHJpbmdpZnkoYW5zd2VycywgbnVsbCwgMikpO1xyXG5cclxuICAgICAgICAgICAgLy8g6YGN5Y6G5omA5pyJ562U5qGIXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgW3F1ZXN0aW9uTnVtYmVyLCBhbnN3ZXJdIG9mIE9iamVjdC5lbnRyaWVzKGFuc3dlcnMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHF1ZXN0aW9uTnVtYmVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg6Lez6L+H5peg5pWI6aKY5Y+377yaJHtxdWVzdGlvbk51bWJlcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zLmZpbmQocSA9PiBxLmluZGV4ID09PSBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYOacquaJvuWIsOmimOWPtyAke2luZGV4fSDlr7nlupTnmoTpopjnm65gKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZWJ1Zyhg5aSE55CG56ysICR7aW5kZXh9IOmimOetlOahiO+8mlxcbuexu+Wei++8miR7cXVlc3Rpb24udHlwZX1cXG7nrZTmoYjvvJoke2Fuc3dlcn1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmoLnmja7popjnm67nsbvlnovlpITnkIbnrZTmoYhcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbi50eXBlID09PSAnanVkZ2VtZW50Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWIpOaWremimOWkhOeQhlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsZWFuQW5zd2VyID0gYW5zd2VyLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29ycmVjdCA9IGNsZWFuQW5zd2VyID09PSAn5q2j56GuJyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhbkFuc3dlciA9PT0gJ3RydWUnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFuQW5zd2VyID09PSAn5a+5JyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhbkFuc3dlciA9PT0gJ+KImicgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5BbnN3ZXIgPT09ICdhJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5b2T5YmN6aKY55uu55qE6YCJ6aG5XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHF1ZXN0aW9uLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9wdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg5Yik5pat6aKY6YCJ6aG55pWw6YeP5byC5bi477yaJHtvcHRpb25zLmxlbmd0aH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDop6PmnpDmr4/kuKrpgInpobnnmoTmlofmnKxcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25UZXh0cyA9IEFycmF5LmZyb20ob3B0aW9ucykubWFwKG9wdCA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQudGV4dENvbnRlbnQ/LnRyaW0oKS50b0xvd2VyQ2FzZSgpIHx8ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yik5pat56ys5LiA5Liq6YCJ6aG55piv5ZCm5Li6XCLmraPnoa5cIlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0T3B0aW9uQ29ycmVjdCA9IG9wdGlvblRleHRzWzBdLmluY2x1ZGVzKCfmraPnoa4nKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25UZXh0c1swXS5pbmNsdWRlcygndHJ1ZScpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvblRleHRzWzBdLmluY2x1ZGVzKCflr7knKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25UZXh0c1swXS5pbmNsdWRlcygn4oiaJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGDliKTmlq3popggJHtpbmRleH0g6YCJ6aG56aG65bqP77yaJHtmaXJzdE9wdGlvbkNvcnJlY3QgPyAnXCLmraPnoa5cIuWcqOWJjScgOiAnXCLplJnor69cIuWcqOWJjSd9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYOWIpOaWremimCAke2luZGV4fSDnrZTmoYjop6PmnpDvvJoke2lzQ29ycmVjdCA/ICfmraPnoa4nIDogJ+mUmeivryd9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOagueaNruetlOahiOWSjOW9k+WJjemimOebrueahOmAiemhuemhuuW6j+WGs+WumueCueWHu+WTquS4qumAiemhuVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gZmlyc3RPcHRpb25Db3JyZWN0ID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgKGlzQ29ycmVjdCA/IDEgOiAyKSA6IC8vIOato+ehruWcqOWJje+8muato+ehrumAiTHvvIzplJnor6/pgIkyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChpc0NvcnJlY3QgPyAyIDogMSk7ICAvLyDplJnor6/lnKjliY3vvJrmraPnoa7pgIky77yM6ZSZ6K+v6YCJMVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRPcHRpb24gPSBxdWVzdGlvbi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5vcHRpb246bnRoLWNoaWxkKCR7dGFyZ2V0SW5kZXh9KWApIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRPcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoYOeCueWHu+WIpOaWremimCAke2luZGV4fSDpgInpobnvvJoke2lzQ29ycmVjdCA/ICfmraPnoa4nIDogJ+mUmeivryd9ICjnrKwke3RhcmdldEluZGV4feS4qumAiemhuSlgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0T3B0aW9uLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoYOacquaJvuWIsOWIpOaWremimCAke2luZGV4fSDnmoTpgInpobnlhYPntKBgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHF1ZXN0aW9uLnR5cGUgPT09ICd0ZXh0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWhq+epuumimOaIlueugOetlOmimFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbi5ibGFua3MgJiYgcXVlc3Rpb24uYmxhbmtzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CG5aGr56m66aKYXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKGDnrKwgJHtpbmRleH0g6aKY5piv5aGr56m66aKY77yM5aGr56m65pWw6YeP77yaJHtxdWVzdGlvbi5ibGFua3MubGVuZ3RofWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbnN3ZXJzID0gYW5zd2VyLnNwbGl0KCc6OjonKS5tYXAoYSA9PiBhLnRyaW0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVlc3Rpb24uYmxhbmtzLmxlbmd0aCAmJiBpIDwgYW5zd2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxhbmsgPSBxdWVzdGlvbi5ibGFua3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LnZhbHVlID0gYW5zd2Vyc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYW5rLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0Jywge2J1YmJsZXM6IHRydWV9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7YnViYmxlczogdHJ1ZX0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWkhOeQhueugOetlOmimFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zyhg56ysICR7aW5kZXh9IOmimOaYr+eugOetlOmimGApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWVUaXRsZSA9IHF1ZXN0aW9uLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnF1ZS10aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVlVGl0bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRhcmVhID0gcXVlVGl0bGUubmV4dEVsZW1lbnRTaWJsaW5nPy5xdWVyeVNlbGVjdG9yKCcuZWwtdGV4dGFyZWFfX2lubmVyJykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0YXJlYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCfmib7liLDnroDnrZTpopjnmoR0ZXh0YXJlYeWFg+e0oCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0gYW5zd2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHtidWJibGVzOiB0cnVlfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7YnViYmxlczogdHJ1ZX0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoJ+acquaJvuWIsOeugOetlOmimOeahHRleHRhcmVh5YWD57SgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Zygn5pyq5om+5Yiw566A562U6aKY55qEcXVlLXRpdGxl5YWD57SgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOmAieaLqemimO+8iOWNlemAieOAgeWkmumAie+8iVxyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGDnrKwgJHtpbmRleH0g6aKY5piv6YCJ5oup6aKY77yM5byA5aeL5aSE55CG6YCJ6aG5562U5qGIYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzT3B0aW9uQW5zd2VyKGluZGV4LCBhbnN3ZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpO1xyXG4gICAgICAgICAgICBkZWJ1Zygn5aSE55CGQUnlk43lupTlpLHotKXvvJonICsgZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcHJvY2Vzc09wdGlvbkFuc3dlcihxdWVzdGlvbkluZGV4OiBudW1iZXIsIGFuc3dlcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9ucy5maW5kKHEgPT4gcS5pbmRleCA9PT0gcXVlc3Rpb25JbmRleCk7XHJcbiAgICAgICAgaWYgKCFxdWVzdGlvbiB8fCAhcXVlc3Rpb24ub3B0aW9ucykge1xyXG4gICAgICAgICAgICBkZWJ1Zyhg5aSE55CG6YCJ6aG5562U5qGI5aSx6LSl77ya5pyq5om+5Yiw6aKY55uuICR7cXVlc3Rpb25JbmRleH0g5oiW6aKY55uu5rKh5pyJ6YCJ6aG5YCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlYnVnKGDlpITnkIbnrKwgJHtxdWVzdGlvbkluZGV4fSDpopjpgInpobnnrZTmoYjvvJpcXG7popjlnovvvJoke3F1ZXN0aW9uLnR5cGV9XFxu562U5qGI77yaJHthbnN3ZXJ9XFxu5Y+v55So6YCJ6aG577yaJHtxdWVzdGlvbi5vcHRpb25zLmpvaW4oJywgJyl9YCk7XHJcblxyXG4gICAgICAgIC8vIOWkhOeQhuWNlemAiemimOWSjOWkmumAiemimFxyXG4gICAgICAgIGxldCBhbnN3ZXJMZXR0ZXJzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGlmIChhbnN3ZXIuaW5jbHVkZXMoJyYnKSkge1xyXG4gICAgICAgICAgICAvLyDlpITnkIblpJrpgInpopjmoLzlvI8gXCJBJkImQ1wiXHJcbiAgICAgICAgICAgIGFuc3dlckxldHRlcnMgPSBhbnN3ZXIudG9VcHBlckNhc2UoKS5zcGxpdCgnJicpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYW5zd2VyLmluY2x1ZGVzKCcsJykpIHtcclxuICAgICAgICAgICAgLy8g5aSE55CG5aSa6YCJ6aKY5qC85byPIFwiQSxCLENcIlxyXG4gICAgICAgICAgICBhbnN3ZXJMZXR0ZXJzID0gYW5zd2VyLnRvVXBwZXJDYXNlKCkuc3BsaXQoJywnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyDlpITnkIbljZXpgInpopjmoLzlvI8gXCJBXCIg5oiW5YW25LuW5qC85byPXHJcbiAgICAgICAgICAgIGFuc3dlckxldHRlcnMgPSBbYW5zd2VyLnRvVXBwZXJDYXNlKCkuY2hhckF0KDApXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlYnVnKGDnrZTmoYjlrZfmr43vvJoke2Fuc3dlckxldHRlcnMuam9pbignLCAnKX1gKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBsZXR0ZXIgb2YgYW5zd2VyTGV0dGVycykge1xyXG4gICAgICAgICAgICAvLyDmib7liLDlr7nlupTpgInpobnnmoTntKLlvJXvvIhBPTAsIEI9MSwgQz0yLCBEPTPvvIlcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uSW5kZXggPSBsZXR0ZXIudHJpbSgpLmNoYXJBdCgwKS5jaGFyQ29kZUF0KDApIC0gJ0EnLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25JbmRleCA+PSAwICYmIG9wdGlvbkluZGV4IDwgcXVlc3Rpb24ub3B0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldE9wdGlvbiA9IHF1ZXN0aW9uLmVsZW1lbnQucXVlcnlTZWxlY3RvcihgLm9wdGlvbjpudGgtY2hpbGQoJHtvcHRpb25JbmRleCArIDF9KWApIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldE9wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGDngrnlh7vpgInpobkgJHtsZXR0ZXJ977yaJHtxdWVzdGlvbi5vcHRpb25zW29wdGlvbkluZGV4XX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcHRpb24uY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYOacquaJvuWIsOmAiemhuSAke2xldHRlcn0g55qE5YWD57SgYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWJ1Zyhg6YCJ6aG557Si5byV6LaF5Ye66IyD5Zu077yaJHtsZXR0ZXJ9IC0+ICR7b3B0aW9uSW5kZXh9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4uL3N0eWxlcy9hdXRvLWFuc3dlci5tb2R1bGUuY3NzJztcclxuaW1wb3J0IHtDb25maWcsIGRlYnVnLCBnZXRDb25maWcsIHNhdmVDb25maWd9IGZyb20gJy4uL3V0aWxzL2NvbmZpZyc7XHJcbmltcG9ydCB7QW5zd2VySGFuZGxlciwgUXVlc3Rpb259IGZyb20gJy4uL3V0aWxzL2Fuc3dlcic7XHJcbmltcG9ydCB7QVBJRmFjdG9yeX0gZnJvbSAnLi4vdXRpbHMvYXBpL2ZhY3RvcnknO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFua0FQSX0gZnJvbSAnLi4vdXRpbHMvYXBpL3F1ZXN0aW9uLWJhbmsnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZpZ1BhbmVsIHtcclxuICAgIHByaXZhdGUgcGFuZWw6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBhbnN3ZXJIYW5kbGVyOiBBbnN3ZXJIYW5kbGVyO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50Q29uZmlnOiBDb25maWc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wYW5lbCA9IHRoaXMuY3JlYXRlUGFuZWwoKTtcclxuICAgICAgICB0aGlzLmFuc3dlckhhbmRsZXIgPSBBbnN3ZXJIYW5kbGVyLmdldEluc3RhbmNlKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIHNob3coKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgdGhpcy5wYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgICAgICAgLy8g5Yqg6L295bey5L+d5a2Y55qE6YWN572uXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGktdHlwZScpIGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZSA9IGNvbmZpZy5hcGlUeXBlO1xyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gY29uZmlnLmFwaUtleXNbY29uZmlnLmFwaVR5cGVdIHx8ICcnO1xyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLW9wZW5haS11cmwnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IGNvbmZpZy5jdXN0b21PcGVuQUlVcmwgfHwgJyc7XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b20tb3BlbmFpLW1vZGVsJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBjb25maWcuY3VzdG9tT3BlbkFJTW9kZWwgfHwgJyc7XHJcblxyXG4gICAgICAgIC8vIOaYvuekui/pmpDol4/oh6rlrprkuYlVUkzlkozmqKHlnovovpPlhaXmoYZcclxuICAgICAgICB0aGlzLnRvZ2dsZUN1c3RvbVVybElucHV0KGNvbmZpZy5hcGlUeXBlKTtcclxuXHJcbiAgICAgICAgLy8g5Y+q5pyJ5b2TQVBJIGtleeS4jeS4uuepuuaXtuaJjemqjOivgVxyXG4gICAgICAgIGlmIChjb25maWcuYXBpS2V5c1tjb25maWcuYXBpVHlwZV0pIHtcclxuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUFwaUtleShjb25maWcuYXBpS2V5c1tjb25maWcuYXBpVHlwZV0gfHwgJycsIGNvbmZpZy5hcGlUeXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOaJq+aPj+W5tuaYvuekuumimOebrlxyXG4gICAgICAgIGNvbnN0IHF1ZXN0aW9ucyA9IGF3YWl0IHRoaXMuYW5zd2VySGFuZGxlci5zY2FuUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvbkdyaWQocXVlc3Rpb25zKTtcclxuXHJcbiAgICAgICAgLy8g5re75Yqg6YCJ6aG554K55Ye755qE5YWo5bGA5aSE55CG5Ye95pWwXHJcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnNlbGVjdE9wdGlvbiA9IChxdWVzdGlvbkluZGV4OiBudW1iZXIsIG9wdGlvbkxldHRlcjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICh0aGlzLmFuc3dlckhhbmRsZXIgYXMgYW55KS5zZWxlY3RPcHRpb24ocXVlc3Rpb25JbmRleCwgb3B0aW9uTGV0dGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDmt7vliqDloavnqbrpopjovpPlhaXmoYblgLzmm7TmlrDnmoTlhajlsYDlpITnkIblh73mlbBcclxuICAgICAgICAod2luZG93IGFzIGFueSkudXBkYXRlQmxhbmtWYWx1ZSA9IChxdWVzdGlvbkluZGV4OiBudW1iZXIsIGJsYW5rTnVtYmVyOiBudW1iZXIsIHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLmFuc3dlckhhbmRsZXIuZ2V0UXVlc3Rpb25zKCkuZmluZChxID0+IHEuaW5kZXggPT09IHF1ZXN0aW9uSW5kZXgpO1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24/LmJsYW5rcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxhbmsgPSBxdWVzdGlvbi5ibGFua3MuZmluZChiID0+IGIubnVtYmVyID09PSBibGFua051bWJlcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmxhbmspIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhbmsuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7YnViYmxlczogdHJ1ZX0pKTtcclxuICAgICAgICAgICAgICAgICAgICBibGFuay5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7YnViYmxlczogdHJ1ZX0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlUGFuZWwoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcGFuZWwuY2xhc3NOYW1lID0gc3R5bGVzLmNvbmZpZ1BhbmVsO1xyXG4gICAgICAgIHBhbmVsLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLnBhbmVsSGVhZGVyfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmNsb3NlQnRufVwiIHRpdGxlPVwi5YWz6ZetXCI+w5c8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy50YWJDb250YWluZXJ9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMudGFifSAke3N0eWxlcy5hY3RpdmV9XCIgZGF0YS10YWI9XCJxdWVzdGlvbnNcIj7or4bliKvpopjnm648L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy50YWJ9XCIgZGF0YS10YWI9XCJhcGlcIj5BUEnphY3nva48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy50YWJ9XCIgZGF0YS10YWI9XCJxdWVzdGlvbi1iYW5rXCI+6aKY5bqT6YWN572uPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMudGFiQ29udGVudH0gJHtzdHlsZXMuYWN0aXZlfVwiIGlkPVwicXVlc3Rpb25zLXRhYlwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLnF1ZXN0aW9uR3JpZH1cIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5xdWVzdGlvbkRldGFpbH1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD7or7fngrnlh7vpopjlj7fmn6XnnIvor6bnu4bkv6Hmga88L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5idG5Db250YWluZXJ9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIiR7c3R5bGVzLmJ0bn0gJHtzdHlsZXMuYnRuUHJpbWFyeX1cIiBpZD1cInRvZ2dsZS1hbnN3ZXJcIj7lvIDlp4vnrZTpopg8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiJHtzdHlsZXMuYnRufSAke3N0eWxlcy5idG5EZWZhdWx0fVwiIGlkPVwic2Nhbi1xdWVzdGlvbnNcIj7ph43mlrDmiavmj488L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLnRhYkNvbnRlbnR9XCIgaWQ9XCJhcGktdGFiXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuYXBpQ29uZmlnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5mb3JtSXRlbX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPkFQSeexu+WeizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJhcGktdHlwZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1vb25zaG90XCI+TW9vbnNob3Q8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkZWVwc2Vla1wiPkRlZXBzZWVrPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY2hhdGdwdFwiPkNoYXRHUFQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJjdXN0b20tb3BlbmFpXCI+6Ieq5a6a5LmJT3BlbkFJ5o6l5Y+jPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5mb3JtSXRlbX1cIiBpZD1cImN1c3RvbS11cmwtaXRlbVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPuiHquWumuS5iUFQSeWcsOWdgDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY3VzdG9tLW9wZW5haS11cmxcIiBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeiHquWumuS5iU9wZW5BSSBBUEnlnLDlnYDvvIzlpoLvvJpodHRwczovL25ldy5samNsamMuY24vdjFcIiB2YWx1ZT1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuYXBpS2V5SGVscH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPuivt+i+k+WFpeWujOaVtOeahEFQSeWcsOWdgO+8jOWMheaLrOWNj+iuruWSjOeJiOacrOWPtzwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPuaOqOiNkOS9v+eUqCA8YSBocmVmPVwiaHR0cHM6Ly9lLmxqY3N5cy50b3AvYWkvXCIgdGFyZ2V0PVwiX2JsYW5rXCIgc3R5bGU9XCJjb2xvcjogIzQwOUVGRjsgdGV4dC1kZWNvcmF0aW9uOiBub25lO1wiPkFJIEFQSTwvYT4g5Luj55CG5pyN5Yqh77yM5pSv5oyBIENoYXRHUFTjgIFHZW1pbmnjgIFDbGF1ZGUg562J5Li75rWB5qih5Z6L77yM5LiA6ZSu5o6l5YWl44CCPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+PGEgaHJlZj1cImh0dHBzOi8vbmV3LmxqY2xqYy5jbi9wcmljaW5nXCIgdGFyZ2V0PVwiX2JsYW5rXCIgc3R5bGU9XCJjb2xvcjogIzQwOUVGRjsgdGV4dC1kZWNvcmF0aW9uOiBub25lO1wiPuafpeeci+aooeWei+WIl+ihqDwvYT48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5mb3JtSXRlbX1cIiBpZD1cImN1c3RvbS1tb2RlbC1pdGVtXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+6Ieq5a6a5LmJ5qih5Z6LPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJjdXN0b20tb3BlbmFpLW1vZGVsXCIgcGxhY2Vob2xkZXI9XCJncHQtNC4xXCIgdmFsdWU9XCJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuZm9ybUl0ZW19XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD5BUEnlr4bpkqU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuaW5wdXRHcm91cH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImFwaS1rZXlcIiBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpUFQSeWvhumSpVwiIHZhbHVlPVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwidG9nZ2xlLXBhc3N3b3JkXCIgdGl0bGU9XCLmmL7npLov6ZqQ6JeP5a+G56CBXCI+8J+Rge+4jzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmFwaUtleUhlbHB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5BUEnlr4bpkqXmoLzlvI/or7TmmI7vvJo8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPk1vb25zaG90OiDku6Ugc2stIOW8gOWktDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkRlZXBzZWVrOiDku6Ugc2stIOW8gOWktDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkNoYXRHUFQ6IOS7pSBzay0g5byA5aS0PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+6Ieq5a6a5LmJT3BlbkFJOiDku6Ugc2stIOW8gOWktDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuYnRuQ29udGFpbmVyfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiJHtzdHlsZXMuYnRufSAke3N0eWxlcy5idG5QcmltYXJ5fVwiIGlkPVwidGVzdC1hcGlcIj7mtYvor5Xov57mjqU8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIiR7c3R5bGVzLmJ0bn0gJHtzdHlsZXMuYnRuUHJpbWFyeX1cIiBpZD1cInNhdmUtYXBpXCI+5L+d5a2Y6YWN572uPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCIke3N0eWxlcy5idG59ICR7c3R5bGVzLmJ0bkRlZmF1bHR9XCIgaWQ9XCJjbG9zZS1wYW5lbFwiPuWFs+mXrTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMudGFiQ29udGVudH1cIiBpZD1cInF1ZXN0aW9uLWJhbmstdGFiXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuYXBpQ29uZmlnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3N0eWxlcy5mb3JtSXRlbX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPumimOW6k1Rva2VuPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7c3R5bGVzLmlucHV0R3JvdXB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJxdWVzdGlvbi1iYW5rLXRva2VuXCIgcGxhY2Vob2xkZXI9XCLor7fovpPlhaXpopjlupNUb2tlblwiIHZhbHVlPVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwidG9nZ2xlLWJhbmstcGFzc3dvcmRcIiB0aXRsZT1cIuaYvuekui/pmpDol4/lr4bnoIFcIj7wn5GB77iPPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly90ay5lbm5jeS5jblwiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwiJHtzdHlsZXMuZ2V0VG9rZW5CdG59XCI+5Y676I635Y+WPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtzdHlsZXMuYnRuQ29udGFpbmVyfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiJHtzdHlsZXMuYnRufSAke3N0eWxlcy5idG5QcmltYXJ5fVwiIGlkPVwidGVzdC1iYW5rXCI+5rWL6K+V6L+e5o6lPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCIke3N0eWxlcy5idG59ICR7c3R5bGVzLmJ0blByaW1hcnl9XCIgaWQ9XCJzYXZlLWJhbmtcIj7kv53lrZjphY3nva48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFuZWwpO1xyXG4gICAgICAgIHJldHVybiBwYW5lbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRFdmVudHMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8g5Yid5aeL5YyW5b2T5YmN6YCJ5Lit55qEQVBJ57G75Z6L5ZKM5a+55bqU55qE5a+G6ZKlXHJcbiAgICAgICAgY29uc3QgYXBpVHlwZVNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGktdHlwZScpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGFwaUtleUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGN1c3RvbVVybElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1vcGVuYWktdXJsJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgICAgYXBpVHlwZVNlbGVjdC52YWx1ZSA9IHRoaXMuY3VycmVudENvbmZpZy5hcGlUeXBlO1xyXG4gICAgICAgIGFwaUtleUlucHV0LnZhbHVlID0gdGhpcy5jdXJyZW50Q29uZmlnLmFwaUtleXNbdGhpcy5jdXJyZW50Q29uZmlnLmFwaVR5cGVdIHx8ICcnO1xyXG4gICAgICAgIGN1c3RvbVVybElucHV0LnZhbHVlID0gdGhpcy5jdXJyZW50Q29uZmlnLmN1c3RvbU9wZW5BSVVybCB8fCAnJztcclxuXHJcbiAgICAgICAgLy8g5Yid5aeL5YyW6Ieq5a6a5LmJVVJM6L6T5YWl5qGG55qE5pi+56S654q25oCBXHJcbiAgICAgICAgdGhpcy50b2dnbGVDdXN0b21VcmxJbnB1dCh0aGlzLmN1cnJlbnRDb25maWcuYXBpVHlwZSk7XHJcblxyXG4gICAgICAgIC8vIOWFs+mXreaMiemSruS6i+S7tlxyXG4gICAgICAgIHRoaXMucGFuZWwucXVlcnlTZWxlY3RvcihgLiR7c3R5bGVzLmNsb3NlQnRufWApPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWFs+mXremdouadv+aMiemSruS6i+S7tlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZS1wYW5lbCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWIh+aNouWvhueggeaYvuekuueKtuaAgVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtcGFzc3dvcmQnKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSAndGV4dCc7XHJcbiAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAn8J+Ukic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICfwn5GB77iPJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDliIfmjaLmoIfnrb7pobVcclxuICAgICAgICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3N0eWxlcy50YWJ9YCkuZm9yRWFjaCh0YWIgPT4ge1xyXG4gICAgICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyDnp7vpmaTmiYDmnInmoIfnrb7pobXnmoRhY3RpdmXnsbtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFuZWwucXVlcnlTZWxlY3RvckFsbChgLiR7c3R5bGVzLnRhYn1gKS5mb3JFYWNoKHQgPT5cclxuICAgICAgICAgICAgICAgICAgICB0LmNsYXNzTGlzdC5yZW1vdmUoc3R5bGVzLmFjdGl2ZSlcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g56e76Zmk5omA5pyJ5YaF5a655Yy655qEYWN0aXZl57G7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3N0eWxlcy50YWJDb250ZW50fWApLmZvckVhY2goYyA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGMuY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuYWN0aXZlKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmt7vliqDlvZPliY3moIfnrb7pobXnmoRhY3RpdmXnsbtcclxuICAgICAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKHN0eWxlcy5hY3RpdmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOa3u+WKoOWvueW6lOWGheWuueWMuueahGFjdGl2Zeexu1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFiSWQgPSAodGFiIGFzIEhUTUxFbGVtZW50KS5kYXRhc2V0LnRhYjtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RhYklkfS10YWJgKT8uY2xhc3NMaXN0LmFkZChzdHlsZXMuYWN0aXZlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFQSeexu+Wei+WIh+aNouaXtuWKoOi9veWvueW6lOeahEFQSeWvhumSpVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGktdHlwZScpPy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYXBpVHlwZSA9IChldmVudC50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIGFzICdtb29uc2hvdCcgfCAnZGVlcHNlZWsnIHwgJ2NoYXRncHQnIHwgJ2N1c3RvbS1vcGVuYWknO1xyXG4gICAgICAgICAgICBjb25zdCBhcGlLZXlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgYXBpS2V5SW5wdXQudmFsdWUgPSB0aGlzLmN1cnJlbnRDb25maWcuYXBpS2V5c1thcGlUeXBlXSB8fCAnJztcclxuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUFwaUtleShhcGlLZXlJbnB1dC52YWx1ZSwgYXBpVHlwZSk7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlQ3VzdG9tVXJsSW5wdXQoYXBpVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFQSeWvhumSpei+k+WFpeaXtuWunuaXtumqjOivgVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5Jyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwaUtleSA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwaVR5cGUgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS10eXBlJykgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIGFzICdtb29uc2hvdCcgfCAnZGVlcHNlZWsnIHwgJ2NoYXRncHQnIHwgJ2N1c3RvbS1vcGVuYWknO1xyXG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQXBpS2V5KGFwaUtleSwgYXBpVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOa1i+ivlUFQSei/nuaOpVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0LWFwaScpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rlc3QtYXBpJyk7XHJcbiAgICAgICAgICAgIGlmICghYnV0dG9uKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhcGlLZXkgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgYXBpVHlwZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLXR5cGUnKSBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgYXMgJ21vb25zaG90JyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCcgfCAnY3VzdG9tLW9wZW5haSc7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbVVybCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLW9wZW5haS11cmwnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWxpZGF0ZUFwaUtleShhcGlLZXksIGFwaVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhcGlUeXBlID09PSAnY3VzdG9tLW9wZW5haScgJiYgIWN1c3RvbVVybC50cmltKCkpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfor7fovpPlhaXoh6rlrprkuYlBUEnlnLDlnYAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIChidXR0b24gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLnRleHRDb250ZW50ID0gJ+a1i+ivleS4rS4uLic7XHJcbiAgICAgICAgICAgICAgICAoYnV0dG9uIGFzIEhUTUxCdXR0b25FbGVtZW50KS5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VzdG9tTW9kZWwgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1vcGVuYWktbW9kZWwnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDliJvlu7rkuLTml7bphY3nva7ov5vooYzmtYvor5VcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RDb25maWc6IENvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmN1cnJlbnRDb25maWcsXHJcbiAgICAgICAgICAgICAgICAgICAgYXBpVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBhcGlLZXlzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuY3VycmVudENvbmZpZy5hcGlLZXlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXBpVHlwZV06IGFwaUtleVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tT3BlbkFJVXJsOiBhcGlUeXBlID09PSAnY3VzdG9tLW9wZW5haScgPyBjdXN0b21VcmwgOiB0aGlzLmN1cnJlbnRDb25maWcuY3VzdG9tT3BlbkFJVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbU9wZW5BSU1vZGVsOiBhcGlUeXBlID09PSAnY3VzdG9tLW9wZW5haScgPyAoY3VzdG9tTW9kZWwgfHwgJ2dwdC00LjEnKSA6IHRoaXMuY3VycmVudENvbmZpZy5jdXN0b21PcGVuQUlNb2RlbFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDkuLTml7bkv53lrZjphY3nva7nlKjkuo7mtYvor5VcclxuICAgICAgICAgICAgICAgIHNhdmVDb25maWcodGVzdENvbmZpZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6YeN572uQVBJ5o+Q5L6b6ICF5Lul5L2/55So5paw6YWN572uXHJcbiAgICAgICAgICAgICAgICBBUElGYWN0b3J5LmdldEluc3RhbmNlKCkucmVzZXRQcm92aWRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0gQVBJRmFjdG9yeS5nZXRJbnN0YW5jZSgpLmdldFByb3ZpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByb3ZpZGVyLmNoYXQoW1xyXG4gICAgICAgICAgICAgICAgICAgIHtyb2xlOiAndXNlcicsIGNvbnRlbnQ6ICfkvaDlpb3vvIzov5nmmK/kuIDkuKrmtYvor5Xmtojmga/jgILor7flm57lpI1cIui/nuaOpeaIkOWKn1wi44CCJ31cclxuICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhPy5jaG9pY2VzPy5bMF0/Lm1lc3NhZ2U/LmNvbnRlbnQuaW5jbHVkZXMoJ+i/nuaOpeaIkOWKnycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FQSei/nuaOpea1i+ivleaIkOWKn++8gScpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQVBJ6L+e5o6l5rWL6K+V5aSx6LSl77ya5ZON5bqU5qC85byP5LiN5q2j56GuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQVBJ6L+e5o6l5rWL6K+V5aSx6LSl77yaJyArIGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAoYnV0dG9uIGFzIEhUTUxCdXR0b25FbGVtZW50KS50ZXh0Q29udGVudCA9ICfmtYvor5Xov57mjqUnO1xyXG4gICAgICAgICAgICAgICAgKGJ1dHRvbiBhcyBIVE1MQnV0dG9uRWxlbWVudCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmgaLlpI3ljp/lp4vphY3nva5cclxuICAgICAgICAgICAgICAgIHNhdmVDb25maWcodGhpcy5jdXJyZW50Q29uZmlnKTtcclxuICAgICAgICAgICAgICAgIEFQSUZhY3RvcnkuZ2V0SW5zdGFuY2UoKS5yZXNldFByb3ZpZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g5L+d5a2YQVBJ6YWN572uXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtYXBpJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhcGlLZXkgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgYXBpVHlwZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLXR5cGUnKSBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWUgYXMgJ21vb25zaG90JyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCcgfCAnY3VzdG9tLW9wZW5haSc7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbVVybCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLW9wZW5haS11cmwnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWxpZGF0ZUFwaUtleShhcGlLZXksIGFwaVR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhcGlUeXBlID09PSAnY3VzdG9tLW9wZW5haScgJiYgIWN1c3RvbVVybC50cmltKCkpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfor7fovpPlhaXoh6rlrprkuYlBUEnlnLDlnYAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY3VzdG9tTW9kZWwgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1vcGVuYWktbW9kZWwnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOabtOaWsOmFjee9rlxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi50aGlzLmN1cnJlbnRDb25maWcsXHJcbiAgICAgICAgICAgICAgICBhcGlUeXBlLFxyXG4gICAgICAgICAgICAgICAgYXBpS2V5czoge1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuY3VycmVudENvbmZpZy5hcGlLZXlzLFxyXG4gICAgICAgICAgICAgICAgICAgIFthcGlUeXBlXTogYXBpS2V5XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tT3BlbkFJVXJsOiBhcGlUeXBlID09PSAnY3VzdG9tLW9wZW5haScgPyBjdXN0b21VcmwgOiB0aGlzLmN1cnJlbnRDb25maWcuY3VzdG9tT3BlbkFJVXJsLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tT3BlbkFJTW9kZWw6IGFwaVR5cGUgPT09ICdjdXN0b20tb3BlbmFpJyA/IChjdXN0b21Nb2RlbCB8fCAnZ3B0LTQuMScpIDogdGhpcy5jdXJyZW50Q29uZmlnLmN1c3RvbU9wZW5BSU1vZGVsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyDkv53lrZjphY3nva5cclxuICAgICAgICAgICAgc2F2ZUNvbmZpZyh0aGlzLmN1cnJlbnRDb25maWcpO1xyXG5cclxuICAgICAgICAgICAgLy8g6YeN572uQVBJ5o+Q5L6b6ICF77yM6L+Z5qC35LiL5qyh5L2/55So5pe25Lya5L2/55So5paw55qE6YWN572uXHJcbiAgICAgICAgICAgIEFQSUZhY3RvcnkuZ2V0SW5zdGFuY2UoKS5yZXNldFByb3ZpZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBhbGVydCgn6YWN572u5bey5L+d5a2YJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+WMlumimOW6k3Rva2VuXHJcbiAgICAgICAgY29uc3QgcXVlc3Rpb25CYW5rSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb24tYmFuay10b2tlbicpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgcXVlc3Rpb25CYW5rSW5wdXQudmFsdWUgPSB0aGlzLmN1cnJlbnRDb25maWcucXVlc3Rpb25CYW5rVG9rZW4gfHwgJyc7XHJcblxyXG4gICAgICAgIC8vIOWIh+aNoumimOW6k+WvhueggeaYvuekuueKtuaAgVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtYmFuay1wYXNzd29yZCcpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBldmVudC50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1ZXN0aW9uLWJhbmstdG9rZW4nKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICfwn5SSJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ/CfkYHvuI8nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOa1i+ivlemimOW6k+i/nuaOpVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0LWJhbmsnKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0LWJhbmsnKTtcclxuICAgICAgICAgICAgaWYgKCFidXR0b24pIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvbi1iYW5rLXRva2VuJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgn6K+36L6T5YWl6aKY5bqTVG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICfmtYvor5XkuK0uLi4nO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmt7vliqDotoXml7bmjqfliLZcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2UoKF8sIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KG5ldyBFcnJvcign6L+e5o6l6LaF5pe2JykpLCA1MDAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uQmFuayA9IG5ldyBRdWVzdGlvbkJhbmtBUEkodG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdFByb21pc2UgPSBxdWVzdGlvbkJhbmsucXVlcnkoJ+S4i+WIl+mAiemhueS4re+8jOeUqOS6juiOt+WPllBPU1Tor7fmsYLlj4LmlbDnmoTmmK8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDkvb/nlKhQcm9taXNlLnJhY2Xlrp7njrDotoXml7bmjqfliLZcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UucmFjZShbdGVzdFByb21pc2UsIHRpbWVvdXRQcm9taXNlXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfpopjlupPov57mjqXmtYvor5XmiJDlip/vvIEnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmtYvor5XmiJDlip/lkI7oh6rliqjkv53lrZjphY3nva5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuY3VycmVudENvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25CYW5rVG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBzYXZlQ29uZmlnKHRoaXMuY3VycmVudENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ+mimOW6k+mFjee9ruW3suS/neWtmCcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn6aKY5bqT6L+e5o6l5rWL6K+V5aSx6LSl77ya6K+35qOA5p+lVG9rZW7mmK/lkKbmraPnoa4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfpopjlupPov57mjqXmtYvor5XlpLHotKXvvJonICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAn5rWL6K+V6L+e5o6lJztcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOS/neWtmOmimOW6k+mFjee9rlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLWJhbmsnKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdWVzdGlvbi1iYW5rLXRva2VuJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAvLyDmm7TmlrDphY3nva5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgLi4udGhpcy5jdXJyZW50Q29uZmlnLFxyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25CYW5rVG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyDkv53lrZjphY3nva5cclxuICAgICAgICAgICAgc2F2ZUNvbmZpZyh0aGlzLmN1cnJlbnRDb25maWcpO1xyXG5cclxuICAgICAgICAgICAgLy8g6YeN572uQVBJ5o+Q5L6b6ICFXHJcbiAgICAgICAgICAgIEFQSUZhY3RvcnkuZ2V0SW5zdGFuY2UoKS5yZXNldFByb3ZpZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBhbGVydCgn6YWN572u5bey5L+d5a2YJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOW8gOWni+etlOmimOaMiemSruS6i+S7tlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtYW5zd2VyJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLWFuc3dlcicpO1xyXG4gICAgICAgICAgICBpZiAoIWJ1dHRvbikgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKCh0aGlzLmFuc3dlckhhbmRsZXIgYXMgYW55KS5pc1Byb2Nlc3NpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VySGFuZGxlci5zdG9wQXV0b0Fuc3dlcigpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gJ+W8gOWni+etlOmimCc7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZShzdHlsZXMuYnRuRGFuZ2VyKTtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKHN0eWxlcy5idG5QcmltYXJ5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICflgZzmraLnrZTpopgnO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoc3R5bGVzLmJ0blByaW1hcnkpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoc3R5bGVzLmJ0bkRhbmdlcik7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFuc3dlckhhbmRsZXIuc3RhcnRBdXRvQW5zd2VyKCk7XHJcbiAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAn5byA5aeL562U6aKYJztcclxuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKHN0eWxlcy5idG5EYW5nZXIpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoc3R5bGVzLmJ0blByaW1hcnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIOmHjeaWsOaJq+aPj+aMiemSruS6i+S7tlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2FuLXF1ZXN0aW9ucycpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hbnN3ZXJIYW5kbGVyLnNjYW5RdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb25zID0gYXdhaXQgdGhpcy5hbnN3ZXJIYW5kbGVyLnNjYW5RdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvbkdyaWQocXVlc3Rpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvZ2dsZUN1c3RvbVVybElucHV0KGFwaVR5cGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGN1c3RvbVVybEl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLXVybC1pdGVtJyk7XHJcbiAgICAgICAgY29uc3QgY3VzdG9tTW9kZWxJdGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1tb2RlbC1pdGVtJyk7XHJcblxyXG4gICAgICAgIGlmIChjdXN0b21VcmxJdGVtICYmIGN1c3RvbU1vZGVsSXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoYXBpVHlwZSA9PT0gJ2N1c3RvbS1vcGVuYWknKSB7XHJcbiAgICAgICAgICAgICAgICBjdXN0b21VcmxJdGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tTW9kZWxJdGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tVXJsSXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tTW9kZWxJdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUFwaUtleShhcGlLZXk6IHN0cmluZywgYXBpVHlwZTogJ21vb25zaG90JyB8ICdkZWVwc2VlaycgfCAnY2hhdGdwdCcgfCAnY3VzdG9tLW9wZW5haScpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBjb25zdCBzYXZlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtYXBpJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgdGVzdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0LWFwaScpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgICAgICAvLyDlpoLmnpzkuLrnqbrvvIzlhYHorrjpgJrov4fvvIjlm6DkuLrlj6/og73mmK/liJ3lp4vnirbmgIHvvIlcclxuICAgICAgICBpZiAoIWFwaUtleSkge1xyXG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKHN0eWxlcy5lcnJvcik7XHJcbiAgICAgICAgICAgIHNhdmVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVzdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOS4jeiDveacieepuuagvFxyXG4gICAgICAgIGlmIChhcGlLZXkudHJpbSgpICE9PSBhcGlLZXkpIHtcclxuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChzdHlsZXMuZXJyb3IpO1xyXG4gICAgICAgICAgICBhbGVydCgnQVBJ5a+G6ZKl5LiN6IO95YyF5ZCr56m65qC8Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoc3R5bGVzLmVycm9yKTtcclxuICAgICAgICBzYXZlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGVzdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUXVlc3Rpb25HcmlkKHF1ZXN0aW9uczogUXVlc3Rpb25bXSkge1xyXG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLnBhbmVsLnF1ZXJ5U2VsZWN0b3IoYC4ke3N0eWxlcy5xdWVzdGlvbkdyaWR9YCk7XHJcbiAgICAgICAgaWYgKCFncmlkKSByZXR1cm47XHJcblxyXG4gICAgICAgIGdyaWQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgcXVlc3Rpb25zLmZvckVhY2goKHF1ZXN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBib3guY2xhc3NOYW1lID0gYCR7c3R5bGVzLnF1ZXN0aW9uQm94fSAke3F1ZXN0aW9uLmFuc3dlciA/IHN0eWxlcy5jb21wbGV0ZWQgOiAnJ31gO1xyXG4gICAgICAgICAgICBib3gudGV4dENvbnRlbnQgPSBxdWVzdGlvbi5pbmRleC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBib3gub25jbGljayA9ICgpID0+IHRoaXMuc2hvd1F1ZXN0aW9uRGV0YWlsKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgZ3JpZC5hcHBlbmRDaGlsZChib3gpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvd1F1ZXN0aW9uRGV0YWlsKHF1ZXN0aW9uOiBRdWVzdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IHRoaXMucGFuZWwucXVlcnlTZWxlY3RvcihgLiR7c3R5bGVzLnF1ZXN0aW9uRGV0YWlsfWApO1xyXG4gICAgICAgIGlmICghZGV0YWlsKSByZXR1cm47XHJcblxyXG4gICAgICAgIGRldGFpbC5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAyMHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgPGg0IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTJweDsgY29sb3I6ICMzMDMxMzM7XCI+6aKY55uu5YaF5a6577yaPC9oND5cclxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPVwibGluZS1oZWlnaHQ6IDEuNjsgY29sb3I6ICM2MDYyNjY7XCI+JHtxdWVzdGlvbi5jb250ZW50LnNwbGl0KCdcXG4nKS5qb2luKCc8YnI+Jyl9PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgJHtxdWVzdGlvbi5vcHRpb25zID8gYFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9wdGlvbnMtc2VjdGlvblwiIHN0eWxlPVwibWFyZ2luOiAyMHB4IDA7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTJweDsgY29sb3I6ICMzMDMxMzM7XCI+6YCJ6aG577yaPC9oND5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9XCJsaXN0LXN0eWxlOiBub25lOyBwYWRkaW5nLWxlZnQ6IDA7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR7cXVlc3Rpb24ub3B0aW9ucy5tYXAob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgLy8g5Yik5pat6aKY54m55q6K5aSE55CGXHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbi50eXBlID09PSAnanVkZ2VtZW50Jykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0T3B0aW9uID0gb3B0aW9uLnN0YXJ0c1dpdGgoJ0EnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBzdHlsZT1cIm1hcmdpbjogMTJweCAwOyBwYWRkaW5nOiA4cHggMTJweDsgYmFja2dyb3VuZDogI2Y1ZjdmYTsgYm9yZGVyLXJhZGl1czogNHB4OyBjdXJzb3I6IHBvaW50ZXI7IHRyYW5zaXRpb246IGFsbCAwLjNzOyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyO1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25tb3VzZW92ZXI9XCJ0aGlzLnN0eWxlLmJhY2tncm91bmQ9JyNlY2Y1ZmYnXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbm1vdXNlb3V0PVwidGhpcy5zdHlsZS5iYWNrZ3JvdW5kPScjZjVmN2ZhJ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwid2luZG93LnNlbGVjdE9wdGlvbigke3F1ZXN0aW9uLmluZGV4fSwgJyR7b3B0aW9uLmNoYXJBdCgwKX0nKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZm9udC13ZWlnaHQ6IGJvbGQ7IG1hcmdpbi1yaWdodDogMTBweDtcIj4ke29wdGlvbi5jaGFyQXQoMCl9Ljwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7aXNDb3JyZWN0T3B0aW9uID8gJ+ato+ehricgOiAn6ZSZ6K+vJ308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDlhbbku5bpopjlnovmraPluLjmmL7npLpcclxuICAgICAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgc3R5bGU9XCJtYXJnaW46IDEycHggMDsgcGFkZGluZzogOHB4IDEycHg7IGJhY2tncm91bmQ6ICNmNWY3ZmE7IGJvcmRlci1yYWRpdXM6IDRweDsgY3Vyc29yOiBwb2ludGVyOyB0cmFuc2l0aW9uOiBhbGwgMC4zcztcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25tb3VzZW92ZXI9XCJ0aGlzLnN0eWxlLmJhY2tncm91bmQ9JyNlY2Y1ZmYnXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ubW91c2VvdXQ9XCJ0aGlzLnN0eWxlLmJhY2tncm91bmQ9JyNmNWY3ZmEnXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cIndpbmRvdy5zZWxlY3RPcHRpb24oJHtxdWVzdGlvbi5pbmRleH0sICcke29wdGlvbi5jaGFyQXQoMCl9JylcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID4ke29wdGlvbn08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYDtcclxuICAgICAgICB9KS5qb2luKCcnKX1cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIGAgOiAnJ31cclxuICAgICAgICAgICAgJHtxdWVzdGlvbi5hbnN3ZXIgPyBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW5zd2VyLXNlY3Rpb25cIiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHg7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGg0IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTJweDsgY29sb3I6ICMzMDMxMzM7XCI+562U5qGI77yaPC9oND5cclxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT1cImxpbmUtaGVpZ2h0OiAxLjY7IGNvbG9yOiAjNDA5RUZGO1wiPiR7cXVlc3Rpb24uYW5zd2VyfTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICBgIDogJyd9XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxufSIsImltcG9ydCBzdHlsZXMgZnJvbSAnLi9zdHlsZXMvYXV0by1hbnN3ZXIubW9kdWxlLmNzcyc7XHJcbmltcG9ydCB7ZGVidWd9IGZyb20gJy4vdXRpbHMvY29uZmlnJztcclxuaW1wb3J0IHtDb25maWdQYW5lbH0gZnJvbSAnLi9jb21wb25lbnRzL0NvbmZpZ1BhbmVsJztcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGRlYnVnKCflvIDlp4vliJ3lp4vljJYnKTtcclxuXHJcbiAgICAgICAgLy8g5Yib5bu66YWN572u5oyJ6ZKuXHJcbiAgICAgICAgY29uc3QgY29uZmlnQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgY29uZmlnQnRuLmNsYXNzTmFtZSA9IHN0eWxlcy5jb25maWdCdG47XHJcbiAgICAgICAgY29uZmlnQnRuLnRleHRDb250ZW50ID0gJ+Kame+4jyc7XHJcblxyXG4gICAgICAgIC8vIOWIm+W7uumFjee9rumdouadv+WunuS+i1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1BhbmVsID0gbmV3IENvbmZpZ1BhbmVsKCk7XHJcblxyXG4gICAgICAgIC8vIOeCueWHu+mFjee9ruaMiemSruaYvuekuumdouadv1xyXG4gICAgICAgIGNvbmZpZ0J0bi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25maWdQYW5lbC5zaG93KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb25maWdCdG4pO1xyXG4gICAgICAgIGRlYnVnKCfliJ3lp4vljJblrozmiJAnKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpO1xyXG4gICAgICAgIGRlYnVnKCfliJ3lp4vljJblpLHotKU6ICcgKyBlcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyDnrYnlvoXpobXpnaLliqDovb3lrozmiJDlkI7lho3liJ3lp4vljJZcclxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xyXG4gICAgZGVidWcoJ+etieW+hemhtemdouWKoOi9vScpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXQpO1xyXG59IGVsc2Uge1xyXG4gICAgZGVidWcoJ+mhtemdouW3suWKoOi9ve+8jOebtOaOpeWIneWni+WMlicpO1xyXG4gICAgaW5pdCgpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJkZWZhdWx0Q29uZmlnIiwiYXBpVHlwZSIsImFwaUtleXMiLCJjdXN0b21PcGVuQUlVcmwiLCJjdXN0b21PcGVuQUlNb2RlbCIsImRlYnVnTW9kZSIsImdldENvbmZpZyIsInNhdmVkQ29uZmlnIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImNvbmZpZyIsIkpTT04iLCJwYXJzZSIsIm9sZEFwaUtleSIsImFwaUtleSIsInNhdmVDb25maWciLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZGVidWciLCJtZXNzYWdlIiwiY29uc29sZSIsImxvZyIsImdsb2JhbCIsImZhaWxzIiwicmVxdWlyZSQkMCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciIsImNsYXNzb2ZSYXciLCJjbGFzc29mIiwicmVxdWlyZSQkMSIsInJlcXVpcmVPYmplY3RDb2VyY2libGUiLCJ0b0luZGV4ZWRPYmplY3QiLCJpc0NhbGxhYmxlIiwiaXNPYmplY3QiLCJnZXRCdWlsdEluIiwiTkFUSVZFX1NZTUJPTCIsIlVTRV9TWU1CT0xfQVNfVUlEIiwicmVxdWlyZSQkMiIsImlzU3ltYm9sIiwidHJ5VG9TdHJpbmciLCJhQ2FsbGFibGUiLCJnZXRNZXRob2QiLCJvcmRpbmFyeVRvUHJpbWl0aXZlIiwic2V0R2xvYmFsIiwic3RvcmUiLCJzaGFyZWRNb2R1bGUiLCJ0b09iamVjdCIsInVpZCIsInNoYXJlZCIsImhhc093biIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsIlN5bWJvbCIsIndlbGxLbm93blN5bWJvbCIsInRvUHJpbWl0aXZlIiwidG9Qcm9wZXJ0eUtleSIsImRvY3VtZW50IiwiRVhJU1RTIiwiZG9jdW1lbnRDcmVhdGVFbGVtZW50IiwiREVTQ1JJUFRPUlMiLCJJRThfRE9NX0RFRklORSIsInJlcXVpcmUkJDYiLCJhbk9iamVjdCIsImRlZmluZVByb3BlcnR5TW9kdWxlIiwiY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5IiwiaW5zcGVjdFNvdXJjZSIsIldlYWtNYXAiLCJzaGFyZWRLZXkiLCJoaWRkZW5LZXlzIiwicmVxdWlyZSQkNyIsIkludGVybmFsU3RhdGVNb2R1bGUiLCJnZXRJbnRlcm5hbFN0YXRlIiwicmVkZWZpbmVNb2R1bGUiLCJ0b0ludGVnZXJPckluZmluaXR5IiwibWluIiwidG9BYnNvbHV0ZUluZGV4IiwidG9MZW5ndGgiLCJsZW5ndGhPZkFycmF5TGlrZSIsImVudW1CdWdLZXlzIiwiaW50ZXJuYWxPYmplY3RLZXlzIiwib3duS2V5cyIsImNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMiLCJpc0ZvcmNlZCIsInJlZGVmaW5lIiwiYW5JbnN0YW5jZSIsIm9iamVjdEtleXMiLCJodG1sIiwiSUVfUFJPVE8iLCJJVEVSQVRPUiIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiJCIsInJlcXVpcmUkJDgiLCJUT19TVFJJTkdfVEFHIiwiSXRlcmF0b3JzIiwiaXNBcnJheUl0ZXJhdG9yTWV0aG9kIiwiZ2V0SXRlcmF0b3JNZXRob2QiLCJnZXRJdGVyYXRvciIsIml0ZXJhdG9yQ2xvc2UiLCJpdGVyYXRlIiwicmVkZWZpbmVBbGwiLCJjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nIiwiY3JlYXRlSXRlcmF0b3JQcm94eSIsIkl0ZXJhdG9yUHJveHkiLCJQcm9tcHRHZW5lcmF0b3IiLCJnZW5lcmF0ZVByb21wdCIsInF1ZXN0aW9ucyIsInF1ZXN0aW9uc0J5VHlwZSIsInJlZHVjZSIsImFjYyIsInEiLCJ0eXBlIiwicHVzaCIsInByb21wdCIsImdldFF1ZXN0aW9uVHlwZUluc3RydWN0aW9ucyIsInF1ZXN0aW9uc09mVHlwZSIsIk9iamVjdCIsImVudHJpZXMiLCJsZW5ndGgiLCJnZXRUeXBlVGl0bGUiLCJmb3JtYXRRdWVzdGlvbnMiLCJtYXAiLCJxdWVzdGlvblRleHQiLCJpbmRleCIsImNvbnRlbnQiLCJvcHRpb25zIiwib3B0Iiwiam9pbiIsImJsYW5rcyIsInRyaW0iLCJFdmVudEVtaXR0ZXIiLCJjb25zdHJ1Y3RvciIsImV2ZW50cyIsIk1hcCIsIm9uIiwiZXZlbnQiLCJjYWxsYmFjayIsImhhcyIsInNldCIsImdldCIsIm9mZiIsImNhbGxiYWNrcyIsImluZGV4T2YiLCJzcGxpY2UiLCJkZWxldGUiLCJlbWl0IiwiYXJncyIsImZvckVhY2giLCJlcnJvciIsIkJhc2VBUElQcm92aWRlciIsImJhc2VVUkwiLCJnZXREZWZhdWx0QmFzZVVSTCIsImNoYXQiLCJtZXNzYWdlcyIsInJlc3BvbnNlIiwiY3VzdG9tRmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiZ2V0RGVmYXVsdEhlYWRlcnMiLCJib2R5IiwibW9kZWwiLCJyb2xlIiwic3lzdGVtUHJvbXB0IiwidGVtcGVyYXR1cmUiLCJjb2RlIiwiZGF0YSIsImVycm9yTWVzc2FnZSIsIkVycm9yIiwiU3RyaW5nIiwiZW1iZWRkaW5ncyIsImlucHV0IiwiZW1iZWRkaW5nIiwiQXJyYXkiLCJpc0FycmF5IiwiZW5kcG9pbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkdNX3htbGh0dHBSZXF1ZXN0IiwidXJsIiwidW5kZWZpbmVkIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsIm9uZXJyb3IiLCJNb29uc2hvdEFQSVByb3ZpZGVyIiwiRGVlcFNlZWtBUElQcm92aWRlciIsIkNoYXRHUFRBUElQcm92aWRlciIsIkN1c3RvbU9wZW5BSUFQSVByb3ZpZGVyIiwiUXVlc3Rpb25CYW5rQVBJIiwidG9rZW4iLCJ0ZXN0Q29ubmVjdGlvbiIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInJlcyIsImZldGNoIiwidG9TdHJpbmciLCJqc29uIiwicXVlcnkiLCJ0aXRsZSIsInJhd0Fuc3dlciIsImFuc3dlciIsImlzSnVkZ2VtZW50UXVlc3Rpb24iLCJtYXRjaGVkT3B0aW9uIiwicHJvY2Vzc0p1ZGdlbWVudEFuc3dlciIsImZpbmRBbnN3ZXJPcHRpb24iLCJwcm9jZXNzZWRBbnN3ZXIiLCJwcm9jZXNzQW5zd2VyIiwib3B0aW9uVGV4dHMiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJoYXNDb3JyZWN0Iiwic29tZSIsInRleHQiLCJoYXNJbmNvcnJlY3QiLCJjbGVhbkFuc3dlciIsImlzQ29ycmVjdCIsImNvcnJlY3RGaXJzdCIsImkiLCJvcHRpb24iLCJvcHRpb25Db250ZW50IiwiaW5jbHVkZXMiLCJmcm9tQ2hhckNvZGUiLCJzcGxpdCIsInBhcnQiLCJmaWx0ZXIiLCJBUElGYWN0b3J5IiwicHJvdmlkZXIiLCJxdWVzdGlvbkJhbmsiLCJnZXRJbnN0YW5jZSIsImluc3RhbmNlIiwiZ2V0UXVlc3Rpb25CYW5rIiwicXVlc3Rpb25CYW5rVG9rZW4iLCJnZXRQcm92aWRlciIsInJlc2V0UHJvdmlkZXIiLCJBbnN3ZXJIYW5kbGVyIiwiaXNQcm9jZXNzaW5nIiwic2NhblF1ZXN0aW9ucyIsInNpbmdsZSIsIm11bHRpcGxlIiwianVkZ2VtZW50IiwiZ3JvdXBMaXN0IiwicXVlcnlTZWxlY3RvciIsImdyb3VwcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJxdWVzdGlvbkluZGV4IiwiZ3JvdXAiLCJ0aXRsZUVsIiwiZ3JvdXBUaXRsZSIsInRleHRDb250ZW50IiwicXVlc3Rpb25UeXBlIiwicXVlc3Rpb25Db3VudCIsInRvdGFsU2NvcmUiLCJ0aXRsZUluZm8iLCJtYXRjaCIsIl8iLCJ0eXBlVGV4dCIsImNvdW50Iiwic2NvcmUiLCJwYXJzZUludCIsInF1ZXN0aW9uRWxlbWVudHMiLCJxdWVzdGlvbkVsIiwidGl0bGVDb250ZW50IiwidGl0bGVUZXh0IiwiYWxsUGFyYWdyYXBocyIsImZyb20iLCJwIiwiY29kZVNwYW5zIiwic3BhbiIsImlubmVySFRNTCIsIm9wdGlvbkxpc3QiLCJvcHRpb25FbGVtZW50cyIsIm9wdGlvbkVsIiwiaXRlbSIsIm9wdENvbnRlbnQiLCJxdWVzdGlvbiIsImVsZW1lbnQiLCJmaXJzdE9wdGlvblRleHQiLCJ0ZXh0UXVlIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJvcHRzIiwibnVtYmVyU3BhbiIsImlucHV0V3JhcHBlciIsIm51bWJlciIsInN0YXJ0QXV0b0Fuc3dlciIsImFwaUZhY3RvcnkiLCJhbnN3ZXJzIiwiaXNDb25uZWN0ZWQiLCJyZXN1bHQiLCJtYXRjaGVkQ291bnQiLCJrZXlzIiwicHJvY2Vzc0FJUmVzcG9uc2UiLCJyZW1haW5pbmdRdWVzdGlvbnMiLCJjaG9pY2VzIiwiYWlBbnN3ZXIiLCJjbGVhbmVkUmVzcG9uc2UiLCJhaUFuc3dlcnMiLCJhc3NpZ24iLCJzdG9wQXV0b0Fuc3dlciIsImdldFF1ZXN0aW9ucyIsInZhbGlkQW5zd2VycyIsImN1cnJlbnRRdWVzdGlvbkluZGV4ZXMiLCJlIiwicXVlc3Rpb25OdW1iZXIiLCJpc05hTiIsImZpbmQiLCJmaXJzdE9wdGlvbkNvcnJlY3QiLCJ0YXJnZXRJbmRleCIsInRhcmdldE9wdGlvbiIsImNsaWNrIiwiYSIsImJsYW5rIiwidmFsdWUiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJidWJibGVzIiwicXVlVGl0bGUiLCJ0ZXh0YXJlYSIsInByb2Nlc3NPcHRpb25BbnN3ZXIiLCJhbnN3ZXJMZXR0ZXJzIiwidG9VcHBlckNhc2UiLCJjaGFyQXQiLCJsZXR0ZXIiLCJvcHRpb25JbmRleCIsImNoYXJDb2RlQXQiLCJDb25maWdQYW5lbCIsInBhbmVsIiwiY3JlYXRlUGFuZWwiLCJhbnN3ZXJIYW5kbGVyIiwiY3VycmVudENvbmZpZyIsImluaXRFdmVudHMiLCJzaG93Iiwic3R5bGUiLCJkaXNwbGF5IiwiZ2V0RWxlbWVudEJ5SWQiLCJ0b2dnbGVDdXN0b21VcmxJbnB1dCIsInZhbGlkYXRlQXBpS2V5IiwidXBkYXRlUXVlc3Rpb25HcmlkIiwid2luZG93Iiwic2VsZWN0T3B0aW9uIiwib3B0aW9uTGV0dGVyIiwidXBkYXRlQmxhbmtWYWx1ZSIsImJsYW5rTnVtYmVyIiwiYiIsImhpZGUiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic3R5bGVzIiwiY29uZmlnUGFuZWwiLCJwYW5lbEhlYWRlciIsImNsb3NlQnRuIiwidGFiQ29udGFpbmVyIiwidGFiIiwiYWN0aXZlIiwidGFiQ29udGVudCIsInF1ZXN0aW9uR3JpZCIsInF1ZXN0aW9uRGV0YWlsIiwiYnRuQ29udGFpbmVyIiwiYnRuIiwiYnRuUHJpbWFyeSIsImJ0bkRlZmF1bHQiLCJhcGlDb25maWciLCJmb3JtSXRlbSIsImFwaUtleUhlbHAiLCJpbnB1dEdyb3VwIiwiZ2V0VG9rZW5CdG4iLCJhcHBlbmRDaGlsZCIsImFwaVR5cGVTZWxlY3QiLCJhcGlLZXlJbnB1dCIsImN1c3RvbVVybElucHV0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImJ1dHRvbiIsInRhcmdldCIsInQiLCJyZW1vdmUiLCJjIiwiYWRkIiwidGFiSWQiLCJkYXRhc2V0IiwiY3VzdG9tVXJsIiwiYWxlcnQiLCJkaXNhYmxlZCIsImN1c3RvbU1vZGVsIiwidGVzdENvbmZpZyIsInF1ZXN0aW9uQmFua0lucHV0IiwidGltZW91dFByb21pc2UiLCJzZXRUaW1lb3V0IiwidGVzdFByb21pc2UiLCJyYWNlIiwiYnRuRGFuZ2VyIiwiY3VzdG9tVXJsSXRlbSIsImN1c3RvbU1vZGVsSXRlbSIsInNhdmVCdXR0b24iLCJ0ZXN0QnV0dG9uIiwiZ3JpZCIsImJveCIsInF1ZXN0aW9uQm94IiwiY29tcGxldGVkIiwib25jbGljayIsInNob3dRdWVzdGlvbkRldGFpbCIsImRldGFpbCIsImlzQ29ycmVjdE9wdGlvbiIsInN0YXJ0c1dpdGgiLCJpbml0IiwiY29uZmlnQnRuIiwicmVhZHlTdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FB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
