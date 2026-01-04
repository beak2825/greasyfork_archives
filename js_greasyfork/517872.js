// ==UserScript==
// @name                wwpdw-bootstrap
// @namespace           waitandesee-furnish-5923078164
// @version             1.0.3
// @description         观影网站加强体验
// @author              boccaro
// @copyright           boccaro
// @license             MIT
// @match               https://boccaro.notion.site/*
// @require             https://cdn.jsdelivr.net/npm/dplayer@1/dist/DPlayer.min.js

// @run-at              document-idle
// @supportURL          https://github.com/forestsheep911/monkey-notion-video-enhancer/issues
// @homepage            https://github.com/forestsheep911/monkey-notion-video-enhancer
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_registerMenuCommand
// @icon                https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/external-player-stay-home-vitaliy-gorbachev-blue-vitaly-gorbachev.png
// @downloadURL https://update.greasyfork.org/scripts/517872/wwpdw-bootstrap.user.js
// @updateURL https://update.greasyfork.org/scripts/517872/wwpdw-bootstrap.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var removeHeightAttributes_1 = __webpack_require__(584);
var videoEnhancer_1 = __webpack_require__(538);
var app = function () {
    // 立即执行手动视频增强功能
    (0, videoEnhancer_1.enhanceVideo)();
    var executeFunctions = function () {
        // 只对自动触发的功能使用延迟
        setTimeout(function () {
            // 这里可以只保留需要等待DOM加载的功能
            (0, removeHeightAttributes_1.removeHeightAttributes)();
        }, 3000);
    };
    var oldURL = location.href;
    // 监听URL变化
    var observeUrlChange = function () {
        var observer = new MutationObserver(function () {
            if (location.href !== oldURL) {
                oldURL = location.href;
                executeFunctions();
                // URL变化时也需要重新初始化视频增强功能
                // enhanceVideo()
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    };
    // 初始执行
    executeFunctions();
    observeUrlChange();
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
var app_1 = __importDefault(__webpack_require__(752));
function initDevelopment() {
    return __awaiter(this, void 0, void 0, function () {
        var isTampermonkey, hotReload, autoInstall, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(__webpack_require__(171)); })];
                case 1:
                    isTampermonkey = (_a.sent()).isTampermonkey;
                    if (!isTampermonkey()) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(__webpack_require__(741)); })];
                case 2:
                    hotReload = (_a.sent()).hotReload;
                    hotReload();
                    (0, app_1.default)();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(__webpack_require__(480)); })];
                case 4:
                    autoInstall = (_a.sent()).autoInstall;
                    autoInstall();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error('Development initialization failed:', err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
if (true) {
    (0, app_1.default)();
}
else {}


/***/ }),

/***/ 171:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isTampermonkey = void 0;
/**
 * 判断运行环境，阻止本地webpack注入的重复js代码执行
 */
var isTampermonkey = function () {
    var tampermonkey = true;
    try {
        GM_info;
    }
    catch (err) {
        tampermonkey = false;
    }
    return tampermonkey;
};
exports.isTampermonkey = isTampermonkey;


/***/ }),

/***/ 741:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hotReload = void 0;
var hotReload = function () {
    if (window.location.host.includes('localhost')) {
        var oldRefresh = GM_getValue('refresh');
        GM_setValue('refresh', !oldRefresh);
    }
    else {
        var callback = function (name, oldValue, newValue, remote) {
            if (remote) {
                window.location.reload();
            }
        };
        GM_addValueChangeListener('refresh', callback);
    }
};
exports.hotReload = hotReload;


/***/ }),

/***/ 480:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autoInstall = void 0;
var autoInstall = function () {
    var isNewInstall = localStorage.getItem('isNewInstall');
    if (!isNewInstall) {
        window.open(FILENAME, 'self');
        localStorage.setItem('isNewInstall', 'false');
    }
};
exports.autoInstall = autoInstall;


/***/ }),

/***/ 584:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeHeightAttributes = void 0;
var removeHeightAttributes = function () {
    var startRemovingHeight = function () {
        var parentElement = null;
        // 判断 URL 来选择父元素
        if (window.location.href.includes('f47ef8788acb4e12b604011e95fb1738')) {
            parentElement = document.querySelector('.notion-gallery-view');
        }
        else {
            parentElement = document.querySelector('[data-block-id="f47ef878-8acb-4e12-b604-011e95fb1738"]');
        }
        if (!parentElement) {
            console.warn('No appropriate parent element found');
            return;
        }
        var removeHeight = function (element) {
            var elementsWithHeight = element.querySelectorAll('.notion-gallery-view [style*="height"]');
            elementsWithHeight.forEach(function (elem) {
                var style = elem.getAttribute('style');
                if (style) {
                    var newStyle = style.replace(/height:\s*[0-9.]+px;?/g, '');
                    elem.setAttribute('style', newStyle);
                }
            });
        };
        // 初始处理
        console.log('Removing height attributes for elements within the parent element');
        removeHeight(parentElement);
        // 使用 MutationObserver 监视新元素的添加
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        var element = node;
                        removeHeight(element);
                    }
                });
            });
        });
        // 观察 parentElement 的子树变化
        observer.observe(parentElement, {
            childList: true,
            subtree: true,
        });
        console.log('Height attributes removal observer set up for elements within the parent element');
    };
    // 延迟处理，确保内容加载完毕
    setTimeout(startRemovingHeight, 3000);
    // 监听窗口 resize 事件
    window.addEventListener('resize', function () {
        console.log('Window resized, removing height attributes again.');
        setTimeout(startRemovingHeight, 300);
    });
};
exports.removeHeightAttributes = removeHeightAttributes;


/***/ }),

/***/ 538:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.enhanceVideo = void 0;
var dplayer_1 = __importDefault(__webpack_require__(971));
var enhanceVideo = function () {
    var replaceVideoPlayer = function () {
        var _a, _b, _c;
        var video = document.querySelector('video');
        if (!video || video.getAttribute('data-enhanced')) {
            return;
        }
        // 向上查找4层父元素，并转换类型
        var parent4 = (_c = (_b = (_a = video.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement;
        if (!parent4 || !parent4.parentElement) {
            console.log('Cannot find proper parent element');
            return;
        }
        try {
            var dpElement = document.createElement('div');
            new dplayer_1.default({
                container: dpElement,
                video: {
                    url: video.getAttribute('src') || '',
                    type: 'auto',
                },
            });
            parent4.parentElement.insertBefore(dpElement, parent4);
            parent4.style.display = 'none';
            video.setAttribute('data-enhanced', 'true');
        }
        catch (err) {
            console.error('Failed to enhance video:', err);
        }
    };
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            replaceVideoPlayer();
        }
    });
    GM_registerMenuCommand('使用 DPlayer 播放', replaceVideoPlayer);
};
exports.enhanceVideo = enhanceVideo;


/***/ }),

/***/ 971:
/***/ ((module) => {

module.exports = DPlayer;

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