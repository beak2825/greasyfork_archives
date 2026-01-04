// ==UserScript==
// @name         日报专用vup动态筛选
// @namespace    http://tampermonkey.net/
// @version      0.7.8
// @description  try to take over the world!
// @author       星雨漂流
// @match        https://www.acfun.cn/?dd
// @match        https://api-new.app.acfun.cn*
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @require      https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js
// @downloadURL https://update.greasyfork.org/scripts/422096/%E6%97%A5%E6%8A%A5%E4%B8%93%E7%94%A8vup%E5%8A%A8%E6%80%81%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/422096/%E6%97%A5%E6%8A%A5%E4%B8%93%E7%94%A8vup%E5%8A%A8%E6%80%81%E7%AD%9B%E9%80%89.meta.js
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "#moment_mask{width:100%;height:100vh;position:fixed;top:0;left:0;z-index:100;background-color:#fff}a{text-decoration:none}p{margin:0;padding:5px}h3{margin:0;padding:0}h3 a{color:#333;font-size:16px}.moment_container{width:1780px;margin:0 auto;height:calc(100% - 35px);overflow:auto}.moment_title{text-align:center;font-size:22px;color:#666;height:35px;display:flex;align-items:center;justify-content:center}.moment_top{height:40px;line-height:40px}.moment_top span{margin-left:20px}.moment_top label{margin-left:15px}.moment_content{position:relative;width:100%;overflow:auto;padding-bottom:50px}.moment_item{display:block;float:left;margin-bottom:40px;break-inside:avoid;width:420px;box-sizing:border-box;padding:15px;position:relative;background-color:#fff}.moment_item.article::after{content:'文章';position:absolute;right:5px;top:5px;font-size:12px;width:40px;height:18px;border:1px solid #ccc;color:#ccc;border-radius:9px;display:flex;align-items:center;justify-content:center}.moment_item.video::after{content:'视频';position:absolute;right:5px;top:5px;font-size:12px;width:40px;height:18px;border:1px solid #ccc;color:#ccc;border-radius:9px;display:flex;align-items:center;justify-content:center}.moment_item .moment_item_top{display:flex;align-items:center}.moment_item .moment_item_top a{font-size:14px;color:#666;text-decoration:none}.moment_item .moment_item_top a span{margin-right:2px}.moment_item .moment_item_top .avi_icon{width:14px;height:14px;margin-right:1px;margin-top:2px;user-select:none}.moment_item .moment_item_top .user_head_middle{width:75%}.moment_item .moment_item_top .user_head{width:30px;height:30px;border-radius:50%;margin-right:4px;user-select:none}.moment_item .moment_item_time{font-size:10px;color:#cdcdcd;user-select:none}.moment_item p{padding-top:10px;font-family:\"Microsoft Yahei\";font-size:16px}.moment_item h3{margin-top:5px}.moment_item .check_link{color:#aaa;margin-top:5px;display:inline-block;user-select:none}.moment_include{background-color:#fafafa;padding:10px;padding-bottom:12px;margin:10px 0}.ac_moji{width:70px;height:70px}.moment_item_content{width:100%}.moment_item_content .imgs{display:flex;align-items:flex-start;width:100%;margin-top:5px;margin-right:2px}.moment_item_content .imgs img{flex:1;width:1px;display:block}.moment_item_video{width:100%}.moment_item_video h3 a{width:100%;font-size:16px}.moment_item_video img{width:98%;display:block;margin:0 auto;margin-top:5px}.monent_item_article{width:100%}.monent_item_article h3 a{width:100%;font-size:16px}.qrcode_container{position:absolute;background-color:#fff;width:150px;height:170px;z-index:100;box-shadow:0 0 3px rgba(0,0,0,0.5);margin-left:5px}.qrcode_container p{font-size:12px;color:999;padding:0 5px}.qrcode_container div{width:140px;height:140px;margin:0 auto;margin-top:4px}.check_link{color:#aaa;margin-top:5px;display:inline-block;user-select:none;font-size:10px}.scale_mask{position:fixed;width:100%;height:100vh;left:0;top:0;background-color:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:200}.scale_mask canvas{left:0;top:0}.scale_mask .scale_img{width:100%}.scale_mask .copy_board{position:absolute;left:0;top:0;width:800px;height:500px;overflow:auto;z-index:250}.scale_mask .scale_container{position:relative;transform:scale(1.8)}.scale_mask .copy_button{position:absolute;right:8px;top:10px;width:60px;height:20px;line-height:18px;overflow:hidden;border-radius:9px;text-align:center;background-color:#fff;border:1px solid #ccc;color:#aaa;z-index:210;font-size:12px}.scale_mask .copy_button span{display:flex;align-items:center;justify-content:center;background-color:#fff;width:100%;height:100%;transform:translateY(100%);transition:all 0.3s}.scale_mask .copy_button.copied span{transform:translateY(0)}.scale_mask .scale_content{width:400px;max-height:55vh;overflow-y:auto;padding:50px 20px;background-color:#fff}.scale_mask .moment_item_top{display:flex;align-items:center}.scale_mask .moment_item_top a{font-size:14px;color:#666;text-decoration:none}.scale_mask .moment_item_top a span{margin-right:2px}.scale_mask .moment_item_top .user_head_middle{width:75%}.scale_mask .moment_item_top .avi_icon{width:14px;height:14px;margin-right:1px;margin-top:2px;user-select:none;display:inline}.scale_mask .moment_item_top .user_head{width:30px;height:30px;border-radius:50%;margin-right:4px;user-select:none}.scale_mask .moment_item_time{font-size:10px;color:#cdcdcd;user-select:none}.scale_mask p{padding-top:10px;font-family:\"Microsoft Yahei\";font-size:16px}.scale_mask h3{margin-top:5px}.scale_mask .moment_item_content{width:100%}.scale_mask .moment_item_content .imgs{display:flex;align-items:flex-start;width:100%;margin-top:5px}.scale_mask .moment_item_content .imgs img{flex:1;width:1px;display:block}canvas{position:absolute;top:-1000px;left:-1000px}@keyframes fadeIn{0%{opacity:0;transform:translateY(50%)}100%{opacity:1;transform:translateX(0)}}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["a"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
    var nonce =  true ? __webpack_require__.nc : undefined;

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(1);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./app.scss
var cjs_js_app = __webpack_require__(0);

