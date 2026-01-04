// ==UserScript==
// @name                百度网盘链接失效
// @namespace           https://github.com/betgo/baiduCloudExpire-TamperMonkey
// @version             2024.1.27
// @description         网盘链接失效提示
// @author              betago
// @copyright           betago
// @license             MIT
// @match               *://*/*
// @run-at              document-idle
// @supportURL          https://github.com/betgo/baiduCloudExpire-TamperMonkey/issues
// @homepage            https://github.com/betgo/baiduCloudExpire-TamperMonkey
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @require             http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon                https://www.google.com/s2/favicons?domain=pan.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/485833/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%A4%B1%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/485833/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%A4%B1%E6%95%88.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ajax_1 = __webpack_require__(516);
var reg = /pan\.baidu\.com\/s\/[0-9a-zA-Z-_]{6,24}/g;
var panUrls = [];
var _observer = null;
function observerHTML() {
    var targetNode = document.getRootNode();
    var callback = function (mutationsList, observer) {
        matchUrl();
    };
    // 创建一个观察器实例并传入回调函数
    // observe函数会对传入的节点以及所需观察的配置项进行观察
    // 发生改变则回调callback函数
    _observer = new MutationObserver(callback);
    // 以上述配置开始观察目标节点
    _observer.observe(targetNode, { childList: true, subtree: true });
}
function matchUrl() {
    var _a;
    var matchURLs = (_a = $('body').html().match(reg)) === null || _a === void 0 ? void 0 : _a.slice();
    matchURLs = Array.from(new Set(matchURLs));
    // 排除已渲染的链接
    var disjointUrl = matchURLs.filter(function (value) { return !panUrls.includes(value); });
    panUrls = Array.from(new Set(__spreadArray(__spreadArray([], panUrls, true), matchURLs, true)));
    var urlPromises = disjointUrl.map(function (url) {
        return new Promise(function (resolve, reject) {
            (0, ajax_1.getData)('https://' + url)
                .then(function (res) {
                var _a;
                var isExpire = (_a = res.head.querySelector('title')) === null || _a === void 0 ? void 0 : _a.text.includes('不存在');
                resolve(isExpire);
            })
                .catch(function (error) {
                resolve(true);
            });
        });
    });
    Promise.all(urlPromises)
        .then(function (res) {
        var list = disjointUrl.filter(function (value, index) { return res[index]; });
        list.length > 0 && HightLigntExpireNodes(list);
    })
        .catch(function (error) {
        console.error('Error occurred:', error);
    });
}
var app = function () {
    // matchUrl();
    observerHTML();
};
function HightLigntExpireNodes(list) {
    list.forEach(function (txt) {
        // 查询所有包含指定文本的元素的最后一个元素
        var elments = $(':contains(' + txt + ')').filter(function () {
            return $(this).find(':contains(' + txt + ')').length === 0;
        });
        var reg = new RegExp('(https://)?' + txt, 'g');
        elments === null || elments === void 0 ? void 0 : elments.html(function (i, html) {
            return html.replace(reg, "<span title=\"\u94FE\u63A5\u4E0D\u5B58\u5728\" style=\" color: red; text-decoration: underline;\">$&</span>");
        });
    });
}
exports["default"] = app;


/***/ }),

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var app_1 = __importDefault(__webpack_require__(752));
if (true) {
    (0, app_1.default)();
}
else {}


/***/ }),

/***/ 516:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.postData = exports.getData = void 0;
var message_1 = __webpack_require__(244);
var getData = function (url, type, usermethod) {
    if (type === void 0) { type = "document" /* XhrResponseType.DOCUMENT */; }
    if (usermethod === void 0) { usermethod = "GET" /* XhrMethod.GET */; }
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: usermethod,
            url: url,
            responseType: type,
            timeout: 5 * 60 * 1000,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    resolve(response.response);
                }
                else {
                    reject(response);
                }
            },
            onerror: function (error) {
                new message_1.MessageBox('网络错误');
                reject(error);
            },
            ontimeout: function () {
                new message_1.MessageBox('网络超时', 'none', 2 /* IMPORTANCE.LOG_POP_GM */);
                reject('timeout');
            },
        });
    });
};
exports.getData = getData;
var postData = function (url, postData, _a) {
    var _b = _a === void 0 ? {
        responseType: "application/x-www-form-urlencoded" /* XhrResponseType.FORM */,
        usermethod: "POST" /* XhrMethod.POST */,
        contentType: "application/x-www-form-urlencoded" /* XhrResponseType.FORM */,
    } : _a, _c = _b.responseType, responseType = _c === void 0 ? "application/x-www-form-urlencoded" /* XhrResponseType.FORM */ : _c, _d = _b.usermethod, usermethod = _d === void 0 ? "POST" /* XhrMethod.POST */ : _d, _e = _b.contentType, contentType = _e === void 0 ? "application/x-www-form-urlencoded" /* XhrResponseType.FORM */ : _e;
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: usermethod,
            url: url,
            headers: {
                'Content-Type': contentType,
            },
            data: postData,
            responseType: responseType,
            timeout: 1 * 60 * 1000,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    resolve(response);
                }
                else {
                    new message_1.MessageBox('请求错误：' + response.status);
                    reject(response.status);
                }
            },
            onerror: function (error) {
                new message_1.MessageBox('网络错误');
                reject(error);
            },
            ontimeout: function () {
                new message_1.MessageBox('网络超时', 'none', 2 /* IMPORTANCE.LOG_POP_GM */);
                reject('timeout');
            },
        });
    });
};
exports.postData = postData;


