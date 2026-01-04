// ==UserScript==
// @name                快速查看kintone字段代码
// @namespace           https://github.com/forestsheep911/monkin-hodgepodge/blob/main/fast-see-field-code.js
// @version             1.0.3
// @description         如果想查看字段code，以前一定要去后台管理界面，只是简单的看一个要点很多次很不友好，现在只要把鼠标放到元素题目上就可以看了。鼠标不动，单击就是拷贝code。暂时不支持subtable。
// @author              bxu
// @copyright           forestsheep911
// @license             MIT
// @match               https://*.cybozu.cn/k/*/show*
// @match               https://*.cybozu.com/k/*/show*
// @match               https://*.cybozu-dev.com/k/*/show*
// @match               https://*.kintone.com/k/*/show*
// @match               https://*.s.cybozu.cn/k/*/show*
// @match               https://*.s.cybozu.com/k/*/show*
// @match               https://*.s.kintone.com/k/*/show*
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at              document-end
// @supportURL          https://github.com/forestsheep911/monkey-kintone-field-code/issues
// @homepage            https://github.com/forestsheep911/monkey-kintone-field-code#readme
// @grant               GM_addStyle
// @icon                https://img.icons8.com/ios/50/000000/happy-eyes.png
// @downloadURL https://update.greasyfork.org/scripts/503503/%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8Bkintone%E5%AD%97%E6%AE%B5%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/503503/%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8Bkintone%E5%AD%97%E6%AE%B5%E4%BB%A3%E7%A0%81.meta.js
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Swal = __webpack_require__(873);
var app = function () {
    GM_addStyle("\n        #swal2-title {\n            text-align: center;\n        }\n    ");
    var params = {
        app: kintone.app.getId(),
        lang: 'user',
    };
    function getFields() {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', params)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    }
    function mainWork() {
        return __awaiter(this, void 0, void 0, function () {
            var objFields, eleCommonLabels, showCode, defaultBGColor, _loop_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getFields()];
                    case 1:
                        objFields = _a.sent();
                        eleCommonLabels = document.querySelectorAll('.control-label-gaia, .group-label-gaia');
                        _loop_1 = function (i) {
                            eleCommonLabels[i].style.cursor = 'copy';
                            eleCommonLabels[i].onmouseover = function () {
                                defaultBGColor = eleCommonLabels[i].style.backgroundColor;
                                eleCommonLabels[i].style.backgroundColor = '#f2b36f';
                                Object.keys(objFields.properties).forEach(function (key) {
                                    if (eleCommonLabels[i].innerText === objFields.properties[key].label) {
                                        showCode = objFields.properties[key].code;
                                    }
                                });
                                Swal.fire({
                                    title: showCode,
                                    toast: true,
                                    position: 'top',
                                    showConfirmButton: false,
                                    width: 520,
                                    padding: "0em",
                                    timer: 5000,
                                });
                            };
                            eleCommonLabels[i].onmouseout = function () {
                                Swal.close();
                                eleCommonLabels[i].style.backgroundColor = defaultBGColor;
                            };
                            eleCommonLabels[i].onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, navigator.clipboard.writeText(showCode)];
                                        case 1:
                                            _a.sent();
                                            Swal.fire({
                                                title: "<span style=\"color:#129459\">".concat(showCode, "</span><br>\u5DF2\u62F7\u8D1D\u81F3\u526A\u5207\u677F"),
                                                toast: true,
                                                position: 'top',
                                                showConfirmButton: false,
                                                width: 360,
                                                padding: "0em",
                                                timer: 3000,
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                        };
                        for (i = 0; i < eleCommonLabels.length; i += 1) {
                            _loop_1(i);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function modifyFieldCode() {
        return __awaiter(this, void 0, void 0, function () {
            var eleCommonLabels, _loop_2, i;
            var _this = this;
            return __generator(this, function (_a) {
                eleCommonLabels = document.querySelectorAll('.control-label-gaia, .group-label-gaia');
                _loop_2 = function (i) {
                    eleCommonLabels[i].style.cursor = 'copy';
                    eleCommonLabels[i].onmouseover = function () {
                        // defaultBGColor = eleCommonLabels[i].style.backgroundColor
                        eleCommonLabels[i].style.backgroundColor = '#f2b36f';
                    };
                    //   Object.keys(objFields.properties).forEach((key) => {
                    //     if (eleCommonLabels[i].innerText === objFields.properties[key].label) {
                    //       showCode = objFields.properties[key].code
                    //     }
                    //   })
                    //   Swal.fire({
                    //     title: showCode,
                    //     toast: true,
                    //     position: 'top',
                    //     showConfirmButton: false,
                    //     width: 520,
                    //     padding: `0em`,
                    //     timer: 5000,
                    //   })
                    // }
                    // eleCommonLabels[i].onmouseout = () => {
                    //   Swal.close()
                    //   eleCommonLabels[i].style.backgroundColor = defaultBGColor
                    // }
                    eleCommonLabels[i].onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            Swal.fire({
                                title: 'new field code',
                                input: 'text',
                                inputAttributes: {
                                    autocapitalize: 'off',
                                },
                                showCancelButton: true,
                                confirmButtonText: 'modify',
                                showLoaderOnConfirm: true,
                                preConfirm: function () {
                                    console.log('click modify');
                                },
                                allowOutsideClick: function () { return !Swal.isLoading(); },
                                timer: 4000,
                            });
                            return [2 /*return*/];
                        });
                    }); };
                };
                // let showCode: string
                // let defaultBGColor: string
                for (i = 0; i < eleCommonLabels.length; i += 1) {
                    _loop_2(i);
                }
                return [2 /*return*/];
            });
        });
    }
    kintone.events.on('app.record.detail.show', function (event) {
        mainWork();
        return event;
    });
    kintone.events.on('app.record.edit.show', function (event) {
        modifyFieldCode();
        return event;
    });
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