// CONCATENATED MODULE: ./app.scss

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(cjs_js_app["a" /* default */], options);



/* harmony default export */ var app = (cjs_js_app["a" /* default */].locals || {});
// CONCATENATED MODULE: ./vup.js
const list = ["2501","39079","49622","61628","64441","67073","75637","79951","80291","99625","101879","138810","156843","173620","174302","178519","179922","207893","242902","243278","251750","261980","262370","265135","266472","273722","279106","280240","285016","299237","316003","316137","344258","369511","386001","419241","421952","426155","445338","462905","472630","484377","499076","512199","512442","514036","522780","526959","576696","605382","638405","652096","689701","706294","707565","712387","718185","733361","782258","797929","824281","846184","880716","922344","957980","983982","1005951","1020536","1040569","1063303","1070113","1116012","1236468","1308727","1312640","1323824","1327399","1328216","1331099","1405673","1447414","1498831","1545881","1600171","1680133","1744181","1761878","1810191","1851701","1963847","2104512","2196196","2321079","2494933","2531957","2683642","2869300","2940344","2947895","3059076","3123207","3156144","3190933","3206664","3270952","3441115","3445674","3473754","3568347","3676437","3701494","3949794","3952237","3982789","4209327","4240095","4268210","4421655","4425861","4427057","4623706","4640428","4713160","4770973","5981678","6011113","6092018","6114412","6125244","6144047","6204986","6205507","6434730","6851521","6857222","6938956","7005405","7068927","7640267","7721681","7740095","7822884","8144658","8182548","8500263","8864786","8894941","9378772","10028588","10062768","10406618","10644252","10843915","10845128","11143550","11539251","11924774","12042263","12048958","12061153","12152626","12462573","12596236","12645128","12648555","12656144","12671331","12696349","12703493","12743107","12891327","12927207","12961787","12972680","12979991","13030200","13056066","13077732","13103373","13146389","13207859","13300081","13366469","13399372","13449146","13468984","13472531","13515189","13547569","13617066","13642854","13702916","13706346","13707663","13715631","13722552","13747109","13783338","13793169","13793633","13795545","13811362","13847612","13853514","13877450","13885296","13912620","13916606","13918166","13942878","13945614","13970355","13971213","13973820","14025101","14030365","14065748","14073450","14136064","14153109","14203604","14214101","14220349","14220873","14360530","14382890","14398044","14432491","14449482","14455226","14476039","14500422","14503544","14504317","14544483","14547114","14687845","14703606","16203556","16271760","16300936","16559892","16657817","16817638","16986934","17173377","17237147","17237605","17249800","17279032","17303723","17378167","17380058","17439946","17511164","17592669","17601567","17611534","17777390","17809831","17871910","17912421","17943098","18284887","18498272","19022439","19280426","19302348","19349676","19505154","19833055","20157058","20543116","20680343","20806699","21616835","21626450","21654061","21667562","21817554","22188804","22416023","22609988","22728307","22961654","23118761","23203047","23372300","23404298","23411433","23638807","23682490","23715004","23737978","23738302","23984632","24091399","24226108","24307367","24381891","24385423","24732250","24940701","25697436","25956307","26029725","26035486","26055450","26090924","26272642","26374889","26675034","26808800","27894624","28106365","28355416","28741368","29163378","29208479","29652543","29949498","30064507","30117312","30344247","30352828","30440798","30749208","31026983","31050619","31425941","31471170","31476889","31541670","31560283","31782061","31787919","31798936","31811657","31827419","31881099","31904948","31907162","31930322","31954467","31967179","31982818","32016814","32018526","32025022","32050512","32095190","32098395","32123067","32310028","32329413","32441412","32445379","32448048","32450973","32461770","32483115","32495137","32505631","32507478","32513383","32535482","32544069","32619650","32623529","32706742","32720576","32812696","32844838","32877530","32917077","32997322","33023277","33024122","33060288","33070412","33111058","33133627","33147263","33234558","33263923","33314077","33332559","33356650","33380519","33388564","33469096","33523936","33531528","33551100","33551890","33593099","33597715","33624803","33732619","33784964","33836710","33873163","33932583","33937905","34015103","34035144","34127514","34144920","34154121","34184315","34195163","34195269","34210520","34226127","34235815","34255548","34261972","34288617","34289316","34309805","34319955","34320439","34325117","34361842","34390648","34481146","34494791","34611213","34680253","34685871","34743261","34750449","34784062","34785904","34786100","34803400","34806533","34817829","34820096","34878269","34878375","34904237","34905158","34911086","34929048","34932469","34932573","34934622","34934845","34968669","34970155","34972973","34976936","34986165","34986415","35005657","35146763","35147237","35151043","35197611","35208887","35213225","35219723","35225622","35228546","35422484","35700816","35706289","35710019","35716850","35725050","35726054","35764170","35764589","35780221","35821864","35847509","35847915","35863426","35868641","35872396","35889531","35898042","35918491","35924649","35948175","35956434","35961496","35972513","35979929","35980635","35982606","35995690","36034758","36045052","36115445","36117178","36131779","36153370","36158792","36171544","36370282","36387980","36400798","36408049","36408546","36413015","36413243","36419533","36424299","36429189","36439885","36460080","36482438","36488205","36490789","36493618","36511844","36519677","36526086","36526321","36530810","36533090","36544712","36571875","36592924","36609445","36624899","36625184","36626547","36665878","36673311","36694691","36695731","36709032","36782183","36782454","36798374","36806800","36845460","36846901","36853070","36885929","36900616","36916394","36936805","37011530","37103936","37164597","37172648","37181305","37264002","37292235","37296734","37296847","37415648","37416250","37466638","37490524","37522724","37540450","37588673","37606500","37662640","37680298","37690093","37693149","37732838","37787227","37867453","37901408","37942149","37968429","38005774","38068231","38069257","38072216","38085972","38094253","38109076","38148797","38215364","38235502","38270267","38330313","38334354","38368820","38371490","38393515","38406584","38415057","38425919","38429549","38440225","38454640","38457495","38468191","38524129","38651218","38776239","38779094","38950339","38981302","39005968","39054421","39125379","39126357","39136460","39173209","39187982","39253443","39267784","39289326","39312868","39368632","39373823","39385525","39393087","39428395","39430454","39551952","39558805","39625500","39628089","39631779","39633776","39653051","39694959","39696960","39697596","39711139","39796744","39831889","39848630","39854908","39860473","39875419","39876394","39880948","39882119","39915491","39953383","39953766","39979748","39980944","39986224","39997029","40032943","40051909","40056188","40065559","40122916","40211472","40360552","40464274","40474673","40494283","40499733","40533362","40562384","40571726","40573472","40573955","40574173","40602464","40608506","40608768","40615723","40617177","40630616","40656720","40661892","40665835","40666007","40677129","40680744","40682391","40683827","40685184","40687921","40729858","40740702","40785167","40809191","40822571","40825248","40837172","40839180","40877075","40904612","40909393","40909488","40925392","40950588","40968129","40970236","41024018","41032623","41033130","41048695","41052981","41062897","41077579","41077843","41083133","41086280","41086322","41086366","41107216","41115877","41161644","41228182","41230110","41230276","41232665","41233449","41235542","41254970","41268063","41284206","41292453","41306913","41307640","41311840","41339795","41355967","41394262","41408772","41414143","41420265","41477986","41525381","41529501","41531703","41537905","41554062","41556105","41556568","41558948","41565089","41581859","41594889","41618977","41660189","41761941","41910374","41932973","41946823","41955085","41998110","42003875","42012804","42094122","42095104","42255693","42281494","42299712","42413523","42434469","42468942","42551921","42650081","42692747","42703582","42707250","42710720","42834402","42863321","42874761","42878649","42910834","42923970","42934475","43053745","43053781","43056880","43070367","43178707","43250076","43270252","43344923","43361148","43415510","43515737","43615805","43663910","43669332","43807318","43942090","44026597","44060612","44282030","44286323","44615443","44672969","44706688","44753354","45097209","45210487","45339611","45409175","45791278","45903095","46195331","46227215","46233735","46530010","46542537","47304860","47345133"]
/* harmony default export */ var vup = (list);
// CONCATENATED MODULE: ./dev.js



