// ==UserScript==
// @name              github-contribution-ratio (typescript)
// @author            Axetroy
// @collaborator      Axetroy
// @description       查看Github项目的贡献比例
// @version           0.1.0
// @update            2017-04-06 21:28:02
// @grant             GM_xmlhttpRequest
// @include           https://github.com*
// @connect           *
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @supportURL        http://www.burningall.com
// @run-at            document-idle
// @contributionURL   troy450409405@gmail.com|alipay.com
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/28741/github-contribution-ratio%20%28typescript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28741/github-contribution-ratio%20%28typescript%29.meta.js
// ==/UserScript==

// Github源码:https://github.com/axetroy/github-contribution-ratio


/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var extend = __webpack_require__(1);
var Http = (function () {
    function Http(options) {
        this.options = options;
    }
    Http.prototype.request = function (method, url, body, headers) {
        if (headers === void 0) { headers = { 'Cookie': document.cookie }; }
        var options = extend({}, this.options, { method: method, url: url, data: body, headers: headers });
        if (options.url.indexOf('http') !== 0) {
            options.url = (options.base || '') + url;
        }
        options.url += '?client_id=b8257841dd7ca5eef2aa&client_secret=4da33dd6fcb0a01d395945ad18613ecf9c12079e';
        return new Promise(function (resolve, reject) {
            options.synchronous = true; // async
            options.onreadystatechange = function (response) {
                if (response.readyState !== 4)
                    return;
                response.status >= 200 && response.status < 400 ? resolve(response) : reject(response);
            };
            options.onerror = function (response) {
                console.error('http error');
                reject(response);
            };
            options.onabort = function (response) {
                console.error('http abort');
                reject(response);
            };
            options.ontimeout = function (response) {
                console.error('http timeout');
                reject(response);
            };
            GM_xmlhttpRequest(extend({}, options));
        });
    };
    Http.prototype.get = function (url, body, headers) {
        if (body === void 0) { body = null; }
        if (headers === void 0) { headers = {}; }
        return this.request('GET', url, body, headers);
    };
    Http.prototype.post = function (url, body, headers) {
        if (body === void 0) { body = null; }
        if (headers === void 0) { headers = {}; }
        return this.request('POST', url, body, headers);
    };
    return Http;
}());
var timeout = 5000;
exports.timeout = timeout;
var http = new Http({ timeout: timeout, base: 'https://api.github.com' });
exports.http = http;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __webpack_require__(0);
function getUserName() {
    var matcher = location.href.match(/https:\/\/github\.com\/(\w+)\??/);
    return matcher[1];
}
function shouldRun() {
    return /https:\/\/github\.com\/\w+\?/.test(location.href) && location.search.indexOf('tab=repositories') >= 0;
}
function getRepositories() {
    return [].slice.call(document.querySelectorAll('.js-repo-list>li'))
        .filter(function (li) { return !li.getAttribute('contribute-ratio'); })
        .map(function (li) {
        var a = li.querySelector('h3>a');
        var match = a.pathname.match(/([^\/]+)\/([^\/]+)/);
        li.setAttribute('repository-owner', match[1]);
        li.setAttribute('repository-name', match[2]);
        return li;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var userName, lis;
        return __generator(this, function (_a) {
            if (!shouldRun())
                return [2 /*return*/];
            userName = getUserName();
            console.info("Stating " + userName + "'s contribution...");
            lis = getRepositories();
            if (!lis.length)
                return [2 /*return*/];
            clearInterval(timer);
            timer = void 0;
            lis.forEach(function (li) {
                var owner = li.getAttribute('repository-owner');
                var name = li.getAttribute('repository-name');
                http_1.http.get("/repos/" + owner + "/" + name + "/stats/contributors")
                    .then(function (res) {
                    var raw = res.response;
                    if (!raw)
                        return;
                    var response = JSON.parse(raw);
                    response = Object.keys(response).length === 0 ? [] : response;
                    var contributes = response.filter(function (v) { return v["author"]["login"] === userName; }).map(function (v) { return v; });
                    var totalAdditions = 0;
                    var totalDeletions = 0;
                    var additions = 0;
                    var deletions = 0;
                    contributes.forEach(function (contribute) {
                        contribute.weeks.forEach(function (week) { return (additions += week.a) && (deletions += week.d); });
                    });
                    response.forEach(function (contribute) {
                        contribute.weeks.forEach(function (week) { return (totalAdditions += week.a) && (totalDeletions += week.d); });
                    });
                    var contributeRatio = (((additions + deletions) / (totalAdditions + totalDeletions)) * 100) + '';
                    li.setAttribute('total-additions', totalAdditions);
                    li.setAttribute('total-deletions', totalDeletions);
                    li.setAttribute('additions', additions);
                    li.setAttribute('deletions', deletions);
                    li.setAttribute('contribute-ratio', parseInt(contributeRatio));
                    var percent = parseInt(contributeRatio) > 0 ? parseInt(contributeRatio) : 1;
                    var uncontribution = document.createElement('span');
                    var contribution = document.createElement('span');
                    var container = document.createElement('span');
                    container.setAttribute('aria-label', "Contribution " + percent + "%");
                    var width = 155;
                    container.classList.add('d-inline-block');
                    container.classList.add('tooltipped');
                    container.classList.add('tooltipped-s');
                    container.style.width = '155px';
                    var contributionWidth = width * percent / 100;
                    contribution.style.width = contributionWidth + 'px';
                    contribution.style.borderBottom = '2px solid #009688';
                    contribution.style.display = 'inline-block';
                    uncontribution.style.width = width - contributionWidth + 'px';
                    uncontribution.style.borderBottom = '2px solid #9E9E9E';
                    uncontribution.style.display = 'inline-block';
                    container.appendChild(contribution);
                    container.appendChild(uncontribution);
                    li.querySelector('.col-3.float-right.text-right').appendChild(container);
                })
                    .catch(function (err) {
                    console.error(err);
                });
            });
            return [2 /*return*/];
        });
    });
}
(function (history) {
    var pushState = history.pushState;
    history.pushState = function (state) {
        if (typeof history["onpushstate"] == "function") {
            history["onpushstate"]({ state: state });
        }
        setTimeout(function () {
            run();
        });
        return pushState.apply(history, arguments);
    };
})(window.history);
var timer;
function run() {
    if (!shouldRun())
        return;
    timer = setInterval(function () {
        main();
    }, 1500);
}
run();


/***/ })
/******/ ]);