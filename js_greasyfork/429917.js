// ==UserScript==
// @name         Novel Reader
// @version      0.0.22
// @description  小说阅读器，特点是仿起点风格的网站样式，支持UU看书，笔趣阁，书趣阁，81中文网等
// @author       gausszhou@qq.com
// @namespace    gausszhou
// @license      MIT
// @grant        none
// @run-at       document-start
// @icon         https://www.gausszhou.top/favicon.ico
// @match      *://book.qidian.com/info/*

// @match      *://www.ibiquges.com/*/*/*.html
// @match      *://www.xbiqugu.net/*/*/*.html

// @match      *://www.uukanshu.com/*.html
// @match      *://www.uukanshu.net/*/*/*.html
// @match      *://tw.uukanshu.com/b/*/*.html
// @match      *://www.ddxs.com/*.html
// @match      *://www.8dushu.net/ml/*/*.html
// @match      *://www.biqule8.com/*/*.html
// @match      *://www.biqugeu.net/*/*.html
// @match      *://www.ibiquge.net/*/*.html
// @match      *://www.qbiqu.com/*/*.html
// @match      *://www.b520.cc/*/*.html

// @match      *://www.shuquge.com/txt/*/*.html
// @match      *://www.69shu.com/txt/*/*
// @match      *://www.ptwxz.com/html/*/*/*.html
// @match      *://www.bqwxg.com/wenzhang/*/*/*.html

// @match      *://www.86ebook.com/book/*/*.html
// @match      *://www.xbiquge.so/book/*/*.html
// @match      *://www.xxdingdian.com/book/*/*.html
// @match      *://www.biquge.lu/book/*/*.html
// @match      *://www.230book.net/book/*/*.html
// @match      *://www.81zw.cc/book/*/*.html
// @match      *://www.81zw.com/book/*/*.html
// @match      *://www.81zw.me/book/*/*.html
// @match      *://www.81zw.net/book/*/*.html
// @match      *://www.kehuan.net.cn/book/*/*.html

// @match      *://www.taccx.com/html/*/*.html
// @match      *://www.shushuwuxs.com/*/*.html
// @match      *://www.novel543.com/*/*.html
// @match      *://www.xindingdianxsw.com/*/*/*.html
// @match      *://www.2kxsw.com/*/*.html
// @match      *://www.tasim.net/book/*/*.html
// @match      *://www.93mc.com/book/*/*.html
// @match      *://www.lwxs.com/*/*/*.html
// @match      *://www.biquxs.com/book/*/*.html
// @match      *://www.piaotia.com/html/*/*/*.html
// @match      *://www.fqxs123.com/book/*/*.html
// @match      *://www.asxs.com/view/*/*.html

// @match      *://www.zhaoshuyuan.net/read/*/*.html
// @match      *://www.uuks.org/b/*/*.html
// @match      *://www.52wx.com/*/*.html

// @match      *://www.27k.net/read/*/*.html
// @match      *://xszj.org/b/*/c/*
// @match      *://chuangshi.qq.com/read/*/*

// @match      *://www.dxmwx.org/read/*.html
// @match      *://www.bqg5.com/*/*.html
// @match      *://www.83zws.com/book/*/*/*.html

// @downloadURL https://update.greasyfork.org/scripts/429917/Novel%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/429917/Novel%20Reader.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 24:
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

/***/ 79:
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

/***/ 90:
/***/ ((module) => {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAACVBMVEX28ef48+n69esoK7jYAAAB4UlEQVQozw2OsW4bQQxEhwLXkDrysGdEqRRgVShfQQq8wOr2jD0jSpXCLvwXbtKfADlFqgSwC/9ljqweZgYzQFnb/QGepYhA9jzmTc1WaSEtQpbFgjWATI00ZZtIckXx8q2Oe5yEByBy+RHOTcM+VVTadULsvxvRC/q8WTwgcWGD+Mnaqa0oy2gw2pKFzK+PzEsus5hP9AHojKslVynLlioVTBEN8cjDNnZoR1uMGTiZAAN47HxMtEkGUE9b8HWzkqNX5Lpk0yVziAJOs46rK1pG/xNuXLjz95fSDoJE5IqG23MAYPtWoeWPvfVtIV/Ng9oH3W0gGMPIOqd4MK4QZ55dV61gOb8Zxp7I9qayaGxp6Q91cmC0ZRdBwEQVHWzSAanlZwVWc9yljeTCeaHjBVvlPSLeyeBUT2rPdJegQI103jVS3uYkyIx1il6mslMDedZuOkwzolsagvPuQAfp7cYg7k9V1NOxfq64PNSvMdwONV4VYEmqlbpZy5OAakRKkjPnL4CBv5/OZRgoWHBmNbxB0LgB1I4vXFj93UoF2/0TPEsWwV9EhbIiTPqYoTHYoMn3enTDjmrFeDTIzaL1bUC/PBIMuF+vSSYSaxoVt90EO3Gu1zrMuMRGUk7Ffv3L+A931Gsb/yBoIgAAAABJRU5ErkJggg==";

/***/ }),

