// ==UserScript==
// @name         AtCoder Auto Pager
// @namespace    https://github.com/mihatsu-s/
// @version      1.1.0
// @description  Support finding a page on AtCoder standings
// @author       Mihatsu
// @license      MIT
// @supportURL   https://github.com/mihatsu-s/atcoder-auto-pager/issues
// @match        https://atcoder.jp/contests/*/standings
// @match        https://atcoder.jp/contests/*/standings?*
// @match        https://atcoder.jp/contests/*/standings/
// @match        https://atcoder.jp/contests/*/standings/?*
// @match        https://atcoder.jp/contests/*/standings/virtual
// @match        https://atcoder.jp/contests/*/standings/virtual?*
// @match        https://atcoder.jp/contests/*/standings/virtual/
// @match        https://atcoder.jp/contests/*/standings/virtual/?*
// @match        https://atcoder.jp/contests/*/results
// @match        https://atcoder.jp/contests/*/results?*
// @match        https://atcoder.jp/contests/*/results/
// @match        https://atcoder.jp/contests/*/results/?*
// @exclude      https://atcoder.jp/*/json
// @downloadURL https://update.greasyfork.org/scripts/421991/AtCoder%20Auto%20Pager.user.js
// @updateURL https://update.greasyfork.org/scripts/421991/AtCoder%20Auto%20Pager.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 426:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#vue-standings thead th, #vue-results thead th {\n    vertical-align: middle;\n}\n\n.auto-pager-input {\n    width: 100%;\n    font-size: 80%;\n    font-weight: normal;\n    border: 1px solid #ccc;\n    border-radius: 2px;\n}\n\n.auto-pager-input.error {\n    background-color: #fcc;\n}\n\n.auto-pager-input.active {\n    background-color: #cfc;\n    border-color: #6c6;\n    color: #093;\n}\n\n.auto-pager-input.watching {\n    background-color: #cef;\n    border-color: #9bd;\n    color: #17f;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/style.css
var style = __webpack_require__(426);
;// CONCATENATED MODULE: ./src/style.css

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(style/* default */.Z, options);



/* harmony default export */ const src_style = (style/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/lib/dom-util.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
function asyncQuerySelector(selectors) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const result = document.querySelector(selectors);
            if (result)
                return result;
            yield sleep(200);
        }
    });
}
function waitForVueJsNextTick() {
    return new Promise(resolve => {
        Vue.nextTick(resolve);
    });
}

;// CONCATENATED MODULE: ./src/lib/general-util.ts
function observeProperties(obj, propertyNames, callback, interval = 100) {
    function getValues() {
        return propertyNames.map(key => obj[key]);
    }
    function arrayEquals(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0, imax = a.length; i < imax; ++i) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    let previousValue = getValues();
    setInterval(() => {
        const currentValue = getValues();
        if (!arrayEquals(currentValue, previousValue)) {
            callback();
            previousValue = currentValue;
        }
    }, interval);
}

;// CONCATENATED MODULE: ./src/feature/text-to-ordering-target.ts
function textToNumber(text) {
    let value = NaN;
    if (!text.match(/^,|,$|,,|\..*,|[eE].*,|,.*[eE]/)) {
        value = Number(text.replace(/,/g, ""));
    }
    if (isNaN(value)) {
        throw new Error(`Cannot convert '${text}' to a number.`);
    }
    return value;
}
function mmssToSeconds(text) {
    const parts = text.split(":").map(Number);
    if (parts.length !== 2
        || !isFinite(parts[1]) || parts[1] < 0 || parts[1] >= 60
        || !isFinite(parts[0]) || parts[0] % 1 !== 0) {
        throw new Error(`Cannot interpret '${text} as a time'`);
    }
    return parts[0] * 60 + parts[1];
}
/**
 * @returns a value treated as a first entry in the default compareFn
 */
function veryFirstStandingsEntry(desc) {
    return {
        Rank: desc ? Infinity : -Infinity,
        Rating: desc ? -Infinity : Infinity,
        OldRating: desc ? -Infinity : Infinity,
        TotalResult: {
            Count: 1,
            Score: desc ? -Infinity : Infinity,
            Elapsed: desc ? Infinity : -Infinity,
        },
        TaskResults: {},
    };
}
/**
 * @returns a value treated as a first entry in the default compareFn
 */
