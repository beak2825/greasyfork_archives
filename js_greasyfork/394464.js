// ==UserScript==
// @name         优化排版
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  纠正中英文排版问题。 https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md 
// @git          http://gitlab.alibaba-inc.com/shiba/typo-tools
// @author       shiba@taobao.com
// @include      https://yuque.antfin-inc.com/**/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394464/%E4%BC%98%E5%8C%96%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/394464/%E4%BC%98%E5%8C%96%E6%8E%92%E7%89%88.meta.js
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/pangu/core.js
// CJK is short for Chinese, Japanese, and Korean.
//
// CJK includes following Unicode blocks:
// \u2e80-\u2eff CJK Radicals Supplement
// \u2f00-\u2fdf Kangxi Radicals
// \u3040-\u309f Hiragana
// \u30a0-\u30ff Katakana
// \u3100-\u312f Bopomofo
// \u3200-\u32ff Enclosed CJK Letters and Months
// \u3400-\u4dbf CJK Unified Ideographs Extension A
// \u4e00-\u9fff CJK Unified Ideographs
// \uf900-\ufaff CJK Compatibility Ideographs
//
// For more information about Unicode blocks, see
// http://unicode-table.com/en/
// https://github.com/vinta/pangu
//
// all J below does not include \u30fb
const CJK = '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff';

// ANS is short for Alphabets, Numbers, and Symbols.
//
// A includes A-Za-z\u0370-\u03ff
// N includes 0-9
// S includes `~!@#$%^&*()-_=+[]{}\|;:'",<.>/?
//
// some S below does not include all symbols

const ANY_CJK = new RegExp(`[${CJK}]`);

// the symbol part only includes ~ ! ; : , . ? but . only matches one character
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new RegExp(`([${CJK}])[ ]*([\\:]+|\\.)[ ]*([${CJK}])`, 'g');
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new RegExp(`([${CJK}])[ ]*([~\\!;,\\?]+)[ ]*`, 'g');
const DOTS_CJK = new RegExp(`([\\.]{2,}|\u2026)([${CJK}])`, 'g');
const FIX_CJK_COLON_ANS = new RegExp(`([${CJK}])\\:([A-Z0-9\\(\\)])`, 'g');

