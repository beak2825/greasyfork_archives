// ==UserScript==
// @name         【哔哩哔哩】合集杀手
// @version      0.1.0
// @description  处理自己订阅的合集。
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://space.bilibili.com/*
// @run-at       document-end
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503859/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E5%90%88%E9%9B%86%E6%9D%80%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503859/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E5%90%88%E9%9B%86%E6%9D%80%E6%89%8B.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 27:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(800);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".floating-button {\n  position: fixed;\n  left: 20px;\n  bottom: 20px;\n  padding: 10px 20px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  font-size: 16px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n  transition: background-color 0.3s ease;\n\n  &:hover {\n    background-color: #0056b3;\n  }\n}\n\n.background-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 1010;\n}\n\n.collections-window {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  width: 80%;\n\n  height: 80%;\n\n  transform: translate(-50%, -50%);\n  background-color: white;\n  padding: 20px;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);\n  z-index: 1200;\n  display: flex;\n  flex-direction: column;\n  opacity: 1;\n  transition: opacity 0.3s ease-out;\n\n  .collections-result {\n    flex-grow: 1;\n    overflow-y: auto;\n    border: 1px solid #ddd;\n    padding: 0px;\n  }\n\n  table {\n    th,\n    td,\n    thead {\n      text-align: center;\n      align-content: center;\n      font-size: 14px;\n    }\n    thead {\n      position: sticky;\n      top: 0;\n      background-color: white;\n      border-bottom: 1px solid #ddd;\n      z-index: 1;\n    }\n    tr,th {\n      border-bottom: 1px solid #ddd;\n    }\n    td {\n      padding: 4px;\n      img {\n        --size: 200px;\n        width: var(--size);\n        height: calc(var(--size) / 1.6);\n        object-fit: cover;\n        vertical-align: middle;\n      }\n    }\n  }\n\n  #paginator {\n    display: flex;\n    justify-content: center;\n    margin-top: 10px;\n    \n    span {\n      margin: 0 10px;\n      align-self: center;\n    }\n\n    button {\n      margin: 0 5px;\n      padding: 5px 10px;\n      border: none;\n      border-radius: 5px;\n      background-color: #007bff;\n      color: white;\n      cursor: pointer;\n      transition: background-color 0.3s ease;\n\n      &:hover {\n        background-color: #0056b3;\n      }\n    }\n  }\n}\n\n.delete-button {\n  color: white;\n  background-color: #f00;\n  padding: 5px 10px;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: background-color 0.3s ease; /* 添加过渡效果 */\n  display: inline-block;\n  white-space: nowrap;\n\n  &:hover {\n    background-color: #8b0000; /* 暗红色 */\n  }\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 42:
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

/***/ 800:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 986:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(372);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(627);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(979);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(970);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(984);
/* harmony import */ var _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_pnpm_style_loader_4_0_0_webpack_5_74_0_webpack_cli_5_1_4_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z && _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals ? _node_modules_pnpm_css_loader_7_1_2_webpack_5_74_0_webpack_cli_5_1_4_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"].locals */ .Z.locals : undefined);


/***/ }),

/***/ 372:
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

/***/ 627:
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

/***/ 970:
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

/***/ 979:
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

/***/ 73:
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

/***/ 984:
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

/***/ }),

/***/ 592:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uncollectCollection = exports.getCollectionPage = void 0;
const cookie_1 = __webpack_require__(883);
const fetch_1 = __webpack_require__(815);
async function getCollectionPage(index, upId) {
    const params = {
        pn: index,
        ps: 20,
        up_mid: upId,
        platform: "web",
    };
    try {
        const data = await (0, fetch_1.fetchWithParams)("https://api.bilibili.com/x/v3/fav/folder/collected/list", params);
        return data.data;
    }
    catch (error) {
        return null;
    }
}
exports.getCollectionPage = getCollectionPage;
async function uncollectCollection(collectionId) {
    try {
        const data = await fetch("https://api.bilibili.com/x/v3/fav/season/unfav", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                season_id: collectionId.toString(),
                platform: "web",
                csrf: (0, cookie_1.getCookie)("bili_jct"),
            }),
            credentials: "include",
        });
        const json = await data.json();
        console.debug(json);
        return json.code === 0;
    }
    catch (error) {
        return false;
    }
}
exports.uncollectCollection = uncollectCollection;


/***/ }),

/***/ 883:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCookie = void 0;
exports.getCookie = (function () {
    const cache = {};
    function parseAllCookies() {
        const cookies = {};
        document.cookie.split(";").forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            cookies[name] = value;
        });
        return cookies;
    }
    return function (name) {
        if (cache[name] === undefined) {
            const cookies = parseAllCookies();
            cache[name] = cookies[name] || null;
        }
        return cache[name];
    };
})();


/***/ }),