function veryFirstResultsEntry(desc) {
    return {
        Rank: desc ? Infinity : -Infinity,
        Place: desc ? Infinity : -Infinity,
        Performance: desc ? -Infinity : Infinity,
        OldRating: desc ? -Infinity : Infinity,
        Difference: desc ? -Infinity : Infinity,
        NewRating: desc ? -Infinity : Infinity,
        Rating: desc ? -Infinity : Infinity,
    };
}
var TextToOrderingTarget;
(function (TextToOrderingTarget) {
    let Standings;
    (function (Standings) {
        function numeric(key) {
            return function (text, desc) {
                const res = veryFirstStandingsEntry(desc);
                res[key] = textToNumber(text);
                return res;
            };
        }
        Standings.numeric = numeric;
        /**
         * @param taskAlphabet Set null for the total score
         */
        function score(taskAlphabet) {
            return function (text, desc, showInLogScale, taskInfo) {
                // set default value
                let elapsed = desc ? -Infinity : Infinity; // most bottom
                let point = 0;
                if (taskAlphabet !== null && taskAlphabet in taskInfo) {
                    point = taskInfo[taskAlphabet].maximumScore;
                }
                else {
                    // sum of all tasks point
                    for (const alphabet in taskInfo) {
                        point += taskInfo[alphabet].maximumScore;
                    }
                }
                const parts = text.split(/\s/).filter(s => !!s);
                // read a time
                try {
                    elapsed = mmssToSeconds(parts[parts.length - 1]) * 1e9;
                    parts.pop();
                }
                catch (_a) { }
                // read a point
                if (parts.length === 1) {
                    point = 0;
                    let pointText = parts[0];
                    try {
                        point = textToNumber(pointText);
                        if (showInLogScale) {
                            point = 100 * Math.exp(point * LOG_BASE);
                        }
                        else {
                            point *= 100;
                        }
                    }
                    catch (e) {
                        if (taskAlphabet === null) {
                            // convert task alphabets to point
                            function testTaskExistance(alphabet) {
                                if (!(alphabet in taskInfo)) {
                                    throw new Error(`Task '${alphabet}' does not exist`);
                                }
                            }
                            function addTaskPoint(alphabet) {
                                testTaskExistance(alphabet);
                                point += taskInfo[alphabet].maximumScore;
                            }
                            pointText = pointText.toUpperCase();
                            if (pointText[0] === "-") {
                                const firstTaskAlphabet = Object.keys(taskInfo).sort()[0];
                                pointText = firstTaskAlphabet + pointText;
                            }
                            if (pointText[pointText.length - 1] === "-") {
                                const lastTaskAlphabet = Object.keys(taskInfo).sort((a, b) => a < b ? 1 : a > b ? -1 : 0)[0];
                                pointText += lastTaskAlphabet;
                            }
                            for (let i = 0, imax = pointText.length; i < imax; ++i) {
                                if (pointText[i + 1] === "-") {
                                    testTaskExistance(pointText[i]);
                                    testTaskExistance(pointText[i + 2]);
                                    for (let j = pointText.charCodeAt(i), jmax = pointText.charCodeAt(i + 2); j <= jmax; ++j) {
                                        addTaskPoint(String.fromCharCode(j));
                                    }
                                    i += 2;
                                }
                                else {
                                    addTaskPoint(pointText[i]);
                                }
                            }
                        }
                        else {
                            throw e;
                        }
                    }
                }
                else if (parts.length >= 2) {
                    throw new Error(`'${text}' is not a score specifier (format: '[point] [time]')`);
                }
                const res = veryFirstStandingsEntry(desc);
                if (taskAlphabet === null) {
                    res.TotalResult = {
                        Count: 1,
                        Score: point,
                        Elapsed: elapsed,
                    };
                }
                else {
                    res.TaskResults[taskInfo[taskAlphabet].screenName] = {
                        Count: 1,
                        Score: point,
                        Elapsed: elapsed,
                    };
                }
                return res;
            };
        }
        Standings.score = score;
    })(Standings = TextToOrderingTarget.Standings || (TextToOrderingTarget.Standings = {}));
    ;
    let Results;
    (function (Results) {
        function numeric(key) {
            return function (text, desc) {
                const res = veryFirstResultsEntry(desc);
                res[key] = textToNumber(text);
                return res;
            };
        }
        Results.numeric = numeric;
    })(Results = TextToOrderingTarget.Results || (TextToOrderingTarget.Results = {}));
    ;
})(TextToOrderingTarget || (TextToOrderingTarget = {}));

