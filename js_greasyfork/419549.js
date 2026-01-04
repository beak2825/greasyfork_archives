// ==UserScript==
// @name         esa.io Referenced Copy Top
// @namespace    https://github.com/fushihara/esa-io-referenced-copy-top
// @match        https://*.esa.io/posts/*
// @description  esa.ioのReferenced をページのヘッダー部分にも表示する
// @version      1.2.0
// @grant        none
// @license      MIT
// @source       https://github.com/fushihara/esa-io-referenced-copy-top
// @homepage     https://greasyfork.org/ja/scripts/419549
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419549/esaio%20Referenced%20Copy%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/419549/esaio%20Referenced%20Copy%20Top.meta.js
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

const styleRuleInsertLog = new WeakSet();
const randomId = `css-${Math.random().toString(16).substr(2)}`;
main();
function main() {
    const elements = document.querySelectorAll("#references a");
    const list = [];
    for (let e of elements) {
        const link = e.href;
        // #64: プログラミング/Docker一般 #docker
        const innerText = String(e.innerText)
            .replace(/^#\d+: /, "")
            .replace(/#.+/, "");
        list.push({ href: link, title: innerText });
    }
    insertStyleRule();
    const div = document.createElement("div");
    div.classList.add(randomId);
    if (0 < list.length) {
        div.append(getSpanElement("Referenced From"));
        for (let v of list) {
            div.append(getAnchorElement(v.title, v.href));
            if (list.indexOf(v) != list.length - 1) {
                div.append(getSpanElement("/"));
            }
        }
    }
    else {
        div.append(getSpanElement("Referenced From"));
        div.append(getSpanElement("None", "lightgray"));
    }
    document.querySelector(".posts-title").insertBefore(div, document.querySelector(".post-title"));
}
function getSpanElement(innerText, className = "") {
    const e = document.createElement("span");
    e.innerText = innerText;
    if (className != "") {
        e.classList.add(className);
    }
    return e;
}
function getAnchorElement(innerText, href) {
    const e = document.createElement("a");
    e.innerText = innerText;
    e.href = href;
    return e;
}
function insertStyleRule() {
    if (styleRuleInsertLog.has(document)) {
        return;
    }
    styleRuleInsertLog.add(document);
    const styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    styleEl.sheet.insertRule(`.${randomId} { word-break: break-word;}`);
    styleEl.sheet.insertRule(`.${randomId} > * { margin:0 2px;}`);
    styleEl.sheet.insertRule(`.${randomId} > .lightgray { color:lightgray;}`);
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxNQUFNLGtCQUFrQixHQUFzQixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQzVELE1BQU0sUUFBUSxHQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMvRCxJQUFJLEVBQUUsQ0FBQztBQUNQLFNBQVMsSUFBSTtJQUNYLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBb0IsZUFBZSxDQUFDLENBQUM7SUFDL0UsTUFBTSxJQUFJLEdBQW9DLEVBQUUsQ0FBQztJQUNqRCxLQUFLLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUN0QixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BCLGdDQUFnQztRQUNoQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzthQUNsQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQzthQUN0QixPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsZUFBZSxFQUFFLENBQUM7SUFDbEIsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUM5QyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7S0FDRjtTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0tBQ2pEO0lBQ0QsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUNsRyxDQUFDO0FBQ0QsU0FBUyxjQUFjLENBQUMsU0FBaUIsRUFBRSxTQUFTLEdBQUcsRUFBRTtJQUN2RCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQ3hCLElBQUksU0FBUyxJQUFJLEVBQUUsRUFBRTtRQUNuQixDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM1QjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELFNBQVMsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxJQUFZO0lBQ3ZELE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDeEIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDZCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFDRCxTQUFTLGVBQWU7SUFDdEIsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDcEMsT0FBTztLQUNSO0lBQ0Qsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxRQUFRLDZCQUE2QixDQUFDLENBQUM7SUFDcEUsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxRQUFRLHVCQUF1QixDQUFDLENBQUM7SUFDOUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxRQUFRLG1DQUFtQyxDQUFDLENBQUM7QUFDNUUsQ0FBQyIsImZpbGUiOiJzY3JpcHQudXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiY29uc3Qgc3R5bGVSdWxlSW5zZXJ0TG9nOiBXZWFrU2V0PERvY3VtZW50PiA9IG5ldyBXZWFrU2V0KCk7XG5jb25zdCByYW5kb21JZCA9IGBjc3MtJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zdWJzdHIoMil9YDtcbm1haW4oKTtcbmZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MQW5jaG9yRWxlbWVudD4oXCIjcmVmZXJlbmNlcyBhXCIpO1xuICBjb25zdCBsaXN0OiB7dGl0bGU6IHN0cmluZzsgaHJlZjogc3RyaW5nfVtdID0gW107XG4gIGZvciAobGV0IGUgb2YgZWxlbWVudHMpIHtcbiAgICBjb25zdCBsaW5rID0gZS5ocmVmO1xuICAgIC8vICM2NDog44OX44Ot44Kw44Op44Of44Oz44KwL0RvY2tlcuS4gOiIrCAjZG9ja2VyXG4gICAgY29uc3QgaW5uZXJUZXh0ID0gU3RyaW5nKGUuaW5uZXJUZXh0KVxuICAgICAgLnJlcGxhY2UoL14jXFxkKzogLywgXCJcIilcbiAgICAgIC5yZXBsYWNlKC8jLisvLCBcIlwiKTtcbiAgICBsaXN0LnB1c2goe2hyZWY6IGxpbmssIHRpdGxlOiBpbm5lclRleHR9KTtcbiAgfVxuICBpbnNlcnRTdHlsZVJ1bGUoKTtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQocmFuZG9tSWQpO1xuICBpZiAoMCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgZGl2LmFwcGVuZChnZXRTcGFuRWxlbWVudChcIlJlZmVyZW5jZWQgRnJvbVwiKSk7XG4gICAgZm9yIChsZXQgdiBvZiBsaXN0KSB7XG4gICAgICBkaXYuYXBwZW5kKGdldEFuY2hvckVsZW1lbnQodi50aXRsZSwgdi5ocmVmKSk7XG4gICAgICBpZiAobGlzdC5pbmRleE9mKHYpICE9IGxpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICBkaXYuYXBwZW5kKGdldFNwYW5FbGVtZW50KFwiL1wiKSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRpdi5hcHBlbmQoZ2V0U3BhbkVsZW1lbnQoXCJSZWZlcmVuY2VkIEZyb21cIikpO1xuICAgIGRpdi5hcHBlbmQoZ2V0U3BhbkVsZW1lbnQoXCJOb25lXCIsIFwibGlnaHRncmF5XCIpKTtcbiAgfVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvc3RzLXRpdGxlXCIpLmluc2VydEJlZm9yZShkaXYsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9zdC10aXRsZVwiKSk7XG59XG5mdW5jdGlvbiBnZXRTcGFuRWxlbWVudChpbm5lclRleHQ6IHN0cmluZywgY2xhc3NOYW1lID0gXCJcIikge1xuICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIGUuaW5uZXJUZXh0ID0gaW5uZXJUZXh0O1xuICBpZiAoY2xhc3NOYW1lICE9IFwiXCIpIHtcbiAgICBlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfVxuICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIGdldEFuY2hvckVsZW1lbnQoaW5uZXJUZXh0OiBzdHJpbmcsIGhyZWY6IHN0cmluZykge1xuICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIGUuaW5uZXJUZXh0ID0gaW5uZXJUZXh0O1xuICBlLmhyZWYgPSBocmVmO1xuICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIGluc2VydFN0eWxlUnVsZSgpIHtcbiAgaWYgKHN0eWxlUnVsZUluc2VydExvZy5oYXMoZG9jdW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHN0eWxlUnVsZUluc2VydExvZy5hZGQoZG9jdW1lbnQpO1xuICBjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xuICBzdHlsZUVsLnNoZWV0Lmluc2VydFJ1bGUoYC4ke3JhbmRvbUlkfSB7IHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7fWApO1xuICBzdHlsZUVsLnNoZWV0Lmluc2VydFJ1bGUoYC4ke3JhbmRvbUlkfSA+ICogeyBtYXJnaW46MCAycHg7fWApO1xuICBzdHlsZUVsLnNoZWV0Lmluc2VydFJ1bGUoYC4ke3JhbmRvbUlkfSA+IC5saWdodGdyYXkgeyBjb2xvcjpsaWdodGdyYXk7fWApO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==