/***/ 815:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fetchWithParams = void 0;
async function fetchWithParams(baseUrl, params = {}) {
    // 创建一个 URLSearchParams 对象
    const searchParams = new URLSearchParams();
    // 将参数添加到 searchParams
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value.toString());
    }
    // 构造完整的 URL
    const url = `${baseUrl}?${searchParams.toString()}`;
    // 发送 GET 请求
    const response = await fetch(url);
    // 检查响应状态
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 解析并返回响应数据
    return await response.json();
}
exports.fetchWithParams = fetchWithParams;


/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useLogger = void 0;
const createLoggerFunction = (consoleMethod, prefix, name) => consoleMethod.bind(console, prefix, name ? `[${name}]` : "");
/**
 * 生成 Logger
 * @param name 前缀
 * @returns console.log
 */
const useLogger = (name) => {
    const prefix = "AkagiYui";
    return {
        log: createLoggerFunction(console.log, prefix, name),
        warn: createLoggerFunction(console.warn, prefix, name),
        error: createLoggerFunction(console.error, prefix, name),
        info: createLoggerFunction(console.info, prefix, name),
        debug: createLoggerFunction(console.debug, prefix, name),
        useLogger: (subName) => (0, exports.useLogger)(`${name ? name + ":" : ""}${subName}`),
    };
};
exports.useLogger = useLogger;


/***/ }),

