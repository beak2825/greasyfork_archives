// ==UserScript==
// @name        海角社区破解
// @description   脚本目前仅适用网站haijiao.pro 的8月15日之前的付费视频解锁
// @version      5.3
// @author       t.me/nk9919
// @match       https://www.haijiao.pro/post/details?pid=*
// @match       https://haijiao.pro/post/details?pid=*
// @grant       none
// @iconURL     https://www.haijiao.pro/favicon.ico
// @license     gplv3
// @namespace   http://tampermonkey.net/
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/513812/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/513812/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==
 
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({
 
/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
 
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   create_full_m3u8: () => (/* binding */ create_full_m3u8),\n/* harmony export */   is_m3u8_preview_request: () => (/* binding */ is_m3u8_preview_request)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\r\nconst TS_URL_PATTERN = /_i([0-9]+)[.]ts$/;\r\nconst KEY_URI_PATTERN = /#EXT-X-KEY:METHOD=AES-128,URI=\"(.+?)\",IV=/;\r\nconst END_TAG = \"#EXT-X-ENDLIST\";\r\nconst EXTINF = \"#EXTINF:1.25,\";\r\nfunction is_m3u8_preview_request(method, url) {\r\n    if (method !== \"GET\") {\r\n        return false;\r\n    }\r\n    const is_preview = url.endsWith(\"_i_preview.m3u8\");\r\n    if (is_preview) {\r\n        _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"Preview request detected:\", url);\r\n    }\r\n    return is_preview;\r\n}\r\nfunction is_ts_url(url) {\r\n    return /_i[0-9]+[.]ts$/.test(url);\r\n}\r\nfunction extract_index(ts_url) {\r\n    // ['_i7.ts', '7']\r\n    const matches = ts_url.match(TS_URL_PATTERN);\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(matches != null, `无法从 ts url 中提取序号: ${ts_url}`);\r\n    const index = parseInt(matches[1]);\r\n    return index;\r\n}\r\nasync function find_max_index(test, high) {\r\n    let low = 0;\r\n    while (high - low > 1) {\r\n        const mid = Math.floor((low + high) / 2);\r\n        if (await test(mid)) {\r\n            low = mid;\r\n        }\r\n        else {\r\n            high = mid;\r\n        }\r\n    }\r\n    return low;\r\n}\r\nfunction get_common_prefix(ts_url) {\r\n    const sep = \"_i\";\r\n    return ts_url.split(sep).slice(0, -1).join(sep);\r\n}\r\nfunction create_video_record(common_prefix, index) {\r\n    return `${EXTINF}\\n${common_prefix}_i${index}.ts`;\r\n}\r\nfunction is_not_end_tag(line) {\r\n    return !line.includes(END_TAG);\r\n}\r\nfunction full_key_uri(m3u8, base_url) {\r\n    const matches = m3u8.match(KEY_URI_PATTERN);\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(matches !== null, \"无法从 m3u8 文件中提取 key uri\");\r\n    const key_uri = matches[1];\r\n    return `${base_url}/${key_uri}`;\r\n}\r\nasync function create_full_m3u8(create_test, m3u8, base_url) {\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(`原始 m3u8 内容:\\n${m3u8}`);\r\n    const lines = m3u8\r\n        .split(\"\\n\")\r\n        .filter(_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.is_not_empty)\r\n        .filter(is_not_end_tag);\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"过滤后的 m3u8 内容:\\n\" + lines.join(\"\\n\"));\r\n    const ts_url = _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.find_last(lines, is_ts_url);\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.assert(ts_url != null, \"无法在 m3u8 文件中找到 ts 文件的 URL\");\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"最后一个 ts 文件的 URL:\", ts_url);\r\n    const upper_limit = 10000;\r\n    const test = create_test(ts_url.replace(TS_URL_PATTERN, \"_i{index}.ts\"));\r\n    const end = await find_max_index(test, upper_limit);\r\n    const begin = extract_index(ts_url) + 1;\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"找到的最大 ts 序号:\", end);\r\n    const prefix = get_common_prefix(ts_url);\r\n    const video_records = Array\r\n        .from(_utils__WEBPACK_IMPORTED_MODULE_0__.Utils.range(begin, end + 1))\r\n        .map(create_video_record.bind(null, prefix));\r\n    const new_lines = [\r\n        ...lines,\r\n        ...video_records,\r\n        END_TAG\r\n    ];\r\n    const full_m3u8 = new_lines.join(\"\\n\");\r\n    const full_uri = full_key_uri(m3u8, base_url);\r\n    _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"完整的 KEY URI: \", full_uri);\r\n    const full_m3u8_with_key = full_m3u8.replace(KEY_URI_PATTERN, `#EXT-X-KEY:METHOD=AES-128,URI=\"${full_uri}\",IV=`);\r\n    return full_m3u8_with_key;\r\n}\r\n\n\n//# sourceURL=webpack://haijiao-helper/./src/core.ts?");
 
/***/ }),
 
