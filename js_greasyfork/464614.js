// ==UserScript==
// @name         Shopee Product Link Share Script
// @namespace    https://github.com/moontai0724
// @version      1.0.0
// @description  A script adds button to quickly copy product link without extra text.
// @author       moontai0724
// @match        https://shopee.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        none
// @supportURL   https://github.com/moontai0724/shopee-product-link-share-script/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464614/Shopee%20Product%20Link%20Share%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/464614/Shopee%20Product%20Link%20Share%20Script.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 607:
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
entrypoint();
function entrypoint() {
    return __awaiter(this, void 0, void 0, function () {
        var lastShareButton, link, shareButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitForElement(".sprite-product-sharing")];
                case 1:
                    _a.sent();
                    lastShareButton = Array.from(document.querySelectorAll(".sprite-product-sharing")).pop();
                    if (!lastShareButton) {
                        console.log("No share button found");
                        return [2 /*return*/];
                    }
                    link = getShareLink();
                    shareButton = createShareButton(lastShareButton, link);
                    return [2 /*return*/];
            }
        });
    });
}
function waitForElement(selector) {
    return new Promise(function (resolve) {
        var element = document.querySelector(selector);
        if (element)
            return resolve(element);
        var observer = new MutationObserver(function () {
            var element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    });
}
function getShareLink() {
    var _a = location.pathname.match(/-i\.(\d+)\.(\d+)/) || [], full = _a[0], shopId = _a[1], productId = _a[2];
    if (!shopId || !productId) {
        console.log("No shopId or productId found");
        throw new Error("No shopId or productId found");
    }
    return "".concat(location.origin, "/product/").concat(shopId, "/").concat(productId);
}
function createShareButton(after, link) {
    var button = document.createElement("button");
    button.textContent = "Share";
    button.style.marginLeft = "5px";
    button.style.height = "25px";
    button.style.width = "25px";
    button.style.borderRadius = "50%";
    button.style.border = "1px solid";
    button.style.padding = "0";
    button.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"><path d=\"M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z\"/></svg>";
    button.addEventListener("click", function () {
        navigator.clipboard.writeText(link);
        alert("Share link copied!\n" + link);
    });
    after.after(button);
    return button;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[607]();
/******/ 	
/******/ })()
;