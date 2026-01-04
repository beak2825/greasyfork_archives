// ==UserScript==
// @name switch520-auto-secret
// @description 优化多个游戏下载站,包括switch520、switch618、acgxj等:无跳转弹窗浏览、自动填写密码、下载按钮直达下载地址页、百度网盘自动填写密码, 去Steam查看游戏
// @version 5.3.0
// @author Kane
// @match *://www.xxxxx520.org/*
// @match *://acgxj.com/*
// @match *://*.steamzg.com/*
// @match *://*.gamers520.com/*
// @match *://*.switch618.com/*
// @match *://*.gamer520.com/*
// @match *://download.gamer520.com/*
// @match *://download.espartasr.com/*
// @match *://download.freer.blog/*
// @match *://www.freer.blog/*
// @match *://*.xxxxx528.com/*
// @match *://www.efemovies.com/*
// @match *://www.espartasr.com/*
// @match *://www.piclabo.xyz/*
// @match *://like.gamer520.com/*
// @match *://pan.baidu.com/*
// @grant GM.registerMenuCommand
// @grant GM.getValue
// @grant GM.setValue
// @icon https://www.switch618.com/wp-content/uploads/2024/05/23154031569.webp
// @license MIT
// @namespace http://tampermonkey.net/
// @require https://unpkg.com/react@18.2.0/umd/react.production.min.js
// @require https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require https://unpkg.com/mobx@6.13.5/dist/mobx.umd.production.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.13/dayjs.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/antd/5.22.7/antd.min.js
// @resource antdCSS https://cdnjs.cloudflare.com/ajax/libs/antd/5.22.7/reset.min.css
// @downloadURL https://update.greasyfork.org/scripts/475199/switch520-auto-secret.user.js
// @updateURL https://update.greasyfork.org/scripts/475199/switch520-auto-secret.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 95:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   analyzeGameNameInArticle: () => (/* binding */ analyzeGameNameInArticle),
/* harmony export */   analyzeGameNameInTitle: () => (/* binding */ analyzeGameNameInTitle),
/* harmony export */   articleContainer: () => (/* binding */ articleContainer),
/* harmony export */   getGameName: () => (/* binding */ getGameName),
/* harmony export */   nameInArticle: () => (/* binding */ nameInArticle),
/* harmony export */   nameInTitle: () => (/* binding */ nameInTitle),
/* harmony export */   titleElement: () => (/* binding */ titleElement)
/* harmony export */ });
var articleContainer = function articleContainer() {
  return document.querySelector('div.entry-content.u-text-format.u-clearfix');
};
var titleElement = function titleElement() {
  return document.querySelector('h1.entry-title');
};

/**
 * 根据标题解析出中文名和英文名
 */
var analyzeGameNameInTitle = function analyzeGameNameInTitle() {
  var _titleElement;
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_titleElement = titleElement()) === null || _titleElement === void 0 ? void 0 : _titleElement.innerText;
  var chineseGameName;
  var englishGameName;
  var _titleText = title.split(/\/|\|/)[0];

  //<Liberated: Enhanced Edition>
  if (/^[a-zA-Z0-9\s:]+/.test(_titleText)) {
    chineseGameName = null;
    englishGameName = _titleText.replaceAll(/[\u4e00-\u9fa5]/g, '').replaceAll(/^:|:$/g, '').trim();
  }

  //<商店模拟器 超市 Shop Simulator Supermarket>
  if (/^\s*[\u4e00-\u9fa5™…?《][\w\W]*[\u4e00-\u9fa5\s™…?》-](?=(\s|$))/.test(_titleText)) {
    var _titleText$match;
    chineseGameName = (_titleText$match = _titleText.match(/^\s*[\u4e00-\u9fa5™…?《-]+[\w\W]*[\u4e00-\u9fa5™…?-]+(?=\s?)/)) === null || _titleText$match === void 0 ? void 0 : _titleText$match[0];
    englishGameName = _titleText.replace(chineseGameName, '').replaceAll(/^:|:$/g, '').trim();
  }

  //<零号奴隶X Slave Zero X>
  if (/^\s*[\u4e00-\u9fa5™…?《]+[a-zA-Z0-9](\s+|\b)/.test(_titleText)) {
    var _titleText$match2;
    chineseGameName = (_titleText$match2 = _titleText.match(/\s*[\u4e00-\u9fa5《]+[a-zA-Z0-9](?=\s*)/)) === null || _titleText$match2 === void 0 ? void 0 : _titleText$match2[0];
    englishGameName = _titleText.replace(chineseGameName, '').replaceAll(/^:|:$/g, '').trim();
  }

  //<我的世界:传奇:minecraft:legends>
  if (_titleText.split(':').length - 1 > 2 && /^[\u4e00-\u9fa5]+[\w\W]*:[\w\W]*$/i.test(_titleText)) {
    var _titleText$match3;
    chineseGameName = (_titleText$match3 = _titleText.match(/^[\u4e00-\u9fa5]+:[\u4e00-\u9fa5]+/g)) === null || _titleText$match3 === void 0 ? void 0 : _titleText$match3[0];
    englishGameName = _titleText.replace(chineseGameName, '').replaceAll(/^:|:$/g, '').trim();
  }
  //<超级竞技场:Hyper Jam>
  if (/^[\u4e00-\u9fa5]+:[a-zA-Z\s]+$/.test(_titleText)) {
    var _titleText$match4;
    chineseGameName = (_titleText$match4 = _titleText.match(/^\s*[\u4e00-\u9fa5]+:?[\u4e00-\u9fa5]*(?=:)/i)) === null || _titleText$match4 === void 0 ? void 0 : _titleText$match4[0];
    englishGameName = _titleText.replace(chineseGameName, '').replaceAll(/^:|:$/g, '').trim();
  }
  var res = {
    chinese: chineseGameName,
    english: englishGameName
  };
  return res;
};

/**
 * 根据文章内容解析出游戏名
 */
var analyzeGameNameInArticle = function analyzeGameNameInArticle(rowText, el) {
  var _el$childNodes$;
  if (/《[\w\W]+》/.test(rowText)) {
    var _rowText$match;
     false && 0;
    return analyzeGameNameInTitle((_rowText$match = rowText.match(/(?<=《)[\w\W]+(?=》)/)) === null || _rowText$match === void 0 ? void 0 : _rowText$match[0]);
  } else if (/^《[\w\W]+》\s*[\u4e00-\u9fa5]+\s*[a-zA-Z]+\s*$/.test(rowText)) {
    var _rowText$match2;
     false && 0;
    return analyzeGameNameInTitle(rowText.replaceAll(/[\u4e00-\u9fa5《》][a-zA-Z0-9]+/g, '').replaceAll(/[\u4e00-\u9fa5《》]/g, ''));
  } else if (el !== null && el !== void 0 && (_el$childNodes$ = el.childNodes[0]) !== null && _el$childNodes$ !== void 0 && _el$childNodes$.textContent.startsWith('名称:')) {
    var _el$childNodes$2, _el$childNodes$3;
     false && 0;
    return analyzeGameNameInTitle((_el$childNodes$3 = el.childNodes[0]) === null || _el$childNodes$3 === void 0 ? void 0 : _el$childNodes$3.textContent.replace('名称:', '').trim());
  } else if ((el === null || el === void 0 ? void 0 : el.tagName.toLowerCase()) === 'p') {
     false && 0;
    return analyzeGameNameInTitle(rowText);
  }
  return analyzeGameNameInTitle(rowText);
};
var nameInTitle = function nameInTitle() {
  var el = titleElement();
  return analyzeGameNameInTitle(el.innerText);
};
var nameInArticle = function nameInArticle() {
  var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : articleContainer();
  return Array.from(container.querySelectorAll('*')).reduce(function (accu, el) {
    if (accu) return accu;
    if (el.innerText.includes('解压密码') || el.innerText.includes('去Steam') || !el.innerText.trim()) return null;
    return accu = analyzeGameNameInArticle(el.innerText, el);
  }, null);
};
var getGameName = function getGameName() {
  return titleElement().innerText.split('|')[0];
  var articleName = nameInArticle();
  var titleName = nameInTitle();
  return articleName.english || articleName.chinese || titleName.english || titleName.chinese;
};
if (false) {}

/***/ }),

