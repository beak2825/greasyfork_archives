// ==UserScript==
// @name         twitter icon replacer
// @namespace    https://www.sapphire.sh/
// @description  replace the current x icon to the old twitter icon
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        GM_addStyle
// @author       sapphire
// @version      1690253800463
// @downloadURL https://update.greasyfork.org/scripts/471644/twitter%20icon%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/471644/twitter%20icon%20replacer.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@sapphire-sh/utils/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@sapphire-sh/utils/lib/index.js ***!
  \******************************************************/
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./scripts */ "./node_modules/@sapphire-sh/utils/lib/scripts/index.js"), exports);


/***/ }),

/***/ "./node_modules/@sapphire-sh/utils/lib/scripts/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@sapphire-sh/utils/lib/scripts/index.js ***!
  \**************************************************************/
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./sleep */ "./node_modules/@sapphire-sh/utils/lib/scripts/sleep.js"), exports);


/***/ }),

/***/ "./node_modules/@sapphire-sh/utils/lib/scripts/sleep.js":
/*!**************************************************************!*\
  !*** ./node_modules/@sapphire-sh/utils/lib/scripts/sleep.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sleep = void 0;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;


/***/ }),

/***/ "./src/helpers/index.ts":
/*!******************************!*\
  !*** ./src/helpers/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./waitForElement */ "./src/helpers/waitForElement.ts"), exports);


/***/ }),

/***/ "./src/helpers/waitForElement.ts":
/*!***************************************!*\
  !*** ./src/helpers/waitForElement.ts ***!
  \***************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.waitForElement = void 0;
const utils_1 = __webpack_require__(/*! @sapphire-sh/utils */ "./node_modules/@sapphire-sh/utils/lib/index.js");
const waitForElement = (selector) => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        const e = document.querySelectorAll(selector);
        if (e.length > 0) {
            return e;
        }
        yield (0, utils_1.sleep)(100);
    }
});
exports.waitForElement = waitForElement;


/***/ }),

/***/ "./src/scripts/twitter-icon-replacer.ts":
/*!**********************************************!*\
  !*** ./src/scripts/twitter-icon-replacer.ts ***!
  \**********************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(/*! @sapphire-sh/utils */ "./node_modules/@sapphire-sh/utils/lib/index.js");
const helpers_1 = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
const ICON_A = 'data:image/png;base64,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';
const ICON_B = 'data:image/vnd.microsoft.icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=';
const ICON_C = '<g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g>';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    {
        const iconEl = yield (0, helpers_1.waitForElement)('[href="/home"][role="link"]:not([data-testid="AppTabBar_Home_Link"])');
        if ((iconEl === null || iconEl === void 0 ? void 0 : iconEl[0]) && iconEl[0] instanceof HTMLElement) {
            const svgEl = iconEl[0].getElementsByTagName('svg');
            if (svgEl === null || svgEl === void 0 ? void 0 : svgEl[0]) {
                svgEl[0].innerHTML = ICON_C;
                if (!isDarkMode()) {
                    svgEl[0].style.color = 'rgb(29, 155, 240)';
                }
                iconEl[0].style.opacity = '1';
            }
        }
    }
    {
        const iconEl = yield (0, helpers_1.waitForElement)('[rel="apple-touch-icon"]');
        if (iconEl === null || iconEl === void 0 ? void 0 : iconEl[0]) {
            if (iconEl[0] instanceof HTMLLinkElement) {
                iconEl[0].href = ICON_A;
            }
        }
    }
    {
        const iconEl = yield (0, helpers_1.waitForElement)('[rel="shortcut icon"]');
        if (iconEl === null || iconEl === void 0 ? void 0 : iconEl[0]) {
            if (iconEl[0] instanceof HTMLLinkElement) {
                iconEl[0].href = ICON_B;
            }
        }
    }
    // {
    // 	const iconEl = await waitForElement('[aria-label="Loading…"]');
    // 	if (iconEl?.[0]) {
    // 		const svgEl = iconEl[0].getElementsByTagName('svg');
    // 		if (svgEl?.[0]) {
    // 			svgEl[0].innerHTML = ICON_C;
    // 			svgEl[0].style.color = 'rgb(29, 155, 240)';
    // 		}
    // 	}
    // }
});
const isDarkMode = () => {
    return !['#FFFFFF', 'rgb(255, 255, 255)'].includes(document.body.style.backgroundColor);
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        main();
        document.addEventListener('load', main);
        const observer = new MutationObserver(main);
        let target = null;
        do {
            yield (0, utils_1.sleep)(1000);
            target = document.body;
        } while (target === null);
        const options = {
            attributes: true,
            attributeFilter: ['style'],
        };
        observer.observe(target, options);
    }
    catch (error) {
        console.error(error);
    }
}))();
GM_addStyle(`
[href="/home"][role="link"]:not([data-testid="AppTabBar_Home_Link"]) {
	opacity: 0;
}
`);


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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/twitter-icon-replacer.ts");
/******/ 	
/******/ })()
;