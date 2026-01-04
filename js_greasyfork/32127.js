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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gm__ = __webpack_require__(1);
// ==UserScript==
// @name        weicano
// @namespace   javran.github.io
// @description Weibo.cn cleaner
// @include     https://weibo.cn/*
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/32127/weicano.user.js
// @updateURL https://update.greasyfork.org/scripts/32127/weicano.meta.js
// ==/UserScript==



const applyFilters = () => {
  const activeKeywords = _.flatMap(
    Object(__WEBPACK_IMPORTED_MODULE_0__gm__["a" /* getKeywords */])(),
    ([kw,active]) => active ? [kw] : []
  )
  const shouldBlock = node => {
    const jqNode = $(node)
    return activeKeywords.some(keyword =>
      jqNode.find(`div:contains('${keyword}')`).length
    )
  }

  $("html body div[id*='M_'].c").each((_ind,x) => {
    const jq = $(x)
    if (shouldBlock(x)) {
      jq.hide().next('.s').hide()
    } else {
      jq.show().next('.s').show()
    }
  })
}

const mkDialogContent = () => {
  const jqDlg = $('#weicano-dialog')
  const dlg = jqDlg.dialog(
    {
      autoOpen: false,
      position: {my: 'top', at: 'bottom', of: '#weicano-entry'},
    }
  )

  const keywords = Object(__WEBPACK_IMPORTED_MODULE_0__gm__["a" /* getKeywords */])()
  jqDlg.empty()
  keywords.map(([keyword,active], ind) => {
    const kwId = `weicano-kw-toggle-${ind}`
    jqDlg.append(
      $(`<div />`).css({
        width: '100%',
        display: 'flex',
      }).append(
        $('<label />').css({flex: 1}).prop({for: kwId}).text(keyword)
      ).append(
        $('<input />').prop(
          Object.assign(
            {type: 'checkbox', name: kwId, id: kwId},
            active ? {checked: true} : {}
          )
        ).change(() => {
          keywords[ind][1] = !keywords[ind][1]
          Object(__WEBPACK_IMPORTED_MODULE_0__gm__["c" /* setKeywords */])(keywords)
          applyFilters()
          mkDialogContent()
        })
      ).append(
        $('<button />').css({
          padding: 0,
          'font-size': '10px',
        }).text('X').click(() => {
          const newKeywords = []
          keywords.map((x, xInd) => ind !== xInd && newKeywords.push(x))
          Object(__WEBPACK_IMPORTED_MODULE_0__gm__["c" /* setKeywords */])(newKeywords)
          applyFilters()
          mkDialogContent()
        })
      )
    )
  })
  jqDlg.append(
    $('<div />').css({width: '100%', display: 'flex'}).append(
      $('<input />').css({flex: 1}).prop({
        type: 'text',
        name: 'weicano-new-kw',
        id: 'weicano-new-kw',
      }).addClass('text ui-widget-content ui-corner-all')
    ).append(
      $('<button />').css({padding: 0, 'font-size': '10px'}).text('+').click(() => {
        const newKeyword = $('#weicano-dialog input#weicano-new-kw').val().trim()
        if (newKeyword) {
          $('#weicano-dialog input#weicano-new-kw').val('')
          Object(__WEBPACK_IMPORTED_MODULE_0__gm__["b" /* setKeyword */])(newKeyword)
          applyFilters()
          mkDialogContent()
        }
      })
    )
  )

  $('#weicano-entry').text('Weicano').click(() => dlg.dialog('open'))
}

document.documentElement.setAttribute('lang', 'zh-CN')
$(document).ready(() => {
  $('head').append(
    $('<link/>').prop({
      rel: 'stylesheet',
      href: 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
    })
  )
  $("a#top:contains('广场')").parent().hide()

  {
    const jq = $("a.nl:contains('话题')")
    jq.hide()
    jq[0].nextSibling.textContent = ''

    jq.parent().append('|').append(
      $('<button id="weicano-entry" />')
    ).append(
      $('<div id="weicano-dialog" title="Weicano" />').hide()
    )
  }

  $("a#top[href='http://m.weibo.cn']").parent().hide()
  $('div.pm > form span.pmf').hide()

  applyFilters()
  mkDialogContent()
})


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getKeywords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return setKeyword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setKeywords; });
const getKeywords = () =>
  JSON.parse(GM_getValue('keywords','[]'))

const setKeywords = keywords =>
  GM_setValue('keywords',JSON.stringify(keywords))

const setKeyword = (keyword, value=true) => {
  const keywords = getKeywords()
  const kwInd = keywords.findIndex(([kw]) => kw === keyword)
  if (kwInd === -1) {
    keywords.push([keyword,value])
  } else {
    keywords[kwInd][1] = value
  }
  setKeywords(keywords)
}




/***/ })
/******/ ]);