// ==UserScript==
// @name         Luogu Popwindow
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  洛谷弹窗
// @author       sxl701817
// @match        https://www.luogu.com.cn/*
// @icon         https://s21.ax1x.com/2024/12/14/pAqEr9S.png
// @require      https://unpkg.com/vue@3
// @resource     sweetcss https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.14.5/sweetalert2.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.14.5/sweetalert2.min.js
// @require      data:application/javascript,unsafeWindow.Vue%3DVue%2Cthis.Vue%3DVue%3B
// @require      https://unpkg.com/element-plus
// @resource     elementcss https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.9.1/index.min.css
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520668/Luogu%20Popwindow.user.js
// @updateURL https://update.greasyfork.org/scripts/520668/Luogu%20Popwindow.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 70:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(258);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(163);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
#board[data-v-7a745d74] {
    background-color: #fff;
    position: absolute;
    top: 45px;
    padding: 10pt;
    transform: translateX(-50%);
    transition: all .2s ease-in-out 0s;
    z-index: 998244353;
    box-shadow: var(--el-box-shadow-dark);
    min-width: 20em;
    border-radius: 3px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 184:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(258);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(163);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_2_webpack_5_97_1_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
#lgb[data-v-cc8c2b6c] {
    box-shadow: 0 1.5pt 3pt #606266;
    margin-right: 5px;
    background-color: #126bae;
    padding: 3pt 12pt;
    border-radius: 6px;
    text-align: center;
    align-items: center;
    color: white;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 163:
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

/***/ 258:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 741:
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

/***/ 658:
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

/***/ 369:
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

/***/ 533:
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

/***/ 386:
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

/***/ 750:
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

/***/ 21:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
// runtime helper for setting properties on components
// in a tree-shakable way
exports.A = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
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

;// external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// ./src/listener.js
let obs = new MutationObserver((muts,obs)=>{
    muts.forEach((ele)=>{
        if($('[currenttemplate="RecordShow"] section div .info-rows:last-child div:nth-child(2) span:last-child span').text().trim() === 'Accepted') {
            swal.fire({
                icon:"info",
                title:"你通过了此题！",
                html:GM_getValue('message','')
            })
            obs.disconnect()
        }
    })
});
function startListen() {
    let dom = document.querySelector('[currenttemplate="RecordShow"] section div .info-rows:last-child div:nth-child(2) span:last-child span')
    obs.observe(dom,{characterData:true,attributes:true})
}
;// external "Vue"
const external_Vue_namespaceObject = Vue;
;// ./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/setting.vue?vue&type=script&setup=true&lang=js




