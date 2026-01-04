// ==UserScript==
// @namespace     https://github.com/jeffreytse
// @name          Remove Copy Watermark
// @description   Remove copyright watermark appended to the end of copied content
// @version       0.2.0
// @author        Jeffrey Tse <hello@jeffreytse.net>
// @license       MIT
// @copyright     2022, MIT
// @match         *://*/*
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/458549/Remove%20Copy%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/458549/Remove%20Copy%20Watermark.meta.js
// ==/UserScript==
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/plugins/tampermonkey/remove-copy-watermark.user.js":
/*!*****************************************************************!*\
  !*** ./dist/plugins/tampermonkey/remove-copy-watermark.user.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const src_1 = __importDefault(__webpack_require__(/*! ../../src */ "./dist/src/index.js"));
const package_json_1 = __importDefault(__webpack_require__(/*! ../../package.json */ "./dist/package.json"));
(function () {
  'use strict';

  console.log(`=== Tamper Monkey Plugin ===
    Name: ${package_json_1.default.name}
    Version: ${package_json_1.default.version}
    Homepage: ${package_json_1.default.homepage}`.replace(/^\s+/gm, ''));
  src_1.default.hijack();
})();

/***/ }),

/***/ "./dist/src/hijack.js":
/*!****************************!*\
  !*** ./dist/src/hijack.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const getClipboardData = event => {
  const clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
  return clipboardData;
};
const checkWatermark = (keywords, event, callback) => {
  var _a;
  const clipboardData = getClipboardData(event);
  const data = (clipboardData === null || clipboardData === void 0 ? void 0 : clipboardData.getData('text/plain')) || ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()) || '';
  const oriData = (clipboardData === null || clipboardData === void 0 ? void 0 : clipboardData.getData('sel:text/plain')) || '';
  const extData = data.substring(oriData.length || data.length);
  if (extData.length === 0) {
    return;
  }
  const tmpData = extData.toLowerCase();
  const hasWatermark = keywords.some(keyword => tmpData.search(keyword));
  callback && callback(hasWatermark ? extData : undefined);
};
const removeWatermark = event => {
  const target = event.target;
  const injectCopy = event => {
    event.stopPropagation(true);
    target === null || target === void 0 ? void 0 : target.removeEventListener('copy', injectCopy);
  };
  target === null || target === void 0 ? void 0 : target.addEventListener('copy', injectCopy);
  document.execCommand('copy', true);
};
const copyHandler = keywords => {
  const capturing = event => {
    var _a;
    const stopPropagation = event.stopPropagation.bind(event);
    event.stopPropagation = exec => {
      exec && stopPropagation();
    };
    const clipboardData = getClipboardData(event);
    const oriData = ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    clipboardData === null || clipboardData === void 0 ? void 0 : clipboardData.setData('sel:text/plain', oriData);
  };
  const bubbling = event => {
    checkWatermark(keywords, event, watermark => {
      if (!watermark) {
        return;
      }
      console.log('Remove Copy From Watermark!\n' + watermark);
      setTimeout(() => removeWatermark(event));
    });
  };
  return {
    capturing,
    bubbling
  };
};
const hijack = keywords => {
  console.log('Hijack Remove Copy Watermark...');
  const handler = copyHandler(keywords || ['copyright', '版权', '著作権', '版權', '저작권', 'Авторские права', window.location.href]);
  const addEventListener = window.addEventListener;
  addEventListener('copy', handler.capturing, true);
  addEventListener('copy', handler.bubbling, false);
};
exports["default"] = hijack;

/***/ }),

/***/ "./dist/src/index.js":
/*!***************************!*\
  !*** ./dist/src/index.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const hijack_1 = __importDefault(__webpack_require__(/*! ./hijack */ "./dist/src/hijack.js"));
exports["default"] = {
  hijack: hijack_1.default
};

/***/ }),

/***/ "./dist/package.json":
/*!***************************!*\
  !*** ./dist/package.json ***!
  \***************************/
