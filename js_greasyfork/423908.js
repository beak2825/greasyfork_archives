// ==UserScript==
// @name         偏见
// @namespace    https://shenzilong.cn/
// @version      0.0.1
// @description  偏见是常态，没有偏见是一种很难做到的事情；可用于知乎彻底拉黑
// @author       崮生 2234839456@qq.com
// @match        *
// @include      *
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @connect      shenzilong.cn
// @downloadURL https://update.greasyfork.org/scripts/423908/%E5%81%8F%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/423908/%E5%81%8F%E8%A7%81.meta.js
// ==/UserScript==
// 这些代码都来自github actions 编译后的代码，不编译版本体积太大，不放心的欢迎去 https://github.com/2234839/userJS 审查代码, 

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./偏见/偏见.user.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ajax-hook/index.js":
/*!*****************************************!*\
  !*** ./node_modules/ajax-hook/index.js ***!
  \*****************************************/
/*! exports provided: hook, unHook, proxy, unProxy */
/*! exports used: proxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _src_xhr_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/xhr-hook */ "./node_modules/ajax-hook/src/xhr-hook.js");
/* harmony import */ var _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/xhr-proxy */ "./node_modules/ajax-hook/src/xhr-proxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 **/





/***/ }),

/***/ "./node_modules/ajax-hook/src/xhr-hook.js":
/*!************************************************!*\
  !*** ./node_modules/ajax-hook/src/xhr-hook.js ***!
  \************************************************/
/*! exports provided: configEvent, hook, unHook */
/*! exports used: configEvent, hook, unHook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return configEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return hook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unHook; });
/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

// Save original XMLHttpRequest as _rxhr
var realXhr = "_rxhr"

function configEvent(event, xhrProxy) {
    var e = {};
    for (var attr in event) e[attr] = event[attr];
    // xhrProxy instead
    e.target = e.currentTarget = xhrProxy
    return e;
}

function hook(proxy) {
    // Avoid double hookAjax
    window[realXhr] = window[realXhr] || XMLHttpRequest

    XMLHttpRequest = function () {
        var xhr = new window[realXhr];
        // We shouldn't hookAjax XMLHttpRequest.prototype because we can't
        // guarantee that all attributes are on the prototype。
        // Instead, hooking XMLHttpRequest instance can avoid this problem.
        for (var attr in xhr) {
            var type = "";
            try {
                type = typeof xhr[attr] // May cause exception on some browser
            } catch (e) {
            }
            if (type === "function") {
                // hookAjax methods of xhr, such as `open`、`send` ...
                this[attr] = hookFunction(attr);
            } else {
                Object.defineProperty(this, attr, {
                    get: getterFactory(attr),
                    set: setterFactory(attr),
                    enumerable: true
                })
            }
        }
        var that = this;
        xhr.getProxy = function () {
            return that
        }
        this.xhr = xhr;
    }

    // Generate getter for attributes of xhr
    function getterFactory(attr) {
        return function () {
            var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
            var attrGetterHook = (proxy[attr] || {})["getter"]
            return attrGetterHook && attrGetterHook(v, this) || v
        }
    }

    // Generate setter for attributes of xhr; by this we have an opportunity
    // to hookAjax event callbacks （eg: `onload`） of xhr;
    function setterFactory(attr) {
        return function (v) {
            var xhr = this.xhr;
            var that = this;
            var hook = proxy[attr];
            // hookAjax  event callbacks such as `onload`、`onreadystatechange`...
            if (attr.substring(0, 2) === 'on') {
                that[attr + "_"] = v;
                xhr[attr] = function (e) {
                    e = configEvent(e, that)
                    var ret = proxy[attr] && proxy[attr].call(that, xhr, e)
                    ret || v.call(that, e);
                }
            } else {
                //If the attribute isn't writable, generate proxy attribute
                var attrSetterHook = (hook || {})["setter"];
                v = attrSetterHook && attrSetterHook(v, that) || v
                this[attr + "_"] = v;
                try {
                    // Not all attributes of xhr are writable(setter may undefined).
                    xhr[attr] = v;
                } catch (e) {
                }
            }
        }
    }

    // Hook methods of xhr.
    function hookFunction(fun) {
        return function () {
            var args = [].slice.call(arguments)
            if (proxy[fun]) {
                var ret = proxy[fun].call(this, args, this.xhr)
                // If the proxy return value exists, return it directly,
                // otherwise call the function of xhr.
                if (ret) return ret;
            }
            return this.xhr[fun].apply(this.xhr, args);
        }
    }

    // Return the real XMLHttpRequest
    return window[realXhr];
}

function unHook() {
    if (window[realXhr]) XMLHttpRequest = window[realXhr];
    window[realXhr] = undefined;
}




/***/ }),

/***/ "./node_modules/ajax-hook/src/xhr-proxy.js":
/*!*************************************************!*\
  !*** ./node_modules/ajax-hook/src/xhr-proxy.js ***!
  \*************************************************/
/*! exports provided: proxy, unProxy */
/*! exports used: proxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return proxy; });
/* unused harmony export unProxy */
/* harmony import */ var _xhr_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xhr-hook */ "./node_modules/ajax-hook/src/xhr-hook.js");
/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */



var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];
var eventLoad = events[0],
    eventLoadEnd = events[1],
    eventTimeout = events[2],
    eventError = events[3],
    eventReadyStateChange = events[4],
    eventAbort = events[5];


var singleton,
    prototype = 'prototype';


function proxy(proxy) {
    if (singleton) throw "Proxy already exists";
    return singleton = new Proxy(proxy);
}

function unProxy() {
    singleton = null
    Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* unHook */ "c"])()
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement('a'));
}

