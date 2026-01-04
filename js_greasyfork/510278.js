// ==UserScript==
// @name         【有谱么】阻止弹窗
// @version      0.1.0
// @description  阻止播放时弹出「提示登录」或「使用手机APP打开」的弹窗。
// @icon         https://cdn.yopu.co/img/logo.bd260b19.svg
// @match        https://yopu.co/view/*
// @grant        none
// @run-at       document-start
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510278/%E3%80%90%E6%9C%89%E8%B0%B1%E4%B9%88%E3%80%91%E9%98%BB%E6%AD%A2%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/510278/%E3%80%90%E6%9C%89%E8%B0%B1%E4%B9%88%E3%80%91%E9%98%BB%E6%AD%A2%E5%BC%B9%E7%AA%97.meta.js
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
const { log } = (0, logger_1.useLogger)("youpume-ban-model");
// 保存原始的setTimeout函数
const originalSetTimeout = window.setTimeout;
// 重新定义setTimeout函数
window.setTimeout = function (callback, delay) {
    log("setTimeout被调用", delay);
    if (delay === 60 * 1000 || delay === 15 * 1000) {
        log("hook阻止定时弹窗函数", callback, delay);
        return;
    }
    return originalSetTimeout(callback, delay);
};
log("setTimeout已成功被hook");

})();

/******/ })()
;