/* harmony default export */ const settingvue_type_script_setup_true_lang_js = ({
  __name: 'setting',
  props: ['opacity','zIndex'],
  setup(__props) {

const text = (0,external_Vue_namespaceObject.ref)(GM_getValue('message',''))
const button = (0,external_Vue_namespaceObject.ref)('提交')
function setMessage() {
    GM_setValue('message',text.value)
    button.value = '提交成功'
    setTimeout(() => {
        button.value = '提交'
    }, 1000);
}
const props = __props

return (_ctx, _cache) => {
  const _component_el_button = (0,external_Vue_namespaceObject.resolveComponent)("el-button")
  const _component_el_input = (0,external_Vue_namespaceObject.resolveComponent)("el-input")

  return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("div", {
    id: "board",
    style: (0,external_Vue_namespaceObject.normalizeStyle)({ opacity:props.opacity,zIndex:props.zIndex })
  }, [
    (0,external_Vue_namespaceObject.createVNode)(_component_el_input, {
      modelValue: text.value,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((text).value = $event)),
      placeholder: "提示信息",
      type: "primary"
    }, {
      append: (0,external_Vue_namespaceObject.withCtx)(() => [
        (0,external_Vue_namespaceObject.createVNode)(_component_el_button, { onClick: setMessage }, {
          default: (0,external_Vue_namespaceObject.withCtx)(() => [
            (0,external_Vue_namespaceObject.createTextVNode)((0,external_Vue_namespaceObject.toDisplayString)(button.value), 1 /* TEXT */)
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modelValue"])
  ], 4 /* STYLE */))
}
}

});
;// ./src/setting.vue?vue&type=script&setup=true&lang=js
 
// EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(741);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(386);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(658);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(533);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(369);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(750);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/.pnpm/css-loader@7.1.2_webpack@5.97.1/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/setting.vue?vue&type=style&index=0&id=7a745d74&scoped=true&lang=css
var settingvue_type_style_index_0_id_7a745d74_scoped_true_lang_css = __webpack_require__(70);
;// ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/cjs.js!./node_modules/.pnpm/css-loader@7.1.2_webpack@5.97.1/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/setting.vue?vue&type=style&index=0&id=7a745d74&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(settingvue_type_style_index_0_id_7a745d74_scoped_true_lang_css/* default */.A, options);




       /* harmony default export */ const dist_ruleSet_1_rules_6_use_0_src_settingvue_type_style_index_0_id_7a745d74_scoped_true_lang_css = (settingvue_type_style_index_0_id_7a745d74_scoped_true_lang_css/* default */.A && settingvue_type_style_index_0_id_7a745d74_scoped_true_lang_css/* default */.A.locals ? settingvue_type_style_index_0_id_7a745d74_scoped_true_lang_css/* default */.A.locals : undefined);

;// ./src/setting.vue?vue&type=style&index=0&id=7a745d74&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(21);
;// ./src/setting.vue



;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.A)(settingvue_type_script_setup_true_lang_js, [['__scopeId',"data-v-7a745d74"]])

/* harmony default export */ const setting = (__exports__);
;// ./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/setting_button.vue?vue&type=script&setup=true&lang=js





/* harmony default export */ const setting_buttonvue_type_script_setup_true_lang_js = ({
  __name: 'setting_button',
  setup(__props) {

let opacity = (0,external_Vue_namespaceObject.ref)(0)
let zIndex = (0,external_Vue_namespaceObject.ref)(-998244353)
function show() {
    opacity.value = 1
    zIndex.value = 998244353
}
function hide() {
    opacity.value = 0
    zIndex.value = -998244353
}

return (_ctx, _cache) => {
  return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("span", {
    type: "primary",
    id: "lgb",
    onMouseover: show,
    onMouseout: hide
  }, [
    _cache[0] || (_cache[0] = (0,external_Vue_namespaceObject.createTextVNode)(" LGP ")),
    (0,external_Vue_namespaceObject.createVNode)(setting, {
      opacity: (0,external_Vue_namespaceObject.unref)(opacity),
      "z-index": (0,external_Vue_namespaceObject.unref)(zIndex)
    }, null, 8 /* PROPS */, ["opacity", "z-index"])
  ], 32 /* NEED_HYDRATION */))
}
}

});
;// ./src/setting_button.vue?vue&type=script&setup=true&lang=js
 
// EXTERNAL MODULE: ./node_modules/.pnpm/css-loader@7.1.2_webpack@5.97.1/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/setting_button.vue?vue&type=style&index=0&id=cc8c2b6c&scoped=true&lang=css
var setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css = __webpack_require__(184);
;// ./node_modules/.pnpm/style-loader@4.0.0_webpack@5.97.1/node_modules/style-loader/dist/cjs.js!./node_modules/.pnpm/css-loader@7.1.2_webpack@5.97.1/node_modules/css-loader/dist/cjs.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.13_webpack@5.97.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./src/setting_button.vue?vue&type=style&index=0&id=cc8c2b6c&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options = {};

setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options.styleTagTransform = (styleTagTransform_default());
setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options.setAttributes = (setAttributesWithoutAttributes_default());
setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options.insert = insertBySelector_default().bind(null, "head");
setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options.domAPI = (styleDomAPI_default());
setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options.insertStyleElement = (insertStyleElement_default());

var setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_update = injectStylesIntoStyleTag_default()(setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css/* default */.A, setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css_options);




       /* harmony default export */ const dist_ruleSet_1_rules_6_use_0_src_setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css = (setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css/* default */.A && setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css/* default */.A.locals ? setting_buttonvue_type_style_index_0_id_cc8c2b6c_scoped_true_lang_css/* default */.A.locals : undefined);

;// ./src/setting_button.vue?vue&type=style&index=0&id=cc8c2b6c&scoped=true&lang=css

;// ./src/setting_button.vue



;


const setting_button_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(setting_buttonvue_type_script_setup_true_lang_js, [['__scopeId',"data-v-cc8c2b6c"]])

/* harmony default export */ const setting_button = (setting_button_exports_);
;// external "ElementPlus"
const external_ElementPlus_namespaceObject = ElementPlus;
var external_ElementPlus_default = /*#__PURE__*/__webpack_require__.n(external_ElementPlus_namespaceObject);
;// ./src/settings.js




function makeSetting() {
    let dom = `<span id="lgb" class="icon-btn color-none"></span>`
    external_jQuery_default()('.user-nav nav').prepend(dom)
    external_jQuery_default()('.user-nav:has(> a)').prepend(dom)
    const app = (0,external_Vue_namespaceObject.createApp)(setting_button)
    app.use((external_ElementPlus_default()))
    app.mount('#lgb')
}
;// ./src/main.js



let css = GM_getResourceText('sweetcss')
GM_addStyle(css)
let main_element = GM_getResourceText('elementcss')
GM_addStyle(main_element)
external_jQuery_default()(() => {
    let oldhref = 'kkkfc0114514'
    setInterval(() => {
        if(window.location.href.search("https://www.luogu.com.cn/record/") === 0 && window.location.href !== oldhref) {
            startListen()
        }
        if(external_jQuery_default()('#lgb').length === 0) {
            makeSetting()
        }
        oldhref = window.location.href
    },200)
})
/******/ })()
;