function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = 'on' + name + '_';
    var event = Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* configEvent */ "a"])({type: name}, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if(typeof(Event) === 'function') {
        evt = new Event(name,{bubbles: false});
    } else {
        // https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11
        evt = document.createEvent('Event');
        evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
}


function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
}

Handler[prototype] = Object.create({
    resolve: function resolve(response) {
        var xhrProxy = this.xhrProxy;
        var xhr = this.xhr;
        xhrProxy.readyState = 4;
        xhr.resHeader = response.headers;
        xhrProxy.response = xhrProxy.responseText = response.response;
        xhrProxy.statusText = response.statusText;
        xhrProxy.status = response.status;
        triggerListener(xhr, eventReadyStateChange);
        triggerListener(xhr, eventLoad);
        triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
        this.xhrProxy.status = 0;
        triggerListener(this.xhr, error.type);
        triggerListener(this.xhr, eventLoadEnd);
    }
});

function makeHandler(next) {
    function sub(xhr) {
        Handler.call(this, xhr);
    }

    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
}

var RequestHandler = makeHandler(function (rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
        xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
});

var ResponseHandler = makeHandler(function (response) {
    this.resolve(response);
});

var ErrorHandler = makeHandler(function (error) {
    this.reject(error);
});

function Proxy(proxy) {
    var onRequest = proxy.onRequest,
        onResponse = proxy.onResponse,
        onError = proxy.onError;

    function handleResponse(xhr, xhrProxy) {
        var handler = new ResponseHandler(xhr);
        if (!onResponse) return handler.resolve();
        var ret = {
            response: xhrProxy.response,
            status: xhrProxy.status,
            statusText: xhrProxy.statusText,
            config: xhr.config,
            headers: xhr.resHeader || xhr.getAllResponseHeaders().split('\r\n').reduce(function (ob, str) {
                if (str === "") return ob;
                var m = str.split(":");
                ob[m.shift()] = trim(m.join(':'));
                return ob;
            }, {})
        };
        onResponse(ret, handler);
    }

    function onerror(xhr, xhrProxy, e) {
        var handler = new ErrorHandler(xhr);
        var error = {config: xhr.config, error: e};
        if (onError) {
            onError(error, handler);
        } else {
            handler.next(error);
        }
    }

    function preventXhrProxyCallback() {
        return true;
    }

    function errorCallback(xhr, e) {
        onerror(xhr, this, e);
        return true;
    }

    function stateChangeCallback(xhr, xhrProxy) {
        if (xhr.readyState === 4 && xhr.status !== 0) {
            handleResponse(xhr, xhrProxy);
        } else if (xhr.readyState !== 4) {
            triggerListener(xhr, eventReadyStateChange);
        }
        return true;
    }

    return Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* hook */ "b"])({
        onload: preventXhrProxyCallback,
        onloadend: preventXhrProxyCallback,
        onerror: errorCallback,
        ontimeout: errorCallback,
        onabort: errorCallback,
        onreadystatechange: function (xhr) {
            return stateChangeCallback(xhr, this);
        },
        open: function open(args, xhr) {
            var _this = this;
            var config = xhr.config = {headers: {}};
            config.method = args[0];
            config.url = args[1];
            config.async = args[2];
            config.user = args[3];
            config.password = args[4];
            config.xhr = xhr;
            var evName = 'on' + eventReadyStateChange;
            if (!xhr[evName]) {
                xhr[evName] = function () {
                    return stateChangeCallback(xhr, _this);
                };
            }

            var defaultErrorHandler = function defaultErrorHandler(e) {
                onerror(xhr, _this, Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* configEvent */ "a"])(e, _this));
            };
            [eventError, eventTimeout, eventAbort].forEach(function (e) {
                var event = 'on' + e;
                if (!xhr[event]) xhr[event] = defaultErrorHandler;
            });

            // 如果有请求拦截器，则在调用onRequest后再打开链接。因为onRequest最佳调用时机是在send前，
            // 所以我们在send拦截函数中再手动调用open，因此返回true阻止xhr.open调用。
            //
            // 如果没有请求拦截器，则不用阻断xhr.open调用
            if (onRequest) return true;
        },
        send: function (args, xhr) {
            var config = xhr.config
            config.withCredentials=xhr.withCredentials
            config.body = args[0];
            if (onRequest) {
                // In 'onRequest', we may call XHR's event handler, such as `xhr.onload`.
                // However, XHR's event handler may not be set until xhr.send is called in
                // the user's code, so we use `setTimeout` to avoid this situation
                var req = function () {
                    onRequest(config, new RequestHandler(xhr));
                }
                config.async === false ? req() : setTimeout(req)
                return true;
            }
        },
        setRequestHeader: function (args, xhr) {
            // Collect request headers
            xhr.config.headers[args[0].toLowerCase()] = args[1];
            return true;
        },
        addEventListener: function (args, xhr) {
            var _this = this;
            if (events.indexOf(args[0]) !== -1) {
                var handler = args[1];
                getEventTarget(xhr).addEventListener(args[0], function (e) {
                    var event = Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* configEvent */ "a"])(e, _this);
                    event.type = args[0];
                    event.isTrusted = true;
                    handler.call(_this, event);
                });
                return true;
            }
        },
        getAllResponseHeaders: function (_, xhr) {
            var headers = xhr.resHeader
            if (headers) {
                var header = "";
                for (var key in headers) {
                    header += key + ': ' + headers[key] + '\r\n';
                }
                return header;
            }
        },
        getResponseHeader: function (args, xhr) {
            var headers = xhr.resHeader
            if (headers) {
                return headers[(args[0] || '').toLowerCase()];
            }
        }
    });
}






