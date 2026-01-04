// ==UserScript==
// @name         AtCoder Simplify
// @namespace    https://github.com/tars0x9752/atcoder-simplify
// @version      0.1.0
// @description  AtCoder Simplify の UserScript です
// @author       тars
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403319/AtCoder%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/403319/AtCoder%20Simplify.meta.js
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// ==UserScript==\n// @name         AtCoder Simplify\n// @namespace    https://github.com/tars0x9752/atcoder-simplify\n// @version      0.1.0\n// @description  AtCoder Simplify\n// @author       тars\n// @match        https://atcoder.jp/contests/*/tasks/*\n// @grant        none\n// ==/UserScript==\nvar __spreadArrays = (this && this.__spreadArrays) || function () {\n    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\n    for (var r = Array(s), k = 0, i = 0; i < il; i++)\n        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\n            r[k] = a[j];\n    return r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar isInputSampleCaseEl = function (el) {\n    var _a, _b, _c, _d;\n    return (_d = (_c = (_b = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('h3')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.includes('入力例')) !== null && _d !== void 0 ? _d : false;\n};\nvar isOutputSampleCaseEl = function (el) {\n    var _a, _b, _c, _d;\n    return (_d = (_c = (_b = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('h3')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.includes('出力例')) !== null && _d !== void 0 ? _d : false;\n};\nvar accumelateSampleCases = function (acc, curr) {\n    var sampleRawText = curr.textContent;\n    return sampleRawText !== null ? __spreadArrays(acc, [sampleRawText]) : __spreadArrays(acc);\n};\nvar parseSampleCases = function () {\n    var preElNodeList = window.document.querySelectorAll('pre');\n    var preElArray = Array.from(preElNodeList);\n    var inputSampleCases = preElArray\n        .filter(isInputSampleCaseEl)\n        .reduce(accumelateSampleCases, []);\n    var outputSampleCases = preElArray\n        .filter(isOutputSampleCaseEl)\n        .reduce(accumelateSampleCases, []);\n    return {\n        inputSampleCases: inputSampleCases,\n        outputSampleCases: outputSampleCases,\n    };\n};\nvar parseTaskInfo = function () {\n    var _a = window.location.pathname.split('/'), contestName = _a[2], taskName = _a[4];\n    return { contestName: contestName, taskName: taskName };\n};\nvar sendSampleCases = function (payload) {\n    var body = JSON.stringify(payload);\n    var headers = {\n        'Content-Type': 'application/json; charset=utf-8',\n    };\n    var PORT = 20080;\n    fetch(\"http://localhost:\" + PORT, {\n        method: 'POST',\n        headers: headers,\n        body: body,\n    }).catch(function (_) {\n        console.log('AtCoder Simplify: VSCode との連携に失敗しました');\n    });\n};\nvar validateSampleCases = function (inputSampleCases, outputSampleCases) {\n    if (inputSampleCases.length === 0 || outputSampleCases.length === 0) {\n        return false;\n    }\n    if (inputSampleCases.length !== outputSampleCases.length) {\n        return false;\n    }\n    return true;\n};\nvar runExtension = function () {\n    var _a = parseSampleCases(), inputSampleCases = _a.inputSampleCases, outputSampleCases = _a.outputSampleCases;\n    var _b = parseTaskInfo(), contestName = _b.contestName, taskName = _b.taskName;\n    if (!validateSampleCases(inputSampleCases, outputSampleCases)) {\n        return;\n    }\n    sendSampleCases({\n        contestName: contestName,\n        taskName: taskName,\n        inputSampleCases: inputSampleCases,\n        outputSampleCases: outputSampleCases,\n    });\n};\nwindow.onload = runExtension;\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });