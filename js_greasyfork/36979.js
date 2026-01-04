// ==UserScript==
// @name           AdsBypasser
// @namespace      AdsBypasser
// @description    Bypass Ads
// @copyright      2012+, Wei-Cheng Pan (legnaleurc)
// @version        6.5.0
// @license        BSD
// @homepageURL    https://adsbypasser.github.io/
// @supportURL     https://github.com/adsbypasser/adsbypasser/issues
// @icon           https://raw.githubusercontent.com/adsbypasser/adsbypasser/v6.5.0/img/logo.png
// @grant          GM_deleteValue
// @grant          GM_getResourceURL
// @grant          GM_getValue
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM.deleteValue
// @grant          GM.getResourceUrl
// @grant          GM.getValue
// @grant          GM.openInTab
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @resource       alignCenter https://raw.githubusercontent.com/adsbypasser/adsbypasser/v6.5.0/css/align_center.css
// @resource       scaleImage https://raw.githubusercontent.com/adsbypasser/adsbypasser/v6.5.0/css/scale_image.css
// @resource       bgImage https://raw.githubusercontent.com/adsbypasser/adsbypasser/v6.5.0/img/imagedoc-darknoise.png
// @run-at         document-start
// @include        http://*
// @include        https://*
// @connect        *
// @downloadURL https://update.greasyfork.org/scripts/36979/AdsBypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/36979/AdsBypasser.meta.js
// ==/UserScript==

 (function(modules) { 
 	var installedModules = {};
 	function __webpack_require__(moduleId) {
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		module.l = true;
 		return module.exports;
 	}
 	__webpack_require__.m = modules;
 	__webpack_require__.c = installedModules;
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, {
 				configurable: false,
 				enumerable: true,
 				get: getter
 			});
 		}
 	};
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
 	__webpack_require__.p = "";
 	return __webpack_require__(__webpack_require__.s = 7);
 })
 ([
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return AdsBypasserError; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return every; });
 __webpack_require__.d(__webpack_exports__, "c", function() { return find; });
 __webpack_require__.d(__webpack_exports__, "d", function() { return forEach; });
 __webpack_require__.d(__webpack_exports__, "e", function() { return isString; });
 __webpack_require__.d(__webpack_exports__, "f", function() { return map; });
 __webpack_require__.d(__webpack_exports__, "g", function() { return none; });
 __webpack_require__.d(__webpack_exports__, "h", function() { return nop; });
 __webpack_require__.d(__webpack_exports__, "i", function() { return partial; });
 __webpack_require__.d(__webpack_exports__, "j", function() { return tryEvery; });
 __webpack_require__.d(__webpack_exports__, "k", function() { return wait; });
class AdsBypasserError extends Error {
  constructor (message) {
    super(message);
  }
  get name () {
    return 'AdsBypasserError';
  }
}
function forEach (collection, fn) {
  if (isArrayLike(collection)) {
    return Array.prototype.forEach.call(collection, fn);
  }
  return Object.keys(collection).forEach((k) => {
    return fn(collection[k], k, collection);
  });
}
function every (collection, fn) {
  if (isArrayLike(collection)) {
    return Array.prototype.every.call(collection, fn);
  }
  return Object.keys(collection).every((k) => {
    return fn(collection[k], k, collection);
  });
}
function map (collection, fn) {
  if (isArrayLike(collection)) {
    return Array.prototype.map.call(collection, fn);
  }
  const mapped = Object.assign({}, collection);
  Object.getOwnPropertyNames(mapped).forEach((k) => {
    mapped[k] = fn(collection[k], k, collection);
  });
  return mapped;
}
function find (collection, fn) {
  for (const [k, v] of enumerate(collection)) {
    const r = fn(v, k, collection);
    if (r !== none) {
      return [k, v, r];
    }
  }
  return [none, none, none];
}
function * enumerate (collection) {
  if (isArrayLike(collection)) {
    yield * Array.prototype.entries.call(collection);
    return;
  }
  const keys = Object.getOwnPropertyNames(collection);
  for (const k of keys) {
    yield [k, collection[k]];
  }
}
function isArrayLike (collection) {
  return Array.isArray(collection) || isNodeList(collection);
}
function isNodeList (collection) {
  return collection.constructor.name === 'NodeList';
}
function partial (fn, ...args) {
  if (typeof fn !== 'function') {
    throw new AdsBypasserError('must give a function');
  }
  return (...innerArgs) => {
    return fn(...args.concat(innerArgs));
  };
}
function isString (value) {
  return (typeof value === 'string') || (value instanceof String);
}
function nop () {
}
const none = nop;
function wait (msDelay) {
  return new Promise((resolve) => {
    setTimeout(resolve, msDelay);
  });
}
function tryEvery (msInterval, fn) {
  return new Promise((resolve) => {
    const handle = setInterval(function () {
      const result = fn();
      if (result !== none) {
        clearInterval(handle);
        resolve(result);
      }
    }, msInterval);
  });
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "b", function() { return rawUSW; });
 __webpack_require__.d(__webpack_exports__, "c", function() { return usw; });
 __webpack_require__.d(__webpack_exports__, "a", function() { return GMAPI; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
const rawUSW = getUnsafeWindow();
const usw = getUnsafeWindowProxy();
const GMAPI = getGreaseMonkeyAPI();
function getUnsafeWindow () {
  let w = null;
  try {
    w = unsafeWindow;
  } catch (e) {
    try {
      w = (0, eval)('this').global;
    } catch (e) {
    }
  }
  return w ? w : (0, eval)('this').window;
}
function getGreaseMonkeyAPI () {
  if (rawUSW.global) {
    return null;
  }
  const gm = {};
  if (typeof GM_openInTab === 'function') {
    gm.openInTab = GM_openInTab;
  } else {
    gm.openInTab = GM.openInTab;
  }
  if (typeof GM_getValue === 'function') {
    gm.getValue = (name, default_) => {
      return Promise.resolve(GM_getValue(name, default_));
    };
  } else {
    gm.getValue = GM.getValue;
  }
  if (typeof GM_setValue === 'function') {
    gm.setValue = (name, value) => {
      return Promise.resolve(GM_setValue(name, value));
    };
  } else {
    gm.setValue = GM.setValue;
  }
  if (typeof GM_deleteValue === 'function') {
    gm.deleteValue = (name) => {
      return Promise.resolve(GM_deleteValue(name));
    };
  } else {
    gm.deleteValue = GM.deleteValue;
  }
  if (typeof GM_xmlhttpRequest === 'function') {
    gm.xmlHttpRequest = GM_xmlhttpRequest;
  } else {
    gm.xmlHttpRequest = GM.xmlHttpRequest;
  }
  if (typeof GM_registerMenuCommand === 'function') {
    gm.registerMenuCommand = GM_registerMenuCommand;
  } else {
    gm.registerMenuCommand = __WEBPACK_IMPORTED_MODULE_0_util_core__["h" ];
  }
  if (typeof GM_getResourceURL === 'function') {
    gm.getResourceUrl = (resourceName) => {
      return Promise.resolve(GM_getResourceURL(resourceName));
    };
  } else if (typeof GM === 'object' && GM && GM.getResourceUrl) {
    gm.getResourceUrl = GM.getResourceUrl;
  }
  return gm;
}
const MAGIC_KEY = '__adsbypasser_reverse_proxy__';
function getUnsafeWindowProxy () {
  const isFirefox = typeof InstallTrigger !== 'undefined';
  const isWebExtension = typeof cloneInto === 'undefined' || typeof exportFunction === 'undefined';
  if (!isFirefox || isWebExtension) {
    return rawUSW;
  }
  const decorator = {
    set (target, key, value) {
      if (key === MAGIC_KEY) {
        return false;
      }
      if (target === unsafeWindow && key === 'open') {
        const d = Object.getOwnPropertyDescriptor(target, key);
        d.value = clone(function () {
          const rv = value();
          return cloneInto(rv, unsafeWindow);
        });
        Object.defineProperty(target, key, d);
      } else {
        target[key] = clone(value);
      }
      return true;
    },
    get (target, key) {
      if (key === MAGIC_KEY) {
        return target;
      }
      const value = target[key];
      const type = typeof value;
      if (value === null || (type !== 'function' && type !== 'object')) {
        return value;
      }
      return new Proxy(value, decorator);
    },
    apply (target, self, args) {
      args = Array.prototype.slice.call(args);
      if (target === unsafeWindow.Object.defineProperty) {
        args[0] = args[0][MAGIC_KEY];
      }
      if (target === unsafeWindow.Function.apply) {
        self = self[MAGIC_KEY];
        args[1] = Array.prototype.slice.call(args[1]);
      }
      if (target === unsafeWindow.document.querySelector) {
        self = self[MAGIC_KEY];
      }
      if (target === unsafeWindow.document.write) {
        self = self[MAGIC_KEY];
      }
      const usargs = clone(args);
      return target.apply(self, usargs);
    },
    construct (target, args) {
      args = Array.prototype.slice.call(args);
      args.unshift(undefined);
      const usargs = clone(args);
      const bind = unsafeWindow.Function.prototype.bind;
      return new (bind.apply(target, usargs));
    },
  };
  return new Proxy(unsafeWindow, decorator);
}
function clone (safe) {
  if (safe === null || !(safe instanceof Object)) {
    return safe;
  }
  if (safe === unsafeWindow) {
    return safe;
  }
  if (safe instanceof String) {
    return safe.toString();
  }
  if (safe instanceof Function) {
    return exportFunction(safe, unsafeWindow, {
      allowCrossOriginArguments: true,
    });
  }
  if (safe instanceof Array) {
    const unsafe = new unsafeWindow.Array();
    for (let i = 0; i < safe.length; ++i) {
      unsafe.push(clone(safe[i]));
    }
    return unsafe;
  }
  const unsafe = new unsafeWindow.Object();
  Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["d" ])(safe, (v, k) => {
    unsafe[k] = clone(v);
  });
  return unsafe;
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return info; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return warn; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
const quiet = false;
function log (method, args) {
  if (quiet) {
    return;
  }
  args = Array.prototype.slice.call(args);
  if (Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["e" ])(args[0])) {
    args[0] = 'AdsBypasser: ' + args[0];
  } else {
    args.unshift('AdsBypasser:');
  }
  const f = console[method];
  if (typeof f === 'function') {
    f.apply(console, args);
  }
}
function info () {
  log('info', arguments);
}
function warn () {
  log('warn', arguments);
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "b", function() { return register; });
 __webpack_require__.d(__webpack_exports__, "a", function() { return findHandler; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
const patterns = [];
function register (pattern) {
  patterns.push(pattern);
}
function dispatchByObject (rule, url_6) {
  const matched = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["f" ])(rule, (pattern, part) => {
    if (pattern instanceof RegExp) {
      return url_6[part].match(pattern);
    }
    if (Array.isArray(pattern)) {
      const [, , r] = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["c" ])(pattern, (sp) => {
        const m = url_6[part].match(sp);
        return m || __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ];
      });
      return r !== __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ] ? r : null;
    }
    throw new __WEBPACK_IMPORTED_MODULE_0_util_core__["a" ]('invalid rule');
  });
  const passed = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["b" ])(matched, (v) => {
    return !!v;
  });
  return passed ? matched : null;
}
function dispatchByRegExp (rule, url_1) {
  return url_1.match(rule);
}
function dispatchByArray (rules, url_1, url_3, url_6) {
  const [, , r] = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["c" ])(rules, (rule) => {
    const m = dispatch(rule, url_1, url_3, url_6);
    return m ? m : __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ];
  });
  return r !== __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ] ? r : null;
}
function dispatchByString (rule, url_3) {
  let scheme = /\*|https?|file|ftp|chrome-extension/;
  let host = /\*|(\*\.)?([^/*]+)/;
  let path = /\/.*/;
  let tmp = `^(${scheme.source})://(${host.source})?(${path.source})$`;
  let up = new RegExp(tmp);
  const matched = rule.match(up);
  if (!matched) {
    return null;
  }
  scheme = matched[1];
  host = matched[2];
  const wc = matched[3];
  const sd = matched[4];
  path = matched[5];
  if (scheme === '*' && !/https?/.test(url_3.scheme)) {
    return null;
  }
  if (scheme !== url_3.scheme) {
    return null;
  }
  if (scheme !== 'file' && host !== '*') {
    if (wc) {
      up = url_3.host.indexOf(sd);
      if (up < 0 || up + sd.length !== url_3.host.length) {
        return null;
      }
    } else if (host !== url_3.host) {
      return null;
    }
  }
  tmp = path.replace(/[*.[\]?+#]/g, (c) => {
    if (c === '*') {
      return '.*';
    }
    return '\\' + c;
  });
  path = new RegExp(`^${tmp}$`);
  if (!path.test(url_3.path)) {
    return null;
  }
  return url_3;
}
function dispatchByFunction (rule, url_1, url_3, url_6) {
  return rule(url_1, url_3, url_6);
}
function dispatch (rule, url_1, url_3, url_6) {
  if (Array.isArray(rule)) {
    return dispatchByArray(rule, url_1, url_3, url_6);
  }
  if (typeof rule === 'function') {
    return dispatchByFunction(rule, url_1, url_3, url_6);
  }
  if (rule instanceof RegExp) {
    return dispatchByRegExp(rule, url_1);
  }
  if (Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["e" ])(rule)) {
    return dispatchByString(rule, url_3);
  }
  return dispatchByObject(rule, url_6);
}
function findHandler () {
  const url_1 = window.location.toString();
  const url_3 = {
    scheme: window.location.protocol.slice(0, -1),
    host: window.location.host,
    path: window.location.pathname + window.location.search + window.location.hash,
  };
  const url_6 = {
    scheme: window.location.protocol,
    host: window.location.hostname,
    port: window.location.port,
    path: window.location.pathname,
    query: window.location.search,
    hash: window.location.hash,
  };
  const [i, pattern, matched] = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["c" ])(patterns, (pattern) => {
    const m = dispatch(pattern.rule, url_1, url_3, url_6);
    return m ? m : __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ];
  });
  if (i === __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ]) {
    return null;
  }
  if (!pattern.start && !pattern.ready) {
    return null;
  }
  return {
    start: pattern.start ? Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["i" ])(pattern.start, matched) : __WEBPACK_IMPORTED_MODULE_0_util_core__["h" ],
    ready: pattern.ready ? Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["i" ])(pattern.ready, matched) : __WEBPACK_IMPORTED_MODULE_0_util_core__["h" ],
  };
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return block; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return querySelector; });
 __webpack_require__.d(__webpack_exports__, "c", function() { return querySelectorAll; });
 __webpack_require__.d(__webpack_exports__, "d", function() { return querySelectorOrNull; });
 __webpack_require__.d(__webpack_exports__, "e", function() { return remove; });
 __webpack_require__.d(__webpack_exports__, "f", function() { return searchFromScripts; });
 __webpack_require__.d(__webpack_exports__, "g", function() { return toDOM; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
class DomNotFoundError extends __WEBPACK_IMPORTED_MODULE_0_util_core__["a" ] {
  constructor (selector) {
    super(`\`${selector}\` not found`);
  }
  get name () {
    return 'DomNotFoundError';
  }
}
function querySelector (selector, context) {
  if (!context || !context.querySelector) {
    context = document;
  }
  const n = context.querySelector(selector);
  if (!n) {
    throw new DomNotFoundError(selector);
  }
  return n;
}
function querySelectorOrNull (selector, context) {
  try {
    return querySelector(selector, context);
  } catch (e) {
    return null;
  }
}
function querySelectorAll (selector, context) {
  if (!context || !context.querySelectorAll) {
    context = document;
  }
  const ns = context.querySelectorAll(selector);
  return ns;
}
function toDOM (rawHTML) {
  try {
    const parser = new DOMParser();
    const DOMHTML = parser.parseFromString(rawHTML, 'text/html');
    return DOMHTML;
  } catch (e) {
    throw new __WEBPACK_IMPORTED_MODULE_0_util_core__["a" ]('could not parse HTML to DOM');
  }
}
function remove (selector, context) {
  const nodes = querySelectorAll(selector, context);
  Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["d" ])(nodes, (e) => {
    e.parentNode.removeChild(e);
  });
}
function block (selector, context=null) {
  if (!context) {
    context = document;
  }
  let fn = null;
  if (Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["e" ])(selector)) {
    fn = () => {
      remove(selector, context);
    };
  } else if (typeof selector === 'function') {
    fn = (mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (selector(node)) {
          node.parentNode.removeChild(node);
        }
      });
    };
  } else {
    throw new TypeError('wrong selector');
  }
  const o = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      fn(mutation);
    });
  });
  o.observe(context, {
    childList: true,
    subtree: true,
  });
}
function searchFromScriptsByRegExp (pattern, context) {
  const scripts = querySelectorAll('script', context);
  const [, , m] = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["c" ])(scripts, (s) => {
    const m = s.textContent.match(pattern);
    if (!m) {
      return __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ];
    }
    return m;
  });
  if (m === __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ]) {
    return null;
  }
  return m;
}
function searchFromScriptsByString (pattern, context) {
  const scripts = querySelectorAll('script', context);
  const [, m,] = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["c" ])(scripts, (s) => {
    const m = s.textContent.indexOf(pattern);
    if (m < 0) {
      return __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ];
    }
    return m;
  });
  if (m === __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ]) {
    return null;
  }
  return m.textContent;
}
function searchFromScripts (pattern, context) {
  if (pattern instanceof RegExp) {
    return searchFromScriptsByRegExp(pattern, context);
  } else if (Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["e" ])(pattern)) {
    return searchFromScriptsByString(pattern, context);
  } else {
    return null;
  }
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return openLink; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
 var __WEBPACK_IMPORTED_MODULE_1_util_logger__ = __webpack_require__(2);