/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./偏见/视之不见.css":
/*!***********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./偏见/视之不见.css ***!
  \***********************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default.a);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/** 完全不看 */\r\n.-no_see {\r\n  display: none;\r\n}\r\n\r\n/** 折叠到高度只有 5px 的色块 鼠标移上去后可以看到 */\r\n.-px5:not(:hover) {\r\n  box-sizing: border-box;\r\n  height: 5px;\r\n  overflow: hidden;\r\n  padding-top: 0;\r\n  padding-bottom: 0;\r\n  position: relative;\r\n}\r\n.-px5:not(:hover) ::after {\r\n  content: \"\";\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n  width: 100%;\r\n  height: 100%;\r\n  background: rgb(161, 161, 161);\r\n}\r\n", "",{"version":3,"sources":["webpack://./偏见/%E8%A7%86%E4%B9%8B%E4%B8%8D%E8%A7%81.css"],"names":[],"mappings":"AAAA,UAAU;AACV;EACE,aAAa;AACf;;AAEA,gCAAgC;AAChC;EACE,sBAAsB;EACtB,WAAW;EACX,gBAAgB;EAChB,cAAc;EACd,iBAAiB;EACjB,kBAAkB;AACpB;AACA;EACE,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,WAAW;EACX,YAAY;EACZ,8BAA8B;AAChC","sourcesContent":["/** 完全不看 */\r\n.-no_see {\r\n  display: none;\r\n}\r\n\r\n/** 折叠到高度只有 5px 的色块 鼠标移上去后可以看到 */\r\n.-px5:not(:hover) {\r\n  box-sizing: border-box;\r\n  height: 5px;\r\n  overflow: hidden;\r\n  padding-top: 0;\r\n  padding-bottom: 0;\r\n  position: relative;\r\n}\r\n.-px5:not(:hover) ::after {\r\n  content: \"\";\r\n  position: absolute;\r\n  left: 0px;\r\n  top: 0px;\r\n  width: 100%;\r\n  height: 100%;\r\n  background: rgb(161, 161, 161);\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/*! no static exports found */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === 'function') {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/svelte/internal/index.mjs":
/*!************************************************!*\
  !*** ./node_modules/svelte/internal/index.mjs ***!
  \************************************************/
/*! exports provided: HtmlTag, SvelteComponent, SvelteComponentDev, SvelteElement, action_destroyer, add_attribute, add_classes, add_flush_callback, add_location, add_render_callback, add_resize_listener, add_transform, afterUpdate, append, append_dev, assign, attr, attr_dev, beforeUpdate, bind, binding_callbacks, blank_object, bubble, check_outros, children, claim_component, claim_element, claim_space, claim_text, clear_loops, component_subscribe, compute_rest_props, compute_slots, createEventDispatcher, create_animation, create_bidirectional_transition, create_component, create_in_transition, create_out_transition, create_slot, create_ssr_component, current_component, custom_event, dataset_dev, debug, destroy_block, destroy_component, destroy_each, detach, detach_after_dev, detach_before_dev, detach_between_dev, detach_dev, dirty_components, dispatch_dev, each, element, element_is, empty, escape, escaped, exclude_internal_props, fix_and_destroy_block, fix_and_outro_and_destroy_block, fix_position, flush, getContext, get_binding_group_value, get_current_component, get_slot_changes, get_slot_context, get_spread_object, get_spread_update, get_store_value, globals, group_outros, handle_promise, has_prop, identity, init, insert, insert_dev, intros, invalid_attribute_name_character, is_client, is_crossorigin, is_empty, is_function, is_promise, listen, listen_dev, loop, loop_guard, missing_component, mount_component, noop, not_equal, now, null_to_empty, object_without_properties, onDestroy, onMount, once, outro_and_destroy_block, prevent_default, prop_dev, query_selector_all, raf, run, run_all, safe_not_equal, schedule_update, select_multiple_value, select_option, select_options, select_value, self, setContext, set_attributes, set_current_component, set_custom_element_data, set_data, set_data_dev, set_input_type, set_input_value, set_now, set_raf, set_store_value, set_style, set_svg_attributes, space, spread, stop_propagation, subscribe, svg_element, text, tick, time_ranges_to_array, to_number, toggle_class, transition_in, transition_out, update_keyed_each, update_slot, validate_component, validate_each_argument, validate_each_keys, validate_slots, validate_store, xlink_attr */
/*! exports used: HtmlTag, SvelteComponent, add_flush_callback, add_render_callback, add_transform, append, assign, attr, bind, binding_callbacks, check_outros, component_subscribe, createEventDispatcher, create_animation, create_bidirectional_transition, create_component, destroy_block, destroy_component, destroy_each, detach, element, fix_and_outro_and_destroy_block, fix_position, get_store_value, group_outros, identity, init, insert, is_function, listen, mount_component, noop, run_all, safe_not_equal, self, set_data, set_input_value, set_style, space, subscribe, text, transition_in, transition_out, update_keyed_each */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HtmlTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SvelteComponent; });
/* unused harmony export SvelteComponentDev */
/* unused harmony export SvelteElement */
/* unused harmony export action_destroyer */
/* unused harmony export add_attribute */
/* unused harmony export add_classes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return add_flush_callback; });
/* unused harmony export add_location */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return add_render_callback; });
/* unused harmony export add_resize_listener */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return add_transform; });
/* unused harmony export afterUpdate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return append; });
/* unused harmony export append_dev */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return attr; });
/* unused harmony export attr_dev */
/* unused harmony export beforeUpdate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return binding_callbacks; });
/* unused harmony export blank_object */
/* unused harmony export bubble */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return check_outros; });
/* unused harmony export children */
/* unused harmony export claim_component */
/* unused harmony export claim_element */
/* unused harmony export claim_space */
/* unused harmony export claim_text */
/* unused harmony export clear_loops */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return component_subscribe; });
/* unused harmony export compute_rest_props */
/* unused harmony export compute_slots */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return createEventDispatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return create_animation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return create_bidirectional_transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return create_component; });
/* unused harmony export create_in_transition */
/* unused harmony export create_out_transition */
/* unused harmony export create_slot */
/* unused harmony export create_ssr_component */
/* unused harmony export current_component */
/* unused harmony export custom_event */
/* unused harmony export dataset_dev */
/* unused harmony export debug */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return destroy_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return destroy_each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return detach; });
/* unused harmony export detach_after_dev */
/* unused harmony export detach_before_dev */
/* unused harmony export detach_between_dev */
/* unused harmony export detach_dev */
/* unused harmony export dirty_components */
/* unused harmony export dispatch_dev */
/* unused harmony export each */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return element; });
/* unused harmony export element_is */
/* unused harmony export empty */
/* unused harmony export escape */
/* unused harmony export escaped */
/* unused harmony export exclude_internal_props */
/* unused harmony export fix_and_destroy_block */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return fix_and_outro_and_destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return fix_position; });
/* unused harmony export flush */
/* unused harmony export getContext */
/* unused harmony export get_binding_group_value */
/* unused harmony export get_current_component */
/* unused harmony export get_slot_changes */
/* unused harmony export get_slot_context */
/* unused harmony export get_spread_object */
/* unused harmony export get_spread_update */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return get_store_value; });
/* unused harmony export globals */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return group_outros; });
/* unused harmony export handle_promise */
/* unused harmony export has_prop */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return insert; });
/* unused harmony export insert_dev */
/* unused harmony export intros */
/* unused harmony export invalid_attribute_name_character */
/* unused harmony export is_client */
/* unused harmony export is_crossorigin */
/* unused harmony export is_empty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return is_function; });
/* unused harmony export is_promise */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return listen; });
/* unused harmony export listen_dev */
/* unused harmony export loop */
/* unused harmony export loop_guard */
/* unused harmony export missing_component */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return mount_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return noop; });
/* unused harmony export not_equal */
/* unused harmony export now */
/* unused harmony export null_to_empty */
/* unused harmony export object_without_properties */
/* unused harmony export onDestroy */
/* unused harmony export onMount */
/* unused harmony export once */
/* unused harmony export outro_and_destroy_block */
/* unused harmony export prevent_default */
/* unused harmony export prop_dev */
/* unused harmony export query_selector_all */
/* unused harmony export raf */
/* unused harmony export run */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return run_all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return safe_not_equal; });
/* unused harmony export schedule_update */
/* unused harmony export select_multiple_value */
/* unused harmony export select_option */
/* unused harmony export select_options */
/* unused harmony export select_value */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return self; });
/* unused harmony export setContext */
/* unused harmony export set_attributes */
/* unused harmony export set_current_component */
/* unused harmony export set_custom_element_data */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "J", function() { return set_data; });
/* unused harmony export set_data_dev */
/* unused harmony export set_input_type */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "K", function() { return set_input_value; });
/* unused harmony export set_now */
/* unused harmony export set_raf */
/* unused harmony export set_store_value */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "L", function() { return set_style; });
/* unused harmony export set_svg_attributes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "M", function() { return space; });
/* unused harmony export spread */
/* unused harmony export stop_propagation */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "N", function() { return subscribe; });
/* unused harmony export svg_element */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "O", function() { return text; });
/* unused harmony export tick */
/* unused harmony export time_ranges_to_array */
/* unused harmony export to_number */
/* unused harmony export toggle_class */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "P", function() { return transition_in; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Q", function() { return transition_out; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "R", function() { return update_keyed_each; });
/* unused harmony export update_slot */
/* unused harmony export validate_component */
/* unused harmony export validate_each_argument */
/* unused harmony export validate_each_keys */
/* unused harmony export validate_slots */
/* unused harmony export validate_store */
/* unused harmony export xlink_attr */
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function not_equal(a, b) {
    return a != a ? b == b : a !== b;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
        result[key] = true;
    }
    return result;
}
function once(fn) {
    let ran = false;
    return function (...args) {
        if (ran)
            return;
        ran = true;
        fn.call(this, ...args);
    };
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}
const has_prop = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;
// used internally for testing
function set_now(fn) {
    now = fn;
}
function set_raf(fn) {
    raf = fn;
}

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * For testing purposes only!
 */