/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
 
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ \"./src/core.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n/* harmony import */ var _xhr_hook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xhr_hook */ \"./src/xhr_hook.ts\");\n\r\n\r\n\r\nfunction create_test(url_without_index) {\r\n    async function test(index) {\r\n        const url = url_without_index.replace(\"{index}\", `${index}`);\r\n        try {\r\n            const response = await fetch(url, { method: \"HEAD\" });\r\n            return response.ok;\r\n        }\r\n        catch (error) {\r\n            // Utils.error(error as Error);\r\n            return false;\r\n        }\r\n    }\r\n    return test;\r\n}\r\nfunction run_at_start() {\r\n    _utils__WEBPACK_IMPORTED_MODULE_1__.Utils.info(\"【haijiao-pro-video-crack】已启动\");\r\n    _xhr_hook__WEBPACK_IMPORTED_MODULE_2__.XHRHook.hook(_core__WEBPACK_IMPORTED_MODULE_0__.is_m3u8_preview_request, _core__WEBPACK_IMPORTED_MODULE_0__.create_full_m3u8.bind(null, create_test));\r\n}\r\nfunction run_at_idle() {\r\n}\r\nfunction main() {\r\n    document.addEventListener(\"DOMContentLoaded\", run_at_idle, true);\r\n    run_at_start();\r\n}\r\nmain();\r\n\n\n//# sourceURL=webpack://haijiao-helper/./src/main.ts?");
 
/***/ }),
 