function prepare (e) {
  if (!document.body) {
    document.body = document.createElement('body');
  }
  document.body.appendChild(e);
  return Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["k" ])(0);
}
async function get (url) {
  const a = document.createElement('a');
  a.href = url;
  let clicked = false;
  a.addEventListener('click', (event) => {
    event.stopPropagation();
    clicked = true;
  });
  await prepare(a);
  a.click();
  const tick = setInterval(() => {
    if (clicked) {
      Object(__WEBPACK_IMPORTED_MODULE_1_util_logger__["a" ])('already clicked');
      clearInterval(tick);
      return;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1_util_logger__["a" ])('try again');
    a.click();
  }, 50);
}
async function post (path, params) {
  params = params || {};
  const form = document.createElement('form');
  form.method = 'post';
  form.action = path;
  Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["d" ])(params, (value, key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  await prepare(form);
  form.submit();
}
async function openLink (to, options) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["e" ])(to) && !to) {
    Object(__WEBPACK_IMPORTED_MODULE_1_util_logger__["b" ])('false URL');
    return;
  }
  options = options || {};
  const withReferer = typeof options.referer === 'undefined' ? true : options.referer;
  const postData = options.post;
  const from = window.location.toString();
  Object(__WEBPACK_IMPORTED_MODULE_1_util_logger__["a" ])(`${from} -> ${to}`);
  if (postData) {
    await post(to, postData);
    return;
  }
  if (withReferer) {
    await get(to);
    return;
  }
  window.top.location.replace(to);
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "c", function() { return removeAllTimer; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return nuke; });
 __webpack_require__.d(__webpack_exports__, "a", function() { return generateRandomIP; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
 var __WEBPACK_IMPORTED_MODULE_1_util_platform__ = __webpack_require__(1);
 var __WEBPACK_IMPORTED_MODULE_2_util_logger__ = __webpack_require__(2);
function removeAllTimer () {
  let handle = window.setInterval(__WEBPACK_IMPORTED_MODULE_0_util_core__["h" ], 10);
  while (handle > 0) {
    window.clearInterval(handle--);
  }
  handle = window.setTimeout(__WEBPACK_IMPORTED_MODULE_0_util_core__["h" ], 10);
  while (handle > 0) {
    window.clearTimeout(handle--);
  }
}
function nuke (url) {
  try {
    __WEBPACK_IMPORTED_MODULE_1_util_platform__["c" ].document.write('nuked by AdsBypasser, leading to ...<br/>');
  } catch (e) {
    Object(__WEBPACK_IMPORTED_MODULE_2_util_logger__["b" ])('nuke failed', e);
  }
  const a = document.createElement('a');
  a.href = url;
  a.textContent = url;
  document.body.appendChild(a);
}
function generateRandomIP () {
  return [0, 0, 0, 0].map(() => {
    return Math.floor(Math.random() * 256);
  }).join('.');
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
 var __WEBPACK_IMPORTED_MODULE_1_util_dispatcher__ = __webpack_require__(3);
 var __WEBPACK_IMPORTED_MODULE_2_util_platform__ = __webpack_require__(1);
 var __WEBPACK_IMPORTED_MODULE_3_util_config__ = __webpack_require__(8);
 var __WEBPACK_IMPORTED_MODULE_4_util_logger__ = __webpack_require__(2);
 var __WEBPACK_IMPORTED_MODULE_5__ADSBYPASSER_HANDLERS___ = __webpack_require__(9);
const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
function disableWindowOpen () {
  __WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].open = function () {
    return {
      closed: false,
    };
  };
  __WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].alert = __WEBPACK_IMPORTED_MODULE_0_util_core__["h" ];
  __WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].confirm = __WEBPACK_IMPORTED_MODULE_0_util_core__["h" ];
}
function disableLeavePrompt (element) {
  if (!element) {
    return;
  }
  const seal = {
    set: function () {
      Object(__WEBPACK_IMPORTED_MODULE_4_util_logger__["a" ])('blocked onbeforeunload');
    },
  };
  element.onbeforeunload = undefined;
  if (isSafari) {
    element.__defineSetter__('onbeforeunload', seal.set);
  } else {
    __WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].Object.defineProperty(element, 'onbeforeunload', {
      configurable: true,
      enumerable: false,
      get: undefined,
      set: seal.set,
    });
  }
  const oael = element.addEventListener;
  const nael = function (type) {
    if (type === 'beforeunload') {
      Object(__WEBPACK_IMPORTED_MODULE_4_util_logger__["a" ])('blocked addEventListener onbeforeunload');
      return;
    }
    return oael.apply(this, arguments);
  };
  element.addEventListener = nael;
}
function changeTitle () {
  document.title += ' - AdsBypasser';
}
async function beforeDOMReady (handler) {
  const config = await Object(__WEBPACK_IMPORTED_MODULE_3_util_config__["a" ])();
  Object(__WEBPACK_IMPORTED_MODULE_4_util_logger__["a" ])('working on\n%s \nwith\n%s', window.location.toString(), JSON.stringify(config));
  disableLeavePrompt(__WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ]);
  disableWindowOpen();
  await handler.start();
}
async function afterDOMReady (handler) {
  disableLeavePrompt(__WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].document.body);
  changeTitle();
  await handler.ready();
}
function waitDOM () {
  return new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      resolve();
      return;
    }
    document.addEventListener('DOMContentLoaded', () => {
      resolve();
    });
  });
}
async function main () {
  if (__WEBPACK_IMPORTED_MODULE_2_util_platform__["b" ].top !== __WEBPACK_IMPORTED_MODULE_2_util_platform__["b" ].self) {
    return;
  }
  __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].registerMenuCommand('AdsBypasser - Configure', () => {
    __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].openInTab('https://adsbypasser.github.io/configure.html');
  });
  await Object(__WEBPACK_IMPORTED_MODULE_3_util_config__["b" ])();
  const handler = Object(__WEBPACK_IMPORTED_MODULE_1_util_dispatcher__["a" ])();
  if (handler) {
    await beforeDOMReady(handler);
    await waitDOM();
    await afterDOMReady(handler);
    return;
  }
}
main().catch((e) => {
  Object(__WEBPACK_IMPORTED_MODULE_4_util_logger__["b" ])(e);
});
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return dumpConfig; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return loadConfig; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
 var __WEBPACK_IMPORTED_MODULE_1_util_dispatcher__ = __webpack_require__(3);
 var __WEBPACK_IMPORTED_MODULE_2_util_platform__ = __webpack_require__(1);
