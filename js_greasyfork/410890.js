// ==UserScript==
// @name         gist github look fix
// @namespace    https://github.com/fushihara/github-gist-look-fix
// @match        https://nomatch.example.com
// @description  gist.githubのembedの外見を修正
// @version      1.0.2
// @grant        none
// @license      MIT
// @source       https://github.com/fushihara/github-gist-look-fix
// @homepage     https://greasyfork.org/ja/scripts/410890
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410890/gist%20github%20look%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/410890/gist%20github%20look%20fix.meta.js
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

/***/ "./src/gitsTool.ts":
/*!*************************!*\
  !*** ./src/gitsTool.ts ***!
  \*************************/
/*! exports provided: GistTools */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GistTools", function() { return GistTools; });
const styleRuleInsertLog = new WeakMap();
class GistTools {
    constructor(files) {
        this.files = files;
    }
    static getInstance(element) {
        GistTools.insertStyleRule();
        const files = [];
        for (let e of element.children) {
            if (!e.classList.contains("gist-file") || !(e instanceof HTMLDivElement)) {
                return null;
            }
            files.push(new OneFile(e));
        }
        return new GistTools(files);
    }
    /** documentにcssのルールを定義する。何度呼んでも良い */
    static insertStyleRule() {
        if (styleRuleInsertLog.has(document)) {
            return;
        }
        styleRuleInsertLog.set(document, true);
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        styleEl.sheet.insertRule(".gist .header{display:flex;font-size: 12px;align-items: center;}");
        styleEl.sheet.insertRule(".gist .header >* {padding:0 3px;}");
        styleEl.sheet.insertRule(".gist .header .filename{font-family: monospace;padding:0 10px;}");
        styleEl.sheet.insertRule(".gist .header .space{flex:1 1 0;}");
        styleEl.sheet.insertRule(".gist .header button{line-height: 13px;}");
        styleEl.sheet.insertRule(".gist .gist-data{border-radius:0 0 6px 6px !important;}");
        styleEl.sheet.insertRule(".gist .blob-num{line-height: 13px !important;}");
        styleEl.sheet.insertRule(".gist .blob-code{line-height: 13px !important;}");
    }
}
class OneFile {
    constructor(element) {
        this.element = element;
        const footerData = this.getFooterData(element.querySelector(".gist-meta"));
        this.fileName = footerData.fileName;
        this.fileLink = footerData.fileLink;
        this.fileRawLink = footerData.fileRawLink;
        this.repoLink = footerData.repoLink;
        this.gistId = footerData.gistId;
        this.textValue = this.getInnerText(element.querySelector(".gist-data"));
        const topBrotherElement = document.createElement("div");
        topBrotherElement.classList.add("header");
        topBrotherElement.innerHTML = `
    <div class="filename">hoge.txt</div>
    <div class="space"></div>
    <a class="file-link" href="http://example.com">file</a>
    <a class="raw-link" href="http://example.com">raw</a>
    <a class="repo-link" href="http://example.com">repo</a>
    <a class="edit-link" href="http://example.com">edit</a>
    <button filename>filename</button>
    <button text>text</button>
    <button git-clone>git clone command</button>
    <button download-zip-repo style="display:none;">download zip repo</button>
    `;
        topBrotherElement.querySelector(".filename").innerText = this.fileName;
        topBrotherElement.querySelector(".file-link").href = this.fileLink;
        topBrotherElement.querySelector(".raw-link").href = this.fileRawLink;
        topBrotherElement.querySelector(".repo-link").href = this.repoLink;
        topBrotherElement.querySelector(".edit-link").href = this.repoLink + "/edit";
        topBrotherElement.querySelector("[filename]").setAttribute("title", this.fileName);
        topBrotherElement.querySelector("[filename]").addEventListener("click", () => { this.copyText(this.fileName); });
        topBrotherElement.querySelector("[text]").setAttribute("title", this.textValue);
        topBrotherElement.querySelector("[text]").addEventListener("click", () => { this.copyText(this.textValue); });
        topBrotherElement.querySelector("[git-clone]").setAttribute("title", `git clone git@gist.github.com:${this.gistId}.git .`);
        topBrotherElement.querySelector("[git-clone]").addEventListener("click", () => { this.copyText(`git clone git@gist.github.com:${this.gistId}.git .`); });
        topBrotherElement.querySelector("[download-zip-repo]").setAttribute("title", `download zip file`);
        topBrotherElement.querySelector("[download-zip-repo]").addEventListener("click", () => { alert("wip"); });
        element.insertBefore(topBrotherElement, element.children[0]);
        // hide footer
        element.querySelector(".gist-meta").style.display = "none";
    }
    getInnerText(bodyElement) {
        return bodyElement.innerText.split(/\n/).map(a => {
            return a.replace(/^\t/, "");
        }).join("\n");
    }
    copyText(text) {
        navigator.clipboard.writeText(text);
    }
    /** 元のgistのfooterのエレメントから必要な情報を返す */
    getFooterData(footerElement) {
        const fileRawLink = footerElement.children[0].getAttribute("href");
        if (fileRawLink == null) {
            throw new Error();
        }
        let m;
        if (!(m = fileRawLink.match(/(^.+?gist\.github\.com\/.+?)\/raw\//))) {
            throw new Error();
        }
        const repoLink = m[1];
        if (!(m = repoLink.match(/(\w+)$/))) {
            throw new Error("gist hash id not found");
        }
        const gistId = m[1];
        const fileLink = footerElement.children[1].href;
        const fileName = footerElement.children[1].innerText;
        return { fileRawLink, repoLink, gistId, fileName, fileLink };
    }
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
/* harmony import */ var _gitsTool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gitsTool */ "./src/gitsTool.ts");

init();
function init() {
    const elments = document.querySelectorAll(".gist");
    for (let element of elments) {
        if (element instanceof HTMLDivElement) {
            _gitsTool__WEBPACK_IMPORTED_MODULE_0__["GistTools"].getInstance(element);
        }
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dpdHNUb29sLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQSxNQUFNLGtCQUFrQixHQUErQixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQzlELE1BQU0sU0FBUztJQTZCcEIsWUFBcUMsS0FBZ0I7UUFBaEIsVUFBSyxHQUFMLEtBQUssQ0FBVztJQUNyRCxDQUFDO0lBN0JNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBdUI7UUFDL0MsU0FBUyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVCLE1BQU0sS0FBSyxHQUFjLEVBQUUsQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFR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TUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ25CO1FBQ0QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sUUFBUSxHQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUF1QixDQUFDLElBQUksQ0FBQztRQUN2RSxNQUFNLFFBQVEsR0FBSSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBaUIsQ0FBQyxTQUFTO1FBQ3JFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDL0QsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7O0FDN0dEO0FBQUE7QUFBdUM7QUFFdkMsSUFBSSxFQUFFLENBQUM7QUFDUCxTQUFTLElBQUk7SUFDWCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkQsS0FBSyxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQUU7UUFDM0IsSUFBSSxPQUFPLFlBQVksY0FBYyxFQUFFO1lBQ3JDLG1EQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO0tBQ0Y7QUFDSCxDQUFDIiwiZmlsZSI6InNjcmlwdC51c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJjb25zdCBzdHlsZVJ1bGVJbnNlcnRMb2c6IFdlYWtNYXA8RG9jdW1lbnQsIGJvb2xlYW4+ID0gbmV3IFdlYWtNYXAoKTtcbmV4cG9ydCBjbGFzcyBHaXN0VG9vbHMge1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKGVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50KTogR2lzdFRvb2xzIHwgbnVsbCB7XG4gICAgR2lzdFRvb2xzLmluc2VydFN0eWxlUnVsZSgpO1xuICAgIGNvbnN0IGZpbGVzOiBPbmVGaWxlW10gPSBbXTtcbiAgICBmb3IgKGxldCBlIG9mIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghZS5jbGFzc0xpc3QuY29udGFpbnMoXCJnaXN0LWZpbGVcIikgfHwgIShlIGluc3RhbmNlb2YgSFRNTERpdkVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgZmlsZXMucHVzaChuZXcgT25lRmlsZShlKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgR2lzdFRvb2xzKGZpbGVzKTtcbiAgfVxuICAvKiogZG9jdW1lbnTjgatjc3Pjga7jg6vjg7zjg6vjgpLlrprnvqnjgZnjgovjgILkvZXluqblkbzjgpPjgafjgoLoia/jgYQgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zZXJ0U3R5bGVSdWxlKCkge1xuICAgIGlmIChzdHlsZVJ1bGVJbnNlcnRMb2cuaGFzKGRvY3VtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdHlsZVJ1bGVJbnNlcnRMb2cuc2V0KGRvY3VtZW50LCB0cnVlKTtcbiAgICBjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xuICAgIHN0eWxlRWwuc2hlZXQuaW5zZXJ0UnVsZShcIi5naXN0IC5oZWFkZXJ7ZGlzcGxheTpmbGV4O2ZvbnQtc2l6ZTogMTJweDthbGlnbi1pdGVtczogY2VudGVyO31cIik7XG4gICAgc3R5bGVFbC5zaGVldC5pbnNlcnRSdWxlKFwiLmdpc3QgLmhlYWRlciA+KiB7cGFkZGluZzowIDNweDt9XCIpO1xuICAgIHN0eWxlRWwuc2hlZXQuaW5zZXJ0UnVsZShcIi5naXN0IC5oZWFkZXIgLmZpbGVuYW1le2ZvbnQtZmFtaWx5OiBtb25vc3BhY2U7cGFkZGluZzowIDEwcHg7fVwiKTtcbiAgICBzdHlsZUVsLnNoZWV0Lmluc2VydFJ1bGUoXCIuZ2lzdCAuaGVhZGVyIC5zcGFjZXtmbGV4OjEgMSAwO31cIik7XG4gICAgc3R5bGVFbC5zaGVldC5pbnNlcnRSdWxlKFwiLmdpc3QgLmhlYWRlciBidXR0b257bGluZS1oZWlnaHQ6IDEzcHg7fVwiKTtcbiAgICBzdHlsZUVsLnNoZWV0Lmluc2VydFJ1bGUoXCIuZ2lzdCAuZ2lzdC1kYXRhe2JvcmRlci1yYWRpdXM6MCAwIDZweCA2cHggIWltcG9ydGFudDt9XCIpO1xuICAgIHN0eWxlRWwuc2hlZXQuaW5zZXJ0UnVsZShcIi5naXN0IC5ibG9iLW51bXtsaW5lLWhlaWdodDogMTNweCAhaW1wb3J0YW50O31cIik7XG4gICAgc3R5bGVFbC5zaGVldC5pbnNlcnRSdWxlKFwiLmdpc3QgLmJsb2ItY29kZXtsaW5lLWhlaWdodDogMTNweCAhaW1wb3J0YW50O31cIik7XG4gIH1cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZpbGVzOiBPbmVGaWxlW10pIHtcbiAgfVxufVxuY2xhc3MgT25lRmlsZSB7XG4gIC8qKiDjg5XjgqHjgqTjg6vlkI0gKi9cbiAgcHJpdmF0ZSBmaWxlTmFtZTogc3RyaW5nO1xuICAvKiog44OV44Kh44Kk44Or44G444Gu44Oq44Oz44KvIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3h4eHgveHh4eCN4eHh4ICovXG4gIHByaXZhdGUgZmlsZUxpbms6IHN0cmluZztcbiAgLyoqIOODleOCoeOCpOODq+OBruS4rei6q+OBuOOBruebtOODquODs+OCryBodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3h4eHh4L3h4eHh4eC9yYXcveHh4eC94eHgudHh0ICovXG4gIHByaXZhdGUgZmlsZVJhd0xpbms6IHN0cmluZztcbiAgLyoqIOODrOODneOCuOODiOODquiHquS9k+OBuOOBruODquODs+OCr+OAgiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS94eHh4eC94eHh4ICovXG4gIHByaXZhdGUgcmVwb0xpbms6IHN0cmluZztcbiAgLyoqIGdpc3Tjga5JROOAgjE26YCy5pWw44Gu44OP44OD44K344Ol5YCkICovXG4gIHByaXZhdGUgZ2lzdElkOiBzdHJpbmc7XG4gIHByaXZhdGUgdGV4dFZhbHVlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICBjb25zdCBmb290ZXJEYXRhID0gdGhpcy5nZXRGb290ZXJEYXRhKGVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5naXN0LW1ldGFcIikpO1xuICAgIHRoaXMuZmlsZU5hbWUgPSBmb290ZXJEYXRhLmZpbGVOYW1lO1xuICAgIHRoaXMuZmlsZUxpbmsgPSBmb290ZXJEYXRhLmZpbGVMaW5rO1xuICAgIHRoaXMuZmlsZVJhd0xpbmsgPSBmb290ZXJEYXRhLmZpbGVSYXdMaW5rO1xuICAgIHRoaXMucmVwb0xpbmsgPSBmb290ZXJEYXRhLnJlcG9MaW5rO1xuICAgIHRoaXMuZ2lzdElkID0gZm9vdGVyRGF0YS5naXN0SWQ7XG4gICAgdGhpcy50ZXh0VmFsdWUgPSB0aGlzLmdldElubmVyVGV4dChlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2lzdC1kYXRhXCIpKTtcbiAgICBjb25zdCB0b3BCcm90aGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdG9wQnJvdGhlckVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhlYWRlclwiKTtcbiAgICB0b3BCcm90aGVyRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgPGRpdiBjbGFzcz1cImZpbGVuYW1lXCI+aG9nZS50eHQ8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic3BhY2VcIj48L2Rpdj5cbiAgICA8YSBjbGFzcz1cImZpbGUtbGlua1wiIGhyZWY9XCJodHRwOi8vZXhhbXBsZS5jb21cIj5maWxlPC9hPlxuICAgIDxhIGNsYXNzPVwicmF3LWxpbmtcIiBocmVmPVwiaHR0cDovL2V4YW1wbGUuY29tXCI+cmF3PC9hPlxuICAgIDxhIGNsYXNzPVwicmVwby1saW5rXCIgaHJlZj1cImh0dHA6Ly9leGFtcGxlLmNvbVwiPnJlcG88L2E+XG4gICAgPGEgY2xhc3M9XCJlZGl0LWxpbmtcIiBocmVmPVwiaHR0cDovL2V4YW1wbGUuY29tXCI+ZWRpdDwvYT5cbiAgICA8YnV0dG9uIGZpbGVuYW1lPmZpbGVuYW1lPC9idXR0b24+XG4gICAgPGJ1dHRvbiB0ZXh0PnRleHQ8L2J1dHRvbj5cbiAgICA8YnV0dG9uIGdpdC1jbG9uZT5naXQgY2xvbmUgY29tbWFuZDwvYnV0dG9uPlxuICAgIDxidXR0b24gZG93bmxvYWQtemlwLXJlcG8gc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+ZG93bmxvYWQgemlwIHJlcG88L2J1dHRvbj5cbiAgICBgO1xuICAgIHRvcEJyb3RoZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmZpbGVuYW1lXCIpLmlubmVyVGV4dCA9IHRoaXMuZmlsZU5hbWU7XG4gICAgdG9wQnJvdGhlckVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQW5jaG9yRWxlbWVudD4oXCIuZmlsZS1saW5rXCIpLmhyZWYgPSB0aGlzLmZpbGVMaW5rO1xuICAgIHRvcEJyb3RoZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEFuY2hvckVsZW1lbnQ+KFwiLnJhdy1saW5rXCIpLmhyZWYgPSB0aGlzLmZpbGVSYXdMaW5rO1xuICAgIHRvcEJyb3RoZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEFuY2hvckVsZW1lbnQ+KFwiLnJlcG8tbGlua1wiKS5ocmVmID0gdGhpcy5yZXBvTGluaztcbiAgICB0b3BCcm90aGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PihcIi5lZGl0LWxpbmtcIikuaHJlZiA9IHRoaXMucmVwb0xpbmsgKyBcIi9lZGl0XCI7XG4gICAgdG9wQnJvdGhlckVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCJbZmlsZW5hbWVdXCIpLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIHRoaXMuZmlsZU5hbWUpO1xuICAgIHRvcEJyb3RoZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiW2ZpbGVuYW1lXVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyB0aGlzLmNvcHlUZXh0KHRoaXMuZmlsZU5hbWUpOyB9KVxuICAgIHRvcEJyb3RoZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiW3RleHRdXCIpLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIHRoaXMudGV4dFZhbHVlKTtcbiAgICB0b3BCcm90aGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PihcIlt0ZXh0XVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyB0aGlzLmNvcHlUZXh0KHRoaXMudGV4dFZhbHVlKTsgfSlcbiAgICB0b3BCcm90aGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PihcIltnaXQtY2xvbmVdXCIpLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGBnaXQgY2xvbmUgZ2l0QGdpc3QuZ2l0aHViLmNvbToke3RoaXMuZ2lzdElkfS5naXQgLmApO1xuICAgIHRvcEJyb3RoZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiW2dpdC1jbG9uZV1cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgdGhpcy5jb3B5VGV4dChgZ2l0IGNsb25lIGdpdEBnaXN0LmdpdGh1Yi5jb206JHt0aGlzLmdpc3RJZH0uZ2l0IC5gKTsgfSlcbiAgICB0b3BCcm90aGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PihcIltkb3dubG9hZC16aXAtcmVwb11cIikuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgYGRvd25sb2FkIHppcCBmaWxlYCk7XG4gICAgdG9wQnJvdGhlckVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCJbZG93bmxvYWQtemlwLXJlcG9dXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IGFsZXJ0KFwid2lwXCIpIH0pXG4gICAgZWxlbWVudC5pbnNlcnRCZWZvcmUodG9wQnJvdGhlckVsZW1lbnQsIGVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgIC8vIGhpZGUgZm9vdGVyXG4gICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5naXN0LW1ldGFcIikhLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuICBwcml2YXRlIGdldElubmVyVGV4dChib2R5RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICByZXR1cm4gYm9keUVsZW1lbnQuaW5uZXJUZXh0LnNwbGl0KC9cXG4vKS5tYXAoYSA9PiB7XG4gICAgICByZXR1cm4gYS5yZXBsYWNlKC9eXFx0LywgXCJcIik7XG4gICAgfSkuam9pbihcIlxcblwiKTtcbiAgfVxuICBwcml2YXRlIGNvcHlUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRleHQpO1xuICB9XG4gIC8qKiDlhYPjga5naXN044GuZm9vdGVy44Gu44Ko44Os44Oh44Oz44OI44GL44KJ5b+F6KaB44Gq5oOF5aCx44KS6L+U44GZICovXG4gIHByaXZhdGUgZ2V0Rm9vdGVyRGF0YShmb290ZXJFbGVtZW50OiBIVE1MRGl2RWxlbWVudCkge1xuICAgIGNvbnN0IGZpbGVSYXdMaW5rID0gZm9vdGVyRWxlbWVudC5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xuICAgIGlmIChmaWxlUmF3TGluayA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcigpOyB9XG4gICAgbGV0IG06IFJlZ0V4cE1hdGNoQXJyYXk7XG4gICAgaWYgKCEobSA9IGZpbGVSYXdMaW5rLm1hdGNoKC8oXi4rP2dpc3RcXC5naXRodWJcXC5jb21cXC8uKz8pXFwvcmF3XFwvLykpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG4gICAgY29uc3QgcmVwb0xpbmsgPSBtWzFdO1xuICAgIGlmICghKG0gPSByZXBvTGluay5tYXRjaCgvKFxcdyspJC8pKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2lzdCBoYXNoIGlkIG5vdCBmb3VuZFwiKTtcbiAgICB9XG4gICAgY29uc3QgZ2lzdElkID0gbVsxXTtcbiAgICBjb25zdCBmaWxlTGluayA9IChmb290ZXJFbGVtZW50LmNoaWxkcmVuWzFdIGFzIEhUTUxBbmNob3JFbGVtZW50KS5ocmVmO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gKGZvb3RlckVsZW1lbnQuY2hpbGRyZW5bMV0gYXMgSFRNTEVsZW1lbnQpLmlubmVyVGV4dFxuICAgIHJldHVybiB7IGZpbGVSYXdMaW5rLCByZXBvTGluaywgZ2lzdElkLCBmaWxlTmFtZSwgZmlsZUxpbmsgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgR2lzdFRvb2xzIH0gZnJvbSBcIi4vZ2l0c1Rvb2xcIjtcblxuaW5pdCgpO1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgY29uc3QgZWxtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2lzdFwiKTtcbiAgZm9yIChsZXQgZWxlbWVudCBvZiBlbG1lbnRzKSB7XG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgR2lzdFRvb2xzLmdldEluc3RhbmNlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=