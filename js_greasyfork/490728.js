// ==UserScript==
// @name         【哔哩哔哩】按键禁用
// @version      0.2.4
// @description  白嫖万岁
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490728/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E6%8C%89%E9%94%AE%E7%A6%81%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490728/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E6%8C%89%E9%94%AE%E7%A6%81%E7%94%A8.meta.js
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


/***/ }),

/***/ 997:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useBooleanMenu = void 0;
/**
 * 布尔菜单配置
 * @param configs 配置项
 * @returns 配置获取函数
 */
const useBooleanMenu = (configs) => {
    // 缓存
    const cache = {};
    // 获取配置
    const getConfig = (key) => {
        if (cache[key] !== undefined) {
            return cache[key];
        }
        let value = GM_getValue(key, configs[key].defaultValue);
        cache[key] = value;
        return value;
    };
    // 配置注册
    let menuIds = [];
    const registerMenuCommand = () => {
        menuIds.forEach((id) => {
            GM_unregisterMenuCommand(id);
        });
        menuIds = [];
        Object.entries(configs).forEach(([key, config]) => {
            let commandName = getConfig(key) ? "✅" : "❌";
            commandName += ` ${config.title}`;
            let id = GM_registerMenuCommand(commandName, () => {
                let newValue = !getConfig(key);
                let valueToSet = config.callback ? config.callback(newValue) : newValue;
                GM_setValue(key, valueToSet);
                cache[key] = valueToSet;
                registerMenuCommand();
            });
            menuIds.push(id);
        });
    };
    registerMenuCommand();
    return { getConfig };
};
exports.useBooleanMenu = useBooleanMenu;


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
const menu_1 = __webpack_require__(997);
const logger_1 = __webpack_require__(686);
const { log } = (0, logger_1.useLogger)("bilibili-ban-keyboard");
// 目标按键
const keysInfo = [
    { name: "q", description: "点赞" },
    { name: "w", description: "投币" },
    { name: "e", description: "收藏" },
    { name: "d", description: "关闭弹幕" },
    { name: "f", description: "全屏" },
    { name: "m", description: "静音" },
    { name: "[", description: "上一集" },
    { name: "]", description: "下一集" },
    { name: "ArrowLeft", description: "后退", title: "←" },
    { name: "ArrowRight", description: "前进", title: "→" },
];
const config = {};
keysInfo.forEach((value) => {
    const configKey = `block${value.name}`;
    const title = `禁用按键 ${value.title || value.name.toUpperCase()} - ${value.description}`;
    config[configKey] = { title, defaultValue: false };
});
const { getConfig } = (0, menu_1.useBooleanMenu)(config);
// 读取配置，是否阻止特定按键
const keysConfig = {};
keysInfo.forEach((key) => {
    keysConfig[key.name] = GM_getValue(`block${key.name.toUpperCase()}`, false);
});
// 阻止特定按键的函数
function preventCertainKeys(e) {
    if (config[`block${e.key}`] && getConfig(`block${e.key}`)) {
        log("阻止按键", e.key);
        e.stopPropagation();
    }
}
document.addEventListener("keydown", preventCertainKeys);

})();

/******/ })()
;