const MANIFEST = [
  {
    key: 'version',
    default_: 0,
    verify (v) {
      return typeof v === 'number' && v >= 0;
    },
    normalize: toNumber,
  },
  {
    key: 'align_center',
    default_: true,
    verify: isBoolean,
    normalize: toBoolean,
  },
  {
    key: 'change_background',
    default_: true,
    verify: isBoolean,
    normalize: toBoolean,
  },
  {
    key: 'redirect_image',
    default_: true,
    verify: isBoolean,
    normalize: toBoolean,
  },
  {
    key: 'scale_image',
    default_: true,
    verify: isBoolean,
    normalize: toBoolean,
  },
  {
    key: 'log_level',
    default_: 1,
    verify (v) {
      return typeof v === 'number' && v >= 0 && v <= 2;
    },
    normalize: toNumber,
  },
];
const PATCHES = [
  async () => {
    const alignCenter = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('align_center');
    const changeBackground = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('change_background');
    const scaleImage = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('scale_image');
    const redirectImage = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('redirect_image');
    const ac = typeof alignCenter === 'boolean';
    if (typeof changeBackground !== 'boolean') {
      await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('change_background', ac ? alignCenter : true);
    }
    if (typeof scaleImage !== 'boolean') {
      await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('scale_image', ac ? alignCenter : true);
    }
    if (!ac) {
      await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('align_center', true);
    }
    if (typeof redirectImage !== 'boolean') {
      await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('redirect_image', true);
    }
  },
  async () => {
    const externalServerSupport = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('external_server_support');
    if (typeof externalServerSupport !== 'boolean') {
      await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('external_server_support', false);
    }
  },
  async () => {
    const logLevel = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('log_level');
    if (typeof logLevel !== 'number') {
      await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('log_level', 1);
    }
  },
  async () => {
    await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].deleteValue('external_server_support');
  },
];
function isBoolean (v) {
  return typeof v === 'boolean';
}
function toBoolean (v) {
  return !!v;
}
function toNumber (v) {
  return parseInt(v, 10);
}
async function senityCheck () {
  let verifyResults = MANIFEST.map(async (descriptor) => {
    const rv = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue(descriptor.key);
    return descriptor.verify(rv);
  });
  verifyResults = await Promise.all(verifyResults);
  const ok = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["b" ])(verifyResults, v => v);
  if (!ok) {
    await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('version', 0);
  }
}
async function migrate () {
  let currentVersion = await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('version');
  if (currentVersion !== 0 && !currentVersion) {
    throw new __WEBPACK_IMPORTED_MODULE_0_util_core__["a" ]('invalid version');
  }
  while (currentVersion < PATCHES.length) {
    PATCHES[currentVersion]();
    ++currentVersion;
  }
  await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue('version', currentVersion);
}
async function loadConfig () {
  await senityCheck();
  await migrate();
  Object(__WEBPACK_IMPORTED_MODULE_1_util_dispatcher__["b" ])({
    rule: {
      host: /^adsbypasser\.github\.io$/,
      path: /^\/configure\.html$/,
    },
    async ready () {
      await waitForPage();
      __WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].commit = async (data) => {
        for (const [k, v] of Object.entries(data)) {
          await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].setValue(k, v);
        }
      };
      __WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].render({
        version: await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('version'),
        options: {
          align_center: {
            type: 'checkbox',
            value: await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('align_center'),
            label: 'Align Center',
            help: 'Align image to the center if possible. (default: enabled)',
          },
          change_background: {
            type: 'checkbox',
            value: await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('change_background'),
            label: 'Change Background',
            help: 'Use Firefox-like image background if possible. (default: enabled)',
          },
          redirect_image: {
            type: 'checkbox',
            value: await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('redirect_image'),
            label: 'Redirect Image',
            help: [
              'Directly open image link if possible. (default: enabled)',
              'If disabled, redirection will only works on link shortener sites.',
            ].join('<br/>\n'),
          },
          scale_image: {
            type: 'checkbox',
            value: await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('scale_image'),
            label: 'Scale Image',
            help: 'When image loaded, scale it to fit window if possible. (default: enabled)',
          },
          log_level: {
            type: 'select',
            value: await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue('log_level'),
            menu: [
              [0, '0 (quiet)'],
              [1, '1 (default)'],
              [2, '2 (verbose)'],
            ],
            label: 'Log Level',
            help: [
              'Log level in developer console. (default: 1)',
              '0 will not print anything in console.',
              '1 will only print logs on affected sites.',
              '2 will print on any sites.',
            ].join('<br/>\n'),
          },
        },
      });
    },
  });
}
function waitForPage () {
  return new Promise((resolve) => {
    const i = setInterval(() => {
      if (__WEBPACK_IMPORTED_MODULE_2_util_platform__["c" ].render) {
        clearInterval(i);
        resolve();
      }
    }, 50);
  });
}
async function dumpConfig () {
  let rv = MANIFEST.map(async (descriptor) => {
    return [descriptor.key, await __WEBPACK_IMPORTED_MODULE_2_util_platform__["a" ].getValue(descriptor.key)];
  });
  rv = await Promise.all(rv);
  const o = {};
  for (const [k, v] of rv) {
    o[k] = v;
  }
  return o;
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 var __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___ = __webpack_require__(10);
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^akoam\.com$/,
    path: /^\/download\//,
  },
  async start () {
    const locationLink = location.hash;
    let data = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(locationLink);
    try {
      data = JSON.parse(data);
    } catch (e) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('JSON error:', e);
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(data.direct_link);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.anafile\.com$/,
  },
  async ready () {
    let b = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#btn_download');
    if (!b) {
      b = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#plans_free form [type=submit]');
      b.click();
      return;
    }
    b.disabled = false;
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('div[align=center]');
    return;
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?arab\.sh$/,
    path: /^\/\w+$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form[name=F1]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(20 * 1000);
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?coolrom\.com$/,
    path: /^\/dlpop\.php$/,
  },
  async ready () {
    const matches = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/<form method="POST" action="([^"]+)">/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(matches[1]);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^(www\.)?dl-protect\.com$/,
      path: /\/[A-Z0-9]+/,
    },
    async ready () {
      if (__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#captcha')) {
        return;
      }
      const f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('form[name=ccerure]');
      if (f) {
        const iIn = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[id=in]');
        if (iIn.value) {
          await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(600);
          f.submit();
        } else {
          const [, , p] = await waitDOM(iIn, {
            attributes: true,
          }, (mutation) => {
            if (!mutation.target.value || mutation.attributeName !== 'value') {
              return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none;
            }
            iIn.value = 'Tracking too much hurts users\' privacy';
            if (!canFastRedirect()) {
              return;
            }
            return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(600);
          });
          if (p) {
            await p;
            f.submit();
          }
        }
        return;
      }
      const l = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('#slinks > a');
      if (l.length === 1) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l[0].href);
      }
    },
  });
  function canFastRedirect () {
    return !__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('form[name=ccerure]').onsubmit && !__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('form[name=ccerure] input[name=pwd]');
  }
  function waitDOM (element, config, fn) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        const [k, v, r] = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].find(mutations, fn);
        if (k !== __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none) {
          observer.disconnect();
          resolve([k, v, r]);
          return;
        }
      });
      observer.observe(element, config);
    });
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?embedupload\.com$/,
    path: /^\/$/,
    query: /^\?\w{2}=\w+$/
  },
  async ready () {
    const downloadPage = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.categories a[target=_blank]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(downloadPage);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.fileproject\.com\.br$/,
    path: /^\/files\/+/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/<a id="down" href="([^"]+)">/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?(firedrive|putlocker)\.com$/,
    path: /^\/file\/[0-9A-F]+$/,
  },
  async ready () {
    const c = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#confirm_form');
    c.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^iori\.us$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#wrapper .tombol a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?jheberg\.net$/,
    path: /^\/captcha\//,
  },
  async ready () {
    Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.dl-button').click();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?jheberg\.net$/,
    path: /^\/redirect\//,
  },
  async ready () {
    'use strict';
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].removeAllTimer();
    const matches = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/'slug':\s*'([^']+)',\s*'hoster':\s*'([^']+)'/);
    const slug = matches[1];
    const hoster = matches[2];
    const response = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/get/link/', {
      slug,
      hoster,
    });
    const respJSON = JSON.parse(response);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(respJSON.url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?larashare\.com$/,
    path: /^\/do\.php$/,
    query: /id=\d+/,
  },
  async start () {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(document.location.href.replace('id=','down='));
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?maxmirror\.com$/,
    path: /^\/redirect\//,
  },
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#download_url > a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?mirrorcreator\.com$/,
    path: /^\/downlink\.php$/,
  },
  async ready () {
    let a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#redirectlink a');
    if (a) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
      return;
    }
    a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#redirectlink > div.redirecturl');
    a = a.innerHTML;
    if (!a.match(/^http/)) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('not a valid URL');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.multiupfile\.com$/,
    path: /^\/f\//,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#yw0');
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^mylinkgen\.com$/,
    path: /^\/p\/(.+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/g/' + m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^mylinkgen\.com$/,
    path: /^\/g\//,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#main-content a.btn.btn-default');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^openload\.co$/,
      /^oload\.(stream|info|tv)$/,
    ],
    path: /^\/f\/.*/,
  },
  async start () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.adblock = false;
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.adblock2 = false;
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.popAdsLoaded = true;
  },
  async ready () {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(500);
    const timer = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#downloadTimer');
    timer.style.display = 'none';
    const dlCtn = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#realdl');
    dlCtn.style.display = 'inline-block';
    const dlBtn = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a', dlCtn);
    const ePath = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#streamurl');
    dlBtn.href = '/stream/' + ePath.textContent;
    const videoCtn = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('.videocontainer');
    if (videoCtn) {
      const overlay = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#videooverlay', videoCtn);
      overlay.click();
      dlBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        const iframe = document.createElement('iframe');
        iframe.src = dlBtn.href;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      });
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info(`${window.location} -> ${dlBtn.href}`);
      dlBtn.click();
    } else {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(dlBtn.href);
    }
  }
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?upmirror\.info$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].setCookie('user', 'ppp');
    if (__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#countDownText')) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(document.location.toString());
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?vidto\.me$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#btn_download').form;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(6 * 1000);
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^01\.nl$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe#redirectframe');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^10co\.(biz|xyz|co|me)$/,
  },
  async ready () {
    const d = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.go');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(d.dataset.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?1be\.biz$/,
    path: /^\/s\.php$/,
    query: /^\?(.+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?1tiny\.net$/,
    path: /\/\w+/,
  },
  async ready () {
    const directUrl = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/window\.location='([^']+)';/);
    if (!directUrl) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script content changed');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(directUrl[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^2ty\.cc$/,
    path: /^\/.+/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#close');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?3ra\.be$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.fc;
    if (!f) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('window.fc is undefined');
    }
    f = f.toString();
    f = f.match(/href="([^"]*)/);
    if (!f) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('url pattern outdated');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?4fun\.tw$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#original_url');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.value);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ad2links\.com$/,
    path: /^\/\w-.+$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(window.location.toString(), {
      post: {
        image: 'Skip Ad.',
      },
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ad4\.fr$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/"src", "([^"]+)"/);
    if (!s) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('changed');
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s[1]);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^ad7\.biz$/,
      path: /^\/\d+\/(.*)$/,
    },
    async start (m) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      let redirectLink = m.path[1];
      if (!redirectLink.match(/^https?:\/\//)) {
        redirectLink = 'http://' + redirectLink;
      }
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(redirectLink);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^ad7\.biz$/,
      path: /^\/\w+$/,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const script = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('const r_url');
      let url = script.match(/&url=([^&]+)/);
      url = url[1];
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
})();
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^(www\.)?adb\.ug$/,
        /^(www\.)?lynk\.my$/,
        /^adyou\.me$/,
      ],
      path: /^(?!\/(?:privacy|terms|contact(\/.*)?|#.*)?$).*$/,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/top\.location\.href="([^"]+)"/);
      if (m) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
        return;
      }
      const args = await getArguments();
      tryLink(args);
    },
  });
  function getArguments () {
    const PATTERN = /\{\s*_args[^}]+\}[^}]+\}/;
    return new Promise((resolve) => {
      const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(PATTERN);
      if (m) {
        resolve(m);
        return;
      }
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.localName === 'script') {
              const m = node.textContent.match(PATTERN);
              if (m) {
                observer.disconnect();
                resolve(m);
              }
            }
          });
        });
      });
      observer.observe(document.body, {
        childList: true,
      });
    }).then((m) => {
      return eval('(' + m[0] + ')');
    });
  }
  function tryLink (args) {
    const url = window.location.pathname + '/skip_timer';
    const i = setInterval(() => {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(url, args).then((text) => {
        const jj = JSON.parse(text);
        if (!jj.errors && jj.messages) {
          clearInterval(i);
          __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(jj.messages.url);
        }
      });
    }, 1000);
  }
})();
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^adf\.ly$/,
      path: /^\/redirecting\/(.+)$/,
    },
    async start (m) {
      const url = atob(m.path[1]);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      path: /\/locked$/,
      query: /url=([^&]+)/,
    },
    async start (m) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].resetCookies();
      const url = decodeURIComponent(m.query[1]);
      if (url.match(/^http/)) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
      } else {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/' + url);
      }
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule () {
      const h = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('html[id="main_html"]');
      if (h) {
        return true;
      } else {
        return null;
      }
    },
    async start () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.document.write = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].nop;
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.btoa = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].nop;
      await waitDocumentHead();
      const token = await waitToken();
      const url = decodeToken(token);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
    async ready () {
      const h = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#main_html'), b = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#home');
      if (!h || !b || h.nodeName !== 'HTML' || b.nodeName !== 'BODY') {
        return;
      }
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.cookieCheck = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].nop;
      let token = getTokenFromRocketScript();
      if (!token) {
        token = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#adfly_bar');
        __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.close_bar();
        return;
      }
      token = decodeToken(token);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(token);
    },
  });
  function waitToken () {
    return new Promise((resolve) => {
      const o = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].forEach(mutation.addedNodes, (node) => {
            if (node.localName === 'script') {
              const m = node.textContent.match(/var ysmm = '([^']+)'/);
              if (m) {
                o.disconnect();
                resolve(m[1]);
              }
            }
          });
        });
      });
      o.observe(document.head, {
        childList: true,
      });
    });
  }
  function waitDocumentHead () {
    return new Promise((resolve) => {
      if (document.head) {
        resolve();
        return;
      }
      const o = new MutationObserver(() => {
        if (document.head) {
          o.disconnect();
          resolve();
        }
      });
      o.observe(document.documentElement, {
        childList: true,
      });
    });
  }
  function decodeToken (token) {
    let a = '';
    let b = '';
    for (let i = 0; i < token.length; ++i) {
      if (i % 2 === 0) {
        a = a + token.charAt(i);
      } else {
        b = token.charAt(i) + b;
      }
    }
    token = a + b;
    a = token.split('');
    for (let i = 0; i < a.length; ++i) {
      if (/\d/.test(a[i])) {
        for (let j = i + 1; j < a.length; ++j) {
          if (/\d/.test(a[j])) {
            b = a[i] ^ a[j];
            if (b < 10) {
              a[i] = b;
            }
            i = j;
            j = a.length;
          }
        }
      }
    }
    token = a.join('');
    token = atob(token);
    token = token.substring(16);
    token = token.substring(0, token.length - 16);
    if (location.hash) {
      token += location.hash;
    }
    return token;
  }
  function getTokenFromRocketScript () {
    const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/const eu = '(?!false)(.*)'/);
    return a ? a[1] : null;
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?adfe\.es$/,
    path: /^\/\w+$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#frmvideo');
    if (!f.STEP4) {
      return;
    }
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://adfoc.us/*',
  async ready () {
    const promise = new Promise((resolve) => {
      const root = document.body;
      const observer = new MutationObserver(() => {
        let o = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#showSkip');
        if (o) {
          observer.disconnect();
          o = o.querySelector('a');
          resolve(o.href);
        }
      });
      observer.observe(root, {
        childList: true,
        subtree: true,
      });
    });
    const url = await promise;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?adjet\.biz$/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/href=(\S+)/);
    if (!m) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('site changed');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^adlock\.org$/,
  },
  async ready () {
    let a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#xre a.xxr, #downloadButton1');
    if (a) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
      return;
    }
    a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.fileLocation;
    if (a) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a);
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?adlot\.us$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const script = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('form');
    const p = /name='([^']+)' value='([^']+)'/g;
    const opt = {
      image: ' ',
    };
    let tmp = null;
    while ((tmp = p.exec(script))) {
      opt[tmp[1]] = tmp[2];
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('', {
      path: opt,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^admy\.link$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form.edit_link');
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?ah-informatique\.com$/,
    path: /^\/ZipUrl/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#zip3 a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^ah\.pe$/,
    },
    async ready () {
      let script = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('eval');
      script = decodeScript(script);
      script = decodeScript(script);
      script = decodeScript(script);
      let path = script.match(/([^;= ]+)=([^+ ;]+)\+"\."\+([^+ ]+)\+"\."\+([^; ]+);/);
      if (!path) {
        throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
      }
      if (typeof __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window[path[2]] === 'undefined') {
        __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('recaptcha');
        return;
      }
      path = [__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window[path[2]], __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window[path[3]], __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window[path[4]]].join('.');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(path);
    },
  });
  function decodeScript (encoded) {
    let a = encoded.match(/^\s*;eval\((.+)\);\s*$/);
    a = a[1];
    const b = a.match(/^(.+)\('([^']+)','([^']+)','([^']+)','([^']+)'\)$/);
    const c = eval('(' + b[1] + ')');
    return c(b[2], b[3], b[4], b[5]);
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^aka\.gr$/
  },
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe#yourls-frame');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^al\.ly$/,
      /^ally\.sh$/,
    ],
  },
  async ready () {
    let i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#html_element');
    if (i) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('#messa');
      i.classList.remove('hidden');
      return;
    }
    i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/"href","([^"]+)" \+ hash\)\.remove/);
    if (!i) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('site changed');
      return;
    }
    i = i[1] + location.hash;
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^(www\.)?allkeyshop\.com$/,
      /^cshort\.org$/,
    ],
  },
  async ready () {
    let matches = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/window\.location\.href = "([^"]+)"/);
    matches = matches[1];
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].nuke(matches);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(matches);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^anonymbucks\.com$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#boton-continuar');
    a.click();
  },
});
(function () {
  const ajaxPattern = /\$.post\('([^']*)'[^{]+(\{\s*opt:\s*'make_log'[^}]+\}\s*\}),/i;
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^bc\.vc$/,
        /^linc\.ml$/,
      ],
      path: /^.+(https?:\/\/.+)$/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.path[1] + document.location.search + document.location.hash);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^bc\.vc$/,
      path: /^\/.+/,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const token = findAJAXToken();
      const time = fakeAJAXToken();
      const url = `/fly/ajax.php?wds=${token.wds}&time=${time}`;
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(5000);
      let rv = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(url, {
        xdf: {
          afg: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.tZ,
          bfg: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.cW,
          cfg: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.cH,
          jki: token.jki,
          dfg: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.sW,
          efg: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.sH,
        },
        ojk: token.ojk,
      });
      rv = JSON.parse(rv);
      if (rv.error) {
        throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('auth error');
      }
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(rv.message.url);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^adcrun\.ch$/,
      path: /^\/\w+$/,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('.user_content');
      const rSurveyLink = /http\.open\("GET", "api_ajax\.php\?sid=\d*&ip=[^&]*&longurl=([^"]+)" \+ first_time, (?:true|false)\);/;
      const l = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(rSurveyLink);
      if (l) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l[1]);
        return;
      }
      await run(true);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^(1tk|hit|adbla|tl7|mylink)\.us$/,
        /^gx\.si$/,
        /^adwat\.ch$/,
        /^(fly2url|urlwiz|xafox)\.com$/,
        /^(zpoz|ultry)\.net$/,
        /^(wwy|myam)\.me$/,
        /^(ssl|srk)\.gs$/,
        /^shortit\.in$/,
        /^www\.adjet\.eu$/,
        /^cun\.bz$/,
        /^miniurl\.tk$/,
        /^vizzy\.es$/,
        /^kazan\.vc$/,
        /^linkcash\.ml$/,
      ],
      path: /^\/.+/,
    },
    ready: run,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^adtr\.im|ysear\.ch|xip\.ir$/,
      path: /^\/.+/,
    },
    async ready () {
      const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('div.fly_head a.close');
      const f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('iframe.fly_frame');
      if (a && f) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
      } else {
        await run();
      }
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^ad5\.eu$/,
      path: /^\/[^.]+$/,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const s = searchScript(true);
      let m = s.script.match(/(<form name="form1"method="post".*(?!<\\form>)<\/form>)/);
      if (!m) {
        return;
      }
      m = m[1];
      const tz = -(new Date().getTimezoneOffset() / 60);
      m = m.replace('\'+timezone+\'', tz);
      const d = document.createElement('div');
      d.setAttribute('id', 'AdsBypasserFTW');
      d.setAttribute('style', 'display:none;');
      d.innerHTML = m;
      document.body.appendChild(d);
      Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#AdsBypasserFTW > form[name=form1]').submit();
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^tr5\.in$/,
      path: /^\/.+/,
    },
    async ready () {
      await run(true);
    },
  });
  function decompress (script, unzip) {
    if (!unzip) {
      return script;
    }
    let matches = script.match(/eval(.*)/);
    if (!matches) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('no script matches /eval(.*)/');
    }
    matches = matches[1];
    script = eval(matches);
    return script;
  }
  function searchScript (unzip) {
    let content = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('make_log');
    if (content) {
      return {
        direct: false,
        script: decompress(content, unzip),
      };
    }
    content = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('click_log');
    if (content) {
      return {
        direct: true,
        script: decompress(content, unzip),
      };
    }
    throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
  }
  function knockServer (script, dirtyFix) {
    const matches = script.match(ajaxPattern);
    if (!matches) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('(in knock server) no script matches $.post');
    }
    const make_url = matches[1];
    const make_opts = eval('(' + matches[2] + ')');
    const i = setInterval(function () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(make_url, make_opts).then(function (text) {
        if (dirtyFix) {
          text = text.match(/\{.+\}/)[0];
        }
        const jj = JSON.parse(text);
        if (jj.message) {
          clearInterval(i);
          return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(jj.message.url);
        }
      });
    }, 1000);
  }
  async function run (dirtyFix) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let result = searchScript(true);
    if (!result.direct) {
      knockServer(result.script,dirtyFix);
    } else {
      result = result.script.match(/top\.location\.href='([^']+)'/);
      if (!result) {
        throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
      }
      result = result[1];
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(result);
    }
  }
  function findAJAXToken () {
    const rv = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('/fly/ajax.php');
    if (!rv) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
    }
    let wds = rv.match(/\?wds=([^&]+)/);
    if (!wds) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
    }
    wds = wds[1];
    let jki = rv.match(/jki:\s*'([^']+)'/);
    if (!jki) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
    }
    jki = jki[1];
    let ojk = rv.match(/ojk:\s*'([^']+)'/);
    if (!ojk) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script changed');
    }
    ojk = ojk[1];
    return {
      wds: wds,
      jki: jki,
      ojk: ojk,
    };
  }
  function fakeAJAXToken () {
    const skipAd = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div.fly_head span#redirectin').parentElement;
    const margin = 6;
    const fakePageX = skipAd.offsetLeft + margin + 50 + (Math.random() * 10);
    const fakePageY = skipAd.offsetTop + margin + 15 + (Math.random() * 1);
    const po = fakePageX + ',' + fakePageY;
    const posX = jQueryOffset(skipAd).left + margin;
    const posY = jQueryOffset(skipAd).top + margin;
    const pos = (fakePageX - posX) + ',' + (fakePageY - posY);
    const tsta_ = Math.floor((5 + Math.random()) * 1000);
    const time = po + ':' + pos + ':' + tsta_;
    return time;
  }
  function jQueryOffset (element) {
    const r = element.getBoundingClientRect();
    return {
      top: r.top + document.body.scrollTop,
      left: r.left + document.body.scrollLeft,
    };
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?biglistofwebsites\.com$/,
    path: /^\/go\/(\w+\.\w+)$/
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('http://' + m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.bild.me/bild.php?file=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#Bild');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://bildr.no/view/*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.bilde');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?([a-zA-Z0-9]+\.)?binbox\.io$/,
    path: /\/o\/([a-zA-Z0-9]+)/,
  },
  async start (m) {
    const direct_link = window.atob(m.path[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(direct_link);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?boxcash\.net$/,
    path: /^\/[\w~]+$/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/'\/ajax_link\.php',\s*\{key:\s*'(\w+)',\s*url:\s*'(\d+)',\s*t:\s*'(\d+)',\s*r:\s*'(\w*)'\}/);
    if (!m) {
      return;
    }
    const response = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/ajax_link.php', {
      key: m[1],
      url: m[2],
      t: m[3],
      r: m[4],
    });
    const l = response.match(/window(?:.top.window)\.location="([^"]+)"/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?boxcash\.net$/,
    path: /^\/redirect\.html$/,
    query: /url=(.+)$/,
  },
  async start (m) {
    const l = decodeURIComponent(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?(buz|vzt)url\.com$/,
  },
  async ready () {
    const frame = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frame[scrolling=yes]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(frame.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(cf|ex|xt)\d\.(me|co)$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#skip_button');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^catcut\.net$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#rbs');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^cf\.ly$/,
    path: /^\/[^/]+$/,
  },
  async start (m) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/skip' + m.path[0]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?cli\.gs$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.RedirectLink');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?clictune\.com$/,
    path: /^\/[^/]+$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const matches = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/<a href="http:\/\/(?:www.)?clictune\.com\/link\/redirect\/?url=([^&]+)&/);
    const url = decodeURIComponent(matches[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^clk\.im$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const matches = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/\$\("\.countdown"\)\.attr\("href","([^"]+)"\)/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(matches[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^cocoleech\.com$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#download');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^link\.animagz\.org$/,
        /^(coeg|disingkat|gunting)\.in$/,
        /^www\.telondasmu\.com$/,
      ],
      path: /^\/\w+$/,
    },
    async ready (m) {
      const mapper = hostMapper(m.host[0]);
      const b64 = mapper().match(/\?r=(\w+={0,2}?)/);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(atob(b64[1]));
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^sipkur\.net$/,
      path: [
        /^\/\w+$/,
        /^\/menujulink\//,
      ],
    },
    async ready () {
      let d = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#testapk > div');
      d = d.onclick.toString();
      d = d.match(/window\.open\('([^']+)'/);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(d[1]);
    },
  });
  function hostMapper (host) {
    switch (host) {
    case 'disingkat.in':
      return () => {
        const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.btn-block.redirect');
        return a.href;
      };
    case 'link.animagz.org':
      return () => {
        let a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.redirect');
        a = a.onclick.toString();
        a = a.match(/window\.open \('([^']+)'\)/);
        return a[1];
      };
    case 'coeg.in':
    case 'www.telondasmu.com':
      return () => {
        const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.download-link a');
        return a.href;
      };
    case 'gunting.in':
      return () => {
        const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div.col-sm-6:nth-child(1) > center:nth-child(1) > a:nth-child(1)');
        return a.href;
      };
    default:
      return null;
    }
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^coinlink\.co$/,
    path: /^\/i\//,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a#btn-main, a.btn.btn-block.btn-warning, a.btn.btn-block.btn-success');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(?:(\w+)\.)?(coinurl\.com|cur\.lv)$/,
    path: /^\/([-\w]+)$/
  },
  async ready (m) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const host = 'http://cur.lv/redirect_curlv.php';
    const param = m.host[1] === undefined ? {
      code: m.path[1],
    } : {
      zone: m.host[1],
      name: m.path[1],
    };
    const mainFrameContent = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(host, param);
    let docMainFrame = null;
    try {
      docMainFrame = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].toDOM(mainFrameContent);
    } catch (e) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('main frame changed');
    }
    const rExtractLink = /onclick="open_url\('([^']+)',\s*'go'\)/;
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].forEach(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('iframe', docMainFrame), (currFrame) => {
      const currFrameAddr = currFrame.getAttribute('src');
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(currFrameAddr).then((currFrameContent) => {
        const aRealLink = rExtractLink.exec(currFrameContent);
        if (aRealLink === undefined || aRealLink[1] === undefined) {
          return;
        }
        const realLink = aRealLink[1];
        return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(realLink);
      });
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^comyonet\.com$/,
  },
  async ready () {
    const input = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[name="enter"]');
    input.click();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?cvc\.la$/,
    path: /^\/\w+$/,
  },
  async start () {
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(document.location.href, {
      hidden: 24, 
      image: ' ',
    });
    const matches = text.match(/window\.location\.replace\('([^']+)'\);/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(matches[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?dapat\.in$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe[name=pagetext]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?dd\.ma$/,
  },
  async ready () {
    const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#mainframe');
    if (i) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.src);
      return;
    }
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#btn_open a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?dereferer\.website$/,
    query: /^\?(.+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^dikit\.in$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.disclaimer a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^durl\.me$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a[class="proceedBtn"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^easyurl\.net$/,
      /^(atu|clickthru|redirects|readthis)\.ca$/,
      /^goshrink\.com$/,
    ],
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frame[name=main]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^elde\.me$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe:not([name=undefined])');
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#modal-alert');
    a.style.display = 'block';
    a.style.top = 0;
    a.style.left = 0;
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^ethi\.in$/,
      /^st\.wardhanime\.net$/,
    ],
    path: /^\/i\/\d+$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#wrapper > [class^="tombo"] > a[target="_blank"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?filoops\.info$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#text > center a, #text > div[align=center] a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^fit\.sh$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('.container-body');
    let m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/token="([^"]+)"/);
    if (!m) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('site changed');
    }
    m = m[1];
    const interLink = '/go/' + m + '?fa=15466&a=' + window.location.hash.substr(1);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(6 * 1000);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(interLink);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?fiuxy\.co$/,
    path: /^\/links?\/$/,
  },
  async ready () {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.btn.a').href);
  }
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?fundurl\.com$/,
    query: /i=([^&]+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?fundurl\.com$/,
    path: /^\/(go-\w+|load\.php)$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe[name=fpage3]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
  },
});
(function () {
  const hosts = /^gca\.sh|repla\.cr$/;
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hosts,
      path: /^\/adv\/\w+\/(.*)$/,
      query: /^(.*)$/,
      hash: /^(.*)$/,
    },
    async start (m) {
      const l = m.path[1] + m.query[1] + m.hash[1];
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hosts,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const jQuery = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.$;
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(1000);
      jQuery('#captcha-dialog').dialog('open');
    },
  });
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^gkurl\.us$/,
  },
  async ready () {
    const iframe = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#gkurl-frame');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(iframe.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^u\.go2\.me$/,
  },
  async ready () {
    const iframe = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(iframe.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^goto\.loncat\.in$/,
    query: /open=(.+)/,
  },
  async start (m) {
    const url = atob(atob(m.query[1]));
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^gsurl\.(me|in)$/,
      /^g5u\.pw$/,
    ],
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('#container');
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#link');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(5000);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^hotshorturl\.com$/,
  },
  async ready () {
    const frame = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frame[scrolling=yes]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(frame.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?(ilix\.in|priva\.us)$/,
    path: /\/(\w+)/,
  },
  async ready (m) {
    const realHost = 'ilix.in';
    if (m.host[2] !== realHost) {
      const realURL = location.href.replace(m.host[2], realHost);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(realURL);
      return;
    }
    const f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('iframe[name=ifram]');
    if (f) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
      return;
    }
    if (!__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img#captcha')) {
      Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form[name=frm]').submit();
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ilovebanten\.com$/,
  },
  async ready () {
    const p = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.notblocked');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(p.textContent);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^indexmovie\.me$/,
    path: /^\/([^/]+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/get/' + m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^itw\.me$/,
    path: /^\/r\//,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.go-form');
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ity\.im$/,
  },
  async ready () {
    let f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#main');
    if (f) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
      return;
    }
    [, , f] = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].find(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('frame'), (frame) => {
      if (frame.src.indexOf('interheader.php') < 0) {
        return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none;
      }
      return frame.src;
    });
    if (f !== __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f);
      return;
    }
    f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/krypted=([^&]+)/);
    if (!f) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('site changed');
    }
    f = f[1];
    const data = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.des('ksnslmtmk0v4Pdviusajqu', __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.hexToString(f), 0, 0);
    if (data) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('http://ity.im/1104_21_50846_' + data);
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?kingofshrink\.com$/,
  },
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#textresult > a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^st\.kurogaze\.net$/,
    query: /r=(.+)/,
  },
  async start (m) {
    const r = atob(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(r);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^st\.kurogaze\.net$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.redirect');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?leechbd\.tk$/,
    path: /^\/Shortener\/(\w+)$/,
  },
  async start (m) {
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get('/Shortener/API/read/get', {
      id: m.path[1],
      type: 'json',
    });
    const r = JSON.parse(text);
    if (r.success == true && r.data.full) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(r.data.full);
    } else {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('API Error ' + r.error.code + ' : ' + r.error.msg);
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.lienscash.com/l/*',
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#redir_btn');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?\w+\.link-protector\.com$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form[style="font-weight:normal;font-size:12;font-family:Verdana;"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.action);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?link\.im$/,
    path: /^\/\w+$/,
  },
  async start () {
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(document.location.href, {
      image: 'Continue',
    });
    const m = text.match(/window\.location\.replace\('([^']+)'\)/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^link\.tl$/,
    path: /^\/fly\/site\.php$/,
    query: /^\?to=(.+)$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.skip > .btn');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^link\.tl$/,
    path: /[^^](https?:\/\/.+)$/,
  },
  start: function (m) {
    'use strict';
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^link\.tl$/,
    path: /^\/(.+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/fly/site.php?to=' + m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /\.link2dollar\.com$/,
    path: /^\/\d+$/,
  },
  async ready () {
    let m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/const rlink = '([^']+)';/);
    if (!m) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('site changed');
    }
    m = m[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^link2you\.ru$/,
    path: /^\/\d+\/(.+)$/,
  },
  async start (m) {
    let url = m.path[1];
    if (!url.match(/^https?:\/\//)) {
      url = '//' + url;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^link(4ad|ajc)\.com$/,
    path: /^\/(.+)$/,
  },
  async ready (m) {
    let d = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div[id^=module_]');
    d = d.id.match(/module_(\d+)/);
    d = d[1];
    const url = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('form.php?block_id=' + d, {
      cmd: 'get_source',
      act: 'waiting',
      id: m.path[1],
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^link5s\.com$/,
      path: /^\/([^/]+)$/,
    },
    async ready (m) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.$ = null;
      const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#iframeID');
      const opts = {
        page: m.path[1],
        advID: i.dataset.cmp,
        u: i.dataset.u,
      };
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const url = await sendRequest(opts);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
  async function sendRequest (opts) {
    const data = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/ajax/r.php', opts);
    if (data.length <= 1) {
      return await sendRequest(opts);
    }
    let a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].toDOM(data);
    a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a', a);
    return a.href;
  }
})();
(function() {
  const hostRules = [
    /^(([\w]{8}|www)\.)?(allanalpass|cash4files|drstickyfingers|fapoff|freegaysitepass|(gone|tube)viral|(pic|tna)bucks|whackyvidz|fuestfka)\.com$/,
    /^(([\w]{8}|www)\.)?(a[mn]y|deb|dyo|sexpalace)\.gs$/,
    /^(([\w]{8}|www)\.)?(filesonthe|poontown|seriousdeals|ultrafiles|urlbeat|zatnawqy|jzrputtbut)\.net$/,
    /^(([\w]{8}|www)\.)?freean\.us$/,
    /^(([\w]{8}|www)\.)?galleries\.bz$/,
    /^(([\w]{8}|www)\.)?hornywood\.tv$/,
    /^(([\w]{8}|www)\.)?link(babes|bucks)\.com$/,
    /^(([\w]{8}|www)\.)?(megaline|miniurls|qqc|rqq|tinylinks|yyv|zff)\.co$/,
    /^(([\w]{8}|www)\.)?(these(blog|forum)s)\.com$/,
    /^(([\w]{8}|www)\.)?youfap\.me$/,
    /^warning-this-linkcode-will-cease-working-soon\.www\.linkbucksdns\.com$/,
  ];
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRules,
      path: /^\/\w+\/url\/(.+)$/,
    },
    async ready(m) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].removeAllTimer();
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].resetCookies();
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      let url = m.path[1] + window.location.search;
      const match = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/UrlEncoded: ([^,]+)/);
      if (match && match[1] === 'true') {
        url = decrypt(url);
      }
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    }
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRules,
    },
    async start () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.XMLHttpRequest = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].nop;
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].removeAllTimer();
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].resetCookies();
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      if (window.location.pathname.indexOf('verify') >= 0) {
        const path = window.location.pathname.replace('/verify', '');
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(path);
        return;
      }
      const token = findToken(document);
      const url = await sendRequest(token);
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].nuke(url);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      query: /^(.*)[?&]_lbGate=\d+$/,
    },
    async start (m) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].setCookie('_lbGatePassed', 'true');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(window.location.pathname + m.query[1]);
    },
  });
  function findToken (context) {
    const script = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('    var f = window[\'init\' + \'Lb\' + \'js\' + \'\']', context);
    if (!script) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('pattern changed');
      return null;
    }
    let adurl = script.match(/AdUrl\s*:\s*'([^']+)'/);
    if (!adurl) {
      return null;
    }
    adurl = adurl[1];
    const m1 = script.match(/AdPopUrl\s*:\s*'.+\?[^=]+=([\w\d]+)'/);
    const m2 = script.match(/Token\s*:\s*'([\w\d]+)'/);
    const token = m1[1] || m2[1];
    let m = script.match(/=\s*(\d+);/);
    let ak = parseInt(m[1], 10);
    const re = /\+\s*(\d+);/g;
    let tmp = null;
    while((m = re.exec(script)) !== null) {
      tmp = m[1];
    }
    ak += parseInt(tmp, 10);
    return {
      t: token,
      aK: ak,
      adurl: adurl,
    };
  }
  async function sendRequest (token) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(token.adurl);
    delete token.adurl;
    token.a_b = false;
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('waiting the interval');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(5000);
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('sending token: %o', token);
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get('/intermission/loadTargetUrl', token, {
      'X-Requested-With': __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none,
      Origin: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none,
    });
    const data = JSON.parse(text);
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('response: %o', data);
    if (!data.Success && data.Errors[0] === 'Invalid token') {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('got invalid token');
      return await retry();
    }
    if (data.AdBlockSpotted) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('adblock spotted');
      return;
    }
    if (data.Success && !data.AdBlockSpotted && data.Url) {
      return data.Url;
    }
  }
  async function retry () {
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(window.location.toString(), {}, {
      'X-Forwarded-For': __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].generateRandomIP(),
    });
    const d = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].toDOM(text);
    const t = findToken(d);
    if (!t) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(1000);
      return await retry();
    }
    return await sendRequest(t);
  }
  function decrypt (url) {
    url = ConvertFromHex(url);
    let unsafe = `(${Encode.toString()})("${url}")`;
    unsafe = (0, eval)(unsafe);
    return unsafe;
  }
  function ConvertFromHex (str) {
    const result = [];
    while (str.length >= 2) {
      result.push(String.fromCharCode(parseInt(str.substring(0, 2), 16)));
      str = str.substring(2, str.length);
    }
    return result.join('');
  }
  const Encode = function (str) {
    var s = [], j = 0, x, res = '', k = arguments.callee.toString().replace(/\s+/g, '');
    for (var i = 0; i < 256; i++) {
      s[i] = i;
    }
    for (i = 0; i < 256; i++) {
      j = (j + s[i] + k.charCodeAt(i % k.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }
    i = 0;
    j = 0;
    for (var y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
  };
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^www\.linkdecode\.com$/,
      /^www\.fastdecode\.com$/,
    ],
    path: /^\/$/,
    query: /^\?(.+)$/,
  },
  async ready (m) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let lnk = m.query[1];
    if (m.query[1].match(/^https?:\/\//)) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(lnk);
      return;
    }
    let b = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#popup');
    if (b && b.href) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(b.href);
      return;
    }
    b = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#m > .Visit_Link');
    b = b.onclick.toString().match(/window\.open\('([^']+)'/);
    if (!b) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasser('pattern changed');
    }
    lnk = b[1].match(/\?(https?:\/\/.*)$/);
    if (lnk) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(lnk[1]);
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(b[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^linkdolar\.xyz$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/^\s*eval\((.+)\)\s*$/);
    if (!s) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('site changed');
      return;
    }
    s = eval('(' + s[1] + ')');
    s = s.match(/\$\.post\('([^']+)',(\{.+\}),function/);
    if (!s) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('site changed');
    }
    const url = s[1];
    const args = eval('(' + s[2] + ')');
    const target = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(url, args);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(target);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^(www\.)?linkdrop\.net$/,
        /^dmus\.in$/,
        /^ulshare\.net$/,
        /^adurl\.id$/,
        /^goolink\.me$/,
        /^earningurl\.com$/,
      ],
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe, [class$="Overlay"]');
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].block('[class$="Overlay"]', document.body);
      const f = getForm();
      if (!f) {
        __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('no form');
        return;
      }
      sendRequest(f);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^sflnk\.me$/,
        /^idsly\.com$/,
        /^adbilty\.me$/,
        /^oke\.io$/,
      ],
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      let f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#captchaShortlink');
      if (f) {
        return;
      }
      f = getForm();
      if (!f) {
        f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#link-view');
        f.submit();
        return;
      }
      sendRequest(f);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^adlink\.guru$/,
        /^clik\.pw$/,
        /^coshurl\.co$/,
        /^curs\.io$/,
        /^cypt\.ga$/,
        /^(filesbucks|tmearn|cut-urls)\.com$/,
        /^elink\.link$/,
        /^(payurl|urlst)\.me$/,
        /^u2s\.io$/,
        /^url\.ht$/,
        /^urle\.co$/,
        /^(hashe|trlink|adshort)\.in$/,
        /^www\.worldhack\.net$/,
        /^123link\.(io|co|press)$/,
        /^pir\.im$/,
        /^bol\.tl$/,
        /^(tl|adfly)\.tc$/,
        /^(adfu|linkhits)\.us$/,
        /^short\.pastewma\.com$/,
        /^l2s\.io$/,
        /^linkfly\.gaosmedia\.com$/,
        /^linclik\.com$/,
        /^link-earn\.com$/,
        /^zez\.io$/,
        /^adbull\.me$/,
        /^adshort\.im$/,
        /^adshorte\.com$/,
        /^weefy\.me$/,
      ],
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe', '.BJPPopAdsOverlay');
      const page = await firstStage();
      const url = await secondStage(page);
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].nuke(url);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
  function getForm () {
    const jQuery = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.$;
    const f = jQuery('#go-link, .go-link, form[action="/links/go"], form[action="/links/linkdropgo"]');
    if (f.length > 0) {
      return f;
    }
    return null;
  }
  function sendRequest (f) {
    const jQuery = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.$;
    jQuery.ajax({
      dataType: 'json',
      type: 'POST',
      url: f.attr('action'),
      data: f.serialize(),
      success: (result) => {
        if (result.url) {
          __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(result.url);
        } else {
          __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn(result.message);
        }
      },
      error: (xhr, status, error) => {
        __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn(xhr, status, error);
      },
    });
  }
  function firstStage () {
    return new Promise((resolve) => {
      const f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#link-view');
      if (!f) {
        resolve(document);
        return;
      }
      const args = extractArgument(f);
      const url = f.getAttribute('action');
      const p = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(url, args).then((data) => {
        return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].toDOM(data);
      });
      resolve(p);
    });
  }
  async function secondStage (page) {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#go-link', page);
    const args = extractArgument(f);
    const url = f.getAttribute('action');
    let data = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(url, args);
    data = JSON.parse(data);
    if (data && data.url) {
      return data.url;
    }
    throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('wrong data');
  }
  function extractArgument (form) {
    const args = {};
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].forEach(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('input', form), (v) => {
      args[v.name] = v.value;
    });
    return args;
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^linkpaid\.net$/,
    path: /^\/go\//,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#btn-main');
    f.click();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?linkplugapp\.com$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#mc_embed_signup_scroll a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^linksas\.us$/,
    path: /^(\/\w+)$/,
  },
  async ready (m) {
    const recaptcha = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].tryEvery(1000, () => {
      const recaptcha = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#g-recaptcha-response');
      if (!recaptcha) {
        return null;
      }
      if (!recaptcha.value) {
        return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none;
      }
      return recaptcha.value;
    });
    const url = `http://ipinfo.io/${__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" /* _ */].generateRandomIP()}/json`;
    let ipinfo = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(url);
    ipinfo = JSON.parse(ipinfo);
    const payload = {
      codeAds: 1,
      country: ipinfo.country,
      ipAddress: ipinfo.ip,
      recaptcha: recaptcha,
    };
    const token = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].getCookie('XSRF-TOKEN');
    let data = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/go' + m.path[1], payload, {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': token,
    });
    data = JSON.parse(data);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(data.message);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^linksas\.us$/,
    path: /^\/go\//,
  },
  async ready () {
    const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#btnSubmit');
    if (!a) {
      return;
    }
    const url = a.href;
    const pattern = /https?:\/\//g;
    let lastURL = '';
    while (true) {
      const matched = pattern.exec(url);
      if (!matched) {
        break;
      }
      lastURL = matched + url.substring(pattern.lastIndex);
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(lastURL);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^linkshrink\.net$/,
    path: /^\/[a-zA-Z0-9]+$/,
  },
  async start () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window._impspcabe = 0;
  },
  async ready () {
    let l = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/revC\("([^"]+)"\)/);
    l = atob(l[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/' + l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^linkshrink\.net$/,
    path: /=(.+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://lix.in/-*',
  async ready () {
    let i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#ibdc');
    if (i) {
      return;
    }
    i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('form');
    if (i) {
      i.submit();
      return;
    }
    i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^lnk\.in$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#divRedirectText a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.innerHTML);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(rd?)lnk\.co|reducelnk\.com$/,
    path: /^\/[^.]+$/,
  },
  async ready () {
    const f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('iframe#dest');
    if (f) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f.src);
      return;
    }
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let o = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#urlholder');
    if (o) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(o.value);
      return;
    }
    o = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#skipBtn');
    if (o) {
      o = o.querySelector('a');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(o.href);
      return;
    }
    o = document.title.replace(/(LNK.co|Linkbee)\s*:\s*/, '');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(o);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^lnx\.lu$/,
      /^url\.fm$/,
      /^z\.gs$/,
    ],
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#clickbtn a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.lolinez\.com$/,
    query: /\?(.+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?loook\.ga$/,
    path: /^\/\d+$/
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#download_link > a.btn');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^looy\.in$/,
    path: /^\/Pro\/(.+)$/,
  },
  async ready (m) {
    const url = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('http://looy.in/Go/Index/ProSkipAd', {
      code: m.path[1],
      server: '',
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^looy\.in$/,
    path: /^\/(.+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/Pro/' + m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://madlink.sk/',
    'http://madlink.sk/*.html',
  ],
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://madlink.sk/*',
  async start (m) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/ajax/check_redirect.php', {
      link: m[1],
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(text);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^mant[ae][pb]\.in$/,
      /^st\.oploverz\.net$/,
      /^minidroid\.net$/,
      /^ww3\.awaremmxv\.com$/,
      /^linkpoi\.in$/,
    ],
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.redirect, a[target=_blank][rel=nofollow]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^susutin\.com$/,
  },
  async ready () {
    const s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/="([^"]+)",/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.mije\.net$/,
    path: /^\/\w+\/(.+)$/,
  },
  async start (m) {
    const url = atob(m.path[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^mirrorfilehost\.com$/,
  },
  async ready () {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(3 * 1000);
    const frame = frames[0];
    const form = frame.document.createElement('form');
    form.target = '_parent';
    form.action = location.toString();
    const input = frame.document.createElement('input');
    input.value = 'Download';
    input.type = 'submit';
    form.appendChild(input);
    frame.document.body.appendChild(form);
    input.click();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^moe\.god\.jp$/,
      /^moesubs\.akurapopo\.pro$/,
      /^dl\.nsfk\.in$/,
    ]
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div div center a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^moesubs\.com$/,
    path: /^\/url\//,
  },
  async ready () {
    let a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('body > div:nth-child(4) > i:nth-child(1)');
    a = a.textContent;
    const i = a.lastIndexOf('http');
    a = a.substr(i);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^mt0\.org$/,
    path: /^\/[^/]+\/$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('frame[name=bottom]');
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frame[name=top]');
    const i = setInterval(() => {
      const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('div a', f.contentDocument);
      if (!a) {
        return;
      }
      clearInterval(i);
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
    }, 1000);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://my-link.pro/*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe[scrolling=auto]');
    if (i) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.src);
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^nmac\.to$/,
    path: /^\/download\/(.+)/,
  },
  async start (m) {
    const url = atob(m.path[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^nsfw\.in$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#long_url a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^nutshellurl\.com$/,
  },
  async ready () {
    const iframe = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('iframe');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(iframe.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?ohleech\.com$/,
    path: /^\/dl\/$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.startdl();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.oni\.vn$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let data = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/data:"([^"]+)"/);
    if (!data) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('pattern changed');
    }
    data = data[1];
    const url = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get('/click.html', data);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?ouo\.(io|press)$/,
    path: /^\/go\/\w+$/,
  },
  async ready () {
    Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form').submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^oxyl\.me$/,
  },
  async ready () {
    const l = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('.links-container.result-form > a.result-a');
    if (l.length > 1) {
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l[0].href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^p\.pw$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/window\.location = "(.*)";/);
    m = m[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pdi2\.net$/,
  },
  async ready () {
    let s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/top\.location = '([^']+)'/);
    s = s[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?\w+\.rapeit\.net$/,
    path: /^\/(go|prepair|request|collect|analyze)\/[a-f0-9]+$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a#download_link');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://reffbux.com/refflinx/view/*',
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/skip_this_ad_(\d+)_(\d+)/);
    const id = m[1];
    const share = m[2];
    const location = window.location.toString();
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('http://reffbux.com/refflinx/register', {
      id: id,
      share: share,
      fp: 0,
      location: location,
      referer: '',
    });
    m = text.match(/'([^']+)'/);
    if (!m) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('pattern changed');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://richlink.com/app/webscr?cmd=_click&key=*',
  async ready () {
    let f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frameset');
    f = f.onload.toString();
    f = f.match(/url=([^&]+)/);
    if (f) {
      f = decodeURIComponent(f[1]);
    } else {
      f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frame[name=site]');
      f = f.src;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(f);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://rijaliti.info/*.php',
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#main td[align="center"] a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^riurl\.com$/,
    path: /^\/.+/,
  },
  async ready () {
    let s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('body script');
    if (s) {
      s = s.innerHTML.indexOf('window.location.replace');
      if (s >= 0) {
        return;
      }
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('', {
      path: {
        hidden: '1',
        image: ' ',
      },
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^preview\.rlu\.ru$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#content > .long_url > a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^robo\.us$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const url = atob(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.fl);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.ron\.vn$/,
  },
  async ready () {
    const script = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts('linknexttop');
    const data = script.match(/data:"([^"]+)"/);
    let url = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.domain + 'click.html?' + data[1];
    url = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(url, {}, {
      'Content-Type': 'application/json; charset=utf-8',
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?sa\.ae$/,
    path: /^\/\w+\/$/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/const real_link = '([^']+)';/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?safeurl\.eu$/,
    path: /\/\w+/,
  },
  async ready () {
    let directUrl = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/window\.open\("([^"]+)"\);/);
    if (!directUrl) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('script content changed');
    }
    directUrl = directUrl[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(directUrl);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^segmentnext\.com$/,
      /^(www\.)?videogamesblogger.com$/,
    ],
    path: /^\/interstitial\.html$/,
    query: /return_url=([^&]+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(decodeURIComponent(m.query[1]));
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?(apploadz\.ru|seomafia\.net)$/
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('table a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: /http:\/\/setlinks\.us\/(p|t|d).*/,
  async ready () {
    const k = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/window\.location='([^']+)'/);
    if (k) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(k[1]);
      return;
    }
    const aLinks = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('div.links-container.result-form:not(.p-links-container) > span.dlinks > a');
    if (aLinks.length === 1) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(aLinks.at(0).href);
      return;
    }
  },
});
(function () {
  const hostRules = [
    /^sh\.st$/,
    /^(dh10thbvu|u2ks|jnw0|qaafa|xiw34|cllkme|clkmein|corneey|ceesty)\.com$/,
    /^[dfg]estyy\.com$/,
    /^digg\.to$/,
    /^([vw]iid|clkme)\.me$/,
    /^short\.est$/,
  ];
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRules,
      path: /^\/freeze\/.+/,
    },
    async ready () {
      const promise = new Promise((resolve) => {
        const o = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.target.getAttribute('class').match(/active/)) {
              o.disconnect();
              resolve(mutation.target.href);
            }
          });
        });
        o.observe(Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#skip_button'), {
          attributes: true,
          attributeFilter: ['class'],
        });
      });
      const url = await promise;
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRules,
      path: /https?:\/\//,
    },
    async start () {
      let url = window.location.pathname + window.location.search + window.location.hash;
      url = url.match(/(https?:\/\/.*)$/);
      url = url[1];
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRules,
      path: /^\/[\d\w]+/,
    },
    async start () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window._impspcabe = 0;
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].removeAllTimer();
      const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/sessionId: "([\d\w]+)",/);
      if (m) {
        afterGotSessionId(m[1]);
        return;
      }
      const o = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/sessionId: "([\d\w]+)",/);
          if (m) {
            o.disconnect();
            afterGotSessionId(m[1]);
          }
        });
      });
      o.observe(document.body, {
        childList: true,
      });
    },
  });
  function afterGotSessionId (sessionId) {
    const X_NewRelic_ID = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/xpid:"([^"]+)"/);
    const data = {
      adSessionId: sessionId,
    };
    const header = {
      Accept: 'application/json, text/javascript',
    };
    if (X_NewRelic_ID) {
      header['X-NewRelic-ID'] = X_NewRelic_ID;
    }
    const i = setInterval(function () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get('/shortest-url/end-adsession', data, header).then(function (text) {
        const r = JSON.parse(text);
        if (r.status == 'ok' && r.destinationUrl) {
          clearInterval(i);
          __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].removeAllTimer();
          const url = decodeURIComponent(r.destinationUrl);
          return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
        }
      });
    }, 1000);
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^(www\.)?shink\.(in|me)$/,
      /^fas\.li$/,
      /^(www\.)?croco\.(me|site)$/,
      /^cpmlink\.net$/,
    ],
    path: /^\/\w+$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#skip');
    if (!__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#captcha')) {
      f.submit();
    }
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('.BJPPopAdsOverlay');
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].block((node) => {
      return node.localName === 'div' && node.style.zIndex === '2147483647';
    }, document.body);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: [
        /^cpmlink\.net$/,
      ],
      path: /^\/go\/\w+$/,
    },
    {
      host: /^(www\.)?croco\.(me|site)$/,
      path: /^\/ok\/\w+$/,
    },
  ],
  async ready () {
    let a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#btn-main');
    const i = a.href.lastIndexOf('http');
    a = a.href.substr(i);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^fas\.li$/,
      /^(www\.)?shink\.(in|me)$/,
    ],
    path: /^\/go\/\w+$/,
  },
  async ready () {
    const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#skip');
    f.submit();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^short\.am$/,
  },
  async ready () {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(5000);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('', {
      post: {
        _image: 'Continue',
      },
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^(www\.)?shortenurl\.tk$/,
      /^(www\.)?pengaman\.link$/,
      /^urlgo\.gs$/,
      /^gunting\.web\.id$/,
    ],
    path: /^\/\w+$/,
  },
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.btn-block.redirect');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?shorti\.ga$/,
    path: [
      /^\/\w+$/,
      /^\/url_redirector\.html$/,
    ],
  },
  async ready () {
    const f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$$('frame');
    const [, v,] = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].find(f, (value) => {
      if (value.getAttribute('class')) {
        return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none;
      }
      return 'Target frame found';
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(v.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.shortskip\.com$/,
    path: /^\/short\.php$/,
    query: /i=([^&]+)/,
  },
  async start (m) {
    const url = decodeURIComponent(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^get\.shrink-service\.it$/,
    path: /^\/(.+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(`//www.shrink-service.it/shrinked/${m.path[1]}`);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.shrink-service\.it$/,
    path: /^\/shrinked\//,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[id][name]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.value);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.shrink-service\.it$/,
    path: /^\/[se]\//,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('body > input[id][name]');
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(i.value);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^sht\.io$/,
    path: /^\/\d+\/(.+)$/,
  },
  async start (m) {
    let url = atob(m.path[1]);
    url = url.match(/\{sht-io\}(.+)\{sht-io\}.*\{sht-io\}/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?similarsites\.com$/,
    path: /^\/goto\/([^?]+)/
  },
  async start (m) {
    let l = m.path[1];
    if (!/^https?:\/\//.test(l)) {
      l = 'http://' + l;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^smll\.io$/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/window\.location="([^"]*)";/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.spaste\.com$/,
    path: /^\/go\/\w+$/,
  },
  async ready () {
    const id = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/\{id:'(\d+)'\}/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(3000);
    const url = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/site/getRedirectLink', {
      id: id[1],
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^srnk\.co$/,
    path: /^\/i\//,
  },
  async ready () {
    const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#btn-with-link');
    if (!a) {
      return;
    }
    const href = a.href;
    const method = a.dataset.method;
    if (method) {
      const csrfParam = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('meta[name="csrf-param"]').content;
      const csrfToken = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('meta[name="csrf-token"]').content;
      const form = document.createElement('form');
      form.method = 'post';
      form.action = href;
      let input = document.createElement('input');
      input.name = '_method';
      input.value = method;
      form.appendChild(input);
      input = document.createElement('input');
      input.name = csrfParam;
      input.value = csrfToken;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      return;
    }
    const script = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(location.pathname + '.js');
    const m = script.match(/const link = "([^"]+)";/);
    if (!m) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('script changed');
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^stash-coins\.com$/,
  },
  async start () {
    let url = window.location.toString();
    const i = url.lastIndexOf('http');
    url = url.substr(i);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^streamingfrench\.net$/,
    path: /^\/$/,
    query: /^\?xb=(.+)$/,
  },
  async start (m) {
    const url = decodeURIComponent(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?supercheats\.com$/,
    path: /^\/interstitial\.html$/,
    query: /(?:\?|&)oldurl=([^&]+)(?:$|&)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: [
        /^(www\.)?sylnk\.net$/,
        /^dlneko\.(com|net|org)$/,
        /^rumahsimpel\.com$/,
      ],
      query: /link=([^&]+)/,
    },
    {
      host: /^(www\.)?compul\.in$/,
      path: /^\/[np]\.php$/,
      query: /v=([^&]+)/,
    },
    {
      host: /^(www\.)?safelinkair\.com$/,
      path: /^\/code$/,
      query: /(?:\?|&)link=([a-zA-Z0-9/=]+)(?:$|&)/,
    },
    {
      host: [
        /^link\.filmku\.net$/,
        /^www\.healthygress24\.ga$/,
        /^kombatch\.amankan\.link$/,
      ],
      path: /^\/p\/(go|healty-lie)\.html$/,
      query: /^\?url=([a-zA-Z0-9/=]+)$/,
    },
    {
      host: [
        /^(gadget|auto|sports)14\.pw$/,
        /^motosport\.pw$/,
        /^nar-04\.tk$/,
        /^lindung\.in$/,
        /^motonews\.club$/,
        /^ww[23]\.picnictrans\.com$/,
        /^gadget13\.com$/,
        /^azhie\.net$/,
        /^ww2\.awsubs\.co$/,
        /^autorp\.us$/
      ],
      query: /^\?d=([a-zA-Z0-9/=]+)$/,
    },
    {
      host: /^www\.anisubsia\.tk$/,
      path: /^\/p\/link\.html$/,
      query: /^\?url=([a-zA-Z0-9/=]+)$/,
    },
    {
      host: [
        /^www\.insurance1\.tech$/,
        /^www\.freeanimeonline\.xyz$/,
      ],
      query: /^\?site=([a-zA-Z0-9/=]+)/,
    },
    {
      host: /^i\.gtaind\.com$/,
      query: /^\?([a-zA-Z0-9/=]+)$/,
    },
    {
      host: /\.blogspot\.com?/,
      query: [
        /^\?url=([a-zA-Z0-9/=]+)$/,
        /^\?id=([a-zA-Z0-9/=]+)$/,
      ],
    },
    {
      host: /^sehatlega\.com$/,
      query: /^\?lanjut=([a-zA-Z0-9/=]+)$/,
    },
    {
      host: /^shorten\.id$/,
      query: /^\?url=([a-zA-Z0-9/=]+)=$/,
    },
    {
      host: /^www\.compartiendofull\.net$/,
      path: /^\/go2/,
      query: /^\?p=([a-zA-Z0-9/=]+)$/,
    },
  ],
  async start (m) {
    const rawLink = atob(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(rawLink);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: [
        /(^|\.)safelinkconverter2?\.com$/,
        /^safelink(s?review(er)?)\.com?$/,
        /^susutin\.com$/,
        /^(getcomics|miuitutorial)\.gq$/,
        /^awsubs\.cf$/,
        /^awsubsco\.ga$/,
      ],
      query: /id=([\w\\]+=*)/,
    },
    {
      host: [
        /^(www\.)?dlneko\.com$/,
        /^(satuasia|tawaku)\.com$/,
        /^ww3\.manteb\.in$/,
        /^link\.filmku\.net$/,
        /^www\.muucih\.com$/,
        /^(naisho|filmku)\.lompat\.in$/,
        /^edogawa\.lon\.pw$/,
        /^telolet\.in$/,
      ],
      query: /go=([\w\\]+=*)/,
    },
  ],
  async start (m) {
    let l = atob(m.query[1]);
    const table = {
      '!': 'a',
      ')': 'e',
      '_': 'i',
      '(': 'o',
      '*': 'u',
    };
    l = l.replace(/[!)_(*]/g, function (m) {
      return table[m];
    });
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?safelinkreview\.com$/,
    path: /^\/\w+\/cost\/([\w.]+)\/?$/,
  },
  async start (m) {
    const l = 'http://' + m.path[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: [
        /^(designinghomey|ani-share|sinopsisfilmku|autolinkach)\.com$/,
        /^motonews\.club$/,
        /^(autofans|landscapenature)\.pw$/,
        /^(sidespace|erogedownload)\.net$/,
      ],
      query: /get=([^&]+)/,
    },
    {
      host: /^sipkur\.us$/,
      path: /\.html$/,
    },
  ],
  async ready (m) {
    let s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/(const|var) a='([^']+)'/);
    if (s) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s[2]);
      return;
    }
    s = atob(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^kombatch\.loncat\.pw$/,
  },
  async ready () {
    let s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/\.open\("([^"]+)",/);
    s = s[1].match(/go=([^&]+)/);
    s = atob(s[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^ww[23]\.picnictrans\.com$/,
      /^short\.awsubs\.(co|me)$/,
    ],
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div.kiri > center > a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^susutinv2\.com$/,
  },
  async ready () {
    const s = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/="([^"]+)",/);
    if (!s) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].warn('site changed');
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(s[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.njiir\.com$/,
  },
  async ready () {
    let a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div.download-link > a');
    a = a.href.match(/r=(.*)$/);
    a = atob(a[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^techfunda\.net$/,
    path: [
      /^\/link\//,
      /^\/safe\//,
    ],
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.hide a.btn');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^thinfi\.com$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div p a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^tinyarrows\.com$/,
    path: /^\/preview\.php$/,
    query: /^\?page=([^&]+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(decodeURIComponent(m.query[1]));
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^topload\.pro$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.hide a.btn');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?totaldebrid\.org$/,
    path:/\/l\/(l\.php)?$/,
    query: /\?ads=([a-zA-Z0-9=]+)$/,
  },
  async start (m) {
    const l = atob(m.query[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?typ\.me$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#skipAdBtn');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?ultshare\.com$/,
    path: /^\/(?:(?:\d-)?(\d+)|index\.php)$/,
    query: /^(?:\?a=\d&c=(\d+))?$/
  },
  async start (m) {
    const linkId = m.path[1] ? m.path[1] : m.query[1];
    const directLink = '/3-' + linkId;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(directLink);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^unfake\.it$/,
  },
  async ready () {
    const frame = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('frame');
    const i = frame.src.lastIndexOf('http://');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(frame.src.substr(i));
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?(upan|gxp)\.so$/,
    path: /^\/\w+$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('table.td_line a[onclick="down_process_s();"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^url\.ie$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a[title="Link to original URL"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /(^|\.)urlcash\.(com|net|org)$/,
      /^(bat5|detonating|celebclk|eightteen|smilinglinks|peekatmygirlfriend|pornyhost|clb1|urlgalleries)\.com$/,
      /^looble\.net$/,
      /^xxxs\.org$/,
    ],
  },
  async ready () {
    if (__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window && __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.linkDestUrl) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.linkDestUrl);
      return;
    }
    const matches = document.body.innerHTML.match(/linkDestUrl = '(.+)'/);
    if (matches) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(matches[1]);
      return;
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^urlinn\.com$/,
  },
  async ready () {
    const m = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('META[HTTP-EQUIV=refresh]').getAttribute('CONTENT').match(/url='([^']+)'/);
    if (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^urlms\.com$/,
  },
  async ready () {
    const iframe = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#content');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(iframe.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?urlv2\.com$/,
  },
  async ready () {
    if (window.location.pathname.indexOf('locked') >= 0) {
      const path = window.location.pathname.replace('/locked', '');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(path);
      return;
    }
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/jeton=([\w]+)/);
    const l = 'http://urlv2.com/algo.php?action=passer&px=0&so=1&jeton=' + m[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(5 * 1000);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?uskip\.me$/,
    path: /^\/go\/\w+$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#btn-main');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^vavi\.co$/,
  },
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#goLink');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?victly\.com$/,
    path: /^\/\w+$/,
  },
  async start () {
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(document.location.href, {
      hidden: '',
      image: 'Skip+Ads',
    });
    const m = text.match(/window\.location\.replace\('([^']+)'\)/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.viidii\.info$/,
  },
  async ready () {
    const o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#directlink');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(o.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?vir\.al$/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/const target_url = '([^']+)';/);
    if (!m) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('site changed');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?wzzq\.me$/,
  },
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img_loading_table2  div.wz_img_hit a[target=_blank]').href;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(l);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^xlink\.me$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#main_form > center > a');
    if (!a) {
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://yep.it/preview.php?p=*',
  async ready () {
    const link = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('font[color="grey"]').innerHTML;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(link);
  },
});
(() => {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: 'http://www.yooclick.com/l/*',
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      const uniq = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.uniq || __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.uniqi;
      if (!uniq) {
        return;
      }
      const path = window.location.pathname;
      const url = `${path}?ajax=true&adblock=false&old=false&framed=false&uniq=${uniq}`;
      await getURL(url);
    },
  });
  async function getURL (url) {
    const text = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(url);
    const goodURL = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i.test(text);
    if (goodURL) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(text);
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(500);
    await getURL(url);
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ysf\.pl$/,
    path: /^\/3\/(.+)$/,
  },
  async start (m) {
    const url = atob(m.path[1]);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ysf\.pl$/,
    path: /^\/2\/(.+)$/,
  },
  async start (m) {
    const url = m.path[1].match(/.{2}/g).map((h) => {
      return String.fromCharCode(parseInt(h, 16));
    }).join('');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.zintata\.com$/,
    path: /^\/link\/$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#one > center:nth-child(3) > a:nth-child(1)');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://zo.mu/redirector/process?link=*',
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    window.location.reload();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^zzz\.gl$/,
  },
  async ready () {
    const m = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/const domainurl = '([^']+)';/);
    if (!m) {
      throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('site changed');
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(m[1]);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^(www\.)?([a-zA-Z0-9]+\.)?binbox\.io$/,
      path: /\/([a-zA-Z0-9]+)/,
      hash: /(?:#([a-zA-Z0-9]+))?/,
    },
    async ready (m) {
      const sjcl = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.sjcl;
      const paste_id = m.path[1];
      const paste_salt = m.hash[1];
      const API_URL = `https://binbox.io/${paste_id}.json`;
      let pasteInfo = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(API_URL, false, {
        Origin: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none,
        Referer: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none,
        Cookie: 'referrer=1',
        'X-Requested-With': __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none,
      });
      pasteInfo = JSON.parse(pasteInfo);
      if (!pasteInfo.ok) {
        throw new __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].AdsBypasserError('error when getting paste information');
      }
      if (pasteInfo.paste.url) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(pasteInfo.paste.url);
        return;
      }
      const raw_paste = sjcl.decrypt(paste_salt, pasteInfo.paste.text);
      if (isLink(raw_paste)) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(raw_paste);
        return;
      }
      const elm = document.createElement('pre');
      elm.id = 'paste-text';
      elm.innerHTML = linkify(raw_paste);
      const frame = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#paste-frame, #captcha-page');
      frame.parentNode.replaceChild(elm, frame);
    },
  });
  const sUrl = '(\\b(https?|ftp|file)://[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])';
  function isLink (text) {
    const rUrl = new RegExp(`^${sUrl}$`, 'i');
    return rUrl.test(text);
  }
  function linkify (text) {
    const rUrl = new RegExp(sUrl, 'ig');
    return text.replace(rUrl, (match) => {
      return `<a href="${match}">${match}</a>`;
    });
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?pasted\.co$/,
    path: /^\/\w+$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('#captcha_overlay');
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: /^1(dl|be)\.biz$/,
      path: /^\/\w\.php$/,
      query: /^\?\w\/\d+$/,
    },
    {
      host: /^img\.1dl\.biz$/,
      path: /^\/\w\.php$/,
      query: /^\?\w\/([\d/]+)$/,
    },
  ],
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.main a, .main-l a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href, {
      referer: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^1pics\.ru$/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img[alt$="1Pics.Ru"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.(2i\.(sk|cz)|2imgs\.com)$/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#wrap3 img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?image(pearl|crest)\.com$/,
    path: /^\/verify\/(.+)$/,
  },
  async ready () {
    const w = screen.width;
    const h = screen.height;
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#i').value;
    const r = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#r').value;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get('verify.php', {
      w,
      h,
      i,
      r,
    });
    location.reload();
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://*.abload.de/image.php?img=*',
    'http://www.imageup.ru/*/*/*.html',
    'http://itmages.ru/image/view/*/*',
    {
      host: /^(www\.)?image(pearl|crest)\.com$/,
      path: /^\/view\//,
    },
  ],
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^avenuexxx\.com$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#content img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^(b4he|fullimg)\.com/,
      /^fastpics\.net/,
      /^ifap\.co/,
    ],
    query: /^\?v=([^&]+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/images/' + m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imagep2p\.com$/,
    query: /^\?v=([^&]+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/images/' + m.query[1] + '.jpeg');
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^bayimg\.com$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#mainImage');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^beeimg\.com$/,
    path: /\/view\/.*/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.img-responsive');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.bilder-space.de/*.htm',
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.picture');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.bilder-upload.eu/show.php?file=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[type=image]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://blackcatpix.com/v.php?*',
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('td center img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.casimages.com/img.php?*',
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('td a img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^www\.x45x\.info$/,
      /^(imadul|mypixxx\.lonestarnaughtygirls)\.com$/,
      /^ghanaimages\.co$/,
      /^imgurban\.info$/,
      /^d69\.in$/,
    ],
    query: /\?p[mt]=(.+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/?di=' + m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://javelite.tk/viewer.php?id=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('table img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^imgchili\.(com|net)$/,
      /^(www\.)?pixhost\.org$/,
    ],
    path: /^\/show\//,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe, #ad');
    let o = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#all');
    if (o) {
      o.style.display = '';
    }
    o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#show_image, #image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(o.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^crd\.ht$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.continue > form > input[name=link]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.value);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://cubeupload.com/im/*',
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.galleryBigImg');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^dailyss\.net$/,
      /daily-img\.com$/,
      /img-365\.com$/,
      /^365-img\.com$/,
      /^i\.hentai-ddl\.org$/,
      /^imghost\.top$/,
    ],
    path: /^\/image\/.+$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#image-viewer-container img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^xxx\.porn0day\.com$/,
    path: /^\/image\/.+$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('link[rel^=image_src]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^depic\.me$/,
      /^(www\.)?picamatic\.com$/,
    ],
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#pic');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^img(dino|tiger|zap)\.com$/,
    path: /^\/viewer\.php$/,
    query: /^\?file=/,
  },
  async ready () {
    const o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#cursor_lupa');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(o.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://*.directupload.net/file/*.htm',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#ImgFrame');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ehdwallpapers\.org$/,
    path: /^\/images\/.*$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.entry-content.clearfix img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: [
        /^(emptypix|imgdomino)\.com$/,
        /^overdream\.cz$/,
        /^www\.sexseeimage\.com$/,
      ],
      path: /^\/image\//,
    },
    {
      host: /^10\.imageleon\.com$/,
      path: /^\/img-(.+)\.html$/,
    },
  ],
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#full_image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^sexyxpixels\.com$/,
    query: /^\?v=/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#full_image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src, {
      referer: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^fastpic\.ru$/,
    path: /^\/view\//,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#picContainer #image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src, {
      referer: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.fotolink.su/v.php?id=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#content img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.fotosik.pl/pokaz_obrazek/pelny/*.html',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('a.noborder img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^freakimage\.com$/,
      /^www\.hostpic\.org$/,
    ],
    path: /^\/view\.php$/,
    query: /^\?filename=([^&]+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/images/' + m.query[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?freeimgup\.com$/,
    path: /^\/xxx\//,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#mainimage');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://funkyimg.com/viewer.php?img=*',
    'http://funkyimg.com/view/*',
  ],
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#viewer img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?gallery(nova|sense)\.se$/,
    path: /^\/site\/v\//,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#myUniqueImg').parentNode;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?gallerynova\.se$/,
    path: /^\/site\/viewImage\/(\w+)/,
  },
  async ready (m) {
    const confirm = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].searchFromScripts(/\$\("#confirmImage"\).val\("([^"]+)"\)/)[1];
    const rawJson = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post('/site/viewConfirmCode/' + m.path[1], {
      confirm,
    });
    const json = JSON.parse(rawJson);
    const decodedHTML = document.createTextNode(json.content).data;
    const imgURL = decodedHTML.match(/<a href="([^"]+)" target="_blank">/)[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(imgURL);
  },
});
(function () {
  const hostRule = /^goimagehost\.com$/;
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRule,
      path: /^\/xxx\/images\//,
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRule,
      path: /^\/xxx\/(.+)/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/xxx/images/' + m.path[1]);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: hostRule,
      query: /^\?v=(.+)/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/xxx/images/' + m.query[1]);
    },
  });
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.(h-animes|adultmove)\.info/,
    path: /^\/.+\/.+\/.+\.html$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.dlbutton2 > a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://hentaimg.com/mg/lndex-1.php?img=*',
  async ready () {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('index-1.php' + window.location.search);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://hentaimg.com/mg/index-1.php?img=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#content img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.hostingpics.net/viewer.php?id=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img_viewer');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://ifotos.pl/zobacz/*',
  async ready () {
    const m = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('meta[property="og:image"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(m.content);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^ima\.so$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#image_block a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://image18.org/show/*',
    'http://screenlist.ru/details.php?image_id=*',
    'http://www.imagenetz.de/*/*.html',
  ],
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#picture');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^image2you\.ru$/,
    path: /^\/\d+\/\d+/,
  },
  async ready () {
    const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('div.t_tips2 div > img');
    if (!i) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('', {
        post: {
          _confirm: '',
        },
      });
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://imagearn.com/image.php?id=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.imagebam.com/image/*',
  async ready () {
    const o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.image-container img[id]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(o.src, {
      replace: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^imageheli\.com$/,
      /^imgtube\.net$/,
      /^pixliv\.com$/,
    ],
    path: /^\/img-([a-zA-Z0-9-]+)\..+$/,
  },
  async ready () {
    const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('a[rel="lightbox"]');
    if (!a) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('', {
        post: {
          browser_fingerprint: '',
          ads: '0',
        },
      });
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.imagehousing.com/image/*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('td.text_item img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://imageno.com/*.html',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#image_div img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://imagepix.org/image/*.html',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img[border="0"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^www\.imageporter\.com$/,
      path: /^\/\w{12}\/.*\.html$/,
    },
    ready: run,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^(www\.)?(image(carry|dunk|porter|switch)|pic(leet|turedip|tureturn)|imgspice)\.com|(piclambo|yankoimages)\.net$/,
    },
    ready: run,
  });
  async function run () {
    const o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#download_box img[id]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(o.src);
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    {
      host: /^imagescream\.com$/,
      path: /^\/img\/(soft\/)?/,
    },
    {
      host: /^(www\.)?(picturescream|picturevip)\.com$/,
      path: /^\/x\//,
    },
    {
      host: [
        /^picturescream\.asia$/,
        /^uploadimage\.eu$/,
      ],
    },
    {
      host: /^postscreens\.info/,
      path: /^\/.*/,
    },
  ],
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#shortURL-content img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^(imagescream|anonpic)\.com$/,
      /^all-poster\.ru$/,
    ],
    query: /^\?v=/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#imagen img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^bunnyforum\.org$/,
    query: /^\?v=/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img[title^=Click]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
(function () {
  const host = /^imageshack\.us$/;
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: host,
      path: /^\/photo\/.+\/(.+)\/([^/]+)/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(`/f/${m.path[1]}/${m.path[2]}/`);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: host,
      path: /^\/f\/.+\/[^/]+/,
    },
    async ready () {
      const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#fullimg');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
    },
  });
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://imageshost.ru/photo/*/id*.html',
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#bphoto a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: [
      {
        host: [
          /^www\.(freebunker|imgcarry|imgshots)\.com$/,
          /^www\.imagesnake\.(com|org)$/,
        ],
        path: /^\/show\.php$/,
        query: /^\?/,
      },
      {
        host: /^www\.(freebunker|imgshots)\.com$/,
        path: /^\/show\//,
      },
      {
        host: [
          /^www\.imagesnake\.(com|org)$/,
          /^www\.imagefruit\.com$/,
        ],
        path: /^\/(img|show)\/.+/,
      },
      {
        host: /^imageban\.(ru|net)$/,
        path: /^\/show\/\d{4}\/\d{2}\/\d{2}\/.+/,
      },
      'http://fotoo.pl/show.php?img=*.html',
      {
        host: /^www\.(fotoszok\.pl|imagestime)\.com$/,
        path: /^\/show\.php\/.*\.html$/,
      },
    ],
    ready: run,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^www\.imgcarry\.com$/,
      path: /^\/show\//,
    },
    ready: run2,
  });
  async function run () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img_obj');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {
      referer: true,
    });
  }
  async function run2 () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img_obj');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {
      replace: true,
    });
  }
})();
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imagenpic\.com$/,
      path: /^\/.*\/.+\.html?$/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(run, true),
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imagecherry\.com$/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(run, true),
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imagetwist\.com$/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(run, false),
  });
  async function run (rp) {
    if (__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.jQuery) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.jQuery.prototype.append = undefined;
    }
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.pic');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {
      replace: rp,
    });
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://imageupper.com/i/?*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://*.imagevenue.com/img.php?*',
    'http://hotchyx.com/d/adult-image-hosting-view-08.php?id=*',
    'http://www.hostingfailov.com/photo/*',
  ],
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#thepic');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imagezilla\.net$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#photo');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {
      referer: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imagik\.fr$/,
    path: /^\/view(-rl)?\/(.+)/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/uploads/' + m.path[2]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://img.3ezy.net/*.htm',
  async ready () {
    const l = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('link[rel="image_src"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(l.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://img1.imagilive.com/*/*',
  async ready () {
    const a = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#page a.button');
    if (a) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
      return;
    }
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#page > img:not([id])');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^img24\.org$/,
  },
  async ready () {
    let f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.img-polaroid + form');
    if (f) {
      f.submit();
      return;
    }
    f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.img-polaroid');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(f.src, {
      referer: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^img3x\.net$/,
  },
  async ready () {
    let f = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('form');
    if (f) {
      f.submit();
      return;
    }
    f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#show_image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(f.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.img(babes|flare)\.com$/,
  },
  async ready () {
    let i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('input[onclick]');
    if (i) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.Decode();
      return;
    }
    i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#this_image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imgbar\.net$/,
    path: /^\/img_show\.php$/,
    query: /^\?view_id=/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('center img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imgbar\.net$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div.panel.top form input[name=sid]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('/img_show.php?view_id=' + i.value);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imgbin\.me$/,
    path: /^\/view\/([A-Z]+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(`/image/${m.path[1]}.jpg`);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imgbox\.com$/,
    path: /^\/[\d\w]+$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^img(fantasy|leech|\.pornleech|smile|nemo|sense|curl)\.com$/,
        /^(imagedomino|lovechix|imagebic)\.com$/,
        /^0img\.net$/,
        /^daily-img\.com$/,
        /^picangel\.in$/,
        /^bunnyforum\.org$/,
      ],
      query: /^\?[pv]=/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(helper, false),
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imgsay\.com$/,
      query: /^\?[pv]=/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(helper, true),
  });
  async function helper (doReplace) {
    if (__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.confirmAge) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.confirmAge(1);
      return;
    }
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#container-home img[onclick]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {
      replace: doReplace,
    });
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imglocker\.com$/,
    path: [
      /^(\/\w+)\/(.+)\.html$/,
      /^(\/\w+)\/(.+)$/,
    ],
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(`//img.imglocker.com${m.path[1]}_${m.path[2]}`);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^imgnova\.xyz$/,
      /^www\.hentai-hot\.xyz$/,
      /^www\.hentai-king\.online$/,
    ],
    path: /^\/i\/.+\.php$/,
    query: /f=(.+)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('f/' + m.query[1]);
  },
});
(function () {
  const PATH_RULE = /^\/([0-9a-zA-Z-]+)(\.|\/|$)/;
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^img(universal|paying|mega|zeus|monkey|trex|ve|dew|diamond)\.com$/,
        /^(www\.)?imgsee\.me$/,
        /^img(click|maid)\.net$/,
        /^(uploadrr|imageeer|imzdrop|www\.uimgshare|pic-maniac|hulkimge)\.com$/,
        /^imgdrive\.co$/,
        /^cuteimg\.cc$/,
        /^img(tiger|gold)\.org$/,
        /^myimg\.club$/,
        /^foxyimg\.link$/,
        /^(core|iron)img\.net$/,
      ],
      path: PATH_RULE,
    },
    async ready (m) {
      await helper(m.path[1], getNext1);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^imgview\.net$/,
        /^img(maze|outlet)\.com$/,
      ],
      path: PATH_RULE,
    },
    async ready () {
      const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.pic');
      if (i) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
        return;
      }
      const d = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div[id^="imageviewi"]');
      const node = await waitDOM(d, (node) => {
        return node.nodeName === 'FORM' && __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('input[name="id"]', node);
      });
      node.submit();
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^imgtown\.net$/,
        /^imgrock\.info$/,
      ],
      path: PATH_RULE,
    },
    async ready () {
      const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.picview');
      if (i) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
        return;
      }
      const node = await getAmbiguousForm('div center + div[id]');
      node.click();
      node.click();
      node.click();
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imgoutlet\.co$/,
      path: PATH_RULE,
    },
    async ready () {
      const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.pic');
      if (i) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
        return;
      }
      const node = getAmbiguousForm('.inner > center > div[id]');
      node.submit();
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^chronos\.to$/,
      path: PATH_RULE,
    },
    async ready (m) {
      await helper(m.path[1], getNext2);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imgfiles\.org$/,
      path: PATH_RULE,
    },
    async ready () {
      const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.pic');
      if (i) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
        return;
      }
      const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form');
      f.submit();
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: 'http://imgview.net/tpind.php',
    async ready () {
      const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.pic');
      if (i) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {replace: true});
        return;
      }
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(500);
      let d = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div[id^="imageviewi"] input[type="submit"][style=""]');
      d = d.parentNode;
      d.submit();
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: /^http:\/\/imgdragon\.com\/(getfil\.php|dl)$/,
    async ready () {
      const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.pic');
      if (i) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
        return;
      }
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(500);
      const f = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#ContinueFRM');
      f.submit();
    },
  });
  function waitDOM (element, fn) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type !== 'childList') {
            return;
          }
          const [k, , r] = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].find(mutation.addedNodes, (child) => {
            return fn(child) ? child : __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none;
          });
          if (k === __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].none) {
            return;
          }
          observer.disconnect();
          resolve(r);
        });
      });
      observer.observe(element, {
        childList: true,
      });
    });
  }
  async function getAmbiguousForm (selector) {
    const d = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])(selector);
    let visibleClasses = null;
    let button = null;
    await waitDOM(d, (node) => {
      if (button) {
        return true;
      }
      if (node.nodeName === 'STYLE') {
        visibleClasses = parseStyle(node);
        return false;
      }
      if (node.nodeName === 'FORM' && node.offsetParent !== null) {
        return visibleClasses.some((class_) => {
          const isVisible = node.classList.contains(class_);
          if (!isVisible) {
            return false;
          }
          button = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('input[type="button"]', node);
          if (!button) {
            return false;
          }
          return true;
        });
      }
      return false;
    });
    return button;
  }
  function parseStyle (style) {
    style = style.textContent;
    const pattern = /\.(\w+)\{visibility:initial;\}/g;
    let rv = null;
    const classes = [];
    while ((rv = pattern.exec(style)) !== null) {
      classes.push(rv[1]);
    }
    return classes;
  }
  function getNext1 (i) {
    return i.value;
  }
  function getNext2 (i) {
    let next = i.onclick && i.onclick.toString().match(/value='([^']+)'/);
    if (next) {
      next = next[1];
      return next;
    } else {
      return i.value;
    }
  }
  async function helper (id, getNext) {
    const recaptcha = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#recaptcha_widget, #captcha');
    if (recaptcha) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('stop because recaptcha');
      return;
    }
    let i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('input[name="next"]');
    if (i) {
      const next = getNext(i);
      await go(id, Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[name="pre"]').value, next);
      return;
    }
    i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img.pic');
    if (i) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
      return;
    }
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('do nothing');
  }
  async function go (id, pre, next) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink('', {
      post: {
        op: 'view',
        id: id,
        pre: pre,
        next: next,
        adb: '0',
      },
    });
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(imgsure|picexposed|croea)\.com$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.pic');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://imgtheif.com/image/*.html',
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('div.content-container a');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imgtorrnt\.in$/,
    path: /^\/view\.php$/,
    query: /^\?id=.*/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('center div table.tg tbody tr td center img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^imgvault\.pw$/,
    path: /^\/view-image\//,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('article div.span7 a[target="_blank"]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://ipic.su/?page=img&pic=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#fz');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^javcity\.com$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.entry-content > h1:nth-child(1) > a:nth-child(1)');
    let url = a.onclick.toString();
    url = url.match(/window\.open\('([^']+)'\)/);
    if (!url) {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].info('pattern changed');
      return;
    }
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(url[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^keptarolo\.hu$/,
    path: /^(\/[^/]+\/[^/]+\.jpg)$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('http://www.keptarolo.hu/kep' + m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^lostpic\.net$/,
    query: /^\?photo=\d+$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.notinline.circle');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
(function () {
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^(hentai-hosting|miragepics|funextra\.hostzi|imgrex|cdn\.javtotal|img3x)\.com$/,
        /^bilder\.nixhelp\.de$/,
        /^imagecurl\.(com|org)$/,
        /^imagevau\.eu$/,
        /^img\.deli\.sh$/,
        /^img(dream|soo|nm|silo)\.net$/,
        /^imgsicily\.it$/,
        /^www\.imghere\.net$/,
      ],
      path: /^\/viewer\.php$/,
      query: /file=([^&]+)/,
    },
    start: helper,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^(dwimg|imgsin)\.com$/,
        /^www\.pictureshoster\.com$/,
      ],
      path: /^\/viewer\.php$/,
      query: /file=([^&]+)/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/files/' + m.query[1]);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^img(nip|central|cream)\.com$/,
        /^imageview\.me$/,
        /^244pix\.com$/,
        /^postimg\.net$/,
      ],
      path: /^\/viewerr.*\.php$/,
      query: /file=([^&]+)/,
    },
    start: helper,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: [
      'http://www.overpic.net/viewer.php?file=*',
    ],
    async ready () {
      const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#main_img');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^dumppix\.com$/,
      path: /^\/viewer\.php$/,
      query: /file=([^&]+)/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/images/' + m.query[1], {
        referer: true,
      });
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^xxxhost\.me$/,
      path: /^\/viewer\d+\.php$/,
      query: /file=([^&]+)/,
    },
    async start (m) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('files/' + m.query[1]);
    },
  });
  async function helper (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/images/' + m.query[1]);
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.mrjh\.org$/,
    path: /^\/gallery\.php$/,
    query: /^\?entry=(.+)$/,
  },
  async ready (m) {
    const url = m.query[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage('/' + url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.noelshack\.com$/
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#elt_to_aff');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://pic-money.ru/*.html',
  async ready () {
    const f = document.forms[0];
    const sig = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[name="sig"]', f).value;
    const pic_id = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[name="pic_id"]', f).value;
    const referer = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('input[name="referer"]', f).value;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(`/pic.jpeg?pic_id=${pic_id}&sig=${sig}&referer=${referer}`);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.pic-upload.de/view-*.html',
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('.advert');
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img.preview_picture_2b, img.original_picture_2b');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pic(2profit|p2)\.com$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('form > #d1 ~ input[name=bigimg]');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.value);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pic(4|5)you\.ru$/,
  },
  async ready () {
    if (__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#d1 > img') != null) {
      const URLparams = location.href.split('/', 5);
      let next = URLparams.join('/');
      next = next + '/1/';
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].setCookie('p4yclick', '1');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(next);
    } else {
      const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#d1 img').src;
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i);
    }
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?piccash\.net$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.container > img');
    const m = i.onclick.toString().match(/mshow\('([^']+)'\);/);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(m[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://amateurfreak.org/share-*.html',
    'http://amateurfreak.org/share.php?id=*',
    'http://images.maxigame.by/share-*.html',
    'http://picfox.org/*',
    'http://www.euro-pic.eu/share.php?id=*',
    'http://www.gratisimage.dk/share-*.html',
    'http://xxx.freeimage.us/share.php?id=*',
    'http://npicture.net/share-*.html',
    'http://www.onlinepic.net/share.php?id=*',
    'http://www.pixsor.com/share.php?id=*',
    'http://www.pixsor.com/share-*.html',
    'http://pixsor.com/XXX/share-*.html',
    'http://holdthemoan.net/x/share-*.html',
    'http://imgurx.net/x/share-*.html',
    'http://www.imgz.pw/share-*.html',
  ],
  async ready () {
    const o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#iimg');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(o.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://picmoe.net/d.php?id=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: [
    'http://pics-money.ru/allpicfree/*',
    'http://www.pics-money.ru/allimage/*',
  ],
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pics-money\.ru$/,
    path: /^\/v\.php$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('center img:not([id])');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^www\.pics-money\.ru$/,
      /^p0xpicmoney\.ru$/,
    ],
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
    let i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#d1 img, #pay_thumb_img > img');
    i = i.onclick.toString();
    i = i.match(/mshow\('(.+)'\)/);
    i = i[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://picshare.geenza.com/pics/*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#picShare_image_container');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^picstream\.tv$/,
    path: /^\/.*\/.*\.html$/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#view1 > div:nth-child(1) > img:nth-child(1)');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?pimpandhost\.com$/,
    path: /^\/image\//,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#image_original');
    const el = document.createElement('div');
    el.innerHTML = a.value;
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img', el);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pixhub\.eu$/,
  },
  async ready () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe, .adultpage, #FFN_Banner_Holder');
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.image-show img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(www\.)?pixroute\.com$/
  },
  async ready () {
    const o = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('.fr4me > div:nth-child(20) > a:nth-child(1) > img:nth-child(1)');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(o.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: [
      /^www\.pixsense\.net$/,
      /^www\.imagespicy\.site$/,
    ],
    path: /^\/site\/v\/\d+$/,
  },
  async ready () {
    const a = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#myUniqueImg').parentNode;
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(a.href);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pixxxels\.org$/,
  },
  async ready () {
    const img = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#main-image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.dataset.full);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.pornimagex\.com$/,
    path: /^\/image\/.*$/,
  },
  async ready () {
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#fixed img.border2px');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(img.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^prntscr\.com$/,
    path: /\.html$/,
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^prntscr\.com$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#screenshot-image');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^pronpic\.org$/,
  },
  async ready () {
    const urlBaseImg = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('table.new_table2:nth-child(1) img.link');
    const baseUrl = urlBaseImg.src.split('th_')[0];
    const img = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('table.new_table2:nth-child(2) img.link');
    const url = baseUrl + img.src.split('th_')[1];
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(url);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^(qrrro|greenpiccs)\.com$/,
    path: /^(\/images\/.+)\.html$/,
  },
  async start (m) {
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(m.path[1]);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^radikal\.ru$/,
    path: /^\/big\//,
  },
  async ready () {
    const i = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('.base-page_center > div:nth-child(2) > img:nth-child(1)');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
(function () {
  const defaultAction = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(action, '#continuetoimage > form input', 'img[class^=centred]');
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: [
      {
        host: [
          /^image(ontime|corn|picsa|horse|decode)\.com$/,
          /^(zonezeed|zelje|croft|myhot|bok|hostur|greasy|dam)image\.com$/,
          /^img(icy|next|savvy|\.spicyzilla|twyti|xyz|devil|tzar|ban|pu|beer|wet|tornado|kicks|nimz|binbou|2share|22|cover|hit|main|trial|blank|reputa|fapper|reality|part)\.com$/,
          /^(i\.)?imgseeds?\.com$/,
          /^img-(zone|planet|pay|uploads)\.com$/,
          /^www\.img(blow|lemon|4sharing)\.com$/,
          /^www\.imagefolks\.com$/,
          /^www\.freephotohostin\.com$/,
          /^(www\.)?imgult\.com$/,
          /^xxx(imagenow|screens)\.com$/,
          /^xxxsparrow?\.com$/,
          /^xxxwebdlxxx\.org$/,
          /^(playimg|picstwist|ericsony|wpc8|uplimg|lexiit|thumbnailus|newimagepost|fapingpics|dimtus|tinizo)\.com$/,
          /^((i|hentai)\.)?imgslip\.com$/,
          /^(i|xxx)\.hentaiyoutube\.com$/,
          /^(go|er)imge\.com$/,
          /^(like\.)?08lkk\.com$/,
          /^nim(plus|zshare)\.com$/,
          /^nudeximg\.com$/,
          /^img(serve|coin|fap|candy|master|-view|run|boom|project|python|pics|pix)\.net$/,
          /^(imagesouls|naughtygate|gallerycloud|imagelaser|picture-bang|project-photo|pix-link|funimg|golfpit|xximg)\.net$/,
          /^(shot|adult)img\.org$/,
          /^image(\.adlock|on|team)\.org$/,
          /^(voyeur|drag|teen|mega)image\.org$/,
          /^teenshot\.org$/,
          /^img(studio|spot)\.org$/,
          /^www\.hotimage\.uk$/,
          /^hotimages\.eu$/,
          /(^|\.)55888\.eu$/,
          /^img(cloud|mag)\.co$/,
          /^pixup\.us$/,
          /^(bulkimg|photo-up|myimg|pop-img|img-pop|ads-img)\.info$/,
          /^vava\.in$/,
          /^(pixxx|picspornfree|imgload|fapat)\.me$/,
          /^(domaink|pic2pic|porno-pirat|24aconstii|loftlm|18pron|imgplus)\.ru$/,
          /^imgease\.re$/,
          /^(goimg|xxx\.pornscreen)\.xyz$/,
          /^(pic2pic|picz)\.site$/,
          /^darpix\.ga$/,
          /^sxpics\.nl$/,
          /^darpix\.desi$/,
          /^pic4you\.top$/,
          /^imgsen\.se$/,
          /^ipicture\.su$/,
          /^acidimg\.cc$/,
          /^s\.imghost\.top$/,
        ],
        path: /^\/img-.*\.html/,
      },
      {
        host: [
          /^img(run|twyti)\.net$/,
          /^imgtwyti\.com$/,
          /^hentai-(pop|baka)\.com$/,
          /^star-hentai\.com$/,
          /^(jav|img)-hentai\.host$/,
          /^hentai-king\.host$/,
          /^img-king\.xyz$/,
        ],
        path: /^\/[ti]\/img-.*\.html/,
      },
      {
        host: /^imgking\.co$/,
        path: /^\/img4?-.*\.html/,
      },
      {
        host: /^imgbb\.net$/,
        path: /^\/.-.+$/,
      },
      {
        host: /^cdn\.javtotal\.com$/,
        path: /^\/img\/.+$/,
      },
      {
        host: /^imgtor\.pw$/,
        path: /^\/img2\/.+$/,
      },
      {
        host: /^ima\.gy$/,
        path: /^\/i\/.+$/,
      },
    ],
    ready: defaultAction,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imgtor\.pw$/,
      path: /^\/img\/.*$/,
    },
    async start (m) {
      const imageUrl = 'http://' + m.host[0] + m.path[0].replace('img', 'img2');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openLink(imageUrl);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imgrat\.com$/,
      path: /^\/img-.*\.html/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(action, '#close', '#main_image img.center-block.img-responsive'),
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^imageporn\.eu$/,
        /^imgzizi\.xyz$/,
      ],
      path: /^\/img-.*\.html/,
    },
    async start () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.document.createElement = null;
    },
    ready: defaultAction,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: [
        /^(www\.)?img(adult|wallet|taxi)\.com$/,
        /^(www\.)?imgdrive\.net$/,
      ],
      path: /^\/img-.*\.html$/,
    },
    async ready () {
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe');
      let node = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#continuetoimage > form input');
      if (node) {
        node.click();
        node.click();
        return;
      }
      __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].resetCookies();
      node = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('img[class^=centred]');
      if (node) {
        await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(node.src);
        return;
      }
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].post(window.location.href.toString(), {
        cti: 1,
        ref: '',
        rc: 1,
        rp: 1,
        bt: 0,
        bw: 'edge',
      });
      window.location.reload();
    },
  });
  async function helper () {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.setTimeout = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].nop;
    const data = await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].get(window.location.toString());
    return __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].toDOM(data);
  }
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^08lkk\.com$/,
      path: /^\/Photo\/img-.+\.html$/,
    },
    async start () {
      const page = await helper();
      const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img[class^=centred]', page);
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^08lkk\.com$/,
      path: /^\/\d+\/img-.*\.html$/,
    },
    async start () {
      const page = await helper();
      let bbcode = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$('#imagecodes input', page);
      bbcode = bbcode.value.match(/.+\[IMG\]([^[]+)\[\/IMG\].+/);
      bbcode = bbcode[1];
      bbcode = bbcode.replace('small', 'big');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(bbcode);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: [
      {
        host: /^imgking\.co$/,
        path: /^\/imgs-.*\.html/,
      },
      {
        host: [
          /^img(kings|prime)\.com$/,
          /^imagerar\.com$/,
        ],
        path: /^\/img-.*\.html/,
      },
    ],
    async ready () {
      const url = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].window.linkid;
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(url);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^imgkings\.com$/,
      path: /^\/img2-.*\.html/,
    },
    ready: defaultAction,
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: [
      {
        host: /^imagerar\.com$/,
        path: /^\/img2-/,
      },
      {
        host: /^imgking\.co$/,
        path: /^\/img[v3]-.*\.html/,
      },
      {
        host: /^imgprime\.com$/,
        path: /^\/img3-.*\.html$/,
      },
    ],
    async ready () {
      const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img[alt]');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
    },
  });
  __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
    rule: {
      host: /^img\.yt$/,
      path: /^\/img-.*\.html/,
    },
    ready: __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].partial(action, '#continuebutton, #continuetoimage input[type="submit"]', 'img[class^=centred]'),
  });
  async function action (firstSelector, secondSelector) {
    __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].remove('iframe, #adblock_detect, .popupOverlay');
    const node = __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].$(firstSelector);
    if (node) {
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(500);
      node.removeAttribute('disabled');
      await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].wait(500);
      node.focus();
      node.click();
      node.click();
      node.click();
      return;
    }
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])(secondSelector);
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  }
})();
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://www.subirimagenes.com/*.html',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#ImagenVisualizada');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://tinypic.com/view.php?pic=*',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#imgElement');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^www\.turboimagehost\.com$/,
    path: /^\/p\//,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('#imageid');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: 'http://vvcap.net/db/*.htp',
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src, {
      replace: true,
    });
  },
});
__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["b" ].register({
  rule: {
    host: /^x\.pixfarm\.net$/,
    path: /^\/sexy\/\d+\/\d+\/.+\.html$/,
  },
  async ready () {
    const i = Object(__WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ])('img');
    await __WEBPACK_IMPORTED_MODULE_0__ADSBYPASSER_NAMESPACE___["a" ].openImage(i.src);
  },
});
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "b", function() { return _; });
 __webpack_require__.d(__webpack_exports__, "a", function() { return $; });
 var __WEBPACK_IMPORTED_MODULE_0_util_ajax__ = __webpack_require__(11);
 var __WEBPACK_IMPORTED_MODULE_1_util_cookie__ = __webpack_require__(12);
 var __WEBPACK_IMPORTED_MODULE_2_util_core__ = __webpack_require__(0);
 var __WEBPACK_IMPORTED_MODULE_3_util_dispatcher__ = __webpack_require__(3);
 var __WEBPACK_IMPORTED_MODULE_4_util_dom__ = __webpack_require__(4);
 var __WEBPACK_IMPORTED_MODULE_5_util_image__ = __webpack_require__(13);
 var __WEBPACK_IMPORTED_MODULE_6_util_link__ = __webpack_require__(5);
 var __WEBPACK_IMPORTED_MODULE_7_util_logger__ = __webpack_require__(2);
 var __WEBPACK_IMPORTED_MODULE_8_util_misc__ = __webpack_require__(6);
 var __WEBPACK_IMPORTED_MODULE_9_util_platform__ = __webpack_require__(1);