// import vupList from './followList'
// 链接跳转
if (location.href === "https://www.acfun.cn/?dd") {
    location.href = 'https://api-new.app.acfun.cn/'
}
document.title = 'DD日报动态筛选'
// let vupList
// fetch('https://47.93.56.184:8081/api/follow_uid', {mode: 'cors'}).then(res => res.json()).then(res => {
//     vupList = res.data
// })
// setTimeout(() => {
//     GM_xmlhttpRequest({
//         method: "GET",
//         url: "https://47.93.56.184:8081/api/follow_uid",
//         onload: function (res) {
//             console.log(res)
//             if (res.status == 200) {
//                 var text = res.responseText;
//                 var json = JSON.parse(text);
//                 vupList = json.data
//             }
//         }
//     })
// }, 1000);
const html =
    `<div class="moment_title">DD日报动态筛选</div>
    <canvas width="480" height="300" id="canvas"></canvas>
    <canvas width="480" height="300" id="canvas2"></canvas>
<div class="moment_container" ref="container">
  <div class="moment_top">
    <label>查询日期：<input type="date" v-model="date"/></label> <button @click="search">查询</button> 
    <span>进度：{{percent}}%</span>
    <label>动态<input v-model="showMoment" type="checkbox"/></label>
    <label>视频<input v-model="showVideo" type="checkbox"/></label>
    <label>文章<input v-model="showArticle" type="checkbox"/></label>
    <label>添加特定uid：<input v-model="addUid" type="number"/> <button @click="addUser">添加</button></label>
    <label>*双击动态生成图片</label>
  </div>
  <div class="moment_content" id="box_container" ref="content_container">
    <div class="moment_item" v-for="(item, index) in momentList" 
      :class="{article: item.articleTitle, video: item.videoId, moment: item.moment}" 
      @dblclick="scale($event, index)" :style="{animationDelay: index*0.01 + 's'}"
      v-if="item.moment && showMoment || item.videoId && showVideo || item.articleTitle && showArticle">
      <div class="moment_item_top">
       <img :src="item.user.userHead" class="user_head" v-if="item.user"/> 
       <div class="user_head_middle" v-if="item.user">
         <a :href="'https://www.acfun.cn/u/' + item.user.userId" target="_blank">
           <span>{{item.user.userName}}</span>
           <img src="//cdnfile.aixifan.com/static/common/static/img/icon_avi_big.109431007897fe500a3b.svg" v-if="item.user.verifiedTypes.indexOf(3) !== -1" class="avi_icon"/>
           <img src="//cdnfile.aixifan.com/static/common/static/img/icon_up_big.1fe69d323e2b5015c389.svg" v-if="item.user.verifiedTypes.indexOf(5) !== -1" class="avi_icon" />
           <img src="//cdnfile.aixifan.com/static/common/static/img/icon_v_big.6b14f321c918a291cc8d.svg" v-if="item.user.verifiedTypes.indexOf(2) !== -1" class="avi_icon" />
         </a>
         <div class="moment_item_time">{{item.createTime | filterTime}}</div>
       </div>   
      </div>
      <div class="moment_item_content" v-if="item.moment">
        <p v-html="item.moment.text"></p>
        <div class="imgs" v-if="item.moment.imgs">
          <img :src="img.originUrl" v-for="img in item.moment.imgs"/>
        </div>
        <div class="moment_include" v-if="item.repostSource">
          <div class="moment_item_top" v-if="item.repostSource.user">
            <img :src="item.repostSource.user.userHead" class="user_head" /> 
            <div class="user_head_middle" >
              <a :href="'https://www.acfun.cn/u/' + item.repostSource.user.userId" target="_blank">
                <span>{{item.repostSource.user.userName}}</span>
                <img src="//cdnfile.aixifan.com/static/common/static/img/icon_avi_big.109431007897fe500a3b.svg" v-if="item.repostSource.user.verifiedTypes.indexOf(3) !== -1" class="avi_icon"/>
                <img src="//cdnfile.aixifan.com/static/common/static/img/icon_up_big.1fe69d323e2b5015c389.svg" v-if="item.repostSource.user.verifiedTypes.indexOf(5) !== -1" class="avi_icon" />
                <img src="//cdnfile.aixifan.com/static/common/static/img/icon_v_big.6b14f321c918a291cc8d.svg" v-if="item.repostSource.user.verifiedTypes.indexOf(2) !== -1" class="avi_icon" />
              </a>
            <div class="moment_item_time">{{item.repostSource.createTime | filterTime}}</div>
          </div>   
        </div>
          <div class="moment_item_content" v-if="item.repostSource.moment">
            <p v-html="item.repostSource.moment.text"></p>
            <div class="imgs" v-if="item.repostSource.moment.imgs">
              <img :src="img.originUrl" v-for="img in item.repostSource.moment.imgs" />
            </div>
            <a :href="item.repostSource.shareUrl" target="_blank" class="check_link" style="font-size:10px;" @mouseenter="showQrcode" @mouseleave="hideQrcode">查看原动态</a>
          </div>
          <div class="moment_item_video"  v-if="item.repostSource.videoId">
            <h3 style="text-align:center;" >
            <a class="moment_video" target="_blank" :href="'https://www.acfun.cn/v/ac'+item.repostSource.resourceId">{{item.repostSource.caption}}</a></h3>
            <img :src="item.repostSource.coverUrl" style="marin: 0 auto; display: block; wdith: 300px;"/>
          </div>
          <div class="monent_item_article" v-if="item.repostSource.articleTitle">
           <h3 style="text-align:center;"><a :href="'https://www.acfun.cn/a/ac' + item.repostSource.resourceId" target="_blank">{{item.repostSource.articleTitle}}</a></h3>
           <p>{{item.repostSource.beginParagraph}}</p>
           <a :href="'https://www.acfun.cn/a/ac' + item.repostSource.resourceId" target="_blank" class="check_link">查看原文章</a>
          </div>
        </div>
        <a :href="item.shareUrl" target="_blank" class="check_link" style="font-size:10px;" @mouseenter="showQrcode" @mouseleave="hideQrcode">查看原动态</a>
      </div>
      <div class="moment_item_video"  v-if="item.videoId">
       <h3 style="text-align:center;"><a :href="'https://www.acfun.cn/u/' + item.user.userId" target="_blank">{{item.user.userName}}：</a>
        <a class="moment_video" target="_blank" :href="'https://www.acfun.cn/v/ac'+item.resourceId">{{item.caption}}</a></h3>
        <img :src="item.coverUrl" style="marin: 0 auto; display: block; wdith: 300px;" @load="replaceImg"/>
      </div>
      <div class="monent_item_article" v-if="item.articleTitle">
       <h3 style="text-align:center;"><a :href="'https://www.acfun.cn/a/ac' + item.resourceId" target="_blank">{{item.articleTitle}}</a></h3>
       <p>{{item.beginParagraph}}</p>
       <a :href="'https://www.acfun.cn/a/ac' + item.resourceId" target="_blank" class="check_link">查看原文章</a>
      </div>
    </div>
    <div class="qrcode_container" :style="{left: qrleft +'px', top: qrtop + 'px'}" v-show="isShowQr">
     <p>使用手机QQ扫描</p>
     <div ref="qr"></div>
    </div>
  </div>  
</div>
<div class="scale_mask" @click.self="isShowScale=false" v-show="isShowScale">
  <div class="scale_container">
   <div class="scale_content">
     <img  class="scale_img" ref="copyImg"/>
   </div>
  </div>
  
</div>
`
function padZero(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return num
    }
}
function getElementPagePosition(element) {
    //计算x坐标
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    //计算y坐标
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += (current.offsetTop + current.clientTop);
        current = current.offsetParent;
    }
    //返回结果
    return { x: actualLeft, y: actualTop }
}

