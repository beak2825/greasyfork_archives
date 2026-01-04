// ==UserScript==
// @name         esa.io cpl
// @namespace    https://github.com/fushihara/esa-io-cpl
// @match        https://*.esa.io/posts/*
// @description  esa.ioのソースコードハイライト表示に機能追加
// @version      2.3.0
// @grant        none
// @license      MIT
// @source       https://github.com/fushihara/esa-io-cpl
// @homepage     https://greasyfork.org/ja/scripts/410892
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410892/esaio%20cpl.user.js
// @updateURL https://update.greasyfork.org/scripts/410892/esaio%20cpl.meta.js
// ==/UserScript==
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/esaCodeCopy.ts":
/*!****************************!*\
  !*** ./src/esaCodeCopy.ts ***!
  \****************************/
/*! exports provided: EsaCodeCopy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EsaCodeCopy", function() { return EsaCodeCopy; });
const styleRuleInsertLog = new WeakMap();
const cssPrefix = `k777`;
class EsaCodeCopy {
    constructor(element) {
        this.element = element;
        const fileNameElement = element.querySelector(".code-filename");
        if (fileNameElement) {
            const fileName = element.querySelector(".code-filename").innerText;
            const insertElement = document.createElement("div");
            insertElement.classList.add(cssPrefix);
            insertElement.classList.add("code-block__copy-button");
            for (let v of getButtons(fileName)) {
                insertElement.appendChild(v.button);
            }
            element.querySelector(".highlight").appendChild(insertElement);
        }
        EsaCodeCopy.insertStyleRule();
    }
    static insertStyleRule() {
        if (styleRuleInsertLog.has(document)) {
            return;
        }
        styleRuleInsertLog.set(document, true);
        const styleEl = document.createElement("style");
        document.head.appendChild(styleEl);
        styleEl.sheet.insertRule(`.markdown .code-block__copy-button.${cssPrefix}{ position: absolute;top: -25px;right: 0;border:0;}`);
        styleEl.sheet.insertRule(`.markdown .code-block__copy-button.${cssPrefix} button{ font-family: monospace; font-size: 13px;line-height: 13px; }`);
        // デフォルトのコードハイライトの高さを変える
        styleEl.sheet.insertRule(`pre.highlight {line-height:13px;font-size:12px;font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace; }`);
    }
}
function copyText(str) {
    navigator.clipboard.writeText(str);
}
function getButtons(filePath) {
    const result = [];
    const splitPath = [...filePath.split(/[\\\/]/)];
    if (1 < splitPath.length) {
        const element = document.createElement("button");
        element.innerText = filePath;
        element.addEventListener("click", () => {
            copyText(filePath);
        });
        result.push({
            button: element,
            type: "all",
        });
    }
    for (let path of splitPath) {
        const element = document.createElement("button");
        element.innerText = path;
        element.addEventListener("click", () => {
            copyText(path);
        });
        result.push({
            button: element,
            type: "path",
        });
    }
    return result;
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esaCodeCopy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esaCodeCopy */ "./src/esaCodeCopy.ts");