const _ = {
  AdsBypasserError: __WEBPACK_IMPORTED_MODULE_2_util_core__["a" ],
  find: __WEBPACK_IMPORTED_MODULE_2_util_core__["c" ],
  forEach: __WEBPACK_IMPORTED_MODULE_2_util_core__["d" ],
  generateRandomIP: __WEBPACK_IMPORTED_MODULE_8_util_misc__["a" ],
  info: __WEBPACK_IMPORTED_MODULE_7_util_logger__["a" ],
  none: __WEBPACK_IMPORTED_MODULE_2_util_core__["g" ],
  partial: __WEBPACK_IMPORTED_MODULE_2_util_core__["i" ],
  register: __WEBPACK_IMPORTED_MODULE_3_util_dispatcher__["b" ],
  tryEvery: __WEBPACK_IMPORTED_MODULE_2_util_core__["j" ],
  wait: __WEBPACK_IMPORTED_MODULE_2_util_core__["k" ],
  warn: __WEBPACK_IMPORTED_MODULE_7_util_logger__["b" ],
};
function $ (selector, context) {
  return Object(__WEBPACK_IMPORTED_MODULE_4_util_dom__["b" ])(selector, context);
}
$.$ = __WEBPACK_IMPORTED_MODULE_4_util_dom__["d" ];
$.$$ = __WEBPACK_IMPORTED_MODULE_4_util_dom__["c" ];
$.block = __WEBPACK_IMPORTED_MODULE_4_util_dom__["a" ];
$.get = __WEBPACK_IMPORTED_MODULE_0_util_ajax__["a" ];
$.getCookie = __WEBPACK_IMPORTED_MODULE_1_util_cookie__["a" ];
$.nuke = __WEBPACK_IMPORTED_MODULE_8_util_misc__["b" ];
$.openImage = __WEBPACK_IMPORTED_MODULE_5_util_image__["a" ];
$.openLink = __WEBPACK_IMPORTED_MODULE_6_util_link__["a" ];
$.post = __WEBPACK_IMPORTED_MODULE_0_util_ajax__["b" ];
$.remove = __WEBPACK_IMPORTED_MODULE_4_util_dom__["e" ];
$.removeAllTimer = __WEBPACK_IMPORTED_MODULE_8_util_misc__["c" ];
$.resetCookies = __WEBPACK_IMPORTED_MODULE_1_util_cookie__["b" ];
$.searchFromScripts = __WEBPACK_IMPORTED_MODULE_4_util_dom__["f" ];
$.setCookie = __WEBPACK_IMPORTED_MODULE_1_util_cookie__["c" ];
$.toDOM = __WEBPACK_IMPORTED_MODULE_4_util_dom__["g" ];
$.window = __WEBPACK_IMPORTED_MODULE_9_util_platform__["c" ];
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return get; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return post; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
 var __WEBPACK_IMPORTED_MODULE_1_util_platform__ = __webpack_require__(1);
