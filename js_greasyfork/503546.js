// ==UserScript==
// @name         【哔哩哔哩】显示合集中的视频
// @version      0.1.2
// @description  已登录且以自己视角查看时，显示合集中的视频。
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://space.bilibili.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503546/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E6%98%BE%E7%A4%BA%E5%90%88%E9%9B%86%E4%B8%AD%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/503546/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E6%98%BE%E7%A4%BA%E5%90%88%E9%9B%86%E4%B8%AD%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 686:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useLogger = void 0;
const createLoggerFunction = (consoleMethod, prefix, name) => consoleMethod.bind(console, prefix, name ? `[${name}]` : "");
/**
 * 生成 Logger
 * @param name 前缀
 * @returns console.log
 */
const useLogger = (name) => {
    const prefix = "AkagiYui";
    return {
        log: createLoggerFunction(console.log, prefix, name),
        warn: createLoggerFunction(console.warn, prefix, name),
        error: createLoggerFunction(console.error, prefix, name),
        info: createLoggerFunction(console.info, prefix, name),
        debug: createLoggerFunction(console.debug, prefix, name),
        useLogger: (subName) => (0, exports.useLogger)(`${name ? name + ":" : ""}${subName}`),
    };
};
exports.useLogger = useLogger;


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const logger_1 = __webpack_require__(686);
const { log } = (0, logger_1.useLogger)("bilibili-show-videos-in-collection");
const pageWindow = unsafeWindow;
const originalDefineProperty = pageWindow.Object.defineProperty;
pageWindow.Object.defineProperty = function (target, propertyKey, descriptor) {
    if (propertyKey === "visibleVideoList") {
        log("定义 应显示视频列表", target, descriptor, descriptor.get, descriptor.set);
        const originGetter = descriptor.get.bind(target);
        return originalDefineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                log("获取 应显示视频列表", this);
                // favListDetails: 收藏夹视频列表
                // submitVideos: 投稿视频列表
                return this.favListDetails?.medias ?? this.submitVideos?.vlist ?? originGetter();
            },
            set: () => { },
        });
        // 为确保在转到其他路由再次加载时仍然有效，此处不可恢复defineProperty。
    }
    return originalDefineProperty(target, propertyKey, descriptor);
};

})();

/******/ })()
;