;// CONCATENATED MODULE: ./src/feature/pager/base.ts
class Pager {
    constructor(paginationFn, orderFn) {
        this.paginationFn = paginationFn;
        this.orderFn = orderFn;
    }
    convertTargetText(fn, ...args) {
        try {
            return fn(...args);
        }
        catch (e) {
            throw new TargetTextConvertionError(e);
        }
    }
}
class TargetTextConvertionError extends Error {
}

;// CONCATENATED MODULE: ./src/lib/math-util.ts
function binarySearch(array, compareFn, target) {
    const test = arguments.length >= 3 ?
        (n) => compareFn(array[n], target) >= 0 :
        (n) => compareFn(array[n]);
    let low = 0, high = array.length;
    if (test(0))
        return 0;
    while (high - low > 1) {
        const mid = (high + low) >> 1;
        if (test(mid)) {
            high = mid;
        }
        else {
            low = mid;
        }
    }
    return high;
}
function linearPrediction(x1, y1, x2, y2, x) {
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

;// CONCATENATED MODULE: ./src/lib/atcoder/info-reader.ts
function readTaskScore(pageSource) {
    const match = pageSource.match(/(?:配点|Score).*<var>(\d+)<\/var>/);
    if (match) {
        const score = Number(match[1]);
        if (!isNaN(score)) {
            return score;
        }
    }
    throw new Error("Cannot read the score point");
}
function readRatedRange(pageSource) {
    const match = pageSource.match(/>[\s\r\n]*(?:Rated対象|Rated Range)[\s\r\n]*:([^<>]*)</);
    if (match) {
        const text = match[1].replace(/[\s\r\n]/g, "").toLowerCase();
        if (text === "-") {
            return [-Infinity, -Infinity];
        }
        else if (text === "all") {
            return [-Infinity, Infinity];
        }
        const parts = text.split(/-|~/);
        if (parts.length === 2) {
            const parsed = [
                parts[0] === "" ? -Infinity : Number(parts[0]),
                parts[1] === "" ? Infinity : Number(parts[1])
            ];
            if (!isNaN(parsed[0]) && !isNaN(parsed[1])) {
                return parsed;
            }
        }
    }
    throw new Error("Cannot read the rated range");
}

;// CONCATENATED MODULE: ./src/lib/atcoder/time.ts
function internalTimeToJsDate(internalTime) {
    return internalTime.toDate();
}

;// CONCATENATED MODULE: ./src/lib/net-util.ts
var net_util_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FetchResponseError extends Error {
    constructor(res) {
        super();
        this.res = res;
    }
}
function fetchText(input, init) {
    return net_util_awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(input, init);
        if (res.status !== 200) {
            throw new FetchResponseError(res);
        }
        return yield res.text();
    });
}

;// CONCATENATED MODULE: ./src/feature/get-task-info.ts
var get_task_info_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



let cache = null;
let previousStandings = null;
let maximumScoreRecord = {};
function getAndRecordMaximumScore(taskAlphabet, taskScreenName) {
    return get_task_info_awaiter(this, void 0, void 0, function* () {
        maximumScoreRecord[taskAlphabet] = null;
        const url = location.href.replace(/(?<=\/contests\/[^\/]*\/).*$/, "tasks/" + taskScreenName);
        try {
            const score = readTaskScore(yield fetchText(url)) * 100;
            maximumScoreRecord[taskAlphabet] = score;
            if (cache) {
                cache[taskAlphabet].maximumScore = score;
            }
        }
        catch (e) {
            console.error(`Cannot get the score point from ${url}`);
        }
    });
}
let contestStartTimerEnabled = false;
function generateTaskInfo(standings) {
    const started = contestIsStarted();
    if (!started) {
        if (!contestStartTimerEnabled) {
            contestStartTimerEnabled = true;
            const timerId = setInterval(() => {
                if (contestIsStarted()) {
                    for (const task of standings.TaskInfo) {
                        getAndRecordMaximumScore(task.Assignment, task.TaskScreenName);
                    }
                    clearInterval(timerId);
                }
            }, 1000);
        }
    }
    const result = {};
    for (const info of standings.TaskInfo) {
        const alphabet = info.Assignment;
        const screenName = info.TaskScreenName;
        let maximumScore = 0;
        if (started) {
            if (alphabet in maximumScoreRecord && maximumScoreRecord[alphabet] !== null) {
                maximumScore = maximumScoreRecord[alphabet];
            }
            else {
                if (!(alphabet in maximumScoreRecord)) {
                    // Do not wait (request only)
                    getAndRecordMaximumScore(alphabet, screenName);
                }
                for (const entry of standings.StandingsData) {
                    const taskResults = entry.TaskResults;
                    if (screenName in taskResults) {
                        maximumScore = Math.max(maximumScore, taskResults[screenName].Score);
                    }
                }
            }
        }
        result[alphabet] = { screenName, maximumScore };
    }
    return result;
}
function getTaskInfo() {
    const currentStandings = vueStandings.standings;
    // Check if standings has been updated
    if (cache && currentStandings === previousStandings)
        return cache;
    previousStandings = currentStandings;
    return cache = generateTaskInfo(currentStandings);
}
;
function contestIsStarted() {
    return internalTimeToJsDate(getServerTime()).getTime() >= internalTimeToJsDate(startTime).getTime();
}

