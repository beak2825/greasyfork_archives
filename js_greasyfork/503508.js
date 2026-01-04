// ==UserScript==
// @name                monkey-kintone-show-avatar
// @namespace           https://github.com/forestsheep911/monkey-kintone-show-avatar
// @version             0.0.2
// @description         show kintone avatar easily
// @author              boccaroo
// @copyright           boccaroo
// @license             MIT
// @match               https://*.cybozu.cn/k/*
// @match               https://*.cybozu.com/k/*
// @match               https://*.cybozu-dev.com/k/*
// @match               https://*.kintone.com/k/*
// @match               https://*.s.cybozu.cn/k/*
// @match               https://*.s.cybozu.com/k/*
// @match               https://*.s.kintone.com/k/*

// @run-at              document-end
// @supportURL          https://github.com/forestsheep911/monkey-kintone-show-avatar/issues
// @homepage            https://github.com/forestsheep911/monkey-kintone-show-avatar

// @icon                https://img.icons8.com/ios/50/000000/happy-eyes.png
// @downloadURL https://update.greasyfork.org/scripts/503508/monkey-kintone-show-avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/503508/monkey-kintone-show-avatar.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var app = function () {
    setTimeout(function () {
        var readUnread = document.querySelectorAll('div.gaia-argoui-toggleswitch-option');
        if (readUnread.length >= 2) {
            readUnread[0].addEventListener('mouseup', function () {
                showAvatar();
            });
            readUnread[1].addEventListener('mouseup', function () {
                showAvatar();
            });
        }
    }, 2000);
    showAvatar();
    window.addEventListener('hashchange', function () {
        setTimeout(function () {
            showAvatar();
        }, 2000);
    });
    function showAvatar() {
        setTimeout(function () {
            var findusericon = document.querySelectorAll('span.User-cybozu, .itemlist-userImage-gaia, a.recordlist-username-gaia, .ocean-ntf-ntfitem-img > span, span.itemlist-userImage-gaia, .ocean-ui-comments-commentbase-entity div, .ocean-ntf-menuitem-img > span');
            if (findusericon.length != 0) {
                findusericon.forEach(function (element) {
                    var usericon = document.createElement('img');
                    usericon.style.display = 'none';
                    element.addEventListener('mouseenter', function (e) {
                        document.body.appendChild(usericon);
                        var thisSpan = e.target;
                        var innerImg = thisSpan.querySelector('img');
                        if (innerImg) {
                            usericon.src = innerImg.src.replace(/SMALL|NORMAL/g, 'ORIGINAL');
                        }
                        var spanBackground = thisSpan.style.backgroundImage;
                        if (spanBackground) {
                            var imgUrlRex = RegExp(/https.*png/g);
                            var resultUrl = imgUrlRex.exec(spanBackground);
                            console.log(resultUrl);
                            if (resultUrl && resultUrl.length > 0) {
                                usericon.src = resultUrl[0].replace(/SIZE_\d+/g, 'ORIGINAL');
                            }
                        }
                        usericon.onload = function () {
                            usericon.style.position = 'fixed';
                            usericon.style.display = 'block';
                            var me = e;
                            var leftOffset = me.clientX > window.innerWidth / 2 ? 0.25 : 0.75;
                            usericon.style.width = window.innerWidth / 4 + 'px';
                            usericon.style.left = (window.innerWidth - usericon.width) * leftOffset + 'px';
                            usericon.style.top = (window.innerHeight - usericon.height) / 2 + 'px';
                            usericon.style.zIndex = '9999';
                        };
                    });
                    element.addEventListener('mouseout', function () {
                        if (usericon) {
                            usericon.remove();
                        }
                    });
                });
            }
        }, 2000);
    }
};
exports["default"] = app;


/***/ }),

/***/ 607:
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var app_1 = __importDefault(__webpack_require__(752));
if (true) {
    (0, app_1.default)();
}
else {}


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
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;