// the symbol part does not include '
const CJK_QUOTE = new RegExp(`([${CJK}])([\`"\u05f4])`, 'g');
const QUOTE_CJK = new RegExp(`([\`"\u05f4])([${CJK}])`, 'g');
const FIX_QUOTE_ANY_QUOTE = /([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)/g;

const CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp(`([${CJK}])('[^s])`, 'g');
const SINGLE_QUOTE_CJK = new RegExp(`(')([${CJK}])`, 'g');
const FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp(`([A-Za-z0-9${CJK}])( )('s)`, 'g');

const HASH_ANS_CJK_HASH = new RegExp(`([${CJK}])(#)([${CJK}]+)(#)([${CJK}])`, 'g');
const CJK_HASH = new RegExp(`([${CJK}])(#([^ ]))`, 'g');
const HASH_CJK = new RegExp(`(([^ ])#)([${CJK}])`, 'g');

// the symbol part only includes + - * / = & | < >
const CJK_OPERATOR_ANS = new RegExp(`([${CJK}])([\\+\\-\\*\\/=&\\|<>])([A-Za-z0-9])`, 'g');
const ANS_OPERATOR_CJK = new RegExp(`([A-Za-z0-9])([\\+\\-\\*\\/=&\\|<>])([${CJK}])`, 'g');

const FIX_SLASH_AS = /([/]) ([a-z\-_\./]+)/g;
const FIX_SLASH_AS_SLASH = /([/\.])([A-Za-z\-_\./]+) ([/])/g;

// the bracket part only includes ( ) [ ] { } < > “ ”
const CJK_LEFT_BRACKET = new RegExp(`([${CJK}])([\\(\\[\\{<>\u201c])`, 'g');
const RIGHT_BRACKET_CJK = new RegExp(`([\\)\\]\\}<>\u201d])([${CJK}])`, 'g');
const FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET = /([\(\[\{<\u201c]+)[ ]*(.+?)[ ]*([\)\]\}>\u201d]+)/;
const ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp(`([A-Za-z0-9${CJK}])[ ]*([\u201c])([A-Za-z0-9${CJK}\\-_ ]+)([\u201d])`, 'g');
const LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp(`([\u201c])([A-Za-z0-9${CJK}\\-_ ]+)([\u201d])[ ]*([A-Za-z0-9${CJK}])`, 'g');

const AN_LEFT_BRACKET = /([A-Za-z0-9])([\(\[\{])/g;
const RIGHT_BRACKET_AN = /([\)\]\}])([A-Za-z0-9])/g;

const CJK_ANS = new RegExp(`([${CJK}])([A-Za-z\u0370-\u03ff0-9@\\$%\\^&\\*\\-\\+\\\\=\\|/\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])`, 'g');
const ANS_CJK = new RegExp(`([A-Za-z\u0370-\u03ff0-9~\\$%\\^&\\*\\-\\+\\\\=\\|/!;:,\\.\\?\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])([${CJK}])`, 'g');

const S_A = /(%)([A-Za-z])/g;

const MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g;

class Pangu {
  constructor() {
    this.version = '4.0.7';
  }

  convertToFullwidth(symbols) {
    return symbols
      .replace(/~/g, '～')
      .replace(/!/g, '！')
      .replace(/;/g, '；')
      .replace(/:/g, '：')
      .replace(/,/g, '，')
      .replace(/\./g, '。')
      .replace(/\?/g, '？');
  }

  spacing(text) {
    if (typeof text !== 'string') {
      console.warn(`spacing(text) only accepts string but got ${typeof text}`); // eslint-disable-line no-console
      return text;
    }

    if (text.length <= 1 || !ANY_CJK.test(text)) {
      return text;
    }

    const self = this;

    // DEBUG
    // String.prototype.rawReplace = String.prototype.replace;
    // String.prototype.replace = function(regexp, newSubstr) {
    //   const oldText = this;
    //   const newText = this.rawReplace(regexp, newSubstr);
    //   if (oldText !== newText) {
    //     console.log(`regexp: ${regexp}`);
    //     console.log(`oldText: ${oldText}`);
    //     console.log(`newText: ${newText}`);
    //   }
    //   return newText;
    // };

    let newText = text;

    // https://stackoverflow.com/questions/4285472/multiple-regex-replace
    newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK, (match, leftCjk, symbols, rightCjk) => {
      const fullwidthSymbols = self.convertToFullwidth(symbols);
      return `${leftCjk}${fullwidthSymbols}${rightCjk}`;
    });

    newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS, (match, cjk, symbols) => {
      const fullwidthSymbols = self.convertToFullwidth(symbols);
      return `${cjk}${fullwidthSymbols}`;
    });

    newText = newText.replace(DOTS_CJK, '$1 $2');
    newText = newText.replace(FIX_CJK_COLON_ANS, '$1：$2');

    // remove by shiba newText = newText.replace(CJK_QUOTE, '$1 $2');
    // remove by shiba newText = newText.replace(QUOTE_CJK, '$1 $2');
    newText = newText.replace(FIX_QUOTE_ANY_QUOTE, '$1$2$3');

    // remove by shiba newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, '$1 $2');
    // remove by shiba newText = newText.replace(SINGLE_QUOTE_CJK, '$1 $2');
    newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's"); // eslint-disable-line quotes

    newText = newText.replace(HASH_ANS_CJK_HASH, '$1 $2$3$4 $5');
    newText = newText.replace(CJK_HASH, '$1 $2');
    newText = newText.replace(HASH_CJK, '$1 $3');

    newText = newText.replace(CJK_OPERATOR_ANS, '$1 $2 $3');
    newText = newText.replace(ANS_OPERATOR_CJK, '$1 $2 $3');

    newText = newText.replace(FIX_SLASH_AS, '$1$2');
    newText = newText.replace(FIX_SLASH_AS_SLASH, '$1$2$3');

    // remove by shiba newText = newText.replace(CJK_LEFT_BRACKET, '$1 $2');
    // remove by shiba newText = newText.replace(RIGHT_BRACKET_CJK, '$1 $2');
    newText = newText.replace(FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET, '$1$2$3');
    newText = newText.replace(ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET, '$1 $2$3$4');
    newText = newText.replace(LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK, '$1$2$3 $4');

    newText = newText.replace(AN_LEFT_BRACKET, '$1 $2');
    newText = newText.replace(RIGHT_BRACKET_AN, '$1 $2');

    newText = newText.replace(CJK_ANS, '$1 $2');
    newText = newText.replace(ANS_CJK, '$1 $2');

    newText = newText.replace(S_A, '$1 $2');

    newText = newText.replace(MIDDLE_DOT, '・');

    // DEBUG
    // String.prototype.replace = String.prototype.rawReplace;

    return newText;
  }

  spacingText(text, callback = () => {}) {
    let newText;
    try {
      newText = this.spacing(text);
    } catch (err) {
      callback(err);
      return;
    }
    callback(null, newText);
  }

  spacingTextSync(text) {
    return this.spacing(text);
  }
}