;// CONCATENATED MODULE: ./src/feature/pager/standings-order.ts
var standings_order_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class StandingsOrderPager extends Pager {
    constructor(paginationFn, orderFn, orderBy, textToOrderingTarget) {
        super(paginationFn, orderFn);
        this.paginationFn = paginationFn;
        this.orderFn = orderFn;
        this.orderBy = orderBy;
        this.textToOrderingTarget = textToOrderingTarget;
    }
    exec(text) {
        return standings_order_awaiter(this, void 0, void 0, function* () {
            const target = this.convertTargetText(this.textToOrderingTarget, text, vueStandings.desc, vueStandings.showInLogScale, getTaskInfo());
            this.orderFn(this.orderBy); // Do not wait for DOM updated
            const array = vueStandings.orderedStandings;
            if (array.length === 0)
                return;
            const index = Math.min(binarySearch(array, vueStandings.comp, target), array.length - 1);
            yield this.paginationFn(Math.floor(index / vueStandings.perPage) + 1);
        });
    }
}
class TaskInfo {
}

;// CONCATENATED MODULE: ./src/feature/pager/results-order.ts
var results_order_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class ResultsOrderPager extends Pager {
    constructor(paginationFn, orderFn, orderBy, textToOrderingTarget) {
        super(paginationFn, orderFn);
        this.paginationFn = paginationFn;
        this.orderFn = orderFn;
        this.orderBy = orderBy;
        this.textToOrderingTarget = textToOrderingTarget;
    }
    exec(text) {
        return results_order_awaiter(this, void 0, void 0, function* () {
            const target = this.convertTargetText(this.textToOrderingTarget, text, vueResults.desc);
            this.orderFn(this.orderBy); // Do not wait for DOM updated
            const array = vueResults.orderedResults;
            if (array.length === 0)
                return;
            const index = Math.min(binarySearch(array, vueResults.comp, target), array.length - 1);
            yield this.paginationFn(Math.floor(index / vueResults.perPage) + 1);
        });
    }
}