/***/ }),

/***/ 244:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageBox = void 0;
// 需要手动增加 GM_addStyle 和 GM_notification 权限
/**
 * 消息通知类：不依赖框架
 * @param text string | undefined
 * @param setTime number | string = 5000,
 * @param importance number = 1
 * @example
 * 0.先在入口文件中调用静态方法 MessageBox.generate() 方法初始化消息弹出窗口；
 * 1. new MessageBox('hello')
 * 2.空初始化时调用 show() 显示消息；
 * 3.setTime：ms，非数字时为永久消息，需手动调用 refresh() 刷新消息，remove() 移除消息；
 * 4.importance：1： log + 自定义弹窗；2： log + 自定义弹窗 + GM系统提示；其它值：自定义弹窗；
 */
var MessageBox = /** @class */ (function () {
    function MessageBox(text, setTime, importance) {
        if (setTime === void 0) { setTime = 5000; }
        if (importance === void 0) { importance = 1 /* IMPORTANCE.LOG_POP */; }
        this._msg = null; // 永久显示标记，和元素地址
        this._text = text;
        this._setTime = setTime;
        this._importance = importance;
        this._timer = 0; // 计数器
        // 非空初始化，立即执行；
        if (text !== undefined) {
            this.show();
        }
    }
    // 静态方法，初始化消息盒子，先调用本方法初始化消息弹出窗口
    MessageBox.generate = function () {
        // 添加样式
        GM_addStyle("\n      #messageBox {\n        width: 222px; \n        position: fixed; \n        right: 5%; \n        bottom: 20px; \n        z-index: 999\n      }\n      #messageBox div {\n        width: 100%; \n        background-color: #64ce83; \n        float: left; \n        padding: 5px 10px; \n        margin-top: 10px; \n        border-radius: 10px; \n        color: #fff; \n        box-shadow: 0px 0px 1px 3px #ffffff\n      }\n      ");
        this._msgBox = document.createElement('div'); // 创建类型为div的DOM对象
        this._msgBox.id = 'messageBox';
        document.body.append(this._msgBox); // 消息盒子添加到body
    };
    // 显示消息
    MessageBox.prototype.show = function (text, setTime, importance) {
        var _this = this;
        if (text === void 0) { text = this._text; }
        if (setTime === void 0) { setTime = this._setTime; }
        if (importance === void 0) { importance = this._importance; }
        if (this._msg !== null) {
            throw new Error('先移除上条消息，才可再次添加！');
        }
        if (text === undefined) {
            throw new Error('未输入消息');
        }
        this._text = text;
        this._setTime = setTime;
        this._importance = importance;
        this._msg = document.createElement('div');
        this._msg.textContent = text;
        MessageBox._msgBox.append(this._msg); // 显示消息
        switch (importance) {
            case 1: {
                console.log(text);
                break;
            }
            case 2: {
                console.log(text);
                GM_notification(text);
                break;
            }
            default: {
                break;
            }
        }
        if (setTime && !isNaN(Number(setTime))) {
            // 默认5秒删掉消息，可设置时间，none一直显示
            setTimeout(function () {
                _this.remove();
            }, Number(setTime));
        }
    };
    MessageBox.prototype.refresh = function (text) {
        if (isNaN(Number(this._setTime)) && this._msg) {
            this._msg.textContent = text;
            switch (this._importance) {
                case 1: {
                    console.log(text);
                    break;
                }
                case 2: {
                    console.log(text);
                    GM_notification(text);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {
            throw new Error('只有弹窗永久消息支持刷新内容：' + this._setTime);
        }
    };
    // 移除方法，没有元素则等待setTime 5秒再试5次
    MessageBox.prototype.remove = function () {
        var _this = this;
        if (this._msg) {
            this._msg.remove();
            this._msg = null; // 清除标志位
        }
        else {
            // 空初始化时，消息异步发送，导致先执行移除而获取不到元素，默认 setTime=5000
            // 消息发出后，box 非空，可以移除，不会执行 setTime="none"
            if (this._timer == 4) {
                throw new Error('移除的元素不存在：' + this._msg);
            }
            this._timer++;
            setTimeout(function () {
                _this.remove();
            }, Number(this._setTime));
        }
    };
    return MessageBox;
}());
exports.MessageBox = MessageBox;


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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;