// ==UserScript==
// @name        caniuse-MDN
// @description 从MDN页面直接跳转到caniuse
// @version     1.0.0
// 
// @match       *developer.mozilla.org/*
// 
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/836175
// @downloadURL https://update.greasyfork.org/scripts/435256/caniuse-MDN.user.js
// @updateURL https://update.greasyfork.org/scripts/435256/caniuse-MDN.meta.js
// ==/UserScript==

/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


        var result = __webpack_require__(2);

        if (result && result.__esModule) {
            result = result.default;
        }

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".linkBtn{cursor:pointer;display:inline-block;height:30px;margin-left:10px;width:30px}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 3 */
/***/ (function(module) {

"use strict";


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
/* 4 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

function createLink(keyword) {
    const img = __webpack_require__(5);
    const link = document.createElement('a');
    link.classList.add('linkBtn');
    link.innerHTML = `<img src="${img}"> </img>`;
    link.href = `https://caniuse.com/?search=${keyword}`;
    link.target = '_blank';
    return link;
}
module.exports = createLink;


/***/ }),
/* 5 */
/***/ (function(module) {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk4NTM0QjA3NEQ3NzExRTQ5RjJDQkZEQTMwQkRENURBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk4NTM0QjA4NEQ3NzExRTQ5RjJDQkZEQTMwQkRENURBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTg1MzRCMDU0RDc3MTFFNDlGMkNCRkRBMzBCREQ1REEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTg1MzRCMDY0RDc3MTFFNDlGMkNCRkRBMzBCREQ1REEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6jL4ZwAAABgFBMVEXRa1hI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";

/***/ })
/******/ 	]);
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
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

GM_addStyle(__webpack_require__(1));
// GM_log(GM_addStyle, require('./styles/style.scss'))
const classNameCompatibilityList = ['browser_compatibility', '浏览器兼容性'];
const createLink = __webpack_require__(4);
(function () {
    const reg = /[\u4e00-\u9fa5\(\)\:\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]/g;
    const title = document.querySelector('.main-page-content');
    const keyword = title.querySelector('h1').innerText.replace(reg, '');
    let compatibilityDom;
    for (let i = 0; i < classNameCompatibilityList.length; i++) {
        compatibilityDom = document.querySelector(`h2#${classNameCompatibilityList[i]}`);
        if (compatibilityDom) {
            break;
        }
    }
    const link = createLink(keyword);
    if (compatibilityDom) {
        compatibilityDom.append(link);
    }
    else {
        title.prepend(link);
    }
})();

}();
/******/ })()
;