;// CONCATENATED MODULE: ./src/feature/rank-to-rated-rank.ts
var rank_to_rated_rank_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let rank_to_rated_rank_cache = null;
let rank_to_rated_rank_previousStandings = null;
function getRankToRatedRankMap() {
    const currentStandings = vueStandings.standings;
    // Check if standings has been updated
    if (rank_to_rated_rank_cache && currentStandings === rank_to_rated_rank_previousStandings)
        return rank_to_rated_rank_cache;
    rank_to_rated_rank_previousStandings = currentStandings;
    return rank_to_rated_rank_cache = generateRankToRatedRankMap(currentStandings);
}
function generateRankToRatedRankMap(standings) {
    const data = standings.StandingsData;
    const res0 = calculateRatedRanks(data, e => e.IsRated && e.TotalResult.Count > 0);
    if (res0.ratedNum === 0 && ratedRange !== null) {
        const res1 = calculateRatedRanks(data, e => ratedRange[0] <= e.OldRating && e.OldRating <= ratedRange[1] && e.TotalResult.Count > 0);
        return res1.map;
    }
    else {
        return res0.map;
    }
}
function calculateRatedRanks(data, ratedFn) {
    const size = data.length;
    const result = Array(size);
    let ratedRank = 0;
    let ratedNumOfCurrentRank = 0;
    let unrateds = [];
    let _ratedAdded = 0;
    for (let i = 0; i < size; ++i) {
        const rank = data[i].Rank;
        if (ratedFn(data[i])) {
            ratedNumOfCurrentRank += 1;
        }
        else {
            unrateds.push(rank);
        }
        if (i === size - 1 || data[i + 1].Rank !== rank) {
            if (i === size - 1 && ratedNumOfCurrentRank === 0) {
                ratedNumOfCurrentRank = 1;
                _ratedAdded = 1;
            }
            if (ratedNumOfCurrentRank > 0) {
                result[rank] = ((ratedRank + 1) + (ratedRank + ratedNumOfCurrentRank)) / 2;
                const unratedsNum = unrateds.filter(r => r !== rank).length;
                function unratedSubRankToRatedRank(subRank) {
                    return ratedRank;
                    // return ratedRank + subRank / (unratedsNum + 1);
                }
                let unratedSubRank = 0;
                let unratedNumOfCurrentSubRank = 0;
                for (let j = 0; j < unratedsNum; ++j) {
                    const rank = unrateds[j];
                    unratedNumOfCurrentSubRank += 1;
                    if (j === unratedsNum - 1 || unrateds[j + 1] !== rank) {
                        const subRank = ((unratedSubRank + 1) + (unratedSubRank + unratedNumOfCurrentSubRank)) / 2;
                        result[rank] = unratedSubRankToRatedRank(subRank);
                        unratedSubRank += unratedNumOfCurrentSubRank;
                        unratedNumOfCurrentSubRank = 0;
                    }
                }
                unrateds = [];
                ratedRank += ratedNumOfCurrentRank;
                ratedNumOfCurrentRank = 0;
            }
        }
    }
    return {
        map: result,
        ratedNum: ratedRank - _ratedAdded
    };
}
let ratedRange = null;
(() => rank_to_rated_rank_awaiter(void 0, void 0, void 0, function* () {
    const contestUrl = location.href.replace(/(?<=\/contests\/[^\/]+)\/.*$/g, "");
    try {
        ratedRange = readRatedRange(yield fetchText(contestUrl));
    }
    catch (e) {
        console.error(`Cannot get the rated range from ${contestUrl}`);
    }
}))();

;// CONCATENATED MODULE: ./src/feature/pager/ac-predictor.ts
var ac_predictor_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




// Get ac-predictor's internal function
let predictor_onRankInput = null;
let predictor_onPerfInput = null;
const addEventListener_raw = HTMLInputElement.prototype.addEventListener;
HTMLInputElement.prototype.addEventListener =
    function (type, fn, ...args) {
        if (type === "keyup") {
            if (this.id === "predictor-input-rank") {
                predictor_onRankInput = fn;
            }
            else if (this.id === "predictor-input-perf") {
                predictor_onPerfInput = fn;
            }
        }
        addEventListener_raw.call(this, type, fn, ...args);
    };
