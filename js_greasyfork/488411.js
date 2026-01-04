// ==UserScript==
// @name                notion-video-enhancer
// @namespace           https://github.com/forestsheep911/monkey-notion-video-enhancer
// @version             0.0.2
// @description         Notion video enhancer
// @author              bxu
// @copyright           bxu
// @license             MIT
// @match               https://*.notion.site/*
// @require             https://cdn.jsdelivr.net/npm/dplayer@1.27.1/dist/DPlayer.min.js
// @run-at              document-end
// @grant               GM_addValueChangeListener
// @supportURL          https://github.com/forestsheep911/monkey-notion-video-enhancer/issues
// @homepage            https://github.com/forestsheep911/monkey-notion-video-enhancer
// @icon                https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/external-player-stay-home-vitaliy-gorbachev-blue-vitaly-gorbachev.png
// @downloadURL https://update.greasyfork.org/scripts/488411/notion-video-enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/488411/notion-video-enhancer.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var app = function () {
    // create button
    var button = document.createElement('button');
    button.innerText = '采用自研播放器';
    button.style.marginRight = '2em';
    button.style.marginTop = '2em';
    button.style.marginLeft = 'auto';
    button.style.width = 'fit-content';
    button.style.userSelect = 'none';
    button.style.transition = 'background 20ms ease-in 0s';
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.whiteSpace = 'nowrap';
    button.style.borderRadius = '4px';
    button.style.border = '1px solid rgba(55, 53, 47, 0.16)';
    var mains = document.getElementsByTagName('main');
    function enhanceVideo() {
        var _a, _b;
        // check if video exists
        var videoBlocks = document.querySelectorAll('video');
        if (videoBlocks.length !== 0) {
            button.addEventListener('click', function () {
                videoBlocks.forEach(function (video) {
                    var _a, _b, _c, _d, _e;
                    var dpElement = document.createElement('div');
                    var dp = new window.DPlayer({
                        container: dpElement,
                        video: {
                            url: video.getAttribute('src') || '',
                            type: 'auto',
                        },
                    });
                    var parent4 = (_c = (_b = (_a = video.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement;
                    (_d = parent4 === null || parent4 === void 0 ? void 0 : parent4.parentElement) === null || _d === void 0 ? void 0 : _d.insertBefore(dpElement, parent4);
                    parent4 === null || parent4 === void 0 ? void 0 : parent4.style.setProperty('display', 'none');
                    (_e = mains[0]) === null || _e === void 0 ? void 0 : _e.removeChild(button);
                });
            });
            // append first child
            (_a = mains[0]) === null || _a === void 0 ? void 0 : _a.insertBefore(button, mains[0].firstChild);
        }
        else {
            (_b = mains[0]) === null || _b === void 0 ? void 0 : _b.removeChild(button);
        }
    }
    console.log('monkey jumping on the bed.');
    var oldURL = location.href;
    setInterval(function () {
        if (location.href != oldURL) {
            console.log('URL changed');
            oldURL = location.href;
            // begin processing
            enhanceVideo();
        }
    }, 12000); // 每12秒检查一次
    setTimeout(function () {
        enhanceVideo();
    }, 7000);
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
if (false) {}
else {
    // 在生产环境打包时 webpack 会把 else 部分代码移除。使用动态导入就不会把这些代码打包进生产环境
    Promise.resolve().then(function () { return __importStar(__webpack_require__(171)); }).then(function (_a) {
        var isTampermonkey = _a.isTampermonkey;
        if (isTampermonkey()) {
            // 开发环境油猴脚本从这里开始运行
            Promise.resolve().then(function () { return __importStar(__webpack_require__(741)); }).then(function (_a) {
                var hotReload = _a.hotReload;
                // 载入在线调试热刷新
                hotReload();
                (0, app_1.default)();
            });
        }
        else {
            // 第一次启动时自动安装油猴脚本
            Promise.resolve().then(function () { return __importStar(__webpack_require__(480)); }).then(function (_a) {
                var autoInstall = _a.autoInstall;
                autoInstall();
            });
            // 运行不需要油猴环境的js，用于模拟目标网页原本逻辑。不需要模拟可以删除
            Promise.resolve().then(function () { return __importStar(__webpack_require__(236)); }).then(function (_a) {
                var mock = _a.mock;
                mock();
            });
        }
    });
}


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

/***/ 236:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mock = void 0;
// 简单模拟斗鱼播放器原本逻辑
var mock = function () {
    //mock
};
exports.mock = mock;


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