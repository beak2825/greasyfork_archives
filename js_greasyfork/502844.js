// ==UserScript==
// @name bilibili-guest
// @version 1.0.0
// @description Prevent automatic pause playback and login pop-ups
// @namespace http://tampermonkey.net/
// @author Wanten
// @homepage https://github.com/WantenMN/userscript-bilibili-guest
// @license https://opensource.org/licenses/MIT
// @match https://www.bilibili.com/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/502844/bilibili-guest.user.js
// @updateURL https://update.greasyfork.org/scripts/502844/bilibili-guest.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 829:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = blockElements;
const style = `

.recommended-swipe,
.login-panel-popover,
.login-tip,
.bili-login-card,
.bili-mini-mask,
.bpx-player-toast-auto,
.bpx-player-video-inputbar,
.up-info__btn-panel,
.h-f-btn
{
  display: none !important;
}

.right-entry {
  visibility: hidden !important;
}

.feed-card {
  margin-top: 0px !important;
}

`;
function blockElements() {
    GM_addStyle(style);
}


/***/ }),

/***/ 385:
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const blockElements_1 = __importDefault(__webpack_require__(829));
const preventAutoPause_1 = __importDefault(__webpack_require__(360));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, blockElements_1.default)();
        window.onload = preventAutoPause_1.default;
    });
}
main();


/***/ }),

/***/ 360:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = preventAutoPause;
function preventAutoPause() {
    let videoElement = document.querySelector("video");
    let userHasInteracted = false;
    if (!videoElement)
        return;
    console.log("bilibili-guest: ", videoElement);
    const resetUserInteraction = () => {
        setTimeout(() => {
            userHasInteracted = false;
        }, 500);
    };
    const handleVideoPause = () => {
        console.log("bilibili-guest: pause");
        if (!userHasInteracted) {
            videoElement && videoElement.play();
            console.log("Trying to prevent auto pause ###", new Date());
            userHasInteracted = false;
        }
    };
    videoElement === null || videoElement === void 0 ? void 0 : videoElement.addEventListener("pause", handleVideoPause);
    document.addEventListener("click", () => {
        userHasInteracted = true;
        resetUserInteraction();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            userHasInteracted = true;
            resetUserInteraction();
        }
    });
    setInterval(() => {
        if (videoElement !== document.querySelector("video")) {
            videoElement = document.querySelector("video");
            console.log("bilibili-guest: ", videoElement);
            videoElement === null || videoElement === void 0 ? void 0 : videoElement.addEventListener("pause", handleVideoPause);
        }
    }, 10 * 1000);
}


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
/******/ 	var __webpack_exports__ = __webpack_require__(385);
/******/
/******/ })()
;