class AcPredictorPager extends Pager {
    constructor(paginationFn, orderFn, headerRow, beforePaginationFn) {
        super(paginationFn, orderFn);
        this.paginationFn = paginationFn;
        this.orderFn = orderFn;
        this.headerRow = headerRow;
        this.beforePaginationFn = beforePaginationFn;
    }
    exec(text) {
        return ac_predictor_awaiter(this, void 0, void 0, function* () {
            const target = this.convertTargetText(textToNumber, text);
            yield this.orderFn("rank");
            if (predictor_onRankInput && predictor_onPerfInput) {
                yield this.paginateBasedOnPredictor(target);
            }
            else {
                yield this.paginateBasedOnDOM(target);
            }
        });
    }
    paginateBasedOnDOM(target) {
        return ac_predictor_awaiter(this, void 0, void 0, function* () {
            if (vueStandings.pages === 0)
                return;
            const desc = vueStandings.desc;
            if (!desc)
                target *= -1;
            let columnNumber = -1;
            this.headerRow.querySelectorAll("th").forEach((th, i) => {
                if (th.textContent.replace(/\s/g, "") === "perf") {
                    columnNumber = i;
                }
            });
            if (columnNumber < 0)
                throw new Error('Cannot find perf column');
            const tbody = this.headerRow.parentElement.parentElement.querySelector("tbody");
            // Search page binarily
            let low = null;
            let high = null;
            while (true) {
                let [v0, v1] = this.readCurrentPagePerf(tbody, columnNumber);
                if (!desc) {
                    v0 *= -1;
                    v1 *= -1;
                }
                if (v0 < target && target <= v1) {
                    break;
                }
                else if (target <= v0) {
                    // too high
                    if (vueStandings.page === 1)
                        break;
                    high = { page: vueStandings.page, value: (v0 + v1) / 2 };
                }
                else {
                    // too low
                    if (vueStandings.page === vueStandings.pages)
                        break;
                    low = { page: vueStandings.page, value: (v0 + v1) / 2 };
                }
                let nextPage;
                let endNext = false;
                if (high && low) {
                    if (high.page - low.page <= 1) {
                        // goal
                        nextPage = high.page;
                        endNext = true;
                    }
                    else if ( /* v0 !== v1 */false) {}
                    else {
                        // Use midpoint
                        nextPage = Math.ceil((high.page + low.page) / 2);
                    }
                    if (nextPage >= high.page) {
                        nextPage = high.page - 1;
                    }
                    else if (nextPage <= low.page) {
                        nextPage = low.page + 1;
                    }
                }
                else if (high) {
                    nextPage = 1;
                }
                else if (low) {
                    nextPage = vueStandings.pages;
                }
                yield this.paginationFn(nextPage);
                if (endNext)
                    break;
            }
        });
    }
    readPerfFromTableCell(cell) {
        if (!cell)
            return 0;
        const text = cell.textContent.replace(/\s/g, "");
        const value = Number(text);
        return isNaN(value) ? 0 : value;
    }
    readCurrentPagePerf(tbody, perfColumnIndex) {
        const rows = [];
        let infoRowIndex = -1;
        let warningRowIndex = -1;
        tbody.childNodes.forEach(node => {
            if (node instanceof HTMLTableRowElement
                && !node.classList.contains("standings-fa")
                && !node.classList.contains("standings-statistics")) {
                rows.push(node);
                if (node.classList.contains("info"))
                    infoRowIndex = rows.length - 1;
                if (node.classList.contains("warning"))
                    warningRowIndex = rows.length - 1;
            }
        });
        if (rows.length > vueStandings.perPage || vueStandings.page === vueStandings.pages) {
            if (infoRowIndex < 0 && warningRowIndex >= 0) {
                rows.splice(warningRowIndex, 1);
            }
            else if (infoRowIndex >= 0) {
                rows.splice(infoRowIndex, 1);
            }
        }
        return [rows[0], rows[rows.length - 1]].map(row => this.readPerfFromTableCell(row.children[perfColumnIndex]));
    }
    paginateBasedOnPredictor(target) {
        return ac_predictor_awaiter(this, void 0, void 0, function* () {
            const standings = vueStandings.orderedStandings;
            if (standings.length === 0)
                return;
            const desc = vueStandings.desc;
            const ratedRankMap = getRankToRatedRankMap();
            const maxPerf = this.rankToPerf(1);
            const index = binarySearch(standings, entry => {
                const ratedRank = ratedRankMap[entry.EntireRank];
                const perf = entry.TotalResult.Count === 0
                    ? -Infinity
                    : Math.round(this.positivizeRating(Math.min(this.rankToPerf(ratedRank), maxPerf)));
                return desc ? (perf >= target) : (perf <= target);
            });
            yield this.paginationFn(Math.floor(index / vueStandings.perPage) + 1);
        });
    }
    rankToPerf(rank) {
        if (this.beforePaginationFn) {
            this.beforePaginationFn();
        }
        const predictorElements = [
            "predictor-input-rank",
            "predictor-input-perf",
            "predictor-input-rate",
        ].map(s => this.headerRow.ownerDocument.getElementById(s));
        const temp = predictorElements.map(e => e.value);
        predictorElements[0].value = rank.toString();
        predictor_onRankInput();
        const result = Number(predictorElements[1].value);
        temp.forEach((v, i) => {
            predictorElements[i].value = v;
        });
        return result;
    }
    perfToRank(perf) {
        if (this.beforePaginationFn) {
            this.beforePaginationFn();
        }
        const predictorElements = [
            "predictor-input-rank",
            "predictor-input-perf",
            "predictor-input-rate",
        ].map(s => this.headerRow.ownerDocument.getElementById(s));
        const temp = predictorElements.map(e => e.value);
        predictorElements[1].value = perf.toString();
        predictor_onPerfInput();
        const result = Number(predictorElements[0].value);
        temp.forEach((v, i) => {
            predictorElements[i].value = v;
        });
        return result;
    }
    positivizeRating(rating) {
        if (rating >= 400.0)
            return rating;
        return 400.0 * Math.exp((rating - 400.0) / 400.0);
    }
    unpositivizeRating(rating) {
        if (rating >= 400.0)
            return rating;
        return 400.0 + 400.0 * Math.log(rating / 400.0);
    }
}

;// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









var CLASS_NAMES;
(function (CLASS_NAMES) {
    CLASS_NAMES.input = "auto-pager-input";
    CLASS_NAMES.active = "active";
    CLASS_NAMES.error = "error";
    CLASS_NAMES.watching = "watching";
})(CLASS_NAMES || (CLASS_NAMES = {}));
(() => src_awaiter(void 0, void 0, void 0, function* () {
    function getPagerFromHeaderCell(headerCell) {
        const title = headerCell.textContent.replace(/\s/g, "");
        if (tableType === "results") {
            let rule = null;
            if (title === "順位" || title === "Rank") {
                rule = {
                    orderBy: "Place",
                    converter: TextToOrderingTarget.Results.numeric("Place"),
                };
            }
            if (title === "パフォーマンス" || title === "Performance") {
                rule = {
                    orderBy: "Performance",
                    converter: TextToOrderingTarget.Results.numeric("Performance"),
                };
            }
            if (title === "旧Rating" || title === "OldRating") {
                rule = {
                    orderBy: "OldRating",
                    converter: TextToOrderingTarget.Results.numeric("OldRating"),
                };
            }
            if (title === "差分" || title === "Diff") {
                rule = {
                    orderBy: "Difference",
                    converter: TextToOrderingTarget.Results.numeric("Difference"),
                };
            }
            if (title === "新Rating" || title === "NewRating") {
                rule = {
                    orderBy: "NewRating",
                    converter: TextToOrderingTarget.Results.numeric("NewRating"),
                };
            }
            if (rule) {
                return new ResultsOrderPager(goToPage, changeOrder, rule.orderBy, rule.converter);
            }
        }
        else {
            let rule = null;
            if (title === "順位" || title === "Rank") {
                rule = {
                    orderBy: "rank",
                    converter: TextToOrderingTarget.Standings.numeric("Rank"),
                };
            }
            if (title === "得点" || title === "Score") {
                rule = {
                    orderBy: "score",
                    converter: TextToOrderingTarget.Standings.score(null),
                };
            }
            const taskInfo = getTaskInfo();
            if (title in taskInfo) {
                rule = {
                    orderBy: "task-" + taskInfo[title].screenName,
                    converter: TextToOrderingTarget.Standings.score(title),
                };
            }
            if (rule) {
                return new StandingsOrderPager(goToPage, changeOrder, rule.orderBy, rule.converter);
            }
            if (title === "perf") {
                return new AcPredictorPager(goToPage, changeOrder, headerRow, () => {
                    if (perfColumnInputElement) {
                        keepPerfInputState(perfColumnInputElement);
                    }
                });
            }
        }
        return null;
    }
    function addInputElementToHeaderCell(headerCell) {
        const document = headerCell.ownerDocument;
        const div = document.createElement("div");
        const input = document.createElement("input");
        div.append(input);
        headerCell.append(div);
        input.classList.add(CLASS_NAMES.input);
        input.addEventListener("click", e => {
            e.stopPropagation();
        });
        return input;
    }
    function columnInit(headerCell) {
        const pager = getPagerFromHeaderCell(headerCell);
        if (pager === null)
            return;
        const input = addInputElementToHeaderCell(headerCell);
        input.addEventListener("input", () => src_awaiter(this, void 0, void 0, function* () {
            input.classList.remove(CLASS_NAMES.active);
            input.classList.remove(CLASS_NAMES.error);
            if (watching && watching.element === input) {
                input.classList.remove(CLASS_NAMES.watching);
                watching = null;
            }
        }));
        input.addEventListener("keypress", (e) => src_awaiter(this, void 0, void 0, function* () {
            if (e.code === "Enter") {
                yield execPagerFromInputElement(input, pager, tableType === "standings" && e.ctrlKey);
            }
        }));
        if (pager instanceof AcPredictorPager) {
            perfColumnInputElement = input;
            if (__perfInputState) {
                input.focus();
                input.value = __perfInputState.value;
                input.selectionStart = __perfInputState.selectionStart;
                input.selectionEnd = __perfInputState.selectionEnd;
                input.classList.add(CLASS_NAMES.active);
                setTimeout(() => {
                    __perfInputState = null;
                }, 0);
            }
            if (watching && watching.perf !== null) {
                input.classList.add(CLASS_NAMES.watching);
                input.value = watching.perf.value;
                watching = {
                    element: input,
                    pager: watching.perf.pager,
                    perf: watching.perf,
                };
            }
        }
    }
    function execPagerFromInputElement(input, pager, watch = false) {
        return src_awaiter(this, void 0, void 0, function* () {
            if (input.value.replace(/\s/g, "") === "")
                return;
            input.classList.remove(CLASS_NAMES.error);
            input.classList.add(CLASS_NAMES.active);
            input.classList.remove(CLASS_NAMES.watching);
            const preWatching = watching;
            if (watch) {
                input.classList.add(CLASS_NAMES.watching);
                watching = {
                    element: input,
                    pager,
                    perf: pager instanceof AcPredictorPager ? { value: input.value, pager } : null,
                };
            }
            else if (watching && watching.element === input) {
                watching = null;
            }
            try {
                yield pager.exec(input.value);
            }
            catch (e) {
                input.classList.remove(CLASS_NAMES.active);
                input.classList.remove(CLASS_NAMES.watching);
                input.classList.add(CLASS_NAMES.error);
                if (watch)
                    watching = preWatching;
                if (e instanceof TargetTextConvertionError) {
                    // TODO: Show error message
                    // console.error(e);
                }
                else {
                    throw e;
                }
            }
        });
    }
    function goToPage(page) {
        return src_awaiter(this, void 0, void 0, function* () {
            if (page === vueObject.page)
                return;
            if (document.activeElement === perfColumnInputElement) {
                keepPerfInputState(perfColumnInputElement);
            }
            vueObject.page = page;
            vueObject.watchIndex = -1;
            yield waitForVueJsNextTick();
        });
    }
    function changeOrder(orderBy, desc = null) {
        return src_awaiter(this, void 0, void 0, function* () {
            if (orderBy === vueObject.orderBy) {
                if (desc === null || desc === vueObject.desc)
                    return;
            }
            else {
                if (desc === null)
                    desc = false;
            }
            if (document.activeElement === perfColumnInputElement) {
                keepPerfInputState(perfColumnInputElement);
            }
            vueObject.orderBy = orderBy;
            if (desc !== null)
                vueObject.desc = desc;
            yield waitForVueJsNextTick();
        });
    }
    let watching = null;
    let perfColumnInputElement = null;
    let __perfInputState = null;
    function keepPerfInputState(input) {
        __perfInputState = {
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        };
    }
    function resetPagers() {
        for (const input of headerRow.querySelectorAll("." + CLASS_NAMES.input)) {
            if (headerRow.ownerDocument.activeElement === input)
                continue;
            input.classList.remove(CLASS_NAMES.active);
            input.classList.remove(CLASS_NAMES.error);
            input.classList.remove(CLASS_NAMES.watching);
            input.value = "";
        }
        if (watching && watching.element !== headerRow.ownerDocument.activeElement) {
            watching = null;
        }
    }
    // main
    const headerRow = (yield asyncQuerySelector("#vue-standings thead tr, #vue-results thead tr"));
    const tableType = typeof vueStandings === "undefined" ? "results" : "standings";
    const vueObject = tableType === "standings" ? vueStandings : vueResults;
    // Launch auto-pager for each column
    headerRow.querySelectorAll("th").forEach(columnInit);
    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement)
                    columnInit(node);
            }
        }
    }).observe(headerRow, { childList: true });
    // Detect pagination
    observeProperties(vueObject, ["page", "orderBy", "desc"], () => {
        resetPagers();
    });
    if (tableType === "standings") {
        // Detect updating
        observeProperties(vueStandings, ["standings"], () => {
            if (watching) {
                execPagerFromInputElement(watching.element, watching.pager, true);
            }
        });
    }
}))();

})();

/******/ })()
;