const pangu = new Pangu();

/* harmony default export */ var core = (pangu);
// CONCATENATED MODULE: ./src/index.js


// CJK is short for Chinese, Japanese, and Korean.
const src_CJK = '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff';
const src_ANY_CJK = new RegExp(`[${src_CJK}]`);
const 英文正则 = /[a-zA-Z]/;

const email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
const url = /[a-zA-z]+:\/\/[^\s]*/
const domain = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/

const special = new RegExp(email.source + "|" + url.source + "|" + domain.source, 'g');


/**
 *  1、都用全角括号
 *  2、除了整句都是英文以外，末尾逗号都用全角
 */
function 优化排版(text) {
  const rules = 自定义规则().concat(专有名词());

  rules.forEach(item => {
    text = division(text, special).map(t => 是否是特殊字符串(t) ? t : t.replace(item.pattern, item.replacement)).join('')
  });

  return text;
}

function 是否是特殊字符串(text) {
  return special.test(text);
}

function 自定义规则() {
  return [{
    // 不允许连续的感叹号 https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E6%84%9F%E5%8F%B9%E5%8F%B7
    pattern: /([(!)|(！)]{2,})/g,
    replacement: '！'
  }, {
    // CJK 省略号：https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E7%9C%81%E7%95%A5%E5%8F%B7
    pattern: new RegExp(`([${src_CJK}])([⋯])`, 'g'),
    replacement: '$1……'
  }, {
    // 英文 省略号：https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E7%9C%81%E7%95%A5%E5%8F%B7
    pattern: new RegExp(`([a-zA-Z]+)([…]{1,})`, 'g'),
    replacement: '$1⋯'
  }, {
    // 不规范的省略号修正为规范的省略号
    pattern: /[。]{3,}|[.]{3,}/g,
    replacement: function (content, pos, origin) {
      if (src_ANY_CJK.test(origin.substring(pos - 1, pos))) {
        return '……';
      } else if (英文正则.test(origin.substring(pos - 1, pos))) {
        return '⋯';
      } else {
        return content;
      }
    },
  }, {
    // 省略号不与等连用：https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E7%9C%81%E7%95%A5%E5%8F%B7
    pattern: new RegExp(`([……|⋯])[ ]*等`, 'g'),
    replacement: '$1'
  }, {
    // 总是使用全角括号： https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E6%8B%AC%E5%8F%B7
    pattern: /([(])(.*)([)])/g,
    replacement: '（$2）'
  }, {
    // CJK 使用全角引号 https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E5%BC%95%E5%8F%B7
    pattern: new RegExp(`([\'])([${src_CJK}])([^\']{0,})([\'])`, 'g'),
    replacement: '‘$2$3’'
  }, {
    // CJK使用全角引号 https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E5%BC%95%E5%8F%B7
    pattern: new RegExp(`([\"])([${src_CJK}])([^\"]{0,})([\"])`, 'g'),
    replacement: '“$2$3”'
  }, {
    // 全和半的相互转换，不包含 .
    pattern: new RegExp(`(.*)([~\\!;,\\.\\?～！；，？。]+)`, 'g'),
    replacement: function (content, f, s, pos, origin) {
      if (!new RegExp(`[${src_CJK}]`).test(origin)) {
        return convertToHalfwidth(content);
      }
      // 如果数字，先不处理，不确定都好
      if (/[0-9]/.test(f.substring(f.length - 1, f.length)) && s === '.') {
        return content;
      }
      return convertToFullwidth(content);
    }
  }, {
    // 中文的冒号使用全角： https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E5%86%92%E5%8F%B7
    pattern: new RegExp(`([${src_CJK}])([ ]*)([:])`, 'g'),
    replacement: '$1$2：'
  }, {
    // 时间之间的冒号使用半角 https://github.com/ruanyf/document-style-guide/blob/master/docs/marks.md#%E5%86%92%E5%8F%B7
    pattern: new RegExp(`([0-9]{1,2})([：]+)([0-9]{1,2})`, 'g'),
    replacement: '$1:$3'
  }];
}