/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
 
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Utils: () => (/* binding */ Utils)\n/* harmony export */ });\nconst BTN_STYLE = `\n    position: fixed;\n    left: 1em;\n    width: 4em;\n    top: 50%;\n    height: 3em;\n    border-radius: 50%;\n    text-align: center;\n    font-size: 1.5em;\n    background-color: white;\n`;\r\nclass Utils {\r\n    constructor() { }\r\n    static now() {\r\n        const _now = new Date()\r\n            .toISOString()\r\n            .slice(11, 23)\r\n            .replace('T', ' ')\r\n            .replace('Z', '');\r\n        return _now;\r\n    }\r\n    static info(...args) {\r\n        console.info(`[${Utils.now()}]`, ...args);\r\n    }\r\n    static error(error) {\r\n        console.info(`[${Utils.now()}]`, error);\r\n    }\r\n    static access_xhr_resp_text(xhr, get_text) {\r\n        Object.defineProperty(xhr, \"response\", {\r\n            enumerable: true,\r\n            configurable: false,\r\n            get: get_text\r\n        });\r\n    }\r\n    static *reversed(iterable) {\r\n        const arr = Array.from(iterable);\r\n        for (let i = arr.length - 1; i >= 0; i--) {\r\n            yield arr[i];\r\n        }\r\n    }\r\n    static find(iterable, predicate) {\r\n        for (const item of iterable) {\r\n            if (predicate(item)) {\r\n                return item;\r\n            }\r\n        }\r\n        return null;\r\n    }\r\n    static find_last(iterable, predicate) {\r\n        const reversed = Utils.reversed(iterable);\r\n        return Utils.find(reversed, predicate);\r\n    }\r\n    static assert(condition, message) {\r\n        if (!condition) {\r\n            throw new Error(message || 'Assertion failed');\r\n        }\r\n    }\r\n    static is_not_empty(text) {\r\n        return text !== null\r\n            && text !== undefined\r\n            && text.trim().length > 0;\r\n    }\r\n    static any(iterable, predicate) {\r\n        for (const item of iterable) {\r\n            if (predicate(item)) {\r\n                return true;\r\n            }\r\n        }\r\n        return false;\r\n    }\r\n    static str_arr(arr) {\r\n        const body = arr\r\n            .map((item) => `\"${item}\"`)\r\n            .join(\", \");\r\n        return `[${body}]`;\r\n    }\r\n    static *range(start, end, step = 0) {\r\n        const _step = (step === 0 ? 1 : step);\r\n        const nums = [start, end, _step];\r\n        const nums_are_valid = nums.every(Number.isFinite);\r\n        Utils.assert(nums_are_valid, `每个数字都必须是有限的! ${Utils.str_arr(nums)}`);\r\n        for (let i = start; i < end; i += _step) {\r\n            yield i;\r\n        }\r\n    }\r\n    static combine_onload(prev, post) {\r\n        Utils.info('combine_onload', prev, post);\r\n        return async function (ev) {\r\n            await prev.call(this, ev);\r\n            await post.call(this, ev);\r\n        };\r\n    }\r\n    static get_video_title() {\r\n        var _a, _b, _c;\r\n        return (_c = (_b = (_a = document\r\n            .querySelector(\"#details-page h2\")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.slice(0, 6)) !== null && _c !== void 0 ? _c : \"video\";\r\n    }\r\n    static add_save_m3u8_btn(m3u8, fname) {\r\n        const blob = new Blob([m3u8], { type: 'application/x-mpegURL' });\r\n        const url = URL.createObjectURL(blob);\r\n        Utils.info('完整 m3u8 blob url:', url);\r\n        const a = document.createElement('a');\r\n        a.href = url;\r\n        a.download = `${fname}.m3u8`;\r\n        a.textContent = \"保存 m3u8\";\r\n        a.setAttribute(\"style\", BTN_STYLE);\r\n        document.body.insertAdjacentElement(\"afterbegin\", a);\r\n    }\r\n    static get_parent_path(url) {\r\n        return url\r\n            .split(\"/\")\r\n            .slice(0, -1)\r\n            .join(\"/\");\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://haijiao-helper/./src/utils.ts?");
 
/***/ }),
 
/***/ "./src/xhr_hook.ts":
/*!*************************!*\
  !*** ./src/xhr_hook.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
 
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   XHRHook: () => (/* binding */ XHRHook)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n\r\nclass XHRHook {\r\n    constructor() { }\r\n    static hook(is_target, change_result) {\r\n        const xhr_proto = XMLHttpRequest.prototype;\r\n        const _open = xhr_proto.open;\r\n        xhr_proto.open = function (method, url) {\r\n            const xhr = this;\r\n            if (!is_target(method, url)) {\r\n                return _open.call(xhr, method, url, true);\r\n            }\r\n            const base_url = _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.get_parent_path(url);\r\n            _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"提取的 base_url:\", url);\r\n            async function change_video_src(_) {\r\n                _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.info(\"响应文本:\", xhr.responseText);\r\n                const new_m3u8 = await change_result(xhr.responseText, base_url);\r\n                _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.add_save_m3u8_btn(new_m3u8, _utils__WEBPACK_IMPORTED_MODULE_0__.Utils.get_video_title());\r\n            }\r\n            ;\r\n            xhr.addEventListener(\"load\", change_video_src, true);\r\n            return _open.call(xhr, method, url, true);\r\n        };\r\n    }\r\n}\r\nXHRHook.text = \"\";\r\n\n\n//# sourceURL=webpack://haijiao-helper/./src/xhr_hook.ts?");
 
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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;