// ==UserScript==
// @name be-careful-when-pr
// @name:zh-CN 提交pr要小心
// @version 0.1.0
// @namespace https://github.com/lightsing/be-careful-when-pr/
// @description Visually warn you when you are going to open a pr to upstream.
// @description:zh-CN 在跨仓库提交 pr 时给予视觉警告
// @author lightsing
// @license AGPL-3.0
// @homepage https://github.com/lightsing/be-careful-when-pr#readme
// @match https://github.com/*
// @downloadURL https://update.greasyfork.org/scripts/454700/be-careful-when-pr.user.js
// @updateURL https://update.greasyfork.org/scripts/454700/be-careful-when-pr.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.waitForElm = exports.$ = void 0;
const $ = (s) => document.querySelector(s);
exports.$ = $;
const waitForElm = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};
exports.waitForElm = waitForElm;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleRepo = exports.isRepoRegex = void 0;
const util_1 = __webpack_require__(1);
exports.isRepoRegex = /^https:\/\/github\.com\/[^/]+\/[^/?#\s]+([?#]\S+)?$/mi;
const compareBtnHrefRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/compare\/[^?#]+([?#]\S+)?$/mi;
const handleRepo = () => {
    const isForked = (0, util_1.$)('#repository-container-header > div > div > div > svg.octicon-repo-forked') !== null;
    if (!isForked)
        return;
    (0, util_1.waitForElm)('div.js-socket-channel.js-updatable-content > div.flash-warn svg.octicon-git-branch')
        .then(() => {
        const btn = (0, util_1.$)('div.js-socket-channel.js-updatable-content > div.flash-warn > div > a');
        if (!compareBtnHrefRegex.test(btn.href))
            return;
        btn.style.backgroundColor = "var(--color-danger-fg)";
    });
};
exports.handleRepo = handleRepo;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleCompare = exports.isCompareRegex = void 0;
const util_1 = __webpack_require__(1);
exports.isCompareRegex = /^https:\/\/github\.com\/([^/]+)\/[^/]+\/compare\/[^.]+\.{3}([^:]+):[^:]+:[^?#]+([?#]\S+)?$/mi;
const handleCompare = () => {
    const [_, target, source,] = window.location.href.match(exports.isCompareRegex);
    if (target === source)
        return;
    (0, util_1.waitForElm)('#new_pull_request div.Layout-main div.BtnGroup > button[type=submit]').then((e) => {
        e.style.backgroundColor = "var(--color-danger-fg)";
        const dropDown = (0, util_1.$)('#new_pull_request div.Layout-main div.BtnGroup > details.select-menu > summary');
        dropDown.style.backgroundColor = "var(--color-danger-fg)";
    });
};
exports.handleCompare = handleCompare;


/***/ })
/******/ 	]);
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

Object.defineProperty(exports, "__esModule", ({ value: true }));
const repo_1 = __webpack_require__(2);
const compare_1 = __webpack_require__(3);
const current = window.location.href;
if (repo_1.isRepoRegex.test(current))
    (0, repo_1.handleRepo)();
else if (compare_1.isCompareRegex.test(current))
    (0, compare_1.handleCompare)();

})();

/******/ })()
;