/***/ 801:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGameName: () => (/* binding */ getGameName)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(e, r) { return new BabelRegExp(e, void 0, r); }; var e = RegExp.prototype, r = new WeakMap(); function BabelRegExp(e, t, p) { var o = RegExp(e, t); return r.set(o, p || r.get(e)), _setPrototypeOf(o, BabelRegExp.prototype); } function buildGroups(e, t) { var p = r.get(t); return Object.keys(p).reduce(function (r, t) { var o = p[t]; if ("number" == typeof o) r[t] = e[o];else { for (var i = 0; void 0 === e[o[i]] && i + 1 < o.length;) i++; r[t] = e[o[i]]; } return r; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (r) { var t = e.exec.call(this, r); if (t) { t.groups = buildGroups(t, this); var p = t.indices; p && (p.groups = buildGroups(p, this)); } return t; }, BabelRegExp.prototype[Symbol.replace] = function (t, p) { if ("string" == typeof p) { var o = r.get(this); return e[Symbol.replace].call(this, t, p.replace(/\$<([^>]+)>/g, function (e, r) { var t = o[r]; return "$" + (Array.isArray(t) ? t.join("$") : t); })); } if ("function" == typeof p) { var i = this; return e[Symbol.replace].call(this, t, function () { var e = arguments; return "object" != _typeof(e[e.length - 1]) && (e = [].slice.call(e)).push(buildGroups(e, i)), p.apply(this, e); }); } return e[Symbol.replace].call(this, t, p); }, _wrapRegExp.apply(this, arguments); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var getGameName = function getGameName() {
  var _titleText$match;
  var titleText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('.article-title').innerText;
  var _ref = ((_titleText$match = titleText.match(/*#__PURE__*/_wrapRegExp(/\u300A([\s\S]+?)\(([\s\S]+?)\)\u300B[\w\W]*/, {
      chinese: 1,
      english: 2
    }))) === null || _titleText$match === void 0 ? void 0 : _titleText$match.groups) || {},
    chinese = _ref.chinese,
    english = _ref.english;
  if (!chinese && !english) {
    english = titleText.split('|')[0];
  }
  return {
    chinese: chinese,
    english: english
  };
};
if (false) {}

/***/ }),

/***/ 763:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__(440);
// EXTERNAL MODULE: ./node_modules/reaxes-react/esm/index.js
var esm = __webpack_require__(151);
// EXTERNAL MODULE: ./node_modules/reaxes/esm/index.js + 1 modules
var reaxes_esm = __webpack_require__(52);
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(338);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./projects/switch520-auto-secret/SearchOnSelect/style.module.less
var style_module = __webpack_require__(41);
;// ./projects/switch520-auto-secret/SearchOnSelect/style.module.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(style_module/* default */.A, options);




       /* harmony default export */ const SearchOnSelect_style_module = (style_module/* default */.A && style_module/* default */.A.locals ? style_module/* default */.A.locals : undefined);

;// ./projects/switch520-auto-secret/SearchOnSelect/index.tsx
/* provided dependency */ var React = __webpack_require__(594);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var notificationKey = 'search-on-steam';
var getSelection = function getSelection() {
  return window.getSelection().toString();
};
document.addEventListener('mouseup', function (evt) {
  var _className, _className$includes;
  if ((_className = evt.target.className) !== null && _className !== void 0 && (_className$includes = _className.includes) !== null && _className$includes !== void 0 && _className$includes.call(_className, 'ant-notification')) {
    return;
  }
  var selection = getSelection();
  console.log(evt.target, getSelection());
  setState({
    selection: selection
  });
});
var _createReaxable = (0,reaxes_esm/* createReaxable */.Hp)({
    open: false,
    selection: ''
  }),
  store = _createReaxable.store,
  setState = _createReaxable.setState,
  mutate = _createReaxable.mutate;
(0,reaxes_esm/* obsReaction */.uh)(function (first) {
  if (first) return;
  var selection = store.selection;
  if (selection) {
    setState({
      open: true
    });
  } else {
    setState({
      open: false
    });
  }
}, function () {
  return [store.selection];
});
var App = (0,esm/* reaxper */.i)(function () {
  var _notification$useNoti = external_antd_.notification.useNotification(),
    _notification$useNoti2 = _slicedToArray(_notification$useNoti, 2),
    api = _notification$useNoti2[0],
    contextHolder = _notification$useNoti2[1];
  var open = store.open,
    selection = store.selection;
  if (open) {
    api.open({
      message: /*#__PURE__*/React.createElement("a", {
        style: {
          color: 'black',
          fontSize: '20px',
          display: "inline-block"
        },
        onClick: function onClick(e) {
          e.preventDefault();
          // window.open( `https://store.steampowered.com/search/?sort_by=_ASC&term=${ selection }&supportedlang=schinese%2Cenglish` );
          window.open("https://store.steampowered.com/search/?term=".concat(encodeURIComponent(selection.trim()).replace(/%20/g, '+')));
        }
      }, "Steam\u641C\u7D22\uFF1A", /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#7f7fff'
        }
      }, selection)),
      placement: 'top',
      key: notificationKey,
      duration: null,
      closable: false,
      onClose: null,
      closeIcon: null
    });
  } else {
    api.destroy(notificationKey);
  }
  return contextHolder;
});
var container = document.createElement('div');
document.body.append(container);
var reactRoot = (0,client/* createRoot */.H)(container);
reactRoot.render(/*#__PURE__*/React.createElement(App, null));






/***/ }),

