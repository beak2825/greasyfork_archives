// ==UserScript==
// @name                kintone快速拷贝记录编号
// @namespace           https://github.com/forestsheep911/monkey-kintone-copy-record-number#readme
// @version             0.0.1
// @description         copy record number quickly
// @author              bxu
// @copyright           bxu
// @license             MIT
// @match               https://*.cybozu.cn/k/*
// @match               https://*.cybozu.com/k/*
// @match               https://*.cybozu-dev.com/k/*
// @match               https://*.s.cybozu.cn/k/*
// @match               https://*.s.cybozu.com/k/*
// @match               https://*.s.cybozu-dev.com/k/*
// @match               https://*.kintone.com/k/*
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at              document-end
// @supportURL          https://github.com/forestsheep911/monkey-kintone-copy-record-number/issues
// @homepage            https://github.com/forestsheep911/monkey-kintone-copy-record-number#readme
// @grant               GM_addStyle
// @icon                https://img.icons8.com/material-outlined/256/code-file.png
// @downloadURL https://update.greasyfork.org/scripts/503506/kintone%E5%BF%AB%E9%80%9F%E6%8B%B7%E8%B4%9D%E8%AE%B0%E5%BD%95%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/503506/kintone%E5%BF%AB%E9%80%9F%E6%8B%B7%E8%B4%9D%E8%AE%B0%E5%BD%95%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var sweetalert2_1 = __importDefault(__webpack_require__(873));
var app = function () {
    var timer;
    GM_addStyle("\n ");
    var MOUSE_HOLD_TIME = 2500;
    var COPY_T_MINUS = 1700;
    var SHOW_COPYED_LENGTH = 800;
    var NO_FOCUS_ERR_MSG = '拷贝失败，拷贝时当前页面必须处于focus状态下';
    var COPY_T_MINUS_MSG = '毫秒后自动复制记录编号!';
    var HOLD_TO_COPY_MSG = '悬停拷贝记录编号';
    var COPY_OVER_MSG = {
        setLang: function () {
            if (navigator.language === 'en-US')
                return this['en-US'];
            if (navigator.language === 'zh-CN')
                return this['zh-CN'];
            return this['en-US'];
        },
        'en-US': 'Copyied',
        'zh-CN': '复制完成',
    };
    console.log(navigator.language);
    var showPreCopyDialog = function (copyText) {
        var timerInterval;
        sweetalert2_1.default.fire({
            html: "<b></b>".concat(COPY_T_MINUS_MSG),
            timer: COPY_T_MINUS,
            timerProgressBar: true,
            position: 'center',
            didOpen: function () {
                var _a;
                sweetalert2_1.default.showLoading();
                var b = (_a = sweetalert2_1.default.getHtmlContainer()) === null || _a === void 0 ? void 0 : _a.querySelector('b');
                timerInterval = setInterval(function () {
                    if (b) {
                        var leftSec = sweetalert2_1.default.getTimerLeft();
                        b.textContent = leftSec.toString();
                    }
                }, 50);
            },
            willClose: function () {
                clearInterval(timerInterval);
            },
        }).then(function (result) {
            if (result.dismiss === sweetalert2_1.default.DismissReason.timer) {
                doCopy(copyText);
            }
        });
    };
    var getAppCode = function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, appInfo;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    params = {
                        id: (_a = kintone.app.getId()) === null || _a === void 0 ? void 0 : _a.toString(),
                    };
                    return [4 /*yield*/, kintone.api(kintone.api.url('/k/v1/app.json', true), 'GET', params)];
                case 1:
                    appInfo = _b.sent();
                    if (!appInfo || typeof appInfo !== 'object' || appInfo.code === '') {
                        console.log('app code is not setted');
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, appInfo.code];
            }
        });
    }); };
    function addMouseOver(elementToBind, appCode) {
        if (appCode) {
            var hrefString = elementToBind.getAttribute('href');
            var regExpRecordId = /(?<=record=)\d+/;
            var matches = hrefString === null || hrefString === void 0 ? void 0 : hrefString.match(regExpRecordId);
            if (!matches || matches.length !== 1) {
                return;
            }
            var appId_1 = matches[0];
            elementToBind.onmouseover = function () {
                timer = setTimeout(function () {
                    showPreCopyDialog("".concat(appCode, "-").concat(appId_1));
                }, MOUSE_HOLD_TIME);
            };
        }
        else {
            console.log(elementToBind.innerText);
            elementToBind.onmouseover = function () {
                timer = setTimeout(function () {
                    showPreCopyDialog(elementToBind.innerText);
                }, MOUSE_HOLD_TIME);
            };
        }
    }
    var addMouseOut = function (elementToBind) {
        elementToBind.onmouseout = function () {
            clearTimeout(timer);
        };
    };
    var doCopy = function (text) { return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(text)];
                case 1:
                    _a.sent();
                    sweetalert2_1.default.fire({
                        text: "".concat(COPY_OVER_MSG.setLang()),
                        showConfirmButton: false,
                        timer: SHOW_COPYED_LENGTH,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    sweetalert2_1.default.fire({
                        text: NO_FOCUS_ERR_MSG,
                        showConfirmButton: false,
                    });
                    console.log(e_1);
                    console.error(NO_FOCUS_ERR_MSG);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    kintone.events.on('app.record.index.show', function (ke) { return __awaiter(void 0, void 0, void 0, function () {
        var appCode, viewDetailButtonEle, i, el, recordNumberCellEle, i, el;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAppCode()];
                case 1:
                    appCode = _a.sent();
                    if (!appCode)
                        return [2 /*return*/];
                    viewDetailButtonEle = document.querySelectorAll('td.recordlist-cell-gaia a.recordlist-show-gaia');
                    if (viewDetailButtonEle.length < 1)
                        return [2 /*return*/];
                    for (i = 0; i < viewDetailButtonEle.length; i++) {
                        el = viewDetailButtonEle[i];
                        console.log(el.title);
                        el.title = "".concat(el.title, " \n").concat(HOLD_TO_COPY_MSG);
                        addMouseOver(el, appCode);
                        addMouseOut(el);
                    }
                    recordNumberCellEle = document.querySelectorAll('td.recordlist-cell-gaia.recordlist-record_id-gaia');
                    for (i = 0; i < recordNumberCellEle.length; i++) {
                        el = recordNumberCellEle[i];
                        addMouseOver(el);
                        addMouseOut(el);
                    }
                    return [2 /*return*/, ke];
            }
        });
    }); });
};
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

/***/ 873:
/***/ ((module) => {

module.exports = Swal;

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