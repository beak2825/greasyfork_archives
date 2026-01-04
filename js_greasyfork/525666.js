// ==UserScript==
// @name        Furaffinity-Prototype-Extensions
// @namespace   Violentmonkey Scripts
// @grant       GM_info
// @version     1.0.1
// @author      Midori Dragon
// @description Library to hold common prototype extensions for your Furaffinity Script
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/525666-furaffinity-prototype-extensions
// @supportURL  https://greasyfork.org/scripts/525666-furaffinity-prototype-extensions/feedback
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var __webpack_modules__ = {
        177: () => {
            Node.prototype.insertBeforeThis = function(newNode) {
                var _a;
                null === (_a = this.parentNode) || void 0 === _a || _a.insertBefore(newNode, this);
            };
            Node.prototype.insertAfterThis = function(newNode) {
                var _a;
                null === (_a = this.parentNode) || void 0 === _a || _a.insertBefore(newNode, this.nextSibling);
            };
            Node.prototype.getIndexOfThis = function() {
                if (null == this.parentNode) return -1;
                return Array.from(this.parentNode.children).indexOf(this);
            };
            Node.prototype.readdToDom = function() {
                var _a;
                const clone = this.cloneNode(false);
                null === (_a = this.parentNode) || void 0 === _a || _a.replaceChild(clone, this);
                return clone;
            };
        },
        536: () => {
            String.prototype.trimEnd = function(toTrim) {
                if (null == toTrim) return "";
                if ("" === toTrim || "" === this) return this.toString();
                let result = this.toString();
                for (;result.endsWith(toTrim); ) result = result.slice(0, -toTrim.length);
                return result;
            };
            String.prototype.trimStart = function(toTrim) {
                if (null == toTrim) return "";
                if ("" === toTrim || "" === this) return this.toString();
                let result = this.toString();
                for (;result.startsWith(toTrim); ) result = result.slice(toTrim.length);
                return result;
            };
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    __webpack_require__.n = module => {
        var getter = module && module.__esModule ? () => module.default : () => module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    __webpack_require__(177), __webpack_require__(536);
})();