class AjaxError extends __WEBPACK_IMPORTED_MODULE_0_util_core__["a" ] {
  constructor (method, url, data, headers, status, response) {
    super(`${method} ${url} got ${status}`);
    this._method = method;
    this._url = url;
    this._data = data;
    this._headers = headers;
    this._status = status;
    this._response = response;
  }
  get name () {
    return 'AjaxError';
  }
  get method () {
    return this._method;
  }
  get url () {
    return this._url;
  }
  get data () {
    return this._data;
  }
  get headers () {
    return this._headers;
  }
  get status () {
    return this._status;
  }
  get response () {
    return this._response;
  }
}
function deepJoin (prefix, object) {
  const keys = Object.getOwnPropertyNames(object);
  const mapped = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["f" ])(keys, (k) => {
    const v = object[k];
    const key = `${prefix}[${k}]`;
    if (typeof v === 'object') {
      return deepJoin(key, v);
    }
    const tmp = [key, v].map(encodeURIComponent);
    return tmp.join('=');
  });
  return mapped.join('&');
}
function toQuery (data) {
  const type = typeof data;
  if (data === null || (type !== 'string' && type !== 'object')) {
    return '';
  }
  if (type === 'string') {
    return data;
  }
  if (data instanceof String) {
    return data.toString();
  }
  const keys = Object.getOwnPropertyNames(data);
  return Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["f" ])(keys, (k) => {
    const v = data[k];
    if (typeof v === 'object') {
      return deepJoin(k, v);
    }
    const tmp = [k, v].map(encodeURIComponent);
    return tmp.join('=');
  }).join('&');
}
function ajax (method, url, data, headers) {
  const l = document.createElement('a');
  l.href = url;
  const reqHost = l.hostname;
  const overrideHeaders = {
    Host: reqHost || window.location.host,
    Origin: window.location.origin,
    Referer: window.location.href,
    'X-Requested-With': 'XMLHttpRequest',
  };
  Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["d" ])(overrideHeaders, (v, k) => {
    if (headers[k] === __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ]) {
      delete headers[k];
    } else {
      headers[k] = v;
    }
  });
  if (data) {
    if (headers['Content-Type'].indexOf('json') >= 0) {
      data = JSON.stringify(data);
    } else {
      data = toQuery(data);
    }
    headers['Content-Length'] = data.length;
  }
  return new Promise((resolve, reject) => {
    __WEBPACK_IMPORTED_MODULE_1_util_platform__["a" ].xmlHttpRequest({
      method: method,
      url: url,
      data: data,
      headers: headers,
      onload (response) {
        response = (typeof response.responseText !== 'undefined') ? response : this;
        if (response.status !== 200) {
          reject(new AjaxError(method, url, data, headers, response.status, response.responseText));
        } else {
          resolve(response.responseText);
        }
      },
      onerror (response) {
        response = (typeof response.responseText !== 'undefined') ? response : this;
        reject(new AjaxError(method, url, data, headers, response.status, response.responseText));
      },
    });
  });
}
function get (url, data, headers) {
  data = toQuery(data);
  data = data ? '?' + data : '';
  headers = headers || {};
  return ajax('GET', url + data, '', headers);
}
function post (url, data, headers) {
  const h = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };
  if (headers) {
    Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["d" ])(headers, (v, k) => {
      h[k] = v;
    });
  }
  return ajax('POST', url, data, h);
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "c", function() { return setCookie; });
 __webpack_require__.d(__webpack_exports__, "a", function() { return getCookie; });
 __webpack_require__.d(__webpack_exports__, "b", function() { return resetCookies; });
 var __WEBPACK_IMPORTED_MODULE_0_util_core__ = __webpack_require__(0);
