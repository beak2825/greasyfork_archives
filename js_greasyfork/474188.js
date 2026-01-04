// ==UserScript==
// @name          Github PR Organizer & Formatter
// @namespace     happyviking
// @description   Organizes and tabs PRs to make it easier to see what to prioritize.
// @author        HappyViking
// @match         https://github.com/*
// @run-at        document-end
// @require
// @version       1.8.0
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/474188/Github%20PR%20Organizer%20%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/474188/Github%20PR%20Organizer%20%20Formatter.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style/main.css":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.badgeHolder{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  gap: 8px;
}

.badge{
  height: 25px;
  width: fit-content;
  padding: 0px 8px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
}

.badgeText{
  margin: 0px;
  white-space: nowrap
}

.icon {
  height: 20px
}

.iconHolder{
  margin: 0px 8px 0px 0px;
  display: flex;
  align-items: center;
  justify-content:center;
}

.divider{
  width: 100%;
  text-align: center;
  background-color: grey;
  padding: 2px
}

.lowPriorityPR{
  opacity: 0.3
}

.yellow{
  border: 1px solid #3C3729;
  background-color: #FCE205;
  color: #3C3729;
}

.red{
  border: 1px solid #941410;
  background-color: #FF8884;
  color: #941410
}

.green{
  border: 1px solid #043927;
  background-color: #29AB87;
  color: #043927
}

