// ==UserScript==
// @name         【哔哩哔哩】添加分P
// @version      0.2.2
// @description  显示“添加分P”的按钮
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://member.bilibili.com/platform/*
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502039/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E6%B7%BB%E5%8A%A0%E5%88%86P.user.js
// @updateURL https://update.greasyfork.org/scripts/502039/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E6%B7%BB%E5%8A%A0%E5%88%86P.meta.js
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
const { log } = (0, logger_1.useLogger)("bilibili-show-add-p-button");
const pageWindow = unsafeWindow;
const originalDefineProperty = pageWindow.Object.defineProperty;
pageWindow.Object.defineProperty = function (target, propertyKey, descriptor) {
    if (propertyKey === "showAddButton") {
        originalDefineProperty(target, "canMultiP", {
            configurable: true,
            enumerable: true,
            get: () => {
                log("显示添加分P按钮");
                return true;
            },
            set: () => { },
        });
        // 为确保在转到其他路由再次加载时仍然有效，此处不可恢复defineProperty。
    }
    return originalDefineProperty(target, propertyKey, descriptor);
};
const originalXHR = pageWindow.XMLHttpRequest;
const xhrOpen = originalXHR.prototype.open;
originalXHR.prototype.open = function (_, url) {
    if (arguments[1].includes("/x/vu/web/add/v3")) {
        log("请求分P投稿", JSON.parse(JSON.stringify(arguments)));
        arguments[1] = arguments[1].replace("/x/vu/web/add/v3", "/x/vu/web/add");
    }
    return xhrOpen.apply(this, arguments);
};

})();

/******/ })()
;