function setCookie (key, value) {
  document.cookie = `${key}=${value};path=${location.pathname};`;
}
function getCookie (key) {
  let [, c,] = Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["c" ])(document.cookie.split(';'), (v) => {
    const k = v.replace(/^\s*([a-zA-Z0-9-_]+)=.+$/, '$1');
    if (k !== key) {
      return __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ];
    }
  });
  if (c === __WEBPACK_IMPORTED_MODULE_0_util_core__["g" ]) {
    return null;
  }
  c = c.replace(/^\s*[a-zA-Z0-9-_]+=([^;]+).?$/, '$1');
  if (!c) {
    return null;
  }
  return c;
}
function resetCookies () {
  const a = document.domain;
  const b = document.domain.replace(/^www\./, '');
  const c = document.domain.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2');
  const d = (new Date(1e3)).toUTCString();
  Object(__WEBPACK_IMPORTED_MODULE_0_util_core__["d" ])(document.cookie.split(';'), (v) => {
    const k = v.replace(/^\s*(\w+)=.+$/, '$1');
    document.cookie = `${k}=;expires=${d};`;
    document.cookie = `${k}=;path=/;expires=${d};`;
    const e = (a, b, c) => `${a}=;path=/;domain=${b};expires=${c};`;
    document.cookie = e(k, a, d);
    document.cookie = e(k, b, d);
    document.cookie = e(k, c, d);
  });
}
 }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
 __webpack_require__.d(__webpack_exports__, "a", function() { return openImage; });
 var __WEBPACK_IMPORTED_MODULE_0_util_link__ = __webpack_require__(5);
 var __WEBPACK_IMPORTED_MODULE_1_util_dom__ = __webpack_require__(4);
 var __WEBPACK_IMPORTED_MODULE_2_util_logger__ = __webpack_require__(2);
 var __WEBPACK_IMPORTED_MODULE_3_util_misc__ = __webpack_require__(6);
 var __WEBPACK_IMPORTED_MODULE_4_util_platform__ = __webpack_require__(1);