main();
function main() {
    const elements = document.querySelectorAll(".markdown > div.code-block");
    for (let e of elements) {
        new _esaCodeCopy__WEBPACK_IMPORTED_MODULE_0__["EsaCodeCopy"](e);
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VzYUNvZGVDb3B5LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQSxNQUFNLGtCQUFrQixHQUErQixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ3JFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUNsQixNQUFNLFdBQVc7SUFDdEIsWUFBNkIsT0FBdUI7UUFBdkIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDbEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBYyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdFLElBQUksZUFBZSxFQUFFO1lBQ25CLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxh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QUNQLFNBQVMsSUFBSTtJQUNYLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBaUIsNEJBQTRCLENBQUMsQ0FBQztJQUN6RixLQUFLLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUN0QixJQUFJLHdEQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEI7QUFDSCxDQUFDIiwiZmlsZSI6InNjcmlwdC51c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJjb25zdCBzdHlsZVJ1bGVJbnNlcnRMb2c6IFdlYWtNYXA8RG9jdW1lbnQsIGJvb2xlYW4+ID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGNzc1ByZWZpeCA9IGBrNzc3YDtcbmV4cG9ydCBjbGFzcyBFc2FDb2RlQ29weSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICBjb25zdCBmaWxlTmFtZUVsZW1lbnQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvZGUtZmlsZW5hbWVcIik7XG4gICAgaWYgKGZpbGVOYW1lRWxlbWVudCkge1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNvZGUtZmlsZW5hbWVcIikuaW5uZXJUZXh0O1xuICAgICAgY29uc3QgaW5zZXJ0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBpbnNlcnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoY3NzUHJlZml4KTtcbiAgICAgIGluc2VydEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNvZGUtYmxvY2tfX2NvcHktYnV0dG9uXCIpO1xuICAgICAgZm9yIChsZXQgdiBvZiBnZXRCdXR0b25zKGZpbGVOYW1lKSkge1xuICAgICAgICBpbnNlcnRFbGVtZW50LmFwcGVuZENoaWxkKHYuYnV0dG9uKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaWdobGlnaHRcIikuYXBwZW5kQ2hpbGQoaW5zZXJ0RWxlbWVudCk7XG4gICAgfVxuICAgIEVzYUNvZGVDb3B5Lmluc2VydFN0eWxlUnVsZSgpO1xuICB9XG4gIHByaXZhdGUgc3RhdGljIGluc2VydFN0eWxlUnVsZSgpIHtcbiAgICBpZiAoc3R5bGVSdWxlSW5zZXJ0TG9nLmhhcyhkb2N1bWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3R5bGVSdWxlSW5zZXJ0TG9nLnNldChkb2N1bWVudCwgdHJ1ZSk7XG4gICAgY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xuICAgIHN0eWxlRWwuc2hlZXQuaW5zZXJ0UnVsZShgLm1hcmtkb3duIC5jb2RlLWJsb2NrX19jb3B5LWJ1dHRvbi4ke2Nzc1ByZWZpeH17IHBvc2l0aW9uOiBhYnNvbHV0ZTt0b3A6IC0yNXB4O3JpZ2h0OiAwO2JvcmRlcjowO31gKTtcbiAgICBzdHlsZUVsLnNoZWV0Lmluc2VydFJ1bGUoYC5tYXJrZG93biAuY29kZS1ibG9ja19fY29weS1idXR0b24uJHtjc3NQcmVmaXh9IGJ1dHRvbnsgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTsgZm9udC1zaXplOiAxM3B4O2xpbmUtaGVpZ2h0OiAxM3B4OyB9YCk7XG4gICAgLy8g44OH44OV44Kp44Or44OI44Gu44Kz44O844OJ44OP44Kk44Op44Kk44OI44Gu6auY44GV44KS5aSJ44GI44KLXG4gICAgc3R5bGVFbC5zaGVldC5pbnNlcnRSdWxlKGBwcmUuaGlnaGxpZ2h0IHtsaW5lLWhlaWdodDoxM3B4O2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OlNGTW9uby1SZWd1bGFyLENvbnNvbGFzLExpYmVyYXRpb24gTW9ubyxNZW5sbyxtb25vc3BhY2U7IH1gKTtcbiAgfVxufVxuZnVuY3Rpb24gY29weVRleHQoc3RyOiBzdHJpbmcpIHtcbiAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc3RyKTtcbn1cbnR5cGUgQnV0dG9uVHlwZSA9IHtidXR0b246IEhUTUxCdXR0b25FbGVtZW50OyB0eXBlOiBcImFsbFwiIHwgXCJwYXRoXCJ9O1xuZnVuY3Rpb24gZ2V0QnV0dG9ucyhmaWxlUGF0aDogc3RyaW5nKTogQnV0dG9uVHlwZVtdIHtcbiAgY29uc3QgcmVzdWx0OiBCdXR0b25UeXBlW10gPSBbXTtcbiAgY29uc3Qgc3BsaXRQYXRoID0gWy4uLmZpbGVQYXRoLnNwbGl0KC9bXFxcXFxcL10vKV07XG4gIGlmICgxIDwgc3BsaXRQYXRoLmxlbmd0aCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gZmlsZVBhdGg7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29weVRleHQoZmlsZVBhdGgpO1xuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgIGJ1dHRvbjogZWxlbWVudCxcbiAgICAgIHR5cGU6IFwiYWxsXCIsXG4gICAgfSk7XG4gIH1cbiAgZm9yIChsZXQgcGF0aCBvZiBzcGxpdFBhdGgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBlbGVtZW50LmlubmVyVGV4dCA9IHBhdGg7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29weVRleHQocGF0aCk7XG4gICAgfSk7XG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgYnV0dG9uOiBlbGVtZW50LFxuICAgICAgdHlwZTogXCJwYXRoXCIsXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IEVzYUNvZGVDb3B5IH0gZnJvbSBcIi4vZXNhQ29kZUNvcHlcIjtcblxubWFpbigpO1xuZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxEaXZFbGVtZW50PihcIi5tYXJrZG93biA+IGRpdi5jb2RlLWJsb2NrXCIpO1xuICBmb3IgKGxldCBlIG9mIGVsZW1lbnRzKSB7XG4gICAgbmV3IEVzYUNvZGVDb3B5KGUpO1xuICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==