.hollow{
  background-color: none;
  border: 1px solid #EEEEEE;
  color: #EEEEEE
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
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
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
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
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/bind.js


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/utils.js




// utils is a library of generic helper functions non-specific to axios

const {toString: utils_toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = utils_toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const utils_hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

/* harmony default export */ const utils = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty: utils_hasOwnProperty,
  hasOwnProp: utils_hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosError.js




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const AxiosError_prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(AxiosError_prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(AxiosError_prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const core_AxiosError = (AxiosError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/null.js
// eslint-disable-next-line strict
/* harmony default export */ const helpers_null = (null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toFormData.js




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (helpers_null || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new core_AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const helpers_toFormData = (toFormData);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && helpers_toFormData(params, this, options);
}

const AxiosURLSearchParams_prototype = AxiosURLSearchParams.prototype;

AxiosURLSearchParams_prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

AxiosURLSearchParams_prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const helpers_AxiosURLSearchParams = (AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/buildURL.js





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function buildURL_encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || buildURL_encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new helpers_AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/InterceptorManager.js




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const core_InterceptorManager = (InterceptorManager);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/transitional.js


/* harmony default export */ const defaults_transitional = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js



/* harmony default export */ const classes_URLSearchParams = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : helpers_AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/FormData.js


/* harmony default export */ const classes_FormData = (typeof FormData !== 'undefined' ? FormData : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/Blob.js


/* harmony default export */ const classes_Blob = (typeof Blob !== 'undefined' ? Blob : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/index.js




/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


/* harmony default export */ const browser = ({
  isBrowser: true,
  classes: {
    URLSearchParams: classes_URLSearchParams,
    FormData: classes_FormData,
    Blob: classes_Blob
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toURLEncodedForm.js






function toURLEncodedForm(data, options) {
  return helpers_toFormData(data, new browser.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (browser.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToJSON.js




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const helpers_formDataToJSON = (formDataToJSON);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/index.js










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: defaults_transitional,

  adapter: browser.isNode ? 'http' : 'xhr',

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(helpers_formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return helpers_toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw core_AxiosError.from(e, core_AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: browser.classes.FormData,
    Blob: browser.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const lib_defaults = (defaults);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseHeaders.js




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const parseHeaders = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosHeaders.js





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils.freezeMethods(AxiosHeaders);

/* harmony default export */ const core_AxiosHeaders = (AxiosHeaders);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/transformData.js






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || lib_defaults;
  const context = response || config;
  const headers = core_AxiosHeaders.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/isCancel.js


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CanceledError.js





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  core_AxiosError.call(this, message == null ? 'canceled' : message, core_AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, core_AxiosError, {
  __CANCEL__: true
});

/* harmony default export */ const cancel_CanceledError = (CanceledError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/settle.js




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new core_AxiosError(
      'Request failed with status code ' + response.status,
      [core_AxiosError.ERR_BAD_REQUEST, core_AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/cookies.js





/* harmony default export */ const cookies = (browser.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAbsoluteURL.js


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/combineURLs.js


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/buildFullPath.js





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isURLSameOrigin.js





/* harmony default export */ const isURLSameOrigin = (browser.isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseProtocol.js


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/speedometer.js


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const helpers_speedometer = (speedometer);

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/xhr.js
















function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = helpers_speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const xhr = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = core_AxiosHeaders.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      if (browser.isStandardBrowserEnv || browser.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else {
        requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = core_AxiosHeaders.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new core_AxiosError('Request aborted', core_AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || defaults_transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new core_AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (browser.isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new cancel_CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && browser.protocols.indexOf(protocol) === -1) {
      reject(new core_AxiosError('Unsupported protocol ' + protocol + ':', core_AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/adapters.js





const knownAdapters = {
  http: helpers_null,
  xhr: xhr
}

utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

/* harmony default export */ const adapters = ({
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new core_AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/dispatchRequest.js









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new cancel_CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = core_AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || lib_defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = core_AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = core_AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/mergeConfig.js





const headersToObject = (thing) => thing instanceof core_AxiosHeaders ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/env/data.js
const VERSION = "1.5.0";
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/validator.js





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new core_AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        core_AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new core_AxiosError('options must be an object', core_AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new core_AxiosError('option ' + opt + ' must be ' + result, core_AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new core_AxiosError('Unknown option ' + opt, core_AxiosError.ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const validator = ({
  assertOptions,
  validators
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/Axios.js











const Axios_validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new core_InterceptorManager(),
      response: new core_InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        forcedJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        clarifyTimeoutError: Axios_validators.transitional(Axios_validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: Axios_validators.function,
          serialize: Axios_validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = core_AxiosHeaders.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const core_Axios = (Axios);

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CancelToken.js




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new cancel_CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const cancel_CancelToken = (CancelToken);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/spread.js


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAxiosError.js




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/HttpStatusCode.js
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const helpers_HttpStatusCode = (HttpStatusCode);

;// CONCATENATED MODULE: ./node_modules/axios/lib/axios.js




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new core_Axios(defaultConfig);
  const instance = bind(core_Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, core_Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(lib_defaults);

// Expose Axios class to allow class inheritance
axios.Axios = core_Axios;

// Expose Cancel & CancelToken
axios.CanceledError = cancel_CanceledError;
axios.CancelToken = cancel_CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = helpers_toFormData;

// Expose AxiosError class
axios.AxiosError = core_AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = core_AxiosHeaders;

axios.formToJSON = thing => helpers_formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = helpers_HttpStatusCode;

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const lib_axios = (axios);

;// CONCATENATED MODULE: ./src/api.ts

const makeGraphQLQuery = (repo) => `{
    rateLimit {
      limit
      remaining
      used
      cost
    }
    search(
      query: "is:open is:pr involves:@me archived:false repo:${repo}"
      type: ISSUE
      first: 30
    ) {
      nodes {
        ... on PullRequest {
          id
          title
          createdAt
          number
          isDraft
          state
          isReadByViewer
          reviewDecision
          author {
            ... on User {
              login
              name
            }
          }
          baseRef {
            name
            associatedPullRequests(orderBy: {field: CREATED_AT, direction: DESC}, first: 1) {
              nodes {
                url
                number
                title
                repository {
                  name
                  url
                }
              }
            }
          }
          assignees(first: 10) {
            nodes {
              login
              name
            }
          }
          reviewRequests(first: 10) {
            nodes {
              requestedReviewer {
                ... on User {
                  login
                  name
                }
              }
            }
          }
          viewerLatestReview {
            state
          }
          latestNonPendingReviews: latestReviews(first: 10) {
            nodes {
              state
              author {
                ... on User {
                  id
                  name
                  login
                }
              }
            }
          }
          commits(last: 1) {
            nodes {
              commit {
                statusCheckRollup {
                  state
                  contexts(first: 30) {
                    checkRunCount
                    edges {
                      node {
                        ... on CheckRun {
                          name
                          conclusion
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
const getPRInfo = async (repo, token) => {
    const axiosInstance = lib_axios.create({
        baseURL: 'https://api.github.com/graphql',
        headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    let response = await axiosInstance.post('', {
        query: makeGraphQLQuery(repo)
    });
    return response.data;
};

;// CONCATENATED MODULE: ./src/icons.ts
//https://heroicons.com/
const inboxIconString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
<path fill-rule="evenodd" d="M1.5 9.832v1.793c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V9.832a3 3 0 00-.722-1.952l-3.285-3.832A3 3 0 0016.215 3h-8.43a3 3 0 00-2.278 1.048L2.222 7.88A3 3 0 001.5 9.832zM7.785 4.5a1.5 1.5 0 00-1.139.524L3.881 8.25h3.165a3 3 0 012.496 1.336l.164.246a1.5 1.5 0 001.248.668h2.092a1.5 1.5 0 001.248-.668l.164-.246a3 3 0 012.496-1.336h3.165l-2.765-3.226a1.5 1.5 0 00-1.139-.524h-8.43z" clip-rule="evenodd" />
<path d="M2.813 15c-.725 0-1.313.588-1.313 1.313V18a3 3 0 003 3h15a3 3 0 003-3v-1.688c0-.724-.588-1.312-1.313-1.312h-4.233a3 3 0 00-2.496 1.336l-.164.246a1.5 1.5 0 01-1.248.668h-2.092a1.5 1.5 0 01-1.248-.668l-.164-.246A3 3 0 007.046 15H2.812z" />
</svg>`;
const yoursIconString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
</svg>`;
const completedIconString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
</svg>`;
const noticeIconString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg>`;

;// CONCATENATED MODULE: ./src/external/GM_Config.js
/*
Copyright 2009+, GM_config Contributors (https://github.com/sizzlemctwizzle/GM_config)

GM_config Collaborators/Contributors:
    Mike Medley <medleymind@gmail.com>
    Joe Simmons
    Izzy Soft
    Marti Martz
    Adam Thompson-Sharpe

GM_config is distributed under the terms of the GNU Lesser General Public License.

    GM_config is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @exclude       *
// @author        Mike Medley <medleymind@gmail.com> (https://github.com/sizzlemctwizzle/GM_config)
// @icon          https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/gm_config_icon_large.png

// ==UserLibrary==
// @name          GM_config
// @description   A lightweight, reusable, cross-browser graphical settings framework for inclusion in user scripts.
// @copyright     2009+, Mike Medley (https://github.com/sizzlemctwizzle)
// @license       LGPL-3.0-or-later; https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/LICENSE

// @homepageURL   https://openuserjs.org/libs/sizzle/GM_config
// @homepageURL   https://github.com/sizzlemctwizzle/GM_config
// @supportURL    https://github.com/sizzlemctwizzle/GM_config/issues

// ==/UserScript==

// ==/UserLibrary==

/* jshint esversion: 8 */

let GM_config = (function (GM) {
    // This is the initializer function
    function GM_configInit(config, args) {
        // Initialize instance variables
        if (typeof config.fields == "undefined") {
            config.fields = {};
            config.onInit = config.onInit || function () { };
            config.onOpen = config.onOpen || function () { };
            config.onSave = config.onSave || function () { };
            config.onClose = config.onClose || function () { };
            config.onReset = config.onReset || function () { };
            config.isOpen = false;
            config.title = 'User Script Settings';
            config.css = {
                basic: [
                    "#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }",
                    "#GM_config { background: #FFF; }",
                    "#GM_config input[type='radio'] { margin-right: 8px; }",
                    "#GM_config .indent40 { margin-left: 40%; }",
                    "#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }",
                    "#GM_config .radio_label { font-size: 12px; }",
                    "#GM_config .block { display: block; }",
                    "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
                    "#GM_config .reset, #GM_config .reset a," +
                    " #GM_config_buttons_holder { color: #000; text-align: right; }",
                    "#GM_config .config_header { font-size: 20pt; margin: 0; }",
                    "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
                    "#GM_config .center { text-align: center; }",
                    "#GM_config .section_header_holder { margin-top: 8px; }",
                    "#GM_config .config_var { margin: 0 0 4px; }",
                    "#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;",
                    " font-size: 13pt; margin: 0; }",
                    "#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757;" +
                    " font-size: 9pt; margin: 0 0 6px; }"
                ].join('\n') + '\n',
                basicPrefix: "GM_config",
                stylish: ""
            };
        }
        config.frameStyle = [
            'bottom: auto; border: 1px solid #000; display: none; height: 75%;',
            'left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;',
            'overflow: auto; padding: 0; position: fixed; right: auto; top: 0;',
            'width: 75%; z-index: 9999;'
        ].join(' ');

        var settings = null;
        if (args.length == 1 &&
            typeof args[0].id == "string" &&
            typeof args[0].appendChild != "function") settings = args[0];
        else {
            // Provide backwards-compatibility with argument style intialization
            settings = {};

            // loop through GM_config.init() arguments
            for (let i = 0, l = args.length, arg; i < l; ++i) {
                arg = args[i];

                // An element to use as the config window
                if (typeof arg.appendChild == "function") {
                    settings.frame = arg;
                    continue;
                }

                switch (typeof arg) {
                    case 'object':
                        for (let j in arg) { // could be a callback functions or settings object
                            if (typeof arg[j] != "function") { // we are in the settings object
                                settings.fields = arg; // store settings object
                                break; // leave the loop
                            } // otherwise it must be a callback function
                            if (!settings.events) settings.events = {};
                            settings.events[j] = arg[j];
                        }
                        break;
                    case 'function': // passing a bare function is set to open callback
                        settings.events = { onOpen: arg };
                        break;
                    case 'string': // could be custom CSS or the title string
                        if (/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(arg))
                            settings.css = arg;
                        else
                            settings.title = arg;
                        break;
                }
            }
        }

        /* Initialize everything using the new settings object */
        // Set the id
        if (settings.id) config.id = settings.id;
        else if (typeof config.id == "undefined") config.id = 'GM_config';

        // Set the title
        if (settings.title) config.title = settings.title;

        // Set the custom css
        if (settings.css) config.css.stylish = settings.css;

        // Set the frame
        if (settings.frame) config.frame = settings.frame;

        // Set the style attribute of the frame
        if (typeof settings.frameStyle === 'string') config.frameStyle = settings.frameStyle;

        // Set the event callbacks
        if (settings.events) {
            let events = settings.events;
            for (let e in events) {
                config["on" + e.charAt(0).toUpperCase() + e.slice(1)] = events[e];
            }
        }

        // If the id has changed we must modify the default style
        if (config.id != config.css.basicPrefix) {
            config.css.basic = config.css.basic.replace(
                new RegExp('#' + config.css.basicPrefix, 'gm'), '#' + config.id);
            config.css.basicPrefix = config.id;
        }

        // Create the fields
        config.isInit = false;
        if (settings.fields) {
            config.read(null, (stored) => { // read the stored settings
                let fields = settings.fields,
                    customTypes = settings.types || {},
                    configId = config.id;

                for (let id in fields) {
                    let field = fields[id],
                        fieldExists = false;

                    if (config.fields[id]) {
                        fieldExists = true;
                    }

                    // for each field definition create a field object
                    if (field) {
                        if (config.isOpen && fieldExists) {
                            config.fields[id].remove();
                        }

                        config.fields[id] = new GM_configField(field, stored[id], id,
                            customTypes[field.type], configId);

                        // Add field to open frame
                        if (config.isOpen) {
                            config.fields[id].wrapper = config.fields[id].toNode();
                            config.frameSection.appendChild(config.fields[id].wrapper);
                        }
                    } else if (!field && fieldExists) {
                        // Remove field from open frame
                        if (config.isOpen) {
                            config.fields[id].remove();
                        }

                        delete config.fields[id];
                    }
                }

                config.isInit = true;
                config.onInit.call(config);
            });
        } else {
            config.isInit = true;
            config.onInit.call(config);
        }
    }

    let construct = function () {
        // Parsing of input provided via frontends
        GM_configInit(this, arguments);
    };
    construct.prototype = {
        // Support re-initalization
        init: function () {
            GM_configInit(this, arguments);
        },

        // call GM_config.open() from your script to open the menu
        open: function () {
            // don't open before init is finished
            if (!this.isInit) {
                setTimeout(() => this.open(), 0);
                return;
            }
            // Die if the menu is already open on this page
            // You can have multiple instances but you can't open the same instance twice
            let match = document.getElementById(this.id);
            if (match && (match.tagName == "IFRAME" || match.childNodes.length > 0)) return;

            // Sometimes "this" gets overwritten so create an alias
            let config = this;

            // Function to build the mighty config window :)
            function buildConfigWin(body, head) {
                let create = config.create,
                    fields = config.fields,
                    configId = config.id,
                    bodyWrapper = create('div', { id: configId + '_wrapper' });

                // Append the style which is our default style plus the user style
                head.appendChild(
                    create('style', {
                        type: 'text/css',
                        textContent: config.css.basic + config.css.stylish
                    }));

                // Add header and title
                bodyWrapper.appendChild(create('div', {
                    id: configId + '_header',
                    className: 'config_header block center'
                }, config.title));

                // Append elements
                let section = bodyWrapper,
                    secNum = 0; // Section count

                // loop through fields
                for (let id in fields) {
                    let field = fields[id],
                        settings = field.settings;

                    if (settings.section) { // the start of a new section
                        section = bodyWrapper.appendChild(create('div', {
                            className: 'section_header_holder',
                            id: configId + '_section_' + secNum
                        }));

                        if (!Array.isArray(settings.section))
                            settings.section = [settings.section];

                        if (settings.section[0])
                            section.appendChild(create('div', {
                                className: 'section_header center',
                                id: configId + '_section_header_' + secNum
                            }, settings.section[0]));

                        if (settings.section[1])
                            section.appendChild(create('p', {
                                className: 'section_desc center',
                                id: configId + '_section_desc_' + secNum
                            }, settings.section[1]));
                        ++secNum;
                    }

                    if (secNum === 0) {
                        section = bodyWrapper.appendChild(create('div', {
                            className: 'section_header_holder',
                            id: configId + '_section_' + (secNum++)
                        }));
                    }

                    // Create field elements and append to current section
                    section.appendChild((field.wrapper = field.toNode()));
                }

                config.frameSection = section;

                // Add save and close buttons
                bodyWrapper.appendChild(create('div',
                    { id: configId + '_buttons_holder' },

                    create('button', {
                        id: configId + '_saveBtn',
                        textContent: 'Save',
                        title: 'Save settings',
                        className: 'saveclose_buttons',
                        onclick: function () { config.save(); }
                    }),

                    create('button', {
                        id: configId + '_closeBtn',
                        textContent: 'Close',
                        title: 'Close window',
                        className: 'saveclose_buttons',
                        onclick: function () { config.close(); }
                    }),

                    create('div',
                        { className: 'reset_holder block' },

                        // Reset link
                        create('a', {
                            id: configId + '_resetLink',
                            textContent: 'Reset to defaults',
                            href: '#',
                            title: 'Reset fields to default values',
                            className: 'reset',
                            onclick: function (e) { e.preventDefault(); config.reset(); }
                        })
                    )));

                body.appendChild(bodyWrapper); // Paint everything to window at once
                config.center(); // Show and center iframe
                window.addEventListener('resize', config.center, false); // Center frame on resize

                // Call the open() callback function
                config.onOpen(config.frame.contentDocument || config.frame.ownerDocument,
                    config.frame.contentWindow || window,
                    config.frame);

                // Close frame on window close
                window.addEventListener('beforeunload', function () {
                    config.close();
                }, false);

                // Now that everything is loaded, make it visible
                config.frame.style.display = "block";
                config.isOpen = true;
            }

            // Either use the element passed to init() or create an iframe
            if (this.frame) {
                this.frame.id = this.id; // Allows for prefixing styles with the config id
                if (this.frameStyle) this.frame.setAttribute('style', this.frameStyle);
                buildConfigWin(this.frame, this.frame.ownerDocument.getElementsByTagName('head')[0]);
            } else {
                // Create frame
                this.frame = this.create('iframe', { id: this.id });
                if (this.frameStyle) this.frame.setAttribute('style', this.frameStyle);
                document.body.appendChild(this.frame);

                // In WebKit src can't be set until it is added to the page
                this.frame.src = '';
                // we wait for the iframe to load before we can modify it
                let that = this;
                this.frame.addEventListener('load', function (e) {
                    let frame = config.frame;
                    if (!frame.contentDocument) {
                        that.log("GM_config failed to initialize default settings dialog node!");
                    } else {
                        let body = frame.contentDocument.getElementsByTagName('body')[0];
                        body.id = config.id; // Allows for prefixing styles with the config id
                        buildConfigWin(body, frame.contentDocument.getElementsByTagName('head')[0]);
                    }
                }, false);
            }
        },

        save: function () {
            this.write(null, null, (vals) => this.onSave(vals));
        },

        close: function () {
            // If frame is an iframe then remove it
            if (this.frame && this.frame.contentDocument) {
                this.remove(this.frame);
                this.frame = null;
            } else if (this.frame) { // else wipe its content
                this.frame.innerHTML = "";
                this.frame.style.display = "none";
            }

            // Null out all the fields so we don't leak memory
            let fields = this.fields;
            for (let id in fields) {
                let field = fields[id];
                field.wrapper = null;
                field.node = null;
            }

            this.onClose(); //  Call the close() callback function
            this.isOpen = false;
        },

        set: function (name, val) {
            this.fields[name].value = val;

            if (this.fields[name].node) {
                this.fields[name].reload();
            }
        },

        get: function (name, getLive) {
            /* Migration warning */
            if (!this.isInit) {
                this.log('GM_config: get called before init, see https://github.com/sizzlemctwizzle/GM_config/issues/113');
            }

            let field = this.fields[name],
                fieldVal = null;

            if (getLive && field.node) {
                fieldVal = field.toValue();
            }

            return fieldVal != null ? fieldVal : field.value;
        },

        write: function (store, obj, cb) {
            let forgotten = null,
                values = null;
            if (!obj) {
                let fields = this.fields;

                values = {};
                forgotten = {};

                for (let id in fields) {
                    let field = fields[id];
                    let value = field.toValue();

                    if (field.save) {
                        if (value != null) {
                            values[id] = value;
                            field.value = value;
                        } else
                            values[id] = field.value;
                    } else
                        forgotten[id] = value != null ? value : field.value;
                }
            }

            (async () => {
                try {
                    let val = this.stringify(obj || values);
                    await this.setValue(store || this.id, val);
                } catch (e) {
                    this.log("GM_config failed to save settings!");
                }
                cb(forgotten);
            })();
        },

        read: function (store, cb) {
            (async () => {
                let val = await this.getValue(store || this.id, '{}');
                try {
                    let rval = this.parser(val);
                    cb(rval);
                } catch (e) {
                    this.log("GM_config failed to read saved settings!");
                    cb({});
                }
            })();
        },

        reset: function () {
            let fields = this.fields;

            // Reset all the fields
            for (let id in fields) { fields[id].reset(); }

            this.onReset(); // Call the reset() callback function
        },

        create: function () {
            let A = null,
                B = null;
            switch (arguments.length) {
                case 1:
                    A = document.createTextNode(arguments[0]);
                    break;
                default:
                    A = document.createElement(arguments[0]);
                    B = arguments[1];
                    for (let b in B) {
                        if (b.indexOf("on") == 0)
                            A.addEventListener(b.substring(2), B[b], false);
                        else if (",style,accesskey,id,name,src,href,which,for".indexOf("," +
                            b.toLowerCase()) != -1)
                            A.setAttribute(b, B[b]);
                        else
                            A[b] = B[b];
                    }
                    if (typeof arguments[2] == "string")
                        A.innerHTML = arguments[2];
                    else
                        for (let i = 2, len = arguments.length; i < len; ++i)
                            A.appendChild(arguments[i]);
            }
            return A;
        },

        center: function () {
            let node = this.frame;
            if (!node) return;
            let style = node.style,
                beforeOpacity = style.opacity;
            if (style.display == 'none') style.opacity = '0';
            style.display = '';
            style.top = Math.floor((window.innerHeight / 2) - (node.offsetHeight / 2)) + 'px';
            style.left = Math.floor((window.innerWidth / 2) - (node.offsetWidth / 2)) + 'px';
            style.opacity = '1';
        },

        remove: function (el) {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        }
    };

    construct.prototype.name = 'GM_config';
    construct.prototype.constructor = construct;
    let isGM4 = typeof GM.getValue !== 'undefined' &&
        typeof GM.setValue !== 'undefined';
    let isGM = isGM4 || (typeof GM_getValue !== 'undefined' &&
        typeof GM_getValue('a', 'b') !== 'undefined');
    construct.prototype.isGM = isGM;

    if (!isGM4) {
        let promisify = (old) => (...args) => {
            return new Promise((resolve, reject) => {
                try {
                    resolve(old.apply(this, args));
                } catch (e) {
                    reject(e);
                }
            });
        };

        let getValue = isGM ? GM_getValue
            : (name, def) => {
                let s = localStorage.getItem(name);
                return s !== null ? s : def;
            };
        let setValue = isGM ? GM_setValue
            : (name, value) => localStorage.setItem(name, value);
        let log = typeof GM_log !== 'undefined' ? GM_log : console.log;

        GM.getValue = promisify(getValue);
        GM.setValue = promisify(setValue);
        GM.log = promisify(log);
    }

    construct.prototype.stringify = JSON.stringify;
    construct.prototype.parser = JSON.parse;
    construct.prototype.getValue = GM.getValue;
    construct.prototype.setValue = GM.setValue;
    construct.prototype.log = GM.log || console.log;

    // Passthrough frontends for new and old usage
    let config = function () {
        return new (config.bind.apply(construct,
            [null].concat(Array.from(arguments))));
    };
    config.prototype.constructor = config;

    // Support old method of initalizing
    config.init = function () {
        GM_config = config.apply(this, arguments);
        GM_config.init = function () {
            GM_configInit(this, arguments);
        };
    };

    // Reusable functions and properties
    // Usable via GM_config.*
    config.create = construct.prototype.create;
    config.isGM = construct.prototype.isGM;
    config.setValue = construct.prototype.setValue;
    config.getValue = construct.prototype.getValue;
    config.stringify = construct.prototype.stringify;
    config.parser = construct.prototype.parser;
    config.log = construct.prototype.log;
    config.remove = construct.prototype.remove;
    config.read = construct.prototype.read.bind(config);
    config.write = construct.prototype.write.bind(config);

    return config;
}(typeof GM === 'object' ? GM : Object.create(null)));
let GM_configStruct = (/* unused pure expression or super */ null && (GM_config));

function GM_configField(settings, stored, id, customType, configId) {
    // Store the field's settings
    this.settings = settings;
    this.id = id;
    this.configId = configId;
    this.node = null;
    this.wrapper = null;
    this.save = typeof settings.save == "undefined" ? true : settings.save;

    // Buttons are static and don't have a stored value
    if (settings.type == "button") this.save = false;

    // if a default value wasn't passed through init() then
    //   if the type is custom use its default value
    //   else use default value for type
    // else use the default value passed through init()
    this['default'] = typeof settings['default'] == "undefined" ?
        customType ?
            customType['default']
            : this.defaultValue(settings.type, settings.options)
        : settings['default'];

    // Store the field's value
    this.value = typeof stored == "undefined" ? this['default'] : stored;

    // Setup methods for a custom type
    if (customType) {
        this.toNode = customType.toNode;
        this.toValue = customType.toValue;
        this.reset = customType.reset;
    }
}

GM_configField.prototype = {
    create: GM_config.create,

    defaultValue: function (type, options) {
        let value;

        if (type.indexOf('unsigned ') == 0)
            type = type.substring(9);

        switch (type) {
            case 'radio': case 'select':
                value = options[0];
                break;
            case 'checkbox':
                value = false;
                break;
            case 'int': case 'integer':
            case 'float': case 'number':
                value = 0;
                break;
            default:
                value = '';
        }

        return value;
    },

    toNode: function () {
        let field = this.settings,
            value = this.value,
            options = field.options,
            type = field.type,
            id = this.id,
            configId = this.configId,
            labelPos = field.labelPos,
            create = this.create;

        function addLabel(pos, labelEl, parentNode, beforeEl) {
            if (!beforeEl) beforeEl = parentNode.firstChild;
            switch (pos) {
                case 'right': case 'below':
                    if (pos == 'below')
                        parentNode.appendChild(create('br', {}));
                    parentNode.appendChild(labelEl);
                    break;
                default:
                    if (pos == 'above')
                        parentNode.insertBefore(create('br', {}), beforeEl);
                    parentNode.insertBefore(labelEl, beforeEl);
            }
        }

        let retNode = create('div', {
            className: 'config_var',
            id: configId + '_' + id + '_var',
            title: field.title || ''
        }),
            firstProp;

        // Retrieve the first prop
        for (let i in field) { firstProp = i; break; }

        let label = field.label && type != "button" ?
            create('label', {
                id: configId + '_' + id + '_field_label',
                for: configId + '_field_' + id,
                className: 'field_label'
            }, field.label) : null;

        let wrap = null;
        switch (type) {
            case 'textarea':
                retNode.appendChild((this.node = create('textarea', {
                    innerHTML: value,
                    id: configId + '_field_' + id,
                    className: 'block',
                    cols: (field.cols ? field.cols : 20),
                    rows: (field.rows ? field.rows : 2)
                })));
                break;
            case 'radio':
                wrap = create('div', {
                    id: configId + '_field_' + id
                });
                this.node = wrap;

                for (let i = 0, len = options.length; i < len; ++i) {
                    let radLabel = create('label', {
                        className: 'radio_label'
                    }, options[i]);

                    let rad = wrap.appendChild(create('input', {
                        value: options[i],
                        type: 'radio',
                        name: id,
                        checked: options[i] == value
                    }));

                    let radLabelPos = labelPos &&
                        (labelPos == 'left' || labelPos == 'right') ?
                        labelPos : firstProp == 'options' ? 'left' : 'right';

                    addLabel(radLabelPos, radLabel, wrap, rad);
                }

                retNode.appendChild(wrap);
                break;
            case 'select':
                wrap = create('select', {
                    id: configId + '_field_' + id
                });
                this.node = wrap;

                for (let i = 0, len = options.length; i < len; ++i) {
                    let option = options[i];
                    wrap.appendChild(create('option', {
                        value: option,
                        selected: option == value
                    }, option));
                }

                retNode.appendChild(wrap);
                break;
            default: // fields using input elements
                let props = {
                    id: configId + '_field_' + id,
                    type: type,
                    value: type == 'button' ? field.label : value
                };

                switch (type) {
                    case 'checkbox':
                        props.checked = value;
                        break;
                    case 'button':
                        props.size = field.size ? field.size : 25;
                        if (field.script) field.click = field.script;
                        if (field.click) props.onclick = field.click;
                        break;
                    case 'hidden':
                        break;
                    default:
                        // type = text, int, or float
                        props.type = 'text';
                        props.size = field.size ? field.size : 25;
                }

                retNode.appendChild((this.node = create('input', props)));
        }

        if (label) {
            // If the label is passed first, insert it before the field
            // else insert it after
            if (!labelPos)
                labelPos = firstProp == "label" || type == "radio" ?
                    "left" : "right";

            addLabel(labelPos, label, retNode);
        }

        return retNode;
    },

    toValue: function () {
        let node = this.node,
            field = this.settings,
            type = field.type,
            unsigned = false,
            rval = null;

        if (!node) return rval;

        if (type.indexOf('unsigned ') == 0) {
            type = type.substring(9);
            unsigned = true;
        }

        switch (type) {
            case 'checkbox':
                rval = node.checked;
                break;
            case 'select':
                rval = node[node.selectedIndex].value;
                break;
            case 'radio':
                let radios = node.getElementsByTagName('input');
                for (let i = 0, len = radios.length; i < len; ++i) {
                    if (radios[i].checked)
                        rval = radios[i].value;
                }
                break;
            case 'button':
                break;
            case 'int': case 'integer':
            case 'float': case 'number':
                let num = Number(node.value);
                let warn = 'Field labeled "' + field.label + '" expects a' +
                    (unsigned ? ' positive ' : 'n ') + 'integer value';

                if (isNaN(num) || (type.substr(0, 3) == 'int' &&
                    Math.ceil(num) != Math.floor(num)) ||
                    (unsigned && num < 0)) {
                    alert(warn + '.');
                    return null;
                }

                if (!this._checkNumberRange(num, warn))
                    return null;
                rval = num;
                break;
            default:
                rval = node.value;
                break;
        }

        return rval; // value read successfully
    },

    reset: function () {
        let node = this.node,
            field = this.settings,
            type = field.type;

        if (!node) return;

        switch (type) {
            case 'checkbox':
                node.checked = this['default'];
                break;
            case 'select':
                for (let i = 0, len = node.options.length; i < len; ++i) {
                    if (node.options[i].textContent == this['default'])
                        node.selectedIndex = i;
                }
                break;
            case 'radio':
                let radios = node.getElementsByTagName('input');
                for (let i = 0, len = radios.length; i < len; ++i) {
                    if (radios[i].value == this['default'])
                        radios[i].checked = true;
                }
                break;
            case 'button':
                break;
            default:
                node.value = this['default'];
                break;
        }
    },

    remove: function () {
        GM_config.remove(this.wrapper);
        this.wrapper = null;
        this.node = null;
    },

    reload: function () {
        let wrapper = this.wrapper;
        if (wrapper) {
            let fieldParent = wrapper.parentNode;
            let newWrapper = this.toNode();
            fieldParent.insertBefore(newWrapper, wrapper);
            GM_config.remove(this.wrapper);
            this.wrapper = newWrapper;
        }
    },

    _checkNumberRange: function (num, warn) {
        let field = this.settings;
        if (typeof field.min == "number" && num < field.min) {
            alert(warn + ' greater than or equal to ' + field.min + '.');
            return null;
        }

        if (typeof field.max == "number" && num > field.max) {
            alert(warn + ' less than or equal to ' + field.max + '.');
            return null;
        }
        return true;
    }
};


;// CONCATENATED MODULE: ./src/storage.ts
//Found it easier to just copy the js from the source into this project and reference from it

const TOKEN_DEFAULT = "<Token Here>";
const USERNAME_DEFAULT = "<Username Here>";
const REPO_DEFAULT = "<Repo Here>";
const IGNORED_CI_DEFAULT = "";
const USE_BASE_REF_PR_NAME_DEFAULT = true;
var storageKeys;
(function (storageKeys) {
    storageKeys["TOKEN"] = "token";
    storageKeys["REPO"] = "repo";
    storageKeys["USERNAME"] = "username";
    storageKeys["IGNORED_GI"] = "ignoredCI";
    storageKeys["USE_BASE_REF_PR_NAME"] = "useBaseRefPrName";
})(storageKeys || (storageKeys = {}));
let user_pref = undefined;
const initializeStorage = (successCallback) => {
    user_pref = new GM_config({
        id: 'MyConfig',
        title: 'Script Settings (refresh page after saving; you can open this again by going to GitHub footer)',
        fields: {
            [storageKeys.TOKEN]: {
                label: 'Github Personal Access Token (only read-only necessary)',
                type: 'text',
                default: TOKEN_DEFAULT
            },
            [storageKeys.REPO]: {
                label: 'Repo name. Used for query: `is:open is:pr involves:@me archived:false repo:xxx`',
                type: 'text',
                default: REPO_DEFAULT
            },
            [storageKeys.USERNAME]: {
                label: 'Github Username',
                type: 'text',
                default: USERNAME_DEFAULT
            },
            [storageKeys.IGNORED_GI]: {
                label: '[Optional] CI test titles to ignore, comma separated',
                type: 'text',
                default: IGNORED_CI_DEFAULT
            },
            [storageKeys.USE_BASE_REF_PR_NAME]: {
                label: "[Optional] Refer to base branches using their associated PR's name",
                type: 'checkbox',
                default: USE_BASE_REF_PR_NAME_DEFAULT
            }
        },
        events: {
            init: successCallback
        }
    });
};
const getStoredValue = (key) => user_pref.get(key);
const openStoragePanel = () => user_pref.open();

;// CONCATENATED MODULE: ./src/badges.ts


const getBadgeHolder = () => {
    const holder = document.createElement("div");
    holder.classList.add("badgeHolder");
    return holder;
};
const makeBadge = (icon, href) => {
    const badge = document.createElement("div");
    badge.classList.add("badge");
    badge.classList.add(icon.className);
    const text = document.createElement("p");
    text.classList.add("badgeText");
    text.innerText = icon.text;
    const iconHolder = document.createElement("div");
    iconHolder.classList.add("iconHolder");
    const template = document.createElement('template');
    template.innerHTML = icon.iconString;
    iconHolder.appendChild(template.content.firstChild);
    badge.appendChild(iconHolder);
    badge.appendChild(text);
    const badgeLinkHolder = document.createElement("a");
    badgeLinkHolder.href = href;
    badgeLinkHolder.appendChild(badge);
    return badgeLinkHolder;
};
const getPendingPrimaryBadge = (href) => makeBadge({
    className: "yellow",
    iconString: inboxIconString,
    text: "Pending - Primary"
}, href);
const getPendingSecondaryBadge = (href) => makeBadge({
    className: "yellow",
    iconString: inboxIconString,
    text: "Pending - Secondary"
}, href);
const getByYouBadge = (href) => makeBadge({
    className: "hollow",
    iconString: yoursIconString,
    text: "Yours"
}, href);
const getYouApprovedBadge = (href) => makeBadge({
    className: "hollow",
    iconString: completedIconString,
    text: "You Approved"
}, href);
const getYouRequestedChanges = (href) => makeBadge({
    className: "hollow",
    iconString: completedIconString,
    text: "You Requested Changes"
}, href);
const getSomeoneRequestedChanges = (href) => makeBadge({
    className: "red",
    iconString: noticeIconString,
    text: "Changes Requested"
}, href);
const getNoPrimaryBadge = (href) => makeBadge({
    className: "red",
    iconString: noticeIconString,
    text: "No Primary"
}, href);
const getBaseBranchAnnotation = (prInfo) => {
    const baseRef = document.createElement("a");
    baseRef.classList.add("lh-default", "d-block", "d-md-inline");
    baseRef.style.color = "grey";
    if (prInfo.baseBranch?.prNumber) {
        baseRef.textContent = `(#${prInfo.baseBranch?.prNumber}) ` + baseRef.textContent;
        const url = prInfo.baseBranch?.prUrl || "";
        baseRef.href = url;
        baseRef.setAttribute("data-hovercard-type", "pull_request");
        baseRef.setAttribute("data-hovercard-url", url.replace("https://github.com", "") + "/hovercard");
        baseRef.setAttribute("data-turbo-frame", "repo-content-turbo-frame");
    }
    if (prInfo.byUser) {
        if (getStoredValue(storageKeys.USE_BASE_REF_PR_NAME)) {
            baseRef.textContent += `[${truncate(prInfo.baseBranch?.prName ?? "", 18)}] <- `;
        }
        else {
            const cleanedBase = prInfo.baseBranch?.name?.split("/").pop(); //In my company, branches are formatted as <username>/<branch_name>
            baseRef.textContent += `[${truncate(cleanedBase ?? "", 18)}] <- `;
        }
    }
    else {
        baseRef.textContent += `[not master] <- `;
    }
    return baseRef;
};
const truncate = (str, length) => str.length > length ? `${str.substring(0, length)}...` : str;
const getFailedCIBadge = (href, CIName) => makeBadge({
    className: "red",
    iconString: noticeIconString,
    text: truncate(CIName, 10)
}, href);

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/style/main.css
var main = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/style/main.css");
;// CONCATENATED MODULE: ./src/style/main.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.Z, options);




       /* harmony default export */ const style_main = (main/* default */.Z && main/* default */.Z.locals ? main/* default */.Z.locals : undefined);

;// CONCATENATED MODULE: ./node_modules/github-url-detection/distribution/index.js
const reservedNames = [
  "400",
  "401",
  "402",
  "403",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "411",
  "412",
  "413",
  "414",
  "415",
  "416",
  "417",
  "418",
  "419",
  "420",
  "421",
  "422",
  "423",
  "424",
  "425",
  "426",
  "427",
  "428",
  "429",
  "430",
  "431",
  "500",
  "501",
  "502",
  "503",
  "504",
  "505",
  "506",
  "507",
  "508",
  "509",
  "510",
  "511",
  "about",
  "access",
  "account",
  "admin",
  "advisories",
  "anonymous",
  "any",
  "api",
  "apps",
  "attributes",
  "auth",
  "billing",
  "blob",
  "blog",
  "bounty",
  "branches",
  "business",
  "businesses",
  "c",
  "cache",
  "case-studies",
  "categories",
  "central",
  "certification",
  "changelog",
  "cla",
  "cloud",
  "codereview",
  "collection",
  "collections",
  "comments",
  "commit",
  "commits",
  "community",
  "companies",
  "compare",
  "contact",
  "contributing",
  "cookbook",
  "coupons",
  "customer-stories",
  "customer",
  "customers",
  "dashboard",
  "dashboards",
  "design",
  "develop",
  "developer",
  "diff",
  "discover",
  "discussions",
  "docs",
  "downloads",
  "downtime",
  "editor",
  "editors",
  "edu",
  "enterprise",
  "events",
  "explore",
  "featured",
  "features",
  "files",
  "fixtures",
  "forked",
  "garage",
  "ghost",
  "gist",
  "gists",
  "graphs",
  "guide",
  "guides",
  "help",
  "help-wanted",
  "home",
  "hooks",
  "hosting",
  "hovercards",
  "identity",
  "images",
  "inbox",
  "individual",
  "info",
  "integration",
  "interfaces",
  "introduction",
  "invalid-email-address",
  "investors",
  "issues",
  "jobs",
  "join",
  "journal",
  "journals",
  "lab",
  "labs",
  "languages",
  "launch",
  "layouts",
  "learn",
  "legal",
  "library",
  "linux",
  "listings",
  "lists",
  "login",
  "logos",
  "logout",
  "mac",
  "maintenance",
  "malware",
  "man",
  "marketplace",
  "mention",
  "mentioned",
  "mentioning",
  "mentions",
  "migrating",
  "milestones",
  "mine",
  "mirrors",
  "mobile",
  "navigation",
  "network",
  "new",
  "news",
  "none",
  "nonprofit",
  "nonprofits",
  "notices",
  "notifications",
  "oauth",
  "offer",
  "open-source",
  "organisations",
  "organizations",
  "orgs",
  "pages",
  "partners",
  "payments",
  "personal",
  "plans",
  "plugins",
  "popular",
  "popularity",
  "posts",
  "press",
  "pricing",
  "professional",
  "projects",
  "pulls",
  "raw",
  "readme",
  "recommendations",
  "redeem",
  "releases",
  "render",
  "reply",
  "repositories",
  "resources",
  "restore",
  "revert",
  "save-net-neutrality",
  "saved",
  "scraping",
  "search",
  "security",
  "services",
  "sessions",
  "settings",
  "shareholders",
  "shop",
  "showcases",
  "signin",
  "signup",
  "site",
  "spam",
  "sponsors",
  "ssh",
  "staff",
  "starred",
  "stars",
  "static",
  "status",
  "statuses",
  "storage",
  "store",
  "stories",
  "styleguide",
  "subscriptions",
  "suggest",
  "suggestion",
  "suggestions",
  "support",
  "suspended",
  "talks",
  "teach",
  "teacher",
  "teachers",
  "teaching",
  "team",
  "teams",
  "ten",
  "terms",
  "timeline",
  "topic",
  "topics",
  "tos",
  "tour",
  "train",
  "training",
  "translations",
  "tree",
  "trending",
  "updates",
  "username",
  "users",
  "visualization",
  "w",
  "watching",
  "wiki",
  "windows",
  "works-with",
  "www0",
  "www1",
  "www2",
  "www3",
  "www4",
  "www5",
  "www6",
  "www7",
  "www8",
  "www9"
];
const $ = (selector) => document.querySelector(selector);
const exists = (selector) => Boolean($(selector));
const is404 = () => /^(Page|File) not found · GitHub/.test(document.title);
const is500 = () => document.title === "Server Error · GitHub" || document.title === "Unicorn! · GitHub" || document.title === "504 Gateway Time-out";
const isPasswordConfirmation = () => document.title === "Confirm password" || document.title === "Confirm access";
const isBlame = (url = location) => Boolean(getRepo(url)?.path.startsWith("blame/"));
const isCommit = (url = location) => isSingleCommit(url) || isPRCommit(url);
const isCommitList = (url = location) => isRepoCommitList(url) || isPRCommitList(url);
const isRepoCommitList = (url = location) => Boolean(getRepo(url)?.path.startsWith("commits"));
const isCompare = (url = location) => Boolean(getRepo(url)?.path.startsWith("compare"));
const isCompareWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).split("/").slice(3, 5).includes("_compare");
const isDashboard = (url = location) => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url));
const isEnterprise = (url = location) => url.hostname !== "github.com" && url.hostname !== "gist.github.com";
const isGist = (url = location) => typeof getCleanGistPathname(url) === "string";
const isGlobalIssueOrPRList = (url = location) => ["issues", "pulls"].includes(url.pathname.split("/", 2)[1]);
const isGlobalSearchResults = (url = location) => url.pathname === "/search" && new URLSearchParams(url.search).get("q") !== null;
const isIssue = (url = location) => /^issues\/\d+/.test(getRepo(url)?.path) && document.title !== "GitHub · Where software is built";
const isIssueOrPRList = (url = location) => isGlobalIssueOrPRList(url) || isRepoIssueOrPRList(url) || isMilestone(url);
const isConversation = (url = location) => isIssue(url) || isPRConversation(url);
const isLabelList = (url = location) => getRepo(url)?.path === "labels";
const isMilestone = (url = location) => /^milestone\/\d+/.test(getRepo(url)?.path);
const isMilestoneList = (url = location) => getRepo(url)?.path === "milestones";
const isNewFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("new"));
const isNewIssue = (url = location) => getRepo(url)?.path === "issues/new";
const isNewRelease = (url = location) => getRepo(url)?.path === "releases/new";
const isNewWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).endsWith("/_new");
const isNotifications = (url = location) => getCleanPathname(url) === "notifications";
const isOrganizationProfile = () => exists('meta[name="hovercard-subject-tag"][content^="organization"]');
const isOrganizationRepo = () => exists('.AppHeader-context-full [data-hovercard-type="organization"]');
const isTeamDiscussion = (url = location) => Boolean(getOrg(url)?.path.startsWith("teams"));
const isOwnUserProfile = () => getCleanPathname() === getUsername();
const isOwnOrganizationProfile = () => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');
const isProject = (url = location) => /^projects\/\d+/.test(getRepo(url)?.path);
const isProjects = (url = location) => getRepo(url)?.path === "projects";
const isDiscussion = (url = location) => /^discussions\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path);
const isNewDiscussion = (url = location) => getRepo(url)?.path === "discussions/new" || getOrg(url)?.path === "discussions/new";
const isDiscussionList = (url = location) => getRepo(url)?.path === "discussions" || getOrg(url)?.path === "discussions";
const isPR = (url = location) => /^pull\/\d+/.test(getRepo(url)?.path) && !isPRConflicts(url);
const isPRConflicts = (url = location) => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path);
const isPRList = (url = location) => url.pathname === "/pulls" || getRepo(url)?.path === "pulls";
const isPRCommit = (url = location) => /^pull\/\d+\/commits\/[\da-f]{5,40}$/.test(getRepo(url)?.path);
const isPRCommit404 = () => isPRCommit() && document.title.startsWith("Commit range not found · Pull Request");
const isPRFile404 = () => isPRFiles() && document.title.startsWith("Commit range not found · Pull Request");
const isPRConversation = (url = location) => /^pull\/\d+$/.test(getRepo(url)?.path);
const isPRCommitList = (url = location) => /^pull\/\d+\/commits$/.test(getRepo(url)?.path);
const isPRFiles = (url = location) => /^pull\/\d+\/files/.test(getRepo(url)?.path) || isPRCommit(url);
const isQuickPR = (url = location) => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search);
const isDraftPR = () => exists("#partial-discussion-header .octicon-git-pull-request-draft");
const isOpenPR = () => exists("#partial-discussion-header :is(.octicon-git-pull-request, .octicon-git-pull-request-draft)");
const isMergedPR = () => exists("#partial-discussion-header .octicon-git-merge");
const isClosedPR = () => exists("#partial-discussion-header :is(.octicon-git-pull-request-closed, .octicon-git-merge)");
const isClosedIssue = () => exists("#partial-discussion-header :is(.octicon-issue-closed, .octicon-skip)");
const isReleases = (url = location) => getRepo(url)?.path === "releases";
const isTags = (url = location) => getRepo(url)?.path === "tags";
const isSingleReleaseOrTag = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/tag"));
const isReleasesOrTags = (url = location) => isReleases(url) || isTags(url);
const isDeletingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("delete"));
const isEditingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("edit"));
const hasFileEditor = (url = location) => isEditingFile(url) || isNewFile(url) || isDeletingFile(url);
const isEditingRelease = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/edit"));
const hasReleaseEditor = (url = location) => isEditingRelease(url) || isNewRelease(url);
const isEditingWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).endsWith("/_edit");
const hasWikiPageEditor = (url = location) => isEditingWikiPage(url) || isNewWikiPage(url);
const isRepo = (url = location) => /^[^/]+\/[^/]+/.test(getCleanPathname(url)) && !reservedNames.includes(url.pathname.split("/", 2)[1]) && !isDashboard(url) && !isGist(url) && !isNewRepoTemplate(url);
const hasRepoHeader = (url = location) => isRepo(url) && !isRepoSearch(url);
const isEmptyRepoRoot = () => isRepoHome() && !exists('link[rel="canonical"]');
const isEmptyRepo = () => exists('[aria-label="Cannot fork because repository is empty."]');
const isPublicRepo = () => exists('meta[name="octolytics-dimension-repository_public"][content="true"]');
const isArchivedRepo = () => Boolean(isRepo() && $("main > .flash-warn")?.textContent.includes("archived"));
const isBlank = () => exists("main .blankslate:not([hidden] .blankslate)");
const isRepoTaxonomyIssueOrPRList = (url = location) => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path);
const isRepoIssueOrPRList = (url = location) => isRepoPRList(url) || isRepoIssueList(url) || isRepoTaxonomyIssueOrPRList(url);
const isRepoPRList = (url = location) => Boolean(getRepo(url)?.path.startsWith("pulls"));
const isRepoIssueList = (url = location) => (
  // `issues/fregante` is a list but `issues/1`, `issues/new`, `issues/new/choose`, `issues/templates/edit` aren’t
  /^labels\/|^issues(?!\/(\d+|new|templates)($|\/))/.test(getRepo(url)?.path)
);
const hasSearchParameter = (url) => new URLSearchParams(url.search).get("search") === "1";
const isRepoHome = (url = location) => getRepo(url)?.path === "" && !hasSearchParameter(url);
const _isRepoRoot = (url) => {
  const repository = getRepo(url ?? location);
  if (!repository) {
    return false;
  }
  if (!repository.path) {
    return true;
  }
  if (url) {
    return /^tree\/[^/]+$/.test(repository.path);
  }
  return repository.path.startsWith("tree/") && document.title.startsWith(repository.nameWithOwner) && !document.title.endsWith(repository.nameWithOwner);
};
const isRepoRoot = (url) => !hasSearchParameter(url ?? location) && _isRepoRoot(url);
const isRepoSearch = (url = location) => getRepo(url)?.path === "search";
const isRepoSettings = (url = location) => Boolean(getRepo(url)?.path.startsWith("settings"));
const isRepoMainSettings = (url = location) => getRepo(url)?.path === "settings";
const isRepliesSettings = (url = location) => url.pathname.startsWith("/settings/replies");
const isUserSettings = (url = location) => url.pathname.startsWith("/settings/");
const isRepoTree = (url = location) => _isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith("tree/"));
const isRepoWiki = (url = location) => Boolean(getRepo(url)?.path.startsWith("wiki"));
const isSingleCommit = (url = location) => /^commit\/[\da-f]{5,40}$/.test(getRepo(url)?.path);
const isSingleFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("blob/"));
const isFileFinder = (url = location) => Boolean(getRepo(url)?.path.startsWith("find/"));
const isRepoFile404 = (url = location) => (isSingleFile(url) || isRepoTree(url)) && document.title.startsWith("File not found");
const isRepoForksList = (url = location) => getRepo(url)?.path === "network/members";
const isRepoNetworkGraph = (url = location) => getRepo(url)?.path === "network";
const isForkedRepo = () => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');
const isSingleGist = (url = location) => /^[^/]+\/[\da-f]{20,32}(\/[\da-f]{40})?$/.test(getCleanGistPathname(url));
const isGistRevision = (url = location) => /^[^/]+\/[\da-f]{20,32}\/revisions$/.test(getCleanGistPathname(url));
const isTrending = (url = location) => url.pathname === "/trending" || url.pathname.startsWith("/trending/");
const isBranches = (url = location) => Boolean(getRepo(url)?.path.startsWith("branches"));
const doesLookLikeAProfile = (string) => typeof string === "string" && string.length > 0 && !string.includes("/") && !string.includes(".") && !reservedNames.includes(string);
const isProfile = (url = location) => !isGist(url) && doesLookLikeAProfile(getCleanPathname(url));
const isGistProfile = (url = location) => doesLookLikeAProfile(getCleanGistPathname(url));
const isUserProfile = () => isProfile() && !isOrganizationProfile();
const isPrivateUserProfile = () => isUserProfile() && !exists('.UnderlineNav-item[href$="tab=stars"]');
const isUserProfileMainTab = () => isUserProfile() && !new URLSearchParams(location.search).has("tab");
const isUserProfileRepoTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "repositories";
const isUserProfileStarsTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "stars";
const isUserProfileFollowersTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "followers";
const isUserProfileFollowingTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "following";
const isProfileRepoList = (url = location) => isUserProfileRepoTab(url) || getOrg(url)?.path === "repositories";
const hasComments = (url = location) => isPR(url) || isIssue(url) || isCommit(url) || isTeamDiscussion(url) || isSingleGist(url);
const hasRichTextEditor = (url = location) => hasComments(url) || isNewIssue(url) || isCompare(url) || isRepliesSettings(url) || hasReleaseEditor(url) || isDiscussion(url) || isNewDiscussion(url);
const hasCode = (url = location) => hasComments(url) || isRepoTree(url) || isRepoSearch(url) || isGlobalSearchResults(url) || isSingleFile(url) || isGist(url) || isCompare(url) || isCompareWikiPage(url) || isBlame(url);
const hasFiles = (url = location) => isCommit(url) || isCompare(url) || isPRFiles(url);
const isMarketplaceAction = (url = location) => url.pathname.startsWith("/marketplace/actions/");
const isActionJobRun = (url = location) => Boolean(getRepo(url)?.path.startsWith("runs/"));
const isActionRun = (url = location) => /^(actions\/)?runs/.test(getRepo(url)?.path);
const isNewAction = (url = location) => getRepo(url)?.path === "actions/new";
const isRepositoryActions = (url = location) => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path);
const isUserTheOrganizationOwner = () => isOrganizationProfile() && exists('[aria-label="Organization"] [data-tab-item="org-header-settings-tab"]');
const canUserEditRepo = () => isRepo() && exists('.reponav-item[href$="/settings"], [data-tab-item$="settings-tab"]');
const isNewRepo = (url = location) => url.pathname === "/new" || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url));
const isNewRepoTemplate = (url = location) => Boolean(url.pathname.split("/")[3] === "generate");
const getUsername = () => $('meta[name="user-login"]')?.getAttribute("content");
const getCleanPathname = (url = location) => url.pathname.replaceAll(/\/+/g, "/").slice(1, url.pathname.endsWith("/") ? -1 : void 0);
const getCleanGistPathname = (url = location) => {
  const pathname = getCleanPathname(url);
  if (url.hostname.startsWith("gist.")) {
    return pathname;
  }
  const [gist, ...parts] = pathname.split("/");
  return gist === "gist" ? parts.join("/") : void 0;
};
const getOrg = (url = location) => {
  const [, orgs, name, ...path] = url.pathname.split("/");
  if (orgs === "orgs" && name) {
    return { name, path: path.join("/") };
  }
  return void 0;
};
const getRepo = (url) => {
  if (!url) {
    const canonical = $('[property="og:url"]');
    if (canonical) {
      const canonicalUrl = new URL(canonical.content, location.origin);
      if (getCleanPathname(canonicalUrl).toLowerCase() === getCleanPathname(location).toLowerCase()) {
        url = canonicalUrl;
      }
    }
  }
  if (typeof url === "string") {
    url = new URL(url, location.origin);
  }
  if (!isRepo(url)) {
    return;
  }
  const [owner, name, ...path] = getCleanPathname(url).split("/");
  return {
    owner,
    name,
    nameWithOwner: owner + "/" + name,
    path: path.join("/")
  };
};
const distribution_utils = {
  getOrg,
  getUsername,
  getCleanPathname,
  getCleanGistPathname,
  getRepositoryInfo: getRepo
};


;// CONCATENATED MODULE: ./src/index.ts





initializeStorage(() => {
    if (getStoredValue(storageKeys.TOKEN) == TOKEN_DEFAULT ||
        getStoredValue(storageKeys.REPO) == REPO_DEFAULT ||
        getStoredValue(storageKeys.USERNAME) == USERNAME_DEFAULT) {
        openStoragePanel();
    }
    else {
        organizeRepos();
        document.addEventListener("soft-nav:end", organizeRepos);
        document.addEventListener("navigation:end", organizeRepos);
    }
});
async function organizeRepos() {
    if (!isPRList())
        return;
    if (!distribution_utils.getRepositoryInfo()?.nameWithOwner == getStoredValue(storageKeys.REPO))
        return;
    const footer = document.querySelector("ul[aria-labelledby*=footer]");
    const settingsOpener = document.createElement("li");
    const settingsOpenerText = document.createElement("p");
    settingsOpenerText.innerText = "Open userscript settings";
    settingsOpener.appendChild(settingsOpenerText);
    settingsOpener.addEventListener("click", openStoragePanel);
    footer?.appendChild(settingsOpener);
    const repoInfo = await getPRInfo(getStoredValue(storageKeys.REPO), getStoredValue(storageKeys.TOKEN));
    console.log(`Remaining Github GraphQL Quota: ${repoInfo.data.rateLimit.remaining}/${repoInfo.data.rateLimit.limit}`);
    const PRListElements = document.querySelectorAll("div[id^='issue_']"); //ids starting with "issue_"
    const requireAttention = [];
    const doesntRequireAttentionYours = [];
    const doesntRequireAttention = [];
    const ignoredCIs = getStoredValue(storageKeys.IGNORED_GI).trim().split(",").map(x => x.trim()).filter(x => x != "");
    PRListElements.forEach(row => {
        const rowId = row.id.replace("issue_", "");
        const associatedPRInfo = repoInfo.data.search.nodes.find(x => x.number.toString() == rowId);
        if (!associatedPRInfo)
            return;
        const latestReviewInfo = associatedPRInfo.latestNonPendingReviews.nodes.find(x => isCurrentUser(x.author))?.state;
        const usersWithReviewRequests = associatedPRInfo.reviewRequests.nodes.map(x => x.requestedReviewer).filter(x => x != null);
        const containsOutstandingChangesRequestedReview = associatedPRInfo.latestNonPendingReviews.nodes.some(review => {
            return !usersWithReviewRequests.includes(review.author) && review.state == "CHANGES_REQUESTED";
        });
        const summary = {};
        summary.byUser = isCurrentUser(associatedPRInfo.author);
        summary.containsOutstandingChangesRequested = containsOutstandingChangesRequestedReview;
        summary.userHasGivenUpToDateReview = !!latestReviewInfo;
        summary.waitingPrimary = associatedPRInfo.assignees.nodes.some(isCurrentUser) && !latestReviewInfo;
        summary.waitingSecondary = usersWithReviewRequests.some(isCurrentUser);
        summary.upToDateReview = latestReviewInfo;
        summary.unseenByUser = associatedPRInfo.isReadByViewer;
        summary.noPrimary = associatedPRInfo.assignees.nodes.length == 0;
        summary.nonTrivialFailedCI = associatedPRInfo.commits.nodes
            .map(x => extractFailingCIFromCommitInto(x, ignoredCIs))
            .find(x => x != undefined)?.node.name;
        summary.baseBranch = {
            name: associatedPRInfo.baseRef.name,
            prNumber: associatedPRInfo.baseRef.associatedPullRequests.nodes.at(0)?.number,
            prUrl: associatedPRInfo.baseRef.associatedPullRequests.nodes.at(0)?.url,
            prName: associatedPRInfo.baseRef.associatedPullRequests.nodes.at(0)?.title
        };
        summary.isDraft = associatedPRInfo.isDraft;
        summary.requiresAttention = summary.waitingSecondary ||
            summary.waitingPrimary ||
            (summary.byUser && summary.containsOutstandingChangesRequested) ||
            (summary.byUser && summary.noPrimary) ||
            (summary.byUser && summary.nonTrivialFailedCI != undefined);
        if (!summary.byUser && summary.isDraft)
            summary.requiresAttention = false;
        if (row.children.length < 1)
            return;
        const rowContentHolder = row.children[0];
        const badgeHolder = getBadgeHolder();
        rowContentHolder.insertBefore(badgeHolder, clampedAt(rowContentHolder.children, 3));
        const href = row.querySelector("a[id^='issue_']")?.getAttribute("href") ?? "";
        if (summary.baseBranch.name != "master" && summary.baseBranch.name != "main")
            badgeHolder.appendChild(getBaseBranchAnnotation(summary));
        if (summary.byUser && summary.containsOutstandingChangesRequested)
            badgeHolder.append(getSomeoneRequestedChanges(href));
        if (summary.byUser && summary.nonTrivialFailedCI)
            badgeHolder.append(getFailedCIBadge(href, summary.nonTrivialFailedCI));
        if (summary.noPrimary)
            badgeHolder.append(getNoPrimaryBadge(href));
        if (summary.waitingPrimary)
            badgeHolder.append(getPendingPrimaryBadge(href));
        if (summary.waitingSecondary)
            badgeHolder.append(getPendingSecondaryBadge(href));
        if (summary.upToDateReview == "APPROVED")
            badgeHolder.append(getYouApprovedBadge(href));
        if (summary.upToDateReview == "CHANGES_REQUESTED")
            badgeHolder.append(getYouRequestedChanges(href));
        if (summary.byUser)
            badgeHolder.append(getByYouBadge(href));
        row.remove();
        if (summary.requiresAttention) {
            requireAttention.push(row);
        }
        else if (summary.byUser) {
            doesntRequireAttentionYours.push(row);
        }
        else {
            doesntRequireAttention.push(row);
        }
    });
    doesntRequireAttention.reverse();
    doesntRequireAttentionYours.reverse();
    requireAttention.reverse();
    const attentionDivider = document.createElement("p");
    attentionDivider.innerText = "Requires Attention";
    attentionDivider.classList.add("divider");
    const nonAttentionYoursDivider = document.createElement("p");
    nonAttentionYoursDivider.style.marginTop = "24px";
    nonAttentionYoursDivider.innerText = "Other - Yours";
    nonAttentionYoursDivider.classList.add("divider");
    const nonAttentionDivider = document.createElement("p");
    nonAttentionDivider.style.marginTop = "24px";
    nonAttentionDivider.innerText = "Other - Misc";
    nonAttentionDivider.classList.add("divider");
    const containers = document.getElementsByClassName("js-active-navigation-container");
    if (containers.length == 0)
        return;
    const PRListHolder = containers[0];
    if (requireAttention.length != 0) {
        PRListHolder.appendChild(attentionDivider);
        requireAttention.forEach(x => PRListHolder.appendChild(x));
    }
    if (doesntRequireAttentionYours.length != 0) {
        PRListHolder.appendChild(nonAttentionYoursDivider);
        doesntRequireAttentionYours.forEach(x => {
            x.classList.add("lowPriorityPR");
            PRListHolder.appendChild(x);
        });
    }
    if (doesntRequireAttention.length != 0) {
        PRListHolder.appendChild(nonAttentionDivider);
        doesntRequireAttention.forEach(x => {
            x.classList.add("lowPriorityPR");
            PRListHolder.appendChild(x);
        });
    }
}
function isCurrentUser(x) {
    return x != null && x.login == getStoredValue(storageKeys.USERNAME);
}
function clampedAt(arr, index) {
    return arr[Math.min(arr.length - 1, index)];
}
function extractFailingCIFromCommitInto(commit, substringWhitelist) {
    return commit.commit.statusCheckRollup?.contexts.edges
        .find(ci => ci.node.conclusion == "FAILURE" && !substringWhitelist.some(ciSubstring => ci.node.name?.includes(ciSubstring)));
}

})();

/******/ })()
;