/***/ 80:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toast = void 0;
function toast(message, duration = 3000, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
    `;
        document.body.appendChild(toastContainer);
    }
    // Create toast element
    const toast = document.createElement("div");
    toast.style.cssText = `
    background-color: #333;
    color: #fff;
    padding: 12px 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    max-width: 300px;
  `;
    // Set toast type
    switch (type) {
        case "success":
            toast.style.backgroundColor = "#4CAF50";
            break;
        case "error":
            toast.style.backgroundColor = "#F44336";
            break;
        case "warning":
            toast.style.backgroundColor = "#FFC107";
            toast.style.color = "#333";
            break;
    }
    toast.textContent = message;
    // Add toast to container
    toastContainer.appendChild(toast);
    // Trigger reflow to enable transition
    toast.offsetHeight;
    // Show toast
    toast.style.opacity = "1";
    // Hide toast after duration
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, duration);
}
exports.toast = toast;


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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
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
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const cookie_1 = __webpack_require__(883);
const logger_1 = __webpack_require__(686);
const api_1 = __webpack_require__(592);
const toast_1 = __webpack_require__(80);
__webpack_require__(986);
const { log } = (0, logger_1.useLogger)("bilibili-collection-killer");
// 创建模态框
function createModal() {
    const overlay = document.createElement("div");
    overlay.className = "background-overlay";
    document.body.appendChild(overlay);
    const modal = document.createElement("div");
    modal.className = "collections-window";
    const title = document.createElement("h2");
    title.textContent = "订阅合集列表";
    title.style.marginBottom = "10px";
    modal.appendChild(title);
    const resultDiv = document.createElement("div");
    resultDiv.id = "result";
    resultDiv.className = "collections-result";
    modal.appendChild(resultDiv);
    const paginatorDiv = document.createElement("div");
    paginatorDiv.id = "paginator";
    paginatorDiv.className = "collections-paginator";
    modal.appendChild(paginatorDiv);
    document.body.appendChild(modal);
    // 使用一个标志来跟踪模态框是否刚刚被创建
    let isJustCreated = true;
    const closeModalHandler = function (event) {
        // 如果模态框刚刚被创建，不要关闭它
        if (isJustCreated) {
            isJustCreated = false;
            return;
        }
        if (!modal.contains(event.target)) {
            modal.style.opacity = "0";
            overlay.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
                overlay.removeEventListener("click", closeModalHandler);
            }, 300);
        }
    };
    // 立即添加事件监听器
    overlay.addEventListener("click", closeModalHandler);
    // 使用 requestAnimationFrame 来重置 isJustCreated 标志
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            isJustCreated = false;
        });
    });
    log("模态框已创建");
    loadData(1);
}
function addFloatingButton() {
    const button = document.createElement("button");
    button.textContent = "合集管理";
    button.className = "floating-button";
    button.onclick = createModal;
    document.body.appendChild(button);
}
// 加载数据
async function loadData(page) {
    const mid = (0, cookie_1.getCookie)("DedeUserID");
    if (!mid) {
        log("未登录");
        return;
    }
    log("用户ID", mid);
    const { count, list } = await (0, api_1.getCollectionPage)(page, mid);
    if (!list) {
        log("合集列表为空");
        return;
    }
    renderTable(list);
    renderPaginator(count, page);
}
// 渲染表格
function renderTable(list) {
    // 列表<table>元素
    const table = document.createElement("table");
    table.id = "collections-table";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    // 表头<tr>元素
    const thead = document.createElement("thead");
    const theadTr = document.createElement("tr");
    // 表头<th>元素
    const ths = ["封面", "标题", "视频数", "创建时间", "UP主", "操作"];
    ths.forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.style.padding = "4px";
        theadTr.appendChild(th);
    });
    thead.appendChild(theadTr);
    table.appendChild(thead);
    // 表格内容<tbody>元素
    const tbody = document.createElement("tbody");
    list.forEach((collection) => {
        const tr = document.createElement("tr");
        // 封面
        const coverTd = document.createElement("td");
        const coverImg = document.createElement("img");
        coverImg.src = collection.cover;
        coverImg.alt = "封面";
        coverTd.appendChild(coverImg);
        tr.appendChild(coverTd);
        // 标题
        const titleTd = document.createElement("td");
        const a1 = document.createElement("a");
        if (collection.type === 11) {
            // 收藏夹
            a1.href = `https://space.bilibili.com/${collection.mid}/favlist?fid=${collection.id}&ftype=create`;
        }
        else if (collection.type === 21) {
            // 合集
            a1.href = `https://space.bilibili.com/${collection.mid}/channel/collectiondetail?sid=${collection.id}`;
        }
        a1.textContent = collection.title;
        a1.target = "_blank";
        titleTd.appendChild(a1);
        tr.appendChild(titleTd);
        // 视频数
        const mediaCountTd = document.createElement("td");
        mediaCountTd.textContent = collection.media_count.toString();
        tr.appendChild(mediaCountTd);
        // 创建时间
        const mtimeTd = document.createElement("td");
        mtimeTd.textContent = new Date(collection.mtime * 1000).toLocaleString();
        tr.appendChild(mtimeTd);
        // UP主
        const upTd = document.createElement("td");
        const a = document.createElement("a");
        a.href = `https://space.bilibili.com/${collection.upper.mid}`;
        a.textContent = collection.upper.name;
        a.target = "_blank";
        upTd.appendChild(a);
        tr.appendChild(upTd);
        // 操作
        const operationTd = document.createElement("td");
        const deleteButton = document.createElement("div");
        deleteButton.textContent = "取消订阅";
        deleteButton.className = "delete-button";
        deleteButton.onclick = async () => {
            log("取消订阅", collection.id);
            const ok = await (0, api_1.uncollectCollection)(collection.id);
            if (ok) {
                (0, toast_1.toast)("取消订阅成功", 3000, "success");
                // 加上删除线
                a1.style.textDecoration = "line-through";
            }
            else {
                (0, toast_1.toast)("取消订阅失败", 3000, "error");
            }
        };
        operationTd.appendChild(deleteButton);
        tr.appendChild(operationTd);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerHTML = "";
        resultDiv.appendChild(table);
    }
    log("合集列表已加载");
}
// 渲染分页器
function renderPaginator(totalCount, currentPage) {
    const pageSize = 20;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginatorDiv = document.getElementById("paginator");
    if (!paginatorDiv)
        return;
    paginatorDiv.innerHTML = "";
    const prevButton = document.createElement("button");
    prevButton.textContent = "上一页";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => loadData(currentPage - 1);
    paginatorDiv.appendChild(prevButton);
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    paginatorDiv.appendChild(pageInfo);
    const nextButton = document.createElement("button");
    nextButton.textContent = "下一页";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        loadData(currentPage + 1);
        // 滚动到顶部
        const table = document.getElementById("collections-table");
        if (table) {
            table.scrollIntoView({ behavior: "smooth" });
        }
    };
    paginatorDiv.appendChild(nextButton);
    const style = document.createElement("button");
    style.textContent = "清除失效合集";
    let cleaning = false;
    style.onclick = async () => {
        if (cleaning) {
            (0, toast_1.toast)("正在清除失效合集，请耐心等待！", 6000, "warning");
            return;
        }
        cleaning = true;
        log("清除失效合集中");
        (0, toast_1.toast)("清除失效合集中，请等待", 3000, "info");
        const needToBeRemoved = [];
        let currentPage = 1;
        let hasMore = true;
        while (hasMore) {
            (0, toast_1.toast)(`正在检查第${currentPage}页`, 3000, "info");
            const { count, list, has_more } = await (0, api_1.getCollectionPage)(currentPage, (0, cookie_1.getCookie)("DedeUserID"));
            hasMore = has_more;
            list.forEach((collection) => {
                if (collection.state === 1) {
                    (0, toast_1.toast)(`发现失效合集：${collection.id}`, 1500, "info");
                    needToBeRemoved.push(collection.id);
                }
            });
            currentPage++;
            // 防止请求过快
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (needToBeRemoved.length === 0) {
            cleaning = false;
            (0, toast_1.toast)("没有失效合集", 6000, "success");
            return;
        }
        (0, toast_1.toast)(`共发现${needToBeRemoved.length}个失效合集`, 10000, "success");
        // 逐个取消订阅，防止请求过快
        for (const id of needToBeRemoved) {
            (0, toast_1.toast)(`正在取消订阅：${id}`, 1500, "info");
            await (0, api_1.uncollectCollection)(id);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        cleaning = false;
        (0, toast_1.toast)("清除失效合集完成", 6000, "success");
    };
    paginatorDiv.appendChild(style);
}
log("脚本已加载");
// 在页面加载完成后添加悬浮按钮
if (document.readyState === "complete" || document.readyState === "interactive") {
    addFloatingButton();
}
else {
    addEventListener("DOMContentLoaded", addFloatingButton);
}

})();

/******/ })()
;