function 专有名词() {
  const reStr = '\\b(?<![-.\])#word#(?![-\.])\\b';

  return [{
    pattern: 'javascript',
    replacement: 'JavaScript'
  }, {
    pattern: 'node.jsnodejs',
    replacement: 'Node.js'
  }, {
    pattern: 'html',
    replacement: 'HTML'
  }, {
    pattern: 'css',
    replacement: 'CSS'
  }, {
    pattern: 'java',
    replacement: 'Java'
  }, {
    pattern: 'react',
    replacement: 'React'
  }, {
    pattern: 'es6',
    replacement: 'ES6'
  }, {
    pattern: 'reactdom',
    replacement: 'ReactDOM'
  }, {
    pattern: 'ant design',
    replacement: 'Ant Design'
  }, {
    pattern: 'app',
    replacement: 'App'
  }, {
    pattern: 'Golang',
    replacement: 'Golang'
  }, {
    pattern: 'Python',
    replacement: 'Python'
  }, {
    pattern: 'RESTful',
    replacement: 'RESTful'
  }, {
    pattern: 'MySQL',
    replacement: 'MySQL'
  }, {
    pattern: 'Oracle',
    replacement: 'Oracle'
  }, {
    pattern: 'NoSQL',
    replacement: 'NoSQL'
  }, {
    pattern: 'MongoDB',
    replacement: 'MongoDB'
  }, {
    pattern: 'SQLite',
    replacement: 'SQLite'
  }, {
    pattern: 'Redis',
    replacement: 'Redis'
  }, {
    pattern: 'Hadoop',
    replacement: 'Hadoop'
  }, {
    pattern: 'HBase',
    replacement: 'HBase'
  }, {
    pattern: 'Elasticsearch',
    replacement: 'Elasticsearch'
  }, {
    pattern: 'SpringBoot',
    replacement: 'Spring Boot'
  }, {
    pattern: 'Spring Cloud',
    replacement: 'Spring Cloud'
  }, {
    pattern: 'Spring MVC',
    replacement: 'Spring MVC'
  }, {
    pattern: 'Linux',
    replacement: 'Linux'
  }, {
    pattern: 'Netty',
    replacement: 'Netty'
  }, {
    pattern: 'Ngnix',
    replacement: 'Ngnix'
  }, {
    pattern: 'HTTP',
    replacement: 'HTTP'
  }, {
    pattern: 'HTTPS',
    replacement: 'HTTPS'
  }, {
    pattern: 'Angular',
    replacement: 'Angular'
  }, {
    pattern: 'Vue.js',
    replacement: 'Vue.js'
  }, {
    pattern: 'Git',
    replacement: 'Git'
  }, {
    pattern: 'Webpack',
    replacement: 'Webpack'
  }, {
    pattern: 'Intellij IDEA',
    replacement: 'Intellij IDEA'
  }, {
    pattern: 'GitHub',
    replacement: 'GitHub'
  }, {
    pattern: 'TypeScript',
    replacement: 'TypeScript'
  }, {
    pattern: 'jquery',
    replacement: 'jQuery'
  }, {
    pattern: 'php',
    replacement: 'PHP'
  }, {
    pattern: 'Objective-C',
    replacement: 'Objective-C'
  }, {
    pattern: 'jQuery UI',
    replacement: 'jQuery UI '
  }, {
    pattern: 'jQuery Mobile',
    replacement: 'jQuery Mobile'
  }].map(item => {
    item.pattern = new RegExp(reStr.replace('#word#', item.pattern),'i')
    return item;
  })
}