function clear_loops() {
    tasks.clear();
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function element_is(name, is) {
    return document.createElement(name, { is });
}
function object_without_properties(obj, exclude) {
    const target = {};
    for (const k in obj) {
        if (has_prop(obj, k)
            // @ts-ignore
            && exclude.indexOf(k) === -1) {
            // @ts-ignore
            target[k] = obj[k];
        }
    }
    return target;
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function self(fn) {
    return function (event) {
        // @ts-ignore
        if (event.target === this)
            fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = value;
    }
    else {
        attr(node, prop, value);
    }
}
function xlink_attr(node, attribute, value) {
    node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
}
function get_binding_group_value(group, __value, checked) {
    const value = new Set();
    for (let i = 0; i < group.length; i += 1) {
        if (group[i].checked)
            value.add(group[i].__value);
    }
    if (!checked) {
        value.delete(__value);
    }
    return Array.from(value);
}
function to_number(value) {
    return value === '' ? null : +value;
}
function time_ranges_to_array(ranges) {
    const array = [];
    for (let i = 0; i < ranges.length; i += 1) {
        array.push({ start: ranges.start(i), end: ranges.end(i) });
    }
    return array;
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            const remove = [];
            while (j < node.attributes.length) {
                const attribute = node.attributes[j++];
                if (!attributes[attribute.name]) {
                    remove.push(attribute.name);
                }
            }
            for (let k = 0; k < remove.length; k++) {
                node.removeAttribute(remove[k]);
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_input_type(input, type) {
    try {
        input.type = type;
    }
    catch (e) {
        // do nothing
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_options(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        option.selected = ~value.indexOf(option.__value);
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function select_multiple_value(select) {
    return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
        `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function query_selector_all(selector, parent = document.body) {
    return Array.from(parent.querySelectorAll(selector));
}
class HtmlTag {
    constructor(anchor = null) {
        this.a = anchor;
        this.e = this.n = null;
    }
    m(html, target, anchor = null) {
        if (!this.e) {
            this.e = element(target.nodeName);
            this.t = target;
            this.h(html);
        }
        this.i(anchor);
    }
    h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(this.t, this.n[i], anchor);
        }
    }
    p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

function create_animation(node, from, fn, params) {
    if (!from)
        return noop;
    const to = node.getBoundingClientRect();
    if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
        return noop;
    const { delay = 0, duration = 300, easing = identity, 
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay, 
    // @ts-ignore todo:
    end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
    let running = true;
    let started = false;
    let name;
    function start() {
        if (css) {
            name = create_rule(node, 0, 1, duration, delay, easing, css);
        }
        if (!delay) {
            started = true;
        }
    }
    function stop() {
        if (css)
            delete_rule(node, name);
        running = false;
    }
    loop(now => {
        if (!started && now >= start_time) {
            started = true;
        }
        if (started && now >= end) {
            tick(1, 0);
            stop();
        }
        if (!running) {
            return false;
        }
        if (started) {
            const p = now - start_time;
            const t = 0 + 1 * easing(p / duration);
            tick(t, 1 - t);
        }
        return true;
    });
    start();
    tick(0, 1);
    return stop;
}
function fix_position(node) {
    const style = getComputedStyle(node);
    if (style.position !== 'absolute' && style.position !== 'fixed') {
        const { width, height } = style;
        const a = node.getBoundingClientRect();
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.height = height;
        add_transform(node, a);
    }
}
function add_transform(node, a) {
    const b = node.getBoundingClientRect();
    if (a.left !== b.left || a.top !== b.top) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function beforeUpdate(fn) {
    get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const intros = { enabled: false };
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            info.blocks[i] = null;
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            if (!info.hasCatch) {
                throw error;
            }
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function fix_and_destroy_block(block, lookup) {
    block.f();
    destroy_block(block, lookup);
}
function fix_and_outro_and_destroy_block(block, lookup) {
    block.f();
    outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error(`Cannot have duplicate keys in a keyed each`);
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += " " + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += " " + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
function debug(file, line, column, values) {
    console.log(`{@debug} ${file ? file + ' ' : ''}(${line}:${column})`); // eslint-disable-line no-console
    console.log(values); // eslint-disable-line no-console
    return '';
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
    return classes ? ` class="${classes}"` : ``;
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function detach_between_dev(before, after) {
    while (before.nextSibling && before.nextSibling !== after) {
        detach_dev(before.nextSibling);
    }
}
function detach_before_dev(after) {
    while (after.previousSibling) {
        detach_dev(after.previousSibling);
    }
}
function detach_after_dev(before) {
    while (before.nextSibling) {
        detach_dev(before.nextSibling);
    }
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
function dataset_dev(node, property, value) {
    node.dataset[property] = value;
    dispatch_dev("SvelteDOMSetDataset", { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}
function loop_guard(timeout) {
    const start = Date.now();
    return () => {
        if (Date.now() - start > timeout) {
            throw new Error(`Infinite loop detected`);
        }
    };
}



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./util/ajax-hook/index.ts":
/*!*********************************!*\
  !*** ./util/ajax-hook/index.ts ***!
  \*********************************/
/*! exports provided: AjaxHook */
/*! exports used: AjaxHook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AjaxHook; });
/* harmony import */ var ajax_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ajax-hook */ "./node_modules/ajax-hook/index.js");

var AjaxHook;

(function (AjaxHook) {
  let Xhr = window.XMLHttpRequest; // 有一些网页的实现难以从 dom 上判断信息是否需要屏蔽，这里从请求下手
  //@ts-ignore

  typeof unsafeWindow === "undefined" ? //@ts-ignore
  window.unsafeWindow = window : //@ts-ignore
  window = unsafeWindow;

  AjaxHook.ResHandler = (config, response) => {
    console.log("[ajax]", config, response);
  };

  Object(ajax_hook__WEBPACK_IMPORTED_MODULE_0__[/* proxy */ "a"])({
    //请求发起前进入
    onRequest: (config, handler) => {
      //   console.log("[💚开始请求]", config.url, urlHandler(config.url));
      //   config.url = urlHandler(config.url);

      /** 关闭 withCredentials 避免触发跨域 */
      config.withCredentials = false;
      handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
      handler.next(err);
    },
    //请求成功后进入
    onResponse: (response, handler) => {
      AjaxHook.ResHandler(response.config, response.response);
      handler.next(response);
    }
  });
  /** 替换 XMLHttpRequest */

  window.XMLHttpRequest = XMLHttpRequest;
  let rawFetch = window.fetch;

  window.fetch = async (...arg) => {
    const res = await rawFetch(...arg);
    let rawJson = res.json;

    res.json = async () => {
      const response = await rawJson.apply(res);
      AjaxHook.ResHandler(arg, response);
      return response;
    };

    return res;
  };
})(AjaxHook || (AjaxHook = {}));

/***/ }),

/***/ "./偏见/config.svelte":
/*!**************************!*\
  !*** ./偏见/config.svelte ***!
  \**************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var svelte_internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/internal */ "./node_modules/svelte/internal/index.mjs");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./偏见/config.ts");
/* 偏见/config.svelte generated by Svelte v3.25.0 */




function add_css() {
	var style = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("style");
	style.id = "svelte-ot4o5t-style";
	style.textContent = ".des.svelte-ot4o5t{font-size:small;background-color:rgb(219, 219, 219)}.border.svelte-ot4o5t{border:1px solid #333}.main.svelte-ot4o5t{background:white;padding:10px 15px;max-width:80vw}.app.svelte-ot4o5t{z-index:999;position:fixed;width:100vw;height:100vh;top:0px;display:flex;justify-content:center;align-items:center;background:rgba(0, 0, 0, 0.534)}.-hide.svelte-ot4o5t{display:none}";
	Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(document.head, style);
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[15] = list;
	child_ctx[16] = i;
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

// (54:10) {#each 配置项.数据 as data_str, data_str_i}
function create_each_block_1(ctx) {
	let div;
	let input;
	let t0;
	let button;
	let t1;
	let button_title_value;
	let t2;
	let mounted;
	let dispose;

	function input_input_handler() {
		/*input_input_handler*/ ctx[7].call(input, /*each_value_1*/ ctx[15], /*data_str_i*/ ctx[16]);
	}

	function click_handler_2(...args) {
		return /*click_handler_2*/ ctx[8](/*配置项*/ ctx[11], /*data_str_i*/ ctx[16], ...args);
	}

	return {
		c() {
			div = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");
			input = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("input");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("button");
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* text */ "O"])("❌");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(input, "type", "text");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_style */ "L"])(input, "width", "90%");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button, "title", button_title_value = "单击删除项目「" + /*data_str*/ ctx[14] + "」");
		},
		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* insert */ "B"])(target, div, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div, input);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_input_value */ "K"])(input, /*data_str*/ ctx[14]);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div, button);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(button, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div, t2);

			if (!mounted) {
				dispose = [
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(input, "input", input_input_handler),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(button, "click", click_handler_2)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*showConfig*/ 4 && input.value !== /*data_str*/ ctx[14]) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_input_value */ "K"])(input, /*data_str*/ ctx[14]);
			}

			if (dirty & /*showConfig*/ 4 && button_title_value !== (button_title_value = "单击删除项目「" + /*data_str*/ ctx[14] + "」")) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button, "title", button_title_value);
			}
		},
		d(detaching) {
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* detach */ "t"])(div);
			mounted = false;
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* run_all */ "G"])(dispose);
		}
	};
}

// (41:4) {#each showConfig as 配置项}
function create_each_block(ctx) {
	let div0;
	let t0_value = /*配置项*/ ctx[11].标签文本 + "";
	let t0;
	let t1;
	let div3;
	let div1;
	let t2_value = /*配置项*/ ctx[11].数据需求描述 + "";
	let t2;
	let t3;
	let button;
	let t5;
	let div2;
	let t6;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*配置项*/ ctx[11], ...args);
	}

	let each_value_1 = /*配置项*/ ctx[11].数据;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");
			t0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* text */ "O"])(t0_value);
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			div3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");
			t2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* text */ "O"])(t2_value);
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			button = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("button");
			button.textContent = "🖱️ 点击这新增一项";
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			div2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(div1, "class", "des svelte-ot4o5t");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button, "class", "des svelte-ot4o5t");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_style */ "L"])(div2, "display", "flex");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_style */ "L"])(div2, "flex-direction", "column");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(div3, "class", "border svelte-ot4o5t");
		},
		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* insert */ "B"])(target, div0, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, t0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* insert */ "B"])(target, t1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* insert */ "B"])(target, div3, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div3, div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div1, t2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div3, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div3, button);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div3, t5);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div3, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div2, null);
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div3, t6);

			if (!mounted) {
				dispose = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(button, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*showConfig*/ 4 && t0_value !== (t0_value = /*配置项*/ ctx[11].标签文本 + "")) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_data */ "J"])(t0, t0_value);
			if (dirty & /*showConfig*/ 4 && t2_value !== (t2_value = /*配置项*/ ctx[11].数据需求描述 + "")) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* set_data */ "J"])(t2, t2_value);

			if (dirty & /*showConfig, config*/ 6) {
				each_value_1 = /*配置项*/ ctx[11].数据;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* detach */ "t"])(div0);
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* detach */ "t"])(t1);
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* detach */ "t"])(div3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* destroy_each */ "s"])(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let div1;
	let div0;
	let button0;
	let t1;
	let button1;
	let t3;
	let button2;
	let t5;
	let div1_class_value;
	let mounted;
	let dispose;
	let each_value = /*showConfig*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");
			div0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("div");
			button0 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("button");
			button0.textContent = "🖱️点击这关闭配置面板";
			t1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			button1 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("button");
			button1.textContent = "🖱️点击这保存";
			t3 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();
			button2 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* element */ "u"])("button");
			button2.textContent = "🖱️ 点击这恢复默认配置并刷新页面";
			t5 = Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* space */ "M"])();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button0, "class", "des svelte-ot4o5t");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button0, "title", "点击外部阴影亦可");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button1, "class", "des svelte-ot4o5t");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(button2, "class", "des svelte-ot4o5t");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(div0, "class", "main svelte-ot4o5t");
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(div1, "class", div1_class_value = "app " + (/*showConfigView*/ ctx[0] ? "" : "-hide") + " svelte-ot4o5t");
		},
		m(target, anchor) {
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* insert */ "B"])(target, div1, anchor);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div1, div0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, button0);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, t1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, button1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, t3);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, button2);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* append */ "f"])(div0, t5);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			if (!mounted) {
				dispose = [
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(button0, "click", /*click_handler*/ ctx[5]),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(button1, "click", /*saveAndReload*/ ctx[3]),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(button2, "click", 重置),
					Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* listen */ "D"])(div1, "click", Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* self */ "I"])(/*click_handler_3*/ ctx[9]))
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*showConfig, config*/ 6) {
				each_value = /*showConfig*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*showConfigView*/ 1 && div1_class_value !== (div1_class_value = "app " + (/*showConfigView*/ ctx[0] ? "" : "-hide") + " svelte-ot4o5t")) {
				Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* attr */ "h"])(div1, "class", div1_class_value);
			}
		},
		i: svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"],
		o: svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"],
		d(detaching) {
			if (detaching) Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* detach */ "t"])(div1);
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* destroy_each */ "s"])(each_blocks, detaching);
			mounted = false;
			Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* run_all */ "G"])(dispose);
		}
	};
}

async function 重置() {
	await GM.deleteValue("user_config");
	location.reload();
}

function instance($$self, $$props, $$invalidate) {
	let { 重新执行回调 } = $$props;
	let { showConfigView = false } = $$props;
	GM.registerMenuCommand("打开配置面板", () => $$invalidate(0, showConfigView = true), "k");
	let config = _config__WEBPACK_IMPORTED_MODULE_1__[/* user_config */ "a"];

	function 重新执行() {
		Object.assign(_config__WEBPACK_IMPORTED_MODULE_1__[/* user_config */ "a"], config);
		重新执行回调();
	}

	(async () => {
		const s = await GM.getValue("user_config", JSON.stringify(_config__WEBPACK_IMPORTED_MODULE_1__[/* user_config */ "a"]));
		$$invalidate(1, config = JSON.parse(s));
		重新执行();
		console.log("[user_config]", _config__WEBPACK_IMPORTED_MODULE_1__[/* user_config */ "a"]);
	})();

	async function saveAndReload() {
		await GM.setValue("user_config", JSON.stringify(config));
		重新执行();
	}

	const click_handler = () => $$invalidate(0, showConfigView = false);

	const click_handler_1 = 配置项 => {
		配置项.数据.push("");
		$$invalidate(1, config);
	};

	function input_input_handler(each_value_1, data_str_i) {
		each_value_1[data_str_i] = this.value;
		($$invalidate(2, showConfig), $$invalidate(1, config));
	}

	const click_handler_2 = (配置项, data_str_i) => {
		配置项.数据.splice(data_str_i, 1);
		$$invalidate(1, config);
	};

	const click_handler_3 = () => $$invalidate(0, showConfigView = !showConfigView);

	$$self.$$set = $$props => {
		if ("重新执行回调" in $$props) $$invalidate(4, 重新执行回调 = $$props.重新执行回调);
		if ("showConfigView" in $$props) $$invalidate(0, showConfigView = $$props.showConfigView);
	};

	let showConfig;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*config*/ 2) {
			$: $$invalidate(2, showConfig = config.filter(el => new RegExp(el.生效范围正则).test(location.href)));
		}
	};

	return [
		showConfigView,
		config,
		showConfig,
		saveAndReload,
		重新执行回调,
		click_handler,
		click_handler_1,
		input_input_handler,
		click_handler_2,
		click_handler_3
	];
}

class Config extends svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* SvelteComponent */ "b"] {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-ot4o5t-style")) add_css();
		Object(svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* init */ "A"])(this, options, instance, create_fragment, svelte_internal__WEBPACK_IMPORTED_MODULE_0__[/* safe_not_equal */ "H"], { 重新执行回调: 4, showConfigView: 0 });
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Config);

/***/ }),

/***/ "./偏见/config.ts":
/*!**********************!*\
  !*** ./偏见/config.ts ***!
  \**********************/
/*! exports provided: user_config */
/*! exports used: user_config */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return user_config; });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./内置处理函数/知乎 */ "./偏见/内置处理函数/知乎.ts");

const user_config = [{
  标签文本: "崮生提供的黑名单规则",
  生效范围正则: "//www.zhihu.com/",
  规则列表: [{
    type: "dom",
    目标选择器: ".ContentItem",
    处理函数文本: ___WEBPACK_IMPORTED_MODULE_0__[/* 知乎答案不见 */ "b"].toString()
  }, {
    type: "res",
    处理函数文本: ___WEBPACK_IMPORTED_MODULE_0__[/* 知乎推荐不见 */ "a"].toString()
  }],
  数据: ["gu-shi-dang-an-ju-71,故事档案局"],
  数据需求描述: "填入用户 id 例如「gu-shi-dang-an-ju-71,故事档案局,其他任意文本可有可无」，id 和 name 都需要，在推荐页面会通过 name 来屏蔽（难以拿到id进行比较）"
}];

/***/ }),

/***/ "./偏见/flag.enum.ts":
/*!*************************!*\
  !*** ./偏见/flag.enum.ts ***!
  \*************************/
/*! exports provided: Flag */
/*! exports used: Flag */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Flag; });
const Flag = {
  标识_已被处理: "-identified",
  不看这条: "-no_see",
  色块5px: "-px5"
};

/***/ }),

/***/ "./偏见/偏见.user.ts":
/*!***********************!*\
  !*** ./偏见/偏见.user.ts ***!
  \***********************/
/*! exports provided: main */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./视之不见.css */ "./偏见/视之不见.css");
/* harmony import */ var _config_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.svelte */ "./偏见/config.svelte");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config */ "./偏见/config.ts");
/* harmony import */ var _flag_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./flag.enum */ "./偏见/flag.enum.ts");
/* harmony import */ var _util_ajax_hook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/ajax-hook */ "./util/ajax-hook/index.ts");
// ==UserScript==
// @name         偏见
// @namespace    https://shenzilong.cn/
// @version      0.0.1
// @description  偏见是常态，没有偏见是一种很难做到的事情；可用于知乎彻底拉黑
// @author       崮生 2234839456@qq.com
// @match        *
// @include      *
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @connect      shenzilong.cn
// ==/UserScript==
 //@ts-ignore





async function main() {
  const app_div = document.createElement("div");
  document.body.appendChild(app_div);
  new _config_svelte__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]({
    target: app_div,
    props: {
      重新执行回调: 屏蔽检测循环.reload
    }
  });
}

function user_config_transform(config) {
  return config.filter(el => new RegExp(el.生效范围正则).test(location.href)).map(el => {
    return el.规则列表.map(规则 => {
      const 处理函数 = (() => {
        try {
          const f = eval(`(${规则.处理函数文本})`);

          if (typeof f === "function") {
            return f;
          } else {
            return () => {
              console.log(`警告： ${el.标签文本} 的 ${规则.处理函数文本} eval 得到的值不是一个函数`);
            };
          }
        } catch (error) {
          return () => {
            console.log(`警告： ${el.标签文本} 的 ${规则.处理函数文本} eval 失败`, error);
          };
        }
      })();

      return { ...规则,
        数据: el.数据,
        处理函数
      };
    });
  }).reduce((a, b) => {
    a.push(...b);
    return a;
  }, []);
}

var 屏蔽检测循环;

(function (屏蔽检测循环) {
  let 循环id = 0;

  function stop() {
    clearInterval(循环id);
    const flag_str = Object.keys(_flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"]).map(k => _flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"][k]);
    document.querySelectorAll(`.${_flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"].标识_已被处理}`).forEach(el => el.classList.remove(...flag_str));
  }

  屏蔽检测循环.stop = stop;

  function start() {
    console.log("[开启检测循环]");
    const 规则列表 = user_config_transform(_config__WEBPACK_IMPORTED_MODULE_2__[/* user_config */ "a"]);

    _util_ajax_hook__WEBPACK_IMPORTED_MODULE_4__[/* AjaxHook */ "a"].ResHandler = (config, res) => {
      规则列表.forEach(规则 => {
        if (规则.type === "res") {
          const {
            处理函数,
            数据
          } = 规则;
          处理函数(config, res, 数据, _flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"]);
        }
      });
    };

    循环id = setInterval(() => {
      规则列表.forEach(规则 => {
        if (规则.type === "dom") {
          const {
            目标选择器,
            处理函数,
            数据
          } = 规则;
          Array.from(document.querySelectorAll(目标选择器)).filter(el => !el.classList.contains(_flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"].标识_已被处理)).forEach(el => {
            try {
              处理函数(el, 数据, _flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"]);
            } finally {
              el.classList.add(_flag_enum__WEBPACK_IMPORTED_MODULE_3__[/* Flag */ "a"].标识_已被处理);
            }
          });
        }
      });
    }, 800);
  }

  屏蔽检测循环.start = start;
  /** 开始循环前会清理之前的循环以及标识 */

  function reload() {
    stop();
    start();
  }

  屏蔽检测循环.reload = reload;
})(屏蔽检测循环 || (屏蔽检测循环 = {}));

main();

/***/ }),

/***/ "./偏见/内置处理函数/知乎.ts":
/*!*************************!*\
  !*** ./偏见/内置处理函数/知乎.ts ***!
  \*************************/
/*! exports provided: 知乎答案不见, 知乎推荐不见 */
/*! exports used: 知乎推荐不见, 知乎答案不见 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return 知乎答案不见; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return 知乎推荐不见; });
const 知乎答案不见 = function (el, data, f) {
  const user = el.querySelector(".UserLink-link");

  if (user) {
    data.forEach(s => {
      const [id] = s.split(",");

      if (id !== "" && user.href.endsWith(id)) {
        el.classList.add(f.色块5px);
      }
    });
  }
};
const 知乎推荐不见 = function (config, res, data) {
  if (Array.isArray(config)) {
    const [url] = config;

    if (typeof url === "string" && url.startsWith("/api/v3/feed/topstory/recommend")) {
      const response = res;
      response.data = response.data.filter(el => {
        const id = data.map(s => s.split(",")[0]);
        const author = el.target.author;
        const f = false === id.includes(author.url_token); // const f = author.url_token.length < 20;//测试用的

        if (!f) {
          console.log(`拦截推荐中的 ${author.url_token}-${author.name} 的回答`);
        }

        return f;
      }); // console.log("[response.data]", response.data);
    }
  } else {// console.log(config);
    }
};

/***/ }),

/***/ "./偏见/视之不见.css":
/*!*********************!*\
  !*** ./偏见/视之不见.css ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./视之不见.css */ "./node_modules/css-loader/dist/cjs.js!./偏见/视之不见.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_css__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], options);



/* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_css_loader_dist_cjs_js_css__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].locals || {});

/***/ })

/******/ });
//# sourceMappingURL=偏见.user.js.map