function sortTime(a, b) {
    return b.createTime - a.createTime
}
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI)
    ctx.lineTo(x + width, y + height - radius)
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI)
    ctx.lineTo(x + radius, y + height)
    ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
    ctx.lineTo(x, y + radius)
    ctx.arc(x + radius, y + radius, radius, 1 * Math.PI, 1.5 * Math.PI)
}

window.onload = () => {
    const newNode = document.createElement('div')
    newNode.id = 'moment_mask'
    newNode.innerHTML = html
    document.body.append(newNode)
    new Vue({
        el: '#moment_mask',
        data() {
            return {
                date: null,
                momentList: [],
                qrleft: 0,
                qrtop: 0,
                isShowQr: false,
                qrcode: null,
                isShowScale: false,
                percent: 0,
                msnry: null,
                showMoment: true,
                showVideo: true,
                showArticle: true,
                context: null,
                copied: false,
                canvasH: 0,
                imgData: null,
                addUid: null
            }
        },
        filters: {
            filterTime(val) {
                const date = new Date(val)
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`
            }
        },
        methods: {
            search() {
                if (!this.date) {
                    alert('先选择日期')
                    return
                }
                this.momentList = []
                this.getUserMonentList()
            },
            showQrcode(e) {
                const pos = getElementPagePosition(e.target)
                const url = e.target.getAttribute('href')
                if (this.qrcode) {
                    this.qrcode.clear()
                    this.qrcode.makeCode(url)
                } else {
                    this.qrcode = new QRCode(this.$refs.qr, {
                        text: url,
                        width: 140,
                        height: 140
                    })
                }
                this.qrleft = pos.x - this.$refs.container.offsetLeft
                this.qrtop = pos.y - this.$refs.container.offsetTop
                this.isShowQr = true
            },
            hideQrcode() {
                this.isShowQr = false
            },
            replaceImg(e) {
                var img = e.target
                // canvas元素, 图片元素
                if (img.getAttribute('replace')) {
                    return
                }
                img.setAttribute('replace', true)
                img.setAttribute("crossOrigin", 'Anonymous')
                var image = new Image()

                var draw = function (obj) {
                    var canvas = document.querySelector('#canvas'),
                        canvas2 = document.querySelector('#canvas2')
                    var context = canvas.getContext('2d'),
                        context2 = canvas2.getContext('2d')
                    context.clearRect(0, 0, 480, 300)
                    context2.clearRect(0, 0, 480, 300)
                    context.drawImage(obj, 0, 0, obj.width, obj.height, 0, 0, 480, 300)
                    drawRoundedRect(context2, 0, 0, 480, 300, 10);
                    // 画布裁切
                    context2.clip()
                    context2.drawImage(canvas, 0, 0, 480, 300)

                    img.setAttribute('src', canvas2.toDataURL("image/png"))
                }
                image.src = img.getAttribute('src')
                image.setAttribute("crossOrigin", 'Anonymous')
                image.onload = function () {

                    draw(this)
                }
            },
            scale(e, index) {
                this.imgData = null
                let current = e.target
                while (!current.classList.contains('moment_item')) {
                    current = current.parentNode
                }
                console.log(this.momentList[index])
                const _left = current.style.left
                const _top = current.style.top
                current.style.left = 0
                current.style.top = 0
                let linkNodes = current.querySelectorAll('.check_link')
                for(let node of linkNodes) {
                    node.style.display = 'none'
                }
                domtoimage.toPng(current, {
                    quality: 1, style: { transform: 'scale(2)', transformOrigin: '0% 0%', left: 0, top: 0 },
                    width: Math.floor(current.offsetWidth * 2), height: Math.floor(current.offsetHeight * 2)
                })
                    .then((dataUrl) => {
                        this.$refs.copyImg.src = dataUrl
                        this.isShowScale = true
                        setTimeout(() => {
                            current.style.left = _left
                            current.style.top = _top
                            for(let node of linkNodes) {
                                node.style.display = 'block'
                            }
                        }, 500)
                        // var selection = window.getSelection()
                        // var range = document.createRange()
                        // var node = this.$refs.copyImg
                        // range.selectNode(node)
                        // selection.removeAllRanges()
                        // selection.addRange(range)
                        // target.classList.add('copied')
                        // setTimeout(() => {
                        //     target.classList.remove('copied')
                        // }, 1500)
                    })

            },
            copy(e) {
                // html2canvas(document.querySelector('.scale_content'), {
                //     scale: 1.8
                // }).then(canvas => {
                //     this.$refs.copy_board.appendChild(canvas)
                //     var selection = window.getSelection()
                //     var range = document.createRange()
                //     range.selectNode(this.$refs.copy_board)
                //     selection.removeAllRanges()
                //     selection.addRange(range)
                //     this.copied = true
                //     setTimeout(()=>{
                //         this.copied = false
                //     },1500)
                // })
                const target = e.target
                domtoimage.toPng(this.$refs.scaleEl, {
                    quality: 1, style: { transform: 'scale(1.8)', transformOrigin: '0% 0%' },
                    width: Math.floor(this.$refs.scaleEl.offsetWidth * 1.8), height: Math.floor(this.$refs.scaleEl.offsetHeight * 1.8)
                })
                    .then((dataUrl) => {
                        this.imgData = dataUrl
                        // var selection = window.getSelection()
                        // var range = document.createRange()
                        // var node = this.$refs.copyImg
                        // range.selectNode(node)
                        // selection.removeAllRanges()
                        // selection.addRange(range)
                        // target.classList.add('copied')
                        // setTimeout(() => {
                        //     target.classList.remove('copied')
                        // }, 1500)
                    })
            },
            dealText(text) {
                text = text.replace(/\[at uid=[0-9*]+\]@/g, "@")
                text = text.replace(/\[\/at\]/g, "")
                text = text.replace(/\[img=图片\]/g, "<img class='ac_moji' src='")
                text = text.replace(/\[\/img\]/g, "' />")
                return text
            },
            addContentByUid(uid) {
                const timeOffset = new Date().getTimezoneOffset()
                const startTime = new Date(this.date).getTime() + timeOffset * 60000
                const endTime = startTime + 3600 * 24 * 1000
                let momentList = []
                fetch(
                    `https://api-new.app.acfun.cn/rest/app/feed/profile?pcursor=0&userId=${uid}&count=50`,
                    {
                        headers: {
                            acplatform: 'ANDROID_PHONE',
                            appversion: '6.38.1.1094'
                        }
                    }).then(res => res.json()).then(res => {
                        let hasContent = false
                        for (let item of res.feedList) {
                            if (item.createTime >= startTime && item.createTime <= endTime) {
                                if (item.moment) {
                                    let text = item.moment.text
                                    item.moment.text = this.dealText(text)
                                    if (item.repostSource && item.repostSource.moment) {
                                        let itemText = item.repostSource.moment.text
                                        item.repostSource.moment.text = this.dealText(itemText)
                                    }
                                }
                                this.momentList.unshift(item)
                                hasContent = true
                            }
                        }
                        if (!hasContent) {
                            alert('此用户当日无动态')
                        } else {
                            setTimeout(() => {
                                this.msnry = new Masonry(this.$refs.content_container, {
                                    itemSelector: '.moment_item',
                                    columnWidth: 420
                                })
                            }, 1000)
                        }

                    })
            },
            addUser() {
                if (!this.date) {
                    alert('请先选择日期')
                    return
                }
                if (!this.addUid) {
                    alert('请添加uid')
                    return
                }
                this.addContentByUid(this.addUid)
            },
            async getUserMonentList() {
                const timeOffset = new Date().getTimezoneOffset()
                const startTime = new Date(this.date).getTime() + timeOffset * 60000
                const endTime = startTime + 3600 * 24 * 1000
                console.log(`startTime: ${startTime} - endTime: ${endTime}`)
                let promiseList = []
                let momentList = []
                let process = 0
                let processLength = vup.length
                this.percent = 0
                for (let item of vup) {
                    promiseList.push(
                        fetch(
                            `https://api-new.app.acfun.cn/rest/app/feed/profile?pcursor=0&userId=${item}&count=50`,
                            {
                                headers: {
                                    acplatform: 'ANDROID_PHONE',
                                    appversion: '6.38.1.1094'
                                }
                            }).then(res => {
                                process++
                                this.percent = (process * 100 / processLength).toFixed(1)
                                return res.json()
                            })
                    )
                }
                Promise.all(promiseList).then(resAll => {
                    for (let res of resAll) {
                        let userMomentList = res.feedList
                        for (let child of userMomentList) {
                            if (child.createTime >= startTime && child.createTime <= endTime) {
                                if (child.moment) {
                                    let text = child.moment.text
                                    child.moment.text = this.dealText(text)
                                    if (child.repostSource && child.repostSource.moment) {
                                        let childText = child.repostSource.moment.text
                                        child.repostSource.moment.text = this.dealText(childText)
                                    }
                                }
                                momentList.push(child)
                            }
                        }
                    }
                    momentList.sort(sortTime)
                    this.momentList = momentList
                    console.log(this.momentList)
                    this.$nextTick(() => {
                        let time = momentList.length * 20
                        setTimeout(() => {
                            this.msnry = new Masonry(this.$refs.content_container, {
                                itemSelector: '.moment_item',
                                columnWidth: 420
                            })
                        }, time)
                    })
                })

            }
        }
    })
}

/***/ })
/******/ ]);