/***/ 259:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.ant-modal .ant-modal-content {
  padding: 10px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 41:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.ant-notification {
  z-index: 99999;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 543:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.app {
  color: red;
}
header.header {
  z-index: 500!important;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
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

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 338:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


var m = __webpack_require__(206);
if (true) {
  exports.H = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else { var i; }


/***/ }),

/***/ 151:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ We)
/* harmony export */ });
/* unused harmony export Reaxlass */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(594);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(497);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mobx__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(206);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
var n={649:r=>{r.exports=react__WEBPACK_IMPORTED_MODULE_0__}},o={};function a(e){var r=o[e];if(void 0!==r)return r.exports;var t=o[e]={exports:{}};return n[e](t,t.exports,a),t.exports}a.d=(e,r)=>{for(var t in r)a.o(r,t)&&!a.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},a.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r);var i={};a.d(i,{W:()=>ze,i:()=>Ce});const u=(e=>{var r={};return a.d(r,e),r})({$mobx:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.$mobx,Reaction:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.Reaction,_allowStateChanges:()=>mobx__WEBPACK_IMPORTED_MODULE_1__._allowStateChanges,_allowStateReadsEnd:()=>mobx__WEBPACK_IMPORTED_MODULE_1__._allowStateReadsEnd,_allowStateReadsStart:()=>mobx__WEBPACK_IMPORTED_MODULE_1__._allowStateReadsStart,configure:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.configure,createAtom:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.createAtom,getDependencyTree:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.getDependencyTree,isObservableArray:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.isObservableArray,isObservableMap:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.isObservableMap,isObservableObject:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.isObservableObject,makeObservable:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.makeObservable,untracked:()=>mobx__WEBPACK_IMPORTED_MODULE_1__.untracked});var c=a(649);if(!c.useState)throw new Error("mobx-react-lite requires React with Hooks support");if(!u.makeObservable)throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");const f=(e=>{var r={};return a.d(r,e),r})({unstable_batchedUpdates:()=>react_dom__WEBPACK_IMPORTED_MODULE_2__.unstable_batchedUpdates});function l(e){e()}function s(e){return(0,u.getDependencyTree)(e)}var p="undefined"==typeof FinalizationRegistry?void 0:FinalizationRegistry;function y(e){return{reaction:e,mounted:!1,changedBeforeMount:!1,cleanAt:Date.now()+d}}var d=1e4;function b(e,r){var t="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=function(e,r){if(!e)return;if("string"==typeof e)return m(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return m(e,r)}(e))||r&&e&&"number"==typeof e.length){t&&(e=t);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){t=t.call(e)},n:function(){var e=t.next();return i=e.done,e},e:function(e){u=!0,a=e},f:function(){try{i||null==t.return||t.return()}finally{if(u)throw a}}}}function m(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}var v=p?function(e){var r=new Map,t=1,n=new e((function(e){var t=r.get(e);t&&(t.reaction.dispose(),r.delete(e))}));return{addReactionToTrack:function(e,o,a){var i=t++;return n.register(a,i,e),e.current=y(o),e.current.finalizationRegistryCleanupToken=i,r.set(i,e.current),e.current},recordReactionAsCommitted:function(e){n.unregister(e),e.current&&e.current.finalizationRegistryCleanupToken&&r.delete(e.current.finalizationRegistryCleanupToken)},forceCleanupTimerToRunNowForTests:function(){},resetCleanupScheduleForTests:function(){}}}(p):function(){var e,r=new Set;function t(){void 0===e&&(e=setTimeout(n,1e4))}function n(){e=void 0;var n=Date.now();r.forEach((function(e){var t=e.current;t&&n>=t.cleanAt&&(t.reaction.dispose(),e.current=null,r.delete(e))})),r.size>0&&t()}return{addReactionToTrack:function(e,n,o){var a;return e.current=y(n),a=e,r.add(a),t(),e.current},recordReactionAsCommitted:function(e){r.delete(e)},forceCleanupTimerToRunNowForTests:function(){e&&(clearTimeout(e),n())},resetCleanupScheduleForTests:function(){if(r.size>0){var t,n=b(r);try{for(n.s();!(t=n.n()).done;){var o=t.value,a=o.current;a&&(a.reaction.dispose(),o.current=null)}}catch(e){n.e(e)}finally{n.f()}r.clear()}e&&(clearTimeout(e),e=void 0)}}}(),h=v.addReactionToTrack,w=v.recordReactionAsCommitted,g=(v.resetCleanupScheduleForTests,v.forceCleanupTimerToRunNowForTests,!1);function S(){return g}var O=a(649);function j(e){return j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},j(e)}function R(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,o,a,i,u=[],c=!0,f=!1;try{if(a=(t=t.call(e)).next,0===r){if(Object(t)!==t)return;c=!1}else for(;!(c=(n=a.call(t)).done)&&(u.push(n.value),u.length!==r);c=!0);}catch(e){f=!0,o=e}finally{try{if(!c&&null!=t.return&&(i=t.return(),Object(i)!==i))return}finally{if(f)throw o}}return u}}(e,r)||function(e,r){if(!e)return;if("string"==typeof e)return T(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return T(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function T(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function x(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function(e,r){if("object"!==j(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==j(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(o,"string"),"symbol"===j(a)?a:String(a)),n)}var o,a}function P(e,r,t){return r&&x(e.prototype,r),t&&x(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function k(e){return"observer".concat(e)}var A=P((function e(){!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e)}));function E(){return new A}function _(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"observed";if(S())return e();var t=R(O.useState(E),1)[0],n=R(O.useState(),2)[1],o=function(){return n([])},a=O.useRef(null);if(!a.current)var i=new u.Reaction(k(r),(function(){c.mounted?o():c.changedBeforeMount=!0})),c=h(a,i,t);var f,l,p=a.current.reaction;if(O.useDebugValue(p,s),O.useEffect((function(){return w(a),a.current?(a.current.mounted=!0,a.current.changedBeforeMount&&(a.current.changedBeforeMount=!1,o())):(a.current={reaction:new u.Reaction(k(r),(function(){o()})),mounted:!0,changedBeforeMount:!1,cleanAt:1/0},o()),function(){a.current.reaction.dispose(),a.current=null}}),[]),p.track((function(){try{f=e()}catch(e){l=e}})),l)throw l;return f}var C="function"==typeof Symbol&&Symbol.for,$=C?Symbol.for("react.forward_ref"):"function"==typeof c.forwardRef&&(0,c.forwardRef)((function(e){return null})).$$typeof,M=C?Symbol.for("react.memo"):"function"==typeof c.memo&&(0,c.memo)((function(e){return null})).$$typeof;function U(e,r){var t;if(M&&e.$$typeof===M)throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");if(S())return e;var n=null!==(t=null==r?void 0:r.forwardRef)&&void 0!==t&&t,o=e,a=e.displayName||e.name;if($&&e.$$typeof===$&&(n=!0,"function"!=typeof(o=e.render)))throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");var i,u,f=function(e,r){return _((function(){return o(e,r)}),a)};return""!==a&&(f.displayName=a),e.contextTypes&&(f.contextTypes=e.contextTypes),n&&(f=(0,c.forwardRef)(f)),i=e,u=f=(0,c.memo)(f),Object.keys(i).forEach((function(e){N[e]||Object.defineProperty(u,e,Object.getOwnPropertyDescriptor(i,e))})),f}var N={$$typeof:!0,render:!0,compare:!0,type:!0,displayName:!0};var I=a(649);function D(e){return D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},D(e)}function B(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,o,a,i,u=[],c=!0,f=!1;try{if(a=(t=t.call(e)).next,0===r){if(Object(t)!==t)return;c=!1}else for(;!(c=(n=a.call(t)).done)&&(u.push(n.value),u.length!==r);c=!0);}catch(e){f=!0,o=e}finally{try{if(!c&&null!=t.return&&(i=t.return(),Object(i)!==i))return}finally{if(f)throw o}}return u}}(e,r)||function(e,r){if(!e)return;if("string"==typeof e)return F(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return F(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function F(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function z(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function(e,r){if("object"!==D(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==D(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(o,"string"),"symbol"===D(a)?a:String(a)),n)}var o,a}function q(e,r,t){return r&&z(e.prototype,r),t&&z(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function W(e){return"observer".concat(e)}var H=q((function e(){!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e)}));function X(){return new H}function Y(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"observed",t=arguments.length>2?arguments[2]:void 0;if(S())return e();var n=B(I.useState(X),1)[0],o=B(I.useState(),2)[1],a=function(){return t.forceUpdate()},i=I.useRef(null);if(!i.current)var c=new u.Reaction(W(r),(function(){f.mounted?(a(),o([])):f.changedBeforeMount=!0})),f=h(i,c,n);var l,p,y=i.current.reaction;if(I.useDebugValue(y,s),I.useEffect((function(){return w(i),i.current?(i.current.mounted=!0,i.current.changedBeforeMount&&(i.current.changedBeforeMount=!1,a())):(i.current={reaction:new u.Reaction(W(r),(function(){a()})),mounted:!0,changedBeforeMount:!1,cleanAt:1/0},a()),function(){i.current.reaction.dispose(),i.current=null}}),[]),y.track((function(){try{l=e()}catch(e){p=e}})),p)throw p;return l}var L="function"==typeof Symbol&&Symbol.for,V=L?Symbol.for("react.forward_ref"):"function"==typeof c.forwardRef&&(0,c.forwardRef)((function(e){return null})).$$typeof,G=L?Symbol.for("react.memo"):"function"==typeof c.memo&&(0,c.memo)((function(e){return null})).$$typeof;function J(e,r){var t;if(G&&e.$$typeof===G)throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");if(S())return e;var n=null!==(t=null==r?void 0:r.forwardRef)&&void 0!==t&&t,o=e,a=e.displayName||e.name;if(V&&e.$$typeof===V&&(n=!0,"function"!=typeof(o=e.render)))throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");var i,u,f=function(e,r){return Y((function(){return o(e,r)}),a,e.instance)};return""!==a&&(f.displayName=a),e.contextTypes&&(f.contextTypes=e.contextTypes),n&&(f=(0,c.forwardRef)(f)),i=e,u=f,Object.keys(i).forEach((function(e){Q[e]||Object.defineProperty(u,e,Object.getOwnPropertyDescriptor(i,e))})),f}var K,Q={$$typeof:!0,render:!0,compare:!0,type:!0,displayName:!0};function Z(e,r,t){return(r=function(e){var r=function(e,r){if("object"!==ee(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==ee(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(e,"string");return"symbol"===ee(r)?r:String(r)}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function ee(e){return ee="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ee(e)}(K=f.unstable_batchedUpdates)||(K=l),(0,u.configure)({reactionScheduler:K});var re=0;var te={};function ne(e){return te[e]||(te[e]=function(e){if("function"==typeof Symbol)return Symbol(e);var r="__$mobx-react ".concat(e," (").concat(re,")");return re++,r}(e)),te[e]}function oe(e,r){if(ae(e,r))return!0;if("object"!==ee(e)||null===e||"object"!==ee(r)||null===r)return!1;var t=Object.keys(e),n=Object.keys(r);if(t.length!==n.length)return!1;for(var o=0;o<t.length;o++)if(!Object.hasOwnProperty.call(r,t[o])||!ae(e[t[o]],r[t[o]]))return!1;return!0}function ae(e,r){return e===r?0!==e||1/e==1/r:e!=e&&r!=r}function ie(e,r,t){Object.hasOwnProperty.call(e,r)?e[r]=t:Object.defineProperty(e,r,{enumerable:!1,configurable:!0,writable:!0,value:t})}var ue=ne("patchMixins"),ce=ne("patchedDefinition");function fe(e,r){for(var t=this,n=arguments.length,o=new Array(n>2?n-2:0),a=2;a<n;a++)o[a-2]=arguments[a];r.locks++;try{var i;return null!=e&&(i=e.apply(this,o)),i}finally{r.locks--,0===r.locks&&r.methods.forEach((function(e){e.apply(t,o)}))}}function le(e,r){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];fe.call.apply(fe,[this,e,r].concat(n))}}function se(e,r,t){var n=function(e,r){var t=e[ue]=e[ue]||{},n=t[r]=t[r]||{};return n.locks=n.locks||0,n.methods=n.methods||[],n}(e,r);n.methods.indexOf(t)<0&&n.methods.push(t);var o=Object.getOwnPropertyDescriptor(e,r);if(!o||!o[ce]){var a=e[r],i=pe(e,r,o?o.enumerable:void 0,n,a);Object.defineProperty(e,r,i)}}function pe(e,r,t,n,o){var a,i=le(o,n);return Z(a={},ce,!0),Z(a,"get",(function(){return i})),Z(a,"set",(function(o){if(this===e)i=le(o,n);else{var a=pe(this,r,t,n,o);Object.defineProperty(this,r,a)}})),Z(a,"configurable",!0),Z(a,"enumerable",t),a}var ye=u.$mobx||"$mobx",de=ne("isMobXReactObserver"),be=ne("isUnmounted"),me=ne("skipRender"),ve=ne("isForcingUpdate");function he(e){var r=e.prototype;if(e[de]){var t=we(r);console.warn("The provided component class (".concat(t,")\n                has already been declared as an observer component."))}else e[de]=!0;if(r.componentWillReact)throw new Error("The componentWillReact life-cycle event is no longer supported");if(e.__proto__!==c.PureComponent)if(r.shouldComponentUpdate){if(r.shouldComponentUpdate!==Se)throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.")}else r.shouldComponentUpdate=Se;Oe(r,"props"),Oe(r,"state"),e.contextType&&Oe(r,"context");var n=r.render;if("function"!=typeof n){var o=we(r);throw new Error("[mobx-react] class component (".concat(o,") is missing `render` method.")+"\n`observer` requires `render` being a function defined on prototype.\n`render = () => {}` or `render = function() {}` is not supported.")}return r.render=function(){return ge.call(this,n)},se(r,"componentWillUnmount",(function(){var e;if(!0!==S()&&(null===(e=this.render[ye])||void 0===e||e.dispose(),this[be]=!0,!this.render[ye])){var r=we(this);console.warn("The reactive render of an observer class component (".concat(r,")\n                was overriden after MobX attached. This may result in a memory leak if the\n                overriden reactive render was not properly disposed."))}})),e}function we(e){return e.displayName||e.name||e.constructor&&(e.constructor.displayName||e.constructor.name)||"<component>"}function ge(e){var r=this;if(!0===S())return e.call(this);ie(this,me,!1),ie(this,ve,!1);var t=we(this),n=e.bind(this),o=!1,a=new u.Reaction("".concat(t,".render()"),(function(){if(!o&&(o=!0,!0!==r[be])){var e=!0;try{ie(r,ve,!0),r[me]||c.Component.prototype.forceUpdate.call(r),e=!1}finally{ie(r,ve,!1),e&&a.dispose()}}}));function i(){o=!1;var e=void 0,r=void 0;if(a.track((function(){try{r=(0,u._allowStateChanges)(!1,n)}catch(r){e=r}})),e)throw e;return r}return a.reactComponent=this,i[ye]=a,this.render=i,i.call(this)}function Se(e,r){return S()&&console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side."),this.state!==r||!oe(this.props,e)}function Oe(e,r){var t=ne("reactProp_".concat(r,"_valueHolder")),n=ne("reactProp_".concat(r,"_atomHolder"));function o(){return this[n]||ie(this,n,(0,u.createAtom)("reactive "+r)),this[n]}Object.defineProperty(e,r,{configurable:!0,enumerable:!0,get:function(){var e=!1;return u._allowStateReadsStart&&u._allowStateReadsEnd&&(e=(0,u._allowStateReadsStart)(!0)),o.call(this).reportObserved(),u._allowStateReadsStart&&u._allowStateReadsEnd&&(0,u._allowStateReadsEnd)(e),this[t]},set:function(e){this[ve]||oe(this[t],e)?ie(this,t,e):(ie(this,t,e),ie(this,me,!0),o.call(this).reportChanged(),ie(this,me,!1))}})}var je=a(649);je.createContext({});ne("disposeOnUnmountProto"),ne("disposeOnUnmountInst");function Re(e){return Re="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Re(e)}function Te(e){function r(r,t,n,o,a,i){for(var c=arguments.length,f=new Array(c>6?c-6:0),l=6;l<c;l++)f[l-6]=arguments[l];return(0,u.untracked)((function(){if(o=o||"<<anonymous>>",i=i||n,null==t[n]){if(r){var u=null===t[n]?"null":"undefined";return new Error("The "+a+" `"+i+"` is marked as required in `"+o+"`, but its value is `"+u+"`.")}return null}return e.apply(void 0,[t,n,o,a,i].concat(f))}))}var t=r.bind(null,!1);return t.isRequired=r.bind(null,!0),t}function xe(e){var r=Re(e);return Array.isArray(e)?"array":e instanceof RegExp?"object":function(e,r){return"symbol"===e||"Symbol"===r["@@toStringTag"]||"function"==typeof Symbol&&r instanceof Symbol}(r,e)?"symbol":r}function Pe(e,r){return Te((function(t,n,o,a,i){return(0,u.untracked)((function(){if(e&&xe(t[n])===r.toLowerCase())return null;var a;switch(r){case"Array":a=u.isObservableArray;break;case"Object":a=u.isObservableObject;break;case"Map":a=u.isObservableMap;break;default:throw new Error("Unexpected mobxType: ".concat(r))}var c=t[n];if(!a(c)){var f=function(e){var r=xe(e);if("object"===r){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return r}(c),l=e?" or javascript `"+r.toLowerCase()+"`":"";return new Error("Invalid prop `"+i+"` of type `"+f+"` supplied to `"+o+"`, expected `mobx.Observable"+r+"`"+l+".")}return null}))}))}function ke(e,r){return Te((function(t,n,o,a,i){for(var c=arguments.length,f=new Array(c>5?c-5:0),l=5;l<c;l++)f[l-5]=arguments[l];return(0,u.untracked)((function(){if("function"!=typeof r)return new Error("Property `"+i+"` of component `"+o+"` has invalid PropType notation.");var u=Pe(e,"Array")(t,n,o,a,i);if(u instanceof Error)return u;for(var c=t[n],l=0;l<c.length;l++)if((u=r.apply(void 0,[c,l,o,a,i+"["+l+"]"].concat(f)))instanceof Error)return u;return null}))}))}Pe(!1,"Array"),ke.bind(null,!1),Pe(!1,"Map"),Pe(!1,"Object"),Pe(!0,"Array"),ke.bind(null,!0),Pe(!0,"Object");var Ae=a(649);function Ee(e){var r;if(null===(r=e.prototype)||void 0===r||!r.render)return U(e);if(Object.getOwnPropertySymbols(e).find((function(e){return"isMobXReactObserver"===e.description})))return e;var t=e.prototype.render;function n(e,r){var n=e.instance;return t.call(n)}var o=e.displayName||e.name||"Component";n.displayName=o+"Hooks";var a,i=J(n);return e.prototype.render=function(){return Ae.createElement(i,{instance:this})},!0===(a=e).isMobxInjector&&console.warn("Mobx observer: You are trying to use `observer` on a component that already has `inject`. Please apply `observer` before applying `inject`"),he(a)}var _e=Symbol(""),Ce=function(e){if(e.hasOwnProperty(_e))return e;var r,t=((r=[Ee]).length,1===r.length?r[0]:r.reduce((function(e,r){return function(){return e(r.apply(void 0,arguments))}})))(e);return t[_e]=!0,t};function $e(e){return $e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},$e(e)}function Me(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,Fe(n.key),n)}}function Ue(e,r){return Ue=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e},Ue(e,r)}function Ne(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=De(e);if(r){var o=De(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return function(e,r){if(r&&("object"===$e(r)||"function"==typeof r))return r;if(void 0!==r)throw new TypeError("Derived constructors may only return object or undefined");return Ie(e)}(this,t)}}function Ie(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function De(e){return De=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},De(e)}function Be(e,r,t){return(r=Fe(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function Fe(e){var r=function(e,r){if("object"!==$e(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==$e(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(e,"string");return"symbol"===$e(r)?r:String(r)}var ze=function(){!function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),r&&Ue(e,r)}(o,c.Component);var e,r,t,n=Ne(o);function o(){var e;!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,o);for(var r=arguments.length,t=new Array(r),a=0;a<r;a++)t[a]=arguments[a];return Be(Ie(e=n.call.apply(n,[this].concat(t))),"mountedStack",[]),Be(Ie(e),"unmountStack",[]),Be(Ie(e),"updatedStack",[]),Be(Ie(e),"renderedStack",[]),e}return e=o,r&&Me(e.prototype,r),t&&Me(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}(),qe=i.W,We=i.i;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 52:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Hp: () => (/* binding */ esm_p),
  uh: () => (/* binding */ esm_m),
  WW: () => (/* binding */ esm_w)
});

// UNUSED EXPORTS: collectDeps, distinctCallback

// EXTERNAL MODULE: external "mobx"
var external_mobx_ = __webpack_require__(497);
// EXTERNAL MODULE: external "_"
var external_ = __webpack_require__(224);
var external_default = /*#__PURE__*/__webpack_require__.n(external_);
;// ./node_modules/reaxes-utils/esm/index.js
var t={d:(r,e)=>{for(var n in e)t.o(e,n)&&!t.o(r,n)&&Object.defineProperty(r,n,{enumerable:!0,get:e[n]})},o:(t,r)=>Object.prototype.hasOwnProperty.call(t,r)},r={};function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function n(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function o(t,r,n){return(r=function(t){var r=function(t,r){if("object"!==e(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,r||"default");if("object"!==e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"===e(r)?r:String(r)}(r))in t?Object.defineProperty(t,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[r]=n,t}t.d(r,{M4:()=>L,vA:()=>F,fK:()=>Y,Yu:()=>R,hl:()=>z,cc:()=>K,De:()=>G,Zp:()=>l,hT:()=>b,mA:()=>Q,G4:()=>U,xP:()=>P,bN:()=>u,IW:()=>i,a6:()=>a});var i=function(t){var r=Object.keys(t),e=r.map((function(r){return t[r]}));return Promise.all(e).then((function(e){for(var i=function(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?n(Object(e),!0).forEach((function(r){o(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):n(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}({},t),a=0,c=r;a<c.length;a++){var u=c[a];i[u]=e[u]}return i}))},a=function(t){var r,e,n=new Promise((function(n,o){r=n,e=o,"function"==typeof t&&t(n,o)}));return Object.assign(n,{resolve:r,reject:e})};function c(t){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c(t)}function u(t,r,e,n){var o=e?e.call(n,t,r):void 0;if(void 0!==o)return!!o;if(t===r)return!0;if("object"!==c(t)||!t||"object"!==c(r)||!r)return!1;var i=Object.keys(t),a=Object.keys(r);if(i.length!==a.length)return!1;for(var u=Object.prototype.hasOwnProperty.bind(r),l=0;l<i.length;l++){var f=i[l];if(!u(f))return!1;var s=t[f],y=r[f];if(!1===(o=e?e.call(n,s,y,f):void 0)||void 0===o&&s!==y)return!1}return!0}var l=function(t){var r;switch(!0){case"function"==typeof queueMicrotask:r=queueMicrotask;break;case!("function"!=typeof Promise||!Promise.resolve):r=function(t){return Promise.resolve().then(t)};break;default:r=setTimeout}r(t)};function f(t){return function(t){if(Array.isArray(t))return s(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,r){if(!t)return;if("string"==typeof t)return s(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return s(t,r)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var y=function(t){return t.replace(/([A-Z])/g,"-$1").toLowerCase()},p=function(t){for(var r=arguments.length,e=new Array(r>1?r-1:0),n=1;n<r;n++)e[n-1]=arguments[n];return e.reduce((function(t,r,e){return t[0]+="string"==typeof r?r:(t.push(r),"%o"),t}),["%c",t])},b=new Proxy((function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(){var r,e=Object.keys(t).reduce((function(r,e){return"".concat(r).concat(String(y(e)),":").concat(t[e],";")}),"");e.includes("font-weight")||(e+="font-weight:normal;");for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];(r=console).groupCollapsed.apply(r,f(p.apply(void 0,[e].concat(o)))),console.trace("%c","font-weight:normal;"),console.groupEnd()}}),{get:function(t,r,e){if(["prototype","hasOwnProperty","toString","prototype","length","name","arguments","constructor","isPrototypeOf","apply","call","bind"].includes(r))return t[r];var n=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"trace";return new Proxy((function(){for(var e,n,o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];return"trace"===t?((n=console).groupCollapsed.apply(n,f(p.apply(void 0,["color:".concat(r,";font-weight:normal;")].concat(i)))),console.trace("%c","font-weight:normal;"),void console.groupEnd()):(e=console)[t].apply(e,f(p.apply(void 0,["color:".concat(r)].concat(i))))}),{get:function(e,n,o){return function(){for(var e,o,i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];if("trace"===t)return(o=console).groupCollapsed.apply(o,f(p.apply(void 0,["color:".concat(n,";font-weight:normal;")].concat(a)))),console.trace("%c","font-weight:normal;"),void console.groupEnd();if("apply"===n){var u,l,s=a[1];return"trace"===t?((l=console).groupCollapsed.apply(l,f(p.apply(void 0,["color:".concat(r)].concat(f(s))))),console.trace("%c","font-weight:normal;"),void console.groupEnd()):(u=console)[t].apply(u,f(p.apply(void 0,["color:".concat(r)].concat(f(s)))))}return(e=console)[t].apply(e,f(p.apply(void 0,["color:".concat(n.toString())].concat(a))))}}})};return["trace","warn","log","info","error","debug","assert","clear","count","countReset","dir","dirxml","table"].includes(r)?n(r):n("trace")}});function v(t){return function(t){if(Array.isArray(t))return h(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||m(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(t,r){if(t){if("string"==typeof t)return h(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?h(t,r):void 0}}function h(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var d,g,w,S,j,O,A,P=function(t){for(var r=arguments.length,e=new Array(r>1?r-1:0),n=1;n<r;n++)e[n-1]=arguments[n];return[t].concat(v(e.map((function(r){if("function"==typeof r)return r(t)}))))},T=P({a:1,b:2},(function(t){return[t.a,"sdad"]})),k=(g=2,function(t){if(Array.isArray(t))return t}(d=T)||function(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,o,i,a,c=[],u=!0,l=!1;try{if(i=(e=e.call(t)).next,0===r){if(Object(e)!==e)return;u=!1}else for(;!(u=(n=i.call(e)).done)&&(c.push(n.value),c.length!==r);u=!0);}catch(t){l=!0,o=t}finally{try{if(!u&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(l)throw o}}return c}}(d,g)||m(d,g)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}());k[0],k[1];function E(t){return E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},E(t)}function x(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,I(n.key),n)}}function I(t){var r=function(t,r){if("object"!==E(t)||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,r||"default");if("object"!==E(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"===E(r)?r:String(r)}function M(t,r,e){!function(t,r){if(r.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}(t,r),r.set(t,e)}function C(t,r){return function(t,r){if(r.get)return r.get.call(t);return r.value}(t,D(t,r,"get"))}function W(t,r,e){return function(t,r,e){if(r.set)r.set.call(t,e);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=e}}(t,D(t,r,"set"),e),e}function D(t,r,e){if(!r.has(t))throw new TypeError("attempted to "+e+" private field on non-instance");return r.get(t)}var L=(w=new WeakMap,S=new WeakMap,j=new WeakMap,O=new WeakMap,A=new WeakMap,function(){function t(){var r=this;!function(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}(this,t),M(this,w,{writable:!0,value:[]}),M(this,S,{writable:!0,value:0}),M(this,j,{writable:!0,value:void 0}),M(this,O,{writable:!0,value:void 0}),M(this,A,{writable:!0,value:!1}),function(t,r,e){(r=I(r))in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e}(this,"start",(function(t){return t<=0?console.error("timer.start值是负数! :>",t):!0!==C(r,A)?(W(r,S,t),C(r,j).call(r),r):void 0}));W(this,j,(function t(){W(r,A,!0),C(r,S)>=1e3?W(r,O,setTimeout((function(){W(r,S,C(r,S)-1e3),t(),C(r,w).forEach((function(t){try{t(C(r,S))}catch(r){console.error(r,"Timer 订阅运行时错误: 当前执行函数名>".concat(t.name))}}))}),1e3)):(W(r,O,setTimeout((function(){W(r,S,0),C(r,w).forEach((function(t){try{t(C(r,S))}catch(r){console.error(r,"Timer 订阅运行时错误: 当前执行函数名>".concat(t.name))}}))}),C(r,S))),W(r,A,!1)),C(r,w).forEach((function(t){try{t(C(r,S))}catch(r){console.error(r,"Timer 订阅运行时错误: 当前执行函数名>".concat(t.name))}}))}))}var r,e,n;return r=t,(e=[{key:"subscribe",value:function(t){return!C(this,w).includes(t)&&C(this,w).push(t),this}},{key:"unsubscribe",value:function(t){return C(this,w).splice(C(this,w).indexOf(t),1),this}},{key:"destroy",value:function(){}},{key:"stop",value:function(){return clearTimeout(C(this,O)),W(this,S,0),W(this,A,!1),this}}])&&x(r.prototype,e),n&&x(r,n),Object.defineProperty(r,"prototype",{writable:!1}),t}());function N(t){return N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},N(t)}function $(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,o,i,a,c=[],u=!0,l=!1;try{if(i=(e=e.call(t)).next,0===r){if(Object(e)!==e)return;u=!1}else for(;!(u=(n=i.call(e)).done)&&(c.push(n.value),c.length!==r);u=!0);}catch(t){l=!0,o=t}finally{try{if(!u&&null!=e.return&&(a=e.return(),Object(a)!==a))return}finally{if(l)throw o}}return c}}(t,r)||function(t,r){if(!t)return;if("string"==typeof t)return q(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return q(t,r)}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function q(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var Q=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:location.href;try{if(t.includes("?")){var r=$(t.split("?"),2);t=r[1]}if(t.includes("/")){var e=$(t.split("/"),1);t=e[0]}if(!t.includes("="))return{};if(t.includes("&"))return t.split("&").reduce((function(t,r){var e=$(r.split("="),2),n=e[0],o=e[1];return t[n]=o,t}),{});var n={},o=$(t.split("="),2),i=o[0],a=o[1];return n[i]=a,n}catch(r){throw console.error("decodeQueryString -> 转换失败 , 原始字符串为 : ".concat(t)),console.error(r),""}},U=function(t){var r="";for(var e in t){var n=t[e];if("object"===N(n)&&null!==n)throw"暂不支持嵌套对象";if("symbol"===N(e))throw"不支持key为Symbol";r="".concat(r).concat(r&&"&").concat(e,"=").concat(n)}return r},Z=function(t){return"string"==typeof t?'"'.concat(t,'"'):t},F=function(t,r){for(var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=0;n<r.length;n++){var o=r[n];if(o!==t)return e&&b.coral("断言组第 ",n," 个表达式不符合预期为 ",Z(t)," 的结果, expressionList[",n,"]: ",Z(o)),!1}return!0},G=function(t){return F(!0,t,arguments.length>1&&void 0!==arguments[1]&&arguments[1])},K=function(t){return F(!1,t,arguments.length>1&&void 0!==arguments[1]&&arguments[1])},Y=function(t,r){for(var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=0;n<r.length;n++){var o=r[n];if(o===t)return e&&b["#81cc00"]("断言组第 ",n," 个表达式符合预期为 ",Z(t)," 的结果, expressionList[",n,"]: ",Z(o)),!0}return e&&b.coral("断言组每个值都不符合预期为 ",Z(t)," 的结果, expressionList: ",Z(r)),!1},z=function(t){return Y(!0,t,arguments.length>1&&void 0!==arguments[1]&&arguments[1])},R=function(t){return Y(!1,t,arguments.length>1&&void 0!==arguments[1]&&arguments[1])},B=r.M4,H=r.vA,J=r.fK,V=r.Yu,X=r.hl,_=r.cc,tt=r.De,rt=r.Zp,et=r.hT,nt=r.mA,ot=r.G4,it=r.xP,at=r.bN,ct=r.IW,ut=r.a6;
//# sourceMappingURL=index.js.map
;// ./node_modules/reaxes/esm/index.js
var esm_n={d:(e,t)=>{for(var r in t)esm_n.o(t,r)&&!esm_n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},esm_o={};esm_n.d(esm_o,{pt:()=>esm_d,Hp:()=>esm_i,MM:()=>esm_l,uh:()=>esm_f,WW:()=>esm_c});const esm_a=(e=>{var t={};return esm_n.d(t,e),t})({action:()=>external_mobx_.action,observable:()=>external_mobx_.observable,reaction:()=>external_mobx_.reaction});const esm_u=(e=>{var t={};return esm_n.d(t,e),t})({default:()=>(external_default())});var esm_i=function(e){var t=(0,esm_a.observable)(e),r=(0,esm_a.action)((function(e,t){for(var r=0,n=Object.keys(t);r<n.length;r++){var o=n[r];e.hasOwnProperty(o)&&(e[o]=t[o])}return e})),n=(0,esm_a.action)((function(e,t){return esm_u.default.merge(e,t)}));return{store:t,mutate:function(e){return(0,esm_a.action)((function(){return e(t)}))(),t},setState:function(e){return r(t,e)},mergeState:function(e){return n(t,e)}}},esm_c=function(e){return e()};const esm_s=(e=>{var t={};return esm_n.d(t,e),t})({shallowEqual:()=>at,xPromise:()=>ut});function esm_f(e,t){var r=esm_s.xPromise(),n=function(){return r.then((function(e){return e()}))};return function(e){var t,r,n;t="undefined"!=typeof window?null!==(r=null!==(n=window.queueMicrotask)&&void 0!==n?n:window.Promise&&window.Promise.resolve().then)&&void 0!==r?r:function(e){return window.setTimeout(e,0)}:"undefined"!=typeof process&&process.nextTick?process.nextTick:function(e){return setTimeout(e,0)};t(e)}((function(){var o=t(),u=(0,esm_a.reaction)(t,(function(t,r){!esm_s.shallowEqual(t,o)&&(e(!1,n),o=t)}));e(!0,n),r.resolve(u)})),n}function esm_l(e,t){var r=t();return Object.assign((function(t){var n=t();return function(){if(!esm_s.shallowEqual(r,n))return e.apply(void 0,arguments)}}),{resetDeps:function(){r=t()}})}function esm_d(e,t){if(!esm_u.default.isObject(e))throw"the store argument must be a Mobx observed object";t&&esm_u.default.isArray(t)&&t.length?t.forEach((function(t){return e[t]})):Object.getOwnPropertyNames(e).forEach((function(t){return e[t]}))}var esm_v=esm_o.pt,esm_p=esm_o.Hp,esm_b=esm_o.MM,esm_m=esm_o.uh,esm_w=esm_o.WW;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 72:
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

/***/ 659:
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

/***/ 540:
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

/***/ 56:
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

/***/ 825:
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

/***/ 113:
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

/***/ 594:
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ 206:
/***/ ((module) => {

module.exports = ReactDOM;

/***/ }),

/***/ 224:
/***/ ((module) => {

module.exports = _;

/***/ }),

/***/ 440:
/***/ ((module) => {

module.exports = antd;

/***/ }),

/***/ 497:
/***/ ((module) => {

module.exports = mobx;

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

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./projects/switch520-auto-secret/Components/OpenInModal/antd.override.less
var antd_override = __webpack_require__(259);
;// ./projects/switch520-auto-secret/Components/OpenInModal/antd.override.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(antd_override/* default */.A, options);




       /* harmony default export */ const OpenInModal_antd_override = (antd_override/* default */.A && antd_override/* default */.A.locals ? antd_override/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/reaxes-react/esm/index.js
var esm = __webpack_require__(151);
// EXTERNAL MODULE: ./node_modules/reaxes/esm/index.js + 1 modules
var reaxes_esm = __webpack_require__(52);
// EXTERNAL MODULE: external "_"
var external_ = __webpack_require__(224);
var external_default = /*#__PURE__*/__webpack_require__.n(external_);
;// ./generic-services/utils/useMatchDomain/index.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 如果匹配到域名则会执行回调
 */

var useMatchDomain = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(matcher, callback) {
    var _matcher$regExp, _matcher$hosts, _matcher$includes;
    var matchResult;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          matchResult = false;
          _context.t0 = true;
          _context.next = _context.t0 === ((_matcher$regExp = matcher.regExp) === null || _matcher$regExp === void 0 ? void 0 : _matcher$regExp.test(location.href)) ? 4 : _context.t0 === ((_matcher$hosts = matcher.hosts) === null || _matcher$hosts === void 0 ? void 0 : _matcher$hosts.some(function (host) {
            return location.host === host;
          })) ? 4 : _context.t0 === ((_matcher$includes = matcher.includes) === null || _matcher$includes === void 0 ? void 0 : _matcher$includes.some(function (kw) {
            if (external_default().isString(kw)) {
              return location.href.includes(kw);
            } else {
              return kw.every(function (txt) {
                return location.href.includes(txt);
              });
            }
          })) ? 4 : 6;
          break;
        case 4:
          matchResult = true;
          return _context.abrupt("break", 6);
        case 6:
          if (!matchResult) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", callback());
        case 10:
          return _context.abrupt("return", null);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function useMatchDomain(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * regExp,hosts,includes取并集,protocol为约束性规则,与上述规则结果取交集
 * 需要注意的是includes规则:第一层的所有规则取并集,如果第一层的某个成员是数组,则数组内的规则取交集,href必须包含该内层数组中的所有字符
 * 比如includes:['switch520',['switch','618']]这个规则代表href要么包含'switch520',要么既包含'switch'也同时包含'618'
 */


;// ./projects/switch520-auto-secret/Components/OpenInModal/reaxel.ts
function reaxel_typeof(o) { "@babel/helpers - typeof"; return reaxel_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, reaxel_typeof(o); }
function reaxel_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ reaxel_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == reaxel_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(reaxel_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function reaxel_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function reaxel_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { reaxel_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { reaxel_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var reaxel_OpenInModal = (0,reaxes_esm/* reaxel */.WW)(function () {
  var _createReaxable = (0,reaxes_esm/* createReaxable */.Hp)({
      modalOpened: false,
      iframeURL: null
    }),
    store = _createReaxable.store,
    setState = _createReaxable.setState;
  useMatchDomain({
    includes: ['gamer520']
  }, function () {
    if (!location.href.endsWith('.html')) {
      var containerEl = document.querySelector('.posts-wrapper');
      containerEl === null || containerEl === void 0 || containerEl.addEventListener('click', /*#__PURE__*/function () {
        var _ref = reaxel_asyncToGenerator(/*#__PURE__*/reaxel_regeneratorRuntime().mark(function _callee(e) {
          var cardEl, _cardEl$querySelector, href;
          return reaxel_regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return GM.getValue('options::modal-mode', true);
              case 2:
                if (_context.sent) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return");
              case 4:
                e.preventDefault();
                e.stopPropagation();
                console.log('bbbbbbbbbbbbb', e.composedPath());
                cardEl = e.composedPath().find(function (p) {
                  return _toConsumableArray(containerEl.children).includes(p);
                });
                if (cardEl) {
                  _cardEl$querySelector = cardEl.querySelector('a'), href = _cardEl$querySelector.href;
                  setState({
                    iframeURL: href,
                    modalOpened: true
                  });
                }
              case 9:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  });
  useMatchDomain({
    includes: ['xxxxx520']
  }, function () {
    if (!location.href.endsWith('.html')) {
      var containerEl = document.querySelector('.row.posts-wrapper.scroll');
      containerEl === null || containerEl === void 0 || containerEl.addEventListener('click', /*#__PURE__*/function () {
        var _ref2 = reaxel_asyncToGenerator(/*#__PURE__*/reaxel_regeneratorRuntime().mark(function _callee2(e) {
          var cardEl, _cardEl$querySelector2, href;
          return reaxel_regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return GM.getValue('options::modal-mode', true);
              case 2:
                if (_context2.sent) {
                  _context2.next = 4;
                  break;
                }
                return _context2.abrupt("return");
              case 4:
                e.preventDefault();
                e.stopPropagation();
                console.log('bbbbbbbbbbbbb', e.composedPath());
                cardEl = e.composedPath().find(function (p) {
                  return _toConsumableArray(containerEl.children).includes(p);
                });
                if (cardEl) {
                  _cardEl$querySelector2 = cardEl.querySelector('a'), href = _cardEl$querySelector2.href;
                  setState({
                    iframeURL: href,
                    modalOpened: true
                  });
                }
              case 9:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  });
  useMatchDomain({
    includes: ['switch618']
  }, function () {
    if (!location.href.endsWith('.html')) {
      var mainEl = document.querySelector('.main');
      mainEl === null || mainEl === void 0 || mainEl.addEventListener('click', /*#__PURE__*/function () {
        var _ref3 = reaxel_asyncToGenerator(/*#__PURE__*/reaxel_regeneratorRuntime().mark(function _callee3(e) {
          var cardEl, id;
          return reaxel_regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return GM.getValue('options::modal-mode', true);
              case 2:
                if (_context3.sent) {
                  _context3.next = 4;
                  break;
                }
                return _context3.abrupt("return");
              case 4:
                cardEl = e.composedPath().find(function (p) {
                  var _p$dataset;
                  return !!((_p$dataset = p.dataset) !== null && _p$dataset !== void 0 && _p$dataset.id) && p.className === 'post grid';
                });
                if (cardEl) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                if (cardEl) {
                  console.log(cardEl, '0000000000');
                  id = cardEl.dataset.id;
                  setState({
                    iframeURL: "https://www.switch618.com/".concat(id, ".html"),
                    modalOpened: true
                  });
                }
              case 7:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }());
    } else {
      document.querySelectorAll('a').forEach(function (el) {
        if (el.innerText === ' 立即下载') {
          el.addEventListener('click', function (e) {
            e.preventDefault();
            location.href = el.href;
          });
        }
      });
    }
  });
  useMatchDomain({
    includes: ['steamzg']
  }, function () {
    if (/\d{5,8}\/?$/.test(location.href)) {
      return;
    }
    var mainEl = document.querySelector('.poi-row.inn-archive__container');
    mainEl === null || mainEl === void 0 || mainEl.addEventListener('click', /*#__PURE__*/function () {
      var _ref4 = reaxel_asyncToGenerator(/*#__PURE__*/reaxel_regeneratorRuntime().mark(function _callee4(e) {
        var cardEl, href;
        return reaxel_regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return GM.getValue('options::modal-mode', true);
            case 2:
              if (_context4.sent) {
                _context4.next = 4;
                break;
              }
              return _context4.abrupt("return");
            case 4:
              cardEl = e.composedPath().find(function (el) {
                return el.tagName === 'ARTICLE';
              });
              if (cardEl) {
                e.preventDefault();
                e.stopPropagation();
                href = cardEl.querySelector("a[href^='https://steamzg.com/']").href;
                console.log(cardEl, '0000000000');
                setState({
                  iframeURL: href,
                  modalOpened: true
                });
              }
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
  });
  if (!document.body) {
    console.table(location);
  }
  var rtn = {};
  return Object.assign(function () {
    return rtn;
  }, {
    store: store,
    setState: setState
  });
});


// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__(440);
;// ./projects/switch520-auto-secret/Components/OpenInModal/index.tsx
/* provided dependency */ var switch520_auto_secret_React = __webpack_require__(594);
function OpenInModal_typeof(o) { "@babel/helpers - typeof"; return OpenInModal_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, OpenInModal_typeof(o); }
function OpenInModal_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ OpenInModal_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == OpenInModal_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(OpenInModal_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function OpenInModal_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function OpenInModal_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { OpenInModal_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { OpenInModal_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var OpenInModal = (0,esm/* reaxper */.i)(function () {
  var _reaxel_OpenInModal$s = reaxel_OpenInModal.store,
    modalOpened = _reaxel_OpenInModal$s.modalOpened,
    iframeURL = _reaxel_OpenInModal$s.iframeURL;
  return /*#__PURE__*/switch520_auto_secret_React.createElement(external_antd_.Modal, {
    open: modalOpened,
    onClose: function onClose() {
      reaxel_OpenInModal.setState({
        modalOpened: false,
        iframeURL: null
      });
    },
    onCancel: function onCancel() {
      reaxel_OpenInModal.setState({
        modalOpened: false,
        iframeURL: null
      });
    },
    bodyStyle: {
      height: '80vh'
    },
    centered: true,
    footer: null,
    width: "85%",
    style: {
      padding: 0
    },
    destroyOnClose: true,
    wrapStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    maskStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    title: /*#__PURE__*/switch520_auto_secret_React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none'
      }
    }, /*#__PURE__*/switch520_auto_secret_React.createElement("a", {
      style: {
        color: 'blueviolet',
        marginRight: 8
      },
      onClick: function onClick() {
        return window.open(iframeURL);
      }
    }, iframeURL), /*#__PURE__*/switch520_auto_secret_React.createElement("svg", {
      onClick: /*#__PURE__*/OpenInModal_asyncToGenerator(/*#__PURE__*/OpenInModal_regeneratorRuntime().mark(function _callee() {
        return OpenInModal_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return navigator.clipboard.writeText(iframeURL);
            case 2:
              external_antd_.message.success('复制成功');
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })),
      style: {
        cursor: 'pointer'
      },
      className: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "p-id": "9105",
      width: "32",
      height: "32"
    }, /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M589.3 260.9v30H371.4v-30H268.9v513h117.2v-304l109.7-99.1h202.1V260.9z",
      fill: "#E1F0FF",
      "p-id": "9106"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M516.1 371.1l-122.9 99.8v346.8h370.4V371.1z",
      fill: "#E1F0FF",
      "p-id": "9107"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M752.7 370.8h21.8v435.8h-21.8z",
      fill: "#446EB1",
      "p-id": "9108"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M495.8 370.8h277.3v21.8H495.8z",
      fill: "#446EB1",
      "p-id": "9109"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M495.8 370.8h21.8v124.3h-21.8z",
      fill: "#446EB1",
      "p-id": "9110"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M397.7 488.7l-15.4-15.4 113.5-102.5 15.4 15.4z",
      fill: "#446EB1",
      "p-id": "9111"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M382.3 473.3h135.3v21.8H382.3z",
      fill: "#446EB1",
      "p-id": "9112"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M382.3 479.7h21.8v348.6h-21.8zM404.1 806.6h370.4v21.8H404.1z",
      fill: "#446EB1",
      "p-id": "9113"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M447.7 545.1h261.5v21.8H447.7zM447.7 610.5h261.5v21.8H447.7zM447.7 675.8h261.5v21.8H447.7z",
      fill: "#6D9EE8",
      "p-id": "9114"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M251.6 763h130.7v21.8H251.6z",
      fill: "#446EB1",
      "p-id": "9115"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M251.6 240.1h21.8v544.7h-21.8zM687.3 240.1h21.8v130.7h-21.8zM273.4 240.1h108.9v21.8H273.4z",
      fill: "#446EB1",
      "p-id": "9116"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M578.4 240.1h130.7v21.8H578.4zM360.5 196.5h21.8v108.9h-21.8zM382.3 283.7h196.1v21.8H382.3zM534.8 196.5h65.4v21.8h-65.4z",
      fill: "#446EB1",
      "p-id": "9117"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M360.5 196.5h65.4v21.8h-65.4zM404.1 174.7h152.5v21.8H404.1zM578.4 196.5h21.8v108.9h-21.8z",
      fill: "#446EB1",
      "p-id": "9118"
    }))),
    closeIcon: /*#__PURE__*/switch520_auto_secret_React.createElement("span", {
      style: {
        transform: 'scale(1.5)'
      }
    }, /*#__PURE__*/switch520_auto_secret_React.createElement("svg", {
      className: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "p-id": "16863",
      width: "32",
      height: "32"
    }, /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M38.04 518.35a475.12 487.33 0 1 0 950.24 0 475.12 487.33 0 1 0-950.24 0Z",
      fill: "#07AA74",
      "p-id": "16864"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M513.16 18.75C258.74 18.75 52.5 224.99 52.5 479.41c0 254.42 206.25 460.66 460.66 460.66s460.66-206.25 460.66-460.66c0.01-254.42-206.24-460.66-460.66-460.66z m0 769.72c-170.69 0-309.06-138.37-309.06-309.06s138.37-309.06 309.06-309.06 309.06 138.37 309.06 309.06c0.01 170.69-138.37 309.06-309.06 309.06z",
      fill: "#56D8B0",
      "p-id": "16865"
    }), /*#__PURE__*/switch520_auto_secret_React.createElement("path", {
      d: "M656.21 556.84c18.12 18.12 18.12 47.5 0 65.62-9.06 9.07-20.93 13.59-32.8 13.59-11.88 0-23.75-4.53-32.81-13.59l-77.43-77.43-77.44 77.43c-9.06 9.07-20.93 13.59-32.8 13.59-11.88 0-23.75-4.53-32.81-13.59-18.11-18.11-18.11-47.49 0-65.62l77.44-77.43-77.44-77.44c-18.11-18.11-18.11-47.49 0-65.62 18.12-18.11 47.5-18.11 65.62 0l77.44 77.44 77.43-77.44c18.12-18.11 47.5-18.11 65.62 0 18.12 18.12 18.12 47.5 0 65.62l-77.43 77.44 77.41 77.43z",
      fill: "#FFFFFF",
      "p-id": "16866"
    })))
  }, /*#__PURE__*/switch520_auto_secret_React.createElement("iframe", {
    src: iframeURL,
    width: "100%",
    height: "100%"
  }));
});





// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(594);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
;// ./projects/switch520-auto-secret/Components/SearchInSteamButton/index.tsx
function SearchInSteamButton_typeof(o) { "@babel/helpers - typeof"; return SearchInSteamButton_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, SearchInSteamButton_typeof(o); }
function SearchInSteamButton_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ SearchInSteamButton_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == SearchInSteamButton_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(SearchInSteamButton_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function SearchInSteamButton_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function SearchInSteamButton_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { SearchInSteamButton_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { SearchInSteamButton_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var SearchInSteam = (0,esm/* reaxper */.i)(function () {
  return /*#__PURE__*/external_React_default().createElement("div", null, /*#__PURE__*/external_React_default().createElement("button", {
    style: {
      backgroundColor: '#20a0ff',
      color: '#eee',
      width: '100%',
      padding: '12px 18px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      letterSpacing: '2px',
      margin: '0 0 24px 0'
    },
    onClick: /*#__PURE__*/SearchInSteamButton_asyncToGenerator(/*#__PURE__*/SearchInSteamButton_regeneratorRuntime().mark(function _callee4() {
      var searchResult;
      return SearchInSteamButton_regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            searchResult = null;
            _context4.next = 3;
            return useMatchDomain({
              includes: ['gamer520.com']
            }, /*#__PURE__*/SearchInSteamButton_asyncToGenerator(/*#__PURE__*/SearchInSteamButton_regeneratorRuntime().mark(function _callee() {
              var _yield$import, getGameName;
              return SearchInSteamButton_regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 95));
                  case 2:
                    _yield$import = _context.sent;
                    getGameName = _yield$import.getGameName;
                    searchResult = getGameName();
                  case 5:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            })));
          case 3:
            _context4.next = 5;
            return useMatchDomain({
              includes: ['switch618']
            }, /*#__PURE__*/SearchInSteamButton_asyncToGenerator(/*#__PURE__*/SearchInSteamButton_regeneratorRuntime().mark(function _callee2() {
              var _yield$import2, getGameName, _getGameName, english, chinese;
              return SearchInSteamButton_regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 801));
                  case 2:
                    _yield$import2 = _context2.sent;
                    getGameName = _yield$import2.getGameName;
                    _getGameName = getGameName(), english = _getGameName.english, chinese = _getGameName.chinese;
                    english ? searchResult = english : searchResult = chinese;
                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            })));
          case 5:
            _context4.next = 7;
            return useMatchDomain({
              includes: ['steamzg']
            }, /*#__PURE__*/SearchInSteamButton_asyncToGenerator(/*#__PURE__*/SearchInSteamButton_regeneratorRuntime().mark(function _callee3() {
              var href;
              return SearchInSteamButton_regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    href = document.querySelectorAll('a').forEach(function (el) {
                      if (el.href && el.href.startsWith('https://store.steampowered.com/app')) {
                        window.open(el.href);
                      }
                    });
                  case 1:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            })));
          case 7:
            if (searchResult) {
              _context4.next = 9;
              break;
            }
            return _context4.abrupt("return");
          case 9:
            window.open("https://store.steampowered.com/search/?term=".concat(encodeURIComponent(searchResult.trim()).replace(/%20/g, '+')));
          case 10:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))
  }, "\u53BBSteam\u641C\u7D22\u6B64\u6E38\u620F"));
});



// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(338);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./projects/switch520-auto-secret/style.less
var style = __webpack_require__(543);
;// ./projects/switch520-auto-secret/style.less

      
      
      
      
      
      
      
      
      

var style_options = {};

style_options.styleTagTransform = (styleTagTransform_default());
style_options.setAttributes = (setAttributesWithoutAttributes_default());
style_options.insert = insertBySelector_default().bind(null, "head");
style_options.domAPI = (styleDomAPI_default());
style_options.insertStyleElement = (insertStyleElement_default());

var style_update = injectStylesIntoStyleTag_default()(style/* default */.A, style_options);




       /* harmony default export */ const switch520_auto_secret_style = (style/* default */.A && style/* default */.A.locals ? style/* default */.A.locals : undefined);

;// ./projects/switch520-auto-secret/index.tsx
function switch520_auto_secret_typeof(o) { "@babel/helpers - typeof"; return switch520_auto_secret_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, switch520_auto_secret_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || switch520_auto_secret_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function switch520_auto_secret_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return switch520_auto_secret_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? switch520_auto_secret_arrayLikeToArray(r, a) : void 0; } }
function switch520_auto_secret_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function switch520_auto_secret_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ switch520_auto_secret_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == switch520_auto_secret_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(switch520_auto_secret_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function switch520_auto_secret_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function switch520_auto_secret_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { switch520_auto_secret_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { switch520_auto_secret_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
(function () {
  'use strict';

  if (!document.body) return;
  if (window.parent !== window.self) {
    document.querySelectorAll('a').forEach(function (a) {
      return a.target = '_blank';
    });
  }
  //自动输入密码并提交
  ;
  (function () {
    useMatchDomain({
      includes: ['gamer520.com']
    }, function () {
      var el_input = function () {
        return document.querySelector('input#password') || document.querySelector("input[type='password']") || document.querySelector("input[name='post_password']");
      }();
      var el_submit = function () {
        return document.querySelector("input[type='submit']") || document.querySelector("input[name='Submit']") || document.querySelector("input[value='\u63D0\u4EA4']");
      }();
      document.querySelectorAll('*').forEach(function (node) {
        var innerText = node.innerText;
        if (innerText !== null && innerText !== void 0 && innerText.startsWith('密码保护：') && !(innerText !== null && innerText !== void 0 && innerText.includes('上一篇')) && !(innerText !== null && innerText !== void 0 && innerText.includes('牛夫人')) && !(innerText !== null && innerText !== void 0 && innerText.includes('当前位置')) && !(innerText !== null && innerText !== void 0 && innerText.includes('此内容受密码保护')) && !(innerText !== null && innerText !== void 0 && innerText.includes('永久防迷路'))) {
          // const [result] = innerText.match(/[0-9]{3,6}/) ?? [null];
          var secret = innerText.replace('密码保护：', '');
          if (secret && el_input) {
            el_input.value = secret;
            el_submit.click();
          }
        }
      });
    });
    useMatchDomain({
      includes: ['acgxj.com']
    }, /*#__PURE__*/switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee() {
      return switch520_auto_secret_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            document.querySelectorAll('span').forEach(function (el) {
              if (el.innerText.startsWith('访问密码：') && /\d{6}$/.test(el.innerText)) {
                var pwd = el.innerText.replace('访问密码：', '');
                var input_pwd = document.querySelector('input[type=password][name=e_secret_key]');
                if (!input_pwd) return;
                input_pwd.value = pwd;
                var input_confirm = document.querySelector('input[type=submit][value=确定]');
                input_confirm.click();
              }
            });
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
  })();

  //以下代码将百度网盘的链接+提取码融合为一个按钮,点击之后直接跳转并填充密码
  ;
  (function () {
    useMatchDomain({
      includes: ['gamer520.com']
    }, function () {
      /**
       * 拿到链接文本所在的P标签
       */
      var containerDiv = function () {
        return Array.from(document.querySelectorAll('div.entry-content.u-text-format.u-clearfix')).find(function (el) {
          var _el$innerText, _el$innerText$include, _el$innerText2, _el$innerText2$includ, _el$innerText3, _el$innerText3$includ;
          return ((_el$innerText = el.innerText) === null || _el$innerText === void 0 || (_el$innerText$include = _el$innerText.includes) === null || _el$innerText$include === void 0 ? void 0 : _el$innerText$include.call(_el$innerText, '提取码')) && ((_el$innerText2 = el.innerText) === null || _el$innerText2 === void 0 || (_el$innerText2$includ = _el$innerText2.includes) === null || _el$innerText2$includ === void 0 ? void 0 : _el$innerText2$includ.call(_el$innerText2, '链接:')) && ((_el$innerText3 = el.innerText) === null || _el$innerText3 === void 0 || (_el$innerText3$includ = _el$innerText3.includes) === null || _el$innerText3$includ === void 0 ? void 0 : _el$innerText3$includ.call(_el$innerText3, 'https://pan.baidu.com'));
        });
      }();
      if (containerDiv) {
        var _ref2 = function () {
            //兼容不是<a/>标签的情况,将其转换为a标签
            var aElement = Array.from(containerDiv.querySelectorAll('*')).reduce(function (accu, el) {
              var _el$href, _el$href$startsWith;
              if (accu) return accu;
              if (el.tagName.toLowerCase() === 'a' && (_el$href = el.href) !== null && _el$href !== void 0 && (_el$href$startsWith = _el$href.startsWith) !== null && _el$href$startsWith !== void 0 && _el$href$startsWith.call(_el$href, 'https://pan.baidu.com')) {
                return accu = el;
              } else {
                //如果网盘链接是个普通text,则将其转换为a标签
                if ([el.innerText.includes('链接'), el.innerText.includes('https://pan.baidu.com'), el.children.length === 0 || Array.from(el.childNodes).find(function (e) {
                  return e.nodeName === '#text' && e.nodeValue.includes('https://pan.baidu.com');
                })].every(function (bool) {
                  return bool;
                })) {
                  var url = el.innerText.match(/https?:\/\/pan\.baidu\.com\/[\/a-zA-Z0-9?=&]+/)[0];
                  el.innerHTML = el.innerText.replace(url, "<a href=\"".concat(url, "\">").concat(url, "</a>"));
                  return accu = el.querySelector('a');
                }
              }
            }, null);
            return [aElement.href, aElement];
          }(),
          _ref3 = _slicedToArray(_ref2, 2),
          baiduLink = _ref3[0],
          baiduLinkAElement = _ref3[1];
        var _ref4 = function () {
            var pwdElement = Array.from(containerDiv.querySelectorAll('*')).find(function (el) {
              var _el$innerText4, _el$innerText4$starts;
              return el === null || el === void 0 || (_el$innerText4 = el.innerText) === null || _el$innerText4 === void 0 || (_el$innerText4$starts = _el$innerText4.startsWith) === null || _el$innerText4$starts === void 0 ? void 0 : _el$innerText4$starts.call(_el$innerText4, '提取码:');
            });
            return [pwdElement === null || pwdElement === void 0 ? void 0 : pwdElement.innerText.replace('提取码: ', '').replaceAll(' ', ''), pwdElement];
          }(),
          _ref5 = _slicedToArray(_ref4, 2),
          pwdText = _ref5[0],
          pwdElement = _ref5[1];
        if (!baiduLink.includes('pwd=') && pwdText) {
          var href = baiduLink + (baiduLink.includes('?') ? "&pwd=".concat(pwdText) : "?pwd=".concat(pwdText));
          baiduLinkAElement.href = href;
          baiduLinkAElement.innerText = baiduLinkAElement.innerText.replace(baiduLink, href);
          baiduLinkAElement.target = '_blank';
        }
        containerDiv.removeChild(pwdElement);
      }
    });
  })();

  //以下代码跳过获取下载地址的过程 , 不需要点两次立即下载
  ;
  switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee4() {
    return switch520_auto_secret_regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          useMatchDomain({
            includes: ['gamer520.com']
          }, /*#__PURE__*/switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee3() {
            var downloadBtn, srcId;
            return switch520_auto_secret_regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  if (location.href.endsWith('.html')) {
                    _context3.next = 2;
                    break;
                  }
                  return _context3.abrupt("return");
                case 2:
                  downloadBtn = document.querySelector('a.go-down');
                  if (downloadBtn) {
                    _context3.next = 5;
                    break;
                  }
                  return _context3.abrupt("return");
                case 5:
                  srcId = downloadBtn.dataset.id;
                  downloadBtn === null || downloadBtn === void 0 || downloadBtn.addEventListener('click', /*#__PURE__*/function () {
                    var _ref8 = switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee2(e) {
                      var form, url;
                      return switch520_auto_secret_regeneratorRuntime().wrap(function _callee2$(_context2) {
                        while (1) switch (_context2.prev = _context2.next) {
                          case 0:
                            e.preventDefault();
                            e.stopPropagation();
                            form = new URLSearchParams();
                            form.set('action', 'user_down_ajax');
                            form.set('post_id', srcId);
                            0 && 0;
                            url = "https://".concat(location.host, "/go?post_id=").concat(srcId);
                            if (!location.host.includes('like.gamer520')) {
                              _context2.next = 10;
                              break;
                            }
                            window.open(url);
                            return _context2.abrupt("return");
                          case 10:
                            location.href = url;
                          case 11:
                          case "end":
                            return _context2.stop();
                        }
                      }, _callee2);
                    }));
                    return function (_x) {
                      return _ref8.apply(this, arguments);
                    };
                  }(), false);
                case 7:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          })));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }))();

  //如果有密码,则自动点击网盘按钮
  ;
  (function () {
    useMatchDomain({
      hosts: ['pan.baidu.com']
    }, function () {
      if (location.href.startsWith('https://pan.baidu.com') && location.href.includes('pwd=')) {
        var submitBtn = document.getElementById('submitBtn');
        if ((submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.innerText) === '提取文件') {
          submitBtn.click();
        }
      }
    });
  })();

  //在游戏网站中划词搜索
  ;
  (function () {
    useMatchDomain({
      includes: ['gamer520', 'switch618', 'steamzg', 'xxxxx520']
    }, function () {
      Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 763));
    });
  })();

  //允许switch618.com的右键菜单
  ;
  (function () {
    useMatchDomain({
      includes: ['switch618']
    }, function () {
      document.oncontextmenu = null;
    });
  })();

  //模态框模式浏览游戏
  ;
  switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee7() {
    var _registerMenu, div, reactRoot;
    return switch520_auto_secret_regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (!location.href.includes('wp-content/plugins/erphpdown/download.php')) {
            _context7.next = 2;
            break;
          }
          return _context7.abrupt("return");
        case 2:
          _registerMenu = /*#__PURE__*/function () {
            var _ref11 = switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee6() {
              var modalMode;
              return switch520_auto_secret_regeneratorRuntime().wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return GM.getValue('options::modal-mode', true);
                  case 2:
                    modalMode = _context6.sent;
                    GM.registerMenuCommand("\u7A97\u53E3\u6A21\u5F0F\u6253\u5F00\u4E0B\u8F7D\u9875\u9762:".concat(modalMode ? '✅已开启' : '❌已关闭'), /*#__PURE__*/switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee5() {
                      return switch520_auto_secret_regeneratorRuntime().wrap(function _callee5$(_context5) {
                        while (1) switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.t0 = GM;
                            _context5.next = 3;
                            return GM.getValue('options::modal-mode');
                          case 3:
                            _context5.t1 = !_context5.sent;
                            _context5.next = 6;
                            return _context5.t0.setValue.call(_context5.t0, 'options::modal-mode', _context5.t1);
                          case 6:
                            _context5.next = 8;
                            return _registerMenu();
                          case 8:
                            location.reload();
                          case 9:
                          case "end":
                            return _context5.stop();
                        }
                      }, _callee5);
                    })));
                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            }));
            return function registerMenu() {
              return _ref11.apply(this, arguments);
            };
          }();
          _registerMenu();
          _context7.next = 6;
          return GM.getValue('options::modal-mode', true);
        case 6:
          if (!_context7.sent) {
            _context7.next = 10;
            break;
          }
          div = document.createElement('div');
          reactRoot = (0,client/* createRoot */.H)(div);
          reactRoot.render(/*#__PURE__*/external_React_default().createElement(OpenInModal, null));
        case 10:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }))();

  //将去steam搜索框插入进页面正文
  ;
  switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee9() {
    var container, div, reactRoot;
    return switch520_auto_secret_regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          if (!location.href.includes('wp-content/plugins/erphpdown/download.php')) {
            _context9.next = 2;
            break;
          }
          return _context9.abrupt("return");
        case 2:
          div = document.createElement('div');
          reactRoot = (0,client/* createRoot */.H)(div);
          useMatchDomain({
            includes: ['gamer520.com']
          }, /*#__PURE__*/switch520_auto_secret_asyncToGenerator(/*#__PURE__*/switch520_auto_secret_regeneratorRuntime().mark(function _callee8() {
            var _yield$import, articleContainer;
            return switch520_auto_secret_regeneratorRuntime().wrap(function _callee8$(_context8) {
              while (1) switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 95));
                case 2:
                  _yield$import = _context8.sent;
                  articleContainer = _yield$import.articleContainer;
                  container = articleContainer();
                  if (!document.body.innerText.includes('牛夫人') && location.pathname !== '/' && container) {
                    container.prepend(div);
                    reactRoot.render(/*#__PURE__*/external_React_default().createElement(SearchInSteam, null));
                  }
                case 6:
                case "end":
                  return _context8.stop();
              }
            }, _callee8);
          })));
          useMatchDomain({
            regExp: /switch618\.com\/[\d+]+.html/g
          }, function () {
            container = document.querySelector(".erphpdown-box");
            if (!container) {
              return;
            }
            container.insertAdjacentElement('afterend', div);
            reactRoot.render(/*#__PURE__*/external_React_default().createElement(SearchInSteam, null));
          });
          useMatchDomain({
            includes: ['steamzg']
          }, function () {
            if (!/\d{5,8}\/?$/.test(location.pathname)) {
              return;
            }
            var siblingEl = document.querySelector('.su-row');
            if (!siblingEl) {
              throw new Error('无法找到挂载<SearchInSteam />的节点');
            }
            var parent = siblingEl.parentElement;
            parent.insertBefore(div, siblingEl);
            reactRoot.render(/*#__PURE__*/external_React_default().createElement(SearchInSteam, null));
          });
        case 7:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }))();
})();






/******/ })()
;