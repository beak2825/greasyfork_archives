// ==UserScript==
// @name         twitter media content warning remover
// @namespace    https://www.sapphire.sh/
// @description  remove content warning from tweets
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @author       sapphire
// @version      1688677568584
// @downloadURL https://update.greasyfork.org/scripts/439244/twitter%20media%20content%20warning%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/439244/twitter%20media%20content%20warning%20remover.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/twitter-media-warning-remover.ts":
/*!******************************************************!*\
  !*** ./src/scripts/twitter-media-warning-remover.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const main = () => {
    const observer = new MutationObserver(() => {
        const elements = Array.from(document.querySelectorAll('article div[role="button"].r-173mn98'));
        for (const element of elements) {
            element.click();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        main();
    }
    catch (error) {
        console.error(error);
    }
}))();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/scripts/twitter-media-warning-remover.ts"](0, __webpack_exports__);
/******/ 	
/******/ })()
;