/***/ (function(module) {

module.exports = JSON.parse('{"name":"remove-copy-watermark","version":"0.2.0","description":"Remove copyright watermark appended to the end of copied content","main":"index.js","scripts":{"build":"rimraf dist && tsc && npm run bundle","bundle":"webpack --config dist/webpack.config.js","test":"echo \\"Error: no test specified\\" && exit 1","lint":"gts lint","clean":"gts clean","compile":"tsc","fix":"gts fix","prepare":"npm run compile","pretest":"npm run compile","posttest":"npm run lint"},"repository":{"type":"git","url":"git+https://github.com/jeffreytse/remove-copy-watermark.git"},"author":"Jeffrey Tse <hello@jeffreytse.net>","homepage":"https://github.com/jeffreytse/remove-copy-watermark#readme","bugs":{"url":"https://github.com/jeffreytse/remove-copy-watermark/issues"},"license":"MIT","engines":{"node":">=14"},"devDependencies":{"@babel/core":"^7.20.12","@babel/preset-env":"^7.20.2","@types/node":"^14.18.36","@types/webpack":"^5.28.0","babel-loader":"^9.1.2","gts":"^3.1.1","rimraf":"^4.0.5","typescript":"^4.9.4","webpack":"^5.75.0","webpack-cli":"^5.0.1"}}');

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
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/plugins/tampermonkey/remove-copy-watermark.user.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUEsR0FBRyxJQUFJQSxHQUFHLENBQUNDLFVBQVUsR0FBSUQsR0FBRyxHQUFHO0lBQUUsU0FBUyxFQUFFQTtFQUFJLENBQUM7QUFDN0QsQ0FBQztBQUNERSw4Q0FBNkM7RUFBRUcsS0FBSyxFQUFFO0FBQUssQ0FBQyxFQUFDO0FBQzdELE1BQU11RCxRQUFRLEdBQUc3RCxlQUFlLENBQUNRLG1CQUFPLENBQUMsc0NBQVUsQ0FBQyxDQUFDO0FBQ3JESCxrQkFBZSxHQUFHO0VBQ2RZLE1BQU0sRUFBRTRDLFFBQVEsQ0FBQ2pEO0FBQ3JCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7VUNSRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vZGlzdC9wbHVnaW5zL3RhbXBlcm1vbmtleS9yZW1vdmUtY29weS13YXRlcm1hcmsudXNlci5qcyIsIndlYnBhY2s6Ly8vLi9kaXN0L3NyYy9oaWphY2suanMiLCJ3ZWJwYWNrOi8vLy4vZGlzdC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHNyY18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9zcmNcIikpO1xuY29uc3QgcGFja2FnZV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uL3BhY2thZ2UuanNvblwiKSk7XG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBjb25zb2xlLmxvZyhgPT09IFRhbXBlciBNb25rZXkgUGx1Z2luID09PVxuICAgIE5hbWU6ICR7cGFja2FnZV9qc29uXzEuZGVmYXVsdC5uYW1lfVxuICAgIFZlcnNpb246ICR7cGFja2FnZV9qc29uXzEuZGVmYXVsdC52ZXJzaW9ufVxuICAgIEhvbWVwYWdlOiAke3BhY2thZ2VfanNvbl8xLmRlZmF1bHQuaG9tZXBhZ2V9YC5yZXBsYWNlKC9eXFxzKy9nbSwgJycpKTtcbiAgICBzcmNfMS5kZWZhdWx0LmhpamFjaygpO1xufSkoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZ2V0Q2xpcGJvYXJkRGF0YSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNsaXBib2FyZERhdGEgPSBldmVudC5jbGlwYm9hcmREYXRhIHx8XG4gICAgICAgIHdpbmRvdy5jbGlwYm9hcmREYXRhIHx8XG4gICAgICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YTtcbiAgICByZXR1cm4gY2xpcGJvYXJkRGF0YTtcbn07XG5jb25zdCBjaGVja1dhdGVybWFyayA9IChrZXl3b3JkcywgZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGNsaXBib2FyZERhdGEgPSBnZXRDbGlwYm9hcmREYXRhKGV2ZW50KTtcbiAgICBjb25zdCBkYXRhID0gKGNsaXBib2FyZERhdGEgPT09IG51bGwgfHwgY2xpcGJvYXJkRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJykpIHx8XG4gICAgICAgICgoX2EgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b1N0cmluZygpKSB8fFxuICAgICAgICAnJztcbiAgICBjb25zdCBvcmlEYXRhID0gKGNsaXBib2FyZERhdGEgPT09IG51bGwgfHwgY2xpcGJvYXJkRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdzZWw6dGV4dC9wbGFpbicpKSB8fCAnJztcbiAgICBjb25zdCBleHREYXRhID0gZGF0YS5zdWJzdHJpbmcob3JpRGF0YS5sZW5ndGggfHwgZGF0YS5sZW5ndGgpO1xuICAgIGlmIChleHREYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRtcERhdGEgPSBleHREYXRhLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzV2F0ZXJtYXJrID0ga2V5d29yZHMuc29tZShrZXl3b3JkID0+IHRtcERhdGEuc2VhcmNoKGtleXdvcmQpKTtcbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhoYXNXYXRlcm1hcmsgPyBleHREYXRhIDogdW5kZWZpbmVkKTtcbn07XG5jb25zdCByZW1vdmVXYXRlcm1hcmsgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3QgaW5qZWN0Q29weSA9IChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24odHJ1ZSk7XG4gICAgICAgIHRhcmdldCA9PT0gbnVsbCB8fCB0YXJnZXQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb3B5JywgaW5qZWN0Q29weSk7XG4gICAgfTtcbiAgICB0YXJnZXQgPT09IG51bGwgfHwgdGFyZ2V0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIGluamVjdENvcHkpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5JywgdHJ1ZSk7XG59O1xuY29uc3QgY29weUhhbmRsZXIgPSAoa2V5d29yZHMpID0+IHtcbiAgICBjb25zdCBjYXB0dXJpbmcgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBzdG9wUHJvcGFnYXRpb24gPSBldmVudC5zdG9wUHJvcGFnYXRpb24uYmluZChldmVudCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiA9IChleGVjKSA9PiB7XG4gICAgICAgICAgICBleGVjICYmIHN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGlwYm9hcmREYXRhID0gZ2V0Q2xpcGJvYXJkRGF0YShldmVudCk7XG4gICAgICAgIGNvbnN0IG9yaURhdGEgPSAoKF9hID0gd2luZG93LmdldFNlbGVjdGlvbigpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9TdHJpbmcoKSkgfHwgJyc7XG4gICAgICAgIGNsaXBib2FyZERhdGEgPT09IG51bGwgfHwgY2xpcGJvYXJkRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xpcGJvYXJkRGF0YS5zZXREYXRhKCdzZWw6dGV4dC9wbGFpbicsIG9yaURhdGEpO1xuICAgIH07XG4gICAgY29uc3QgYnViYmxpbmcgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY2hlY2tXYXRlcm1hcmsoa2V5d29yZHMsIGV2ZW50LCB3YXRlcm1hcmsgPT4ge1xuICAgICAgICAgICAgaWYgKCF3YXRlcm1hcmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZlIENvcHkgRnJvbSBXYXRlcm1hcmshXFxuJyArIHdhdGVybWFyayk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlbW92ZVdhdGVybWFyayhldmVudCkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiB7IGNhcHR1cmluZywgYnViYmxpbmcgfTtcbn07XG5jb25zdCBoaWphY2sgPSAoa2V5d29yZHMpID0+IHtcbiAgICBjb25zb2xlLmxvZygnSGlqYWNrIFJlbW92ZSBDb3B5IFdhdGVybWFyay4uLicpO1xuICAgIGNvbnN0IGhhbmRsZXIgPSBjb3B5SGFuZGxlcihrZXl3b3JkcyB8fCBbXG4gICAgICAgICdjb3B5cmlnaHQnLFxuICAgICAgICAn54mI5p2DJyxcbiAgICAgICAgJ+iRl+S9nOaoqScsXG4gICAgICAgICfniYjmrIonLFxuICAgICAgICAn7KCA7J6R6raMJyxcbiAgICAgICAgJ9CQ0LLRgtC+0YDRgdC60LjQtSDQv9GA0LDQstCwJyxcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgXSk7XG4gICAgY29uc3QgYWRkRXZlbnRMaXN0ZW5lciA9IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyO1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCBoYW5kbGVyLmNhcHR1cmluZywgdHJ1ZSk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcignY29weScsIGhhbmRsZXIuYnViYmxpbmcsIGZhbHNlKTtcbn07XG5leHBvcnRzLmRlZmF1bHQgPSBoaWphY2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGhpamFja18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2hpamFja1wiKSk7XG5leHBvcnRzLmRlZmF1bHQgPSB7XG4gICAgaGlqYWNrOiBoaWphY2tfMS5kZWZhdWx0LFxufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2Rpc3QvcGx1Z2lucy90YW1wZXJtb25rZXkvcmVtb3ZlLWNvcHktd2F0ZXJtYXJrLnVzZXIuanNcIik7XG4iLCIiXSwibmFtZXMiOlsiX19pbXBvcnREZWZhdWx0IiwibW9kIiwiX19lc01vZHVsZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwic3JjXzEiLCJyZXF1aXJlIiwicGFja2FnZV9qc29uXzEiLCJjb25zb2xlIiwibG9nIiwiZGVmYXVsdCIsIm5hbWUiLCJ2ZXJzaW9uIiwiaG9tZXBhZ2UiLCJyZXBsYWNlIiwiaGlqYWNrIiwiZ2V0Q2xpcGJvYXJkRGF0YSIsImV2ZW50IiwiY2xpcGJvYXJkRGF0YSIsIndpbmRvdyIsIm9yaWdpbmFsRXZlbnQiLCJjaGVja1dhdGVybWFyayIsImtleXdvcmRzIiwiY2FsbGJhY2siLCJfYSIsImRhdGEiLCJnZXREYXRhIiwiZ2V0U2VsZWN0aW9uIiwidG9TdHJpbmciLCJvcmlEYXRhIiwiZXh0RGF0YSIsInN1YnN0cmluZyIsImxlbmd0aCIsInRtcERhdGEiLCJ0b0xvd2VyQ2FzZSIsImhhc1dhdGVybWFyayIsInNvbWUiLCJrZXl3b3JkIiwic2VhcmNoIiwidW5kZWZpbmVkIiwicmVtb3ZlV2F0ZXJtYXJrIiwidGFyZ2V0IiwiaW5qZWN0Q29weSIsInN0b3BQcm9wYWdhdGlvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJleGVjQ29tbWFuZCIsImNvcHlIYW5kbGVyIiwiY2FwdHVyaW5nIiwiYmluZCIsImV4ZWMiLCJzZXREYXRhIiwiYnViYmxpbmciLCJ3YXRlcm1hcmsiLCJzZXRUaW1lb3V0IiwiaGFuZGxlciIsImxvY2F0aW9uIiwiaHJlZiIsImhpamFja18xIl0sInNvdXJjZVJvb3QiOiIifQ==