/***/ 151:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(919);
/* harmony import */ var _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(691);
/* harmony import */ var _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(975), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(90), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_pnpm_css_loader_6_11_0_webpack_5_99_9_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body{display:none}body.novel-reader-body iframe,body.novel-reader-body .weizhi,body.novel-reader-body .weizhi+div,body.novel-reader-body .at-share-btn,body.novel-reader-body .sao_mobile_box,body.novel-reader-body .addthis-animated,body.novel-reader-body .addthis-smartlayers,body.novel-reader-body .addthis-smartlayers-desktop{display:none !important}html{background:url(${___CSS_LOADER_URL_REPLACEMENT_0___}) repeat !important}body.novel-reader-body{background:url(${___CSS_LOADER_URL_REPLACEMENT_0___}) repeat !important;font-size:18px;font-family:"Microsoft YaHei",PingFangSC-Regular,HelveticaNeue-Light,"Helvetica Neue Light",sans-serif;margin:0 auto;min-width:800px;width:800px}body.novel-reader-body .novel-reader-book-mark{cursor:pointer;position:absolute;top:0px;right:48px;width:24px;height:40px;background-repeat:no-repeat;background-position:-228px -143.5px;background-size:340px;border-radius:0 0 12px 12px;text-indent:0;display:flex;justify-content:center;align-items:center;color:#fff;font-size:12px}body.novel-reader-body.left{margin:0 auto 0 1em}body.novel-reader-body.left .novel-reader-book-mark{background-color:#f56c6c}body.novel-reader-body.center{margin:0 auto}body.novel-reader-body.center .novel-reader-book-mark{background-color:#67c23a}body.novel-reader-body.right{margin:0 1em 0 auto}body.novel-reader-body.right .novel-reader-book-mark{background-color:#409eff}body.novel-reader-body .novel-reader-bread{box-sizing:border-box;padding:1em 0;display:flex;align-items:center;font:12px/22px PingFangSC-Regular,"-apple-system",Simsun}body.novel-reader-body .novel-reader-bread .novel-reader-bread-separate{color:rgba(0,0,0,.4)}body.novel-reader-body .novel-reader-bread a{margin:0 .5em !important;padding:0 !important;background-color:rgba(0,0,0,0) !important}body.novel-reader-body .novel-reader-bread a,body.novel-reader-body .novel-reader-bread b{padding:0;font-weight:400;font-size:12px;color:#1a1a1a !important}body.novel-reader-body .novel-reader-content{box-sizing:border-box;background:url(${___CSS_LOADER_URL_REPLACEMENT_1___}) repeat;padding:2em;color:#262626;font-weight:500;text-indent:2em;text-align:left;border:1px solid #d8d8d8;position:relative;line-height:1.5}body.novel-reader-body .novel-reader-content br{content:"";margin:.5em 0;display:block;font-size:150%}body.novel-reader-body .novel-reader-content p{word-wrap:wrap;word-break:break-all;margin-top:.5em;text-align:justify}body.novel-reader-body .novel-reader-content .novel-reader-content-title{display:flex;align-items:center;text-indent:0;padding:0 0 .5em;margin:0 0 .5em;font:24px/32px PingFangSC-Regular,HelveticaNeue-Light,"Helvetica Neue Light","Microsoft YaHei",sans-serif}body.novel-reader-body .novel-reader-content .novel-reader-content-title span{font-size:12px;padding:0 1em;margin:0}body.novel-reader-body .novel-reader-bottom-nav{box-sizing:border-box;background:url(${___CSS_LOADER_URL_REPLACEMENT_1___}) repeat;margin-top:1em;margin-bottom:1em;height:70px;display:flex;align-items:center;border:1px solid #d8d8d8;white-space:nowrap}body.novel-reader-body .novel-reader-bottom-nav a,body.novel-reader-body .novel-reader-bottom-nav span{flex:1;height:100%;display:flex;align-items:center;justify-content:center;text-decoration:none;color:#333 !important;font:18px/70px PingFangSC-Regular,HelveticaNeue-Light,"Helvetica Neue Light","Microsoft YaHei",sans-serif}body.novel-reader-body .novel-reader-bottom-nav span{color:#ccc !important}body.novel-reader-body .novel-reader-bottom-nav .novel-reader-bottom-separate{width:1px;height:32px;border-right:1px solid #d8d8d8}body.novel-reader-body .novel-reader-bottom-nav a:hover{background:rgba(0,0,0,.03)}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 318:
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

/***/ 342:
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

/***/ 437:
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

/***/ 691:
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ 906:
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

/***/ 919:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 935:
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

/***/ 975:
/***/ ((module) => {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAADFBMVEXr5djn4dTp49bt59rT6LKxAAACnElEQVQozw3NUUwScRzA8d8R6MF8YMIx8uk47hDSJbj14IPzOGc7jPLvwTGg5uAYDbe2tt56cLtznvEnS6yDqCcEaWi91DvrbLJZz7b1aFtz1aO+2OZWvn+/+4CHeB6BMYaqBLfjPNRY6RFT2JJYby+uAk4WUTrtlmJ4hgPYb2q1XGDQjaK8pgJHvqNaAX+KyuIkDXpgQinb46nOulnn4b5laUHTxLfseeArAoNOeJlOIjdoal0n1FA7tKFv5roK+YaHOqP3P0XyKHPHY+MhTRe5uCZnKhtJKw2eSrSoBDPLtpZuNcFNJcFyiCMxOaaHIfXz1e8HQbWLySrBQ4x0x1qlhnHlnz2HQEC6TNb0gTHXa7IKhcaHqkE015hk9whA0YeWiLIXf7Fa2CZo3DjqjB4tTuF8jIcbfcEx5z/w4sXpQhXW+ju0cqh7icTFmRMaG+v6CIvTjcSpHcH8JEsF3EPh3fRthYdVLLgI2fWXm85/pGFE4l046s70L+yKCcirGFR+jbpy3kMmiCGHrSezVONsn1RBixncyk2PcVWk7DlgxHo8iZwDyq5uAUD854dZhdIFYzKoQig2haUKi1lVufz2RZUZPZ41n/hrOQB6h0Hhg8I367FNoEHgeM/KY7szSeQwD8q2WE3HM35ZLl0K1MJiOtHIkBclRQUwZnyOWcNsRQQgVLj1PSqkjF9DsoOSaSg3iinKzvfmgsNFFfpP/2T3GLGvL4fHEfwIX1sVvXcPqLztehWGcfn9nI2U9nTfCgJPe/jFPLZwgVEzimBgAm0VIyK2tt1cE/AzQdLK+SxLSQ4aDCZnnId94OG2S1XwvnTbNk/ZnhyRCQT+sZM6z9g6LXL1BOBe+zJySiFkHAINCtnQokbCJ/apCv0foqPiZVfhpywAAAAASUVORK5CYII=";

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			524: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@3.3.4_webpack@5.99.9/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(342);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@3.3.4_webpack@5.99.9/node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(935);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@3.3.4_webpack@5.99.9/node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(437);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@3.3.4_webpack@5.99.9/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(318);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@3.3.4_webpack@5.99.9/node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(906);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@3.3.4_webpack@5.99.9/node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(79);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ../../node_modules/.pnpm/css-loader@6.11.0_webpack@5.99.9/node_modules/css-loader/dist/cjs.js!../../node_modules/.pnpm/sass-loader@12.6.0_sass@1.89.1_webpack@5.99.9/node_modules/sass-loader/dist/cjs.js!./src/assets/styles/index.scss
var styles = __webpack_require__(151);
;// ./src/assets/styles/index.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(styles/* default */.A, options);




       /* harmony default export */ const assets_styles = (styles/* default */.A && styles/* default */.A.locals ? styles/* default */.A.locals : undefined);

;// ./src/components/qidian.js
var dq = document.querySelector.bind(document);
function QiDian() {
  this.body = null;
  this.novelName = "";
  this.init();
}
QiDian.prototype.init = function () {
  console.log("[Novel Reader]", "欢迎使用小说整治插件");
};
QiDian.prototype.mounted = function () {
  this.body = document.body;
  this.qidian();
};

// 各个网站的策略
QiDian.prototype.qidian = function () {
  this.process();
};
QiDian.prototype.process = function () {
  this.processContent();
  this.processButton();
};

// 处理内容
QiDian.prototype.processContent = function () {
  this.novelName = dq(".book-info h1 em").textContent;
};

// 添加搜索
QiDian.prototype.processButton = function () {
  var button = dq(".book-info h1 em");
  var href = "https://www.google.com/search?q=" + encodeURIComponent(this.novelName);
  button.addEventListener("click", function () {
    window.open(href);
  });
};
/* harmony default export */ const components_qidian = (QiDian);
;// ./src/components/translate.js
// https://zhuanlan.zhihu.com/p/366616854

function charPYStr() {
  return "锕皑蔼碍爱嗳嫒瑷暧霭谙铵鹌肮袄奥媪骜鳌坝罢钯摆败呗颁办绊钣帮绑镑谤剥饱宝报鲍鸨龅辈贝钡狈备惫鹎贲锛绷笔毕毙币闭荜哔滗铋筚跸边编贬变辩辫苄缏笾标骠飑飙镖镳鳔鳖别瘪濒滨宾摈傧缤槟殡膑镔髌鬓饼禀拨钵铂驳饽钹鹁补钸财参蚕残惭惨灿骖黪苍舱仓沧厕侧册测恻层诧锸侪钗搀掺蝉馋谗缠铲产阐颤冁谄谶蒇忏婵骣觇禅镡场尝长偿肠厂畅伥苌怅阊鲳钞车彻砗尘陈衬伧谌榇碜龀撑称惩诚骋枨柽铖铛痴迟驰耻齿炽饬鸱冲冲虫宠铳畴踌筹绸俦帱雠橱厨锄雏础储触处刍绌蹰传钏疮闯创怆锤缍纯鹑绰辍龊辞词赐鹚聪葱囱从丛苁骢枞凑辏蹿窜撺错锉鹾达哒鞑带贷骀绐担单郸掸胆惮诞弹殚赕瘅箪当挡党荡档谠砀裆捣岛祷导盗焘灯邓镫敌涤递缔籴诋谛绨觌镝颠点垫电巅钿癫钓调铫鲷谍叠鲽钉顶锭订铤丢铥东动栋冻岽鸫窦犊独读赌镀渎椟牍笃黩锻断缎簖兑队对怼镦吨顿钝炖趸夺堕铎鹅额讹恶饿谔垩阏轭锇锷鹗颚颛鳄诶儿尔饵贰迩铒鸸鲕发罚阀珐矾钒烦贩饭访纺钫鲂飞诽废费绯镄鲱纷坟奋愤粪偾丰枫锋风疯冯缝讽凤沣肤辐抚辅赋复负讣妇缚凫驸绂绋赙麸鲋鳆钆该钙盖赅杆赶秆赣尴擀绀冈刚钢纲岗戆镐睾诰缟锆搁鸽阁铬个纥镉颍给亘赓绠鲠龚宫巩贡钩沟苟构购够诟缑觏蛊顾诂毂钴锢鸪鹄鹘剐挂鸹掴关观馆惯贯诖掼鹳鳏广犷规归龟闺轨诡贵刽匦刿妫桧鲑鳜辊滚衮绲鲧锅国过埚呙帼椁蝈铪骇韩汉阚绗颉号灏颢阂鹤贺诃阖蛎横轰鸿红黉讧荭闳鲎壶护沪户浒鹕哗华画划话骅桦铧怀坏欢环还缓换唤痪焕涣奂缳锾鲩黄谎鳇挥辉毁贿秽会烩汇讳诲绘诙荟哕浍缋珲晖荤浑诨馄阍获货祸钬镬击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫夹荚颊贾钾价驾郏浃铗镓蛲歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧谏缣戋戬睑鹣笕鲣鞯将浆蒋桨奖讲酱绛缰胶浇骄娇搅铰矫侥脚饺缴绞轿较挢峤鹪鲛阶节洁结诫届疖颌鲒紧锦仅谨进晋烬尽劲荆茎卺荩馑缙赆觐鲸惊经颈静镜径痉竞净刭泾迳弪胫靓纠厩旧阄鸠鹫驹举据锯惧剧讵屦榉飓钜锔窭龃鹃绢锩镌隽觉决绝谲珏钧军骏皲开凯剀垲忾恺铠锴龛闶钪铐颗壳课骒缂轲钶锞颔垦恳龈铿抠库裤喾块侩郐哙脍宽狯髋矿旷况诓诳邝圹纩贶亏岿窥馈溃匮蒉愦聩篑阃锟鲲扩阔蛴蜡腊莱来赖崃徕涞濑赉睐铼癞籁蓝栏拦篮阑兰澜谰揽览懒缆烂滥岚榄斓镧褴琅阆锒捞劳涝唠崂铑铹痨乐鳓镭垒类泪诔缧篱狸离鲤礼丽厉励砾历沥隶俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢俩联莲连镰怜涟帘敛脸链恋炼练蔹奁潋琏殓裢裣鲢粮凉两辆谅魉疗辽镣缭钌鹩猎临邻鳞凛赁蔺廪檩辚躏龄铃灵岭领绫棂蛏鲮馏刘浏骝绺镏鹨龙聋咙笼垄拢陇茏泷珑栊胧砻楼娄搂篓偻蒌喽嵝镂瘘耧蝼髅芦卢颅庐炉掳卤虏鲁赂禄录陆垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈峦挛孪滦乱脔娈栾鸾銮抡轮伦仑沦纶论囵萝罗逻锣箩骡骆络荦猡泺椤脶镙驴吕铝侣屡缕虑滤绿榈褛锊呒妈玛码蚂马骂吗唛嬷杩买麦卖迈脉劢瞒馒蛮满谩缦镘颡鳗猫锚铆贸麽没镁门闷们扪焖懑钔锰梦眯谜弥觅幂芈谧猕祢绵缅渑腼黾庙缈缪灭悯闽闵缗鸣铭谬谟蓦馍殁镆谋亩钼呐钠纳难挠脑恼闹铙讷馁内拟腻铌鲵撵辇鲶酿鸟茑袅聂啮镊镍陧蘖嗫颟蹑柠狞宁拧泞苎咛聍钮纽脓浓农侬哝驽钕诺傩疟欧鸥殴呕沤讴怄瓯盘蹒庞抛疱赔辔喷鹏纰罴铍骗谝骈飘缥频贫嫔苹凭评泼颇钋扑铺朴谱镤镨栖脐齐骑岂启气弃讫蕲骐绮桤碛颀颃鳍牵钎铅迁签谦钱钳潜浅谴堑佥荨悭骞缱椠钤枪呛墙蔷强抢嫱樯戗炝锖锵镪羟跄锹桥乔侨翘窍诮谯荞缲硗跷窃惬锲箧钦亲寝锓轻氢倾顷请庆揿鲭琼穷茕蛱巯赇虮鳅趋区躯驱龋诎岖阒觑鸲颧权劝诠绻辁铨却鹊确阕阙悫让饶扰绕荛娆桡热韧认纫饪轫荣绒嵘蝾缛铷颦软锐蚬闰润洒萨飒鳃赛伞毵糁丧骚扫缫涩啬铯穑杀刹纱铩鲨筛晒酾删闪陕赡缮讪姗骟钐鳝墒伤赏垧殇觞烧绍赊摄慑设厍滠畲绅审婶肾渗诜谂渖声绳胜师狮湿诗时蚀实识驶势适释饰视试谥埘莳弑轼贳铈鲥寿兽绶枢输书赎属术树竖数摅纾帅闩双谁税顺说硕烁铄丝饲厮驷缌锶鸶耸怂颂讼诵擞薮馊飕锼苏诉肃谡稣虽随绥岁谇孙损笋荪狲缩琐锁唢睃獭挞闼铊鳎台态钛鲐摊贪瘫滩坛谭谈叹昙钽锬顸汤烫傥饧铴镗涛绦讨韬铽腾誊锑题体屉缇鹈阗条粜龆鲦贴铁厅听烃铜统恸头钭秃图钍团抟颓蜕饨脱鸵驮驼椭箨鼍袜娲腽弯湾顽万纨绾网辋韦违围为潍维苇伟伪纬谓卫诿帏闱沩涠玮韪炜鲔温闻纹稳问阌瓮挝蜗涡窝卧莴龌呜钨乌诬无芜吴坞雾务误邬庑怃妩骛鹉鹜锡牺袭习铣戏细饩阋玺觋虾辖峡侠狭厦吓硖鲜纤贤衔闲显险现献县馅羡宪线苋莶藓岘猃娴鹇痫蚝籼跹厢镶乡详响项芗饷骧缃飨萧嚣销晓啸哓潇骁绡枭箫协挟携胁谐写泻谢亵撷绁缬锌衅兴陉荥凶汹锈绣馐鸺虚嘘须许叙绪续诩顼轩悬选癣绚谖铉镟学谑泶鳕勋询寻驯训讯逊埙浔鲟压鸦鸭哑亚讶垭娅桠氩阉烟盐严岩颜阎艳厌砚彦谚验厣赝俨兖谳恹闫酽魇餍鼹鸯杨扬疡阳痒养样炀瑶摇尧遥窑谣药轺鹞鳐爷页业叶靥谒邺晔烨医铱颐遗仪蚁艺亿忆义诣议谊译异绎诒呓峄饴怿驿缢轶贻钇镒镱瘗舣荫阴银饮隐铟瘾樱婴鹰应缨莹萤营荧蝇赢颖茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂哟拥佣痈踊咏镛优忧邮铀犹诱莸铕鱿舆鱼渔娱与屿语狱誉预驭伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉鸳渊辕园员圆缘远橼鸢鼋约跃钥粤悦阅钺郧匀陨运蕴酝晕韵郓芸恽愠纭韫殒氲杂灾载攒暂赞瓒趱錾赃脏驵凿枣责择则泽赜啧帻箦贼谮赠综缯轧铡闸栅诈斋债毡盏斩辗崭栈战绽谵张涨帐账胀赵诏钊蛰辙锗这谪辄鹧贞针侦诊镇阵浈缜桢轸赈祯鸩挣睁狰争帧症郑证诤峥钲铮筝织职执纸挚掷帜质滞骘栉栀轵轾贽鸷蛳絷踬踯觯钟终种肿众锺诌轴皱昼骤纣绉猪诸诛烛瞩嘱贮铸驻伫槠铢专砖转赚啭馔颞桩庄装妆壮状锥赘坠缀骓缒谆准着浊诼镯兹资渍谘缁辎赀眦锱龇鲻踪总纵偬邹诹驺鲰诅组镞钻缵躜鳟翱并卜沉丑淀迭斗范干皋硅柜后伙秸杰诀夸里凌么霉捻凄扦圣尸抬涂洼喂污锨咸蝎彝涌游吁御愿岳云灶扎札筑于志注凋讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄";
}
function ftPYStr() {
  return "錒皚藹礙愛噯嬡璦曖靄諳銨鵪骯襖奧媼驁鰲壩罷鈀擺敗唄頒辦絆鈑幫綁鎊謗剝飽寶報鮑鴇齙輩貝鋇狽備憊鵯賁錛繃筆畢斃幣閉蓽嗶潷鉍篳蹕邊編貶變辯辮芐緶籩標驃颮飆鏢鑣鰾鱉別癟瀕濱賓擯儐繽檳殯臏鑌髕鬢餅稟撥缽鉑駁餑鈸鵓補鈽財參蠶殘慚慘燦驂黲蒼艙倉滄廁側冊測惻層詫鍤儕釵攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆懺嬋驏覘禪鐔場嘗長償腸廠暢倀萇悵閶鯧鈔車徹硨塵陳襯傖諶櫬磣齔撐稱懲誠騁棖檉鋮鐺癡遲馳恥齒熾飭鴟沖衝蟲寵銃疇躊籌綢儔幬讎櫥廚鋤雛礎儲觸處芻絀躕傳釧瘡闖創愴錘綞純鶉綽輟齪辭詞賜鶿聰蔥囪從叢蓯驄樅湊輳躥竄攛錯銼鹺達噠韃帶貸駘紿擔單鄲撣膽憚誕彈殫賧癉簞當擋黨蕩檔讜碭襠搗島禱導盜燾燈鄧鐙敵滌遞締糴詆諦綈覿鏑顛點墊電巔鈿癲釣調銚鯛諜疊鰈釘頂錠訂鋌丟銩東動棟凍崠鶇竇犢獨讀賭鍍瀆櫝牘篤黷鍛斷緞籪兌隊對懟鐓噸頓鈍燉躉奪墮鐸鵝額訛惡餓諤堊閼軛鋨鍔鶚顎顓鱷誒兒爾餌貳邇鉺鴯鮞發罰閥琺礬釩煩販飯訪紡鈁魴飛誹廢費緋鐨鯡紛墳奮憤糞僨豐楓鋒風瘋馮縫諷鳳灃膚輻撫輔賦復負訃婦縛鳧駙紱紼賻麩鮒鰒釓該鈣蓋賅桿趕稈贛尷搟紺岡剛鋼綱崗戇鎬睪誥縞鋯擱鴿閣鉻個紇鎘潁給亙賡綆鯁龔宮鞏貢鉤溝茍構購夠詬緱覯蠱顧詁轂鈷錮鴣鵠鶻剮掛鴰摑關觀館慣貫詿摜鸛鰥廣獷規歸龜閨軌詭貴劊匭劌媯檜鮭鱖輥滾袞緄鯀鍋國過堝咼幗槨蟈鉿駭韓漢闞絎頡號灝顥閡鶴賀訶闔蠣橫轟鴻紅黌訌葒閎鱟壺護滬戶滸鶘嘩華畫劃話驊樺鏵懷壞歡環還緩換喚瘓煥渙奐繯鍰鯇黃謊鰉揮輝毀賄穢會燴匯諱誨繪詼薈噦澮繢琿暉葷渾諢餛閽獲貨禍鈥鑊擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽夾莢頰賈鉀價駕郟浹鋏鎵蟯殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗諫縑戔戩瞼鶼筧鰹韉將漿蔣槳獎講醬絳韁膠澆驕嬌攪鉸矯僥腳餃繳絞轎較撟嶠鷦鮫階節潔結誡屆癤頜鮚緊錦僅謹進晉燼盡勁荊莖巹藎饉縉贐覲鯨驚經頸靜鏡徑痙競凈剄涇逕弳脛靚糾廄舊鬮鳩鷲駒舉據鋸懼劇詎屨櫸颶鉅鋦窶齟鵑絹錈鐫雋覺決絕譎玨鈞軍駿皸開凱剴塏愾愷鎧鍇龕閌鈧銬顆殼課騍緙軻鈳錁頷墾懇齦鏗摳庫褲嚳塊儈鄶噲膾寬獪髖礦曠況誆誑鄺壙纊貺虧巋窺饋潰匱蕢憒聵簣閫錕鯤擴闊蠐蠟臘萊來賴崍徠淶瀨賚睞錸癩籟藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫嵐欖斕鑭襤瑯閬鋃撈勞澇嘮嶗銠鐒癆樂鰳鐳壘類淚誄縲籬貍離鯉禮麗厲勵礫歷瀝隸儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧倆聯蓮連鐮憐漣簾斂臉鏈戀煉練蘞奩瀲璉殮褳襝鰱糧涼兩輛諒魎療遼鐐繚釕鷯獵臨鄰鱗凜賃藺廩檁轔躪齡鈴靈嶺領綾欞蟶鯪餾劉瀏騮綹鎦鷚龍聾嚨籠壟攏隴蘢瀧瓏櫳朧礱樓婁摟簍僂蔞嘍嶁鏤瘺耬螻髏蘆盧顱廬爐擄鹵虜魯賂祿錄陸壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸巒攣孿灤亂臠孌欒鸞鑾掄輪倫侖淪綸論圇蘿羅邏鑼籮騾駱絡犖玀濼欏腡鏍驢呂鋁侶屢縷慮濾綠櫚褸鋝嘸媽瑪碼螞馬罵嗎嘜嬤榪買麥賣邁脈勱瞞饅蠻滿謾縵鏝顙鰻貓錨鉚貿麼沒鎂門悶們捫燜懣鍆錳夢瞇謎彌覓冪羋謐獼禰綿緬澠靦黽廟緲繆滅憫閩閔緡鳴銘謬謨驀饃歿鏌謀畝鉬吶鈉納難撓腦惱鬧鐃訥餒內擬膩鈮鯢攆輦鯰釀鳥蔦裊聶嚙鑷鎳隉蘗囁顢躡檸獰寧擰濘苧嚀聹鈕紐膿濃農儂噥駑釹諾儺瘧歐鷗毆嘔漚謳慪甌盤蹣龐拋皰賠轡噴鵬紕羆鈹騙諞駢飄縹頻貧嬪蘋憑評潑頗釙撲鋪樸譜鏷鐠棲臍齊騎豈啟氣棄訖蘄騏綺榿磧頎頏鰭牽釬鉛遷簽謙錢鉗潛淺譴塹僉蕁慳騫繾槧鈐槍嗆墻薔強搶嬙檣戧熗錆鏘鏹羥蹌鍬橋喬僑翹竅誚譙蕎繰磽蹺竊愜鍥篋欽親寢鋟輕氫傾頃請慶撳鯖瓊窮煢蛺巰賕蟣鰍趨區軀驅齲詘嶇闃覷鴝顴權勸詮綣輇銓卻鵲確闋闕愨讓饒擾繞蕘嬈橈熱韌認紉飪軔榮絨嶸蠑縟銣顰軟銳蜆閏潤灑薩颯鰓賽傘毿糝喪騷掃繅澀嗇銫穡殺剎紗鎩鯊篩曬釃刪閃陜贍繕訕姍騸釤鱔墑傷賞坰殤觴燒紹賒攝懾設厙灄畬紳審嬸腎滲詵諗瀋聲繩勝師獅濕詩時蝕實識駛勢適釋飾視試謚塒蒔弒軾貰鈰鰣壽獸綬樞輸書贖屬術樹豎數攄紓帥閂雙誰稅順說碩爍鑠絲飼廝駟緦鍶鷥聳慫頌訟誦擻藪餿颼鎪蘇訴肅謖穌雖隨綏歲誶孫損筍蓀猻縮瑣鎖嗩脧獺撻闥鉈鰨臺態鈦鮐攤貪癱灘壇譚談嘆曇鉭錟頇湯燙儻餳鐋鏜濤絳討韜鋱騰謄銻題體屜緹鵜闐條糶齠鰷貼鐵廳聽烴銅統慟頭鈄禿圖釷團摶頹蛻飩脫鴕馱駝橢籜鼉襪媧膃彎灣頑萬紈綰網輞韋違圍為濰維葦偉偽緯謂衛諉幃闈溈潿瑋韙煒鮪溫聞紋穩問閿甕撾蝸渦窩臥萵齷嗚鎢烏誣無蕪吳塢霧務誤鄔廡憮嫵騖鵡鶩錫犧襲習銑戲細餼鬩璽覡蝦轄峽俠狹廈嚇硤鮮纖賢銜閑顯險現獻縣餡羨憲線莧薟蘚峴獫嫻鷴癇蠔秈躚廂鑲鄉詳響項薌餉驤緗饗蕭囂銷曉嘯嘵瀟驍綃梟簫協挾攜脅諧寫瀉謝褻擷紲纈鋅釁興陘滎兇洶銹繡饈鵂虛噓須許敘緒續詡頊軒懸選癬絢諼鉉鏇學謔澩鱈勛詢尋馴訓訊遜塤潯鱘壓鴉鴨啞亞訝埡婭椏氬閹煙鹽嚴巖顏閻艷厭硯彥諺驗厴贗儼兗讞懨閆釅魘饜鼴鴦楊揚瘍陽癢養樣煬瑤搖堯遙窯謠藥軺鷂鰩爺頁業葉靨謁鄴曄燁醫銥頤遺儀蟻藝億憶義詣議誼譯異繹詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤蔭陰銀飲隱銦癮櫻嬰鷹應纓瑩螢營熒蠅贏穎塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌喲擁傭癰踴詠鏞優憂郵鈾猶誘蕕銪魷輿魚漁娛與嶼語獄譽預馭傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬鴛淵轅園員圓緣遠櫞鳶黿約躍鑰粵悅閱鉞鄖勻隕運蘊醞暈韻鄆蕓惲慍紜韞殞氳雜災載攢暫贊瓚趲鏨贓臟駔鑿棗責擇則澤賾嘖幘簀賊譖贈綜繒軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻譫張漲帳賬脹趙詔釗蟄轍鍺這謫輒鷓貞針偵診鎮陣湞縝楨軫賑禎鴆掙睜猙爭幀癥鄭證諍崢鉦錚箏織職執紙摯擲幟質滯騭櫛梔軹輊贄鷙螄縶躓躑觶鐘終種腫眾鍾謅軸皺晝驟紂縐豬諸誅燭矚囑貯鑄駐佇櫧銖專磚轉賺囀饌顳樁莊裝妝壯狀錐贅墜綴騅縋諄準著濁諑鐲茲資漬諮緇輜貲眥錙齜鯔蹤總縱傯鄒諏騶鯫詛組鏃鉆纘躦鱒翺並蔔沈醜澱叠鬥範幹臯矽櫃後夥稭傑訣誇裏淩麽黴撚淒扡聖屍擡塗窪餵汙鍁鹹蠍彜湧遊籲禦願嶽雲竈紮劄築於誌註雕訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇";
}
var simpStr = charPYStr();
var tradStr = ftPYStr();
var tradMapSimp = {};
Array.from({
  length: simpStr.length
}).forEach(function (no, index) {
  var tradChar = tradStr[index];
  var simpChar = simpStr[index];
  tradMapSimp[tradChar] = simpChar;
});
function simplify(cc) {
  var str = "";
  for (var i = 0; i < cc.length; i++) {
    var trad = cc[i];
    var simp = tradMapSimp[trad];
    if (simp) str += simp;else str += trad;
  }
  return str;
}
;// ./src/components/reader.js

var reader_dq = document.querySelector.bind(document);
var dqs = function dqs(selector) {
  var list = Array.from(document.querySelectorAll(selector));
  if (list.length) {
    return list;
  }
};
var CLASSNAME_BODY = "novel-reader-body";
var CLASSNAME_BREAD = "novel-reader-bread";
var CLASSNAME_BREAD_SEPARATE = "novel-reader-bread-separate";
var CLASSNAME_CONTENT = "novel-reader-content";
var CLASSNAME_TITLE = "novel-reader-content-title";
var CLASSNAME_BOOK_MARK = "novel-reader-book-mark";
var CLASSNAME_BOTTOM_NAV = "novel-reader-bottom-nav";
var CLASSNAME_BOTTOM_SEPARATE = "novel-reader-bottom-separate";
function Reader() {
  this.init();
}
Reader.prototype.init = function () {
  console.log("[Novel Reader]", "欢迎使用小说整治插件");
};
Reader.prototype.mounted = function () {
  this.body = document.body;

  // create Element
  this.$breadNew = document.createElement("div");
  this.$breadNew.className = CLASSNAME_BREAD;
  this.$contentNew = document.createElement("div");
  this.$contentNew.className = CLASSNAME_CONTENT;
  this.$titleNew = document.createElement("div");
  this.$titleNew.className = CLASSNAME_TITLE;
  this.$navNew = document.createElement("div");
  this.$navNew.className = CLASSNAME_BOTTOM_NAV;
};

// 网站策略判定 判定入口
Reader.prototype.judge = function () {
  try {
    if (reader_dq(".bread_728x90")) {
      this.kehuanNet();
      return false;
    }
    if (reader_dq(".zhengwan_top")) {
      this.uukanshu();
      return false;
    }
    if (reader_dq("#tbox")) {
      this.ddxs();
      return false;
    }
    if (reader_dq(".page_chapter")) {
      this.shuquge();
      return false;
    }
    if (reader_dq(".modbg")) {
      this.shuba();
      return false;
    }
    if (reader_dq("#content.fonts_mesne")) {
      this.ptwxz();
      return false;
    }
    if (reader_dq("#wrapper > article > div.con_top")) {
      this.zws83();
      return false;
    }
    if (reader_dq("#center_tip")) {
      this.e86book();
      return false;
    }
    if (reader_dq(".header_wap.pc_none")) {
      this.taccx();
      return false;
    }
    if (reader_dq("#chapterWarp")) {
      this.novel543();
      return false;
    }
    if (reader_dq("#htmlContent")) {
      this.mc93();
      return false;
    }
    if (reader_dq('#a_main > div.bdtop')) {
      this.asxs();
      return false;
    }
    if (reader_dq('#readSet')) {
      this.zhaoshuyuan();
      return false;
    }
    if (reader_dq('#container > div > div > div.reader-main')) {
      this.a52wx();
      return false;
    }
    if (reader_dq('.chuangshi')) {
      this.chuangshi();
      return false;
    }
    this.biquge();
  } catch (error) {
    console.error("[Novel Reader] error:", error);
  }
};

// 各个网站的策略

Reader.prototype.kehuanNet = function () {
  console.log('[Novel Reader] kehuanNet');
  this.body.classList.add("kehuan");
  this.$breadOld = reader_dq("#container .topnav h2") || document.createElement('div');
  this.$titleOld = reader_dq("#container > h1") || document.createElement('div');
  this.$contentOld = reader_dq("#container .text") || document.createElement('div');
  this.$menus = dqs(".next a");
  this.ads = [".ad_content"];
  this.process();
};
Reader.prototype.ddxs = function () {
  console.log('[Novel Reader] ddxs');
  this.body.classList.add("ddxs");
  this.$breadOld = reader_dq("#amain dl dt");
  this.$titleOld = reader_dq("#amain dl dd h1");
  this.$contentOld = reader_dq("#contents");
  this.$menus = dqs("#footlink a");
  this.ads = [".ad_content"];
  this.process();
};
Reader.prototype.uukanshu = function () {
  console.log('[Novel Reader] uukanshu');
  this.body.classList.add("uukanshu");
  this.$breadOld = reader_dq(".srcbox");
  this.$titleOld = reader_dq(".h1title #timu");
  this.$contentOld = reader_dq("#contentbox");
  this.$menus = [reader_dq(".fanye #prev"), reader_dq(".fanye #htmlmulu"), reader_dq(".fanye #next")];
  this.ads = [".ad_content"];
  this.process();
};
Reader.prototype.shuquge = function () {
  console.log('[Novel Reader] shuquge');
  this.body.classList.add("shuquge");
  this.$breadOld = reader_dq(".wrap .path .p");
  this.$titleOld = reader_dq(".content h1"); // title
  this.$contentOld = reader_dq("#content");
  this.$menus = dqs(".page_chapter li a");
  this.ads = [".header", "div.box_con > div.bookname div.lm", ".info > .link", ".footer"];
  this.process();
};
Reader.prototype.shuba = function () {
  console.log('[Novel Reader] shuba');
  this.body.classList.add("shuba");
  this.$breadOld = reader_dq(".bread");
  this.$titleOld = reader_dq("h1.hide720"); // title
  this.$contentOld = reader_dq(".txtnav");
  this.$menus = dqs(".page1 a");
  this.ads = [".hide720"];
  this.process();
};
Reader.prototype.ptwxz = function () {
  console.log('[Novel Reader] ptwxz');
  this.body.classList.add("ptwxz");
  this.$breadOld = reader_dq("#content > h1");
  this.$titleOld = reader_dq("#main #content h1"); // title
  this.$contentOld = reader_dq("#main #content");
  this.$menus = dqs(".toplink a");
  this.ads = ["#footer", ".header", "#listtj", ".box_con + script + div"];
  this.process();
};
Reader.prototype.e86book = function () {
  console.log('[Novel Reader] e86book');
  this.body.classList.add("e86book");
  this.$breadOld = reader_dq(".layout-tit");
  this.$titleOld = reader_dq(".reader-main .title"); // title
  this.$contentOld = reader_dq(".reader-main #content");
  this.$menus = dqs(".section-opt a");
  this.ads = ["#footer", ".header", "#listtj", ".box_con + script + div"];
  this.process();
};
Reader.prototype.zws83 = function () {
  console.log('[Novel Reader] zws83');
  this.body.classList.add("zws83");
  this.$breadOld = reader_dq("#wrapper > article > div.con_top");
  this.$titleOld = reader_dq("#wrapper > article > h1"); // title
  this.$contentOld = reader_dq("#content");
  this.$menus = dqs(".bottem2 a");
  this.ads = ["#footer", ".header", "#listtj", ".box_con + script + div"];
  this.process();
};
Reader.prototype.taccx = function () {
  console.log('[Novel Reader] taccx');
  this.body.classList.add("taccx");
  this.$breadOld = reader_dq("#read > div.book.reader > div.path.wap_none");
  this.$titleOld = reader_dq("#read > div.book.reader > div.content > h1"); // title
  this.$contentOld = reader_dq("#chaptercontent");
  this.$menus = [reader_dq("#pb_prev"), reader_dq("#pb_mulu"), reader_dq("#pb_next")];
  this.ads = [];
  this.process();
};
Reader.prototype.novel543 = function () {
  console.log('[Novel Reader] novel543');
  this.body.classList.add("novel543");
  this.$breadOld = reader_dq("#chapterWarp > nav > ul");
  this.$titleOld = reader_dq("#chapterWarp > div > h1"); // title
  this.$contentOld = reader_dq("#chapterWarp > div > div");
  this.$menus = dqs("#read > div > div.warp.my-3.foot-nav > a");
  this.ads = ["#read > div.novel-reader-content > .gadBlock", "#read > div.novel-reader-content > .gadBlock"];
  this.process();
};
Reader.prototype.mc93 = function () {
  console.log('[Novel Reader] mc93');
  this.body.classList.add("93mc");
  this.$breadOld = reader_dq("body > div.container.body-content.read-container > ol");
  this.$titleOld = reader_dq("#content > div.page-header.text-center > h1"); // title
  this.$contentOld = reader_dq("#htmlContent");
  this.$menus = [reader_dq("#linkPrev"), reader_dq("#linkIndex"), reader_dq("#linkNext")];
  this.ads = ["#read > div.novel-reader-content > .gadBlock", "#read > div.novel-reader-content > .gadBlock"];
  this.process();
};
Reader.prototype.asxs = function () {
  console.log('[Novel Reader] asxs');
  this.body.classList.add("asxs");
  this.$breadOld = reader_dq("#amain > dl > dt");
  this.$titleOld = reader_dq("#amain > dl > dd:nth-child(2) > h1"); // title
  this.$contentOld = reader_dq("#contents");
  this.$menus = dqs("#footlink > a");
  this.ads = [];
  this.process();
};
Reader.prototype.zhaoshuyuan = function () {
  console.log('[Novel Reader] zhaoshuyuan');
  this.body.classList.add("zhaoshuyuan");
  this.$breadOld = reader_dq("#wrapper > div.breadcrumb > div > ol") || document.createElement('div');
  this.$titleOld = reader_dq("#wrapper > div.article > div > div > div.booktitle > h1") || document.createElement('div');
  this.$contentOld = reader_dq("#chaptercontent") || document.createElement('div');
  this.$menus = [reader_dq("#prev_url"), reader_dq("#info_url"), reader_dq("#next_url")];
  this.ads = ["#footer", ".header", "#listtj", ".box_con + script + div"];
  this.process();
};
Reader.prototype.a52wx = function () {
  console.log('[Novel Reader] a52wx');
  this.body.classList.add("a52wx");
  this.$breadOld = reader_dq("#container > div > div > div.layout-tit.xs-hidden") || document.createElement('div');
  this.$titleOld = reader_dq("#container > div > div > div.reader-main > h1") || document.createElement('div');
  this.$contentOld = reader_dq("#content") || document.createElement('div');
  this.$menus = dqs("#container > div > div > div.reader-main > div.section-opt.m-bottom-opt > a");
  this.ads = ["#footer", ".header", "#listtj", ".box_con + script + div"];
  this.process();
};
Reader.prototype.chuangshi = function () {
  console.log('[Novel Reader] chuangshi');
  this.body.classList.add("chuangshi");
  this.$breadOld = document.createElement('div');
  this.$titleOld = reader_dq(".chapter-title") || document.createElement('div');
  this.$contentOld = reader_dq("#article") || document.createElement('div');
  this.$menus = dqs("#bookRead > div > div.read-pagination.page-bottom a");
  this.ads = [];
  this.process();
};

// 笔趣阁作为兜底
Reader.prototype.biquge = function () {
  console.log('[Novel Reader] biquge');
  this.body.classList.add("biquge");
  this.$breadOld = reader_dq(".con_top") || document.createElement('div');
  this.$titleOld = reader_dq(".content_read .bookname h1") || reader_dq(".content_read .zhangjieming h1") || document.createElement('div');
  this.$contentOld = reader_dq(".content_read #content") || document.createElement('div');
  this.$menus = dqs(".bottem2 a") || dqs("#content > div > a");
  this.ads = ["#footer", ".header", "#listtj", ".box_con + script + div"];
  this.process();
};

// ==============================

// 开始处理 入口
Reader.prototype.process = function () {
  if (this.$contentOld && this.$contentOld.textContent.length > 1000) {
    console.log("[Novel Reader]", "获取内容成功");
    this.processRead();
    this.body.classList.add(CLASSNAME_BODY);
  } else {
    console.log("[Novel Reader]", "未获取到内容");
  }
  this.processRemoveAD();
};

// 处理页面
Reader.prototype.processRead = function () {
  this.processReadBread();
  this.processReadContent();
  this.processReadNav();
  this.body.innerHTML = "";
  this.body.appendChild(this.$breadNew);
  this.body.appendChild(this.$contentNew);
  this.body.appendChild(this.$navNew);
  // 内容后处理
  var $pList = document.querySelectorAll(".".concat(CLASSNAME_CONTENT, " > p"));
  $pList.forEach(function (p) {
    p.innerHTML = p.innerHTML.trim();
    p.innerHTML = p.innerHTML.replace(/\s/g, "");
  });
};

// 去除广告
Reader.prototype.processRemoveAD = function () {
  if (this.ads.length) {
    console.log("[Novel Reader]", "开始去除广告");
    this.ads.forEach(function (selector) {
      var ads = dqs(selector);
      if (ads && ads.length) {
        ads.forEach(function (ad) {
          console.log("[Novel Reader] remove ad", ad);
          ad.parentElement.removeChild(ad);
        });
      }
    });
    console.log("[Novel Reader]", "成功去除广告");
  }
};

// 处理面包屑
Reader.prototype.processReadBread = function () {
  var _this = this;
  this.breadCrumbs = this.$breadOld && this.$breadOld.getElementsByTagName("a");
  if (this.breadCrumbs && this.breadCrumbs.length) {
    Array.from(this.breadCrumbs).forEach(function (item, index) {
      if (index < 3) _this.$breadNew.appendChild(item);
      if (index < 2) {
        var separate = document.createElement("span");
        separate.classList.add(CLASSNAME_BREAD_SEPARATE);
        separate.innerText = ">";
        _this.$breadNew.appendChild(separate);
      }
    });
  }
};

// 切换位置
function nextPosition(position) {
  var list = ['left', 'center', 'right'];
  var index = list.findIndex(function (item) {
    return item === position;
  });
  var nextIndex = 0;
  if (index > -1) {
    nextIndex = (index + 1) % list.length;
  }
  return list[nextIndex];
}
function getPositonLabel(position) {
  var list = ['left', 'center', 'right'];
  var index = list.findIndex(function (item) {
    return item === position;
  });
  return ['左', '中', '右'][index];
}

// 处理正文

Reader.prototype.processReadContent = function () {
  var _this$$titleOld,
    _this$$contentNew$que,
    _this$$contentNew$que2,
    _this2 = this;
  this.$titleNew.innerHTML = (_this$$titleOld = this.$titleOld) === null || _this$$titleOld === void 0 ? void 0 : _this$$titleOld.innerHTML;
  var txt = this.$titleNew.outerHTML + this.$contentOld.innerHTML;
  var txtWithAds = removeTextADS(txt);
  var txtSimplify = simplify(txtWithAds);
  this.$contentNew.innerHTML = txtSimplify;
  (_this$$contentNew$que = this.$contentNew.querySelector("h1")) === null || _this$$contentNew$que === void 0 || _this$$contentNew$que.remove();
  (_this$$contentNew$que2 = this.$contentNew.querySelector("table")) === null || _this$$contentNew$que2 === void 0 || _this$$contentNew$que2.remove();
  Array.from(this.$contentNew.querySelectorAll("a")).forEach(function (el) {
    return el.remove();
  });
  var $mark = document.createElement("div");
  var position = localStorage.getItem('novel-reader-position') || 'center';
  this.body.classList.add(position);
  $mark.innerHTML = getPositonLabel(position);
  $mark.addEventListener('click', function () {
    var position = localStorage.getItem('novel-reader-position') || 'center';
    _this2.body.classList.remove(position);
    var next = nextPosition(position);
    _this2.body.classList.add(next);
    $mark.innerHTML = getPositonLabel(next);
    localStorage.setItem('novel-reader-position', next);
  });
  $mark.classList.add(CLASSNAME_BOOK_MARK);
  this.$contentNew.appendChild($mark);
};

// 去除正文中的广告
function removeTextADS(txt) {
  var ads = [/&nbsp;/g, /https?(.+)html/g, /wa?(.+)com/g, /八一中文网(.+)com/g, /<h1>.+<h1>/g, /请记住(.+)域名：/g, "【推荐下，换源app追书真的好用，这里下载大家去快可以试试吧。】", "【认识十年的老书友给我推荐的追书app，换源app！真特么好用，开车、睡前都靠这个朗读听书打发时间，这里可以下载】", "【讲真，最近一直用换源app看书追更，换源切换，朗读音色多，安卓苹果均可。】", "【话说，目前朗读听书最好用的app，换源app，安装最新版。】"];
  ads.forEach(function (item) {
    txt = txt.replace(item, "");
  });
  return txt;
}

// 处理底部导航
Reader.prototype.processReadNav = function () {
  var _this3 = this;
  if (this.$menus && this.$menus.length) {
    this.$menus.forEach(function (nav) {
      if (nav instanceof HTMLElement) {
        _this3.$navNew.appendChild(nav);
        _this3.processReadNavSeparate();
      }
    });
  }
};

// 处理底部分割线
Reader.prototype.processReadNavSeparate = function () {
  var separate = document.createElement("div");
  separate.classList.add(CLASSNAME_BOTTOM_SEPARATE);
  this.$navNew.appendChild(separate);
};
/* harmony default export */ const components_reader = (Reader);
;// ./src/main.js



var isInit = false;
(function () {
  // window.addEventListener("DOMContentLoaded", () => {
  //   init()
  // })
  window.addEventListener("load", function () {
    init();
  });
  setTimeout(function () {
    init();
  }, 2000);
})();
function init() {
  if (isInit) return;
  isInit = true;
  if (location.hostname === "book.qidian.com") {
    var qidian = new components_qidian();
    qidian.mounted();
  } else {
    var reader = new components_reader();
    reader.mounted();
    reader.judge();
  }
  document.body.style.display = "block";
}
/******/ })()
;