function convertToFullwidth(symbols) {
  return symbols
    .replace(/~/g, '～')
    .replace(/!/g, '！')
    .replace(/;/g, '；')
    .replace(/:/g, '：')
    .replace(/,/g, '，')
    .replace(/\./g, '。')
    .replace(/\?/g, '？');
}

function convertToHalfwidth(symbols) {
  return symbols
    .replace(/～/g, '~')
    .replace(/！/g, '!')
    .replace(/；/g, ';')
    .replace(/：/g, ':')
    .replace(/，/g, ',')
    .replace(/。/g, '.')
    .replace(/？/g, '?');
}

function division(str, regexp) {
  let result, startIndex = 0,strArr = [];
  while (result = regexp.exec(str)) {
    strArr.push(str.substring(startIndex, result.index));
    strArr.push(result[0]);
    startIndex = result[0].length + result.index;
  }
  strArr.push(str.substring(startIndex, str.length))
  return strArr;
}


// CONCATENATED MODULE: ./src/monkey.js



const $ = document.querySelectorAll.bind(document);
window.addAction = addAction;
window.addAction();

/**
 *  添加按钮
 */
function addAction() {
    const div = document.createElement('div');
    div.className = 'lark-editor-header-action-item';
    div.innerHTML = '<span><button data-testid="doc-publish-button" id="lake-doc-publish-button" type="button" class="ant-btn ant-btn-dashed"><span class="text">优化排版</span></button></span>';

    $('.lark-editor-header-action')[0].appendChild(div);
    div.addEventListener('click', () => {
        getTextNodesIn($('.lake-content-editor-core')[0], (node, el) => {
            // 排除代码节点
            const flag = ![...$("[data-card-type]")].find(container => container.contains(el));
            return flag;
        }).forEach((el) => {
            el.textContent = 优化排版(core.spacing(el.textContent));
        });
    });
}

/**
* Gets an array of the matching text nodes contained by the specified element.
* @param  {!Element} elem
*     The DOM element which will be traversed.
* @param  {function(!Node,!Element):boolean} opt_fnFilter
*     Optional function that if a true-ish value is returned will cause the
*     text node in question to be added to the array to be returned from
*     getTextNodesIn().  The first argument passed will be the text node in
*     question while the second will be the parent of the text node.
* @return {!Array.<!Node>}
*     Array of the matching text nodes contained by the specified element.
*/
function getTextNodesIn(elem, opt_fnFilter) {
    var textNodes = [];
    if (elem) {
        for (let nodes = elem.childNodes, i = nodes.length; i--;) {
            var node = nodes[i]; var nodeType = node.nodeType;
            if (nodeType == 3) {
                if (!opt_fnFilter || opt_fnFilter(node, elem)) {
                    textNodes.push(node);
                }
            }
            else if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
                textNodes = textNodes.concat(getTextNodesIn(node, opt_fnFilter));
            }
        }
    }
    return textNodes;
}

/***/ })
/******/ ]);