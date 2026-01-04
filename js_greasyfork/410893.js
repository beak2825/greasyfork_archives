// ==UserScript==
// @name         esa.io copy menu
// @namespace    https://github.com/fushihara/esa-io-copy-menu
// @match        https://*.esa.io/posts/*
// @description  esa.io PC版のドロップダウンメニューに、タイトル・URLを個別にコピーする機能を追加
// @version      1.0.2
// @grant        none
// @license      MIT
// @source       https://github.com/fushihara/esa-io-copy-menu
// @homepage     https://greasyfork.org/ja/scripts/410893-esa-io-copy-menu
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410893/esaio%20copy%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/410893/esaio%20copy%20menu.meta.js
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

(async () => {
    const title = getTitleText();
    const postId = getPostId();
    const teamId = getTeamId();
    if (title === null || postId === null || teamId === null) {
        return;
    }
    insertMenuItem(createCopyMenuItem("タイトルをコピー", title), createCopyMenuItem("URL(フル)をコピー", `https://${teamId}.esa.io/posts/${postId}`), createCopyMenuItem("URL(相対)をコピー", `/posts/${postId}`), createCopyMenuItem("mdリンクをコピー", `[${title}](/posts/${postId})`));
})();
function getTitleText() {
    const titleElement = document.querySelector(".post-title__name");
    if (!titleElement || !(titleElement instanceof HTMLElement)) {
        return null;
    }
    const title = titleElement.innerText;
    return title;
}
/** POST IDを返す。ない場合はnull */
function getPostId() {
    const e = document.querySelector(".binding[data-post-number]");
    if (!e) {
        return null;
    }
    const r = e.getAttribute("data-post-number");
    const n = Number(r);
    if (Number.isNaN(n)) {
        return null;
    }
    return n;
}
/** URLに使う、チームIDを返す */
function getTeamId() {
    const e = document.querySelector(".binding[data-team-name]");
    if (!e) {
        return null;
    }
    const r = e.getAttribute("data-team-name");
    return r;
}
/** メニューの下からn番目にコンテンツを入れる */
function insertMenuItem(...elements) {
    const menuParent = document.querySelector(".post-menu__nav");
    const upElement = menuParent.childNodes[menuParent.childNodes.length - 3];
    for (let element of elements) {
        menuParent.insertBefore(element, upElement);
    }
}
function createCopyMenuItem(title, copyText) {
    const elemParent = document.createElement("div");
    elemParent.innerHTML = `<li class="js-post-menu__item post-menu__item">
  <a class="post-menu__link copy-to-clipboard" data-clipboard-text="xxxxxxxxxx">
  <i class="js-copy-icon post-menu__icon icon-clipboard"></i>
  <span class="js-copy-label post-menu__label" data-text-after-copied="クリップボードにコピーしました">タイトルをコピー</span>
  </a>
  </li>`;
    const elem = elemParent.childNodes[0];
    elem.querySelector(".copy-to-clipboard").setAttribute("data-clipboard-text", copyText);
    elem.querySelector(".js-copy-label").innerText = title;
    elem.addEventListener("click", async () => {
        elem.querySelector("i").classList.add("is-copied");
        const originalText = elem.querySelector("span").innerText;
        const copiedText = elem.querySelector("span").getAttribute("data-text-after-copied");
        elem.querySelector("span").innerText = copiedText;
        await new Promise(resolve => setTimeout(resolve, 1000));
        document.querySelector("#js-post-menu").style.display = "";
        elem.querySelector("span").innerText = originalText;
        elem.querySelector("i").classList.remove("is-copied");
    });
    return elem;
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1YsTUFBTSxLQUFLLEdBQUcsWUFBWSxFQUFFLENBQUM7SUFDN0IsTUFBTSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7SUFDM0IsTUFBTSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7SUFDM0IsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUFFLE9BQU87S0FBRTtJQUNyRSxjQUFjLENBQ1osa0JBQWtCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUNyQyxrQkFBa0IsQ0FBQyxhQUFhLEVB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QU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQWMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLGFBQWEsQ0FBYyxNQUFNLENBQUMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1FBQy9ELE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsUUFBUSxDQUFDLGFBQWEsQ0FBYyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUMsYUFBYSxDQUFjLE1BQU0sQ0FBQyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDakUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIiwiZmlsZSI6InNjcmlwdC51c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIoYXN5bmMgKCkgPT4ge1xyXG4gIGNvbnN0IHRpdGxlID0gZ2V0VGl0bGVUZXh0KCk7XHJcbiAgY29uc3QgcG9zdElkID0gZ2V0UG9zdElkKCk7XHJcbiAgY29uc3QgdGVhbUlkID0gZ2V0VGVhbUlkKCk7XHJcbiAgaWYgKHRpdGxlID09PSBudWxsIHx8IHBvc3RJZCA9PT0gbnVsbCB8fCB0ZWFtSWQgPT09IG51bGwpIHsgcmV0dXJuOyB9XHJcbiAgaW5zZXJ0TWVudUl0ZW0oXHJcbiAgICBjcmVhdGVDb3B5TWVudUl0ZW0oXCLjgr/jgqTjg4jjg6vjgpLjgrPjg5Tjg7xcIiwgdGl0bGUpLFxyXG4gICAgY3JlYXRlQ29weU1lbnVJdGVtKFwiVVJMKOODleODqynjgpLjgrPjg5Tjg7xcIiwgYGh0dHBzOi8vJHt0ZWFtSWR9LmVzYS5pby9wb3N0cy8ke3Bvc3RJZH1gKSxcclxuICAgIGNyZWF0ZUNvcHlNZW51SXRlbShcIlVSTCjnm7jlr74p44KS44Kz44OU44O8XCIsIGAvcG9zdHMvJHtwb3N0SWR9YCksXHJcbiAgICBjcmVhdGVDb3B5TWVudUl0ZW0oXCJtZOODquODs+OCr+OCkuOCs+ODlOODvFwiLCBgWyR7dGl0bGV9XSgvcG9zdHMvJHtwb3N0SWR9KWApLFxyXG4gIClcclxufSkoKTtcclxuZnVuY3Rpb24gZ2V0VGl0bGVUZXh0KCk6IHN0cmluZyB8IG51bGwge1xyXG4gIGNvbnN0IHRpdGxlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9zdC10aXRsZV9fbmFtZVwiKTtcclxuICBpZiAoIXRpdGxlRWxlbWVudCB8fCAhKHRpdGxlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgeyByZXR1cm4gbnVsbDsgfVxyXG4gIGNvbnN0IHRpdGxlID0gdGl0bGVFbGVtZW50LmlubmVyVGV4dDtcclxuICByZXR1cm4gdGl0bGU7XHJcbn1cclxuLyoqIFBPU1QgSUTjgpLov5TjgZnjgILjgarjgYTloLTlkIjjga9udWxsICovXHJcbmZ1bmN0aW9uIGdldFBvc3RJZCgpOiBudW1iZXIgfCBudWxsIHtcclxuICBjb25zdCBlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iaW5kaW5nW2RhdGEtcG9zdC1udW1iZXJdXCIpO1xyXG4gIGlmICghZSkgeyByZXR1cm4gbnVsbDsgfVxyXG4gIGNvbnN0IHIgPSBlLmdldEF0dHJpYnV0ZShcImRhdGEtcG9zdC1udW1iZXJcIik7XHJcbiAgY29uc3QgbiA9IE51bWJlcihyKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKG4pKSB7IHJldHVybiBudWxsOyB9XHJcbiAgcmV0dXJuIG47XHJcbn1cclxuLyoqIFVSTOOBq+S9v+OBhuOAgeODgeODvOODoElE44KS6L+U44GZICovXHJcbmZ1bmN0aW9uIGdldFRlYW1JZCgpOiBzdHJpbmcgfCBudWxsIHtcclxuICBjb25zdCBlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iaW5kaW5nW2RhdGEtdGVhbS1uYW1lXVwiKTtcclxuICBpZiAoIWUpIHsgcmV0dXJuIG51bGw7IH1cclxuICBjb25zdCByID0gZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRlYW0tbmFtZVwiKTtcclxuICByZXR1cm4gcjtcclxufVxyXG4vKiog44Oh44OL44Ol44O844Gu5LiL44GL44KJbueVquebruOBq+OCs+ODs+ODhuODs+ODhOOCkuWFpeOCjOOCiyAqL1xyXG5mdW5jdGlvbiBpbnNlcnRNZW51SXRlbSguLi5lbGVtZW50czogSFRNTEVsZW1lbnRbXSkge1xyXG4gIGNvbnN0IG1lbnVQYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvc3QtbWVudV9fbmF2XCIpO1xyXG4gIGNvbnN0IHVwRWxlbWVudCA9IG1lbnVQYXJlbnQuY2hpbGROb2Rlc1ttZW51UGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoIC0gM107XHJcbiAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgbWVudVBhcmVudC5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdXBFbGVtZW50KTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlQ29weU1lbnVJdGVtKHRpdGxlOiBzdHJpbmcsIGNvcHlUZXh0OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgY29uc3QgZWxlbVBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgZWxlbVBhcmVudC5pbm5lckhUTUwgPSBgPGxpIGNsYXNzPVwianMtcG9zdC1tZW51X19pdGVtIHBvc3QtbWVudV9faXRlbVwiPlxyXG4gIDxhIGNsYXNzPVwicG9zdC1tZW51X19saW5rIGNvcHktdG8tY2xpcGJvYXJkXCIgZGF0YS1jbGlwYm9hcmQtdGV4dD1cInh4eHh4eHh4eHhcIj5cclxuICA8aSBjbGFzcz1cImpzLWNvcHktaWNvbiBwb3N0LW1lbnVfX2ljb24gaWNvbi1jbGlwYm9hcmRcIj48L2k+XHJcbiAgPHNwYW4gY2xhc3M9XCJqcy1jb3B5LWxhYmVsIHBvc3QtbWVudV9fbGFiZWxcIiBkYXRhLXRleHQtYWZ0ZXItY29waWVkPVwi44Kv44Oq44OD44OX44Oc44O844OJ44Gr44Kz44OU44O844GX44G+44GX44GfXCI+44K/44Kk44OI44Or44KS44Kz44OU44O8PC9zcGFuPlxyXG4gIDwvYT5cclxuICA8L2xpPmA7XHJcbiAgY29uc3QgZWxlbSA9IGVsZW1QYXJlbnQuY2hpbGROb2Rlc1swXSBhcyBIVE1MRWxlbWVudDtcclxuICBlbGVtLnF1ZXJ5U2VsZWN0b3IoXCIuY29weS10by1jbGlwYm9hcmRcIikuc2V0QXR0cmlidXRlKFwiZGF0YS1jbGlwYm9hcmQtdGV4dFwiLCBjb3B5VGV4dCk7XHJcbiAgZWxlbS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5qcy1jb3B5LWxhYmVsXCIpLmlubmVyVGV4dCA9IHRpdGxlO1xyXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGVsZW0ucXVlcnlTZWxlY3RvcihcImlcIikuY2xhc3NMaXN0LmFkZChcImlzLWNvcGllZFwiKTtcclxuICAgIGNvbnN0IG9yaWdpbmFsVGV4dCA9IGVsZW0ucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJzcGFuXCIpLmlubmVyVGV4dDtcclxuICAgIGNvbnN0IGNvcGllZFRleHQgPSBlbGVtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwic3BhblwiKS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRleHQtYWZ0ZXItY29waWVkXCIpO1xyXG4gICAgZWxlbS5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcInNwYW5cIikuaW5uZXJUZXh0ID0gY29waWVkVGV4dDtcclxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIiNqcy1wb3N0LW1lbnVcIikuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICBlbGVtLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwic3BhblwiKS5pbm5lclRleHQgPSBvcmlnaW5hbFRleHQ7XHJcbiAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoXCJpXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1jb3BpZWRcIik7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGVsZW07XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==