async function openImage (imgSrc, options) {
  options = options || {};
  const replace = !!options.replace;
  const referer = !!options.referer;
  if (replace) {
    await replaceBody(imgSrc);
    return;
  }
  const redirectImage = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getValue('redirect_image');
  if (redirectImage) {
    await Object(__WEBPACK_IMPORTED_MODULE_0_util_link__["a" ])(imgSrc, {
      referer: referer,
    });
  }
}
function enableScrolling () {
  const o = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
  o.style.overflow = '';
}
function toggleShrinking () {
  this.classList.toggle('adsbypasser-shrinked');
}
function checkScaling () {
  const nw = this.naturalWidth;
  const nh = this.naturalHeight;
  const cw = document.documentElement.clientWidth;
  const ch = document.documentElement.clientHeight;
  if ((nw > cw || nh > ch) && !this.classList.contains('adsbypasser-resizable')) {
    this.classList.add('adsbypasser-resizable');
    this.classList.add('adsbypasser-shrinked');
    this.addEventListener('click', toggleShrinking);
  } else {
    this.removeEventListener('click', toggleShrinking);
    this.classList.remove('adsbypasser-shrinked');
    this.classList.remove('adsbypasser-resizable');
  }
}
async function scaleImage (i) {
  const siURL = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getResourceUrl('scaleImage');
  appendStyleURL(siURL);
  if (i.naturalWidth && i.naturalHeight) {
    checkScaling.call(i);
  } else {
    i.addEventListener('load', checkScaling);
  }
  let h = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(h);
    h = window.setTimeout(checkScaling.bind(i), 100);
  });
}
async function changeBackground () {
  const bgImage = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getResourceUrl('bgImage');
  document.body.style.backgroundColor = '#222222';
  document.body.style.backgroundImage = `url('${bgImage}')`;
}
async function alignCenter () {
  const acURL = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getResourceUrl('alignCenter');
  appendStyleURL(acURL);
}
function injectStyle (d, i) {
  Object(__WEBPACK_IMPORTED_MODULE_1_util_dom__["e" ])('style, link[rel=stylesheet]');
  d.id = 'adsbypasser-wrapper';
  i.id = 'adsbypasser-image';
}
function appendStyleURL (url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.head.appendChild(link);
}
async function replaceBody (imgSrc) {
  const redirectImage = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getValue('redirect_image');
  if (!redirectImage) {
    return;
  }
  if (!imgSrc) {
    Object(__WEBPACK_IMPORTED_MODULE_2_util_logger__["b" ])('false url');
    return;
  }
  Object(__WEBPACK_IMPORTED_MODULE_2_util_logger__["a" ])(`replacing body with \`${imgSrc}\` ...`);
  Object(__WEBPACK_IMPORTED_MODULE_3_util_misc__["c" ])();
  enableScrolling();
  document.body = document.createElement('body');
  const d = document.createElement('div');
  document.body.appendChild(d);
  const i = document.createElement('img');
  i.src = imgSrc;
  d.appendChild(i);
  const ac = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getValue('align_center');
  const si = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getValue('scale_image');
  if (ac || si) {
    injectStyle(d, i);
  }
  if (ac) {
    await alignCenter();
  }
  const cb = await __WEBPACK_IMPORTED_MODULE_4_util_platform__["a" ].getValue('change_background');
  if (cb) {
    await changeBackground();
  }
  if (si) {
    await scaleImage(i);
  }
}
 })
 ]);